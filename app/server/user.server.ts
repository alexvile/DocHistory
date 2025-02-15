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

export const getUserById = async (id: string) => {
  // dont need user data
  // all norms and last 50 changes
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      norms: {
        select: {
          id: true,
          productName: true,
          norm1: true,
          norm2: true
        }
      }
    }
  });
};