import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Dropdown, Spacer, Carousel, IconBar, CustomModal, EditPropertyModalContent as ModalContent, ActionRequiredCard } from "./index";
import { getImagesByCollectionId } from '../Services';
import { Image } from "../types";
import DefaultHouseImage from "../Images/house_demo_hero_image.png";
import DefaultApartmentImage from "../Images/apartment_demo_hero_image.png";
import { createSlugFromAddress } from "../HelperFunctions/utils";

type PropertyCardProps = {
  propertyAddress: string;
  collectionId: number;
  propertyOwnerId: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  approvalStatus: "UNTAGGED" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
  propertyType: string;
  propertyId?: number;
  propertyDescription: string;
  internalPropertySize: number;
  externalPropertySize: number;
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  propertyAddress,
  collectionId,
  bedrooms,
  bathrooms,
  parkingSpaces,
  propertyDescription,
  internalPropertySize,
  externalPropertySize,
  propertyType,
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);
  const navigate = useNavigate();

  // Get the user type and check if the user is an admin
  const userType = useSelector((state: RootState) => state.user.userDetails?.userType);
  const isAdmin = userType === 'CL_ADMIN';

  const toggleModal = () => setModalOpen(!modalOpen);

  // Placeholder images based on property type
  const defaultImage = propertyType === 'house' ? DefaultHouseImage : DefaultApartmentImage;

  // Fetch images for the collection
  useEffect(() => {
    const fetchImages = async () => {
      if (collectionId && token) {
        try {
          const fetchedImages = await getImagesByCollectionId(collectionId, token);
          setImages(fetchedImages);
        } catch (error) {
          console.error("Error fetching images", error);
        }
      }
    };

    fetchImages();
  }, [collectionId, token]);

  // Helper function to get the most recent image for each tag
  const getMostRecentImagesByTag = (images: Image[]) => {
    const imageMap: { [tag: string]: Image } = {};

    images.forEach((image) => {
      const tag = image.imageTag;
      if (!imageMap[tag] || new Date(image.uploadTime).getTime() > new Date(imageMap[tag].uploadTime).getTime()) {
        imageMap[tag] = image;
      }
    });

    return Object.values(imageMap);
  };

  // Helper function to get the most recent photo update
  const getMostRecentPhoto = (images: Image[]) => {
    if (images.length === 0) return null;
    return images.sort(
      (a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
    )[0];
  };

  // Helper function to get the most recent image needing attention (PENDING)
  const getMostRecentPendingImage = (images: Image[]) => {
    const pendingImages = images.filter(image => image.imageStatus === "PENDING");
    if (pendingImages.length === 0) return null;
    return pendingImages.sort(
      (a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
    )[0];
  };

  // Get the most recent image for each unique tag
  const mostRecentImages = getMostRecentImagesByTag(images);

  // Get the most recent photo
  const mostRecentPhoto = getMostRecentPhoto(images);

  // Get the most recent pending image
  const mostRecentPendingImage = getMostRecentPendingImage(images);

  // Generate the image URLs array for the carousel or fallback to default image
  const displayedImages = mostRecentImages.length > 0 ? mostRecentImages.map(image => image.imageUrl) : [defaultImage];

  // Generate the property slug for navigation
  const propertySlug = createSlugFromAddress(propertyAddress);

  const menuItems = [
    { label: 'Edit Property Details', onClick: toggleModal },
    { label: 'Edit Property Photos', onClick: () => navigate(`/gallery/${propertySlug}`) },
    { label: 'Remove Property', onClick: () => console.log('Remove clicked') },
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
          settingsButton
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        />
      </div>

      {/* Display the Carousel */}
      {displayedImages.length > 0 && (
        <Carousel images={displayedImages} height='300px' width='600px' />
      )}

      {/* Always Render the Card Content */}
      <CardContent>
        <IconBar bedrooms={bedrooms} bathrooms={bathrooms} parkingSpaces={parkingSpaces} internalPropertySize={internalPropertySize} externalPropertySize={externalPropertySize} />
        <Spacer height={0.5} />
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {propertyDescription}
        </Typography>

        {/* Most Recent Photo Update */}
        {mostRecentPhoto && (
          <>
            <Spacer height={1} />
            <ActionRequiredCard
              imageUrl={mostRecentPhoto.imageUrl}
              title="Most Recent Photo Update"
              submittedDateTime={new Date(mostRecentPhoto.uploadTime).toLocaleDateString()}
              description=""
              onButtonClick={() => navigate(`/gallery/${propertySlug}`)}
              cardType="Update"
            />
          </>
        )}

        {/* Most Recent Pending Image */}
        {mostRecentPendingImage && isAdmin && (
          <>
            <Spacer height={1} />
            <ActionRequiredCard
              imageUrl={mostRecentPendingImage.imageUrl}
              title="Images Needing Attention"
              submittedDateTime={new Date(mostRecentPendingImage.uploadTime).toLocaleDateString()}
              description=""
              onButtonClick={() => navigate(`/gallery/${propertySlug}`)}
              cardType="Review"
            />
          </>
        )}
      </CardContent>

      {/* Modal for editing property details */}
      <CustomModal
        modalType='editDetails'
        open={modalOpen}
        onConfirm={() => console.log('Edit Confirmed')}
        onClose={toggleModal}
      >
        <ModalContent
          toggleModal={toggleModal}
          propertyAddress={propertyAddress}
          propertyDescription={propertyDescription}
        />
      </CustomModal>
    </Card>
  );
};

export default PropertyCard;
