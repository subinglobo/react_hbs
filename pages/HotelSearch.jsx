import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Badge,
  Pagination,
  ButtonGroup,
  ToggleButton,
  Placeholder,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import Select from "react-select";
import axiosInstance from "../components/AxiosInstance";
import { FaLightbulb } from "react-icons/fa";
import axios from "axios";
import "../styles/HotelSearch.css";

function RoomGuestSelector({ value, onChange }) {
  const [rooms, setRooms] = useState(value);

  const update = (next) => {
    setRooms(next);
    onChange && onChange(next);
  };

  const addRoom = () =>
    update([...rooms, { adults: 2, children: 0, childAges: [] }]);
  const removeRoom = (index) => update(rooms.filter((_, i) => i !== index));

  const setAdults = (index, adults) => {
    const next = rooms.map((r, i) => (i === index ? { ...r, adults } : r));
    update(next);
  };
  const setChildren = (index, children) => {
    const next = rooms.map((r, i) =>
      i === index
        ? {
            ...r,
            children,
            childAges: Array.from(
              { length: children },
              (_, j) => r.childAges[j] || 5
            ),
          }
        : r
    );
    update(next);
  };
  const setChildAge = (roomIdx, childIdx, age) => {
    const next = rooms.map((r, i) => {
      if (i !== roomIdx) return r;
      const ages = [...r.childAges];
      ages[childIdx] = age;
      return { ...r, childAges: ages };
    });
    update(next);
  };

  return (
    <div className="room-guest-selector">
      {rooms.map((room, i) => (
        <Card key={i} className="mb-2 shadow-sm">
          <Card.Body className="py-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-semibold">Room {i + 1}</div>
              {rooms.length > 1 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeRoom(i)}
                >
                  Remove
                </Button>
              )}
            </div>
            <div className="d-flex flex-wrap gap-3 align-items-end">
              <Form.Group>
                <Form.Label>Adults</Form.Label>
                <Form.Select
                  value={room.adults}
                  onChange={(e) => setAdults(i, parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Children</Form.Label>
                <Form.Select
                  value={room.children}
                  onChange={(e) => setChildren(i, parseInt(e.target.value))}
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              {Array.from({ length: room.children }).map((_, idx) => (
                <Form.Group key={idx}>
                  <Form.Label>Child {idx + 1} Age</Form.Label>
                  <Form.Select
                    value={room.childAges[idx] || 5}
                    onChange={(e) =>
                      setChildAge(i, idx, parseInt(e.target.value))
                    }
                  >
                    {Array.from({ length: 17 }).map((__, age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ))}
            </div>
          </Card.Body>
        </Card>
      ))}
      <Button variant="outline-primary" size="sm" onClick={addRoom}>
        + Add Room
      </Button>
    </div>
  );
}

function LazyImage({ src, alt, className }) {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      });
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      setInView(true);
    }
  }, []);

  const buildSrcSet = (url) => {
    try {
      const safeUrl = url || "https://via.placeholder.com/480x270";
      const small = safeUrl.includes("/[0-9]+/[0-9]+$")
        ? safeUrl.replace(/\/[0-9]+\/[0-9]+$/, "/320/180")
        : `${safeUrl}?w=320&h=180`;
      const medium = safeUrl.includes("/[0-9]+/[0-9]+$")
        ? safeUrl.replace(/\/[0-9]+\/[0-9]+$/, "/480/270")
        : `${safeUrl}?w=480&h=270`;
      const large = safeUrl.includes("/[0-9]+/[0-9]+$")
        ? safeUrl.replace(/\/[0-9]+\/[0-9]+$/, "/640/360")
        : `${safeUrl}?w=640&h=360`;
      return `${small} 320w, ${medium} 480w, ${large} 640w`;
    } catch {
      return undefined;
    }
  };

  const imageSrc = src || "https://via.placeholder.com/480x270";

  return (
    <div
      ref={containerRef}
      className={`ratio ratio-16x9 rounded-top overflow-hidden ${
        className || ""
      }`}
    >
      {!loaded && <div className="skeleton w-100 h-100" />}
      {inView && (
        <img
          src={imageSrc}
          srcSet={buildSrcSet(imageSrc)}
          sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`img-cover ${loaded ? "img-loaded" : "img-loading"}`}
        />
      )}
    </div>
  );
}

