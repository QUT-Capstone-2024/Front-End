import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { Spacer, Dropdown, GalleryCard } from '../Components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Gallery.scss';
import { useNavigate } from 'react-router-dom';
import { getImagesByCollectionId, getCollectionById } from '../Services';
import { Image } from '../types';
import { ImageTags } from '../Constants/ImageTags';
import { JSX } from 'react/jsx-runtime';

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const token = useSelector((state: RootState) => state.user.token);
  const userType = useSelector((state: RootState) => state.user.userDetails?.userType);
  const isAdmin = userType === 'CL_ADMIN';

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
    { label: 'Download Selected', onClick: () => console.log('Download Selected') },
    { label: isAdmin ? 'Remove Selected' : 'Request removal of Selected', onClick: () => console.log('Remove Selected') },
  ];

  if (!propertyDetails || error) {
    return <div>{error || "Property not found"}</div>;
  }

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

        uploadableCards.push(
          <GalleryCard
            key={`${displayName}-${i}`}
            cardType="gallery"
            imageTag={imageTag}
            imageStatus="PENDING"
            image={null} // Placeholder, since there's no image yet
          />
        );
      }
    });

    return uploadableCards;
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
            ))}
            {/* Dynamically render uploadable cards based on property specs */}
            {renderUploadableCards()}
          </div>
        </>
      )}
    </div>
  );
};

export default Gallery;
