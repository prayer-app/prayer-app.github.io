import React, { useState, useCallback, useMemo } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { formatDate } from '../utils/dateUtils';

const PrayerList = React.memo(({ 
  prayers, 
  onPrayerAnswered, 
  onPrayerArchive, 
  onPrayerRemove, 
  onPrayerClick 
}) => {
  const [clickedStars, setClickedStars] = useState(new Set());

  // Memoize filtered prayers to prevent unnecessary recalculations
  const { activePrayers, answeredPrayers, archivedPrayers } = useMemo(() => {
    const active = prayers.filter(prayer => !prayer.is_removed && !prayer.is_answered && !prayer.is_archived);
    const answered = prayers.filter(prayer => !prayer.is_removed && prayer.is_answered && !prayer.is_archived);
    const archived = prayers.filter(prayer => !prayer.is_removed && prayer.is_archived);
    return { activePrayers: active, answeredPrayers: answered, archivedPrayers: archived };
  }, [prayers]);

  const handleStarClick = useCallback((prayerId, e) => {
    e.stopPropagation();
    
    // Add clicked class for animation
    setClickedStars(prev => new Set(prev).add(prayerId));
    
    // Remove clicked class after animation completes
    setTimeout(() => {
      setClickedStars(prev => {
        const newSet = new Set(prev);
        newSet.delete(prayerId);
        return newSet;
      });
    }, 600);
    
    // Call the original handler
    onPrayerAnswered(prayerId);
  }, [onPrayerAnswered]);

  const handleArchiveClick = useCallback((prayerId, e) => {
    e.stopPropagation();
    onPrayerArchive(prayerId);
  }, [onPrayerArchive]);

  const handleRemoveClick = useCallback((prayerId, e) => {
    e.stopPropagation();
    onPrayerRemove(prayerId);
  }, [onPrayerRemove]);

  const handleRowClick = useCallback((prayer) => {
    onPrayerClick(prayer);
  }, [onPrayerClick]);

  // Memoized prayer row component to reduce duplication
  const PrayerRow = useCallback(({ prayer, isAnswered = false, isArchived = false }) => {
    const latestFollowup = prayer.followups[prayer.followups.length - 1];
    const isStarClicked = clickedStars.has(prayer.id);
    
    return (
      <tr 
        key={prayer.id} 
        className="prayer-row" 
        onClick={() => handleRowClick(prayer)}
      >
        <td data-label={`Prayer for ${prayer.person}`}>
          <div className="fw-medium">
            {prayer.prayer.length > 50 ? `${prayer.prayer.substring(0, 50)}...` : prayer.prayer}
          </div>
        </td>
        <td data-label="Followup next">
          <div className="text-muted">
            <i className="bi bi-clock me-1"></i>
            {latestFollowup ? formatDate(latestFollowup.followup_at) : 'No follow-up'}
          </div>
        </td>
        <td data-label="Last followup">
          <div className="text-muted">
            <i className="bi bi-clock me-1"></i>
            {latestFollowup?.followedup_at ? formatDate(latestFollowup.followedup_at) : ''}
          </div>
        </td>
        <td className="text-end" data-label="">
          <div className="btn-group" role="group">
            {!isArchived && (
              <Button
                variant="link"
                className="prayer-answered"
                onClick={(e) => handleStarClick(prayer.id, e)}
                title={isAnswered ? "Mark as unanswered" : "Mark as answered"}
              >
                <i className={`bi bi-star-fill ${isAnswered ? 'text-warning' : 'text-secondary'} ${isStarClicked ? 'clicked' : ''}`}></i>
              </Button>
            )}
            <Button
              variant="link"
              className="prayer-archive"
              onClick={(e) => handleArchiveClick(prayer.id, e)}
              title={isArchived ? "Unarchive prayer" : "Archive prayer"}
            >
              <i className={`bi bi-archive-fill ${isArchived ? 'text-warning' : 'text-secondary'}`}></i>
            </Button>
            <Button
              variant="link"
              className="prayer-remove"
              onClick={(e) => handleRemoveClick(prayer.id, e)}
              title="Remove prayer"
            >
              <i className="bi bi-x-circle-fill text-secondary"></i>
            </Button>
          </div>
        </td>
      </tr>
    );
  }, [clickedStars, handleStarClick, handleArchiveClick, handleRemoveClick, handleRowClick]);

  const EmptyState = ({ icon, title, message }) => (
    <div className="empty-state">
      <i className={`bi ${icon}`}></i>
      <h6 className="fw-medium">{title}</h6>
      <p className="text-muted mb-0">{message}</p>
    </div>
  );

  return (
    <div className="container-fluid">
      {/* Active Prayers */}
      <Card>
        <Card.Body>
          <div className="section-header">
            <h5 className="section-title">Active Prayers</h5>
            <span className="badge bg-info">{activePrayers.length}</span>
          </div>
          <div className="table-responsive">
            <Table>
              <thead>
                <tr>
                  <th>Prayer</th>
                  <th>Followup next</th>
                  <th>Last followup</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activePrayers.length > 0 ? (
                  activePrayers.map(prayer => <PrayerRow key={prayer.id} prayer={prayer} />)
                ) : (
                  <tr>
                    <td colSpan="4">
                      <EmptyState 
                        icon="bi-heart" 
                        title="No active prayers" 
                        message="Add your first prayer to get started"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Answered Prayers */}
      {answeredPrayers.length > 0 && (
        <Card>
          <Card.Body>
            <div className="section-header">
              <h5 className="section-title">Answered Prayers</h5>
              <span className="badge bg-success">{answeredPrayers.length}</span>
            </div>
            <div className="table-responsive">
              <Table>
                <thead>
                  <tr>
                    <th>Prayer</th>
                    <th>Followup next</th>
                    <th>Last followup</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {answeredPrayers.map(prayer => <PrayerRow key={prayer.id} prayer={prayer} isAnswered={true} />)}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Archived Prayers */}
      {archivedPrayers.length > 0 && (
        <Card>
          <Card.Body>
            <div className="section-header">
              <h5 className="section-title">Archived Prayers</h5>
              <span className="badge bg-warning">{archivedPrayers.length}</span>
            </div>
            <div className="table-responsive">
              <Table>
                <thead>
                  <tr>
                    <th>Prayer</th>
                    <th>Followup next</th>
                    <th>Last followup</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedPrayers.map(prayer => <PrayerRow key={prayer.id} prayer={prayer} isArchived={true} />)}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
});

PrayerList.displayName = 'PrayerList';

export default PrayerList; 