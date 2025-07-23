import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
import AboutPage from './pages/About';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import AccountPage from './pages/Account';
import Enable2fa from './pages/Enable2fa';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import GamePage from './pages/Game';

import HomeLayoutPage from './pages/layout/HomeLayout';
import AuthLayout from './pages/layout/AuthLayout';
import OtpPage from './pages/layout/OtpLayout';

function App() {
  return (
    <>     
      <Routes>

        <Route path="/" element={<HomeLayoutPage />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="game" element={<GamePage />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>

        <Route path="/otp" element={<OtpPage />}>
          <Route path="enable2fa" element={<Enable2fa />} />
          <Route path="verifyemail" element={<VerifyEmail />} />
          <Route path="resetpassword" element={<ResetPassword />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;
