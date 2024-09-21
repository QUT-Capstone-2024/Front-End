import React, { useEffect, useState } from "react";
import { ActionRequiredCard } from "../Components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Box, Typography } from "@mui/material";

// Define the interfaces for the data
interface Image {
  uploadTime: string;
  [key: string]: any;
}

interface Property {
  collectionId: string;
  approvalStatus: string;
  propertyAddress: string;
  [key: string]: any;
}

const UploadManagement = () => {
  const [collectionsNeedingReview, setCollectionsNeedingReview] = useState<Property[]>([]);
  const navigate = useNavigate();

  // Function to fetch data from the API
  const fetchPropertiesAndImages = async () => {
    try {
      // Replace these with your actual API endpoints
      const propertiesResponse = await fetch("/api/properties"); // API call to fetch properties
      const imagesResponse = await fetch("/api/images"); // API call to fetch images

      if (propertiesResponse.ok && imagesResponse.ok) {
        const propertiesData: Property[] = await propertiesResponse.json();
        const imagesData: { images: Image[] } = await imagesResponse.json();

        const findLatestQueuedImage = (images: Image[]): Image | null =>
          images.length > 0
            ? images.reduce((latest, current) =>
                new Date(current.uploadTime.trim().replace(" T", "T")) >
                new Date(latest.uploadTime.trim().replace(" T", "T"))
                  ? current
                  : latest
              )
            : null;

        const filteredProperties = propertiesData
          .filter((property) => property.approvalStatus.toLowerCase() === "queued")
          .map((property) => ({
            ...property,
            latestImage: findLatestQueuedImage(
              imagesData.images.filter((image) => image.imageStatus.toLowerCase() === "queued")
            ),
          }));

        setCollectionsNeedingReview(filteredProperties);
      } else {
        console.error("Error fetching data from API");
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  // useEffect to call the fetch function when the component loads
  useEffect(() => {
    fetchPropertiesAndImages();
  }, []);

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#e2eaf1", display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh" }}>
      <Card sx={{ backgroundColor: "#eff7fe", padding: "16px", borderRadius: "8px", boxShadow: 3, maxWidth: "900px", margin: "0 auto" }}>
        <CardContent>
          <Typography variant="h4" color="primary" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
            UPLOAD MANAGEMENT
          </Typography>
          {collectionsNeedingReview.map((collection) => (
            <Box key={collection.collectionId} sx={{ marginBottom: "16px", boxShadow: 1, borderRadius: "8px", overflow: "hidden" }}>
              <ActionRequiredCard
                imageUrl={collection.latestImage?.imageUrl || ""}
                title={`PROPERTY: ${collection.collectionId.toUpperCase()} REQUIRES REVIEW`}
                description={collection.propertyAddress}
                submittedDateTime={
                  collection.latestImage
                    ? `LATEST UPLOAD: ${new Date(collection.latestImage.uploadTime.trim().replace(" T", "T")).toISOString().replace("T", " ").split(".")[0]}Z`
                    : "Unknown"
                }
                onButtonClick={() => navigate(`/image-approval/${collection.collectionId}`)}
                cardType="Review"
              />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UploadManagement;
