import React from 'react';
import CategoryBadge from './CategoryBadge.jsx';
import './RequestCard.css';

const RequestCard = ({ request }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="request-card">
      <div className="request-card-header">
        <div className="request-card-badges">
          <CategoryBadge category={request.category} />
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
    </div>
  );
};

export default RequestCard;