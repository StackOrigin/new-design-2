import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { newsData } from '../data/schoolData';

const categories = ['All', 'Academic Achievement', 'Events', 'Infrastructure', 'Sports', 'Admissions'];

export default function News() {
  useReveal();
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const featured = newsData.find(n => n.featured) || newsData[0];

  const filtered = newsData.filter(n => {
    const matchesCategory = category === 'All' || n.category === category;
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>News</span></nav>
          <h1 className="page-hero-title">News & Updates</h1>
          <p className="page-hero-subtitle">Stay connected with stories, achievements, milestones, and announcements from Global Academy.</p>
        </div>
      </div>

      <section className="section section-cream">
        <div className="container">
          {/* Featured Article Card */}
          {category === 'All' && !searchTerm && featured && (
            <div className="card reveal" style={{ marginBottom: 48, overflow: 'hidden', padding: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', alignItems: 'center' }}>
                <div style={{ height: '100%', minHeight: 340 }}>
                  <img src={featured.image} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 40 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ background: 'var(--gold)', color: 'var(--navy)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>⭐ Featured</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h2 style={{ fontSize: '1.6rem', marginBottom: 14, color: 'var(--navy)', lineHeight: 1.3 }}>{featured.title}</h2>
                  <p style={{ color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 24, fontSize: '0.95rem' }}>{featured.excerpt}</p>
                  <Link to={`/news/${featured.id}`} className="btn btn-navy">Read Full Story →</Link>
                </div>
              </div>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(c => {
                const count = c === 'All' ? newsData.length : newsData.filter(n => n.category === c).length;
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`btn btn-sm ${category === c ? 'btn-navy' : 'btn-outline'}`}
                    style={{ borderRadius: 'var(--radius-full)' }}
                  >
                    {c} <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({count})</span>
                  </button>
                );
              })}
            </div>
            <div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ padding: '10px 18px', width: 240, borderRadius: 'var(--radius-full)' }}
              />
            </div>
          </div>

          {/* News Grid */}
          <div className="news-grid">
            {filtered.map((news, i) => (
              <article key={news.id} className="news-card reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <img src={news.image} alt={news.title} className="news-card-img" />
                <div className="news-card-body">
                  <div className="news-card-meta">
                    <span className="news-category">{news.category}</span>
                    <span className="news-date">{new Date(news.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3>{news.title}</h3>
                  <p>{news.excerpt}</p>
                  <Link to={`/news/${news.id}`} className="news-link">Read Full Story →</Link>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card reveal" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-500)' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: 12 }}>No articles found matching your criteria.</p>
              <button onClick={() => { setCategory('All'); setSearchTerm(''); }} className="btn btn-navy btn-sm">Clear Filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
