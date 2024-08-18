import React, { useEffect } from 'react';
import CustomButton from './Buttons';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent'; // Import DialogContent

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
  label?: string;
  buttonLabel?: string;
  modalType?: 'oneButton' | 'twoButton' | 'timed' | 'editDetails' | 'editPhotos';
  style?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, onConfirm, children, modalType, style, label, buttonLabel }) => {
  
  useEffect(() => {
    let timerId: any;
    if (open && modalType === 'timed') {
      timerId = setTimeout(onClose, 2000);
    }
    return () => clearTimeout(timerId);
  }, [open, modalType, onClose]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      sx={style}
    >
      {modalType !== 'editDetails' && <DialogTitle>{label}</DialogTitle>}
      <DialogContent>
        {children}
      </DialogContent>
      {modalType === 'oneButton' && <CustomButton label={buttonLabel || 'Close'} onClick={onClose} />}
      {modalType === 'twoButton' && (
        <div className='modal-2-button-container'>
          <CustomButton label={label || 'Yes'} onClick={onConfirm} />
          <CustomButton buttonType='cancelButton' label='Cancel' onClick={onClose} />
        </div>
      )}
    </Dialog>
  );
};

export default Modal;
