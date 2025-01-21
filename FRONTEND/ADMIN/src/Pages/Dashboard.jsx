import React, { useState, useEffect } from 'react';

import Sidebar from '../Components/Sidebar/Sidebar';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/footer';

const Dashboard = ({ handleLogout, token, adminData }) => {
    const [orderSummary, setOrderSummary] = useState({
        total_orders: 0,
        pending_orders: 0,
        total_customers: 0,
        total_products: 0,
    });

    useEffect(() => {
        // Fetch order summary data
        const fetchOrderSummary = async () => {
            try {
                const response = await fetch('/Orders/ordersummary', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch order summary');
                }

                const data = await response.json();
                if (data.message === 'Order summary fetched successfully') {
                    console.log(data);
                    setOrderSummary(data.order_summary);
                }
            } catch (error) {
                console.error('Error fetching order summary:', error);
            }
        };

        fetchOrderSummary();
    }, [token]);

    return (
        <div>
            {/* page-wrapper Start*/}
            <div className="page-wrapper compact-wrapper" id="pageWrapper">
                {/* Page Header Start */}
                <Header handleLogout={handleLogout} adminData={adminData} />
                {/* Page Header Ends */}

                {/* Page Body Start */}
                <div className="page-body-wrapper">
                    {/* Page Sidebar Start */}
                    <Sidebar adminData={adminData} />
                    {/* Page Sidebar Ends */}

                    {/* index body start */}
                    <div className="page-body">
                        <div className="container-fluid">
                            <div className="row">
                                {/* Chart card section start */}
                                <div className="col-sm-6 col-xxl-3 col-lg-6">
                                    <div className="main-tiles border-5 border-0 card-hover card o-hidden">
                                        <div className="custome-1-bg b-r-4 card-body">
                                            <div className="media align-items-center static-top-widget">
                                                <div className="media-body p-0">
                                                    <span className="m-0">Total Orders</span>
                                                    <h4 className="mb-0 counter">
                                                        {orderSummary.total_orders}
                                                    </h4>
                                                </div>
                                                <div className="align-self-center text-center">
                                                    <i className="ri-shopping-bag-3-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-xxl-3 col-lg-6">
                                    <div className="main-tiles border-5 card-hover border-0 card o-hidden">
                                        <div className="custome-2-bg b-r-4 card-body">
                                            <div className="media static-top-widget">
                                                <div className="media-body p-0">
                                                    <span className="m-0">Pending Orders</span>
                                                    <h4 className="mb-0 counter">
                                                        {orderSummary.pending_orders}
                                                    </h4>
                                                </div>
                                                <div className="align-self-center text-center">
                                                    <i className="ri-database-2-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-xxl-3 col-lg-6">
                                    <div className="main-tiles border-5 card-hover border-0 card o-hidden">
                                        <div className="custome-3-bg b-r-4 card-body">
                                            <div className="media static-top-widget">
                                                <div className="media-body p-0">
                                                    <span className="m-0">Total Products</span>
                                                    <h4 className="mb-0 counter">{orderSummary.total_products}</h4>
                                                </div>
                                                <div className="align-self-center text-center">
                                                    <i className="ri-chat-3-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-xxl-3 col-lg-6">
                                    <div className="main-tiles border-5 card-hover border-0 card o-hidden">
                                        <div className="custome-4-bg b-r-4 card-body">
                                            <div className="media static-top-widget">
                                                <div className="media-body p-0">
                                                    <span className="m-0">Total Customers</span>
                                                    <h4 className="mb-0 counter">{orderSummary.total_customers}</h4>
                                                </div>
                                                <div className="align-self-center text-center">
                                                    <i className="ri-user-add-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Chart card section End */}
                            </div>
                        </div>

                        {/* footer start */}
                        <Footer />
                        {/* footer End */}
                    </div>
                    {/* index body end */}
                </div>
                {/* Page Body End */}
            </div>
            {/* page-wrapper End */}
        </div>
    );
};

export default Dashboard;
