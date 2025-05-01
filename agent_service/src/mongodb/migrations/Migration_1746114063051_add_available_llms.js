import { Migration } from "../migration.js";
import AvailableLlm from "../models/available_llm_model.js";

const llms = [
    { 
        name: 'gpt-4o-mini', 
        description: 'Good a simple tasks',
        cost_per_input_token: 0.0000006,
        cost_per_cached_input_token: 0.0000003,
        cost_per_output_token: 0.0000024,
        currency: 'dollar'
    }    
];

export default class Migration_1746114063051_add_available_llms extends Migration {
    async up() {
        await AvailableLlm.create(llms);
    }

    async down() {
        for (const llm of llms) {
            await AvailableLlm.deleteOne({ name: llm.name });
        }
    }
}
