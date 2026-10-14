import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./services/AuthService";

// HomePage Structure
import Layout from "./layouts/Layout";
import ProductPage from "./pages/LandingPages/ProductPage";
import HomePage from "./pages/LandingPages/HomePage";
import AboutPage from "./pages/LandingPages/AboutPage";
import ProductListPage from "./pages/LandingPages/ProductListPage";

// Auth Pages Structure
import AuthLayout from "./layouts/AuthLayout";
import SignInPage from "./pages/AuthPages/SignInPage";
import SignUpPage from "./pages/AuthPages/SignUpPage";

import NotFoundPage from "./pages/NotFoundPage";

import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/User/CartPage";
import OrdersPage from "./pages/User/OrdersPage";
import ProfilePage from "./pages/User/ProfilePage";
import AdminPage from "./pages/Admin/AdminPage";
const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "products",
        element: <ProductListPage />,
      },
      {
        path: "products/:id",
        element: <ProductPage />,
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin", "seller"]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "auth/",
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
