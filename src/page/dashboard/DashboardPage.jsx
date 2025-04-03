import React from 'react';
import UserRoleChart from './components/UserRoleChart';
import AdminLandlordChart from './components/AdminLandlordChart';
import MonthlyTransactionChart from './components/MonthlyTransactionChart';
import '../../styles/dashboard/DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="charts-wrapper">
      <div className="row">
        <div className="column">
          <UserRoleChart />
        </div>
        <div className="column">
          <AdminLandlordChart />
        </div>
      </div>
      
      <div className="chart-container" style={{ height: '50%' }}>
        <h2>Doanh thu</h2>
        <MonthlyTransactionChart />
      </div>
    </div>
  );
};

export default DashboardPage;