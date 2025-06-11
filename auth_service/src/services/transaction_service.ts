import TransactionModel from "../mongodb/models/transaction_model";
import dto from "../dto/transaction_dto";
import ClientError from "../errors/client_error";

import { idValidator } from "../validators/id_validator";
import { paginatorValidator } from "../validators/paginator_validator";
import { stringValidator } from "../validators/string_validator";

export default class TransactionService {
  /**
   * @function find
   * @description Get transaction by id
   * @param {String} _id
   * @returns {Promise<Object>}
   */
  static async find(_id: string) {
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
  static async findAll(page: number = 1, limit: number = 10, state: string) {
    paginatorValidator(page, limit);
    stringValidator(state, "state", {
      min: { enabled: false, value: 0 },
      max: { enabled: false, value: 0 },
      regex: { enabled: true, value: /pending|completed|error/ }
    });

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
