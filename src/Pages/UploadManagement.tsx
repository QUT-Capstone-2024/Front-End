import React from "react";
import { ActionRequiredCard } from "../Components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Box } from "@mui/material";

// Test data
import propertiesData from "../Test Data/sample_properties.json";
import imagesData from "../Test Data/sample_images.json";

// Define the property types explicitly
type PropertyType = "apartment" | "house";

// Hero images mapping based on property type
const heroImages: Record<PropertyType, string> = {
  apartment: "/images/apartment_demo_hero_image.png",
  house: "/images/house_demo_hero_image.png",
};


const UploadManagement = () => {
  const navigate = useNavigate();

  // Filter properties needing review
  const propertiesNeedingReview = propertiesData.filter(
    (property) => property.approvalStatus.toLowerCase() === "queued"
  );

  // For each property, find the correct hero image and latest queued image
  const collectionsNeedingReview = propertiesNeedingReview.map(property => {
    const propertyType = property.propertyType.toLowerCase() as PropertyType;
    
    // Log the property type and corresponding hero image for debugging
    console.log(`Property Type: ${propertyType}`);
    const heroImage = heroImages[propertyType]; // Use fallback image if hero image is not found
    console.log(`Hero Image: ${heroImage}`);
    
    const relatedImages = imagesData.images.filter(image => image.imageStatus.toLowerCase() === "queued");
    const latestImage = relatedImages.length > 0
      ? relatedImages.reduce((latest, current) => {
          return new Date(current.uploadTime) > new Date(latest.uploadTime) ? current : latest;
        })
      : null;
    return {
      ...property,
      heroImage,
      latestImage
    };
  });

  return (
    <div>
      <h1>Upload Management</h1>
      <Card sx={{ 
          backgroundColor: "#e3f2fd", 
          padding: "16px", 
          borderRadius: "8px", 
          boxShadow: 3,
          maxWidth: "900px", 
          margin: "0 auto" 
        }}
      >
        <CardContent>
          {collectionsNeedingReview.map((collection) => (
            <Box 
              key={collection.collectionId} 
              sx={{ 
                marginBottom: "16px", 
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", 
                borderRadius: "8px", 
                overflow: "hidden" 
              }}
            >
              <ActionRequiredCard
                imageUrl={collection.heroImage} // Use the mapped hero image or fallback image
                title="Collection requires review"
                description={collection.propertyAddress}
                submittedDateTime={collection.latestImage ? new Date(collection.latestImage.uploadTime).toLocaleString() : "Unknown"}
                onButtonClick={() => navigate(`/image-approval/${collection.id}`)}
                cardType="Review"
              />
            </Box>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadManagement;
