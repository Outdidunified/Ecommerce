import React, { useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom'; 
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/footer';
import { ToastContainer, toast } from 'react-custom-alert'; // Importing react-custom-alert
import 'react-custom-alert/dist/index.css'; // import css file from root.

const Addcategory = ({ handleLogout, adminData }) => {
    const [mainCategory, setMainCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [, setErrorMessage] = useState('');
    const [, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    const navigate = useNavigate(); // Initialize useNavigate for page redirection

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/categories/getAllCategories");
            console.log(response);
            if (response.status === 200) {
                setCategories(response.data.categories); // Adjusted for main_category structure
            } else {
                throw new Error("Failed to fetch categories");
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "Failed to fetch categories");
        }
    };

    const handleOpenModal = () => {
        setShowModal(true); // Open the modal when the button is clicked
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        try {
            // Make the POST request to the backend to add a new main category
            const response = await axios.post('/categories/add', {
                category_name: mainCategory, // Category name from the state
                created_by: adminData.admin_name, // Admin name from props or state
            });
    
            if (response.status === 200) {
                setSuccessMessage('Main Category added successfully!');
                setErrorMessage('');
                toast.success('Main Category added successfully!');
                setMainCategory(''); // Reset the input field
    
                // Close the modal after successful submission
                setShowModal(false);
    
                // Optionally, refresh the category list or perform any other action
                // fetchCategories(); // If you want to refresh the category list
    
            } else {
                throw new Error('Failed to add category');
            }
        } catch (err) {
            console.error('Error:', err); // Debugging: Log the error
            setErrorMessage(err.response?.data?.message || 'Failed to add category');
            setSuccessMessage('');
            toast.error(err.response?.data?.message || 'Failed to add category');
        }
    };

    const handleSubCategorySubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        // Validate input
        if (!mainCategory || !subCategory) {
            setErrorMessage("Please select a main category and enter a subcategory name.");
            toast.error("Please select a main category and enter a subcategory name.");
            return;
        }
    
        try {
            // Find the selected category object to get its ID
            const selectedCategory = categories.find(
                (category) => category.main_category.category_name === mainCategory
            );
    
            if (!selectedCategory) {
                setErrorMessage("Invalid main category selected.");
                toast.error("Invalid main category selected.");
                return;
            }
    
            const mainCategoryId = selectedCategory.main_category.category_id;
    
            // Make the POST request to add a new subcategory
            const response = await axios.post('/categories/add-subcategory', {
                main_category_id: mainCategoryId,
                sub_category_name: subCategory,
                created_by: adminData.admin_name, // Admin name from props or state
            });
    
            if (response.status === 200) {
                setSuccessMessage('Subcategory added successfully!');
                setErrorMessage('');
                toast.success('Subcategory added successfully!');
                setTimeout(() => {
                    navigate('/SubCategory'); // Navigate to /allusers after 2 seconds
                  }, 2000);
                setSubCategory(''); // Reset the subcategory input field
    
                // Optionally, refresh the category list or perform any other action
                // fetchCategories(); // If you want to refresh the category list
            } else {
                throw new Error('Failed to add subcategory');
            }
        } catch (err) {
            console.error('Error:', err); // Debugging: Log the error
            setErrorMessage(err.response?.data?.message || 'Failed to add subcategory');
            setSuccessMessage('');
            toast.error(err.response?.data?.message || 'Failed to add subcategory');
        }
    };
    

    return (
        <div>
            {/* Page Wrapper Start */}
            <div className="page-wrapper compact-wrapper" id="pageWrapper">
                {/* Page Header Start */}
                <Header handleLogout={handleLogout} adminData={adminData} />
                {/* Page Header Ends */}

                {/* Page Body Start */}
                <div className="page-body-wrapper">
                    {/* Page Sidebar Start */}
                    <Sidebar />
                    {/* Page Sidebar Ends */}

                    {/* Container-fluid starts */}
                    <div className="page-body">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-sm-8 m-auto">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-header-2">
                                                        <h5>Add sub category</h5>
                                                    </div>

                                                    {/* Add Main Category Button */}
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '20px',
                                                            right: '20px',
                                                            marginBottom: '30px'
                                                        }}
                                                        onClick={handleOpenModal}  // Button logic for clearing Main Category (can be customized)
                                                    >
                                                        Add Main Category
                                                    </button>

                                                    <form onSubmit={handleSubCategorySubmit} className="theme-form theme-form-2 mega-form ">
                                                        {/* Main Category Dropdown */}
                                                        <div className="mb-4 row align-items-center">
                                                            <label className="form-label-title col-sm-3 mb-0">Main Category</label>
                                                            <div className="col-sm-9">
                                                                <select
                                                                    className="form-control"
                                                                    value={mainCategory}
                                                                    onChange={(e) => setMainCategory(e.target.value)}
                                                                    onFocus={fetchCategories} // Call fetchCategories on focus
                                                                    required
                                                                >
                                                                    <option value="">Select Main Category</option>
                                                                    {categories.map((category) => (
                                                                        <option key={category.main_category.category_id} value={category.main_category.category_name}>
                                                                            {category.main_category.category_name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Subcategory Input */}
                                                        <div className="mb-4 row align-items-center">
                                                            <label className="form-label-title col-sm-3 mb-0">Subcategory</label>
                                                            <div className="col-sm-9">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    placeholder="Subcategory"
                                                                    value={subCategory}
                                                                    onChange={(e) => setSubCategory(e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="row justify-content-center mt-4">
                                                            <div className="col-auto">
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary btn-lg"
                                                                >
                                                                    Submit
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {showModal && (
                                        <div className="modal" tabIndex="-1" style={{ display: 'block' }}>
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Add Main Category</h5>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            onClick={handleCloseModal} // Close modal on button click
                                                        ></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <form onSubmit={handleCategorySubmit} className="theme-form theme-form-2 mega-form">
                                                            {/* Main Category Input */}
                                                            <div className="mb-4 row align-items-center">
                                                                <label className="form-label-title col-sm-3 mb-0">Main Category</label>
                                                                <div className="col-sm-9">
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        placeholder="Main Category"
                                                                        value={mainCategory}
                                                                        onChange={(e) => setMainCategory(e.target.value)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Submit and Cancel Buttons */}
                                                            <div className="row justify-content-center mt-4">
                                                                <div className="col-auto">
                                                                    {/* Submit Button */}
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-primary btn-lg"
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                </div>
                                                                <div className="col-auto">
                                                                    {/* Cancel Button */}
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-secondary btn-lg"
                                                                        onClick={handleCloseModal} // Close modal without submitting
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <Footer />
                    </div>
                </div>
            </div>
            {/* Page Wrapper End */}

            {/* React Custom Alert ToastContainer */}
            <ToastContainer />
        </div>
    );
};

export default Addcategory;
