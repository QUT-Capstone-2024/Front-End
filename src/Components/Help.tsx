import React, { useEffect, useState } from 'react';
import CustomButton from './Buttons';
import Modal from './Modal';
import { useLocation } from 'react-router-dom';

type HelpProps = {
 helpContent: React.ReactNode;
};

const Help: React.FC<HelpProps> = ({helpContent}) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pageName = location.pathname.split('/').filter(Boolean)[0] || 'Home';

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <>
      <CustomButton buttonType='helpButton' label='Help' onClick={() => setOpen(true)}/>
      <Modal label={`Help for ${pageName}`} modalType='oneButton' open={open} onClose={() => setOpen(false)} children={helpContent}/>
    </>
  );
};

export default Help;