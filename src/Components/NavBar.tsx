import React, { ReactElement } from 'react';
import { AppBar, Toolbar, Typography, useScrollTrigger, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import  CustomButton from './Buttons';

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
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    const isLocationActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <ElevationScroll>
            <AppBar position="fixed">
                <Toolbar sx={{ backgroundColor: theme.palette.navBackground.main }}>
                    <Typography variant="h5" sx={{ flexGrow: 1, color: theme.palette.branding.main }}>
                        VisionCORE
                    </Typography>
                    <CustomButton label='Home' buttonType='navButton' isActive={isLocationActive('/')} />
                    { !isLoggedIn? 
                    (
                        <>
                            <CustomButton label='Register' buttonType='navButton' isActive={isLocationActive('/Register')}/>
                            <CustomButton label='Login' buttonType='navButton' isActive={isLocationActive('/Login')}/> 
                        </>
                    ) : (<CustomButton label='Logout' buttonType='navButton' isActive={isLocationActive('/Logout')}/>)}
                </Toolbar>
            </AppBar>
        </ElevationScroll>
    );
};

export default Navbar;
