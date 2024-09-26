// Define the possible approval statuses
export enum ApprovalStatus {
  QUEUED = 'queued',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// The main Collection interface based on the backend model
export interface Collection {
  address: string;
  status: string;
  id: number;
  propertyAddress: string;
  propertyDescription: string;
  imageUrls: string[];
  collectionId: number;
  propertySize: number;
  propertyOwnerId: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces?: number;
  approvalStatus: ApprovalStatus;
  propertyType: string;
}

// The payload for updating an existing collection
export interface UpdateCollectionPayload {
  user?: {
    id: number;
  };
  propertyAddress?: string;
  propertyDescription?: string;
  imageUrls?: string[];
  collectionId?: string | number;
  propertySize?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  approvalStatus?: ApprovalStatus;
  propertyType?: string;
}

// The payload for creating a new collection
export interface CreateCollectionPayload {
  propertyAddress: string;
  propertyDescription: string;
  imageUrls: string[];
  collectionId: string;
  propertySize: number;
  propertyOwnerId: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces?: number;
  approvalStatus: ApprovalStatus;
  propertyType: string;
}

// Response from the API when fetching a single collection
export interface CollectionResponse {
  collection: Collection;
}

// Response from the API when fetching multiple collections
export interface CollectionsResponse {
  collections: Collection[];
}

// Example of a general API error response structure
export interface ApiError {
  message: string;
  statusCode: number;
}
