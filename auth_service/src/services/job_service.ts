import JobModel from "../mongodb/models/job_model.js";
import dto from "../dto/job_dto.js";
import ClientError from "../errors/clientError.js";

import { idValidator } from "../validators/id_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";
import { stringValidator } from "../validators/string_validator.js";

export default class JobService {
  /**
   * @function find
   * @description Get job by id
   * @param {String} _id
   * @returns {Promise<Object>}
   */
  static async find(_id: string) {
    idValidator(_id);

    const job = await JobModel.findOne({ _id });
    if (!job) ClientError.notFound("job not found");

    return dto(job);
  }

  /**
   * @function findAll
   * @description Paginate jobs
   * @param {Number} page
   * @param {Number} limit
   * @param {String} state
   * @returns {Promise<Object>}
   */
  static async findAll(page: number = 1, limit: number = 10, state: string) {
    paginatorValidator(page, limit);
    stringValidator(state, "state");

    const query = { state };
    const jobs = await JobModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });
    const total = await JobModel.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return {
      jobs: jobs.map(dto),
      page,
      limit,
      total,
      pages,
    };
  }
}
