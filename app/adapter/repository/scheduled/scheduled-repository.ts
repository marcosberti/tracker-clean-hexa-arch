import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { ScheduledE } from "~/domain/entity";
import { ScheduledRepositoryI } from "~/domain/port";
import { ScheduledSchema } from "~/domain/schema";

export function ScheduledRepository(): ScheduledRepositoryI {
  function getScheduledById<T extends Prisma.ScheduledSelect>(
    userId: ScheduledE["userId"],
    accountId: ScheduledE["accountId"],
    id: ScheduledE["id"],
    select: T,
  ) {
    const where = {
      userId,
      accountId,
      id,
      active: true,
    };

    return prisma.scheduled.findFirst({
      select,
      where,
    });
  }

  async function getScheduledByAccount<T extends Prisma.ScheduledSelect>(
    userId: ScheduledE["userId"],
    accountId: ScheduledE["accountId"],
    select: T,
  ) {
    const where = {
      userId,
      accountId,
      active: true,
    };

    return prisma.scheduled.findMany({
      select,
      where,
    });
  }

  function getPendingScheduledByAccount<T extends Prisma.ScheduledSelect>(
    userId: ScheduledE["userId"],
    accountId: ScheduledE["accountId"],
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

    return prisma.scheduled.findMany({
      select,
      where,
    });
  }

  function createScheduled(
    data: typeof ScheduledSchema._type & {
      userId: ScheduledE["userId"];
      accountId: ScheduledE["accountId"];
    },
  ) {
    return prisma.scheduled.create({
      data,
    });
  }

  function updateScheduled(
    userId: ScheduledE["userId"],
    accountId: ScheduledE["accountId"],
    id: ScheduledE["id"],
    data: Partial<typeof ScheduledSchema._type>,
  ) {
    const where = {
      userId,
      accountId,
      id,
    };

    return prisma.scheduled.update({
      data,
      where,
    });
  }

  function deleteScheduled(
    userId: ScheduledE["userId"],
    accountId: ScheduledE["accountId"],
    id: ScheduledE["id"],
  ) {
    const where = {
      userId,
      accountId,
      id,
    };

    return prisma.scheduled.delete({
      where,
    });
  }

  return {
    getScheduledByAccount,
    getScheduledById,
    getPendingScheduledByAccount,
    createScheduled,
    updateScheduled,
    deleteScheduled,
  };
}
