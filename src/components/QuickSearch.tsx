import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { noticesData, newsData, eventsData } from '../data/schoolData';

interface SearchResult {
  title: string;
  path: string;
  category: string;
  desc?: string;
}

const staticPages: SearchResult[] = [
  { title: 'Academic Programs & Curriculum', path: '/academics', category: 'Page', desc: 'Pre-Primary to Grade 12 Science & Management' },
  { title: 'Admissions & Fee Structure', path: '/admissions', category: 'Page', desc: 'Admission process, fees, and requirements' },
  { title: 'Interactive Fee Estimator Calculator', path: '/admissions#calculator', category: 'Tool', desc: 'Calculate monthly and annual fees' },
  { title: 'Official Notice Board', path: '/notices', category: 'Page', desc: 'Official circulars, exam dates, and holidays' },
  { title: 'Campus Facilities & Labs', path: '/facilities', category: 'Page', desc: 'Science labs, computer labs, library, and sports' },
  { title: 'Student Achievements & Honors', path: '/achievements', category: 'Page', desc: 'SEE board toppers, medals, and trophies' },
  { title: 'What Parents & Alumni Say', path: '/testimonials', category: 'Page', desc: 'Community testimonials and reviews' },
  { title: 'Downloads & Forms', path: '/downloads', category: 'Page', desc: 'Admission forms, calendar, syllabus PDFs' },
  { title: 'Campus Photo Gallery', path: '/gallery', category: 'Page', desc: 'Photos of classrooms, events, and campus' },
  { title: 'Contact School & Google Map', path: '/contact', category: 'Page', desc: 'Location, office hours, and phone numbers' },
];

export default function QuickSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  // Combine static pages + dynamic notices + dynamic events + dynamic news
  const dynamicResults: SearchResult[] = [
    ...staticPages,
    ...noticesData.map(n => ({ title: n.title, path: '/notices', category: 'Notice', desc: n.content })),
    ...newsData.map(n => ({ title: n.title, path: `/news/${n.id}`, category: 'News', desc: n.excerpt })),
    ...eventsData.map(e => ({ title: e.title, path: '/events', category: 'Event', desc: `${e.date} · ${e.location}` })),
  ];

  const results = dynamicResults.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.category.toLowerCase().includes(q) ||
    (r.desc && r.desc.toLowerCase().includes(q))
  ).slice(0, 8);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 31, 58, 0.8)',
        backdropFilter: 'blur(6px)', zIndex: 99999, display: 'flex',
        alignItems: 'flex-start', justifyContent: 'center', padding: '90px 20px'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff', width: '100%', maxWidth: 620,
          borderRadius: 16, boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden', border: '1px solid rgba(200,159,69,0.3)',
          animation: 'fadeInUp 0.25s ease'
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search pages, teachers, notices, events, downloads..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1.05rem', color: 'var(--navy)' }}
          />
          <button onClick={onClose} style={{ border: 'none', fontSize: '0.85rem', cursor: 'pointer', color: '#64748b', padding: '4px 8px', borderRadius: 4, background: '#f1f5f9' }}>
            Esc
          </button>
        </div>

        <div style={{ maxHeight: 400, overflowY: 'auto', padding: '10px' }}>
          {results.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item.path)}
              style={{
                padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)' }}>{item.title}</div>
                {item.desc && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2, maxLines: 1 }}>{item.desc.slice(0, 75)}...</div>}
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--navy)', background: 'var(--gold-pale)', padding: '3px 10px', borderRadius: 999, flexShrink: 0, marginLeft: 10 }}>
                {item.category}
              </span>
            </div>
          ))}

          {results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              No matches found for "{query}". Try "faculty", "fees", "sports", or "notice".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
