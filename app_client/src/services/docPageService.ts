import { DocOrderedPagesType } from "../types/docPagesType";

const API_URL = "http://localhost:3004/api/v1";

export default class DocPageService {

    static async getOrdered(): Promise<DocOrderedPagesType> {
        const response = await fetch(`${API_URL}/ordered_pages`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as DocOrderedPagesType;
    }
}
