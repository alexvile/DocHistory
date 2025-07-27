import { Form, isRouteErrorResponse, useActionData, useLoaderData, useRouteError, useSubmit } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import NormsGenerator from "~/utils/normsGenerator";
import { LastChanged } from "~/components/LastChangedTooltip";
import BackLink from "~/components/BackLink";
import { getChangebyId } from "~/server/changes.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.changeId, "Missing productId param");
  const change = await getChangebyId(params.changeId);
  if (!change) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  return Response.json(change, { status: 200 });
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <p>Зміну не знайдено (404)</p>;
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

export default function ChangeItem() {
  const data = useLoaderData<typeof loader>();
  console.log(11, data);
  return (
    <>
      <div className="products-top-group">
        <BackLink />
        <h3 className="product-details__title">
          назва
        </h3>
      </div>
    </>
  );
}
