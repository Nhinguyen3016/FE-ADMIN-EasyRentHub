import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './AdminLandlordChart.css';

const AdminLandlordChart = () => {
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
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
          {
            data: [22, 28, 25, 32, 30, 35, 33, 38, 35, 42, 40, 45],
            backgroundColor: '#E67E22',
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
            max: 60,
            ticks: {
              stepSize: 15
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
      <h2>Tổng số lượng giao dịch giữa admin và chủ trọ</h2>
      <canvas ref={chartRef} className="chart-canvas"></canvas>
    </div>
  );
};

export default AdminLandlordChart;