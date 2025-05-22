import mongoose from "mongoose";

export const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            unique: false,
            required: true,
        },
        category: {
            type: String,
            unique: false,
            required: true,
        },
        noOfCredits: {
            type: Number,
            required: false,
        },
        price: {
            type: Number,
            required: true,
        },
        stripePriceId: {
            type: String,
            unique: true,
            required: true,
        },
        deleted_at: {
            type: Date,
            required: false,
            index: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

export default mongoose.model("Product", productSchema);
