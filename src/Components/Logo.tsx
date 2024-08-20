import React from 'react';
import VLLogo from "../Images/VisionCORE_logo.png";

interface LogoProps {
    logoSize?: 'tiny' | 'small' | 'medium' | 'large';
    noText?: boolean;
    clickable?: boolean;
    onClick?: () => void;
};

const Logo: React.FC<LogoProps> = ({ logoSize = 'large', noText = false, clickable = false, onClick }) => {
    return (
        <div className="logo-container" onClick={clickable ? onClick : undefined}>
            <img src={VLLogo} alt='VisionCore Logo' className={`logo ${logoSize}`}/> 
            {!noText && <div className={`logo-text ${logoSize}`}>VisionCORE</div>}
        </div>
    )
};

export default Logo;

