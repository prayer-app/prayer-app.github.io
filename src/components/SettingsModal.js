import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Badge } from 'react-bootstrap';
import notificationService from '../utils/notifications';

const SettingsModal = ({ show, onHide, onExportData, onResetDatabase }) => {
  const [settings, setSettings] = useState(notificationService.getSettings());
  const [permissionStatus, setPermissionStatus] = useState(notificationService.permission);
  const [isSupported] = useState(notificationService.isSupported);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (show) {
      setSettings(notificationService.getSettings());
      setPermissionStatus(notificationService.permission);
    }
  }, [show]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    notificationService.updateSettings(newSettings);
  };

  const handlePermissionRequest = async () => {
    try {
      const permission = await notificationService.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        handleSettingChange('enabled', true);
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const handleTestNotification = async () => {
    setTestResult(null);
    try {
      const success = await notificationService.testNotification();
      setTestResult(success ? 'success' : 'error');
    } catch (error) {
      setTestResult('error');
    }
  };

  const getPermissionStatusBadge = () => {
    switch (permissionStatus) {
      case 'granted':
        return <Badge bg="success">Granted</Badge>;
      case 'denied':
        return <Badge bg="danger">Denied</Badge>;
      case 'default':
        return <Badge bg="warning">Not Set</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-gear-fill me-2"></i>
          Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-grid gap-4">
          
          {/* Notification Settings */}
          <div>
            <h6 className="text-muted text-uppercase small mb-3">
              <i className="bi bi-bell me-2"></i>
              Notifications
            </h6>
            
            {!isSupported && (
              <Alert variant="warning" className="mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Notifications are not supported in this browser.
              </Alert>
            )}

            {isSupported && permissionStatus !== 'granted' && (
              <Alert variant="info" className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Browser Permission:</strong> {getPermissionStatusBadge()}
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={handlePermissionRequest}
                    disabled={permissionStatus === 'denied'}
                  >
                    Request Permission
                  </Button>
                </div>
              </Alert>
            )}

            <div className="row g-3">
              <div className="col-12">
                <Form.Check
                  type="switch"
                  id="notifications-enabled"
                  label="Enable Notifications"
                  checked={settings.enabled}
                  onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                  disabled={!isSupported || permissionStatus !== 'granted'}
                />
              </div>

              {settings.enabled && (
                <>
                  <div className="col-12">
                    <Form.Check
                      type="switch"
                      id="followup-reminders"
                      label="Follow-up Reminders"
                      checked={settings.followupReminders}
                      onChange={(e) => handleSettingChange('followupReminders', e.target.checked)}
                    />
                    <small className="text-muted">Get reminded when it&apos;s time to follow up on prayers</small>
                  </div>

                  <div className="col-12">
                    <Form.Check
                      type="switch"
                      id="daily-reminders"
                      label="Daily Reminders"
                      checked={settings.dailyReminders}
                      onChange={(e) => handleSettingChange('dailyReminders', e.target.checked)}
                    />
                    <small className="text-muted">Daily reminder to pray and give thanks</small>
                  </div>

                  <div className="col-12">
                    <Form.Check
                      type="switch"
                      id="weekly-summary"
                      label="Weekly Summary"
                      checked={settings.weeklySummary}
                      onChange={(e) => handleSettingChange('weeklySummary', e.target.checked)}
                    />
                    <small className="text-muted">Weekly summary of your prayer and praise activity</small>
                  </div>

                  <div className="col-md-6">
                    <Form.Label>Daily Reminder Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={settings.reminderTime}
                      onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                      disabled={!settings.dailyReminders}
                    />
                  </div>

                  <div className="col-12">
                    <Form.Check
                      type="switch"
                      id="sound-enabled"
                      label="Sound"
                      checked={settings.soundEnabled}
                      onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                    />
                  </div>

                  <div className="col-12">
                    <Form.Check
                      type="switch"
                      id="vibration-enabled"
                      label="Vibration"
                      checked={settings.vibrationEnabled}
                      onChange={(e) => handleSettingChange('vibrationEnabled', e.target.checked)}
                    />
                  </div>

                  <div className="col-12">
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={handleTestNotification}
                      disabled={!settings.enabled}
                    >
                      <i className="bi bi-bell me-2"></i>
                      Test Notification
                    </Button>
                    
                    {testResult && (
                      <Alert 
                        variant={testResult === 'success' ? 'success' : 'danger'} 
                        className="mt-2"
                        dismissible
                        onClose={() => setTestResult(null)}
                      >
                        {testResult === 'success' 
                          ? 'Test notification sent successfully!' 
                          : 'Failed to send test notification. Please check your settings.'
                        }
                      </Alert>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <hr />

          {/* Data Management */}
          <div>
            <h6 className="text-muted text-uppercase small mb-3">
              <i className="bi bi-database me-2"></i>
              Data Management
            </h6>
            
            <div className="d-grid gap-2">
              <Button variant="primary" onClick={onExportData}>
                <i className="bi bi-download me-2"></i>Export Data
              </Button>
              <Button variant="danger" onClick={onResetDatabase}>
                <i className="bi bi-trash me-2"></i>Reset Database
              </Button>
            </div>
          </div>

          <hr />

          {/* App Information */}
          <div>
            <h6 className="text-muted text-uppercase small mb-3">
              <i className="bi bi-info-circle me-2"></i>
              App Information
            </h6>
            
            <div className="row g-2 text-muted small">
              <div className="col-6">Version:</div>
              <div className="col-6">1.0.0</div>
              
              <div className="col-6">Browser Support:</div>
              <div className="col-6">
                {isSupported ? (
                  <Badge bg="success">Supported</Badge>
                ) : (
                  <Badge bg="warning">Limited</Badge>
                )}
              </div>
              
              <div className="col-6">Notifications:</div>
              <div className="col-6">{getPermissionStatusBadge()}</div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SettingsModal; 