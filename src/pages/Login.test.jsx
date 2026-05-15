import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import api from '../api/api';
import { renderWithProviders } from '../test/renderWithProviders';

vi.mock('../api/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Login page', () => {
  it('renders a loading state and completes a successful login route transition', async () => {
    const user = userEvent.setup();
    const login = vi.fn();
    let resolveRequest;

    api.post.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<div>Dashboard landing</div>} />
      </Routes>,
      {
        route: '/login',
        authValue: {
          user: null,
          login,
          logout: vi.fn(),
          updateProfile: vi.fn(),
          loading: false,
        },
      }
    );

    await user.type(screen.getByPlaceholderText('you@example.com'), 'patient@example.com');
    await user.type(screen.getByPlaceholderText(/•|â€¢/), 'secret123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/Signing In/i)).toBeInTheDocument();

    resolveRequest({
      data: { token: 'token-123', name: 'Patient One', userId: 7 },
    });

    await waitFor(() => expect(screen.getByText('Dashboard landing')).toBeInTheDocument());
    expect(localStorage.getItem('token')).toBe('token-123');
    expect(login).toHaveBeenCalledWith({
      name: 'Patient One',
      email: 'patient@example.com',
      role: 'PATIENT',
      userId: 7,
      isProfileComplete: true,
    });
  });

  it('shows API error messaging for failed login attempts', async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValue({
      response: { data: { message: 'Invalid password' } },
    });

    renderWithProviders(<Login />, { route: '/login' });

    await user.type(screen.getByPlaceholderText('you@example.com'), 'patient@example.com');
    await user.type(screen.getByPlaceholderText(/•|â€¢/), 'wrong-pass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Invalid password')).toBeInTheDocument();
  });
});
