import { html, nothing } from "lit";
import type { MissionAgent } from "./mission-types";

export type MissionAgentsProps = {
  agents: MissionAgent[];
  onAgentClick?: (agent: MissionAgent) => void;
};

export function renderMissionAgents(props: MissionAgentsProps) {
  const agents = props.agents;
  const working = agents.filter((a) => a.status === "WORKING").length;

  return html`
    <div class="mission-agents-panel">
      <div class="mission-panel-header">
        <div class="mission-panel-title">AGENTS</div>
        <div class="mission-panel-count">${working}/${agents.length}</div>
      </div>
      <div class="mission-agents-list">
        ${
          agents.length === 0
            ? html`
                <div class="mission-empty-state">No agents configured</div>
              `
            : agents.map((agent) => renderAgentCard(agent, props.onAgentClick))
        }
      </div>
    </div>
  `;
}

function renderAgentCard(agent: MissionAgent, onAgentClick?: (agent: MissionAgent) => void) {
  const statusClass = agent.status.toLowerCase();

  return html`
    <div
      class="mission-agent-card ${statusClass}"
      @click=${() => onAgentClick?.(agent)}
    >
      <div class="mission-agent-avatar">${agent.emoji}</div>
      <div class="mission-agent-info">
        <div class="mission-agent-name">${agent.name}</div>
        <div class="mission-agent-role">${agent.role}</div>
        ${
          agent.model
            ? html`<div class="mission-agent-model">${agent.model.replace("claude-", "").replace("-4-5", " 4.5").replace("-4-6", " 4.6")}</div>`
            : nothing
        }
      </div>
      <div class="mission-agent-status">
        <span class="status-indicator status-${statusClass}"></span>
      </div>
    </div>
  `;
}
