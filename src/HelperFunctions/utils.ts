import { Image } from "../types";

//////////////////////////////////////// SLUGS
export const createSlugFromAddress = (address: string) => {
  return address
    .toLowerCase()
    .replace(/ /g, '-')  // Replace spaces with dashes
    .replace(/[^\w-]+/g, '');  // Remove special characters
};


//////////////////////////////////////// IMAGES
// Helper function to get the most recent image for each tag
export const getMostRecentImagesByTag = (images: Image[]): Image[] => {
  const imageMap: { [tag: string]: Image } = {};

  images.forEach((image) => {
    const tag = image.imageTag;
    if (!imageMap[tag] || new Date(image.uploadTime).getTime() > new Date(imageMap[tag].uploadTime).getTime()) {
      imageMap[tag] = image;
    }
  });

  return Object.values(imageMap);
};

// Helper function to get the most recent photo update
export const getMostRecentPhoto = (images: Image[]): Image | null => {
  if (images.length === 0) return null;
  return images.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())[0];
};

// Helper function to get the most recent image needing attention (PENDING)
export const getMostRecentPendingImage = (images: Image[]): Image | null => {
  const pendingImages = images.filter(image => image.imageStatus === "PENDING");
  if (pendingImages.length === 0) return null;
  return pendingImages.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())[0];
};

// Helper function to get the hero image for a property
export const getHeroImage = (images: Array<any>) => {
  // Filter images with the tag "STREET"
  const frontImages = images.filter((image) => image.imageTag === 'STREET');

  // If there are no STREET images, return null
  if (frontImages.length === 0) return null;

  // Sort STREET images by upload time (most recent first)
  const latestFrontImage = frontImages.sort(
    (a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
  )[0];

  // Return the URL of the most recent STREET image
  return latestFrontImage.imageUrl;
};
