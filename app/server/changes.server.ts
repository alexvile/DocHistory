import { CanonicalRow } from "~/types";
import { prisma } from "./prisma.server";
import { SnapshotStatus, ChangeSetStatus, Prisma } from "@prisma/client";
import { diffNorms, hasChanges } from "~/utils/comparison";

type CreateChangeSetParams = {
  productId: string;
  createdById: string;
  oldSnapshotId: string;
  newRows: unknown[];
  diff: unknown;
};

export async function createChangeSet(params: CreateChangeSetParams) {
  const { productId, createdById, oldSnapshotId, newRows, diff } = params;

  return prisma.$transaction(async (tx) => {
    // 1️⃣ create pending snapshot
    const newSnapshot = await tx.normSnapshot.create({
      data: {
        productId,
        createdById,
        status: SnapshotStatus.DRAFT,
        rows: newRows,
      },
    });

    //     data: {
    //   product: {
    //     connect: { id: "abc123" }
    //   }
    // }

    // 2️⃣ create change set
    const changeSet = await tx.changeSet.create({
      data: {
        productId,
        createdById,
        status: ChangeSetStatus.DRAFT,
        oldSnapshotId,
        newSnapshotId: newSnapshot.id,
        diff,
      },
    });

    return {
      changeSetId: changeSet.id,
      snapshotId: newSnapshot.id,
    };
  });
}

// export const getTotalChangesCount = async (whereFilter: Prisma.ChangeWhereInput) => {
//   return await prisma.change.count({ where: whereFilter });
// };

// export const getFilteredChanges = async (
//   sortFilter: Prisma.ChangeOrderByWithRelationInput,
//   whereFilter: Prisma.ChangeWhereInput,
//   skip: number,
//   take: number
// ) => {
//   return await prisma.change.findMany({
//     orderBy: {
//       ...sortFilter,
//     },
//     where: {
//       // ownerId: userId,
//       ...whereFilter,
//     },
//     skip,
//     take,
//     select: {
//       id: true,
//       createdAt: true,
//       creator: {
//         select: {
//           firstName: true,
//           lastName: true,
//         },
//       },
//       product: {
//         select: {
//           productTitle: true,
//         },
//       },
//     },
//   });
// };
// export const getChangebyId = async (id: string) => {
//   return await prisma.change.findUnique({
//     where: {
//       id: id,
//     },
//     select: {
//       id: true,
//       createdAt: true,
//       diff: true,
//       creator: {
//         select: {
//           firstName: true,
//           lastName: true,
//         },
//       },
//       product: {
//         select: {
//           productTitle: true,
//         },
//       },
//     },
//   });
// };
// todo - get the snapshot

// todo - change last change set draft by product
export const getFilteredChangeSetsByProduct = async (
  productId: string,
  sortFilter: Prisma.ChangeSetOrderByWithRelationInput,
  whereFilter: Prisma.ChangeSetWhereInput,
  skip?: number,
  take?: number
) => {
  return await prisma.changeSet.findMany({
    where: {
      ...whereFilter,
      productId,
    },
    orderBy: {
      ...sortFilter,
    },
    skip,
    take,
    include: {
      createdBy: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });
};

export const getTotalChangesCount = async (whereFilter: Prisma.ChangeSetWhereInput) => {
  return await prisma.changeSet.count({ where: whereFilter });
};

export const getFilteredChangeSets = async (
  where: Prisma.ChangeSetWhereInput,
  orderBy: Prisma.ChangeSetOrderByWithRelationInput,
  skip?: number,
  take?: number,
) => {
  return prisma.changeSet.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

// export const getFilteredChangeSetsByProduct = async (
//   productId: string,
//   sortFilter: Prisma.ChangeSetOrderByWithRelationInput,
//   whereFilter: Prisma.ChangeSetWhereInput,
//   skip?: number,
//   take?: number
// ) => {
//   return await prisma.changeSet.findMany({
//     where: {
//       ...whereFilter,
//       productId,
//     },
//     orderBy: {
//       ...sortFilter,
//     },
//     skip,
//     take,
//     include: {
//       createdBy: {
//         select: {
//           firstName: true,
//           lastName: true
//         }
//       }
//     }
//   });
// };

// const changeSets = await prisma.changeSet.findMany({
//   where: whereFilter,
//   orderBy: sortOptions,
//   skip,
//   take,
// });
