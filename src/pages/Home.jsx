import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, GripVertical } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HomePageManagement = () => {
  const [sections, setSections] = useState([]);
  const [title, setTitle] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [linkedPages, setLinkedPages] = useState([]);
  const [linkedProducts, setLinkedProducts] = useState([]);
  const [pages, setPages] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState("pages");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);


  useEffect(() => {
    fetchSections();
    fetchPagesAndProducts();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/homepage`);
      setSections(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching sections:", error);
      setError("Failed to load sections. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPagesAndProducts = async () => {
    try {
      const pagesRes = await axios.get(`${API_BASE_URL}/pages`);
      const productsRes = await axios.get(`${API_BASE_URL}/products`);
      setPages(pagesRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Error fetching pages/products:", error);
      setError("Failed to load pages or products. Please try again later.");
    }
  };

  const handleEdit = (section) => {
    setEditingId(section._id);
    setTitle(section.title);
    setBannerImage(null); // Reset image

    // Determine which type is being used based on what's populated
    if (section.linkedPages && section.linkedPages.length > 0) {
      setSelectedType("pages");
      setLinkedPages(section.linkedPages.map((p) => p._id));
      setLinkedProducts([]); // Clear the other type
    } else {
      setSelectedType("products");
      setLinkedProducts(section.linkedProducts.map((p) => p._id));
      setLinkedPages([]); // Clear the other type
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/homepage/${id}`);
      fetchSections();
      setError(null);
    } catch (error) {
      console.error("Error deleting section:", error);
      setError("Failed to delete section. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    if (bannerImage) formData.append("bannerImage", bannerImage);

    // Only append the selected type (pages OR products, not both)
    if (selectedType === "pages") {
      // Add each page ID as a separate entry with the same key
      linkedPages.forEach(pageId => {
        formData.append("linkedPages", pageId);
      });
    } else {
      // Add each product ID as a separate entry with the same key
      linkedProducts.forEach(productId => {
        formData.append("linkedProducts", productId);
      });
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/homepage/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API_BASE_URL}/homepage`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      fetchSections();
    } catch (error) {
      console.error("Error saving section:", error);
      setError(error.response?.data?.message || "Failed to save section. Please try again.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setBannerImage(null);
    setLinkedPages([]);
    setLinkedProducts([]);
    setSelectedType("pages");
    setError(null);
    setSearchTerm("");
  };

  // Toggle selection for checkboxes
  const toggleSelection = (id, currentSelection, setFunction) => {
    if (currentSelection.includes(id)) {
      setFunction(currentSelection.filter(item => item !== id));
    } else {
      setFunction([...currentSelection, id]);
    }
  };

  // Filter items based on search term
  const filterItems = (items) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle drag and drop
  const handleDragStart = (e, id) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.dataset.id;
    if (draggedItem && targetId && draggedItem !== targetId) {
      const newSections = [...sections];
      const draggedIndex = newSections.findIndex(s => s._id === draggedItem);
      const targetIndex = newSections.findIndex(s => s._id === targetId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [movedItem] = newSections.splice(draggedIndex, 1);
        newSections.splice(targetIndex, 0, movedItem);
        setSections(newSections);

        // Send updated order to backend
        const orderedIds = newSections.map(section => section._id);
        try {
          await axios.put(`${API_BASE_URL}/homepage/reorder-sections`, { orderedSections: orderedIds });
        } catch (error) {
          console.error("Error updating order:", error);
        }
      }
    }
    setDraggedItem(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Home Page Management</h1>

      {/* Form Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Section" : "Create Section"}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700">Title:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="block text-gray-700">Banner Image:</label>
          <input
            type="file"
            className="w-full p-2 border rounded-lg mb-4"
            onChange={(e) => setBannerImage(e.target.files[0])}
          />

          <label className="block text-gray-700">Select Type:</label>
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              className={`flex-1 p-2 rounded-lg ${selectedType === "pages"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => {
                setSelectedType("pages");
                setLinkedProducts([]);
              }}
            >
              Pages
            </button>
            <button
              type="button"
              className={`flex-1 p-2 rounded-lg ${selectedType === "products"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => {
                setSelectedType("products");
                setLinkedPages([]);
              }}
            >
              Products
            </button>
          </div>

          {/* Search input for filtering items */}
          <div className="mb-4">
            <label className="block text-gray-700">Search:</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder={`Search ${selectedType}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {selectedType === "pages" && (
            <>
              <label className="block text-gray-700 mb-2">
                Linked Pages: ({linkedPages.length} selected)
              </label>
              {pages.length === 0 ? (
                <div className="p-4 bg-gray-100 rounded-lg mb-4 text-gray-600">
                  No pages available. Please create some pages first.
                </div>
              ) : (
                <div className="mb-4 border rounded-lg p-2 max-h-64 overflow-y-auto">
                  {filterItems(pages).map((page) => (
                    <div
                      key={page._id}
                      className={`p-2 mb-1 rounded-lg cursor-pointer flex items-center ${linkedPages.includes(page._id) ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                      onClick={() => toggleSelection(page._id, linkedPages, setLinkedPages)}
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={linkedPages.includes(page._id)}
                        onChange={() => { }} // Change handled by parent div onClick
                      />
                      <span>{page.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {selectedType === "products" && (
            <>
              <label className="block text-gray-700 mb-2">
                Linked Products: ({linkedProducts.length} selected)
              </label>
              {products.length === 0 ? (
                <div className="p-4 bg-gray-100 rounded-lg mb-4 text-gray-600">
                  No products available. Please create some products first.
                </div>
              ) : (
                <div className="mb-4 border rounded-lg p-2 max-h-64 overflow-y-auto">
                  {filterItems(products).map((product) => (
                    <div
                      key={product._id}
                      className={`p-2 mb-1 rounded-lg cursor-pointer flex items-center ${linkedProducts.includes(product._id) ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                      onClick={() => toggleSelection(product._id, linkedProducts, setLinkedProducts)}
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={linkedProducts.includes(product._id)}
                        onChange={() => { }} // Change handled by parent div onClick
                      />
                      <span>{product.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {editingId ? "Update Section" : "Create Section"}
            </button>
            {editingId && (
              <button
                type="button"
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Sections List */}
      <h2 className="text-xl font-bold mb-4">Existing Sections</h2>
      {loading ? (
        <div className="bg-white shadow-lg rounded-lg p-6 flex justify-center">
          <p>Loading sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <p className="text-gray-600">No sections found. Create your first section above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              draggable
              onDragStart={(e) => handleDragStart(e, section._id)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-id={section._id}
            >
              <div className="flex flex-col md:flex-row">
                {section.bannerImage ? (
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL_IMG}/${section.bannerImage}`}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="md:w-1/3 h-48 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No banner image</p>
                  </div>
                )}
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">{section.title}</h2>
                      <p className="text-gray-600 mt-2">
                        {section.linkedPages && section.linkedPages.length > 0
                          ? "Type: Pages"
                          : "Type: Products"}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        onClick={() => handleEdit(section)}
                      >
                        <Pencil />
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => handleDelete(section._id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {section.linkedPages && section.linkedPages.length > 0 ? (
                      <>
                        <h3 className="font-semibold">Linked Pages ({section.linkedPages.length}):</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {section.linkedPages.slice(0, 5).map(page => (
                            <span key={page._id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {page.title}
                            </span>
                          ))}
                          {section.linkedPages.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              +{section.linkedPages.length - 5} more
                            </span>
                          )}
                        </div>
                      </>
                    ) : section.linkedProducts && section.linkedProducts.length > 0 ? (
                      <>
                        <h3 className="font-semibold">Linked Products ({section.linkedProducts.length}):</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {section.linkedProducts.slice(0, 5).map(product => (
                            <span key={product._id} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {product.title}
                            </span>
                          ))}
                          {section.linkedProducts.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              +{section.linkedProducts.length - 5} more
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500">No linked items</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePageManagement;