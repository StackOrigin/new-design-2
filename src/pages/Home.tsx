import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { newsData, eventsData, testimonialsData, noticesData } from '../data/schoolData';

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

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
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
          }, duration / steps);
        }
      }, { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 2500, suffix: '+', label: 'Students Enrolled' },
  { value: 85, suffix: '+', label: 'Expert Teachers' },
  { value: 30, suffix: '', label: 'Years of Excellence' },
  { value: 98, suffix: '%', label: 'SEE Pass Rate' },
];

const heroSlides = [
  { image: '/images/herosection image.jpg', alt: 'Students at Global Academy' },
  { image: '/images/campus-aerial.jpg', alt: 'Campus aerial view' },
  { image: '/images/classroom.jpg', alt: 'Modern classroom' },
  { image: '/images/sports.jpg', alt: 'Sports activities' },
];

const programs = [
  { step: '01', level: 'Early Childhood', title: 'Foundation Years', desc: 'Play-based learning that sparks curiosity and builds confidence.', color: '#c89f45' },
  { step: '02', level: 'Primary School', title: 'Primary Years', desc: 'Strong foundations in literacy, numeracy, and character.', color: '#1a3363' },
  { step: '03', level: 'Secondary School', title: 'Secondary & Higher', desc: 'Rigorous academics, leadership, and career preparation.', color: '#059669' },
];

const whyChoose = [
  { number: '01', title: 'Academic Excellence', desc: 'Consistently outstanding results with a 98% pass rate.' },
  { number: '02', title: 'Holistic Growth', desc: 'Arts, sports, and values woven into everyday learning.' },
  { number: '03', title: 'Caring Community', desc: 'Small class sizes and teachers who truly know each child.' },
  { number: '04', title: 'Future Ready', desc: 'Digital skills, critical thinking, and global awareness.' },
];

const galleryImages = [
  { src: '/images/campus-aerial.jpg', title: 'Campus Aerial', large: true },
  { src: '/images/library.jpg', title: 'Library' },
  { src: '/images/science-lab.jpg', title: 'Science Lab' },
  { src: '/images/sports.jpg', title: 'Sports' },
  { src: '/images/computer-lab.jpg', title: 'Computer Lab' },
];

