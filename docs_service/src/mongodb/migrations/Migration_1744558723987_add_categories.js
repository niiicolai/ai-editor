import { Migration } from "../migration.js";
import CategoryModel from "../models/category_model.js";

const categories = [
    { name: "Get Started", order: 0 },
    { name: "Directories and Files", order: 1 },
    { name: "Editor", order: 2 },
    { name: "AI Chat", order: 3 },
    { name: "AI Function Calls", order: 4 },
    { name: "AI Ignore Files", order: 5 },
];

export default class Migration_1744558723987_add_categories extends Migration {
    async up() {
        await CategoryModel.create(categories);
    }

    async down() {
        for (const cat of categories) {
            await CategoryModel.deleteOne({ name: cat.name });
        }
    }
}
