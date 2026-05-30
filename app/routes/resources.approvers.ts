import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId, requireUserRole } from "~/server/auth.server";
import { getApprovers } from "~/server/user.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const role = await requireUserRole(request);
  if (role !== "COMMITTER") {
    throw new Response("Forbidden: Access denied", { status: 403 });
  }
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
