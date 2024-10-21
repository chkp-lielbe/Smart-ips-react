import React, { useState, useContext } from 'react';
import StateToggle from './StateToggle';
import ModeSelection from './ModeSelection';
import ThresholdInput from './ThresholdInput';
import { GatewayConfigContext } from '../contexts/GatewayConfigContext';
import { updateGWInformation } from '../contexts/GatewayConfigService';
import { MONITOR_STR } from '../constants';
import './LeftTable.css';

function LeftTable() {
  const { gatewayConfig, setGatewayConfig } = useContext(GatewayConfigContext);

  // Initialize state with the global config values only at the beginning
  const [isEnabled, setIsEnabled] = useState(gatewayConfig.isEnabled);
  const [mode, setMode] = useState(gatewayConfig.isEnabled ? gatewayConfig.mode : MONITOR_STR);
  const [threshold, setThreshold] = useState(gatewayConfig.threshold);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleChange = () => {
    setIsEnabled((prevState) => {
      const newState = !prevState;
      if (!newState) {
        setMode(MONITOR_STR); // Change mode to 'monitor' when disabling
      }
      return newState;
    });
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleThresholdChange = (event) => {
    setThreshold(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("click submit");
    const thresholdValue = parseInt(threshold, 10);

    if (thresholdValue < 1 || thresholdValue > 100) {
      setErrorMessage('Enter an integer threshold value, between 1 and 100.');
      setThreshold(gatewayConfig.threshold);
      setShowError(true);
      return;
    }

    setErrorMessage('');

    // Prepare the updated gatewayConfig object
    const updatedGatewayConfig = {
      ...gatewayConfig,
      isEnabled,
      mode,
      threshold: thresholdValue,
    };

    // Update the state with the new configuration
    setGatewayConfig(updatedGatewayConfig);

    // Disable the submit button
    setIsSubmitting(true);

    try {
      // Wait for the async function to finish
      await updateGWInformation(updatedGatewayConfig);
    } catch (error) {
      console.error("Failed to run after submit:", error);
    } finally {
      console.log("Finish to sumbit the info, refresh the page");
      // Re-enable the submit button
      setIsSubmitting(false);
      window.location.reload();
    }
  };


  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div className="left-table-wrapper">
      <table className="left-table">
        <thead>
          <tr>
            <th className="policy-header">Policy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="config-container">
                <StateToggle isEnabled={isEnabled} handleToggleChange={handleToggleChange} />
                <ModeSelection isEnabled={isEnabled} mode={mode} handleModeChange={handleModeChange} />
                <ThresholdInput isEnabled={isEnabled} threshold={threshold} handleThresholdChange={handleThresholdChange} />
                <button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {showError && (
        <div className="error-modal">
          <div className="error-modal-content">
            <p>{errorMessage}</p>
            <button onClick={handleCloseError}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeftTable;
