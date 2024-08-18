import React from 'react';
import { CustomButton } from './index';
import { ImageTags } from '../Constants/ImageTags';

interface EditImageModalContentProps {
  image: string;
  imageTag: string;
  toggleModal: () => void;
}

const EditImageModalContent: React.FC<EditImageModalContentProps> = ({ image, imageTag, toggleModal }) => {
  console.log('EditImageModalContentProps:', image, imageTag);
  console.log('ImageTags:', ImageTags);
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
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="categorySelect">Update Category:</label><br />
          <select id="categorySelect" name="categorySelect" style={{ width: '100%', marginTop: '10px' }} defaultValue={imageTag}>
            {ImageTags.map(tag => (
              <option key={tag.key} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="descriptionInput">Update Description:</label><br />
          <textarea
            id="descriptionInput"
            name="descriptionInput"
            rows={4}
            style={{ width: '100%', marginTop: '10px', resize: 'none' }}
          />
        </div>
      </form>

      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
        <CustomButton label="Update" onClick={toggleModal} />
        <CustomButton buttonType="cancelButton" label="Cancel" onClick={toggleModal} />
      </div>
    </div>
  );
};

export default EditImageModalContent;
