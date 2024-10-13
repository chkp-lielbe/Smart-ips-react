import React from 'react';
import { ENABLED_STR, DISABLED_STR } from '../constants';
import './StateToggle.css';

function StateToggle({ isEnabled, handleToggleChange }) {
  return (
    <div className="state-wrapper">
      <span className="state-text">State:</span>
      <label className="switch">
        <input
          type="checkbox"
          id="stateToggle"
          checked={isEnabled}
          onChange={handleToggleChange}
        />
        <span className="slider"></span>
      </label>
      <span className="state-status">{isEnabled ? ENABLED_STR : DISABLED_STR}</span>
    </div>
  );
}

export default StateToggle;