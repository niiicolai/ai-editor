import "dotenv/config";
import { mongoConnect } from "./index.js";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

import MigrationModel from "./models/migration_model.js";

const migrationTemplate = (name) => `import { Migration } from "../migration.js";

export default class ${name} extends Migration {
    async up() {
        // Write your migration code here
    }

    async down() {
        // Write your migration code here
    }
}
`;

/**
 * @class Migration
 * @description
 * This class is used to create migrations
 * @example
 * class CreateUsersTable extends Migration {
 *    async up() {
 *       await User.createCollection();
 *   }
 *   async down() {
 *      await User.collection.drop();
 *  }
 * }
 */
export class Migration {
  /**
   * @function _up
   * @description
   * 1. Check if migration exists
   * 2. Get the order of the migration
   * 3. Start a transaction
   * 4. Run the up method
   * 5. Create the migration
   * 6. Commit the transaction
   * @returns {Promise<void>}
   */
  async _up() {
    const tag = this.constructor.name;
    const migration = await MigrationModel.findOne({ tag });
    if (migration) return;

    const order = await MigrationModel.countDocuments();
    try {
      await this.up();
      await MigrationModel.create({ tag, order });
    } catch (error) {
      throw error;
    }
    console.log(`Migration ${tag} ran successfully`);
  }

  /**
   * @function _down
   * @description
   * 1. Check if migration exists
   * 2. Start a transaction
   * 3. Run the down method
   * 4. Delete the migration
   * 5. Commit the transaction
   * @returns {Promise<void>}
   */
  async _down() {
    const tag = this.constructor.name;
    const migration = await MigrationModel.findOne({ tag });
    if (!migration) return;

    try {
      await this.down();
      await MigrationModel.deleteOne({ tag });
    } catch (error) {
      throw error;
    }
    console.log(`Migration ${tag} rolled back successfully`);
  }

  /**
   * @function up
   * @description
   * This method must be implemented by the child class
   * @returns {Promise<void>}
   * @throws {Error} up method not implemented
   */
  async up() {
    throw new Error("up method not implemented");
  }

  /**
   * @function down
   * @description
   * This method must be implemented by the child class
   * @returns {Promise<void>}
   * @throws {Error} down method not implemented
   */
  async down() {
    throw new Error("down method not implemented");
  }

  static async generateMigrationFile(name) {
    if (!name) throw new Error("Migration name is required");
    if (typeof name !== "string") throw new Error("Migration name must be a string");

    const time = new Date().getTime();
    name = `Migration_${time}_${name}`;

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const migrationPath = path.join(__dirname, "migrations");
    const migrationFile = path.join(migrationPath, `${name}.js`);

    if (!fs.existsSync(migrationPath)) {
      throw new Error("Migrations directory does not exist");
    }

    fs.writeFileSync(migrationFile, migrationTemplate(name));

    console.log(`Migration file created at ${migrationFile}`);
  }

  static async runMigrations(command) {
    if (!command) throw new Error("Command is required");
    if (typeof command !== "string") throw new Error("Command must be a string");

    await mongoConnect();

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const migrationPath = path.join(__dirname, "migrations");
    const migrations = fs.readdirSync(migrationPath);
    for (const migration of migrations) {
      const migrationFile = await import(`./migrations/${migration}`);
      const migrationInstance = new migrationFile.default();
      await migrationInstance[command]();
    }

    console.log("Migrations run successfully");
  }
}

const command = process.argv[2];
if (command === "generate") {
  const name = process.argv[3];
  Migration.generateMigrationFile(name);
} else if (command === "up") {
  Migration.runMigrations("_up");
} else if (command === "down") {
  Migration.runMigrations("_down");
}

