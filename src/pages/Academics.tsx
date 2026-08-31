import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { programsData } from '../data/schoolData';

const methodology = [
  { number: '01', title: 'Conceptual Learning', desc: 'Emphasis on understanding the "why" and "how" behind concepts rather than rote memorization.' },
  { number: '02', title: 'Practical Lab Experience', desc: 'Weekly sessions in physics, chemistry, biology, and computer labs starting from primary grades.' },
  { number: '03', title: 'Interactive Pedagogy', desc: 'Group discussions, multimedia presentations, debates, and peer-to-peer collaboration.' },
  { number: '04', title: 'Continuous Assessment', desc: 'Regular formative tests, term evaluations, unit tests, and personalized feedback loops for parents.' },
];

const subjectDetailsMap: Record<string, { desc: string; practicals: string; careers: string }> = {
  'English': { desc: 'Literature analysis, grammar mastery, rhetoric, and creative writing composition.', practicals: 'Debates, Model UN & poetry recitals', careers: 'Law, Journalism, Diplomacy & Media' },
  'Nepali': { desc: 'Nepali linguistics, classical and modern literature, and formal essay composition.', practicals: 'Public oratory, creative writing & drama', careers: 'Civil Services, Publishing & Academics' },
  'Mathematics': { desc: 'Algebra, geometry, trigonometry, arithmetic mastery, and logical problem solving.', practicals: 'Math lab geometry modeling & puzzles', careers: 'Engineering, Data Science & Economics' },
  'Science': { desc: 'Foundational concepts across physics, chemistry, biology, and environment.', practicals: 'Hands-on lab experiments & models', careers: 'Medicine, Biotechnology & Pure Sciences' },
  'Social Studies': { desc: 'Nepali geography, world history, civic responsibilities, and cultural heritage.', practicals: 'Field trips & community survey projects', careers: 'Public Policy, Sociology & Heritage' },
  'Computer Science': { desc: 'Computational thinking, programming fundamentals in Python/C, and web development.', practicals: 'Coding labs & software projects', careers: 'Software Engineering, AI & Cybersecurity' },
  'Physics': { desc: 'Mechanics, electrodynamics, optics, thermodynamics, and modern quantum concepts.', practicals: 'Weekly lab experimentation & reports', careers: 'Mechanical, Electrical & Aerospace Engg' },
  'Chemistry': { desc: 'Physical, inorganic, and organic reactions, stoichiometry, and biochemistry.', practicals: 'Titration, chemical synthesis & analysis', careers: 'Medicine, Pharmacy & Chemical Engg' },
  'Biology': { desc: 'Human anatomy, genetics, botany, microbiology, and physiological systems.', practicals: 'Microscopy, dissections & botany tours', careers: 'MBBS/MD Surgery, Genetics & Biotech' },
  'Optional Mathematics': { desc: 'Advanced coordinate geometry, matrix algebra, calculus, and vectors.', practicals: 'Analytical problem solving workshops', careers: 'Higher Engineering, Actuarial & Finance' },
  'Principles of Accounting': { desc: 'Double-entry bookkeeping, financial statements, taxation, and auditing.', practicals: 'Tally software & real balance sheets', careers: 'Chartered Accountancy (CA), Banking' },
  'Economics': { desc: 'Microeconomics, macroeconomic policies, fiscal budgets, and international trade.', practicals: 'Market survey & budget analysis', careers: 'Economic Policy, Investment Banking' },
  'Business Studies': { desc: 'Enterprise management, marketing strategies, human resources, and business ethics.', practicals: 'Startup business plan competitions', careers: 'Entrepreneurship, MBA & Consulting' },
};

