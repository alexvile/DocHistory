// todo - do we need to connect creator of norm ???
import { ProductInvalidStateError, ProductNotFoundError } from "~/utils/domain-errors";
import { prisma } from "./prisma.server";
import { Prisma, SnapshotStatus } from "@prisma/client";

type CreateProductInput = {
  title: string;
  code?: string;
  norms: any;
  creatorId: string;
};

export async function createProduct(input: CreateProductInput) {
  const { title, code, norms, creatorId } = input;

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ creating product
    const product = await tx.product.create({
      data: {
        title,
        code,
        createdById: creatorId,
      },
    });

    // 2️⃣ creating initial snapshot
    const snapshot = await tx.normSnapshot.create({
      data: {
        productId: product.id,
        createdById: creatorId,
        status: SnapshotStatus.BASELINE,
        rows: norms,
      },
    });

    // 3️⃣ assign initial snapshot for product
    const updatedProduct = await tx.product.update({
      where: { id: product.id },
      data: {
        currentSnapshotId: snapshot.id,
      },
    });

    return {
      product: updatedProduct,
      snapshot,
    };
  });
}

export const getTotalProductsCount = async (whereFilter: Prisma.ProductWhereInput) => {
  return await prisma.product.count({ where: whereFilter });
};

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    select: { id: true, title: true },
    take: 300,
  });
};

export const getFilteredProducts = async (
  sortFilter: Prisma.ProductOrderByWithRelationInput,
  whereFilter: Prisma.ProductWhereInput,
  skip: number,
  take: number,
) => {
  return await prisma.product.findMany({
    orderBy: {
      ...sortFilter,
    },
    where: {
      ...whereFilter,
    },
    skip,
    take,
  });
};


export async function getProductWithNormsById(productId: string) {
  // 1️⃣ fetch product (only what we need)
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      code: true,
      updatedAt: true,
      currentSnapshotId: true,
    },
  });

  if (!product) {
    throw new ProductNotFoundError();
  }

  if (!product.currentSnapshotId) {
    throw new ProductInvalidStateError("Product has no active snapshot");
  }
  // 2️⃣ fetch active snapshot (only what we need)
  const snapshot = await prisma.normSnapshot.findUnique({
    where: { id: product.currentSnapshotId },
    select: {
      id: true,
      rows: true,
      status: true,
    },
  });

  if (!snapshot || snapshot.status !== "BASELINE") {
    throw new ProductInvalidStateError("Active snapshot not found");
  }

  return {
    product,
    currentSnapshot: snapshot,
  };
}

// todo - need refactor

// await prisma.object.update({
//   where: { id: objectId },
//   data: {
//     data: { ...currentObject.data, ...newData },
//   },
// });
// export async function updateNorm(
//   objectId: string,
//   userId: string,
//   newData: Record<string, any>
// ) {
// Отримати поточний стан об'єкта
// const currentObject = await prisma.object.findUnique({
//   where: { id: objectId },
// });
// if (!currentObject) throw new Error("Object not found");

// Оновити об'єкт
// await prisma.norm.update({
//   where: { id: objectId },
//   data: {
//     data: { ...currentObject.data, ...newData },
//   },
// });

// Зберегти зміну

// }

// await prisma.change.create({
//   data: {
//     user: {
//       connect: {
//         id: userId,
//       },
//     },
//     norm: {
//       connect: {
//         id: objectId,
//       },
//     },
//     changes,
//   },
// });

// await prisma.$transaction(async (tx) => {
//   await tx.changeSet.update({
//     where: { id: changeSetId },
//     data: {
//       status: "APPROVED",
//       decidedAt: new Date(),
//     },
//   });

//   await tx.normSnapshot.update({
//     where: { id: oldSnapshotId },
//     data: { status: "ARCHIVED" },
//   });

//   await tx.normSnapshot.update({
//     where: { id: newSnapshotId },
//     data: { status: "BASELINE" },
//   });

//   await tx.product.update({
//     where: { id: productId },
//     data: {
//       currentSnapshotId: newSnapshotId,
//     },
//   });
// });
