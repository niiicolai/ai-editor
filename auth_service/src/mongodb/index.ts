import mongoose from "mongoose";

import JobModel from './models/job_model';
import MigrationModel from './models/migration_model';
import TransactionModel from './models/transaction_model';
import UserModel from './models/user_model';
import UserPasswordResetModel from './models/user_password_reset_model';

const ENV = process.env.NODE_ENV || "development";
const URL = process.env[`MONGODB_${ENV.toUpperCase()}_URL`];
if (!URL) console.error("ERROR: Missing MongoDB URL in environment variables");

export const cleanDatabase = async () => {
  await JobModel.deleteMany();
  await MigrationModel.deleteMany();
  await TransactionModel.deleteMany();
  await UserModel.deleteMany();
  await UserPasswordResetModel.deleteMany();
}

export const mongoConnect = async () => {
  if (!URL) {
    throw new Error("ERROR: Missing MongoDB URL in environment variables");
  }

  try {
    await mongoose.connect(URL);
    console.log("INFO: Connected to MongoDB");
  } catch (err) {
    console.error("ERROR: Error connecting to MongoDB", err);
  }
};
