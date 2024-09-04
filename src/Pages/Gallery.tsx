import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store'; // Correct import for Redux store
import { GalleryCard, Spacer, Dropdown } from '../Components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Gallery.scss';
import { useNavigate } from 'react-router-dom';

// REMOVE: for testing purposes only
import sampleImageData from "../Test Data/sample_images.json";
import samplePropertyData from "../Test Data/sample_properties.json";

const Gallery: React.FC = () => {
  const navigate = useNavigate();

  // Get the selected propertyId from the Redux store
  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);

  // Find the property from sample data based on the selectedPropertyId
  const property = samplePropertyData.find((prop) => prop.id === selectedPropertyId);
  const userType = useSelector((state: RootState) => state.user.userDetails?.userType);
  const isAdmin = userType === 'CL_ADMIN';

  const menuItems = [
    { label: 'Download Selected', onClick: () => console.log('Download Selected') },
    { label: isAdmin ? 'Remove Selected' : 'Request removal of Selected', onClick: () => console.log('Remove Selected') },
  ];

  if (!property) {
    return <div>Property not found</div>;
  }

  // Separate the Hero card from the rest of the images
  const heroCard = sampleImageData.images.find((image) => image.imageTag.includes('Hero'));
  const otherCards = sampleImageData.images.filter((image) => !image.imageTag.includes('Hero'));

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

      {property && (
        <>
          <h2 className='address'>{property.propertyAddress}</h2>

          {/* Render the Hero card separately */}
          {heroCard && (
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
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Gallery;
