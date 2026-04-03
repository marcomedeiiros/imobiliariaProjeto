import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyGrid from './components/PropertyGrid';
import Footer from './components/Footer';
import AdminLoginModal from './components/AdminLoginModal';
import BrokersGrid from './components/BrokersGrid';
import ChangePasswordModal from './components/ChangePasswordModal';
import { SECURITY_CONFIG } from './config/security.js';
import { validateAdminSession } from './utils/auth.js';
import './styles/animations.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Check for existing secure session on mount
  useEffect(() => {
    const checkSecureSession = async () => {
      const isValid = await validateAdminSession();
      if (isValid) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkSecureSession();
    
    // Set up enhanced session validation check
    const interval = setInterval(checkSecureSession, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Check for admin route and force verification
  useEffect(() => {
    const handleAdminRoute = async () => {
      if (window.location.pathname === '/admin') {
        const isValid = await validateAdminSession();
        if (!isValid) {
          setShowLogin(true);
        } else {
          setIsAdmin(true);
        }
        // Always clean up URL
        window.history.replaceState({}, document.title, '/');
      }
    };
    handleAdminRoute();
  }, []);
  const [filters, setFilters] = useState({
    location: '',
    type: 'Todos',
    price: 'Todos'
  });

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    // Scroll to results
    const grid = document.getElementById('terrenos');
    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      <Navbar isAdmin={isAdmin} onLogout={() => {
        import('./utils/auth.js').then(({ secureLogout }) => {
          secureLogout();
          setIsAdmin(false);
        });
      }} onChangePassword={() => setShowChangePassword(true)} />
      
      <main>
        <Hero onSearch={handleSearch} />
        
        <PropertyGrid isAdmin={isAdmin} filters={filters} />

        {/* Team Section */}
        <section id="sobre" className="section container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>Especialistas em Terrenos</span>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '1rem 0' }}>Nossa Equipe de Especialistas</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1rem' }}>
              Na Ernando Leão, contamos com profissionais altamente qualificados para oferecer a melhor consultoria estratégica no mercado imobiliário da Serra.
            </p>
          </div>
          
          <BrokersGrid />
        </section>
      </main>

      <Footer />

      {showLogin && (
        <AdminLoginModal 
          onLogin={() => setIsAdmin(true)} 
          onClose={() => setShowLogin(false)} 
        />
      )}

      {showChangePassword && (
        <ChangePasswordModal 
          onClose={() => setShowChangePassword(false)} 
          onLogout={() => {
            import('./utils/auth.js').then(({ secureLogout }) => {
              secureLogout();
              setIsAdmin(false);
            });
          }}
        />
      )}
    </div>
  );
}

export default App;
