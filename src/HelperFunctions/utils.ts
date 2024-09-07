export const createSlugFromAddress = (address: string) => {
  return address
    .toLowerCase()
    .replace(/ /g, '-')  // Replace spaces with dashes
    .replace(/[^\w-]+/g, '');  // Remove special characters
};
