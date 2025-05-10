
import EditorView from '../views/EditorView';
import ThemeIndexView from '../views/theme/ThemeIndexView';
import ShortcutIndexView from '../views/shortcut/ShortcutIndexView';
import ProjectIndexIndexView from '../views/projectIndex/ProjectIndexIndexView';

import UserLoginView from '../views/user/UserLoginView';
import UserCreateView from '../views/user/UserCreateView';

import NotFoundView from '../views/error/NotFoundView';

export const routes = [
  {
    path: "/",
    element: <EditorView />,
  },
  {
    path: "*",
    element: <NotFoundView />,
  },
  {
    path: "/themes",
    element: <ThemeIndexView />,
  },
  {
    path: "/shortcuts",
    element: <ShortcutIndexView />,
  },

  /**
   * Project Index routes
   */
  {
    path: "/project-index",
    element: <ProjectIndexIndexView />,
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
