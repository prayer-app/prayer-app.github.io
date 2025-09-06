import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AddPraiseModal = ({ show, onHide, onAddPraise }) => {
  const [praiseText, setPraiseText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (praiseText.trim()) {
      onAddPraise(praiseText);
      setPraiseText('');
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Praise</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="praiseText">Praise</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              id="praiseText"
              value={praiseText}
              onChange={(e) => setPraiseText(e.target.value)}
              required
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add Praise
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPraiseModal; 