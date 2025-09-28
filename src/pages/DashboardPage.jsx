import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import RequestList from '../components/RequestList.jsx';
import databaseService from '../services/databaseService.js';
import './DashboardPage.css';

const DashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = new URLSearchParams(useLocation().search);
  const activeTab = params.get('tab') || 'requests';

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

  // Helper function to sort requests: completed at bottom, then by date
  const sortRequestsByStatusAndDate = (requests) => {
    return [...requests].sort((a, b) => {
      // First, separate completed from non-completed
      const aCompleted = a.status === 'completed';
      const bCompleted = b.status === 'completed';
      
      if (aCompleted && !bCompleted) return 1;  // a (completed) goes after b (non-completed)
      if (!aCompleted && bCompleted) return -1; // a (non-completed) goes before b (completed)
      
      // If both have same completion status, sort by date (newest first)
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📋 Fetching requests from database...');
      
      // Initialize database if needed
      await databaseService.initialize();
      
      // Migrate any existing 'pending' status to 'unclaimed' for consistency
      await databaseService.migratePendingToUnclaimed();
      
      // Get all requests from IndexedDB
      const data = await databaseService.getAllRequests();
      
      console.log(`✅ Loaded ${data.length} requests from database`);
      
      // Apply custom sorting: completed requests at bottom
      const sortedData = sortRequestsByStatusAndDate(data);
      
      // Show only real database data
      setRequests(sortedData);
    } catch (err) {
      console.error('❌ Error fetching requests from database:', err);
      
      // Show error but don't fallback to mock data
        setRequests([]);
        setError(t('errorLoadDB'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      console.log(`🔄 Updating request ${requestId} status to: ${newStatus}`);
      
      // Update status in database
      const updatedRequest = await databaseService.updateRequestStatus(requestId, newStatus);
      
      // Update local state with the updated request and re-sort
      setRequests(prevRequests => {
        const updatedRequests = prevRequests.map(request =>
          request.id === requestId
            ? updatedRequest
            : request
        );
        
        // Re-sort to ensure completed requests stay at bottom
        return sortRequestsByStatusAndDate(updatedRequests);
      });

      console.log(`✅ Request ${requestId} status successfully updated to: ${newStatus}`);
    } catch (err) {
      console.error('❌ Error updating request status:', err);
      setError(`Failed to update request status: ${err.message}`);

      // Still update local state for UI responsiveness and re-sort
      setRequests(prevRequests => {
        const updatedRequests = prevRequests.map(request =>
          request.id === requestId
            ? { ...request, status: newStatus }
            : request
        );
        
        // Re-sort to ensure completed requests stay at bottom
        return sortRequestsByStatusAndDate(updatedRequests);
      });
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

  const { t } = useTranslation();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-title">
            <h1>{t('dashboard')}</h1>
            <p>{t('dashboardDescription')}</p>
          </div>

          <div className="dashboard-actions">
            <button
              className="btn btn-primary refresh-btn"
              onClick={fetchRequests}
              disabled={isLoading}
            >
              {isLoading ? t('loading') : t('refreshData')}
            </button>
            
            {/* Development Controls */}
            <button
              className="btn btn-secondary"
              onClick={async () => {
                if (confirm(t('confirmClearDatabase'))) {
                  try {
                    await databaseService.clearAllRequests();
                    await fetchRequests();
                  } catch (err) {
                    console.error('Failed to clear database:', err);
                  }
                }
              }}
              style={{ marginLeft: '10px' }}
            >
              {t('clearDatabase')}
            </button>
            
            <button
              className="btn btn-secondary"
              onClick={async () => {
                try {
                  console.log('📝 Adding sample requests with delays...');
                  
                  // Add sample requests to database for testing
                  const sampleRequests = mockRequests.map((req, index) => ({
                    ...req,
                    id: `sample_${Date.now()}_${req.id}`,
                    created_at: new Date(Date.now() + index * 1000).toISOString() // Stagger timestamps
                  }));
                  
                  // Add requests with delay between each one
                  for (let i = 0; i < sampleRequests.length; i++) {
                    const request = sampleRequests[i];
                    await databaseService.addRequest(request);
                    console.log(`✅ Added sample request ${i + 1}/${sampleRequests.length}: ${request.name || t('anonymous')}`);
                    
                    // Add 300ms delay between requests (except for the last one)
                    if (i < sampleRequests.length - 1) {
                      await new Promise(resolve => setTimeout(resolve, 300));
                    }
                  }
                  
                  console.log(`🎉 Successfully added all ${sampleRequests.length} sample requests to database`);
                  await fetchRequests();
                } catch (err) {
                  console.error('Failed to add sample data:', err);
                }
              }}
              style={{ marginLeft: '10px' }}
            >
              {t('addSampleData')}
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="container">
          {/* Status Statistics */}
          <div className="stats-section">
            <h3 className="stats-section-title">{t('responseStatus')}</h3>
            <div className="stats-grid">
              <div className="stat-card urgent">
                <div className="stat-number">{stats.statusCounts.unclaimed || 0}</div>
                <div className="stat-label">{t('needsHelp')}</div>
              </div>

              <div className="stat-card progress">
                <div className="stat-number">{stats.statusCounts.claimed || 0}</div>
                <div className="stat-label">{t('inProgress')}</div>
              </div>

              <div className="stat-card completed">
                <div className="stat-number">{stats.statusCounts.completed || 0}</div>
                <div className="stat-label">{t('completed')}</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">{Math.round(((stats.statusCounts.completed || 0) / stats.totalRequests) * 100) || 0}%</div>
                <div className="stat-label">{t('completionRate')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {/* Header controls the tab via the `tab` query param (e.g. ?tab=map or ?tab=requests) */}
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
            <h3>{t('forRespondersTitle')}</h3>
            <p>{t('forRespondersText')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;