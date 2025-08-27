import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Table,
  Badge,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import toast from "react-hot-toast";
import axiosInstance from "../../components/AxiosInstance";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/TopBar";
import AsyncSelect from "react-select/async";
import "../../styles/CityMapping.css";

const CityMapping = () => {
  const [loading, setLoading] = useState(false);
  const [mappings, setMappings] = useState([]);
  const [selectedCountryOption, setSelectedCountryOption] = useState(null);
  const [selectedCityOption, setSelectedCityOption] = useState(null);
  const [selectedPlatformCountryOption, setselectedPlatformCountryOption] =
    useState(null);
  const [selectedPlatformCityOption, setSelectedPlatformCityOption] =
    useState(null);

  const [platforms] = useState([
    "Iwtx",
    "Atharva",
    "Darina",
    "Jumeirah",
    "X3",
    "Ratehawk",
  ]);

  // Row-wise selections and status per platform in the overview table
  const [rowState, setRowState] = useState({});

  useEffect(() => {
    // Initialize per-platform state
    const initial = {};
    platforms.forEach((p) => {
      initial[p] = {
        countryOption: null,
        cityOption: null,
        searching: false,
        status: null, // 'success' | 'fail' | null
      };
    });
    setRowState(initial);
  }, []);

  const [formData, setFormData] = useState({
    masterCountryId: "",
    masterCityId: "",
    apiProvider: "",
    apiCountryId: "",
    apiCityId: "",
  });

  // Generic form input handler
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Load countries dynamically for AsyncSelect
  const loadCountries = async (inputValue) => {
    try {
      const response = await axiosInstance.get("/api/country", {
        params: { search: inputValue },
      });
      return response.data.map((c) => ({ value: c.id, label: c.name }));
    } catch (error) {
      console.error("Error loading countries:", error);
      return [];
    }
  };

  // Load cities dynamically for AsyncSelect based on selected country
  const loadCities = async (inputValue) => {
    if (!formData.masterCountryId) return [];
    try {
      const response = await axiosInstance.get(
        `/api/province/getByCountryId/${formData.masterCountryId}`,
        { params: { search: inputValue } }
      );
      return response.data.map((c) => ({
        value: c.id,
        label: `${c.stateName}, ${c.country}`,
      }));
    } catch (error) {
      console.error("Error loading cities:", error);
      return [];
    }
  };

  // Load platform country
  const loadPlatformCountry = async (inputValue) => {
    try {
      const response = await axiosInstance.get("/api/country", {
        params: { search: inputValue },
      });
      return response.data.map((c) => ({ value: c.id, label: c.name }));
    } catch (error) {
      console.error("Error loading platform countries:", error);
      return [];
    }
  };

  // Load platform city
  const loadPlatformCity = async (inputValue) => {
    if (!formData.masterCountryId) return [];
    try {
      const response = await axiosInstance.get(
        `/api/destination/getCitiesByCountryId/${formData.masterCountryId}`,
        { params: { search: inputValue } }
      );
      return response.data.map((c) => ({ value: c.id, label: c.name }));
    } catch (error) {
      console.error("Error loading platform cities:", error);
      return [];
    }
  };

  // Row: load cities by selected platform country for that row
  const loadPlatformCityByCountry = (countryId) => async (inputValue) => {
    if (!countryId) return [];
    try {
      const response = await axiosInstance.get(
        `/api/destination/getCitiesByCountryId/${countryId}`,
        { params: { search: inputValue } }
      );
      return response.data.map((c) => ({ value: c.id, label: c.name }));
    } catch (error) {
      console.error("Error loading platform cities (row):", error);
      return [];
    }
  };

  // Country select handler
  const handleCountrySelect = (option) => {
    setSelectedCountryOption(option);
    setFormData((prev) => ({
      ...prev,
      masterCountryId: option ? option.value : "",
      masterCityId: "", // reset city when country changes
    }));
    setSelectedCityOption(null);
  };

  // City select handler
  const handleCitySelect = (option) => {
    setSelectedCityOption(option);
    setFormData((prev) => ({
      ...prev,
      masterCityId: option ? option.value : "",
    }));
  };

  // Row handlers
  const handleRowCountryChange = (platform, option) => {
    setRowState((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        countryOption: option,
        cityOption: null,
        status: null,
      },
    }));
  };

  const handleRowCityChange = (platform, option) => {
    setRowState((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], cityOption: option, status: null },
    }));
  };

  const handleRowSearch = async (platform) => {
    const current = rowState[platform] || {};
    const apiCountryId = current.countryOption?.value || "";
    const apiCityId = current.cityOption?.value || "";

    if (!apiCountryId) {
      toast.error("Select Platform Country first");
      return;
    }
    if (!apiCityId) {
      toast.error("Select Platform City first");
      return;
    }

    setRowState((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], searching: true, status: null },
    }));

    try {
      let searchReq = {
        apiProvider: platform,
        apiCountryId,
        apiCityId,
      };
      const response = await axiosInstance.post(
        "/api/cityMapping/search",
        searchReq
      );

      console.log("response search data:::" , response)

      const data = response?.data;
      const found = Array.isArray(data) ? data.length > 0 : Boolean(data);

      setRowState((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          status: found ? "success" : "fail",
          searching: false,
        },
      }));
    } catch (error) {
      console.error("Row validation error:", error);
      toast.error("Search failed");
      setRowState((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], status: "fail", searching: false },
      }));
    }
  };

  // Platform  Country select handler
  const handlePlatformCountrySelect = (option) => {
    setselectedPlatformCountryOption(option);
    setFormData((prev) => ({
      ...prev,
      apiCountryId: option ? option.value : "",
      apiCityId: "", // reset city when country changes
    }));
    setSelectedPlatformCityOption(null);
  };

  //Platform City select handler
  const handlePlatformCitySelect = (option) => {
    setSelectedPlatformCityOption(option);
    setFormData((prev) => ({
      ...prev,
      apiCityId: option ? option.value : "",
    }));
  };

  // Save mapping
  const handleAddMapping = async () => {
    if (
      !formData.masterCountryId ||
      !formData.masterCityId ||
      !formData.apiProvider
    ) {
      toast.error("⚠ Please fill all required fields");
      return;
    }

    try {
      const res = await axiosInstance.post(
        "/api/iwtxCityMapping/save",
        formData
      );
      setMappings((prev) => [...prev, res.data]);
      toast.success("Mapping added successfully ✅");

      // Reset form
      setFormData({
        masterCountryId: "",
        masterCityId: "",
        apiProvider: "",
        apiCountryId: "",
        apiCityId: "",
      });
      setSelectedCountryOption(null);
      setSelectedCityOption(null);
    } catch (err) {
      toast.error("Failed to save mapping ❌");
      console.error(err);
    }
  };

  // Example rules for each platform
  const platformVisibility = {
    Iwtx: { showCountry: false, showCity: false },
    Atharva: { showCountry: true, showCity: true },
    Darina: { showCountry: true, showCity: false },
    Jumeirah: { showCountry: true, showCity: true },
    Jumeirah: { showCountry: true, showCity: true },
    Jumeirah: { showCountry: true, showCity: true },
    // add more platforms as needed
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Topbar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <h3 className="mb-3">City Mapping</h3>
          <p className="text-muted">
            Map master countries & cities to external API platforms.
          </p>

          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Row className="mb-3">
                    {/* Country */}
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Master Country</Form.Label>
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          placeholder="Search country..."
                          value={selectedCountryOption}
                          loadOptions={loadCountries}
                          onChange={handleCountrySelect}
                        />
                      </Form.Group>
                    </Col>

                    {/* City */}
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Master City</Form.Label>
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          placeholder="Search & select city..."
                          value={selectedCityOption}
                          loadOptions={loadCities}
                          onChange={handleCitySelect}
                          isDisabled={!formData.masterCountryId}
                        />
                      </Form.Group>
                    </Col>

                    {/* Platform */}
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Platform</Form.Label>
                        <Form.Select
                          name="apiProvider"
                          value={formData.apiProvider}
                          onChange={handleChange}
                        >
                          <option value="">Select Platform</option>
                          {platforms.map((p, idx) => (
                            <option key={idx} value={p}>
                              {p}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    {/* Conditionally render based on config */}
                    {platformVisibility[formData.apiProvider]?.showCountry && (
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Platform Country</Form.Label>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            placeholder="Search country..."
                            value={selectedPlatformCountryOption}
                            loadOptions={loadPlatformCountry}
                            onChange={handlePlatformCountrySelect}
                          />
                        </Form.Group>
                      </Col>
                    )}

                    {platformVisibility[formData.apiProvider]?.showCity && (
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Platform City</Form.Label>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            placeholder="Search & select city..."
                            value={selectedPlatformCityOption}
                            loadOptions={loadPlatformCity}
                            onChange={handlePlatformCitySelect}
                            isDisabled={!formData.apiProvider}
                          />
                        </Form.Group>
                      </Col>
                    )}

                    <Col md={4} className="d-flex align-items-end">
                      <Button variant="primary" onClick={handleAddMapping}>
                        ➕ Add Mapping
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              {/* Mappings Table */}

              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">Mappings Overview</h5>
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="mapping-table"
                  >
                    <thead>
                      <tr>
                        <th>Platform</th>
                        <th>Platform Country</th>
                        <th>Platform City</th>
                        <th>Action</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {platforms.map((p, idx) => {
                        const state = rowState[p] || {};

                        return (
                          <tr key={idx}>
                            <td>{p}</td>

                            {/* Dropdown for Platform Country */}
                            <td>
                              <div style={{ width: "100%", maxWidth: 360 }}>
                                <AsyncSelect
                                  cacheOptions
                                  defaultOptions
                                  placeholder="Search country..."
                                  value={state.countryOption}
                                  loadOptions={loadPlatformCountry}
                                  onChange={(opt) =>
                                    handleRowCountryChange(p, opt)
                                  }
                                  classNamePrefix="pill-select"
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      borderRadius: 999,
                                      minHeight: 40,
                                    }),
                                  }}
                                />
                              </div>
                            </td>

                            {/* Dropdown or readonly for Platform City */}
                            <td>
                              <div style={{ width: "100%", maxWidth: 380 }}>
                                <AsyncSelect
                                  cacheOptions
                                  defaultOptions
                                  placeholder="Search & select city..."
                                  value={state.cityOption}
                                  loadOptions={loadPlatformCityByCountry(
                                    state.countryOption?.value
                                  )}
                                  onChange={(opt) =>
                                    handleRowCityChange(p, opt)
                                  }
                                  isDisabled={!state.countryOption}
                                  classNamePrefix="pill-select"
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      borderRadius: 999,
                                      minHeight: 40,
                                    }),
                                  }}
                                />
                              </div>
                            </td>

                            {/* Action */}
                            <td>
                              <Button
                                className="btn-indigo"
                                disabled={state.searching}
                                onClick={() => handleRowSearch(p)}
                              >
                                {state.searching ? "Searching..." : "Search"}
                              </Button>
                            </td>

                            {/* Status */}
                            <td>
                              {state.status === "success" && (
                                <Badge bg="success">✔</Badge>
                              )}
                              {state.status === "fail" && (
                                <Badge bg="danger">✖</Badge>
                              )}
                              {!state.status && <span>-</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              {/* <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">Mappings Overview</h5>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Platform</th>
                        <th>Platform Country</th>
                        <th>Platform City</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {platforms.map((p, idx) => {
                        const mapped = mappings.find((m) => m.apiProvider === p);
                        return (
                          <tr key={idx}>
                            <td>{p}</td>
                            <td>{mapped?.apiCountryId || "-"}</td>
                            <td>{mapped?.apiCityId || "-"}</td>
                            <td>
                              {mapped ? (
                                <Badge bg="success">✔</Badge>
                              ) : (
                                <Badge bg="danger">✖</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card> */}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CityMapping;
