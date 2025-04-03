import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../../../styles/dashboard/components/UserRoleChart.css';

const UserRoleChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Tenant', 'Landlord', 'Admin'],
        datasets: [
          {
            data: [220, 65, 10],
            backgroundColor: '#53ab08',
            barPercentage: 0.6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 220,
            ticks: {
              stepSize: 55
            },
            grid: {
              color: '#E0E0E0',
              drawBorder: false
            }
          },
          x: {
            grid: {
              display: false
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
      <h2>Số lượng người dùng </h2>
      <canvas ref={chartRef} className="chart-canvas"></canvas>
    </div>
  );
};

export default UserRoleChart;