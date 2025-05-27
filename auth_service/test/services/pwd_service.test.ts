import PwdService from "../../src/services/pwd_service";
import { expect, test } from "vitest";


test.each([
    [{ password: "pEn!1ding" }],
    [{ password: "te$3sTest" }]
])(
  "PwdService.hashPassword valid partitions",
  async ({ password }) => {
    const hash = await PwdService.hashPassword(password);

    expect(hash).toBeDefined();
  }
);

test.each([
    [{ password: "", e: "Password is required" }],
    [{ password: "a", e: "Password must be at least 8 characters long" }],
    [{ password: "aaaaaaaaa", e: "Password must contain at least one digit" }],
    [{ password: "aaaaaaaa1", e: "Password must contain at least one upper case letter" }],
    [{ password: "aaaaaaaA1", e: "Password must contain at least one special character" }],
    [{ password: "1111111!11", e: "Password must contain at least one lower case letter" }],
    [{ password: "etheltgenerisDbru2ern!vnsomhar50tessssssssssssssssssssssssssssssssssssgnpræcistetheltgeneriskbrugernavnsomhar50tegnpræcist22", 
       e: "Password must be at most 100 characters long" }],
])(
  "PwdService.hashPassword invalid partitions",
  async ({ password, e }) => {
    await expect(PwdService.hashPassword(password)).rejects.toThrowError(e);
  }
);


test.each([
    [{ password: "pEn!1ding" }],
    [{ password: "te$3sTest" }]
])(
  "PwdService.comparePassword valid partitions",
  async ({ password }) => {
    const hash = await PwdService.hashPassword(password);
    const isEqual = await PwdService.comparePassword(password, hash);

    expect(isEqual).toBeTruthy();
  }
);


test.each([
    [{ password: "", hash: "aa", e: "Password is required" }],
    [{ password: "aa", hash: "", e: "HashedPassword is required" }],
])(
  "PwdService.comparePassword invalid partitions",
  async ({ password, hash, e }) => {
    await expect(PwdService.comparePassword(password, hash)).rejects.toThrowError(e);
  }
);
