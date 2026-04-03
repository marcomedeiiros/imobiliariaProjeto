/**
 * Extrai o ID do vídeo do YouTube a partir de diversos formatos de URL.
 */
export const getYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/v\/([^?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Retorna a URL da thumbnail para um vídeo (YouTube) ou null para outros tipos.
 */
export const getVideoThumbnail = (videoUrl) => {
  if (!videoUrl) return null;
  
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    const videoId = getYouTubeId(videoUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  }
  
  return null; // Local videos will handle preview via <video> tag
};

/**
 * Determina qual mídia mostrar como banner principal.
 */
export const getDisplayMedia = (property) => {
  if (property.image && property.image.trim() !== "") {
    return { type: 'image', url: property.image };
  }
  
  if (property.videos && property.videos.length > 0) {
    const video = property.videos[0];
    const youtubeId = getYouTubeId(video);
    
    if (youtubeId) {
      return { 
        type: 'video-thumb', 
        url: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
        videoUrl: video
      };
    }
    
    if (video.startsWith('data:video/')) {
      return { type: 'video-local', url: video };
    }
    
    return { type: 'video-generic', url: video };
  }
  
  return { type: 'image', url: 'https://via.placeholder.com/800x600?text=Sem+Imagem' };
};
