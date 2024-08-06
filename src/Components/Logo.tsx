import React from 'react';
import VLLogo from "../Images/VisionCORE_logo.png";

interface LogoProps {
    logoSize?: 'small' | 'medium' | 'large';
};

const Logo: React.FC<LogoProps> = ({ logoSize = 'large' }) => {
    return (
        <div className="logo-container">
            <img src={VLLogo} alt='VisionCore Logo' className={`logo ${logoSize}`}/> 
            <div className={`logo-text ${logoSize}`}>VisionCORE</div>
        </div>
    )
};

export default Logo;

