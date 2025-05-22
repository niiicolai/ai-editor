import AvailableLlmModel from "../../src/mongodb/models/available_llm_model.js";
import AvailableLlmService from "../../src/services/available_llm_service.js";
import { expect, test, beforeAll } from "vitest";
import { ObjectId } from "mongodb";

const _id = new ObjectId().toString();
const name = new Date().toLocaleString();

beforeAll(async () => {
  await AvailableLlmModel.deleteMany();
  await AvailableLlmModel.create({
    _id,
    name,
    currency: "test",
    description: "test",
    cost_per_input_token: 1,
    cost_per_output_token: 1,
    cost_per_cached_input_token: 1,
    fee_per_input_token: 1,
    fee_per_output_token: 1,
  });
});

test.each([[{ page: 1, limit: 1 }]])(
  "AvailableLlmService.findAll valid partitions",
  async ({ page, limit }) => {
    const findAllResult = await AvailableLlmService.findAll(page, limit);

    expect(findAllResult.total).toBe(1);
    expect(findAllResult.pages).toBe(1);
    expect(findAllResult.page).toBe(page);
    expect(findAllResult.limit).toBe(limit);
    expect(findAllResult.llms[0].name).toBe(name);
    expect(findAllResult.llms[0].description).toBe("test");
    expect(findAllResult.llms[0].cost_per_input_token).toBe(1);
    expect(findAllResult.llms[0].cost_per_output_token).toBe(1);
    expect(findAllResult.llms[0].cost_per_cached_input_token).toBe(1);
    expect(findAllResult.llms[0].fee_per_input_token).toBe(1);
    expect(findAllResult.llms[0].fee_per_output_token).toBe(1);
  }
);

test.each([
  [
    {
      page: 0,
      limit: 1,
      e: "page 0 out of bounds. Min page is 1",
    },
  ],
  [
    {
      page: 1,
      limit: 0,
      e: "limit 0 out of bounds. Min limit is 1",
    },
  ],
  [
    {
      page: 1,
      limit: 101,
      e: "limit 101 out of bounds. Max limit is 100",
    },
  ],
])("AvailableLlmService.findAll invalid partitions", async ({ page, limit, e }) => {
  await expect(AvailableLlmService.findAll(page, limit)).rejects.toThrowError(e);
});

test("AvailableLlmService.find valid partition",
  async () => {
    const findAllResult = await AvailableLlmService.findAll(1, 1);
    const findResult = await AvailableLlmService.find(findAllResult.llms[0]._id.toString());

    expect(findResult.name).toBe(name);
    expect(findResult.description).toBeDefined();
    expect(findResult.cost_per_input_token).toBeDefined();
    expect(findResult.cost_per_output_token).toBeDefined();
    expect(findResult.cost_per_cached_input_token).toBeDefined();
    expect(findResult.fee_per_input_token).toBeDefined();
    expect(findResult.fee_per_output_token).toBeDefined();
  }
);

test.each([
  [
    {
      _id: "Aa",
      fields: ['_id'],
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id: "",
      fields: ['_id'],
      e: "_id is required",
    },
  ],
  [
    {
      _id: _id,
      fields: ['not_a_real_field'],
      e: "invalid field not_a_real_field. Allowed fields are _id, name, description, cost_per_input_token, cost_per_output_token, cost_per_cached_input_token, fee_per_input_token, fee_per_output_token, created_at, updated_at",
    },
  ],
])("AvailableLlmService.find invalid partitions", async ({ _id, fields, e }) => {
  await expect(AvailableLlmService.find(_id, fields)).rejects.toThrowError(e);
});
