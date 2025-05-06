// todo - do we need to connect creator of norm ???
import { prisma } from "./prisma.server";
import { Product, Prisma } from "@prisma/client";

export const createProduct = async ({
  creatorId,
  productTitle,
  code,
  norms ,
}: Pick<Product, "productTitle" | "code" | "norms" | "creatorId">) => {
  await prisma.product.create({
    data: {
      productTitle,
      code,
      norms: norms as unknown as Prisma.InputJsonValue,
      creator: {
        connect: {
          id: creatorId,
        },
      },
    },
  });
};

export const getFilteredProducts = async () => {
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

export const getProductbyId = async (id: string) => {
  // todo - get Last 50 changes with creator
  //  add Link for filter all changes by this norm
  return await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      productTitle: true,
      code: true,
      norms: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// todo - need refactor


export const updateNormById = async ({
  id,
  productName,
  norm1,
  norm2
}) => {
  return await prisma.norm.update({
    where: {
      id,
    },
    data: {
      productName,
      norm1,
      norm2
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
