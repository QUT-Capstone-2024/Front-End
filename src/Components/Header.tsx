import React from 'react';
import { Logo, NavBar } from './';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <div className='header'>
      <Logo logoSize='small' noText />
      <NavBar />
    </div>
  );
};

export default Header;