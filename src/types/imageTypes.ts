export interface Image {
  id: number;
  imageUrl: string;
  imageTag: string; 
  imageStatus: "UNTAGGED" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
  rejectionReason?: string;
  uploadTime: string;
  imageComments?: string;
  instanceNumber?: number;
}
