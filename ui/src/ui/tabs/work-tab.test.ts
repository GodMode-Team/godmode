import { describe, expect, it } from "vitest";
import { shouldRefreshWorkspaceData } from "./work-tab";

describe("shouldRefreshWorkspaceData", () => {
  it("waits until both connection and gateway are ready", () => {
    expect(
      shouldRefreshWorkspaceData({
        connected: true,
        hasGateway: false,
        previousConnected: false,
        gatewayChanged: false,
        hasWorkspaceData: false,
        workspacesError: "Connect to gateway to see workspaces",
      }),
    ).toBe(false);

    expect(
      shouldRefreshWorkspaceData({
        connected: false,
        hasGateway: true,
        previousConnected: false,
        gatewayChanged: true,
        hasWorkspaceData: false,
        workspacesError: "Connect to gateway to see workspaces",
      }),
    ).toBe(false);
  });

  it("refreshes when the tab becomes connected with no workspace data yet", () => {
    expect(
      shouldRefreshWorkspaceData({
        connected: true,
        hasGateway: true,
        previousConnected: false,
        gatewayChanged: true,
        hasWorkspaceData: false,
        workspacesError: "Connect to gateway to see workspaces",
      }),
    ).toBe(true);
  });

  it("refreshes stale offline state once a live gateway is available", () => {
    expect(
      shouldRefreshWorkspaceData({
        connected: true,
        hasGateway: true,
        previousConnected: true,
        gatewayChanged: false,
        hasWorkspaceData: false,
        workspacesError: "Connect to gateway to see workspaces",
      }),
    ).toBe(true);
  });

  it("does not refetch when data is already present and healthy", () => {
    expect(
      shouldRefreshWorkspaceData({
        connected: true,
        hasGateway: true,
        previousConnected: true,
        gatewayChanged: false,
        hasWorkspaceData: true,
        workspacesError: null,
      }),
    ).toBe(false);
  });
});
