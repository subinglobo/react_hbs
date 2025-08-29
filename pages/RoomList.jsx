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

const RoomList = () => {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState("0");
  const location = useLocation();
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData = {
        "hotels": [
          {
            "hotelId": "119-1249",
            "hotelName": "Al Maha, a Luxury Collection Desert Resort & Spa, Dubai",
            "starRating": 5,
            "propertyType": "Hotel",
            "chain": "MARRIOTT",
            "city": "MURQQUAB",
            "timeZone": null,
            "hotelAddress": "Dubai Desert Conservation Reserve, Murqquab",
            "hotelPhoneNumber": "+97148329900",
            "geoLocation": null,
            "roomCategories": [
              {
                "roomCategory": "Emirates Villa",
                "roomTypeCode": "114743",
                "baseRoomType": "Emirates Villa, 2 Bedroom Villa, Bedroom 1: 1 King, Bedroom 2: 2 Twin, Private pool",
                "availableRates": [
                  {
                    "roomCategory": "Emirates Villa",
                    "roomTypeDescription": "Emirates Villa, 2 Bedroom Villa, Bedroom 1: 1 King, Bedroom 2: 2 Twin, Private pool",
                    "mealPlan": "Room Only",
                    "mealPlanCode": "28",
                    "currency": "AED",
                    "rate": 9823.97,
                    "totalRate": 9823.97,
                    "rateBeforeTax": 8002.8,
                    "recommendedRetailPrice": 12836.63,
                    "roomStatus": "OK",
                    "nonRefundable": false,
                    "refundStatus": "FLEXIBLE",
                    "contractLabel": "Tour Operator Dynamic Rate, Tour Operator Dynamic, breakfast, lunch, dinner, Book or change or cancel only by Tour Operators",
                    "cancellationPolicies": [
                      {
                        "fromDate": "2025-09-11",
                        "toDate": "2025-09-25",
                        "percentOrAmount": "",
                        "value": 0,
                        "policyText": "Free cancellation until Sept 11, 2025"
                      },
                      {
                        "fromDate": "2025-09-25",
                        "toDate": "2025-09-26",
                        "percentOrAmount": "",
                        "value": 0,
                        "policyText": "Free cancellation until Sept 25, 2025"
                      }
                    ]
                  },
                  {
                    "roomCategory": "Emirates Villa",
                    "roomTypeDescription": "Emirates Villa, 2 Bedroom Villa, Bedroom 1: 1 King, Bedroom 2: 2 Twin, Private pool",
                    "mealPlan": "Full Board",
                    "mealPlanCode": "14",
                    "currency": "AED",
                    "rate": 9823.97,
                    "totalRate": 9823.97,
                    "rateBeforeTax": 8002.8,
                    "recommendedRetailPrice": 12034.33,
                    "roomStatus": "OK",
                    "nonRefundable": false,
                    "refundStatus": "FLEXIBLE",
                    "contractLabel": "Breakfast, Lunch and Evening Meal for 2 Adults",
                    "cancellationPolicies": [
                      {
                        "fromDate": "2025-09-11",
                        "toDate": "2025-09-25",
                        "percentOrAmount": "",
                        "value": 0,
                        "policyText": "Free cancellation until Sept 11, 2025"
                      },
                      {
                        "fromDate": "2025-09-25",
                        "toDate": "2025-09-26",
                        "percentOrAmount": "",
                        "value": 0,
                        "policyText": "Free cancellation until Sept 25, 2025"
                      }
                    ]
                  }
                ]
              },
              {
                "roomCategory": "Bedouin Villa",
                "roomTypeCode": "123047",
                "baseRoomType": "Bedouin Villa Twin, 1 Bedroom Villa, 2 Twin, Private pool",
                "availableRates": [
                  {
                    "roomCategory": "Bedouin Villa",
                    "roomTypeDescription": "Bedouin Villa Twin, 1 Bedroom Villa, 2 Twin, Private pool",
                    "mealPlan": "Room Only",
                    "mealPlanCode": "28",
                    "currency": "AED",
                    "rate": 3124.64,
                    "totalRate": 3124.64,
                    "rateBeforeTax": 2533.95,
                    "recommendedRetailPrice": 4082.84,
                    "roomStatus": "OK",
                    "nonRefundable": false,
                    "refundStatus": "FLEXIBLE",
                    "contractLabel": "Tour Operator Dynamic Rate, Tour Operator Dynamic, breakfast, lunch, dinner, Book or change or cancel only by Tour Operators",
                    "cancellationPolicies": [
                      {
                        "fromDate": "2025-09-11",
                        "toDate": "2025-09-25",
                        "percentOrAmount": "",
                        "value": 0,
                        "policyText": "Free cancellation until Sept 11, 2025"
                      }
                    ]
                  }
                ]
              }
            ],
            "checkInDate": "2025-09-25",
            "checkOutDate": "2025-09-26",
            "nationality": "AF",
            "numberOfRooms": 1,
            "numberOfGuests": 2,
            "guestBreakdown": "(2 Adults)",
            "destination": "MURQQUAB"
          }
        ],
        "message": "Search completed successfully",
        "success": true
      };
      
      setRoomData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBooking = (rate) => {
    setSelectedRate(rate);
    setShowBookingModal(true);
  };

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
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(price);
  };

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => (
      <FaStar key={i} className="text-warning" />
    ));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
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
                            <span><FaCalendarAlt className="text-muted me-2" />Check-in:</span>
                            <span className="fw-semibold">{hotel.checkInDate}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span><FaCalendarAlt className="text-muted me-2" />Check-out:</span>
                            <span className="fw-semibold">{hotel.checkOutDate}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span><FaUsers className="text-muted me-2" />Guests:</span>
                            <span className="fw-semibold">{hotel.guestBreakdown}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span><FaBed className="text-muted me-2" />Rooms:</span>
                            <span className="fw-semibold">{hotel.numberOfRooms}</span>
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
              <Accordion activeKey={activeAccordion} onSelect={(key) => setActiveAccordion(key)}>
                {hotel.roomCategories.map((category, index) => (
                  <Accordion.Item key={index} eventKey={index.toString()} className="room-category-item">
                    <Accordion.Header className="room-category-header">
                      <div className="d-flex justify-content-between align-items-center w-100 me-3">
                        <div className="room-category-info">
                          <h5 className="mb-1">{category.roomCategory}</h5>
                          <p className="mb-0 text-muted small">{category.baseRoomType}</p>
                        </div>
                        <div className="room-category-price">
                          <span className="price-range">
                            From {formatPrice(Math.min(...category.availableRates.map(rate => rate.rate)))}
                          </span>
                          <span className="rates-count">
                            {category.availableRates.length} rate{category.availableRates.length !== 1 ? 's' : ''} available
                          </span>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="room-rates-section">
                      <Row>
                        {category.availableRates.map((rate, rateIndex) => (
                          <Col key={rateIndex} lg={6} xl={4} className="mb-3">
                            <Card className="rate-card h-100">
                              <Card.Body className="p-3">
                                <div className="rate-header mb-3">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    {getMealPlanIcon(rate.mealPlan)}
                                    <span className="fw-semibold">{rate.mealPlan}</span>
                                  </div>
                                  {getRefundStatusBadge(rate.refundStatus)}
                                </div>
                                
                                <div className="rate-pricing mb-3">
                                  <div className="current-price">
                                    {formatPrice(rate.totalRate)}
                                  </div>
                                  {rate.recommendedRetailPrice > rate.totalRate && (
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
                                    <span className="small">{rate.contractLabel}</span>
                                  </div>
                                  {rate.cancellationPolicies && rate.cancellationPolicies.length > 0 && (
                                    <div className="feature-item">
                                      <FaShieldAlt className="text-muted me-2" />
                                      <span className="small">{rate.cancellationPolicies[0].policyText}</span>
                                    </div>
                                  )}
                                </div>

                                <Button 
                                  variant="primary" 
                                  className="w-100 book-now-btn"
                                  onClick={() => handleBooking(rate)}
                                >
                                  <FaMoneyBillWave className="me-2" />
                                  Book Now
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
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRate && (
            <div>
              <h5>{selectedRate.roomCategory}</h5>
              <p className="text-muted">{selectedRate.roomTypeDescription}</p>
              <div className="booking-details-modal">
                <div className="d-flex justify-content-between mb-2">
                  <span>Meal Plan:</span>
                  <span className="fw-semibold">{selectedRate.mealPlan}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Rate:</span>
                  <span className="fw-semibold text-primary">{formatPrice(selectedRate.totalRate)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Refund Status:</span>
                  <span>{getRefundStatusBadge(selectedRate.refundStatus)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Contract:</span>
                  <span className="small text-muted">{selectedRate.contractLabel}</span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoomList;
