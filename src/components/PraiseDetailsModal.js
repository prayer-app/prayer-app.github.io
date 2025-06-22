import React, { useState, useEffect } from 'react';
import { Modal, Badge, Form, Spinner } from 'react-bootstrap';
import { formatDate } from '../utils/dateUtils';

const PraiseDetailsModal = ({ show, onHide, praise, onEditPraise }) => {
  const [editForm, setEditForm] = useState({ praise: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (praise) {
      setEditForm({ praise: praise.praise || praise.text || '' });
    }
  }, [praise]);

  const handleBlur = () => {
    if (!praise) return;
    if (editForm.praise.trim() !== (praise.praise || praise.text)) {
      setSaving(true);
      onEditPraise(praise.id || praise.praised_at, {
        praise: editForm.praise.trim()
      });
      setTimeout(() => setSaving(false), 500);
    }
  };

  if (!praise) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-bottom d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Modal.Title className="d-flex align-items-center">
            <i className="bi bi-pray text-warning me-2"></i>
            Praise Details
          </Modal.Title>
          {saving && (
            <span className="text-info d-flex align-items-center ms-3">
              <Spinner animation="border" size="sm" className="me-2" /> Saving...
            </span>
          )}
        </div>
        <div className="d-flex align-items-center ms-5">
          <Badge 
            bg={praise.is_archived ? 'warning' : 'info'} 
            className="me-2"
          >
            {praise.is_archived ? 'Archived' : 'Active'}
          </Badge>
        </div>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* Praise Information */}
        <div className="mb-4">
          <div className="mb-3">
            <h6 className="text-muted text-uppercase small mb-2">Praise</h6>
            <Form.Control
              as="textarea"
              rows={4}
              value={editForm.praise}
              onChange={e => setEditForm({ ...editForm, praise: e.target.value })}
              onBlur={handleBlur}
              className="bg-light"
              placeholder="Enter your praise..."
              disabled={praise.is_archived}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="d-flex align-items-start">
            <i className="bi bi-calendar text-primary me-2"></i>
            <div>
              <small className="text-muted d-block">Praised On</small>
              <span className="fw-medium">{formatDate(praise.praised_at || praise.date)}</span>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PraiseDetailsModal; 