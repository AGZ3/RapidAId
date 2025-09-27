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
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'John Smith',
      location: '567 Oak Ave, Tampa, FL',
      request_text: 'Medical supplies needed for elderly mother with diabetes.',
      category: 'medical',
      created_at: '2024-01-15T09:15:00Z'
    },
    {
      id: 3,
      name: null,
      location: '890 Pine St, Orlando, FL',
      request_text: 'Shelter needed for tonight. House is flooded.',
      category: 'shelter',
      created_at: '2024-01-15T08:45:00Z'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      location: '321 Elm St, Jacksonville, FL',
      request_text: 'Need clean drinking water. Our water supply is contaminated.',
      category: 'water',
      created_at: '2024-01-15T07:20:00Z'
    },
    {
      id: 5,
      name: 'Carlos Martinez',
      location: '654 Maple Dr, Tallahassee, FL',
      request_text: 'Looking for blankets and warm clothes for children.',
      category: 'other',
      created_at: '2024-01-14T22:10:00Z'
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
      requests.map(r => r.location?.split(',')[1]?.trim()).filter(Boolean)
    ).size;
    
    return {
      totalRequests,
      categoryCounts,
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
              For coordination with other responders, use your organization's standard communication channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;