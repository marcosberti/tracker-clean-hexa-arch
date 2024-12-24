import { prisma } from "~/db.server";
import { UsersE } from "~/domain/entity";

export async function cleanup() {
  await Promise.all([prisma.accounts.deleteMany()]);
}

async function getUser() {
  const user = await prisma.users.findFirst();
  if (!user) {
    throw new Error("should not happend");
  }

  return user;
}

async function getCurrency(userId: UsersE["id"]) {
  const result = await prisma.currencies.findFirst({ where: { userId } });
  if (!result) {
    throw new Error("should not happend");
  }

  return result;
}

async function createAccount(userId: string, currencyId: string) {
  return await prisma.accounts.create({
    data: {
      color: "red",
      icon: "card",
      name: "Test Account",
      main: false,
      balance: 0,
      currencyId,
      userId,
    },
  });
}

const integration = {
  getUser,
  getCurrency,
  createAccount,
};

export default integration;
