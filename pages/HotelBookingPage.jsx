import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Form, Button, Accordion
} from 'react-bootstrap';
import {
  FaHotel, FaCalendarAlt, FaUsers, FaUtensils
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../styles/HotelBookingPage.css';

// Sample static booking data
const staticBookingData = {
  meta: {
    hotelName: 'Grand Oasis Resort',
    address: '123 Sheikh Zayed Rd, Dubai, UAE',
    starRating: 5,
    phone: '+971 4 123 4567',
  },
  payload: {
    checkInDate: '2025-09-15',
    checkOutDate: '2025-09-20',
    rooms: [
      { adults: 2, children: 1 },
      { adults: 1, children: 0 },
    ],
  },
  selectedRate: {
    mealPlan: 'Breakfast Included',
    totalRate: 2500,
  },
};

const HotelBookingPage = () => {
  const navigate = useNavigate();
  const { meta, payload, selectedRate } = staticBookingData;

  // State for primary guest
  const [primaryGuest, setPrimaryGuest] = useState({
    salutation: '', firstName: '', lastName: '', email: '', phone: ''
  });

  // State for rooms and guests
  const [rooms, setRooms] = useState(
    payload.rooms.map(room => ({
      ...room,
      guests: Array.from({ length: room.adults + room.children }, (_, i) => ({
        salutation: '', firstName: '', lastName: '', gender: '', isChild: i >= room.adults
      }))
    }))
  );

  const handleGuestChange = (roomIndex, guestIndex, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].guests[guestIndex][field] = value;
    setRooms(updatedRooms);
  };

  const handlePrimaryGuestChange = (field, value) => {
    setPrimaryGuest({ ...primaryGuest, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = { primaryGuest, rooms };
    console.log('Booking Data:', bookingData);
    navigate('/booking-confirmation', { state: { bookingData } });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(price);

  return (
    <div className="hotel-booking-container">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main className="content-wrapper py-4">
          <Container fluid>

            {/* Booking Summary - Full Width, Modern Card */}
            <Row>
              <Col>
                <Card className="shadow-lg rounded-xl mb-5 booking-summary-card border-0">
                  <Card.Header className="bg-primary text-white py-3 rounded-top">
                    <h4 className="mb-0 d-flex align-items-center">
                      <FaHotel className="me-2" /> Booking Summary
                    </h4>
                  </Card.Header>
                  <Card.Body className="p-4 bg-white">
                    <Row className="gy-4">
                      <Col md={6} lg={4}>
                        <h5 className="fw-bold">{meta.hotelName}</h5>
                        <p className="text-muted mb-1">{meta.address}</p>
                        <small className="text-muted">⭐ {meta.starRating} Star</small>
                      </Col>

                      <Col md={6} lg={2}>
                        <FaCalendarAlt className="me-2 text-muted" />
                        <strong>Check-in:</strong><br />
                        {payload.checkInDate}
                      </Col>

                      <Col md={6} lg={2}>
                        <FaCalendarAlt className="me-2 text-muted" />
                        <strong>Check-out:</strong><br />
                        {payload.checkOutDate}
                      </Col>

                      <Col md={6} lg={2}>
                        <FaUsers className="me-2 text-muted" />
                        <strong>Guests</strong><br />
                        {payload.rooms.map((room, i) => (
                          <div key={i}>Room {i + 1}: {room.adults} Adults{room.children ? `, ${room.children} Children` : ''}</div>
                        ))}
                      </Col>

                      <Col md={6} lg={2}>
                        <FaUtensils className="me-2 text-muted" />
                        <strong>Meal Plan:</strong><br /> {selectedRate.mealPlan}
                      </Col>
                    </Row>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Total Price</h5>
                      <h3 className="text-success fw-bold mb-0">
                        {formatPrice(selectedRate.totalRate)}
                      </h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Guest Forms */}
            <Form onSubmit={handleSubmit}>
              <Accordion defaultActiveKey="" className="mb-5 custom-accordion">
                {rooms.map((room, roomIndex) => (
                  <Accordion.Item eventKey={`room-${roomIndex}`} key={roomIndex} className="mb-3 border rounded shadow-sm">
                    <Accordion.Header>
                      <strong>Room {roomIndex + 1} - Guest Details</strong>
                    </Accordion.Header>
                    <Accordion.Body className="bg-light rounded-bottom">
                      {room.guests.map((guest, guestIndex) => (
                        <Card key={guestIndex} className="mb-3 p-3 border rounded shadow-sm">
                          <h6 className="fw-bold mb-3">
                            Guest {guestIndex + 1} {guest.isChild ? '(Child)' : '(Adult)'}
                          </h6>
                          <Row className="g-3">
                            <Col md={4}>
                              <Form.Group>
                                <Form.Label>Salutation</Form.Label>
                                <Form.Select
                                  value={guest.salutation}
                                  onChange={e =>
                                    handleGuestChange(roomIndex, guestIndex, 'salutation', e.target.value)
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="Mr">Mr</option>
                                  <option value="Mrs">Mrs</option>
                                  <option value="Ms">Ms</option>
                                  <option value="Dr">Dr</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={guest.firstName}
                                  onChange={e =>
                                    handleGuestChange(roomIndex, guestIndex, 'firstName', e.target.value)
                                  }
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={guest.lastName}
                                  onChange={e =>
                                    handleGuestChange(roomIndex, guestIndex, 'lastName', e.target.value)
                                  }
                                />
                              </Form.Group>
                            </Col>
                            <Col md={12}>
                              <Form.Group>
                                <Form.Label>Gender</Form.Label>
                                <Form.Select
                                  value={guest.gender}
                                  onChange={e =>
                                    handleGuestChange(roomIndex, guestIndex, 'gender', e.target.value)
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>

              {/* Primary Guest Section */}
              <Card className="p-4 mb-4 shadow-sm border-0">
                <h5 className="mb-3 fw-bold">Primary Guest Details (Mandatory)</h5>
                <Row className="g-3">
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Salutation</Form.Label>
                      <Form.Select
                        value={primaryGuest.salutation}
                        onChange={e => handlePrimaryGuestChange('salutation', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={primaryGuest.firstName}
                        onChange={e => handlePrimaryGuestChange('firstName', e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={primaryGuest.lastName}
                        onChange={e => handlePrimaryGuestChange('lastName', e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={primaryGuest.email}
                        onChange={e => handlePrimaryGuestChange('email', e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        value={primaryGuest.phone}
                        onChange={e => handlePrimaryGuestChange('phone', e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card>

              {/* Remarks & Requests */}
              <Card className="p-4 mb-4 shadow-sm border-0">
                <h5 className="mb-3 fw-bold">Remarks & Special Requests</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Any remarks..." />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Special Requests</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Any special requests..." />
                </Form.Group>
              </Card>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button variant="primary" type="submit">
                  Confirm Booking
                </Button>
              </div>
            </Form>

          </Container>
        </main>
      </div>
    </div>
  );
};

export default HotelBookingPage;
