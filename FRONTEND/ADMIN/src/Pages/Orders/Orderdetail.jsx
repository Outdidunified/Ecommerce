import React from 'react';
import 'remixicon/fonts/remixicon.css';
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/footer';

const Orderdetail = ({ handleLogout, adminData }) => {
    const location = useLocation(); // Access location object
    const order = location.state?.order; // Get the order data passed in state
    console.log(order);

    // Check if order exists
    if (!order) {
        return <div>No order found</div>;
    }

    // Render items list
    const renderItems = order.items.map((item, index) => (
        <tr className="table-order" key={index}>
            <td>
                <a href="javascript:void(0)">
                    <img
                        src={item.product_image}
                        className="img-fluid blur-up lazyload"
                        alt={item.product_name}
                    />
                </a>
            </td>
            <td>
                <p>Product Name</p>
                <h5>{item.product_name}</h5>
            </td>
            <td>
                <p>Quantity</p>
                <h5>{item.quantity}</h5>
            </td>
            <td>
                <p>Price</p>
                <h5>Rs.{item.price}</h5>
            </td>
        </tr>
    ));

    return (
        <div>
            {/*page-wrapper Start*/}
            <div className="page-wrapper compact-wrapper" id="pageWrapper">
                {/*Page Header Start*/}
                <Header handleLogout={handleLogout} adminData={adminData} />
                {/*Page Header Ends*/}

                {/*Page Body Start*/}
                <div className="page-body-wrapper">
                    {/*Page Sidebar Start*/}
                    <Sidebar />
                    {/*Page Sidebar Ends*/}

                    {/*Container-fluid starts*/}
                    <div className="page-body">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="title-header title-header-block package-card">
                                                <div>
                                                    <h5>Order #{order.order_id}</h5>
                                                </div>
                                                <div className="card-order-section">
                                                    <ul>
                                                        <li>{order.created_date} at 9:08 pm</li>
                                                        <li>{order.items.length} items</li>
                                                        <li>Total Rs.{order.total_price}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="bg-inner cart-section order-details-table">
                                                <div className="row g-4">
                                                    <div className="col-xl-8">
                                                        <div className="table-responsive table-details">
                                                            <table className="table cart-table table-borderless">
                                                                <thead>
                                                                    <tr>
                                                                        <th colSpan="2">Items</th>
                                                                        <th className="text-end" colSpan="2"></th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                                    {renderItems}
                                                                </tbody>

                                                                <tfoot>
                                                                
                                                                    

                                                                    <tr className="table-order">
                                                                        <td colSpan="3">
                                                                            <h4 className="theme-color fw-bold">Total Price :</h4>
                                                                        </td>
                                                                        <td>
                                                                            <h4 className="theme-color fw-bold">Rs.{order.total_price}</h4>
                                                                        </td>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                    </div>

                                                    <div className="col-xl-4">
                                                        <div className="order-success">
                                                            <div className="row g-4">
                                                                <h4>Summary</h4>
                                                                <ul className="order-details">
                                                                    <li>Order ID: {order.order_id}</li>
                                                                    <li>Order Date: {order.created_date}</li>
                                                                    <li>Order Total: Rs.{order.total_price}</li>
                                                                </ul>

                                                                <h4>Shipping Address</h4>
                                                                <ul className="order-details">
                                                                    <li>{order.delivery_name}</li>
                                                                    <li>{order.house_no}, {order.road_name}</li>
                                                                    <li>{order.city}, {order.state}, {order.pincode}</li>
                                                                    <li>Contact No. {order.contact_number}</li>
                                                                </ul>

                                                                <div className="payment-mode">
    <h4>Payment Method</h4>
    <p>Online Payment Only. Card/Net banking acceptance is available.</p>
</div>

                                                                <div className="delivery-sec">
                                                                    <h3>Expected Date of Delivery: <span>{order.expected_delivery_date || "TBA"}</span></h3>
                                                                    <Link
 
  to="/ordertracking" state={{  order }}
>
  Tracking
</Link>


                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container-fluid">
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
            {/*page-wrapper End*/}
        </div>
    );
};

export default Orderdetail;
