import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import UploadIcon from '@mui/icons-material/Upload';
import { Dropdown, Spacer, Carousel, IconBar, CustomModal, EditPropertyModalContent as ModalContent, ActionRequiredCard, Popover, CustomButton } from "./index";
import { getImagesByCollectionId } from '../Services';
import { Image } from "../types";
import DefaultHouseImage from "../Images/house_demo_hero_image.png";
import DefaultApartmentImage from "../Images/apartment_demo_hero_image.png";
import { useCheckAuth } from "../Hooks/useCheckAuth";
import { getMostRecentImagesByTagAndInstance, getMostRecentPhoto, getMostRecentPendingImage, createSlugFromAddress } from "../HelperFunctions/utils";

type PropertyCardProps = {
  propertyAddress: string;
  collectionId: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  approvalStatus: "UNTAGGED" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
  propertyType: string;
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
 
  // Component state
  const [images, setImages] = useState<Image[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);
  
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);
  const { isAdmin } = useCheckAuth();
  const defaultImage = propertyType === 'house' ? DefaultHouseImage : DefaultApartmentImage;
  const mostRecentImages = getMostRecentImagesByTagAndInstance(images);
  const mostRecentPhoto = getMostRecentPhoto(images);
  const mostRecentPendingImage = getMostRecentPendingImage(images);
  const noImagesAvailable = mostRecentImages.length === 0;
  const displayedImages = !noImagesAvailable ? mostRecentImages.map(image => image.imageUrl) : [defaultImage];
  const propertySlug = createSlugFromAddress(propertyAddress);

  const menuItems = [
    { label: 'Edit Property Details', onClick: toggleModal },
    { label: 'Edit Property Photos', onClick: () => navigate(`/gallery/${propertySlug}`) },
    { label: 'Remove Property', onClick: () => console.log('Remove clicked') },
  ];

  const popoverContent = (
    <>
      <h2>No images available</h2>
      <p>The "Hero" or front image is the most important image for presenting your property.</p>
      <p>Please start by uploading your "Hero" image.</p>
      <CustomButton 
            withIcon='right'
            icon={<UploadIcon />}
            label="Get Started" 
            onClick={() => navigate(`/gallery/${propertySlug}`)}
            style={{ height: '40px', width: '200px', margin: '1rem 5rem' }} 
          />
    </>
  );

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

      {!noImagesAvailable ? (
          <Carousel images={displayedImages} height="300px" width="600px" />
        ) : (
          <div style={{ position: 'relative' }}>
            <Popover content={popoverContent} visible={true} type='property-card'/>
            <img src={defaultImage} alt="Default" style={{ width: '600px', height: '300px'}} />
          </div>
        )}






      <CardContent>
        <IconBar bedrooms={bedrooms} bathrooms={bathrooms} parkingSpaces={parkingSpaces} internalPropertySize={internalPropertySize} externalPropertySize={externalPropertySize} />
        <Spacer height={0.5} />
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {propertyDescription}
        </Typography>

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

        {mostRecentPendingImage && isAdmin && (
          <>
            <Spacer height={1} />
            <ActionRequiredCard
              imageUrl={mostRecentPendingImage.imageUrl}
              title="Images Needing Attention"
              submittedDateTime={new Date(mostRecentPendingImage.uploadTime).toLocaleDateString()}
              description=""
              onButtonClick={() => navigate(`/ImageApproval`)}
              cardType="Review"
            />
          </>
        )}
      </CardContent>

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
