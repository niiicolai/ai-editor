import UserAgentSessionService from "../../src/services/user_agent_session_service.js";
import UserModel from "../../src/mongodb/models/user_model.js";
import UserAgentSessionMessageModel from "../../src/mongodb/models/user_agent_session_message_model.js";
import UserAgentSessionModel from "../../src/mongodb/models/user_agent_session_model.js";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const _id = new ObjectId().toString();
const messageId = new ObjectId().toString();
const userId = new ObjectId().toString();

beforeAll(async () => {
  await UserAgentSessionMessageModel.deleteMany();
  await UserAgentSessionModel.deleteMany();
  await UserModel.deleteMany();
  await UserModel.create({
    _id: userId,
    username: "test55",
    email: "test@55test.com",
  });
  await UserAgentSessionModel.create({
    _id,
    title: "test",
    user: userId,
  });
  await UserAgentSessionMessageModel.create({
    _id: messageId,
    content: "test",
    code: "test",
    role: "user",
    state: "completed",
    user_agent_session: _id,
    user: userId,
  });
});

test("UserAgentSessionService.find valid partition", async () => {
  const findResult = await UserAgentSessionService.find(_id, userId);

  expect(findResult.title).toBe("test");
  expect(findResult.user.toString()).toBe(userId);
  expect(findResult.created_at).toBeDefined();
  expect(findResult.updated_at).toBeDefined();
  expect(findResult._id.toString()).toStrictEqual(_id);
});

test.each([
  [
    {
      _id: "",
      user: userId,
      fields: ["_id"],
      e: "_id is required",
    },
  ],
  [
    {
      _id: new ObjectId()._id.toString(),
      user: "",
      fields: ["_id"],
      e: "userId is required",
    },
  ],
  [
    {
      _id: new ObjectId()._id.toString(),
      user: "123",
      fields: ["_id"],
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      _id: "123",
      user: userId,
      fields: ["_id"],
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id: new ObjectId()._id.toString(),
      user: userId,
      fields: ["not_a_valid_field"],
      e: "invalid field not_a_valid_field. Allowed fields are _id, title, user, created_at, updated_at",
    },
  ],
])(
  "UserAgentSessionService.find invalid partitions",
  async ({ _id, user, fields, e }) => {
    await expect(
      UserAgentSessionService.find(_id, user, fields)
    ).rejects.toThrowError(e);
  }
);

test.each([
  [
    {
      page: 1,
      limit: 1,
      userId,
      fields: ["_id"],
    },
  ],
  [
    {
      page: 1,
      limit: 1,
      userId,
      fields: null,
    },
  ],
])(
  "UserAgentSessionService.findAll valid partitions",
  async ({ page, limit, userId, fields }) => {
    const data = await UserAgentSessionService.findAll(
      page,
      limit,
      userId,
      fields
    );

    expect(data.limit).toBeDefined();
    expect(data.page).toBeDefined();
    expect(data.pages).toBeDefined();
    expect(data.total).toBeDefined();
    expect(data.sessions).toBeDefined();
  }
);

test.each([
  [
    {
      page: 1,
      limit: 1,
      userId: "",
      fields: ["_id"],
      e: "userId is required",
    },
  ],
  [
    {
      page: 1,
      limit: 1,
      userId: "123",
      fields: ["_id"],
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      userId,
      page: 1,
      limit: 1,
      fields: ["not_a_valid_field"],
      e: "invalid field not_a_valid_field. Allowed fields are _id, title, user, created_at, updated_at",
    },
  ],
])(
  "UserAgentSessionService.findAll invalid partitions",
  async ({ page, limit, userId, fields, e }) => {
    await expect(
      UserAgentSessionService.findAll(
        page,
        limit,
        userId,
        fields
      )
    ).rejects.toThrowError(e);
  }
);

test.each([
  [
    {
      body: {
        title: "aa",
      },
      userId,
    },
  ],
  [
    {
      body: {
        title: "aaa",
      },
      userId,
    },
  ],
  [
    {
      body: {
        title: "a1@",
      },
      userId,
    },
  ],
  [
    {
      body: {
        title: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist321123321232",
      },
      userId,
    },
  ],
])(
  "UserAgentSessionService.create valid partitions",
  async ({ body, userId }) => {
    const data = await UserAgentSessionService.create(body, userId);

    expect(data.created_at).toBeDefined();
    expect(data.updated_at).toBeDefined();
    expect(data._id).toBeDefined();
    expect(data.title).toBe(body.title);
    expect(data.user.toString()).toBe(userId);
  }
);

