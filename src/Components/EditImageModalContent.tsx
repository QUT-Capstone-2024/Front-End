import React, { useEffect, useState } from 'react';
import { CustomButton, CategorySelector, FileUpload, TextInput, Spacer } from './';
import { SelectChangeEvent } from '@mui/material';
import { generateImageTags } from '../Constants/ImageTags';
import { uploadImage } from '../Services';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import UploadIcon from '@mui/icons-material/Upload';

interface EditImageModalContentProps {
  image: string;
  imageTag: string;
  description?: string;
  toggleModal: () => void;
  onUpdate: (updatedImage: File | null, updatedTag: string, updatedDescription: string) => void;
}

const EditImageModalContent: React.FC<EditImageModalContentProps> = ({ image, imageTag, description = '', toggleModal, onUpdate }) => {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [descriptionText, setDescriptionText] = useState(description);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>(image);

  // Access userId, collectionId, and token from Redux state
  const userId = useSelector((state: RootState) => state.user.userDetails?.id);
  const collectionId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const token = useSelector((state: RootState) => state.user.token);

  // Access the updated property details from the Redux state
  const propertyDetails = useSelector((state: RootState) => ({
    bedrooms: state.currentProperty.bedrooms,
    bathrooms: state.currentProperty.bathrooms,
    propertyType: state.currentProperty.type,
    propertySize: state.currentProperty.propertySize,
  }));

  // Generate dynamic options based on property details
  const dynamicImageTags = generateImageTags(propertyDetails).map(tag => ({
    value: tag.key, // Ensure this is a string
    label: tag.displayName, // Human-readable label
    instanceNumber: tag.instanceNumber, // Instance number if relevant
    name: tag.name
  }));

  useEffect(() => {
    setDescriptionText(description);
  }, [description]);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategoryKey(event.target.value);
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImageUrl(reader.result as string); // Set preview image URL to file content
    };
    reader.readAsDataURL(file); // Read the file as data URL for image preview
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDescriptionText(event.target.value);
  };

  const handleUpdate = async () => {
    // Find the selected tag object to get both the category name and instance number
    const selectedTag = dynamicImageTags.find(tag => tag.value === selectedCategoryKey);
    const selectedCategoryName = selectedTag!.name.toUpperCase();
    const instanceNumber = selectedTag!.instanceNumber || 0; 

    if (selectedFile && userId && collectionId && token) {
      setIsUploading(true);
      try {
        // Upload the image with the instanceNumber
        await uploadImage(selectedFile, userId, collectionId, selectedCategoryName, descriptionText, instanceNumber, token);
        setUploadStatus('Upload successful');

        // Call onUpdate to pass updated information to the parent component
        onUpdate(selectedFile, selectedCategoryName, descriptionText);

        // Close the modal
        toggleModal();
        window.location.reload();
      } catch (error) {
        setUploadStatus('Upload failed');
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  //////////////////////////////////////// RENDER
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0, margin: 0 }}>
      {/* Use the updated previewImageUrl to display either the selected file or the initial image */}
      {previewImageUrl && <img className="modal gallery-card-image" src={previewImageUrl} alt={imageTag} />}
      
      <form>
        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
          <FileUpload 
            onFileSelect={handleFileChange} 
            initialFileName={selectedFile?.name || ''} 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <CategorySelector
            label="Category"
            value={selectedCategoryKey}
            onChange={handleCategoryChange}
            options={dynamicImageTags}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <TextInput 
            size="medium"
            label="Description"
            value={descriptionText}
            onChange={handleDescriptionChange}
          />
        </div>
      </form>

      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
        <CustomButton 
          withIcon='right'
          icon={<UploadIcon />}
          label="Upload Image" 
          onClick={handleUpdate}
          disabled={selectedFile === null || selectedCategoryKey === ''}
        />
        <CustomButton buttonType="cancelButton" label="Cancel" onClick={toggleModal} />
      </div>

      <Spacer height={1} />
      <span style={{ color: '#ef4400', visibility: !selectedFile ? 'visible' : 'hidden'}}>Please select an image</span>
      <span style={{ color: '#ef4400', visibility: !selectedCategoryKey ? 'visible' : 'hidden'}}>Please select an category</span>

      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default EditImageModalContent;
