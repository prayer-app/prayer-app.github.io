import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Table } from 'react-bootstrap';
import { formatDate, formatDateForStorage } from '../utils/dateUtils';

const FollowupModal = ({ show, onHide, prayer, onUpdateFollowup }) => {
  const [newFollowupDate, setNewFollowupDate] = useState('');
  const [canAddFollowup, setCanAddFollowup] = useState(false);

  useEffect(() => {
    if (prayer) {
      // Check if all follow-ups are completed
      const allFollowedUp = prayer.followups.every(followup => followup.did_followup);
      setCanAddFollowup(allFollowedUp);
      
      // Set minimum date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setNewFollowupDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [prayer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newFollowupDate && canAddFollowup) {
      const date = new Date(newFollowupDate);
      date.setHours(0, 0, 0, 0);
      const formattedDate = formatDateForStorage(date);
      
      onUpdateFollowup(prayer.id, formattedDate);
      setNewFollowupDate('');
      onHide();
    }
  };

  const handleFollowupStatusClick = (followupDate) => {
    if (prayer) {
      const updatedPrayers = prayer.followups.map(followup => {
        if (followup.followup_at === followupDate) {
          return {
            ...followup,
            did_followup: !followup.did_followup,
            followedup_at: !followup.did_followup ? new Date().toISOString() : null
          };
        }
        return followup;
      });
      
      onUpdateFollowup(prayer.id, null, updatedPrayers);
    }
  };

  if (!prayer) return null;

  const sortedFollowups = [...prayer.followups].sort((a, b) => 
    new Date(b.followup_at) - new Date(a.followup_at)
  );

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Manage Follow-up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h6>Follow-up History</h6>
          <Table size="sm">
            <thead>
              <tr>
                <th>Follow-up On</th>
                <th>Followed-up At</th>
                <th className="text-end">Did Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {sortedFollowups.map((followup, index) => (
                <tr key={index}>
                  <td>{formatDate(followup.followup_at)}</td>
                  <td>{followup.followedup_at ? formatDate(followup.followedup_at) : '-'}</td>
                  <td className="text-end">
                    <Button
                      variant="link"
                      onClick={() => handleFollowupStatusClick(followup.followup_at)}
                      title={followup.did_followup ? 'Mark as not followed up' : 'Mark as followed up'}
                    >
                      <i className={`bi bi-check-circle-fill ${followup.did_followup ? 'text-success' : 'text-secondary'} transition-effect`}></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="newFollowupDate">New Follow-up Date</Form.Label>
            <Form.Control
              type="date"
              id="newFollowupDate"
              value={newFollowupDate}
              onChange={(e) => setNewFollowupDate(e.target.value)}
              disabled={!canAddFollowup}
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Close
            </Button>
            <Button 
              variant={canAddFollowup ? "primary" : "secondary"} 
              type="submit"
              disabled={!canAddFollowup}
            >
              Set Follow-up
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FollowupModal; 