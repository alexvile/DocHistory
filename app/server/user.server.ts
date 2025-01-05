import bcrypt from "bcryptjs";
import type { RegisterForm } from "./types.server";
import { prisma } from "./prisma.server";
import { Prisma } from "@prisma/client";

export const createUser = async ({
  email,
  firstName,
  lastName,
  role,
  password,
}: RegisterForm) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: passwordHash,
      firstName: firstName,
      lastName: lastName,
      role: role,
    },
  });
  return { id: newUser.id, email, role};
};


export const getFilteredUsers = async (
  sortFilter: Prisma.UserOrderByWithRelationInput,
  whereFilter: Prisma.UserWhereInput
) => {
  // todo - pagination !!!!
  return await prisma.user.findMany({
    orderBy: {
      ...sortFilter,
    },
    where: {
      ...whereFilter,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true
    }
  });
};