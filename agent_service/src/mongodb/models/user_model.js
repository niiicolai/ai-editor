import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    credit: {
      type: Number,
      default: 0,
    },
    deleted_at: {
      type: Date,
      required: false,
      index: true,
    },
    incomplete_transactions: [
      {
        transaction: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Transaction",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export default mongoose.model("User", userSchema);
