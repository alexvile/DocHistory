import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import UsersList from "~/components/UsersList";
import { getUserId, requireUserRole } from "~/server/auth.server";
import { getFilteredUsers } from "~/server/user.server";
import type { User, Prisma } from "@prisma/client";
import { createNorm } from "~/server/products.server";
import ProductNormsTableNew from "~/components/ProductNormsTableNew";
import ProductNormsTable from "~/components/ProductNormsTable";
import { useEffect, useMemo, useState } from "react";
import { useModal } from "~/components/ModalProvider";
import { filterStringEntries, shortId } from "~/utils/main";
import { useHasHydrated } from "~/utils/hooks";
import { parseFormData } from "~/utils/rowHandlers";
import { Icon } from "~/components/Icon";
import { validateMainFields } from "~/server/validators.server";

// todo use _new !!!!
export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) return;

  const formData = await request.formData();
  const raw = Object.fromEntries(formData);
  const { main__title, main__code, ...rest } = raw;
  const { title, code } = validateMainFields(main__title, main__code);
  const safeObject = filterStringEntries(rest);
  const jsonNorms = parseFormData(safeObject);
  
  // todo - handling if creation was with errors
  return null
  await createNorm({
    productTitle: title,
    code: code ?? null,
    norms: jsonNorms,
    creatorId: userId,
  });
  return null;
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);
  console.log(1212, role);
  // return null;
  return null;
};

// todo - create can commiter or ADMIN
// todo - show all norms
export default function NewProduct() {
  const data = useActionData();
  console.log("actionData", data);

  const hasHydrated = useHasHydrated();
  const [title, setTitle] = useState("Новий котел");
  const [isEditable, setIsEditable] = useState(true);
  const [id] = useState(() => shortId());
  // todo - when try to exit - show warning !!!

  const initialData = useMemo(() => {
    const data = [
      {
        order: 0,
        id: id,
        type: "group",
        title: "Основна група",
      },
    ];
    return data;
  }, [id]);

  if (!hasHydrated) {
    return <div>hydrating..</div>; // або скелетон / loader
  }
  return (
    <>
      <h3 className="products-new__title">
        Створення нового продукту &nbsp;
        <Icon name="pencil" />
      </h3>
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
            <input
              type="text"
              name="main__code"
              placeholder="070.00.00.000"
              required
            />
          </label>
        </div>
        <div className="products-new__main-form">
          <ProductNormsTable norms={initialData} isEditable={true} />
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
