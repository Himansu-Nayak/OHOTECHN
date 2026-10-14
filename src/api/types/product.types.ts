export interface ProductDto {
  id: number;
  name: string;
  slug?: string;
  description: string;
  price: number;
  providerCost?: number;
  resellerMargin?: number;
  providerId?: number;
  providerName?: string;
  integrationStatus?: string;
  deploymentType?: string;
  demoUrl?: string;
  documentationUrl?: string;
  featured?: boolean;
  licenseModel?: string;
  supportModel?: string;
  stock: number;
  imageUrl?: string;
  serviceType?: string;
  categoryId?: number;
  categoryName?: string;
  active: boolean;
}

export type BillingType = 'FREE_TRIAL' | 'MONTHLY' | 'YEARLY' | 'LIFETIME' | 'ONE_TIME' | 'ENTERPRISE';

export interface ProductPlanDto {
  id: number;
  productId: number;
  productName?: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billingType: BillingType;
  durationDays?: number;
  activationLimit?: number;
  trialDays?: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type Platform = 'WINDOWS' | 'MACOS' | 'LINUX' | 'ANDROID' | 'IOS' | 'WEB';

export interface SoftwareReleaseDto {
  id: number;
  productId: number;
  productName?: string;
  version: string;
  releaseNotes?: string;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  platform: Platform;
  active: boolean;
  releaseDate?: string;
  createdAt?: string;
}
