import React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import {Help as HelpIcon, Close as CloseIcon} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';


type ButtonProps = {
  buttonType?: 'navButton' | 'helpButton' | 'warningButton' | 'errorButton' | 'successButton' | 'closeButton' | 'textOnly';
  label: React.ReactNode;
  withTooltip?: boolean;
  tooltipText?: string;
  withIcon?: 'left' | 'right';
  icon?: React.ReactNode;
  isActive?: boolean;
  style?: React.CSSProperties;
  onClick?: (() => void) | ((event: any) => void);
}

const CustomButton: React.FC<ButtonProps> = ({ buttonType, label, withIcon, icon, withTooltip, tooltipText, isActive, style, onClick}) => {
  const theme = useTheme(); 
  
  switch (buttonType) {
    case 'navButton':
      return (
        <Button component={Link} to={`/${label}`} sx={{ color: isActive ? theme.palette.branding.light : theme.palette.primary.main }}>
          {label}
        </Button>
      );

    case 'helpButton':
      return (
        <Tooltip title='Help' className='helpButton'>
          <IconButton style={ style } onClick={onClick}>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      );

    case 'warningButton':
    return (
        <Tooltip title={tooltipText? tooltipText: label} style={{ display: withTooltip? 'none' : '' }}>
          <Button variant='contained' style={ style } className='warningButton' onClick={onClick}>
            {withIcon === 'left' && icon}
            {label}
            {withIcon === 'right' && icon}
          </Button>
        </Tooltip>
    );

    case 'errorButton':
      return (
        <Tooltip title={tooltipText? tooltipText: label} style={{ display: withTooltip? 'none' : '' }}>
          <Button variant='contained' style={ style } className='errorButton' onClick={onClick}>
            {withIcon === 'left' && icon}
            {label}
            {withIcon === 'right' && icon}
          </Button>
        </Tooltip>
      );

    case 'successButton':
      return (
        <Tooltip title={tooltipText? tooltipText: label} style={{ display: withTooltip? 'none' : '' }}>
          <Button variant='contained' style={ style } className='successButton' onClick={onClick}>
            {withIcon === 'left' && icon}
            {label}
            {withIcon === 'right' && icon}
          </Button>
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
      return (
        <Tooltip title={tooltipText? tooltipText: label} style={{ display: withTooltip? 'none' : '' }}>
          <Button variant='contained' style={ style } className='button' onClick={onClick}>
            {withIcon === 'left' && icon}
            {label}
            {withIcon === 'right' && icon}
          </Button>
        </Tooltip>
      );
  }
};

export default CustomButton;