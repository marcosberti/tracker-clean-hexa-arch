import { installGlobals } from "@remix-run/node";
import "@testing-library/jest-dom";
import integration, { cleanup } from "./integration";
import { TestContext } from "vitest";

export type ExtendedTestContext = TestContext & {
  integration: typeof integration;
};

beforeEach(async (ctx: ExtendedTestContext) => {
  await cleanup();

  ctx.integration = integration;
});

afterEach(async () => {
  await cleanup();
});

installGlobals();
