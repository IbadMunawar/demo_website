'use client';

import { useState } from 'react';
import { getAllProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileCategoryBar from '@/components/MobileCategoryBar';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const allProducts = getAllProducts();

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === 'All'
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex">
        {/* Sidebar - Starts at top, extreme left */}
        <div className="hidden md:block w-64 flex-shrink-0 pl-4 lg:pl-8 pt-8">
          <Sidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Main Content Column - Everything flows here */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 pt-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Premium Tech Store
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover cutting-edge technology at unbeatable prices.
                <span className="font-semibold text-indigo-600 dark:text-indigo-400"> Negotiate directly</span> to get the best deal!
              </p>
            </div>

            {/* Mobile Category Bar */}
            <MobileCategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  No products found in this category.
                </p>
              </div>
            )}

            {/* Features Section */}
            <div className="mt-20 mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  AI-Powered Negotiation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Chat with our intelligent agent to negotiate the best price for you
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Instant Deals
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get real-time price adjustments and seal the deal in minutes
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Maximum Savings
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Save up to 30% on premium products through smart negotiation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


