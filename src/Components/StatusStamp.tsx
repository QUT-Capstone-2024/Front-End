import React from 'react';
import { Box, Typography } from '@mui/material';

type StatusStampProps = {
  status: 'approved' | 'queued' | 'rejected';
  className?: string;
};

const StatusStamp: React.FC<StatusStampProps> = ({ status, className }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return '#1f323e';
      case 'queued':
        return '#f3b792';
      case 'rejected':
        return '#ef4400';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'approved':
        return 'APPROVED';
      case 'queued':
        return 'PENDING';
      case 'rejected':
        return 'REJECTED';
      default:
        return '';
    }
  };

  return (
    <Box 
      className={className}
      sx={{
        display: 'inline-block',
        padding: '8px 16px',
        border: `2px solid ${getStatusColor()}`,
        borderRadius: '4px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        color: getStatusColor(),
        textTransform: 'uppercase',
        transform: 'rotate(-10deg)',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(1px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <Typography sx={{ color: getStatusColor() }}>{getStatusLabel()}</Typography>
    </Box>
  );
};

export default StatusStamp;
