import React from 'react';
import { WhatsApp } from './Icons';

const brokers = [
  {
    name: "Fabio Alexandre Moreira",
    role: "Corretor",
    specialty: "Grandes Áreas a partir de 500.000 m² · Localização Privilegiada · Excelente Oportunidade",
    image: "/fabio.png",
    experience: "10 Anos",
    whatsapp: "5527996419215"
  },
  {
    name: "Rafael Ferreira Dos Santos",
    role: "Corretor",
    specialty: "Negociação Flexível · Preços Competitivos · Localização Estratégica",
    image: "/rafael.png",
    experience: "3 Anos",
    whatsapp: "5527995144845"
  }
];

const BrokersGrid = () => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '2.5rem',
      marginTop: '3rem'
    }}>
      {brokers.map((broker, idx) => (
        <div key={idx} className="glass animate-fade-in" style={{ 
          padding: '1.5rem', 
          borderRadius: '25px', 
          textAlign: 'center',
          transition: 'var(--transition)',
          position: 'relative',
          border: '1px solid var(--glass-border)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-10px)';
          e.currentTarget.style.borderColor = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--glass-border)';
        }}>
          <div style={{ 
            width: '140px', 
            height: '140px', 
            borderRadius: '50%', 
            overflow: 'hidden', 
            margin: '0 auto 1.5rem',
            border: '3px solid var(--primary)',
            padding: '5px',
            background: broker.image.startsWith('/') ? 'white' : 'rgba(218, 165, 32, 0.1)'
          }}>
            <img src={broker.image} alt={broker.name} style={{ 
              width: '100%', height: '100%', 
              objectFit: 'cover', 
              objectPosition: broker.image.startsWith('/') && broker.name === 'Fabio Alexandre Moreira' ? 'top center' : (broker.image.startsWith('/') ? 'top center' : 'center'),
              borderRadius: '50%' 
            }} />
          </div>
          
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem', color: 'white' }}>{broker.name}</h3>
          <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            {broker.role}
          </p>
          
          <div style={{ 
            fontSize: '0.85rem', 
            color: 'var(--text-muted)', 
            marginBottom: '1.5rem', 
            minHeight: '40px',
            lineHeight: '1.4' 
          }}>
            {broker.specialty}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '15px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '1.2rem'
          }}>
            <button 
              className="btn-primary" 
              style={{ 
                padding: '8px 16px', fontSize: '0.85rem', width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
              onClick={() => {
                if (broker.whatsapp) {
                  window.open(`https://wa.me/${broker.whatsapp}?text=${encodeURIComponent(`Olá ${broker.name.split(' ')[0]}! Vi seu perfil no site da Ernando Leão e gostaria de saber mais sobre as áreas disponíveis na Serra - ES.`)}`, '_blank');
                }
              }}
            >
              {broker.whatsapp 
                ? <><WhatsApp size={17} color="white" /> WhatsApp</> 
                : 'Contatar'}
            </button>
          </div>
          
          <div style={{ 
            position: 'absolute', 
            top: '15px', 
            right: '15px', 
            background: 'rgba(0,0,0,0.5)', 
            padding: '4px 10px', 
            borderRadius: '10px', 
            fontSize: '0.65rem', 
            border: '1px solid var(--glass-border)' 
          }}>
            {broker.experience}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrokersGrid;
