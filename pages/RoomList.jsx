import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Badge,
  Accordion,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import {
  FaBed,
  FaUtensils,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendarAlt,
  FaUsers,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaHotel,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/RoomList.css";
import axiosInstance from "../components/AxiosInstance";
import axios from "axios";

const RoomList = () => {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState("0");
  const location = useLocation();
  const navigate = useNavigate();
  const [hotelStaticData, setHotelStaticData] = useState(null);

  // Trigger API call on page load with state passed from HotelSearch
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        let payload = location.state?.payload;
        let meta = location.state?.meta;

        if (!payload) {
          try {
            const stored = sessionStorage.getItem("roomListPayload");
            if (stored) {
              const parsed = JSON.parse(stored);
              payload = parsed.payload;
              meta = parsed.meta;
              setHotelStaticData(meta);
            }
          } catch {}
        }

        if (!payload) {
          setError("Missing search context. Please go back and try again.");
          setLoading(false);
          return;
        }

        const res = await axiosInstance.post(
          "/api/hotel-rooms/search",
          payload
        );

        if (!res.data || res.data.success === false) {
          const message =
            res.data?.message || "Search failed. Please try again.";
          setError(message);
          setLoading(false);
          return;
        }

        const enriched = {
          ...res.data,
          hotels: (res.data.hotels || []).map((h) => ({
            ...h,
            // Sort availableRates within each category by totalRate asc
            roomCategories: (h.roomCategories || []).map((c) => ({
              ...c,
              availableRates: (c.availableRates || [])
                .slice()
                .sort((a, b) => (a.totalRate || 0) - (b.totalRate || 0)),
            })),
          })),
          meta: meta || {},
          payload,
        };

        setRoomData(enriched);
      } catch (err) {
        console.error("Room search failed:", err);
        setError("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [location.state]);

  const handleBooking = (rate) => {
    setSelectedRate(rate);
    setShowBookingModal(true);
  };

  const sampleGallery = [
    "/images/01.png",
    "/images/02.png",
    "/images/03.png",
    "/images/04.jpg",
    "/images/04.png",
    "/images/05.jpg",
    "/images/06.png",
    "/images/07.png",
    "/images/main-slider.jpg",
    "/images/small-img.jpg",
  ];

  const getMealPlanIcon = (mealPlan) => {
    switch (mealPlan.toLowerCase()) {
      case "room only":
        return <FaBed className="text-muted" />;
      case "breakfast":
        return <FaUtensils className="text-warning" />;
      case "full board":
        return <FaUtensils className="text-success" />;
      default:
        return <FaUtensils className="text-primary" />;
    }
  };

  const getRefundStatusBadge = (refundStatus) => {
    switch (refundStatus) {
      case "FLEXIBLE":
        return <Badge bg="success">Flexible</Badge>;
      case "NON REFUNDABLE":
        return <Badge bg="danger">Non-Refundable</Badge>;
      default:
        return <Badge bg="secondary">{refundStatus}</Badge>;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
    }).format(price);
  };

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => (
      <FaStar key={i} className="text-warning" />
    ));
  };

  if (loading) {
    return (
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="flex-grow-1 d-flex flex-column">
          <TopBar />
          <main className="flex-grow-1 d-flex justify-content-center align-items-center">
            <div className="text-center results-loader">
              <div className="loader-ring">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <h4 className="text-primary fw-bold mt-3 mb-1">
                Fetching Best Room Options...
              </h4>
              <p className="text-muted small mb-0">
                Comparing rates across providers
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="flex-grow-1 d-flex flex-column">
          <TopBar />
          <main className="flex-grow-1 d-flex justify-content-center align-items-center p-3">
            <div className="w-100" style={{ maxWidth: 480 }}>
              <Alert variant="danger" className="mb-3">
                <Alert.Heading>Error</Alert.Heading>
                <p className="mb-0">{error}</p>
              </Alert>
              <Button
                variant="primary"
                onClick={() => navigate("/new-booking/hotel")}
              >
                Back to Search
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!roomData || !roomData.hotels || roomData.hotels.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>No Rooms Available</Alert.Heading>
        <p>No room data found for this hotel.</p>
      </Alert>
    );
  }

  const hotel = roomData.hotels[0];
  const payload = roomData.payload || {};

  return (
    <div className="room-list-container">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main className="content-wrapper">
          <div className="container-fluid">
            {/* Hotel Header */}
            <Card className="hotel-header-card mb-4">
              <Card.Body className="p-4">
                <Row>
                  <Col md={8}>
                    <div className="d-flex align-items-start gap-3">
                      <div className="hotel-icon">
                        <FaHotel size={40} className="text-primary" />
                      </div>
                      <div className="hotel-info">
                        <h2 className="hotel-name mb-2">{hotel.hotelName}</h2>
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <div className="star-rating">
                            {renderStars(hotel.starRating)}
                          </div>
                          <Badge bg="primary">{hotel.propertyType}</Badge>
                          <Badge bg="info">{hotel.chain}</Badge>
                        </div>
                        <div className="hotel-details">
                          <p className="mb-1">
                            <FaMapMarkerAlt className="text-muted me-2" />
                            {hotel.hotelAddress}
                          </p>
                          <p className="mb-0">
                            <FaPhone className="text-muted me-2" />
                            {hotel.hotelPhoneNumber}
                          </p>
                          <div className="mt-2">
                            <small className="text-muted">
                              <strong>Please note:</strong> Some properties may
                              collect additional charges such as city tax,
                              resort fees, or security deposits during check-in.
                              Policies such as check-in time, child
                              accommodation, and cancellation rules can vary by
                              room and provider.
                            </small>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => navigate(-1)}
                          >
                            Back to Search
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <Card className="booking-summary">
                      <Card.Body className="p-3">
                        <h6 className="mb-3">Booking Summary</h6>
                        <div className="booking-details">
                          <div className="d-flex justify-content-between mb-2">
                            <span>
                              <FaCalendarAlt className="text-muted me-2" />
                              Check-in:
                            </span>
                            <span className="fw-semibold">
                              {payload.checkInDate || hotel.checkInDate}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>
                              <FaCalendarAlt className="text-muted me-2" />
                              Check-out:
                            </span>
                            <span className="fw-semibold">
                              {payload.checkOutDate || hotel.checkOutDate}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>
                              <FaUsers className="text-muted me-2" />
                              Guests:
                            </span>
                            <span className="fw-semibold">
                              {hotel.guestBreakdown}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>
                              <FaBed className="text-muted me-2" />
                              Rooms:
                            </span>
                            <span className="fw-semibold">
                              {hotel.numberOfRooms}
                            </span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Room Categories Accordion */}
            <div className="room-categories-section">
              <h4 className="mb-4">Available Room Categories</h4>
              <Accordion
                activeKey={activeAccordion}
                onSelect={(key) => setActiveAccordion(key)}
              >
                {hotel.roomCategories.map((category, index) => (
                  <Accordion.Item
                    key={index}
                    eventKey={index.toString()}
                    className="room-category-item"
                  >
                    <Accordion.Header className="room-category-header">
                      <div className="d-flex justify-content-between align-items-center w-100 me-3">
                        <div className="room-category-info">
                          <h5 className="mb-1">{category.roomCategory}</h5>
                          <p className="mb-0 text-muted small">
                            {category.baseRoomType}
                          </p>
                        </div>
                        <div className="room-category-price">
                          <span className="price-range">
                            From{" "}
                            {formatPrice(
                              Math.min(
                                ...category.availableRates.map(
                                  (rate) => rate.rate
                                )
                              )
                            )}
                          </span>
                          <span className="rates-count">
                            {category.availableRates.length} rate
                            {category.availableRates.length !== 1
                              ? "s"
                              : ""}{" "}
                            available
                          </span>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="room-rates-section">
                      <Row>
                        {category.availableRates.map((rate, rateIndex) => (
                          <Col key={rateIndex} lg={6} xl={4} className="mb-3">
                            <Card
                              className="rate-card h-100"
                              role="button"
                              onClick={() => handleBooking(rate)}
                            >
                              <Card.Body className="p-3">
                                <div className="rate-header mb-3">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    {getMealPlanIcon(rate.mealPlan)}
                                    <span className="fw-semibold">
                                      {rate.mealPlan}
                                    </span>
                                  </div>
                                  {getRefundStatusBadge(rate.refundStatus)}
                                </div>

                                <div className="rate-pricing mb-3">
                                  <div className="current-price">
                                    {formatPrice(rate.totalRate)}
                                  </div>
                                  {rate.recommendedRetailPrice >
                                    rate.totalRate && (
                                    <div className="original-price text-muted text-decoration-line-through">
                                      {formatPrice(rate.recommendedRetailPrice)}
                                    </div>
                                  )}
                                  <div className="price-per-night text-muted small">
                                    per night
                                  </div>
                                </div>

                                <div className="rate-features mb-3">
                                  <div className="feature-item">
                                    <FaInfoCircle className="text-muted me-2" />
                                    <span className="small">
                                      {rate.contractLabel}
                                    </span>
                                  </div>
                                  {rate.cancellationPolicies &&
                                    rate.cancellationPolicies.length > 0 && (
                                      <div className="feature-item">
                                        <FaShieldAlt className="text-muted me-2" />
                                        <span className="small">
                                          {
                                            rate.cancellationPolicies[0]
                                              .policyText
                                          }
                                        </span>
                                      </div>
                                    )}
                                </div>

                                <Button
                                  variant="primary"
                                  className="w-100 book-now-btn"
                                  onClick={() => handleBooking(rate)}
                                >
                                  <FaMoneyBillWave className="me-2" /> View
                                  Details / Book
                                </Button>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>

            {/* Static Sections for future dynamic data */}
            <div className="mt-4">
              <Card className="mb-4">
                <Card.Header as="h6">Additional Information</Card.Header>
                <Card.Body>
                  <ul className="mb-0 text-muted">
                    <li>
                      Mandatory gala dinner fees may apply on certain dates.
                      Please contact the hotel directly for more information.
                    </li>
                    <li>
                      Additional taxes or resort fees may be collected at the
                      property during check-in.
                    </li>
                    <li>
                      Special requests are subject to availability and may incur
                      additional charges.
                    </li>
                    <li>
                      Photo identification and a credit card or cash deposit may
                      be required at check-in for incidental charges.
                    </li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Header as="h6">Policies</Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span className="text-muted">Check-in</span>
                        <span className="fw-semibold">After 14:00</span>
                      </div>
                      <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span className="text-muted">Check-out</span>
                        <span className="fw-semibold">Before 12:00</span>
                      </div>
                      <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span className="text-muted">Children</span>
                        <span className="fw-semibold">
                          Policies vary by room
                        </span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span className="text-muted">Deposit</span>
                        <span className="fw-semibold">May be required</span>
                      </div>
                      <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span className="text-muted">Additional Bed</span>
                        <span className="fw-semibold">
                          Subject to availability
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Cancellation</span>
                        <span className="fw-semibold">See rate conditions</span>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      <Modal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        size="xl"
        aria-labelledby="room-detail-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="room-detail-modal">Room Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRate && (
            <Row className="g-4">
              <Col md={6}>
                <div
                  id="roomGallery"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner rounded">
                    {sampleGallery.map((img, idx) => (
                      <div
                        key={idx}
                        className={`carousel-item ${idx === 0 ? "active" : ""}`}
                      >
                        <img src={img} className="d-block w-100" alt="Room" />
                      </div>
                    ))}

                    {/* <div className="carousel-item active">
  <img
    src={meta.hotelImage}
    className="d-block w-100"
    alt="Room"
  />
</div> */}
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#roomGallery"
                    data-bs-slide="prev"
                    aria-label="Previous image"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#roomGallery"
                    data-bs-slide="next"
                    aria-label="Next image"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </Col>
              <Col md={6}>
                <h5 className="mb-2">{selectedRate.roomCategory}</h5>
                <p className="text-muted">{selectedRate.roomTypeDescription}</p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Badge bg="secondary">High speed internet</Badge>
                  <Badge bg="secondary">Private bathroom</Badge>
                  <Badge bg="secondary">Kitchen</Badge>
                  <Badge bg="secondary">TV</Badge>
                </div>
                <div className="booking-details-modal">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Meal Plan:</span>
                    <span className="fw-semibold">{selectedRate.mealPlan}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Rate:</span>
                    <span className="fw-semibold text-primary">
                      {formatPrice(selectedRate.totalRate)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Refund Status:</span>
                    <span>
                      {getRefundStatusBadge(selectedRate.refundStatus)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Contract:</span>
                    <span className="small text-muted">
                      {selectedRate.contractLabel}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowBookingModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="btn-confirm-booking"
            size="sm"
            onClick={() => {
            try {
                sessionStorage.setItem(
                  "bookingData",
                  JSON.stringify({ selectedRate, hotelStaticData, payload })
                );
              } catch {}
              window.open("/hotel-booking-page", "_blank");
            }}
          >
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoomList;
