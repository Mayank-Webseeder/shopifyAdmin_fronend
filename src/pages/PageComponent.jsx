import { useState, useRef } from "react";

const PageComponent = ({ category, subcategory, onBack }) => {
  const [breeds, setBreeds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [breedForm, setBreedForm] = useState({
    name: "",
    description: "",
    banner: null
  });

  // Ref for file input
  const fileInputRef = useRef(null);

  // Handle opening the modal
  const handleOpenModal = () => {
    setBreedForm({
      name: "",
      description: "",
      banner: null
    });
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle breed input changes
  const handleBreedInputChange = (e) => {
    const { name, value } = e.target;
    setBreedForm({
      ...breedForm,
      [name]: value
    });
  };

  // Handle file upload for breed banner
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        setBreedForm({
          ...breedForm,
          banner: event.target?.result
        });
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create new breed
    const newBreed = {
      id: Date.now().toString(),
      name: breedForm.name,
      description: breedForm.description,
      banner: breedForm.banner
    };

    setBreeds([...breeds, newBreed]);
    handleCloseModal();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button onClick={onBack} className="mb-6 flex items-center text-blue-600 hover:text-blue-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Subcategories
      </button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{subcategory.name}</h1>
          <p className="text-gray-600">Category: {category.name}</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Page
        </button>
      </div>

      {/* Breeds/Pages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {breeds.map((breed) => (
          <div key={breed.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200">
              {breed.banner ? (
                <img
                  src={breed.banner}
                  alt={breed.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No banner image</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{breed.name}</h2>
              <p className="text-gray-600">{breed.description}</p>
            </div>
          </div>
        ))}
      </div>

      {breeds.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">No pages added yet. Click "Add Page" to create one.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Page</h3>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Page Name</label>
                        <input
                          type="text"
                          name="name"
                          value={breedForm.name}
                          onChange={handleBreedInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Choose File
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="image/*"
                          />
                          <span className="ml-3 text-sm text-gray-500">
                            {breedForm.banner ? "Image selected" : "No file chosen"}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name="description"
                          value={breedForm.description}
                          onChange={handleBreedInputChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                      </div>

                      {breedForm.banner && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                          <div className="w-full h-40 rounded-md overflow-hidden">
                            <img
                              src={breedForm.banner}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Add Page
                        </button>
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageComponent;

