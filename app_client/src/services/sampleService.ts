import { SampleType, SamplesType } from "../types/sampleType";
import TokenService from "./tokenService";

const API_URL = import.meta.env.VITE_EVAL_API;
if (!API_URL)
  console.error(
    "CONFIGURATION ERROR(sampleService.ts): VITE_EVAL_API should be set in the .env file"
  );

export default class SampleService {
  static async get(_id: string): Promise<SampleType> {
    const response = await fetch(`${API_URL}/api/v1/sample/${_id}`, {
      headers: {
        authorization: `Bearer ${TokenService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const json = await response.json();

    return json as SampleType;
  }

  static async getAll(page: number, limit: number): Promise<SamplesType> {
    const response = await fetch(
      `${API_URL}/api/v1/samples?page=${page}&limit=${limit}`,
      {
        headers: {
          authorization: `Bearer ${TokenService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const json = await response.json();

    return json as SamplesType;
  }
}
