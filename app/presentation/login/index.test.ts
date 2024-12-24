import { ExtendedTestContext } from "test/setup-test-env";
import { action } from "./index";

const DEFAULT_MAIL = "bertilotti.marcos@gmail.com";
const DEFUALT_PASSWORD = "020993mb";

it("can login with valid credentials", async () => {
  const formData = new FormData();

  formData.append("email", DEFAULT_MAIL);
  formData.append("password", DEFUALT_PASSWORD);

  const request = new Request("https://localhost:3000/login", {
    method: "POST",
    body: formData,
  });

  const res = await action({ request, params: {}, context: {} });

  expect(res.status).toBe(302);
});

it("fail with invalid credentials", async () => {
  const formData = new FormData();

  formData.append("email", DEFAULT_MAIL);
  formData.append("password", "1234578");

  const request = new Request("https://localhost:3000/login", {
    method: "POST",
    body: formData,
  });

  const res = await action({ request, params: {}, context: {} });

  expect(res.status).toBe(400);
});

it("fail when no password is given", async () => {
  const formData = new FormData();

  formData.append("email", DEFAULT_MAIL);

  const request = new Request("https://localhost:3000/login", {
    method: "POST",
    body: formData,
  });

  const res = await action({ request, params: {}, context: {} });

  expect(res.status).toBe(400);
});

it("fail when no email is given", async () => {
  const formData = new FormData();

  formData.append("password", DEFUALT_PASSWORD);

  const request = new Request("https://localhost:3000/login", {
    method: "POST",
    body: formData,
  });

  const res = await action({ request, params: {}, context: {} });

  expect(res.status).toBe(400);
});
