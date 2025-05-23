import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PagesManagement = () => {
  const [pages, setPages] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [linkedProducts, setLinkedProducts] = useState([]);
  const [bannerImage, setBannerImage] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);



  useEffect(() => {
    fetchSubcategories();
    fetchProducts();
    fetchPages();
  }, []);

  const fetchPages = async (subcategoryId = "") => {
    try {
      setLoading(true);
      const url = subcategoryId ? `${API_BASE_URL}/pages/admin?subcategory=${subcategoryId}` : `${API_BASE_URL}/pages/admin`;
      const response = await axios.get(url);
      setPages(response.data);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subcategories`);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleEdit = (page) => {
    setEditingId(page._id);
    setTitle(page.title);
    setContent(page.content);
    setSubcategory(page.subcategory._id);
    setLinkedProducts(page.linkedProducts.map((p) => p._id));
    setBannerImage(null);
    setAvatarImage(null);
    setFormOpen(true); // Open the form when editing
    if (!selectedSubcategory) {
      setSelectedSubcategory(page.subcategory);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/pages/${id}`);
      fetchPages(selectedSubcategory);
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("subcategory", subcategory);
    linkedProducts.forEach((productId) => formData.append("linkedProducts", productId));
    if (bannerImage) formData.append("bannerImage", bannerImage);
    if (avatarImage) formData.append("avatarImage", avatarImage);

    try {
      const url = editingId ? `${API_BASE_URL}/pages/${editingId}` : `${API_BASE_URL}/pages`;
      const method = editingId ? "put" : "post";

      await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      fetchPages(selectedSubcategory);
    } catch (error) {
      console.error("Error saving page:", error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setSubcategory("");
    setLinkedProducts([]);
    setBannerImage(null);
    setAvatarImage(null);
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    setSelectedSubcategory(subcategoryId);
    fetchPages(subcategoryId);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(productSearch.toLowerCase())
  );


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manage Pages</h1>

      {/* Form Section */}

      <div className="mb-4">
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="bg-[#483285] text-white px-4 py-2 rounded-lg hover:bg-[#372466]"
          >
            + Create New Page
          </button>
        )}
      </div>
      {formOpen && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all">
          <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Page" : "Create Page"}</h2>
          <form onSubmit={handleSubmit}>
            <label className="block text-gray-700">Title:</label>
            <input type="text" className="w-full p-2 border rounded-lg mb-4" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label className="block text-gray-700">Content:</label>
            <textarea className="w-full p-2 border rounded-lg mb-4" value={content} onChange={(e) => setContent(e.target.value)} required />

            <label className="block text-gray-700">Subcategory:</label>
            <select className="w-full p-2 border rounded-lg mb-4" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} required>
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} - (<span className="text-xs">{sub.category}</span>)
                </option>
              ))}
            </select>

            <label className="block text-gray-700">Linked Products:</label>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-2 border rounded-lg my-2"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
            <div className="border rounded-lg p-2 max-h-40 overflow-y-auto mb-4">
              {filteredProducts.map((product) => (
                <label key={product._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={linkedProducts.includes(product._id)}
                    onChange={() =>
                      setLinkedProducts((prev) =>
                        prev.includes(product._id) ? prev.filter((id) => id !== product._id) : [...prev, product._id]
                      )
                    }
                  />
                  <span>{product.title}</span>
                </label>
              ))}
            </div>

            <label className="block text-gray-700">Banner Image: <span className="italic font-thin">540px (W) x 180px (H)</span></label>
            <input type="file" className="w-full p-2 border rounded-lg mb-4" onChange={(e) => setBannerImage(e.target.files[0])} />

            <label className="block text-gray-700">Avatar Image: <span className="italic font-thin">200px (W) x 200px (H)</span></label>
            <input type="file" className="w-full p-2 border rounded-lg mb-4" onChange={(e) => setAvatarImage(e.target.files[0])} />

            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full bg-[#483285] text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {editingId ? "Update Page" : "Create Page"}
              </button>
              <button
                type="button"
                className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
                onClick={() => {
                  resetForm();
                  setFormOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-6">
        <label className="block text-gray-700">Filter by Subcategory:</label>
        <select
          className="w-full p-2 border rounded-lg mb-4"
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
        >
          <option value="">All Subcategories</option>
          {subcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name} - ({sub.category})
            </option>
          ))}
        </select>
      </div>

      {/* Pages List */}
      {loading ? <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-gray-600">Loading pages...</p>
      </div> :
        <>      <h2 className="text-xl font-bold mb-4">Existing Pages</h2>
          {pages.length === 0 ? (
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <p className="text-gray-600">No pages found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <div key={page._id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
                  {/* Page Title */}
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL_IMG}/${page.bannerImage}`}
                    alt="Banner"
                    className="w-full h-20 rounded-lg object-cover"
                  />
                  <div className="flex justify-start items-center gap-4 mt-4">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL_IMG}/${page.avatarImage}`}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <h2 className="text-lg font-semibold text-gray-900">{page.title}</h2>
                  </div>

                  {/* Page Content Preview */}
                  <p className="text-gray-600 mt-2 text-sm line-clamp-3">{page.content}</p>

                  {/* Category */}
                  <p className="text-gray-500 text-sm mt-2">
                    <span className="font-semibold">Category:</span> {page.subcategory?.category || "N/A"}
                  </p>

                  {/* Subcategory */}
                  <p className="text-gray-500 text-sm">
                    <span className="font-semibold">Subcategory:</span> {page.subcategory?.name || "N/A"}
                  </p>

                  {/* Linked Products */}
                  {page.linkedProducts?.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold text-gray-700">Linked Products:</p>
                      <ul className="text-gray-600 text-sm">
                        {page.linkedProducts.slice(0, 3).map((product) => (
                          <li key={product._id} className="list-disc ml-4">{product.title}</li>
                        ))}
                        {page.linkedProducts.length > 3 && (
                          <p className="text-gray-500 text-sm mt-1">+{page.linkedProducts.length - 3} more</p>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto flex justify-between items-center pt-4">


                    <button
                      onClick={() => handleEdit(page)}
                      className="p-2 bg-white shadow rounded-full hover:bg-green-100"
                    >
                      <Pencil className="text-green-700 w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(page._id)}
                      className="p-2 bg-white shadow rounded-full hover:bg-red-100"
                    >
                      <Trash2 className="text-red-700 w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      }
    </div>
  );
};

export default PagesManagement;
