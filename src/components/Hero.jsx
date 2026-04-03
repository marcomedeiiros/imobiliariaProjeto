import React, { useState } from 'react';

const Hero = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    location: '',
    type: 'Todos',
    price: 'Todos'
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <section id="início" style={{ 
      minHeight: '75vh', 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '100px 0 60px'
    }}>
      {/* Dynamic Background */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden',
        zIndex: -1 
      }}>
        <div className="hero-bg-animate" style={{ 
          width: '105%', 
          height: '105%', 
          position: 'absolute',
          top: '-2.5%',
          left: '-2.5%',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.65)), url("https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=2074&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}></div>
      </div>
      
      <div className="container animate-fade-in" style={{ position: 'relative', textAlign: 'center', color: 'white', zIndex: 1, padding: '0 10px' }}>
        <img src="/logo.png" alt="Ernando Leão Logo" style={{ width: 'clamp(150px, 20vw, 220px)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: 'clamp(1.8rem, 8vw, 3.5rem)', marginBottom: '0.8rem', lineHeight: '1.1' }}>Oportunidades Únicas em <br/> Terrenos e Loteamentos</h2>
        <p style={{ fontSize: 'clamp(0.9rem, 4vw, 1.25rem)', marginBottom: '1.5rem', opacity: 0.9, fontWeight: '300', maxWidth: '750px', marginInline: 'auto', letterSpacing: '0.5px' }}>
          Assessoria exclusiva de Ernando Leão para o seu próximo projeto ou investimento na Serra, ES.
        </p>
        
        <div className="glass hero-grid" style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          padding: '2.5rem', 
          borderRadius: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.2rem',
          alignItems: 'end',
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
        }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--primary)', fontWeight: '800', letterSpacing: '1px' }}>LOCALIZAÇÃO</label>
            <input 
              type="text" 
              placeholder="Ex: Laranjeiras..." 
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 16px', color: 'white', width: '100%', outline: 'none', transition: 'all 0.3s' }} 
              onFocus={(e) => e.target.style.border = '1px solid var(--primary)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--primary)', fontWeight: '800', letterSpacing: '1px' }}>FINALIDADE</label>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 16px', color: 'white', width: '100%', outline: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
              onFocus={(e) => e.target.style.border = '1px solid var(--primary)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}>
              <option value="Todos" style={{ background: '#0F172A', color: 'white', padding: '10px' }}>Todos</option>
              <option value="Residencial" style={{ background: '#0F172A', color: 'white', padding: '10px' }}>Residencial</option>
              <option value="Industrial" style={{ background: '#0F172A', color: 'white', padding: '10px' }}>Industrial</option>
              <option value="Comercial" style={{ background: '#0F172A', color: 'white', padding: '10px' }}>Comercial</option>
              <option value="Rural/Lazer" style={{ background: '#0F172A', color: 'white', padding: '10px' }}>Rural/Lazer</option>
            </select>
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--primary)', fontWeight: '800', letterSpacing: '1px' }}>VALOR</label>
            <select 
              value={filters.price}
              onChange={(e) => setFilters({...filters, price: e.target.value})}
              style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 16px', color: 'white', width: '100%', outline: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
              onFocus={(e) => e.target.style.border = '1px solid var(--primary)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}>
              <option value="Todos" style={{ background: '#0F172A', color: 'white', padding: '10px' }}>Todos</option>
              <option value="Até R$ 500k" style={{ background: '#0F172A', color: 'white', padding: '10px' }}>Até R$ 500k</option>
              <option value="R$ 500k - R$ 1.5M" style={{ background: '#0F172A', color: 'white', padding: '10px' }}>R$ 500k - R$ 1.5M</option>
              <option value="Acima de R$ 1.5M" style={{ background: '#0F172A', color: 'white', padding: '10px' }}>Acima de R$ 1.5M</option>
            </select>
          </div>
          <button className="btn-primary" onClick={handleSearch} style={{ padding: '14px 16px', fontSize: '1.05rem', boxShadow: '0 8px 25px rgba(218, 165, 32, 0.3)' }}>Buscar Terrenos</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
