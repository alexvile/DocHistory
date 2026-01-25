import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/server/auth.server";
import { getApprovers } from "~/server/user.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const approvers = await getApprovers(userId);

  return new Response(
    JSON.stringify({ approvers }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
