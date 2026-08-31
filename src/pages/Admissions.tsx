import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { faqData } from '../data/schoolData';
import FeeCalculator from '../components/FeeCalculator';

const steps = [
  { step: '01', title: 'Inquiry & Campus Tour', desc: 'Fill out an inquiry form online or visit our school admissions desk to meet our counselors and take a guided tour.', time: 'Day 1' },
  { step: '02', title: 'Application Form', desc: 'Submit the completed application form along with past academic records, birth certificate, and photographs.', time: 'Day 2–3' },
  { step: '03', title: 'Assessment & Interaction', desc: 'Students participate in an age-appropriate assessment followed by a friendly parent-student interaction session.', time: 'Day 4–5' },
  { step: '04', title: 'Enrollment & Welcome', desc: 'Receive the acceptance letter, complete fee formalities, and receive your welcome kit and student ID.', time: 'Day 7' },
];

const feeStructure = [
  { level: 'Pre-Primary (PP/Nursery/KG)', admission: 'Rs. 15,000', monthly: 'Rs. 6,500', termFee: 'Rs. 4,000', features: ['Activity materials included', 'Nutritious midday snacks', 'Day care support option'] },
  { level: 'Primary School (Grade 1–5)', admission: 'Rs. 18,000', monthly: 'Rs. 7,800', termFee: 'Rs. 5,000', features: ['Computer lab access', 'Art & music sessions', 'Extracurricular coaching'] },
  { level: 'Lower Secondary (Grade 6–8)', admission: 'Rs. 20,000', monthly: 'Rs. 8,900', termFee: 'Rs. 6,000', features: ['Science practicals', 'Robotics & coding club', 'Sports specializations'] },
  { level: 'Secondary (Grade 9–10 SEE)', admission: 'Rs. 22,000', monthly: 'Rs. 10,200', termFee: 'Rs. 7,000', features: ['Intensive SEE preparation', 'Career counseling', 'Full lab privileges'] },
  { level: 'Higher Secondary (+2 Science / Mgmt)', admission: 'Rs. 25,000', monthly: 'Rs. 11,500', termFee: 'Rs. 8,000', features: ['NEB board prep', 'Entrance exam guidance', 'Modern lecture rooms'] },
];

