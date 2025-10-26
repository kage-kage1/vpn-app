'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AdvancedSearch } from '@/components/ui/SearchBar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const allProducts = [
  {
    id: 1,
    name: 'ExpressVPN',
    duration: '1 Month',
    price: '15,000',
    logo: '🛡️',
    features: ['Ultra-fast speeds', '94 countries', '24/7 support'],
    category: 'Premium',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'ExpressVPN',
    duration: '6 Months',
    price: '75,000',
    logo: '🛡️',
    features: ['Ultra-fast speeds', '94 countries', '24/7 support'],
    category: 'Premium',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'ExpressVPN',
    duration: '12 Months',
    price: '120,000',
    logo: '🛡️',
    features: ['Ultra-fast speeds', '94 countries', '24/7 support'],
    category: 'Premium',
    rating: 4.8,
  },
  {
    id: 4,
    name: 'NordVPN',
    duration: '1 Month',
    price: '12,000',
    logo: '🔒',
    features: ['Double VPN', '59 countries', 'CyberSec'],
    category: 'Premium',
    rating: 4.7,
  },
  {
    id: 5,
    name: 'NordVPN',
    duration: '6 Months',
    price: '45,000',
    logo: '🔒',
    features: ['Double VPN', '59 countries', 'CyberSec'],
    category: 'Premium',
    rating: 4.7,
  },
  {
    id: 6,
    name: 'NordVPN',
    duration: '12 Months',
    price: '80,000',
    logo: '🔒',
    features: ['Double VPN', '59 countries', 'CyberSec'],
    category: 'Premium',
    rating: 4.7,
  },
  {
    id: 7,
    name: 'Surfshark',
    duration: '1 Month',
    price: '10,000',
    logo: '🦈',
    features: ['Unlimited devices', '65 countries', 'CleanWeb'],
    category: 'Standard',
    rating: 4.6,
  },
  {
    id: 8,
    name: 'Surfshark',
    duration: '6 Months',
    price: '35,000',
    logo: '🦈',
    features: ['Unlimited devices', '65 countries', 'CleanWeb'],
    category: 'Standard',
    rating: 4.6,
  },
  {
    id: 9,
    name: 'Surfshark',
    duration: '12 Months',
    price: '60,000',
    logo: '🦈',
    features: ['Unlimited devices', '65 countries', 'CleanWeb'],
    category: 'Standard',
    rating: 4.6,
  },
];

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'All',
    priceRange: 'All',
    sortBy: 'name',
    rating: 0
  });
  


  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         product.duration.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         product.features.some(feature => 
                           feature.toLowerCase().includes(filters.searchTerm.toLowerCase())
                         );
    
    const matchesCategory = filters.category === 'All' || product.category === filters.category;
    
    const price = parseInt(product.price.replace(',', ''));
    const matchesPrice = filters.priceRange === 'All' ||
                        (filters.priceRange === 'Low' && price < 30000) ||
                        (filters.priceRange === 'Medium' && price >= 30000 && price < 80000) ||
                        (filters.priceRange === 'High' && price >= 80000);
    
    const matchesRating = filters.rating === 0 || product.rating >= filters.rating;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return parseInt(a.price.replace(',', '')) - parseInt(b.price.replace(',', ''));
      case 'price-high':
        return parseInt(b.price.replace(',', '')) - parseInt(a.price.replace(',', ''));
      case 'rating':
        return b.rating - a.rating;

      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-primary-dark pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-6">
              Premium <span className="text-neon-cyan">VPN Accounts</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Secure, fast, and reliable VPN accounts from top providers. 
              Get instant access to premium features at unbeatable prices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-primary-secondary/30">
        <div className="container mx-auto px-4">
          <AdvancedSearch
            searchValue={filters.searchTerm}
            onSearchChange={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
            filters={[
              {
                label: 'Category',
                value: filters.category,
                options: [
                  { label: 'All Categories', value: 'All' },
                  { label: 'Premium', value: 'Premium' },
                  { label: 'Standard', value: 'Standard' }
                ],
                onChange: (value) => setFilters(prev => ({ ...prev, category: value }))
              },
              {
                label: 'Price Range',
                value: filters.priceRange,
                options: [
                  { label: 'All Prices', value: 'All' },
                  { label: 'Under 30,000 Ks', value: 'Low' },
                  { label: '30,000 - 80,000 Ks', value: 'Medium' },
                  { label: 'Above 80,000 Ks', value: 'High' }
                ],
                onChange: (value) => setFilters(prev => ({ ...prev, priceRange: value }))
              },
              {
                label: 'Sort By',
                value: filters.sortBy,
                options: [
                  { label: 'Name', value: 'name' },
                  { label: 'Price: Low to High', value: 'price-low' },
                  { label: 'Price: High to Low', value: 'price-high' },
                  { label: 'Rating', value: 'rating' }
                ],
                onChange: (value) => setFilters(prev => ({ ...prev, sortBy: value }))
              }
            ]}
            placeholder="Search VPN or duration..."
            showResults={true}
            resultCount={filteredProducts.length}
            totalCount={allProducts.length}
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-primary-secondary rounded-xl p-6 border border-primary-accent hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/10"
              >
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{product.logo}</div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 mb-2">{product.duration}</p>
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="text-gray-400 ml-2 text-sm">({product.rating})</span>
                  </div>
                  <div className="text-3xl font-bold text-neon-cyan mb-4">
                    {product.price} <span className="text-lg text-gray-400">MMK</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300 text-sm">
                      <Check className="h-4 w-4 text-neon-cyan mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={`/payment/product/${product.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
                  >
                    Buy Now
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
      </div>
    </ErrorBoundary>
  );
}