import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { newsData as initialNews } from '../../services/mockData';
import { showToast } from '../../components/ToastProvider';

type NewsItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  featured: boolean;
  author: string;
};

const categories = ['Academic Achievement', 'Events', 'Infrastructure', 'Sports', 'Admissions', 'General'];

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>(initialNews as NewsItem[]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '', category: categories[0], date: new Date().toISOString().split('T')[0],
    excerpt: '', content: '', image: '/images/classroom.jpg', featured: false
  });

  const filtered = news.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditItem(null);
    setFormData({ title: '', category: categories[0], date: new Date().toISOString().split('T')[0], excerpt: '', content: '', image: '/images/classroom.jpg', featured: false });
    setShowModal(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditItem(item);
    setFormData({ title: item.title, category: item.category, date: item.date, excerpt: item.excerpt, content: item.content, image: item.image, featured: item.featured });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.excerpt) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    if (editItem) {
      setNews(prev => prev.map(n => n.id === editItem.id ? { ...n, ...formData } : n));
      showToast('News article updated successfully!', 'success');
    } else {
      const newItem: NewsItem = { id: Date.now(), ...formData, author: 'Admin' };
      setNews(prev => [newItem, ...prev]);
      showToast('News article published!', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setNews(prev => prev.filter(n => n.id !== id));
    setDeleteId(null);
    showToast('News article deleted.', 'warning');
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Manage News</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{news.length} articles total</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search news..." className="form-input" style={{ paddingLeft: 36, width: 220 }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add News
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5}>
                <div className="empty-state">
                  <div className="empty-state-icon">📰</div>
                  <div className="empty-state-title">No news found</div>
                </div>
              </td></tr>
            ) : filtered.map(item => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={item.image} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem', maxWidth: 280 }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.excerpt.slice(0, 70)}...</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-info">{item.category}</span></td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatDate(item.date)}</td>
                <td>
                  <span className={`badge ${item.featured ? 'badge-success' : ''}`} style={{ background: item.featured ? '' : 'var(--bg)', color: item.featured ? '' : 'var(--text-muted)' }}>
                    {item.featured ? '⭐ Featured' : 'Normal'}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)} style={{ padding: '6px 12px' }}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-sm" style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.08)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.2)' }}
                      onClick={() => setDeleteId(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 660 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editItem ? 'Edit News Article' : 'Publish New Article'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input type="text" className="form-input" placeholder="Article title" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Excerpt *</label>
              <textarea className="form-textarea" placeholder="Short description..." rows={2} value={formData.excerpt} onChange={e => setFormData(p => ({ ...p, excerpt: e.target.value }))} style={{ minHeight: 70 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea className="form-textarea" placeholder="Full article content..." rows={5} value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input type="text" className="form-input" value={formData.image} onChange={e => setFormData(p => ({ ...p, image: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
              <label htmlFor="featured" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>Mark as Featured</label>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>{editItem ? 'Update Article' : 'Publish Article'}</button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ marginBottom: 8 }}>Delete Article?</h3>
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
