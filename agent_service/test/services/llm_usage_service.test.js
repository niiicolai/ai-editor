import LlmUsageService from "../../src/services/llm_usage_service.js";
import UserModel from "../../src/mongodb/models/user_model.js";
import LlmUsageModel from "../../src/mongodb/models/llm_usage_model.js";
import AvailableLllmModel from "../../src/mongodb/models/available_llm_model.js";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const _id = new ObjectId().toString();
const userId = new ObjectId().toString();
const llmId = new ObjectId().toString();

beforeAll(async () => {
  await AvailableLllmModel.deleteMany();
  await LlmUsageModel.deleteMany();
  await UserModel.deleteMany();
  await UserModel.create({
    _id: userId,
    username: "testcvxxcv55",
    email: "test@55texcvxvcvcxst.com",
  });
  await AvailableLllmModel.create({
    _id: llmId,
    name: "gpt-4o-mini",
    currency: "dollar",
    description: "description",
    cost_per_input_token: 1,
    cost_per_output_token: 1,
    cost_per_cached_input_token: 1,
    fee_per_input_token: 1,
    fee_per_output_token: 1,
  });
  await LlmUsageModel.create({
    _id,
    llm: llmId,
    event: "ask",
    prompt_tokens: 1,
    completion_tokens: 1,
    total_tokens: 2,
    total_cost_in_dollars: 1,
    credit_cost: 1,
    credit_to_dollars_at_purchase: 1,
    cost_per_input_token_at_purchase: 1,
    cost_per_output_token_at_purchase: 1,
    fee_per_input_token_at_purchase: 1,
    fee_per_output_token_at_purchase: 1,
    cost_per_cached_input_token_at_purchase: 1,
    user_agent_session_messages: [],
    context_user_agent_session_messages: [],
    user: userId,
  });
});

test("LlmUsageService.find valid partition", async () => {
  const findResult = await LlmUsageService.find(_id, userId);

  expect(findResult.event).toBe("ask");
  expect(findResult.completion_tokens).toBe(1);
  expect(findResult.prompt_tokens).toBe(1);
  expect(findResult.total_cost_in_dollars).toBe(1);
  expect(findResult.total_tokens).toBe(2);
  expect(findResult.cost_per_input_token_at_purchase).toBe(1);
  expect(findResult.cost_per_output_token_at_purchase).toBe(1);
  expect(findResult.cost_per_cached_input_token_at_purchase).toBe(1);
  expect(findResult.credit_to_dollars_at_purchase).toBe(1);
  expect(findResult.fee_per_input_token_at_purchase).toBe(1);
  expect(findResult.fee_per_output_token_at_purchase).toBe(1);
  expect(findResult.created_at).toBeDefined();
  expect(findResult.updated_at).toBeDefined();
  expect(findResult.user.toString()).toStrictEqual(userId);
  expect(findResult._id.toString()).toStrictEqual(_id);
});

test.each([
  [
    {
      _id: "",
      userId,
      fields: ["_id"],
      e: "_id is required",
    },
  ],
  [
    {
      _id: "123",
      userId,
      fields: ["_id"],
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id,
      userId: "",
      fields: ["_id"],
      e: "userId is required",
    },
  ],
  [
    {
      _id,
      userId: "123",
      fields: ["_id"],
      e: "userId must be a valid ObjectId",
    },
  ],
  [
    {
      _id: new ObjectId()._id.toString(),
      userId,
      fields: ["not_a_valid_field"],
      e: "invalid field not_a_valid_field. Allowed fields are _id, llm, user, event, user_agent_session_messages, context_user_agent_session_messages, credit_to_dollars_at_purchase, cost_per_input_token_at_purchase, cost_per_output_token_at_purchase, fee_per_input_token_at_purchase, fee_per_output_token_at_purchase, cost_per_cached_input_token_at_purchase, total_cost_in_dollars, prompt_tokens, completion_tokens, total_tokens, credit_cost, created_at, updated_at",
    },
  ],
])(
  "LlmUsageService.find invalid partitions",
  async ({ _id, userId, fields, e }) => {
    await expect(
      LlmUsageService.find(_id, userId, fields)
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
  "LlmUsageService.findAll valid partitions",
  async ({ page, limit, userId, fields }) => {
    const data = await LlmUsageService.findAll(page, limit, userId, fields);

    expect(data.limit).toBeDefined();
    expect(data.page).toBeDefined();
    expect(data.pages).toBeDefined();
    expect(data.total).toBeDefined();
    expect(data.usages).toBeDefined();
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
      e: "invalid field not_a_valid_field. Allowed fields are _id, llm, user, event, user_agent_session_messages, context_user_agent_session_messages, credit_to_dollars_at_purchase, cost_per_input_token_at_purchase, cost_per_output_token_at_purchase, fee_per_input_token_at_purchase, fee_per_output_token_at_purchase, cost_per_cached_input_token_at_purchase, total_cost_in_dollars, prompt_tokens, completion_tokens, total_tokens, credit_cost, created_at, updated_at",
    },
  ],
])(
  "LlmUsageService.findAll invalid partitions",
  async ({ page, limit, userId, fields, e }) => {
    await expect(
      LlmUsageService.findAll(page, limit, userId, fields)
    ).rejects.toThrowError(e);
  }
);

