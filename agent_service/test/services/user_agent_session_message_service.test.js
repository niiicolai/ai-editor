import UserAgentSessionMessageService from "../../src/services/user_agent_session_message_service.js";
import UserModel from "../../src/mongodb/models/user_model.js";
import UserAgentSessionMessageModel from "../../src/mongodb/models/user_agent_session_message_model.js";
import UserAgentSessionModel from "../../src/mongodb/models/user_agent_session_model.js";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const _id = new ObjectId().toString();
const sessionId = new ObjectId().toString();
const userId = new ObjectId().toString();

beforeAll(async () => {
  await UserAgentSessionMessageModel.deleteMany();
  await UserAgentSessionModel.deleteMany();
  await UserModel.deleteMany();
  await UserModel.create({
    _id: userId,
    username: "test552",
    email: "test@552test.com",
  });
  await UserAgentSessionModel.create({
    _id: sessionId,
    title: "test",
    user: userId,
  });
  await UserAgentSessionMessageModel.create({
    _id,
    content: "test",
    code: "test",
    role: "user",
    state: "completed",
    user_agent_session: sessionId,
    user: userId,
  });
});

test("UserAgentSessionMessageService.find valid partition", async () => {
  const findResult = await UserAgentSessionMessageService.find(_id, userId);

  expect(findResult.content).toBe("test");
  expect(findResult.code).toBe("test");
  expect(findResult.role).toBe("user");
  expect(findResult.state).toBe("completed");
  expect(findResult.user_agent_session.toString()).toBe(sessionId);
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
      e: "invalid field not_a_valid_field. Allowed fields are _id, content, code, clientFn, markdown, role, state, user_files, user_agent_session, user, created_at, updated_at",
    },
  ],
])(
  "UserAgentSessionMessageService.find invalid partitions",
  async ({ _id, user, fields, e }) => {
    await expect(
      UserAgentSessionMessageService.find(_id, user, fields)
    ).rejects.toThrowError(e);
  }
);

test.each([
  [
    {
      sessionId,
      page: 1,
      limit: 1,
      userId,
      fields: ["_id"],
    },
  ],
  [
    {
      sessionId,
      page: 1,
      limit: 1,
      userId,
      fields: null,
    },
  ],
])(
  "UserAgentSessionMessageService.findAll valid partitions",
  async ({ sessionId, page, limit, userId, fields }) => {
    const data = await UserAgentSessionMessageService.findAll(
      sessionId,
      page,
      limit,
      userId,
      fields
    );

    expect(data.limit).toBeDefined();
    expect(data.page).toBeDefined();
    expect(data.pages).toBeDefined();
    expect(data.total).toBeDefined();
    expect(data.messages).toBeDefined();
  }
);

test.each([
  [
    {
      sessionId: "",
      page: 1,
      limit: 1,
      userId,
      fields: ["_id"],
      e: "sessionId is required",
    },
  ],
  [
    {
      sessionId: new ObjectId()._id.toString(),
      page: 1,
      limit: 1,
      userId: "",
      fields: ["_id"],
      e: "userId is required",
    },
  ],
  [
    {
      sessionId: new ObjectId()._id.toString(),
      page: 1,
      limit: 1,
      userId: "123",
      fields: ["_id"],
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      sessionId: "123",
      page: 1,
      limit: 1,
      userId,
      fields: ["_id"],
      e: "sessionId must be a valid ObjectId",
    },
  ],
  [
    {
      sessionId: new ObjectId()._id.toString(),
      userId,
      page: 1,
      limit: 1,
      fields: ["not_a_valid_field"],
      e: "invalid field not_a_valid_field. Allowed fields are _id, content, code, clientFn, markdown, role, state, user_files, user_agent_session, user, created_at, updated_at",
    },
  ],
])(
  "UserAgentSessionMessageService.findAll invalid partitions",
  async ({ sessionId, page, limit, userId, fields, e }) => {
    await expect(
      UserAgentSessionMessageService.findAll(
        sessionId,
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
        role: "user",
        userAgentSessionId: sessionId,
        context: {
          content: "a",
        },
      },
      userId,
    },
  ],
  [
    {
      body: {
        role: "user",
        userAgentSessionId: sessionId,
        context: {
          content: "aa",
        },
      },
      userId,
    },
  ],
  [
    {
      body: {
        role: "user",
        userAgentSessionId: sessionId,
        context: {
          content: "1a@",
        },
      },
      userId,
    },
  ],
])(
  "UserAgentSessionMessageService.create valid partitions",
  async ({ body, userId }) => {
    const data = await UserAgentSessionMessageService.create(body, userId);

    expect(data.created_at).toBeDefined();
    expect(data.updated_at).toBeDefined();
    expect(data._id).toBeDefined();
    expect(data.role).toBe(body.role);
    expect(data.user_agent_session.toString()).toBe(body.userAgentSessionId);
    expect(data.user.toString()).toBe(userId);
    expect(data.content).toBe(body.context.content);
  }
);

