import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    productId: string;
    productName: string;
    negotiatedPrice: number;
    originalPrice: number;
    savings: number;
    quantity: number;
    imageUrl: string;
}

interface CartStore {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalSavings: () => number;
    getOriginalTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (item) => {
                set((state) => {
                    // Check if item already exists
                    const existingItem = state.cart.find((i) => i.productId === item.productId);

                    if (existingItem) {
                        // Update quantity if item exists
                        return {
                            cart: state.cart.map((i) =>
                                i.productId === item.productId
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    } else {
                        // Add new item
                        return { cart: [...state.cart, item] };
                    }
                });
            },

            removeFromCart: (productId) => {
                set((state) => ({
                    cart: state.cart.filter((item) => item.productId !== productId),
                }));
            },

            updateQuantity: (productId, quantity) => {
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.productId === productId
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
                    ),
                }));
            },

            clearCart: () => {
                set({ cart: [] });
            },

            getTotalPrice: () => {
                return get().cart.reduce((total, item) => total + (item.negotiatedPrice * item.quantity), 0);
            },

            getTotalSavings: () => {
                return get().cart.reduce((total, item) => total + (item.savings * item.quantity), 0);
            },

            getOriginalTotal: () => {
                return get().cart.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
