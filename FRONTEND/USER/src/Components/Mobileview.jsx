import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

const Mobileview = ({ userdata }) => {
  const navigate = useNavigate();
  const isLoggedIn = userdata && userdata.user_name;
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // State for subcategories
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category

  const handleCartClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate('/addtocart');
    } else {
      toast.info(
        <div>
          <span>Please log in to view your cart.</span>
          <button
            style={{
              marginLeft: '10px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'red',
            }}
            onClick={() => navigate('/login')}
          >
            Log In to continue
          </button>
        </div>,
        {
          position: 'top-center',
          autoClose: false,
          closeButton: false,
        }
      );
    }
  };

  const handleMyOrdersClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate('/orders');
    } else {
      toast.info(
        <div>
          <span>Please log in to view your orders.</span>
          <button
            style={{
              marginLeft: '10px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'red',
            }}
            onClick={() => navigate('/login')}
          >
            Log In to continue
          </button>
        </div>,
        {
          position: 'top-center',
          autoClose: false,
          closeButton: false,
        }
      );
    }
  };

  const handleCategoryClick = async (e) => {
    e.preventDefault();
    setSidebarOpen(true);
    setError(null);
    setSelectedCategory(null); // Reset selected category

    try {
      const response = await axios.get('/product/categoryname');
      if (response.status === 200) {
        setCategories(response.data.categories || []);
      } else if (response.status === 400) {
        setError(response.data.message || 'Bad Request');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    }
  };

  const handleSubcategoryClick = async (categoryId) => {
    try {
      const response = await axios.post('/product/subcategorylist', {
        category_id: categoryId,
      });
      if (response.status === 200) {
        setSubcategories(response.data.subcategories);
      }
      setSelectedCategory(categoryId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subcategories');
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedCategory(null); // Reset selected category when closing sidebar
  };

  return (
    <div>
      <div className="mobile-menu d-md-none d-block mobile-cart">
        <ul>
          <li className="active">
            <Link to="/">
              <i className="iconly-Home icli"></i>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link onClick={handleMyOrdersClick}>
              <i className="iconly-Heart icli" />
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link to="/search">
              <i className="iconly-Search icli"></i>
              <span>Search</span>
            </Link>
          </li>
          <li>
            <Link onClick={handleCategoryClick}>
              <i className="iconly-Category icli js-link"></i>
              <span>Category</span>
            </Link>
          </li>
          <li>
            <Link onClick={handleCartClick}>
              <i className="iconly-Bag-2 icli fly-cate"></i>
              <span>Cart</span>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <FaUser className="icli" />
              <span>Account</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Sidebar Category Modal */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <button className="close-sidebar" onClick={closeSidebar}>
            &times;
          </button>

          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div>
              <h4 className="category-title">Available Categories</h4>
              <div className="category-list">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.category_id}>
                      <button
                        className="category-item"
                        onClick={() => {
                          handleSubcategoryClick(category.category_id); // Fetch subcategories on category click
                        }}
                      >
                        {category.category_name}
                      </button>

                      {/* Show subcategories below the category */}
                      {selectedCategory === category.category_id ? (
                        <div className="subcategory-list">
                          {subcategories.length > 0 ? (
                            subcategories.map((subcategory) => (
                              <button
                                key={subcategory.sub_category_id}
                                onClick={() => {
                                  closeSidebar(); // Close sidebar after selecting subcategory
                                  navigate('/productpage', {
                                    state: {
                                      subCategoryId: subcategory.sub_category_id,
                                      subCategoryName: subcategory.sub_category_name,
                                    },
                                  });
                                }}
                              >
                                {subcategory.sub_category_name}
                              </button>
                            ))
                          ) : (
                            <div className="subcategory-list">
                              <p>No subcategories found for this category.</p>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p>No categories found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Mobileview;
