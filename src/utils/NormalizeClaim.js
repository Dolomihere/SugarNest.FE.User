export function normalizeClaims(claims) {
  const claimMap = {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "sub",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "name",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "email",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "role"
  };

  const result = {};

  for (const key in claims) {
    if (Object.prototype.hasOwnProperty.call(claims, key)) {
      const mappedKey = claimMap[key] || key;
      result[mappedKey] = claims[key];
    }
  }

  return result;
}
