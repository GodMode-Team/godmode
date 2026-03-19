import{b as s,A as c,o as x,d as C,g as E,r as l,t as _}from"./lit-core-CTInmNPB.js";import{o as A}from"./index-Cr5JdXTq.js";import{a as $}from"./event-bus-4tWT8iFZ.js";import{a as T}from"./views-settings-Dbe7GjNl.js";import{f as D}from"./ctrl-settings-rEJlXhcU.js";import{loadSecondBrain as R,loadSecondBrainEntry as L,browseFolder as N,syncSecondBrain as P}from"./second-brain-cP3vM8ym.js";import"./markdown-i_gIkIP3.js";function p(e){if(!e)return"";try{return D(new Date(e).getTime())}catch{return""}}function m(e){return s`<div class="second-brain-md-body">${x(T(e))}</div>`}function H(e){const{identity:n}=e;return!n||n.files.length===0?s`
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
    `:s`
    <div class="second-brain-panel">
      <div class="sb-identity-actions" style="display: flex; gap: 8px; margin-bottom: 12px;">
        <button class="sb-chat-btn" @click=${()=>e.onSaveViaChat()}>
          \u{1F4AC} Update via Chat
        </button>
      </div>

      ${n.files.map(a=>s`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${a.label}</span>
            ${a.updatedAt?s`<span class="second-brain-card-updated">${p(a.updatedAt)}</span>`:c}
          </div>
          <div class="second-brain-card-content">${m(a.content)}</div>
        </div>
      `)}
    </div>
  `}function B(e,n){const a=e.isDirectory;return s`
    <div class="second-brain-entry" @click=${()=>{a?n.onBrowseFolder(e.path):n.onSelectEntry(e.path)}}>
      <div class="second-brain-entry-icon ${a?"second-brain-entry-icon--folder":""}">${a?"📁":"📄"}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${e.name}${a?"/":""}</div>
        ${e.excerpt?s`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:c}
      </div>
      ${e.updatedAt?s`<div class="second-brain-entry-meta">${p(e.updatedAt)}</div>`:c}
    </div>
  `}function I(e,n){const a=e.isDirectory,t=a?"📁":"📑",u=()=>{a?n.onBrowseFolder(e.path):n.onSelectEntry(e.path)},h=e.frontmatter?.title||e.name;return s`
    <div class="second-brain-entry" @click=${u}>
      <div class="second-brain-entry-icon ${a?"second-brain-entry-icon--folder":""}">${t}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${h}${a?"/":""}</div>
        ${e.frontmatter?.url?s`<div class="second-brain-research-url">${e.frontmatter.url}</div>`:c}
        ${e.excerpt&&!a?s`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:c}
        ${e.frontmatter?.tags?.length?s`
          <div class="second-brain-research-tags">
            ${e.frontmatter.tags.map(r=>s`<span class="second-brain-research-tag">${r}</span>`)}
          </div>
        `:c}
      </div>
      ${e.updatedAt?s`<div class="second-brain-entry-meta">${p(e.updatedAt)}</div>`:c}
    </div>
  `}function Q(e){return e<1024?`${e}B`:e<1024*1024?`${(e/1024).toFixed(1)}K`:`${(e/(1024*1024)).toFixed(1)}M`}function g(e,n,a=0){return s`
    <div class="sb-file-tree" style="padding-left: ${a*16}px">
      ${e.map(t=>t.type==="folder"?s`
            <details class="sb-tree-folder">
              <summary class="sb-tree-item sb-tree-folder-name">
                <span class="sb-file-icon">\u{1F4C1}</span>
                <span>${t.name}</span>
                ${t.childCount!=null?s`<span class="sb-tree-count">${t.childCount}</span>`:c}
              </summary>
              ${t.children?g(t.children,n,a+1):c}
            </details>
          `:s`
          <button
            class="sb-tree-item sb-tree-file"
            @click=${()=>n.onFileSelect?.(t.path)}
          >
            <span class="sb-file-icon">\u{1F4C4}</span>
            <span class="sb-file-name">${t.name}</span>
            ${t.size!=null?s`<span class="sb-tree-size">${Q(t.size)}</span>`:c}
          </button>
        `)}
    </div>
  `}function V(e){const{memoryBank:n,researchData:a,selectedEntry:t,searchQuery:u,browsingFolder:h,folderEntries:r,folderName:F}=e;if(t)return s`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${t.name}</span>
            ${t.updatedAt?s`<span class="second-brain-card-updated">${p(t.updatedAt)}</span>`:c}
          </div>
          ${t.relativePath?s`<div class="second-brain-card-path">${t.relativePath}</div>`:c}
          <div class="second-brain-card-content">${m(t.content)}</div>
        </div>
      </div>
    `;if(h&&r)return s`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${F??"Folder"}</span>
            <span class="second-brain-section-count">${r.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${r.length>0?r.map(i=>B(i,e)):s`<div class="second-brain-empty-inline">Empty folder</div>`}
          </div>
        </div>
      </div>
    `;if(!(n&&n.totalEntries>0||a&&a.totalEntries>0||e.fileTree&&e.fileTree.length>0))return M("No knowledge found","Start building your second brain by telling your ally about the people, companies, and projects in your life.");const v=(u??"").toLowerCase().trim(),w=i=>v?i.filter(b=>b.name.toLowerCase().includes(v)||b.excerpt.toLowerCase().includes(v)):i,y=e.fileSearchResults;return s`
    <div class="second-brain-panel">
      <div class="second-brain-search knowledge-search">
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Search your second brain..."
          .value=${u??""}
          @input=${i=>{const b=i.target.value;e.onSearch(b),e.onFileSearch?.(b)}}
        />
      </div>

      ${y&&v?s`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F50D} Search Results</span>
            <span class="second-brain-section-count">${y.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${y.length>0?y.map(i=>s`
                  <div class="second-brain-entry" @click=${()=>e.onFileSelect?.(i.path)}>
                    <div class="second-brain-entry-icon">${i.type==="folder"?"📁":"📄"}</div>
                    <div class="second-brain-entry-body">
                      <div class="second-brain-entry-name">${i.name}</div>
                      ${i.matchContext||i.excerpt?s`<div class="second-brain-entry-excerpt">${i.matchContext??i.excerpt}</div>`:c}
                    </div>
                  </div>
                `):s`<div class="second-brain-empty-inline">No results</div>`}
          </div>
        </div>
      `:c}

      ${!v&&n?s`
        ${n.sections.map(i=>{const b=w(i.entries);return i.entries.length===0?c:s`
            <div class="second-brain-section">
              <div class="second-brain-section-header">
                <span class="second-brain-section-title">${i.icon} ${i.label}</span>
                <span class="second-brain-section-count">${i.entries.length}</span>
              </div>
              <div class="second-brain-entry-list">
                ${b.length>0?b.map(k=>B(k,e)):v?s`<div class="second-brain-empty-inline">No matches</div>`:c}
              </div>
            </div>
          `})}

        ${n.extraFiles.length>0?s`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4CB} Reference Files</span>
              <span class="second-brain-section-count">${n.extraFiles.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${n.extraFiles.map(i=>B(i,e))}
            </div>
          </div>
        `:c}

        ${n.curated?s`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{2B50} Curated Facts</span>
              <span class="second-brain-section-count">${p(n.curated.updatedAt)}</span>
            </div>
            <div class="second-brain-card">
              <div class="second-brain-card-content">${m(n.curated.content)}</div>
            </div>
          </div>
        `:c}
      `:c}

      ${!v&&a&&a.totalEntries>0?s`
        ${a.categories.map(i=>i.entries.length===0?c:s`
            <div class="second-brain-section">
              <div class="second-brain-section-header">
                <span class="second-brain-section-title">\u{1F50D} ${i.label}</span>
                <span class="second-brain-section-count">${i.entries.length}</span>
              </div>
              <div class="second-brain-entry-list">
                ${i.entries.map(b=>I(b,e))}
              </div>
            </div>
          `)}
      `:c}

      ${!v&&e.fileTree&&e.fileTree.length>0?s`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F5C2}\uFE0F Browse All</span>
          </div>
          ${g(e.fileTree,e)}
        </div>
      `:c}
    </div>
  `}const f={connected:{dot:"●",label:"Connected",cls:"second-brain-source--connected"},available:{dot:"○",label:"Available",cls:"second-brain-source--available"}};function S(e){const n=f[e.status]??f.available;return s`
    <div class="second-brain-source-card ${n.cls}">
      <div class="second-brain-source-icon">${e.icon}</div>
      <div class="second-brain-source-body">
        <div class="second-brain-source-name">${e.name}</div>
        <div class="second-brain-source-desc">${e.description}</div>
        ${e.stats?s`<div class="second-brain-source-stats">${e.stats}</div>`:c}
      </div>
      <div class="second-brain-source-status">
        <span class="second-brain-source-dot" style="color: ${e.status==="connected"?"var(--success, #10b981)":e.status==="available"?"var(--warning, #f59e0b)":"var(--muted)"}">${n.dot}</span>
        <span class="second-brain-source-status-label">${n.label}</span>
        ${e.status==="connected"&&e.lastSync?s`<span class="second-brain-source-sync">${p(e.lastSync)}</span>`:c}
      </div>
    </div>
  `}function z(e){const{aiPacket:n,sourcesData:a,vaultHealth:t,syncing:u}=e,h=n?.snapshot??null;return s`
    <div class="second-brain-panel">
      <!-- Awareness Snapshot (hero) -->
      <div class="second-brain-section">
        <div class="second-brain-sync-bar">
          <div class="second-brain-sync-info">
            <span class="second-brain-sync-label">Awareness Snapshot</span>
            <span class="second-brain-sync-time">
              ${h?.updatedAt?`Last synced ${p(h.updatedAt)}`:"Not yet synced"}
              ${h?` • ${h.lineCount} lines`:""}
            </span>
          </div>
          <button
            class="second-brain-sync-btn ${u?"syncing":""}"
            ?disabled=${u}
            @click=${()=>e.onSync()}
          >
            ${u?"Syncing...":"⚡ Sync Now"}
          </button>
        </div>

        ${h?s`
          <div class="second-brain-card">
            <div class="second-brain-card-content">${m(h.content)}</div>
          </div>
        `:s`
          <div class="second-brain-empty-block">
            <div class="second-brain-empty-icon">\u{1F9E0}</div>
            <div class="second-brain-empty-title">No awareness snapshot yet</div>
            <div class="second-brain-empty-hint">Hit "Sync Now" to generate your first awareness snapshot. It includes your schedule, tasks, goals, and agent activity.</div>
          </div>
        `}
      </div>

      <!-- Connected Sources -->
      ${a&&a.sources.length>0?s`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F310} Connected Sources</span>
            <span class="second-brain-section-count">${a.connectedCount} of ${a.totalCount}</span>
            <button class="second-brain-add-source-btn" @click=${()=>e.onAddSource()}>+ Add</button>
          </div>
          <div class="second-brain-sources-grid">
            ${a.sources.filter(r=>r.status==="connected").map(r=>S(r))}
          </div>
          ${a.sources.some(r=>r.status==="available")?s`
            <details style="margin-top: 8px;">
              <summary style="cursor: pointer; font-size: 12px; color: var(--muted);">
                ${a.sources.filter(r=>r.status==="available").length} available sources
              </summary>
              <div class="second-brain-sources-grid" style="margin-top: 8px;">
                ${a.sources.filter(r=>r.status==="available").map(r=>S(r))}
              </div>
            </details>
          `:c}
        </div>
      `:c}

      <!-- Vault Health -->
      ${t?s`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F4D3} Vault Health</span>
          </div>
          ${t.available&&t.stats?s`
            <div class="context-health-row">
              <span>${t.stats.totalNotes} notes</span>
              <span>\u00B7</span>
              <span>${t.stats.brainCount} brain</span>
              <span>\u00B7</span>
              <span>${t.stats.inboxCount} inbox</span>
              <span>\u00B7</span>
              <span>${t.stats.dailyCount} daily</span>
              <span>\u00B7</span>
              <span>Last: ${t.stats.lastActivity?p(t.stats.lastActivity):"never"}</span>
            </div>
          `:s`
            <div class="context-health-row" style="color: var(--muted);">
              Vault not connected. Set OBSIDIAN_VAULT_PATH to enable.
            </div>
          `}
        </div>
      `:c}
    </div>
  `}function M(e,n){return s`
    <div class="second-brain-empty-block">
      <div class="second-brain-empty-icon">\u{1F9E0}</div>
      <div class="second-brain-empty-title">${e}</div>
      <div class="second-brain-empty-hint">${n}</div>
    </div>
  `}function U(e){const{subtab:n,loading:a}=e;return s`
    <section class="second-brain-container">
      <div class="second-brain-tabs">
        <button
          class="second-brain-tab ${n==="identity"?"active":""}"
          @click=${()=>e.onSubtabChange("identity")}
        >
          \u{1F464} Identity
        </button>
        <button
          class="second-brain-tab ${n==="knowledge"?"active":""}"
          @click=${()=>e.onSubtabChange("knowledge")}
        >
          \u{1F4DA} Knowledge
        </button>
        <button
          class="second-brain-tab ${n==="context"?"active":""}"
          @click=${()=>e.onSubtabChange("context")}
        >
          \u{26A1} Context
        </button>
      </div>

      ${a?s`<div class="second-brain-loading"><div class="second-brain-loading-spinner"></div>Loading...</div>`:n==="identity"?H(e):n==="knowledge"?V(e):z(e)}
    </section>
  `}var q=Object.defineProperty,K=Object.getOwnPropertyDescriptor,d=(e,n,a,t)=>{for(var u=t>1?void 0:t?K(n,a):n,h=e.length-1,r;h>=0;h--)(r=e[h])&&(u=(t?r(n,a,u):r(u))||u);return t&&u&&q(n,a,u),u};let o=class extends C{constructor(){super(...arguments),this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainVaultHealth=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this._unsubs=[]}createRenderRoot(){return this}get client(){return this.ctx.gateway}get connected(){return this.ctx.connected}connectedCallback(){super.connectedCallback(),this._unsubs.push($.on("refresh-requested",e=>{e.target==="second-brain"&&this._refresh()})),this._refresh()}disconnectedCallback(){for(const e of this._unsubs)e();this._unsubs=[],super.disconnectedCallback()}render(){return U({connected:this.ctx.connected,loading:this.secondBrainLoading,error:this.secondBrainError,subtab:this.secondBrainSubtab,identity:this.secondBrainIdentity,memoryBank:this.secondBrainMemoryBank,researchData:this.secondBrainResearchData,fileTree:this.secondBrainFileTree,fileTreeLoading:this.secondBrainFileTreeLoading,fileSearchQuery:this.secondBrainFileSearchQuery,fileSearchResults:this.secondBrainFileSearchResults,selectedEntry:this.secondBrainSelectedEntry,searchQuery:this.secondBrainSearchQuery,browsingFolder:this.secondBrainBrowsingFolder,folderEntries:this.secondBrainFolderEntries,folderName:this.secondBrainFolderName,aiPacket:this.secondBrainAiPacket,sourcesData:this.secondBrainSourcesData,vaultHealth:this.secondBrainVaultHealth,syncing:this.secondBrainSyncing,onSubtabChange:e=>this._onSubtabChange(e),onSelectEntry:e=>this._onSelectEntry(e),onBrowseFolder:e=>this._onBrowseFolder(e),onBack:()=>this._onBack(),onSearch:e=>this._onSearch(e),onFileSearch:e=>this._onFileSearch(e),onFileSelect:e=>this._onFileSelect(e),onSync:()=>this._onSync(),onRefresh:()=>this._refresh(),onSaveViaChat:()=>this._onSaveViaChat(),onAddSource:()=>this._onAddSource()})}async _refresh(){await R(this),this.requestUpdate()}_onSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this._refresh().catch(n=>{console.error("[SecondBrain] Refresh after subtab change failed:",n),this.secondBrainError=n instanceof Error?n.message:"Failed to load data",this.secondBrainLoading=!1})}async _onSelectEntry(e){if(e.endsWith(".html")||e.endsWith(".htm")){try{const a=await this.ctx.gateway.request("secondBrain.memoryBankEntry",{path:e});a?.content&&this.ctx.openSidebar({content:a.content,mimeType:"text/html",filePath:e,title:a.name||e.split("/").pop()||"File"})}catch(a){console.error("[SecondBrain] Failed to open HTML file:",a)}return}await L(this,e),this.requestUpdate()}async _onBrowseFolder(e){await N(this,e),this.requestUpdate()}_onBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}_onSearch(e){this.secondBrainSearchQuery=e}_onFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doFileSearch(e)}async _doFileSearch(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const n=await this.ctx.gateway.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=n.results??[])}catch(n){console.error("[SecondBrain] search failed:",n)}}async _onFileSelect(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const n=await this.ctx.gateway.request("secondBrain.memoryBankEntry",{path:e});if(n?.content){const a=e.endsWith(".html")||e.endsWith(".htm");this.ctx.openSidebar({content:n.content,mimeType:a?"text/html":"text/markdown",filePath:e,title:n.name||e.split("/").pop()||"File"})}}catch(n){console.error("[SecondBrain] Failed to open file:",n),this.ctx.addToast("Failed to open file","error")}}async _onSync(){await P(this),this.requestUpdate()}_onSaveViaChat(){$.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:"I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save."})}_onAddSource(){$.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:"I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect."})}};d([E({context:A,subscribe:!0})],o.prototype,"ctx",2);d([l()],o.prototype,"secondBrainSubtab",2);d([l()],o.prototype,"secondBrainLoading",2);d([l()],o.prototype,"secondBrainError",2);d([l()],o.prototype,"secondBrainIdentity",2);d([l()],o.prototype,"secondBrainMemoryBank",2);d([l()],o.prototype,"secondBrainAiPacket",2);d([l()],o.prototype,"secondBrainSourcesData",2);d([l()],o.prototype,"secondBrainResearchData",2);d([l()],o.prototype,"secondBrainSelectedEntry",2);d([l()],o.prototype,"secondBrainSearchQuery",2);d([l()],o.prototype,"secondBrainSyncing",2);d([l()],o.prototype,"secondBrainBrowsingFolder",2);d([l()],o.prototype,"secondBrainFolderEntries",2);d([l()],o.prototype,"secondBrainFolderName",2);d([l()],o.prototype,"secondBrainVaultHealth",2);d([l()],o.prototype,"secondBrainFileTree",2);d([l()],o.prototype,"secondBrainFileTreeLoading",2);d([l()],o.prototype,"secondBrainFileSearchQuery",2);d([l()],o.prototype,"secondBrainFileSearchResults",2);o=d([_("gm-second-brain")],o);export{o as GmSecondBrain};
