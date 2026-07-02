import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Phone, Mail, ChevronRight } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Academics', path: '/academics' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'News & Events', path: '/news' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-links">
            <div className="topbar-item">
              <Phone size={13} />
              <span>01-5201144</span>
            </div>
            <div className="topbar-item">
              <Mail size={13} />
              <span>info@lalitpurglobalacademy.edu.np</span>
            </div>
          </div>
          <div className="topbar-links">
            <Link to="/admissions" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8125rem' }}>Apply Now</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8125rem' }}>Admin Login</Link>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img src="/images/logo.jpg" alt="Global Academy Logo" className="navbar-logo-img" />
            <div className="navbar-logo-text">
              <span className="navbar-logo-name">Global Academy</span>
              <span className="navbar-logo-tagline">Secondary School</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="navbar-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="navbar-actions">
            <Link to="/admissions" className="btn btn-accent btn-sm" style={{ display: 'flex' }}>
              Apply Now
            </Link>
            <button
              className={`hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {link.label}
              <ChevronRight size={16} />
            </div>
          </NavLink>
        ))}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            to="/admissions"
            className="btn btn-accent w-full"
            onClick={() => setMobileOpen(false)}
          >
            Apply for Admission
          </Link>
          <Link
            to="/login"
            className="btn btn-outline w-full"
            onClick={() => setMobileOpen(false)}
          >
            Admin Login
          </Link>
        </div>
        <div style={{ marginTop: 20, padding: '16px 0', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <Phone size={14} />
              01-5201144
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <Mail size={14} />
              info@lalitpurglobalacademy.edu.np
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: 'calc(var(--nav-height) + 37px)' }}></div>
    </>
  );
}