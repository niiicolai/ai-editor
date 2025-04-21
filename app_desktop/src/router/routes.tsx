
import EditorView from '../views/EditorView';
import SettingIndexView from '../views/setting/SettingIndexView';

import UserLoginView from '../views/user/UserLoginView';
import UserCreateView from '../views/user/UserCreateView';

export const routes = [
  {
    path: "/",
    element: <EditorView />,
  },
  {
    path: "/settings",
    element: <SettingIndexView />,
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
