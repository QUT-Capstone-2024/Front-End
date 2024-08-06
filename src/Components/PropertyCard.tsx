import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActions, useTheme, Box, IconButton } from "@mui/material";
import { List, ListItem, ListItemIcon } from "@mui/material";
import { CustomButton, ImageApprovalCard, Spacer } from "./index";
import {
  Bed as BedRoundedIcon,
  Shower as ShowerRoundedIcon,
  Garage as GarageRoundedIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import SampleHouseHeroImage from "../Images/house_demo_hero_image.png";
import SampleApartHeroImage from "../Images/apartment_demo_hero_image.png";

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
}) => {
  const theme = useTheme();
  const isAdmin = true; // For testing purposes
  // const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const navigate = useNavigate();

  // Set default image if image prop is not provided based on the propertyType
  const defaultImage = propertyType === 'house' ? SampleHouseHeroImage : SampleApartHeroImage;

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
        <CardContent>
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
            justifyContent: "space-between",
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <IconButton aria-label="settings">
            <SettingsIcon />
          </IconButton>
          <CustomButton
            buttonType="successButton"
            label={isAdmin ? "Image approval" : "Image view"}
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
        <ImageApprovalCard image={SampleApartHeroImage} imageTag="Bedroom" imageId="" imageStatus="approved"/>
        <ImageApprovalCard image={SampleApartHeroImage} imageTag="Bathroom" imageId="" imageStatus="rejected"/>
        <ImageApprovalCard image={SampleApartHeroImage} imageTag="Dinning Room" imageId="" imageStatus="approved"/>
        <ImageApprovalCard image={SampleApartHeroImage} imageTag="Outside" imageId="" imageStatus="approved"/>
        <ImageApprovalCard image={SampleApartHeroImage} imageTag="Bedroom 2" imageId="" imageStatus="queued"/>
        <ImageApprovalCard image={SampleApartHeroImage} imageTag="Bedroom 3" imageId="" imageStatus="rejected"/>
        <ImageApprovalCard image={SampleApartHeroImage} imageTag="Ensuite" imageId="" imageStatus="approved"/>
        <ImageApprovalCard image={SampleApartHeroImage} imageTag="Pool" imageId="" imageStatus="approved"/>
      </Box>
    </Card>
  );
};

export default PropertyCard;
