import React from 'react';
import { LoginForm } from '../Components';

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  return (
    <div className='formContainer-wholePage'>
      <LoginForm />
    </div>
  );
};

export default Login;