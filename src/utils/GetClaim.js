import { jwtDecode } from 'jwt-decode'

export function GetUserIdFromToken() {
  const token = localStorage.getItem('accessToken');

  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? null;
  } catch {
    return null;
  }
}
