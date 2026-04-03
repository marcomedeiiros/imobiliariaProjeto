// Session management utilities
import { SECURITY_CONFIG } from '../config/security.js';

export const sessionManager = {
  // Create new session
  createSession() {
    const sessionData = {
      isAdmin: true,
      loginTime: Date.now(),
      expiresAt: Date.now() + SECURITY_CONFIG.SESSION_TIMEOUT,
      sessionId: this.generateSessionId()
    };
    
    sessionStorage.setItem('admin_session', JSON.stringify(sessionData));
    return sessionData;
  },
  
  // Validate existing session
  validateSession() {
    const sessionData = sessionStorage.getItem('admin_session');
    if (!sessionData) return false;
    
    try {
      const session = JSON.parse(sessionData);
      return session.isAdmin && session.expiresAt > Date.now();
    } catch (err) {
      return false;
    }
  },
  
  // Destroy session
  destroySession() {
    sessionStorage.removeItem('admin_session');
  },
  
  // Generate unique session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },
  
  // Refresh session
  refreshSession() {
    if (this.validateSession()) {
      const sessionData = JSON.parse(sessionStorage.getItem('admin_session'));
      sessionData.expiresAt = Date.now() + SECURITY_CONFIG.SESSION_TIMEOUT;
      sessionStorage.setItem('admin_session', JSON.stringify(sessionData));
      return true;
    }
    return false;
  },
  
  // Get session info
  getSessionInfo() {
    const sessionData = sessionStorage.getItem('admin_session');
    if (!sessionData) return null;
    
    try {
      return JSON.parse(sessionData);
    } catch (err) {
      return null;
    }
  }
};
