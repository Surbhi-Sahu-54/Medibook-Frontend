import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope, UserPlus, AlertCircle, Loader2, CheckCircle,
  ChevronRight, ChevronLeft, Upload, X
} from 'lucide-react';
import api from '../api/api';

const SPECIALIZATIONS = [
  'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
  'General Medicine', 'General Surgery', 'Gynecology', 'Neurology',
  'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics',
  'Psychiatry', 'Pulmonology', 'Radiology', 'Urology', 'ENT', 'Dentistry', 'Other'
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ── Shared helpers ─────────────────────────────────────────────────────────────
const Field = ({ label, children, required }) => (
  <div className="form-group">
    <label className="form-label">{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
    {children}
  </div>
);

const FileUploadBox = ({ label, required, accept, file, onChange, name }) => {
  const [preview, setPreview] = useState(null);
  const handleChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    onChange(name, f);
    if (f.type.startsWith('image/')) setPreview(URL.createObjectURL(f));
    else setPreview('pdf');
  };
  return (
    <div style={{ border: `2px dashed ${file ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center', transition: 'all 0.2s', backgroundColor: file ? 'var(--primary-light)' : 'transparent' }}>
      <label style={{ cursor: 'pointer', display: 'block' }}>
        <input type="file" accept={accept} style={{ display: 'none' }} onChange={handleChange} />
        {preview && preview !== 'pdf' && (
          <img src={preview} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />
        )}
        {preview === 'pdf' && <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>}
        {!preview && <Upload size={28} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />}
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: file ? 'var(--primary)' : 'var(--text-muted)', margin: 0 }}>
          {file ? file.name : label}
        </p>
        {required && !file && <p style={{ fontSize: '0.75rem', color: '#ef4444', margin: '0.25rem 0 0' }}>Required</p>}
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>JPG, PNG or PDF · Max 10MB</p>
      </label>
    </div>
  );
};

// ── Progress indicator ─────────────────────────────────────────────────────────
const StepIndicator = ({ steps, current }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
    {steps.map((label, i) => {
      const num = i + 1;
      const done = num < current;
      const active = num === current;
      return (
        <React.Fragment key={num}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.85rem',
              backgroundColor: done ? '#22c55e' : active ? 'var(--primary)' : 'var(--border)',
              color: (done || active) ? 'white' : 'var(--text-muted)',
              transition: 'all 0.3s'
            }}>
              {done ? <CheckCircle size={16} /> : num}
            </div>
            <span style={{ fontSize: '0.7rem', marginTop: '0.25rem', color: active ? 'var(--primary)' : 'var(--text-muted)', fontWeight: active ? 700 : 400 }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, backgroundColor: done ? '#22c55e' : 'var(--border)', margin: '0 0.5rem', marginBottom: '1.2rem', transition: 'all 0.3s' }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ══ MAIN COMPONENT ═════════════════════════════════════════════════════════════
const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('PATIENT');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Patient fields
  const [patient, setPatient] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });

  // Doctor fields
  const [doc, setDoc] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phone: '', dateOfBirth: '', gender: '',
    medicalRegistrationNumber: '', degree: '', specialization: '', experience: '',
    hospitalName: '', clinicAddress: '', consultationFees: '', languages: '', bio: '',
    availableSlots: ''
  });
  const [selectedDays, setSelectedDays] = useState([]);
  const [files, setFiles] = useState({ govtId: null, medicalLicense: null, degreeCertificate: null, profilePhoto: null });

  const doctorSteps = ['Basic Info', 'Professional', 'Documents', 'Availability'];

  const setDocField = (e) => setDoc({ ...doc, [e.target.name]: e.target.value });
  const setPatientField = (e) => setPatient({ ...patient, [e.target.name]: e.target.value });
  const setFile = (name, file) => setFiles(prev => ({ ...prev, [name]: file }));
  const toggleDay = (day) => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);

  // ── Validation per step ───────────────────────────────────────────────────
  const validateStep = () => {
    setError('');
    if (role === 'PATIENT') {
      if (!patient.firstName || !patient.email || !patient.password) return setError('Please fill all required fields.'), false;
      if (patient.password !== patient.confirmPassword) return setError('Passwords do not match.'), false;
      return true;
    }
    // Doctor steps
    if (step === 1) {
      if (!doc.firstName || !doc.email || !doc.password || !doc.phone) return setError('Please fill all required fields.'), false;
      if (doc.password !== doc.confirmPassword) return setError('Passwords do not match.'), false;
    }
    if (step === 2) {
      if (!doc.medicalRegistrationNumber || !doc.degree || !doc.specialization) return setError('Medical Registration Number, Degree, and Specialization are required.'), false;
    }
    if (step === 3) {
      if (!files.govtId) return setError('Government ID is required.'), false;
      if (!files.medicalLicense) return setError('Medical License is required.'), false;
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => { setError(''); setStep(s => s - 1); };

  // ── Patient submit ────────────────────────────────────────────────────────
  const submitPatient = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      await api.post('/auth-service/auth/register', {
        name: `${patient.firstName.trim()} ${patient.lastName.trim()}`,
        email: patient.email.trim(),
        password: patient.password,
        role: 'PATIENT'
      });
      navigate('/verify-otp', { state: { email: patient.email.trim() } });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Registration failed.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally { setLoading(false); }
  };

  // ── Doctor submit ─────────────────────────────────────────────────────────
  const submitDoctor = async () => {
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', `${doc.firstName.trim()} ${doc.lastName.trim()}`);
      fd.append('email', doc.email.trim());
      fd.append('password', doc.password);
      fd.append('phone', doc.phone);
      fd.append('dateOfBirth', doc.dateOfBirth);
      fd.append('gender', doc.gender);
      fd.append('medicalRegistrationNumber', doc.medicalRegistrationNumber);
      fd.append('degree', doc.degree);
      fd.append('specialization', doc.specialization);
      if (doc.experience) fd.append('experience', doc.experience);
      if (doc.hospitalName) fd.append('hospitalName', doc.hospitalName);
      if (doc.clinicAddress) fd.append('clinicAddress', doc.clinicAddress);
      if (doc.consultationFees) fd.append('consultationFees', doc.consultationFees);
      if (doc.languages) fd.append('languages', doc.languages);
      if (doc.bio) fd.append('bio', doc.bio);
      fd.append('availableDays', selectedDays.join(','));
      if (doc.availableSlots) fd.append('availableSlots', doc.availableSlots);
      fd.append('govtId', files.govtId);
      fd.append('medicalLicense', files.medicalLicense);
      if (files.degreeCertificate) fd.append('degreeCertificate', files.degreeCertificate);
      if (files.profilePhoto) fd.append('profilePhoto', files.profilePhoto);

      await api.post('/auth-service/auth/doctor/register', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Registration failed.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally { setLoading(false); }
  };

  // ── Success screen for doctors ────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: 'calc(100vh - 5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-panel animate-fade-in" style={{ maxWidth: 520, padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'inline-flex', padding: '1.25rem', backgroundColor: '#dcfce7', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <CheckCircle size={48} color="#166534" />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#166534' }}>Application Submitted!</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Your doctor registration application has been submitted successfully.<br /><br />
            <strong>Your account is pending verification by MediBook Admin.</strong><br />
            You will be notified via email after approval.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 5rem)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: role === 'DOCTOR' ? 700 : 500, padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', backgroundColor: 'var(--primary-light)', borderRadius: '50%', marginBottom: '0.75rem' }}>
            <Stethoscope size={28} color="var(--primary)" />
          </div>
          <h2 style={{ marginBottom: '0.25rem' }}>Create an Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join MediBook for faster healthcare access</p>
        </div>

        {/* Role toggle */}
        <div style={{ display: 'flex', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', overflow: 'hidden', marginBottom: '1.5rem' }}>
          {['PATIENT', 'DOCTOR'].map(r => (
            <button key={r} type="button"
              onClick={() => { setRole(r); setStep(1); setError(''); }}
              style={{ flex: 1, padding: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: role === r ? 'var(--primary)' : 'transparent', color: role === r ? 'white' : 'var(--text-muted)' }}>
              {r === 'PATIENT' ? '🏥 Patient' : '👨‍⚕️ Doctor'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            <AlertCircle size={16} />{error}
          </div>
        )}

        {/* ── PATIENT FORM ── */}
        {role === 'PATIENT' && (
          <form onSubmit={submitPatient}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="First Name" required><input className="form-input" name="firstName" value={patient.firstName} onChange={setPatientField} required placeholder="Surbhi" /></Field>
              <Field label="Last Name"><input className="form-input" name="lastName" value={patient.lastName} onChange={setPatientField} placeholder="Sahu" /></Field>
            </div>
            <Field label="Email Address" required><input type="email" className="form-input" name="email" value={patient.email} onChange={setPatientField} required placeholder="you@example.com" /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Password" required><input type="password" className="form-input" name="password" value={patient.password} onChange={setPatientField} required minLength={6} placeholder="••••••••" /></Field>
              <Field label="Confirm Password" required><input type="password" className="form-input" name="confirmPassword" value={patient.confirmPassword} onChange={setPatientField} required placeholder="••••••••" /></Field>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating Account…</> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>
        )}

        {/* ── DOCTOR MULTI-STEP FORM ── */}
        {role === 'DOCTOR' && (
          <div>
            <StepIndicator steps={doctorSteps} current={step} />

            {/* Step 1 — Basic Info */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Basic Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Field label="First Name" required><input className="form-input" name="firstName" value={doc.firstName} onChange={setDocField} required placeholder="Rakesh" /></Field>
                  <Field label="Last Name" required><input className="form-input" name="lastName" value={doc.lastName} onChange={setDocField} placeholder="Sharma" /></Field>
                </div>
                <Field label="Email Address" required><input type="email" className="form-input" name="email" value={doc.email} onChange={setDocField} required placeholder="doctor@example.com" /></Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Field label="Password" required><input type="password" className="form-input" name="password" value={doc.password} onChange={setDocField} required minLength={6} placeholder="••••••••" /></Field>
                  <Field label="Confirm Password" required><input type="password" className="form-input" name="confirmPassword" value={doc.confirmPassword} onChange={setDocField} required placeholder="••••••••" /></Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Field label="Phone Number" required><input className="form-input" name="phone" value={doc.phone} onChange={setDocField} required placeholder="+91 9876543210" /></Field>
                  <Field label="Date of Birth"><input type="date" className="form-input" name="dateOfBirth" value={doc.dateOfBirth} onChange={setDocField} /></Field>
                </div>
                <Field label="Gender">
                  <select className="form-input" name="gender" value={doc.gender} onChange={setDocField}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>
              </div>
            )}

            {/* Step 2 — Professional Details */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Professional Details</h3>
                <Field label="Medical Registration Number" required><input className="form-input" name="medicalRegistrationNumber" value={doc.medicalRegistrationNumber} onChange={setDocField} required placeholder="MH-12345" /></Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Field label="Degree / Qualification" required><input className="form-input" name="degree" value={doc.degree} onChange={setDocField} required placeholder="MBBS, MD" /></Field>
                  <Field label="Specialization" required>
                    <select className="form-input" name="specialization" value={doc.specialization} onChange={setDocField} required>
                      <option value="">Select Specialization</option>
                      {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Field label="Years of Experience"><input type="number" className="form-input" name="experience" value={doc.experience} onChange={setDocField} placeholder="5" min="0" /></Field>
                  <Field label="Consultation Fees (₹)"><input type="number" className="form-input" name="consultationFees" value={doc.consultationFees} onChange={setDocField} placeholder="500" min="0" /></Field>
                </div>
                <Field label="Hospital / Clinic Name"><input className="form-input" name="hospitalName" value={doc.hospitalName} onChange={setDocField} placeholder="City Hospital" /></Field>
                <Field label="Clinic Address"><input className="form-input" name="clinicAddress" value={doc.clinicAddress} onChange={setDocField} placeholder="123, Main St, Mumbai" /></Field>
                <Field label="Languages Spoken"><input className="form-input" name="languages" value={doc.languages} onChange={setDocField} placeholder="English, Hindi" /></Field>
                <Field label="Biography / About">
                  <textarea className="form-input" name="bio" value={doc.bio} onChange={setDocField} rows={3} placeholder="Brief description about your practice and expertise..." style={{ resize: 'vertical' }} />
                </Field>
              </div>
            )}

            {/* Step 3 — Documents */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Document Uploads</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Upload clear, readable copies. Accepted: JPG, PNG, PDF · Max 10MB each.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Government ID <span style={{ color: '#ef4444' }}>*</span></p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Aadhaar / PAN / Passport</p>
                    <FileUploadBox name="govtId" label="Upload Govt ID" required accept="image/*,.pdf" file={files.govtId} onChange={setFile} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Medical License <span style={{ color: '#ef4444' }}>*</span></p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Valid medical license certificate</p>
                    <FileUploadBox name="medicalLicense" label="Upload License" required accept="image/*,.pdf" file={files.medicalLicense} onChange={setFile} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Degree Certificate <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>MBBS / MD / MS certificate</p>
                    <FileUploadBox name="degreeCertificate" label="Upload Degree" accept="image/*,.pdf" file={files.degreeCertificate} onChange={setFile} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Profile Photo <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Professional photo</p>
                    <FileUploadBox name="profilePhoto" label="Upload Photo" accept="image/*" file={files.profilePhoto} onChange={setFile} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 — Availability */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Availability</h3>
                <Field label="Available Days">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {DAYS.map(day => (
                      <button key={day} type="button"
                        onClick={() => toggleDay(day)}
                        style={{
                          padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem',
                          fontWeight: 600, border: '2px solid',
                          borderColor: selectedDays.includes(day) ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: selectedDays.includes(day) ? 'var(--primary)' : 'transparent',
                          color: selectedDays.includes(day) ? 'white' : 'var(--text-muted)',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Time Slots">
                  <input className="form-input" name="availableSlots" value={doc.availableSlots} onChange={setDocField} placeholder="e.g. 09:00-13:00, 14:00-17:00" />
                </Field>
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: 'var(--radius-md)', border: '1px solid #fbbf24' }}>
                  <p style={{ fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>⚠️ Please note</p>
                  <p style={{ color: '#78350f', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    After submission, your application will be reviewed by the MediBook admin team.
                    You will receive an email notification once your account is approved. You will not be able to login until approved.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '1rem' }}>
              {step > 1 && (
                <button type="button" onClick={back} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChevronLeft size={18} /> Back
                </button>
              )}
              {step < 4 && (
                <button type="button" onClick={next} className="btn btn-primary" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Next <ChevronRight size={18} />
                </button>
              )}
              {step === 4 && (
                <button type="button" onClick={submitDoctor} className="btn btn-primary" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={loading}>
                  {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : <><UserPlus size={18} /> Submit Application</>}
                </button>
              )}
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
