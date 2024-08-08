import React, { useState } from 'react';
import { PropertyCard, SmallDisplayCard, SearchBar, Spacer, Logo } from '../Components';
import propertiesData from '../Test Data/sample_properties.json'; // Adjust the import path as needed
import '../Pages/AdminHome.scss';

interface Property {
  id: number;
  title: string;
  propertyAddress: string;
  imageUrl?: string;
  collectionId: string;
  propertyOwnerId: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  approvalStatus: "queued" | "approved" | "rejected";
  propertyType: string;
}

interface AdminHomeProps {}

// Type cast the imported JSON data
const properties: Property[] = propertiesData as Property[];

const AdminHome: React.FC<AdminHomeProps> = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleCardClick = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div>
        <Spacer height={2}/>
        <div className='admin-home-container'>
          <div className="property-search-container">
          <SearchBar placeholder="Search for a property" onSearch={(query) => console.log(query)} />
          <Spacer height={1}/>
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
                  title={selectedProperty.title}
                  propertyAddress={selectedProperty.propertyAddress}
                  imageUrl={selectedProperty.imageUrl}
                  collectionId={selectedProperty.collectionId}
                  propertyOwnerId={selectedProperty.propertyOwnerId}
                  bedrooms={selectedProperty.bedrooms}
                  bathrooms={selectedProperty.bathrooms}
                  parkingSpaces={selectedProperty.parkingSpaces}
                  approvalStatus={selectedProperty.approvalStatus}
                  propertyType={selectedProperty.propertyType}
              />
              )}
              {!selectedProperty && (
                  <div className="empty-property-card">
                      <h2>No property selected</h2>
                  <div>Select a property to view details</div>
                  </div>)}
          </div>
        </div>
    </div>
  );
};

export default AdminHome;
