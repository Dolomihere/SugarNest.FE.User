import { Routes, Route } from 'react-router-dom'

import { HomePage } from './pages/Home'
import { RegisterPage } from './pages/Register'
import { LoginPage } from './pages/Login'
import { OtpVerifyEmailPage } from './pages/OtpVerifyEmail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verifyemail" element={<OtpVerifyEmailPage />} />
    </Routes>
  )
}

export default App
