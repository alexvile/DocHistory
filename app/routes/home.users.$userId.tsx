import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";
import type { ContactRecord } from "../data";
import { getContact, updateContact } from "../data";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getUserById } from "~/server/user.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  // console.log(11, params.userId);
  invariant(params.userId, "Missing contactId param");
  //    save changes- update norm and create log that smth changed

  //   const formData = await request.formData();
  //   return updateContact(params.contactId, {
  //     favorite: formData.get("favorite") === "true",
  //   });
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // fetch all detail information for norm
  invariant(params.userId, "Missing userId param");
  const populatedUser = await getUserById(params.userId);
  if (!populatedUser) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ populatedUser });
  // invariant(params.contactId, "Missing contactId param");
  // await GetNormByID
  // const contact = await getContact(params.contactId);
  // if (!contact) {
  //     throw new Response("Not Found", { status: 404 });
  //   }
  return null;
};

export default function User() {
  const { populatedUser } = useLoaderData<typeof loader>();
  // console.log(111122, populatedUser);
  const { norms, changes } = populatedUser;

  return (
    <div>
      {/* todo delete parentlayout, use _ */}
      <h3>Created Norms</h3>
      {norms.length ? (
        <ul>
          {norms.map((el) => (
            <li key={el.id}>{el.productName}</li>
          ))}
        </ul>
      ) : <div>No norms created by this user</div>}
      <h3>Last 50 changes</h3>
      {/* the same for changes */}
      {/* {norms.length ? (
        <ul>
          {norms.map((el) => (
            <li key={el.id}>{el.productName}</li>
          ))}
        </ul>
      ) : <div>No norms created by this user</div>} */}
    </div>
  );
}
