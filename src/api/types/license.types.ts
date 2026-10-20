import type { UserDto } from './user.types';
import type { ProductDto, ProductPlanDto } from './product.types';
import type { Subscription } from './subscription.types';

export type LicenseStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'SUSPENDED';

export interface License {
  id: number;
  user?: UserDto;
  product: ProductDto;
  productPlan?: ProductPlanDto;
  subscription?: Subscription;
  licenseKey: string;
  status: LicenseStatus;
  activationLimit: number;
  activationCount: number;
  issuedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LicensePublicDto {
  licenseKey: string;
  productId?: number;
  productName?: string;
  productPlanId?: number;
  productPlanName?: string;
  status: LicenseStatus;
  activationLimit: number;
  activationCount: number;
  issuedAt?: string;
  expiresAt?: string;
}

export interface DeviceActivation {
  id: number;
  licenseId?: number;
  deviceIdentifier: string;
  deviceName?: string;
  operatingSystem?: string;
  applicationVersion?: string;
  activatedAt?: string;
  lastSeenAt?: string;
  active: boolean;
}
