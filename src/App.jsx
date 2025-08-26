import { Routes, Route } from "react-router-dom";
import CheckoutPage from "./pages/Checkout.jsx";
import { HomePage } from "./pages/Home";
import { ProductPage } from "./pages/Product";
import { ProductDetailPage } from "./pages/ProductDetail";
import { RegisterPage } from "./pages/Register";
import { LoginPage } from "./pages/Login";
import { ContactPage } from "./pages/Contact";
import { AboutPage } from "./pages/About";
import UserPage from "./pages/User.jsx";
import { PaymentPage } from "./pages/Payment";
import DiscountBlog from "./pages/DiscountBlog.jsx";
import AuthLayout from "./pages/auth/AuthLayout";
import SignInForm from "./pages/auth/SignIn";
import SignUpForm from "./pages/auth/SignUp";
import UnityGame from "./pages/UnityGame";
import ScrollToTop from "./pages/layouts/ScrollToTopLayout.jsx";
import { Header } from "./pages/layouts/Header";
import AccountPage from './pages/AccountPage.jsx';
import { ChatBotPage } from "./pages/ChatBot.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import VerifyAccount from "./pages/auth/VerifyAccount";
import { Footer } from "./pages/layouts/Footer.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import OrderHistoryPage from "./pages/OrderHistory.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import OrderSuccess from "./pages/OrderSuccess";
import RequestResetPassword from "./pages/auth/RequestResetPassword.jsx";
import { CategoryPage } from "./pages/CategoryPage.jsx";
import { OrderStatusPage } from "./pages/OrderStatusPage.jsx";

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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/discounts" element={<DiscountBlog />} />
        <Route path="/unity-game" element={<UnityGame />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/order/:orderId" element={<OrderDetailsPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/request-reset-password" element={<RequestResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify" element={<VerifyAccount />} />
        <Route path="/signin-google/v2" element={<AuthLayout imageSrc="/images/sign-in.png">
              <SignInForm />
            </AuthLayout>} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="*" element={<div>Not Found</div>} />
          <Route path="/order-status" element={<OrderStatusPage />}/>
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
        <Route path="/ai-chat" element={<ChatBotPage />} />
      </Routes>
    </>
  );
}

export default App;