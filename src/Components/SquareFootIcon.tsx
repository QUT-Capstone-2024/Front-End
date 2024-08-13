import React from 'react';
import { Box } from '@mui/material';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';


const SquareFootIcon: React.FC = () => {
  return (
    <Box sx={{ position: 'relative'}}>
      <CropSquareIcon sx={{ fontSize: 30, color: '#1f323e', marginTop: '2px' }} />
      <SwapHorizIcon sx={{ position: 'absolute', fontSize: 18, color: '#1f323e', top: '19%', left: '20%' }} />
    </Box>
  );
};

export default SquareFootIcon;
