import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import { Search } from 'lucide-react';
import { doctorsCatalog } from '../data/doctors';

const Doctors = () => {
  const locationObj = useLocation();
  const queryParams = new URLSearchParams(locationObj.search);
  const initialSearch = queryParams.get('search') || '';
  const initialSpecialty = queryParams.get('specialty') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [specialtyFilter, setSpecialtyFilter] = useState(initialSpecialty);
  const [locationFilter, setLocationFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    if (initialSearch) setSearchTerm(initialSearch);
    if (initialSpecialty) setSpecialtyFilter(initialSpecialty);
  }, [initialSearch, initialSpecialty]);
  
  const doctorsList = doctorsCatalog;

  const filteredDoctors = doctorsList.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === '' || doc.specialty === specialtyFilter;
    const matchesLocation = locationFilter === '' || doc.location === locationFilter;
    const matchesRating = ratingFilter === 0 || parseFloat(doc.rating) >= ratingFilter;
    
    return matchesSearch && matchesSpecialty && matchesLocation && matchesRating;
  });

  const specialties = [...new Set(doctorsList.map(d => d.specialty))];
  const locations = [...new Set(doctorsList.map(d => d.location))];

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: 'calc(100vh - 5rem)' }}>
      {/* Header Section */}
      <section style={{ backgroundColor: 'white', padding: '3rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Find Your Doctor</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '2rem' }}>
            Search from our wide list of verified specialists and book an appointment instantly.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search by name or specialty..." 
                style={{ paddingLeft: '3rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="form-input" style={{ width: 'auto', minWidth: '150px' }} value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}>
              <option value="">All Specialties</option>
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <select className="form-input" style={{ width: 'auto', minWidth: '150px' }} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select className="form-input" style={{ width: 'auto', minWidth: '150px' }} value={ratingFilter} onChange={(e) => setRatingFilter(Number(e.target.value))}>
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5 & Above</option>
              <option value={4.8}>4.8 & Above</option>
              <option value={5.0}>5.0 Only</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="doctor-grid">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(doc => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No doctors found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Doctors;
