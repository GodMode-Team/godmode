import { html } from "lit";
import type { ActiveRun, FeedItem, MissionAgent, NativeTask, SubagentRun } from "./mission-types";

export type MissionControlProps = {
  connected: boolean;
  loading?: boolean;
  error?: string | null;
  agents: MissionAgent[];
  activeRuns: ActiveRun[];
  subagentRuns: SubagentRun[];
  tasks: NativeTask[];
  feedItems: FeedItem[];
  onRefresh?: () => void;
  onTaskComplete?: (taskId: string) => void;
  onOpenDeck?: () => void;
  onAgentClick?: (agent: MissionAgent) => void;
};

export function renderMissionControl(props: MissionControlProps) {
  void props;
  return html`
    <div class="mission-iframe-container">
      <iframe
        src="/ops/"
        class="mission-iframe"
        title="Mission Control"
        allow="clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  `;
}
