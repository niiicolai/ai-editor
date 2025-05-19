import HomeView from '../views/HomeView';

import UserLoginView from '../views/user/UserLoginView';
import UserCreateView from '../views/user/UserCreateView';
import UserEditView from '../views/user/UserEditView';
import UserShowView from '../views/user/UserShowView';
import UserDestroyView from '../views/user/UserDestroyView';

import ProductIndexView from '../views/product/ProductIndexView';

import CheckoutIndexView from '../views/checkout/CheckoutIndexView';
import CheckoutShowView from '../views/checkout/CheckoutShowView';

import DocsIndexView from '../views/docs/DocsIndexView';

import FeaturesIndexView from '../views/features/FeaturesIndexView';

import PricingIndexView from '../views/pricing/PricingIndexView';

import NotFoundView from '../views/error/NotFoundView';

import JobIndexView from '../views/job/JobIndexView';
import TransactionIndexView from '../views/transaction/TransactionIndexView';

import UsageIndexViewfrom from '../views/usage/UsageIndexView';

import AvailableIndexView from '../views/available_llm/AvailableIndexView';

import SampleIndexView from '../views/sample/SampleIndexView';

export const routes = [
  {
    path: "/",
    element: <HomeView />,
  },

  {
    path: "*",
    element: <NotFoundView />,
  },

  /**
   * Usage routes
   */
  {
    path: "/usage",
    element: <UsageIndexViewfrom />,
  },

  /**
   * Available LLM routes
   */
  {
    path: "/models",
    element: <AvailableIndexView />,
  },

  /**
   * Samples routes
   */
  {
    path: "/admin/samples",
    element: <SampleIndexView />,
  },

  /**
   * Jobs routes
   */
  {
    path: "/admin/jobs",
    element: <JobIndexView />,
  },

  /**
   * Transaction routes
   */
  {
    path: "/admin/transactions",
    element: <TransactionIndexView />,
  },

  /**
   * Pricing routes
   */
  {
    path: "/pricing",
    element: <PricingIndexView />,
  },

  /**
   * Features routes
   */
  {
    path: "/features",
    element: <FeaturesIndexView />,
  },

  /**
   * Docs routes
   */
  {
    path: "/docs",
    element: <DocsIndexView />,
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

];
