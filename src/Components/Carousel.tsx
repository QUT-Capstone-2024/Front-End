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
    infinite: images.length > 1, // Only infinite if more than 1 image
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    nextArrow: <NextArrow />, 
    prevArrow: <PrevArrow />,
    arrows: images.length > 1, // Arrows only shown if more than 1 image
    ...settings,
  };

  return (
    <Box className='carousel-container' sx={{}} {...rest}>
      <Slider {...defaultSettings}>
        {images.map((image, index) => (
          <Box key={index} sx={{ height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={image} 
              alt={`carousel-${index}`} 
              style={{ 
                width: '100%', 
                height: 'auto', 
                objectFit: 'contain',
                objectPosition: 'center',
                maxHeight: height,
              }} 
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Carousel;
