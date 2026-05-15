import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Wallet, Banknote, Building, Calendar, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/api';

const Checkout = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Doctor info passed from DoctorCard/DoctorProfile via router state
  const passedDoctor = location.state?.doctor;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [consultationMode, setConsultationMode] = useState('in-person');
  const [serviceType, setServiceType] = useState('consultation');
  const [timeSlot, setTimeSlot] = useState('10:00:00');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const doctor = passedDoctor || {
    id: doctorId,
    name: 'Selected Doctor',
    specialty: 'Specialist',
    fee: 500.00
  };

  // Get tomorrow's date as default min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!appointmentDate) {
      setError('Please select an appointment date.');
      return;
    }

    // Get patientId from localStorage (stored during login)
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const patientId = currentUser.userId;

    if (!patientId) {
      setError('Session expired. Please log in again.');
      return;
    }

    setIsProcessing(true);
    try {
      await api.post('/appointment-service/api/appointments/book', {
        patientId: patientId,
        doctorId: Number(doctorId),
        doctorName: doctor.name,
        appointmentDate: appointmentDate,
        appointmentTime: timeSlot,
        reason: reason || `${serviceType} - ${consultationMode}`
      });

      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Booking failed. Please try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', minHeight: 'calc(100vh - 5rem)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', maxWidth: '500px' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', backgroundColor: '#dcfce7', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <CheckCircle size={48} color="#166534" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#166534' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Your appointment with {doctor.name} on {appointmentDate} at {timeSlot.substring(0,5)} has been successfully saved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', minHeight: 'calc(100vh - 5rem)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Complete Your Booking</h1>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

        {/* Left Column - Appointment Details */}
        <div>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Appointment Details</h2>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
                <User size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem' }}>{doctor.name}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{doctor.specialty}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Date Picker */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} /> Date</span>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
                  min={minDate}
                  value={appointmentDate}
                  onChange={e => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              {/* Time Slot */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> Time Slot</span>
                <select className="form-input" style={{ width: 'auto', padding: '0.25rem 0.5rem' }} value={timeSlot} onChange={e => setTimeSlot(e.target.value)}>
                  <option value="09:00:00">09:00 AM</option>
                  <option value="10:00:00">10:00 AM</option>
                  <option value="11:30:00">11:30 AM</option>
                  <option value="14:00:00">02:00 PM</option>
                  <option value="16:15:00">04:15 PM</option>
                </select>
              </div>

              {/* Service Type */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Service Type</span>
                <select className="form-input" style={{ width: 'auto', padding: '0.25rem 0.5rem' }} value={serviceType} onChange={e => setServiceType(e.target.value)}>
                  <option value="consultation">General Consultation</option>
                  <option value="followup">Follow-up</option>
                </select>
              </div>

              {/* Consultation Mode */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mode</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setConsultationMode('in-person')} className={`btn ${consultationMode === 'in-person' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>In Person</button>
                  <button type="button" onClick={() => setConsultationMode('teleconsultation')} className={`btn ${consultationMode === 'teleconsultation' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Teleconsultation</button>
                </div>
              </div>

              {/* Reason */}
              <div>
                <textarea
                  className="form-input"
                  placeholder="Reason for visit (optional)"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={2}
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>Consultation Fee</span>
                <span style={{ fontWeight: '600', fontSize: '1.125rem', color: 'var(--primary)' }}>₹{Number(doctor.fee || 500).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Method */}
        <div>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Payment Method</h2>

            <form onSubmit={handlePayment}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { value: 'card', Icon: CreditCard, label: 'Credit / Debit Card' },
                  { value: 'upi', Icon: Banknote, label: 'UPI / Net Banking' },
                  { value: 'wallet', Icon: Wallet, label: 'Digital Wallet' },
                  { value: 'clinic', Icon: Building, label: 'Pay at Clinic' },
                ].map(({ value, Icon, label }) => (
                  <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: `2px solid ${paymentMethod === value ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: paymentMethod === value ? 'var(--primary-light)' : 'transparent' }}>
                    <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} style={{ cursor: 'pointer' }} />
                    <Icon size={24} color={paymentMethod === value ? 'var(--primary)' : 'var(--text-muted)'} />
                    <span style={{ fontWeight: paymentMethod === value ? '600' : '400' }}>{label}</span>
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
                  <div className="form-group">
                    <input type="text" className="form-input" placeholder="Card Number" maxLength={19} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="text" className="form-input" placeholder="MM/YY" maxLength={5} />
                    <input type="text" className="form-input" placeholder="CVC" maxLength={4} />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
                  <input type="text" className="form-input" placeholder="Enter UPI ID (e.g. name@upi)" />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Confirming Appointment...' : `Confirm & Pay ₹${Number(doctor.fee || 500).toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;

