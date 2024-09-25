import React, { useEffect, useState } from "react";
import { ActionRequiredCard } from "../Components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { getImagesByCollectionId } from "../Services";
import { Image } from "../types";

const UploadManagement = () => {
  const navigate = useNavigate();
  
  // Retrieve the selected property from Redux state
  const selectedProperty = useSelector((state: RootState) => state.currentProperty);
  const token = useSelector((state: RootState) => state.user.token);

  const [latestImage, setLatestImage] = useState<Image | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (selectedProperty.selectedPropertyId && token) {
        try {
          const images = await getImagesByCollectionId(selectedProperty.selectedPropertyId, token);
          const latestImage = images.reduce((latest, current) => 
            new Date(current.uploadTime) > new Date(latest.uploadTime) ? current : latest, images[0]);
          setLatestImage(latestImage);
        } catch (error) {
          console.error("Failed to fetch images", error);
          setLatestImage(null);
        }
      }
    };

    fetchImages();
  }, [selectedProperty.selectedPropertyId, token]);

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#e2eaf1", display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh" }}>
      <Card sx={{ backgroundColor: "#eff7fe", padding: "16px", borderRadius: "8px", boxShadow: 3, maxWidth: "900px", margin: "0 auto" }}>
        <CardContent>
          <Typography variant="h4" color="primary" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
            UPLOAD MANAGEMENT
          </Typography>
          {selectedProperty.selectedPropertyId && (
            <Box sx={{ marginBottom: "16px", boxShadow: 1, borderRadius: "8px", overflow: "hidden" }}>
              <ActionRequiredCard
                imageUrl={latestImage?.imageUrl || ""}
                title={`PROPERTY: ${selectedProperty.propertyAddress?.toUpperCase()} REQUIRES REVIEW`}
                description={selectedProperty.propertyDescription || "No description available"}
                submittedDateTime={
                  latestImage
                    ? `LATEST UPLOAD: ${new Date(latestImage.uploadTime).toISOString().replace("T", " ").split(".")[0]}Z`
                    : "Unknown"
                }
                onButtonClick={() => navigate(`/image-approval/${selectedProperty.selectedPropertyId}`)}
                cardType="Review"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UploadManagement;
