import React, { useState, useRef } from "react";
import { CustomButton, StatusStamp, Popover } from "./index";
import EditIcon from '@mui/icons-material/Edit';
import "./GalleryCard.scss";

interface GalleryCardProps {
  cardType: "hero" | "gallery";
  image: string;
  imageTag: string;
  imageStatus: "queued" | "approved" | "rejected";
  rejectionReason?: string;
};

const GalleryCard: React.FC<GalleryCardProps> = ({ image, imageTag, imageStatus, rejectionReason, cardType = 'gallery' }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePopoverClick = () => {
    setPopoverVisible(!popoverVisible);
  };


  return (
    <div className="gallery-card-container" ref={cardRef}>
      <div className="gallery-image-container"> 
        <StatusStamp status={imageStatus} className={`stamp ${cardType}`}/>
        
        <img className={`${cardType} gallery-card-image`} src={image} alt={imageTag} />
        
        <CustomButton 
          className={`details-button ${cardType}`} 
          label='Details' 
          buttonType="textOnly"
          onClick={handlePopoverClick}
        />
        
        <EditIcon className={`edit-icon ${cardType}`} />
        
        <Popover
          content={imageStatus === "rejected" && <p>Reason: {rejectionReason}</p>}
          visible={popoverVisible}
          onClose={handlePopoverClick}
          type={cardType}
        />
      </div>
      <div className="gallery-card-info">
        <p>{imageTag}</p>
      </div>
    </div>
  );
};

export default GalleryCard;
