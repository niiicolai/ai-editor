import JobModel from "../../src/mongodb/models/job_model";
import JobService from "../../src/services/job_service";
import { expect, test, beforeAll } from "vitest";

beforeAll(async () => {
  await JobModel.deleteMany();
  await JobModel.create({
    type: "test",
    state: "pending",
    message: "test",
  });
});

test.each([[{ state: "pending", page: 1, limit: 1 }]])(
  "JobService.findAll valid partitions",
  async ({ page, limit, state }) => {
    const findAllResult = await JobService.findAll(page, limit, state);

    expect(findAllResult.total).toBe(1);
    expect(findAllResult.pages).toBe(1);
    expect(findAllResult.page).toBe(page);
    expect(findAllResult.limit).toBe(limit);
    expect(findAllResult.jobs[0].type).toBe("test");
    expect(findAllResult.jobs[0].state).toBe("pending");
    expect(findAllResult.jobs[0].message).toBe("test");
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
])("JobService.findAll invalid partitions", async ({ page, limit, state, e }) => {
  await expect(JobService.findAll(page, limit, state)).rejects.toThrowError(e);
});

test("JobService.find valid partition",
  async () => {
    const findAllResult = await JobService.findAll(1, 1, "pending");
    const findResult = await JobService.find(findAllResult.jobs[0]._id.toString());

    expect(findResult.type).toBe("test");
    expect(findResult.state).toBe("pending");
    expect(findResult.message).toBe("test");
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
])("JobService.find invalid partitions", async ({ _id, e }) => {
  await expect(JobService.find(_id)).rejects.toThrowError(e);
});
