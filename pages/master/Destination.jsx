
import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Form } from "react-bootstrap";
import axiosInstance from "../../components/AxiosInstance";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

export default function Destination(){
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  // Pagination: fixed 10 rows per page
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/destination");
      setPlaces(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("error::", error);
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setCountry("");
    setStateName("");
    setName("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setCountry(item.country || "");
    setStateName(item.state || "");
    setName(item.name || "");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const saveDestination = async () => {
    if (!country.trim() || !stateName.trim() || !name.trim()) return;
    const payload = { country: country.trim(), state: stateName.trim(), name: name.trim() };
    setSaving(true);
    try {
      if (editing && editing.id != null) {
        await axiosInstance.put(`/api/destination/${editing.id}`, payload);
      } else {
        await axiosInstance.post(`/api/destination`, payload);
      }
      await fetchDestinations();
      setShowModal(false);
    } catch (error) {
      console.log("save error::", error);
    } finally {
      setSaving(false);
    }
  };

  const removeDestination = async (id) => {
    if (!id) return;
    try {
      await axiosInstance.delete(`/api/destination/${id}`);
      setPlaces((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.log("delete error::", error);
    }
  };

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(places.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pagedPlaces = places.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalEntries = places.length;
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endEntry = Math.min(currentPage * perPage, totalEntries);

  // Windowed page numbers (5 at a time)
  const windowSize = 5;
  const currentWindowIndex = Math.floor((currentPage - 1) * 1 / windowSize);
  const windowStart = currentWindowIndex * windowSize + 1;
  const windowEnd = Math.min(windowStart + windowSize - 1, totalPages);
  const pageNumbers = Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i);

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <TopBar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <Card className="shadow-sm rounded-xl">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Destinations</span>
              <Button className="btn-indigo" onClick={openCreate}>+ Create</Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover striped className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 100 }}>S/N</th>
                    <th>State</th>
                    <th>Country</th>
                    <th>Destination</th>
                    <th style={{ width: 120 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">Loading...</td>
                    </tr>
                  )}
                  {!isLoading && pagedPlaces.map((destination, index) => (
                    <tr key={destination.id ?? index}>
                      <td>{(currentPage - 1) * perPage + index + 1}</td>
                      <td>{destination.state}</td>
                      <td>{destination.country}</td>
                      <td>{destination.name}</td>
                      <td>
                        <div className="action-icons">
                          <button type="button" className="icon-action" title="Edit" aria-label="Edit destination" onClick={() => openEdit(destination)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.731 2.269a2.625 2.625 0 00-3.714 0l-1.157 1.157 3.714 3.714 1.157-1.157a2.625 2.625 0 000-3.714z"/><path d="M3 17.25V21h3.75L19.436 8.314l-3.714-3.714L3 17.25z"/></svg>
                          </button>
                          <button type="button" className="icon-action" title="Delete" aria-label="Delete destination" onClick={() => removeDestination(destination.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 100 2h.293l.853 10.24A2 2 0 007.138 18h5.724a2 2 0 001.992-1.76L15.707 6H16a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zm-3.707 4l.833 10h7.748l.833-10H5.293z" clipRule="evenodd"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && pagedPlaces.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">No destinations found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <div className="d-flex justify-content-between align-items-center p-3 border-top">
                <div className="text-muted small">
                  {`Showing ${startEntry.toLocaleString()} to ${endEntry.toLocaleString()} of ${totalEntries.toLocaleString()} entries`}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  {pageNumbers.map((num) => (
                    <Button
                      key={num}
                      size="sm"
                      variant={num === currentPage ? "primary" : "outline-secondary"}
                      onClick={() => setPage(num)}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Modal show={showModal} onHide={closeModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>{editing ? 'Edit Destination' : 'Create Destination'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={(e) => { e.preventDefault(); saveDestination(); }}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Enter country" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="Enter state" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Destination</Form.Label>
                  <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter destination" />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal} disabled={saving}>Cancel</Button>
              <Button className="btn-indigo" onClick={saveDestination} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </Modal.Footer>
          </Modal>
        </main>
      </div>
    </div>
  );
}
