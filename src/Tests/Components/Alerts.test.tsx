import { fireEvent, render, screen } from '@testing-library/react';
import CustomAlert from '../../Components/Alert';
import '@testing-library/jest-dom';

describe('CustomAlert Component', () => {
  it.each([
    ["info" as const, /MuiAlert-filledInfo\b/],
    ["warning" as const, /MuiAlert-filledWarning\b/],
    ["error" as const, /MuiAlert-filledError\b/],
    ["success" as const, /MuiAlert-filledSuccess\b/]
  ])('renders %s alert with appropriate classes', (type, expectedClassRegex) => {
    render(<CustomAlert type={type} onClose={() => {}} style={{}} message={`This is a ${type} alert`}></CustomAlert>);
    const alertElement = screen.getByRole('alert');
    expect(alertElement.className).toMatch(expectedClassRegex);
  });

  it('renders with a close button and handles close event', () => {
    const onClose = jest.fn();
    render(<CustomAlert message='Info test modal' type="info" onClose={onClose} style={{}} withButton={true} buttonLabel="Dismiss" />);
    fireEvent.click(screen.getByText('Dismiss'));
    expect(onClose).toHaveBeenCalled();
  });
});
