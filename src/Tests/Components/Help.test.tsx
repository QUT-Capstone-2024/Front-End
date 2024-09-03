import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Help from '../../Components/Help';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '../../Redux/store';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

describe('Help Component', () => {
  it('opens and closes the modal correctly using both close methods', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Help helpContent="Some help content" />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Assume a button triggers the modal open
    fireEvent.click(screen.getByLabelText('Help'));
    expect(screen.getByText('Some help content')).toBeInTheDocument();

    // Close using the top "Dismiss" button
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(screen.queryByText('Some help content')).not.toBeInTheDocument();

    // Re-open the modal to test the other close button
    fireEvent.click(screen.getByLabelText('Help'));
    expect(screen.getByText('Some help content')).toBeInTheDocument();

    // Close using the bottom "Close" button
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Some help content')).not.toBeInTheDocument();
  });

  it('closes the modal on route change', () => {
    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/initial']}>
          <Routes>
            <Route path="/initial" element={<Help helpContent="Some help content" />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Open the modal
    fireEvent.click(screen.getByLabelText('Help'));
    expect(screen.getByText('Some help content')).toBeInTheDocument();

    // Simulate route change by re-rendering with a new route
    rerender(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/new-route']}>
          <Routes>
            <Route path="/new-route" element={<Help helpContent="Some help content" />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Check that the modal closes
    expect(screen.queryByText('Some help content')).toBeNull();
  });
});
