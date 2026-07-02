import { useState } from 'react';
import { Search, Trash2, X, Mail, MailOpen } from 'lucide-react';
import { showToast } from '../../components/ToastProvider';

type Message = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
};

const initialMessages: Message[] = [
  { id: 1, name: 'Priya Maharjan', email: 'priya.m@email.com', phone: '9841001122', subject: 'Admission Inquiry', message: 'Hello, I would like to know about the admission process for my daughter who is currently in Grade 5. Can you please guide me about the required documents and the admission timeline?', date: '2025-01-21', read: false },
  { id: 2, name: 'Rajesh Bhattarai', email: 'rajesh.b@email.com', phone: '9860223344', subject: 'Fee Structure', message: 'Could you please share the detailed fee structure for Grade 11 Science stream? We are planning to enroll our son after SEE results.', date: '2025-01-20', read: false },
  { id: 3, name: 'Sushma Khadka', email: 'sushma.k@email.com', phone: '', subject: 'Campus Tour', message: 'We would like to visit the campus this weekend. Is it possible to schedule a guided tour on Saturday morning?', date: '2025-01-19', read: true },
  { id: 4, name: 'Bikash Shrestha', email: 'bikash.s@email.com', phone: '9845334455', subject: 'Transportation', message: 'Does the school provide transportation from Lalitpur area? I need to know the bus route and monthly charges.', date: '2025-01-18', read: true },
  { id: 5, name: 'Kumari Ale', email: 'kumari.ale@email.com', phone: '9812445566', subject: 'General Inquiry', message: 'What extracurricular activities are available for Grade 7 students? My son is interested in cricket and music.', date: '2025-01-17', read: true },
  { id: 6, name: 'Mohan Lama', email: '', phone: '9841556677', subject: 'Scholarship', message: 'Are there any scholarship opportunities available for financially deserving students? My daughter scored very high in her previous school.', date: '2025-01-16', read: false },
];

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewItem, setViewItem] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = messages.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'unread' && !m.read) || (filter === 'read' && m.read);
    return matchSearch && matchFilter;
  });

  const markRead = (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const openView = (item: Message) => {
    setViewItem(item);
    markRead(item.id);
  };

  const handleDelete = (id: number) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    setDeleteId(null);
    if (viewItem?.id === id) setViewItem(null);
    showToast('Message deleted.', 'warning');
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Contact Messages
            {unreadCount > 0 && (
              <span style={{ marginLeft: 10, background: 'var(--error)', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: 'var(--radius-full)' }}>
                {unreadCount} new
              </span>
            )}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{messages.length} messages total</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search messages..." className="form-input" style={{ paddingLeft: 36, width: 240 }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'unread', 'read'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 20px', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600,
            border: '1.5px solid', cursor: 'pointer', transition: 'var(--transition)',
            background: filter === f ? 'var(--primary)' : 'var(--surface)',
            color: filter === f ? 'white' : 'var(--text-secondary)',
            borderColor: filter === f ? 'var(--primary)' : 'var(--border)'
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: viewItem ? '1fr 1.4fr' : '1fr', gap: 20 }}>
        {/* List */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 20 }}></th>
                <th>From</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">✉️</div><div className="empty-state-title">No messages found</div></div></td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} style={{ background: !item.read ? 'rgba(22,58,112,0.03)' : 'transparent', cursor: 'pointer' }} onClick={() => openView(item)}>
                  <td>
                    {item.read ? <MailOpen size={16} color="var(--text-muted)" /> : <Mail size={16} color="var(--primary)" />}
                  </td>
                  <td>
                    <div style={{ fontWeight: item.read ? 500 : 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.email || item.phone}</div>
                  </td>
                  <td style={{ fontWeight: item.read ? 400 : 600, color: item.read ? 'var(--text-secondary)' : 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {item.subject}
                  </td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>{formatDate(item.date)}</td>
                  <td>
                    <button className="btn btn-sm" style={{ padding: '5px 10px', background: 'rgba(239,68,68,0.08)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.2)' }}
                      onClick={e => { e.stopPropagation(); setDeleteId(item.id); }}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Pane */}
        {viewItem && (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '28px', position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{viewItem.subject}</h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>From: <strong style={{ color: 'var(--text-primary)' }}>{viewItem.name}</strong></div>
                {viewItem.email && <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{viewItem.email}</div>}
                {viewItem.phone && <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{viewItem.phone}</div>}
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>{formatDate(viewItem.date)}</div>
              </div>
              <button className="modal-close" onClick={() => setViewItem(null)}><X size={16} /></button>
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 24, borderLeft: '3px solid var(--accent)' }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{viewItem.message}</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {viewItem.email && (
                <a href={`mailto:${viewItem.email}`} className="btn btn-primary btn-sm">
                  <Mail size={14} /> Reply via Email
                </a>
              )}
              <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.2)' }}
                onClick={() => setDeleteId(viewItem.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteId !== null && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 380, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ marginBottom: 8 }}>Delete Message?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-sm" style={{ flex: 1, background: 'var(--error)', color: 'white' }} onClick={() => handleDelete(deleteId)}>Delete</button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
