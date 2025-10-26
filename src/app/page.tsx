'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Star, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

const vpnProducts = [
  {
    id: 1,
    name: 'ExpressVPN',
    duration: '1 Month',
    price: '15,000',
    logo: '🛡️',
    features: ['Ultra-fast speeds', '94 countries', '24/7 support'],
    popular: false,
  },
  {
    id: 2,
    name: 'NordVPN',
    duration: '6 Months',
    price: '45,000',
    logo: '🔒',
    features: ['Double VPN', '59 countries', 'CyberSec'],
    popular: true,
  },
  {
    id: 3,
    name: 'Surfshark',
    duration: '12 Months',
    price: '80,000',
    logo: '🦈',
    features: ['Unlimited devices', '65 countries', 'CleanWeb'],
    popular: false,
  },
];

const testimonials = [
  {
    name: 'Aung Kyaw',
    rating: 5,
    comment: 'Fast delivery and working perfectly! Highly recommended.',
  },
  {
    name: 'Thida Win',
    rating: 5,
    comment: 'Great service, got my VPN key within minutes.',
  },
  {
    name: 'Min Khant',
    rating: 5,
    comment: 'Affordable prices and excellent customer support.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-primary-dark text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
              Secure Your Internet with{' '}
              <span className="text-neon-cyan">Kage VPN Store</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Buy ExpressVPN, NordVPN, and more — fast, safe, and local.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-4 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20">
        <motion.div
          animate={{ x: [-1000, 1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap"
        >
          <span className="text-lg font-semibold text-neon-cyan">
            🔥 Buy 1 Year Plan – Get 1 Month Free 🔥 Limited Time Offer! 🔥 Buy 1 Year Plan – Get 1 Month Free 🔥
          </span>
        </motion.div>
      </section>

      {/* VPN Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Premium VPN Plans
            </h2>
            <p className="text-gray-300 text-lg">
              Choose from our selection of premium VPN services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vpnProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative bg-primary-secondary rounded-xl p-6 border ${
                  product.popular 
                    ? 'border-neon-cyan shadow-lg shadow-neon-cyan/25' 
                    : 'border-gray-700 hover:border-neon-cyan/50'
                } transition-all duration-300`}
              >
                {product.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{product.logo}</div>
                  <h3 className="text-2xl font-orbitron font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-300">{product.duration}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-neon-cyan">{product.price}</span>
                  <span className="text-gray-300 ml-1">Ks</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <Check className="h-5 w-5 text-neon-cyan mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
                >
                  Buy Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-dark rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.comment}"</p>
                <p className="font-semibold text-neon-cyan">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark border-t border-primary-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-orbitron font-bold text-neon-cyan mb-4">
                Kage VPN Store
              </h3>
              <p className="text-gray-300">
                Your trusted source for premium VPN services in Myanmar.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/products" className="hover:text-neon-cyan transition-colors">Products</Link></li>
                <li><Link href="/orders" className="hover:text-neon-cyan transition-colors">Orders</Link></li>
                <li><Link href="/contact" className="hover:text-neon-cyan transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/privacy" className="hover:text-neon-cyan transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-neon-cyan transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-300">
                <p>📱 Telegram: @kagevpn</p>
                <p>📧 Email: info@kagevpn.com</p>
                <p>📘 Facebook: Kage VPN Store</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-secondary mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Kage VPN Store. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button className="bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark p-4 rounded-full shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652L4.086 24l4.772-2.498C10.125 21.852 11.055 22 12 22c6.626 0 12-4.975 12-11.111C24 4.975 18.626 0 12 0z"/>
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
