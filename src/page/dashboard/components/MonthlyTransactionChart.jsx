import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../../../styles/dashboard/components/MonthlyTransactionChart.css';

const MonthlyTransactionChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Dữ liệu của trục Y
    const dataValues = [50, 65, 62, 80, 200, 85, 95, 100, 90, 155, 110, 25];

    // Tìm giá trị lớn nhất trong dataset
    const maxValue = Math.max(...dataValues);

    // Xác định max Y bằng cách cộng thêm 20 vào giá trị lớn nhất
    const yMax = maxValue + 20;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
          {
            data: dataValues,
            borderColor: '#4169E1',
            backgroundColor: 'rgba(65, 105, 225, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 0
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
            min: 0,
            max: yMax, // Áp dụng max Y động hơn max số lượng 20 đơn vị
            ticks: {
              stepSize: yMax / 5 // Chia trục Y thành 5 khoảng bằng nhau
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
    <canvas ref={chartRef} className="chart-canvas"></canvas>
  );
};

export default MonthlyTransactionChart;