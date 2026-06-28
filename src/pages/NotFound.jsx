import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <AlertOctagon size={64} className="glitch-icon" />
        <h1 className="glitch-text" data-text="404 - CLEARANCE REQUIRED">404 - CLEARANCE REQUIRED</h1>
        <p className="subtitle">The coordinates you requested do not exist or require higher administrative clearance.</p>
        <div className="action-buttons">
          <Link to="/" className="btn-primary">Return to Gateway</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
