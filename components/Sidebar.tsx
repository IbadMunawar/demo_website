'use client';

import { getUniqueCategories } from '@/data/products';

interface SidebarProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
    const categories = getUniqueCategories();

    return (
        <aside className="sticky top-20 h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Categories
                </h2>

                <nav className="space-y-2">
                    {/* All Products Option */}
                    <button
                        onClick={() => onSelectCategory('All')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${selectedCategory === 'All'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium">All Products</span>
                            {selectedCategory === 'All' && (
                                <span className="text-sm opacity-90">✓</span>
                            )}
                        </div>
                    </button>

                    {/* Category Options */}
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${selectedCategory === category
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{category}</span>
                                {selectedCategory === category && (
                                    <span className="text-sm opacity-90">✓</span>
                                )}
                            </div>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
