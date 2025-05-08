import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../../../styles/dashboard/components/UserRoleChart.css';

const UserRoleChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [userData, setUserData] = useState({
    totalUsers: 0,
    byRole: {
      tenant: 0,
      landlord: 0,
      admin: 0
    },
    byStatus: {
      active: 0,
      inactive: 0
    },
    trends: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:5000/api/user-stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user role data', err);
        setError('Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (loading || !chartRef.current) {
      return;
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) {
      console.error('Không thể tạo context 2D từ canvas');
      return;
    }

    const { tenant, landlord, admin } = userData.byRole;
    const dataValues = [tenant, landlord, admin];
    const total = userData.totalUsers;

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Người thuê', 'Chủ nhà', 'Quản trị viên'],
        datasets: [
          {
            data: dataValues,
            backgroundColor: ['#4A68D9', '#E67E22', '#2ECC71'],
            borderWidth: 0,
            hoverOffset: 10,
            cutout: '75%',
            borderRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 0
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const value = tooltipItem.raw;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${tooltipItem.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [loading, userData]);

  return (
    <div className="chart-container">
      <h2>Số lượng người dùng</h2>
      
      {loading ? (
        <div className="loading-message">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="chart-content">
            <div className="chart-wrapper">
              <canvas ref={chartRef}></canvas>
              
              {/* Display total in the center of the donut */}
              <div className="chart-center-content">
                <div className="chart-center-total">{userData.totalUsers}</div>
                <div className="chart-center-label">Tổng số</div>
              </div>
            </div>
            
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color legend-color-tenant"></span>
                <span>Người thuê ({userData.byRole.tenant})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color legend-color-landlord"></span>
                <span>Chủ nhà ({userData.byRole.landlord})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color legend-color-admin"></span>
                <span>Quản trị viên ({userData.byRole.admin})</span>
              </div>
            </div>
          </div>

          {/* User Status Section */}
          <div className="status-section">
            <h3>Trạng thái người dùng:</h3>
            <div className="status-stats">
              <div className="status-item">
                <div className="status-value status-value-active">
                  {userData.byStatus.active}
                </div>
                <div>Hoạt động</div>
              </div>
              <div className="status-item">
                <div className="status-value status-value-inactive">
                  {userData.byStatus.inactive}
                </div>
                <div>Không hoạt động</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserRoleChart;