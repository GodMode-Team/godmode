/**
 * coverage-matrix.mjs — Surface Coverage Tracking for Synthetic User Campaign.
 *
 * Maps archetypes to surfaces with Primary (P) and Secondary (S) designations.
 * Primary flows run every loop; secondary flows rotate every 3rd loop
 * so full coverage is achieved by loop 3.
 */

// ── Coverage Matrix Definition ─────────────────────────────────────
//
// Each archetype maps to surfaces with:
//   P = Primary — runs every loop
//   S = Secondary — rotates, runs every 3rd loop
//   - = not tested for this archetype
//

const MATRIX = {
  marcus: {
    onboarding:       "P",
    chat:             "P",
    memory:           "P",
    "today-tab":      "P",
    "second-brain":   "P",
    workspaces:       "S",
    queue:            "S",
    settings:         "S",
  },
  diana: {
    workspaces:         "P",
    "shared-workspaces":"P",
    dashboards:         "P",
    queue:              "P",
    "meeting-prep":     "P",
    integrations:       "P",
    onboarding:         "S",
    chat:               "S",
    settings:           "S",
  },
  "dr-mike": {
    chat:             "P",
    "second-brain":   "P",
    memory:           "P",
    "today-tab":      "P",
    onboarding:       "S",
    workspaces:       "S",
    settings:         "S",
  },
  sarah: {
    onboarding:       "P",
    chat:             "P",
    "today-tab":      "P",
    settings:         "P",
    memory:           "S",
    workspaces:       "S",
    dashboards:       "S",
  },
  raj: {
    integrations:     "P",
    settings:         "P",
    queue:            "P",
    workspaces:       "P",
    chat:             "S",
    dashboards:       "S",
    "second-brain":   "S",
  },
  alex: {
    settings:         "P",
    integrations:     "P",
    workspaces:       "P",
    queue:            "P",
    chat:             "S",
    dashboards:       "S",
    memory:           "S",
  },
  frankie: {
    onboarding:       "P",
    chat:             "P",
    "today-tab":      "P",
    "second-brain":   "S",
    memory:           "S",
    settings:         "S",
  },
};

// ── Surface to Flow Module Mapping ─────────────────────────────────

const SURFACE_TO_FLOW = {
  onboarding:          "onboarding.mjs",
  chat:                "chat-basic.mjs",
  "chat-advanced":     "chat-advanced.mjs",
  memory:              "memory.mjs",
  "today-tab":         "today-tab.mjs",
  "second-brain":      "second-brain.mjs",
  workspaces:          "workspaces.mjs",
  "shared-workspaces": "workspaces.mjs",   // reuses workspaces flow
  dashboards:          "dashboards.mjs",
  queue:               "queue.mjs",
  "meeting-prep":      "meeting-loop.mjs",
  integrations:        "composio.mjs",
  settings:            "settings.mjs",
  "custom-tabs":       "custom-tabs.mjs",
  paperclip:           "paperclip.mjs",
  team:                "team.mjs",
  composio:            "composio.mjs",
  "work-tab":          "work-tab.mjs",
  "error-states":      "error-states.mjs",
  mobile:              "mobile.mjs",
};

// ── Exports ────────────────────────────────────────────────────────

/**
 * Get the full coverage matrix (archetype x surface -> P/S/-).
 * @returns {Record<string, Record<string, "P"|"S">>}
 */
export function getCoverageMatrix() {
  return structuredClone(MATRIX);
}

/**
 * Get the list of all known surfaces.
 * @returns {string[]}
 */
export function getAllSurfaces() {
  return Object.keys(SURFACE_TO_FLOW);
}

/**
 * Get the flow module filename for a surface.
 * @param {string} surfaceName - e.g. "onboarding", "chat", "today-tab"
 * @returns {string|null} - e.g. "onboarding.mjs" or null if unknown
 */
export function getFlowModule(surfaceName) {
  return SURFACE_TO_FLOW[surfaceName] || null;
}

/**
 * Get which flows (surfaces) to run for an archetype in a given loop.
 *
 * - All Primary (P) flows run every loop.
 * - Secondary (S) flows rotate: each S flow runs every 3rd loop,
 *   ensuring full S coverage by loop 3.
 *
 * @param {string} archetypeName - e.g. "marcus", "diana"
 * @param {number} loopNum - 1-based loop number
 * @returns {string[]} - List of surface names to test
 */
export function getFlowsForLoop(archetypeName, loopNum) {
  const archetypeEntry = MATRIX[archetypeName];
  if (!archetypeEntry) {
    console.warn(`[coverage-matrix] Unknown archetype: ${archetypeName}`);
    return [];
  }

  const surfaces = Object.entries(archetypeEntry);
  const primaryFlows = [];
  const secondaryFlows = [];

  for (const [surface, priority] of surfaces) {
    if (priority === "P") {
      primaryFlows.push(surface);
    } else if (priority === "S") {
      secondaryFlows.push(surface);
    }
  }

  // Secondary flows rotate: distribute across 3 loop slots
  // Loop 1 -> slot 0, Loop 2 -> slot 1, Loop 3 -> slot 2, Loop 4 -> slot 0, ...
  const slot = (loopNum - 1) % 3;
  const activeSecondary = secondaryFlows.filter((_, idx) => idx % 3 === slot);

  return [...primaryFlows, ...activeSecondary];
}

/**
 * Get the priority designation for a specific archetype+surface pair.
 * @param {string} archetypeName
 * @param {string} surfaceName
 * @returns {"P"|"S"|"-"}
 */
export function getSurfacePriority(archetypeName, surfaceName) {
  return MATRIX[archetypeName]?.[surfaceName] || "-";
}

/**
 * Get a human-readable summary of coverage for an archetype.
 * @param {string} archetypeName
 * @returns {{ primary: string[], secondary: string[], total: number }}
 */
export function getArchetypeCoverage(archetypeName) {
  const entry = MATRIX[archetypeName];
  if (!entry) return { primary: [], secondary: [], total: 0 };

  const primary = [];
  const secondary = [];
  for (const [surface, priority] of Object.entries(entry)) {
    if (priority === "P") primary.push(surface);
    else if (priority === "S") secondary.push(surface);
  }

  return { primary, secondary, total: primary.length + secondary.length };
}
