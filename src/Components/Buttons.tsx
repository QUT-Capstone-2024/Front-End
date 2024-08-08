import React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import {Help as HelpIcon, Close as CloseIcon, Settings as SettingsIcon,} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';


type ButtonProps = {
  buttonType?: 'navButton' | 'helpButton' | 'warningButton' | 'errorButton' | 'successButton' | 'closeButton' | 'textOnly' | 'cancelButton' | 'settingsButton';
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
}

const CustomButton: React.FC<ButtonProps> = ({ buttonType, label, withIcon, icon, withTooltip = false, tooltipText, isActive, style, onClick, disabled = false, className }) => {
  const theme = useTheme(); 
  
  switch (buttonType) {
    case 'navButton':
      if (label === 'Logout') { 
        console.log("Logout button clicked"); 
        return (
          <Button className={className} sx={{ color: isActive ? theme.palette.primary.main : theme.palette.primary.light }} onClick={onClick}>
            {label}
          </Button>
        );
      }

      return (
        <Button className={className} component={Link} to={`/${label.replace(' ', '')}`} sx={{ color: isActive ? theme.palette.primary.main : theme.palette.primary.light }}>
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