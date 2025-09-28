import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CategoryBadge from './CategoryBadge.jsx';
import StatusBadge from './StatusBadge.jsx';
import './RequestCard.css';

const RequestCard = ({ request, onStatusChange }) => {
  const { t, i18n } = useTranslation();

  const [translatedText, setTranslatedText] = useState(request.request_text || '');
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    let mounted = true;
    const src = request.request_text || '';
    const target = (i18n.language || 'en').split('-')[0];

    // If no text or target is English (assume original is English), just use original
    if (!src || target === 'en') {
      setTranslatedText(src);
      return () => { mounted = false; };
    }

    setTranslating(true);
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: src, targetLang: target })
    })
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        if (json && json.translated) setTranslatedText(json.translated);
        else setTranslatedText(src);
      })
      .catch(() => {
        if (mounted) setTranslatedText(src);
      })
      .finally(() => {
        if (mounted) setTranslating(false);
      });

    return () => { mounted = false; };
  }, [request.request_text, i18n.language]);

  const displayName = (request.name && request.name.trim()) ? request.name : t('anonymous');

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
        <p className="request-text">
          {translating ? `${t('translating')}…` : translatedText}
        </p>
      </div>

      <div className="request-card-footer">
        <div className="request-info">
          { /* show anonymous when no name */ }
          <div className="request-name">
            <span className="info-label">{t('nameLabel')}</span>
            <span className="info-value">{displayName}</span>
          </div>

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
        <div className="status-actions">
          {getStatusActions()}

          {/* Directions button sits inline with status actions so it stays next to Claim/Unclaim */}
          {request.location && request.status !== 'completed' && (
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
          )}
        </div>
       </div>
     </div>
   );
 };
 
 export default RequestCard;