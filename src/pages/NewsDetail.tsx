import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { newsData } from '../services/mockData';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const news = newsData.find(n => n.id === Number(id));
  const related = newsData.filter(n => n.id !== Number(id)).slice(0, 3);

  if (!news) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: '4rem' }}>📰</div>
        <h2 style={{ color: 'var(--primary)' }}>News article not found</h2>
        <Link to="/news" className="btn btn-primary">Back to News</Link>
      </div>
    );
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div className="page-hero" style={{ paddingBottom: 0, minHeight: 'auto' }}>
        <div className="page-hero-content">
          <nav className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/news" className="breadcrumb-item">News & Events</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{news.category}</span>
          </nav>
          <div className="news-card-category" style={{ display: 'inline-flex', marginBottom: 16 }}>
            <Tag size={12} /> {news.category}
          </div>
          <h1 className="page-hero-title" style={{ maxWidth: 800 }}>{news.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            <Calendar size={14} />
            {formatDate(news.date)}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }}>
            {/* Main Content */}
            <div>
              <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: 32 }}>
                <ArrowLeft size={16} /> Back
              </button>

              <img
                src={news.image}
                alt={news.title}
                style={{ width: '100%', borderRadius: 'var(--radius-xl)', marginBottom: 40, maxHeight: 480, objectFit: 'cover', boxShadow: 'var(--shadow-lg)' }}
              />

              <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '48px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.8, marginBottom: 28, borderLeft: '4px solid var(--accent)', paddingLeft: 20, fontStyle: 'italic' }}>
                  {news.excerpt}
                </p>
                <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
                  {news.content.split('\n').map((paragraph, i) => {
                    if (paragraph.startsWith('•')) {
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                          <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', display: 'block', flexShrink: 0, marginTop: 12 }} />
                          <span>{paragraph.slice(2)}</span>
                        </div>
                      );
                    }
                    if (paragraph.trim() === '') return <div key={i} style={{ height: 8 }} />;
                    return <p key={i} style={{ marginBottom: 16 }}>{paragraph}</p>;
                  })}
                </div>

                <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700 }}>
                      SA
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>Global Academy Secondary School</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Published: {formatDate(news.date)}</div>
                    </div>
                  </div>
                  <Link to="/news" className="btn btn-outline btn-sm">
                    View All News <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Related News */}
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border)', marginBottom: 24 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid var(--accent)', display: 'inline-block' }}>
                  Related News
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {related.map(r => (
                    <Link key={r.id} to={`/news/${r.id}`} style={{ display: 'flex', gap: 12, textDecoration: 'none', transition: 'var(--transition)' }}>
                      <img src={r.image} alt={r.title} style={{ width: 72, height: 72, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 4 }}>{r.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(r.date)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div style={{ background: 'var(--primary)', borderRadius: 'var(--radius-lg)', padding: '24px', color: 'white' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: 16 }}>Quick Links</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Apply for Admission', path: '/admissions' },
                    { label: 'Download Prospectus', path: '/admissions' },
                    { label: 'Academic Calendar', path: '/academics' },
                    { label: 'Contact Us', path: '/contact' },
                  ].map((link, i) => (
                    <Link key={i} to={link.path} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8, transition: 'var(--transition)' }}>
                      <ArrowRight size={14} color="var(--accent)" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
