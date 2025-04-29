import mongoose from "mongoose";

export const userProductCreditSchema = new mongoose.Schema(
    {
        noOfCredits: {
            type: Number,
            required: true
        },
        usedCredits: {
            type: Number,
            required: false,
            default: 0
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);
