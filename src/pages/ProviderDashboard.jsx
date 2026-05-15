import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, DollarSign, Star, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/api';

const ProviderDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const updateStatus = async (appointmentId, status) => {
  try {
    await api.put(
      `/appointment-service/api/appointments/${appointmentId}/status?status=${status}`
    );

    setAppointments(prev =>
      prev.map(a =>
        a.id === appointmentId ? { ...a, status } : a
      )
    );
  } catch (err) {
    console.error('Status update failed:', err);
    alert('Failed to update appointment');
  }
};

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const doctorId = currentUser.userId;

    if (!doctorId) {
      setError('Could not load appointments: doctor session not found.');
      setLoading(false);
      return;
    }

    api.get(`/appointment-service/api/appointments/doctor/${doctorId}`)
      .then(res => setAppointments(res.data))
      .catch(err => {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments.');
      })
      .finally(() => setLoading(false));
  }, []);

  const todaysDate = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => a.appointmentDate === todaysDate);
  const confirmedToday = todaysAppointments.filter(a => a.status === 'CONFIRMED').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '50%' }}><Calendar size={24} /></div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Today's Appointments</p>
            <h3 style={{ fontSize: '1.5rem' }}>{loading ? '—' : confirmedToday}</h3>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '50%' }}><DollarSign size={24} /></div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Patients</p>
            <h3 style={{ fontSize: '1.5rem' }}>{loading ? '—' : appointments.length}</h3>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '50%' }}><Star size={24} /></div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Rating</p>
            <h3 style={{ fontSize: '1.5rem' }}>4.8/5.0</h3>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="var(--primary)" />
          All Appointments
        </h2>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', padding: '2rem 0' }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Loading appointments...
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <User size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No patient appointments yet</p>
            <p style={{ fontSize: '0.875rem' }}>Appointments booked by patients will appear here.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {appointments.map(apt => (
            <div key={apt.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
                  <User size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Patient #{apt.patientId}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{apt.reason || 'General Consultation'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="var(--text-muted)" /> {apt.appointmentTime?.substring(0, 5)}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{apt.appointmentDate}</p>
                </div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  backgroundColor: apt.status === 'CONFIRMED' ? '#dcfce7' : apt.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                  color: apt.status === 'CONFIRMED' ? '#166534' : apt.status === 'PENDING' ? '#92400e' : '#991b1b'
                }}>
                  {apt.status}
                  {apt.status === 'PENDING' && (
                   <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                   <button
                    onClick={() => updateStatus(apt.id, 'CONFIRMED')}
                    style={{
                      padding: '8px 14px',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#22c55e',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                   >
                    Confirm
                 </button>

    <button
      onClick={() => updateStatus(apt.id, 'CANCELLED')}
      style={{
        padding: '8px 14px',
        border: 'none',
        borderRadius: '8px',
        background: '#ef4444',
        color: 'white',
        cursor: 'pointer'
      }}
    >
      Reject
    </button>
  </div>
)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;


