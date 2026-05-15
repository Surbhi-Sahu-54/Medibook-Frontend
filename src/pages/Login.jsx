import AdminDashboard from "./AdminDashboard";
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, LogIn, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [error, setError] = useState('');
  const [pendingMsg, setPendingMsg] = useState('');
  const [rejectedMsg, setRejectedMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setPendingMsg(''); setRejectedMsg('');
    setLoading(true);

    try {
      const response = await api.post('/auth-service/auth/login', { email, password, role });
      const { token, name, userId } = response.data;
      localStorage.setItem('token', token);
      login({ name: name || email, email, role, userId, isProfileComplete: true });

      if (role === 'ADMIN') {
      navigate('/admin-dashboard');
      } else {
      navigate('/dashboard');
     }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid credentials. Please verify your email and try again.';
      const raw = typeof msg === 'string' ? msg : JSON.stringify(msg);

      if (raw.startsWith('DOCTOR_PENDING:')) {
        setPendingMsg(raw.replace('DOCTOR_PENDING:', '').trim());
      } else if (raw.startsWith('DOCTOR_REJECTED:')) {
        setRejectedMsg(raw.replace('DOCTOR_REJECTED:', '').trim());
      } else {
        setError(raw);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        minHeight: 'calc(100vh - 5rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '1rem',
              backgroundColor: 'var(--primary-light)',
              borderRadius: '50%',
              marginBottom: '1rem',
            }}
          >
            <Stethoscope size={32} color="var(--primary)" />
          </div>
          <h2>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Login to manage your appointments</p>
        </div>

        {/* Error banners */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <AlertCircle size={16} />{error}
          </div>
        )}
        {pendingMsg && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#92400e', backgroundColor: '#fef3c7', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid #fbbf24' }}>
            <Clock size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Account Under Review</p>
              <p>{pendingMsg}</p>
            </div>
          </div>
        )}
        {rejectedMsg && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#991b1b', backgroundColor: '#fee2e2', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid #fca5a5' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Verification Rejected</p>
              <p>{rejectedMsg}</p>
            </div>
          </div>
        )}



        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link
                to="#"
                style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '500' }}
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Login As</label>
            <select
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Signing In…
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
