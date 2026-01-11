export class ProductNotFoundError extends Error {
  constructor() {
    super("Product not found");
  }
}

export class ProductInvalidStateError extends Error {
  constructor(message = "Invalid product state") {
    super(message);
  }
}
