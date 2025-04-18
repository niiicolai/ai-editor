import mongoose from "mongoose";

import { checkoutPriceSchema } from '../sub_documents/checkout_price_schema.js';

export const checkoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        state: {
            type: String,
            default: 'open',
            enum: ['open', 'pending', 'cancelled', 'purchased']
        },
        sessionId: {
            type: String,
            required: false
        },
        products: [checkoutPriceSchema],
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

export default mongoose.model("Checkout", checkoutSchema);
