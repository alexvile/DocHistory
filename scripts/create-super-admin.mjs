import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} must be set`);
  }
  return value;
}

async function main() {
  const email = requiredEnv("SUPER_ADMIN_EMAIL").toLowerCase();
  const password = requiredEnv("SUPER_ADMIN_PASSWORD");
  const firstName = process.env.SUPER_ADMIN_FIRST_NAME?.trim() || "Super";
  const lastName = process.env.SUPER_ADMIN_LAST_NAME?.trim() || "Admin";

  if (password.length < 8) {
    throw new Error("SUPER_ADMIN_PASSWORD must contain at least 8 characters");
  }

  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN" },
    select: { email: true },
  });

  if (existingSuperAdmin) {
    throw new Error(`SUPER_ADMIN already exists: ${existingSuperAdmin.email}`);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { email: true },
  });

  if (existingUser) {
    throw new Error(`User already exists: ${existingUser.email}`);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      firstName,
      lastName,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`SUPER_ADMIN created: ${email}`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
