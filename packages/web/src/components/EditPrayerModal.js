import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditPrayerModal = ({ show, onHide, prayer, onEditPrayer }) => {
  const [formData, setFormData] = useState({
    person: '',
    prayer: '',
    followup_at: ''
  });

  useEffect(() => {
    if (prayer) {
      const latestFollowup = prayer.followups[prayer.followups.length - 1];
      const followupDate = latestFollowup ? new Date(latestFollowup.followup_at).toISOString().split('T')[0] : '';
      
      setFormData({
        person: prayer.person,
        prayer: prayer.prayer,
        followup_at: followupDate
      });
    }
  }, [prayer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditPrayer(prayer.id, formData);
    onHide();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!prayer) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Prayer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="editPerson">Person</Form.Label>
            <Form.Control
              type="text"
              id="editPerson"
              name="person"
              value={formData.person}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="editPrayer">Prayer</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              id="editPrayer"
              name="prayer"
              value={formData.prayer}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="editFollowupAt">Follow-up Date</Form.Label>
            <Form.Control
              type="date"
              id="editFollowupAt"
              name="followup_at"
              value={formData.followup_at}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPrayerModal; 