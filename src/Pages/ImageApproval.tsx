import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { CustomButton, IconBar } from "../Components";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { getImagesByCollectionId, removeImageFromCollection, approveImageInCollection } from "../Services";

// Define the interfaces for image and property details
interface Image {
  imageId: string;
  imageUrl: string;
  imageTag: string;
  imageStatus: string;
  uploadTime: string;
}

interface Property {
  collectionId: string;
  propertyAddress: string;
  imageUrl?: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  internalPropertySize: number;
  externalPropertySize: number;
}

const ImageApproval: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>(); // Get collectionId from URL
  const numericCollectionId = collectionId ? parseInt(collectionId) : null; // Convert collectionId to a number
  const [property, setProperty] = useState<Property | null>(null); // State to hold property details
  const [images, setImages] = useState<Image[]>([]); // State to hold images, corrected from queuedImages to images for clarity
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token); // Get token from Redux

  useEffect(() => {
    const fetchImages = async () => {
      if (token && numericCollectionId) {
        // Ensure both token and numericCollectionId are available
        try {
          const fetchedImages = await getImagesByCollectionId(
            numericCollectionId,
            token
          );
          console.log(fetchedImages); // Log fetched images to verify
          setImages(fetchedImages); // Correctly set fetched images
        } catch (error: any) {
          // Correctly handle catch block using 'any' type
          console.error(error.message); // Log error message
        }
      }
    };

    fetchImages();
  }, [numericCollectionId, token]); // Depend on numericCollectionId and token

  // Handle individual image actions (approve or reject)
  const handleImageAction = async (
    imageId: string,
    action: "approve" | "reject"
  ) => {
    if (!token || !numericCollectionId) return; // Check for token and numericCollectionId

    try {
      if (action === "reject") {
        const comment = prompt("Please enter a rejection comment:");
        if (!comment) return;

        await removeImageFromCollection(
          numericCollectionId,
          Number(imageId),
          token
        );
      } else if (action === "approve") {
        await approveImageInCollection(
          numericCollectionId,
          Number(imageId),
          token
        );
      }

      // Update images state after action
      setImages((prevImages) =>
        prevImages.filter((image) => image.imageId !== imageId)
      );
    } catch (error: any) {
      console.error("Error processing image action:", error.message);
    }
  };

  // Handle bulk approve or reject actions
  const handleBulkAction = async (action: "approve" | "reject") => {
    if (!token || !numericCollectionId) return;

    try {
      const actions = images.map((image) =>
        action === "approve"
          ? approveImageInCollection(
              numericCollectionId,
              Number(image.imageId),
              token
            )
          : removeImageFromCollection(
              numericCollectionId,
              Number(image.imageId),
              token
            )
      );

      await Promise.all(actions);
      setImages([]); // Clear the images list after bulk action
    } catch (error: any) {
      console.error(`Error performing bulk ${action} action:`, error.message);
    }
  };

  // Redirect to previous page if no images need review
  useEffect(() => {
    if (images.length === 0) {
      navigate(-1);
    }
  }, [images, navigate]);

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
          padding: "20px",
          borderRadius: "8px",
          boxShadow: 1,
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {property && images.length > 0 && (
          <>
            <CardContent sx={{ paddingBottom: "16px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <ArrowBackIcon
                  sx={{ cursor: "pointer", marginRight: "10px" }}
                  onClick={() => navigate(-1)}
                />
                <Typography variant="h4" color="primary" fontWeight="bold">
                  PROPERTY: {property.collectionId.toUpperCase()}
                </Typography>
              </Box>

              {/* Property image or hero image */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  borderRadius: "8px",
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                {property.imageUrl && (
                  <img
                    src={property.imageUrl}
                    alt="Property"
                    style={{
                      width: "100%",
                      height: "375px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "40px",
                    left: "20px",
                    width: "90%",
                    backgroundColor: "rgba(255, 255, 255, 0.45)",
                    padding: "20px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {property.propertyAddress.split(",")[0]}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {property.propertyAddress.split(",")[1].trim()},{" "}
                    {property.propertyAddress.split(",")[2].trim()}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "15px",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <IconBar
                      bedrooms={property.bedrooms}
                      bathrooms={property.bathrooms}
                      parkingSpaces={property.parkingSpaces}
                      internalPropertySize={property.internalPropertySize}
                      externalPropertySize={property.externalPropertySize}
                    />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  mt: 2,
                }}
              >
                <CustomButton
                  label="Approve All"
                  onClick={() => handleBulkAction("approve")}
                />
                <CustomButton
                  label="Reject All"
                  onClick={() => handleBulkAction("reject")}
                />
              </Box>
            </CardContent>

            <CardContent sx={{ paddingTop: 0 }}>
              {images.map((image) => (
                <Box
                  key={image.imageId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    backgroundColor: "#eff7fe",
                    borderRadius: "8px",
                    boxShadow: 1,
                    mb: 2,
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={image.imageUrl}
                      alt={image.imageTag}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        padding: "5px",
                        fontSize: "0.75rem",
                        borderRadius: "8px",
                        textAlign: "center",
                        width: "82%",
                      }}
                    >
                      QUEUED
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, ml: "20px", color: "primary" }}
                  >
                    {image.imageTag.toUpperCase()}
                  </Typography>
                  <Box sx={{ display: "flex", gap: "15px" }}>
                    <CustomButton
                      label="Approve"
                      onClick={() =>
                        handleImageAction(image.imageId, "approve")
                      }
                    />
                    <CustomButton
                      label="Reject"
                      onClick={() => handleImageAction(image.imageId, "reject")}
                    />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </>
        )}
      </Card>
    </Box>
  );
};

export default ImageApproval;
