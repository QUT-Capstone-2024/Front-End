import React, { useEffect } from 'react';
import CustomButton from './Buttons';
import Modal from './Modal';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeHelp, openHelp } from '../Redux/helpSlice';
import { RootState } from '../store';

type HelpProps = {
  helpContent: React.ReactNode;
};

const Help: React.FC<HelpProps> = ({helpContent}) => {
  const isOpen = useSelector((state: RootState) => state.help.isOpen); 
  const dispatch = useDispatch();
  const location = useLocation();
  const pageName = location.pathname.split('/').filter(Boolean)[0] || 'Home';

  useEffect(() => {
    dispatch(closeHelp());
  }, [location, dispatch]);

  return (
    <>
      <CustomButton buttonType='helpButton' label='Help' onClick={() => dispatch(openHelp())} />
      <Modal label={`Help for ${pageName}`} modalType='oneButton' open={isOpen} onClose={() => dispatch(closeHelp())} children={helpContent}/>
    </>
  );
};

export default Help;
