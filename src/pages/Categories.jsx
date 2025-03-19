import { useState } from "react";
import SubCategoryComponent from "./SubCategoryComponent";

const CategoryComponent = () => {
  // Hardcoded categories
  const categories = [
    {
      id: "1",
      name: "Shop By Breed",
      description: "Browse products by animal breed",
      subcategories: []
    },
    {
      id: "2",
      name: "Shop By Disease",
      description: "Browse products by animal disease",
      subcategories: []
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState(null);

  // Select a category and show its subcategories
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Go back to categories list
  const navigateToCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {!selectedCategory ? (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          </div>

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCategorySelect(category)}
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h2>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex justify-end">
                    <button className="text-blue-600 hover:text-blue-800">
                      View Subcategories →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <SubCategoryComponent 
          category={selectedCategory} 
          onBack={navigateToCategories} 
        />
      )}
    </div>
  );
};

export default CategoryComponent;