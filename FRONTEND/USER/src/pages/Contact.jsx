import React, { useState, useEffect } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import Mobileview from '../Components/Mobileview'

const Contact = ({ handleLogout, userdata }) => {

  // State to track if content has loaded
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to stop the loader after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader and show content
    }, 1000); // 2 seconds delay

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (
        // Loader - will show until the isLoading state is false
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
          
          <Mobileview userdata={userdata}/>

          {/* Breadcrumb Section */}
          <section className="breadcrumb-section pt-0">
            <div className="container-fluid-lg">
              <div className="row">
                <div className="col-12">
                  <div className="breadcrumb-contain">
                    <h2>Contact Us</h2>
                    <nav>
                      <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                          <a href="index.html">
                            <i className="fa-solid fa-house"></i>
                          </a>
                        </li>
                        <li className="breadcrumb-item active">Contact Us</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Box Section */}
          <section className="contact-box-section">
            <div className="container-fluid-lg">
              <div className="row g-lg-5 g-3">
                <div className="col-lg-6">
                  <div className="left-sidebar-box">
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="contact-image">
                          <img src="../assets/images/inner-page/contact-us.png"
                            className="img-fluid blur-up lazyloaded" alt=""/>
                        </div>
                      </div>
                      <div className="col-xl-12">
                        <div className="contact-title">
                          <h3>Get In Touch</h3>
                        </div>

                        <div className="contact-detail">
                          <div className="row g-4">
                            <div className="col-xxl-6 col-lg-12 col-sm-6">
                              <div className="contact-detail-box">
                                <div className="contact-icon">
                                  <i className="fa-solid fa-phone"></i>
                                </div>
                                <div className="contact-detail-title">
                                  <h4>Phone</h4>
                                </div>

                                <div className="contact-detail-contain">
                                  <p>(+1) 618 190 496</p>
                                </div>
                              </div>
                            </div>

                            <div className="col-xxl-6 col-lg-12 col-sm-6">
                              <div className="contact-detail-box">
                                <div className="contact-icon">
                                  <i className="fa-solid fa-envelope"></i>
                                </div>
                                <div className="contact-detail-title">
                                  <h4>Email</h4>
                                </div>

                                <div className="contact-detail-contain">
                                  <p>geweto9420@chokxus.com</p>
                                </div>
                              </div>
                            </div>

                            <div className="col-xxl-6 col-lg-12 col-sm-6">
                              <div className="contact-detail-box">
                                <div className="contact-icon">
                                  <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <div className="contact-detail-title">
                                  <h4>London Office</h4>
                                </div>

                                <div className="contact-detail-contain">
                                  <p>Cruce Casa de Postas 29</p>
                                </div>
                              </div>
                            </div>

                            <div className="col-xxl-6 col-lg-12 col-sm-6">
                              <div className="contact-detail-box">
                                <div className="contact-icon">
                                  <i className="fa-solid fa-building"></i>
                                </div>
                                <div className="contact-detail-title">
                                  <h4>Bournemouth Office</h4>
                                </div>

                                <div className="contact-detail-contain">
                                  <p>Visitación de la Encina 22</p>
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
          </section>

          {/* Map Section */}
          <section className="map-section">
            <div className="container-fluid p-0">
              <div className="map-box">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d2994.3803116994895!2d55.29773782339708!3d25.222534631321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m5!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!3m2!1d25.2048493!2d55.2707828!4m0!5e1!3m2!1sen!2sin!4v1652217109535!5m2!1sen!2sin"
                  style={{ border: "0" }} // Pass style as an object
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </section>

          <Footer/>
        </>
      )}
    </div>
  );
}

export default Contact;
