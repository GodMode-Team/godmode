import{b as a,A as r,o as x,d as E,g as C,r as u,t as _}from"./lit-core-CTInmNPB.js";import{a as m,o as A}from"./index-DxuXMfTD.js";import{a as T}from"./views-settings-CBBtKhCP.js";import{f as D}from"./ctrl-settings-UNQXoGSo.js";import"./markdown-i_gIkIP3.js";function y(e){if(!e)return"";try{return D(new Date(e).getTime())}catch{return""}}function B(e){return a`<div class="second-brain-md-body">${x(T(e))}</div>`}function L(e){const{identity:n}=e;return!n||n.files.length===0?a`
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
    `:a`
    <div class="second-brain-panel">
      <div class="sb-identity-actions" style="display: flex; gap: 8px; margin-bottom: 12px;">
        <button class="sb-chat-btn" @click=${()=>e.onSaveViaChat()}>
          \u{1F4AC} Update via Chat
        </button>
      </div>

      ${n.files.map(s=>a`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${s.label}</span>
            ${s.updatedAt?a`<span class="second-brain-card-updated">${y(s.updatedAt)}</span>`:r}
          </div>
          <div class="second-brain-card-content">${B(s.content)}</div>
        </div>
      `)}
    </div>
  `}function f(e,n){const s=e.isDirectory;return a`
    <div class="second-brain-entry" @click=${()=>{s?n.onBrowseFolder(e.path):n.onSelectEntry(e.path)}}>
      <div class="second-brain-entry-icon ${s?"second-brain-entry-icon--folder":""}">${s?"📁":"📄"}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${e.name}${s?"/":""}</div>
        ${e.excerpt?a`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:r}
      </div>
      ${e.updatedAt?a`<div class="second-brain-entry-meta">${y(e.updatedAt)}</div>`:r}
    </div>
  `}function P(e,n){const s=e.isDirectory,i=s?"📁":"📑",d=()=>{s?n.onBrowseFolder(e.path):n.onSelectEntry(e.path)},h=e.frontmatter?.title||e.name;return a`
    <div class="second-brain-entry" @click=${d}>
      <div class="second-brain-entry-icon ${s?"second-brain-entry-icon--folder":""}">${i}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${h}${s?"/":""}</div>
        ${e.frontmatter?.url?a`<div class="second-brain-research-url">${e.frontmatter.url}</div>`:r}
        ${e.excerpt&&!s?a`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:r}
        ${e.frontmatter?.tags?.length?a`
          <div class="second-brain-research-tags">
            ${e.frontmatter.tags.map(c=>a`<span class="second-brain-research-tag">${c}</span>`)}
          </div>
        `:r}
      </div>
      ${e.updatedAt?a`<div class="second-brain-entry-meta">${y(e.updatedAt)}</div>`:r}
    </div>
  `}function R(e){return e<1024?`${e}B`:e<1024*1024?`${(e/1024).toFixed(1)}K`:`${(e/(1024*1024)).toFixed(1)}M`}function S(e,n,s=0){return a`
    <div class="sb-file-tree" style="padding-left: ${s*16}px">
      ${e.map(i=>i.type==="folder"?a`
            <details class="sb-tree-folder">
              <summary class="sb-tree-item sb-tree-folder-name">
                <span class="sb-file-icon">\u{1F4C1}</span>
                <span>${i.name}</span>
                ${i.childCount!=null?a`<span class="sb-tree-count">${i.childCount}</span>`:r}
              </summary>
              ${i.children?S(i.children,n,s+1):r}
            </details>
          `:a`
          <button
            class="sb-tree-item sb-tree-file"
            @click=${()=>n.onFileSelect?.(i.path)}
          >
            <span class="sb-file-icon">\u{1F4C4}</span>
            <span class="sb-file-name">${i.name}</span>
            ${i.size!=null?a`<span class="sb-tree-size">${R(i.size)}</span>`:r}
          </button>
        `)}
    </div>
  `}function N(e){const{memoryBank:n,researchData:s,selectedEntry:i,searchQuery:d,browsingFolder:h,folderEntries:c,folderName:F}=e;if(i)return a`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${i.name}</span>
            ${i.updatedAt?a`<span class="second-brain-card-updated">${y(i.updatedAt)}</span>`:r}
          </div>
          ${i.relativePath?a`<div class="second-brain-card-path">${i.relativePath}</div>`:r}
          <div class="second-brain-card-content">${B(i.content)}</div>
        </div>
      </div>
    `;if(h&&c)return a`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${F??"Folder"}</span>
            <span class="second-brain-section-count">${c.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${c.length>0?c.map(t=>f(t,e)):a`<div class="second-brain-empty-inline">Empty folder</div>`}
          </div>
        </div>
      </div>
    `;if(!(n&&n.totalEntries>0||s&&s.totalEntries>0||e.fileTree&&e.fileTree.length>0))return q("No knowledge found","Start building your second brain by telling your ally about the people, companies, and projects in your life.");const v=(d??"").toLowerCase().trim(),w=t=>v?t.filter(b=>b.name.toLowerCase().includes(v)||b.excerpt.toLowerCase().includes(v)):t,p=e.fileSearchResults;return a`
    <div class="second-brain-panel">
      <div class="second-brain-search knowledge-search">
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Search your second brain..."
          .value=${d??""}
          @input=${t=>{const b=t.target.value;e.onSearch(b),e.onFileSearch?.(b)}}
        />
      </div>

      ${p&&v?a`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F50D} Search Results</span>
            <span class="second-brain-section-count">${p.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${p.length>0?p.map(t=>a`
                  <div class="second-brain-entry" @click=${()=>e.onFileSelect?.(t.path)}>
                    <div class="second-brain-entry-icon">${t.type==="folder"?"📁":"📄"}</div>
                    <div class="second-brain-entry-body">
                      <div class="second-brain-entry-name">${t.name}</div>
                      ${t.matchContext||t.excerpt?a`<div class="second-brain-entry-excerpt">${t.matchContext??t.excerpt}</div>`:r}
                    </div>
                  </div>
                `):a`<div class="second-brain-empty-inline">No results</div>`}
          </div>
        </div>
      `:r}

      ${!v&&n?a`
        ${n.sections.map(t=>{const b=w(t.entries);return t.entries.length===0?r:a`
            <div class="second-brain-section">
              <div class="second-brain-section-header">
                <span class="second-brain-section-title">${t.icon} ${t.label}</span>
                <span class="second-brain-section-count">${t.entries.length}</span>
              </div>
              <div class="second-brain-entry-list">
                ${b.length>0?b.map(k=>f(k,e)):v?a`<div class="second-brain-empty-inline">No matches</div>`:r}
              </div>
            </div>
          `})}

        ${n.extraFiles.length>0?a`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4CB} Reference Files</span>
              <span class="second-brain-section-count">${n.extraFiles.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${n.extraFiles.map(t=>f(t,e))}
            </div>
          </div>
        `:r}

        ${n.curated?a`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{2B50} Curated Facts</span>
              <span class="second-brain-section-count">${y(n.curated.updatedAt)}</span>
            </div>
            <div class="second-brain-card">
              <div class="second-brain-card-content">${B(n.curated.content)}</div>
            </div>
          </div>
        `:r}
      `:r}

      ${!v&&s&&s.totalEntries>0?a`
        ${s.categories.map(t=>t.entries.length===0?r:a`
            <div class="second-brain-section">
              <div class="second-brain-section-header">
                <span class="second-brain-section-title">\u{1F50D} ${t.label}</span>
                <span class="second-brain-section-count">${t.entries.length}</span>
              </div>
              <div class="second-brain-entry-list">
                ${t.entries.map(b=>P(b,e))}
              </div>
            </div>
          `)}
      `:r}

      ${!v&&e.fileTree&&e.fileTree.length>0?a`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F5C2}\uFE0F Browse All</span>
          </div>
          ${S(e.fileTree,e)}
        </div>
      `:r}
    </div>
  `}const $={connected:{dot:"●",label:"Connected",cls:"second-brain-source--connected"},available:{dot:"○",label:"Available",cls:"second-brain-source--available"}};function g(e){const n=$[e.status]??$.available;return a`
    <div class="second-brain-source-card ${n.cls}">
      <div class="second-brain-source-icon">${e.icon}</div>
      <div class="second-brain-source-body">
        <div class="second-brain-source-name">${e.name}</div>
        <div class="second-brain-source-desc">${e.description}</div>
        ${e.stats?a`<div class="second-brain-source-stats">${e.stats}</div>`:r}
      </div>
      <div class="second-brain-source-status">
        <span class="second-brain-source-dot" style="color: ${e.status==="connected"?"var(--success, #10b981)":e.status==="available"?"var(--warning, #f59e0b)":"var(--muted)"}">${n.dot}</span>
        <span class="second-brain-source-status-label">${n.label}</span>
        ${e.status==="connected"&&e.lastSync?a`<span class="second-brain-source-sync">${y(e.lastSync)}</span>`:r}
      </div>
    </div>
  `}function H(e){const{aiPacket:n,sourcesData:s,vaultHealth:i,syncing:d}=e,h=n?.snapshot??null;return a`
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
            class="second-brain-sync-btn ${d?"syncing":""}"
            ?disabled=${d}
            @click=${()=>e.onSync()}
          >
            ${d?"Syncing...":"⚡ Sync Now"}
          </button>
        </div>

        ${h?a`
          <div class="second-brain-card">
            <div class="second-brain-card-content">${B(h.content)}</div>
          </div>
        `:a`
          <div class="second-brain-empty-block">
            <div class="second-brain-empty-icon">\u{1F9E0}</div>
            <div class="second-brain-empty-title">No awareness snapshot yet</div>
            <div class="second-brain-empty-hint">Hit "Sync Now" to generate your first awareness snapshot. It includes your schedule, tasks, goals, and agent activity.</div>
          </div>
        `}
      </div>

      <!-- Connected Sources -->
      ${s&&s.sources.length>0?a`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F310} Connected Sources</span>
            <span class="second-brain-section-count">${s.connectedCount} of ${s.totalCount}</span>
            <button class="second-brain-add-source-btn" @click=${()=>e.onAddSource()}>+ Add</button>
          </div>
          <div class="second-brain-sources-grid">
            ${s.sources.filter(c=>c.status==="connected").map(c=>g(c))}
          </div>
          ${s.sources.some(c=>c.status==="available")?a`
            <details style="margin-top: 8px;">
              <summary style="cursor: pointer; font-size: 12px; color: var(--muted);">
                ${s.sources.filter(c=>c.status==="available").length} available sources
              </summary>
              <div class="second-brain-sources-grid" style="margin-top: 8px;">
                ${s.sources.filter(c=>c.status==="available").map(c=>g(c))}
              </div>
            </details>
          `:r}
        </div>
      `:r}

      <!-- Vault Health -->
      ${i?a`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F4D3} Vault Health</span>
          </div>
          ${i.available&&i.stats?a`
            <div class="context-health-row">
              <span>${i.stats.totalNotes} notes</span>
              <span>\u00B7</span>
              <span>${i.stats.brainCount} brain</span>
              <span>\u00B7</span>
              <span>${i.stats.inboxCount} inbox</span>
              <span>\u00B7</span>
              <span>${i.stats.dailyCount} daily</span>
              <span>\u00B7</span>
              <span>Last: ${i.stats.lastActivity?y(i.stats.lastActivity):"never"}</span>
            </div>
          `:a`
            <div class="context-health-row" style="color: var(--muted);">
              Vault not connected. Set OBSIDIAN_VAULT_PATH to enable.
            </div>
          `}
        </div>
      `:r}
    </div>
  `}function q(e,n){return a`
    <div class="second-brain-empty-block">
      <div class="second-brain-empty-icon">\u{1F9E0}</div>
      <div class="second-brain-empty-title">${e}</div>
      <div class="second-brain-empty-hint">${n}</div>
    </div>
  `}function I(e){const{subtab:n,loading:s}=e;return a`
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

      ${s?a`<div class="second-brain-loading"><div class="second-brain-loading-spinner"></div>Loading...</div>`:n==="identity"?L(e):n==="knowledge"?N(e):H(e)}
    </section>
  `}async function Q(e){if(!e.client||!e.connected)return;const n=e.secondBrainSubtab??"identity";e.secondBrainLoading=!0,e.secondBrainError=null;try{if(n==="identity"){const s=await e.client.request("secondBrain.identity",{});e.secondBrainIdentity=s}else if(n==="knowledge"){const[s,i,d]=await Promise.all([e.client.request("secondBrain.memoryBank",{}),e.client.request("secondBrain.research",{}),e.client.request("secondBrain.fileTree",{depth:4})]);e.secondBrainMemoryBank=s,e.secondBrainResearchData=i,e.secondBrainFileTree=d.tree??[],e.secondBrainBrowsingFolder=null,e.secondBrainFolderEntries=null,e.secondBrainFolderName=null}else if(n==="context"){const[s,i,d]=await Promise.all([e.client.request("secondBrain.aiPacket",{}),e.client.request("secondBrain.sources",{}),e.client.request("secondBrain.vaultHealth",{})]);e.secondBrainAiPacket=s,e.secondBrainSourcesData=i,e.secondBrainVaultHealth=d}}catch(s){console.error("[SecondBrain] Failed to load:",s),e.secondBrainError=s instanceof Error?s.message:"Failed to load Second Brain data"}finally{e.secondBrainLoading=!1}}async function V(e,n){if(!(!e.client||!e.connected)){e.secondBrainLoading=!0;try{const s=await e.client.request("secondBrain.memoryBank",{folder:n});e.secondBrainBrowsingFolder=s.folder,e.secondBrainFolderName=s.folderName,e.secondBrainFolderEntries=s.entries}catch(s){console.error("[SecondBrain] Failed to browse folder:",s),e.secondBrainError=s instanceof Error?s.message:"Failed to browse folder"}finally{e.secondBrainLoading=!1}}}async function M(e,n){if(!(!e.client||!e.connected)){e.secondBrainLoading=!0;try{const s=await e.client.request("secondBrain.memoryBankEntry",{path:n});e.secondBrainSelectedEntry=s}catch(s){console.error("[SecondBrain] Failed to load entry:",s),e.secondBrainError=s instanceof Error?s.message:"Failed to load entry"}finally{e.secondBrainLoading=!1}}}async function z(e){if(!(!e.client||!e.connected)){e.secondBrainSyncing=!0;try{const n=await e.client.request("secondBrain.sync",{});e.secondBrainAiPacket={snapshot:n.snapshot??null}}catch(n){console.error("[SecondBrain] Sync failed:",n),e.secondBrainError=n instanceof Error?n.message:"Sync failed"}finally{e.secondBrainSyncing=!1}}}var U=Object.defineProperty,K=Object.getOwnPropertyDescriptor,l=(e,n,s,i)=>{for(var d=i>1?void 0:i?K(n,s):n,h=e.length-1,c;h>=0;h--)(c=e[h])&&(d=(i?c(n,s,d):c(d))||d);return i&&d&&U(n,s,d),d};let o=class extends E{constructor(){super(...arguments),this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainVaultHealth=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this._unsubs=[]}createRenderRoot(){return this}get client(){return this.ctx.gateway}get connected(){return this.ctx.connected}connectedCallback(){super.connectedCallback(),this._unsubs.push(m.on("refresh-requested",e=>{e.target==="second-brain"&&this._refresh()})),this._refresh()}disconnectedCallback(){for(const e of this._unsubs)e();this._unsubs=[],super.disconnectedCallback()}render(){return I({connected:this.ctx.connected,loading:this.secondBrainLoading,error:this.secondBrainError,subtab:this.secondBrainSubtab,identity:this.secondBrainIdentity,memoryBank:this.secondBrainMemoryBank,researchData:this.secondBrainResearchData,fileTree:this.secondBrainFileTree,fileTreeLoading:this.secondBrainFileTreeLoading,fileSearchQuery:this.secondBrainFileSearchQuery,fileSearchResults:this.secondBrainFileSearchResults,selectedEntry:this.secondBrainSelectedEntry,searchQuery:this.secondBrainSearchQuery,browsingFolder:this.secondBrainBrowsingFolder,folderEntries:this.secondBrainFolderEntries,folderName:this.secondBrainFolderName,aiPacket:this.secondBrainAiPacket,sourcesData:this.secondBrainSourcesData,vaultHealth:this.secondBrainVaultHealth,syncing:this.secondBrainSyncing,onSubtabChange:e=>this._onSubtabChange(e),onSelectEntry:e=>this._onSelectEntry(e),onBrowseFolder:e=>this._onBrowseFolder(e),onBack:()=>this._onBack(),onSearch:e=>this._onSearch(e),onFileSearch:e=>this._onFileSearch(e),onFileSelect:e=>this._onFileSelect(e),onSync:()=>this._onSync(),onRefresh:()=>this._refresh(),onSaveViaChat:()=>this._onSaveViaChat(),onAddSource:()=>this._onAddSource()})}async _refresh(){await Q(this),this.requestUpdate()}_onSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this._refresh().catch(n=>{console.error("[SecondBrain] Refresh after subtab change failed:",n),this.secondBrainError=n instanceof Error?n.message:"Failed to load data",this.secondBrainLoading=!1})}async _onSelectEntry(e){if(e.endsWith(".html")||e.endsWith(".htm")){try{const s=await this.ctx.gateway.request("secondBrain.memoryBankEntry",{path:e});s?.content&&this.ctx.openSidebar({content:s.content,mimeType:"text/html",filePath:e,title:s.name||e.split("/").pop()||"File"})}catch(s){console.error("[SecondBrain] Failed to open HTML file:",s)}return}await M(this,e),this.requestUpdate()}async _onBrowseFolder(e){await V(this,e),this.requestUpdate()}_onBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}_onSearch(e){this.secondBrainSearchQuery=e}_onFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doFileSearch(e)}async _doFileSearch(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const n=await this.ctx.gateway.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=n.results??[])}catch(n){console.error("[SecondBrain] search failed:",n)}}async _onFileSelect(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const n=await this.ctx.gateway.request("secondBrain.memoryBankEntry",{path:e});if(n?.content){const s=e.endsWith(".html")||e.endsWith(".htm");this.ctx.openSidebar({content:n.content,mimeType:s?"text/html":"text/markdown",filePath:e,title:n.name||e.split("/").pop()||"File"})}}catch(n){console.error("[SecondBrain] Failed to open file:",n),this.ctx.addToast("Failed to open file","error")}}async _onSync(){await z(this),this.requestUpdate()}_onSaveViaChat(){m.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:"I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save."})}_onAddSource(){m.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:"I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect."})}};l([C({context:A,subscribe:!0})],o.prototype,"ctx",2);l([u()],o.prototype,"secondBrainSubtab",2);l([u()],o.prototype,"secondBrainLoading",2);l([u()],o.prototype,"secondBrainError",2);l([u()],o.prototype,"secondBrainIdentity",2);l([u()],o.prototype,"secondBrainMemoryBank",2);l([u()],o.prototype,"secondBrainAiPacket",2);l([u()],o.prototype,"secondBrainSourcesData",2);l([u()],o.prototype,"secondBrainResearchData",2);l([u()],o.prototype,"secondBrainSelectedEntry",2);l([u()],o.prototype,"secondBrainSearchQuery",2);l([u()],o.prototype,"secondBrainSyncing",2);l([u()],o.prototype,"secondBrainBrowsingFolder",2);l([u()],o.prototype,"secondBrainFolderEntries",2);l([u()],o.prototype,"secondBrainFolderName",2);l([u()],o.prototype,"secondBrainVaultHealth",2);l([u()],o.prototype,"secondBrainFileTree",2);l([u()],o.prototype,"secondBrainFileTreeLoading",2);l([u()],o.prototype,"secondBrainFileSearchQuery",2);l([u()],o.prototype,"secondBrainFileSearchResults",2);o=l([_("gm-second-brain")],o);export{o as GmSecondBrain};
