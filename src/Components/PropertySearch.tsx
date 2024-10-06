import React from 'react';
import { SmallDisplayCard, SearchBar, Spacer } from '../Components';
import data from '../Test Data/sample_properties.json'; // This is placeholder data for testing the ui

interface PropertySearchProps {};

const PropertySearch: React.FC<PropertySearchProps> = () => {
    return (
        <>
            <div className='property-search-container'>
              <Spacer height={1}/>
              <SearchBar placeholder="Search for a property" onSearch={(query) => console.log(query)} />
              <Spacer height={1}/>
              {data.map((property) => (
                <SmallDisplayCard 
                key={property.id}
                image={property.imageUrl}
                propertyType={property.propertyType}
                propertyAddress={property.propertyAddress} 
                />
              ))}
            </div>
        </>
    );
};

export default PropertySearch;