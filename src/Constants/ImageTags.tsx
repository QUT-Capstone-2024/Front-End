// The list of image tags that can be used to tag images. This must be the same as the BE.

export const ImageTags = [
    { name: "BATHROOM", displayName: "Bathroom", key: 1 },
    { name: "BEDROOM", displayName: "Bedroom", key: 2 },
    { name: "DINNING_ROOM", displayName: "Dining Room", key: 3 },
    { name: "KITCHEN", displayName: "Kitchen", key: 4 },
    { name: "LIVING_ROOM", displayName: "Living Room", key: 5 },
    { name: "STREET", displayName: "Front View", key: 6 }
];

export const generateImageTags = (propertyDetails: any) => {
    const tags = [];
    const bathrooms = propertyDetails.bathrooms || 0;
    const bedrooms = propertyDetails.bedrooms || 0;
    
    for (let i = 1; i <= bathrooms; i++) {
      tags.push({ 
        name: "BATHROOM", 
        displayName: `Bathroom ${i}`, 
        key: `BATHROOM-${i}`, 
        instanceNumber: i
      });
    }
    
    for (let i = 1; i <= bedrooms; i++) {
      tags.push({ 
        name: "BEDROOM", 
        displayName: `Bedroom ${i}`, 
        key: `BEDROOM-${i}`, 
        instanceNumber: i
      });
    }
    
    // Static tags that don't have multiple instances
    tags.push({ name: "DINNING_ROOM", displayName: "Dining Room", key: "DINNING_ROOM" });
    tags.push({ name: "KITCHEN", displayName: "Kitchen", key: "KITCHEN" });
    tags.push({ name: "LIVING_ROOM", displayName: "Living Room", key: "LIVING_ROOM" });
    tags.push({ name: "STREET", displayName: "Front View", key: "STREET" });
    return tags;
  };

  