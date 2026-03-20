import{d as p,b as s,g as h,a as y,r as l,t as m}from"./lit-core-CTInmNPB.js";import{o as u}from"./index-BcndMVLP.js";import"./ctrl-settings-CN1lXpxD.js";import"./views-settings-DtmIM-cW.js";import"./markdown-i_gIkIP3.js";var f=Object.defineProperty,_=Object.getOwnPropertyDescriptor,o=(r,t,a,i)=>{for(var n=i>1?void 0:i?_(t,a):t,c=r.length-1,d;c>=0;c--)(d=r[c])&&(n=(i?d(t,a,n):d(n))||n);return i&&n&&f(t,a,n),n};let e=class extends p{constructor(){super(...arguments),this._ready=!1,this._url="",this._loading=!0,this._error=null,this._iframeError=!1}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._load()}async _load(){this._loading=!0,this._error=null,this._iframeError=!1;const r=this.host?.client??this.ctx?.client;if(!r){this._loading=!1,this._error="Not connected to gateway.";return}try{const t=await r.request("paperclip.dashboardUrl",{});this._ready=t?.ready??!1,this._url=t?.url??""}catch{this._error="Could not reach Paperclip."}finally{this._loading=!1}}_dashboardUrl(){let r="3100";if(this._url)try{const i=new URL(this._url);i.port&&(r=i.port)}catch{}const t=window.location.protocol,a=window.location.hostname;return`${t}//${a}:${r}`}render(){if(this._loading)return s`<div class="my-day-container">
        <div class="my-day-card"><div class="my-day-card-content"><p>Loading team status...</p></div></div>
      </div>`;if(!this._ready)return s`<div class="my-day-container">
        <div class="my-day-card">
          <div class="my-day-card-content">
            <h3 style="margin: 0 0 8px;">Agent Team</h3>
            <p style="color: var(--muted); margin: 0 0 16px;">
              Paperclip orchestrates your AI agent team — multiple specialists working together on complex tasks.
            </p>
            ${this._error?s`<p style="color: var(--danger, #ef4444); margin: 0 0 12px;">${this._error}</p>`:s`<p style="color: var(--muted); margin: 0 0 12px;">
                  Paperclip is not connected. Set <code>PAPERCLIP_URL</code> in your <code>.env</code> to enable multi-agent orchestration.
                </p>`}
            <button class="retry-button" @click=${()=>{this._load()}}>Retry</button>
          </div>
        </div>
      </div>`;const r=this._dashboardUrl();return this._iframeError?s`<div class="my-day-container">
        <div class="my-day-card">
          <div class="my-day-card-content" style="text-align: center; padding: 32px 24px;">
            <h3 style="margin: 0 0 12px;">Paperclip Dashboard</h3>
            <p style="color: var(--muted); margin: 0 0 20px; font-size: 13px;">
              The dashboard couldn't be embedded. Open it in a new tab instead.
            </p>
            <a
              href="${r}"
              target="_blank"
              rel="noopener"
              style="
                display: inline-block;
                padding: 14px 40px;
                background: var(--accent, #f59e0b);
                color: var(--on-accent, #000);
                font-size: 16px;
                font-weight: 600;
                border-radius: 10px;
                text-decoration: none;
              "
            >Open Paperclip Dashboard</a>
          </div>
        </div>
      </div>`:s`<div style="
      display: flex;
      flex-direction: column;
      height: calc(100vh - 16px);
      padding: 0;
      margin: -16px -24px 0;
    ">
      <!-- Full-height iframe -->
      <iframe
        src="${r}"
        style="
          flex: 1;
          width: 100%;
          border: none;
          background: var(--surface, #1a1a1a);
        "
        allow="clipboard-read; clipboard-write"
        @error=${()=>{this._iframeError=!0}}
        @load=${t=>{try{const a=t.target;a.contentDocument?.title===""&&a.contentDocument?.body?.children.length}catch{}}}
      ></iframe>
    </div>`}};o([h({context:u,subscribe:!0})],e.prototype,"ctx",2);o([y({attribute:!1})],e.prototype,"host",2);o([l()],e.prototype,"_ready",2);o([l()],e.prototype,"_url",2);o([l()],e.prototype,"_loading",2);o([l()],e.prototype,"_error",2);o([l()],e.prototype,"_iframeError",2);e=o([m("gm-team")],e);export{e as GmTeam};
