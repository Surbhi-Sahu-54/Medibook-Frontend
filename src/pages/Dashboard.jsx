import React, { useState, useEffect } from 'react';
import PatientDashboard from './PatientDashboard';
import ProviderDashboard from './ProviderDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const [userName, setUserName] = useState('John Doe');
  const [userInitials, setUserInitials] = useState('JD');
  const [userRole, setUserRole] = useState('patient');

  useEffect(() => {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        const user = JSON.parse(currentUserStr);
        setCurrentUser(user);
        if (user.name) {
          setUserName(user.name);
          // Calculate initials
          const nameParts = user.name.split(' ').filter(Boolean);
          if (nameParts.length > 0) {
            let initials = nameParts[0].charAt(0).toUpperCase();
            if (nameParts.length > 1) {
              initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
            }
            setUserInitials(initials);
          }
        }
        if (user.role) {
          setUserRole(user.role.toLowerCase());
        }
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', minHeight: 'calc(100vh - 5rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {userInitials}
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>Hello, {userName}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome to your {userRole} dashboard</p>
        </div>
      </div>

      {userRole === 'admin' ? (
        <AdminDashboard user={currentUser} />
      ) : userRole === 'doctor' || userRole === 'provider' ? (
        <ProviderDashboard user={currentUser} />
      ) : (
        <PatientDashboard user={currentUser} />
      )}
    </div>
  );
};

export default Dashboard;
