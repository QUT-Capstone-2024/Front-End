import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';


type ButtonProps = {
  buttonType?: 'navButton' | 'warningButton' | 'errorButton' | 'successButton' | 'infoButton';
  label: React.ReactNode;
  withIcon?: 'left' | 'right';
  icon?: React.ReactNode;
  isActive?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({ buttonType, withIcon, label, icon, isActive }) => {
  const theme = useTheme(); 
  
  switch (buttonType) {
    case 'navButton':
      return (
        <Button component={Link} to={`/${label}`} sx={{ color: isActive ? theme.palette.branding.light : theme.palette.primary.main }}>{label}</Button>
      );
    default:
      return (
        <Button variant="contained" className="button">
          {withIcon === 'left' && icon}
          {label}
          {withIcon === 'right' && icon}
        </Button>
      );
  }
};

export default CustomButton;