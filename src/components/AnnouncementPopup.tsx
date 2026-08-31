import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { announcementData } from '../data/schoolData';

export default function AnnouncementPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!announcementData.active) return;
    const dismissed = sessionStorage.getItem('announcement-dismissed');
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('announcement-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={dismiss}>
      <div className="popup-modal" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={dismiss} aria-label="Close">×</button>

        <div className="popup-image">
          <img src={announcementData.image} alt="" />
          <div className="popup-image-overlay" />
        </div>

        <div className="popup-body">
          <span className="section-eyebrow" style={{ marginBottom: 10 }}>Official Notice</span>
          <h2 className="popup-title">{announcementData.title}</h2>
          <p className="popup-subtitle">{announcementData.subtitle}</p>
          <p className="popup-desc">{announcementData.description}</p>
          <Link to={announcementData.ctaLink} className="btn btn-gold" onClick={dismiss}>
            {announcementData.ctaText} →
          </Link>
        </div>
      </div>
    </div>
  );
}
