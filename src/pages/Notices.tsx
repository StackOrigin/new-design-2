import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { noticesData } from '../data/schoolData';

const categories = ['All', 'Academic', 'Admissions', 'Event', 'Exam', 'Holiday', 'General'];

const categoryColors: Record<string, string> = {
  Academic: '#1a3363',
  Admissions: '#059669',
  Event: '#c89f45',
  Exam: '#dc2626',
  Holiday: '#7c3aed',
  General: '#64748b',
};

export default function Notices() {
  useReveal();
  const [category, setCategory] = useState('All');

  const sorted = [...noticesData].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filtered = category === 'All' ? sorted : sorted.filter(n => n.category === category);

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Notice Board</span></nav>
          <h1 className="page-hero-title">Notice Board</h1>
          <p className="page-hero-subtitle">Official announcements, schedules, and important updates from the school administration.</p>
        </div>
      </div>

      <section className="section section-cream">
        <div className="container">
          <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 44 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`btn btn-sm ${category === c ? 'btn-navy' : 'btn-outline'}`}>{c}</button>
            ))}
          </div>

          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((notice, i) => (
              <div
                key={notice.id}
                className="card reveal notice-card"
                style={{ padding: 0, overflow: 'hidden', transitionDelay: `${i * 60}ms` }}
              >
                <div className="notice-card-inner">
                  {/* Date badge */}
                  <div className="notice-date-badge">
                    <span className="notice-date-day">{new Date(notice.date).getDate()}</span>
                    <span className="notice-date-month">{new Date(notice.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="notice-date-year">{new Date(notice.date).getFullYear()}</span>
                  </div>

                  {/* Content */}
                  <div className="notice-content">
                    <div className="notice-header">
                      {notice.pinned && (
                        <span className="notice-pin-badge">Pinned Notice</span>
                      )}
                      <span
                        className="notice-category-badge"
                        style={{ background: `${categoryColors[notice.category] || '#64748b'}15`, color: categoryColors[notice.category] || '#64748b' }}
                      >
                        {notice.category}
                      </span>
                    </div>
                    <h3 className="notice-title">{notice.title}</h3>
                    <p className="notice-text">{notice.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="reveal" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-500)' }}>
              <p style={{ fontSize: '1.1rem' }}>No notices found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
