import React, { ReactElement, useState } from 'react';
import { AppBar, Toolbar, useScrollTrigger, useTheme, Box, IconButton, Drawer } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice';
import { CustomButton, CustomModal, Logo, Spacer } from './index';

type ElevationScrollProps = {
    children: ReactElement;
    window?: () => Window;
};

function ElevationScroll(props: ElevationScrollProps) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
        style: {
            backgroundColor: trigger ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
            transition: 'background-color 0.3s',
        },
    });
}

const Navbar: React.FC = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isLocationActive = (path: string) => {
        return location.pathname === path;
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleLogout = () => {
        console.log('Logging out...');
        dispatch(logout());
        navigate('/Landing');
        setModalOpen(false);
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div>
            {!drawerOpen && (
                <ElevationScroll>
                    <AppBar position="fixed" sx={{ top: 0, right: 0, height: '100vh', width: 'auto', display: 'flex', justifyContent: 'center' }}>
                        <Toolbar sx={{ 
                            backgroundColor: 'transparent', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            height: '100%', 
                            width: '150px', 
                            paddingTop: '2rem' 
                        }}>
                            <IconButton 
                                color="inherit" 
                                aria-label="open drawer" 
                                edge="start" 
                                onClick={toggleDrawer}
                                sx={{ marginBottom: '2rem', 
                                    color: theme.palette.branding.light }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </ElevationScroll>
            )}

            <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer} PaperProps={{ sx: { backgroundColor: theme.palette.navBackground.main } }}>
                <Spacer />
                <Logo logoSize='small'/>
                <Box
                    sx={{ width: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}
                    role="presentation"
                    onClick={toggleDrawer}
                    onKeyDown={toggleDrawer}
                >
                    <CustomButton label='Home' buttonType='navButton' isActive={isLocationActive('/Landing')} />
                    <CustomButton label='Properties' buttonType='navButton' isActive={isLocationActive('/Properties')}/>
                    <CustomButton label='My Properties' buttonType='navButton' isActive={isLocationActive('/MyProperties')}/>
                    <CustomButton label='Admin Home' buttonType='navButton' isActive={isLocationActive('/AdminHome')}/>
                    <CustomButton label='Logout' buttonType='navButton' isActive={isLocationActive('/Logout')} onClick={toggleModal}/>
                    <CustomButton buttonType='helpButton' label='Help' />
                </Box>
            </Drawer>

            <CustomModal modalType='twoButton' open={modalOpen} onConfirm={handleLogout} onClose={toggleModal} children='Logout now?' label='Logout'/>
        </div>
    );
};

export default Navbar;
