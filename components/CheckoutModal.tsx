'use client';

import { X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    originalPrice: number;
    negotiatedPrice: number;
    savings: number;
}

export default function CheckoutModal({
    isOpen,
    onClose,
    productName,
    originalPrice,
    negotiatedPrice,
    savings,
}: CheckoutModalProps) {
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handlePayment = async () => {
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setPaymentComplete(true);
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[slideUp_0.3s_ease-out]">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        {paymentComplete ? 'Order Confirmed!' : 'Checkout'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {!paymentComplete ? (
                    <>
                        {/* Order Summary */}
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Order Summary
                                </h3>

                                <div className="space-y-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-700 dark:text-gray-300">Product:</span>
                                        <span className="font-medium text-gray-900 dark:text-white text-right max-w-[60%]">
                                            {productName}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700 dark:text-gray-300">Original Price:</span>
                                        <span className="text-gray-500 dark:text-gray-400 line-through">
                                            ${originalPrice}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-900 dark:text-white font-semibold">
                                            Negotiated Price:
                                        </span>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            ${negotiatedPrice}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg -mx-2">
                                        <span className="text-green-700 dark:text-green-400 font-medium">
                                            Your Savings:
                                        </span>
                                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                            ${savings}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                                    Payment Details
                                </h4>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        defaultValue="4242 4242 4242 4242"
                                    />
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            defaultValue="12/25"
                                        />
                                        <input
                                            type="text"
                                            placeholder="CVC"
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            defaultValue="123"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : 'Pay Now'}
                            </button>
                        </div>
                    </>
                ) : (
                    // Success State
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Payment Successful!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Your order has been confirmed. Thank you for shopping with us!
                        </p>
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg mb-6">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                You saved <span className="font-bold text-green-600 dark:text-green-400">${savings}</span> on this purchase!
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
