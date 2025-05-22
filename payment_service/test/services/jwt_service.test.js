import JwtService from "../../src/services/jwt_service.js";
import jwt from 'jsonwebtoken';
import { expect, test } from "vitest";

const token = jwt.sign({ _id: "Aa", role: "member" }, process.env.JWT_SECRET)

test("JwtService.verify valid partitions", () => {
  const decoded = JwtService.verify(token);

  expect(decoded._id).toBe("Aa");
  expect(decoded.role).toBe("member");
});

