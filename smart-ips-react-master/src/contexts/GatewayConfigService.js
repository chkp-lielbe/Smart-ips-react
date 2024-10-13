import { SMART_DPI_INFORMATION, SMART_DPI_GW_CODE, FOUND_GW_CODE, NOT_FOUND_GW_CODE, GET_NEW_REPORT_TIME, GET_NEW_GW_CODE_TIME, MONITOR_STR, NO_CODE_ON_GW_MODE } from '../constants';
import { GatewayConfigInfo } from './GatewayConfigModels';
import { receiveGWCodeCli, receiveReporInfoCli, receiveUpdateInfoCli, receiveAmwFetchCli } from '../utils/cliUtils';
import { isKeyTimePass, getGWCodeResult, getGWInformation, isCurrentTaskSucceeded } from '../utils/verificationUtils';
import { updateGWCodeLocalStorge, getGWInfoFromLocalStorage, updateGWInfoLocalStorge, deleteGWInfoLocalStorge } from '../utils/localStorageUtils';
import SmartConsoleInteractions from "smart-console-interactions";

let gatewayConfigInstance = new GatewayConfigInfo(false, MONITOR_STR, 50);

var interactions = new SmartConsoleInteractions();

const gatewayConfigState = {
  gatewayName: null,
  smartDpiInformationKey: SMART_DPI_INFORMATION,
  smartDpiGWCodeKey: SMART_DPI_GW_CODE,
  // Add other shared properties as needed
};

async function updateGWConfigInstanceInformation(gwInformation) {
  gatewayConfigInstance.isEnabled = gwInformation.isEnabled;
  gatewayConfigInstance.mode = gwInformation.mode;
  gatewayConfigInstance.threshold = gwInformation.threshold;
  gatewayConfigInstance.protections = gwInformation.protections;
  gatewayConfigInstance.history = gwInformation.history;
  gatewayConfigInstance.gateway = gatewayConfigState.gatewayName
  gatewayConfigInstance.smartDpiKey = gatewayConfigState.smartDpiInformationKey
}


async function updateGWConfigInstance() {
  try {
    if (!localStorage.hasOwnProperty(gatewayConfigState.smartDpiInformationKey) || await isKeyTimePass(gatewayConfigState.smartDpiInformationKey, GET_NEW_REPORT_TIME)) {
      console.log("smartDpiInformationKey is not in local storage, or the timestamp has expired.")
      const reporInfoCli = receiveReporInfoCli(gatewayConfigState.gatewayName);
      var result = await interactions.requestCommit([reporInfoCli]);
      var gwInformation = await getGWInformation(result);
      await updateGWConfigInstanceInformation(gwInformation)
      await updateGWInfoLocalStorge(gwInformation, gatewayConfigState.smartDpiInformationKey)
    } else {
      var gwInformation = await getGWInfoFromLocalStorage(gatewayConfigState.smartDpiInformationKey)
      await updateGWConfigInstanceInformation(gwInformation)
    }
  } catch (error) {
    console.error("Error while creating smart ips information: ", error);
    throw new Error("Error while creating smart ips information: ", error.message);
  }
}

async function updateAndReturnGWCodeStatus(isGWCode) {
  if (isGWCode) {
    console.log("GW has the needed code for the smart ips extension")
    updateGWCodeLocalStorge(FOUND_GW_CODE, gatewayConfigState.smartDpiGWCodeKey);
  }
  else {
    console.log("GW do not has the needed code for the smart ips extension")
    updateGWCodeLocalStorge(NOT_FOUND_GW_CODE, gatewayConfigState.smartDpiGWCodeKey);
  }
}

