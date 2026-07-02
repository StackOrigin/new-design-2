import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Newspaper, Calendar, Image,
  Mail, Settings, LogOut, Menu, X, Bell, ChevronRight, BookOpen
} from 'lucide-react';

const navItems = [
  {
    section: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    ]
  },
  {
    section: 'Content',
    items: [
      { icon: Newspaper, label: 'News', path: '/admin/news' },
      { icon: Calendar, label: 'Events', path: '/admin/events' },
      { icon: Image, label: 'Gallery', path: '/admin/gallery' },
    ]
  },
  {
    section: 'Inquiries',
    items: [
      { icon: BookOpen, label: 'Admissions', path: '/admin/inquiries' },
      { icon: Mail, label: 'Messages', path: '/admin/messages' },
    ]
  },
  {
    section: 'System',
    items: [
      { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ]
  }
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('news')) return 'Manage News';
    if (path.includes('events')) return 'Manage Events';
    if (path.includes('gallery')) return 'Manage Gallery';
    if (path.includes('inquiries')) return 'Admission Inquiries';
    if (path.includes('messages')) return 'Contact Messages';
    if (path.includes('settings')) return 'Settings';
    return 'Admin Panel';
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <NavLink to="/admin" className="admin-sidebar-logo">
            <div className="admin-sidebar-logo-icon">GA</div>
            <div>
              <div className="admin-sidebar-logo-text">Global Academy</div>
              <div className="admin-sidebar-logo-sub">Admin Panel</div>
            </div>
          </NavLink>
        </div>

        <nav className="admin-nav">
          {navItems.map((section) => (
            <div key={section.section} className="admin-nav-section">
              <div className="admin-nav-section-label">{section.section}</div>
              {section.items.map((item) => {
                const isActive = item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                    end={item.path === '/admin'}
                  >
                    <item.icon size={18} />
                    {item.label}
                    {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 8 }}>
            <div className="admin-user-avatar">{adminUser?.name?.[0] || 'A'}</div>
            <div>
              <div className="admin-user-name">{adminUser?.name || 'Admin'}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-nav-item" onClick={handleLogout} style={{ width: '100%', color: '#ef4444' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 99, display: 'none'
          }}
        />
      )}

      {/* Main Content */}
      <div className="admin-content">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
              className="admin-hamburger"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="admin-header-title">{getPageTitle()}</h1>
          </div>
          <div className="admin-header-user">
            <button style={{
              width: 38, height: 38, background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative', color: 'var(--text-secondary)'
            }}>
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: 8, right: 8, width: 8, height: 8,
                background: '#ef4444', borderRadius: '50%', border: '2px solid white'
              }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="admin-user-avatar">{adminUser?.name?.[0] || 'A'}</div>
              <div>
                <div className="admin-user-name">{adminUser?.name || 'Admin User'}</div>
                <div className="admin-user-role">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
