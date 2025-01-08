import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useState, type FunctionComponent } from "react";
import type { ContactRecord } from "../data";
import { getContact, updateContact } from "../data";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getNormById } from "~/server/norms.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.normId, "Missing contactId param");
  console.log(1111, params.normId)
  //    save changes- update norm and create log that smth changed

  //   const formData = await request.formData();
  //   return updateContact(params.contactId, {
  //     favorite: formData.get("favorite") === "true",
  //   });
  return null
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // fetch all detail information for norm
  invariant(params.normId, "Missing userId param");
  const detailedNorm = await getNormById(params.normId);
  if (!detailedNorm) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ detailedNorm });
  // invariant(params.contactId, "Missing contactId param");
  // await GetNormByID
  // const contact = await getContact(params.contactId);
  // if (!contact) {
  //     throw new Response("Not Found", { status: 404 });
  //   }
  return null;
};

export default function Norm() {
  const { detailedNorm } = useLoaderData<typeof loader>();
  // console.log(111122, detailedNorm);
  const [isEditable, setIsEditable] = useState(false);

  //   const { contact } = useLoaderData<typeof loader>();

  // state to edit and save
  return (
    <div>
      {/* <Form key={contact.id} id="contact-form" method="post"></Form> */}
      <button
        type="button"
        onClick={() => setIsEditable((prev) => !prev)}
        className="edit-button"
      >
        {isEditable ? "Cancel" : "Edit"}
      </button>
      <Form method="post">
        <div>
          <label htmlFor="productName">Product name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            disabled={!isEditable}
            defaultValue={detailedNorm.productName}
          />
        </div>

        <div>
          <label htmlFor="norm1">Norm 1</label>
          <input
            type="number"
            id="norm1"
            name="norm1"
            disabled={!isEditable}
            defaultValue={detailedNorm.norm1}
          />
        </div>
        <div>
          <label htmlFor="norm2">Norm 2</label>
          <input
            type="number"
            id="norm2"
            name="norm2"
            disabled={!isEditable}
            defaultValue={detailedNorm.norm2}
          />
        </div>

        <button disabled={!isEditable}>Submit</button>
      </Form>
    </div>
  );
}
