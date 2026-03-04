// Product type definition
export interface Product {
  id: string;
  title: string;
  description: string;
  high_res_image_url: string;
  displayed_price: number;
  mam: number; // Minimum Acceptable Margin (Secret - not exposed to frontend)
  category: string; // Product category for filtering
}

// Mock database of products
export const products: Product[] = [
  {
    id: 'smartphone-001',
    title: 'Premium Smartphone Pro',
    description: 'Experience cutting-edge technology with our flagship smartphone. Features include a 6.7" OLED display, triple camera system with 108MP main sensor, 5G connectivity, and all-day battery life. Perfect for professionals and tech enthusiasts alike.',
    high_res_image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    displayed_price: 899,
    mam: 650, // Secret: Minimum acceptable price
    category: 'Phones',
  },
  {
    id: 'laptop-001',
    title: 'Ultra-Thin Laptop Elite',
    description: 'Power meets portability in this premium ultrabook. Equipped with the latest processor, 16GB RAM, 512GB SSD, and a stunning 14" 4K display. Weighing just 2.8 lbs, it\'s the perfect companion for work and play.',
    high_res_image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    displayed_price: 1299,
    mam: 950, // Secret: Minimum acceptable price
    category: 'Laptops',
  },
  {
    id: 'headphones-001',
    title: 'Wireless Noise-Cancelling Headphones',
    description: 'Immerse yourself in pure audio bliss. Industry-leading active noise cancellation, 30-hour battery life, premium comfort padding, and crystal-clear sound quality. Experience music the way it was meant to be heard.',
    high_res_image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    displayed_price: 349,
    mam: 220, // Secret: Minimum acceptable price
    category: 'Audio',
  },
  {
    id: 'smartwatch-001',
    title: 'Advanced Fitness Smartwatch',
    description: 'Your personal health companion on your wrist. Track your fitness goals, monitor heart rate, receive notifications, and enjoy up to 7 days of battery life. Water-resistant and stylish design suitable for any occasion.',
    high_res_image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    displayed_price: 279,
    mam: 180, // Secret: Minimum acceptable price
    category: 'Wearables',
  },
];

// Helper function to get product by ID
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

// Helper function to get all products
export function getAllProducts(): Product[] {
  return products;
}

// Helper function to get unique categories
export function getUniqueCategories(): string[] {
  const categories = products.map((product) => product.category);
  return Array.from(new Set(categories)).sort();
}
