import React, { ReactElement, useState } from 'react';
import { AppBar, Toolbar, Typography, useScrollTrigger, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../Redux/authSlice';
import { CustomButton, CustomModal } from './index';

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
    // const isLoggedIn = true; // For testing purposes
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const [modalOpen, setModalOpen] = useState(false);
    

    const isLocationActive = (path: string) => {
        return location.pathname === path;
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleLogout = () => {
        console.log('Logging out...');
        dispatch(logout());
        navigate('/Home');
        // TODO: Add logout functionality with API call
        setModalOpen(false);
    }

    return (
        <div>
            <ElevationScroll>
                <AppBar position="fixed">
                    <Toolbar sx={{ backgroundColor: theme.palette.navBackground.main }}>
                        <Typography variant="h5" sx={{ flexGrow: 1, color: theme.palette.branding.main }}>
                            VisionCORE
                        </Typography>
                        <CustomButton label='Landing' buttonType='navButton' isActive={isLocationActive('/Landing')} />
                        { !isLoggedIn?
                        (
                            <>
                                <CustomButton label='Register' buttonType='navButton' isActive={isLocationActive('/Register')}/>
                                <CustomButton label='Login' buttonType='navButton' isActive={isLocationActive('/Login')}/>
                            </>
                        ) : (
                            <>
                                <CustomButton label='Collections' buttonType='navButton' isActive={isLocationActive('/Collections')}/>
                                <CustomButton label='Logout' buttonType='navButton' isActive={isLocationActive('/Logout')} onClick={toggleModal}/>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
            </ElevationScroll>

            <CustomModal modalType='twoButton' open={modalOpen} onConfirm={handleLogout} onClose={toggleModal} children='Logout now?' label='Logout'/>
        </div>
    );
};

export default Navbar;
