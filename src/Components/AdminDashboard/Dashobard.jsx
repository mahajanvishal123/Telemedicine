import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function Dashobard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'Patient', joinDate: '2023-05-15', status: 'Active' },
    { id: 2, name: 'Dr. Jane Smith', email: 'jane@example.com', type: 'Provider', joinDate: '2023-05-10', status: 'Active' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', type: 'Caregiver', joinDate: '2023-05-05', status: 'Inactive' },
    { id: 4, name: 'Dr. Sarah Williams', email: 'sarah@example.com', type: 'Provider', joinDate: '2023-05-01', status: 'Pending' },
  ]);

  const statsData = {
    totalUsers: 1245,
    totalAppointments: 378,
    totalEarnings: 18450,
    recentSignups: users.slice(0, 3)
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? {...user, status: newStatus} : user
    ));
  };

  const renderDashboard = () => (
    <div className="row">
      <div className="col-md-3 mb-4">
        <div className="card stat-card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="ms-3">
                <h5 className="card-title">{statsData.totalUsers}</h5>
                <p className="card-text">Total Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-3 mb-4">
        <div className="card stat-card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="stat-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="ms-3">
                <h5 className="card-title">{statsData.totalAppointments}</h5>
                <p className="card-text">Total Appointments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-3 mb-4">
        <div className="card stat-card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="stat-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="ms-3">
                <h5 className="card-title">${statsData.totalEarnings}</h5>
                <p className="card-text">Total Earnings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-3 mb-4">
        <div className="card stat-card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="ms-3">
                <h5 className="card-title">+24%</h5>
                <p className="card-text">Growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Recent Sign-ups</h5>
            <button className="btn btn-primary">View All</button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Join Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {statsData.recentSignups.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.type}</td>
                      <td>{user.joinDate}</td>
                      <td>
                        <span className={`badge bg-${user.status === 'Active' ? 'success' : user.status === 'Pending' ? 'warning' : 'secondary'}`}>
                          {user.status}
                        </span>
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
  );

  const renderUsers = () => (
    <div className="card">
      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('patients')}>Patients</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'providers' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('providers')}>Providers</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'caregivers' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('caregivers')}>Caregivers</button>
          </li>
        </ul>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
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
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.joinDate}</td>
                  <td>
                    <span className={`badge bg-${user.status === 'Active' ? 'success' : user.status === 'Pending' ? 'warning' : 'secondary'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleStatusChange(user.id, 'Active')}
                      >
                        <i className="fas fa-check"></i> Activate
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleStatusChange(user.id, 'Inactive')}
                      >
                        <i className="fas fa-ban"></i> Deactivate
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
  );

  const renderVerification = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Doctor Verification Requests</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Submitted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dr. Michael Chen</td>
                <td>michael@example.com</td>
                <td>Cardiology</td>
                <td>2023-05-18</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-success">
                      <i className="fas fa-check"></i> Approve
                    </button>
                    <button className="btn btn-sm btn-danger">
                      <i className="fas fa-times"></i> Reject
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Dr. Emily Rodriguez</td>
                <td>emily@example.com</td>
                <td>Pediatrics</td>
                <td>2023-05-17</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-success">
                      <i className="fas fa-check"></i> Approve
                    </button>
                    <button className="btn btn-sm btn-danger">
                      <i className="fas fa-times"></i> Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <i className="fas fa-clinic-medical me-2"></i>
            TelemediBridge Admin
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#"><i className="fas fa-bell"></i></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"><i className="fas fa-cog"></i></a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                  <i className="fas fa-user-circle me-1"></i> Admin User
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#">Profile</a></li>
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Logout</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-3 col-lg-2">
            <div className="list-group">
              <a href="#" className="list-group-item list-group-item-action active">
                <i className="fas fa-tachometer-alt me-2"></i> Dashboard
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                <i className="fas fa-users me-2"></i> User Management
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                <i className="fas fa-user-md me-2"></i> Verification
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                <i className="fas fa-calendar-alt me-2"></i> Appointments
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                <i className="fas fa-chart-bar me-2"></i> Reports
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                <i className="fas fa-cog me-2"></i> Settings
              </a>
            </div>
          </div>

          <div className="col-md-9 col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Admin Dashboard</h2>
              <div>
                <button className="btn btn-primary me-2">
                  <i className="fas fa-download me-1"></i> Export
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-1"></i> Add New
                </button>
              </div>
            </div>

            {renderDashboard()}
            <div className="mt-4">
              <h4 className="mb-3">User Management</h4>
              {renderUsers()}
            </div>
            <div className="mt-4">
              <h4 className="mb-3">Doctor Verification</h4>
              {renderVerification()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashobard;
