import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders service and contact links', () => {
    render(<Footer />);

    expect(screen.getByText('Medibook')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /find doctors/i })).toHaveAttribute('href', '/doctors');
    expect(screen.getByRole('link', { name: /support@medibook.com/i })).toHaveAttribute(
      'href',
      'mailto:support@medibook.com'
    );
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });
});
