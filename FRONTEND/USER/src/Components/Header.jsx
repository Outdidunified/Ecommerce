import React, { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import { useCart } from "../Utilities/CartContext";

const Header = ({ handleLogout, userdata }) => {
  const [categories, setCategories] = useState([]); // Initialize as an empty array
  const navigate = useNavigate();
  const { fetchCartItems, updateCartCount } = useCart();

  const { cartCount } = useCart();

  const isLoggedIn = userdata && userdata.user_name;

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/product/categoryname"); // Update with your actual API endpoint

        // Ensure categories is an array
        if (Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          console.error("Invalid categories data structure:", response.data);
          toast.error("Error fetching categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Error fetching categories:", err);
      }
    };

    fetchCartItems(); // Fetch cart items when the component mounts

    fetchCategories();
  }, [fetchCartItems]);

  const handleCartClick = () => {
    if (isLoggedIn) {
      // If the user is logged in, navigate to the cart page
      navigate("/addtocart");
    } else {
      updateCartCount(0);
      // Show a custom toast notification if not logged in
      toast.info(
        <div>
          <span>Please log in to view your cart.</span>
          <button
            style={{
              marginLeft: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "red",
            }}
            onClick={() => navigate("/login")}
          >
            Log In to continue
          </button>
        </div>,
        {
          position: "top-center",
          autoClose: false, // Don't auto close
          closeButton: false, // Hide default close button
        }
      );
    }
  };

  const handleNavigate = () => {
    if (isLoggedIn) {
      // If the user is logged in, navigate to the cart page
      navigate("/orders");
    } else {
      // Show a custom toast notification if not logged in
      toast.info(
        <div>
          <span>Please log in to view your cart.</span>
          <button
            style={{
              marginLeft: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "red",
            }}
            onClick={() => navigate("/login")}
          >
            Log In to continue
          </button>
        </div>,
        {
          position: "top-center",
          autoClose: false, // Don't auto close
          closeButton: false, // Hide default close button
        }
      );
    }
  };

  return (
    <div>
      <div class="bg-effect mb-2">
        {/* Header Start */}
        <header class="pb-md-4 pb-0">
          <div class="header-top">
            <div class="container-fluid-lg">
              <div class="row">
                <div class="col-xxl-3 d-xxl-block d-none">
                  <div class="top-left-header">
                    <i class="iconly-Location icli text-white"></i>
                    <span class="text-white">
                      1418 Riverwood Drive, CA 96052, US
                    </span>
                  </div>
                </div>

                <div class="col-xxl-6 col-lg-9 d-lg-block d-none">
                  <div class="header-offer">
                    <div class="notification-slider">
                      <div>
                        <div class="timer-notification">
                          <h6>
                            <strong class="me-1">Welcome to Fastkart!</strong>
                            Wrap new offers/gift every single day on Weekends.
                            <strong class="ms-1">
                              New Coupon Code: Fast024
                            </strong>
                          </h6>
                        </div>
                      </div>

                      <div>
                        <div class="timer-notification">
                          <h6>
                            Something you love is now on sale!
                            <a href="shop-left-sidebar.html" class="text-white">
                              Buy Now !
                            </a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

               
              </div>
            </div>
          </div>

          <div class="top-nav top-header sticky-header">
            <div class="container-fluid-lg">
              <div class="row">
                <div class="col-12">
                  <div class="navbar-top">
                    <a href="index.html" class="web-logo nav-logo">
                      <img
                        src="../assets/images/logo/1.png"
                        class="img-fluid blur-up lazyload"
                        alt=""
                      />
                    </a>

                    <div class="rightside-box">
                      <div class="search-full">
                        <div class="input-group">
                          <span class="input-group-text">
                            <FeatherIcon icon="search" />
                          </span>
                          <input
                            type="text"
                            class="form-control search-type"
                            placeholder="Search here.."
                          />
                          <span class="input-group-text close-search">
                            <FeatherIcon icon="x" />
                          </span>
                        </div>
                      </div>
                      <ul class="right-side-menu">
                        <li class="right-side">
                          <div class="delivery-login-box">
                            <div class="delivery-icon">
                              <div class="search-box">
                                <FeatherIcon icon="search" />
                              </div>
                            </div>
                          </div>
                        </li>
                        <li class="right-side">
                          <a href="contact-us.html" class="delivery-login-box">
                            <div class="delivery-icon">
                              <FeatherIcon icon="phone-call" />
                            </div>
                            <div class="delivery-detail">
                              <h6>24/7 Delivery</h6>
                              <h5>+91 888 104 2340</h5>
                            </div>
                          </a>
                        </li>
                        <li className="right-side">
                          <div className="onhover-dropdown header-badge">
                            <button
                              onClick={handleNavigate}
                              className="btn p-0 position-relative header-orders"
                              style={{ background: "none", border: "none" }}
                            >
                              <FeatherIcon icon="box" />
                            </button>
                          </div>
                        </li>
                        <li class="right-side">
                          <div className="onhover-dropdown header-badge">
                            <button
                              type="button"
                              className="btn p-0 position-relative header-wishlist"
                              onClick={handleCartClick}
                            >
                              <FeatherIcon icon="shopping-cart" />
                              <span className="position-absolute top-0 start-100 translate-middle badge">
                                {cartCount}
                                <span className="visually-hidden">
                                  {cartCount}
                                </span>
                              </span>
                            </button>
                          </div>
                        </li>
                        <li className="right-side onhover-dropdown">
                          <div className="delivery-login-box">
                            <div
                              className="delivery-icon"
                              style={{ cursor: "pointer" }}
                            >
                              <FeatherIcon icon="user" />
                            </div>
                            <div className="delivery-detail">
                              <h6>Hello,</h6>
                              {/* Display either user name or "My Account" */}
                              <h5>
                                {userdata ? userdata.user_name : "My Account"}
                              </h5>
                            </div>
                          </div>

                          <div className="onhover-div onhover-div-login">
                            <ul className="user-box-name">
                              {!userdata ? (
                                <>
                                  <li className="product-box-contain">
                                    <Link to="/login">Login</Link>
                                  </li>
                                  <li className="product-box-contain">
                                    <Link to="/register">Register</Link>
                                  </li>
                                  <li className="product-box-contain">
                                    <Link to="/forgotpassword">
                                      Forgot Password
                                    </Link>
                                  </li>
                                </>
                              ) : (
                                <li
                                  className="product-box-contain"
                                  onClick={handleLogout}
                                >
                                  Logout
                                </li>
                              )}
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="container-fluid-lg">
            <div class="row">
              <div class="col-12">
                <div class="header-nav">
                  <div className="header-nav-left">
                    <button className="dropdown-category">
                      <FeatherIcon icon="align-left" />
                      <span>All Categories</span>
                    </button>

                    <div className="category-dropdown">
                      <div className="category-title">
                        <h5>Categories</h5>
                        <button
                          type="button"
                          className="btn p-0 close-button text-content"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>

                      <ul className="category-list">
                        {categories.length === 0 ? (
                          <li>No categories available</li> // Fallback message when categories are empty
                        ) : (
                          categories.map((category) => (
                            <li
                              key={category.category_id}
                              className="onhover-category-list"
                            >
                              <Link
                                to="/categorypage"
                                state={{
                                  categoryId: category.category_id,
                                  categoryName: category.category_name,
                                }}
                                className="category-name"
                              >
                                <h6>{category.category_name}</h6>
                                <i className="fa-solid fa-angle-right"></i>
                              </Link>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Header End */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Header;
