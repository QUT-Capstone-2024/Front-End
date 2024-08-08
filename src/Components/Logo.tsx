import React from 'react';
import VLLogo from "../Images/VisionCORE_logo.png";

interface LogoProps {
    logoSize?: 'tiny' | 'small' | 'medium' | 'large';
    noText?: boolean;
};

const Logo: React.FC<LogoProps> = ({ logoSize = 'large', noText = false }) => {
    return (
        <div className="logo-container">
            <img src={VLLogo} alt='VisionCore Logo' className={`logo ${logoSize}`}/> 
            {!noText && <div className={`logo-text ${logoSize}`}>VisionCORE</div>}
        </div>
    )
};

export default Logo;

