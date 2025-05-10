import mongoose from "mongoose";

export const creditSchema = new mongoose.Schema(
    {
        noOfCredits: {
            type: Number,
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
