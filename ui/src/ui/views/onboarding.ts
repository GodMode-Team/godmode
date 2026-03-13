/**
 * Onboarding View — Full-screen 6-phase onboarding experience
 *
 * Phase 0: Welcome — full-screen takeover
 * Phase 1: Identity — name/mission/emoji form
 * Phase 2-5: Progress overlay on chat (agent-driven)
 * Phase 6: Summary + grand reveal
 */

import { html, nothing, type TemplateResult } from "lit";

// ── Types ────────────────────────────────────────────────────────

export type OnboardingIdentity = {
	name: string;
	mission: string;
	emoji: string;
};

export type ToolConnection = {
	id: string;
	name: string;
	status: "connected" | "pending" | "skipped";
	icon?: string;
};

export type AuditFinding = {
	problem: string;
	skill: string | null;
	impact: "high" | "medium" | "low";
	estimatedTimeSaved?: string;
};

export type OnboardingSummary = {
	projects: number;
	people: number;
	goals: number;
	toolsConnected: number;
	automations: number;
};

export type OnboardingPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type AssessmentResult = {
	healthScore: number;
	configExists: boolean;
	authMethod: string;
	memoryStatus: {
		dirExists: boolean;
		hasMemoryMd: boolean;
		fileCount: number;
		totalSizeKb: number;
	};
	channelsConnected: string[];
	skillsInstalled: string[];
	features: { key: string; label: string; enabled: boolean }[];
	workspaceConfigured: boolean;
	githubReady: boolean;
	obsidianVaultConfigured: boolean;
	gatewayTokenSet: boolean;
	timestamp: string;
};

export type OnboardingData = {
	phase: OnboardingPhase;
	startedAt: string;
	identity: OnboardingIdentity | null;
	completedPhases: number[];
	tools: ToolConnection[];
	audit: { findings: AuditFinding[] };
	summary: OnboardingSummary | null;
	completedAt: string | null;
	// Deep onboarding fields
	assessment?: AssessmentResult | null;
	interview?: {
		name: string;
		role?: string;
		mission?: string;
		workflows?: string[];
		painPoints?: string[];
		completed: boolean;
	} | null;
	secondBrain?: { memorySeeded: boolean; dailyBriefConfigured: boolean; completed: boolean } | null;
	configuration?: { changes: { key: string; label: string; applied: boolean }[]; completed: boolean } | null;
	firstWin?: { demoType: string; completed: boolean } | null;
	grandReveal?: { healthBefore: number; healthAfter: number; changesApplied: number } | null;
};

type OnboardingProps = {
	phase: OnboardingPhase;
	identity: OnboardingIdentity | null;
	tools: ToolConnection[];
	auditFindings: AuditFinding[];
	summary: OnboardingSummary | null;
	onStart: () => void;
	onIdentitySubmit: (identity: OnboardingIdentity) => void;
	onComplete: () => void;
	onSkipPhase: () => void;
};

// ── Phase Labels ─────────────────────────────────────────────────

const PHASE_LABELS: Record<number, string> = {
	0: "Assessment",
	1: "Interview",
	2: "Second Brain",
	3: "Workflow Audit",
	4: "Configuration",
	5: "First Win",
	6: "Ready",
};

// ── Default Integration Cards ────────────────────────────────────

const INTEGRATION_CARDS = [
	{ id: "slack", name: "Slack", icon: "#", desc: "Team messaging" },
	{ id: "google-calendar", name: "Google Calendar", icon: "Cal", desc: "Events & scheduling" },
	{ id: "clickup", name: "ClickUp", icon: "CU", desc: "Project management" },
	{ id: "github", name: "GitHub", icon: "GH", desc: "Code & repos" },
	{ id: "obsidian", name: "Obsidian", icon: "Ob", desc: "Notes & knowledge" },
	{ id: "notion", name: "Notion", icon: "N", desc: "Docs & wikis" },
	{ id: "linear", name: "Linear", icon: "Li", desc: "Issue tracking" },
	{ id: "apple-reminders", name: "Apple Reminders", icon: "AR", desc: "Tasks (macOS)" },
	{ id: "email", name: "Email", icon: "@", desc: "Gmail / Outlook" },
	{ id: "things-mac", name: "Things", icon: "Th", desc: "Task manager (macOS)" },
];

