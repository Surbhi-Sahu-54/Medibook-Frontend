import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from './Register';
import api from '../api/api';
import { renderWithProviders } from '../test/renderWithProviders';

vi.mock('../api/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Register page', () => {
  it('validates patient password confirmation before submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />, { route: '/register' });

    await user.type(screen.getByPlaceholderText('Surbhi'), 'Asha');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'asha@example.com');
    const passwordFields = screen.getAllByPlaceholderText(/•|â€¢/);
    await user.type(passwordFields[0], 'secret123');
    await user.type(passwordFields[1], 'different123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('registers a patient and routes to OTP verification', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({ data: { message: 'ok' } });

    renderWithProviders(
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<div>OTP verification</div>} />
      </Routes>,
      { route: '/register' }
    );

    await user.type(screen.getByPlaceholderText('Surbhi'), 'Asha');
    await user.type(screen.getByPlaceholderText('Sahu'), 'Patel');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'asha@example.com');
    const passwordFields = screen.getAllByPlaceholderText(/•|â€¢/);
    await user.type(passwordFields[0], 'secret123');
    await user.type(passwordFields[1], 'secret123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(screen.getByText('OTP verification')).toBeInTheDocument());
    expect(api.post).toHaveBeenCalledWith('/auth-service/auth/register', {
      name: 'Asha Patel',
      email: 'asha@example.com',
      password: 'secret123',
      role: 'PATIENT',
    });
  });
});
