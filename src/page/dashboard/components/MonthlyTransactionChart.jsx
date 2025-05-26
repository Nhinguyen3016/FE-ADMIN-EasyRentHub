import React, { useEffect, useRef, useState, useCallback } from 'react';
import Chart from 'chart.js/auto';
import '../../../styles/dashboard/components/MonthlyTransactionChart.css';

const MonthlyTransactionChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [availableYears, setAvailableYears] = useState([]);
  const [viewType, setViewType] = useState('yearly'); 

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


        const completedTransactions = allTransactions.filter(transaction => 
          transaction.status === 'COMPLETED'
        );

        setTransactionData(completedTransactions);
   
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

  const getDaysInMonth = useCallback((month, year) => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
      return 29; 
    }
    return daysInMonth[month - 1];
  }, []);

  const getMonthlyRevenueData = useCallback(() => {
    if (!transactionData || transactionData.length === 0) return Array(12).fill(0);

    const monthlyData = Array(12).fill(0);
 
    transactionData.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth(); 
      
      if (year === selectedYear) {
        monthlyData[month] += transaction.amount || 0;
      }
    });

    return monthlyData;
  }, [transactionData, selectedYear]);

  const getDailyRevenueData = useCallback(() => {
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
      
      if (year === selectedYear && month === selectedMonth) {
        dailyData[day - 1] += transaction.amount || 0;
      }
    });

    return dailyData;
  }, [transactionData, selectedYear, selectedMonth, getDaysInMonth]);


  const getMaxRevenue = useCallback(() => {
    if (!transactionData || transactionData.length === 0) return 1;

    let maxRevenue = 0;
    
    if (viewType === 'monthly') {
    
      for (let year of availableYears) {
        for (let month = 1; month <= 12; month++) {
          const monthData = Array(getDaysInMonth(month, year)).fill(0);
          
          transactionData.forEach(transaction => {
            const date = new Date(transaction.createdAt);
            const txYear = date.getFullYear();
            const txMonth = date.getMonth() + 1;
            const day = date.getDate();
            
            if (txYear === year && txMonth === month) {
              monthData[day - 1] += transaction.amount || 0;
            }
          });
          
          const monthTotal = monthData.reduce((sum, amount) => sum + amount, 0);
          maxRevenue = Math.max(maxRevenue, monthTotal);
        }
      }
    } else {
 
      for (let year of availableYears) {
        const yearData = Array(12).fill(0);
        
        transactionData.forEach(transaction => {
          const date = new Date(transaction.createdAt);
          const txYear = date.getFullYear();
          const month = date.getMonth();
          
          if (txYear === year) {
            yearData[month] += transaction.amount || 0;
          }
        });
        
        const yearTotal = yearData.reduce((sum, amount) => sum + amount, 0);
        maxRevenue = Math.max(maxRevenue, yearTotal);
      }
    }
    
    return maxRevenue || 1; 
  }, [transactionData, viewType, availableYears, getDaysInMonth]);

  const getGrowthRate = useCallback(() => {
    if (!transactionData || transactionData.length === 0) return 0;

    const maxRevenue = getMaxRevenue();

    if (viewType === 'monthly') {
      const currentMonthData = getDailyRevenueData();
      const currentTotal = currentMonthData.reduce((sum, amount) => sum + amount, 0);
      
      const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
      const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
      
      const prevMonthData = Array(getDaysInMonth(prevMonth, prevYear)).fill(0);
      
      transactionData.forEach(transaction => {
        const date = new Date(transaction.createdAt);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        if (year === prevYear && month === prevMonth) {
          prevMonthData[day - 1] += transaction.amount || 0;
        }
      });
      
      const prevTotal = prevMonthData.reduce((sum, amount) => sum + amount, 0);
   
      const currentPercent = (currentTotal / maxRevenue) * 100;
      const prevPercent = (prevTotal / maxRevenue) * 100;
      const growthOnScale = currentPercent - prevPercent;
      
      return Math.round(growthOnScale * 10) / 10;
    } else {
      const currentYearData = getMonthlyRevenueData();
      const currentTotal = currentYearData.reduce((sum, amount) => sum + amount, 0);
      
      const prevYearData = Array(12).fill(0);
      
      transactionData.forEach(transaction => {
        const date = new Date(transaction.createdAt);
        const year = date.getFullYear();
        const month = date.getMonth();
        
        if (year === selectedYear - 1) {
          prevYearData[month] += transaction.amount || 0;
        }
      });
      
      const prevTotal = prevYearData.reduce((sum, amount) => sum + amount, 0);
      
    
      const currentPercent = (currentTotal / maxRevenue) * 100;
      const prevPercent = (prevTotal / maxRevenue) * 100;
      const growthOnScale = currentPercent - prevPercent;
      
      return Math.round(growthOnScale * 10) / 10;
    }
  }, [transactionData, viewType, selectedMonth, selectedYear, getDaysInMonth, getDailyRevenueData, getMonthlyRevenueData, getMaxRevenue]);

  useEffect(() => {
    if (!chartRef.current || loading || error) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(65, 105, 225, 0.6)');
    gradient.addColorStop(1, 'rgba(65, 105, 225, 0.1)');

    let chartLabels, chartData;
    
    if (viewType === 'monthly') {
      const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
      chartLabels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}`);
      chartData = getDailyRevenueData();
    } else {
      chartLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      chartData = getMonthlyRevenueData();
    }

    const dataValues = chartData;
    const maxValue = Math.max(...dataValues, 1);
    const yMax = maxValue + (maxValue * 0.1); 

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
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
              },
              maxRotation: 0,
              minRotation: 0
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
  }, [transactionData, selectedYear, selectedMonth, viewType, loading, error, getDailyRevenueData, getMonthlyRevenueData, getDaysInMonth]);


  const getTotalRevenueAllTime = useCallback(() => {
    if (!transactionData || transactionData.length === 0) return 0;
    return transactionData.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
  }, [transactionData]);

  const getSelectedPeriodRevenue = useCallback(() => {
    if (!transactionData || transactionData.length === 0) return 0;
    
    if (viewType === 'monthly') {
      return transactionData
        .filter(transaction => {
          const date = new Date(transaction.createdAt);
          return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
        })
        .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
    } else {
      return transactionData
        .filter(transaction => {
          const date = new Date(transaction.createdAt);
          return date.getFullYear() === selectedYear;
        })
        .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
    }
  }, [transactionData, viewType, selectedMonth, selectedYear]);

  const formatGrowthRate = useCallback((rate) => {
    if (rate === 0) return '0%';
    if (rate > 0) return `+${rate}%`;
    return `${rate}%`;
  }, []);

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

  const growthRate = getGrowthRate();

  return (
    <div className="chart-container-mtc">
      {/* Header with title and filters */}
      <div className="chart-header-mtc">
        <h3 className="chart-title-mtc">Doanh thu</h3>
        
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

      <div className="chart-wrapper-mtc">
        <canvas ref={chartRef}></canvas>
      </div>

      <div className="chart-footer-mtc">
        <div className="summary-item">
          <span className="total-revenue-mtc">
            <strong>Tổng doanh thu:</strong> {getTotalRevenueAllTime().toLocaleString()} VNĐ
          </span>
        </div>
        <div className="summary-item">
          <span className="selected-period-revenue">
            | <strong>Tổng doanh thu của {viewType === 'monthly' ? `tháng ${selectedMonth}` : 'năm'} {selectedYear}:</strong> {getSelectedPeriodRevenue().toLocaleString()} VNĐ
          </span>
        </div>
        <div className="summary-item">
          <span className="growth-rate">
            | <strong>So với {viewType === 'monthly' ? 'tháng trước' : 'năm trước'}:</strong> 
            <span className={`growth-value ${growthRate >= 0 ? 'positive' : 'negative'}`}>
              {formatGrowthRate(growthRate)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTransactionChart;