import React from 'react';
import VLLogo from "../Images/VisionCORE_logo.png";

interface LogoProps {};

const Logo: React.FC = () => {
    return (
        <div className="logo-container">
            <img src={VLLogo} alt='VisionCore Logo' className="logo" /> 
            <h1 className="logo-text">VisionCORE</h1>
        </div>
    )
};

export default Logo;

