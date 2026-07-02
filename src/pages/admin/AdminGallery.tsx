import { useState } from 'react';
import { Plus, Trash2, X, Search, Upload } from 'lucide-react';
import { galleryData as initialGallery } from '../../services/mockData';
import { showToast } from '../../components/ToastProvider';

type GalleryItem = { id: number; title: string; category: string; image: string; };

const categories = ['Campus', 'Facilities', 'Sports', 'Events', 'Celebrations', 'Academic'];

export default function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery as GalleryItem[]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', category: categories[0], image: '' });

  const filtered = gallery.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.title || !formData.image) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    setGallery(prev => [{ id: Date.now(), ...formData }, ...prev]);
    showToast('Photo added to gallery!', 'success');
    setFormData({ title: '', category: categories[0], image: '' });
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    setDeleteId(null);
    showToast('Photo removed from gallery.', 'warning');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Manage Gallery</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{gallery.length} photos total</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search photos..." className="form-input" style={{ paddingLeft: 36, width: 220 }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Upload Photo</button>
        </div>
      </div>

      {/* Category filter */}
      <div className="gallery-tabs" style={{ marginBottom: 32 }}>
        <button className="gallery-tab active">All ({gallery.length})</button>
        {categories.map(c => (
          <button key={c} className="gallery-tab">{c} ({gallery.filter(g => g.category === c).length})</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {filtered.map(item => (
          <div key={item.id} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', transition: 'var(--transition)' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div style={{ position: 'relative' }}>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} loading="lazy" />
              <button
                onClick={() => setDeleteId(item.id)}
                style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, background: 'rgba(239,68,68,0.9)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: 4 }}>{item.title}</div>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{item.category}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🖼️</div>
          <div className="empty-state-title">No photos found</div>
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Upload Photo</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center', marginBottom: 20, cursor: 'pointer', background: 'var(--bg)' }}>
              <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Click to upload or drag & drop</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>PNG, JPG, WEBP (max 5MB)</div>
            </div>
            <div className="form-group">
              <label className="form-label">Or enter Image URL *</label>
              <input type="text" className="form-input" placeholder="https://... or /images/..." value={formData.image} onChange={e => setFormData(p => ({ ...p, image: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input type="text" className="form-input" placeholder="Photo title" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {formData.image && (
              <div style={{ marginBottom: 20 }}>
                <img src={formData.image} alt="Preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Add to Gallery</button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 380, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ marginBottom: 8 }}>Remove Photo?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-sm" style={{ flex: 1, background: 'var(--error)', color: 'white' }} onClick={() => handleDelete(deleteId)}>Remove</button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
