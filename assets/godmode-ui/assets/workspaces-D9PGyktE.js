import{A as r,b as a}from"./lit-core-CTInmNPB.js";import{f as B,A as z}from"./ctrl-settings-C2Q1A5fK.js";function ie(e){return!Number.isFinite(e)||e<=0?"0 B":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function V(e){switch(e){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function te(e){return e==="running"?"ws-session-dot ws-session-dot--running":e==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function oe(e){return`ws-task-priority ws-task-priority--${e}`}function re(e){return e==="high"?"High":e==="low"?"Low":"Med"}function ce(e){if(!e)return"";const t=z();return e===t?"Today":e<t?`Overdue (${e})`:e}function le(e){if(!e)return"ws-task-due";const t=z();return e<t?"ws-task-due ws-task-due--overdue":e===t?"ws-task-due ws-task-due--today":"ws-task-due"}function Q(e,t="due"){const s={high:0,medium:1,low:2};return[...e].sort((n,i)=>{if(t==="priority"){const l=s[n.priority]-s[i.priority];return l!==0?l:n.dueDate&&i.dueDate?n.dueDate.localeCompare(i.dueDate):n.dueDate&&!i.dueDate?-1:!n.dueDate&&i.dueDate?1:0}if(t==="newest")return(i.createdAt||"").localeCompare(n.createdAt||"");if(n.dueDate&&i.dueDate){const l=n.dueDate.localeCompare(i.dueDate);if(l!==0)return l}else{if(n.dueDate&&!i.dueDate)return-1;if(!n.dueDate&&i.dueDate)return 1}return s[n.priority]-s[i.priority]})}function se(e,t,s,n,i,l,d){const c=e.status==="complete";return n===e.id?a`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${u=>{u.preventDefault();const k=u.currentTarget,p=k.querySelector(".ws-task-edit-input"),$=k.querySelector(".ws-task-date-input"),m=p.value.trim();m&&(l?.(e.id,{title:m,dueDate:$.value||null}),i?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${e.title}
          @click=${u=>u.stopPropagation()}
        />
        <input
          type="date"
          class="ws-task-date-input"
          .value=${e.dueDate??""}
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
        @click=${()=>t?.(e.id,e.status)}
        title=${c?"Mark incomplete":"Mark complete"}
      >
        ${c?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${c?"ws-task-title--done":""}"
        @click=${()=>i?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.briefSection?a`<span class="ws-task-section">${e.briefSection}</span>`:r}
      <span class=${oe(e.priority)}>${re(e.priority)}</span>
      ${e.dueDate?a`<span class=${le(e.dueDate)}>${ce(e.dueDate)}</span>`:r}
      ${!c&&e.queueStatus?.status==="processing"?a`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!c&&e.queueStatus?.status==="review"&&s?a`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>s(e.id)}
              title="Review agent output"
            >Review</button>`:e.queueStatus?.status==="done"?a`
                ${r}
                ${s?a`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>s(e.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:r}
              `:!c&&s?a`<button
                  class="ws-task-start-btn"
                  @click=${()=>s(e.id)}
                  title="Start working on this task"
                >Start</button>`:r}
    </div>
  `}function me(e,t,s,n,i,l,d){const c=e.status==="complete";return n===e.id?a`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${u=>{u.preventDefault();const k=u.currentTarget,p=k.querySelector(".ws-task-edit-input"),$=k.querySelector(".ws-task-date-input"),m=p.value.trim();m&&(l?.(e.id,{title:m,dueDate:$.value||null}),i?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${e.title}
          @click=${u=>u.stopPropagation()}
        />
        <input
          type="date"
          class="ws-task-date-input"
          .value=${e.dueDate??""}
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
        @click=${()=>t?.(e.id,e.status)}
        title=${c?"Mark incomplete":"Mark complete"}
      >
        ${c?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${c?"ws-task-title--done":""}"
        @click=${()=>i?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.project?a`<span class="ws-task-project">${e.project}</span>`:r}
      ${e.briefSection?a`<span class="ws-task-section">${e.briefSection}</span>`:r}
      <span class=${oe(e.priority)}>${re(e.priority)}</span>
      ${e.dueDate?a`<span class=${le(e.dueDate)}>${ce(e.dueDate)}</span>`:r}
      ${!c&&e.queueStatus?.status==="processing"?a`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!c&&e.queueStatus?.status==="review"&&s?a`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>s(e.id)}
              title="Review agent output"
            >Review</button>`:e.queueStatus?.status==="done"?a`
                ${d?a`<button
                      class="ws-task-start-btn ws-task-start-btn--done"
                      @click=${()=>d(e.id)}
                      title="Preview agent output"
                    >View Output</button>`:r}
                ${s?a`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>s(e.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:r}
              `:!c&&s?a`<button
                  class="ws-task-start-btn"
                  @click=${()=>s(e.id)}
                  title="Start working on this task"
                >Start</button>`:r}
    </div>
  `}function ke(e,t){return e.trim()?t.toLowerCase().includes(e.trim().toLowerCase()):!0}function ae(e,t){if(!e.trim())return t;const s=e.trim().toLowerCase();return t.filter(n=>n.name.toLowerCase().includes(s)||n.path.toLowerCase().includes(s)||n.type.toLowerCase().includes(s)||(n.searchText??"").toLowerCase().includes(s))}function ne(e,t){if(!e.trim())return t;const s=e.trim().toLowerCase();return t.filter(n=>n.title.toLowerCase().includes(s)||n.key.toLowerCase().includes(s))}function pe(e,t){if(!e.trim())return t;const s=e.trim().toLowerCase();return t.reduce((n,i)=>{if(i.type==="file")(i.name.toLowerCase().includes(s)||i.path.toLowerCase().includes(s))&&n.push(i);else{const l=pe(e,i.children??[]);l.length>0&&n.push({...i,children:l})}return n},[])}function ue(e){let t=0;for(const s of e)s.type==="file"?t++:s.children&&(t+=ue(s.children));return t}const $e=10;function fe(e){if(!e.searchText)return null;const t=e.searchText.trim();if(!t)return null;const s=t.match(/#+ (.+?)(?:\s#|$)/);return s?s[1].trim().slice(0,120):(t.startsWith("---")?t.replace(/^---.*?---\s*/s,""):t).slice(0,120)||null}function he(e,t=$e){return[...e].sort((s,n)=>n.modified.getTime()-s.modified.getTime()).slice(0,t)}function de(e,t,s){if(e.type==="file"){const d=s.pinnedPaths.has(e.path);return a`
      <div class="ws-folder-file-row" style="padding-left: ${12+t*16}px">
        <button
          class="ws-folder-file"
          @click=${()=>s.onItemClick?.({path:e.path,name:e.name,type:e.fileType??"text",size:e.size??0,modified:e.modified??new Date})}
        >
          <span class="ws-list-icon">${V(e.fileType??"text")}</span>
          <span class="ws-list-title">${e.name}</span>
          ${e.size!=null?a`<span class="ws-list-meta">${ie(e.size)}</span>`:r}
          ${e.modified?a`<span class="ws-list-meta">${B(e.modified.getTime())}</span>`:r}
        </button>
        <button
          class="ws-pin-btn ${d?"active":""}"
          @click=${()=>s.onPinToggle?.(s.workspaceId,e.path,d)}
          title=${d?"Unpin":"Pin"}
        >
          ${d?"Unpin":"Pin"}
        </button>
      </div>
    `}const n=s.expandedFolders.has(e.path),i=e.children??[],l=ue(i);return a`
    <div class="ws-folder-node">
      <button
        class="ws-folder-header"
        style="padding-left: ${12+t*16}px"
        @click=${()=>s.onToggleFolder?.(e.path)}
      >
        <span class="ws-folder-chevron ${n?"expanded":""}">&#9654;</span>
        <span class="ws-list-icon">&#128193;</span>
        <span class="ws-folder-name">${e.name}</span>
        <span class="ws-folder-count">${l} ${l===1?"file":"files"}</span>
      </button>
      ${n?a`
            <div class="ws-folder-children">
              ${i.map(d=>de(d,t+1,s))}
            </div>
          `:r}
    </div>
  `}function ve(e,t,s){return a`
    <div class="workspace-card-wrapper">
      <button
        class="workspace-card"
        @click=${()=>t?.(e)}
        title="Open workspace"
      >
        <div class="workspace-card-emoji">${e.emoji}</div>
        <div class="workspace-card-content">
          <div class="workspace-card-name">${e.name}</div>
          <div class="workspace-card-meta">
            <span>${e.artifactCount} artifacts</span>
            <span class="workspace-card-separator">•</span>
            <span>${e.sessionCount} sessions</span>
            <span class="workspace-card-separator">•</span>
            <span>${B(e.lastUpdated.getTime())}</span>
          </div>
        </div>
      </button>
      ${s?a`<button
            class="workspace-card-delete"
            title="Delete workspace"
            @click=${n=>{n.stopPropagation(),confirm(`Delete workspace "${e.name}"? This removes it from your list but does not delete any files.`)&&s(e)}}
          >&times;</button>`:r}
    </div>
  `}function M(e){const{workspaceId:t,entry:s,pinned:n,onOpen:i,onPinToggle:l}=e;return a`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(s)}>
        <span class="ws-list-icon">${V(s.type)}</span>
        <span class="ws-list-title">${s.name}</span>
        <span class="ws-list-meta">${ie(s.size)}</span>
        <span class="ws-list-meta">${B(s.modified.getTime())}</span>
      </button>
      <button
        class="ws-pin-btn ${n?"active":""}"
        @click=${()=>l?.(t,s.path,n)}
        title=${n?"Unpin":"Pin"}
      >
        ${n?"Unpin":"Pin"}
      </button>
    </div>
  `}function be(e){const{workspaceId:t,entry:s,pinned:n,onOpen:i,onPinToggle:l}=e,d=fe(s);return a`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(s)}>
        <span class="ws-list-icon">${V(s.type)}</span>
        <span class="ws-list-title">${s.name}</span>
        <span class="ws-list-meta">${B(s.modified.getTime())}</span>
        ${d?a`<span class="ws-list-desc">${d}</span>`:r}
      </button>
      <button
        class="ws-pin-btn ${n?"active":""}"
        @click=${()=>l?.(t,s.path,n)}
        title=${n?"Unpin":"Pin"}
      >
        ${n?"Unpin":"Pin"}
      </button>
    </div>
  `}function ge(e,t){return a`
    <div class="workspace-breadcrumbs">
      ${e.map((s,n)=>a`
          ${n>0?a`<span class="breadcrumb-sep">/</span>`:r}
          <button
            class="breadcrumb-item ${n===e.length-1?"breadcrumb-current":""}"
            @click=${()=>t(s.path)}
          >${s.name}</button>
        `)}
    </div>
  `}function ye(e){const{browseEntries:t,breadcrumbs:s,browseSearchQuery:n,browseSearchResults:i,onBrowseFolder:l,onBrowseSearch:d,onBrowseBack:c,onCreateFolder:f,onItemClick:u}=e,k=i??t??[];return a`
    <div class="workspace-browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${()=>c?.()}>
          &larr; Back
        </button>
        ${s?ge(s,p=>l?.(p)):r}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          .value=${n??""}
          @input=${p=>{const $=p.target;d?.($.value)}}
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
                @click=${()=>{p.type==="folder"?l?.(p.path):u&&u({path:p.path,name:p.name,type:p.fileType??"text",size:p.size??0,modified:new Date})}}
              >
                <span class="browse-entry-icon">${p.type==="folder"?"📁":"📄"}</span>
                <span class="browse-entry-name">${p.name}</span>
                ${p.excerpt?a`<span class="browse-entry-excerpt">${p.excerpt}</span>`:r}
              </button>
            `)}
      </div>
    </div>
  `}function Te(e){const{workspace:t,itemSearchQuery:s,expandedFolders:n=new Set,showCompletedTasks:i=!1,onItemSearch:l,onBack:d,onItemClick:c,onSessionClick:f,onPinToggle:u,onPinSessionToggle:k,onToggleFolder:p,onToggleTaskComplete:$,onCreateTask:m,onToggleCompletedTasks:P,onStartTask:h,editingTaskId:g,onEditTask:w,onUpdateTask:v,onBatchPushToDrive:C}=e,D=ae(s,t.pinned).toSorted((o,S)=>S.modified.getTime()-o.modified.getTime()),T=ne(s,t.pinnedSessions),y=ae(s,t.outputs).filter(o=>!t.pinned.some(S=>S.path===o.path)),I=(t.folderTree?.length??0)>0,A=I?pe(s,t.folderTree):[],F=ne(s,t.sessions),x=new Set(t.pinnedSessions.map(o=>o.key)),L=new Set(t.pinned.map(o=>o.path)),N=s.trim().length>0,_=D.length>0||T.length>0,j=F.length>0||t.sessions.length===0||N,O=he(t.outputs),R=O.length>0&&!N,U={expandedFolders:n,pinnedPaths:L,workspaceId:t.id,onToggleFolder:p,onItemClick:c,onPinToggle:u};return a`
    <div class="workspaces-container">
      <div class="workspaces-header">
        <div class="workspaces-title">
          <button class="workspace-back-btn" @click=${d}>←</button>
          <span class="workspaces-icon">${t.emoji}</span>
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
            .value=${s}
            @input=${o=>l?.(o.target.value)}
          />
          <button
            class="workspace-browse-btn"
            @click=${()=>e.onBrowseFolder?.(".")}
          >Browse Files</button>
        </div>
      </div>

      <div class="workspace-content">
        ${e.browsePath!=null?ye(e):r}

        ${_?a`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${D.length+T.length}</span>
                  </div>
                  <div class="ws-list">
                    ${T.map(o=>a`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>f?.(o)}>
                            <span class=${te(o.status)}></span>
                            <span class="ws-list-title">${o.title}</span>
                            <span class="ws-list-meta">${B(o.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>k?.(t.id,o.key,!0)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${D.map(o=>M({workspaceId:t.id,entry:o,pinned:!0,onOpen:c,onPinToggle:u}))}
                  </div>
                </section>
              `:r}

        ${Se({tasks:t.tasks??[],workspaceName:t.name,showCompleted:i,onToggleTaskComplete:$,onCreateTask:m,onToggleCompletedTasks:P,onStartTask:h,editingTaskId:g,onEditTask:w,onUpdateTask:v})}

        ${R?a`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Recent</h3>
                  <span>${O.length}</span>
                </div>
                <div class="ws-list">
                  ${O.map(o=>be({workspaceId:t.id,entry:o,pinned:L.has(o.path),onOpen:c,onPinToggle:u}))}
                </div>
              </section>
            `:r}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${I?A.length:y.length}</span>
            ${C&&y.length>0?a`<button class="ws-export-drive-btn" @click=${()=>{const o=y.map(S=>S.path);C(o)}}>Export to Drive</button>`:r}
          </div>
          <div class="ws-list ws-list--scroll">
            ${I?A.length===0?a`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:A.map(o=>de(o,0,U)):y.length===0?a`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:y.map(o=>M({workspaceId:t.id,entry:o,pinned:!1,onOpen:c,onPinToggle:u}))}
          </div>
        </section>

        ${j?a`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${F.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${F.length===0?a`
                            <div class="ws-empty">
                              <span class="ws-empty-hint">No sessions yet. Sessions are saved conversations with your ally — start a chat to create one.</span>
                            </div>
                          `:F.map(o=>a`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>f?.(o)}>
                                  <span class=${te(o.status)}></span>
                                  <span class="ws-list-title">${o.title}</span>
                                  <span class="ws-list-meta">${B(o.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${x.has(o.key)?"active":""}"
                                  @click=${()=>k?.(t.id,o.key,x.has(o.key))}
                                  title=${x.has(o.key)?"Unpin":"Pin"}
                                >
                                  ${x.has(o.key)?"Unpin":"Pin"}
                                </button>
                              </div>
                            `)}
                  </div>
                </section>
              `:r}

        ${(t.memory?.length??0)>0?a`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Memory</h3>
                  <span>${t.memory.length}</span>
                </div>
                <div class="ws-list ws-list--scroll">
                  ${t.memory.map(o=>M({workspaceId:t.id,entry:o,pinned:L.has(o.path),onOpen:c,onPinToggle:u}))}
                </div>
              </section>
            `:r}
      </div>
    </div>
  `}function Se(e){const{tasks:t,workspaceName:s,showCompleted:n,onToggleTaskComplete:i,onCreateTask:l,onToggleCompletedTasks:d,onStartTask:c,editingTaskId:f,onEditTask:u,onUpdateTask:k}=e,p=Q(t.filter(m=>m.status==="pending")),$=Q(t.filter(m=>m.status==="complete"));return a`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${p.length} open${$.length>0?`, ${$.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${p.length===0&&$.length===0?a`<div class="ws-empty">No tasks</div>`:r}
        ${p.map(m=>se(m,i,c,f,u,k))}
        ${$.length>0?a`
              <button class="ws-task-completed-toggle" @click=${()=>d?.()}>
                ${n?"Hide":"Show"} ${$.length} completed
              </button>
              ${n?$.map(m=>se(m,i,c,f,u,k)):r}
            `:r}
      </div>
      ${l?a`
            <form
              class="ws-task-create-form"
              @submit=${m=>{m.preventDefault();const h=m.currentTarget.querySelector("input"),g=h.value.trim();g&&(l(g,s),h.value="")}}
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
  `}function xe(e){const{connected:t,workspaces:s,selectedWorkspace:n,searchQuery:i,itemSearchQuery:l,expandedFolders:d,loading:c,createLoading:f,error:u,allTasks:k=[],taskFilter:p="outstanding",taskSort:$="due",taskSearch:m="",showCompletedTasks:P=!1,editingTaskId:h,workspaceNames:g=[],onSearch:w,onItemSearch:v,onSelectWorkspace:C,onBack:D,onItemClick:T,onSessionClick:y,onPinToggle:I,onPinSessionToggle:A,onCreateWorkspace:F,onDeleteWorkspace:x,onToggleFolder:L,onTeamSetup:N,onToggleTaskComplete:_,onCreateTask:j,onSetTaskFilter:O,onSetTaskSort:R,onSetTaskSearch:U,onToggleCompletedTasks:o,onStartTask:S,onEditTask:H,onUpdateTask:K}=e,q=s.filter(b=>ke(i,`${b.name} ${b.path} ${b.type}`));return n?Te({workspace:n,itemSearchQuery:l??"",expandedFolders:d,showCompletedTasks:P,onItemSearch:v,onBack:D,onItemClick:T,onSessionClick:y,onPinToggle:I,onPinSessionToggle:A,onToggleFolder:L,onToggleTaskComplete:_,onCreateTask:j,onToggleCompletedTasks:o,onStartTask:S,editingTaskId:h,onEditTask:H,onUpdateTask:K,browsePath:e.browsePath,browseEntries:e.browseEntries,breadcrumbs:e.breadcrumbs,browseSearchQuery:e.browseSearchQuery,browseSearchResults:e.browseSearchResults,onBrowseFolder:e.onBrowseFolder,onBrowseSearch:e.onBrowseSearch,onBrowseBack:e.onBrowseBack,onCreateFolder:e.onCreateFolder,onBatchPushToDrive:e.onBatchPushToDrive}):a`
    <div class="workspaces-container">
      <div class="workspaces-toolbar">
        <form
            class="workspaces-create-form"
            @submit=${async b=>{if(b.preventDefault(),f||!F)return;const X=b.currentTarget,W=new FormData(X),G=W.get("name"),J=(typeof G=="string"?G:"").trim();if(!J)return;const Y=W.get("type"),E=(typeof Y=="string"?Y:"project").trim().toLowerCase(),we=E==="team"||E==="personal"?E:"project",Z=W.get("path"),ee=(typeof Z=="string"?Z:"").trim();await F({name:J,type:we,...ee?{path:ee}:{}})!==!1&&X.reset()}}
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
            @input=${b=>w?.(b.target.value)}
          />
          <span class="workspaces-count">${q.length} workspaces</span>
          <span class="workspaces-status ${t?"online":"offline"}">
            ${t?"Online":"Offline"}
          </span>
          ${N?a`<button class="ws-team-setup-btn" @click=${()=>N()}>Team Setup</button>`:r}
      </div>

      ${u?a`<div class="callout danger" style="margin: 16px;">${u}</div>`:r}

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
                            <span class="workspaces-empty-icon">${t?"📭":"🔌"}</span>
                            <span>${t?"No workspaces yet":"Connect to gateway to see workspaces"}</span>
                            ${t?a`<span class="workspaces-empty-hint">Workspaces organize your projects. Ask your ally to create one, or start a focused session in chat.</span>`:r}
                          </div>
                        `:q.map(b=>ve(b,C,x))}
                </div>

                ${Ce({tasks:k,taskFilter:p,taskSort:$,taskSearch:m,onToggleTaskComplete:_,onSetTaskFilter:O,onSetTaskSort:R,onSetTaskSearch:U,onCreateTask:j,workspaceNames:g,onStartTask:S,editingTaskId:h,onEditTask:H,onUpdateTask:K})}
              </div>
            `}
    </div>
  `}function Ce(e){const{tasks:t,taskFilter:s,taskSort:n="due",taskSearch:i="",onToggleTaskComplete:l,onSetTaskFilter:d,onSetTaskSort:c,onSetTaskSearch:f,onCreateTask:u,workspaceNames:k=[],onStartTask:p,editingTaskId:$,onEditTask:m,onUpdateTask:P}=e;if(t.length===0&&!u)return a``;let h;if(s==="outstanding")h=t.filter(w=>w.status==="pending");else if(s==="today"){const w=z();h=t.filter(v=>v.status==="pending"&&v.dueDate!=null&&v.dueDate<=w)}else s==="complete"?h=t.filter(w=>w.status==="complete"):h=t;if(i){const w=i.toLowerCase();h=h.filter(v=>v.title.toLowerCase().includes(w)||v.project?.toLowerCase().includes(w))}const g=Q(h,n);return a`
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
                @click=${()=>d?.("all")}
              >All</button>
              <button
                class="ws-task-filter-btn ${s==="outstanding"?"active":""}"
                @click=${()=>d?.("outstanding")}
              >To Do</button>
              <button
                class="ws-task-filter-btn ${s==="today"?"active":""}"
                @click=${()=>d?.("today")}
              >Today</button>
              <button
                class="ws-task-filter-btn ${s==="complete"?"active":""}"
                @click=${()=>d?.("complete")}
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
        ${u?a`
              <form
                class="ws-task-create-form"
                @submit=${w=>{w.preventDefault();const v=w.currentTarget,C=v.querySelector(".ws-task-create-input"),D=v.querySelector(".ws-task-create-project"),T=C.value.trim();if(!T)return;const y=D?.value||k[0]||"";u(T,y),C.value=""}}
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
          ${g.length===0?a`<div class="ws-empty">No tasks</div>`:g.map(w=>me(w,l,p,$,m,P))}
        </div>
      </section>
    </div>
  `}export{me as a,xe as r,Q as s};
