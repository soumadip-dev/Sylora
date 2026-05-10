import { createBrowserRouter } from 'react-router-dom';
import CustomerLayout from './components/layout/customer_layout';
import StoreHomePage from './pages/customer/Home';
import { PublicOnlyLayout } from './components/auth/PublicOnlyLayout';
import SignInPage from './pages/auth/Sign-in';
import SignUpPage from './pages/auth/Sign-Up';
import { ProtectedLayout } from './components/auth/ProtectedLayout';
import CustomerProfilePage from './pages/customer/Profile';

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
]);
