import TransactionModel from "../mongodb/models/transaction_model.js";
import dto from "../dto/transaction_dto.js";
import ClientError from "../errors/clientError.js";

import { idValidator } from "../validators/id_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";
import { stringValidator } from "../validators/string_validator.js";

export default class TransactionService {
  /**
   * @function find
   * @description Get transaction by id
   * @param {String} _id
   * @returns {Promise<Object>}
   */
  static async find(_id) {
    idValidator(_id);

    const transaction = await TransactionModel.findOne({ _id });
    if (!transaction) ClientError.notFound("transaction not found");

    return dto(transaction);
  }

  /**
   * @function findAll
   * @description Paginate transactions
   * @param {Number} page
   * @param {Number} limit
   * @param {String} state
   * @returns {Promise<Object>}
   */
  static async findAll(page = 1, limit = 10, state) {
    paginatorValidator(page, limit);
    stringValidator(state, "state");

    const query = { state };
    const transactions = await TransactionModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });
    const total = await TransactionModel.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return {
      transactions: transactions.map(dto),
      page,
      limit,
      total,
      pages,
    };
  }
}
