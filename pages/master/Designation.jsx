import React, { useMemo, useState } from 'react';
import { Card, Button, Table, Modal, Form } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/TopBar';

export default function Designations(){
  const [items, setItems] = useState([
    { id: 1, name: 'Sales Executive' },
    { id: 2, name: 'Senior Sales Executive' },
    { id: 3, name: 'Operations Manager' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');

  const nextId = useMemo(() => Math.max(0, ...items.map(i => i.id)) + 1, [items]);

  const openCreate = () => { setEditing(null); setName(''); setShowModal(true); };
  const openEdit = (item) => { setEditing(item); setName(item.name); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const saveItem = () => {
    if (!name.trim()) return;
    if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? { ...i, name: name.trim() } : i));
    } else {
      setItems(prev => [...prev, { id: nextId, name: name.trim() }]);
    }
    setShowModal(false);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
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
              <Button className="btn-indigo" onClick={openCreate}>+ Create</Button>
            </Card.Header>
            <Card.Body className="p-0">
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
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button size="sm" variant="outline-primary" onClick={() => openEdit(item)}>Edit</Button>
                          <Button size="sm" variant="outline-danger" onClick={() => removeItem(item.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-4">No designations found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Modal show={showModal} onHide={closeModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>{editing ? 'Edit Designation' : 'Create Designation'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={(e)=>{ e.preventDefault(); saveItem(); }}>
                <Form.Group className="mb-3">
                  <Form.Label>Designation Name</Form.Label>
                  <Form.Control
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    placeholder="Enter designation name"
                    autoFocus
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button className="btn-indigo" onClick={saveItem}>Save</Button>
            </Modal.Footer>
          </Modal>
        </main>
      </div>
    </div>
  );
}


