// src/App.js
import React, { useEffect } from 'react';
import TableContainer from './components/TableContainer';
import { GatewayConfigProvider } from './contexts/GatewayConfigContext';
import './App.css';
import { showContext } from './updateSmartDpiConf';

function App() {
  useEffect(() => {
    showContext();
  }, []);

  return (
    <GatewayConfigProvider>
      <div className="App">
        <TableContainer />
      </div>
    </GatewayConfigProvider>
  );
}

export default App;
