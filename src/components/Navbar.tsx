import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import QuickSearch from './QuickSearch';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Academics', path: '/academics' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Facilities', path: '/facilities' },
  {
    label: 'Information',
    path: '/news',
    children: [
      { label: 'News', path: '/news' },
      { label: 'Events', path: '/events' },
      { label: 'Notice Board', path: '/notices' },
      { label: 'Achievements', path: '/achievements' },
      { label: 'Testimonials', path: '/testimonials' },
      { label: 'Downloads', path: '/downloads' }
    ]
  },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <QuickSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header className="site-header">
        <div className="topbar">
          <div className="container topbar-inner">
            <div className="topbar-links">
              <span>Tel: 01-5201144</span>
              <span>info@lalitpurglobalacademy.edu.np</span>
              <span>Sun–Fri: 9:00 AM – 4:00 PM</span>
            </div>
            <div className="topbar-links">
              <Link to="/notices">Notices</Link>
              <Link to="/admissions">Admissions 2025–26</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>

        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="navbar-inner">
            <Link to="/" className="navbar-logo">
              <img src="/images/logo.jpg" alt="Global Academy" className="navbar-logo-img" />
              <div>
                <span className="navbar-logo-name">Global Academy</span>
                <span className="navbar-logo-tagline">Secondary School</span>
              </div>
            </Link>

            <nav className="navbar-nav">
              {navItems.map(item =>
                item.children ? (
                  <div
                    key={item.label}
                    className="nav-dropdown"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <NavLink to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                      {item.label} <ChevronDown size={14} />
                    </NavLink>
                    {openDropdown === item.label && (
                      <div className="dropdown-menu">
                        {item.children.map(child => (
                          <Link key={child.path} to={child.path} className="dropdown-item">{child.label}</Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    {item.label}
                  </NavLink>
                )
              )}
            </nav>

            <div className="navbar-actions">
              <button
                onClick={() => setSearchOpen(true)}
                className="btn btn-sm btn-outline"
                style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                title="Quick search (Cmd+K)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span>Search</span>
              </button>
              <Link to="/admissions" className="btn btn-gold btn-sm">Apply Now</Link>
              <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--gray-100)', marginBottom: 12 }}>
          <button
            onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Search Pages & Notices...</span>
          </button>
        </div>
        {navItems.map(item =>
          item.children ? (
            <div key={item.label} style={{ borderBottom: '1px solid var(--gray-100)' }}>
              <div style={{ padding: '14px 0', fontWeight: 700, color: 'var(--navy)' }}>{item.label}</div>
              <div style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column' }}>
                {item.children.map(child => (
                  <Link key={child.path} to={child.path} className="mobile-nav-link" style={{ fontSize: '1rem' }} onClick={() => setMobileOpen(false)}>{child.label}</Link>
                ))}
              </div>
            </div>
          ) : (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              {item.label}
            </NavLink>
          )
        )}
      </div>

      <div className="site-header-spacer" aria-hidden="true"></div>
    </>
  );
}
