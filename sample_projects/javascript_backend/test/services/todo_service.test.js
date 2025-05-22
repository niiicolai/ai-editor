import TodoModel from "../../src/mongodb/models/todo_model.js";
import { TodoService } from "../../src/services/todo_service.js";
import { expect, test, beforeAll } from "vitest";

beforeAll(async () => {
  await TodoModel.deleteMany();
  await TodoModel.create({
    content: "test",
  });
});

test("TodoService.findAll valid partitions", async () => {
    const findAllResult = await TodoService.findAll();
    expect(findAllResult[0].content).toBe("test");
  }
);

test("TodoService.find valid partition",
  async () => {
    const findAllResult = await TodoService.findAll();
    const findResult = await TodoService.find(findAllResult[0]._id.toString());
    expect(findResult.content).toBe("test");
  }
);
