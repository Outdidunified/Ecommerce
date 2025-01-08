import React from 'react';

import Sidebar from '../Components/Sidebar/Sidebar';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/footer';

const Dashboard = ({handleLogout,token,adminData}) => {
      console.log(token);
        console.log(adminData);

    return (
        <div>
          
         {/* page-wrapper Start*/}
    <div class="page-wrapper compact-wrapper" id="pageWrapper">
     {/* Page Header Start*/}<Header handleLogout={handleLogout} adminData={adminData} />
     {/* Page Header Ends*/}

     {/* Page Body Start*/}
        <div class="page-body-wrapper">
         {/* Page Sidebar Start*/}
         <Sidebar adminData={adminData} />
         {/* Page Sidebar Ends*/}

         {/* index body start */}
            <div class="page-body">
                <div class="container-fluid">
                    <div class="row">
                     {/* chart caard section start */}
                        <div class="col-sm-6 col-xxl-3 col-lg-6">
                            <div class="main-tiles border-5 border-0  card-hover card o-hidden">
                                <div class="custome-1-bg b-r-4 card-body">
                                    <div class="media align-items-center static-top-widget">
                                        <div class="media-body p-0">
                                            <span class="m-0">Total Revenue</span>
                                            <h4 class="mb-0 counter">$6659
                                                <span class="badge badge-light-primary grow">
                                                    <i data-feather="trending-up"></i>8.5%</span>
                                            </h4>
                                        </div>
                                        <div class="align-self-center text-center">
                                            <i class="ri-database-2-line"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6 col-xxl-3 col-lg-6">
                            <div class="main-tiles border-5 card-hover border-0 card o-hidden">
                                <div class="custome-2-bg b-r-4 card-body">
                                    <div class="media static-top-widget">
                                        <div class="media-body p-0">
                                            <span class="m-0">Total Orders</span>
                                            <h4 class="mb-0 counter">9856
                                                <span class="badge badge-light-danger grow">
                                                    <i data-feather="trending-down"></i>8.5%</span>
                                            </h4>
                                        </div>
                                        <div class="align-self-center text-center">
                                            <i class="ri-shopping-bag-3-line"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6 col-xxl-3 col-lg-6">
                            <div class="main-tiles border-5 card-hover border-0  card o-hidden">
                                <div class="custome-3-bg b-r-4 card-body">
                                    <div class="media static-top-widget">
                                        <div class="media-body p-0">
                                            <span class="m-0">Total Products</span>
                                            <h4 class="mb-0 counter">893
                                                <a href="add-new-product.html" class="badge badge-light-secondary grow">
                                                    ADD NEW</a>
                                            </h4>
                                        </div>

                                        <div class="align-self-center text-center">
                                            <i class="ri-chat-3-line"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6 col-xxl-3 col-lg-6">
                            <div class="main-tiles border-5 card-hover border-0 card o-hidden">
                                <div class="custome-4-bg b-r-4 card-body">
                                    <div class="media static-top-widget">
                                        <div class="media-body p-0">
                                            <span class="m-0">Total Customers</span>
                                            <h4 class="mb-0 counter">4.6k
                                                <span class="badge badge-light-success grow">
                                                    <i data-feather="trending-down"></i>8.5%</span>
                                            </h4>
                                        </div>

                                        <div class="align-self-center text-center">
                                            <i class="ri-user-add-line"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                     {/* chart card section End */}

                    </div>
                </div>
            

             {/* footer start*/}
             <Footer/>
                
             {/* footer End*/}
            </div>
         {/* index body end */}

        </div>
     {/* Page Body End */}
    </div>
 {/* page-wrapper End*/}
        </div>
    );
};

export default Dashboard;

