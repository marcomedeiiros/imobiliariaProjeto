// Enhanced security utilities for maximum protection

// Device fingerprinting
export const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substr(0, 32);
};

// Session security is now handled by JWT in auth.js and verified by backend.
// Replaced createSecureSession and validateSecureSession with JWT flow.

// Enhanced rate limiting with multiple factors
export const enhancedRateLimit = (identifier, recordAttempt = true) => {
  const key = `rate_limit_${identifier}`;
  const attempts = JSON.parse(localStorage.getItem(key) || '{"count": 0, "lastAttempt": 0, "deviceFingerprint": ""}');
  
  const now = Date.now();
  const deviceFingerprint = generateDeviceFingerprint();
  
  // Progressive lockout durations: 5min, 15min, 1hour, 24hours
  const lockoutDurations = [5, 15, 60, 1440]; // in minutes
  
  // Check if currently locked out
  if (attempts.count >= 4) {
    const lockoutIndex = Math.min(attempts.count - 4, lockoutDurations.length - 1);
    const lockoutMs = lockoutDurations[lockoutIndex] * 60 * 1000;
    
    if (now - attempts.lastAttempt < lockoutMs) {
      return {
        locked: true,
        lockoutDuration: Math.ceil((lockoutMs - (now - attempts.lastAttempt)) / 60000),
        remainingAttempts: 0
      };
    } else if (!recordAttempt) {
      // Lockout expired, just checking
      attempts.count = 0;
      attempts.lastAttempt = 0;
      localStorage.removeItem(key);
    }
  } else {
    // Reset if different device or after initial 15 min period
    if (attempts.deviceFingerprint !== deviceFingerprint || (attempts.count > 0 && now - attempts.lastAttempt > 15 * 60 * 1000)) {
      attempts.count = 0;
      attempts.lastAttempt = 0;
    }
  }
  
  if (recordAttempt) {
    attempts.count++;
    attempts.lastAttempt = now;
    attempts.deviceFingerprint = deviceFingerprint;
    localStorage.setItem(key, JSON.stringify(attempts));
    
    if (attempts.count >= 4) {
      const lockoutIndex = Math.min(attempts.count - 4, lockoutDurations.length - 1);
      return {
        locked: true,
        lockoutDuration: lockoutDurations[lockoutIndex],
        remainingAttempts: 0
      };
    }
  }
  
  return {
    locked: false,
    remainingAttempts: Math.max(0, 4 - attempts.count)
  };
};

// Clear rate limit for a successful login
export const clearRateLimit = (identifier) => {
  const key = `rate_limit_${identifier}`;
  localStorage.removeItem(key);
};

// Clear all security data
export const clearSecurityData = () => {
  sessionStorage.removeItem('secure_admin_session');
  
  // Clear rate limiting data
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('rate_limit_')) {
      localStorage.removeItem(key);
    }
  });
};

// Get client IP (fallback method)
export const getClientIP = () => {
  // In a real application, this would be obtained from the server
  // For now, use a combination of available data
  return btoa(navigator.userAgent + screen.width + screen.height).substr(0, 16);
};

// Security headers for future use
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};
