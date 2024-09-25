import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { Card, CardContent, Box, Typography } from '@mui/material';
import { CustomButton, IconBar } from '../Components';
import { getImagesByCollectionId, getCollectionById } from '../Services'; 
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import houseDemoHeroImage from '../Images/house_demo_hero_image.png';

const ImageApproval: React.FC = () => {
  const navigate = useNavigate();
  const { collectionId } = useParams<{ collectionId: string }>(); // Get collectionId from route parameters
  const [property, setProperty] = useState<any>(null); // You can replace `any` with the correct type
  const [queuedImages, setQueuedImages] = useState<any[]>([]); // Same for `any[]`
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (!collectionId || !token) {
      console.error("Missing collectionId or token.");
      return;
    }
  
    console.log("Fetching data for collectionId:", collectionId);
  
    // Fetch the property details by collectionId
    const fetchPropertyData = async () => {
      try {
        const fetchedProperty = await getCollectionById(Number(collectionId), token); // Pass the token
        setProperty(fetchedProperty);
        console.log("Fetched property:", fetchedProperty);
      } catch (error) {
        console.error("Failed to fetch property data", error);
      }
    };
  
    const fetchQueuedImages = async () => {
      try {
        const fetchedImages = await getImagesByCollectionId(Number(collectionId), token); // Pass the token
        const queued = fetchedImages.filter((image: any) => image.imageStatus === 'PENDING');
        setQueuedImages(queued);
        console.log("Fetched queued images:", queued);
      } catch (error) {
        console.error("Failed to fetch queued images", error);
      }
    };
  
    fetchPropertyData();
    fetchQueuedImages();
  }, [collectionId, token, navigate]);
  

  useEffect(() => {
    if (queuedImages.length === 0) navigate(-1); // Redirect if no queued images
  }, [queuedImages, navigate]);

  const handleImageAction = async (imageId: string, action: 'APPROVE' | 'REJECT' | 'EDIT') => {
    if (action === 'REJECT') {
      const comment = prompt('Please enter a rejection comment:');
      if (!comment) return;
      // Call API to reject image
    }
    if (action === 'EDIT') alert(`Editing image with ID: ${imageId}`);
    // Call API to approve/reject/edit images based on action
    setQueuedImages(prevImages => prevImages.filter(image => image.imageId !== imageId));
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (action === 'reject') {
      const comment = prompt('Please enter a rejection comment for all images:');
      if (!comment) return;
      // Call API to reject all images
    }
    // Call API to approve/reject all images
    setQueuedImages([]);
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#e2eaf1', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh' }}>
      <Card sx={{ backgroundColor: '#eff7fe', padding: '20px', borderRadius: '8px', boxShadow: 1, width: '100%', maxWidth: '800px' }}>
        {property && queuedImages.length > 0 && (
          <>
            <CardContent sx={{ paddingBottom: '16px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <ArrowBackIcon sx={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate(-1)} />
                <Typography variant="h4" color="primary" fontWeight="bold">
                  PROPERTY: {property.collectionId.toUpperCase()}
                </Typography>
              </Box>

              <Box sx={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', mb: 2 }}>
                <img src={property.imageUrl || houseDemoHeroImage} alt="Property" style={{ width: '100%', height: '375px', objectFit: 'cover' }} />
                <Box sx={{ position: 'absolute', bottom: '40px', left: '20px', width: '90%', backgroundColor: 'rgba(255, 255, 255, 0.45)', padding: '20px', borderRadius: '12px' }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {property.propertyAddress?.split(',')[0]}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {property.propertyAddress?.split(',')[1].trim()},{" "}{property.propertyAddress?.split(',')[2].trim()}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', mt: 1 }}>
                    <IconBar {...property} />
                    <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    </Box>
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
                    <CustomButton label="Approve" onClick={() => handleImageAction(image.imageId, 'APPROVE')} />
                    <CustomButton label="Edit" onClick={() => handleImageAction(image.imageId, 'EDIT')} />
                    <CustomButton buttonType="cancelButton" label="Reject" onClick={() => handleImageAction(image.imageId, 'REJECT')} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </>
        )}
      </Card>
    </Box>
  );
};

export default ImageApproval;
