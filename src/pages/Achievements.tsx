import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 98, suffix: '%', label: 'SEE Board Pass Rate' },
  { value: 45, suffix: '+', label: 'Students with GPA 4.0' },
  { value: 120, suffix: '+', label: 'Secured GPA 3.6 & Above' },
  { value: 35, suffix: '+', label: 'National Trophy Wins' },
];

const achievementsList = [
  { index: '01', title: 'District Top Rank in SEE 2024', desc: 'Over 45 students achieved a perfect 4.0 GPA, positioning Global Academy as the highest-performing school in the district.', category: 'Academics' },
  { index: '02', title: 'Valley Inter-School Football Champions', desc: 'Our senior boys football team clinched 1st place in the prestigious Kathmandu Valley Interschool Championship.', category: 'Sports' },
  { index: '03', title: 'National Science Olympiad Winners', desc: 'Our student team secured 1st prize for their sustainable solar irrigation system prototype.', category: 'Innovation' },
  { index: '04', title: 'National Heritage Dance Festival', desc: 'Winner of the Best Choreography and Cultural Representation Award at the National Youth Festival.', category: 'Culture' },
  { index: '05', title: 'Inter-College Hackathon Top 3', desc: 'Grade 11 & 12 Computer Science students developed an AI-powered smart attendance and library tracking system.', category: 'Technology' },
  { index: '06', title: 'Eco-School Green Campus Certification', desc: 'Awarded gold status for zero-plastic campus initiatives, tree plantation drives, and solar power integration.', category: 'Sustainability' },
];

const toppers = [
  { name: 'Aayush Shrestha', gpa: '4.0 GPA', stream: 'SEE 2024', ambition: 'Medical Science' },
  { name: 'Pranisha Maharjan', gpa: '4.0 GPA', stream: 'SEE 2024', ambition: 'Computer Engineering' },
  { name: 'Samir Adhikari', gpa: '3.95 GPA', stream: '+2 Science', ambition: 'Civil Engineering' },
  { name: 'Anushka Karki', gpa: '3.90 GPA', stream: '+2 Management', ambition: 'Chartered Accountancy' },
];

export default function Achievements() {
  useReveal();

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Achievements</span></nav>
          <h1 className="page-hero-title">Our Achievements</h1>
          <p className="page-hero-subtitle">Celebrating the dedication, hard work, and remarkable victories of our students and faculty.</p>
        </div>
      </div>

      {/* Animated Counter Stats */}
      <section className="section-navy" style={{ padding: '50px 0' }}>
        <div className="container">
          <div className="stats-strip-grid" style={{ borderTop: 'none', paddingTop: 0 }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-strip-item" style={{ color: 'white' }}>
                <div className="stat-strip-number" style={{ color: 'var(--gold-light)' }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="stat-strip-label" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Milestones</span>
            <h2 className="section-title">Major Honors & Recognitions</h2>
            <p className="section-subtitle">A showcase of excellence spanning academics, athletics, technology, and cultural arts.</p>
          </div>

          <div className="programs-grid">
            {achievementsList.map((a, i) => (
              <div key={i} className="card reveal" style={{ padding: 32, display: 'flex', flexDirection: 'column', transitionDelay: `${i * 80}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gold-pale)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 800 }}>
                    {a.index}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--navy)', background: 'var(--cream)', padding: '4px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--gray-300)' }}>
                    {a.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 10, color: 'var(--navy)' }}>{a.title}</h3>
                <p style={{ color: 'var(--gray-500)', lineHeight: 1.65, fontSize: '0.92rem' }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Toppers Showcase */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Academic Roll of Honor</span>
            <h2 className="section-title">Our Top Performers</h2>
            <p className="section-subtitle">Congratulations to our recent board examination toppers who have set new benchmarks of excellence.</p>
          </div>

          <div className="why-grid">
            {toppers.map((t, i) => (
              <div key={i} className="card reveal" style={{ padding: 28, textAlign: 'center', transitionDelay: `${i * 80}ms`, borderTop: '4px solid var(--gold)' }}>
                <div style={{
                  width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
                  margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gold-light)', fontSize: '1.6rem', fontWeight: 700
                }}>
                  {t.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px', color: 'var(--navy)' }}>{t.name}</h3>
                <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.95rem' }}>{t.gpa}</span>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', margin: '8px 0 0' }}>{t.stream}</p>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--gray-100)', fontSize: '0.8rem', color: 'var(--navy)' }}>
                  <strong>Ambition:</strong> {t.ambition}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="cta-content">
          <span className="section-eyebrow" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Be The Next Winner</span>
          <h2>Shape Your Own Success Story</h2>
          <p>Join an environment where your passions are nurtured and your potential is unlocked.</p>
          <div className="cta-actions">
            <Link to="/admissions" className="btn btn-gold btn-lg">Apply for Admission</Link>
          </div>
        </div>
      </section>
    </>
  );
}
