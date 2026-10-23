import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bigboss_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync with Firestore if authenticated
  useEffect(() => {
    if (!currentUser) return;

    const syncUserCart = async () => {
      try {
        const cartRef = doc(db, 'carts', currentUser.uid);
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
          const cloudData = cartSnap.data();
          const cloudItems = (cloudData?.items as CartItem[]) || [];

          // Merge local and cloud items if any
          if (items.length > 0) {
            const mergedMap = new Map<string, CartItem>();
            for (const item of cloudItems) {
              mergedMap.set(item.productId, item);
            }
            for (const item of items) {
              if (mergedMap.has(item.productId)) {
                const existing = mergedMap.get(item.productId)!;
                const newQty = Math.min(existing.quantity + item.quantity, existing.stockQuantity);
                mergedMap.set(item.productId, { ...existing, quantity: newQty });
              } else {
                mergedMap.set(item.productId, item);
              }
            }
            const merged = Array.from(mergedMap.values());
            setItems(merged);
            await setDoc(cartRef, {
              userId: currentUser.uid,
              items: merged,
              updatedAt: new Date().toISOString(),
            });
          } else {
            setItems(cloudItems);
          }
        } else if (items.length > 0) {
          // Push initial local items to Firestore
          await setDoc(cartRef, {
            userId: currentUser.uid,
            items,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('Could not sync cart to Firestore:', err);
      }
    };

    syncUserCart();
  }, [currentUser?.uid]);

  // Persist items locally and push to Firestore
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch {}

    if (currentUser) {
      const timeoutId = setTimeout(async () => {
        try {
          await setDoc(
            doc(db, 'carts', currentUser.uid),
            {
              userId: currentUser.uid,
              items,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Failed auto-syncing cart:', err);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [items, currentUser]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.inStock || product.stockQuantity <= 0) {
      alert(`We apologize, "${product.name}" is currently out of stock.`);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      const effectivePrice = product.salePrice ?? product.price;

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stockQuantity);
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: newQty, stockQuantity: product.stockQuantity, price: effectivePrice }
            : i
        );
      } else {
        const initialQty = Math.min(quantity, product.stockQuantity);
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            modelNumber: product.modelNumber,
            collectionId: product.collectionId,
            price: effectivePrice,
            image: product.images[0] || '',
            quantity: initialQty,
            stockQuantity: product.stockQuantity,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const clamped = Math.min(quantity, item.stockQuantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 0; // Complimentary Insured Luxury Delivery
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        shippingFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
