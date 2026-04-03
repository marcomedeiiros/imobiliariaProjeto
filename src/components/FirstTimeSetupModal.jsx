import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff } from './Icons';
import { setupAdmin } from '../utils/auth.js';

const FirstTimeSetupModal = ({ onClose, onSetupComplete }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres.';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'A senha deve conter letras maiúsculas, minúsculas e números.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword.trim()) {
      setError('Por favor, digite uma nova senha.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await setupAdmin(newPassword);
      
      if (result.success) {
        onSetupComplete();
        onClose();
      } else {
        setError(result.error || 'Erro ao configurar senha.');
      }
    } catch (err) {
      setError('Erro ao atualizar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300
    }} onClick={onClose}>
      <div className="glass" style={{ 
        maxWidth: '450px', width: '100%', borderRadius: '20px', 
        background: 'var(--bg)', padding: '2.5rem', textAlign: 'center',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{ 
          position: 'absolute', top: '15px', right: '15px', zIndex: 10,
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
        }}><X size={20} /></button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            background: 'var(--primary-low)', 
            padding: '20px', 
            borderRadius: '50%',
            border: '1px solid var(--glass-border)'
          }}>
            <Lock size={40} color="var(--primary)" />
          </div>
        </div>
        
        <h2 style={{ marginBottom: '0.5rem' }}>Configurar Senha Administrativa</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Esta é sua primeira vez acessando o painel. Por segurança, defina uma nova senha para o acesso administrativo.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Nova Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Digite sua nova senha" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ 
                  width: '100%', padding: '15px 45px 15px 15px', borderRadius: '12px', 
                  border: error ? '2px solid red' : '1px solid rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.8)', outline: 'none', 
                  fontSize: '1rem', transition: 'var(--transition)'
                }}
                autoFocus
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Confirmar Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="Confirme sua nova senha" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ 
                  width: '100%', padding: '15px 45px 15px 15px', borderRadius: '12px', 
                  border: error ? '2px solid red' : '1px solid rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.8)', outline: 'none', 
                  fontSize: '1rem', transition: 'var(--transition)'
                }}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ 
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {error && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}
          
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              <strong>Requisitos da senha:</strong><br/>
              • Mínimo 8 caracteres<br/>
              • Letras maiúsculas e minúsculas<br/>
              • Pelo menos um número
            </p>
          </div>
          
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
            <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={isLoading}>
              {isLoading ? 'Configurando...' : 'Configurar Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FirstTimeSetupModal;
