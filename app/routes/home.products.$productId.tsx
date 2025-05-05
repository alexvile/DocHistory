import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useState, type FunctionComponent } from "react";
import type { ContactRecord } from "../data";
import { getContact, updateContact } from "../data";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getNormById, updateNormById } from "~/server/products.server";
import { getChanges } from "~/server/getChanges.server";
import { createChange } from "~/server/changes.server";
import { getUserId } from "~/server/auth.server";
import {testNorms} from "~/test"
import { ProductWithNorms } from "~/types";
import ProductNormsTable from "~/components/ProductNormsTable";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.productId, "Missing contactId param");
    const userIdFromSession = await getUserId(request);

  // todo - use in future data from frontend to prevent ettra fetch

  const detailedNorm = await getNormById(params.productId);
  if (!detailedNorm) {
    throw new Response("Not Found", { status: 404 });
  }
  // console.log(2342, detailedNorm);
  const currentObject = {
    productName: detailedNorm.productName,
    norm1: detailedNorm.norm1,
    norm2: detailedNorm.norm2,
  };

  const formData = await request.formData();
  // const firstName = formData.get("first");
  // const lastName = formData.get("last");
  const updates = Object.fromEntries(formData);
  const updates2 = {
    productName: updates.productName,
    norm1: Number(updates.norm1),
    norm2: Number(updates.norm2),
  }

  // console.log(1111, updates, params.normId);
  // todo check if there are changes !!!!!
  const changes = getChanges(currentObject, updates2)
  console.log(111122, changes)
  if(!changes) return null
  const id = params.normId
  const res = await updateNormById({id, ...updates2})
  // if response ok, then create change
const m = await createChange({userId: userIdFromSession, normId: id, changes})
// if response ok 
// error handling
  // todo - do we need JSON or fixed struture for changes instance


  
  return null;
};



export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // fetch all detail information for norm
  // invariant(params.normId, "Missing userId param");
  // const detailedNorm = await getNormById(params.normId);
  // if (!detailedNorm) {
  //   throw new Response("Not Found", { status: 404 });
  // }
  // return json({ detailedNorm });
  // invariant(params.contactId, "Missing contactId param");
  // await GetNormByID
  // const contact = await getContact(params.contactId);
  // if (!contact) {
  //     throw new Response("Not Found", { status: 404 });
  //   }
  return null;
};

export default function ProductNorm() {
const productNorm = testNorms as unknown as ProductWithNorms;

  // const { detailedNorm } = useLoaderData<typeof loader>();
  // console.log(111122, detailedNorm);
  const [isEditable, setIsEditable] = useState(true);

  //   const { contact } = useLoaderData<typeof loader>();

  // state to edit and save
  return (
    <div>
      Norm details
      {/* <Form key={contact.id} id="contact-form" method="post"></Form> */}
      <button
        type="button"
        onClick={() => setIsEditable((prev) => !prev)}
        className="edit-button"
      >
        {isEditable ? "Cancel" : "Edit"}
      </button>
      <Form method="post">
        <ProductNormsTable norms={productNorm} isEditable={isEditable}/>
      </Form>
      {/* <Form method="post">
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
      </Form> */}
    </div>
  );
}


