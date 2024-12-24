import { ExtendedTestContext } from "test/setup-test-env";
import {
  createAccount,
  deleteAccount,
  getAccountById,
  updateAccount,
} from "./";

it("can create account", async ({ integration }: ExtendedTestContext) => {
  const user = await integration.getUser();
  const currency = await integration.getCurrency(user.id);

  const formData = new FormData();
  const name = "Test Account";
  formData.append("name", name);
  formData.append("color", "red");
  formData.append("icon", "credit_card");
  formData.append("currencyId", currency.id);

  const res = await createAccount(user.id, formData);

  expect(res?.account!.id).toBeTypeOf("string");
});

it("can not create account when values are missing", async ({
  integration,
}: ExtendedTestContext) => {
  const user = await integration.getUser();
  const formData = new FormData();

  const res = await createAccount(user.id, formData);

  expect(res?.errors).toMatchObject({
    name: ["name is required"],
    color: ["color is required"],
    icon: ["icon is required"],
    currencyId: ["currency is required"],
  });
});

it("can find an account", async ({ integration }: ExtendedTestContext) => {
  const user = await integration.getUser();
  const currency = await integration.getCurrency(user.id);
  const { id } = await integration.createAccount(user.id, currency.id);
  const account = await getAccountById(user.id, id);

  expect(account).toMatchObject({ id });
});

it("findById fails with invalid id", async ({
  integration,
}: ExtendedTestContext) => {
  const user = await integration.getUser();
  const res = await getAccountById(user.id, "randomaccountid");

  expect(res).toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
});

it("can delete account", async ({ integration }: ExtendedTestContext) => {
  const user = await integration.getUser();
  const currency = await integration.getCurrency(user.id);
  const account = await integration.createAccount(user.id, currency.id);

  await deleteAccount(user.id, account.id);

  const res = await getAccountById(user.id, account.id);

  expect(res).toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
});

it("delete fails with invalid id", async ({
  integration,
}: ExtendedTestContext) => {
  const user = await integration.getUser();
  const res = await deleteAccount(user.id, "randomid");

  expect(res).toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
});

it("can update account", async ({ integration }: ExtendedTestContext) => {
  const user = await integration.getUser();
  const currency = await integration.getCurrency(user.id);
  const account = await integration.createAccount(user.id, currency.id);

  const newValues = {
    name: "updated name",
    balance: "123456",
    color: "red",
    icon: "globe",
  };
  const formData = new FormData();

  formData.append("name", newValues.name);
  formData.append("balance", newValues.balance);
  formData.append("color", newValues.color);
  formData.append("icon", newValues.icon);
  formData.append("currencyId", account.currencyId);

  const updatedAccount = await updateAccount(user.id, account.id, formData);

  expect(updatedAccount.account).toEqual(
    expect.objectContaining({
      name: newValues.name,
      color: newValues.color,
      icon: newValues.icon,
    }),
  );
  expect(Number(updatedAccount.account!.balance)).toBe(
    Number(newValues.balance),
  );
});

it("update account fails with invalid id", async ({
  integration,
}: ExtendedTestContext) => {
  const user = await integration.getUser();
  const currency = await integration.getCurrency(user.id);
  const formData = new FormData();
  formData.append("name", "name");
  formData.append("balance", "123456");
  formData.append("color", "red");
  formData.append("icon", "globe");
  formData.append("currencyId", currency.id);

  const res = await updateAccount(user.id, "randomid", formData);

  expect(res.code).toEqual("ACCOUNT_NOT_FOUND");
});
