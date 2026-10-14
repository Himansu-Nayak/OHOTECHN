import type { UserDto } from './user.types';
import type { ProductDto, ProductPlanDto } from './product.types';
import type { Order } from './order.types';

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED';

export interface Subscription {
  id: number;
  user?: UserDto;
  product: ProductDto;
  productPlan?: ProductPlanDto;
  order?: Order;
  status: SubscriptionStatus;
  startDate?: string;
  expiryDate?: string;
  autoRenew: boolean;
  createdAt?: string;
  updatedAt?: string;
}
