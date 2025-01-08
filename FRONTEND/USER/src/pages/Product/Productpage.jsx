import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../Components/Header';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../../Components/Footer';
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Utilities/CartContext";
import Mobileview from '../../Components/Mobileview';


const Productpage = ({ handleLogout, userdata }) => {
  const location = useLocation();
  const { subCategoryId, subCategoryName } = location.state || {}; // Extract data from state
  const navigate = useNavigate();
         const { fetchCartItems } = useCart();
         
  
  const [quantity, ] = useState(1); // State to store the quantity
  const isLoggedIn = userdata && userdata.user_name;

  const [productData, setProductData] = useState(null); // Store product data
  const [loading, ] = useState(true); // Track loading state

  useEffect(() => {
    if (subCategoryId) {
      const fetchProductData = async () => {
        try {
          // Make the API call to fetch product data for the given subCategoryId
          const response = await axios.post('/product/id', {
            sub_category_id: subCategoryId ,
          });
  
          // Assuming the response has a 'products' array
          setProductData(response.data.products || []); // Make sure it's an array
          
        } catch (err) {
         
          toast.error('Failed to load product data');
        }
      };
      fetchCartItems(); 
  
      fetchProductData(); // Call the API when component mounts
      
    }
  }, [subCategoryId,fetchCartItems]); // Dependency on subCategoryId to trigger when it changes

  const handleClick = async (product) => {
    const storedToken = localStorage.getItem("authToken"); // Get the token from localStorage
  
    // Check if the user is logged in
    if (!isLoggedIn) {
      toast.info(
        <div>
          <span>Please log in to add products to your cart.</span>
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
      return; // Stop the execution here if the user is not logged in
    }
  
    try {
      // Sending POST request to add product to the cart with the token in the headers
      const response = await axios.post(
        "/cart/addtocart",
        {
          user_id: "21", // Replace with actual user ID
          product_id: product.product_id, // Product ID from the product object
          quantity: quantity, // Quantity from the state
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`, // Send token in Authorization header
          },
        }
      );
  
      // Handle success response if needed
      console.log("Product added to cart:", response.data);
      fetchCartItems(); 
  
      // Show success toast notification
      toast.success("Product added to cart successfully!", {
        position: "top-center",
        autoClose: 3000, // Auto-close after 3 seconds
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
  
      // Show error toast notification
      toast.error("Product already added to cart", {
        position: "top-center",
        autoClose: 3000, // Auto-close after 3 seconds
      });
    }
  };

  return (
    <div>
      <Header handleLogout={handleLogout} userdata={userdata} />
      <Mobileview userdata={userdata}/>
      <section className="breadcrumb-section pt-0">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumb-contain">
                <h2>{subCategoryName}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-b-space shop-section">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">

              {loading ? (
                <div className="fullpage-loader">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <div className="row g-sm-4 g-3 row-cols-xxl-5 row-cols-xl-3 row-cols-lg-2 row-cols-md-3 row-cols-2 product-list-section">
                  {productData && productData.length > 0 ? (
                    productData.map((product) => (
                      <div key={product.product_id}>
                        <div className="product-box-3 h-100 wow fadeInUp">
                          <div className="product-header">
                            <div className="product-image">
                              <Link to="/viewproducts" state={{ product }}>
                                <img
                                  src={product.image || '../assets/images/cake/product/2.png'}
                                  className="img-fluid blur-up lazyload"
                                  alt={product.product_name}
                                />
                              </Link>
                            </div>
                          </div>
                          <div className="product-footer">
                            <div className="product-detail">
                              <span className="span-name">{product.unit}</span>
                              <Link to="/viewproducts" state={{ product }}>
                                <h5 className="name">{product.product_name}</h5>
                              </Link>
                              <p className="text-content mt-1 mb-2 product-content">{product.description}</p>
                              <h6 className="unit">{product.unit}</h6>
                              <h5 className="price">
                                <span className="theme-color">Rs.{product.price}</span>
                              </h5>
                              <div className="add-to-cart-box bg-white">
                                <button className="btn btn-add-cart addcart-button" onClick={() => handleClick(product)}>
                                  Add
                                  <span className="add-icon bg-light-gray">
                                    <i className="fa-solid fa-plus"></i>
                                  </span>
                                </button>
                                <div className="cart_qty qty-box">
                                  <div className="input-group bg-white">
                                    <button type="button" className="qty-left-minus bg-gray" data-type="minus">
                                      <i className="fa fa-minus"></i>
                                    </button>
                                    <input className="form-control input-number qty-input" type="text" name="quantity" value={quantity} />
                                    <button type="button" className="qty-right-plus bg-gray" data-type="plus">
                                      <i className="fa fa-plus"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="alert alert-warning text-center">
                      <strong>No Products available</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Productpage;
