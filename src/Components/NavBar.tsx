import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Drawer } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice';
import { CustomButton, CustomModal, Logo, Spacer } from './index';

// For testing
const isAdmin = true;

interface NavbarProps {
  open: boolean;
  onClose: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const isLocationActive = (path: string) => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    dispatch(logout());
    navigate('/');
    setModalOpen(false);
  };

  return (
    <div>
      <AppBar position="fixed" sx={{ top: 0, right: 0, height: '100vh', width: 'auto', display: 'flex', justifyContent: 'center' }}>
        <Toolbar sx={{ 
          backgroundColor: 'transparent', 
          flexDirection: 'column', 
          alignItems: 'center', 
          height: '100%', 
          width: '150px', 
          paddingTop: '2rem' 
        }}>
          {/* Removed internal button; control drawer externally */}
        </Toolbar>
      </AppBar>

      <Drawer anchor='right' open={open} onClose={onClose}>
        <Spacer />
        <Logo logoSize='small'/>
        <Box
          sx={{ width: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}
          role="presentation"
          onClick={onClose}
          onKeyDown={onClose}
        >
          {isAdmin && <CustomButton label='User Management' navigationPath='/UserManagement' buttonType='navButton' isActive={isLocationActive('/UserManagement')}/>}
          <CustomButton label={isAdmin? 'Home' : 'My Properties'} navigationPath='/Home' buttonType='navButton' isActive={isLocationActive('/Home')}/>
          {isLocationActive('/Gallery') && <CustomButton label='Gallery' navigationPath='/Gallery' buttonType='navButton' isActive={isLocationActive('/Gallery')}/>}
          <CustomButton label='Logout' buttonType='navButton' isActive={isLocationActive('/Logout')} onClick={toggleModal}/>
          <CustomButton buttonType='helpButton' label='Help' />
        </Box>
      </Drawer>

      <CustomModal modalType='twoButton' open={modalOpen} onConfirm={handleLogout} onClose={toggleModal} children='Logout now?' label='Logout'/>
    </div>
  );
};

export default Navbar;
