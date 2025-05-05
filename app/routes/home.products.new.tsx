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
import { shortId } from "~/utils/main";
import { useHasHydrated } from "~/utils/hooks";
import { parseFormData } from "~/utils/rowHandlers";

// todo use _new !!!!
export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  console.log("action");
  const userId = await getUserId(request);
  if (!userId) return;

  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log(11, updates);

  // validation
 


  const kkk = parseFormData(updates);
  console.dir(kkk, { depth: true });
  return kkk

  const { productName, norm1, norm2 } = data;

  // todo - handling if creation was with errors
  await createNorm({
    productName,
    norm1: Number(norm1),
    norm2: Number(norm2),
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
  console.log('actionData', data)

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
        title: "title",
      },
    ];
    return data;
  }, [id]);

  if (!hasHydrated) {
    return <div>hydrating..</div>; // або скелетон / loader
  }
  return (
    <>
      <h3>Створення нового продукту</h3>
      <>
        <h4>{title} +++</h4>
        <div>
          <Form method="post">
            <ProductNormsTable norms={initialData} isEditable={true} />
            <button type="submit">submit</button>
          </Form>
        </div>
      </>
    </>
  );
}
