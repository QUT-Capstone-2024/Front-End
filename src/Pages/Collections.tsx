import React from 'react';
import { PropertyCard, LimitedOptionSearch } from '../Components';

// TODO: API call to get all collections
// TODO: Display all collections
// TODO: Allow searching for collections by suburb, postcode, property owner Id, property Id

type CollectionsProps = {};

const allowedFields = [
  { label: 'Collection Approved'},
  { label: 'Collection Queued'},
  { label: 'Collection Rejected'},
  { label: 'By Suburb'},
  { label: 'By Postcode'},
  { label: 'By Property Owner ID'},
  { label: 'By Property ID'},
];

// Sample properties for testing purposes
const properties = [
  {
    title: "Sample House",
    propertyAddress: "Springfield, 939",
    collectionId: "1234",
    propertyOwnerId: "5678",
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 2,
    approvalStatus: "queued",
  },
  {
    title: "Sample Apartment",
    propertyAddress: "Central Park, 123",
    collectionId: "5678",
    propertyOwnerId: "1234",
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 1,
    approvalStatus: "approved",
  },
  {
    title: "Sample Townhouse",
    propertyAddress: "Sunnydale, 666",
    collectionId: "91011",
    propertyOwnerId: "121314",
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 2,
    approvalStatus: "rejected",
  },
];

const Collections: React.FC = () => {
  return (
    <div>
      <h1>Collections</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <LimitedOptionSearch />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '20px' }}>
        {properties.map((property) => (
          <PropertyCard
            key={property.collectionId}  // Using collectionId as a unique key
            title={property.title}
            propertyAddress={property.propertyAddress}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            parkingSpaces={property.parkingSpaces}
            collectionId={property.collectionId}
            propertyOwnerId={property.propertyOwnerId}
            approvalStatus={property.approvalStatus as 'queued' | 'approved' | 'rejected'}
          />
        ))}
      </div>
    </div>
  );
};


export default Collections;