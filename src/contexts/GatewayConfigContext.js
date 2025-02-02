// src/contexts/GatewayConfigContext.js
import React, { createContext, useState, useEffect } from 'react';
import { createGatewayConfigInstance } from './GatewayConfigService';
import { NO_CODE_ON_GW_MODE } from '../constants';

// Create the context
const GatewayConfigContext = createContext();

// Create a provider component
const GatewayConfigProvider = ({ children }) => {
  const [gatewayConfig, setGatewayConfig] = useState(null); // Initialize as null to indicate loading
  const [loading, setLoading] = useState(true); // Loading state
  const [errorState, setErrorState] = useState(false); // error state
  const [noGWCodeState, setNoGWCodeState] = useState(false); // no gw code state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gatewayConfigInstance = await createGatewayConfigInstance();
        if (gatewayConfigInstance.mode === NO_CODE_ON_GW_MODE) {
          setNoGWCodeState(true);
        } else {
          setGatewayConfig(gatewayConfigInstance);
        }
      } catch (error) {
        console.error("Error, there was an error during the process of getting the smart ips information: ", error);
        setErrorState(true)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorState) {
    return <div>Rendering of the application failed. Contact Check Point Support.</div>;
  }

  if (noGWCodeState) {
    return <div>The current version of the Gateway does not support this application. Upgrade to the version R82 or higher.</div>;
  }

  return (
    <GatewayConfigContext.Provider value={{ gatewayConfig, setGatewayConfig }}>
      {children}
    </GatewayConfigContext.Provider>
  );
};

export { GatewayConfigContext, GatewayConfigProvider };
