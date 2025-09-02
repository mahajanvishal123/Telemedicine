import React, { useState } from 'react';

const UserManagement = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('patients');
  // State for modal visibility and selected user
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});

  // Sample user data
  const [users, setUsers] = useState({
    patients: [
      { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2023-09-15', status: 'Active', type: 'patients', phone: '555-1234', address: '123 Main St' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2023-10-05', status: 'Inactive', type: 'patients', phone: '555-5678', address: '456 Oak Ave' },
      { id: 3, name: 'Robert Brown', email: 'robert@example.com', joinDate: '2023-10-10', status: 'Active', type: 'patients', phone: '555-9012', address: '789 Pine Rd' },
      { id: 4, name: 'Emily Johnson', email: 'emily@example.com', joinDate: '2023-10-12', status: 'Pending', type: 'patients', phone: '555-3456', address: '321 Elm Ln' },
      { id: 5, name: 'Michael Davis', email: 'michael@example.com', joinDate: '2023-10-18', status: 'Active', type: 'patients', phone: '555-7890', address: '654 Maple Dr' }
    ],
    providers: [
      { id: 101, name: 'Dr. Sarah Wilson', email: 'sarah@example.com', joinDate: '2023-08-20', status: 'Active', type: 'providers', specialty: 'Cardiology', license: 'MD12345' },
      { id: 102, name: 'Dr. James Miller', email: 'james@example.com', joinDate: '2023-09-05', status: 'Active', type: 'providers', specialty: 'Pediatrics', license: 'MD67890' },
      { id: 103, name: 'Dr. Lisa Taylor', email: 'lisa@example.com', joinDate: '2023-10-01', status: 'Inactive', type: 'providers', specialty: 'Dermatology', license: 'MD54321' },
      { id: 104, name: 'Dr. David Clark', email: 'david@example.com', joinDate: '2023-10-15', status: 'Pending', type: 'providers', specialty: 'Orthopedics', license: 'MD09876' }
    ],
    caregivers: [
      { id: 201, name: 'Amy Rodriguez', email: 'amy@example.com', joinDate: '2023-09-25', status: 'Active', type: 'caregivers', certification: 'CNA', yearsExperience: 5 },
      { id: 202, name: 'Kevin Martin', email: 'kevin@example.com', joinDate: '2023-10-08', status: 'Active', type: 'caregivers', certification: 'LPN', yearsExperience: 3 },
      { id: 203, name: 'Sophia Lee', email: 'sophia@example.com', joinDate: '2023-10-16', status: 'Inactive', type: 'caregivers', certification: 'RN', yearsExperience: 7 }
    ]
  });

  // Function to open modal and set selected user
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setShowModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({});
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Function to save user changes
  const handleSave = () => {
    if (selectedUser) {
      setUsers(prevUsers => ({
        ...prevUsers,
        [selectedUser.type]: prevUsers[selectedUser.type].map(user => 
          user.id === selectedUser.id ? { ...user, ...formData } : user
        )
      }));
    }
    handleCloseModal();
  };

  // Function to toggle user status
  const toggleStatus = (userId, userType) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [userType]: prevUsers[userType].map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
          : user
      )
    }));
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case 'Active': return 'bg-success';
      case 'Inactive': return 'bg-secondary';
      case 'Pending': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  };

  // Render additional fields based on user type
  const renderAdditionalFields = () => {
    if (!selectedUser) return null;
    
    switch(selectedUser.type) {
      case 'patients':
        return (
          <>
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="text" 
                className="form-control" 
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea 
                className="form-control" 
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
          </>
        );
      case 'providers':
        return (
          <>
            <div className="form-group">
              <label>Specialty</label>
              <input 
                type="text" 
                className="form-control" 
                name="specialty"
                value={formData.specialty || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>License Number</label>
              <input 
                type="text" 
                className="form-control" 
                name="license"
                value={formData.license || ''}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      case 'caregivers':
        return (
          <>
            <div className="form-group">
              <label>Certification</label>
              <input 
                type="text" 
                className="form-control" 
                name="certification"
                value={formData.certification || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input 
                type="number" 
                className="form-control" 
                name="yearsExperience"
                value={formData.yearsExperience || ''}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <h1 className="h3 mb-0" style={{ color: '#F95918' }}>User Management</h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#" style={{ color: '#F95918' }}>Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">User Management</li>
          </ol>
        </nav>
      </div>

      {/* Tabs Navigation */}
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs" id="userTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`}
                onClick={() => setActiveTab('patients')}
                style={activeTab === 'patients' ? { 
                  backgroundColor: '#F95918', 
                  color: 'white', 
                  borderColor: '#F95918' 
                } : {}}
              >
                Patients ({users.patients.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'providers' ? 'active' : ''}`}
                onClick={() => setActiveTab('providers')}
                style={activeTab === 'providers' ? { 
                  backgroundColor: '#F95918', 
                  color: 'white', 
                  borderColor: '#F95918' 
                } : {}}
              >
                Providers ({users.providers.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'caregivers' ? 'active' : ''}`}
                onClick={() => setActiveTab('caregivers')}
                style={activeTab === 'caregivers' ? { 
                  backgroundColor: '#F95918', 
                  color: 'white', 
                  borderColor: '#F95918' 
                } : {}}
              >
                Caregivers ({users.caregivers.length})
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Table Section */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Join Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users[activeTab].map(user => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.joinDate}</td>
                        <td>
                          <span className={`badge ${getStatusClass(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm flex-fill"
                              onClick={() => handleEdit(user)}
                              style={{ 
                                backgroundColor: '#F95918', 
                                color: 'white',
                                borderColor: '#F95918'
                              }}
                            >
                              <i className="fas fa-edit me-1"></i> Edit
                            </button>
                            <button 
                              className={`btn btn-sm flex-fill ${user.status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => toggleStatus(user.id, user.type)}
                            >
                              {user.status === 'Active' ? (
                                <><i className="fas fa-ban me-1"></i> Deactivate</>
                              ) : (
                                <><i className="fas fa-check me-1"></i> Activate</>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header text-white" style={{ backgroundColor: '#F95918' }}>
                <h5 className="modal-title">Edit User: {selectedUser?.name}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Join Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        name="joinDate"
                        value={formData.joinDate || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Status</label>
                      <select 
                        className="form-control" 
                        name="status"
                        value={formData.status || ''}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {renderAdditionalFields()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn text-white" 
                  onClick={handleSave}
                  style={{ backgroundColor: '#F95918' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;