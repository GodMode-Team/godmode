import{d as $,b as i,A as l,o as C,g as k,r as h,t as _}from"./lit-core-CTInmNPB.js";import{a as u,w as I}from"./index-Bl5fiYGY.js";import{H as S}from"./views-settings-Ct08h9vW.js";import{f as y}from"./ctrl-settings-CAPtX3NX.js";import"./markdown-i_gIkIP3.js";async function E(a,s){if(!a.client||!a.connected){a.dashboardsError="Not connected to gateway";return}a.dashboardsLoading=!0,a.dashboardsError=null;try{const e=await a.client.request("dashboards.list",s?{scope:s}:{});a.dashboardsList=e.dashboards,a.activeDashboardId=e.activeDashboard}catch(e){a.dashboardsError=e instanceof Error?e.message:"Failed to load dashboards"}finally{a.dashboardsLoading=!1}}async function F(a,s){if(!a.client||!a.connected){a.dashboardsError="Not connected to gateway";return}a.dashboardsLoading=!0,a.dashboardsError=null;try{const e=await a.client.request("dashboards.get",{id:s});a.activeDashboardId=s,a.activeDashboardManifest=e.manifest,a.activeDashboardHtml=e.html}catch(e){a.dashboardsError=e instanceof Error?e.message:"Failed to load dashboard"}finally{a.dashboardsLoading=!1}}async function A(a,s){if(!a.client||!a.connected)return;const e=(a.dashboardsList??[]).find(t=>t.id===s);if(!e)return;const r=!e.pinned;try{await a.client.request("dashboards.save",{id:e.id,title:e.title,description:e.description,scope:e.scope,pinned:r}),e.pinned=r,a.dashboardsList=[...a.dashboardsList??[]]}catch(t){a.dashboardsError=t instanceof Error?t.message:"Failed to toggle pin"}}async function L(a,s){if(!a.client||!a.connected)return!1;try{return await a.client.request("dashboards.remove",{id:s}),a.dashboardsList=(a.dashboardsList??[]).filter(e=>e.id!==s),a.activeDashboardId===s&&(a.activeDashboardId=null,a.activeDashboardHtml=null,a.activeDashboardManifest=null),!0}catch(e){return a.dashboardsError=e instanceof Error?e.message:"Failed to delete dashboard",!1}}var q=Object.defineProperty,T=Object.getOwnPropertyDescriptor,c=(a,s,e,r)=>{for(var t=r>1?void 0:r?T(s,e):s,o=a.length-1,b;o>=0;o--)(b=a[o])&&(t=(r?b(s,e,t):b(t))||t);return r&&t&&q(s,e,t),t};const p={all:{icon:"📊",label:"All"},productivity:{icon:"📋",label:"Productivity"},personal:{icon:"🧑",label:"Personal"},business:{icon:"💼",label:"Business"},system:{icon:"⚙️",label:"System"},custom:{icon:"✨",label:"Custom"}},M=[{id:"weekly-impact",name:"Weekly Impact",category:"productivity",description:"Tasks completed, agent outcomes, and trust trends this week",prompt:"Create a weekly impact dashboard. Use these widgets: tasks-summary, queue-status, trust-scores, streak-stats, brief-summary. Show tasks completed vs created, agent queue throughput, trust score trends, and daily streak. Use clean CSS grid with bar charts."},{id:"agent-activity",name:"Agent Activity",category:"system",description:"Queue pipeline, active personas, and trust scores",prompt:"Create an agent activity dashboard. Use these widgets: queue-status, trust-scores, agent-activity. Show queue stats (pending, processing, completed, failed), most active personas, and trust scores by workflow. Use CSS grid layout."},{id:"morning-overview",name:"Morning Overview",category:"productivity",description:"Today's tasks, brief highlights, and queue status",prompt:"Create a morning overview dashboard. Use these widgets: tasks-summary, brief-summary, queue-status, streak-stats. Show today's priorities, daily brief highlights, pending queue items, and your current streak. Use clean CSS grid layout."}];function P(a){return a==="global"?i`<span class="dashboard-card-scope">Global</span>`:i`<span class="dashboard-card-scope">${a}</span>`}function D(a){return Date.now()-new Date(a).getTime()>1440*60*1e3}function w(a){const s=(a.title+" "+(a.description??"")).toLowerCase();return s.includes("health")||s.includes("sleep")||s.includes("oura")||s.includes("energy")||s.includes("goal")?"personal":s.includes("agent")||s.includes("queue")||s.includes("trust")||s.includes("skill")?"system":s.includes("revenue")||s.includes("business")||s.includes("content")||s.includes("metric")?"business":s.includes("task")||s.includes("calendar")||s.includes("morning")||s.includes("impact")||s.includes("weekly")?"productivity":"custom"}function m(a,s){const e=p[a.category]??p.custom;return i`
    <div class="dashboard-card dashboard-card--template">
      <button
        class="dashboard-card-main"
        @click=${()=>s(a.prompt)}
      >
        <div class="dashboard-card-title">${a.name}</div>
        <div class="dashboard-card-desc">${a.description}</div>
        <div class="dashboard-card-meta">
          <span class="dashboard-card-scope">${e.icon} ${e.label}</span>
          <span class="dashboard-card-template-label">Template</span>
        </div>
      </button>
    </div>
  `}function x(a,s,e,r){const t=D(a.updatedAt);return i`
    <div class="dashboard-card ${a.pinned?"dashboard-card--pinned":""}">
      <button
        class="dashboard-card-main"
        @click=${()=>s(a.id)}
      >
        <div class="dashboard-card-title">
          ${a.pinned?i`<span class="pin-icon" title="Pinned">\u{1F4CC}</span>`:l}
          ${a.title}
        </div>
        ${a.description?i`<div class="dashboard-card-desc">${a.description}</div>`:l}
        <div class="dashboard-card-meta">
          ${P(a.scope)}
          <span>${y(new Date(a.updatedAt).getTime())}</span>
          ${t?i`<span class="dashboard-card-stale" title="Last updated over 24 hours ago">\u{1F7E1} Stale</span>`:l}
        </div>
      </button>
      <div class="dashboard-card-actions">
        ${r?i`<button
              class="dashboard-card-pin"
              title="${a.pinned?"Unpin":"Pin"}"
              @click=${o=>{o.stopPropagation(),r(a.id)}}
            >${a.pinned?"📌":"📅"}</button>`:l}
        <button
          class="dashboard-card-delete"
          title="Delete dashboard"
          @click=${o=>{o.stopPropagation(),confirm(`Delete "${a.title}"?`)&&e(a.id)}}
        >&times;</button>
      </div>
    </div>
  `}function H(a){const{activeDashboardHtml:s,activeDashboardManifest:e,isWorking:r}=a;if(!s||!e)return l;const t=D(e.updatedAt);return i`
    <section class="dashboards-container">
      <div class="dashboards-active-header">
        <button
          class="dashboards-back-btn"
          @click=${()=>a.onBack()}
        >&larr; All Dashboards</button>
        <div class="dashboards-active-title-group">
          <span class="dashboards-active-title">${e.title}</span>
          <span class="dashboards-active-meta">
            ${y(new Date(e.updatedAt).getTime())}
            ${t?i` &middot; <span class="dashboard-card-stale">\u{1F7E1} Stale</span>`:l}
          </span>
        </div>
        <button
          class="dashboards-session-btn"
          @click=${()=>a.onOpenSession(e.id)}
        >${r?"Working...":"Edit in Chat"}</button>
        <button
          class="dashboards-refresh-btn"
          @click=${()=>a.onRefresh()}
        >Refresh</button>
      </div>
      <div class="dashboards-content">
        <div class="dashboard-render">
          ${C(S(s))}
        </div>
      </div>
    </section>
  `}function U(a,s,e){const r={all:s.length};for(const t of s){const o=w(t);r[o]=(r[o]??0)+1}return i`
    <div class="dashboards-category-bar">
      ${Object.entries(p).map(([t,o])=>i`
        <button
          class="dashboards-category-btn ${a===t?"active":""}"
          @click=${()=>e(t)}
        >
          ${o.icon} ${o.label}
          ${r[t]?i`<span class="category-count">${r[t]}</span>`:l}
        </button>
      `)}
    </div>
  `}function O(a){const{loading:s,dashboards:e}=a,r=a.categoryFilter??"all",t=a.templates??M,b=[...r==="all"?e??[]:(e??[]).filter(d=>w(d)===r)].sort((d,v)=>d.pinned&&!v.pinned?-1:!d.pinned&&v.pinned?1:new Date(v.updatedAt).getTime()-new Date(d.updatedAt).getTime()),g=r==="all"?t:t.filter(d=>d.category===r),f=(e??[]).length>0;return i`
    <section class="dashboards-container">
      <div class="dashboards-toolbar">
        <span class="dashboards-count">${(e??[]).length} dashboard${(e??[]).length===1?"":"s"}</span>
        <button
          class="dashboards-create-btn"
          @click=${()=>a.onCreateViaChat()}
        >+ Create via Chat</button>
      </div>

      ${f&&a.onCategoryFilter?U(r,e??[],a.onCategoryFilter):l}

      ${s?i`<div class="dashboards-loading"><div class="spinner"></div> Loading dashboards...</div>`:b.length===0&&!f?i`
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
                  ${t.map(d=>m(d,a.onCreateViaChat))}
                </div>
              </div>
            `:i`
              ${b.length===0?i`<div class="dashboards-empty">
                    <div class="dashboards-empty-hint">No dashboards in this category. Try a different filter or create one with the button above.</div>
                  </div>`:i`<div class="dashboards-grid">
                    ${b.map(d=>x(d,a.onSelectDashboard,a.onDeleteDashboard,a.onTogglePin))}
                  </div>`}
              ${g.length>0?i`
                <div class="dashboards-templates-section">
                  <h3 class="dashboards-section-title">Create from template</h3>
                  <div class="dashboards-grid dashboards-grid--templates">
                    ${g.map(d=>m(d,a.onCreateViaChat))}
                  </div>
                </div>
              `:l}
            `}
    </section>
  `}function R(a){return a.error?i`
      <section class="dashboards-container">
        <div class="dashboards-error">
          <span class="error-icon">\u26A0</span>
          <p>${a.error}</p>
          <button class="retry-button" @click=${()=>a.onRefresh()}>Retry</button>
        </div>
      </section>
    `:a.activeDashboardHtml&&a.activeDashboardManifest?H(a):O(a)}let n=class extends ${constructor(){super(...arguments),this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardCategoryFilter=null,this._workingSessionIds=new Set,this._unsubs=[]}createRenderRoot(){return this}get client(){return this.ctx.gateway}get connected(){return this.ctx.connected}connectedCallback(){super.connectedCallback(),this._unsubs.push(u.on("refresh-requested",a=>{a.target==="dashboards"&&this._refresh()})),this._refresh()}disconnectedCallback(){for(const a of this._unsubs)a();this._unsubs=[],super.disconnectedCallback()}render(){const a=this.activeDashboardManifest?.sessionId;return R({connected:this.ctx.connected,loading:this.dashboardsLoading,error:this.dashboardsError,dashboards:this.dashboardsList,activeDashboardId:this.activeDashboardId,activeDashboardHtml:this.activeDashboardHtml,activeDashboardManifest:this.activeDashboardManifest,isWorking:a?this._workingSessionIds.has(a):!1,onSelectDashboard:s=>this._onSelectDashboard(s),onDeleteDashboard:s=>this._onDeleteDashboard(s),onCreateViaChat:s=>this._onCreateViaChat(s),onTogglePin:s=>this._onTogglePin(s),categoryFilter:this.dashboardCategoryFilter??void 0,onCategoryFilter:s=>this._onCategoryFilter(s),onBack:()=>this._onBack(),onRefresh:()=>this._refresh(),onOpenSession:s=>this._onOpenSession(s)})}async _refresh(){await E(this),this.requestUpdate()}async _onSelectDashboard(a){if(await F(this,a),this.requestUpdate(),this.ctx.gateway&&this.ctx.connected)try{const s=await this.ctx.gateway.request("dashboards.openSession",{dashboardId:a});s?.sessionId&&(this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:s.sessionId}),u.emit("chat-navigate",{sessionKey:s.sessionId}))}catch(s){console.error("[Dashboards] Failed to init session on select:",s)}}async _onDeleteDashboard(a){await L(this,a),this.requestUpdate()}async _onTogglePin(a){await A(this,a),this.requestUpdate()}_onCreateViaChat(a){u.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:a??"I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more."})}_onCategoryFilter(a){this.dashboardCategoryFilter=a}_onBack(){this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null}_onOpenSession(a){const s=this.activeDashboardManifest?.sessionId;if(!s){this.ctx.addToast("No session for this dashboard","error");return}this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,u.emit("chat-navigate",{sessionKey:s,tab:"chat"})}};c([k({context:I,subscribe:!0})],n.prototype,"ctx",2);c([h()],n.prototype,"dashboardsList",2);c([h()],n.prototype,"dashboardsLoading",2);c([h()],n.prototype,"dashboardsError",2);c([h()],n.prototype,"activeDashboardId",2);c([h()],n.prototype,"activeDashboardHtml",2);c([h()],n.prototype,"activeDashboardManifest",2);c([h()],n.prototype,"dashboardCategoryFilter",2);c([h()],n.prototype,"_workingSessionIds",2);n=c([_("gm-dashboards")],n);export{n as GmDashboards};
