import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { testimonialsData } from '../data/schoolData';

export default function Testimonials() {
  useReveal();
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive(prev => (prev + 1) % testimonialsData.length);
  }, []);

  const prev = useCallback(() => {
    setActive(prev => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonialsData[active];

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Testimonials</span></nav>
          <h1 className="page-hero-title">What People Say</h1>
          <p className="page-hero-subtitle">Hear from parents, students, and alumni about their experience at Global Academy.</p>
        </div>
      </div>

      {/* Featured Testimonial Carousel */}
      <section className="section section-cream">
        <div className="container">
          <div className="testimonial-carousel reveal">
            <div className="testimonial-carousel-inner">
              <div className="testimonial-quote-mark">"</div>
              <p className="testimonial-quote-text">{t.text}</p>
              <div className="testimonial-author-row">
                <div className="testimonial-avatar-circle" style={{ background: 'var(--gold-pale)', color: 'var(--gold)' }}>
                  {t.initial}
                </div>
                <div>
                  <div className="testimonial-author-name">{t.name}</div>
                  <div className="testimonial-author-role">{t.role}</div>
                </div>
              </div>
              <div className="testimonial-rating">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>

            <div className="testimonial-nav">
              <button className="testimonial-nav-btn" onClick={prev} aria-label="Previous">←</button>
              <div className="testimonial-dots">
                {testimonialsData.map((_, i) => (
                  <button
                    key={i}
                    className={`testimonial-dot ${i === active ? 'active' : ''}`}
                    onClick={() => setActive(i)}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button className="testimonial-nav-btn" onClick={next} aria-label="Next">→</button>
            </div>
          </div>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Community Voices</span>
            <h2 className="section-title">All Testimonials</h2>
          </div>
          <div className="programs-grid">
            {testimonialsData.map((item, i) => (
              <div key={item.id} className="card reveal" style={{ padding: 28, transitionDelay: `${i * 80}ms` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: 'var(--gold-pale)', color: 'var(--gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', fontWeight: 700
                  }}>
                    {item.initial}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{item.role}</div>
                  </div>
                </div>
                <p style={{ color: 'var(--gray-500)', lineHeight: 1.7, fontSize: '0.95rem', fontStyle: 'italic' }}>
                  "{item.text}"
                </p>
                <div style={{ marginTop: 14, fontSize: '0.85rem' }}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="cta-content">
          <span className="section-eyebrow" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Share Your Story</span>
          <h2>Have a Global Academy Story to Share?</h2>
          <p>We'd love to hear about your experience. Get in touch and help inspire future families.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-gold btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
