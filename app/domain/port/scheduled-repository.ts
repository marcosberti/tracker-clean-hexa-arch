import { Prisma } from "@prisma/client";

import { ScheduledE } from "../entity";
import { ScheduledSchema } from "../schema";

export interface ScheduledRepositoryI {
  getScheduledById: <T extends Prisma.ScheduledSelect>(
    userId: ScheduledE["userId"],
    accountId: ScheduledE["accountId"],
    id: ScheduledE["id"],
    select: T,
  ) => Promise<Prisma.ScheduledGetPayload<{ select: T }> | null>;
  getScheduledByAccount: <T extends Prisma.ScheduledSelect>(
    userId: ScheduledE["userId"],
    accountId: ScheduledE["accountId"],
    select: T,
  ) => Promise<Prisma.ScheduledGetPayload<{ select: T }>[] | null>;
  getPendingScheduledByAccount: <T extends Prisma.ScheduledSelect>(
    userId: ScheduledE["userId"],
    accountId: ScheduledE["accountId"],
    select: T,
    from: string,
    to: string,
  ) => Promise<Prisma.ScheduledGetPayload<{ select: T }>[] | null>;
  createScheduled: (
    data: typeof ScheduledSchema._type & {
      userId: ScheduledE["userId"];
      accountId: ScheduledE["accountId"];
    },
  ) => Prisma.PrismaPromise<ScheduledE>;
  updateScheduled: (
    userId: ScheduledE["userId"],
    accountId: ScheduledE["accountId"],
    id: ScheduledE["id"],
    data: Partial<typeof ScheduledSchema._type>,
  ) => Prisma.PrismaPromise<ScheduledE>;
  deleteScheduled: (
    userId: ScheduledE["userId"],
    accountId: ScheduledE["accountId"],
    id: ScheduledE["id"],
  ) => Prisma.PrismaPromise<ScheduledE>;
}
