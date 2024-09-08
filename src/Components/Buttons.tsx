import React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import {Help as HelpIcon, Close as CloseIcon, Settings as SettingsIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';


type ButtonProps = {
  buttonType?: 'navButton' | 'helpButton' | 'warningButton' | 'errorButton' | 'successButton' | 'closeButton' | 'textOnly' | 'cancelButton' | 'settingsButton' | 'uploadButton' | 'removeButton';
  label: string;
  withTooltip?: boolean;
  tooltipText?: string;
  withIcon?: 'left' | 'right';
  icon?: React.ReactNode;
  isActive?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  onClick?: (() => void) | ((event: any) => void);
  className?: string;
  navigationPath?: string;
}

const CustomButton: React.FC<ButtonProps> = ({ buttonType, label, withIcon, icon, withTooltip = false, tooltipText, isActive, style, onClick, disabled = false, className, navigationPath }) => {
  const theme = useTheme(); 
  
  switch (buttonType) {
    case 'navButton':
      if (label === 'Logout') { 
        return (
          <Button className={className} sx={{ color: isActive ? theme.palette.primary.main : theme.palette.primary.light }} onClick={onClick}>
            {label}
          </Button>
        );
      }

      return (
        <Button className={className} href={navigationPath} sx={{ color: isActive ? theme.palette.primary.main : theme.palette.primary.light }}>
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

    case 'settingsButton':
      return (
          <IconButton sx={ style } onClick={onClick} className={buttonType}>
            <SettingsIcon sx={{ fontSize: '30px'}}/>
          </IconButton>
      );

    case 'uploadButton':
      return (
          <IconButton sx={ style } onClick={onClick} className={buttonType}>
            <UploadIcon sx={{ fontSize: '36px' }}/>
          </IconButton>
      );
     
    case 'closeButton':
      return (
        <Tooltip title={label} className='closeButton'>
          <IconButton style={ style } onClick={onClick}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      );
    
    case 'removeButton':
      return (
        <Tooltip title={label} className='closeButton'>
          <IconButton style={ style } onClick={onClick}>
            <CloseIcon sx={{ color: '#ef4400' }}/>
          </IconButton>
        </Tooltip>
      );

    case 'textOnly':
      return (
        <Button style={ style } className={`${className} 'textButton'`} onClick={onClick}>
          {label}
        </Button>
      );

    default:
      if (withTooltip) {
        return (
            <Tooltip title={tooltipText? tooltipText: label} style={{ display: withTooltip? 'none' : '' }}>
              <Button disabled={disabled} variant='contained' style={ style } className={`${className} ${buttonType || 'button'} ${disabled ? 'disabled' : ''}`} onClick={onClick}>
                {withIcon === 'left' && icon}
                {label}
                {withIcon === 'right' && icon}
              </Button>
            </Tooltip>
        );  
      }
      return (
            <Button disabled={disabled}  variant='contained' style={ style } className={`${className} ${buttonType || 'button'} ${disabled ? 'disabled' : ''}`} onClick={onClick}>
              {withIcon === 'left' && icon}
              {label}
              {withIcon === 'right' && icon}
            </Button>
      ); 
  }
};

export default CustomButton;