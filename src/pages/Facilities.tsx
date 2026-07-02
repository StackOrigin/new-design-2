import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="fade-in-section">{children}</div>;
}

const detailedFacilities = [
  {
    title: "Modern Library",
    image: "/images/library.jpg",
    icon: "📚",
    desc: "Our library is the intellectual heart of Global Academy. With over 15,000 books, periodicals, and digital resources, students have access to a wealth of knowledge.",
    features: ["15,000+ books and resources", "Digital library terminals", "Quiet study zones", "Group discussion areas", "Librarian assistance", "Online catalog system"],
    hours: "Sun–Fri: 8:00 AM – 5:00 PM"
  },
  {
    title: "Computer Laboratory",
    image: "/images/computer-lab.jpg",
    icon: "💻",
    desc: "Our state-of-the-art computer lab with 60 high-performance workstations and high-speed fiber internet prepares students for the digital age.",
    features: ["60 modern workstations", "High-speed fiber internet", "Latest educational software", "Coding & programming tools", "Digital content creation", "Cybersecurity education"],
    hours: "Sun–Fri: 7:30 AM – 5:30 PM"
  },
  {
    title: "Science Laboratories",
    image: "/images/science-lab.jpg",
    icon: "🔬",
    desc: "Three fully equipped laboratories — Physics, Chemistry, and Biology — where students conduct experiments that bring textbook concepts to life.",
    features: ["Separate Physics, Chemistry & Biology labs", "Modern lab equipment", "Safety equipment provided", "Trained lab assistants", "Student-to-equipment ratio: 2:1", "Regular lab sessions"],
    hours: "During class hours"
  },
  {
    title: "Sports Facilities",
    image: "/images/sports.jpg",
    icon: "⚽",
    desc: "Our extensive sports facilities support physical development and teamwork. We believe sports are essential for building character and discipline.",
    features: ["Full-size football ground", "Basketball courts (2)", "Cricket pitch", "200m athletics track", "Indoor badminton courts", "Volleyball court"],
    hours: "Sun–Fri: 6:00 AM – 6:00 PM"
  },
  {
    title: "Smart Classrooms",
    image: "/images/classroom.jpg",
    icon: "🏫",
    desc: "All classrooms are equipped with interactive smart boards, projectors, and multimedia tools to make learning engaging and effective.",
    features: ["Interactive smart boards", "HD projectors", "Air-conditioned (Grades 9-12)", "Ergonomic furniture", "Adequate natural lighting", "Sound system"],
    hours: "During school hours"
  },
  {
    title: "School Campus",
    image: "/images/campus-aerial.jpg",
    icon: "🌿",
    desc: "Our beautiful campus provides ample space for learning, exploration, and recreation in a safe environment.",
    features: ["8-acre secure campus", "CCTV surveillance", "Landscaped gardens", "Covered outdoor areas", "Cafeteria & canteen", "Medical room"],
    hours: "Sun–Fri: 6:00 AM – 7:00 PM"
  },
];

export default function Facilities() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-content">
          <nav className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Facilities</span>
          </nav>
          <h1 className="page-hero-title">World-Class Facilities</h1>
          <p className="page-hero-subtitle">
            Modern infrastructure and resources designed for holistic student development.
          </p>
        </div>
      </div>

      {/* Facilities Overview Stats */}
      <div style={{ background: 'var(--surface)', padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid-4">
            {[
              { number: '8', unit: 'Acres', label: 'Campus Area' },
              { number: '60', unit: '+', label: 'Computer Workstations' },
              { number: '15k', unit: '+', label: 'Library Books' },
              { number: '3', unit: '', label: 'Science Labs' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                  {stat.number}<span style={{ color: 'var(--accent)' }}>{stat.unit}</span>
                </div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 6 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Facilities */}
      {detailedFacilities.map((facility, i) => (
        <FadeInSection key={i}>
          <section className="section" style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--surface)' }}>
            <div className="container">
              <div className="grid-2" style={{ gap: 64, alignItems: 'center', direction: i % 2 !== 0 ? 'rtl' : 'ltr' }}>
                <div style={{ direction: 'ltr' }}>
                  <div className="section-tag" style={{ justifyContent: 'flex-start' }}>{facility.icon} Facility</div>
                  <h2 className="section-title">{facility.title}</h2>
                  <p style={{ marginBottom: 28, lineHeight: 1.8, color: 'var(--text-secondary)' }}>{facility.desc}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 24 }}>
                    {facility.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 6, height: 6, background: 'var(--success)', borderRadius: '50%', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(22,58,112,0.06)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--text-secondary)', width: 'fit-content' }}>
                    🕐 <strong style={{ color: 'var(--primary)' }}>Hours:</strong> {facility.hours}
                  </div>
                </div>
                <div style={{ direction: 'ltr' }}>
                  <img
                    src={facility.image}
                    alt={facility.title}
                    style={{ width: '100%', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>
      ))}

      {/* Additional Facilities */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">More Facilities</div>
              <h2 className="section-title">Additional Services & Amenities</h2>
            </div>
            <div className="grid-4">
              {[
                { icon: '🚌', title: 'Transportation', desc: 'Safe school bus service covering all major routes in Kathmandu Valley.' },
                { icon: '🍽️', title: 'Cafeteria', desc: 'Hygienic school cafeteria serving nutritious, freshly prepared meals daily.' },
                { icon: '🏥', title: 'Medical Room', desc: 'First aid facility with trained nurse available throughout school hours.' },
                { icon: '🛡️', title: 'Security', desc: '24/7 CCTV surveillance and professional security staff for student safety.' },
                { icon: '💬', title: 'Counseling', desc: 'Professional counseling services for academic and personal guidance.' },
                { icon: '🎨', title: 'Art Studio', desc: 'Dedicated art room for painting, sculpture, and creative expression.' },
                { icon: '🎵', title: 'Music Room', desc: 'Well-equipped music room with instruments for vocal and instrumental training.' },
                { icon: '📡', title: 'Free WiFi', desc: 'High-speed internet available throughout the campus for educational use.' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px',
                  border: '1px solid var(--border)', textAlign: 'center', transition: 'var(--transition)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>{item.title}</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 className="cta-title">Experience Our Campus Firsthand</h2>
          <p className="cta-subtitle">Schedule a campus tour and see our world-class facilities for yourself.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-accent btn-lg">
              Schedule Campus Tour <ArrowRight size={18} />
            </Link>
            <Link to="/admissions" className="btn btn-outline-white btn-lg">Apply Now</Link>
          </div>
        </div>
      </section>
    </>
  );
}
