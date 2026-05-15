import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import DoctorProfile from './DoctorProfile';
import api from '../api/api';
import { renderWithProviders } from '../test/renderWithProviders';

vi.mock('../api/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('Doctor profile page', () => {
  it('renders catalog doctor details directly from the route', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/doctor/:doctorId" element={<DoctorProfile />} />
      </Routes>,
      { route: '/doctor/1' }
    );

    expect(await screen.findByText('Dr. Rajesh Sharma')).toBeInTheDocument();
    expect(screen.getByText('Cardiologist')).toBeInTheDocument();
    expect(screen.getAllByText(/Heart Care Center/i).length).toBeGreaterThan(0);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('shows loading then renders a backend doctor response', async () => {
    let resolveRequest;
    api.get.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    renderWithProviders(
      <Routes>
        <Route path="/doctor/:doctorId" element={<DoctorProfile />} />
      </Routes>,
      { route: '/doctor/99' }
    );
    expect(screen.getByText('Loading doctor profile...')).toBeInTheDocument();

    resolveRequest({
      data: {
        id: 99,
        fullName: 'Dr. Backend Profile',
        specialization: 'Neurology',
        degree: 'MBBS, MD',
        experience: 8,
        hospitalName: 'Backend Hospital',
        clinicAddress: 'Backend Road',
        consultationFees: 650,
        availableDays: 'Tuesday, Thursday',
        bio: 'Backend doctor details',
      },
    });

    expect(await screen.findByText('Dr. Backend Profile')).toBeInTheDocument();
    expect(screen.getByText('Backend doctor details')).toBeInTheDocument();
  });

  it('shows a not-found error when backend lookup fails', async () => {
    api.get.mockRejectedValue({ response: { status: 404 } });

    renderWithProviders(
      <Routes>
        <Route path="/doctor/:doctorId" element={<DoctorProfile />} />
      </Routes>,
      { route: '/doctor/404' }
    );

    expect(await screen.findByText('Doctor profile was not found.')).toBeInTheDocument();
  });
});
