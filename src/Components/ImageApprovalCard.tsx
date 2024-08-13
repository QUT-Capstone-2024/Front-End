import React from "react";
import { CustomButton, StatusStamp } from "./index";

interface ImageApprovalCardProps {
  image: string;
  imageTag: string;
  imageId: string;
  imageStatus: "queued" | "approved" | "rejected";
  rejectionReason?: string;
};

const ImageApprovalCard: React.FC<ImageApprovalCardProps> = ({ image, imageTag, imageId, imageStatus, rejectionReason }) => {
  return (
    <div className="image-approval-card">
      <h1>Image approval card</h1>
    </div>
  );
};


export default ImageApprovalCard;