test.each([
  [
    {
      body: {
        event: "ask",
        prompt_tokens: 1,
        completion_tokens: 1,
        total_tokens: 2,
        llm: llmId,
      },
      userId,
    },
  ],
])("LlmUsageService.create valid partitions", async ({ body, userId }) => {
  const data = await LlmUsageService.create(body, userId);

  expect(data.event).toBe(body.event);
  expect(data.completion_tokens).toBe(body.completion_tokens);
  expect(data.prompt_tokens).toBe(body.prompt_tokens);
  expect(data.total_tokens).toBe(body.total_tokens);
  expect(data.created_at).toBeDefined();
  expect(data.updated_at).toBeDefined();
  expect(data.user.toString()).toStrictEqual(userId);
  expect(data._id).toBeDefined();
});

test.each([
  [
    {
      body: {
        event: "",
        prompt_tokens: 1,
        completion_tokens: 1,
        total_tokens: 2,
        llm: llmId,
      },
      userId,
      e: "body.event is required",
    },
  ],
  [
    {
      body: {
        event: "ask",
        prompt_tokens: -1,
        completion_tokens: 1,
        total_tokens: 2,
        llm: llmId,
      },
      userId,
      e: "body.prompt_tokens -1 out of bounds. Min body.prompt_tokens is 0",
    },
  ],
  [
    {
      body: {
        event: "ask",
        prompt_tokens: 100001,
        completion_tokens: 1,
        total_tokens: 2,
        llm: llmId,
      },
      userId,
      e: "body.prompt_tokens 100001 out of bounds. Max body.prompt_tokens is 100000",
    },
  ],
  [
    {
      body: {
        event: "ask",
        prompt_tokens: 1,
        completion_tokens: -1,
        total_tokens: 2,
        llm: llmId,
      },
      userId,
      e: "body.completion_tokens -1 out of bounds. Min body.completion_tokens is 0",
    },
  ],
  [
    {
      body: {
        event: "ask",
        prompt_tokens: 1,
        completion_tokens: 100001,
        total_tokens: 2,
        llm: llmId,
      },
      userId,
      e: "body.completion_tokens 100001 out of bounds. Max body.completion_tokens is 100000",
    },
  ],
  [
    {
      body: {
        event: "ask",
        prompt_tokens: 1,
        completion_tokens: 1,
        total_tokens: -1,
        llm: llmId,
      },
      userId,
      e: "body.total_tokens -1 out of bounds. Min body.total_tokens is 0",
    },
  ],
  [
    {
      body: {
        event: "ask",
        prompt_tokens: 1,
        completion_tokens: 1,
        total_tokens: 200001,
        llm: llmId,
      },
      userId,
      e: "body.total_tokens 200001 out of bounds. Max body.total_tokens is 200000",
    },
  ],
  [
    {
      body: {
        event: "ask",
        prompt_tokens: 1,
        completion_tokens: 1,
        total_tokens: 1,
        llm: "",
      },
      userId,
      e: "body.llm is required",
    },
  ],
  [
    {
      body: {
        event: "ask",
        prompt_tokens: 1,
        completion_tokens: 1,
        total_tokens: 1,
        llm: "123",
      },
      userId,
      e: "body.llm must be a valid ObjectId",
    },
  ],
  [
    {
      body: {
        event: "ask",
        prompt_tokens: 1,
        completion_tokens: 1,
        total_tokens: 1,
        llm: llmId,
      },
      userId: "",
      e: "userId is required",
    },
  ],
  [
    {
      body: {
        event: "ask",
        prompt_tokens: 1,
        completion_tokens: 1,
        total_tokens: 1,
        llm: llmId,
      },
      userId: "123",
      e: "userId must be a valid ObjectId",
    },
  ],
])(
  "LlmUsageService.create invalid partitions",
  async ({ body, userId, e }) => {
    await expect(
      LlmUsageService.create(body, userId)
    ).rejects.toThrowError(e);
  }
);

test("LlmUsageService.destroy valid partition", async () => {
  const newid = new ObjectId().toString();
  await LlmUsageModel.create({
    _id: newid,
    llm: llmId,
    event: "ask",
    prompt_tokens: 1,
    completion_tokens: 1,
    total_tokens: 2,
    total_cost_in_dollars: 1,
    credit_cost: 1,
    credit_to_dollars_at_purchase: 1,
    cost_per_input_token_at_purchase: 1,
    cost_per_output_token_at_purchase: 1,
    fee_per_input_token_at_purchase: 1,
    fee_per_output_token_at_purchase: 1,
    cost_per_cached_input_token_at_purchase: 1,
    user_agent_session_messages: [],
    context_user_agent_session_messages: [],
    user: userId,
  });
  await LlmUsageService.destroy(newid, userId);

  await expect(
    LlmUsageService.find(newid, userId)
  ).rejects.toThrowError("LLM usage not found");
});

test.each([
  [
    {
      _id: "",
      userId,
      e: "_id is required",
    },
  ],
  [
    {
      _id: "123",
      userId,
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id,
      userId: "",
      e: "userId is required",
    },
  ],
  [
    {
      _id,
      userId: "123",
      e: "userId must be a valid ObjectId",
    },
  ],
])(
  "LlmUsageService.destroy invalid partitions",
  async ({ _id, userId, e }) => {
    await expect(
      LlmUsageService.destroy(_id, userId)
    ).rejects.toThrowError(e);
  }
);

