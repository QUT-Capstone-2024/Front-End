import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { CustomButton, CustomModal, Dropdown, ImageApprovalCard, Spacer, Carousel, ActionRequiredCard, SquareFootIcon } from "./index";
import {
  Bed as BedRoundedIcon,
  Shower as ShowerRoundedIcon,
  Garage as GarageRoundedIcon,
} from "@mui/icons-material";
import SampleHouseHeroImage from "../Images/house_demo_hero_image.png";
import SampleApartHeroImage from "../Images/apartment_demo_hero_image.png";

// REMOVE: Test data
import propertyImagesData from "../Test Data/sample_images.json";

type PropertyCardProps = {
  propertyAddress: string;
  imageUrl?: string;
  collectionId: string;
  propertyOwnerId: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  approvalStatus: "queued" | "approved" | "rejected";
  propertyType: string;
  propertyId?: string;
  propertyDescription: string;
  propertySize: number;
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  propertyAddress,
  imageUrl,
  collectionId,
  propertyOwnerId,
  bedrooms,
  bathrooms,
  parkingSpaces,
  approvalStatus,
  propertyType,
  propertyId,
  propertyDescription,
  propertySize,
}) => {
  const isAdmin = false; // For testing purposes
  // const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const navigate = useNavigate();

  // Order images by hero tag first
  const heroTag = 'Hero';
  const imageUrls = propertyImagesData.images
    .filter(image => image.imageTag.toLowerCase().includes(heroTag.toLowerCase()))
    .concat(
      propertyImagesData.images
        .filter(image => !image.imageTag.toLowerCase().includes(heroTag.toLowerCase()))
    )
    .map(image => image.imageUrl);
  
  // Get the latest pending image
  const queuedImages = propertyImagesData.images.filter(image => image.imageStatus.toLowerCase() === 'queued');
  const latestPendingImage = queuedImages.length > 0
    ? queuedImages.reduce((latest, current) => {
        return new Date(current.uploadTime) > new Date(latest.uploadTime) ? current : latest;
      })
    : null;

  // Get the most recently updated image
  const mostRecentPhoto = propertyImagesData.images
  .reduce((latest, current) => {
    const latestDate = new Date(latest.uploadTime.trim().replace(" T", "T"));
    const currentDate = new Date(current.uploadTime.trim().replace(" T", "T")); 
    return currentDate > latestDate ? current : latest;
  }, propertyImagesData.images[0]);


  // Event handlers for dropdown menu items
  const handleEditDetailsClick = () => {
    navigate('/');
  };

  const handleEditPhotosClick = () => {
    console.log('Photos clicked');
    navigate('/gallery');
  };
 
  const handleRemovePropertyClick = () => {
    console.log('Remove clicked');
  };

  const menuItems = [
    { label: 'Edit Property Details', onClick: handleEditDetailsClick },
    { label: 'Edit Property Photos', onClick: handleEditPhotosClick },
    ...(isAdmin ? 
      [{ label: 'Remove Ownership', onClick: handleRemovePropertyClick }] 
        : 
      [{ label: 'Remove Property', onClick: handleRemovePropertyClick }]),
  ];

  return (
    <Card sx={{ padding: 0, margin: 0, width: '100%', maxWidth: '600px', height: 'auto', borderRadius: '8px', backgroundColor: '#eff7fe', boxShadow: 5 }}>
        <div className="address-title">
          <Typography variant="h5" sx={{ margin: '10px', maxWidth: '80%' }}>
            {propertyAddress}
          </Typography>
          <Dropdown
            buttonLabel="Settings"
            menuItems={menuItems}
            settingsButton anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }} />
        </div>
      <Carousel images={imageUrls} height='300px' width='600px' />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 0' }} className="property-details-container">
          <BedRoundedIcon sx={{ margin: '0 8px', fontSize: 24}} />
          <span style={{ paddingRight: '1rem'}}>{bedrooms}</span>
          <ShowerRoundedIcon sx={{ margin: '0 8px', fontSize: 24 }} />
          <span style={{ paddingRight: '1rem'}}>{bathrooms}</span>
          <GarageRoundedIcon sx={{ margin: '0 8px', fontSize: 24 }} />
          <span style={{ paddingRight: '1rem'}}>{parkingSpaces}</span>
          <SquareFootIcon />
          <span style={{ paddingRight: '1rem', paddingLeft: '3px'}}>{propertySize}</span>
        </Box>

        <Spacer height={0.5} /> 
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {propertyDescription}
        </Typography>
      
        {latestPendingImage !== null && 
          <ActionRequiredCard
            imageUrl={(latestPendingImage as any).imageUrl}
            title={isAdmin ? 'Photo requires review' : 'Pending photo update'}
            submittedDateTime={(latestPendingImage as any).uploadTime}
            description="The Owner updated these photos."
            onButtonClick={() => alert('Button clicked')}
            cardType="Review" />
        }

        {isAdmin && <ActionRequiredCard
            imageUrl={(mostRecentPhoto as any).imageUrl}
            title="Recent photo update"
            submittedDateTime={(mostRecentPhoto as any).uploadTime}
            description="The Owner updated these photos."
            onButtonClick={() => alert('Button clicked')}
          />}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
