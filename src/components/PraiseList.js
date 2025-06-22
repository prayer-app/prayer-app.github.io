import React, { useState, useCallback, useMemo } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { formatDate } from '../utils/dateUtils';
import PraiseDetailsModal from './PraiseDetailsModal';

const PraiseList = React.memo(({ praises, onPraiseArchive, onPraiseRemove, onEditPraise }) => {
  const [selectedPraise, setSelectedPraise] = useState(null);
  const [showPraiseModal, setShowPraiseModal] = useState(false);

  // Memoize filtered praises to prevent unnecessary recalculations
  const { activePraises, archivedPraises } = useMemo(() => {
    const active = praises.filter(praise => !praise.is_archived);
    const archived = praises.filter(praise => praise.is_archived);
    return { activePraises: active, archivedPraises: archived };
  }, [praises]);

  const handleRowClick = useCallback((praise) => {
    setSelectedPraise(praise);
    setShowPraiseModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowPraiseModal(false);
    setSelectedPraise(null);
  }, []);

  const handleArchiveClick = useCallback((praiseId, e) => {
    e.stopPropagation();
    onPraiseArchive(praiseId);
  }, [onPraiseArchive]);

  const handleRemoveClick = useCallback((praiseId, e) => {
    e.stopPropagation();
    onPraiseRemove(praiseId);
  }, [onPraiseRemove]);

  // Memoized praise row component
  const PraiseRow = useCallback(({ praise }) => {
    const praiseId = praise.id || praise.praised_at;
    const praiseText = praise.praise || praise.text;
    const praiseDate = praise.praised_at || praise.date;
    
    return (
      <tr 
        key={praiseId} 
        onClick={() => handleRowClick(praise)}
        style={{ cursor: 'pointer' }}
        className="praise-row"
      >
        <td data-label="Praise">
          <div className="fw-medium">{praiseText}</div>
        </td>
        <td data-label="Praised On">
          <div className="text-muted d-flex align-items-center">
            <i className="bi bi-clock me-2"></i>
            {formatDate(praiseDate)}
          </div>
        </td>
        <td className="text-end" data-label="Actions">
          <div className="btn-group" role="group" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="link"
              className="praise-archive"
              onClick={(e) => handleArchiveClick(praiseId, e)}
              title={praise.is_archived ? "Unarchive praise" : "Archive praise"}
            >
              <i className={`bi bi-archive-fill ${praise.is_archived ? 'text-warning' : 'text-secondary'}`}></i>
            </Button>
            <Button
              variant="link"
              className="praise-remove"
              onClick={(e) => handleRemoveClick(praiseId, e)}
              title="Remove praise"
            >
              <i className="bi bi-x-circle-fill text-secondary"></i>
            </Button>
          </div>
        </td>
      </tr>
    );
  }, [handleRowClick, handleArchiveClick, handleRemoveClick]);

  const EmptyState = ({ icon, title, message }) => (
    <div className="empty-state">
      <i className={`bi ${icon}`}></i>
      <h6 className="fw-medium">{title}</h6>
      <p className="text-muted mb-0">{message}</p>
    </div>
  );

  return (
    <div className="container-fluid">
      {/* Active Praises */}
      <Card>
        <Card.Body>
          <div className="section-header">
            <h5 className="section-title">Active Praises</h5>
            <span className="badge bg-info">{activePraises.length}</span>
          </div>
          <div className="table-responsive">
            <Table>
              <thead>
                <tr>
                  <th>Praise</th>
                  <th>Praised On</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activePraises.length > 0 ? (
                  activePraises.map(praise => <PraiseRow key={praise.id || praise.praised_at} praise={praise} />)
                ) : (
                  <tr>
                    <td colSpan="3">
                      <EmptyState 
                        icon="bi-emoji-smile" 
                        title="No praises yet" 
                        message="Add your first praise to get started"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Archived Praises */}
      {archivedPraises.length > 0 && (
        <Card>
          <Card.Body>
            <div className="section-header">
              <h5 className="section-title">Archived Praises</h5>
              <span className="badge bg-warning">{archivedPraises.length}</span>
            </div>
            <div className="table-responsive">
              <Table>
                <thead>
                  <tr>
                    <th>Praise</th>
                    <th>Praised On</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedPraises.map(praise => <PraiseRow key={praise.id || praise.praised_at} praise={praise} />)}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {selectedPraise && (
        <PraiseDetailsModal
          show={showPraiseModal}
          onHide={handleCloseModal}
          praise={selectedPraise}
          onEditPraise={onEditPraise}
        />
      )}
    </div>
  );
});

PraiseList.displayName = 'PraiseList';

export default PraiseList; 