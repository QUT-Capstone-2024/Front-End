import React, { useEffect, useState } from "react";
import { ActionRequiredCard } from "../Components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { getImagesByCollectionId, getAllCollections } from "../Services";
import { Collection, Image } from "../types";

const UploadManagement = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [images, setImages] = useState<{ [key: number]: Image | null }>({});

  useEffect(() => {
    const fetchCollections = async () => {
      if (!token) return;  // Ensure token is not null

      try {
        const allCollections = await getAllCollections(token);
        setCollections(allCollections);  // Assuming you will filter on the client-side or server-side supports filtering
      } catch (error) {
        console.error("Failed to fetch collections", error);
      }
    };

    fetchCollections();
  }, [token]);

  useEffect(() => {
    collections.forEach(({ id }) => {
      if (!token) return; // Check token again before fetching images

      const fetchImagesForCollection = async (collectionId: number) => {
        try {
          const images = await getImagesByCollectionId(collectionId, token);
          const latestImage = images.reduce((latest, current) => 
            new Date(current.uploadTime) > new Date(latest.uploadTime) ? current : latest, images[0]);
          setImages(prev => ({ ...prev, [collectionId]: latestImage }));
        } catch (error) {
          console.error(`Failed to fetch images for collection ${collectionId}`, error);
          setImages(prev => ({ ...prev, [collectionId]: null }));
        }
      };

      fetchImagesForCollection(id);
    });
  }, [collections, token]);

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#e2eaf1", display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh" }}>
      <Card sx={{ backgroundColor: "#eff7fe", padding: "16px", borderRadius: "8px", boxShadow: 3, maxWidth: "900px", margin: "0 auto" }}>
        <CardContent>
          <Typography variant="h4" color="primary" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
            UPLOAD MANAGEMENT
          </Typography>
          {collections.map((collection) => (
            <Box key={collection.id} sx={{ marginBottom: "16px", boxShadow: 1, borderRadius: "8px", overflow: "hidden" }}>
              <ActionRequiredCard
                imageUrl={images[collection.id]?.imageUrl || ""}
                title={`COLLECTION ID ${collection.id} NEEDS REVIEW`}
                description={`PROPERTY: ${collection.propertyAddress || "No address available"}`} // Updated to `propertyAddress`
                submittedDateTime={
                  images[collection.id]?.uploadTime
                    ? `LATEST UPLOAD: ${new Date(images[collection.id]!.uploadTime!).toLocaleDateString()}`
                    : "Unknown"}
                onButtonClick={() => navigate(`/image-approval/${collection.id}`)}
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
