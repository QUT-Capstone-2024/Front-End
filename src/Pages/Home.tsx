import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/store';
import { selectProperty } from '../Redux/Slices/propertySlice'; // Updated action to dispatch propertyId and address
import { PropertyCard, SmallDisplayCard, SearchBar, Spacer, AddPropertyCard } from '../Components';
import './PropertiesHome.scss';

// REMOVE: Test data
import propertiesData from '../Test Data/sample_properties.json';

interface Property {
  id: number;
  propertyAddress: string;
  imageUrl?: string;
  collectionId: string;
  propertyOwnerId: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  approvalStatus: "queued" | "approved" | "rejected";
  propertyType: string;
  propertyDescription: string;
  internalPropertySize: number;
  externalPropertySize: number;
}

interface HomeProps {}

// Type cast the imported JSON data
const properties: Property[] = propertiesData as Property[];

const Home: React.FC<HomeProps> = () => {
  const dispatch = useDispatch();
  const userType = useSelector((state: RootState) => state.user.userDetails?.userType);
  const isAdmin = userType === 'CL_ADMIN';

  // This state stores the currently selected property locally
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // If no property is selected, select the first property by default
  useEffect(() => {
    if (properties.length > 0 && !selectedProperty) {
      const defaultProperty = properties[0];
      setSelectedProperty(defaultProperty);
      // Dispatch both propertyId and propertyAddress to the Redux slice
      dispatch(selectProperty({ propertyId: defaultProperty.id, propertyAddress: defaultProperty.propertyAddress }));
    }
  }, [properties, selectedProperty, dispatch]);

  // When a property card is clicked, update both the local state and Redux store
  const handleCardClick = (property: Property) => {
    setSelectedProperty(property);
    // Dispatch both propertyId and propertyAddress to generate the slug in the slice
    dispatch(selectProperty({ propertyId: property.id, propertyAddress: property.propertyAddress }));
  };

  return (
    <div>
      <Spacer height={2} />
      <div className="admin-home-container">
        <div className="property-search-container">
          {isAdmin && <SearchBar placeholder="Search for a property" onSearch={(query) => console.log(query)} />}
          {!isAdmin && <AddPropertyCard />}
          <Spacer height={1} />
          <h2 className="left">{isAdmin ? 'Properties' : 'My Properties'}</h2>
          <Spacer height={0.5} />
          {properties.map((property: Property) => (
            <div
              key={property.id}
              className="small-display-card-container"
              onClick={() => handleCardClick(property)} // Update both local state and Redux on click
            >
              <SmallDisplayCard
                image={property.imageUrl}
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
              imageUrl={selectedProperty.imageUrl}
              collectionId={selectedProperty.collectionId}
              propertyOwnerId={selectedProperty.propertyOwnerId}
              bedrooms={selectedProperty.bedrooms}
              bathrooms={selectedProperty.bathrooms}
              parkingSpaces={selectedProperty.parkingSpaces}
              approvalStatus={selectedProperty.approvalStatus}
              propertyType={selectedProperty.propertyType}
              propertyDescription={selectedProperty.propertyDescription}
              internalPropertySize={selectedProperty.internalPropertySize}
              externalPropertySize={selectedProperty.externalPropertySize}
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
