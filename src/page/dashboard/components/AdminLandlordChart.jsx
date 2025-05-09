import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../../../styles/dashboard/components/AdminLandlordChart.css';

const AdminLandlordChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
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
            backgroundColor: '#4A68D9',
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
      <h2 className="chart-title">Tổng số lượng giao dịch</h2>
      <div className="chart-wrapper">
        <canvas ref={chartRef} className="chart-canvas"></canvas>
      </div>
    </div>
  );
};

export default AdminLandlordChart;