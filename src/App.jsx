import { Routes, Route } from 'react-router-dom'

import { HomePage } from './pages/Home'
import { ProductPage } from './pages/Product'
import { ProductDetailPage } from './pages/ProductDetail'
import { CartPage } from './pages/Cart'
import { RegisterPage } from './pages/Register'
import { LoginPage } from './pages/Login'
import { ResetPassword } from './pages/layouts/otp/ResetPassword'
import { Enable2fa } from './pages/layouts/otp/Enable2fa'
import { VerifyEmail } from './pages/layouts/otp/VerifyEmail'
import { ContactPage } from './pages/Contact'
import { AboutPage } from './pages/About'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/otp/verifyMail" element={<VerifyEmail />} />
      <Route path="/otp/2fa" element={<Enable2fa />} />
      <Route path="/otp/resetpwd" element={<ResetPassword />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  )
}

export default App
