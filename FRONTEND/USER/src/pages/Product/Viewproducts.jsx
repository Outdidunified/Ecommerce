import React, { useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import Mobileview from "../../Components/Mobileview";
import { useCart } from "../../Utilities/CartContext";

const Viewproducts = ({ handleLogout, userdata }) => {
  const location = useLocation();
  const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
  const { product } = location.state || {}; // Access the product data from the state
  const { fetchCartItems, cartCount } = useCart();




    useEffect(() => {
      // Set a timeout to stop the loader after 2 seconds
      const timer = setTimeout(() => {
        setIsLoading(false); // Hide loader and show content
      }, 1000); // 1 second delay

      fetchCartItems(); // Fetch cart items when the component mounts
  
      // Cleanup the timeout on component unmount
      return () => clearTimeout(timer);
    }, [fetchCartItems]);

  // State to manage quantity
  const [quantity, ] = useState(1); // Default quantity is 1

  // Map 1/0 to "Yes" or "No" for exchangable and refundable
  // const isExchangable = product.exchangable === 1 ? 'Yes' : 'No';
  // const isRefundable = product.refundable === 1 ? 'Yes' : 'No';

  // Handle quantity change
  // const handleQuantityChange = (event) => {
  //   const value = parseInt(event.target.value, 10);
  //   if (value > 0) {
  //     setQuantity(value); // Only update if the value is greater than 0
  //   }
  // };

  // Handle increment and decrement
  // const handleIncrement = () => setQuantity(prev => prev + 1);
  // const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1)); // Prevent going below 1

  const handleClick = async (product) => {
    const storedToken = localStorage.getItem("authToken"); // Get the token from localStorage
    const isLoggedIn = storedToken !== null;

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
      // Sending POST request to add product to the cart
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
    
      if (response.status === 200) {
        // Handle success response
        console.log("Product added to cart:", response.data);
        fetchCartItems(); 
    
        // Show success toast notification
        toast.success("Product added to cart successfully!", {
          position: "top-center",
          autoClose: 3000, // Auto-close after 3 seconds
        });
      }  else {
        // Handle unexpected status codes
        toast.error("Something went wrong. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Invalid request.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        console.error("Error adding product to cart:", error);
        toast.error("An error occurred while adding the product to the cart.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
    
  };

  return (
    <div>
      {isLoading ? (
          <div className="fullpage-loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <>
        <Header handleLogout={handleLogout} userdata={userdata} cartCount={cartCount}  />
        <Mobileview userdata={userdata}/>

<div className="mobile-menu d-md-none d-block mobile-cart">
  {/* Your mobile menu */}
</div>

<section className="breadcrumb-section pt-0">
  <div className="container-fluid-lg">
    <div className="row">
      <div className="col-12">
        <div className="breadcrumb-contain">
          <h2>{product.product_name}</h2>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Product Left Sidebar Start */}
<section className="product-section">
  <div className="container-fluid-lg">
    <div className="row">
      <div className="col-xxl-9 col-xl-8 col-lg-7 wow fadeInUp">
        <div className="row g-4">
          <div className="col-xl-6 wow fadeInUp">
            <div className="product-left-box">
              <div className="row g-sm-4 g-2">
                <div className="col-12">
                  <div className="product-main no-arrow">
                    <div>
                      <div className="slider-image mb-5">
                      <img
                    src={
                      product.image &&
                      product.image !== "/uploads/null"
                        ? product.image
                        : "/images/placeholder.jpg"
                    }
                    alt={
                      product.product_name ||
                      "Product image"
                    }
                    className="img-fluid"
                   
                  />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 wow fadeInUp">
            <div className="right-box-contain">
              <h2 className="name">{product.product_name}</h2>
              <div className="price-rating">
                <h3 className="theme-color price">
                  Rs.{product.price}
                </h3>
              </div>

              <div className="product-contain">
                <p className="w-100">{product.description}</p>
              </div>
              <div className="product-contain">
  {product.quantity > 0 ? (
    <p className="text-success fw-bold"> Available Quantity: {product.quantity}</p>
  ) : (
    <p className="alert alert-danger py-1 px-3 d-inline-block">
      <i className="fas fa-exclamation-triangle me-2"></i> Out of Stock
    </p>
  )}
</div>




              {/* <div className="product-package">
                <div className="product-title">
                  <p><strong>Is Exchangable:</strong> {isExchangable}</p>
                  <p><strong>Is Refundable:</strong> {isRefundable}</p>
                </div>
              </div> */}

              <div className="note-box product-package">
                {/* <div className="cart_qty qty-box product-qty">
                  <div className="input-group">
                    <button
                      type="button"
                      className="qty-left-minus"
                      onClick={handleDecrement}
                    >
                      <i className="fa fa-minus"></i>
                    </button>
                    <input
                      className="form-control input-number qty-input"
                      type="number"
                      name="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                    <button
                      type="button"
                      className="qty-right-plus"
                      onClick={handleIncrement}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                  </div>
                </div> */}

                <button
                  onClick={() => handleClick(product)}
                  className="btn btn-md bg-dark cart-button text-white w-100 mb-3"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<ToastContainer />
<Footer className="section-t-space" />
        </>
      )}
      
    </div>
  );
};

export default Viewproducts;
