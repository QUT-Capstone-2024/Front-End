import React, { useState } from 'react';
import { GalleryCard, Spacer, Dropdown} from '../Components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Gallery.scss';

// REMOVE: for testing purposes only
import sampleImageData from "../Test Data/sample_images.json";
import samplePropertyData from "../Test Data/sample_properties.json";
import { useNavigate } from 'react-router-dom';
console.log(samplePropertyData);

// REMOVE: for testing purposes only
const isAdmin = true;

const handleEditDetailsClick = () => {
  console.log('Edit Details clicked');
};

const handleEditPhotosClick = () => {
  console.log('Edit Photos clicked');
};

const handleRemovePropertyClick = () => {
  console.log('Remove Property clicked');
};

const menuItems = [
  { label: 'Download Selected', onClick: handleEditDetailsClick },
  { label: isAdmin ? 'Remove Selected' : 'Request removal of Selected', onClick: handleEditPhotosClick },
];

interface GalleryProps {
  propertyId: number;
}




const Gallery: React.FC<GalleryProps> = ({propertyId = 1}) => {
  const navigate = useNavigate();
  const property = samplePropertyData.find((prop) => prop.id === propertyId);
  


  if (!property) {
    return <div>Property not found</div>;
  }
  
  // Separate the Hero card from the rest
  const heroCard = sampleImageData.images.find(image => image.imageTag.includes('Hero'));
  const otherCards = sampleImageData.images.filter(image => !image.imageTag.includes('Hero'));

  // Sort other cards based on status and upload time
  const sortedOtherCards = otherCards.sort((a, b) => {
    const statusOrder = ['pending', 'rejected', 'approved'];
    const statusA = statusOrder.indexOf(a.imageStatus);
    const statusB = statusOrder.indexOf(b.imageStatus);

    if (statusA < statusB) return -1;
    if (statusA > statusB) return 1;

    return new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime();
  });


  return (
    <div className='gallery-container'>
      <Spacer />
      <div className="button-container" >
        <ArrowBackIcon className='back-arrow' onClick={() => navigate(-1)} />
        <Dropdown
              buttonLabel="Settings"
              menuItems={menuItems}
              settingsButton anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
        />
      </div>
      {/* Render the Hero card separately */}
      {heroCard && (
        <>
        <h2 className='address'>{property.propertyAddress}</h2>
        <div className='hero-card-container'>
            <GalleryCard
              key={heroCard.imageId}
              image={heroCard.imageUrl}
              imageTag={heroCard.imageTag.replace('Hero','')}
              imageStatus={heroCard.imageStatus as 'queued' | 'approved' | 'rejected'}
              cardType='hero'
              rejectionReason={heroCard.rejectionReason} />
            <p>{property.propertyDescription}</p>
        </div>
        </>
      )}

      {/* Render the other sorted cards */}
      <div className='other-cards-container'>
        {sortedOtherCards.map((imageData) => (
          <GalleryCard
            key={imageData.imageId}
            image={imageData.imageUrl}
            imageTag={imageData.imageTag}
            imageStatus={imageData.imageStatus as 'queued' | 'approved' | 'rejected'}
            cardType='gallery'
            rejectionReason={imageData.rejectionReason}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
