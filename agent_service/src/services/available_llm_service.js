import AvailableLlm from "../mongodb/models/available_llm_model.js";
import dto from "../dto/available_llm_dto.js";
import ClientError from "../errors/client_error.js";

import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";
import { stringValidator } from "../validators/string_validator.js";

const allowedFields = [
  "_id",
  "name",
  "description",
  "cost_per_input_token",
  "cost_per_output_token",
  "cost_per_cached_input_token",
  "fee_per_input_token",
  "fee_per_output_token",
  "created_at",
  "updated_at",
];

export default class AvailableLlmService {
  /**
   * @function find
   * @description Find available llm by id
   * @param {string} _id - Available llm id
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - User file object
   */
  static async find(_id, fields = null) {
    idValidator(_id, "_id");
    fields = fieldsValidator(fields, allowedFields);

    const availableLlm = await AvailableLlm.findOne({
      _id,
    }).select(fields.join(" "));
    if (!availableLlm)
      ClientError.notFound("available LLM not found");

    return dto(availableLlm);
  }

  static async findByName(name, fields = null) {
    stringValidator(name, "name");
    fields = fieldsValidator(fields, allowedFields);

    const availableLlm = await AvailableLlm.findOne({
      name,
    }).select(fields.join(" "));
    if (!availableLlm)
      ClientError.notFound("available LLM not found");

    return dto(availableLlm);
  }

  /**
   * @function findAll
   * @description Find all available LLMs
   * @param {number} page - Page number
   * @param {number} limit - Page size
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - User agent session embddings
   */
  static async findAll(page, limit, fields = null) {
    paginatorValidator(page, limit);
    fields = fieldsValidator(fields, allowedFields);

    const llms = await AvailableLlm.find()
      .select(fields.join(" "))
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });
    const total = await AvailableLlm.countDocuments();
    const pages = Math.ceil(total / limit);

    return {
      llms: llms.map(dto),
      page,
      limit,
      total,
      pages,
    };
  }
}
