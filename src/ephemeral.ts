/**
 * Ephemeral session storage — isolated, privacy-preserving conversations.
 * Stored in /tmp with auto-cleanup. Not indexed to memory.
 *
 * Self-contained module (no core infrastructure dependencies).
 */

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// ── Config / Types ─────────────────────────────────────────────────

export type EphemeralSessionType = "therapy";

export type EphemeralSessionConfig = {
	expiresAt: number;
	tempStoragePath: string;
	skipMemoryIndex: true;
	sessionType: EphemeralSessionType;
	startedAt: number;
};

export type EphemeralMessage = {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: number;
};

export type EphemeralSession = {
	sessionId: string;
	senderId: string;
	config: EphemeralSessionConfig;
	messages: EphemeralMessage[];
	createdAt: number;
	updatedAt: number;
};

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const DIR_PREFIX = "godmode-therapy";

function createConfig(sessionType: EphemeralSessionType, tempStoragePath: string): EphemeralSessionConfig {
	const now = Date.now();
	return { expiresAt: now + TTL_MS, tempStoragePath, skipMemoryIndex: true, sessionType, startedAt: now };
}

function isExpired(config: EphemeralSessionConfig): boolean {
	return Date.now() > config.expiresAt;
}

export function formatTimeRemaining(config: EphemeralSessionConfig): string {
	const remaining = config.expiresAt - Date.now();
	if (remaining <= 0) return "expired";
	const hours = Math.floor(remaining / (60 * 60 * 1000));
	const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
	return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

// ── In-Memory Store ────────────────────────────────────────────────

const sessions = new Map<string, EphemeralSession>();
const senderToSession = new Map<string, string>();

function baseDir(): string {
	return path.join(os.tmpdir(), DIR_PREFIX);
}

function sessionDir(sessionId: string): string {
	return path.join(baseDir(), sessionId);
}

async function saveMeta(session: EphemeralSession): Promise<void> {
	const metaPath = path.join(sessionDir(session.sessionId), "meta.json");
	const meta = {
		sessionId: session.sessionId,
		senderId: session.senderId,
		config: session.config,
		createdAt: session.createdAt,
		updatedAt: session.updatedAt,
		messageCount: session.messages.length,
	};
	await fs.promises.writeFile(metaPath, JSON.stringify(meta, null, 2), "utf-8");
}

async function appendTranscript(sessionId: string, message: EphemeralMessage): Promise<void> {
	const transcriptPath = path.join(sessionDir(sessionId), "transcript.jsonl");
	await fs.promises.appendFile(transcriptPath, JSON.stringify(message) + "\n", "utf-8");
}

// ── Public API ─────────────────────────────────────────────────────

export async function createEphemeralSession(params: {
	senderId: string;
	sessionType: EphemeralSessionType;
}): Promise<EphemeralSession> {
	const { senderId, sessionType } = params;
	const sessionId = `eph-${sessionType}-${crypto.randomUUID()}`;
	const dir = sessionDir(sessionId);
	await fs.promises.mkdir(dir, { recursive: true });

	const config = createConfig(sessionType, dir);
	const now = Date.now();
	const session: EphemeralSession = { sessionId, senderId, config, messages: [], createdAt: now, updatedAt: now };

	sessions.set(sessionId, session);
	senderToSession.set(senderId, sessionId);
	await saveMeta(session);
	return session;
}

export function getEphemeralSession(sessionId: string): EphemeralSession | null {
	const session = sessions.get(sessionId);
	if (!session) return null;
	if (isExpired(session.config)) {
		void cleanupSession(sessionId);
		return null;
	}
	return session;
}

export function getActiveSenderSession(senderId: string): EphemeralSession | null {
	const sessionId = senderToSession.get(senderId);
	if (!sessionId) return null;
	return getEphemeralSession(sessionId);
}

export function endSenderSession(senderId: string): void {
	senderToSession.delete(senderId);
}

export async function addEphemeralMessage(params: {
	sessionId: string;
	role: "user" | "assistant";
	content: string;
}): Promise<EphemeralMessage | null> {
	const session = getEphemeralSession(params.sessionId);
	if (!session) return null;

	const message: EphemeralMessage = {
		id: crypto.randomUUID(),
		role: params.role,
		content: params.content,
		timestamp: Date.now(),
	};
	session.messages.push(message);
	session.updatedAt = Date.now();
	await appendTranscript(params.sessionId, message);
	return message;
}

export function getEphemeralMessages(sessionId: string, limit?: number): EphemeralMessage[] {
	const session = getEphemeralSession(sessionId);
	if (!session) return [];
	if (limit && limit > 0) return session.messages.slice(-limit);
	return [...session.messages];
}

export function listEphemeralSessions(): Array<{
	sessionId: string;
	senderId: string;
	sessionType: EphemeralSessionType;
	messageCount: number;
	expiresAt: number;
	createdAt: number;
}> {
	const result: Array<{
		sessionId: string;
		senderId: string;
		sessionType: EphemeralSessionType;
		messageCount: number;
		expiresAt: number;
		createdAt: number;
	}> = [];
	for (const session of sessions.values()) {
		if (!isExpired(session.config)) {
			result.push({
				sessionId: session.sessionId,
				senderId: session.senderId,
				sessionType: session.config.sessionType,
				messageCount: session.messages.length,
				expiresAt: session.config.expiresAt,
				createdAt: session.createdAt,
			});
		}
	}
	return result;
}

async function cleanupSession(sessionId: string): Promise<void> {
	const session = sessions.get(sessionId);
	if (session) {
		senderToSession.delete(session.senderId);
		sessions.delete(sessionId);
	}
	try {
		await fs.promises.rm(sessionDir(sessionId), { recursive: true, force: true });
	} catch {
		// ignore
	}
}

export async function cleanupExpiredSessions(): Promise<{ cleaned: number; errors: number }> {
	let cleaned = 0;
	let errors = 0;

	for (const [sessionId, session] of sessions) {
		if (isExpired(session.config)) {
			try {
				await cleanupSession(sessionId);
				cleaned++;
			} catch {
				errors++;
			}
		}
	}

	try {
		const entries = await fs.promises.readdir(baseDir(), { withFileTypes: true });
		for (const entry of entries) {
			if (!entry.isDirectory() || !entry.name.startsWith("eph-")) continue;
			const dir = path.join(baseDir(), entry.name);
			const metaPath = path.join(dir, "meta.json");
			try {
				const raw = await fs.promises.readFile(metaPath, "utf-8");
				const meta = JSON.parse(raw) as { config?: { expiresAt?: number } };
				if (meta.config?.expiresAt && Date.now() > meta.config.expiresAt) {
					await fs.promises.rm(dir, { recursive: true, force: true });
					cleaned++;
				}
			} catch {
				try {
					const stat = await fs.promises.stat(dir);
					if (Date.now() - stat.mtimeMs > TTL_MS) {
						await fs.promises.rm(dir, { recursive: true, force: true });
						cleaned++;
					}
				} catch {
					errors++;
				}
			}
		}
	} catch {
		// base dir doesn't exist yet
	}

	return { cleaned, errors };
}
