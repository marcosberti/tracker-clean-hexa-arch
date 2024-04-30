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
    return prisma.scheduled.findFirst({
      select,
      where: {
        userId,
        accountId,
        id,
      },
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

  function deleteScheduled() {
    //
  }

  return {
    getScheduledByAccount,
    getScheduledById,
    createScheduled,
    deleteScheduled,
  };
}
