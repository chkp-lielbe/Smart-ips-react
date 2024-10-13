// src/components/ProtectionTable.js
import React, { useState } from 'react';
import TableContent from './TableContent';
import ProtectionsTimeline from './ProtectionsTimeline';
import './ProtectionTable.css'

function ProtectionTable() {
  const [activeTab, setActiveTab] = useState('critical-impact-protections');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'critical-impact-protections':
        return <TableContent tableType="Critical Impact Protections" />;
      case 'log-history':
        return <TableContent tableType="Log History" />;
      case 'timeline-show':
        return <ProtectionsTimeline />;
      default:
        return <TableContent tableType="Critical Impact Protections" />;
    }
  };

  return (
    <div className="protection-table-container">
      <div className="header-container">
        <h1
          id="critical-impact-protections"
          className={activeTab === 'critical-impact-protections' ? 'active' : ''}
          onClick={() => handleTabClick('critical-impact-protections')}
        >
          Critical Impact Protections
        </h1>
        <h1
          id="log-history"
          className={activeTab === 'log-history' ? 'active' : ''}
          onClick={() => handleTabClick('log-history')}
        >
          Log History
        </h1>
        <h1
          id="timeline-show"
          className={activeTab === 'timeline-show' ? 'active' : ''}
          onClick={() => handleTabClick('timeline-show')}
        >
          Timeline
        </h1>
      </div>
      <div className="protection-table-wrapper">
        {renderContent()}
      </div>
    </div>
  );
}

export default ProtectionTable;
