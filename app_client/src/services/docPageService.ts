import { DocOrderedPagesType } from "../types/docPagesType";

const API_URL = import.meta.env.VITE_DOCS_API;
if (!API_URL) console.error('CONFIGURATION ERROR(docPageService.ts): VITE_DOCS_API should be set in the .env file');

export default class DocPageService {

    static async getOrdered(): Promise<DocOrderedPagesType> {
        const response = await fetch(`${API_URL}/api/v1/ordered_pages`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as DocOrderedPagesType;
    }
}
