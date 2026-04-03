import React from 'react';
import { Pencil, Trash2, MapPin, Ruler, Mountain } from './Icons';
import VideoPlayer from './VideoPlayer';
import { getDisplayMedia } from '../utils/videoUtils.js';

const PropertyCard = ({ property, onOpen, onEdit, onDelete, isAdmin }) => {
  const [showVideoPlayer, setShowVideoPlayer] = React.useState(null);
  const media = getDisplayMedia(property);

  return (
    <div className="glass" style={{ 
      borderRadius: 'var(--radius)', 
      overflow: 'hidden', 
      transition: 'var(--transition)',
      position: 'relative'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      
      {/* Action Overlay - Only for Admins */}
      {isAdmin && (
        <div style={{ 
          position: 'absolute', top: '10px', right: '10px', 
          display: 'flex', gap: '8px', zIndex: 10 
        }}>
          <button onClick={() => onEdit(property)} style={{ ...actionButtonStyle, background: 'var(--glass)' }} title="Editar">
            <Pencil size={16} color="var(--primary)" />
          </button>
          <button onClick={() => onDelete(property.id)} style={{ ...actionButtonStyle, background: 'rgba(255,100,100,0.1)', color: 'red' }} title="Excluir">
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div className="card-image-container" style={{ height: '220px', position: 'relative', background: '#000' }}>
        {media.type === 'video-local' ? (
          <video src={media.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
        ) : (
          <img src={media.url} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}

        {/* Play Icon Overlay for videos shown as banner */}
        {media.type.startsWith('video') && (
          <div 
            onClick={() => setShowVideoPlayer(property.videos[0])}
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: 'rgba(218, 165, 32, 0.8)', color: 'white', width: '50px', height: '50px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 2, boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              fontSize: '1.5rem', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'; e.currentTarget.style.background = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'; e.currentTarget.style.background = 'rgba(218, 165, 32, 0.8)'; }}
          >
            ▶
          </div>
        )}
        
        {/* Video count indicator if not already showing as banner */}
        {!media.type.startsWith('video') && property.videos && property.videos.length > 0 && (
          <div 
            onClick={() => setShowVideoPlayer(property.videos[0])}
            style={{ 
              position: 'absolute', top: '10px', right: '10px', 
              background: 'rgba(0,0,0,0.7)', color: 'white', 
              padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              zIndex: 5
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
          >
            ▶ {property.videos.length}
          </div>
        )}
        
        <div style={{ 
          position: 'absolute', top: '10px', left: '10px', 
          background: 'var(--primary)', color: 'white', 
          padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
          zIndex: 5
        }}>
          {property.type || 'Terreno'}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '700' }}>{property.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={14} /> {property.location}
        </p>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Ruler size={14} /> {property.area}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Mountain size={14} /> {property.topology}</span>
        </div>
        
        <div className="card-footer" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
            {property?.price && typeof property.price === 'string' && property.price.includes('R$') 
              ? property.price 
              : `R$ ${new Number(property?.price || 0).toLocaleString('pt-BR')}`}
          </span>
          <button className="btn-primary" onClick={() => onOpen(property)} style={{ padding: '8px 16px', fontSize: '0.85rem', flex: '1 1 auto', textAlign: 'center' }}>
            Ver Detalhes
          </button>
        </div>
      </div>
    
    {/* Video Player Modal */}
    {showVideoPlayer && (
      <VideoPlayer 
        video={showVideoPlayer} 
        onClose={() => setShowVideoPlayer(null)} 
      />
    )}
    </div>
  );
};

const actionButtonStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: '1px solid rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '0.9rem',
  backdropFilter: 'blur(5px)'
};

export default PropertyCard;
