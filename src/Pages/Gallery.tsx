import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { Spacer, Dropdown, GalleryCard, CustomButton, CustomModal, EditImageModalContent as ModalContent } from '../Components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadIcon from '@mui/icons-material/Upload';
import Checkbox from '@mui/material/Checkbox'; // Import the Checkbox component
import './Gallery.scss';
import { useNavigate } from 'react-router-dom';
import { getImagesByCollectionId, getCollectionById, removeImageFromCollection } from '../Services';
import { Image } from '../types';
import { ImageTags } from '../Constants/ImageTags';
import { saveAs } from 'file-saver';
import { JSX } from 'react/jsx-runtime';

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // Track selected images by their tags
  const [propertyDetails, setPropertyDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [removedCards, setRemovedCards] = useState<string[]>([]); // Track removed placeholder cards

  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const token = useSelector((state: RootState) => state.user.token);
  const userType = useSelector((state: RootState) => state.user.userDetails?.userType);
  const isAdmin = userType === 'CL_ADMIN';

  // State for modal management
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageTag, setModalImageTag] = useState<string | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const openModalForUpload = (imageTag: string) => {
    setModalImageTag(imageTag);
    setModalImageUrl(null); // This will be for new image uploads
    toggleModal();
  };

  useEffect(() => {
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
    fetchPropertyData();
  }, [selectedPropertyId, token]);

  const menuItems = [
    { 
      label: 'Download Selected', 
      onClick: () => handleDownloadSelected() 
    },
    { 
      label: isAdmin ? 'Remove Selected' : 'Request removal of Selected', 
      onClick: () => handleRemoveSelected() 
    },
  ];

  // Function to handle image download
  const handleDownloadSelected = () => {
    const selectedImageObjects = images.filter(image => selectedImages.includes(image.imageTag));
    selectedImageObjects.forEach((image) => {
      saveAs(image.imageUrl, `${image.imageTag}.jpg`); // Download each selected image using file-saver
    });
  };

  // Function to handle image removal
  const handleRemoveSelected = async () => {
    if (!selectedPropertyId) {
      console.error('Selected property ID is null. Cannot remove images.');
      return;
    }
  
    const selectedImageObjects = images.filter(image => selectedImages.includes(image.imageTag));
  
    for (const image of selectedImageObjects) {
      const imageIdAsNumber = parseInt(image.imageId, 10); // Convert imageId to number
  
      if (isNaN(imageIdAsNumber)) {
        console.error('Invalid image ID, could not convert to number:', image.imageId);
        continue;
      }
  
      try {
        // Use the removeImageFromCollection service, passing imageIdAsNumber
        await removeImageFromCollection(selectedPropertyId, imageIdAsNumber, token!);
        // Remove the image from the UI after successful removal
        setImages((prevImages) => prevImages.filter(img => img.imageId !== image.imageId));
        setSelectedImages((prevSelected) => prevSelected.filter(tag => tag !== image.imageTag));
      } catch (error) {
        console.error('Error removing image:', error);
      }
    }
  };
  
  
  

  // Helper function to get the latest image by tag
  const getLatestImagesByTag = (images: Image[]) => {
    const imageMap: { [tag: string]: Image } = {};

    images.forEach((image) => {
      const existingImage = imageMap[image.imageTag];
      // If no image for the tag exists, or if the current image is newer, replace it
      if (!existingImage || new Date(image.uploadTime) > new Date(existingImage.uploadTime)) {
        imageMap[image.imageTag] = image;
      }
    });

    return imageMap; // Return the latest image map by tag
  };

  // Get the latest images
  const latestImages = getLatestImagesByTag(images);

  // Separate the Hero card from the rest of the images by selecting the FRONT tag
  const heroCard = latestImages["FRONT"];
  const otherCards = Object.values(latestImages).filter((image) => image.imageTag !== 'FRONT');

  // Function to handle removing a placeholder card
  const handleRemoveCard = (tag: string) => {
    setRemovedCards((prev) => [...prev, tag]); // Add the tag to the removed cards list
  };

  // Function to handle selecting or deselecting an image
  const handleSelectImage = (imageTag: string) => {
    if (selectedImages.includes(imageTag)) {
      setSelectedImages(selectedImages.filter(tag => tag !== imageTag)); // Deselect the image
    } else {
      setSelectedImages([...selectedImages, imageTag]); // Select the image
    }
  };

  // Function to generate GalleryCards based on missing images
  const renderUploadableCards = () => {
    const uploadableCards: JSX.Element[] = [];

    // Handle dynamic creation based on property specs
    const specs = [
      { key: 'bedrooms', tag: 'BEDROOM', displayName: 'Bedroom' },
      { key: 'bathrooms', tag: 'BATHROOM', displayName: 'Bathroom' },
      { key: 'parkingSpaces', tag: 'GARAGE', displayName: 'Garage' },
    ];

    specs.forEach(({ key, tag, displayName }) => {
      const count = propertyDetails[key]; // Get the number of bedrooms, bathrooms, etc.
      const existingImages = Object.values(latestImages).filter((image) => image.imageTag === tag); // Get already uploaded images by tag
      const missingCount = count - existingImages.length; // Calculate missing images

      // Add placeholders for missing images
      for (let i = 1; i <= missingCount; i++) {
        const imageTag = count > 1 ? `${displayName} ${existingImages.length + i}` : displayName; // If more than one, show number

        // Only render the card if it hasn't been removed
        if (!removedCards.includes(imageTag)) {
          uploadableCards.push(
            <div key={`${displayName}-${i}`} className="placeholder-card">
              <GalleryCard
                cardType="gallery"
                imageTag={imageTag}
                imageStatus="PENDING"
                image={null} // Placeholder, since there's no image yet
              />
            </div>
          );
        }
      }
    });

    return uploadableCards;
  };

  const handleUpdate = (updatedImage: File | null, updatedTag: string, updatedDescription: string) => {
    // This is where you would handle the image update, e.g., upload the image to the server.
    console.log("Image updated:", updatedImage, updatedTag, updatedDescription);
    toggleModal();
  };

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

          {/* Render the Hero card with the FRONT tag */}
          {heroCard ? (
            <div className='hero-card-container'>
              <GalleryCard
                key={heroCard.imageId}
                image={heroCard.imageUrl}
                imageTag={heroCard.imageTag.replace('FRONT', 'Hero Image (property front)')}
                imageStatus={heroCard.imageStatus as "UNTAGGED" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED"}
                cardType='hero'
                rejectionReason={heroCard.rejectionReason}
                imageComments={heroCard.imageComments}
                imageDate={heroCard.uploadTime.split('T')[0]}
              />
              <Checkbox
                  checked={selectedImages.includes('FRONT')}
                  onChange={() => handleSelectImage('FRONT')}
                  sx={{ alignSelf: 'flex-start' }}
                />
            </div>
          ) : (
            <div className='hero-card-container'>
              <GalleryCard
                cardType="hero"
                imageTag=""
                imageStatus="PENDING"
                image={null} 
              />
            </div>
          )}

          {/* Render the other sorted cards */}
          <div className='other-cards-container'>
            {otherCards.map((imageData) => (
              <div key={imageData.imageId} className='gallery-card-checkbox'> 
                <GalleryCard
                  key={imageData.imageId}
                  image={imageData.imageUrl}
                  imageTag={ImageTags.find(tag => tag.name === imageData.imageTag)?.displayName || imageData.imageTag}
                  imageStatus={imageData.imageStatus as "UNTAGGED" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED"}
                  cardType='gallery'
                  rejectionReason={imageData.rejectionReason}
                  imageComments={imageData.imageComments}
                  imageDate={imageData.uploadTime.split('T')[0]}
                />
                <Checkbox
                  checked={selectedImages.includes(imageData.imageTag)}
                  onChange={() => handleSelectImage(imageData.imageTag)}
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
    </div>
  );
};

export default Gallery;
