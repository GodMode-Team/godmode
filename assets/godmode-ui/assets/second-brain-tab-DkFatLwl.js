import{d as y,b as e,A as i,o as f,g as $,r as o,t as g}from"./lit-core-CTInmNPB.js";import{a as h,w as S}from"./index-DcYipcbm.js";import{a as _}from"./views-settings-B2UFEtoi.js";import{f as x}from"./ctrl-settings-COfcdhha.js";import"./markdown-i_gIkIP3.js";var w=Object.defineProperty,k=Object.getOwnPropertyDescriptor,l=(s,t,n,r)=>{for(var a=r>1?void 0:r?k(t,n):t,d=s.length-1,p;d>=0;d--)(p=s[d])&&(a=(r?p(t,n,a):p(a))||a);return r&&a&&w(t,n,a),a};function u(s){if(!s)return"";try{return x(new Date(s).getTime())}catch{return""}}function F(s){return e`<div class="sb-md-body">${f(_(s))}</div>`}const b={ready:"sb-dot--ready",degraded:"sb-dot--degraded",offline:"sb-dot--offline"},B={"vault-capture":"📝","identity-update":"👤","calendar-enrichment":"📅","thought-captured":"💭",search:"🔍","file-modified":"📄"},C={honcho:"🟣",vault:"📓",session:"💬",screenpipe:"📺"};function v(s){return!s||s==="personal"?e`<span class="sb-scope-badge sb-scope-badge--personal" title="Personal memory">\u{1F512} personal</span>`:e`<span class="sb-scope-badge sb-scope-badge--shared" title="Shared to ${s}">\u{2197}\u{FE0F} ${s}</span>`}let c=class extends y{constructor(){super(...arguments),this.loading=!1,this.error=null,this.pulse=null,this.activity=null,this.identity=null,this.memoryBank=null,this.fileTree=null,this.screenpipeStatus=null,this.ingestionStatus=null,this.searchQuery="",this.searchResults=null,this.searching=!1,this.browsingFolder=null,this.folderEntries=null,this.folderName=null,this.expandedPulseSystem=null,this._unsubs=[],this._searchTimer=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._unsubs.push(h.on("refresh-requested",s=>{s.target==="second-brain"&&this._loadAll()})),this._loadAll()}disconnectedCallback(){for(const s of this._unsubs)s();this._unsubs=[],this._searchTimer&&clearTimeout(this._searchTimer),super.disconnectedCallback()}async _loadAll(){if(!(!this.ctx.gateway||!this.ctx.connected)){this.loading=!0,this.error=null;try{const s=this.ctx.gateway,[t,n,r,a,d]=await Promise.all([s.request("secondBrain.memoryPulse",{}),s.request("secondBrain.activity",{limit:20}),s.request("secondBrain.identity",{}),s.request("secondBrain.memoryBank",{}),s.request("secondBrain.fileTree",{depth:3})]);this.pulse=t,this.activity=n,this.identity=r,this.memoryBank=a,this.fileTree=d.tree??[],Promise.all([s.request("ingestion.screenpipeStatus",{}).catch(()=>null),s.request("ingestion.status",{}).catch(()=>null)]).then(([p,m])=>{this.screenpipeStatus=p,this.ingestionStatus=m})}catch(s){console.error("[SecondBrain] Load failed:",s),this.error=s instanceof Error?s.message:"Failed to load"}finally{this.loading=!1}}}async _doSearch(s){if(!this.ctx.gateway||!this.ctx.connected||!s.trim()){this.searchResults=null,this.searching=!1;return}this.searching=!0;try{const t=await this.ctx.gateway.request("secondBrain.search",{query:s,limit:30});this.searchQuery===s&&(this.searchResults=t.results??[])}catch(t){console.error("[SecondBrain] Search failed:",t)}finally{this.searching=!1}}_onSearchInput(s){const t=s.target.value;if(this.searchQuery=t,this._searchTimer&&clearTimeout(this._searchTimer),!t.trim()){this.searchResults=null;return}this._searchTimer=setTimeout(()=>{this._doSearch(t)},300)}async _openFile(s){if(!(!this.ctx.gateway||!this.ctx.connected))try{const t=await this.ctx.gateway.request("secondBrain.memoryBankEntry",{path:s});if(t?.content){const n=s.endsWith(".html")||s.endsWith(".htm");this.ctx.openSidebar({content:t.content,mimeType:n?"text/html":"text/markdown",filePath:s,title:t.name||s.split("/").pop()||"File"})}}catch(t){console.error("[SecondBrain] Open file failed:",t),this.ctx.addToast("Failed to open file","error")}}async _browseFolder(s){if(!(!this.ctx.gateway||!this.ctx.connected))try{const t=await this.ctx.gateway.request("secondBrain.memoryBank",{folder:s});this.browsingFolder=t.folder,this.folderName=t.folderName,this.folderEntries=t.entries}catch(t){console.error("[SecondBrain] Browse folder failed:",t)}}_exitFolder(){this.browsingFolder=null,this.folderEntries=null,this.folderName=null}_chatNavigate(s){h.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:s})}render(){return this.loading&&!this.pulse?e`<div class="sb-loading"><div class="sb-spinner"></div>Loading Second Brain...</div>`:this.error&&!this.pulse?e`<div class="sb-error">${this.error}</div>`:this.browsingFolder&&this.folderEntries?e`
        <section class="sb-dashboard">
          <button class="sb-back-btn" @click=${()=>this._exitFolder()}>
            \u{2190} Back
          </button>
          <div class="sb-section">
            <div class="sb-section-header">
              <span class="sb-section-title">${this.folderName??"Folder"}</span>
              <span class="sb-section-count">${this.folderEntries.length}</span>
            </div>
            <div class="sb-entry-list">
              ${this.folderEntries.length>0?this.folderEntries.map(s=>this._renderEntry(s)):e`<div class="sb-empty-inline">Empty folder</div>`}
            </div>
          </div>
        </section>
      `:e`
      <section class="sb-dashboard">
        ${this._renderMemoryPulse()}
        ${this._renderSearch()}
        ${this.searchQuery.trim()?i:e`
          ${this._renderActivityFeed()}
          ${this._renderIdentityCard()}
          ${this._renderPeopleEntities()}
          ${this._renderKnowledgeBrowser()}
          ${this._renderScreenpipePanel()}
          ${this._renderIngestionStatus()}
        `}
      </section>
    `}_renderMemoryPulse(){return this.pulse?e`
      <div class="sb-pulse">
        <div class="sb-pulse-systems">
          ${this.pulse.systems.map(s=>e`
            <button
              class="sb-pulse-pill"
              @click=${()=>{this.expandedPulseSystem=this.expandedPulseSystem===s.id?null:s.id}}
            >
              <span class="sb-dot ${b[s.status]??"sb-dot--offline"}"></span>
              <span class="sb-pulse-name">${s.name}</span>
            </button>
          `)}
          <span class="sb-pulse-summary">${this.pulse.readyCount}/${this.pulse.totalCount} systems</span>
        </div>
        ${this.expandedPulseSystem?e`
          <div class="sb-pulse-detail">
            ${this.pulse.systems.filter(s=>s.id===this.expandedPulseSystem).map(s=>e`
                <div class="sb-pulse-detail-row">
                  <span class="sb-dot ${b[s.status]}"></span>
                  <strong>${s.name}</strong>
                  <span class="sb-muted">${s.detail}</span>
                  ${s.count!=null?e`<span class="sb-badge">${s.count}</span>`:i}
                </div>
              `)}
          </div>
        `:i}
      </div>
    `:i}_renderSearch(){return e`
      <div class="sb-search-container">
        <div class="sb-search-bar">
          <span class="sb-search-icon">\u{1F50D}</span>
          <input
            class="sb-search-input"
            type="text"
            placeholder="Search your memory \u2014 Honcho, Vault, Sessions, Screenpipe..."
            .value=${this.searchQuery}
            @input=${s=>this._onSearchInput(s)}
          />
          ${this.searching?e`<div class="sb-spinner sb-spinner--sm"></div>`:i}
        </div>
        ${this.searchResults?e`
          <div class="sb-search-results">
            <div class="sb-section-header">
              <span class="sb-section-title">Results</span>
              <span class="sb-section-count">${this.searchResults.length}</span>
            </div>
            ${this.searchResults.length>0?e`<div class="sb-entry-list">
                  ${this.searchResults.map(s=>e`
                    <div class="sb-entry" @click=${()=>this._openFile(s.path)}>
                      <div class="sb-entry-icon">\u{1F4C4}</div>
                      <div class="sb-entry-body">
                        <div class="sb-entry-name">
                          ${s.name}
                          ${s.source?e`<span class="sb-source-tag">${C[s.source]??""} ${s.source}</span>`:i}
                          ${s.scope?v(s.scope):i}
                        </div>
                        ${s.matchContext??s.excerpt?e`<div class="sb-entry-excerpt">${s.matchContext??s.excerpt}</div>`:i}
                      </div>
                    </div>
                  `)}
                </div>`:e`<div class="sb-empty-inline">No results for "${this.searchQuery}"</div>`}
          </div>
        `:i}
      </div>
    `}_renderActivityFeed(){return!this.activity||this.activity.events.length===0?e`
        <div class="sb-section">
          <div class="sb-section-header">
            <span class="sb-section-title">Recent Activity</span>
          </div>
          <div class="sb-empty-block">
            <div class="sb-empty-hint">No memory activity yet. As your ally learns, activity will appear here.</div>
          </div>
        </div>
      `:e`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">Recent Activity</span>
          <span class="sb-section-count">${this.activity.total} events</span>
        </div>
        <div class="sb-activity-feed">
          ${this.activity.events.slice(0,15).map(s=>e`
            <div class="sb-activity-item">
              <span class="sb-activity-icon">${B[s.type]??"•"}</span>
              <div class="sb-activity-body">
                <span class="sb-activity-title">${s.title}</span>
                ${s.detail?e`<span class="sb-activity-detail">${s.detail}</span>`:i}
              </div>
              ${s.scope?v(s.scope):i}
              <span class="sb-activity-time">${u(s.timestamp)}</span>
            </div>
          `)}
        </div>
      </div>
    `}_renderIdentityCard(){return!this.identity||this.identity.files.length===0?e`
        <div class="sb-section">
          <div class="sb-section-header">
            <span class="sb-section-title">Identity</span>
          </div>
          <div class="sb-empty-block">
            <div class="sb-empty-hint">Tell your ally about yourself to build your identity profile.</div>
            <button class="sb-action-btn" @click=${()=>this._chatNavigate("I want to build my identity profile. Ask me about my values, principles, vision, and communication style.")}>Tell your ally about you</button>
          </div>
        </div>
      `:e`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">Identity</span>
          <button class="sb-action-btn sb-action-btn--sm" @click=${()=>this._chatNavigate("I want to update my identity profile. Ask me what I'd like to change.")}>Edit via Chat</button>
        </div>
        <div class="sb-identity-grid">
          ${this.identity.files.map(s=>e`
            <div class="sb-identity-card" @click=${()=>this._openFile(s.key)}>
              <div class="sb-identity-label">${s.label}</div>
              <div class="sb-identity-excerpt">${s.content.slice(0,100).replace(/[#\n]+/g," ").trim()}\u{2026}</div>
              ${s.updatedAt?e`<div class="sb-identity-time">${u(s.updatedAt)}</div>`:i}
            </div>
          `)}
        </div>
      </div>
    `}_renderPeopleEntities(){if(!this.memoryBank)return i;const s=this.memoryBank.sections.find(a=>a.key==="people"),t=this.memoryBank.sections.find(a=>a.key==="companies"),n=(s?.entries.length??0)>0,r=(t?.entries.length??0)>0;return!n&&!r?e`
        <div class="sb-section">
          <div class="sb-section-header">
            <span class="sb-section-title">People & Companies</span>
          </div>
          <div class="sb-empty-block">
            <div class="sb-empty-hint">Your ally will build profiles for people and companies as you mention them.</div>
          </div>
        </div>
      `:e`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">People & Companies</span>
          <span class="sb-section-count">${(s?.entries.length??0)+(t?.entries.length??0)}</span>
        </div>
        <div class="sb-people-grid">
          ${(s?.entries??[]).map(a=>e`
            <div class="sb-person-card" @click=${()=>this._openFile(a.path)}>
              <div class="sb-person-icon">\u{1F464}</div>
              <div class="sb-person-body">
                <div class="sb-person-name">${a.name}</div>
                ${a.excerpt?e`<div class="sb-person-excerpt">${a.excerpt}</div>`:i}
              </div>
              ${a.updatedAt?e`<div class="sb-person-time">${u(a.updatedAt)}</div>`:i}
            </div>
          `)}
          ${(t?.entries??[]).map(a=>e`
            <div class="sb-person-card" @click=${()=>this._openFile(a.path)}>
              <div class="sb-person-icon">\u{1F3E2}</div>
              <div class="sb-person-body">
                <div class="sb-person-name">${a.name}</div>
                ${a.excerpt?e`<div class="sb-person-excerpt">${a.excerpt}</div>`:i}
              </div>
              ${a.updatedAt?e`<div class="sb-person-time">${u(a.updatedAt)}</div>`:i}
            </div>
          `)}
        </div>
      </div>
    `}_renderKnowledgeBrowser(){const s=this.memoryBank?.sections.find(d=>d.key==="projects"),t=(s?.entries.length??0)>0,n=!!this.memoryBank?.curated,r=(this.memoryBank?.extraFiles.length??0)>0,a=(this.fileTree?.length??0)>0;return!t&&!n&&!r&&!a?i:e`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">Knowledge</span>
        </div>

        ${t?e`
          <details class="sb-collapsible">
            <summary class="sb-collapsible-header">
              <span>\u{1F4C2} Projects</span>
              <span class="sb-section-count">${s.entries.length}</span>
            </summary>
            <div class="sb-entry-list">
              ${s.entries.map(d=>this._renderEntry(d))}
            </div>
          </details>
        `:i}

        ${n?e`
          <details class="sb-collapsible">
            <summary class="sb-collapsible-header">
              <span>\u{2B50} Curated Facts</span>
            </summary>
            <div class="sb-card">${F(this.memoryBank.curated.content)}</div>
          </details>
        `:i}

        ${r?e`
          <details class="sb-collapsible">
            <summary class="sb-collapsible-header">
              <span>\u{1F4CB} Reference Files</span>
              <span class="sb-section-count">${this.memoryBank.extraFiles.length}</span>
            </summary>
            <div class="sb-entry-list">
              ${this.memoryBank.extraFiles.map(d=>this._renderEntry(d))}
            </div>
          </details>
        `:i}

        ${a?e`
          <details class="sb-collapsible">
            <summary class="sb-collapsible-header">
              <span>\u{1F5C2}\uFE0F Browse All Files</span>
            </summary>
            ${this._renderFileTree(this.fileTree,0)}
          </details>
        `:i}
      </div>
    `}_renderScreenpipePanel(){const s=this.screenpipeStatus;return e`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">\u{1F4FA} Ambient Memory (Screenpipe)</span>
          ${s?e`
            <span class="sb-dot ${s.available?"sb-dot--ready":"sb-dot--offline"}"></span>
          `:i}
        </div>
        ${s?s.available?e`
          <div class="sb-screenpipe-active">
            <div class="sb-screenpipe-row">
              <span class="sb-screenpipe-label">Status</span>
              <span class="sb-screenpipe-value">${s.enabled?"Active — capturing":"Connected but not enabled"}</span>
            </div>
            <div class="sb-screenpipe-row">
              <span class="sb-screenpipe-label">Blocked Apps</span>
              <span class="sb-screenpipe-value">${s.blockedApps?.length??0} apps filtered</span>
            </div>
            <div class="sb-screenpipe-actions">
              ${s.enabled?e`
                <button class="sb-action-btn sb-action-btn--muted" @click=${()=>this._toggleScreenpipe(!1)}>Pause</button>
              `:e`
                <button class="sb-action-btn" @click=${()=>this._toggleScreenpipe(!0)}>Enable Ambient Memory</button>
              `}
            </div>
          </div>
        `:e`
          <div class="sb-screenpipe-setup">
            <div class="sb-setup-message">
              Screenpipe captures what's on your screen and in your audio, locally. Your ally uses it to recall context you've seen.
            </div>
            <div class="sb-setup-steps">
              <div class="sb-setup-step">
                <span class="sb-setup-num">1</span>
                <span>Install: <code>brew install screenpipe</code></span>
              </div>
              <div class="sb-setup-step">
                <span class="sb-setup-num">2</span>
                <span>Grant accessibility permissions when prompted</span>
              </div>
              <div class="sb-setup-step">
                <span class="sb-setup-num">3</span>
                <span>Run: <code>screenpipe</code> (keeps running in background)</span>
              </div>
            </div>
            <button class="sb-action-btn" @click=${()=>this._testScreenpipe()}>Check Connection</button>
          </div>
        `:e`
          <div class="sb-empty-block">
            <div class="sb-empty-hint">Loading Screenpipe status...</div>
          </div>
        `}
      </div>
    `}async _testScreenpipe(){if(!(!this.ctx.gateway||!this.ctx.connected))try{const s=await this.ctx.gateway.request("ingestion.screenpipeStatus",{});this.screenpipeStatus=s,s.available?this.ctx.addToast("Screenpipe connected!","success"):this.ctx.addToast("Screenpipe not running. Start it with `screenpipe`.","error")}catch{this.ctx.addToast("Could not check Screenpipe status","error")}}async _toggleScreenpipe(s){if(!(!this.ctx.gateway||!this.ctx.connected))try{await this.ctx.gateway.request("ingestion.screenpipeConfigure",{enabled:s}),this.screenpipeStatus&&(this.screenpipeStatus={...this.screenpipeStatus,enabled:s}),this.ctx.addToast(s?"Ambient memory enabled":"Ambient memory paused","success")}catch{this.ctx.addToast("Failed to update Screenpipe config","error")}}_renderIngestionStatus(){const s=this.ingestionStatus;if(!s)return i;const t=s.pipelines.filter(r=>r.configured),n=s.pipelines.filter(r=>!r.configured);return e`
      <div class="sb-section">
        <div class="sb-section-header">
          <span class="sb-section-title">\u{1F504} Data Sources</span>
          <span class="sb-section-count">${t.length}/${s.pipelines.length} connected</span>
        </div>
        ${t.length>0?e`
          <div class="sb-ingestion-list">
            ${t.map(r=>e`
              <div class="sb-ingestion-item sb-ingestion-item--active">
                <span class="sb-dot sb-dot--ready"></span>
                <span class="sb-ingestion-name">${r.name}</span>
                <span class="sb-ingestion-badge">Connected</span>
              </div>
            `)}
          </div>
        `:i}
        ${n.length>0?e`
          <details class="sb-collapsible">
            <summary class="sb-collapsible-header">
              <span>Available Sources</span>
              <span class="sb-section-count">${n.length}</span>
            </summary>
            <div class="sb-ingestion-list">
              ${n.map(r=>e`
                <div class="sb-ingestion-item">
                  <span class="sb-dot sb-dot--offline"></span>
                  <span class="sb-ingestion-name">${r.name}</span>
                  <span class="sb-muted">${r.envVar}</span>
                </div>
              `)}
            </div>
          </details>
        `:i}
      </div>
    `}_renderEntry(s){const t=s.isDirectory;return e`
      <div class="sb-entry" @click=${()=>{t?this._browseFolder(s.path):this._openFile(s.path)}}>
        <div class="sb-entry-icon ${t?"sb-entry-icon--folder":""}">${t?"📁":"📄"}</div>
        <div class="sb-entry-body">
          <div class="sb-entry-name">${s.name}${t?"/":""}</div>
          ${s.excerpt?e`<div class="sb-entry-excerpt">${s.excerpt}</div>`:i}
        </div>
        ${s.updatedAt?e`<div class="sb-entry-meta">${u(s.updatedAt)}</div>`:i}
      </div>
    `}_renderFileTree(s,t){return e`
      <div class="sb-file-tree" style="padding-left: ${t*16}px">
        ${s.map(n=>n.type==="folder"?e`
              <details class="sb-tree-folder">
                <summary class="sb-tree-item sb-tree-folder-name">
                  <span class="sb-file-icon">\u{1F4C1}</span>
                  <span>${n.name}</span>
                  ${n.childCount!=null?e`<span class="sb-tree-count">${n.childCount}</span>`:i}
                </summary>
                ${n.children?this._renderFileTree(n.children,t+1):i}
              </details>
            `:e`
            <button class="sb-tree-item sb-tree-file" @click=${()=>this._openFile(n.path)}>
              <span class="sb-file-icon">\u{1F4C4}</span>
              <span class="sb-file-name">${n.name}</span>
              ${n.size!=null?e`<span class="sb-tree-size">${n.size<1024?`${n.size}B`:`${(n.size/1024).toFixed(1)}K`}</span>`:i}
            </button>
          `)}
      </div>
    `}};l([$({context:S,subscribe:!0})],c.prototype,"ctx",2);l([o()],c.prototype,"loading",2);l([o()],c.prototype,"error",2);l([o()],c.prototype,"pulse",2);l([o()],c.prototype,"activity",2);l([o()],c.prototype,"identity",2);l([o()],c.prototype,"memoryBank",2);l([o()],c.prototype,"fileTree",2);l([o()],c.prototype,"screenpipeStatus",2);l([o()],c.prototype,"ingestionStatus",2);l([o()],c.prototype,"searchQuery",2);l([o()],c.prototype,"searchResults",2);l([o()],c.prototype,"searching",2);l([o()],c.prototype,"browsingFolder",2);l([o()],c.prototype,"folderEntries",2);l([o()],c.prototype,"folderName",2);l([o()],c.prototype,"expandedPulseSystem",2);c=l([g("gm-second-brain")],c);function I(){return i}export{c as GmSecondBrain,I as renderSecondBrain};