// ── Render Helpers ───────────────────────────────────────────────

function renderProgressBar(phase: OnboardingPhase): TemplateResult {
	const steps = [2, 3, 4, 5];
	return html`
		<div class="onboarding-progress">
			<div class="onboarding-progress-bar">
				${steps.map(
					(step) => html`
						<div
							class="onboarding-progress-step ${phase >= step ? "completed" : ""} ${phase === step ? "active" : ""}"
						>
							<div class="onboarding-progress-dot"></div>
							<span class="onboarding-progress-label">${PHASE_LABELS[step]}</span>
						</div>
					`,
				)}
			</div>
			<div class="onboarding-progress-fill" style="width: ${((phase - 2) / 4) * 100}%"></div>
		</div>
	`;
}

function renderToolsOverlay(tools: ToolConnection[], onSkip: () => void): TemplateResult {
	return html`
		<div class="onboarding-tools-overlay">
			<div class="onboarding-tools-header">
				<h3>Connect Your Tools</h3>
				<p>Tap a tool to connect it. The agent will help with setup.</p>
			</div>
			<div class="onboarding-tools-grid">
				${INTEGRATION_CARDS.map((card) => {
					const connected = tools.find((t) => t.id === card.id);
					const status = connected?.status ?? "pending";
					return html`
						<div class="onboarding-tool-card ${status}" data-tool-id="${card.id}">
							<div class="onboarding-tool-icon">${card.icon}</div>
							<div class="onboarding-tool-name">${card.name}</div>
							<div class="onboarding-tool-desc">${card.desc}</div>
							<div class="onboarding-tool-status">
								${status === "connected"
									? html`<span class="status-connected">Connected</span>`
									: status === "skipped"
										? html`<span class="status-skipped">Skipped</span>`
										: html`<span class="status-pending">Tap to connect</span>`}
							</div>
						</div>
					`;
				})}
			</div>
			<button class="onboarding-skip-btn" @click=${onSkip}>Skip for now</button>
		</div>
	`;
}

function renderAuditResults(findings: AuditFinding[]): TemplateResult {
	if (!findings.length) return html`${nothing}`;

	return html`
		<div class="onboarding-audit-overlay">
			<h3>GodMode Audit Results</h3>
			<div class="onboarding-audit-cards">
				${findings.map(
					(finding) => html`
						<div class="onboarding-audit-card impact-${finding.impact}">
							<div class="audit-problem">${finding.problem}</div>
							${finding.skill ? html`<div class="audit-skill">Skill: ${finding.skill}</div>` : nothing}
							${finding.estimatedTimeSaved ? html`<div class="audit-time">Saves ~${finding.estimatedTimeSaved}</div>` : nothing}
							<div class="audit-impact">${finding.impact} impact</div>
						</div>
					`,
				)}
			</div>
		</div>
	`;
}

// ── Assessment Dashboard ─────────────────────────────────────────

function renderHealthGauge(score: number): TemplateResult {
	const color = score >= 70 ? "#38a169" : score >= 40 ? "#d69e2e" : "#e53e3e";
	const label = score >= 70 ? "Good" : score >= 40 ? "Needs Work" : "Getting Started";
	return html`
		<div class="onboarding-health-gauge">
			<div class="health-score" style="color: ${color}">
				<span class="health-number">${score}</span>
				<span class="health-max">/100</span>
			</div>
			<div class="health-label" style="color: ${color}">${label}</div>
		</div>
	`;
}

