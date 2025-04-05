import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MonthlyTransactionChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Tạo hiệu ứng màu gradient từ đường xuống dưới
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(65, 105, 225, 0.6)'); // Màu đậm phía trên
    gradient.addColorStop(1, 'rgba(65, 105, 225, 0)'); // Trong suốt phía dưới

    const dataValues = [50, 65, 62, 80, 200, 85, 95, 100, 90, 155, 110, 25];
    const maxValue = Math.max(...dataValues);
    const yMax = maxValue + 20;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
          {
            label: 'Số tiền giao dịch',
            data: dataValues,
            borderColor: '#4169E1',
            backgroundColor: gradient, // Hiệu ứng màu
            tension: 0.4,
            fill: true, // Kích hoạt fill
            pointRadius: 0, // Ẩn chấm trên đường
            pointHoverRadius: 7, // Chỉ hiện chấm khi hover
            pointBackgroundColor: '#4169E1', // Màu của chấm khi hover
            pointHoverBorderColor: '#4169E1',
            hoverBorderWidth: 3
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
            enabled: true, // Bật tooltip
            intersect: false, // Giúp tooltip dễ hiển thị hơn
            mode: 'index', // Tooltip hiển thị ở điểm gần nhất
            callbacks: {
              label: function (tooltipItem) {
                const value = tooltipItem.raw;
                return `Số tiền: ${value.toLocaleString()} VNĐ`;
              }
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: yMax, 
            ticks: {
              stepSize: yMax / 5 
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
        },
        hover: {
          mode: 'nearest',
          intersect: false
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
    <div style={{ width: '100%', height: '300px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MonthlyTransactionChart;
