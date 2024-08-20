import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Dropdown, Spacer, Carousel, ActionRequiredCard, IconBar } from "./index";

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
  internalPropertySize: number;
  externalPropertySize: number;
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  propertyAddress,
  bedrooms,
  bathrooms,
  parkingSpaces,
  propertyDescription,
  internalPropertySize,
  externalPropertySize,
}) => {
  const isAdmin = true; // For testing purposes
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
        <IconBar bedrooms={bedrooms} bathrooms={bathrooms} parkingSpaces={parkingSpaces} internalPropertySize={internalPropertySize} externalPropertySize={externalPropertySize} />

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
            onButtonClick={() => navigate('/ImageApproval')}
            cardType="Review" />
        }

        {isAdmin && <ActionRequiredCard
            imageUrl={(mostRecentPhoto as any).imageUrl}
            title="Recent photo update"
            submittedDateTime={(mostRecentPhoto as any).uploadTime}
            description="The Owner updated these photos."
            onButtonClick={() => navigate('/Gallery')}
          />}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
