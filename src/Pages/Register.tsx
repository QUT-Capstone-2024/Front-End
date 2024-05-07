import React from 'react';
import RegisterForm from '../Components/RegisterForm';

type RegisterProps = {

};

const Register: React.FC<RegisterProps> = () => {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
    </div>
  );
};

export default Register;