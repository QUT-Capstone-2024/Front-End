import React from 'react';
import { RegisterForm } from '../Components';

type RegisterProps = {};

const Register: React.FC<RegisterProps> = () => {
  return (
    <div className='formContainer-wholePage'>
      <RegisterForm/>
    </div>
  );
};

export default Register;