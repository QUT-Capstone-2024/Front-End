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
import { CustomButton, IconBar, Popover } from "../Components";
import {
  getImagesByCollectionId,
  getCollectionById,
  updateImageStatus,
} from "../Services";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Collection, Image } from "../types";
import { ImageTags } from "../Constants/ImageTags";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DefaultHouseImage from "../Images/house_demo_hero_image.png";
import DefaultApartmentImage from "../Images/apartment_demo_hero_image.png";

import "../Styles/Cards.scss";

const ImageApproval: React.FC = () => {
  const navigate = useNavigate();
  const [queuedImages, setQueuedImages] = useState<Image[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<Collection | null>(
    null
  );
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
  const [currentRejectionImage, setCurrentRejectionImage] =
    useState<Image | null>(null);
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const selectedPropertyId = useSelector(
    (state: RootState) => state.currentProperty.selectedPropertyId
  );
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    fetchPropertyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPropertyId, token]);

  const fetchPropertyData = async () => {
    if (!selectedPropertyId || !token) return;
    try {
      const fetchedImages = await getImagesByCollectionId(
        selectedPropertyId,
        token
      );
      const streetImage = fetchedImages.find(
        (img) => img.imageTag === "STREET"
      );
      setPopoverOpen(!streetImage || streetImage.imageStatus !== "APPROVED");
      setHeroImageUrl(
        streetImage
          ? streetImage.imageUrl
          : propertyDetails?.propertyType === "apartment"
          ? DefaultApartmentImage
          : DefaultHouseImage
      );
      const queued = fetchedImages.filter(
        (img) => img.imageStatus === "PENDING"
      );
      setQueuedImages(queued);
      const details = await getCollectionById(selectedPropertyId, token);
      setPropertyDetails(details);
      if (queued.length === 0) navigate('/home');
    } catch (error) {
      console.error("Error fetching property data:", error);
      setError("Failed to fetch property data.");
    }
  };

  const handleImageAction = async (
    imageId: number,
    action: "APPROVE" | "REJECT",
    imageTag: string
  ) => {
    if (!selectedPropertyId || !token) {
      return setError("User is not authenticated or property is not selected.");
    }
    try {
      const status = action === "APPROVE" ? "APPROVED" : "REJECTED";
      const rejectionReason = action === "REJECT" ? currentRejectionReason : "";

      // Call the API with the status and the updated tag
      await updateImageStatus(
        selectedPropertyId,
        imageId,
        status,
        rejectionReason,
        token,
        imageTag
      );

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
        queuedImages.map((img) =>
          handleImageAction(img.id, "REJECT", img.imageTag)
        ) // Pass imageTag
      );
      setIsBulkReject(false);
    } else if (currentRejectionImage) {
      await handleImageAction(
        currentRejectionImage.id,
        "REJECT",
        currentRejectionImage.imageTag
      ); // Pass imageTag
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
      await Promise.all(
        queuedImages.map((img) =>
          updateImageStatus(
            selectedPropertyId,
            img.id,
            action === "APPROVE" ? "APPROVED" : "REJECTED",
            action === "REJECT"
              ? prompt("Please enter a rejection comment for all images:") || ""
              : "",
            token,
            img.imageTag
          )
        )
      );
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
      setQueuedImages((prev) =>
        prev.map((img) => (img.id === imageToEdit.id ? updatedImage : img))
      );
      setIsEditModalOpen(false);
    }
  };

  const closeModal = () => setSelectedImageUrl(null);
  const openImageModal = (imageUrl: string) => setSelectedImageUrl(imageUrl);

  const popoverContent = (
    <div className="popover-content approval-hero">
      This property has no <span>APPROVED</span><br />Hero Image
    </div>
  );

  useEffect(() => {
    setPropertyCategories(ImageTags.map((tag) => tag.displayName));
    fetchPropertyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPropertyId, token]);

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
          boxShadow: 3,
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {propertyDetails && queuedImages.length > 0 && (
          <>
            <CardContent sx={{ paddingBottom: "16px", display: 'flex', flexDirection: 'column'}}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ArrowBackIcon
                  sx={{
                    cursor: "pointer",
                    marginRight: "12rem",
                    marginBottom: "25px",
                    color: "#f27a31",
                  }}
                  onClick={() => navigate(-1)}
                />
                <div
                  style={{
                    display: "flex",
                    marginBottom: "20px",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate('/home')}
                >
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    {propertyDetails.propertyAddress?.split(",")[0]}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {propertyDetails.propertyAddress?.split(",")[1].trim()},{" "}
                    {propertyDetails.propertyAddress?.split(",")[2].trim()}
                  </Typography>
                </div>
              </div>
              <div style={{ position: 'relative', margin: 'auto' }}>
                <img
                  src={propertyDetails.imageUrls?.[0] || heroImageUrl}
                  alt="Property"
                  className="approval-hero-image"
                />
                <Popover content={popoverContent} visible={popoverOpen} type='approval'/>
              </div>

              <IconBar
                bedrooms={propertyDetails.bedrooms}
                bathrooms={propertyDetails.bathrooms}
                parkingSpaces={propertyDetails.parkingSpaces || 0}
                internalPropertySize={propertyDetails.propertySize || 0}
                externalPropertySize={0}
              />

              <div className="all-buttons-container">
                <CustomButton
                  label="Approve All"
                  onClick={() => handleBulkAction("APPROVE")}
                />
                <CustomButton
                  label="Reject All"
                  buttonType="cancelButton"
                  onClick={handleBulkReject}
                  style={{ marginRight: "10px" }}
                />
              </div>
            </CardContent>

            <div className="image-approval-card-container">
              {queuedImages.map((image) => (
                <div key={image.id} className="image-approval-card">
                  <img
                    className="thumbnail-image"
                    src={image.imageUrl}
                    alt={image.imageTag}
                    onClick={() => openImageModal(image.imageUrl)}
                  />
                  <CustomButton
                    className="edit-image-button"
                    label={image.imageTag.toUpperCase()}
                    withIcon="right"
                    icon={
                      <EditIcon
                        sx={{ marginLeft: "5px", marginBottom: "6px" }}
                      />
                    }
                    onClick={() => handleCategoryClick(image)}
                  />
                  <div className="image-approval-buttons">
                    <CustomButton
                      label="Approve"
                      onClick={() =>
                        handleImageAction(image.id, "APPROVE", image.imageTag)
                      }
                    />
                    <CustomButton
                      buttonType="cancelButton"
                      label="Reject"
                      onClick={() => handleRejectImage(image)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {error && <Typography color="error">{error}</Typography>}
        {selectedImageUrl && (
          <Modal
            open={true}
            onClose={closeModal}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ outline: "none" }}>
              <img
                src={selectedImageUrl}
                alt="Full size"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </Box>
          </Modal>
        )}
      </Card>
      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onClose={closeRejectionDialog}>
        <DialogTitle>
          {isBulkReject ? "Reject All Images" : "Reject Image"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the reason for rejecting{" "}
            {isBulkReject ? "all images." : "this image."}
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
          <CustomButton
            label="Cancel"
            onClick={closeRejectionDialog}
            buttonType="cancelButton"
          />
          <CustomButton
            label="Submit"
            onClick={confirmRejection}
            disabled={!currentRejectionReason.trim()} // Disable the button if no rejection reason is entered
          />
        </DialogActions>
      </Dialog>

      {isEditModalOpen && imageToEdit && (
        <Modal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              id="edit-category-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Edit Image Tag
            </Typography>
            <Select
              value={currentImageTag}
              onChange={handleCategoryChange}
              displayEmpty
              fullWidth
              variant="outlined"
            >
              {ImageTags.map((tag) => (
                <MenuItem key={tag.key} value={tag.name}>
                  {tag.displayName}
                </MenuItem>
              ))}
            </Select>
            <Box mt={2} display="flex" justifyContent="space-between">
              <CustomButton
                label="Cancel"
                onClick={() => setIsEditModalOpen(false)}
                buttonType="cancelButton"
              />
              <CustomButton
                label="Save"
                onClick={() => handleUpdateCategory(currentImageTag)}
              />
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default ImageApproval;
