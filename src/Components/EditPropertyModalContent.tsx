import React, { useEffect, useState } from 'react';
import { CustomButton, TextInput, NumberInput, Spacer } from './';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

interface EditPropertyModalContentProps {
  toggleModal: () => void;
  propertyAddress: string;
  propertyDescription: string;
}

const EditPropertyModalContent: React.FC<EditPropertyModalContentProps> = ({
  toggleModal,
  propertyAddress,
}) => {
  // Access the updated property details from the Redux state
  const propertyDetails = useSelector((state: RootState) => state.currentProperty);

  // Local state for editable fields, initialized from Redux state
  const [bedrooms, setBedrooms] = useState<number>(propertyDetails.bedrooms || 0);
  const [bathrooms, setBathrooms] = useState<number>(propertyDetails.bathrooms || 0);
  const [parkingSpaces, setParkingSpaces] = useState<number>(propertyDetails.parking || 0);
  const [internalPropertySize, setInternalPropertySize] = useState<number>(propertyDetails.propertySize || 0);
  const [externalPropertySize, setExternalPropertySize] = useState<number>(0); 
  const [description, setDescription] = useState<string>(propertyDetails.propertyDescription || '');

  // Effect to update local state when the Redux state changes
  useEffect(() => {
    setBedrooms(propertyDetails.bedrooms || 0);
    setBathrooms(propertyDetails.bathrooms || 0);
    setParkingSpaces(propertyDetails.parking || 0);
    setInternalPropertySize(propertyDetails.propertySize || 0);
    setDescription(propertyDetails.propertyDescription || '');
  }, [propertyDetails]);

  const token = useSelector((state: RootState) => state.user.token);

  const handleBathroomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBathrooms(parseInt(event.target.value));
  };

  const handleBedroomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBedrooms(parseInt(event.target.value));
  }

  const handleParkingSpaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParkingSpaces(parseInt(event.target.value));
  }

  const handleInternalPropertySizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalPropertySize(parseInt(event.target.value));
  }

  const handleExternalPropertySizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExternalPropertySize(parseInt(event.target.value));
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value); // Update description state
  };

    // Handle update | post to API
    const handleUpdate = async () => {
      const updatedProperty = {
        bedrooms,
        bathrooms,
        parkingSpaces,
        internalPropertySize,
        externalPropertySize,
        description,
      };
  
      try {
        const response = await fetch('https://api.example.com/properties/update', {
          method: 'POST', // or 'PUT' depending on the API design
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Use token for authentication
          },
          body: JSON.stringify(updatedProperty),
        });
  
        if (response.ok) {
          // Handle successful response
          const data = await response.json();
          console.log('Property updated successfully:', data);
          toggleModal(); // Close the modal after a successful update
        } else {
          // Handle errors
          console.error('Failed to update property:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating property:', error);
      }
    };

  return (
    <div style={{ minWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>{propertyAddress}</h2>
      <Spacer height={1} />
      <form>
        <div style={{ marginBottom: '20px' }}>
          <NumberInput
            label='Bedrooms'
            icon='Bedrooms'
            value={bedrooms}
            onChange={handleBedroomChange}
            editable={true}
          />
        </div>

        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
          <NumberInput
            label='Bathrooms'
            icon='Bathrooms'
            value={bathrooms}
            onChange={handleBathroomChange}
            editable={true}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <NumberInput
            label='Parking Spaces'
            icon='ParkingSpaces'
            value={parkingSpaces}
            onChange={handleParkingSpaceChange}
            editable={true}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <NumberInput
            label='Internal Property Size'
            icon='InternalPropertySize'
            value={internalPropertySize}
            onChange={handleInternalPropertySizeChange}
            editable={true}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <NumberInput
            label='External Property Size'
            icon='ExternalPropertySize'
            value={externalPropertySize}
            onChange={handleExternalPropertySizeChange}
            editable={true}
          />
        </div>

        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
          <TextInput
            size="large"
            label="Description"
            value={description}
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

export default EditPropertyModalContent;