import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '40px 24px', textAlign: 'center'
    }}>
      <div>
        <div style={{ fontSize: '8rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1, opacity: 0.08, marginBottom: -40 }}>
          404
        </div>
        <div style={{ fontSize: '6rem', marginBottom: 24 }}>🏫</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 12 }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => window.history.back()} className="btn btn-outline btn-lg">
            <ArrowLeft size={18} /> Go Back
          </button>
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={18} /> Go Home
          </Link>
        </div>
        <div style={{ marginTop: 60 }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            Looking for something specific?
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Admissions', path: '/admissions' },
              { label: 'Academics', path: '/academics' },
              { label: 'News', path: '/news' },
              { label: 'Contact', path: '/contact' },
            ].map((link) => (
              <Link key={link.path} to={link.path} style={{
                padding: '8px 20px', background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)', fontSize: '0.875rem', color: 'var(--primary)',
                fontWeight: 500, transition: 'var(--transition)', textDecoration: 'none'
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
