import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import '../../../styles/dashboard/components/MonthlyTransactionChart.css';

const MonthlyTransactionChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
        }

        // Fetch all transactions with pagination
        let allTransactions = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore) {
          const response = await fetch(`http://localhost:5000/api/payment/transactions?page=${page}&limit=100`, {
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
          allTransactions = [...allTransactions, ...data.transactions];
          
          // Check if there are more pages
          const totalPages = Math.ceil(data.pagination.total / 100);
          hasMore = page < totalPages;
          page++;
        }

        // Filter only completed transactions
        const completedTransactions = allTransactions.filter(transaction => 
          transaction.status === 'COMPLETED'
        );

        setTransactionData(completedTransactions);
    
        // Extract available years from completed transactions
        const years = [...new Set(completedTransactions.map(item => 
          new Date(item.createdAt).getFullYear()
        ))].sort((a, b) => b - a);
        
        if (years.length === 0) {
          years.push(new Date().getFullYear());
        }
        
        setAvailableYears(years);
      
        if (years.length > 0 && !years.includes(selectedYear)) {
          setSelectedYear(years[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [selectedYear]);
 
  const getMonthlyRevenueData = () => {
    if (!transactionData || transactionData.length === 0) return Array(12).fill(0);

    const monthlyData = Array(12).fill(0);
 
    transactionData.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
      
      if (year === selectedYear) {
        monthlyData[month] += transaction.amount || 0;
      }
    });

    return monthlyData;
  };

  useEffect(() => {
    if (!chartRef.current || loading || error) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(65, 105, 225, 0.6)');
    gradient.addColorStop(1, 'rgba(65, 105, 225, 0.1)');

    const dataValues = getMonthlyRevenueData();
    const maxValue = Math.max(...dataValues, 1);
    const yMax = maxValue + (maxValue * 0.1); 

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
            pointRadius: 0,
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
              font: {
                size: 11
              },
              callback: function(value) {
                return value.toLocaleString();
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
  }, [transactionData, selectedYear, loading, error]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const getTotalAnnualRevenue = () => {
    const monthlyData = getMonthlyRevenueData();
    return monthlyData.reduce((sum, amount) => sum + amount, 0);
  };

  const getCurrentMonthRevenue = () => {
    if (!transactionData || transactionData.length === 0) return 0;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactionData
      .filter(transaction => {
        const date = new Date(transaction.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
  };

  if (loading) {
    return (
      <div className="chart-container-mtc">
        <div className="chart-header-mtc">
          <h3 className="chart-title-mtc">Doanh thu</h3>
        </div>
        <div className="chart-wrapper-mtc">
          <div className="loading-container">
            Đang tải dữ liệu...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container-mtc">
        <div className="chart-header-mtc">
          <h3 className="chart-title-mtc">Doanh thu</h3>
        </div>
        <div className="chart-wrapper-mtc">
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

      <div className="chart-footer-mtc">
        <span className="total-revenue-mtc">
          <strong>Tổng doanh thu năm {selectedYear}:</strong> {getTotalAnnualRevenue().toLocaleString()} VNĐ
        </span>
        <span className="current-month-revenue">
          | <strong>Tháng hiện tại:</strong> {getCurrentMonthRevenue().toLocaleString()} VNĐ
        </span>
      </div>
    </div>
  );
};

export default MonthlyTransactionChart;