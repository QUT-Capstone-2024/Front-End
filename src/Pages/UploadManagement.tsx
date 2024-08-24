import React from "react";
import { ActionRequiredCard } from "../Components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Box } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

// Test data
import propertiesData from "../Test Data/sample_properties.json";
import imagesData from "../Test Data/sample_images.json";

const UploadManagement = () => {
  const navigate = useNavigate();

  // Filter properties needing review
  const propertiesNeedingReview = propertiesData.filter(
    (property) => property.approvalStatus.toLowerCase() === "queued"
  );

  // For each property, find the latest queued image
  const collectionsNeedingReview = propertiesNeedingReview.map((property) => {
    const relatedImages = imagesData.images.filter(
      (image) => image.imageStatus.toLowerCase() === "queued"
    );

    const latestImage = relatedImages.length > 0
      ? relatedImages.reduce((latest, current) => {
          const latestDate = new Date(latest.uploadTime.trim().replace(" T", "T"));
          const currentDate = new Date(current.uploadTime.trim().replace(" T", "T")); 
          return currentDate > latestDate ? current : latest;
        })
      : null;

    return {
      ...property,
      latestImage,
    };
  });

  return (
    <div style={{ padding: '20px', backgroundColor: '#e2eaf1', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh' }}>
      <Card sx={{ 
          backgroundColor: "#eff7fe", 
          padding: "16px", 
          borderRadius: "8px", 
          boxShadow: 3,
          maxWidth: "900px", 
          margin: "0 auto" 
        }}
      >
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <ArrowBackIcon style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate(-1)} />
            <h1 style={{ textAlign: 'left', color: '#0b517d', fontSize: '2rem', margin: '0' }}>
              UPLOAD MANAGEMENT
            </h1>
          </div>

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
                imageUrl={collection.latestImage?.imageUrl || ""}
                title={`PROPERTY: ${collection.collectionId.toUpperCase()} REQUIRES REVIEW`}
                description={collection.propertyAddress}
                submittedDateTime={
                  collection.latestImage
                    ? `UPLOADED: ${new Date(collection.latestImage.uploadTime.trim().replace(" T", "T")).toISOString().replace('T', ' ').split('.')[0]}Z`
                    : "Unknown"
                }
                onButtonClick={() => navigate(`/image-approval/${collection.collectionId}`)}  
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
