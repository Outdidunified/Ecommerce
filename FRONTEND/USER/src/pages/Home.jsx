import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Footer from "../Components/Footer";
import Mobileview from "../Components/Mobileview";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Utilities/CartContext";

const Home = ({ handleLogout, userdata }) => {
  const [products, setProducts] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const isLoggedIn = userdata && userdata.user_name;
  const navigate = useNavigate();
  const [quantity, ] = useState(1); // State to store the quantity
     const [isLoading, setIsLoading] = useState(true);
     const [searchQuery, setSearchQuery] = useState("");
      
       const { fetchCartItems, cartCount } = useCart();



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/product"); // Update with your API endpoint
        const fetchedProducts = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];
       
        setProducts(fetchedProducts);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCartItems(); // Fetch cart items when the component mounts
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after 1 second
   
  }, 1000);

  return () => clearTimeout(timer);
  }, [fetchCartItems]);

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
      
      fetchCartItems(); // This will trigger an update for the cart count

     

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

  const limitedProducts = products.slice(0, 15);

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

    fetchCategories();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query.");
      return;
    }

    try {
      const response = await axios.post(
        "/product/search",
        { searchQuery }
      );

      if (response.status === 200 && response.data) {
   
          navigate("/search", { state: { products: response.data.products } });
       
      } else {
        toast.error("No products found.");
      }
    } catch (error) {
      console.error("Error during search:", error);

      // Display backend error message if available
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("An error occurred while searching for products.");
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
        <Header handleLogout={handleLogout} userdata={userdata} cartCount={cartCount} />
   <Mobileview userdata={userdata}/>

 
      {/*Home Section Start */}
      <section class="home-section pt-2">
        <div class="container-fluid-lg">
          <div class="row g-4">
            <div class="col-xl-8 ratio_65">
              <div class="home-contain h-100">
                <div class="h-100">
                  <img
                    src="../assets/images/vegetable/banner/1.jpg"
                    class="bg-img blur-up lazyload"
                    alt=""
                  />
                </div>
                <div class="home-detail p-center-left w-75">
                  <div>
                    <h6>
                      Exclusive offer <span>30% Off</span>
                    </h6>
                    <h1 class="text-uppercase">
                      Stay home & delivered your{" "}
                      <span class="daily">Daily Needs</span>
                    </h1>
                    <p class="w-75 d-none d-sm-block">
                      Vegetables contain many vitamins and minerals that are
                      good for your health.
                    </p>
                    <button
                      onclick="location.href = 'shop-left-sidebar.html';"
                      class="btn btn-animation mt-xxl-4 mt-2 home-button mend-auto"
                    >
                      Shop Now <i class="fa-solid fa-right-long icon"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-4 ratio_65">
              <div class="row g-4">
                <div class="col-xl-12 col-md-6">
                  <div class="home-contain">
                    <img
                      src="../assets/images/vegetable/banner/2.jpg"
                      class="bg-img blur-up lazyload"
                      alt=""
                    />
                    <div class="home-detail p-center-left home-p-sm w-75">
                      <div>
                        <h2 class="mt-0 text-danger">
                          45% <span class="discount text-title">OFF</span>
                        </h2>
                        <h3 class="theme-color">Nut Collection</h3>
                        <p class="w-75">
                          We deliver organic vegetables & fruits
                        </p>
                        <a href="shop-left-sidebar.html" class="shop-button">
                          Shop Now <i class="fa-solid fa-right-long"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-xl-12 col-md-6">
                  <div class="home-contain">
                    <img
                      src="../assets/images/vegetable/banner/3.jpg"
                      class="bg-img blur-up lazyload"
                      alt=""
                    />
                    <div class="home-detail p-center-left home-p-sm w-75">
                      <div>
                        <h3 class="mt-0 theme-color fw-bold">Healthy Food</h3>
                        <h4 class="text-danger">Organic Market</h4>
                        <p class="organic">
                          Start your daily shopping with some Organic food
                        </p>
                        <a href="shop-left-sidebar.html" class="shop-button">
                          Shop Now <i class="fa-solid fa-right-long"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Home Section End */}
      <section className="search-section mb-3">
      <div className="container-fluid-lg">
        <div className="row">
          <div className="col-xxl-6 col-xl-8 mx-auto">
            <div className="title d-block text-center">
              <h2>Search for products</h2>
              <span className="title-leaf">
                <svg className="icon-width">
                  <use href="../assets/svg/leaf.svg#leaf"></use>
                </svg>
              </span>
            </div>

            <div className="search-box">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter search query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="btn theme-bg-color text-white m-0"
                  type="button"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* product section start*/}
      <section className="section-b-space">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-xxl-3 col-lg-4 d-none d-lg-block">
              <div className="category-menu menu-xl">
                <ul>
                  {categories.length === 0 ? (
                    <li className="no-categories-message">
                      <div className="alert alert-warning text-center">
                        <strong>No categories available</strong>
                      </div>
                    </li>
                  ) : (
                    categories.map((category) => (
                      <li key={category.category_id}>
                        <div className="category-list">
                          <h5>
                            <Link
                              to="/categorypage"
                              state={{
                                categoryId: category.category_id,
                                categoryName: category.category_name,
                              }}
                            >
                              {category.category_name}
                              <i
                                className="fa-solid fa-angle-right"
                                style={{ marginLeft: "10px" }}
                              ></i>
                            </Link>
                          </h5>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <div className="col-xxl-9 col-lg-8">
              <div className="title d-block">
                <h2 className="text-theme font-sm">Our Exclusive Products</h2>
              </div>
              <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-md-3 row-cols-2 g-sm-4 g-3 no-arrow section-b-space">
                {limitedProducts.map((product) => (
                  <div key={product.product_id} className="col">
                    <div className="product-box product-white-bg wow fadeIn">
                      <div className="product-image">
                        <Link
                          to="/viewproducts"
                          state={{
                            product,
                          }}
                        >
                          <img
                            src={
                              product.image && product.image !== "/uploads/null"
                                ? product.image
                                : "/images/placeholder.jpg"
                            }
                            alt={product.product_name || "Product image"}
                            className="img-fluid"
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                          />
                        </Link>
                      </div>

                      <div className="product-detail position-relative">
                        <Link to="/viewproducts" state={{ product }}>
                          <h6 className="name">{product.product_name}</h6>
                        </Link>
                        <h6 className="units">{product.unit}</h6>{" "}
                        {/* Display units */}
                        <h6 className="category">
                          {product.category_name}
                        </h6>{" "}
                        {/* Display category name */}
                        <h6 className="price theme-color">
                          Rs.{product.price}
                        </h6>
                        <div className="add-to-cart-btn-2 addtocart_btn">
                          <button
                            className="btn addcart-button btn buy-button"
                            onClick={() => handleClick(product)} // Pass the product object
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
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

      {/*product section end*/}
      <Footer />
      <ToastContainer />
        </>
      )}
      
    </div>
  );
};

export default Home;
