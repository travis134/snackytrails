import React from 'react';
import { render, screen } from '@testing-library/react';
import Splash from './Splash';

test('renders learn react link', () => {
  render(<Splash />);
  const logoElement = screen.getByAltText("Snacky Trails");
  expect(logoElement).toBeInTheDocument();
});
