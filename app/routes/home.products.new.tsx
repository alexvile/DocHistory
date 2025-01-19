import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import UsersList from "~/components/UsersList";
import { getUserId, requireUserRole } from "~/server/auth.server";
import { getFilteredUsers } from "~/server/user.server";
import type { User, Prisma } from "@prisma/client";
import { createNorm } from "~/server/products.server";

// todo use _new
export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  // validation
  const userId = await getUserId(request);
  if (!userId) return;
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

  // return null;
  return null;
};

// todo - create can commiter or ADMIN
// todo - show all norms
export default function NewProduct() {
  return (
    <>
      <h3>Create new norm</h3>
      {/* <form method="post">
        <div>
          <label htmlFor="productName">Product name</label>
          <input type="text" id="productName" name="productName" />
        </div>

        <div>
          <label htmlFor="norm1">Norm 1</label>
          <input type="number" id="norm1" name="norm1" />
        </div>
        <div>
          <label htmlFor="norm2">Norm 2</label>
          <input type="number" id="norm2" name="norm2" />
        </div>

        <button>Submit</button>
      </form> */}
      <div>
        <form method="post">
          <div className="">
            <div>
              <div>КС-Г(В)-010 СН</div>
              <div>070.00.00.000</div>
              <div>010CH</div>
            </div>
            <table className="norms__table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Material</th>
                  <th>Range</th>
                  <th>Standard</th>
                  <th>Unit</th>
                  <th>Consumption rate</th>
                  <th>Consumption rate per item</th>
                  <th>Price?</th>
                  <th>Sum?</th>
                  <th>Notes?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>3</td>
                  <td>3</td>
                  <td>3</td>
                  <td>3</td>
                  <td>3</td>
                  <td>3</td>
                  <td>3</td>
                </tr>
                {/* <tr>
              <td>
                <input type="text" defaultValue="John Doe" />
              </td>
              <td>
                <input type="number" defaultValue={30} />
              </td>
            </tr>
            <tr>
              <td>
                <input type="text" defaultValue="Jane Doe" />
              </td>
              <td>
                <input type="number" defaultValue={25} />
              </td>
            </tr> */}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </>
  );
}
