import{d as h,A as d,b as s,g as u,a as g,r as o,t as v}from"./lit-core-CTInmNPB.js";import{w as x}from"./index-Bl5fiYGY.js";import"./ctrl-settings-CAPtX3NX.js";import"./views-settings-Ct08h9vW.js";import"./markdown-i_gIkIP3.js";var f=Object.defineProperty,y=Object.getOwnPropertyDescriptor,a=(e,t,r,n)=>{for(var p=n>1?void 0:n?y(t,r):t,c=e.length-1,l;c>=0;c--)(l=e[c])&&(p=(n?l(t,r,p):l(p))||p);return n&&p&&f(t,r,p),p};const _="http://localhost:3100";let i=class extends h{constructor(){super(...arguments),this._phase="loading",this._url="",this._serverUp=!1,this._configured=!1,this._steps=[],this._error=null,this._iframeError=!1,this._customUrl="",this._showAdvanced=!1,this._agentCount=0,this._wasConnected=!1}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._checkStatus()}willUpdate(e){super.willUpdate(e);const t=this.ctx?.connected??!1;t&&!this._wasConnected&&this._checkStatus(),this._wasConnected=t}get _client(){return this.host?.client??this.ctx?.client}async _checkStatus(){this._phase="loading",this._error=null,this._steps=[];const e=this._client;if(!e){this._phase="error",this._error="Not connected to gateway.";return}try{const t=await e.request("paperclip.dashboardUrl",{});if(t?.ready){this._url=t.url??"",this._agentCount=t.agents?.length??0,this._phase="ready";return}const r=await e.request("paperclip.setup",{action:"check"});this._serverUp=r?.serverUp??!1,this._configured=r?.configured??!1,this._steps=r?.steps??[],this._phase="not-configured"}catch{this._phase="not-configured",this._serverUp=!1,this._configured=!1}}async _quickSetup(){const e=this._client;if(e){this._phase="installing",this._steps=[],this._error=null;try{const t=await e.request("paperclip.setup",{action:"install"});if(this._steps=[...t?.steps??[]],!t?.success){this._phase="error",this._error="Could not start Paperclip server. See details below.";return}this._url=t.url??_,this._phase="seeding";const r=await e.request("paperclip.setup",{action:"seed"});if(this._steps=[...this._steps,...r?.steps??[]],this._agentCount=r?.totalAgents??0,!r?.success){this._phase="error",this._error="Server is running but agent seeding failed.";return}this._phase="ready"}catch(t){this._phase="error",this._error=t instanceof Error?t.message:String(t)}}}async _connectExisting(){const e=this._client;if(!e)return;const t=this._customUrl.trim();if(t){this._phase="installing",this._steps=[],this._error=null;try{const r=await e.request("paperclip.setup",{action:"connect",url:t});if(this._steps=[...r?.steps??[]],!r?.success){this._phase="error",this._error="Could not connect to that server.";return}this._phase="seeding";const n=await e.request("paperclip.setup",{action:"seed"});this._steps=[...this._steps,...n?.steps??[]],this._agentCount=n?.totalAgents??0,this._phase=n?.success?"ready":"error",n?.success||(this._error="Connected but agent seeding failed.")}catch(r){this._phase="error",this._error=r instanceof Error?r.message:String(r)}}}async _seedOnly(){const e=this._client;if(e){this._phase="seeding",this._steps=[],this._error=null;try{const t=await e.request("paperclip.setup",{action:"seed"});this._steps=t?.steps??[],this._agentCount=t?.totalAgents??0,t?.success?this._phase="ready":(this._phase="error",this._error="Agent seeding failed.")}catch(t){this._phase="error",this._error=t instanceof Error?t.message:String(t)}}}_dashboardUrl(){let e="3100";if(this._url)try{const n=new URL(this._url);n.port&&(e=n.port)}catch{}const t=window.location.protocol,r=window.location.hostname;return`${t}//${r}:${e}`}_renderSteps(){return this._steps.length===0?d:s`
      <div style="margin-top: 16px; font-size: 13px;">
        ${this._steps.map(e=>s`
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 0;
            color: ${e.status==="error"?"var(--danger, #ef4444)":e.status==="ok"?"var(--success, #22c55e)":"var(--muted)"};
          ">
            <span>${e.status==="ok"?"✓":e.status==="error"?"✗":"•"}</span>
            <span>${e.step}</span>
            ${e.detail?s`<span style="color: var(--muted); font-size: 12px; margin-left: auto; max-width: 50%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${e.detail}">${e.detail}</span>`:d}
          </div>
        `)}
      </div>
    `}render(){if(this._phase==="loading")return s`<div class="my-day-container">
        <div class="my-day-card"><div class="my-day-card-content"><p>Checking agent team status...</p></div></div>
      </div>`;if(this._phase==="ready"){const e=this._dashboardUrl();return this._iframeError?s`<div class="my-day-container">
          <div class="my-day-card">
            <div class="my-day-card-content" style="text-align: center; padding: 32px 24px;">
              <h3 style="margin: 0 0 12px;">Agent Team Ready</h3>
              <p style="color: var(--muted); margin: 0 0 8px; font-size: 13px;">
                ${this._agentCount} agents configured. Dashboard couldn't be embedded.
              </p>
              <a
                href="${e}"
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
                  margin-top: 12px;
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
        <iframe
          src="${e}"
          style="
            flex: 1;
            width: 100%;
            border: none;
            background: var(--surface, #1a1a1a);
          "
          allow="clipboard-read; clipboard-write"
          @error=${()=>{this._iframeError=!0}}
          @load=${t=>{try{const r=t.target;r.contentDocument?.title===""&&r.contentDocument?.body?.children.length}catch{}}}
        ></iframe>
      </div>`}return this._phase==="installing"||this._phase==="seeding"?s`<div class="my-day-container">
        <div class="my-day-card">
          <div class="my-day-card-content" style="padding: 32px 24px;">
            <h3 style="margin: 0 0 12px;">${this._phase==="installing"?"Starting Paperclip Server...":"Seeding Agent Team..."}</h3>
            <p style="color: var(--muted); margin: 0 0 16px; font-size: 13px;">
              ${this._phase==="installing"?"Installing and starting the Paperclip orchestration server. This may take a minute on first run.":"Creating agents from your GodMode persona roster."}
            </p>
            <div style="
              width: 100%;
              height: 4px;
              background: var(--surface-2, #2a2a2a);
              border-radius: 2px;
              overflow: hidden;
            ">
              <div style="
                height: 100%;
                background: var(--accent, #f59e0b);
                border-radius: 2px;
                animation: pulse-width 2s ease-in-out infinite;
                width: ${this._phase==="seeding"?"70%":"40%"};
              "></div>
            </div>
            ${this._renderSteps()}
          </div>
        </div>
      </div>
      <style>
        @keyframes pulse-width {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      </style>`:this._phase==="error"?s`<div class="my-day-container">
        <div class="my-day-card">
          <div class="my-day-card-content" style="padding: 32px 24px;">
            <h3 style="margin: 0 0 12px;">Setup Issue</h3>
            ${this._error?s`<p style="color: var(--danger, #ef4444); margin: 0 0 16px; font-size: 13px;">${this._error}</p>`:d}
            ${this._renderSteps()}
            <div style="display: flex; gap: 12px; margin-top: 20px;">
              <button
                style="
                  padding: 10px 24px;
                  background: var(--accent, #f59e0b);
                  color: var(--on-accent, #000);
                  border: none;
                  border-radius: 8px;
                  font-weight: 600;
                  cursor: pointer;
                  font-size: 14px;
                "
                @click=${()=>{this._quickSetup()}}
              >Try Again</button>
              <button
                style="
                  padding: 10px 24px;
                  background: transparent;
                  color: var(--muted);
                  border: 1px solid var(--border, #333);
                  border-radius: 8px;
                  cursor: pointer;
                  font-size: 14px;
                "
                @click=${()=>{this._checkStatus()}}
              >Back</button>
            </div>
          </div>
        </div>
      </div>`:s`<div class="my-day-container">
      <div class="my-day-card">
        <div class="my-day-card-content" style="padding: 32px 24px;">
          <!-- Header -->
          <h3 style="margin: 0 0 8px; font-size: 20px;">Agent Team</h3>
          <p style="color: var(--muted); margin: 0 0 24px; font-size: 14px; line-height: 1.5;">
            Paperclip orchestrates your AI agent team — multiple specialists working on complex tasks in parallel.
            Delegate work and get results delivered to your inbox.
          </p>

          <!-- Primary CTA: One-click setup -->
          ${this._serverUp&&this._configured?s`
              <!-- Server running + configured but not ready — just seed -->
              <button
                style="
                  width: 100%;
                  padding: 16px 24px;
                  background: var(--accent, #f59e0b);
                  color: var(--on-accent, #000);
                  border: none;
                  border-radius: 10px;
                  font-weight: 600;
                  font-size: 16px;
                  cursor: pointer;
                  margin-bottom: 12px;
                "
                @click=${()=>{this._seedOnly()}}
              >Seed Agent Team</button>
              <p style="color: var(--muted); font-size: 12px; margin: 0 0 16px; text-align: center;">
                Server is running — this will create agents from your persona roster.
              </p>
            `:this._serverUp?s`
                <!-- Server running but not configured — seed will also write env vars -->
                <button
                  style="
                    width: 100%;
                    padding: 16px 24px;
                    background: var(--accent, #f59e0b);
                    color: var(--on-accent, #000);
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    margin-bottom: 12px;
                  "
                  @click=${()=>{this._seedOnly()}}
                >Connect & Seed Agents</button>
                <p style="color: var(--muted); font-size: 12px; margin: 0 0 16px; text-align: center;">
                  Paperclip server detected. Click to configure and seed agents.
                </p>
              `:s`
                <!-- No server — full setup -->
                <button
                  style="
                    width: 100%;
                    padding: 16px 24px;
                    background: var(--accent, #f59e0b);
                    color: var(--on-accent, #000);
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    margin-bottom: 12px;
                  "
                  @click=${()=>{this._quickSetup()}}
                >Set Up Agent Team</button>
                <p style="color: var(--muted); font-size: 12px; margin: 0 0 16px; text-align: center;">
                  Installs Paperclip locally, starts the server, and creates agents from your persona roster.
                </p>
              `}

          <!-- What you get -->
          <div style="
            background: var(--surface-2, rgba(255,255,255,0.03));
            border-radius: 10px;
            padding: 16px 20px;
            margin-bottom: 16px;
          ">
            <p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; color: var(--text);">What you get:</p>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--muted);">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 16px;">&#x1f465;</span>
                <span>Your persona roster becomes a team of AI agents</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 16px;">&#x1f4cb;</span>
                <span>Delegate complex tasks — agents work in parallel</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 16px;">&#x1f4e5;</span>
                <span>Results delivered to your inbox when complete</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 16px;">&#x1f4ca;</span>
                <span>Full dashboard to monitor agent activity</span>
              </div>
            </div>
          </div>

          <!-- Advanced: Connect to existing server -->
          <div style="border-top: 1px solid var(--border, #333); padding-top: 16px;">
            <button
              style="
                background: none;
                border: none;
                color: var(--muted);
                cursor: pointer;
                font-size: 13px;
                padding: 0;
                display: flex;
                align-items: center;
                gap: 6px;
              "
              @click=${()=>{this._showAdvanced=!this._showAdvanced}}
            >
              <span style="transform: rotate(${this._showAdvanced?"90deg":"0deg"}); transition: transform 0.15s; display: inline-block;">\u25B6</span>
              Connect to existing Paperclip server
            </button>

            ${this._showAdvanced?s`
              <div style="margin-top: 12px; display: flex; gap: 8px;">
                <input
                  type="text"
                  placeholder="http://your-server:3100"
                  .value=${this._customUrl}
                  @input=${e=>{this._customUrl=e.target.value}}
                  style="
                    flex: 1;
                    padding: 10px 14px;
                    background: var(--surface-2, #1a1a1a);
                    color: var(--text, #fff);
                    border: 1px solid var(--border, #333);
                    border-radius: 8px;
                    font-size: 14px;
                    outline: none;
                  "
                />
                <button
                  style="
                    padding: 10px 20px;
                    background: var(--surface-2, #2a2a2a);
                    color: var(--text);
                    border: 1px solid var(--border, #333);
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 14px;
                    white-space: nowrap;
                  "
                  @click=${()=>{this._connectExisting()}}
                  ?disabled=${!this._customUrl.trim()}
                >Connect</button>
              </div>
            `:d}
          </div>

          <!-- Previous check results -->
          ${this._steps.length>0?s`
            <div style="margin-top: 16px; border-top: 1px solid var(--border, #333); padding-top: 12px;">
              <p style="margin: 0 0 8px; font-size: 12px; color: var(--muted);">Current status:</p>
              ${this._renderSteps()}
            </div>
          `:d}
        </div>
      </div>
    </div>`}};a([u({context:x,subscribe:!0})],i.prototype,"ctx",2);a([g({attribute:!1})],i.prototype,"host",2);a([o()],i.prototype,"_phase",2);a([o()],i.prototype,"_url",2);a([o()],i.prototype,"_serverUp",2);a([o()],i.prototype,"_configured",2);a([o()],i.prototype,"_steps",2);a([o()],i.prototype,"_error",2);a([o()],i.prototype,"_iframeError",2);a([o()],i.prototype,"_customUrl",2);a([o()],i.prototype,"_showAdvanced",2);a([o()],i.prototype,"_agentCount",2);i=a([v("gm-team")],i);export{i as GmTeam};
