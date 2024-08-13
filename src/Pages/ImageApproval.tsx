import React, { useState } from 'react';
import './ImageApproval.scss';
import BedRoundedIcon from '@mui/icons-material/BedRounded';
import ShowerRoundedIcon from '@mui/icons-material/ShowerRounded';
import GarageRoundedIcon from '@mui/icons-material/GarageRounded';


// Test data
import propertiesData from '../Test Data/sample_properties.json';
import imagesData from '../Test Data/sample_images.json';
import houseDemoHeroImage from '../Images/house_demo_hero_image.png';

type Property = {
  id: number;
  propertyDescription: string;
  propertyAddress: string;
  imageUrl: string;
  collectionId: string;
  propertySize: number;
  propertyOwnerId: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  approvalStatus: "queued" | "approved" | "rejected";
  propertyType: string;
};

type Image = {
  imageUrl: string;
  imageTag: string;
  imageId: string;
  imageStatus: "approved" | "rejected" | "queued";
};

const ImageApproval: React.FC = () => {
  const property: Property | undefined = propertiesData.length > 0
    ? {
        ...propertiesData[0],
        approvalStatus: propertiesData[0].approvalStatus as "queued" | "approved" | "rejected",
      }
    : undefined;

  const [queuedImages, setQueuedImages] = useState<Image[]>(
    imagesData.images
      .filter((image) => image.imageStatus === "queued")
      .map((image) => ({
        ...image,
        imageStatus: image.imageStatus as "queued" | "approved" | "rejected",
      }))
  );

  const [rejectionComments, setRejectionComments] = useState<{ [key: string]: string }>({});

  const handleApprove = (imageId: string) => {
    setQueuedImages((prevImages) => prevImages.filter((image) => image.imageId !== imageId));
  };

  const handleReject = (imageId: string) => {
    const comment = prompt("Please enter a rejection comment:");
    if (comment) {
      setRejectionComments((prevComments) => ({
        ...prevComments,
        [imageId]: comment,
      }));
      setQueuedImages((prevImages) => prevImages.filter((image) => image.imageId !== imageId));
    }
  };

  const handleEdit = (imageId: string) => {
    alert(`Editing image with ID: ${imageId}`);
    // Add your edit logic here, like opening a modal to edit the image details
  };

  return (
    <div className="image-approval-page">
      <div className="content-container">
        {property ? (
          <>
            <header className="property-header">
              <div className="property-image-container">
                <img
                  src={houseDemoHeroImage}
                  alt="Property"
                  className="property-image"
                />
                <div className="property-info-overlay">
                  <div className="property-info-background">
                    <h1 className="property-title">{property.propertyAddress.split(',')[0]}</h1>
                    <h2 className="property-subtitle">
                      {property.propertyAddress.split(',')[1].trim()},{" "}
                      {property.propertyAddress.split(',')[2].trim()}
                    </h2>
                    <p className="property-id">Property ID: {property.collectionId}</p>
                  </div>
                  <div className="property-buttons-container">
                    <div className="property-meta">
                      <span className="property-meta-item">
                        <BedRoundedIcon /> {property.bedrooms}
                      </span>
                      <span className="property-meta-item">
                        <ShowerRoundedIcon /> {property.bathrooms}
                      </span>
                      <span className="property-meta-item">
                        <GarageRoundedIcon /> {property.parkingSpaces}
                      </span>
                    </div>
                    <div className="property-buttons">
                      <button className="view-property-btn">View Property</button>
                      <button className="owner-name-btn">Owner Name</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="action-buttons">
                <button className="approve-all">Approve All</button>
                <button className="reject-all">Reject All</button>
              </div>
            </header>

            {/* Image List */}
            <div className="image-list">
              {queuedImages.length > 0 ? (
                queuedImages.map((image) => (
                  <div key={image.imageId} className="image-item">
                    <div className="image-thumbnail">
                      <img src={image.imageUrl} alt={image.imageTag} />
                      <div className="image-status">QUEUED</div>
                    </div>
                    <div className="image-details">
                      <h3>{image.imageTag.toUpperCase()}</h3>
                      <p>Status: {image.imageStatus}</p>
                    </div>
                    <div className="image-actions">
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(image.imageId)}
                      >
                        Approve
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(image.imageId)}
                      >
                        Edit
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(image.imageId)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No images available.</p> /* change to revert to previous page when no required reviews */
              )}
            </div>
          </>
        ) : (
          <p>No property data available.</p>
        )}
      </div>
    </div>
  );
};

export default ImageApproval;
