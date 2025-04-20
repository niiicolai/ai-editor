
import DashboardView from '../views/DashboardView';
import SettingIndexView from '../views/setting/SettingIndexView';

import UserLoginView from '../views/user/UserLoginView';
import UserCreateView from '../views/user/UserCreateView';

export const routes = [
  {
    path: "/",
    element: <DashboardView />,
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