export default function Home() {
  useReveal();
  const featuredNews = newsData.slice(0, 3);
  const pinnedNotices = noticesData.filter(n => n.pinned).slice(0, 3);

  // Hero carousel
  const [heroSlide, setHeroSlide] = useState(0);
  const nextSlide = useCallback(() => {
    setHeroSlide(prev => (prev + 1) % heroSlides.length);
  }, []);
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Testimonial carousel
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonialsData.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      {/* HERO with Carousel */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">Ranked #1 Model School in Kathmandu Valley · Est. 1995</div>
            <h1 className="hero-title">Shaping Tomorrow's <span>Leaders</span> Today</h1>
            <p className="hero-subtitle">
              Global Academy provides world-class education rooted in Nepali values — nurturing academic excellence, character, and lifelong success.
            </p>
            <div className="hero-actions">
              <Link to="/admissions" className="btn btn-gold btn-lg">Apply for Admission →</Link>
              <Link to="/about" className="btn btn-outline-white btn-lg">Discover Our Story</Link>
            </div>
            <div className="hero-stats-row">
              {stats.slice(0, 3).map(s => (
                <div key={s.label} className="hero-stat-item">
                  <div className="hero-stat-number"><AnimatedCounter target={s.value} suffix={s.suffix} /></div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-media">
            <div className="hero-media-main">
              <div className="hero-carousel-wrapper">
                {heroSlides.map((slide, i) => (
                  <div key={i} className={`hero-slide ${i === heroSlide ? 'active' : ''}`}>
                    <img src={slide.image} alt={slide.alt} />
                  </div>
                ))}
                <div className="hero-carousel-dots">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      className={`hero-carousel-dot ${i === heroSlide ? 'active' : ''}`}
                      onClick={() => setHeroSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="hero-media-stack">
              <img src="/images/classroom.jpg" alt="Classroom" />
              <img src="/images/students.jpg" alt="Students" />
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS TICKER */}
      <div className="events-ticker">
        <div className="events-ticker-inner">
          {[...eventsData, ...eventsData].map((event, i) => (
            <span key={i}>
              <span className="ticker-item">
                <strong>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
                {event.title}
              </span>
              <span className="ticker-divider" />
            </span>
          ))}
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="container">
        <div className="stats-strip">
          <div className="stats-strip-grid">
            {stats.map(s => (
              <div key={s.label} className="stat-strip-item">
                <div className="stat-strip-number"><AnimatedCounter target={s.value} suffix={s.suffix} /></div>
                <div className="stat-strip-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRINCIPAL'S WELCOME */}
      <section className="section section-cream">
        <div className="container">
          <div className="quote-block">
            <div className="quote-image reveal">
              <img src="/images/principal.jpg" alt="Principal Dr. Rajan Kumar Sharma" />
            </div>
            <div className="quote-content reveal">
              <div className="quote-mark">"</div>
              <p className="quote-text">
                At Global Academy, we believe that every child is unique and carries infinite potential. Our mission is to ignite a lifelong love for learning and prepare students to lead with integrity.
              </p>
              <div className="quote-author">Dr. Rajan Kumar Sharma</div>
              <div className="quote-role">Principal, Global Academy Secondary School</div>
              <Link to="/about" className="btn btn-navy" style={{ marginTop: '28px' }}>Learn About Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Academic Programs</span>
            <h2 className="section-title">A Program for Every Stage</h2>
            <p className="section-subtitle">From early childhood through higher secondary, we guide students with warmth, rigor, and purpose.</p>
          </div>
          <div className="programs-grid">
            {programs.map((p, i) => (
              <div key={i} className="program-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="program-card-header" style={{ background: p.color }} />
                <div className="program-card-body">
                  <div className="program-level">{p.step} — {p.level}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <Link to="/academics" className="news-link">Explore Academics →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Why Global Academy</span>
            <h2 className="section-title">The Global Academy Difference</h2>
            <p className="section-subtitle">What makes us the trusted choice for thousands of families across Kathmandu Valley.</p>
          </div>
          <div className="why-grid">
            {whyChoose.map((item, i) => (
              <div key={item.title} className="why-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="why-number">{item.number}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAMPUS LIFE GALLERY */}
      <section className="section section-navy">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Campus Life</span>
            <h2 className="section-title">A Day at Global Academy</h2>
            <p className="section-subtitle">A balance of structured learning, creative exploration, physical activity, and joyful discovery.</p>
          </div>
          <div className="mosaic-grid">
            {galleryImages.map((img, i) => (
              <div key={i} className={`mosaic-item reveal ${img.large ? 'large' : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <img src={img.src} alt={img.title} />
                <div className="mosaic-overlay"><span>{img.title}</span></div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/gallery" className="btn btn-outline-white">View Full Gallery</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Voices</span>
            <h2 className="section-title">What Parents & Alumni Say</h2>
          </div>
          <div className="testimonial-carousel reveal">
            <div className="testimonial-carousel-inner">
              <div className="testimonial-quote-mark">"</div>
              <p className="testimonial-quote-text">{testimonialsData[activeTestimonial].text}</p>
              <div className="testimonial-author-row">
                <div className="testimonial-avatar-circle" style={{ background: 'var(--gold-pale)', color: 'var(--gold)' }}>
                  {testimonialsData[activeTestimonial].initial}
                </div>
                <div>
                  <div className="testimonial-author-name">{testimonialsData[activeTestimonial].name}</div>
                  <div className="testimonial-author-role">{testimonialsData[activeTestimonial].role}</div>
                </div>
              </div>
            </div>
            <div className="testimonial-nav">
              <div className="testimonial-dots">
                {testimonialsData.map((_, i) => (
                  <button
                    key={i}
                    className={`testimonial-dot ${i === activeTestimonial ? 'active' : ''}`}
                    onClick={() => setActiveTestimonial(i)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/testimonials" className="btn btn-outline">Read All Testimonials</Link>
          </div>
        </div>
      </section>

      {/* LATEST NOTICES */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Notice Board</span>
            <h2 className="section-title">Important Notices</h2>
          </div>
          <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pinnedNotices.map((notice, i) => (
              <div key={notice.id} className="card reveal notice-card" style={{ padding: 0, overflow: 'hidden', transitionDelay: `${i * 80}ms` }}>
                <div className="notice-card-inner">
                  <div className="notice-date-badge">
                    <span className="notice-date-day">{new Date(notice.date).getDate()}</span>
                    <span className="notice-date-month">{new Date(notice.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div className="notice-content">
                    <div className="notice-header">
                      <span className="notice-pin-badge">Pinned Notice</span>
                    </div>
                    <h3 className="notice-title">{notice.title}</h3>
                    <p className="notice-text">{notice.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <Link to="/notices" className="btn btn-outline">View All Notices</Link>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Latest Updates</span>
            <h2 className="section-title">News & Announcements</h2>
          </div>
          <div className="news-grid">
            {featuredNews.map((news, i) => (
              <article key={news.id} className="news-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <img src={news.image} alt={news.title} className="news-card-img" />
                <div className="news-card-body">
                  <div className="news-card-meta">
                    <span className="news-category">{news.category}</span>
                    <span className="news-date">{new Date(news.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3>{news.title}</h3>
                  <p>{news.excerpt}</p>
                  <Link to={`/news/${news.id}`} className="news-link">Read Full Story →</Link>
                </div>
              </article>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/news" className="btn btn-outline">View All News</Link>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Calendar</span>
            <h2 className="section-title">Upcoming Events</h2>
          </div>
          <div className="programs-grid">
            {eventsData.slice(0, 3).map(event => (
              <div key={event.id} className="card reveal" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 12, background: 'var(--gold-pale)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gold)', fontWeight: 700
                  }}>
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{new Date(event.date).getDate()}</span>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gold)' }}>{event.category}</span>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{event.title}</h3>
                  </div>
                </div>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.92rem', lineHeight: 1.6 }}>{event.description}</p>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: 12 }}>
                  <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Time:</span> {event.time} &nbsp;·&nbsp; <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Venue:</span> {event.location}
                </p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/events" className="btn btn-outline">View All Events</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="cta-content">
          <span className="section-eyebrow" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Admissions 2025–26</span>
          <h2>Begin Your Child's Journey to Excellence</h2>
          <p>Limited seats remain for the upcoming academic year. Schedule a visit or apply today to secure your child's future.</p>
          <div className="cta-actions">
            <Link to="/admissions" className="btn btn-gold btn-lg">Apply for Admission</Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">Schedule a Visit</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
