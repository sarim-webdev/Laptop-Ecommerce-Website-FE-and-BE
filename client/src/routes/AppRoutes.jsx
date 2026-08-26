import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

// Public
import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/Products/ProductDetails";
import Contact from "../pages/Contact/Contact";

// Auth
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

// User
import Profile from "../pages/Profile/Profile";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import MyOrders from "../pages/Orders/MyOrders";
import OrderDetails from "../pages/Orders/OrderDetails";

// Admin
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminProducts from "../pages/Admin/AdminProducts";
import AdminProductForm from "../pages/Admin/AdminProductForm";
import AdminProductEdit from "../pages/Admin/AdminProductEdit";
import AdminOrders from "../pages/Admin/AdminOrders";
import AdminCategories from "../pages/Admin/AdminCategories";
import AdminContacts from "../pages/Admin/AdminContacts";



const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================================
      MAIN WEBSITE
  ========================================= */}

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/contact" element={<Contact />} />

          {/* USER PROTECTED ROUTES */}

          <Route element={<ProtectedRoute />}>

            <Route path="/profile" element={<Profile />} />

            <Route path="/cart" element={<Cart />} />

            <Route path="/checkout" element={<Checkout />} />

            <Route path="/orders" element={<MyOrders />} />

            <Route path="/orders/:id" element={<OrderDetails />} />

          </Route>

        </Route>


        {/* =========================================
      AUTH PAGES — NO NAVBAR / FOOTER
  ========================================= */}

        <Route path="/sign-in" element={<SignIn />} />

        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />


        {/* =========================================
      ADMIN PANEL
  ========================================= */}

        <Route element={<ProtectedRoute adminOnly />}>

          <Route element={<AdminLayout />}>

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />

            <Route
              path="/admin/products/new"
              element={<AdminProductForm />}
            />

            <Route
              path="/admin/products/:id/edit"
              element={<AdminProductEdit />}
            />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />

            <Route
              path="/admin/categories"
              element={<AdminCategories />}
            />

            <Route
              path="/admin/contacts"
              element={<AdminContacts />}
            />

          </Route>

        </Route>


        {/* =========================================
      404
  ========================================= */}

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-3xl font-bold">
                404 - Page Not Found
              </h1>
            </div>
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;