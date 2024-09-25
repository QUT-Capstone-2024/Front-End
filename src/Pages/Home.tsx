import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/store';
import { selectProperty } from '../Redux/Slices/propertySlice'; 
import { getUserCollections, getAllCollections } from '../Services';
import { PropertyCard, SmallDisplayCard, SearchBar, Spacer, AddPropertyCard, UpdateForm } from '../Components';
import { useCheckAuth } from '../Hooks/useCheckAuth';
import { getHeroImage } from '../HelperFunctions/utils';
import './PropertiesHome.scss';
import { UserWithId } from '../types/userTypes';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const userId = useSelector((state: RootState) => state.user.userDetails?.id);
  const token = useSelector((state: RootState) => state.user.token);
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const { isAdmin } = useCheckAuth();

  // Component state
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);   

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users/details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include auth headers if required
          },
        });
        const data = await response.json();
        console.log('Fetched user details:', data);
        // Handle setting user details in state or Redux store
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };
  
    fetchUserDetails();
  }, []);
  

  useEffect(() => {
    const fetchProperties = async () => {
      if (!token) {
        setError('User not authenticated');
        return;
      }

      try {
        setLoading(true);
        let fetchedCollections: any[] = [];

        if (isAdmin) {
          // Admin users fetch all collections
          fetchedCollections = await getAllCollections(token);
        } else if (userId) {
          // Non-admin users fetch only their collections
          fetchedCollections = await getUserCollections(userId, token);
        }

        if (fetchedCollections.length === 0) {
          setIsNewUser(true);
        } else {
          setProperties(fetchedCollections);
        }

        if (fetchedCollections.length > 0 && !selectedPropertyId) {
          // If there's no selected property yet, select the first one by default
          dispatch(selectProperty({
            propertyId: fetchedCollections[0].id,
            propertyAddress: fetchedCollections[0].propertyAddress,
            propertyDescription: fetchedCollections[0].propertyDescription,
            propertySize: fetchedCollections[0].propertySize,
            bedrooms: fetchedCollections[0].bedrooms,
            bathrooms: fetchedCollections[0].bathrooms,
            parkingSpaces: fetchedCollections[0].parkingSpaces,
            propertyType: fetchedCollections[0].propertyType,
            approvalStatus: fetchedCollections[0].approvalStatus,
          }));
        }

      } catch (err: any) {
        console.log(err.message.includes('404'));
        if (err.message && err.message.includes('404')) {
        setIsNewUser(true);  // Assume new user if 404
        } else {
          setError('Failed to fetch properties');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [dispatch, userId, token, isAdmin, selectedPropertyId]);

  // Get selected property from properties list based on selectedPropertyId
  const selectedProperty = properties.find((property) => property.id === selectedPropertyId);

  const getHeroImageForProperty = (property: any) => {
    return getHeroImage(property.images); // Pass the images array to the helper function
  };
  
  // Event handler for selecting a property
  const handleCardClick = (property: any) => {
    dispatch(selectProperty({
      propertyId: property.id,
      propertyAddress: property.propertyAddress,
      propertyDescription: property.propertyDescription,
      propertySize: property.propertySize,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parkingSpaces: property.parkingSpaces,
      propertyType: property.propertyType,
      approvalStatus: property.approvalStatus,
    }));
  };

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>{error}</p>;

  if (isNewUser) {
    return (
      <div className="new-user-container">
        <h2>Welcome to VisionCORE!</h2>
        <p>{user.userDetails?.name}, it looks like you don't have any properties yet.<br />Let's fix that by clicking below.</p>
        <AddPropertyCard />
      </div>
    );
  }

  return (
    <div>
      <Spacer height={2} />
      <div className="admin-home-container">
        <div className="property-search-container">
          {isAdmin && <SearchBar placeholder="Search for a property" onSearch={(query) => console.log(query)} />}
          {!isAdmin && <AddPropertyCard />}
          <Spacer height={1} />
          <h2 className="left">{isAdmin ? 'All Properties' : 'My Properties'}</h2>
          <Spacer height={0.5} />
          <div className='scrollable-list-container'>
          {properties.map((property: any) => (
                <SmallDisplayCard
                  image={getHeroImageForProperty(property)}
                  propertyType={property.propertyType}
                  propertyAddress={property.propertyAddress}
                  key={property.id}
                  onClick={() => handleCardClick(property)}
                />
              ))}
          </div>
        </div>
        <div style={{ marginTop: '10px', width: '60%' }}>
        {selectedProperty ? (
          <PropertyCard
            propertyAddress={selectedProperty.propertyAddress}
            collectionId={selectedProperty.id}
            bedrooms={selectedProperty.bedrooms}
            bathrooms={selectedProperty.bathrooms}
            parkingSpaces={selectedProperty.parkingSpaces ?? 0}
            approvalStatus={selectedProperty.approvalStatus}
            propertyType={selectedProperty.propertyType}
            propertyDescription={selectedProperty.propertyDescription}
            internalPropertySize={selectedProperty.propertySize}
            externalPropertySize={0}
          />
        ) : (
          <div className="empty-property-card">
            <Spacer height={2} />
            <h2>No property selected</h2>
            <div>Select a property to view details</div>
          </div>
        )}
        </div>
        {!isAdmin && userDetails ? (
          <div className="update-profile-section" style={{ width: '30%', padding: '20px', borderLeft: '1px solid #ccc' }}>
            <UpdateForm user={userDetails as unknown as UserWithId} onUpdate={(id, updatedUser) => console.log('Updated:', id, updatedUser)} onCancel={() => console.log('Canceled')} />
          </div>
        ) : null}
      </div>
      <Spacer height={4} />
    </div>
  );
};

export default Home;


// Edit user profile bug - phone number not showing 