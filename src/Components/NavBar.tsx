import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Drawer } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { logout } from '../Redux/Slices/userSlice';
import { CustomButton, CustomModal, Logo, Spacer } from './index';
import { clearSelectedProperty } from '../Redux/Slices';
import { useCheckAuth } from '../Hooks/useCheckAuth';

interface NavbarProps {
  open: boolean;
  onClose: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const { isAdmin } = useCheckAuth();
  
  // Get the selected propertyId and propertySlug from Redux
  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const propertySlug = useSelector((state: RootState) => state.currentProperty.propertySlug);

  const [modalOpen, setModalOpen] = useState(false);

  const isLocationActive = (path: string) => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearSelectedProperty());
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
          {/* Admin only */}
          {isAdmin && 
            <>
              <CustomButton
                label='User Management'
                navigationPath='/EditUser'
                buttonType='navButton'
                isActive={isLocationActive('/EditUser')}
              />
              <CustomButton
                label='Uploads'
                navigationPath='/UploadManagement'
                buttonType='navButton'
                isActive={isLocationActive('/UploadManagement')}
              />
            </>
          }

          {/* Everyone else */}
          <CustomButton 
            label={isAdmin ? 'Home' : 'My Properties'} 
            navigationPath='/Home' 
            buttonType='navButton' 
            isActive={isLocationActive('/Home')}
          />

          {/* Conditionally render Gallery button if property is selected */}
          {selectedPropertyId && propertySlug ? (
            <CustomButton 
              label='Gallery' 
              navigationPath={`/Gallery/${propertySlug}`} // Dynamic URL with propertySlug
              buttonType='navButton' 
              isActive={isLocationActive(`/Gallery/${propertySlug}`)}
            />
          ) : (
            <CustomButton 
              label='Gallery' 
              buttonType='navButton' 
              isActive={false} // Disable button if no property is selected
              disabled
            />
          )}

          <CustomButton 
            label='Logout' 
            buttonType='navButton' 
            isActive={isLocationActive('/Logout')} 
            onClick={toggleModal}
          />
          <CustomButton 
            buttonType='helpButton' 
            label='Help' 
          />
        </Box>
      </Drawer>

      <CustomModal modalType='twoButton' open={modalOpen} onConfirm={handleLogout} onClose={toggleModal} children='Logout now?' title='Logout'/>
    </div>
  );
};

export default Navbar;
