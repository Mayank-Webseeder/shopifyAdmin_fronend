import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Edit2,
  Trash2,
  X

} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubcategoryManagement = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [categories] = useState(["Shop by Breed", "Shop by Disease"]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormCollapsed, setIsFormCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("");

  useEffect(() => {
    fetchSubcategories();
  }, []);

  useEffect(() => {
    // Filter subcategories based on search and category filter
    let result = subcategories;

    if (currentFilter) {
      result = result.filter(sub => sub.category === currentFilter);
    }

    if (searchTerm) {
      result = result.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubcategories(result);
  }, [subcategories, searchTerm, currentFilter]);

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subcategories`);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subcategory) => {
    setEditingId(subcategory._id);
    setName(subcategory.name);
    setCategory(subcategory.category);
    setBannerImage(null);
    setAvatarImage(null);
    setIsFormCollapsed(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/subcategories/${id}`);
      fetchSubcategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    if (bannerImage) formData.append("bannerImage", bannerImage);
    if (avatarImage) formData.append("avatarImage", avatarImage);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/subcategories/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API_BASE_URL}/subcategories`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      fetchSubcategories();
    } catch (error) {
      console.error("Error saving subcategory:", error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCategory("");
    setBannerImage(null);
    setAvatarImage(null);
  };

  const handleCancelEdit = () => {
    resetForm();
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Subcategory Management</h1>

        {/* Collapsible Form Section */}
        <div className="bg-white shadow-lg rounded-lg mb-6 overflow-hidden">
          <div
            className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
            onClick={() => setIsFormCollapsed(!isFormCollapsed)}
          >
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Subcategory" : "Create Subcategory"}
            </h2>
            {isFormCollapsed ? <ChevronDown /> : <ChevronUp />}
          </div>

          {!isFormCollapsed && (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Subcategory Name:</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Category:</label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Banner Image:</label>
                  <input
                    type="file"
                    className="w-full p-2 border rounded-lg file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2"
                    onChange={(e) => setBannerImage(e.target.files[0])}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Avatar Image:</label>
                  <input
                    type="file"
                    className="w-full p-2 border rounded-lg file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2"
                    onChange={(e) => setAvatarImage(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-4">
                <button
                  type="submit"
                  className="flex-grow bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  {editingId ? "Update Subcategory" : "Create Subcategory"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-grow bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition duration-300 flex items-center justify-center"
                  >
                    <X className="mr-2" size={20} /> Cancel Edit
                  </button>
                )}
              </div>
            </form>
          )}
        </div>


        {/* Search and Filter Section */}
        <div className="flex mb-4 space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search subcategories..."
              className="w-full p-2 pl-10 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="text-gray-600" />
            <select
              className="p-2 border rounded-lg"
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subcategory List */}
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : filteredSubcategories.length === 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <p className="text-gray-600">No subcategories found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubcategories.map((sub) => (
              <div
                key={sub._id}
                className="bg-white shadow-lg rounded-lg p-4 flex items-center hover:shadow-xl transition duration-300"
              >
                <div className="flex items-center space-x-4 flex-grow">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL_IMG}/${sub.bannerImage}`}
                    alt="Banner"
                    className="w-20 h-20 rounded-lg object-cover"
                  />

                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL_IMG}/${sub.avatarImage}`}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  <div>
                    <h2 className="text-lg font-semibold">{sub.name}</h2>
                    <p className="text-gray-600">Category: {sub.category}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                    onClick={() => handleEdit(sub)}
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                    onClick={() => handleDelete(sub._id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryManagement;