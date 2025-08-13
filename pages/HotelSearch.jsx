import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Button, Row, Col, Form, Badge, Pagination, ButtonGroup, ToggleButton, Placeholder } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function RoomGuestSelector({ value, onChange }){
  const [rooms, setRooms] = useState(value);

  const update = (next) => {
    setRooms(next);
    onChange && onChange(next);
  };

  const addRoom = () => update([...rooms, { adults: 2, children: 0, childAges: [] }]);
  const removeRoom = (index) => update(rooms.filter((_, i) => i !== index));

  const setAdults = (index, adults) => {
    const next = rooms.map((r, i) => i === index ? { ...r, adults } : r);
    update(next);
  };
  const setChildren = (index, children) => {
    const next = rooms.map((r, i) => i === index ? { ...r, children, childAges: Array.from({ length: children }, (_, j) => r.childAges[j] || 5) } : r);
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
                <Button variant="outline-danger" size="sm" onClick={() => removeRoom(i)}>Remove</Button>
              )}
            </div>
            <div className="d-flex flex-wrap gap-3 align-items-end">
              <Form.Group>
                <Form.Label>Adults</Form.Label>
                <Form.Select value={room.adults} onChange={(e) => setAdults(i, parseInt(e.target.value))}>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Children</Form.Label>
                <Form.Select value={room.children} onChange={(e) => setChildren(i, parseInt(e.target.value))}>
                  {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                </Form.Select>
              </Form.Group>
              {Array.from({ length: room.children }).map((_, idx) => (
                <Form.Group key={idx}>
                  <Form.Label>Child {idx + 1} Age</Form.Label>
                  <Form.Select value={room.childAges[idx] || 5} onChange={(e) => setChildAge(i, idx, parseInt(e.target.value))}>
                    {Array.from({ length: 17 }).map((__, age) => <option key={age} value={age}>{age}</option>)}
                  </Form.Select>
                </Form.Group>
              ))}
            </div>
          </Card.Body>
        </Card>
      ))}
      <Button variant="outline-primary" size="sm" onClick={addRoom}>+ Add Room</Button>
    </div>
  );
}

function LazyImage({ src, alt, className }){
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if ('IntersectionObserver' in window) {
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
    // Attempt to create responsive variants by replacing trailing size segment
    try{
      const small = url.replace(/\/[0-9]+\/[0-9]+$/, '/320/180');
      const medium = url.replace(/\/[0-9]+\/[0-9]+$/, '/480/270');
      const large = url.replace(/\/[0-9]+\/[0-9]+$/, '/640/360');
      return `${small} 320w, ${medium} 480w, ${large} 640w`;
    }catch{ return undefined; }
  };

  return (
    <div ref={containerRef} className={`ratio ratio-16x9 rounded-top overflow-hidden ${className || ''}`}>
      {!loaded && (
        <div className="skeleton w-100 h-100" />
      )}
      {inView && (
        <img
          src={src}
          srcSet={buildSrcSet(src)}
          sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          alt={alt}
          onLoad={()=> setLoaded(true)}
          className={`img-cover ${loaded ? 'img-loaded' : 'img-loading'}`}
        />
      )}
    </div>
  );
}

