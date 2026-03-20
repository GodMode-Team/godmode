import{A as r,b as a}from"./lit-core-CTInmNPB.js";import{f as I,aa as Q}from"./ctrl-settings-89Xgsc7j.js";function it(t){return!Number.isFinite(t)||t<=0?"0 B":t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/(1024*1024)).toFixed(1)} MB`}function z(t){switch(t){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function et(t){return t==="running"?"ws-session-dot ws-session-dot--running":t==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function ot(t){return`ws-task-priority ws-task-priority--${t}`}function rt(t){return t==="high"?"High":t==="low"?"Low":"Med"}function ct(t){if(!t)return"";const e=Q();return t===e?"Today":t<e?`Overdue (${t})`:t}function lt(t){if(!t)return"ws-task-due";const e=Q();return t<e?"ws-task-due ws-task-due--overdue":t===e?"ws-task-due ws-task-due--today":"ws-task-due"}function M(t,e="due"){const s={high:0,medium:1,low:2};return[...t].sort((n,i)=>{if(e==="priority"){const l=s[n.priority]-s[i.priority];return l!==0?l:n.dueDate&&i.dueDate?n.dueDate.localeCompare(i.dueDate):n.dueDate&&!i.dueDate?-1:!n.dueDate&&i.dueDate?1:0}if(e==="newest")return(i.createdAt||"").localeCompare(n.createdAt||"");if(n.dueDate&&i.dueDate){const l=n.dueDate.localeCompare(i.dueDate);if(l!==0)return l}else{if(n.dueDate&&!i.dueDate)return-1;if(!n.dueDate&&i.dueDate)return 1}return s[n.priority]-s[i.priority]})}function st(t,e,s,n,i,l,u){const c=t.status==="complete";return n===t.id?a`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${d=>{d.preventDefault();const k=d.currentTarget,p=k.querySelector(".ws-task-edit-input"),$=k.querySelector(".ws-task-date-input"),m=p.value.trim();m&&(l?.(t.id,{title:m,dueDate:$.value||null}),i?.(null))}}
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
          @click=${()=>i?.(null)}
        >Cancel</button>
      </form>
    `:a`
    <div class="ws-list-row ws-task-row ${c?"ws-task-row--complete":""}">
      <button
        class="ws-task-check ${c?"ws-task-check--done":""}"
        @click=${()=>e?.(t.id,t.status)}
        title=${c?"Mark incomplete":"Mark complete"}
      >
        ${c?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${c?"ws-task-title--done":""}"
        @click=${()=>i?.(t.id)}
        title="Click to edit"
      >${t.title}</span>
      ${t.briefSection?a`<span class="ws-task-section">${t.briefSection}</span>`:r}
      <span class=${ot(t.priority)}>${rt(t.priority)}</span>
      ${t.dueDate?a`<span class=${lt(t.dueDate)}>${ct(t.dueDate)}</span>`:r}
      ${!c&&t.queueStatus?.status==="processing"?a`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${t.queueStatus.roleName} working...
          </span>`:!c&&t.queueStatus?.status==="review"&&s?a`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>s(t.id)}
              title="Review agent output"
            >Review</button>`:t.queueStatus?.status==="done"?a`
                ${u?a`<button
                      class="ws-task-start-btn ws-task-start-btn--done"
                      @click=${()=>u(t.id)}
                      title="Preview agent output"
                    >View Output</button>`:r}
                ${s?a`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>s(t.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:r}
              `:!c&&s?a`<button
                  class="ws-task-start-btn"
                  @click=${()=>s(t.id)}
                  title="Start working on this task"
                >Start</button>`:r}
    </div>
  `}function mt(t,e,s,n,i,l,u){const c=t.status==="complete";return n===t.id?a`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${d=>{d.preventDefault();const k=d.currentTarget,p=k.querySelector(".ws-task-edit-input"),$=k.querySelector(".ws-task-date-input"),m=p.value.trim();m&&(l?.(t.id,{title:m,dueDate:$.value||null}),i?.(null))}}
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
          @click=${()=>i?.(null)}
        >Cancel</button>
      </form>
    `:a`
    <div class="ws-list-row ws-task-row ${c?"ws-task-row--complete":""}">
      <button
        class="ws-task-check ${c?"ws-task-check--done":""}"
        @click=${()=>e?.(t.id,t.status)}
        title=${c?"Mark incomplete":"Mark complete"}
      >
        ${c?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${c?"ws-task-title--done":""}"
        @click=${()=>i?.(t.id)}
        title="Click to edit"
      >${t.title}</span>
      ${t.project?a`<span class="ws-task-project">${t.project}</span>`:r}
      ${t.briefSection?a`<span class="ws-task-section">${t.briefSection}</span>`:r}
      <span class=${ot(t.priority)}>${rt(t.priority)}</span>
      ${t.dueDate?a`<span class=${lt(t.dueDate)}>${ct(t.dueDate)}</span>`:r}
      ${!c&&t.queueStatus?.status==="processing"?a`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${t.queueStatus.roleName} working...
          </span>`:!c&&t.queueStatus?.status==="review"&&s?a`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>s(t.id)}
              title="Review agent output"
            >Review</button>`:t.queueStatus?.status==="done"?a`
                ${u?a`<button
                      class="ws-task-start-btn ws-task-start-btn--done"
                      @click=${()=>u(t.id)}
                      title="Preview agent output"
                    >View Output</button>`:r}
                ${s?a`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>s(t.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:r}
              `:!c&&s?a`<button
                  class="ws-task-start-btn"
                  @click=${()=>s(t.id)}
                  title="Start working on this task"
                >Start</button>`:r}
    </div>
  `}function $t(t,e){return t.trim()?e.toLowerCase().includes(t.trim().toLowerCase()):!0}function at(t,e){if(!t.trim())return e;const s=t.trim().toLowerCase();return e.filter(n=>n.name.toLowerCase().includes(s)||n.path.toLowerCase().includes(s)||n.type.toLowerCase().includes(s)||(n.searchText??"").toLowerCase().includes(s))}function nt(t,e){if(!t.trim())return e;const s=t.trim().toLowerCase();return e.filter(n=>n.title.toLowerCase().includes(s)||n.key.toLowerCase().includes(s))}function pt(t,e){if(!t.trim())return e;const s=t.trim().toLowerCase();return e.reduce((n,i)=>{if(i.type==="file")(i.name.toLowerCase().includes(s)||i.path.toLowerCase().includes(s))&&n.push(i);else{const l=pt(t,i.children??[]);l.length>0&&n.push({...i,children:l})}return n},[])}function ut(t){let e=0;for(const s of t)s.type==="file"?e++:s.children&&(e+=ut(s.children));return e}const ft=10;function ht(t){if(!t.searchText)return null;const e=t.searchText.trim();if(!e)return null;const s=e.match(/#+ (.+?)(?:\s#|$)/);return s?s[1].trim().slice(0,120):(e.startsWith("---")?e.replace(/^---.*?---\s*/s,""):e).slice(0,120)||null}function bt(t,e=ft){return[...t].sort((s,n)=>n.modified.getTime()-s.modified.getTime()).slice(0,e)}function dt(t,e,s){if(t.type==="file"){const u=s.pinnedPaths.has(t.path);return a`
      <div class="ws-folder-file-row" style="padding-left: ${12+e*16}px">
        <button
          class="ws-folder-file"
          @click=${()=>s.onItemClick?.({path:t.path,name:t.name,type:t.fileType??"text",size:t.size??0,modified:t.modified??new Date})}
        >
          <span class="ws-list-icon">${z(t.fileType??"text")}</span>
          <span class="ws-list-title">${t.name}</span>
          ${t.size!=null?a`<span class="ws-list-meta">${it(t.size)}</span>`:r}
          ${t.modified?a`<span class="ws-list-meta">${I(t.modified.getTime())}</span>`:r}
        </button>
        <button
          class="ws-pin-btn ${u?"active":""}"
          @click=${()=>s.onPinToggle?.(s.workspaceId,t.path,u)}
          title=${u?"Unpin":"Pin"}
        >
          ${u?"Unpin":"Pin"}
        </button>
      </div>
    `}const n=s.expandedFolders.has(t.path),i=t.children??[],l=ut(i);return a`
    <div class="ws-folder-node">
      <button
        class="ws-folder-header"
        style="padding-left: ${12+e*16}px"
        @click=${()=>s.onToggleFolder?.(t.path)}
      >
        <span class="ws-folder-chevron ${n?"expanded":""}">&#9654;</span>
        <span class="ws-list-icon">&#128193;</span>
        <span class="ws-folder-name">${t.name}</span>
        <span class="ws-folder-count">${l} ${l===1?"file":"files"}</span>
      </button>
      ${n?a`
            <div class="ws-folder-children">
              ${i.map(u=>dt(u,e+1,s))}
            </div>
          `:r}
    </div>
  `}function vt(t,e,s){return a`
    <div class="workspace-card-wrapper">
      <button
        class="workspace-card"
        @click=${()=>e?.(t)}
        title="Open workspace"
      >
        <div class="workspace-card-emoji">${t.emoji}</div>
        <div class="workspace-card-content">
          <div class="workspace-card-name">${t.name}</div>
          <div class="workspace-card-meta">
            <span>${t.artifactCount} artifacts</span>
            <span class="workspace-card-separator">•</span>
            <span>${t.sessionCount} sessions</span>
            <span class="workspace-card-separator">•</span>
            <span>${I(t.lastUpdated.getTime())}</span>
          </div>
        </div>
      </button>
      ${s?a`<button
            class="workspace-card-delete"
            title="Delete workspace"
            @click=${n=>{n.stopPropagation(),confirm(`Delete workspace "${t.name}"? This removes it from your list but does not delete any files.`)&&s(t)}}
          >&times;</button>`:r}
    </div>
  `}function V(t){const{workspaceId:e,entry:s,pinned:n,onOpen:i,onPinToggle:l}=t;return a`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(s)}>
        <span class="ws-list-icon">${z(s.type)}</span>
        <span class="ws-list-title">${s.name}</span>
        <span class="ws-list-meta">${it(s.size)}</span>
        <span class="ws-list-meta">${I(s.modified.getTime())}</span>
      </button>
      <button
        class="ws-pin-btn ${n?"active":""}"
        @click=${()=>l?.(e,s.path,n)}
        title=${n?"Unpin":"Pin"}
      >
        ${n?"Unpin":"Pin"}
      </button>
    </div>
  `}function gt(t){const{workspaceId:e,entry:s,pinned:n,onOpen:i,onPinToggle:l}=t,u=ht(s);return a`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(s)}>
        <span class="ws-list-icon">${z(s.type)}</span>
        <span class="ws-list-title">${s.name}</span>
        <span class="ws-list-meta">${I(s.modified.getTime())}</span>
        ${u?a`<span class="ws-list-desc">${u}</span>`:r}
      </button>
      <button
        class="ws-pin-btn ${n?"active":""}"
        @click=${()=>l?.(e,s.path,n)}
        title=${n?"Unpin":"Pin"}
      >
        ${n?"Unpin":"Pin"}
      </button>
    </div>
  `}function yt(t,e){return a`
    <div class="workspace-breadcrumbs">
      ${t.map((s,n)=>a`
          ${n>0?a`<span class="breadcrumb-sep">/</span>`:r}
          <button
            class="breadcrumb-item ${n===t.length-1?"breadcrumb-current":""}"
            @click=${()=>e(s.path)}
          >${s.name}</button>
        `)}
    </div>
  `}function Tt(t){const{browseEntries:e,breadcrumbs:s,browseSearchQuery:n,browseSearchResults:i,onBrowseFolder:l,onBrowseSearch:u,onBrowseBack:c,onCreateFolder:f,onItemClick:d}=t,k=i??e??[];return a`
    <div class="workspace-browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${()=>c?.()}>
          &larr; Back
        </button>
        ${s?yt(s,p=>l?.(p)):r}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          .value=${n??""}
          @input=${p=>{const $=p.target;u?.($.value)}}
        />
        <button
          class="workspace-browse-new-folder"
          @click=${()=>{const p=prompt("New folder name:");if(p?.trim()){const $=s?.[s.length-1]?.path??".";f?.(`${$}/${p.trim()}`)}}}
        >+ Folder</button>
      </div>

      <div class="workspace-browse-list">
        ${k.length===0?a`<div class="workspace-browse-empty">No files found</div>`:k.map(p=>a`
              <button
                class="workspace-browse-entry"
                @click=${()=>{p.type==="folder"?l?.(p.path):d&&d({path:p.path,name:p.name,type:p.fileType??"text",size:p.size??0,modified:new Date})}}
              >
                <span class="browse-entry-icon">${p.type==="folder"?"📁":"📄"}</span>
                <span class="browse-entry-name">${p.name}</span>
                ${p.excerpt?a`<span class="browse-entry-excerpt">${p.excerpt}</span>`:r}
              </button>
            `)}
      </div>
    </div>
  `}function St(t){const{workspace:e,itemSearchQuery:s,expandedFolders:n=new Set,showCompletedTasks:i=!1,onItemSearch:l,onBack:u,onItemClick:c,onSessionClick:f,onPinToggle:d,onPinSessionToggle:k,onToggleFolder:p,onToggleTaskComplete:$,onCreateTask:m,onToggleCompletedTasks:h,onStartTask:D,editingTaskId:b,onEditTask:T,onUpdateTask:w,onBatchPushToDrive:v}=t,S=at(s,e.pinned).toSorted((o,C)=>C.modified.getTime()-o.modified.getTime()),P=nt(s,e.pinnedSessions),g=at(s,e.outputs).filter(o=>!e.pinned.some(C=>C.path===o.path)),F=(e.folderTree?.length??0)>0,O=F?pt(s,e.folderTree):[],x=nt(s,e.sessions),B=new Set(e.pinnedSessions.map(o=>o.key)),L=new Set(e.pinned.map(o=>o.path)),A=s.trim().length>0,_=S.length>0||P.length>0,j=x.length>0||e.sessions.length===0||A,N=bt(e.outputs),R=N.length>0&&!A,U={expandedFolders:n,pinnedPaths:L,workspaceId:e.id,onToggleFolder:p,onItemClick:c,onPinToggle:d};return a`
    <div class="workspaces-container">
      <div class="workspaces-header">
        <div class="workspaces-title">
          <button class="workspace-back-btn" @click=${u}>←</button>
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
            @input=${o=>l?.(o.target.value)}
          />
          <button
            class="workspace-browse-btn"
            @click=${()=>t.onBrowseFolder?.(".")}
          >Browse Files</button>
        </div>
      </div>

      <div class="workspace-content">
        ${t.browsePath!=null?Tt(t):r}

        ${_?a`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${S.length+P.length}</span>
                  </div>
                  <div class="ws-list">
                    ${P.map(o=>a`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>f?.(o)}>
                            <span class=${et(o.status)}></span>
                            <span class="ws-list-title">${o.title}</span>
                            <span class="ws-list-meta">${I(o.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>k?.(e.id,o.key,!0)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${S.map(o=>V({workspaceId:e.id,entry:o,pinned:!0,onOpen:c,onPinToggle:d}))}
                  </div>
                </section>
              `:r}

        ${Ct({tasks:e.tasks??[],workspaceName:e.name,showCompleted:i,onToggleTaskComplete:$,onCreateTask:m,onToggleCompletedTasks:h,onStartTask:D,onViewTaskOutput,editingTaskId:b,onEditTask:T,onUpdateTask:w})}

        ${R?a`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Recent</h3>
                  <span>${N.length}</span>
                </div>
                <div class="ws-list">
                  ${N.map(o=>gt({workspaceId:e.id,entry:o,pinned:L.has(o.path),onOpen:c,onPinToggle:d}))}
                </div>
              </section>
            `:r}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${F?O.length:g.length}</span>
            ${v&&g.length>0?a`<button class="ws-export-drive-btn" @click=${()=>{const o=g.map(C=>C.path);v(o)}}>Export to Drive</button>`:r}
          </div>
          <div class="ws-list ws-list--scroll">
            ${F?O.length===0?a`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:O.map(o=>dt(o,0,U)):g.length===0?a`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:g.map(o=>V({workspaceId:e.id,entry:o,pinned:!1,onOpen:c,onPinToggle:d}))}
          </div>
        </section>

        ${j?a`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${x.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${x.length===0?a`
                            <div class="ws-empty">
                              <span class="ws-empty-hint">No sessions yet. Sessions are saved conversations with your ally — start a chat to create one.</span>
                            </div>
                          `:x.map(o=>a`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>f?.(o)}>
                                  <span class=${et(o.status)}></span>
                                  <span class="ws-list-title">${o.title}</span>
                                  <span class="ws-list-meta">${I(o.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${B.has(o.key)?"active":""}"
                                  @click=${()=>k?.(e.id,o.key,B.has(o.key))}
                                  title=${B.has(o.key)?"Unpin":"Pin"}
                                >
                                  ${B.has(o.key)?"Unpin":"Pin"}
                                </button>
                              </div>
                            `)}
                  </div>
                </section>
              `:r}

        ${(e.memory?.length??0)>0?a`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Memory</h3>
                  <span>${e.memory.length}</span>
                </div>
                <div class="ws-list ws-list--scroll">
                  ${e.memory.map(o=>V({workspaceId:e.id,entry:o,pinned:L.has(o.path),onOpen:c,onPinToggle:d}))}
                </div>
              </section>
            `:r}
      </div>
    </div>
  `}function Ct(t){const{tasks:e,workspaceName:s,showCompleted:n,onToggleTaskComplete:i,onCreateTask:l,onToggleCompletedTasks:u,onStartTask:c,onViewTaskOutput:f,editingTaskId:d,onEditTask:k,onUpdateTask:p}=t,$=M(e.filter(h=>h.status==="pending")),m=M(e.filter(h=>h.status==="complete"));return a`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${$.length} open${m.length>0?`, ${m.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${$.length===0&&m.length===0?a`<div class="ws-empty">No tasks</div>`:r}
        ${$.map(h=>st(h,i,c,d,k,p,f))}
        ${m.length>0?a`
              <button class="ws-task-completed-toggle" @click=${()=>u?.()}>
                ${n?"Hide":"Show"} ${m.length} completed
              </button>
              ${n?m.map(h=>st(h,i,c,d,k,p,f)):r}
            `:r}
      </div>
      ${l?a`
            <form
              class="ws-task-create-form"
              @submit=${h=>{h.preventDefault();const b=h.currentTarget.querySelector("input"),T=b.value.trim();T&&(l(T,s),b.value="")}}
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
  `}function Bt(t){const{connected:e,workspaces:s,selectedWorkspace:n,searchQuery:i,itemSearchQuery:l,expandedFolders:u,loading:c,createLoading:f,error:d,allTasks:k=[],taskFilter:p="outstanding",taskSort:$="due",taskSearch:m="",showCompletedTasks:h=!1,editingTaskId:D,workspaceNames:b=[],onSearch:T,onItemSearch:w,onSelectWorkspace:v,onBack:S,onItemClick:P,onSessionClick:g,onPinToggle:F,onPinSessionToggle:O,onCreateWorkspace:x,onDeleteWorkspace:B,onToggleFolder:L,onTeamSetup:A,onToggleTaskComplete:_,onCreateTask:j,onSetTaskFilter:N,onSetTaskSort:R,onSetTaskSearch:U,onToggleCompletedTasks:o,onStartTask:C,onViewTaskOutput:wt,onEditTask:H,onUpdateTask:K}=t,q=s.filter(y=>$t(i,`${y.name} ${y.path} ${y.type}`));return n?St({workspace:n,itemSearchQuery:l??"",expandedFolders:u,showCompletedTasks:h,onItemSearch:w,onBack:S,onItemClick:P,onSessionClick:g,onPinToggle:F,onPinSessionToggle:O,onToggleFolder:L,onToggleTaskComplete:_,onCreateTask:j,onToggleCompletedTasks:o,onStartTask:C,editingTaskId:D,onEditTask:H,onUpdateTask:K,browsePath:t.browsePath,browseEntries:t.browseEntries,breadcrumbs:t.breadcrumbs,browseSearchQuery:t.browseSearchQuery,browseSearchResults:t.browseSearchResults,onBrowseFolder:t.onBrowseFolder,onBrowseSearch:t.onBrowseSearch,onBrowseBack:t.onBrowseBack,onCreateFolder:t.onCreateFolder,onBatchPushToDrive:t.onBatchPushToDrive}):a`
    <div class="workspaces-container">
      <div class="workspaces-toolbar">
        <form
            class="workspaces-create-form"
            @submit=${async y=>{if(y.preventDefault(),f||!x)return;const X=y.currentTarget,W=new FormData(X),G=W.get("name"),J=(typeof G=="string"?G:"").trim();if(!J)return;const Y=W.get("type"),E=(typeof Y=="string"?Y:"project").trim().toLowerCase(),kt=E==="team"||E==="personal"?E:"project",Z=W.get("path"),tt=(typeof Z=="string"?Z:"").trim();await x({name:J,type:kt,...tt?{path:tt}:{}})!==!1&&X.reset()}}
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
            .value=${i}
            @input=${y=>T?.(y.target.value)}
          />
          <span class="workspaces-count">${q.length} workspaces</span>
          <span class="workspaces-status ${e?"online":"offline"}">
            ${e?"Online":"Offline"}
          </span>
          ${A?a`<button class="ws-team-setup-btn" @click=${()=>A()}>Team Setup</button>`:r}
      </div>

      ${d?a`<div class="callout danger" style="margin: 16px;">${d}</div>`:r}

      ${c?a`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `:a`
              <div class="workspaces-body">
                <div class="workspace-grid">
                  ${q.length===0?a`
                          <div class="workspaces-empty">
                            <span class="workspaces-empty-icon">${e?"📭":"🔌"}</span>
                            <span>${e?"No workspaces yet":"Connect to gateway to see workspaces"}</span>
                            ${e?a`<span class="workspaces-empty-hint">Workspaces organize your projects. Ask your ally to create one, or start a focused session in chat.</span>`:r}
                          </div>
                        `:q.map(y=>vt(y,v,B))}
                </div>

                ${Dt({tasks:k,taskFilter:p,taskSort:$,taskSearch:m,onToggleTaskComplete:_,onSetTaskFilter:N,onSetTaskSort:R,onSetTaskSearch:U,onCreateTask:j,workspaceNames:b,onStartTask:C,editingTaskId:D,onEditTask:H,onUpdateTask:K,onViewTaskOutput:wt})}
              </div>
            `}
    </div>
  `}function Dt(t){const{tasks:e,taskFilter:s,taskSort:n="due",taskSearch:i="",onToggleTaskComplete:l,onSetTaskFilter:u,onSetTaskSort:c,onSetTaskSearch:f,onCreateTask:d,workspaceNames:k=[],onStartTask:p,editingTaskId:$,onEditTask:m,onUpdateTask:h,onViewTaskOutput:D}=t;if(e.length===0&&!d)return a``;let b;if(s==="outstanding")b=e.filter(w=>w.status==="pending");else if(s==="today"){const w=Q();b=e.filter(v=>v.status==="pending"&&v.dueDate!=null&&v.dueDate<=w)}else s==="complete"?b=e.filter(w=>w.status==="complete"):b=e;if(i){const w=i.toLowerCase();b=b.filter(v=>v.title.toLowerCase().includes(w)||v.project?.toLowerCase().includes(w))}const T=M(b,n);return a`
    <div class="ws-all-tasks-section">
      <section class="ws-section">
        <div class="ws-section__header">
          <div class="ws-section__header-left">
            <h3>All Tasks</h3>
            ${f?a`<input
                  type="text"
                  class="ws-task-search"
                  placeholder="Search tasks..."
                  .value=${i}
                  @input=${w=>f(w.target.value)}
                />`:r}
          </div>
          <div class="ws-task-controls">
            <div class="ws-task-filters">
              <button
                class="ws-task-filter-btn ${s==="all"?"active":""}"
                @click=${()=>u?.("all")}
              >All</button>
              <button
                class="ws-task-filter-btn ${s==="outstanding"?"active":""}"
                @click=${()=>u?.("outstanding")}
              >To Do</button>
              <button
                class="ws-task-filter-btn ${s==="today"?"active":""}"
                @click=${()=>u?.("today")}
              >Today</button>
              <button
                class="ws-task-filter-btn ${s==="complete"?"active":""}"
                @click=${()=>u?.("complete")}
              >Done</button>
            </div>
            <select
              class="ws-task-sort"
              .value=${n}
              @change=${w=>c?.(w.target.value)}
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
                @submit=${w=>{w.preventDefault();const v=w.currentTarget,S=v.querySelector(".ws-task-create-input"),P=v.querySelector(".ws-task-create-project"),g=S.value.trim();if(!g)return;const F=P?.value||k[0]||"";d(g,F),S.value=""}}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                />
                ${k.length>0?a`
                      <select class="ws-task-create-project">
                        ${k.map(w=>a`<option value=${w}>${w}</option>`)}
                      </select>
                    `:r}
                <button type="submit" class="ws-task-create-btn">Add</button>
              </form>
            `:r}
        <div class="ws-list ws-list--scroll">
          ${T.length===0?a`<div class="ws-empty">No tasks</div>`:T.map(w=>mt(w,l,p,$,m,h,D))}
        </div>
      </section>
    </div>
  `}export{mt as a,Bt as r,M as s};
