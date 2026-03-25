import{d as y,b as a,A as n,o as $,g as f,r as c,t as g}from"./lit-core-CTInmNPB.js";import{a as u,w as _}from"./index-ChnrSOVz.js";import{a as k}from"./views-settings-DxBp4K-e.js";import{f as w}from"./ctrl-settings-DzVFzDVa.js";import"./markdown-i_gIkIP3.js";var S=Object.defineProperty,x=Object.getOwnPropertyDescriptor,o=(e,t,i,d)=>{for(var l=d>1?void 0:d?x(t,i):t,s=e.length-1,p;s>=0;s--)(p=e[s])&&(l=(d?p(t,i,l):p(l))||l);return d&&l&&S(t,i,l),l};function b(e){if(!e)return"";try{return w(new Date(e).getTime())}catch{return""}}function C(e){return a`<div class="brain-md-body">${$(k(e))}</div>`}const h={ready:"brain-dot--ready",degraded:"brain-dot--degraded",offline:"brain-dot--offline"},F={"vault-capture":"📝","identity-update":"👤","calendar-enrichment":"📅","thought-captured":"💭",search:"🔍","file-modified":"📄"},P={honcho:"🟣",vault:"📓",session:"💬",screenpipe:"📺"};function v(e){return!e||e==="personal"?n:a`<span class="brain-scope-badge brain-scope-badge--shared" title="Shared to ${e}">\u{2197}\u{FE0F} ${e}</span>`}let r=class extends y{constructor(){super(...arguments),this.identityCard=null,this.loading=!1,this.error=null,this.pulse=null,this.activity=null,this.memoryBank=null,this.fileTree=null,this.vaultHealth=null,this.recentPeople=null,this.peopleTotalCount=0,this.peopleSearch="",this.screenpipeStatus=null,this.ingestionStatus=null,this.mcpStatusData=null,this.searchQuery="",this.searchResults=null,this.searching=!1,this.expandedPulseSystem=null,this.browsingFolder=null,this.folderEntries=null,this.folderName=null,this._unsubs=[],this._searchTimer=null,this._activityTimer=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._unsubs.push(u.on("refresh-requested",e=>{(e.target==="brain"||e.target==="second-brain")&&this._loadAll()})),this._loadAll(),this._activityTimer=setInterval(()=>{this._refreshActivity()},6e4)}disconnectedCallback(){for(const e of this._unsubs)e();this._unsubs=[],this._searchTimer&&clearTimeout(this._searchTimer),this._activityTimer&&clearInterval(this._activityTimer),super.disconnectedCallback()}async _loadAll(){if(!(!this.ctx.gateway||!this.ctx.connected)){this.loading=!0,this.error=null;try{const e=this.ctx.gateway,[t,i,d]=await Promise.all([e.request("secondBrain.memoryPulse",{}),e.request("secondBrain.identityCard",{}).catch(()=>null),e.request("secondBrain.recentPeople",{limit:8}).catch(()=>null)]);this.pulse=t,this.identityCard=i,this.recentPeople=d?.people??null,this.peopleTotalCount=d?.total??0,this.loading=!1,Promise.all([e.request("secondBrain.activity",{limit:20}).catch(()=>null),e.request("secondBrain.memoryBank",{}).catch(()=>null),e.request("secondBrain.fileTree",{depth:3}).catch(()=>({tree:[]})),e.request("secondBrain.vaultHealth",{}).catch(()=>null)]).then(([l,s,p,m])=>{this.activity=l,this.memoryBank=s,this.fileTree=p?.tree??[],this.vaultHealth=m}),Promise.all([e.request("ingestion.screenpipeStatus",{}).catch(()=>null),e.request("ingestion.status",{}).catch(()=>null),e.request("secondBrain.mcpStatus",{}).catch(()=>null)]).then(([l,s,p])=>{this.screenpipeStatus=l,this.ingestionStatus=s,this.mcpStatusData=p})}catch(e){console.error("[Brain] Load failed:",e),this.error=e instanceof Error?e.message:"Failed to load",this.loading=!1}}}async _refreshActivity(){if(!(!this.ctx.gateway||!this.ctx.connected))try{const e=await this.ctx.gateway.request("secondBrain.activity",{limit:20});this.activity=e}catch{}}async _doSearch(e){if(!this.ctx.gateway||!this.ctx.connected||!e.trim()){this.searchResults=null,this.searching=!1;return}this.searching=!0;try{const t=await this.ctx.gateway.request("secondBrain.search",{query:e,limit:30});this.searchQuery===e&&(this.searchResults=t.results??[])}catch(t){console.error("[Brain] Search failed:",t)}finally{this.searching=!1}}_onSearchInput(e){const t=e.target.value;if(this.searchQuery=t,this._searchTimer&&clearTimeout(this._searchTimer),!t.trim()){this.searchResults=null;return}this._searchTimer=setTimeout(()=>{this._doSearch(t)},300)}async _openFile(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const t=await this.ctx.gateway.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const i=e.endsWith(".html")||e.endsWith(".htm");this.ctx.openSidebar({content:t.content,mimeType:i?"text/html":"text/markdown",filePath:e,title:t.name||e.split("/").pop()||"File"})}}catch(t){console.error("[Brain] Open file failed:",t),this.ctx.addToast("Failed to open file","error")}}async _browseFolder(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const t=await this.ctx.gateway.request("secondBrain.memoryBank",{folder:e});this.browsingFolder=t.folder,this.folderName=t.folderName,this.folderEntries=t.entries}catch(t){console.error("[Brain] Browse folder failed:",t)}}_exitFolder(){this.browsingFolder=null,this.folderEntries=null,this.folderName=null}_chatNavigate(e){u.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:e})}async _toggleScreenpipe(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{await this.ctx.gateway.request("ingestion.screenpipeToggle",{enabled:e}),this.screenpipeStatus&&(this.screenpipeStatus={...this.screenpipeStatus,enabled:e}),this.ctx.addToast(e?"Ambient memory enabled":"Ambient memory paused","success")}catch{this.ctx.addToast("Failed to update Screenpipe config","error")}}async _runPipeline(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{await this.ctx.gateway.request("ingestion.runPipeline",{pipeline:e}),this.ctx.addToast(`Pipeline "${e}" triggered`,"success")}catch{this.ctx.addToast(`Failed to run pipeline "${e}"`,"error")}}render(){return this.loading&&!this.pulse&&!this.identityCard?a`
        <div class="brain-loading" role="status" aria-label="Loading your Second Brain">
          <div class="brain-skeleton brain-skeleton--card"></div>
          <div class="brain-skeleton-row">
            <div class="brain-skeleton brain-skeleton--panel"></div>
            <div class="brain-skeleton brain-skeleton--panel"></div>
            <div class="brain-skeleton brain-skeleton--panel"></div>
          </div>
        </div>
      `:this.error&&!this.pulse?a`<div class="brain-error" role="alert">${this.error}</div>`:this.browsingFolder&&this.folderEntries?a`
        <section class="brain-dashboard">
          <button class="brain-back-btn" aria-label="Go back to dashboard" @click=${()=>this._exitFolder()}>
            \u{2190} Back
          </button>
          <div class="brain-section">
            <div class="brain-section-header">
              <span class="brain-section-title">${this.folderName??"Folder"}</span>
              <span class="brain-section-count" aria-label="${this.folderEntries.length} items">${this.folderEntries.length}</span>
            </div>
            <div class="brain-entry-list" role="list" aria-label="Folder contents">
              ${this.folderEntries.length>0?this.folderEntries.map(e=>this._renderEntry(e)):a`<div class="brain-empty-inline">Empty folder</div>`}
            </div>
          </div>
        </section>
      `:a`
      <section class="brain-dashboard" aria-label="Your Second Brain dashboard">
        <div class="brain-header">
          <button
            class="brain-engine-toggle"
            @click=${()=>{this.renderRoot.querySelector(".brain-engine")?.scrollIntoView({behavior:"smooth",block:"start"})}}
            title="Scroll to Engine panel"
            aria-label="Scroll to Engine panel"
          >\u{2699}\u{FE0F} Engine ${this.pulse?.systems?a`<span class="brain-engine-badge">${this.pulse.systems.filter(e=>e.status==="ready").length}/${this.pulse.systems.length}</span>`:n}</button>
        </div>

        ${this._renderIdentityCard()}
        ${this._renderSearch()}
        ${this.searchQuery.trim()?n:a`
          <div class="brain-panels">
            <div class="brain-panel brain-panel--pulse" role="region" aria-label="Memory pulse and activity">
              ${this._renderPulsePanel()}
            </div>
            <div class="brain-panel brain-panel--people" role="region" aria-label="People tracked">
              ${this._renderPeoplePanel()}
            </div>
            <div class="brain-panel brain-panel--knowledge" role="region" aria-label="Knowledge base">
              ${this._renderKnowledgePanel()}
            </div>
          </div>
          ${this._renderEngine()}
        `}
      </section>
    `}_renderIdentityCard(){const e=this.identityCard;return e?a`
      <div class="brain-identity-card" role="region" aria-label="Identity card for ${e.name}">
        <div class="brain-id-header">
          <h2 class="brain-id-name">${e.name}</h2>
          ${e.tagline?a`<p class="brain-id-tagline">${e.tagline}</p>`:n}
        </div>

        ${e.peerRepresentation?a`
          <div class="brain-id-representation">
            ${C(e.peerRepresentation)}
          </div>
        `:a`
          <div class="brain-id-representation brain-id-rep--empty">
            <p>Your AI is still learning about you. Keep chatting \u2014 this card fills in automatically.</p>
          </div>
        `}

        ${e.currentFocus?a`
          <div class="brain-id-focus">
            <span class="brain-id-focus-label">Currently focused on:</span>
            <span class="brain-id-focus-text">${e.currentFocus}</span>
          </div>
        `:n}

        <div class="brain-id-stats" role="group" aria-label="Brain statistics">
          <div class="brain-id-stat" aria-label="${e.stats.peopleTracked} people tracked">
            <span class="brain-id-stat-value">${e.stats.peopleTracked}</span>
            <span class="brain-id-stat-label">People</span>
          </div>
          <div class="brain-id-stat" aria-label="${e.stats.dailyNotes} daily notes">
            <span class="brain-id-stat-value">${e.stats.dailyNotes}</span>
            <span class="brain-id-stat-label">Daily Notes</span>
          </div>
          <div class="brain-id-stat" aria-label="${e.stats.totalNotes} total files">
            <span class="brain-id-stat-value">${e.stats.totalNotes}</span>
            <span class="brain-id-stat-label">Total Files</span>
          </div>
          ${this.pulse?a`
            <div class="brain-id-stat">
              <span class="brain-id-stat-value">${this.pulse.readyCount}/${this.pulse.totalCount}</span>
              <span class="brain-id-stat-label">Systems</span>
            </div>
          `:n}
        </div>

        <div class="brain-id-footer">
          <button class="brain-id-correct-btn" aria-label="Edit your identity card via chat" @click=${()=>this._chatNavigate("I want to correct something in my identity card. Here's what needs updating:")}>Edit via Chat</button>
          ${e.lastUpdated?a`
            <span class="brain-id-updated">Updated ${b(e.lastUpdated)}</span>
          `:n}
        </div>
      </div>
    `:a`
        <div class="brain-identity-card brain-identity-card--empty" role="region" aria-label="Identity card">
          <div class="brain-id-representation brain-id-rep--empty">
            <p>Your AI is still learning about you. Keep chatting \u2014 this card fills in automatically.</p>
            <button class="brain-action-btn" aria-label="Start building your identity profile" @click=${()=>this._chatNavigate("I want to build my identity profile. Ask me about my values, principles, vision, and communication style.")}>Start chatting \u{2192}</button>
          </div>
        </div>
      `}_renderSearch(){return a`
      <div class="brain-search-container" role="search" aria-label="Search your Second Brain">
        <div class="brain-search-bar">
          <span class="brain-search-icon" aria-hidden="true">\u{1F50D}</span>
          <input
            class="brain-search-input"
            type="text"
            placeholder="Search your memory \u2014 Honcho, Vault, Sessions, Screenpipe..."
            .value=${this.searchQuery}
            @input=${e=>this._onSearchInput(e)}
            aria-label="Search your Second Brain"
            aria-controls="brain-search-results"
            aria-expanded=${this.searchResults?"true":"false"}
          />
          ${this.searching?a`<div class="brain-spinner brain-spinner--sm" role="status" aria-label="Searching"></div>`:n}
        </div>
        <div id="brain-search-results" aria-live="polite" aria-atomic="false">
        ${this.searchResults?a`
          <div class="brain-search-results" role="region" aria-label="Search results">
            <div class="brain-section-header">
              <span class="brain-section-title">Results</span>
              <span class="brain-section-count" aria-label="${this.searchResults.length} results found">${this.searchResults.length}</span>
            </div>
            ${this.searchResults.length>0?a`<div class="brain-entry-list" role="list">
                  ${this.searchResults.map(e=>a`
                    <div class="brain-entry" role="listitem" tabindex="0" aria-label="Open ${e.name}" @click=${()=>this._openFile(e.path)} @keydown=${t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this._openFile(e.path))}}>
                      <div class="brain-entry-icon" aria-hidden="true">\u{1F4C4}</div>
                      <div class="brain-entry-body">
                        <div class="brain-entry-name">
                          ${e.name}
                          ${e.source?a`<span class="brain-source-tag">${P[e.source]??""} ${e.source}</span>`:n}
                          ${e.scope?v(e.scope):n}
                        </div>
                        ${e.matchContext??e.excerpt?a`<div class="brain-entry-excerpt">${e.matchContext??e.excerpt}</div>`:n}
                      </div>
                    </div>
                  `)}
                </div>`:a`<div class="brain-empty-inline" role="status">No results for "${this.searchQuery}"</div>`}
          </div>
        `:n}
        </div>
      </div>
    `}_renderPulsePanel(){return!this.activity||this.activity.events.length===0?a`
        <h2 class="brain-panel-title">Pulse</h2>
        <div class="brain-empty-block">
          <div class="brain-empty-hint">No memory activity yet. As your ally learns, activity will appear here.</div>
        </div>
      `:a`
      <h2 class="brain-panel-title">Pulse
        <span class="brain-section-count">${this.activity.total} events</span>
      </h2>
      ${this.pulse?a`
        <div class="brain-pulse-dots" role="status" aria-label="Memory system status: ${this.pulse.readyCount} of ${this.pulse.totalCount} systems ready">
          ${this.pulse.systems.map(e=>a`
            <span class="brain-pulse-dot" title="${e.name}: ${e.status}${e.detail?` — ${e.detail}`:""}" role="img" aria-label="${e.name}: ${e.status}${e.detail?` — ${e.detail}`:""}">
              <span class="brain-dot ${h[e.status]??"brain-dot--offline"}" aria-hidden="true"></span>
              <span class="brain-pulse-label">${e.name}</span>
            </span>
          `)}
        </div>
      `:n}
      <div class="brain-activity-feed" role="log" aria-label="Memory activity feed">
        ${this.activity.events.slice(0,12).map(e=>a`
          <div class="brain-activity-item">
            <span class="brain-activity-icon">${F[e.type]??"•"}</span>
            <div class="brain-activity-body">
              <span class="brain-activity-title">${e.title}</span>
              ${e.detail?a`<span class="brain-activity-detail">${e.detail}</span>`:n}
            </div>
            ${e.scope?v(e.scope):n}
            <span class="brain-activity-time">${b(e.timestamp)}</span>
          </div>
        `)}
      </div>
    `}_renderPeoplePanel(){const e=this.recentPeople,t=this.memoryBank?.sections.find(s=>s.key==="people")?.entries??[],i=e??t,d=this.peopleTotalCount||t.length;if(i.length===0)return a`
        <h2 class="brain-panel-title">People</h2>
        <div class="brain-empty-block">
          <div class="brain-empty-hint">People you interact with will appear here. Connect your calendar to start.</div>
          <button class="brain-action-btn brain-action-btn--sm" aria-label="Connect your calendar to track people" @click=${()=>this._chatNavigate("Help me connect my calendar so my Brain can track the people I interact with.")}>Connect Calendar \u{2192}</button>
        </div>
      `;const l=this.peopleSearch?i.filter(s=>s.name.toLowerCase().includes(this.peopleSearch.toLowerCase())):i;return a`
      <h2 class="brain-panel-title">People
        <span class="brain-section-count">${d} tracked</span>
      </h2>
      <input
        class="brain-people-search"
        type="text"
        placeholder="Filter people..."
        .value=${this.peopleSearch}
        @input=${s=>{this.peopleSearch=s.target.value}}
        aria-label="Filter people"
      />
      <div class="brain-people-list" role="list" aria-label="People in your brain">
        ${l.slice(0,8).map(s=>a`
          <div class="brain-person-card" role="listitem" tabindex="0" aria-label="Open profile for ${s.name}" @click=${()=>this._openFile(s.path)} @keydown=${p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),this._openFile(s.path))}}>
            <div class="brain-person-icon" aria-hidden="true">\u{1F464}</div>
            <div class="brain-person-body">
              <div class="brain-person-name">${s.name}</div>
              ${s.role?a`<div class="brain-person-role">${s.role}</div>`:n}
              ${!s.role&&s.excerpt?a`<div class="brain-person-excerpt">${s.excerpt}</div>`:n}
            </div>
            ${s.updatedAt?a`<div class="brain-person-time">${b(s.updatedAt)}</div>`:n}
          </div>
        `)}
      </div>
      ${d>8?a`
        <button class="brain-see-all-btn" aria-label="See all people" @click=${()=>{const s=this.memoryBank?.sections.find(p=>p.key==="people");s&&this._browseFolder(s.path)}}>See all \u{2192}</button>
      `:n}
    `}_renderKnowledgePanel(){const e=this.vaultHealth,t=e?.stats,i=(this.fileTree?.length??0)>0,d=e?.recentActivity??[];return a`
      <h2 class="brain-panel-title">Knowledge</h2>
      ${t?a`
        <div class="brain-knowledge-stats">
          <div class="brain-kstat"><span class="brain-kstat-val">${t.totalNotes}</span> notes</div>
          <div class="brain-kstat"><span class="brain-kstat-val">${t.projectCount}</span> projects</div>
          <div class="brain-kstat"><span class="brain-kstat-val">${t.brainCount}</span> brain files</div>
          <div class="brain-kstat"><span class="brain-kstat-val">${t.dailyCount}</span> dailies</div>
        </div>
      `:a`
        <div class="brain-empty-block">
          <div class="brain-empty-hint">Your knowledge base grows automatically. Start working and your ally will capture the important stuff.</div>
        </div>
      `}

      ${d.length>0?a`
        <div class="brain-knowledge-recent" role="list" aria-label="Recently modified files">
          <h3 class="brain-subsection-title">Recent</h3>
          ${d.slice(0,5).map(l=>a`
            <div class="brain-entry brain-entry--compact" role="listitem" tabindex="0" aria-label="Open ${l.name}" @click=${()=>this._openFile(l.path)} @keydown=${s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),this._openFile(l.path))}}>
              <span class="brain-entry-icon" aria-hidden="true">\u{1F4C4}</span>
              <span class="brain-entry-name">${l.name}</span>
              <span class="brain-entry-meta">${b(l.updatedAt)}</span>
            </div>
          `)}
        </div>
      `:n}

      ${i?a`
        <details class="brain-collapsible">
          <summary class="brain-collapsible-header">
            <span>\u{1F5C2}\u{FE0F} Browse vault</span>
          </summary>
          ${this._renderFileTree(this.fileTree,0)}
        </details>
      `:n}
    `}_renderEngine(){return a`
      <div class="brain-engine">
        <h2 class="brain-engine-title">Engine</h2>

        ${this._renderMemoryLayersTable()}
        ${this._renderIngestionTable()}
        ${this._renderMcpRow()}
        ${this._renderScreenpipeRow()}
      </div>
    `}_renderMemoryLayersTable(){return this.pulse?a`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">Memory Layers</h3>
        <div class="brain-table brain-table--4col">
          <div class="brain-table-header brain-table-header--4col">
            <span>Layer</span><span>Status</span><span>Detail</span><span>Action</span>
          </div>
          ${this.pulse.systems.map(e=>a`
            <div class="brain-table-row brain-table-row--4col brain-table-row--clickable"
                 @click=${()=>this._chatNavigate(`Tell me about the ${e.name} memory system. What's in it? How's it performing?`)}>
              <span class="brain-table-cell">
                <span class="brain-dot ${h[e.status]??"brain-dot--offline"}"></span>
                ${e.name}
              </span>
              <span class="brain-table-cell brain-table-cell--status">${e.status}</span>
              <span class="brain-table-cell brain-table-cell--detail">${e.detail}${e.count!=null?` (${e.count})`:""}</span>
              <span class="brain-table-cell brain-table-cell--action">
                ${e.status==="offline"||e.status==="degraded"?a`<button class="brain-action-btn brain-action-btn--small"
                      @click=${t=>{t.stopPropagation(),this._chatNavigate(`The ${e.name} system is ${e.status}. Can you diagnose and repair it?`)}}>
                      Repair</button>`:a`<button class="brain-action-btn brain-action-btn--small"
                      @click=${t=>{t.stopPropagation(),this._chatNavigate(`Search my ${e.name} for recent entries. Show me what you know.`)}}>
                      Explore</button>`}
              </span>
            </div>
          `)}
        </div>
      </div>
    `:n}_renderIngestionTable(){const e=this.ingestionStatus;return e?a`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">Ingestion Pipelines</h3>
        <div class="brain-table">
          <div class="brain-table-header">
            <span>Source</span><span>Status</span><span>Action</span>
          </div>
          ${e.pipelines.map(t=>a`
            <div class="brain-table-row">
              <span class="brain-table-cell">
                <span class="brain-dot ${t.configured?"brain-dot--ready":"brain-dot--offline"}"></span>
                ${t.name}
              </span>
              <span class="brain-table-cell brain-table-cell--status">${t.configured?"Connected":"Not configured"}</span>
              <span class="brain-table-cell">
                ${t.configured?a`<button class="brain-action-btn brain-action-btn--xs" aria-label="Run ${t.name} pipeline now" @click=${()=>this._runPipeline(t.name)}>Run now</button>`:a`<button class="brain-action-btn brain-action-btn--xs" @click=${()=>this._chatNavigate(`Help me configure the ${t.name} ingestion pipeline. I need to set up ${t.envVar}.`)}>Set up</button>`}
              </span>
            </div>
          `)}
        </div>
      </div>
    `:n}_renderMcpRow(){const e=this.mcpStatusData?.enabled;return a`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">MCP Server</h3>
        <div class="brain-mcp-row">
          <span class="brain-dot ${e?"brain-dot--ready":"brain-dot--offline"}"></span>
          <span>${e?"Active":"Inactive"}</span>
          <span class="brain-muted">${this.mcpStatusData?.transport??"stdio"} transport</span>
          ${e?n:a`
            <button class="brain-action-btn brain-action-btn--xs" @click=${()=>this._chatNavigate("Help me set up the GodMode MCP server so I can use it with Claude Code or other MCP clients.")}>Set up</button>
          `}
        </div>
      </div>
    `}_renderScreenpipeRow(){const e=this.screenpipeStatus;return a`
      <div class="brain-engine-section">
        <h3 class="brain-subsection-title">Screenpipe (Ambient Memory)</h3>
        <div class="brain-screenpipe-row">
          <span class="brain-dot ${e?.available?e.enabled?"brain-dot--ready":"brain-dot--degraded":"brain-dot--offline"}"></span>
          <span>${e?e.available?e.enabled?"Active":"Paused":"Not installed":"Loading..."}</span>
          ${e?.available?a`
            <button class="brain-action-btn brain-action-btn--xs" aria-label="${e.enabled?"Pause ambient memory":"Enable ambient memory"}" @click=${()=>this._toggleScreenpipe(!e.enabled)}>
              ${e.enabled?"Pause":"Enable"}
            </button>
          `:!e?.available&&e!==null?a`
            <button class="brain-action-btn brain-action-btn--xs" @click=${()=>this._chatNavigate("Help me set up Screenpipe for ambient memory capture. Walk me through installation and configuration step by step.")}>Set up</button>
          `:n}
        </div>
      </div>
    `}_renderEntry(e){const t=e.isDirectory,i=t?"📁":"📄",d=()=>{t?this._browseFolder(e.path):this._openFile(e.path)};return a`
      <div class="brain-entry" role="listitem" tabindex="0" aria-label="${t?"Open folder":"Open file"}: ${e.name}" @click=${d} @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),d())}}>
        <div class="brain-entry-icon ${t?"brain-entry-icon--folder":""}" aria-hidden="true">${i}</div>
        <div class="brain-entry-body">
          <div class="brain-entry-name">${e.name}${t?"/":""}</div>
          ${e.excerpt?a`<div class="brain-entry-excerpt">${e.excerpt}</div>`:n}
        </div>
        ${e.updatedAt?a`<div class="brain-entry-meta">${b(e.updatedAt)}</div>`:n}
      </div>
    `}_renderFileTree(e,t){return a`
      <div class="brain-file-tree" role="tree" aria-label="${t===0?"Vault file browser":""}" style="padding-left: ${t*16}px">
        ${e.map(i=>i.type==="folder"?a`
              <details class="brain-tree-folder" role="treeitem" aria-label="Folder: ${i.name}${i.childCount!=null?`, ${i.childCount} items`:""}">
                <summary class="brain-tree-item brain-tree-folder-name">
                  <span class="brain-file-icon" aria-hidden="true">\u{1F4C1}</span>
                  <span>${i.name}</span>
                  ${i.childCount!=null?a`<span class="brain-tree-count">${i.childCount}</span>`:n}
                </summary>
                ${i.children?this._renderFileTree(i.children,t+1):n}
              </details>
            `:a`
            <button class="brain-tree-item brain-tree-file" role="treeitem" aria-label="Open file: ${i.name}" @click=${()=>this._openFile(i.path)}>
              <span class="brain-file-icon" aria-hidden="true">\u{1F4C4}</span>
              <span class="brain-file-name">${i.name}</span>
              ${i.size!=null?a`<span class="brain-tree-size">${i.size<1024?`${i.size}B`:`${(i.size/1024).toFixed(1)}K`}</span>`:n}
            </button>
          `)}
      </div>
    `}};o([f({context:_,subscribe:!0})],r.prototype,"ctx",2);o([c()],r.prototype,"identityCard",2);o([c()],r.prototype,"loading",2);o([c()],r.prototype,"error",2);o([c()],r.prototype,"pulse",2);o([c()],r.prototype,"activity",2);o([c()],r.prototype,"memoryBank",2);o([c()],r.prototype,"fileTree",2);o([c()],r.prototype,"vaultHealth",2);o([c()],r.prototype,"recentPeople",2);o([c()],r.prototype,"peopleTotalCount",2);o([c()],r.prototype,"peopleSearch",2);o([c()],r.prototype,"screenpipeStatus",2);o([c()],r.prototype,"ingestionStatus",2);o([c()],r.prototype,"mcpStatusData",2);o([c()],r.prototype,"searchQuery",2);o([c()],r.prototype,"searchResults",2);o([c()],r.prototype,"searching",2);o([c()],r.prototype,"expandedPulseSystem",2);o([c()],r.prototype,"browsingFolder",2);o([c()],r.prototype,"folderEntries",2);o([c()],r.prototype,"folderName",2);r=o([g("gm-brain")],r);export{r as GmBrain};
