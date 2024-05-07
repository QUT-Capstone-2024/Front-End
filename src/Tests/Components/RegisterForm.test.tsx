import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import RegisterForm from '../../Components/RegisterForm';
// import { http, HttpResponse } from 'msw';
// import { setupServer } from 'msw/node';

// const server = setupServer(
//   // Mocking a successful registration
//   http.post('/api/register', () => {
//     return new HttpResponse('Registration Complete', {status : 200});
//   })
// );

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());


// Test rendering of the RegisterForm component
test('renders the registration form with all required fields', () => {
  render(<RegisterForm />);
  expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /Password/i})).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /Confirm Password/i})).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
});

// Test user input accepted in the form fields
test('allows the user to enter input in the form fields', () => {
  render(<RegisterForm />);
  const usernameInput = screen.getByRole('textbox', {name: /name/i});
  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  expect((usernameInput as HTMLInputElement).value).toBe('testuser');

  const emailInput = screen.getByRole('textbox', { name: /email/i });
  fireEvent.change(emailInput, { target: { value: 'test@example.com' }});
  expect((emailInput as HTMLInputElement).value).toBe('test@example.com');

  const passwordInput = screen.getByRole('textbox', { name:/Password/i});
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  expect((passwordInput as HTMLInputElement).value).toBe('password123');

  const confirmPasswordInput = screen.getByRole('textbox', { name:/Confirm Password/i});
  fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
  expect((confirmPasswordInput as HTMLInputElement).value).toBe('password123');
});

// Test input validation
describe('RegisterForm', () => {
  test('validates email input correctly', () => {
    render(<RegisterForm />);
    const emailInput = screen.getByRole('textbox', { name:/email/i});
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Test Email is not valid
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    expect(screen.getByText(/Email is not valid/i)).toBeInTheDocument();

    // Test valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText(/Email is not valid/i)).toBeNull();
  });
});

test('validates password length', () => {
  render(<RegisterForm />);
  const passwordInput = screen.getByRole('textbox', { name:/password/i});
  const submitButton = screen.getByRole('button', { name: /submit/i });

  // Test too short password
  fireEvent.change(passwordInput, { target: { value: '123' } });
  fireEvent.click(submitButton);
  expect(screen.getByText(/password must be at least 10 characters/i)).toBeInTheDocument();

  // Test sufficient length password
  fireEvent.change(passwordInput, { target: { value: 'Password1$' } });
  fireEvent.click(submitButton);
  expect(screen.queryByText(/password must be at least 10 characters/i)).toBeNull();
});

// // Test form submission when all fields are filled out correctly
// test('submits the form when all fields are filled out correctly', async () => {
//   render(<RegisterForm />);
//   fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
//   fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
//   fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
//   fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
  
//   const submitButton = screen.getByRole('button', { name: /Sign Up/i });
//   fireEvent.click(submitButton);

//   // Assert that the registration request is sent
//   await waitFor(() => {
//     expect(screen.getByText(/Registration Complete/i)).toBeInTheDocument();
//   });

//   // Assert that the API call is made
//   expect(await screen.findByText(/Registration Complete/i)).toBeInTheDocument();
//   expect(await screen.findByText(/Registration Complete/i)).toHaveClass('success');

// });

