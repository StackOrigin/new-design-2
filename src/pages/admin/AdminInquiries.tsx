import { useState } from 'react';
import { Search, Eye, X } from 'lucide-react';
import { showToast } from '../../components/ToastProvider';

type Inquiry = {
  id: number;
  studentName: string;
  grade: string;
  parentName: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  status: 'pending' | 'contacted' | 'enrolled' | 'rejected';
};

const initialInquiries: Inquiry[] = [
  { id: 1, studentName: 'Ram Bahadur Thapa', grade: 'Grade 7', parentName: 'Kamal Thapa', phone: '9841123456', email: 'kamal.thapa@email.com', message: 'Interested in enrolling my son for Grade 7.', date: '2025-01-20', status: 'pending' },
  { id: 2, studentName: 'Sita Devi Sharma', grade: 'Grade 11 — Science', parentName: 'Hari Sharma', phone: '9860234567', email: 'hari.sharma@email.com', message: 'My daughter passed SEE with GPA 3.9. Want to join science stream.', date: '2025-01-19', status: 'contacted' },
  { id: 3, studentName: 'Hari Prasad Karki', grade: 'PP / Nursery', parentName: 'Devi Karki', phone: '9855345678', email: '', message: 'Want to enroll my 4-year-old daughter.', date: '2025-01-18', status: 'enrolled' },
  { id: 4, studentName: 'Maya Kumari Rai', grade: 'Grade 9', parentName: 'Bir Rai', phone: '9812456789', email: 'birrai@email.com', message: 'Transferring from another school. Need to discuss admission requirements.', date: '2025-01-17', status: 'pending' },
  { id: 5, studentName: 'Binod Kumar Gurung', grade: 'Grade 6', parentName: 'Santosh Gurung', phone: '9845567890', email: 'santosh@email.com', message: 'Looking for a good school for my son.', date: '2025-01-16', status: 'contacted' },
  { id: 6, studentName: 'Anita Magar', grade: 'Grade 11 — Management', parentName: 'Suresh Magar', phone: '9841678901', email: 'suresh.magar@email.com', message: 'Interested in management stream after SEE.', date: '2025-01-15', status: 'pending' },
  { id: 7, studentName: 'Dipesh Tamang', grade: 'Grade 4', parentName: 'Rita Tamang', phone: '9860789012', email: '', message: 'Currently in Grade 3. Wants to transfer mid-year.', date: '2025-01-14', status: 'enrolled' },
];

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewItem, setViewItem] = useState<Inquiry | null>(null);

  const filtered = inquiries.filter(i => {
    const matchSearch = i.studentName.toLowerCase().includes(search.toLowerCase()) ||
      i.parentName.toLowerCase().includes(search.toLowerCase()) ||
      i.grade.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: number, status: Inquiry['status']) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    showToast(`Status updated to "${status}"`, 'success');
  };

  const getBadgeClass = (status: string) => {
    const map: Record<string, string> = { pending: 'badge-warning', contacted: 'badge-info', enrolled: 'badge-success', rejected: 'badge-error' };
    return `badge ${map[status]}`;
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const counts = {
    all: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    enrolled: inquiries.filter(i => i.status === 'enrolled').length,
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Admission Inquiries</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{inquiries.length} total inquiries</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search inquiries..." className="form-input" style={{ paddingLeft: 36, width: 240 }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Status Counts */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: '8px 20px', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600,
              border: '1.5px solid', cursor: 'pointer', transition: 'var(--transition)',
              background: statusFilter === status ? 'var(--primary)' : 'var(--surface)',
              color: statusFilter === status ? 'white' : 'var(--text-secondary)',
              borderColor: statusFilter === status ? 'var(--primary)' : 'var(--border)'
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
          </button>
        ))}
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Grade</th>
              <th>Parent</th>
              <th>Contact</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-title">No inquiries found</div></div></td></tr>
            ) : filtered.map(item => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{item.studentName}</div>
                </td>
                <td style={{ fontSize: '0.875rem' }}>{item.grade}</td>
                <td style={{ fontSize: '0.875rem' }}>{item.parentName}</td>
                <td>
                  <div style={{ fontSize: '0.875rem' }}>{item.phone}</div>
                  {item.email && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.email}</div>}
                </td>
                <td style={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}>{formatDate(item.date)}</td>
                <td><span className={getBadgeClass(item.status)}>{item.status}</span></td>
                <td>
                  <div className="admin-table-actions">
                    <button className="btn btn-outline btn-sm" style={{ padding: '5px 10px' }} onClick={() => setViewItem(item)}>
                      <Eye size={14} />
                    </button>
                    <select
                      value={item.status}
                      onChange={e => updateStatus(item.id, e.target.value as Inquiry['status'])}
                      className="form-select"
                      style={{ padding: '5px 8px', fontSize: '0.75rem', width: 'auto', height: 'auto' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="modal-overlay" onClick={() => setViewItem(null)}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Inquiry Details</h3>
              <button className="modal-close" onClick={() => setViewItem(null)}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Student Name', value: viewItem.studentName },
                { label: 'Applying for Grade', value: viewItem.grade },
                { label: 'Parent / Guardian', value: viewItem.parentName },
                { label: 'Phone', value: viewItem.phone },
                { label: 'Email', value: viewItem.email || 'Not provided' },
                { label: 'Submitted on', value: formatDate(viewItem.date) },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ width: 140, flexShrink: 0, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}:</span>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{f.value}</span>
                </div>
              ))}
              {viewItem.message && (
                <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '14px', borderLeft: '3px solid var(--accent)' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>MESSAGE:</div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{viewItem.message}</p>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
                <span className={getBadgeClass(viewItem.status)}>{viewItem.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
