import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, Box, Typography, Modal, Select, MenuItem, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { CustomButton, IconBar } from "../Components";
import { getImagesByCollectionId, getCollectionById, updateImageStatus } from "../Services";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Collection, Image } from "../types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DefaultHouseImage from "../Images/house_demo_hero_image.png";
import DefaultApartmentImage from "../Images/apartment_demo_hero_image.png";

const ImageApproval: React.FC = () => {
  const navigate = useNavigate();
  const [queuedImages, setQueuedImages] = useState<Image[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<Collection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string>(DefaultHouseImage);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<Image | null>(null);
  const [currentImageTag, setCurrentImageTag] = useState<string>("");
  const [propertyCategories, setPropertyCategories] = useState<string[]>([]);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [currentRejectionReason, setCurrentRejectionReason] = useState("");
  const [currentRejectionImage, setCurrentRejectionImage] = useState<Image | null>(null);

  // Redux store values
  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    fetchPropertyData();
  }, [selectedPropertyId, token]);

  // Fetch property data (images and details)
  const fetchPropertyData = async () => {
    if (selectedPropertyId && token) {
      try {
        const fetchedImages = await getImagesByCollectionId(selectedPropertyId, token);
        const streetImage = fetchedImages.find(image => image.imageTag === "STREET" && image.imageStatus === "APPROVED");

        setHeroImageUrl(streetImage ? streetImage.imageUrl : propertyDetails?.propertyType === "apartment" ? DefaultApartmentImage : DefaultHouseImage);
        const queued = fetchedImages.filter(image => image.imageStatus === "PENDING");
        setQueuedImages(queued);

        const fetchedPropertyDetails = await getCollectionById(selectedPropertyId, token);
        setPropertyDetails(fetchedPropertyDetails);
        if (fetchedPropertyDetails) setPropertyCategories(generatePropertyCategories(fetchedPropertyDetails));

        if (queued.length === 0) navigate(-1); // Navigate back if no pending images
      } catch (error) {
        console.error("Error fetching property data:", error);
        setError("Failed to fetch property data.");
      }
    }
  };

  // Generate categories based on property details
  const generatePropertyCategories = (property: Collection): string[] => {
    const categories = [];
    for (let i = 1; i <= property.bedrooms; i++) categories.push(`Bedroom ${i}`);
    for (let i = 1; i <= property.bathrooms; i++) categories.push(`Bathroom ${i}`);
    categories.push("Kitchen", "Living Room", "Dining Room", "Front View");
    return categories;
  };

  // Handle approval or rejection of an individual image
  const handleImageAction = async (imageId: number, action: "APPROVE" | "REJECT"): Promise<void> => {
    if (!token) {
      setError("User is not authenticated.");
      return;
    }
    const comment = action === "REJECT" ? prompt("Please enter a rejection comment:") || "" : "";
    try {
      const status = action === "APPROVE" ? "APPROVED" : "REJECTED";
      await updateImageStatus(imageId, status, comment, token);
      setQueuedImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error(`Error updating image status: ${error}`);
      setError("Failed to update image status.");
    }
  };

  // Handle image rejection via dialog
  const handleRejectImage = (image: Image) => {
    setCurrentRejectionImage(image);
    setRejectionDialogOpen(true);
  };

  // Confirm image rejection
  const confirmRejection = async () => {
    if (currentRejectionImage && currentRejectionReason && token) {
      try {
        await updateImageStatus(currentRejectionImage.id, "REJECTED", currentRejectionReason, token);
        setQueuedImages(prev => prev.filter(img => img.id !== currentRejectionImage.id));
        closeRejectionDialog();
      } catch (error) {
        console.error("Error rejecting image:", error);
        setError("Failed to reject image.");
      }
    }
  };

  // Close rejection dialog
  const closeRejectionDialog = () => {
    setRejectionDialogOpen(false);
    setCurrentRejectionReason(""); // Reset the rejection reason
  };

  // Bulk approve or reject all images
  const handleBulkAction = async (action: "APPROVE" | "REJECT") => {
    if (!token) {
      setError("User is not authenticated.");
      return;
    }
    const comment = action === "REJECT" ? prompt("Please enter a rejection comment for all images:") || "" : "";
    try {
      const status = action === "APPROVE" ? "APPROVED" : "REJECTED";
      await Promise.all(queuedImages.map((image) => updateImageStatus(image.id, status, comment, token)));
      setQueuedImages([]);
    } catch (error) {
      console.error(`Error updating image statuses: ${error}`);
      setError("Failed to update image statuses.");
    }
  };

  // Open modal to view the image
  const openImageModal = (imageUrl: string) => setSelectedImageUrl(imageUrl);
  const closeModal = () => setSelectedImageUrl(null);

  // Handle editing the image category
  const handleCategoryClick = (image: Image) => {
    setImageToEdit(image);
    setCurrentImageTag(image.imageTag);
    setIsEditModalOpen(true);
  };

  // Handle category change in the modal
  const handleCategoryChange = (event: SelectChangeEvent<string>) => setCurrentImageTag(event.target.value);

  // Update image category
  const handleUpdateCategory = (newTag: string) => {
    if (imageToEdit) {
      const updatedImage = { ...imageToEdit, imageTag: newTag };
      setQueuedImages(prev => prev.map(img => (img.id === imageToEdit.id ? updatedImage : img)));
      setIsEditModalOpen(false);
    }
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#e2eaf1", display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh" }}>
      <Card sx={{ backgroundColor: "#eff7fe", padding: "20px", borderRadius: "8px", boxShadow: 1, width: "100%", maxWidth: "800px" }}>
        {propertyDetails && queuedImages.length > 0 && (
          <>
            <CardContent sx={{ paddingBottom: "16px" }}>
              <Box sx={{ display: "flex", marginBottom: "20px" }}>
                <ArrowBackIcon sx={{ cursor: "pointer", marginRight: "10px", marginTop: "7px" }} onClick={() => navigate(-1)} />
                <Typography variant="h4" color="primary" fontWeight="bold">PROPERTY: {propertyDetails.collectionId.toString().toUpperCase()}</Typography>
              </Box>
              <Box sx={{ position: "relative", width: "100%", borderRadius: "8px", overflow: "hidden", mb: 2 }}>
                <img
                  src={propertyDetails.imageUrls?.[0] || heroImageUrl}
                  alt="Property"
                  style={{ width: "100%", height: "375px", objectFit: "cover" }}
                  onClick={() => openImageModal(propertyDetails.imageUrls?.[0] || heroImageUrl)}
                />
                <Box sx={{ position: "absolute", bottom: "40px", left: "20px", width: "90%", backgroundColor: "rgba(255, 255, 255, 0.45)", padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">{propertyDetails.propertyAddress?.split(",")[0]}</Typography>
                  <Typography variant="h5" color="primary">{propertyDetails.propertyAddress?.split(",")[1].trim()}, {propertyDetails.propertyAddress?.split(",")[2].trim()}</Typography>
                  <IconBar bedrooms={propertyDetails.bedrooms} bathrooms={propertyDetails.bathrooms} parkingSpaces={propertyDetails.parkingSpaces || 0} internalPropertySize={propertyDetails.propertySize || 0} externalPropertySize={0} />
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: "10px", mt: 2 }}>
                <CustomButton label="Approve All" onClick={() => handleBulkAction("APPROVE")} />
                <CustomButton label="Reject All" onClick={() => handleBulkAction("REJECT")} />
              </Box>
            </CardContent>
            <CardContent sx={{ paddingTop: 0 }}>
              {queuedImages.map((image) => (
                <Box key={image.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", backgroundColor: "#eff7fe", borderRadius: "8px", boxShadow: 1, mb: 2, position: "relative" }}>
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={image.imageUrl}
                      alt={image.imageTag}
                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                      onClick={() => openImageModal(image.imageUrl)}
                    />
                    <Box sx={{ position: "absolute", top: 0, left: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white", padding: "5px", fontSize: "0.75rem", borderRadius: "8px", textAlign: "center", width: "82%" }}>
                      QUEUED
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ flexGrow: 1, ml: "20px", color: "primary", cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => handleCategoryClick(image)}>
                    {image.imageTag.toUpperCase()}
                    <ArrowDropDownIcon sx={{ fontSize: "1rem", ml: 0.5 }} />
                  </Typography>
                  <Box sx={{ display: "flex", gap: "15px" }}>
                    <CustomButton label="Approve" onClick={() => handleImageAction(image.id, "APPROVE")} />
                    <CustomButton buttonType="cancelButton" label="Reject" onClick={() => handleRejectImage(image)} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </>
        )}
        {error && <Typography color="error">{error}</Typography>}
        {selectedImageUrl && (
          <Modal open={true} onClose={closeModal} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ outline: "none" }}>
              <img src={selectedImageUrl} alt="Full size" style={{ maxWidth: "90vw", maxHeight: "90vh" }} />
            </Box>
          </Modal>
        )}
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onClose={closeRejectionDialog}>
        <DialogTitle>Reject Image</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the reason for rejecting this image.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="rejectionReason"
            label="Rejection Reason"
            type="text"
            fullWidth
            value={currentRejectionReason}
            onChange={(e) => setCurrentRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRejectionDialog}>Cancel</Button>
          <Button onClick={confirmRejection} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Modal */}
      {isEditModalOpen && imageToEdit && (
        <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, borderRadius: 2, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
            <Typography id="edit-category-modal-title" variant="h6" component="h2" gutterBottom>Edit Image Category</Typography>
            <Select value={currentImageTag} onChange={handleCategoryChange} fullWidth variant="outlined">
              {propertyCategories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
            <Box mt={2} display="flex" justifyContent="space-between">
              <CustomButton label="Cancel" onClick={() => setIsEditModalOpen(false)} buttonType="cancelButton" />
              <CustomButton label="Save" onClick={() => handleUpdateCategory(currentImageTag)} />
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default ImageApproval;
