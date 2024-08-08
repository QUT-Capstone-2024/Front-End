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
    <div className="image-approval-container">
      <div className="image-wrapper">
        <img className="image-approval-image" src={image} alt="house details" />
        <StatusStamp status={imageStatus} className="status-stamp" />
      </div>
      <div className="image-approval-content">
        <p className="image-tag">{imageTag}</p>
        {imageStatus === "rejected" && rejectionReason && (
          <p className="rejection-reason">{rejectionReason}</p>
        )}
        <div className="image-approval-button-wrapper">
          <CustomButton label="View" buttonType="textOnly" />
        </div>
      </div>
    </div>
  );
};

export default ImageApprovalCard;
