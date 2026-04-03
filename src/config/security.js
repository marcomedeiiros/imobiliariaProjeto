// Security configuration
export const SECURITY_CONFIG = {
  // Default admin password hash (change this in production!)
  ADMIN_PASSWORD_HASH: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // SHA-256 of "password123"
  
  // Session management
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  
  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // Security headers (for future use)
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
};

// Generate secure hash for new password
export const generateSecureHash = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
