import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart2,
  Server,
  Activity,
  Package,
  AlertTriangle,
  Clock,
  RefreshCw
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-indigo-600" size={48} />
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center">
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <BarChart2 className="mr-3 text-indigo-600" size={36} />
            Dashboard
          </h1>
          <div className="flex items-center text-gray-600">
            <Clock className="mr-2" size={18} />
            <span>Last Sync: {stats.lastSync ? new Date(stats.lastSync).toLocaleString() : "Never Synced"}</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Server className="text-blue-500" />}
            title="Subcategories"
            value={stats.totalSubcategories}
          />
          <StatCard
            icon={<Package className="text-green-500" />}
            title="Breeds"
            value={stats.totalBreeds}
          />
          <StatCard
            icon={<Activity className="text-purple-500" />}
            title="Pages"
            value={stats.totalPages}
          />
          <StatCard
            icon={<Package className="text-orange-500" />}
            title="Products"
            value={stats.totalProducts}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Webhook Logs */}
          <Section
            title="Recent Webhook Logs"
            icon={<RefreshCw className="text-teal-500" />}
          >
            {stats.recentWebhooks.length > 0 ? (
              <ul className="space-y-2">
                {stats.recentWebhooks.map((log, index) => (
                  <li
                    key={index}
                    className="bg-white/60 p-3 rounded-lg shadow-sm hover:bg-white/80 transition-all"
                  >
                    <p className="text-gray-700">{log.message}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No recent webhook logs.</p>
            )}
          </Section>

          {/* Recently Updated Products */}
          <Section
            title="Recently Updated Products"
            icon={<Package className="text-purple-500" />}
          >
            {stats.recentlyUpdatedProducts.length > 0 ? (
              <ul className="space-y-2">
                {stats.recentlyUpdatedProducts.map((product, index) => (
                  <li
                    key={index}
                    className="bg-white/60 p-3 rounded-lg shadow-sm hover:bg-white/80 transition-all"
                  >
                    <p className="text-gray-700 font-medium">{product.title}</p>
                    <span className="text-xs text-gray-500">
                      Updated: {new Date(product.updatedAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No recently updated products.</p>
            )}
          </Section>
        </div>

        {/* Low Stock Products */}
        {/* <Section
          title="Low Stock Products"
          icon={<AlertTriangle className="text-red-500" />}
          className="mt-8"
        >
          {stats.lowStockProducts.length > 0 ? (
            <ul className="space-y-2">
              {stats.lowStockProducts.map((product, index) => (
                <li
                  key={index}
                  className="bg-red-50 p-3 rounded-lg border border-red-200 hover:bg-red-100 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-red-700 font-medium">{product.title}</span>
                    <span className="text-red-500 font-bold">Stock: {product.stock}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No low-stock products.</p>
          )}
        </Section> */}
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all flex items-center space-x-4">
    <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
    <div>
      <h2 className="text-sm text-gray-500 uppercase tracking-wide">{title}</h2>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Reusable Section Component
const Section = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white/70 backdrop-blur-sm rounded-xl shadow-md p-6 ${className}`}>
    <div className="flex items-center mb-4 space-x-3">
      {icon}
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

export default Dashboard;