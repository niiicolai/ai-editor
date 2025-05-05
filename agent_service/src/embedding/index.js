import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const loadEmbeddingModels = async () => {
    const models = [];
    const dir = path.resolve('src', 'embedding', 'models');
    const files = fs.readdirSync(dir);

    for (const file of files) {
        try {
            const fileDir = path.join(dir, file);
            const filePath = pathToFileURL(fileDir);
            const module = await import(filePath.href);
            models.push(module.default());
        } catch (error) {
            console.error('ERROR: Failed to load embedding model:', file, error);
        }
    }

    return { models };
};

const { models } = await loadEmbeddingModels();

export const createVectorEmbeddings = async (content = "", options={ 
    model: "Xenova/all-MiniLM-L6-v2",
    chunkSize: 512
}) => {
    const chunks = [];

    for (let i = 0; i < content.length; i += options.chunkSize) {
      const chunk = content.slice(i, i + options.chunkSize).trim();
      chunks.push(chunk);
    }

    for (const model of models) {
        if (model.name == options.model) {
            return await model.createVectorEmbeddings(chunks);
        }
    }

    throw new Error("Model doesn't exist!");
}
