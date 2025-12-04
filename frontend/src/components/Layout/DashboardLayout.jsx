import React from 'react';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ children, role }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar role={role} />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
