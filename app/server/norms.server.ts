// todo - do we need to connect creator of norm ???
import { prisma } from "./prisma.server";
import { Norm, Prisma } from "@prisma/client";

export const createNorm = async ({
  creatorId,
  productName,
  norm1,
  norm2,
}: Pick<Norm, "productName" | "norm1" | "norm2" | "creatorId">) => {
  await prisma.norm.create({
    data: {
      productName,
      norm1,
      norm2,
      creator: {
        connect: {
          id: creatorId,
        },
      },
    },
  });
};

export const getFilteredNorms = async () => {
  // todo - pagination !!!!
  return await prisma.norm.findMany({
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
