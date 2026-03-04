'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { getProductById } from '@/data/products';
import Navbar from '@/components/Navbar';
import ChatWidget from '@/components/ChatWidget';
import CheckoutModal from '@/components/CheckoutModal';
import { useCartStore } from '@/store/cartStore';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const product = getProductById(productId);

    const [negotiatedPrice, setNegotiatedPrice] = useState<number | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showChat, setShowChat] = useState(false);

    // --- Internal Dispatch states ---
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
    const [isAwaitingNetwork, setIsAwaitingNetwork] = useState(false);

    const addToCart = useCartStore((state) => state.addToCart);

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Product Not Found
                    </h1>
                    <button
                        onClick={() => router.push('/')}
                        className="btn-primary"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const handleNegotiateClick = async () => {
        setIsAwaitingNetwork(true);
        try {
            const res = await fetch('/api/start-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id }),
            });
            if (!res.ok) throw new Error('Failed to start session');
            const data = await res.json();
            setSessionId(data.session_id);
            setShowChat(true);
        } finally {
            setIsAwaitingNetwork(false);
        }
    };

    const handleDealAccepted = (price: number) => {
        setNegotiatedPrice(price);
    };

    const handleClaimOffer = () => {
        if (negotiatedPrice) {
            const savings = product.displayed_price - negotiatedPrice;
            addToCart({
                productId: product.id,
                productName: product.title,
                negotiatedPrice,
                originalPrice: product.displayed_price,
                savings,
                quantity: 1,
                imageUrl: product.high_res_image_url,
            });
            setShowCheckout(true);
        }
    };

    const currentPrice = negotiatedPrice || product.displayed_price;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="relative h-[500px] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={product.high_res_image_url}
                            alt={product.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {product.title}
                            </h1>

                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Price Section */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl mb-8">
                                {negotiatedPrice ? (
                                    <>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Original Price
                                        </p>
                                        <p className="text-2xl text-gray-500 dark:text-gray-400 line-through mb-3">
                                            ${product.displayed_price}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-white font-semibold mb-2">
                                            Your Negotiated Price
                                        </p>
                                        <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                            ${negotiatedPrice}
                                        </p>
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                                            <Sparkles className="w-5 h-5" />
                                            <span>You save ${product.displayed_price - negotiatedPrice}!</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Asking Price
                                        </p>
                                        <p className="text-5xl font-bold text-gray-900 dark:text-white">
                                            ${product.displayed_price}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Features */}
                            <div className="space-y-3 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Key Features
                                </h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">✓</span>
                                        <span>Premium build quality</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">✓</span>
                                        <span>Latest technology</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">✓</span>
                                        <span>1-year warranty included</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">✓</span>
                                        <span>Free shipping & returns</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            {negotiatedPrice ? (
                                <button
                                    onClick={handleClaimOffer}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    Claim Offer & Checkout
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleNegotiateClick}
                                        disabled={isAwaitingNetwork}
                                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 animate-pulse"
                                    >
                                        <Sparkles className="w-6 h-6" />
                                        {isAwaitingNetwork ? 'Starting session…' : 'Negotiate a Better Price'}
                                    </button>

                                    <button
                                        onClick={() => {
                                            addToCart({
                                                productId: product.id,
                                                productName: product.title,
                                                negotiatedPrice: product.displayed_price,
                                                originalPrice: product.displayed_price,
                                                savings: 0,
                                                quantity: 1,
                                                imageUrl: product.high_res_image_url,
                                            });
                                            router.push('/cart');
                                        }}
                                        className="w-full py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Add to Cart
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Why Negotiate?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                💰 Save More
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Get personalized discounts based on your budget and our current inventory
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                🤖 AI-Assisted
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Our intelligent agent finds the best possible price for both parties
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                ⚡ Instant Results
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Quick negotiation process - get your deal in minutes, not days
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Chat Widget */}
            {(showChat || negotiatedPrice) && (
                <ChatWidget
                    productId={product.id}
                    productName={product.title}
                    displayedPrice={product.displayed_price}
                    onDealAccepted={handleDealAccepted}
                    sessionId={sessionId}
                    chatHistory={chatHistory}
                    setChatHistory={setChatHistory}
                    isAwaitingNetwork={isAwaitingNetwork}
                    setIsAwaitingNetwork={setIsAwaitingNetwork}
                />
            )}

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={showCheckout}
                onClose={() => setShowCheckout(false)}
                productName={product.title}
                originalPrice={product.displayed_price}
                negotiatedPrice={negotiatedPrice || product.displayed_price}
                savings={negotiatedPrice ? product.displayed_price - negotiatedPrice : 0}
            />
        </div>
    );
}
