import React, { useState, useEffect } from 'react';
import { Menu, X } from './Icons';

const Navbar = ({ isAdmin, onLogout, onChangePassword }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#início' },
    { name: 'Terrenos', href: '#terrenos' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <nav style={{ 
      position: 'fixed', top: 0, width: '100%', zIndex: 1000,
      background: scrolled ? 'rgba(5, 5, 5, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(218, 165, 32, 0.1)' : 'none',
      padding: scrolled ? '12px 0' : '20px 0',
      transition: 'all 0.4s ease'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
        <h1 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', color: 'white', fontWeight: '800', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Ernando <span style={{ color: 'var(--primary)' }}>Leão</span>
        </h1>
        
        {/* Desktop Links */}
        <div className="desktop-only" style={{ display: 'flex', gap: '30px' }}>
          {navLinks.map(link => (
            <a key={link.name} href={link.href} style={{ 
              color: 'white', textDecoration: 'none', fontSize: '0.9rem', 
              fontWeight: '500', opacity: 0.8, transition: 'var(--transition)' 
            }}
            onMouseEnter={(e) => { e.target.style.opacity = 1; e.target.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.target.style.opacity = 0.8; e.target.style.color = 'white'; }}>
              {link.name}
            </a>
          ))}
          {isAdmin && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={onChangePassword} style={{ 
                background: 'rgba(218,165,32,0.1)', color: 'var(--primary)', 
                border: '1px solid rgba(218,165,32,0.3)', 
                padding: '5px 12px', borderRadius: '15px', fontSize: '0.78rem',
                cursor: 'pointer', transition: 'var(--transition)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(218,165,32,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(218,165,32,0.1)'}>
                Alterar Senha
              </button>
              <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '15px', fontSize: '0.8rem', cursor: 'pointer' }}>
                Sair
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ 
          background: 'none', border: 'none', color: 'white' 
        }}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="animate-fade-in" style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', 
          background: 'rgba(5, 5, 5, 0.98)', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', gap: '30px', zIndex: 2000 
        }}>
          <button onClick={() => setMobileMenuOpen(false)} style={{ 
            position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white' 
          }}>
            <X size={32} />
          </button>
          {navLinks.map((item) => (
            <a key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}
               style={{ textDecoration: 'none', color: 'white', fontWeight: '500', fontSize: '1.1rem' }}>
              {item.name}
            </a>
          ))}
          {isAdmin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <button onClick={() => { onChangePassword(); setMobileMenuOpen(false); }} style={{ 
                background: 'rgba(218,165,32,0.1)', color: 'var(--primary)', 
                border: '1px solid rgba(218,165,32,0.3)', 
                padding: '10px 24px', borderRadius: '15px', fontSize: '0.9rem', cursor: 'pointer'
              }}>Alterar Senha</button>
              <button onClick={() => { 
                import('../utils/auth.js').then(({ secureLogout }) => {
                  secureLogout();
                  onLogout(); 
                  setMobileMenuOpen(false); 
                });
              }} style={{ ...adminBtnStyle, padding: '12px' }}>Sair da Admin</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

const adminBtnStyle = {
  background: 'rgba(255,100,100,0.1)', 
  color: 'red', 
  border: '1px solid rgba(255,100,100,0.2)',
  padding: '6px 15px', 
  borderRadius: '8px', 
  cursor: 'pointer', 
  fontSize: '0.8rem', 
  fontWeight: '600'
};

export default Navbar;
