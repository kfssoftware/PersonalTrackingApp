import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import JobFormModal from './job-form';

test('form renders correctly', () => {
    const { getByPlaceholderText, debug } = render(<JobFormModal />)
    expect(getByPlaceholderText(/^Job Name/i)).toBeInTheDocument()
});

test('buton control', () => {
    const { getByPlaceholderText, getByRole } = render(<JobFormModal />)
    expect(getByRole('button', { name: /Save/i })).toBeInTheDocument()
    expect(getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
});