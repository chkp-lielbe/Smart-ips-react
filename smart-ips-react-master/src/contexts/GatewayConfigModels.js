import { SMART_DPI_INFORMATION } from '../constants';

class ProtectionInformation {
  constructor(name, date, status) {
    this.name = name;
    this.date = date;
    this.status = status;
  }
}

class GatewayConfigInfo {
  constructor(isEnabled, mode, threshold) {
    this.isEnabled = isEnabled;
    this.mode = mode;
    this.threshold = threshold;
    this.protections = [];
    this.history = [];
    this.smartDpiKey = SMART_DPI_INFORMATION;
    this.gateway = "";
  }

  addProtection(protection) {
    this.protections.push(protection);
  }

  addHistoryItem(historyItem) {
    this.history.push(historyItem);
  }
}

export { GatewayConfigInfo, ProtectionInformation };