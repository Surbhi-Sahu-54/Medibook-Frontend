import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, KeyRound, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import api from '../api/api';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from Register page via router state
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email is required. Please go back to registration.');
      return;
    }
    if (otp.length < 4) {
      setError('Please enter a valid OTP.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth-service/auth/verify-otp', { email, otp });
      setSuccess('Email verified successfully! Redirecting to login…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'OTP verification failed. Please check the code and try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setResendLoading(true);
    try {
      await api.post('/auth-service/auth/resend-otp', { email });
      setSuccess('A new OTP has been sent to your email.');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to resend OTP. Please try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setResendLoading(false);
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
          maxWidth: '420px',
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
            <ShieldCheck size={32} color="var(--primary)" />
          </div>
          <h2>Verify Your Email</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            We've sent a one-time verification code to{' '}
            <strong style={{ color: 'var(--text)' }}>{email || 'your email'}</strong>.
            Please enter it below to activate your account.
          </p>
        </div>

        {/* Error banner */}
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
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#16a34a',
              backgroundColor: '#dcfce7',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
            }}
          >
            <CheckCircle2 size={16} />
            {success}
          </div>
        )}

        <form onSubmit={handleVerify}>
          {/* Email (editable in case user arrives directly) */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          {/* OTP input */}
          <div className="form-group">
            <label className="form-label">
              <KeyRound size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              One-Time Password (OTP)
            </label>
            <input
              type="text"
              className="form-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
              required
              placeholder="Enter OTP"
              maxLength={8}
              inputMode="numeric"
              style={{
                letterSpacing: '0.25em',
                fontSize: '1.2rem',
                textAlign: 'center',
              }}
            />
          </div>

          {/* Verify button */}
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
            disabled={loading || !!success}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Verifying…
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Verify OTP
              </>
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            onClick={handleResend}
            disabled={resendLoading || !!success}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--primary)',
              fontWeight: '600',
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              opacity: resendLoading || success ? 0.6 : 1,
            }}
          >
            {resendLoading ? (
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <RefreshCw size={14} />
            )}
            Resend OTP
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Back to{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Registration
          </Link>{' '}
          or{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
