import React from 'react';
import { GalleryCard } from '../Components';
import imageUrl from '../Images/carousel_image_3.png';
import heroImageUrl from '../Images/house_demo_hero_image.png';

interface GalleryProps {}

const Gallery: React.FC<GalleryProps> = () => {
  return (
    <div>
      <GalleryCard image={heroImageUrl} imageTag='' imageStatus='approved' cardType='hero' />
      <GalleryCard image={imageUrl} imageTag='' imageStatus='rejected' cardType='gallery' />
    </div>
  );
};

export default Gallery;