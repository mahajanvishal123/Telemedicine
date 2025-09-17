import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_URL from '../../Baseurl/Baseurl';

const AssignCaregiver = () => {
  // Modal states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Form state
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [currentAssignment, setCurrentAssignment] = useState({
    id: '',
    patientId: '',
    caregiverId: '',
    assignStartDate: '',
    assignEndDate: '',
    createdAt: ''
  });

  // Selected assignment for view modal
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // State for data fetching
  const [assignments, setAssignments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL

  // Fetch all data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch assignments
        const assignmentResponse = await axios.get(`${API_URL}/caregiver/assignCaregiver`);
        setAssignments(assignmentResponse.data.assignments || []);
        
        // Fetch patients
        const patientResponse = await axios.get(`${API_URL}/patient`);
        setPatients(patientResponse.data.patients || []);
        
        // Fetch caregivers
        const caregiverResponse = await axios.get(`${API_URL}/caregiver`);
        setCaregivers(caregiverResponse.data.caregivers || []);
        
      } catch (err) {
        setError('Failed to load data: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAssignment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === 'add') {
        const response = await axios.post(`${API_URL}/caregiver/assignCaregiver`, currentAssignment);
        setAssignments(prev => [...prev, response.data.assignment]);
        alert('Caregiver assigned successfully!');
      } else {
        const { id, ...updateData } = currentAssignment;
        const response = await axios.put(`${API_URL}/caregiver/assignment/${id}`, updateData);
        setAssignments(prev => prev.map(a => a.id === id ? response.data.assignment : a));
        alert('Assignment updated successfully!');
      }
      handleCloseAssignmentModal();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle Edit
  const handleEdit = (assignment) => {
    setCurrentAssignment(assignment);
    setFormMode('edit');
    setShowAssignmentModal(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await axios.delete(`${API_URL}/caregiver/assignment/${id}`);
      setAssignments(prev => prev.filter(a => a.id !== id));
      alert('Assignment deleted successfully!');
    } catch (err) {
      alert('Error deleting assignment: ' + err.message);
    }
  };

  // Handle View Details
  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  // Reset form
  const resetForm = () => {
    setCurrentAssignment({
      id: '',
      patientId: '',
      caregiverId: '',
      assignStartDate: '',
      assignEndDate: '',
      createdAt: ''
    });
    setFormMode('add');
  };

  // Open modals
  const handleOpenAssignmentModal = () => {
    resetForm();
    setShowAssignmentModal(true);
  };

  const handleCloseAssignmentModal = () => {
    setShowAssignmentModal(false);
    resetForm();
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAssignment(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get patient name by ID
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p._id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  // Get caregiver name by ID
  const getCaregiverName = (caregiverId) => {
    const caregiver = caregivers.find(c => c._id === caregiverId);
    return caregiver ? caregiver.name : 'Unknown Caregiver';
  };

  // Modal backdrop click handler
  const handleBackdropClick = () => {
    if (showAssignmentModal) handleCloseAssignmentModal();
    if (showDetailsModal) handleCloseDetailsModal();
  };

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        if (showAssignmentModal) handleCloseAssignmentModal();
        if (showDetailsModal) handleCloseDetailsModal();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showAssignmentModal, showDetailsModal]);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showAssignmentModal || showDetailsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAssignmentModal, showDetailsModal]);

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-orange" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger text-center m-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ backgroundColor: '#FFF8F0', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold" style={{ color: '#F95918' }}>
            <i className="fas fa-user-nurse me-2"></i> Caregiver Assignments
          </h2>
          <motion.button
            className="btn text-white"
            style={{
              backgroundColor: '#F95918',
              borderRadius: '12px',
              padding: '10px 20px',
              boxShadow: '0 4px 6px rgba(249, 89, 24, 0.2)'
            }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: '#e04a0f',
              boxShadow: '0 6px 8px rgba(249, 89, 24, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAssignmentModal}
          >
            <i className="fas fa-plus me-2"></i> Add New Assignment
          </motion.button>
        </div>

        {/* Assignments Table */}
        <motion.div 
          className="card border-0 shadow-sm rounded-4 overflow-hidden"
          style={{ backgroundColor: '#ffffff' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light" style={{ borderBottom: '2px solid #F95918' }}>
                  <tr>
                    <th className="py-3 px-4 text-uppercase fw-bold" style={{ color: '#F95918', fontSize: '0.85rem' }}>Assignment ID</th>
                    <th className="py-3 px-4 text-uppercase fw-bold" style={{ color: '#F95918', fontSize: '0.85rem' }}>Patient</th>
                    <th className="py-3 px-4 text-uppercase fw-bold" style={{ color: '#F95918', fontSize: '0.85rem' }}>Caregiver</th>
                    <th className="py-3 px-4 text-uppercase fw-bold" style={{ color: '#F95918', fontSize: '0.85rem' }}>Start Date</th>
                    <th className="py-3 px-4 text-uppercase fw-bold" style={{ color: '#F95918', fontSize: '0.85rem' }}>End Date</th>
                    <th className="py-3 px-4 text-center text-uppercase fw-bold" style={{ color: '#F95918', fontSize: '0.85rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        <i className="fas fa-user-nurse fa-2x mb-2"></i>
                        <p>No assignments found.</p>
                      </td>
                    </tr>
                  ) : (
                    assignments.map((assignment) => (
                      <motion.tr 
                        key={assignment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ backgroundColor: '#FFF0E6' }}
                        style={{ borderBottom: '1px solid #f0f0f0' }}
                      >
                        <td className="py-3 px-4">#{assignment.id?.slice(-6)}</td>
                        <td className="py-3 px-4">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" 
                                 style={{ width: '32px', height: '32px' }}>
                              <i className="fas fa-user text-muted"></i>
                            </div>
                            {getPatientName(assignment.patientId)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" 
                                 style={{ width: '32px', height: '32px' }}>
                              <i className="fas fa-user-nurse text-muted"></i>
                            </div>
                            {getCaregiverName(assignment.caregiverId)}
                          </div>
                        </td>
                        <td className="py-3 px-4">{formatDate(assignment.assignStartDate)}</td>
                        <td className="py-3 px-4">{formatDate(assignment.assignEndDate)}</td>
                        <td className="py-3 px-4">
                          <div className="d-flex justify-content-center gap-2">
                            <motion.button
                              className="btn btn-sm btn-outline-info rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '36px', height: '36px', border: '1px solid #0dcaf0' }}
                              whileHover={{ 
                                scale: 1.1,
                                backgroundColor: '#0dcaf0',
                                color: 'white'
                              }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleViewDetails(assignment)}
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </motion.button>
                            <motion.button
                              className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                              style={{ 
                                width: '36px', 
                                height: '36px',
                                backgroundColor: '#F95918',
                                color: 'white',
                                border: 'none'
                              }}
                              whileHover={{ 
                                scale: 1.1,
                                backgroundColor: '#e04a0f'
                              }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(assignment)}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </motion.button>
                            <motion.button
                              className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '36px', height: '36px', border: '1px solid #dc3545' }}
                              whileHover={{ 
                                scale: 1.1,
                                backgroundColor: '#dc3545',
                                color: 'white'
                              }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(assignment.id)}
                              title="Delete"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Common Backdrop */}
      {(showAssignmentModal || showDetailsModal) && (
        <div 
          className="modal-backdrop fade show" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.75)',
            zIndex: 1040,
            backdropFilter: 'blur(5px)'
          }}
          onClick={handleBackdropClick}
        />
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <motion.div
          className="modal fade show d-block"
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header py-3 d-flex justify-content-between align-items-center" style={{ 
                backgroundColor: '#F95918',
                color: 'white',
                borderRadius: '16px 16px 0 0'
              }}>
                <h5 className="modal-title mb-0 fw-bold">
                  {formMode === 'add' ? 'Add New Caregiver Assignment' : 'Edit Assignment'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseAssignmentModal}
                ></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3" style={{ color: '#F95918', borderBottom: '1px solid #F95918', paddingBottom: '8px' }}>
                      Assignment Information
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold" style={{ color: '#333' }}>Patient</label>
                        <select
                          className="form-select"
                          name="patientId"
                          value={currentAssignment.patientId}
                          onChange={handleInputChange}
                          required
                          style={{ 
                            borderColor: '#ddd',
                            borderWidth: '1px',
                            borderRadius: '8px',
                            padding: '12px',
                            backgroundColor: '#fff',
                            color: '#333'
                          }}
                        >
                          <option value="">Select a patient</option>
                          {patients.map(patient => (
                            <option key={patient._id} value={patient._id}>
                              {patient.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold" style={{ color: '#333' }}>Caregiver</label>
                        <select
                          className="form-select"
                          name="caregiverId"
                          value={currentAssignment.caregiverId}
                          onChange={handleInputChange}
                          required
                          style={{ 
                            borderColor: '#ddd',
                            borderWidth: '1px',
                            borderRadius: '8px',
                            padding: '12px',
                            backgroundColor: '#fff',
                            color: '#333'
                          }}
                        >
                          <option value="">Select a caregiver</option>
                          {caregivers.map(caregiver => (
                            <option key={caregiver._id} value={caregiver._id}>
                              {caregiver.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold" style={{ color: '#333' }}>Start Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="assignStartDate"
                          value={currentAssignment.assignStartDate}
                          onChange={handleInputChange}
                          required
                          style={{ 
                            borderColor: '#ddd',
                            borderWidth: '1px',
                            borderRadius: '8px',
                            padding: '12px',
                            backgroundColor: '#fff',
                            color: '#333'
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold" style={{ color: '#333' }}>End Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="assignEndDate"
                          value={currentAssignment.assignEndDate}
                          onChange={handleInputChange}
                          required
                          style={{ 
                            borderColor: '#ddd',
                            borderWidth: '1px',
                            borderRadius: '8px',
                            padding: '12px',
                            backgroundColor: '#fff',
                            color: '#333'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end gap-3 mt-4">
                    <motion.button
                      type="button"
                      className="btn px-4 py-2"
                      style={{
                        backgroundColor: '#e9ecef',
                        color: '#495057',
                        borderRadius: '8px',
                        fontWeight: '500'
                      }}
                      whileHover={{ 
                        scale: 1.03,
                        backgroundColor: '#dee2e6'
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCloseAssignmentModal}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="btn px-4 py-2 text-white"
                      style={{
                        backgroundColor: '#F95918',
                        borderRadius: '8px',
                        fontWeight: '500'
                      }}
                      whileHover={{ 
                        scale: 1.03,
                        backgroundColor: '#e04a0f'
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <i className={`fas ${formMode === 'add' ? 'fa-plus' : 'fa-save'} me-2`}></i>
                      {formMode === 'add' ? 'Assign Caregiver' : 'Update Assignment'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <motion.div
          className="modal fade show d-block"
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header py-3 d-flex justify-content-between align-items-center" style={{ 
                backgroundColor: '#F95918',
                color: 'white',
                borderRadius: '16px 16px 0 0'
              }}>
                <h5 className="modal-title mb-0 fw-bold">Assignment Details</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseDetailsModal}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#F95918', borderBottom: '1px solid #F95918', paddingBottom: '8px' }}>
                    Assignment Information
                  </h6>
                  <div className="p-4 rounded-3" style={{ 
                    backgroundColor: '#FFF0E6',
                    border: '1px solid #F95918',
                    boxShadow: '0 2px 4px rgba(249, 89, 24, 0.1)'
                  }}>
                    <div className="row mb-3">
                      <div className="col-5 fw-bold" style={{ color: '#333' }}>Assignment ID:</div>
                      <div className="col-7" style={{ color: '#333', fontWeight: '500' }}>{selectedAssignment.id}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-5 fw-bold" style={{ color: '#333' }}>Patient:</div>
                      <div className="col-7" style={{ color: '#333', fontWeight: '500' }}>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" 
                               style={{ width: '28px', height: '28px' }}>
                            <i className="fas fa-user text-muted"></i>
                          </div>
                          {getPatientName(selectedAssignment.patientId)}
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-5 fw-bold" style={{ color: '#333' }}>Caregiver:</div>
                      <div className="col-7" style={{ color: '#333', fontWeight: '500' }}>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" 
                               style={{ width: '28px', height: '28px' }}>
                            <i className="fas fa-user-nurse text-muted"></i>
                          </div>
                          {getCaregiverName(selectedAssignment.caregiverId)}
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-5 fw-bold" style={{ color: '#333' }}>Start Date:</div>
                      <div className="col-7" style={{ color: '#333', fontWeight: '500' }}>{formatDate(selectedAssignment.assignStartDate)}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-5 fw-bold" style={{ color: '#333' }}>End Date:</div>
                      <div className="col-7" style={{ color: '#333', fontWeight: '500' }}>{formatDate(selectedAssignment.assignEndDate)}</div>
                    </div>
                    <div className="row">
                      <div className="col-5 fw-bold" style={{ color: '#333' }}>Created At:</div>
                      <div className="col-7" style={{ color: '#333', fontWeight: '500' }}>{formatDate(selectedAssignment.createdAt)}</div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <motion.button
                    className="btn px-4 py-2 text-white"
                    style={{
                      backgroundColor: '#F95918',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      backgroundColor: '#e04a0f'
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCloseDetailsModal}
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AssignCaregiver;