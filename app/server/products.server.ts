// todo - do we need to connect creator of norm ???
import { prisma } from "./prisma.server";
import { Product, Prisma, SnapshotStatus } from "@prisma/client";

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

// export const createProduct = async ({ creatorId, productTitle, code }: Pick<Product, "productTitle" | "code" | "creatorId">) => {
//   await prisma.product.create({
//     data: {
//       productTitle,
//       code,
//       creator: {
//         connect: {
//           id: creatorId,
//         },
//       },
//     },
//   });
// };

export const getTotalProductsCount = async (whereFilter: Prisma.ProductWhereInput) => {
  return await prisma.product.count({ where: whereFilter });
};
export const getFilteredProducts = async (
  sortFilter: Prisma.ProductOrderByWithRelationInput,
  whereFilter: Prisma.ProductWhereInput,
  skip: number,
  take: number
) => {
  return await prisma.product.findMany({
    orderBy: {
      ...sortFilter,
    },
    where: {
      // ownerId: userId,
      ...whereFilter,
    },
    skip,
    take,
    // include: {
    //   owner: true,
    //   records: true,
    // },
  });
};

export const getAllFilteredProducts = async () => {
  // todo - pagination !!!!
  return await prisma.product.findMany({
    // select: {
    //   id: true,
    //   createdAt: true,
    //   updatedAt: true,
    //   creatorId: true,
    //   todo - incomment if we want user credentials
    //   creator: {
    //     select: {
    //       firstName: true,
    //     },
    //   },
    // },
  });
};

// export const getProductbyId = async (id: string) => {
//   // todo - get Last 50 changes with creator
//   //  add Link for filter all changes by this norm
//   return await prisma.product.findUnique({
//     where: {
//       id: id,
//     },
//     select: {
//       id: true,
//       title: true,
//       code: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });
// };

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
    throw new Error("Product not found");
  }

  if (!product.currentSnapshotId) {
    throw new Error("Product has no active snapshot");
  }
  // 2️⃣ fetch active snapshot (only what we need)
  const snapshot = await prisma.normSnapshot.findUnique({
    where: { id: product.currentSnapshotId },
    select: {
      id: true,
      rows: true,
    },
  });

  if (!snapshot) {
    throw new Error("Active snapshot not found");
  }

  return {
    product,
    currentSnapshot: snapshot
  };
}

// todo - need refactor

export const updateNormById = async ({ id, productName, norm1, norm2 }) => {
  return await prisma.norm.update({
    where: {
      id,
    },
    data: {
      productName,
      norm1,
      norm2,
    },
  });
};

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
