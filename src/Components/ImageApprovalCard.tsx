import React from "react";
import { Card, CardActions, CardContent, Typography, Button } from "@mui/material";

interface ImageApprovalCardProps {
  image: string;
  imageTag: string;
  imageId: string;
  imageStatus: "PENDING" | "APPROVED" | "REJECTED";
  onApprove: () => void;
  onEdit: () => void;
  onReject: () => void;
  rejectionReason?: string; 
};

const ImageApprovalCard: React.FC<ImageApprovalCardProps> = ({
  image,
  imageTag,
  imageId,
  imageStatus,
  onApprove,
  onEdit,
  onReject,
  rejectionReason
}) => {
  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <img src={image} alt={imageTag} style={{ width: 60, height: 60, marginRight: 2 }} />
        <Typography variant="subtitle1">{imageTag}</Typography>
        {rejectionReason && <Typography variant="caption" color="error">{rejectionReason}</Typography>}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={onApprove}>Approve</Button>
        <Button size="small" color="primary" onClick={onEdit}>Edit</Button>
        <Button size="small" color="secondary" onClick={onReject}>Reject</Button>
      </CardActions>
    </Card>
  );
};

export default ImageApprovalCard;
