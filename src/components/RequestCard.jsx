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
      {/* HEADER */}
      <div className="request-card-header">
        <div className="request-card-badges">
          <CategoryBadge category={request.category} />
          {request.tags && request.tags.map(tag => (
            tag !== request.category && (
              <span key={tag} className={`tag-badge ${tag}`}>
                {tag.toUpperCase()}
              </span>
            )
          ))}
        </div>

        <div className="request-card-priority">
            <span className="priority-score">
              Priority: {request.priority_score ?? 'N/A'}
            </span>
          )}
        </div>


        <div className="request-card-timestamp">
          {formatDate(request.created_at)}
        </div>
      </div>

      {/* CONTENT */}
      <div className="request-card-content">
        <p className="request-text">{request.request_text}</p>
      </div>

      {/* FOOTER */}
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
            <span className="info-value">
              {request.address || request.location}
            </span>
          </div>
        </div>

        {request.id && (
          <div className="request-id">ID: {request.id}</div>
        )}

        {request.priority_score >= 70 && (
          <div className="priority-indicator">⚠️ High Priority</div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
