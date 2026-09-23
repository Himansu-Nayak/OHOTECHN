'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart } from '../api/types';
import { getCartApi, addToCartApi, updateCartItemQuantityApi, removeFromCartApi, clearCartApi } from '../api/cart';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  totalAmount: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number, productPlanId?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartItemWithPlan = Cart['items'][number] & {
  productPlan?: { price?: number | string; name?: string; currency?: string };
};

function normalizeCart(rawCart: Cart): Cart {
  const items = (rawCart.items || []).map((rawItem) => {
    const item = rawItem as CartItemWithPlan;
    const planPrice = Number(item.productPlan?.price);
    const productPrice = Number(item.product?.price);
    const existingPrice = Number((item as any).price);
    const effectivePrice = Number.isFinite(planPrice) && planPrice > 0
      ? planPrice
      : Number.isFinite(existingPrice) && existingPrice > 0
        ? existingPrice
        : Number.isFinite(productPrice) && productPrice > 0
          ? productPrice
          : 0;

    return {
      ...item,
      price: effectivePrice,
    } as Cart['items'][number];
  });

  const totalAmount = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return {
    ...rawCart,
    items,
    totalAmount,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }

    setLoading(true);
    try {
      const res = await getCartApi();
      if (res.success && res.data) {
        setCart(normalizeCart(res.data));
      }
    } catch (err: any) {
      console.warn('Failed to load cart from backend:', err?.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number, quantity = 1, productPlanId?: number) => {
    if (!user) {
      showToast('Please login to add items to your cart.', 'info');
      return;
    }

    setLoading(true);
    try {
      const res = await addToCartApi(productId, quantity, productPlanId);
      if (res.success && res.data) {
        setCart(normalizeCart(res.data));
        showToast('Item added to cart successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add item to cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!user) return;
    if (quantity < 1) {
      return removeItem(itemId);
    }

    setLoading(true);
    try {
      const res = await updateCartItemQuantityApi(itemId, quantity);
      if (res.success && res.data) {
        setCart(normalizeCart(res.data));
        showToast('Cart updated.', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update item quantity', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await removeFromCartApi(itemId);
      if (res.success && res.data) {
        setCart(normalizeCart(res.data));
        showToast('Item removed from cart.', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to remove item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await clearCartApi();
      setCart(null);
      showToast('Cart cleared.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to clear cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalAmount = cart?.totalAmount || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        totalAmount,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
