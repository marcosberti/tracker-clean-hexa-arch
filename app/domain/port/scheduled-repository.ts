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
  createScheduled: (
    data: typeof ScheduledSchema._type & {
      userId: ScheduledE["userId"];
      accountId: ScheduledE["accountId"];
    },
  ) => Promise<ScheduledE>;
  deleteScheduled: () => void;
}
