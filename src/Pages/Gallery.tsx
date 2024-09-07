import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { Spacer, Dropdown, GalleryCard } from '../Components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Gallery.scss';
import { useNavigate } from 'react-router-dom';
import { getImagesByCollectionId, getCollectionById } from '../Services';
import { Image } from '../types';

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Accessing Redux state for selected property and user token
  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const token = useSelector((state: RootState) => state.user.token);
  const userType = useSelector((state: RootState) => state.user.userDetails?.userType);
  const isAdmin = userType === 'CL_ADMIN';

  // Fetch property images and details on component mount
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

  // Handling menu actions
  const menuItems = [
    { label: 'Download Selected', onClick: () => console.log('Download Selected') },
    { label: isAdmin ? 'Remove Selected' : 'Request removal of Selected', onClick: () => console.log('Remove Selected') },
  ];

  // Early return if there's an error or no property data
  if (!propertyDetails || error) {
    return <div>{error || "Property not found"}</div>;
  }

  // Separate Hero card from other images
  const heroCard = images.find((image) => image.imageTag.includes('Hero'));
  const otherCards = images.filter((image) => !image.imageTag.includes('Hero'));

  // Function to render cards for missing images based on property specs
  const renderUploadableCards = () => {
    const uploadableCards = [];

    // Generate cards for each bedroom
    for (let i = 1; i <= propertyDetails.bedrooms; i++) {
      const imageTag = `Bedroom ${i}`;
      const bedroomImage = images.find(image => image.imageTag === imageTag);

      uploadableCards.push(
        <GalleryCard
          key={`bedroom-${i}`}
          cardType="gallery"
          imageTag={`Bedroom ${i}`}
          imageStatus={bedroomImage ? bedroomImage.imageStatus : 'queued'}
          image={bedroomImage ? bedroomImage.imageUrl : null}
          collectionId={selectedPropertyId} // Pass collectionId for uploads
        />
      );
    }

    // Generate cards for bathrooms
    for (let i = 1; i <= propertyDetails.bathrooms; i++) {
      const imageTag = `Bathroom ${i}`;
      const bathroomImage = images.find(image => image.imageTag === imageTag);

      uploadableCards.push(
        <GalleryCard
          key={`bathroom-${i}`}
          cardType="gallery"
          imageTag={`Bathroom ${i}`}
          imageStatus={bathroomImage ? bathroomImage.imageStatus : 'queued'}
          image={bathroomImage ? bathroomImage.imageUrl : null}
          collectionId={selectedPropertyId} // Pass collectionId for uploads
        />
      );
    }

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

          {/* Render the Hero card separately */}
          {heroCard ? (
            <div className='hero-card-container'>
              <GalleryCard
                key={heroCard.imageId}
                image={heroCard.imageUrl}
                imageTag={heroCard.imageTag.replace('Hero', '')}
                imageStatus={heroCard.imageStatus as 'queued' | 'approved' | 'rejected'}
                cardType='hero'
                rejectionReason={heroCard.rejectionReason}
                imageComments={heroCard.imageComments}
                imageDate={heroCard.uploadTime.split('T')[0]}
                collectionId={selectedPropertyId} // Pass collectionId
              />
            </div>
          ) : (
            <div className='hero-card-placeholder'>
              <GalleryCard
                cardType="hero"
                imageTag="Front Image (Hero)"
                imageStatus="queued"
                image={null} 
                collectionId={selectedPropertyId} // Pass collectionId
              />
            </div>
          )}

          {/* Render the other sorted cards */}
          <div className='other-cards-container'>
            {otherCards.map((imageData) => (
              <GalleryCard
                key={imageData.imageId}
                image={imageData.imageUrl}
                imageTag={imageData.imageTag}
                imageStatus={imageData.imageStatus as 'queued' | 'approved' | 'rejected'}
                cardType='gallery'
                rejectionReason={imageData.rejectionReason}
                imageComments={imageData.imageComments}
                imageDate={imageData.uploadTime.split('T')[0]}
                collectionId={selectedPropertyId} // Pass collectionId
              />
            ))}
          </div>

          {/* Render uploadable cards for missing images */}
          <div className="upload-buttons-container">
            {renderUploadableCards()}
          </div>
        </>
      )}
    </div>
  );
};

export default Gallery;
