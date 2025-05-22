import TransactionModel from "../../src/mongodb/models/transaction_model.js";
import TransactionService from "../../src/services/transaction_service.js";
import { expect, test, beforeAll } from "vitest";

beforeAll(async () => {
  await TransactionModel.deleteMany();
  await TransactionModel.create({
    type: "test",
    state: "pending",
    error: "test",
    parameters: "test"
  });
});

test.each([[{ state: "pending", page: 1, limit: 1 }]])(
  "TransactionService.findAll valid partitions",
  async ({ page, limit, state }) => {
    const findAllResult = await TransactionService.findAll(page, limit, state);

    expect(findAllResult.total).toBe(1);
    expect(findAllResult.pages).toBe(1);
    expect(findAllResult.page).toBe(page);
    expect(findAllResult.limit).toBe(limit);
    expect(findAllResult.transactions[0].type).toBe("test");
    expect(findAllResult.transactions[0].state).toBe("pending");
    expect(findAllResult.transactions[0].error).toBe("test");
  }
);

test.each([
  [
    {
      state: "pending",
      page: 0,
      limit: 1,
      e: "page 0 out of bounds. Min page is 1",
    },
  ],
  [
    {
      state: "pending",
      page: 1,
      limit: 0,
      e: "limit 0 out of bounds. Min limit is 1",
    },
  ],
  [
    {
      state: "pending",
      page: 1,
      limit: 101,
      e: "limit 101 out of bounds. Max limit is 100",
    },
  ],
  [
    {
      state: "",
      page: 1,
      limit: 1,
      e: "state is required",
    },
  ],
])("TransactionService.findAll invalid partitions", async ({ page, limit, state, e }) => {
  await expect(TransactionService.findAll(page, limit, state)).rejects.toThrowError(e);
});


test("TransactionService.find valid partition",
  async () => {
    const findAllResult = await TransactionService.findAll(1, 1, "pending");
    const findResult = await TransactionService.find(findAllResult.transactions[0]._id.toString());

    expect(findResult.type).toBe("test");
    expect(findResult.state).toBe("pending");
    expect(findResult.error).toBe("test");
  }
);

test.each([
  [
    {
      _id: "Aa",
      e: "_id must be a valid ObjectId",
    },
  ],
  [
    {
      _id: "",
      e: "_id is required",
    },
  ],
])("TransactionService.find invalid partitions", async ({ _id, e }) => {
  await expect(TransactionService.find(_id)).rejects.toThrowError(e);
});