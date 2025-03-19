import { useState, useRef } from "react";
import PageComponent from "./PageComponent";

const SubCategoryComponent = ({ category, onBack }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  
  // Form state
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    avatar: null
  });

  // Ref for file input
  const fileInputRef = useRef(null);

  // Handle opening the modal
  const handleOpenModal = () => {
    setSubcategoryForm({
      name: "",
      avatar: null
    });
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle subcategory input changes
  const handleSubcategoryInputChange = (e) => {
    const { name, value } = e.target;
    setSubcategoryForm({
      ...subcategoryForm,
      [name]: value
    });
  };

  // Handle file upload for subcategory avatar
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        setSubcategoryForm({
          ...subcategoryForm,
          avatar: event.target?.result
        });
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create new subcategory
    const newSubcategory = {
      id: Date.now().toString(),
      name: subcategoryForm.name,
      avatar: subcategoryForm.avatar,
      breeds: []
    };

    setSubcategories([...subcategories, newSubcategory]);
    handleCloseModal();
  };

  // Navigate to subcategory pages
  const navigateToPages = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  // Navigate back to subcategories
  const navigateToSubcategories = () => {
    setSelectedSubcategory(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {!selectedSubcategory ? (
        <>
          <button onClick={onBack} className="mb-6 flex items-center text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Categories
          </button>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{category.name} Subcategories</h1>
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Subcategory
            </button>
          </div>

          {/* Subcategories List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigateToPages(subcategory)}
              >
                <div className="h-40 bg-gray-200">
                  {subcategory.avatar ? (
                    <img
                      src={subcategory.avatar}
                      alt={subcategory.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl text-gray-400">{subcategory.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h2 className="text-lg font-semibold text-gray-800">{subcategory.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{subcategory.breeds.length} breeds</p>
                </div>
              </div>
            ))}
          </div>

          {subcategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No subcategories yet. Click "Add Subcategory" to create one.</p>
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
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Subcategory</h3>

                        <form onSubmit={handleSubmit}>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
                            <input
                              type="text"
                              name="name"
                              value={subcategoryForm.name}
                              onChange={handleSubcategoryInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Image</label>
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
                                {subcategoryForm.avatar ? "Image selected" : "No file chosen"}
                              </span>
                            </div>
                          </div>

                          {subcategoryForm.avatar && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                              <div className="w-32 h-32 rounded-md overflow-hidden">
                                <img
                                  src={subcategoryForm.avatar}
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
                              Add Subcategory
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
        </>
      ) : (
        <PageComponent 
          category={category} 
          subcategory={selectedSubcategory} 
          onBack={navigateToSubcategories} 
        />
      )}
    </div>
  );
};

export default SubCategoryComponent;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SubCategory = () => {
//   const [subcategories, setSubcategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [newSubcategory, setNewSubcategory] = useState({ name: '', description: '' });
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({ name: '', description: '' });

//   const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

//   // Fetch all subcategories
//   const fetchSubcategories = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${baseURL}/api/subcategories`);
//       setSubcategories(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch subcategories');
//       console.error('Error fetching subcategories:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create new subcategory
//   const createSubcategory = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${baseURL}/api/subcategories`, 
//         newSubcategory,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
//       setSubcategories([...subcategories, response.data]);
//       setNewSubcategory({ name: '', description: '' });
//     } catch (err) {
//       setError('Failed to create subcategory');
//       console.error('Error creating subcategory:', err);
//     }
//   };

//   // Delete subcategory
//   const deleteSubcategory = async (id) => {
//     if (window.confirm('Are you sure you want to delete this subcategory?')) {
//       try {
//         await axios.delete(
//           `${baseURL}/api/subcategories/${id}`,
//           {
//             headers: {
//               'Authorization': `Bearer ${localStorage.getItem('token')}`
//             }
//           }
//         );
//         setSubcategories(subcategories.filter(subcategory => subcategory._id !== id));
//       } catch (err) {
//         setError('Failed to delete subcategory');
//         console.error('Error deleting subcategory:', err);
//       }
//     }
//   };

//   // Start editing a subcategory
//   const startEdit = (subcategory) => {
//     setEditingId(subcategory._id);
//     setEditForm({ name: subcategory.name, description: subcategory.description });
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: '', description: '' });
//   };

//   // Save edited subcategory
//   const updateSubcategory = async (id) => {
//     try {
//       const response = await axios.put(
//         `${baseURL}/api/subcategories/${id}`,
//         editForm,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
//       setSubcategories(subcategories.map(subcategory => 
//         subcategory._id === id ? response.data : subcategory
//       ));
//       setEditingId(null);
//     } catch (err) {
//       setError('Failed to update subcategory');
//       console.error('Error updating subcategory:', err);
//     }
//   };

//   // Load subcategories on component mount
//   useEffect(() => {
//     fetchSubcategories();
//   }, []);

//   // Handle input changes for new subcategory form
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewSubcategory({ ...newSubcategory, [name]: value });
//   };

//   // Handle input changes for edit form
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm({ ...editForm, [name]: value });
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Subcategories</h1>

//       {/* Error display */}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* New Subcategory Form */}
//       <div className="bg-white shadow-md rounded p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Add New Subcategory</h2>
//         <form onSubmit={createSubcategory}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={newSubcategory.name}
//               onChange={handleInputChange}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={newSubcategory.description}
//               onChange={handleInputChange}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               rows="3"
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Add Subcategory
//           </button>
//         </form>
//       </div>

//       {/* Subcategories List */}
//       <div className="bg-white shadow-md rounded p-6">
//         <h2 className="text-xl font-semibold mb-4">Subcategories List</h2>
        
//         {loading ? (
//           <p className="text-gray-600">Loading subcategories...</p>
//         ) : subcategories.length === 0 ? (
//           <p className="text-gray-600">No subcategories found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white">
//               <thead>
//                 <tr>
//                   <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
//                   <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
//                   <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {subcategories.map((subcategory) => (
//                   <tr key={subcategory._id}>
//                     <td className="py-2 px-4 border-b border-gray-200">
//                       {editingId === subcategory._id ? (
//                         <input
//                           type="text"
//                           name="name"
//                           value={editForm.name}
//                           onChange={handleEditChange}
//                           className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700"
//                         />
//                       ) : (
//                         subcategory.name
//                       )}
//                     </td>
//                     <td className="py-2 px-4 border-b border-gray-200">
//                       {editingId === subcategory._id ? (
//                         <textarea
//                           name="description"
//                           value={editForm.description}
//                           onChange={handleEditChange}
//                           className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700"
//                           rows="2"
//                         />
//                       ) : (
//                         subcategory.description
//                       )}
//                     </td>
//                     <td className="py-2 px-4 border-b border-gray-200">
//                       {editingId === subcategory._id ? (
//                         <div className="flex space-x-2">
//                           <button 
//                             onClick={() => updateSubcategory(subcategory._id)}
//                             className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
//                           >
//                             Save
//                           </button>
//                           <button 
//                             onClick={cancelEdit}
//                             className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-sm"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="flex space-x-2">
//                           <button 
//                             onClick={() => startEdit(subcategory)}
//                             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
//                           >
//                             Edit
//                           </button>
//                           <button 
//                             onClick={() => deleteSubcategory(subcategory._id)}
//                             className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SubCategory;