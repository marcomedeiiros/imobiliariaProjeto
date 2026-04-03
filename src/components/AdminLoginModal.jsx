import React, { useState, useEffect } from 'react';
import { Lock, X } from './Icons';
import { secureLogin, getCurrentPasswordHash, isFirstTimeSetup } from '../utils/auth.js';
import { SECURITY_CONFIG } from '../config/security.js';
import FirstTimeSetupModal from './FirstTimeSetupModal.jsx';

const AdminLoginModal = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);
  const [serverOffline, setServerOffline] = useState(false);

  // Check server status on mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('/api/status');
        if (response.ok) {
          setServerOffline(false);
        } else {
          setServerOffline(true);
        }
      } catch (err) {
        setServerOffline(true);
      }
    };
    checkServer();
  }, []);

  // Generate unique device identifier
  const getDeviceIdentifier = () => {
    const fingerprint = btoa(navigator.userAgent + screen.width + screen.height + new Date().getTimezoneOffset());
    return fingerprint.replace(/[^a-zA-Z0-9]/g, '').substr(0, 20);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if it's first-time setup (no password needed) via backend
    try {
      const needsSetup = await isFirstTimeSetup();
      if (needsSetup) {
        setShowFirstTimeSetup(true);
        return;
      }
    } catch (err) {
      setServerOffline(true);
      setError('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      return;
    }
    
    if (!password.trim()) {
      setError('Por favor, digite a senha.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await secureLogin(password, SECURITY_CONFIG.ADMIN_PASSWORD_HASH, getDeviceIdentifier());
      
      if (result.success) {
        onLogin();
        onClose();
        setPassword('');
        setError('');
      } else {
        // Handle server-side lockout
        if (result.isLocked) {
          setLockoutTime(15); // Show as locked
          setError(result.error);
        } else if (result.error === 'Primeiro acesso necessário. Configure uma senha.') {
          setShowFirstTimeSetup(true);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Erro no sistema. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirstTimeSetupComplete = () => {
    // Session is automatically created by enhanced security system
    onLogin();
    onClose();
    setPassword('');
    setError('');
    setShowFirstTimeSetup(false);
  };

  return (
    <>
      {showFirstTimeSetup && (
        <FirstTimeSetupModal 
          onClose={() => {
            setShowFirstTimeSetup(false);
            setPassword('');
          }}
          onSetupComplete={handleFirstTimeSetupComplete}
        />
      )}
      
      <div style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200
      }} onClick={onClose}>
      <div className="glass" style={{ 
        maxWidth: '400px', width: '100%', borderRadius: '20px', 
        background: 'var(--bg)', padding: '2.5rem', textAlign: 'center',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{ 
          position: 'absolute', top: '15px', right: '15px', zIndex: 10,
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
        }}><X size={20} /></button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ 
            background: 'var(--primary-low)', 
            padding: '20px', 
            borderRadius: '50%',
            border: '1px solid var(--glass-border)'
          }}>
            <Lock size={40} color="var(--primary)" />
          </div>
        </div>
        <h2 style={{ marginBottom: '0.5rem' }}>Acesso Administrativo</h2>
        {serverOffline ? (
          <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1.5rem', background: 'rgba(255, 107, 107, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
            ⚠️ <strong>Servidor Offline:</strong> O backend não está respondendo. Execute <code>npm run server</code> em um novo terminal.
          </p>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Digite a senha para acessar o painel de gerenciamento.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            placeholder="Senha de acesso" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', padding: '15px', borderRadius: '12px', 
              border: error ? '2px solid red' : '1px solid rgba(0,0,0,0.1)',
              background: 'rgba(255,255,255,0.8)', outline: 'none', 
              marginBottom: '1rem', textAlign: 'center', fontSize: '1rem',
              transition: 'var(--transition)'
            }}
            autoFocus
          />
          
          {error && (
            <p style={{ 
              color: lockoutTime > 0 ? 'orange' : 'red', 
              fontSize: '0.8rem', 
              marginBottom: '1rem',
              fontWeight: lockoutTime > 0 ? '600' : 'normal'
            }}>
              {error}
            </p>
          )}
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ 
              flex: 1, 
              padding: '12px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              background: 'transparent', 
              color: 'rgba(255,255,255,0.6)',
              borderRadius: '15px',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}>Cancelar</button>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ flex: 2 }}
              disabled={isLoading || lockoutTime > 0}
            >
              {isLoading 
                ? 'Verificando...' 
                : 'Entrar'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default AdminLoginModal;
