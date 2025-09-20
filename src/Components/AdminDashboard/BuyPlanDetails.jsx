import React, { useState } from 'react';

const BuyPlanDetails = () => {
  // Sample data - replace with your actual data source
  const [planData, setPlanData] = useState([
    {
      fullName: "John Smith",
      email: "john.smith@example.com",
      place: "New York",
      planType: "Premium",
      status: "Pending"
    },
    {
      fullName: "Sarah Johnson",
      email: "sarah.j@example.com",
      place: "Los Angeles",
      planType: "Basic",
      status: "Approved"
    },
    {
      fullName: "Michael Chen",
      email: "m.chen@example.com",
      place: "San Francisco",
      planType: "Enterprise",
      status: "Rejected"
    },
    {
      fullName: "Emma Williams",
      email: "emma.w@example.com",
      place: "Chicago",
      planType: "Premium",
      status: "Pending"
    }
  ]);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  // State for filtering
  const [filter, setFilter] = useState('');

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to get sorted data
  const getSortedData = () => {
    const sortableData = [...planData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  // Function to handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Function to get filtered data
  const getFilteredData = () => {
    const sortedData = getSortedData();
    if (!filter) return sortedData;
    
    return sortedData.filter(item => 
      item.fullName.toLowerCase().includes(filter.toLowerCase()) ||
      item.email.toLowerCase().includes(filter.toLowerCase()) ||
      item.place.toLowerCase().includes(filter.toLowerCase()) ||
      item.planType.toLowerCase().includes(filter.toLowerCase()) ||
      item.status.toLowerCase().includes(filter.toLowerCase())
    );
  };

  // Function to export data as CSV
  const exportToCSV = () => {
    const headers = ["Full Name", "Email", "Place", "Plan Type", "Status"];
    const csvContent = [
      headers.join(','),
      ...getFilteredData().map(item => 
        [item.fullName, item.email, item.place, item.planType, item.status].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'plan_purchase_details.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to get badge style based on plan type
  const getBadgeStyle = (planType) => {
    const baseStyle = {
      padding: '6px 12px',
      borderRadius: '20px',
      fontWeight: '600',
      fontSize: '0.85rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };

    switch(planType) {
      case 'Premium':
        return {
          ...baseStyle,
          backgroundColor: '#f9591a',
          color: 'white',
          boxShadow: '0 2px 4px rgba(249, 89, 26, 0.3)'
        };
      case 'Enterprise':
        return {
          ...baseStyle,
          backgroundColor: '#4a148c',
          color: 'white',
          boxShadow: '0 2px 4px rgba(74, 20, 140, 0.3)'
        };
      case 'Basic':
        return {
          ...baseStyle,
          backgroundColor: '#e3f2fd',
          color: '#0d47a1',
          boxShadow: '0 2px 4px rgba(13, 71, 161, 0.2)'
        };
      default:
        return baseStyle;
    }
  };

  // Function to get status badge style
  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      padding: '4px 10px',
      borderRadius: '12px',
      fontWeight: '500',
      fontSize: '0.8rem',
      textTransform: 'capitalize',
      letterSpacing: '0.5px'
    };

    switch(status) {
      case 'Approved':
        return {
          ...baseStyle,
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          border: '1px solid #a5d6a7'
        };
      case 'Rejected':
        return {
          ...baseStyle,
          backgroundColor: '#ffebee',
          color: '#c62828',
          border: '1px solid #ef9a9a'
        };
      case 'Pending':
        return {
          ...baseStyle,
          backgroundColor: '#fff8e1',
          color: '#ff8f00',
          border: '1px solid #ffe082'
        };
      default:
        return baseStyle;
    }
  };

  // Function to get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Function to handle status change
  const handleStatusChange = (index, newStatus) => {
    const updatedData = [...planData];
    updatedData[index].status = newStatus;
    setPlanData(updatedData);
  };

  // Get filtered and sorted data
  const filteredData = getFilteredData();

  return (
    <div className="container mt-5">
      <div className="card shadow-lg" style={{ border: 'none', borderRadius: '15px', overflow: 'hidden' }}>
        <div className="card-header text-black py-3" style={{ borderRadius: '15px 15px 0 0' }}>
          <h2 className="mb-0 fw-bold">Plan Purchase Details</h2>
          <p className="mb-0 mt-1 opacity-75">Overview of all purchased plans</p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="p-3 border-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, email, place, plan type or status..."
                  value={filter}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="col-md-6 text-end mt-3 mt-md-0">
              <button 
                className="btn btn-sm me-2" 
                style={{ backgroundColor: '#f9591a', color: 'white', border: 'none', fontWeight: '500' }}
                onClick={exportToCSV}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download me-1" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
                Export CSV
              </button>
              <button 
                className="btn btn-sm" 
                style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', fontWeight: '500' }}
                onClick={() => setFilter('')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise me-1" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
                Reset
              </button>
            </div>
          </div>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th 
                    scope="col" 
                    className="py-3 px-4 clickable-header" 
                    style={{ color: '#495057', fontWeight: '600', borderBottom: '2px solid #dee2e6', cursor: 'pointer' }}
                    onClick={() => handleSort('fullName')}
                  >
                    Full Name{getSortIndicator('fullName')}
                  </th>
                  <th 
                    scope="col" 
                    className="py-3 px-4 clickable-header" 
                    style={{ color: '#495057', fontWeight: '600', borderBottom: '2px solid #dee2e6', cursor: 'pointer' }}
                    onClick={() => handleSort('email')}
                  >
                    Email{getSortIndicator('email')}
                  </th>
                  <th 
                    scope="col" 
                    className="py-3 px-4 clickable-header" 
                    style={{ color: '#495057', fontWeight: '600', borderBottom: '2px solid #dee2e6', cursor: 'pointer' }}
                    onClick={() => handleSort('place')}
                  >
                    Place / City{getSortIndicator('place')}
                  </th>
                  <th 
                    scope="col" 
                    className="py-3 px-4 clickable-header" 
                    style={{ color: '#495057', fontWeight: '600', borderBottom: '2px solid #dee2e6', cursor: 'pointer' }}
                    onClick={() => handleSort('planType')}
                  >
                    Plan Type{getSortIndicator('planType')}
                  </th>
                  <th 
                    scope="col" 
                    className="py-3 px-4 clickable-header" 
                    style={{ color: '#495057', fontWeight: '600', borderBottom: '2px solid #dee2e6', cursor: 'pointer' }}
                    onClick={() => handleSort('status')}
                  >
                    Status{getSortIndicator('status')}
                  </th>
                  <th 
                    scope="col" 
                    className="py-3 px-4" 
                    style={{ color: '#495057', fontWeight: '600', borderBottom: '2px solid #dee2e6' }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((plan, index) => (
                    <tr 
                      key={index} 
                      className={index % 2 === 0 ? 'bg-white' : 'bg-light'} 
                      style={{ transition: 'all 0.2s' }}
                    >
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                            <span className="fw-bold text-primary">{plan.fullName.charAt(0)}</span>
                          </div>
                          <span className="fw-medium">{plan.fullName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope me-2 text-muted" viewBox="0 0 16 16">
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
                          </svg>
                          <span>{plan.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt me-2 text-muted" viewBox="0 0 16 16">
                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                          </svg>
                          <span>{plan.place}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span style={getBadgeStyle(plan.planType)}>
                          {plan.planType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span style={getStatusBadgeStyle(plan.status)}>
                          {plan.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleStatusChange(index, 'Approved')}
                            disabled={plan.status === 'Approved'}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleStatusChange(index, 'Rejected')}
                            disabled={plan.status === 'Rejected'}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-circle mb-2" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                        </svg>
                        <p className="mb-0">No records found matching your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-light py-3 px-4">
          <span className="text-muted">Showing {filteredData.length} of {planData.length} records</span>
        </div>
      </div>
    </div>
  );
};

export default BuyPlanDetails;