async function isUpdateCodeOnGW() {
  try {
    if (!localStorage.hasOwnProperty(gatewayConfigState.smartDpiGWCodeKey) || await isKeyTimePass(gatewayConfigState.smartDpiGWCodeKey, GET_NEW_GW_CODE_TIME)) {
      console.log("smartDpiGWCodeKey is not in local storage, or the timestamp has expired.")
      const gwCodeCli = receiveGWCodeCli(gatewayConfigState.gatewayName);
      var result = await interactions.requestCommit([gwCodeCli]);
      const GWCodeResult = await getGWCodeResult(result);
      await updateAndReturnGWCodeStatus(GWCodeResult);
      return GWCodeResult
    } else {
      const storedData = localStorage.getItem(gatewayConfigState.smartDpiGWCodeKey);
      const parsedData = JSON.parse(storedData);
      if (Number(parsedData.isCodeOnGW) === FOUND_GW_CODE) {
        console.log("GW has the needed code for the smart ips extension")
        return true;
      }
      else {
        console.log("GW do not has the needed code for the smart ips extension")
        return false;
      }
    }
  } catch (error) {
    console.error("Error while serchong for smart ips GW code: ", error);
    throw new Error("Error while serchong for smart ips GW code: ", error.message);
  }
}

async function updateGWConfigParams() {
  try {
    const result = await interactions.getContextObject();
    // Destructure to safely access the nested properties
    const { event } = result;
    const { objects } = event || {};

    // Ensure that objects[0] exists and has a 'name' property
    if (!objects || !objects[0] || !objects[0].name) {
      throw new Error("Invalid object structure or missing 'name' property.");
    }

    // Safely retrieve the gateway name
    const gatewayName = objects[0].name;

    // Update the global gatewayConfigState
    gatewayConfigState.gatewayName = gatewayName;
    gatewayConfigState.smartDpiInformationKey += `_${gatewayName}`;
    gatewayConfigState.smartDpiGWCodeKey += `_${gatewayName}`;

    // Log the updated keys for debugging purposes
    console.log(gatewayConfigState.smartDpiInformationKey);
    console.log(gatewayConfigState.smartDpiGWCodeKey);
  } catch (error) {
    console.error("Error updating gateway configuration: ", error);
    throw new Error("Error updating gateway configuration: ", error.message);
  }
}

// Main function to create the GatewayConfigInstance
export const createGatewayConfigInstance = async () => {
  try {
    await updateGWConfigParams();
    const updateCodeOnGW = await isUpdateCodeOnGW();
    if (!updateCodeOnGW) {
      console.log("Error, the gw do not have the needed code for the extension");
      gatewayConfigInstance.mode = NO_CODE_ON_GW_MODE;
    } else {
      await updateGWConfigInstance();
    }
    return gatewayConfigInstance;
  } catch (error) {
    console.error("Failed to update gateway configuration: ", error);
    throw new Error("Failed to update gateway configuration: ", error.message);
  }
};

// Main function to create the GatewayConfigInstance
export async function updateGWInformation(gatewayConfig) {
  const updateInfoCli = receiveUpdateInfoCli(gatewayConfig);
  console.log("update cli:")
  console.log(updateInfoCli)
  var result = await interactions.requestCommit([updateInfoCli]);
  try {
    const updateSucceeded = await isCurrentTaskSucceeded(result)
    if (!updateSucceeded) {
      console.log('Fail to get update of Smart IPS information');
      throw new Error('Fail to get update of Smart IPS information');
    }
    await deleteGWInfoLocalStorge(gatewayConfig.smartDpiKey)
    const AmwFetchCli = receiveAmwFetchCli(gatewayConfig.gateway);
    var result = await interactions.requestCommit([AmwFetchCli]);
    const amwFetchSucceeded = await isCurrentTaskSucceeded(result)
    if (!amwFetchSucceeded) {
      console.log('Fail to run amw fetch local');
      throw new Error('Fail to run amw fetch local');
    }
  } catch (error) {
    console.error("An error occurred in updateGWInformation(): ", error.message);
    throw new Error("An error occurred in updateGWInformation(): ", error.message);
  }
};

