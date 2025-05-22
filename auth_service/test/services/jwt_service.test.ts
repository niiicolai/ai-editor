import JwtService from "../../src/services/jwt_service";
import jwt from 'jsonwebtoken';
import { expect, test } from "vitest";

const token = jwt.sign({ _id: "Aa", role: "member" }, process.env.JWT_SECRET as string)

test.each([
  [{ payload: { _id: "Aa", role: "member" }, options: { expires: true } }],
  [{ payload: { _id: "Aa", role: "member" }, options: { expires: false } }],
])("JwtService.sign valid partitions", ({ payload, options }) => {
  const token = JwtService.sign(payload, options);

  expect(token).toBeDefined();
});

test("JwtService.verify valid partitions", () => {
  const decoded = JwtService.verify(token);

  expect(decoded._id).toBe("Aa");
  expect(decoded.role).toBe("member");
});

