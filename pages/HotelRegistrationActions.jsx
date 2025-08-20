// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
// import { 
//   FaArrowLeft, 
//   FaUser, 
//   FaPhone, 
//   FaEnvelope, 
//   FaMobile,
//   FaCheck,
//   FaAt,
//   FaArrowRight,
//   FaUsers,
//   FaBullhorn,
//   FaMoneyBill,
//   FaGift,
//   FaFileAlt,
//   FaCheckSquare,
//   FaImage,
//   FaEdit,
//   FaExclamationTriangle,
//   FaBed,
//   FaImages,
//   FaEye,
//   FaUnlink,
//   FaCreditCard,
//   FaFileContract,
//   FaCog
// } from 'react-icons/fa';
// import "../styles/HotelRegistrationActions.css";

// const HotelRegistrationActions = () => {
//   const [activeTab, setActiveTab] = useState('basic-details');

//   const navigationTabs = [
//     { id: 'basic-details', label: 'Basic details', icon: FaUser },
//     { id: 'gallery', label: 'Gallery', icon: FaImages },
//     { id: '360-view', label: '360 degree view', icon: FaEye },
//     { id: 'contact-details', label: 'Contact details', icon: FaPhone },
//     { id: 'bank-details', label: 'Bank details', icon: FaCreditCard },
//     { id: 'room-details', label: 'Room details', icon: FaBed },
//     { id: 'terms-conditions', label: 'Terms and Conditions', icon: FaFileContract }
//   ];

//   const actions = [
//     { label: 'Mail center', icon: FaAt, status: 'success', count: null },
//     { label: 'Login Details', icon: FaArrowRight, status: 'success', count: null },
//     { label: 'Occupancy & Minimum length', icon: FaUsers, status: 'count', count: 1 },
//     { label: 'Hotel Availability', icon: FaBullhorn, status: 'count', count: 1 },
//     { label: 'Contract Rate', icon: FaMoneyBill, status: 'count', count: 1 },
//     { label: 'Promotion', icon: FaGift, status: 'count', count: 0 },
//     { label: 'Policy', icon: FaFileAlt, status: 'count', count: 1 },
//     { label: 'Compulsory Events', icon: FaCheckSquare, status: 'count', count: 0 },
//     { label: 'Image Upload', icon: FaImage, status: 'count', count: 0 },
//     { label: 'Hotel Edit', icon: FaEdit, status: 'none', count: null },
//     { label: 'Validity Periods', icon: FaExclamationTriangle, status: 'none', count: null },
//     { label: 'Book Hotel', icon: FaBed, status: 'none', count: null }
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'basic-details':
//         return (
//           <div>
//             <h4 className="mb-3">Basic Details</h4>
//             <div className="content-item">
//               <strong>Hotel Name:</strong> Grand Plaza Hotel
//             </div>
//             <div className="content-item">
//               <strong>Category:</strong> 5 Star
//             </div>
//             <div className="content-item">
//               <strong>Address:</strong> 123 Main Street, Downtown
//             </div>
//             <div className="content-item">
//               <strong>Description:</strong> Luxury hotel with world-class amenities
//             </div>
//           </div>
//         );
//       case 'gallery':
//         return (
//           <div>
//             <h4 className="mb-3">Gallery</h4>
//             <div className="no-image-placeholder">
//               <FaImages className="placeholder-icon" />
//               <p>NO IMAGE AVAILABLE</p>
//             </div>
//           </div>
//         );
//       case '360-view':
//         return (
//           <div>
//             <h4 className="mb-3">360 Degree View</h4>
//             <div className="no-image-placeholder">
//               <FaEye className="placeholder-icon" />
//               <p>NO 360° VIEW AVAILABLE</p>
//             </div>
//           </div>
//         );
//       case 'contact-details':
//         return (
//           <div>
//             <h4 className="mb-3">Contact Details</h4>
//             <div className="contact-item">
//               <FaUser className="contact-icon" />
//               <span>Akhil</span>
//             </div>
//             <div className="contact-item">
//               <FaPhone className="contact-icon" />
//               <span>12452852</span>
//             </div>
//             <div className="contact-item">
//               <FaEnvelope className="contact-icon" />
//               <span>subinglobosoft@gmail.com</span>
//             </div>
//             <div className="contact-item">
//               <FaMobile className="contact-icon" />
//               <span>5242585254</span>
//             </div>
//           </div>
//         );
//       case 'bank-details':
//         return (
//           <div>
//             <h4 className="mb-3">Bank Details</h4>
//             <div className="content-item">
//               <strong>Bank Name:</strong> National Bank
//             </div>
//             <div className="content-item">
//               <strong>Account Number:</strong> 1234567890
//             </div>
//             <div className="content-item">
//               <strong>IFSC Code:</strong> NATB0001234
//             </div>
//             <div className="content-item">
//               <strong>Branch:</strong> Main Branch
//             </div>
//           </div>
//         );
//       case 'room-details':
//         return (
//           <div>
//             <h4 className="mb-3">Room Details</h4>
//             <div className="content-item">
//               <strong>Standard Room:</strong> Available
//             </div>
//             <div className="content-item">
//               <strong>Deluxe Room:</strong> Available
//             </div>
//             <div className="content-item">
//               <strong>Suite:</strong> Available
//             </div>
//             <div className="content-item">
//               <strong>Total Rooms:</strong> 150
//             </div>
//           </div>
//         );
//       case 'terms-conditions':
//         return (
//           <div>
//             <h4 className="mb-3">Terms and Conditions</h4>
//             <div className="content-item">
//               <FaCheck className="check-icon" />
//               <span>adsddfds</span>
//             </div>
//           </div>
//         );
//       default:
//         return <div>Select a tab to view details</div>;
//     }
//   };

//   const getStatusIcon = (action) => {
//     if (action.status === 'success') {
//       return <FaCheck className="status-icon success" />;
//     } else if (action.status === 'count') {
//       return (
//         <Badge 
//           bg={action.count > 0 ? 'success' : 'danger'} 
//           className="status-badge"
//         >
//           {action.count}
//         </Badge>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="hotel-registration-container">
//       {/* Header */}
//       <div className="page-header">
//         <Button variant="link" className="back-button">
//           <FaArrowLeft /> Back
//         </Button>
//         <h2 className="page-title">View Hotel</h2>
//       </div>

//       <Row className="main-content">
//         {/* Left Navigation Panel */}
//         <Col md={3} className="navigation-panel">
//           <Card className="nav-card">
//             <Card.Body className="p-0">
//               {navigationTabs.map((tab) => (
//                 <div
//                   key={tab.id}
//                   className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
//                   onClick={() => setActiveTab(tab.id)}
//                 >
//                   <tab.icon className="nav-icon" />
//                   <span>{tab.label}</span>
//                   <FaArrowRight className="arrow-icon" />
//                 </div>
//               ))}
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Center Content Panel */}
//         <Col md={6} className="content-panel">
//           <Card className="content-card">
//             <Card.Body>
//               {renderContent()}
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Right Actions Panel */}
//         <Col md={3} className="actions-panel">
//           <Card className="actions-card">
//             <Card.Header>
//               <h5 className="mb-0">Actions</h5>
//             </Card.Header>
//             <Card.Body className="p-0">
//               {actions.map((action, index) => (
//                 <div key={index} className="action-item">
//                   <div className="action-content">
//                     <action.icon className="action-icon" />
//                     <span className="action-label">{action.label}</span>
//                   </div>
//                   {getStatusIcon(action)}
//                 </div>
//               ))}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default HotelRegistrationActions;
