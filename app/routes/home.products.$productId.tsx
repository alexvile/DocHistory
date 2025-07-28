import { Form, isRouteErrorResponse, useActionData, useLoaderData, useRouteError, useSubmit } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getProductbyId } from "~/server/products.server";
import { getUserId } from "~/server/auth.server";
import ProductNormsTable from "~/components/ProductNormsTable";
import NormsGenerator from "~/utils/normsGenerator";
import { LastChanged } from "~/components/LastChangedTooltip";
import BackLink from "~/components/BackLink";
import { areFormDataEqual } from "~/utils/areFormDataEqual";
import { useFormSnapshotOnVisible } from "~/utils/hooks";
import { diffNorms, filterStringEntries } from "~/utils/main";
import { buildDynamicTitleValidators, validateFields } from "~/utils/validation";
import { parseFormData } from "~/utils/rowHandlers";
import { updateProductAndCreateChange } from "~/server/atomic.server";

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
  // ! tmp solution starts
  invariant(params.productId, "Missing productId param");
  const detailedProduct = await getProductbyId(params.productId);
  const { code, createdAt, id, productTitle, updatedAt, norms: oldNorms } = detailedProduct;
  // ! tmp solution ends

  // todo - use in future data from frontend to prevent extra fetch
  // todo -PREVENT code duplicate !!
  const userId = await getUserId(request);
  if (!userId) {
    const res: ActionResponse = {
      success: false,
      errors: { global: "Unauthorized" },
    };
    return Response.json(res, { status: 401 });
  }
  // todo - check role !!
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);
  const strings = filterStringEntries(raw);
  const { main__title, main__code, ...rest } = strings;

  const dynamicTitleFields = buildDynamicTitleValidators(rest);
  const fieldErrors = validateFields({
    title: {
      value: main__title,
      type: "string",
      required: true,
      minLength: 4,
    },
    code: {
      value: main__code,
      type: "string",
      optional: true,
    },
    ...dynamicTitleFields,
  });

  // todo - update validation
  // if (Object.keys(fieldErrors).length > 0) {
  //   const res: ActionResponse = { success: false, errors: fieldErrors };
  //   console.log(222, res);
  //   return Response.json(res, { status: 400 });
  // }

  const newNorms = parseFormData(rest);
  // console.log(111, main__title, main__code, newNorms);
  const diff = diffNorms(oldNorms, newNorms);
  // extra checking
  if (diff.length === 0) {
    return { updated: false, message: "No changes detected" };
  }

  const response = await updateProductAndCreateChange({ creatorId: userId, productId: params.productId, diff, newNorms });
  const res = { success: true, errors: {}, data: response};
  return Response.json(res, { status: 200 });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
  const detailedProduct = await getProductbyId(params.productId);
  if (!detailedProduct) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  const { code, createdAt, id, productTitle, updatedAt, norms } = detailedProduct;
  const rows = NormsGenerator.createRows(norms);
  return Response.json({ rows, product: { code, createdAt, id, productTitle, updatedAt } }, { status: 200 });
};

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
  const submit = useSubmit();
  const data = useLoaderData<typeof loader>();
  const actData = useActionData();
  console.log("actionData", actData);

  const [isEditable, setIsEditable] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const initialFormSnapshot = useFormSnapshotOnVisible(formRef, isEditable);

  const onEditClick = () => {
    setIsEditable(true);
  };

  const onSaveClick = () => {
    console.log("on save");
    // todo - prevent code duplicate
    if (!formRef.current || !initialFormSnapshot) {
      setIsEditable(false);
      return;
    }

    const current = new FormData(formRef.current);
    const hasChanged = !areFormDataEqual(current, initialFormSnapshot);

    if (!hasChanged) {
      setIsEditable(false);
      return;
    }
    // todo - prevent code duplicate

    // save new file
    // save change instance
    if (formRef.current) {
      console.log("sumbit !!!");
      submit(formRef.current);
    }
  };

  const onCancelClick = () => {
    // todo - prevent code duplicate

    if (!formRef.current || !initialFormSnapshot) {
      setIsEditable(false);
      return;
    }

    const current = new FormData(formRef.current);
    const hasChanged = !areFormDataEqual(current, initialFormSnapshot);

    if (!hasChanged) {
      setIsEditable(false);
      return;
    }
    // todo - prevent code duplicate

    const confirmed = window.confirm("Ви впевнені, що хочете скасувати зміни?");
    if (confirmed) {
      setIsEditable(false);
      formRef.current.reset();
    }
  };

  return (
    <>
      <div className="dashboard-topbar">
        <BackLink />
        <h3 className="product-details__title">
          {data.product.productTitle}
          <LastChanged date={data.product.updatedAt} />
        </h3>
        <div className="edit-button__wrapper">
          {isEditable ? (
            <div className="edit-button__edit-container">
              <button type="button" onClick={onCancelClick} className="button button--secondary">
                Відмінити
              </button>
                 <button type="button" onClick={onSaveClick} className="button button--primary">
                Зберегти
              </button>
            </div>
          ) : (
            <button type="button" onClick={onEditClick} className="button button--primary">
              Змінити
            </button>
          )}
        </div>
      </div>
      <p className="product-details__code">
        <span className="bold">Код: </span>
        {data.product.code}
      </p>
      <div className="products-details__main-form">
        <Form method="post" ref={formRef}>
          <ProductNormsTable normRows={data.rows} isEditable={isEditable} />
        </Form>
      </div>
    </>
  );
}
