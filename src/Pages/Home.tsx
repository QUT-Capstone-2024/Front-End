import React, { useState } from 'react';
import { PropertyCard, SmallDisplayCard, SearchBar, Spacer, AddPropertyCard } from '../Components';
import './PropertiesHome.scss';

// REMOVE: Test data
import propertiesData from '../Test Data/sample_properties.json';

// REMOVE: Testing states - Pull from store
const isAdmin = true;

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
  propertySize: number;
}

interface HomeProps {}

// Type cast the imported JSON data
const properties: Property[] = propertiesData as Property[];

const Home: React.FC<HomeProps> = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleCardClick = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div>
        <Spacer height={2}/>
        <div className='admin-home-container'>
          <div className="property-search-container">
            {isAdmin && <SearchBar placeholder="Search for a property" onSearch={(query) => console.log(query)} />}
            {!isAdmin && <AddPropertyCard />}
            <Spacer height={1}/>
            <h2 className="left">{isAdmin? 'Properties' : 'My Properties'}</h2>
            <Spacer height={0.5}/>
            {properties.map((property: Property) => (
              <div key={property.id} className="small-display-card-container" onClick={() => handleCardClick(property)}>
                <SmallDisplayCard
                    image={property.imageUrl}
                    propertyType={property.propertyType}
                    propertyAddress={property.propertyAddress}
                />
              </div>
            ))}
          </div>
          <div style={{marginTop: '10px', width: '60%'}}>
              {selectedProperty && (
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
                  propertySize={selectedProperty.propertySize}
                  />
                )}
              {!selectedProperty && (
                  <div className="empty-property-card">
                    <Spacer height={2}/>
                    <h2>No property selected</h2>
                  <div>Select a property to view details</div>
                  </div>)}
          </div>
        </div>
        <Spacer height={4}/>
    </div>
  );
};

export default Home;
