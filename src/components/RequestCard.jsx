import React from 'react';
import { useTranslation } from 'react-i18next';
import CategoryBadge from './CategoryBadge.jsx';
import StatusBadge from './StatusBadge.jsx';
import './RequestCard.css';

const RequestCard = ({ request, onStatusChange }) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return t('justNow');
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + t('at') + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(request.id, newStatus);
    }
  };

  const getStatusActions = () => {
    const status = request.status?.toLowerCase();
    
    switch (status) {
      case 'unclaimed':
        return (
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => handleStatusChange('claimed')}
          >
            {t('claimRequest')}
          </button>
        );
      case 'claimed':
        return (
          <div className="status-actions">
            <button 
              className="btn btn-success btn-sm"
              onClick={() => handleStatusChange('completed')}
            >
              {t('markComplete')}
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleStatusChange('unclaimed')}
            >
              {t('unclaim')}
            </button>
          </div>
        );
      case 'completed':
        return (
          <span className="completion-note">✓ {t('requestFulfilled')}</span>
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
              <span className="info-label">{t('nameLabel')}</span>
              <span className="info-value">{request.name}</span>
            </div>
          )}
          <div className="request-location">
            <span className="info-label">{t('locationLabel')}</span>
            <span className="info-value">{request.location}</span>
          </div>
        </div>
        {request.id && (
          <div className="request-id">
            {t('id')}: {request.id}
          </div>
        )}
      </div>

      <div className="request-card-actions">
        {getStatusActions()}
        {/* Directions button opens Google Maps directions from current location to the request location */}
        {request.location && (
          (() => {
            const { t } = useTranslation();
            return (
              <button
                className="btn btn-outline btn-sm directions-btn"
                onClick={() => {
                  const destination = encodeURIComponent(request.location);
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                  window.open(url, '_blank');
                }}
              >
                {t('directions')}
              </button>
            );
          })()
        )}
      </div>
    </div>
  );
};

export default RequestCard;