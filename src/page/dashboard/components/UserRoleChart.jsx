import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../../../styles/dashboard/components/UserRoleChart.css';

const UserRoleChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [userData, setUserData] = useState({
    Tenant: 0,
    Landlord: 0,
    Admin: 0,
    Total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:5000/api/users/count-by-role', {
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
        setUserData(data.data);
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

    const dataValues = [userData.Tenant, userData.Landlord, userData.Admin];
    const total = dataValues.reduce((acc, val) => acc + val, 0);

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
            cutout: '80%'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Số lượng người dùng</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'red', padding: '20px' }}>{error}</div>
      ) : (
        <>
          <div className="chart-wrapper" style={{
            position: 'relative',
            height: '200px',
            width: '200px',
            marginTop: '25px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <canvas ref={chartRef} style={{ width: '100%', height: '100%' }}></canvas>
            
            {/* Display total in the center of the donut */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{userData.Total}</div>
              <div style={{ fontSize: '14px' }}>Tổng số</div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '50px',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                display: 'inline-block',
                width: '15px',
                height: '15px',
                backgroundColor: '#4A68D9',
                marginRight: '5px'
              }}></span>
              <span>Người thuê ({userData.Tenant})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                display: 'inline-block',
                width: '15px',
                height: '15px',
                backgroundColor: '#E67E22',
                marginRight: '5px'
              }}></span>
              <span>Chủ nhà ({userData.Landlord})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                display: 'inline-block',
                width: '15px',
                height: '15px',
                backgroundColor: '#2ECC71',
                marginRight: '5px'
              }}></span>
              <span>Quản trị viên ({userData.Admin})</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserRoleChart;