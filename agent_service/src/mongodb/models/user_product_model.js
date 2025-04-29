import mongoose from "mongoose";

import { userProductCreditSchema } from "../sub_documents/user_product_credit_schema.js";

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
            type: userProductCreditSchema,
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
