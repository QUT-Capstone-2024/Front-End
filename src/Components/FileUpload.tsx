import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { CustomButton, TextInput } from './';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  initialFileName?: string;
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
        onFileSelect(file); // Pass the selected file to parent
      } else {
        setError('Please select a valid .png or .jpg file');
        setSelectedFileName(null);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 0 }}>
      <CustomButton label="Change image" onClick={() => document.getElementById('file-input')?.click()} />
      <TextInput
        size="small"
        label="Image File"
        value={selectedFileName || ''}
        placeholder="No file selected"
        editable={false}
        onChange={() => {}}
      />
      <input
        id="file-input"
        type="file"
        accept=".png, .jpg"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </Box>
  );
};

export default FileUpload;
