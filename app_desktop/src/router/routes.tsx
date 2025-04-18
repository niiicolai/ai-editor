import HomeView from '../views/HomeView';
import DashboardView from '../views/DashboardView';

import UserLoginView from '../views/user/UserLoginView';
import UserCreateView from '../views/user/UserCreateView';
import UserEditView from '../views/user/UserEditView';
import UserShowView from '../views/user/UserShowView';
import UserDestroyView from '../views/user/UserDestroyView';

import ProductIndexView from '../views/product/ProductIndexView';

import CheckoutIndexView from '../views/checkout/CheckoutIndexView';
import CheckoutShowView from '../views/checkout/CheckoutShowView';

export const routes = [
  {
    path: "/",
    element: <HomeView />,
  },

  /**
   * User routes
   */
  {
    path: "/user",
    element: <UserShowView />,
  },
  {
    path: "/user/login",
    element: <UserLoginView />,
  },
  {
    path: "/user/signup",
    element: <UserCreateView />,
  },
  {
    path: "/user/edit",
    element: <UserEditView />,
  },
  {
    path: "/user/delete",
    element: <UserDestroyView />,
  },

  /**
   * Product routes
   */
  {
    path: "/products",
    element: <ProductIndexView />,
  },

  /**
   * Checkout routes
   */
  {
    path: "/checkouts",
    element: <CheckoutIndexView />,
  },
  {
    path: "/checkout/:_id",
    element: <CheckoutShowView />,
  },

  /**
   * Dashboard routes
   */
  {
    path: "/dashboard",
    element: <DashboardView />,
  }
];
