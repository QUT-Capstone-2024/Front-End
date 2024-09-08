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

    return Object.values(imageMap); // Return the latest image for each tag
  };

  // Get the latest images
  const latestImages = getLatestImagesByTag(images);

  // Separate the Hero card from the rest of the images by selecting the FRONT tag
  const heroCard = latestImages.find((image) => image.imageTag.includes('FRONT'));
  const otherCards = latestImages.filter((image) => !image.imageTag.includes('FRONT'));

  // Function to generate GalleryCards based on missing images
  const renderUploadableCards = () => {
    const uploadableCards = [];

    // Generate cards for each bedroom
    for (let i = 1; i <= propertyDetails.bedrooms; i++) {
      const imageTag = `Bedroom ${i}`;
      const bedroomImage = latestImages.find(image => image.imageTag === imageTag);

      uploadableCards.push(
        <GalleryCard
          key={`bedroom-${i}`}
          cardType="gallery"
          imageTag={`Bedroom ${i}`}
          imageStatus={bedroomImage ? bedroomImage.imageStatus : 'PENDING'}
          image={bedroomImage ? bedroomImage.imageUrl : null}
        />
      );
    }

    // Generate cards for bathrooms, kitchens, etc.
    for (let i = 1; i <= propertyDetails.bathrooms; i++) {
      const imageTag = `Bathroom ${i}`;
      const bathroomImage = latestImages.find(image => image.imageTag === imageTag);

      uploadableCards.push(
        <GalleryCard
          key={`bathroom-${i}`}
          cardType="gallery"
          imageTag={`Bathroom ${i}`}
          imageStatus={bathroomImage ? bathroomImage.imageStatus : 'PENDING'}
          image={bathroomImage ? bathroomImage.imageUrl : null}
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
            <div className='hero-card-placeholder'>
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
                imageTag={imageData.imageTag}
                imageStatus={imageData.imageStatus as "UNTAGGED" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED"}
                cardType='gallery'
                rejectionReason={imageData.rejectionReason}
                imageComments={imageData.imageComments}
                imageDate={imageData.uploadTime.split('T')[0]}
              />
            ))}
            {/* Placeholder cards based on the property specs */}
            {renderUploadableCards()}
          </div>
        </>
      )}
    </div>
  );
};

export default Gallery;
