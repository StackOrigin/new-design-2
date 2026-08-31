import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { facultyData } from '../data/schoolData';

const departments = ['All', ...Array.from(new Set(facultyData.map(f => f.department)))];

export default function Faculty() {
  useReveal();
  const [dept, setDept] = useState('All');
  const filtered = dept === 'All' ? facultyData : facultyData.filter(f => f.department === dept);

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Faculty</span></nav>
          <h1 className="page-hero-title">Our Faculty</h1>
          <p className="page-hero-subtitle">Meet the dedicated educators who inspire, challenge, and mentor our students every day.</p>
        </div>
      </div>

      {/* Stats */}
      <section className="section-navy" style={{ padding: '50px 0' }}>
        <div className="container">
          <div className="stats-strip-grid" style={{ borderTop: 'none', paddingTop: 0 }}>
            {[
              { value: '85+', label: 'Expert Teachers' },
              { value: '12', label: 'Departments' },
              { value: '15+', label: 'Years Avg. Experience' },
              { value: '95%', label: 'With Masters Degree' },
            ].map((s, i) => (
              <div key={i} className="stat-strip-item" style={{ color: 'white' }}>
                <div className="stat-strip-number" style={{ color: 'white' }}>{s.value}</div>
                <div className="stat-strip-label" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Our Team</span>
            <h2 className="section-title">Faculty & Staff</h2>
            <p className="section-subtitle">Filter by department to find the teachers and staff who make Global Academy exceptional.</p>
          </div>

          <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 44 }}>
            {departments.map(d => (
              <button key={d} onClick={() => setDept(d)} className={`btn btn-sm ${dept === d ? 'btn-navy' : 'btn-outline'}`}>{d}</button>
            ))}
          </div>

          <div className="faculty-grid">
            {filtered.map((teacher, i) => (
              <div key={teacher.id} className="faculty-card card reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="faculty-card-avatar">
                  {teacher.image ? (
                    <img src={teacher.image} alt={teacher.name} />
                  ) : (
                    <div className="faculty-avatar-placeholder">{teacher.initial}</div>
                  )}
                </div>
                <div className="faculty-card-body">
                  <h3>{teacher.name}</h3>
                  <span className="faculty-role">{teacher.role}</span>
                  <span className="faculty-dept">{teacher.department}</span>
                  <p className="faculty-bio">{teacher.bio}</p>
                  <div className="faculty-meta">
                    <span>{teacher.qualification}</span>
                    <span>{teacher.experience}</span>
                  </div>
                  <div className="faculty-subjects">
                    {teacher.subjects.map(s => (
                      <span key={s} className="faculty-subject-tag">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="cta-content">
          <span className="section-eyebrow" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Join Our Team</span>
          <h2>Interested in Teaching at Global Academy?</h2>
          <p>We're always looking for passionate educators who want to make a difference in students' lives.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-gold btn-lg">Get in Touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}
