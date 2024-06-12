import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CURRENCIES = [
  {
    name: "Pesos",
    code: "ARS",
  },
  {
    name: "Dollars",
    code: "USD",
  },
  {
    name: "Bitcoin",
    code: "BTC",
  },
];

const CATEGORIES = [
  {
    name: "Household",
    color: "cyan",
    icon: "Building",
  },
  {
    name: "Rent",
    color: "rose",
    icon: "Building",
  },
  {
    name: "Income",
    color: "green",
    icon: "Banknote",
  },
  {
    name: "Groceries",
    color: "green",
    icon: "ShoppingBasket",
  },
];

const ACCOUNTS = [
  {
    name: "bank",
    main: true,
    balance: 0,
    color: "lime",
    icon: "Banknote",
  },
  {
    name: "vbank",
    main: false,
    balance: 0,
    color: "lime",
    icon: "Wallet",
  },
];

async function seed() {
  const email = "bertilotti.marcos@gmail.com";

  await prisma.transactions.deleteMany();
  await prisma.scheduled.deleteMany();
  await prisma.installments.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.accounts.deleteMany();
  await prisma.currencies.deleteMany();
  await prisma.users.deleteMany();

  const hashedPassword = await bcrypt.hash("020993mb", 10);

  const user = await prisma.users.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.currencies.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const currenciesP = CURRENCIES.map((currency) => {
    return prisma.currencies.create({
      data: {
        userId: user.id,
        ...currency,
      },
    });
  });

  const currencies = await Promise.all(currenciesP);

  const categoriesP = CATEGORIES.map((category) => {
    return prisma.categories.create({
      data: {
        userId: user.id,
        ...category,
      },
    });
  });

  await Promise.all(categoriesP);

  const currency = currencies.find((c) => c.code === "ARS");

  const accountsP = ACCOUNTS.map((account) => {
    return prisma.accounts.create({
      data: {
        userId: user.id,
        currencyId: currency!.id,
        ...account,
      },
    });
  });

  await Promise.all(accountsP);

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
