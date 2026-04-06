import { ActionFunction, ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { getUserId, requireUserRole } from "~/server/auth.server";
import { createProduct } from "~/server/products.server";
import { useState, lazy, Suspense } from "react";
import { Icon } from "~/components/ui/Icon";
import TextField from "~/components/ui/TextField";
import { validateProductForm } from "~/utils/vanildateNewProduct.server";
import BackControls from "~/components/common/BackControls";

const ExcelUploadContainer = lazy(() => import("~/components/ExcelUploadContainer"));

// todo use _new !!!!
export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);

  const { errors, hasErrors, data } = validateProductForm(raw);

  if (hasErrors) {
    return new Response(JSON.stringify({ errors }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { product } = await createProduct({
      title: data.title,
      norms: data.norms,
      creatorId: userId,
    });

    return new Response(
      JSON.stringify({
        status: "created",
        resource: "product",
        id: product.id,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          Location: `/products/${product.id}`,
        },
      },
    );
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

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);
  console.log(1212, role);
  // return null;
  return null;
};

// todo - back buttons
// todo - create can commiter or ADMIN
// todo - show all norms
// todo - show errors in the frontend ?
// todo - show warning if try to quit
// todo - errors + disabled state
// todo - when try to exit - show warning !!!
// todo - mark inputs with red color

export default function NewProduct() {
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;
  const hasErrors = errors && Object.keys(errors).length > 0;
  const [rows, setRows] = useState<any[] | null>(null);

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
      <Suspense fallback={<div>Завантаження...</div>}>
        <ExcelUploadContainer onChange={setRows} />
      </Suspense>
      <Form method="post">
        <input type="hidden" name="norms" value={rows ? JSON.stringify(rows) : ""} />
        <div className="products-new__top-form">
          <TextField label="Назва" name="title" placeholder="КС-Г(В)-010 СН" minLength={4} isRequired />
          <TextField label="Код" name="code" placeholder="070.00.00.000" />
        </div>
        <div className="products-new__main-form">
          <button
            className="button button--primary"
            aria-label="Збрегети зміни"
            disabled={!rows || rows.length === 0}
            aria-disabled={!rows || rows.length === 0}
            type="submit"
          >
            Зберегти
          </button>
        </div>
      </Form>
    </>
  );
}