export default function HotelSearch() {
  const [nationalityList, setNationalityList] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState(null);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(1);
  const [agent, setAgent] = useState("");
  const [rooms, setRooms] = useState([
    { adults: 2, children: 0, childAges: [] },
  ]);
  const [roomsOpen, setRoomsOpen] = useState(false);

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.max(
        1,
        Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      );
      setNights(diff);
    }
  }, [checkIn, checkOut]);

  const handleNightsChange = (value) => {
    const val = Math.max(1, Number(value) || 1);
    setNights(val);
    if (checkIn) {
      const start = new Date(checkIn);
      const out = new Date(start);
      out.setDate(start.getDate() + val);
      const iso = new Date(out.getTime() - out.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      setCheckOut(iso);
    }
  };

  const [allResults, setAllResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("nameAsc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyBreakfast, setOnlyBreakfast] = useState(false);
  const [view, setView] = useState("card");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(6);

  const filtered = useMemo(() => {
    let list = [...allResults];
    if (onlyBreakfast)
      list = list.filter((r) =>
        (r.badge || "").toLowerCase().includes("breakfast")
      );
    const min = parseFloat(minPrice);
    if (!Number.isNaN(min)) list = list.filter((r) => r.price && r.price >= min);
    const max = parseFloat(maxPrice);
    if (!Number.isNaN(max)) list = list.filter((r) => r.price && r.price <= max);
    if (sortBy === "priceAsc") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "priceDesc") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === "nameAsc") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "nameDesc") list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [allResults, onlyBreakfast, minPrice, maxPrice, sortBy]);

  const totalElements = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const pageItems = useMemo(() => {
    const start = pageIndex * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageIndex, pageSize]);

  useEffect(() => {
    setPageIndex(0);
  }, [filtered.length]);

  const pageNumbers = useMemo(() => {
    const current = pageIndex + 1;
    const total = totalPages;
    const nums = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) nums.push(i);
    } else {
      nums.push(1);
      const left = Math.max(2, current - 1);
      const right = Math.min(total - 1, current + 1);
      if (left > 2) nums.push("ellipsis-left");
      for (let i = left; i <= right; i++) nums.push(i);
      if (right < total - 1) nums.push("ellipsis-right");
      nums.push(total);
    }
    return nums;
  }, [pageIndex, totalPages]);

  const goToPage = (idx) => {
    if (idx < 0 || idx > totalPages - 1) return;
    setPageIndex(idx);
  };

  const countryList = async () => {
    try {
      const response = await axios.get("/api/country");
      const options = Array.isArray(response.data)
        ? response.data.map((country) => ({
            value: country.id,
            label: country.name,
          }))
        : [];
      setNationalityList(options);
    } catch (error) {
      console.log("error for country list:", error);
      setNationalityList([]);
    }
  };

  const cityList = async (countryId) => {
    if (!countryId) {
      setDestinationOptions([]);
      return;
    }
    try {
      const response = await axiosInstance.get(
        `/api/destination/getCitiesByCountryId/${countryId}`
      );
      const cityApiRes = Array.isArray(response.data) ? response.data : [];
      const options = cityApiRes.map((city) => ({
        value: city.id,
        label: `${city.name}, ${city.country}`,
        countryId: city.countryId,
      }));
      setDestinationOptions(options);
    } catch (error) {
      console.log("axios call error for city list:", error);
      setDestinationOptions([]);
    }
  };

  useEffect(() => {
    countryList();
  }, []);

  useEffect(() => {
    if (selectedNationality) {
      cityList(selectedNationality.value);
      setSelectedDestination(null);
    }
  }, [selectedNationality]);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const getTomorrow = (date = new Date()) => {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const today = formatDate(new Date());

  let minCheckOutDate;
  if (checkIn) {
    minCheckOutDate = formatDate(getTomorrow(new Date(checkIn)));
  } else {
    minCheckOutDate = formatDate(getTomorrow());
  }

  const pollUntilComplete = async (url, params, checkComplete, intervalMs = 5000, timeoutMs = 20000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const intervalId = setInterval(async () => {
        try {
          const res = await axiosInstance.get(url, { params });
          const isComplete = checkComplete(res.data);

          if (isComplete) {
            clearInterval(intervalId);
            resolve(res.data);
          } else if (Date.now() - startTime >= timeoutMs) {
            clearInterval(intervalId);
            reject(new Error("Polling timed out"));
          }
        } catch (err) {
          clearInterval(intervalId);
          reject(err);
        }
      }, intervalMs);
    });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNationality || !selectedDestination || !checkIn || !checkOut) {
      alert("Please fill in all required fields: Nationality, Destination, Check-in, and Check-out.");
      return;
    }
    setIsLoading(true);
    setHasSearched(true);

    try {
      const nationalityId = selectedNationality.value;
      const destinationCityId = selectedDestination.value;
      const destinationCountryId = selectedDestination.countryId;
      const noOfRooms = String(rooms.length);

      const roomConfigurations = rooms.map((room, index) => ({
        roomNo: index + 1,
        adultCount: String(room.adults || 1),
        childCount: String(room.children || 0),
        childAges: room.childAges?.length ? room.childAges : [0],
        adultAges: room.adultAges?.length ? room.adultAges : [25],
      }));

      const agentId = agent;

      const searchPayloadReq = {
        nationalityId,
        destinationCityId,
        destinationCountryId,
        checkIn,
        checkOut,
        noOfRooms,
        roomConfigurations,
        agentId,
      };

      const searchKeyRes = await axiosInstance.post("/hotel-search/search", searchPayloadReq);
      const searchId = searchKeyRes.data.searchId;
      if (!searchId) throw new Error("No searchId returned");

      await new Promise((resolve) => setTimeout(resolve, 4000));

      const finalData = await pollUntilComplete(
        `/hotel-search/results/${searchId}`,
        { agentId },
        (data) => data.finalStatus === "COMPLETED",
        5000,
        20000
      );

      console.log("Final Results:", finalData);
      const mappedResults = Array.isArray(finalData.result)
        ? finalData.result.map((hotel, index) => ({
            id: hotel.hotelCode || `h${index + 1}`,
            name: hotel.hotelName || "Unknown Hotel",
            city: hotel.hotelAddress
              ? hotel.hotelAddress.split(", ").pop() || "Unknown City"
              : "Unknown City",
            price: hotel.baseRate || null,
            badge: hotel.baseRate ? "Rate Available" : "Rate Unavailable",
            image: hotel.hotelImage || "https://b2b.choosenfly.com/assets/details/profilepic/hotel/hoteldefault.jpg",
            rating: hotel.starRating || 0,
          }))
        : [];
      console.log("mappedResults:::", mappedResults);
      setAllResults(mappedResults);
    } catch (err) {
      console.error("Search failed:", err);
      setAllResults([]);
      alert("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <TopBar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <Card className="shadow-sm rounded-xl mb-4 search-card">
            <Card.Body>
              <Form onSubmit={handleSearchSubmit}>
                <Row className="g-3 align-items-end">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Nationality</Form.Label>
                      <Select
                        options={nationalityList}
                        value={selectedNationality}
                        onChange={(option) => setSelectedNationality(option)}
                        placeholder="Select nationality"
                        isSearchable
                      />
                    </Form.Group>
                  </Col>
                  <Col md={9}>
                    <Form.Group>
                      <Form.Label>Destination</Form.Label>
                      <div className="position-relative">
                        <span
                          className="position-absolute"
                          style={{
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 2,
                          }}
                        >
                          <FaLightbulb />
                        </span>
                        <div style={{ paddingLeft: 36 }}>
                          <Select
                            options={destinationOptions}
                            value={selectedDestination}
                            onChange={(option) =>
                              setSelectedDestination(option)
                            }
                            placeholder="Enter a destination or property"
                            isSearchable
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 align-items-end mt-1">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Check-in</Form.Label>
                      <div className="position-relative input-with-icon">
                        <span className="icon-left">📅</span>
                        <Form.Control
                          className="date-control date-picker"
                          type="date"
                          value={checkIn}
                          min={today}
                          onChange={(e) => {
                            const newCheckIn = e.target.value;
                            setCheckIn(newCheckIn);
                            if (
                              !checkOut ||
                              new Date(newCheckIn) >= new Date(checkOut)
                            ) {
                              setCheckOut(
                                formatDate(getTomorrow(new Date(newCheckIn)))
                              );
                            }
                          }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Check-out</Form.Label>
                      <div className="position-relative input-with-icon">
                        <span className="icon-left">📅</span>
                        <Form.Control
                          className="date-control"
                          type="date"
                          value={checkOut}
                          min={minCheckOutDate}
                          onChange={(e) => setCheckOut(e.target.value)}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>No. of Nights</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        max={60}
                        value={nights}
                        onChange={(e) => handleNightsChange(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Rooms & Guests</Form.Label>
                    <Button
                      variant="outline-secondary"
                      className="w-100 text-start rooms-summary-btn"
                      type="button"
                      onClick={() => setRoomsOpen((o) => !o)}
                    >
                      {rooms.reduce((a, r) => a + r.adults, 0)} adults
                      {rooms.reduce((a, r) => a + r.children, 0)
                        ? `, ${rooms.reduce((a, r) => a + r.children, 0)} child`
                        : ""}{" "}
                      · {rooms.length} room{rooms.length > 1 ? "s" : ""}
                      <span className="float-end">{roomsOpen ? "▴" : "▾"}</span>
                    </Button>
                  </Col>
                </Row>
                {roomsOpen && (
                  <Row className="g-3 mt-2">
                    <Col md={12}>
                      <RoomGuestSelector value={rooms} onChange={setRooms} />
                    </Col>
                  </Row>
                )}
                <Row className="g-3 mt-1">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Agent</Form.Label>
                      <Form.Select
                        value={agent}
                        onChange={(e) => setAgent(e.target.value)}
                      >
                        <option value="">Select Agent</option>
                        <option value="101">Agent 101</option>
                        <option value="102">Agent 102</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col className="d-flex justify-content-center">
                    <Button
                      type="submit"
                      className="btn-search-large"
                      disabled={isLoading}
                    >
                      {isLoading ? "Searching..." : "SEARCH"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          {!hasSearched && (
            <Card className="shadow-sm rounded-xl">
              <Card.Body className="text-center text-muted py-5">
                Use the search form above to find hotels.
              </Card.Body>
            </Card>
          )}

          {hasSearched && (
            <>
              <Card className="shadow-sm rounded-xl mb-3">
                <Card.Body className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <ButtonGroup>
                    <ToggleButton
                      id="view-card"
                      type="radio"
                      variant={view === "card" ? "dark" : "outline-secondary"}
                      checked={view === "card"}
                      value="card"
                      onChange={() => setView("card")}
                    >
                      Card View
                    </ToggleButton>
                    <ToggleButton
                      id="view-map"
                      type="radio"
                      variant={view === "map" ? "dark" : "outline-secondary"}
                      checked={view === "map"}
                      value="map"
                      onChange={() => setView("map")}
                      disabled
                    >
                      Map View
                    </ToggleButton>
                  </ButtonGroup>
                  <div className="d-flex flex-wrap align-items-end gap-2">
                    <Form.Group>
                      <Form.Label className="mb-0 small">Min Price</Form.Label>
                      <Form.Control
                        size="sm"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="mb-0 small">Max Price</Form.Label>
                      <Form.Control
                        size="sm"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Any"
                      />
                    </Form.Group>
                    <Form.Group className="ms-2">
                      <Form.Check
                        type="checkbox"
                        label="Breakfast only"
                        checked={onlyBreakfast}
                        onChange={(e) => setOnlyBreakfast(e.target.checked)}
                      />
                    </Form.Group>
                    <Form.Group className="ms-2">
                      <Form.Label className="mb-0 small">Sort</Form.Label>
                      <Form.Select
                        size="sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="nameAsc">Name: A-Z</option>
                        <option value="nameDesc">Name: Z-A</option>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </Card.Body>
              </Card>

              {view === "card" && (
                <Row xs={1} md={2} xl={3} className="g-4">
                  {isLoading &&
                    Array.from({ length: pageSize }).map((_, idx) => (
                      <Col key={`sk-${idx}`}>
                        <Card className="shadow-sm rounded-xl h-100">
                          <div className="ratio ratio-16x9 rounded-top overflow-hidden">
                            <div className="skeleton w-100 h-100" />
                          </div>
                          <Card.Body>
                            <Placeholder
                              as="div"
                              animation="wave"
                              className="mb-2"
                            >
                              <Placeholder xs={8} />
                            </Placeholder>
                            <Placeholder
                              as="div"
                              animation="wave"
                              className="mb-3"
                            >
                              <Placeholder xs={5} />
                            </Placeholder>
                            <div className="d-flex justify-content-between align-items-center">
                              <Placeholder as="div" animation="wave">
                                <Placeholder xs={3} />
                              </Placeholder>
                              <Button disabled className="btn-green">
                                View Rooms
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  {!isLoading &&
                    pageItems.map((hotel) => (
                      <Col key={hotel.id}>
                        <Card className="shadow-sm rounded-xl h-100 lazy-card">
                          <LazyImage src={hotel.image} alt={hotel.name} />
                          <Card.Body>
                            <div className="h5 mb-1">{hotel.name}</div>
                            <div className="text-muted mb-2">{hotel.city}</div>
                            <div className="text-muted mb-2">Rating: {hotel.rating} stars</div>
                            <Badge
                              bg="success"
                              className="mb-3"
                              style={{
                                backgroundColor: "#dcfce7",
                                color: "#166534",
                              }}
                            >
                              {hotel.badge}
                            </Badge>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="h5 mb-0">
                                {hotel.price
                                  ? `AED${hotel.price.toLocaleString()}`
                                  : "Price Unavailable"}
                              </div>
                              <Button className="btn-green">View Rooms</Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  {pageItems.length === 0 && (
                    <Col>
                      <Card className="shadow-sm rounded-xl">
                        <Card.Body className="text-center text-muted py-5">
                          No results match filters.
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>
              )}

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
                <small className="text-muted">
                  Showing {pageItems.length > 0 ? pageIndex * pageSize + 1 : 0}-
                  {pageIndex * pageSize + pageItems.length} of {totalElements}
                </small>
                <Pagination className="mb-0 pagination-modern">
                  <Pagination.Prev
                    disabled={pageIndex === 0}
                    onClick={() => goToPage(pageIndex - 1)}
                  />
                  {pageNumbers.map((n) =>
                    typeof n === "number" ? (
                      <Pagination.Item
                        key={n}
                        active={n === pageIndex + 1}
                        onClick={() => goToPage(n - 1)}
                      >
                        {n}
                      </Pagination.Item>
                    ) : (
                      <Pagination.Ellipsis key={n} disabled />
                    )
                  )}
                  <Pagination.Next
                    disabled={pageIndex >= totalPages - 1}
                    onClick={() => goToPage(pageIndex + 1)}
                  />
                </Pagination>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}