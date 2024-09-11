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
  userId: number,
  collectionId: number,
  tag: string,
  description: string,
  instanceNumber: number,
  token: string
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId.toString());
  formData.append('collectionId', collectionId.toString());
  formData.append('tag', tag);
  formData.append('description', description);
  formData.append('instanceNumber', instanceNumber.toString());

  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  
  const response = await fetch(`${API_URL}/images/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
};


export const removeImageFromCollection = async (collectionId: number, imageId: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/images/collections/${collectionId}/images/${imageId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to remove image');
  }
};
