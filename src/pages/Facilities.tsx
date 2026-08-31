import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { facilitiesData } from '../data/schoolData';

const facilityFeatures = [
  { number: '01', title: '24/7 CCTV & Security', desc: 'Comprehensive surveillance throughout campus corridors, playgrounds, and gates.' },
  { number: '02', title: 'GPS Bus Tracking', desc: 'Fleet of school buses covering all major Lalitpur and Kathmandu routes with GPS tracking.' },
  { number: '03', title: 'Hygienic Canteen', desc: 'Nutritious meals and snacks prepared fresh daily under strict sanitary guidelines.' },
  { number: '04', title: 'First-Aid Infirmary', desc: 'Trained medical personnel and emergency first-aid station on-site at all hours.' },
];

export default function Facilities() {
  useReveal();
  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Facilities</span></nav>
          <h1 className="page-hero-title">World-Class Facilities</h1>
          <p className="page-hero-subtitle">Modern learning environments and infrastructure designed to support academics, athletics, and student wellbeing.</p>
        </div>
      </div>

      {/* Main Facilities Grid */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Campus Infrastructure</span>
            <h2 className="section-title">Built for Modern Education</h2>
            <p className="section-subtitle">Take a closer look at the specialized spaces and equipment provided for our students.</p>
          </div>

          <div className="news-grid">
            {facilitiesData.map((f, i) => (
              <div key={f.id} className="card reveal" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', transitionDelay: `${i * 80}ms` }}>
                <div style={{ position: 'relative', height: 230, overflow: 'hidden' }}>
                  <img
                    src={f.image}
                    alt={f.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="facility-img"
                  />
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                    background: 'rgba(15,31,58,0.85)', backdropFilter: 'blur(6px)',
                    color: 'var(--gold-light)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5
                  }}>
                    Facility 0{i + 1}
                  </div>
                </div>
                <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--navy)' }}>{f.title}</h3>
                  <p style={{ color: 'var(--gray-500)', lineHeight: 1.65, fontSize: '0.92rem', marginBottom: 20 }}>{f.desc}</p>
                  <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>Available to All Grades</span>
                    <Link to="/contact" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>Book Visit →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Amenities */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Safety & Care</span>
            <h2 className="section-title">Campus Amenities & Student Welfare</h2>
          </div>

          <div className="why-grid">
            {facilityFeatures.map((feat, i) => (
              <div key={i} className="why-card reveal" style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="why-number">{feat.number}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Campus CTA */}
      <section className="cta-banner">
        <div className="cta-content">
          <span className="section-eyebrow" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Experience Campus</span>
          <h2>See Our Facilities in Person</h2>
          <p>Book a private or group campus tour to explore our classrooms, laboratories, and sports grounds.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-gold btn-lg">Schedule a Campus Tour</Link>
            <Link to="/gallery" className="btn btn-outline-white btn-lg">View Photo Gallery</Link>
          </div>
        </div>
      </section>
    </>
  );
}
