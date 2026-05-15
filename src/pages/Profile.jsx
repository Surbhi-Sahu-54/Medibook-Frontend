import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, Stethoscope, MapPin, Award, Clock } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', minHeight: 'calc(100vh - 5rem)' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{user.name}</h1>
            <p style={{ color: 'var(--primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user.role === 'DOCTOR' ? <Stethoscope size={18} /> : <User size={18} />}
              {user.role === 'DOCTOR' ? user.specialization || 'Doctor' : 'Patient'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Personal Information</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                <Mail size={18} /> <span>{user.email}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                <Phone size={18} /> <span>{user.phone || 'Not provided'}</span>
              </li>
              {user.role === 'PATIENT' && (
                <>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                    <Calendar size={18} /> <span>Age: {user.age || 'Not provided'}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                    <User size={18} /> <span>Gender: {user.gender || 'Not provided'}</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {user.role === 'DOCTOR' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Professional Information</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                  <Award size={18} /> <span>{user.qualification} • {user.experience} Years Exp.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                  <MapPin size={18} /> <span>{user.clinicName}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                  <Clock size={18} /> <span>{user.availableDays} ({user.availableTime})</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
