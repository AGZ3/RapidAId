import React, { useState, useEffect } from 'react';
import RequestList from '../components/RequestList.jsx';
import './DashboardPage.css';

const DashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/requests');
      if (!response.ok) throw new Error('Failed to fetch requests');
      let data = await response.json();

      // Sort requests: highest priority first
      data.sort((a, b) => b.priority_score - a.priority_score);

      setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to fetch requests from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatistics = () => {
    const totalRequests = requests.length;
    const categoryCounts = requests.reduce((acc, request) => {
      const category = request.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const uniqueLocations = new Set(
      requests.map(r => r.address?.split(',')[1]?.trim()).filter(Boolean)
    ).size;

    return { totalRequests, categoryCounts, uniqueLocations };
  };

  const stats = getStatistics();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-title">
            <h1>Responder Dashboard</h1>
            <p>View and respond to aid requests in your area</p>
          </div>
          <div className="dashboard-actions">
            <button
              className="btn btn-primary refresh-btn"
              onClick={fetchRequests}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalRequests}</div>
              <div className="stat-label">Total Requests</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.categoryCounts.food || 0}</div>
              <div className="stat-label">Food Requests</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.categoryCounts.medical || 0}</div>
              <div className="stat-label">Medical Requests</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.uniqueLocations}</div>
              <div className="stat-label">Cities Affected</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          <RequestList
            requests={requests}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>

      <div className="responder-info">
        <div className="container">
          <div className="info-card">
            <h3>For Responders</h3>
            <p>
              To respond to a request, contact the requester directly using the provided information.
              Requests marked as urgent or high-priority should be addressed first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
