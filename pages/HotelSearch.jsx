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
  Spinner,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import Select from "react-select";
import axiosInstance from "../components/AxiosInstance";
import {
  FaLightbulb,
  FaSearch,
  FaSort,
  FaStar,
  FaBuilding,
  FaGlobe,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

  // Filter states
  const [starRating, setStarRating] = useState([]);
  const [hotelType, setHotelType] = useState([]);
  const [channelType, setChannelType] = useState([]);
  const [sortBy, setSortBy] = useState("priceAsc");
  const [hotelSearchTerm, setHotelSearchTerm] = useState("");
  const [errors, setErrors] = useState({});

  const [allResults, setAllResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("card");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10); // Set to 20 as per your example
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearchResult, setHasSearchResult] = useState(false);
  const [pollStatus, setPollStatus] = useState("IDLE");
  const [searchId, setSearchId] = useState(null);
  const [isDestinationLoading, setIsDestinationLoading] = useState(false);
  const resultsRef = useRef(null);

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

  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Debounced city search function
  const debouncedCitySearch = useRef(
    debounce(async (searchText = "") => {
      if (!searchText || searchText.length < 2) {
        setDestinationOptions([]);
        return;
      }

      setIsDestinationLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/province?search=${searchText}`
        );
        const cityApiRes = Array.isArray(response.data) ? response.data : [];
        const options = cityApiRes.slice(0, 50).map((city) => ({
          value: city.id,
          label: `${city.stateName}, ${city.country}`,
          countryId: city.countryId,
        }));
        setDestinationOptions(options);
      } catch (error) {
        console.log("axios call error for city list:", error);
        setDestinationOptions([]);
      } finally {
        setIsDestinationLoading(false);
      }
    }, 300)
  ).current;

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

  // const pageItems = useMemo(() => allResults, [allResults]);

  const filteredResults = useMemo(() => {
    let results = allResults;

    // Filter by hotel name search
    if (hotelSearchTerm) {
      results = results.filter((hotel) =>
        hotel.name.toLowerCase().includes(hotelSearchTerm.toLowerCase())
      );
    }

    // Filter by star rating
    if (starRating.length > 0) {
      const selectedStars = starRating.map(s => s.value);
      results = results.filter((hotel) =>
        selectedStars.includes(hotel.rating)
      );
    }

    // Filter by hotel type
    if (hotelType.length > 0) {
      const selectedTypes = hotelType.map(t => t.value);
      results = results.filter((hotel) =>
        selectedTypes.includes(hotel.hotelType)
      );
    }

    // Filter by channel type
    if (channelType.length > 0) {
      const selectedChannels = channelType.map(c => c.value);
      console.log("Filtering by channel types:", selectedChannels);
      console.log("Available hotel channel types:", [...new Set(results.map(h => h.channelType))]);
      results = results.filter((hotel) => {
        const matches = selectedChannels.includes(hotel.channelType);
        console.log(`Hotel ${hotel.name}: channelType=${hotel.channelType}, matches=${matches}`);
        return matches;
      });
    }

    console.log("Final filtered results count:", results.length);
    return results;
  }, [allResults, hotelSearchTerm, starRating, hotelType, channelType]);

  // Server-side pagination: current page items are already in allResults.
  // So page items = filteredResults without client-side slicing.
  const pageItems = useMemo(() => {
    console.log(`Render page ${pageIndex + 1}. Using server-side page items count=${filteredResults.length}`);
    return filteredResults;
  }, [filteredResults, pageIndex]);

  const effectiveTotalPages = useMemo(() => Math.max(1, totalPages - 1), [totalPages]);

  const pageNumbers = useMemo(() => {
    const current = pageIndex + 1;
    const total = effectiveTotalPages;
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
  }, [pageIndex, effectiveTotalPages]);

  const goToPage = (idx) => {
    const total = effectiveTotalPages;
    if (idx < 0 || idx >= total) return;
    setPageIndex(idx);
    // Smooth scroll to results
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
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

  // Optimized city search function
  const cityList = (searchText = "") => {
    debouncedCitySearch(searchText);
  };

  // Load popular destinations on first click (non-blocking)
  const loadPopularDestinations = async () => {
    if (destinationOptions.length > 0) return; // Already loaded
    
    try {
      setIsDestinationLoading(true);
      const response = await axiosInstance.get('/api/province?limit=20');
      const cityApiRes = Array.isArray(response.data) ? response.data : [];
      const options = cityApiRes.map((city) => ({
        value: city.id,
        label: `${city.stateName}, ${city.country}`,
        countryId: city.countryId,
      }));
      setDestinationOptions(options);
    } catch (error) {
      console.log("Error loading popular destinations:", error);
    } finally {
      setIsDestinationLoading(false);
    }
  };

  useEffect(() => {
    countryList();
    // Don't load cities on initial render to prevent UI blocking
  }, []);

  // Reset page index when filters change and auto-scroll to results
  useEffect(() => {
    setPageIndex(0);
    if (hasSearchResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hotelSearchTerm, starRating, hotelType, channelType, sortBy]);

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

    if (!selectedNationality) {
      newErrors.nationality = "Nationality is required";
    }

    if (!selectedDestination) {
      newErrors.destination = "Destination is required";
    }

    if (!checkIn) {
      newErrors.checkIn = "Check-in date is required";
    }

    if (!checkOut) {
      newErrors.checkOut = "Check-out date is required";
    }

    if (!agent) {
      newErrors.agent = "Agent is required";
    }

    return newErrors;
  };

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _omit, ...rest } = prev;
      return rest;
    });
  };

  const fetchHotels = async (page, searchId, agentId) => {
    try {
      const params = {
        agentId: 1,   //agentId || 1,
        page: page, // Use 0-based page indexing
        pageSize,
        sortBy: sortBy === "priceAsc" || sortBy === "priceDesc" ? "baseRate" : sortBy,
        sortOrder: sortBy === "priceAsc" || sortBy === "ratingAsc" || sortBy === "nameAsc" ? "asc" : "desc",
        starRating: starRating.map((s) => s.value).join(",") || undefined,
        apiType: channelType.map((c) => c.value.toUpperCase()).join(",") || undefined,
      };

      const res = await axiosInstance.get(`/hotel-search/results/${searchId}`, { params });

      const mappedResults = Array.isArray(res.data.result)
        ? res.data.result.map((hotel, index) => {
            console.log("Raw hotel data:", hotel);
            return {
              id: hotel.hotelCode
                ? `${searchId}-${hotel.hotelCode}`
                : `${searchId}-h${index + 1}`,
              searchId,
              hotelCode: hotel.hotelCode || null,
              name: hotel.hotelName || "Unknown Hotel",
              address: hotel.hotelAddress || "",
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
              channelType: hotel.apiType?.toLowerCase() || "inhouse",
            };
          })
        : [];

      // res.data.totalPages = 100;
      console.log("res:::" , res)
      console.log("Mapped results with channel types:", mappedResults.map(h => ({ name: h.name, channelType: h.channelType })))
      setAllResults(mappedResults);
      // Backend returns totalResults = total items across all pages
      setTotalElements(Number(res.data.totalResults) || mappedResults.length);
      setTotalPages(Math.max(1, Math.ceil((Number(res.data.totalResults) || mappedResults.length) / pageSize)));
      setHasSearchResult(true);
      return res.data;
    } catch (err) {
      console.error("Fetch hotels failed:", err);
      setPollStatus("ERROR");
      throw err;
    }
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
      let localPollCount = 0;

      const poll = async () => {
        try {
          localPollCount++;
          const res = await axiosInstance.get(url, { params });

          console.log(
            `Poll ${localPollCount} received ${
              res.data.result?.length || 0
            } hotels`
          );

          if (onUpdate) {
            onUpdate(res.data, localPollCount);
          }

          if (checkComplete(res.data)) {
            setPollStatus("COMPLETED");
            return resolve(res.data);
          }

          if (Date.now() - startTime >= timeoutMs) {
            setPollStatus("TIMEOUT");
            return reject(new Error("Polling timed out"));
          }

          setTimeout(poll, intervalMs);
        } catch (err) {
          console.error("Poll failed:", err);
          setPollStatus("ERROR");
          reject(err);
        }
      };

      setPollStatus("IN_PROGRESS");
      setTimeout(poll, initialDelay);
    });
  };

  // Reset form function
  const resetForm = () => {
    setSelectedNationality(null);
    setSelectedDestination(null);
    setCheckIn("");
    setCheckOut("");
    setNights(1);
    setAgent("");
    setRooms([{ adults: 2, children: 0, childAges: [] }]);
    setRoomsOpen(false);
    setStarRating([]);
    setHotelType([]);
    setChannelType([]);
    setSortBy("priceAsc");
    setHotelSearchTerm("");
    setErrors({});
    setAllResults([]);
    setHasSearched(false);
    setHasSearchResult(false);
    setPageIndex(0);
    setTotalElements(0);
    setTotalPages(1);
    setPollStatus("IDLE");
    setSearchId(null);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setHasSearched(false);
      return;
    }
    // clear any stale errors on valid submit
    setErrors({});

    setIsLoading(true);
    setHasSearched(true);
    // Hide filter section until results actually arrive
    setHasSearchResult(false);
    setAllResults([]);
    setPollStatus("IDLE");
    setPageIndex(0);
    setTotalElements(0);
    setTotalPages(1);

    try {
      const nationalityId = "AF"; //selectedNationality.value;
      const destinationCityId = 88; //selectedDestination.value;
      const destinationCountryId = 23; //selectedDestination.countryId;
      const noOfRooms = String(rooms.length);

      const roomConfigurations = rooms.map((room, index) => ({
        roomNo: index + 1,
        adultCount: String(room.adults || 1),
        childCount: String(room.children || 0),
        childAges: room.childAges?.length ? room.childAges : [0],
        adultAges: room.adultAges?.length ? room.adultAges : [25],
      }));

      const agentId = 1; //agent;

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
      setSearchId(searchId);

      const params = {
        agentId : 1,
        page: 0, // Start with page 0
        pageSize,
        sortBy: sortBy === "priceAsc" || sortBy === "priceDesc" ? "baseRate" : sortBy,
        sortOrder: sortBy === "priceAsc" || sortBy === "ratingAsc" || sortBy === "nameAsc" ? "asc" : "desc",
        starRating: starRating.map((s) => s.value).join(",") || undefined,
        apiType: channelType.map((c) => c.value.toUpperCase()).join(",") || undefined,
      };

      await pollUntilComplete(
        `/hotel-search/results/${searchId}`,
        params,
        (data) => data.finalStatus === "COMPLETED",
        (data) => {
          const mappedResults = Array.isArray(data.result)
            ? data.result.map((hotel, index) => ({
                id: hotel.hotelCode
                  ? `${searchId}-${hotel.hotelCode}`
                  : `${searchId}-h${index + 1}`,
                searchId,
                hotelCode: hotel.hotelCode || null,
                name: hotel.hotelName || "Unknown Hotel",
                address: hotel.hotelAddress || "",
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
                channelType: hotel.apiType?.toLowerCase() || "inhouse",
              }))
            : [];

              console.log("handlesubmit data::" , data)
              console.log("mappedResults::" , mappedResults)
              console.log("mappedResults length::" , mappedResults.length)
          setAllResults(mappedResults);
          setTotalElements(Number(data.totalResults) || mappedResults.length);
          setTotalPages(Math.max(1, Math.ceil((Number(data.totalResults) || mappedResults.length) / pageSize)));
          setHasSearchResult(true);
        },
        4000,
        20000,
        2000
      );
    } catch (err) {
      console.error("Search failed:", err);
      setHasSearched(false);
      setPollStatus("ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch new page when pageIndex or filters change
  useEffect(() => {
    if (!searchId || !hasSearched) return;

    setIsLoading(true);
    fetchHotels(pageIndex, searchId, agent).finally(() => setIsLoading(false));
  }, [pageIndex, sortBy, starRating, channelType, searchId, agent, hasSearched]);

  // Add fade-in animation to CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-in;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <TopBar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4">
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
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-dark">
                        <FaGlobe className="me-2 text-primary" />
                        Nationality
                      </Form.Label>
                      <Select
                        options={nationalityList}
                        value={selectedNationality}
                        onChange={(option) => {
                          setSelectedNationality(option);
                          if (option) clearError("nationality");
                        }}
                        placeholder="Select nationality"
                        isSearchable
                        isClearable
                        className="modern-select"
                        styles={{
                          clearIndicator: (base) => ({
                            ...base,
                            color: '#6c757d',
                            '&:hover': {
                              color: '#dc3545'
                            }
                          })
                        }}
                      />
                      {errors.nationality && (
                        <div className="text-danger small mt-1">
                          {errors.nationality}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col lg={6} md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-dark">
                        <FaLightbulb className="me-2 text-warning" />
                        Destination
                      </Form.Label>
                      <Select
                        options={destinationOptions}
                        value={selectedDestination}
                        onChange={(option) => {
                          setSelectedDestination(option);
                          if (option) clearError("destination");
                        }}
                        placeholder="Where do you want to go?"
                        isSearchable
                        isClearable
                        className="modern-select"
                        isLoading={isDestinationLoading}
                        noOptionsMessage={() => 
                          isDestinationLoading 
                            ? "Searching destinations..." 
                            : "Type to search destinations..."
                        }
                        onMenuOpen={() => {
                          if (destinationOptions.length === 0) {
                            loadPopularDestinations();
                          }
                        }}
                        onInputChange={(inputValue, { action }) => {
                          if (action === "input-change") {
                            cityList(inputValue);
                          }
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: '42px',
                            border: '1px solid #dee2e6',
                            '&:hover': {
                              borderColor: '#86b7fe'
                            }
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 9999,
                            maxHeight: '200px'
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? '#f8f9fa' : 'white',
                            color: state.isSelected ? 'white' : '#212529',
                            '&:active': {
                              backgroundColor: '#0d6efd'
                            }
                          }),
                          clearIndicator: (base) => ({
                            ...base,
                            color: '#6c757d',
                            '&:hover': {
                              color: '#dc3545'
                            }
                          })
                        }}
                      />
                      {errors.destination && (
                        <div className="text-danger small mt-1">
                          {errors.destination}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

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
                          if (newCheckIn) clearError("checkIn");
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
                        onChange={(e) => {
                          setCheckOut(e.target.value);
                          if (e.target.value) clearError("checkOut");
                        }}
                      />
                      {errors.checkOut && (
                        <div className="text-danger small mt-1">
                          {errors.checkOut}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

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

                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-dark">
                        👤 Agent
                      </Form.Label>
                      <Form.Select
                        className="form-control-modern"
                        value={agent}
                        onChange={(e) => {
                          setAgent(e.target.value);
                          if (e.target.value) clearError("agent");
                        }}
                      >
                        <option value="">Select Agent</option>
                        <option value="101">Agent 101</option>
                        <option value="102">Agent 102</option>
                      </Form.Select>
                      {/* {agent && (
                        <Button
                          type="button"
                          variant="outline-danger"
                          size="sm"
                          className="mt-1"
                          onClick={() => setAgent("")}
                        >
                          Clear
                        </Button>
                      )} */}
                      {errors.agent && (
                        <div className="text-danger small mt-1">
                          {errors.agent}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {roomsOpen && (
                  <Row className="g-3 mt-3">
                    <Col md={12}>
                      <RoomGuestSelector value={rooms} onChange={setRooms} />
                    </Col>
                  </Row>
                )}

                <Row className="mt-4">
                  <Col className="d-flex justify-content-center gap-3">
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
                    {/* <Button
                      type="button"
                      variant="outline-secondary"
                      size="lg"
                      onClick={resetForm}
                      disabled={isLoading}
                    >
                      Reset Form
                    </Button> */}
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {hasSearched && pollStatus === "IN_PROGRESS" && (
            <Card className="shadow-sm rounded-xl mb-4">
              <Card.Body className="text-center py-5">
                <div className="results-loader">
                  <div className="loader-ring">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h4 className="text-primary fw-bold mt-3 mb-1">
                    Fetching Best Results...
                  </h4>
                  <p className="text-muted small mb-0">
                    Comparing rates across multiple providers
                  </p>
                </div>
              </Card.Body>
            </Card>
          )}

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

          {hasSearchResult && !isLoading && pollStatus !== "IN_PROGRESS" && (
            <div ref={resultsRef}>
              <Card className="shadow-sm rounded-xl mb-3 filtersection">
                <Card.Body className="p-3">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-3">
                    <h6 className="mb-2 mb-md-0 fw-bold text-primary">
                      <FaSearch className="me-2" />
                      Filters & Sort
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      <ButtonGroup size="sm">
                        <ToggleButton
                          id="view-card"
                          type="radio"
                          variant={view === "card" ? "primary" : "outline-secondary"}
                          checked={view === "card"}
                          value="card"
                          onChange={() => setView("card")}
                        >
                          <FaBuilding className="me-1" />
                          Cards
                        </ToggleButton>
                        <ToggleButton
                          id="view-map"
                          type="radio"
                          variant={view === "map" ? "primary" : "outline-secondary"}
                          checked={view === "map"}
                          value="map"
                          onChange={() => setView("map")}
                          disabled
                        >
                          🗺️ Map
                        </ToggleButton>
                      </ButtonGroup>
                    </div>
                  </div>
                  
                  <Row className="g-3">
                    <Col lg={3} md={4} sm={6}>
                      <Form.Group>
                        <Form.Label className="mb-1 small fw-semibold text-dark">
                          <FaSearch className="me-1 text-info" />
                          Hotel Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Search hotels..."
                          className="form-control-modern-sm"
                          value={hotelSearchTerm}
                          onChange={(e) => setHotelSearchTerm(e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    <Col lg={3} md={4} sm={6}>
                      <Form.Group>
                        <Form.Label className="mb-1 small fw-semibold text-dark">
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
                          menuPosition="absolute"
                          menuPlacement="auto"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: '36px',
                              border: '1px solid #dee2e6',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              '&:hover': {
                                borderColor: '#86b7fe'
                              }
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 99999,
                              position: 'absolute',
                              marginTop: '2px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              border: '1px solid #dee2e6',
                              borderRadius: '6px'
                            })
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col lg={3} md={4} sm={6}>
                      <Form.Group>
                        <Form.Label className="mb-1 small fw-semibold text-dark">
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
                          menuPosition="absolute"
                          menuPlacement="auto"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: '36px',
                              border: '1px solid #dee2e6',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              '&:hover': {
                                borderColor: '#86b7fe'
                              }
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 99999,
                              position: 'absolute',
                              marginTop: '2px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              border: '1px solid #dee2e6',
                              borderRadius: '6px'
                            })
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col lg={3} md={4} sm={6}>
                      <Form.Group>
                        <Form.Label className="mb-1 small fw-semibold text-dark">
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
                          menuPosition="absolute"
                          menuPlacement="auto"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: '36px',
                              border: '1px solid #dee2e6',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              '&:hover': {
                                borderColor: '#86b7fe'
                              }
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 99999,
                              position: 'absolute',
                              marginTop: '2px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              border: '1px solid #dee2e6',
                              borderRadius: '6px'
                            })
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col lg={2} md={4} sm={6}>
                      <Form.Group>
                        <Form.Label className="mb-1 small fw-semibold text-dark">
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
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col lg={2} md={4} sm={6} className="d-flex align-items-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="w-100"
                        onClick={() => {
                          setStarRating([]);
                          setHotelType([]);
                          setChannelType([]);
                          setSortBy("priceAsc");
                          setHotelSearchTerm("");
                        }}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

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

              <div>
                {view === "card" && (
                  <Row xs={1} md={2} xl={3} className="g-3">
                    {pageItems.length > 0 ? (
                      pageItems.map((hotel) => (
                        <Col key={hotel.id}>
                          <Card className="shadow-sm rounded-xl h-100 hotel-card-modern animate-fadeIn">
                            <div className="hotel-image-container">
                              <LazyImage src={hotel.image} alt={hotel.name} />
                              <div className="hotel-rating-badge">
                                <FaStar className="text-warning me-1" />
                                {hotel.rating}
                              </div>
                            </div>
                            <Card.Body className="p-3">
                              <h6 className="hotel-name mb-2 fw-bold" aria-label="hotel-name">
                                {hotel.name || hotel.hotelName || "Unknown Hotel"}
                              </h6>
                              <p className="hotel-location mb-2 text-muted small">
                                📍 {hotel.address || hotel.city}
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
                                <Button 
                                  className="btn-view-rooms" 
                                  size="sm"
                                  onClick={() => {
                                    const nationalityValue = selectedNationality?.value;
                                    const nationalityCode = (typeof nationalityValue === 'string' && nationalityValue.length === 2)
                                      ? nationalityValue
                                      : 'AF';
                                    const agentIdToUse = agent || '101';
                                    const roomsPayload = rooms.map(r => ({
                                      adults: r.adults || 1,
                                      children: r.children || 0,
                                      adultAges: Array.from({ length: r.adults || 1 }, () => 30),
                                    }));
                                    const payload = {
                                      checkInDate: checkIn,
                                      checkOutDate: checkOut,
                                      hotelCode: hotel.hotelCode || hotel.id?.split('-').slice(1).join('-') || '',
                                      nationality: nationalityCode,
                                      agentId: String(agentIdToUse),
                                      apiId: 11,
                                      rooms: roomsPayload,
                                    };
                                    const meta = {
                                      hotelName: hotel.name,
                                      address: hotel.address || hotel.city,
                                      starRating: hotel.rating || 0,
                                      phone: '',
                                      hotelImage : hotel.image,
                                    };
                                    try {
                                      sessionStorage.setItem('roomListPayload', JSON.stringify({ payload, meta }));
                                    } catch {}
                                    window.open('/room-list', '_blank');
                                  }}
                                >
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
                            <p>
                              {hotelSearchTerm || starRating.length > 0 || hotelType.length > 0 || channelType.length > 0
                                ? "No hotels match your current filters. Try adjusting your search criteria or clearing some filters."
                                : "Try adjusting your filters or search criteria."}
                            </p>
                            {(hotelSearchTerm || starRating.length > 0 || hotelType.length > 0 || channelType.length > 0) && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  setStarRating([]);
                                  setHotelType([]);
                                  setChannelType([]);
                                  setSortBy("priceAsc");
                                  setHotelSearchTerm("");
                                }}
                              >
                                Clear All Filters
                              </Button>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                  </Row>
                )}

                {filteredResults.length > 0 && (
                  (() => {
                    const hasClientOnlyFilters = Boolean(hotelSearchTerm) || hotelType.length > 0;
                    const showingStart = pageIndex * pageSize + 1;
                    const showingEnd = hasClientOnlyFilters
                      ? Math.min(pageIndex * pageSize + pageSize, filteredResults.length)
                      : Math.min(pageIndex * pageSize + pageSize, totalElements);
                    const totalCount = hasClientOnlyFilters ? filteredResults.length : totalElements;
                    return (
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-4">
                        <small className="text-muted fw-semibold">
                          Showing {showingStart}-{showingEnd} of {totalCount} results
                        </small>
                        {!hasClientOnlyFilters && (
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
                              disabled={pageIndex >= effectiveTotalPages - 1}
                              onClick={() => goToPage(pageIndex + 1)}
                            />
                          </Pagination>
                        )}
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}