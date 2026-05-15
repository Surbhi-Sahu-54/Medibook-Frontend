import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import api from '../api/api';

const PatientDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );
    const patientId = currentUser.userId;

    if (!patientId) {
      setError('Could not load appointments: user session not found.');
      setLoading(false);
      return;
    }

    api.get(`/appointment-service/api/appointments/patient/${patientId}`)
      .then(res => setAppointments(res.data))
      .catch(err => {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="badge badge-success">
            <CheckCircle size={14} /> Confirmed
          </span>
        );

      case 'COMPLETED':
        return <span className="badge badge-neutral">Completed</span>;

      case 'CANCELLED':
        return (
          <span className="badge badge-error">
            <XCircle size={14} /> Cancelled
          </span>
        );

      case 'PENDING':
        return <span className="badge badge-warning">Pending</span>;

      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem'
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Calendar size={20} color="var(--primary)" />
          Your Appointments
        </h2>

        {loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--text-muted)',
              padding: '2rem 0'
            }}
          >
            <Loader2
              size={20}
              style={{ animation: 'spin 1s linear infinite' }}
            />
            Loading your appointments...
          </div>
        )}

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#ef4444',
              backgroundColor: '#fee2e2',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem'
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 0',
              color: 'var(--text-muted)'
            }}
          >
            <Calendar
              size={48}
              style={{
                marginBottom: '1rem',
                opacity: 0.4
              }}
            />
            <p
              style={{
                fontSize: '1.1rem',
                marginBottom: '0.5rem'
              }}
            >
              No appointments yet
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Browse doctors and book your first appointment.
            </p>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {appointments.map((apt) => {
            console.log(apt);

            return (
              <div
                key={apt.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'white'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      padding: '1rem',
                      backgroundColor: 'var(--primary-light)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--primary)'
                    }}
                  >
                    <User size={24} />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: '1.125rem',
                        marginBottom: '0.25rem'
                      }}
                    >
                      {apt.doctorName}
                    </h3>

                    <p
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem'
                      }}
                    >
                      {apt.reason || 'General Consultation'}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'center',
                    marginTop: '1rem'
                  }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <p
                      style={{
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Calendar
                        size={16}
                        color="var(--text-muted)"
                      />
                      {apt.appointmentDate}
                    </p>

                    <p
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        justifyContent: 'flex-end',
                        marginTop: '0.25rem'
                      }}
                    >
                      <Clock size={16} />
                      {apt.appointmentTime?.substring(0, 5)}
                    </p>
                  </div>

                  <div>{getStatusBadge(apt.status)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;