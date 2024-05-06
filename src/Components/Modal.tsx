import React, { useEffect } from 'react';
import CustomButton from './Buttons';
import { Box, Modal as MuiModal, Typography } from '@mui/material';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  label: string;
  buttonLabel?: string;
  modalType?: 'oneButton' | 'twoButton' | 'timed';
  style?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({open, onClose, children, modalType, style, label, buttonLabel}) => {
  
  useEffect(() => {
    let timerId: any;
    if (open && modalType === 'timed') {
      timerId = setTimeout(onClose, 2000);
    }
    return () => clearTimeout(timerId);
  }, [open, modalType, onClose]);

  switch (modalType) {
    case 'oneButton':
      return ( 
        <MuiModal
          open={open}
          onClose={onClose}
          aria-labelledby={label}
          aria-describedby="modal-modal-description"
          className={'modal clickAway'}
        >
          <Box sx={style}>
          <CustomButton buttonType='closeButton' label='Close' onClick={onClose} />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {label}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {children}
            </Typography>
            <CustomButton onClick={onClose} label="Close" />
          </Box>
        </MuiModal> 
      );

    case 'twoButton':
      return ( 
        <MuiModal
          open={open}
          onClose={onClose}
          aria-labelledby={label}
          aria-describedby="modal-modal-description"
          className={'modal clickAway'}
        >
          <Box sx={style}>
          <CustomButton buttonType='closeButton' label='Close' onClick={onClose} />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {label}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {children}
            </Typography>
            <CustomButton onClick={onClose} label="Close" />
            <CustomButton onClick={onClose} label={buttonLabel || 'Ok'} />
          </Box>
        </MuiModal> 
      );

    case 'timed':
      return ( 
        <MuiModal
          open={open}
          onClose={onClose}
          aria-labelledby={label}
          aria-describedby="modal-modal-description"
          className={'modal timed'}
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {label}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {children}
            </Typography>
          </Box>
        </MuiModal> 
      );

      default:
        return null;
  };  
};

export default Modal;