test.each([
  [
    {
      body: {
        title: "",
      },
      userId,
      e: "body.title is required",
    },
  ],
  [
    {
      body: {
        title: "a",
      },
      userId,
      e: "body.title a out of bounds. Min body.title is 2",
    },
  ],
  [
    {
      body: {
        title: 1,
      },
      userId,
      e: "body.title must be a string",
    },
  ],
  [
    {
      body: {
        title: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322",
      },
      userId,
      e: "body.title etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322 out of bounds. Max body.title is 100",
    },
  ],
])(
  "UserAgentSessionService.create invalid partitions",
  async ({ body, userId, e }) => {
    await expect(
      UserAgentSessionService.create(body, userId)
    ).rejects.toThrowError(e);
  }
);

test.each([
  [
    {
      _id,
      body: {
        title: "aa",
      },
      userId,
    },
  ],
  [
    {
      _id,
      body: {
        title: "aaa",
      },
      userId,
    },
  ],
  [
    {
      _id,
      body: {
        title: "a1@",
      },
      userId,
    },
  ],
  [
    {
      _id,
      body: {
        title: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist321123321232",
      },
      userId,
    },
  ],
])(
  "UserAgentSessionService.update valid partitions",
  async ({ _id, body, userId }) => {
    const data = await UserAgentSessionService.update(_id, body, userId);

    expect(data.created_at).toBeDefined();
    expect(data.updated_at).toBeDefined();
    expect(data._id).toBeDefined();
    expect(data.title).toBe(body.title);
    expect(data.user.toString()).toBe(userId);
  }
);

test.each([
  [
    {
      _id,
      body: {
        title: "",
      },
      userId,
      e: "body.title is required",
    },
  ],
  [
    {
      _id,
      body: {
        title: "a",
      },
      userId,
      e: "body.title a out of bounds. Min body.title is 2",
    },
  ],
  [
    {
      _id,
      body: {
        title: 1,
      },
      userId,
      e: "body.title must be a string",
    },
  ],
  [
    {
      _id,
      body: {
        title: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322",
      },
      userId,
      e: "body.title etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322 out of bounds. Max body.title is 100",
    },
  ],
  [
    {
      _id: '',
      body: {
        title: "test",
      },
      userId,
      e: "_id is required",
    },
  ],
  [
    {
      _id: '123',
      body: {
        title: "test",
      },
      userId,
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id,
      body: {
        title: "test",
      },
      userId: '',
      e: "userId is required",
    },
  ],
  [
    {
      _id,
      body: {
        title: "test",
      },
      userId: '123',
      e: "userId must be a valid ObjectId",
    },
  ],
])(
  "UserAgentSessionService.update invalid partitions",
  async ({ _id, body, userId, e }) => {
    await expect(
      UserAgentSessionService.update(_id, body, userId)
    ).rejects.toThrowError(e);
  }
);


test("UserAgentSessionService.destroy valid partition", async () => {
  const newid = new ObjectId().toString();
  await UserAgentSessionModel.create({
    _id: newid,
    title: "test",
    user: userId,
  });
  await UserAgentSessionService.destroy(
    newid,
    userId
  );

  await expect(
      UserAgentSessionService.find(newid, userId)
    ).rejects.toThrowError("user agent session not found");
});

test.each([
  [
    {
      _id: '',
      userId,
      e: "_id is required",
    },
  ],
  [
    {
      _id: '123',
      userId,
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id,
      userId: '',
      e: "userId is required",
    },
  ],
  [
    {
      _id,
      userId: '123',
      e: "userId must be a valid ObjectId",
    },
  ],
])(
  "UserAgentSessionService.destroy invalid partitions",
  async ({ _id, userId, e }) => {
    await expect(
      UserAgentSessionService.destroy(_id, userId)
    ).rejects.toThrowError(e);
  }
);
