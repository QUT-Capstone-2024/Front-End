import React from 'react';
import { Logo, RegisterForm, Spacer } from '../Components';

type RegisterProps = {};

const Register: React.FC<RegisterProps> = () => {
  return (
    <div className="overlay-container">
      <div className="background-overlay"></div>
      <div className="overlay-content-container">
          <Spacer height={2} />
          <Logo />
          <div className="overlay-button-container">
              <RegisterForm />
              <Spacer height={2} />
          </div>
      </div>
    </div>
  );
};

export default Register;

