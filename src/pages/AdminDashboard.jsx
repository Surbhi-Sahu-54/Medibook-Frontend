import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, FileText, Phone, Building, AlertCircle, Loader2, Eye } from 'lucide-react';
import api from '../api/api';

const BASE_URL = 'http://localhost:8090';

const statusColor = { PENDING: '#fbbf24', APPROVED: '#22c55e', REJECTED: '#ef4444' };
const statusBg   = { PENDING: '#fef3c7', APPROVED: '#dcfce7', REJECTED: '#fee2e2' };

// ── Doctor Card ────────────────────────────────────────────────────────────────
const DoctorCard = ({ doctor, onApprove, onReject, showActions }) => {
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [reason, setReason] = useState('');

  const handleReject = () => {
    if (!reason.trim()) return alert('Please enter a rejection reason.');
    onReject(doctor.id, reason);
    setShowRejectBox(false);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          {doctor.profilePhotoUrl
            ? <img src={`${BASE_URL}/${doctor.profilePhotoUrl}`} alt={doctor.fullName} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }} />
            : <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><User size={32} /></div>
          }
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Dr. {doctor.fullName}</h3>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: statusBg[doctor.verificationStatus], color: statusColor[doctor.verificationStatus] }}>
              {doctor.verificationStatus}
            </span>
          </div>
          <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{doctor.specialization}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>🎓 {doctor.degree}</span>
            <span>🏥 Reg# {doctor.medicalRegistrationNumber}</span>
            {doctor.hospitalName && <span><Building size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {doctor.hospitalName}</span>}
            {doctor.phone && <span><Phone size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {doctor.phone}</span>}
            {doctor.experience && <span>⏱ {doctor.experience} yrs exp</span>}
            {doctor.consultationFees && <span>💰 ₹{doctor.consultationFees}</span>}
          </div>
          {doctor.bio && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{doctor.bio}</p>}
          {doctor.adminRemark && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#991b1b', backgroundColor: '#fee2e2', padding: '0.4rem 0.7rem', borderRadius: 'var(--radius-md)' }}>Remark: {doctor.adminRemark}</p>}
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submitted: {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : '—'}</p>
        </div>

        {/* Documents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 160 }}>
          <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>Documents</p>
          {[
            { label: 'Govt ID', url: doctor.govtIdUrl },
            { label: 'Medical License', url: doctor.medicalLicenseUrl },
            { label: 'Degree Cert', url: doctor.degreeCertificateUrl },
          ].map(({ label, url }) => url ? (
            <a key={label} href={`${BASE_URL}/${url}`} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', padding: '0.3rem 0.6rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
              <Eye size={14} /> {label}
            </a>
          ) : (
            <span key={label} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.3rem 0.6rem' }}>— {label}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          {!showRejectBox ? (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => onApprove(doctor.id)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem' }}>
                <CheckCircle size={16} /> Approve
              </button>
              <button onClick={() => setShowRejectBox(true)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderColor: '#ef4444', color: '#ef4444' }}>
                <XCircle size={16} /> Reject
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Rejection Reason *</label>
                <input className="form-input" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Documents unclear or incomplete" />
              </div>
              <button onClick={handleReject} className="btn btn-primary" style={{ backgroundColor: '#ef4444', padding: '0.5rem 1rem' }}>Confirm Reject</button>
              <button onClick={() => setShowRejectBox(false)} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ══ MAIN ADMIN DASHBOARD ═══════════════════════════════════════════════════════
const AdminDashboard = () => {
  const [tab, setTab] = useState('pending');
  const [doctors, setDoctors] = useState({ pending: [], approved: [], rejected: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const fetchAll = async () => {
    setLoading(true); setError('');
    try {
      const [p, a, r] = await Promise.all([
        api.get('/auth-service/auth/admin/doctors/pending'),
        api.get('/auth-service/auth/admin/doctors/approved'),
        api.get('/auth-service/auth/admin/doctors/rejected'),
      ]);
      setDoctors({ pending: p.data, approved: a.data, rejected: r.data });
    } catch (e) {
      setError('Failed to load doctors. Is auth-service running?');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/auth-service/auth/admin/doctors/${id}/approve`);
      setActionMsg('✅ Doctor approved successfully!');
      fetchAll();
    } catch (e) { setActionMsg('❌ Failed to approve.'); }
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleReject = async (id, reason) => {
    try {
      await api.post(`/auth-service/auth/admin/doctors/${id}/reject`, { reason });
      setActionMsg('Doctor rejected.');
      fetchAll();
    } catch (e) { setActionMsg('❌ Failed to reject.'); }
    setTimeout(() => setActionMsg(''), 4000);
  };

  const tabs = [
    { key: 'pending',  label: 'Pending', count: doctors.pending.length,  color: '#fbbf24' },
    { key: 'approved', label: 'Approved', count: doctors.approved.length, color: '#22c55e' },
    { key: 'rejected', label: 'Rejected', count: doctors.rejected.length, color: '#ef4444' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          🏥 Doctor Verification Panel
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Review and manage doctor registration applications.</p>
        {/* Stats */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', backgroundColor: t.key === 'pending' ? '#fef3c7' : t.key === 'approved' ? '#dcfce7' : '#fee2e2', borderRadius: 'var(--radius-md)' }}>
              {t.key === 'pending' ? <Clock size={20} color={t.color} /> : t.key === 'approved' ? <CheckCircle size={20} color={t.color} /> : <XCircle size={20} color={t.color} />}
              <div>
                <p style={{ fontWeight: 700, fontSize: '1.25rem', color: t.color, margin: 0, lineHeight: 1 }}>{t.count}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{t.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: actionMsg.startsWith('✅') ? '#dcfce7' : '#fee2e2', color: actionMsg.startsWith('✅') ? '#166534' : '#991b1b', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
          {actionMsg}
        </div>
      )}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
          <AlertCircle size={16} />{error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', gap: '0.25rem' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: 'pointer', background: 'transparent', borderBottom: tab === t.key ? `3px solid ${t.color}` : '3px solid transparent', color: tab === t.key ? t.color : 'var(--text-muted)', transition: 'all 0.2s', marginBottom: -2 }}>
            {t.label} ({t.count})
          </button>
        ))}
        <button onClick={fetchAll} className="btn btn-outline" style={{ marginLeft: 'auto', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>🔄 Refresh</button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', padding: '2rem' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {doctors[tab].length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <FileText size={40} style={{ opacity: 0.4, marginBottom: '1rem' }} />
              <p>No {tab} doctors</p>
            </div>
          ) : (
            doctors[tab].map(d => (
              <DoctorCard key={d.id} doctor={d}
                showActions={tab === 'pending'}
                onApprove={handleApprove}
                onReject={handleReject} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
