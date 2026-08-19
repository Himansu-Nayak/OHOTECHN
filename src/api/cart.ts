import { apiClient } from './client';
import { ApiResponse, Cart } from './types';

export async function getCartApi(): Promise<ApiResponse<Cart>> {
  return apiClient<Cart>('/api/cart', {
    method: 'GET',
  });
}

export async function addToCartApi(productId: number, quantity = 1): Promise<ApiResponse<Cart>> {
  return apiClient<Cart>('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItemQuantityApi(itemId: number, quantity: number): Promise<ApiResponse<Cart>> {
  return apiClient<Cart>(`/api/cart/items/${itemId}?quantity=${quantity}`, {
    method: 'PUT',
  });
}

export async function removeFromCartApi(itemId: number): Promise<ApiResponse<Cart>> {
  return apiClient<Cart>(`/api/cart/items/${itemId}`, {
    method: 'DELETE',
  });
}

export async function clearCartApi(): Promise<ApiResponse<string>> {
  return apiClient<string>('/api/cart', {
    method: 'DELETE',
  });
}
