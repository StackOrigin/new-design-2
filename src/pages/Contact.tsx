import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

export default function Contact() {
  useReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Contact</span></nav>
          <h1 className="page-hero-title">Contact Us</h1>
          <p className="page-hero-subtitle">We would love to hear from you. Reach out for admissions, campus visits, or general inquiries.</p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <section className="section-navy" style={{ padding: '50px 0' }}>
        <div className="container">
          <div className="why-grid">
            {[
              { label: 'Campus Address', title: 'Location', desc: 'Lalitpur, Bagmati Province, Nepal' },
              { label: 'Direct Line', title: 'Phone', desc: '01-5201144' },
              { label: 'Admissions & Inquiries', title: 'Email', desc: 'info@lalitpurglobalacademy.edu.np' },
              { label: 'Visiting Schedule', title: 'Office Hours', desc: 'Sun–Fri: 9:00 AM – 4:00 PM' },
            ].map((item, i) => (
              <div key={i} className="reveal" style={{
                textAlign: 'center', padding: 24, background: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)',
                transitionDelay: `${i * 80}ms`
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gold-light)', display: 'block', marginBottom: 6 }}>{item.label}</span>
                <h3 style={{ color: 'white', fontSize: '1.15rem', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="section section-cream">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 50, alignItems: 'start' }}>
            <div className="reveal">
              <span className="section-eyebrow">Get in Touch</span>
              <h2 className="section-title">Send Us a Message</h2>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, marginBottom: 28 }}>
                Our admissions team is available Sunday through Friday to answer your questions and arrange campus tours.
              </p>

              <form className="card" style={{ padding: 36 }} onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <input className="form-input" placeholder="Full Name" required />
                    <input className="form-input" placeholder="Email Address" type="email" required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <input className="form-input" placeholder="Phone Number" />
                    <select className="form-input" defaultValue="">
                      <option value="" disabled>Select Subject</option>
                      <option>Admissions Inquiry</option>
                      <option>Campus Visit Request</option>
                      <option>Fee Structure</option>
                      <option>General Inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <textarea className="form-input" rows={4} placeholder="Your message" required />
                  <button className="btn btn-gold" type="submit">Send Message →</button>
                </div>
              </form>

              {submitted && (
                <div style={{
                  marginTop: 16, padding: '14px 20px', borderRadius: 'var(--radius-md)',
                  background: '#059669', color: 'white', fontWeight: 600, fontSize: '0.92rem',
                  animation: 'fadeInUp 0.3s ease'
                }}>
                  Thank you! Your message has been sent. We will get back to you soon.
                </div>
              )}
            </div>

            <div className="reveal" style={{ transitionDelay: '150ms' }}>
              <span className="section-eyebrow">Find Us</span>
              <h2 className="section-title">Visit Our Campus</h2>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, marginBottom: 24 }}>
                We're conveniently located in Lalitpur, Nepal. Feel free to visit us during office hours or schedule an appointment.
              </p>

              {/* Google Maps Embed */}
              <div className="card" style={{ overflow: 'hidden', padding: 0, marginBottom: 20 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14135.3!2d85.324!3d27.6588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLalitpur!5e0!3m2!1sen!2snp!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Global Academy Location"
                />
              </div>

              {/* Office Hours */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 14 }}>Office & Visiting Hours</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { day: 'Sunday – Friday', time: '9:00 AM – 4:00 PM', active: true },
                    { day: 'Saturday', time: 'Closed', active: false },
                    { day: 'Public Holidays', time: 'Closed', active: false },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--gray-100)' : 'none'
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{item.day}</span>
                      <span style={{
                        fontSize: '0.88rem', fontWeight: 600,
                        color: item.active ? '#059669' : 'var(--gray-500)',
                        background: item.active ? '#05966915' : 'var(--gray-100)',
                        padding: '4px 12px', borderRadius: 'var(--radius-full)'
                      }}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
