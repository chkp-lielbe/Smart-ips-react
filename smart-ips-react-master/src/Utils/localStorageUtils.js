import { ProtectionInformation, GatewayConfigInfo } from '../contexts/GatewayConfigModels';
import { MONITOR_STR } from '../constants';

export function updateGWCodeLocalStorge(gwCodeState, smartDpiGWCodeKey) {
    console.log(smartDpiGWCodeKey);
    const currentTime = new Date().toISOString();
    const SmartDpiGWCodeObject = {
        isCodeOnGW: gwCodeState,
        timestamp: currentTime
    };
    localStorage.setItem(smartDpiGWCodeKey, JSON.stringify(SmartDpiGWCodeObject));
    console.log("Finish to update gw code local storage");
}

export async function getGWInfoFromLocalStorage(smartDpiInformationKey) {
    let gatewayConfigData = new GatewayConfigInfo(false, MONITOR_STR, 50)
    try {
        const storedData = localStorage.getItem(smartDpiInformationKey);
        const parsedData = JSON.parse(storedData);

        gatewayConfigData.isEnabled = Number(parsedData.isEnabled);
        gatewayConfigData.mode = parsedData.mode;
        gatewayConfigData.threshold = Number(parsedData.threshold);

        // Reconstruct protections array
        parsedData.protections.forEach(protection => {
            const protectionInfo = new ProtectionInformation(protection.name, protection.date, protection.status);
            gatewayConfigData.protections.push(protectionInfo);
        });

        // Reconstruct history array
        parsedData.history.forEach(historyItem => {
            const historyInfo = new ProtectionInformation(historyItem.name, historyItem.date, historyItem.status);
            gatewayConfigData.history.push(historyInfo);
        });

        console.log("Finish to get smart ips informationdata from local storage");
        return gatewayConfigData
    } catch (error) {
        console.log("Error parsing JSON(getGWInfoFromLocalStorage): " + error);
        throw new Error('Error parsing JSON(getGWInfoFromLocalStorage): ', error.message);
    }
}

export async function updateGWInfoLocalStorge(currentGatewayInfo, smartDpiInformationKey) {
    const currentTime = new Date().toISOString();
    const SmartDpiObject = {
      isEnabled: currentGatewayInfo.isEnabled,
      mode: currentGatewayInfo.mode,
      threshold: currentGatewayInfo.threshold,
      protections: currentGatewayInfo.protections,
      history: currentGatewayInfo.history,
      timestamp: currentTime
    };
    localStorage.setItem(smartDpiInformationKey, JSON.stringify(SmartDpiObject));
    console.log("Finish to update info local storage");
}

export async function deleteGWInfoLocalStorge(smartDpiInformationKey) {
    localStorage.removeItem(smartDpiInformationKey);
    console.log("Finish to delete info local storage");
}