export default function Academics() {
  useReveal();
  const [activeTab, setActiveTab] = useState(0);
  const [inspectedSubject, setInspectedSubject] = useState<string | null>(null);

  const program = programsData[activeTab];

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Academics</span></nav>
          <h1 className="page-hero-title">Academic Excellence</h1>
          <p className="page-hero-subtitle">Comprehensive curriculum designed to inspire curiosity, foster critical thinking, and build strong foundations.</p>
        </div>
      </div>

      {/* Academic Highlights Strip */}
      <section className="section-navy" style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="stats-strip-grid" style={{ borderTop: 'none', paddingTop: 0 }}>
            {[
              { value: '98%', label: 'SEE Board Pass Rate' },
              { value: '45+', label: 'GPA 4.0 Achievers' },
              { value: '1:20', label: 'Teacher-Student Ratio' },
              { value: '100%', label: 'Practical Lab Coverage' },
            ].map((s, i) => (
              <div key={i} className="stat-strip-item" style={{ color: 'white' }}>
                <div className="stat-strip-number" style={{ color: 'var(--gold-light)' }}>{s.value}</div>
                <div className="stat-strip-label" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Selector */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Curriculum Levels</span>
            <h2 className="section-title">Explore Academic Levels</h2>
            <p className="section-subtitle">Select a stage below to view curriculum goals, subjects, and learning methodology.</p>
          </div>

          <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 40 }}>
            {programsData.map((p, i) => (
              <button
                key={p.id}
                onClick={() => { setActiveTab(i); setInspectedSubject(null); }}
                className={`btn ${activeTab === i ? 'btn-navy' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {p.level}
              </button>
            ))}
          </div>

          <div className="card reveal" style={{ padding: 44, maxWidth: 960, margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, borderBottom: '1px solid var(--gray-100)', paddingBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--gold-pale)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800 }}>
                {program.index || `0${activeTab + 1}`}
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--gold)' }}>{program.grade}</span>
                <h2 style={{ fontSize: '1.9rem', margin: '4px 0 0', color: 'var(--navy)' }}>{program.level}</h2>
              </div>
            </div>
            <p style={{ color: 'var(--gray-700)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 30 }}>{program.desc}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)', margin: 0 }}>Core Curriculum & Subjects</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Select any subject below for details</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
              {program.subjects.map((s: string) => {
                const isSelected = inspectedSubject === s;
                return (
                  <div
                    key={s}
                    onClick={() => setInspectedSubject(isSelected ? null : s)}
                    style={{
                      background: isSelected ? 'var(--navy)' : 'var(--cream)',
                      color: isSelected ? '#ffffff' : 'var(--navy)',
                      padding: '12px 18px', borderRadius: 'var(--radius-md)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      border: isSelected ? '1px solid var(--navy)' : '1px solid rgba(15,31,58,0.08)',
                      cursor: 'pointer', transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{s}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{isSelected ? '▲' : '▼'}</span>
                  </div>
                );
              })}
            </div>

            {/* Interactive Subject Details Box */}
            {inspectedSubject && subjectDetailsMap[inspectedSubject] && (
              <div style={{ background: 'var(--gold-pale)', border: '1px solid var(--gold)', padding: 24, borderRadius: 'var(--radius-md)', marginBottom: 30, animation: 'fadeInUp 0.25s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: 'var(--navy)', margin: 0, fontSize: '1.1rem' }}>Subject Details: {inspectedSubject}</h4>
                  <button onClick={() => setInspectedSubject(null)} style={{ color: 'var(--navy)', fontWeight: 700 }}>×</button>
                </div>
                <p style={{ color: 'var(--navy)', fontSize: '0.92rem', lineHeight: 1.6, margin: '6px 0 12px' }}>
                  {subjectDetailsMap[inspectedSubject].desc}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: '0.85rem' }}>
                  <div><strong>Practicals & Lab:</strong> {subjectDetailsMap[inspectedSubject].practicals}</div>
                  <div><strong>Career Pathways:</strong> {subjectDetailsMap[inspectedSubject].careers}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', borderTop: '1px solid var(--gray-100)', paddingTop: 24 }}>
              <Link to="/admissions" className="btn btn-gold">Apply for {program.level}</Link>
              <Link to="/admissions#calculator" className="btn btn-outline">Estimate Tuition Fees</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Our Approach</span>
            <h2 className="section-title">Teaching Methodology</h2>
            <p className="section-subtitle">How we transform traditional textbook education into an engaging learning adventure.</p>
          </div>

          <div className="why-grid">
            {methodology.map((m, i) => (
              <div key={i} className="why-card reveal" style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="why-number">{m.number}</div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Calendar CTA */}
      <section className="cta-banner">
        <div className="cta-content">
          <span className="section-eyebrow" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Academic Year 2025–26</span>
          <h2>Plan Ahead with Our Academic Calendar</h2>
          <p>Check key examination dates, parent-teacher conferences, national holidays, and sports schedules.</p>
          <div className="cta-actions">
            <Link to="/events" className="btn btn-gold btn-lg">View Events Calendar</Link>
            <Link to="/downloads" className="btn btn-outline-white btn-lg">Download Full Calendar (PDF)</Link>
          </div>
        </div>
      </section>
    </>
  );
}
