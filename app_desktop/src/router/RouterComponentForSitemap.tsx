import { Routes, Route } from 'react-router-dom';
import { routes } from './routes'; // Import the same routes array

const RouterComponentForSitemap = () => (
  <Routes>
    {routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
  </Routes>
);

export default RouterComponentForSitemap;