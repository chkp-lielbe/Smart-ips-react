import React from 'react';
import './ThresholdInput.css';


function ThresholdInput({ isEnabled, threshold, handleThresholdChange }) {
  return (
    <div className="threshold-wrapper">
      <label htmlFor="threshold">Threshold (%):</label>
      <input
        type="number"
        id="threshold"
        name="threshold"
        min="1"
        max="100"
        value={threshold}
        onChange={handleThresholdChange}
        disabled={!isEnabled}
      />
    </div>
  );
}

export default ThresholdInput;
