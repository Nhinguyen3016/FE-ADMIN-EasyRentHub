import React, { useEffect, useRef, useState, useCallback } from 'react';
import Chart from 'chart.js/auto';
import '../../../styles/dashboard/components/AdminLandlordChart.css';

const AdminLandlordChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [availableYears, setAvailableYears] = useState([]);
  const [viewType, setViewType] = useState('yearly'); // Mặc định hiển thị theo năm

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
        }
        
      
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
          
       
          const totalPages = Math.ceil(data.pagination.total / 100);
          hasMore = page < totalPages;
          page++;
        }
        
        setTransactionData(allTransactions);
       
        const years = [...new Set(allTransactions.map(item => 
          new Date(item.createdAt).getFullYear()
        ))].sort((a, b) => b - a);
        
        // Luôn đảm bảo năm hiện tại có trong danh sách
        const currentYear = new Date().getFullYear();
        if (!years.includes(currentYear)) {
          years.unshift(currentYear);
          years.sort((a, b) => b - a);
        }
        
        setAvailableYears(years);
        
        // Đảm bảo selectedYear luôn là năm hiện tại khi khởi tạo
        setSelectedYear(currentYear);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, []); // Chỉ chạy một lần khi component mount

  const getDaysInMonth = useCallback((month, year) => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
      return 29; // Leap year
    }
    return daysInMonth[month - 1];
  }, []);

  const getMonthlyTransactionCounts = useCallback(() => {
    if (!transactionData || transactionData.length === 0) return Array(12).fill(0);

    const monthlyData = Array(12).fill(0);
    
    transactionData.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth(); 
      
      if (year === selectedYear && transaction.status === 'COMPLETED') {
        monthlyData[month]++;
      }
    });

    return monthlyData;
  }, [transactionData, selectedYear]);

  const getDailyTransactionCounts = useCallback(() => {
    if (!transactionData || transactionData.length === 0) {
      const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
      return Array(daysInMonth).fill(0);
    }

    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const dailyData = Array(daysInMonth).fill(0);
    
    transactionData.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; 
      const day = date.getDate();
      
      if (year === selectedYear && month === selectedMonth && transaction.status === 'COMPLETED') {
        dailyData[day - 1]++;
      }
    });

    return dailyData;
  }, [transactionData, selectedYear, selectedMonth, getDaysInMonth]);


  const getMaxTransactions = useCallback(() => {
    if (!transactionData || transactionData.length === 0) return 1;

    let maxTransactions = 0;
    
    if (viewType === 'monthly') {
      
      for (let year of availableYears) {
        for (let month = 1; month <= 12; month++) {
          const monthData = Array(getDaysInMonth(month, year)).fill(0);
          
          transactionData.forEach(transaction => {
            const date = new Date(transaction.createdAt);
            const txYear = date.getFullYear();
            const txMonth = date.getMonth() + 1;
            const day = date.getDate();
            
            if (txYear === year && txMonth === month && transaction.status === 'COMPLETED') {
              monthData[day - 1]++;
            }
          });
          
          const monthTotal = monthData.reduce((sum, count) => sum + count, 0);
          maxTransactions = Math.max(maxTransactions, monthTotal);
        }
      }
    } else {
    
      for (let year of availableYears) {
        const yearData = Array(12).fill(0);
        
        transactionData.forEach(transaction => {
          const date = new Date(transaction.createdAt);
          const txYear = date.getFullYear();
          const month = date.getMonth();
          
          if (txYear === year && transaction.status === 'COMPLETED') {
            yearData[month]++;
          }
        });
        
        const yearTotal = yearData.reduce((sum, count) => sum + count, 0);
        maxTransactions = Math.max(maxTransactions, yearTotal);
      }
    }
    
    return maxTransactions || 1; 
  }, [transactionData, viewType, availableYears, getDaysInMonth]);

  const getGrowthRate = useCallback(() => {
    if (!transactionData || transactionData.length === 0) return 0;

    const maxTransactions = getMaxTransactions();
    
    if (viewType === 'monthly') {
      const currentMonthData = getDailyTransactionCounts();
      const currentTotal = currentMonthData.reduce((sum, count) => sum + count, 0);
      
      const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
      const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
      
      const prevMonthData = Array(getDaysInMonth(prevMonth, prevYear)).fill(0);
      
      transactionData.forEach(transaction => {
        const date = new Date(transaction.createdAt);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        if (year === prevYear && month === prevMonth && transaction.status === 'COMPLETED') {
          prevMonthData[day - 1]++;
        }
      });
      
      const prevTotal = prevMonthData.reduce((sum, count) => sum + count, 0);
      
     
      const currentPercent = (currentTotal / maxTransactions) * 100;
      const prevPercent = (prevTotal / maxTransactions) * 100;
      const growthOnScale = currentPercent - prevPercent;
      
      return Math.round(growthOnScale * 10) / 10; 
    } else {
      
      const currentYearData = getMonthlyTransactionCounts();
      const currentTotal = currentYearData.reduce((sum, count) => sum + count, 0);
      
      const prevYearData = Array(12).fill(0);
      
      transactionData.forEach(transaction => {
        const date = new Date(transaction.createdAt);
        const year = date.getFullYear();
        const month = date.getMonth();
        
        if (year === selectedYear - 1 && transaction.status === 'COMPLETED') {
          prevYearData[month]++;
        }
      });
      
      const prevTotal = prevYearData.reduce((sum, count) => sum + count, 0);
      
    
      const currentPercent = (currentTotal / maxTransactions) * 100;
      const prevPercent = (prevTotal / maxTransactions) * 100;
      const growthOnScale = currentPercent - prevPercent;
      
      return Math.round(growthOnScale * 10) / 10; 
    }
  }, [transactionData, viewType, selectedMonth, selectedYear, getDaysInMonth, getDailyTransactionCounts, getMonthlyTransactionCounts, getMaxTransactions]);

  useEffect(() => {
    if (!chartRef.current || !transactionData || loading) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    let chartLabels, chartData;
    
    if (viewType === 'monthly') {
      const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
      chartLabels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}`);
      chartData = getDailyTransactionCounts();
    } else {
      chartLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      chartData = getMonthlyTransactionCounts();
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
            max: (() => {
              const maxValue = Math.max(...chartData);
              if (maxValue === 0) {
                return 10; 
              }
              return maxValue + Math.ceil(maxValue * 0.2) || 10;
            })(),
            ticks: {
              stepSize: (() => {
                const maxValue = Math.max(...chartData);
                if (maxValue === 0) {
                  return 2; 
                }
                return Math.ceil(maxValue / 5) || 2;
              })(),
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
            },
            ticks: {
              maxRotation: 0, 
              minRotation: 0  
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
  }, [transactionData, loading, selectedYear, selectedMonth, viewType, getDailyTransactionCounts, getMonthlyTransactionCounts, getDaysInMonth]); 

  const getTotalTransactions = useCallback(() => {
    if (viewType === 'monthly') {
      return getDailyTransactionCounts().reduce((sum, count) => sum + count, 0);
    } else {
      return getMonthlyTransactionCounts().reduce((sum, count) => sum + count, 0);
    }
  }, [viewType, getDailyTransactionCounts, getMonthlyTransactionCounts]);

  const formatGrowthRate = useCallback((rate) => {
    if (rate === 0) return '0%';
    if (rate > 0) return `+${rate}%`;
    return `${rate}%`;
  }, []);

  if (loading) {
    return (
      <div className="chart-container">
        <h2 className="chart-title">Số lượng giao dịch thành công</h2>
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
        <h2 className="chart-title">Số lượng giao dịch thành công</h2>
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

  const growthRate = getGrowthRate();

  return (
    <div className="chart-container">
      {/* Header with title and filters */}
      <div className="chart-header">
        <h2 className="chart-title">Số lượng giao dịch thành công</h2>
        
        <div className="filter-controls">
          {/* View Type Toggle */}
          <div className="filter-group">
            <span className="filter-label">Xem theo:</span>
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${viewType === 'monthly' ? 'active' : ''}`}
                onClick={() => setViewType('monthly')}
              >
                Tháng
              </button>
              <button 
                className={`filter-tab ${viewType === 'yearly' ? 'active' : ''}`}
                onClick={() => setViewType('yearly')}
              >
                Năm
              </button>
            </div>
          </div>

          {/* Month Selection (for daily view) */}
          {viewType === 'monthly' && (
            <div className="filter-group">
              <span className="filter-label">Tháng:</span>
              <div className="select-wrapper">
                <select
                  className="custom-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {Array.from({length: 12}, (_, i) => (
                    <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Year Selection */}
          {availableYears.length > 0 && (
            <div className="filter-group">
              <span className="filter-label">Năm:</span>
              <div className="select-wrapper">
                <select
                  className="custom-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="chart-wrapper">
        <canvas ref={chartRef} className="chart-canvas"></canvas>
      </div>
      
      <div className="chart-summary">
        <div className="summary-item">
          <span>Tổng giao dịch thành công:</span>
          <span className="summary-value">{getTotalTransactions()}</span>
        </div>
        <div className="summary-item">
          <span>So với {viewType === 'monthly' ? 'tháng trước' : 'năm trước'}:</span>
          <span className={`summary-value ${growthRate >= 0 ? 'positive' : 'negative'}`}>
            {formatGrowthRate(growthRate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLandlordChart;