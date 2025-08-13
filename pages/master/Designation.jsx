import React, { useEffect, useMemo, useState } from "react";
import { Card, Button, Table, Modal, Form, Pagination } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/TopBar";
import axiosInstance from "../../components/AxiosInstance";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

export default function Designations() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const nextId = useMemo(
    () => Math.max(0, ...items.map((i) => i.id)) + 1,
    [items]
  );

  const openCreate = () => {
    setEditing(null);
    setName("");
    setError("");
    setShowModal(true);
  };

    const openEdit = (item) => {
    setEditing(item);
    setName(item.name);
    setShowModal(true);
  };

  const handleEdit = async () => {
    if (!editing) return;
    
    try {
      setIsLoading(true);
      const editRes = await axiosInstance.put(`/api/designation/${editing.designationId}`, {
        name: name
      });

      console.log("editRes::" , editRes)
      
      if (editRes.data) {
        toast.success("Designation Updated Successfully!");
        // First refresh the list
        await fetchDesignationList(page, search);
        // Then close modal and reset state
        closeModal();
      }
    } catch (error) {
      console.error("Edit error:", error);
      setError("Failed to update designation");
      toast.error("Failed to update designation");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setName("");
    setError("");
  };

  const fetchDesignationList = async (pageNum = 0, searchTerm = search) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10'
      });
      
      if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      console.log("Fetching designations with params:", params.toString());
      const res = await axiosInstance.get(`/api/designation?${params.toString()}`);
      console.log("Designations response:", res.data);
      
      // Check if response has data and pagination info
      if (res.data && Array.isArray(res.data)) {
        setItems(res.data);
        console.log("Updated items state:", res.data);
        
        // Since backend doesn't return totalPages, we'll calculate it based on data length
        // If we get less than 10 items, it's likely the last page
        if (res.data.length < 10) {
          setTotalPages(pageNum + 1);
        } else {
          // If we get exactly 10 items, there might be more pages
          // We'll set a reasonable total or keep the current totalPages
          setTotalPages(Math.max(totalPages, pageNum + 2));
        }
        
        setPage(pageNum);
      } else {
        setItems([]);
        setTotalPages(0);
        setPage(0);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load designations");
      setItems([]);
      setTotalPages(0);
      setPage(0);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDesignation = async () => {
    try {
      setIsLoading(true);
      const desigSaveRequest = { name: `${name}` };
      const desigSavedData = await axiosInstance.post(
        "/api/designation/saveDesignation",
        desigSaveRequest
      );
      if (desigSavedData.data !== 0) {
        toast.success("Designation added Successfully!");
        // First refresh the list
        await fetchDesignationList(page, search);
        // Then close modal
        closeModal();
      }
    } catch (error) {
      console.error("Save error:", error);
      setError("Sorry! Data not saved to db..");
      toast.error("Failed to save designation");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignationList();
  }, []);

  // Debug: Log when items change
  useEffect(() => {
    console.log("Items state updated:", items);
  }, [items]);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for search
    if (search !== "") {
      const timeout = setTimeout(() => {
        fetchDesignationList(0, search);
      }, 500); // 500ms delay
      setSearchTimeout(timeout);
    } else if (search === "") {
      // If search is cleared, fetch all data
      fetchDesignationList(0, "");
    }

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [search]);

  const handleDelete = (id) => {
    Swal.fire({
      title: `Are you sure? You want to delete id ${id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "swal-small",
        title: "swal-small-title",
        htmlContainer: "swal-small-text",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/api/designation/${id}`)
          .then(() => {
            toast.success("Designation deleted successfully");
            fetchDesignationList(page, search);
          })
          .catch(() => {
            toast.error("Designation not deleted");
          });
      }
    });
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Topbar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <Card className="shadow-sm rounded-xl">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Designations</span>
              <Button className="btn-indigo" onClick={openCreate}>
                + Create
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {/* Search Bar */}
              {/* <div className="p-3 border-bottom">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search designations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            fetchDesignationList(0, search);
                          }
                        }}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => fetchDesignationList(0, search)}
                      >
                        Search
                      </button>
                      {search && (
                        <button
                          className="btn btn-outline-danger"
                          type="button"
                          onClick={() => {
                            setSearch("");
                            fetchDesignationList(0, "");
                          }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                                     <div className="col-md-6">
                    
                   </div>
                </div>
              </div> */}  {/* Results counter moved to pagination section */}
              
              <Table responsive hover striped className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 100 }}>S/N</th>
                    <th>Designation</th>
                    <th style={{ width: 160 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.designationId}>
                      <td>{index + 1 + page * 10}</td>
                      <td>{item.name}</td>
                      <td>
                        <div className="d-flex gap-2">
                                                     <Button
                             size="sm"
                             variant="outline-primary"
                             onClick={() => openEdit(item)}
                           >
                             Edit
                           </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(item.designationId)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {isLoading && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-4">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Loading designations...
                      </td>
                    </tr>
                  )}
                  {items.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-4">
                        No designations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

                             {/* Pagination */}
               {totalPages > 1 && (
                 <div className="d-flex justify-content-between align-items-center p-3 border-top">
                   <div>
                     <small className="text-muted">
                       Showing {items.length} of {totalPages * 10} designations
                     </small>
                   </div>
                   <div>
                     <Pagination className="mb-0">
                       <Pagination.Prev
                         disabled={page === 0}
                         onClick={() => fetchDesignationList(page - 1, search)}
                       />
                       {[...Array(totalPages).keys()].map((num) => (
                         <Pagination.Item
                           key={num}
                           active={num === page}
                           onClick={() => fetchDesignationList(num, search)}
                         >
                           {num + 1}
                         </Pagination.Item>
                       ))}
                       <Pagination.Next
                         disabled={page === totalPages - 1}
                         onClick={() => fetchDesignationList(page + 1, search)}
                       />
                     </Pagination>
                   </div>
                 </div>
               )}
            </Card.Body>
          </Card>

                     <Modal show={showModal} onHide={closeModal} centered>
             <Modal.Header closeButton={!isLoading}>
               <Modal.Title>
                 {editing ? "Edit Designation" : "Create Designation"}
               </Modal.Title>
             </Modal.Header>
             <Modal.Body>
               <Form>
                 <Form.Group className="mb-3">
                   <Form.Label>Designation Name</Form.Label>
                   <Form.Control
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     placeholder="Enter designation name"
                     autoFocus
                     isInvalid={!!error}
                   />
                   {error && (
                     <Form.Control.Feedback type="invalid">
                       {error}
                     </Form.Control.Feedback>
                   )}
                 </Form.Group>
               </Form>
             </Modal.Body>
             <Modal.Footer>
               <Button variant="secondary" onClick={closeModal} disabled={isLoading}>
                 Cancel
               </Button>
               <Button 
                 className="btn-indigo" 
                 onClick={editing ? handleEdit : saveDesignation}
                 disabled={isLoading}
               >
                 {isLoading ? (
                   <>
                     <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                     {editing ? "Updating..." : "Saving..."}
                   </>
                 ) : (
                   editing ? "Update" : "Save"
                 )}
               </Button>
             </Modal.Footer>
           </Modal>
        </main>
      </div>
    </div>
  );
}
