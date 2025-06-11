import UserAgentSessionOperationService from "../../src/services/user_agent_session_operation_service.js";
import UserModel from "../../src/mongodb/models/user_model.js";
import UserAgentSessionMessageModel from "../../src/mongodb/models/user_agent_session_message_model.js";
import UserAgentSessionModel from "../../src/mongodb/models/user_agent_session_model.js";
import UserAgentSessionOperationModel from "../../src/mongodb/models/user_agent_session_operation_model.js";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const _id = new ObjectId().toString();
const messageId = new ObjectId().toString();
const userId = new ObjectId().toString();
const sessionId = new ObjectId().toString();

beforeAll(async () => {
  await UserAgentSessionOperationModel.deleteMany();
  await UserAgentSessionMessageModel.deleteMany();
  await UserAgentSessionModel.deleteMany();
  await UserModel.deleteMany();
  await UserModel.create({
    _id: userId,
    username: "test55fff",
    email: "test@55tffest.com",
  });
  await UserAgentSessionModel.create({
    _id: sessionId,
    title: "test",
    user: userId,
  });
  await UserAgentSessionMessageModel.create({
    _id: messageId,
    content: "test",
    code: "test",
    role: "user",
    state: "completed",
    user_agent_session: sessionId,
    user: userId,
  });
  await UserAgentSessionOperationModel.create({
    _id,
    name: "test",
    state: "completed",
    max_iterations: 5,
    user_agent_session: sessionId,
    user: userId,
  });
});

test("UserAgentSessionOperationService.find valid partition", async () => {
  const findResult = await UserAgentSessionOperationService.find(_id, userId);

  expect(findResult.name).toBe("test");
  expect(findResult.state).toBe("completed");
  expect(findResult.max_iterations).toBe(5);
  expect(findResult.user.toString()).toBe(userId);
  expect(findResult.user_agent_session.toString()).toBe(sessionId);
  expect(findResult.created_at).toBeDefined();
  expect(findResult.updated_at).toBeDefined();
  expect(findResult.iterations).toStrictEqual([]);
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
      e: "invalid field not_a_valid_field. Allowed fields are _id, name, max_iterations, state, user_agent_session, iterations, user, created_at, updated_at",
    },
  ],
])(
  "UserAgentSessionOperationService.find invalid partitions",
  async ({ _id, user, fields, e }) => {
    await expect(
      UserAgentSessionOperationService.find(_id, user, fields)
    ).rejects.toThrowError(e);
  }
);

test.each([
  [
    {
      page: 1,
      limit: 1,
      sessionId,
      userId,
      state: "completed",
      fields: ["_id"],
    },
  ],
  [
    {
      page: 1,
      limit: 1,
      sessionId,
      userId,
      state: null,
      fields: null,
    },
  ],
])(
  "UserAgentSessionOperationService.findAll valid partitions",
  async ({ page, limit, sessionId, userId, state, fields }) => {
    const data = await UserAgentSessionOperationService.findAll(
      page,
      limit,
      sessionId,
      userId,
      state,
      fields
    );

    expect(data.limit).toBeDefined();
    expect(data.page).toBeDefined();
    expect(data.pages).toBeDefined();
    expect(data.total).toBeDefined();
    expect(data.operations).toBeDefined();
  }
);

test.each([
  [
    {
      page: 1,
      limit: 1,
      sessionId,
      userId: "",
      state: "completed",
      fields: ["_id"],
      e: "userId is required",
    },
  ],
  [
    {
      page: 1,
      limit: 1,
      sessionId,
      userId: "123",
      state: "completed",
      fields: ["_id"],
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      page: 1,
      limit: 1,
      sessionId,
      userId,
      state: "completed",
      fields: ["not_a_valid_field"],
      e: "invalid field not_a_valid_field. Allowed fields are _id, name, max_iterations, state, user_agent_session, iterations, user, created_at, updated_at",
    },
  ],
  [
    {
      page: 1,
      limit: 1,
      sessionId: "",
      userId,
      state: "completed",
      fields: ["_id"],
      e: "sessionId is required",
    },
  ],
  [
    {
      page: 1,
      limit: 1,
      sessionId: "123",
      userId,
      state: "completed",
      fields: ["_id"],
      e: "sessionId must be a valid ObjectId",
    },
  ],
  [
    {
      page: 1,
      limit: 1,
      sessionId,
      userId,
      state: "wrong_state",
      fields: ["_id"],
      e: "state wrong_state does not match the required pattern",
    },
  ],
  [
    {
      page: "1",
      limit: 1,
      sessionId,
      userId,
      state: "completed",
      fields: ["_id"],
      e: "page must be a number",
    },
  ],
  [
    {
      page: 1,
      limit: "1",
      sessionId,
      userId,
      state: "completed",
      fields: ["_id"],
      e: "limit must be a number",
    },
  ],
  [
    {
      page: 1,
      limit: 5000,
      sessionId,
      userId,
      state: "completed",
      fields: ["_id"],
      e: "limit 5000 out of bounds. Max limit is 100",
    },
  ],
  [
    {
      page: 0,
      limit: 1,
      sessionId,
      userId,
      state: "completed",
      fields: ["_id"],
      e: "page 0 out of bounds. Min page is 1",
    },
  ],
])(
  "UserAgentSessionOperationService.findAll invalid partitions",
  async ({ page, limit, sessionId, userId, state, fields, e }) => {
    await expect(
      UserAgentSessionOperationService.findAll(
        page,
        limit, 
        sessionId,
        userId, 
        state,
        fields
      )
    ).rejects.toThrowError(e);
  }
);

