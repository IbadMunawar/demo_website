'use client';

import { useCartStore } from '@/store/cartStore';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalSavings, getOriginalTotal } = useCartStore();

    const originalTotal = getOriginalTotal();
    const bargainedTotal = getTotalPrice();
    const totalSavings = getTotalSavings();

    const handleQuantityChange = (productId: string, delta: number) => {
        const item = cart.find((i) => i.productId === productId);
        if (item) {
            updateQuantity(productId, item.quantity + delta);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                {cart.length === 0 ? (
                    // Empty Cart State
                    <div className="text-center py-16">
                        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Start shopping to add items to your cart
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    // Cart Content
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Cart Items (2/3 width) */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                                {/* Table Header - Hidden on mobile */}
                                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-300">
                                    <div className="col-span-5">Product</div>
                                    <div className="col-span-2 text-center">Original Price</div>
                                    <div className="col-span-2 text-center">Bargained Price</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-1 text-center">Remove</div>
                                </div>

                                {/* Cart Items */}
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {cart.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6"
                                        >
                                            {/* Product Info */}
                                            <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.productName}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {item.productName}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        ID: {item.productId}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Original Price */}
                                            <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-center">
                                                <div>
                                                    <span className="md:hidden text-sm text-gray-600 dark:text-gray-400 mr-2">
                                                        Original:
                                                    </span>
                                                    <span className="text-gray-400 dark:text-gray-500 line-through">
                                                        ${item.originalPrice}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Bargained Price */}
                                            <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-center">
                                                <div>
                                                    <span className="md:hidden text-sm text-gray-600 dark:text-gray-400 mr-2">
                                                        Bargained:
                                                    </span>
                                                    <span className="text-emerald-600 dark:text-emerald-500 font-semibold">
                                                        ${item.negotiatedPrice}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-center">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, -1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, 1)}
                                                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <div className="col-span-1 md:col-span-1 flex items-center justify-start md:justify-center">
                                                <button
                                                    onClick={() => removeFromCart(item.productId)}
                                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary (1/3 width) */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4">
                                    {/* Original Total */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Original Total</span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            ${originalTotal.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Bargained Total */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Bargained Total</span>
                                        <span className="text-emerald-600 dark:text-emerald-500 font-semibold">
                                            ${bargainedTotal.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Total Savings */}
                                    <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/20 -mx-6 px-6 py-3">
                                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                                            Total Savings
                                        </span>
                                        <span className="text-emerald-600 dark:text-emerald-500 font-bold">
                                            ${totalSavings.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Total to Pay
                                            </span>
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                ${bargainedTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="mt-6 space-y-3">
                                    <button className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                                        Proceed to Checkout
                                    </button>
                                    <Link
                                        href="/"
                                        className="block w-full text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
