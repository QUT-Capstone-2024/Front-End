import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardActions, useTheme } from "@mui/material";
import { List, ListItem, ListItemIcon } from "@mui/material";
import { CustomButton } from "./index";
import {
  Bed as BedRoundedIcon,
  Shower as ShowerRoundedIcon,
  Garage as GarageRoundedIcon,
} from "@mui/icons-material";
import localImage from "../Images/house_demo_hero_image.png"; // For testing purposes

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
}) => {
  const theme = useTheme();
  const isAdmin = true; // For testing purposes
  // const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const navigate = useNavigate();

  const getPropertyDetails = () => {
    // For testing purposes
    console.log(`Getting property details for collectionId: ${collectionId}`);
    navigate(`/ImageView`);
    // navigate(`/ImageView/${collectionId}`);
  };

  return (
    <Card sx={{ width: 300, color: theme.palette.background.default }}>
      <CardActionArea onClick={getPropertyDetails}>
        <CardMedia
          component="img"
          image={imageUrl || localImage}
          alt={title}
          sx={{
            height: "160px",
            width: "100%",
            objectFit: "cover",
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5">
            {title}
          </Typography>
          <Typography gutterBottom variant="body1">
            {propertyAddress}
          </Typography>
          <List sx={{ padding: 0 }}>
            <ListItem>
              <ListItem sx={{ padding: 0 }}>
                <ListItemIcon sx={{ color: theme.palette.info.main, minWidth: '30px' }}>
                  <BedRoundedIcon />
                </ListItemIcon>
                <Typography variant="body2">{bedrooms}</Typography>
              </ListItem>
              <ListItem sx={{ padding: 0 }}>
                <ListItemIcon sx={{ color: theme.palette.info.main, minWidth: '30px' }}>
                  <ShowerRoundedIcon />
                </ListItemIcon>
                <Typography variant="body2">{bathrooms}</Typography>
              </ListItem>
              <ListItem sx={{ padding: 0 }}>
                <ListItemIcon sx={{ color: theme.palette.info.main, minWidth: '30px' }}>
                  <GarageRoundedIcon />
                </ListItemIcon>
                <Typography variant="body2">{parkingSpaces}</Typography>
              </ListItem>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                Property Id: {collectionId}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                Property Owner Id: {propertyOwnerId}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography
                variant="body1"
                color={
                  approvalStatus === "approved" ? "" :
                  approvalStatus === "queued" ? theme.palette.warning.main : 
                  approvalStatus === "rejected" ? theme.palette.error.main : ''
                }
              >
                Collection Status: {approvalStatus}
              </Typography>
            </ListItem>
          </List>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          justifyContent: "center",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CustomButton
          buttonType="navButton"
          label={isAdmin ? "Image approval" : "Image view"}
        />
      </CardActions>
    </Card>
  );
};

export default PropertyCard;
