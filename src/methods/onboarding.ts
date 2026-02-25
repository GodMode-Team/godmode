/**
 * Onboarding Gateway Methods
 *
 * Manages the 6-phase onboarding state for new GodMode users:
 *   Phase 0: Welcome (full-screen)
 *   Phase 1: Identity (name, mission, avatar)
 *   Phase 2: Your World (projects, people, goals — agent-driven)
 *   Phase 3: Connect Tools (integration grid + chat)
 *   Phase 4: GodMode Audit (agent analysis)
 *   Phase 5: First Win (agent demo)
 *   Phase 6: Grand Reveal (summary + full UI)
 *
 * State persisted to ~/godmode/data/onboarding.json
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const ONBOARDING_FILE = join(DATA_DIR, "onboarding.json");

type OnboardingPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type ToolConnection = {
	id: string;
	name: string;
	status: "connected" | "pending" | "skipped";
	icon?: string;
};

type AuditFinding = {
	problem: string;
	skill: string | null;
	impact: "high" | "medium" | "low";
	estimatedTimeSaved?: string;
};

type OnboardingState = {
	phase: OnboardingPhase;
	startedAt: string;
	identity: {
		name: string;
		mission: string;
		emoji: string;
	} | null;
	completedPhases: number[];
	tools: ToolConnection[];
	audit: {
		findings: AuditFinding[];
	};
	summary: {
		projects: number;
		people: number;
		goals: number;
		toolsConnected: number;
		automations: number;
	} | null;
	completedAt: string | null;
};

const DEFAULT_STATE: OnboardingState = {
	phase: 0,
	startedAt: new Date().toISOString(),
	identity: null,
	completedPhases: [],
	tools: [],
	audit: { findings: [] },
	summary: null,
	completedAt: null,
};

async function readOnboarding(): Promise<OnboardingState> {
	try {
		const raw = await readFile(ONBOARDING_FILE, "utf-8");
		return JSON.parse(raw) as OnboardingState;
	} catch {
		return { ...DEFAULT_STATE, startedAt: new Date().toISOString() };
	}
}

async function writeOnboarding(state: OnboardingState): Promise<void> {
	await mkdir(DATA_DIR, { recursive: true });
	await writeFile(ONBOARDING_FILE, JSON.stringify(state, null, 2) + "\n");
}

export const onboardingHandlers: GatewayRequestHandlers = {
	/**
	 * Get current onboarding status.
	 * Returns the full onboarding state including phase, identity, tools, audit.
	 */
	"onboarding.status": async ({ respond }) => {
		const state = await readOnboarding();
		respond(true, state);
	},

	/**
	 * Update onboarding state. Accepts partial updates:
	 *   - phase: advance to a specific phase
	 *   - identity: save name/mission/emoji
	 *   - tools: update tool connections array
	 *   - audit: update audit findings
	 *   - summary: update completion summary
	 *   - completePhase: mark a specific phase as completed
	 */
	"onboarding.update": async ({ params, respond, context }) => {
		const state = await readOnboarding();

		if (typeof params.phase === "number" && params.phase >= 0 && params.phase <= 6) {
			state.phase = params.phase as OnboardingPhase;
		}

		if (params.identity && typeof params.identity === "object") {
			const id = params.identity as Record<string, unknown>;
			state.identity = {
				name: String(id.name ?? state.identity?.name ?? ""),
				mission: String(id.mission ?? state.identity?.mission ?? ""),
				emoji: String(id.emoji ?? state.identity?.emoji ?? ""),
			};
		}

		if (Array.isArray(params.tools)) {
			state.tools = params.tools as ToolConnection[];
		}

		if (params.audit && typeof params.audit === "object") {
			const audit = params.audit as Record<string, unknown>;
			if (Array.isArray(audit.findings)) {
				state.audit.findings = audit.findings as AuditFinding[];
			}
		}

		if (params.summary && typeof params.summary === "object") {
			state.summary = params.summary as OnboardingState["summary"];
		}

		if (typeof params.completePhase === "number") {
			if (!state.completedPhases.includes(params.completePhase)) {
				state.completedPhases.push(params.completePhase);
				state.completedPhases.sort();
			}
		}

		await writeOnboarding(state);

		// Broadcast update event so UI reacts in real-time
		try {
			context?.broadcast?.("onboarding:update", state);
		} catch {
			// broadcast not available in all contexts
		}

		respond(true, state);
	},

	/**
	 * Mark onboarding as complete. Writes final timestamp and phase 6.
	 */
	"onboarding.complete": async ({ params, respond, context }) => {
		const state = await readOnboarding();
		state.phase = 6;
		state.completedAt = new Date().toISOString();

		// Add phase 6 to completed if not already there
		if (!state.completedPhases.includes(6)) {
			state.completedPhases.push(6);
			state.completedPhases.sort();
		}

		// Accept optional summary data
		if (params.summary && typeof params.summary === "object") {
			state.summary = params.summary as OnboardingState["summary"];
		}

		await writeOnboarding(state);

		try {
			context?.broadcast?.("onboarding:update", state);
		} catch {}

		respond(true, state);
	},

	/**
	 * Reset onboarding to Phase 0. Used for "start over" or testing.
	 */
	"onboarding.reset": async ({ respond, context }) => {
		const state: OnboardingState = {
			...DEFAULT_STATE,
			startedAt: new Date().toISOString(),
		};
		await writeOnboarding(state);

		try {
			context?.broadcast?.("onboarding:update", state);
		} catch {}

		respond(true, state);
	},
};
