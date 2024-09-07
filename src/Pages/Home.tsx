import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/store';
import { selectProperty } from '../Redux/Slices/propertySlice'; 
import { getUserCollections, getAllCollections } from '../Services';
import { PropertyCard, SmallDisplayCard, SearchBar, Spacer, AddPropertyCard } from '../Components';
import { Collection } from '../types'; 
import './PropertiesHome.scss';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const dispatch = useDispatch();
  const userType = useSelector((state: RootState) => state.user.userDetails?.userType);
  const userId = useSelector((state: RootState) => state.user.userDetails?.id);
  const token = useSelector((state: RootState) => state.user.token);
  const selectedPropertyId = useSelector((state: RootState) => state.currentProperty.selectedPropertyId);
  const isAdmin = userType === 'CL_ADMIN';

  // State for fetched properties (collections)
  const [properties, setProperties] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch collections on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      if (!token) {
        setError('User not authenticated');
        return;
      }

      try {
        setLoading(true);
        let fetchedCollections: Collection[] = [];

        if (isAdmin) {
          // Admin users fetch all collections
          fetchedCollections = await getAllCollections(token);
        } else if (userId) {
          // Non-admin users fetch only their collections
          fetchedCollections = await getUserCollections(userId, token);
        }

        setProperties(fetchedCollections);

        if (fetchedCollections.length > 0 && !selectedPropertyId) {
          // If there's no selected property yet, select the first one by default
          dispatch(selectProperty({
            propertyId: fetchedCollections[0].id,
            propertyAddress: fetchedCollections[0].propertyAddress,
          }));
        }
      } catch (err) {
        setError('Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [dispatch, userId, token, isAdmin, selectedPropertyId]);

  // Get selected property from properties list based on selectedPropertyId
  const selectedProperty = properties.find((property) => property.id === selectedPropertyId);

  // Event handler for selecting a property
  const handleCardClick = (property: Collection) => {
    dispatch(selectProperty({
      propertyId: property.id,
      propertyAddress: property.propertyAddress,
    }));
  };

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>{error}</p>;

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
          {properties.map((property: Collection) => (
            <div
              key={property.id}
              className="small-display-card-container"
              onClick={() => handleCardClick(property)}
            >
              <SmallDisplayCard
                image={property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : ''}
                propertyType={property.propertyType}
                propertyAddress={property.propertyAddress}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: '10px', width: '60%' }}>
        {selectedProperty ? (
          <PropertyCard
            propertyAddress={selectedProperty.propertyAddress}
            imageUrl={selectedProperty.imageUrls && selectedProperty.imageUrls.length > 0 ? selectedProperty.imageUrls[0] : ''}
            collectionId={selectedProperty.id}
            propertyOwnerId={selectedProperty.propertyOwnerId}
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
      </div>
      <Spacer height={4} />
    </div>
  );
};

export default Home;
