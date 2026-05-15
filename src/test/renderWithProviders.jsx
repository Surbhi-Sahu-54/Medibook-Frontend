import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const renderWithProviders = (
  ui,
  {
    route = '/',
    authValue = {
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      loading: false,
    },
  } = {}
) =>
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
