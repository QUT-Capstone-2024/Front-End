import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Modal from '../../Components/Modal';
import '@testing-library/jest-dom';

describe('Modal Component', () => {
  const onClose = jest.fn();

  it('renders oneButton modal and handles close', () => {
    render(
      <Modal
        open={true}
        onClose={onClose}
        label="Test Modal"
        modalType="oneButton"
        children="This is a modal message"
      />
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders twoButton modal and handles both buttons', () => {
    render(
      <Modal
        open={true}
        onClose={onClose}
        label="Test Modal"
        modalType="twoButton"
        buttonLabel="Confirm"
        children="This is a modal message"
      />
    );
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    fireEvent.click(screen.getByText('Confirm'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('timed modal closes automatically', async () => {
    jest.useFakeTimers();
    render(
      <Modal
        open={true}
        onClose={onClose}
        label="Auto Close Modal"
        modalType="timed"
        children="This will close automatically"
      />
    );
    expect(screen.getByText('Auto Close Modal')).toBeInTheDocument();
    jest.advanceTimersByTime(2000);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    jest.useRealTimers();
  });
});
