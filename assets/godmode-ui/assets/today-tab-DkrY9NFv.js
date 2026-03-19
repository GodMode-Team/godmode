import{b as n,A as u,d as k,g as w,r as l,t as T}from"./lit-core-CTInmNPB.js";import{a as p,p as S,q as D,v as _,w as C,x as y,o as I}from"./index-DxuXMfTD.js";import{z as h}from"./ctrl-settings-UNQXoGSo.js";import{A as $}from"./views-settings-CBBtKhCP.js";import{s as L,a as g}from"./workspaces-BhpyiY6v.js";import"./markdown-i_gIkIP3.js";function f(t){const e=Date.now()-new Date(t).getTime(),a=Math.floor(e/6e4);if(a<1)return"just now";if(a<60)return`${a}m ago`;const i=Math.floor(a/60);return i<24?`${i}h ago`:`${Math.floor(i/24)}d ago`}function B(t){return t.source.persona?t.source.persona.replace(/-/g," ").replace(/\b\w/g,e=>e.toUpperCase()):t.source.skill?t.source.skill:t.type==="agent-execution"?"Agent":"Skill"}function O(t){return t<=2?"Poor":t<=4?"Below expectations":t<=6?"Okay":t<=8?"Good":"Excellent"}function m(t,e){if(t.scoringId!==e.id)return u;const a=t.scoringValue??7,i=t.feedbackText??"",o=a<=4,s=a<=4||a>=9;return n`
    <div class="inbox-scoring">
      <div class="inbox-score-label">
        Rate this output
        <span class="inbox-score-value ${a<=4?"low":a>=9?"high":""}">${a}/10 — ${O(a)}</span>
      </div>
      <div class="inbox-score-row">
        ${[1,2,3,4,5,6,7,8,9,10].map(d=>n`
            <button
              class="inbox-score-btn${d===a?" active":""}${d<=4?" low":d>=9?" high":""}"
              @click=${()=>t.onSetScoring(e.id,d)}
            >${d}</button>
          `)}
      </div>
      ${s?n`
            <div class="inbox-feedback">
              <textarea
                class="inbox-feedback-input"
                rows="3"
                placeholder=${o?"What went wrong? This feedback improves the agent. (required)":"What made this great? (optional)"}
                .value=${i}
                @input=${d=>t.onFeedbackChange(d.target.value)}
              ></textarea>
            </div>
          `:u}
      <div class="inbox-score-actions">
        <button
          class="btn btn--sm inbox-score-submit"
          ?disabled=${o&&!i.trim()}
          @click=${()=>t.onScore(e.id,a,i.trim()||void 0)}
        >Submit ${a}/10</button>
        <button
          class="btn btn--sm inbox-score-cancel"
          @click=${()=>t.onSetScoring(null)}
        >Cancel</button>
      </div>
    </div>
  `}function R(t,e){const a=e.deliverables??[];return n`
    <div class="inbox-card inbox-card--project">
      <div class="inbox-card-header">
        <span class="inbox-card-source">Project Complete</span>
        <span class="inbox-card-time">${f(e.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${e.title}</div>
        <div class="inbox-card-summary">${e.summary}</div>
        ${a.length>0?n`
              <div class="inbox-deliverables">
                ${a.map(i=>n`
                    <div class="inbox-deliverable-row">
                      <span class="inbox-deliverable-persona">${i.persona.replace(/-/g," ")}</span>
                      <span class="inbox-deliverable-title">${i.title}</span>
                      ${i.proofDocSlug?n`<button class="btn btn--sm" @click=${()=>t.onViewOutput(e.id)}>View</button>`:u}
                    </div>
                  `)}
              </div>
            `:u}
      </div>
      <div class="inbox-card-actions">
        <button class="btn btn--sm primary" @click=${()=>t.onOpenChat(e.id)}>Review in Chat</button>
        ${e.proofDocSlug?n`<button class="btn btn--sm" @click=${()=>t.onViewOutput(e.id)}>View Deliverables</button>`:u}
        <button class="btn btn--sm" @click=${()=>t.onSetScoring(e.id,7)}>Score</button>
        <button class="btn btn--sm" @click=${()=>t.onDismiss(e.id)}>Dismiss</button>
      </div>
      ${m(t,e)}
    </div>
  `}function E(t,e){if(e.type==="project-completion")return R(t,e);const a=!!(e.sessionId||e.source.taskId||e.source.queueItemId);return n`
    <div class="inbox-card">
      <div class="inbox-card-header">
        <span class="inbox-card-source">${B(e)}</span>
        <span class="inbox-card-time">${f(e.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${e.title}</div>
        <div class="inbox-card-summary">${e.summary.slice(0,220)}${e.summary.length>220?"…":""}</div>
      </div>
      <div class="inbox-card-actions">
        ${e.outputPath?n`<button class="btn btn--sm" @click=${()=>t.onViewOutput(e.id)}>View Output</button>`:u}
        ${e.proofDocSlug?n`<button class="btn btn--sm" @click=${()=>t.onViewProof(e.id)}>Proof</button>`:u}
        ${a?n`<button class="btn btn--sm" @click=${()=>t.onOpenChat(e.id)}>Open Chat</button>`:u}
        <button class="btn btn--sm primary" @click=${()=>t.onSetScoring(e.id,7)}>Complete</button>
        <button class="btn btn--sm" @click=${()=>t.onDismiss(e.id)}>Dismiss</button>
      </div>
      ${m(t,e)}
    </div>
  `}function q(t){const e=t.sortOrder??"newest",a=t.items.filter(o=>o.status==="pending").sort((o,s)=>{const d=new Date(s.createdAt).getTime()-new Date(o.createdAt).getTime();return e==="oldest"?-d:d}),i=t.count??a.length;return t.loading?n`<div class="inbox-loading">Loading inbox…</div>`:i===0?n`
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
    `:n`
    <div class="my-day-card">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x1F4E5;</span>
          <span>INBOX</span>
          <span class="tab-badge" style="margin-left: 8px;">${i}</span>
        </div>
        <div class="inbox-header-actions">
          <button class="btn btn--sm" @click=${()=>t.onSortToggle?.()}>${e==="newest"?"Newest first":"Oldest first"}</button>
          <button class="btn btn--sm" @click=${()=>t.onMarkAll()}>Mark All Complete</button>
        </div>
      </div>
      <div class="my-day-card-content">
        <div class="inbox-list">
          ${a.map(o=>E(t,o))}
        </div>
      </div>
    </div>
  `}var F=Object.defineProperty,M=Object.getOwnPropertyDescriptor,x=t=>{throw TypeError(t)},c=(t,e,a,i)=>{for(var o=i>1?void 0:i?M(e,a):e,s=t.length-1,d;s>=0;s--)(d=t[s])&&(o=(i?d(e,a,o):d(o))||o);return i&&o&&F(e,a,o),o},v=(t,e,a)=>e.has(t)||x("Cannot "+a),V=(t,e,a)=>(v(t,e,"read from private field"),a?a.call(t):e.get(t)),A=(t,e,a)=>e.has(t)?x("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,a),P=(t,e,a,i)=>(v(t,e,"write to private field"),e.set(t,a),a),b;function N(t){return t===h()}function G(t){const e=new Date(t+"T12:00:00");return Q(e)}function Q(t){const e=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],a=["January","February","March","April","May","June","July","August","September","October","November","December"],i=e[t.getDay()],o=a[t.getMonth()],s=t.getDate();return`${i}, ${o} ${s}`}function W(t){return n`
    <form class="ws-task-create-form" @submit=${e=>{e.preventDefault();const i=e.currentTarget.querySelector("input"),o=i.value.trim();o&&(t(o),i.value="")}}>
      <input type="text" class="ws-task-create-input" placeholder="Add a task for today..." />
      <button type="submit" class="ws-task-create-btn">Add</button>
    </form>
  `}function j(t){const e=L(t.todayTasks??[],"due"),a=e.filter(o=>o.status==="pending"),i=e.filter(o=>o.status==="complete");return n`
    <div class="my-day-card today-tasks-panel">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x2705;</span>
          <span>TODAY'S TASKS</span>
        </div>
        <span class="today-tasks-count">
          ${a.length} open${i.length>0?n`, ${i.length} done`:u}
        </span>
      </div>
      <div class="my-day-card-content">
        ${t.todayTasksLoading?n`<div class="brief-loading"><div class="spinner"></div><span>Loading tasks...</span></div>`:n`
              ${t.onCreateTask?W(t.onCreateTask):u}
              <div class="today-tasks-list">
                ${a.length===0&&i.length===0?n`<div class="today-tasks-empty">No tasks for today. Add one above or drop tasks in your daily brief.</div>`:a.map(o=>g(o,t.onToggleTaskComplete,t.onStartTask,t.editingTaskId,t.onEditTask,t.onUpdateTask,t.onViewTaskOutput))}
              </div>
              ${i.length>0?n`
                    <button class="today-completed-toggle" @click=${()=>t.onToggleCompletedTasks?.()}>
                      ${t.showCompletedTasks?"Hide":"Show"} ${i.length} completed
                    </button>
                    ${t.showCompletedTasks?n`<div class="today-tasks-list today-tasks-list--completed">
                          ${i.map(o=>g(o,t.onToggleTaskComplete,t.onStartTask,t.editingTaskId,t.onEditTask,t.onUpdateTask))}
                        </div>`:u}
                  `:u}
            `}
      </div>
    </div>
  `}function U(t){const e=h(),a=t.selectedDate??e,i=N(a),o=G(a),s=t.viewMode??"brief";return n`
    <div class="my-day-toolbar">
      <div class="today-date-nav">
        ${t.onDatePrev?n`<button class="today-date-btn" @click=${t.onDatePrev} title="Previous day">&#x2039;</button>`:u}
        <span class="today-date-label ${i?"":"past-date"}">${o}</span>
        ${t.onDateNext?n`<button class="today-date-btn" @click=${t.onDateNext} title="Next day">&#x203A;</button>`:u}
        ${!i&&t.onDateToday?n`<button class="today-date-today-btn" @click=${t.onDateToday}>Today</button>`:u}
      </div>
      <div class="today-view-tabs">
        <button class="today-view-tab ${s==="brief"?"active":""}"
          @click=${()=>t.onViewModeChange?.("brief")}>Brief</button>
        <button class="today-view-tab ${s==="tasks"?"active":""}"
          @click=${()=>t.onViewModeChange?.("tasks")}>Tasks</button>
        <button class="today-view-tab ${s==="inbox"?"active":""}"
          @click=${()=>t.onViewModeChange?.("inbox")}>Inbox${(t.inboxCount??t.inboxItems?.filter(d=>d.status==="pending").length??t.decisionCards?.items.length??0)>0?n`<span class="tab-badge">${t.inboxCount??t.inboxItems?.filter(d=>d.status==="pending").length??t.decisionCards?.items.length}</span>`:u}</button>
      </div>
      <div class="today-quick-actions">
        ${new Date().getHours()<15?!t.focusPulseActive&&t.onStartMorningSet?n`<button class="today-morning-set-btn" @click=${t.onStartMorningSet}
                  title="Start your morning focus ritual">\u2600\uFE0F Start my day</button>`:u:t.onEveningCapture?n`<button class="today-evening-btn" @click=${t.onEveningCapture}
                  title="Reflect on your day and set up tomorrow">\uD83C\uDF19 Evening Capture</button>`:u}
        ${t.onRefresh?n`<button class="my-day-refresh-btn" @click=${t.onRefresh} title="Refresh / Generate Brief">&#x21BB;</button>`:null}
      </div>
    </div>
  `}function z(t){return n`
    <div class="my-day-brief-full">
      ${q({items:t.inboxItems??[],loading:t.inboxLoading,count:t.inboxCount,sortOrder:t.inboxSortOrder??"newest",scoringId:t.inboxScoringId,scoringValue:t.inboxScoringValue,feedbackText:t.inboxFeedbackText,onViewOutput:e=>t.onInboxViewOutput?.(e),onViewProof:e=>t.onInboxViewProof?.(e),onOpenChat:e=>t.onInboxOpenChat?.(e),onDismiss:e=>t.onInboxDismiss?.(e),onScore:(e,a,i)=>t.onInboxScore?.(e,a,i),onSetScoring:(e,a)=>t.onInboxSetScoring?.(e,a),onFeedbackChange:e=>t.onInboxFeedbackChange?.(e),onSortToggle:()=>t.onInboxSortToggle?.(),onMarkAll:()=>t.onInboxMarkAll?.()})}
    </div>
  `}function J(t){const e=h();t.selectedDate;const a=t.viewMode??"brief";if(t.loading)return n`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading your day...</span>
        </div>
      </div>
    `;if(t.error)return n`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">&#x26A0;</span>
          <span>${t.error}</span>
          ${t.onRefresh?n`<button class="retry-button" @click=${t.onRefresh}>Retry</button>`:null}
        </div>
      </div>
    `;const i={connected:t.connected,data:t.dailyBrief??null,loading:t.dailyBriefLoading,error:t.dailyBriefError,onRefresh:t.onBriefRefresh,onGenerate:t.onBriefGenerate,onOpenInObsidian:t.onBriefOpenInObsidian,onSaveBrief:t.onBriefSave,onToggleCheckbox:t.onBriefToggleCheckbox,onOpenFile:t.onOpenFile};return n`
    <div class="my-day-container">
      ${a==="brief"?n`<div class="my-day-brief-full">
            ${$(i)}
          </div>`:a==="tasks"?n`<div class="my-day-brief-full">${j(t)}</div>`:z(t)}
    </div>
  `}let r=class extends k{constructor(){super(...arguments),A(this,b),this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=h(),this.todayViewMode="brief",this.dailyBrief=null,this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLog=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.todayEditingTaskId=null,this.todayShowCompleted=!1,this.todayQueueResults=[],this.inboxItems=[],this.inboxLoading=!1,this.inboxCount=0,this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,this.inboxSortOrder="newest",this.trustSummary=null,this._unsubs=[],this._dataLoaded=!1}get ctx(){return V(this,b)}set ctx(t){P(this,b,t)}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._unsubs.push(p.on("refresh-requested",t=>{(t.target==="today"||t.target==="my-day")&&this.refresh()}))}willUpdate(t){this.ctx?.connected&&!this._dataLoaded&&!this.myDayLoading&&(this._dataLoaded=!0,this._loadAll())}disconnectedCallback(){for(const t of this._unsubs)t();this._unsubs=[],super.disconnectedCallback()}get _state(){return{client:this.ctx?.gateway??null,connected:this.ctx?.connected??!1,myDayLoading:this.myDayLoading,myDayError:this.myDayError,dailyBrief:this.dailyBrief,dailyBriefLoading:this.dailyBriefLoading,dailyBriefError:this.dailyBriefError,agentLog:this.agentLog,agentLogLoading:this.agentLogLoading,agentLogError:this.agentLogError,briefNotes:this.briefNotes,todaySelectedDate:this.todaySelectedDate,todayViewMode:this.todayViewMode,todayTasks:this.todayTasks,todayTasksLoading:this.todayTasksLoading,trustSummary:this.trustSummary,inboxItems:this.inboxItems,inboxLoading:this.inboxLoading,inboxCount:this.inboxCount,loadBriefNotes:()=>this._loadBriefNotes()}}_syncFromState(t){this.myDayLoading=t.myDayLoading??!1,this.myDayError=t.myDayError??null,this.dailyBrief=t.dailyBrief??null,this.dailyBriefLoading=t.dailyBriefLoading??!1,this.dailyBriefError=t.dailyBriefError??null,this.agentLog=t.agentLog??null,this.agentLogLoading=t.agentLogLoading??!1,this.agentLogError=t.agentLogError??null,this.briefNotes=t.briefNotes??{},this.todayTasks=t.todayTasks??[],this.todayTasksLoading=t.todayTasksLoading??!1,this.trustSummary=t.trustSummary??null,this.inboxItems=t.inboxItems??[],this.inboxLoading=t.inboxLoading??!1,this.inboxCount=t.inboxCount??0}async _loadAll(){const t=this._state;await S(t),this._syncFromState(t),this._loadDecisionCards()}async _loadBriefOnly(){const t=this._state;await D(t),this._syncFromState(t)}async _loadBriefNotes(){const t=this.ctx?.gateway;if(!t||!this.ctx?.connected)return;const e=this.todaySelectedDate;try{const a=await t.request("briefNotes.get",{date:e});this.briefNotes=a.notes??{}}catch(a){console.error("[GmToday] Brief notes load error:",a),this.briefNotes={}}}async _loadDecisionCards(){if(!(!this.ctx?.gateway||!this.ctx?.connected))try{const e=this._state;this.todayQueueResults=await _(e)}catch{}}async refresh(){await this._loadAll()}_handleDatePrev(){const t=new Date(this.todaySelectedDate+"T12:00:00");t.setDate(t.getDate()-1),this.todaySelectedDate=h(t),this._loadBriefOnly()}_handleDateNext(){const t=new Date(this.todaySelectedDate+"T12:00:00");t.setDate(t.getDate()+1);const e=h(),a=h(t);a>e||(this.todaySelectedDate=a,this._loadBriefOnly())}_handleDateToday(){this.todaySelectedDate=h(),this._loadAll()}async _handleDailyBriefRefresh(){await this._loadBriefOnly()}async _handleDailyBriefGenerate(){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected)){this.dailyBriefLoading=!0;try{await t.request("dailyBrief.generate",{}),await this._loadBriefOnly()}catch(e){this.dailyBriefError=e instanceof Error?e.message:"Failed to generate brief"}finally{this.dailyBriefLoading=!1}}}_handleDailyBriefOpenInObsidian(){const t=this.dailyBrief?.date;C(t)}async _handleBriefSave(t){const e=this.ctx?.gateway;if(!e||!this.ctx?.connected)return;const a=this.dailyBrief?.date||this.todaySelectedDate;try{await e.request("dailyBrief.update",{date:a,content:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(i){console.error("[GmToday] Brief save failed:",i),this.ctx?.addToast?.("Failed to save brief","error")}}async _handleBriefToggleCheckbox(t,e){const a=this.ctx?.gateway;if(!a||!this.ctx?.connected)return;const i=this.dailyBrief?.date||this.todaySelectedDate;try{await a.request("dailyBrief.toggleCheckbox",{date:i,index:t,checked:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(o){console.error("[GmToday] Checkbox toggle failed:",o)}}_handleViewModeChange(t){if(this.todayViewMode=t,t==="inbox"&&this.inboxItems.length===0&&!this.inboxLoading&&this._handleInboxRefresh(),t==="tasks"&&this.todayTasks.length===0&&!this.todayTasksLoading){const e=this._state;y(e).then(()=>{this.todayTasks=e.todayTasks??[],this.todayTasksLoading=e.todayTasksLoading??!1})}}_handleStartMorningSet(){this.ctx?.setTab?.("chat"),this.ctx?.send?.("chat.send",{message:"Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan."})}_handleEveningCapture(){this.ctx?.setTab?.("chat"),this.ctx?.send?.("chat.send",{message:`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`})}async _handleTaskStatusChange(t,e){const a=this.ctx?.gateway;if(!a||!this.ctx?.connected)return;const i=e==="complete"?"pending":"complete";try{await a.request("tasks.update",{id:t,status:i,completedAt:i==="complete"?new Date().toISOString():null});const o=this._state;await y(o),this.todayTasks=o.todayTasks??[],this.todayTasksLoading=o.todayTasksLoading??!1}catch(o){console.error("[GmToday] Task status change failed:",o)}}async _handleCreateTask(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{await e.request("tasks.create",{title:t,dueDate:h(),priority:"medium",source:"chat"});const a=this._state;await y(a),this.todayTasks=a.todayTasks??[],this.todayTasksLoading=a.todayTasksLoading??!1}catch(a){console.error("[GmToday] Create task failed:",a),this.ctx?.addToast?.("Failed to create task","error")}}_handleEditTask(t){this.todayEditingTaskId=t}async _handleUpdateTask(t,e){const a=this.ctx?.gateway;if(!(!a||!this.ctx?.connected))try{await a.request("tasks.update",{id:t,...e}),this.todayEditingTaskId=null;const i=this._state;await y(i),this.todayTasks=i.todayTasks??[],this.todayTasksLoading=i.todayTasksLoading??!1}catch(i){console.error("[GmToday] Update task failed:",i),this.ctx?.addToast?.("Failed to update task","error")}}_handleToggleCompleted(){this.todayShowCompleted=!this.todayShowCompleted}async _handleViewTaskOutput(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{const i=(await e.request("queue.list",{limit:100}))?.items?.find(d=>d.sourceTaskId===t);if(!i?.result?.outputPath){this.ctx?.addToast?.("No output available for this task","info");return}const o=await e.request("queue.readOutput",{path:i.result.outputPath}),s=i.result.outputPath.split("/").pop()??"Agent Output";this.ctx?.openSidebar?.({content:o.content,mimeType:"text/markdown",filePath:i.result.outputPath,title:s})}catch(a){console.error("[GmToday] View task output failed:",a),this.ctx?.addToast?.("Failed to load agent output","error")}}_handleStartTask(t){this.dispatchEvent(new CustomEvent("today-start-task",{detail:{taskId:t},bubbles:!0,composed:!0}))}async _handleDecisionApprove(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{await e.request("queue.approve",{id:t}),this.todayQueueResults=this.todayQueueResults.filter(a=>a.id!==t)}catch(a){console.error("[GmToday] Approve failed:",a),this.ctx?.addToast?.("Failed to approve","error")}}async _handleDecisionReject(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{await e.request("queue.reject",{id:t}),this.todayQueueResults=this.todayQueueResults.filter(a=>a.id!==t)}catch(a){console.error("[GmToday] Reject failed:",a),this.ctx?.addToast?.("Failed to reject","error")}}async _handleDecisionDismiss(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{await e.request("queue.remove",{id:t}),this.todayQueueResults=this.todayQueueResults.filter(a=>a.id!==t)}catch(a){console.error("[GmToday] Dismiss failed:",a),this.ctx?.addToast?.("Failed to dismiss","error")}}async _handleDecisionMarkComplete(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{const a=this.todayQueueResults?.find(i=>i.id===t);a?.sourceTaskId&&await e.request("tasks.update",{id:a.sourceTaskId,status:"complete"}),await e.request("queue.remove",{id:t}),this.todayQueueResults=this.todayQueueResults.filter(i=>i.id!==t),this.ctx?.addToast?.("Task marked complete","success")}catch(a){console.error("[GmToday] Mark complete failed:",a),this.ctx?.addToast?.("Failed to mark complete","error")}}async _handleDecisionRate(t,e,a){const i=this.ctx?.gateway;if(!(!i||!this.ctx?.connected))try{await i.request("trust.rate",{workflow:e,rating:a});const o=a<7;this.todayQueueResults=this.todayQueueResults.map(s=>s.id===t?{...s,userRating:a,feedbackPending:o}:s),o?this.ctx?.addToast?.(`Rated ${e} ${a}/10 — what could be better?`,"info"):(this.todayQueueResults?.find(d=>d.id===t)?.source==="cron"&&(await i.request("queue.remove",{id:t}),this.todayQueueResults=this.todayQueueResults.filter(d=>d.id!==t)),this.ctx?.addToast?.(`Rated ${e} ${a}/10`,"success"))}catch(o){console.error("[GmToday] Rate failed:",o),this.ctx?.addToast?.("Failed to submit rating","error")}}async _handleDecisionFeedback(t,e,a){const i=this.ctx?.gateway;if(!(!i||!this.ctx?.connected))try{a&&(await i.request("trust.feedback",{workflow:e,feedback:a}),this.ctx?.addToast?.(`Feedback saved for ${e} — will apply next time`,"success")),this.todayQueueResults?.find(s=>s.id===t)?.source==="cron"&&await i.request("queue.remove",{id:t}),this.todayQueueResults=this.todayQueueResults.map(s=>s.id===t?{...s,feedbackPending:!1}:s).filter(s=>!(s.id===t&&s.source==="cron"))}catch(o){console.error("[GmToday] Feedback failed:",o),this.ctx?.addToast?.("Failed to save feedback","error")}}_handleDecisionViewOutput(t,e){const a=this.ctx?.gateway;if(!a||!this.ctx?.connected){this.ctx?.addToast?.("Not connected to gateway","error");return}a.request("queue.readOutput",{path:e}).then(i=>{const o=e.split("/").pop()??"Agent Output";this.ctx?.openSidebar?.({content:i.content,mimeType:"text/markdown",filePath:e,title:o})}).catch(i=>{console.error("[GmToday] View output failed:",i),this.dispatchEvent(new CustomEvent("today-open-file",{detail:{path:e},bubbles:!0,composed:!0}))})}_handleDecisionOpenChat(t){this.dispatchEvent(new CustomEvent("today-decision-open-chat",{detail:{id:t,item:this.todayQueueResults?.find(e=>e.id===t)},bubbles:!0,composed:!0}))}async _handleInboxRefresh(){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected)){this.inboxLoading=!0;try{const e=await t.request("inbox.list",{status:"pending",limit:50});this.inboxItems=e.items,this.inboxCount=e.pendingCount}catch(e){console.error("[GmToday] Inbox load failed:",e)}finally{this.inboxLoading=!1}}}async _handleInboxScore(t,e,a){const i=this.ctx?.gateway;if(!(!i||!this.ctx?.connected))try{await i.request("inbox.score",{itemId:t,score:e,feedback:a}),this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,await this._handleInboxRefresh()}catch(o){console.error("[GmToday] Inbox score failed:",o)}}async _handleInboxDismiss(t){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{await e.request("inbox.dismiss",{itemId:t}),await this._handleInboxRefresh()}catch(a){console.error("[GmToday] Inbox dismiss failed:",a)}}async _handleInboxMarkAll(){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected))try{await t.request("inbox.markAllComplete",{}),await this._handleInboxRefresh()}catch(e){console.error("[GmToday] Inbox mark all failed:",e)}}async _handleInboxViewOutput(t){const e=this.inboxItems?.find(i=>i.id===t);if(!e)return;const a=this.ctx?.gateway;if(!a||!this.ctx?.connected){this.ctx?.addToast?.("Not connected to gateway","error");return}if(e.outputPath)try{const i=await a.request("queue.readOutput",{path:e.outputPath});if(i?.content){this.ctx?.openSidebar?.({content:i.content,mimeType:"text/markdown",filePath:e.outputPath,title:e.title});return}}catch{}if(e.source?.queueItemId)try{const o=(await a.request("queue.list",{limit:200}))?.items?.find(d=>d.id===e.source.queueItemId),s=o?.result?.outputPath;if(s){const d=await a.request("queue.readOutput",{path:s});if(d?.content){this.ctx?.openSidebar?.({content:d.content,mimeType:"text/markdown",filePath:s,title:e.title});return}}if(o?.result?.summary){this.ctx?.openSidebar?.({content:`# ${e.title}

${o.result.summary}`,mimeType:"text/markdown",title:e.title});return}}catch(i){console.error("[GmToday] Inbox queue lookup failed:",i)}if(e.proofDocSlug){this.dispatchEvent(new CustomEvent("today-open-proof",{detail:{slug:e.proofDocSlug},bubbles:!0,composed:!0}));return}e.summary?this.ctx?.openSidebar?.({content:`# ${e.title}

${e.summary}`,mimeType:"text/markdown",title:e.title}):this.ctx?.addToast?.("No output available for this item","info")}_handleInboxViewProof(t){const e=this.inboxItems?.find(a=>a.id===t);e?.proofDocSlug&&this.dispatchEvent(new CustomEvent("today-open-proof",{detail:{slug:e.proofDocSlug},bubbles:!0,composed:!0}))}_handleInboxOpenChat(t){this.dispatchEvent(new CustomEvent("today-inbox-open-chat",{detail:{itemId:t,item:this.inboxItems?.find(e=>e.id===t)},bubbles:!0,composed:!0}))}_handleInboxSetScoring(t,e){t!==this.inboxScoringId&&(this.inboxFeedbackText=""),this.inboxScoringId=t,this.inboxScoringValue=e??7}_handleInboxFeedbackChange(t){this.inboxFeedbackText=t}_handleInboxSortToggle(){this.inboxSortOrder=this.inboxSortOrder==="newest"?"oldest":"newest"}async _handleTrustDailyRate(t){const e=this.ctx?.gateway;if(e)try{await e.request("trust.dailyRate",{rating:t}),this.trustSummary&&(this.trustSummary={...this.trustSummary,todayRated:!0})}catch(a){console.error("[GmToday] Daily rate failed:",a),this.ctx?.addToast?.("Failed to submit daily rating","error")}}_handleNavigateToTrust(){this.ctx?.setTab?.("trust")}_handleOpenFile(t){this.dispatchEvent(new CustomEvent("today-open-file",{detail:{path:t},bubbles:!0,composed:!0}))}renderToolbar(){return U({connected:this.ctx?.connected??!1,onRefresh:()=>{this.refresh()},selectedDate:this.todaySelectedDate,onDatePrev:()=>this._handleDatePrev(),onDateNext:()=>this._handleDateNext(),onDateToday:()=>this._handleDateToday(),viewMode:this.todayViewMode,onViewModeChange:t=>this._handleViewModeChange(t),focusPulseActive:!1,onStartMorningSet:()=>this._handleStartMorningSet(),inboxItems:this.inboxItems,inboxCount:this.inboxCount,onEveningCapture:()=>this._handleEveningCapture()})}render(){const t={connected:this.ctx?.connected??!1,loading:this.myDayLoading,error:this.myDayError,onRefresh:()=>{this.refresh()},dailyBrief:this.dailyBrief,dailyBriefLoading:this.dailyBriefLoading,dailyBriefError:this.dailyBriefError,onBriefRefresh:()=>{this._handleDailyBriefRefresh()},onBriefGenerate:()=>{this._handleDailyBriefGenerate()},onBriefOpenInObsidian:()=>this._handleDailyBriefOpenInObsidian(),onBriefSave:e=>{this._handleBriefSave(e)},onBriefToggleCheckbox:(e,a)=>{this._handleBriefToggleCheckbox(e,a)},onOpenFile:e=>this._handleOpenFile(e),selectedDate:this.todaySelectedDate,onDatePrev:()=>this._handleDatePrev(),onDateNext:()=>this._handleDateNext(),onDateToday:()=>this._handleDateToday(),viewMode:this.todayViewMode,onViewModeChange:e=>this._handleViewModeChange(e),agentLog:this.agentLog,agentLogLoading:this.agentLogLoading,agentLogError:this.agentLogError,onAgentLogRefresh:()=>{this.refresh()},focusPulseActive:!1,onStartMorningSet:()=>this._handleStartMorningSet(),todayTasks:this.todayTasks,todayTasksLoading:this.todayTasksLoading,onToggleTaskComplete:(e,a)=>{this._handleTaskStatusChange(e,a)},onStartTask:e=>this._handleStartTask(e),onViewTaskOutput:e=>{this._handleViewTaskOutput(e)},onCreateTask:e=>{this._handleCreateTask(e)},onEditTask:e=>this._handleEditTask(e),onUpdateTask:(e,a)=>{this._handleUpdateTask(e,a)},editingTaskId:this.todayEditingTaskId,showCompletedTasks:this.todayShowCompleted,onToggleCompletedTasks:()=>this._handleToggleCompleted(),decisionCards:(this.todayQueueResults??[]).length>0?{items:this.todayQueueResults,onApprove:e=>{this._handleDecisionApprove(e)},onReject:e=>{this._handleDecisionReject(e)},onDismiss:e=>{this._handleDecisionDismiss(e)},onViewOutput:(e,a)=>this._handleDecisionViewOutput(e,a),onOpenChat:e=>this._handleDecisionOpenChat(e),onMarkComplete:e=>{this._handleDecisionMarkComplete(e)},onRate:(e,a,i)=>{this._handleDecisionRate(e,a,i)},onFeedback:(e,a,i)=>{this._handleDecisionFeedback(e,a,i)}}:void 0,inboxItems:this.inboxItems,inboxLoading:this.inboxLoading,inboxCount:this.inboxCount,inboxScoringId:this.inboxScoringId,inboxScoringValue:this.inboxScoringValue,inboxFeedbackText:this.inboxFeedbackText,onInboxViewOutput:e=>this._handleInboxViewOutput(e),onInboxViewProof:e=>this._handleInboxViewProof(e),onInboxOpenChat:e=>this._handleInboxOpenChat(e),onInboxDismiss:e=>{this._handleInboxDismiss(e)},onInboxScore:(e,a,i)=>{this._handleInboxScore(e,a,i)},onInboxSetScoring:(e,a)=>this._handleInboxSetScoring(e,a),onInboxFeedbackChange:e=>this._handleInboxFeedbackChange(e),onInboxSortToggle:()=>this._handleInboxSortToggle(),inboxSortOrder:this.inboxSortOrder,onInboxMarkAll:()=>{this._handleInboxMarkAll()},trustSummary:this.trustSummary,onTrustDailyRate:e=>{this._handleTrustDailyRate(e)},onNavigateToTrust:()=>this._handleNavigateToTrust(),onEveningCapture:()=>this._handleEveningCapture()};return n`${this.renderToolbar()}${J(t)}`}};b=new WeakMap;c([w({context:I,subscribe:!0})],r.prototype,"ctx",1);c([l()],r.prototype,"myDayLoading",2);c([l()],r.prototype,"myDayError",2);c([l()],r.prototype,"todaySelectedDate",2);c([l()],r.prototype,"todayViewMode",2);c([l()],r.prototype,"dailyBrief",2);c([l()],r.prototype,"dailyBriefLoading",2);c([l()],r.prototype,"dailyBriefError",2);c([l()],r.prototype,"agentLog",2);c([l()],r.prototype,"agentLogLoading",2);c([l()],r.prototype,"agentLogError",2);c([l()],r.prototype,"briefNotes",2);c([l()],r.prototype,"todayTasks",2);c([l()],r.prototype,"todayTasksLoading",2);c([l()],r.prototype,"todayEditingTaskId",2);c([l()],r.prototype,"todayShowCompleted",2);c([l()],r.prototype,"todayQueueResults",2);c([l()],r.prototype,"inboxItems",2);c([l()],r.prototype,"inboxLoading",2);c([l()],r.prototype,"inboxCount",2);c([l()],r.prototype,"inboxScoringId",2);c([l()],r.prototype,"inboxScoringValue",2);c([l()],r.prototype,"inboxFeedbackText",2);c([l()],r.prototype,"inboxSortOrder",2);c([l()],r.prototype,"trustSummary",2);r=c([T("gm-today")],r);export{r as GmToday};
