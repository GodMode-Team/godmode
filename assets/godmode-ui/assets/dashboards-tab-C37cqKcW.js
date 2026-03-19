import{b as r,A as l,o as C,d as $,g as k,r as h,t as _}from"./lit-core-CTInmNPB.js";import{o as S}from"./index-Cr5JdXTq.js";import{a as u}from"./event-bus-4tWT8iFZ.js";import{B as I}from"./views-settings-Dbe7GjNl.js";import{f as y}from"./ctrl-settings-rEJlXhcU.js";import{loadDashboards as A,loadDashboard as F,deleteDashboard as P,toggleDashboardPin as T}from"./dashboards-CrT3s0NG.js";import"./markdown-i_gIkIP3.js";const v={all:{icon:"📊",label:"All"},productivity:{icon:"📋",label:"Productivity"},personal:{icon:"🧑",label:"Personal"},business:{icon:"💼",label:"Business"},system:{icon:"⚙️",label:"System"},custom:{icon:"✨",label:"Custom"}},M=[{id:"morning-overview",name:"Morning Overview",category:"productivity",description:"Tasks, calendar, priorities, and focus score",prompt:"Create a morning overview dashboard that shows my top priorities, today's calendar events, active queue items, and readiness score. Use clean CSS grid layout."},{id:"weekly-impact",name:"Weekly Impact",category:"productivity",description:"What you accomplished this week",prompt:"Create a weekly impact dashboard showing tasks completed vs created this week, agent task outcomes, trust score changes, and top 3 wins. Use CSS bar charts."},{id:"agent-activity",name:"Agent Activity",category:"system",description:"Queue throughput, personas, and trust scores",prompt:"Create an agent activity dashboard showing queue stats (pending, processing, completed, failed), most active personas, cron skill execution log, and trust scores by workflow."},{id:"health-energy",name:"Health & Energy",category:"personal",description:"Sleep, readiness, and activity from Oura",prompt:"Create a health and energy dashboard showing last night's sleep score, 7-day sleep trend, today's readiness score, activity level, and HRV trend. Pull from Oura integration."},{id:"goals-tracker",name:"Goals Tracker",category:"personal",description:"Active goals with progress bars",prompt:"Create a goals tracker dashboard showing my active goals as cards with progress bars, grouped by area (health, career, finance, personal), with overall completion percentage."},{id:"content-performance",name:"Content Performance",category:"business",description:"Social posts and content pipeline",prompt:"Create a content performance dashboard showing recent content pieces, content pipeline status, engagement metrics from X intelligence, and a content calendar for the next 7 days."}];function x(a){return a==="global"?r`<span class="dashboard-card-scope">Global</span>`:r`<span class="dashboard-card-scope">${a}</span>`}function D(a){return Date.now()-new Date(a).getTime()>1440*60*1e3}function w(a){const e=(a.title+" "+(a.description??"")).toLowerCase();return e.includes("health")||e.includes("sleep")||e.includes("oura")||e.includes("energy")||e.includes("goal")?"personal":e.includes("agent")||e.includes("queue")||e.includes("trust")||e.includes("skill")?"system":e.includes("revenue")||e.includes("business")||e.includes("content")||e.includes("metric")?"business":e.includes("task")||e.includes("calendar")||e.includes("morning")||e.includes("impact")||e.includes("weekly")?"productivity":"custom"}function f(a,e){const s=v[a.category]??v.custom;return r`
    <div class="dashboard-card dashboard-card--template">
      <button
        class="dashboard-card-main"
        @click=${()=>e(a.prompt)}
      >
        <div class="dashboard-card-title">${a.name}</div>
        <div class="dashboard-card-desc">${a.description}</div>
        <div class="dashboard-card-meta">
          <span class="dashboard-card-scope">${s.icon} ${s.label}</span>
          <span class="dashboard-card-template-label">Template</span>
        </div>
      </button>
    </div>
  `}function E(a,e,s,o){const t=D(a.updatedAt);return r`
    <div class="dashboard-card ${a.pinned?"dashboard-card--pinned":""}">
      <button
        class="dashboard-card-main"
        @click=${()=>e(a.id)}
      >
        <div class="dashboard-card-title">
          ${a.pinned?r`<span class="pin-icon" title="Pinned">\u{1F4CC}</span>`:l}
          ${a.title}
        </div>
        ${a.description?r`<div class="dashboard-card-desc">${a.description}</div>`:l}
        <div class="dashboard-card-meta">
          ${x(a.scope)}
          <span>${y(new Date(a.updatedAt).getTime())}</span>
          ${t?r`<span class="dashboard-card-stale" title="Last updated over 24 hours ago">\u{1F7E1} Stale</span>`:l}
        </div>
      </button>
      <div class="dashboard-card-actions">
        ${o?r`<button
              class="dashboard-card-pin"
              title="${a.pinned?"Unpin":"Pin"}"
              @click=${i=>{i.stopPropagation(),o(a.id)}}
            >${a.pinned?"📌":"📅"}</button>`:l}
        <button
          class="dashboard-card-delete"
          title="Delete dashboard"
          @click=${i=>{i.stopPropagation(),confirm(`Delete "${a.title}"?`)&&s(a.id)}}
        >&times;</button>
      </div>
    </div>
  `}function O(a){const{activeDashboardHtml:e,activeDashboardManifest:s,isWorking:o}=a;if(!e||!s)return l;const t=D(s.updatedAt);return r`
    <section class="dashboards-container">
      <div class="dashboards-active-header">
        <button
          class="dashboards-back-btn"
          @click=${()=>a.onBack()}
        >&larr; All Dashboards</button>
        <div class="dashboards-active-title-group">
          <span class="dashboards-active-title">${s.title}</span>
          <span class="dashboards-active-meta">
            ${y(new Date(s.updatedAt).getTime())}
            ${t?r` &middot; <span class="dashboard-card-stale">\u{1F7E1} Stale</span>`:l}
          </span>
        </div>
        <button
          class="dashboards-session-btn"
          @click=${()=>a.onOpenSession(s.id)}
        >${o?"Working...":"Edit in Chat"}</button>
        <button
          class="dashboards-refresh-btn"
          @click=${()=>a.onRefresh()}
        >Refresh</button>
      </div>
      <div class="dashboards-content">
        <div class="dashboard-render">
          ${C(I(e))}
        </div>
      </div>
    </section>
  `}function H(a,e,s){const o={all:e.length};for(const t of e){const i=w(t);o[i]=(o[i]??0)+1}return r`
    <div class="dashboards-category-bar">
      ${Object.entries(v).map(([t,i])=>r`
        <button
          class="dashboards-category-btn ${a===t?"active":""}"
          @click=${()=>s(t)}
        >
          ${i.icon} ${i.label}
          ${o[t]?r`<span class="category-count">${o[t]}</span>`:l}
        </button>
      `)}
    </div>
  `}function q(a){const{loading:e,dashboards:s}=a,o=a.categoryFilter??"all",t=a.templates??M,b=[...o==="all"?s??[]:(s??[]).filter(n=>w(n)===o)].sort((n,p)=>n.pinned&&!p.pinned?-1:!n.pinned&&p.pinned?1:new Date(p.updatedAt).getTime()-new Date(n.updatedAt).getTime()),g=o==="all"?t:t.filter(n=>n.category===o),m=(s??[]).length>0;return r`
    <section class="dashboards-container">
      <div class="dashboards-toolbar">
        <span class="dashboards-count">${(s??[]).length} dashboard${(s??[]).length===1?"":"s"}</span>
        <button
          class="dashboards-create-btn"
          @click=${()=>a.onCreateViaChat()}
        >+ Create via Chat</button>
      </div>

      ${m&&a.onCategoryFilter?H(o,s??[],a.onCategoryFilter):l}

      ${e?r`<div class="dashboards-loading"><div class="spinner"></div> Loading dashboards...</div>`:b.length===0&&!m?r`
              <div class="dashboards-empty">
                <div class="dashboards-empty-icon">&#128202;</div>
                <div class="dashboards-empty-title">No dashboards yet</div>
                <div class="dashboards-empty-hint">
                  Dashboards are AI-generated views your ally builds for you.
                  Pick a template below or describe what you want to see.
                </div>
              </div>
              <div class="dashboards-templates-section">
                <h3 class="dashboards-section-title">Start from a template</h3>
                <div class="dashboards-grid">
                  ${t.map(n=>f(n,a.onCreateViaChat))}
                </div>
              </div>
            `:r`
              <div class="dashboards-grid">
                ${b.map(n=>E(n,a.onSelectDashboard,a.onDeleteDashboard,a.onTogglePin))}
              </div>
              ${g.length>0?r`
                <div class="dashboards-templates-section">
                  <h3 class="dashboards-section-title">Create from template</h3>
                  <div class="dashboards-grid dashboards-grid--templates">
                    ${g.map(n=>f(n,a.onCreateViaChat))}
                  </div>
                </div>
              `:l}
            `}
    </section>
  `}function L(a){return a.error?r`
      <section class="dashboards-container">
        <div class="dashboards-error">
          <span class="error-icon">\u26A0</span>
          <p>${a.error}</p>
          <button class="retry-button" @click=${()=>a.onRefresh()}>Retry</button>
        </div>
      </section>
    `:a.activeDashboardHtml&&a.activeDashboardManifest?O(a):q(a)}var R=Object.defineProperty,B=Object.getOwnPropertyDescriptor,c=(a,e,s,o)=>{for(var t=o>1?void 0:o?B(e,s):e,i=a.length-1,b;i>=0;i--)(b=a[i])&&(t=(o?b(e,s,t):b(t))||t);return o&&t&&R(e,s,t),t};let d=class extends ${constructor(){super(...arguments),this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardCategoryFilter=null,this._workingSessionIds=new Set,this._unsubs=[]}createRenderRoot(){return this}get client(){return this.ctx.gateway}get connected(){return this.ctx.connected}connectedCallback(){super.connectedCallback(),this._unsubs.push(u.on("refresh-requested",a=>{a.target==="dashboards"&&this._refresh()})),this._refresh()}disconnectedCallback(){for(const a of this._unsubs)a();this._unsubs=[],super.disconnectedCallback()}render(){const a=this.activeDashboardManifest?.sessionId;return L({connected:this.ctx.connected,loading:this.dashboardsLoading,error:this.dashboardsError,dashboards:this.dashboardsList,activeDashboardId:this.activeDashboardId,activeDashboardHtml:this.activeDashboardHtml,activeDashboardManifest:this.activeDashboardManifest,isWorking:a?this._workingSessionIds.has(a):!1,onSelectDashboard:e=>this._onSelectDashboard(e),onDeleteDashboard:e=>this._onDeleteDashboard(e),onCreateViaChat:e=>this._onCreateViaChat(e),onTogglePin:e=>this._onTogglePin(e),categoryFilter:this.dashboardCategoryFilter??void 0,onCategoryFilter:e=>this._onCategoryFilter(e),onBack:()=>this._onBack(),onRefresh:()=>this._refresh(),onOpenSession:e=>this._onOpenSession(e)})}async _refresh(){await A(this),this.requestUpdate()}async _onSelectDashboard(a){if(await F(this,a),this.requestUpdate(),this.ctx.gateway&&this.ctx.connected)try{const e=await this.ctx.gateway.request("dashboards.openSession",{dashboardId:a});e?.sessionId&&(this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:e.sessionId}),u.emit("chat-navigate",{sessionKey:e.sessionId}))}catch(e){console.error("[Dashboards] Failed to init session on select:",e)}}async _onDeleteDashboard(a){await P(this,a),this.requestUpdate()}async _onTogglePin(a){await T(this,a),this.requestUpdate()}_onCreateViaChat(a){u.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:a??"I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more."})}_onCategoryFilter(a){this.dashboardCategoryFilter=a}_onBack(){this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null}_onOpenSession(a){const e=this.activeDashboardManifest?.sessionId;if(!e){this.ctx.addToast("No session for this dashboard","error");return}this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,u.emit("chat-navigate",{sessionKey:e,tab:"chat"})}};c([k({context:S,subscribe:!0})],d.prototype,"ctx",2);c([h()],d.prototype,"dashboardsList",2);c([h()],d.prototype,"dashboardsLoading",2);c([h()],d.prototype,"dashboardsError",2);c([h()],d.prototype,"activeDashboardId",2);c([h()],d.prototype,"activeDashboardHtml",2);c([h()],d.prototype,"activeDashboardManifest",2);c([h()],d.prototype,"dashboardCategoryFilter",2);c([h()],d.prototype,"_workingSessionIds",2);d=c([_("gm-dashboards")],d);export{d as GmDashboards};
