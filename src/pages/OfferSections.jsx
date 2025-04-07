import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OfferSections = () => {
    const [sections, setSections] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [banner, setBanner] = useState(null);
    const [title, setTitle] = useState("");
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchSubcategory, setSearchSubcategory] = useState("");
    const [searchProduct, setSearchProduct] = useState("");
    const [editingSection, setEditingSection] = useState(null);

    useEffect(() => {
        fetchSections();
        fetchSubcategories();
        fetchProducts();
    }, []);

    const fetchSections = async () => {
        const res = await axios.get(`${API_BASE_URL}/offer-sections`);
        setSections(res.data);
    };

    const fetchSubcategories = async () => {
        const res = await axios.get(`${API_BASE_URL}/subcategories`);
        setSubcategories(res.data);
    };

    const fetchProducts = async () => {
        const res = await axios.get(`${API_BASE_URL}/products`);
        setProducts(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        if (banner) {
            formData.append("banner", banner);
        }
        formData.append("subcategories", JSON.stringify(selectedSubcategories));
        formData.append("products", JSON.stringify(selectedProducts));

        console.log("Form data to be sent:", {
            title,
            bannerId: banner ? "Banner exists" : "No banner",
            selectedSubcategories,
            selectedProducts
        });

        try {
            await axios.put(`${API_BASE_URL}/offer-sections/${editingSection._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            fetchSections();
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error updating offer section:", error.response?.data || error.message);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        if (banner) {
            formData.append("banner", banner);
        }
        formData.append("subcategories", JSON.stringify(selectedSubcategories));
        formData.append("products", JSON.stringify(selectedProducts));

        try {
            await axios.post(`${API_BASE_URL}/offer-sections`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            fetchSections();
            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error creating offer section:", error.response?.data || error.message);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (editingSection) {
            handleSubmit(e);
        } else {
            handleCreate(e);
        }
    };

    const handleBannerChange = (e) => setBanner(e.target.files[0]);

    const resetForm = () => {
        setTitle("");
        setBanner(null);
        setSelectedSubcategories([]);
        setSelectedProducts([]);
        setEditingSection(null);
    };

    const editSection = (section) => {
        setTitle(section.title);
        setSelectedSubcategories(section.subcategories.map(sc => sc._id));
        setSelectedProducts(section.products.map(p => p._id));
        setEditingSection(section);
        setIsFormOpen(true);
    };

    const deleteSection = async (id) => {
        if (!window.confirm("Are you sure you want to delete this section?")) return;

        try {
            await axios.delete(`${API_BASE_URL}/offer-sections/${id}`);
            fetchSections();
        } catch (error) {
            console.error("Error deleting offer section:", error.response?.data || error.message);
        }
    };

    const toggleSelection = (id, type) => {
        if (type === "subcategory") {
            setSelectedSubcategories(prev =>
                prev.includes(id) ? prev.filter(sc => sc !== id) : [...prev, id]
            );
        } else {
            setSelectedProducts(prev =>
                prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
            );
        }
    };

    const filteredSubcategories = subcategories.filter(sc =>
        sc.name.toLowerCase().includes(searchSubcategory.toLowerCase())
    );

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchProduct.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Offer Sections</h1>

            <button
                onClick={() => { setIsFormOpen(!isFormOpen); resetForm(); }}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
                {isFormOpen ? "Close Form" : "Add Offer Section"}
            </button>

            {isFormOpen && (
                <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
                    <h2 className="text-lg font-bold mb-4">{editingSection ? "Edit Offer Section" : "Create Offer Section"}</h2>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Offer Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />

                        {/* Image Input */}
                        <input type="file" accept="image/*" onChange={handleBannerChange} className="w-full p-2 border rounded-md" />

                        {/* Subcategory Search */}
                        <input
                            type="text"
                            placeholder="Search Subcategories..."
                            value={searchSubcategory}
                            onChange={(e) => setSearchSubcategory(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />

                        {/* Subcategories Multi-Select */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border p-2 rounded-md max-h-40 overflow-y-auto">
                            {filteredSubcategories.map(sc => (
                                <div
                                    key={sc._id}
                                    className={`p-2 border rounded-md cursor-pointer ${selectedSubcategories.includes(sc._id) ? "bg-blue-500 text-white" : "bg-white"
                                        }`}
                                    onClick={() => toggleSelection(sc._id, "subcategory")}
                                >
                                    {sc.name}
                                </div>
                            ))}
                        </div>

                        {/* Product Search */}
                        <input
                            type="text"
                            placeholder="Search Products..."
                            value={searchProduct}
                            onChange={(e) => setSearchProduct(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />

                        {/* Products Multi-Select */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border p-2 rounded-md max-h-40 overflow-y-auto">
                            {filteredProducts.map(p => (
                                <div
                                    key={p._id}
                                    className={`p-2 border rounded-md cursor-pointer ${selectedProducts.includes(p._id) ? "bg-green-500 text-white" : "bg-white"
                                        }`}
                                    onClick={() => toggleSelection(p._id, "product")}
                                >
                                    {p.title}
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">
                            {editingSection ? "Update" : "Save"} Offer Section
                        </button>
                    </form>
                </div>
            )}

            {/* List of Offer Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map((section) => (
                    <div key={section._id} className="bg-white shadow-lg p-4 rounded-lg">
                        <img src={import.meta.env.VITE_API_BASE_URL_IMG + "/" + section.banner} alt={section.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                        <h2 className="text-lg font-semibold">{section.title}</h2>

                        <button className="px-3 py-1 bg-yellow-500 text-white rounded mr-2" onClick={() => editSection(section)}>Edit</button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => deleteSection(section._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfferSections;
