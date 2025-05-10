import mongoose from "mongoose";

export const userCreditModificationSchema = new mongoose.Schema(
    {
        user_product: {
            type: String,
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

export default mongoose.model("UserCreditModification", userCreditModificationSchema);
