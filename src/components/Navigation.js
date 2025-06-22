import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import prayerIcon from '../assets/images/icons/icon.svg';

const Navigation = ({ activeTab, onTabChange, onSettingsClick }) => {
  return (
    <Navbar bg="light" expand="lg">
      <div className="container-fluid">
        <Navbar.Brand className="d-flex align-items-center" href="#" title="Prayer & Praise">
          <img src={prayerIcon} alt="Prayer & Praise" width="24" height="24" />
        </Navbar.Brand>
        <Nav className="mx-auto">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'prayer'} 
              onClick={() => onTabChange('prayer')}
            >
              Prayer
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'praise'} 
              onClick={() => onTabChange('praise')}
            >
              Praise
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Button 
          variant="link" 
          className="settings-btn" 
          onClick={onSettingsClick}
        >
          <i className="bi bi-gear-fill"></i>
        </Button>
      </div>
    </Navbar>
  );
};

export default Navigation; 