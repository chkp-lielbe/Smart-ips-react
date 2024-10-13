import React from 'react';
import { MONITOR_STR, ACTION_STR } from '../constants';
import './ModeSelection.css';

function ModeSelection({ isEnabled, mode, handleModeChange }) {
  return (
    <div className="mode-wrapper">
      <span className="mode-text">Mode:</span>
      <div className="radio-options">
        <label>
          <input
            type="radio"
            name="mode"
            value={MONITOR_STR}
            checked={mode === MONITOR_STR}
            disabled={!isEnabled}
            onChange={handleModeChange}
          />
          Monitor
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value={ACTION_STR}
            checked={mode === ACTION_STR}
            disabled={!isEnabled}
            onChange={handleModeChange}
          />
          Action
        </label>
      </div>
    </div>
  );
}

export default ModeSelection;