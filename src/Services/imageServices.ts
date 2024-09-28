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

export const archiveImageFromCollection = async (collectionId: number, imageId: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/images/collections/${collectionId}/images/${imageId}/archive`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to remove image');
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

// Mock code to try test ways to update statuses for Image Approval Page
export const updateImageStatus = async (
  imageId: number,
  action: "APPROVED" | "REJECTED",
  comment: string,
  token: string
) => {
  try {
    const response = await fetch(`${API_URL}/images/${imageId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: action,
        comment,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update image status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

