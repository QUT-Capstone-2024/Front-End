import React, { useState, useRef } from "react";
import { CustomButton, StatusStamp, Popover, CustomModal, EditImageModalContent as ModalContent } from "./index";
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
  const [modalOpen, setModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handlePopoverClick = () => {
    setPopoverVisible(!popoverVisible);
  };


  return (
    <div ref={cardRef}>
      <div className="gallery-image-container"> 
        {imageStatus !== 'approved' && <StatusStamp status={imageStatus} className={`stamp ${cardType}`}/>}
        
        <img className={`${cardType} gallery-card-image`} src={image} alt={imageTag} />
        
        <CustomButton 
          className={`details-button ${cardType}`} 
          label='Details' 
          buttonType="textOnly"
          onClick={handlePopoverClick}
        />
        
        <EditIcon className={`edit-icon ${cardType}`} onClick={() => setModalOpen(true)} />
        
        <Popover
          content={imageStatus === "rejected" && <p>Reason: {rejectionReason}</p>}
          visible={popoverVisible}
          onClose={handlePopoverClick}
          type={cardType}
        />
      </div>
      <div className="gallery-card-tag">
        <p>{imageTag}</p>
      </div>

      <CustomModal
        modalType='editDetails'
        open={modalOpen}
        onConfirm={() => console.log('clicked')}
        onClose={toggleModal}
        label={imageTag}
      >
        <ModalContent 
          image={image} 
          imageTag={imageTag} 
          toggleModal={toggleModal} 
        />
      </CustomModal>
    </div>
  );
};

export default GalleryCard;
