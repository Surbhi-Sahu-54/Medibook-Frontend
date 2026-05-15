import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import { ShieldCheck, CalendarCheck, Clock, Search, Heart, Activity, Eye, Brain } from 'lucide-react';
import { doctorsCatalog, featuredDoctorIds } from '../data/doctors';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const featuredDoctors = featuredDoctorIds
    .map((doctorId) => doctorsCatalog.find((doctor) => doctor.id === doctorId))
    .filter(Boolean);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/doctors');
    }
  };

  return (
    <div className="animate-fade-in">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Health, <span className="text-gradient">Our Priority</span>
            </h1>
            <p className="hero-subtitle">
              Book appointments with the best doctors in your city instantly. 
              Experience healthcare that is simple, fast, and accessible.
            </p>
            <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '600px', margin: '0 auto 2rem', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search doctors, clinics, hospitals, etc." 
                style={{ paddingLeft: '3rem', paddingRight: '8rem', height: '3.5rem', fontSize: '1.125rem', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-md)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', bottom: '0.5rem', padding: '0 1.5rem' }}>
                Search
              </button>
            </form>
            <div className="hero-cta">
              <Link to="/doctors" className="btn btn-outline" style={{ backgroundColor: 'white' }}>Browse Providers</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialization Categories */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Top Specializations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Heart, name: 'Cardiologist', color: '#ef4444' },
              { icon: Activity, name: 'General Physician', color: '#3b82f6' },
              { icon: Eye, name: 'Ophthalmologist', color: '#10b981' },
              { icon: Brain, name: 'Neurologist', color: '#8b5cf6' },
            ].map((spec, idx) => (
              <div key={idx} className="glass-panel animate-fade-in delay-100" style={{ padding: '1.5rem 1rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(spec.name)}`)}>
                <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: `${spec.color}15`, borderRadius: '50%', marginBottom: '1rem' }}>
                  <spec.icon size={32} color={spec.color} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{spec.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0', backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Choose Medibook?</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              We provide the best healthcare services with top professionals.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <ShieldCheck size={32} color="var(--primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Verified Doctors</h3>
              <p style={{ color: 'var(--text-muted)' }}>Every doctor on our platform is thoroughly verified and highly qualified.</p>
            </div>
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <CalendarCheck size={32} color="var(--primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Instant Booking</h3>
              <p style={{ color: 'var(--text-muted)' }}>Book appointments instantly without any hassle or waiting in long queues.</p>
            </div>
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <Clock size={32} color="var(--primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>24/7 Support</h3>
              <p style={{ color: 'var(--text-muted)' }}>Our support team is always available to help you with your queries.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem' }}>Top Specialists</h2>
            <Link to="/doctors" style={{ color: 'var(--primary)', fontWeight: '600' }}>View All →</Link>
          </div>
          <div className="doctor-grid">
            {featuredDoctors.map(doc => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
