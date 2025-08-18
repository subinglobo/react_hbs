import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Login.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DashboardRedirections from "../components/DashboardRedirections";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [forgetEmail, setForgetEmail] = useState("");
  const [forgetUsername, setForgetUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const loginRequest = {
        username: `${username}`,
        password: `${password}`,
      };
      const response = await axios.post("/auth/login", loginRequest, {
        withCredentials: true,
      });

      console.log("api login response :", response);

      const token = response.data.token;
      const roles = response.data.roles;

      if (!token || !roles) {
        throw new Error("Invalid response from server: Missing token or roles");
      }
     
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", roles);
     

      if (roles.length > 1) {
        console.log("navigate to select roles");
        navigate("/select-userRole", { state: { roles } });
      } else {
        DashboardRedirections(roles[0] || "User", navigate);
      }

    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const handleForgetPasswordSubmit = (e) => {
    e.preventDefault();
    console.log("Forget Password:", {
      email: forgetEmail,
      username: forgetUsername,
    });
    const modal = document.getElementById("exampleModal");
    if (modal) {
      const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  };

  const handleInsuranceClick = () => {
    // Redirect to insurance site - can be made dynamic later
    window.open("https://www.travelinsurance.com", "_blank");
  };

  const sliderSettings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    dots: false,
    infinite: true,
    pauseOnHover: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="login-container">
      {/* Header Section */}
      <div className="login-header">
        <div className="header-content">
          <div className="company-info">
            <img
              src={`${process.env.PUBLIC_URL}/images/logo-1.jpg`}
              alt="Globosoft Logo"
              className="company-logo"
            />
            <div className="company-details">
              <h1 className="company-name">Globosoft</h1>
              <p className="company-tagline">Global Contracting Solutions</p>
            </div>
          </div>
          <div className="header-features">
            <div className="feature-item">
              <i className="fas fa-shield-alt"></i>
              <span>Secure Platform</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-globe"></i>
              <span>Global Reach</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-clock"></i>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content-row">
        {/* Left Content Section */}
        <div className="col-lg-8">
          {/* Hero Banner Section */}
          <div className="hero-section">
            <div
              id="offerSlider"
              className="carousel slide mb-4"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/01.png`}
                    className="d-block w-100"
                    alt="Special Offer 1"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/04.png`}
                    className="d-block w-100"
                    alt="Special Offer 2"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/06.png`}
                    className="d-block w-100"
                    alt="Special Offer 3"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/07.png`}
                    className="d-block w-100"
                    alt="Special Offer 4"
                  />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#offerSlider"
                data-bs-slide="prev"
              >
                <i className="fa-solid fa-angle-left"></i>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#offerSlider"
                data-bs-slide="next"
              >
                <i className="fa-solid fa-angle-right"></i>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          {/* Value Proposition Section */}
          <div className="value-proposition">
            <div className="value-content">
              <h2>Streamline Your Contracting Operations</h2>
              <p>Access our comprehensive platform to manage hotel contracts, track performance, and optimize your business relationships with leading international hotel chains.</p>
              <div className="value-features">
                <div className="value-feature">
                  <i className="fas fa-chart-line"></i>
                  <span>Performance Analytics</span>
                </div>
                <div className="value-feature">
                  <i className="fas fa-handshake"></i>
                  <span>Contract Management</span>
                </div>
                <div className="value-feature">
                  <i className="fas fa-users"></i>
                  <span>Partner Network</span>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Cards Section */}
          <div className="offers-section">
            <h3>Exclusive Offers & Services</h3>
            <div className="row g-3">
              <div className="col-md-3 visit">
                <div className="position-relative places">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/01.png`}
                    alt="Special Offer 1"
                    className="img-fluid rounded"
                  />
                  <div className="offer-overlay">
                    <h4>Premium Deals</h4>
                    <p>Exclusive rates for our partners</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 visit">
                <div className="position-relative places">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/02.png`}
                    alt="Special Offer 2"
                    className="img-fluid rounded"
                  />
                  <div className="offer-overlay">
                    <h4>Luxury Packages</h4>
                    <p>Curated experiences worldwide</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 visit">
                <div className="position-relative places insurance-card" onClick={handleInsuranceClick}>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/03.png`}
                    alt="Travel Insurance"
                    className="img-fluid rounded"
                  />
                  <div className="overlay-text-new rounded">
                    <h3>Travel Insurance &ndash; Travel Smart</h3>
                    <p>
                      Enhance your travel experience with peace of mind. Add
                      insurance to your travel package and explore the world worry
                      free.
                    </p>
                    <div className="insurance-cta">
                      <i className="fas fa-external-link-alt"></i>
                      <span>Learn More</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="login-form">
          <div className="form-header">
            <div className="log">
              <img
                src={`${process.env.PUBLIC_URL}/images/logo-1.jpg`}
                alt="Globosoft Logo"
                className="img-fluid rounded login-logo"
              />
            </div>
            <h3>Welcome Back</h3>
            <p className="form-subtitle">Access your contracting dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">
                <i className="fas fa-user"></i>
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">
              <i className="fas fa-sign-in-alt"></i>
              Sign In
            </button>
            <div className="form-links">
              <Link to="/register" className="register-link">
                <i className="fas fa-user-plus"></i>
                Create Account
              </Link>
              <button
                type="button"
                className="forgot-password-btn"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <i className="fas fa-key"></i>
                Forgot Password?
              </button>
            </div>
          </form>
          
          <div className="form-footer">
            <div className="security-notice">
              <i className="fas fa-shield-alt"></i>
              <span>Your data is protected with enterprise-grade security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                <i className="fas fa-key"></i>
                Reset Your Password
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="inner">
                <p className="modal-description">
                  Enter your email and username to receive password reset instructions.
                </p>
                <form
                  id="changePass"
                  onSubmit={handleForgetPasswordSubmit}
                  autoComplete="off"
                >
                  <div className="form-holder active mb-3">
                    <label
                      className="control-label col-xs-12 col-sm-3 no-padding-right"
                      htmlFor="forgetmail"
                    >
                      <span className="text-red-500">*</span> Email Address:
                    </label>
                    <input
                      type="email"
                      id="forgetmail"
                      className="form-control forgetmail"
                      name="forgetmail"
                      placeholder="Enter your email address"
                      value={forgetEmail}
                      onChange={(e) => setForgetEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="form-holder mb-3">
                    <label
                      className="control-label col-xs-12 col-sm-3 no-padding-right"
                      htmlFor="userCode"
                    >
                      <span className="text-red-500">*</span> Username:
                    </label>
                    <input
                      type="text"
                      id="userCode"
                      className="form-control userCode"
                      name="userCode"
                      placeholder="Enter your username"
                      value={forgetUsername}
                      onChange={(e) => setForgetUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-login">
                    <input
                      type="submit"
                      value="Send Reset Link"
                      id="submit"
                      className="btn btn-warning w-100"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="partners-section">
        <div className="partners-content">
          <h3>International Chains We Are Connected With</h3>
          <p>
            Explore Our Collections Of 5000+ Luxury Hotels And 500000+ Hotels
            Worldwide Clubbed With Local Attractions
          </p>
          <div className="partners-stats">
            <div className="stat-item">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Luxury Hotels</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500K+</span>
              <span className="stat-label">Global Hotels</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">150+</span>
              <span className="stat-label">Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Chains Slider */}
      <div className="customers-section">
        <Slider className="brand-slider" {...sliderSettings}>
          <div>
            <img
              src={`${process.env.PUBLIC_URL}/images/marqueeImages/Holiday-Inn-logo.png`}
              className="down-marquee-images"
              alt="Holiday Inn Logo"
            />
          </div>
          <div>
            <img
              src={`${process.env.PUBLIC_URL}/images/marqueeImages/Accor-logo.png`}
              className="down-marquee-images"
              alt="Accor Logo"
            />
          </div>
          <div>
            <img
              src={`${process.env.PUBLIC_URL}/images/marqueeImages/Atlantis.png`}
              className="down-marquee-images"
              alt="Atlantis Logo"
            />
          </div>
          <div>
            <img
              src={`${process.env.PUBLIC_URL}/images/marqueeImages/Hilton-logo.png`}
              className="down-marquee-images"
              alt="Hilton Logo"
            />
          </div>
          <div>
            <img
              src={`${process.env.PUBLIC_URL}/images/marqueeImages/Hyatt-Logo.png`}
              className="down-marquee-images"
              alt="Hyatt Logo"
            />
          </div>
          <div>
            <img
              src={`${process.env.PUBLIC_URL}/images/marqueeImages/Sheraton-logo.png`}
              className="down-marquee-images"
              alt="Sheraton Logo"
            />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Login;
