import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

const downloads = [
  { id: 1, title: 'Academic Calendar 2025–26', category: 'Calendar', desc: 'Complete school calendar covering examinations, holidays, sports events, and parent-teacher meetings.', type: 'PDF', size: '2.4 MB', updated: 'Jan 2025', downloads: 1420 },
  { id: 2, title: 'Admission Application Form 2025–26', category: 'Admissions', desc: 'Standard printed application form for Pre-Primary to Grade 12 admission seekers.', type: 'PDF', size: '1.1 MB', updated: 'Jan 2025', downloads: 2890 },
  { id: 3, title: 'Complete Fee Structure & Guidelines', category: 'Admissions', desc: 'Detailed grade-wise fee schedule, installment payment policies, and scholarship eligibility criteria.', type: 'PDF', size: '850 KB', updated: 'Dec 2024', downloads: 1980 },
  { id: 4, title: 'School Prospectus & Information Brochure', category: 'General', desc: 'Comprehensive guide to programs, faculty, campus infrastructure, and educational philosophy.', type: 'PDF', size: '6.8 MB', updated: 'Jan 2025', downloads: 3450 },
  { id: 5, title: 'Uniform & Dress Code Policy', category: 'General', desc: 'Specifications on seasonal school uniforms, sports kits, badges, and approved vendor list.', type: 'PDF', size: '920 KB', updated: 'Nov 2024', downloads: 860 },
  { id: 6, title: 'School Bus Transportation Routes & Timings', category: 'Transport', desc: 'Detailed pickup and drop-off timetable across Kathmandu and Lalitpur zones with driver contacts.', type: 'PDF', size: '1.5 MB', updated: 'Jan 2025', downloads: 1120 },
  { id: 7, title: 'Grade 9 & 10 SEE Syllabus Breakdown', category: 'Academics', desc: 'NEB curriculum syllabus, question pattern, and reference book list for secondary students.', type: 'PDF', size: '3.2 MB', updated: 'Dec 2024', downloads: 1750 },
  { id: 8, title: 'Leave Application & Medical Certificate Form', category: 'General', desc: 'Official template for requesting student leave and medical absence verification.', type: 'PDF', size: '420 KB', updated: 'Oct 2024', downloads: 640 },
];

const categories = ['All', 'Admissions', 'Academics', 'Calendar', 'Transport', 'General'];

export default function Downloads() {
  useReveal();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [downloadedId, setDownloadedId] = useState<number | null>(null);

  const filtered = downloads.filter(d => {
    const matchCat = category === 'All' || d.category === category;
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (id: number) => {
    setDownloadedId(id);
    setTimeout(() => {
      setDownloadedId(null);
    }, 2200);
  };

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Downloads</span></nav>
          <h1 className="page-hero-title">Downloads & Resources</h1>
          <p className="page-hero-subtitle">Access important school forms, admission packages, curriculum outlines, and official guidelines.</p>
        </div>
      </div>

      <section className="section section-cream">
        <div className="container">
          {/* Search & Category Filter Bar */}
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`btn btn-sm ${category === c ? 'btn-navy' : 'btn-outline'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {c}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ width: 240, padding: '10px 18px', borderRadius: 'var(--radius-full)' }}
            />
          </div>

          <div className="news-grid">
            {filtered.map((item, i) => (
              <div key={item.id} className="card reveal" style={{ padding: 28, display: 'flex', flexDirection: 'column', transitionDelay: `${i * 70}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: 'var(--navy)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.85rem'
                  }}>
                    {item.type}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gold)', background: 'var(--gold-pale)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                    {item.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: 8, color: 'var(--navy)' }}>{item.title}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.92rem', lineHeight: 1.65, flex: 1, marginBottom: 20 }}>{item.desc}</p>

                <div style={{ paddingTop: 14, borderTop: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 18 }}>
                  <span>{item.size}</span>
                  <span>Updated {item.updated}</span>
                  <span>{item.downloads} downloads</span>
                </div>

                <button
                  onClick={() => handleDownload(item.id)}
                  className="btn btn-navy btn-sm"
                  style={{ width: '100%' }}
                >
                  {downloadedId === item.id ? 'Downloading File...' : 'Download Document'}
                </button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card reveal" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-500)' }}>
              <p style={{ fontSize: '1.2rem' }}>No downloads found matching "{search}".</p>
            </div>
          )}
        </div>
      </section>

      {/* Need Help Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <span className="section-eyebrow" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Document Assistance</span>
          <h2>Cannot Find the Document You Need?</h2>
          <p>Contact our administrative front desk and we’ll provide the required forms directly.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-gold btn-lg">Contact Administration</Link>
          </div>
        </div>
      </section>
    </>
  );
}
