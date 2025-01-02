import React, { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/footer";
import { ToastContainer, toast } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css';

const ViewCategory = ({ handleLogout, adminData }) => {
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryToEdit, setCategoryToEdit] = useState({});
  const [categoryToView, setCategoryToView] = useState({}); // For category details modal
  const [showCategoryModal, setShowCategoryModal] = useState(false); // For toggling the edit modal visibility
  const [showCategoryDetailsModal, setShowCategoryDetailsModal] = useState(false); // For toggling the view details modal visibility


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories/getCategories");
        if (response.status === 200) {
          setCategories(response.data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || "Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const formatDateToIST = (date) => {
    const options = { timeZone: "Asia/Kolkata", hour12: true };
    return new Date(date).toLocaleString("en-IN", options);
  };

  const formatSubcategories = (subcategoryString) => {
    const subcategories = subcategoryString.split(",").map((item) => item.trim());
    if (subcategories.length > 2) {
      return `${subcategories.slice(0, 2).join(", ")} etc...`;
    }
    return subcategories.join(", ");
  };

  const handleEditClick = (category) => {
    setCategoryToEdit(category);
    setShowCategoryModal(true); // Open the modal on edit click
  };

  const handleDelete = async (category_id, activeStatus) => {
    const payload = {
      category_id: category_id,
      active_status: activeStatus === 1 ? 0 : 1, // Toggle between 1 and 0 for activation/deactivation
      modified_by: adminData?.admin_name || "Unknown",  // Fallback to "Unknown" if admin name is missing
    };

    try {
      const response = await axios.post('/categories/delete', payload);

      if (response.status === 200) {
        toast.success(
          `Category ID ${category_id} ${activeStatus === 1 ? 'deactivated' : 'activated'} successfully!`
        );
        // Optionally, update the categories list locally without needing to refetch
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.category_id === category_id
              ? { ...category, active_status: activeStatus === 1 ? 0 : 1 } // Toggle active status to 0 or 1
              : category
          )
        );
      } else {
        throw new Error("Failed to update category status");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category status");
    }
  };

  const handleCategoryUpdate = async (e) => {
    e.preventDefault();

    const updatedCategory = {
      category_id: categoryToEdit.category_id,
      maincategory_name: categoryToEdit.maincategory_name?.toLowerCase() || "",
      subcategory_name: categoryToEdit.subcategory_name?.toLowerCase() || "",
      modified_by: adminData.admin_name,
    };

    try {
      const response = await axios.put('/categories/update', updatedCategory);

      if (response.status === 200) {
        toast.success(`Category ID ${categoryToEdit._id} updated successfully!`);
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.category_id === categoryToEdit.category_id
              ? updatedCategory
              : category
          )
        );
        setShowCategoryModal(false); // Close modal on successful update
      } else {
        throw new Error("Failed to update category");
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to update category");
      toast.error(err.response?.data?.message || "Failed to update category");
    }
  };

  // const openCategoryModal = (category) => {
  //   setCategoryToEdit(category); // Set the category to be edited
  //   setShowCategoryModal(true); // Open the modal
  // };

  const closeCategoryModal = () => {
    setShowCategoryModal(false); // Close the modal
    setCategoryToEdit({}); // Reset the form data
  };

  const openCategoryDetailsModal = (category) => {
    setCategoryToView(category); // Set the category to be viewed
    setShowCategoryDetailsModal(true); // Open the details modal
  };

  const closeCategoryDetailsModal = () => {
    setShowCategoryDetailsModal(false); // Close the modal
    setCategoryToView({}); // Reset the form data
  };

  return (
    <div>
      {/* Page Wrapper Start */}
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header handleLogout={handleLogout} adminData={adminData} />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card card-table">
                    <div className="card-body">
                      <div className="title-header option-title">
                        <h5>All Categories</h5>
                        <form className="d-inline-flex">
                          <Link className="btn btn-solid" to="/Addcategory">
                            Add New
                          </Link>
                        </form>
                      </div>

                      <div className="table-responsive category-table">
  <table className="table all-package theme-table" id="table_id">
    <thead>
      <tr>
        <th>Category Id</th>
        <th>Main Category</th>
        <th>Sub Category</th>
        <th>Created by</th>
        <th>Created date</th>
        <th>Status</th>
        <th>Option</th>
      </tr>
    </thead>
    <tbody>
      {categories.length > 0 ? (
        categories.map((category) => (
          <tr key={category.category_id}>
            <td>{category.category_id}</td>
            {/* Replace with actual main category if available */}
            <td>{category.category_name || 'N/A'}</td>
            {/* Replace with actual subcategories if available */}
            <td>{formatSubcategories(category.subcategories || [])}</td>
            <td>{category.created_by}</td>
            <td>{formatDateToIST(category.created_date)}</td>
            <td>
              <span
                style={{
                  color: category.active_status === 1 ? 'green' : 'red',
                }}
              >
                {category.active_status === 1 ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td>
              <ul>
                <li>
                  <button
                    onClick={() => openCategoryDetailsModal(category)}
                    className="btn btn-link p-0"
                    aria-label="View category"
                    style={{ textDecoration: 'none' }}
                  >
                    <i className="ri-eye-line"></i>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleEditClick(category)}
                    className="btn btn-link p-0"
                    aria-label="Edit category"
                    style={{ textDecoration: 'none' }}
                  >
                    <i
                      className="ri-pencil-line"
                      style={{
                        color: 'blue',
                        textDecoration: 'none',
                      }}
                    ></i>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleDelete(category.category_id, category.active_status)
                    }
                    className="btn btn-link p-0"
                    aria-label={
                      category.active_status === 1
                        ? 'Deactivate category'
                        : 'Activate category'
                    }
                    style={{ textDecoration: 'none' }}
                  >
                    <i
                      className={
                        category.active_status === 1
                          ? 'ri-delete-bin-5-line'
                          : 'ri-add-line'
                      }
                      style={{
                        color:
                          category.active_status === 1 ? 'red' : 'green',
                        textDecoration: 'none',
                      }}
                    ></i>
                  </button>
                </li>
              </ul>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7" className="text-center">
            {errorMessage || 'No categories available'}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container-fluid">
              <Footer />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Category Details */}
      {showCategoryDetailsModal && categoryToView && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Category Details</h5>
                <button onClick={closeCategoryDetailsModal} className="close" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Category Id:</strong> {categoryToView.category_id}</p>
                <p><strong>Main Category:</strong> {categoryToView.maincategory_name}</p>
                <p><strong>Sub Category:</strong> {categoryToView.subcategory_name}</p>
                <p><strong>Created by:</strong> {categoryToView.created_by}</p>
                <p><strong>Created date:</strong> {formatDateToIST(categoryToView.created_date)}</p>
                <p><strong>Status:</strong> {categoryToView.active_status === 1 ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeCategoryDetailsModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Category Edit */}
      {showCategoryModal && categoryToEdit && (
  <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit Category</h5>
          <button onClick={closeCategoryModal} className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleCategoryUpdate}>
            <div className="form-group">
              <label>Main Category</label>
              <input
                type="text"
                className="form-control"
                value={categoryToEdit.maincategory_name || ""}
                onChange={(e) => setCategoryToEdit({ ...categoryToEdit, maincategory_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Sub Category</label>
              <input
                type="text"
                className="form-control"
                value={categoryToEdit.subcategory_name || ""}
                onChange={(e) => setCategoryToEdit({ ...categoryToEdit, subcategory_name: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button type="button" className="btn btn-secondary" onClick={closeCategoryModal}>
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}

            <ToastContainer />
    </div>
  );
};

export default ViewCategory;
