import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { showToast } from '../components/ToastProvider';
import ToastProvider from '../components/ToastProvider';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    // Demo credentials
    if (formData.username === 'admin' && formData.password === 'admin123') {
      localStorage.setItem('adminToken', 'demo-token-12345');
      localStorage.setItem('adminUser', JSON.stringify({ name: 'Admin User', role: 'administrator' }));
      showToast('Welcome back, Admin!', 'success');
      setTimeout(() => navigate('/admin'), 500);
    } else {
      setError('Invalid username or password. Try: admin / admin123');
    }
    setLoading(false);
  };

  return (
    <>
      <ToastProvider />
      <div className="auth-page" style={{ minHeight: '100vh' }}>
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-logo">SA</div>
            <h1 className="auth-school-name">Global Academy Secondary School</h1>
            <p className="auth-school-desc">
              Excellence in Education since 1995.<br />
              Admin Portal — Manage your school content securely.
            </p>
            <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: Shield, text: 'Secure JWT Authentication' },
                { icon: Lock, text: 'Role-based Access Control' },
                { icon: User, text: 'Admin-only Dashboard Access' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.75)' }}>
                  <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <item.icon size={16} color="var(--accent)" />
                  </div>
                  <span style={{ fontSize: '0.9375rem' }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 60, padding: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 300 }}>
              <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Demo Credentials
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                Username: <strong style={{ color: 'var(--accent)' }}>admin</strong><br />
                Password: <strong style={{ color: 'var(--accent)' }}>admin123</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-form-container">
            <div style={{ marginBottom: 32 }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
                <div style={{ width: 38, height: 38, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 800, fontSize: '0.875rem' }}>
                  SA
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9375rem' }}>Global Academy Secondary School</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin Portal</div>
                </div>
              </Link>
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Sign in to your administrator account</p>
            </div>

            <div className="auth-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      name="username"
                      className="form-input"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={handleChange}
                      style={{ paddingLeft: 44 }}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      className="form-input"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ paddingLeft: 44, paddingRight: 44 }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 16, fontSize: '0.875rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    ⚠️ {error}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, marginTop: 4 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                    Remember me
                  </label>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full btn-lg"
                  disabled={loading}
                  style={{ justifyContent: 'center' }}
                >
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Signing In...
                    </div>
                  ) : (
                    <>Sign In <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  ← Back to Main Website
                </Link>
              </div>
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <Shield size={14} />
                Protected by JWT authentication
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
