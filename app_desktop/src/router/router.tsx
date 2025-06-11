import { createHashRouter } from 'react-router-dom';
import { routes } from './routes'; // Import the routes array

export const router = createHashRouter(routes);