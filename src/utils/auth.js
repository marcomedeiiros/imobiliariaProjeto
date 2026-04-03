// Authentication utilities with rate limiting and enhanced security
import { hashPassword, verifyPassword } from './crypto.js';
import { generateDeviceFingerprint, enhancedRateLimit, clearSecurityData, clearRateLimit } from './securityEnhancements.js';
import { generateJWT, verifyJWT } from './jwt.js';

// Rate limiting storage
const loginAttempts = new Map();
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Check if IP is locked out (legacy local check, could be moved to server)
export const isLockedOut = (ip) => {
  return false; // Handled by server or enhancedRateLimit
};

// Record failed login attempt
export const recordFailedAttempt = (ip) => {
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(ip, attempts);
};

// Clear login attempts on successful login
export const clearAttempts = (ip) => {
  loginAttempts.delete(ip);
};

// Get remaining lockout time
export const getLockoutTime = (ip) => {
  const attempts = loginAttempts.get(ip);
  if (!attempts) return 0;
  
  const remaining = LOCKOUT_TIME - (Date.now() - attempts.lastAttempt);
  return Math.max(0, Math.ceil(remaining / 60000)); // minutes
};

// Check if it's first time setup via backend
export const isFirstTimeSetup = async () => {
  try {
    const response = await fetch('/api/status');
    const data = await response.json();
    return !data.setup;
  } catch (error) {
    return false;
  }
};

// Legacy, no longer used as server stores hash
export const getCurrentPasswordHash = () => {
  return "SERVER_MANAGED"; 
};

// Setup the initial admin password on the server
export const setupAdmin = async (password) => {
  try {
    const response = await fetch('/api/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Erro ao configurar servidor.' };
  }
};

// Change password on the server
export const changeAdminPassword = async (currentPassword, newPassword) => {
  try {
    const token = sessionStorage.getItem('admin_token');

    const response = await fetch('/api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword, token })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Erro ao alterar senha no servidor.' };
  }
};

// Ultra-secure password verification with multiple layers
export const secureLogin = async (password, storedHash, identifier) => {
  // Check rate limiting status without recording an attempt yet
  const rateLimitResult = enhancedRateLimit(identifier, false);
  
  if (rateLimitResult.locked) {
    return { 
      success: false, 
      error: `Acesso bloqueado por ${rateLimitResult.lockoutDuration} minuto(s). Dispositivo identificado.` 
    };
  }
  
  try {
    const deviceFingerprint = generateDeviceFingerprint();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, identifier, deviceFingerprint })
    });

    const result = await response.json();
    
    if (result.success) {
      // Clear rate limiting on successful login
      clearRateLimit(identifier);
      
      // Store the JWT securely in session storage
      sessionStorage.setItem('admin_token', result.token);
      
      return { 
        success: true, 
        isFirstTime: false,
        deviceVerified: true
      };
    } else {
      // Logic for rate limiting (local backup + server response)
      enhancedRateLimit(identifier, true);
      
      if (response.status === 429) {
        return { success: false, error: result.error, isLocked: true };
      }

      const errorMsg = result.attemptsLeft !== undefined 
        ? `${result.error}. Você tem mais ${result.attemptsLeft} tentativa(s).`
        : result.error || 'Senha incorreta';

      return { 
        success: false, 
        error: errorMsg,
        attemptsLeft: result.attemptsLeft,
        deviceFingerprint
      };
    }
  } catch (error) {
    return { success: false, error: 'Erro de conexão com o servidor.' };
  }
};

// Validate admin session via server using JWT
export const validateAdminSession = async () => {
  const token = sessionStorage.getItem('admin_token');
  if (!token) return false;
  
  try {
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    const result = await response.json();
    if (result.valid) {
      // Verify device fingerprint matches the one in the token
      const currentFingerprint = generateDeviceFingerprint();
      if (result.payload.deviceFingerprint !== currentFingerprint) {
        sessionStorage.removeItem('admin_token');
        return false;
      }
      return true;
    }
  } catch (error) {
    console.error('Erro ao conectar com servidor para validar sessão');
  }
  
  sessionStorage.removeItem('admin_token');
  return false;
};

// Secure logout with complete cleanup
export const secureLogout = () => {
  sessionStorage.removeItem('admin_token');
  clearSecurityData();
};
