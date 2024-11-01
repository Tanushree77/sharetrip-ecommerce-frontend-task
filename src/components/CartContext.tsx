import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types/Product';

// Define the context type
interface CartContextType {
  cart: Record<number, number>;
  cartOpen: boolean;
  activeTab: 'current' | 'history';
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  setCartOpen: (open: boolean) => void;
  setActiveTab: (tab: 'current' | 'history') => void;
  calculateTotal: (products: Product[]) => number;
}

// Create the CartContext with default value as undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider props type
interface CartProviderProps {
  children: ReactNode;
}

// CartProvider component
export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  // Function to add item to cart
  const addToCart = (productId: number) => {
    setCart(prevCart => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1
    }));
  };

  // Function to remove item from cart
  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  

  // Function to calculate the total cost
  const calculateTotal = (products: Product[]) => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === parseInt(productId));
      return total + (product?.price || 0) * quantity;
    }, 0);
  };

  const value: CartContextType = {
    cart,
    cartOpen,
    activeTab,
    addToCart,
    removeFromCart,
    setCartOpen,
    setActiveTab,
    calculateTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the CartContext
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}