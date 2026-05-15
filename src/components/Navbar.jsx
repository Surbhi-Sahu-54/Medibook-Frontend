import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Stethoscope, Menu, X, User, Bell, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = currentUser 
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Profile', path: '/profile' }
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Doctors', path: '/doctors' },
        { name: 'About', path: '/about' }
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Stethoscope size={28} color="var(--primary)" />
          <span>Medibook</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-links" id="desktop-nav">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => { setNotificationsOpen(!notificationsOpen); setDropdownOpen(false); }}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
                >
                  <Bell size={20} />
                  <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: 'white', fontSize: '0.65rem', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' }}>3</span>
                </button>
                {notificationsOpen && (
                  <div className="glass-panel" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '1rem', width: '300px', borderRadius: 'var(--radius-md)', padding: '1rem', zIndex: 100 }}>
                    <h4 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>Notifications</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.875rem' }}>
                        <p style={{ fontWeight: '600' }}>Booking Confirmed</p>
                        <p style={{ color: 'var(--text-muted)' }}>Your appointment is confirmed for tomorrow at 10 AM.</p>
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>
                        <p style={{ fontWeight: '600' }}>Payment Successful</p>
                        <p style={{ color: 'var(--text-muted)' }}>Receipt for your recent payment is available.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                 onClick={() => {setDropdownOpen(!dropdownOpen); setNotificationsOpen(false);}}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{currentUser.name || 'User'}</span>
                </button>
                
                {dropdownOpen && (
                  <div className="glass-panel" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '1rem', width: '200px', borderRadius: 'var(--radius-md)', padding: '0.5rem', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', transition: 'background 0.2s' }} className="hover-bg-light">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', transition: 'background 0.2s' }} className="hover-bg-light">
                      <UserCircle size={16} /> Profile
                    </Link>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', transition: 'background 0.2s', width: '100%', textAlign: 'left', color: '#ef4444' }} className="hover-bg-light">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                Signup
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Toggle Placeholder */}
        <button 
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
