import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

const Home = () => {
  // Sample product data
  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Dog Food',
      category: 'Dog Food',
      rating: 4.8,
      price: 49.99,
      image: '/api/placeholder/200/200',
    },
    {
      id: 2,
      name: 'Cat Scratching Post',
      category: 'Cat Accessories',
      rating: 4.6,
      price: 29.99,
      image: '/api/placeholder/200/200',
    },
    {
      id: 3,
      name: 'Interactive Dog Toy',
      category: 'Dog Toys',
      rating: 4.7,
      price: 19.99,
      image: '/api/placeholder/200/200',
    },
    {
      id: 4,
      name: 'Calming Cat Bed',
      category: 'Cat Accessories',
      rating: 4.9,
      price: 39.99,
      image: '/api/placeholder/200/200',
    }
  ];

  // Product card component for consistent design
  const ProductCard = ({ product }) => (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="text-lg font-medium text-gray-900">
          {product.name}
        </h3>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-semibold text-blue-600">${product.price}</span>
          <button className="text-sm text-blue-600 font-medium hover:text-blue-800">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Banner Section */}
      <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
        <img 
          src="/api/placeholder/1200/400" 
          alt="Pet Care Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex items-center">
          <div className="p-8 md:p-12 max-w-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Quality Pet Care Products
            </h1>
            <p className="text-white/90 mb-6">
              Discover our premium selection of pet food, toys, and accessories for your furry companions
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              Shop Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Featured Products</h2>
          <button className="flex items-center text-blue-600 hover:text-blue-800">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Best Selling Products Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Best Sellers</h2>
          <button className="flex items-center text-blue-600 hover:text-blue-800">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice().reverse().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;