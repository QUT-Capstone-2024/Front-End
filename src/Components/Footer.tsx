import React from 'react';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <div className='footer tablet-desktop-only'>
      <p className='footer-text'>MrMurphy <span>(admin)</span></p>
      <p className='footer-text'>© 2024 Property Image Recognition System</p>
    </div>
  );
};

export default Footer;