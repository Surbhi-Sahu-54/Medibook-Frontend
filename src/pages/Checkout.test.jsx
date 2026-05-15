import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from './Checkout';
import api from '../api/api';
import { renderWithProviders } from '../test/renderWithProviders';

vi.mock('../api/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Checkout appointment booking form', () => {
  const authValue = {
    user: { userId: 17, role: 'PATIENT', isProfileComplete: true },
    login: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
    loading: false,
  };

  const routeState = {
    state: {
      doctor: {
        id: 1,
        name: 'Dr. Rajesh Sharma',
        specialty: 'Cardiologist',
        fee: 800,
      },
    },
  };

  it('validates required appointment date', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/checkout/:doctorId" element={<Checkout />} />
      </Routes>,
      {
      route: { pathname: '/checkout/1', ...routeState },
      authValue,
      }
    );

    await user.click(screen.getByRole('button', { name: /confirm & pay/i }));
    expect(screen.getByText('Please select an appointment date.')).toBeInTheDocument();
  });

  it('shows session expiry when no patient session exists', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(
      <Routes>
        <Route path="/checkout/:doctorId" element={<Checkout />} />
      </Routes>,
      {
      route: { pathname: '/checkout/1', ...routeState },
      authValue,
      }
    );

    fireEvent.change(container.querySelector('input[type="date"]'), {
      target: { value: '2026-05-20' },
    });
    await user.click(screen.getByRole('button', { name: /confirm & pay/i }));

    expect(screen.getByText('Session expired. Please log in again.')).toBeInTheDocument();
  });

  it('submits booking details and shows success state', async () => {
    const user = userEvent.setup();
    localStorage.setItem('currentUser', JSON.stringify({ userId: 17 }));
    api.post.mockResolvedValue({ data: { id: 44 } });

    const { container } = renderWithProviders(
      <Routes>
        <Route path="/checkout/:doctorId" element={<Checkout />} />
      </Routes>,
      {
      route: { pathname: '/checkout/1', ...routeState },
      authValue,
      }
    );

    fireEvent.change(container.querySelector('input[type="date"]'), {
      target: { value: '2026-05-20' },
    });
    await user.type(screen.getByPlaceholderText(/Reason for visit/i), 'Chest discomfort');
    await user.click(screen.getByRole('button', { name: /confirm & pay/i }));

    await waitFor(() => expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument());
    expect(api.post).toHaveBeenCalledWith('/appointment-service/api/appointments/book', {
      patientId: 17,
      doctorId: 1,
      doctorName: 'Dr. Rajesh Sharma',
      appointmentDate: '2026-05-20',
      appointmentTime: '10:00:00',
      reason: 'Chest discomfort',
    });
  });
});
