import { Norm, NormChange } from "~/types";
import { prisma } from "./prisma.server";

type UpdateProductAndCreateChangeParams = {
  creatorId: string;
  productId: string;
  diff: NormChange[];
  newNorms: Norm[];
};

export async function updateProductAndCreateChange({
  creatorId,
  productId,
  diff,
  newNorms,
}: UpdateProductAndCreateChangeParams): Promise<NormChange[]> {
  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: { norms: newNorms },
    });

    await tx.change.create({
      data: {
        creatorId,
        productId,
        diff,
        snapshot: newNorms,
      },
    });
  });

  return diff;
}
