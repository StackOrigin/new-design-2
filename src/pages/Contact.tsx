import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { showToast } from '../components/ToastProvider';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    showToast('Message sent successfully! We will respond within 24 hours.', 'success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-content">
          <nav className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Contact</span>
          </nav>
          <h1 className="page-hero-title">Contact Us</h1>
          <p className="page-hero-subtitle">
            We're here to help. Reach out to us anytime — we'd love to hear from you.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info-card">
              <h2 className="contact-info-title">Get in Touch</h2>
              <p className="contact-info-subtitle">
                Our admissions team is ready to answer your questions and guide you through the process.
              </p>

              <div className="contact-item">
                <div className="contact-item-icon"><Phone size={20} /></div>
                <div>
                  <div className="contact-item-label">Phone</div>
                  <div className="contact-item-value">01-5201144</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><Mail size={20} /></div>
                <div>
                  <div className="contact-item-label">Email</div>
                  <div className="contact-item-value">info@lalitpurglobalacademy.edu.np</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><MapPin size={20} /></div>
                <div>
                  <div className="contact-item-label">Address</div>
                  <div className="contact-item-value">Lalitpur, Nepal<br />Bagmati Province, Nepal</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><Clock size={20} /></div>
                <div>
                  <div className="contact-item-label">Office Hours</div>
                  <div className="contact-item-value">
                    Sunday – Friday: 9:00 AM – 4:00 PM<br />
                    Saturday: Closed
                  </div>
                </div>
              </div>

              <div className="contact-social">
                {[
                  { label: 'f', name: 'Facebook' },
                  { label: 'in', name: 'Instagram' },
                  { label: 'yt', name: 'YouTube' },
                  { label: 'tw', name: 'Twitter' },
                ].map((s, i) => (
                  <a key={i} href="#" className="social-btn" aria-label={s.name}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-card">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                Send Us a Message
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.9375rem' }}>
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select
                      name="subject"
                      className="form-select"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="">Select a topic</option>
                      <option>Admission Inquiry</option>
                      <option>Fee Structure</option>
                      <option>Academic Programs</option>
                      <option>Campus Tour</option>
                      <option>Transportation</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    className="form-textarea"
                    placeholder="Write your message here..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    style={{ minHeight: 140 }}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 40 }}>
            <div className="section-tag">Find Us</div>
            <h2 className="section-title">Our Location</h2>
            <p className="section-subtitle">Visit our campus in Lalitpur. Easily accessible by public transport.</p>
          </div>
          <div className="map-container">
            <iframe
              className="map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.593982!2d85.3302!3d27.7041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzE0LjgiTiA4NcKwMTknNDguNyJF!5e0!3m2!1sen!2snp!4v1620000000000"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Global Academy Secondary School Location"
            />
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 32, flexWrap: 'wrap' }}>
            {[
              { icon: '🚌', title: 'By Bus', desc: 'Multiple public bus routes pass through Lalitpur. Easily accessible from major routes.' },
              { icon: '🚕', title: 'By Taxi/Cab', desc: 'Easy to reach by taxi or ride-sharing apps. Share our address with your driver.' },
              { icon: '🚗', title: 'By Car', desc: 'Ample parking space available inside the campus premises.' },
            ].map((m, i) => (
              <div key={i} style={{ flex: 1, minWidth: 200, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem' }}>{m.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
