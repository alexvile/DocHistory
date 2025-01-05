import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";
import type { ContactRecord } from "../data";
import { getContact, updateContact } from "../data";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
//    save changes- update norm and create log that smth changed




  //   const formData = await request.formData();
  //   return updateContact(params.contactId, {
  //     favorite: formData.get("favorite") === "true",
  //   });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
    // fetch all detail information for norm


  // invariant(params.contactId, "Missing contactId param");
  // await GetNormByID
  // const contact = await getContact(params.contactId);
  // if (!contact) {
  //     throw new Response("Not Found", { status: 404 });
  //   }
  return null;
  return json({ contact });
};

export default function Norm() {
//   const { contact } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3>Norm editing</h3>
      <div>Product name</div>
      <div>Norm 1</div>
      <div>Norm 2</div>
    </div>
  );
}
