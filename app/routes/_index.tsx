import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/server/auth.server";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  // todo - refactor
  await requireUserId(request);
  return redirect("/home");
};
