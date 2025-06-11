import UserService from "../../src/services/user_service";
import UserModel from "../../src/mongodb/models/user_model";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const _id = new ObjectId().toString();

beforeAll(async () => {
  await UserModel.deleteMany();
  await UserModel.create({
    _id,
    username: "test55",
    email: "test@55test.com",
    role: "member",
    logins: []
  });
})

test.each([
  [
    {
      body: {
        username: "admin",
        password: "P@11word",
        email: "a@a.a",
        role: "member",
      },
    },
  ],
  [
    {
      body: {
        username: "user12",
        password: "Dk3f$fdllm",
        email: "test@test.dk",
        role: "member",
      },
    },
  ],
  [
    {
      body: {
        username: "!brugeR3",
        password: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist321123321232",
        email: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegn@præcist321123321232etheltgenerisDbru2ern!vnsomhar100tegn.præcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212",
        role: "member",
      },
    },
  ],
  [
    {
      body: {
        username: "aaa",
        password: "Te1!stTest",
        email: "aaa@test.com",
        role: "member",
      },
    },
  ],
  [
    {
      body: {
        username: "etheltgeneriskbrugernavnsomhar50tegnpræcist1233212",
        password: "Te1!stTest",
        email: "etheltgeneriskbrugernavnsomhar50tegnpræcist1233212@test.com",
        role: "member",
      },
    },
  ],
])("UserService.create valid partitions", async ({ body }) => {
  const { user, token } = await UserService.create(body);

  expect(user.username).toBe(body.username);
  expect(user.email).toBe(body.email);
  expect(user.role).toBe(body.role);
  expect(user.created_at).toBeDefined();
  expect(user.updated_at).toBeDefined();
  expect(user._id).toBeDefined();
  expect(token).toBeDefined();
});

test.each([
  [
    {
      body: {
        username: "",
        password: "Te1!stTest",
        email: "test@test.com",
        role: "member",
      },
      e: "username is required",
    },
  ],
  [
    {
      body: {
        username: "a",
        password: "Te1!stTest",
        email: "test@test.com",
        role: "member",
      },
      e: "username a out of bounds. Min username is 3",
    },
  ],
  [
    {
      body: {
        username: "aa",
        password: "Te1!stTest",
        email: "test@test.com",
        role: "member",
      },
      e: "username aa out of bounds. Min username is 3",
    },
  ],
  [
    {
      body: {
        username: "etheltgeneriskbrugernavnsomhar50tegnpræcist12332122",
        password: "Te1!stTest",
        email: "test@test.com",
        role: "member",
      },
      e: "username etheltgeneriskbrugernavnsomhar50tegnpræcist12332122 out of bounds. Max username is 50",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "",
        email: "test@test.com",
        role: "member",
      },
      e: "password is required",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "a",
        email: "test@test.com",
        role: "member",
      },
      e: "password a out of bounds. Min password is 8",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "Aa",
        email: "test@test.com",
        role: "member",
      },
      e: "password Aa out of bounds. Min password is 8",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "Aa1",
        email: "test@test.com",
        role: "member",
      },
      e: "password Aa1 out of bounds. Min password is 8",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "Aa1@",
        email: "test@test.com",
        role: "member",
      },
      e: "password Aa1@ out of bounds. Min password is 8",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "aaaaaaaa",
        email: "test@test.com",
        role: "member",
      },
      e: "Password must contain at least one digit",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "P@11wor",
        email: "test@test.com",
        role: "member",
      },
      e: "password P@11wor out of bounds. Min password is 8",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322",
        email: "test@test.com",
        role: "member",
      },
      e: "password etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322 out of bounds. Max password is 100",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "Te1!stTest",
        email: "",
        role: "member",
      },
      e: "email is required",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "Te1!stTest",
        email: "a@a.",
        role: "member",
      },
      e: "email a@a. out of bounds. Min email is 5",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "Te1!stTest",
        email: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegn@præcist321123321232etheltgenerisDbru2ern!vnsomhar100tegn.præcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322",
        role: "member",
      },
      e: "email etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegn@præcist321123321232etheltgenerisDbru2ern!vnsomhar100tegn.præcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322 out of bounds. Max email is 200",
    },
  ],
  [
    {
      body: {
        username: "te2st",
        password: "Te1!stTest",
        email: "aaaaaaaaaaaa",
        role: "member",
      },
      e: "email aaaaaaaaaaaa does not match the required pattern",
    },
  ],
  [
    {
      body: {
        username: "te2st",
        password: "Te1!stTest",
        email: "a@aaa",
        role: "member",
      },
      e: "email a@aaa does not match the required pattern",
    },
  ],
  [
    {
      body: {
        username: "te2st",
        password: "Te1!stTest",
        email: "aa.aa",
        role: "member",
      },
      e: "email aa.aa does not match the required pattern",
    },
  ],
  [
    {
      body: {
        username: "test",
        password: "Te1!stTest",
        email: "test@test.com",
        role: "",
      },
      e: "role is required",
    },
  ],
])("UserService.create invalid partitions", async ({ body, e }) => {
  await expect(UserService.create(body)).rejects.toThrowError(e);
});

test("UserService.find valid partition", async () => {
  const findResult = await UserService.find(_id);

  expect(findResult.username).toBe("test55");
  expect(findResult.email).toBe("test@55test.com");
  expect(findResult.role).toBe("member");
  expect(findResult.created_at).toBeDefined();
  expect(findResult.updated_at).toBeDefined();
  expect(findResult._id.toString()).toStrictEqual(_id);
});

test.each([
  [
    {
      _id: "",
      fields: ["_id"],
      e: "_id is required",
    },
  ],
  [
    {
      _id: "123",
      fields: ["_id"],
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id: new ObjectId()._id.toString(),
      fields: ["not_a_valid_field"],
      e: "invalid field not_a_valid_field. Allowed fields are _id, username, email, role, created_at, updated_at, logins.type, logins.created_at, logins.updated_at",
    },
  ],
])("UserService.find invalid partitions", async ({ _id, fields, e }) => {
  await expect(UserService.find(_id, fields)).rejects.toThrowError(e);
});

test.each([
  [
    {
      body: {
        username: "test4",
        password: "Te1!4stTest",
        email: "test@4test.com",
      },
    },
  ],
])("UserService.update valid partitions", async ({ body }) => {
  const updateResult = await UserService.update(_id, body);

  expect(updateResult.username).toBe(body.username);
  expect(updateResult.email).toBe(body.email);
  expect(updateResult.role).toBe("member");
  expect(updateResult._id.toString()).toStrictEqual(_id);
  expect(updateResult.created_at).toBeDefined();
  expect(updateResult.updated_at).toBeDefined();
});
