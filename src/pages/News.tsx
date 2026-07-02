import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Search } from 'lucide-react';
import { newsData, eventsData } from '../services/mockData';

function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="fade-in-section">{children}</div>;
}

const categories = ['All', 'Academic Achievement', 'Events', 'Infrastructure', 'Sports', 'Admissions'];

export default function News() {
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filteredNews = newsData.filter(n => {
    const matchCat = activeCategory === 'All' || n.category === activeCategory;
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const getDay = (d: string) => new Date(d).getDate();
  const getMonth = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short' });

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-content">
          <nav className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">News & Events</span>
          </nav>
          <h1 className="page-hero-title">News & Events</h1>
          <p className="page-hero-subtitle">Stay up to date with the latest happenings at Global Academy Secondary School.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 40, borderBottom: '2px solid var(--border)', paddingBottom: 0 }}>
            {['news', 'events'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'news' | 'events')}
                style={{
                  padding: '12px 28px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  borderBottom: `3px solid ${activeTab === tab ? 'var(--primary)' : 'transparent'}`,
                  color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  marginBottom: -2,
                  transition: 'var(--transition)',
                  textTransform: 'capitalize'
                }}
              >
                {tab === 'news' ? '📰 Latest News' : '📅 Upcoming Events'}
              </button>
            ))}
          </div>

          {activeTab === 'news' ? (
            <>
              {/* Filters */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="gallery-tabs" style={{ margin: 0 }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`gallery-tab ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: 40, width: 260 }}
                  />
                </div>
              </div>

              {filteredNews.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📰</div>
                  <h3 className="empty-state-title">No news found</h3>
                  <p className="empty-state-desc">Try adjusting your search or category filter.</p>
                </div>
              ) : (
                <div className="grid-3">
                  {filteredNews.map(news => (
                    <FadeInSection key={news.id}>
                      <article className="news-card">
                        <img src={news.image} alt={news.title} className="news-card-img" loading="lazy" />
                        <div className="news-card-body">
                          <div className="news-card-category">{news.category}</div>
                          <div className="news-card-date">
                            <Calendar size={13} /> {formatDate(news.date)}
                          </div>
                          <h3 className="news-card-title">{news.title}</h3>
                          <p className="news-card-excerpt">{news.excerpt}</p>
                          <Link to={`/news/${news.id}`} className="news-card-link">
                            Read Full Story <ArrowRight size={14} />
                          </Link>
                        </div>
                      </article>
                    </FadeInSection>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Events List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {eventsData.map(event => (
                  <FadeInSection key={event.id}>
                    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '24px 28px', display: 'flex', gap: 24, alignItems: 'flex-start', transition: 'var(--transition)' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--secondary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                      <div className="event-date-box" style={{ flexShrink: 0 }}>
                        <div className="event-day">{getDay(event.date)}</div>
                        <div className="event-month">{getMonth(event.date)}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>{event.title}</h3>
                          <span className="badge badge-info">{event.category}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.65 }}>{event.description}</p>
                        <div className="event-meta">
                          <div className="event-meta-item">
                            <Clock size={13} /> {event.time}
                          </div>
                          <div className="event-meta-item">
                            <MapPin size={13} /> {event.location}
                          </div>
                          <div className="event-meta-item">
                            <Calendar size={13} /> {formatDate(event.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeInSection>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
