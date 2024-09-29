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

export const updateImageStatus = async (
  collectionId: number,
  imageId: number,
  status: "APPROVED" | "REJECTED",
  rejectionReason: string,
  token: string
): Promise<void> => {
  // Use 'imageStatus' instead of 'status' in the request body
  const body = JSON.stringify(
    status === "REJECTED" && rejectionReason
      ? { imageStatus: status, rejectionReason } // Use 'imageStatus' and include rejectionReason if status is REJECTED
      : { imageStatus: status } // Just 'imageStatus' for APPROVED
  );

  console.log("Request body:", body);

  const response = await fetch(`${API_URL}/images/collections/${collectionId}/images/${imageId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: body,
  });

  if (response.ok) {
    console.log("Image status updated successfully.");
    try {
      const data = await response.json(); 
      console.log("Response data:", data);
    } catch (err) {
      console.log("No JSON response or error:", err);
    }
  } else {
    const errorText = await response.text(); // Get response text for debugging
    console.error(`Failed to update image status: ${errorText}`);
    throw new Error(`Failed to update image status: ${errorText}`);
  }
};


