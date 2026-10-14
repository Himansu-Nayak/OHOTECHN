export type DeploymentStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'CONFIGURING'
  | 'TESTING'
  | 'READY'
  | 'LIVE'
  | 'SUSPENDED'
  | 'CANCELLED';

export interface DeploymentDto {
  id: number;
  orderId?: number;
  productId: number;
  productName?: string;
  providerId?: number;
  providerName?: string;
  userId: number;
  userEmail?: string;
  userName?: string;
  licenseId?: number;
  licenseKey?: string;
  status: DeploymentStatus;
  targetEnvironment?: string;
  accessUrl?: string;
  assignedEngineer?: string;
  adminNotes?: string;
  customerNotes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}
