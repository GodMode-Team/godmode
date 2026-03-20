import{d as h,b as c,A as p,g as m,r as l,t as v}from"./lit-core-CTInmNPB.js";import{a as u,o as f}from"./index-CpSkSSRc.js";import{f as b}from"./ctrl-settings-WnDhxjfx.js";import"./views-settings-Bq31gF_6.js";import"./markdown-i_gIkIP3.js";var g=Object.defineProperty,C=Object.getOwnPropertyDescriptor,r=(n,t,o,i)=>{for(var e=i>1?void 0:i?C(t,o):t,s=n.length-1,d;s>=0;s--)(d=n[s])&&(e=(i?d(t,o,e):d(e))||e);return i&&e&&g(t,o,e),e};let a=class extends h{constructor(){super(...arguments),this._sources=[],this._composioConnections=[],this._composioConfigured=!1,this._loading=!0,this._error=null,this._filter="all",this._connectingApp=null,this._unsubs=[]}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._unsubs.push(u.on("refresh-requested",n=>{n.target==="connections"&&this._load()})),this._load()}disconnectedCallback(){for(const n of this._unsubs)n();this._unsubs=[],super.disconnectedCallback()}async _load(){this._loading=!0,this._error=null;const n=this.ctx?.gateway;if(!n||!this.ctx.connected){this._loading=!1,this._error="Not connected to gateway.";return}try{const[t,o]=await Promise.allSettled([n.request("secondBrain.sources",{}),n.request("composio.status",{})]);if(t.status==="fulfilled"&&(this._sources=t.value.sources??[]),o.status==="fulfilled"){const i=o.value;this._composioConfigured=i.configured??!1,this._composioConnections=i.connections??[]}}catch(t){this._error=t instanceof Error?t.message:String(t)}finally{this._loading=!1}}async _connectViaComposio(n){const t=this.ctx?.gateway;if(t){this._connectingApp=n;try{const o=await t.request("composio.connect",{appName:n});o.redirectUrl?window.open(o.redirectUrl,"_blank"):o.error?this.ctx.addToast(`Connection failed: ${o.error}`,"error"):this.ctx.addToast(`Connection initiated for ${n}`,"info")}catch(o){this.ctx.addToast(`Error: ${o instanceof Error?o.message:String(o)}`,"error")}finally{this._connectingApp=null,setTimeout(()=>{this._load()},2e3)}}}_askAllyToConnect(n){u.emit("chat-navigate",{tab:"chat",draft:`Help me set up the ${n} integration`})}render(){if(this._loading)return c`
        <div class="connections-tab">
          <div class="connections-loading">
            <div class="spinner"></div>
            <span>Loading connections...</span>
          </div>
        </div>
      `;if(this._error)return c`
        <div class="connections-tab">
          <div class="connections-error">
            <span>${this._error}</span>
            <button class="btn btn--sm" @click=${()=>{this._load()}}>Retry</button>
          </div>
        </div>
      `;const n=new Set(this._composioConnections.map(s=>s.appName.toLowerCase())),t=[...this._sources];for(const s of this._composioConnections){const d=s.appName.toLowerCase();t.some(_=>_.id.toLowerCase()===d||_.name.toLowerCase()===d)||t.push({id:s.appName,name:s.appName.charAt(0).toUpperCase()+s.appName.slice(1),type:"composio",status:s.status==="active"?"connected":"available",icon:"🔗",description:`Connected via Composio (${s.authScheme})`})}const o=this._filter==="all"?t:t.filter(s=>s.status===this._filter),i=t.filter(s=>s.status==="connected").length,e=t.length;return c`
      <div class="connections-tab">
        <div class="connections-header">
          <div class="connections-header__left">
            <div class="connections-summary">
              <span class="connections-summary__count">${i}/${e}</span>
              <span class="connections-summary__label">connected</span>
            </div>
          </div>
          <div class="connections-header__right">
            <div class="connections-filters">
              ${["all","connected","available"].map(s=>c`
                  <button
                    class="connections-filter-btn ${this._filter===s?"active":""}"
                    @click=${()=>this._filter=s}
                  >${s==="all"?"All":s==="connected"?"Connected":"Available"}</button>
                `)}
            </div>
            <button class="btn btn--sm" @click=${()=>{this._load()}}>Refresh</button>
          </div>
        </div>

        ${this._composioConfigured?c`<div class="connections-composio-badge">
              <span>\uD83D\uDD0C Composio active</span>
              <span class="connections-composio-badge__detail">${this._composioConnections.length} managed connections</span>
            </div>`:p}

        <div class="connections-grid">
          ${o.length===0?c`<div class="connections-empty">No ${this._filter==="all"?"":this._filter} connections found.</div>`:o.map(s=>this._renderSourceCard(s,n))}
        </div>

        <div class="connections-footer">
          <button class="btn btn--ghost btn--sm" @click=${()=>this._askAllyToConnect("a new service")}>
            Ask ally to connect a service...
          </button>
        </div>
      </div>
    `}_renderSourceCard(n,t){const o=n.status==="connected",i=t.has(n.id.toLowerCase())||n.type==="composio",e=this._connectingApp===n.id;return c`
      <div class="connection-card ${o?"connection-card--connected":"connection-card--available"}">
        <div class="connection-card__header">
          <span class="connection-card__icon">${n.icon}</span>
          <div class="connection-card__title">
            <span class="connection-card__name">${n.name}</span>
            <span class="connection-card__type">${n.type}</span>
          </div>
          <span class="connection-card__status ${o?"connected":"available"}">
            ${o?"Connected":"Available"}
          </span>
        </div>
        <div class="connection-card__body">
          <span class="connection-card__desc">${n.description}</span>
          ${n.stats?c`<span class="connection-card__stats">${n.stats}</span>`:p}
          ${n.lastSync?c`<span class="connection-card__sync">Last sync: ${b(new Date(n.lastSync))}</span>`:p}
        </div>
        ${o?i?c`<div class="connection-card__actions">
                <span class="connection-card__managed">Managed by Composio</span>
              </div>`:p:c`
              <div class="connection-card__actions">
                ${this._composioConfigured?c`<button
                      class="btn btn--sm btn--primary"
                      ?disabled=${e}
                      @click=${()=>{this._connectViaComposio(n.id)}}
                    >${e?"Connecting...":"Connect via Composio"}</button>`:p}
                <button
                  class="btn btn--sm btn--ghost"
                  @click=${()=>this._askAllyToConnect(n.name)}
                >Set up in chat</button>
              </div>
            `}
      </div>
    `}};r([m({context:f,subscribe:!0})],a.prototype,"ctx",2);r([l()],a.prototype,"_sources",2);r([l()],a.prototype,"_composioConnections",2);r([l()],a.prototype,"_composioConfigured",2);r([l()],a.prototype,"_loading",2);r([l()],a.prototype,"_error",2);r([l()],a.prototype,"_filter",2);r([l()],a.prototype,"_connectingApp",2);a=r([v("gm-connections")],a);export{a as GmConnections};
