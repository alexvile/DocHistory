import type { ActionFunctionArgs } from "@remix-run/node";
import {
  unstable_parseMultipartFormData,
  unstable_createMemoryUploadHandler,
} from "@remix-run/node";
import { parseXlsxToRows } from "~/server/parse-xlsx.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 20_000_000, // 20 MB
  });

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return new Response(
      JSON.stringify({ error: "Файл не надійшов" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const { rows } = parseXlsxToRows(buffer);

  return new Response(
    JSON.stringify({ rows }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export default null;
