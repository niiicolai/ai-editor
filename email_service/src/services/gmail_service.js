import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { stringValidator } from "../validators/string_validator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const CREDENTIALS_FILE = "gmail_credentials.json";
const CREDENTIALS_PATH = path.join(__dirname, "..", "..", CREDENTIALS_FILE);

const TOKEN_FILE = "gmail_token.json";
const TOKEN_PATH = path.join(__dirname, "..", "..", TOKEN_FILE);

let auth = null;

export class GmailService {
  static async loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  static async saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  static async authorize() {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  }

  static async loadAuth() {
    auth = await this.loadSavedCredentialsIfExist();
    if (!auth) {
      console.warn(
        'WARNING: No saved credentials found. Run "npm run configure:gmail" to set up Gmail API access.'
      );
      console.warn(
        "WARNING: No emails will be sent. However, for testing, you can find the e-mail content in the console."
      );
      return null;
    }
    
    console.log("INFO: Gmail API access configured and ready to send e-mails.");
    return auth;
  }

  static async sendMail(textContent, subject, to) {
    stringValidator(textContent, "textContent");
    stringValidator(subject, "subject");
    stringValidator(to, "to");

    console.warn(`DEBUG: Sending new e-mail...`);
    console.warn(`DEBUG: Email subject: ${subject}`);
    console.warn(`DEBUG: Email content: ${textContent}`);
    console.warn(`DEBUG: Email to: ${to}`);

    const environment = process.env.NODE_ENV || "development";
    if (environment !== "production") {
      console.warn("WARNING: E-mails are only sent in production mode.");
      return false;
    }

    if (!auth) {
      console.warn(
        'WARNING: No saved credentials found. Run "npm run configure:gmail" to set up Gmail API access.'
      );
      console.warn("WARNING: Unable to send e-mail.");
      return false;
    }

    const gmail = google.gmail({ version: "v1", auth });
    const raw = Buffer.from(
      `To: ${to}\n` + `Subject: ${subject}\n\n` + `${textContent}`
    ).toString("base64");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
      },
    });

    return true;
  }
}
