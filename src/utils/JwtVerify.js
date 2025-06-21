import { jwtDecode } from 'jwt-decode'

export function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? null;
  } catch {
    return null;
  }
}

export function authenticate() {
  const token = localStorage.getItem('accessToken');
  return !!token;
}
