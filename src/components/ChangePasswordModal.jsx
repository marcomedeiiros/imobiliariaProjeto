import React, { useState } from 'react';
import { Lock, X } from './Icons';
import { changeAdminPassword } from '../utils/auth.js';

const ChangePasswordModal = ({ onClose, onLogout }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

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
    
    // Validate new password locally first
    const validationError = validatePassword(newPassword);
    if (validationError) {
      showError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await changeAdminPassword(currentPassword, newPassword);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onLogout();
          onClose();
        }, 2000);
      } else {
        showError(result.error || 'Erro ao alterar senha.');
      }
    } catch (err) {
      showError('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300
    }} onClick={onClose}>
      <div className="glass" style={{
        maxWidth: '420px', width: '95%', borderRadius: '20px',
        background: 'var(--bg)', padding: '2.5rem', textAlign: 'center', position: 'relative'
      }} onClick={e => e.stopPropagation()}>

        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '15px',
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
        }}><X size={20} /></button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{
            background: 'rgba(218,165,32,0.1)',
            padding: '18px', borderRadius: '50%',
            border: '1px solid rgba(218,165,32,0.3)'
          }}>
            <Lock size={36} color="var(--primary)" />
          </div>
        </div>

        <h2 style={{ marginBottom: '0.4rem' }}>Alterar Senha</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Modifique a sua senha de acesso administrativo.
        </p>

        {success ? (
          <div style={{
            background: 'rgba(100,220,100,0.1)', border: '1px solid rgba(100,220,100,0.3)',
            borderRadius: '12px', padding: '16px', color: '#7be87b'
          }}>
            ✓ Senha alterada com sucesso!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', textAlign: 'left' }}>
            <div>
              <label style={labelStyle}>Senha Atual</label>
              <input
                type="password" required value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Digite a senha atual" style={inputStyle} autoFocus
              />
            </div>
            <div>
              <label style={labelStyle}>Nova Senha</label>
              <input
                type="password" required value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres, maiúsculas e números" style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Confirmar Nova Senha</label>
              <input
                type="password" required value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha" style={inputStyle}
              />
            </div>

            {error && (
              <p style={{
                background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)',
                borderRadius: '8px', padding: '10px', color: '#ff7b7b',
                fontSize: '0.85rem', textAlign: 'center'
              }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} style={{
                flex: 1, padding: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent', color: 'rgba(255,255,255,0.6)',
                borderRadius: '12px', cursor: 'pointer', transition: 'var(--transition)'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >Cancelar</button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={isLoading}>
                {isLoading ? 'Alterando...' : 'Salvar Nova Senha'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px', color: 'var(--text-muted)' };
const inputStyle = {
  width: '100%', padding: '12px', borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.07)',
  color: 'white', fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.2s'
};

export default ChangePasswordModal;
