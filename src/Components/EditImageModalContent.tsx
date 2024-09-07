import React, { useEffect, useState } from 'react';
import { CustomButton, CategorySelector, FileUpload, TextInput } from './';
import { SelectChangeEvent } from '@mui/material';
import { ImageTags } from '../Constants/ImageTags';
import { uploadImage, updateImageMetadata } from '../Services'; // Image services
import { useSelector } from 'react-redux'; // Access Redux state
import { RootState } from '../Redux/store'; // Root state from Redux

interface EditImageModalContentProps {
  image: string;
  imageTag: string;
  description?: string;
  toggleModal: () => void;
  onUpdate: (updatedImage: File | null, updatedTag: string, updatedDescription: string) => void;
  imageId?: number; // In case we're updating an existing image
  collectionId: number; // The collection ID we're uploading to
}

const EditImageModalContent: React.FC<EditImageModalContentProps> = ({
  image,
  imageTag,
  description = '',
  toggleModal,
  onUpdate,
  imageId,
  collectionId,
}) => {
  const token = useSelector((state: RootState) => state.user.token);
  const userId = useSelector((state: RootState) => state.user.userDetails?.id);

  const initialCategoryKey = ImageTags.find(tag => tag.name === imageTag)?.key.toString() || '';
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryKey);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [descriptionText, setDescriptionText] = useState(description);

  useEffect(() => {
    const filename = image.split('/').pop();
    setSelectedFileName(filename || null);
    setDescriptionText(description);
  }, [image, description]);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value as string);
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setSelectedFileName(file.name);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDescriptionText(event.target.value);
  };

  const handleUpdate = async () => {
    try {
      // Find the enum value for the selected category
      const selectedTag = ImageTags.find(tag => tag.key === Number(selectedCategory))?.enumValue;
  
      if (!selectedTag) {
        throw new Error('Invalid tag selected');
      }
  
      // If a new file is selected, upload it
      if (selectedFile) {
        await uploadImage(
          selectedFile,
          selectedTag,  // Use the enum value here
          descriptionText,
          userId?.toString() || '',
          collectionId.toString(),
          token!
        );
      }
  
      // If an image ID is provided, update its metadata
      if (imageId) {
        const updateData = {
          tag: selectedTag, // Use the enum value here
          description: descriptionText,
        };
        await updateImageMetadata(collectionId, imageId, updateData, token!);
      }
  
      onUpdate(selectedFile, selectedTag, descriptionText); // Update state/UI
      toggleModal(); // Close the modal
    } catch (error) {
      console.error('Error during image upload/update:', error);
    }
  };
  

  return (
    <div style={{ minWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0, margin: 0 }}>
      <img className="hero gallery-card-image" src={image} alt={imageTag} />
      
      <form>
        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
          <FileUpload 
            onFileSelect={handleFileChange} 
            initialFileName={selectedFileName ? selectedFileName : ''} 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <CategorySelector
            label="Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <TextInput 
            size='large'
            label="Description"
            value={descriptionText}
            onChange={handleDescriptionChange}
          />
        </div>
      </form>

      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
        <CustomButton label="Update" onClick={handleUpdate} />
        <CustomButton buttonType="cancelButton" label="Cancel" onClick={toggleModal} />
      </div>
    </div>
  );
};

export default EditImageModalContent;
