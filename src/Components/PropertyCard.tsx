import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Dropdown, Spacer, Carousel, IconBar, CustomModal, EditPropertyModalContent as ModalContent, Popover, CustomButton } from "./index";
import { getImagesByCollectionId } from '../Services';
import { Image } from "../types";
import DefaultHouseImage from "../Images/house_demo_hero_image.png";
import DefaultApartmentImage from "../Images/apartment_demo_hero_image.png";
import { createSlugFromAddress } from "../HelperFunctions/utils";

type PropertyCardProps = {
  propertyAddress: string;
  imageUrl?: string;
  collectionId: number;
  propertyOwnerId: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  approvalStatus: "queued" | "approved" | "rejected";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const token = useSelector((state: RootState) => state.user.token);
  const navigate = useNavigate();

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

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

  // Sort images to prioritize the hero image
  const heroImage = images.find(image => image.imageTag.toLowerCase().includes('hero'));
  const otherImages = images.filter(image => !image.imageTag.toLowerCase().includes('hero'));

  const displayedImages = heroImage ? [heroImage.imageUrl, ...otherImages.map(image => image.imageUrl)] : [];

  // Generate the property slug for navigation
  const propertySlug = createSlugFromAddress(propertyAddress);

  const menuItems = [
    { label: 'Edit Property Details', onClick: toggleModal },
    { label: 'Edit Property Photos', onClick: () => navigate(`/gallery/${propertySlug}`) }, // Use the slug here
    { label: 'Remove Property', onClick: () => console.log('Remove clicked') },
  ];

  const popoverContent = (
    <>
      <Spacer height={0.5} />
      <h2>No Hero Image Available</h2>
      <p>This is the most important image for the presentation of your property.</p>
      <p>Please upload a high-quality hero image of a front-view of the property to make your property stand out.</p>
      <Spacer height={2} />
      <CustomButton label="Upload Hero Image" 
        onClick={() => navigate(`/gallery/${propertySlug}`)}  // Use the slug here as well
        buttonType='uploadButton'
      />
    </>
  );

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

      {/* Display Carousel if images exist, otherwise show the placeholder image */}
      {displayedImages.length > 0 ? (
        <Carousel images={displayedImages} height='300px' width='600px' />
      ) : (
        <div
          style={{ height: '300px', width: '600px', position: 'relative', background: `url(${defaultImage}) center/cover no-repeat` }}
          onClick={() => navigate(`/gallery/${propertySlug}`)} // Use the slug here as well
        >
          <Popover
            content={popoverContent}
            visible={true}
            onClose={() => {}}
            type="property-card"
          />
        </div>
      )}

      <CardContent>
        <IconBar bedrooms={bedrooms} bathrooms={bathrooms} parkingSpaces={parkingSpaces} internalPropertySize={internalPropertySize} externalPropertySize={externalPropertySize} />
        <Spacer height={0.5} />
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {propertyDescription}
        </Typography>
      </CardContent>

      <CustomModal
        modalType='editDetails'
        open={modalOpen}
        onConfirm={() => console.log('clicked')}
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
