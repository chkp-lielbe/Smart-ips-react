import { SMART_DPI_FIND_GW_CODE, SMART_DPI_PYTHON_CONFIG_REPORT, SMART_DPI_PYTHON_CONFIG_UPDATE } from '../constants';

export function receiveGWCodeCli(gatewayName) {
    // send API request
    const mgmtCli = `run-script script-name "smart_dpi_find_gw_code" script "${SMART_DPI_FIND_GW_CODE}" targets.1 "${gatewayName}" --format json`;
    return mgmtCli;
}

export function receiveReporInfoCli(gatewayName) {
    // send API request
    const mgmtCli = `run-script script-name "smart_dpi_config_report" script "${SMART_DPI_PYTHON_CONFIG_REPORT}" targets.1 "${gatewayName}" --format json`;
    return mgmtCli;
}

export function receiveUpdateInfoCli(gatewayConfig) {
    const enabledValue = gatewayConfig.isEnabled ? "1" : "0";
    // send API request
    const updateConfigCli = SMART_DPI_PYTHON_CONFIG_UPDATE + " " + enabledValue + " " + gatewayConfig.mode + " " + gatewayConfig.threshold.toString()
    const mgmtCli = `run-script script-name "smart_dpi_config_update" script "${updateConfigCli}" targets.1 "${gatewayConfig.gateway}" --format json`;
    return mgmtCli;
}

export function receiveAmwFetchCli(gatewayName) {
    // send API request
    const fetchLocalCli = "fw amw fetch local"
    const mgmtCli = `run-script script-name "fw_amw_fetch_local" script "${fetchLocalCli}" targets.1 "${gatewayName}" --format json`;
    return mgmtCli;
}