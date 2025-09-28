import React from 'react';
import CategoryBadge from './CategoryBadge.jsx';
import StatusBadge from './StatusBadge.jsx';
import './RequestCard.css';

const RequestCard = ({ request, onStatusChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(request.id, newStatus);
    }
  };

  const handleDirections = () => {
    if (request.location) {
      const encodedAddress = encodeURIComponent(request.location);
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const getStatusActions = () => {
    const status = request.status?.toLowerCase();
    
    switch (status) {
      case 'unclaimed':
        return (
          <div className="status-actions">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => handleStatusChange('claimed')}
            >
              Claim Request
            </button>
            <button 
              className="btn btn-outline btn-sm directions-btn"
              onClick={handleDirections}
              title="Get directions to this location"
            >
              📍 Directions
            </button>
          </div>
        );
      case 'claimed':
        return (
          <div className="status-actions">
            <button 
              className="btn btn-success btn-sm"
              onClick={() => handleStatusChange('completed')}
            >
              Mark Complete
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleStatusChange('unclaimed')}
            >
              Unclaim
            </button>
            <button 
              className="btn btn-outline btn-sm directions-btn"
              onClick={handleDirections}
              title="Get directions to this location"
            >
              📍 Directions
            </button>
          </div>
        );
      case 'completed':
        return (
          <span className="completion-note">✓ Request fulfilled</span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="request-card" data-status={request.status}>
      <div className="request-card-header">
        <div className="request-card-badges">
          <CategoryBadge category={request.category} />
          <StatusBadge status={request.status} />
        </div>
        <div className="request-card-timestamp">
          {formatDate(request.created_at)}
        </div>
      </div>

      <div className="request-card-content">
        <p className="request-text">{request.request_text}</p>
      </div>

      <div className="request-card-footer">
        <div className="request-info">
          {request.name && (
            <div className="request-name">
              <span className="info-label">Name:</span>
              <span className="info-value">{request.name}</span>
            </div>
          )}
          <div className="request-location">
            <span className="info-label">Location:</span>
            <span className="info-value">{request.location}</span>
          </div>
        </div>
        {request.id && (
          <div className="request-id">
            ID: {request.id}
          </div>
        )}
      </div>

      <div className="request-card-actions">
        {getStatusActions()}
      </div>
    </div>
  );
};

export default RequestCard;