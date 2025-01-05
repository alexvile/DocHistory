import bcrypt from "bcryptjs";
import type { RegisterForm } from "./types.server";
import { prisma } from "./prisma.server";

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
