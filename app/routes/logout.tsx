import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "~/server/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  return logout(request);
};

export const loader = async () => {
  return redirect("/");
};
