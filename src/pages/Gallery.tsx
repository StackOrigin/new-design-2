import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { galleryData } from '../data/schoolData';

const categories = ['All', 'Campus', 'Facilities', 'Sports', 'Events'];

export default function Gallery() {
  useReveal();
  const [active, setActive] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = active === 'All' ? galleryData : galleryData.filter(g => g.category === active);

  const currentPhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const nextPhoto = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  }, [lightboxIndex, filtered.length]);

  const prevPhoto = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  }, [lightboxIndex, filtered.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [nextPhoto, prevPhoto]);

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Gallery</span></nav>
          <h1 className="page-hero-title">Photo Gallery</h1>
          <p className="page-hero-subtitle">Moments from campus life, classrooms, laboratories, sports tournaments, and annual celebrations.</p>
        </div>
      </div>

      <section className="section section-cream">
        <div className="container">
          <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 44 }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => { setActive(c); setLightboxIndex(null); }}
                className={`btn btn-sm ${active === c ? 'btn-navy' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {c} {c === 'All' ? `(${galleryData.length})` : `(${galleryData.filter(g => g.category === c).length})`}
              </button>
            ))}
          </div>

          <div className="mosaic-grid">
            {filtered.map((img, i) => (
              <div
                key={img.id}
                className={`mosaic-item reveal ${i % 5 === 0 ? 'large' : ''}`}
                onClick={() => setLightboxIndex(i)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <img src={img.image} alt={img.title} />
                <div className="mosaic-overlay">
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-light)', textTransform: 'uppercase', fontWeight: 800 }}>{img.category}</span>
                  <strong style={{ fontSize: '1.05rem', color: 'white', marginTop: 4 }}>{img.title}</strong>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: 4 }}>Click to view full image</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Lightbox Viewer */}
      {currentPhoto && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 31, 58, 0.96)',
            zIndex: 99999, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: 24
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative', maxWidth: 900, width: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}
          >
            {/* Top Toolbar */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff', marginBottom: 14 }}>
              <div>
                <span style={{ color: 'var(--gold-light)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                  {currentPhoto.category}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginLeft: 12 }}>
                  Photo {lightboxIndex! + 1} of {filtered.length}
                </span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', width: 36, height: 36, borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ×
              </button>
            </div>

            {/* Photo with Prev/Next Nav */}
            <div style={{ position: 'relative', width: '100%', maxHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button
                onClick={e => { e.stopPropagation(); prevPhoto(); }}
                style={{
                  position: 'absolute', left: 16, width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(15, 31, 58, 0.8)', color: '#ffffff', fontSize: '1.5rem',
                  cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', zIndex: 10
                }}
                title="Previous (Left Arrow)"
              >
                ‹
              </button>

              <img
                src={currentPhoto.image}
                alt={currentPhoto.title}
                style={{ maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
              />

              <button
                onClick={e => { e.stopPropagation(); nextPhoto(); }}
                style={{
                  position: 'absolute', right: 16, width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(15, 31, 58, 0.8)', color: '#ffffff', fontSize: '1.5rem',
                  cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', zIndex: 10
                }}
                title="Next (Right Arrow)"
              >
                ›
              </button>
            </div>

            {/* Caption */}
            <div style={{ width: '100%', textAlign: 'center', marginTop: 14, color: '#ffffff' }}>
              <h3 style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0 }}>{currentPhoto.title}</h3>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Use Left/Right arrow keys to navigate · Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
