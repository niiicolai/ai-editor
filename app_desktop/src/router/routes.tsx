
import EditorView from '../views/EditorView';
import ThemeIndexView from '../views/theme/ThemeIndexView';

import UserLoginView from '../views/user/UserLoginView';
import UserCreateView from '../views/user/UserCreateView';

export const routes = [
  {
    path: "/",
    element: <EditorView />,
  },
  {
    path: "/themes",
    element: <ThemeIndexView />,
  },

  /**
   * User routes
   */
  {
    path: "/user/login",
    element: <UserLoginView />,
  },
  {
    path: "/user/signup",
    element: <UserCreateView />,
  },

];
