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

// todo - do we need to connect creator of norm ???
import { prisma } from "./prisma.server";
import { Norm, Prisma } from "@prisma/client";

export const createChange = async ({ userId, normId, changes }: any) => {
  console.log(111, userId, normId, changes)
  await prisma.change.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      norm: {
        connect: {
          id: normId,
        },
      },
      changes,
    },
  });
};

export const getAllChanges = async () => {
  return await prisma.change.findMany({
   include: {
    user: true,
    norm: true
   }
  });
};