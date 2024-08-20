import React, { useState } from 'react';
import { Logo, NavBar, NavBarToggle } from './';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  }

  return (
    <div className='header'>
      <Logo logoSize='small' noText clickable={true} onClick={() => navigate('/home')} />
      <div style={{ flexGrow: 1 }}></div>
      <NavBarToggle onClick={toggleNav} />
      
      <NavBar open={navOpen} onClose={() => setNavOpen(false)}/>
    </div>
  );
};

export default Header;
