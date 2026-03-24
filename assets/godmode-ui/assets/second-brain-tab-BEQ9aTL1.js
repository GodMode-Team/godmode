import{d as w,b as i,A as a,o as k,g as E,r as d,t as C}from"./lit-core-CTInmNPB.js";import{a as m,o as P}from"./index-BSmYZmPE.js";import{a as _}from"./views-settings-DqDrIl47.js";import{f as T}from"./ctrl-settings-C0Jr7LNg.js";import"./markdown-i_gIkIP3.js";async function A(e){if(!e.client||!e.connected)return;const n=e.secondBrainSubtab??"identity";e.secondBrainLoading=!0,e.secondBrainError=null;try{if(n==="identity"){const s=await e.client.request("secondBrain.identity",{});e.secondBrainIdentity=s}else if(n==="knowledge"){const[s,t,l]=await Promise.all([e.client.request("secondBrain.memoryBank",{}),e.client.request("secondBrain.research",{}),e.client.request("secondBrain.fileTree",{depth:4})]);e.secondBrainMemoryBank=s,e.secondBrainResearchData=t,e.secondBrainFileTree=l.tree??[],e.secondBrainBrowsingFolder=null,e.secondBrainFolderEntries=null,e.secondBrainFolderName=null}else if(n==="context"){const[s,t,l]=await Promise.all([e.client.request("secondBrain.aiPacket",{}),e.client.request("secondBrain.sources",{}),e.client.request("secondBrain.vaultHealth",{})]);e.secondBrainAiPacket=s,e.secondBrainSourcesData=t,e.secondBrainVaultHealth=l}}catch(s){console.error("[SecondBrain] Failed to load:",s),e.secondBrainError=s instanceof Error?s.message:"Failed to load Second Brain data"}finally{e.secondBrainLoading=!1}}async function L(e,n){if(!(!e.client||!e.connected)){e.secondBrainLoading=!0;try{const s=await e.client.request("secondBrain.memoryBank",{folder:n});e.secondBrainBrowsingFolder=s.folder,e.secondBrainFolderName=s.folderName,e.secondBrainFolderEntries=s.entries}catch(s){console.error("[SecondBrain] Failed to browse folder:",s),e.secondBrainError=s instanceof Error?s.message:"Failed to browse folder"}finally{e.secondBrainLoading=!1}}}async function N(e){if(!(!e.client||!e.connected)){e.secondBrainSyncing=!0;try{const n=await e.client.request("secondBrain.sync",{});e.secondBrainAiPacket={snapshot:n.snapshot??null}}catch(n){console.error("[SecondBrain] Sync failed:",n),e.secondBrainError=n instanceof Error?n.message:"Sync failed"}finally{e.secondBrainSyncing=!1}}}var D=Object.defineProperty,R=Object.getOwnPropertyDescriptor,c=(e,n,s,t)=>{for(var l=t>1?void 0:t?R(n,s):n,h=e.length-1,u;h>=0;h--)(u=e[h])&&(l=(t?u(n,s,l):u(l))||l);return t&&l&&D(n,s,l),l};function y(e){if(!e)return"";try{return T(new Date(e).getTime())}catch{return""}}function B(e){return i`<div class="second-brain-md-body">${k(_(e))}</div>`}function z(e){const{identity:n}=e;return!n||n.files.length===0?i`
      <div class="second-brain-panel">
        <div class="second-brain-empty-block">
          <div class="second-brain-empty-icon">\u{1F464}</div>
          <div class="second-brain-empty-title">No identity files found</div>
          <div class="second-brain-empty-hint">Tell your ally about yourself to start building your profile. Your identity helps the ally personalize everything.</div>
          <button class="sb-chat-btn" @click=${()=>e.onSaveViaChat()} style="margin-top: 12px;">
            Tell your ally about you
          </button>
        </div>
      </div>
    `:i`
    <div class="second-brain-panel">
      <div class="sb-identity-actions" style="display: flex; gap: 8px; margin-bottom: 4px;">
        <button class="sb-chat-btn" @click=${()=>e.onSaveViaChat()}>
          \u{1F4AC} Update via Chat
        </button>
      </div>

      <div class="second-brain-entry-list">
        ${n.files.map(s=>i`
          <div class="second-brain-entry" @click=${()=>e.onSelectEntry(s.key)}>
            <div class="second-brain-entry-icon">\u{1F4C4}</div>
            <div class="second-brain-entry-body">
              <div class="second-brain-entry-name">${s.label}</div>
              <div class="second-brain-entry-excerpt">${s.content.slice(0,120).replace(/[#\n]+/g," ").trim()}\u{2026}</div>
            </div>
            ${s.updatedAt?i`<div class="second-brain-entry-meta">${y(s.updatedAt)}</div>`:a}
          </div>
        `)}
      </div>
    </div>
  `}function f(e,n){const s=e.isDirectory;return i`
    <div class="second-brain-entry" @click=${()=>{s?n.onBrowseFolder(e.path):n.onSelectEntry(e.path)}}>
      <div class="second-brain-entry-icon ${s?"second-brain-entry-icon--folder":""}">${s?"📁":"📄"}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${e.name}${s?"/":""}</div>
        ${e.excerpt?i`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:a}
      </div>
      ${e.updatedAt?i`<div class="second-brain-entry-meta">${y(e.updatedAt)}</div>`:a}
    </div>
  `}function I(e,n){const s=e.isDirectory,t=s?"📁":"📑",l=()=>{s?n.onBrowseFolder(e.path):n.onSelectEntry(e.path)},h=e.frontmatter?.title||e.name;return i`
    <div class="second-brain-entry" @click=${l}>
      <div class="second-brain-entry-icon ${s?"second-brain-entry-icon--folder":""}">${t}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${h}${s?"/":""}</div>
        ${e.frontmatter?.url?i`<div class="second-brain-research-url">${e.frontmatter.url}</div>`:a}
        ${e.excerpt&&!s?i`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:a}
        ${e.frontmatter?.tags?.length?i`
          <div class="second-brain-research-tags">
            ${e.frontmatter.tags.map(u=>i`<span class="second-brain-research-tag">${u}</span>`)}
          </div>
        `:a}
      </div>
      ${e.updatedAt?i`<div class="second-brain-entry-meta">${y(e.updatedAt)}</div>`:a}
    </div>
  `}function q(e){return e<1024?`${e}B`:e<1024*1024?`${(e/1024).toFixed(1)}K`:`${(e/(1024*1024)).toFixed(1)}M`}function S(e,n,s=0){return i`
    <div class="sb-file-tree" style="padding-left: ${s*16}px">
      ${e.map(t=>t.type==="folder"?i`
            <details class="sb-tree-folder">
              <summary class="sb-tree-item sb-tree-folder-name">
                <span class="sb-file-icon">\u{1F4C1}</span>
                <span>${t.name}</span>
                ${t.childCount!=null?i`<span class="sb-tree-count">${t.childCount}</span>`:a}
              </summary>
              ${t.children?S(t.children,n,s+1):a}
            </details>
          `:i`
          <button
            class="sb-tree-item sb-tree-file"
            @click=${()=>n.onFileSelect?.(t.path)}
          >
            <span class="sb-file-icon">\u{1F4C4}</span>
            <span class="sb-file-name">${t.name}</span>
            ${t.size!=null?i`<span class="sb-tree-size">${q(t.size)}</span>`:a}
          </button>
        `)}
    </div>
  `}function H(e){const{memoryBank:n,researchData:s,searchQuery:t,browsingFolder:l,folderEntries:h,folderName:u}=e;if(l&&h)return i`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${u??"Folder"}</span>
            <span class="second-brain-section-count">${h.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${h.length>0?h.map(r=>f(r,e)):i`<div class="second-brain-empty-inline">Empty folder</div>`}
          </div>
        </div>
      </div>
    `;if(!(n&&n.totalEntries>0||s&&s.totalEntries>0||e.fileTree&&e.fileTree.length>0))return O("No knowledge found","Start building your second brain by telling your ally about the people, companies, and projects in your life.");const v=(t??"").toLowerCase().trim(),x=r=>v?r.filter(b=>b.name.toLowerCase().includes(v)||b.excerpt.toLowerCase().includes(v)):r,p=e.fileSearchResults;return i`
    <div class="second-brain-panel">
      <div class="second-brain-search knowledge-search">
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Search your second brain..."
          .value=${t??""}
          @input=${r=>{const b=r.target.value;e.onSearch(b),e.onFileSearch?.(b)}}
        />
      </div>

      ${p&&v?i`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F50D} Search Results</span>
            <span class="second-brain-section-count">${p.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${p.length>0?p.map(r=>i`
                  <div class="second-brain-entry" @click=${()=>e.onFileSelect?.(r.path)}>
                    <div class="second-brain-entry-icon">${r.type==="folder"?"📁":"📄"}</div>
                    <div class="second-brain-entry-body">
                      <div class="second-brain-entry-name">${r.name}</div>
                      ${r.matchContext||r.excerpt?i`<div class="second-brain-entry-excerpt">${r.matchContext??r.excerpt}</div>`:a}
                    </div>
                  </div>
                `):i`<div class="second-brain-empty-inline">No results</div>`}
          </div>
        </div>
      `:a}

      ${!v&&n?i`
        ${n.sections.map(r=>{const b=x(r.entries);return r.entries.length===0?a:i`
            <details class="second-brain-section-details">
              <summary class="second-brain-section-header second-brain-section-header--toggle">
                <span class="second-brain-section-title">${r.icon} ${r.label}</span>
                <span class="second-brain-section-count">${r.entries.length}</span>
              </summary>
              <div class="second-brain-entry-list">
                ${b.length>0?b.map(F=>f(F,e)):v?i`<div class="second-brain-empty-inline">No matches</div>`:a}
              </div>
            </details>
          `})}

        ${n.extraFiles.length>0?i`
          <details class="second-brain-section-details">
            <summary class="second-brain-section-header second-brain-section-header--toggle">
              <span class="second-brain-section-title">\u{1F4CB} Reference Files</span>
              <span class="second-brain-section-count">${n.extraFiles.length}</span>
            </summary>
            <div class="second-brain-entry-list">
              ${n.extraFiles.map(r=>f(r,e))}
            </div>
          </details>
        `:a}

        ${n.curated?i`
          <details class="second-brain-section-details">
            <summary class="second-brain-section-header second-brain-section-header--toggle">
              <span class="second-brain-section-title">\u{2B50} Curated Facts</span>
              <span class="second-brain-section-count">${y(n.curated.updatedAt)}</span>
            </summary>
            <div class="second-brain-card">
              <div class="second-brain-card-content">${B(n.curated.content)}</div>
            </div>
          </details>
        `:a}
      `:a}

      ${!v&&s&&s.totalEntries>0?i`
        ${s.categories.map(r=>r.entries.length===0?a:i`
            <details class="second-brain-section-details">
              <summary class="second-brain-section-header second-brain-section-header--toggle">
                <span class="second-brain-section-title">\u{1F50D} ${r.label}</span>
                <span class="second-brain-section-count">${r.entries.length}</span>
              </summary>
              <div class="second-brain-entry-list">
                ${r.entries.map(b=>I(b,e))}
              </div>
            </details>
          `)}
      `:a}

      ${!v&&e.fileTree&&e.fileTree.length>0?i`
        <details class="second-brain-section-details">
          <summary class="second-brain-section-header second-brain-section-header--toggle">
            <span class="second-brain-section-title">\u{1F5C2}\uFE0F Browse All</span>
          </summary>
          ${S(e.fileTree,e)}
        </details>
      `:a}
    </div>
  `}const g={connected:{dot:"●",label:"Connected",cls:"second-brain-source--connected"},available:{dot:"○",label:"Available",cls:"second-brain-source--available"}};function $(e){const n=g[e.status]??g.available;return i`
    <div class="second-brain-source-card ${n.cls}">
      <div class="second-brain-source-icon">${e.icon}</div>
      <div class="second-brain-source-body">
        <div class="second-brain-source-name">${e.name}</div>
        <div class="second-brain-source-desc">${e.description}</div>
        ${e.stats?i`<div class="second-brain-source-stats">${e.stats}</div>`:a}
      </div>
      <div class="second-brain-source-status">
        <span class="second-brain-source-dot" style="color: ${e.status==="connected"?"var(--success, #10b981)":e.status==="available"?"var(--warning, #f59e0b)":"var(--muted)"}">${n.dot}</span>
        <span class="second-brain-source-status-label">${n.label}</span>
        ${e.status==="connected"&&e.lastSync?i`<span class="second-brain-source-sync">${y(e.lastSync)}</span>`:a}
      </div>
    </div>
  `}function Q(e){const{aiPacket:n,sourcesData:s,vaultHealth:t,syncing:l}=e,h=n?.snapshot??null;return i`
    <div class="second-brain-panel">
      <!-- Awareness Snapshot (hero) -->
      <div class="second-brain-section">
        <div class="second-brain-sync-bar">
          <div class="second-brain-sync-info">
            <span class="second-brain-sync-label">Awareness Snapshot</span>
            <span class="second-brain-sync-time">
              ${h?.updatedAt?`Last synced ${y(h.updatedAt)}`:"Not yet synced"}
              ${h?` • ${h.lineCount} lines`:""}
            </span>
          </div>
          <button
            class="second-brain-sync-btn ${l?"syncing":""}"
            ?disabled=${l}
            @click=${()=>e.onSync()}
          >
            ${l?"Syncing...":"⚡ Sync Now"}
          </button>
        </div>

        ${h?i`
          <details class="second-brain-section-details">
            <summary class="second-brain-section-header second-brain-section-header--toggle">
              <span class="second-brain-section-title">\u{1F9E0} Snapshot Content</span>
              <span class="second-brain-section-count">${h.lineCount} lines</span>
            </summary>
            <div class="second-brain-card">
              <div class="second-brain-card-content">${B(h.content)}</div>
            </div>
          </details>
        `:i`
          <div class="second-brain-empty-block">
            <div class="second-brain-empty-icon">\u{1F9E0}</div>
            <div class="second-brain-empty-title">No awareness snapshot yet</div>
            <div class="second-brain-empty-hint">Hit "Sync Now" to generate your first awareness snapshot. It includes your schedule, tasks, goals, and agent activity.</div>
          </div>
        `}
      </div>

      <!-- Connected Sources -->
      ${s&&s.sources.length>0?i`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F310} Connected Sources</span>
            <span class="second-brain-section-count">${s.connectedCount} of ${s.totalCount}</span>
            <button class="second-brain-add-source-btn" @click=${()=>e.onAddSource()}>+ Add</button>
          </div>
          <div class="second-brain-sources-grid">
            ${s.sources.filter(u=>u.status==="connected").map(u=>$(u))}
          </div>
          ${s.sources.some(u=>u.status==="available")?i`
            <details style="margin-top: 8px;">
              <summary style="cursor: pointer; font-size: 12px; color: var(--muted);">
                ${s.sources.filter(u=>u.status==="available").length} available sources
              </summary>
              <div class="second-brain-sources-grid" style="margin-top: 8px;">
                ${s.sources.filter(u=>u.status==="available").map(u=>$(u))}
              </div>
            </details>
          `:a}
        </div>
      `:a}

      <!-- Vault Health -->
      ${t?i`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F4D3} Vault Health</span>
          </div>
          ${t.available&&t.stats?i`
            <div class="context-health-row">
              <span>${t.stats.totalNotes} notes</span>
              <span>\u00B7</span>
              <span>${t.stats.brainCount} brain</span>
              <span>\u00B7</span>
              <span>${t.stats.inboxCount} inbox</span>
              <span>\u00B7</span>
              <span>${t.stats.dailyCount} daily</span>
              <span>\u00B7</span>
              <span>Last: ${t.stats.lastActivity?y(t.stats.lastActivity):"never"}</span>
            </div>
          `:i`
            <div class="context-health-row" style="color: var(--muted);">
              Vault not connected. Set OBSIDIAN_VAULT_PATH to enable.
            </div>
          `}
        </div>
      `:a}
    </div>
  `}function O(e,n){return i`
    <div class="second-brain-empty-block">
      <div class="second-brain-empty-icon">\u{1F9E0}</div>
      <div class="second-brain-empty-title">${e}</div>
      <div class="second-brain-empty-hint">${n}</div>
    </div>
  `}function V(e){if(e.selectedPerson){const s=e.selectedPerson;return i`
      <div class="second-brain-panel">
        <button class="sb-back-btn" @click=${()=>e.onBackFromPerson?.()}>
          \u2190 Back to People
        </button>
        <h2 style="margin: 8px 0 4px;">${s.name}</h2>
        ${s.honchoSays?i`
              <div class="sb-honcho-card" style="background: var(--surface-2, #1a1a2e); border-radius: 8px; padding: 12px; margin: 8px 0; border-left: 3px solid var(--accent, #6366f1);">
                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">What your ally remembers</div>
                <div style="font-size: 13px; line-height: 1.5;">${s.honchoSays}</div>
              </div>
            `:a}
        ${B(s.content)}
      </div>
    `}const n=e.peopleList??[];return n.length===0?i`
      <div class="second-brain-panel">
        <div class="second-brain-empty-block">
          <div class="second-brain-empty-icon">\u{1F465}</div>
          <div class="second-brain-empty-title">No people files yet</div>
          <div class="second-brain-empty-hint">
            People files are auto-created from calendar meetings, email contacts, and calls.
            You can also capture a person via the capture_thought MCP tool.
          </div>
        </div>
      </div>
    `:i`
    <div class="second-brain-panel">
      <div class="second-brain-entry-list">
        ${n.map(s=>i`
            <div class="second-brain-entry" @click=${()=>e.onSelectPerson?.(s.file)}>
              <div class="second-brain-entry-icon">\u{1F464}</div>
              <div class="second-brain-entry-body">
                <div class="second-brain-entry-name">${s.name}</div>
                <div class="second-brain-entry-excerpt">
                  ${s.email?`${s.email} · `:""}${s.firstSeen?`Since ${s.firstSeen}`:""}
                </div>
              </div>
              <div class="second-brain-entry-meta">${y(s.lastModified)}</div>
            </div>
          `)}
      </div>
    </div>
  `}function M(e){const n=e.timelineEntries??[],s=e.brainOverview;return i`
    <div class="second-brain-panel">
      ${s?i`
            <div class="sb-overview-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; margin-bottom: 16px;">
              <div class="sb-stat-card" style="background: var(--surface-2, #1a1a2e); border-radius: 8px; padding: 12px; text-align: center;">
                <div style="font-size: 24px; font-weight: 600;">${s.health.peopleCount}</div>
                <div style="font-size: 11px; color: var(--text-muted);">People</div>
              </div>
              <div class="sb-stat-card" style="background: var(--surface-2, #1a1a2e); border-radius: 8px; padding: 12px; text-align: center;">
                <div style="font-size: 24px; font-weight: 600;">${s.health.dailyNoteCount}</div>
                <div style="font-size: 11px; color: var(--text-muted);">Days Logged</div>
              </div>
              <div class="sb-stat-card" style="background: var(--surface-2, #1a1a2e); border-radius: 8px; padding: 12px; text-align: center;">
                <div style="font-size: 24px; font-weight: 600;">${s.health.companyCount}</div>
                <div style="font-size: 11px; color: var(--text-muted);">Companies</div>
              </div>
              <div class="sb-stat-card" style="background: var(--surface-2, #1a1a2e); border-radius: 8px; padding: 12px; text-align: center;">
                <div style="font-size: 12px; font-weight: 600;">${s.health.honchoStatus==="ready"?"✅":"⚠️"} ${s.health.honchoStatus}</div>
                <div style="font-size: 11px; color: var(--text-muted);">Honcho</div>
              </div>
            </div>

            ${s.ingestion.length>0?i`
                  <div style="margin-bottom: 16px;">
                    <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">INGESTION PIPELINES</div>
                    ${s.ingestion.map(t=>i`
                        <div style="display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 13px;">
                          <span>${t.type==="engine"?t.configured?"✅":"❌":t.type==="webhook"?t.configured?"✅":"🔗":"🤖"}</span>
                          <span>${t.name}</span>
                          <span style="font-size: 11px; color: var(--text-muted);">${t.hint}</span>
                        </div>
                      `)}
                  </div>
                `:a}
          `:a}

      ${n.length===0?i`
            <div class="second-brain-empty-block">
              <div class="second-brain-empty-icon">\u{1F4C5}</div>
              <div class="second-brain-empty-title">No daily notes yet</div>
              <div class="second-brain-empty-hint">
                Daily notes are created automatically by ingestion pipelines and the capture_thought tool.
              </div>
            </div>
          `:i`
            <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">RECENT DAILY NOTES</div>
            <div class="second-brain-entry-list">
              ${n.map(t=>i`
                  <div class="second-brain-entry" @click=${()=>e.onSelectEntry(t.file)}>
                    <div class="second-brain-entry-icon">\u{1F4C5}</div>
                    <div class="second-brain-entry-body">
                      <div class="second-brain-entry-name">${t.date}</div>
                      <div class="second-brain-entry-excerpt">${t.entryCount} entries</div>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </div>
  `}function U(e){const{subtab:n,loading:s}=e;return i`
    <section class="second-brain-container">
      <div class="second-brain-tabs">
        <button
          class="second-brain-tab ${n==="identity"?"active":""}"
          @click=${()=>e.onSubtabChange("identity")}
        >
          \u{1F464} Identity
        </button>
        <button
          class="second-brain-tab ${n==="people"?"active":""}"
          @click=${()=>e.onSubtabChange("people")}
        >
          \u{1F465} People
        </button>
        <button
          class="second-brain-tab ${n==="knowledge"?"active":""}"
          @click=${()=>e.onSubtabChange("knowledge")}
        >
          \u{1F4DA} Knowledge
        </button>
        <button
          class="second-brain-tab ${n==="timeline"?"active":""}"
          @click=${()=>e.onSubtabChange("timeline")}
        >
          \u{1F4C5} Timeline
        </button>
        <button
          class="second-brain-tab ${n==="context"?"active":""}"
          @click=${()=>e.onSubtabChange("context")}
        >
          \u{26A1} Context
        </button>
      </div>

      ${s?i`<div class="second-brain-loading"><div class="second-brain-loading-spinner"></div>Loading...</div>`:n==="identity"?z(e):n==="people"?V(e):n==="knowledge"?H(e):n==="timeline"?M(e):Q(e)}
    </section>
  `}let o=class extends w{constructor(){super(...arguments),this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainVaultHealth=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.secondBrainPeopleList=null,this.secondBrainSelectedPerson=null,this.secondBrainTimelineEntries=null,this.secondBrainOverview=null,this._unsubs=[]}createRenderRoot(){return this}get client(){return this.ctx.gateway}get connected(){return this.ctx.connected}connectedCallback(){super.connectedCallback(),this._unsubs.push(m.on("refresh-requested",e=>{e.target==="second-brain"&&this._refresh()})),this._refresh()}disconnectedCallback(){for(const e of this._unsubs)e();this._unsubs=[],super.disconnectedCallback()}render(){return U({connected:this.ctx.connected,loading:this.secondBrainLoading,error:this.secondBrainError,subtab:this.secondBrainSubtab,identity:this.secondBrainIdentity,memoryBank:this.secondBrainMemoryBank,researchData:this.secondBrainResearchData,fileTree:this.secondBrainFileTree,fileTreeLoading:this.secondBrainFileTreeLoading,fileSearchQuery:this.secondBrainFileSearchQuery,fileSearchResults:this.secondBrainFileSearchResults,selectedEntry:this.secondBrainSelectedEntry,searchQuery:this.secondBrainSearchQuery,browsingFolder:this.secondBrainBrowsingFolder,folderEntries:this.secondBrainFolderEntries,folderName:this.secondBrainFolderName,aiPacket:this.secondBrainAiPacket,sourcesData:this.secondBrainSourcesData,vaultHealth:this.secondBrainVaultHealth,syncing:this.secondBrainSyncing,onSubtabChange:e=>this._onSubtabChange(e),onSelectEntry:e=>this._onSelectEntry(e),onBrowseFolder:e=>this._onBrowseFolder(e),onBack:()=>this._onBack(),onSearch:e=>this._onSearch(e),onFileSearch:e=>this._onFileSearch(e),onFileSelect:e=>this._onFileSelect(e),onSync:()=>this._onSync(),onRefresh:()=>this._refresh(),onSaveViaChat:()=>this._onSaveViaChat(),onAddSource:()=>this._onAddSource(),peopleList:this.secondBrainPeopleList,selectedPerson:this.secondBrainSelectedPerson,onSelectPerson:e=>this._onSelectPerson(e),onBackFromPerson:()=>{this.secondBrainSelectedPerson=null},timelineEntries:this.secondBrainTimelineEntries,brainOverview:this.secondBrainOverview})}async _refresh(){await A(this),this.requestUpdate()}_onSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainSelectedPerson=null,e==="people"?this._loadPeople().catch(n=>{console.error("[SecondBrain] People load failed:",n)}):e==="timeline"?this._loadTimeline().catch(n=>{console.error("[SecondBrain] Timeline load failed:",n)}):this._refresh().catch(n=>{console.error("[SecondBrain] Refresh after subtab change failed:",n),this.secondBrainError=n instanceof Error?n.message:"Failed to load data",this.secondBrainLoading=!1})}async _onSelectEntry(e){if(!this.ctx.gateway||!this.ctx.connected)return;const n=e.endsWith(".html")||e.endsWith(".htm");try{const s=await this.ctx.gateway.request("secondBrain.memoryBankEntry",{path:e});s?.content&&this.ctx.openSidebar({content:s.content,mimeType:n?"text/html":"text/markdown",filePath:e,title:s.name||e.split("/").pop()||"File"})}catch(s){console.error("[SecondBrain] Failed to open file:",s),this.ctx.addToast("Failed to open file","error")}}async _onBrowseFolder(e){await L(this,e),this.requestUpdate()}_onBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}_onSearch(e){this.secondBrainSearchQuery=e}_onFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doFileSearch(e)}async _doFileSearch(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const n=await this.ctx.gateway.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=n.results??[])}catch(n){console.error("[SecondBrain] search failed:",n)}}async _onFileSelect(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const n=await this.ctx.gateway.request("secondBrain.memoryBankEntry",{path:e});if(n?.content){const s=e.endsWith(".html")||e.endsWith(".htm");this.ctx.openSidebar({content:n.content,mimeType:s?"text/html":"text/markdown",filePath:e,title:n.name||e.split("/").pop()||"File"})}}catch(n){console.error("[SecondBrain] Failed to open file:",n),this.ctx.addToast("Failed to open file","error")}}async _onSync(){await N(this),this.requestUpdate()}async _onSelectPerson(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const n=await this.ctx.gateway.request("brain.person",{file:e});n&&(this.secondBrainSelectedPerson=n)}catch(n){console.error("[SecondBrain] Failed to load person:",n),this.ctx.addToast("Failed to load person details","error")}}async _loadPeople(){if(!(!this.ctx.gateway||!this.ctx.connected))try{const e=await this.ctx.gateway.request("brain.people",{});this.secondBrainPeopleList=e?.people??[]}catch(e){console.error("[SecondBrain] Failed to load people:",e)}}async _loadTimeline(){if(!(!this.ctx.gateway||!this.ctx.connected))try{const[e,n]=await Promise.all([this.ctx.gateway.request("brain.timeline",{days:14}),this.ctx.gateway.request("brain.overview",{})]);this.secondBrainTimelineEntries=e?.entries??[],this.secondBrainOverview=n??null}catch(e){console.error("[SecondBrain] Failed to load timeline:",e)}}_onSaveViaChat(){m.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:"I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save."})}_onAddSource(){m.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:"I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect."})}};c([E({context:P,subscribe:!0})],o.prototype,"ctx",2);c([d()],o.prototype,"secondBrainSubtab",2);c([d()],o.prototype,"secondBrainLoading",2);c([d()],o.prototype,"secondBrainError",2);c([d()],o.prototype,"secondBrainIdentity",2);c([d()],o.prototype,"secondBrainMemoryBank",2);c([d()],o.prototype,"secondBrainAiPacket",2);c([d()],o.prototype,"secondBrainSourcesData",2);c([d()],o.prototype,"secondBrainResearchData",2);c([d()],o.prototype,"secondBrainSelectedEntry",2);c([d()],o.prototype,"secondBrainSearchQuery",2);c([d()],o.prototype,"secondBrainSyncing",2);c([d()],o.prototype,"secondBrainBrowsingFolder",2);c([d()],o.prototype,"secondBrainFolderEntries",2);c([d()],o.prototype,"secondBrainFolderName",2);c([d()],o.prototype,"secondBrainVaultHealth",2);c([d()],o.prototype,"secondBrainFileTree",2);c([d()],o.prototype,"secondBrainFileTreeLoading",2);c([d()],o.prototype,"secondBrainFileSearchQuery",2);c([d()],o.prototype,"secondBrainFileSearchResults",2);c([d()],o.prototype,"secondBrainPeopleList",2);c([d()],o.prototype,"secondBrainSelectedPerson",2);c([d()],o.prototype,"secondBrainTimelineEntries",2);c([d()],o.prototype,"secondBrainOverview",2);o=c([C("gm-second-brain")],o);export{o as GmSecondBrain,U as renderSecondBrain};
