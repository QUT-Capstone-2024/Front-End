
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, Box, Typography, Modal, Select, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogContentText, TextField, DialogActions,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { CustomButton, IconBar } from "../Components";
import { getImagesByCollectionId, getCollectionById, updateImageStatus } from "../Services";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Collection, Image } from "../types";
import { ImageTags } from "../Constants/ImageTags";
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
  const [isBulkReject, setIsBulkReject] = useState(false);
  const [currentRejectionReason, setCurrentRejectionReason] = useState("");
  const [currentRejectionImage, setCurrentRejectionImage] = useState<Image | null>(null);
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    fetchPropertyData();
  }, [selectedPropertyId, token]);

  const fetchPropertyData = async () => {
    if (!selectedPropertyId || !token) return;
    try {
      const fetchedImages = await getImagesByCollectionId(selectedPropertyId, token);
      const streetImage = fetchedImages.find((img) => img.imageTag === "STREET" && img.imageStatus === "APPROVED");
      setHeroImageUrl(streetImage ? streetImage.imageUrl 
        : propertyDetails?.propertyType === "apartment" ? DefaultApartmentImage : DefaultHouseImage);
      const queued = fetchedImages.filter((img) => img.imageStatus === "PENDING");
      setQueuedImages(queued);
      const details = await getCollectionById(selectedPropertyId, token);
      setPropertyDetails(details);
      if (queued.length === 0) navigate(-1);
    } catch (error) {
      console.error("Error fetching property data:", error);
      setError("Failed to fetch property data.");
    }
  };

  const handleImageAction = async (imageId: number, action: "APPROVE" | "REJECT", imageTag: string) => {
    if (!selectedPropertyId || !token) {
      return setError("User is not authenticated or property is not selected.");
    }
    try {
      const status = action === "APPROVE" ? "APPROVED" : "REJECTED";
      const rejectionReason = action === "REJECT" ? currentRejectionReason : "";
  
      // Call the API with the status and the updated tag
      await updateImageStatus(selectedPropertyId, imageId, status, rejectionReason, token, imageTag);
  
      // Update the queued images state by removing the processed image
      setQueuedImages((prev) => prev.filter((img) => img.id !== imageId));
  
      if (action === "REJECT") {
        closeRejectionDialog();
      }
      fetchPropertyData();
    } catch (error) {
      setError("Failed to update image status and tag.");
    }
  };
  
  const handleBulkReject = () => {
    setIsBulkReject(true);
    setRejectionDialogOpen(true);
  };

  const handleRejectImage = (image: Image) => {
    setCurrentRejectionImage(image);
    setRejectionDialogOpen(true);
  };

  const confirmRejection = async () => {
    if (!currentRejectionReason.trim()) {
      setRejectionError("Rejection comment is required");
      return;
    }
    
    setRejectionError(null); // Clear the error if valid
    
    if (isBulkReject) {
      await Promise.all(
        queuedImages.map((img) => handleImageAction(img.id, "REJECT", img.imageTag)) // Pass imageTag
      );
      setIsBulkReject(false);
    } else if (currentRejectionImage) {
      await handleImageAction(currentRejectionImage.id, "REJECT", currentRejectionImage.imageTag); // Pass imageTag
    }
  
    closeRejectionDialog();
  };
  
 
  const closeRejectionDialog = () => {
    setRejectionDialogOpen(false);
    setCurrentRejectionReason("");
  };

  const handleBulkAction = async (action: "APPROVE" | "REJECT") => {
    if (!selectedPropertyId || !token)
      return setError("User is not authenticated or property is not selected.");
    try {
      await Promise.all(queuedImages.map((img) => updateImageStatus(selectedPropertyId, img.id, action === "APPROVE" ? "APPROVED" : "REJECTED", 
      action === "REJECT" ? prompt("Please enter a rejection comment for all images:") || "" : "", token, img.imageTag)));
      setQueuedImages([]);
      fetchPropertyData();
    } catch (error) {
      setError("Failed to update image statuses.");
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCurrentImageTag(event.target.value);
    if (imageToEdit) {
      const updatedImage = { ...imageToEdit, imageTag: event.target.value };
      setQueuedImages((prev) =>
        prev.map((img) => (img.id === imageToEdit.id ? updatedImage : img))
      );
    }
  };  

  const handleCategoryClick = (image: Image) => {
    setImageToEdit(image);
    setCurrentImageTag(image.imageTag);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = (newTag: string) => {
    if (imageToEdit) {
      const updatedImage = { ...imageToEdit, imageTag: newTag };
      setQueuedImages((prev) => prev.map((img) => (img.id === imageToEdit.id ? updatedImage : img)));
      setIsEditModalOpen(false);
    }
  };

  const closeModal = () => setSelectedImageUrl(null);
  const openImageModal = (imageUrl: string) => setSelectedImageUrl(imageUrl);

  useEffect(() => {
    setPropertyCategories(ImageTags.map((tag) => tag.displayName));
    fetchPropertyData();
  }, [selectedPropertyId, token]);

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#e2eaf1", display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh" }}>
      <Card sx={{ backgroundColor: "#eff7fe", padding: "20px", borderRadius: "8px", boxShadow: 1, width: "100%", maxWidth: "800px" }}>
        {propertyDetails && queuedImages.length > 0 && (
          <>
            <CardContent sx={{ paddingBottom: "16px" }}>
              <Box sx={{ display: "flex", marginBottom: "20px" }}>
                <ArrowBackIcon sx={{ cursor: "pointer", marginRight: "10px", marginTop: "7px" }} onClick={() => navigate(-1)} />
                <Typography variant="h4" color="primary" fontWeight="bold">
                  PROPERTY: {propertyDetails.collectionId.toString().toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{ position: "relative", width: "100%", borderRadius: "8px", overflow: "hidden", mb: 2 }}>
                <img src={propertyDetails.imageUrls?.[0] || heroImageUrl} alt="Property" style={{ width: "100%", height: "375px", objectFit: "cover" }} onClick={() => openImageModal(propertyDetails.imageUrls?.[0] || heroImageUrl)} />
                <Box sx={{ position: "absolute", bottom: "40px", left: "20px", width: "90%", backgroundColor: "rgba(255, 255, 255, 0.45)", padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">{propertyDetails.propertyAddress?.split(",")[0]}</Typography>
                  <Typography variant="h5" color="primary">
                    {propertyDetails.propertyAddress?.split(",")[1].trim()}, {propertyDetails.propertyAddress?.split(",")[2].trim()}
                  </Typography>
                  <IconBar bedrooms={propertyDetails.bedrooms} bathrooms={propertyDetails.bathrooms} parkingSpaces={propertyDetails.parkingSpaces || 0} internalPropertySize={propertyDetails.propertySize || 0} externalPropertySize={0} />
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: "10px", mt: 2 }}>
                <CustomButton label="Approve All" onClick={() => handleBulkAction("APPROVE")} />
                <CustomButton label="Reject All" onClick={handleBulkReject} />
              </Box>
            </CardContent>
            <CardContent sx={{ paddingTop: 0 }}>
              {queuedImages.map((image) => (
                <Box key={image.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", backgroundColor: "#eff7fe", borderRadius: "8px", boxShadow: 1, mb: 2, position: "relative" }}>
                  <Box sx={{ position: "relative" }}>
                    <img src={image.imageUrl} alt={image.imageTag} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} onClick={() => openImageModal(image.imageUrl)} />
                    <Box sx={{ position: "absolute", top: 0, left: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white", padding: "5px", fontSize: "0.75rem", borderRadius: "8px", textAlign: "center", width: "82%" }}>QUEUED</Box>
                  </Box>
                  <Typography variant="h6" sx={{ flexGrow: 1, ml: "20px", color: "primary", cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => handleCategoryClick(image)}>
                    {image.imageTag.toUpperCase()} <ArrowDropDownIcon sx={{ fontSize: "1rem", ml: 0.5 }} />
                  </Typography>
                  <Box sx={{ display: "flex", gap: "15px" }}>
                    <CustomButton label="Approve" onClick={() => handleImageAction(image.id, "APPROVE", image.imageTag)} />
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
        <DialogTitle>{isBulkReject ? "Reject All Images" : "Reject Image"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the reason for rejecting {isBulkReject ? "all images." : "this image."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="rejectionReason"
            label="Rejection Reason"
            type="text"
            fullWidth
            variant="outlined"
            value={currentRejectionReason}
            onChange={(e) => setCurrentRejectionReason(e.target.value)}
            error={Boolean(rejectionError)} // Show error state if there's an error
            helperText={rejectionError} // Display error message
          />
        </DialogContent>
        <DialogActions>
          <CustomButton label="Cancel" onClick={closeRejectionDialog} buttonType="cancelButton" />
          <CustomButton
            label="Submit"
            onClick={confirmRejection}
            disabled={!currentRejectionReason.trim()} // Disable the button if no rejection reason is entered
          />
        </DialogActions>
      </Dialog>

      {isEditModalOpen && imageToEdit && (
        <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, borderRadius: 2, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
            <Typography id="edit-category-modal-title" variant="h6" component="h2" gutterBottom>Edit Image Tag</Typography>
            <Select value={currentImageTag} onChange={handleCategoryChange} displayEmpty fullWidth variant="outlined">
              {ImageTags.map((tag) => <MenuItem key={tag.key} value={tag.name}>{tag.displayName}</MenuItem>)}
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