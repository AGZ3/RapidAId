// Database service using IndexedDB for persistent browser storage
class DatabaseService {
  constructor() {
    this.dbName = 'RapidAidDB';
    this.dbVersion = 1;
    this.db = null;
  }

  // Initialize the database
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('❌ Failed to open database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ Database initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create requests object store if it doesn't exist
        if (!db.objectStoreNames.contains('requests')) {
          const requestStore = db.createObjectStore('requests', { 
            keyPath: 'id',
            autoIncrement: false // We'll use timestamp-based IDs
          });
          
          // Create indexes for efficient querying
          requestStore.createIndex('category', 'category', { unique: false });
          requestStore.createIndex('status', 'status', { unique: false });
          requestStore.createIndex('created_at', 'created_at', { unique: false });
          requestStore.createIndex('location', 'location', { unique: false });
          
          console.log('📊 Created requests object store with indexes');
        }
      };
    });
  }

  // Add a new request to the database
  async addRequest(requestData) {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      
      // Ensure ID is a string for consistency
      const request = {
        ...requestData,
        id: requestData.id.toString()
      };

      const addRequest = store.add(request);

      addRequest.onsuccess = () => {
        console.log(`✅ Added request ${request.id} to database`);
        resolve(request);
      };

      addRequest.onerror = () => {
        console.error('❌ Failed to add request:', addRequest.error);
        reject(addRequest.error);
      };
    });
  }

  // Get all requests from the database
  async getAllRequests() {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['requests'], 'readonly');
      const store = transaction.objectStore('requests');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const requests = getAllRequest.result;
        console.log(`📋 Retrieved ${requests.length} requests from database`);
        
        // Sort by created_at descending (newest first)
        requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        resolve(requests);
      };

      getAllRequest.onerror = () => {
        console.error('❌ Failed to get requests:', getAllRequest.error);
        reject(getAllRequest.error);
      };
    });
  }

  // Get requests by category
  async getRequestsByCategory(category) {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['requests'], 'readonly');
      const store = transaction.objectStore('requests');
      const index = store.index('category');
      const getRequest = index.getAll(category);

      getRequest.onsuccess = () => {
        const requests = getRequest.result;
        requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        resolve(requests);
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  }

  // Get requests by status
  async getRequestsByStatus(status) {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['requests'], 'readonly');
      const store = transaction.objectStore('requests');
      const index = store.index('status');
      const getRequest = index.getAll(status);

      getRequest.onsuccess = () => {
        const requests = getRequest.result;
        requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        resolve(requests);
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  }

  // Update request status
  async updateRequestStatus(id, status) {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      
      // First get the existing request
      const getRequest = store.get(id.toString());
      
      getRequest.onsuccess = () => {
        const request = getRequest.result;
        if (request) {
          request.status = status;
          request.updated_at = new Date().toISOString();
          
          const updateRequest = store.put(request);
          
          updateRequest.onsuccess = () => {
            console.log(`✅ Updated request ${id} status to ${status}`);
            resolve(request);
          };
          
          updateRequest.onerror = () => {
            reject(updateRequest.error);
          };
        } else {
          reject(new Error(`Request with id ${id} not found`));
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  }

  // Delete a request
  async deleteRequest(id) {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      const deleteRequest = store.delete(id.toString());

      deleteRequest.onsuccess = () => {
        console.log(`✅ Deleted request ${id} from database`);
        resolve();
      };

      deleteRequest.onerror = () => {
        console.error('❌ Failed to delete request:', deleteRequest.error);
        reject(deleteRequest.error);
      };
    });
  }

  // Clear all requests (for development/testing)
  async clearAllRequests() {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        console.log('✅ Cleared all requests from database');
        resolve();
      };

      clearRequest.onerror = () => {
        console.error('❌ Failed to clear requests:', clearRequest.error);
        reject(clearRequest.error);
      };
    });
  }

  // Get database statistics
  async getStats() {
    if (!this.db) {
      await this.initialize();
    }

    const requests = await this.getAllRequests();
    
    const stats = {
      total: requests.length,
      byCategory: {},
      byStatus: {},
      recent: requests.slice(0, 5) // Last 5 requests
    };

    // Count by category
    requests.forEach(request => {
      stats.byCategory[request.category] = (stats.byCategory[request.category] || 0) + 1;
      stats.byStatus[request.status] = (stats.byStatus[request.status] || 0) + 1;
    });

    return stats;
  }

  // Migration utility: Update all 'pending' status to 'unclaimed' for consistency
  async migratePendingToUnclaimed() {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const requests = getAllRequest.result;
        let updatedCount = 0;
        
        const pendingRequests = requests.filter(request => request.status === 'pending');
        
        if (pendingRequests.length === 0) {
          console.log('✅ No pending requests found to migrate');
          resolve(0);
          return;
        }

        const updatePromises = pendingRequests.map(request => {
          return new Promise((resolveUpdate) => {
            request.status = 'unclaimed';
            request.updated_at = new Date().toISOString();
            
            const putRequest = store.put(request);
            putRequest.onsuccess = () => {
              updatedCount++;
              resolveUpdate();
            };
            putRequest.onerror = () => {
              console.error(`Failed to update request ${request.id}`);
              resolveUpdate();
            };
          });
        });

        Promise.all(updatePromises).then(() => {
          console.log(`✅ Migrated ${updatedCount} pending requests to unclaimed status`);
          resolve(updatedCount);
        });
      };

      getAllRequest.onerror = () => {
        console.error('❌ Failed to get requests for migration:', getAllRequest.error);
        reject(getAllRequest.error);
      };
    });
  }
}

// Create and export a singleton instance
const databaseService = new DatabaseService();
export default databaseService;