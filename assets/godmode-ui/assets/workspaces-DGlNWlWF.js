import{A as c,b as a}from"./lit-core-CTInmNPB.js";import{f as P,ab as z}from"./ctrl-settings-C-qTCeLa.js";function le(e){return!Number.isFinite(e)||e<=0?"0 B":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function G(e){switch(e){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function se(e){return e==="running"?"ws-session-dot ws-session-dot--running":e==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function oe(e){return`ws-task-priority ws-task-priority--${e}`}function re(e){return e==="high"?"High":e==="low"?"Low":"Med"}function ce(e){if(!e)return"";const t=z();return e===t?"Today":e<t?`Overdue (${e})`:e}function pe(e){if(!e)return"ws-task-due";const t=z();return e<t?"ws-task-due ws-task-due--overdue":e===t?"ws-task-due ws-task-due--today":"ws-task-due"}function Q(e,t="due"){const s={high:0,medium:1,low:2};return[...e].sort((n,i)=>{if(t==="priority"){const l=s[n.priority]-s[i.priority];return l!==0?l:n.dueDate&&i.dueDate?n.dueDate.localeCompare(i.dueDate):n.dueDate&&!i.dueDate?-1:!n.dueDate&&i.dueDate?1:0}if(t==="newest")return(i.createdAt||"").localeCompare(n.createdAt||"");if(n.dueDate&&i.dueDate){const l=n.dueDate.localeCompare(i.dueDate);if(l!==0)return l}else{if(n.dueDate&&!i.dueDate)return-1;if(!n.dueDate&&i.dueDate)return 1}return s[n.priority]-s[i.priority]})}function ae(e,t,s,n,i,l,r){const p=e.status==="complete";return n===e.id?a`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        aria-label="Edit task: ${e.title}"
        @submit=${d=>{d.preventDefault();const m=d.currentTarget,u=m.querySelector(".ws-task-edit-input"),k=m.querySelector(".ws-task-date-input"),b=u.value.trim();b&&(l?.(e.id,{title:b,dueDate:k.value||null}),i?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          aria-label="Task title"
          .value=${e.title}
          @click=${d=>d.stopPropagation()}
        />
        <input
          type="date"
          class="ws-task-date-input"
          aria-label="Task due date"
          .value=${e.dueDate??""}
        />
        <button type="submit" class="ws-task-save-btn" aria-label="Save task changes">Save</button>
        <button
          type="button"
          class="ws-task-cancel-btn"
          aria-label="Cancel editing"
          @click=${()=>i?.(null)}
        >Cancel</button>
      </form>
    `:a`
    <div class="ws-list-row ws-task-row ${p?"ws-task-row--complete":""}" role="listitem">
      <button
        class="ws-task-check ${p?"ws-task-check--done":""}"
        @click=${()=>t?.(e.id,e.status)}
        title=${p?"Mark incomplete":"Mark complete"}
        aria-label="${p?"Mark incomplete":"Mark complete"}: ${e.title}"
      >
        ${p?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${p?"ws-task-title--done":""}"
        @click=${()=>i?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.briefSection?a`<span class="ws-task-section">${e.briefSection}</span>`:c}
      <span class=${oe(e.priority)}>${re(e.priority)}</span>
      ${e.dueDate?a`<span class=${pe(e.dueDate)}>${ce(e.dueDate)}</span>`:c}
      ${!p&&e.queueStatus?.status==="processing"?a`<span class="ws-task-agent-status ws-task-agent-status--processing" aria-live="polite">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!p&&e.queueStatus?.status==="review"&&s?a`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>s(e.id)}
              title="Review agent output"
              aria-label="Review agent output for: ${e.title}"
            >Review</button>`:e.queueStatus?.status==="done"?a`
                ${r?a`<button
                      class="ws-task-start-btn ws-task-start-btn--done"
                      @click=${()=>r(e.id)}
                      title="Preview agent output"
                      aria-label="View output for: ${e.title}"
                    >View Output</button>`:c}
                ${s?a`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>s(e.id)}
                      title="Open chat session for this task"
                      aria-label="Open chat for: ${e.title}"
                    >Open Chat</button>`:c}
              `:!p&&s?a`<button
                  class="ws-task-start-btn"
                  @click=${()=>s(e.id)}
                  title="Start working on this task"
                  aria-label="Start task: ${e.title}"
                >Start</button>`:c}
    </div>
  `}function $e(e,t,s,n,i,l,r){const p=e.status==="complete";return n===e.id?a`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        aria-label="Edit task: ${e.title}"
        @submit=${d=>{d.preventDefault();const m=d.currentTarget,u=m.querySelector(".ws-task-edit-input"),k=m.querySelector(".ws-task-date-input"),b=u.value.trim();b&&(l?.(e.id,{title:b,dueDate:k.value||null}),i?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          aria-label="Task title"
          .value=${e.title}
          @click=${d=>d.stopPropagation()}
        />
        <input
          type="date"
          class="ws-task-date-input"
          aria-label="Task due date"
          .value=${e.dueDate??""}
        />
        <button type="submit" class="ws-task-save-btn" aria-label="Save task changes">Save</button>
        <button
          type="button"
          class="ws-task-cancel-btn"
          aria-label="Cancel editing"
          @click=${()=>i?.(null)}
        >Cancel</button>
      </form>
    `:a`
    <div class="ws-list-row ws-task-row ${p?"ws-task-row--complete":""}" role="listitem">
      <button
        class="ws-task-check ${p?"ws-task-check--done":""}"
        @click=${()=>t?.(e.id,e.status)}
        title=${p?"Mark incomplete":"Mark complete"}
        aria-label="${p?"Mark incomplete":"Mark complete"}: ${e.title}"
      >
        ${p?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${p?"ws-task-title--done":""}"
        @click=${()=>i?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.project?a`<span class="ws-task-project">${e.project}</span>`:c}
      ${e.briefSection?a`<span class="ws-task-section">${e.briefSection}</span>`:c}
      <span class=${oe(e.priority)}>${re(e.priority)}</span>
      ${e.dueDate?a`<span class=${pe(e.dueDate)}>${ce(e.dueDate)}</span>`:c}
      ${!p&&e.queueStatus?.status==="processing"?a`<span class="ws-task-agent-status ws-task-agent-status--processing" aria-live="polite">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!p&&e.queueStatus?.status==="review"&&s?a`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>s(e.id)}
              title="Review agent output"
              aria-label="Review agent output for: ${e.title}"
            >Review</button>`:e.queueStatus?.status==="done"?a`
                ${r?a`<button
                      class="ws-task-start-btn ws-task-start-btn--done"
                      @click=${()=>r(e.id)}
                      title="Preview agent output"
                      aria-label="View output for: ${e.title}"
                    >View Output</button>`:c}
                ${s?a`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>s(e.id)}
                      title="Open chat session for this task"
                      aria-label="Open chat for: ${e.title}"
                    >Open Chat</button>`:c}
              `:!p&&s?a`<button
                  class="ws-task-start-btn"
                  @click=${()=>s(e.id)}
                  title="Start working on this task"
                  aria-label="Start task: ${e.title}"
                >Start</button>`:c}
    </div>
  `}function be(e,t){return e.trim()?t.toLowerCase().includes(e.trim().toLowerCase()):!0}function ne(e,t){if(!e.trim())return t;const s=e.trim().toLowerCase();return t.filter(n=>n.name.toLowerCase().includes(s)||n.path.toLowerCase().includes(s)||n.type.toLowerCase().includes(s)||(n.searchText??"").toLowerCase().includes(s))}function ie(e,t){if(!e.trim())return t;const s=e.trim().toLowerCase();return t.filter(n=>n.title.toLowerCase().includes(s)||n.key.toLowerCase().includes(s))}function de(e,t){if(!e.trim())return t;const s=e.trim().toLowerCase();return t.reduce((n,i)=>{if(i.type==="file")(i.name.toLowerCase().includes(s)||i.path.toLowerCase().includes(s))&&n.push(i);else{const l=de(e,i.children??[]);l.length>0&&n.push({...i,children:l})}return n},[])}function ue(e){let t=0;for(const s of e)s.type==="file"?t++:s.children&&(t+=ue(s.children));return t}const ke=10;function fe(e){if(!e.searchText)return null;const t=e.searchText.trim();if(!t)return null;const s=t.match(/#+ (.+?)(?:\s#|$)/);return s?s[1].trim().slice(0,120):(t.startsWith("---")?t.replace(/^---.*?---\s*/s,""):t).slice(0,120)||null}function he(e,t=ke){return[...e].sort((s,n)=>n.modified.getTime()-s.modified.getTime()).slice(0,t)}function we(e,t,s){if(e.type==="file"){const r=s.pinnedPaths.has(e.path);return a`
      <div class="ws-folder-file-row" role="listitem" style="padding-left: ${12+t*16}px">
        <button
          class="ws-folder-file"
          aria-label="Open file: ${e.name}"
          @click=${()=>s.onItemClick?.({path:e.path,name:e.name,type:e.fileType??"text",size:e.size??0,modified:e.modified??new Date})}
        >
          <span class="ws-list-icon" aria-hidden="true">${G(e.fileType??"text")}</span>
          <span class="ws-list-title">${e.name}</span>
          ${e.size!=null?a`<span class="ws-list-meta">${le(e.size)}</span>`:c}
          ${e.modified?a`<span class="ws-list-meta">${P(e.modified.getTime())}</span>`:c}
        </button>
        <button
          class="ws-pin-btn ${r?"active":""}"
          @click=${()=>s.onPinToggle?.(s.workspaceId,e.path,r)}
          title=${r?"Unpin":"Pin"}
          aria-label="${r?"Unpin":"Pin"} file: ${e.name}"
        >
          ${r?"Unpin":"Pin"}
        </button>
      </div>
    `}const n=s.expandedFolders.has(e.path),i=e.children??[],l=ue(i);return a`
    <div class="ws-folder-node" role="listitem">
      <button
        class="ws-folder-header"
        style="padding-left: ${12+t*16}px"
        @click=${()=>s.onToggleFolder?.(e.path)}
        aria-expanded=${n}
        aria-label="${n?"Collapse":"Expand"} folder: ${e.name}, ${l} files"
      >
        <span class="ws-folder-chevron ${n?"expanded":""}" aria-hidden="true">&#9654;</span>
        <span class="ws-list-icon" aria-hidden="true">&#128193;</span>
        <span class="ws-folder-name">${e.name}</span>
        <span class="ws-folder-count">${l} ${l===1?"file":"files"}</span>
      </button>
      ${n?a`
            <div class="ws-folder-children">
              ${i.map(r=>we(r,t+1,s))}
            </div>
          `:c}
    </div>
  `}function ve(e,t,s){return a`
    <div class="workspace-card-wrapper" role="listitem">
      <button
        class="workspace-card"
        @click=${()=>{console.log("[workspace-card] click:",e.name,"onSelect:",typeof t),t?.(e)}}
        title="Open workspace"
        aria-label="Open workspace: ${e.name}"
      >
        <div class="workspace-card-emoji" aria-hidden="true">${e.emoji}</div>
        <div class="workspace-card-content">
          <div class="workspace-card-name">${e.name}</div>
          <div class="workspace-card-meta">
            ${e.connectionCount>0?a`<span>${e.connectionCount} connections</span><span class="workspace-card-separator">•</span>`:c}
            <span>${e.artifactCount} artifacts</span>
            <span class="workspace-card-separator">•</span>
            <span>${e.sessionCount} sessions</span>
            ${e.feedCount>0?a`<span class="workspace-card-separator">•</span><span>${e.feedCount} feed</span>`:c}
            <span class="workspace-card-separator">•</span>
            <span>${P(e.lastUpdated.getTime())}</span>
          </div>
        </div>
      </button>
      ${s?a`<button
            class="workspace-card-delete"
            title="Delete workspace"
            aria-label="Delete workspace: ${e.name}"
            @click=${n=>{n.stopPropagation(),confirm(`Delete workspace "${e.name}"? This removes it from your list but does not delete any files.`)&&s(e)}}
          >&times;</button>`:c}
    </div>
  `}function V(e){const{workspaceId:t,entry:s,pinned:n,onOpen:i,onPinToggle:l}=e;return a`
    <div class="ws-list-row" role="listitem">
      <button class="ws-list-main" @click=${()=>i?.(s)} aria-label="Open file: ${s.name}">
        <span class="ws-list-icon" aria-hidden="true">${G(s.type)}</span>
        <span class="ws-list-title">${s.name}</span>
        <span class="ws-list-meta">${le(s.size)}</span>
        <span class="ws-list-meta">${P(s.modified.getTime())}</span>
      </button>
      <button
        class="ws-pin-btn ${n?"active":""}"
        @click=${()=>l?.(t,s.path,n)}
        title=${n?"Unpin":"Pin"}
        aria-label="${n?"Unpin":"Pin"} file: ${s.name}"
      >
        ${n?"Unpin":"Pin"}
      </button>
    </div>
  `}function ge(e){const{workspaceId:t,entry:s,pinned:n,onOpen:i,onPinToggle:l}=e,r=fe(s);return a`
    <div class="ws-list-row" role="listitem">
      <button class="ws-list-main" @click=${()=>i?.(s)} aria-label="Open file: ${s.name}">
        <span class="ws-list-icon" aria-hidden="true">${G(s.type)}</span>
        <span class="ws-list-title">${s.name}</span>
        <span class="ws-list-meta">${P(s.modified.getTime())}</span>
        ${r?a`<span class="ws-list-desc">${r}</span>`:c}
      </button>
      <button
        class="ws-pin-btn ${n?"active":""}"
        @click=${()=>l?.(t,s.path,n)}
        title=${n?"Unpin":"Pin"}
        aria-label="${n?"Unpin":"Pin"} file: ${s.name}"
      >
        ${n?"Unpin":"Pin"}
      </button>
    </div>
  `}function ye(e,t){return a`
    <nav class="workspace-breadcrumbs" aria-label="File browser breadcrumb">
      ${e.map((s,n)=>a`
          ${n>0?a`<span class="breadcrumb-sep" aria-hidden="true">/</span>`:c}
          <button
            class="breadcrumb-item ${n===e.length-1?"breadcrumb-current":""}"
            @click=${()=>t(s.path)}
            aria-current=${n===e.length-1?"location":c}
          >${s.name}</button>
        `)}
    </nav>
  `}function Te(e){const{browseEntries:t,breadcrumbs:s,browseSearchQuery:n,browseSearchResults:i,onBrowseFolder:l,onBrowseSearch:r,onBrowseBack:p,onCreateFolder:$,onItemClick:d}=e,m=i??t??[];return a`
    <div class="workspace-browser" role="region" aria-label="File browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${()=>p?.()} aria-label="Go back to workspace">
          &larr; Back
        </button>
        ${s?ye(s,u=>l?.(u)):c}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          aria-label="Search files in workspace"
          .value=${n??""}
          @input=${u=>{const k=u.target;r?.(k.value)}}
        />
        <button
          class="workspace-browse-new-folder"
          aria-label="Create new folder"
          @click=${()=>{const u=prompt("New folder name:");if(u?.trim()){const k=s?.[s.length-1]?.path??".";$?.(`${k}/${u.trim()}`)}}}
        >+ Folder</button>
      </div>

      <div class="workspace-browse-list" role="list" aria-label="File listing">
        ${m.length===0?a`<div class="workspace-browse-empty">No files found</div>`:m.map(u=>a`
              <button
                class="workspace-browse-entry"
                @click=${()=>{u.type==="folder"?l?.(u.path):d&&d({path:u.path,name:u.name,type:u.fileType??"text",size:u.size??0,modified:new Date})}}
              >
                <span class="browse-entry-icon">${u.type==="folder"?"📁":"📄"}</span>
                <span class="browse-entry-name">${u.name}</span>
                ${u.excerpt?a`<span class="browse-entry-excerpt">${u.excerpt}</span>`:c}
              </button>
            `)}
      </div>
    </div>
  `}function Se(e){const{workspace:t,itemSearchQuery:s,expandedFolders:n=new Set,showCompletedTasks:i=!1,onItemSearch:l,onBack:r,onItemClick:p,onSessionClick:$,onPinToggle:d,onPinSessionToggle:m,onToggleFolder:u,onToggleTaskComplete:k,onCreateTask:b,onToggleCompletedTasks:f,onStartTask:D,onViewTaskOutput:h,editingTaskId:y,onEditTask:w,onUpdateTask:v,onBatchPushToDrive:F}=e,x=ne(s,t.pinned).toSorted((o,C)=>C.modified.getTime()-o.modified.getTime()),S=ie(s,t.pinnedSessions),T=ne(s,t.outputs).filter(o=>!t.pinned.some(C=>C.path===o.path)),A=(t.folderTree?.length??0)>0,L=A?de(s,t.folderTree):[],O=ie(s,t.sessions),B=new Set(t.pinnedSessions.map(o=>o.key)),R=new Set(t.pinned.map(o=>o.path)),I=s.trim().length>0,N=x.length>0||S.length>0,M=O.length>0||t.sessions.length===0||I,_=he(t.outputs),U=_.length>0&&!I,q={expandedFolders:n,pinnedPaths:R,workspaceId:t.id,onToggleFolder:u,onItemClick:p,onPinToggle:d};return a`
    <div class="workspaces-container" role="region" aria-label="Workspace: ${t.name}">
      <div class="workspaces-header">
        <div class="workspaces-title">
          <button class="workspace-back-btn" @click=${r} aria-label="Back to workspace list">&#8592;</button>
          <span class="workspaces-icon" aria-hidden="true">${t.emoji}</span>
          <div class="workspace-header-text">
            <span class="workspace-header-name">${t.name}</span>
            <span class="workspace-header-desc">${t.path}</span>
          </div>
        </div>
        <div class="workspace-detail-search">
          <input
            type="text"
            class="workspaces-search-input"
            placeholder="Search workspace..."
            aria-label="Search within ${t.name}"
            .value=${s}
            @input=${o=>l?.(o.target.value)}
          />
          <button
            class="workspace-browse-btn"
            aria-label="Browse files in ${t.name}"
            @click=${()=>e.onBrowseFolder?.(".")}
          >Browse Files</button>
        </div>
      </div>

      <div class="workspace-content">
        ${e.browsePath!=null?Te(e):c}

        ${N?a`
                <section class="ws-section" aria-label="Pinned items">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${x.length+S.length}</span>
                  </div>
                  <div class="ws-list" role="list" aria-label="Pinned items list">
                    ${S.map(o=>a`
                        <div class="ws-list-row" role="listitem">
                          <button class="ws-list-main" @click=${()=>$?.(o)} aria-label="Open session: ${o.title}">
                            <span class=${se(o.status)} aria-label="Status: ${o.status}"></span>
                            <span class="ws-list-title">${o.title}</span>
                            <span class="ws-list-meta">${P(o.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>m?.(t.id,o.key,!0)}
                            title="Unpin"
                            aria-label="Unpin session: ${o.title}"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${x.map(o=>V({workspaceId:t.id,entry:o,pinned:!0,onOpen:p,onPinToggle:d}))}
                  </div>
                </section>
              `:c}

        ${Fe({tasks:t.tasks??[],workspaceName:t.name,showCompleted:i,onToggleTaskComplete:k,onCreateTask:b,onToggleCompletedTasks:f,onStartTask:D,onViewTaskOutput:h,editingTaskId:y,onEditTask:w,onUpdateTask:v})}

        ${U?a`
              <section class="ws-section" aria-label="Recent files">
                <div class="ws-section__header">
                  <h3>Recent</h3>
                  <span>${_.length}</span>
                </div>
                <div class="ws-list" role="list" aria-label="Recent files list">
                  ${_.map(o=>ge({workspaceId:t.id,entry:o,pinned:R.has(o.path),onOpen:p,onPinToggle:d}))}
                </div>
              </section>
            `:c}

        <section class="ws-section" aria-label="Artifacts">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${A?L.length:T.length}</span>
            ${F&&T.length>0?a`<button class="ws-export-drive-btn" aria-label="Export all artifacts to Google Drive" @click=${()=>{const o=T.map(C=>C.path);F(o)}}>Export to Drive</button>`:c}
          </div>
          <div class="ws-list ws-list--scroll" role="list" aria-label="Artifacts list">
            ${A?L.length===0?a`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:L.map(o=>we(o,0,q)):T.length===0?a`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:T.map(o=>V({workspaceId:t.id,entry:o,pinned:!1,onOpen:p,onPinToggle:d}))}
          </div>
        </section>

        ${M?a`
                <section class="ws-section" aria-label="Sessions">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${O.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll" role="list" aria-label="Sessions list">
                    ${O.length===0?a`
                            <div class="ws-empty">
                              <span class="ws-empty-hint">No sessions yet. Sessions are saved conversations with your ally — start a chat to create one.</span>
                            </div>
                          `:O.map(o=>a`
                              <div class="ws-list-row" role="listitem">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>$?.(o)} aria-label="Open session: ${o.title}">
                                  <span class=${se(o.status)} aria-label="Status: ${o.status}"></span>
                                  <span class="ws-list-title">${o.title}</span>
                                  <span class="ws-list-meta">${P(o.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${B.has(o.key)?"active":""}"
                                  @click=${()=>m?.(t.id,o.key,B.has(o.key))}
                                  title=${B.has(o.key)?"Unpin":"Pin"}
                                  aria-label="${B.has(o.key)?"Unpin":"Pin"} session: ${o.title}"
                                >
                                  ${B.has(o.key)?"Unpin":"Pin"}
                                </button>
                              </div>
                            `)}
                  </div>
                </section>
              `:c}

        ${(t.memory?.length??0)>0?a`
              <section class="ws-section" aria-label="Workspace memory">
                <div class="ws-section__header">
                  <h3>Memory</h3>
                  <span>${t.memory.length}</span>
                </div>
                <div class="ws-list ws-list--scroll" role="list" aria-label="Memory files list">
                  ${t.memory.map(o=>V({workspaceId:t.id,entry:o,pinned:R.has(o.path),onOpen:p,onPinToggle:d}))}
                </div>
              </section>
            `:c}

        ${Ce({entries:t.feedEntries??[],onPost:e.onPostToFeed,onLoadMore:e.onLoadMoreFeed})}

        ${Pe({connections:t.connections??[],onTest:e.onTestConnection,onRemove:e.onRemoveConnection})}

        ${De(t.members??[])}
      </div>
    </div>
  `}function Ce(e){const{entries:t,onPost:s,onLoadMore:n}=e;function i(r){switch(r){case"decision":return"📝";case"request":return"❓";case"artifact":return"📦";case"sop":return"📋";case"alert":return"🚨";default:return"💬"}}function l(r){return r.includes("agent")||r.includes(":agent")?"🤖":r==="system"?"⚙️":"👤"}return a`
    <section class="ws-section" aria-label="Activity feed">
      <div class="ws-section__header">
        <h3>Activity Feed</h3>
        <span>${t.length}</span>
      </div>
      <div class="ws-list ws-list--scroll" role="list" aria-live="polite" aria-label="Feed entries" style="max-height: 400px;">
        ${t.length===0?a`<div class="ws-empty">
              <span class="ws-empty-hint">No activity yet. Post updates, decisions, or requests to the feed.</span>
            </div>`:t.map(r=>a`
              <div class="ws-list-row ws-feed-entry">
                <div class="ws-list-main" style="flex-direction: column; align-items: flex-start; gap: 4px; padding: 8px 12px;">
                  <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                    <span>${l(r.author)}</span>
                    <span class="ws-list-title" style="font-weight: 500;">${r.author}</span>
                    <span style="margin-left: auto;">${i(r.type)}</span>
                    <span class="ws-list-meta">${P(new Date(r.ts).getTime())}</span>
                  </div>
                  <div style="padding-left: 28px; opacity: 0.9; font-size: 0.9em;">${r.text}</div>
                </div>
              </div>
            `)}
      </div>
      ${t.length>=50&&n?a`<button class="ws-task-completed-toggle" aria-label="Load more feed entries" @click=${()=>n()}>Load more...</button>`:c}
      ${s?a`
            <form
              class="ws-task-create-form"
              aria-label="Post to activity feed"
              @submit=${r=>{r.preventDefault();const p=r.currentTarget,$=p.querySelector(".ws-feed-input"),d=p.querySelector(".ws-feed-type"),m=$.value.trim();m&&(s(m,d.value),$.value="")}}
            >
              <input
                type="text"
                class="ws-task-create-input ws-feed-input"
                placeholder="Post to feed..."
                aria-label="Feed post content"
              />
              <select class="ws-task-create-project ws-feed-type" aria-label="Post type">
                <option value="update">Update</option>
                <option value="decision">Decision</option>
                <option value="request">Request</option>
                <option value="sop">SOP</option>
                <option value="artifact">Artifact</option>
              </select>
              <button type="submit" class="ws-task-create-btn" aria-label="Submit post">Post</button>
            </form>
          `:c}
    </section>
  `}function Pe(e){const{connections:t,onTest:s,onRemove:n}=e;function i(l){return l==="connected"?a`<span class="ws-conn-status ws-conn-status--ok">Connected</span>`:l==="error"?a`<span class="ws-conn-status ws-conn-status--error">Error</span>`:a`<span class="ws-conn-status ws-conn-status--unconfigured">Not configured</span>`}return t.length===0?a`
      <section class="ws-section" aria-label="Connections">
        <div class="ws-section__header">
          <h3>Connections</h3>
          <span>0</span>
        </div>
        <div class="ws-empty">
          <span class="ws-empty-hint">No tools connected. Connect Google Drive, ClickUp, HubSpot, or other shared tools via Settings.</span>
        </div>
      </section>
    `:a`
    <section class="ws-section" aria-label="Connections">
      <div class="ws-section__header">
        <h3>Connections</h3>
        <span>${t.length}</span>
      </div>
      <div class="ws-list" role="list" aria-label="Connection list">
        ${t.map(l=>a`
          <div class="ws-list-row" role="listitem">
            <div class="ws-list-main" style="gap: 8px;">
              <span class="ws-list-title">${l.name}</span>
              ${i(l.status)}
              ${l.lastSync?a`<span class="ws-list-meta">Synced ${P(new Date(l.lastSync).getTime())}</span>`:c}
              ${l.error?a`<span class="ws-list-meta" style="color: var(--danger-color, #e74c3c);">${l.error}</span>`:c}
            </div>
            <div style="display: flex; gap: 4px;">
              ${s?a`<button class="ws-pin-btn" @click=${()=>s(l.id)} title="Test connection" aria-label="Test connection: ${l.name}">Test</button>`:c}
              ${n?a`<button class="ws-pin-btn" @click=${()=>{confirm(`Remove connection "${l.name}"?`)&&n(l.id)}} title="Remove connection" aria-label="Remove connection: ${l.name}">Remove</button>`:c}
            </div>
          </div>
        `)}
      </div>
    </section>
  `}function De(e){return e.length===0?a``:a`
    <section class="ws-section" aria-label="Workspace members">
      <div class="ws-section__header">
        <h3>Members</h3>
        <span>${e.length}</span>
      </div>
      <div class="ws-list" role="list" aria-label="Members list">
        ${e.map(t=>a`
          <div class="ws-list-row" role="listitem">
            <div class="ws-list-main">
              <span aria-hidden="true">\u{1F464}</span>
              <span class="ws-list-title">${t.name}</span>
              <span class="ws-list-meta">${t.role}</span>
            </div>
          </div>
        `)}
      </div>
    </section>
  `}function Fe(e){const{tasks:t,workspaceName:s,showCompleted:n,onToggleTaskComplete:i,onCreateTask:l,onToggleCompletedTasks:r,onStartTask:p,onViewTaskOutput:$,editingTaskId:d,onEditTask:m,onUpdateTask:u}=e,k=Q(t.filter(f=>f.status==="pending")),b=Q(t.filter(f=>f.status==="complete"));return a`
    <section class="ws-section" aria-label="Workspace tasks">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${k.length} open${b.length>0?`, ${b.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll" role="list" aria-live="polite" aria-label="Task list">
        ${k.length===0&&b.length===0?a`<div class="ws-empty">No tasks</div>`:c}
        ${k.map(f=>ae(f,i,p,d,m,u,$))}
        ${b.length>0?a`
              <button class="ws-task-completed-toggle" aria-expanded=${n} @click=${()=>r?.()}>
                ${n?"Hide":"Show"} ${b.length} completed
              </button>
              ${n?b.map(f=>ae(f,i,p,d,m,u,$)):c}
            `:c}
      </div>
      ${l?a`
            <form
              class="ws-task-create-form"
              aria-label="Create new task"
              @submit=${f=>{f.preventDefault();const h=f.currentTarget.querySelector("input"),y=h.value.trim();y&&(l(y,s),h.value="")}}
            >
              <input
                type="text"
                class="ws-task-create-input"
                placeholder="Add a task..."
                aria-label="New task title"
              />
              <button type="submit" class="ws-task-create-btn" aria-label="Add task">Add</button>
            </form>
          `:c}
    </section>
  `}function Re(e){const{connected:t,workspaces:s,selectedWorkspace:n,searchQuery:i,itemSearchQuery:l,expandedFolders:r,loading:p,createLoading:$,error:d,allTasks:m=[],taskFilter:u="outstanding",taskSort:k="due",taskSearch:b="",showCompletedTasks:f=!1,editingTaskId:D,workspaceNames:h=[],onSearch:y,onItemSearch:w,onSelectWorkspace:v,onBack:F,onItemClick:x,onSessionClick:S,onPinToggle:T,onPinSessionToggle:A,onCreateWorkspace:L,onDeleteWorkspace:O,onToggleFolder:B,onTeamSetup:R,onToggleTaskComplete:I,onCreateTask:N,onSetTaskFilter:M,onSetTaskSort:_,onSetTaskSearch:U,onToggleCompletedTasks:q,onStartTask:o,onViewTaskOutput:C,onEditTask:H,onUpdateTask:K}=e,W=s.filter(g=>be(i,`${g.name} ${g.path} ${g.type}`));return n?Se({workspace:n,itemSearchQuery:l??"",expandedFolders:r,showCompletedTasks:f,onItemSearch:w,onBack:F,onItemClick:x,onSessionClick:S,onPinToggle:T,onPinSessionToggle:A,onToggleFolder:B,onToggleTaskComplete:I,onCreateTask:N,onToggleCompletedTasks:q,onStartTask:o,onViewTaskOutput:C,editingTaskId:D,onEditTask:H,onUpdateTask:K,browsePath:e.browsePath,browseEntries:e.browseEntries,breadcrumbs:e.breadcrumbs,browseSearchQuery:e.browseSearchQuery,browseSearchResults:e.browseSearchResults,onBrowseFolder:e.onBrowseFolder,onBrowseSearch:e.onBrowseSearch,onBrowseBack:e.onBrowseBack,onCreateFolder:e.onCreateFolder,onBatchPushToDrive:e.onBatchPushToDrive,onPostToFeed:e.onPostToFeed,onLoadMoreFeed:e.onLoadMoreFeed,onTestConnection:e.onTestConnection,onRemoveConnection:e.onRemoveConnection}):a`
    <div class="workspaces-container" role="region" aria-label="Workspaces">
      <div class="workspaces-toolbar" role="toolbar" aria-label="Workspace controls">
        <form
            class="workspaces-create-form"
            aria-label="Create new workspace"
            @submit=${async g=>{if(g.preventDefault(),$||!L)return;const X=g.currentTarget,E=new FormData(X),J=E.get("name"),Y=(typeof J=="string"?J:"").trim();if(!Y)return;const Z=E.get("type"),j=(typeof Z=="string"?Z:"project").trim().toLowerCase(),me=j==="team"||j==="personal"?j:"project",ee=E.get("path"),te=(typeof ee=="string"?ee:"").trim();await L({name:Y,type:me,...te?{path:te}:{}})!==!1&&X.reset()}}
          >
            <input
              type="text"
              name="name"
              class="workspaces-create-input"
              placeholder="New workspace name (e.g. Acme Corp)"
              aria-label="Workspace name"
              required
            />
            <select name="type" class="workspaces-create-select" aria-label="Workspace type">
              <option value="project">Project</option>
              <option value="team">Team</option>
              <option value="personal">Personal</option>
            </select>
            <input
              type="text"
              name="path"
              class="workspaces-create-input workspaces-create-input--path"
              placeholder="Optional path (auto-created if blank)"
              aria-label="Workspace path (optional)"
            />
            <button
              type="submit"
              class="workspaces-add-btn"
              aria-label="Create workspace"
              ?disabled=${!!$}
            >
              ${$?"Adding...":"Add Workspace"}
            </button>
          </form>
          <input
            type="text"
            class="workspaces-search-input"
            placeholder="Search workspaces..."
            aria-label="Search workspaces"
            .value=${i}
            @input=${g=>y?.(g.target.value)}
          />
          <span class="workspaces-count" aria-live="polite">${W.length} workspaces</span>
          <span class="workspaces-status ${t?"online":"offline"}" role="status">
            ${t?"Online":"Offline"}
          </span>
          ${R?a`<button class="ws-team-setup-btn" aria-label="Start team workspace setup" @click=${()=>R()}>Team Setup</button>`:c}
      </div>

      ${d?a`<div class="callout danger" role="alert" style="margin: 16px;">${d}</div>`:c}

      ${p&&W.length===0?a`
              <div class="workspaces-loading" role="status" aria-label="Loading workspaces">
                <div class="spinner" aria-hidden="true"></div>
                <span>Loading workspaces...</span>
              </div>
            `:a`
              <div class="workspaces-body">
                <div class="workspace-grid" role="list" aria-label="Workspace list">
                  ${W.length===0?a`
                          <div class="workspaces-empty">
                            <span class="workspaces-empty-icon" aria-hidden="true">${t?"📭":"🔌"}</span>
                            <span>${t?"No workspaces yet":"Connect to gateway to see workspaces"}</span>
                            ${t?a`<span class="workspaces-empty-hint">Workspaces organize your projects. Ask your ally to create one, or start a focused session in chat.</span>`:c}
                          </div>
                        `:W.map(g=>ve(g,v,O))}
                </div>

                ${xe({tasks:m,taskFilter:u,taskSort:k,taskSearch:b,onToggleTaskComplete:I,onSetTaskFilter:M,onSetTaskSort:_,onSetTaskSearch:U,onCreateTask:N,workspaceNames:h,onStartTask:o,editingTaskId:D,onEditTask:H,onUpdateTask:K,onViewTaskOutput:C})}
              </div>
            `}
    </div>
  `}function xe(e){const{tasks:t,taskFilter:s,taskSort:n="due",taskSearch:i="",onToggleTaskComplete:l,onSetTaskFilter:r,onSetTaskSort:p,onSetTaskSearch:$,onCreateTask:d,workspaceNames:m=[],onStartTask:u,editingTaskId:k,onEditTask:b,onUpdateTask:f,onViewTaskOutput:D}=e;if(t.length===0&&!d)return a``;let h;if(s==="outstanding")h=t.filter(w=>w.status==="pending");else if(s==="today"){const w=z();h=t.filter(v=>v.status==="pending"&&v.dueDate!=null&&v.dueDate<=w)}else s==="complete"?h=t.filter(w=>w.status==="complete"):h=t;if(i){const w=i.toLowerCase();h=h.filter(v=>v.title.toLowerCase().includes(w)||v.project?.toLowerCase().includes(w))}const y=Q(h,n);return a`
    <div class="ws-all-tasks-section">
      <section class="ws-section" aria-label="All tasks">
        <div class="ws-section__header">
          <div class="ws-section__header-left">
            <h3>All Tasks</h3>
            ${$?a`<input
                  type="text"
                  class="ws-task-search"
                  placeholder="Search tasks..."
                  aria-label="Search tasks"
                  .value=${i}
                  @input=${w=>$(w.target.value)}
                />`:c}
          </div>
          <div class="ws-task-controls">
            <div class="ws-task-filters" role="group" aria-label="Task filters">
              <button
                class="ws-task-filter-btn ${s==="all"?"active":""}"
                @click=${()=>r?.("all")}
                aria-pressed=${s==="all"}
              >All</button>
              <button
                class="ws-task-filter-btn ${s==="outstanding"?"active":""}"
                @click=${()=>r?.("outstanding")}
                aria-pressed=${s==="outstanding"}
              >To Do</button>
              <button
                class="ws-task-filter-btn ${s==="today"?"active":""}"
                @click=${()=>r?.("today")}
                aria-pressed=${s==="today"}
              >Today</button>
              <button
                class="ws-task-filter-btn ${s==="complete"?"active":""}"
                @click=${()=>r?.("complete")}
                aria-pressed=${s==="complete"}
              >Done</button>
            </div>
            <select
              class="ws-task-sort"
              aria-label="Sort tasks by"
              .value=${n}
              @change=${w=>p?.(w.target.value)}
            >
              <option value="due">Due Date</option>
              <option value="priority">Priority</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        ${d?a`
              <form
                class="ws-task-create-form"
                aria-label="Create new task"
                @submit=${w=>{w.preventDefault();const v=w.currentTarget,F=v.querySelector(".ws-task-create-input"),x=v.querySelector(".ws-task-create-project"),S=F.value.trim();if(!S)return;const T=x?.value||m[0]||"";d(S,T),F.value=""}}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                  aria-label="New task title"
                />
                ${m.length>0?a`
                      <select class="ws-task-create-project" aria-label="Task workspace">
                        ${m.map(w=>a`<option value=${w}>${w}</option>`)}
                      </select>
                    `:c}
                <button type="submit" class="ws-task-create-btn" aria-label="Add task">Add</button>
              </form>
            `:c}
        <div class="ws-list ws-list--scroll" role="list" aria-live="polite" aria-label="Task list">
          ${y.length===0?a`<div class="ws-empty">No tasks</div>`:y.map(w=>$e(w,l,u,k,b,f,D))}
        </div>
      </section>
    </div>
  `}export{$e as a,Re as r,Q as s};
