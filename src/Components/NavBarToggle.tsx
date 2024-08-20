import React from 'react';
import { IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface NavBarToggleProps {
  onClick: () => void;
}

const NavBarToggle: React.FC<NavBarToggleProps> = ({ onClick}) => {
  const theme = useTheme();

  return (
    <IconButton 
      color="inherit" 
      aria-label="open drawer" 
      edge="start" 
      onClick={onClick}
      sx={{ color: theme.palette.branding.light }}
      className='nav-toggle'
    >
      <MenuIcon />
    </IconButton>
  );
};

export default NavBarToggle;