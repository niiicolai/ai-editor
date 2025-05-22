import mongoose from "mongoose";

export const userPasswordResetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expired_at: {
      type: Date,
      required: true,
    },
    deleted_at: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export default mongoose.model("UserPasswordReset", userPasswordResetSchema);
