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
    name: "Casa",
    color: "cyan",
    icon: "Building",
  },
  {
    name: "Alquiler",
    color: "rose",
    icon: "Building",
  },
  {
    name: "Ingreso",
    color: "green",
    icon: "Banknote",
  },
  {
    name: "Compras",
    color: "green",
    icon: "ShoppingBasket",
  },
  {
    name: "Delivery",
    color: "rose",
    icon: "Pizza",
  },
  {
    name: "Deporte",
    color: "teal",
    icon: "Dribbble",
  },
  {
    name: "Impuestos",
    color: "lime",
    icon: "HandCoins",
  },
  {
    name: "Servicios",
    color: "indigo",
    icon: "Router",
  },
  {
    name: "Regalos",
    color: "violet",
    icon: "Gift",
  },
  {
    name: "Ocio",
    color: "emerald",
    icon: "Joystick",
  },
  {
    name: "Auto",
    color: "lightBlue",
    icon: "Car",
  },
  {
    name: "Ropa",
    color: "purple",
    icon: "Shirt",
  },
  {
    name: "Salida",
    color: "fuchsia",
    icon: "Wine",
  },
  {
    name: "Inversion",
    color: "green",
    icon: "ChartLine",
  },
  {
    name: "Tarjeta",
    color: "zinc",
    icon: "CreditCard",
  },
];

const ACCOUNTS = [
  {
    name: "BBVA",
    main: true,
    balance: 0,
    color: "lime",
    icon: "Banknote",
  },
  {
    name: "Wise",
    main: false,
    balance: 0,
    color: "lime",
    icon: "Wallet",
  },
];

const DEFAULT_MAIL = "bertilotti.marcos@gmail.com";

async function seed() {
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
      email: DEFAULT_MAIL,
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
