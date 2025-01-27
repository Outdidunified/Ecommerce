import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import { useCart } from "../../Utilities/CartContext";
import Mobileview from "../../Components/Mobileview";



const Addtocart = ({ handleLogout, userdata }) => {
  const [cartItems, setCartItems] = useState([]); // Initialize as an array
  const [, setLoading] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken"); // Retrieve token from local storage
  const [cartCount, setCartCount] = useState(0); // State for cart count
  //   const shippingCost = 6.9; // Example static shipping cost
  const { updateCartCount,fetchCartItems } = useCart(); // Destructure updateCartCount from useCart

  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    contact_number: "",
    pincode: "",
    city: "",
    state: "",
    house_no: "",
    road_name: "",
  });

  const calculateSubtotal = () =>
    cartItems.reduce((acc, item) => acc + item.total_price * item.quantity, 0);

  const subtotal = calculateSubtotal();
  //   const total = subtotal + shippingCost;
  const total = subtotal;

  useEffect(() => {
    
const fetchCartItems1 = async () => {
  try {
    setLoading(true);
    const response = await axios.get("/cart/getcart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (Array.isArray(response.data.cart)) {
      setCartItems(response.data.cart);
      const newCartCount = response.data.cart.length;
      updateCartCount(newCartCount); // Update cart count globally
    } else {
      console.error("Unexpected response format:", response.data);
      setError("Invalid cart data received.");
    }
  } catch (err) {
    console.error("Error fetching cart:", err);
    setError("Failed to load cart items.");
  } finally {
    setLoading(false);
  }
};

    fetchCartItems1();
    fetchCartItems();
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader and show content
    }, 1000); // 1 second delay

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timer);
  }, [token,fetchCartItems,updateCartCount]);

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    try {
      // Update state optimistically
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );

      // Optional: Make an API call to sync with the backend
      const response = await axios.patch("/cart/update", {
        cart_id: cartId,
        quantity: newQuantity,
      });

      if (!response.data.success) {
        console.error("Failed to update quantity in the backend");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  const handleRemoveItem = async (cartId, productId) => {
    try {
      if (!token) {
        console.error("No token found, please login again.");
        toast.error("You need to log in to remove an item.");
        return;
      }
  
      // Make the API call to remove the item from the cart
      const response = await axios.delete(`/cart/removefromcart`, {
        data: {
          product_id: productId, // Send product_id in the request body using 'data' for DELETE
        },
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the headers
        },
      });
  
      if (response.status === 200) {
        // Update state to remove the item from the cart
        setCartItems((prevItems) => {
          // Filter out the removed item
          const updatedItems = prevItems.filter((item) => item.cart_id !== cartId);
          
          // Decrement cart count based on updated items
          setCartCount(updatedItems.length); // Adjust cart count
  
          fetchCartItems(); // Fetch updated cart items
          return updatedItems;
        });
        toast.success("Item removed from cart successfully!");
      } else {
        console.error("Failed to remove item from the backend");
        toast.error("Failed to remove item. Please try again.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Error occurred while removing item.");
    }
  };
  
  

  const [, setIsProcessing] = useState(false); // State to manage loading state
  const handleProceedToBuy = async () => {
    // Validate the delivery address and total amount
    if (
      total === 0 ||
      !deliveryAddress.name ||
      !deliveryAddress.contact_number ||
      !deliveryAddress.pincode ||
      !deliveryAddress.city ||
      !deliveryAddress.state ||
      !deliveryAddress.house_no ||
      !deliveryAddress.road_name
    ) {
      return; // Don't proceed if the address or total is invalid
    }

    setIsProcessing(true); // Set processing to true to disable the button while sending the request

    const data = {
      user_id: userdata.user_id,
      delivery_address: {
        name: deliveryAddress.name,
        contact_number: deliveryAddress.contact_number,
        pincode: deliveryAddress.pincode,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        house_no: deliveryAddress.house_no,
        road_name: deliveryAddress.road_name,
      },
    };

    try {
      const response = await axios.post("/order/placeorderfromcart", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const razorpayData = response.data.payment_order;
        console.log("Received Razorpay Data:", razorpayData);

        const options = {
          key: "rzp_test_oHoZ3Q1fF6pYEI", // Replace with your Razorpay Key
          amount: razorpayData.amount, // Amount in paise (9900 = 99 INR)
          currency: razorpayData.currency, // INR as per your response
          name: "Fatkart",
          description: "Order Payment",
          order_id: razorpayData.id, // Razorpay order ID (order_PgAJCrqIKoMenq)
          handler: async function (paymentResponse) {
            console.log("Payment Successful", paymentResponse);

            // Prepare data for success scenario
            const paymentData = {
              razorpay_payment_id: razorpayData.id,
              order_id: response.data.order_id, // Use the order_id from the response
              razorpay_signature: response.data.payment_signature,
              user_id: userdata.user_id, // Assuming userdata contains the user info
            };

            try {
              const successResponse = await axios.post(
                "/order/paymentsuccess",
                paymentData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (successResponse.status === 200) {
                toast.success("Payment successful!");
                // Set a timeout of 1 second before navigating
                setTimeout(() => {
                  navigate("/orders");
                }, 1000); // 1000 ms = 1 second
              } else {
                toast.error(
                  "Payment success recorded, but there was an issue with backend."
                );
              }
            } catch (paymentError) {
              console.error(
                "Error sending payment success data:",
                paymentError
              );
              toast.error("Failed to send payment success data.");
            }
          },
          modal: {
            ondismiss: async function () {
              // Handle case when Razorpay modal is dismissed
              const failureData = {
                razorpay_payment_id: razorpayData.id,
                order_id: response.data.order_id, // Order ID from response
              };

              try {
                const failureResponse = await axios.post(
                  "/order/paymentfailure",
                  failureData,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (failureResponse.status === 200) {
                  toast.error("Payment failed. Please try again.");
                } else {
                  toast.error(
                    "Payment failure recorded, but there was an issue with backend."
                  );
                }
              } catch (paymentError) {
                console.error(
                  "Error sending payment failure data:",
                  paymentError
                );
                toast.error("Failed to send payment failure data.");
              }
            },
          },
          prefill: {
            name: deliveryAddress.name,
            email: userdata.email,
            contact: deliveryAddress.contact_number,
          },
          theme: {
            color: "#528FF0",
          },
        };

        // Open Razorpay modal
        console.log("Opening Razorpay with options:", options);
        const rzp = new window.Razorpay(options);
        rzp.open(); // Open Razorpay checkout
      }
    } catch (error) {
      console.error("Error placing the order:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  return (
    <div>
      {isLoading? (
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
      <Mobileview userdata={userdata}/>

      <section class="breadcrumb-section pt-0">
        <div class="container-fluid-lg">
          <div class="row">
            <div class="col-12">
              <div class="breadcrumb-contain">
                <h2>Cart</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cart-section section-b-space">
        <div className="container-fluid-lg">
          <div className="row g-sm-5 g-3">
            <div className="col-xxl-9">
              <div className="cart-table">
                <div className="table-responsive-xl">
                  {cartItems.length === 0 ? (
                    <div className="empty-cart-message text-center">
                      <h3>Your cart is empty</h3>
                    </div>
                  ) : (
                    <table className="table">
                      <tbody>
                        {cartItems.map((item) => (
                          <tr
                            key={item.cart_id}
                            className="product-box-contain"
                          >
                            <td className="product-detail">
                              <div className="product border-0">
                                <a
                                  href={`product-details/${item.product_id}`}
                                  className="product-image"
                                >
                                  <img
                                    src={`${
                                      item.image || "/default-image.png"
                                    }`} // Fallback image
                                    className="img-fluid blur-up lazyload"
                                    alt={item.product_name}
                                  />
                                </a>
                                <div className="product-detail">
                                  <ul>
                                    <li className="name">
                                      <a
                                        href={`product-details/${item.product_id}`}
                                      >
                                        {item.product_name}
                                      </a>
                                    </li>
                                    <li className="text-content">
                                      <span className="text-title">
                                        Description:
                                      </span>{" "}
                                      {item.description}
                                    </li>
                                    <li className="text-content">
                                      <span className="text-title">Unit:</span>{" "}
                                      {item.unit}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td className="quantity">
                              <h4 className="table-title text-content">Qty</h4>
                              <div className="quantity-price">
                                <div className="cart_qty">
                                  <div className="input-group">
                                    <button
                                      type="button"
                                      className="btn qty-left-minus"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.cart_id,
                                          item.quantity - 1
                                        )
                                      }
                                      disabled={item.quantity <= 1}
                                    >
                                      <i className="fa fa-minus ms-0"></i>
                                    </button>
                                    <input
                                      className="form-control input-number qty-input"
                                      type="text"
                                      name="quantity"
                                      value={item.quantity}
                                      readOnly
                                    />
                                    <button
                                      type="button"
                                      className="btn qty-right-plus"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.cart_id,
                                          item.quantity + 1
                                        )
                                      }
                                    >
                                      <i className="fa fa-plus ms-0"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="subtotal">
                              <h4 className="table-title text-content">
                                Total
                              </h4>
                              <h5>Rs.{item.total_price * item.quantity}</h5>
                            </td>
                            <td className="save-remove">
                              <h4 className="table-title text-content">
                                Action
                              </h4>
                              <button
                                className="btn btn-animation proceed-btn fw-bold"
                                style={{
                                  padding: "5px 10px", // Adjust padding
                                  fontSize: "12px", // Adjust font size
                                  borderRadius: "3px", // Optional: adjust border radius for rounded corners
                                }}
                                onClick={() =>
                                  handleRemoveItem(
                                    item.cart_id,
                                    item.product_id
                                  )
                                }
                              >
                                <i className="fa fa-trash me-2"></i> Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xxl-3">
              <div className="summery-box p-sticky">
                <div className="summery-header">
                  <h3>Cart Total</h3>
                </div>

                <div className="summery-contain">
                  <ul>
                    <li>
                      <h4>Subtotal</h4>
                      <h4 className="price">Rs.{subtotal.toFixed(2)}</h4>
                    </li>
                  </ul>

                  {/* Delivery Address Section */}
                  <div className="address-form">
                    <h4>Delivery Address</h4>
                    <form>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="form-control"
                          value={deliveryAddress.name}
                          onChange={(e) =>
                            setDeliveryAddress({
                              ...deliveryAddress,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="contact_number" className="form-label">
                          Contact Number
                        </label>
                        <input
                          type="text"
                          id="contact_number"
                          className="form-control"
                          value={deliveryAddress.contact_number}
                          onChange={(e) =>
                            setDeliveryAddress({
                              ...deliveryAddress,
                              contact_number: e.target.value,
                            })
                          }
                          placeholder="Enter your contact number"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="pincode" className="form-label">
                          Pincode
                        </label>
                        <input
                          type="text"
                          id="pincode"
                          className="form-control"
                          value={deliveryAddress.pincode}
                          onChange={(e) =>
                            setDeliveryAddress({
                              ...deliveryAddress,
                              pincode: e.target.value,
                            })
                          }
                          placeholder="Enter your pincode"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="city" className="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          className="form-control"
                          value={deliveryAddress.city}
                          onChange={(e) =>
                            setDeliveryAddress({
                              ...deliveryAddress,
                              city: e.target.value,
                            })
                          }
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="state" className="form-label">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          className="form-control"
                          value={deliveryAddress.state}
                          onChange={(e) =>
                            setDeliveryAddress({
                              ...deliveryAddress,
                              state: e.target.value,
                            })
                          }
                          placeholder="Enter your state"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="house_no" className="form-label">
                          House No.
                        </label>
                        <input
                          type="text"
                          id="house_no"
                          className="form-control"
                          value={deliveryAddress.house_no}
                          onChange={(e) =>
                            setDeliveryAddress({
                              ...deliveryAddress,
                              house_no: e.target.value,
                            })
                          }
                          placeholder="Enter your house number"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="road_name" className="form-label">
                          Road Name
                        </label>
                        <input
                          type="text"
                          id="road_name"
                          className="form-control"
                          value={deliveryAddress.road_name}
                          onChange={(e) =>
                            setDeliveryAddress({
                              ...deliveryAddress,
                              road_name: e.target.value,
                            })
                          }
                          placeholder="Enter your road name"
                        />
                      </div>
                    </form>
                  </div>
                </div>

                <ul className="summery-total">
                  <li className="list-total border-top-0">
                    <h4>Total (INR)</h4>
                    <h4 className="price theme-color">Rs.{total.toFixed(2)}</h4>
                  </li>
                </ul>

                <div className="button-group cart-button">
                  <ul>
                    <li>
                      <button
                        onClick={handleProceedToBuy}
                        className="btn btn-animation proceed-btn fw-bold"
                        disabled={
                          total === 0 ||
                          !deliveryAddress.name ||
                          !deliveryAddress.contact_number ||
                          !deliveryAddress.pincode ||
                          !deliveryAddress.city ||
                          !deliveryAddress.state ||
                          !deliveryAddress.house_no ||
                          !deliveryAddress.road_name
                        }
                      >
                        Proceed to Buy
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={() => (window.location.href = "/")} // Navigate to home (index.html)
                        className="btn btn-light shopping-button text-dark"
                      >
                        <i className="fa-solid fa-arrow-left-long"></i> Return
                        To Shopping
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer />

      <Footer />
        </>
      )}
     
    </div>
  );
};

export default Addtocart;