test.each([
  [
    {
      body: {
        name: "aa",
        state: "running",
        max_iterations: 5,
        iterations: [],
      },
      sessionId,
      userId,
    },
  ],
  [
    {
      body: {
        name: "aaa",
        state: "completed",
        max_iterations: 5,
        iterations: [],
      },
      sessionId,
      userId,
    },
  ],
  [
    {
      body: {
        name: "a1@",
        state: "error",
        max_iterations: 5,
        iterations: [],
      },
      sessionId,
      userId,
    },
  ],
  [
    {
      body: {
        name: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist321123321232",
        state: "running",
        max_iterations: 5,
        iterations: [],
      },
      sessionId,
      userId,
    },
  ],
])(
  "UserAgentSessionOperationService.create valid partitions",
  async ({ body, sessionId, userId }) => {
    const data = await UserAgentSessionOperationService.create(body, sessionId, userId);

    expect(data.name).toBe(body.name);
    expect(data.state).toBe(body.state);
    expect(data.max_iterations).toBe(body.max_iterations);
    expect(data.user.toString()).toBe(userId);
    expect(data.user_agent_session.toString()).toBe(sessionId);
    expect(data.created_at).toBeDefined();
    expect(data.updated_at).toBeDefined();
    expect(data._id).toBeDefined();
    expect(data.iterations).toStrictEqual([]);
  }
);

test.each([
  [
    {
      body: {
        name: "",
        state: "completed",
        max_iterations: 5,
        iterations: [],
      },
      sessionId,
      userId,
      e: "body.name is required",
    },
  ],
  [
    {
      body: {
        name: "a",
        state: "completed",
        max_iterations: 5,
        iterations: [],
      },
      sessionId,
      userId,
      e: "body.name a out of bounds. Min body.name is 2",
    },
  ],
  [
    {
      body: {
        name: 1,
        state: "completed",
        max_iterations: 5,
        iterations: [],
      },
      sessionId,
      userId,
      e: "body.name must be a string",
    },
  ],
  [
    {
      body: {
        name: "etheltgenerisDbru2ern!etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322",
        state: "completed",
        max_iterations: 5,
        iterations: [],
      },
      sessionId,
      userId,
      e: "body.name etheltgenerisDbru2ern!etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322 out of bounds. Max body.name is 250",
    },
  ],
  [
    {
      body: {
        name: "123",
        state: "completed",
        max_iterations: 0,
        iterations: [],
      },
      sessionId,
      userId,
      e: "body.max_iterations 0 out of bounds. Min body.max_iterations is 1",
    },
  ],
  [
    {
      body: {
        name: "123",
        state: "completed",
        max_iterations: 11,
        iterations: [],
      },
      sessionId,
      userId,
      e: "body.max_iterations 11 out of bounds. Max body.max_iterations is 10",
    },
  ],
])(
  "UserAgentSessionOperationService.create invalid partitions",
  async ({ body, sessionId, userId, e }) => {
    await expect(
      UserAgentSessionOperationService.create(body, sessionId, userId)
    ).rejects.toThrowError(e);
  }
);

test.each([
  [
    {
      _id,
      body: {
        name: "aa",
        state: "running",
        iterations: [],
      },
      userId,
    },
  ],
  [
    {
      _id,
      body: {
        name: "aaa",
        state: "completed",
        iterations: [],
      },
      userId,
    },
  ],
  [
    {
      _id,
      body: {
        name: "a1@",
        state: "error",
        iterations: [],
      },
      userId,
    },
  ],
  [
    {
      _id,
      body: {
        name: "etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist321123321232",
        state: "running",
        iterations: [],
      },
      userId,
    },
  ],
])(
  "UserAgentSessionOperationService.update valid partitions",
  async ({ _id, body, userId }) => {
    const data = await UserAgentSessionOperationService.update(_id, body, userId);

    expect(data.name).toBe(body.name);
    expect(data.state).toBe(body.state);
    expect(data.max_iterations).toBeDefined();
    expect(data.user.toString()).toBe(userId);
    expect(data.user_agent_session.toString()).toBe(sessionId);
    expect(data.created_at).toBeDefined();
    expect(data.updated_at).toBeDefined();
    expect(data._id).toBeDefined();
    expect(data.iterations).toStrictEqual([]);
  }
);

test.each([
  [
    {
      _id,
      body: {
        name: 123,
        state: "completed",
        max_iterations: 5,
        iterations: [],
      },
      sessionId,
      userId,
      e: "body.name must be a string",
    },
  ],
  [
    {
      _id,
      body: {
        name: "a",
        state: "completed",
        max_iterations: 5,
        iterations: [],
      },
      sessionId,
      userId,
      e: "body.name a out of bounds. Min body.name is 2",
    },
  ],
  [
    {
      _id,
      body: {
        name: "etheltgenerisDbru2ern!etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322",
        state: "completed",
        max_iterations: 5,
        iterations: [],
      },
      sessionId,
      userId,
      e: "body.name etheltgenerisDbru2ern!etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322etheltgenerisDbru2ern!vnsomhar100tegnpræcistetheltgeneriskbrugernavnsomhar100tegnpræcist3211233212322 out of bounds. Max body.name is 250",
    },
  ],
])(
  "UserAgentSessionOperationService.update invalid partitions",
  async ({ _id, body, userId, e }) => {
    await expect(
      UserAgentSessionOperationService.update(_id, body, userId)
    ).rejects.toThrowError(e);
  }
);
