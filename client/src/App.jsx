import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";
import { checkAuth } from "@/store/auth-slice";

import AuthLayout from "@/components/auth/layout";
import AuthLogin from "@/pages/auth/login";
import AuthRegister from "@/pages/auth/register";

import ShoppingLayout from "@/components/shopping-view/layout";
import ShoppingHome from "@/pages/shopping-view/home";
import ShoppingListing from "@/pages/shopping-view/listing";
import ShoppingProductDetails from "@/pages/shopping-view/product-details";
import ShoppingAccount from "@/pages/shopping-view/account";
import ShoppingCheckout from "@/pages/shopping-view/checkout";
import PaymentSuccess from "@/pages/shopping-view/payment-success";
import AboutUs from "@/pages/shopping-view/about-us";
import ContactUs from "@/pages/shopping-view/contact-us";

import AdminLayout from "@/components/admin-view/layout";
import AdminDashboard from "@/pages/admin-view/dashboard";
import AdminProducts from "@/pages/admin-view/products";
import AdminOrders from "@/pages/admin-view/orders";
import AdminFeatures from "@/pages/admin-view/features";

import CheckAuth from "@/components/common/check-auth";
import NotFound from "@/pages/not-found";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/shop/home" replace />} />

        {/* Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Shopping (public browsing, auth required for account/checkout) */}
        <Route path="/shop" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="product/:productId" element={<ShoppingProductDetails />} />
          <Route
            path="account"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingAccount />
              </CheckAuth>
            }
          />
          <Route
            path="checkout"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingCheckout />
              </CheckAuth>
            }
          />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contact-us" element={<ContactUs />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} requireAdmin>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
