import React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import {Help as HelpIcon, Close as CloseIcon} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';


type ButtonProps = {
  buttonType?: 'navButton' | 'helpButton' | 'warningButton' | 'errorButton' | 'successButton' | 'closeButton' | 'textOnly' | 'cancelButton';
  label: React.ReactNode;
  withTooltip?: boolean;
  tooltipText?: string;
  withIcon?: 'left' | 'right';
  icon?: React.ReactNode;
  isActive?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  onClick?: (() => void) | ((event: any) => void);
}

const CustomButton: React.FC<ButtonProps> = ({ buttonType, label, withIcon, icon, withTooltip = false, tooltipText, isActive, style, onClick, disabled = false}) => {
  const theme = useTheme(); 
  
  switch (buttonType) {
    case 'navButton':
      if (label === 'Logout') { 
        console.log("Logout button clicked"); 
        return (
          <Button sx={{ color: isActive ? theme.palette.branding.light : theme.palette.primary.main }} onClick={onClick}>
            {label}
          </Button>
        );
      }

      return (
        <Button component={Link} to={`/${label}`} sx={{ color: isActive ? theme.palette.branding.light : theme.palette.primary.main }}>
          {label}
        </Button>
      );

      case 'helpButton':
        return (
          <Tooltip title='Help' className='helpButton'>
            <IconButton sx={ style } onClick={onClick}>
              <HelpIcon sx={{ fontSize: '50px'}}/>
            </IconButton>
          </Tooltip>
        );
      

    case 'closeButton':
      return (
        <Tooltip title={label} className='closeButton'>
        <IconButton style={ style } onClick={onClick}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
      );

    case 'textOnly':
      return (
        <Button style={ style } className='textButton' onClick={onClick}>
          {label}
        </Button>
      );

    default:
      if (withTooltip) {
        return (
            <Tooltip title={tooltipText? tooltipText: label} style={{ display: withTooltip? 'none' : '' }}>
              <Button disabled={disabled} variant='contained' style={ style } className={`${buttonType || 'button'} ${disabled ? 'disabled' : ''}`} onClick={onClick}>
                {withIcon === 'left' && icon}
                {label}
                {withIcon === 'right' && icon}
              </Button>
            </Tooltip>
        );  
      }
      return (
            <Button disabled={disabled}  variant='contained' style={ style } className={`${buttonType || 'button'} ${disabled ? 'disabled' : ''}`} onClick={onClick}>
              {withIcon === 'left' && icon}
              {label}
              {withIcon === 'right' && icon}
            </Button>
      ); 
  }
};

export default CustomButton;