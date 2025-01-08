import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/footer";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";

const AddProduct = ({ handleLogout, adminData }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");

  const [exchangeable, setExchangeable] = useState(false);
  const [refundable, setRefundable] = useState(false);
  const [productDescription, setProductDescription] = useState("");

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate for page redirection

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories/categoryname");
        if (response.status === 200) {
          setCategories(response.data.categories || []);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch categories"
        );
      }
    };
    fetchCategories();
  }, []);

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await axios.post("/categories/subcategorylist", {
        category_id: categoryId,
      });
      if (response.status === 200) {
        setSubCategories(response.data.subcategories || []);
      } else {
        throw new Error("Failed to fetch subcategories");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch subcategories"
      );
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    setSelectedCategory(categoryName);

    const selectedCategoryObj = categories.find(
      (category) => category.category_name === categoryName
    );

    if (selectedCategoryObj) {
      fetchSubCategories(selectedCategoryObj.category_id);
    } else {
      setSubCategories([]);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create FormData object for images and other fields
    const formData = new FormData();
    
    // Append images to FormData
    formData.append("image", image1); // First image
    formData.append("image2", image2); // Second image
  
    // Find the selected category object
    const selectedCategoryObj = categories.find(
      (category) => category.category_name === selectedCategory
    );
  
    // Find the selected subcategory object
    const selectedSubCategoryObj = subCategories.find(
      (subCategory) => subCategory.sub_category_name === selectedSubCategory
    );
  
    // Append product data to FormData
    formData.append("category_id", selectedCategoryObj?.category_id || "");
    formData.append("sub_category_id", selectedSubCategoryObj?.sub_category_id || "");
    formData.append("product_name", productName);
    formData.append("price", parseFloat(price));
    formData.append("unit", unit);
    formData.append("quantity", parseInt(quantity, 10));
    formData.append("exchangable", exchangeable ? 1 : 0);
    formData.append("refundable", refundable ? 1 : 0);
    formData.append("created_by", adminData.admin_name);
    formData.append("role_id", 2); // Assuming 2 is the role_id for admin
    formData.append("description", productDescription);
  
  
    // Log the final FormData for debugging
    console.log("FormData to Send:", formData);
  
    // Send the FormData as a POST request
    try {
      const response = await axios.post("/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
        },
      });
  
      if (response.status === 200) {
        toast.success("Product added successfully!");
        setTimeout(() => navigate("/Viewproduct"), 2000);
      }
    } catch (err) {
      console.error("Error adding product:", err); // Log error for debugging
      toast.error(err.response?.data?.message || "Error adding product");
    }
  };
  

  

  return (
    <div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header handleLogout={handleLogout} adminData={adminData} />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-sm-8 m-auto">
                      <div className="card">
                        <div className="card-body">
                          <div className="card-header-2">
                            <h5>Product Information</h5>
                          </div>

                          <form
                            onSubmit={handleSubmit}
                            className="theme-form theme-form-2 mega-form"
                          >
                            {/* Product Name */}
                            <div className="mb-4 row align-items-center">
                              <label className="form-label-title col-sm-3 mb-0">
                                Product Name
                              </label>
                              <div className="col-sm-9">
                                <input
                                  className="form-control"
                                  type="text"
                                  value={productName}
                                  onChange={(e) =>
                                    setProductName(e.target.value)
                                  }
                                  placeholder="Product Name"
                                  required
                                />
                              </div>
                            </div>

                            {/* Category */}
                            <div className="mb-4 row">
                              <label className="form-label-title col-sm-3">
                                Category
                              </label>
                              <div className="col-sm-9">
                                <select
                                  className="form-control"
                                  value={selectedCategory}
                                  onChange={handleCategoryChange}
                                  required
                                >
                                  <option value="" disabled>
                                    Select Category
                                  </option>
                                  {categories.map((category) => (
                                    <option
                                      key={category.category_id}
                                      value={category.category_name}
                                    >
                                      {category.category_name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Subcategory */}
                            <div className="mb-4 row">
                              <label className="form-label-title col-sm-3">
                                Sub Category
                              </label>
                              <div className="col-sm-9">
                                <select
                                  className="form-control"
                                  value={selectedSubCategory}
                                  onChange={(e) =>
                                    setSelectedSubCategory(e.target.value)
                                  }
                                  required
                                >
                                  <option value="" disabled>
                                    Select Sub Category
                                  </option>
                                  {subCategories.map((subCategory) => (
                                    <option
                                      key={subCategory.sub_category_id}
                                      value={subCategory.sub_category_name}
                                    >
                                      {subCategory.sub_category_name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Unit */}

                            <div className="mb-4 row align-items-center">
                              <label className="col-sm-3 col-form-label form-label-title">
                                Unit
                              </label>
                              <div className="col-sm-9">
                                <select
                                  className="js-example-basic-single w-100"
                                  value={unit}
                                  onChange={(e) => setUnit(e.target.value)}
                                  required
                                >
                                  <option disabled value="">
                                    Select Unit
                                  </option>
                                  <option value="kg">kg</option>
                                  <option value="nos">nos</option>
                                </select>
                              </div>
                            </div>
                            {/* Quantity */}
                            <div className="mb-4 row align-items-center">
                              <label className="form-label-title col-sm-3 mb-0">
                                Quantity
                              </label>
                              <div className="col-sm-9">
                                <input
                                  className="form-control"
                                  type="text"
                                  value={quantity}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    // Only allow digits and ensure length is no more than 5
                                    if (/^\d{0,5}$/.test(newValue)) {
                                      // regex allows only digits, with max 5 digits
                                      setQuantity(newValue);
                                    }
                                  }}
                                  placeholder="Quantity"
                                  required
                                />
                              </div>
                            </div>

                  
                            {/* Price */}
                            <div className="mb-4 row align-items-center">
                              <label className="form-label-title col-sm-3 mb-0">
                                Price
                              </label>
                              <div className="col-sm-9">
                                <input
                                  className="form-control"
                                  type="text"
                                  value={price}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    // Only allow digits and ensure length is no more than 6
                                    if (/^\d{0,6}$/.test(newValue)) {
                                      // regex allows only digits, with max 6 digits
                                      setPrice(newValue);
                                    }
                                  }}
                                  placeholder="Price"
                                  required
                                />
                              </div>
                            </div>

                            {/* Exchangeable */}
                            <div className="mb-4 row align-items-center">
                              <label className="col-sm-3 col-form-label form-label-title">
                                Exchangeable
                              </label>
                              <div className="col-sm-9">
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={exchangeable}
                                    onChange={(e) =>
                                      setExchangeable(e.target.checked)
                                    }
                                  />
                                  <span className="switch-state"></span>
                                </label>
                              </div>
                            </div>

                            {/* Refundable */}
                            <div className="mb-4 row align-items-center">
                              <label className="col-sm-3 col-form-label form-label-title">
                                Refundable
                              </label>
                              <div className="col-sm-9">
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={refundable}
                                    onChange={(e) =>
                                      setRefundable(e.target.checked)
                                    }
                                  />
                                  <span className="switch-state"></span>
                                </label>
                              </div>
                            </div>

                            {/* Description */}
                            <div className="mb-4 row align-items-center">
                              <label className="form-label-title col-sm-3 mb-0">
                                Description
                              </label>
                              <div className="col-sm-9">
                                <textarea
                                  className="form-control"
                                  value={productDescription}
                                  onChange={(e) =>
                                    setProductDescription(e.target.value)
                                  }
                                  placeholder="Product Description"
                                  required
                                ></textarea>
                              </div>
                            </div>

                            {/* Image 1 */}
                            <div className="mb-4 row align-items-center">
                              <label className="form-label-title col-sm-3 mb-0">
                                Image 1 (JPG/PNG)
                              </label>
                              <div className="col-sm-9">
                                <input
                                  type="file"
                                  accept="image/jpg, image/png"
                                  onChange={(e) => setImage1(e.target.files[0])}
                                  className="form-control"
                                />
                              </div>
                            </div>

                            {/* Image 2 */}
                            <div className="mb-4 row align-items-center">
                              <label className="form-label-title col-sm-3 mb-0">
                                Image 2 (JPG/PNG)
                              </label>
                              <div className="col-sm-9">
                                <input
                                  type="file"
                                  accept="image/jpg, image/png"
                                  onChange={(e) => setImage2(e.target.files[0])}
                                  className="form-control"
                                />
                              </div>
                            </div>

                            {/* Submit Button */}
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
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
