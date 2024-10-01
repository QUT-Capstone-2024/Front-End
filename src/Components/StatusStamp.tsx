import React from 'react';
import { Box, Typography } from '@mui/material';

type StatusStampProps = {
  status: "UNTAGGED" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
  className?: string;
};

const StatusStamp: React.FC<StatusStampProps> = ({ status, className }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'UNTAGGED':
        return 'gray';
      case 'APPROVED':
        return '#1f323e';
      case 'PENDING':
        return '#1f323e';
      case 'REJECTED':
        return '#ef4400';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'APPROVED':
        return 'APPROVED';
      case 'UNTAGGED':
        return 'PENDING';
      case 'PENDING':
        return 'PENDING';
      case 'REJECTED':
        return 'REJECTED';
      default:
        return '';
    }
  };

  return (
    <Box 
      className={className}
      sx={{
        width: '100%',
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        color: getStatusColor(),
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(1px)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '8px 8px 0px 0px',
        position: 'absolute',
      }}
    >
      <Typography sx={{ color: getStatusColor() }}>{getStatusLabel()}</Typography>
    </Box>
  );
};

export default StatusStamp;
