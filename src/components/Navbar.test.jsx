import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';
import { renderWithProviders } from '../test/renderWithProviders';

describe('Navbar', () => {
  it('shows guest navigation and auth actions', () => {
    renderWithProviders(<Navbar />, { route: '/' });

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Doctors')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  it('shows authenticated navigation and logs out from the account menu', async () => {
    const user = userEvent.setup();
    const logout = vi.fn();

    renderWithProviders(<Navbar />, {
      route: '/dashboard',
      authValue: {
        user: { name: 'Surbhi', role: 'PATIENT', isProfileComplete: true },
        login: vi.fn(),
        logout,
        updateProfile: vi.fn(),
        loading: false,
      },
    });

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();

    await user.click(screen.getByText('Surbhi'));
    await user.click(screen.getByText('Logout'));

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
