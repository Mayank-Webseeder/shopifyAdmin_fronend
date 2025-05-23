import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


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
  const [isFormExpanded, setIsFormExpanded] = useState(false);

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
    setIsFormExpanded(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    // Set a custom drag image (clone the dragged element)
    const target = e.currentTarget;
    const clone = target.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.top = "-9999px"; // move it out of view
    clone.style.left = "-9999px";
    clone.style.width = `${target.offsetWidth}px`; // preserve size
    document.body.appendChild(clone);
    e.dataTransfer.setDragImage(clone, 0, 0);

    // Remove clone after short time
    setTimeout(() => document.body.removeChild(clone), 0);
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

      {/* Collapsible Form Section */}
      <div className="bg-white shadow-md rounded-lg mb-6 overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-white cursor-pointer"
          onClick={() => setIsFormExpanded(!isFormExpanded)}
        >
          <h2 className="text-lg font-semibold">
            {editingId ? "Edit Section" : "Create Section"}
          </h2>
          <button className="text-gray-600">
            {isFormExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
        {isFormExpanded && (
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Form contents remain the same as in the previous implementation */}
              <label className="block text-gray-700">Title:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg mb-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label className="block text-gray-700">Banner Image: <span className="italic font-thin">540px (W) x 180px (H)</span></label>
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
                    ? "bg-[#483285] text-white"
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
                    ? "bg-[#483285] text-white"
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
                  className="flex-1 bg-[#483285] text-white py-2 rounded-lg hover:bg-blue-700"
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
        )}
      </div>



      {/* Sections List */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Existing Sections</h2>
      {loading ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-600">Loading sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-600">No sections found. Create your first section above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section._id}
              className={`bg-transparent rounded-lg overflow-hidden flex items-center transition-all duration-300 ease-in-out ${draggedItem === section._id ? 'ring-2 ring-blue-500 scale-105 shadow-2xl' : ''
                }`}
              draggable
              onDragStart={(e) => handleDragStart(e, section._id)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-id={section._id}
            >

              <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-10 w-full">
                {/* Banner Section */}
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL_IMG}/${section.bannerImage}`}
                    alt={section.title}
                    className="w-full h-32 object-contain bg-gray-100"
                  />
                  <div className="absolute bottom-3 left-4 text-white bg-black/50 px-4 py-2 rounded-xl">
                    <h2 className="text-xl font-bold">{section.title}</h2>
                    <p className="text-sm">{section.linkedPages?.length ? 'Type: Pages' : 'Type: Products'}</p>
                  </div>

                  {/* Floating Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="p-2 bg-white shadow rounded-full hover:bg-green-100"
                    >
                      <Pencil className="text-green-700 w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(section._id)}
                      className="p-2 bg-white shadow rounded-full hover:bg-red-100"
                    >
                      <Trash2 className="text-red-700 w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Linked Items Section */}
                <div className="p-4 border-t bg-gray-50">
                  <h4 className="text-gray-800 font-semibold text-sm mb-2">
                    {section.linkedPages?.length
                      ? `Linked Pages (${section.linkedPages.length})`
                      : `Linked Products (${section.linkedProducts.length})`}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(section.linkedPages?.length ? section.linkedPages : section.linkedProducts)?.map((item) => (
                      <span
                        key={item._id}
                        className={`text-xs px-3 py-1 rounded-full ${section.linkedPages?.length
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                          }`}
                      >
                        {item.title}
                      </span>
                    ))}
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