import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { CustomButton } from './index';

type DropdownProps = {
  buttonLabel?: string;
  settingsButton?: boolean;
  anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right'; };
  transformOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right'; };
  menuItems: { label: string; onClick: () => void; }[];
};

const Dropdown: React.FC<DropdownProps> = ({ 
  buttonLabel = '', 
  menuItems, 
  settingsButton = false, 
  anchorOrigin = { vertical: 'top', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left'},
  }) => { 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <CustomButton onClick={handleClick} buttonType={settingsButton? 'settingsButton' : 'textOnly'} label={buttonLabel} />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={() => { handleClose(); item.onClick(); }}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Dropdown;
