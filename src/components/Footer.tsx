import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div className="footer-brand">
                <img src="/images/logo.jpg" alt="Global Academy Logo" className="footer-brand-img" />
                <div>
                  <div className="footer-brand-name">Global Academy</div>
                  <div className="footer-brand-tagline">Secondary School</div>
                </div>
              </div>
              <p className="footer-desc">
                Providing quality education and nurturing future leaders.
                We believe in holistic development — academic excellence, character building,
                and lifelong learning.
              </p>
              <div className="footer-social">
                <a href="#" className="social-btn" aria-label="Facebook">f</a>
                <a href="#" className="social-btn" aria-label="Instagram">in</a>
                <a href="#" className="social-btn" aria-label="YouTube">yt</a>
                <a href="#" className="social-btn" aria-label="Twitter">tw</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">→ Home</Link></li>
                <li><Link to="/about" className="footer-link">→ About Us</Link></li>
                <li><Link to="/academics" className="footer-link">→ Academics</Link></li>
                <li><Link to="/admissions" className="footer-link">→ Admissions</Link></li>
                <li><Link to="/facilities" className="footer-link">→ Facilities</Link></li>
                <li><Link to="/news" className="footer-link">→ News & Events</Link></li>
                <li><Link to="/gallery" className="footer-link">→ Gallery</Link></li>
                <li><Link to="/contact" className="footer-link">→ Contact</Link></li>
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="footer-heading">Programs</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">→ Early Childhood (ECD)</a></li>
                <li><a href="#" className="footer-link">→ Primary School (1–5)</a></li>
                <li><a href="#" className="footer-link">→ Lower Secondary (6–8)</a></li>
                <li><a href="#" className="footer-link">→ Secondary (9–10)</a></li>
                <li><a href="#" className="footer-link">→ Higher Secondary (11–12)</a></li>
                <li><a href="#" className="footer-link">→ Science Stream</a></li>
                <li><a href="#" className="footer-link">→ Management Stream</a></li>
                <li><Link to="/admissions" className="footer-link">→ Apply for Admission</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="footer-heading">Contact Us</h4>
              <div>
                <div className="footer-contact-item">
                  <div className="footer-contact-icon"><MapPin size={16} /></div>
                  <div className="footer-contact-text">
                    Lalitpur, Nepal<br />
                    Bagmati Province, Nepal
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-icon"><Phone size={16} /></div>
                  <div className="footer-contact-text">
                    01-5201144
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-icon"><Mail size={16} /></div>
                  <div className="footer-contact-text">
                    info@lalitpurglobalacademy.edu.np
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-icon"><Clock size={16} /></div>
                  <div className="footer-contact-text">
                    Sun–Fri: 9:00 AM – 4:00 PM<br />
                    Sat: Closed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              © {year} Global Academy Secondary School. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <a href="#" className="footer-bottom-link">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}