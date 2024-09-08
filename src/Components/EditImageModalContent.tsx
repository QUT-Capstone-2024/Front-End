import React, { useEffect, useState } from 'react';
import { CustomButton, CategorySelector, FileUpload, TextInput } from './';
import { SelectChangeEvent } from '@mui/material';
import { ImageTags } from '../Constants/ImageTags';
import { uploadImage } from '../Services'; // Ensure you import the upload service
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

interface EditImageModalContentProps {
  image: string;
  imageTag: string;
  description?: string;
  toggleModal: () => void;
  onUpdate: (updatedImage: File | null, updatedTag: string, updatedDescription: string) => void;
}

const EditImageModalContent: React.FC<EditImageModalContentProps> = ({ image, imageTag, description = '', toggleModal, onUpdate }) => {
  const initialCategoryKey = ImageTags.find(tag => tag.name.toUpperCase() === imageTag.toUpperCase())?.key.toString() || '';
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(initialCategoryKey);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [descriptionText, setDescriptionText] = useState(description);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Access userId, collectionId, and token from Redux state
  const userId = useSelector((state: RootState) => state.user.userDetails?.id);
  const collectionId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    setDescriptionText(description);
  }, [description]);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategoryKey(event.target.value);
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDescriptionText(event.target.value);
  };

  const handleUpdate = async () => {
    const selectedCategoryName = ImageTags.find(tag => tag.key.toString() === selectedCategoryKey)?.name.toUpperCase() || '';

    // Only proceed with the upload if we have the required details
    if (selectedFile && userId && collectionId && token) {
      setIsUploading(true);
      try {
        await uploadImage(selectedFile, userId, collectionId, selectedCategoryName, descriptionText, token);
        setUploadStatus('Upload successful');
      } catch (error) {
        setUploadStatus('Upload failed');
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    }

    // Call onUpdate to pass updated information to the parent component
    onUpdate(selectedFile, selectedCategoryName, descriptionText);
    toggleModal();
  };

  return (
    <div style={{ minWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0, margin: 0 }}>
      <img className="hero gallery-card-image" src={image} alt={imageTag} />
      
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
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <TextInput 
            size="large"
            label="Description"
            value={descriptionText}
            onChange={handleDescriptionChange}
          />
        </div>
      </form>

      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
        <CustomButton label="Update" onClick={handleUpdate} disabled={isUploading} />
        <CustomButton buttonType="cancelButton" label="Cancel" onClick={toggleModal} />
      </div>

      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default EditImageModalContent;
