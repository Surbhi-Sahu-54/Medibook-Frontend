import React, { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthContext, AuthProvider } from './AuthContext';

const Harness = () => {
  const { user, login, logout, updateProfile } = useContext(AuthContext);

  return (
    <div>
      <span>{user?.name || 'guest'}</span>
      <button onClick={() => login({ name: 'Patient One', role: 'PATIENT' })}>login</button>
      <button onClick={() => updateProfile({ phone: '12345' })}>profile</button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('loads a stored user and supports logout', async () => {
    localStorage.setItem('currentUser', JSON.stringify({ name: 'Stored User', role: 'PATIENT' }));

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );

    expect(await screen.findByText('Stored User')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(screen.getByText('guest')).toBeInTheDocument();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('persists login and profile updates', async () => {
    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );

    await screen.findByText('guest');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText('Patient One')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /profile/i }));

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('currentUser'))).toMatchObject({
        name: 'Patient One',
        phone: '12345',
        isProfileComplete: true,
      });
    });
  });
});
