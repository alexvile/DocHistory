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

type ApproveChangeSetParams = {
  changeSetId: string;
  decidedById: string;
};

// todo - refactor
export async function approveChangeSet({
  changeSetId,
  decidedById,
}: ApproveChangeSetParams) {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ знайти changeSet
    const changeSet = await tx.changeSet.findFirst({
      where: {
        id: changeSetId,
        approverId: decidedById,
        status: "ON_REVIEW",
      },
      select: {
        id: true,
        productId: true,
        oldSnapshotId: true,
        newSnapshotId: true,
      },
    });

    if (!changeSet) {
      throw new Error("ChangeSet not found or not allowed");
    }

    // 2️⃣ (опціонально, але я б залишив) перевірка актуальності
    const product = await tx.product.findUnique({
      where: { id: changeSet.productId },
      select: { currentSnapshotId: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.currentSnapshotId !== changeSet.oldSnapshotId) {
      throw new Error("ChangeSet is outdated");
    }

    // 3️⃣ апрув changeSet (фіксуємо факт)
    await tx.changeSet.update({
      where: { id: changeSet.id },
      data: {
        status: "APPROVED",
        decidedAt: new Date(),
      },
    });

    // 4️⃣ старий snapshot → ARCHIVED
    await tx.normSnapshot.update({
      where: { id: changeSet.oldSnapshotId },
      data: {
        status: "ARCHIVED",
      },
    });

    // 5️⃣ новий snapshot → BASELINE
    await tx.normSnapshot.update({
      where: { id: changeSet.newSnapshotId },
      data: {
        status: "BASELINE",
      },
    });

    // 6️⃣ перемикаємо продукт
    await tx.product.update({
      where: { id: changeSet.productId },
      data: {
        currentSnapshotId: changeSet.newSnapshotId,
      },
    });

    return { success: true };
  });
}


// todo - get the snapshot
// todo - change last change set draft by product
// todo - getPopulated for superficial and deep data

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
      product: {
        select: {
          id: true,
          title: true
        }
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


export const getPopulatedChangeSetById = async (id: string) => {
  return prisma.changeSet.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      product: {
        select: {
          id: true,
          title: true,
        },
      },
      approver: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};