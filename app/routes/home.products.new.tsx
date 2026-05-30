import { ActionFunction, ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { requireUserId, requireUserRole } from "~/server/auth.server";
import { createProduct } from "~/server/products.server";
import { lazy, Suspense, useState } from "react";
import { Icon } from "~/components/ui/Icon";
import TextField from "~/components/ui/TextField";
import { validateProductForm } from "~/utils/vanildateNewProduct.server";
import BackControls from "~/components/common/BackControls";
import clsx from "clsx";
import { CanonicalRow } from "~/types";
import RouteError from "~/components/ui/RouteError";
import { throwDevelopmentActionTestError } from "~/server/development-errors.server";

const ExcelUploadContainer = lazy(() => import("~/components/ExcelUploadContainer"));

// todo use _new !!!!
export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  throwDevelopmentActionTestError(request);
  const role = await requireUserRole(request);
  if (role !== "COMMITTER") {
    throw new Response("Forbidden: Access denied", { status: 403 });
  }
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);

  const { errors, hasErrors, data } = validateProductForm(raw);

  if (hasErrors) {
    return new Response(JSON.stringify({ errors }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await createProduct({
      title: data.title,
      code: data.code,
      norms: data.norms,
      creatorId: userId,
    });

    return redirect("/home/products");
  } catch (error) {
    console.error("Create product failed", error);

    throw new Response(
      JSON.stringify({
        status: "error",
        message: "Failed to create product",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
// todo - if no changes --- it can be removed

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);
  if (role !== "COMMITTER") {
    throw new Response("Forbidden: Access denied", { status: 403 });
  }
  return null;
};

export function ErrorBoundary() {
  return <RouteError />;
}

// todo - create can commiter or ADMIN
// todo - show errors in the frontend ?
// todo - show warning if try to quit
// todo - errors + disabled state
// todo - when try to exit - show warning !!!
// todo - mark inputs with red color
// todo - loaders and blockers to change actions!

export default function NewProduct() {
  const actionData = useActionData() as { errors?: Record<string, string> } | undefined;
  const errors = actionData?.errors;
  const hasErrors = errors && Object.keys(errors).length > 0;
  const [rows, setRows] = useState<CanonicalRow[] | null>(null);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isSaveDisabled = !rows || rows.length === 0 || isSubmitting;

  return (
    <>
      <div className="dashboard-topbar">
        <BackControls />
        <div className="flex gap-8">
          <h3 className="margin-0 ">Створення нового продукту</h3>
          <Icon name="pencil" />
        </div>
      </div>

      {hasErrors && (
        <div className="form-errors">
          <p className="form-errors__title">Будь ласка, виправте помилки:</p>

          <ul className="form-errors__list">
            {Object.values(errors).map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      <Form method="post" className="flex justify-between items-start mb-16">
        <input type="hidden" name="norms" value={rows ? JSON.stringify(rows) : ""} />
        <div className="products-new__top-form">
          <TextField label="Назва" name="title" placeholder="КС-Г(В)-010 СН" minLength={4} isRequired />
          <TextField label="Код" name="code" placeholder="070.00.00.000" />
        </div>
        <button
          className={clsx("button button--primary", isSubmitting && "is-loading")}
          aria-label="Збрегети зміни"
          disabled={isSaveDisabled}
          aria-disabled={isSaveDisabled}
          type="submit"
        >
          Зберегти
        </button>
      </Form>

      <Suspense fallback={<div className="excelUploaderSkeleton" />}>
        <ExcelUploadContainer onChange={setRows} />
      </Suspense>
    </>
  );
}
