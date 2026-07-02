import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FlaskConical, Calculator, Globe, Music, Palette } from 'lucide-react';
import { programsData } from '../services/mockData';

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

const departments = [
  { icon: BookOpen, name: 'English & Literature', head: 'Mrs. Priya Shrestha', teachers: 8 },
  { icon: Calculator, name: 'Mathematics', head: 'Mr. Bikash Pradhan', teachers: 7 },
  { icon: FlaskConical, name: 'Science', head: 'Mrs. Anita Tamang', teachers: 10 },
  { icon: Globe, name: 'Social Studies', head: 'Mr. Ram Khatri', teachers: 6 },
  { icon: Music, name: 'Arts & Music', head: 'Mrs. Gita Rana', teachers: 4 },
  { icon: Palette, name: 'Computer Science', head: 'Mr. Sanjay Maharjan', teachers: 5 },
];

const calendarItems = [
  { month: 'Baisakh (Apr)', events: ['New Academic Year Begins', 'Orientation Program', 'First Term Starts'] },
  { month: 'Ashadh (Jun)', events: ['First Term Final Exams', 'Annual Sports Day'] },
  { month: 'Shrawan (Jul)', events: ['Monsoon Break', 'Teacher Training'] },
  { month: 'Bhadra (Aug)', events: ['Second Term Begins', 'Science Exhibition'] },
  { month: 'Kartik (Oct)', events: ['Dashain & Tihar Break', 'Mid-term Exams'] },
  { month: 'Magh (Jan)', events: ['Second Term Finals', 'Annual Cultural Program'] },
  { month: 'Falgun (Mar)', events: ['Third Term', 'SEE & Board Exams Begin'] },
  { month: 'Chaitra (Apr)', events: ['Board Exams Continue', 'Academic Year Ends'] },
];

export default function Academics() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-content">
          <nav className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Academics</span>
          </nav>
          <h1 className="page-hero-title">Academic Programs</h1>
          <p className="page-hero-subtitle">Comprehensive education from early childhood to higher secondary, designed for excellence.</p>
        </div>
      </div>

      {/* Programs */}
      <FadeInSection>
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Programs Offered</div>
              <h2 className="section-title">Our Academic Programs</h2>
              <p className="section-subtitle">
                From early childhood to higher secondary, we provide a comprehensive educational journey.
              </p>
            </div>
            <div className="grid-3">
              {programsData.map((program) => (
                <div key={program.id} className="program-card">
                  <div className="program-card-header">
                    <div className="program-card-icon">
                      <span style={{ fontSize: '1.75rem' }}>{program.icon}</span>
                    </div>
                    <div className="program-card-level">{program.level}</div>
                    <div className="program-card-grade">{program.grade}</div>
                  </div>
                  <div className="program-card-body">
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                      {program.desc}
                    </p>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                      Core Subjects:
                    </div>
                    <div className="program-card-subjects">
                      {program.subjects.map((s, i) => (
                        <span key={i} className="subject-tag">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Curriculum */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="grid-2" style={{ gap: 64, alignItems: 'center' }}>
              <div>
                <div className="section-tag" style={{ justifyContent: 'flex-start' }}>Our Approach</div>
                <h2 className="section-title">Curriculum & Teaching Methodology</h2>
                <p style={{ marginBottom: 20 }}>
                  Our curriculum is aligned with the National Curriculum Framework (NCF) of Nepal and
                  enhanced with international best practices. We follow a child-centered approach where
                  students are active participants in their learning journey.
                </p>
                <p style={{ marginBottom: 32 }}>
                  Our teaching methodology combines traditional academic rigor with modern pedagogical
                  approaches including project-based learning, collaborative activities, and digital tools.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { title: 'Child-Centered Learning', desc: 'Students are encouraged to explore, question, and discover.' },
                    { title: 'Activity-Based Education', desc: 'Learning through doing with practical experiments and projects.' },
                    { title: 'Technology Integration', desc: 'Smart classrooms and digital resources enhance learning.' },
                    { title: 'Value Education', desc: 'Character building and ethical development alongside academics.' },
                    { title: 'Regular Assessment', desc: 'Continuous assessment to track progress and support growth.' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', flexShrink: 0, marginTop: 8 }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, fontSize: '0.9375rem' }}>{item.title}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <img src="/images/classroom.jpg" alt="Modern Classroom" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', width: '100%' }} />
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Departments */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--surface)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Faculty</div>
              <h2 className="section-title">Academic Departments</h2>
              <p className="section-subtitle">
                Each department is led by experienced educators who are passionate about their subjects.
              </p>
            </div>
            <div className="grid-3">
              {departments.map((dept, i) => (
                <div key={i} className="dept-card">
                  <div className="dept-icon">
                    <dept.icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {dept.name}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 600, marginBottom: 4 }}>
                    HOD: {dept.head}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {dept.teachers} qualified teachers
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Extracurricular */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Beyond Academics</div>
              <h2 className="section-title">Co-Curricular Activities</h2>
              <p className="section-subtitle">
                We believe in developing the whole child — academics, arts, sports, and life skills.
              </p>
            </div>
            <div className="grid-4">
              {[
                { icon: '⚽', title: 'Sports', activities: ['Football', 'Basketball', 'Cricket', 'Athletics', 'Badminton'] },
                { icon: '🎭', title: 'Arts & Culture', activities: ['Drama', 'Dance', 'Music', 'Painting', 'Sculpture'] },
                { icon: '🔬', title: 'STEM Clubs', activities: ['Science Club', 'Math Club', 'Coding Club', 'Robotics', 'Astronomy'] },
                { icon: '🗣️', title: 'Communication', activities: ['Debate', 'Quiz Bowl', 'Journalism', 'Public Speaking', 'MUN'] },
              ].map((act, i) => (
                <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border)', transition: 'var(--transition)' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>{act.icon}</div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 12 }}>{act.title}</h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {act.activities.map((a, j) => (
                      <li key={j} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 5, height: 5, background: 'var(--accent)', borderRadius: '50%', display: 'block', flexShrink: 0 }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Academic Calendar */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--surface)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Planning Ahead</div>
              <h2 className="section-title">Academic Calendar 2024-25</h2>
              <p className="section-subtitle">Key dates and events for the academic year.</p>
            </div>
            <div className="grid-4">
              {calendarItems.map((cal, i) => (
                <div key={i} style={{ background: 'var(--bg)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ background: 'var(--primary)', padding: '12px 16px', color: 'var(--accent)', fontWeight: 700, fontSize: '0.875rem' }}>
                    {cal.month}
                  </div>
                  <div style={{ padding: '16px' }}>
                    {cal.events.map((ev, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                        <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', display: 'block', flexShrink: 0, marginTop: 6 }} />
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 className="cta-title">Enroll Your Child in a Program Today</h2>
          <p className="cta-subtitle">Explore our programs and find the right fit for your child's learning journey.</p>
          <div className="cta-actions">
            <Link to="/admissions" className="btn btn-accent btn-lg">Apply Now <ArrowRight size={18} /></Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">Schedule a Visit</Link>
          </div>
        </div>
      </section>
    </>
  );
}
