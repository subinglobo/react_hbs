import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, InputGroup, Pagination } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

// Demo rows – replace with API data later
const demoRows = Array.from({ length: 20 }, (_, i) => {
  const index = i + 1;
  const startDay = 10 + i;
  const endDay = startDay + 1;
  return {
    id: index,
    agentName: 'Globo Agent',
    customerName: `Customer ${index}`,
    bookingCode: `CNFAGT${1650 + i}`,
    referenceCode: `CNFS20250310052740${(900 + i).toString()}`,
    bookDate: `${String((i % 12) + 1).padStart(2, '0')}/${String((i % 28) + 1).padStart(2, '0')}/2025`,
    bookingDetails: `TEST HOTEL (ONLY FOR TESTING) ${startDay}/10/2025 - ${endDay}/10/2025`,
    deadlineDate: `2025-10-${String(10 + (i % 10)).padStart(2, '0')}`,
    notification: 'Not Confirmed',
  };
});

const PER_PAGE_OPTIONS = [10, 25, 50];

function getCurrentMonthValue(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export default function HotelbookingList() {
  const [status, setStatus] = useState('upcoming');
  const [period, setPeriod] = useState(getCurrentMonthValue());
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [perPage, setPerPage] = useState(PER_PAGE_OPTIONS[0]);
  const [page, setPage] = useState(1);

  // When year or month changes, update period (YYYY-MM)
  useEffect(() => {
    setPeriod(`${year}-${month}`);
  }, [year, month]);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setQuery(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const base = demoRows; // In real case, filter by status/period server-side
    if (!normalized) return base;
    return base.filter((r) =>
      [
        r.agentName,
        r.customerName,
        r.bookingCode,
        r.referenceCode,
        r.bookingDetails,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    );
  }, [query, status, period]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <TopBar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-80">
          <Container fluid>
            <Row className="mb-3 align-items-center">
              <Col>
                <h2 className="h4 mb-0">Booked Hotels</h2>
              </Col>
              <Col className="text-end">
                <Button className="btn-indigo">New</Button>
              </Col>
            </Row>

            <Card className="shadow-sm mb-3">
              <Card.Header className="fw-semibold">List of Bookings</Card.Header>
              <Card.Body>
                <Row className="g-3 align-items-end">
                  <Col md={6} lg={6}>
                    <div className="text-muted small mb-1">Type Of Booking</div>
                    <div className="d-flex flex-wrap gap-4">
                      <Form.Check inline type="radio" id="type-upcoming" name="type" label="Upcoming" checked={status === 'upcoming'} onChange={() => setStatus('upcoming')} />
                      <Form.Check inline type="radio" id="type-completed" name="type" label="Completed" checked={status === 'completed'} onChange={() => setStatus('completed')} />
                      <Form.Check inline type="radio" id="type-cancelled" name="type" label="Cancelled" checked={status === 'cancelled'} onChange={() => setStatus('cancelled')} />
                    </div>
                  </Col>
                  <Col md={6} lg={6}>
                    <div className="d-flex flex-wrap justify-content-end gap-2">
                      <div>
                        <div className="text-muted small mb-1">Time Period</div>
                        <div className="d-flex gap-2">
                          <Form.Select size="sm" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: 140 }}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                              <option key={m} value={String(m).padStart(2, '0')}>
                                {new Date(2024, m - 1).toLocaleDateString('en-US', { month: 'long' })}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Select size="sm" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: 100 }}>
                            {Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 3 + i).map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </Form.Select>
                        </div>
                      </div>
                      <div>
                        <div className="text-muted small mb-1">Search</div>
                        <InputGroup size="sm">
                          <InputGroup.Text>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z"/></svg>
                          </InputGroup.Text>
                          <Form.Control placeholder="Search bookings..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                          {searchInput && (
                            <Button variant="outline-secondary" size="sm" onClick={() => setSearchInput('')}>Clear</Button>
                          )}
                        </InputGroup>
                      </div>
                      
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">Display</span>
                    <Form.Select
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setPage(1);
                      }}
                      style={{ width: 90 }}
                      className="form-select-sm"
                    >
                      {PER_PAGE_OPTIONS.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </Form.Select>
                    <span className="text-muted">records</span>
                  </div>
                </div>

                <div className="table-responsive">
                  <Table hover bordered className="align-middle booking-table">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: 60 }}>S.N</th>
                        <th>Agent Name</th>
                        <th>Customer Name</th>
                        <th>Booking Code</th>
                        <th>Reference Code</th>
                        <th>Book Date</th>
                        <th>Booking Details</th>
                        <th>Deadline Date</th>
                        <th>Notification</th>
                        <th style={{ width: 120 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedRows.length === 0 && (
                        <tr>
                          <td colSpan={10} className="text-center text-muted py-4">No entries</td>
                        </tr>
                      )}
                      {pagedRows.map((r, idx) => (
                        <tr key={r.id}>
                          <td>{(currentPage - 1) * perPage + idx + 1}</td>
                          <td>{r.agentName}</td>
                          <td>{r.customerName}</td>
                          <td>{r.bookingCode}</td>
                          <td className="text-wrap-anywhere">{r.referenceCode}</td>
                          <td>{r.bookDate}</td>
                          <td className="text-wrap-anywhere">{r.bookingDetails}</td>
                          <td>{r.deadlineDate}</td>
                          <td>
                            <Badge bg="danger" pill>{r.notification}</Badge>
                          </td>
                          <td>
                            <div className="action-icons">
                              <button type="button" className="icon-action" title="View" aria-label="View booking">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              </button>
                             <button type="button" className="icon-action" title="Delete" aria-label="Delete booking">
                              <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 20 20"  fill="currentColor"
                              className="w-4 h-4">
                              <path fillRule="evenodd" 
                             d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 100 2h.293l.853 10.24A2 2 0 007.138 18h5.724a2 2 0 001.992-1.76L15.707 6H16a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zm-3.707 4l.833 10h7.748l.833-10H5.293z"
                            clipRule="evenodd" />
                            </svg>
                        </button> </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted small">
                    Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} entries
                  </div>
                  <Pagination className="mb-0">
                    <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Pagination.Item key={p} active={p === currentPage} onClick={() => setPage(p)}>
                        {p}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
                  </Pagination>
                </div>
              </Card.Body>
            </Card>
          </Container>
        </main>
      </div>
    </div>
  );
}


