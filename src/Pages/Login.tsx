import React from 'react';
import { LoginForm } from '../Components';

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  return (
    <div className='formContainer-wholePage' style={{color: 'red'}}>
      <LoginForm />
      <div>hello</div>
    </div>
  );
};

export default Login;