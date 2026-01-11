import { ActionFunction, ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useParams } from "@remix-run/react";
import { getUserId, requireUserRole } from "~/server/auth.server";
import { createProduct } from "~/server/products.server";
import { useEffect, useMemo, useState } from "react";
import { filterStringEntries, shortId } from "~/utils/main";
import { parseFormData } from "~/utils/rowHandlers";
import { Icon } from "~/components/Icon";
import { buildDynamicTitleValidators, validateFields } from "~/utils/validation";
import BackLink from "~/components/BackLink";
import { ExcelUploadWithPreview } from "~/components/ExcelUploadWithPreview";
import TextField from "~/components/TextField";
import { validateProductForm } from "~/utils/vanildateNewProduct.server";

// todo use _new !!!!
export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);

  const { errors, hasErrors, data } = validateProductForm(raw);

  if (hasErrors) {
    return new Response(JSON.stringify({ errors }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      status: "created",
      resource: "product",
      id: "product.id",
    }),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        Location: `/products/${"product.id"}`,
      },
    }
  );

  // const strings = filterStringEntries(raw);
  // const { main__title, main__code, ...rest } = strings;

  // const dynamicTitleFields = buildDynamicTitleValidators(rest);
  // const fieldErrors = validateFields({
  //   title: {
  //     value: main__title,
  //     type: "string",
  //     required: true,
  //     minLength: 4,
  //   },
  //   code: {
  //     value: main__code,
  //     type: "string",
  //     optional: true,
  //   },
  //   ...dynamicTitleFields,
  // });

  // if (Object.keys(fieldErrors).length > 0) {
  //   const res: ActionResponse = { success: false, errors: fieldErrors };
  //   return Response.json(res, { status: 400 });
  // }

  // const jsonNorms = parseFormData(rest);

  // await createProduct({
  //   productTitle: main__title,
  //   code: main__code ?? null,
  //   norms: jsonNorms,
  //   creatorId: userId,
  // });
  // const res: ActionResponse = { success: true, errors: {} };
  // return Response.json(res, { status: 201 });
};

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
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
// todo - errors + disabled state
// todo - when try to exit - show warning !!!
// todo - mark inputs with red color

export default function NewProduct() {
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;
  const hasErrors = errors && Object.keys(errors).length > 0;

  const [rows, setRows] = useState<any[] | null>(null);

  return (
    <>
      <div className="dashboard-topbar">
        <BackLink />
        <h3 className="products-new__title">
          Створення нового продукту
          <Icon name="pencil" />
        </h3>
      </div>

      {hasErrors && (
        <div className="form-errors">
          <p className="form-errors__title">Будь ласка, виправте помилки:</p>

          <ul className="form-errors__list">
            {Object.values(errors).map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <ExcelUploadWithPreview onChange={setRows} />
      <Form method="post">
        <input type="hidden" name="jsonString" value={rows ? JSON.stringify(rows) : ""} />
        <div className="products-new__top-form">
          <TextField label="Назва" name="title" placeholder="КС-Г(В)-010 СН" minLength={4} isRequired />
          <TextField label="Код" name="code" placeholder="070.00.00.000" />
        </div>
        <div className="products-new__main-form">
          {/* <ProductNormsTable normRows={initialData} isEditable={true} /> */}
          <button
            className="button button--primary"
            aria-label="Збрегети зміни"
            disabled={!rows || rows.length === 0}
            aria-disabled={!rows || rows.length === 0}
            type="submit"
          >
            Зберегти
          </button>
        </div>
      </Form>
    </>
  );
}
