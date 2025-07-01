import { Routes, Route } from 'react-router-dom'

import { HomePage } from './pages/Home'
import { ProductPage } from './pages/Product'
import { ProductDetailPage } from './pages/ProductDetail'
import { RegisterPage } from './pages/Register'
import { LoginPage } from './pages/Login'
import { OtpPage } from './pages/Otp'
import { ContactPage } from './pages/Contact'
import { AboutPage } from './pages/About'
import { UserPage } from './pages/User'
import { CheckoutPage } from './pages/Checkout'
import { PaymentPage } from './pages/Payment'

function App() {
  return (
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
    </Routes>
  )
}

export default App
