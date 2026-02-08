import { prisma } from "./prisma.server";
import { SnapshotStatus, ChangeSetStatus, Prisma } from "@prisma/client";

export const getTotalChangesCount = async (whereFilter: Prisma.ChangeSetWhereInput) => {
  return await prisma.changeSet.count({ where: whereFilter });
};

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

type AssignApproverParams = {
  changeSetId: string;
  approverId: string;
};

export async function assignApproverToChangeSet({ changeSetId, approverId }: AssignApproverParams) {
  return prisma.changeSet.update({
    where: { id: changeSetId },
    data: {
      approverId,
      status: "ON_REVIEW",
    },
  });
}

type RejectChangeSetParams = {
  changeSetId: string;
  decidedById: string;
};

export async function rejectChangeSet({
  changeSetId,
  decidedById,
}: RejectChangeSetParams) {
  return prisma.changeSet.update({
    where: {
      id: changeSetId,
      approverId: decidedById,
      status: "ON_REVIEW",
    },
    data: {
      status: ChangeSetStatus.REJECTED,
      decidedAt: new Date(),
    },
  });
}

// todo - get the snapshot
// todo - change last change set draft by product
// todo - getPOPULATEDCHANGESETS

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
      approver: {
        select: {
          firstName: true,
          lastName: true,
        }
      }
    },
  });
};
