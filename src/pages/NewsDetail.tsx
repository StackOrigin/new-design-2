import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { newsData } from '../data/schoolData';

export default function NewsDetail() {
  useReveal();
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const news = newsData.find(n => n.id === Number(id));
  const related = newsData.filter(n => n.id !== Number(id)).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!news) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ color: 'var(--navy)' }}>News article not found</h2>
        <Link to="/news" className="btn btn-navy">Back to News</Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-hero" style={{ paddingBottom: 60 }}>
        <div className="container page-hero-content">
          <nav className="breadcrumb">
            <Link to="/">Home</Link><span>/</span>
            <Link to="/news">News</Link><span>/</span>
            <span>{news.category}</span>
          </nav>
          <h1 className="page-hero-title">{news.title}</h1>
        </div>
      </div>

      <section className="section section-cream">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'start' }}>
            <article className="card reveal" style={{ padding: 40 }}>
              <img
                src={news.image}
                alt={news.title}
                style={{ width: '100%', height: 380, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 28 }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', gap: 14, fontSize: '0.85rem', color: 'var(--gray-500)', alignItems: 'center' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', background: 'var(--gold-pale)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    {news.category}
                  </span>
                  <span>{new Date(news.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>By {news.author || 'School Administration'}</span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleShare} className="btn btn-outline btn-sm" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    {copied ? 'Copied Link' : 'Share Article'}
                  </button>
                </div>
              </div>

              <div style={{ color: 'var(--charcoal)', lineHeight: 1.9, fontSize: '1.02rem', whiteSpace: 'pre-line' }}>
                {news.content}
              </div>

              {/* Author Footer */}
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 16, background: 'var(--cream)', padding: 20, borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--navy)', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  GA
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--navy)' }}>Global Academy Media & Communications</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--gray-500)' }}>Official publications and announcements division.</p>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 18, color: 'var(--navy)' }}>Related News</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {related.map(n => (
                    <div
                      key={n.id}
                      style={{ padding: 14, borderRadius: 'var(--radius-sm)', background: 'var(--cream)', cursor: 'pointer', transition: 'var(--transition)' }}
                      onClick={() => navigate(`/news/${n.id}`)}
                    >
                      <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>{n.category}</span>
                      <h4 style={{ fontSize: '0.95rem', margin: '4px 0 6px', color: 'var(--navy)' }}>{n.title}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links Banner */}
              <div className="card" style={{ padding: 24, background: 'var(--navy)', color: 'white' }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: 10 }}>Looking to Enroll?</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: 18, lineHeight: 1.6 }}>
                  Admissions for the 2025–26 academic session are currently underway.
                </p>
                <Link to="/admissions" className="btn btn-gold btn-sm" style={{ width: '100%' }}>Apply Online →</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
