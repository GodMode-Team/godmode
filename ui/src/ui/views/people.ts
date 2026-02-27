import { html, nothing } from "lit";

// ===== Types =====

export type Person = {
  id: string;
  name: string;
  emoji?: string;
  company?: string;
  role?: string;
  tags: string[];
  email?: string;
  phone?: string;
  birthday?: string;
  lastContact?: string;
  notes?: string;
  projects?: string[];
};

export type PeopleProps = {
  connected: boolean;
  people: Person[];
  loading?: boolean;
  error?: string | null;
  selectedId?: string | null;
  searchQuery?: string;
  onRefresh?: () => void;
  onSelectPerson?: (personId: string) => void;
  onBack?: () => void;
  onSearchChange?: (query: string) => void;
  onImportContacts?: (source: "apple" | "google") => void;
};

// ===== Helper Functions =====

function getTopContacts(people: Person[], limit = 5): Person[] {
  return people
    .filter((p) => p.lastContact)
    .toSorted((a, b) => {
      const aTime = new Date(a.lastContact).getTime();
      const bTime = new Date(b.lastContact).getTime();
      return bTime - aTime;
    })
    .slice(0, limit);
}

function groupByTag(people: Person[]): Map<string, Person[]> {
  const groups = new Map<string, Person[]>();
  for (const person of people) {
    if (person.tags.length === 0) {
      const list = groups.get("uncategorized") ?? [];
      list.push(person);
      groups.set("uncategorized", list);
    } else {
      for (const tag of person.tags) {
        const list = groups.get(tag) ?? [];
        list.push(person);
        groups.set(tag, list);
      }
    }
  }
  return groups;
}

