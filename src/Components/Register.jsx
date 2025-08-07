import React, { useState, useEffect } from "react";
import "./css/Register.css";
import axios from "axios";

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
  const [agentCategoryies , setAgentCategoryies] = useState([]);

  const agentCategoryList = async() => {

    try{

      const agentCatResponse = await axios.get('/api/agentCategory');
      setAgentCategoryies(agentCatResponse.data);

    }catch(error){
      console.log("agent category api call error::" , error)
    }
  }

  
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
      const response = await axios.get(`/api/province/getByCountryId/${countryId}`);

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
      if(name === "agentCategoryId"){
        return {
          ...prevData,
          agentCategoryId:value,
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
    if (!formData.mobileNumber.trim())  newErrors.mobileNumber = "Mobile Number is required";
    if (!formData.personalEmail.trim()) newErrors.personalEmail = "Email ID is required";
    if (!formData.countryId) newErrors.countryId = "Country is required";
    if (!formData.provinceId) newErrors.provinceId = "Province is required";
    if (!formData.placeId) newErrors.placeId = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    // Additional format validations
    if (formData.personalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail))
      newErrors.personalEmail = "Invalid email format";
    if (
      formData.mobileNumber &&
      !/^\+?\d{10,15}$/.test(formData.mobileNumber.replace(/\s/g, ""))
    )
      newErrors.mobileNumber = "Mobile Number must be 10-15 digits";

    // GST fields validation (only if companyType is 3 or 5)
    if (formData.countryId === "1" ) {
      if (formData.agentClassification === "registered" && !formData.agentGstIn.trim())
        newErrors.agentGstIn = "GSTIN is required for registered agencies";
      if (formData.agentGstIn && !/^[A-Z0-9]{15}$/.test(formData.agentGstIn.trim()))
        newErrors.agentGstIn = "GSTIN must be 15 alphanumeric characters";
      if (
        formData.agentCorrespondmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.agentCorrespondmail)
      )
        newErrors.agentCorrespondmail = "Invalid correspondence email format";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {  // Make the function async
  e.preventDefault();
  const formErrors = validateForm();
  
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  try {
    const registerResponse = await axios.post('/api/agent/register', formData);
    console.log("registerResponse::", registerResponse);
    
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
      // Server responded with a status code outside 2xx range
      console.error("Registration error:", error.response.data);
      
      // Display the error message from server
      if (error.response.data.message) {
        alert(error.response.data.message);  // Show error message as alert
      } else {
        alert("An error occurred during registration");
      }
      
      // Optionally set specific form errors
      if (error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
      alert("Network error - please try again");
    } else {
      // Something happened in setting up the request
      console.error("Request setup error:", error.message);
      alert("An unexpected error occurred");
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
          <form
            onSubmit={handleSubmit}
            method="post"
            id="registerForm"
            noValidate
            autoComplete="off"
          >
            <input
              type="hidden"
              id="contactDetailsId"
              name="contactDetailsId"
              value=""
            />
            <div className="unwrap">
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="row">
                    <div className="col-xs-12 col-md-12 form-group">
                      <div className="col-xs-3 col-md-2">
                        <label className="color-grey">
                          <span className="required">*</span>Company Name
                        </label>
                      </div>
                      <div className="col-xs-6 col-md-10">
                        <input
                          type="text"
                          className={`form-control company-name ${
                            errors.companyName ? "error" : ""
                          }`}
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Company Name"
                        />
                        <p className="error-text">{errors.companyName || ""}</p>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 form-group">
                      <div className="col-xs-3 col-md-4">
                        <label className="color-grey">
                          <span className="required">*</span>Business Type
                        </label>
                      </div>
                      <div className="col-xs-6 col-md-8">
                        <input
                          type="text"
                          name="businessType"
                          id="businessType"
                          value={formData.businessType}
                          onChange={handleChange}
                          placeholder="Business Type"
                          className={`form-control business-type ${
                            errors.businessType ? "error" : ""
                          }`}
                          maxLength={15}
                          minLength={1}
                        />
                        <p className="error-text">
                          {errors.businessType || ""}
                        </p>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 form-group">
                      <div className="col-xs-3 col-md-4">
                        <label className="color-grey">
                          <span className="required">*</span>Company Type
                        </label>
                      </div>
                      <div className="col-xs-6 col-md-8">
                        <select
                          id="companyType"
                          name="agentCategoryId"
                          value={formData.agentCategoryId}
                          onChange={handleChange}
                          className={`form-control company-type ${
                            errors.agentCategoryId ? "error" : ""
                          }`}
                        >
                          <option value="">SELECT</option>
                            {agentCategoryies.map((agent) => (
                            <option key={agent.agentCategoryId} value={agent.agentCategoryId}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                        <p className="error-text">{errors.companyType || ""}</p>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-12 form-group">
                      <div className="col-xs-3 col-md-2">
                        <label className="color-grey text-nowrap">
                          <span className="required">*</span>Authorized Person
                        </label>
                      </div>
                      <div className="col-xs-12 col-md-5">
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First Name"
                          className={`form-control first-name ${
                            errors.firstName ? "error" : ""
                          }`}
                          maxLength={15}
                          minLength={1}
                        />
                        <p className="error-text">{errors.firstName || ""}</p>
                      </div>
                      <div className="col-xs-12 col-md-5">
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last Name"
                          className={`form-control last-name ${
                            errors.lastName ? "error" : ""
                          }`}
                          maxLength={15}
                          minLength={1}
                        />
                        <p className="error-text">{errors.lastName || ""}</p>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 form-group">
                      <div className="col-xs-3 col-md-4">
                        <label className="color-grey">
                          <span className="required">*</span>Mobile Number
                        </label>
                      </div>
                      <div className="col-xs-6 col-md-8">
                        <input
                          type="text"
                          className={`form-control mobile-no ${
                            errors.mobileNumber ? "error" : ""
                          }`}
                          id="mobileNo"
                          name="mobileNumber"
                          maxLength={10}
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          placeholder="Mobile No"
                        />
                        <p className="error-text">{errors.mobileNumber || ""}</p>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 form-group">
                      <div className="col-xs-3 col-md-4">
                        <label className="color-grey">
                          <span className="required">*</span>Mail Id
                        </label>
                      </div>
                      <div className="col-xs-6 col-md-8">
                        <input
                          type="email"
                          className={`form-control mail-id ${
                            errors.personalEmail ? "error" : ""
                          }`}
                          id="mailId"
                          name="personalEmail"
                          value={formData.personalEmail}
                          onChange={handleChange}
                          placeholder="Enter EmailId"
                        />
                        <p className="error-text">{errors.personalEmail}</p>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 form-group">
                      <div className="col-xs-3 col-md-4">
                        <label className="color-grey">
                          <span className="required">*</span>Country
                        </label>
                      </div>
                      <div className="col-xs-6 col-md-8">
                        <select
                          id="country"
                          name="countryId"
                          value={formData.countryId}
                          onChange={handleChange}
                          className={`form-control country ${
                            errors.countryId ? "error" : ""
                          }`}
                        >
                          <option value="">SELECT</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        <p className="error-text">{errors.countryId || ""}</p>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 form-group">
                      <div className="col-xs-3 col-md-4">
                        <label className="color-grey">
                          <span className="required">*</span>Province
                        </label>
                      </div>
                      <div className="col-xs-6 col-md-8">
                        <select
                          id="province"
                          name="provinceId"
                          value={formData.provinceId}
                          onChange={handleChange}
                          className={`form-control province ${
                            errors.provinceId ? "error" : ""
                          }`}
                          disabled={!formData.countryId}
                        >
                          <option value="">SELECT</option>
                          {Array.isArray(provinces) &&
                            provinces.map((province) => (
                              <option
                                key={province.id}
                                value={province.id}
                              >
                                {province.stateName}
                              </option>
                            ))}
                        </select>
                        <p className="error-text">{errors.provinceId || ""}</p>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 form-group">
                      <div className="col-xs-3 col-md-4">
                        <label className="color-grey">
                          <span className="required">*</span>City
                        </label>
                      </div>
                      <div className="col-xs-6 col-md-8">
                        <select
                          id="city"
                          name="placeId"
                          value={formData.placeId}
                          onChange={handleChange}
                          className={`form-control city ${
                            errors.placeId ? "error" : ""
                          }`}
                          disabled={!formData.provinceId}
                        >
                          <option value="">SELECT</option>
                         {Array.isArray(places) &&
                            places.map((place) => (
                              <option
                                key={place.id}
                                value={place.id}
                              >
                                {place.name}
                              </option>
                            ))}
                        </select>
                        <p className="error-text">{errors.placeId || ""}</p>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 form-group">
                      <div className="col-xs-3 col-md-4">
                        <label className="color-grey">
                          <span className="required">*</span>Address
                        </label>
                      </div>
                      <div className="col-xs-6 col-md-8">
                        <textarea
                          rows="2"
                          name="address"
                          id="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter Address"
                          className={`form-control address ${
                            errors.address ? "error" : ""
                          }`}
                        ></textarea>
                        <p className="error-text">{errors.address || ""}</p>
                      </div>
                    </div>
                    <div
                      className="col-xs-12 agent-detail"
                      hidden={
                        formData.countryId !== "1"
                      }
                    >
                      <div className="row">
                        <div className="col-xs-12">
                          <div className="col-xs-12">
                            <h4 className="gst-title">Agency GST Details</h4>
                          </div>
                        </div>
                        <div className="clearfix"></div>
                        <div className="col-xs-12 col-md-6 form-group">
                          <div className="col-xs-3 col-md-4">
                            <label className="color-grey">
                             Agency Classification
                            </label>
                          </div>
                          <div className="col-xs-6 col-md-8">
                            <select
                              id="classification"
                              name="classification"
                              value={formData.classification}
                              onChange={handleChange}
                              className="form-control classification"
                            >
                              <option value="registered">Registered</option>
                              <option value="unregistered">Unregistered</option>
                            </select>
                            <input
                              type="hidden"
                              id="gstInid"
                              name="gstInid"
                              value=""
                            />
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-6 form-group">
                          <div className="col-xs-3 col-md-4">
                            <label className="color-grey">
                               <span className="required">*</span> Agency GSTIN</label>
                          </div>
                          <div className="col-xs-6 col-md-8">
                            <input
                              type="text"
                              name="agentGstIn"
                              id="gstin"
                              value={formData.agentGstIn}
                              onChange={handleChange}
                              placeholder="Agency GSTIN"
                              className={`form-control gstin ${
                                errors.agentGstIn ? "error" : ""
                              }`}
                              maxLength={30}
                              minLength={1}
                            />
                            <p className="error-text">{errors.agentGstIn || ""}</p>
                          </div>
                        </div>
                        <div className="clearfix"></div>
                        <div className="col-xs-12 col-md-6 form-group">
                          <div className="col-xs-3 col-md-4">
                            <label className="color-grey">
                              Provisional GST NO
                            </label>
                          </div>
                          <div className="col-xs-6 col-md-8">
                            <input
                              type="text"
                              name="provisionalGSTno"
                              id="provisionalGSTno"
                              value={formData.provisionalGSTno}
                              onChange={handleChange}
                              placeholder="Provisional GST No"
                              className="form-control provisional-gst-no"
                              maxLength={30}
                              minLength={1}
                            />
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-6 form-group">
                          <div className="col-xs-3 col-md-4">
                            <label className="color-grey">
                              Correspondence Mail ID
                            </label>
                          </div>
                          <div className="col-xs-6 col-md-8">
                            <input
                              type="text"
                              name="corrsmailid"
                              id="corrsmailid"
                              value={formData.corrsmailid}
                              onChange={handleChange}
                              placeholder="Correspondence Mail ID"
                              className={`form-control corrs-mail-id ${
                                errors.corrsmailid ? "error" : ""
                              }`}
                              maxLength={30}
                              minLength={1}
                            />
                            <p className="error-text">
                              {errors.corrsmailid || ""}
                            </p>
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-6 form-group">
                          <div className="col-xs-3 col-md-4">
                            <label className="color-grey">
                              GST Registration Status
                            </label>
                          </div>
                          <div className="col-xs-6 col-md-8">
                            <input
                              type="text"
                              name="regstatus"
                              id="regstatus"
                              value={formData.regstatus}
                              onChange={handleChange}
                              placeholder="GST Registration Status"
                              className="form-control reg-status"
                              maxLength={30}
                              minLength={1}
                            />
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-6 form-group">
                          <div className="col-xs-3 col-md-4">
                            <label className="color-grey">HSN/SAC Code</label>
                          </div>
                          <div className="col-xs-6 col-md-8">
                            <input
                              type="text"
                              name="hacCode"
                              id="hacCode"
                              value={formData.hacCode}
                              onChange={handleChange}
                              placeholder="HSN/SAC Code"
                              className="form-control hac-code"
                              maxLength={30}
                              minLength={1}
                            />
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-6 form-group">
                          <div className="col-xs-3 col-md-4">
                            <label className="color-grey">
                              Composition Levy as per Section 10 of GST
                            </label>
                          </div>
                          <div className="col-xs-6 col-md-8">
                            <select
                              id="type"
                              name="type"
                              value={formData.type}
                              onChange={handleChange}
                              className="form-control type"
                            >
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="wizard-actions save">
              <button
                type="submit"
                className="btn-block btn btn-warning"
                id="createRegisterForm"
              >
                Create{" "}
                <i className="ace-icon fa fa-arrow-right icon-on-right"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
