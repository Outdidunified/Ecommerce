import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "../../Components/Header";
import { Link } from "react-router-dom";
import Footer from "../../Components/Footer";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Utilities/CartContext";
import Mobileview from "../../Components/Mobileview";


const Categorypage = ({ handleLogout, userdata }) => {
  const location = useLocation();
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [, setLoading] = useState(true);
  const isLoggedIn = userdata && userdata.user_name;
        const navigate = useNavigate();
    const [quantity, ] = useState(1); // State to store the quantity
     const [isLoading, setIsLoading] = useState(true);
            const { fetchCartItems } = useCart();

  // Destructure category data from the location state (safe check)
  const { categoryId, categoryName } = location.state || {};

  console.log("Category ID:", categoryId, "Category Name:", categoryName); // Log to check the state

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.post("/product/subcategorylist", {
          category_id: categoryId, // Send categoryId in the request body
        });

        if (Array.isArray(response.data.subcategories)) {
          setSubcategories(response.data.subcategories);
        } else {
          console.error("Invalid subcategories data structure:", response.data);
          setError("Invalid data structure received.");
          toast.error("Failed to fetch subcategories.");
        }
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setError("Failed to fetch subcategories.");
        toast.error("Failed to fetch subcategories.");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("/product"); // Replace with your API endpoint
        const fetchedProducts = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];

        // Filter products with product_id between 10 and 25
        const filteredProducts = fetchedProducts.filter(
          (product) => product.product_id >= 10 && product.product_id <= 25
        );

        setProducts(filteredProducts);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    fetchCartItems(); 

    fetchSubcategories();
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after 1 second
  }, 1000);

  return () => clearTimeout(timer);
  }, [categoryId,fetchCartItems]); // Runs when categoryId changes

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
      {isLoading ? (
         <div className="fullpage-loader">
         <span></span>
         <span></span>
         <span></span>
         <span></span>
         <span></span>
         <span></span>
     </div>
      ):(
        <> 
          <Header handleLogout={handleLogout} userdata={userdata} />
     <Mobileview userdata={userdata}/>
      <section class="breadcrumb-section pt-0 ">
        <div class="container-fluid-lg">
          <div class="row">
            <div class="col-12">
              <div class="breadcrumb-contain">
                <h2>Shop Category</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Shop Section Start */}
      <section className="section-b-space shop-section">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-custom-3">
              <div className="left-box wow fadeInUp">
                <div className="shop-left-sidebar">
                  <ul
                    className="nav nav-pills mb-3 custom-nav-tab"
                    id="pills-tab"
                    role="tablist"
                  >
                    {error ? (
                      <li className="nav-item">Error: {error}</li>
                    ) : subcategories.length === 0 ? (
                      <li className="no-categories-message">
                      <div className="alert alert-warning text-center">
                        <strong>No subcategory available</strong>
                      </div>
                    </li>
                    ) : (
                      subcategories.map((subcategory) => (
                        <li
                          className="nav-item"
                          role="presentation"
                          key={subcategory.sub_category_id}
                        >
                          <Link
                            className="nav-link"
                            to="/productpage"
                            state={{
                              subCategoryId: subcategory.sub_category_id,
                              subCategoryName: subcategory.sub_category_name,
                            }}
                          >
                            {subcategory.sub_category_name}
                            <i
                              className="fa-solid fa-angle-right"
                              style={{ marginLeft: "10px" }}
                            ></i>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-custom-">
              <div className="row g-sm-4 g-3 row-cols-xxl-4 row-cols-xl-3 row-cols-lg-2 row-cols-md-3 row-cols-2 product-list-section">
                {products.map((product) => (
                  <div key={product.product_id}>
                    <div className="product-box-3 h-100 wow fadeInUp">
                      <div className="product-header">
                        <div className="product-image">
                          <Link
                            to="/viewproducts"
                            state={{
                              product,
                            }}
                          >
                            <img
                              src={product.image}
                              className="img-fluid blur-up lazyload"
                              alt={product.product_name}
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="product-footer">
                        <div className="product-detail">
                          <span className="span-name">
                            {product.category_name}
                          </span>
                          <Link
                            to="/viewproducts"
                            state={{
                              product,
                            }}
                          >
                            <h5 className="name">{product.product_name}</h5>
                          </Link>
                          <p className="text-content mt-1 mb-2 product-content">
                            {product.description}
                          </p>
                          <h6 className="unit">{product.unit}</h6>
                          <h5 className="price">
                            <span className="theme-color">
                              ${product.price}
                            </span>{" "}
                            <del>${product.price * 1.5}</del>
                          </h5>
                          <div className="add-to-cart-box bg-white">
                            <button className="btn btn-add-cart addcart-button"
                            onClick={() => handleClick(product)} // Pass the product object
                            >
                              Add
                              <span className="add-icon bg-light-gray">
                                <i className="fa-solid fa-plus"></i>
                              </span>
                            </button>
                            <div className="cart_qty qty-box">
                              <div className="input-group bg-white">
                                <button
                                  type="button"
                                  className="qty-left-minus bg-gray"
                                  data-type="minus"
                                  data-field=""
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                                <input
                                  className="form-control input-number qty-input"
                                  type="text"
                                  name="quantity"
                                  value="0"
                                />
                                <button
                                  type="button"
                                  className="qty-right-plus bg-gray"
                                  data-type="plus"
                                  data-field=""
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />

      {/* Shop Section End */}
      <Footer />
        </>
      )}
    
    </div>
  );
};

export default Categorypage;
