import React, { useState } from 'react';
import { Logo, NavBar, NavBarToggle } from './';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const userName = user.userDetails?.name;
  const userType = user.userDetails?.userType
  .replace('_', ' ')
  .toLowerCase()
  .replace(/\b\w/g, char => char.toUpperCase());


  const toggleNav = () => {
    setNavOpen(!navOpen);
  }

  return (
    <div className='header'>
      <Logo logoSize='small' noText clickable={true} onClick={() => navigate('/home')} />
      <div className='user-details'>{userName}<span className='tablet-desktop-only'>{userType}</span></div>
      <NavBarToggle onClick={toggleNav} />
      <NavBar open={navOpen} onClose={() => setNavOpen(false)}/>
    </div>
  );
};

export default Header;
