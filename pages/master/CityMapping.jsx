import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";
import axiosInstance from "../../components/AxiosInstance";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/TopBar";

const CityMapping = () => {
  const [masterCountries, setMasterCountries] = useState([]);
  const [masterCities, setMasterCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [platforms, setPlatforms] = useState([
    "IWTX",
    "Travelport",
    "Darina",
    "API4",
    "API5",
    "API6",
  ]);

  const [formData, setFormData] = useState({
    masterCountry: "",
    masterCity: "",
    platform: "",
    platformCountry: "",
    platformCity: "",
  });

  const [mappings, setMappings] = useState([]);

  // Load master data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [countryRes, cityRes] = await Promise.all([
          axiosInstance.get("/api/country"),
          axiosInstance.get("/api/province"),
        ]);
        setMasterCountries(countryRes.data || []);
        setMasterCities(cityRes.data || []);
      } catch (err) {
        toast.error("Failed to load master data ❌");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddMapping = async () => {
    if (!formData.masterCountry || !formData.masterCity || !formData.platform) {
      toast.error("⚠ Please fill all required fields");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/province", formData);
      setMappings((prev) => [...prev, res.data]);
      toast.success("Mapping added successfully ✅");

      // reset form
      setFormData({
        masterCountry: "",
        masterCity: "",
        platform: "",
        platformCountry: "",
        platformCity: "",
      });
    } catch (err) {
      toast.error("Failed to save mapping ❌");
      console.error(err);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Topbar */}
      <Topbar />

      <Row className="flex-grow-1 g-0">
        {/* Sidebar */}
        <Col md={2} className="bg-light border-end">
          <Sidebar />
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4">
          <h3 className="mb-3">City Mapping</h3>
          <p className="text-muted">
            Map master countries & cities to external API platforms.
          </p>

          {/* Loader */}
          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {/* Mapping Form */}
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Master Country</Form.Label>
                        <Form.Select
                          name="masterCountry"
                          value={formData.masterCountry}
                          onChange={handleChange}
                        >
                          <option value="">Select Country</option>
                          {masterCountries.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Master City</Form.Label>
                        <Form.Select
                          name="masterCity"
                          value={formData.masterCity}
                          onChange={handleChange}
                        >
                          <option value="">Select City</option>
                          {masterCities.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Platform</Form.Label>
                        <Form.Select
                          name="platform"
                          value={formData.platform}
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
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Platform Country</Form.Label>
                        <Form.Control
                          type="text"
                          name="platformCountry"
                          value={formData.platformCountry}
                          onChange={handleChange}
                          placeholder="Enter platform country"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Platform City</Form.Label>
                        <Form.Control
                          type="text"
                          name="platformCity"
                          value={formData.platformCity}
                          onChange={handleChange}
                          placeholder="Enter platform city"
                        />
                      </Form.Group>
                    </Col>

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
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Platform</th>
                        <th>Master Country</th>
                        <th>Master City</th>
                        <th>Platform Country</th>
                        <th>Platform City</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {platforms.map((p, idx) => {
                        const mapped = mappings.find((m) => m.platform === p);
                        return (
                          <tr key={idx}>
                            <td>{p}</td>
                            <td>{mapped?.masterCountry || "-"}</td>
                            <td>{mapped?.masterCity || "-"}</td>
                            <td>{mapped?.platformCountry || "-"}</td>
                            <td>{mapped?.platformCity || "-"}</td>
                            <td>
                              {mapped ? (
                                <Badge bg="success">✔ Mapped</Badge>
                              ) : (
                                <Badge bg="danger">✖ Not Mapped</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CityMapping;