function formatLastContact(dateStr: string | undefined): string {
  if (!dateStr) {
    return "";
  }
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}w ago`;
  }
  return `${Math.floor(diffDays / 30)}mo ago`;
}

// ===== Render Functions =====

function renderPersonCard(person: Person, onSelect?: () => void) {
  return html`
    <button class="people-card" @click=${onSelect} style="cursor: pointer; width: 100%; border: none; background: none; text-align: left;">
      <div class="people-card-main">
        <span class="people-avatar">${person.emoji ?? "👤"}</span>
        <div class="people-card-info">
          <span class="people-name">${person.name}</span>
          ${
            person.company || person.role
              ? html`<span class="people-role">${[person.role, person.company].filter(Boolean).join(" at ")}</span>`
              : nothing
          }
        </div>
        ${
          person.lastContact
            ? html`<span class="people-last-contact">${formatLastContact(person.lastContact)}</span>`
            : nothing
        }
      </div>
      ${
        person.tags.length > 0
          ? html`
            <div class="people-tags">
              ${person.tags.map((tag) => html`<span class="people-tag">${tag}</span>`)}
            </div>
          `
          : nothing
      }
    </button>
  `;
}

function renderPersonDetail(person: Person, onBack?: () => void) {
  return html`
    <div class="my-day-card people-detail">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          ${
            onBack
              ? html`<button class="people-back-btn" @click=${onBack}>← Back</button>`
              : nothing
          }
          <span class="my-day-card-icon">${person.emoji ?? "👤"}</span>
          <span>${person.name}</span>
        </div>
      </div>
      <div class="my-day-card-content">
        ${
          person.company || person.role
            ? html`<div class="people-detail-row">
              <span class="people-detail-label">Role</span>
              <span>${[person.role, person.company].filter(Boolean).join(" at ")}</span>
            </div>`
            : nothing
        }
        ${
          person.email
            ? html`<div class="people-detail-row">
              <span class="people-detail-label">Email</span>
              <a href="mailto:${person.email}">${person.email}</a>
            </div>`
            : nothing
        }
        ${
          person.phone
            ? html`<div class="people-detail-row">
              <span class="people-detail-label">Phone</span>
              <span>${person.phone}</span>
            </div>`
            : nothing
        }
        ${
          person.birthday
            ? html`<div class="people-detail-row">
              <span class="people-detail-label">Birthday</span>
              <span>${person.birthday}</span>
            </div>`
            : nothing
        }
        ${
          person.lastContact
            ? html`<div class="people-detail-row">
              <span class="people-detail-label">Last Contact</span>
              <span>${formatLastContact(person.lastContact)}</span>
            </div>`
            : nothing
        }
        ${
          person.tags.length > 0
            ? html`<div class="people-detail-row">
              <span class="people-detail-label">Tags</span>
              <div class="people-tags">
                ${person.tags.map((tag) => html`<span class="people-tag">${tag}</span>`)}
              </div>
            </div>`
            : nothing
        }
        ${
          person.projects && person.projects.length > 0
            ? html`<div class="people-detail-row">
              <span class="people-detail-label">Projects</span>
              <div class="people-tags">
                ${person.projects.map((p) => html`<span class="people-tag">${p}</span>`)}
              </div>
            </div>`
            : nothing
        }
        ${
          person.notes
            ? html`<div class="people-detail-row">
              <span class="people-detail-label">Notes</span>
              <span style="white-space: pre-wrap;">${person.notes}</span>
            </div>`
            : nothing
        }
      </div>
    </div>
  `;
}

// ===== Main Render Function =====

export function renderPeople(props: PeopleProps) {
  const {
    people,
    loading,
    error,
    selectedId,
    searchQuery = "",
    onRefresh,
    onSelectPerson,
    onBack,
    onSearchChange,
    onImportContacts,
  } = props;

  if (loading) {
    return html`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading contacts...</span>
        </div>
      </div>
    `;
  }

  if (error) {
    return html`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${error}</span>
          ${
            onRefresh
              ? html`<button class="retry-button" @click=${onRefresh}>Retry</button>`
              : nothing
          }
        </div>
      </div>
    `;
  }

  // Detail view
  if (selectedId) {
    const person = people.find((p) => p.id === selectedId);
    if (person) {
      return html`
        <div class="my-day-container">
          <div class="my-day-header">
            <div class="my-day-header-left">
              <h1 class="my-day-title">People</h1>
              <p class="my-day-subtitle">Contacts, relationships, and follow-up suggestions.</p>
            </div>
          </div>
          <div class="my-day-grid" style="grid-template-columns: 1fr;">
            ${renderPersonDetail(person, onBack)}
          </div>
        </div>
      `;
    }
  }

  // Filter by search
  const filtered = searchQuery
    ? people.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.company ?? "").toLowerCase().includes(q) ||
          (p.role ?? "").toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : people;

  const tagGroups = groupByTag(filtered);
  const topContacts = getTopContacts(people);

  return html`
    <div class="my-day-container">
      <div class="my-day-header">
        <div class="my-day-header-left">
          <h1 class="my-day-title">People</h1>
          <p class="my-day-subtitle">Contacts, relationships, and follow-up suggestions.</p>
        </div>
        <div class="my-day-header-right">
          <div class="my-day-summary-stat">
            <span class="stat-value">${people.length}</span>
            <span class="stat-label">Contact${people.length !== 1 ? "s" : ""}</span>
          </div>
          ${
            onImportContacts
              ? html`
                <div class="my-day-summary-divider"></div>
                <div style="position: relative;">
                  <button
                    class="my-day-refresh-btn"
                    @click=${(e: Event) => {
                      const btn = e.currentTarget as HTMLElement;
                      const menu = btn.nextElementSibling as HTMLElement;
                      menu.style.display = menu.style.display === "block" ? "none" : "block";
                    }}
                    title="Import Contacts"
                  >
                    ⬇ Import
                  </button>
                  <div
                    style="display: none; position: absolute; top: 100%; right: 0; margin-top: 4px; background: var(--mc-bg); border: 1px solid var(--mc-border); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 160px; z-index: 1000;"
                    @click=${(e: Event) => {
                      const menu = e.currentTarget as HTMLElement;
                      menu.style.display = "none";
                    }}
                  >
                    <button
                      @click=${() => onImportContacts("apple")}
                      style="display: block; width: 100%; padding: 10px 16px; border: none; background: none; color: var(--mc-text); text-align: left; cursor: pointer; font-size: 14px;"
                      onmouseover="this.style.background='var(--mc-hover)'"
                      onmouseout="this.style.background='none'"
                    >
                      📱 Set up Apple Contacts (via Chat)
                    </button>
                    <button
                      @click=${() => onImportContacts("google")}
                      style="display: block; width: 100%; padding: 10px 16px; border: none; background: none; color: var(--mc-text); text-align: left; cursor: pointer; font-size: 14px;"
                      onmouseover="this.style.background='var(--mc-hover)'"
                      onmouseout="this.style.background='none'"
                    >
                      🌐 Set up Google Contacts (via Chat)
                    </button>
                  </div>
                </div>
              `
              : nothing
          }
          ${
            onRefresh
              ? html`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${onRefresh} title="Refresh">↻</button>
              `
              : nothing
          }
        </div>
      </div>

      ${
        people.length > 3
          ? html`
            <div style="margin-bottom: 12px;">
              <input
                type="text"
                placeholder="Search contacts..."
                .value=${searchQuery}
                @input=${(e: Event) => onSearchChange?.((e.target as HTMLInputElement).value)}
                style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--mc-border); background: var(--mc-bg); color: var(--mc-text); font-size: 14px;"
              />
            </div>
          `
          : nothing
      }

      <div class="my-day-grid" style="grid-template-columns: 1fr;">
        ${
          filtered.length === 0
            ? html`
              <div class="my-day-card">
                <div class="my-day-card-content">
                  <div class="my-day-empty">
                    ${
                      people.length === 0
                        ? "No contacts yet. Use chat to add people or run onboarding."
                        : "No contacts match your search."
                    }
                  </div>
                </div>
              </div>
            `
            : nothing
        }
        ${
          !searchQuery && topContacts.length > 0
            ? html`
              <div class="my-day-card">
                <div class="my-day-card-header">
                  <div class="my-day-card-title">
                    <span class="my-day-card-icon">⭐</span>
                    <span>Top Contacts</span>
                  </div>
                  <div class="my-day-card-count">${topContacts.length}</div>
                </div>
                <div class="my-day-card-content">
                  ${topContacts.map((person) =>
                    renderPersonCard(person, () => onSelectPerson?.(person.id)),
                  )}
                </div>
              </div>
            `
            : nothing
        }
        ${Array.from(tagGroups.entries()).map(
          ([tag, tagPeople]) => html`
            <div class="my-day-card">
              <div class="my-day-card-header">
                <div class="my-day-card-title">
                  <span class="my-day-card-icon">${tag === "uncategorized" ? "📋" : "🏷"}</span>
                  <span>${tag === "uncategorized" ? "Other" : tag}</span>
                </div>
                <div class="my-day-card-count">${tagPeople.length}</div>
              </div>
              <div class="my-day-card-content">
                ${tagPeople.map((person) =>
                  renderPersonCard(person, () => onSelectPerson?.(person.id)),
                )}
              </div>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}
