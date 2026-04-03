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
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
      gap: '3rem',
      marginTop: '3.5rem',
      padding: '1rem',
      maxWidth: '1000px',
      margin: '3.5rem auto 0 auto'
    }}>
      {brokers.map((broker, idx) => (
        <div key={idx} className="glass animate-fade-in" style={{ 
          padding: '2.5rem 2rem', 
          borderRadius: '24px', 
          textAlign: 'center',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative',
          background: 'linear-gradient(145deg, rgba(20,20,30,0.8) 0%, rgba(10,10,15,0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-12px)';
          e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(218, 165, 32, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(218, 165, 32, 0.3)';
          const imgContainerDiv = e.currentTarget.querySelector('.img-container');
          if(imgContainerDiv) {
            imgContainerDiv.style.transform = 'scale(1.05)';
            imgContainerDiv.style.boxShadow = '0 0 25px rgba(218, 165, 32, 0.5)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.03)';
          const imgContainerDiv = e.currentTarget.querySelector('.img-container');
          if(imgContainerDiv) {
            imgContainerDiv.style.transform = 'scale(1)';
            imgContainerDiv.style.boxShadow = '0 10px 20px rgba(0,0,0,0.4)';
          }
        }}>
          {/* Tag de Experiência Premium */}
          <div style={{ 
            position: 'absolute', 
            top: '-12px', 
            right: '25px', 
            background: 'linear-gradient(90deg, #1A1A24, #2A2A35)', 
            padding: '6px 14px', 
            borderRadius: '20px', 
            fontSize: '0.75rem', 
            fontWeight: '600',
            letterSpacing: '0.5px',
            color: 'var(--primary)',
            border: '1px solid rgba(218, 165, 32, 0.3)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            zIndex: 2
          }}>
            {broker.experience} ✦
          </div>

          <div className="img-container" style={{ 
            width: '150px', 
            height: '150px', 
            borderRadius: '50%', 
            margin: '0 auto 1.8rem',
            padding: '4px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #F9D976 50%, #E6AE26 100%)',
            transition: 'all 0.4s ease',
            boxShadow: '0 10px 20px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'white',
              overflow: 'hidden',
            }}>
              <img src={broker.image} alt={broker.name} style={{ 
                width: '100%', height: '100%', 
                objectFit: 'cover', 
                objectPosition: broker.image.startsWith('/') && broker.name === 'Fabio Alexandre Moreira' ? 'top center' : (broker.image.startsWith('/') ? 'top center' : 'center'),
              }} />
            </div>
          </div>
          
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.3rem', color: 'white', fontWeight: '700', letterSpacing: '-0.5px' }}>{broker.name}</h3>
          <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>
            {broker.role}
          </p>
          
          {/* Lista de especialidades empilhada */}
          <div style={{ 
            fontSize: '0.9rem', 
            color: 'rgba(255,255,255,0.7)', 
            marginBottom: '2rem', 
            minHeight: '60px',
            lineHeight: '1.6',
            fontWeight: '300',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            {broker.specialty.split(' · ').map((item, idx) => (
              <span key={idx} style={{ display: 'block' }}>• {item}</span>
            ))}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '1.5rem',
            position: 'relative'
          }}>
            {/* Efeito de brilho na linha divisória */}
            <div style={{
              position: 'absolute',
              top: '-1px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50px',
              height: '1px',
              background: 'var(--primary)',
              boxShadow: '0 0 10px var(--primary)'
            }}></div>

            <button 
              className="btn-primary" 
              style={{ 
                padding: '12px 24px', fontSize: '0.95rem', width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                borderRadius: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                background: 'linear-gradient(45deg, #CF9B1A 0%, #F9D976 50%, #CF9B1A 100%)',
                backgroundSize: '200% auto',
                border: 'none',
                color: '#1A1A1A',
                boxShadow: '0 4px 15px rgba(218, 165, 32, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundPosition = 'right center';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(218, 165, 32, 0.6)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundPosition = 'left center';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(218, 165, 32, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => {
                if (broker.whatsapp) {
                  window.open(`https://wa.me/${broker.whatsapp}?text=${encodeURIComponent(`Olá ${broker.name.split(' ')[0]}! Vi seu perfil no site da Ernando Leão e gostaria de saber mais sobre as áreas disponíveis na Serra - ES.`)}`, '_blank');
                }
              }}
            >
              {broker.whatsapp 
                ? <><WhatsApp size={20} color="#1A1A1A" /> Falar no WhatsApp</> 
                : 'Contatar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrokersGrid;
