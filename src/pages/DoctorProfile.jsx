import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Award, GraduationCap, AlertCircle } from 'lucide-react';
import api from '../api/api';
import { getCatalogDoctorById } from '../data/doctors';

const normalizeDoctor = (data, fallbackId) => {
  if (!data) return null;

  return {
    ...data,
    id: data.id || fallbackId,
    fullName: data.fullName || data.name || 'Doctor profile',
    specialization: data.specialization || data.specialty || 'Specialization not provided',
    qualification: data.qualification || data.degree || 'Qualification not provided',
    experience: data.experience || '0',
    hospitalName: data.hospitalName || data.clinicAddress || data.hospital || 'Clinic not provided',
    clinicAddress: data.clinicAddress || data.hospitalName || data.hospital || 'Clinic address not provided',
    consultationFees: data.consultationFees ?? data.fee ?? '500',
    availableDays: data.availableDays || 'Availability not provided',
    bio:
      data.bio ||
      `${data.fullName || data.name || 'This doctor'} provides ${data.specialization || data.specialty || 'medical'} consultations through MediBook.`,
    imageUrl:
      data.imageUrl ||
      data.image ||
      (data.profilePhotoUrl ? `http://localhost:8090/${data.profilePhotoUrl}` : ''),
  };
};

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const routeDoctor = location.state?.doctor;

  const [doctor, setDoctor] = useState(() =>
    normalizeDoctor(routeDoctor || getCatalogDoctorById(doctorId), doctorId)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;
    const catalogDoctor = routeDoctor || getCatalogDoctorById(doctorId);

    if (catalogDoctor) {
      setDoctor(normalizeDoctor(catalogDoctor, doctorId));
      setError('');
      setIsLoading(false);
      return;
    }

    const fetchDoctor = async () => {
      setIsLoading(true);
      setError('');
      console.log('[DoctorProfile] Fetching doctor details', { doctorId });

      try {
        const response = await api.get(`/auth-service/auth/doctors/${doctorId}`);
        if (!isActive) return;

        const data = response.data;
        console.log('[DoctorProfile] Doctor response received', data);
        setDoctor(normalizeDoctor(data, doctorId));
      } catch (err) {
        if (!isActive) return;

        const message =
          err.response?.status === 404
            ? 'Doctor profile was not found.'
            : err.response?.data?.message ||
              err.message ||
              'Unable to load doctor profile right now.';

        console.error('[DoctorProfile] Failed to load doctor profile', {
          doctorId,
          status: err.response?.status,
          message,
          error: err,
        });
        setDoctor(null);
        setError(message);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchDoctor();

    return () => {
      isActive = false;
    };
  }, [doctorId, routeDoctor]);

  if (isLoading) {
    return <div style={{ padding: '3rem 1.5rem' }}>Loading doctor profile...</div>;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#b91c1c', backgroundColor: '#fee2e2', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }
  const reviews = [
    { id: 1, user: 'Amit S.', rating: 5, date: '2026-04-15', comment: 'Excellent doctor. Very patient and explains everything clearly.' },
    { id: 2, user: 'Priya M.', rating: 4, date: '2026-04-02', comment: 'Good experience, but had to wait for 20 minutes.' }
  ];
  return (
    <div style={{ padding: '3rem 0', backgroundColor: 'var(--background)', minHeight: 'calc(100vh - 5rem)' }}>
      <div className="container">
        
        {/* Profile Header */}
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          <img 
            src={doctor.imageUrl || `https://ui-avatars.com/api/?name=${doctor.fullName}&background=eff6ff&color=2563eb&size=200`} 
            alt={doctor?.fullName} 
            style={{ width: '150px', height: '150px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{doctor?.fullName}</h1>
                <p style={{ color: 'var(--primary)', fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>{doctor?.specialization}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <GraduationCap size={18} />
                    <span>{doctor?.qualification}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Award size={18} />
                    <span>{doctor?.experience} Years Experience</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <MapPin size={18} />
                    <span>{doctor?.hospitalName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Star size={18} color="#fbbf24" fill="#fbbf24" />
                    <span>{doctor?.rating || 'Not rated yet'}{doctor?.reviewsCount ? ` (${doctor.reviewsCount} reviews)` : ''}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', minWidth: '250px' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: '500', marginBottom: '1rem' }}>
                  <Clock size={18} /> {doctor?.availableDays}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(37, 99, 235, 0.2)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Consultation Fee</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{doctor?.consultationFees}</span>
                </div>
                <Link
                  to={`/checkout/${doctor?.id}`}
                  state={{ doctor: { ...doctor, name: doctor.fullName, specialty: doctor.specialization, fee: doctor.consultationFees } }}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media(minWidth: 768px)': { gridTemplateColumns: '2fr 1fr' } }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel animate-fade-in delay-100" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>About Doctor</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>{doctor?.bio}</p>
            </div>

            <div className="glass-panel animate-fade-in delay-200" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Clinic Details</h2>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{doctor?.hospitalName}</h3>
                <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <MapPin size={18} style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                <span>{doctor?.clinicAddress}</span>
              </p>
            </div>

            {/* Reviews Section */}
            <div className="glass-panel animate-fade-in delay-300" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem' }}>Patient Reviews</h2>
                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Write a Review</button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.map(review => (
                  <div key={review.id} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600' }}>{review.user}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{review.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} color={i < review.rating ? "#fbbf24" : "#e2e8f0"} fill={i < review.rating ? "#fbbf24" : "none"} />
                      ))}
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
