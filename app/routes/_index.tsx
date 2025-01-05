import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserRole } from "~/server/auth.server";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  // todo - refactor
  await requireUserRole(request);
  return redirect("/home");
};
