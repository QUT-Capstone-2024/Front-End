import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { CustomButton, IconBar } from '../Components';

// Test data
import propertiesData from '../Test Data/sample_properties.json';
import imagesData from '../Test Data/sample_images.json';
import houseDemoHeroImage from '../Images/house_demo_hero_image.png';

const ImageApproval: React.FC = () => {
  const navigate = useNavigate();

  const property = propertiesData.find(
    (prop) => prop.approvalStatus === 'queued'
  );

  const [queuedImages, setQueuedImages] = useState(
    imagesData.images.filter((image) => image.imageStatus === 'queued')
  );

  useEffect(() => {
    if (queuedImages.length === 0) {
      navigate(-1); // Redirect to previous page
    }
  }, [queuedImages, navigate]);

  const handleApproveAll = () => {
    setQueuedImages([]);
  };

  const handleRejectAll = () => {
    const comment = prompt('Please enter a rejection comment for all images:');
    if (comment) {
      setQueuedImages([]);
    }
  };

  const handleApprove = (imageId: string) => {
    setQueuedImages((prevImages) =>
      prevImages.filter((image) => image.imageId !== imageId)
    );
  };

  const handleReject = (imageId: string) => {
    const comment = prompt('Please enter a rejection comment:');
    if (comment) {
      setQueuedImages((prevImages) =>
        prevImages.filter((image) => image.imageId !== imageId)
      );
    }
  };

  const handleEdit = (imageId: string) => {
    alert(`Editing image with ID: ${imageId}`);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#e2eaf1', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#eff7fe', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '800px' }}>
        {property && queuedImages.length > 0 ? (
          <>
            {/* New Title with Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <ArrowBackIcon style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate(-1)} />
              <h1 style={{ textAlign: 'left', color: '#0b517d', fontSize: '2rem', margin: '0' }}>
                PROPERTY: {property.collectionId.toUpperCase()}
              </h1>
            </div>

            {/* Property Header */}
            <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden', marginBottom: '2px' }}>
                <img src={houseDemoHeroImage} alt="Property" style={{ width: '100%', height: '375px', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '20px', left: '30px', width: '90%', backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h1 style={{ fontSize: '2.5rem', margin: '0', color: '#0b517d' }}>{property.propertyAddress.split(',')[0]}</h1>
                    <h2 style={{ fontSize: '1.2rem', marginTop: '5px', fontWeight: 'normal', color: '#0b517d' }}>
                      {property.propertyAddress.split(',')[1].trim()},{" "}{property.propertyAddress.split(',')[2].trim()}
                    </h2>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '14px', marginTop: '10px' }}>
                      <IconBar
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        parkingSpaces={property.parkingSpaces}
                        internalPropertySize={property.internalPropertySize}
                        externalPropertySize={property.externalPropertySize}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <CustomButton buttonType="successButton" label="View Property" />
                      <CustomButton buttonType="successButton" label="Owner Details" />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <CustomButton label="Approve All" onClick={handleApproveAll} />
                <CustomButton label="Reject All" onClick={handleRejectAll} />
              </div>
            </header>

            {/* Image List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {queuedImages.map((image) => (
                <div key={image.imageId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={image.imageUrl} alt={image.imageTag} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ position: 'absolute', top: '0', left: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '5px', fontSize: '0.75rem', borderRadius: '8px', textAlign: 'center', width: '82%' }}>
                      QUEUED
                    </div>
                  </div>
                  <div style={{ flexGrow: 1, marginLeft: '20px', color: '#8f9da3', backgroundColor: 'transparent' }}>
                    <h3>{image.imageTag.toUpperCase()}</h3>
                    {/* Removed the status text */}
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <CustomButton buttonType="successButton" label="Approve" onClick={() => handleApprove(image.imageId)} />
                    <CustomButton buttonType="successButton" label="Edit" onClick={() => handleEdit(image.imageId)} />
                    <CustomButton buttonType="cancelButton" label="Reject" onClick={() => handleReject(image.imageId)} />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default ImageApproval;
