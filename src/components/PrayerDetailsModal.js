import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Badge, Form } from 'react-bootstrap';
import { formatDate } from '../utils/dateUtils';

function useDebouncedCallback(callback, delay, deps) {
  const handler = useRef();
  useEffect(() => {
    if (handler.current) clearTimeout(handler.current);
    handler.current = setTimeout(callback, delay);
    return () => clearTimeout(handler.current);
    // eslint-disable-next-line
  }, deps);
}

const PrayerDetailsModal = ({ show, onHide, prayer, onEditPrayer, onUpdateFollowup }) => {
  const [editForm, setEditForm] = useState({ person: '', prayer: '', newFollowupDate: '' });
  const [localFollowups, setLocalFollowups] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [localIsAnswered, setLocalIsAnswered] = useState(false);

  useEffect(() => {
    if (prayer) {
      setEditForm({ person: prayer.person, prayer: prayer.prayer, newFollowupDate: '' });
      setLocalFollowups(prayer.followups || []);
      setLocalIsAnswered(prayer.is_answered || false);
      
      // Check if we should show the schedule form
      const latestFollowup = prayer.followups[prayer.followups.length - 1];
      setShowScheduleForm(latestFollowup && latestFollowup.did_followup);
    }
  }, [prayer]);

  // Debounced auto-save for person and prayer fields
  useDebouncedCallback(() => {
    if (!prayer) return;
    if (
      editForm.person.trim() !== prayer.person ||
      editForm.prayer.trim() !== prayer.prayer
    ) {
      onEditPrayer(prayer.id, {
        person: editForm.person.trim(),
        prayer: editForm.prayer.trim(),
        followup_at: null
      });
    }
  }, 600, [editForm.person, editForm.prayer]);

  if (!prayer) return null;

  const latestFollowup = localFollowups[localFollowups.length - 1];
  const allFollowups = localFollowups || [];
  
  // Find the most recent completed follow-up for the "Last followup" display
  const getLastCompletedFollowup = () => {
    for (let i = allFollowups.length - 1; i >= 0; i--) {
      if (allFollowups[i].did_followup && allFollowups[i].followedup_at) {
        return allFollowups[i];
      }
    }
    return null;
  };
  
  const lastCompletedFollowup = getLastCompletedFollowup();

  const handleBlur = (field) => {
    if (!prayer) return;
    if (editForm[field].trim() !== prayer[field]) {
      onEditPrayer(prayer.id, {
        person: editForm.person.trim(),
        prayer: editForm.prayer.trim(),
        followup_at: null
      });
    }
  };

  const handleFollowupToggle = (followupIndex) => {
    const updatedFollowups = [...allFollowups];
    const currentFollowup = updatedFollowups[followupIndex];
    const isLatestFollowup = followupIndex === updatedFollowups.length - 1;
    const isCompleting = !currentFollowup.did_followup;
    
    // Only allow unchecking the latest follow-up
    if (!isCompleting && !isLatestFollowup) {
      return; // Prevent unchecking previous follow-ups
    }
    
    if (isCompleting) {
      // Marking as completed - set current timestamp in local timezone
      const now = new Date();
      const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
      const localISOString = localDate.toISOString();
      
      updatedFollowups[followupIndex] = {
        ...currentFollowup,
        did_followup: true,
        followedup_at: localISOString
      };
    } else {
      // Unchecking the latest follow-up - find the previous completed follow-up date or set to null
      let previousFollowupDate = null;
      for (let i = followupIndex - 1; i >= 0; i--) {
        if (updatedFollowups[i].did_followup && updatedFollowups[i].followedup_at) {
          previousFollowupDate = updatedFollowups[i].followedup_at;
          break;
        }
      }
      
      updatedFollowups[followupIndex] = {
        ...currentFollowup,
        did_followup: false,
        followedup_at: previousFollowupDate
      };
    }
    
    // Update local state immediately for instant visual feedback
    setLocalFollowups(updatedFollowups);
    
    // Show schedule form if this was the latest follow-up and it was just completed
    if (isLatestFollowup && updatedFollowups[followupIndex].did_followup) {
      setShowScheduleForm(true);
    } else if (isLatestFollowup && !updatedFollowups[followupIndex].did_followup) {
      setShowScheduleForm(false);
    }
    
    // Call parent update function
    onUpdateFollowup(prayer.id, null, updatedFollowups);
  };

  const handleAddNewFollowup = () => {
    if (!editForm.newFollowupDate) return;
    
    // Create a proper date object from the input value in local timezone
    const [year, month, day] = editForm.newFollowupDate.split('-').map(Number);
    const localDate = new Date(year, month - 1, day, 12, 0, 0); // month is 0-indexed
    const formattedDate = localDate.toISOString();
    
    const newFollowup = {
      followup_at: formattedDate,
      did_followup: false,
      followedup_at: null
    };
    
    const updatedFollowups = [...allFollowups, newFollowup];
    
    // Update local state immediately for instant visual feedback
    setLocalFollowups(updatedFollowups);
    
    // Call parent update function
    onUpdateFollowup(prayer.id, null, updatedFollowups);
    setEditForm({ ...editForm, newFollowupDate: '' });
  };

  const handleToggleAnswered = () => {
    // Update local state immediately for instant visual feedback
    setLocalIsAnswered(!localIsAnswered);
    
    onEditPrayer(prayer.id, {
      person: prayer.person,
      prayer: prayer.prayer,
      is_answered: !localIsAnswered
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="prayer-details-modal">
      <Modal.Header closeButton className="border-bottom d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Modal.Title className="d-flex align-items-center">
            <i className="bi bi-heart-fill text-danger me-2"></i>
            Prayer Details
          </Modal.Title>
        </div>
        <div className="d-flex align-items-center ms-5">
          {prayer.is_archived ? (
            <Badge bg="warning" className="bg-warning">Archived</Badge>
          ) : (
            <Badge 
              bg={localIsAnswered ? 'success' : 'info'} 
              className="me-2"
            >
              {localIsAnswered ? 'Answered' : 'Active'}
            </Badge>
          )}
        </div>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* Prayer Information */}
        <div className="mb-4">
          <div className="mb-3">
            <h6 className="text-muted text-uppercase small mb-1">Prayer for</h6>
            <Form.Control
              type="text"
              value={editForm.person}
              onChange={e => setEditForm({ ...editForm, person: e.target.value })}
              onBlur={() => handleBlur('person')}
              className="mb-2"
              disabled={prayer.is_archived}
            />
          </div>
          <div className="mb-3">
            <h6 className="text-muted text-uppercase small mb-2">Prayer Request</h6>
            <Form.Control
              as="textarea"
              rows={3}
              value={editForm.prayer}
              onChange={e => setEditForm({ ...editForm, prayer: e.target.value })}
              onBlur={() => handleBlur('prayer')}
              className="bg-light"
              disabled={prayer.is_archived}
            />
          </div>
        </div>

        {/* Follow-up Information */}
        <div className="mb-4">
          <h6 className="text-muted text-uppercase small mb-3">Follow-up Information</h6>
          {latestFollowup ? (
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-start">
                  <i className="bi bi-calendar-event text-primary me-2"></i>
                  <div>
                    <small className="text-muted d-block">Next Follow-up</small>
                    <span className="fw-medium">{formatDate(latestFollowup.followup_at)}</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-start">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <div>
                    <small className="text-muted d-block">Last followup</small>
                    <span className="fw-medium">
                      {lastCompletedFollowup ? formatDate(lastCompletedFollowup.followedup_at) : 'Not yet'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <i className="bi bi-calendar-x text-muted mb-2" style={{fontSize: '2rem'}}></i>
              <p className="text-muted mb-0">No follow-up scheduled</p>
            </div>
          )}
        </div>

        {/* Follow-up History */}
        {allFollowups.length > 0 && (
          <div className="mb-4">
            <h6 className="text-muted text-uppercase small mb-3">Follow-up History</h6>
            <div className="bg-light rounded p-3">
              {allFollowups.map((followup, index) => {
                const isFutureDate = new Date(followup.followup_at) > new Date();
                const isCompleted = followup.did_followup;
                
                return (
                  <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-link p-0 me-2"
                        onClick={() => handleFollowupToggle(index)}
                        title={
                          isCompleted 
                            ? (index === allFollowups.length - 1 
                                ? 'Mark as not followed up' 
                                : 'Cannot uncheck previous follow-ups')
                            : isFutureDate 
                              ? 'Click to mark as followed up (can follow up early)' 
                              : 'Click to mark as followed up'
                        }
                        style={{
                          transition: 'none !important',
                          transform: 'none !important'
                        }}
                        disabled={prayer.is_archived}
                      >
                        <i className={`bi ${isCompleted ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'}`}></i>
                      </button>
                      <span className={`fw-medium ${isFutureDate && !isCompleted ? 'text-muted' : ''}`}>
                        {formatDate(followup.followup_at)}
                      </span>
                    </div>
                    <div className="text-end">
                      {followup.followedup_at && (
                        <small className="text-muted">
                          Followed up: {formatDate(followup.followedup_at)}
                        </small>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Schedule Next Follow-up */}
        {showScheduleForm && (
          <div className="mb-4 schedule-form-animate">
            <h6 className="text-muted text-uppercase small mb-3">Schedule Next Follow-up</h6>
            <div className="bg-light rounded p-3">
              <div className="d-flex align-items-end gap-2">
                <div className="flex-grow-1">
                  <Form.Control
                    type="date"
                    value={editForm.newFollowupDate}
                    onChange={e => setEditForm({ ...editForm, newFollowupDate: e.target.value })}
                    className="border-0 bg-white"
                    placeholder="Select date"
                    min={new Date().toISOString().split('T')[0]}
                    disabled={prayer.is_archived}
                  />
                </div>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleAddNewFollowup}
                  disabled={!editForm.newFollowupDate || prayer.is_archived}
                  className="d-flex align-items-center gap-1 px-3"
                  style={{ minWidth: 'fit-content' }}
                >
                  <i className="bi bi-plus-circle-fill"></i>
                  <span>Add</span>
                </Button>
              </div>
              <small className="text-muted mt-2 d-block">
                Schedule your next follow-up to continue tracking this prayer request.
              </small>
            </div>
          </div>
        )}

        {/* Prayer Statistics */}
        <div className="bg-light rounded p-3">
          <h6 className="text-muted text-uppercase small mb-3">Statistics</h6>
          <div className="row text-center">
            <div className="col-4">
              <div className="text-primary" style={{fontSize: '25px'}}>{allFollowups.length}</div>
              <small className="text-muted" style={{fontSize: '16px'}}>Total Follow-ups</small>
            </div>
            <div className="col-4">
              <div className="text-success" style={{fontSize: '25px'}}>
                {allFollowups.filter(f => f.did_followup).length}
              </div>
              <small className="text-muted" style={{fontSize: '16px'}}>Completed</small>
            </div>
            <div className="col-4">
              <div className="d-flex flex-column align-items-center align-items-start">
                <button
                  className="btn btn-link p-0"
                  onClick={handleToggleAnswered}
                  title={localIsAnswered ? 'Mark as not answered' : 'Mark as answered'}
                  style={{
                    transition: 'none !important',
                    transform: 'none !important'
                  }}
                >
                  <i className={`bi bi-star-fill ${localIsAnswered ? 'text-warning' : 'text-dark'}`} style={{fontSize: '1.5rem'}}></i>
                </button>
                <div className="mt-1">Answered</div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PrayerDetailsModal;