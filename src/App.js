import React, { useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import PrayerList from './components/PrayerList';
import PraiseList from './components/PraiseList';
import AddPrayerModal from './components/AddPrayerModal';
import AddPraiseModal from './components/AddPraiseModal';
import SettingsModal from './components/SettingsModal';
import ConfirmationModal from './components/ConfirmationModal';
import PrayerDetailsModal from './components/PrayerDetailsModal';
import BuildInfo from './components/BuildInfo';
import { 
  initializeStorage, 
  getPrayers, 
  savePrayers, 
  getPraises, 
  savePraises, 
  resetDatabase, 
  exportData 
} from './utils/storage';
import { generateUUID, formatDateForStorage } from './utils/dateUtils';
import notificationService from './utils/notifications';

function App() {
  // State management
  const [activeTab, setActiveTab] = useState('prayer');
  const [prayers, setPrayers] = useState([]);
  const [praises, setPraises] = useState([]);
  
  // Modal states
  const [showAddPrayerModal, setShowAddPrayerModal] = useState(false);
  const [showAddPraiseModal, setShowAddPraiseModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPrayerDetailsModal, setShowPrayerDetailsModal] = useState(false);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  
  // Selected items for modals
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [prayerToRemove, setPrayerToRemove] = useState(null);

  // Initialize app
  useEffect(() => {
    initializeStorage();
    setPrayers(getPrayers());
    setPraises(getPraises());
  }, []);

  // Initialize notifications and schedule reminders
  useEffect(() => {
    // Schedule daily reminders
    if (notificationService.isEnabled()) {
      notificationService.scheduleDailyReminders();
    }
  }, []);

  // Schedule follow-up reminders when prayers change
  useEffect(() => {
    if (notificationService.isEnabled() && prayers.length > 0) {
      notificationService.scheduleFollowupReminders(prayers);
    }
  }, [prayers]);

  // Prayer handlers - optimized with useCallback
  const handleAddPrayer = useCallback((formData) => {
    const prayer = {
      id: generateUUID(),
      person: formData.person,
      prayer: formData.prayer,
      followups: [],
      is_answered: false,
      is_removed: false,
      is_archived: false
    };

    // Only add follow-up if a date is provided
    if (formData.followup_at) {
      const date = new Date(formData.followup_at);
      date.setHours(0, 0, 0, 0);
      prayer.followups.push({
        followup_at: formatDateForStorage(date),
        followedup_at: null,
        did_followup: false
      });
    }

    const updatedPrayers = [...prayers, prayer];
    setPrayers(updatedPrayers);
    savePrayers(updatedPrayers);
  }, [prayers]);

  const handlePrayerAnswered = useCallback((prayerId) => {
    const updatedPrayers = prayers.map(prayer => 
      prayer.id === prayerId 
        ? { ...prayer, is_answered: !prayer.is_answered }
        : prayer
    );
    setPrayers(updatedPrayers);
    savePrayers(updatedPrayers);
  }, [prayers]);

  const handlePrayerArchive = useCallback((prayerId) => {
    const updatedPrayers = prayers.map(prayer => 
      prayer.id === prayerId 
        ? { ...prayer, is_archived: !prayer.is_archived }
        : prayer
    );
    setPrayers(updatedPrayers);
    savePrayers(updatedPrayers);
  }, [prayers]);

  const handlePrayerRemove = useCallback((prayerId) => {
    setPrayerToRemove(prayerId);
    setShowRemoveConfirmModal(true);
  }, []);

  const confirmRemovePrayer = useCallback(() => {
    if (prayerToRemove) {
      const updatedPrayers = prayers.map(prayer => 
        prayer.id === prayerToRemove 
          ? { ...prayer, is_removed: true }
          : prayer
      );
      setPrayers(updatedPrayers);
      savePrayers(updatedPrayers);
      setPrayerToRemove(null);
    }
    setShowRemoveConfirmModal(false);
  }, [prayerToRemove, prayers]);

  const handleEditPrayer = useCallback((prayerId, formData) => {
    const updatedPrayers = prayers.map(prayer => {
      if (prayer.id === prayerId) {
        const updatedPrayer = {
          ...prayer,
          person: formData.person,
          prayer: formData.prayer
        };

        // Handle is_answered field if provided
        if ('is_answered' in formData) {
          updatedPrayer.is_answered = formData.is_answered;
        }

        // Only add follow-up if a date is provided
        if (formData.followup_at) {
          const date = new Date(formData.followup_at);
          date.setHours(0, 0, 0, 0);
          updatedPrayer.followups.push({
            followup_at: formatDateForStorage(date),
            followedup_at: null,
            did_followup: false
          });
        }

        return updatedPrayer;
      }
      return prayer;
    });
    
    setPrayers(updatedPrayers);
    savePrayers(updatedPrayers);
  }, [prayers]);

  const handleUpdateFollowup = useCallback((prayerId, newFollowupDate, updatedFollowups) => {
    const updatedPrayers = prayers.map(prayer => {
      if (prayer.id === prayerId) {
        const updatedPrayer = { ...prayer };
        
        if (updatedFollowups) {
          updatedPrayer.followups = updatedFollowups;
        }
        
        if (newFollowupDate) {
          updatedPrayer.followups.push({
            followup_at: newFollowupDate,
            followedup_at: null,
            did_followup: false
          });
        }
        
        return updatedPrayer;
      }
      return prayer;
    });
    
    setPrayers(updatedPrayers);
    savePrayers(updatedPrayers);
  }, [prayers]);

  const handlePrayerClick = useCallback((prayer) => {
    setSelectedPrayer(prayer);
    setShowPrayerDetailsModal(true);
  }, []);

  // Praise handlers - optimized with useCallback
  const handleAddPraise = useCallback((praiseText) => {
    const praise = {
      id: Date.now(),
      text: praiseText,
      date: new Date().toISOString(),
      is_archived: false
    };

    const updatedPraises = [...praises, praise];
    setPraises(updatedPraises);
    savePraises(updatedPraises);
  }, [praises]);

  const handlePraiseArchive = useCallback((praiseId) => {
    const updatedPraises = praises.map(praise => 
      (praise.id === praiseId || praise.praised_at === praiseId)
        ? { ...praise, is_archived: !praise.is_archived }
        : praise
    );
    setPraises(updatedPraises);
    savePraises(updatedPraises);
  }, [praises]);

  const handlePraiseRemove = useCallback((praiseId) => {
    const updatedPraises = praises.filter(praise => 
      praise.id !== praiseId && praise.praised_at !== praiseId
    );
    setPraises(updatedPraises);
    savePraises(updatedPraises);
  }, [praises]);

  const handleEditPraise = useCallback((praiseId, formData) => {
    const updatedPraises = praises.map(praise => {
      if (praise.id === praiseId || praise.praised_at === praiseId) {
        return {
          ...praise,
          text: formData.praise,
          praise: formData.praise
        };
      }
      return praise;
    });
    setPraises(updatedPraises);
    savePraises(updatedPraises);
  }, [praises]);

  // Settings handlers - optimized with useCallback
  const handleExportData = useCallback(() => {
    exportData();
    setShowSettingsModal(false);
  }, []);

  const handleResetDatabase = useCallback(() => {
    setShowResetConfirmModal(true);
  }, []);

  const confirmResetDatabase = useCallback(() => {
    resetDatabase();
    setPrayers([]);
    setPraises([]);
    setShowResetConfirmModal(false);
    setShowSettingsModal(false);
  }, []);

  return (
    <div className="App">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onSettingsClick={() => setShowSettingsModal(true)} 
      />
      
      <div className="tab-content">
        {activeTab === 'prayer' && (
          <div className="tab-pane fade show active pt-4">
            <PrayerList 
              prayers={prayers}
              onPrayerAnswered={handlePrayerAnswered}
              onPrayerArchive={handlePrayerArchive}
              onPrayerRemove={handlePrayerRemove}
              onPrayerClick={handlePrayerClick}
            />
            <button 
              className="fab" 
              onClick={() => setShowAddPrayerModal(true)}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Add Prayer</span>
            </button>
          </div>
        )}
        
        {activeTab === 'praise' && (
          <div className="tab-pane fade show active pt-4">
            <PraiseList 
              praises={praises}
              onPraiseArchive={handlePraiseArchive}
              onPraiseRemove={handlePraiseRemove}
              onEditPraise={handleEditPraise}
            />
            <button 
              className="fab" 
              onClick={() => setShowAddPraiseModal(true)}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Add Praise</span>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPrayerModal 
        show={showAddPrayerModal}
        onHide={() => setShowAddPrayerModal(false)}
        onAddPrayer={handleAddPrayer}
      />
      
      <AddPraiseModal 
        show={showAddPraiseModal}
        onHide={() => setShowAddPraiseModal(false)}
        onAddPraise={handleAddPraise}
      />
      
      <SettingsModal 
        show={showSettingsModal}
        onHide={() => setShowSettingsModal(false)}
        onExportData={handleExportData}
        onResetDatabase={handleResetDatabase}
      />
      
      <PrayerDetailsModal 
        show={showPrayerDetailsModal}
        onHide={() => setShowPrayerDetailsModal(false)}
        prayer={selectedPrayer}
        onEditPrayer={handleEditPrayer}
        onUpdateFollowup={handleUpdateFollowup}
      />
      
      <ConfirmationModal 
        show={showRemoveConfirmModal}
        onHide={() => setShowRemoveConfirmModal(false)}
        title="Confirm Removal"
        message="Are you sure you want to remove this prayer? This action cannot be undone."
        confirmText="Remove"
        onConfirm={confirmRemovePrayer}
      />
      
      <ConfirmationModal 
        show={showResetConfirmModal}
        onHide={() => setShowResetConfirmModal(false)}
        title="Confirm Reset"
        message="Warning: This will permanently delete all prayers and praises. This action cannot be undone."
        confirmText="Reset Database"
        onConfirm={confirmResetDatabase}
      />

      <BuildInfo />
    </div>
  );
}

export default App; 