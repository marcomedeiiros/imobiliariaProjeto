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
          maxWidth: '900px', 
          margin: '0 auto', 
          padding: '2rem', 
          borderRadius: 'var(--radius)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          alignItems: 'end'
        }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '600' }}>LOCALIZAÇÃO</label>
            <input 
              type="text" 
              placeholder="Ex: Laranjeiras..." 
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: 'white', width: '100%', outline: 'none' }} 
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '600' }}>FINALIDADE</label>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: 'white', width: '100%', outline: 'none', cursor: 'pointer' }}>
              <option style={{ color: 'black' }}>Todos</option>
              <option style={{ color: 'black' }}>Residencial</option>
              <option style={{ color: 'black' }}>Industrial</option>
              <option style={{ color: 'black' }}>Comercial</option>
              <option style={{ color: 'black' }}>Rural/Lazer</option>
            </select>
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '600' }}>VALOR</label>
            <select 
              value={filters.price}
              onChange={(e) => setFilters({...filters, price: e.target.value})}
              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: 'white', width: '100%', outline: 'none', cursor: 'pointer' }}>
              <option style={{ color: 'black' }}>Todos</option>
              <option style={{ color: 'black' }}>Até R$ 500k</option>
              <option style={{ color: 'black' }}>R$ 500k - R$ 1.5M</option>
              <option style={{ color: 'black' }}>Acima de R$ 1.5M</option>
            </select>
          </div>
          <button className="btn-primary" onClick={handleSearch} style={{ height: '50px' }}>Buscar Terrenos</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
