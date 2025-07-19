import { Routes, Route } from "react-router-dom";
import CheckoutPage from "./pages/Checkout.jsx";
import { HomePage } from "./pages/Home";
import { ProductPage } from "./pages/Product";
import { ProductDetailPage } from "./pages/ProductDetail";
import { RegisterPage } from "./pages/Register";
import { LoginPage } from "./pages/Login";
import { OtpPage } from "./pages/Otp.jsx";
import { ContactPage } from "./pages/Contact";
import { AboutPage } from "./pages/About";
import UserPage from "./pages/User.jsx";
import { PaymentPage } from "./pages/Payment";
import { AccountPage } from "./pages/AccountPage.jsx";
import DiscountBlog from "./pages/DiscountBlog.jsx";
import AuthLayout from "./pages/auth/AuthLayout";
import SignInForm from "./pages/auth/SignIn";
import SignUpForm from "./pages/auth/SignUp";
import UnityGame from "./pages/UnityGame";
import ScrollToTop from "./pages/layouts/ScrollToTopLayout.jsx";
import { Header } from "./pages/layouts/Header";
import { Footer } from "./pages/layouts/Footer.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import OrderHistoryPage from "./pages/OrderHistory.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp/:mode" element={<OtpPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/discounts" element={<DiscountBlog />} />
        <Route path="/unity-game" element={<UnityGame />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route
          path="/signin"
          element={
            <AuthLayout imageSrc="/images/sign-in.png">
              <SignInForm />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout imageSrc="/images/sign-up.png">
              <SignUpForm />
            </AuthLayout>
          }
        />

        {/* Route mới cho AI cá nhân hóa */}
      </Routes>
    </>
  );
}

export default App;