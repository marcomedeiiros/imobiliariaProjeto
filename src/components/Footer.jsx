import React from 'react';
import { Phone, Mail, MapPin } from './Icons';

const Footer = () => {
  return (
    <footer id="contato" style={{ 
      background: 'rgba(5, 5, 5, 0.95)', 
      color: 'white', 
      padding: '5rem 0 2rem', 
      borderTop: '1px solid rgba(218, 165, 32, 0.2)' 
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Ernando <span style={{ color: 'var(--primary)' }}>Leão</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Soluções Imobiliárias de alto padrão na Serra, ES. Especialista em encontrar o terreno perfeito para o seu sonho ou investimento.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '700' }}>Explorar</h4>
            <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li className="footer-link" onClick={() => document.getElementById('início')?.scrollIntoView({ behavior:'smooth' })} style={{ cursor: 'pointer' }}>Início</li>
              <li className="footer-link" onClick={() => document.getElementById('terrenos')?.scrollIntoView({ behavior:'smooth' })} style={{ cursor: 'pointer' }}>Terrenos</li>
              <li className="footer-link" onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior:'smooth' })} style={{ cursor: 'pointer' }}>Sobre</li>
                          </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '700' }}>Fale Conosco</h4>
            <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} /> (27) 99582-9438
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} /> ernandoleaosolucoesimobiliaria@gmail.com
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} style={{ marginTop: '3px' }} /> <span>Avenida talma Rodrigues,<br/>Jacaraipe - ES</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', textAlign: 'center' }}>
          <p style={{ opacity: 0.4, fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            ERNANDO LEÃO | © 2026 TODOS OS DIREITOS RESERVADOS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