export default function HotelSearch(){
  const [nationality, setNationality] = useState('AE');
  const [destination, setDestination] = useState('Dubai');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState(1);
  const [agent, setAgent] = useState('');
  const [rooms, setRooms] = useState([{ adults: 2, children: 0, childAges: [] }]);
  const [roomsOpen, setRoomsOpen] = useState(false);

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.max(1, Math.ceil((end - start) / (1000*60*60*24)));
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
      const iso = new Date(out.getTime() - out.getTimezoneOffset()*60000).toISOString().slice(0,10);
      setCheckOut(iso);
    }
  };

  const dummyPool = useMemo(() => {
    const base = [
      { name: 'Taj Santacruz', city: 'Mumbai', price: 500.75, badge: 'Breakfast Included' },
      { name: 'The Orchid Hotel', city: 'Mumbai', price: 951.37, badge: 'Breakfast Included' },
      { name: 'Ramada Plaza', city: 'Mumbai', price: 1237.21, badge: 'Breakfast Included' },
      { name: 'The LaLiT Mumbai', city: 'Mumbai', price: 1254.27, badge: 'Breakfast Included' },
      { name: 'Grand Palace', city: 'Dubai', price: 780.0, badge: 'Breakfast Included' },
      { name: 'Marina Bay', city: 'Dubai', price: 980.0, badge: 'Breakfast Included' },
      { name: 'Palm Resort', city: 'Dubai', price: 1400.0, badge: 'Breakfast Included' },
    ];
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i + 1,
      ...base[i % base.length],
      image: `https://picsum.photos/seed/hs${i + 1}/480/270`,
      rating: 3 + (i % 3),
    }));
  }, []);

  const [allResults, setAllResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('priceAsc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyBreakfast, setOnlyBreakfast] = useState(false);
  const [view, setView] = useState('card');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(6); // fewer cards per page to improve perceived speed

  const filtered = useMemo(() => {
    let list = [...allResults];
    if (onlyBreakfast) list = list.filter(r => (r.badge || '').toLowerCase().includes('breakfast'));
    const min = parseFloat(minPrice);
    if (!Number.isNaN(min)) list = list.filter(r => r.price >= min);
    const max = parseFloat(maxPrice);
    if (!Number.isNaN(max)) list = list.filter(r => r.price <= max);
    if (sortBy === 'priceAsc') list.sort((a,b)=> a.price - b.price);
    if (sortBy === 'priceDesc') list.sort((a,b)=> b.price - a.price);
    if (sortBy === 'nameAsc') list.sort((a,b)=> a.name.localeCompare(b.name));
    if (sortBy === 'nameDesc') list.sort((a,b)=> b.name.localeCompare(a.name));
    return list;
  }, [allResults, onlyBreakfast, minPrice, maxPrice, sortBy]);

  const totalElements = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const pageItems = useMemo(() => {
    const start = pageIndex * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageIndex, pageSize]);

  useEffect(() => { setPageIndex(0); }, [filtered.length]);

  const pageNumbers = useMemo(() => {
    const current = pageIndex + 1; const total = totalPages; const nums = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) nums.push(i);
    } else {
      nums.push(1);
      const left = Math.max(2, current - 1);
      const right = Math.min(total - 1, current + 1);
      if (left > 2) nums.push('ellipsis-left');
      for (let i = left; i <= right; i++) nums.push(i);
      if (right < total - 1) nums.push('ellipsis-right');
      nums.push(total);
    }
    return nums;
  }, [pageIndex, totalPages]);

  const goToPage = (idx) => { if (idx < 0 || idx > totalPages - 1) return; setPageIndex(idx); };

  const onSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    try {
      // Try axios if available; otherwise fallback to dummy
      const { default: axios } = await import('axios').catch(() => ({ default: null }));
      if (axios) {
        // Example endpoint signature; replace when API is ready
        const { data } = await axios.get('/api/hotels/search', {
          params: { nationality, destination, checkIn, checkOut, nights, rooms, agent },
        });
        setAllResults(data?.content || []);
      } else {
        // Fallback: filter dummy pool by destination if provided
        const response = await new Promise((res) => setTimeout(() => {
          const list = dummyPool.filter(h => destination ? h.city.toLowerCase().includes(destination.toLowerCase()) : true);
          res({ content: list });
        }, 300));
        setAllResults(response.content);
      }
    } catch (err) {
      setAllResults([]);
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
              <Form onSubmit={onSearch}>
                {/* Row 1: Nationality + Destination */}
                <Row className="g-3 align-items-end">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Nationality</Form.Label>
                      <Form.Select value={nationality} onChange={(e)=> setNationality(e.target.value)}>
                        <option value="AE">United Arab Emirates</option>
                        <option value="IN">India</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="UK">United Kingdom</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={9}>
                    <Form.Group>
                      <Form.Label>Destination</Form.Label>
                      <div className="position-relative">
                        <span className="position-absolute" style={{ left: 12, top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
                        <Form.Control style={{ paddingLeft: 36 }} value={destination} onChange={(e)=> setDestination(e.target.value)} placeholder="Enter a destination or property" />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Row 2: Dates + Nights + Rooms */}
                <Row className="g-3 align-items-end mt-1">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Check-in</Form.Label>
                      <div className="position-relative input-with-icon">
                        <span className="icon-left">📅</span>
                        <Form.Control className="date-control" type="date" value={checkIn} onChange={(e)=> setCheckIn(e.target.value)} />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Check-out</Form.Label>
                      <div className="position-relative input-with-icon">
                        <span className="icon-left">📅</span>
                        <Form.Control className="date-control" type="date" value={checkOut} onChange={(e)=> setCheckOut(e.target.value)} />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>No. of Nights</Form.Label>
                      <Form.Control type="number" min={1} max={60} value={nights} onChange={(e)=> handleNightsChange(e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Rooms & Guests</Form.Label>
                    <Button
                      variant="outline-secondary"
                      className="w-100 text-start rooms-summary-btn"
                      type="button"
                      onClick={()=> setRoomsOpen(o => !o)}
                    >
                      {rooms.reduce((a,r)=> a + r.adults, 0)} adults{rooms.reduce((a,r)=> a + r.children, 0) ? `, ${rooms.reduce((a,r)=> a + r.children, 0)} child` : ''} · {rooms.length} room{rooms.length>1?'s':''}
                      <span className="float-end">{roomsOpen ? '▴' : '▾'}</span>
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
                {/* Row 3: Agent */}
                <Row className="g-3 mt-1">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Agent</Form.Label>
                      <Form.Select value={agent} onChange={(e)=> setAgent(e.target.value)}>
                        <option value="">Select Agent</option>
                        <option value="101">Agent 101</option>
                        <option value="102">Agent 102</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Row 4: Centered Search */}
                <Row className="mt-3">
                  <Col className="d-flex justify-content-center">
                    <Button type="submit" className="btn-search-large" disabled={isLoading}>{isLoading ? 'Searching...' : 'SEARCH'}</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          {!hasSearched && (
            <Card className="shadow-sm rounded-xl">
              <Card.Body className="text-center text-muted py-5">Use the search form above to find hotels.</Card.Body>
            </Card>
          )}

          {hasSearched && (
            <>
              <Card className="shadow-sm rounded-xl mb-3">
                <Card.Body className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <ButtonGroup>
                    <ToggleButton id="view-card" type="radio" variant={view==='card' ? 'dark' : 'outline-secondary'} checked={view==='card'} value="card" onChange={()=> setView('card')}>Card View</ToggleButton>
                    <ToggleButton id="view-map" type="radio" variant={view==='map' ? 'dark' : 'outline-secondary'} checked={view==='map'} value="map" onChange={()=> setView('map')} disabled>Map View</ToggleButton>
                  </ButtonGroup>
                  <div className="d-flex flex-wrap align-items-end gap-2">
                    <Form.Group>
                      <Form.Label className="mb-0 small">Min Price</Form.Label>
                      <Form.Control size="sm" type="number" value={minPrice} onChange={(e)=> setMinPrice(e.target.value)} placeholder="0" />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="mb-0 small">Max Price</Form.Label>
                      <Form.Control size="sm" type="number" value={maxPrice} onChange={(e)=> setMaxPrice(e.target.value)} placeholder="Any" />
                    </Form.Group>
                    <Form.Group className="ms-2">
                      <Form.Check type="checkbox" label="Breakfast only" checked={onlyBreakfast} onChange={(e)=> setOnlyBreakfast(e.target.checked)} />
                    </Form.Group>
                    <Form.Group className="ms-2">
                      <Form.Label className="mb-0 small">Sort</Form.Label>
                      <Form.Select size="sm" value={sortBy} onChange={(e)=> setSortBy(e.target.value)}>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                        <option value="nameAsc">Name: A-Z</option>
                        <option value="nameDesc">Name: Z-A</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </Card.Body>
              </Card>

              {view === 'card' && (
                <Row xs={1} md={2} xl={3} className="g-4">
                  {isLoading && Array.from({ length: pageSize }).map((_, idx) => (
                    <Col key={`sk-${idx}`}>
                      <Card className="shadow-sm rounded-xl h-100">
                        <div className="ratio ratio-16x9 rounded-top overflow-hidden">
                          <div className="skeleton w-100 h-100" />
                        </div>
                        <Card.Body>
                          <Placeholder as="div" animation="wave" className="mb-2"><Placeholder xs={8} /></Placeholder>
                          <Placeholder as="div" animation="wave" className="mb-3"><Placeholder xs={5} /></Placeholder>
                          <div className="d-flex justify-content-between align-items-center">
                            <Placeholder as="div" animation="wave"><Placeholder xs={3} /></Placeholder>
                            <Button disabled className="btn-green">View Rooms</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                  {!isLoading && pageItems.map(hotel => (
                    <Col key={hotel.id}>
                      <Card className="shadow-sm rounded-xl h-100 lazy-card">
                        <LazyImage src={hotel.image} alt={hotel.name} />
                        <Card.Body>
                          <div className="h5 mb-1">{hotel.name}</div>
                          <div className="text-muted mb-2">{hotel.city}</div>
                          <Badge bg="success" className="mb-3" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>{hotel.badge}</Badge>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="h5 mb-0">AED{hotel.price.toLocaleString()}</div>
                            <Button className="btn-green">View Rooms</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                  {pageItems.length === 0 && (
                    <Col><Card className="shadow-sm rounded-xl"><Card.Body className="text-center text-muted py-5">No results match filters.</Card.Body></Card></Col>
                  )}
                </Row>
              )}

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
                <small className="text-muted">
                  Showing {pageItems.length > 0 ? pageIndex * pageSize + 1 : 0}-{pageIndex * pageSize + pageItems.length} of {totalElements}
                </small>
                <Pagination className="mb-0 pagination-modern">
                  <Pagination.Prev disabled={pageIndex === 0} onClick={() => goToPage(pageIndex - 1)} />
                  {pageNumbers.map((n) => (
                    typeof n === 'number' ? (
                      <Pagination.Item key={n} active={n === pageIndex + 1} onClick={() => goToPage(n - 1)}>{n}</Pagination.Item>
                    ) : (
                      <Pagination.Ellipsis key={n} disabled />
                    )
                  ))}
                  <Pagination.Next disabled={pageIndex >= totalPages - 1} onClick={() => goToPage(pageIndex + 1)} />
                </Pagination>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}


