/**
 * Therapy session RPC handlers — ephemeral, privacy-preserving conversations.
 * Fully standalone (no core infrastructure dependencies).
 */

import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import {
	addEphemeralMessage,
	cleanupExpiredSessions,
	createEphemeralSession,
	endSenderSession,
	formatTimeRemaining,
	getActiveSenderSession,
	getEphemeralMessages,
	getEphemeralSession,
	listEphemeralSessions,
} from "../ephemeral.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const start: GatewayRequestHandler = async ({ params, respond }) => {
	const { senderId } = params as { senderId?: string };
	if (!senderId || typeof senderId !== "string") {
		respond(false, undefined, { code: "INVALID_REQUEST", message: "senderId is required" });
		return;
	}

	const existing = getActiveSenderSession(senderId);
	if (existing) {
		respond(true, {
			sessionId: existing.sessionId,
			expiresAt: existing.config.expiresAt,
			expiresIn: formatTimeRemaining(existing.config),
			resumed: true,
			message: "Resuming your existing therapy session.",
		});
		return;
	}

	const session = await createEphemeralSession({ senderId, sessionType: "therapy" });

	const welcomeMessage = `Hey. This is your private space - nothing here gets saved or remembered.

You can say whatever you need to say. This session will auto-delete in 24 hours.

What's on your mind?`;

	await addEphemeralMessage({ sessionId: session.sessionId, role: "assistant", content: welcomeMessage });

	respond(true, {
		sessionId: session.sessionId,
		expiresAt: session.config.expiresAt,
		expiresIn: formatTimeRemaining(session.config),
		resumed: false,
		welcomeMessage,
	});
};

const send: GatewayRequestHandler = async ({ params, respond }) => {
	const { sessionId, message } = params as { sessionId?: string; message?: string };
	if (!sessionId || typeof sessionId !== "string") {
		respond(false, undefined, { code: "INVALID_REQUEST", message: "sessionId is required" });
		return;
	}
	if (!message || typeof message !== "string" || message.trim() === "") {
		respond(false, undefined, { code: "INVALID_REQUEST", message: "message is required" });
		return;
	}

	const session = getEphemeralSession(sessionId);
	if (!session) {
		respond(false, undefined, { code: "NOT_FOUND", message: "Session not found or expired" });
		return;
	}

	await addEphemeralMessage({ sessionId, role: "user", content: message.trim() });
	const response = generateTherapeuticResponse(message.trim());
	const assistantMsg = await addEphemeralMessage({ sessionId, role: "assistant", content: response });

	respond(true, { response: assistantMsg, expiresIn: formatTimeRemaining(session.config) });
};

const end: GatewayRequestHandler = async ({ params, respond }) => {
	const { senderId } = params as { senderId?: string };
	if (!senderId || typeof senderId !== "string") {
		respond(false, undefined, { code: "INVALID_REQUEST", message: "senderId is required" });
		return;
	}

	const session = getActiveSenderSession(senderId);
	if (!session) {
		respond(true, { ended: false, message: "No active therapy session found." });
		return;
	}

	endSenderSession(senderId);

	respond(true, {
		ended: true,
		sessionId: session.sessionId,
		message: `Thank you for sharing. Take what serves you, leave the rest.\n\nThis session will be completely erased in ${formatTimeRemaining(session.config)}.\n\nTake care of yourself.`,
		expiresIn: formatTimeRemaining(session.config),
	});
};

const status: GatewayRequestHandler = async ({ params, respond }) => {
	const { senderId } = params as { senderId?: string };
	if (!senderId || typeof senderId !== "string") {
		respond(false, undefined, { code: "INVALID_REQUEST", message: "senderId is required" });
		return;
	}

	const session = getActiveSenderSession(senderId);
	if (!session) {
		respond(true, { active: false });
		return;
	}

	respond(true, {
		active: true,
		sessionId: session.sessionId,
		expiresIn: formatTimeRemaining(session.config),
		expiresAt: session.config.expiresAt,
		messageCount: session.messages.length,
	});
};

const history: GatewayRequestHandler = async ({ params, respond }) => {
	const { sessionId, limit } = params as { sessionId?: string; limit?: number };
	if (!sessionId || typeof sessionId !== "string") {
		respond(false, undefined, { code: "INVALID_REQUEST", message: "sessionId is required" });
		return;
	}

	const session = getEphemeralSession(sessionId);
	if (!session) {
		respond(false, undefined, { code: "NOT_FOUND", message: "Session not found or expired" });
		return;
	}

	respond(true, { messages: getEphemeralMessages(sessionId, limit ?? 100), expiresIn: formatTimeRemaining(session.config) });
};

const list: GatewayRequestHandler = async ({ respond }) => {
	respond(true, { sessions: listEphemeralSessions() });
};

const cleanup: GatewayRequestHandler = async ({ respond }) => {
	respond(true, await cleanupExpiredSessions());
};

// ── Therapeutic response generator ─────────────────────────────────

function generateTherapeuticResponse(userMessage: string): string {
	const lower = userMessage.toLowerCase();

	if (lower.includes("suicide") || lower.includes("kill myself") || lower.includes("end my life") || lower.includes("don't want to live")) {
		return `I hear that you're going through something really difficult right now. Your feelings are valid, and I'm glad you're talking about this.

If you're having thoughts of suicide, please reach out to a crisis line:
- National Suicide Prevention Lifeline: 988 (US)
- Crisis Text Line: Text HOME to 741741

You matter. Is there someone you trust who you could talk to right now?`;
	}

	if (lower.includes("angry") || lower.includes("furious") || lower.includes("rage"))
		return "I can feel that anger coming through. Anger often shows us where our boundaries have been crossed, or where something important to us feels threatened. What's underneath that anger for you?";
	if (lower.includes("sad") || lower.includes("depressed") || lower.includes("hopeless"))
		return "That sounds really heavy. Sadness often needs space to just be felt, without trying to fix it right away. What does this sadness want you to know?";
	if (lower.includes("anxious") || lower.includes("worried") || lower.includes("scared"))
		return "Anxiety can feel so overwhelming when it takes hold. I'm curious - where do you feel that in your body right now? Sometimes just noticing can help create a little space.";
	if (lower.includes("confused") || lower.includes("don't know"))
		return "It's okay not to know. Sometimes the most honest place to be is in the not-knowing. What would it be like to just sit with that uncertainty for a moment?";
	if (lower.includes("stuck") || lower.includes("trapped"))
		return "Feeling stuck can be exhausting. Sometimes when we feel trapped, there are beliefs or patterns keeping us there that we can't quite see. What do you think might be holding you in this place?";
	if (lower.includes("relationship") || lower.includes("partner") || lower.includes("family"))
		return "Relationships touch some of our deepest needs and fears. What's the hardest part of this situation for you right now?";

	const reflections = [
		"Tell me more about that...",
		"What comes up for you when you sit with that?",
		"That sounds significant. What does that mean to you?",
		"I hear you. What do you think you need right now?",
		"What would it look like if this were okay?",
		"If that feeling could speak, what would it say?",
		"What's the part of this that feels most important to explore?",
	];
	return reflections[userMessage.length % reflections.length];
}

export const therapyHandlers: GatewayRequestHandlers = {
	"therapy.start": start,
	"therapy.send": send,
	"therapy.end": end,
	"therapy.status": status,
	"therapy.history": history,
	"therapy.list": list,
	"therapy.cleanup": cleanup,
};
