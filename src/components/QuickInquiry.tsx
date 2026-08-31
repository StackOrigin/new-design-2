import { useState } from 'react';

export default function QuickInquiry() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendWhatsApp = () => {
    const text = customMsg || 'Hello Global Academy! I would like to inquire about admissions.';
    const waUrl = `https://wa.me/9779800000000?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {isOpen && (
        <div
          style={{
            position: 'absolute', bottom: 70, right: 0, width: 320,
            background: '#ffffff', borderRadius: 16, boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            overflow: 'hidden', border: '1px solid rgba(200,159,69,0.3)', animation: 'fadeInUp 0.3s ease'
          }}
        >
          <div style={{ background: 'var(--navy)', color: '#ffffff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Admissions Desk</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>Online · Direct Admissions Desk</div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.4rem', cursor: 'pointer' }}>
              ×
            </button>
          </div>

          <div style={{ padding: 20 }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--charcoal)', lineHeight: 1.6, marginBottom: 16 }}>
              Welcome to Global Academy. Send us a quick inquiry to ask about admissions, seat availability, or book a campus tour.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)' }}>Quick Inquiries:</span>
              {[
                'Admissions criteria for Grade 11 (+2 Science)',
                'Available seats for Pre-Primary / Nursery',
                'Schedule a personal campus tour this week',
                'Tuition fee and scholarship criteria'
              ].map((msg, i) => (
                <button
                  key={i}
                  onClick={() => setCustomMsg(msg)}
                  style={{
                    textAlign: 'left', background: 'var(--cream)', border: '1px solid rgba(15,31,58,0.08)',
                    borderRadius: 8, padding: '8px 12px', fontSize: '0.82rem', color: 'var(--navy)',
                    cursor: 'pointer', transition: 'var(--transition)'
                  }}
                >
                  {msg}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              placeholder="Or type custom question..."
              value={customMsg}
              onChange={e => setCustomMsg(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.85rem', marginBottom: 12, width: '100%' }}
            />

            <button
              onClick={handleSendWhatsApp}
              className="btn btn-navy"
              style={{ width: '100%', fontSize: '0.88rem', padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}
            >
              Start Direct Inquiry
            </button>
          </div>
          
          {sent && (
            <div style={{ padding: '8px', background: '#059669', color: '#fff', fontSize: '0.8rem', textAlign: 'center', fontWeight: 600 }}>
              Opening WhatsApp...
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 54, height: 54, borderRadius: '50%', background: 'var(--navy)',
          color: 'var(--gold-light)', border: '2px solid var(--gold)',
          boxShadow: '0 8px 24px rgba(15, 31, 58, 0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          fontSize: isOpen ? '1.5rem' : '1rem', fontWeight: 700,
          transition: 'transform 0.2s ease'
        }}
        aria-label="Open Admissions Inquiry"
      >
        {isOpen ? '×' : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>
    </div>
  );
}
