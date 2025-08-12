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
     
     
      // if (!refreshToken) {
      //   throw new Error("Refresh token not found in cookies");
      // }
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", roles);
     

      if (roles.length > 1) {
        // Multiple roles - navigate to role selection
        console.log("navigate to select roles");
        navigate("/select-userRole", { state: { roles } });
      } else {
        // Single role - navigate directly to dashboard
        DashboardRedirections(roles[0] || "User", navigate);
      }

      //("/adminDashboard");
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
      <div className="login-header"></div>

      <div className="main-content-row">
        <div className="col-lg-8">
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
                  alt="Carousel Placeholder 1"
                />
              </div>
              <div className="carousel-item">
                <img
                  src={`${process.env.PUBLIC_URL}/images/04.png`}
                  className="d-block w-100"
                  alt="Carousel Placeholder 2"
                />
              </div>
              <div className="carousel-item">
                <img
                  src={`${process.env.PUBLIC_URL}/images/06.png`}
                  className="d-block w-100"
                  alt="Carousel Placeholder 3"
                />
              </div>
              <div className="carousel-item">
                <img
                  src={`${process.env.PUBLIC_URL}/images/07.png`}
                  className="d-block w-100"
                  alt="Carousel Placeholder 4"
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

          <div className="row g-3">
            <div className="col-md-3 visit">
              <div className="position-relative places">
                <img
                  src={`${process.env.PUBLIC_URL}/images/01.png`}
                  alt="Offer Image 1"
                  className="img-fluid rounded"
                />
              </div>
            </div>
            <div className="col-md-3 visit">
              <div className="position-relative places">
                <img
                  src={`${process.env.PUBLIC_URL}/images/02.png`}
                  alt="Offer Image 2"
                  className="img-fluid rounded"
                />
              </div>
            </div>
            <div className="col-md-6 visit">
              <div className="position-relative places">
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form">
          <div className="log">
            <img
              src={`${process.env.PUBLIC_URL}/images/logo-1.jpg`}
              alt="Travel Insurance"
              className="img-fluid rounded login-logo"
            />
          </div>
          <h3>Sign in</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">
              Login
            </button>
            <div className="form-links">
              <Link to="/register">Register</Link>
              <button
                type="button"
                className="btn btn-link"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Forget Password
              </button>
            </div>
          </form>
        </div>
      </div>

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
                Forgot Password?
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
                      <span className="text-red-500">*</span> Mail Id:
                    </label>
                    <input
                      type="email"
                      id="forgetmail"
                      className="form-control forgetmail"
                      name="forgetmail"
                      placeholder="Email"
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
                      <span className="text-red-500">*</span> User Name:
                    </label>
                    <input
                      type="text"
                      id="userCode"
                      className="form-control userCode"
                      name="userCode"
                      placeholder="User Name"
                      value={forgetUsername}
                      onChange={(e) => setForgetUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-login">
                    <input
                      type="submit"
                      value="Submit"
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

      <div className="partners-section">
        <h3>International Chains ChoosenFly Is Connected With</h3>
        <p>
          Explore Our Collections Of 5000+ Luxury Hotels And 500000+ Hotels
          Worldwide Clubbed With Local Attractions
        </p>
      </div>

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
