import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AddPrayerModal = ({ show, onHide, onAddPrayer }) => {
  const [formData, setFormData] = useState({
    person: '',
    prayer: '',
    followup_at: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPrayer(formData);
    setFormData({ person: '', prayer: '', followup_at: '' });
    onHide();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Prayer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="person">Person</Form.Label>
            <Form.Control
              type="text"
              id="person"
              name="person"
              value={formData.person}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="prayer">Prayer</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              id="prayer"
              name="prayer"
              value={formData.prayer}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="followup_at">Follow-up Date</Form.Label>
            <Form.Control
              type="date"
              id="followup_at"
              name="followup_at"
              value={formData.followup_at}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add Prayer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPrayerModal; 