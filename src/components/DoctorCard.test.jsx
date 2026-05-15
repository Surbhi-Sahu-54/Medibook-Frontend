import React from 'react';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import DoctorCard from './DoctorCard';
import { renderWithProviders } from '../test/renderWithProviders';

describe('DoctorCard', () => {
  it('renders supplied doctor details and booking links', () => {
    renderWithProviders(
      <DoctorCard
        doctor={{
          id: 77,
          name: 'Dr. Mira Shah',
          specialty: 'Dermatology',
          qualification: 'MBBS, MD',
          experience: 9,
          clinicAddress: 'Skin Care Clinic',
          rating: 4.9,
          fee: 700,
        }}
      />
    );

    expect(screen.getByRole('heading', { name: 'Dr. Mira Shah' })).toBeInTheDocument();
    expect(screen.getByText('Dermatology')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profile/i })).toHaveAttribute('href', '/doctor/77');
    expect(screen.getByRole('link', { name: /book/i })).toHaveAttribute('href', '/checkout/77');
  });

  it('uses fallback values when optional doctor details are missing', () => {
    renderWithProviders(<DoctorCard doctor={{ name: 'Dr. Basic', specialty: 'General Medicine' }} />);

    expect(screen.getByAltText('Dr. Basic')).toHaveAttribute('src', expect.stringContaining('ui-avatars.com'));
    expect(screen.getByText('5 Yrs Exp')).toBeInTheDocument();
    expect(screen.getByText('City Hospital')).toBeInTheDocument();
  });
});
