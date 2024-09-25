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
          const pendingImages = fetchedImages.filter(img => img.imageStatus.toLowerCase() === "pending");
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
    <Box sx={{ padding: "20px", backgroundColor: "#e2eaf1", display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh" }}>
      <Card sx={{ backgroundColor: "#eff7fe", padding: "16px", borderRadius: "8px", boxShadow: 3, maxWidth: "900px", margin: "0 auto" }}>
        <CardContent>
          {collections.map((collection) => (
            <Box key={collection.id} sx={{ marginBottom: "16px", boxShadow: 1, borderRadius: "8px", overflow: "hidden" }}>
              <ActionRequiredCard
                imageUrl={collection.images[0]?.imageUrl || ""}
                title={`COLLECTION ID ${collection.id} NEEDS REVIEW`}
                description={`PROPERTY: ${collection.propertyAddress || "No address available"}`}
                submittedDateTime={
                  collection.images[0]
                    ? `LATEST UPLOAD: ${new Date(collection.images[0].uploadTime).toLocaleDateString()}`
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
