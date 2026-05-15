import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import { renderWithProviders } from '../test/renderWithProviders';

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    renderWithProviders(
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute><div>Private Dashboard</div></ProtectedRoute>} />
        <Route path="/login" element={<div>Login Route</div>} />
      </Routes>,
      { route: '/dashboard' }
    );

    expect(screen.getByText('Login Route')).toBeInTheDocument();
  });

  it('redirects users without the required role', () => {
    renderWithProviders(
      <Routes>
        <Route path="/checkout/:doctorId" element={<ProtectedRoute allowedRoles={['PATIENT']}><div>Checkout Route</div></ProtectedRoute>} />
        <Route path="/dashboard" element={<div>Dashboard Route</div>} />
      </Routes>,
      {
        route: '/checkout/1',
        authValue: {
          user: { role: 'DOCTOR', isProfileComplete: true },
          login: vi.fn(),
          logout: vi.fn(),
          updateProfile: vi.fn(),
          loading: false,
        },
      }
    );

    expect(screen.getByText('Dashboard Route')).toBeInTheDocument();
  });
});
