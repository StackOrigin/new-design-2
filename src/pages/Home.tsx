import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Calendar, Clock, MapPin, ChevronRight,
  Award, Users, BookOpen, TrendingUp, CheckCircle, Star
} from 'lucide-react';
import { newsData, eventsData, testimonialsData, whyChooseData, facilitiesData } from '../services/mockData';

// Animated counter component
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
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

  return <div ref={ref}>{count}{suffix}</div>;
}

// Fade in on scroll
function FadeInSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-in-section ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const featuredNews = newsData.slice(0, 3);
  const upcomingEvents = eventsData.slice(0, 4);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getDay = (dateStr: string) => new Date(dateStr).getDate();
  const getMonth = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short' });

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/images/herosection image.jpg" alt="Global Academy Campus" loading="eager" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={13} />
            Ranked #1 School in Kathmandu Valley 2024
          </div>
          <h1 className="hero-title">
            Shaping Tomorrow's<br />
            <span>Leaders Today</span>
          </h1>
          <p className="hero-subtitle">
            At Global Academy Secondary School, we provide world-class education rooted in Nepali values,
            nurturing academic excellence, character, and lifelong success.
          </p>
          <div className="hero-actions">
            <Link to="/admissions" className="btn btn-accent btn-lg">
              Apply for Admission <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-outline-white btn-lg">
              Learn More
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">2500+</div>
              <div className="hero-stat-label">Students Enrolled</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">85+</div>
              <div className="hero-stat-label">Expert Teachers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">30</div>
              <div className="hero-stat-label">Years of Excellence</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">98%</div>
              <div className="hero-stat-label">SEE Pass Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { icon: Users, number: 2500, suffix: '+', label: 'Students Enrolled', color: '#D4A017' },
            { icon: Award, number: 85, suffix: '+', label: 'Qualified Teachers', color: '#D4A017' },
            { icon: BookOpen, number: 30, suffix: '', label: 'Years of Excellence', color: '#D4A017' },
            { icon: TrendingUp, number: 98, suffix: '%', label: 'SEE Pass Rate 2024', color: '#D4A017' },
          ].map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number">
                <AnimatedCounter target={stat.number} suffix={stat.suffix} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRINCIPAL'S MESSAGE ── */}
      <FadeInSection>
        <section className="section principal-section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Leadership</div>
              <h2 className="section-title">Message from the Principal</h2>
            </div>
            <div className="principal-card">
              <div className="principal-image-side">
                <div className="principal-quote-mark">"</div>
                <img src="/images/principal.jpg" alt="Principal Dr. Rajan Kumar Sharma" />
              </div>
              <div className="principal-content">
                <div className="section-tag" style={{ marginBottom: 24 }}>Principal's Message</div>
                <p className="principal-message-text">
                  "At Global Academy Secondary School, we believe that every child is unique and carries infinite potential.
                  Our mission is not merely to impart knowledge but to ignite a lifelong love for learning,
                  to build resilient character, and to prepare our students to lead with integrity in an
                  ever-changing world.
                  <br /><br />
                  Over the past 30 years, we have witnessed thousands of students transform into confident,
                  compassionate, and capable individuals. This is our greatest achievement and our constant
                  inspiration. I invite you to be a part of the Global Academy family."
                </p>
                <div className="principal-divider"></div>
                <div className="principal-name">Dr. Rajan Kumar Sharma</div>
                <div className="principal-role">Principal, Global Academy Secondary School</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Ph.D. Education</span>
                  <span style={{ color: 'var(--border)' }}>•</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>25+ Years Experience</span>
                </div>
                <Link to="/about" className="btn btn-primary" style={{ marginTop: 28, width: 'fit-content' }}>
                  Learn More About Us <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── LATEST NEWS ── */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Stay Updated</div>
              <h2 className="section-title">Latest News & Announcements</h2>
              <p className="section-subtitle">
                Stay informed about the latest happenings, achievements, and announcements from Global Academy Secondary School.
              </p>
            </div>
            <div className="grid-3">
              {featuredNews.map((news) => (
                <article key={news.id} className="news-card">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="news-card-img"
                    loading="lazy"
                  />
                  <div className="news-card-body">
                    <div className="news-card-category">{news.category}</div>
                    <div className="news-card-date">
                      <Calendar size={13} />
                      {formatDate(news.date)}
                    </div>
                    <h3 className="news-card-title">{news.title}</h3>
                    <p className="news-card-excerpt">{news.excerpt}</p>
                    <Link to={`/news/${news.id}`} className="news-card-link">
                      Read Full Story <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Link to="/news" className="btn btn-outline">
                View All News <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── UPCOMING EVENTS ── */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--surface)' }}>
          <div className="container">
            <div className="flex-between" style={{ marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="section-tag" style={{ justifyContent: 'flex-start' }}>Calendar</div>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Upcoming Events</h2>
              </div>
              <Link to="/news" className="btn btn-outline btn-sm">
                View All Events <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid-2">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-date-box">
                    <div className="event-day">{getDay(event.date)}</div>
                    <div className="event-month">{getMonth(event.date)}</div>
                  </div>
                  <div className="event-content">
                    <div className="event-title">{event.title}</div>
                    <div className="event-meta">
                      <div className="event-meta-item">
                        <Clock size={12} />
                        {event.time}
                      </div>
                      <div className="event-meta-item">
                        <MapPin size={12} />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── FACILITIES ── */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Our Facilities</div>
              <h2 className="section-title">World-Class Learning Environment</h2>
              <p className="section-subtitle">
                Our campus is equipped with modern facilities to provide an enriching educational experience for every student.
              </p>
            </div>
            <div className="grid-3">
              {facilitiesData.slice(0, 3).map((facility) => (
                <div key={facility.id} className="facility-card">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="facility-card-img"
                    loading="lazy"
                  />
                  <div className="facility-card-overlay" />
                  <div className="facility-card-body">
                    <div className="facility-icon">
                      <span style={{ fontSize: '1.5rem' }}>{facility.icon}</span>
                    </div>
                    <h3 className="facility-title">{facility.title}</h3>
                    <p className="facility-desc">{facility.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Link to="/facilities" className="btn btn-outline">
                Explore All Facilities <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── WHY CHOOSE US ── */}
      <FadeInSection>
        <section className="section why-section">
          <div className="container why-content">
            <div className="section-header">
              <div className="section-tag">Why Global Academy</div>
              <h2 className="section-title">The Global Academy Difference</h2>
              <p className="section-subtitle">
                What makes us the preferred choice for thousands of families across Kathmandu Valley.
              </p>
            </div>
            <div className="grid-3">
              {whyChooseData.map((item, i) => (
                <div key={i} className="why-item">
                  <div className="why-icon">
                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="why-item-title">{item.title}</h4>
                    <p className="why-item-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── TESTIMONIALS ── */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Testimonials</div>
              <h2 className="section-title">What Parents & Alumni Say</h2>
              <p className="section-subtitle">
                The trust of our community is our greatest achievement.
              </p>
            </div>
            <div className="grid-3">
              {testimonialsData.map((t) => (
                <div key={t.id} className="testimonial-card">
                  <div className="stars">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="var(--accent)" color="var(--accent)" />
                    ))}
                  </div>
                  <div className="testimonial-quote">"</div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.initial}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── GALLERY PREVIEW ── */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--surface)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Photo Gallery</div>
              <h2 className="section-title">Life at Global Academy</h2>
              <p className="section-subtitle">
                A glimpse into our vibrant campus life, facilities, and student achievements.
              </p>
            </div>
            <div className="gallery-grid">
              {[
                '/images/campus-aerial.jpg',
                '/images/library.jpg',
                '/images/computer-lab.jpg',
                '/images/science-lab.jpg',
                '/images/sports.jpg',
              ].map((img, i) => (
                <div key={i} className="gallery-item">
                  <img src={img} alt={`Gallery ${i + 1}`} loading="lazy" />
                  <div className="gallery-overlay">
                    <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 600 }}>
                      <CheckCircle size={18} />
                      View Photo
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Link to="/gallery" className="btn btn-outline">
                View Full Gallery <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── CTA ── */}
      <FadeInSection>
        <section className="section cta-section">
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>
              Admissions 2025–26
            </div>
            <h2 className="cta-title">
              Begin Your Child's Journey<br />to Excellence Today
            </h2>
            <p className="cta-subtitle">
              Join the Global Academy family. Limited seats available for the 2025-26 academic year.
              Early applications are encouraged for all grades.
            </p>
            <div className="cta-actions">
              <Link to="/admissions" className="btn btn-accent btn-lg">
                Apply for Admission <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline-white btn-lg">
                Schedule a Campus Visit
              </Link>
            </div>
            <p style={{ marginTop: 24, fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)' }}>
              Questions? Call us: 01-5201144 | info@lalitpurglobalacademy.edu.np
            </p>
          </div>
        </section>
      </FadeInSection>
    </>
  );
}
