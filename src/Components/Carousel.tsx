import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

interface CarouselProps {
  images: string[];
  settings?: any;
  height?: string;
  width?: string;
}

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <ArrowForwardIosIcon
      className={className}
      style={{ ...style, display: 'block', color: 'black', right: 10, zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <ArrowBackIosIcon
      className={className}
      style={{ ...style, display: 'block', color: 'black', left: 10, zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const Carousel: React.FC<CarouselProps> = ({ images, settings, height = '300px', width = '100%', ...rest }) => {
  const defaultSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false, // Disable autoplay
    nextArrow: <NextArrow className="carousel-arrow"/>, // Custom next arrow
    prevArrow: <PrevArrow className="carousel-arrow"/>, // Custom previous arrow
    ...settings,
  };

  return (
    <Box sx={{ width, height }} {...rest}>
      <Slider {...defaultSettings}>
        {images.map((image, index) => (
          <Box key={index} sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={image} 
              alt={`carousel-${index}`} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                objectPosition: 'center'
              }} 
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Carousel;
