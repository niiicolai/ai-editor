import { CreditInfoType } from "../types/userProductType";
import TokenService from "./tokenService";

const API_URL = "http://localhost:3002/api/v1";

export default class UserProductService {
    static async getCreditInfo(): Promise<CreditInfoType> {
        const response = await fetch(`${API_URL}/credit_info`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as CreditInfoType;
    }
}
