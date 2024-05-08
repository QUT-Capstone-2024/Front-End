import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { CustomButton } from '../../Components';
import { BrowserRouter as Router } from 'react-router-dom';

describe('CustomButton Component', () => {
  it('renders navButton correctly', () => {
    render(<CustomButton buttonType="navButton" label="Home" />, { wrapper: Router });
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  it('renders helpButton with tooltip', () => {
    render(<CustomButton label='Help' buttonType="helpButton" withTooltip={true} />);
    expect(screen.getByLabelText('Help')).toBeInTheDocument();
  });

  it('handles click event for closeButton', () => {
    const handleClick = jest.fn();
    render(<CustomButton buttonType="closeButton" label="Close" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  // Test cases for each button type can be added here following the same pattern.
});
