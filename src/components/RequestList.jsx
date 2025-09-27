import React, { useState } from 'react';
import RequestCard from './RequestCard.jsx';
import './RequestList.css';

const RequestList = ({ requests, isLoading, error }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority'); // ✅ only declare once, default to priority

  const categories = ['all', 'food', 'water', 'shelter', 'medical', 'other'];

  const filteredRequests =
    requests?.filter((request) => {
      if (filter === 'all') return true;
      return request.category?.toLowerCase() === filter;
    }) || [];

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        return (b.priority_score || 0) - (a.priority_score || 0); // high to low
      case 'newest':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      case 'oldest':
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      case 'location':
        return (a.location || '').localeCompare(b.location || '');
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="request-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="request-list-error">
        <h3>Error Loading Requests</h3>
        <p>{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="request-list">
      <div className="request-list-header">
        <div className="request-list-title">
          <h2>Aid Requests</h2>
          <span className="request-count">
            {sortedRequests.length} request
            {sortedRequests.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="request-list-controls">
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="priority">Priority</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="location">Location</option>
            </select>
          </div>
        </div>
      </div>

      {sortedRequests.length === 0 ? (
        <div className="request-list-empty">
          <h3>No requests found</h3>
          <p>
            {filter === 'all'
              ? 'No aid requests have been submitted yet.'
              : `No requests found for the "${filter}" category.`}
          </p>
        </div>
      ) : (
        <div className="request-list-grid">
          {sortedRequests.map((request, index) => (
            <RequestCard key={request.id || index} request={request} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestList;
