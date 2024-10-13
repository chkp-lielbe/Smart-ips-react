import React, { useContext, useState, useEffect } from 'react';
import { GatewayConfigContext } from '../contexts/GatewayConfigContext';
import { MODE_UPDATE, STATE_UPDATE } from '../constants';
import './TableContent.css'

function TableContent({ tableType }) {
  const { gatewayConfig } = useContext(GatewayConfigContext);
  const [loading, setLoading] = useState(true);
  
  // Determine which array to use based on the tableType
  const tableInformationList = tableType === 'Critical Impact Protections'
    ? gatewayConfig.protections
    : gatewayConfig.history;

  useEffect(() => {
    // The effect runs when tableInformationList changes (even if empty)
    setLoading(false);
  }, [tableInformationList]);

  if (loading) {
    return <div className="loading-icon">Loading...</div>; // Replace with a spinner if desired
  }

  return (
    <table className="protection-table">
      <colgroup>
        <col style={{ width: '50%' }} />
        <col style={{ width: '25%' }} />
        <col style={{ width: '25%' }} />
      </colgroup>
      <thead>
        <tr>
          <th className="protection-table-th">Name</th>
          <th className="protection-table-th">Date</th>
          <th className="protection-table-th">Status</th>
        </tr>
      </thead>
      <tbody className="protection-table-tbody">
        {tableInformationList.map((row, index) => {
          let tdClassStatus = 'protection-table-td-status-';

          // Use constants to determine the status class
          if (row.status === MODE_UPDATE || row.status === STATE_UPDATE) {
            tdClassStatus += 'Update';
          } else {
            tdClassStatus += row.status;
          }
          var statusContent = row.status;
          if (row.status === "Recommended"){
            statusContent = "Alert";
          }

          return (
            <tr key={index}>
              <td className="protection-table-td">{row.name}</td>
              <td className="protection-table-td">{row.date}</td>
              <td className={tdClassStatus}>{statusContent}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TableContent;
