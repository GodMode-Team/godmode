import{b as r,A as l,o as w,d as C,g as k,r as h,t as _}from"./lit-core-CTInmNPB.js";import{a as b,o as S}from"./index-CMubI-u1.js";import{B as I}from"./views-settings-DK3deM1Q.js";import{f as y}from"./ctrl-settings-C2Q1A5fK.js";import{loadDashboards as A,loadDashboard as F,deleteDashboard as T,toggleDashboardPin as M}from"./dashboards-CrT3s0NG.js";import"./markdown-i_gIkIP3.js";const v={all:{icon:"📊",label:"All"},productivity:{icon:"📋",label:"Productivity"},personal:{icon:"🧑",label:"Personal"},business:{icon:"💼",label:"Business"},system:{icon:"⚙️",label:"System"},custom:{icon:"✨",label:"Custom"}},P=[{id:"weekly-impact",name:"Weekly Impact",category:"productivity",description:"Tasks completed, agent outcomes, and trust trends this week",prompt:"Create a weekly impact dashboard. Use these widgets: tasks-summary, queue-status, trust-scores, streak-stats, brief-summary. Show tasks completed vs created, agent queue throughput, trust score trends, and daily streak. Use clean CSS grid with bar charts."},{id:"agent-activity",name:"Agent Activity",category:"system",description:"Queue pipeline, active personas, and trust scores",prompt:"Create an agent activity dashboard. Use these widgets: queue-status, trust-scores, agent-activity. Show queue stats (pending, processing, completed, failed), most active personas, and trust scores by workflow. Use CSS grid layout."},{id:"morning-overview",name:"Morning Overview",category:"productivity",description:"Today's tasks, brief highlights, and queue status",prompt:"Create a morning overview dashboard. Use these widgets: tasks-summary, brief-summary, queue-status, streak-stats. Show today's priorities, daily brief highlights, pending queue items, and your current streak. Use clean CSS grid layout."}];function q(s){return s==="global"?r`<span class="dashboard-card-scope">Global</span>`:r`<span class="dashboard-card-scope">${s}</span>`}function D(s){return Date.now()-new Date(s).getTime()>1440*60*1e3}function $(s){const a=(s.title+" "+(s.description??"")).toLowerCase();return a.includes("health")||a.includes("sleep")||a.includes("oura")||a.includes("energy")||a.includes("goal")?"personal":a.includes("agent")||a.includes("queue")||a.includes("trust")||a.includes("skill")?"system":a.includes("revenue")||a.includes("business")||a.includes("content")||a.includes("metric")?"business":a.includes("task")||a.includes("calendar")||a.includes("morning")||a.includes("impact")||a.includes("weekly")?"productivity":"custom"}function f(s,a){const t=v[s.category]??v.custom;return r`
    <div class="dashboard-card dashboard-card--template">
      <button
        class="dashboard-card-main"
        @click=${()=>a(s.prompt)}
      >
        <div class="dashboard-card-title">${s.name}</div>
        <div class="dashboard-card-desc">${s.description}</div>
        <div class="dashboard-card-meta">
          <span class="dashboard-card-scope">${t.icon} ${t.label}</span>
          <span class="dashboard-card-template-label">Template</span>
        </div>
      </button>
    </div>
  `}function E(s,a,t,i){const e=D(s.updatedAt);return r`
    <div class="dashboard-card ${s.pinned?"dashboard-card--pinned":""}">
      <button
        class="dashboard-card-main"
        @click=${()=>a(s.id)}
      >
        <div class="dashboard-card-title">
          ${s.pinned?r`<span class="pin-icon" title="Pinned">\u{1F4CC}</span>`:l}
          ${s.title}
        </div>
        ${s.description?r`<div class="dashboard-card-desc">${s.description}</div>`:l}
        <div class="dashboard-card-meta">
          ${q(s.scope)}
          <span>${y(new Date(s.updatedAt).getTime())}</span>
          ${e?r`<span class="dashboard-card-stale" title="Last updated over 24 hours ago">\u{1F7E1} Stale</span>`:l}
        </div>
      </button>
      <div class="dashboard-card-actions">
        ${i?r`<button
              class="dashboard-card-pin"
              title="${s.pinned?"Unpin":"Pin"}"
              @click=${o=>{o.stopPropagation(),i(s.id)}}
            >${s.pinned?"📌":"📅"}</button>`:l}
        <button
          class="dashboard-card-delete"
          title="Delete dashboard"
          @click=${o=>{o.stopPropagation(),confirm(`Delete "${s.title}"?`)&&t(s.id)}}
        >&times;</button>
      </div>
    </div>
  `}function x(s){const{activeDashboardHtml:a,activeDashboardManifest:t,isWorking:i}=s;if(!a||!t)return l;const e=D(t.updatedAt);return r`
    <section class="dashboards-container">
      <div class="dashboards-active-header">
        <button
          class="dashboards-back-btn"
          @click=${()=>s.onBack()}
        >&larr; All Dashboards</button>
        <div class="dashboards-active-title-group">
          <span class="dashboards-active-title">${t.title}</span>
          <span class="dashboards-active-meta">
            ${y(new Date(t.updatedAt).getTime())}
            ${e?r` &middot; <span class="dashboard-card-stale">\u{1F7E1} Stale</span>`:l}
          </span>
        </div>
        <button
          class="dashboards-session-btn"
          @click=${()=>s.onOpenSession(t.id)}
        >${i?"Working...":"Edit in Chat"}</button>
        <button
          class="dashboards-refresh-btn"
          @click=${()=>s.onRefresh()}
        >Refresh</button>
      </div>
      <div class="dashboards-content">
        <div class="dashboard-render">
          ${w(I(a))}
        </div>
      </div>
    </section>
  `}function U(s,a,t){const i={all:a.length};for(const e of a){const o=$(e);i[o]=(i[o]??0)+1}return r`
    <div class="dashboards-category-bar">
      ${Object.entries(v).map(([e,o])=>r`
        <button
          class="dashboards-category-btn ${s===e?"active":""}"
          @click=${()=>t(e)}
        >
          ${o.icon} ${o.label}
          ${i[e]?r`<span class="category-count">${i[e]}</span>`:l}
        </button>
      `)}
    </div>
  `}function O(s){const{loading:a,dashboards:t}=s,i=s.categoryFilter??"all",e=s.templates??P,u=[...i==="all"?t??[]:(t??[]).filter(n=>$(n)===i)].sort((n,p)=>n.pinned&&!p.pinned?-1:!n.pinned&&p.pinned?1:new Date(p.updatedAt).getTime()-new Date(n.updatedAt).getTime()),g=i==="all"?e:e.filter(n=>n.category===i),m=(t??[]).length>0;return r`
    <section class="dashboards-container">
      <div class="dashboards-toolbar">
        <span class="dashboards-count">${(t??[]).length} dashboard${(t??[]).length===1?"":"s"}</span>
        <button
          class="dashboards-create-btn"
          @click=${()=>s.onCreateViaChat()}
        >+ Create via Chat</button>
      </div>

      ${m&&s.onCategoryFilter?U(i,t??[],s.onCategoryFilter):l}

      ${a?r`<div class="dashboards-loading"><div class="spinner"></div> Loading dashboards...</div>`:u.length===0&&!m?r`
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
                  ${e.map(n=>f(n,s.onCreateViaChat))}
                </div>
              </div>
            `:r`
              <div class="dashboards-grid">
                ${u.map(n=>E(n,s.onSelectDashboard,s.onDeleteDashboard,s.onTogglePin))}
              </div>
              ${g.length>0?r`
                <div class="dashboards-templates-section">
                  <h3 class="dashboards-section-title">Create from template</h3>
                  <div class="dashboards-grid dashboards-grid--templates">
                    ${g.map(n=>f(n,s.onCreateViaChat))}
                  </div>
                </div>
              `:l}
            `}
    </section>
  `}function L(s){return s.error?r`
      <section class="dashboards-container">
        <div class="dashboards-error">
          <span class="error-icon">\u26A0</span>
          <p>${s.error}</p>
          <button class="retry-button" @click=${()=>s.onRefresh()}>Retry</button>
        </div>
      </section>
    `:s.activeDashboardHtml&&s.activeDashboardManifest?x(s):O(s)}var H=Object.defineProperty,B=Object.getOwnPropertyDescriptor,c=(s,a,t,i)=>{for(var e=i>1?void 0:i?B(a,t):a,o=s.length-1,u;o>=0;o--)(u=s[o])&&(e=(i?u(a,t,e):u(e))||e);return i&&e&&H(a,t,e),e};let d=class extends C{constructor(){super(...arguments),this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardCategoryFilter=null,this._workingSessionIds=new Set,this._unsubs=[]}createRenderRoot(){return this}get client(){return this.ctx.gateway}get connected(){return this.ctx.connected}connectedCallback(){super.connectedCallback(),this._unsubs.push(b.on("refresh-requested",s=>{s.target==="dashboards"&&this._refresh()})),this._refresh()}disconnectedCallback(){for(const s of this._unsubs)s();this._unsubs=[],super.disconnectedCallback()}render(){const s=this.activeDashboardManifest?.sessionId;return L({connected:this.ctx.connected,loading:this.dashboardsLoading,error:this.dashboardsError,dashboards:this.dashboardsList,activeDashboardId:this.activeDashboardId,activeDashboardHtml:this.activeDashboardHtml,activeDashboardManifest:this.activeDashboardManifest,isWorking:s?this._workingSessionIds.has(s):!1,onSelectDashboard:a=>this._onSelectDashboard(a),onDeleteDashboard:a=>this._onDeleteDashboard(a),onCreateViaChat:a=>this._onCreateViaChat(a),onTogglePin:a=>this._onTogglePin(a),categoryFilter:this.dashboardCategoryFilter??void 0,onCategoryFilter:a=>this._onCategoryFilter(a),onBack:()=>this._onBack(),onRefresh:()=>this._refresh(),onOpenSession:a=>this._onOpenSession(a)})}async _refresh(){await A(this),this.requestUpdate()}async _onSelectDashboard(s){if(await F(this,s),this.requestUpdate(),this.ctx.gateway&&this.ctx.connected)try{const a=await this.ctx.gateway.request("dashboards.openSession",{dashboardId:s});a?.sessionId&&(this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:a.sessionId}),b.emit("chat-navigate",{sessionKey:a.sessionId}))}catch(a){console.error("[Dashboards] Failed to init session on select:",a)}}async _onDeleteDashboard(s){await T(this,s),this.requestUpdate()}async _onTogglePin(s){await M(this,s),this.requestUpdate()}_onCreateViaChat(s){b.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:s??"I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more."})}_onCategoryFilter(s){this.dashboardCategoryFilter=s}_onBack(){this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null}_onOpenSession(s){const a=this.activeDashboardManifest?.sessionId;if(!a){this.ctx.addToast("No session for this dashboard","error");return}this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,b.emit("chat-navigate",{sessionKey:a,tab:"chat"})}};c([k({context:S,subscribe:!0})],d.prototype,"ctx",2);c([h()],d.prototype,"dashboardsList",2);c([h()],d.prototype,"dashboardsLoading",2);c([h()],d.prototype,"dashboardsError",2);c([h()],d.prototype,"activeDashboardId",2);c([h()],d.prototype,"activeDashboardHtml",2);c([h()],d.prototype,"activeDashboardManifest",2);c([h()],d.prototype,"dashboardCategoryFilter",2);c([h()],d.prototype,"_workingSessionIds",2);d=c([_("gm-dashboards")],d);export{d as GmDashboards};
