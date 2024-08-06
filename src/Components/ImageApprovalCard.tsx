import React from "react";
import { CustomButton } from "./index";

interface ImageApprovalCardProps {
  image: string;
  imageTag: string;
  imageId: string;
  imageStatus: "queued" | "approved" | "rejected";
};

const ImageApprovalCard: React.FC<ImageApprovalCardProps> = ({ image, imageTag, imageId, imageStatus }) => {
  return (
    <div className="image-approval-container">
      <img className="image-approval-image" src={image} alt="house details" />
      <div className="image-approval-content">
        <div className={`image-approval-text ${imageStatus}`}>
          <p>{imageTag}</p>
          <p className={imageStatus}>{imageStatus.toUpperCase()}</p>
        </div>
        <div className="image-approval-button-wrapper">
          <CustomButton label="View" />
        </div>
      </div>
    </div>
  );
};

export default ImageApprovalCard;