test.each([
  [
    {
      body: {
        role: "",
        userAgentSessionId: sessionId,
        context: {
          content: "a",
        },
      },
      userId,
      e: "body.role is required",
    },
  ],
  [
    {
      body: {
        role: "test",
        userAgentSessionId: sessionId,
        context: {
          content: "a",
        },
      },
      userId,
      e: "body.role test does not match the required pattern",
    },
  ],
  [
    {
      body: {
        role: "user",
        userAgentSessionId: "",
        context: {
          content: "a",
        },
      },
      userId,
      e: "body.userAgentSessionId is required",
    },
  ],
  [
    {
      body: {
        role: "user",
        userAgentSessionId: "123",
        context: {
          content: "a",
        },
      },
      userId,
      e: "body.userAgentSessionId must be a valid ObjectId",
    },
  ],
  [
    {
      body: {
        role: "user",
        userAgentSessionId: sessionId,
        context: {
          content: "a",
        },
      },
      userId: "",
      e: "userId is required",
    },
  ],
  [
    {
      body: {
        role: "user",
        userAgentSessionId: sessionId,
        context: {
          content: "a",
        },
      },
      userId: "123",
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      body: {
        role: "user",
        userAgentSessionId: sessionId,
        context: {
          content: "",
        },
      },
      userId,
      e: "body.context.content is required",
    },
  ],
  [
    {
      body: {
        role: "user",
        userAgentSessionId: sessionId,
        context: {
          content: 12,
        },
      },
      userId,
      e: "body.context.content must be a string",
    },
  ],
  [
    {
      body: {
        role: "user",
        userAgentSessionId: sessionId,
        context: {
          content: "a",
          code: 12,
        },
      },
      userId,
      e: "body.context.code must be a string",
    },
  ],
  [
    {
      body: {
        role: "user",
        userAgentSessionId: sessionId,
        context: {
          content: "a",
          code: "12",
          clientFn: {
            name: 12,
            args: "test",
          },
        },
      },
      userId,
      e: "body.context.clientFn.name must be a string",
    },
  ],
  [
    {
      body: {
        role: "user",
        userAgentSessionId: sessionId,
        context: {
          content: "a",
          code: "12",
          clientFn: {
            name: "12",
            args: 12,
          },
        },
      },
      userId,
      e: "body.context.clientFn.args must be a string",
    },
  ],
])(
  "UserAgentSessionMessageService.create invalid partitions",
  async ({ body, userId, e }) => {
    await expect(
      UserAgentSessionMessageService.create(body, userId)
    ).rejects.toThrowError(e);
  }
);

test("UserAgentSessionMessageService.update valid partition", async () => {
  const result = await UserAgentSessionMessageService.update(
    _id,
    {
      content: "123",
      code: "123",
      state: "failed",
      clientFn: {
        name: "123",
        args: "123",
      },
    },
    userId
  );

  expect(result.content).toBe("123");
  expect(result.code).toBe("123");
  expect(result.role).toBe("user");
  expect(result.state).toBe("failed");
  expect(result.user_agent_session.toString()).toBe(sessionId);
  expect(result.user.toString()).toBe(userId);
  expect(result.created_at).toBeDefined();
  expect(result.updated_at).toBeDefined();
  expect(result._id.toString()).toStrictEqual(_id);
});

test.each([
  [
    {
      _id: '',
      body: {
        content: "123",
        code: "123",
        state: "failed",
        clientFn: {
          name: "123",
          args: "123",
        },
      },
      userId,
      e: "_id is required",
    },
  ],
  [
    {
      _id: '123',
      body: {
        content: "123",
        code: "123",
        state: "failed",
        clientFn: {
          name: "123",
          args: "123",
        },
      },
      userId,
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id,
      body: {
        content: "123",
        code: "123",
        state: "failed",
        clientFn: {
          name: "123",
          args: "123",
        },
      },
      userId: '',
      e: "userId is required",
    },
  ],
  [
    {
      _id,
      body: {
        content: "123",
        code: "123",
        state: "failed",
        clientFn: {
          name: "123",
          args: "123",
        },
      },
      userId: '123',
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      _id,
      body: {
        content: 123,
        code: "123",
        state: "failed",
        clientFn: {
          name: "123",
          args: "123",
        },
      },
      userId,
      e: "body.content must be a string",
    },
  ],
  [
    {
      _id,
      body: {
        content: "123",
        code: 123,
        state: "failed",
        clientFn: {
          name: "123",
          args: "123",
        },
      },
      userId,
      e: "body.code must be a string",
    },
  ],
  [
    {
      _id,
      body: {
        content: "123",
        code: "123",
        state: "failed",
        clientFn: {
          name: 123,
          args: "123",
        },
      },
      userId,
      e: "body.clientFn.name must be a string",
    },
  ],
  [
    {
      _id,
      body: {
        content: "123",
        code: "123",
        state: "failed",
        clientFn: {
          name: "123",
          args: 123,
        },
      },
      userId,
      e: "body.clientFn.args must be a string",
    },
  ],
  [
    {
      _id,
      body: {
        content: "123",
        code: "123",
        state: "wrong_state",
        clientFn: {
          name: "123",
          args: "123",
        },
      },
      userId,
      e: "body.state wrong_state does not match the required pattern",
    },
  ],
])(
  "UserAgentSessionMessageService.update invalid partitions",
  async ({ _id, body, userId, e }) => {
    await expect(
      UserAgentSessionMessageService.update(_id, body, userId)
    ).rejects.toThrowError(e);
  }
);

test("UserAgentSessionMessageService.destroy valid partition", async () => {
  const newid = new ObjectId().toString();
  await UserAgentSessionMessageModel.create({
    _id: newid,
    content: "test",
    code: "test",
    role: "user",
    state: "completed",
    user_agent_session: sessionId,
    user: userId,
  });
  await UserAgentSessionMessageService.destroy(
    newid,
    userId
  );

  await expect(
      UserAgentSessionMessageService.find(newid, userId)
    ).rejects.toThrowError("user agent session message not found");
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
  "UserAgentSessionMessageService.destroy invalid partitions",
  async ({ _id, userId, e }) => {
    await expect(
      UserAgentSessionMessageService.destroy(_id, userId)
    ).rejects.toThrowError(e);
  }
);
