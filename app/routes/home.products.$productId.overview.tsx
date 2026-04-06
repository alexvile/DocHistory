import { lazy, Suspense, useState } from "react";
import { Form, isRouteErrorResponse, Outlet, useActionData, useLoaderData, useRouteError } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getProductWithNormsById } from "~/server/products.server";
import { getUserId, requireUserRole } from "~/server/auth.server";
import NormsTable from "~/components/NormsTable";
import { CanonicalRow } from "~/types";
import { validateProductNorms } from "~/utils/vanildateNewProduct.server";
import { mapProductErrorToResponse } from "~/server/products.http.server";
import { diffNorms, hasChanges } from "~/utils/comparison";
import { createChangeSet } from "~/server/changes.server";

const ExcelUploadContainer = lazy(() => import("~/components/ExcelUploadContainer"));

type ActionResponse = {
  success: boolean;
  errors: Record<string, string>;
};

// todo - to prevent extra request
// 1) do diffCHange at frontend
// 2) save frontentd in json and then send it to backend
// 3) make extra request

export const action = async ({ params, request }: ActionFunctionArgs) => {
  // invariant(params.productId, "Missing contactId param");
  // const userIdFromSession = await getUserId(request);

  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const raw = Object.fromEntries(formData);

  const { errors, hasErrors, data } = validateProductNorms(raw);

  if (hasErrors) {
    return new Response(JSON.stringify({ errors }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const newNorms = data.norms;

  // get current Product with norms
  invariant(params.productId, "Missing productId param");
  let response;
  try {
    const productWithNorms = await getProductWithNormsById(params.productId);
    response = productWithNorms;
  } catch (error) {
    mapProductErrorToResponse(error);
  }
  const currentSnapshot = response.currentSnapshot;

  const diff = diffNorms(currentSnapshot.rows, newNorms);

  if (!hasChanges(diff)) {
    console.log("no changes");
    return new Response(JSON.stringify({ message: "No changes detected" }), {
      status: 409,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  console.log("diff", diff);

  await createChangeSet({
    productId: params.productId,
    createdById: userId,
    oldSnapshotId: currentSnapshot.id,
    newRows: newNorms,
    diff,
  });

  return new Response(JSON.stringify({ status: "change_created" }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
  // const userId = await getUserId(request);
  // if (!userId) {
  //   const res: ActionResponse = {
  //     success: false,
  //     errors: { global: "Unauthorized" },
  //   };
  //   return Response.json(res, { status: 401 });
  // }
  // todo - check role !!

  return null;
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
  const role = await requireUserRole(request);
  try {
    const { product, currentSnapshot } = await getProductWithNormsById(params.productId);
    return {
      product,
      norms: currentSnapshot.rows,
      role,
    };
  } catch (error) {
    mapProductErrorToResponse(error);
  }
};

export function ErrorBoundary() {
  const error = useRouteError();
  // 🔹 HTTP errors (throw Response)
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return (
          <div>
            <h1>Продукт не знайдено</h1>
            <p>Запитуваний продукт не існує.</p>
          </div>
        );

      case 409:
        return (
          <div>
            <h1>Некоректний стан продукту</h1>
            <p>Для цього продукту немає активних норм.</p>
          </div>
        );

      default:
        return (
          <div>
            <h1>{error.status}</h1>
            <p>{error.statusText}</p>
          </div>
        );
    }
  }

  // 🔥 Unexpected JS / runtime errors
  if (error instanceof Error) {
    return (
      <div>
        <h1>Щось пішло не так...</h1>
        <pre>{error.message}</pre>
      </div>
    );
  }

  // ❓ Fallback (дуже рідко)
  return <h1>Unknown error</h1>;
}

export default function ProductNorm() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  console.log("actionData", actionData);

  const [rows, setRows] = useState<any[] | null>(null);

  const [isEditable, setIsEditable] = useState(false);
  const [comparison, setComparison] = useState(false);

  // todo - move to tsx if no need extend
  const enableEdit = () => {
    setIsEditable(true);
  };

  const toggleComparison = () => {
    setComparison((prev) => !prev);
  };

  const discardChanges = () => {
    // TODO: confirm discard / clear child
    setRows(null);
    setIsEditable(false);
  };

  // todo - compare table - (ExcelUploadContainer with separate preview element) - current - new version
  // todo - recently uploda check
  // todo - changes show - edit
  // todo - check if not the same (can use hash or checking by keys)

  return (
    <>
      {loaderData.role === "COMMITTER" && (
        <div className="edit-button__wrapper">
          {isEditable ? (
            <>
              <button type="button" className="button button--secondary" onClick={discardChanges}>
                Відмінити
              </button>
              <Form method="post">
                <input type="hidden" name="norms" value={rows ? JSON.stringify(rows) : ""} />

                <button
                  className="button button--primary"
                  aria-label="Збрегети зміни"
                  disabled={!rows || rows.length === 0}
                  aria-disabled={!rows || rows.length === 0}
                  type="submit"
                >
                  Зберегти
                </button>
              </Form>
            </>
          ) : (
            <button type="button" onClick={enableEdit} className="button button--primary">
              Змінити
            </button>
          )}
        </div>
      )}
      {actionData?.message && <div className="alert alert-warning">{actionData.message}</div>}

      {loaderData.product.code && (
        <p className="product-details__code">
          <span className="bold">Код: </span>
          {loaderData.product.code}
        </p>
      )}
      <Suspense fallback={<div>Завантаження...</div>}>{isEditable && <ExcelUploadContainer onChange={setRows} preview={false} />}</Suspense>
      <div className="products-details__main-form">
        {rows && (
          <button type="button" onClick={toggleComparison}>
            Порівняти
          </button>
        )}
        <div className={`columns ${comparison ? "columns--side-by-side" : ""}`}>
          {rows && (
            <div>
              {!comparison && <p>Перевірте правильність сформованих даних</p>}
              <NormsTable normsJson={rows} />{" "}
            </div>
          )}

          <NormsTable normsJson={loaderData.norms as CanonicalRow[]} />
        </div>
      </div>
      <Outlet />
    </>
  );
}
