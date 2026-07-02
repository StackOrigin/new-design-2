import { useState } from 'react';
import { Save, User, Lock, Globe, Bell, Eye, EyeOff } from 'lucide-react';
import { showToast } from '../../components/ToastProvider';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPass, setShowPass] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Admin User', email: 'admin@lalitpurglobalacademy.edu.np', phone: '01-5201144', role: 'Administrator'
  });
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [siteData, setSiteData] = useState({
    schoolName: 'Global Academy Secondary School', tagline: 'Secondary School', phone: '01-5201144',
    email: 'info@lalitpurglobalacademy.edu.np', address: 'Lalitpur, Nepal',
    facebook: 'https://facebook.com/lalitpurglobalacademy', instagram: '', youtube: ''
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('adminUser', JSON.stringify({ name: profileData.name, role: profileData.role }));
    showToast('Profile updated successfully!', 'success');
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.current || !passwordData.newPass) {
      showToast('Please fill all fields.', 'error'); return;
    }
    if (passwordData.newPass !== passwordData.confirm) {
      showToast('New passwords do not match.', 'error'); return;
    }
    if (passwordData.newPass.length < 6) {
      showToast('Password must be at least 6 characters.', 'error'); return;
    }
    showToast('Password updated successfully!', 'success');
    setPasswordData({ current: '', newPass: '', confirm: '' });
  };

  const handleSiteSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Site settings saved!', 'success');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'site', label: 'Site Settings', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 800 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: 4 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
            background: activeTab === tab.id ? 'var(--surface)' : 'transparent',
            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === tab.id ? 700 : 500, fontSize: '0.875rem', transition: 'var(--transition)',
            boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '36px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>
              {profileData.name[0]}
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{profileData.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{profileData.role}</p>
            </div>
          </div>
          <form onSubmit={handleProfileSave}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <input type="text" className="form-input" value={profileData.role} disabled style={{ background: 'var(--bg)', cursor: 'not-allowed' }} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={profileData.email} onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={profileData.phone} onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Profile
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '36px', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: 8, color: 'var(--primary)' }}>Change Password</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: 32 }}>
            Use a strong password with at least 8 characters, including numbers and symbols.
          </p>
          <form onSubmit={handlePasswordSave}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="Enter current password" value={passwordData.current} onChange={e => setPasswordData(p => ({ ...p, current: e.target.value }))} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" placeholder="Minimum 8 characters" value={passwordData.newPass} onChange={e => setPasswordData(p => ({ ...p, newPass: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" placeholder="Confirm new password" value={passwordData.confirm} onChange={e => setPasswordData(p => ({ ...p, confirm: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary">
              <Lock size={16} /> Update Password
            </button>
          </form>
        </div>
      )}

      {/* Site Settings Tab */}
      {activeTab === 'site' && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '36px', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: 28, color: 'var(--primary)' }}>Site Settings</h3>
          <form onSubmit={handleSiteSave}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">School Name</label>
                <input type="text" className="form-input" value={siteData.schoolName} onChange={e => setSiteData(p => ({ ...p, schoolName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input type="text" className="form-input" value={siteData.tagline} onChange={e => setSiteData(p => ({ ...p, tagline: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input type="text" className="form-input" value={siteData.phone} onChange={e => setSiteData(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input type="email" className="form-input" value={siteData.email} onChange={e => setSiteData(p => ({ ...p, email: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input type="text" className="form-input" value={siteData.address} onChange={e => setSiteData(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, marginBottom: 24 }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Social Media Links</h4>
              <div className="form-group">
                <label className="form-label">Facebook URL</label>
                <input type="url" className="form-input" value={siteData.facebook} onChange={e => setSiteData(p => ({ ...p, facebook: e.target.value }))} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Instagram URL</label>
                  <input type="url" className="form-input" placeholder="https://instagram.com/..." value={siteData.instagram} onChange={e => setSiteData(p => ({ ...p, instagram: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">YouTube URL</label>
                  <input type="url" className="form-input" placeholder="https://youtube.com/..." value={siteData.youtube} onChange={e => setSiteData(p => ({ ...p, youtube: e.target.value }))} />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Settings
            </button>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '36px', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: 28, color: 'var(--primary)' }}>Notification Preferences</h3>
          {[
            { label: 'New Admission Inquiry', desc: 'Receive notifications when a new admission inquiry is submitted.' },
            { label: 'New Contact Message', desc: 'Receive notifications for new contact form submissions.' },
            { label: 'System Alerts', desc: 'Receive important system maintenance and security alerts.' },
            { label: 'Weekly Report', desc: 'Receive weekly summary report of website activities.' },
          ].map((pref, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem', marginBottom: 4 }}>{pref.label}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{pref.desc}</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, flexShrink: 0 }}>
                <input type="checkbox" defaultChecked={i < 2} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', cursor: 'pointer', inset: 0, background: i < 2 ? 'var(--primary)' : 'var(--border)',
                  borderRadius: 12, transition: 'var(--transition)'
                }}>
                  <span style={{
                    position: 'absolute', width: 18, height: 18, left: i < 2 ? 22 : 3, top: 3,
                    background: 'white', borderRadius: '50%', transition: 'var(--transition)'
                  }} />
                </span>
              </label>
            </div>
          ))}
          <button className="btn btn-primary" style={{ marginTop: 24 }}>
            <Save size={16} /> Save Preferences
          </button>
        </div>
      )}
    </div>
  );
}
