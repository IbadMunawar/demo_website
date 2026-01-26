import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    productId: string;
    productName: string;
    negotiatedPrice: number;
    originalPrice: number;
    savings: number;
}

interface CartStore {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalSavings: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (item) => {
                set((state) => {
                    // Remove existing item if present (update it)
                    const filtered = state.cart.filter((i) => i.productId !== item.productId);
                    return { cart: [...filtered, item] };
                });
            },

            removeFromCart: (productId) => {
                set((state) => ({
                    cart: state.cart.filter((item) => item.productId !== productId),
                }));
            },

            clearCart: () => {
                set({ cart: [] });
            },

            getTotalPrice: () => {
                return get().cart.reduce((total, item) => total + item.negotiatedPrice, 0);
            },

            getTotalSavings: () => {
                return get().cart.reduce((total, item) => total + item.savings, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
