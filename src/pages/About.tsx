import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { timelineData, leadersData } from '../services/mockData';

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

export default function About() {
  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-content">
          <nav className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">About Us</span>
          </nav>
          <h1 className="page-hero-title">About Global Academy</h1>
          <p className="page-hero-subtitle">
            30 years of nurturing excellence, character, and lifelong learners.
          </p>
        </div>
      </div>

      {/* About Intro */}
      <FadeInSection>
        <section className="section">
          <div className="container">
            <div className="about-intro">
              <div className="about-image-stack" style={{ position: 'relative' }}>
                <img src="/images/campus-aerial.jpg" alt="Global Academy Campus" className="about-img-main" />
                <div className="about-img-badge">
                  <div className="about-img-badge-number">30+</div>
                  <div className="about-img-badge-label">Years of Excellence</div>
                </div>
              </div>
              <img 
                src="/images/students.jpg" 
                alt="Global Academy Students" 
                style={{ 
                  width: '100%', 
                  height: 280, 
                  objectFit: 'cover', 
                  borderRadius: 'var(--radius-lg)',
                  marginTop: 16,
                  boxShadow: 'var(--shadow-md)'
                }} 
              />
              <div>
                <div className="section-tag" style={{ justifyContent: 'flex-start' }}>Our Story</div>
                <h2 className="section-title">A Legacy of Educational Excellence</h2>
                <p style={{ marginBottom: 20 }}>
                  Founded in 1995, Global Academy Secondary School began as a small school with a big dream — to provide
                  world-class education that is rooted in Nepali values. Starting with just 3 classrooms
                  and 45 students, we have grown into one of Nepal's most respected educational institutions.
                </p>
                <p style={{ marginBottom: 20 }}>
                  Today, Global Academy Secondary School is home to over 2,500 students and 85 dedicated educators.
                  Our modern campus in Lalitpur is equipped with state-of-the-art
                  facilities including science labs, computer labs, a modern library, and extensive sports facilities.
                </p>
                <p style={{ marginBottom: 32 }}>
                  We are proud of our consistent academic achievements, including a 98% SEE pass rate in 2024,
                  and our thousands of alumni who are making meaningful contributions to Nepal and the world.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>2,500+</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Students</div>
                  </div>
                  <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>85+</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Teachers</div>
                  </div>
                  <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>5,000+</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Alumni</div>
                  </div>
                  <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>98%</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Pass Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Mission, Vision, Values */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Our Foundation</div>
              <h2 className="section-title">Mission, Vision & Values</h2>
            </div>
            <div className="grid-3" style={{ marginBottom: 64 }}>
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '36px 28px', border: '1px solid var(--border)', textAlign: 'center', transition: 'var(--transition)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-lg)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: 12 }}>Our Mission</h3>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.8 }}>
                  To provide exceptional, holistic education that empowers every student to achieve
                  academic excellence, develop strong moral character, and become responsible global citizens.
                </p>
              </div>
              <div style={{ background: 'var(--primary)', borderRadius: 'var(--radius-lg)', padding: '36px 28px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: 12 }}>Our Vision</h3>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
                  To be Nepal's leading educational institution, recognized nationally and internationally
                  for producing academically outstanding, morally upright, and socially responsible leaders.
                </p>
              </div>
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '36px 28px', border: '1px solid var(--border)', textAlign: 'center', transition: 'var(--transition)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-lg)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: 12 }}>Our Values</h3>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.8 }}>
                  Integrity, Excellence, Respect, Innovation, Compassion, and Responsibility form the
                  core of everything we do at Global Academy Secondary School.
                </p>
              </div>
            </div>

            {/* Core Values Grid */}
            <div className="values-grid">
              {[
                { title: 'Excellence', desc: 'We pursue the highest standards in everything we do.' },
                { title: 'Integrity', desc: 'We act with honesty, transparency, and accountability.' },
                { title: 'Respect', desc: 'We value every individual and celebrate diversity.' },
                { title: 'Innovation', desc: 'We embrace new ideas and creative approaches to learning.' },
                { title: 'Compassion', desc: 'We care deeply for our students, staff, and community.' },
                { title: 'Growth', desc: 'We believe in continuous improvement and lifelong learning.' },
              ].map((val, i) => (
                <div key={i} className="value-card">
                  <h4 className="value-title">{val.title}</h4>
                  <p className="value-desc">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Principal Message */}
      <FadeInSection>
        <section className="section principal-section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Leadership</div>
              <h2 className="section-title">Principal's Message</h2>
            </div>
            <div className="principal-card">
              <div className="principal-image-side">
                <div className="principal-quote-mark">"</div>
                <img src="/images/principal.jpg" alt="Principal" />
                <img 
                  src="/images/certificate.jpg" 
                  alt="School Achievements" 
                  style={{ 
                    width: '100%', 
                    height: 200, 
                    objectFit: 'cover', 
                    borderRadius: 'var(--radius-md)',
                    marginTop: 12,
                    boxShadow: 'var(--shadow-sm)'
                  }} 
                />
              </div>
              <div className="principal-content">
                <div className="section-tag" style={{ marginBottom: 20, justifyContent: 'flex-start' }}>From the Desk of the Principal</div>
                <p className="principal-message-text">
                  "Education is not just about passing examinations. It is about developing the whole person —
                  intellectually, emotionally, physically, and spiritually. At Global Academy Secondary School, we have always
                  believed that our responsibility extends beyond the classroom walls.
                  <br /><br />
                  We strive to create an environment where curiosity is encouraged, where failure is seen as
                  a stepping stone, where every child feels safe to explore and express themselves. Our teachers
                  are mentors, our classrooms are communities, and our school is a family.
                  <br /><br />
                  I am immensely proud of what we have achieved together over the past 30 years, and I am
                  excited about the future we are building for our students and for Nepal."
                </p>
                <div className="principal-divider"></div>
                <div className="principal-name">Dr. Rajan Kumar Sharma</div>
                <div className="principal-role">Principal, Global Academy Secondary School</div>
                <div style={{ marginTop: 8, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Ph.D. Education | 25+ Years Experience | Former NEB Board Member
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Timeline */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Our Journey</div>
              <h2 className="section-title">30 Years of Excellence</h2>
              <p className="section-subtitle">
                Milestones that define our journey from a small school to a premier institution.
              </p>
            </div>
            <div className="timeline">
              {timelineData.map((item, i) => (
                <div key={i} className="timeline-item">
                  {i % 2 === 0 ? (
                    <>
                      <div className="timeline-content">
                        <div className="timeline-year">{item.year}</div>
                        <div className="timeline-event">{item.event}</div>
                        <p className="timeline-desc">{item.desc}</p>
                      </div>
                      <div className="timeline-dot">{item.year.slice(2)}</div>
                      <div />
                    </>
                  ) : (
                    <>
                      <div />
                      <div className="timeline-dot">{item.year.slice(2)}</div>
                      <div className="timeline-content">
                        <div className="timeline-year">{item.year}</div>
                        <div className="timeline-event">{item.event}</div>
                        <p className="timeline-desc">{item.desc}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Leadership Team */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--surface)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Our Team</div>
              <h2 className="section-title">School Leadership</h2>
              <p className="section-subtitle">
                Experienced and dedicated leaders committed to educational excellence.
              </p>
            </div>
            <img 
              src="/images/school group photo.jpg" 
              alt="Global Academy Leadership Team" 
              style={{ 
                width: '100%', 
                maxHeight: 400, 
                objectFit: 'cover', 
                borderRadius: 'var(--radius-lg)',
                marginBottom: 48,
                boxShadow: 'var(--shadow-lg)'
              }} 
            />
            <div className="leadership-grid">
              {leadersData.map((leader) => (
                <div key={leader.id} className="leader-card">
                  {leader.image ? (
                    <img src={leader.image} alt={leader.name} className="leader-img" />
                  ) : (
                    <div className="leader-avatar-fallback">{leader.initial}</div>
                  )}
                  <div className="leader-body">
                    <h3 className="leader-name">{leader.name}</h3>
                    <div className="leader-role">{leader.role}</div>
                    <p className="leader-bio">{leader.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Accreditation */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Recognition</div>
              <h2 className="section-title">Accreditations & Affiliations</h2>
            </div>
            <div className="grid-4">
              {[
                { title: 'NEB Affiliated', desc: 'Officially affiliated with the National Examinations Board, Nepal.' },
                { title: 'CDC Approved', desc: 'Curriculum approved by the Curriculum Development Centre, Nepal.' },
                { title: 'ISO Certified', desc: 'ISO 9001:2015 certified for quality management in education.' },
                { title: 'Award Winning', desc: 'Best School Award — Kathmandu Education Board 2023 & 2024.' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '28px 20px',
                  textAlign: 'center', border: '1px solid var(--border)', transition: 'var(--transition)'
                }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>{item.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>Join Our Family</div>
          <h2 className="cta-title">Ready to Be Part of Global Academy?</h2>
          <p className="cta-subtitle">
            Give your child the education they deserve. Apply for admission today.
          </p>
          <div className="cta-actions">
            <Link to="/admissions" className="btn btn-accent btn-lg">Apply for Admission</Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
