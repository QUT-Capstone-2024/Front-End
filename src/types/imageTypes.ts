export interface Image {
  imageId: string; // unique identifier of the image
  imageUrl: string; // URL to the image stored in S3 or another storage service
  imageTag: string; // Tag like 'Hero' or other
  imageStatus: 'queued' | 'approved' | 'rejected'; // Status of the image
  rejectionReason?: string; // Optional rejection reason if the status is 'rejected'
  uploadTime: string; // ISO date string when the image was uploaded
  imageComments?: string; // Any comments or metadata related to the image
}
