import React from "react";
import { CustomButton, StatusStamp } from "./index";
import EditIcon from '@mui/icons-material/Edit';
import "./GalleryCard.scss";
import { Edit } from "@mui/icons-material";

interface GalleryCardProps {
  cardType: "hero" | "gallery";
  image: string;
  imageTag: string;
  imageStatus: "queued" | "approved" | "rejected";
  rejectionReason?: string;
};

const GalleryCard: React.FC<GalleryCardProps> = ({ image, imageTag, imageStatus, rejectionReason, cardType = 'gallery' }) => {
  return (
    <div className="gallery-card-container">
      <div className="gallery-image-container">
        <StatusStamp status={imageStatus} className={`stamp ${cardType === 'gallery'? 'gallery' : 'hero'}`}/>
        <img className={`${cardType} gallery-card-image`} src={image} alt={imageTag} />
        <CustomButton className={`details-button ${cardType === 'gallery'? 'gallery' : 'hero'}`} label='Details' buttonType="textOnly" />
        <EditIcon className={`edit-icon ${cardType === 'gallery'? 'gallery' : 'hero'}`}/>
      </div>
      <div className="gallery-card-info">
        <p>Tag: {imageTag}</p>
        <p>Status: {imageStatus}</p>
        {imageStatus === "rejected" && <p>Reason: {rejectionReason}</p>}
      </div>
    </div>
  );
};

export default GalleryCard;