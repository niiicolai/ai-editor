import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export const setupSwagger = async (app) => {
    // Read all scheme files from the directory
    // and import them dynamically
    const dir = path.resolve('src', 'controllers', 'swagger', 'schemes');
    const schemes = await fs.promises.readdir(dir);
    const schemesPromises = schemes.map(async (file) => {
        try {
            const fileDir = path.join(dir, file);
            const filePath = pathToFileURL(fileDir);
            const scheme = await import(filePath.href);
            return scheme.default;
        } catch (error) {
            console.error('ERROR: Failed to load scheme:', file, error);
        }
    });
    // Wait for all schemes to be imported
    // and combine them into a single object
    const schemesArray = await Promise.all(schemesPromises);
    const schemesObject = schemesArray.reduce((acc, scheme) => {
        const objects = Object.keys(scheme);
        objects.forEach((object) => {
            if (acc[object]) {
                console.error(`ERROR: Duplicate scheme name: ${object}`);
            } else {
                acc[object] = scheme[object];
            }
        });
        return acc;
    }, {});

    const theme = new SwaggerTheme();

    const __dirname = path.resolve();
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Payment API',
                description: "API endpoints for Payment Application",
                termsOfService: 'https://example.com/terms',
                contact: {
                    name: "GitHub Repository",
                    url: "https://github.com/niiicolai/job-agent-backend",
                },
                version: '1.0.0',
            },
            components: {
                ...schemesObject,
            },
        },
        apis: [ `${__dirname}/src/controllers/api/*.js` ],
        explorer: true,
        customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA)
    }

    const router = express.Router();
    const swaggerDocument = swaggerJsdoc(options);
    router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
    app.use(router);
};
