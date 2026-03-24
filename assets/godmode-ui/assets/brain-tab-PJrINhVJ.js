import{d as f,b as t,A as i,o as _,g as w,r as c,t as x}from"./lit-core-CTInmNPB.js";import{a as u,o as S}from"./index-DZwc15Ve.js";import{a as k}from"./views-settings-DjuQCK7K.js";import{f as T}from"./ctrl-settings-9Mbvofam.js";import"./markdown-i_gIkIP3.js";var C=Object.defineProperty,F=Object.getOwnPropertyDescriptor,l=(e,a,s,d)=>{for(var o=d>1?void 0:d?F(a,s):a,r=e.length-1,p;r>=0;r--)(p=e[r])&&(o=(d?p(a,s,o):p(o))||o);return d&&o&&C(a,s,o),o};function h(e){if(!e)return"";try{return T(new Date(e).getTime())}catch{return""}}function P(e){return t`<div class="brain-md-body">${_(k(e))}</div>`}const b={ready:"brain-dot--ready",degraded:"brain-dot--degraded",offline:"brain-dot--offline"},B={"vault-capture":"📝","identity-update":"👤","calendar-enrichment":"📅","thought-captured":"💭",search:"🔍","file-modified":"📄"},E={honcho:"🟣",vault:"📓",session:"💬",screenpipe:"📺"};function v(e){return!e||e==="personal"?i:t`<span class="brain-scope-badge brain-scope-badge--shared" title="Shared to ${e}">\u{2197}\u{FE0F} ${e}</span>`}let n=class extends f{constructor(){super(...arguments),this.identityCard=null,this.loading=!1,this.error=null,this.pulse=null,this.activity=null,this.memoryBank=null,this.fileTree=null,this.vaultHealth=null,this.recentPeople=null,this.peopleTotalCount=0,this.peopleSearch="",this.screenpipeStatus=null,this.ingestionStatus=null,this.mcpStatusData=null,this.searchQuery="",this.searchResults=null,this.searching=!1,this.engineExpanded=!1,this.expandedPulseSystem=null,this.browsingFolder=null,this.folderEntries=null,this.folderName=null,this._unsubs=[],this._searchTimer=null,this._activityTimer=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._unsubs.push(u.on("refresh-requested",e=>{(e.target==="brain"||e.target==="second-brain")&&this._loadAll()})),this._loadAll(),this._activityTimer=setInterval(()=>{this._refreshActivity()},6e4)}disconnectedCallback(){for(const e of this._unsubs)e();this._unsubs=[],this._searchTimer&&clearTimeout(this._searchTimer),this._activityTimer&&clearInterval(this._activityTimer),super.disconnectedCallback()}async _loadAll(){if(!(!this.ctx.gateway||!this.ctx.connected)){this.loading=!0,this.error=null;try{const e=this.ctx.gateway,[a,s,d,o,r,p,y]=await Promise.all([e.request("secondBrain.memoryPulse",{}),e.request("secondBrain.activity",{limit:20}),e.request("secondBrain.memoryBank",{}),e.request("secondBrain.fileTree",{depth:3}),e.request("secondBrain.identityCard",{}).catch(()=>null),e.request("secondBrain.recentPeople",{limit:8}).catch(()=>null),e.request("secondBrain.vaultHealth",{}).catch(()=>null)]);this.pulse=a,this.activity=s,this.memoryBank=d,this.fileTree=o.tree??[],this.identityCard=r,this.recentPeople=p?.people??null,this.peopleTotalCount=p?.total??0,this.vaultHealth=y,Promise.all([e.request("ingestion.screenpipeStatus",{}).catch(()=>null),e.request("ingestion.status",{}).catch(()=>null),e.request("secondBrain.mcpStatus",{}).catch(()=>null)]).then(([m,$,g])=>{this.screenpipeStatus=m,this.ingestionStatus=$,this.mcpStatusData=g})}catch(e){console.error("[Brain] Load failed:",e),this.error=e instanceof Error?e.message:"Failed to load"}finally{this.loading=!1}}}async _refreshActivity(){if(!(!this.ctx.gateway||!this.ctx.connected))try{const e=await this.ctx.gateway.request("secondBrain.activity",{limit:20});this.activity=e}catch{}}async _doSearch(e){if(!this.ctx.gateway||!this.ctx.connected||!e.trim()){this.searchResults=null,this.searching=!1;return}this.searching=!0;try{const a=await this.ctx.gateway.request("secondBrain.search",{query:e,limit:30});this.searchQuery===e&&(this.searchResults=a.results??[])}catch(a){console.error("[Brain] Search failed:",a)}finally{this.searching=!1}}_onSearchInput(e){const a=e.target.value;if(this.searchQuery=a,this._searchTimer&&clearTimeout(this._searchTimer),!a.trim()){this.searchResults=null;return}this._searchTimer=setTimeout(()=>{this._doSearch(a)},300)}async _openFile(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const a=await this.ctx.gateway.request("secondBrain.memoryBankEntry",{path:e});if(a?.content){const s=e.endsWith(".html")||e.endsWith(".htm");this.ctx.openSidebar({content:a.content,mimeType:s?"text/html":"text/markdown",filePath:e,title:a.name||e.split("/").pop()||"File"})}}catch(a){console.error("[Brain] Open file failed:",a),this.ctx.addToast("Failed to open file","error")}}async _browseFolder(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const a=await this.ctx.gateway.request("secondBrain.memoryBank",{folder:e});this.browsingFolder=a.folder,this.folderName=a.folderName,this.folderEntries=a.entries}catch(a){console.error("[Brain] Browse folder failed:",a)}}_exitFolder(){this.browsingFolder=null,this.folderEntries=null,this.folderName=null}_chatNavigate(e){u.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:e})}async _toggleScreenpipe(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{await this.ctx.gateway.request("ingestion.screenpipeToggle",{enabled:e}),this.screenpipeStatus&&(this.screenpipeStatus={...this.screenpipeStatus,enabled:e}),this.ctx.addToast(e?"Ambient memory enabled":"Ambient memory paused","success")}catch{this.ctx.addToast("Failed to update Screenpipe config","error")}}async _runPipeline(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{await this.ctx.gateway.request("ingestion.runPipeline",{pipeline:e}),this.ctx.addToast(`Pipeline "${e}" triggered`,"success")}catch{this.ctx.addToast(`Failed to run pipeline "${e}"`,"error")}}render(){return this.loading&&!this.pulse&&!this.identityCard?t`
        <div class="brain-loading">
          <div class="brain-skeleton brain-skeleton--card"></div>
          <div class="brain-skeleton-row">
            <div class="brain-skeleton brain-skeleton--panel"></div>
            <div class="brain-skeleton brain-skeleton--panel"></div>
            <div class="brain-skeleton brain-skeleton--panel"></div>
          </div>
        </div>
      `:this.error&&!this.pulse?t`<div class="brain-error">${this.error}</div>`:this.browsingFolder&&this.folderEntries?t`
        <section class="brain-dashboard">
          <button class="brain-back-btn" @click=${()=>this._exitFolder()}>
            \u{2190} Back
          </button>
          <div class="brain-section">
            <div class="brain-section-header">
              <span class="brain-section-title">${this.folderName??"Folder"}</span>
              <span class="brain-section-count">${this.folderEntries.length}</span>
            </div>
            <div class="brain-entry-list">
              ${this.folderEntries.length>0?this.folderEntries.map(e=>this._renderEntry(e)):t`<div class="brain-empty-inline">Empty folder</div>`}
            </div>
          </div>
        </section>
      `:t`
      <section class="brain-dashboard">
        <div class="brain-header">
          <h1 class="brain-page-title">Your Brain</h1>
          <button
            class="brain-engine-toggle ${this.engineExpanded?"brain-engine-toggle--active":""}"
            @click=${()=>{this.engineExpanded=!this.engineExpanded}}
            title="Toggle Engine panel"
            aria-label="Toggle Engine panel"
          >\u{2699}\u{FE0F} Engine</button>
        </div>

        ${this._renderIdentityCard()}
        ${this._renderSearch()}
        ${this.searchQuery.trim()?i:t`
          <div class="brain-panels">
            <div class="brain-panel brain-panel--pulse">
              ${this._renderPulsePanel()}
            </div>
            <div class="brain-panel brain-panel--people">
              ${this._renderPeoplePanel()}
            </div>
            <div class="brain-panel brain-panel--knowledge">
              ${this._renderKnowledgePanel()}
            </div>
          </div>
          ${this.engineExpanded?this._renderEngine():i}
        `}
      </section>
    `}_renderIdentityCard(){const e=this.identityCard;return e?t`
      <div class="brain-identity-card">
        <div class="brain-id-header">
          <h2 class="brain-id-name">${e.name}</h2>
          ${e.tagline?t`<p class="brain-id-tagline">${e.tagline}</p>`:i}
        </div>

        ${e.peerRepresentation?t`
          <div class="brain-id-representation">
            ${P(e.peerRepresentation)}
          </div>
        `:t`
          <div class="brain-id-representation brain-id-rep--empty">
            <p>Your AI is still learning about you. Keep chatting \u2014 this card fills in automatically.</p>
          </div>
        `}

        ${e.currentFocus?t`
          <div class="brain-id-focus">
            <span class="brain-id-focus-label">Currently focused on:</span>
            <span class="brain-id-focus-text">${e.currentFocus}</span>
          </div>
        `:i}

        <div class="brain-id-stats">
          <div class="brain-id-stat">
            <span class="brain-id-stat-value">${e.stats.peopleTracked}</span>
            <span class="brain-id-stat-label">People</span>
          </div>
          <div class="brain-id-stat">
            <span class="brain-id-stat-value">${e.stats.dailyNotes}</span>
            <span class="brain-id-stat-label">Daily Notes</span>
          </div>
          <div class="brain-id-stat">
            <span class="brain-id-stat-value">${e.stats.totalNotes}</span>
            <span class="brain-id-stat-label">Total Files</span>
          </div>
          ${this.pulse?t`
            <div class="brain-id-stat">
              <span class="brain-id-stat-value">${this.pulse.readyCount}/${this.pulse.totalCount}</span>
              <span class="brain-id-stat-label">Systems</span>
            </div>
          `:i}
        </div>

        <div class="brain-id-footer">
          <button class="brain-id-correct-btn" @click=${()=>this._chatNavigate("I want to correct something in my identity card. Here's what needs updating:")}>Edit via Chat</button>
          ${e.lastUpdated?t`
            <span class="brain-id-updated">Updated ${h(e.lastUpdated)}</span>
          `:i}
        </div>
      </div>
    `:t`
        <div class="brain-identity-card brain-identity-card--empty">
          <div class="brain-id-representation brain-id-rep--empty">
            <p>Your AI is still learning about you. Keep chatting \u2014 this card fills in automatically.</p>
            <button class="brain-action-btn" @click=${()=>this._chatNavigate("I want to build my identity profile. Ask me about my values, principles, vision, and communication style.")}>Start chatting \u{2192}</button>
          </div>
        </div>
      `}_renderSearch(){return t`
      <div class="brain-search-container">
        <div class="brain-search-bar">
          <span class="brain-search-icon">\u{1F50D}</span>
          <input
            class="brain-search-input"
            type="text"
            placeholder="Search your memory \u2014 Honcho, Vault, Sessions, Screenpipe..."
            .value=${this.searchQuery}
            @input=${e=>this._onSearchInput(e)}
            aria-label="Search your brain"
          />
          ${this.searching?t`<div class="brain-spinner brain-spinner--sm"></div>`:i}
        </div>
        ${this.searchResults?t`
          <div class="brain-search-results">
            <div class="brain-section-header">
              <span class="brain-section-title">Results</span>
              <span class="brain-section-count">${this.searchResults.length}</span>
            </div>
            ${this.searchResults.length>0?t`<div class="brain-entry-list">
                  ${this.searchResults.map(e=>t`
                    <div class="brain-entry" @click=${()=>this._openFile(e.path)}>
                      <div class="brain-entry-icon">\u{1F4C4}</div>
                      <div class="brain-entry-body">
                        <div class="brain-entry-name">
                          ${e.name}
                          ${e.source?t`<span class="brain-source-tag">${E[e.source]??""} ${e.source}</span>`:i}
                          ${e.scope?v(e.scope):i}
                        </div>
                        ${e.matchContext??e.excerpt?t`<div class="brain-entry-excerpt">${e.matchContext??e.excerpt}</div>`:i}
                      </div>
                    </div>
                  `)}
                </div>`:t`<div class="brain-empty-inline">No results for "${this.searchQuery}"</div>`}
          </div>
        `:i}
      </div>
    `}_renderPulsePanel(){return!this.activity||this.activity.events.length===0?t`
        <h2 class="brain-panel-title">Pulse</h2>
        <div class="brain-empty-block">
          <div class="brain-empty-hint">No memory activity yet. As your ally learns, activity will appear here.</div>
        </div>
      `:t`
      <h2 class="brain-panel-title">Pulse
        <span class="brain-section-count">${this.activity.total} events</span>
      </h2>
      ${this.pulse?t`
        <div class="brain-pulse-dots">
          ${this.pulse.systems.map(e=>t`
            <span class="brain-pulse-dot" title="${e.name}: ${e.status}${e.detail?` — ${e.detail}`:""}" aria-label="${e.name}: ${e.status}">
              <span class="brain-dot ${b[e.status]??"brain-dot--offline"}"></span>
              <span class="brain-pulse-label">${e.name}</span>
            </span>
          `)}
        </div>
      `:i}
      <div class="brain-activity-feed">
        ${this.activity.events.slice(0,12).map(e=>t`
          <div class="brain-activity-item">
            <span class="brain-activity-icon">${B[e.type]??"•"}</span>
            <div class="brain-activity-body">
              <span class="brain-activity-title">${e.title}</span>
              ${e.detail?t`<span class="brain-activity-detail">${e.detail}</span>`:i}
            </div>
            ${e.scope?v(e.scope):i}
            <span class="brain-activity-time">${h(e.timestamp)}</span>
          </div>
        `)}
      </div>
    `}_renderPeoplePanel(){const e=this.recentPeople,a=this.memoryBank?.sections.find(r=>r.key==="people")?.entries??[],s=e??a,d=this.peopleTotalCount||a.length;if(s.length===0)return t`
        <h2 class="brain-panel-title">People</h2>
        <div class="brain-empty-block">
          <div class="brain-empty-hint">People you interact with will appear here. Connect your calendar to start.</div>
          <button class="brain-action-btn brain-action-btn--sm" @click=${()=>this._chatNavigate("Help me connect my calendar so my Brain can track the people I interact with.")}>Connect Calendar \u{2192}</button>
        </div>
      `;const o=this.peopleSearch?s.filter(r=>r.name.toLowerCase().includes(this.peopleSearch.toLowerCase())):s;return t`
      <h2 class="brain-panel-title">People
        <span class="brain-section-count">${d} tracked</span>
      </h2>
      <input
        class="brain-people-search"
        type="text"
        placeholder="Filter people..."
        .value=${this.peopleSearch}
        @input=${r=>{this.peopleSearch=r.target.value}}
        aria-label="Filter people"
      />
      <div class="brain-people-list">
        ${o.slice(0,8).map(r=>t`
          <div class="brain-person-card" @click=${()=>this._openFile(r.path)}>
            <div class="brain-person-icon">\u{1F464}</div>
            <div class="brain-person-body">
              <div class="brain-person-name">${r.name}</div>
              ${r.role?t`<div class="brain-person-role">${r.role}</div>`:i}
              ${!r.role&&r.excerpt?t`<div class="brain-person-excerpt">${r.excerpt}</div>`:i}
            </div>
            ${r.updatedAt?t`<div class="brain-person-time">${h(r.updatedAt)}</div>`:i}
          </div>
        `)}
      </div>
      ${d>8?t`
        <button class="brain-see-all-btn" @click=${()=>{const r=this.memoryBank?.sections.find(p=>p.key==="people");r&&this._browseFolder(r.path)}}>See all \u{2192}</button>
      `:i}
    `}_renderKnowledgePanel(){const e=this.vaultHealth,a=e?.stats,s=(this.fileTree?.length??0)>0,d=e?.recentActivity??[];return t`
      <h2 class="brain-panel-title">Knowledge</h2>
      ${a?t`
        <div class="brain-knowledge-stats">
          <div class="brain-kstat"><span class="brain-kstat-val">${a.totalNotes}</span> notes</div>
          <div class="brain-kstat"><span class="brain-kstat-val">${a.projectCount}</span> projects</div>
          <div class="brain-kstat"><span class="brain-kstat-val">${a.brainCount}</span> brain files</div>
          <div class="brain-kstat"><span class="brain-kstat-val">${a.dailyCount}</span> dailies</div>
        </div>
      `:t`
        <div class="brain-empty-block">
          <div class="brain-empty-hint">Your knowledge base grows automatically. Start working and your ally will capture the important stuff.</div>
        </div>
      `}

      ${d.length>0?t`
        <div class="brain-knowledge-recent">
          <h3 class="brain-subsection-title">Recent</h3>
          ${d.slice(0,5).map(o=>t`
            <div class="brain-entry brain-entry--compact" @click=${()=>this._openFile(o.path)}>
              <span class="brain-entry-icon">\u{1F4C4}</span>
              <span class="brain-entry-name">${o.name}</span>
              <span class="brain-entry-meta">${h(o.updatedAt)}</span>
            </div>
          `)}
        </div>
      `:i}

      ${s?t`
        <details class="brain-collapsible">
          <summary class="brain-collapsible-header">
            <span>\u{1F5C2}\u{FE0F} Browse vault</span>
          </summary>
          ${this._renderFileTree(this.fileTree,0)}
        </details>
      `:i}
    `}_renderEngine(){return t`
      <div class="brain-engine">
        <h2 class="brain-engine-title">Engine</h2>

        ${this._renderMemoryLayersTable()}
        ${this._renderIngestionTable()}
        ${this._renderMcpRow()}
        ${this._renderScreenpipeRow()}
      </div>
    `}_renderMemoryLayersTable(){return this.pulse?t`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">Memory Layers</h3>
        <div class="brain-table">
          <div class="brain-table-header">
            <span>Layer</span><span>Status</span><span>Detail</span>
          </div>
          ${this.pulse.systems.map(e=>t`
            <div class="brain-table-row">
              <span class="brain-table-cell">
                <span class="brain-dot ${b[e.status]??"brain-dot--offline"}"></span>
                ${e.name}
              </span>
              <span class="brain-table-cell brain-table-cell--status">${e.status}</span>
              <span class="brain-table-cell brain-table-cell--detail">${e.detail}${e.count!=null?` (${e.count})`:""}</span>
            </div>
          `)}
        </div>
      </div>
    `:i}_renderIngestionTable(){const e=this.ingestionStatus;return e?t`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">Ingestion Pipelines</h3>
        <div class="brain-table">
          <div class="brain-table-header">
            <span>Source</span><span>Status</span><span>Action</span>
          </div>
          ${e.pipelines.map(a=>t`
            <div class="brain-table-row">
              <span class="brain-table-cell">
                <span class="brain-dot ${a.configured?"brain-dot--ready":"brain-dot--offline"}"></span>
                ${a.name}
              </span>
              <span class="brain-table-cell brain-table-cell--status">${a.configured?"Connected":"Not configured"}</span>
              <span class="brain-table-cell">
                ${a.configured?t`<button class="brain-action-btn brain-action-btn--xs" @click=${()=>this._runPipeline(a.name)}>Run now</button>`:t`<span class="brain-muted">${a.envVar}</span>`}
              </span>
            </div>
          `)}
        </div>
      </div>
    `:i}_renderMcpRow(){return t`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">MCP Server</h3>
        <div class="brain-mcp-row">
          <span class="brain-dot ${this.mcpStatusData?.enabled?"brain-dot--ready":"brain-dot--offline"}"></span>
          <span>${this.mcpStatusData?.enabled?"Active":"Inactive"}</span>
          <span class="brain-muted">${this.mcpStatusData?.transport??"stdio"} transport</span>
        </div>
      </div>
    `}_renderScreenpipeRow(){const e=this.screenpipeStatus;return t`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">Screenpipe (Ambient Memory)</h3>
        <div class="brain-screenpipe-row">
          <span class="brain-dot ${e?.available?e.enabled?"brain-dot--ready":"brain-dot--degraded":"brain-dot--offline"}"></span>
          <span>${e?e.available?e.enabled?"Active":"Paused":"Not installed":"Loading..."}</span>
          ${e?.available?t`
            <button class="brain-action-btn brain-action-btn--xs" @click=${()=>this._toggleScreenpipe(!e.enabled)}>
              ${e.enabled?"Pause":"Enable"}
            </button>
          `:i}
        </div>
      </div>
    `}_renderEntry(e){const a=e.isDirectory;return t`
      <div class="brain-entry" @click=${()=>{a?this._browseFolder(e.path):this._openFile(e.path)}}>
        <div class="brain-entry-icon ${a?"brain-entry-icon--folder":""}">${a?"📁":"📄"}</div>
        <div class="brain-entry-body">
          <div class="brain-entry-name">${e.name}${a?"/":""}</div>
          ${e.excerpt?t`<div class="brain-entry-excerpt">${e.excerpt}</div>`:i}
        </div>
        ${e.updatedAt?t`<div class="brain-entry-meta">${h(e.updatedAt)}</div>`:i}
      </div>
    `}_renderFileTree(e,a){return t`
      <div class="brain-file-tree" style="padding-left: ${a*16}px">
        ${e.map(s=>s.type==="folder"?t`
              <details class="brain-tree-folder">
                <summary class="brain-tree-item brain-tree-folder-name">
                  <span class="brain-file-icon">\u{1F4C1}</span>
                  <span>${s.name}</span>
                  ${s.childCount!=null?t`<span class="brain-tree-count">${s.childCount}</span>`:i}
                </summary>
                ${s.children?this._renderFileTree(s.children,a+1):i}
              </details>
            `:t`
            <button class="brain-tree-item brain-tree-file" @click=${()=>this._openFile(s.path)}>
              <span class="brain-file-icon">\u{1F4C4}</span>
              <span class="brain-file-name">${s.name}</span>
              ${s.size!=null?t`<span class="brain-tree-size">${s.size<1024?`${s.size}B`:`${(s.size/1024).toFixed(1)}K`}</span>`:i}
            </button>
          `)}
      </div>
    `}};l([w({context:S,subscribe:!0})],n.prototype,"ctx",2);l([c()],n.prototype,"identityCard",2);l([c()],n.prototype,"loading",2);l([c()],n.prototype,"error",2);l([c()],n.prototype,"pulse",2);l([c()],n.prototype,"activity",2);l([c()],n.prototype,"memoryBank",2);l([c()],n.prototype,"fileTree",2);l([c()],n.prototype,"vaultHealth",2);l([c()],n.prototype,"recentPeople",2);l([c()],n.prototype,"peopleTotalCount",2);l([c()],n.prototype,"peopleSearch",2);l([c()],n.prototype,"screenpipeStatus",2);l([c()],n.prototype,"ingestionStatus",2);l([c()],n.prototype,"mcpStatusData",2);l([c()],n.prototype,"searchQuery",2);l([c()],n.prototype,"searchResults",2);l([c()],n.prototype,"searching",2);l([c()],n.prototype,"engineExpanded",2);l([c()],n.prototype,"expandedPulseSystem",2);l([c()],n.prototype,"browsingFolder",2);l([c()],n.prototype,"folderEntries",2);l([c()],n.prototype,"folderName",2);n=l([x("gm-brain")],n);export{n as GmBrain};
