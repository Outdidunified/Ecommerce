import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Mobileview from "../../Components/Mobileview";

const Order = ({ handleLogout, userdata }) => {
   
    const [orders, setOrders] = useState([]);
    const [, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true); // Loader state
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate(); // Use the navigate hook

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userdata || !userdata.user_id) {
                console.error("User data not available.");
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`/order/myorders`, {
                    params: { user_id: userdata.user_id },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setOrders(response.data.orders); // Assuming the response contains an array of orders
                } else {
                    console.error("Failed to fetch orders");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
                setIsLoading(false); // Hide the loader after data is fetched
            }
        };

        if (userdata && token) {
            fetchOrders();
        }

        const timer = setTimeout(() => {
            setIsLoading(false); // Hide loader after 1 second
        }, 1000);

        return () => clearTimeout(timer);
    }, [userdata, token]);

    const handleOrderClick = (order) => {
        // Navigate to the /orderdetails page and pass the order data as state
        navigate("/orderdetails", { state: { order } });
    };

    return (
        <div>
            <Header handleLogout={handleLogout} userdata={userdata} />
            <Mobileview userdata={userdata}/>
            
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
              <section className="cart-section section-b-space">
    <div className="container-fluid-lg">
        <div className="row g-sm-4 g-3">
            <div className="col-xxl-12 col-lg-12">
                <div className="cart-table order-table order-table-2">
                    <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
                        <table className="table table-expanded mb-0" style={{ width: "100%" }}>
                            <tbody>
                                {orders
                                    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
                                    .map((order) => (
                                        <React.Fragment key={order.order_id}>
                                            {/* Order Row */}
                                            <tr onClick={() => handleOrderClick(order)} style={{ cursor: 'pointer' }}>
                                                <td className="product-detail" style={{ width: "30%" }}>
                                                    <div className="product border-0">
                                                        <a href="product.left-sidebar.html" className="product-image">
                                                            {order.items.length > 0 ? (
                                                                <img
                                                                    src={`${order.items[0].product_image}`}
                                                                    className="img-fluid blur-up lazyload"
                                                                    alt={order.items[0].product_name}
                                                                />
                                                            ) : (
                                                                <img
                                                                    src="../assets/images/vegetable/product/1.png"
                                                                    className="img-fluid blur-up lazyload"
                                                                    alt="No image available"
                                                                />
                                                            )}
                                                        </a>
                                                        <div className="product-detail">
                                                            <ul>
                                                                <li className="name">
                                                                    <a href="product-left-thumbnail.html">
                                                                        Order ID: {order.order_id}
                                                                    </a>
                                                                </li>
                                                                <li className="text-content">
                                                                    Sold By: {order.user_name}
                                                                </li>
                                                                <li className="text-content">
                                                                    Contact: {order.contact_number}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="order-id" style={{ width: "15%" }}>
                                                    <h4 className="table-title text-content">Order ID</h4>
                                                    <h6>{order.order_id}</h6>
                                                </td>

                                                <td className="quantity" style={{ width: "15%" }}>
                                                    <h4 className="table-title text-content">Order Status</h4>
                                                    <h4
                                                        className="text-title"
                                                        style={{
                                                            color:
                                                                order.order_status === "Pending"
                                                                    ? "yellow"
                                                                    : order.order_status === "Confirmed"
                                                                    ? "green"
                                                                    : order.order_status === "Failed"
                                                                    ? "red"
                                                                    : "blue",
                                                        }}
                                                    >
                                                        {order.order_status}
                                                    </h4>
                                                </td>

                                                <td className="address" style={{ width: "25%" }}>
                                                    <h4 className="table-title text-content">Address</h4>
                                                    <p>{`${order.house_no}, ${order.road_name}, ${order.city}, ${order.state}, ${order.pincode}`}</p>
                                                </td>

                                                <td className="expected-delivery" style={{ width: "15%" }}>
                                                    <h4 className="table-title text-content">Expected Delivery</h4>
                                                    <h6>{order.expected_delivery_date || "N/A"}</h6>
                                                </td>

                                                <td className="price" style={{ width: "15%" }}>
                                                    <h4 className="table-title text-content">Total Price</h4>
                                                    <h6 className="theme-color">Rs.{order.total_price}</h6>
                                                </td>
                                            </tr>

                                        </React.Fragment>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

            )}
            <Footer />
        </div>
    );
};

export default Order;
