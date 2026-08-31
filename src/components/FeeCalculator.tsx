import { useState } from 'react';
import { Link } from 'react-router-dom';

interface GradeFee {
  name: string;
  monthlyTuition: number;
  termExam: number;
  admission: number;
}

const gradeFees: Record<string, GradeFee> = {
  'Pre-Primary (PP/Nursery/KG)': { name: 'Pre-Primary', monthlyTuition: 6500, termExam: 4000, admission: 15000 },
  'Primary School (Grade 1–5)': { name: 'Primary (Grades 1–5)', monthlyTuition: 7800, termExam: 5000, admission: 18000 },
  'Lower Secondary (Grade 6–8)': { name: 'Lower Secondary (Grades 6–8)', monthlyTuition: 8900, termExam: 6000, admission: 20000 },
  'Secondary School (Grade 9–10 SEE)': { name: 'Secondary (SEE)', monthlyTuition: 10200, termExam: 7000, admission: 22000 },
  'Higher Secondary — Science (+2)': { name: '+2 Science (NEB)', monthlyTuition: 11500, termExam: 8000, admission: 25000 },
  'Higher Secondary — Management (+2)': { name: '+2 Management (NEB)', monthlyTuition: 10500, termExam: 7500, admission: 24000 },
};

const transportOptions = [
  { label: 'No Bus Transport', fee: 0 },
  { label: 'Zone A (Within 3 km) — Rs. 2,200/mo', fee: 2200 },
  { label: 'Zone B (3 to 7 km) — Rs. 3,200/mo', fee: 3200 },
  { label: 'Zone C (7+ km Valley-wide) — Rs. 4,200/mo', fee: 4200 },
];

const mealOptions = [
  { label: 'No Meal Plan (Own tiffin)', fee: 0 },
  { label: 'Nutritious Midday Snacks — Rs. 1,800/mo', fee: 1800 },
  { label: 'Full Hot Lunch & Snacks — Rs. 3,500/mo', fee: 3500 },
];

export default function FeeCalculator() {
  const [selectedGrade, setSelectedGrade] = useState('Primary School (Grade 1–5)');
  const [transportIndex, setTransportIndex] = useState(0);
  const [mealIndex, setMealIndex] = useState(0);
  const [scholarshipPercent, setScholarshipPercent] = useState(0);

  const base = gradeFees[selectedGrade];
  const transportFee = transportOptions[transportIndex].fee;
  const mealFee = mealOptions[mealIndex].fee;

  const discountedTuition = base.monthlyTuition * (1 - scholarshipPercent / 100);
  const totalMonthly = discountedTuition + transportFee + mealFee;
  const termTotal = totalMonthly * 3 + base.termExam;
  const annualTotal = totalMonthly * 12 + base.termExam * 3;
  const annualSavings = (base.monthlyTuition * (scholarshipPercent / 100)) * 12;

  return (
    <div className="card reveal" style={{ padding: 40, background: '#ffffff', boxShadow: 'var(--shadow-lg)', borderTop: '5px solid var(--gold)' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span className="section-eyebrow" style={{ justifyContent: 'center' }}>Tuition Planning</span>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--navy)', margin: '6px 0' }}>Tuition & Fee Estimator</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>
          Select grade level, transport, dining plans, and scholarship percentage for an instant estimated breakdown.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, alignItems: 'start' }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>
              1. Select Grade Level
            </label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="form-input"
              style={{ width: '100%', background: 'var(--cream)', fontWeight: 600 }}
            >
              {Object.keys(gradeFees).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>
              2. School Bus Transportation
            </label>
            <select
              value={transportIndex}
              onChange={e => setTransportIndex(Number(e.target.value))}
              className="form-input"
              style={{ width: '100%', background: 'var(--cream)' }}
            >
              {transportOptions.map((opt, i) => (
                <option key={i} value={i}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>
              3. Dining & Lunch Plan
            </label>
            <select
              value={mealIndex}
              onChange={e => setMealIndex(Number(e.target.value))}
              className="form-input"
              style={{ width: '100%', background: 'var(--cream)' }}
            >
              {mealOptions.map((opt, i) => (
                <option key={i} value={i}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy)' }}>
                4. Merit/Need Scholarship Discount
              </label>
              <span style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '1rem' }}>{scholarshipPercent}% Waiver</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={scholarshipPercent}
              onChange={e => setScholarshipPercent(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
              <span>0% (Standard)</span>
              <span>25% (Merit)</span>
              <span>50% (Distinction/Aid)</span>
            </div>
          </div>
        </div>

        {/* Live Calculation Output Card */}
        <div style={{ background: 'var(--navy)', color: '#ffffff', padding: 32, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-light)', letterSpacing: 1 }}>
            Estimated Fee Summary
          </span>
          <h3 style={{ color: '#ffffff', fontSize: '1.4rem', margin: '4px 0 16px' }}>{base.name}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.15)', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>Base Monthly Tuition:</span>
              <span>Rs. {base.monthlyTuition.toLocaleString()}</span>
            </div>
            {scholarshipPercent > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                <span>Scholarship ({scholarshipPercent}%):</span>
                <span>- Rs. {((base.monthlyTuition * scholarshipPercent) / 100).toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>Bus Transport:</span>
              <span>Rs. {transportFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>Dining / Snacks:</span>
              <span>Rs. {mealFee.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Total Monthly Payable:</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                Rs. {Math.round(totalMonthly).toLocaleString()}
              </span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: 8, fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'rgba(255,255,255,0.75)' }}>Term Fee (3 Mos + Exam):</span>
                <strong>Rs. {Math.round(termTotal).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.75)' }}>Est. Annual Academic Cost:</span>
                <strong>Rs. {Math.round(annualTotal).toLocaleString()}</strong>
              </div>
            </div>

            {annualSavings > 0 && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '8px 12px', borderRadius: 6, fontSize: '0.82rem', textAlign: 'center', fontWeight: 700 }}>
                You save Rs. {Math.round(annualSavings).toLocaleString()} / year with scholarship!
              </div>
            )}

            <Link to="/contact" className="btn btn-gold btn-sm" style={{ width: '100%', marginTop: 8 }}>
              Book Admission Counseling →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
