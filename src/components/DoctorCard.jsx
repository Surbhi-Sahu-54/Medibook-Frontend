import React from 'react';
import { Star, Clock, MapPin, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <img 
        src={doctor.image || `https://ui-avatars.com/api/?name=${doctor.name.replace('Dr. ', '')}&background=eff6ff&color=2563eb&size=200`} 
        alt={doctor.name} 
        className="doctor-image"
      />
      <div className="doctor-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 className="doctor-name" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{doctor.name}</h3>
        <p className="doctor-specialty" style={{ color: 'var(--primary)', fontWeight: '500', marginBottom: '1rem' }}>{doctor.specialty}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <GraduationCap size={16} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doctor.qualification || 'MBBS, MD'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <Clock size={16} />
            <span>{doctor.experience || '5'} Yrs Exp</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <MapPin size={16} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doctor.clinicAddress || 'City Hospital'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#fef3c7', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: '#92400e', fontWeight: '500' }}>
              <Star size={14} fill="currentColor" />
              <span>{doctor.rating || '4.8'}</span>
            </div>
            <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1rem' }}>
              ₹{doctor.fee || '500'}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
          <Link to={`/doctor/${doctor.id || 1}`} state={{ doctor }} className="btn btn-outline" style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem' }}>
            Profile
          </Link>
          <Link to={`/checkout/${doctor.id || 1}`} state={{ doctor }} className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem' }}>
            Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
