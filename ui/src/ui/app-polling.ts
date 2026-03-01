import type { GodModeApp } from "./app";
import { loadDebug } from "./controllers/debug";
import { loadLogs } from "./controllers/logs";
import { loadMissionControl } from "./controllers/mission-control";
import { loadNodes } from "./controllers/nodes";

type PollingHost = {
  nodesPollInterval: number | null;
  logsPollInterval: number | null;
  debugPollInterval: number | null;
  missionControlPollInterval: number | null;
  tab: string;
};

export function startNodesPolling(host: PollingHost) {
  if (host.nodesPollInterval != null) {
    return;
  }
  host.nodesPollInterval = window.setInterval(
    () => void loadNodes(host as unknown as GodModeApp, { quiet: true }),
    5000,
  );
}

export function stopNodesPolling(host: PollingHost) {
  if (host.nodesPollInterval == null) {
    return;
  }
  clearInterval(host.nodesPollInterval);
  host.nodesPollInterval = null;
}

export function startLogsPolling(host: PollingHost) {
  if (host.logsPollInterval != null) {
    return;
  }
  host.logsPollInterval = window.setInterval(() => {
    if (host.tab !== "logs") {
      return;
    }
    void loadLogs(host as unknown as GodModeApp, { quiet: true });
  }, 2000);
}

export function stopLogsPolling(host: PollingHost) {
  if (host.logsPollInterval == null) {
    return;
  }
  clearInterval(host.logsPollInterval);
  host.logsPollInterval = null;
}

export function startDebugPolling(host: PollingHost) {
  if (host.debugPollInterval != null) {
    return;
  }
  host.debugPollInterval = window.setInterval(() => {
    if (host.tab !== "debug") {
      return;
    }
    void loadDebug(host as unknown as GodModeApp);
  }, 3000);
}

export function stopDebugPolling(host: PollingHost) {
  if (host.debugPollInterval == null) {
    return;
  }
  clearInterval(host.debugPollInterval);
  host.debugPollInterval = null;
}

export function startMissionControlPolling(host: PollingHost) {
  if (host.missionControlPollInterval != null) {
    return;
  }
  host.missionControlPollInterval = window.setInterval(() => {
    if (host.tab !== "mission-control") {
      return;
    }
    void loadMissionControl(host as unknown as GodModeApp, { quiet: true });
  }, 5000);
}

export function stopMissionControlPolling(host: PollingHost) {
  if (host.missionControlPollInterval == null) {
    return;
  }
  clearInterval(host.missionControlPollInterval);
  host.missionControlPollInterval = null;
}