export default function Admissions() {
  useReveal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Admissions</span></nav>
          <h1 className="page-hero-title">Admissions 2025–26</h1>
          <p className="page-hero-subtitle">Invest in your child’s future. Join a community that values curiosity, character, and academic distinction.</p>
        </div>
      </div>

      {/* Admission Notice Banner */}
      <section className="section-navy" style={{ padding: '30px 0', borderBottom: '2px solid var(--gold)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ color: 'var(--gold-light)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: 1 }}>Admission Status</span>
            <h3 style={{ color: 'white', margin: '4px 0 0', fontSize: '1.2rem' }}>Applications Open for Session 2025–2026</h3>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/downloads" className="btn btn-outline-white btn-sm">Download Form (PDF)</Link>
            <Link to="/contact" className="btn btn-gold btn-sm">Book Campus Visit</Link>
          </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Step-by-Step</span>
            <h2 className="section-title">The Admission Journey</h2>
            <p className="section-subtitle">We make enrolling your child straightforward, transparent, and supportive every step of the way.</p>
          </div>

          <div className="programs-grid">
            {steps.map((step, i) => (
              <div key={i} className="card reveal" style={{ padding: 32, position: 'relative', overflow: 'visible', transitionDelay: `${i * 90}ms` }}>
                <div style={{
                  position: 'absolute', top: -16, left: 24,
                  background: 'var(--navy)', color: 'var(--gold-light)',
                  padding: '6px 14px', borderRadius: 'var(--radius-full)',
                  fontWeight: 700, fontSize: '0.85rem', border: '2px solid var(--gold)'
                }}>
                  {step.step}
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700 }}>{step.time}</div>
                <h3 style={{ marginTop: 12, fontSize: '1.2rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--gray-500)', lineHeight: 1.65, fontSize: '0.92rem', marginTop: 8 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility & Required Documents */}
      <section className="section section-white">
        <div className="container">
          <div className="quote-block">
            <div className="quote-content reveal">
              <span className="section-eyebrow">Requirements</span>
              <h2 className="section-title">Eligibility & Documents</h2>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 20 }}>
                Please bring original and copies of the following documents during your admission interview:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  'Birth Certificate (Original + Copy)',
                  'Previous School Character Certificate',
                  'Last 2 Years Marksheet / Progress Card',
                  'Citizenship Copy of Parents/Guardian',
                  '4 Recent Passport-sized Photographs',
                  'Transfer Certificate (Grade 2 upwards)',
                ].map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--navy)' }}>{doc}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 32 }}>
                <Link to="/contact" className="btn btn-navy">Schedule Counseling Session</Link>
              </div>
            </div>
            <div className="quote-image reveal">
              <img src="/images/classroom.jpg" alt="Global Academy Classrooms" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Fee Estimator Widget */}
      <section className="section section-cream" id="calculator">
        <div className="container">
          <FeeCalculator />
        </div>
      </section>

      {/* Fee Structure Table */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Transparent Pricing</span>
            <h2 className="section-title">Official Fee Schedule (2025–26)</h2>
            <p className="section-subtitle">We believe in transparent, competitive fee structures with merit and need-based scholarships available.</p>
          </div>

          <div className="card reveal" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 650 }}>
              <thead>
                <tr style={{ background: 'var(--navy)', color: 'white' }}>
                  <th style={{ padding: '18px 24px', fontWeight: 600 }}>Grade Level</th>
                  <th style={{ padding: '18px 20px', fontWeight: 600 }}>Admission Fee</th>
                  <th style={{ padding: '18px 20px', fontWeight: 600 }}>Monthly Tuition</th>
                  <th style={{ padding: '18px 20px', fontWeight: 600 }}>Term Exam Fee</th>
                  <th style={{ padding: '18px 24px', fontWeight: 600 }}>Key Inclusions</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)', background: i % 2 === 0 ? 'white' : 'var(--cream)' }}>
                    <td style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--navy)' }}>{row.level}</td>
                    <td style={{ padding: '18px 20px', color: 'var(--gold)', fontWeight: 700 }}>{row.admission}</td>
                    <td style={{ padding: '18px 20px', color: 'var(--navy-light)', fontWeight: 600 }}>{row.monthly}</td>
                    <td style={{ padding: '18px 20px', color: 'var(--gray-500)' }}>{row.termFee}</td>
                    <td style={{ padding: '18px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {row.features.map((f, fi) => (
                          <span key={fi} style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>• {f}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--gray-500)', fontSize: '0.85rem' }}>
            * Note: Transportation, uniform, and special extracurricular activities are billed separately. Scholarships applicable on tuition fees.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section section-white">
        <div className="container" style={{ maxWidth: 850 }}>
          <div className="section-header centered reveal">
            <span className="section-eyebrow">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {faqData.map((f, i) => (
              <div key={i} className="card reveal" style={{ padding: '0', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', padding: '20px 24px', textAlign: 'left',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontWeight: 600, color: 'var(--navy)', fontSize: '1rem', background: openFaq === i ? 'var(--navy-soft)' : 'white'
                  }}
                >
                  {f.question}
                  <span style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', color: 'var(--gold)' }}>▼</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '20px 24px', color: 'var(--gray-700)', lineHeight: 1.75, whiteSpace: 'pre-line', borderTop: '1px solid var(--gray-100)' }}>
                    {f.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="cta-content">
          <span className="section-eyebrow" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Limited Seats</span>
          <h2>Secure Your Child’s Seat Today</h2>
          <p>Admissions are filled on a first-come, merit-evaluated basis. Start the application process now.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-gold btn-lg">Apply Online Now</Link>
            <Link to="/downloads" className="btn btn-outline-white btn-lg">Download Admission Form</Link>
          </div>
        </div>
      </section>
    </>
  );
}
