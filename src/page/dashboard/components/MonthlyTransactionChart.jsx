import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import '../../../styles/dashboard/components/MonthlyTransactionChart.css';

const MonthlyTransactionChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [revenueData, setRevenueData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/revenue/monthly', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch revenue data');
        }
        
        const data = await response.json();
        setRevenueData(data.yearlyData);
        setAvailableYears(data.availableYears);
        
        if (data.availableYears?.length > 0 && !data.yearlyData[selectedYear]) {
          setSelectedYear(data.availableYears[0]);
        }
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        // Provide fallback data for development/testing
        const currentYear = new Date().getFullYear();
        const fallbackData = {
          [currentYear]: {
            monthlyRevenue: Array(12).fill().map((_, i) => ({ revenue: Math.floor(Math.random() * 100) + 20 })),
            totalAnnualRevenue: 1000
          }
        };
        setRevenueData(fallbackData);
        setAvailableYears([currentYear]);
      }
    };

    fetchRevenueData();
  }, []);

  useEffect(() => {
    if (!revenueData || !revenueData[selectedYear] || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(65, 105, 225, 0.6)');
    gradient.addColorStop(1, 'rgba(65, 105, 225, 0.1)');

    const dataValues = revenueData[selectedYear].monthlyRevenue.map(item => item.revenue);
    const maxValue = Math.max(...dataValues, 1);
    // Set y-axis max value to max revenue + 50
    const yMax = maxValue + 50;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
          {
            label: 'Doanh thu',
            data: dataValues,
            borderColor: '#4169E1',
            backgroundColor: gradient,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#4169E1',
            pointHoverBorderColor: '#4169E1',
            hoverBorderWidth: 2,
            borderWidth: 2
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
            enabled: true,
            intersect: false,
            mode: 'index',
            callbacks: {
              label: function (tooltipItem) {
                const value = tooltipItem.raw;
                return `Doanh thu: ${value.toLocaleString()} VNĐ`;
              }
            }
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: yMax,
            ticks: {
              stepSize: Math.ceil(yMax / 4),
              callback: function(value) {
                return value;
              },
              font: {
                size: 11
              }
            },
            grid: {
              color: '#E0E0E0',
              drawBorder: false
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              }
            }
          }
        },
        hover: {
          mode: 'nearest',
          intersect: false
        },
        animation: {
          duration: 800
        },
        layout: {
          padding: {
            left: 5,
            right: 5,
            top: 5,
            bottom: 5
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [revenueData, selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  return (
    <div className="chart-container-mtc">
      <div className="chart-header-mtc">
        <h3 className="chart-title-mtc">Doanh thu</h3>
        {availableYears.length > 0 && (
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            className="year-selector-mtc"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
      </div>
      
      <div className="chart-wrapper-mtc">
        <canvas ref={chartRef}></canvas>
      </div>
      
      {revenueData && revenueData[selectedYear] && (
        <div className="chart-footer-mtc">
          <span className="total-revenue-mtc">
            <strong>Tổng doanh thu:</strong> {revenueData[selectedYear].totalAnnualRevenue.toLocaleString()} VNĐ
          </span>
        </div>
      )}
    </div>
  );
};

export default MonthlyTransactionChart;