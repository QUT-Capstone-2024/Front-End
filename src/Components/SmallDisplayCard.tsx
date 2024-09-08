import React from "react";
import SampleHouseHeroImage from "../Images/house_demo_hero_image.png";
import SampleApartHeroImage from "../Images/apartment_demo_hero_image.png";
import {Popover} from "./"; // Assuming the Popover component is already set up

interface SmallDisplayCardProps {
  style?: React.CSSProperties;
  image?: string | null;
  propertyType?: string;
  propertyAddress?: string;
  onClick?: () => void;
}

const SmallDisplayCard: React.FC<SmallDisplayCardProps> = ({
  style,
  image,
  propertyType = "house",
  propertyAddress = "123 Evergreen Terrace, Springfield, Oregon",
  onClick,
}) => {
  // Set default image if image prop is not provided based on the propertyType
  const defaultImage =
    propertyType === "house" ? SampleHouseHeroImage : SampleApartHeroImage;
  const imageUrl = image || defaultImage;

  // Safely split the address
  const splitAddress = propertyAddress.split(",");
  const street = splitAddress[0] || "Unknown Street";
  const city = splitAddress[1]?.trim() || "UNKNOWN CITY";
  const state = splitAddress[2]?.trim() || "UNKNOWN STATE";

  return (
    <div style={style} onClick={onClick} className="small-display-card-container">
      <div style={{ position: "relative", height: '70px' }}>
        <img className="thumbnail-image" src={imageUrl} alt="Front of house" />
        {/* Always show Popover when no image is available */}
        {!image && (
          <Popover
            visible={true}
            content={
              <div>
              </div>
            }
            type="thumbnail"
          />
        )}
      </div>
      <div className="small-display-card-text">
        <p>{street}</p>
        <p>{city}</p>
        <p>{state}</p>
      </div>
    </div>
  );
};

export default SmallDisplayCard;
