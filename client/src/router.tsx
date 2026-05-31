import { createBrowserRouter } from 'react-router-dom';
import CustomerLayout from './components/layout/customer_layout';
import StoreHomePage from './pages/customer/Home';
import { PublicOnlyLayout } from './components/auth/PublicOnlyLayout';
import SignInPage from './pages/auth/Sign-in';
import SignUpPage from './pages/auth/Sign-Up';
import { ProtectedLayout } from './components/auth/ProtectedLayout';
import CustomerProfilePage from './pages/customer/Profile';
import { RoleGuardLayout } from './components/auth/RoleGuardLayout';
import AdminLayout from './components/layout/admin_layout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCoupons from './pages/admin/Promos';
import AdminOrders from './pages/admin/Orders';
import AdminSettings from './pages/admin/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <StoreHomePage />,
      },
      {
        element: <PublicOnlyLayout />,
        children: [
          {
            path: 'sign-in/*',
            element: <SignInPage />,
          },
          {
            path: 'sign-up/*',
            element: <SignUpPage />,
          },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [{ path: 'profile', element: <CustomerProfilePage /> }],
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        element: <RoleGuardLayout allow={['admin']} />,
        children: [
          {
            path: '/admin',
            element: <AdminLayout />,

            children: [
              {
                index: true,
                element: <AdminDashboard />,
              },
              {
                path: 'products',
                element: <AdminProducts />,
              },
              {
                path: 'coupons',
                element: <AdminCoupons />,
              },
              {
                path: 'orders',
                element: <AdminOrders />,
              },
              {
                path: 'settings',
                element: <AdminSettings />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
