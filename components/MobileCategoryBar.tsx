'use client';

import { getUniqueCategories } from '@/data/products';

interface MobileCategoryBarProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function MobileCategoryBar({
    selectedCategory,
    onSelectCategory,
}: MobileCategoryBarProps) {
    const categories = getUniqueCategories();

    return (
        <div className="md:hidden mb-8 -mx-4 px-4">
            <div className="overflow-x-auto pb-2 scrollbar-hide">
                <div className="inline-flex gap-3">
                    {/* All Products Pill */}
                    <button
                        onClick={() => onSelectCategory('All')}
                        className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === 'All'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                            }`}
                    >
                        All Products
                    </button>

                    {/* Category Pills */}
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === category
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
