import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
        </div>
    );

    if (!product) return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
            <p className="mt-2 text-gray-600">This product may have been deleted or doesn't exist in the database.</p>
            <Link to="/products" className="mt-4 inline-block px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300">
                Return to Products
            </Link>
        </div>
    );

    // Format dates for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
                    <p className="text-sm text-gray-500">ID: {product.shopifyId}</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to={-1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Go Back
                    </Link>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex px-6">
                    <button
                        className={`px-4 py-3 text-sm font-medium ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`px-4 py-3 text-sm font-medium ${activeTab === 'variants' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('variants')}
                    >
                        Variants ({product.variants?.length || 0})
                    </button>
                    <button
                        className={`px-4 py-3 text-sm font-medium ${activeTab === 'images' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('images')}
                    >
                        Images ({product.images?.length || 0})
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="p-6">
                {/* Details Tab */}
                {activeTab === 'details' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Product Information</h3>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Title</p>
                                            <p className="font-medium">{product.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Vendor</p>
                                            <p className="font-medium">{product.vendor || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Product Type</p>
                                            <p className="font-medium">{product.productType || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Shopify ID</p>
                                            <p className="font-medium">{product.shopifyId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Created At</p>
                                            <p className="font-medium">{formatDate(product.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Updated At</p>
                                            <p className="font-medium">{formatDate(product.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Featured Image */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Featured Image</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0].src}
                                        alt={product.title}
                                        className="w-full h-auto rounded-md"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md text-gray-400 border border-gray-200">
                                        No Image Available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                        </div>
                        {product.variants && product.variants.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {product.variants.map((variant) => (
                                            <tr key={variant.shopifyId}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.shopifyId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{variant.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.sku || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${variant.inventory_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {variant.inventory_quantity || 0}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
                                No variants available for this product.
                            </div>
                        )}
                    </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                        {product.images && product.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                                        <div className="aspect-square overflow-hidden rounded-md bg-gray-100 mb-2">
                                            <img
                                                src={image.src}
                                                alt={`${product.title} - ${index + 1}`}
                                                className="w-full h-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            <p>ID: {image.shopifyId}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
                                No images available for this product.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;