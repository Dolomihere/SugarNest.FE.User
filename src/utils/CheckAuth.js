import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import AuthService from '../services/AuthService'

export function useAuthGuard({ redirect = true } = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ['auth-check'],
    queryFn: () => AuthService.check(token),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (!token || error) {
      if (redirect) {
        localStorage.setItem('lastVisited', location.pathname);
        navigate('/login');
      }
    }
  }, [error, token, redirect, location.pathname, navigate]);

  return {
    isAuthenticated: !!data && !error,
    isLoading,
    userData: data?.data || null,
  };
}
