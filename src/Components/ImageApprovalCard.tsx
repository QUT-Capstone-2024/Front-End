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
    <div className={`image-approval-container ${imageStatus}`}>
      <div className="image-wrapper">
        <StatusStamp status={imageStatus} className="status-stamp" />
        <img className="image-approval-image" src={image} alt="house details" />
        <p className="image-tag">{imageTag}</p>
      </div>
      <div className="image-approval-content">
        {imageStatus === "rejected" && rejectionReason && (
          <p className="rejection-reason">{rejectionReason}</p>
        )}
          <CustomButton label="View" buttonType="textOnly" />
      </div>
    </div>
  );
};


export default ImageApprovalCard;
