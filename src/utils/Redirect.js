import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export function RedirectIfNoToken(redirectTo = "/login") {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {

      localStorage.setItem('goBackRedirectPage', location.pathname);
      navigate(redirectTo);
    }
  }, [accessToken, navigate, location, redirectTo]);

  return null;
}
