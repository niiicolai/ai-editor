import { Migration } from "../migration";
import UserModel from "../models/user_model";
import UserService from "../../services/user_service";

const TEST_USER = process.env.TEST_USER;
if (!TEST_USER) console.error("TEST_USER not set");
const [username, email, password] = (TEST_USER || '').split(":");

export default class Migration_1744558723987_add_default_user extends Migration {
    async up() {
        await UserService.create({ username, email, password, role: "admin" });
    }

    async down() {
        await UserModel.deleteOne({ username });
    }
}
