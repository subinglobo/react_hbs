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
  Spinner,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar"; // Ensure this file exists
import TopBar from "../components/TopBar"; // Ensure this file exists
import Select from "react-select";
import axiosInstance from "../components/AxiosInstance"; // Ensure this file exists
import {
  FaLightbulb,
  FaSearch,
  FaFilter,
  FaSort,
  FaStar,
  FaBuilding,
  FaGlobe,
} from "react-icons/fa";
import axios from "axios";
import "../styles/HotelSearch.css"; // Ensure this CSS file exists

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

  // New filter states
  const [starRating, setStarRating] = useState([]);
  const [hotelType, setHotelType] = useState([]);
  const [channelType, setChannelType] = useState([]);
  const [sortBy, setSortBy] = useState("priceAsc");
  const [hotelSearchTerm, setHotelSearchTerm] = useState("");
  const [errors, setErrors] = useState({});

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
  const [view, setView] = useState("card");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(9); // Increased to show more results
  const [hasSearchResult, setHasSearchResult] = useState(false);

  // Filter options
  const starOptions = [
    { value: 5, label: "5 Stars" },
    { value: 4, label: "4 Stars" },
    { value: 3, label: "3 Stars" },
    { value: 2, label: "2 Stars" },
    { value: 1, label: "1 Star" },
  ];

  const hotelTypeOptions = [
    { value: "hotel", label: "Hotel" },
    { value: "villa", label: "Villa" },
    { value: "resort", label: "Resort" },
    { value: "apartment", label: "Apartment" },
  ];

  const channelTypeOptions = [
    { value: "inhouse", label: "Inhouse" },
    { value: "iwtx", label: "IWTX" },
    { value: "x3", label: "x3" },
    { value: "ratehawk", label: "Ratehawk" },
  ];

  const filtered = useMemo(() => {
    let list = [...allResults];

    // Hotel name search filter
    if (hotelSearchTerm.trim()) {
      list = list.filter((hotel) =>
        hotel.name.toLowerCase().includes(hotelSearchTerm.toLowerCase())
      );
    }

    // Star rating filter
    if (starRating.length > 0) {
      list = list.filter((r) => starRating.includes(r.rating));
    }

    // Hotel type filter (mock implementation - you'll need to add hotelType to your data)
    if (hotelType.length > 0) {
      list = list.filter((r) => hotelType.includes(r.hotelType || "hotel"));
    }

    // Channel type filter (mock implementation - you'll need to add channelType to your data)
    if (channelType.length > 0) {
      list = list.filter((r) =>
        channelType.includes(r.channelType || "inhouse")
      );
    }

    // Sorting
    if (sortBy === "priceAsc")
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "priceDesc")
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === "nameAsc") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "nameDesc")
      list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "ratingDesc")
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "ratingAsc")
      list.sort((a, b) => (a.rating || 0) - (b.rating || 0));

    return list;
  }, [allResults, starRating, hotelType, channelType, sortBy, hotelSearchTerm]);

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

  const cityList = async (searchText = "") => {
    try {
      const response = await axiosInstance.get(
        `/api/destination?search=${searchText}`
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
    cityList();
  }, []);

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

  const validateForm = () => {
    const newErrors = {};

    // Nationality validation
    if (!selectedNationality) {
      newErrors.nationality = "Nationality is required";
    }

    // Destination validation
    if (!selectedDestination) {
      newErrors.destination = "Destination is required";
    }

    // Check-in validation
    if (!checkIn) {
      newErrors.checkIn = "Check-in date is required";
    }

    // Check-out validation
    if (!checkOut) {
      newErrors.checkOut = "Check-out date is required";
    }

    // Agent validation
    if (!agent) {
      newErrors.agent = "Agent is required";
    }

    return newErrors;
  };

  const pollUntilComplete = async (
    url,
    params,
    checkComplete,
    onUpdate,
    intervalMs = 4000,
    timeoutMs = 20000,
    initialDelay = 2000
  ) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const poll = async () => {
        try {
          const res = await axiosInstance.get(url, { params });

          // Log for debugging
          console.log(`Poll received ${res.data.result?.length || 0} hotels`);

          // Update UI every time with latest data
          if (onUpdate) {
            onUpdate(res.data);
          }

          // Stop if condition met
          if (checkComplete(res.data)) {
            return resolve(res.data);
          }

          // Stop if timeout reached
          if (Date.now() - startTime >= timeoutMs) {
            return reject(new Error("Polling timed out"));
          }

          // Wait for next interval
          setTimeout(poll, intervalMs);
        } catch (err) {
          // Log error but don’t clear results
          console.error("Poll failed:", err);
          reject(err);
        }
      };

      // Start first poll after initialDelay
      setTimeout(poll, initialDelay);
    });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setHasSearched(false);
      return;
    }

    // Initial loading state
    setIsLoading(true);
    setHasSearched(true);
    setAllResults([]); // Reset results to show empty list initially

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

      const searchKeyRes = await axiosInstance.post(
        "/hotel-search/search",
        searchPayloadReq
      );

      const searchId = searchKeyRes.data.searchId;
      if (!searchId) throw new Error("No searchId returned");

      // After initial search is done, we can set isLoading to false
      // but keep hasSearched true to show results
      setIsLoading(false);

      let pollCount = 0; // Track poll iterations

      const finalData = await pollUntilComplete(
        `/hotel-search/results/${searchId}`,
        { agentId },
        (data) => data.finalStatus === "COMPLETED",
        (data) => {
          pollCount++; // Increment poll counter
          console.log("Poll response:", data.result);

          const mappedResults = Array.isArray(data.result)
            ? data.result.map((hotel, index) => {
                const uniqueId = hotel.hotelCode
                  ? `${searchId}-${hotel.hotelCode}-${index}-${pollCount}`
                  : `${searchId}-h${index + 1}-${pollCount}`;

                return {
                  id: uniqueId,
                  name: hotel.hotelName || "Unknown Hotel",
                  city: hotel.hotelAddress
                    ? hotel.hotelAddress.split(", ").pop() || "Unknown City"
                    : "Unknown City",
                  price: hotel.baseRate || null,
                  badge: hotel.baseRate ? "Rate Available" : "Rate Unavailable",
                  image:
                    hotel.hotelImage ||
                    "https://b2b.choosenfly.com/assets/details/profilepic/hotel/hoteldefault.jpg",
                  rating: hotel.starRating || 0,
                  hotelType: "hotel",
                  channelType: "inhouse",
                };
              })
            : [];

          setHasSearchResult(true);
          setAllResults(mappedResults); // Update UI with current results
        },
        4000,
        20000,
        2000
      );

      console.log("Final Results:", finalData);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed. Showing last available results.");
    } finally {
      setIsLoading(false); // Ensure loading is always turned off
    }
  };

  // return (
  //   <div className="min-vh-100 bg-light d-flex flex-column">
  //     <TopBar />
  //     <div className="d-flex flex-grow-1">
  //       <Sidebar />
  //       <main className="flex-grow-1 p-4">
  //         {/* Modern Search Form */}
  //         <Card className="shadow-sm rounded-xl mb-4 search-card-modern">
  //           <Card.Body className="p-4">
  //             <div className="text-center mb-4">
  //               <h2 className="fw-bold text-primary mb-2">
  //                 Find Your Perfect Stay
  //               </h2>
  //               <p className="text-muted">
  //                 Discover amazing hotels and exclusive deals
  //               </p>
  //             </div>

  //             <Form onSubmit={handleSearchSubmit}>
  //               <Row className="g-4">
  //                 {/* Nationality */}
  //                 <Col lg={3} md={6}>
  //                   <Form.Group>
  //                     <Form.Label className="fw-semibold text-dark">
  //                       <FaGlobe className="me-2 text-primary" />
  //                       Nationality
  //                     </Form.Label>
  //                     <Select
  //                       options={nationalityList}
  //                       value={selectedNationality}
  //                       onChange={(option) => setSelectedNationality(option)}
  //                       placeholder="Select nationality"
  //                       isSearchable
  //                       className="modern-select"
  //                     />

  //                     {errors.nationality && (
  //                       <div className="text-danger small mt-1">
  //                         {errors.nationality}
  //                       </div>
  //                     )}
  //                   </Form.Group>
  //                 </Col>

  //                 {/* Destination */}
  //                 <Col lg={6} md={6}>
  //                   <Form.Group>
  //                     <Form.Label className="fw-semibold text-dark">
  //                       <FaLightbulb className="me-2 text-warning" />
  //                       Destination
  //                     </Form.Label>
  //                     <Select
  //                       options={destinationOptions}
  //                       value={selectedDestination}
  //                       onChange={(option) => setSelectedDestination(option)}
  //                       placeholder="Where do you want to go?"
  //                       isSearchable
  //                       className="modern-select"
  //                       // 👇 fetch as user types
  //                       onInputChange={(inputValue, { action }) => {
  //                         if (action === "input-change") {
  //                           cityList(inputValue); // call API with typed text
  //                         }
  //                       }}
  //                     />
  //                     {errors.destination && (
  //                       <div className="text-danger small mt-1">
  //                         {errors.destination}
  //                       </div>
  //                     )}
  //                   </Form.Group>
  //                 </Col>

  //                 {/* Check-in */}
  //                 <Col lg={3} md={6}>
  //                   <Form.Group>
  //                     <Form.Label className="fw-semibold text-dark">
  //                       📅 Check-in
  //                     </Form.Label>
  //                     <Form.Control
  //                       className="form-control-modern"
  //                       type="date"
  //                       value={checkIn}
  //                       min={today}
  //                       onChange={(e) => {
  //                         const newCheckIn = e.target.value;
  //                         setCheckIn(newCheckIn);
  //                         if (
  //                           !checkOut ||
  //                           new Date(newCheckIn) >= new Date(checkOut)
  //                         ) {
  //                           setCheckOut(
  //                             formatDate(getTomorrow(new Date(newCheckIn)))
  //                           );
  //                         }
  //                       }}
  //                     />
  //                     {errors.checkIn && (
  //                       <div className="text-danger small mt-1">
  //                         {errors.checkIn}
  //                       </div>
  //                     )}
  //                   </Form.Group>
  //                 </Col>

  //                 {/* Check-out */}
  //                 <Col lg={3} md={6}>
  //                   <Form.Group>
  //                     <Form.Label className="fw-semibold text-dark">
  //                       📅 Check-out
  //                     </Form.Label>
  //                     <Form.Control
  //                       className="form-control-modern"
  //                       type="date"
  //                       value={checkOut}
  //                       min={minCheckOutDate}
  //                       onChange={(e) => setCheckOut(e.target.value)}
  //                     />
  //                     {errors.checkOut && (
  //                       <div className="text-danger small mt-1">
  //                         {errors.checkOut}
  //                       </div>
  //                     )}
  //                   </Form.Group>
  //                 </Col>

  //                 {/* Nights */}
  //                 <Col lg={2} md={6}>
  //                   <Form.Group>
  //                     <Form.Label className="fw-semibold text-dark">
  //                       🌙 Nights
  //                     </Form.Label>
  //                     <Form.Control
  //                       className="form-control-modern"
  //                       type="number"
  //                       min={1}
  //                       max={60}
  //                       value={nights}
  //                       onChange={(e) => handleNightsChange(e.target.value)}
  //                     />
  //                   </Form.Group>
  //                 </Col>

  //                 {/* Rooms & Guests */}
  //                 <Col lg={4} md={6}>
  //                   <Form.Label className="fw-semibold text-dark">
  //                     👥 Rooms & Guests
  //                   </Form.Label>
  //                   <Button
  //                     variant="outline-primary"
  //                     className="w-100 text-start rooms-summary-btn-modern"
  //                     type="button"
  //                     onClick={() => setRoomsOpen((o) => !o)}
  //                   >
  //                     {rooms.reduce((a, r) => a + r.adults, 0)} adults
  //                     {rooms.reduce((a, r) => a + r.children, 0)
  //                       ? `, ${rooms.reduce((a, r) => a + r.children, 0)} child`
  //                       : ""}{" "}
  //                     · {rooms.length} room{rooms.length > 1 ? "s" : ""}
  //                     <span className="float-end">{roomsOpen ? "▴" : "▾"}</span>
  //                   </Button>
  //                 </Col>

  //                 {/* Agent */}
  //                 <Col lg={3} md={6}>
  //                   <Form.Group>
  //                     <Form.Label className="fw-semibold text-dark">
  //                       👤 Agent
  //                     </Form.Label>
  //                     <Form.Select
  //                       className="form-control-modern"
  //                       value={agent}
  //                       onChange={(e) => setAgent(e.target.value)}
  //                     >
  //                       <option value="">Select Agent</option>
  //                       <option value="101">Agent 101</option>
  //                       <option value="102">Agent 102</option>
  //                     </Form.Select>
  //                     {errors.agent && (
  //                       <div className="text-danger small mt-1">
  //                         {errors.agent}
  //                       </div>
  //                     )}
  //                   </Form.Group>
  //                 </Col>
  //               </Row>

  //               {/* Rooms Configuration */}
  //               {roomsOpen && (
  //                 <Row className="g-3 mt-3">
  //                   <Col md={12}>
  //                     <RoomGuestSelector value={rooms} onChange={setRooms} />
  //                   </Col>
  //                 </Row>
  //               )}

  //               {/* Search Button */}
  //               <Row className="mt-4">
  //                 <Col className="d-flex justify-content-center">
  //                   <Button
  //                     type="submit"
  //                     className="btn-search-modern"
  //                     disabled={isLoading}
  //                     size="lg"
  //                   >
  //                     {isLoading ? (
  //                       <>
  //                         <Spinner
  //                           animation="border"
  //                           size="sm"
  //                           className="me-2"
  //                         />
  //                         Searching...
  //                       </>
  //                     ) : (
  //                       <>
  //                         <FaSearch className="me-2" />
  //                         SEARCH HOTELS
  //                       </>
  //                     )}
  //                   </Button>
  //                 </Col>
  //               </Row>
  //             </Form>
  //           </Card.Body>
  //         </Card>

  //         {/* Search Results Section */}
  //         {!hasSearched && (
  //           <Card className="shadow-sm rounded-xl">
  //             <Card.Body className="text-center text-muted py-5">
  //               <FaSearch className="display-4 text-muted mb-3" />
  //               <h4>Ready to Find Your Perfect Stay?</h4>
  //               <p>
  //                 Use the search form above to discover amazing hotels and
  //                 exclusive deals.
  //               </p>
  //             </Card.Body>
  //           </Card>
  //         )}

  //         {hasSearched && (
  //           <>
  //             {/* Filters and Controls */}
  //             <Card className="shadow-sm rounded-xl mb-4 filtersection">
  //               <Card.Body className="p-3">
  //                 <Row className="g-3 align-items-center">
  //                   {/* View Toggle */}
  //                   <Col lg={2} md={6}>
  //                     <ButtonGroup className="w-100">
  //                       <ToggleButton
  //                         id="view-card"
  //                         type="radio"
  //                         variant={
  //                           view === "card" ? "primary" : "outline-secondary"
  //                         }
  //                         checked={view === "card"}
  //                         value="card"
  //                         onChange={() => setView("card")}
  //                         size="sm"
  //                       >
  //                         <FaBuilding className="me-1" />
  //                         Cards
  //                       </ToggleButton>
  //                       <ToggleButton
  //                         id="view-map"
  //                         type="radio"
  //                         variant={
  //                           view === "map" ? "primary" : "outline-secondary"
  //                         }
  //                         checked={view === "map"}
  //                         value="map"
  //                         onChange={() => setView("map")}
  //                         disabled
  //                         size="sm"
  //                       >
  //                         🗺️ Map
  //                       </ToggleButton>
  //                     </ButtonGroup>
  //                   </Col>

  //                   {/* Hotel Name Search */}
  //                   <Col lg={3} md={6}>
  //                     <Form.Group className="hotel-search-bar">
  //                       <Form.Label className="mb-1 small fw-semibold">
  //                         <FaSearch className="me-1 text-info" />
  //                         Hotel Name
  //                       </Form.Label>
  //                       <Form.Control
  //                         type="text"
  //                         placeholder="Search hotels by name..."
  //                         className="form-control-modern-sm"
  //                         value={hotelSearchTerm}
  //                         onChange={(e) => setHotelSearchTerm(e.target.value)}
  //                       />
  //                     </Form.Group>
  //                   </Col>

  //                   {/* Star Rating Filter */}
  //                   <Col lg={2} md={6}>
  //                     <Form.Group>
  //                       <Form.Label className="mb-1 small fw-semibold">
  //                         <FaStar className="me-1 text-warning" />
  //                         Star Rating
  //                       </Form.Label>
  //                       <Select
  //                         isMulti
  //                         options={starOptions}
  //                         value={starRating}
  //                         onChange={setStarRating}
  //                         placeholder="All Stars"
  //                         className="modern-select-sm"
  //                       />
  //                     </Form.Group>
  //                   </Col>

  //                   {/* Hotel Type Filter */}
  //                   <Col lg={2} md={6}>
  //                     <Form.Group>
  //                       <Form.Label className="mb-1 small fw-semibold">
  //                         <FaBuilding className="me-1 text-info" />
  //                         Hotel Type
  //                       </Form.Label>
  //                       <Select
  //                         isMulti
  //                         options={hotelTypeOptions}
  //                         value={hotelType}
  //                         onChange={setHotelType}
  //                         placeholder="All Types"
  //                         className="modern-select-sm"
  //                       />
  //                     </Form.Group>
  //                   </Col>

  //                   {/* Channel Type Filter */}
  //                   <Col lg={2} md={6}>
  //                     <Form.Group>
  //                       <Form.Label className="mb-1 small fw-semibold">
  //                         <FaGlobe className="me-1 text-success" />
  //                         Channel
  //                       </Form.Label>
  //                       <Select
  //                         isMulti
  //                         options={channelTypeOptions}
  //                         value={channelType}
  //                         onChange={setChannelType}
  //                         placeholder="All Channels"
  //                         className="modern-select-sm"
  //                       />
  //                     </Form.Group>
  //                   </Col>

  //                   {/* Sort Options */}
  //                   <Col lg={2} md={6}>
  //                     <Form.Group>
  //                       <Form.Label className="mb-1 small fw-semibold">
  //                         <FaSort className="me-1 text-secondary" />
  //                         Sort By
  //                       </Form.Label>
  //                       <Form.Select
  //                         size="sm"
  //                         value={sortBy}
  //                         onChange={(e) => setSortBy(e.target.value)}
  //                         className="form-control-modern-sm"
  //                       >
  //                         <option value="priceAsc">Price: Low to High</option>
  //                         <option value="priceDesc">Price: High to Low</option>
  //                         <option value="ratingDesc">
  //                           Rating: High to Low
  //                         </option>
  //                         <option value="ratingAsc">Rating: Low to High</option>
  //                         <option value="nameAsc">Name: A-Z</option>
  //                         <option value="nameDesc">Name: Z-A</option>
  //                       </Form.Select>
  //                     </Form.Group>
  //                   </Col>
  //                 </Row>
  //               </Card.Body>
  //             </Card>

  //             {/* Loading State */}
  //            {isLoading && !hasSearched && (
  //               <Card className="shadow-sm rounded-xl mb-4">
  //                 <Card.Body className="text-center py-5">
  //                   <div className="loading-animation mb-3">
  //                     <Spinner animation="border" variant="primary" size="lg" />
  //                   </div>
  //                   <h4 className="text-primary fw-bold">
  //                     Searching the Best Results...
  //                   </h4>
  //                   <p className="text-muted">
  //                     Please wait while we find the perfect hotels for you
  //                   </p>
  //                 </Card.Body>
  //               </Card>
  //             )}

  //             {/* Search Results */}
  //             {view === "card" && !isLoading && hasSearchResult && (
  //               <Row xs={1} md={2} xl={3} className="g-3">
  //                 {pageItems.map((hotel) => (
  //                   <Col key={hotel.id}>
  //                     <Card className="shadow-sm rounded-xl h-100 hotel-card-modern">
  //                       <div className="hotel-image-container">
  //                         <LazyImage src={hotel.image} alt={hotel.name} />
  //                         <div className="hotel-rating-badge">
  //                           <FaStar className="text-warning me-1" />
  //                           {hotel.rating}
  //                         </div>
  //                       </div>
  //                       <Card.Body className="p-3">
  //                         <h6 className="hotel-name mb-2 fw-bold">
  //                           {hotel.name}
  //                         </h6>
  //                         <p className="hotel-location mb-2 text-muted small">
  //                           📍 {hotel.city}
  //                         </p>
  //                         <Badge bg="success" className="mb-3 hotel-badge">
  //                           {hotel.badge}
  //                         </Badge>
  //                         <div className="hotel-price-section">
  //                           <div className="hotel-price">
  //                             {hotel.price
  //                               ? `Starts from AED ${hotel.price.toLocaleString()}`
  //                               : "Price Unavailable"}
  //                           </div>
  //                           <Button className="btn-view-rooms" size="sm">
  //                             View Rooms
  //                           </Button>
  //                         </div>
  //                       </Card.Body>
  //                     </Card>
  //                   </Col>
  //                 ))}

  //                 {pageItems.length === 0 && (
  //                   <Col>
  //                     <Card className="shadow-sm rounded-xl">
  //                       <Card.Body className="text-center text-muted py-5">
  //                         <FaSearch className="display-4 text-muted mb-3" />
  //                         <h5>No results found</h5>
  //                         <p>Try adjusting your filters or search criteria.</p>
  //                       </Card.Body>
  //                     </Card>
  //                   </Col>
  //                 )}
  //               </Row>
  //             )}

  //             {/* Pagination */}
  //             <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-4">
  //               <small className="text-muted fw-semibold">
  //                 Showing {pageItems.length > 0 ? pageIndex * pageSize + 1 : 0}-
  //                 {pageIndex * pageSize + pageItems.length} of {totalElements}{" "}
  //                 results
  //               </small>
  //               <Pagination className="mb-0 pagination-modern">
  //                 <Pagination.Prev
  //                   disabled={pageIndex === 0}
  //                   onClick={() => goToPage(pageIndex - 1)}
  //                 />
  //                 {pageNumbers.map((n) =>
  //                   typeof n === "number" ? (
  //                     <Pagination.Item
  //                       key={n}
  //                       active={n === pageIndex + 1}
  //                       onClick={() => goToPage(n - 1)}
  //                     >
  //                       {n}
  //                     </Pagination.Item>
  //                   ) : (
  //                     <Pagination.Ellipsis key={n} disabled />
  //                   )
  //                 )}
  //                 <Pagination.Next
  //                   disabled={pageIndex >= totalPages - 1}
  //                   onClick={() => goToPage(pageIndex + 1)}
  //                 />
  //               </Pagination>
  //             </div>
  //           </>
  //         )}
  //       </main>
  //     </div>
  //   </div>
  // );

   return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <TopBar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          {/* Modern Search Form */}
          <Card className="shadow-sm rounded-xl mb-4 search-card-modern">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">
                  Find Your Perfect Stay
                </h2>
                <p className="text-muted">
                  Discover amazing hotels and exclusive deals
                </p>
              </div>

              <Form onSubmit={handleSearchSubmit}>
                <Row className="g-4">
                  {/* Nationality */}
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-dark">
                        <FaGlobe className="me-2 text-primary" />
                        Nationality
                      </Form.Label>
                      <Select
                        options={nationalityList}
                        value={selectedNationality}
                        onChange={(option) => setSelectedNationality(option)}
                        placeholder="Select nationality"
                        isSearchable
                        className="modern-select"
                      />

                      {errors.nationality && (
                        <div className="text-danger small mt-1">
                          {errors.nationality}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Destination */}
                  <Col lg={6} md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-dark">
                        <FaLightbulb className="me-2 text-warning" />
                        Destination
                      </Form.Label>
                      <Select
                        options={destinationOptions}
                        value={selectedDestination}
                        onChange={(option) => setSelectedDestination(option)}
                        placeholder="Where do you want to go?"
                        isSearchable
                        className="modern-select"
                        onInputChange={(inputValue, { action }) => {
                          if (action === "input-change") {
                            cityList(inputValue);
                          }
                        }}
                      />
                      {errors.destination && (
                        <div className="text-danger small mt-1">
                          {errors.destination}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Check-in */}
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-dark">
                        📅 Check-in
                      </Form.Label>
                      <Form.Control
                        className="form-control-modern"
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
                      {errors.checkIn && (
                        <div className="text-danger small mt-1">
                          {errors.checkIn}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Check-out */}
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-dark">
                        📅 Check-out
                      </Form.Label>
                      <Form.Control
                        className="form-control-modern"
                        type="date"
                        value={checkOut}
                        min={minCheckOutDate}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                      {errors.checkOut && (
                        <div className="text-danger small mt-1">
                          {errors.checkOut}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Nights */}
                  <Col lg={2} md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-dark">
                        🌙 Nights
                      </Form.Label>
                      <Form.Control
                        className="form-control-modern"
                        type="number"
                        min={1}
                        max={60}
                        value={nights}
                        onChange={(e) => handleNightsChange(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  {/* Rooms & Guests */}
                  <Col lg={4} md={6}>
                    <Form.Label className="fw-semibold text-dark">
                      👥 Rooms & Guests
                    </Form.Label>
                    <Button
                      variant="outline-primary"
                      className="w-100 text-start rooms-summary-btn-modern"
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

                  {/* Agent */}
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-dark">
                        👤 Agent
                      </Form.Label>
                      <Form.Select
                        className="form-control-modern"
                        value={agent}
                        onChange={(e) => setAgent(e.target.value)}
                      >
                        <option value="">Select Agent</option>
                        <option value="101">Agent 101</option>
                        <option value="102">Agent 102</option>
                      </Form.Select>
                      {errors.agent && (
                        <div className="text-danger small mt-1">
                          {errors.agent}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {/* Rooms Configuration */}
                {roomsOpen && (
                  <Row className="g-3 mt-3">
                    <Col md={12}>
                      <RoomGuestSelector value={rooms} onChange={setRooms} />
                    </Col>
                  </Row>
                )}

                {/* Search Button */}
                <Row className="mt-4">
                  <Col className="d-flex justify-content-center">
                    <Button
                      type="submit"
                      className="btn-search-modern"
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Searching...
                        </>
                      ) : (
                        <>
                          <FaSearch className="me-2" />
                          SEARCH HOTELS
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* Search Results Section */}
          {!hasSearched && (
            <Card className="shadow-sm rounded-xl">
              <Card.Body className="text-center text-muted py-5">
                <FaSearch className="display-4 text-muted mb-3" />
                <h4>Ready to Find Your Perfect Stay?</h4>
                <p>
                  Use the search form above to discover amazing hotels and
                  exclusive deals.
                </p>
              </Card.Body>
            </Card>
          )}

          {hasSearched && (
            <>
              {/* Filters and Controls */}
              <Card className="shadow-sm rounded-xl mb-4 filtersection">
                <Card.Body className="p-3">
                  <Row className="g-3 align-items-center">
                    {/* View Toggle */}
                    <Col lg={2} md={6}>
                      <ButtonGroup className="w-100">
                        <ToggleButton
                          id="view-card"
                          type="radio"
                          variant={
                            view === "card" ? "primary" : "outline-secondary"
                          }
                          checked={view === "card"}
                          value="card"
                          onChange={() => setView("card")}
                          size="sm"
                        >
                          <FaBuilding className="me-1" />
                          Cards
                        </ToggleButton>
                        <ToggleButton
                          id="view-map"
                          type="radio"
                          variant={
                            view === "map" ? "primary" : "outline-secondary"
                          }
                          checked={view === "map"}
                          value="map"
                          onChange={() => setView("map")}
                          disabled
                          size="sm"
                        >
                          🗺️ Map
                        </ToggleButton>
                      </ButtonGroup>
                    </Col>

                    {/* Hotel Name Search */}
                    <Col lg={3} md={6}>
                      <Form.Group className="hotel-search-bar">
                        <Form.Label className="mb-1 small fw-semibold">
                          <FaSearch className="me-1 text-info" />
                          Hotel Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Search hotels by name..."
                          className="form-control-modern-sm"
                          value={hotelSearchTerm}
                          onChange={(e) => setHotelSearchTerm(e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    {/* Star Rating Filter */}
                    <Col lg={2} md={6}>
                      <Form.Group>
                        <Form.Label className="mb-1 small fw-semibold">
                          <FaStar className="me-1 text-warning" />
                          Star Rating
                        </Form.Label>
                        <Select
                          isMulti
                          options={starOptions}
                          value={starRating}
                          onChange={setStarRating}
                          placeholder="All Stars"
                          className="modern-select-sm"
                        />
                      </Form.Group>
                    </Col>

                    {/* Hotel Type Filter */}
                    <Col lg={2} md={6}>
                      <Form.Group>
                        <Form.Label className="mb-1 small fw-semibold">
                          <FaBuilding className="me-1 text-info" />
                          Hotel Type
                        </Form.Label>
                        <Select
                          isMulti
                          options={hotelTypeOptions}
                          value={hotelType}
                          onChange={setHotelType}
                          placeholder="All Types"
                          className="modern-select-sm"
                        />
                      </Form.Group>
                    </Col>

                    {/* Channel Type Filter */}
                    <Col lg={2} md={6}>
                      <Form.Group>
                        <Form.Label className="mb-1 small fw-semibold">
                          <FaGlobe className="me-1 text-success" />
                          Channel
                        </Form.Label>
                        <Select
                          isMulti
                          options={channelTypeOptions}
                          value={channelType}
                          onChange={setChannelType}
                          placeholder="All Channels"
                          className="modern-select-sm"
                        />
                      </Form.Group>
                    </Col>

                    {/* Sort Options */}
                    <Col lg={2} md={6}>
                      <Form.Group>
                        <Form.Label className="mb-1 small fw-semibold">
                          <FaSort className="me-1 text-secondary" />
                          Sort By
                        </Form.Label>
                        <Form.Select
                          size="sm"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="form-control-modern-sm"
                        >
                          <option value="priceAsc">Price: Low to High</option>
                          <option value="priceDesc">Price: High to Low</option>
                          <option value="ratingDesc">
                            Rating: High to Low
                          </option>
                          <option value="ratingAsc">Rating: Low to High</option>
                          <option value="nameAsc">Name: A-Z</option>
                          <option value="nameDesc">Name: Z-A</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Loading State - only shows during initial search */}
              {isLoading && (
                <Card className="shadow-sm rounded-xl mb-4">
                  <Card.Body className="text-center py-5">
                    <div className="loading-animation mb-3">
                      <Spinner animation="border" variant="primary" size="lg" />
                    </div>
                    <h4 className="text-primary fw-bold">
                      Searching the Best Results...
                    </h4>
                    <p className="text-muted">
                      Please wait while we find the perfect hotels for you
                    </p>
                  </Card.Body>
                </Card>
              )}

              {/* Search Results - shows when we have any results (even during polling) */}
              {hasSearched && (
                <>
                  {view === "card" && (
                    <Row xs={1} md={2} xl={3} className="g-3">
                      {pageItems.length > 0 ? (
                        pageItems.map((hotel) => (
                          <Col key={hotel.id}>
                            <Card className="shadow-sm rounded-xl h-100 hotel-card-modern">
                              <div className="hotel-image-container">
                                <LazyImage src={hotel.image} alt={hotel.name} />
                                <div className="hotel-rating-badge">
                                  <FaStar className="text-warning me-1" />
                                  {hotel.rating}
                                </div>
                              </div>
                              <Card.Body className="p-3">
                                <h6 className="hotel-name mb-2 fw-bold">
                                  {hotel.name}
                                </h6>
                                <p className="hotel-location mb-2 text-muted small">
                                  📍 {hotel.city}
                                </p>
                                <Badge bg="success" className="mb-3 hotel-badge">
                                  {hotel.badge}
                                </Badge>
                                <div className="hotel-price-section">
                                  <div className="hotel-price">
                                    {hotel.price
                                      ? `Starts from AED ${hotel.price.toLocaleString()}`
                                      : "Price Unavailable"}
                                  </div>
                                  <Button className="btn-view-rooms" size="sm">
                                    View Rooms
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))
                      ) : (
                        <Col>
                          <Card className="shadow-sm rounded-xl">
                            <Card.Body className="text-center text-muted py-5">
                              <FaSearch className="display-4 text-muted mb-3" />
                              <h5>No results found</h5>
                              <p>Try adjusting your filters or search criteria.</p>
                            </Card.Body>
                          </Card>
                        </Col>
                      )}
                    </Row>
                  )}

                  {/* Pagination */}
                  {pageItems.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-4">
                      <small className="text-muted fw-semibold">
                        Showing {pageIndex * pageSize + 1}-
                        {Math.min(pageIndex * pageSize + pageSize, totalElements)} of {totalElements}{" "}
                        results
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
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}