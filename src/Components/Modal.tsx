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
  title?: string;
  titleColour?: string;
  buttonLabel?: string;
  buttonType?: 'navButton' | 'helpButton' | 'warningButton' | 'errorButton' | 'successButton' | 'closeButton' | 'textOnly' | 'cancelButton' | 'settingsButton';
  modalType?: 'oneButton' | 'twoButton' | 'timed' | 'editDetails' | 'editPhotos';
  style?: React.CSSProperties;
  contentColour?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, onConfirm, children, contentColour = '#1f323e', modalType, style, title: label, titleColour: labelColour, buttonLabel, buttonType }) => {
  
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
      {modalType !== 'editDetails' && <DialogTitle sx={{ color: labelColour}}>{label}</DialogTitle>}
      <DialogContent sx={{color: contentColour}}>
        {children}
      </DialogContent>
      {modalType === 'oneButton' && <CustomButton label={buttonLabel || 'Close'} onClick={onClose} />}
      {modalType === 'twoButton' && (
        <div className='modal-2-button-container'>
          <CustomButton label={label || 'Yes'} onClick={onConfirm} buttonType={buttonType}/>
          <CustomButton buttonType='cancelButton' label='Cancel' onClick={onClose} />
        </div>
      )}
    </Dialog>
  );
};

export default Modal;
