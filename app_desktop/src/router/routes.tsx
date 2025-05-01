
import EditorView from '../views/EditorView';
import ThemeIndexView from '../views/theme/ThemeIndexView';
import ShortcutIndexView from '../views/shortcut/ShortcutIndexView';
import ExtensionIndexView from '../views/extensions/ExtensionIndexView';

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
   * Extension routes
   */
  {
    path: "/extensions",
    element: <ExtensionIndexView />,
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
