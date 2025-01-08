import React, { useEffect, useState } from "react";
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import axios from 'axios';
import { useCart } from "../Utilities/CartContext";
import { useLocation,Link,useNavigate} from "react-router-dom";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import Mobileview from "../Components/Mobileview";
 

const Search = ({ handleLogout, userdata }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { fetchCartItems, cartCount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const { products } = location.state || { products: [] };
    const isLoggedIn = userdata && userdata.user_name;
    const [quantity, ] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
  
      return () => clearTimeout(timer);
    }, []);
  
    const handleClick = async (product) => {
      const storedToken = localStorage.getItem("authToken");
  
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
            autoClose: false,
            closeButton: false,
          }
        );
        return;
      }
  
      try {
        const response = await axios.post(
          "/cart/addtocart",
          {
            user_id: "21",
            product_id: product.product_id,
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
  
        console.log("Product added to cart:", response.data);
        fetchCartItems();
  
        toast.success("Product added to cart successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Error adding product to cart:", error);
  
        toast.error("Product already added to cart", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };
  
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        toast.error("Please enter a search query.");
        return;
      }
  
      try {
        const response = await axios.post("/product/search", { searchQuery });
  
        if (response.status === 200 && response.data) {
          // If already on the search page, update the products
          if (location.pathname === "/search") {
            navigate("/search", { state: { products: response.data.products } });
          } else {
            // Navigate to the search page with the results
            navigate("/search", { state: { products: response.data.products } });
          }
        } else {
          toast.error("No products found.");
        }
      } catch (error) {
        console.error("Error during search:", error);
  
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
        ):(
            <>
             <Header handleLogout={handleLogout} userdata={userdata}cartCount={cartCount} />
         {/*mobile fix menu start */}
    <Mobileview userdata={userdata}/>
{/*mobile fix menu end */}

{/*Breadcrumb Section Start */}
    <section class="breadcrumb-section pt-0">
        <div class="container-fluid-lg">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumb-contain">
                        <h2>Search</h2>
                        <nav>
                            <ol class="breadcrumb mb-0">
                                <li class="breadcrumb-item">
                                    <a href="index.html">
                                        <i class="fa-solid fa-house"></i>
                                    </a>
                                </li>
                                <li class="breadcrumb-item active">Search</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </section>
{/*Breadcrumb Section End */}

{/*Search Bar Section Start */}
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
{/*Search Bar Section End */}

 <section className="section-b-space shop-section">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">

             
                <div className="row g-sm-4 g-3 row-cols-xxl-5 row-cols-xl-3 row-cols-lg-2 row-cols-md-3 row-cols-2 product-list-section">
                  {products && products.length > 0 ? (
                    products.map((product) => (
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
            
            </div>
          </div>
        </div>
      </section>
             <ToastContainer/>
             <Footer/>
            </>
        )}
    
      
    </div>
  )
}

export default Search
