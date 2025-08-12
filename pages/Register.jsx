import React, { useState, useEffect } from "react";
import "../styles/Register.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Card, Form, Row, Col, Button } from "react-bootstrap";

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    businessType: "",
    agentCategoryId: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    personalEmail: "",
    countryId: "",
    provinceId: "",
    placeId: "",
    address: "",
    agentClassification: "registered",
    agentGstIn: "",
    agentProvisionalGstno: "",
    agentCorrespondmail: "",
    agentRegisterstatus: "",
    agentHsncode: "",
    agentStatus: "yes",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [places, setPlaces] = useState("");
  const [agentCategoryies, setAgentCategoryies] = useState([]);

  const agentCategoryList = async () => {
    try {
      const agentCatResponse = await axios.get("/api/agentCategory");
      setAgentCategoryies(agentCatResponse.data);
    } catch (error) {
      console.log("agent category api call error::", error);
    }
  };

  const countryList = async () => {
    try {
      const response = await axios.get("/api/country");
      setCountries(response.data);
    } catch (error) {
      console.log("error for country list :", error);
    }
  };

  useEffect(() => {
    countryList();
    agentCategoryList();
  }, []);

  const provinceList = async (countryId) => {
    try {
      const response = await axios.get(
        `/api/province/getByCountryId/${countryId}`
      );

      setProvinces(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("axios call error for province list : ", error);
    }
  };

  const cityList = async (stateId) => {
    try {
      const response = await axios.get(`/api/destination/getplaces/${stateId}`);
      setPlaces(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("axios call error for city list : ", error);
    }
  };

  useEffect(() => {
    if (formData.countryId) {
      setProvinces([]); // Reset states when country changes
      setPlaces([]); // Reset cities when country changes
      provinceList(formData.countryId);
    }
  }, [formData.countryId]);

  useEffect(() => {
    if (formData.provinceId) {
      setPlaces([]); // Reset cities when state changes
      cityList(formData.provinceId);
    }
  }, [formData.provinceId]);

  const handleChange = (e) => {
    console.log("handle change click");
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name === "agentCategoryId") {
        return {
          ...prevData,
          agentCategoryId: value,
        };
      }

      if (name === "countryId") {
        return {
          ...prevData,
          countryId: value,
          provinceId: "",
          placeId: "",
        };
      }
      if (name === "provinceId") {
        return {
          ...prevData,
          provinceId: value,
          placeId: "",
        };
      }
      if (name === "placeId") {
        return {
          ...prevData,
          placeId: value,
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.companyName.trim())
      newErrors.companyName = "Company Name is required";
    if (!formData.businessType.trim())
      newErrors.businessType = "Business Type is required";
    if (!formData.agentCategoryId)
      newErrors.agentCategoryId = "Company Type or Agent category is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile Number is required";
    if (!formData.personalEmail.trim())
      newErrors.personalEmail = "Email ID is required";
    if (!formData.countryId) newErrors.countryId = "Country is required";
    if (!formData.provinceId) newErrors.provinceId = "Province is required";
    if (!formData.placeId) newErrors.placeId = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    // Additional format validations
    if (
      formData.personalEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)
    )
      newErrors.personalEmail = "Invalid email format";
    if (
      formData.mobileNumber &&
      !/^\+?\d{10,15}$/.test(formData.mobileNumber.replace(/\s/g, ""))
    )
      newErrors.mobileNumber = "Mobile Number must be 10-15 digits";

    // GST fields validation (only if companyType is 3 or 5)
    if (formData.countryId === "1") {
      if (
        formData.agentClassification === "registered" &&
        !formData.agentGstIn.trim()
      )
        newErrors.agentGstIn = "GSTIN is required for registered agencies";
      if (
        formData.agentGstIn &&
        !/^[A-Z0-9]{15}$/.test(formData.agentGstIn.trim())
      )
        newErrors.agentGstIn = "GSTIN must be 15 alphanumeric characters";
      if (
        formData.agentCorrespondmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.agentCorrespondmail)
      )
        newErrors.agentCorrespondmail = "Invalid correspondence email format";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    // Make the function async
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const registerResponse = await axios.post(
        "/api/agent/register",
        formData
      );
      console.log("registerResponse::", registerResponse);
      toast.success('Successfully Registered!')

     // Reset form on success
      setFormData({
        companyName: "",
        businessType: "",
        agentCategoryId: "",
        firstName: "",
        lastName: "",
        mobileNumber: "",
        personalEmail: "",
        countryId: "",
        provinceId: "",
        placeId: "",
        address: "",
        agentClassification: "registered",
        agentGstIn: "",
        agentProvisionalGstno: "",
        agentCorrespondmail: "",
        agentRegisterstatus: "",
        agentHsncode: "",
        agentStatus: "yes",
      });
      setErrors({});
    } catch (error) {
      if (error.response) {
        // Display the error message from server
        if (error.response.data.message) {
          // alert(error.response.data.message);  // Show error message as alert
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred during registration");
        }

        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Network error - please try again");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="center">
      <div className="col-md-12">
        <div className="d-flex title-registration">
          <h3 className="account-head">Registration</h3>
          <div className="logo-container">
            <img
              className="login-logo"
              src={`${process.env.PUBLIC_URL}/images/logo-1.jpg`}
              alt="Logo"
              style={{ width: "150px" }}
            />
          </div>
        </div>
        <div className="step-pane active" id="step1">
          <Form onSubmit={handleSubmit} id="registerForm" noValidate autoComplete="off">
            <Card className="rounded-xl shadow-sm">
              <Card.Body>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group controlId="companyName">
                      <Form.Label>
                        <span className="required">*</span> Company Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        className={errors.companyName ? "error" : ""}
                      />
                      <Form.Text className="text-danger">{errors.companyName || ""}</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="businessType">
                      <Form.Label>
                        <span className="required">*</span> Business Type
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        placeholder="e.g. Travel Agency"
                        className={errors.businessType ? "error" : ""}
                        maxLength={15}
                      />
                      <Form.Text className="text-danger">{errors.businessType || ""}</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="companyType">
                      <Form.Label>
                        <span className="required">*</span> Company Type
                      </Form.Label>
                      <Form.Select
                        name="agentCategoryId"
                        value={formData.agentCategoryId}
                        onChange={handleChange}
                        className={errors.agentCategoryId ? "error" : ""}
                      >
                        <option value="">SELECT</option>
                        {agentCategoryies.map((agent) => (
                          <option key={agent.agentCategoryId} value={agent.agentCategoryId}>
                            {agent.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-danger">{errors.companyType || ""}</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="firstName">
                      <Form.Label>
                        <span className="required">*</span> First Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        className={errors.firstName ? "error" : ""}
                        maxLength={15}
                      />
                      <Form.Text className="text-danger">{errors.firstName || ""}</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="lastName">
                      <Form.Label>
                        <span className="required">*</span> Last Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        className={errors.lastName ? "error" : ""}
                        maxLength={15}
                      />
                      <Form.Text className="text-danger">{errors.lastName || ""}</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="mobileNo">
                      <Form.Label>
                        <span className="required">*</span> Mobile Number
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="10-15 digits"
                        className={errors.mobileNumber ? "error" : ""}
                        maxLength={10}
                      />
                      <Form.Text className="text-danger">{errors.mobileNumber || ""}</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="mailId">
                      <Form.Label>
                        <span className="required">*</span> Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="personalEmail"
                        value={formData.personalEmail}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className={errors.personalEmail ? "error" : ""}
                      />
                      <Form.Text className="text-danger">{errors.personalEmail || ""}</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group controlId="country">
                      <Form.Label>
                        <span className="required">*</span> Country
                      </Form.Label>
                      <Form.Select
                        name="countryId"
                        value={formData.countryId}
                        onChange={handleChange}
                        className={errors.countryId ? "error" : ""}
                      >
                        <option value="">SELECT</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-danger">{errors.countryId || ""}</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group controlId="province">
                      <Form.Label>
                        <span className="required">*</span> Province
                      </Form.Label>
                      <Form.Select
                        name="provinceId"
                        value={formData.provinceId}
                        onChange={handleChange}
                        disabled={!formData.countryId}
                        className={errors.provinceId ? "error" : ""}
                      >
                        <option value="">SELECT</option>
                        {Array.isArray(provinces) &&
                          provinces.map((province) => (
                            <option key={province.id} value={province.id}>
                              {province.stateName}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Text className="text-danger">{errors.provinceId || ""}</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group controlId="city">
                      <Form.Label>
                        <span className="required">*</span> City
                      </Form.Label>
                      <Form.Select
                        name="placeId"
                        value={formData.placeId}
                        onChange={handleChange}
                        disabled={!formData.provinceId}
                        className={errors.placeId ? "error" : ""}
                      >
                        <option value="">SELECT</option>
                        {Array.isArray(places) &&
                          places.map((place) => (
                            <option key={place.id} value={place.id}>
                              {place.name}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Text className="text-danger">{errors.placeId || ""}</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="address">
                      <Form.Label>
                        <span className="required">*</span> Address
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        className={errors.address ? "error" : ""}
                      />
                      <Form.Text className="text-danger">{errors.address || ""}</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                {/* GST section (India) */}
                {formData.countryId === "1" && (
                  <Card className="mt-4">
                    <Card.Header className="fw-semibold">Agency GST Details</Card.Header>
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group controlId="classification">
                            <Form.Label>Agency Classification</Form.Label>
                            <Form.Select
                              name="classification"
                              value={formData.classification}
                              onChange={handleChange}
                            >
                              <option value="registered">Registered</option>
                              <option value="unregistered">Unregistered</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="gstin">
                            <Form.Label>
                              <span className="required">*</span> Agency GSTIN
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="agentGstIn"
                              value={formData.agentGstIn}
                              onChange={handleChange}
                              placeholder="Agency GSTIN"
                              className={errors.agentGstIn ? "error" : ""}
                              maxLength={30}
                            />
                            <Form.Text className="text-danger">{errors.agentGstIn || ""}</Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="provisionalGSTno">
                            <Form.Label>Provisional GST NO</Form.Label>
                            <Form.Control
                              type="text"
                              name="provisionalGSTno"
                              value={formData.provisionalGSTno}
                              onChange={handleChange}
                              placeholder="Provisional GST No"
                              maxLength={30}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="corrsmailid">
                            <Form.Label>Correspondence Mail ID</Form.Label>
                            <Form.Control
                              type="text"
                              name="corrsmailid"
                              value={formData.corrsmailid}
                              onChange={handleChange}
                              placeholder="Correspondence Mail ID"
                              className={errors.corrsmailid ? "error" : ""}
                              maxLength={30}
                            />
                            <Form.Text className="text-danger">{errors.corrsmailid || ""}</Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="regstatus">
                            <Form.Label>GST Registration Status</Form.Label>
                            <Form.Control
                              type="text"
                              name="regstatus"
                              value={formData.regstatus}
                              onChange={handleChange}
                              placeholder="GST Registration Status"
                              maxLength={30}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="hacCode">
                            <Form.Label>HSN/SAC Code</Form.Label>
                            <Form.Control
                              type="text"
                              name="hacCode"
                              value={formData.hacCode}
                              onChange={handleChange}
                              placeholder="HSN/SAC Code"
                              maxLength={30}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="type">
                            <Form.Label>Composition Levy as per Section 10 of GST</Form.Label>
                            <Form.Select
                              name="type"
                              value={formData.type}
                              onChange={handleChange}
                            >
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}

                <div className="wizard-actions save mt-4">
                  <Button type="submit" variant="warning" className="px-4" id="createRegisterForm">
                    Create
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
