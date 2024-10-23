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
export const getMostRecentImagesByTagAndInstance = (images: Image[]): Image[] => {
  const imageMap: { [key: string]: Image } = {};

  images.forEach((image) => {
    // Combine the tag and instanceNumber as a unique key
    const tagWithInstance = `${image.imageTag}-${image.instanceNumber || 0}`;
    
    // If no image exists for this tag-instance combo or the new image is more recent, update the map
    if (!imageMap[tagWithInstance] || new Date(image.uploadTime).getTime() > new Date(imageMap[tagWithInstance].uploadTime).getTime()) {
      imageMap[tagWithInstance] = image;
    }
  });

  const mostRecentImages = Object.values(imageMap);

  // Sorting function to ensure STREET is always first, then by tag and instance
  mostRecentImages.sort((a, b) => {
    // Always prioritize the STREET image first
    if (a.imageTag === 'STREET') return -1;
    if (b.imageTag === 'STREET') return 1;

    // Sort alphabetically by imageTag
    if (a.imageTag < b.imageTag) return -1;
    if (a.imageTag > b.imageTag) return 1;

    // If imageTags are the same, sort by instanceNumber
    const instanceA = a.instanceNumber || 0;
    const instanceB = b.instanceNumber || 0;
    return instanceA - instanceB;
  });

  return mostRecentImages;
};

// Helper function to get the most recent image for each tag
export const getMostRecentImagesByTagAndInstanceNotRejected = (images: Image[]): Image[] => {
  const imageMap: { [key: string]: Image } = {};

  const filteredImages = images.filter(image => image.imageStatus !== "REJECTED");


  filteredImages.forEach((image) => {
    // Combine the tag and instanceNumber as a unique key
    const tagWithInstance = `${image.imageTag}-${image.instanceNumber || 0}`;
    
    // If no image exists for this tag-instance combo or the new image is more recent, update the map
    if (!imageMap[tagWithInstance] || new Date(image.uploadTime).getTime() > new Date(imageMap[tagWithInstance].uploadTime).getTime()) {
      imageMap[tagWithInstance] = image;
    }
  });

  const mostRecentImages = Object.values(imageMap);

  // Sorting function to ensure STREET is always first, then by tag and instance
  mostRecentImages.sort((a, b) => {
    // Always prioritize the STREET image first
    if (a.imageTag === 'STREET') return -1;
    if (b.imageTag === 'STREET') return 1;

    // Sort alphabetically by imageTag
    if (a.imageTag < b.imageTag) return -1;
    if (a.imageTag > b.imageTag) return 1;

    // If imageTags are the same, sort by instanceNumber
    const instanceA = a.instanceNumber || 0;
    const instanceB = b.instanceNumber || 0;
    return instanceA - instanceB;
  });

  return mostRecentImages;
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
