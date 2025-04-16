import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../../../styles/dashboard/components/UserRoleChart.css';

const UserRoleChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const dataValues = [220, 150, 10];
  const total = dataValues.reduce((acc, val) => acc + val, 0);

  useEffect(() => {
    if (!chartRef.current) {
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

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Người thuê', 'Chủ nhà ', ' Quản trị viên '],
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
  }, []);

  return (
    <div className="chart-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Số lượng người dùng</h2>
      <div className="chart-wrapper" style={{
        position: 'relative',
        height: '200px',
        width: '200px',
        marginTop: '25px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>

        <canvas ref={chartRef} style={{ width: '100%', height: '100%' }}></canvas>
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
          <span>Người thuê</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            display: 'inline-block',
            width: '15px',
            height: '15px',
            backgroundColor: '#E67E22',
            marginRight: '5px'
          }}></span>
          <span>Chủ nhà</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            display: 'inline-block',
            width: '15px',
            height: '15px',
            backgroundColor: '#2ECC71',
            marginRight: '5px'
          }}></span>
          <span>Quản trị viên</span>
        </div>
      </div>
    </div>
  );
};

export default UserRoleChart;
