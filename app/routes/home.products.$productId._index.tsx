import { redirect } from "@remix-run/node";

export const loader = async ({ params }) => {
  return redirect("overview");
};
