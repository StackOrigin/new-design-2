import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { faqData } from '../services/mockData';
import { showToast } from '../components/ToastProvider';

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

const processes = [
  { step: 1, title: "Collect Prospectus", desc: "Visit our admissions office or download the prospectus from our website. It contains all information about our programs, curriculum, and fee structure." },
  { step: 2, title: "Submit Application Form", desc: "Complete the admission inquiry form online or in person. Attach all required documents as mentioned in the checklist." },
  { step: 3, title: "Entrance Assessment", desc: "Students applying for Grade 4 and above will appear for a written entrance assessment in core subjects. This is a formality to understand the student's current level." },
  { step: 4, title: "Parent Interview", desc: "A brief orientation meeting with parents to discuss the school's philosophy, expectations, and your child's needs and goals." },
  { step: 5, title: "Admission Offer", desc: "Successful applicants will receive an admission offer letter. Seats are confirmed upon payment of the admission fee within 7 days of the offer." },
  { step: 6, title: "Enrollment Complete", desc: "Complete the enrollment by submitting original documents and paying the first term fees. Collect the uniform, books list, and academic calendar." },
];

const feeStructure = [
  { grade: "Pre-Primary (PP / Nursery)", admission: "5,000", monthly: "3,500", annual: "10,000" },
  { grade: "Grade 1 – 3", admission: "7,000", monthly: "4,500", annual: "12,000" },
  { grade: "Grade 4 – 5", admission: "8,000", monthly: "5,000", annual: "13,000" },
  { grade: "Grade 6 – 8", admission: "10,000", monthly: "5,500", annual: "14,000" },
  { grade: "Grade 9 – 10 (SEE)", admission: "12,000", monthly: "6,000", annual: "15,000" },
  { grade: "Grade 11 – 12 Science", admission: "15,000", monthly: "7,000", annual: "18,000" },
  { grade: "Grade 11 – 12 Management", admission: "12,000", monthly: "6,000", annual: "16,000" },
];

const requiredDocs = [
  "Birth Certificate (original + photocopy)",
  "Character Certificate from previous school",
  "Report cards/mark sheets (last 2 years)",
  "Citizenship copy of both parents",
  "4 recent passport-size photographs",
  "Transfer Certificate / Migration Certificate (if applicable)",
  "Medical fitness certificate (for PP to Grade 3)",
  "SEE Mark Sheet (for Grade 11 applicants)",
];

