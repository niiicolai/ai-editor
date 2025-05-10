import UserCreditModification from "../mongodb/models/user_credit_modification_model.js";
import User from "../mongodb/models/user_model.js";
import dto from "../dto/user_credit_modification_dto.js";
import ClientError from '../errors/clientError.js';

import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";

const allowedFields = [
    "_id",
    "user_product",
    "amount",
    "user",
    "created_at",
    "updated_at",
];

export default class UserCreditModificationService {

    static async find(_id, userId, fields = null) {
        idValidator(_id, "_id");
        idValidator(userId, "userId");
        fields = fieldsValidator(fields, allowedFields);

        const userCreditModification = await UserCreditModification
            .findOne({ _id, user: userId })
            .select(fields);
        if (!userCreditModification) ClientError.notFound("user credit modification not found");

        return dto(userCreditModification);
    }

    static async findAll(page, limit, userId, fields = null) {
        paginatorValidator(page, limit);
        idValidator(userId, "userId");
        fields = fieldsValidator(fields, allowedFields);

        const userCreditModifications = await UserCreditModification
            .find({ user: userId })
            .select(fields)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await UserCreditModification.countDocuments({ user: userId });
        const pages = Math.ceil(total / limit);

        return {
            modifications: userCreditModifications.map(dto),
            page,
            limit,
            total,
            pages,
        };
    }

    static async create(file, body, userId, fields = null) {
        objectValidator(body, "body");
        stringValidator(body.user_product, "user_product");
        stringValidator(body.amount, "amount");
        idValidator(userId, "userId");

        const user = await User.findOne({ _id: userId });
        if (!user) ClientError.notFound("user not found");

        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const userCreditModification = new UserCreditModification({
                user_product: body.user_product,
                amount: body.amount,
                user: user._id,
            });

            await userCreditModification.save({ session });

            user.credit += body.amount;
            await user.save({ session });
            await session.commitTransaction();

            return await this.find(userCreditModification._id.toString(), userId, fields);
        } catch (error) {
            await session.abortTransaction();
            console.error("Error creating user credit modification:", error);
            throw new Error("Error creating user credit modification", error);
        } finally {
            await session.endSession();
        }
    }

    static async destroy(_id, userId) {
        idValidator(_id, "_id");
        idValidator(userId, "userId");
        
        const userCreditModification = await UserCreditModification.findOne({ _id, user: userId });
        if (!userCreditModification) ClientError.notFound("user credit modification not found");

        try {
            await UserCreditModification.deleteOne({ _id });
        } catch (error) {
            throw new Error("Error deleting user credit modification", error);
        }
    }
}
