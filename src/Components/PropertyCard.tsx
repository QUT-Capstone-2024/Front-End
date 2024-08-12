import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActions, useTheme, Box } from "@mui/material";
import { List, ListItem, ListItemIcon } from "@mui/material";
import { CustomButton, CustomModal, Dropdown, ImageApprovalCard, Spacer } from "./index";
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
  title: string;
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
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  title,
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
}) => {
  const theme = useTheme();
  const isAdmin = false; // For testing purposes
  // const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const navigate = useNavigate();

  // Set default image if image prop is not provided based on the propertyType
  const defaultImage = propertyType === 'house' ? SampleHouseHeroImage : SampleApartHeroImage;

  // Filter, sort, and limit images to 8
  const images = propertyImagesData.images
    .filter(image => image.imageStatus !== 'approved') // Filter out approved images first
    .concat(propertyImagesData.images.filter(image => image.imageStatus === 'approved')) // Add approved images at the end
    .slice(0, 8); // Limit to 8 images

  // Event handlers for dropdown menu items
  const handleEditDetailsClick = () => {
    console.log('Details clicked');
  };

  const handleEditPhotosClick = () => {
    console.log('Photos clicked');
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
    <Card sx={{ backgroundColor: theme.palette.background.default, display: 'flex', borderRadius: '10px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', flex: 1 }}>
        <CardContent sx={{ marginLeft: 1 }}>
          <Typography gutterBottom variant="h5">
            {title}
          </Typography>
          <Typography gutterBottom variant="body1">
            {propertyAddress}
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          image={imageUrl || defaultImage}
          alt={title}
          sx={{
            height: "240px",
            width: "240px",
            objectFit: "cover",
            borderRadius: "10px",
            marginLeft: 3,
          }}
        />
        <CardContent sx={{ height: '35%'}}>
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: 1, marginLeft: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon sx={{ color: theme.palette.info.main, minWidth: '30px' }}>
                <BedRoundedIcon />
              </ListItemIcon>
              <Typography variant="body2">{bedrooms}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon sx={{ color: theme.palette.info.main, minWidth: '30px' }}>
                <ShowerRoundedIcon />
              </ListItemIcon>
              <Typography variant="body2">{bathrooms}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon sx={{ color: theme.palette.info.main, minWidth: '30px' }}>
                <GarageRoundedIcon />
              </ListItemIcon>
              <Typography variant="body2">{parkingSpaces}</Typography>
            </Box>
          </Box>
          <List sx={{ padding: 0 }}>
            <ListItem>
              <Typography variant="body2">
                Property Id: {collectionId}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                Some description here. This will need to be pulled from the CL DB at some point.
              </Typography>
            </ListItem>
            <ListItem>
              <Typography
                variant="body1"
                color={
                  approvalStatus === "approved" ? theme.palette.primary.main :
                  approvalStatus === "queued" ? theme.palette.warning.main :
                  approvalStatus === "rejected" ? theme.palette.error.main : ''
                }
              >
                Collection Status: {approvalStatus.toUpperCase()}
              </Typography>
            </ListItem>
          </List>
        </CardContent>
        <CardActions
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            padding: '0px',
            display: 'flex',
            justifyContent: 'center', 
          }}
        >
          <CustomButton
            buttonType="successButton"
            label={isAdmin ? "Image approval" : "View all images"}
            style={{ marginTop: '10px'}}
          />
        </CardActions>
      </Box>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          padding: 2,
        }}
      >
        <Spacer height={1}/>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Dropdown
            buttonLabel="Settings"
            menuItems={menuItems}
            settingsButton anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }} />
        </Box>

        {images.map(image => (
            <ImageApprovalCard
              key={image.imageId}
              image={image.imageUrl}
              imageTag={image.imageTag}
              imageId={image.imageId}
              imageStatus={image.imageStatus as "approved" | "queued" | "rejected"}
              rejectionReason={image.rejectionReason}
            />
          ))}
      </Box>
    </Card>
  );
};

export default PropertyCard;
