import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Modal,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
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

  // Utility Functions
  const toTitleCase = (str: string): string => str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const isSpecificTag = (tag: string): boolean => /^[A-Za-z]+ \d+$/.test(tag);

  // Fetch Property Data and Apply Mapping
  const fetchPropertyData = async () => {
    if (!selectedPropertyId || !token) return;
    try {
      const fetchedImages = await getImagesByCollectionId(selectedPropertyId, token);
      const details = await getCollectionById(selectedPropertyId, token);
      if (!details) { setError("Property details not found."); return; }
      setPropertyDetails(details);

      const normalizedImages = fetchedImages.map(img => ({ ...img, imageTag: toTitleCase(img.imageTag) }));
      const assignedTags = new Set<string>();

      // Collect existing specific tags
      normalizedImages.forEach(img => {
        if (isSpecificTag(img.imageTag)) assignedTags.add(img.imageTag);
      });

      // Assign specific tags to general tags
      const mappedImages = normalizedImages.map(img => {
        if (isSpecificTag(img.imageTag)) return img;
        const { imageTag } = img;
        const { bedrooms, bathrooms } = details;
        let specificTag = imageTag;

        if (imageTag.toLowerCase() === "bedroom") {
          for (let i = 1; i <= bedrooms; i++) {
            const potentialTag = `Bedroom ${i}`;
            if (!assignedTags.has(potentialTag)) { specificTag = potentialTag; assignedTags.add(potentialTag); break; }
          }
        } else if (imageTag.toLowerCase() === "bathroom") {
          for (let i = 1; i <= bathrooms; i++) {
            const potentialTag = `Bathroom ${i}`;
            if (!assignedTags.has(potentialTag)) { specificTag = potentialTag; assignedTags.add(potentialTag); break; }
          }
        }
        return { ...img, imageTag: specificTag };
      });

      // Set hero image
      const streetImage = mappedImages.find(img => img.imageTag.toLowerCase() === "street" && img.imageStatus === "APPROVED");
      setHeroImageUrl(
        streetImage ? streetImage.imageUrl :
        details.propertyType === "apartment" ? DefaultApartmentImage : DefaultHouseImage
      );

      // Update queued images and categories
      const queued = mappedImages.filter(img => img.imageStatus === "PENDING");
      setQueuedImages(queued);
      setPropertyCategories(generatePropertyCategories(details));
      if (queued.length === 0) navigate(-1);
    } catch (error) {
      console.error("Error fetching property data:", error);
      setError("Failed to fetch property data.");
    }
  };

  useEffect(() => { fetchPropertyData(); }, [selectedPropertyId, token]);

  // Handle Approval or Rejection of Individual Images
  const handleImageAction = async (imageId: number, action: "APPROVE" | "REJECT") => {
    if (!selectedPropertyId || !token) return setError("User is not authenticated or property is not selected.");
    try {
      await updateImageStatus(
        selectedPropertyId,
        imageId,
        action === "APPROVE" ? "APPROVED" : "REJECTED",
        action === "REJECT" ? currentRejectionReason : "",
        token
      );
      setQueuedImages(prev => prev.filter(img => img.id !== imageId));
      if (action === "REJECT") setRejectionDialogOpen(false);
      fetchPropertyData();
    } catch (error) {
      setError("Failed to update image status.");
    }
  };

  // Reject Image Flow
  const handleRejectImage = (image: Image) => { setCurrentRejectionImage(image); setRejectionDialogOpen(true); };
  const confirmRejection = async () => {
    if (currentRejectionImage && currentRejectionReason && token)
      handleImageAction(currentRejectionImage.id, "REJECT");
  };

  // Bulk Approve/Reject Images
  const handleBulkAction = async (action: "APPROVE" | "REJECT") => {
    if (!selectedPropertyId || !token) return setError("User is not authenticated or property is not selected.");
    try {
      const status = action === "APPROVE" ? "APPROVED" : "REJECTED";
      const rejectionReason = action === "REJECT" ? prompt("Please enter a rejection comment for all images:") || "" : "";

      await Promise.all(queuedImages.map(img => updateImageStatus(
        selectedPropertyId, img.id, status, action === "REJECT" ? rejectionReason : "", token
      )));
      setQueuedImages([]);
      fetchPropertyData();
    } catch (error) {
      setError("Failed to update image statuses.");
    }
  };

  // Generate Property Categories
  const generatePropertyCategories = (property: Collection): string[] => {
    const categories = [];
    for (let i = 1; i <= property.bedrooms; i++) categories.push(`Bedroom ${i}`);
    for (let i = 1; i <= property.bathrooms; i++) categories.push(`Bathroom ${i}`);
    return [...categories, "Kitchen", "Living Room", "Dining Room", "Front View"];
  };

  // Image Modal Handlers
  const openImageModal = (imageUrl: string) => setSelectedImageUrl(imageUrl);
  const closeModal = () => setSelectedImageUrl(null);

  // Handle Category Click and Update
  const handleCategoryClick = (image: Image) => {
    setImageToEdit(image);
    setCurrentImageTag(image.imageTag);
    setIsEditModalOpen(true);
  };
  const handleCategoryChange = (event: SelectChangeEvent<string>) => setCurrentImageTag(event.target.value);
  const handleUpdateCategory = async (newTag: string) => {
    if (!propertyCategories.includes(newTag)) { setError("Selected category is invalid."); return; }
    if (imageToEdit) {
      try {
        const updatedImage: Image = { ...imageToEdit, imageTag: newTag };
        setQueuedImages(prev => prev.map(img => img.id === imageToEdit.id ? updatedImage : img));
        setIsEditModalOpen(false);
      } catch (error) {
        setError("Failed to update image category.");
      }
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
                <Typography variant="h4" color="primary" fontWeight="bold">
                  PROPERTY: {propertyDetails.collectionId.toString().toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{ position: "relative", width: "100%", borderRadius: "8px", overflow: "hidden", mb: 2 }}>
                <img src={propertyDetails.imageUrls?.[0] || heroImageUrl} alt="Property" style={{ width: "100%", height: "375px", objectFit: "cover" }} onClick={() => openImageModal(propertyDetails.imageUrls?.[0] || heroImageUrl)} />
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
              {queuedImages.map(image => (
                <Box key={image.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", backgroundColor: "#eff7fe", borderRadius: "8px", boxShadow: 1, mb: 2, position: "relative" }}>
                  <Box sx={{ position: "relative" }}>
                    <img src={image.imageUrl} alt={image.imageTag} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} onClick={() => openImageModal(image.imageUrl)} />
                    <Box sx={{ position: "absolute", top: 0, left: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white", padding: "5px", fontSize: "0.75rem", borderRadius: "8px", textAlign: "center", width: "82%" }}>QUEUED</Box>
                  </Box>
                  <Typography variant="h6" sx={{ flexGrow: 1, ml: "20px", color: "primary", cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => handleCategoryClick(image)}>
                    {image.imageTag} <ArrowDropDownIcon sx={{ fontSize: "1rem", ml: 0.5 }} />
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
      <Dialog open={rejectionDialogOpen} onClose={() => setRejectionDialogOpen(false)}>
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
            variant="outlined"
            value={currentRejectionReason}
            onChange={(e) => setCurrentRejectionReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton label="Cancel" onClick={() => setRejectionDialogOpen(false)} buttonType="cancelButton" />
          <CustomButton label="Submit" onClick={confirmRejection} />
        </DialogActions>
      </Dialog>

      {/* Edit Category Modal */}
      {isEditModalOpen && imageToEdit && (
        <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, borderRadius: 2, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
            <Typography id="edit-category-modal-title" variant="h6" component="h2" gutterBottom>Edit Image Category</Typography>
            <Select value={currentImageTag} onChange={handleCategoryChange} fullWidth variant="outlined">
              {propertyCategories.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)}
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
