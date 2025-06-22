/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders prayer app', () => {
  render(<App />);
  const prayerElement = screen.getByText(/prayer/i);
  expect(prayerElement).toBeInTheDocument();
});

test('renders praise tab', () => {
  render(<App />);
  const praiseElement = screen.getByText(/praise/i);
  expect(praiseElement).toBeInTheDocument();
}); 