import { prisma } from "./prisma.server";
import { Change, Prisma } from "@prisma/client";

export const getTotalChangesCount = async (whereFilter: Prisma.ChangeWhereInput) => {
  return await prisma.change.count({ where: whereFilter });
};

export const getFilteredChanges = async (
  sortFilter: Prisma.ChangeOrderByWithRelationInput,
  whereFilter: Prisma.ChangeWhereInput,
  skip: number,
  take: number
) => {
  return await prisma.change.findMany({
    orderBy: {
      ...sortFilter,
    },
    where: {
      // ownerId: userId,
      ...whereFilter,
    },
    skip,
    take,
    select: {
      id: true,
      createdAt: true,
      creator: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      product: {
        select: {
          productTitle: true,
        },
      },
    },
  });
};
export const getChangebyId = async (id: string) => {
  return await prisma.change.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      createdAt: true,
      diff: true,
      creator: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      product: {
        select: {
          productTitle: true,
        },
      },
    },
  });
};
// todo - get the snapshot
