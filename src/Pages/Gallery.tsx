import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { Spacer, Dropdown, GalleryCard, CustomButton, CustomModal, EditImageModalContent as ModalContent, DeleteModalContent, CustomAlert } from '../Components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadIcon from '@mui/icons-material/Upload';
import Checkbox from '@mui/material/Checkbox';
import './Gallery.scss';
import { useNavigate } from 'react-router-dom';
import { getImagesByCollectionId, getCollectionById, removeImageFromCollection, archiveImageFromCollection } from '../Services';
import { Image } from '../types';
import { ImageTags } from '../Constants/ImageTags';
import { saveAs } from 'file-saver';
import { JSX } from 'react/jsx-runtime';
import { useCheckAuth } from '../Hooks/useCheckAuth';
import * as Img from '../Images';

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // Track selected images by their tags
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]); // Track selected images by their ids
  const [propertyDetails, setPropertyDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [removedCards, setRemovedCards] = useState<string[]>([]); // Track removed placeholder cards

  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const token = useSelector((state: RootState) => state.user.token);
  
  const { userType } = useCheckAuth();
  const isGod = userType === 'HARBINGER';

  // State for modal management
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageTag, setModalImageTag] = useState<string | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<"info" | "warning" | "error" | "success">('info');

  const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);

  const handleAlertClose = () => {
    setMessage('')
    setMessageType('info')
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const openModalForUpload = (imageTag: string) => {
    setModalImageTag(imageTag);
    setModalImageUrl(null); // This will be for new image uploads
    toggleModal();
  };

  const fetchPropertyData = async () => {
    if (selectedPropertyId && token) {
      try {
        const fetchedImages = await getImagesByCollectionId(selectedPropertyId, token);
        const fetchedPropertyDetails = await getCollectionById(selectedPropertyId, token);
        setImages(fetchedImages);
        setPropertyDetails(fetchedPropertyDetails);
      } catch (error) {
        console.error("Error fetching property data:", error);
        setError("Failed to fetch property data.");
      }
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [selectedPropertyId, token]);

  const menuItems = [
    { 
      label: 'Download Selected', 
      onClick: () => handleDownloadSelected() 
    },
    { 
      label: isGod ? 'Delete Selected' : 'Remove Selected', 
      onClick: () => toggleDeleteModal() 
    },
  ];

  // Function to handle image download
  const handleDownloadSelected = () => {
    const selectedImageObjects = images.filter(image => selectedImageIds.includes(image.id));

    selectedImageObjects.forEach((image, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = image.imageUrl;
        link.download = `${image.imageTag}-${image.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the DOM after the download
      }, index * 500);
    });
  };


  // Function to handle image removal
  const handleRemoveSelected = async () => {
    if (!selectedPropertyId) {
      console.error('Selected property ID is null. Cannot remove images.');
      return;
    }
  
    // Map selected image IDs to their corresponding image objects
    const selectedImageObjects = images.filter(image => selectedImageIds.includes(Number(image.id)));
  
    if (selectedImageObjects.length === 0) {
      console.error('No matching images found for selected IDs.');
      return;
    }
  
    for (const image of selectedImageObjects) {
      // Check if the imageId is valid
      const imageIdAsNumber = Number(image.id);
  
      if (isNaN(imageIdAsNumber)) {
        console.error('Invalid image ID, could not convert to number:', image.id);
        continue;
      }
  
      try {
        // Call the appropriate API function
        if (isGod) {
          await removeImageFromCollection(selectedPropertyId, imageIdAsNumber, token!);
        } else {
          await archiveImageFromCollection(selectedPropertyId, imageIdAsNumber, token!);
        }
  
        // Update the state after successful removal
        setImages((prevImages) => prevImages.filter(img => img.id !== image.id));
        setSelectedImages((prevSelected) => prevSelected.filter(tag => tag !== image.imageTag));
        setSelectedImageIds((prevIds) => prevIds.filter(id => id !== imageIdAsNumber));
        toggleDeleteModal();
      } catch (error) {
        console.error('Error removing image:', error);
      }
    }
  };
  
  
  // Function to handle selecting or deselecting an image
  const handleSelectImage = (imageId: number) => {
  // If the image is already selected, deselect it
  if (selectedImageIds.includes(imageId)) {
    setSelectedImageIds(selectedImageIds.filter(id => id !== imageId));
  } else {
    setSelectedImageIds([...selectedImageIds, imageId]);
  }
};

  const getLatestImagesByTagAndInstance = (images: Image[]) => {
    const imageMap: { [tagInstance: string]: Image } = {};
  
    images.forEach((image) => {
      const tagWithInstance = `${image.imageTag}-${image.instanceNumber}`;
      const existingImage = imageMap[tagWithInstance];
      if (!existingImage || new Date(image.uploadTime) > new Date(existingImage.uploadTime)) {
        imageMap[tagWithInstance] = image;
      }
    });
    return imageMap;
  };
  

  // Get the latest images
  const latestImages = getLatestImagesByTagAndInstance(images);

  // Separate the Hero card from the rest of the images by selecting the STREET tag
  const heroCard = latestImages["STREET-0"];
  const otherCards = Object.values(latestImages).filter((image) => image.imageTag !== 'STREET');

  // Function to generate GalleryCards based on missing images
  const renderUploadableCards = () => {
    const uploadableCards: JSX.Element[] = [];
  
    // Handle dynamic creation based on property specs
    const specs = [
      { key: 'bedrooms', tag: 'BEDROOM', displayName: 'Bedroom' },
      { key: 'bathrooms', tag: 'BATHROOM', displayName: 'Bathroom' },
      { key: 'dinningRoom', tag: 'DINNING', displayName: 'Dining Room', defaultCount: 1 },
      { key: 'kitchen', tag: 'KITCHEN', displayName: 'Kitchen', defaultCount: 1 },
      { key: 'livingRoom', tag: 'LIVINGROOM', displayName: 'Living Room', defaultCount: 1 },
    ];
  
    const tagToImageMap: { [key: string]: string } = {
      BEDROOM: Img.bedroom,
      BATHROOM: Img.bathroom,
      DINNING: Img.dinning,
      KITCHEN: Img.kitchen,
      LIVINGROOM: Img.lounge,
    };
  
    specs.forEach(({ key, tag, displayName, defaultCount }) => {
      const count = key in propertyDetails ? propertyDetails[key] : defaultCount || 0;
      const existingImages = Object.values(latestImages).filter((image) => image.imageTag === tag);
      const missingCount = count - existingImages.length;
  
      for (let i = 1; i <= missingCount; i++) {
        let imageTag = displayName;  // Keep display name as is
  
        if (!removedCards.includes(imageTag)) {
          uploadableCards.push(
            <div key={`${displayName}-${i}`} className="placeholder-card">
              <GalleryCard
                isPlaceholder={true}
                cardType="gallery"
                imageTag={imageTag}  // Pass only the clean display name
                imageStatus="UNTAGGED"
                image={tagToImageMap[tag]}
                imageInstance={existingImages.length + i} // Pass the instance number to the card
              />
            </div>
          );
        }
      }
    });
  
    return uploadableCards;
  };
  
  const handleUpdate = (updatedImage: File | null, updatedTag: string, updatedDescription: string) => {
    fetchPropertyData();
    toggleModal();
  };

  //////////////////////////////////////// RENDER
  return (
    <div className='gallery-container'>
      <Spacer />
      <div className="button-container">
        <ArrowBackIcon className='back-arrow' onClick={() => navigate(-1)} />
        <Dropdown
          buttonLabel="Settings"
          menuItems={menuItems}
          settingsButton
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        />
      </div>

      {propertyDetails && (
        <>
          <h2 className='address'>{propertyDetails.propertyAddress}</h2>

          {/* Upload Button */}
          <CustomButton 
            withIcon='right'
            icon={<UploadIcon />}
            label="Upload an Image" 
            onClick={() => openModalForUpload("HERO_IMAGE")}
            style={{ height: '40px', width: '200px', margin: '1rem 5rem' }} 
          />
          <Spacer height={0.5}/>

          {/* Render the Hero card with the STREET tag */}
          {heroCard ? (
            <div className='hero-card-container'>
              <GalleryCard
                key={heroCard.id}
                image={heroCard.imageUrl}
                imageTag="Hero Image (property front)"
                imageStatus={heroCard.imageStatus as "UNTAGGED" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED"}
                cardType='hero'
                rejectionReason={heroCard.rejectionReason}
                imageComments={heroCard.imageComments}
                imageDate={heroCard.uploadTime.split('T')[0]}
              />
              <Checkbox
                checked={selectedImageIds.includes(heroCard.id)}
                onChange={() => handleSelectImage(Number(heroCard.id))}
                sx={{ alignSelf: 'flex-start' }}
              />
            </div>
          ) : (
            <div className='hero-card-container'>
              <GalleryCard
                isPlaceholder={true}
                cardType="hero"
                imageTag="Hero Image (property front)"
                imageStatus="UNTAGGED"
                image={Img.house} 
              />
            </div>
          )}

          {/* Render the other sorted cards */}
          <div className='other-cards-container'>
            {otherCards.map((imageData) => (
              <div key={imageData.id} className='gallery-card-checkbox'> 
                <GalleryCard
                  key={imageData.id}
                  image={imageData.imageUrl}
                  imageTag={ImageTags.find(tag => tag.name === imageData.imageTag)?.displayName || imageData.imageTag}
                  imageStatus={imageData.imageStatus as "UNTAGGED" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED"}
                  cardType='gallery'
                  rejectionReason={imageData.rejectionReason}
                  imageComments={imageData.imageComments}
                  imageDate={imageData.uploadTime.split('T')[0]}
                  imageInstance={imageData.instanceNumber}
                />
                <Checkbox
                  checked={selectedImageIds.includes(imageData.id)}
                  onChange={() => handleSelectImage(Number(imageData.id))}
                />
              </div>
            ))}
            {/* Dynamically render uploadable cards based on property specs */}
            {renderUploadableCards()}
          </div>
        </>
      )}

      {/* Modal for uploading new images */}
      <CustomModal
        modalType='editDetails'
        open={modalOpen}
        onConfirm={() => console.log('clicked')}
        onClose={toggleModal}
        title={modalImageTag || ''}
      >
        <ModalContent 
          image={modalImageUrl || ''} 
          imageTag={modalImageTag || ''} 
          description={''} // Empty since it's a new image
          toggleModal={toggleModal} 
          onUpdate={handleUpdate} 
        />
      </CustomModal>

      {/* Modal for archiving/deleting property */}
      <CustomModal
        modalType='delete'
        open={deleteModalOpen}
        onConfirm={handleRemoveSelected}
        onClose={toggleDeleteModal}
      >
        <DeleteModalContent type='image' />
      </CustomModal>

      {/* Handle all alerts for the component */}
      <CustomAlert 
        isVisible={message !== ''}
        type={messageType}
        message={message}
        onClose={handleAlertClose}
      />
    </div>
  );
};

export default Gallery;
