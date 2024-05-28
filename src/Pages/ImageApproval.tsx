import React from 'react';
import ScrollingList from '../Components/ScrollingList';

type ImageApprovalProps = {
  // Define the props for the ImageApproval component
};

const ImageApproval: React.FC<ImageApprovalProps> = () => {
  return (
    <div>
      <h1>Image Approval </h1>

      <ScrollingList />
    </div>
  );
};

export default ImageApproval;