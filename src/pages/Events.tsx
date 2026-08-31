import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { eventsData } from '../data/schoolData';

const categories = ['All', 'Academic', 'Sports', 'Cultural', 'Examination'];

export default function Events() {
  useReveal();
  const [category, setCategory] = useState('All');
  const [rsvpEvent, setRsvpEvent] = useState<typeof eventsData[0] | null>(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const filtered = category === 'All' ? eventsData : eventsData.filter(e => e.category === category);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setRsvpEvent(null);
      setAttendeeName('');
      setAttendeePhone('');
    }, 2500);
  };

  const getGoogleCalendarUrl = (event: typeof eventsData[0]) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description} (Global Academy Secondary School)`);
    const location = encodeURIComponent(event.location);
    const cleanDate = event.date.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${cleanDate}T090000Z/${cleanDate}T130000Z&details=${details}&location=${location}`;
  };

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Events</span></nav>
          <h1 className="page-hero-title">Events & Activities</h1>
          <p className="page-hero-subtitle">Stay connected with academic competitions, sports championships, exhibitions, celebrations, and parent assemblies.</p>
        </div>
      </div>

      <section className="section section-cream">
        <div className="container">
          {/* Category Filter Bar */}
          <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 44 }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`btn btn-sm ${category === c ? 'btn-navy' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {c} {c === 'All' ? `(${eventsData.length})` : `(${eventsData.filter(e => e.category === c).length})`}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="programs-grid">
            {filtered.map((event, i) => (
              <div key={event.id} className="card reveal" style={{ padding: 30, display: 'flex', flexDirection: 'column', transitionDelay: `${i * 80}ms` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
                  <div style={{
                    width: 68, height: 68, borderRadius: 16, background: 'var(--navy)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gold-light)', fontWeight: 700, flexShrink: 0
                  }}>
                    <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{new Date(event.date).getDate()}</span>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gold)', background: 'var(--gold-pale)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                      {event.category}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', margin: '6px 0 0', color: 'var(--navy)' }}>{event.title}</h3>
                  </div>
                </div>

                <p style={{ color: 'var(--gray-500)', lineHeight: 1.7, fontSize: '0.95rem', flex: 1 }}>{event.description}</p>

                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--gray-100)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                  <span><strong>Time:</strong> {event.time}</span>
                  <span><strong>Venue:</strong> {event.location}</span>
                </div>

                <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    onClick={() => setRsvpEvent(event)}
                    className="btn btn-navy btn-sm"
                  >
                    RSVP Seat
                  </button>
                  <a
                    href={getGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                    title="Add event to your personal Google Calendar"
                  >
                    Add to Calendar
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card reveal" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-500)' }}>
              <p style={{ fontSize: '1.2rem' }}>No events found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Interactive RSVP Registration Modal */}
      {rsvpEvent && (
        <div
          onClick={() => setRsvpEvent(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 31, 58, 0.85)',
            backdropFilter: 'blur(6px)', zIndex: 99999, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff', maxWidth: 480, width: '100%',
              borderRadius: 16, padding: 32, boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setRsvpEvent(null)}
              style={{ position: 'absolute', top: 18, right: 18, fontSize: '1.4rem', color: 'var(--navy)', cursor: 'pointer' }}
            >
              ×
            </button>

            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold)' }}>
              Event Attendance RSVP
            </span>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)', margin: '6px 0 10px' }}>{rsvpEvent.title}</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', marginBottom: 20 }}>
              {rsvpEvent.date} · {rsvpEvent.time} · {rsvpEvent.location}
            </p>

            <form onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sujan Shrestha"
                  value={attendeeName}
                  onChange={e => setAttendeeName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98XXXXXXXX"
                  value={attendeePhone}
                  onChange={e => setAttendeePhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>Number of Attendees</label>
                <select
                  value={guestCount}
                  onChange={e => setGuestCount(Number(e.target.value))}
                  className="form-input"
                >
                  <option value={1}>1 Person (Myself)</option>
                  <option value={2}>2 Persons (Parent + Student)</option>
                  <option value={3}>3 Persons (Family)</option>
                  <option value={4}>4+ Persons</option>
                </select>
              </div>

              <button type="submit" className="btn btn-navy" style={{ marginTop: 8 }}>
                Confirm RSVP Registration →
              </button>
            </form>

            {rsvpSuccess && (
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: '#059669', color: '#fff', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
                Thank you {attendeeName}! Your seat for {guestCount} person(s) has been reserved.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Host Event / Inquiry Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <span className="section-eyebrow" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Event Management</span>
          <h2>Want to Organize an Event or Workshop?</h2>
          <p>We welcome inter-school collaborations, academic seminars, and cultural exchange programs.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-gold btn-lg">Contact Event Desk</Link>
          </div>
        </div>
      </section>
    </>
  );
}
