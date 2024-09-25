import React, { useEffect, useState } from "react";
import { ActionRequiredCard } from "../Components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { getImagesByCollectionId, getAllCollections } from "../Services";
import { Collection, Image } from "../types";

// Extend the Collection type to include images array
interface CollectionWithImages extends Collection {
  images: Image[];
}

const UploadManagement = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);

  const [collections, setCollections] = useState<CollectionWithImages[]>([]);

  useEffect(() => {
    const fetchCollectionsAndImages = async () => {
      if (!token) return;

      try {
        const allCollections = await getAllCollections(token);
        const collectionsWithImages = await Promise.all(allCollections.map(async (collection) => {
          const fetchedImages = await getImagesByCollectionId(collection.id, token);
          const pendingImages = fetchedImages.filter(img => img.imageStatus === "PENDING");
          return { ...collection, images: pendingImages };
        }));

        const filteredCollections = collectionsWithImages.filter(col => col.images.length > 0);
        setCollections(filteredCollections);
      } catch (error) {
        console.error("Failed to fetch collections and images", error);
      }
    };

    fetchCollectionsAndImages();
  }, [token]);

  return (
    <Box sx={{ padding: "20px", backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh" }}>
      <Card sx={{
        backgroundColor: "transparent",
        borderRadius: "8px",
        boxShadow: "inset 4px 0 6px rgba(0, 0, 0, 0.3), inset 0 4px 6px rgba(0, 0, 0, 0.3), inset 1px 1px 3px rgba(0, 0, 0, 0.1)", 
        maxWidth: "900px",
        paddingTop: "15px"
    }}>
        <CardContent>
          {collections.map((collection) => (
            <Box key={collection.id} sx={{ marginBottom: "16px", boxShadow: 1, borderRadius: "8px", overflow: "hidden" }}>
              <ActionRequiredCard
                imageUrl={collection.images[0]?.imageUrl || ""}
                title={`Property ${collection.collectionId} requires review:`}
                description={`Address: ${collection.propertyAddress || "No address available"}`}
                submittedDateTime={
                  collection.images[0]
                    ? `LATEST UPLOAD: ${new Date(collection.images[0].uploadTime).toLocaleDateString()}`
                    : "Unknown"}
                    onButtonClick={() => {
                      console.log("Navigating to:", `/ImageApproval/${collection.id}`);
                      navigate(`/ImageApproval/${collection.id}`);
                    }}                    
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
