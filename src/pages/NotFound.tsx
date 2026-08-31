import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      background: 'var(--cream)'
    }}>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(5rem, 12vw, 8rem)',
        fontWeight: 800,
        color: 'var(--gold)',
        lineHeight: 1,
        marginBottom: 10,
        textShadow: '0 10px 30px rgba(200, 159, 69, 0.2)'
      }}>
        404
      </div>
      <h1 style={{ color: 'var(--navy)', fontSize: '2rem', marginBottom: 16 }}>Page Not Found</h1>
      <p style={{ color: 'var(--gray-500)', maxWidth: 480, marginBottom: 32, fontSize: '1.05rem', lineHeight: 1.7 }}>
        The page you are searching for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-navy">Return to Home</Link>
        <Link to="/contact" className="btn btn-outline">Contact School</Link>
      </div>
    </div>
  );
}
