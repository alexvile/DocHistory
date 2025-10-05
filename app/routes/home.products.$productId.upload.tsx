import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { prisma } from "~/server/prisma.server";
import { parseXlsxToRows } from "~/server/parse-xlsx.server";

// export async function loader({ params }: LoaderFunctionArgs) {
//   // const product = await prisma.product.findUnique({
//   //   where: { id: params.id! },
//   //   select: { id: true, productTitle: true }
//   // });
//   // if (!product) throw new Response("Product not found", { status: 404 });
//   // return { product };
//   return null
// }

type ActionData = { error?: string };

export async function action({ request, params }: ActionFunctionArgs) {
  try {
    const productId = params.id!;
    const createdById = "USER_ID_TODO"; // дістань із сесії

    const fd = await request.formData();
    const file = fd.get("file");
    const label = (fd.get("label") as string) || undefined;
    if (!(file instanceof File)) throw new Error("Файл не надійшов");

    const buf = Buffer.from(await file.arrayBuffer());

    // Парсимо .xlsx → rows (канонічний масив)
    const { rows } = parseXlsxToRows(buf);

    console.log(rows);
    return null
    // Зберігаємо snapshot як DRAFT. (parsedHash можна не ставити, якщо воно optional у схемі.
    // Якщо в тебе parsedHash досі обов'язкове — постав "" тимчасово.)
    await prisma.normSnapshot.create({
      data: {
        productId,
        createdById,
        label,
        status: "DRAFT",
        rows
      },
    });

    return redirect(`/products/${productId}`);
  } catch (e: any) {
    return json<ActionData>({ error: e?.message ?? "Unknown error" }, { status: 400 });
  }
}

export default function UploadProductNormsPage() {
  // const { product } = useLoaderData<typeof loader>();
  const product = {
    productTitle: '111',
    id: '111'
  }
  const data = useActionData<ActionData>();

  return (
    <div>
      <h1>Завантажити норми · {product?.productTitle}</h1>
      <p><Link to={`/products/${product?.id}`}>← Назад</Link></p>

      <Form method="post" encType="multipart/form-data">
        <div>
          <label>Назва (опційно)</label><br />
          <input name="label" placeholder="Знімок від сьогодні" />
        </div>
        <div>
          <label>Excel (.xlsx)</label><br />
          <input required type="file" name="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit">Завантажити</button>
        </div>
      </Form>

      {data?.error ? <p>Помилка: {data.error}</p> : null}
    </div>
  );
}
