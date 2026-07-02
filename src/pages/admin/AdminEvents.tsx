import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { eventsData as initialEvents } from '../../services/mockData';
import { showToast } from '../../components/ToastProvider';

type EventItem = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  upcoming: boolean;
};

const categories = ['Academic', 'Sports', 'Cultural', 'Examination', 'General'];

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents as EventItem[]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<EventItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '', date: new Date().toISOString().split('T')[0], time: '9:00 AM',
    location: '', category: categories[0], description: '', upcoming: true
  });

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditItem(null);
    setFormData({ title: '', date: new Date().toISOString().split('T')[0], time: '9:00 AM', location: '', category: categories[0], description: '', upcoming: true });
    setShowModal(true);
  };

  const openEdit = (item: EventItem) => {
    setEditItem(item);
    setFormData({ title: item.title, date: item.date, time: item.time, location: item.location, category: item.category, description: item.description, upcoming: item.upcoming });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.location) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    if (editItem) {
      setEvents(prev => prev.map(e => e.id === editItem.id ? { ...e, ...formData } : e));
      showToast('Event updated successfully!', 'success');
    } else {
      setEvents(prev => [{ id: Date.now(), ...formData }, ...prev]);
      showToast('Event added successfully!', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setDeleteId(null);
    showToast('Event deleted.', 'warning');
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Manage Events</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{events.length} events total</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search events..." className="form-input" style={{ paddingLeft: 36, width: 220 }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Event</button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-title">No events found</div></div></td></tr>
            ) : filtered.map(item => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.description.slice(0, 60)}...</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{formatDate(item.date)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</div>
                </td>
                <td>{item.location}</td>
                <td><span className="badge badge-info">{item.category}</span></td>
                <td>
                  <div className="admin-table-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)} style={{ padding: '6px 12px' }}><Edit2 size={14} /></button>
                    <button className="btn btn-sm" style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.08)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.2)' }} onClick={() => setDeleteId(item.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editItem ? 'Edit Event' : 'Add New Event'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input type="text" className="form-input" placeholder="Event title" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input type="text" className="form-input" placeholder="9:00 AM – 5:00 PM" value={formData.time} onChange={e => setFormData(p => ({ ...p, time: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input type="text" className="form-input" placeholder="Event venue" value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Event description..." rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>{editItem ? 'Update Event' : 'Add Event'}</button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 380, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ marginBottom: 8 }}>Delete Event?</h3>
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
