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

  function deleteInstallment() {
    //
  }

  return {
    getInstallmentByAccount,
    getInstallmentById,
    createInstallment,
    deleteInstallment,
  };
}
