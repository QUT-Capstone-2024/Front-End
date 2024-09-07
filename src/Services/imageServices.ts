import { API_URL } from '../config/config';
import { Image } from '../types';


export const getImagesByCollectionId = async (collectionId: number, token: string): Promise<Image[]> => {
  const response = await fetch(`${API_URL}/images/collections/${collectionId}/images`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch images for the collection');
  }

  const data = await response.json();
  return data;
};


export const uploadImage = async (
  file: File,
  tag: string,
  description: string,
  userId: string,
  collectionId: string,
  token: string
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tag', tag);
  formData.append('description', description);
  formData.append('userId', userId);
  formData.append('collectionId', collectionId);

  const response = await fetch('http://localhost:8080/api/images/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,  // Assuming you are using Bearer token auth
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error uploading image: ${response.statusText}`);
  }

  return response.json();
};






export const updateImageMetadata = async (collectionId: number, imageId: number, updateData: any, token: string) => {
  try {
    const response = await fetch(`http://localhost:8080/api/images/collections/${collectionId}/images/${imageId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update image metadata: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating image metadata:', error);
    throw error;
  }
};
