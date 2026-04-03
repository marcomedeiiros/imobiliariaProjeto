import * as jose from 'jose';
import { SECURITY_CONFIG } from '../config/security.js';

// Derive a signing key based on the security config hash or generate a static one.
// We use a constant string enhanced with the user's password hash so that if the 
// password changes, old tokens are invalidated.
const getSecretKey = async () => {
  const baseKey = SECURITY_CONFIG.ADMIN_PASSWORD_HASH || 'default_fallback_secret_key_123!';
  const encoder = new TextEncoder();
  
  // We need a stable 256-bit key for HS256. We'll hash the base string to ensure length.
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(baseKey));
  return new Uint8Array(hashBuffer);
};

export const generateJWT = async (payload, expiresIn = '30m') => {
  const secretKey = await getSecretKey();
  
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('imoveis:admin')
    .setExpirationTime(expiresIn)
    .sign(secretKey);
    
  return jwt;
};

export const verifyJWT = async (token) => {
  if (!token) return { valid: false, error: 'Token missing' };
  
  try {
    const secretKey = await getSecretKey();
    const { payload } = await jose.jwtVerify(token, secretKey, {
      issuer: 'imoveis:admin',
    });
    
    return { valid: true, payload };
  } catch (error) {
    // Error could be JWTExpired, JWTInvalid, etc.
    return { valid: false, error: error.code || 'Invalid token' };
  }
};
