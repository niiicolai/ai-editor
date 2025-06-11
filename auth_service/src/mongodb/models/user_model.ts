import mongoose from 'mongoose';

import { userLoginSchema } from '../sub_documents/user_login';
import { userTwoFactorSchema } from '../sub_documents/user_two_factor';

export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minLength: 5,
        maxLength: 200
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member',
        required: true
    },
    incomplete_transactions: [{
        transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
            required: true
        },
    }],
    deleted_at: {
        type: Date,
        required: false,
        index: true
    },
    two_factor: userTwoFactorSchema,
    logins: [userLoginSchema],
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export default mongoose.model('User', userSchema);
