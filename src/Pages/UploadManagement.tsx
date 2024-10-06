import { useEffect, useState } from "react";
import { ActionRequiredCard } from "../Components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { getImagesByCollectionId, getAllCollections } from "../Services";
import { Collection, Image } from "../types";
import { selectProperty } from "../Redux/Slices";

// Extend the Collection type to include images array
interface CollectionWithImages extends Collection {
  images: Image[];
}

const UploadManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const [collections, setCollections] = useState<CollectionWithImages[]>([]);

  const handleClick = (property: any) => {
    dispatch(selectProperty({
      propertyId: property.id,
      propertyAddress: property.propertyAddress,
      propertyDescription: property.propertyDescription,
      propertySize: property.propertySize,
      externalPropertySize: property.externalPropertySize,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parkingSpaces: property.parkingSpaces,
      propertyType: property.propertyType,
      approvalStatus: property.approvalStatus
    }));

    navigate(`/ImageApproval/${selectedPropertyId}`)
  };

  useEffect(() => {
    const fetchCollectionsAndImages = async () => {
      if (!token) return;
  
      try {
        // Retrieve all 'PENDING' properties
        const allCollections = await getAllCollections(token);
  
        const collectionsWithImages = await Promise.all(allCollections.map(async (collection) => {
          const fetchedImages = await getImagesByCollectionId(collection.id, token);
  
          // Filter for images with 'PENDING' status
          const pendingImages = fetchedImages.filter(img => img.imageStatus === "PENDING");
  
          // Return the full collection object, including pending images
          return { ...collection, images: pendingImages };
        }));
  
        // Filter out collections that have no pending images
        const filteredCollections = collectionsWithImages.filter(col => col.images.length > 0);
  
        // Save the full collection data with the pending images
        setCollections(filteredCollections);
      } catch (error) {
        console.error("Failed to fetch collections and images", error);
      }
    };
  
    fetchCollectionsAndImages();
  }, [token]);
  

  return (
    <Box sx={{ backgroundColor: "transparent", display: "flex", flexDirection: 'column', alignItems: "center", minHeight: "100vh" }}>
      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#0b517d'}}>These Properties require manual approval of some images ...</h2>
      <Card sx={{
        backgroundColor: "transparent",
        borderRadius: "8px",
        boxShadow: "inset 4px 0 6px rgba(0, 0, 0, 0.3), inset 0 4px 6px rgba(0, 0, 0, 0.3), inset 1px 1px 3px rgba(0, 0, 0, 0.1)", 
        maxWidth: "900px",
        paddingTop: "10px"
    }}>
        <CardContent>
          {collections.map((collection) => (
            <Box key={collection.id} sx={{ marginBottom: "10px", boxShadow: 3, borderRadius: "8px", overflow: "hidden" }}>
              <ActionRequiredCard
                imageUrl={collection.images[0]?.imageUrl || ""}
                title=''
                description={`${collection.propertyAddress || "No address available"}`}
                onButtonClick={() => {handleClick(collection)}}           
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