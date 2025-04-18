import mongoose from "mongoose";

import { creditSchema } from "../sub_documents/credit_schema.js";

export const userProductSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        expires_at: {
            type: Date,
            required: false,
        },
        credit: {
            type: creditSchema,
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

export default mongoose.model("UserProduct", userProductSchema);
