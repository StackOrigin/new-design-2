import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Academics', path: '/academics' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'Faculty', path: '/faculty' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

const infoLinks = [
  { label: 'News', path: '/news' },
  { label: 'Events', path: '/events' },
  { label: 'Notice Board', path: '/notices' },
  { label: 'Achievements', path: '/achievements' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Downloads', path: '/downloads' },
];

const programs = [
  'Early Childhood', 'Primary School', 'Lower Secondary', 'Secondary (SEE)', 'Higher Secondary — Science', 'Higher Secondary — Management'
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">Global Academy Secondary School</div>
            <p className="footer-desc">
              Providing quality education and nurturing future leaders through academic excellence, character building, and lifelong learning since 1995.
            </p>

            {/* Newsletter */}
            <h4 className="footer-heading" style={{ marginTop: 24 }}>Stay Updated</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: 12, color: 'rgba(255,255,255,0.6)' }}>
              Subscribe to receive the latest news and announcements.
            </p>
            <div className="footer-newsletter">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>

            {/* Social */}
            <div className="footer-social">
              <a href="#" className="footer-social-icon" aria-label="Facebook">f</a>
              <a href="#" className="footer-social-icon" aria-label="Instagram">ig</a>
              <a href="#" className="footer-social-icon" aria-label="YouTube">yt</a>
              <a href="#" className="footer-social-icon" aria-label="Twitter">x</a>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map(l => <li key={l.path + l.label}><Link to={l.path}>{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Information</h4>
            <ul className="footer-links">
              {infoLinks.map(l => <li key={l.label}><Link to={l.path}>{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Programs</h4>
            <ul className="footer-links">
              {programs.map(p => <li key={p}><span>{p}</span></li>)}
            </ul>

            <h4 className="footer-heading" style={{ marginTop: 28 }}>Contact</h4>
            <ul className="footer-links">
              <li><span>Lalitpur, Nepal</span></li>
              <li><span>Tel: 01-5201144</span></li>
              <li><span>info@lalitpurglobalacademy.edu.np</span></li>
              <li><span>Sun–Fri: 9:00 AM – 4:00 PM</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} Global Academy Secondary School. All rights reserved.</p>
          <p>Excellence in Education · Lalitpur, Nepal</p>
        </div>
      </div>
    </footer>
  );
}
