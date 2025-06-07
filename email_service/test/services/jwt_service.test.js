import JwtService from "../../src/services/jwt_service.js";
import jwt from 'jsonwebtoken';
import { expect, test } from "vitest";

test("JwtService.verify valid partitions", () => {
  const token = jwt.sign({ _id: "Aa", role: "member" }, process.env.JWT_SECRET);
  const decoded = JwtService.verify(token);

  expect(decoded._id).toBe("Aa");
  expect(decoded.role).toBe("member");
});

test.each([
  [{ token: null, e: 'Token is required' }],
  [{ token: '', e: 'Token is required' }],
  [{ token: 12, e: 'Token must be a string' }],
])
("JwtService.verify invalid partitions", ({token, e}) => {
  expect(() => JwtService.verify(token)).toThrowError(e);
});