function renderAssessmentDashboard(assessment: AssessmentResult): TemplateResult {
	return html`
		<div class="onboarding-assessment">
			${renderHealthGauge(assessment.healthScore)}
			<div class="assessment-checklist">
				<div class="assessment-item ${assessment.configExists ? "ok" : "gap"}">
					<span class="assessment-icon">${assessment.configExists ? "\u2705" : "\u274C"}</span>
					<span>Config file</span>
				</div>
				<div class="assessment-item ${assessment.authMethod !== "none" ? "ok" : "gap"}">
					<span class="assessment-icon">${assessment.authMethod !== "none" ? "\u2705" : "\u274C"}</span>
					<span>Auth: ${assessment.authMethod}</span>
				</div>
				<div class="assessment-item ${assessment.memoryStatus.hasMemoryMd ? "ok" : "gap"}">
					<span class="assessment-icon">${assessment.memoryStatus.hasMemoryMd ? "\u2705" : "\u274C"}</span>
					<span>Memory (${assessment.memoryStatus.fileCount} files, ${assessment.memoryStatus.totalSizeKb}KB)</span>
				</div>
				<div class="assessment-item ${assessment.channelsConnected.length > 0 ? "ok" : "gap"}">
					<span class="assessment-icon">${assessment.channelsConnected.length > 0 ? "\u2705" : "\u274C"}</span>
					<span>Channels: ${assessment.channelsConnected.length > 0 ? assessment.channelsConnected.join(", ") : "none"}</span>
				</div>
				<div class="assessment-item ${assessment.githubReady ? "ok" : "gap"}">
					<span class="assessment-icon">${assessment.githubReady ? "\u2705" : "\u274C"}</span>
					<span>GitHub CLI${assessment.githubReady ? "" : " (needed for coding + workspaces)"}</span>
				</div>
				<div class="assessment-item ${assessment.obsidianVaultConfigured ? "ok" : "gap"}">
					<span class="assessment-icon">${assessment.obsidianVaultConfigured ? "\u2705" : "\u274C"}</span>
					<span>Obsidian vault${assessment.obsidianVaultConfigured ? "" : " (needed for daily brief)"}</span>
				</div>
				<div class="assessment-item ${assessment.skillsInstalled.length > 0 ? "ok" : "gap"}">
					<span class="assessment-icon">${assessment.skillsInstalled.length > 0 ? "\u2705" : "\u274C"}</span>
					<span>Skills: ${assessment.skillsInstalled.length > 0 ? assessment.skillsInstalled.length + " installed" : "none"}</span>
				</div>
				${assessment.features.map(
					(f) => html`
						<div class="assessment-item ${f.enabled ? "ok" : "gap"}">
							<span class="assessment-icon">${f.enabled ? "\u2705" : "\u274C"}</span>
							<span>${f.label}</span>
						</div>
					`,
				)}
			</div>
		</div>
	`;
}

// ── Main Render Functions ────────────────────────────────────────

/**
 * Phase 0: Full-screen welcome with assessment dashboard.
 */
export function renderOnboardingWelcome(onStart: () => void, assessment?: AssessmentResult | null): TemplateResult {
	return html`
		<div class="onboarding-fullscreen">
			<div class="onboarding-welcome">
				<div class="onboarding-welcome-glow"></div>
				<h1 class="onboarding-title">Welcome to GodMode</h1>
				${assessment
					? html`
						<p class="onboarding-subtitle">Here's where your setup stands today:</p>
						${renderAssessmentDashboard(assessment)}
						<p class="onboarding-subtitle">Let's get you to 100. It takes about 15 minutes.</p>
					`
					: html`
						<div class="onboarding-value-cards">
							<div class="onboarding-value-card">
								<div class="value-icon">OS</div>
								<div class="value-title">Your AI Operating System</div>
								<div class="value-desc">
									A personal AI that knows your projects, people, and goals.
								</div>
							</div>
							<div class="onboarding-value-card">
								<div class="value-icon">Work</div>
								<div class="value-title">Delegates Real Work</div>
								<div class="value-desc">
									Not just answers. Actions. Emails drafted, tasks organized, meetings prepped.
								</div>
							</div>
							<div class="onboarding-value-card">
								<div class="value-icon">+</div>
								<div class="value-title">Learns & Improves</div>
								<div class="value-desc">
									Gets better every day. Remembers context. Anticipates needs.
								</div>
							</div>
						</div>
					`
				}
				<button class="onboarding-cta" @click=${onStart}>
					${assessment ? "Let's optimize your setup" : "Let's build your GodMode"}
				</button>
			</div>
		</div>
	`;
}

/**
 * Phase 1: Identity form — name, mission, emoji avatar.
 */
