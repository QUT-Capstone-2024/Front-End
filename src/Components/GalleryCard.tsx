import React, { useState, useRef } from "react";
import { CustomButton, StatusStamp, Popover, CustomModal, EditImageModalContent as ModalContent } from "./index";
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import '../Styles/Cards.scss';

interface GalleryCardProps {
  cardType: "hero" | "gallery";
  image?: string | null;
  imageTag: string;
  imageStatus: "UNTAGGED" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
  rejectionReason?: string;
  imageComments?: string;
  imageDate?: string;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  image,
  imageTag,
  imageStatus,
  rejectionReason,
  cardType = 'gallery',
  imageComments,
  imageDate
}) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(image || null); 
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handlePopoverClick = () => {
    setPopoverVisible(!popoverVisible);
  };

  const handleUpdate = (updatedImage: File | null, updatedTag: string, updatedDescription: string) => {
    if (updatedImage) {
      const imageUrl = URL.createObjectURL(updatedImage);
      setUploadedImage(imageUrl);
    }
    toggleModal();
  };

  const popoverContent = (
    <>
      <p>Uploaded:<br />{imageDate}</p>
      {imageStatus === "REJECTED" ? (
        <p>A new image is required:<br /> {rejectionReason}</p>
      ) : (
        <p>{imageComments}</p>
      )}
    </>
  );

  return (
    <div ref={cardRef} className="gallery-card">
      <div className="gallery-image-container"> 
        {/* Don't show the status if the image is approved or there is no image */}
        {imageStatus !== 'APPROVED' && image && <StatusStamp status={imageStatus} className={`stamp ${cardType}`} />}

        {/* Conditional rendering: Show the uploaded image or an empty placeholder */}
        {uploadedImage ? (
          <img className={`${cardType} gallery-card-image`} src={uploadedImage} alt={imageTag} />
        ) : (
          <div className={`${cardType} gallery-card-image`} />
        )}

        {/* Details button only if an image exists */}
        {uploadedImage && (
          <CustomButton 
            className={`details-button ${cardType}`} 
            label='Details' 
            buttonType="textOnly"
            onClick={handlePopoverClick}
          />
        )}
        
        {/* the upload/edit icon is always visible for editing/uploading */}
        {uploadedImage ?
            <EditIcon className={`edit-icon ${cardType}`} onClick={toggleModal} />
          : 
            <UploadIcon className={`edit-icon ${cardType}`} onClick={toggleModal} />      
        }
        
        {/* Popover to show image details */}
        {uploadedImage && (
          <Popover
            content={popoverContent}
            visible={popoverVisible}
            onClose={handlePopoverClick}
            type={cardType}
          />
        )}
      </div>

      {/* Image tag */}
      <div className="gallery-card-tag">
        <p>{imageTag}</p>
      </div>

      {/* Modal for uploading a new image */}
      <CustomModal
        modalType='editDetails'
        open={modalOpen}
        onConfirm={() => console.log('clicked')}
        onClose={toggleModal}
        title={imageTag}
      >
        <ModalContent 
          image={uploadedImage || ''} 
          imageTag={imageTag} 
          description={imageComments}
          toggleModal={toggleModal} 
          onUpdate={handleUpdate} 
        />
      </CustomModal>
    </div>
  );
};

export default GalleryCard;
