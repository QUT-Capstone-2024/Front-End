import React from "react";
import { LoginForm } from "../Components";
import { useNavigate } from "react-router-dom";
import { CustomButton, Spacer, Logo } from "../Components";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleNeedAccount = () => {
        navigate("/Register");
    };
    
    return (
        <div className="overlay-container">
            <div className="background-overlay"></div>
            <div className="overlay-content-container">
                <Spacer height={2} />
                <Logo />
                <div className="overlay-button-container">
                    <LoginForm />
                    <Spacer height={2} />
                    <CustomButton 
                        label="No VisionCORE account? click here ..." 
                        buttonType="textOnly" 
                        onClick={handleNeedAccount}
                    />
                    <Spacer height={2} />
                </div>
            </div>
        </div>
    )
};

export default LandingPage;
