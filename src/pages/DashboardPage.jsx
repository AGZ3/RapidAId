import React, { useState, useEffect } from 'react';
import RequestList from '../components/RequestList.jsx';
import './DashboardPage.css';

const DashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for development
  const mockRequests = [
    {
      id: 1,
      name: 'Maria Rodriguez',
      location: '1234 Main St, Miami, FL',
      request_text: 'Need food and water for family of 4. Lost everything in the hurricane.',
      category: 'food',
      status: 'unclaimed',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'John Smith',
      location: '567 Oak Ave, Tampa, FL',
      request_text: 'Medical supplies needed for elderly mother with diabetes.',
      category: 'medical',
      status: 'claimed',
      created_at: '2024-01-15T09:15:00Z'
    },
    {
      id: 3,
      name: null,
      location: '890 Pine St, Orlando, FL',
      request_text: 'Shelter needed for tonight. House is flooded.',
      category: 'shelter',
      status: 'unclaimed',
      created_at: '2024-01-15T08:45:00Z'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      location: '321 Elm St, Jacksonville, FL',
      request_text: 'Need clean drinking water. Our water supply is contaminated.',
      category: 'water',
      status: 'completed',
      created_at: '2024-01-15T07:20:00Z'
    },
    {
      id: 5,
      name: 'Carlos Martinez',
      location: '654 Maple Dr, Tallahassee, FL',
      request_text: 'Looking for blankets and warm clothes for children.',
      category: 'other',
      status: 'unclaimed',
      created_at: '2024-01-14T22:10:00Z'
    },
    {
      id: 6,
      name: 'Ana Garcia',
      location: '789 Coral Way, Miami, FL',
      request_text: 'Emergency medication needed for my son who has asthma. Pharmacy is closed and we ran out.',
      category: 'medical',
      status: 'unclaimed',
      created_at: '2024-01-15T11:45:00Z'
    },
    {
      id: 7,
      name: 'David Lee',
      location: '1357 Birch Rd, Chicago, IL',
      request_text: 'Need diapers and baby formula for my 6-month-old. Local stores are out of stock.',
      category: 'other',
      status: 'unclaimed',
      created_at: '2024-01-15T12:30:00Z'
    }
  ];

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/requests');

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);

      // For development: Use mock data if API is not available
      console.warn('API not available, using mock data');
      setRequests(mockRequests);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update request status');
      }

      // For development: Update local state
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );

      console.log(`Request ${requestId} status updated to: ${newStatus}`);
    } catch (err) {
      console.error('Error updating request status:', err);

      // For development: Still update local state even if API fails
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );
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

    const statusCounts = requests.reduce((acc, request) => {
      const status = request.status || 'unclaimed';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const uniqueLocations = new Set(
      requests.map(r => r.location?.split(',')[1]?.trim()).filter(Boolean)
    ).size;

    return {
      totalRequests,
      categoryCounts,
      statusCounts,
      uniqueLocations
    };
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
          {/* Status Statistics */}
          <div className="stats-section">
            <h3 className="stats-section-title">Response Status</h3>
            <div className="stats-grid">
              <div className="stat-card urgent">
                <div className="stat-number">{stats.statusCounts.unclaimed || 0}</div>
                <div className="stat-label">Needs Help</div>
              </div>

              <div className="stat-card progress">
                <div className="stat-number">{stats.statusCounts.claimed || 0}</div>
                <div className="stat-label">In Progress</div>
              </div>

              <div className="stat-card completed">
                <div className="stat-number">{stats.statusCounts.completed || 0}</div>
                <div className="stat-label">Completed</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">{Math.round(((stats.statusCounts.completed || 0) / stats.totalRequests) * 100) || 0}%</div>
                <div className="stat-label">Completion Rate</div>
              </div>
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
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      <div className="responder-info">
        <div className="container">
          <div className="info-card">
            <h3>For Responders</h3>
            <p>
              To respond to a request, contact the requester directly using the provided information.
              For coordination with other responders, use your organization's standard communication channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;