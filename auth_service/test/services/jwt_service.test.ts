import JwtService from "../../src/services/jwt_service";
import { expect, test } from "vitest";

test.each([
  [{ payload: { _id: "Aa", role: "member" }, options: { expires: true } }],
  [{ payload: { _id: "Aa", role: "member" }, options: { expires: false } }],
])("JwtService.sign valid partitions", ({ payload, options }) => {
  const token = JwtService.sign(payload, options);

  expect(token).toBeDefined();
});

test.each([
  [{ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJBYSIsInJvbGUiOiJtZW1iZXIiLCJpYXQiOjE3NDc4NzU5MzF9.xFIOdcWSmQvWwYODuuk4OQ1MNHcNmPSAJ5XW0BeQvl0" }],
])("JwtService.verify valid partitions", ({ token }) => {
  const decoded = JwtService.verify(token);

  expect(decoded._id).toBe("Aa");
  expect(decoded.role).toBe("member");
});

