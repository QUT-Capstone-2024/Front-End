import { Box } from '@mui/material';
import React from 'react';
import BathtubIcon from '@mui/icons-material/Bathtub';
import KingBedIcon from '@mui/icons-material/KingBed';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CropFreeIcon from '@mui/icons-material/CropFree';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';

interface IconBarProps {
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  internalPropertySize: number;
  externalPropertySize: number;
}

const IconBar: React.FC<IconBarProps> = ({ bedrooms, bathrooms, parkingSpaces, internalPropertySize, externalPropertySize }) => {
  return (
  <>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 0' }} className="property-details-container">
        <KingBedIcon sx={{ margin: '0 8px', fontSize: 24}} />
        <span style={{ paddingRight: '1rem'}}>{bedrooms}</span>

        <BathtubIcon sx={{ margin: '0 8px', fontSize: 24 }} />
        <span style={{ paddingRight: '1rem'}}>{bathrooms}</span>

        <DirectionsCarIcon sx={{ margin: '0 8px', fontSize: 24 }} />
        <span style={{ paddingRight: '1rem'}}>{parkingSpaces}</span>

        <CropFreeIcon sx={{ margin: '0 8px', fontSize: 24 }} />
        <span style={{ paddingRight: '1rem'}}>{internalPropertySize}</span>

        <AspectRatioIcon sx={{ margin: '0 8px', fontSize: 24 }} />
        <span style={{ paddingRight: '1rem'}}>{externalPropertySize}</span>
    </Box>
  </>
  );
};

export default IconBar;