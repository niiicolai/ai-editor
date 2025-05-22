import UserModel from "../../src/mongodb/models/user_model";
import UserLoginService from "../../src/services/user_login_service";
import { expect, test, beforeAll } from "vitest";

beforeAll(async () => {
    await UserModel.create({
        username: 'test',
        email: 'test@test.test',
        role: 'member',
        logins: [{
            type: 'password',
            password: '$2b$10$AcGCSTG4pKABtPFppsR8GOSJ3B4BdXuI08jb9MBmSLrla7b1vMP2i'
        }]
    })
})

test.each([
  [
    {
      body: {
        email: "test@test.test",
        password: "Te1!stTest",
      },
    },
  ],
])("UserLoginService.login valid partitions", async ({ body }) => {
  const { token } = await UserLoginService.login(body);

  expect(token).toBeDefined();
});

test.each([
  [
    {
      body: {
        email: "",
        password: "Te1!stTest"
      },
      e: "email is required",
    },
  ],
  [
    {
      body: {
        email: "test@test.test",
        password: ""
      },
      e: "password is required",
    },
  ],
  [
    {
      body: {
        email: "test@test.test_not_belonging_to_any_user",
        password: "Te1!stTest"
      },
      e: "user not found",
    },
  ],
  [
    {
      body: {
        email: "test@test.test",
        password: "1234"
      },
      e: "Invalid password",
    },
  ],
])("UserLoginService.login invalid partitions", async ({ body, e }) => {
  await expect(UserLoginService.login(body)).rejects.toThrowError(e);
});
