import { Link } from 'react-router-dom';
import {
  Newspaper, Calendar, Image, Mail, BookOpen,
  TrendingUp, ArrowRight, Eye, Users
} from 'lucide-react';
import { newsData, eventsData } from '../../services/mockData';

const statsCards = [
  { label: 'Total News', value: 6, icon: Newspaper, color: '#2E5AAC', bg: 'rgba(46,90,172,0.08)', change: '+2 this month' },
  { label: 'Upcoming Events', value: 6, icon: Calendar, color: '#D4A017', bg: 'rgba(212,160,23,0.08)', change: '3 this week' },
  { label: 'Gallery Photos', value: 9, icon: Image, color: '#22C55E', bg: 'rgba(34,197,94,0.08)', change: '+5 this month' },
  { label: 'New Inquiries', value: 12, icon: BookOpen, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', change: '5 pending' },
  { label: 'Contact Messages', value: 8, icon: Mail, color: '#163A70', bg: 'rgba(22,58,112,0.08)', change: '3 unread' },
  { label: 'Total Students', value: 2500, icon: Users, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', change: '+45 this year' },
  { label: 'Site Visits', value: 1240, icon: Eye, color: '#059669', bg: 'rgba(5,150,105,0.08)', change: '+12% this week' },
  { label: 'Pass Rate', value: '98%', icon: TrendingUp, color: '#D4A017', bg: 'rgba(212,160,23,0.08)', change: '↑ from 96%' },
];

const recentInquiries = [
  { name: 'Ram Bahadur Thapa', grade: 'Grade 7', phone: '9841xxxxxx', date: '2025-01-20', status: 'pending' },
  { name: 'Sita Devi Sharma', grade: 'Grade 11 — Science', phone: '9860xxxxxx', date: '2025-01-19', status: 'contacted' },
  { name: 'Hari Prasad Karki', grade: 'PP / Nursery', phone: '9855xxxxxx', date: '2025-01-18', status: 'enrolled' },
  { name: 'Maya Kumari Rai', grade: 'Grade 9', phone: '9812xxxxxx', date: '2025-01-17', status: 'pending' },
  { name: 'Binod Kumar Gurung', grade: 'Grade 6', phone: '9845xxxxxx', date: '2025-01-16', status: 'contacted' },
];

export default function Dashboard() {
  const recentNews = newsData.slice(0, 4);
  const upcomingEvents = eventsData.slice(0, 3);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'badge-warning',
      contacted: 'badge-info',
      enrolled: 'badge-success',
    };
    return `badge ${map[status] || 'badge-info'}`;
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        borderRadius: 'var(--radius-lg)', padding: '28px 32px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
      }}>
        <div>
          <h2 style={{ color: 'white', fontSize: '1.375rem', fontWeight: 700, marginBottom: 4 }}>
            Good morning, Admin! 👋
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem' }}>
            Welcome to Global Academy Admin Panel. Here's your overview for today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/news" className="btn btn-accent btn-sm">
            + Add News
          </Link>
          <Link to="/" target="_blank" className="btn btn-outline-white btn-sm">
            <Eye size={14} /> View Site
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {statsCards.slice(0, 4).map((stat, i) => (
          <div key={i} className="dashboard-stat-card">
            <div className="dashboard-stat-icon" style={{ background: stat.bg }}>
              <stat.icon size={22} color={stat.color} />
            </div>
            <div className="dashboard-stat-number">{stat.value}</div>
            <div className="dashboard-stat-label">{stat.label}</div>
            <div className="dashboard-stat-change up">
              <TrendingUp size={12} />
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {statsCards.slice(4).map((stat, i) => (
          <div key={i} className="dashboard-stat-card">
            <div className="dashboard-stat-icon" style={{ background: stat.bg }}>
              <stat.icon size={22} color={stat.color} />
            </div>
            <div className="dashboard-stat-number">{stat.value}</div>
            <div className="dashboard-stat-label">{stat.label}</div>
            <div className="dashboard-stat-change up">
              <TrendingUp size={12} />
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Recent Inquiries */}
        <div className="admin-table-container">
          <div className="admin-table-header">
            <span className="admin-table-title">Recent Admission Inquiries</span>
            <Link to="/admin/inquiries" className="btn btn-outline btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((inq, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{inq.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inq.phone}</div>
                  </td>
                  <td>{inq.grade}</td>
                  <td>{formatDate(inq.date)}</td>
                  <td><span className={getStatusBadge(inq.status)}>{inq.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Upcoming Events */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>Upcoming Events</span>
              <Link to="/admin/events" style={{ fontSize: '0.8125rem', color: 'var(--secondary)' }}>View All</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcomingEvents.map((event, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: 42, height: 42, background: 'var(--primary)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
                      {new Date(event.date).getDate()}
                    </div>
                    <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>{event.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem', marginBottom: 16 }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: '+ Publish News', path: '/admin/news', color: 'var(--primary)' },
                { label: '+ Add Event', path: '/admin/events', color: 'var(--secondary)' },
                { label: '+ Upload Photos', path: '/admin/gallery', color: '#22c55e' },
                { label: '📧 Check Messages', path: '/admin/messages', color: 'var(--accent)' },
              ].map((action, i) => (
                <Link key={i} to={action.path}
                  style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, color: action.color, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'var(--transition)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(22,58,112,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent News */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <span className="admin-table-title">Recent News Articles</span>
          <Link to="/admin/news" className="btn btn-outline btn-sm">
            Manage News <ArrowRight size={14} />
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentNews.map((news) => (
              <tr key={news.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem', maxWidth: 300 }}>{news.title}</div>
                </td>
                <td>{news.category}</td>
                <td>{formatDate(news.date)}</td>
                <td>
                  <span className={`badge ${news.featured ? 'badge-success' : 'badge-info'}`}>
                    {news.featured ? 'Featured' : 'Published'}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <Link to="/admin/news" className="btn btn-outline btn-sm" style={{ padding: '5px 12px' }}>Edit</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* System Status */}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px', marginTop: 24 }}>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, fontSize: '0.9375rem' }}>System Status</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Website', status: 'Online', ok: true },
            { label: 'Database', status: 'Connected', ok: true },
            { label: 'Email Service', status: 'Active', ok: true },
            { label: 'Storage', status: '64% Used', ok: true },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.ok ? 'var(--success)' : 'var(--error)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.label}</div>
                <div style={{ fontSize: '0.75rem', color: s.ok ? 'var(--success)' : 'var(--error)' }}>{s.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
