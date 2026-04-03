import React, { useState, useEffect } from 'react';
import { X, MapPin, Ruler, Mountain, ClipboardList, Smartphone } from './Icons';
import VideoPlayer from './VideoPlayer';
import { getYouTubeId } from '../utils/videoUtils.js';

const PropertyModal = ({ property, onClose }) => {
  const [activeImage, setActiveImage] = useState(() => {
    if (property.image && property.image.trim() !== "") return property.image;
    if (property.videos && property.videos.length > 0) {
      const vid = property.videos[0];
      const vidId = getYouTubeId(vid);
      if (vidId) return `https://img.youtube.com/vi/${vidId}/maxresdefault.jpg`;
      if (vid.startsWith('data:video/')) return vid;
    }
    return property.image || 'https://via.placeholder.com/800x600?text=Sem+Imagem';
  });
  const [showVideoPlayer, setShowVideoPlayer] = useState(null);
  const allImages = [property.image, ...(property.secondaryImages || [])].filter(img => !!img);

  // Helper to get video URL from a thumbnail or local video state
  const getActiveVideoUrl = () => {
    if (activeImage.startsWith('data:video/')) return activeImage;
    if (activeImage.includes('youtube.com/vi/')) {
      // Find which video matches this thumbnail
      return property.videos.find(v => {
        const id = getYouTubeId(v);
        return id && activeImage.includes(id);
      }) || property.videos[0];
    }
    return null;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
`Olá Corretor! Gostaria de mais informações sobre o terreno: ${property.title} em ${property.location}.

${property.type}
${property.title}
${property.location}

${property.area}
${property.topology}
${property.zoning || 'N/A'}
${property.description}

Valor do Investimento
${property.price}`
    );
    window.open(`https://wa.me/5527995829438?text=${message}`, '_blank');
  };

  const activeVideoUrl = getActiveVideoUrl();

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
      padding: '0'
    }} onClick={onClose}>
      
      <div className="glass animate-fade-in modal-content" style={{ 
        maxWidth: '1000px', width: '95%', borderRadius: 'var(--radius)', 
        background: 'var(--bg)', overflow: 'hidden', position: 'relative',
        maxHeight: '95vh', overflowY: 'auto', display: 'flex', flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{ 
          position: 'absolute', top: '15px', right: '15px', zIndex: 100,
          background: 'rgba(0,0,0,0.5)', border: 'none', width: '35px', height: '35px',
          borderRadius: '50%', cursor: 'pointer', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Image Side */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              height: 'clamp(250px, 45vh, 450px)', 
              position: 'relative', 
              background: '#000',
              margin: '15px',
              borderRadius: '15px',
              overflow: 'hidden',
              border: '2px solid var(--glass-border)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
            }}>
              {activeImage && activeImage.startsWith('data:video/') ? (
                <video src={activeImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
              ) : (
                <img 
                  src={activeImage} 
                  alt={property.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => {
                    if (activeImage.includes('maxresdefault.jpg')) {
                      e.target.src = activeImage.replace('maxresdefault.jpg', 'mqdefault.jpg');
                    } else if (!activeImage.includes('via.placeholder')) {
                      e.target.src = 'https://via.placeholder.com/800x600?text=Erro+ao+Carregar';
                    }
                  }}
                />
              )}
              {activeVideoUrl && (
                <div 
                  onClick={() => setShowVideoPlayer(activeVideoUrl)}
                  style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    background: 'rgba(218, 165, 32, 0.9)', color: 'white', width: '70px', height: '70px',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 10, boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                    fontSize: '2rem', transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'; e.currentTarget.style.background = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'; e.currentTarget.style.background = 'rgba(218, 165, 32, 0.9)'; }}
                >
                  ▶
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {(allImages.length > 1 || (property.videos && property.videos.length > 0)) && (
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                padding: '0 15px 15px 15px', 
                background: 'transparent', 
                overflowX: 'auto',
                scrollbarWidth: 'none'
              }}>
                {/* Image thumbnails */}
                {allImages.map((img, idx) => (
                  <div 
                    key={`img-${idx}`}
                    onClick={() => setActiveImage(img)}
                    style={{ 
                      width: '80px', 
                      height: '60px', 
                      borderRadius: '10px', 
                      overflow: 'hidden', 
                      cursor: 'pointer',
                      border: activeImage === img ? '3px solid var(--primary)' : '1.5px solid var(--glass-border)',
                      transition: 'all 0.2s',
                      flexShrink: 0,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}>
                    <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
                
                {/* Video thumbnails */}
                {property.videos && property.videos.length > 0 && property.videos.map((video, idx) => {
                  const videoId = getYouTubeId(video);
                  const isYouTube = !!videoId;
                  const thumb = isYouTube ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
                  const isCurrent = activeVideoUrl === video;

                  return (
                    <div 
                      key={`video-${idx}`}
                      onClick={() => {
                        if (isYouTube) {
                          const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                          if (activeImage === thumbUrl) {
                            setShowVideoPlayer(video); // Play on second click
                          } else {
                            setActiveImage(thumbUrl);
                          }
                        } else if (video.startsWith('data:video/')) {
                          if (activeImage === video) {
                            setShowVideoPlayer(video); // Play on second click
                          } else {
                            setActiveImage(video);
                          }
                        } else {
                          setShowVideoPlayer(video);
                        }
                      }}
                      style={{ 
                        width: '80px', 
                        height: '60px', 
                        borderRadius: '10px', 
                        overflow: 'hidden', 
                        cursor: 'pointer',
                        border: isCurrent ? '3px solid var(--primary)' : '1.5px solid var(--glass-border)',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        position: 'relative',
                        background: '#000'
                      }}
                    >
                      {isYouTube ? (
                        <img 
                          src={thumb} 
                          alt={`Video ${idx}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
                          }}
                        />
                      ) : video.startsWith('data:video/') ? (
                        <video 
                          src={video} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          muted
                        />
                      ) : (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white', 
                          fontSize: '20px',
                          background: 'rgba(0,0,0,0.5)'
                        }}>
                          ▶
                        </div>
                      )}
                      
                      <div style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        borderRadius: '4px',
                        padding: '2px 4px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        ▶
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Side */}
          <div style={{ padding: 'clamp(1.2rem, 5vw, 2.5rem)', display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{property.type}</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginBottom: '0.8rem', lineHeight: '1.2' }}>{property.title}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} /> {property.location}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={metricBoxStyle}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}><Ruler size={18} /></div>
                <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{property.area}</div>
              </div>
              <div style={metricBoxStyle}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}><Mountain size={18} /></div>
                <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{property.topology}</div>
              </div>
              <div style={metricBoxStyle}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}><ClipboardList size={18} /></div>
                <div style={{ fontWeight: '700', fontSize: '0.7rem' }}>{property.zoning || 'Não Informado'}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>{property.description}</p>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Valor do Investimento</span>
                <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>{property.price}</span>
              </div>
              <button 
                onClick={handleWhatsApp}
                className="btn-primary" 
                style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                <Smartphone size={18} color="white" /> Contatar Corretor
              </button>
            </div>
          </div>
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

const metricBoxStyle = {
  background: 'var(--bg)', 
  padding: '12px 5px', 
  borderRadius: '12px', 
  border: '1px solid var(--glass-border)',
  textAlign: 'center'
};

export default PropertyModal;
