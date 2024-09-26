import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { searchCollectionsByAddress, updateCollection } from '../Services';
import { Collection } from "../types";
import { SearchBar, SmallDisplayCard, CustomModal, CustomAlert } from ".";
import { getHeroImage } from '../HelperFunctions/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import "./AddPropertyCard.scss";

interface AddPropertyCardProps {
  title?: string;
  text?: string;
}

const AddPropertyCard: React.FC<AddPropertyCardProps> = ({ title = 'Claim a property', text = 'Find your home' }) => {
  const navigate = useNavigate();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [properties, setProperties] = useState<Collection[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Collection | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<"info" | "warning" | "error" | "success">('info');
  const user = useSelector((state: any) => state.user);

  const toggleModal = (property?: Collection) => {
    setSelectedProperty(property || null);
    setShowModal(!showModal);
  };

  const modalContent = (
    <div>
      <h2>Claim ownership of:</h2>
      {selectedProperty ? (
        <>
          <p>{selectedProperty.propertyAddress}</p>
        </>
      ) : (
        <p>No property selected</p>
      )}
    </div>
  );

  const handleAlertClose = () => {
    setMessage('')
    setMessageType('info')
  };

  const handleButtonClick = () => {
    setShowSearchBar(true);
  };

  const handleCardClick = async () => {
    if (!selectedProperty) return;
    try {
      const token = user.token;
      if (!token) {
        setMessage('No token available');
        setMessageType('warning');
        throw new Error('No token available');
      }
      const updatedCollection = {
        user: { id: user.userDetails.id }
      };
      await updateCollection(selectedProperty.id, updatedCollection, token);
      toggleModal();
      setMessageType('success');
      setMessage('Property ownership claimed successfully');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage('Failed to update collection ownership');
      setMessageType('error');
    }
  };

  const getHeroImageForProperty = (property: any) => {
    return getHeroImage(property.images);
  };

  const handleSearch = async (query: string) => {
    try {
      const token = user.token;
      if (!token) {
        throw new Error('No token available');
      }
      const response = await searchCollectionsByAddress(query, token);
      setProperties(response);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="add-property-card-wrapper">
      {showSearchBar ? (
        <div>
          <SearchBar placeholder="Search for your property..." onSearch={handleSearch} style={{ marginLeft: '12px' }} />
        </div>
      ) : (
        <div className="add-property-card-container" onClick={handleButtonClick}>
          <AddCircleOutlineIcon className="add-icon" />
          <div className="small-display-card-text">
            <p>{title}</p>
            <p>{text}</p>
          </div>
        </div>
      )}

      {/* Render the search results as a simple list */}
      {properties.length > 0 ? (
        <>
          <p style={{ textAlign: 'center' }}>Click a property to claim it as yours ...<br />... then start adding photos</p>
          <div className='scrollable-list-container'>
            {properties.map((property: any) => (
              <SmallDisplayCard
                image={getHeroImageForProperty(property)}
                propertyType={property.propertyType}
                propertyAddress={property.propertyAddress}
                key={property.id}
                onClick={() => toggleModal(property)}  // Pass selected property to modal
              />
            ))}
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>No properties found</p>
      )}
      <CustomModal 
        open={showModal} 
        onClose={toggleModal} 
        children={modalContent} 
        modalType="twoButton" 
        onConfirm={handleCardClick}
      />
       <CustomAlert 
        isVisible={message !== ''}
        type={messageType}
        message={message}
        onClose={handleAlertClose}
      />
    </div>
  );
};

export default AddPropertyCard;
