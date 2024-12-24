import { ExtendedTestContext } from "test/setup-test-env";
import { verifyPassword } from "./verify-password";

const DEFUALT_PASSWORD = "020993mb";

it("verify user credentials", async ({ integration }: ExtendedTestContext) => {
  const res = await integration.getUser();
  const formData = new FormData();

  formData.append("email", res.email);
  formData.append("password", DEFUALT_PASSWORD);
  formData.append("remember", "on");
  const result = await verifyPassword(formData);

  expect(res.email).toEqual(result.data?.email);
});

it("error if with no email", async ({ integration }: ExtendedTestContext) => {
  const res = await integration.getUser();
  const formData = new FormData();

  formData.append("password", DEFUALT_PASSWORD);
  formData.append("remember", "on");
  const result = await verifyPassword(formData);

  expect(result.errors?.email).toEqual(["Required"]);
});

it("error if with no password", async ({
  integration,
}: ExtendedTestContext) => {
  const res = await integration.getUser();
  const formData = new FormData();

  formData.append("email", res.email);
  formData.append("remember", "on");
  const result = await verifyPassword(formData);

  expect(result.errors?.password).toEqual(["Required"]);
});

it("error on wrong user credentials", async ({
  integration,
}: ExtendedTestContext) => {
  const res = await integration.getUser();
  const formData = new FormData();

  formData.append("email", res.email);
  formData.append("password", "invalidpassword");
  formData.append("remember", "on");
  const result = await verifyPassword(formData);

  expect(result.errors?.email).toEqual("Invalid email or password");
});
