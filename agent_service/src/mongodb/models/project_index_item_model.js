import mongoose from "mongoose";

const projectIndexItemSchema = new mongoose.Schema(
  {
    chunk_index: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    hashCode: {
      type: String,
      required: true,
    },
    lines: {
      type: Number,
      required: true,
    },
    language: {
      type: Number,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
    project_index: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectIndex",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export default mongoose.model("ProjectIndexItem", projectIndexItemSchema);
