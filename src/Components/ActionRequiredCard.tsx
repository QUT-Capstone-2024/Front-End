import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { CustomButton } from './index';

interface ActionRequiredCardProps {
  imageUrl: string;
  title: string;
  submittedDateTime?: string;
  description: string;
  onButtonClick: () => void;
  cardType?: 'Update' | 'Review';
}

const ActionRequiredCard: React.FC<ActionRequiredCardProps> = ({ imageUrl, title, submittedDateTime, description, onButtonClick, cardType = 'Update' }) => {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', padding: 2, border: 'none', boxShadow: 0, background: 'inherit' }}>
      <CardMedia
        component="img"
        sx={{ width: 120, height: 120, borderRadius: '8px', boxShadow: 4 }}
        image={imageUrl}
        alt="Action required image"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 2 }}>
        <CardContent sx={{ flex: '1 0 auto', padding: '0 16px' }}>
          <Typography component="div" variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography variant="subtitle2" component="div">
            {submittedDateTime}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            {description}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px 16px' }}>
          <CustomButton label={cardType === 'Review' ? 'Review' : 'View' } onClick={onButtonClick} />
        </Box>
      </Box>
    </Card>
  );
};

export default ActionRequiredCard;