export function renderOnboardingIdentity(
	onSubmit: (identity: OnboardingIdentity) => void,
): TemplateResult {
	let name = "";
	let mission = "";
	let emoji = "";

	const emojiOptions = [
		"rocket", "lightning", "fire", "star", "brain",
		"crown", "diamond", "target", "compass", "mountain",
	];
	const emojiMap: Record<string, string> = {
		rocket: "\u{1F680}", lightning: "\u26A1", fire: "\u{1F525}", star: "\u2B50",
		brain: "\u{1F9E0}", crown: "\u{1F451}", diamond: "\u{1F48E}", target: "\u{1F3AF}",
		compass: "\u{1F9ED}", mountain: "\u26F0\uFE0F",
	};

	function handleSubmit(e: Event) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		name = (formData.get("name") as string)?.trim() ?? "";
		mission = (formData.get("mission") as string)?.trim() ?? "";
		emoji = (formData.get("emoji") as string)?.trim() || "\u{1F680}";
		if (!name) return;
		onSubmit({ name, mission, emoji });
	}

	return html`
		<div class="onboarding-fullscreen">
			<div class="onboarding-identity">
				<h2 class="onboarding-identity-title">Who are you?</h2>
				<p class="onboarding-identity-subtitle">Let's personalize your GodMode</p>
				<form class="onboarding-identity-form" @submit=${handleSubmit}>
					<div class="identity-field">
						<label for="ob-name">Your name</label>
						<input
							type="text"
							id="ob-name"
							name="name"
							placeholder="What should I call you?"
							required
							autofocus
							autocomplete="off"
						/>
					</div>
					<div class="identity-field">
						<label for="ob-mission">Your mission <span class="optional">(one sentence)</span></label>
						<input
							type="text"
							id="ob-mission"
							name="mission"
							placeholder="e.g. Build the future of personal AI"
							autocomplete="off"
						/>
					</div>
					<div class="identity-field">
						<label>Choose your avatar</label>
						<div class="emoji-picker">
							${emojiOptions.map(
								(key, i) => html`
									<label class="emoji-option">
										<input
											type="radio"
											name="emoji"
											value="${emojiMap[key]}"
											?checked=${i === 0}
										/>
										<span class="emoji-display">${emojiMap[key]}</span>
									</label>
								`,
							)}
						</div>
					</div>
					<button type="submit" class="onboarding-cta">Continue</button>
				</form>
			</div>
		</div>
	`;
}

/**
 * Phases 2-5: Progress bar overlay that renders on top of the chat view.
 */
export function renderOnboardingProgress(props: OnboardingProps): TemplateResult {
	const { phase, tools, auditFindings, onSkipPhase } = props;

	return html`
		${renderProgressBar(phase)}
		${phase === 3 ? renderToolsOverlay(tools, onSkipPhase) : nothing}
		${phase === 4 && auditFindings.length > 0 ? renderAuditResults(auditFindings) : nothing}
	`;
}

/**
 * Phase 6: Summary card + grand reveal transition.
 */
export function renderOnboardingSummary(
	summary: OnboardingSummary | null,
	identity: OnboardingIdentity | null,
	onComplete: () => void,
): TemplateResult {
	if (!summary) return html`${nothing}`;

	return html`
		<div class="onboarding-fullscreen onboarding-summary">
			<div class="onboarding-summary-content">
				<div class="onboarding-summary-emoji">${identity?.emoji ?? "\u{1F680}"}</div>
				<h2 class="onboarding-summary-title">You're ready, ${identity?.name ?? "friend"}.</h2>
				<div class="onboarding-summary-stats">
					<div class="summary-stat">
						<span class="stat-number">${summary.projects}</span>
						<span class="stat-label">Projects</span>
					</div>
					<div class="summary-stat">
						<span class="stat-number">${summary.people}</span>
						<span class="stat-label">People</span>
					</div>
					<div class="summary-stat">
						<span class="stat-number">${summary.goals}</span>
						<span class="stat-label">Goals</span>
					</div>
					<div class="summary-stat">
						<span class="stat-number">${summary.toolsConnected}</span>
						<span class="stat-label">Tools</span>
					</div>
					<div class="summary-stat">
						<span class="stat-number">${summary.automations}</span>
						<span class="stat-label">Automations</span>
					</div>
				</div>
				${identity?.mission ? html`<p class="onboarding-summary-mission">"${identity.mission}"</p>` : nothing}
				<button class="onboarding-cta onboarding-reveal-btn" @click=${onComplete}>
					Welcome to GodMode
				</button>
			</div>
		</div>
	`;
}
