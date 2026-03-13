/**
 * evidence.ts — Shared evidence checking and artifact extraction for agent outputs.
 *
 * Extracted from queue-processor.ts so both the queue completion handler and
 * the Paperclip adapter's post-completion pipeline can verify output quality
 * using the same rules.
 */

// ── Types ────────────────────────────────────────────────────────

export type ExtractedArtifact = {
  type: "url" | "file_path" | "pr_link" | "code_block" | "command_output";
  value: string;
};

export type EvidenceResult = {
  passed: boolean;
  missing: string[];
  artifacts: ExtractedArtifact[];
  /** Legacy compat: single-line reason string (first missing item or empty) */
  reason: string;
  /** Legacy compat: hint for retry prompts */
  hint: string;
};

export type TaskType =
  | "coding"
  | "research"
  | "creative"
  | "review"
  | "ops"
  | "task"
  // Extended types from QueueItemType that map to generic "task" rules
  | "analysis"
  | "url"
  | "idea";

// ── Artifact Extraction ──────────────────────────────────────────

/** Extract artifacts (URLs, file paths, PR links, code blocks, command output) from output text. */
export function extractArtifacts(content: string): ExtractedArtifact[] {
  const artifacts: ExtractedArtifact[] = [];
  const seen = new Set<string>();

  function add(type: ExtractedArtifact["type"], value: string): void {
    if (!seen.has(value)) {
      artifacts.push({ type, value });
      seen.add(value);
    }
  }

  // PR links (check before generic URLs so they get the specific type)
  const prMatches = content.match(/https:\/\/github\.com\/[^\s)]+\/pull\/\d+/g);
  if (prMatches) for (const m of prMatches) add("pr_link", m);

  // Commit links
  const commitMatches = content.match(/https:\/\/github\.com\/[^\s)]+\/commit\/[0-9a-f]{7,}/g);
  if (commitMatches) for (const m of commitMatches) add("pr_link", m);

  // Code blocks
  const codeBlockMatches = content.match(/```[\s\S]*?```/g);
  if (codeBlockMatches) {
    for (const block of codeBlockMatches) {
      // Only count substantial code blocks (>30 chars inside the fences)
      const inner = block.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
      if (inner.trim().length > 30) add("code_block", inner.trim().slice(0, 200));
    }
  }

  // Command output (lines starting with $ or common shell prompts)
  for (const line of content.split("\n")) {
    if (/^\s*\$\s+\S+/.test(line)) {
      add("command_output", line.trim().slice(0, 200));
    }
  }

  // Generic URLs (skip already-captured PR/commit links)
  for (const line of content.split("\n")) {
    const urlMatch = line.match(/https?:\/\/[^\s)>]+/g);
    if (urlMatch) {
      for (const m of urlMatch) {
        if (!seen.has(m)) add("url", m);
      }
    }

    // File paths
    const pathMatch = line.match(/(?:^|\s)(\/[\w./-]+\.\w{1,10})\b/g);
    if (pathMatch) {
      for (const m of pathMatch) {
        const cleaned = m.trim();
        if (!seen.has(cleaned)) add("file_path", cleaned);
      }
    }
  }

  return artifacts.slice(0, 30);
}

// ── Evidence Checking ────────────────────────────────────────────

/** Check if output meets evidence requirements for the given task type. */
export function checkEvidence(taskType: TaskType, output: string): EvidenceResult {
  const artifacts = extractArtifacts(output);

  if (!output || output.trim().length < 50) {
    return {
      passed: false,
      missing: ["substantive output (>50 characters)"],
      artifacts,
      reason: "Output too short (< 50 characters)",
      hint: "a substantive response with details, findings, or deliverables",
    };
  }

  switch (taskType) {
    case "coding": {
      const hasPr = artifacts.some((a) => a.type === "pr_link");
      const hasCode = artifacts.some((a) => a.type === "code_block");
      const hasFilePaths = /\.(ts|js|py|go|rs|java|tsx|jsx|css|html|md)\b/.test(output);
      const hasDiff = /diff --git/.test(output);

      if (hasPr || hasCode || hasFilePaths || hasDiff) {
        return { passed: true, missing: [], artifacts, reason: "", hint: "" };
      }
      return {
        passed: false,
        missing: ["code blocks", "PR/commit links", "file paths"],
        artifacts,
        reason: "No code artifacts found (PR link, code block, or file paths)",
        hint: "a PR link, code diff, or code blocks with file paths",
      };
    }

    case "research": {
      const urlCount = artifacts.filter((a) => a.type === "url" || a.type === "pr_link").length;
      if (urlCount >= 1) {
        return { passed: true, missing: [], artifacts, reason: "", hint: "" };
      }
      return {
        passed: false,
        missing: ["source URLs (at least 1)"],
        artifacts,
        reason: "No source URLs found in research output",
        hint: "at least one source URL (https://...) to back up findings",
      };
    }

    case "creative": {
      // Must contain substantial text (>200 chars of non-boilerplate)
      const stripped = output
        .replace(/```[\s\S]*?```/g, "")
        .replace(/#{1,6}\s+/g, "")
        .replace(/[-*]\s+/g, "")
        .trim();
      if (stripped.length > 200) {
        return { passed: true, missing: [], artifacts, reason: "", hint: "" };
      }
      return {
        passed: false,
        missing: ["substantial creative content (>200 chars)"],
        artifacts,
        reason: "Creative output too thin — less than 200 chars of content",
        hint: "substantial, publication-ready content",
      };
    }

    case "review": {
      const hasFeedbackTerms = /\b(issue|bug|fix|suggest|recommend|concern|improvement|finding|approve|reject)\b/i.test(output);
      if (hasFeedbackTerms) {
        return { passed: true, missing: [], artifacts, reason: "", hint: "" };
      }
      return {
        passed: false,
        missing: ["specific review feedback (issues, suggestions, recommendations)"],
        artifacts,
        reason: "Missing file references or review verdict",
        hint: "specific file paths and review findings/recommendations",
      };
    }

    case "ops": {
      const hasCommand = artifacts.some((a) => a.type === "command_output");
      const hasShellBlock = /```(sh|bash|shell|zsh)?[\s\S]+```/.test(output);
      const hasStatus = /\b(completed|done|success|configured|installed|deployed|running)\b/i.test(output);

      if (hasCommand || hasShellBlock || hasStatus) {
        return { passed: true, missing: [], artifacts, reason: "", hint: "" };
      }
      return {
        passed: false,
        missing: ["command output or status confirmation"],
        artifacts,
        reason: "No command output or status confirmation found",
        hint: "command output, terminal logs, or a status confirmation",
      };
    }

    case "analysis": {
      const hasData = /\b(data|metric|statistic|number|percent|trend|comparison|chart)\b/i.test(output);
      const hasConclusion = /\b(conclusion|finding|insight|recommend|result|summary)\b/i.test(output);
      if (hasData && hasConclusion) {
        return { passed: true, missing: [], artifacts, reason: "", hint: "" };
      }
      return {
        passed: false,
        missing: ["data references", "analytical conclusions"],
        artifacts,
        reason: "Missing data references or analytical conclusions",
        hint: "data references and analytical conclusions/recommendations",
      };
    }

    // Generic types always pass
    case "task":
    case "url":
    case "idea":
    default:
      return { passed: true, missing: [], artifacts, reason: "", hint: "" };
  }
}
