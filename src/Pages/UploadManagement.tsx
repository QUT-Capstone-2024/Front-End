import React, { useEffect, useState } from "react";
import { ActionRequiredCard } from "../Components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { API_URL } from "../config/config";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

// Define the interfaces for the data
interface Image {
  uploadTime: string;
  imageUrl: string;
  imageStatus: string;
  collectionId: string;
  [key: string]: any;
}

interface Property {
  collectionId: string;
  approvalStatus: string;
  propertyAddress: string;
  latestImage?: Image | null;
  [key: string]: any;
}

const UploadManagement = () => {
  const [collectionsNeedingReview, setCollectionsNeedingReview] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Get the token from the Redux store
  const token = useSelector((state: RootState) => state.user.token);

  // Function to fetch data from the API
  const fetchPropertiesAndImages = async () => {
    try {
      const propertiesResponse = await fetch(`${API_URL}/properties?status=PENDING`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const imagesResponse = await fetch(`${API_URL}/images`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (propertiesResponse.ok && imagesResponse.ok) {
        const propertiesData: Property[] = await propertiesResponse.json();
        const imagesData: { images: Image[] } = await imagesResponse.json();

        const findLatestQueuedImage = (images: Image[], collectionId: string): Image | null => {
          const filteredImages = images.filter(
            (image) => image.collectionId === collectionId && image.imageStatus.toLowerCase() === "PENDING"
          );
          return filteredImages.length > 0
            ? filteredImages.reduce((latest, current) =>
                new Date(current.uploadTime) > new Date(latest.uploadTime) ? current : latest
              )
            : null;
        };

        const filteredProperties = propertiesData
          .filter((property) => property.approvalStatus.toLowerCase() === "PENDING")
          .map((property) => ({
            ...property,
            latestImage: findLatestQueuedImage(imagesData.images, property.collectionId),
          }));

        setCollectionsNeedingReview(filteredProperties);
      } else {
        console.error("Error fetching data from API");
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  // useEffect to call the fetch function when the component loads
  useEffect(() => {
    if (token) {
      fetchPropertiesAndImages();
    }
  }, [token]);

  // Show loading message while fetching data
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  // Show message if no properties need review
  if (collectionsNeedingReview.length === 0) {
    return <Typography>No properties needing review</Typography>;
  }

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#e2eaf1",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          backgroundColor: "#eff7fe",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: 3,
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            color="primary"
            sx={{ fontWeight: "bold", marginBottom: "20px" }}
          >
            UPLOAD MANAGEMENT
          </Typography>
          {collectionsNeedingReview.map((collection) => (
            <Box
              key={collection.collectionId}
              sx={{
                marginBottom: "16px",
                boxShadow: 1,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <ActionRequiredCard
                imageUrl={collection.latestImage?.imageUrl || ""}
                title={`PROPERTY: ${collection.collectionId.toUpperCase()} REQUIRES REVIEW`}
                description={collection.propertyAddress}
                submittedDateTime={
                  collection.latestImage
                    ? `LATEST UPLOAD: ${new Date(collection.latestImage.uploadTime)
                        .toISOString()
                        .replace("T", " ")
                        .split(".")[0]}Z`
                    : "Unknown"
                }
                onButtonClick={() =>
                  navigate(`/image-approval/${collection.collectionId}`)
                } // Dynamic route with collectionId
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
