import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ZoomIn } from 'lucide-react';
import { galleryData } from '../services/mockData';

const tabs = ['All', 'Campus', 'Facilities', 'Sports', 'Events'];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('All');
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  const filtered = activeTab === 'All'
    ? galleryData
    : galleryData.filter(g => g.category === activeTab);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-content">
          <nav className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Gallery</span>
          </nav>
          <h1 className="page-hero-title">Photo Gallery</h1>
          <p className="page-hero-subtitle">A glimpse into life at Global Academy — campus, events, sports, and more.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Tabs */}
          <div className="gallery-tabs">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`gallery-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="gallery-masonry">
            {filtered.map(item => (
              <div
                key={item.id}
                className="gallery-masonry-item"
                onClick={() => setLightbox({ src: item.image, title: item.title })}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="gallery-overlay">
                  <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <ZoomIn size={28} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.title}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.75 }}>{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🖼️</div>
              <h3 className="empty-state-title">No photos in this category</h3>
            </div>
          )}
        </div>
      </section>

      {/* Video Section */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Virtual Tour</div>
            <h2 className="section-title">Experience Global Academy</h2>
            <p className="section-subtitle">Take a virtual tour of our beautiful campus and facilities.</p>
          </div>
          <div style={{
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative',
            background: 'var(--primary)', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <img src="/images/campus-aerial.jpg" alt="Campus Tour" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: 40 }}>
              <div style={{
                width: 80, height: 80, background: 'var(--accent)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', fontSize: '2rem', cursor: 'pointer',
                boxShadow: '0 0 0 16px rgba(212,160,23,0.2)'
              }}>
                ▶
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Watch Our Campus Tour Video</h3>
              <p style={{ fontSize: '1rem', opacity: 0.8 }}>3:45 min | See our facilities, classrooms, and student life</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Albums */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Albums</div>
            <h2 className="section-title">Photo Albums</h2>
          </div>
          <div className="grid-4">
            {[
              { name: 'Annual Day 2024', count: 124, thumb: '/images/campus-aerial.jpg' },
              { name: 'Sports Day 2024', count: 89, thumb: '/images/sports.jpg' },
              { name: 'Science Exhibition', count: 67, thumb: '/images/science-lab.jpg' },
              { name: 'Graduation 2024', count: 156, thumb: '/images/classroom.jpg' },
            ].map((album, i) => (
              <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer', position: 'relative', transition: 'var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <img src={album.thumb} alt={album.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} loading="lazy" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(22,58,112,0.9) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'white', marginBottom: 2 }}>{album.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>{album.count} photos</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <X size={20} />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.title}
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
