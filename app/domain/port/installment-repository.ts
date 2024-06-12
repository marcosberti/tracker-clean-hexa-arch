import { Prisma } from "@prisma/client";

import { InstallmentsE } from "../entity";
import { InstallmentSchema } from "../schema";

export interface InstallmentRepositoryI {
  getInstallmentById: <T extends Prisma.InstallmentsSelect>(
    userId: InstallmentsE["userId"],
    accountId: InstallmentsE["accountId"],
    id: InstallmentsE["id"],
    select: T,
  ) => Promise<Prisma.InstallmentsGetPayload<{ select: T }> | null>;
  getInstallmentByAccount: <T extends Prisma.InstallmentsSelect>(
    userId: InstallmentsE["userId"],
    accountId: InstallmentsE["accountId"],
    select: T,
  ) => Promise<Prisma.InstallmentsGetPayload<{ select: T }>[] | null>;
  getPendingInstallmentsByAccount: <T extends Prisma.InstallmentsSelect>(
    userId: InstallmentsE["userId"],
    accountId: InstallmentsE["accountId"],
    select: T,
    from: string,
    to: string,
  ) => Promise<Prisma.InstallmentsGetPayload<{ select: T }>[] | null>;
  createInstallment: (
    data: typeof InstallmentSchema._type & {
      userId: InstallmentsE["userId"];
      accountId: InstallmentsE["accountId"];
    },
  ) => Prisma.PrismaPromise<InstallmentsE>;
  updateInstallment: (
    userId: InstallmentsE["userId"],
    accountId: InstallmentsE["accountId"],
    id: InstallmentsE["id"],
    data: Partial<
      typeof InstallmentSchema._type & {
        paidInstallments: number;
        active: boolean;
      }
    >,
  ) => Prisma.PrismaPromise<InstallmentsE>;
  deleteInstallment: (
    userId: InstallmentsE["userId"],
    accountId: InstallmentsE["accountId"],
    id: InstallmentsE["id"],
  ) => Prisma.PrismaPromise<InstallmentsE>;
}
