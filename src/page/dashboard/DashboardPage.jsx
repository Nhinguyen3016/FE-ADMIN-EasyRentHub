import React from 'react';
import UserRoleChart from './components/UserRoleChart';
import AdminLandlordChart from './components/AdminLandlordChart';
import MonthlyTransactionChart from './components/MonthlyTransactionChart';
import '../../styles/dashboard/DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="charts-wrapper">
        <div className="row">
          <div className="column">
            <UserRoleChart />
          </div>
          <div className="column">
            <AdminLandlordChart />
          </div>
        </div>
        
        <div className="row revenue-chart-row">
          <div className="column">
            <MonthlyTransactionChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;