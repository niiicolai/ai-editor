import UserModel from "../../src/mongodb/models/user_model.js";
import { UserService } from "../../src/services/user_service.js";
import { expect, test, beforeAll } from "vitest";
import bcrypt from "bcrypt";

beforeAll(async () => {
  await UserModel.deleteMany();
  await UserModel.create({
    username: "test",
    password: bcrypt.hash("test", 10)
  });
});

test("UserService.findAll valid partitions", async () => {
    const findAllResult = await UserService.findAll();
    expect(findAllResult[0].username).toBe("test");
  }
);

test("UserService.find valid partition",
  async () => {
    const findAllResult = await UserService.findAll();
    const findResult = await UserService.find(findAllResult[0]._id.toString()) as any;
    expect(findResult.username).toBe("test");
  }
);
