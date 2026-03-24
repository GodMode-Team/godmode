import{A as r,b as n}from"./lit-core-CTInmNPB.js";import{f as D,aa as Q}from"./ctrl-settings-D8QNVLwA.js";function ot(t){return!Number.isFinite(t)||t<=0?"0 B":t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/(1024*1024)).toFixed(1)} MB`}function z(t){switch(t){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function et(t){return t==="running"?"ws-session-dot ws-session-dot--running":t==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function it(t){return`ws-task-priority ws-task-priority--${t}`}function ct(t){return t==="high"?"High":t==="low"?"Low":"Med"}function rt(t){if(!t)return"";const e=Q();return t===e?"Today":t<e?`Overdue (${t})`:t}function lt(t){if(!t)return"ws-task-due";const e=Q();return t<e?"ws-task-due ws-task-due--overdue":t===e?"ws-task-due ws-task-due--today":"ws-task-due"}function V(t,e="due"){const s={high:0,medium:1,low:2};return[...t].sort((a,o)=>{if(e==="priority"){const i=s[a.priority]-s[o.priority];return i!==0?i:a.dueDate&&o.dueDate?a.dueDate.localeCompare(o.dueDate):a.dueDate&&!o.dueDate?-1:!a.dueDate&&o.dueDate?1:0}if(e==="newest")return(o.createdAt||"").localeCompare(a.createdAt||"");if(a.dueDate&&o.dueDate){const i=a.dueDate.localeCompare(o.dueDate);if(i!==0)return i}else{if(a.dueDate&&!o.dueDate)return-1;if(!a.dueDate&&o.dueDate)return 1}return s[a.priority]-s[o.priority]})}function st(t,e,s,a,o,i,c){const p=t.status==="complete";return a===t.id?n`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${d=>{d.preventDefault();const m=d.currentTarget,u=m.querySelector(".ws-task-edit-input"),k=m.querySelector(".ws-task-date-input"),$=u.value.trim();$&&(i?.(t.id,{title:$,dueDate:k.value||null}),o?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${t.title}
          @click=${d=>d.stopPropagation()}
        />
        <input
          type="date"
          class="ws-task-date-input"
          .value=${t.dueDate??""}
        />
        <button type="submit" class="ws-task-save-btn">Save</button>
        <button
          type="button"
          class="ws-task-cancel-btn"
          @click=${()=>o?.(null)}
        >Cancel</button>
      </form>
    `:n`
    <div class="ws-list-row ws-task-row ${p?"ws-task-row--complete":""}">
      <button
        class="ws-task-check ${p?"ws-task-check--done":""}"
        @click=${()=>e?.(t.id,t.status)}
        title=${p?"Mark incomplete":"Mark complete"}
      >
        ${p?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${p?"ws-task-title--done":""}"
        @click=${()=>o?.(t.id)}
        title="Click to edit"
      >${t.title}</span>
      ${t.briefSection?n`<span class="ws-task-section">${t.briefSection}</span>`:r}
      <span class=${it(t.priority)}>${ct(t.priority)}</span>
      ${t.dueDate?n`<span class=${lt(t.dueDate)}>${rt(t.dueDate)}</span>`:r}
      ${!p&&t.queueStatus?.status==="processing"?n`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${t.queueStatus.roleName} working...
          </span>`:!p&&t.queueStatus?.status==="review"&&s?n`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>s(t.id)}
              title="Review agent output"
            >Review</button>`:t.queueStatus?.status==="done"?n`
                ${c?n`<button
                      class="ws-task-start-btn ws-task-start-btn--done"
                      @click=${()=>c(t.id)}
                      title="Preview agent output"
                    >View Output</button>`:r}
                ${s?n`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>s(t.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:r}
              `:!p&&s?n`<button
                  class="ws-task-start-btn"
                  @click=${()=>s(t.id)}
                  title="Start working on this task"
                >Start</button>`:r}
    </div>
  `}function ft(t,e,s,a,o,i,c){const p=t.status==="complete";return a===t.id?n`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${d=>{d.preventDefault();const m=d.currentTarget,u=m.querySelector(".ws-task-edit-input"),k=m.querySelector(".ws-task-date-input"),$=u.value.trim();$&&(i?.(t.id,{title:$,dueDate:k.value||null}),o?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${t.title}
          @click=${d=>d.stopPropagation()}
        />
        <input
          type="date"
          class="ws-task-date-input"
          .value=${t.dueDate??""}
        />
        <button type="submit" class="ws-task-save-btn">Save</button>
        <button
          type="button"
          class="ws-task-cancel-btn"
          @click=${()=>o?.(null)}
        >Cancel</button>
      </form>
    `:n`
    <div class="ws-list-row ws-task-row ${p?"ws-task-row--complete":""}">
      <button
        class="ws-task-check ${p?"ws-task-check--done":""}"
        @click=${()=>e?.(t.id,t.status)}
        title=${p?"Mark incomplete":"Mark complete"}
      >
        ${p?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${p?"ws-task-title--done":""}"
        @click=${()=>o?.(t.id)}
        title="Click to edit"
      >${t.title}</span>
      ${t.project?n`<span class="ws-task-project">${t.project}</span>`:r}
      ${t.briefSection?n`<span class="ws-task-section">${t.briefSection}</span>`:r}
      <span class=${it(t.priority)}>${ct(t.priority)}</span>
      ${t.dueDate?n`<span class=${lt(t.dueDate)}>${rt(t.dueDate)}</span>`:r}
      ${!p&&t.queueStatus?.status==="processing"?n`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${t.queueStatus.roleName} working...
          </span>`:!p&&t.queueStatus?.status==="review"&&s?n`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>s(t.id)}
              title="Review agent output"
            >Review</button>`:t.queueStatus?.status==="done"?n`
                ${c?n`<button
                      class="ws-task-start-btn ws-task-start-btn--done"
                      @click=${()=>c(t.id)}
                      title="Preview agent output"
                    >View Output</button>`:r}
                ${s?n`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>s(t.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:r}
              `:!p&&s?n`<button
                  class="ws-task-start-btn"
                  @click=${()=>s(t.id)}
                  title="Start working on this task"
                >Start</button>`:r}
    </div>
  `}function $t(t,e){return t.trim()?e.toLowerCase().includes(t.trim().toLowerCase()):!0}function nt(t,e){if(!t.trim())return e;const s=t.trim().toLowerCase();return e.filter(a=>a.name.toLowerCase().includes(s)||a.path.toLowerCase().includes(s)||a.type.toLowerCase().includes(s)||(a.searchText??"").toLowerCase().includes(s))}function at(t,e){if(!t.trim())return e;const s=t.trim().toLowerCase();return e.filter(a=>a.title.toLowerCase().includes(s)||a.key.toLowerCase().includes(s))}function pt(t,e){if(!t.trim())return e;const s=t.trim().toLowerCase();return e.reduce((a,o)=>{if(o.type==="file")(o.name.toLowerCase().includes(s)||o.path.toLowerCase().includes(s))&&a.push(o);else{const i=pt(t,o.children??[]);i.length>0&&a.push({...o,children:i})}return a},[])}function dt(t){let e=0;for(const s of t)s.type==="file"?e++:s.children&&(e+=dt(s.children));return e}const kt=10;function ht(t){if(!t.searchText)return null;const e=t.searchText.trim();if(!e)return null;const s=e.match(/#+ (.+?)(?:\s#|$)/);return s?s[1].trim().slice(0,120):(e.startsWith("---")?e.replace(/^---.*?---\s*/s,""):e).slice(0,120)||null}function vt(t,e=kt){return[...t].sort((s,a)=>a.modified.getTime()-s.modified.getTime()).slice(0,e)}function ut(t,e,s){if(t.type==="file"){const c=s.pinnedPaths.has(t.path);return n`
      <div class="ws-folder-file-row" style="padding-left: ${12+e*16}px">
        <button
          class="ws-folder-file"
          @click=${()=>s.onItemClick?.({path:t.path,name:t.name,type:t.fileType??"text",size:t.size??0,modified:t.modified??new Date})}
        >
          <span class="ws-list-icon">${z(t.fileType??"text")}</span>
          <span class="ws-list-title">${t.name}</span>
          ${t.size!=null?n`<span class="ws-list-meta">${ot(t.size)}</span>`:r}
          ${t.modified?n`<span class="ws-list-meta">${D(t.modified.getTime())}</span>`:r}
        </button>
        <button
          class="ws-pin-btn ${c?"active":""}"
          @click=${()=>s.onPinToggle?.(s.workspaceId,t.path,c)}
          title=${c?"Unpin":"Pin"}
        >
          ${c?"Unpin":"Pin"}
        </button>
      </div>
    `}const a=s.expandedFolders.has(t.path),o=t.children??[],i=dt(o);return n`
    <div class="ws-folder-node">
      <button
        class="ws-folder-header"
        style="padding-left: ${12+e*16}px"
        @click=${()=>s.onToggleFolder?.(t.path)}
      >
        <span class="ws-folder-chevron ${a?"expanded":""}">&#9654;</span>
        <span class="ws-list-icon">&#128193;</span>
        <span class="ws-folder-name">${t.name}</span>
        <span class="ws-folder-count">${i} ${i===1?"file":"files"}</span>
      </button>
      ${a?n`
            <div class="ws-folder-children">
              ${o.map(c=>ut(c,e+1,s))}
            </div>
          `:r}
    </div>
  `}function bt(t,e,s){return n`
    <div class="workspace-card-wrapper">
      <button
        class="workspace-card"
        @click=${()=>{console.log("[workspace-card] click:",t.name,"onSelect:",typeof e),e?.(t)}}
        title="Open workspace"
      >
        <div class="workspace-card-emoji">${t.emoji}</div>
        <div class="workspace-card-content">
          <div class="workspace-card-name">${t.name}</div>
          <div class="workspace-card-meta">
            ${t.connectionCount>0?n`<span>${t.connectionCount} connections</span><span class="workspace-card-separator">•</span>`:r}
            <span>${t.artifactCount} artifacts</span>
            <span class="workspace-card-separator">•</span>
            <span>${t.sessionCount} sessions</span>
            ${t.feedCount>0?n`<span class="workspace-card-separator">•</span><span>${t.feedCount} feed</span>`:r}
            <span class="workspace-card-separator">•</span>
            <span>${D(t.lastUpdated.getTime())}</span>
          </div>
        </div>
      </button>
      ${s?n`<button
            class="workspace-card-delete"
            title="Delete workspace"
            @click=${a=>{a.stopPropagation(),confirm(`Delete workspace "${t.name}"? This removes it from your list but does not delete any files.`)&&s(t)}}
          >&times;</button>`:r}
    </div>
  `}function W(t){const{workspaceId:e,entry:s,pinned:a,onOpen:o,onPinToggle:i}=t;return n`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>o?.(s)}>
        <span class="ws-list-icon">${z(s.type)}</span>
        <span class="ws-list-title">${s.name}</span>
        <span class="ws-list-meta">${ot(s.size)}</span>
        <span class="ws-list-meta">${D(s.modified.getTime())}</span>
      </button>
      <button
        class="ws-pin-btn ${a?"active":""}"
        @click=${()=>i?.(e,s.path,a)}
        title=${a?"Unpin":"Pin"}
      >
        ${a?"Unpin":"Pin"}
      </button>
    </div>
  `}function gt(t){const{workspaceId:e,entry:s,pinned:a,onOpen:o,onPinToggle:i}=t,c=ht(s);return n`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>o?.(s)}>
        <span class="ws-list-icon">${z(s.type)}</span>
        <span class="ws-list-title">${s.name}</span>
        <span class="ws-list-meta">${D(s.modified.getTime())}</span>
        ${c?n`<span class="ws-list-desc">${c}</span>`:r}
      </button>
      <button
        class="ws-pin-btn ${a?"active":""}"
        @click=${()=>i?.(e,s.path,a)}
        title=${a?"Unpin":"Pin"}
      >
        ${a?"Unpin":"Pin"}
      </button>
    </div>
  `}function yt(t,e){return n`
    <div class="workspace-breadcrumbs">
      ${t.map((s,a)=>n`
          ${a>0?n`<span class="breadcrumb-sep">/</span>`:r}
          <button
            class="breadcrumb-item ${a===t.length-1?"breadcrumb-current":""}"
            @click=${()=>e(s.path)}
          >${s.name}</button>
        `)}
    </div>
  `}function Tt(t){const{browseEntries:e,breadcrumbs:s,browseSearchQuery:a,browseSearchResults:o,onBrowseFolder:i,onBrowseSearch:c,onBrowseBack:p,onCreateFolder:f,onItemClick:d}=t,m=o??e??[];return n`
    <div class="workspace-browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${()=>p?.()}>
          &larr; Back
        </button>
        ${s?yt(s,u=>i?.(u)):r}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          .value=${a??""}
          @input=${u=>{const k=u.target;c?.(k.value)}}
        />
        <button
          class="workspace-browse-new-folder"
          @click=${()=>{const u=prompt("New folder name:");if(u?.trim()){const k=s?.[s.length-1]?.path??".";f?.(`${k}/${u.trim()}`)}}}
        >+ Folder</button>
      </div>

      <div class="workspace-browse-list">
        ${m.length===0?n`<div class="workspace-browse-empty">No files found</div>`:m.map(u=>n`
              <button
                class="workspace-browse-entry"
                @click=${()=>{u.type==="folder"?i?.(u.path):d&&d({path:u.path,name:u.name,type:u.fileType??"text",size:u.size??0,modified:new Date})}}
              >
                <span class="browse-entry-icon">${u.type==="folder"?"📁":"📄"}</span>
                <span class="browse-entry-name">${u.name}</span>
                ${u.excerpt?n`<span class="browse-entry-excerpt">${u.excerpt}</span>`:r}
              </button>
            `)}
      </div>
    </div>
  `}function St(t){const{workspace:e,itemSearchQuery:s,expandedFolders:a=new Set,showCompletedTasks:o=!1,onItemSearch:i,onBack:c,onItemClick:p,onSessionClick:f,onPinToggle:d,onPinSessionToggle:m,onToggleFolder:u,onToggleTaskComplete:k,onCreateTask:$,onToggleCompletedTasks:h,onStartTask:P,editingTaskId:v,onEditTask:T,onUpdateTask:w,onBatchPushToDrive:b}=t,S=nt(s,e.pinned).toSorted((l,C)=>C.modified.getTime()-l.modified.getTime()),x=at(s,e.pinnedSessions),g=nt(s,e.outputs).filter(l=>!e.pinned.some(C=>C.path===l.path)),F=(e.folderTree?.length??0)>0,L=F?pt(s,e.folderTree):[],B=at(s,e.sessions),I=new Set(e.pinnedSessions.map(l=>l.key)),O=new Set(e.pinned.map(l=>l.path)),_=s.trim().length>0,A=S.length>0||x.length>0,N=B.length>0||e.sessions.length===0||_,R=vt(e.outputs),q=R.length>0&&!_,j={expandedFolders:a,pinnedPaths:O,workspaceId:e.id,onToggleFolder:u,onItemClick:p,onPinToggle:d};return n`
    <div class="workspaces-container">
      <div class="workspaces-header">
        <div class="workspaces-title">
          <button class="workspace-back-btn" @click=${c}>←</button>
          <span class="workspaces-icon">${e.emoji}</span>
          <div class="workspace-header-text">
            <span class="workspace-header-name">${e.name}</span>
            <span class="workspace-header-desc">${e.path}</span>
          </div>
        </div>
        <div class="workspace-detail-search">
          <input
            type="text"
            class="workspaces-search-input"
            placeholder="Search workspace..."
            .value=${s}
            @input=${l=>i?.(l.target.value)}
          />
          <button
            class="workspace-browse-btn"
            @click=${()=>t.onBrowseFolder?.(".")}
          >Browse Files</button>
        </div>
      </div>

      <div class="workspace-content">
        ${t.browsePath!=null?Tt(t):r}

        ${A?n`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${S.length+x.length}</span>
                  </div>
                  <div class="ws-list">
                    ${x.map(l=>n`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>f?.(l)}>
                            <span class=${et(l.status)}></span>
                            <span class="ws-list-title">${l.title}</span>
                            <span class="ws-list-meta">${D(l.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>m?.(e.id,l.key,!0)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${S.map(l=>W({workspaceId:e.id,entry:l,pinned:!0,onOpen:p,onPinToggle:d}))}
                  </div>
                </section>
              `:r}

        ${xt({tasks:e.tasks??[],workspaceName:e.name,showCompleted:o,onToggleTaskComplete:k,onCreateTask:$,onToggleCompletedTasks:h,onStartTask:P,onViewTaskOutput,editingTaskId:v,onEditTask:T,onUpdateTask:w})}

        ${q?n`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Recent</h3>
                  <span>${R.length}</span>
                </div>
                <div class="ws-list">
                  ${R.map(l=>gt({workspaceId:e.id,entry:l,pinned:O.has(l.path),onOpen:p,onPinToggle:d}))}
                </div>
              </section>
            `:r}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${F?L.length:g.length}</span>
            ${b&&g.length>0?n`<button class="ws-export-drive-btn" @click=${()=>{const l=g.map(C=>C.path);b(l)}}>Export to Drive</button>`:r}
          </div>
          <div class="ws-list ws-list--scroll">
            ${F?L.length===0?n`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:L.map(l=>ut(l,0,j)):g.length===0?n`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:g.map(l=>W({workspaceId:e.id,entry:l,pinned:!1,onOpen:p,onPinToggle:d}))}
          </div>
        </section>

        ${N?n`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${B.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${B.length===0?n`
                            <div class="ws-empty">
                              <span class="ws-empty-hint">No sessions yet. Sessions are saved conversations with your ally — start a chat to create one.</span>
                            </div>
                          `:B.map(l=>n`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>f?.(l)}>
                                  <span class=${et(l.status)}></span>
                                  <span class="ws-list-title">${l.title}</span>
                                  <span class="ws-list-meta">${D(l.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${I.has(l.key)?"active":""}"
                                  @click=${()=>m?.(e.id,l.key,I.has(l.key))}
                                  title=${I.has(l.key)?"Unpin":"Pin"}
                                >
                                  ${I.has(l.key)?"Unpin":"Pin"}
                                </button>
                              </div>
                            `)}
                  </div>
                </section>
              `:r}

        ${(e.memory?.length??0)>0?n`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Memory</h3>
                  <span>${e.memory.length}</span>
                </div>
                <div class="ws-list ws-list--scroll">
                  ${e.memory.map(l=>W({workspaceId:e.id,entry:l,pinned:O.has(l.path),onOpen:p,onPinToggle:d}))}
                </div>
              </section>
            `:r}

        ${Ct({entries:e.feedEntries??[],onPost:t.onPostToFeed,onLoadMore:t.onLoadMoreFeed})}

        ${Dt({connections:e.connections??[],onTest:t.onTestConnection,onRemove:t.onRemoveConnection})}

        ${Pt(e.members??[])}
      </div>
    </div>
  `}function Ct(t){const{entries:e,onPost:s,onLoadMore:a}=t;function o(c){switch(c){case"decision":return"📝";case"request":return"❓";case"artifact":return"📦";case"sop":return"📋";case"alert":return"🚨";default:return"💬"}}function i(c){return c.includes("agent")||c.includes(":agent")?"🤖":c==="system"?"⚙️":"👤"}return n`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Activity Feed</h3>
        <span>${e.length}</span>
      </div>
      <div class="ws-list ws-list--scroll" style="max-height: 400px;">
        ${e.length===0?n`<div class="ws-empty">
              <span class="ws-empty-hint">No activity yet. Post updates, decisions, or requests to the feed.</span>
            </div>`:e.map(c=>n`
              <div class="ws-list-row ws-feed-entry">
                <div class="ws-list-main" style="flex-direction: column; align-items: flex-start; gap: 4px; padding: 8px 12px;">
                  <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                    <span>${i(c.author)}</span>
                    <span class="ws-list-title" style="font-weight: 500;">${c.author}</span>
                    <span style="margin-left: auto;">${o(c.type)}</span>
                    <span class="ws-list-meta">${D(new Date(c.ts).getTime())}</span>
                  </div>
                  <div style="padding-left: 28px; opacity: 0.9; font-size: 0.9em;">${c.text}</div>
                </div>
              </div>
            `)}
      </div>
      ${e.length>=50&&a?n`<button class="ws-task-completed-toggle" @click=${()=>a()}>Load more...</button>`:r}
      ${s?n`
            <form
              class="ws-task-create-form"
              @submit=${c=>{c.preventDefault();const p=c.currentTarget,f=p.querySelector(".ws-feed-input"),d=p.querySelector(".ws-feed-type"),m=f.value.trim();m&&(s(m,d.value),f.value="")}}
            >
              <input
                type="text"
                class="ws-task-create-input ws-feed-input"
                placeholder="Post to feed..."
              />
              <select class="ws-task-create-project ws-feed-type">
                <option value="update">Update</option>
                <option value="decision">Decision</option>
                <option value="request">Request</option>
                <option value="sop">SOP</option>
                <option value="artifact">Artifact</option>
              </select>
              <button type="submit" class="ws-task-create-btn">Post</button>
            </form>
          `:r}
    </section>
  `}function Dt(t){const{connections:e,onTest:s,onRemove:a}=t;function o(i){return i==="connected"?n`<span class="ws-conn-status ws-conn-status--ok">Connected</span>`:i==="error"?n`<span class="ws-conn-status ws-conn-status--error">Error</span>`:n`<span class="ws-conn-status ws-conn-status--unconfigured">Not configured</span>`}return e.length===0?n`
      <section class="ws-section">
        <div class="ws-section__header">
          <h3>Connections</h3>
          <span>0</span>
        </div>
        <div class="ws-empty">
          <span class="ws-empty-hint">No tools connected. Connect Google Drive, ClickUp, HubSpot, or other shared tools via Settings.</span>
        </div>
      </section>
    `:n`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Connections</h3>
        <span>${e.length}</span>
      </div>
      <div class="ws-list">
        ${e.map(i=>n`
          <div class="ws-list-row">
            <div class="ws-list-main" style="gap: 8px;">
              <span class="ws-list-title">${i.name}</span>
              ${o(i.status)}
              ${i.lastSync?n`<span class="ws-list-meta">Synced ${D(new Date(i.lastSync).getTime())}</span>`:r}
              ${i.error?n`<span class="ws-list-meta" style="color: var(--danger-color, #e74c3c);">${i.error}</span>`:r}
            </div>
            <div style="display: flex; gap: 4px;">
              ${s?n`<button class="ws-pin-btn" @click=${()=>s(i.id)} title="Test connection">Test</button>`:r}
              ${a?n`<button class="ws-pin-btn" @click=${()=>{confirm(`Remove connection "${i.name}"?`)&&a(i.id)}} title="Remove connection">Remove</button>`:r}
            </div>
          </div>
        `)}
      </div>
    </section>
  `}function Pt(t){return t.length===0?n``:n`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Members</h3>
        <span>${t.length}</span>
      </div>
      <div class="ws-list">
        ${t.map(e=>n`
          <div class="ws-list-row">
            <div class="ws-list-main">
              <span>👤</span>
              <span class="ws-list-title">${e.name}</span>
              <span class="ws-list-meta">${e.role}</span>
            </div>
          </div>
        `)}
      </div>
    </section>
  `}function xt(t){const{tasks:e,workspaceName:s,showCompleted:a,onToggleTaskComplete:o,onCreateTask:i,onToggleCompletedTasks:c,onStartTask:p,onViewTaskOutput:f,editingTaskId:d,onEditTask:m,onUpdateTask:u}=t,k=V(e.filter(h=>h.status==="pending")),$=V(e.filter(h=>h.status==="complete"));return n`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${k.length} open${$.length>0?`, ${$.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${k.length===0&&$.length===0?n`<div class="ws-empty">No tasks</div>`:r}
        ${k.map(h=>st(h,o,p,d,m,u,f))}
        ${$.length>0?n`
              <button class="ws-task-completed-toggle" @click=${()=>c?.()}>
                ${a?"Hide":"Show"} ${$.length} completed
              </button>
              ${a?$.map(h=>st(h,o,p,d,m,u,f)):r}
            `:r}
      </div>
      ${i?n`
            <form
              class="ws-task-create-form"
              @submit=${h=>{h.preventDefault();const v=h.currentTarget.querySelector("input"),T=v.value.trim();T&&(i(T,s),v.value="")}}
            >
              <input
                type="text"
                class="ws-task-create-input"
                placeholder="Add a task..."
              />
              <button type="submit" class="ws-task-create-btn">Add</button>
            </form>
          `:r}
    </section>
  `}function Ot(t){const{connected:e,workspaces:s,selectedWorkspace:a,searchQuery:o,itemSearchQuery:i,expandedFolders:c,loading:p,createLoading:f,error:d,allTasks:m=[],taskFilter:u="outstanding",taskSort:k="due",taskSearch:$="",showCompletedTasks:h=!1,editingTaskId:P,workspaceNames:v=[],onSearch:T,onItemSearch:w,onSelectWorkspace:b,onBack:S,onItemClick:x,onSessionClick:g,onPinToggle:F,onPinSessionToggle:L,onCreateWorkspace:B,onDeleteWorkspace:I,onToggleFolder:O,onTeamSetup:_,onToggleTaskComplete:A,onCreateTask:N,onSetTaskFilter:R,onSetTaskSort:q,onSetTaskSearch:j,onToggleCompletedTasks:l,onStartTask:C,onViewTaskOutput:wt,onEditTask:H,onUpdateTask:K}=t,U=s.filter(y=>$t(o,`${y.name} ${y.path} ${y.type}`));return a?St({workspace:a,itemSearchQuery:i??"",expandedFolders:c,showCompletedTasks:h,onItemSearch:w,onBack:S,onItemClick:x,onSessionClick:g,onPinToggle:F,onPinSessionToggle:L,onToggleFolder:O,onToggleTaskComplete:A,onCreateTask:N,onToggleCompletedTasks:l,onStartTask:C,editingTaskId:P,onEditTask:H,onUpdateTask:K,browsePath:t.browsePath,browseEntries:t.browseEntries,breadcrumbs:t.breadcrumbs,browseSearchQuery:t.browseSearchQuery,browseSearchResults:t.browseSearchResults,onBrowseFolder:t.onBrowseFolder,onBrowseSearch:t.onBrowseSearch,onBrowseBack:t.onBrowseBack,onCreateFolder:t.onCreateFolder,onBatchPushToDrive:t.onBatchPushToDrive,onPostToFeed:t.onPostToFeed,onLoadMoreFeed:t.onLoadMoreFeed,onTestConnection:t.onTestConnection,onRemoveConnection:t.onRemoveConnection}):n`
    <div class="workspaces-container">
      <div class="workspaces-toolbar">
        <form
            class="workspaces-create-form"
            @submit=${async y=>{if(y.preventDefault(),f||!B)return;const G=y.currentTarget,M=new FormData(G),X=M.get("name"),J=(typeof X=="string"?X:"").trim();if(!J)return;const Y=M.get("type"),E=(typeof Y=="string"?Y:"project").trim().toLowerCase(),mt=E==="team"||E==="personal"?E:"project",Z=M.get("path"),tt=(typeof Z=="string"?Z:"").trim();await B({name:J,type:mt,...tt?{path:tt}:{}})!==!1&&G.reset()}}
          >
            <input
              type="text"
              name="name"
              class="workspaces-create-input"
              placeholder="New workspace name (e.g. Acme Corp)"
              required
            />
            <select name="type" class="workspaces-create-select">
              <option value="project">Project</option>
              <option value="team">Team</option>
              <option value="personal">Personal</option>
            </select>
            <input
              type="text"
              name="path"
              class="workspaces-create-input workspaces-create-input--path"
              placeholder="Optional path (auto-created if blank)"
            />
            <button
              type="submit"
              class="workspaces-add-btn"
              ?disabled=${!!f}
            >
              ${f?"Adding...":"Add Workspace"}
            </button>
          </form>
          <input
            type="text"
            class="workspaces-search-input"
            placeholder="Search workspaces..."
            .value=${o}
            @input=${y=>T?.(y.target.value)}
          />
          <span class="workspaces-count">${U.length} workspaces</span>
          <span class="workspaces-status ${e?"online":"offline"}">
            ${e?"Online":"Offline"}
          </span>
          ${_?n`<button class="ws-team-setup-btn" @click=${()=>_()}>Team Setup</button>`:r}
      </div>

      ${d?n`<div class="callout danger" style="margin: 16px;">${d}</div>`:r}

      ${p?n`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `:n`
              <div class="workspaces-body">
                <div class="workspace-grid">
                  ${U.length===0?n`
                          <div class="workspaces-empty">
                            <span class="workspaces-empty-icon">${e?"📭":"🔌"}</span>
                            <span>${e?"No workspaces yet":"Connect to gateway to see workspaces"}</span>
                            ${e?n`<span class="workspaces-empty-hint">Workspaces organize your projects. Ask your ally to create one, or start a focused session in chat.</span>`:r}
                          </div>
                        `:U.map(y=>bt(y,b,I))}
                </div>

                ${Ft({tasks:m,taskFilter:u,taskSort:k,taskSearch:$,onToggleTaskComplete:A,onSetTaskFilter:R,onSetTaskSort:q,onSetTaskSearch:j,onCreateTask:N,workspaceNames:v,onStartTask:C,editingTaskId:P,onEditTask:H,onUpdateTask:K,onViewTaskOutput:wt})}
              </div>
            `}
    </div>
  `}function Ft(t){const{tasks:e,taskFilter:s,taskSort:a="due",taskSearch:o="",onToggleTaskComplete:i,onSetTaskFilter:c,onSetTaskSort:p,onSetTaskSearch:f,onCreateTask:d,workspaceNames:m=[],onStartTask:u,editingTaskId:k,onEditTask:$,onUpdateTask:h,onViewTaskOutput:P}=t;if(e.length===0&&!d)return n``;let v;if(s==="outstanding")v=e.filter(w=>w.status==="pending");else if(s==="today"){const w=Q();v=e.filter(b=>b.status==="pending"&&b.dueDate!=null&&b.dueDate<=w)}else s==="complete"?v=e.filter(w=>w.status==="complete"):v=e;if(o){const w=o.toLowerCase();v=v.filter(b=>b.title.toLowerCase().includes(w)||b.project?.toLowerCase().includes(w))}const T=V(v,a);return n`
    <div class="ws-all-tasks-section">
      <section class="ws-section">
        <div class="ws-section__header">
          <div class="ws-section__header-left">
            <h3>All Tasks</h3>
            ${f?n`<input
                  type="text"
                  class="ws-task-search"
                  placeholder="Search tasks..."
                  .value=${o}
                  @input=${w=>f(w.target.value)}
                />`:r}
          </div>
          <div class="ws-task-controls">
            <div class="ws-task-filters">
              <button
                class="ws-task-filter-btn ${s==="all"?"active":""}"
                @click=${()=>c?.("all")}
              >All</button>
              <button
                class="ws-task-filter-btn ${s==="outstanding"?"active":""}"
                @click=${()=>c?.("outstanding")}
              >To Do</button>
              <button
                class="ws-task-filter-btn ${s==="today"?"active":""}"
                @click=${()=>c?.("today")}
              >Today</button>
              <button
                class="ws-task-filter-btn ${s==="complete"?"active":""}"
                @click=${()=>c?.("complete")}
              >Done</button>
            </div>
            <select
              class="ws-task-sort"
              .value=${a}
              @change=${w=>p?.(w.target.value)}
            >
              <option value="due">Due Date</option>
              <option value="priority">Priority</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        ${d?n`
              <form
                class="ws-task-create-form"
                @submit=${w=>{w.preventDefault();const b=w.currentTarget,S=b.querySelector(".ws-task-create-input"),x=b.querySelector(".ws-task-create-project"),g=S.value.trim();if(!g)return;const F=x?.value||m[0]||"";d(g,F),S.value=""}}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                />
                ${m.length>0?n`
                      <select class="ws-task-create-project">
                        ${m.map(w=>n`<option value=${w}>${w}</option>`)}
                      </select>
                    `:r}
                <button type="submit" class="ws-task-create-btn">Add</button>
              </form>
            `:r}
        <div class="ws-list ws-list--scroll">
          ${T.length===0?n`<div class="ws-empty">No tasks</div>`:T.map(w=>ft(w,i,u,k,$,h,P))}
        </div>
      </section>
    </div>
  `}export{ft as a,Ot as r,V as s};
