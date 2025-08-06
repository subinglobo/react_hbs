import React, { useState, useEffect } from "react";
import "./css/Register.css";
import axiosInstance from "./AxiosInstance";

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    businessType: "",
    companyType: "",
    firstName: "",
    lastName: "",
    mobileNo: "",
    mailId: "",
    country: "",
    province: "",
    city: "",
    address: "",
    classification: "registered",
    gstin: "",
    provisionalGSTno: "",
    corrsmailid: "",
    regstatus: "",
    hacCode: "",
    type: "yes",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [places, setPlaces] = useState("");
  const username = "admin";
  const password = "123";
  const authToken = btoa(`${username}:${password}`);

  // Debug errors state changes
  useEffect(() => {
    console.log("errors state updated:", errors);
  }, [errors]);

  const countryList = async () => {
    try {
      const response = await axiosInstance.get("/api/country");
      setCountries(response.data);
    } catch (error) {
      console.log("error for country list :", error);
    }
  };

  useEffect(() => {
    countryList();
  }, []);

  const provinceList = async (countryId) => {
    try {
      const response = await axiosInstance.get(`/api/province/${countryId}`);

      setProvinces(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("axios call error for province list : ", error);
    }
  };

  useEffect(() => {
    if (formData.country) {
      setProvinces([]); // Reset states when country changes
      setPlaces([]); // Reset cities when country changes
      const selectedCountry = countries.find(
        (c) => c.name === formData.country
      );
      if (selectedCountry) {
        console.log("selectedCountry:::", selectedCountry);
        provinceList(selectedCountry.id);
      }
    }
  }, [formData.country, countries]);

  useEffect(() => {
    if (formData.province) {
      setPlaces([]); // Reset cities when state changes
      const selectedState = provinces.find(
        (s) => s.stateName === formData.province
      );
      if (selectedState) {
        //fetchCities(selectedState.id);
      }
    }
  }, [formData.province, provinces]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name === "country") {
        return {
          ...prevData,
          country: value,
          province: "",
          city: "",
        };
      }
      if (name === "province") {
        return {
          ...prevData,
          province: value,
          city: "",
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
    if (!formData.companyType)
      newErrors.companyType = "Company Type is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.mobileNo.trim())
      newErrors.mobileNo = "Mobile Number is required";
    if (!formData.mailId.trim()) newErrors.mailId = "Email ID is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.province) newErrors.province = "Province is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    // Additional format validations
    if (formData.mailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mailId))
      newErrors.mailId = "Invalid email format";
    if (
      formData.mobileNo &&
      !/^\+?\d{10,15}$/.test(formData.mobileNo.replace(/\s/g, ""))
    )
      newErrors.mobileNo = "Mobile Number must be 10-15 digits";

    // GST fields validation (only if companyType is 3 or 5)
    if (formData.companyType === "3" || formData.companyType === "5") {
      if (formData.classification === "registered" && !formData.gstin.trim())
        newErrors.gstin = "GSTIN is required for registered agencies";
      if (formData.gstin && !/^[A-Z0-9]{15}$/.test(formData.gstin.trim()))
        newErrors.gstin = "GSTIN must be 15 alphanumeric characters";
      if (
        formData.corrsmailid &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.corrsmailid)
      )
        newErrors.corrsmailid = "Invalid correspondence email format";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    console.log("formErrors::", formErrors);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      console.log("errors state after setErrors:", formErrors);
      return;
    }
    console.log("Form Data Submitted:", formData);
    setFormData({
      companyName: "",
      businessType: "",
      companyType: "",
      firstName: "",
      lastName: "",
      mobileNo: "",
      mailId: "",
      country: "",
      province: "",
      city: "",
      address: "",
      classification: "registered",
      gstin: "",
      provisionalGSTno: "",
      corrsmailid: "",
      regstatus: "",
      hacCode: "",
      type: "yes",
    });
    setErrors({});
  };

  const cities = {
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Texas: ["Houston", "Austin", "Dallas"],
    "New York": ["New York City", "Buffalo", "Rochester"],
    Ontario: ["Toronto", "Ottawa", "Mississauga"],
    Quebec: ["Montreal", "Quebec City", "Laval"],
    "British Columbia": ["Vancouver", "Victoria", "Kelowna"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore"],
    Delhi: ["New Delhi", "Noida", "Gurgaon"],
    England: ["London", "Manchester", "Birmingham"],
    Scotland: ["Edinburgh", "Glasgow", "Aberdeen"],
    Wales: ["Cardiff", "Swansea", "Newport"],
  };

  return (
    <div className="center">
      <div className="col-md-12">
        <div className="d-flex title-registration">
          <h3 className="account-head">Registration</h3>
          <div className="logo-container">
            <img
              className="login-logo"
              src={`${process.env.PUBLIC_URL}/images/logo.png`}
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
                          name="companyType"
                          value={formData.companyType}
                          onChange={handleChange}
                          className={`form-control company-type ${
                            errors.companyType ? "error" : ""
                          }`}
                        >
                          <option value="">SELECT</option>
                          <option value="1">B2C</option>
                          <option value="2">Cooperate Customer</option>
                          <option value="3">Travel Agents</option>
                          <option value="4">Travel Coordinator</option>
                          <option value="5">B2B</option>
                          <option value="6">DMC</option>
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
                            errors.mobileNo ? "error" : ""
                          }`}
                          id="mobileNo"
                          name="mobileNo"
                          value={formData.mobileNo}
                          onChange={handleChange}
                          placeholder="Mobile No"
                        />
                        <p className="error-text">{errors.mobileNo || ""}</p>
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
                            errors.mailId ? "error" : ""
                          }`}
                          id="mailId"
                          name="mailId"
                          value={formData.mailId}
                          onChange={handleChange}
                          placeholder="Enter EmailId"
                        />
                        <p className="error-text">{errors.mailId || ""}</p>
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
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className={`form-control country ${
                            errors.country ? "error" : ""
                          }`}
                        >
                          <option value="">SELECT</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.name}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        <p className="error-text">{errors.country || ""}</p>
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
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          className={`form-control province ${
                            errors.province ? "error" : ""
                          }`}
                          disabled={!formData.country}
                        >
                          <option value="">SELECT</option>
                          {Array.isArray(provinces) &&
                            provinces.map((province) => (
                              <option
                                key={province.id}
                                value={province.stateName}
                              >
                                {province.stateName}
                              </option>
                            ))}
                        </select>
                        <p className="error-text">{errors.province || ""}</p>
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
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`form-control city ${
                            errors.city ? "error" : ""
                          }`}
                          disabled={!formData.province}
                        >
                          <option value="">SELECT</option>
                          {formData.province &&
                            cities[formData.province]?.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                        </select>
                        <p className="error-text">{errors.city || ""}</p>
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
                        formData.companyType !== "3" &&
                        formData.companyType !== "5"
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
                              id="agentgstId"
                              name="agentgstId"
                              value=""
                            />
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-6 form-group">
                          <div className="col-xs-3 col-md-4">
                            <label className="color-grey">Agency GSTIN</label>
                          </div>
                          <div className="col-xs-6 col-md-8">
                            <input
                              type="text"
                              name="gstin"
                              id="gstin"
                              value={formData.gstin}
                              onChange={handleChange}
                              placeholder="Agency GSTIN"
                              className={`form-control gstin ${
                                errors.gstin ? "error" : ""
                              }`}
                              maxLength={30}
                              minLength={1}
                            />
                            <p className="error-text">{errors.gstin || ""}</p>
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
