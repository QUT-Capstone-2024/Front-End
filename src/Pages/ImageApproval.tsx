import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { Card, CardContent, Box, Typography } from '@mui/material';
import { CustomButton, IconBar } from '../Components';
import { getImagesByCollectionId, getCollectionById } from '../Services';
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import houseDemoHeroImage from '../Images/house_demo_hero_image.png';

const ImageApproval: React.FC = () => {
  const navigate = useNavigate();
  const [queuedImages, setQueuedImages] = useState<any[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<any>(null); 
  const [error, setError] = useState<string | null>(null);

  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const token = useSelector((state: RootState) => state.user.token);

  // Function to fetch property and images by property ID
  const fetchPropertyData = async () => {
    if (selectedPropertyId && token) {
      try {
        console.log('Fetching updated property data...');
        
        // Fetch images for the selected property (queued for approval)
        const fetchedImages = await getImagesByCollectionId(selectedPropertyId, token);
        
        // Filter images that are pending approval
        const queued = fetchedImages.filter((image: any) => image.imageStatus === 'PENDING');
        setQueuedImages(queued);

        // Fetch property details
        const fetchedPropertyDetails = await getCollectionById(selectedPropertyId, token);
        setPropertyDetails(fetchedPropertyDetails);

        if (queued.length === 0) navigate(-1); // Redirect if no queued images
      } catch (error) {
        console.error('Error fetching property data:', error);
        setError('Failed to fetch property data.');
      }
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [selectedPropertyId, token, navigate]);

  const handleImageAction = (imageId: string, action: 'approve' | 'reject' | 'edit') => {
    if (action === 'reject') {
      const comment = prompt('Please enter a rejection comment:');
      if (!comment) return;
    }
    if (action === 'edit') alert(`Editing image with ID: ${imageId}`);
    setQueuedImages(prevImages => prevImages.filter(image => image.imageId !== imageId));
  };

  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (action === 'reject') {
      const comment = prompt('Please enter a rejection comment for all images:');
      if (!comment) return;
    }
    setQueuedImages([]);
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#e2eaf1', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh' }}>
      <Card sx={{ backgroundColor: '#eff7fe', padding: '20px', borderRadius: '8px', boxShadow: 1, width: '100%', maxWidth: '800px' }}>
        {propertyDetails && queuedImages.length > 0 && (
          <>
            <CardContent sx={{ paddingBottom: '16px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <ArrowBackIcon sx={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate(-1)} />
                <Typography variant="h4" color="primary" fontWeight="bold">
                  PROPERTY: {propertyDetails.collectionId.toUpperCase()}
                </Typography>
              </Box>

              <Box sx={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', mb: 2 }}>
                <img src={propertyDetails.imageUrl || houseDemoHeroImage} alt="Property" style={{ width: '100%', height: '375px', objectFit: 'cover' }} />
                <Box sx={{ position: 'absolute', bottom: '40px', left: '20px', width: '90%', backgroundColor: 'rgba(255, 255, 255, 0.45)', padding: '20px', borderRadius: '12px' }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {propertyDetails.propertyAddress?.split(',')[0]}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {propertyDetails.propertyAddress?.split(',')[1].trim()},{" "}{propertyDetails.propertyAddress?.split(',')[2].trim()}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', mt: 1 }}>
                    <IconBar {...propertyDetails} />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px', mt: 2 }}>
                <CustomButton label="Approve All" onClick={() => handleBulkAction('approve')} />
                <CustomButton label="Reject All" onClick={() => handleBulkAction('reject')} />
              </Box>
            </CardContent>

            <CardContent sx={{ paddingTop: 0 }}>
              {queuedImages.map(image => (
                <Box key={image.imageId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#eff7fe', borderRadius: '8px', boxShadow: 1, mb: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <img src={image.imageUrl} alt={image.imageTag} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <Box sx={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '5px', fontSize: '0.75rem', borderRadius: '8px', textAlign: 'center', width: '82%' }}>
                      QUEUED
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ flexGrow: 1, ml: '20px', color: 'primary' }}>
                    {image.imageTag.toUpperCase()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '15px' }}>
                    <CustomButton label="Approve" onClick={() => handleImageAction(image.imageId, 'approve')} />
                    <CustomButton label="Edit" onClick={() => handleImageAction(image.imageId, 'edit')} />
                    <CustomButton buttonType="cancelButton" label="Reject" onClick={() => handleImageAction(image.imageId, 'reject')} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </Card>
    </Box>
  );
};

export default ImageApproval;
