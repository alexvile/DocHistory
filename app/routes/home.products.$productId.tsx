import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getProductbyId } from "~/server/products.server";
import { getUserId } from "~/server/auth.server";
import ProductNormsTable from "~/components/ProductNormsTable";
import NormsGenerator from "~/utils/normsGenerator";
import { LastChanged } from "~/components/LastChangedTooltip";
import BackLink from "~/components/BackLink";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.productId, "Missing contactId param");
  const userIdFromSession = await getUserId(request);

  // todo - use in future data from frontend to prevent ettra fetch

  //   const detailedNorm = await getNormById(params.productId);
  //   if (!detailedNorm) {
  //     throw new Response("Not Found", { status: 404 });
  //   }
  //   // console.log(2342, detailedNorm);
  //   const currentObject = {
  //     productName: detailedNorm.productName,
  //     norm1: detailedNorm.norm1,
  //     norm2: detailedNorm.norm2,
  //   };

  //   const formData = await request.formData();
  //   // const firstName = formData.get("first");
  //   // const lastName = formData.get("last");
  //   const updates = Object.fromEntries(formData);
  //   const updates2 = {
  //     productName: updates.productName,
  //     norm1: Number(updates.norm1),
  //     norm2: Number(updates.norm2),
  //   }

  //   // console.log(1111, updates, params.normId);
  //   // todo check if there are changes !!!!!
  //   const changes = getChanges(currentObject, updates2)
  //   console.log(111122, changes)
  //   if(!changes) return null
  //   const id = params.normId
  //   const res = await updateNormById({id, ...updates2})
  //   // if response ok, then create change
  // const m = await createChange({userId: userIdFromSession, normId: id, changes})
  // // if response ok
  // // error handling
  //   // todo - do we need JSON or fixed struture for changes instance

  return null;
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // fetch all detail information for norm
  invariant(params.productId, "Missing productId param");
  const detailedProduct = await getProductbyId(params.productId);
  if (!detailedProduct) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  const { code, createdAt, id, productTitle, updatedAt, norms } =
    detailedProduct;
  const rows = NormsGenerator.createRows(norms);
  return Response.json(
    { rows, product: { code, createdAt, id, productTitle, updatedAt } },
    { status: 200 }
  );
};
// todo - don't fetch for the same page !!

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <p>Продукт не знайдено (404)</p>;
    }

    return (
      <div>
        <h1>Помилка: {error.status}</h1>
        <p>{error.statusText}</p>
      </div>
    );
  }

  return <p>Щось пішло не так</p>;
}

export default function ProductNorm() {
  const data = useLoaderData<typeof loader>();
  const [isEditable, setIsEditable] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const onEditClick = () => {
    setIsEditable(true);
  };
  const onCancelClick = () => {
    if (!isDirty) {
      setIsEditable(false);
      return;
    }

    const confirmed = window.confirm("Ви впевнені, що хочете скасувати зміни?");
    if (confirmed) {
      setIsEditable(false);
      // нормRows автоматично повернуться через effect
    }
  };

  // state to edit and save
  return (
    <>
      <div className="products-top-group">
        <BackLink />
        <h3 className="product-details__title">
          {data.product.productTitle}
          <LastChanged date={data.product.updatedAt} />
        </h3>
        <div className="edit-button__wrapper">
          {/* todo - warning for discard if rows was added */}
          {isEditable ? (
            <button
              type="button"
              onClick={onCancelClick}
              className="button button--secondary"
            >
              Відмінити
            </button>
          ) : (
            <button
              type="button"
              onClick={onEditClick}
              className="button button--primary"
            >
              Змінити
            </button>
          )}
        </div>
      </div>
      <p className="product-details__code">
        <span className="bold">Код: </span>
        {data.product.code}
      </p>

      <Form method="post">
        <ProductNormsTable normRows={data.rows} isEditable={isEditable} onDirtyChange={setIsDirty} />
      </Form>
    </>
  );
}
