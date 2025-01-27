import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { ToastContainer, toast } from "react-custom-alert";
import { useNavigate } from "react-router-dom";
import "react-custom-alert/dist/index.css";
import Mobileview from "../Components/Mobileview";

const Profile = ({ handleLogout, userdata }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [, setLoading] = useState(true);

    const navigate = useNavigate();
  const [, setError] = useState(null);
  const user_id = userdata.user_id; // Ensure userdata.user_id is available

 
  const [username, setUsername] = useState(""); // Manage username separately
  const [username1, setUsername1] = useState(""); // Manage username separately

  const [phone, setphone] = useState(""); // Manage username separately
  const [address, setaddress] = useState(""); // Manage username separately
  const [pincode, setpincode] = useState(""); // Manage username separately
  const [country, setcountry] = useState(""); // Manage username separately
  const [state, setstate] = useState(""); // Manage username separately
  const [email_id, setemail_id] = useState(""); // Manage username separately
  const [total_orders, settotal_orders] = useState(""); // Manage username separately
  const [pending_orders, setpending_orders] = useState(""); // Manage username separately
  const [total_cart_items, settotal_cart_items] = useState(""); // Manage username separately


  


  useEffect(() => {
  
    // Fetch user details function
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/user/getUserDetails/${user_id}`);
        const details = (response.data.user_summary);
        setUsername(details.username)
        setUsername1(details.username)
        setphone(details.phone)
        setaddress(details.address)
        setpincode(details.pincode)
        setcountry(details.country)
        setstate(details.state)
        setemail_id(details.email_id)
        settotal_orders(details.total_orders)
        setpending_orders(details.pending_orders)
        settotal_cart_items(details.total_cart_items)
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to fetch user details");
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchUserDetails(); // Call the function

    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader and show content
    }, 1000); // 1 second delay

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timer);
  }, [user_id]); // Re-run only when user_id changes




const handleSubmit = async (e,fetchUserDetails) => {
  e.preventDefault();

  try {
    const response = await axios.put(
      "/user/update",
      {
        username: username,
        phone: phone,
        address: address,
        pincode: pincode,
        country: country,
        state: state,
        user_id: userdata.user_id,
        modified_by: userdata.user_name,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (response.status === 200) {
      toast.success("User details updated successfully!");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      toast.error("Failed to update user details.");
    }
  } catch (error) {
    console.error("Error updating user details:", error);

    // Display the backend error message if available
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(`Error: ${error.response.data.message}`);
    } else {
      // Generic error message
      toast.error("An error occurred while updating user details.");
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
          <Header handleLogout={handleLogout} userdata={userdata} />
          {/* mobile fix menu start */}
       <Mobileview userdata={userdata}/>
          {/* mobile fix menu end */}

          {/* Breadcrumb Section Start */}
          <section class="breadcrumb-section pt-0">
            <div class="container-fluid-lg">
              <div class="row">
                <div class="col-12">
                  <div class="breadcrumb-contain">
                    <h2>User Dashboard</h2>
                    <nav>
                      <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                          <a href="index.html">
                            <i class="fa-solid fa-house"></i>
                          </a>
                        </li>
                        <li class="breadcrumb-item active">User Dashboard</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Breadcrumb Section End */}

          {/* User Dashboard Section Start */}
          <section class="user-dashboard-section section-b-space">
            <div class="container-fluid-lg">
              <div class="row">
                <div class="col-xxl-3 col-lg-4">
                  <div class="dashboard-left-sidebar">
                    <div class="close-button d-flex d-lg-none">
                      <button class="close-sidebar">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <div class="profile-box">
                      <div class="cover-image">
                        <img
                          src="../assets/images/inner-page/cover-img.jpg"
                          class="img-fluid blur-up lazyload"
                          alt=""
                        />
                      </div>

                      <div class="profile-contain">
                        <div class="profile-name">
                          <h3>{username1}</h3>
                          <h6 class="text-content">{email_id}</h6>
                        </div>
                      </div>
                    </div>

                    <ul
                      class="nav nav-pills user-nav-pills"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li class="nav-item" role="presentation">
                        <button
                          class="nav-link active"
                          id="pills-dashboard-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-dashboard"
                          type="button"
                        >
                          <i data-feather="home"></i>
                          DashBoard
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="col-xxl-9 col-lg-8">
                  <button class="btn left-dashboard-show btn-animation btn-md fw-bold d-block mb-4 d-lg-none">
                    Show Menu
                  </button>
                  <div class="dashboard-right-sidebar">
                    <div class="tab-content" id="pills-tabContent">
                      <div
                        class="tab-pane fade show active"
                        id="pills-dashboard"
                        role="tabpanel"
                      >
                        <div class="dashboard-home">
                          <div class="title">
                            <h2>My Dashboard</h2>
                            <span class="title-leaf">
                              <svg class="icon-width bg-gray">
                                <use href="../assets/svg/leaf.svg#leaf"></use>
                              </svg>
                            </span>
                          </div>

                          <div class="dashboard-user-name">
                            <h6 class="text-content">
                              Hello,{" "}
                              <b class="text-title">{username1}</b>
                            </h6>
                            <p class="text-content">
                              From your Dashboard you have the ability to view a
                              snapshot of your recent account activity and
                              update your account information. Select a link
                              below to view or edit information.
                            </p>
                          </div>

                          <div class="total-box">
                            <div class="row g-sm-4 g-3">
                              <div class="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                                <div class="total-contain">
                                  <img
                                    src="../assets/images/svg/order.svg"
                                    class="img-1 blur-up lazyload"
                                    alt=""
                                  />
                                  <img
                                    src="../assets/images/svg/order.svg"
                                    class="blur-up lazyload"
                                    alt=""
                                  />
                                  <div class="total-detail">
                                    <h5>Total Order</h5>
                                    <h3>{total_orders}</h3>
                                  </div>
                                </div>
                              </div>

                              <div class="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                                <div class="total-contain">
                                  <img
                                    src="../assets/images/svg/pending.svg"
                                    class="img-1 blur-up lazyload"
                                    alt=""
                                  />
                                  <img
                                    src="../assets/images/svg/pending.svg"
                                    class="blur-up lazyload"
                                    alt=""
                                  />
                                  <div class="total-detail">
                                    <h5>Total Pending Order</h5>
                                    <h3>{pending_orders}</h3>
                                  </div>
                                </div>
                              </div>

                              <div class="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                                <div class="total-contain">
                                  <img
                                    src="../assets/images/svg/wishlist.svg"
                                    class="img-1 blur-up lazyload"
                                    alt=""
                                  />
                                  <img
                                    src="../assets/images/svg/wishlist.svg"
                                    class="blur-up lazyload"
                                    alt=""
                                  />
                                  <div className="total-detail">
                                    <h5>Total Cart items</h5>
                                    <h3>
                                      {total_cart_items ?? 0}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <form onSubmit={handleSubmit}>
          <div className="dashboard-title">
            <h3>Account Information</h3>
          </div>

          <div className="row g-4">
            <div className="col-xxl-6">
              <div className="dashboard-content-title">
                <h4>Username</h4>
              </div>
              <div className="dashboard-detail">
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  name="username"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="col-xxl-6">
              <div className="dashboard-content-title">
                <h4>Phone</h4>
              </div>
              <div className="dashboard-detail">
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  name="phone"
                  id="phone"
                  onChange={(e) => {
                    const phoneValue = setphone(e.target.value);
                    if (/^\d{0,10}$/.test(phoneValue)) {
                      
                    }
                  }}
                />
              </div>
            </div>

            <div className="col-xxl-6">
              <div className="dashboard-content-title">
                <h4>Address</h4>
              </div>
              <div className="dashboard-detail">
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  name="address"
                  id="address"
                  onChange={(e) => setaddress(e.target.value)}
                />
              </div>
            </div>

            <div className="col-xxl-6">
              <div className="dashboard-content-title">
                <h4>Pincode</h4>
              </div>
              <div className="dashboard-detail">
                <input
                  type="text"
                  className="form-control"
                  value={pincode}
                  name="pincode"
                  id="pincode"
                  onChange={(e) => {
                    const pincodeValue = setpincode(e.target.value);
                    if (/^\d{0,6}$/.test(pincodeValue)) {
                     
                    }
                  }}
                />
              </div>
            </div>

            <div className="col-xxl-6">
              <div className="dashboard-content-title">
                <h4>Country</h4>
              </div>
              <div className="dashboard-detail">
                <input
                  type="text"
                  className="form-control"
                  value={country}
                  name="country"
                  id="country"
                  onChange={(e) => setcountry(e.target.value)}
                />
              </div>
            </div>

            <div className="col-xxl-6">
              <div className="dashboard-content-title">
                <h4>State</h4>
              </div>
              <div className="dashboard-detail">
                <input
                  type="text"
                  className="form-control"
                  value={state}
                  name="state"
                  id="state"
                  onChange={(e) => setstate(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12">
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-animation proceed-btn fw-bold"
                  style={{
                    color: "white",
                    backgroundColor: "#4CAF50",
                    padding: "10px 20px",
                  }}
                >
                  Submit
                </button>
              </div>
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
          </section>
          <ToastContainer/>
          {/* User Dashboard Section End */}
          <Footer />
        </>
      )}
    </div>
  );
};

export default Profile;