export default function Admissions() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    studentName: '', grade: '', parentName: '', phone: '', email: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.parentName || !formData.phone || !formData.grade) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    showToast('Your admission inquiry has been submitted! We will contact you within 24 hours.', 'success');
    setFormData({ studentName: '', grade: '', parentName: '', phone: '', email: '', message: '' });
    setLoading(false);
  };

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-content">
          <nav className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Admissions</span>
          </nav>
          <h1 className="page-hero-title">Admissions 2025–26</h1>
          <p className="page-hero-subtitle">
            Join the Global Academy family. Applications now open for all grades.
          </p>
        </div>
      </div>

      {/* Quick Info Banner */}
      <div style={{ background: 'var(--accent)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontWeight: 600 }}>
            <AlertCircle size={18} />
            Admissions Open for 2025-26
          </div>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>|</span>
          <span style={{ color: 'white', fontSize: '0.9375rem' }}>Limited Seats Available — Apply Early</span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>|</span>
          <span style={{ color: 'white', fontSize: '0.9375rem' }}>Deadline: March 31, 2025</span>
        </div>
      </div>

      {/* Admission Process */}
      <FadeInSection>
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Step by Step</div>
              <h2 className="section-title">Admission Process</h2>
              <p className="section-subtitle">
                Our transparent and straightforward admission process ensures a smooth start for every student.
              </p>
            </div>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
              <div className="admission-process">
                {processes.map((step) => (
                  <div key={step.step} className="process-step">
                    <div className="process-number">{step.step}</div>
                    <div className="process-content">
                      <h3 className="process-title">Step {step.step}: {step.title}</h3>
                      <p className="process-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Required Documents */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="grid-2" style={{ alignItems: 'start', gap: 64 }}>
              <div>
                <div className="section-tag" style={{ justifyContent: 'flex-start' }}>Documents Required</div>
                <h2 className="section-title">Required Documents</h2>
                <p style={{ marginBottom: 32 }}>
                  Please ensure you have all documents ready before submitting your application.
                  Original documents must be presented at the time of enrollment.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {requiredDocs.map((doc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{doc}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="btn btn-primary">
                    <Download size={16} />
                    Download Checklist
                  </button>
                  <button className="btn btn-outline">
                    <Download size={16} />
                    Download Form
                  </button>
                </div>
                <div style={{ marginTop: 32 }}>
                  <img 
                    src="/images/brochure.jpg" 
                    alt="School Brochure" 
                    style={{ 
                      width: '100%', 
                      maxWidth: 400, 
                      height: 'auto', 
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-md)',
                      border: '2px solid var(--border)'
                    }} 
                  />
                  <p style={{ marginTop: 8, fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Download our prospectus for detailed information
                  </p>
                </div>
              </div>
              <div>
                <div className="section-tag" style={{ justifyContent: 'flex-start' }}>Financial Info</div>
                <h2 className="section-title">Fee Structure 2025-26</h2>
                <p style={{ marginBottom: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  All fees are in Nepalese Rupees (NPR). Monthly fees are payable on or before the 15th of each month.
                </p>
                <div style={{ overflowX: 'auto' }}>
                  <table className="fee-table">
                    <thead>
                      <tr>
                        <th>Grade</th>
                        <th>Admission (NPR)</th>
                        <th>Monthly (NPR)</th>
                        <th>Annual (NPR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeStructure.map((fee, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{fee.grade}</td>
                          <td>{fee.admission}</td>
                          <td>{fee.monthly}</td>
                          <td>{fee.annual}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 12, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  * Fees are subject to annual revision. Annual charges include exam fees, activities, library, and more.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Online Inquiry Form */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--surface)' }}>
          <div className="container">
            <div className="grid-2" style={{ alignItems: 'start', gap: 64 }}>
              <div>
                <div className="section-tag" style={{ justifyContent: 'flex-start' }}>Get In Touch</div>
                <h2 className="section-title">Online Admission Inquiry</h2>
                <p style={{ marginBottom: 32 }}>
                  Fill in the form and our admissions team will contact you within 24 hours to guide you
                  through the next steps.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { icon: '📞', label: 'Call Us', value: '01-5201144' },
                    { icon: '📧', label: 'Email', value: 'info@lalitpurglobalacademy.edu.np' },
                    { icon: '📍', label: 'Address', value: 'Lalitpur, Nepal' },
                    { icon: '🕐', label: 'Office Hours', value: 'Sun – Fri: 9:00 AM – 4:00 PM' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 44, height: 44, background: 'rgba(22,58,112,0.08)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                        <div style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-xl)', padding: '36px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 24 }}>
                    Submit Your Inquiry
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Student's Full Name *</label>
                        <input
                          type="text"
                          name="studentName"
                          className="form-input"
                          placeholder="Student's full name"
                          value={formData.studentName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Applying for Grade *</label>
                        <select
                          name="grade"
                          className="form-select"
                          value={formData.grade}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Grade</option>
                          <option>PP / Nursery</option>
                          <option>Grade 1</option>
                          <option>Grade 2</option>
                          <option>Grade 3</option>
                          <option>Grade 4</option>
                          <option>Grade 5</option>
                          <option>Grade 6</option>
                          <option>Grade 7</option>
                          <option>Grade 8</option>
                          <option>Grade 9</option>
                          <option>Grade 10</option>
                          <option>Grade 11 — Science</option>
                          <option>Grade 11 — Management</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Parent / Guardian Name *</label>
                      <input
                        type="text"
                        name="parentName"
                        className="form-input"
                        placeholder="Parent or guardian's name"
                        value={formData.parentName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-input"
                          placeholder="Contact number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          className="form-input"
                          placeholder="Email (optional)"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Additional Message</label>
                      <textarea
                        name="message"
                        className="form-textarea"
                        placeholder="Any specific questions or information you'd like to share..."
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Inquiry'}
                      {!loading && <ArrowRight size={16} />}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FAQ */}
      <FadeInSection>
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">FAQ</div>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">
                Find answers to the most common questions about admissions at Global Academy Secondary School.
              </p>
            </div>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              {faqData.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button
                    className={`faq-question ${openFaq === faq.id ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  >
                    {faq.question}
                    <ChevronDown size={18} className="faq-chevron" />
                  </button>
                  <div className={`faq-answer ${openFaq === faq.id ? 'open' : ''}`}>
                    {faq.answer}
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
          <h2 className="cta-title">Start Your Child's Journey Today</h2>
          <p className="cta-subtitle">Limited seats available. Don't miss the opportunity to join Global Academy.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-accent btn-lg">
              Visit Our Campus <ArrowRight size={18} />
            </Link>
            <a href="tel:+977015201144" className="btn btn-outline-white btn-lg">
              Call: 01-5201144
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
