import mongoose from "mongoose";

import { userAgentSessionOperationIterationSchema } from "../sub_documents/user_agent_session_operation_iteration_schema.js";

const userAgentSessionOperationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    max_iterations: {
      type: Number,
      required: true,
      default: 5,
    },
    state: {
      type: String,
      required: true,
      enum: ["running", "completed", "error"],
    },
    user_agent_session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAgentSession",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    iterations: [userAgentSessionOperationIterationSchema],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export default mongoose.model(
  "UserAgentSessionOperation",
  userAgentSessionOperationSchema
);
