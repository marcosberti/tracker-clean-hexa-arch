import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { InstallmentsE } from "~/domain/entity";
import { InstallmentRepositoryI } from "~/domain/port";
import { InstallmentSchema } from "~/domain/schema";

export function InstallmentRepository(): InstallmentRepositoryI {
  function getInstallmentById<T extends Prisma.InstallmentsSelect>(
    userId: InstallmentsE["userId"],
    accountId: InstallmentsE["accountId"],
    id: InstallmentsE["id"],
    select: T,
  ) {
    return prisma.installments.findFirst({
      select,
      where: {
        userId,
        accountId,
        id,
      },
    });
  }

  async function getInstallmentByAccount<T extends Prisma.InstallmentsSelect>(
    userId: InstallmentsE["userId"],
    accountId: InstallmentsE["accountId"],
    select: T,
  ) {
    const where = {
      userId,
      accountId,
      active: true,
    };

    return prisma.installments.findMany({
      select,
      where,
    });
  }

  function getPendingInstallmentsByAccount<T extends Prisma.InstallmentsSelect>(
    userId: InstallmentsE["userId"],
    accountId: InstallmentsE["accountId"],
    select: T,
    from: string,
    to: string,
  ) {
    const where = {
      userId,
      accountId,
      active: true,
      transactions: {
        none: {
          createdAt: {
            gte: from,
            lte: to,
          },
        },
      },
    };

    return prisma.installments.findMany({
      select,
      where,
    });
  }

  function createInstallment(
    data: typeof InstallmentSchema._type & {
      userId: InstallmentsE["userId"];
      accountId: InstallmentsE["accountId"];
    },
  ) {
    return prisma.installments.create({
      data,
    });
  }

  function updateInstallment(
    userId: InstallmentsE["userId"],
    accountId: InstallmentsE["accountId"],
    id: InstallmentsE["id"],
    data: Partial<typeof InstallmentSchema._type>,
  ) {
    const where = {
      userId,
      accountId,
      id,
    };

    return prisma.installments.update({
      data,
      where,
    });
  }

  function deleteInstallment(
    userId: InstallmentsE["userId"],
    accountId: InstallmentsE["accountId"],
    id: InstallmentsE["id"],
  ) {
    const where = {
      userId,
      accountId,
      id,
    };

    return prisma.installments.delete({
      where,
    });
  }

  return {
    getInstallmentByAccount,
    getInstallmentById,
    getPendingInstallmentsByAccount,
    createInstallment,
    updateInstallment,
    deleteInstallment,
  };
}
