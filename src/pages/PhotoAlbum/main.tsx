import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PhotoAlbumPage } from './PhotoAlbumPage';
import '../../styles/globals.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element #root not found');
}

createRoot(root).render(
  <StrictMode>
    <PhotoAlbumPage />
  </StrictMode>,
);
