import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chat Ultra - Mazlo',
    short_name: 'Chat Ultra',
    description: 'AI-powered collaborative workspace with Mazlo',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#38BDF2',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

