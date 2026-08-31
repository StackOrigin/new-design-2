import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { timelineData, leadersData } from '../data/schoolData';

const visionMission = [
  {
    numeral: 'I',
    title: 'Our Vision',
    content: 'To be the leading center of educational excellence, nurturing future leaders who are academically accomplished, morally grounded, and globally aware.',
    color: '#1a3363'
  },
  {
    numeral: 'II',
    title: 'Our Mission',
    content: 'To provide world-class education rooted in Nepali values, fostering academic rigor, character development, and lifelong learning in every student.',
    color: '#c89f45'
  },
  {
    numeral: 'III',
    title: 'Our Values',
    content: 'Integrity, Excellence, Compassion, Innovation, and Community — these are the pillars that guide every decision we make for our students.',
    color: '#059669'
  },
];

export default function About() {
  useReveal();
  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>About Us</span></nav>
          <h1 className="page-hero-title">About Global Academy</h1>
          <p className="page-hero-subtitle">30 years of nurturing excellence, character, and lifelong learners in Lalitpur, Nepal.</p>
        </div>
      </div>

      {/* School Story */}
      <section className="section section-cream">
        <div className="container">
          <div className="quote-block">
            <div className="quote-image reveal">
              <img src="/images/campus-aerial.jpg" alt="Global Academy Campus" />
            </div>
            <div className="quote-content reveal">
              <span className="section-eyebrow">Our Story</span>
              <h2 className="section-title">A Legacy of Educational Excellence</h2>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, marginBottom: 18 }}>
                Founded in 1995, Global Academy began as a small school with a big dream — to provide world-class education rooted in Nepali values. Today we are home to over 2,500 students and 85 dedicated educators.
              </p>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, marginBottom: 28 }}>
                Our modern campus features science labs, computer labs, a modern library, and extensive sports facilities. We proudly maintain a 98% SEE pass rate and thousands of successful alumni.
              </p>
              <Link to="/admissions" className="btn btn-navy">Join Our Community</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">What Drives Us</span>
            <h2 className="section-title">Vision, Mission & Values</h2>
          </div>
          <div className="programs-grid">
            {visionMission.map((item, i) => (
              <div key={item.title} className="card reveal" style={{ transitionDelay: `${i * 100}ms`, overflow: 'hidden' }}>
                <div style={{ height: 6, background: item.color }} />
                <div style={{ padding: 32, textAlign: 'center' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: `${item.color}15`,
                    color: item.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 800, margin: '0 auto 18px',
                    border: `1px solid ${item.color}30`
                  }}>
                    {item.numeral}
                  </div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: 12 }}>{item.title}</h3>
                  <p style={{ color: 'var(--gray-500)', lineHeight: 1.7 }}>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Our Journey</span>
            <h2 className="section-title">Three Decades of Growth</h2>
          </div>
          <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute', left: 44, top: 0, bottom: 0, width: 3,
              background: 'linear-gradient(to bottom, var(--gold), var(--navy))',
              borderRadius: 2
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {timelineData.map((item, i) => (
                <div key={i} className="reveal" style={{ display: 'flex', gap: 28, alignItems: 'flex-start', position: 'relative', paddingBottom: 32, transitionDelay: `${i * 80}ms` }}>
                  {/* Dot */}
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: i % 2 === 0 ? 'var(--gold)' : 'var(--navy)',
                    border: '3px solid var(--cream)',
                    flexShrink: 0, position: 'relative', zIndex: 2,
                    marginLeft: 36, marginTop: 6
                  }} />
                  {/* Content card */}
                  <div className="card" style={{ padding: 24, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                      <span style={{
                        fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700,
                        color: i % 2 === 0 ? 'var(--gold)' : 'var(--navy-light)'
                      }}>
                        {item.year}
                      </span>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: 1, color: 'var(--gold)',
                        background: 'var(--gold-pale)', padding: '3px 10px', borderRadius: 'var(--radius-full)'
                      }}>
                        {item.event}
                      </span>
                    </div>
                    <p style={{ color: 'var(--gray-500)', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Leadership</span>
            <h2 className="section-title">Meet Our Leaders</h2>
          </div>
          <div className="programs-grid">
            {leadersData.map((leader, i) => (
              <div key={i} className="card reveal" style={{ padding: 28, textAlign: 'center', transitionDelay: `${i * 80}ms` }}>
                {leader.image ? (
                  <img src={leader.image} alt={leader.name} style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 18px', border: '3px solid var(--gold)' }} />
                ) : (
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
                    margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gold-light)', fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700,
                    border: '3px solid var(--gold)'
                  }}>
                    {leader.initial}
                  </div>
                )}
                <h3 style={{ fontSize: '1.2rem' }}>{leader.name}</h3>
                <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>{leader.role}</p>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: 12 }}>{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Join the Global Academy Family</h2>
          <p>We'd love to welcome your family to our community. Schedule a campus tour today.</p>
          <div className="cta-actions">
            <Link to="/admissions" className="btn btn-gold btn-lg">Apply Now</Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">Schedule a Visit</Link>
          </div>
        </div>
      </section>
    </>
  );
}
