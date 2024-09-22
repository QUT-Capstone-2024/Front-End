import { API_URL } from '../config/config';
import { Collection, UpdateCollectionPayload } from '../types';


// Fetch a collection by ID
export const getCollectionById = async (id: number, token: string): Promise<Collection> => {
  const response = await fetch(`${API_URL}/collections/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch collection');
  }

  const data = await response.json();
  return data;
};


// Fetch all collections for the current user
export const getUserCollections = async (userId: number, token: string): Promise<Collection[]> => {
  const response = await fetch(`${API_URL}/collections/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('Response:', response.status);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User has no collections (404)'); 
    }
    throw new Error(`Failed to fetch collections: ${response.status}`);
  }

  const data = await response.json();
  return data;
};


// Fetch all collections for all users (ADMIN ONLY)
export const getAllCollections = async (token: string): Promise<Collection[]> => {
  const response = await fetch(`${API_URL}/collections/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch collections');
  }

  const data = await response.json();
  return data;
};


// Create a new collection
export const createCollection = async (collection: Collection): Promise<Collection> => {
  const response = await fetch(`${API_URL}/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(collection),
  });

  if (!response.ok) {
    throw new Error('Failed to create collection');
  }

  const data = await response.json();
  return data;
};


// Update a collection by ID
export const updateCollection = async (id: number, updatedCollection: UpdateCollectionPayload, token: string): Promise<Collection> => {
  const response = await fetch(`${API_URL}/collections/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // Include the token in the request headers
    },
    body: JSON.stringify(updatedCollection),
  });

  if (!response.ok) {
    throw new Error('Failed to update collection');
  }

  const data = await response.json();
  return data;
};


// Approve a collection
export const approveImageInCollection = async (collectionId: number, imageId: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/images/collections/${collectionId}/images/${imageId}/approve`, {
    method: 'PUT',  
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to approve image');
  }
};


// Delete a collection by ID (ADMIN ONLY)
export const deleteCollection = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/collections/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete collection');
  }
};

// Fetch collections by address (search query)
export const searchCollectionsByAddress = async (address: string, token: string): Promise<Collection[]> => {
  const response = await fetch(`${API_URL}/collections/search?address=${encodeURIComponent(address)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }

  const data = await response.json();
  return data;
};

