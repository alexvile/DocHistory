import invariant from "tiny-invariant";
import { lazy, Suspense, useState } from "react";
import { Form, Outlet, redirect, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getProductWithNormsById } from "~/server/products.server";
import { requireUserId, requireUserRole } from "~/server/auth.server";
import NormsTable from "~/components/NormsTable";
import { CanonicalRow } from "~/types";
import { validateProductNorms } from "~/utils/vanildateNewProduct.server";
import { mapProductErrorToResponse } from "~/server/products.http.server";
import { diffNorms, hasChanges } from "~/utils/comparison";
import { createChangeSet } from "~/server/changes.server";
import clsx from "clsx";
import * as Ariakit from "@ariakit/react";
import Comparison from "~/components/route_based/NormsComparison/Comparison";
import { Icon } from "~/components/ui/Icon";
import RouteError from "~/components/ui/RouteError";
import { throwDevelopmentActionTestError } from "~/server/development-errors.server";

const ExcelUploadContainer = lazy(() => import("~/components/ExcelUploadContainer"));

// todo - to prevent extra request
// 1) do diffCHange at frontend
// 2) save frontentd in json and then send it to backend
// 3) make extra request

export const action = async ({ params, request }: ActionFunctionArgs) => {
  throwDevelopmentActionTestError(request);
  // invariant(params.productId, "Missing contactId param");
  // const userIdFromSession = await getUserId(request);

  const role = await requireUserRole(request);
  if (role !== "COMMITTER") {
    throw new Response("Forbidden: Access denied", { status: 403 });
  }
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const raw = Object.fromEntries(formData);

  const { errors, hasErrors, data } = validateProductNorms(raw);

  if (hasErrors) {
    return new Response(JSON.stringify({ errors }), {
      status: 422,
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

  const { changeSetId } = await createChangeSet({
    productId: params.productId,
    createdById: userId,
    oldSnapshotId: currentSnapshot.id,
    newRows: newNorms,
    diff,
  });

  return redirect(`/home/changes/${changeSetId}`);
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
  return <RouteError />;
}

export default function ProductNorm() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  // console.log("actionData", actionData);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [rows, setRows] = useState<CanonicalRow[] | null>(null);

  const [isEditable, setIsEditable] = useState(false);

  // todo - move to tsx if no need extend
  const enableEdit = () => {
    setIsEditable(true);
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
  // todo - compare - show 2 tables in modal and mark changes in norms!

  const dialog = Ariakit.useDialogStore();
  return (
    <>
      {loaderData.role === "COMMITTER" && (
        <div className="flex justify-between mb-8">
          <Suspense fallback={<div className="excelUploaderSkeleton" />}>
            {isEditable && <ExcelUploadContainer onChange={setRows} preview={false} />}
          </Suspense>

          <div className="flex items-start gap-8" style={{ marginInlineStart: "auto" }}>
            {isEditable ? (
              <>
                <button
                  type="button"
                  disabled={isSubmitting}
                  className={clsx("button button--secondary", isSubmitting && "is-loading")}
                  onClick={discardChanges}
                >
                  Відмінити
                </button>
                <Form method="post">
                  <input type="hidden" name="norms" value={rows ? JSON.stringify(rows) : ""} />

                  <button
                    className={clsx("button button--primary", isSubmitting && "is-loading")}
                    aria-label="Збрегети зміни"
                    disabled={!rows || rows.length === 0 || isSubmitting}
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
        </div>
      )}
      {actionData?.message && <div className="alert alert-warning">{actionData.message}</div>}
      {actionData?.errors && (
        <div className="form-errors">
          <p className="form-errors__title">Будь ласка, виправте помилки:</p>
          <ul className="form-errors__list">
            {Object.values(actionData.errors).map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="products-details__main-form">
        <div className="columns">
          {rows && (
            <>
              <div>
                <div className="flex items-center justify-between my-8">
                    <p className="margin-0 bold">Перевірте правильність сформованих даних</p>
                    <div>
                      <button type="button" className="button button--secondary" onClick={dialog.show}>
                        Порівняти
                      </button>
                      <Ariakit.Dialog store={dialog} backdrop={<div className="backdrop" />} className="dialog dialog--comparison">
                        <div className="flex justify-between">
                          <Ariakit.DialogHeading className="heading">Порівняння норм</Ariakit.DialogHeading>
                          <Ariakit.DialogDismiss className="button button--icon">
                            <Icon name="close" />
                          </Ariakit.DialogDismiss>
                        </div>
                        {/* todo - fix ts */}
                        <Comparison currentNorms={loaderData.norms as CanonicalRow[]} newNorms={rows as CanonicalRow[]} />
                      </Ariakit.Dialog>
                    </div>
                </div>
                <p className="margin-0 mb-8 bold">Нові дані</p>
                <NormsTable normsJson={rows} />{" "}
              </div>
              <hr className="full-width" />
            </>
          )}
          {rows && <p className="margin-0 mb-8 bold">Поточні дані</p>}
          <NormsTable normsJson={loaderData.norms as CanonicalRow[]} />
        </div>
      </div>
      <Outlet />
    </>
  );
}
