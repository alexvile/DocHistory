import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useActionData, useParams } from "@remix-run/react";
import { getUserId, requireUserRole } from "~/server/auth.server";
import { createProduct } from "~/server/products.server";
import ProductNormsTable from "~/components/ProductNormsTable";
import { useMemo, useState } from "react";
import { filterStringEntries, shortId } from "~/utils/main";
import { useHasHydrated } from "~/utils/hooks";
import { parseFormData } from "~/utils/rowHandlers";
import { Icon } from "~/components/Icon";
import {
  buildDynamicTitleValidators,
  validateFields,
} from "~/utils/validation";
import BackLink from "~/components/BackLink";

type ActionResponse = {
  success: boolean;
  errors: Record<string, string>;
};

// todo use _new !!!!
export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    const res: ActionResponse = {
      success: false,
      errors: { global: "Unauthorized" },
    };
    return Response.json(res, { status: 401 });
  }

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

  if (Object.keys(fieldErrors).length > 0) {
    const res: ActionResponse = { success: false, errors: fieldErrors };
    return Response.json(res, { status: 400 });
  }

  const jsonNorms = parseFormData(rest);

  await createProduct({
    productTitle: main__title,
    code: main__code ?? null,
    norms: jsonNorms,
    creatorId: userId,
  });
  const res: ActionResponse = { success: true, errors: {} };
  return Response.json(res, { status: 201 });
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
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
export default function NewProduct() {
  const data = useActionData();
  console.log("actionData", data);

  const hasHydrated = useHasHydrated();
  const [id] = useState(() => shortId());
  // todo - when try to exit - show warning !!!
  const params = useParams();
  console.log("id", params.productId);

  const initialData = useMemo(() => {
    const data = [
      {
        id: id,
        groupId: id,
        order: 0,
        title: "Основна група",
        type: "group",
      },
      {
        id: `s__${id}`,
        title: "",
        type: "spacing",
        groupId: id,
      },
    ];
    return data;
  }, [id]);

  if (!hasHydrated) {
    return <div>hydrating..</div>; // або скелетон / loader
  }
  return (
    <>
      <div className="products-top-group">
        <BackLink />
        <h3 className="products-new__title">
          Створення нового продукту
          <Icon name="pencil" />
        </h3>
      </div>

      <Form method="post">
        <div className="products-new__top-form">
          <label>
            Назва:
            <input
              type="text"
              name="main__title"
              placeholder="КС-Г(В)-010 СН"
              minLength={4}
              required
            />
          </label>
          <label>
            Код:
            <input type="text" name="main__code" placeholder="070.00.00.000" />
          </label>
        </div>
        <div className="products-new__main-form">
          <ProductNormsTable normRows={initialData} isEditable={true} />
          <button
            className="button button--primary"
            aria-label="Збрегети зміни"
            type="submit"
          >
            Зберегти
          </button>
        </div>
      </Form>
    </>
  );
}
