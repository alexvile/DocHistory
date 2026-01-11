import { ProductInvalidStateError, ProductNotFoundError } from "~/utils/domain-errors";


export function mapProductErrorToResponse(error: unknown): never {
  if (error instanceof ProductNotFoundError) {
    throw new Response("Not Found", { status: 404 });
  }

  if (error instanceof ProductInvalidStateError) {
    throw new Response("Invalid product state", { status: 409 });
  }

  console.error("Product handler failed", error);
  throw new Response("Internal Server Error", { status: 500 });
}
