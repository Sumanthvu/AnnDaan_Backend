import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState([]);

  // Sample donation data (replace with actual API call)
  const sampleDonations = [
    { id: 1, name: 'Rice and Curry', quantity: '20 meals', date: '2024-05-15', status: 'Available' },
    { id: 2, name: 'Bread and Pastries', quantity: '15 items', date: '2024-05-14', status: 'Claimed' },
    { id: 3, name: 'Vegetable Soup', quantity: '10 liters', date: '2024-05-13', status: 'Delivered' },
    { id: 4, name: 'Fruit Baskets', quantity: '5 baskets', date: '2024-05-12', status: 'Available' },
  ];

  useEffect(() => {
    const fetchRestaurantData = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      try {
        // Check if this is a demo user or a user who just verified OTP
        if (token === 'demo-token-for-hardcoded-user' || token === 'otp-verified-restaurant') {
          setRestaurant({
            id: token === 'otp-verified-restaurant' ? 1000 : 999, // Differentiate OTP verified user slightly
            name: user.name || "Your Restaurant",
            address: "123 Food Street", // Placeholder
            city: "Your City", // Placeholder
            state: "Your State", // Placeholder
            pincode: "123456", // Placeholder
            contactNumber: "9876543210", // Placeholder
            email: user.email || "restaurant@example.com",
            description: token === 'otp-verified-restaurant' 
              ? "Welcome! Your restaurant profile can be updated here."
              : "This is a demo restaurant account for testing purposes.",
            cuisineType: "Various", // Placeholder
            openingHours: "9:00 AM - 10:00 PM" // Placeholder
          });
          setDonations(sampleDonations);
          setLoading(false);
          return;
        }
        
        // For real users with full JWT, try to fetch from API (this will likely fail with current setup)
        try {
          const response = await axios.get('http://localhost:8080/api/restaurants/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          setRestaurant(response.data);
          setDonations(sampleDonations); // Using sample data for now
        } catch (apiError) {
          console.error('Error fetching restaurant data from API:', apiError);
          
          // Fallback to simulated data if API call fails
          setRestaurant({
            id: 1,
            name: "Your Restaurant (API Fallback)",
            address: "123 Food Street",
            city: "Your City",
            state: "Your State",
            pincode: "123456",
            contactNumber: "9876543210",
            email: user.username || "restaurant@example.com", // Assuming 'username' key from a full user object
            description: "Your restaurant description will appear here.",
            cuisineType: "Various",
            openingHours: "9:00 AM - 10:00 PM"
          });
          setDonations(sampleDonations);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in dashboard initialization:', error);
        setError('Failed to load restaurant data. Please try again later.');
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Or your login/landing page
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">Try Again</button>
      </div>
    );
  }

  return (
    <div className="restaurant-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          {/* Assuming Logo.png is in public/src/assets/img/ or accessible via /src/assets/img/Logo.png */}
          <img src="/src/assets/img/Logo.png" alt="Ann Daan Logo" className="sidebar-logo" />
          <h2>Ann Daan</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Overview</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
              <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
              <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
            </svg>
            <span>Donations</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Profile</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <span>Analytics</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="welcome-message">
            <h1>Welcome, {restaurant?.name}</h1>
            <p>Manage your food donations and make a difference</p>
          </div>
          
          <div className="header-actions">
            <button className="new-donation-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Donation
            </button>
          </div>
        </div>
        
        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon donations">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                      <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Total Donations</h3>
                    <p className="stat-value">24</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon meals">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                      <line x1="6" y1="1" x2="6" y2="4"></line>
                      <line x1="10" y1="1" x2="10" y2="4"></line>
                      <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Meals Provided</h3>
                    <p className="stat-value">320</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Active Donations</h3>
                    <p className="stat-value">2</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon impact">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Lives Impacted</h3>
                    <p className="stat-value">85</p>
                  </div>
                </div>
              </div>
              
              <div className="recent-donations">
                <div className="section-header">
                  <h2>Recent Donations</h2>
                  <button className="view-all-button" onClick={() => setActiveTab('donations')}>
                    View All
                  </button>
                </div>
                
                <div className="donations-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Food Item</th>
                        <th>Quantity</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.slice(0, 3).map(donation => (
                        <tr key={donation.id}>
                          <td>{donation.name}</td>
                          <td>{donation.quantity}</td>
                          <td>{donation.date}</td>
                          <td>
                            <span className={`status-badge ${donation.status.toLowerCase()}`}>
                              {donation.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                  <button className="action-card">
                    <div className="action-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </div>
                    <h3>Add Donation</h3>
                    <p>Create a new food donation</p>
                  </button>
                  
                  <button className="action-card">
                    <div className="action-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </div>
                    <h3>Update Profile</h3>
                    <p>Edit your restaurant details</p>
                  </button>
                  
                  <button className="action-card">
                    <div className="action-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <h3>Contact Support</h3>
                    <p>Get help with any issues</p>
                  </button>
                  
                  <button className="action-card">
                    <div className="action-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </div>
                    <h3>View Reports</h3>
                    <p>See your donation impact</p>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'donations' && (
            <div className="donations-tab">
              <div className="section-header">
                <h2>All Donations</h2>
                <div className="filter-actions">
                  <select className="status-filter">
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="claimed">Claimed</option>
                    <option value="delivered">Delivered</option>
                  </select>
                  <button className="new-donation-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    New Donation
                  </button>
                </div>
              </div>
              
              <div className="donations-table full-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Food Item</th>
                      <th>Quantity</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(donation => (
                      <tr key={donation.id}>
                        <td>#{donation.id}</td>
                        <td>{donation.name}</td>
                        <td>{donation.quantity}</td>
                        <td>{donation.date}</td>
                        <td>
                          <span className={`status-badge ${donation.status.toLowerCase()}`}>
                            {donation.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="action-button view">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                            <button className="action-button edit">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button className="action-button delete">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="pagination">
                <button className="pagination-button prev">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  Previous
                </button>
                <div className="pagination-pages">
                  <button className="page-number active">1</button>
                  <button className="page-number">2</button>
                  <button className="page-number">3</button>
                </div>
                <button className="pagination-button next">
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="profile-header">
                <div className="profile-info">
                  <div className="profile-avatar">
                    {restaurant?.name?.charAt(0) || 'R'}
                  </div>
                  <div className="profile-details">
                    <h2>{restaurant?.name}</h2>
                    <p>{restaurant?.cuisineType}</p>
                  </div>
                </div>
                <button className="edit-profile-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit Profile
                </button>
              </div>
              
              <div className="profile-content">
                <div className="profile-section">
                  <h3>Restaurant Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Restaurant Name</label>
                      <p>{restaurant?.name}</p>
                    </div>
                    <div className="info-item">
                      <label>Cuisine Type</label>
                      <p>{restaurant?.cuisineType}</p>
                    </div>
                    <div className="info-item">
                      <label>Description</label>
                      <p>{restaurant?.description}</p>
                    </div>
                    <div className="info-item">
                      <label>Opening Hours</label>
                      <p>{restaurant?.openingHours}</p>
                    </div>
                  </div>
                </div>
                
                <div className="profile-section">
                  <h3>Contact Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Email</label>
                      <p>{restaurant?.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Phone Number</label>
                      <p>{restaurant?.contactNumber}</p>
                    </div>
                    <div className="info-item">
                      <label>Address</label>
                      <p>{restaurant?.address}</p>
                    </div>
                    <div className="info-item">
                      <label>City, State, Pincode</label>
                      <p>{restaurant?.city}, {restaurant?.state}, {restaurant?.pincode}</p>
                    </div>
                  </div>
                </div>
                
                <div className="profile-section">
                  <h3>Account Settings</h3>
                  <div className="settings-buttons">
                    <button className="settings-button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Change Password
                    </button>
                    <button className="settings-button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      Notification Settings
                    </button>
                    <button className="settings-button danger">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              <div className="section-header">
                <h2>Donation Analytics</h2>
                <div className="filter-actions">
                  <select className="time-filter">
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Donation Summary</h3>
                  <div className="analytics-content">
                    <div className="placeholder-chart">
                      <p>Donation chart will appear here</p>
                      <div className="chart-placeholder"></div>
                    </div>
                  </div>
                </div>
                
                <div className="analytics-card">
                  <h3>Impact Statistics</h3>
                  <div className="analytics-content">
                    <div className="impact-stats">
                      <div className="impact-stat">
                        <h4>320</h4>
                        <p>Meals Provided</p>
                      </div>
                      <div className="impact-stat">
                        <h4>85</h4>
                        <p>People Fed</p>
                      </div>
                      <div className="impact-stat">
                        <h4>24</h4>
                        <p>Total Donations</p>
                      </div>
                      <div className="impact-stat">
                        <h4>95%</h4>
                        <p>Fulfillment Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="analytics-card full-width">
                  <h3>Donation History</h3>
                  <div className="analytics-content">
                    <div className="placeholder-chart">
                      <p>Monthly donation history chart will appear here</p>
                      <div className="chart-placeholder wide"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="analytics-footer">
                <p>Need more detailed analytics? <a href="#">Contact our team</a> for custom reports.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Styles are embedded using styled-jsx like syntax, as in the original file */}
      <style jsx>{`
        .restaurant-dashboard {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        
        /* Sidebar Styles */
        .dashboard-sidebar {
          width: 250px;
          background-color: #fff;
          border-right: 1px solid #e9ecef;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
        }
        
        .sidebar-header {
          padding: 20px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e9ecef;
        }
        
        .sidebar-logo {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
        
        .sidebar-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
        
        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          width: 100%;
          border: none;
          background: none;
          text-align: left;
          font-size: 16px;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .nav-item svg {
          margin-right: 12px;
        }
        
        .nav-item:hover {
          background-color: #f8f9fa;
          color: #4f46e5;
        }
        
        .nav-item.active {
          background-color: #f0f0ff;
          color: #4f46e5;
          font-weight: 500;
          border-left: 3px solid #4f46e5;
        }
        
        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid #e9ecef;
        }
        
        .logout-button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 10px;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          background: none;
          color: #6c757d;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .logout-button svg {
          margin-right: 10px;
        }
        
        .logout-button:hover {
          background-color: #fee2e2;
          color: #b91c1c;
          border-color: #fecaca;
        }
        
        /* Main Content Styles */
        .dashboard-main {
          flex: 1;
          margin-left: 250px;
          padding: 20px;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .welcome-message h1 {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        
        .welcome-message p {
          color: #6c757d;
        }
        
        .new-donation-button {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .new-donation-button svg {
          margin-right: 8px;
        }
        
        .new-donation-button:hover {
          background-color: #4338ca;
        }
        
        /* Overview Tab Styles */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
        }
        
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }
        
        .stat-icon svg {
          color: white;
        }
        
        .stat-icon.donations {
          background-color: #4f46e5;
        }
        
        .stat-icon.meals {
          background-color: #10b981;
        }
        
        .stat-icon.active {
          background-color: #f59e0b;
        }
        
        .stat-icon.impact {
          background-color: #ef4444;
        }
        
        .stat-info h3 {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 5px;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .section-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
        
        .view-all-button {
          color: #4f46e5;
          background: none;
          border: none;
          font-size: 14px;
          cursor: pointer;
        }
        
        .view-all-button:hover {
          text-decoration: underline;
        }
        
        .donations-table {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin-bottom: 30px;
        }
        
        .donations-table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .donations-table th {
          text-align: left;
          padding: 12px 20px;
          background-color: #f8f9fa;
          color: #6c757d;
          font-weight: 500;
          font-size: 14px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .donations-table td {
          padding: 12px 20px;
          border-bottom: 1px solid #e9ecef;
          color: #333;
        }
        
        .donations-table tr:last-child td {
          border-bottom: none;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .status-badge.available {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .status-badge.claimed {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .status-badge.delivered {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .quick-actions {
          margin-bottom: 30px;
        }
        
        .quick-actions h2 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
        }
        
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        
        .action-card {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          text-align: left;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .action-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background-color: #f0f0ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }
        
        .action-icon svg {
          color: #4f46e5;
        }
        
        .action-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        
        .action-card p {
          font-size: 14px;
          color: #6c757d;
        }
        
        /* Donations Tab Styles */
        .filter-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .status-filter, .time-filter {
          padding: 8px 12px;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          background-color: white;
          color: #333;
          font-size: 14px;
        }
        
        .full-table {
          margin-bottom: 20px;
        }
        
        .table-actions {
          display: flex;
          gap: 5px;
        }
        
        .action-button {
          width: 30px;
          height: 30px;
          border-radius: 4px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .action-button.view {
          background-color: #e0f2fe;
          color: #0369a1;
        }
        
        .action-button.edit {
          background-color: #f0fdf4;
          color: #166534;
        }
        
        .action-button.delete {
          background-color: #fef2f2;
          color: #b91c1c;
        }
        
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
        }
        
        .pagination-button {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          background-color: white;
          color: #333;
          font-size: 14px;
          cursor: pointer;
        }
        
        .pagination-button.prev svg {
          margin-right: 5px;
        }
        
        .pagination-button.next svg {
          margin-left: 5px;
        }
        
        .pagination-pages {
          display: flex;
          gap: 5px;
        }
        
        .page-number {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          background-color: white;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .page-number.active {
          background-color: #4f46e5;
          color: white;
          border-color: #4f46e5;
        }
        
        /* Profile Tab Styles */
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-bottom: 30px;
        }
        
        .profile-info {
          display: flex;
          align-items: center;
        }
        
        .profile-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #4f46e5;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
          margin-right: 15px;
        }
        
        .profile-details h2 {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        
        .profile-details p {
          color: #6c757d;
        }
        
        .edit-profile-button {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          background-color: white;
          color: #4f46e5;
          border: 1px solid #4f46e5;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .edit-profile-button svg {
          margin-right: 8px;
        }
        
        .edit-profile-button:hover {
          background-color: #4f46e5;
          color: white;
        }
        
        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .profile-section {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .profile-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .info-item label {
          display: block;
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 5px;
        }
        
        .info-item p {
          font-size: 16px;
          color: #333;
        }
        
        .settings-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .settings-button {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          background-color: white;
          color: #333;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .settings-button svg {
          margin-right: 8px;
        }
        
        .settings-button:hover {
          background-color: #f8f9fa;
        }
        
        .settings-button.danger {
          color: #b91c1c;
        }
        
        .settings-button.danger:hover {
          background-color: #fee2e2;
          border-color: #fecaca;
        }
        
        /* Analytics Tab Styles */
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .analytics-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .analytics-card.full-width {
          grid-column: span 2;
        }
        
        .analytics-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          padding: 15px 20px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .analytics-content {
          padding: 20px;
        }
        
        .placeholder-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }
        
        .placeholder-chart p {
          color: #6c757d;
          margin-bottom: 15px;
        }
        
        .chart-placeholder {
          width: 100%;
          height: 200px;
          background: linear-gradient(to right, #f0f0ff, #e0e7ff);
          border-radius: 8px;
        }
        
        .chart-placeholder.wide {
          height: 250px;
        }
        
        .impact-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        
        .impact-stat {
          text-align: center;
          padding: 15px;
        }
        
        .impact-stat h4 {
          font-size: 24px;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 5px;
        }
        
        .impact-stat p {
          color: #6c757d;
          font-size: 14px;
        }
        
        .analytics-footer {
          text-align: center;
          color: #6c757d;
          font-size: 14px;
          margin-top: 20px;
        }
        
        .analytics-footer a {
          color: #4f46e5;
          text-decoration: none;
        }
        
        .analytics-footer a:hover {
          text-decoration: underline;
        }
        
        /* Loading and Error States */
        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f8f9fa;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(79, 70, 229, 0.2);
          border-radius: 50%;
          border-top-color: #4f46e5;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .dashboard-loading p {
          color: #6c757d;
          font-size: 16px;
        }
        
        .dashboard-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
        }
        
        .error-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #fee2e2;
          color: #b91c1c;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        
        .dashboard-error h2 {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }
        
        .dashboard-error p {
          color: #6c757d;
          margin-bottom: 20px;
          max-width: 500px;
        }
        
        .retry-button {
          padding: 10px 16px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .retry-button:hover {
          background-color: #4338ca;
        }
      `}</style>
    </div>
  );
};

export default RestaurantDashboard;