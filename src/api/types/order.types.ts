import type { ProductDto, ProductPlanDto } from './product.types';
import type { UserDto } from './user.types';
import type { Payment } from './payment.types';

export interface CartItem {
  id: number;
  product: ProductDto;
  productPlan?: ProductPlanDto;
  quantity: number;
  price: number;
  itemTotal?: number;
}

export interface Cart {
  id: number;
  user?: UserDto;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface OrderItem {
  id: number;
  product: ProductDto;
  quantity: number;
  price: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: number;
  user?: UserDto;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  contactPhone: string;
  createdAt: string;
  payments?: Payment[];
}
