import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Stethoscope } from 'lucide-react';

const ProfileSetup = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  // Common state
  const [loading, setLoading] = useState(false);

  // Patient state
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');

  // Doctor state
  const [specialization, setSpecialization] = useState('Cardiologist');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [fee, setFee] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [availableDays, setAvailableDays] = useState('Mon-Fri');
  const [availableTime, setAvailableTime] = useState('10:00 AM - 05:00 PM');
  const [about, setAbout] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (user.role === 'PATIENT') {
        updateProfile({ age, gender });
      } else {
        updateProfile({
          specialization,
          qualification,
          experience,
          fee,
          clinicName,
          availableDays,
          availableTime,
          about
        });
      }
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: user.role === 'DOCTOR' ? '800px' : '500px', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: '50%', marginBottom: '1rem' }}>
            {user.role === 'DOCTOR' ? <Stethoscope size={32} color="var(--primary)" /> : <User size={32} color="var(--primary)" />}
          </div>
          <h2>Complete Your Profile</h2>
          <p style={{ color: 'var(--text-muted)' }}>Welcome {user.name}, please fill in a few more details</p>
        </div>

        <form onSubmit={handleSubmit}>
          {user.role === 'PATIENT' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" className="form-input" value={age} onChange={e => setAge(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-input" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select className="form-input" value={specialization} onChange={e => setSpecialization(e.target.value)}>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Ophthalmologist">Ophthalmologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input type="text" className="form-input" placeholder="e.g., MBBS, MD" value={qualification} onChange={e => setQualification(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input type="number" className="form-input" value={experience} onChange={e => setExperience(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fee (₹)</label>
                <input type="number" className="form-input" value={fee} onChange={e => setFee(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Hospital / Clinic Name</label>
                <input type="text" className="form-input" value={clinicName} onChange={e => setClinicName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Available Days</label>
                <input type="text" className="form-input" placeholder="e.g., Mon-Fri" value={availableDays} onChange={e => setAvailableDays(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Available Time</label>
                <input type="text" className="form-input" placeholder="e.g., 10:00 AM - 05:00 PM" value={availableTime} onChange={e => setAvailableTime(e.target.value)} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Profile Photo</label>
                <input type="file" className="form-input" accept="image/*" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">About You</label>
                <textarea className="form-input" rows="4" value={about} onChange={e => setAbout(e.target.value)} required></textarea>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} disabled={loading}>
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
