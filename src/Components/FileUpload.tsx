import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { CustomButton, TextInput } from './';
import Spacer from './Spacer';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  initialFileName?: string; // Optional prop to set the initial file name
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, initialFileName }) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(initialFileName || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update the displayed file name if initialFileName changes
    setSelectedFileName(initialFileName || null);
  }, [initialFileName]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const isValidType = file.type === 'image/png' || file.type === 'image/jpeg';
      
      if (isValidType) {
        setSelectedFileName(file.name);
        setError(null);
        onFileSelect(file);
      } else {
        setError('Please select a valid .png or .jpg file');
        setSelectedFileName(null);
      }
    }
  };

  const handleButtonClick = () => {
    document.getElementById('file-input')?.click(); // Trigger the file input click
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 0 }}>
      <CustomButton label="change image" onClick={handleButtonClick} />
      <TextInput size='small' label='Image File' value={selectedFileName || ''} placeholder="No file selected" editable={false} onChange={() => console.log('changed')} />
      <input
        id="file-input"
        type="file"
        accept=".png, .jpg"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default FileUpload;
