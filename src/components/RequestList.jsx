import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RequestCard from './RequestCard.jsx';
import './RequestList.css';

const RequestList = ({ requests, isLoading, error, onStatusChange }) => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { t } = useTranslation();

  const categories = ['all', 'food', 'water', 'shelter', 'medical', 'other'];
  const statuses = ['all', 'unclaimed', 'claimed', 'completed'];

  const filteredRequests = requests?.filter(request => {
    // Category filter
    const categoryMatch = categoryFilter === 'all' || request.category?.toLowerCase() === categoryFilter;
    
    // Status filter
    const statusMatch = statusFilter === 'all' || request.status?.toLowerCase() === statusFilter;
    
    return categoryMatch && statusMatch;
  }) || [];

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    // First, always keep completed requests at bottom regardless of sort preference
    const aCompleted = a.status === 'completed';
    const bCompleted = b.status === 'completed';
    
    if (aCompleted && !bCompleted) return 1;  // a (completed) goes after b (non-completed)
    if (!aCompleted && bCompleted) return -1; // a (non-completed) goes before b (completed)
    
    // Within each status group, apply the selected sort
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      case 'oldest':
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      default:
                return 0;
    }
  });
 

  if (isLoading) {
    return (
      <div className="request-list-loading">
        <div className="loading-spinner"></div>
        <p>{t('loadingRequests')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="request-list-error">
        <h3>{t('errorLoading')}</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="request-list">
      <div className="request-list-header">
        <div className="request-list-title">
          <h2>{t('requests')}</h2>
          <span className="request-count">
            {sortedRequests.length} {t('requests')}
          </span>
        </div>

        <div className="request-list-controls">
          <div className="filter-group">
            <label htmlFor="category-filter">{t('category')}:</label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {t(`categories.${category}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">{t('status')}:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {t(`statuses.${status}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-by">{t('sortBy')}:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">{t('newestFirst')}</option>
              <option value="oldest">{t('oldestFirst')}</option>
            </select>
          </div>
        </div>
      </div>

      {sortedRequests.length === 0 ? (
        <div className="request-list-empty">
          <h3>{t('noRequestsTitle')}</h3>
          <p>
            {categoryFilter === 'all' && statusFilter === 'all'
              ? t('noRequests')
              : t('noRequestsFilter')
            }
          </p>
        </div>
      ) : (
        <div className="request-list-grid">
          {sortedRequests.map((request, index) => (
            <RequestCard 
              key={request.id || index} 
              request={request} 
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestList;