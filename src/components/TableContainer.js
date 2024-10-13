import React from 'react';
import LeftTable from './LeftTable';
import ProtectionTable from './ProtectionTable';
import './TableContainer.css';


function TableContainer() {
  return (
    <div className="table-container">
      <div id="loading-div" className="loader hidden"></div>
      <LeftTable />
      <ProtectionTable />
    </div>
  );
}

export default TableContainer;
