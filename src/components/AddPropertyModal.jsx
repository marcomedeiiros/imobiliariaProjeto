import React, { useState, useEffect } from 'react';
import { X, Lock, Folder, Plus } from './Icons';
import { getYouTubeId } from '../utils/videoUtils.js';

const AddPropertyModal = ({ onAdd, onEdit, editProperty, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: 'Serra, ES',
    type: 'Residencial',
    area: '',
    topology: 'Plano',
    zoning: '',
    image: '',
    secondaryImages: [],
    videos: [],
    description: ''
  });

  const [newSecondaryUrl, setNewSecondaryUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  useEffect(() => {
    if (editProperty) {
      setFormData({
        ...editProperty,
        secondaryImages: editProperty.secondaryImages || [],
        videos: editProperty.videos || []
      });
    }
  }, [editProperty]);

  const formatPrice = (val) => {
    // Remove all non-digits
    let clean = val.replace(/\D/g, '');
    if (!clean) return '';

    // Format with dots
    const formatted = new Number(clean).toLocaleString('pt-BR');
    return `R$ ${formatted}`;
  };

  const formatArea = (val) => {
    let clean = val.replace(/\D/g, '');
    return clean ? `${clean} m²` : ' m²';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setFormData(prev => ({ ...prev, price: formatPrice(value) }));
    } else if (name === 'area') {
      setFormData(prev => ({ ...prev, area: formatArea(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, target) => {
    const file = e.target.files[0];
    if (file) {
      // Video size validation (max 50MB)
      if (target === 'video') {
        const maxSize = 50 * 1024 * 1024; // 50MB in bytes
        if (file.size > maxSize) {
          alert('O vídeo é muito grande! O tamanho máximo permitido é 50MB.');
          e.target.value = ''; // Clear the input
          return;
        }

        // Check file type
        if (!file.type.startsWith('video/')) {
          alert('Por favor, selecione um arquivo de vídeo válido.');
          e.target.value = '';
          return;
        }

        setIsUploadingVideo(true);
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (target === 'main') {
          setFormData(prev => ({ ...prev, image: reader.result }));
        } else if (target === 'secondary') {
          setFormData(prev => ({
            ...prev,
            secondaryImages: [...prev.secondaryImages, reader.result]
          }));
        } else if (target === 'video') {
          try {
            const videoData = reader.result;
            setFormData(prev => ({
              ...prev,
              videos: [...prev.videos, videoData]
            }));
          } catch (error) {
            console.error('Error processing video file:', error);
            alert('Erro ao processar vídeo. Tente um arquivo menor ou formato diferente.');
          }
        }

        if (target === 'video') {
          setIsUploadingVideo(false);
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Erro ao ler arquivo. Tente novamente.');
        if (target === 'video') {
          setIsUploadingVideo(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const addSecondaryUrl = () => {
    if (newSecondaryUrl) {
      setFormData(prev => ({
        ...prev,
        secondaryImages: [...prev.secondaryImages, newSecondaryUrl]
      }));
      setNewSecondaryUrl('');
    }
  };

  const removeSecondaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      secondaryImages: prev.secondaryImages.filter((_, i) => i !== index)
    }));
  };

  const addVideoUrl = () => {
    if (newVideoUrl) {
      // Validate YouTube URL
      const videoId = getYouTubeId(newVideoUrl);
      if (newVideoUrl.includes('youtube.com') || newVideoUrl.includes('youtu.be')) {
        if (!videoId) {
          alert('URL do YouTube inválida! Verifique o link.');
          return;
        }
      }

      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, newVideoUrl]
      }));
      setNewVideoUrl('');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      image: formData.image || ""
    };

    if (editProperty) {
      onEdit(finalData);
    } else {
      onAdd({ ...finalData, id: Date.now() });
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
      padding: '0'
    }} onClick={onClose}>
      <div className="glass modal-content" style={{
        maxWidth: '750px', width: '95%', borderRadius: 'var(--radius)',
        background: 'var(--bg)', padding: 'clamp(1rem, 5vw, 2rem)', position: 'relative',
        maxHeight: '95vh', overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>

        {/* Mobile Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '15px', zIndex: 10,
          background: 'rgba(0,0,0,0.05)', border: 'none', width: '35px', height: '35px',
          borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}><X size={20} /></button>

        <h2 style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', paddingRight: '40px' }}>
          {editProperty ? 'Editar Terreno' : 'Novo Terreno'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '15px' }}>
            {/* Primary Image */}
            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={labelStyle}>Imagem Principal</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input name="image" value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                  onChange={handleChange}
                  placeholder="Link..." style={{ ...inputStyle, flex: 1 }} />
                <label style={exploreButtonStyle}>
                  <Folder size={18} />
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'main')} style={{ display: 'none' }} />
                </label>
              </div>
              {formData.image && (
                <div style={{ height: '100px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--primary)' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            {/* Gallery Add */}
            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={labelStyle}>Fotos Extras</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={newSecondaryUrl} onChange={(e) => setNewSecondaryUrl(e.target.value)}
                  placeholder="Link..." style={{ ...inputStyle, flex: 1 }} />
                <button type="button" onClick={addSecondaryUrl} style={addButtonStyle}><Plus size={18} /></button>
                <label style={exploreButtonStyle}>
                  <Folder size={18} />
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'secondary')} style={{ display: 'none' }} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                {formData.secondaryImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={img} alt="Extra" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removeSecondaryImage(idx)} style={removeButtonStyle}><X size={10} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={labelStyle}>Vídeos (YouTube, Upload)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="Link do vídeo..." style={{ ...inputStyle, flex: 1 }} />
                <button type="button" onClick={addVideoUrl} style={{ ...addButtonStyle, background: 'var(--primary)', color: 'white' }} title="Adicionar Vídeo">
                  <Plus size={18} />
                </button>
                <label style={{ ...exploreButtonStyle, opacity: isUploadingVideo ? 0.6 : 1, cursor: isUploadingVideo ? 'not-allowed' : 'pointer' }}>
                  {isUploadingVideo ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span style={{ fontSize: '12px', color: 'white' }}>Enviando...</span>
                    </div>
                  ) : (
                    <Folder size={18} />
                  )}
                  <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} style={{ display: 'none' }} disabled={isUploadingVideo} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                {formData.videos.map((video, idx) => {
                  const isUploaded = video.startsWith('data:video/');
                  const videoSize = isUploaded ? Math.round(video.length * 0.75 / 1024) : null; // Approximate size

                  return (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '50px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#000' }}>
                      {video.includes('youtube.com') || video.includes('youtu.be') ? (() => {
                        const videoId = getYouTubeId(video);
                        const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
                        console.log('YouTube ID:', videoId, 'Thumbnail URL:', thumbnailUrl);

                        return videoId ? (
                          <img
                            src={thumbnailUrl}
                            alt="Video"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              console.log('Thumbnail failed, trying fallback');
                              // Fallback to default quality if mqdefault fails
                              e.target.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
                            }}
                            onLoad={() => console.log('Thumbnail loaded successfully')}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', background: 'rgba(255,0,0,0.3)' }}>
                            Invalid YouTube
                          </div>
                        );
                      })() : video.startsWith('data:video/') ? (
                        <video
                          src={video}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          muted
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px' }}>
                          ▶
                        </div>
                      )}

                      {/* Size indicator for uploaded videos */}
                      {isUploaded && videoSize && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          left: '2px',
                          background: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          borderRadius: '3px',
                          padding: '1px 3px',
                          fontSize: '8px',
                          fontWeight: '600'
                        }}>
                          {videoSize > 1024 ? `${(videoSize / 1024).toFixed(1)}MB` : `${videoSize}KB`}
                        </div>
                      )}

                      <button type="button" onClick={() => removeVideo(idx)} style={removeButtonStyle}><X size={10} /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Título</label>
              <input name="title" required value={formData.title} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Finalidade</label>
              <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                <option>Residencial</option>
                <option>Industrial</option>
                <option>Comercial</option>
                <option>Rural/Lazer</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Preço</label>
              <input name="price" required value={formData.price} onChange={handleChange} placeholder="Ex: R$ 500.000" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Área (m²)</label>
              <input name="area" required value={formData.area} onChange={handleChange} placeholder="Ex: 500 m²" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Localização</label>
              <input name="location" required value={formData.location} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Topologia</label>
              <select name="topology" value={formData.topology} onChange={handleChange} style={inputStyle}>
                <option value="Plano">Plano</option>
                <option value="Aclive">Aclive</option>
                <option value="Declive">Declive</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Zoneamento</label>
              <input name="zoning" value={formData.zoning} onChange={handleChange} placeholder="Ex: Residencial, ZUE, etc." style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Descrição</label>
            <textarea name="description" required value={formData.description} onChange={handleChange}
              style={{ ...inputStyle, height: '80px', resize: 'none' }}></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{
              flex: 1,
              padding: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }}>Cancelar</button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}>{editProperty ? 'Salvar' : 'Publicar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', fontSize: '0.9rem' };
const exploreButtonStyle = { padding: '8px 12px', background: 'var(--primary-low)', color: 'var(--primary)', borderRadius: '10px', cursor: 'pointer', border: '1px dashed var(--primary)' };
const addButtonStyle = { padding: '0 12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '1.1rem' };
const removeButtonStyle = { position: 'absolute', top: '1px', right: '1px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', cursor: 'pointer' };

export default AddPropertyModal;
