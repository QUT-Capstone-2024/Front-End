import React from "react";
import SampleHouseHeroImage from "../Images/house_demo_hero_image.png";
import SampleApartHeroImage from "../Images/apartment_demo_hero_image.png";
import Popover from "./Popover"; // Assuming the Popover component is already set up

interface SmallDisplayCardProps {
  style?: React.CSSProperties;
  image?: string;
  propertyType?: string;
  propertyAddress?: string;
  onClick?: () => void;
};

const SmallDisplayCard: React.FC<SmallDisplayCardProps> = ({ 
  style, 
  image, 
  propertyType = 'house', 
  propertyAddress = '123 Evergreen Terrace, Springfield, Oregon',
  onClick }) => {

  // Set default image if image prop is not provided based on the propertyType
  const defaultImage = propertyType === 'house' ? SampleHouseHeroImage : SampleApartHeroImage;
  const imageUrl = image || defaultImage;

  // Safely split the address
  const splitAddress = propertyAddress.split(',');
  const street = splitAddress[0] || 'Unknown Street';
  const city = splitAddress[1]?.trim().toUpperCase() || 'UNKNOWN CITY';
  const state = splitAddress[2]?.trim().toUpperCase() || 'UNKNOWN STATE';

  return (
    <div style={style} onClick={onClick}>
      <div style={{ position: 'relative' }}>
        <img className="thumbnail-image" src={imageUrl} alt='Front of house' />
        {/* Show Popover when image is not provided */}
        {!image && (
          <Popover 
            visible={true}
            onClose={() => {}}
            content={null}
            type="thumbnail"
          />
        )}
      </div>
      <div className="small-display-card-text">
        <p>{street}</p>
        <p>{city}, {state}</p>
      </div>
    </div>
  );
};

export default SmallDisplayCard;
