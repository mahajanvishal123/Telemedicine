import React, { useState } from "react";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("patients");
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    joinDate: "",
    status: "Active",
    type: "patients",
  });

  const [users, setUsers] = useState({
    patients: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        joinDate: "2023-09-15",
        status: "Active",
        type: "patients",
        phone: "555-1234",
        address: "123 Main St",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        joinDate: "2023-10-05",
        status: "Inactive",
        type: "patients",
        phone: "555-5678",
        address: "456 Oak Ave",
      },
    ],
    providers: [
      {
        id: 101,
        name: "Dr. Sarah Wilson",
        email: "sarah@example.com",
        joinDate: "2023-08-20",
        status: "Active",
        type: "providers",
        specialty: "Cardiology",
        license: "MD12345",
      },
    ],
    caregivers: [
      {
        id: 201,
        name: "Amy Rodriguez",
        email: "amy@example.com",
        joinDate: "2023-09-25",
        status: "Active",
        type: "caregivers",
        certification: "CNA",
        yearsExperience: 5,
      },
    ],
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({});
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewUserData({
      name: "",
      email: "",
      joinDate: "",
      status: "Active",
      type: activeTab,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setNewUserData({
        ...newUserData,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    if (selectedUser) {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [selectedUser.type]: prevUsers[selectedUser.type].map((user) =>
          user.id === selectedUser.id ? { ...user, ...formData } : user
        ),
      }));
    }
    handleCloseModal();
  };

  const handleAddUser = () => {
    setUsers((prevUsers) => ({
      ...prevUsers,
      [newUserData.type]: [
        ...prevUsers[newUserData.type],
        { ...newUserData, id: Date.now() },
      ],
    }));
    handleCloseAddModal();
  };

  const toggleStatus = (userId, userType) => {
    setUsers((prevUsers) => ({
      ...prevUsers,
      [userType]: prevUsers[userType].map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      ),
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-success";
      case "Inactive":
        return "bg-secondary";
      case "Pending":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="dashboard-heading">User Management</h3>
        <button
          className="btn text-white"
          style={{ backgroundColor: "#F95918" }}
          onClick={() => setShowAddModal(true)}
        >
          + Add User
        </button>
      </div>

      {/* Small Button Tabs */}
      <div className="mb-3">
        <div className="d-flex flex-wrap gap-2">
          {["patients", "providers", "caregivers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn btn-sm fw-semibold ${
                activeTab === tab ? "text-white" : "btn-outline-secondary"
              }`}
              style={{
                backgroundColor: activeTab === tab ? "#F95918" : "",
                borderColor: activeTab === tab ? "#F95918" : "#dee2e6",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} (
              {users[tab].length})
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
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
                    {users[activeTab].map((user) => (
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
                              className="btn btn-sm"
                              onClick={() => handleEdit(user)}
                              style={{
                                color: "#F95918",
                              }}
                            >
                              <i className="fas fa-edit me-1"></i>
                            </button>
                            <button
                              className={`btn btn-sm ${
                                user.status === "Active"
                                  ? "btn-outline-danger"
                                  : "btn-outline-success"
                              }`}
                              onClick={() => toggleStatus(user.id, user.type)}
                            >
                              {user.status === "Active" ? (
                                <>Deactivate</>
                              ) : (
                                <>Activate</>
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
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User: {selectedUser?.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Name"
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  onClick={handleSave}
                  style={{ backgroundColor: "#F95918" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseAddModal}
                ></button>
              </div>
              <div className="modal-body">
                <select
                  className="form-select mb-2"
                  name="type"
                  value={newUserData.type}
                  onChange={handleInputChange}
                >
                  <option value="patients">Doctor</option>
                  <option value="patients">Patient</option>
                  <option value="providers">Provider</option>
                  <option value="caregivers">Caregiver</option>
                </select>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="name"
                  value={newUserData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  name="email"
                  value={newUserData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  name="joinDate"
                  value={newUserData.joinDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseAddModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  onClick={handleAddUser}
                  style={{ backgroundColor: "#F95918" }}
                >
                  Add User
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
