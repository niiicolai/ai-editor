import { GmailService } from "../../src/services/gmail_service.js";
import { expect, test } from "vitest";

test("GmaiLService.sendMail should return false in test env", async () => {
  const result = await GmailService.sendMail("textContent", "subject", "to@localhost");
  
  expect(process.env.NODE_ENV).toBe('test');
  expect(result).toBe(false);
});

test("GmaiLService.sendMail should return false in development env", async () => {
  process.env.NODE_ENV = 'development';
  const result = await GmailService.sendMail("textContent", "subject", "to@localhost");
  
  expect(process.env.NODE_ENV).toBe('development');
  expect(result).toBe(false);
});

test.each([
  [{ content: null, subject: 'subject', to: 'example@localhost', e: 'textContent is required' }],
  [{ content: 'content', subject: null, to: 'example@localhost', e: 'subject is required' }],
  [{ content: 'content', subject: 'subject', to: null, e: 'to is required' }],
])
("GmaiLService.sendMail invalid partitions", async ({ content, subject, to, e }) => {
    await expect(GmailService.sendMail( content, subject, to)).rejects.toThrowError(e);
});
