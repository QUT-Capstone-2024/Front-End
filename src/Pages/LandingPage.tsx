import React from "react";
import logo1 from "../Images/logo1.png";
import { LoginForm } from "../Components";

type LandingPageProps = {};
const LandingPage: React.FC = () => {
    return (
        <div style={{display:'flex',flexDirection:"column"}}>
            <img src={logo1} alt='VisionCore Logo' style={{width:"150px", height:"150px", marginLeft:"30vw"}} /> 
            <div>
                <LoginForm />
                <a> anything </a>
             </div>
        </div>
    )
};
export default LandingPage; 