import{b as r,A as u,d as S,g as D,r as c,t as _}from"./lit-core-CTInmNPB.js";import{a as b,w as I}from"./index-Covj4w7X.js";import{ab as h}from"./ctrl-settings-niym-WgY.js";import{G as C}from"./views-settings-nvLQdpIB.js";import{s as L,a as m}from"./workspaces-C8dKMKC1.js";import"./markdown-i_gIkIP3.js";function x(t){const e=Date.now()-new Date(t).getTime(),a=Math.floor(e/6e4);if(a<1)return"just now";if(a<60)return`${a}m ago`;const o=Math.floor(a/60);return o<24?`${o}h ago`:`${Math.floor(o/24)}d ago`}function $(t){return t.source.persona?t.source.persona.replace(/-/g," ").replace(/\b\w/g,e=>e.toUpperCase()):t.source.skill?t.source.skill:t.type==="agent-execution"?"Agent":"Skill"}function B(t){return t<=2?"Poor":t<=4?"Below expectations":t<=6?"Okay":t<=8?"Good":"Excellent"}function v(t,e){if(t.scoringId!==e.id)return u;const a=t.scoringValue??7,o=t.feedbackText??"",i=a<=4,n=a<=4||a>=9;return r`
    <div class="inbox-scoring">
      <div class="inbox-score-label">
        Rate this output
        <span class="inbox-score-value ${a<=4?"low":a>=9?"high":""}">${a}/10 — ${B(a)}</span>
      </div>
      <div class="inbox-score-row">
        ${[1,2,3,4,5,6,7,8,9,10].map(s=>r`
            <button
              class="inbox-score-btn${s===a?" active":""}${s<=4?" low":s>=9?" high":""}"
              @click=${()=>t.onSetScoring(e.id,s)}
            >${s}</button>
          `)}
      </div>
      ${n?r`
            <div class="inbox-feedback">
              <textarea
                class="inbox-feedback-input"
                rows="3"
                placeholder=${i?"What went wrong? This feedback improves the agent. (required)":"What made this great? (optional)"}
                .value=${o}
                @input=${s=>t.onFeedbackChange(s.target.value)}
              ></textarea>
            </div>
          `:u}
      <div class="inbox-score-actions">
        <button
          class="btn btn--sm inbox-score-submit"
          ?disabled=${i&&!o.trim()}
          @click=${()=>t.onScore(e.id,a,o.trim()||void 0)}
        >Submit ${a}/10</button>
        <button
          class="btn btn--sm inbox-score-cancel"
          @click=${()=>t.onSetScoring(null)}
        >Cancel</button>
      </div>
    </div>
  `}function A(t,e){const a=e.deliverables??[];return r`
    <div class="inbox-card inbox-card--project">
      <div class="inbox-card-header">
        <span class="inbox-card-source">Project Complete</span>
        <span class="inbox-card-time">${x(e.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${e.title}</div>
        <div class="inbox-card-summary">${e.summary}</div>
        ${a.length>0?r`
              <div class="inbox-deliverables">
                ${a.map(o=>r`
                    <div class="inbox-deliverable-row">
                      <span class="inbox-deliverable-persona">${o.persona.replace(/-/g," ")}</span>
                      <span class="inbox-deliverable-title">${o.title}</span>
                      ${o.proofDocSlug?r`<button class="btn btn--sm" @click=${()=>t.onViewOutput(e.id)}>View</button>`:u}
                    </div>
                  `)}
              </div>
            `:u}
      </div>
      <div class="inbox-card-actions">
        <button class="btn btn--sm primary" @click=${()=>t.onOpenChat(e.id)}>Review in Chat</button>
        ${e.proofDocSlug?r`<button class="btn btn--sm" @click=${()=>t.onViewOutput(e.id)}>View Deliverables</button>`:u}
        <button class="btn btn--sm" @click=${()=>t.onSetScoring(e.id,7)}>Score</button>
        <button class="btn btn--sm" @click=${()=>t.onDismiss(e.id)}>Dismiss</button>
      </div>
      ${v(t,e)}
    </div>
  `}function O(t,e){if(e.type==="project-completion")return A(t,e);const a=!!(e.sessionId||e.source.taskId||e.source.queueItemId);return r`
    <div class="inbox-card">
      <div class="inbox-card-header">
        <span class="inbox-card-source">${$(e)}</span>
        <span class="inbox-card-time">${x(e.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${e.title}</div>
        <div class="inbox-card-summary">${e.summary.slice(0,220)}${e.summary.length>220?"…":""}</div>
      </div>
      <div class="inbox-card-actions">
        ${e.outputPath?r`<button class="btn btn--sm" @click=${()=>t.onViewOutput(e.id)}>View Output</button>`:u}
        ${e.proofDocSlug?r`<button class="btn btn--sm" @click=${()=>t.onViewProof(e.id)}>Proof</button>`:u}
        ${a?r`<button class="btn btn--sm" @click=${()=>t.onOpenChat(e.id)}>Open Chat</button>`:u}
        <button class="btn btn--sm primary" @click=${()=>t.onSetScoring(e.id,7)}>Complete</button>
        <button class="btn btn--sm" @click=${()=>t.onDismiss(e.id)}>Dismiss</button>
      </div>
      ${v(t,e)}
    </div>
  `}function R(t){const e=t.sortOrder??"newest",a=t.items.filter(i=>i.status==="pending").sort((i,n)=>{const s=new Date(n.createdAt).getTime()-new Date(i.createdAt).getTime();return e==="oldest"?-s:s}),o=t.count??a.length;return t.loading?r`<div class="inbox-loading">Loading inbox…</div>`:o===0?r`
      <div class="my-day-card">
        <div class="my-day-card-header">
          <div class="my-day-card-title">
            <span class="my-day-card-icon">&#x1F4E5;</span>
            <span>INBOX</span>
          </div>
        </div>
        <div class="my-day-card-content">
          <div class="my-day-empty">Nothing pending. Background agent work will appear here when it lands.</div>
        </div>
      </div>
    `:r`
    <div class="my-day-card">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x1F4E5;</span>
          <span>INBOX</span>
          <span class="tab-badge" style="margin-left: 8px;">${o}</span>
        </div>
        <div class="inbox-header-actions">
          <button class="btn btn--sm" @click=${()=>t.onSortToggle?.()}>${e==="newest"?"Newest first":"Oldest first"}</button>
          <button class="btn btn--sm" @click=${()=>t.onMarkAll()}>Mark All Complete</button>
        </div>
      </div>
      <div class="my-day-card-content">
        <div class="inbox-list">
          ${a.map(i=>O(t,i))}
        </div>
      </div>
    </div>
  `}const E=["~/godmode/memory/AGENT-DAY.md","~/godmode/AGENT-DAY.md"];function q(t){return[...[`~/godmode/memory/agent-day/${t}.md`,`~/godmode/memory/agent-log/${t}.md`,`~/godmode/memory/daily/${t}-agent-log.md`],...E]}function F(t){return["Needs Review","Active Sub-Agents","Completed Today","Queue","Feedback Log","AGENT-DAY"].filter(o=>t.includes(o)).length>=2}async function k(t,e){try{const a=e?{date:e}:{},o=await t.request("dailyBrief.get",a);return!o||!o.content||!o.date?null:o}catch(a){return console.error("[MyDay] Failed to load daily brief:",a),null}}async function M(t,e,a){const o=e||h(),i="agentLog.get";try{const n=await t.request(i,{date:o});if(n?.content?.trim()&&n?.sourcePath)return{date:n.date||o,content:n.content,updatedAt:n.updatedAt||new Date().toISOString(),sourcePath:n.sourcePath}}catch(n){console.warn(`[MyDay] ${i} unavailable, falling back to files.read:`,n)}return P(t,o)}async function P(t,e){const a=q(e),o=i=>i.includes("AGENT-DAY.md");for(const i of a)try{const n=await t.request("files.read",{path:i,maxSize:1e6});if(!n?.content?.trim()||!F(n.content)||o(i)&&typeof n.modifiedAt=="number"&&h(new Date(n.modifiedAt))!==e)continue;return{date:e,content:n.content,updatedAt:typeof n.modifiedAt=="number"?new Date(n.modifiedAt).toISOString():new Date().toISOString(),sourcePath:i}}catch{}return null}function y(t,e,a){return new Promise((o,i)=>{const n=setTimeout(()=>i(new Error(`${a} timed out after ${e}ms`)),e);t.then(s=>{clearTimeout(n),o(s)},s=>{clearTimeout(n),i(s)})})}const N={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function f(t){if(!t.client||!t.connected)return[];t.todayTasksLoading=!0;try{const e=t.todaySelectedDate??h(),[a,o]=await Promise.all([t.client.request("tasks.today",{date:e,includeCompleted:!0}),t.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),i=new Map;for(const s of o.items)s.sourceTaskId&&(s.status==="processing"||s.status==="review"||s.status==="needs-review"||s.status==="done"||s.status==="failed")&&i.set(s.sourceTaskId,{status:s.status,type:s.type,roleName:N[s.type]??s.type,queueItemId:s.id});const n=(a.tasks??[]).map(s=>({id:s.id,title:s.title,status:s.status,project:s.project,dueDate:s.dueDate,priority:s.priority,createdAt:s.createdAt,completedAt:s.completedAt,queueStatus:i.get(s.id)??null}));return t.todayTasks=n,n}catch(e){return console.error("[MyDay] Failed to load today tasks:",e),t.todayTasks??[]}finally{t.todayTasksLoading=!1}}async function V(t){if(!(!t.client||!t.connected)){t.inboxLoading=!0;try{const e=await t.client.request("inbox.list",{status:"pending",limit:50});t.inboxItems=e.items??[],t.inboxCount=e.pendingCount??0}catch(e){console.error("[MyDay] Failed to load inbox items:",e),t.inboxItems=[],t.inboxCount=0}finally{t.inboxLoading=!1}}}async function G(t){if(!(!t.client||!t.connected))try{const e=await t.client.request("trust.dashboard",{}),a=e.summaries.filter(o=>o.trustScore!==null);t.trustSummary={overallScore:e.overallScore,dailyStreak:e.dailyStreak,todayRated:e.todayRating!==null,workflowCount:e.workflows.length,highPerformers:a.filter(o=>(o.trustScore??0)>=8).length,needsAttention:a.filter(o=>(o.trustScore??10)<7).length}}catch{t.trustSummary=null}}async function Q(t){if(!t.client||!t.connected)return[];try{const a=(await t.client.request("queue.list",{limit:50}))?.items??[],o=Date.now()-1440*60*1e3;return a.filter(i=>!(i.status!=="review"&&i.status!=="needs-review"&&i.status!=="done"||i.status==="done"&&(i.completedAt??0)<o)).sort((i,n)=>(n.completedAt??0)-(i.completedAt??0)).map(i=>({id:i.id,title:i.title,summary:i.result?.summary??i.description??"",status:i.status==="needs-review"?"review":i.status,completedAt:i.completedAt,outputPath:i.result?.outputPath,prUrl:i.result?.prUrl,sourceTaskId:i.sourceTaskId,persona:i.personaHint??void 0,source:i.source}))}catch(e){return console.error("[MyDay] Failed to load queue results for decision cards:",e),[]}}async function j(t){if(!(!t.client||!t.connected)){t.dailyBriefLoading=!0,t.dailyBriefError=null;try{t.dailyBrief=await k(t.client,t.todaySelectedDate),t.loadBriefNotes&&await t.loadBriefNotes()}catch(e){t.dailyBriefError=e instanceof Error?e.message:"Failed to load daily brief",console.error("[MyDay] Brief load error:",e)}finally{t.dailyBriefLoading=!1}}}function U(t){const e=t||h(),a="VAULT",o=`01-Daily/${e}`,i=`obsidian://open?vault=${encodeURIComponent(a)}&file=${encodeURIComponent(o)}`;window.open(i,"_blank")}async function W(t){if(!t.client||!t.connected)return;t.myDayLoading=!0,t.myDayError=null,t.dailyBriefLoading=!0,t.agentLogLoading=!0,t.todayTasksLoading=!0;const e=t.todaySelectedDate,a=t.loadBriefNotes?y(t.loadBriefNotes(),5e3,"Brief Notes"):Promise.resolve(),o=await Promise.allSettled([y(k(t.client,e),1e4,"Daily Brief"),a,y(M(t.client,e),1e4,"Agent Log"),y(f(t),8e3,"Today Tasks"),y(V(t),5e3,"Inbox"),y(G(t),5e3,"Trust Summary")]);t.dailyBrief=o[0].status==="fulfilled"?o[0].value:null,t.agentLog=o[2].status==="fulfilled"?o[2].value:null;const i=["Brief","Brief Notes","Agent Log","Today Tasks","Inbox","Trust"],n=o.map((s,T)=>s.status==="rejected"?{section:i[T],reason:s.reason}:null).filter(Boolean);if(n.length>0){for(const s of n)console.warn(`[MyDay] ${s.section} failed:`,s.reason);n.length===o.length&&(t.myDayError="Failed to load daily brief")}t.myDayLoading=!1,t.dailyBriefLoading=!1,t.agentLogLoading=!1,t.todayTasksLoading=!1}var Y=Object.defineProperty,H=Object.getOwnPropertyDescriptor,w=t=>{throw TypeError(t)},l=(t,e,a,o)=>{for(var i=o>1?void 0:o?H(e,a):e,n=t.length-1,s;n>=0;n--)(s=t[n])&&(i=(o?s(e,a,i):s(i))||i);return o&&i&&Y(e,a,i),i},p=(t,e,a)=>e.has(t)||w("Cannot "+a),z=(t,e,a)=>(p(t,e,"read from private field"),a?a.call(t):e.get(t)),J=(t,e,a)=>e.has(t)?w("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,a),K=(t,e,a,o)=>(p(t,e,"write to private field"),e.set(t,a),a),g;function X(t){return t===h()}function Z(t){const e=new Date(t+"T12:00:00");return tt(e)}function tt(t){const e=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],a=["January","February","March","April","May","June","July","August","September","October","November","December"],o=e[t.getDay()],i=a[t.getMonth()],n=t.getDate();return`${o}, ${i} ${n}`}function et(t){return r`
    <form class="ws-task-create-form" @submit=${e=>{e.preventDefault();const o=e.currentTarget.querySelector("input"),i=o.value.trim();i&&(t(i),o.value="")}}>
      <input type="text" class="ws-task-create-input" placeholder="Add a task for today..." aria-label="New task title" />
      <button type="submit" class="ws-task-create-btn" aria-label="Add task">Add</button>
    </form>
  `}function at(t){const e=L(t.todayTasks??[],"due"),a=e.filter(i=>i.status==="pending"),o=e.filter(i=>i.status==="complete");return r`
    <div class="my-day-card today-tasks-panel">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x2705;</span>
          <span>TODAY'S TASKS</span>
        </div>
        <span class="today-tasks-count">
          ${a.length} open${o.length>0?r`, ${o.length} done`:u}
        </span>
      </div>
      <div class="my-day-card-content">
        ${t.todayTasksLoading?r`<div class="brief-loading"><div class="spinner"></div><span>Loading tasks...</span></div>`:r`
              ${t.onCreateTask?et(t.onCreateTask):u}
              <div class="today-tasks-list">
                ${a.length===0&&o.length===0?r`<div class="today-tasks-empty">No tasks for today. Type above to add one, or ask your ally to create tasks from your daily brief.</div>`:a.map(i=>m(i,t.onToggleTaskComplete,t.onStartTask,t.editingTaskId,t.onEditTask,t.onUpdateTask,t.onViewTaskOutput))}
              </div>
              ${o.length>0?r`
                    <button class="today-completed-toggle" @click=${()=>t.onToggleCompletedTasks?.()}>
                      ${t.showCompletedTasks?"Hide":"Show"} ${o.length} completed
                    </button>
                    ${t.showCompletedTasks?r`<div class="today-tasks-list today-tasks-list--completed">
                          ${o.map(i=>m(i,t.onToggleTaskComplete,t.onStartTask,t.editingTaskId,t.onEditTask,t.onUpdateTask))}
                        </div>`:u}
                  `:u}
            `}
      </div>
    </div>
  `}function ot(t){const e=h(),a=t.selectedDate??e,o=X(a),i=Z(a),n=t.viewMode??"brief";return r`
    <div class="my-day-toolbar">
      <div class="today-date-nav" role="navigation" aria-label="Date navigation">
        ${t.onDatePrev?r`<button class="today-date-btn" @click=${t.onDatePrev} title="Previous day" aria-label="Go to previous day">&#x2039;</button>`:u}
        <span class="today-date-label ${o?"":"past-date"}" aria-live="polite">${i}</span>
        ${t.onDateNext?r`<button class="today-date-btn" @click=${t.onDateNext} title="Next day" aria-label="Go to next day">&#x203A;</button>`:u}
        ${!o&&t.onDateToday?r`<button class="today-date-today-btn" @click=${t.onDateToday} aria-label="Return to today">Today</button>`:u}
      </div>
      <div class="today-view-tabs" role="tablist" aria-label="Today view">
        <button class="today-view-tab ${n==="brief"?"active":""}"
          role="tab" aria-selected=${n==="brief"?"true":"false"}
          @click=${()=>t.onViewModeChange?.("brief")}>Brief</button>
        <button class="today-view-tab ${n==="tasks"?"active":""}"
          role="tab" aria-selected=${n==="tasks"?"true":"false"}
          @click=${()=>t.onViewModeChange?.("tasks")}>Tasks</button>
        <button class="today-view-tab ${n==="inbox"?"active":""}"
          role="tab" aria-selected=${n==="inbox"?"true":"false"}
          @click=${()=>t.onViewModeChange?.("inbox")}>Inbox${(t.inboxCount??t.inboxItems?.filter(s=>s.status==="pending").length??t.decisionCards?.items.length??0)>0?r`<span class="tab-badge" aria-label="pending items">${t.inboxCount??t.inboxItems?.filter(s=>s.status==="pending").length??t.decisionCards?.items.length}</span>`:u}</button>
      </div>
      <div class="today-quick-actions">
        ${new Date().getHours()<15?!t.focusPulseActive&&t.onStartMorningSet?r`<button class="today-morning-set-btn" @click=${t.onStartMorningSet}
                  title="Start your morning focus ritual">\u2600\uFE0F Start my day</button>`:u:t.onEveningCapture?r`<button class="today-evening-btn" @click=${t.onEveningCapture}
                  title="Reflect on your day and set up tomorrow">\uD83C\uDF19 Evening Capture</button>`:u}
        ${t.onRefresh?r`<button class="my-day-refresh-btn" @click=${t.onRefresh} title="Refresh / Generate Brief" aria-label="Refresh or generate today's brief">&#x21BB;</button>`:null}
      </div>
    </div>
  `}function it(t){return r`
    <div class="my-day-brief-full">
      ${R({items:t.inboxItems??[],loading:t.inboxLoading,count:t.inboxCount,sortOrder:t.inboxSortOrder??"newest",scoringId:t.inboxScoringId,scoringValue:t.inboxScoringValue,feedbackText:t.inboxFeedbackText,onViewOutput:e=>t.onInboxViewOutput?.(e),onViewProof:e=>t.onInboxViewProof?.(e),onOpenChat:e=>t.onInboxOpenChat?.(e),onDismiss:e=>t.onInboxDismiss?.(e),onScore:(e,a,o)=>t.onInboxScore?.(e,a,o),onSetScoring:(e,a)=>t.onInboxSetScoring?.(e,a),onFeedbackChange:e=>t.onInboxFeedbackChange?.(e),onSortToggle:()=>t.onInboxSortToggle?.(),onMarkAll:()=>t.onInboxMarkAll?.()})}
    </div>
  `}function nt(t){const e=h();t.selectedDate;const a=t.viewMode??"brief";if(t.loading)return r`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading your day...</span>
        </div>
      </div>
    `;if(t.error)return r`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">&#x26A0;</span>
          <span>${t.error}</span>
          ${t.onRefresh?r`<button class="retry-button" @click=${t.onRefresh}>Retry</button>`:null}
        </div>
      </div>
    `;const o={connected:t.connected,data:t.dailyBrief??null,loading:t.dailyBriefLoading,error:t.dailyBriefError,onRefresh:t.onBriefRefresh,onGenerate:t.onBriefGenerate,onOpenInObsidian:t.onBriefOpenInObsidian,onSaveBrief:t.onBriefSave,onToggleCheckbox:t.onBriefToggleCheckbox,onOpenFile:t.onOpenFile};return r`
    <div class="my-day-container">
      ${a==="brief"?r`<div class="my-day-brief-full">
            ${C(o)}
          </div>`:a==="tasks"?r`<div class="my-day-brief-full">${at(t)}</div>`:it(t)}
    </div>
  `}let d=class extends S{constructor(){super(...arguments),J(this,g),this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=h(),this.todayViewMode="brief",this.dailyBrief=null,this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLog=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.todayEditingTaskId=null,this.todayShowCompleted=!1,this.todayQueueResults=[],this.inboxItems=[],this.inboxLoading=!1,this.inboxCount=0,this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,this.inboxSortOrder="newest",this.trustSummary=null,this._unsubs=[],this._dataLoaded=!1}get ctx(){return z(this,g)}set ctx(t){K(this,g,t)}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._unsubs.push(b.on("refresh-requested",t=>{(t.target==="today"||t.target==="my-day")&&this.refresh()}))}willUpdate(t){this.ctx?.connected&&!this._dataLoaded&&!this.myDayLoading&&(this._dataLoaded=!0,this._loadAll())}disconnectedCallback(){for(const t of this._unsubs)t();this._unsubs=[],super.disconnectedCallback()}get _state(){return{client:this.ctx?.gateway??null,connected:this.ctx?.connected??!1,myDayLoading:this.myDayLoading,myDayError:this.myDayError,dailyBrief:this.dailyBrief,dailyBriefLoading:this.dailyBriefLoading,dailyBriefError:this.dailyBriefError,agentLog:this.agentLog,agentLogLoading:this.agentLogLoading,agentLogError:this.agentLogError,briefNotes:this.briefNotes,todaySelectedDate:this.todaySelectedDate,todayViewMode:this.todayViewMode,todayTasks:this.todayTasks,todayTasksLoading:this.todayTasksLoading,trustSummary:this.trustSummary,inboxItems:this.inboxItems,inboxLoading:this.inboxLoading,inboxCount:this.inboxCount,loadBriefNotes:()=>this._loadBriefNotes()}}_syncFromState(t){this.myDayLoading=t.myDayLoading??!1,this.myDayError=t.myDayError??null,this.dailyBrief=t.dailyBrief??null,this.dailyBriefLoading=t.dailyBriefLoading??!1,this.dailyBriefError=t.dailyBriefError??null,this.agentLog=t.agentLog??null,this.agentLogLoading=t.agentLogLoading??!1,this.agentLogError=t.agentLogError??null,this.briefNotes=t.briefNotes??{},this.todayTasks=t.todayTasks??[],this.todayTasksLoading=t.todayTasksLoading??!1,this.trustSummary=t.trustSummary??null,this.inboxItems=t.inboxItems??[],this.inboxLoading=t.inboxLoading??!1,this.inboxCount=t.inboxCount??0}async _loadAll(){const t=this._state;await W(t),this._syncFromState(t),this._loadDecisionCards()}async _loadBriefOnly(){const t=this._state;await j(t),this._syncFromState(t)}async _loadBriefNotes(){const t=this.ctx?.gateway;if(!t||!this.ctx?.connected)return;const e=this.todaySelectedDate;try{const a=await t.request("briefNotes.get",{date:e});this.briefNotes=a.notes??{}}catch(a){console.error("[GmToday] Brief notes load error:",a),this.briefNotes={}}}async _loadDecisionCards(){if(!(!this.ctx?.gateway||!this.ctx?.connected))try{const e=this._state;this.todayQueueResults=await Q(e)}catch{}}async refresh(){await this._loadAll()}_handleDatePrev(){const t=new Date(this.todaySelectedDate+"T12:00:00");t.setDate(t.getDate()-1),this.todaySelectedDate=h(t),this._loadBriefOnly()}_handleDateNext(){const t=new Date(this.todaySelectedDate+"T12:00:00");t.setDate(t.getDate()+1);const e=h(),a=h(t);a>e||(this.todaySelectedDate=a,this._loadBriefOnly())}_handleDateToday(){this.todaySelectedDate=h(),this._loadAll()}async _handleDailyBriefRefresh(){await this._loadBriefOnly()}async _handleDailyBriefGenerate(){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected)){this.dailyBriefLoading=!0;try{await t.request("dailyBrief.generate",{}),await this._loadBriefOnly()}catch(e){this.dailyBriefError=e instanceof Error?e.message:"Failed to generate brief"}finally{this.dailyBriefLoading=!1}}}_handleDailyBriefOpenInObsidian(){const t=this.dailyBrief?.date;U(t)}async _handleBriefSave(t){const e=this.ctx?.gateway;if(!e||!this.ctx?.connected)return;const a=this.dailyBrief?.date||this.todaySelectedDate;try{await e.request("dailyBrief.update",{date:a,content:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(o){console.error("[GmToday] Brief save failed:",o),this.ctx?.addToast?.("Failed to save brief","error")}}async _handleBriefToggleCheckbox(t,e){const a=this.ctx?.gateway;if(!a||!this.ctx?.connected)return;const o=this.dailyBrief?.date||this.todaySelectedDate;try{await a.request("dailyBrief.toggleCheckbox",{date:o,index:t,checked:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(i){console.error("[GmToday] Checkbox toggle failed:",i)}}_handleViewModeChange(t){if(this.todayViewMode=t,t==="inbox"&&this.inboxItems.length===0&&!this.inboxLoading&&this._handleInboxRefresh(),t==="tasks"&&this.todayTasks.length===0&&!this.todayTasksLoading){const e=this._state;f(e).then(()=>{this.todayTasks=e.todayTasks??[],this.todayTasksLoading=e.todayTasksLoading??!1})}}_handleStartMorningSet(){this.ctx?.setTab?.("chat"),this.ctx?.send?.("chat.send",{message:"Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan."})}_handleEveningCapture(){this.ctx?.setTab?.("chat"),this.ctx?.send?.("chat.send",{message:`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`})}async _handleTaskStatusChange(t,e){const a=this.ctx?.gateway;if(!a||!this.ctx?.connected)return;const o=e==="complete"?"pending":"complete";try{await a.request("tasks.update",{id:t,status:o,completedAt:o==="complete"?new Date().toISOString():null});const i=this._state;await f(i),this.todayTasks=i.todayTasks??[],this.todayTasksLoading=i.todayTasksLoading??!1}catch(i){console.error("[GmToday] Task status change failed:",i)}}async _handleCreateTask(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{await e.request("tasks.create",{title:t,dueDate:h(),priority:"medium",source:"chat"});const a=this._state;await f(a),this.todayTasks=a.todayTasks??[],this.todayTasksLoading=a.todayTasksLoading??!1}catch(a){console.error("[GmToday] Create task failed:",a),this.ctx?.addToast?.("Failed to create task","error")}}_handleEditTask(t){this.todayEditingTaskId=t}async _handleUpdateTask(t,e){const a=this.ctx?.gateway;if(!(!a||!this.ctx?.connected))try{await a.request("tasks.update",{id:t,...e}),this.todayEditingTaskId=null;const o=this._state;await f(o),this.todayTasks=o.todayTasks??[],this.todayTasksLoading=o.todayTasksLoading??!1}catch(o){console.error("[GmToday] Update task failed:",o),this.ctx?.addToast?.("Failed to update task","error")}}_handleToggleCompleted(){this.todayShowCompleted=!this.todayShowCompleted}async _handleViewTaskOutput(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{const o=(await e.request("queue.list",{limit:100}))?.items?.find(s=>s.sourceTaskId===t);if(!o?.result?.outputPath){this.ctx?.addToast?.("No output available for this task","info");return}const i=await e.request("queue.readOutput",{path:o.result.outputPath}),n=o.result.outputPath.split("/").pop()??"Agent Output";this.ctx?.openSidebar?.({content:i.content,mimeType:"text/markdown",filePath:o.result.outputPath,title:n})}catch(a){console.error("[GmToday] View task output failed:",a),this.ctx?.addToast?.("Failed to load agent output","error")}}async _handleStartTask(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{const a=await e.request("tasks.openSession",{taskId:t});if(!a?.sessionId){this.ctx?.addToast?.("Failed to open session for task","error");return}let o="";if(a.created&&!a.queueOutput){const i=this.todayTasks?.find(s=>s.id===t),n=i?.project?` (project: ${i.project})`:"";o="Let's work on: "+(i?.title??"this task")+n}b.emit("chat-navigate",{sessionKey:a.sessionId,tab:"chat",message:o})}catch(a){console.error("[GmToday] Start task failed:",a),this.ctx?.addToast?.("Failed to start task session","error")}}async _handleDecisionApprove(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{await e.request("queue.approve",{id:t}),this.todayQueueResults=this.todayQueueResults.filter(a=>a.id!==t)}catch(a){console.error("[GmToday] Approve failed:",a),this.ctx?.addToast?.("Failed to approve","error")}}async _handleDecisionReject(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{await e.request("queue.reject",{id:t}),this.todayQueueResults=this.todayQueueResults.filter(a=>a.id!==t)}catch(a){console.error("[GmToday] Reject failed:",a),this.ctx?.addToast?.("Failed to reject","error")}}async _handleDecisionDismiss(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{await e.request("queue.remove",{id:t}),this.todayQueueResults=this.todayQueueResults.filter(a=>a.id!==t)}catch(a){console.error("[GmToday] Dismiss failed:",a),this.ctx?.addToast?.("Failed to dismiss","error")}}async _handleDecisionMarkComplete(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{const a=this.todayQueueResults?.find(o=>o.id===t);a?.sourceTaskId&&await e.request("tasks.update",{id:a.sourceTaskId,status:"complete"}),await e.request("queue.remove",{id:t}),this.todayQueueResults=this.todayQueueResults.filter(o=>o.id!==t),this.ctx?.addToast?.("Task marked complete","success")}catch(a){console.error("[GmToday] Mark complete failed:",a),this.ctx?.addToast?.("Failed to mark complete","error")}}async _handleDecisionRate(t,e,a){const o=this.ctx?.gateway;if(!(!o||!this.ctx?.connected))try{await o.request("trust.rate",{workflow:e,rating:a});const i=a<7;this.todayQueueResults=this.todayQueueResults.map(n=>n.id===t?{...n,userRating:a,feedbackPending:i}:n),i?this.ctx?.addToast?.(`Rated ${e} ${a}/10 — what could be better?`,"info"):(this.todayQueueResults?.find(s=>s.id===t)?.source==="cron"&&(await o.request("queue.remove",{id:t}),this.todayQueueResults=this.todayQueueResults.filter(s=>s.id!==t)),this.ctx?.addToast?.(`Rated ${e} ${a}/10`,"success"))}catch(i){console.error("[GmToday] Rate failed:",i),this.ctx?.addToast?.("Failed to submit rating","error")}}async _handleDecisionFeedback(t,e,a){const o=this.ctx?.gateway;if(!(!o||!this.ctx?.connected))try{a&&(await o.request("trust.feedback",{workflow:e,feedback:a}),this.ctx?.addToast?.(`Feedback saved for ${e} — will apply next time`,"success")),this.todayQueueResults?.find(n=>n.id===t)?.source==="cron"&&await o.request("queue.remove",{id:t}),this.todayQueueResults=this.todayQueueResults.map(n=>n.id===t?{...n,feedbackPending:!1}:n).filter(n=>!(n.id===t&&n.source==="cron"))}catch(i){console.error("[GmToday] Feedback failed:",i),this.ctx?.addToast?.("Failed to save feedback","error")}}_handleDecisionViewOutput(t,e){const a=this.ctx?.gateway;if(!a||!this.ctx?.connected){this.ctx?.addToast?.("Not connected to gateway","error");return}a.request("queue.readOutput",{path:e}).then(o=>{const i=e.split("/").pop()??"Agent Output";this.ctx?.openSidebar?.({content:o.content,mimeType:"text/markdown",filePath:e,title:i})}).catch(o=>{console.error("[GmToday] View output failed:",o),this.dispatchEvent(new CustomEvent("today-open-file",{detail:{path:e},bubbles:!0,composed:!0}))})}_handleDecisionOpenChat(t){this.dispatchEvent(new CustomEvent("today-decision-open-chat",{detail:{id:t,item:this.todayQueueResults?.find(e=>e.id===t)},bubbles:!0,composed:!0}))}async _handleInboxRefresh(){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected)){this.inboxLoading=!0;try{const e=await t.request("inbox.list",{status:"pending",limit:50});this.inboxItems=e.items,this.inboxCount=e.pendingCount}catch(e){console.error("[GmToday] Inbox load failed:",e)}finally{this.inboxLoading=!1}}}async _handleInboxScore(t,e,a){const o=this.ctx?.gateway;if(!(!o||!this.ctx?.connected))try{await o.request("inbox.score",{itemId:t,score:e,feedback:a}),this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,await this._handleInboxRefresh()}catch(i){console.error("[GmToday] Inbox score failed:",i)}}async _handleInboxDismiss(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{await e.request("inbox.dismiss",{itemId:t}),await this._handleInboxRefresh()}catch(a){console.error("[GmToday] Inbox dismiss failed:",a)}}async _handleInboxMarkAll(){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected))try{await t.request("inbox.markAllComplete",{}),await this._handleInboxRefresh()}catch(e){console.error("[GmToday] Inbox mark all failed:",e)}}async _handleInboxViewOutput(t){const e=this.inboxItems?.find(o=>o.id===t);if(!e)return;const a=this.ctx?.gateway;if(!a||!this.ctx?.connected){this.ctx?.addToast?.("Not connected to gateway","error");return}if(e.outputPath)try{const o=await a.request("queue.readOutput",{path:e.outputPath});if(o?.content){this.ctx?.openSidebar?.({content:o.content,mimeType:"text/markdown",filePath:e.outputPath,title:e.title});return}}catch{}if(e.source?.queueItemId)try{const i=(await a.request("queue.list",{limit:200}))?.items?.find(s=>s.id===e.source.queueItemId),n=i?.result?.outputPath;if(n){const s=await a.request("queue.readOutput",{path:n});if(s?.content){this.ctx?.openSidebar?.({content:s.content,mimeType:"text/markdown",filePath:n,title:e.title});return}}if(i?.result?.summary){this.ctx?.openSidebar?.({content:`# ${e.title}

${i.result.summary}`,mimeType:"text/markdown",title:e.title});return}}catch(o){console.error("[GmToday] Inbox queue lookup failed:",o)}if(e.proofDocSlug){this.dispatchEvent(new CustomEvent("today-open-proof",{detail:{slug:e.proofDocSlug},bubbles:!0,composed:!0}));return}e.summary?this.ctx?.openSidebar?.({content:`# ${e.title}

${e.summary}`,mimeType:"text/markdown",title:e.title}):this.ctx?.addToast?.("No output available for this item","info")}_handleInboxViewProof(t){const e=this.inboxItems?.find(a=>a.id===t);e?.proofDocSlug&&this.dispatchEvent(new CustomEvent("today-open-proof",{detail:{slug:e.proofDocSlug},bubbles:!0,composed:!0}))}_handleInboxOpenChat(t){this.dispatchEvent(new CustomEvent("today-inbox-open-chat",{detail:{itemId:t,item:this.inboxItems?.find(e=>e.id===t)},bubbles:!0,composed:!0}))}_handleInboxSetScoring(t,e){t!==this.inboxScoringId&&(this.inboxFeedbackText=""),this.inboxScoringId=t,this.inboxScoringValue=e??7}_handleInboxFeedbackChange(t){this.inboxFeedbackText=t}_handleInboxSortToggle(){this.inboxSortOrder=this.inboxSortOrder==="newest"?"oldest":"newest"}async _handleTrustDailyRate(t){const e=this.ctx?.gateway;if(e)try{await e.request("trust.dailyRate",{rating:t}),this.trustSummary&&(this.trustSummary={...this.trustSummary,todayRated:!0})}catch(a){console.error("[GmToday] Daily rate failed:",a),this.ctx?.addToast?.("Failed to submit daily rating","error")}}_handleNavigateToTrust(){this.ctx?.setTab?.("trust")}_handleOpenFile(t){this.dispatchEvent(new CustomEvent("today-open-file",{detail:{path:t},bubbles:!0,composed:!0}))}renderToolbar(){return ot({connected:this.ctx?.connected??!1,onRefresh:()=>{this.refresh()},selectedDate:this.todaySelectedDate,onDatePrev:()=>this._handleDatePrev(),onDateNext:()=>this._handleDateNext(),onDateToday:()=>this._handleDateToday(),viewMode:this.todayViewMode,onViewModeChange:t=>this._handleViewModeChange(t),focusPulseActive:!1,onStartMorningSet:()=>this._handleStartMorningSet(),inboxItems:this.inboxItems,inboxCount:this.inboxCount,onEveningCapture:()=>this._handleEveningCapture()})}render(){const t={connected:this.ctx?.connected??!1,loading:this.myDayLoading,error:this.myDayError,onRefresh:()=>{this.refresh()},dailyBrief:this.dailyBrief,dailyBriefLoading:this.dailyBriefLoading,dailyBriefError:this.dailyBriefError,onBriefRefresh:()=>{this._handleDailyBriefRefresh()},onBriefGenerate:()=>{this._handleDailyBriefGenerate()},onBriefOpenInObsidian:()=>this._handleDailyBriefOpenInObsidian(),onBriefSave:e=>{this._handleBriefSave(e)},onBriefToggleCheckbox:(e,a)=>{this._handleBriefToggleCheckbox(e,a)},onOpenFile:e=>this._handleOpenFile(e),selectedDate:this.todaySelectedDate,onDatePrev:()=>this._handleDatePrev(),onDateNext:()=>this._handleDateNext(),onDateToday:()=>this._handleDateToday(),viewMode:this.todayViewMode,onViewModeChange:e=>this._handleViewModeChange(e),agentLog:this.agentLog,agentLogLoading:this.agentLogLoading,agentLogError:this.agentLogError,onAgentLogRefresh:()=>{this.refresh()},focusPulseActive:!1,onStartMorningSet:()=>this._handleStartMorningSet(),todayTasks:this.todayTasks,todayTasksLoading:this.todayTasksLoading,onToggleTaskComplete:(e,a)=>{this._handleTaskStatusChange(e,a)},onStartTask:e=>this._handleStartTask(e),onViewTaskOutput:e=>{this._handleViewTaskOutput(e)},onCreateTask:e=>{this._handleCreateTask(e)},onEditTask:e=>this._handleEditTask(e),onUpdateTask:(e,a)=>{this._handleUpdateTask(e,a)},editingTaskId:this.todayEditingTaskId,showCompletedTasks:this.todayShowCompleted,onToggleCompletedTasks:()=>this._handleToggleCompleted(),decisionCards:(this.todayQueueResults??[]).length>0?{items:this.todayQueueResults,onApprove:e=>{this._handleDecisionApprove(e)},onReject:e=>{this._handleDecisionReject(e)},onDismiss:e=>{this._handleDecisionDismiss(e)},onViewOutput:(e,a)=>this._handleDecisionViewOutput(e,a),onOpenChat:e=>this._handleDecisionOpenChat(e),onMarkComplete:e=>{this._handleDecisionMarkComplete(e)},onRate:(e,a,o)=>{this._handleDecisionRate(e,a,o)},onFeedback:(e,a,o)=>{this._handleDecisionFeedback(e,a,o)}}:void 0,inboxItems:this.inboxItems,inboxLoading:this.inboxLoading,inboxCount:this.inboxCount,inboxScoringId:this.inboxScoringId,inboxScoringValue:this.inboxScoringValue,inboxFeedbackText:this.inboxFeedbackText,onInboxViewOutput:e=>this._handleInboxViewOutput(e),onInboxViewProof:e=>this._handleInboxViewProof(e),onInboxOpenChat:e=>this._handleInboxOpenChat(e),onInboxDismiss:e=>{this._handleInboxDismiss(e)},onInboxScore:(e,a,o)=>{this._handleInboxScore(e,a,o)},onInboxSetScoring:(e,a)=>this._handleInboxSetScoring(e,a),onInboxFeedbackChange:e=>this._handleInboxFeedbackChange(e),onInboxSortToggle:()=>this._handleInboxSortToggle(),inboxSortOrder:this.inboxSortOrder,onInboxMarkAll:()=>{this._handleInboxMarkAll()},trustSummary:this.trustSummary,onTrustDailyRate:e=>{this._handleTrustDailyRate(e)},onNavigateToTrust:()=>this._handleNavigateToTrust(),onEveningCapture:()=>this._handleEveningCapture()};return r`${this.renderToolbar()}${nt(t)}`}};g=new WeakMap;l([D({context:I,subscribe:!0})],d.prototype,"ctx",1);l([c()],d.prototype,"myDayLoading",2);l([c()],d.prototype,"myDayError",2);l([c()],d.prototype,"todaySelectedDate",2);l([c()],d.prototype,"todayViewMode",2);l([c()],d.prototype,"dailyBrief",2);l([c()],d.prototype,"dailyBriefLoading",2);l([c()],d.prototype,"dailyBriefError",2);l([c()],d.prototype,"agentLog",2);l([c()],d.prototype,"agentLogLoading",2);l([c()],d.prototype,"agentLogError",2);l([c()],d.prototype,"briefNotes",2);l([c()],d.prototype,"todayTasks",2);l([c()],d.prototype,"todayTasksLoading",2);l([c()],d.prototype,"todayEditingTaskId",2);l([c()],d.prototype,"todayShowCompleted",2);l([c()],d.prototype,"todayQueueResults",2);l([c()],d.prototype,"inboxItems",2);l([c()],d.prototype,"inboxLoading",2);l([c()],d.prototype,"inboxCount",2);l([c()],d.prototype,"inboxScoringId",2);l([c()],d.prototype,"inboxScoringValue",2);l([c()],d.prototype,"inboxFeedbackText",2);l([c()],d.prototype,"inboxSortOrder",2);l([c()],d.prototype,"trustSummary",2);d=l([_("gm-today")],d);export{d as GmToday};
