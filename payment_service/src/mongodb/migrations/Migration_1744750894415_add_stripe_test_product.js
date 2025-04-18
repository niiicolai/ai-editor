import { Migration } from "../migration.js";
import ProductModel from "../models/product_model.js";

const stripePriceId = "price_1RELH3EQXSqtPIETZbxTnMQI"

export default class Migration_1744750894415_add_stripe_test_product extends Migration {
    async up() {
        await ProductModel.create({
            stripePriceId,
            title: "500 Credits",
            description: "500 Credits",
            noOfCredits: 500,
            category: "credit",
            price: 5
        });
    }

    async down() {
        await ProductModel.deleteOne({ stripePriceId });
    }
}
