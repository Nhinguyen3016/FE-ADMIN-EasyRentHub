import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import '../../../styles/dashboard/components/AdminLandlordChart.css';

const AdminLandlordChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
        }
        
        const response = await fetch('http://localhost:5000/api/payment/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
          } else if (response.status === 403) {
            throw new Error('Bạn không có quyền truy cập dữ liệu này.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        
        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!chartRef.current || !dashboardData || loading) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    
    const chartLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const chartData = [];
    for (let i = 0; i < 12; i++) {
      chartData.push(0);
    }
    
  
    const currentMonth = new Date().getMonth(); 
    const totalTransactions = dashboardData.transactions?.total || 0;
    
    if (totalTransactions > 0) {
      chartData[currentMonth] = totalTransactions;
    }
    
  

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          {
            data: chartData,
            backgroundColor: '#4A68D9',
            borderRadius: 4,
            barPercentage: 0.7, 
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
              label: function(context) {
                return `${context.parsed.y} giao dịch`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...chartData) + 10 || 50, 
            ticks: {
              stepSize: Math.ceil(Math.max(...chartData) / 5) || 10,
              callback: function(value) {
                return value; 
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
  }, [dashboardData, loading, selectedYear]); 

  const getChartDataForSummary = () => {
    if (!dashboardData) return [];
    
    const chartData = Array(12).fill(0);
    const currentMonth = new Date().getMonth();
    const totalTransactions = dashboardData.transactions?.total || 0;
    
    if (totalTransactions > 0) {
      chartData[currentMonth] = totalTransactions;
    }
    
    return chartData;
  };

  if (loading) {
    return (
      <div className="chart-container">
        <h2 className="chart-title">Tổng số lượng giao dịch theo tháng</h2>
        <div className="chart-wrapper">
          <div className="loading-container">
            Đang tải dữ liệu...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <h2 className="chart-title">Tổng số lượng giao dịch theo tháng</h2>
        <div className="chart-wrapper">
          <div className="error-container">
            <div>
              <p>Lỗi khi tải dữ liệu</p>
              <p className="error-message">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const summaryChartData = getChartDataForSummary();

  return (
    <div className="chart-container">
      {/* Header with title and year filter */}
      <div className="chart-header">
        <h2 className="chart-title">Tổng số lượng giao dịch theo tháng</h2>
        
        {/* Bộ lọc năm - căn phải */}
        {dashboardData && (
          <div className="year-filter-container">
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="year-filter-select"
            >
              {(() => {
                const dailyRevenue = dashboardData.charts?.dailyRevenue || [];
                const availableYears = [...new Set(dailyRevenue.map(item => new Date(item._id).getFullYear()))].sort((a, b) => b - a);
               
                if (availableYears.length === 0) {
                  return <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>;
                }
                
                return availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ));
              })()}
            </select>
          </div>
        )}
      </div>
      
      <div className="chart-wrapper">
        <canvas ref={chartRef} className="chart-canvas"></canvas>
      </div>
      
      {dashboardData && (
        <div className="chart-summary">
          Tổng giao dịch năm {selectedYear}: {summaryChartData.reduce((sum, count) => sum + count, 0)} | 
          Thành công: {dashboardData.transactions?.successful || 0} | 
          Tỷ lệ thành công: {dashboardData.transactions?.successRate || '0'}%
        </div>
      )}
    </div>
  );
};

export default AdminLandlordChart;