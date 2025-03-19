import React, { useEffect, useState } from 'react';
import { Search, Filter, RefreshCw, Loader } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: { search: searchQuery },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncWithShopify = async () => {
    try {
      setSyncing(true);
      const response = await axios.post(`${API_BASE_URL}/products/sync`);
      console.log("Sync response:", response.data);
      await fetchProducts(); // Refresh product list after sync
    } catch (error) {
      console.error("Error syncing with Shopify:", error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Product ({products.length})</h1>
          <p className="text-sm text-gray-500">This is a view-only section. To manage products, use the Shopify panel.</p>
        </div>
        <button
          onClick={syncWithShopify}
          className={`flex items-center px-4 py-2 rounded-lg text-white transition-all ${syncing ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={syncing}
        >
          {syncing ? <Loader className="h-5 w-5 mr-2 animate-spin" /> : <RefreshCw className="h-5 w-5 mr-2" />}
          {syncing ? "Syncing..." : "Sync Again with Shopify"}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.shopifyId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 flex items-center space-x-4">
                      <Link to={`/product/${product.shopifyId}`}>
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.images.length > 0 ? product.images[0].src : "https://source.unsplash.com/100x100/?product"}
                          alt="Product"
                        />
                      </Link>
                      <Link to={`/product/${product.shopifyId}`}>
                        <span className="text-sm font-medium text-blue-600">{product.title}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.variants[0]?.sku || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">${product.variants[0]?.price || "0.00"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.variants[0]?.inventory_quantity ?? "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;