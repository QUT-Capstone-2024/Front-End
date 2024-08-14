import React from 'react';
import { GalleryCard } from '../Components';
import imageUrl from '../Images/carousel_image_3.png';
import heroImageUrl from '../Images/house_demo_hero_image.png';

// REMOVE: for testing purposes only
import data from "../Test Data/sample_images.json";

const sortedImageData = data.images.sort((a, b) => {
  // Hero images first
  if (a.imageTag.includes('Hero') && !b.imageTag.includes('Hero')) return -1;
  if (!a.imageTag.includes('Hero') && b.imageTag.includes('Hero')) return 1;

  // Status order: pending, rejected, approved
  const statusOrder = ['pending', 'rejected', 'approved'];
  const statusA = statusOrder.indexOf(a.imageStatus);
  const statusB = statusOrder.indexOf(b.imageStatus);

  if (statusA < statusB) return -1;
  if (statusA > statusB) return 1;

  // Upload time order (oldest first)
  return new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime();
});

interface GalleryProps {}

const Gallery: React.FC<GalleryProps> = () => {
  const sortedImageData = data.images.sort((a, b) => {
    // Hero images first
    if (a.imageTag.includes('Hero') && !b.imageTag.includes('Hero')) return -1;
    if (!a.imageTag.includes('Hero') && b.imageTag.includes('Hero')) return 1;

    // Status order: pending, rejected, approved
    const statusOrder = ['pending', 'rejected', 'approved'];
    const statusA = statusOrder.indexOf(a.imageStatus);
    const statusB = statusOrder.indexOf(b.imageStatus);

    if (statusA < statusB) return -1;
    if (statusA > statusB) return 1;

    // Upload time order (oldest first)
    return new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime();
  });

  return (
    <div>
      {sortedImageData.map((imageData) => (
        <GalleryCard
          key={imageData.imageId}
          image={imageData.imageUrl}
          imageTag={imageData.imageTag}
          imageStatus={imageData.imageStatus as 'queued' | 'approved' | 'rejected'}
          cardType={imageData.imageTag.includes('Hero') ? 'hero' : 'gallery'}
          rejectionReason={imageData.rejectionReason}
        />
      ))}
    </div>
  );
};

export default Gallery;