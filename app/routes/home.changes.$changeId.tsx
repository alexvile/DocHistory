import { isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import BackLink from "~/components/BackLink";
import { getChangebyId } from "~/server/changes.server";
import ChangeList from "~/components/ChangeList";
import { formatDateForUA } from "~/utils/formatDateUA";

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
  const change = useLoaderData<typeof loader>();
  return (
    <>
      <div className="dashboard-topbar">
        <BackLink />
        <h3 className="change__page-title">Продукт: {change?.product?.productTitle}</h3>
      </div>
      <p className="change__meta change-meta">
        Змінено: <time dateTime={change?.createdAt}>{formatDateForUA(change?.createdAt)}</time>
        <span aria-hidden="true" className="change-meta__divider">|</span>
        Виконавець:{" "}
        <span className="author">
          {change?.creator?.firstName} {change?.creator?.lastName}
        </span>
      </p>
      <div>
        <ChangeList diff={change?.diff} />
      </div>
    </>
  );
}
