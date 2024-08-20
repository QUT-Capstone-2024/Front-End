import React, { useState } from 'react';
import { CustomButton, CategorySelector } from './';
import { SelectChangeEvent } from '@mui/material';
import { ImageTags } from '../Constants/ImageTags';

interface EditImageModalContentProps {
  image: string;
  imageTag: string;
  description?: string;
  toggleModal: () => void;
  onUpdate: (updatedImage: File | null, updatedTag: string, updatedDescription: string) => void;
}

const EditImageModalContent: React.FC<EditImageModalContentProps> = ({ image, imageTag, description = '', toggleModal, onUpdate }) => {
  // Step 1: Find the key based on imageTag (name) and use it for the initial state
  const initialCategoryKey = ImageTags.find(tag => tag.name === imageTag)?.key.toString() || '';
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryKey);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [descriptionText, setDescriptionText] = useState(description);

  // Step 2: Handle changes to the selected category
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value as string);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionText(event.target.value);
  };

  const handleUpdate = () => {
    onUpdate(selectedFile, selectedCategory, descriptionText);
    toggleModal();
  };

  return (
    <div style={{ minWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img className="hero gallery-card-image" src={image} alt={imageTag} />
      
      <form>
        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
          <label htmlFor="imageUpload">Update Image:</label><br />
          <input
            type="file"
            id="imageUpload"
            name="imageUpload"
            accept="image/*"
            style={{ width: '100%', marginTop: '10px' }}
            onChange={handleFileChange}
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
          <label htmlFor="descriptionInput">Update Description:</label><br />
          <textarea
            id="descriptionInput"
            name="descriptionInput"
            rows={4}
            style={{ width: '100%', marginTop: '10px', resize: 'none' }}
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
