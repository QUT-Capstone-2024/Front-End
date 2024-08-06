import React from "react";
import SampleHouseHeroImage from "../Images/house_demo_hero_image.png";
import SampleApartHeroImage from "../Images/apartment_demo_hero_image.png";

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

    const splitAddress = propertyAddress.split(',');
    const street = splitAddress[0];
    const city = splitAddress[1].toUpperCase();
    const state = splitAddress[2].toUpperCase();


    return (
        <>
            <img className="thumbnail-image" src={imageUrl} alt='Front of house'/>
            <div className="small-display-card-text">
              <p>{street}</p>
              <p>{city}, {state}</p>
            </div>
        </>
    );
};

export default SmallDisplayCard;
