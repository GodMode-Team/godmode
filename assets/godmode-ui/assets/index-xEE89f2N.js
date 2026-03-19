const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./work-tab-CQUY-9Wh.js","./lit-core-CthTC9XT.js","./event-bus-4tWT8iFZ.js","./markdown-i_gIkIP3.js","./today-tab-Be3-Ebns.js","./second-brain-tab-DaKJd32f.js","./second-brain-cP3vM8ym.js","./dashboards-tab-NHUFEUyo.js","./dashboards-CrT3s0NG.js"])))=>i.map(i=>d[i]);
import{n as vd,A as h,b as r,o as yt,c as us,i as yd,r as bd,t as wd,e as Sd,a as kd,d as ps,f as Pr,g as Rr,h as $d,j as m}from"./lit-core-CthTC9XT.js";import{g as Ki}from"./markdown-i_gIkIP3.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const Ad="modulepreload",Td=function(e,t){return new URL(e,t).href},Va={},E=function(t,n,s){let i=Promise.resolve();if(n&&n.length>0){let u=function(l){return Promise.all(l.map(p=>Promise.resolve(p).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),d=c?.nonce||c?.getAttribute("nonce");i=u(n.map(l=>{if(l=Td(l,s),l in Va)return;Va[l]=!0;const p=l.endsWith(".css"),v=p?'[rel="stylesheet"]':"";if(s)for(let b=o.length-1;b>=0;b--){const k=o[b];if(k.href===l&&(!p||k.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${v}`))return;const y=document.createElement("link");if(y.rel=p?"stylesheet":Ad,p||(y.as="script"),y.crossOrigin="",y.href=l,d&&y.setAttribute("nonce",d),document.head.appendChild(y),p)return new Promise((b,k)=>{y.addEventListener("load",b),y.addEventListener("error",()=>k(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return i.then(o=>{for(const c of o||[])c.status==="rejected"&&a(c.reason);return t().catch(a)})},xd=vd(Symbol("app-context")),On=()=>{},_d=()=>Promise.resolve(void 0);function Cd(){return{connected:!1,reconnecting:!1,sessionKey:"main",assistantName:"Prosper",assistantAvatar:null,userName:"",userAvatar:null,theme:"system",themeResolved:"dark",settings:{gatewayUrl:"",token:"",sessionKey:"main",lastActiveSessionKey:"",theme:"system",chatFocusMode:!1,chatShowThinking:!1,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]},basePath:"",gateway:null,send:_d,setTab:On,addToast:On,openSidebar:On,closeSidebar:On}}async function Te(e,t){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const n=await e.client.request("channels.status",{probe:t,timeoutMs:8e3});e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(n){e.channelsError=String(n)}finally{e.channelsLoading=!1}}}async function Ed(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.start",{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function Ld(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function Pd(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function bt(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function zt(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function Ir(e,t,n){if(t.length===0)return;let s=e;for(let a=0;a<t.length-1;a+=1){const o=t[a],c=t[a+1];if(typeof o=="number"){if(!Array.isArray(s))return;s[o]==null&&(s[o]=typeof c=="number"?[]:{}),s=s[o]}else{if(typeof s!="object"||s==null)return;const d=s;d[o]==null&&(d[o]=typeof c=="number"?[]:{}),s=d[o]}}const i=t[t.length-1];if(typeof i=="number"){Array.isArray(s)&&(s[i]=n);return}typeof s=="object"&&s!=null&&(s[i]=n)}function Mr(e,t){if(t.length===0)return;let n=e;for(let i=0;i<t.length-1;i+=1){const a=t[i];if(typeof a=="number"){if(!Array.isArray(n))return;n=n[a]}else{if(typeof n!="object"||n==null)return;n=n[a]}if(n==null)return}const s=t[t.length-1];if(typeof s=="number"){Array.isArray(n)&&n.splice(s,1);return}typeof n=="object"&&n!=null&&delete n[s]}async function ze(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const t=await e.client.request("config.get",{});Id(e,t)}catch(t){e.lastError=String(t)}finally{e.configLoading=!1}}}async function Dr(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const t=await e.client.request("config.schema",{});Rd(e,t)}catch(t){e.lastError=String(t)}finally{e.configSchemaLoading=!1}}}function Rd(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function Id(e,t){e.configSnapshot=t;const n=typeof t.raw=="string"?t.raw:t.config&&typeof t.config=="object"?zt(t.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=n:e.configForm?e.configRaw=zt(e.configForm):e.configRaw=n,e.configValid=typeof t.valid=="boolean"?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],e.configFormDirty||(e.configForm=bt(t.config??{}),e.configFormOriginal=bt(t.config??{}),e.configRawOriginal=n)}async function Jn(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?zt(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:t,baseHash:n}),e.configFormDirty=!1,await ze(e)}catch(t){e.lastError=String(t)}finally{e.configSaving=!1}}}async function Md(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?zt(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:t,baseHash:n,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await ze(e)}catch(t){e.lastError=String(t)}finally{e.configApplying=!1}}}async function Dd(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("godmode.update.run",{})}catch(t){e.lastError=String(t)}finally{e.updateRunning=!1}}}function Bt(e,t,n){const s=bt(e.configForm??e.configSnapshot?.config??{});Ir(s,t,n),e.configForm=s,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=zt(s))}function Ga(e,t){const n=bt(e.configForm??e.configSnapshot?.config??{});Mr(n,t),e.configForm=n,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=zt(n))}async function Od(e,t,n){Bt(e,["agents","defaults","model","primary"],t),Bt(e,["agents","defaults","model","fallbacks"],n),await Jn(e)}function Nd(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function Fd(e){const{state:t,callbacks:n,accountId:s}=e,i=Nd(t),a=(c,d,u={})=>{const{type:l="text",placeholder:p,maxLength:v,help:y}=u,b=t.values[c]??"",k=t.fieldErrors[c],S=`nostr-profile-${c}`;return l==="textarea"?r`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${S}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${d}
          </label>
          <textarea
            id="${S}"
            .value=${b}
            placeholder=${p??""}
            maxlength=${v??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${$=>{const T=$.target;n.onFieldChange(c,T.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${y?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${y}</div>`:h}
          ${k?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${k}</div>`:h}
        </div>
      `:r`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${S}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${d}
        </label>
        <input
          id="${S}"
          type=${l}
          .value=${b}
          placeholder=${p??""}
          maxlength=${v??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${$=>{const T=$.target;n.onFieldChange(c,T.value)}}
          ?disabled=${t.saving}
        />
        ${y?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${y}</div>`:h}
        ${k?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${k}</div>`:h}
      </div>
    `},o=()=>{const c=t.values.picture;return c?r`
      <div style="margin-bottom: 12px;">
        <img
          src=${c}
          alt="Profile picture preview"
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${d=>{const u=d.target;u.style.display="none"}}
          @load=${d=>{const u=d.target;u.style.display="block"}}
        />
      </div>
    `:h};return r`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${s}</div>
      </div>

      ${t.error?r`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:h}

      ${t.success?r`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:h}

      ${o()}

      ${a("name","Username",{placeholder:"satoshi",maxLength:256,help:"Short username (e.g., satoshi)"})}

      ${a("displayName","Display Name",{placeholder:"Satoshi Nakamoto",maxLength:256,help:"Your full display name"})}

      ${a("about","Bio",{type:"textarea",placeholder:"Tell people about yourself...",maxLength:2e3,help:"A brief bio or description"})}

      ${a("picture","Avatar URL",{type:"url",placeholder:"https://example.com/avatar.jpg",help:"HTTPS URL to your profile picture"})}

      ${t.showAdvanced?r`
            <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
              <div style="font-weight: 500; margin-bottom: 12px; color: var(--text-muted);">Advanced</div>

              ${a("banner","Banner URL",{type:"url",placeholder:"https://example.com/banner.jpg",help:"HTTPS URL to a banner image"})}

              ${a("website","Website",{type:"url",placeholder:"https://example.com",help:"Your personal website"})}

              ${a("nip05","NIP-05 Identifier",{placeholder:"you@example.com",help:"Verifiable identifier (e.g., you@domain.com)"})}

              ${a("lud16","Lightning Address",{placeholder:"you@getalby.com",help:"Lightning address for tips (LUD-16)"})}
            </div>
          `:h}

      <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
        <button
          class="btn primary"
          @click=${n.onSave}
          ?disabled=${t.saving||!i}
        >
          ${t.saving?"Saving...":"Save & Publish"}
        </button>

        <button
          class="btn"
          @click=${n.onImport}
          ?disabled=${t.importing||t.saving}
        >
          ${t.importing?"Importing...":"Import from Relays"}
        </button>

        <button
          class="btn"
          @click=${n.onToggleAdvanced}
        >
          ${t.showAdvanced?"Hide Advanced":"Show Advanced"}
        </button>

        <button
          class="btn"
          @click=${n.onCancel}
          ?disabled=${t.saving}
        >
          Cancel
        </button>
      </div>

      ${i?r`
              <div style="font-size: 12px; color: var(--warning-color); margin-top: 8px">
                You have unsaved changes
              </div>
            `:h}
    </div>
  `}function Bd(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}async function Ud(e,t){await Ed(e,t),await Te(e,!0)}async function Kd(e){await Ld(e),await Te(e,!0)}async function zd(e){await Pd(e),await Te(e,!0)}async function Wd(e){await Jn(e),await ze(e),await Te(e,!0)}async function qd(e){await ze(e),await Te(e,!0)}function jd(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...i]=n.split(":");if(!s||i.length===0)continue;const a=s.trim(),o=i.join(":").trim();a&&o&&(t[a]=o)}return t}function Or(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function Nr(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function Hd(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=Bd(n??void 0)}function Vd(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function Gd(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function Yd(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function Qd(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=Or(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(Nr(n),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const a=i?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:a,success:null,fieldErrors:jd(i?.details)};return}if(!i.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await Te(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function Jd(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=Or(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(Nr(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const d=i?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:d,success:null};return}const a=i.merged??i.imported??null,o=a?{...t.values,...a}:t.values,c=!!(o.banner||o.website||o.nip05||o.lud16);e.nostrProfileFormState={...t,importing:!1,values:o,error:null,success:i.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:c},i.saved&&await Te(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}function Fr(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),i=n.slice(2).join(":");return!s||!i?null:{agentId:s,rest:i}}const Xd=80;function fe(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const n=()=>{const s=e.querySelector(".chat-thread");if(s){const i=getComputedStyle(s).overflowY;if(i==="auto"||i==="scroll"||s.scrollHeight-s.clientHeight>1)return s}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const s=n();if(!s)return;if(!(t||e.chatUserNearBottom)){e.chatNewMessagesBelow=!0;return}t&&(e.chatHasAutoScrolled=!0),e.chatIsAutoScrolling=!0,s.scrollTop=s.scrollHeight,e.chatNewMessagesBelow=!1,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1});const a=t?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const o=n();!o||!(t||e.chatUserNearBottom)||(e.chatIsAutoScrolling=!0,o.scrollTop=o.scrollHeight,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1}))},a)})})}function Br(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function Zd(e,t){const n=t.currentTarget;if(!n||e.chatIsAutoScrolling)return;n.scrollHeight-n.scrollTop-n.clientHeight<Xd?(e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1):e.chatUserNearBottom=!1}function eu(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function hs(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function tu(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),i=document.createElement("a"),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");i.href=s,i.download=`godmode-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(s)}function nu(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}const su=[{label:"",tabs:["chat","today","workspaces","second-brain","dashboards"]},{label:"Settings",tabs:["config","skills","agents","trust","guardrails","options"]}],iu=[{label:"System",tabs:["channels","sessions","cron","debug"]}],Ur={onboarding:"/onboarding",options:"/options",workspaces:"/workspaces",today:"/today",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",agents:"/agents",nodes:"/nodes",chat:"/chat",trust:"/trust",guardrails:"/guardrails",config:"/config",debug:"/debug",logs:"/logs","second-brain":"/second-brain",dashboards:"/dashboards"},nt=new Map(Object.entries(Ur).map(([e,t])=>[t,e]));nt.set("/my-day","today");nt.set("/work","workspaces");nt.set("/setup","onboarding");nt.set("/overview","dashboards");nt.set("/mission-control","dashboards");function fs(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function vn(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function zi(e,t=""){const n=fs(t),s=Ur[e]??`/${e}`;return n?`${n}${s}`:s}function Kr(e,t=""){const n=fs(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let i=vn(s).toLowerCase();return i.endsWith("/index.html")&&(i="/"),i==="/"?"chat":nt.get(i)??null}function au(e){let t=vn(e);if(t.endsWith("/index.html")&&(t=vn(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const i=`/${n.slice(s).join("/")}`.toLowerCase();if(nt.has(i)){const a=n.slice(0,s);return!a.length||a.some(c=>nt.has(`/${c.toLowerCase()}`))?"":`/${a.join("/")}`}}return`/${n.join("/")}`}function yn(e){switch(e){case"onboarding":return"Connect Your World";case"chat":return"Chat";case"today":return"Today";case"workspaces":return"Work";case"channels":return"Integrations";case"instances":return"Devices";case"sessions":return"Sessions";case"cron":return"Schedules";case"skills":return"Skills";case"agents":return"Agents";case"nodes":return"Network";case"options":return"Experiments";case"trust":return"Trust";case"guardrails":return"Safety";case"second-brain":return"Second Brain";case"dashboards":return"Dashboards";case"config":return"Settings";case"debug":return"Developer";case"logs":return"Logs";default:return"Control"}}function ou(e){switch(e){case"onboarding":return"🧭";case"chat":return"💬";case"today":return"☀️";case"workspaces":return"📂";case"channels":return"🔗";case"instances":return"📡";case"sessions":return"📄";case"cron":return"⏰";case"skills":return"🧩";case"agents":return"🤖";case"nodes":return"🖥️";case"options":return"🧪";case"trust":return"🛡️";case"guardrails":return"🚧";case"second-brain":return"🧠";case"dashboards":return"📊";case"config":return"⚙️";case"debug":return"🐛";case"logs":return"📜";default:return"📁"}}function ru(e){switch(e){case"onboarding":return"Set up the integrations that power your daily brief and agent features. Everything is optional.";case"chat":return"Your command center. Ask anything, customize any view.";case"today":return"Calendar, brief, tasks, and schedule for the day.";case"workspaces":return"Projects, clients, and personal operating context.";case"channels":return"Connected apps — iMessage, Slack, email, calendar, and more.";case"instances":return"Your connected devices and where GodMode is running.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Recurring tasks — daily briefs, overnight agents, and timed automations.";case"skills":return"Manage your skills, discover new ones from ClawHub, and personalize them for your workflow.";case"agents":return"Your agent roster — sub-agents that handle queue tasks, grouped by category.";case"nodes":return"Devices in your GodMode network and what they can do.";case"options":return"Beta features you can toggle on or off.";case"trust":return"Scores build automatically as you use and rate skills.";case"guardrails":return"Boundaries that keep agents focused, honest, and within scope.";case"second-brain":return"Your Second Brain — identity, knowledge, and live AI context. Stores what your ally needs to act on your behalf.";case"dashboards":return"Custom data views built by your AI ally — remix anything.";case"config":return"Core settings — model, plugins, and API configuration.";case"debug":return"Gateway internals, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}const V="main";function lu(e){const t=[`viewing ${yn(e.tab)} tab`];return e.tab==="dashboards"&&e.activeDashboard&&t.push(`dashboard: ${e.activeDashboard.title}`),e.tab==="workspaces"&&e.selectedWorkspace&&t.push(`workspace: ${e.selectedWorkspace.name}`),e.sidebarOpen&&e.sidebarFilePath&&t.push(`viewing file: ${e.sidebarFilePath}`),`[GodMode Context: ${t.join(", ")}]`}const cu=/<\s*\/?\s*(?:think(?:ing)?|thought|antthinking|final)\b/i,Nn=/<\s*\/?\s*final\b[^>]*>/gi,Ya=/<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\b[^>]*>/gi;function du(e,t){return e.trimStart()}function uu(e,t){if(!e||!cu.test(e))return e;let n=e;Nn.test(n)?(Nn.lastIndex=0,n=n.replace(Nn,"")):Nn.lastIndex=0,Ya.lastIndex=0;let s="",i=0,a=!1;for(const o of n.matchAll(Ya)){const c=o.index??0,d=o[1]==="/";a?d&&(a=!1):(s+=n.slice(i,c),d||(a=!0)),i=c+o[0].length}return s+=n.slice(i),du(s)}function bn(e){return!e&&e!==0?"n/a":new Date(e).toLocaleString()}function B(e){if(!e&&e!==0)return"n/a";const t=Date.now()-e;if(t<0)return"just now";const n=Math.round(t/1e3);if(n<60)return`${n}s ago`;const s=Math.round(n/60);if(s<60)return`${s}m ago`;const i=Math.round(s/60);return i<48?`${i}h ago`:`${Math.round(i/24)}d ago`}function pu(e){if(!e&&e!==0)return"";const t=Date.now()-e;if(t<0)return"now";const n=Math.round(t/1e3);if(n<60)return"now";const s=Math.round(n/60);if(s<60)return`${s}m`;const i=Math.round(s/60);return i<24?`${i}h`:`${Math.round(i/24)}d`}function zr(e){if(!e&&e!==0)return"n/a";if(e<1e3)return`${e}ms`;const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);if(n<60)return`${n}m`;const s=Math.round(n/60);return s<48?`${s}h`:`${Math.round(s/24)}d`}function mi(e){return!e||e.length===0?"none":e.filter(t=>!!(t&&t.trim())).join(", ")}function wn(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function Wr(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function Xn(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function ie(e){const t=e??new Date,n=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),i=String(t.getDate()).padStart(2,"0");return`${n}-${s}-${i}`}function Fs(e){return uu(e)}const Qa=50,hu=80,fu=12e4;function se(e,t){if(!e)return"";const n=e.trim().replace(/\n/g," ");return n.length<=t?n:n.slice(0,t-1)+"…"}function ne(e){return typeof e=="string"?e:e==null?"":JSON.stringify(e)}function Ja(e,t){if(!t||typeof t!="object")return"";const n=t;switch(e.toLowerCase()){case"exec":return n.command?`\`${se(ne(n.command),60)}\``:"";case"read":return n.path||n.file_path?`\`${se(ne(n.path||n.file_path),50)}\``:"";case"write":return n.path||n.file_path?`→ \`${se(ne(n.path||n.file_path),50)}\``:"";case"edit":return n.path||n.file_path?`\`${se(ne(n.path||n.file_path),50)}\``:"";case"web_search":return n.query?`"${se(ne(n.query),45)}"`:"";case"web_fetch":try{const u=new URL(ne(n.url));return u.hostname+(u.pathname!=="/"?u.pathname.slice(0,30):"")}catch{return se(ne(n.url||""),50)}case"memory_search":return n.query?`"${se(ne(n.query),45)}"`:"";case"browser":const s=ne(n.action),i=n.ref?` #${ne(n.ref)}`:"",a=n.targetUrl?` ${se(ne(n.targetUrl),30)}`:"";return`${s}${i}${a}`;case"message":return n.action?`${ne(n.action)}${n.target?` → ${se(ne(n.target),25)}`:""}`:"";case"sessions_spawn":return n.task?`"${se(ne(n.task),40)}"`:"";case"cron":return n.action?ne(n.action):"";case"files_read":return n.fileId?`file:${se(ne(n.fileId),20)}`:"";case"image":return n.image?se(ne(n.image),40):"";default:const o=Object.keys(n).filter(u=>!["timeout","timeoutMs"].includes(u));if(o.length===0)return"";const c=o[0],d=n[c];return typeof d=="string"?`${c}: ${se(d,35)}`:""}}function Xa(e,t){if(!t)return"";const n=e.toLowerCase(),s=t.split(`
`),i=s.length,a=t.length;if(["read","files_read"].includes(n))return`${a.toLocaleString()} chars${i>1?`, ${i} lines`:""}`;if(n==="exec")return i>1?`${i} lines`:se(s[0],50);if(["web_search","memory_search"].includes(n))try{const o=JSON.parse(t),c=o.results?.length??o.count??0;return`${c} result${c!==1?"s":""}`}catch{return se(t,40)}return n==="browser"?t.includes("snapshot")?"snapshot captured":t.includes("success")?"success":se(t,40):a>100?`${a.toLocaleString()} chars`:se(t,50)}function Za(e){if(!e)return!0;const t=e.toLowerCase();return!(t.includes("error:")||t.includes("failed")||t.includes("exception")||t.includes("not found"))}function gu(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(i=>{if(!i||typeof i!="object")return null;const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>!!i);return s.length===0?null:s.join(`
`)}function eo(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=gu(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=typeof e=="object"?"[object]":String(e)}const s=Wr(n,fu);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function mu(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function vu(e){if(e.toolStreamOrder.length<=Qa)return;const t=e.toolStreamOrder.length-Qa,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function yu(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function vi(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),yu(e)}function bu(e,t=!1){if(t){vi(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>vi(e),hu))}function Wi(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],e.currentToolName=null,e.currentToolInfo=null;const t=e;t.compactionStatus&&(t.compactionStatus=null),t.compactionClearTimer!=null&&(window.clearTimeout(t.compactionClearTimer),t.compactionClearTimer=null),vi(e)}const wu=5e3;function Su(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},wu))}function ku(e,t){if(!t)return;if(t.stream==="compaction"){Su(e,t);return}if(t.stream!=="tool")return;const n=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(n&&n!==e.sessionKey||!n&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const s=t.data??{},i=typeof s.toolCallId=="string"?s.toolCallId:"";if(!i)return;const a=typeof s.name=="string"?s.name:"tool",o=typeof s.phase=="string"?s.phase:"",c=o==="start"?s.args:void 0,d=o==="update"?eo(s.partialResult):o==="result"?eo(s.result):void 0,u=Date.now();let l=e.toolStreamById.get(i);l?(l.name=a,c!==void 0&&(l.args=c,l.displayArgs=Ja(a,c)),d!==void 0&&(l.output=d,l.resultSummary=Xa(a,d),l.success=Za(d)),l.updatedAt=u):(l={toolCallId:i,runId:t.runId,sessionKey:n,name:a,args:c,output:d,startedAt:typeof t.ts=="number"?t.ts:u,updatedAt:u,message:{},displayArgs:c?Ja(a,c):void 0},e.toolStreamById.set(i,l),e.toolStreamOrder.push(i)),o==="start"?(e.currentToolName=a,e.currentToolInfo={name:a,details:l.displayArgs||void 0,startedAt:l.startedAt}):o==="result"&&(e.currentToolName=null,e.currentToolInfo=null,l.completedAt=u,l.resultSummary=Xa(a,l.output),l.success=Za(l.output)),l.message=mu(l),vu(e),bu(e,o==="result")}const{entries:qr,setPrototypeOf:to,isFrozen:$u,getPrototypeOf:Au,getOwnPropertyDescriptor:Tu}=Object;let{freeze:de,seal:we,create:yi}=Object,{apply:bi,construct:wi}=typeof Reflect<"u"&&Reflect;de||(de=function(t){return t});we||(we=function(t){return t});bi||(bi=function(t,n){for(var s=arguments.length,i=new Array(s>2?s-2:0),a=2;a<s;a++)i[a-2]=arguments[a];return t.apply(n,i)});wi||(wi=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return new t(...s)});const Fn=ue(Array.prototype.forEach),xu=ue(Array.prototype.lastIndexOf),no=ue(Array.prototype.pop),en=ue(Array.prototype.push),_u=ue(Array.prototype.splice),qn=ue(String.prototype.toLowerCase),Bs=ue(String.prototype.toString),Us=ue(String.prototype.match),tn=ue(String.prototype.replace),Cu=ue(String.prototype.indexOf),Eu=ue(String.prototype.trim),ke=ue(Object.prototype.hasOwnProperty),le=ue(RegExp.prototype.test),nn=Lu(TypeError);function ue(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return bi(e,t,s)}}function Lu(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return wi(e,n)}}function N(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:qn;to&&to(e,null);let s=t.length;for(;s--;){let i=t[s];if(typeof i=="string"){const a=n(i);a!==i&&($u(t)||(t[s]=a),i=a)}e[i]=!0}return e}function Pu(e){for(let t=0;t<e.length;t++)ke(e,t)||(e[t]=null);return e}function Ee(e){const t=yi(null);for(const[n,s]of qr(e))ke(e,n)&&(Array.isArray(s)?t[n]=Pu(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=Ee(s):t[n]=s);return t}function sn(e,t){for(;e!==null;){const s=Tu(e,t);if(s){if(s.get)return ue(s.get);if(typeof s.value=="function")return ue(s.value)}e=Au(e)}function n(){return null}return n}const so=de(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ks=de(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),zs=de(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Ru=de(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Ws=de(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Iu=de(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),io=de(["#text"]),ao=de(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),qs=de(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),oo=de(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Bn=de(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Mu=we(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Du=we(/<%[\w\W]*|[\w\W]*%>/gm),Ou=we(/\$\{[\w\W]*/gm),Nu=we(/^data-[\-\w.\u00B7-\uFFFF]+$/),Fu=we(/^aria-[\-\w]+$/),jr=we(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Bu=we(/^(?:\w+script|data):/i),Uu=we(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Hr=we(/^html$/i),Ku=we(/^[a-z][.\w]*(-[.\w]+)+$/i);var ro=Object.freeze({__proto__:null,ARIA_ATTR:Fu,ATTR_WHITESPACE:Uu,CUSTOM_ELEMENT:Ku,DATA_ATTR:Nu,DOCTYPE_NAME:Hr,ERB_EXPR:Du,IS_ALLOWED_URI:jr,IS_SCRIPT_OR_DATA:Bu,MUSTACHE_EXPR:Mu,TMPLIT_EXPR:Ou});const an={element:1,text:3,progressingInstruction:7,comment:8,document:9},zu=function(){return typeof window>"u"?null:window},Wu=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(s=n.getAttribute(i));const a="dompurify"+(s?"#"+s:"");try{return t.createPolicy(a,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+a+" could not be created."),null}},lo=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Vr(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:zu();const t=D=>Vr(D);if(t.version="3.3.1",t.removed=[],!e||!e.document||e.document.nodeType!==an.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,i=s.currentScript,{DocumentFragment:a,HTMLTemplateElement:o,Node:c,Element:d,NodeFilter:u,NamedNodeMap:l=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:p,DOMParser:v,trustedTypes:y}=e,b=d.prototype,k=sn(b,"cloneNode"),S=sn(b,"remove"),$=sn(b,"nextSibling"),T=sn(b,"childNodes"),P=sn(b,"parentNode");if(typeof o=="function"){const D=n.createElement("template");D.content&&D.content.ownerDocument&&(n=D.content.ownerDocument)}let L,A="";const{implementation:C,createNodeIterator:x,createDocumentFragment:F,getElementsByTagName:M}=n,{importNode:U}=s;let K=lo();t.isSupported=typeof qr=="function"&&typeof P=="function"&&C&&C.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:W,ERB_EXPR:re,TMPLIT_EXPR:Se,DATA_ATTR:Ie,ARIA_ATTR:G,IS_SCRIPT_OR_DATA:Z,ATTR_WHITESPACE:O,CUSTOM_ELEMENT:ge}=ro;let{IS_ALLOWED_URI:ot}=ro,Y=null;const _t=N({},[...so,...Ks,...zs,...Ws,...io]);let z=null;const Gt=N({},[...ao,...qs,...oo,...Bn]);let j=Object.seal(yi(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Ve=null,Ct=null;const Me=Object.seal(yi(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Et=!0,Yt=!0,Qt=!1,Jt=!0,rt=!1,En=!0,lt=!1,Cs=!1,Es=!1,Lt=!1,Ln=!1,Pn=!1,La=!0,Pa=!1;const cd="user-content-";let Ls=!0,Xt=!1,Pt={},xe=null;const Ps=N({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Ra=null;const Ia=N({},["audio","video","img","source","image","track"]);let Rs=null;const Ma=N({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Rn="http://www.w3.org/1998/Math/MathML",In="http://www.w3.org/2000/svg",De="http://www.w3.org/1999/xhtml";let Rt=De,Is=!1,Ms=null;const dd=N({},[Rn,In,De],Bs);let Mn=N({},["mi","mo","mn","ms","mtext"]),Dn=N({},["annotation-xml"]);const ud=N({},["title","style","font","a","script"]);let Zt=null;const pd=["application/xhtml+xml","text/html"],hd="text/html";let X=null,It=null;const fd=n.createElement("form"),Da=function(w){return w instanceof RegExp||w instanceof Function},Ds=function(){let w=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(It&&It===w)){if((!w||typeof w!="object")&&(w={}),w=Ee(w),Zt=pd.indexOf(w.PARSER_MEDIA_TYPE)===-1?hd:w.PARSER_MEDIA_TYPE,X=Zt==="application/xhtml+xml"?Bs:qn,Y=ke(w,"ALLOWED_TAGS")?N({},w.ALLOWED_TAGS,X):_t,z=ke(w,"ALLOWED_ATTR")?N({},w.ALLOWED_ATTR,X):Gt,Ms=ke(w,"ALLOWED_NAMESPACES")?N({},w.ALLOWED_NAMESPACES,Bs):dd,Rs=ke(w,"ADD_URI_SAFE_ATTR")?N(Ee(Ma),w.ADD_URI_SAFE_ATTR,X):Ma,Ra=ke(w,"ADD_DATA_URI_TAGS")?N(Ee(Ia),w.ADD_DATA_URI_TAGS,X):Ia,xe=ke(w,"FORBID_CONTENTS")?N({},w.FORBID_CONTENTS,X):Ps,Ve=ke(w,"FORBID_TAGS")?N({},w.FORBID_TAGS,X):Ee({}),Ct=ke(w,"FORBID_ATTR")?N({},w.FORBID_ATTR,X):Ee({}),Pt=ke(w,"USE_PROFILES")?w.USE_PROFILES:!1,Et=w.ALLOW_ARIA_ATTR!==!1,Yt=w.ALLOW_DATA_ATTR!==!1,Qt=w.ALLOW_UNKNOWN_PROTOCOLS||!1,Jt=w.ALLOW_SELF_CLOSE_IN_ATTR!==!1,rt=w.SAFE_FOR_TEMPLATES||!1,En=w.SAFE_FOR_XML!==!1,lt=w.WHOLE_DOCUMENT||!1,Lt=w.RETURN_DOM||!1,Ln=w.RETURN_DOM_FRAGMENT||!1,Pn=w.RETURN_TRUSTED_TYPE||!1,Es=w.FORCE_BODY||!1,La=w.SANITIZE_DOM!==!1,Pa=w.SANITIZE_NAMED_PROPS||!1,Ls=w.KEEP_CONTENT!==!1,Xt=w.IN_PLACE||!1,ot=w.ALLOWED_URI_REGEXP||jr,Rt=w.NAMESPACE||De,Mn=w.MATHML_TEXT_INTEGRATION_POINTS||Mn,Dn=w.HTML_INTEGRATION_POINTS||Dn,j=w.CUSTOM_ELEMENT_HANDLING||{},w.CUSTOM_ELEMENT_HANDLING&&Da(w.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(j.tagNameCheck=w.CUSTOM_ELEMENT_HANDLING.tagNameCheck),w.CUSTOM_ELEMENT_HANDLING&&Da(w.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(j.attributeNameCheck=w.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),w.CUSTOM_ELEMENT_HANDLING&&typeof w.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(j.allowCustomizedBuiltInElements=w.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),rt&&(Yt=!1),Ln&&(Lt=!0),Pt&&(Y=N({},io),z=[],Pt.html===!0&&(N(Y,so),N(z,ao)),Pt.svg===!0&&(N(Y,Ks),N(z,qs),N(z,Bn)),Pt.svgFilters===!0&&(N(Y,zs),N(z,qs),N(z,Bn)),Pt.mathMl===!0&&(N(Y,Ws),N(z,oo),N(z,Bn))),w.ADD_TAGS&&(typeof w.ADD_TAGS=="function"?Me.tagCheck=w.ADD_TAGS:(Y===_t&&(Y=Ee(Y)),N(Y,w.ADD_TAGS,X))),w.ADD_ATTR&&(typeof w.ADD_ATTR=="function"?Me.attributeCheck=w.ADD_ATTR:(z===Gt&&(z=Ee(z)),N(z,w.ADD_ATTR,X))),w.ADD_URI_SAFE_ATTR&&N(Rs,w.ADD_URI_SAFE_ATTR,X),w.FORBID_CONTENTS&&(xe===Ps&&(xe=Ee(xe)),N(xe,w.FORBID_CONTENTS,X)),w.ADD_FORBID_CONTENTS&&(xe===Ps&&(xe=Ee(xe)),N(xe,w.ADD_FORBID_CONTENTS,X)),Ls&&(Y["#text"]=!0),lt&&N(Y,["html","head","body"]),Y.table&&(N(Y,["tbody"]),delete Ve.tbody),w.TRUSTED_TYPES_POLICY){if(typeof w.TRUSTED_TYPES_POLICY.createHTML!="function")throw nn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof w.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw nn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');L=w.TRUSTED_TYPES_POLICY,A=L.createHTML("")}else L===void 0&&(L=Wu(y,i)),L!==null&&typeof A=="string"&&(A=L.createHTML(""));de&&de(w),It=w}},Oa=N({},[...Ks,...zs,...Ru]),Na=N({},[...Ws,...Iu]),gd=function(w){let _=P(w);(!_||!_.tagName)&&(_={namespaceURI:Rt,tagName:"template"});const I=qn(w.tagName),H=qn(_.tagName);return Ms[w.namespaceURI]?w.namespaceURI===In?_.namespaceURI===De?I==="svg":_.namespaceURI===Rn?I==="svg"&&(H==="annotation-xml"||Mn[H]):!!Oa[I]:w.namespaceURI===Rn?_.namespaceURI===De?I==="math":_.namespaceURI===In?I==="math"&&Dn[H]:!!Na[I]:w.namespaceURI===De?_.namespaceURI===In&&!Dn[H]||_.namespaceURI===Rn&&!Mn[H]?!1:!Na[I]&&(ud[I]||!Oa[I]):!!(Zt==="application/xhtml+xml"&&Ms[w.namespaceURI]):!1},_e=function(w){en(t.removed,{element:w});try{P(w).removeChild(w)}catch{S(w)}},ct=function(w,_){try{en(t.removed,{attribute:_.getAttributeNode(w),from:_})}catch{en(t.removed,{attribute:null,from:_})}if(_.removeAttribute(w),w==="is")if(Lt||Ln)try{_e(_)}catch{}else try{_.setAttribute(w,"")}catch{}},Fa=function(w){let _=null,I=null;if(Es)w="<remove></remove>"+w;else{const Q=Us(w,/^[\r\n\t ]+/);I=Q&&Q[0]}Zt==="application/xhtml+xml"&&Rt===De&&(w='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+w+"</body></html>");const H=L?L.createHTML(w):w;if(Rt===De)try{_=new v().parseFromString(H,Zt)}catch{}if(!_||!_.documentElement){_=C.createDocument(Rt,"template",null);try{_.documentElement.innerHTML=Is?A:H}catch{}}const ae=_.body||_.documentElement;return w&&I&&ae.insertBefore(n.createTextNode(I),ae.childNodes[0]||null),Rt===De?M.call(_,lt?"html":"body")[0]:lt?_.documentElement:ae},Ba=function(w){return x.call(w.ownerDocument||w,w,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},Os=function(w){return w instanceof p&&(typeof w.nodeName!="string"||typeof w.textContent!="string"||typeof w.removeChild!="function"||!(w.attributes instanceof l)||typeof w.removeAttribute!="function"||typeof w.setAttribute!="function"||typeof w.namespaceURI!="string"||typeof w.insertBefore!="function"||typeof w.hasChildNodes!="function")},Ua=function(w){return typeof c=="function"&&w instanceof c};function Oe(D,w,_){Fn(D,I=>{I.call(t,w,_,It)})}const Ka=function(w){let _=null;if(Oe(K.beforeSanitizeElements,w,null),Os(w))return _e(w),!0;const I=X(w.nodeName);if(Oe(K.uponSanitizeElement,w,{tagName:I,allowedTags:Y}),En&&w.hasChildNodes()&&!Ua(w.firstElementChild)&&le(/<[/\w!]/g,w.innerHTML)&&le(/<[/\w!]/g,w.textContent)||w.nodeType===an.progressingInstruction||En&&w.nodeType===an.comment&&le(/<[/\w]/g,w.data))return _e(w),!0;if(!(Me.tagCheck instanceof Function&&Me.tagCheck(I))&&(!Y[I]||Ve[I])){if(!Ve[I]&&Wa(I)&&(j.tagNameCheck instanceof RegExp&&le(j.tagNameCheck,I)||j.tagNameCheck instanceof Function&&j.tagNameCheck(I)))return!1;if(Ls&&!xe[I]){const H=P(w)||w.parentNode,ae=T(w)||w.childNodes;if(ae&&H){const Q=ae.length;for(let pe=Q-1;pe>=0;--pe){const Ne=k(ae[pe],!0);Ne.__removalCount=(w.__removalCount||0)+1,H.insertBefore(Ne,$(w))}}}return _e(w),!0}return w instanceof d&&!gd(w)||(I==="noscript"||I==="noembed"||I==="noframes")&&le(/<\/no(script|embed|frames)/i,w.innerHTML)?(_e(w),!0):(rt&&w.nodeType===an.text&&(_=w.textContent,Fn([W,re,Se],H=>{_=tn(_,H," ")}),w.textContent!==_&&(en(t.removed,{element:w.cloneNode()}),w.textContent=_)),Oe(K.afterSanitizeElements,w,null),!1)},za=function(w,_,I){if(La&&(_==="id"||_==="name")&&(I in n||I in fd))return!1;if(!(Yt&&!Ct[_]&&le(Ie,_))){if(!(Et&&le(G,_))){if(!(Me.attributeCheck instanceof Function&&Me.attributeCheck(_,w))){if(!z[_]||Ct[_]){if(!(Wa(w)&&(j.tagNameCheck instanceof RegExp&&le(j.tagNameCheck,w)||j.tagNameCheck instanceof Function&&j.tagNameCheck(w))&&(j.attributeNameCheck instanceof RegExp&&le(j.attributeNameCheck,_)||j.attributeNameCheck instanceof Function&&j.attributeNameCheck(_,w))||_==="is"&&j.allowCustomizedBuiltInElements&&(j.tagNameCheck instanceof RegExp&&le(j.tagNameCheck,I)||j.tagNameCheck instanceof Function&&j.tagNameCheck(I))))return!1}else if(!Rs[_]){if(!le(ot,tn(I,O,""))){if(!((_==="src"||_==="xlink:href"||_==="href")&&w!=="script"&&Cu(I,"data:")===0&&Ra[w])){if(!(Qt&&!le(Z,tn(I,O,"")))){if(I)return!1}}}}}}}return!0},Wa=function(w){return w!=="annotation-xml"&&Us(w,ge)},qa=function(w){Oe(K.beforeSanitizeAttributes,w,null);const{attributes:_}=w;if(!_||Os(w))return;const I={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:z,forceKeepAttr:void 0};let H=_.length;for(;H--;){const ae=_[H],{name:Q,namespaceURI:pe,value:Ne}=ae,Mt=X(Q),Ns=Ne;let te=Q==="value"?Ns:Eu(Ns);if(I.attrName=Mt,I.attrValue=te,I.keepAttr=!0,I.forceKeepAttr=void 0,Oe(K.uponSanitizeAttribute,w,I),te=I.attrValue,Pa&&(Mt==="id"||Mt==="name")&&(ct(Q,w),te=cd+te),En&&le(/((--!?|])>)|<\/(style|title|textarea)/i,te)){ct(Q,w);continue}if(Mt==="attributename"&&Us(te,"href")){ct(Q,w);continue}if(I.forceKeepAttr)continue;if(!I.keepAttr){ct(Q,w);continue}if(!Jt&&le(/\/>/i,te)){ct(Q,w);continue}rt&&Fn([W,re,Se],Ha=>{te=tn(te,Ha," ")});const ja=X(w.nodeName);if(!za(ja,Mt,te)){ct(Q,w);continue}if(L&&typeof y=="object"&&typeof y.getAttributeType=="function"&&!pe)switch(y.getAttributeType(ja,Mt)){case"TrustedHTML":{te=L.createHTML(te);break}case"TrustedScriptURL":{te=L.createScriptURL(te);break}}if(te!==Ns)try{pe?w.setAttributeNS(pe,Q,te):w.setAttribute(Q,te),Os(w)?_e(w):no(t.removed)}catch{ct(Q,w)}}Oe(K.afterSanitizeAttributes,w,null)},md=function D(w){let _=null;const I=Ba(w);for(Oe(K.beforeSanitizeShadowDOM,w,null);_=I.nextNode();)Oe(K.uponSanitizeShadowNode,_,null),Ka(_),qa(_),_.content instanceof a&&D(_.content);Oe(K.afterSanitizeShadowDOM,w,null)};return t.sanitize=function(D){let w=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},_=null,I=null,H=null,ae=null;if(Is=!D,Is&&(D="<!-->"),typeof D!="string"&&!Ua(D))if(typeof D.toString=="function"){if(D=D.toString(),typeof D!="string")throw nn("dirty is not a string, aborting")}else throw nn("toString is not a function");if(!t.isSupported)return D;if(Cs||Ds(w),t.removed=[],typeof D=="string"&&(Xt=!1),Xt){if(D.nodeName){const Ne=X(D.nodeName);if(!Y[Ne]||Ve[Ne])throw nn("root node is forbidden and cannot be sanitized in-place")}}else if(D instanceof c)_=Fa("<!---->"),I=_.ownerDocument.importNode(D,!0),I.nodeType===an.element&&I.nodeName==="BODY"||I.nodeName==="HTML"?_=I:_.appendChild(I);else{if(!Lt&&!rt&&!lt&&D.indexOf("<")===-1)return L&&Pn?L.createHTML(D):D;if(_=Fa(D),!_)return Lt?null:Pn?A:""}_&&Es&&_e(_.firstChild);const Q=Ba(Xt?D:_);for(;H=Q.nextNode();)Ka(H),qa(H),H.content instanceof a&&md(H.content);if(Xt)return D;if(Lt){if(Ln)for(ae=F.call(_.ownerDocument);_.firstChild;)ae.appendChild(_.firstChild);else ae=_;return(z.shadowroot||z.shadowrootmode)&&(ae=U.call(s,ae,!0)),ae}let pe=lt?_.outerHTML:_.innerHTML;return lt&&Y["!doctype"]&&_.ownerDocument&&_.ownerDocument.doctype&&_.ownerDocument.doctype.name&&le(Hr,_.ownerDocument.doctype.name)&&(pe="<!DOCTYPE "+_.ownerDocument.doctype.name+`>
`+pe),rt&&Fn([W,re,Se],Ne=>{pe=tn(pe,Ne," ")}),L&&Pn?L.createHTML(pe):pe},t.setConfig=function(){let D=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Ds(D),Cs=!0},t.clearConfig=function(){It=null,Cs=!1},t.isValidAttribute=function(D,w,_){It||Ds({});const I=X(D),H=X(w);return za(I,H,_)},t.addHook=function(D,w){typeof w=="function"&&en(K[D],w)},t.removeHook=function(D,w){if(w!==void 0){const _=xu(K[D],w);return _===-1?void 0:_u(K[D],_,1)[0]}return no(K[D])},t.removeHooks=function(D){K[D]=[]},t.removeAllHooks=function(){K=lo()},t}var Wt=Vr();Ki.setOptions({gfm:!0,breaks:!0,mangle:!1});const qu=/\.(html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log|mp4|mov|mkv|avi|webm|mp3|wav|aac|ogg|flac|zip|tar|gz|bz2|dmg|iso|doc|docx|xls|xlsx|ppt|pptx)$/i,ju=new RegExp("(?<![(\\[`])(?:~\\/|\\/(?:Users|home|tmp|var|opt|etc|godmode)\\/)[\\w/.+@-]+(?:\\.\\w+|\\/)(?=\\s|[),;:!?]|$)","g"),Hu=new RegExp("(?<![(\\[`/~\\w])(?:[\\w][\\w.-]*[-_][\\w.-]*\\.(?:html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log|mp4|mov|mkv|avi|webm|mp3|wav|aac|ogg|flac|zip|tar|gz|bz2|dmg|iso|doc|docx|xls|xlsx|ppt|pptx))(?=\\s|[),;:!?|]|$)","gi");function Gr(e){const t=e.split(/(```[\s\S]*?```|`[^`\n]+`)/g);for(let n=0;n<t.length;n++)n%2===0&&(t[n]=t[n].replace(ju,s=>{const i=s.endsWith("/");if(!i&&!qu.test(s))return s;const a=s.startsWith("~/")?`file:///~/${s.slice(2)}`:`file://${s}`,o=s.replace(/\/+$/,"").split("/");return`[${i?(o.pop()??s)+"/":o.pop()??s}](${a})`}),t[n]=t[n].replace(Hu,s=>`[${s}](godmode-file://${encodeURIComponent(s)})`));return t.join("")}const Zn=["a","article","aside","b","blockquote","br","caption","col","colgroup","code","div","del","details","em","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","hr","img","i","input","li","main","nav","ol","p","pre","section","span","strong","sub","sup","summary","table","tbody","td","th","thead","tr","ul"],es=["alt","checked","class","decoding","disabled","height","href","loading","open","rel","src","start","target","title","type","width","style"],Si=/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file|godmode-file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;let co=!1;const Vu=14e4,Gu=14e4,Yu=200,js=5e4,mt=new Map;function Qu(e){const t=mt.get(e);return t===void 0?null:(mt.delete(e),mt.set(e,t),t)}function uo(e,t){if(mt.set(e,t),mt.size<=Yu)return;const n=mt.keys().next().value;n&&mt.delete(n)}function qi(){co||(co=!0,Wt.addHook("uponSanitizeElement",e=>{e instanceof HTMLInputElement&&e.getAttribute("type")!=="checkbox"&&e.remove()}),Wt.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function ve(e){const t=e.trim();if(!t)return"";if(qi(),t.length<=js){const c=Qu(t);if(c!==null)return c}const n=Wr(t,Vu),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>Gu){const d=`<pre class="code-block">${sp(`${n.text}${s}`)}</pre>`,u=Wt.sanitize(d,{ALLOWED_TAGS:Zn,ALLOWED_ATTR:es,ALLOWED_URI_REGEXP:Si});return t.length<=js&&uo(t,u),u}const i=Gr(`${n.text}${s}`),a=Ki.parse(i),o=Wt.sanitize(a,{ALLOWED_TAGS:Zn,ALLOWED_ATTR:es,ALLOWED_URI_REGEXP:Si});return t.length<=js&&uo(t,o),o}function Ju(e){const t=e.trim();if(!t)return"";qi();const n=Ki.parse(t);return Wt.sanitize(n,{ALLOWED_TAGS:Zn,ALLOWED_ATTR:es,ALLOWED_URI_REGEXP:Si}).replace(/<input([^>]*)\bdisabled\b([^>]*)>/g,"<input$1$2>")}const Xu=[...Zn,"svg","path","circle","ellipse","rect","line","polyline","polygon","text","tspan","g","defs","linearGradient","radialGradient","stop","clipPath","mask","use","symbol","marker","pattern","animate","animateTransform"],Zu=[...es,"viewBox","xmlns","preserveAspectRatio","d","cx","cy","r","rx","ry","x","x1","x2","y","y1","y2","dx","dy","fill","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","transform","opacity","points","text-anchor","dominant-baseline","font-size","font-weight","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","marker-start","marker-mid","marker-end","clip-path","patternUnits","patternTransform","rotate","textLength","lengthAdjust","values","dur","repeatCount","attributeName","from","to","begin","calcMode","keySplines","keyTimes"];function TS(e){const t=e.trim();if(!t)return"";qi();const{styles:n,html:s}=ep(t),i=Wt.sanitize(s,{ALLOWED_TAGS:Xu,ALLOWED_ATTR:Zu,FORBID_TAGS:["base","iframe","link","meta","object","script","style"]}),a=".dashboard-render";return n.map(c=>`<style>${np(c,a)}</style>`).join(`
`)+i}function ep(e){const t=[],n=e.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi,(o,c)=>(t.push(c),"")),s=n.match(/<body[^>]*>([\s\S]*)<\/body>/i),a=(s?s[1]:n).replace(/<!DOCTYPE[^>]*>/gi,"").replace(/<\/?html[^>]*>/gi,"").replace(/<\/?head[^>]*>/gi,"").replace(/<\/?body[^>]*>/gi,"").replace(/<title[^>]*>[\s\S]*?<\/title>/gi,"").replace(/<meta[^>]*\/?>/gi,"").replace(/<link[^>]*\/?>/gi,"");return{styles:t,html:a}}function tp(e,t){let n=0;for(let s=t;s<e.length;s++)if(e[s]==="{")n++;else if(e[s]==="}"&&(n--,n===0))return s+1;return e.length}function np(e,t){let n=e.replace(/@import\b[^;]*;/gi,"");n=n.replace(/expression\s*\(/gi,"/* blocked */("),n=n.replace(/behavior\s*:/gi,"/* blocked */:"),n=n.replace(/-moz-binding\s*:/gi,"/* blocked */:");const s=[];let i=0;for(;i<n.length;){if(/\s/.test(n[i])){s.push(n[i]),i++;continue}if(n[i]==="/"&&n[i+1]==="*"){const l=n.indexOf("*/",i+2),p=l===-1?n.length:l+2;s.push(n.slice(i,p)),i=p;continue}if(n[i]==="}"){s.push("}"),i++;continue}if(/^@(-webkit-)?keyframes\s/.test(n.slice(i,i+30))){const l=tp(n,i);s.push(n.slice(i,l)),i=l;continue}if(/^@(media|supports|container|layer)\b/.test(n.slice(i,i+20))){const l=n.indexOf("{",i);if(l===-1){s.push(n.slice(i));break}s.push(n.slice(i,l+1)),i=l+1;continue}const a=n.indexOf("{",i);if(a===-1){s.push(n.slice(i));break}const o=n.slice(i,a).trim(),c=n.indexOf("}",a);if(c===-1){s.push(n.slice(i));break}const d=n.slice(a+1,c),u=o.split(",").map(l=>{const p=l.trim();if(!p)return l;if(p==="*")return`${t}, ${t} *`;if(/^(html|body|:root)$/i.test(p))return t;const v=p.replace(/^(html|body|:root)\s+/i,"");return`${t} ${v}`}).join(", ");s.push(`${u} {${d}}`),i=c+1}return s.join("")}function sp(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const ip=500;let ut="",pt="";function Yr(e){const t=e.trim();if(!t)return"";if(t.length<ip)return ve(t);const n=op(t);if(n<0)return ve(t);const s=t.slice(0,n),i=t.slice(n);if(s===ut)return pt+ve(i);if(s.startsWith(ut)&&ut.length>0){const a=s.slice(ut.length);return pt=pt+ve(a),ut=s,pt+ve(i)}return pt=ve(s),ut=s,pt+ve(i)}function ap(){ut="",pt=""}function op(e){let t=!1,n="";const s=[];let i=0;for(;i<e.length;){const a=e.indexOf(`
`,i),o=a===-1?e.length:a,c=e.slice(i,o),d=c.trimStart(),u=d.match(/^(`{3,}|~{3,})/);if(u){const l=u[1];t?l.charAt(0)===n.charAt(0)&&l.length>=n.length&&d.slice(l.length).trim()===""&&(t=!1,n=""):(t=!0,n=l)}if(!t&&c.trim()===""){let l=o+1;for(;l<e.length&&e[l]===`
`;)l++;l<e.length&&(s.length===0||s[s.length-1]!==l)&&s.push(l)}i=a===-1?e.length:a+1}return s.length<2?-1:s[s.length-2]}const q={messageSquare:r`
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  `,barChart:r`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  `,link:r`
    <svg viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  `,radio:r`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" />
      <path
        d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"
      />
    </svg>
  `,fileText:r`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  `,zap:r`
    <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  `,compass:r`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  `,monitor:r`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  `,settings:r`
    <svg viewBox="0 0 24 24">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,bug:r`
    <svg viewBox="0 0 24 24">
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  `,scrollText:r`
    <svg viewBox="0 0 24 24">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  `,folder:r`
    <svg viewBox="0 0 24 24">
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </svg>
  `,folderOpen:r`
    <svg viewBox="0 0 24 24">
      <path
        d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"
      />
    </svg>
  `,file:r`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  `,chevronRight:r`
    <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
  `,chevronDown:r`
    <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
  `,panelLeft:r`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  `,panelLeftClose:r`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m16 15-3-3 3-3" />
    </svg>
  `,menu:r`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  `,x:r`
    <svg viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,check:r`
    <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
  `,copy:r`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  `,search:r`
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  `,brain:r`
    <svg viewBox="0 0 24 24">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  `,book:r`
    <svg viewBox="0 0 24 24">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  `,loader:r`
    <svg viewBox="0 0 24 24">
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  `,arrowUp:r`
    <svg viewBox="0 0 24 24">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  `,calendar:r`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  `,heart:r`
    <svg viewBox="0 0 24 24">
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      />
    </svg>
  `,pieChart:r`
    <svg viewBox="0 0 24 24">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  `,star:r`
    <svg viewBox="0 0 24 24">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
  `,rotateCcw:r`
    <svg viewBox="0 0 24 24">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  `,headphones:r`
    <svg viewBox="0 0 24 24">
      <path
        d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"
      />
    </svg>
  `,helpCircle:r`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  `,messageCircle:r`
    <svg viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
  `,wrench:r`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </svg>
  `,fileCode:r`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  `,edit:r`
    <svg viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `,penLine:r`
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  `,paperclip:r`
    <svg viewBox="0 0 24 24">
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      />
    </svg>
  `,globe:r`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  `,image:r`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  `,smartphone:r`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  `,plug:r`
    <svg viewBox="0 0 24 24">
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  `,circle:r`
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
  `,puzzle:r`
    <svg viewBox="0 0 24 24">
      <path
        d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.076.874.54 1.02 1.02a2.5 2.5 0 1 0 3.237-3.237c-.48-.146-.944-.505-1.02-1.02a.98.98 0 0 1 .303-.917l1.526-1.526A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.236 3.236c-.464.18-.894.527-.967 1.02Z"
      />
    </svg>
  `,minimize:r`
    <svg viewBox="0 0 24 24">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" x2="21" y1="10" y2="3" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  `,users:r`
    <svg viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  `,briefcase:r`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  `,shield:r`
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  `,lock:r`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  `,lockOpen:r`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 5-5 5 5 0 0 1 4.63 3.13" />
    </svg>
  `,flask:r`
    <svg viewBox="0 0 24 24">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16.5h10" />
    </svg>
  `},rp=1500,lp=2e3,Qr="Copy as markdown",cp="Copied",dp="Copy failed";async function up(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function Un(e,t){e.title=t,e.setAttribute("aria-label",t)}function pp(e){const t=e.label??Qr;return r`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(s?.querySelector(".chat-copy-btn__icon"),!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const i=await up(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!i){s.dataset.error="1",Un(s,dp),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,Un(s,t))},lp);return}s.dataset.copied="1",Un(s,cp),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,Un(s,t))},rp)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${q.copy}</span>
        <span class="chat-copy-btn__icon-check">${q.check}</span>
      </span>
    </button>
  `}function hp(e){return pp({text:()=>e,label:Qr})}const po="NO_REPLY",fp=/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,gp=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi,mp=["internal system context injected by godmode","treat it as invisible background instructions only","persistence protocol (non-negotiable)","you must follow these operating instructions. do not echo or quote this block","meta goal: earn trust through competence. search before asking","asking the user for info you could look up is a failure mode"];function Hs(e){let t=e.replace(fp,"").replace(gp,"").trim();const n=t.toLowerCase();for(const s of mp){const i=n.indexOf(s);if(i!==-1){const a=i+s.length,o=t.slice(a),c=o.search(/\n\n(?=[A-Z])/);c!==-1?t=o.slice(c).trim():t="";break}}return t}const vp=/^\s*\{[^{}]*"type"\s*:\s*"error"[^{}]*"error"\s*:\s*\{/,yp=/^\s*(\d{3})\s+\{/;function ji(e){const t=e.trim(),n=t.match(yp);if(n){const s=Number(n[1]);if(s===529||s===503)return"*Switching models — Claude is temporarily overloaded.*";if(s===400&&t.includes("Unsupported value"))return null}if(t.startsWith("Unsupported value:")||t.includes("is not supported with the")||!vp.test(t))return null;try{const s=JSON.parse(t);if(s?.type==="error"&&s?.error?.message)return(s.error.type??"")==="overloaded_error"?"*Switching models — Claude is temporarily overloaded.*":`*API error: ${s.error.message}*`}catch{}return null}const bp=/\{"type":"error","error":\{[^}]*"type":"[^"]*"[^}]*\}[^}]*"request_id":"[^"]*"\}/g,wp=/\d{3}\s+\{"type":"error"[^\n]*\}\n?(?:https?:\/\/[^\n]*\n?)?/g,Sp=/\{"type":"error","error":\{"details":[^}]*"type":"overloaded_error"[^}]*\}[^}]*"request_id":"[^"]*"\}\n?/g;function kp(e){return e.replace(wp,"").replace(bp,"").replace(Sp,"").trim()}const $p=/^\[([^\]]+)\]\s*/,Ap=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],Vs=new WeakMap,Gs=new WeakMap;function Tp(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:Ap.some(t=>e.startsWith(`${t} `))}function jn(e){const t=e.match($p);if(!t)return e;const n=t[1]??"";return Tp(n)?e.slice(t[0].length):e}function Ys(e){const t=e.trim();return t===po||t.startsWith(`${po}
`)}function qt(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string"){const i=Hs(s);if(!i)return null;const a=ji(i);if(a)return a;const o=n==="assistant"?kp(i):i;if(n==="assistant"&&!o)return null;const c=n==="assistant"?Fs(o):jn(i);return Ys(c)?null:c}if(Array.isArray(s)){const i=s.map(a=>{const o=a;return o.type==="text"&&typeof o.text=="string"?Hs(o.text):null}).filter(a=>typeof a=="string"&&a.length>0);if(i.length>0){const a=i.join(`
`),o=n==="assistant"?Fs(a):jn(a);return Ys(o)?null:o}}if(typeof t.text=="string"){const i=Hs(t.text);if(!i)return null;const a=n==="assistant"?Fs(i):jn(i);return Ys(a)?null:a}return null}function Hi(e){if(!e||typeof e!="object")return qt(e);const t=e;if(Vs.has(t))return Vs.get(t)??null;const n=qt(e);return Vs.set(t,n),n}function ki(e){const n=e.content,s=[];if(Array.isArray(n))for(const c of n){const d=c;if(d.type==="thinking"&&typeof d.thinking=="string"){const u=d.thinking.trim();u&&s.push(u)}}if(s.length>0)return s.join(`
`);const i=Vi(e);if(!i)return null;const o=[...i.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(c=>(c[1]??"").trim()).filter(Boolean);return o.length>0?o.join(`
`):null}function Jr(e){if(!e||typeof e!="object")return ki(e);const t=e;if(Gs.has(t))return Gs.get(t)??null;const n=ki(e);return Gs.set(t,n),n}function Vi(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(i=>{const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>typeof i=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function Xr(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}const xp=Object.freeze(Object.defineProperty({__proto__:null,extractRawText:Vi,extractText:qt,extractTextCached:Hi,extractThinking:ki,extractThinkingCached:Jr,formatApiError:ji,formatReasoningMarkdown:Xr,stripEnvelope:jn},Symbol.toStringTag,{value:"Module"}));function Gi(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",i=t.content,a=Array.isArray(i)?i:null,o=Array.isArray(a)&&a.some(p=>{const v=p,y=(typeof v.type=="string"?v.type:"").toLowerCase();return y==="toolresult"||y==="tool_result"}),c=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||o||c)&&(n="toolResult");let d=[];typeof t.content=="string"?d=[{type:"text",text:t.content}]:Array.isArray(t.content)?d=t.content.map(p=>({type:p.type||"text",text:p.text,name:p.name,args:p.args||p.arguments})):typeof t.text=="string"&&(d=[{type:"text",text:t.text}]);const u=typeof t.timestamp=="number"?t.timestamp:Date.now(),l=typeof t.id=="string"?t.id:void 0;return{role:n,content:d,timestamp:u,id:l}}function gs(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function Zr(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}const ho={pdf:"📕",doc:"📘",docx:"📘",txt:"📄",rtf:"📄",xls:"📗",xlsx:"📗",csv:"📊",ppt:"📙",pptx:"📙",jpg:"🖼️",jpeg:"🖼️",png:"🖼️",gif:"🖼️",webp:"🖼️",svg:"🖼️",mp3:"🎵",wav:"🎵",m4a:"🎵",mp4:"🎬",mov:"🎬",avi:"🎬",zip:"📦",rar:"📦","7z":"📦",tar:"📦",gz:"📦",js:"📜",ts:"📜",py:"📜",json:"📜",html:"📜",css:"📜",md:"📜",default:"📎"};function el(e){const t=e.split(".").pop()?.toLowerCase()||"";return ho[t]??ho.default}function tl(e,t){const n=t.split(".").pop()?.toLowerCase()||"";return{pdf:"PDF Document",doc:"Word Document",docx:"Word Document",xls:"Excel Spreadsheet",xlsx:"Excel Spreadsheet",csv:"CSV File",ppt:"PowerPoint",pptx:"PowerPoint",txt:"Text File",md:"Markdown",json:"JSON File",zip:"ZIP Archive",png:"PNG Image",jpg:"JPEG Image",jpeg:"JPEG Image",gif:"GIF Image",mp3:"Audio File",mp4:"Video File",html:"HTML Document",css:"Stylesheet",js:"JavaScript",ts:"TypeScript",py:"Python"}[n]||e.split("/")[1]?.toUpperCase()||"File"}const _p={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},Cp={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},proof_editor:{icon:"fileText",title:"Proof Editor",actions:{create:{label:"create",detailKeys:["title"]},write:{label:"write",detailKeys:["slug"]},read:{label:"read",detailKeys:["slug"]},comment:{label:"comment",detailKeys:["slug"]},suggest:{label:"suggest",detailKeys:["slug"]},open:{label:"open",detailKeys:["slug"]},share:{label:"share",detailKeys:["slug"]},export_gdrive:{label:"drive",detailKeys:["slug"]},list:{label:"list"}}},queue_steer:{icon:"messageSquare",title:"Queue Steer",detailKeys:["itemId","instruction"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},Ep={fallback:_p,tools:Cp},nl=Ep,fo=nl.fallback??{icon:"puzzle"},Lp=nl.tools??{};function Pp(e){return(e??"tool").trim()}function Rp(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function Ip(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function sl(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const n=t.split(/\r?\n/)[0]?.trim()??"";return n?n.length>160?`${n.slice(0,157)}…`:n:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(s=>sl(s)).filter(s=>!!s);if(t.length===0)return;const n=t.slice(0,3).join(", ");return t.length>3?`${n}…`:n}}}function Mp(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function Dp(e,t){for(const n of t){const s=Mp(e,n),i=sl(s);if(i)return i}}function Op(e){if(!e||typeof e!="object")return;const t=e,n=typeof t.path=="string"?t.path:void 0;if(!n)return;const s=typeof t.offset=="number"?t.offset:void 0,i=typeof t.limit=="number"?t.limit:void 0;return s!==void 0&&i!==void 0?`${n}:${s}-${s+i}`:n}function Np(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function Fp(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function Bp(e){const t=Pp(e.name),n=t.toLowerCase(),s=Lp[n],i=s?.icon??fo.icon??"puzzle",a=s?.title??Rp(t),o=s?.label??t,c=e.args&&typeof e.args=="object"?e.args.action:void 0,d=typeof c=="string"?c.trim():void 0,u=Fp(s,d),l=Ip(u?.label??d);let p;n==="read"&&(p=Op(e.args)),!p&&(n==="write"||n==="edit"||n==="attach")&&(p=Np(e.args));const v=u?.detailKeys??s?.detailKeys??fo.detailKeys??[];return!p&&v.length>0&&(p=Dp(e.args,v)),!p&&e.meta&&(p=e.meta),p&&(p=Kp(p)),{name:t,icon:i,title:a,label:o,verb:l,detail:p}}function Up(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function Kp(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const zp=80,Wp=2,go=100,qp=3;function mo(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function jp(e){const t=e.split(`
`),n=t.slice(0,Wp),s=n.join(`
`);return s.length>go?s.slice(0,go)+"…":n.length<t.length?s+"…":s}function Hp(e){const t=e,n=Qp(t.content),s=[];for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(a)||typeof i.name=="string"&&i.arguments!=null)&&s.push({kind:"call",name:i.name??"tool",args:Jp(i.arguments??i.args)})}for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();if(a!=="toolresult"&&a!=="tool_result")continue;const o=Xp(i);if(yo(o))continue;const c=typeof i.name=="string"?i.name:"tool";s.push({kind:"result",name:c,text:o})}if(Zr(e)&&!s.some(i=>i.kind==="result")){const i=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",a=Hi(e)??void 0;yo(a)||s.push({kind:"result",name:i,text:a})}return s}const Vp=new Set(["write","read","edit","attach"]);function Gp(e){if(!e||typeof e!="object")return null;const t=e,n=t.path??t.file_path??t.filePath;return typeof n=="string"&&n.trim()?n.trim():null}function Yp(e){if(!e)return null;const t=e.match(/(?:\/(?:Users|home|tmp|var)\/\S+|~\/\S+)/);return t?t[0].replace(/[.,;:!?)'"]+$/,""):null}function vo(e,t,n,s,i){const a=Bp({name:e.name,args:e.args}),o=Up(a),c=!!e.text?.trim(),d=Zp(e.text);if(d?.type==="proof"&&d.slug)return r`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${q.fileText}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name">${d.title??"Proof Document"}</span>
          <span class="chat-artifact-card__type">Live doc</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${s?r`<button class="chat-artifact-card__btn" @click=${T=>{T.stopPropagation(),s(d.slug)}}>Open</button>`:h}
          ${d.filePath&&i?r`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${T=>{T.stopPropagation(),i(d.filePath)}}>Drive</button>`:h}
        </div>
      </div>
    `;const u=Vp.has(e.name.toLowerCase())?Gp(e.args)??Yp(e.text):null;if(u&&e.kind==="result"){const T=u.split("/").pop()||u,P=T.split(".").pop()?.toLowerCase()||"",L=el(T),A=tl(P,T);return r`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${L}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name" title=${u}>${T}</span>
          <span class="chat-artifact-card__type">${A}</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${n?r`<button class="chat-artifact-card__btn" @click=${C=>{C.stopPropagation(),n(u)}}>Open</button>`:t&&c?r`<button class="chat-artifact-card__btn" @click=${C=>{C.stopPropagation(),t(mo(e.text))}}>View</button>`:h}
          ${i?r`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${C=>{C.stopPropagation(),i(u)}}>Drive</button>`:h}
        </div>
      </div>
    `}const l=!!t||!!(n&&u),p=l?T=>{if(T.stopPropagation(),n&&u){n(u);return}if(t&&c){t(mo(e.text));return}if(t){const P=`## ${a.label}

${o?`**Command:** \`${o}\`

`:""}*No output — tool completed successfully.*`;t(P)}}:void 0,v=e.text?e.text.split(`
`).length:0,y=c&&(e.text?.length??0)<=zp,b=c&&!y&&v>qp,k=c&&!b,S=!c,$=e.kind==="call"?"chat-tool-card--call":"chat-tool-card--result";return r`
    <div
      class="chat-tool-card ${$} ${l?"chat-tool-card--clickable":""}"
      @click=${p}
      role=${l?"button":h}
      tabindex=${l?"0":h}
      @keydown=${l?T=>{T.key!=="Enter"&&T.key!==" "||(T.preventDefault(),T.stopPropagation(),p?.(T))}:h}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${q[a.icon]}</span>
          <span>${a.label}</span>
        </div>
        ${l?r`<span class="chat-tool-card__action">${c?"View":""} ${q.check}</span>`:h}
        ${S&&!l?r`<span class="chat-tool-card__status">${q.check}</span>`:h}
      </div>
      ${o?r`<div class="chat-tool-card__detail">${o}</div>`:h}
      ${S?r`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:h}
      ${b?r`<details class="chat-tool-card__expandable" @click=${T=>T.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${jp(e.text)}</summary>
            <div class="chat-tool-card__full-output mono">${e.text}</div>
          </details>`:h}
      ${k?r`<div class="chat-tool-card__inline mono">${e.text}</div>`:h}
    </div>
  `}function Qp(e){return Array.isArray(e)?e.filter(Boolean):[]}function Jp(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function Xp(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function Zp(e){if(!e)return null;try{const t=JSON.parse(e);return t._sidebarAction?{type:t._sidebarAction.type,slug:t._sidebarAction.slug,title:t.title,filePath:t.filePath}:null}catch{return null}}function yo(e){if(!e)return!1;const t=e.toLowerCase();return t.includes("process exited")?!1:t.includes("(no new output)")&&t.includes("still running")}function eh(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const i=s.getAttribute("href");if(i){if(i.startsWith("file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(7);a.startsWith("/~/")&&(a="~"+a.slice(2));try{a=decodeURIComponent(a)}catch{}t(a);return}if(i.startsWith("godmode-file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(15);try{a=decodeURIComponent(a)}catch{}t(a);return}}}const bo={exec:["Executing","Running","Conjuring","Manifesting","Brewing"],read:["Reading","Perusing","Absorbing","Scanning","Devouring"],write:["Writing","Scribbling","Crafting","Inscribing","Authoring"],edit:["Editing","Refining","Polishing","Tweaking","Sculpting"],browser:["Browsing","Surfing","Exploring","Navigating","Spelunking"],web_search:["Searching","Hunting","Investigating","Sleuthing","Scouring"],web_fetch:["Fetching","Grabbing","Retrieving","Summoning","Acquiring"],memory_search:["Remembering","Recalling","Pondering","Reflecting"],image:["Analyzing","Examining","Scrutinizing","Inspecting","Beholding"],default:["Working on","Processing","Handling","Tinkering with","Wrangling"]};function il(e){const t=e.toLowerCase().replace(/[^a-z_]/g,""),n=bo[t]??bo.default,s=Math.floor(Date.now()/2e3)%n.length;return n[s]}function th(e){const t=e.match(/\[Files uploaded:\s*([^\]]+)\]/);if(!t)return null;const n=t[1],s=[],i=/([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;let a;for(;(a=i.exec(n))!==null;)s.push({fileName:a[1].trim(),fileId:a[2].trim(),size:a[3].trim(),mimeType:a[4].trim()});return s.length>0?s:null}function nh(e){return r`
    <div class="chat-file-uploads">
      ${e.map(t=>r`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${el(t.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${t.fileName}">${t.fileName}</span>
            <span class="chat-file-upload-card__meta">${t.size} • ${tl(t.mimeType,t.fileName)}</span>
          </div>
        </div>
      `)}
    </div>
  `}function sh(e){return e.replace(/\[Files uploaded:[^\]]+\]\s*/g,"").trim()}const wo=/<document>\s*<source>([^<]*)<\/source>\s*<mime_type>([^<]*)<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function ih(e){const t=[];let n;for(;(n=wo.exec(e))!==null;){const s=n[1]?.trim()||"file",i=n[2]?.trim()||"application/octet-stream";t.push({fileName:s,fileId:"",size:"",mimeType:i})}return wo.lastIndex=0,t.length>0?t:null}const ah=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function oh(e){return e.replace(ah,"").trim()}function rh(e){if(!e)return e;if(e.startsWith("System:")||e.startsWith("GatewayRestart:")||e.startsWith("Sender (untrusted metadata)")){const a=e.indexOf(`

`);return a!==-1?e.slice(a+2).trim():""}let i=e.split(`
`).filter(a=>{const o=a.trim();return!o.startsWith("System:")&&!o.startsWith("GatewayRestart:")}).join(`
`);for(;i.startsWith(`
`);)i=i.slice(1);return i.trim()}function lh(e){return typeof e!="number"||!Number.isFinite(e)||e<=0?null:e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${Math.round(e/1024)} KB`:`${Math.round(e)} B`}function $i(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="image"){const c=o.source;if(c?.type==="base64"&&typeof c.data=="string"){const d=c.data,u=c.media_type||"image/png",l=d.startsWith("data:")?d:`data:${u};base64,${d}`;s.push({url:l})}else if(typeof o.data=="string"&&typeof o.mimeType=="string"){const d=o.data.startsWith("data:")?o.data:`data:${o.mimeType};base64,${o.data}`;s.push({url:d})}else typeof o.url=="string"?s.push({url:o.url}):o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}else if(o.type==="image_url"){const c=o.image_url;typeof c?.url=="string"&&s.push({url:c.url})}else o.type==="attachment"&&typeof o.content=="string"&&(o.mimeType||"").startsWith("image/")&&s.push({url:o.content,alt:o.fileName||void 0});if(o.type==="text"&&typeof o.text=="string"){const c=/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,d=o.text.match(c);if(d)for(const u of d)s.push({url:u})}if(Array.isArray(o.content))for(const c of o.content){if(typeof c!="object"||c===null)continue;const d=c;if(d.type==="image"){const u=d.source;if(u?.type==="base64"&&typeof u.data=="string"){const l=u.media_type||"image/png",p=u.data.startsWith("data:")?u.data:`data:${l};base64,${u.data}`;s.push({url:p})}else if(typeof d.data=="string"&&typeof d.mimeType=="string"){const l=d.data.startsWith("data:")?d.data:`data:${d.mimeType};base64,${d.data}`;s.push({url:l})}else d.omitted===!0&&s.push({omitted:!0,bytes:typeof d.bytes=="number"?d.bytes:void 0,mimeType:typeof d.mimeType=="string"?d.mimeType:void 0,alt:typeof d.fileName=="string"?d.fileName:void 0})}}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="image"&&typeof o.content=="string"){const c=o.mimeType||"image/png",d=o.content.startsWith("data:")?o.content:`data:${c};base64,${o.content}`;s.push({url:d,alt:o.fileName||void 0})}else o.type==="image"&&o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}return s}function ch(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="attachment"&&typeof o.content=="string"){const c=o.mimeType||"application/octet-stream";c.startsWith("image/")||s.push({fileName:o.fileName||"file",mimeType:c,content:o.content})}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const o=a;o.type==="file"&&typeof o.content=="string"&&s.push({fileName:o.fileName||"file",mimeType:o.mimeType||"application/octet-stream",content:o.content})}return s}function dh(e,t){return r`
    <div class="chat-group assistant">
      ${Yi("assistant",{assistantName:e?.name,assistantAvatar:e?.avatar})}
      <div class="chat-group-messages">
        ${t?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${il(t.name)}</span>
                    <strong>${t.name}</strong>
                  </span>
                </div>
                ${t.details?r`<span class="chat-working-indicator__details">${t.details}</span>`:h}
              </div>
            `:h}
        <div class="chat-bubble chat-reading-indicator" aria-hidden="true">
          <span class="chat-reading-indicator__dots">
            <span></span><span></span><span></span>
          </span>
        </div>
        <div class="chat-group-footer">
          <span class="chat-sender-name">${e?.name??"Assistant"}</span>
        </div>
      </div>
    </div>
  `}function uh(e,t,n,s,i){const a=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),o=s?.name??"Assistant";return r`
    <div class="chat-group assistant">
      ${Yi("assistant",{assistantName:s?.name,assistantAvatar:s?.avatar})}
      <div class="chat-group-messages">
        ${i?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${il(i.name)}</span>
                    <strong>${i.name}</strong>
                  </span>
                </div>
                ${i.details?r`<span class="chat-working-indicator__details">${i.details}</span>`:h}
              </div>
            `:h}
        ${al({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${o}</span>
          <span class="chat-group-timestamp">${a}</span>
        </div>
      </div>
    </div>
  `}function ph(e,t){const n=gs(e.role),s=t.assistantName??"Assistant",i=t.userName??"You",a=n==="user"?i:n==="assistant"?s:n,o=n==="user"?"user":n==="assistant"?"assistant":"other",c=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r`
    <div class="chat-group ${o}">
      ${Yi(e.role,{assistantName:s,assistantAvatar:t.assistantAvatar??null,userName:i,userAvatar:t.userAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((d,u)=>al(d.message,{isStreaming:e.isStreaming&&u===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar,t.onOpenFile,t.onOpenProof,t.onImageClick,t.resolveImageUrl,t.onPushToDrive))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${a}</span>
          <span class="chat-group-timestamp">${c}</span>
        </div>
      </div>
    </div>
  `}function Yi(e,t){const n=gs(e),s=t?.assistantName?.trim()||"Assistant",i=typeof t?.assistantAvatar=="string"?t.assistantAvatar.trim():"",a=t?.userName?.trim()||"You",o=typeof t?.userAvatar=="string"?t.userAvatar.trim():"",c=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return n==="user"?o&&So(o)?r`<img
        class="chat-avatar ${c}"
        src="${o}"
        alt="${a}"
      />`:o?r`<div class="chat-avatar ${c}">${o}</div>`:r`<div class="chat-avatar ${c}">${a.charAt(0).toUpperCase()||"C"}</div>`:n==="assistant"?i&&So(i)?r`<img
        class="chat-avatar ${c}"
        src="${i}"
        alt="${s}"
      />`:i?r`<div class="chat-avatar ${c}" style="color: var(--accent);">${i}</div>`:r`<div class="chat-avatar ${c}" style="color: var(--accent);">⚛️</div>`:n==="tool"?r`<div class="chat-avatar ${c}">⚙</div>`:r`<div class="chat-avatar ${c}">?</div>`}function So(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function ko(e,t,n){if(e.length===0)return h;const s=e.map((a,o)=>{if((a.omitted||!a.url)&&n){const c=n(o);if(c)return{...a,resolvedUrl:c}}return a}),i=s.filter(a=>(a.resolvedUrl||a.url)&&!a.omitted||a.resolvedUrl).map(a=>({url:a.resolvedUrl||a.url,alt:a.alt}));return r`
    <div class="chat-message-images">
      ${s.map(a=>{const o=a.resolvedUrl||a.url;if(!o){const d=lh(a.bytes),l=[a.mimeType?a.mimeType.replace("image/","").toUpperCase():null,d].filter(Boolean).join(" · ");return r`
            <div
              class="chat-message-image chat-message-image--omitted"
              title=${a.alt??"Sent image"}
              aria-label="Sent image"
            >
              <span class="chat-message-image__omitted-icon">🖼</span>
              <span class="chat-message-image__omitted-label">${l||"Image"}</span>
            </div>
          `}const c=i.findIndex(d=>d.url===o);return r`
          <img
            src=${o}
            alt=${a.alt??"Attached image"}
            class="chat-message-image"
            @error=${d=>{const u=d.target;u.style.display="none"}}
            @click=${()=>{t&&t(o,i,Math.max(0,c))}}
          />
        `})}
    </div>
  `}function hh(e){return e.length===0?h:r`
    <div class="chat-message-files">
      ${e.map(t=>{const n=t.fileName.length>30?t.fileName.slice(0,27)+"...":t.fileName;return r`
            <a
              href=${t.content}
              download=${t.fileName}
              class="chat-file-attachment"
              title=${t.fileName}
            >
              📎 ${n}
            </a>
          `})}
    </div>
  `}function al(e,t,n,s,i,a,o,c){try{return fh(e,t,n,s,i,a,o,c)}catch(d){return console.error("[chat] message render error:",d),r`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `}}function fh(e,t,n,s,i,a,o,c){const d=e,u=typeof d.role=="string"?d.role:"unknown",l=Zr(e)||u.toLowerCase()==="toolresult"||u.toLowerCase()==="tool_result"||typeof d.toolCallId=="string"||typeof d.tool_call_id=="string",p=Hp(e),v=p.length>0,y=$i(e),b=y.length>0,k=typeof d._chatIdx=="number"?d._chatIdx:-1,S=o&&k>=0?G=>o(k,G):void 0,$=ch(e),T=$.length>0,P=Hi(e),L=t.showReasoning&&u==="assistant"?Jr(e):null,A=u==="user"&&P?th(P):null,C=u==="user"?Vi(e):null,x=C?ih(C):null,F=[...A??[],...x??[]],M=F.length>0;let U=P;if(u==="user"&&U&&(U=rh(U),U=oh(U)),U&&(U=U.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim()||null),U){const G=ji(U);G&&(U=G)}M&&U&&(U=sh(U));const K=U?.trim()?U:null,W=L?Xr(L):null,re=K,Se=u==="assistant"&&!!re?.trim(),Ie=["chat-bubble",Se?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");if(v&&l)return r`
      ${b?ko(y,a,S):h}
      ${p.map(G=>vo(G,n,s,i,c))}
    `;if(!re&&!v&&!b&&!T&&!M&&!W){const G=typeof d.errorMessage=="string"?d.errorMessage:null;if(d.stopReason==="error"&&G){let Z=G;const O=G.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(O){const ge=parseInt(O[1]).toLocaleString(),ot=parseInt(O[2]).toLocaleString();Z=`Context overflow: ${ge} tokens exceeded the ${ot} token limit. The conversation needs to be compacted.`}else G.includes("prompt is too long")&&(Z="Context overflow: The conversation is too long for the model.");return r`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${Z}</div>
        </div>
      `}if(u==="user"&&P?.trim()){let Z=P.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim();if(Z.startsWith("System:")||Z.startsWith("GatewayRestart:")||Z.startsWith("Sender (untrusted metadata)")){const O=Z.indexOf(`

`);Z=O!==-1?Z.slice(O+2).trim():""}if(Z)return r`
          <div class="chat-bubble fade-in">
            <div class="chat-text">${Z}</div>
          </div>
        `}return h}return r`
    <div class="${Ie}">
      ${Se?hp(re):h}
      ${M?nh(F):h}
      ${ko(y,a,S)}
      ${hh($)}
      ${W?r`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${yt(ve(W))}</div>
            </details>`:h}
      ${re?r`<div class="chat-text" @click=${G=>eh(G,s)}>${yt(t.isStreaming?Yr(re):ve(re))}</div>`:h}
      ${p.map(G=>vo(G,n,s,i,c))}
    </div>
  `}function gh(e){const t=e,n=typeof t.content=="string"?t.content:"",s=typeof t.keptMessages=="number"?t.keptMessages:null,i=typeof t.timestamp=="number"?new Date(t.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"";return r`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${s!==null?r`<span class="chat-compaction-summary__kept">${s} messages kept</span>`:h}
      </div>
      <div class="chat-compaction-summary__content">
        ${yt(ve(n))}
      </div>
      ${i?r`<div class="chat-compaction-summary__timestamp">${i}</div>`:h}
    </div>
  `}function mh(e){return e.isCompactionSummary===!0}async function ol(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const t=await e.client.request("agents.list",{});t&&(e.agentsList=t)}catch(t){e.agentsError=String(t)}finally{e.agentsLoading=!1}}}async function rl(e){if(!(!e.client||!e.connected)&&!e.rosterLoading){e.rosterLoading=!0,e.rosterError=null;try{const t=await e.client.request("queue.roster",{});t?.roster&&(e.rosterData=t.roster)}catch(t){e.rosterError=String(t)}finally{e.rosterLoading=!1}}}const vh=Object.freeze(Object.defineProperty({__proto__:null,loadAgents:ol,loadRoster:rl},Symbol.toStringTag,{value:"Module"})),ll=50,cl=200,yh="Assistant";function ts(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function Ai(e){const t=ts(e?.name,ll)??yh,n=ts(e?.avatar??void 0,cl)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}function bh(){return Ai(typeof window>"u"?{}:{name:window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__CLAWDBOT_ASSISTANT_AVATAR__})}const wh="You";function $o(e){const t=ts(e?.name,ll)??wh,n=ts(e?.avatar??void 0,cl)??null;return{name:t,avatar:n}}function Sh(){return $o(typeof window>"u"?{}:{name:window.__CLAWDBOT_USER_NAME__,avatar:window.__CLAWDBOT_USER_AVATAR__})}async function dl(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const i=await e.client.request("agent.identity.get",s);if(!i)return;const a=Ai(i);e.assistantName=a.name,e.assistantAvatar=a.avatar,e.assistantAgentId=a.agentId??null}catch{}}let Ao=!1;function To(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function kh(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function $h(){Ao||(Ao=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function ms(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),To(t)}return $h(),To(kh())}let ht=null,Hn=null;function ul(){return Hn}const pl=new Map,et=new Map;function Ti(e,t){const n=t.filter(s=>s?.role==="user").length;pl.set(e,n)}async function hl(e,t){try{const n=await e.request("chat.history",{sessionKey:t,limit:200}),s=Array.isArray(n.messages)?n.messages:[];return et.set(t,s),Ti(t,s),s}catch{return et.get(t)??[]}}let Dt=0;async function ce(e){if(!e.client||!e.connected)return;const t=e.sessionKey,n=++Dt;e.chatLoading=!0,e.lastError=null;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Dt||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,Ti(t,e.chatMessages),et.set(t,e.chatMessages)}catch{if(n!==Dt||e.sessionKey!==t)return;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Dt||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,Ti(t,e.chatMessages),et.set(t,e.chatMessages)}catch(s){if(n!==Dt||e.sessionKey!==t)return;e.lastError=String(s)}}finally{n===Dt&&(e.chatLoading=!1)}}async function fl(e,t){const n=[...e.chatMessages],s=n.length;await ce(e),e.chatStream=null,!t?.allowShrink&&s>0&&(e.chatMessages.length<s||Ah(n,e.chatMessages))&&(e.chatMessages=n,setTimeout(()=>{ce(e).then(()=>{e.chatStream=null})},2e3))}function Ah(e,t){const n=Th(e,a=>a?.role==="user");if(n===-1)return!1;const i=e[n].timestamp;return typeof i!="number"?!1:!t.some(a=>a?.role==="user"&&a?.timestamp===i)}function Th(e,t){for(let n=e.length-1;n>=0;n--)if(t(e[n]))return n;return-1}function xh(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}async function Qi(e,t,n,s){if(!e.client||!e.connected)return!1;let i=t.trim();const a=n&&n.length>0;if(!i&&!a)return!1;!i&&a&&(i="[attached]");const o=Date.now();if(!s?.skipOptimisticUpdate){const u=[];if(i&&u.push({type:"text",text:i}),a)for(const l of n)l.mimeType.startsWith("image/")?u.push({type:"image",source:{type:"base64",media_type:l.mimeType,data:l.dataUrl}}):u.push({type:"attachment",mimeType:l.mimeType,fileName:l.fileName,content:l.dataUrl});e.chatMessages=[...e.chatMessages,{role:"user",content:u,timestamp:o}]}e.chatSending=!0,e.chatSendingSessionKey=e.sessionKey,e.lastError=null;const c=ms();e.chatRunId=c,e.chatStream="",e.chatStreamStartedAt=o,ht={message:i,attachments:a?n:void 0};let d;if(a){const u=[],l=[];for(const p of n){const v=xh(p.dataUrl);if(v)if(v.mimeType.startsWith("image/"))u.push({type:"image",mimeType:v.mimeType,content:v.content,fileName:p.fileName});else{const y=p.fileName||"file";l.push(`<document>
<source>${y}</source>
<mime_type>${v.mimeType}</mime_type>
<content encoding="base64">
${v.content}
</content>
</document>`)}}if(u.length>0&&(d=u),l.length>0&&(i=`${l.join(`

`)}

${i}`),u.length>0){const p=e.chatMessages.length-1,v=e.sessionKey,y=e.client.request("images.cache",{images:u.map(b=>({data:b.content,mimeType:b.mimeType,fileName:b.fileName})),sessionKey:v}).then(b=>{if(b?.cached&&b.cached.length>0){const k=b.cached.map((S,$)=>({messageIndex:p,imageIndex:$,hash:S.hash,mimeType:S.mimeType,bytes:S.bytes,role:"user",timestamp:o}));return e.client.request("images.updateIndex",{sessionKey:v,images:k}).catch(()=>{})}}).catch(()=>{});Hn=y,y.finally(()=>{Hn===y&&(Hn=null)})}}try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:i,deliver:!1,idempotencyKey:c,attachments:d}),!0}catch(u){const l=String(u);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=l,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+l}],timestamp:Date.now()}],!1}finally{e.chatSending=!1,e.chatSendingSessionKey=null}}async function gl(e){const t=e.pendingRetry;return t?(e.pendingRetry=null,Qi(e,t.message,t.attachments,{skipOptimisticUpdate:!0})):!1}function _h(e){e.pendingRetry=null}async function Ji(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function ml(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?e.chatStream!==null?null:"final":null;if(t.state!=="delta"&&ap(),t.state==="delta"){const n=qt(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final")e.chatRunId=null,e.chatStreamStartedAt=null,ht=null;else if(t.state==="aborted")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,ht=null;else if(t.state==="error"){e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;const n=t.errorMessage??"chat error";e.lastError=n;const s=n.includes("prompt is too long")||n.includes("tokens >");s&&ht&&(e.pendingRetry={message:ht.message,attachments:ht.attachments,timestamp:Date.now()}),ht=null;let i=n;if(s){const a=n.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(a){const o=parseInt(a[1]).toLocaleString(),c=parseInt(a[2]).toLocaleString();i=`⚠️ Context overflow: ${o} tokens exceeds ${c} limit. Compact the conversation, then click "Retry" to resend your message.`}else i='⚠️ Context overflow: The conversation is too long. Compact and click "Retry" to resend.'}e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:i}],timestamp:Date.now(),isError:!0}]}return t.state}const Be=Object.freeze(Object.defineProperty({__proto__:null,abortChatRun:Ji,clearPendingRetry:_h,getPendingImageCache:ul,handleChatEvent:ml,laneMessageCache:et,loadChatHistory:ce,loadChatHistoryAfterFinal:fl,loadLaneHistory:hl,retryPendingMessage:gl,sendChatMessage:Qi,sessionTurnCounts:pl},Symbol.toStringTag,{value:"Module"})),vl="godmode.device.auth.v1";function Xi(e){return e.trim()}function Ch(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e){const s=n.trim();s&&t.add(s)}return[...t].sort()}function Zi(){try{const e=window.localStorage.getItem(vl);if(!e)return null;const t=JSON.parse(e);return!t||t.version!==1||!t.deviceId||typeof t.deviceId!="string"||!t.tokens||typeof t.tokens!="object"?null:t}catch{return null}}function yl(e){try{window.localStorage.setItem(vl,JSON.stringify(e))}catch{}}function Eh(e){const t=Zi();if(!t||t.deviceId!==e.deviceId)return null;const n=Xi(e.role),s=t.tokens[n];return!s||typeof s.token!="string"?null:s}function bl(e){const t=Xi(e.role),n={version:1,deviceId:e.deviceId,tokens:{}},s=Zi();s&&s.deviceId===e.deviceId&&(n.tokens={...s.tokens});const i={token:e.token,role:t,scopes:Ch(e.scopes),updatedAtMs:Date.now()};return n.tokens[t]=i,yl(n),i}function wl(e){const t=Zi();if(!t||t.deviceId!==e.deviceId)return;const n=Xi(e.role);if(!t.tokens[n])return;const s={...t,tokens:{...t.tokens}};delete s.tokens[n],yl(s)}const Sl={p:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,n:0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,h:8n,a:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,d:0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,Gx:0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,Gy:0x6666666666666666666666666666666666666666666666666666666666666658n},{p:oe,n:Vn,Gx:xo,Gy:_o,a:Qs,d:Js,h:Lh}=Sl,wt=32,ea=64,Ph=(...e)=>{"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(...e)},ee=(e="")=>{const t=new Error(e);throw Ph(t,ee),t},Rh=e=>typeof e=="bigint",Ih=e=>typeof e=="string",Mh=e=>e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array",st=(e,t,n="")=>{const s=Mh(e),i=e?.length,a=t!==void 0;if(!s||a&&i!==t){const o=n&&`"${n}" `,c=a?` of length ${t}`:"",d=s?`length=${i}`:`type=${typeof e}`;ee(o+"expected Uint8Array"+c+", got "+d)}return e},vs=e=>new Uint8Array(e),kl=e=>Uint8Array.from(e),$l=(e,t)=>e.toString(16).padStart(t,"0"),Al=e=>Array.from(st(e)).map(t=>$l(t,2)).join(""),Fe={_0:48,_9:57,A:65,F:70,a:97,f:102},Co=e=>{if(e>=Fe._0&&e<=Fe._9)return e-Fe._0;if(e>=Fe.A&&e<=Fe.F)return e-(Fe.A-10);if(e>=Fe.a&&e<=Fe.f)return e-(Fe.a-10)},Tl=e=>{const t="hex invalid";if(!Ih(e))return ee(t);const n=e.length,s=n/2;if(n%2)return ee(t);const i=vs(s);for(let a=0,o=0;a<s;a++,o+=2){const c=Co(e.charCodeAt(o)),d=Co(e.charCodeAt(o+1));if(c===void 0||d===void 0)return ee(t);i[a]=c*16+d}return i},xl=()=>globalThis?.crypto,Dh=()=>xl()?.subtle??ee("crypto.subtle must be defined, consider polyfill"),Sn=(...e)=>{const t=vs(e.reduce((s,i)=>s+st(i).length,0));let n=0;return e.forEach(s=>{t.set(s,n),n+=s.length}),t},Oh=(e=wt)=>xl().getRandomValues(vs(e)),ns=BigInt,ft=(e,t,n,s="bad number: out of range")=>Rh(e)&&t<=e&&e<n?e:ee(s),R=(e,t=oe)=>{const n=e%t;return n>=0n?n:t+n},_l=e=>R(e,Vn),Nh=(e,t)=>{(e===0n||t<=0n)&&ee("no inverse n="+e+" mod="+t);let n=R(e,t),s=t,i=0n,a=1n;for(;n!==0n;){const o=s/n,c=s%n,d=i-a*o;s=n,n=c,i=a,a=d}return s===1n?R(i,t):ee("no inverse")},Fh=e=>{const t=Pl[e];return typeof t!="function"&&ee("hashes."+e+" not set"),t},Xs=e=>e instanceof ye?e:ee("Point expected"),xi=2n**256n;class ye{static BASE;static ZERO;X;Y;Z;T;constructor(t,n,s,i){const a=xi;this.X=ft(t,0n,a),this.Y=ft(n,0n,a),this.Z=ft(s,1n,a),this.T=ft(i,0n,a),Object.freeze(this)}static CURVE(){return Sl}static fromAffine(t){return new ye(t.x,t.y,1n,R(t.x*t.y))}static fromBytes(t,n=!1){const s=Js,i=kl(st(t,wt)),a=t[31];i[31]=a&-129;const o=El(i);ft(o,0n,n?xi:oe);const d=R(o*o),u=R(d-1n),l=R(s*d+1n);let{isValid:p,value:v}=Uh(u,l);p||ee("bad point: y not sqrt");const y=(v&1n)===1n,b=(a&128)!==0;return!n&&v===0n&&b&&ee("bad point: x==0, isLastByteOdd"),b!==y&&(v=R(-v)),new ye(v,o,1n,R(v*o))}static fromHex(t,n){return ye.fromBytes(Tl(t),n)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}assertValidity(){const t=Qs,n=Js,s=this;if(s.is0())return ee("bad point: ZERO");const{X:i,Y:a,Z:o,T:c}=s,d=R(i*i),u=R(a*a),l=R(o*o),p=R(l*l),v=R(d*t),y=R(l*R(v+u)),b=R(p+R(n*R(d*u)));if(y!==b)return ee("bad point: equation left != right (1)");const k=R(i*a),S=R(o*c);return k!==S?ee("bad point: equation left != right (2)"):this}equals(t){const{X:n,Y:s,Z:i}=this,{X:a,Y:o,Z:c}=Xs(t),d=R(n*c),u=R(a*i),l=R(s*c),p=R(o*i);return d===u&&l===p}is0(){return this.equals(Ut)}negate(){return new ye(R(-this.X),this.Y,this.Z,R(-this.T))}double(){const{X:t,Y:n,Z:s}=this,i=Qs,a=R(t*t),o=R(n*n),c=R(2n*R(s*s)),d=R(i*a),u=t+n,l=R(R(u*u)-a-o),p=d+o,v=p-c,y=d-o,b=R(l*v),k=R(p*y),S=R(l*y),$=R(v*p);return new ye(b,k,$,S)}add(t){const{X:n,Y:s,Z:i,T:a}=this,{X:o,Y:c,Z:d,T:u}=Xs(t),l=Qs,p=Js,v=R(n*o),y=R(s*c),b=R(a*p*u),k=R(i*d),S=R((n+s)*(o+c)-v-y),$=R(k-b),T=R(k+b),P=R(y-l*v),L=R(S*$),A=R(T*P),C=R(S*P),x=R($*T);return new ye(L,A,x,C)}subtract(t){return this.add(Xs(t).negate())}multiply(t,n=!0){if(!n&&(t===0n||this.is0()))return Ut;if(ft(t,1n,Vn),t===1n)return this;if(this.equals(St))return Jh(t).p;let s=Ut,i=St;for(let a=this;t>0n;a=a.double(),t>>=1n)t&1n?s=s.add(a):n&&(i=i.add(a));return s}multiplyUnsafe(t){return this.multiply(t,!1)}toAffine(){const{X:t,Y:n,Z:s}=this;if(this.equals(Ut))return{x:0n,y:1n};const i=Nh(s,oe);R(s*i)!==1n&&ee("invalid inverse");const a=R(t*i),o=R(n*i);return{x:a,y:o}}toBytes(){const{x:t,y:n}=this.assertValidity().toAffine(),s=Cl(n);return s[31]|=t&1n?128:0,s}toHex(){return Al(this.toBytes())}clearCofactor(){return this.multiply(ns(Lh),!1)}isSmallOrder(){return this.clearCofactor().is0()}isTorsionFree(){let t=this.multiply(Vn/2n,!1).double();return Vn%2n&&(t=t.add(this)),t.is0()}}const St=new ye(xo,_o,1n,R(xo*_o)),Ut=new ye(0n,1n,1n,0n);ye.BASE=St;ye.ZERO=Ut;const Cl=e=>Tl($l(ft(e,0n,xi),ea)).reverse(),El=e=>ns("0x"+Al(kl(st(e)).reverse())),Ce=(e,t)=>{let n=e;for(;t-- >0n;)n*=n,n%=oe;return n},Bh=e=>{const n=e*e%oe*e%oe,s=Ce(n,2n)*n%oe,i=Ce(s,1n)*e%oe,a=Ce(i,5n)*i%oe,o=Ce(a,10n)*a%oe,c=Ce(o,20n)*o%oe,d=Ce(c,40n)*c%oe,u=Ce(d,80n)*d%oe,l=Ce(u,80n)*d%oe,p=Ce(l,10n)*a%oe;return{pow_p_5_8:Ce(p,2n)*e%oe,b2:n}},Eo=0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,Uh=(e,t)=>{const n=R(t*t*t),s=R(n*n*t),i=Bh(e*s).pow_p_5_8;let a=R(e*n*i);const o=R(t*a*a),c=a,d=R(a*Eo),u=o===e,l=o===R(-e),p=o===R(-e*Eo);return u&&(a=c),(l||p)&&(a=d),(R(a)&1n)===1n&&(a=R(-a)),{isValid:u||l,value:a}},_i=e=>_l(El(e)),ta=(...e)=>Pl.sha512Async(Sn(...e)),Kh=(...e)=>Fh("sha512")(Sn(...e)),Ll=e=>{const t=e.slice(0,wt);t[0]&=248,t[31]&=127,t[31]|=64;const n=e.slice(wt,ea),s=_i(t),i=St.multiply(s),a=i.toBytes();return{head:t,prefix:n,scalar:s,point:i,pointBytes:a}},na=e=>ta(st(e,wt)).then(Ll),zh=e=>Ll(Kh(st(e,wt))),Wh=e=>na(e).then(t=>t.pointBytes),qh=e=>ta(e.hashable).then(e.finish),jh=(e,t,n)=>{const{pointBytes:s,scalar:i}=e,a=_i(t),o=St.multiply(a).toBytes();return{hashable:Sn(o,s,n),finish:u=>{const l=_l(a+_i(u)*i);return st(Sn(o,Cl(l)),ea)}}},Hh=async(e,t)=>{const n=st(e),s=await na(t),i=await ta(s.prefix,n);return qh(jh(s,i,n))},Pl={sha512Async:async e=>{const t=Dh(),n=Sn(e);return vs(await t.digest("SHA-512",n.buffer))},sha512:void 0},Vh=(e=Oh(wt))=>e,Gh={getExtendedPublicKeyAsync:na,getExtendedPublicKey:zh,randomSecretKey:Vh},ss=8,Yh=256,Rl=Math.ceil(Yh/ss)+1,Ci=2**(ss-1),Qh=()=>{const e=[];let t=St,n=t;for(let s=0;s<Rl;s++){n=t,e.push(n);for(let i=1;i<Ci;i++)n=n.add(t),e.push(n);t=n.double()}return e};let Lo;const Po=(e,t)=>{const n=t.negate();return e?n:t},Jh=e=>{const t=Lo||(Lo=Qh());let n=Ut,s=St;const i=2**ss,a=i,o=ns(i-1),c=ns(ss);for(let d=0;d<Rl;d++){let u=Number(e&o);e>>=c,u>Ci&&(u-=a,e+=1n);const l=d*Ci,p=l,v=l+Math.abs(u)-1,y=d%2!==0,b=u<0;u===0?s=s.add(Po(y,t[p])):n=n.add(Po(b,t[v]))}return e!==0n&&ee("invalid wnaf"),{p:n,f:s}},Zs="godmode-device-identity-v1";function Ei(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"")}function Il(e){const t=e.replaceAll("-","+").replaceAll("_","/"),n=t+"=".repeat((4-t.length%4)%4),s=atob(n),i=new Uint8Array(s.length);for(let a=0;a<s.length;a+=1)i[a]=s.charCodeAt(a);return i}function Xh(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function Ml(e){const t=await crypto.subtle.digest("SHA-256",e);return Xh(new Uint8Array(t))}async function Zh(){const e=Gh.randomSecretKey(),t=await Wh(e);return{deviceId:await Ml(t),publicKey:Ei(t),privateKey:Ei(e)}}async function sa(){try{const n=localStorage.getItem(Zs);if(n){const s=JSON.parse(n);if(s?.version===1&&typeof s.deviceId=="string"&&typeof s.publicKey=="string"&&typeof s.privateKey=="string"){const i=await Ml(Il(s.publicKey));if(i!==s.deviceId){const a={...s,deviceId:i};return localStorage.setItem(Zs,JSON.stringify(a)),{deviceId:i,publicKey:s.publicKey,privateKey:s.privateKey}}return{deviceId:s.deviceId,publicKey:s.publicKey,privateKey:s.privateKey}}}}catch{}const e=await Zh(),t={version:1,deviceId:e.deviceId,publicKey:e.publicKey,privateKey:e.privateKey,createdAtMs:Date.now()};return localStorage.setItem(Zs,JSON.stringify(t)),e}async function ef(e,t){const n=Il(e),s=new TextEncoder().encode(t),i=await Hh(s,n);return Ei(i)}async function it(e,t){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,t?.quiet||(e.devicesError=null);try{const n=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(n?.pending)?n.pending:[],paired:Array.isArray(n?.paired)?n.paired:[]}}catch(n){t?.quiet||(e.devicesError=String(n))}finally{e.devicesLoading=!1}}}async function tf(e,t){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:t}),await it(e)}catch(n){e.devicesError=String(n)}}async function nf(e,t){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:t}),await it(e)}catch(s){e.devicesError=String(s)}}async function sf(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("device.token.rotate",t);if(n?.token){const s=await sa(),i=n.role??t.role;(n.deviceId===s.deviceId||t.deviceId===s.deviceId)&&bl({deviceId:s.deviceId,role:i,token:n.token,scopes:n.scopes??t.scopes??[]}),window.prompt("New device token (copy and store securely):",n.token)}await it(e)}catch(n){e.devicesError=String(n)}}async function af(e,t){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)))try{await e.client.request("device.token.revoke",t);const s=await sa();t.deviceId===s.deviceId&&wl({deviceId:s.deviceId,role:t.role}),await it(e)}catch(s){e.devicesError=String(s)}}function Li(e){return typeof e=="object"&&e!==null}function of(e){if(!Li(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!Li(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const i=typeof e.createdAtMs=="number"?e.createdAtMs:0,a=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!i||!a?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:i,expiresAtMs:a}}function rf(e){if(!Li(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function Dl(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function lf(e,t){const n=Dl(e).filter(s=>s.id!==t.id);return n.push(t),n}function Ro(e,t){return Dl(e).filter(n=>n.id!==t)}async function ys(e,t){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,t?.quiet||(e.lastError=null);try{const n=await e.client.request("node.list",{}),s=Array.isArray(n.nodes)?n.nodes:[];JSON.stringify(s)!==JSON.stringify(e.nodes)&&(e.nodes=s)}catch(n){t?.quiet||(e.lastError=String(n))}finally{e.nodesLoading=!1}}}const Ol="godmode:autoTitleCache";function cf(){try{const e=localStorage.getItem(Ol);if(e){const t=JSON.parse(e);return new Map(t)}}catch{}return new Map}function ei(e){try{const t=[...e.entries()],n=t.length>200?t.slice(-200):t;localStorage.setItem(Ol,JSON.stringify(n))}catch{}}class df extends Map{set(t,n){return super.set(t,n),ei(this),this}delete(t){const n=super.delete(t);return n&&ei(this),n}clear(){super.clear(),ei(this)}}const Pe=new df(cf());async function J(e,t){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const n=t?.includeGlobal??e.sessionsIncludeGlobal,s=t?.includeUnknown??e.sessionsIncludeUnknown,i=t?.activeMinutes??Xn(e.sessionsFilterActive,0),a=t?.limit??Xn(e.sessionsFilterLimit,50),o={includeGlobal:n,includeUnknown:s};i>0&&(o.activeMinutes=i),a>0&&(o.limit=a);const c=await e.client.request("sessions.list",o);if(c){if(c.sessions){const d=new Map;if(e.sessionsResult?.sessions)for(const u of e.sessionsResult.sessions)u.displayName&&d.set(u.key,u.displayName);c.sessions=c.sessions.map(u=>{if(u.label||u.displayName)return u;let l=Pe.get(u.key);if(!l){const v=u.key.split(":").pop();if(v&&v.length>=4){for(const[y,b]of Pe)if(y===u.key||y.endsWith(`:${v}`)||u.key.endsWith(`:${y.split(":").pop()}`)){l=b;break}}}if(l)return{...u,displayName:l};const p=d.get(u.key);return p?{...u,displayName:p}:u})}e.sessionsResult=c}}catch(n){e.sessionsError=String(n)}finally{e.sessionsLoading=!1}}}async function Gn(e,t,n){if(!e.client||!e.connected)return{ok:!1};const s={key:t};"label"in n&&(s.label=n.label),"displayName"in n&&(s.displayName=n.displayName),"thinkingLevel"in n&&(s.thinkingLevel=n.thinkingLevel),"verboseLevel"in n&&(s.verboseLevel=n.verboseLevel),"reasoningLevel"in n&&(s.reasoningLevel=n.reasoningLevel);try{const{safeRequest:i}=await E(async()=>{const{safeRequest:o}=await Promise.resolve().then(()=>Af);return{safeRequest:o}},void 0,import.meta.url),a=await i(e.client,"sessions.patch",s);return a.ok?{ok:!0,canonicalKey:a.data?.key??t}:(e.sessionsError=a.error,{ok:!1})}catch(i){return e.sessionsError=String(i),{ok:!1}}}async function Nl(e,t){if(!(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${t}"?

Deletes the session entry and archives its transcript.`))){e.sessionsLoading=!0,e.sessionsError=null;try{await e.client.request("sessions.delete",{key:t,deleteTranscript:!0}),await J(e)}catch(s){e.sessionsError=String(s)}finally{e.sessionsLoading=!1}}}async function kt(e){if(!(!e.client||!e.connected)){e.archivedSessionsLoading=!0;try{const t=await e.client.request("sessions.archived",{});t?.archived&&(e.archivedSessions=t.archived)}catch{}finally{e.archivedSessionsLoading=!1}}}async function Fl(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.archive",{sessionKey:t}),await kt(e),await J(e)}catch(n){e.sessionsError=`Archive failed: ${String(n)}`}}async function Bl(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.unarchive",{sessionKey:t}),await kt(e),await J(e)}catch(n){e.sessionsError=`Unarchive failed: ${String(n)}`}}async function Ul(e){if(!e.client||!e.connected)return 0;try{const n=(await e.client.request("sessions.autoArchive",{}))?.archivedCount??0;return await kt(e),await J(e),n}catch(t){return e.sessionsError=`Auto-archive failed: ${String(t)}`,0}}const on=Object.freeze(Object.defineProperty({__proto__:null,archiveSession:Fl,autoTitleCache:Pe,deleteSession:Nl,loadArchivedSessions:kt,loadSessions:J,patchSession:Gn,triggerAutoArchive:Ul,unarchiveSession:Bl},Symbol.toStringTag,{value:"Module"})),uf=1800*1e3;function Kl(e){return{openclawVersion:e.openclaw.version,openclawLatest:e.openclaw.latest,openclawUpdateAvailable:e.openclaw.updateAvailable,openclawInstallKind:e.openclaw.installKind,openclawChannel:e.openclaw.channel,pluginVersion:e.plugin.version,pluginLatest:e.plugin.latest,pluginUpdateAvailable:e.plugin.updateAvailable,pendingDeploy:e.pendingDeploy??null,fetchOk:e.fetchOk}}function zl(e){const t=typeof e.behind=="number"?e.behind:null;return{openclawVersion:String(e.version??"unknown"),openclawLatest:null,openclawUpdateAvailable:(t??0)>0,openclawInstallKind:"unknown",openclawChannel:null,pluginVersion:"unknown",pluginLatest:null,pluginUpdateAvailable:!1,pendingDeploy:null,fetchOk:e.fetchOk}}async function pf(e){if(!(!e.client||!e.connected)){e.updateLoading=!0,e.updateError=null;try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Kl(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});t.error&&(e.updateError=String(t.error)),e.updateStatus=zl(t),e.updateLastChecked=Date.now()}catch(t){e.updateError=String(t)}}finally{e.updateLoading=!1}}}async function Io(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Kl(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});e.updateStatus=zl(t),e.updateLastChecked=Date.now()}catch{}}}function hf(e){e.updatePollInterval==null&&(Io(e),e.updatePollInterval=window.setInterval(()=>{Io(e)},uf))}function ff(e){const t=e;t.updatePollInterval!=null&&(clearInterval(t.updatePollInterval),t.updatePollInterval=null)}async function gf(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.postStatus",{});if(!t)return;const n=t.overallStatus,s=t.summary;if(!s)return;const i=n==="healthy"?"success":n==="degraded"?"error":"warning";typeof e.showToast=="function"&&e.showToast(s,i),pf(e)}catch{}}const Wl={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},Mo=Wl,Pi={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(Wl));new Set(Object.values(Pi));function mf(e){const t=e.version??(e.nonce?"v2":"v1"),n=e.scopes.join(","),s=e.token??"",i=[t,e.deviceId,e.clientId,e.clientMode,e.role,n,String(e.signedAtMs),s];return t==="v2"&&i.push(e.nonce??""),i.join("|")}const vf=4008;class yf{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.read","operator.write","operator.approvals","operator.pairing"],s="operator";let i=null,a=!1,o=this.opts.token;if(t){i=await sa();const l=Eh({deviceId:i.deviceId,role:s})?.token;o=l??this.opts.token,a=!!(l&&this.opts.token)}const c=o||this.opts.password?{token:o,password:this.opts.password}:void 0;let d;if(t&&i){const l=Date.now(),p=this.connectNonce??void 0,v=mf({deviceId:i.deviceId,clientId:this.opts.clientName??Mo.CONTROL_UI,clientMode:this.opts.mode??Pi.WEBCHAT,role:s,scopes:n,signedAtMs:l,token:o??null,nonce:p}),y=await ef(i.privateKey,v);d={id:i.deviceId,publicKey:i.publicKey,signature:y,signedAt:l,nonce:p}}const u={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??Mo.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??Pi.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:d,caps:[],auth:c,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",u).then(l=>{l?.auth?.deviceToken&&i&&bl({deviceId:i.deviceId,role:l.auth.role??s,token:l.auth.deviceToken,scopes:l.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(l)}).catch(()=>{a&&i&&wl({deviceId:i.deviceId,role:s}),this.ws?.close(vf,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const i=n;if(i.event==="connect.challenge"){const o=i.payload,c=o&&typeof o.nonce=="string"?o.nonce:null;c&&(this.connectNonce=c,this.sendConnect());return}const a=typeof i.seq=="number"?i.seq:null;a!==null&&(this.lastSeq!==null&&a>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:a}),this.lastSeq=a);try{this.opts.onEvent?.(i)}catch(o){console.error("[gateway] event handler error:",o)}return}if(s.type==="res"){const i=n,a=this.pending.get(i.id);if(!a)return;this.pending.delete(i.id),i.ok?a.resolve(i.payload):a.reject(new Error(i.error?.message??"request failed"));return}}request(t,n){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const s=ms(),i={type:"req",id:s,method:t,params:n},a=new Promise((o,c)=>{this.pending.set(s,{resolve:d=>o(d),reject:c})});return this.ws.send(JSON.stringify(i)),a}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}const ql={displayName:"label",sessionKey:"conversationId"},jl={};for(const[e,t]of Object.entries(ql))jl[t]=e;const bf={"sessions.autoTitle":["sessions.patch"],"sessions.rename":["sessions.patch"]},$t=new Map;function wf(){try{const e=sessionStorage.getItem("godmode:healing-cache");if(e){const t=JSON.parse(e);for(const[n,s]of Object.entries(t))$t.set(n,s)}}catch{}}function Do(){try{const e={};for(const[t,n]of $t)e[t]=n;sessionStorage.setItem("godmode:healing-cache",JSON.stringify(e))}catch{}}wf();function Sf(e,t){const n=$t.get(e);if(!n)return{method:e,params:t};const s=n.resolvedMethod;if(t&&typeof t=="object"&&!Array.isArray(t)&&Object.keys(n.fieldRenames).length>0){const i={...t};for(const[a,o]of Object.entries(n.fieldRenames))a in i&&!(o in i)&&(i[o]=i[a],delete i[a]);return{method:s,params:i}}return{method:s,params:t}}function kf(e,t,n){const s=n.toLowerCase(),i=n.match(/unexpected property[:\s]*['"]?(\w+)['"]?/i);if(i){const a=i[1],o=ql[a];if(o&&t&&typeof t=="object"){const c={...t};if(a in c)return c[o]=c[a],delete c[a],console.log(`[safe-request] Self-heal: ${e} — rewrote "${a}" → "${o}"`),{method:e,params:c,renames:{[a]:o}}}}if(s.includes("unknown method")||s.includes("method not found")){const a=bf[e];if(a&&a.length>0){const o=a[0];return console.log(`[safe-request] Self-heal: ${e} not found — falling back to ${o}`),{method:o,params:t,renames:{}}}}if((s.includes("unexpected property")||s.includes("unknown field"))&&t&&typeof t=="object"){const a={...t};let o=!1;const c={};for(const[d,u]of Object.entries(jl))d in a&&(a[u]=a[d],delete a[d],c[d]=u,o=!0,console.log(`[safe-request] Self-heal: ${e} — reverse alias "${d}" → "${u}"`));if(o)return{method:e,params:a,renames:c}}return null}async function is(e,t,n,s){const i=s?.timeout??3e4;let{method:a,params:o}=s?.raw?{method:t,params:n}:Sf(t,n);const c=async(d,u)=>Promise.race([e.request(d,u),new Promise((l,p)=>setTimeout(()=>p(new Error(`Request timeout (${i}ms): ${d}`)),i))]);try{return{ok:!0,data:await c(a,o),method:a,healed:a!==t}}catch(d){const u=String(d instanceof Error?d.message:d);if(s?.raw)return{ok:!1,error:u,method:t};const l=kf(a,o,u);if(l)try{const p=await c(l.method,l.params);return $t.set(t,{resolvedMethod:l.method,fieldRenames:l.renames,ts:Date.now()}),Do(),{ok:!0,data:p,method:l.method,healed:!0}}catch(p){return{ok:!1,error:String(p instanceof Error?p.message:p),method:l.method,healed:!0}}if(s?.fallbacks)for(const p of s.fallbacks)try{const v=await c(p,o);return $t.set(t,{resolvedMethod:p,fieldRenames:{},ts:Date.now()}),Do(),{ok:!0,data:v,method:p,healed:!0}}catch{continue}return{ok:!1,error:u,method:a}}}function Hl(){$t.clear();try{sessionStorage.removeItem("godmode:healing-cache")}catch{}}function $f(){const e={};for(const[t,n]of $t)e[t]=n;return e}const Af=Object.freeze(Object.defineProperty({__proto__:null,clearHealingCache:Hl,getHealingEntries:$f,safeRequest:is},Symbol.toStringTag,{value:"Module"}));let he=null;function Vl(e,t){Hl();const n=String(e.version??e.serverVersion??e.gatewayVersion??"unknown"),s=typeof e.protocol=="number"?e.protocol:void 0;he={hostVersion:n,protocolVersion:s,methods:{},initializedAt:Date.now(),probing:!0};try{const i=sessionStorage.getItem("godmode:host-compat");if(i){const a=JSON.parse(i);if(a.hostVersion===n&&a.methods)return he.methods=a.methods,he.probing=!1,he}}catch{}return Tf(t).catch(()=>{}),he}async function Tf(e){if(!he)return;const t=[{method:"sessions.list",params:{limit:1}},{method:"sessions.patch",params:{key:"__compat_probe__"}},{method:"sessions.autoTitle",params:{sessionKey:"__compat_probe__"}},{method:"config.get",params:{}}];for(const n of t){const s={available:!1,testedAt:Date.now()};try{await e.request(n.method,n.params),s.available=!0}catch(i){const a=String(i instanceof Error?i.message:i),o=a.toLowerCase(),c=o.includes("unknown method")||o.includes("not found")&&o.includes("method");s.available=!c,c&&(s.error="method not available");const d=a.match(/(?:expected|valid|accepted) (?:fields?|properties?)[:\s]*\[([^\]]+)\]/i);d&&(s.fields=d[1].split(",").map(u=>u.trim().replace(/['"]/g,"")))}he.methods[n.method]=s}he.probing=!1;try{sessionStorage.setItem("godmode:host-compat",JSON.stringify(he))}catch{}}function Gl(e){if(!he)return;const t=he.methods[e];if(t)return t.available}function xf(){return he?.hostVersion??"unknown"}function _f(){return he}function Cf(){return he?.probing??!1}async function Yl(e,t,n){const s=await is(e,"sessions.patch",{key:t,label:n});return s.ok?{ok:!0}:(await is(e,"sessions.patch",{key:t,displayName:n},{raw:!0})).ok?{ok:!0}:{ok:!1,error:s.error}}async function Ef(e,t,n){if(Gl("sessions.autoTitle")!==!1){const c=await is(e,"sessions.autoTitle",{sessionKey:t});if(c.ok)return{ok:!0,title:c.data?.title}}const i=n.find(c=>c.role==="user");if(!i)return{ok:!1,error:"No user message to derive title from"};const a=Lf(i.content),o=await Yl(e,t,a);return o.ok?{ok:!0,title:a}:{ok:!1,error:o.error}}function Lf(e){let t=e.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").replace(/https?:\/\/\S+/g,"").replace(/[#*_~>]/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").trim();if(t=t.split(`
`).filter(s=>s.trim().length>0)[0]??"New conversation",t.length>60){const s=t.slice(0,57),i=s.lastIndexOf(" ");t=(i>30?s.slice(0,i):s)+"..."}return t}function Pf(e){return String(e.label??e.displayName??e.key??"Untitled")}const Rf=Object.freeze(Object.defineProperty({__proto__:null,getHostCompat:_f,getHostVersion:xf,hasMethod:Gl,hostAutoTitle:Ef,hostPatchSession:Yl,initHostCompat:Vl,isProbing:Cf,readSessionName:Pf},Symbol.toStringTag,{value:"Module"})),Ri=new Map;let Oo=null,ti=!1;function If(e,t,n){return Ri.get(`${e}:${t}:${n}`)??null}async function Ql(e){if(!e.client||!e.chatMessages?.length)return;const t=e.sessionKey,n=[];for(let s=0;s<e.chatMessages.length;s++){const i=e.chatMessages[s],a=$i(i);for(let o=0;o<a.length;o++)if(a[o].url&&!a[o].omitted){const c=/^data:([^;]+);base64,(.+)$/.exec(a[o].url);c&&n.push({data:c[2],mimeType:c[1],messageIndex:s,imageIndex:o,role:i.role||"unknown",timestamp:typeof i.timestamp=="number"?i.timestamp:void 0})}}if(n.length>0)try{const s=await e.client.request("images.cache",{images:n.map(i=>({data:i.data,mimeType:i.mimeType})),sessionKey:t});if(s?.cached){const i=n.map((a,o)=>({messageIndex:a.messageIndex,imageIndex:a.imageIndex,hash:s.cached[o]?.hash,mimeType:a.mimeType,bytes:s.cached[o]?.bytes??0,role:a.role,timestamp:a.timestamp})).filter(a=>!!a.hash);i.length>0&&await e.client.request("images.updateIndex",{sessionKey:t,images:i})}}catch{}if(!ti){ti=!0;try{const s=ul();s&&await s.catch(()=>{});const i=async()=>{const o=await e.client.request("images.resolve",{sessionKey:t});if(o?.images&&Object.keys(o.images).length>0){Oo!==t&&Ri.clear();for(const[c,d]of Object.entries(o.images))Ri.set(`${t}:${c}`,d);return Oo=t,e.chatMessages=[...e.chatMessages],!0}return!1};if(!await i()&&e.chatMessages?.some(o=>$i(o).some(d=>d.omitted||!d.url))){for(const o of[500,1500,3e3])if(await new Promise(c=>setTimeout(c,o)),await i()||e.sessionKey!==t)break}}catch{}finally{ti=!1}}}let No=null;function Mf(e){if(!e.chatMessages?.length)return;const t=e.chatMessages.slice(-5);for(const n of t){const s=n,i=Array.isArray(s.content)?s.content:[];for(const a of i){const o=a,c=typeof o.text=="string"?o.text:typeof o.content=="string"?o.content:null;if(c)try{const d=JSON.parse(c);if(d._sidebarAction?.type==="proof"&&d._sidebarAction.slug){const u=d._sidebarAction.slug;if(u===No)return;No=u,e.handleOpenProofDoc(u);return}}catch{}}}}function as(e){Ql(e)}const ln=[];function Df(){return[...ln]}let Je=null;const Of=10,Nf=1e3,$e=new Map;function ni(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const i=t.mainKey?.trim()||"main",a=t.defaultAgentId?.trim();return n==="main"||n===i||a&&(n===`agent:${a}:main`||n===`agent:${a}:${i}`)?s:n}function Ff(e,t){if(!t?.mainSessionKey)return;const n="main",s=l=>(l??"").trim()===n||(l??"").trim()==="",i=s(e.sessionKey)?e.sessionKey:ni(e.sessionKey,t),a=s(e.settings.sessionKey)?e.settings.sessionKey:ni(e.settings.sessionKey,t),o=s(e.settings.lastActiveSessionKey)?e.settings.lastActiveSessionKey:ni(e.settings.lastActiveSessionKey,t),c=i||a||e.sessionKey,d={...e.settings,sessionKey:a||c,lastActiveSessionKey:o||c},u=d.sessionKey!==e.settings.sessionKey||d.lastActiveSessionKey!==e.settings.lastActiveSessionKey;c!==e.sessionKey&&(e.sessionKey=c),u&&We(e,d)}function Bf(e){Je&&(clearTimeout(Je),Je=null);const t=(e.reconnectAttempt??0)+1;if(t>Of){e.lastError="Connection lost. Please refresh the page.",e.reconnecting=!1;return}e.reconnectAttempt=t,e.reconnecting=!0;const n=Math.min(Nf*Math.pow(2,t-1),3e4);Je=setTimeout(()=>{Je=null,e.connected||ia(e)},n)}async function Uf(e){if(!e.client)return;const t=e;try{if(t.setupQuickDone){t.workspaceNeedsSetup=!1;return}try{if((await e.client.request("onboarding.status",{}))?.identity?.name){t.workspaceNeedsSetup=!1;return}}catch{}const n=await e.client.request("projects.list",{});t.workspaceNeedsSetup=!n?.projects||n.projects.length===0}catch{}}async function Kf(e){if(!e.client)return;if(e.workspaceNeedsSetup===!1){try{const n=await e.client.request("onboarding.status",{});n&&!n.completedAt&&await e.client.request("onboarding.complete",{summary:null})}catch{}return}try{const n=await e.client.request("onboarding.status",{}),s=e;if(n&&!n.completedAt){s.onboardingActive=!0,s.onboardingPhase=n.phase??0,s.onboardingData=n;const i=e;if(i.showSetupTab=!0,n.identity?.name){i.setupQuickDone=!0;const a=e;(!a.userName||!a.settings.userName)&&(a.userName=n.identity.name,a.applySettings({...a.settings,userName:n.identity.name}))}}else s.onboardingActive=!1,s.onboardingData=n??null}catch{}}function zf(e,t){if(!e.sessionsResult?.sessions)return;const n=e.sessionsResult.sessions.map(s=>s.key===t?{...s,updatedAt:Date.now()}:s);e.sessionsResult={...e.sessionsResult,sessions:n}}const Jl=new Set;function Wf(){Jl.clear()}async function qf(e,t){}function ia(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null,Wf();const t=e;"sessionsLoading"in t&&(t.sessionsLoading=!1),"agentsLoading"in t&&(t.agentsLoading=!1),"nodesLoading"in t&&(t.nodesLoading=!1),"devicesLoading"in t&&(t.devicesLoading=!1),"channelsLoading"in t&&(t.channelsLoading=!1),"configLoading"in t&&(t.configLoading=!1),"presenceLoading"in t&&(t.presenceLoading=!1),"cronLoading"in t&&(t.cronLoading=!1),"skillsLoading"in t&&(t.skillsLoading=!1),"debugLoading"in t&&(t.debugLoading=!1),"logsLoading"in t&&(t.logsLoading=!1),Je&&(clearTimeout(Je),Je=null),e.client?.stop(),e.client=new yf({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:n=>{const s=e.reconnecting;if(e.connected=!0,e.lastError=null,e.hello=n,e.reconnecting=!1,e.reconnectAttempt=0,s){const i=e;typeof i.showToast=="function"&&i.showToast("Gateway reconnected","success",4e3),e.lastError="✓ Reconnected",setTimeout(()=>{e.lastError==="✓ Reconnected"&&(e.lastError=null)},3e3),e.chatRunId=null;const a=e;"chatStream"in a&&(a.chatStream=null),"chatStreamStartedAt"in a&&(a.chatStreamStartedAt=null);const o=e;if(o.todaySelectedDate){const c=new Date,d=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}-${String(c.getDate()).padStart(2,"0")}`;o.todaySelectedDate!==d&&(o.todaySelectedDate=d)}e.workingSessions.clear(),e.requestUpdate?.();for(const c of $e.values())clearTimeout(c);$e.clear()}Vl(n,e.client),Qf(e,n),dl(e),ol(e),ys(e,{quiet:!0}),it(e,{quiet:!0}),J(e),Tn(e),Uf(e).then(()=>Kf(e)),Vf(e),Gf(e),hf(e),gf(e),Yf(e)},onClose:({code:n,reason:s})=>{e.connected=!1,ff(e);const i=e;"chatSending"in i&&(i.chatSending=!1),"chatSendingSessionKey"in i&&(i.chatSendingSessionKey=null),"chatRunId"in i&&(i.chatRunId=null),"chatStream"in i&&(i.chatStream=null),"chatStreamStartedAt"in i&&(i.chatStreamStartedAt=null);const a=e;"sessionsLoading"in a&&(a.sessionsLoading=!1),"agentsLoading"in a&&(a.agentsLoading=!1),"nodesLoading"in a&&(a.nodesLoading=!1),"devicesLoading"in a&&(a.devicesLoading=!1),"channelsLoading"in a&&(a.channelsLoading=!1),"presenceLoading"in a&&(a.presenceLoading=!1),n!==1012&&(e.lastError=`disconnected (${n}): ${s||"no reason"}`),Bf(e)},onEvent:n=>jf(e,n),onGap:({expected:n,received:s})=>{e.lastError=`event gap detected (expected seq ${n}, got ${s}); refresh recommended`}}),e.client.start()}function jf(e,t){try{Hf(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function Hf(e,t){if(ln.unshift({ts:Date.now(),event:t.event,payload:t.payload}),ln.length>250&&(ln.length=250),e.tab==="debug"&&(e.eventLog=[...ln]),t.event==="agent"){if(e.onboarding)return;const n=t.payload,s=n?.sessionKey;s&&n?.stream==="tool"&&n.data?.phase==="start"&&(e.workingSessions.has(s)||(e.workingSessions.add(s),e.requestUpdate?.())),ku(e,n);return}if(t.event==="chat"){const n=t.payload;if(n?.sessionKey){if(ma(e,n.sessionKey),n.state==="delta"){const a=$e.get(n.sessionKey);a&&(clearTimeout(a),$e.delete(n.sessionKey)),e.workingSessions.has(n.sessionKey)||(e.workingSessions.add(n.sessionKey),e.requestUpdate?.());const o=`safety:${n.sessionKey}`,c=$e.get(o);c&&clearTimeout(c),$e.set(o,setTimeout(()=>{$e.delete(o),e.workingSessions.has(n.sessionKey)&&(e.workingSessions.delete(n.sessionKey),e.requestUpdate?.())},9e4))}else if((n.state==="final"||n.state==="error"||n.state==="aborted")&&e.workingSessions.has(n.sessionKey)){const a=$e.get(n.sessionKey);a&&(clearTimeout(a),$e.delete(n.sessionKey));const o=`safety:${n.sessionKey}`,c=$e.get(o);c&&(clearTimeout(c),$e.delete(o)),e.workingSessions.delete(n.sessionKey),e.requestUpdate?.()}}n.state==="final"&&zf(e,n.sessionKey);const s=ml(e,n),i=n?.sessionKey===V||(n?.sessionKey?.endsWith(`:${V}`)??!1);if(n&&i){const a=e,o=e.tab==="chat"&&e.sessionKey===V;if(n.state==="delta"){const c=qt(n.message);if(!o){if(typeof c=="string"){const d=a.allyStream??"";(!d||c.length>=d.length)&&(a.allyStream=c)}a.allyWorking=!0,a.requestUpdate?.()}}else if(n.state==="final"){a.allyStream=null,a.allyWorking=!1,!a.allyPanelOpen&&e.tab!=="chat"&&(a.allyUnread=(a.allyUnread??0)+1);const c=e;c._loadAllyHistory().then(()=>{a.allyPanelOpen&&c._scrollAllyToBottom(),a.requestUpdate?.()})}else if(n.state==="error"||n.state==="aborted"){const c=qt(n.message),d=n.state==="aborted"?"Response was stopped.":c||"Something went wrong — try again.";a.allyMessages=[...a.allyMessages??[],{role:"assistant",content:`*${d}*`,timestamp:Date.now()}],a.allyStream=null,a.allyWorking=!1,a.requestUpdate?.()}}if(n.state==="final"&&(async()=>{await qf(e,n.sessionKey);try{await J(e,{activeMinutes:0})}catch{}})(),s==="final"||s==="error"||s==="aborted"){if(Wi(e),_c(e),s==="final"&&e.compactionStatus?.active){e.compactionStatus={active:!1,startedAt:e.compactionStatus.startedAt??null,completedAt:Date.now()};const a=e;a.autoRetryAfterCompact&&a.pendingRetry?(a.autoRetryAfterCompact=!1,setTimeout(()=>{a.handleRetryMessage?.()},500)):(a.showToast?.("Compaction complete — resuming...","info",2e3),setTimeout(()=>{a.handleSendChat?.("Continue where you left off.")},800))}(s==="error"||s==="aborted")&&e.compactionStatus?.active&&(e.compactionStatus=null),e.refreshSessionsAfterChat=!1}if(s==="final"){const a=!!e.compactionStatus?.completedAt;fl(e,{allowShrink:a}).then(()=>{Ql(e),e.loadSessionResources?.(),Mf(e);const c=e;if(!c.compactionStatus?.active){const u=[...Array.isArray(c.chatMessages)?c.chatMessages:[]].reverse().find(l=>typeof l=="object"&&l!==null&&l.role==="user");if(u){const l=u.content;let p="";typeof l=="string"?p=l:Array.isArray(l)&&(p=l.filter(v=>typeof v?.text=="string").map(v=>v.text).join(" ")),(p.includes("Pre-compaction memory flush")||p.includes("pre-compaction memory flush"))&&(c.showToast?.("Context compacted — resuming conversation...","info",2e3),setTimeout(()=>{c.handleSendChat?.("Continue where you left off.")},800))}}});const o=e;o.tab==="dashboards"&&o.activeDashboardManifest?.sessionId&&o.activeDashboardManifest.sessionId===n.sessionKey&&E(async()=>{const{loadDashboard:c}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:c}},[],import.meta.url).then(({loadDashboard:c})=>{c(e,o.activeDashboardManifest.id)})}return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&Ts(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&it(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=of(t.payload);if(n){e.execApprovalQueue=lf(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=Ro(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.process.completed"){const n=t.payload;if(n?.sessionId){const s=n.exitSignal?`signal ${n.exitSignal}`:`exit ${n.exitCode??0}`,i=n.status==="completed"?"✓":"✗",a=n.status==="completed"?"success":"warning",o=n.sessionId.slice(0,8),c=e;typeof c.showToast=="function"&&c.showToast(`${i} Process ${o} ${n.status} (${s})`,a,5e3)}return}if(t.event==="exec.approval.resolved"){const n=rf(t.payload);n&&(e.execApprovalQueue=Ro(e.execApprovalQueue,n.id))}if(t.event==="daily-brief:update"){const n=t.payload;if(n){const s=e;s.dailyBrief=n}return}if(t.event==="ui.slot.update"){const n=t.payload;if(n?.tabId){const s=n.mode??"replace";if(n.html)s==="append"?e.dynamicSlots={...e.dynamicSlots,[n.tabId]:(e.dynamicSlots[n.tabId]??"")+n.html}:e.dynamicSlots={...e.dynamicSlots,[n.tabId]:n.html};else{const a={...e.dynamicSlots};delete a[n.tabId],e.dynamicSlots=a}e.requestUpdate?.()}return}if(t.event==="guardrails:update"){const n=e;typeof n.handleGuardrailsLoad=="function"&&n.handleGuardrailsLoad();return}if(t.event==="godmode.options:update"){const n=t.payload;if(n){const s=e;s.godmodeOptions=n,s.requestUpdate?.()}return}if(t.event==="fathom:meeting-processed"){const n=t.payload;if(n?.title){const s=e;typeof s.showToast=="function"&&s.showToast(`Meeting processed: ${n.title}`,"success",6e3);const i=n.message??`Meeting "${n.title}" has been processed.`;s.allyMessages=[...s.allyMessages??[],{role:"assistant",content:i,timestamp:Date.now()}],!s.allyPanelOpen&&s.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1),s.sessionKey===V&&s.chatMessages&&(s.chatMessages=[...s.chatMessages,{role:"assistant",content:i,timestamp:Date.now()}]),s.requestUpdate?.()}return}if(t.event==="onboarding:update"){const n=t.payload;if(n){const s=e;if(typeof n.phase=="number"&&(s.onboardingPhase=n.phase),s.onboardingData=n,n.completedAt&&(s.onboardingActive=!1),n.identity?.name){const i=e;(!i.userName||!i.settings.userName)&&(i.userName=n.identity.name,i.applySettings({...i.settings,userName:n.identity.name}))}s.requestUpdate?.()}return}if(t.event==="inbox:update"){const n=e;n.handleInboxRefresh?.().catch(()=>{}),n.requestUpdate?.();return}if(t.event==="queue:update"){const n=t.payload,s=e;n?.status==="processing"&&n.proofDocSlug&&s.handleOpenProofDoc?.(n.proofDocSlug).catch(()=>{}),s.handleInboxRefresh?.().catch(()=>{}),s.loadTodayQueueResults?.().catch(()=>{}),s.requestUpdate?.();return}if(t.event==="ally:notification"){const n=t.payload;if(n){const s=e,i={role:"assistant",content:n.summary||n.message||"Notification received.",timestamp:Date.now(),isNotification:!0,actions:n.actions??[]};s.allyMessages=[...s.allyMessages??[],i],!s.allyPanelOpen&&e.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1);const a=["queue-complete","queue-needs-review","queue-failed","cron-result","paperclip-completion"];if(n.type&&a.includes(n.type)&&s.loadTodayQueueResults&&s.loadTodayQueueResults().catch(()=>{}),n.type&&a.includes(n.type)&&s.handleInboxRefresh&&s.handleInboxRefresh().catch(()=>{}),n.type==="paperclip-completion"){const o=n,c=e;o.sessionKey&&c.sessionKey===o.sessionKey&&c.loadChatHistory?.().catch(()=>{}),i.content=o.message||i.content}s.requestUpdate?.()}return}if(t.event==="sessions:updated"){const n=t.payload;n?.sessionKey&&n?.title&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(s=>s.key===n.sessionKey||s.key?.endsWith(`:${n.sessionKey?.split(":").pop()}`)||n.sessionKey?.endsWith(`:${s.key?.split(":").pop()}`)?{...s,displayName:n.title,label:n.title}:s)}),Pe.set(n.sessionKey,n.title),Jl.add(n.sessionKey),e.requestUpdate?.());return}if(t.event==="session:auto-compact"){const n=t.payload;if(n?.sessionKey){const s=e;n.sessionKey===s.sessionKey&&!s.compactionStatus?.active&&s.connected&&(s.showToast?.("Context near limit — auto-compacting...","info",3e3),s.handleCompactChat?.())}return}}async function Vf(e){const t=e;typeof t.loadFocusPulse=="function"&&await t.loadFocusPulse()}async function Gf(e){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}async function Yf(e){if(typeof window>"u")return;const t=new URLSearchParams(window.location.search),n=t.get("openTask");if(!n||!e.client)return;t.delete("openTask");const s=t.toString()?`${window.location.pathname}?${t.toString()}`:window.location.pathname;window.history.replaceState({},"",s);try{const i=await e.client.request("tasks.openSession",{taskId:n});if(i?.sessionKey){e.sessionKey=i.sessionKey,e.tab="chat";const{loadChatHistory:a}=await E(async()=>{const{loadChatHistory:o}=await Promise.resolve().then(()=>Be);return{loadChatHistory:o}},void 0,import.meta.url);await a(e,i.sessionKey)}}catch(i){console.error("[GodMode] Failed to open task session:",i)}}function Qf(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&Ff(e,n.sessionDefaults)}async function bs(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[t,n,s,i]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=t,e.debugHealth=n;const a=s;e.debugModels=Array.isArray(a?.models)?a?.models:[],e.debugHeartbeat=i}catch(t){e.debugCallError=String(t)}finally{e.debugLoading=!1}}}async function Jf(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const t=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},n=await e.client.request(e.debugCallMethod.trim(),t);e.debugCallResult=JSON.stringify(n,null,2)}catch(t){e.debugCallError=String(t)}}}const Xf=2e3,Zf=new Set(["trace","debug","info","warn","error","fatal"]);function eg(e){if(typeof e!="string")return null;const t=e.trim();if(!t.startsWith("{")||!t.endsWith("}"))return null;try{const n=JSON.parse(t);return!n||typeof n!="object"?null:n}catch{return null}}function tg(e){if(typeof e!="string")return null;const t=e.toLowerCase();return Zf.has(t)?t:null}function ng(e){if(!e.trim())return{raw:e,message:e};try{const t=JSON.parse(e),n=t&&typeof t._meta=="object"&&t._meta!==null?t._meta:null,s=typeof t.time=="string"?t.time:typeof n?.date=="string"?n?.date:null,i=tg(n?.logLevelName??n?.level),a=typeof t[0]=="string"?t[0]:typeof n?.name=="string"?n?.name:null,o=eg(a);let c=null;o&&(typeof o.subsystem=="string"?c=o.subsystem:typeof o.module=="string"&&(c=o.module)),!c&&a&&a.length<120&&(c=a);let d=null;return typeof t[1]=="string"?d=t[1]:!o&&typeof t[0]=="string"?d=t[0]:typeof t.message=="string"&&(d=t.message),{raw:e,time:s,level:i,subsystem:c,message:d??e,meta:n??void 0}}catch{return{raw:e,message:e}}}async function aa(e,t){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!t?.quiet)){t?.quiet||(e.logsLoading=!0),e.logsError=null;try{const s=await e.client.request("logs.tail",{cursor:t?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),a=(Array.isArray(s.lines)?s.lines.filter(c=>typeof c=="string"):[]).map(ng),o=!!(t?.reset||s.reset||e.logsCursor==null);e.logsEntries=o?a:[...e.logsEntries,...a].slice(-Xf),typeof s.cursor=="number"&&(e.logsCursor=s.cursor),typeof s.file=="string"&&(e.logsFile=s.file),e.logsTruncated=!!s.truncated,e.logsLastFetchAt=Date.now()}catch(n){e.logsError=String(n)}finally{t?.quiet||(e.logsLoading=!1)}}}const Xl={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer",subagent:"Sub-Agent",swarm:"Team"};function si(e,t,n){return n?n.replace(/-/g," ").replace(/\b\w/g,s=>s.toUpperCase()):Xl[t??e]??e}function sg(e,t){const n=(t??Date.now())-e;if(n<0)return"0s";const s=Math.floor(n/1e3);if(s<60)return`${s}s`;const i=Math.floor(s/60),a=s%60;if(i<60)return`${i}m ${a}s`;const o=Math.floor(i/60),c=i%60;return`${o}h ${c}m`}function ig(){const e=new Date;return e.setHours(0,0,0,0),e.getTime()}function ag(e){switch(e){case"running":case"validating":return"active";case"queued":return"queued";case"failed":return"failed";default:return"done"}}function og(e,t){const n=[],s=new Set;for(const i of t){i.childSessionKey&&s.add(i.childSessionKey);const a=i.swarm?.enabled===!0,o=i.status==="review";n.push({id:i.id,type:a?"swarm":"coding",task:i.description,status:ag(i.status),model:i.model??null,startedAt:i.startedAt??i.createdAt,endedAt:i.completedAt??null,branch:i.branch,prUrl:i.prUrl,swarmStage:a?i.swarm.currentStage:void 0,swarmStages:a?i.swarm.stages:void 0,error:i.error,canCancel:i.status==="running"||i.status==="validating"||i.status==="queued",roleName:a?"Swarm":"Builder",childSessionKey:i.childSessionKey,isReview:o})}for(const i of e)s.has(i.childSessionKey)||n.push({id:i.runId,type:"subagent",task:i.task,status:i.endedAt?i.outcome?.status==="error"?"failed":"done":"active",model:i.model,startedAt:i.startedAt??i.createdAt,endedAt:i.endedAt,label:i.label,error:i.outcome?.error??void 0,roleName:i.label??"Sub-Agent",childSessionKey:i.childSessionKey});return n.sort((i,a)=>{const o={active:0,queued:1,failed:2,done:3},c=o[i.status]-o[a.status];return c!==0?c:(a.startedAt??0)-(i.startedAt??0)}),n}function rg(e){const t=[];for(const n of e)n.status==="done"&&n.endedAt&&t.push({id:`${n.id}-done`,timestamp:n.endedAt,type:"completed",summary:n.task,prUrl:n.prUrl,agentRef:n}),n.status==="failed"&&n.endedAt&&t.push({id:`${n.id}-fail`,timestamp:n.endedAt,type:"failed",summary:`${n.task}${n.error?` — ${n.error}`:""}`,agentRef:n}),n.status==="active"&&n.startedAt&&t.push({id:`${n.id}-start`,timestamp:n.startedAt,type:"started",summary:n.task,agentRef:n}),n.status==="queued"&&n.startedAt&&t.push({id:`${n.id}-queue`,timestamp:n.startedAt,type:"queued",summary:n.task,agentRef:n});return t.sort((n,s)=>s.timestamp-n.timestamp),t.slice(0,50)}function lg(e,t=0,n=0){const s=ig();let i=0,a=0,o=0,c=0;for(const u of e)u.status==="active"&&i++,u.status==="done"&&u.endedAt&&u.endedAt>=s&&a++,u.status==="failed"&&u.endedAt&&u.endedAt>=s&&o++,u.type==="swarm"&&(u.status==="active"||u.status==="queued")&&c++;const d=e.filter(u=>u.isReview&&(u.type==="coding"||u.type==="swarm")).length;return{activeNow:i,completedToday:a,failed:o,swarmPipelines:c,queueDepth:t,queueReview:n+d}}async function at(e,t){if(!e.client||!e.connected)return;const n=e;t?.quiet||(n.missionControlLoading=!0),n.missionControlError=null;try{let s=null;try{s=await e.client.request("queue.list",{limit:100})}catch{}let i=[],a=[];try{i=(await e.client.request("subagents.list",{limit:200})).runs??[]}catch{}try{a=(await e.client.request("coding.list",{})).tasks??[]}catch{}const o=og(i,a),c=s?.items??[],d=[];let u=0;for(const b of c)b.status==="processing"?o.push({id:b.id,type:"queue",task:b.title,status:"active",model:null,startedAt:b.startedAt??b.createdAt,endedAt:null,error:b.error,roleName:si(b.type,void 0,b.personaHint),queueItemType:b.type,outputPath:b.result?.outputPath,sourceTaskId:b.sourceTaskId,retryCount:b.retryCount,prUrl:b.result?.prUrl}):b.status==="review"?(u++,o.push({id:b.id,type:"queue",task:b.title,status:"done",model:null,startedAt:b.startedAt??b.createdAt,endedAt:b.completedAt??null,roleName:si(b.type,void 0,b.personaHint),queueItemType:b.type,outputPath:b.result?.outputPath,sourceTaskId:b.sourceTaskId,retryCount:b.retryCount,prUrl:b.result?.prUrl,isReview:!0})):b.status==="failed"?o.push({id:b.id,type:"queue",task:b.title,status:"failed",model:null,startedAt:b.startedAt??b.createdAt,endedAt:b.completedAt??null,error:b.error,roleName:si(b.type,void 0,b.personaHint),queueItemType:b.type,outputPath:b.result?.outputPath,sourceTaskId:b.sourceTaskId,retryCount:b.retryCount}):b.status==="pending"&&d.push(b);o.sort((b,k)=>{const S={active:0,queued:1,failed:2,done:3},$=S[b.status]-S[k.status];return $!==0?$:(k.startedAt??0)-(b.startedAt??0)});const l=d.length,p=lg(o,l,u),v=rg(o);let y={projects:[],selectedProjectId:null,detail:null,feed:[],running:!1};try{const b=await e.client.request("godmode.delegation.projects",{});if(b?.running&&b.projects.length>0){const k=b.projects,S=n.missionControlData?.swarm?.selectedProjectId,$=S&&k.some(L=>L.projectId===S)?S:k.find(L=>L.status==="in_progress")?.projectId??k[0].projectId;let T=null,P=[];if($){try{T=await e.client.request("godmode.delegation.status",{projectId:$})}catch{}try{P=(await e.client.request("godmode.delegation.feed",{projectId:$}))?.events??[]}catch{}}y={projects:k,selectedProjectId:$,detail:T,feed:P,running:!0}}}catch{}n.missionControlData={agents:o,stats:p,activityFeed:v,lastRefreshedAt:Date.now(),queueItems:d,swarm:y}}catch(s){console.error("[MissionControl] load error:",s),n.missionControlError=s instanceof Error?s.message:"Failed to load agent data"}finally{n.missionControlLoading=!1}}async function cg(e,t){if(!(!e.client||!e.connected))try{await e.client.request("coding.cancel",{taskId:t}),e.showToast("Task cancelled","success",2e3),await at(e)}catch(n){e.showToast("Failed to cancel task","error"),console.error("[MissionControl] cancel error:",n)}}async function dg(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("queue.approve",{id:t}),s=n?.item?.personaHint,i=n?.item?.title??"task";if(s){const a=s.replace(/-/g," ").replace(/\b\w/g,o=>o.toUpperCase());e.showToast(`Approved! How did ${a} do on "${i}"? Rate in Trust Tracker.`,"success",4e3)}else e.showToast("Item approved","success",2e3);await at(e)}catch(n){e.showToast("Failed to approve item","error"),console.error("[MissionControl] approve error:",n)}}async function ug(e,t){if(!e.client||!e.connected)return!1;try{return(await e.client.request("coding.approve",{taskId:t}))?.approved?(e.showToast("Task approved","success",2e3),await at(e),!0):!1}catch{return!1}}async function pg(e,t){if(!(!e.client||!e.connected))try{await e.client.request("queue.retry",{id:t}),e.showToast("Retrying...","success",2e3),await at(e)}catch(n){e.showToast("Failed to retry","error"),console.error("[MissionControl] retry error:",n)}}async function hg(e,t){if(t.status==="failed")return{content:[`# Failed: ${t.task}`,"",`**Agent:** ${t.roleName}`,`**Retries:** ${t.retryCount??0}/2`,"","## Error","```",t.error??"Unknown error","```","","## What to do",t.retryCount&&t.retryCount>=2?"- This task failed after 2 automatic retries. Consider rephrasing the task or breaking it into smaller pieces.":"- Click **Retry** to attempt again with an improved prompt.","- Or remove this item and create a new one with more context."].join(`
`),title:`Failed: ${t.task}`,mimeType:"text/markdown"};if(t.prUrl&&e.client)try{return{content:(await e.client.request("queue.prDiff",{prUrl:t.prUrl})).content,title:`PR: ${t.task}`,mimeType:"text/markdown"}}catch{return{content:`# ${t.task}

[Open in GitHub](${t.prUrl})`,title:t.task,mimeType:"text/markdown"}}if(t.outputPath&&e.client)try{return{content:(await e.client.request("queue.readOutput",{path:t.outputPath})).content,title:t.task,mimeType:"text/markdown"}}catch{return{content:`Output file not found: ${t.outputPath}`,title:t.task,mimeType:"text/plain"}}return{content:`# ${t.task}

No details available.`,title:t.task,mimeType:"text/markdown"}}async function fg(e,t){const n=e;n.missionControlData?.swarm&&(n.missionControlData={...n.missionControlData,swarm:{...n.missionControlData.swarm,selectedProjectId:t}}),await at(e,{quiet:!0})}async function gg(e,t,n,s){if(!e.client||!e.connected)return!1;try{const i=await e.client.request("godmode.delegation.steer",{projectId:t,issueTitle:n,instructions:s});return i?.success?(e.showToast("Steering sent","success",2e3),await at(e,{quiet:!0}),!0):(e.showToast(i?.error??"Failed to steer","error"),!1)}catch(i){return e.showToast("Failed to send steering","error"),console.error("[MissionControl] steer error:",i),!1}}const Ge=Object.freeze(Object.defineProperty({__proto__:null,AGENT_ROLE_NAMES:Xl,approveCodingTask:ug,approveQueueItem:dg,cancelCodingTask:cg,formatDuration:sg,loadAgentDetail:hg,loadMissionControl:at,retryQueueItem:pg,selectSwarmProject:fg,steerSwarmAgent:gg},Symbol.toStringTag,{value:"Module"}));function oa(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{ys(e,{quiet:!0})},5e3))}function ra(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function la(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&aa(e,{quiet:!0})},2e3))}function ca(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function da(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&bs(e)},3e3))}function ua(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}function Zl(e){e.missionControlPollInterval==null&&(e.missionControlPollInterval=window.setInterval(()=>{e.tab==="mission-control"&&at(e,{quiet:!0})},5e3))}function ec(e){e.missionControlPollInterval!=null&&(clearInterval(e.missionControlPollInterval),e.missionControlPollInterval=null)}async function $n(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.status",{});e.cronStatus=t}catch(t){e.cronError=String(t)}}async function ws(e){if(!(!e.client||!e.connected)&&!e.cronLoading){e.cronLoading=!0,e.cronError=null;try{const t=await e.client.request("cron.list",{includeDisabled:!0});e.cronJobs=Array.isArray(t.jobs)?t.jobs:[]}catch(t){e.cronError=String(t)}finally{e.cronLoading=!1}}}function mg(e){if(e.scheduleKind==="at"){const n=Date.parse(e.scheduleAt);if(!Number.isFinite(n))throw new Error("Invalid run time.");return{kind:"at",atMs:n}}if(e.scheduleKind==="every"){const n=Xn(e.everyAmount,0);if(n<=0)throw new Error("Invalid interval amount.");const s=e.everyUnit;return{kind:"every",everyMs:n*(s==="minutes"?6e4:s==="hours"?36e5:864e5)}}const t=e.cronExpr.trim();if(!t)throw new Error("Cron expression required.");return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0}}function vg(e){if(e.payloadKind==="systemEvent"){const i=e.payloadText.trim();if(!i)throw new Error("System event text required.");return{kind:"systemEvent",text:i}}const t=e.payloadText.trim();if(!t)throw new Error("Agent message required.");const n={kind:"agentTurn",message:t};e.deliver&&(n.deliver=!0),e.channel&&(n.channel=e.channel),e.to.trim()&&(n.to=e.to.trim());const s=Xn(e.timeoutSeconds,0);return s>0&&(n.timeoutSeconds=s),n}async function yg(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const t=mg(e.cronForm),n=vg(e.cronForm),s=e.cronForm.agentId.trim(),i={name:e.cronForm.name.trim(),description:e.cronForm.description.trim()||void 0,agentId:s||void 0,enabled:e.cronForm.enabled,schedule:t,sessionTarget:e.cronForm.sessionTarget,wakeMode:e.cronForm.wakeMode,payload:n,isolation:e.cronForm.postToMainPrefix.trim()&&e.cronForm.sessionTarget==="isolated"?{postToMainPrefix:e.cronForm.postToMainPrefix.trim()}:void 0};if(!i.name)throw new Error("Name required.");await e.client.request("cron.add",i),e.cronForm={...e.cronForm,name:"",description:"",payloadText:""},await ws(e),await $n(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function bg(e,t,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:t.id,patch:{enabled:n}}),await ws(e),await $n(e)}catch(s){e.cronError=String(s)}finally{e.cronBusy=!1}}}async function wg(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:t.id,mode:"force"}),await tc(e,t.id)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function Sg(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:t.id}),e.cronRunsJobId===t.id&&(e.cronRunsJobId=null,e.cronRuns=[]),await ws(e),await $n(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function tc(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("cron.runs",{id:t,limit:50});e.cronRunsJobId=t,e.cronRuns=Array.isArray(n.entries)?n.entries:[]}catch(n){e.cronError=String(n)}}async function Tt(e){if(!(!e.client||!e.connected)){e.guardrailsLoading=!0;try{const[t,n]=await Promise.all([e.client.request("guardrails.list",{}),e.client.request("guardrails.history",{limit:50})]);e.guardrailsData={gates:t.gates,activity:n.activity,custom:t.custom??[]}}catch(t){console.error("[Guardrails] load error:",t),e.guardrailsData=null}finally{e.guardrailsLoading=!1}}}async function kg(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,enabled:n});const i=e.guardrailsData?.gates.find(a=>a.id===t)?.name??t;e.showToast(`${i} ${n?"enabled":"disabled"}`,"success",2e3),await Tt(e)}catch(s){e.showToast("Failed to update guardrail","error"),console.error("[Guardrails] toggle error:",s)}}async function $g(e,t,n,s){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,thresholds:{[n]:s}}),e.showToast("Threshold updated","success",2e3),await Tt(e)}catch(i){e.showToast("Failed to update threshold","error"),console.error("[Guardrails] threshold error:",i)}}async function Ag(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.setCustom",{id:t,enabled:n}),e.showToast(`Custom rule ${n?"enabled":"disabled"}`,"success",2e3),await Tt(e)}catch(s){e.showToast("Failed to update custom rule","error"),console.error("[Guardrails] toggleCustom error:",s)}}async function Tg(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.removeCustom",{id:t}),e.showToast("Custom rule removed","success",2e3),await Tt(e)}catch(n){e.showToast("Failed to remove custom rule","error"),console.error("[Guardrails] deleteCustom error:",n)}}async function xg(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.addCustom",{guardrail:{name:t.name,description:"",enabled:!0,trigger:{tool:t.tool,patterns:t.patterns},action:t.action,message:t.message,...t.redirectTo?{redirectTo:t.redirectTo}:{}}}),e.showToast("Custom rule created","success",2e3),await Tt(e)}catch(n){e.showToast("Failed to create custom rule","error"),console.error("[Guardrails] addCustom error:",n)}}const Ot=Object.freeze(Object.defineProperty({__proto__:null,addCustomGuardrailFromUI:xg,deleteCustomGuardrail:Tg,loadGuardrails:Tt,toggleCustomGuardrail:Ag,toggleGuardrail:kg,updateGuardrailThreshold:$g},Symbol.toStringTag,{value:"Module"}));function _g(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.get",params:{nodeId:t}}:null}function Cg(e,t){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:t};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.set",params:{...t,nodeId:n}}:null}async function pa(e,t){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const n=_g(t);if(!n){e.lastError="Select a node before loading exec approvals.";return}const s=await e.client.request(n.method,n.params);Eg(e,s)}catch(n){e.lastError=String(n)}finally{e.execApprovalsLoading=!1}}}function Eg(e,t){e.execApprovalsSnapshot=t,e.execApprovalsDirty||(e.execApprovalsForm=bt(t.file??{}))}async function Lg(e,t){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const n=e.execApprovalsSnapshot?.hash;if(!n){e.lastError="Exec approvals hash missing; reload and retry.";return}const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},i=Cg(t,{file:s,baseHash:n});if(!i){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(i.method,i.params),e.execApprovalsDirty=!1,await pa(e,t)}catch(n){e.lastError=String(n)}finally{e.execApprovalsSaving=!1}}}function Pg(e,t,n){const s=bt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Ir(s,t,n),e.execApprovalsForm=s,e.execApprovalsDirty=!0}function Rg(e,t){const n=bt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Mr(n,t),e.execApprovalsForm=n,e.execApprovalsDirty=!0}const Ig=["~/godmode/memory/AGENT-DAY.md","~/godmode/AGENT-DAY.md"];function Mg(e){return[...[`~/godmode/memory/agent-day/${e}.md`,`~/godmode/memory/agent-log/${e}.md`,`~/godmode/memory/daily/${e}-agent-log.md`],...Ig]}function Dg(e){return["Needs Review","Active Sub-Agents","Completed Today","Queue","Feedback Log","AGENT-DAY"].filter(s=>e.includes(s)).length>=2}async function nc(e,t){try{const n=t?{date:t}:{},s=await e.request("dailyBrief.get",n);return!s||!s.content||!s.date?null:s}catch(n){return console.error("[MyDay] Failed to load daily brief:",n),null}}async function sc(e,t,n){const s=t||ie(),i="agentLog.get";try{const a=await e.request(i,{date:s});if(a?.content?.trim()&&a?.sourcePath)return{date:a.date||s,content:a.content,updatedAt:a.updatedAt||new Date().toISOString(),sourcePath:a.sourcePath}}catch(a){console.warn(`[MyDay] ${i} unavailable, falling back to files.read:`,a)}return Og(e,s)}async function Og(e,t){const n=Mg(t),s=i=>i.includes("AGENT-DAY.md");for(const i of n)try{const a=await e.request("files.read",{path:i,maxSize:1e6});if(!a?.content?.trim()||!Dg(a.content)||s(i)&&typeof a.modifiedAt=="number"&&ie(new Date(a.modifiedAt))!==t)continue;return{date:t,content:a.content,updatedAt:typeof a.modifiedAt=="number"?new Date(a.modifiedAt).toISOString():new Date().toISOString(),sourcePath:i}}catch{}return null}function Nt(e,t,n){return new Promise((s,i)=>{const a=setTimeout(()=>i(new Error(`${n} timed out after ${t}ms`)),t);e.then(o=>{clearTimeout(a),s(o)},o=>{clearTimeout(a),i(o)})})}const Ng={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function ic(e){if(!e.client||!e.connected)return[];e.todayTasksLoading=!0;try{const t=e.todaySelectedDate??ie(),[n,s]=await Promise.all([e.client.request("tasks.today",{date:t,includeCompleted:!0}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),i=new Map;for(const o of s.items)o.sourceTaskId&&(o.status==="processing"||o.status==="review"||o.status==="needs-review"||o.status==="done"||o.status==="failed")&&i.set(o.sourceTaskId,{status:o.status,type:o.type,roleName:Ng[o.type]??o.type,queueItemId:o.id});const a=(n.tasks??[]).map(o=>({id:o.id,title:o.title,status:o.status,project:o.project,dueDate:o.dueDate,priority:o.priority,createdAt:o.createdAt,completedAt:o.completedAt,queueStatus:i.get(o.id)??null}));return e.todayTasks=a,a}catch(t){return console.error("[MyDay] Failed to load today tasks:",t),e.todayTasks??[]}finally{e.todayTasksLoading=!1}}async function ac(e){if(!(!e.client||!e.connected)){e.inboxLoading=!0;try{const t=await e.client.request("inbox.list",{status:"pending",limit:50});e.inboxItems=t.items??[],e.inboxCount=t.pendingCount??0}catch(t){console.error("[MyDay] Failed to load inbox items:",t),e.inboxItems=[],e.inboxCount=0}finally{e.inboxLoading=!1}}}async function oc(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("trust.dashboard",{}),n=t.summaries.filter(s=>s.trustScore!==null);e.trustSummary={overallScore:t.overallScore,dailyStreak:t.dailyStreak,todayRated:t.todayRating!==null,workflowCount:t.workflows.length,highPerformers:n.filter(s=>(s.trustScore??0)>=8).length,needsAttention:n.filter(s=>(s.trustScore??10)<7).length}}catch{e.trustSummary=null}}async function Fg(e){if(!e.client||!e.connected)return[];try{const n=(await e.client.request("queue.list",{limit:50}))?.items??[],s=Date.now()-1440*60*1e3;return n.filter(i=>!(i.status!=="review"&&i.status!=="needs-review"&&i.status!=="done"||i.status==="done"&&(i.completedAt??0)<s)).sort((i,a)=>(a.completedAt??0)-(i.completedAt??0)).map(i=>({id:i.id,title:i.title,summary:i.result?.summary??i.description??"",status:i.status==="needs-review"?"review":i.status,completedAt:i.completedAt,outputPath:i.result?.outputPath,prUrl:i.result?.prUrl,sourceTaskId:i.sourceTaskId,persona:i.personaHint??void 0,source:i.source}))}catch(t){return console.error("[MyDay] Failed to load queue results for decision cards:",t),[]}}function Bg(e,t){e.request("dailyBrief.syncTasks",t?{date:t}:{}).catch(n=>{console.warn("[MyDay] dailyBrief.syncTasks failed (non-blocking):",n)})}async function cn(e){if(!(!e.client||!e.connected)){e.dailyBriefLoading=!0,e.dailyBriefError=null;try{e.dailyBrief=await nc(e.client,e.todaySelectedDate),e.loadBriefNotes&&await e.loadBriefNotes()}catch(t){e.dailyBriefError=t instanceof Error?t.message:"Failed to load daily brief",console.error("[MyDay] Brief load error:",t)}finally{e.dailyBriefLoading=!1}}}async function Ug(e,t){if(!(!e.client||!e.connected)){e.agentLogLoading=!0,e.agentLogError=null;try{e.agentLog=await sc(e.client,e.todaySelectedDate,t)}catch(n){e.agentLogError=n instanceof Error?n.message:"Failed to load agent log",console.error("[MyDay] Agent log load error:",n)}finally{e.agentLogLoading=!1}}}function rc(e){const t=e||ie(),n="VAULT",s=`01-Daily/${t}`,i=`obsidian://open?vault=${encodeURIComponent(n)}&file=${encodeURIComponent(s)}`;window.open(i,"_blank")}async function os(e){if(!e.client||!e.connected)return;e.myDayLoading=!0,e.myDayError=null,e.dailyBriefLoading=!0,e.agentLogLoading=!0,e.todayTasksLoading=!0;const t=e.todaySelectedDate,n=e.loadBriefNotes?Nt(e.loadBriefNotes(),5e3,"Brief Notes"):Promise.resolve(),s=await Promise.allSettled([Nt(nc(e.client,t),1e4,"Daily Brief"),n,Nt(sc(e.client,t),1e4,"Agent Log"),Nt(ic(e),8e3,"Today Tasks"),Nt(ac(e),5e3,"Inbox"),Nt(oc(e),5e3,"Trust Summary")]);e.dailyBrief=s[0].status==="fulfilled"?s[0].value:null,e.agentLog=s[2].status==="fulfilled"?s[2].value:null;const i=["Brief","Brief Notes","Agent Log","Today Tasks","Inbox","Trust"],a=s.map((o,c)=>o.status==="rejected"?{section:i[c],reason:o.reason}:null).filter(Boolean);if(a.length>0){for(const o of a)console.warn(`[MyDay] ${o.section} failed:`,o.reason);a.length===s.length&&(e.myDayError="Failed to load daily brief")}e.myDayLoading=!1,e.dailyBriefLoading=!1,e.agentLogLoading=!1,e.todayTasksLoading=!1}const dn=Object.freeze(Object.defineProperty({__proto__:null,loadAgentLogOnly:Ug,loadBriefOnly:cn,loadInboxItems:ac,loadMyDay:os,loadTodayQueueResults:Fg,loadTodayTasksWithQueueStatus:ic,loadTrustSummary:oc,openBriefInObsidian:rc,syncTodayTasks:Bg},Symbol.toStringTag,{value:"Module"}));async function ha(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const t=await e.client.request("system-presence",{});Array.isArray(t)?(e.presenceEntries=t,e.presenceStatus=t.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(t){e.presenceError=String(t)}finally{e.presenceLoading=!1}}}function jt(e,t,n){if(!t.trim())return;const s={...e.skillMessages};n?s[t]=n:delete s[t],e.skillMessages=s}function Ss(e){return e instanceof Error?e.message:String(e)}async function An(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const n=await e.client.request("skills.status",{});n&&(e.skillsReport=n)}catch(n){e.skillsError=Ss(n)}finally{e.skillsLoading=!1}}}async function Ii(e){if(!(!e.client||!e.connected)){e.godmodeSkillsLoading=!0;try{const t=await e.client.request("godmode.skills.list",{});e.godmodeSkills=t??null}catch(t){console.error("[Skills] Failed to load GodMode skills:",t),e.godmodeSkills=null}finally{e.godmodeSkillsLoading=!1}}}function Kg(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function zg(e,t,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:t,enabled:n}),await An(e),jt(e,t,{kind:"success",message:n?"Skill enabled":"Skill disabled"})}catch(s){const i=Ss(s);e.skillsError=i,jt(e,t,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function Wg(e,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const n=e.skillEdits[t]??"";await e.client.request("skills.update",{skillKey:t,apiKey:n}),await An(e),jt(e,t,{kind:"success",message:"API key saved"})}catch(n){const s=Ss(n);e.skillsError=s,jt(e,t,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function qg(e,t,n,s){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const i=await e.client.request("skills.install",{name:n,installId:s,timeoutMs:12e4});await An(e),jt(e,t,{kind:"success",message:i?.message??"Installed"})}catch(i){const a=Ss(i);e.skillsError=a,jt(e,t,{kind:"error",message:a})}finally{e.skillsBusyKey=null}}}async function lc(e){if(!(!e.client||!e.connected)){e.workLoading=!0,e.workError=null;try{const t=await e.client.request("projects.list",{});e.workProjects=t.projects??[]}catch(t){console.error("[Work] Failed to load:",t),e.workError=t instanceof Error?t.message:"Failed to load"}finally{e.workLoading=!1}}}async function jg(e,t){if(!e.client||!e.connected)return;const n=new Set(e.workDetailLoading??[]);n.add(t),e.workDetailLoading=n;try{const s=await e.client.request("projects.get",{id:t,includeFiles:!0,depth:2});if(s){const i=s.files??[];e.workProjectFiles={...e.workProjectFiles,[t]:i}}}catch(s){console.warn("[Work] Failed to load project details:",s)}finally{const s=new Set(e.workDetailLoading??[]);s.delete(t),e.workDetailLoading=s}}async function cc(e){if(!(!e.client||!e.connected)){e.workResourcesLoading=!0;try{const t=await e.client.request("resources.list",{limit:100});e.workResources=t.resources??[]}catch(t){console.warn("[Work] Failed to load resources:",t),e.workResources=[]}finally{e.workResourcesLoading=!1}}}async function Hg(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("resources.pin",{id:t,pinned:n}),e.workResources&&(e.workResources=e.workResources.map(s=>s.id===t?{...s,pinned:n}:s))}catch(s){console.warn("[Work] Failed to pin resource:",s)}}async function Vg(e,t){if(!(!e.client||!e.connected))try{await e.client.request("resources.delete",{id:t}),e.workResources&&(e.workResources=e.workResources.filter(n=>n.id!==t))}catch(n){console.warn("[Work] Failed to delete resource:",n)}}function ks(e,t=Date.now()){if(typeof e=="number"&&Number.isFinite(e))return new Date(e);if(typeof e=="string"){const n=Date.parse(e);if(Number.isFinite(n))return new Date(n)}return new Date(t)}function fa(e){return{id:e.id,name:e.name,emoji:e.emoji||"📁",type:e.type,path:e.path,artifactCount:e.artifactCount??0,sessionCount:e.sessionCount??0,lastUpdated:ks(e.lastUpdated,e.lastScanned)}}function ii(e){return{path:e.path,name:e.name,type:e.type,size:e.size,modified:ks(e.modified),isDirectory:e.isDirectory,searchText:e.searchText}}function Fo(e){return{id:e.id,key:e.key,title:e.title,created:ks(e.created),status:e.status,workspaceSubfolder:e.workspaceSubfolder}}function xt(e){return{id:e.id,title:e.title,status:e.status,project:e.project,dueDate:e.dueDate,priority:e.priority,createdAt:e.createdAt,completedAt:e.completedAt}}function dc(e){return e.map(t=>({name:t.name,path:t.path,type:t.type,fileType:t.fileType,size:t.size,modified:t.modified?ks(t.modified):void 0,children:t.children?dc(t.children):void 0}))}function Gg(e,t){return{...t,id:e.id,name:e.name,emoji:e.emoji,type:e.type,path:e.path,artifactCount:e.artifactCount,sessionCount:e.sessionCount,lastUpdated:e.lastUpdated}}async function $s(e){if(!e.client||!e.connected){e.workspaces=[],e.workspacesLoading=!1,e.workspacesError="Connect to gateway to see workspaces";return}e.workspacesLoading=!0,e.workspacesError=null;try{const t=await e.client.request("workspaces.list",{});if(e.workspaces=(t.workspaces??[]).map(fa),e.selectedWorkspace){const n=e.workspaces.find(s=>s.id===e.selectedWorkspace?.id);n&&(e.selectedWorkspace=Gg(n,e.selectedWorkspace))}}catch(t){console.error("[Workspaces] load failed:",t),e.workspacesError=t instanceof Error?t.message:"Failed to load workspaces",e.workspaces=[]}finally{e.workspacesLoading=!1}}async function As(e,t){if(!e.client||!e.connected)return null;try{const n=await e.client.request("workspaces.get",{id:t});return n.workspace?{...fa(n.workspace),pinned:(n.pinned??[]).map(ii),pinnedSessions:(n.pinnedSessions??[]).map(Fo),outputs:(n.outputs??[]).map(ii),folderTree:n.folderTree?dc(n.folderTree):void 0,sessions:(n.sessions??[]).map(Fo),tasks:(n.tasks??[]).map(xt),memory:(n.memory??[]).map(ii)}:null}catch(n){return console.error("[Workspaces] get failed:",n),null}}async function Yg(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("workspaces.readFile",n?{workspaceId:n,filePath:t}:{path:t});return s.content?{content:s.content,mime:s.contentType??s.mime??"text/plain"}:(s.error&&console.warn("[Workspaces] readFile failed:",s.error),null)}catch(s){return console.error("[Workspaces] readFile error:",s),null}}async function Qg(e){if(!(!e.client||!e.connected))try{e.workspacesLoading=!0,e.workspacesError=null,await e.client.request("workspaces.scan",{}),await $s(e)}catch(t){e.workspacesError=t instanceof Error?t.message:"Failed to scan workspaces"}finally{e.workspacesLoading=!1}}async function Jg(e,t){if(!t){e.selectedWorkspace=null;return}const n=await As(e,t.id);e.selectedWorkspace=n||{...t,pinned:[],pinnedSessions:[],outputs:[],sessions:[],tasks:[]}}async function Xg(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpin":"workspaces.pin",{workspaceId:t,filePath:n}),e.selectedWorkspace?.id===t){const i=await As(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] pin toggle failed:",i),!1}}async function Zg(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpinSession":"workspaces.pinSession",{workspaceId:t,sessionKey:n}),e.selectedWorkspace?.id===t){const i=await As(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] session pin toggle failed:",i),!1}}async function em(e,t){if(!e.client||!e.connected)return null;const n=String(t.name??"").trim();if(!n)return e.workspacesError="Workspace name is required",null;const s=t.type??"project",i=String(t.path??"").trim();try{const a=await e.client.request("workspaces.create",{name:n,type:s,...i?{path:i}:{}});if(!a.workspace)return e.workspacesError="Workspace creation returned no workspace",null;const o=fa(a.workspace),c=e.workspaces??[],d=new Map(c.map(u=>[u.id,u]));return d.set(o.id,o),e.workspaces=Array.from(d.values()).toSorted((u,l)=>l.lastUpdated.getTime()-u.lastUpdated.getTime()),e.workspacesError=null,o}catch(a){return console.error("[Workspaces] create failed:",a),e.workspacesError=a instanceof Error?a.message:"Failed to create workspace",null}}async function tm(e,t){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.delete",{id:t}),e.workspaces=(e.workspaces??[]).filter(n=>n.id!==t),e.selectedWorkspace?.id===t&&(e.selectedWorkspace=null),e.workspacesError=null,!0}catch(n){return console.error("[Workspaces] delete failed:",n),e.workspacesError=n instanceof Error?n.message:"Failed to delete workspace",!1}}function nm(e,t){e.workspacesSearchQuery=t}function sm(e){e.selectedWorkspace=null}async function im(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("workspaces.teamSetupPrompt",{});t?.prompt&&(e.chatMessage=t.prompt,e.setTab?.("chat"))}catch{e.chatMessage="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.",e.setTab?.("chat")}}function am(e,t){const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}async function om(e,t){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.byProject",{project:t})).tasks??[]).map(xt)}catch(n){return console.error("[Workspaces] loadWorkspaceTasks failed:",n),[]}}async function rm(e){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.list",{})).tasks??[]).map(xt)}catch(t){return console.error("[Workspaces] loadAllTasks failed:",t),[]}}const lm={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function cm(e){if(!e.client||!e.connected)return[];try{const[t,n]=await Promise.all([e.client.request("tasks.list",{}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),s=new Map;for(const i of n.items)i.sourceTaskId&&(i.status==="processing"||i.status==="review"||i.status==="needs-review"||i.status==="failed")&&s.set(i.sourceTaskId,{status:i.status==="needs-review"?"review":i.status,type:i.type,roleName:lm[i.type]??i.type,queueItemId:i.id});return(t.tasks??[]).map(i=>({...xt(i),queueStatus:s.get(i.id)??null}))}catch(t){return console.error("[Workspaces] loadAllTasksWithQueueStatus failed:",t),[]}}async function dm(e,t,n){if(!e.client||!e.connected)return null;const s=n==="complete"?"pending":"complete";try{const i=await e.client.request("tasks.update",{id:t,status:s});return xt(i)}catch(i){return console.error("[Workspaces] toggleTaskComplete failed:",i),null}}async function um(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.update",{id:t,...n});return xt(s)}catch(s){return console.error("[Workspaces] updateTask failed:",s),null}}async function pm(e,t){if(!e.client||!e.connected)return null;try{return await e.client.request("tasks.openSession",{taskId:t})}catch(n){return console.error("[Workspaces] startTask failed:",n),null}}async function hm(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.create",{title:t,project:n,source:"chat"});return xt(s)}catch(s){return console.error("[Workspaces] createTask failed:",s),null}}async function fm(e,t,n){if(!e.client||!e.connected)return null;try{return await e.client.request("workspaces.browseFolder",{workspaceId:t,folderPath:n})}catch(s){return console.error("[Workspaces] browseFolder failed:",s),null}}async function gm(e,t,n,s=50){if(!e.client||!e.connected)return[];try{return(await e.client.request("workspaces.search",{workspaceId:t,query:n,limit:s})).results??[]}catch(i){return console.error("[Workspaces] search failed:",i),[]}}async function mm(e,t,n){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.createFolder",{workspaceId:t,folderPath:n}),!0}catch(s){return console.error("[Workspaces] createFolder failed:",s),!1}}async function vm(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.moveFile",{workspaceId:t,sourcePath:n,destPath:s}),!0}catch(i){return console.error("[Workspaces] moveFile failed:",i),!1}}async function ym(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.renameFile",{workspaceId:t,filePath:n,newName:s}),!0}catch(i){return console.error("[Workspaces] renameFile failed:",i),!1}}const Yn=Object.freeze(Object.defineProperty({__proto__:null,browseWorkspaceFolder:fm,clearWorkspaceSelection:sm,createTask:hm,createWorkspace:em,createWorkspaceFolder:mm,deleteWorkspace:tm,getWorkspace:As,loadAllTasks:rm,loadAllTasksWithQueueStatus:cm,loadWorkspaceTasks:om,loadWorkspaces:$s,moveWorkspaceFile:vm,readWorkspaceFile:Yg,renameWorkspaceFile:ym,scanWorkspaces:Qg,searchWorkspaceFiles:gm,selectWorkspace:Jg,setWorkspacesSearchQuery:nm,startTask:pm,startTeamSetup:im,toggleTaskComplete:dm,toggleWorkspaceFolder:am,toggleWorkspacePin:Xg,toggleWorkspaceSessionPin:Zg,updateTask:um},Symbol.toStringTag,{value:"Module"})),uc="godmode.ui.settings.v1";function bm(){const e=new URLSearchParams(location.search),t=(()=>{const i=e.get("gatewayUrl");return i||(typeof window.__GODMODE_DEV__<"u"?"/ws":`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}`)})(),n=e.get("token")||"",s={gatewayUrl:t,token:n,sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{System:!0,__missionControl__:!1},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]};try{const i=localStorage.getItem(uc);if(!i)return s;const a=JSON.parse(i);return{gatewayUrl:e.get("gatewayUrl")||(typeof window.__GODMODE_DEV__<"u"?"/ws":typeof a.gatewayUrl=="string"&&a.gatewayUrl.trim()?a.gatewayUrl.trim():s.gatewayUrl),token:n||(typeof a.token=="string"?a.token:""),sessionKey:typeof a.sessionKey=="string"&&a.sessionKey.trim()?a.sessionKey.trim():s.sessionKey,lastActiveSessionKey:typeof a.lastActiveSessionKey=="string"&&a.lastActiveSessionKey.trim()?a.lastActiveSessionKey.trim():typeof a.sessionKey=="string"&&a.sessionKey.trim()||s.lastActiveSessionKey,theme:a.theme==="light"||a.theme==="dark"||a.theme==="system"||a.theme==="lifetrack"?a.theme:s.theme,chatFocusMode:typeof a.chatFocusMode=="boolean"?a.chatFocusMode:s.chatFocusMode,chatShowThinking:typeof a.chatShowThinking=="boolean"?a.chatShowThinking:s.chatShowThinking,splitRatio:typeof a.splitRatio=="number"&&a.splitRatio>=.4&&a.splitRatio<=.7?a.splitRatio:s.splitRatio,navCollapsed:typeof a.navCollapsed=="boolean"?a.navCollapsed:s.navCollapsed,navGroupsCollapsed:typeof a.navGroupsCollapsed=="object"&&a.navGroupsCollapsed!==null?a.navGroupsCollapsed:s.navGroupsCollapsed,openTabs:Array.isArray(a.openTabs)&&a.openTabs.every(o=>typeof o=="string")?a.openTabs:s.openTabs,tabLastViewed:typeof a.tabLastViewed=="object"&&a.tabLastViewed!==null?a.tabLastViewed:s.tabLastViewed,userName:typeof a.userName=="string"?a.userName.trim().slice(0,50):s.userName,userAvatar:typeof a.userAvatar=="string"?a.userAvatar.trim():s.userAvatar,chatParallelView:typeof a.chatParallelView=="boolean"?a.chatParallelView:s.chatParallelView,parallelLanes:Array.isArray(a.parallelLanes)&&a.parallelLanes.length===4?a.parallelLanes.map(o=>typeof o=="string"?o:null):s.parallelLanes}}catch{return s}}function wm(e){localStorage.setItem(uc,JSON.stringify(e))}const Sm=56,km="quantum-particles",$m="quantum-particle";let Xe=null,hn=null;function me(e,t){return Math.random()*(t-e)+e}function pc(){if(hc(),typeof document>"u")return;const e=document.querySelector(".shell");if(!e){hn=requestAnimationFrame(()=>{hn=null,pc()});return}Xe=document.createElement("div"),Xe.className=km,Object.assign(Xe.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"1",overflow:"hidden"});for(let t=0;t<Sm;t++){const n=document.createElement("div");n.className=$m;const s=me(2,5),i=me(.3,.65),a=me(15,35),o=me(0,12),c=me(5,95),d=me(5,95),u=me(-150,150),l=me(-200,200),p=me(-250,250),v=me(-350,350),y=me(.8,1.5);Object.assign(n.style,{position:"absolute",left:`${c}%`,top:`${d}%`,width:`${s}px`,height:`${s}px`,borderRadius:"50%",background:`rgba(235, 158, 15, ${me(.7,1)})`,boxShadow:`0 0 ${s*3}px rgba(235, 158, 15, ${i*.7})`,opacity:"0",willChange:"transform, opacity",animation:`quantum-float ${a}s ${o}s ease-in-out infinite`}),n.style.setProperty("--particle-opacity",String(i)),n.style.setProperty("--drift-x",`${u}px`),n.style.setProperty("--drift-y",`${l}px`),n.style.setProperty("--drift-end-x",`${p}px`),n.style.setProperty("--drift-end-y",`${v}px`),n.style.setProperty("--particle-scale-mid",String(y)),Xe.appendChild(n)}e.prepend(Xe)}function hc(){hn!==null&&(cancelAnimationFrame(hn),hn=null),Xe&&(Xe.remove(),Xe=null)}function Am(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"lifetrack"}function ga(e){return e==="system"?Am():e==="light"?"lifetrack":e}const Kn=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,Tm=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,rn=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},xm=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const i=globalThis.document??null;if(!i){t();return}const a=i.documentElement,o=i,c=Tm();if(!!o.startViewTransition&&!c){let u=.5,l=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")u=Kn(n.pointerClientX/window.innerWidth),l=Kn(n.pointerClientY/window.innerHeight);else if(n?.element){const v=n.element.getBoundingClientRect();v.width>0&&v.height>0&&typeof window<"u"&&(u=Kn((v.left+v.width/2)/window.innerWidth),l=Kn((v.top+v.height/2)/window.innerHeight))}a.style.setProperty("--theme-switch-x",`${u*100}%`),a.style.setProperty("--theme-switch-y",`${l*100}%`),a.classList.add("theme-transition");const p=setTimeout(()=>{rn(a)},1e3);try{const v=o.startViewTransition?.(()=>{t()});v?.finished?v.finished.finally(()=>{clearTimeout(p),rn(a)}):(clearTimeout(p),rn(a))}catch{clearTimeout(p),rn(a),t()}return}t(),rn(a)};function _m(e,t){const n=Array.isArray(e)?[...new Set(e.map(s=>s.trim()).filter(s=>s.length>0))]:[];if(n.length===0&&t){const s=t.toLowerCase();s==="main"||s==="agent:main:main"||s.endsWith(":main")||n.push(t)}return n}function Cm(e){const t={};if(!e||typeof e!="object")return t;for(const[n,s]of Object.entries(e)){const i=n.trim();!i||typeof s!="number"||!Number.isFinite(s)||(t[i]=Math.max(t[i]??0,s))}return t}function We(e,t){const n=t.sessionKey.trim()||"main",s=_m(t.openTabs,n),i=Cm(t.tabLastViewed),a={...t,sessionKey:n,openTabs:s,tabLastViewed:i,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||n};e.settings=a,wm(a),a.theme!==e.theme&&(e.theme=a.theme,xn(e,ga(a.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function ma(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&We(e,{...e.settings,lastActiveSessionKey:n})}function fc(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),n=t.get("token"),s=t.get("password"),i=t.get("session"),a=t.get("gatewayUrl");let o=!1;if(n!=null){const d=n.trim();d&&d!==e.settings.token&&We(e,{...e.settings,token:d}),t.delete("token"),o=!0}if(s!=null){const d=s.trim();d&&(e.password=d),t.delete("password"),o=!0}if(i!=null){const d=i.trim();if(d){e.sessionKey=d;const u=d.toLowerCase(),p=u==="main"||u==="agent:main:main"||u.endsWith(":main")||e.settings.openTabs.includes(d)?e.settings.openTabs:[...e.settings.openTabs,d];We(e,{...e.settings,sessionKey:d,lastActiveSessionKey:d,openTabs:p})}}if(a!=null){const d=a.trim();d&&d!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=d),t.delete("gatewayUrl"),o=!0}if(!o)return;const c=new URL(window.location.href);c.search=t.toString(),window.history.replaceState({},"",c.toString())}function va(e,t){const n=e.tab;if(n!==t&&(e.tab=t),n==="chat"&&t!=="chat"&&e.sessionKey===V&&e._loadAllyHistory?.(),n==="dashboards"&&t!=="dashboards"){const s=e;if(s.dashboardPreviousSessionKey&&s.activeDashboardId){const i=s.dashboardPreviousSessionKey;s.dashboardPreviousSessionKey=null,s.activeDashboardId=null,s.activeDashboardManifest=null,s.activeDashboardHtml=null,s.dashboardChatOpen=!1,e.sessionKey=i}}t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?oa(e):ra(e),t==="logs"?la(e):ca(e),t==="debug"?da(e):ua(e),t==="mission-control"?Zl(e):ec(e),Tn(e),ba(e,t,!1)}function gc(e,t,n){xm({nextTheme:t,applyTheme:()=>{e.theme=t,We(e,{...e.settings,theme:t}),xn(e,ga(t))},context:n,currentTheme:e.theme})}async function Tn(e){if(e.tab==="overview"&&await wa(e),(e.tab==="today"||e.tab==="my-day")&&(await os(e),E(()=>Promise.resolve().then(()=>dn),void 0,import.meta.url).then(async({loadTodayQueueResults:t})=>{e.todayQueueResults=await t(e)}).catch(()=>{})),e.tab==="work"&&await Promise.all([lc(e),cc(e)]),e.tab==="workspaces"&&(await $s(e),E(()=>Promise.resolve().then(()=>Yn),void 0,import.meta.url).then(async({loadAllTasksWithQueueStatus:t})=>{e.allTasks=await t(e)})),e.tab==="channels"&&await kc(e),e.tab==="instances"&&await ha(e),e.tab==="sessions"&&(await J(e),await kt(e)),e.tab==="cron"&&await Ts(e),e.tab==="skills"&&(await An(e),await Ii(e)),e.tab==="agents"){const{loadRoster:t}=await E(async()=>{const{loadRoster:n}=await Promise.resolve().then(()=>vh);return{loadRoster:n}},void 0,import.meta.url);await t(e)}if(e.tab==="nodes"&&(await ys(e),await it(e),await ze(e),await pa(e)),e.tab==="chat"&&(await $a(e),fe(e,!e.chatHasAutoScrolled),e.loadSessionResources?.()),e.tab==="options"){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}if(e.tab==="trust"){const t=e,n=[];typeof t.handleTrustLoad=="function"&&n.push(t.handleTrustLoad()),n.push(Tt(t)),n.push(J(t)),await Promise.all(n)}if(e.tab==="guardrails"){const t=e;typeof t.handleGuardrailsLoad=="function"&&await t.handleGuardrailsLoad()}if(e.tab==="mission-control"){const t=e;typeof t.handleMissionControlRefresh=="function"&&await t.handleMissionControlRefresh()}if(e.tab==="setup"){const t=e;typeof t.handleLoadCapabilities=="function"&&t.handleLoadCapabilities()}if(e.tab==="dashboards"){const t=e;typeof t.handleDashboardsRefresh=="function"&&await t.handleDashboardsRefresh()}if(e.tab==="second-brain"){const t=e;typeof t.handleSecondBrainRefresh=="function"&&await t.handleSecondBrainRefresh()}e.tab==="config"&&(await Dr(e),await ze(e)),e.tab==="debug"&&(await bs(e),e.eventLog=Df()),e.tab==="logs"&&(e.logsAtBottom=!0,await aa(e,{reset:!0}),Br(e,!0))}function mc(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?fs(e):au(window.location.pathname)}function vc(e){e.theme=e.settings.theme??"system",xn(e,ga(e.theme))}function xn(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t==="dark"?"dark":"light",t==="lifetrack"?pc():hc()}function yc(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&xn(e,n.matches?"dark":"lifetrack")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function bc(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function wc(e,t){if(typeof window>"u")return;const n=Kr(window.location.pathname,e.basePath)??"chat";ya(e,n),ba(e,n,t)}function Sc(e){if(typeof window>"u")return;const t=Kr(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();if(s){e.sessionKey=s;const i=e.settings.openTabs.includes(s)?e.settings.openTabs:[...e.settings.openTabs,s];We(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s,openTabs:i})}ya(e,t)}function ya(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?oa(e):ra(e),t==="logs"?la(e):ca(e),t==="debug"?da(e):ua(e),t==="mission-control"?Zl(e):ec(e),e.connected&&Tn(e)}function ba(e,t,n){if(typeof window>"u")return;const s=vn(zi(t,e.basePath)),i=vn(window.location.pathname),a=new URL(window.location.href);t==="chat"&&e.sessionKey?a.searchParams.set("session",e.sessionKey):a.searchParams.delete("session"),i!==s&&(a.pathname=s),n?window.history.replaceState({},"",a.toString()):window.history.pushState({},"",a.toString())}function Ae(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),n?window.history.replaceState({},"",s.toString()):window.history.pushState({},"",s.toString())}async function wa(e){await Promise.all([Te(e,!1),ha(e),J(e),$n(e),bs(e)])}async function kc(e){await Promise.all([Te(e,!0),Dr(e),ze(e)])}async function Ts(e){await Promise.all([Te(e,!1),$n(e),ws(e)])}const Em=Object.freeze(Object.defineProperty({__proto__:null,applyResolvedTheme:xn,applySettings:We,applySettingsFromUrl:fc,attachThemeListener:yc,detachThemeListener:bc,inferBasePath:mc,loadChannelsTab:kc,loadCron:Ts,loadOverview:wa,onPopState:Sc,refreshActiveTab:Tn,setLastActiveSessionKey:ma,setTab:va,setTabFromRoute:ya,setTheme:gc,syncTabWithLocation:wc,syncThemeWithSettings:vc,syncUrlWithSessionKey:Ae,syncUrlWithTab:ba},Symbol.toStringTag,{value:"Module"}));function rs(e){return e.chatSending||!!e.chatRunId}function Ke(e,t){const n=t??e.sessionKey,s=e.chatMessage.trim();if(s)e.chatDrafts={...e.chatDrafts,[n]:s};else{const{[n]:i,...a}=e.chatDrafts;e.chatDrafts=a}}function Ze(e,t){const n=t??e.sessionKey;e.chatMessage=e.chatDrafts[n]??""}function $c(e,t){const n=t??e.sessionKey,{[n]:s,...i}=e.chatDrafts;e.chatDrafts=i,n===e.sessionKey&&(e.chatMessage="")}function Ac(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function Lm(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function Sa(e){e.connected&&(e.chatMessage="",await Ji(e))}function Pm(e,t,n){const s=t.trim(),i=!!(n&&n.length>0);if(!s&&!i)return;const a=Date.now();e.chatQueue=[...e.chatQueue,{id:ms(),text:s,createdAt:a,attachments:i?n?.map(c=>({...c})):void 0}];const o=[];if(s&&o.push({type:"text",text:s}),i&&n)for(const c of n)o.push({type:"image",source:{type:"base64",media_type:c.mimeType,data:c.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:o,timestamp:a}],fe(e,!0)}async function Mi(e,t,n){Wi(e);const s=e;s.sessionKey&&s.workingSessions&&(s.workingSessions=new Set([...s.workingSessions,s.sessionKey])),n?.skipOptimisticUpdate||queueMicrotask(()=>{fe(e,!0)});const i=await Qi(e,t,n?.attachments,{skipOptimisticUpdate:n?.skipOptimisticUpdate});return!i&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!i&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),i&&(ma(e,e.sessionKey),e.chatAttachments=[]),i&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),i&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),fe(e,!0),i&&!e.chatRunId&&ka(e),i&&n?.refreshSessions&&(e.refreshSessionsAfterChat=!0),i}async function ka(e){if(!e.connected||rs(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await Mi(e,t.text,{attachments:t.attachments,skipOptimisticUpdate:!0})||(e.chatQueue=[t,...e.chatQueue])}function Tc(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function xc(e,t,n){if(!e.connected)return;const s=e.chatMessage,i=(t??e.chatMessage).trim(),a=e.chatAttachments??[],o=t==null?a:[],c=o.length>0;if(!i&&!c)return;if(Ac(i)){await Sa(e);return}const d=Lm(i);if(t==null&&(e.chatMessage="",$c(e)),n?.queue){Pm(e,i,o),rs(e)||await ka(e);return}if(rs(e)){await Ji(e),await new Promise(u=>setTimeout(u,50)),await Mi(e,i,{attachments:c?o:void 0,refreshSessions:d});return}await Mi(e,i,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:c?o:void 0,previousAttachments:t==null?a:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:d})}async function $a(e){await Promise.all([ce(e),J(e,{activeMinutes:0}),ls(e)]),fe(e,!0)}const _c=ka;function Rm(e){const t=Fr(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function Im(e,t){const n=fs(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function ls(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=Rm(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=Im(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const i=await s.json(),a=typeof i.avatarUrl=="string"?i.avatarUrl.trim():"";e.chatAvatarUrl=a||null}catch{e.chatAvatarUrl=null}}const ai=Object.freeze(Object.defineProperty({__proto__:null,clearDraft:$c,flushChatQueueForEvent:_c,handleAbortChat:Sa,handleSendChat:xc,isChatBusy:rs,isChatStopCommand:Ac,refreshChat:$a,refreshChatAvatar:ls,removeQueuedMessage:Tc,restoreDraft:Ze,saveDraft:Ke},Symbol.toStringTag,{value:"Module"})),Mm={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},Dm={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};function Cc(e){return new Date(e).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Om(e,t){const n=Gi(e),s=gs(n.role);if(s==="system")return null;if(s==="tool"){const c=[];for(const d of n.content)if(d.name&&c.push(`**Tool:** ${d.name}`),d.text){const u=d.text.length>2e3?d.text.slice(0,2e3)+`

... (truncated)`:d.text;c.push(u)}return c.length===0?null:`<details>
<summary>Tool result</summary>

${c.join(`

`)}

</details>`}const i=s==="user"||n.role==="User"?"User":t,a=[];for(const c of n.content)if(c.type==="text"&&c.text)a.push(c.text);else if(c.type==="tool_call"&&c.name){const d=c.args?`\`${JSON.stringify(c.args).slice(0,200)}\``:"";a.push(`> **Called tool:** \`${c.name}\` ${d}`)}if(a.length===0)return null;const o=Cc(n.timestamp);return`## ${i}
_${o}_

${a.join(`

`)}`}function Nm(){const e=new Date,t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${s}`}function Fm(e){return e.replace(/[^a-zA-Z0-9_-]/g,"-").replace(/-+/g,"-").slice(0,60)}function Bm(e,t,n){if(!e||e.length===0)return;const s=n||"Assistant",i=[];i.push("# Conversation Export"),i.push(`**Session:** \`${t}\`  `),i.push(`**Exported:** ${Cc(Date.now())}  `),i.push(`**Assistant:** ${s}`),i.push("---");for(const u of e){const l=Om(u,s);l&&i.push(l)}const a=i.join(`

`)+`
`,o=new Blob([a],{type:"text/markdown;charset=utf-8"}),c=URL.createObjectURL(o),d=document.createElement("a");d.href=c,d.download=`session-${Fm(t)}-${Nm()}.md`,document.body.appendChild(d),d.click(),requestAnimationFrame(()=>{document.body.removeChild(d),URL.revokeObjectURL(c)})}function Aa(){requestAnimationFrame(()=>{document.querySelector(".session-tab--active")?.scrollIntoView({behavior:"smooth",inline:"nearest",block:"nearest"})})}function Um(){requestAnimationFrame(()=>{document.querySelector(".chat-compose__textarea")?.focus()})}function xs(e){Ke(e);const n=`agent:main:webchat-${ms().slice(0,8)}`;e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,n],sessionKey:n,lastActiveSessionKey:n,tabLastViewed:{...e.settings.tabLastViewed,[n]:Date.now()}}),e.sessionKey=n,e.chatMessage="",e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),Ae(e,n,!0),ce(e),Aa(),Um()}function Di(e,t){const n=zi(t,e.basePath);return r`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||(s.preventDefault(),e.setTab(t))}}
      title=${yn(t)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${ou(t)}</span>
      <span class="nav-item__text">${yn(t)}</span>
    </a>
  `}function Ec(e){const t=e.onboarding,n=e.onboarding,s=e.onboarding?!1:e.settings.chatShowThinking,i=e.onboarding?!0:e.settings.chatFocusMode,a=r`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
      <path d="M21 3v5h-5"></path>
    </svg>
  `,o=r`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 7V4h3"></path>
      <path d="M20 7V4h-3"></path>
      <path d="M4 17v3h3"></path>
      <path d="M20 17v3h-3"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `,c=r`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 5v14"></path>
      <path d="M5 12h14"></path>
    </svg>
  `,d=r`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
  `;return r`
    <div class="chat-toolbar">
      <!-- New session button -->
      <button
        class="chat-toolbar__btn"
        @click=${()=>xs(e)}
        title="Start a new session (⌘⇧P)"
        aria-label="New session"
      >
        ${c}
      </button>
      <!-- Session picker (folder dropdown) -->
      <div class="session-picker-container">
        <button
          class="chat-toolbar__btn ${e.sessionPickerOpen?"active":""}"
          @click=${u=>{const p=u.currentTarget.getBoundingClientRect();e.sessionPickerPosition={top:p.bottom+8,right:window.innerWidth-p.right},e.sessionPickerOpen||J(e),e.handleToggleSessionPicker()}}
          title="Open sessions"
          aria-label="Open sessions"
          aria-expanded=${e.sessionPickerOpen}
        >
          ${q.folderOpen}
        </button>
        ${e.sessionPickerOpen?Wm(e):h}
      </div>
      <!-- Session search -->
      <div class="session-search-container">
        <button
          class="chat-toolbar__btn ${e.sessionSearchOpen?"active":""}"
          @click=${u=>e.handleToggleSessionSearch(u)}
          title="Search sessions"
          aria-label="Search session contents"
          aria-expanded=${e.sessionSearchOpen}
        >
          ${d}
        </button>
        ${e.sessionSearchOpen?zm(e):h}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),$a(e)}}
        title="Refresh chat data"
      >
        ${a}
      </button>
      <span class="chat-toolbar__separator"></span>
      <!-- Thinking toggle -->
      <button
        class="chat-toolbar__btn ${s?"active":""}"
        ?disabled=${t}
        @click=${()=>{t||e.applySettings({...e.settings,chatShowThinking:!e.settings.chatShowThinking})}}
        aria-pressed=${s}
        title=${t?"Disabled during onboarding":"Toggle assistant thinking/working output"}
      >
        ${q.brain}
      </button>
      <!-- Focus mode toggle -->
      <button
        class="chat-toolbar__btn ${i?"active":""}"
        ?disabled=${n}
        @click=${()=>{n||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})}}
        aria-pressed=${i}
        title=${n?"Disabled during onboarding":"Toggle focus mode (hide sidebar + page header)"}
      >
        ${o}
      </button>
      <!-- Private mode toggle -->
      <button
        class="chat-toolbar__btn ${e.chatPrivateMode?"active private-mode":""}"
        @click=${()=>e.handlePrivateModeToggle()}
        aria-pressed=${e.chatPrivateMode??!1}
        title=${e.chatPrivateMode?"Private mode ON — click to destroy session":"Start a private session (ephemeral, 24h auto-delete)"}
      >
        ${q.lock}
      </button>
      <!-- Sidebar toggle -->
      <button
        class="chat-toolbar__btn ${e.sidebarOpen?"active":""}"
        @click=${()=>{e.sidebarOpen?e.handleCloseSidebar():e.sidebarContent?e.sidebarOpen=!0:e.handleOpenSidebar(`_No file selected._

Click any file reference in the chat to open it here.`,{title:"Sidebar",mimeType:"text/markdown"})}}
        title=${e.sidebarOpen?"Close sidebar panel":"Open sidebar panel"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
          <path d="M15 3v18"></path>
        </svg>
      </button>
      <!-- Export conversation -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${!e.chatMessages||e.chatMessages.length===0}
        @click=${()=>{Bm(e.chatMessages,e.sessionKey,e.assistantName)}}
        title="Export conversation as markdown"
        aria-label="Export conversation as markdown"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 17V3"></path>
          <path d="m6 11 6 6 6-6"></path>
          <path d="M19 21H5"></path>
        </svg>
      </button>
    </div>
  `}function Km(e){const t=new Date,n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=new Date(n.getTime()-864e5);return{today:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=n),yesterday:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=s&&new Date(i.updatedAt)<n),older:e.filter(i=>!i.updatedAt||new Date(i.updatedAt)<s)}}let oi=null;function zm(e){if(!e.client||!e.connected)return r`
      <div
        class="session-search-dropdown"
        style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;const t=i=>{const a=i.target.value;e.sessionSearchQuery=a,oi&&clearTimeout(oi),oi=setTimeout(()=>{e.handleSessionSearchQuery(a)},300)},n=i=>{e.sessionSearchOpen=!1,e.sessionSearchQuery="",e.sessionSearchResults=[],Ke(e),e.settings.openTabs.includes(i)?(e.sessionKey=i,e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,i],sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.sessionKey=i),Ze(e,i),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),Ae(e,i,!0),ce(e).then(()=>{hs(e),fe(e,!0)})},s=i=>{const a=i.label??i.displayName??i.key,o=i.matches.length>0;return r`
      <div class="session-search-result" @click=${()=>n(i.key)}>
        <div class="session-search-result__header">
          <span class="session-search-result__name">${a}</span>
        </div>
        ${o?r`
              <div class="session-search-result__matches">
                ${i.matches.slice(0,2).map(c=>r`
                    <div class="session-search-result__match">
                      <span class="session-search-result__role">${c.role}:</span>
                      <span class="session-search-result__text">${c.text}</span>
                    </div>
                  `)}
              </div>
            `:h}
      </div>
    `};return r`
    <div
      class="session-search-dropdown"
      style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
    >
      <div class="session-search-input-container">
        <input
          type="text"
          class="session-search-input"
          placeholder="Search session contents..."
          .value=${e.sessionSearchQuery}
          @input=${t}
          @click=${i=>i.stopPropagation()}
          autofocus
        />
      </div>
      <div class="session-search-list">
        ${e.sessionSearchLoading?r`
                <div class="session-search-empty">Searching...</div>
              `:e.sessionSearchQuery.trim()===""?r`
                  <div class="session-search-empty">Type to search session contents</div>
                `:e.sessionSearchResults.length===0?r`
                    <div class="session-search-empty">No results found</div>
                  `:e.sessionSearchResults.map(s)}
      </div>
    </div>
  `}function Wm(e){const t=(e.sessionPickerSearch??"").toLowerCase().trim();if(!e.client||!e.connected)return r`
      <div
        class="session-picker-dropdown"
        style="top: ${e.sessionPickerPosition?.top??0}px; right: ${e.sessionPickerPosition?.right??0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Not connected</div>
        </div>
      </div>
    `;if(e.sessionsLoading)return r`
      <div
        class="session-picker-dropdown"
        style="top: ${e.sessionPickerPosition?.top??0}px; right: ${e.sessionPickerPosition?.right??0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Loading sessions...</div>
        </div>
      </div>
    `;let n=(e.sessionsResult?.sessions??[]).filter(v=>!e.settings.openTabs.includes(v.key));t&&(n=n.filter(v=>[v.label,v.displayName,v.key].filter(Boolean).some(b=>b.toLowerCase().includes(t))));const s=50,i=n.length,a=n.slice(0,s),o=Km(a),c=v=>{e.sessionPickerOpen=!1,e.sessionPickerSearch="",Ke(e),e.settings.openTabs.includes(v)?(e.sessionKey=v,e.applySettings({...e.settings,sessionKey:v,lastActiveSessionKey:v,tabLastViewed:{...e.settings.tabLastViewed,[v]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,v],sessionKey:v,lastActiveSessionKey:v,tabLastViewed:{...e.settings.tabLastViewed,[v]:Date.now()}}),e.sessionKey=v),Ze(e,v),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),Ae(e,v,!0),ce(e).then(()=>{hs(e),fe(e,!0)})},d=async(v,y)=>{if(v.stopPropagation(),!!window.confirm(`Delete session "${y}"?

Deletes the session entry and archives its transcript.`)&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.filter(k=>k.key!==y)}),e.client&&e.connected))try{await e.client.request("sessions.delete",{key:y,deleteTranscript:!0}),J(e)}catch(k){console.error("Failed to delete session:",k),J(e)}},u=v=>r`
    <div class="session-picker-item" @click=${()=>c(v.key)}>
      <span class="session-picker-item__status ${v.isActive?"active":""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${v.label??v.displayName??Pe.get(v.key)??v.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${v.updatedAt?r`<span class="session-picker-item__time">${pu(v.updatedAt)}</span>`:h}
        <button
          class="session-picker-item__close"
          @click=${y=>d(y,v.key)}
          title="Delete session"
          aria-label="Delete session"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `,l=(v,y)=>y.length===0?h:r`
      <div class="session-picker-group">
        <div class="session-picker-group__header">${v}</div>
        ${us(y,b=>b.key,u)}
      </div>
    `,p=o.today.length+o.yesterday.length+o.older.length;return r`
    <div
      class="session-picker-dropdown"
      style="top: ${e.sessionPickerPosition?.top??0}px; right: ${e.sessionPickerPosition?.right??0}px;"
    >
      <div class="session-picker-search">
        <input
          type="text"
          class="session-picker-search__input"
          placeholder="Search sessions..."
          .value=${e.sessionPickerSearch??""}
          @input=${v=>{e.sessionPickerSearch=v.target.value}}
          @click=${v=>v.stopPropagation()}
        />
      </div>
      <div class="session-picker-list">
        ${p===0?r`
                <div class="session-picker-empty">No other sessions</div>
              `:r`
              ${l("Today",o.today)}
              ${l("Yesterday",o.yesterday)}
              ${l("Older",o.older)}
              ${i>s?r`<div class="session-picker-overflow">
                    Showing ${s} of ${i} sessions. Use search to find more.
                  </div>`:h}
            `}
      </div>
    </div>
  `}const qm=["system","light","dark","lifetrack"];function Lc(e){const t=Math.max(0,qm.indexOf(e.theme)),n=s=>i=>{const o={element:i.currentTarget};(i.clientX||i.clientY)&&(o.pointerClientX=i.clientX,o.pointerClientY=i.clientY),e.setTheme(s,o)};return r`
    <div class="theme-toggle" style="--theme-index: ${t};">
      <div class="theme-toggle__track" role="group" aria-label="Theme">
        <span class="theme-toggle__indicator"></span>
        <button
          class="theme-toggle__button ${e.theme==="system"?"active":""}"
          @click=${n("system")}
          aria-pressed=${e.theme==="system"}
          aria-label="System theme"
          title="System"
        >
          ${Vm()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${jm()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${Hm()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="lifetrack"?"active":""}"
          @click=${n("lifetrack")}
          aria-pressed=${e.theme==="lifetrack"}
          aria-label="Lifetrack theme"
          title="Lifetrack"
        >
          ${Gm()}
        </button>
      </div>
    </div>
  `}function jm(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  `}function Hm(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function Vm(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function Gm(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"></path>
      <path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67L19 15z"></path>
    </svg>
  `}const Ye=Object.freeze(Object.defineProperty({__proto__:null,createNewSession:xs,renderChatControls:Ec,renderTab:Di,renderThemeToggle:Lc,scrollActiveTabIntoView:Aa},Symbol.toStringTag,{value:"Module"})),ri=new Set;function Bo(e){if(!(!e.connected||!e.client||!e.settings.chatParallelView))for(const t of e.settings.parallelLanes){const n=t?.trim();if(!n)continue;const i=vt(e.sessionsResult?.sessions,n)?.key??n;if(et.has(n)||et.has(i)||ri.has(i))continue;ri.add(i);const o=e.client;hl(o,i).then(c=>{i!==n&&c.length>0&&et.set(n,c)}).finally(()=>{ri.delete(i),e.applySettings({...e.settings})})}}function Ym(e){e.basePath=mc(),e._urlSettingsApplied||(fc(e),e._urlSettingsApplied=!0),wc(e,!0),vc(e),yc(e),window.addEventListener("popstate",e.popStateHandler),e.keydownHandler=t=>{if(e.tab!=="chat")return;if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="p"){t.preventDefault(),xs(e);return}if(!t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.key<"1"||t.key>"9")return;const n=parseInt(t.key,10)-1,s=e.settings.openTabs;if(n>=s.length)return;const i=s[n];i!==e.sessionKey&&(t.preventDefault(),Ke(e),e.sessionKey=i,Ze(e,i),e.chatLoading=!0,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.loadAssistantIdentity(),Ae(e,i,!0),ce(e).then(()=>{as(e)}))},window.addEventListener("keydown",e.keydownHandler),ia(e),e.tab==="nodes"&&oa(e),e.tab==="logs"&&la(e),e.tab==="debug"&&da(e)}function Qm(e){nu(e)}function Jm(e){window.removeEventListener("popstate",e.popStateHandler),window.removeEventListener("keydown",e.keydownHandler),e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null),e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null),ra(e),ca(e),ua(e),bc(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function vt(e,t){if(!e||!t)return;const n=e.find(o=>o.key===t);if(n)return n;const s=t.split(":"),i=s[s.length-1];if(i&&i.length>=4){const o=e.find(c=>c.key===i||c.key.endsWith(`:${i}`));if(o)return o}const a=t.replace(/^webchat:/,"");if(a!==t){const o=e.find(c=>c.key.endsWith(a)||c.key.endsWith(`:${a}`));if(o)return o}}function Xm(e,t){if(!t||t.length===0)return;const n=d=>{const u=d.toLowerCase();return u==="main"||u==="agent:main:main"||u.endsWith(":main")},s=(d,u)=>{const l=d?.sessionId?.trim();if(l)return`session:${l}`;if(d){const v=[d.kind,d.surface,d.subject,d.room,d.space,d.label,d.displayName].map(y=>String(y??"").trim().toLowerCase()).join("|");if(v.replace(/\|/g,"").length>0)return`meta:${v}`}return`key:${u}`};let i=!1;const a=new Map,o=[];for(const d of e.settings.openTabs){const u=d.trim();if(!u){i=!0;continue}if(n(u)){i=!0;continue}const l=vt(t,u),p=l?.key??u;p!==d&&(i=!0);const v=s(l,p);if(a.has(v)){i=!0;continue}a.set(v,p),o.push(p)}const c=o.length!==e.settings.openTabs.length;if(i||c){const d={};for(const[b,k]of Object.entries(e.settings.tabLastViewed)){const S=b.trim();if(!S||typeof k!="number"||!Number.isFinite(k))continue;const $=vt(t,S),T=s($,$?.key??S),P=a.get(T)??$?.key??S;d[P]=Math.max(d[P]??0,k)}const u=vt(t,e.sessionKey),l=s(u,u?.key??e.sessionKey.trim()),p=a.get(l)??u?.key??(e.sessionKey.trim()||o[0]||"main"),y=p==="main"||p.endsWith(":main")||o.includes(p)?p:o[0]||"main";e.applySettings({...e.settings,openTabs:o,sessionKey:y,lastActiveSessionKey:y,tabLastViewed:d}),e.sessionKey!==y&&(e.sessionKey=y)}}function Zm(e,t){if((t.has("sessionsResult")||t.has("settings"))&&e.sessionsResult?.sessions&&Xm(e,e.sessionsResult.sessions),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.settings.chatParallelView&&Bo(e),t.has("settings")&&e.connected&&e.settings.chatParallelView){const n=t.get("settings"),s=n?!n.chatParallelView:!0,i=!n||n.parallelLanes.some((a,o)=>a!==e.settings.parallelLanes[o]);(s||i)&&Bo(e)}if(t.has("sessionPickerOpen")&&(e.sessionPickerOpen?setTimeout(()=>{e.sessionPickerOpen&&(e.sessionPickerClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-picker-container"),a=s.closest(".session-picker-dropdown");!i&&!a&&(e.sessionPickerOpen=!1)},document.addEventListener("click",e.sessionPickerClickOutsideHandler,!0))},0):e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null)),t.has("sessionSearchOpen")&&(e.sessionSearchOpen?setTimeout(()=>{e.sessionSearchOpen&&(e.sessionSearchClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-search-container"),a=s.closest(".session-search-dropdown");!i&&!a&&(e.sessionSearchOpen=!1)},document.addEventListener("click",e.sessionSearchClickOutsideHandler,!0))},0):e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null)),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab==="chat"&&!e.chatLoading&&ce(e).then(()=>{as(e)}),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab!=="chat"&&Tn(e),e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("sessionKey")||t.has("tab"))){const n=t.has("tab"),s=t.has("sessionKey"),i=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;let a=!1;if(t.has("chatMessages")){const o=e.chatMessages;o[o.length-1]?.role==="user"&&(a=!0)}t.has("chatStream")&&(a=!1),(n||s||i)&&hs(e),fe(e,n||s||i||a||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&Br(e,t.has("tab")||t.has("logsAutoFollow"))}async function Uo(e,t){return!1}async function ev(e,t){return null}function Ko(e){return e.charAt(0).toUpperCase()||"A"}function zo(e){if(!e)return"";const t=new Date(e),n=t.getHours(),s=t.getMinutes().toString().padStart(2,"0"),i=n>=12?"PM":"AM";return`${n%12||12}:${s} ${i}`}function tv(e){e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,120)}px`}function Pc(e,t=80){return e.scrollHeight-e.scrollTop-e.clientHeight<t}function Rc(e){const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)}const Wo=new WeakMap;function nv(e){requestAnimationFrame(()=>{const t=document.querySelector(".ally-panel, .ally-inline");if(!t)return;const n=t.querySelector(".ally-panel__messages");if(!n)return;const s=Wo.get(n),i=s??{lastMsgCount:0,lastStreamLen:0},a=e.messages.length,o=e.stream?.length??0,c=a!==i.lastMsgCount||o>i.lastStreamLen;Wo.set(n,{lastMsgCount:a,lastStreamLen:o}),c&&(!s||Pc(n,120))&&Rc(t)})}function sv(e){const t=e.currentTarget,n=t.querySelector(".ally-jump-bottom");n&&n.classList.toggle("ally-jump-bottom--visible",!Pc(t))}function Ic(e,t){return e.allyAvatar?r`<img class=${t==="bubble"?"ally-bubble__avatar":"ally-panel__header-avatar"} src=${e.allyAvatar} alt=${e.allyName} />`:t==="header"?r`<span class="ally-panel__header-initial">${Ko(e.allyName)}</span>`:r`${Ko(e.allyName)}`}function qo(e){if(e.role==="assistant"&&e.content){const t=ve(e.content);return r`<div class="ally-msg__content chat-text">${yt(t)}</div>`}return r`<span class="ally-msg__content">${e.content}</span>`}function iv(e,t){return!e.actions||e.actions.length===0?h:r`
    <div class="ally-msg__actions">
      ${e.actions.map(n=>r`
          <button
            type="button"
            class="ally-msg__action-btn"
            @click=${()=>t?.(n.action,n.target,n.method,n.params)}
          >
            ${n.label}
          </button>
        `)}
    </div>
  `}function av(e,t,n){if(e.isNotification)return r`
      <div class="ally-msg ally-msg--notification" data-idx=${t}>
        ${qo(e)}
        ${iv(e,n)}
        ${e.timestamp?r`<div class="ally-msg__time">${zo(e.timestamp)}</div>`:h}
      </div>
    `;const s=e.role==="user"?"ally-msg--user":"ally-msg--assistant";return r`
    <div class="ally-msg ${s}" data-idx=${t}>
      ${qo(e)}
      ${e.timestamp?r`<div class="ally-msg__time">${zo(e.timestamp)}</div>`:h}
    </div>
  `}function ov(e){if(!e)return h;const t=Yr(e);return r`
    <div class="ally-msg ally-msg--streaming">
      <div class="ally-msg__content chat-text">${yt(t)}</div>
    </div>
  `}function rv(e){return e.connected?h:r`<div class="ally-panel__status ally-panel__status--disconnected">Disconnected</div>`}function lv(){return r`
    <div class="ally-msg ally-msg--assistant ally-msg--reading-indicator">
      <span class="chat-reading-indicator__dots">
        <span></span><span></span><span></span>
      </span>
    </div>
  `}function cv(e,t){const n=e.clipboardData?.items;if(!n)return;const s=[];for(const i of Array.from(n)){if(!i.type.startsWith("image/"))continue;const a=i.getAsFile();if(!a)continue;e.preventDefault();const o=new FileReader,c=`paste-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;o.onload=()=>{const d=o.result;t.onAttachmentsChange([...t.attachments,{id:c,dataUrl:d,mimeType:a.type,fileName:a.name||"screenshot.png",status:"ready"}])},o.readAsDataURL(a),s.push({id:c,dataUrl:"",mimeType:a.type,fileName:a.name,status:"reading"})}s.length>0&&t.onAttachmentsChange([...t.attachments,...s])}function dv(e){return e.attachments.length===0?h:r`
    <div class="ally-panel__attachments">
      ${e.attachments.map(t=>r`
          <div class="ally-panel__attachment">
            ${t.dataUrl?r`<img src=${t.dataUrl} alt=${t.fileName??"attachment"} class="ally-panel__attachment-img" />`:r`<span class="ally-panel__attachment-loading">...</span>`}
            <button
              type="button"
              class="ally-panel__attachment-remove"
              title="Remove"
              @click=${()=>e.onAttachmentsChange(e.attachments.filter(n=>n.id!==t.id))}
            >${q.x}</button>
          </div>
        `)}
    </div>
  `}function uv(e){const t=e.connected?`Message ${e.allyName}...`:"Reconnecting...",n=e.draft.trim()||e.attachments.length>0;return r`
    ${dv(e)}
    <div class="ally-panel__input">
      <textarea
        class="ally-panel__textarea"
        .value=${e.draft}
        ?disabled=${!e.connected||e.sending}
        placeholder=${t}
        rows="1"
        @input=${s=>{const i=s.target;tv(i),e.onDraftChange(i.value)}}
        @paste=${s=>cv(s,e)}
        @keydown=${s=>{s.key==="Enter"&&(s.isComposing||s.keyCode===229||s.shiftKey||e.connected&&(s.preventDefault(),e.onSend()))}}
      ></textarea>
      <button
        class="ally-panel__send-btn"
        type="button"
        ?disabled=${!e.connected||!n&&!e.sending}
        title="Send"
        @click=${()=>e.onSend()}
      >
        ${q.arrowUp}
      </button>
    </div>
  `}function pv(e){return r`
    <div class="ally-bubble">
      <button
        type="button"
        class="ally-bubble__btn"
        title="Chat with ${e.allyName}"
        aria-label="Open ${e.allyName} chat"
        @click=${()=>e.onToggle()}
      >
        ${Ic(e,"bubble")}
        ${e.isWorking?r`<span class="ally-bubble__working"></span>`:h}
      </button>
      ${e.unreadCount>0?r`<span class="ally-bubble__badge">${e.unreadCount>99?"99+":e.unreadCount}</span>`:h}
    </div>
  `}function Mc(e){return nv(e),r`
    <div class="ally-panel__header">
      <div class="ally-panel__header-left">
        ${Ic(e,"header")}
        <span class="ally-panel__header-name">${e.allyName}</span>
      </div>
      <div class="ally-panel__header-actions">
        <button
          type="button"
          class="ally-panel__header-btn"
          title="Open full chat"
          @click=${()=>e.onOpenFullChat()}
        >
          Full Chat
        </button>
        <button
          type="button"
          class="ally-panel__close-btn"
          title="Minimize"
          aria-label="Minimize ${e.allyName} chat"
          @click=${()=>e.onToggle()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    </div>

    ${rv(e)}

    <div class="ally-panel__messages" @scroll=${sv}>
      ${e.messages.length===0&&!e.stream?r`<div class="ally-panel__empty">
            Start a conversation with ${e.allyName}
          </div>`:h}
      ${e.messages.map((t,n)=>av(t,n,e.onAction))}
      ${e.stream?ov(e.stream):h}
      ${(e.isWorking||e.sending)&&!e.stream?lv():h}
      <button
        type="button"
        class="ally-jump-bottom"
        title="Jump to latest"
        @click=${t=>{const n=t.currentTarget.closest(".ally-panel, .ally-inline");n&&Rc(n)}}
      >${q.chevronDown}</button>
    </div>

    ${uv(e)}
  `}function hv(e){return e.open?r`
    <div class="ally-panel">
      ${Mc(e)}
    </div>
  `:pv(e)}function fv(e){return e.open?r`
    <div class="ally-inline">
      ${Mc(e)}
    </div>
  `:h}function Re(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function Dc(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(Re(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function _s(e){return e.filter(t=>typeof t=="string").join(".")}function be(e,t){const n=_s(e),s=t[n];if(s)return s;const i=n.split(".");for(const[a,o]of Object.entries(t)){if(!a.includes("*"))continue;const c=a.split(".");if(c.length!==i.length)continue;let d=!0;for(let u=0;u<i.length;u+=1)if(c[u]!=="*"&&c[u]!==i[u]){d=!1;break}if(d)return o}}function je(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function gv(e){const t=_s(e).toLowerCase();return t.includes("token")||t.includes("password")||t.includes("secret")||t.includes("apikey")||t.endsWith("key")}function Kt(e){return typeof e=="string"?e:e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}const mv=new Set(["title","description","default","nullable"]);function vv(e){return Object.keys(e??{}).filter(n=>!mv.has(n)).length===0}function yv(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const kn={chevronDown:r`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,plus:r`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,minus:r`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,trash:r`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  `,edit:r`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  `};function qe(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:c}=e,d=e.showLabel??!0,u=Re(t),l=be(s,i),p=l?.label??t.title??je(String(s.at(-1))),v=l?.help??t.description,y=_s(s);if(a.has(y))return r`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${p}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const k=(t.anyOf??t.oneOf??[]).filter(A=>!(A.type==="null"||Array.isArray(A.type)&&A.type.includes("null")));if(k.length===1)return qe({...e,schema:k[0]});const S=A=>{if(A.const!==void 0)return A.const;if(A.enum&&A.enum.length===1)return A.enum[0]},$=k.map(S),T=$.every(A=>A!==void 0);if(T&&$.length>0&&$.length<=5){const A=n??t.default;return r`
        <div class="cfg-field">
          ${d?r`<label class="cfg-field__label">${p}</label>`:h}
          ${v?r`<div class="cfg-field__help">${v}</div>`:h}
          <div class="cfg-segmented">
            ${$.map((C,x)=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${C===A||Kt(C)===Kt(A)?"active":""}"
                ?disabled=${o}
                @click=${()=>c(s,C)}
              >
                ${Kt(C)}
              </button>
            `)}
          </div>
        </div>
      `}if(T&&$.length>5)return Ho({...e,options:$,value:n??t.default});const P=new Set(k.map(A=>Re(A)).filter(Boolean)),L=new Set([...P].map(A=>A==="integer"?"number":A));if([...L].every(A=>["string","number","boolean"].includes(A))){const A=L.has("string"),C=L.has("number");if(L.has("boolean")&&L.size===1)return qe({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(A||C)return jo({...e,inputType:C&&!A?"number":"text"})}}if(t.enum){const b=t.enum;if(b.length<=5){const k=n??t.default;return r`
        <div class="cfg-field">
          ${d?r`<label class="cfg-field__label">${p}</label>`:h}
          ${v?r`<div class="cfg-field__help">${v}</div>`:h}
          <div class="cfg-segmented">
            ${b.map(S=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${S===k||String(S)===String(k)?"active":""}"
                ?disabled=${o}
                @click=${()=>c(s,S)}
              >
                ${String(S)}
              </button>
            `)}
          </div>
        </div>
      `}return Ho({...e,options:b,value:n??t.default})}if(u==="object")return wv(e);if(u==="array")return Sv(e);if(u==="boolean"){const b=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return r`
      <label class="cfg-toggle-row ${o?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${p}</span>
          ${v?r`<span class="cfg-toggle-row__help">${v}</span>`:h}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${b}
            ?disabled=${o}
            @change=${k=>c(s,k.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return u==="number"||u==="integer"?bv(e):u==="string"?jo({...e,inputType:"text"}):r`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${p}</div>
      <div class="cfg-field__error">Unsupported type: ${u}. Use Raw mode.</div>
    </div>
  `}function jo(e){const{schema:t,value:n,path:s,hints:i,disabled:a,onPatch:o,inputType:c}=e,d=e.showLabel??!0,u=be(s,i),l=u?.label??t.title??je(String(s.at(-1))),p=u?.help??t.description,v=u?.sensitive??gv(s),y=u?.placeholder??(v?"••••":t.default!==void 0?`Default: ${Kt(t.default)}`:""),b=n??"";return r`
    <div class="cfg-field">
      ${d?r`<label class="cfg-field__label">${l}</label>`:h}
      ${p?r`<div class="cfg-field__help">${p}</div>`:h}
      <div class="cfg-input-wrap">
        <input
          type=${v?"password":c}
          class="cfg-input"
          placeholder=${y}
          .value=${Kt(b)}
          ?disabled=${a}
          @input=${k=>{const S=k.target.value;if(c==="number"){if(S.trim()===""){o(s,void 0);return}const $=Number(S);o(s,Number.isNaN($)?S:$);return}o(s,S)}}
          @change=${k=>{if(c==="number")return;const S=k.target.value;o(s,S.trim())}}
        />
        ${t.default!==void 0?r`
          <button
            type="button"
            class="cfg-input__reset"
            title="Reset to default"
            ?disabled=${a}
            @click=${()=>o(s,t.default)}
          >↺</button>
        `:h}
      </div>
    </div>
  `}function bv(e){const{schema:t,value:n,path:s,hints:i,disabled:a,onPatch:o}=e,c=e.showLabel??!0,d=be(s,i),u=d?.label??t.title??je(String(s.at(-1))),l=d?.help??t.description,p=n??t.default??"",v=typeof p=="number"?p:0;return r`
    <div class="cfg-field">
      ${c?r`<label class="cfg-field__label">${u}</label>`:h}
      ${l?r`<div class="cfg-field__help">${l}</div>`:h}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(s,v-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${Kt(p)}
          ?disabled=${a}
          @input=${y=>{const b=y.target.value,k=b===""?void 0:Number(b);o(s,k)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(s,v+1)}
        >+</button>
      </div>
    </div>
  `}function Ho(e){const{schema:t,value:n,path:s,hints:i,disabled:a,options:o,onPatch:c}=e,d=e.showLabel??!0,u=be(s,i),l=u?.label??t.title??je(String(s.at(-1))),p=u?.help??t.description,v=n??t.default,y=o.findIndex(k=>k===v||String(k)===String(v)),b="__unset__";return r`
    <div class="cfg-field">
      ${d?r`<label class="cfg-field__label">${l}</label>`:h}
      ${p?r`<div class="cfg-field__help">${p}</div>`:h}
      <select
        class="cfg-select"
        ?disabled=${a}
        .value=${y>=0?String(y):b}
        @change=${k=>{const S=k.target.value;c(s,S===b?void 0:o[Number(S)])}}
      >
        <option value=${b}>Select...</option>
        ${o.map((k,S)=>r`
          <option value=${String(S)}>${String(k)}</option>
        `)}
      </select>
    </div>
  `}function wv(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:c}=e;e.showLabel;const d=be(s,i),u=d?.label??t.title??je(String(s.at(-1))),l=d?.help??t.description,p=n??t.default,v=p&&typeof p=="object"&&!Array.isArray(p)?p:{},y=t.properties??{},k=Object.entries(y).toSorted((P,L)=>{const A=be([...s,P[0]],i)?.order??0,C=be([...s,L[0]],i)?.order??0;return A!==C?A-C:P[0].localeCompare(L[0])}),S=new Set(Object.keys(y)),$=t.additionalProperties,T=!!$&&typeof $=="object";return s.length===1?r`
      <div class="cfg-fields">
        ${k.map(([P,L])=>qe({schema:L,value:v[P],path:[...s,P],hints:i,unsupported:a,disabled:o,onPatch:c}))}
        ${T?Vo({schema:$,value:v,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:S,onPatch:c}):h}
      </div>
    `:r`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${u}</span>
        <span class="cfg-object__chevron">${kn.chevronDown}</span>
      </summary>
      ${l?r`<div class="cfg-object__help">${l}</div>`:h}
      <div class="cfg-object__content">
        ${k.map(([P,L])=>qe({schema:L,value:v[P],path:[...s,P],hints:i,unsupported:a,disabled:o,onPatch:c}))}
        ${T?Vo({schema:$,value:v,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:S,onPatch:c}):h}
      </div>
    </details>
  `}function Sv(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:c}=e,d=e.showLabel??!0,u=be(s,i),l=u?.label??t.title??je(String(s.at(-1))),p=u?.help??t.description,v=Array.isArray(t.items)?t.items[0]:t.items;if(!v)return r`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${l}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const y=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return r`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${d?r`<span class="cfg-array__label">${l}</span>`:h}
        <span class="cfg-array__count">${y.length} item${y.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${o}
          @click=${()=>{const b=[...y,Dc(v)];c(s,b)}}
        >
          <span class="cfg-array__add-icon">${kn.plus}</span>
          Add
        </button>
      </div>
      ${p?r`<div class="cfg-array__help">${p}</div>`:h}

      ${y.length===0?r`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:r`
        <div class="cfg-array__items">
          ${y.map((b,k)=>r`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${k+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${o}
                  @click=${()=>{const S=[...y];S.splice(k,1),c(s,S)}}
                >
                  ${kn.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${qe({schema:v,value:b,path:[...s,k],hints:i,unsupported:a,disabled:o,showLabel:!1,onPatch:c})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function Vo(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:c,onPatch:d}=e,u=vv(t),l=Object.entries(n??{}).filter(([p])=>!c.has(p));return r`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${o}
          @click=${()=>{const p={...n};let v=1,y=`custom-${v}`;for(;y in p;)v+=1,y=`custom-${v}`;p[y]=u?{}:Dc(t),d(s,p)}}
        >
          <span class="cfg-map__add-icon">${kn.plus}</span>
          Add Entry
        </button>
      </div>

      ${l.length===0?r`
              <div class="cfg-map__empty">No custom entries.</div>
            `:r`
        <div class="cfg-map__items">
          ${l.map(([p,v])=>{const y=[...s,p],b=yv(v);return r`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${p}
                    ?disabled=${o}
                    @change=${k=>{const S=k.target.value.trim();if(!S||S===p)return;const $={...n};S in $||($[S]=$[p],delete $[p],d(s,$))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${u?r`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${b}
                          ?disabled=${o}
                          @change=${k=>{const S=k.target,$=S.value.trim();if(!$){d(y,void 0);return}try{d(y,JSON.parse($))}catch{S.value=b}}}
                        ></textarea>
                      `:qe({schema:t,value:v,path:y,hints:i,unsupported:a,disabled:o,showLabel:!1,onPatch:d})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  ?disabled=${o}
                  @click=${()=>{const k={...n};delete k[p],d(s,k)}}
                >
                  ${kn.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const Go={env:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M15 4V2"></path>
      <path d="M15 16v-2"></path>
      <path d="M8 9h2"></path>
      <path d="M20 9h2"></path>
      <path d="M17.8 11.8 19 13"></path>
      <path d="M15 9h0"></path>
      <path d="M17.8 6.2 19 5"></path>
      <path d="m3 21 9-9"></path>
      <path d="M12.2 6.2 11 5"></path>
    </svg>
  `,meta:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 2v6"></path>
      <path d="m4.93 10.93 4.24 4.24"></path>
      <path d="M2 12h6"></path>
      <path d="m4.93 13.07 4.24-4.24"></path>
      <path d="M12 22v-6"></path>
      <path d="m19.07 13.07-4.24-4.24"></path>
      <path d="M22 12h-6"></path>
      <path d="m19.07 10.93-4.24 4.24"></path>
    </svg>
  `,default:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},Ta={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"},user:{label:"User Profile",description:"Your display name and avatar"}};function Yo(e){return Go[e]??Go.default}function kv(e,t,n){if(!n)return!0;const s=n.toLowerCase(),i=Ta[e];return e.toLowerCase().includes(s)||i&&(i.label.toLowerCase().includes(s)||i.description.toLowerCase().includes(s))?!0:un(t,s)}function un(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,i]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||un(i,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const i of s)if(i&&un(i,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&un(e.additionalProperties,t))return!0;const n=e.anyOf??e.oneOf??e.allOf;if(n){for(const s of n)if(s&&un(s,t))return!0}return!1}function $v(e){if(!e.schema)return r`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,n=e.value??{};if(Re(t)!=="object"||!t.properties)return r`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),i=t.properties,a=e.searchQuery??"",o=e.activeSection,c=e.activeSubsection??null,u=Object.entries(i).toSorted((p,v)=>{const y=be([p[0]],e.uiHints)?.order??50,b=be([v[0]],e.uiHints)?.order??50;return y!==b?y-b:p[0].localeCompare(v[0])}).filter(([p,v])=>!(o&&p!==o||a&&!kv(p,v,a)));let l=null;if(o&&c&&u.length===1){const p=u[0]?.[1];p&&Re(p)==="object"&&p.properties&&p.properties[c]&&(l={sectionKey:o,subsectionKey:c,schema:p.properties[c]})}return u.length===0?r`
      <div class="config-empty">
        <div class="config-empty__icon">${q.search}</div>
        <div class="config-empty__text">
          ${a?`No settings match "${a}"`:"No settings in this section"}
        </div>
      </div>
    `:r`
    <div class="config-form config-form--modern">
      ${l?(()=>{const{sectionKey:p,subsectionKey:v,schema:y}=l,b=be([p,v],e.uiHints),k=b?.label??y.title??je(v),S=b?.help??y.description??"",$=n[p],T=$&&typeof $=="object"?$[v]:void 0,P=`config-section-${p}-${v}`;return r`
              <section class="config-section-card" id=${P}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Yo(p)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${k}</h3>
                    ${S?r`<p class="config-section-card__desc">${S}</p>`:h}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${qe({schema:y,value:T,path:[p,v],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():u.map(([p,v])=>{const y=Ta[p]??{label:p.charAt(0).toUpperCase()+p.slice(1),description:v.description??""};return r`
              <section class="config-section-card" id="config-section-${p}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Yo(p)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${y.label}</h3>
                    ${y.description?r`<p class="config-section-card__desc">${y.description}</p>`:h}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${qe({schema:v,value:n[p],path:[p],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const Av=new Set(["title","description","default","nullable"]);function Tv(e){return Object.keys(e??{}).filter(n=>!Av.has(n)).length===0}function Oc(e){const t=e.filter(i=>i!=null),n=t.length!==e.length,s=[];for(const i of t)s.some(a=>Object.is(a,i))||s.push(i);return{enumValues:s,nullable:n}}function Nc(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:fn(e,[])}function fn(e,t){const n=new Set,s={...e},i=_s(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const c=xv(e,t);return c||{schema:e,unsupportedPaths:[i]}}const a=Array.isArray(e.type)&&e.type.includes("null"),o=Re(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=o??e.type,s.nullable=a||e.nullable,s.enum){const{enumValues:c,nullable:d}=Oc(s.enum);s.enum=c,d&&(s.nullable=!0),c.length===0&&n.add(i)}if(o==="object"){const c=e.properties??{},d={};for(const[u,l]of Object.entries(c)){const p=fn(l,[...t,u]);p.schema&&(d[u]=p.schema);for(const v of p.unsupportedPaths)n.add(v)}if(s.properties=d,e.additionalProperties===!0)n.add(i);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!Tv(e.additionalProperties)){const u=fn(e.additionalProperties,[...t,"*"]);s.additionalProperties=u.schema??e.additionalProperties,u.unsupportedPaths.length>0&&n.add(i)}}else if(o==="array"){const c=Array.isArray(e.items)?e.items[0]:e.items;if(!c)n.add(i);else{const d=fn(c,[...t,"*"]);s.items=d.schema??c,d.unsupportedPaths.length>0&&n.add(i)}}else o!=="string"&&o!=="number"&&o!=="integer"&&o!=="boolean"&&!s.enum&&n.add(i);return{schema:s,unsupportedPaths:Array.from(n)}}function xv(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],i=[];let a=!1;for(const c of n){if(!c||typeof c!="object")return null;if(Array.isArray(c.enum)){const{enumValues:d,nullable:u}=Oc(c.enum);s.push(...d),u&&(a=!0);continue}if("const"in c){if(c.const==null){a=!0;continue}s.push(c.const);continue}if(Re(c)==="null"){a=!0;continue}i.push(c)}if(s.length>0&&i.length===0){const c=[];for(const d of s)c.some(u=>Object.is(u,d))||c.push(d);return{schema:{...e,enum:c,nullable:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(i.length===1){const c=fn(i[0],t);return c.schema&&(c.schema.nullable=a||c.schema.nullable),c}const o=new Set(["string","number","integer","boolean"]);return i.length>0&&s.length===0&&i.every(c=>c.type&&o.has(String(c.type)))?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}function _v(e,t){let n=e;for(const s of t){if(!n)return null;const i=Re(n);if(i==="object"){const a=n.properties??{};if(typeof s=="string"&&a[s]){n=a[s];continue}const o=n.additionalProperties;if(typeof s=="string"&&o&&typeof o=="object"){n=o;continue}return null}if(i==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function Cv(e,t){const s=(e.channels??{})[t],i=e[t];return(s&&typeof s=="object"?s:null)??(i&&typeof i=="object"?i:null)??{}}function Ev(e){const t=Nc(e.schema),n=t.schema;if(!n)return r`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=_v(n,["channels",e.channelId]);if(!s)return r`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const i=e.configValue??{},a=Cv(i,e.channelId);return r`
    <div class="config-form">
      ${qe({schema:s,value:a,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
  `}function He(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return r`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?r`
              <div class="muted">Loading config schema…</div>
            `:Ev({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
      <div class="row" style="margin-top: 12px;">
        <button
          class="btn primary"
          ?disabled=${s||!n.configFormDirty}
          @click=${()=>n.onConfigSave()}
        >
          ${n.configSaving?"Saving…":"Save"}
        </button>
        <button
          class="btn"
          ?disabled=${s}
          @click=${()=>n.onConfigReload()}
        >
          Reload
        </button>
      </div>
    </div>
  `}function Lv(e){const{props:t,discord:n,accountCountLabel:s}=e;return r`
    <div class="card">
      <div class="card-title">Discord</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?B(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?B(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${He({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Pv(e){const{props:t,googleChat:n,accountCountLabel:s}=e;return r`
    <div class="card">
      <div class="card-title">Google Chat</div>
      <div class="card-sub">Chat API webhook status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?n.configured?"Yes":"No":"n/a"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?n.running?"Yes":"No":"n/a"}</span>
        </div>
        <div>
          <span class="label">Credential</span>
          <span>${n?.credentialSource??"n/a"}</span>
        </div>
        <div>
          <span class="label">Audience</span>
          <span>
            ${n?.audienceType?`${n.audienceType}${n.audience?` · ${n.audience}`:""}`:"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?B(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?B(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${He({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Rv(e){const{props:t,imessage:n,accountCountLabel:s}=e;return r`
    <div class="card">
      <div class="card-title">iMessage</div>
      <div class="card-sub">macOS bridge status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?B(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?B(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:h}

      ${He({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Qo(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function Iv(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:i,profileFormState:a,profileFormCallbacks:o,onEditProfile:c}=e,d=s[0],u=n?.configured??d?.configured??!1,l=n?.running??d?.running??!1,p=n?.publicKey??d?.publicKey,v=n?.lastStartAt??d?.lastStartAt??null,y=n?.lastError??d?.lastError??null,b=s.length>1,k=a!=null,S=T=>{const P=T.publicKey,L=T.profile,A=L?.displayName??L?.name??T.name??T.accountId;return r`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${A}</div>
          <div class="account-card-id">${T.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${T.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${T.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${P??""}">${Qo(P)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${T.lastInboundAt?B(T.lastInboundAt):"n/a"}</span>
          </div>
          ${T.lastError?r`
                <div class="account-card-error">${T.lastError}</div>
              `:h}
        </div>
      </div>
    `},$=()=>{if(k&&o)return Fd({state:a,callbacks:o,accountId:s[0]?.accountId??"default"});const T=d?.profile??n?.profile,{name:P,displayName:L,about:A,picture:C,nip05:x}=T??{},F=P||L||A||C||x;return r`
      <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 500;">Profile</div>
          ${u?r`
                <button
                  class="btn btn-sm"
                  @click=${c}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:h}
        </div>
        ${F?r`
              <div class="status-list">
                ${C?r`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${C}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${M=>{M.target.style.display="none"}}
                        />
                      </div>
                    `:h}
                ${P?r`<div><span class="label">Name</span><span>${P}</span></div>`:h}
                ${L?r`<div><span class="label">Display Name</span><span>${L}</span></div>`:h}
                ${A?r`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${A}</span></div>`:h}
                ${x?r`<div><span class="label">NIP-05</span><span>${x}</span></div>`:h}
              </div>
            `:r`
                <div style="color: var(--text-muted); font-size: 13px">
                  No profile set. Click "Edit Profile" to add your name, bio, and avatar.
                </div>
              `}
      </div>
    `};return r`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${i}

      ${b?r`
            <div class="account-card-list">
              ${s.map(T=>S(T))}
            </div>
          `:r`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${u?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${l?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Public Key</span>
                <span class="monospace" title="${p??""}"
                  >${Qo(p)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${v?B(v):"n/a"}</span>
              </div>
            </div>
          `}

      ${y?r`<div class="callout danger" style="margin-top: 12px;">${y}</div>`:h}

      ${$()}

      ${He({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function Mv(e){if(!e&&e!==0)return"n/a";const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);return n<60?`${n}m`:`${Math.round(n/60)}h`}function Dv(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const i=s[e],a=typeof i?.configured=="boolean"&&i.configured,o=typeof i?.running=="boolean"&&i.running,c=typeof i?.connected=="boolean"&&i.connected,u=(n.channelAccounts?.[e]??[]).some(l=>l.configured||l.running||l.connected);return a||o||c||u}function Ov(e,t){return t?.[e]?.length??0}function Fc(e,t){const n=Ov(e,t);return n<2?h:r`<div class="account-count">Accounts (${n})</div>`}function Nv(e){const{props:t,signal:n,accountCountLabel:s}=e;return r`
    <div class="card">
      <div class="card-title">Signal</div>
      <div class="card-sub">signal-cli status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Base URL</span>
          <span>${n?.baseUrl??"n/a"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?B(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?B(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${He({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Fv(e){const{props:t,slack:n,accountCountLabel:s}=e;return r`
    <div class="card">
      <div class="card-title">Slack</div>
      <div class="card-sub">Socket mode status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?B(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?B(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${He({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Bv(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:i}=e,a=s.length>1,o=c=>{const u=c.probe?.bot?.username,l=c.name||c.accountId;return r`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${u?`@${u}`:l}
          </div>
          <div class="account-card-id">${c.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${c.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${c.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${c.lastInboundAt?B(c.lastInboundAt):"n/a"}</span>
          </div>
          ${c.lastError?r`
                <div class="account-card-error">
                  ${c.lastError}
                </div>
              `:h}
        </div>
      </div>
    `};return r`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${i}

      ${a?r`
            <div class="account-card-list">
              ${s.map(c=>o(c))}
            </div>
          `:r`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${n?.configured?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${n?.running?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Mode</span>
                <span>${n?.mode??"n/a"}</span>
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${n?.lastStartAt?B(n.lastStartAt):"n/a"}</span>
              </div>
              <div>
                <span class="label">Last probe</span>
                <span>${n?.lastProbeAt?B(n.lastProbeAt):"n/a"}</span>
              </div>
            </div>
          `}

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${He({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Uv(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return r`
    <div class="card">
      <div class="card-title">WhatsApp</div>
      <div class="card-sub">Link WhatsApp Web and monitor connection health.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Linked</span>
          <span>${n?.linked?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Connected</span>
          <span>${n?.connected?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last connect</span>
          <span>
            ${n?.lastConnectedAt?B(n.lastConnectedAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last message</span>
          <span>
            ${n?.lastMessageAt?B(n.lastMessageAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Auth age</span>
          <span>
            ${n?.authAgeMs!=null?Mv(n.authAgeMs):"n/a"}
          </span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${t.whatsappMessage?r`<div class="callout" style="margin-top: 12px;">
            ${t.whatsappMessage}
          </div>`:h}

      ${t.whatsappQrDataUrl?r`<div class="qr-wrap">
            <img src=${t.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:h}

      <div class="row" style="margin-top: 14px; flex-wrap: wrap;">
        <button
          class="btn primary"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppStart(!1)}
        >
          ${t.whatsappBusy?"Working…":"Show QR"}
        </button>
        <button
          class="btn"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppStart(!0)}
        >
          Relink
        </button>
        <button
          class="btn"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppWait()}
        >
          Wait for scan
        </button>
        <button
          class="btn danger"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppLogout()}
        >
          Logout
        </button>
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Refresh
        </button>
      </div>

      ${He({channelId:"whatsapp",props:t})}
    </div>
  `}function Kv(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,i=t?.discord??null;t?.googlechat;const a=t?.slack??null,o=t?.signal??null,c=t?.imessage??null,d=t?.nostr??null,l=zv(e.snapshot).map((p,v)=>({key:p,enabled:Dv(p,e),order:v})).toSorted((p,v)=>p.enabled!==v.enabled?p.enabled?-1:1:p.order-v.order);return r`
    <section class="grid grid-cols-2">
      ${l.map(p=>Wv(p.key,e,{whatsapp:n,telegram:s,discord:i,slack:a,signal:o,imessage:c,nostr:d,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?B(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:h}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function zv(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function Wv(e,t,n){const s=Fc(e,n.channelAccounts);switch(e){case"whatsapp":return Uv({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return Bv({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return Lv({props:t,discord:n.discord,accountCountLabel:s});case"googlechat":return Pv({props:t,accountCountLabel:s});case"slack":return Fv({props:t,slack:n.slack,accountCountLabel:s});case"signal":return Nv({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return Rv({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const i=n.channelAccounts?.nostr??[],a=i[0],o=a?.accountId??"default",c=a?.profile??null,d=t.nostrProfileAccountId===o?t.nostrProfileFormState:null,u=d?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return Iv({props:t,nostr:n.nostr,nostrAccounts:i,accountCountLabel:s,profileFormState:d,profileFormCallbacks:u,onEditProfile:()=>t.onNostrProfileEdit(o,c)})}default:return qv(e,t,n.channelAccounts??{})}}function qv(e,t,n){const s=Hv(t.snapshot,e),i=t.snapshot?.channels?.[e],a=typeof i?.configured=="boolean"?i.configured:void 0,o=typeof i?.running=="boolean"?i.running:void 0,c=typeof i?.connected=="boolean"?i.connected:void 0,d=typeof i?.lastError=="string"?i.lastError:void 0,u=n[e]??[],l=Fc(e,n);return r`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${l}

      ${u.length>0?r`
            <div class="account-card-list">
              ${u.map(p=>Qv(p))}
            </div>
          `:r`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${a==null?"n/a":a?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${o==null?"n/a":o?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Connected</span>
                <span>${c==null?"n/a":c?"Yes":"No"}</span>
              </div>
            </div>
          `}

      ${d?r`<div class="callout danger" style="margin-top: 12px;">
            ${d}
          </div>`:h}

      ${He({channelId:e,props:t})}
    </div>
  `}function jv(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function Hv(e,t){return jv(e)[t]?.label??e?.channelLabels?.[t]??t}const Vv=600*1e3;function Bc(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<Vv:!1}function Gv(e){return e.running?"Yes":Bc(e)?"Active":"No"}function Yv(e){return e.connected===!0?"Yes":e.connected===!1?"No":Bc(e)?"Active":"n/a"}function Qv(e){const t=Gv(e),n=Yv(e);return r`
    <div class="account-card">
      <div class="account-card-header">
        <div class="account-card-title">${e.name||e.accountId}</div>
        <div class="account-card-id">${e.accountId}</div>
      </div>
      <div class="status-list account-card-status">
        <div>
          <span class="label">Running</span>
          <span>${t}</span>
        </div>
        <div>
          <span class="label">Configured</span>
          <span>${e.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Connected</span>
          <span>${n}</span>
        </div>
        <div>
          <span class="label">Last inbound</span>
          <span>${e.lastInboundAt?B(e.lastInboundAt):"n/a"}</span>
        </div>
        ${e.lastError?r`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:h}
      </div>
    </div>
  `}const gn=(e,t)=>{const n=e._$AN;if(n===void 0)return!1;for(const s of n)s._$AO?.(t,!1),gn(s,t);return!0},cs=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Uc=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),Zv(t)}};function Jv(e){this._$AN!==void 0?(cs(this),this._$AM=e,Uc(this)):this._$AM=e}function Xv(e,t=!1,n=0){const s=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(s))for(let a=n;a<s.length;a++)gn(s[a],!1),cs(s[a]);else s!=null&&(gn(s,!1),cs(s));else gn(this,e)}const Zv=e=>{e.type==wd.CHILD&&(e._$AP??=Xv,e._$AQ??=Jv)};class ey extends yd{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,s){super._$AT(t,n,s),Uc(this),this.isConnected=t._$AU}_$AO(t,n=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),n&&(gn(this,t),cs(this))}setValue(t){if(bd(this._$Ct))this._$Ct._$AI(t,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}const li=new WeakMap,ty=Sd(class extends ey{render(e){return h}update(e,[t]){const n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),h}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let n=li.get(t);n===void 0&&(n=new WeakMap,li.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?li.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function ny(e){return typeof e.content=="string"?e.content:typeof e.text=="string"?e.text:Array.isArray(e.content)?e.content.map(t=>typeof t.text=="string"?t.text:"").join(`
`):""}const sy=["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"];function iy(e){const t=typeof e.role=="string"?e.role.toLowerCase():"";if(t!=="user"&&t!=="system")return!1;const n=ny(e).trim();if(!n)return!1;let s=n;if((n.includes("<system-context")||n.includes("<godmode-context"))&&(s=n.replace(/<system-context[\s\S]*?<\/system-context>/gi,"").replace(/<godmode-context[\s\S]*?<\/godmode-context>/gi,"").trim(),!s)||s.startsWith("Read HEARTBEAT.md")||s.startsWith("Read CONSCIOUSNESS.md")||s.startsWith("Pre-compaction memory flush")||s.startsWith("pre-compaction memory flush")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(s)||s==="NO_REPLY"||s.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(s)||s.startsWith("# WORKING.md")||s.startsWith("# MISTAKES.md")||/(?:VERIFIED|FIXED|NEW):\s/.test(s)&&/✅|🟡|☑/.test(s)&&s.length>300||/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(s)||/^\[GodMode Context:[^\]]*\]\s*$/.test(s)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(s)||/^##?\s*Persistence Protocol/i.test(s)||/^##?\s*Core (?:Behaviors|Principles)/i.test(s)||/^##?\s*Your Role as \w+/i.test(s)||/^##\s*Your Team\s*\(Agent Roster\)/i.test(s)&&s.indexOf(`

## `)===-1||/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)&&s.length>200||/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(s))return!0;const i=s.toLowerCase();return sy.filter(a=>i.includes(a)).length>=2}const Jo=25*1024*1024,Xo=50*1024*1024,Zo=20;function ci(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:e<1024*1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:`${(e/(1024*1024*1024)).toFixed(1)} GB`}function xa(e,t=0){const n=[],s=[];let i=t;const a=Array.from(e);for(const o of a){if(n.length>=Zo){s.push(`Maximum ${Zo} files allowed per upload`);break}if(o.size>Jo){s.push(`"${o.name}" is too large (${ci(o.size)}). Max ${ci(Jo)}. For larger files, mention the file path instead.`);continue}if(i+o.size>Xo){s.push(`Total upload size exceeds ${ci(Xo)} limit`);break}i+=o.size,n.push(o)}return{validFiles:n,errors:s}}const ay=new Set(["md","markdown","mdx"]),oy=new Set(["htm","html"]),ry=new Set(["avif","bmp","gif","heic","heif","jpeg","jpg","png","svg","svgz","webp"]);function Kc(e){const t=e.replaceAll("\\","/").trim();if(!t)return e;const n=t.split("/");return n[n.length-1]||t}function ly(e){if(!e)return null;const n=e.trim().toLowerCase().split(".").pop()??"";return n?ay.has(n)?"text/markdown":oy.has(n)?"text/html":ry.has(n)?n==="svg"||n==="svgz"?"image/svg+xml":n==="jpg"?"image/jpeg":`image/${n}`:n==="pdf"?"application/pdf":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":null:null}function zc(e){const t=e.mimeType?.split(";")[0]?.trim().toLowerCase()??"";if(t)return t;const n=e.content?.trim()??"";if(n.startsWith("data:image/")){const s=/^data:(image\/[^;]+);/i.exec(n);return s?.[1]?s[1].toLowerCase():"image/*"}return ly(e.filePath??null)??"text/markdown"}function cy(e){if(!e.startsWith("file://"))return null;let t=e.slice(7);return t.startsWith("/~/")&&(t="~"+t.slice(2)),decodeURIComponent(t)}function dy(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const i=s.getAttribute("href");if(!i)return;const a=cy(i);a&&(e.preventDefault(),e.stopPropagation(),t(a))}function uy(e){if(e.error)return r`
      <div class="callout danger">${e.error}</div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(!e.content)return r`
      <div class="muted">No content available</div>
    `;const t=zc(e),n=e.content,s=n.trim();if(t.startsWith("image/"))return s.startsWith("data:image/")?r`
        <div class="sidebar-image">
          <img src=${s} alt=${Kc(e.filePath??"Image preview")} />
        </div>
      `:r`
      <div class="callout">
        Image preview unavailable for this payload format.
      </div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(t==="application/pdf")return s.startsWith("data:application/pdf")?r`<iframe
        class="sidebar-html-frame sidebar-pdf-frame"
        src=${s}
        type="application/pdf"
      ></iframe>`:r`
      <div class="callout">
        PDF preview unavailable. Use "Open in Browser" to view.
      </div>
    `;if(t==="text/html"||t==="application/xhtml+xml"){const i=new Blob([n],{type:"text/html"}),a=URL.createObjectURL(i);return r`<iframe
      class="sidebar-html-frame"
      src=${a}
      sandbox="allow-same-origin allow-top-navigation-by-user-activation allow-popups"
      @load=${o=>{URL.revokeObjectURL(a);const c=o.target;try{const d=c.contentDocument?.documentElement?.scrollHeight;d&&(c.style.height=`${d}px`)}catch{}}}
    ></iframe>`}if(t==="text/markdown"||t==="text/x-markdown"){const i=Gr(n);return r`<div
      class="sidebar-markdown"
      @click=${a=>dy(a,e.onOpenFile)}
    >${yt(ve(i))}</div>`}return r`<pre class="sidebar-plain">${n}</pre>`}function py(e){const t=zc(e);return t==="text/html"||t==="application/xhtml+xml"}function hy(e){const t=new Blob([e],{type:"text/html"}),n=URL.createObjectURL(t);window.open(n,"_blank","noopener,noreferrer")}function Oi(e){const t=e.title?.trim()||"Tool Output",n=py(e)&&e.content;return r`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${t}</div>
          ${e.filePath?r`<div class="sidebar-path" title=${e.filePath}>${e.filePath}</div>`:h}
        </div>
        <div class="sidebar-header-actions">
          ${e.onPushToDrive&&e.filePath?r`<div class="sidebar-drive-wrap">
                <button
                  class="btn sidebar-open-browser-btn${e.driveUploading?" sidebar-drive-uploading":""}"
                  title="Push to Google Drive"
                  ?disabled=${e.driveUploading}
                  @click=${()=>e.driveUploading?void 0:e.onToggleDrivePicker?e.onToggleDrivePicker():e.onPushToDrive(e.filePath)}
                >${e.driveUploading?"Uploading...":"⬆ Drive"}</button>
                ${e.showDrivePicker&&e.driveAccounts&&!e.driveUploading?r`<div class="sidebar-drive-picker">
                      ${e.driveAccounts.length===0?r`<div class="sidebar-drive-item sidebar-drive-empty">No Google accounts configured</div>`:e.driveAccounts.map(s=>r`
                              <button
                                class="sidebar-drive-item"
                                @click=${()=>{e.onPushToDrive(e.filePath,s.email),e.onToggleDrivePicker?.()}}
                                title=${s.email}
                              >
                                <span class="sidebar-drive-label">${s.email.split("@")[0]}</span>
                                <span class="sidebar-drive-domain">@${s.email.split("@")[1]}</span>
                              </button>
                            `)}
                    </div>`:h}
              </div>`:h}
          ${n?r`<button
                class="btn sidebar-open-browser-btn"
                title="Open in browser tab"
                @click=${()=>hy(e.content)}
              >Open in Browser</button>`:h}
          <button @click=${e.onClose} class="btn" title="Close sidebar">
            ${q.x}
          </button>
        </div>
      </div>
      ${fy(e)}
      <div class="sidebar-content">${uy(e)}</div>
    </div>
  `}function fy(e){if(e.resource)return r`
      <div class="sidebar-resource-bar">
        <span class="resource-type-badge">${e.resource.type.replace("_"," ")}</span>
        <span style="flex: 1;">${e.resource.title}</span>
        <button
          class="sidebar-pin-btn${e.resource.pinned?" pinned":""}"
          title=${e.resource.pinned?"Unpin":"Pin"}
          @click=${()=>e.onToggleResourcePin?.(e.resource.id,!e.resource.pinned)}
        >${e.resource.pinned?"★":"☆"}</button>
      </div>
    `;if(e.filePath&&e.onSaveAsResource){const t=e.title?.trim()||Kc(e.filePath);return r`
      <div class="sidebar-resource-bar">
        <button
          class="sidebar-save-resource-btn"
          @click=${()=>e.onSaveAsResource(e.filePath,t)}
        >Save as Resource</button>
      </div>
    `}return h}var gy=Object.defineProperty,my=Object.getOwnPropertyDescriptor,_n=(e,t,n,s)=>{for(var i=s>1?void 0:s?my(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&gy(t,n,i),i};let At=class extends Pr{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.direction="horizontal",this.isDragging=!1,this.startPos=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startPos=this.direction==="vertical"?e.clientY:e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=this.direction==="vertical",s=n?t.getBoundingClientRect().height:t.getBoundingClientRect().width,o=((n?e.clientY:e.clientX)-this.startPos)/s;let c=this.startRatio+o;c=Math.max(this.minRatio,Math.min(this.maxRatio,c)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:c},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return r``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};At.styles=kd`
    :host {
      flex-shrink: 0;
      position: relative;
      transition: background 150ms ease-out;
    }

    :host([direction="vertical"]) {
      height: 4px;
      width: 100%;
      cursor: row-resize;
      background: var(--border, #333);
    }

    :host(:not([direction="vertical"])) {
      width: 4px;
      cursor: col-resize;
      background: var(--border, #333);
    }

    :host::before {
      content: "";
      position: absolute;
    }

    :host(:not([direction="vertical"]))::before {
      top: 0;
      left: -4px;
      right: -4px;
      bottom: 0;
    }

    :host([direction="vertical"])::before {
      left: 0;
      top: -4px;
      bottom: -4px;
      right: 0;
    }

    :host(:hover) {
      background: var(--accent, #007bff);
    }

    :host(.dragging) {
      background: var(--accent, #007bff);
    }
  `;_n([ps({type:Number})],At.prototype,"splitRatio",2);_n([ps({type:Number})],At.prototype,"minRatio",2);_n([ps({type:Number})],At.prototype,"maxRatio",2);_n([ps({type:String})],At.prototype,"direction",2);At=_n([Rr("resizable-divider")],At);const vy=5e3;function er(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function yy(e){const t=e.sessions?.sessions?.find(i=>i.key===e.sessionKey);if(!t)return null;const n=t.totalTokens??0,s=t.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return s<=0?null:n/s}function by(e){const t=yy(e);if(t===null)return h;const n=Math.round(t*100),s=n>=90?"danger":n>=70?"warn":"ok",i=e.sessions?.sessions?.find(l=>l.key===e.sessionKey),a=i?.totalTokens??0,o=i?.contextTokens??e.sessions?.defaults?.contextTokens??2e5,c=n>=90?"Soul + identity only":n>=70?"P0 + P1 active":"Full context",d=n>=90?r`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--danger">
          Schedule, tasks, skill cards trimmed
        </span>`:n>=70?r`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--warn">
            Meetings, cron, queue review trimmed
          </span>`:h,u=r`
    <span class="chat-context-badge__tier ${n<70?"active":"trimmed"}">P3 Safety nudges, onboarding</span>
    <span class="chat-context-badge__tier ${n<70?"active":"trimmed"}">P2 Meetings, cron, queue review</span>
    <span class="chat-context-badge__tier ${n<90?"active":"trimmed"}">P1 Schedule, tasks, skill cards</span>
    <span class="chat-context-badge__tier active">P0 Soul, identity, memory</span>
  `;return r`
    <button
      type="button"
      class="chat-context-badge chat-context-badge--${s}"
      role="status"
      aria-label="Context window: ${n}% used (${c}). Click to compact."
      @click=${()=>e.onCompact?.()}
      ?disabled=${!e.connected}
    >
      ${n}%
      <span class="chat-context-badge__bar">
        <span class="chat-context-badge__bar-fill chat-context-badge__bar-fill--${s}" style="width:${n}%"></span>
      </span>
      <span class="chat-context-badge__tooltip">
        <span class="chat-context-badge__tooltip-header">
          ${a.toLocaleString()} / ${o.toLocaleString()} tokens
        </span>
        ${d}
        <span class="chat-context-badge__tier-list">${u}</span>
        <span class="chat-context-badge__tooltip-action">Click to compact</span>
      </span>
    </button>
  `}function wy(e){return e?e.active?r`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${q.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<vy?r`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${q.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `:h:h}function _a(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function Sy(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy")}function ky(e,t){e.preventDefault(),e.stopPropagation(),t.classList.add("chat--drag-over")}function $y(e,t){e.preventDefault(),e.stopPropagation();const n=t.getBoundingClientRect();(e.clientX<=n.left||e.clientX>=n.right||e.clientY<=n.top||e.clientY>=n.bottom)&&t.classList.remove("chat--drag-over")}function Ay(e,t){e.preventDefault(),e.stopPropagation(),e.currentTarget.classList.remove("chat--drag-over");const s=e.dataTransfer?.files;if(!s||s.length===0||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((l,p)=>l+(p.dataUrl?.length??0)*.75,0),{validFiles:o,errors:c}=xa(s,a);for(const l of c)t.showToast?.(l,"error");if(o.length===0)return;const d=[];let u=o.length;for(const l of o){const p=new FileReader;p.addEventListener("load",()=>{const v=p.result;d.push({id:_a(),dataUrl:v,mimeType:l.type||"application/octet-stream",fileName:l.name}),u--,u===0&&t.onAttachmentsChange?.([...i,...d])}),p.addEventListener("error",()=>{t.showToast?.(`Failed to read "${l.name}"`,"error"),u--,u===0&&d.length>0&&t.onAttachmentsChange?.([...i,...d])}),p.readAsDataURL(l)}}function Ty(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let l=0;l<n.length;l++){const p=n[l];if(p.type.startsWith("image/")){const v=p.getAsFile();v&&s.push(v)}}if(s.length===0)return;e.preventDefault();const i=t.attachments??[],a=i.reduce((l,p)=>l+(p.dataUrl?.length??0)*.75,0),{validFiles:o,errors:c}=xa(s,a);for(const l of c)t.showToast?.(l,"error");if(o.length===0)return;const d=[];let u=o.length;for(const l of o){const p=new FileReader;p.addEventListener("load",()=>{const v=p.result;d.push({id:_a(),dataUrl:v,mimeType:l.type,fileName:l.name||"pasted-image"}),u--,u===0&&t.onAttachmentsChange?.([...i,...d])}),p.addEventListener("error",()=>{t.showToast?.("Failed to read pasted image","error"),u--,u===0&&d.length>0&&t.onAttachmentsChange?.([...i,...d])}),p.readAsDataURL(l)}}function xy(e,t){const n=e.target,s=n.files;if(!s||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((l,p)=>l+(p.dataUrl?.length??0)*.75,0),{validFiles:o,errors:c}=xa(s,a);for(const l of c)t.showToast?.(l,"error");if(o.length===0){n.value="";return}const d=[];let u=o.length;for(const l of o){const p=new FileReader;p.addEventListener("load",()=>{const v=p.result;d.push({id:_a(),dataUrl:v,mimeType:l.type||"application/octet-stream",fileName:l.name}),u--,u===0&&t.onAttachmentsChange?.([...i,...d])}),p.addEventListener("error",()=>{t.showToast?.(`Failed to read "${l.name}"`,"error"),u--,u===0&&d.length>0&&t.onAttachmentsChange?.([...i,...d])}),p.readAsDataURL(l)}n.value=""}function _y(e){const t=e.attachments??[];return t.length===0?h:r`
    <div class="chat-attachments">
      ${t.map(n=>{const s=n.mimeType.startsWith("image/"),i=n.fileName||"file",a=i.length>40?i.slice(0,37)+"...":i;return r`
          <div class="chat-attachment ${s?"":"chat-attachment--file"}">
            ${s?r`<img src=${n.dataUrl} alt="Attachment preview" class="chat-attachment__img" />`:r`<div class="chat-attachment__file">
                  ${q.fileText}
                  <span class="chat-attachment__filename" title=${i}>${a}</span>
                </div>`}
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const o=(e.attachments??[]).filter(c=>c.id!==n.id);e.onAttachmentsChange?.(o)}}
            >
              ${q.x}
            </button>
          </div>
        `})}
    </div>
  `}function Cy(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function Ey(e){const t=e.href;if(t){if(e.target==="_blank"){window.open(t,"_blank","noopener,noreferrer");return}window.location.assign(t)}}function Ly(e){const t=e.trim();return!t||t.includes(`
`)?null:t.startsWith("/")||t.startsWith("~/")||t.startsWith("./")||t.startsWith("../")||/^[a-z]:[\\/]/i.test(t)||/^[^:\s]+\/[^\s]+$/.test(t)&&/\.[a-z0-9]{1,12}$/i.test(t)||/^[^\s/\\:*?"<>|]+\.[a-z0-9]{1,12}$/i.test(t)&&t.length<=100?t:null}async function Py(e,t){const n=e.target,s=n instanceof Element?n:n instanceof Node?n.parentElement:null;if(!s||!t.onMessageLinkClick||!Cy(e))return;const i=s.closest("a");if(i instanceof HTMLAnchorElement){if(i.hasAttribute("download"))return;const d=i.getAttribute("href");if(!d)return;if(t.onOpenProof)try{const l=d.match(/(?:proofeditor\.ai|127\.0\.0\.1:\d+|localhost:\d+)\/d\/([a-zA-Z0-9_-]+)/);if(l){e.preventDefault(),t.onOpenProof(l[1]);return}}catch{}try{const l=new URL(d,window.location.href);if(/^https?:$/.test(l.protocol)&&l.origin!==window.location.origin){e.preventDefault(),window.open(l.href,"_blank","noopener,noreferrer");return}}catch{}e.preventDefault(),await t.onMessageLinkClick(d)||Ey(i);return}const a=s.closest("code");if(!(a instanceof HTMLElement))return;const o=(a.textContent??"").trim();if(/^https?:\/\/\S+$/i.test(o)){e.preventDefault(),window.open(o,"_blank","noopener,noreferrer");return}if(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(\/\S*)?$/i.test(o)){e.preventDefault(),window.open(`https://${o}`,"_blank","noopener,noreferrer");return}const c=Ly(o);c&&(e.preventDefault(),await t.onMessageLinkClick(c))}const Ry={html_report:"📊",plan:"📋",analysis:"🔍",code:"💻",doc:"📝",data:"📦",image:"🖼️",script:"⚙️"};function Iy(e){const t=e.sessionResources;if(!t||t.length===0)return h;if(e.sessionResourcesCollapsed)return r`
      <div class="session-resources-strip">
        <div class="session-resources-header">
          <span class="session-resources-label">Resources (${t.length})</span>
          <button class="session-resources-toggle" @click=${e.onToggleSessionResources}>▲</button>
        </div>
      </div>
    `;const n=t.slice(0,5);return r`
    <div class="session-resources-strip">
      <div class="session-resources-header">
        <span class="session-resources-label">Resources (${t.length})</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          ${t.length>5?r`<button class="session-resources-view-all" @click=${e.onViewAllResources}>View all</button>`:h}
          <button class="session-resources-toggle" @click=${e.onToggleSessionResources}>▼</button>
        </div>
      </div>
      <div class="session-resources-cards">
        ${n.map(s=>r`
            <button
              class="session-resource-chip"
              @click=${()=>e.onSessionResourceClick?.(s)}
            >
              <span>${Ry[s.type]||"📄"}</span>
              <span>${s.title}</span>
            </button>
          `)}
      </div>
    </div>
  `}function My(e){const t=e.connected,n=e.sending||e.stream!==null,s=!!(e.canAbort&&e.onAbort),a=e.sessions?.sessions?.find(y=>y.key===e.sessionKey)?.reasoningLevel??"off",o=e.showThinking&&a!=="off",c={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},d=(e.attachments?.length??0)>0,u=e.connected?d?"Add a message or paste more images...":"Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",l=e.splitRatio??.6,p=!!(e.sidebarOpen&&e.onCloseSidebar),v=r`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
      @click=${y=>{Py(y,e)}}
    >
      ${e.loading?r`
              <div class="muted">Loading chat…</div>
            `:h}
      ${us(Fy(e),y=>y.key,y=>{try{if(y.kind==="reading-indicator")return dh(c,e.currentToolInfo);if(y.kind==="stream")return uh(y.text,y.startedAt,e.onOpenSidebar,c,e.currentToolInfo);if(y.kind==="compaction-summary")return gh(y.message);if(y.kind==="group"){const b=e.resolveImageUrl?(k,S)=>e.resolveImageUrl(k,S):void 0;return ph(y,{onOpenSidebar:e.onOpenSidebar,onOpenFile:e.onOpenFile,onOpenProof:e.onOpenProof,onPushToDrive:e.onPushToDrive,onImageClick:e.onImageClick,resolveImageUrl:b,showReasoning:o,assistantName:e.assistantName,assistantAvatar:c.avatar,userName:e.userName,userAvatar:e.userAvatar})}return h}catch(b){return console.error("[chat] item render error:",b,y.key),h}})}
    </div>
  `;return r`
    <section 
      class="card chat"
      @dragover=${Sy}
      @dragenter=${y=>ky(y,y.currentTarget)}
      @dragleave=${y=>$y(y,y.currentTarget)}
      @drop=${y=>Ay(y,e)}
    >
      ${e.privateMode?r`<div class="callout callout--private" aria-live="polite">
            <span style="margin-right:6px">🔒</span>
            <strong>Private Session</strong> — Nothing from this conversation will be saved to memory or vault.
          </div>`:h}

      ${e.disabledReason?r`<div class="callout">${e.disabledReason}</div>`:h}

      ${e.error?r`<div class="callout danger">${e.error}</div>`:h}

      ${wy(e.compactionStatus)}

      ${e.pendingRetry&&e.onRetry?r`
            <div class="callout info chat-retry-banner">
              <span class="chat-retry-banner__text">
                Message ready to retry after compaction
              </span>
              <div class="chat-retry-banner__actions">
                <button
                  class="btn btn--primary btn--sm"
                  type="button"
                  @click=${e.onRetry}
                >
                  Retry
                </button>
                ${e.onClearRetry?r`
                      <button
                        class="btn btn--ghost btn--sm"
                        type="button"
                        @click=${e.onClearRetry}
                      >
                        Dismiss
                      </button>
                    `:h}
              </div>
            </div>
          `:h}

      ${e.focusMode?r`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${q.x}
            </button>
          `:h}

      <div
        class="chat-split-container ${p?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${p?`0 0 ${l*100}%`:"1 1 100%"}"
          @click=${p?()=>e.onCloseSidebar?.():h}
        >
          ${v}
          ${e.showScrollButton?r`
                <button
                  class="chat-scroll-bottom"
                  type="button"
                  aria-label="Scroll to bottom"
                  title="Scroll to bottom"
                  @click=${()=>e.onScrollToBottom?.()}
                >
                  ${e.showNewMessages?r`<span class="chat-scroll-bottom__badge"></span>`:h}
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              `:h}
        </div>

        ${p?r`
              <resizable-divider
                .splitRatio=${l}
                @resize=${y=>e.onSplitRatioChange?.(y.detail.splitRatio)}
              ></resizable-divider>
              ${e.allyPanelOpen&&e.allyProps?r`
                    <div class="chat-sidebar chat-sidebar--split">
                      <div class="chat-sidebar-top">
                      ${Oi({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                    </div>
                    <resizable-divider
                      direction="vertical"
                      .splitRatio=${.6}
                      .minRatio=${.2}
                      .maxRatio=${.8}
                    ></resizable-divider>
                    <div class="chat-sidebar-bottom">
                      ${fv(e.allyProps)}
                    </div>
                  </div>
                `:r`
                  <div class="chat-sidebar">
                    ${Oi({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                  </div>
                `}
            `:h}
      </div>

      ${e.queue.length?r`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(y=>r`
                    <div class="chat-queue__item">
                      <div class="chat-queue__text">
                        ${y.text||(y.attachments?.length?`Image (${y.attachments.length})`:"")}
                      </div>
                      <button
                        class="btn chat-queue__remove"
                        type="button"
                        aria-label="Remove queued message"
                        @click=${()=>e.onQueueRemove(y.id)}
                      >
                        ${q.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:h}

      ${Iy(e)}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${y=>xy(y,e)}
          />
          ${_y(e)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${ty(y=>y&&er(y))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${y=>{if(y.key!=="Enter"||y.isComposing||y.keyCode===229||y.shiftKey||!e.connected)return;y.preventDefault();const b=y.ctrlKey||y.metaKey;t&&e.onSend(b)}}
              @input=${y=>{const b=y.target;er(b),e.onDraftChange(b.value)}}
              @paste=${y=>Ty(y,e)}
              placeholder=${u}
            ></textarea>

            <div class="chat-compose__actions">
              ${by(e)}

              <button
                class="chat-compose__toolbar-btn"
                type="button"
                title="Attach files"
                ?disabled=${!e.connected}
                @click=${()=>{document.getElementById("chat-file-input")?.click()}}
              >
                ${q.paperclip}
              </button>

              ${s?r`
                  <button
                    class="chat-compose__send-btn chat-compose__send-btn--stop"
                    @click=${()=>e.onAbort()}
                    title="Stop generating"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="3" y="3" width="10" height="10" rx="1.5" />
                    </svg>
                  </button>
                `:r`
                  <button
                    class="chat-compose__send-btn"
                    ?disabled=${!e.canSend||!e.connected}
                    @click=${()=>e.onSend(!1)}
                    title=${n?"Send now - interrupts current run (↵)":"Send message (↵)"}
                  >
                    ${q.arrowUp}
                  </button>
                `}
            </div>
          </div>
        </div>
      </div>
    </section>
  `}const tr=200;function Dy(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const i=Gi(s.message),a=gs(i.role),o=i.timestamp||Date.now();!n||n.role!==a?(n&&t.push(n),n={kind:"group",key:`group:${a}:${s.key}`,role:a,messages:[{message:s.message,key:s.key}],timestamp:o,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function Oy(e){const n=e.content;if(!Array.isArray(n))return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const i=s;if(i.type==="image")return!0;if(Array.isArray(i.content)){for(const a of i.content)if(!(typeof a!="object"||a===null)&&a.type==="image")return!0}}return!1}function Ny(e){const n=e.content;if(!Array.isArray(n)||n.length===0)return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const i=s,a=typeof i.type=="string"?i.type:"";if(a!=="toolCall"&&a!=="tool_use"&&a!=="thinking")return!1}return!0}function Fy(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],i=Math.max(0,n.length-tr);i>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${tr} messages (${i} hidden).`,timestamp:Date.now()}});for(let a=i;a<n.length;a++){const o=n[a];if(o._chatIdx=a,mh(o)){t.push({kind:"compaction-summary",key:`compaction:${a}`,message:o});continue}if(iy(o))continue;const c=Gi(o);!e.showThinking&&c.role.toLowerCase()==="toolresult"&&!Oy(o)||!e.showThinking&&c.role.toLowerCase()==="assistant"&&Ny(o)||t.push({kind:"message",key:nr(o,a),message:o})}if(e.showThinking)for(let a=0;a<s.length;a++)t.push({kind:"message",key:nr(s[a],a+n.length),message:s[a]});if(e.stream!==null){const a=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:a,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:a})}else if(e.isWorking){const a=`working:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}else if(e.sending||e.canAbort){const a=`sending:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}return Dy(t)}function nr(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const i=typeof n.id=="string"?n.id:"";if(i)return`msg:${i}`;const a=typeof n.messageId=="string"?n.messageId:"";if(a)return`msg:${a}`;const o=typeof n.timestamp=="number"?n.timestamp:null,c=typeof n.role=="string"?n.role:"unknown";if(o!=null){const d=typeof n.content=="string"?n.content.slice(0,32):"";return`msg:${c}:${o}:${d||t}`}return`msg:${c}:${t}`}function By(e,t=128){return new Promise((n,s)=>{const i=new Image;i.addEventListener("load",()=>{const a=document.createElement("canvas");a.width=t,a.height=t;const o=a.getContext("2d");if(!o){s(new Error("Could not get canvas context"));return}const c=Math.min(i.width,i.height),d=(i.width-c)/2,u=(i.height-c)/2;o.drawImage(i,d,u,c,c,0,0,t,t),n(a.toDataURL("image/png"))}),i.addEventListener("error",()=>s(new Error("Failed to load image"))),i.src=URL.createObjectURL(e)})}let Ft="",pn=null,gt=null,sr=!1,Qe=!1;function Uy(e){sr||(Ft=e.userName||"",pn=e.userAvatar||null,gt=e.userAvatar||null,sr=!0,Qe=!1)}function Ky(e){Uy(e);const t=d=>{Ft=d.target.value,Qe=!0},n=async d=>{const l=d.target.files?.[0];if(l){if(!l.type.startsWith("image/")){alert("Please select an image file");return}if(l.size>5*1024*1024){alert("Image must be less than 5MB");return}try{const p=await By(l,128);pn=p,gt=p,Qe=!0,document.dispatchEvent(new CustomEvent("user-settings-updated"))}catch(p){console.error("Failed to process image:",p),alert("Failed to process image")}}},s=()=>{pn=null,gt=null,Qe=!0;const d=document.getElementById("user-avatar-input");d&&(d.value=""),document.dispatchEvent(new CustomEvent("user-settings-updated"))},i=()=>{e.onUpdate(Ft,pn||""),Qe=!1;const d=document.querySelector(".user-settings__save");d&&(d.textContent="Saved!",setTimeout(()=>{d.textContent="Save"},1500))},a=()=>{Ft=e.userName||"",pn=e.userAvatar||null,gt=e.userAvatar||null,Qe=!1,document.dispatchEvent(new CustomEvent("user-settings-updated"))},o=Ft||"You",c=gt?r`<img src="${gt}" alt="${o}" class="user-settings__avatar-img" />`:r`<span class="user-settings__avatar-initial">${o.charAt(0).toUpperCase()}</span>`;return r`
    <div class="user-settings">
      <section class="config-section-card">
        <div class="config-section-card__header">
          <span class="config-section-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <div class="config-section-card__titles">
            <h3 class="config-section-card__title">User Profile</h3>
            <p class="config-section-card__desc">Your display name and avatar for chat messages</p>
          </div>
        </div>
        <div class="config-section-card__content">
          <div class="user-settings__form">
            <!-- Avatar Section -->
            <div class="user-settings__field">
              <label class="user-settings__label">Avatar</label>
              <div class="user-settings__avatar-row">
                <div class="user-settings__avatar-preview">
                  ${c}
                </div>
                <div class="user-settings__avatar-actions">
                  <input
                    type="file"
                    id="user-avatar-input"
                    accept="image/*"
                    class="user-settings__file-input"
                    @change=${n}
                  />
                  <button
                    type="button"
                    class="user-settings__btn user-settings__btn--upload"
                    @click=${()=>document.getElementById("user-avatar-input")?.click()}
                  >
                    Choose Image
                  </button>
                  ${gt?r`
                        <button
                          type="button"
                          class="user-settings__btn user-settings__btn--clear"
                          @click=${s}
                        >
                          Remove
                        </button>
                      `:h}
                </div>
              </div>
              <span class="user-settings__hint">Square images work best. Will be resized to 128x128.</span>
            </div>

            <!-- Name Section -->
            <div class="user-settings__field">
              <label class="user-settings__label" for="user-name-input">Display Name</label>
              <input
                type="text"
                id="user-name-input"
                class="user-settings__input"
                .value=${Ft}
                @input=${t}
                placeholder="Your name"
                maxlength="50"
              />
              <span class="user-settings__hint">This name appears on your chat messages</span>
            </div>

            <!-- Actions -->
            <div class="user-settings__actions">
              ${Qe?r`
                    <button
                      type="button"
                      class="user-settings__btn user-settings__btn--cancel"
                      @click=${a}
                    >
                      Cancel
                    </button>
                  `:h}
              <button
                type="button"
                class="user-settings__btn user-settings__btn--save user-settings__save"
                ?disabled=${!Qe}
                @click=${i}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `}const Ni={all:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,env:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M15 4V2"></path>
      <path d="M15 16v-2"></path>
      <path d="M8 9h2"></path>
      <path d="M20 9h2"></path>
      <path d="M17.8 11.8 19 13"></path>
      <path d="M15 9h0"></path>
      <path d="M17.8 6.2 19 5"></path>
      <path d="m3 21 9-9"></path>
      <path d="M12.2 6.2 11 5"></path>
    </svg>
  `,meta:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2v6"></path>
      <path d="m4.93 10.93 4.24 4.24"></path>
      <path d="M2 12h6"></path>
      <path d="m4.93 13.07 4.24-4.24"></path>
      <path d="M12 22v-6"></path>
      <path d="m19.07 13.07-4.24-4.24"></path>
      <path d="M22 12h-6"></path>
      <path d="m19.07 10.93-4.24 4.24"></path>
    </svg>
  `,user:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  `,default:r`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},di=[{key:"model",label:"AI Model"},{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"},{key:"user",label:"User"}],ir=new Set(["user","model"]),ar="__all__";function or(e){return Ni[e]??Ni.default}function zy(e,t){const n=Ta[e];return n||{label:t?.title??je(e),description:t?.description??""}}function Wy(e){const{key:t,schema:n,uiHints:s}=e;if(!n||Re(n)!=="object"||!n.properties)return[];const i=Object.entries(n.properties).map(([a,o])=>{const c=be([t,a],s),d=c?.label??o.title??je(a),u=c?.help??o.description??"",l=c?.order??50;return{key:a,label:d,description:u,order:l}});return i.sort((a,o)=>a.order!==o.order?a.order-o.order:a.key.localeCompare(o.key)),i}function qy(e,t){if(!e||!t)return[];const n=[];function s(i,a,o){if(i===a)return;if(typeof i!=typeof a){n.push({path:o,from:i,to:a});return}if(typeof i!="object"||i===null||a===null){i!==a&&n.push({path:o,from:i,to:a});return}if(Array.isArray(i)&&Array.isArray(a)){JSON.stringify(i)!==JSON.stringify(a)&&n.push({path:o,from:i,to:a});return}const c=i,d=a,u=new Set([...Object.keys(c),...Object.keys(d)]);for(const l of u)s(c[l],d[l],o?`${o}.${l}`:l)}return s(e,t,""),n}function rr(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}const lr={anthropic:"#d97706",openai:"#10b981","openai-codex":"#10b981",xai:"#6366f1"};function jy(e){const t=[],n=e.models,s=e.agents,i=n?.providers;if(i&&typeof i=="object")for(const[o,c]of Object.entries(i)){const d=c;for(const u of d.models??[])t.push({id:`${o}/${u.id}`,name:u.name??u.id,provider:o,providerLabel:o.charAt(0).toUpperCase()+o.slice(1),reasoning:u.reasoning??!1,contextWindow:u.contextWindow??0})}const a=s?.defaults?.models;if(a&&typeof a=="object")for(const o of Object.keys(a)){if(t.some(d=>d.id===o))continue;const c=o.split("/");t.push({id:o,name:c.slice(1).join("/"),provider:c[0]??"unknown",providerLabel:(c[0]??"unknown").replace(/-/g," ").replace(/\b\w/g,d=>d.toUpperCase()),reasoning:!1,contextWindow:0})}return t}function Hy(e){return e.startsWith("anthropic/")?["openai-codex/gpt-5.3-codex"]:["anthropic/claude-sonnet-4-6"]}function Vy(e){const t=e.formValue;if(!t)return r`<div class="config-loading"><span>Loading config...</span></div>`;const n=t.agents,s=n?.defaults?.model?.primary??"",i=n?.defaults?.model?.fallbacks??[],a=jy(t),o=new Map;for(const d of a){const u=o.get(d.provider)??[];u.push(d),o.set(d.provider,u)}const c=e.saving||e.applying;return r`
    <div class="model-picker">
      <div class="model-picker__current">
        <div class="model-picker__current-label">Active Model</div>
        <div class="model-picker__current-value">${s||"Not set"}</div>
        ${i.length>0?r`<div class="model-picker__fallback">Fallback: ${i.join(", ")}</div>`:h}
      </div>

      ${c?r`<div class="model-picker__status">Switching model...</div>`:h}

      ${Array.from(o.entries()).map(([d,u])=>r`
          <div class="model-picker__group">
            <div class="model-picker__group-label">
              <span class="model-picker__group-dot" style="background: ${lr[d]??"var(--accent)"}"></span>
              ${u[0]?.providerLabel??d}
            </div>
            <div class="model-picker__cards">
              ${u.map(l=>{const p=l.id===s,v=lr[l.provider]??"var(--accent)";return r`
                  <button
                    class="model-card ${p?"model-card--active":""}"
                    style="--model-accent: ${v}"
                    ?disabled=${c}
                    @click=${()=>{p||!e.onModelSwitch||e.onModelSwitch(l.id,Hy(l.id))}}
                  >
                    <div class="model-card__body">
                      <div class="model-card__name">${l.name||l.id}</div>
                      ${l.reasoning?r`<span class="model-card__tag">reasoning</span>`:h}
                      ${l.contextWindow>0?r`<span class="model-card__ctx">${Math.round(l.contextWindow/1e3)}k ctx</span>`:h}
                    </div>
                    ${p?r`<span class="model-card__check">Active</span>`:h}
                  </button>
                `})}
            </div>
          </div>
        `)}
    </div>
  `}function Gy(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=Nc(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,i=n.schema?.properties??{},a=di.filter(x=>x.key in i&&!ir.has(x.key)),o=new Set(di.map(x=>x.key)),c=Object.keys(i).filter(x=>!o.has(x)).map(x=>({key:x,label:x.charAt(0).toUpperCase()+x.slice(1)})),d=di.filter(x=>ir.has(x.key)),u=[...a,...c,...d],l=e.activeSection&&n.schema&&Re(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,p=e.activeSection?zy(e.activeSection,l):null,v=e.activeSection?Wy({key:e.activeSection,schema:l,uiHints:e.uiHints}):[],y=e.formMode==="form"&&!!e.activeSection&&v.length>0,b=e.activeSubsection===ar,k=e.searchQuery||b?null:e.activeSubsection??v[0]?.key??null,S=e.formMode==="form"?qy(e.originalValue,e.formValue):[],$=e.formMode==="raw"&&e.raw!==e.originalRaw,T=e.formMode==="form"?S.length>0:$,P=!!e.formValue&&!e.loading&&!!n.schema,L=e.connected&&!e.saving&&T&&(e.formMode==="raw"?!0:P),A=e.connected&&!e.applying&&!e.updating&&T&&(e.formMode==="raw"?!0:P),C=e.connected&&!e.applying&&!e.updating;return r`
    <div class="config-layout">
      <!-- Sidebar -->
      <aside class="config-sidebar">
        <div class="config-sidebar__header">
          <div class="config-sidebar__title">Settings</div>
          <span class="pill pill--sm ${t==="valid"?"pill--ok":t==="invalid"?"pill--danger":""}">${t}</span>
        </div>

        <!-- Search -->
        <div class="config-search">
          <svg class="config-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            class="config-search__input"
            placeholder="Search settings..."
            .value=${e.searchQuery}
            @input=${x=>e.onSearchChange(x.target.value)}
          />
          ${e.searchQuery?r`
            <button
              class="config-search__clear"
              @click=${()=>e.onSearchChange("")}
            >×</button>
          `:h}
        </div>

        <!-- Section nav -->
        <nav class="config-nav">
          <button
            class="config-nav__item ${e.activeSection===null?"active":""}"
            @click=${()=>e.onSectionChange(null)}
          >
            <span class="config-nav__icon">${Ni.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${u.map(x=>r`
            <button
              class="config-nav__item ${e.activeSection===x.key?"active":""}"
              @click=${()=>e.onSectionChange(x.key)}
            >
              <span class="config-nav__icon">${or(x.key)}</span>
              <span class="config-nav__label">${x.label}</span>
            </button>
          `)}
        </nav>

        <!-- Mode toggle at bottom -->
        <div class="config-sidebar__footer">
          <div class="config-mode-toggle">
            <button
              class="config-mode-toggle__btn ${e.formMode==="form"?"active":""}"
              ?disabled=${e.schemaLoading||!e.schema}
              @click=${()=>e.onFormModeChange("form")}
            >
              Form
            </button>
            <button
              class="config-mode-toggle__btn ${e.formMode==="raw"?"active":""}"
              @click=${()=>e.onFormModeChange("raw")}
            >
              Raw
            </button>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="config-main">
        <!-- Action bar -->
        <div class="config-actions">
          <div class="config-actions__left">
            ${T?r`
              <span class="config-changes-badge">${e.formMode==="raw"?"Unsaved changes":`${S.length} unsaved change${S.length!==1?"s":""}`}</span>
            `:r`
                    <span class="config-status muted">No changes</span>
                  `}
          </div>
          <div class="config-actions__right">
            <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onReload}>
              ${e.loading?"Loading…":"Reload"}
            </button>
            <button
              class="btn btn--sm primary"
              ?disabled=${!L}
              @click=${e.onSave}
            >
              ${e.saving?"Saving…":"Save"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!A}
              @click=${e.onApply}
            >
              ${e.applying?"Applying…":"Apply"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!C}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${T&&e.formMode==="form"?r`
          <details class="config-diff">
            <summary class="config-diff__summary">
              <span>View ${S.length} pending change${S.length!==1?"s":""}</span>
              <svg class="config-diff__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${S.map(x=>r`
                <div class="config-diff__item">
                  <div class="config-diff__path">${x.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${rr(x.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${rr(x.to)}</span>
                  </div>
                </div>
              `)}
            </div>
          </details>
        `:h}

        ${p&&e.formMode==="form"?r`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${or(e.activeSection??"")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${p.label}</div>
                  ${p.description?r`<div class="config-section-hero__desc">${p.description}</div>`:h}
                </div>
              </div>
            `:h}

        ${y?r`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${k===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(ar)}
                >
                  All
                </button>
                ${v.map(x=>r`
                    <button
                      class="config-subnav__item ${k===x.key?"active":""}"
                      title=${x.description||x.label}
                      @click=${()=>e.onSubsectionChange(x.key)}
                    >
                      ${x.label}
                    </button>
                  `)}
              </div>
            `:h}

        <!-- Form content -->
        <div class="config-content">
          ${e.activeSection==="model"?Vy(e):e.activeSection==="user"?Ky({userName:e.userName,userAvatar:e.userAvatar,onUpdate:e.onUserProfileUpdate}):e.formMode==="form"?r`
                  ${e.schemaLoading?r`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `:$v({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:k})}
                  ${s?r`
                          <div class="callout danger" style="margin-top: 12px">
                            Form view can't safely edit some fields. Use Raw to avoid losing config entries.
                          </div>
                        `:h}
                `:r`
                  <label class="field config-raw-field">
                    <span>Raw JSON5</span>
                    <textarea
                      .value=${e.raw}
                      @input=${x=>e.onRawChange(x.target.value)}
                    ></textarea>
                  </label>
                `}
        </div>

        ${e.issues.length>0?r`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:h}
      </main>
    </div>
  `}function Yy(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",i=e.version??"";return`${t} ${n} ${s} ${i}`.trim()}function Qy(e){const t=e.ts??null;return t?B(t):"n/a"}function Jy(e){return e?`${bn(e)} (${B(e)})`:"n/a"}function Xy(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function Zy(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function eb(e){const t=e.state??{},n=t.nextRunAtMs?bn(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?bn(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function tb(e){const t=e.schedule;return t.kind==="at"?`At ${bn(t.atMs)}`:t.kind==="every"?`Every ${zr(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function nb(e){const t=e.payload;return t.kind==="systemEvent"?`System: ${t.text}`:`Agent: ${t.message}`}function sb(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.channel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(i=>s.has(i)?!1:(s.add(i),!0))}function ib(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function ab(e){const t=sb(e);return r`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">Scheduler</div>
        <div class="card-sub">Gateway-owned cron scheduler status.</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">Enabled</div>
            <div class="stat-value">
              ${e.status?e.status.enabled?"Yes":"No":"n/a"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Jobs</div>
            <div class="stat-value">${e.status?.jobs??"n/a"}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Next wake</div>
            <div class="stat-value">${Jy(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
          ${e.error?r`<span class="muted">${e.error}</span>`:h}
        </div>
      </div>

      <div class="card">
        <div class="card-title">New Job</div>
        <div class="card-sub">Create a scheduled wakeup or agent run.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>Name</span>
            <input
              .value=${e.form.name}
              @input=${n=>e.onFormChange({name:n.target.value})}
            />
          </label>
          <label class="field">
            <span>Description</span>
            <input
              .value=${e.form.description}
              @input=${n=>e.onFormChange({description:n.target.value})}
            />
          </label>
          <label class="field">
            <span>Agent ID</span>
            <input
              .value=${e.form.agentId}
              @input=${n=>e.onFormChange({agentId:n.target.value})}
              placeholder="default"
            />
          </label>
          <label class="field checkbox">
            <span>Enabled</span>
            <input
              type="checkbox"
              .checked=${e.form.enabled}
              @change=${n=>e.onFormChange({enabled:n.target.checked})}
            />
          </label>
          <label class="field">
            <span>Schedule</span>
            <select
              .value=${e.form.scheduleKind}
              @change=${n=>e.onFormChange({scheduleKind:n.target.value})}
            >
              <option value="every">Every</option>
              <option value="at">At</option>
              <option value="cron">Cron</option>
            </select>
          </label>
        </div>
        ${ob(e)}
        <div class="form-grid" style="margin-top: 12px;">
          <label class="field">
            <span>Session</span>
            <select
              .value=${e.form.sessionTarget}
              @change=${n=>e.onFormChange({sessionTarget:n.target.value})}
            >
              <option value="main">Main</option>
              <option value="isolated">Isolated</option>
            </select>
          </label>
          <label class="field">
            <span>Wake mode</span>
            <select
              .value=${e.form.wakeMode}
              @change=${n=>e.onFormChange({wakeMode:n.target.value})}
            >
              <option value="next-heartbeat">Next heartbeat</option>
              <option value="now">Now</option>
            </select>
          </label>
          <label class="field">
            <span>Payload</span>
            <select
              .value=${e.form.payloadKind}
              @change=${n=>e.onFormChange({payloadKind:n.target.value})}
            >
              <option value="systemEvent">System event</option>
              <option value="agentTurn">Agent turn</option>
            </select>
          </label>
        </div>
        <label class="field" style="margin-top: 12px;">
          <span>${e.form.payloadKind==="systemEvent"?"System text":"Agent message"}</span>
          <textarea
            .value=${e.form.payloadText}
            @input=${n=>e.onFormChange({payloadText:n.target.value})}
            rows="4"
          ></textarea>
        </label>
	          ${e.form.payloadKind==="agentTurn"?r`
	              <div class="form-grid" style="margin-top: 12px;">
                <label class="field checkbox">
                  <span>Deliver</span>
                  <input
                    type="checkbox"
                    .checked=${e.form.deliver}
                    @change=${n=>e.onFormChange({deliver:n.target.checked})}
                  />
	                </label>
	                <label class="field">
	                  <span>Channel</span>
	                  <select
	                    .value=${e.form.channel||"last"}
	                    @change=${n=>e.onFormChange({channel:n.target.value})}
	                  >
	                    ${t.map(n=>r`<option value=${n}>
                            ${ib(e,n)}
                          </option>`)}
                  </select>
                </label>
                <label class="field">
                  <span>To</span>
                  <input
                    .value=${e.form.to}
                    @input=${n=>e.onFormChange({to:n.target.value})}
                    placeholder="+1555… or chat id"
                  />
                </label>
                <label class="field">
                  <span>Timeout (seconds)</span>
                  <input
                    .value=${e.form.timeoutSeconds}
                    @input=${n=>e.onFormChange({timeoutSeconds:n.target.value})}
                  />
                </label>
                ${e.form.sessionTarget==="isolated"?r`
                      <label class="field">
                        <span>Post to main prefix</span>
                        <input
                          .value=${e.form.postToMainPrefix}
                          @input=${n=>e.onFormChange({postToMainPrefix:n.target.value})}
                        />
                      </label>
                    `:h}
              </div>
            `:h}
        <div class="row" style="margin-top: 14px;">
          <button class="btn primary" ?disabled=${e.busy} @click=${e.onAdd}>
            ${e.busy?"Saving…":"Add job"}
          </button>
        </div>
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Jobs</div>
      <div class="card-sub">All scheduled jobs stored in the gateway.</div>
      ${e.jobs.length===0?r`
              <div class="muted" style="margin-top: 12px">No jobs yet.</div>
            `:r`
            <div class="list" style="margin-top: 12px;">
              ${e.jobs.map(n=>rb(n,e))}
            </div>
          `}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Run history</div>
      <div class="card-sub">Latest runs for ${e.runsJobId??"(select a job)"}.</div>
      ${e.runsJobId==null?r`
              <div class="muted" style="margin-top: 12px">Select a job to inspect run history.</div>
            `:e.runs.length===0?r`
                <div class="muted" style="margin-top: 12px">No runs yet.</div>
              `:r`
              <div class="list" style="margin-top: 12px;">
                ${e.runs.map(n=>lb(n))}
              </div>
            `}
    </section>
  `}function ob(e){const t=e.form;return t.scheduleKind==="at"?r`
      <label class="field" style="margin-top: 12px;">
        <span>Run at</span>
        <input
          type="datetime-local"
          .value=${t.scheduleAt}
          @input=${n=>e.onFormChange({scheduleAt:n.target.value})}
        />
      </label>
    `:t.scheduleKind==="every"?r`
      <div class="form-grid" style="margin-top: 12px;">
        <label class="field">
          <span>Every</span>
          <input
            .value=${t.everyAmount}
            @input=${n=>e.onFormChange({everyAmount:n.target.value})}
          />
        </label>
        <label class="field">
          <span>Unit</span>
          <select
            .value=${t.everyUnit}
            @change=${n=>e.onFormChange({everyUnit:n.target.value})}
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </label>
      </div>
    `:r`
    <div class="form-grid" style="margin-top: 12px;">
      <label class="field">
        <span>Expression</span>
        <input
          .value=${t.cronExpr}
          @input=${n=>e.onFormChange({cronExpr:n.target.value})}
        />
      </label>
      <label class="field">
        <span>Timezone (optional)</span>
        <input
          .value=${t.cronTz}
          @input=${n=>e.onFormChange({cronTz:n.target.value})}
        />
      </label>
    </div>
  `}function rb(e,t){const s=`list-item list-item-clickable${t.runsJobId===e.id?" list-item-selected":""}`;return r`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${tb(e)}</div>
        <div class="muted">${nb(e)}</div>
        ${e.agentId?r`<div class="muted">Agent: ${e.agentId}</div>`:h}
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.enabled?"enabled":"disabled"}</span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
      </div>
      <div class="list-meta">
        <div>${eb(e)}</div>
        <div class="row" style="justify-content: flex-end; margin-top: 8px;">
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onToggle(e,!e.enabled)}}
          >
            ${e.enabled?"Disable":"Enable"}
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onRun(e)}}
          >
            Run
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onLoadRuns(e.id)}}
          >
            Runs
          </button>
          <button
            class="btn danger"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onRemove(e)}}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  `}function lb(e){return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${bn(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?r`<div class="muted">${e.error}</div>`:h}
      </div>
    </div>
  `}function cb(e){const n=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=n?.critical??0,i=n?.warn??0,a=n?.info??0,o=s>0?"danger":i>0?"warn":"success",c=s>0?`${s} critical`:i>0?`${i} warnings`:"No critical issues";return r`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Snapshots</div>
            <div class="card-sub">Status, health, and heartbeat data.</div>
          </div>
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
        </div>
        <div class="stack" style="margin-top: 12px;">
          <div>
            <div class="muted">Status</div>
            ${n?r`<div class="callout ${o}" style="margin-top: 8px;">
                  Security audit: ${c}${a>0?` · ${a} info`:""}. Run
                  <span class="mono">openclaw security audit --deep</span> for details.
                </div>`:h}
            <pre class="code-block">${JSON.stringify(e.status??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">Health</div>
            <pre class="code-block">${JSON.stringify(e.health??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">Last heartbeat</div>
            <pre class="code-block">${JSON.stringify(e.heartbeat??{},null,2)}</pre>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Manual RPC</div>
        <div class="card-sub">Send a raw gateway method with JSON params.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>Method</span>
            <input
              .value=${e.callMethod}
              @input=${d=>e.onCallMethodChange(d.target.value)}
              placeholder="system-presence"
            />
          </label>
          <label class="field">
            <span>Params (JSON)</span>
            <textarea
              .value=${e.callParams}
              @input=${d=>e.onCallParamsChange(d.target.value)}
              rows="6"
            ></textarea>
          </label>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn primary" @click=${e.onCall}>Call</button>
        </div>
        ${e.callError?r`<div class="callout danger" style="margin-top: 12px;">
              ${e.callError}
            </div>`:h}
        ${e.callResult?r`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:h}
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Models</div>
      <div class="card-sub">Catalog from models.list.</div>
      <pre class="code-block" style="margin-top: 12px;">${JSON.stringify(e.models??[],null,2)}</pre>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Event Log</div>
      <div class="card-sub">Latest gateway events.</div>
      ${e.eventLog.length===0?r`
              <div class="muted" style="margin-top: 12px">No events yet.</div>
            `:r`
            <div class="list" style="margin-top: 12px;">
              ${e.eventLog.map(d=>r`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${d.event}</div>
                      <div class="list-sub">${new Date(d.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta">
                      <pre class="code-block">${Zy(d.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function db(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function dt(e,t){return t?r`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:h}function ub(e){const t=e.execApprovalQueue[0];if(!t)return h;const n=t.request,s=t.expiresAtMs-Date.now(),i=s>0?`expires in ${db(s)}`:"expired",a=e.execApprovalQueue.length;return r`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
          ${a>1?r`<div class="exec-approval-queue">${a} pending</div>`:h}
        </div>
        <div class="exec-approval-command mono">${n.command}</div>
        <div class="exec-approval-meta">
          ${dt("Host",n.host)}
          ${dt("Agent",n.agentId)}
          ${dt("Session",n.sessionKey)}
          ${dt("CWD",n.cwd)}
          ${dt("Resolved",n.resolvedPath)}
          ${dt("Security",n.security)}
          ${dt("Ask",n.ask)}
        </div>
        ${e.execApprovalError?r`<div class="exec-approval-error">${e.execApprovalError}</div>`:h}
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("allow-once")}
          >
            Allow once
          </button>
          <button
            class="btn"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("allow-always")}
          >
            Always allow
          </button>
          <button
            class="btn danger"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("deny")}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  `}function pb(e){const{pendingGatewayUrl:t}=e;return t?r`
    <div class="exec-approval-overlay" role="dialog" aria-modal="true" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Change Gateway URL</div>
            <div class="exec-approval-sub">This will reconnect to a different gateway server</div>
          </div>
        </div>
        <div class="exec-approval-command mono">${t}</div>
        <div class="callout danger" style="margin-top: 12px;">
          Only confirm if you trust this URL. Malicious URLs can compromise your system.
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            @click=${()=>e.handleGatewayUrlConfirm()}
          >
            Confirm
          </button>
          <button
            class="btn"
            @click=${()=>e.handleGatewayUrlCancel()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  `:h}function hb(e){if(!e.gatewayRestartPending)return h;const t=e.sessionsResult?.sessions?.length??0,n=t===1?"1 active session":`${t} active sessions`;return r`
    <div class="exec-approval-overlay" role="dialog" aria-modal="true" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Restart Gateway</div>
            <div class="exec-approval-sub">${n} will be terminated</div>
          </div>
        </div>
        <div class="callout danger" style="margin-top: 12px;">
          This will kill all active sessions. The UI will reconnect automatically when the gateway comes back up.
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn danger"
            ?disabled=${e.gatewayRestartBusy}
            @click=${()=>e.handleGatewayRestartConfirm()}
          >
            ${e.gatewayRestartBusy?"Restarting…":"Restart Gateway"}
          </button>
          <button
            class="btn"
            ?disabled=${e.gatewayRestartBusy}
            @click=${()=>e.handleGatewayRestartCancel()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  `}function fb(e){return r`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Connected Instances</div>
          <div class="card-sub">Presence beacons from the gateway and clients.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>
      ${e.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:h}
      ${e.statusMessage?r`<div class="callout" style="margin-top: 12px;">
            ${e.statusMessage}
          </div>`:h}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?r`
                <div class="muted">No instances reported yet.</div>
              `:e.entries.map(t=>gb(t))}
      </div>
    </section>
  `}function gb(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],i=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],a=i.length>0?i.length>3?`${i.length} scopes`:`scopes: ${i.join(", ")}`:null;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${Yy(e)}</div>
        <div class="chip-row">
          <span class="chip">${n}</span>
          ${s.map(o=>r`<span class="chip">${o}</span>`)}
          ${a?r`<span class="chip">${a}</span>`:h}
          ${e.platform?r`<span class="chip">${e.platform}</span>`:h}
          ${e.deviceFamily?r`<span class="chip">${e.deviceFamily}</span>`:h}
          ${e.modelIdentifier?r`<span class="chip">${e.modelIdentifier}</span>`:h}
          ${e.version?r`<span class="chip">${e.version}</span>`:h}
        </div>
      </div>
      <div class="list-meta">
        <div>${Qy(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}const cr=["trace","debug","info","warn","error","fatal"];function mb(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function vb(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function yb(e){const t=e.filterText.trim().toLowerCase(),n=cr.some(a=>!e.levelFilters[a]),s=e.entries.filter(a=>a.level&&!e.levelFilters[a.level]?!1:vb(a,t)),i=t||n?"filtered":"visible";return r`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Logs</div>
          <div class="card-sub">Gateway file logs (JSONL).</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Loading…":"Refresh"}
          </button>
          <button
            class="btn"
            ?disabled=${s.length===0}
            @click=${()=>e.onExport(s.map(a=>a.raw),i)}
          >
            Export ${i}
          </button>
        </div>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="min-width: 220px;">
          <span>Filter</span>
          <input
            .value=${e.filterText}
            @input=${a=>e.onFilterTextChange(a.target.value)}
            placeholder="Search logs"
          />
        </label>
        <label class="field checkbox">
          <span>Auto-follow</span>
          <input
            type="checkbox"
            .checked=${e.autoFollow}
            @change=${a=>e.onToggleAutoFollow(a.target.checked)}
          />
        </label>
      </div>

      <div class="chip-row" style="margin-top: 12px;">
        ${cr.map(a=>r`
            <label class="chip log-chip ${a}">
              <input
                type="checkbox"
                .checked=${e.levelFilters[a]}
                @change=${o=>e.onLevelToggle(a,o.target.checked)}
              />
              <span>${a}</span>
            </label>
          `)}
      </div>

      ${e.file?r`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:h}
      ${e.truncated?r`
              <div class="callout" style="margin-top: 10px">Log output truncated; showing latest chunk.</div>
            `:h}
      ${e.error?r`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:h}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${s.length===0?r`
                <div class="muted" style="padding: 12px">No log entries.</div>
              `:s.map(a=>r`
                <div class="log-row">
                  <div class="log-time mono">${mb(a.time)}</div>
                  <div class="log-level ${a.level??""}">${a.level??""}</div>
                  <div class="log-subsystem mono">${a.subsystem??""}</div>
                  <div class="log-message mono">${a.message??a.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}const bb=/(^~\/|^\/|^\.\.?\/|[\\/])/;function dr(e){const t=e.trim();if(!t)return null;const n=t.replace(/^["']|["']$/g,"").trim();return!n||/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/[*?<>|]/.test(n)||n.includes("\0")||n.includes(`
`)||n.includes("\r")||!bb.test(n)&&!/\.[a-z0-9]{1,12}$/i.test(n)?null:n}function wb(e){const t=e instanceof Element?e:e instanceof Node?e.parentElement:null;if(!t)return null;const n=t.closest("a");if(n){const i=n.getAttribute("href")??"";let a=i;if(i.includes("%"))try{a=decodeURIComponent(i)}catch{a=i}return dr(a)}const s=t.closest("code");return!s||s.closest("pre")?null:dr(s.textContent??"")}function Sb(e){const n=new DOMParser().parseFromString(`<div>${e}</div>`,"text/html").body.firstElementChild;if(!n)return"";const i=Le(n,{listDepth:0,orderedIndex:[]});return $b(i)}function Fi(e,t){if(e.nodeType===Node.TEXT_NODE)return e.textContent??"";if(e.nodeType!==Node.ELEMENT_NODE)return"";const n=e;switch(n.tagName.toLowerCase()){case"h1":return`# ${Ue(n,t)}

`;case"h2":return`## ${Ue(n,t)}

`;case"h3":return`### ${Ue(n,t)}

`;case"h4":return`#### ${Ue(n,t)}

`;case"h5":return`##### ${Ue(n,t)}

`;case"h6":return`###### ${Ue(n,t)}

`;case"p":return`${Le(n,t)}

`;case"br":return`
`;case"hr":return`---

`;case"strong":case"b":return`**${Le(n,t)}**`;case"em":case"i":return`*${Le(n,t)}*`;case"del":return`~~${Le(n,t)}~~`;case"a":{const i=n.getAttribute("href")??"",a=Le(n,t);return!i||i===a?a:`[${a}](${i})`}case"code":return n.parentElement?.tagName.toLowerCase()==="pre"?n.textContent??"":`\`${n.textContent??""}\``;case"pre":{const i=n.querySelector("code"),a=i?i.textContent??"":n.textContent??"",o=i?.className.match(/language-(\S+)/);return`\`\`\`${o?o[1]:""}
${a}
\`\`\`

`}case"blockquote":return Le(n,t).trim().split(`
`).map(o=>`> ${o}`).join(`
`)+`

`;case"ul":return ur(n,t,!1);case"ol":return ur(n,t,!0);case"li":return Wc(n,t);case"input":return n.getAttribute("type")==="checkbox"?n.checked?"[x]":"[ ]":"";case"table":return kb(n,t);case"div":case"span":case"section":case"article":case"main":case"header":case"footer":case"nav":case"aside":case"figure":case"figcaption":case"details":case"summary":return Le(n,t);default:return Le(n,t)}}function Le(e,t){let n="";for(const s of Array.from(e.childNodes))n+=Fi(s,t);return n}function Ue(e,t){return Le(e,t).replace(/\n+/g," ").trim()}function ur(e,t,n){const s=Array.from(e.children).filter(o=>o.tagName.toLowerCase()==="li"),i="  ".repeat(t.listDepth);let a="";for(let o=0;o<s.length;o++){const c=s[o],d={listDepth:t.listDepth+1,orderedIndex:[...t.orderedIndex,o+1]},u=n?`${o+1}. `:"- ",l=Wc(c,d);a+=`${i}${u}${l}
`}return t.listDepth===0&&(a+=`
`),a}function Wc(e,t){let n="";for(const s of Array.from(e.childNodes)){const i=s.tagName?.toLowerCase();i==="ul"||i==="ol"?n+=`
`+Fi(s,t):n+=Fi(s,t)}return n.trim()}function kb(e,t){const n=[],s=e.querySelector("thead tr"),i=e.querySelectorAll("tbody tr");if(s){const u=Array.from(s.querySelectorAll("th, td")).map(l=>Ue(l,t));n.push(u)}for(const u of Array.from(i)){const l=Array.from(u.querySelectorAll("td, th")).map(p=>Ue(p,t));n.push(l)}if(n.length===0){const u=e.querySelectorAll("tr");for(const l of Array.from(u)){const p=Array.from(l.querySelectorAll("td, th")).map(v=>Ue(v,t));n.push(p)}}if(n.length===0)return"";const a=Math.max(...n.map(u=>u.length)),o=[];for(let u=0;u<a;u++)o[u]=Math.max(3,...n.map(l=>(l[u]??"").length));let c="";const d=u=>`| ${o.map((p,v)=>(u[v]??"").padEnd(p)).join(" | ")} |`;c+=d(n[0])+`
`,c+=`| ${o.map(u=>"-".repeat(u)).join(" | ")} |
`;for(let u=1;u<n.length;u++)c+=d(n[u])+`
`;return c+`
`}function $b(e){let t=e;return t=t.replace(/\u00a0/g," "),t=t.replace(/\n{3,}/g,`

`),t=t.trim(),t&&!t.endsWith(`
`)&&(t+=`
`),t}function Ab(e){return e.includes(`
`)&&e.indexOf(`
`)<e.length-1?e:e.replace(/\\n/g,`
`)}function Tb(e){const t=new Date(e),s=new Date().getTime()-t.getTime(),i=Math.floor(s/(1e3*60));if(i<1)return"Just now";if(i<60)return`${i}m ago`;const a=Math.floor(i/60);return a<24?`${a}h ago`:t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}function xb(e){const t="VAULT",n=encodeURIComponent(`01-Daily/${e}`);return`obsidian://open?vault=${t}&file=${n}`}let mn=null,Ht=null;function pr(e,t,n=1500){mn&&clearTimeout(mn),mn=setTimeout(()=>{e!==Ht&&(Ht=e,t(e))},n)}function _b(e,t){mn&&clearTimeout(mn),e!==Ht&&(Ht=e,t(e))}function ui(e){for(const t of e.querySelectorAll('input[type="checkbox"]')){const n=t;n.checked?n.setAttribute("checked",""):n.removeAttribute("checked")}return Sb(e.innerHTML)}function Cb(e){const{data:t,loading:n,error:s,onRefresh:i,onGenerate:a,onOpenInObsidian:o,onSaveBrief:c,onToggleCheckbox:d,onOpenFile:u}=e;if(n)return r`
      <div class="my-day-card brief-section">
        <div class="my-day-card-header">
          <div class="my-day-card-title">
            <span class="my-day-card-icon">\uD83D\uDCCA</span>
            <span>DAILY BRIEF</span>
          </div>
        </div>
        <div class="my-day-card-content">
          <div class="brief-loading">
            <div class="spinner"></div>
            <span>Loading brief...</span>
          </div>
        </div>
      </div>
    `;if(s)return r`
      <div class="my-day-card brief-section">
        <div class="my-day-card-header">
          <div class="my-day-card-title">
            <span class="my-day-card-icon">\uD83D\uDCCA</span>
            <span>DAILY BRIEF</span>
          </div>
        </div>
        <div class="my-day-card-content">
          <div class="brief-error">
            <span class="error-icon">\u26A0\uFE0F</span>
            <span>${s}</span>
            ${i?r`<button class="retry-button" @click=${i}>Retry</button>`:h}
          </div>
        </div>
      </div>
    `;if(!t||!t.content)return r`
      <div class="my-day-card brief-section">
        <div class="my-day-card-header">
          <div class="my-day-card-title">
            <span class="my-day-card-icon">\uD83D\uDCCA</span>
            <span>DAILY BRIEF</span>
          </div>
        </div>
        <div class="my-day-card-content">
          <div class="brief-empty">
            <span class="empty-icon">\uD83D\uDCDD</span>
            <span>No brief available for today</span>
            <span class="empty-hint">Your morning brief pulls together your calendar, tasks, goals, and energy data into a single scannable page.</span>
            ${a?r`<button class="brief-generate-btn" @click=${a}>Generate Brief Now</button>`:i?r`<button class="brief-generate-btn" @click=${i}>Generate Brief Now</button>`:h}
            <span class="empty-hint" style="margin-top: 8px; font-size: 12px;">Briefs auto-generate at 5:00 AM when configured.</span>
          </div>
        </div>
      </div>
    `;Ht===null&&(Ht=t.content);const l=S=>{const $=S.currentTarget;if(c){const T=ui($);pr(T,c)}},p=S=>{if((S.ctrlKey||S.metaKey)&&S.key==="s"){S.preventDefault();const $=S.currentTarget;if(c){const T=ui($);_b(T,c)}}if((S.ctrlKey||S.metaKey)&&S.key==="l"){S.preventDefault();const $=window.getSelection();if(!$||$.rangeCount===0)return;const T=$.focusNode,P=T instanceof HTMLElement?T.closest("li"):T?.parentElement?.closest("li");if(P){const L=P.querySelector('input[type="checkbox"]');if(L)L.nextSibling?.nodeType===Node.TEXT_NODE&&L.nextSibling.textContent===" "&&L.nextSibling.remove(),L.remove();else{const C=document.createElement("input");C.type="checkbox",P.insertBefore(document.createTextNode(" "),P.firstChild),P.insertBefore(C,P.firstChild)}const A=S.currentTarget;if(c){const C=ui(A);pr(C,c)}}}if(S.key==="Enter"&&!S.shiftKey){const $=window.getSelection();if(!$||$.rangeCount===0)return;const T=$.focusNode,P=T instanceof HTMLElement?T.closest("li"):T?.parentElement?.closest("li");P&&P.querySelector('input[type="checkbox"]')&&setTimeout(()=>{const L=window.getSelection();if(!L||L.rangeCount===0)return;const A=L.focusNode,C=A instanceof HTMLElement?A.closest("li"):A?.parentElement?.closest("li");if(C&&C!==P&&!C.querySelector('input[type="checkbox"]')){const x=document.createElement("input");x.type="checkbox",C.insertBefore(x,C.firstChild),C.insertBefore(document.createTextNode(" "),x.nextSibling);const F=document.createRange();F.setStartAfter(x.nextSibling),F.collapse(!0),L.removeAllRanges(),L.addRange(F)}},0)}},v=S=>{const $=S.target;if($.tagName==="INPUT"&&$.getAttribute("type")==="checkbox"){const L=$,A=S.currentTarget;if(d&&A){const x=Array.from(A.querySelectorAll('input[type="checkbox"]')).indexOf(L);x>=0&&d(x,L.checked)}return}const T=wb(S.target);if(T&&u){S.preventDefault(),u(T);return}const P=$.closest?.("a")??$.parentElement?.closest("a");if(P){const L=P.getAttribute("href")??"";/^https?:\/\//i.test(L)&&(S.preventDefault(),window.open(L,"_blank","noopener,noreferrer"))}},y=Ju(Ab(t.content)),b=t.summary.readiness!=null?r`<span class="brief-readiness" title="Readiness Score${t.summary.readinessMode?` — ${t.summary.readinessMode}`:""}">
        <span class="readiness-score">${t.summary.readiness}</span>
        <span class="readiness-label">Readiness</span>
      </span>`:h,k=t.summary.tasks.total>0?r`<span class="brief-task-progress" title="${t.summary.tasks.completed}/${t.summary.tasks.total} tasks done">
        ${t.summary.tasks.completed}/${t.summary.tasks.total}
      </span>`:h;return r`
    <div class="my-day-card brief-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83D\uDCCA</span>
          <span>DAILY BRIEF</span>
          ${b}
          ${k}
        </div>
        <div class="brief-header-actions">
          <span class="brief-updated">${Tb(t.updatedAt)}</span>
          ${o?r`
                <a
                  href="${xb(t.date)}"
                  class="brief-obsidian-link"
                  title="Open in Obsidian"
                  @click=${S=>{S.preventDefault(),o()}}
                >
                  <span class="obsidian-icon">\uD83D\uDCD3</span>
                </a>
              `:h}
          ${i?r`
                <button class="brief-refresh-btn" @click=${i} title="Refresh">
                  \uD83D\uDD04
                </button>
              `:h}
        </div>
      </div>

      <div class="my-day-card-content">
        <div class="brief-content brief-content--live">
          <div
            class="brief-rendered brief-editable"
            contenteditable="true"
            spellcheck="false"
            @input=${l}
            @keydown=${p}
            @click=${v}
          >${yt(y)}</div>
        </div>
      </div>
    </div>
  `}function qc(e){const t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}function Eb(e){return e.source.persona?e.source.persona.replace(/-/g," ").replace(/\b\w/g,t=>t.toUpperCase()):e.source.skill?e.source.skill:e.type==="agent-execution"?"Agent":"Skill"}function Lb(e){return e<=2?"Poor":e<=4?"Below expectations":e<=6?"Okay":e<=8?"Good":"Excellent"}function jc(e,t){if(e.scoringId!==t.id)return h;const n=e.scoringValue??7,s=e.feedbackText??"",i=n<=4,a=n<=4||n>=9;return r`
    <div class="inbox-scoring">
      <div class="inbox-score-label">
        Rate this output
        <span class="inbox-score-value ${n<=4?"low":n>=9?"high":""}">${n}/10 — ${Lb(n)}</span>
      </div>
      <div class="inbox-score-row">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>r`
            <button
              class="inbox-score-btn${o===n?" active":""}${o<=4?" low":o>=9?" high":""}"
              @click=${()=>e.onSetScoring(t.id,o)}
            >${o}</button>
          `)}
      </div>
      ${a?r`
            <div class="inbox-feedback">
              <textarea
                class="inbox-feedback-input"
                rows="3"
                placeholder=${i?"What went wrong? This feedback improves the agent. (required)":"What made this great? (optional)"}
                .value=${s}
                @input=${o=>e.onFeedbackChange(o.target.value)}
              ></textarea>
            </div>
          `:h}
      <div class="inbox-score-actions">
        <button
          class="btn btn--sm inbox-score-submit"
          ?disabled=${i&&!s.trim()}
          @click=${()=>e.onScore(t.id,n,s.trim()||void 0)}
        >Submit ${n}/10</button>
        <button
          class="btn btn--sm inbox-score-cancel"
          @click=${()=>e.onSetScoring(null)}
        >Cancel</button>
      </div>
    </div>
  `}function Pb(e,t){const n=t.deliverables??[];return r`
    <div class="inbox-card inbox-card--project">
      <div class="inbox-card-header">
        <span class="inbox-card-source">Project Complete</span>
        <span class="inbox-card-time">${qc(t.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${t.title}</div>
        <div class="inbox-card-summary">${t.summary}</div>
        ${n.length>0?r`
              <div class="inbox-deliverables">
                ${n.map(s=>r`
                    <div class="inbox-deliverable-row">
                      <span class="inbox-deliverable-persona">${s.persona.replace(/-/g," ")}</span>
                      <span class="inbox-deliverable-title">${s.title}</span>
                      ${s.proofDocSlug?r`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View</button>`:h}
                    </div>
                  `)}
              </div>
            `:h}
      </div>
      <div class="inbox-card-actions">
        <button class="btn btn--sm primary" @click=${()=>e.onOpenChat(t.id)}>Review in Chat</button>
        ${t.proofDocSlug?r`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View Deliverables</button>`:h}
        <button class="btn btn--sm" @click=${()=>e.onSetScoring(t.id,7)}>Score</button>
        <button class="btn btn--sm" @click=${()=>e.onDismiss(t.id)}>Dismiss</button>
      </div>
      ${jc(e,t)}
    </div>
  `}function Rb(e,t){if(t.type==="project-completion")return Pb(e,t);const n=!!(t.sessionId||t.source.taskId||t.source.queueItemId);return r`
    <div class="inbox-card">
      <div class="inbox-card-header">
        <span class="inbox-card-source">${Eb(t)}</span>
        <span class="inbox-card-time">${qc(t.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${t.title}</div>
        <div class="inbox-card-summary">${t.summary.slice(0,220)}${t.summary.length>220?"…":""}</div>
      </div>
      <div class="inbox-card-actions">
        ${t.outputPath?r`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View Output</button>`:h}
        ${t.proofDocSlug?r`<button class="btn btn--sm" @click=${()=>e.onViewProof(t.id)}>Proof</button>`:h}
        ${n?r`<button class="btn btn--sm" @click=${()=>e.onOpenChat(t.id)}>Open Chat</button>`:h}
        <button class="btn btn--sm primary" @click=${()=>e.onSetScoring(t.id,7)}>Complete</button>
        <button class="btn btn--sm" @click=${()=>e.onDismiss(t.id)}>Dismiss</button>
      </div>
      ${jc(e,t)}
    </div>
  `}function Ib(e){const t=e.sortOrder??"newest",n=e.items.filter(i=>i.status==="pending").sort((i,a)=>{const o=new Date(a.createdAt).getTime()-new Date(i.createdAt).getTime();return t==="oldest"?-o:o}),s=e.count??n.length;return e.loading?r`<div class="inbox-loading">Loading inbox…</div>`:s===0?r`
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
          <span class="tab-badge" style="margin-left: 8px;">${s}</span>
        </div>
        <div class="inbox-header-actions">
          <button class="btn btn--sm" @click=${()=>e.onSortToggle?.()}>${t==="newest"?"Newest first":"Oldest first"}</button>
          <button class="btn btn--sm" @click=${()=>e.onMarkAll()}>Mark All Complete</button>
        </div>
      </div>
      <div class="my-day-card-content">
        <div class="inbox-list">
          ${n.map(i=>Rb(e,i))}
        </div>
      </div>
    </div>
  `}function Hc(e){return!Number.isFinite(e)||e<=0?"0 B":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function Ca(e){switch(e){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function hr(e){return e==="running"?"ws-session-dot ws-session-dot--running":e==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function Vc(e){return`ws-task-priority ws-task-priority--${e}`}function Gc(e){return e==="high"?"High":e==="low"?"Low":"Med"}function Yc(e){if(!e)return"";const t=ie();return e===t?"Today":e<t?`Overdue (${e})`:e}function Qc(e){if(!e)return"ws-task-due";const t=ie();return e<t?"ws-task-due ws-task-due--overdue":e===t?"ws-task-due ws-task-due--today":"ws-task-due"}function ds(e,t="due"){const n={high:0,medium:1,low:2};return[...e].sort((s,i)=>{if(t==="priority"){const a=n[s.priority]-n[i.priority];return a!==0?a:s.dueDate&&i.dueDate?s.dueDate.localeCompare(i.dueDate):s.dueDate&&!i.dueDate?-1:!s.dueDate&&i.dueDate?1:0}if(t==="newest")return(i.createdAt||"").localeCompare(s.createdAt||"");if(s.dueDate&&i.dueDate){const a=s.dueDate.localeCompare(i.dueDate);if(a!==0)return a}else{if(s.dueDate&&!i.dueDate)return-1;if(!s.dueDate&&i.dueDate)return 1}return n[s.priority]-n[i.priority]})}function fr(e,t,n,s,i,a,o){const c=e.status==="complete";return s===e.id?r`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${u=>{u.preventDefault();const l=u.currentTarget,p=l.querySelector(".ws-task-edit-input"),v=l.querySelector(".ws-task-date-input"),y=p.value.trim();y&&(a?.(e.id,{title:y,dueDate:v.value||null}),i?.(null))}}
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
    `:r`
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
      ${e.briefSection?r`<span class="ws-task-section">${e.briefSection}</span>`:h}
      <span class=${Vc(e.priority)}>${Gc(e.priority)}</span>
      ${e.dueDate?r`<span class=${Qc(e.dueDate)}>${Yc(e.dueDate)}</span>`:h}
      ${!c&&e.queueStatus?.status==="processing"?r`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!c&&e.queueStatus?.status==="review"&&n?r`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>n(e.id)}
              title="Review agent output"
            >Review</button>`:e.queueStatus?.status==="done"?r`
                ${h}
                ${n?r`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>n(e.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:h}
              `:!c&&n?r`<button
                  class="ws-task-start-btn"
                  @click=${()=>n(e.id)}
                  title="Start working on this task"
                >Start</button>`:h}
    </div>
  `}function Bi(e,t,n,s,i,a,o){const c=e.status==="complete";return s===e.id?r`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${u=>{u.preventDefault();const l=u.currentTarget,p=l.querySelector(".ws-task-edit-input"),v=l.querySelector(".ws-task-date-input"),y=p.value.trim();y&&(a?.(e.id,{title:y,dueDate:v.value||null}),i?.(null))}}
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
    `:r`
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
      ${e.project?r`<span class="ws-task-project">${e.project}</span>`:h}
      ${e.briefSection?r`<span class="ws-task-section">${e.briefSection}</span>`:h}
      <span class=${Vc(e.priority)}>${Gc(e.priority)}</span>
      ${e.dueDate?r`<span class=${Qc(e.dueDate)}>${Yc(e.dueDate)}</span>`:h}
      ${!c&&e.queueStatus?.status==="processing"?r`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!c&&e.queueStatus?.status==="review"&&n?r`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>n(e.id)}
              title="Review agent output"
            >Review</button>`:e.queueStatus?.status==="done"?r`
                ${o?r`<button
                      class="ws-task-start-btn ws-task-start-btn--done"
                      @click=${()=>o(e.id)}
                      title="Preview agent output"
                    >View Output</button>`:h}
                ${n?r`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>n(e.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:h}
              `:!c&&n?r`<button
                  class="ws-task-start-btn"
                  @click=${()=>n(e.id)}
                  title="Start working on this task"
                >Start</button>`:h}
    </div>
  `}function Mb(e,t){return e.trim()?t.toLowerCase().includes(e.trim().toLowerCase()):!0}function gr(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.name.toLowerCase().includes(n)||s.path.toLowerCase().includes(n)||s.type.toLowerCase().includes(n)||(s.searchText??"").toLowerCase().includes(n))}function mr(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.title.toLowerCase().includes(n)||s.key.toLowerCase().includes(n))}function Jc(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.reduce((s,i)=>{if(i.type==="file")(i.name.toLowerCase().includes(n)||i.path.toLowerCase().includes(n))&&s.push(i);else{const a=Jc(e,i.children??[]);a.length>0&&s.push({...i,children:a})}return s},[])}function Xc(e){let t=0;for(const n of e)n.type==="file"?t++:n.children&&(t+=Xc(n.children));return t}const Db=10;function Ob(e){if(!e.searchText)return null;const t=e.searchText.trim();if(!t)return null;const n=t.match(/#+ (.+?)(?:\s#|$)/);return n?n[1].trim().slice(0,120):(t.startsWith("---")?t.replace(/^---.*?---\s*/s,""):t).slice(0,120)||null}function Nb(e,t=Db){return[...e].sort((n,s)=>s.modified.getTime()-n.modified.getTime()).slice(0,t)}function Zc(e,t,n){if(e.type==="file"){const o=n.pinnedPaths.has(e.path);return r`
      <div class="ws-folder-file-row" style="padding-left: ${12+t*16}px">
        <button
          class="ws-folder-file"
          @click=${()=>n.onItemClick?.({path:e.path,name:e.name,type:e.fileType??"text",size:e.size??0,modified:e.modified??new Date})}
        >
          <span class="ws-list-icon">${Ca(e.fileType??"text")}</span>
          <span class="ws-list-title">${e.name}</span>
          ${e.size!=null?r`<span class="ws-list-meta">${Hc(e.size)}</span>`:h}
          ${e.modified?r`<span class="ws-list-meta">${B(e.modified.getTime())}</span>`:h}
        </button>
        <button
          class="ws-pin-btn ${o?"active":""}"
          @click=${()=>n.onPinToggle?.(n.workspaceId,e.path,o)}
          title=${o?"Unpin":"Pin"}
        >
          ${o?"Unpin":"Pin"}
        </button>
      </div>
    `}const s=n.expandedFolders.has(e.path),i=e.children??[],a=Xc(i);return r`
    <div class="ws-folder-node">
      <button
        class="ws-folder-header"
        style="padding-left: ${12+t*16}px"
        @click=${()=>n.onToggleFolder?.(e.path)}
      >
        <span class="ws-folder-chevron ${s?"expanded":""}">&#9654;</span>
        <span class="ws-list-icon">&#128193;</span>
        <span class="ws-folder-name">${e.name}</span>
        <span class="ws-folder-count">${a} ${a===1?"file":"files"}</span>
      </button>
      ${s?r`
            <div class="ws-folder-children">
              ${i.map(o=>Zc(o,t+1,n))}
            </div>
          `:h}
    </div>
  `}function Fb(e,t,n){return r`
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
      ${n?r`<button
            class="workspace-card-delete"
            title="Delete workspace"
            @click=${s=>{s.stopPropagation(),confirm(`Delete workspace "${e.name}"? This removes it from your list but does not delete any files.`)&&n(e)}}
          >&times;</button>`:h}
    </div>
  `}function pi(e){const{workspaceId:t,entry:n,pinned:s,onOpen:i,onPinToggle:a}=e;return r`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(n)}>
        <span class="ws-list-icon">${Ca(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${Hc(n.size)}</span>
        <span class="ws-list-meta">${B(n.modified.getTime())}</span>
      </button>
      <button
        class="ws-pin-btn ${s?"active":""}"
        @click=${()=>a?.(t,n.path,s)}
        title=${s?"Unpin":"Pin"}
      >
        ${s?"Unpin":"Pin"}
      </button>
    </div>
  `}function Bb(e){const{workspaceId:t,entry:n,pinned:s,onOpen:i,onPinToggle:a}=e,o=Ob(n);return r`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(n)}>
        <span class="ws-list-icon">${Ca(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${B(n.modified.getTime())}</span>
        ${o?r`<span class="ws-list-desc">${o}</span>`:h}
      </button>
      <button
        class="ws-pin-btn ${s?"active":""}"
        @click=${()=>a?.(t,n.path,s)}
        title=${s?"Unpin":"Pin"}
      >
        ${s?"Unpin":"Pin"}
      </button>
    </div>
  `}function Ub(e,t){return r`
    <div class="workspace-breadcrumbs">
      ${e.map((n,s)=>r`
          ${s>0?r`<span class="breadcrumb-sep">/</span>`:h}
          <button
            class="breadcrumb-item ${s===e.length-1?"breadcrumb-current":""}"
            @click=${()=>t(n.path)}
          >${n.name}</button>
        `)}
    </div>
  `}function Kb(e){const{browseEntries:t,breadcrumbs:n,browseSearchQuery:s,browseSearchResults:i,onBrowseFolder:a,onBrowseSearch:o,onBrowseBack:c,onCreateFolder:d,onItemClick:u}=e,l=i??t??[];return r`
    <div class="workspace-browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${()=>c?.()}>
          &larr; Back
        </button>
        ${n?Ub(n,p=>a?.(p)):h}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          .value=${s??""}
          @input=${p=>{const v=p.target;o?.(v.value)}}
        />
        <button
          class="workspace-browse-new-folder"
          @click=${()=>{const p=prompt("New folder name:");if(p?.trim()){const v=n?.[n.length-1]?.path??".";d?.(`${v}/${p.trim()}`)}}}
        >+ Folder</button>
      </div>

      <div class="workspace-browse-list">
        ${l.length===0?r`<div class="workspace-browse-empty">No files found</div>`:l.map(p=>r`
              <button
                class="workspace-browse-entry"
                @click=${()=>{p.type==="folder"?a?.(p.path):u&&u({path:p.path,name:p.name,type:p.fileType??"text",size:p.size??0,modified:new Date})}}
              >
                <span class="browse-entry-icon">${p.type==="folder"?"📁":"📄"}</span>
                <span class="browse-entry-name">${p.name}</span>
                ${p.excerpt?r`<span class="browse-entry-excerpt">${p.excerpt}</span>`:h}
              </button>
            `)}
      </div>
    </div>
  `}function zb(e){const{workspace:t,itemSearchQuery:n,expandedFolders:s=new Set,showCompletedTasks:i=!1,onItemSearch:a,onBack:o,onItemClick:c,onSessionClick:d,onPinToggle:u,onPinSessionToggle:l,onToggleFolder:p,onToggleTaskComplete:v,onCreateTask:y,onToggleCompletedTasks:b,onStartTask:k,editingTaskId:S,onEditTask:$,onUpdateTask:T,onBatchPushToDrive:P}=e,L=gr(n,t.pinned).toSorted((O,ge)=>ge.modified.getTime()-O.modified.getTime()),A=mr(n,t.pinnedSessions),C=gr(n,t.outputs).filter(O=>!t.pinned.some(ge=>ge.path===O.path)),x=(t.folderTree?.length??0)>0,F=x?Jc(n,t.folderTree):[],M=mr(n,t.sessions),U=new Set(t.pinnedSessions.map(O=>O.key)),K=new Set(t.pinned.map(O=>O.path)),W=n.trim().length>0,re=L.length>0||A.length>0,Se=M.length>0||t.sessions.length===0||W,Ie=Nb(t.outputs),G=Ie.length>0&&!W,Z={expandedFolders:s,pinnedPaths:K,workspaceId:t.id,onToggleFolder:p,onItemClick:c,onPinToggle:u};return r`
    <div class="workspaces-container">
      <div class="workspaces-header">
        <div class="workspaces-title">
          <button class="workspace-back-btn" @click=${o}>←</button>
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
            .value=${n}
            @input=${O=>a?.(O.target.value)}
          />
          <button
            class="workspace-browse-btn"
            @click=${()=>e.onBrowseFolder?.(".")}
          >Browse Files</button>
        </div>
      </div>

      <div class="workspace-content">
        ${e.browsePath!=null?Kb(e):h}

        ${re?r`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${L.length+A.length}</span>
                  </div>
                  <div class="ws-list">
                    ${A.map(O=>r`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>d?.(O)}>
                            <span class=${hr(O.status)}></span>
                            <span class="ws-list-title">${O.title}</span>
                            <span class="ws-list-meta">${B(O.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>l?.(t.id,O.key,!0)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${L.map(O=>pi({workspaceId:t.id,entry:O,pinned:!0,onOpen:c,onPinToggle:u}))}
                  </div>
                </section>
              `:h}

        ${Wb({tasks:t.tasks??[],workspaceName:t.name,showCompleted:i,onToggleTaskComplete:v,onCreateTask:y,onToggleCompletedTasks:b,onStartTask:k,editingTaskId:S,onEditTask:$,onUpdateTask:T})}

        ${G?r`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Recent</h3>
                  <span>${Ie.length}</span>
                </div>
                <div class="ws-list">
                  ${Ie.map(O=>Bb({workspaceId:t.id,entry:O,pinned:K.has(O.path),onOpen:c,onPinToggle:u}))}
                </div>
              </section>
            `:h}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${x?F.length:C.length}</span>
            ${P&&C.length>0?r`<button class="ws-export-drive-btn" @click=${()=>{const O=C.map(ge=>ge.path);P(O)}}>Export to Drive</button>`:h}
          </div>
          <div class="ws-list ws-list--scroll">
            ${x?F.length===0?r`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:F.map(O=>Zc(O,0,Z)):C.length===0?r`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:C.map(O=>pi({workspaceId:t.id,entry:O,pinned:!1,onOpen:c,onPinToggle:u}))}
          </div>
        </section>

        ${Se?r`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${M.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${M.length===0?r`
                            <div class="ws-empty">
                              <span class="ws-empty-hint">No sessions yet. Sessions are saved conversations with your ally — start a chat to create one.</span>
                            </div>
                          `:M.map(O=>r`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>d?.(O)}>
                                  <span class=${hr(O.status)}></span>
                                  <span class="ws-list-title">${O.title}</span>
                                  <span class="ws-list-meta">${B(O.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${U.has(O.key)?"active":""}"
                                  @click=${()=>l?.(t.id,O.key,U.has(O.key))}
                                  title=${U.has(O.key)?"Unpin":"Pin"}
                                >
                                  ${U.has(O.key)?"Unpin":"Pin"}
                                </button>
                              </div>
                            `)}
                  </div>
                </section>
              `:h}

        ${(t.memory?.length??0)>0?r`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Memory</h3>
                  <span>${t.memory.length}</span>
                </div>
                <div class="ws-list ws-list--scroll">
                  ${t.memory.map(O=>pi({workspaceId:t.id,entry:O,pinned:K.has(O.path),onOpen:c,onPinToggle:u}))}
                </div>
              </section>
            `:h}
      </div>
    </div>
  `}function Wb(e){const{tasks:t,workspaceName:n,showCompleted:s,onToggleTaskComplete:i,onCreateTask:a,onToggleCompletedTasks:o,onStartTask:c,editingTaskId:d,onEditTask:u,onUpdateTask:l}=e,p=ds(t.filter(y=>y.status==="pending")),v=ds(t.filter(y=>y.status==="complete"));return r`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${p.length} open${v.length>0?`, ${v.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${p.length===0&&v.length===0?r`<div class="ws-empty">No tasks</div>`:h}
        ${p.map(y=>fr(y,i,c,d,u,l))}
        ${v.length>0?r`
              <button class="ws-task-completed-toggle" @click=${()=>o?.()}>
                ${s?"Hide":"Show"} ${v.length} completed
              </button>
              ${s?v.map(y=>fr(y,i,c,d,u,l)):h}
            `:h}
      </div>
      ${a?r`
            <form
              class="ws-task-create-form"
              @submit=${y=>{y.preventDefault();const k=y.currentTarget.querySelector("input"),S=k.value.trim();S&&(a(S,n),k.value="")}}
            >
              <input
                type="text"
                class="ws-task-create-input"
                placeholder="Add a task..."
              />
              <button type="submit" class="ws-task-create-btn">Add</button>
            </form>
          `:h}
    </section>
  `}function xS(e){const{connected:t,workspaces:n,selectedWorkspace:s,searchQuery:i,itemSearchQuery:a,expandedFolders:o,loading:c,createLoading:d,error:u,allTasks:l=[],taskFilter:p="outstanding",taskSort:v="due",taskSearch:y="",showCompletedTasks:b=!1,editingTaskId:k,workspaceNames:S=[],onSearch:$,onItemSearch:T,onSelectWorkspace:P,onBack:L,onItemClick:A,onSessionClick:C,onPinToggle:x,onPinSessionToggle:F,onCreateWorkspace:M,onDeleteWorkspace:U,onToggleFolder:K,onTeamSetup:W,onToggleTaskComplete:re,onCreateTask:Se,onSetTaskFilter:Ie,onSetTaskSort:G,onSetTaskSearch:Z,onToggleCompletedTasks:O,onStartTask:ge,onEditTask:ot,onUpdateTask:Y}=e,_t=n.filter(z=>Mb(i,`${z.name} ${z.path} ${z.type}`));return s?zb({workspace:s,itemSearchQuery:a??"",expandedFolders:o,showCompletedTasks:b,onItemSearch:T,onBack:L,onItemClick:A,onSessionClick:C,onPinToggle:x,onPinSessionToggle:F,onToggleFolder:K,onToggleTaskComplete:re,onCreateTask:Se,onToggleCompletedTasks:O,onStartTask:ge,editingTaskId:k,onEditTask:ot,onUpdateTask:Y,browsePath:e.browsePath,browseEntries:e.browseEntries,breadcrumbs:e.breadcrumbs,browseSearchQuery:e.browseSearchQuery,browseSearchResults:e.browseSearchResults,onBrowseFolder:e.onBrowseFolder,onBrowseSearch:e.onBrowseSearch,onBrowseBack:e.onBrowseBack,onCreateFolder:e.onCreateFolder,onBatchPushToDrive:e.onBatchPushToDrive}):r`
    <div class="workspaces-container">
      <div class="workspaces-toolbar">
        <form
            class="workspaces-create-form"
            @submit=${async z=>{if(z.preventDefault(),d||!M)return;const Gt=z.currentTarget,j=new FormData(Gt),Ve=j.get("name"),Ct=(typeof Ve=="string"?Ve:"").trim();if(!Ct)return;const Me=j.get("type"),Et=(typeof Me=="string"?Me:"project").trim().toLowerCase(),Yt=Et==="team"||Et==="personal"?Et:"project",Qt=j.get("path"),Jt=(typeof Qt=="string"?Qt:"").trim();await M({name:Ct,type:Yt,...Jt?{path:Jt}:{}})!==!1&&Gt.reset()}}
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
              ?disabled=${!!d}
            >
              ${d?"Adding...":"Add Workspace"}
            </button>
          </form>
          <input
            type="text"
            class="workspaces-search-input"
            placeholder="Search workspaces..."
            .value=${i}
            @input=${z=>$?.(z.target.value)}
          />
          <span class="workspaces-count">${_t.length} workspaces</span>
          <span class="workspaces-status ${t?"online":"offline"}">
            ${t?"Online":"Offline"}
          </span>
          ${W?r`<button class="ws-team-setup-btn" @click=${()=>W()}>Team Setup</button>`:h}
      </div>

      ${u?r`<div class="callout danger" style="margin: 16px;">${u}</div>`:h}

      ${c?r`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `:r`
              <div class="workspaces-body">
                <div class="workspace-grid">
                  ${_t.length===0?r`
                          <div class="workspaces-empty">
                            <span class="workspaces-empty-icon">${t?"📭":"🔌"}</span>
                            <span>${t?"No workspaces yet":"Connect to gateway to see workspaces"}</span>
                            ${t?r`<span class="workspaces-empty-hint">Workspaces organize your projects. Ask your ally to create one, or start a focused session in chat.</span>`:h}
                          </div>
                        `:_t.map(z=>Fb(z,P,U))}
                </div>

                ${qb({tasks:l,taskFilter:p,taskSort:v,taskSearch:y,onToggleTaskComplete:re,onSetTaskFilter:Ie,onSetTaskSort:G,onSetTaskSearch:Z,onCreateTask:Se,workspaceNames:S,onStartTask:ge,editingTaskId:k,onEditTask:ot,onUpdateTask:Y})}
              </div>
            `}
    </div>
  `}function qb(e){const{tasks:t,taskFilter:n,taskSort:s="due",taskSearch:i="",onToggleTaskComplete:a,onSetTaskFilter:o,onSetTaskSort:c,onSetTaskSearch:d,onCreateTask:u,workspaceNames:l=[],onStartTask:p,editingTaskId:v,onEditTask:y,onUpdateTask:b}=e;if(t.length===0&&!u)return r``;let k;if(n==="outstanding")k=t.filter($=>$.status==="pending");else if(n==="today"){const $=ie();k=t.filter(T=>T.status==="pending"&&T.dueDate!=null&&T.dueDate<=$)}else n==="complete"?k=t.filter($=>$.status==="complete"):k=t;if(i){const $=i.toLowerCase();k=k.filter(T=>T.title.toLowerCase().includes($)||T.project?.toLowerCase().includes($))}const S=ds(k,s);return r`
    <div class="ws-all-tasks-section">
      <section class="ws-section">
        <div class="ws-section__header">
          <div class="ws-section__header-left">
            <h3>All Tasks</h3>
            ${d?r`<input
                  type="text"
                  class="ws-task-search"
                  placeholder="Search tasks..."
                  .value=${i}
                  @input=${$=>d($.target.value)}
                />`:h}
          </div>
          <div class="ws-task-controls">
            <div class="ws-task-filters">
              <button
                class="ws-task-filter-btn ${n==="all"?"active":""}"
                @click=${()=>o?.("all")}
              >All</button>
              <button
                class="ws-task-filter-btn ${n==="outstanding"?"active":""}"
                @click=${()=>o?.("outstanding")}
              >To Do</button>
              <button
                class="ws-task-filter-btn ${n==="today"?"active":""}"
                @click=${()=>o?.("today")}
              >Today</button>
              <button
                class="ws-task-filter-btn ${n==="complete"?"active":""}"
                @click=${()=>o?.("complete")}
              >Done</button>
            </div>
            <select
              class="ws-task-sort"
              .value=${s}
              @change=${$=>c?.($.target.value)}
            >
              <option value="due">Due Date</option>
              <option value="priority">Priority</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        ${u?r`
              <form
                class="ws-task-create-form"
                @submit=${$=>{$.preventDefault();const T=$.currentTarget,P=T.querySelector(".ws-task-create-input"),L=T.querySelector(".ws-task-create-project"),A=P.value.trim();if(!A)return;const C=L?.value||l[0]||"";u(A,C),P.value=""}}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                />
                ${l.length>0?r`
                      <select class="ws-task-create-project">
                        ${l.map($=>r`<option value=${$}>${$}</option>`)}
                      </select>
                    `:h}
                <button type="submit" class="ws-task-create-btn">Add</button>
              </form>
            `:h}
        <div class="ws-list ws-list--scroll">
          ${S.length===0?r`<div class="ws-empty">No tasks</div>`:S.map($=>Bi($,a,p,v,y,b))}
        </div>
      </section>
    </div>
  `}function jb(e){return e===ie()}function Hb(e){const t=new Date(e+"T12:00:00");return Vb(t)}function Vb(e){const t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],n=["January","February","March","April","May","June","July","August","September","October","November","December"],s=t[e.getDay()],i=n[e.getMonth()],a=e.getDate();return`${s}, ${i} ${a}`}function Gb(e){return r`
    <form class="ws-task-create-form" @submit=${t=>{t.preventDefault();const s=t.currentTarget.querySelector("input"),i=s.value.trim();i&&(e(i),s.value="")}}>
      <input type="text" class="ws-task-create-input" placeholder="Add a task for today..." />
      <button type="submit" class="ws-task-create-btn">Add</button>
    </form>
  `}function Yb(e){const t=ds(e.todayTasks??[],"due"),n=t.filter(i=>i.status==="pending"),s=t.filter(i=>i.status==="complete");return r`
    <div class="my-day-card today-tasks-panel">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x2705;</span>
          <span>TODAY'S TASKS</span>
        </div>
        <span class="today-tasks-count">
          ${n.length} open${s.length>0?r`, ${s.length} done`:h}
        </span>
      </div>
      <div class="my-day-card-content">
        ${e.todayTasksLoading?r`<div class="brief-loading"><div class="spinner"></div><span>Loading tasks...</span></div>`:r`
              ${e.onCreateTask?Gb(e.onCreateTask):h}
              <div class="today-tasks-list">
                ${n.length===0&&s.length===0?r`<div class="today-tasks-empty">No tasks for today. Add one above or drop tasks in your daily brief.</div>`:n.map(i=>Bi(i,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask,e.onViewTaskOutput))}
              </div>
              ${s.length>0?r`
                    <button class="today-completed-toggle" @click=${()=>e.onToggleCompletedTasks?.()}>
                      ${e.showCompletedTasks?"Hide":"Show"} ${s.length} completed
                    </button>
                    ${e.showCompletedTasks?r`<div class="today-tasks-list today-tasks-list--completed">
                          ${s.map(i=>Bi(i,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask))}
                        </div>`:h}
                  `:h}
            `}
      </div>
    </div>
  `}function Qb(e){const t=ie(),n=e.selectedDate??t,s=jb(n),i=Hb(n),a=e.viewMode??"brief";return r`
    <div class="my-day-toolbar">
      <div class="today-date-nav">
        ${e.onDatePrev?r`<button class="today-date-btn" @click=${e.onDatePrev} title="Previous day">&#x2039;</button>`:h}
        <span class="today-date-label ${s?"":"past-date"}">${i}</span>
        ${e.onDateNext?r`<button class="today-date-btn" @click=${e.onDateNext} title="Next day">&#x203A;</button>`:h}
        ${!s&&e.onDateToday?r`<button class="today-date-today-btn" @click=${e.onDateToday}>Today</button>`:h}
      </div>
      <div class="today-view-tabs">
        <button class="today-view-tab ${a==="brief"?"active":""}"
          @click=${()=>e.onViewModeChange?.("brief")}>Brief</button>
        <button class="today-view-tab ${a==="tasks"?"active":""}"
          @click=${()=>e.onViewModeChange?.("tasks")}>Tasks</button>
        <button class="today-view-tab ${a==="inbox"?"active":""}"
          @click=${()=>e.onViewModeChange?.("inbox")}>Inbox${(e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length??0)>0?r`<span class="tab-badge">${e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length}</span>`:h}</button>
      </div>
      <div class="today-quick-actions">
        ${new Date().getHours()<15?!e.focusPulseActive&&e.onStartMorningSet?r`<button class="today-morning-set-btn" @click=${e.onStartMorningSet}
                  title="Start your morning focus ritual">\u2600\uFE0F Start my day</button>`:h:e.onEveningCapture?r`<button class="today-evening-btn" @click=${e.onEveningCapture}
                  title="Reflect on your day and set up tomorrow">\uD83C\uDF19 Evening Capture</button>`:h}
        ${e.onRefresh?r`<button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh / Generate Brief">&#x21BB;</button>`:null}
      </div>
    </div>
  `}function Jb(e){return r`
    <div class="my-day-brief-full">
      ${Ib({items:e.inboxItems??[],loading:e.inboxLoading,count:e.inboxCount,sortOrder:e.inboxSortOrder??"newest",scoringId:e.inboxScoringId,scoringValue:e.inboxScoringValue,feedbackText:e.inboxFeedbackText,onViewOutput:t=>e.onInboxViewOutput?.(t),onViewProof:t=>e.onInboxViewProof?.(t),onOpenChat:t=>e.onInboxOpenChat?.(t),onDismiss:t=>e.onInboxDismiss?.(t),onScore:(t,n,s)=>e.onInboxScore?.(t,n,s),onSetScoring:(t,n)=>e.onInboxSetScoring?.(t,n),onFeedbackChange:t=>e.onInboxFeedbackChange?.(t),onSortToggle:()=>e.onInboxSortToggle?.(),onMarkAll:()=>e.onInboxMarkAll?.()})}
    </div>
  `}function Xb(e){const t=e.trustSummary;if(!t||t.workflowCount===0)return h;const n=t.overallScore===null?"var(--text-secondary)":t.overallScore>=8?"var(--ok, #22c55e)":t.overallScore>=5?"var(--warn, #eab308)":"var(--danger, #ef4444)",s=t.overallScore!==null?t.overallScore.toFixed(1):"--";return r`
    <div class="my-day-card trust-summary-card">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x1F3AF;</span>
          <span>TRUST</span>
        </div>
        ${e.onNavigateToTrust?r`<button class="brief-refresh-btn" @click=${e.onNavigateToTrust}
              title="View full trust dashboard">Details &#x2192;</button>`:h}
      </div>
      <div class="my-day-card-content" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
        <div style="text-align:center;min-width:60px;">
          <div style="font-size:28px;font-weight:700;color:${n};line-height:1;">${s}</div>
          <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">/ 10</div>
        </div>
        <div style="flex:1;min-width:120px;font-size:13px;color:var(--text-secondary);line-height:1.6;">
          <div>${t.workflowCount} workflow${t.workflowCount!==1?"s":""} tracked</div>
          ${t.highPerformers>0?r`<div style="color:var(--ok, #22c55e);">${t.highPerformers} above 8.0</div>`:h}
          ${t.needsAttention>0?r`<div style="color:var(--warn, #eab308);">${t.needsAttention} need${t.needsAttention!==1?"":"s"} attention</div>`:h}
          ${t.dailyStreak>0?r`<div>${t.dailyStreak}-day streak</div>`:h}
        </div>
        ${!t.todayRated&&e.onTrustDailyRate?r`
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
              <div style="font-size:11px;color:var(--text-secondary);">Rate today</div>
              <div style="display:flex;gap:2px;">
                ${[1,2,3,4,5,6,7,8,9,10].map(i=>r`<button
                    class="rating-btn"
                    style="width:24px;height:24px;font-size:11px;border:1px solid var(--border);border-radius:4px;background:var(--surface-2);color:var(--text-secondary);cursor:pointer;"
                    @click=${()=>e.onTrustDailyRate(i)}
                    title="${i}/10"
                  >${i}</button>`)}
              </div>
            </div>`:t.todayRated?r`<div style="font-size:12px;color:var(--ok, #22c55e);">Rated today &#x2713;</div>`:h}
      </div>
    </div>
  `}function _S(e){const t=ie();e.selectedDate;const n=e.viewMode??"brief";if(e.loading)return r`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading your day...</span>
        </div>
      </div>
    `;if(e.error)return r`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">&#x26A0;</span>
          <span>${e.error}</span>
          ${e.onRefresh?r`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:null}
        </div>
      </div>
    `;const s={connected:e.connected,data:e.dailyBrief??null,loading:e.dailyBriefLoading,error:e.dailyBriefError,onRefresh:e.onBriefRefresh,onGenerate:e.onBriefGenerate,onOpenInObsidian:e.onBriefOpenInObsidian,onSaveBrief:e.onBriefSave,onToggleCheckbox:e.onBriefToggleCheckbox,onOpenFile:e.onOpenFile};return r`
    <div class="my-day-container">
      ${Xb(e)}
      ${n==="brief"?r`<div class="my-day-brief-full">
            ${Cb(s)}
          </div>`:n==="tasks"?r`<div class="my-day-brief-full">${Yb(e)}</div>`:Jb(e)}
    </div>
  `}function Zb(e){const t=aw(e),n=uw(e);return r`
    ${hw(n)}
    ${pw(t)}
    ${ew(e)}
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Nodes</div>
          <div class="card-sub">Paired devices and live links.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>
      <div class="list" style="margin-top: 16px;">
        ${e.nodes.length===0?r`
                <div class="muted">No nodes found.</div>
              `:e.nodes.map(s=>$w(s))}
      </div>
    </section>
  `}function ew(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return r`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Devices</div>
          <div class="card-sub">Pairing requests + role tokens.</div>
        </div>
        <button class="btn" ?disabled=${e.devicesLoading} @click=${e.onDevicesRefresh}>
          ${e.devicesLoading?"Loading…":"Refresh"}
        </button>
      </div>
      ${e.devicesError?r`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:h}
      <div class="list" style="margin-top: 16px;">
        ${n.length>0?r`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${n.map(i=>tw(i,e))}
            `:h}
        ${s.length>0?r`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(i=>nw(i,e))}
            `:h}
        ${n.length===0&&s.length===0?r`
                <div class="muted">No paired devices.</div>
              `:h}
      </div>
    </section>
  `}function tw(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?B(e.ts):"n/a",i=e.role?.trim()?`role: ${e.role}`:"role: -",a=e.isRepair?" · repair":"",o=e.remoteIp?` · ${e.remoteIp}`:"";return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${o}</div>
        <div class="muted" style="margin-top: 6px;">
          ${i} · requested ${s}${a}
        </div>
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn--sm primary" @click=${()=>t.onDeviceApprove(e.requestId)}>
            Approve
          </button>
          <button class="btn btn--sm" @click=${()=>t.onDeviceReject(e.requestId)}>
            Reject
          </button>
        </div>
      </div>
    </div>
  `}function nw(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",i=`roles: ${mi(e.roles)}`,a=`scopes: ${mi(e.scopes)}`,o=Array.isArray(e.tokens)?e.tokens:[];return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${s}</div>
        <div class="muted" style="margin-top: 6px;">${i} · ${a}</div>
        ${o.length===0?r`
                <div class="muted" style="margin-top: 6px">Tokens: none</div>
              `:r`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${o.map(c=>sw(e.deviceId,c,t))}
              </div>
            `}
      </div>
    </div>
  `}function sw(e,t,n){const s=t.revokedAtMs?"revoked":"active",i=`scopes: ${mi(t.scopes)}`,a=B(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return r`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${i} · ${a}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          Rotate
        </button>
        ${t.revokedAtMs?h:r`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e,t.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}const tt="__defaults__",vr=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],iw=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function aw(e){const t=e.configForm,n=ww(e.nodes),{defaultBinding:s,agents:i}=kw(t),a=!!t,o=e.configSaving||e.configFormMode==="raw";return{ready:a,disabled:o,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function yr(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function ow(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function rw(e){const t=e?.defaults??{};return{security:yr(t.security),ask:ow(t.ask),askFallback:yr(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function lw(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(i=>{if(!i||typeof i!="object")return;const a=i,o=typeof a.id=="string"?a.id.trim():"";if(!o)return;const c=typeof a.name=="string"?a.name.trim():void 0,d=a.default===!0;s.push({id:o,name:c||void 0,isDefault:d})}),s}function cw(e,t){const n=lw(e),s=Object.keys(t?.agents??{}),i=new Map;n.forEach(o=>i.set(o.id,o)),s.forEach(o=>{i.has(o)||i.set(o,{id:o})});const a=Array.from(i.values());return a.length===0&&a.push({id:"main",isDefault:!0}),a.sort((o,c)=>{if(o.isDefault&&!c.isDefault)return-1;if(!o.isDefault&&c.isDefault)return 1;const d=o.name?.trim()?o.name:o.id,u=c.name?.trim()?c.name:c.id;return d.localeCompare(u)}),a}function dw(e,t){return e===tt?tt:e&&t.some(n=>n.id===e)?e:tt}function uw(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=rw(t),i=cw(e.configForm,t),a=Sw(e.nodes),o=e.execApprovalsTarget;let c=o==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o==="node"&&c&&!a.some(p=>p.id===c)&&(c=null);const d=dw(e.execApprovalsSelectedAgent,i),u=d!==tt?(t?.agents??{})[d]??null:null,l=Array.isArray(u?.allowlist)?u.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:d,selectedAgent:u,agents:i,allowlist:l,target:o,targetNodeId:c,targetNodes:a,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function pw(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return r`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">Exec node binding</div>
          <div class="card-sub">
            Pin agents to a specific node when using <span class="mono">exec host=node</span>.
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.configDirty}
          @click=${e.onSave}
        >
          ${e.configSaving?"Saving…":"Save"}
        </button>
      </div>

      ${e.formMode==="raw"?r`
              <div class="callout warn" style="margin-top: 12px">
                Switch the Config tab to <strong>Form</strong> mode to edit bindings here.
              </div>
            `:h}

      ${e.ready?r`
            <div class="list" style="margin-top: 16px;">
              <div class="list-item">
                <div class="list-main">
                  <div class="list-title">Default binding</div>
                  <div class="list-sub">Used when agents do not override a node binding.</div>
                </div>
                <div class="list-meta">
                  <label class="field">
                    <span>Node</span>
                    <select
                      ?disabled=${e.disabled||!t}
                      @change=${s=>{const a=s.target.value.trim();e.onBindDefault(a||null)}}
                    >
                      <option value="" ?selected=${n===""}>Any node</option>
                      ${e.nodes.map(s=>r`<option
                            value=${s.id}
                            ?selected=${n===s.id}
                          >
                            ${s.label}
                          </option>`)}
                    </select>
                  </label>
                  ${t?h:r`
                          <div class="muted">No nodes with system.run available.</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?r`
                      <div class="muted">No agents found.</div>
                    `:e.agents.map(s=>bw(s,e))}
            </div>
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function hw(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return r`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">Exec approvals</div>
          <div class="card-sub">
            Allowlist and approval policy for <span class="mono">exec host=gateway/node</span>.
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.dirty||!n}
          @click=${e.onSave}
        >
          ${e.saving?"Saving…":"Save"}
        </button>
      </div>

      ${fw(e)}

      ${t?r`
            ${gw(e)}
            ${mw(e)}
            ${e.selectedScope===tt?h:vw(e)}
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function fw(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return r`
    <div class="list" style="margin-top: 12px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Target</div>
          <div class="list-sub">
            Gateway edits local approvals; node edits the selected node.
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Host</span>
            <select
              ?disabled=${e.disabled}
              @change=${s=>{if(s.target.value==="node"){const o=e.targetNodes[0]?.id??null;e.onSelectTarget("node",n||o)}else e.onSelectTarget("gateway",null)}}
            >
              <option value="gateway" ?selected=${e.target==="gateway"}>Gateway</option>
              <option value="node" ?selected=${e.target==="node"}>Node</option>
            </select>
          </label>
          ${e.target==="node"?r`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${e.disabled||!t}
                    @change=${s=>{const a=s.target.value.trim();e.onSelectTarget("node",a||null)}}
                  >
                    <option value="" ?selected=${n===""}>Select node</option>
                    ${e.targetNodes.map(s=>r`<option
                          value=${s.id}
                          ?selected=${n===s.id}
                        >
                          ${s.label}
                        </option>`)}
                  </select>
                </label>
              `:h}
        </div>
      </div>
      ${e.target==="node"&&!t?r`
              <div class="muted">No nodes advertise exec approvals yet.</div>
            `:h}
    </div>
  `}function gw(e){return r`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===tt?"active":""}"
          @click=${()=>e.onSelectScope(tt)}
        >
          Defaults
        </button>
        ${e.agents.map(t=>{const n=t.name?.trim()?`${t.name} (${t.id})`:t.id;return r`
            <button
              class="btn btn--sm ${e.selectedScope===t.id?"active":""}"
              @click=${()=>e.onSelectScope(t.id)}
            >
              ${n}
            </button>
          `})}
      </div>
    </div>
  `}function mw(e){const t=e.selectedScope===tt,n=e.defaults,s=e.selectedAgent??{},i=t?["defaults"]:["agents",e.selectedScope],a=typeof s.security=="string"?s.security:void 0,o=typeof s.ask=="string"?s.ask:void 0,c=typeof s.askFallback=="string"?s.askFallback:void 0,d=t?n.security:a??"__default__",u=t?n.ask:o??"__default__",l=t?n.askFallback:c??"__default__",p=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,v=p??n.autoAllowSkills,y=p==null;return r`
    <div class="list" style="margin-top: 16px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Security</div>
          <div class="list-sub">
            ${t?"Default security mode.":`Default: ${n.security}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const S=b.target.value;!t&&S==="__default__"?e.onRemove([...i,"security"]):e.onPatch([...i,"security"],S)}}
            >
              ${t?h:r`<option value="__default__" ?selected=${d==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${vr.map(b=>r`<option
                    value=${b.value}
                    ?selected=${d===b.value}
                  >
                    ${b.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask</div>
          <div class="list-sub">
            ${t?"Default prompt policy.":`Default: ${n.ask}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const S=b.target.value;!t&&S==="__default__"?e.onRemove([...i,"ask"]):e.onPatch([...i,"ask"],S)}}
            >
              ${t?h:r`<option value="__default__" ?selected=${u==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${iw.map(b=>r`<option
                    value=${b.value}
                    ?selected=${u===b.value}
                  >
                    ${b.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask fallback</div>
          <div class="list-sub">
            ${t?"Applied when the UI prompt is unavailable.":`Default: ${n.askFallback}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Fallback</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const S=b.target.value;!t&&S==="__default__"?e.onRemove([...i,"askFallback"]):e.onPatch([...i,"askFallback"],S)}}
            >
              ${t?h:r`<option value="__default__" ?selected=${l==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${vr.map(b=>r`<option
                    value=${b.value}
                    ?selected=${l===b.value}
                  >
                    ${b.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${t?"Allow skill executables listed by the Gateway.":y?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${v?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${v}
              @change=${b=>{const k=b.target;e.onPatch([...i,"autoAllowSkills"],k.checked)}}
            />
          </label>
          ${!t&&!y?r`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,"autoAllowSkills"])}
              >
                Use default
              </button>`:h}
        </div>
      </div>
    </div>
  `}function vw(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return r`
    <div class="row" style="margin-top: 18px; justify-content: space-between;">
      <div>
        <div class="card-title">Allowlist</div>
        <div class="card-sub">Case-insensitive glob patterns.</div>
      </div>
      <button
        class="btn btn--sm"
        ?disabled=${e.disabled}
        @click=${()=>{const s=[...n,{pattern:""}];e.onPatch(t,s)}}
      >
        Add pattern
      </button>
    </div>
    <div class="list" style="margin-top: 12px;">
      ${n.length===0?r`
              <div class="muted">No allowlist entries yet.</div>
            `:n.map((s,i)=>yw(e,s,i))}
    </div>
  `}function yw(e,t,n){const s=t.lastUsedAt?B(t.lastUsedAt):"never",i=t.lastUsedCommand?wn(t.lastUsedCommand,120):null,a=t.lastResolvedPath?wn(t.lastResolvedPath,120):null;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${i?r`<div class="list-sub mono">${i}</div>`:h}
        ${a?r`<div class="list-sub mono">${a}</div>`:h}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${t.pattern??""}
            ?disabled=${e.disabled}
            @input=${o=>{const c=o.target;e.onPatch(["agents",e.selectedScope,"allowlist",n,"pattern"],c.value)}}
          />
        </label>
        <button
          class="btn btn--sm danger"
          ?disabled=${e.disabled}
          @click=${()=>{if(e.allowlist.length<=1){e.onRemove(["agents",e.selectedScope,"allowlist"]);return}e.onRemove(["agents",e.selectedScope,"allowlist",n])}}
        >
          Remove
        </button>
      </div>
    </div>
  `}function bw(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,i=t.nodes.length>0;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="list-sub">
          ${e.isDefault?"default agent":"agent"} ·
          ${n==="__default__"?`uses default (${t.defaultBinding??"any"})`:`override: ${e.binding}`}
        </div>
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Binding</span>
          <select
            ?disabled=${t.disabled||!i}
            @change=${a=>{const c=a.target.value.trim();t.onBindAgent(e.index,c==="__default__"?null:c)}}
          >
            <option value="__default__" ?selected=${n==="__default__"}>
              Use default
            </option>
            ${t.nodes.map(a=>r`<option
                  value=${a.id}
                  ?selected=${n===a.id}
                >
                  ${a.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function ww(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(c=>String(c)==="system.run"))continue;const a=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!a)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():a;t.push({id:a,label:o===a?a:`${o} · ${a}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function Sw(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(c=>String(c)==="system.execApprovals.get"||String(c)==="system.execApprovals.set"))continue;const a=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!a)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():a;t.push({id:a,label:o===a?a:`${o} · ${a}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function kw(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},i=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,a=e.agents??{},o=Array.isArray(a.list)?a.list:[];if(o.length===0)return{defaultBinding:i,agents:[t]};const c=[];return o.forEach((d,u)=>{if(!d||typeof d!="object")return;const l=d,p=typeof l.id=="string"?l.id.trim():"";if(!p)return;const v=typeof l.name=="string"?l.name.trim():void 0,y=l.default===!0,k=(l.tools??{}).exec??{},S=typeof k.node=="string"&&k.node.trim()?k.node.trim():null;c.push({id:p,name:v||void 0,index:u,isDefault:y,binding:S})}),c.length===0&&c.push(t),{defaultBinding:i,agents:c}}function $w(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),i=Array.isArray(e.caps)?e.caps:[],a=Array.isArray(e.commands)?e.commands:[];return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="list-sub">
          ${typeof e.nodeId=="string"?e.nodeId:""}
          ${typeof e.remoteIp=="string"?` · ${e.remoteIp}`:""}
          ${typeof e.version=="string"?` · ${e.version}`:""}
        </div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${n?"paired":"unpaired"}</span>
          <span class="chip ${t?"chip-ok":"chip-warn"}">
            ${t?"connected":"offline"}
          </span>
          ${i.slice(0,12).map(o=>r`<span class="chip">${String(o)}</span>`)}
          ${a.slice(0,8).map(o=>r`<span class="chip">${String(o)}</span>`)}
        </div>
      </div>
    </div>
  `}const Aw=["","off","minimal","low","medium","high"],Tw=["","off","on"],xw=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],_w=["","off","on","stream"];function Cw(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function ed(e){return Cw(e)==="zai"}function Ew(e){return ed(e)?Tw:Aw}function Lw(e,t){return!t||!e||e==="off"?e:"on"}function Pw(e,t){return e?t&&e==="on"?"low":e:null}function Rw(e){switch(e){case"idle-7d":return"Idle > 7 days";case"task-complete":return"Task completed";case"manual":return"Manual";default:return e}}function Iw(){return r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
    <path d="M10 12h4"/>
  </svg>`}function Mw(){return r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 14 4 9 9 4"/>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
  </svg>`}function Dw(e){return r`<svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="transition: transform 150ms ease; transform: rotate(${e?"90deg":"0deg"});"
  >
    <polyline points="9 18 15 12 9 6"/>
  </svg>`}function Ow(e){const t=e.result?.sessions??[],n=new Set(e.archivedSessions.map(a=>a.sessionKey)),s=t.filter(a=>!n.has(a.key)),i=e.archivedSessions.length;return r`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Sessions</div>
          <div class="card-sub">Active session keys and per-session overrides.</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button
            class="btn"
            ?disabled=${e.loading}
            @click=${e.onAutoArchive}
            title="Run auto-archive: archive idle sessions and completed-task sessions"
          >
            Auto-archive
          </button>
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Loading...":"Refresh"}
          </button>
        </div>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field">
          <span>Active within (minutes)</span>
          <input
            .value=${e.activeMinutes}
            @input=${a=>e.onFiltersChange({activeMinutes:a.target.value,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field">
          <span>Limit</span>
          <input
            .value=${e.limit}
            @input=${a=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:a.target.value,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include global</span>
          <input
            type="checkbox"
            .checked=${e.includeGlobal}
            @change=${a=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:a.target.checked,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include unknown</span>
          <input
            type="checkbox"
            .checked=${e.includeUnknown}
            @change=${a=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:a.target.checked})}
          />
        </label>
      </div>

      ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:h}

      <div class="muted" style="margin-top: 12px;">
        ${e.result?`Store: ${e.result.path}`:""}
      </div>

      <div class="table" style="margin-top: 16px;">
        <div class="table-head">
          <div>Key</div>
          <div>Label</div>
          <div>Kind</div>
          <div>Updated</div>
          <div>Tokens</div>
          <div>Thinking</div>
          <div>Verbose</div>
          <div>Reasoning</div>
          <div>Actions</div>
        </div>
        ${s.length===0?r`
                <div class="muted">No active sessions found.</div>
              `:s.map(a=>Fw(a,e.basePath,e.onPatch,e.onDelete,e.onArchive,e.loading))}
      </div>
    </section>

    ${Nw(e,i)}
  `}function Nw(e,t){return t===0&&!e.archivedSessionsLoading?h:r`
    <section class="card archived-section">
      <div
        class="archived-section__header"
        @click=${e.onToggleArchived}
      >
        <div class="row" style="gap: 8px; align-items: center;">
          ${Dw(e.archivedSessionsExpanded)}
          <span class="archived-section__title">Archived</span>
          ${t>0?r`<span class="archived-badge">${t}</span>`:h}
        </div>
        <span class="archived-section__hint">
          Sessions removed from the active list
        </span>
      </div>

      ${e.archivedSessionsExpanded?r`
              <div class="archived-table" style="margin-top: 12px;">
                <div class="archived-table__head">
                  <div>Session Key</div>
                  <div>Archived</div>
                  <div>Reason</div>
                  <div>Linked Task</div>
                  <div>Actions</div>
                </div>
                ${e.archivedSessionsLoading?r`<div class="muted" style="padding: 12px;">Loading...</div>`:e.archivedSessions.length===0?r`<div class="muted" style="padding: 12px;">No archived sessions.</div>`:e.archivedSessions.map(n=>Bw(n,e.onUnarchive,e.loading))}
              </div>
            `:h}
    </section>
  `}function Fw(e,t,n,s,i,a){const o=e.updatedAt?B(e.updatedAt):"n/a",c=e.thinkingLevel??"",d=ed(e.modelProvider),u=Lw(c,d),l=Ew(e.modelProvider),p=e.verboseLevel??"",v=e.reasoningLevel??"",y=e.displayName??e.key,b=e.kind!=="global",k=b?`${zi("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return r`
    <div class="table-row">
      <div class="mono">${b?r`<a href=${k} class="session-link">${y}</a>`:y}</div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${a}
          placeholder="(optional)"
          @change=${S=>{const $=S.target.value.trim();n(e.key,{label:$||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${o}</div>
      <div>${Xy(e)}</div>
      <div>
        <select
          .value=${u}
          ?disabled=${a}
          @change=${S=>{const $=S.target.value;n(e.key,{thinkingLevel:Pw($,d)})}}
        >
          ${l.map(S=>r`<option value=${S}>${S||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${p}
          ?disabled=${a}
          @change=${S=>{const $=S.target.value;n(e.key,{verboseLevel:$||null})}}
        >
          ${xw.map(S=>r`<option value=${S.value}>${S.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${v}
          ?disabled=${a}
          @change=${S=>{const $=S.target.value;n(e.key,{reasoningLevel:$||null})}}
        >
          ${_w.map(S=>r`<option value=${S}>${S||"inherit"}</option>`)}
        </select>
      </div>
      <div class="row" style="gap: 4px;">
        <button
          class="btn btn-icon"
          ?disabled=${a}
          @click=${()=>i(e.key)}
          title="Archive this session"
        >
          ${Iw()}
        </button>
        <button class="btn danger btn--sm" ?disabled=${a} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function Bw(e,t,n){const s=B(Date.parse(e.archivedAt));return r`
    <div class="archived-table__row">
      <div class="mono" style="opacity: 0.7;">${e.sessionKey}</div>
      <div>${s}</div>
      <div>${Rw(e.reason)}</div>
      <div class="mono" style="font-size: 11px; opacity: 0.6;">
        ${e.linkedTaskId?e.linkedTaskId.slice(0,8):"--"}
      </div>
      <div>
        <button
          class="btn btn-icon"
          ?disabled=${n}
          @click=${()=>t(e.sessionKey)}
          title="Restore this session"
        >
          ${Mw()}
        </button>
      </div>
    </div>
  `}function Uw(e){const t=e.subTab==="godmode",n=t||e.subTab==="my-skills";return r`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div class="chip-row" style="gap: 0;">
          <button
            class="chip ${t?"chip-ok":""}"
            style="cursor: pointer; border: none; padding: 6px 14px; font-size: 13px;
                   background: var(${t?"--chip-ok-bg, #e6f4ea":"--chip-bg, #f3f3f3"});"
            @click=${()=>e.onSubTabChange("godmode")}
          >
            GodMode Skills
          </button>
          <button
            class="chip ${e.subTab==="my-skills"?"chip-ok":""}"
            style="cursor: pointer; border: none; padding: 6px 14px; font-size: 13px;
                   background: var(${e.subTab==="my-skills"?"--chip-ok-bg, #e6f4ea":"--chip-bg, #f3f3f3"});"
            @click=${()=>e.onSubTabChange("my-skills")}
          >
            Integrations
          </button>
          <button
            class="chip ${e.subTab==="clawhub"?"chip-ok":""}"
            style="cursor: pointer; border: none; padding: 6px 14px; font-size: 13px;
                   background: var(${e.subTab==="clawhub"?"--chip-ok-bg, #e6f4ea":"--chip-bg, #f3f3f3"});"
            @click=${()=>e.onSubTabChange("clawhub")}
          >
            ClawHub
          </button>
        </div>
        ${n?r`<button class="btn" ?disabled=${e.loading||e.godmodeSkillsLoading} @click=${e.onRefresh}>
              ${e.loading||e.godmodeSkillsLoading?"Loading…":"Refresh"}
            </button>`:h}
      </div>

      ${t?Kw(e):h}
      ${e.subTab==="my-skills"?qw(e):h}
    </section>
  `}function Kw(e){const t=e.godmodeSkills,n=e.godmodeSkillsLoading,s=e.filter.trim().toLowerCase();if(n&&!t)return r`<div class="muted" style="margin-top: 16px;">Loading GodMode skills...</div>`;if(!t||t.total===0)return r`<div class="muted" style="margin-top: 16px;">No GodMode skills found.</div>`;const i=[...t.skills.map(o=>({...o,_kind:"skill"})),...t.cards.map(o=>({...o,_kind:"card"}))],a=s?i.filter(o=>[o.slug,o.name,o.body.slice(0,200)].join(" ").toLowerCase().includes(s)):i;return r`
    <div class="filters" style="margin-top: 14px;">
      <label class="field" style="flex: 1;">
        <span>Filter</span>
        <input
          .value=${e.filter}
          @input=${o=>e.onFilterChange(o.target.value)}
          placeholder="Search skills and cards"
        />
      </label>
      <div class="muted">${a.length} of ${i.length}</div>
    </div>

    ${a.length===0?r`<div class="muted" style="margin-top: 16px;">No matches.</div>`:r`<div class="list" style="margin-top: 16px;">
          ${a.map(o=>o._kind==="skill"?zw(o,e.expandedSkills.has(o.slug),e.onToggleExpand):Ww(o,e.expandedSkills.has(o.slug),e.onToggleExpand))}
        </div>`}
  `}function zw(e,t,n){const s=e.body.split(`
`).find(a=>a.trim().length>0)??"",i=!!e.schedule;return r`
    <div
      class="list-item"
      style="cursor: pointer;"
      @click=${()=>n(e.slug)}
    >
      <div class="list-main">
        <div class="row" style="align-items: center; gap: 8px;">
          <span style="font-size: 10px; color: var(--muted-color, #888); transition: transform 0.15s;
                       display: inline-block; transform: rotate(${t?"90deg":"0deg"});">
            \u25B6
          </span>
          <div class="list-title" style="flex: 1;">${e.name}</div>
          ${i?r`<span class="chip chip-ok" style="font-size: 11px;">scheduled</span>`:r`<span class="chip" style="font-size: 11px;">on-demand</span>`}
        </div>
        <div class="list-sub" style="margin-left: 18px;">${wn(s,120)}</div>
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          <span class="chip chip-ok">skill</span>
          <span class="chip">${e.trigger}</span>
          ${e.schedule?r`<span class="chip">${e.schedule}</span>`:h}
          ${e.persona?r`<span class="chip">${e.persona}</span>`:h}
          <span class="chip">${e.taskType}</span>
        </div>
        ${t?r`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px;">
                  <span class="muted">Trigger:</span>
                  <span>${e.trigger}</span>
                  <span class="muted">Task type:</span>
                  <span>${e.taskType}</span>
                  <span class="muted">Priority:</span>
                  <span>${e.priority}</span>
                  ${e.persona?r`
                        <span class="muted">Persona:</span>
                        <span>${e.persona}</span>
                      `:h}
                  ${e.schedule?r`
                        <span class="muted">Schedule:</span>
                        <span>${e.schedule}</span>
                      `:h}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${e.body}
                </div>
              </div>
            `:h}
      </div>
    </div>
  `}function Ww(e,t,n){return r`
    <div
      class="list-item"
      style="cursor: pointer;"
      @click=${()=>n(e.slug)}
    >
      <div class="list-main">
        <div class="row" style="align-items: center; gap: 8px;">
          <span style="font-size: 10px; color: var(--muted-color, #888); transition: transform 0.15s;
                       display: inline-block; transform: rotate(${t?"90deg":"0deg"});">
            \u25B6
          </span>
          <div class="list-title" style="flex: 1;">${e.name}</div>
          <span class="chip" style="font-size: 11px;">passive</span>
        </div>
        <div class="list-sub" style="margin-left: 18px;">
          Triggers: ${e.triggers.join(", ")}
        </div>
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          <span class="chip">card</span>
          ${e.tools.length>0?r`<span class="chip">${e.tools.length} tools</span>`:h}
        </div>
        ${t?r`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px;">
                  <span class="muted">Keywords:</span>
                  <span>${e.triggers.join(", ")}</span>
                  ${e.tools.length>0?r`
                        <span class="muted">Tools:</span>
                        <span>${e.tools.join(", ")}</span>
                      `:h}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${e.body}
                </div>
              </div>
            `:h}
      </div>
    </div>
  `}function qw(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(i=>[i.name,i.description,i.source].join(" ").toLowerCase().includes(n)):t;return r`
    <div class="filters" style="margin-top: 14px;">
      <label class="field" style="flex: 1;">
        <span>Filter</span>
        <input
          .value=${e.filter}
          @input=${i=>e.onFilterChange(i.target.value)}
          placeholder="Search integrations"
        />
      </label>
      <div class="muted">${s.length} shown</div>
    </div>

    ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:h}

    ${s.length===0?r`<div class="muted" style="margin-top: 16px">No integrations found.</div>`:r`<div class="list" style="margin-top: 16px;">
            ${s.map(i=>jw(i,e))}
          </div>`}
  `}function jw(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",i=t.messages[e.skillKey]??null,a=e.install.length>0&&e.missing.bins.length>0,o=[...e.missing.bins.map(d=>`bin:${d}`),...e.missing.env.map(d=>`env:${d}`),...e.missing.config.map(d=>`config:${d}`),...e.missing.os.map(d=>`os:${d}`)],c=[];return e.disabled&&c.push("disabled"),e.blockedByAllowlist&&c.push("blocked by allowlist"),r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${wn(e.description,140)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.source}</span>
          <span class="chip ${e.eligible?"chip-ok":"chip-warn"}">
            ${e.eligible?"eligible":"blocked"}
          </span>
          ${e.disabled?r`
                  <span class="chip chip-warn">disabled</span>
                `:h}
        </div>
        ${o.length>0?r`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${o.join(", ")}
              </div>
            `:h}
        ${c.length>0?r`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${c.join(", ")}
              </div>
            `:h}
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; flex-wrap: wrap;">
          <button
            class="btn"
            ?disabled=${n}
            @click=${()=>t.onToggle(e.skillKey,e.disabled)}
          >
            ${e.disabled?"Enable":"Disable"}
          </button>
          ${a?r`<button
                class="btn"
                ?disabled=${n}
                @click=${()=>t.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${n?"Installing…":e.install[0].label}
              </button>`:h}
        </div>
        ${i?r`<div
              class="muted"
              style="margin-top: 8px; color: ${i.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${i.message}
            </div>`:h}
        ${e.primaryEnv?r`
              <div class="field" style="margin-top: 10px;">
                <span>API key</span>
                <input
                  type="password"
                  .value=${s}
                  @input=${d=>t.onEdit(e.skillKey,d.target.value)}
                />
              </div>
              <button
                class="btn primary"
                style="margin-top: 8px;"
                ?disabled=${n}
                @click=${()=>t.onSaveKey(e.skillKey)}
              >
                Save key
              </button>
            `:h}
      </div>
    </div>
  `}function Hw(e){switch(e){case"claude":return"chip-ok";case"codex":return"chip-warn";case"gemini":return"chip-info";default:return""}}function Vw(e){const t=e.filter.trim().toLowerCase(),n=t?e.roster.filter(a=>[a.slug,a.name,a.category,a.mission??"",...a.taskTypes].join(" ").toLowerCase().includes(t)):e.roster,s=new Map;for(const a of n){const o=a.category||"_default";s.has(o)||s.set(o,[]),s.get(o).push(a)}const i=[...s.keys()].sort((a,o)=>a==="_default"?1:o==="_default"?-1:a.localeCompare(o));return r`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div class="muted">${n.length} agent${n.length!==1?"s":""}</div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${e.filter}
            @input=${a=>e.onFilterChange(a.target.value)}
            placeholder="Search agents by name, category, or task type"
          />
        </label>
      </div>

      ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:h}

      ${e.loading&&e.roster.length===0?r`<div class="muted" style="margin-top: 16px;">Loading agent roster...</div>`:h}

      ${!e.loading&&n.length===0?r`<div class="muted" style="margin-top: 16px;">
            ${e.roster.length===0?"No agents found. Add persona files to your agent-roster directory.":"No matches."}
          </div>`:h}

      ${i.map(a=>{const o=s.get(a),c=a==="_default"?"General":td(a);return r`
          <div style="margin-top: 20px;">
            <div
              style="font-size: 12px; font-weight: 600; text-transform: uppercase;
                     letter-spacing: 0.05em; color: var(--muted-color, #888);
                     margin-bottom: 8px; padding-left: 2px;"
            >
              ${c}
            </div>
            <div class="list">
              ${o.map(d=>Gw(d,e.expandedAgents.has(d.slug),e.onToggleExpand))}
            </div>
          </div>
        `})}
    </section>
  `}function td(e){return e.replace(/[-_]/g," ").replace(/\b\w/g,t=>t.toUpperCase())}function Gw(e,t,n){return r`
    <div
      class="list-item"
      style="cursor: pointer;"
      @click=${()=>n(e.slug)}
    >
      <div class="list-main">
        <div class="row" style="align-items: center; gap: 8px;">
          <span style="font-size: 10px; color: var(--muted-color, #888); transition: transform 0.15s;
                       display: inline-block; transform: rotate(${t?"90deg":"0deg"});">
            \u25B6
          </span>
          <div class="list-title" style="flex: 1;">${e.name}</div>
          ${e.engine?r`<span class="chip ${Hw(e.engine)}" style="font-size: 11px;">${e.engine}</span>`:h}
        </div>
        ${e.mission?r`<div class="list-sub" style="margin-left: 18px;">${wn(e.mission,120)}</div>`:h}
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          ${e.taskTypes.map(s=>r`<span class="chip">${s}</span>`)}
        </div>
        ${t?r`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px; margin-bottom: 10px;">
                  <span class="muted">Slug:</span>
                  <span style="font-family: monospace;">${e.slug}</span>
                  <span class="muted">Category:</span>
                  <span>${td(e.category||"_default")}</span>
                  ${e.engine?r`
                        <span class="muted">Engine:</span>
                        <span>${e.engine}</span>
                      `:h}
                  <span class="muted">Task types:</span>
                  <span>${e.taskTypes.join(", ")||"auto"}</span>
                </div>
                ${e.body?r`
                      <div
                        style="font-size: 13px; line-height: 1.6;
                               white-space: pre-wrap; color: var(--text-color, #333);
                               max-height: 400px; overflow-y: auto;
                               padding-top: 10px; border-top: 1px solid var(--border-color, #eee);"
                      >
                        ${e.body}
                      </div>
                    `:h}
              </div>
            `:h}
      </div>
    </div>
  `}function nd(){return{open:!1,images:[],currentIndex:0}}function Yw(e,t,n){return{open:!0,images:t,currentIndex:n}}function Qw(){return nd()}function Jw(e,t){const n=e.currentIndex+t;return n<0||n>=e.images.length?e:{...e,currentIndex:n}}const Xw=r`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,Zw=r`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,e0=r`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;function t0(e,t){if(!e.open||e.images.length===0)return h;const n=e.images[e.currentIndex];if(!n)return h;const s=e.images.length>1,i=e.currentIndex>0,a=e.currentIndex<e.images.length-1;return r`
    <div
      class="lightbox-overlay"
      @click=${o=>{o.target.classList.contains("lightbox-overlay")&&t.onClose()}}
      @keydown=${o=>{o.key==="Escape"&&t.onClose(),o.key==="ArrowRight"&&a&&t.onNav(1),o.key==="ArrowLeft"&&i&&t.onNav(-1)}}
      tabindex="0"
    >
      <button class="lightbox-close" @click=${t.onClose} aria-label="Close image viewer">
        ${Xw}
      </button>

      ${s&&i?r`<button class="lightbox-nav lightbox-nav--prev" @click=${()=>t.onNav(-1)} aria-label="Previous image">${Zw}</button>`:h}

      <img
        class="lightbox-image"
        src=${n.url}
        alt=${n.alt??"Image preview"}
        @click=${o=>o.stopPropagation()}
        @error=${o=>{o.target.classList.add("lightbox-image--broken")}}
      />

      ${s&&a?r`<button class="lightbox-nav lightbox-nav--next" @click=${()=>t.onNav(1)} aria-label="Next image">${e0}</button>`:h}

      ${s?r`<div class="lightbox-counter">${e.currentIndex+1} / ${e.images.length}</div>`:h}
    </div>
  `}const n0=e=>{switch(e){case"success":return r`
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="8" cy="8" r="7" />
          <path d="M5 8l2 2 4-4" />
        </svg>
      `;case"error":return r`
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="8" cy="8" r="7" />
          <path d="M8 4v4M8 11h.01" />
        </svg>
      `;case"warning":return r`
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M8 1l7 13H1L8 1z" />
          <path d="M8 6v3M8 12h.01" />
        </svg>
      `;default:return r`
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="8" cy="8" r="7" />
          <path d="M8 11V8M8 5h.01" />
        </svg>
      `}};function s0({toasts:e,onDismiss:t}){return e.length===0?null:r`
    <div class="toast-container">
      ${us(e,n=>n.id,n=>r`
          <div class="toast toast--${n.type}">
            <div class="toast__icon">${n0(n.type)}</div>
            <div class="toast__body">
              <div class="toast__message">${n.message}</div>
              ${n.action?r`${n.action.url?r`<a
                        class="toast__action"
                        href=${n.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >${n.action.label} &rarr;</a>`:r`<button
                        class="toast__action"
                        @click=${()=>{n.action.onClick?.(),t(n.id)}}
                      >${n.action.label}</button>`}`:nothing}
            </div>
            <button
              class="toast__close"
              @click=${()=>t(n.id)}
              aria-label="Dismiss notification"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 1l12 12M13 1L1 13"/>
              </svg>
            </button>
          </div>
        `)}
    </div>
  `}const br=[{key:"focusPulse.enabled",icon:"☀️",name:"Focus Pulse",description:"Morning priority ritual + persistent focus widget in the topbar. Silent 30-min pulse checks compare your activity against your plan.",default:!0}];function i0(e,t){return r`
    <button
      class="options-toggle ${e?"options-toggle--on":""}"
      role="switch"
      aria-checked="${e}"
      @click=${t}
    >
      <span class="options-toggle-track">
        <span class="options-toggle-thumb"></span>
      </span>
    </button>
  `}function a0(e,t,n){const i=!!(t?.[e.key]??e.default);return r`
    <div class="options-card card">
      <div class="options-card-header">
        <div class="options-card-info">
          <span class="options-card-icon">${e.icon}</span>
          <span class="options-card-name">${e.name}</span>
        </div>
        ${i0(i,()=>n(e.key,!i))}
      </div>
      <div class="options-card-description">${e.description}</div>
    </div>
  `}function o0(e){const{connected:t,loading:n,options:s,onToggle:i,onOpenWizard:a}=e;return t?n&&!s?r`
      <section class="tab-body options-section">
        <div class="options-loading">Loading options...</div>
      </section>
    `:r`
    <section class="tab-body options-section">
      <div class="options-grid">
        ${br.map(o=>a0(o,s,i))}
      </div>
      ${br.length===0?r`<div class="options-empty">
            No configurable features yet.
          </div>`:h}
      ${a?r`
            <div class="options-wizard-section">
              <div class="options-card card">
                <div class="options-card-header">
                  <div class="options-card-info">
                    <span class="options-card-icon">Setup</span>
                    <span class="options-card-name">Memory Setup Wizard</span>
                  </div>
                  <button
                    class="options-wizard-btn"
                    @click=${a}
                  >Run Wizard</button>
                </div>
                <div class="options-card-description">
                  Set up your GodMode workspace from scratch. Generates AGENTS.md, memory files,
                  and patches your OC config with optimal settings. Takes about 5 minutes.
                </div>
              </div>
            </div>
          `:h}
    </section>
  `:r`
      <section class="tab-body options-section">
        <div class="options-empty">Not connected to gateway.</div>
      </section>
    `}const wr=["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Anchorage","Pacific/Honolulu","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Shanghai","Asia/Kolkata","Australia/Sydney","Pacific/Auckland"],r0=["Direct and concise -- no fluff, just answers","Detailed explanations -- walk me through the reasoning","Casual and conversational -- like talking to a friend","Structured with bullet points -- organized and scannable","Technical and precise -- specifics matter"],l0=[{value:"sonnet",label:"Sonnet (fast, balanced)"},{value:"opus",label:"Opus (deep reasoning)"},{value:"haiku",label:"Haiku (quick, lightweight)"}],hi=["Never send emails without explicit approval","Never delete or overwrite files without backup","Always search memory before guessing","Never share private information externally"],Sr=[{label:"Name",question:"What should I call you?"},{label:"Timezone",question:"What timezone are you in?"},{label:"Focus",question:"What are you building or focused on?"},{label:"Projects",question:"What are your top projects? (1-3)"},{label:"Style",question:"How do you like to communicate?"},{label:"Rules",question:"What rules must the AI always follow?"},{label:"People",question:"Who are the key people in your work/life?"},{label:"Model",question:"What AI model do you prefer?"}];function kr(e){const n=Math.min(Number(e),8);return r`
    <div class="wizard-progress">
      <div class="wizard-progress-dots">
        ${Array.from({length:8},(s,i)=>r`
          <div class="wizard-progress-dot ${i<n?"completed":""} ${i===n?"active":""}"></div>
        `)}
      </div>
      <div class="wizard-progress-text">
        ${n<8?`Step ${n+1} of 8`:"Review"}
      </div>
    </div>
  `}function c0(e){if(e>=Sr.length)return r`${h}`;const t=Sr[e];return r`
    <div class="wizard-step-header">
      <h2 class="wizard-question">${t.question}</h2>
    </div>
  `}function d0(e,t,n,s){return r`
    <div class="wizard-nav">
      ${e>0?r`
            <button
              class="wizard-btn wizard-btn--back"
              @click=${()=>t.onStepChange(e-1)}
            >Back</button>
          `:r`<div></div>`}
      <button
        class="wizard-btn wizard-btn--next ${n?"":"wizard-btn--disabled"}"
        ?disabled=${!n}
        @click=${()=>{s?(t.onStepChange(8),t.onPreview()):t.onStepChange(e+1)}}
      >${s?"Review":"Continue"}</button>
    </div>
  `}function sd(){return r`<p class="wizard-skip-hint">Press Enter to use the default and continue</p>`}function u0(e,t){function n(i){const a=i.target.value;t.onAnswerChange("name",a)}function s(i){i.key==="Enter"&&(i.preventDefault(),t.onStepChange(1))}return r`
    <div class="wizard-field">
      <input
        type="text"
        class="wizard-input"
        .value=${e.name}
        placeholder="Your name"
        @input=${n}
        @keydown=${s}
        autofocus
      />
    </div>
  `}function p0(e,t){const n=Intl.DateTimeFormat().resolvedOptions().timeZone;return r`
    <div class="wizard-field">
      <div class="wizard-detected">
        Detected: <strong>${n}</strong>
      </div>
      <select
        class="wizard-select"
        .value=${e.timezone||n}
        @change=${s=>{t.onAnswerChange("timezone",s.target.value)}}
      >
        ${wr.includes(n)?h:r`<option value="${n}">${n} (detected)</option>`}
        ${wr.map(s=>r`
            <option value="${s}" ?selected=${(e.timezone||n)===s}>
              ${s}${s===n?" (detected)":""}
            </option>
          `)}
      </select>
      ${sd()}
    </div>
  `}function h0(e,t){function n(i){t.onAnswerChange("focus",i.target.value)}function s(i){i.key==="Enter"&&(i.preventDefault(),t.onStepChange(3))}return r`
    <div class="wizard-field">
      <input
        type="text"
        class="wizard-input"
        .value=${e.focus}
        placeholder="e.g. Building a SaaS product, Running my consulting business"
        @input=${n}
        @keydown=${s}
        autofocus
      />
    </div>
  `}function f0(e,t){function n(){const a=document.querySelector(".wizard-project-input");if(!a)return;const o=a.value.trim();o&&e.projects.length<5&&(t.onAnswerChange("projects",[...e.projects,o]),a.value="",a.focus())}function s(a){const o=e.projects.filter((c,d)=>d!==a);t.onAnswerChange("projects",o)}function i(a){a.key==="Enter"&&(a.preventDefault(),a.target.value.trim()?n():e.projects.length>0&&t.onStepChange(4))}return r`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.projects.map((a,o)=>r`
            <span class="wizard-tag">
              ${a}
              <button class="wizard-tag-remove" @click=${()=>s(o)}>x</button>
            </span>
          `)}
      </div>
      <div class="wizard-input-row">
        <input
          type="text"
          class="wizard-input wizard-project-input"
          placeholder="Project name, then press Enter to add"
          @keydown=${i}
          autofocus
        />
        <button class="wizard-btn wizard-btn--small" @click=${n}>Add</button>
      </div>
      ${e.projects.length===0?r`<p class="wizard-hint">Add 1-3 projects, or skip to continue</p>`:h}
    </div>
  `}function g0(e,t){return r`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${r0.map(n=>r`
            <label class="wizard-radio ${e.commStyle===n?"wizard-radio--selected":""}">
              <input
                type="radio"
                name="commStyle"
                .value=${n}
                ?checked=${e.commStyle===n}
                @change=${()=>{t.onAnswerChange("commStyle",n)}}
              />
              <span class="wizard-radio-label">${n}</span>
            </label>
          `)}
      </div>
      <div class="wizard-or-custom">
        <span class="wizard-or">or type your own:</span>
        <input
          type="text"
          class="wizard-input wizard-input--small"
          placeholder="Custom preference..."
          @input=${n=>{const s=n.target.value;s.trim()&&t.onAnswerChange("commStyle",s)}}
        />
      </div>
    </div>
  `}function m0(e,t){const n=e.hardRules.length>0?e.hardRules:[];function s(o){n.includes(o)?t.onAnswerChange("hardRules",n.filter(c=>c!==o)):t.onAnswerChange("hardRules",[...n,o])}function i(){const o=document.querySelector(".wizard-rule-input");if(!o)return;const c=o.value.trim();c&&(t.onAnswerChange("hardRules",[...n,c]),o.value="",o.focus())}function a(o){o.key==="Enter"&&(o.preventDefault(),o.target.value.trim()&&i())}return r`
    <div class="wizard-field">
      <p class="wizard-hint">Select common rules or add your own:</p>
      <div class="wizard-checkbox-list">
        ${hi.map(o=>r`
            <label class="wizard-checkbox ${n.includes(o)?"wizard-checkbox--selected":""}">
              <input
                type="checkbox"
                ?checked=${n.includes(o)}
                @change=${()=>s(o)}
              />
              <span class="wizard-checkbox-label">${o}</span>
            </label>
          `)}
      </div>
      <div class="wizard-input-row">
        <input
          type="text"
          class="wizard-input wizard-rule-input"
          placeholder="Add a custom rule..."
          @keydown=${a}
        />
        <button class="wizard-btn wizard-btn--small" @click=${i}>Add</button>
      </div>
      ${n.filter(o=>!hi.includes(o)).length>0?r`
            <div class="wizard-tag-list" style="margin-top: 8px;">
              ${n.filter(o=>!hi.includes(o)).map(o=>r`
                    <span class="wizard-tag">
                      ${o}
                      <button class="wizard-tag-remove" @click=${()=>{t.onAnswerChange("hardRules",n.filter(c=>c!==o))}}>x</button>
                    </span>
                  `)}
            </div>
          `:h}
    </div>
  `}function v0(e,t){function n(){const a=document.querySelector(".wizard-person-input");if(!a)return;const o=a.value.trim();o&&e.keyPeople.length<10&&(t.onAnswerChange("keyPeople",[...e.keyPeople,o]),a.value="",a.focus())}function s(a){t.onAnswerChange("keyPeople",e.keyPeople.filter((o,c)=>c!==a))}function i(a){a.key==="Enter"&&(a.preventDefault(),a.target.value.trim()?n():e.keyPeople.length>0&&t.onStepChange(7))}return r`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.keyPeople.map((a,o)=>r`
            <span class="wizard-tag">
              ${a}
              <button class="wizard-tag-remove" @click=${()=>s(o)}>x</button>
            </span>
          `)}
      </div>
      <div class="wizard-input-row">
        <input
          type="text"
          class="wizard-input wizard-person-input"
          placeholder="Person's name, then press Enter"
          @keydown=${i}
          autofocus
        />
        <button class="wizard-btn wizard-btn--small" @click=${n}>Add</button>
      </div>
      <p class="wizard-hint">Co-founders, family, key collaborators. You can add more later.</p>
    </div>
  `}function y0(e,t){return r`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${l0.map(n=>r`
            <label class="wizard-radio ${e.defaultModel===n.value?"wizard-radio--selected":""}">
              <input
                type="radio"
                name="defaultModel"
                .value=${n.value}
                ?checked=${e.defaultModel===n.value}
                @change=${()=>t.onAnswerChange("defaultModel",n.value)}
              />
              <span class="wizard-radio-label">${n.label}</span>
            </label>
          `)}
      </div>
      ${sd()}
    </div>
  `}function fi(e){return e==null?"not set":typeof e=="string"?e:typeof e=="boolean"||typeof e=="number"?String(e):(Array.isArray(e),JSON.stringify(e))}function b0(e,t){const{answers:n,preview:s,diff:i,fileSelections:a,configSelections:o,generating:c}=e,d=s?.some(l=>l.exists)??!1,u=i&&(i.changes.length>0||i.additions.length>0);return r`
    <div class="wizard-review">
      <h2 class="wizard-review-title">Ready to generate your workspace</h2>

      <div class="wizard-review-summary">
        <div class="wizard-review-section">
          <h3>Your Profile</h3>
          <div class="wizard-review-item"><span class="wizard-review-label">Name:</span> ${n.name}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Timezone:</span> ${n.timezone}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Focus:</span> ${n.focus}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Model:</span> ${n.defaultModel}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Style:</span> ${n.commStyle}</div>
        </div>

        ${n.projects.length>0?r`
              <div class="wizard-review-section">
                <h3>Projects</h3>
                ${n.projects.map(l=>r`<div class="wizard-review-item">${l}</div>`)}
              </div>
            `:h}

        ${n.keyPeople.length>0?r`
              <div class="wizard-review-section">
                <h3>Key People</h3>
                ${n.keyPeople.map(l=>r`<div class="wizard-review-item">${l}</div>`)}
              </div>
            `:h}

        ${n.hardRules.length>0?r`
              <div class="wizard-review-section">
                <h3>AI Rules</h3>
                ${n.hardRules.map(l=>r`<div class="wizard-review-item">${l}</div>`)}
              </div>
            `:h}
      </div>

      ${s&&s.length>0?r`
            <div class="wizard-review-section wizard-review-files">
              <h3>Workspace Files</h3>
              ${d?r`<p class="wizard-hint">Some files already exist. Uncheck to keep your existing version.</p>`:h}
              <div class="wizard-file-list">
                ${s.map(l=>{const p=a[l.path]??l.wouldCreate;return r`
                    <label class="wizard-file-item ${l.wouldCreate?"wizard-file--new":"wizard-file--exists"}">
                      <input
                        type="checkbox"
                        ?checked=${p}
                        @change=${v=>t.onFileToggle(l.path,v.target.checked)}
                      />
                      <span class="wizard-file-path">${l.path}</span>
                      <span class="wizard-file-status">${l.exists?p?"overwrite":"keep existing":"new"}</span>
                    </label>
                  `})}
              </div>
            </div>
          `:h}

      ${u?r`
            <div class="wizard-review-section wizard-review-config">
              <h3>Config Changes</h3>

              ${i.additions.length>0?r`
                    <div class="wizard-config-group">
                      <h4>New settings</h4>
                      ${i.additions.map(l=>{const p=o[l.path]??!0;return r`
                          <label class="wizard-config-item">
                            <input
                              type="checkbox"
                              ?checked=${p}
                              @change=${v=>t.onConfigToggle(l.path,v.target.checked)}
                            />
                            <span class="wizard-config-path">${l.path}</span>
                            <span class="wizard-config-value">${fi(l.recommended)}</span>
                          </label>
                        `})}
                    </div>
                  `:h}

              ${i.changes.length>0?r`
                    <div class="wizard-config-group">
                      <h4>Changed settings</h4>
                      <p class="wizard-hint">These differ from your current config. Check to update.</p>
                      ${i.changes.map(l=>{const p=o[l.path]??!1;return r`
                          <label class="wizard-config-item wizard-config-item--change">
                            <input
                              type="checkbox"
                              ?checked=${p}
                              @change=${v=>t.onConfigToggle(l.path,v.target.checked)}
                            />
                            <span class="wizard-config-path">${l.path}</span>
                            <span class="wizard-config-diff">
                              <span class="wizard-config-current">${fi(l.current)}</span>
                              <span class="wizard-config-arrow">&rarr;</span>
                              <span class="wizard-config-recommended">${fi(l.recommended)}</span>
                            </span>
                          </label>
                        `})}
                    </div>
                  `:h}

              ${i.matching.length>0?r`<p class="wizard-hint">${i.matching.length} settings already match GodMode's recommendations.</p>`:h}
            </div>
          `:r`<p class="wizard-hint">OC config will be patched with optimal memory/agent settings.</p>`}

      <div class="wizard-nav">
        <button
          class="wizard-btn wizard-btn--back"
          @click=${()=>t.onStepChange(7)}
          ?disabled=${c}
        >Back</button>
        <button
          class="wizard-btn wizard-btn--generate ${c?"wizard-btn--loading":""}"
          @click=${()=>t.onGenerate()}
          ?disabled=${c}
        >${c?"Generating...":"Generate Workspace"}</button>
      </div>

      ${e.error?r`<div class="wizard-error">${e.error}</div>`:h}
    </div>
  `}function w0(e,t){const n=e.result;return n?r`
    <div class="wizard-success">
      <div class="wizard-success-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--ok, #22c55e)" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="wizard-success-title">Your memory system is ready</h2>
      <div class="wizard-success-stats">
        <div class="wizard-stat">
          <span class="wizard-stat-number">${n.filesCreated}</span>
          <span class="wizard-stat-label">files created</span>
        </div>
        <div class="wizard-stat">
          <span class="wizard-stat-number">${n.filesSkipped}</span>
          <span class="wizard-stat-label">files skipped</span>
        </div>
        <div class="wizard-stat">
          <span class="wizard-stat-number">${n.configPatched?"Yes":"No"}</span>
          <span class="wizard-stat-label">config patched</span>
        </div>
      </div>
      <p class="wizard-success-path">Workspace: <code>${n.workspacePath}</code></p>
      <p class="wizard-success-hint">
        Start a new chat session and the agent will automatically read your memory files.
        The system gets smarter with every conversation.
      </p>
      <button class="wizard-btn wizard-btn--next" @click=${()=>t.onClose()}>
        Start Using GodMode
      </button>
    </div>
  `:r`${h}`}function id(){return{name:"",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,focus:"",projects:[],commStyle:"Direct and concise -- no fluff, just answers",hardRules:[],keyPeople:[],defaultModel:"sonnet"}}function S0(){return{step:0,answers:id(),preview:null,diff:null,fileSelections:{},configSelections:{},generating:!1,result:null,error:null}}function ad(e,t){const{step:n,answers:s}=e;if(n===9)return r`
      <div class="wizard-fullscreen">
        ${w0(e,t)}
      </div>
    `;if(n===8)return r`
      <div class="wizard-fullscreen">
        <div class="wizard-container">
          ${kr(n)}
          ${b0(e,t)}
        </div>
      </div>
    `;const i=(()=>{switch(n){case 0:return s.name.trim().length>0;case 1:return!0;case 2:return!0;case 3:return!0;case 4:return s.commStyle.trim().length>0;case 5:return!0;case 6:return!0;case 7:return!0;default:return!1}})(),a=n===7,o=(()=>{switch(n){case 0:return u0(s,t);case 1:return p0(s,t);case 2:return h0(s,t);case 3:return f0(s,t);case 4:return g0(s,t);case 5:return m0(s,t);case 6:return v0(s,t);case 7:return y0(s,t);default:return r`${h}`}})();return r`
    <div class="wizard-fullscreen">
      <div class="wizard-container">
        <div class="wizard-glow"></div>
        ${kr(n)}
        ${c0(n)}
        ${o}
        ${d0(n,t,i,a)}
      </div>
    </div>
  `}const k0=Object.freeze(Object.defineProperty({__proto__:null,emptyWizardAnswers:id,emptyWizardState:S0,renderOnboardingWizard:ad},Symbol.toStringTag,{value:"Module"}));function Vt(e){return e===null?"none":e>=8?"high":e>=5?"medium":"low"}function Cn(e){return{high:"trust-score--high",medium:"trust-score--medium",low:"trust-score--low",none:"trust-score--none"}[e]}function $0(e){return{improving:"Improving",declining:"Declining",stable:"Stable",new:"New"}[e]??"New"}function A0(e){return{improving:"trust-trend--up",declining:"trust-trend--down",stable:"trust-trend--stable",new:"trust-trend--new"}[e]??"trust-trend--new"}function T0(e){return{improving:"↑",declining:"↓",stable:"→",new:"•"}[e]??"•"}function x0(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const i=Math.floor(s/24);return i<7?`${i}d ago`:new Date(e).toLocaleDateString()}function _0(e){const t=e.overallScore,n=Vt(t);return r`
    <div class="trust-overall">
      <div class="trust-overall-score ${Cn(n)}">
        <span class="trust-overall-number">${t!==null?t.toFixed(1):"--"}</span>
        <span class="trust-overall-max">/10</span>
      </div>
      <div class="trust-overall-meta">
        <span class="trust-overall-label">Overall Trust Score</span>
        <span class="trust-overall-stats">
          ${e.totalRatings} rating${e.totalRatings!==1?"s":""}
          across ${e.workflows.length} workflow${e.workflows.length!==1?"s":""}
        </span>
      </div>
    </div>
  `}function C0(e,t){const s=Math.min(100,Math.max(0,(e??t)/10*100)),i=Vt(e??(t>0?t:null));return r`
    <div class="trust-progress">
      <div
        class="trust-progress-fill ${Cn(i)}"
        style="width: ${s}%"
      ></div>
    </div>
  `}function E0(e,t){const s=e.trustScore!==null?e.trustScore.toFixed(1):e.avgRating>0?e.avgRating.toFixed(1):"--",i=Vt(e.trustScore??(e.avgRating>0?e.avgRating:null)),a=e.count<10?10-e.count:0;return r`
    <div class="trust-card">
      <div class="trust-card-header">
        <span class="trust-card-name">${e.workflow}</span>
        ${t?r`<button
              class="trust-card-remove"
              title="Remove workflow"
              @click=${()=>t(e.workflow)}
            >&times;</button>`:h}
      </div>

      <div class="trust-card-score-row">
        <span class="trust-card-score ${Cn(i)}">${s}</span>
        <span class="trust-card-score-label">/10</span>
        <span class="trust-trend ${A0(e.trend)}">
          ${T0(e.trend)} ${$0(e.trend)}
        </span>
      </div>

      ${C0(e.trustScore,e.avgRating)}

      <div class="trust-card-meta">
        <span class="trust-card-count">${e.count} rating${e.count!==1?"s":""}</span>
        ${a>0?r`<span class="trust-card-pending">${a} more until trust score</span>`:h}
        ${e.needsFeedback?r`<span class="trust-card-needs-feedback">Needs improvement</span>`:h}
      </div>

      ${e.recentFeedback.length>0?r`
            <div class="trust-card-feedback">
              <span class="trust-card-feedback-label">Feedback applied:</span>
              ${e.recentFeedback.map(o=>r`<span class="trust-card-feedback-item">${o}</span>`)}
            </div>
          `:h}
    </div>
  `}function L0(){return[{workflow:"Code Reviews",avgRating:8.2,count:14,trustScore:8.2,needsFeedback:!1,trend:"improving",recentNotes:[],recentFeedback:[]},{workflow:"Email Drafts",avgRating:6.5,count:11,trustScore:6.5,needsFeedback:!0,trend:"stable",recentNotes:[],recentFeedback:["Be more concise","Match my tone"]},{workflow:"Research",avgRating:7.8,count:3,trustScore:null,needsFeedback:!1,trend:"new",recentNotes:[],recentFeedback:[]}]}function P0(){const e=L0();return{workflows:e.map(t=>t.workflow),summaries:e,ratings:[],total:0,overallScore:7.6,totalRatings:28,totalUses:28}}function R0(e){const t=Vt(e.rating);return r`
    <div class="trust-rating-row">
      <span class="trust-rating-score ${Cn(t)}">${e.rating}</span>
      <span class="trust-rating-workflow">${e.workflow}</span>
      ${e.note?r`<span class="trust-rating-note">${e.note}</span>`:h}
      <span class="trust-rating-time">${x0(e.timestamp)}</span>
    </div>
  `}function I0(){return r`
    <div class="trust-sample-banner">
      Sample data — use skills and rate them to build your real trust profile.
    </div>
  `}function M0(e){const t=e.connected,n=e.guardrailsData,s=e.consciousnessStatus,i=e.data?.todayRating??null,a=e.updateStatus??null,o=a?.openclawUpdateAvailable||a?.pluginUpdateAvailable;if(!t)return{level:"alert",icon:"⚠️",text:"Gateway disconnected",detail:"Reconnect to restore full functionality."};if(o){const d=[];return a.openclawUpdateAvailable&&a.openclawLatest&&d.push(`OpenClaw ${a.openclawVersion} → ${a.openclawLatest}`),a.pluginUpdateAvailable&&a.pluginLatest&&d.push(`GodMode ${a.pluginVersion} → ${a.pluginLatest}`),{level:"warn",icon:"🔄",text:"Update available",detail:d.join(", ")+". Visit Overview to update."}}if(s==="error")return{level:"warn",icon:"🧠",text:"Consciousness sync needs attention",detail:"Your system is running but the last sync encountered an error."};if(n){const d=n.gates.filter(l=>l.enabled).length,u=n.gates.length;if(d<u)return{level:"warn",icon:"🛡",text:`${u-d} security gate${u-d!==1?"s":""} disabled`,detail:"Your system is running with reduced safety coverage."}}const c=a&&!o?" Up to date.":"";return i?i.rating>=8?{level:"ok",icon:"✨",text:`Rated ${i.rating}/10 today — GodMode is running great.`,detail:`All systems secure and building trust daily.${c}`}:i.rating>=5?{level:"ok",icon:"💪",text:`Rated ${i.rating}/10 today — working to improve.`,detail:`Your feedback is being applied. All systems secure.${c}`}:{level:"warn",icon:"💬",text:`Rated ${i.rating}/10 today — your feedback matters.`,detail:`We're using your input to get better. All systems secure.${c}`}:{level:"ok",icon:"✅",text:"Your GodMode is safe, secure, and building trust daily.",detail:`All systems healthy.${c} Rate your day below to help improve.`}}function D0(e){const{level:t,icon:n,text:s,detail:i}=M0(e);return r`
    <div class="trust-hero trust-hero--${t}">
      <span class="trust-hero-icon">${n}</span>
      <div class="trust-hero-body">
        <div class="trust-hero-text">${s}</div>
        <div class="trust-hero-detail">${i}</div>
      </div>
    </div>
  `}function O0(e){return e<=4?"trust-daily-button--low":e<=7?"trust-daily-button--med":"trust-daily-button--high"}function $r(e){const t=[];for(let n=0;n<7;n++)t.push(e[n]??null);return r`
    <div class="trust-daily-trend">
      ${t.map(n=>{if(!n)return r`<div class="trust-daily-trend-dot trust-daily-trend-dot--empty"></div>`;const s=Math.max(4,n.rating/10*28),i=Vt(n.rating);return r`
          <div
            class="trust-daily-trend-dot trust-daily-trend-dot--${i==="none"?"medium":i}"
            style="height: ${s}px"
            title="${n.date}: ${n.rating}/10"
          ></div>
        `})}
    </div>
  `}function N0(e){const t=e.data,n=t?.todayRating??null,s=t?.recentDaily??[],i=t?.dailyStreak??0,a=t?.dailyAverage??null;if(!e.onDailyRate)return h;if(n){const o=Vt(n.rating),c=n.rating<7&&!n.note;return r`
      <div class="trust-daily">
        <div class="trust-daily-header">
          <span class="trust-daily-prompt">Today's Rating</span>
          ${i>1?r`<span class="trust-daily-streak">${i} day streak</span>`:h}
        </div>
        <div class="trust-daily-result">
          <div class="trust-daily-result-score ${Cn(o)}">
            ${n.rating}<span class="trust-daily-result-max">/10</span>
          </div>
          <div class="trust-daily-result-meta">
            <span class="trust-daily-result-label">
              ${n.rating>=8?"Great day!":n.rating>=5?"Good, working to improve":"Thanks for the honesty"}
            </span>
            ${n.note?r`<span class="trust-daily-result-note">"${n.note}"</span>`:h}
            ${a!==null?r`<span class="trust-daily-result-note">7-day avg: ${a}/10</span>`:h}
          </div>
          ${s.length>1?$r(s):h}
        </div>
        ${c?r`
              <div class="trust-daily-feedback">
                <input
                  class="trust-daily-feedback-input"
                  type="text"
                  placeholder="What could be better?"
                  @keydown=${d=>{if(d.key==="Enter"){const u=d.target,l=u.value.trim();l&&e.onDailyRate&&(e.onDailyRate(n.rating,l),u.value="")}}}
                />
                <button
                  class="trust-daily-feedback-submit"
                  type="button"
                  @click=${d=>{const l=d.target.previousElementSibling,p=l?.value?.trim();p&&e.onDailyRate&&(e.onDailyRate(n.rating,p),l.value="")}}
                >Send</button>
              </div>
            `:h}
      </div>
    `}return r`
    <div class="trust-daily">
      <div class="trust-daily-header">
        <span class="trust-daily-prompt">How happy were you with GodMode today?</span>
        ${i>0?r`<span class="trust-daily-streak">${i} day streak</span>`:h}
      </div>
      <div class="trust-daily-buttons">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>r`
            <button
              class="trust-daily-button ${O0(o)}"
              type="button"
              title="${o}/10"
              @click=${()=>e.onDailyRate(o)}
            >${o}</button>
          `)}
      </div>
      ${s.length>0?r`
            <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              ${$r(s)}
              ${a!==null?r`<span style="font-size: 0.75rem; color: var(--text-muted);">7-day avg: ${a}/10</span>`:h}
            </div>
          `:h}
    </div>
  `}function F0(e){if(!e)return r`
      <div class="trust-health-card">
        <div class="trust-health-card-header">
          <span class="trust-health-card-icon">\u{1F6E1}</span>
          Security
        </div>
        <div class="trust-health-row">
          <span class="trust-health-dot trust-health-dot--idle"></span>
          <span class="trust-health-label">Loading...</span>
        </div>
      </div>
    `;const t=e.gates,n=t.filter(l=>l.enabled).length,s=t.length,i=n===s,a=Date.now()-864e5,o=e.activity.filter(l=>Date.parse(l.timestamp)>a),c=o.filter(l=>l.action==="blocked").length,d=o.filter(l=>l.action==="fired").length,u=i?"trust-health-card-badge--ok":n>0?"trust-health-card-badge--warn":"trust-health-card-badge--error";return r`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F6E1}</span>
        Security
        <span class="trust-health-card-badge ${u}">
          ${n}/${s} Active
        </span>
      </div>

      <div class="trust-health-gate-list">
        ${t.map(l=>r`
            <div class="trust-health-gate ${l.enabled?"":"trust-health-gate--disabled"}">
              <span class="trust-health-dot ${l.enabled?"trust-health-dot--ok":"trust-health-dot--idle"}"></span>
              <span class="trust-health-gate-icon">${l.icon}</span>
              <span class="trust-health-gate-name">${l.name}</span>
            </div>
          `)}
      </div>

      ${o.length>0?r`
            <div class="trust-health-activity">
              <span class="trust-health-activity-count">${o.length}</span>
              event${o.length!==1?"s":""} in last 24h
              ${c>0?r` &middot; <span class="trust-health-activity-count">${c}</span> blocked`:h}
              ${d>0?r` &middot; <span class="trust-health-activity-count">${d}</span> fired`:h}
            </div>
          `:r`
            <div class="trust-health-activity">No activity in last 24h</div>
          `}
    </div>
  `}function B0(e){return!e||e==="idle"?"Idle":e==="loading"?"Syncing...":e==="ok"?"Synced":"Error"}function U0(e){return!e||e==="idle"?"trust-health-dot--idle":e==="loading"?"trust-health-dot--warn":e==="ok"?"trust-health-dot--ok":"trust-health-dot--error"}function K0(e){const t=e.connected,n=e.consciousnessStatus,s=e.sessionsCount,i=e.gatewayUptimeMs,c=(t?1:0)+(n==="ok"||n==="idle"?1:0)===2&&t;return r`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F4E1}</span>
        Sentinel
        <span class="trust-health-card-badge ${c?"trust-health-card-badge--ok":t?"trust-health-card-badge--warn":"trust-health-card-badge--error"}">${c?"Healthy":t?"Degraded":"Offline"}</span>
      </div>

      <div class="trust-health-row">
        <span class="trust-health-dot ${t?"trust-health-dot--ok":"trust-health-dot--error"}"></span>
        <span class="trust-health-label">Gateway</span>
        <span class="trust-health-value">${t?"Connected":"Disconnected"}</span>
      </div>

      <div class="trust-health-row">
        <span class="trust-health-dot ${U0(n)}"></span>
        <span class="trust-health-label">Consciousness</span>
        <span class="trust-health-value">${B0(n)}</span>
      </div>

      ${s!=null?r`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Sessions</span>
              <span class="trust-health-value">${s} active</span>
            </div>
          `:h}

      ${i!=null?r`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Uptime</span>
              <span class="trust-health-value">${zr(i)}</span>
            </div>
          `:h}
    </div>
  `}function z0(e){return r`
    <div class="trust-health">
      <h3 class="trust-health-title">System Health</h3>
      <div class="trust-health-grid">
        ${F0(e.guardrailsData)}
        ${K0(e)}
      </div>
    </div>
  `}function W0(e){const{connected:t,loading:n,data:s,onRemoveWorkflow:i,onRefresh:a}=e;if(!t)return r`
      <section class="tab-body trust-section">
        <div class="trust-disconnected">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return r`
      <section class="tab-body trust-section">
        <div class="trust-loading">Loading trust tracker...</div>
      </section>
    `;const c=!(s?.summaries??[]).some(p=>p.count>0),d=c?P0():s,u=d.summaries,l=c?[]:s?.ratings??[];return r`
    <section class="tab-body trust-section">
      ${D0(e)}

      ${c?I0():h}

      ${N0(e)}

      ${_0(d)}

      <div class="trust-workflows-grid">
        ${u.map(p=>E0(p,c?null:i))}
      </div>

      ${z0(e)}

      ${l.length>0?r`
            <div class="trust-history">
              <h3 class="trust-history-title">Recent Ratings</h3>
              <div class="trust-history-list">
                ${l.slice(0,20).map(R0)}
              </div>
            </div>
          `:h}
    </section>
  `}function q0(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const i=Math.floor(s/24);return i<7?`${i}d ago`:new Date(e).toLocaleDateString()}function j0(e){return{fired:"guardrails-badge--fired",blocked:"guardrails-badge--blocked",cleaned:"guardrails-badge--cleaned"}[e]??""}function od(e,t){return r`
    <button
      class="options-toggle ${e?"options-toggle--on":""}"
      role="switch"
      aria-checked="${e}"
      @click=${t}
    >
      <span class="options-toggle-track">
        <span class="options-toggle-thumb"></span>
      </span>
    </button>
  `}function H0(e,t,n,s){const i=e.thresholds?.[t]??0;return r`
    <div class="guardrails-threshold">
      <label class="guardrails-threshold-label">${n}</label>
      <input
        class="guardrails-threshold-input"
        type="number"
        min="1"
        .value=${String(i)}
        ?disabled=${!e.enabled}
        @change=${a=>{const o=Number(a.target.value);!Number.isNaN(o)&&o>0&&s(e.id,t,o)}}
      />
    </div>
  `}function V0(e,t,n){const s=e.thresholdLabels?Object.keys(e.thresholdLabels):[];return r`
    <div class="guardrails-card card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${e.icon}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook">${e.hook}</span>
        </div>
        ${od(e.enabled,()=>t(e.id,!e.enabled))}
      </div>
      <div class="guardrails-card-description">${e.description}</div>
      ${s.length>0?r`
            <div class="guardrails-thresholds">
              ${s.map(i=>H0(e,i,e.thresholdLabels[i],n))}
            </div>
          `:h}
    </div>
  `}function G0(e,t,n){const s=e.action==="redirect"?"↪":"🚫",i=e.action==="redirect"?"redirect":"block";return r`
    <div class="guardrails-card card guardrails-custom-card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${s}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook guardrails-action-tag guardrails-action-tag--${i}">${i}</span>
        </div>
        <div class="guardrails-custom-actions">
          ${od(e.enabled,()=>t(e.id,!e.enabled))}
          <button class="guardrails-delete-btn" title="Delete rule" @click=${()=>n(e.id)}>&times;</button>
        </div>
      </div>
      <div class="guardrails-card-description">${e.message}</div>
      <div class="guardrails-custom-meta">
        <span class="guardrails-custom-tool">${e.trigger.tool}</span>
        ${e.trigger.patterns.map(a=>r`<span class="guardrails-pattern-tag">${a}</span>`)}
      </div>
    </div>
  `}function Y0(e){return r`
    <div class="guardrails-activity-row">
      <span class="guardrails-badge ${j0(e.action)}">${e.action}</span>
      <span class="guardrails-activity-gate">${e.gateId}</span>
      <span class="guardrails-activity-detail">${e.detail}</span>
      <span class="guardrails-activity-time">${q0(e.timestamp)}</span>
    </div>
  `}function Q0(e){const{connected:t,loading:n,data:s,onToggle:i,onThresholdChange:a,onCustomToggle:o,onCustomDelete:c,onToggleAddForm:d,onOpenAllyChat:u}=e;if(!t)return r`
      <section class="tab-body guardrails-section">
        <div class="guardrails-empty">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return r`
      <section class="tab-body guardrails-section">
        <div class="guardrails-loading">Loading guardrails...</div>
      </section>
    `;const l=s?.gates??[],p=s?.activity??[],v=s?.custom??[],y=l.filter(S=>S.enabled).length,b=v.filter(S=>S.enabled).length,k=[`${y}/${l.length} gates active`];return v.length>0&&k.push(`${b} custom rule${v.length===1?"":"s"}`),r`
    <section class="tab-body guardrails-section">
      <div class="guardrails-two-col">
        <div class="guardrails-left">
          <h2 class="guardrails-col-heading">Safety Gates</h2>
          <p class="guardrails-col-subtitle">${y}/${l.length} active — prevent runaway loops, bad searches, and lazy responses.</p>
          <div class="guardrails-grid">
            ${l.map(S=>V0(S,i,a))}
          </div>
        </div>

        <div class="guardrails-right">
          <h2 class="guardrails-col-heading">Custom Rules & Activity</h2>
          <p class="guardrails-col-subtitle">Your rules${v.length>0?` (${b} active)`:""} and recent gate events.</p>

          <div class="guardrails-custom-section">
            <div class="guardrails-custom-header">
              <h3 class="guardrails-custom-title">Custom Rules</h3>
              <button class="guardrails-add-btn" @click=${()=>{u?u("Create a new guardrail rule: "):d()}}>+ Add Rule</button>
            </div>

            ${v.length>0?r`
                  <div class="guardrails-custom-grid">
                    ${v.map(S=>G0(S,o,c))}
                  </div>
                `:r`
                  <div class="guardrails-custom-empty">
                    No custom rules yet. Click "+ Add Rule" to tell your ally what to block or redirect.
                  </div>
                `}
          </div>

          <div class="guardrails-history">
            <h3 class="guardrails-history-title">Recent Activity</h3>
            ${p.length>0?r`
                  <div class="guardrails-history-list">
                    ${p.slice(0,30).map(Y0)}
                  </div>
                `:r`<div class="guardrails-no-activity">No gate activity recorded yet.</div>`}
          </div>
        </div>
      </div>
    </section>
  `}const J0={"gm-work":()=>E(()=>import("./work-tab-CQUY-9Wh.js"),__vite__mapDeps([0,1,2,3]),import.meta.url),"gm-today":()=>E(()=>import("./today-tab-Be3-Ebns.js"),__vite__mapDeps([4,1,3]),import.meta.url),"gm-second-brain":()=>E(()=>import("./second-brain-tab-DaKJd32f.js"),__vite__mapDeps([5,1,2,6,3]),import.meta.url),"gm-dashboards":()=>E(()=>import("./dashboards-tab-NHUFEUyo.js"),__vite__mapDeps([7,1,2,8,3]),import.meta.url)},Ar=new Set;function zn(e){Ar.has(e)||(Ar.add(e),J0[e]?.())}const X0=/^data:/i,Z0=/^https?:\/\//i;function eS(e){const t=e.agentsList?.agents??[],s=Fr(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",a=t.find(c=>c.id===s)?.identity,o=a?.avatarUrl??a?.avatar;if(o)return X0.test(o)||Z0.test(o)?o:a?.avatarUrl}function Tr(e){const t=e.trim();if(!t)return t;const n=t.split(/\s+/);if(n.length>=2&&n.length%2===0){const c=n.length/2,d=n.slice(0,c).join(" "),u=n.slice(c).join(" ");if(d.toLowerCase()===u.toLowerCase())return d}const s=t.replace(/\s+/g," ").toLowerCase(),i=Math.floor(s.length/2),a=s.slice(0,i).trim(),o=s.slice(i).trim();return a&&a===o?t.slice(0,Math.ceil(t.length/2)).trim():t}function Ui(e,t){const n=t?.sessionId?.trim();return n?`session:${n}`:`key:${e.trim().toLowerCase()}`}function xr(e){if(e===V)return!0;const t=e.toLowerCase();return!!(t==="agent:main:main"||t.endsWith(":main"))}function tS(e){const t=e.sessionsResult?.sessions,n=[...new Set(e.settings.openTabs.map(c=>c.trim()).filter(Boolean))].filter(c=>!xr(c)),s=vt(t,e.sessionKey),i=Ui(e.sessionKey,s),a=new Map;for(const c of n){const d=vt(t,c),u=Ui(c,d);if(!a.has(u)){a.set(u,c);continue}c===e.sessionKey&&a.set(u,c)}const o=[...a.values()];if(o.length===0){const c=e.sessionKey.trim()||"main";xr(c)||o.push(c)}return{tabKeys:o,activeIdentity:i}}function nS(e){if(e.wizardActive&&e.wizardState)return ad(e.wizardState,{onStepChange:l=>{e.handleWizardStepChange?.(l)},onAnswerChange:(l,p)=>{e.handleWizardAnswerChange?.(l,p)},onPreview:()=>{e.handleWizardPreview?.()},onGenerate:()=>{e.handleWizardGenerate?.()},onClose:()=>{e.handleWizardClose?.()},onFileToggle:(l,p)=>{e.handleWizardFileToggle?.(l,p)},onConfigToggle:(l,p)=>{e.handleWizardConfigToggle?.(l,p)}});e.presenceEntries.length;const t=e.sessionsResult?.count??null;e.cronStatus?.nextWakeAtMs;const n=e.connected?null:"Disconnected from gateway.",s=e.tab==="chat",i=s&&(e.settings.chatFocusMode||e.onboarding),a=e.onboarding?!1:e.settings.chatShowThinking,o=eS(e),c=e.chatAvatarUrl??o??null,{tabKeys:d,activeIdentity:u}=tS(e);return r`
    <div class="shell ${s?"shell--chat":""} ${i?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
            aria-label="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">${q.menu}</span>
          </button>
          <div class="brand">
            <div class="brand-logo">
              <span style="font-size: 24px;">⚡</span>
            </div>
            <div class="brand-text">
              <div class="brand-title">GodMode</div>
              <div class="brand-sub">Personal AI Operating System</div>
            </div>
          </div>
        </div>
        <div class="topbar-center">
          ${h}
        </div>
        <div class="topbar-status">
          ${e.updateStatus?.openclawUpdateAvailable||e.updateStatus?.pluginUpdateAvailable?r`<a
                  class="pill pill--update"
                  href="#"
                  title="${e.updateStatus?.openclawUpdateAvailable?"OpenClaw update available":"GodMode plugin update available"} — click to view"
                  @click=${l=>{l.preventDefault(),e.setTab("config")}}
                >
                  <span class="pill__icon">${q.zap}</span>
                  <span>Update Ready</span>
                </a>`:h}
          ${e.updateStatus?.pendingDeploy?r`<button
                  class="pill pill--deploy"
                  @click=${l=>{l.preventDefault(),e.handleDeployPanelToggle()}}
                  title="${e.updateStatus.pendingDeploy.summary??"pending fix"}"
                >
                  <span class="pill__icon">${q.rotateCcw}</span>
                  <span>Deploy Ready</span>
                </button>`:h}
          <button
            class="pill pill--support"
            @click=${l=>{l.preventDefault(),e.handleOpenSupportChat()}}
            title="Open support chat"
          >
            <span class="pill__icon">${q.headphones}</span>
            <span>Support</span>
          </button>
          <div class="pill ${e.reconnecting?"reconnecting":""}">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>Gateway</span>
            <span class="mono">${e.reconnecting?`Reconnecting${e.reconnectAttempt>1?` (${e.reconnectAttempt})`:""}...`:e.connected?"Connected":"Offline"}</span>
          </div>
          ${Lc(e)}
        </div>
      </header>
      ${e.deployPanelOpen&&e.updateStatus?.pendingDeploy?(()=>{const l=e.updateStatus.pendingDeploy,p=Date.now()-l.ts,v=Math.floor(p/6e4),y=v<1?"just now":v<60?`${v}m ago`:`${Math.floor(v/60)}h ago`;return r`
              <div class="deploy-review-panel">
                <div class="deploy-review-panel__body">
                  <div class="deploy-review-panel__info">
                    <strong>Staged Deploy</strong>
                    <span class="deploy-review-panel__summary">${l.summary??"Pending fix"}</span>
                    <span class="deploy-review-panel__meta">Staged ${y}</span>
                    ${l.files?.length?r`<details class="deploy-review-panel__files">
                          <summary>${l.files.length} file${l.files.length>1?"s":""} changed</summary>
                          <ul>${l.files.map(b=>r`<li>${b}</li>`)}</ul>
                        </details>`:h}
                  </div>
                  <div class="deploy-review-panel__actions">
                    <button
                      class="btn btn--sm primary"
                      @click=${()=>{e.handleDeployPanelToggle(),e.handleGatewayRestartClick()}}
                    >Apply (Restart)</button>
                    <button
                      class="btn btn--sm"
                      @click=${()=>e.handleDeployDismiss()}
                    >Dismiss</button>
                  </div>
                </div>
              </div>`})():h}
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">

        ${su.map(l=>{const p=e.settings.navGroupsCollapsed[l.label]??!1,v=l.tabs.some(b=>b===e.tab),y=!l.label||l.tabs.length===1&&yn(l.tabs[0])===l.label;return r`
            <div class="nav-group ${p&&!v?"nav-group--collapsed":""} ${y?"nav-group--no-header":""}">
              ${y?h:r`
                <button
                  class="nav-label"
                  @click=${()=>{const b={...e.settings.navGroupsCollapsed};b[l.label]=!p,e.applySettings({...e.settings,navGroupsCollapsed:b})}}
                  aria-expanded=${!p}
                >
                  <span class="nav-label__text">${l.label}</span>
                  <span class="nav-label__chevron">${p?"+":"−"}</span>
                </button>
              `}
              <div class="nav-group__items">
                ${!l.label&&e.godmodeOptions!=null&&!e.godmodeOptions?.["onboarding.hidden"]?r`
                        <a
                          class="nav-item ${e.tab==="onboarding"?"active":""}"
                          href="#"
                          @click=${b=>{b.preventDefault(),e.handleWizardOpen?.()}}
                          title="Power up your GodMode ally."
                        >
                          <span class="nav-item__emoji" aria-hidden="true">\u{1F9ED}</span>
                          <span class="nav-item__text">Setup</span>
                        </a>
                      `:h}
                ${l.tabs.map(b=>Di(e,b))}
              </div>
            </div>
          `})}
        ${iu.map(l=>{const p=e.settings.navGroupsCollapsed[l.label]??!0,v=l.tabs.some(y=>y===e.tab);return r`
            <div class="nav-group ${p&&!v?"nav-group--collapsed":""}">
              <button
                class="nav-label"
                @click=${()=>{const y={...e.settings.navGroupsCollapsed};y[l.label]=!p,e.applySettings({...e.settings,navGroupsCollapsed:y})}}
                aria-expanded=${!p}
              >
                <span class="nav-label__text">${l.label}</span>
                <span class="nav-label__chevron">${p?"+":"−"}</span>
              </button>
              <div class="nav-group__items">
                ${l.tabs.map(y=>Di(e,y))}
              </div>
            </div>
          `})}
        <div class="nav-group nav-group--links">
          <div class="nav-label nav-label--static">
            <span class="nav-label__text">Resources</span>
          </div>
          <div class="nav-group__items">
            <a
              class="nav-item nav-item--external"
              href="https://docs.clawd.bot"
              target="_blank"
              rel="noreferrer"
              title="Docs (opens in new tab)"
            >
              <span class="nav-item__icon" aria-hidden="true">${q.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${s?"content--chat":""}">
        <section class="content-header">
          <div>
            ${e.tab!=="chat"&&e.tab!=="onboarding"?r`
              <div class="page-title">${yn(e.tab)}</div>
              <div class="page-sub">${ru(e.tab)}</div>
            `:e.tab==="chat"?r`
              <div class="session-tabs">
                <div class="session-tab session-tab--pinned ${e.sessionKey===V?"session-tab--active":""}"
                     @click=${()=>{e.sessionKey!==V&&(Ke(e),e.sessionKey=V,e.allyUnread=0,Ze(e,V),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:V,lastActiveSessionKey:V,tabLastViewed:{...e.settings.tabLastViewed,[V]:Date.now()}}),e.loadAssistantIdentity(),ce(e).then(()=>{e.resetChatScroll(),fe(e,!0)}),e.loadSessionResources(),J(e))}}
                     title="${e.assistantName||"Ally"}">
                  ${e.assistantAvatar?r`<img src="${e.assistantAvatar}" class="session-tab-avatar" width="16" height="16" style="border-radius:50%;vertical-align:middle;margin-right:4px;" />`:r`<span class="session-tab-icon" style="margin-right:4px;">&#x2726;</span>`}
                  ${e.assistantName||"Ally"}
                  ${(e.allyUnread??0)>0?r`<span class="ally-tab-badge" style="margin-left:4px;font-size:10px;background:var(--accent-color,#5b73e8);color:#fff;border-radius:50%;padding:1px 5px;">${e.allyUnread}</span>`:h}
                </div>
                ${us(d,l=>l,(l,p)=>{const v=vt(e.sessionsResult?.sessions,l),y=Ui(l,v)===u,k=(()=>{if(v?.label||v?.displayName)return Tr(v.label??v.displayName);const A=Pe.get(l);if(A)return Tr(A);if(l==="agent:main:support")return"Support";if(l.includes("webchat")){const x=l.match(/webchat[:-](\d+)/);return x?`Chat ${x[1]}`:"Chat"}if(l.includes("main"))return"MAIN";const C=l.split(/[:-]/);return C[C.length-1]||l})(),S=e.workingSessions.has(l),$=e.settings.tabLastViewed[l]??0,T=v?.updatedAt??0,P=!y&&!S&&T>$,L=e.editingTabKey===l;return r`
                      <div
                        class="session-tab ${y?"session-tab--active":""} ${S?"session-tab--working":""} ${P?"session-tab--ready":""} ${L?"session-tab--editing":""}"
                        draggable="true"
                        @dragstart=${A=>{if(e.editingTabKey===l){A.preventDefault();return}A.dataTransfer.effectAllowed="move",A.dataTransfer.setData("text/session-key",l),A.dataTransfer.setData("text/plain",p.toString()),A.target.classList.add("dragging")}}
                        @click=${()=>{if(!L){if(y){e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}});return}Ke(e),e.sessionKey=l,Ze(e,l),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:l,lastActiveSessionKey:l,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}}),e.loadAssistantIdentity(),Ae(e,l,!0),ce(e).then(()=>{e.resetChatScroll(),fe(e,!0)}),e.loadSessionResources(),J(e),Aa()}}}
                        @dragend=${A=>{A.target.classList.remove("dragging")}}
                        @dragover=${A=>{A.preventDefault(),A.dataTransfer.dropEffect="move";const C=A.currentTarget,x=C.getBoundingClientRect(),F=x.left+x.width/2;A.clientX<F?(C.classList.add("drop-left"),C.classList.remove("drop-right")):(C.classList.add("drop-right"),C.classList.remove("drop-left"))}}
                        @dragleave=${A=>{A.currentTarget.classList.remove("drop-left","drop-right")}}
                        @drop=${A=>{A.preventDefault();const C=parseInt(A.dataTransfer.getData("text/plain")),x=p;if(C===x)return;const F=e.settings.openTabs.slice(),[M]=F.splice(C,1);F.splice(x,0,M),e.applySettings({...e.settings,openTabs:F}),A.currentTarget.classList.remove("drop-left","drop-right")}}
                        title=${k}
                      >
                        ${L?r`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${v?.label??v?.displayName??""}
                            @click=${A=>A.stopPropagation()}
                            @dblclick=${A=>A.stopPropagation()}
                            @blur=${async A=>{const C=A.target;if(C._committedByEnter)return;const x=C.value.trim();e.editingTabKey=null;const F=v?.label??v?.displayName??"";if(x!==F){x?Pe.set(l,x):Pe.delete(l),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(W=>W.key===l?{...W,label:x||void 0,displayName:x||void 0}:W)});const M=await Gn(e,l,{label:x||null,displayName:x||null});J(e);const U=M.ok&&M.canonicalKey!==l?M.canonicalKey:l,K=l===e.sessionKey;e.applySettings({...e.settings,...M.ok&&M.canonicalKey!==l&&e.settings.openTabs.includes(l)?{openTabs:e.settings.openTabs.map(W=>W===l?M.canonicalKey:W)}:{},tabLastViewed:{...e.settings.tabLastViewed,[U]:Date.now()},...K&&M.ok&&M.canonicalKey!==l?{sessionKey:M.canonicalKey,lastActiveSessionKey:M.canonicalKey}:{}}),K&&M.ok&&M.canonicalKey!==l&&(e.sessionKey=M.canonicalKey,Ae(e,M.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}})}}
                            @keydown=${async A=>{if(A.key==="Enter"){A.preventDefault();const C=A.target;C._committedByEnter=!0;const x=C.value.trim();e.editingTabKey=null;const F=v?.label??v?.displayName??"";if(x!==F){x?Pe.set(l,x):Pe.delete(l),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(W=>W.key===l?{...W,label:x||void 0,displayName:x||void 0}:W)});const M=await Gn(e,l,{label:x||null,displayName:x||null});J(e);const U=M.ok&&M.canonicalKey!==l?M.canonicalKey:l,K=l===e.sessionKey;e.applySettings({...e.settings,...M.ok&&M.canonicalKey!==l&&e.settings.openTabs.includes(l)?{openTabs:e.settings.openTabs.map(W=>W===l?M.canonicalKey:W)}:{},tabLastViewed:{...e.settings.tabLastViewed,[U]:Date.now()},...K&&M.ok&&M.canonicalKey!==l?{sessionKey:M.canonicalKey,lastActiveSessionKey:M.canonicalKey}:{}}),K&&M.ok&&M.canonicalKey!==l&&(e.sessionKey=M.canonicalKey,Ae(e,M.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}})}else A.key==="Escape"&&(A.preventDefault(),e.editingTabKey=null)}}
                          />
                        `:(()=>{let A=null;return r`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${C=>{C.stopPropagation(),A&&clearTimeout(A),A=setTimeout(()=>{A=null,e.editingTabKey!==l&&(l===e.sessionKey?e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}}):(Ke(e),e.sessionKey=l,e.chatPrivateMode=!!e.privateSessions?.has(l),Ze(e,l),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:l,lastActiveSessionKey:l,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}}),e.loadAssistantIdentity(),Ae(e,l,!0),ce(e).then(()=>{e.resetChatScroll(),fe(e,!0)}),e.loadSessionResources(),J(e)))},250)}}
                            @dblclick=${C=>{C.preventDefault(),C.stopPropagation(),A&&(clearTimeout(A),A=null),e.editingTabKey=l;const x=C.target.closest(".session-tab"),F=M=>{const U=M.target;x&&!x.contains(U)&&(e.editingTabKey=null,document.removeEventListener("mousedown",F,!0))};document.addEventListener("mousedown",F,!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const M=x?.querySelector(".session-tab__name-input");M&&(M.focus(),M.select())})})}}
                          >${k}</span>
                        `})()}
                        ${e.privateSessions?.has(l)?(()=>{const A=e.privateSessions.get(l),C=Math.max(0,A-Date.now()),x=Math.floor(C/36e5),F=Math.floor(C%36e5/6e4),M=x>0?`${x}h ${F}m`:`${F}m`;return r`
                                  <span class="session-tab__private" title="Private session — expires in ${M}" style="font-size: 9px; margin-left: 3px; color: #f59e0b; white-space: nowrap;"
                                    >🔒 ${M}</span
                                  >
                                `})():h}
                        ${S?r`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `:h}
                        ${P?r`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `:h}
                        ${r`
                          <button
                            class="session-tab__close"
                            @click=${A=>{if(A.stopPropagation(),e.privateSessions?.has(l)){e._destroyPrivateSession(l);return}const C=e.settings.openTabs.filter(M=>M!==l),x=l===e.sessionKey,F=C[0]||V;e.applySettings({...e.settings,openTabs:C,...x?{sessionKey:F,lastActiveSessionKey:F}:{}}),x&&(e.sessionKey=F,e.sessionResources=[],Ae(e,F,!0),ce(e).then(()=>{e.resetChatScroll(),fe(e,!0)}),e.loadSessionResources())}}
                            title=${e.privateSessions?.has(l)?"Destroy private session":"Close tab"}
                          >×</button>
                        `}
                      </div>
                    `})}
              `:h}
          </div>
          <div class="page-meta">
            ${e.reconnecting?r`<div class="pill warning reconnecting">
                  <span class="reconnect-spinner"></span>
                  Reconnecting${e.reconnectAttempt>1?` (attempt ${e.reconnectAttempt})`:""}...
                </div>`:e.lastError?r`<div class="pill ${e.lastError.startsWith("✓")?"success":"danger"}">${e.lastError}</div>`:h}
            ${s?Ec(e):h}
            ${(e.tab==="today"||e.tab==="my-day")&&!e.dynamicSlots.today?Qb({connected:e.connected,onRefresh:()=>e.handleMyDayRefresh(),selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"brief",onViewModeChange:l=>e.handleTodayViewModeChange(l),focusPulseActive:!1,onStartMorningSet:()=>e.handleFocusPulseStartMorning(),inboxItems:e.inboxItems??[],inboxCount:e.inboxCount??0,onEveningCapture:()=>{e.setTab("chat"),e.handleSendChat(`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`)}}):h}
          </div>
        </section>

        ${i?r`<button
              class="focus-exit-fab"
              @click=${()=>e.applySettings({...e.settings,chatFocusMode:!1})}
              title="Exit focus mode (Esc)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
              </svg>
            </button>`:h}

        ${e.tab==="setup"||e.tab==="onboarding"?r`<div class="my-day-container">
                <div class="my-day-card">
                  <div class="my-day-card-content">
                    <p>Use the onboarding wizard to get started.</p>
                    <button class="retry-button" @click=${()=>e.handleWizardOpen?.()}>Open Wizard</button>
                  </div>
                </div>
              </div>`:h}

        ${e.tab==="workspaces"?(zn("gm-work"),r`<gm-work></gm-work>`):h}

        ${e.tab==="today"||e.tab==="my-day"?(zn("gm-today"),r`<gm-today></gm-today>`):h}

        ${e.tab==="channels"?Kv({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:l=>Te(e,l),onWhatsAppStart:l=>e.handleWhatsAppStart(l),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(l,p)=>Bt(e,l,p),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(l,p)=>e.handleNostrProfileEdit(l,p),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(l,p)=>e.handleNostrProfileFieldChange(l,p),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):h}

        ${e.tab==="instances"?fb({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>ha(e)}):h}

        ${e.tab==="sessions"?Ow({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,archivedSessions:e.archivedSessions,archivedSessionsLoading:e.archivedSessionsLoading,archivedSessionsExpanded:e.archivedSessionsExpanded,onFiltersChange:l=>{e.sessionsFilterActive=l.activeMinutes,e.sessionsFilterLimit=l.limit,e.sessionsIncludeGlobal=l.includeGlobal,e.sessionsIncludeUnknown=l.includeUnknown},onRefresh:()=>{J(e),kt(e)},onPatch:async(l,p)=>{const v=await Gn(e,l,p);if(v.ok&&v.canonicalKey!==l&&e.settings.openTabs.includes(l)){const y=e.settings.openTabs.map(k=>k===l?v.canonicalKey:k),b=l===e.sessionKey;e.applySettings({...e.settings,openTabs:y,tabLastViewed:{...e.settings.tabLastViewed,[v.canonicalKey]:e.settings.tabLastViewed[l]??Date.now()},...b?{sessionKey:v.canonicalKey,lastActiveSessionKey:v.canonicalKey}:{}}),b&&(e.sessionKey=v.canonicalKey,Ae(e,v.canonicalKey,!0))}},onDelete:l=>Nl(e,l),onArchive:l=>Fl(e,l),onUnarchive:l=>Bl(e,l),onToggleArchived:()=>{e.archivedSessionsExpanded=!e.archivedSessionsExpanded,e.archivedSessionsExpanded&&e.archivedSessions.length===0&&kt(e)},onAutoArchive:()=>Ul(e)}):h}

        ${e.tab==="cron"?ab({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(l=>l.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:l=>e.cronForm={...e.cronForm,...l},onRefresh:()=>e.loadCron(),onAdd:()=>yg(e),onToggle:(l,p)=>bg(e,l,p),onRun:l=>wg(e,l),onRemove:l=>Sg(e,l),onLoadRuns:l=>tc(e,l)}):h}

        ${e.tab==="skills"?Uw({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,subTab:e.skillsSubTab,godmodeSkills:e.godmodeSkills??null,godmodeSkillsLoading:e.godmodeSkillsLoading??!1,expandedSkills:e.expandedSkills??new Set,onFilterChange:l=>e.skillsFilter=l,onRefresh:()=>{An(e,{clearMessages:!0}),Ii(e)},onToggle:(l,p)=>zg(e,l,p),onEdit:(l,p)=>Kg(e,l,p),onSaveKey:l=>Wg(e,l),onInstall:(l,p,v)=>qg(e,l,p,v),onSubTabChange:l=>{e.skillsSubTab=l,l==="godmode"&&!e.godmodeSkills&&Ii(e),l==="clawhub"&&e.clawhubExploreItems},onToggleExpand:l=>{const p=new Set(e.expandedSkills);p.has(l)?p.delete(l):p.add(l),e.expandedSkills=p},clawhub:{loading:e.clawhubLoading,error:e.clawhubError,query:e.clawhubQuery,results:e.clawhubResults,exploreItems:e.clawhubExploreItems,exploreSort:e.clawhubExploreSort,detailSlug:e.clawhubDetailSlug,detail:e.clawhubDetail,importing:e.clawhubImporting,message:e.clawhubMessage,onSearch:l=>{e.clawhubQuery=l},onExplore:l=>void 0,onDetail:l=>void 0,onCloseDetail:()=>void 0,onImport:l=>Uo(),onImportAndPersonalize:async l=>{if(!await Uo())return;const v=await ev();v&&(va(e,"chat"),xs(e),e.chatMessage=v)}}}):h}

        ${e.tab==="agents"?Vw({loading:e.rosterLoading,error:e.rosterError,roster:e.rosterData??[],filter:e.rosterFilter??"",expandedAgents:e.expandedAgents??new Set,onFilterChange:l=>e.rosterFilter=l,onRefresh:()=>rl(e),onToggleExpand:l=>{const p=new Set(e.expandedAgents);p.has(l)?p.delete(l):p.add(l),e.expandedAgents=p}}):h}

        ${e.tab==="nodes"?Zb({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>ys(e),onDevicesRefresh:()=>it(e),onDeviceApprove:l=>tf(e,l),onDeviceReject:l=>nf(e,l),onDeviceRotate:(l,p,v)=>sf(e,{deviceId:l,role:p,scopes:v}),onDeviceRevoke:(l,p)=>af(e,{deviceId:l,role:p}),onLoadConfig:()=>ze(e),onLoadExecApprovals:()=>{const l=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return pa(e,l)},onBindDefault:l=>{l?Bt(e,["tools","exec","node"],l):Ga(e,["tools","exec","node"])},onBindAgent:(l,p)=>{const v=["agents","list",l,"tools","exec","node"];p?Bt(e,v,p):Ga(e,v)},onSaveBindings:()=>Jn(e),onExecApprovalsTargetChange:(l,p)=>{e.execApprovalsTarget=l,e.execApprovalsTargetNodeId=p,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:l=>{e.execApprovalsSelectedAgent=l},onExecApprovalsPatch:(l,p)=>Pg(e,l,p),onExecApprovalsRemove:l=>Rg(e,l),onSaveExecApprovals:()=>{const l=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Lg(e,l)}}):h}

        ${e.tab==="chat"&&e.workspaceNeedsSetup&&!e.chatMessages?.length?r`
                  <div class="workspace-welcome-banner">
                    <div class="welcome-content">
                      <div class="welcome-title">Welcome to GodMode</div>
                      <div class="welcome-subtitle">
                        Set up your workspace through a quick conversation — projects, people, goals,
                        and integrations.
                      </div>
                      <button
                        class="welcome-cta"
                        @click=${()=>{e.workspaceNeedsSetup=!1,e.chatMessage="Set up my GodMode workspace",e.handleSendChat("Set up my GodMode workspace")}}
                      >
                        Start Setup
                      </button>
                      <button
                        class="welcome-skip"
                        @click=${()=>{e.workspaceNeedsSetup=!1}}
                      >
                        Skip for now
                      </button>
                    </div>
                  </div>
                `:h}

        ${e.tab==="chat"?My({basePath:e.basePath,sessionKey:e.sessionKey,onSessionKeyChange:l=>{Ke(e),e.sessionKey=l,Ze(e,l),e.chatLoading=!0,e.chatMessages=[],e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:l,lastActiveSessionKey:l}),e.loadAssistantIdentity(),ce(e).then(()=>{e.resetChatScroll(),fe(e,!0)}),ls(e),e.loadSessionResources(),as(e)},thinkingLevel:e.chatThinkingLevel,showThinking:a,loading:e.chatLoading,sending:e.chatSending,sendingSessionKey:e.chatSendingSessionKey,compactionStatus:e.compactionStatus,assistantAvatarUrl:c,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:n,error:e.lastError,sessions:e.sessionsResult,focusMode:i,onRefresh:()=>(e.resetToolStream(),e.loadSessionResources(),as(e),Promise.all([ce(e),ls(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:l=>e.handleChatScroll(l),onDraftChange:l=>e.chatMessage=l,attachments:e.chatAttachments,onAttachmentsChange:l=>e.chatAttachments=l,showToast:(l,p)=>e.showToast(l,p),onSend:l=>e.handleSendChat(void 0,{queue:l}),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onCompact:()=>{e.handleCompactChat()},pendingRetry:e.pendingRetry,onRetry:()=>{e.handleRetryMessage()},onClearRetry:()=>e.handleClearRetry(),onQueueRemove:l=>e.removeQueuedMessage(l),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,sidebarMimeType:e.sidebarMimeType,sidebarFilePath:e.sidebarFilePath,sidebarTitle:e.sidebarTitle,sidebarMode:e.sidebarMode,sidebarProofSlug:e.sidebarProofSlug,sidebarProofUrl:e.sidebarProofUrl,sidebarProofHtml:e.sidebarProofHtml,splitRatio:e.splitRatio,onOpenSidebar:(l,p)=>e.handleOpenSidebar(l,p),onMessageLinkClick:l=>e.handleOpenMessageFileLink(l),onCloseSidebar:()=>e.handleCloseSidebar(),onOpenProof:l=>{e.handleOpenProofDoc(l)},onOpenFile:l=>e.handleOpenFile(l),onSplitRatioChange:l=>e.handleSplitRatioChange(l),onPushToDrive:(l,p)=>e.handlePushToDrive(l,p),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker(),onImageClick:(l,p,v)=>e.handleImageClick(l,p,v),resolveImageUrl:(l,p)=>If(e.sessionKey,l,p),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,userName:e.userName,userAvatar:e.userAvatar,currentToolName:e.currentToolName,currentToolInfo:e.currentToolInfo,privateMode:e.chatPrivateMode,onTogglePrivateMode:()=>e.handlePrivateModeToggle(),isWorking:e.workingSessions.has(e.sessionKey),showScrollButton:!e.chatUserNearBottom,showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>{const l=document.querySelector(".chat-thread");l&&(l.scrollTo({top:l.scrollHeight,behavior:"smooth"}),e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1)},allyPanelOpen:e.allyPanelOpen??!1,allyProps:e.allyPanelOpen?{allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:!0,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:0,connected:e.connected,compact:!0,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:l=>e.handleAllyDraftChange(l),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:l=>e.handleAllyAttachmentsChange(l),onAction:(l,p,v,y)=>e.handleAllyAction(l,p,v,y)}:null,sessionResources:e.sessionResources,sessionResourcesCollapsed:e.sessionResourcesCollapsed,onToggleSessionResources:()=>e.handleToggleSessionResources(),onSessionResourceClick:l=>e.handleSessionResourceClick(l),onViewAllResources:()=>e.handleViewAllResources()}):h}

        ${e.tab==="options"?o0({connected:e.connected,loading:e.godmodeOptionsLoading,options:e.godmodeOptions,onToggle:(l,p)=>e.handleOptionToggle(l,p),onOpenWizard:e.handleWizardOpen?()=>e.handleWizardOpen?.():void 0}):h}

        ${e.tab==="guardrails"?Q0({connected:e.connected,loading:e.guardrailsLoading,data:e.guardrailsData,showAddForm:e.guardrailsShowAddForm,onToggle:(l,p)=>e.handleGuardrailToggle(l,p),onThresholdChange:(l,p,v)=>e.handleGuardrailThresholdChange(l,p,v),onCustomToggle:(l,p)=>e.handleCustomGuardrailToggle(l,p),onCustomDelete:l=>e.handleCustomGuardrailDelete(l),onToggleAddForm:()=>e.handleToggleGuardrailAddForm(),onOpenAllyChat:l=>{e.handleAllyToggle(),l&&e.handleAllyDraftChange(l)}}):h}

        ${e.tab==="trust"?W0({connected:e.connected,loading:e.trustTrackerLoading,data:e.trustTrackerData,onAddWorkflow:l=>e.handleTrustAddWorkflow(l),onRemoveWorkflow:l=>e.handleTrustRemoveWorkflow(l),onRefresh:()=>e.handleTrustLoad(),guardrailsData:e.guardrailsData,consciousnessStatus:e.consciousnessStatus,sessionsCount:t,gatewayUptimeMs:e.hello?.snapshot?.uptimeMs??null,onDailyRate:(l,p)=>e.handleDailyRate(l,p),updateStatus:e.updateStatus?{openclawUpdateAvailable:e.updateStatus.openclawUpdateAvailable,pluginUpdateAvailable:e.updateStatus.pluginUpdateAvailable,openclawVersion:e.updateStatus.openclawVersion,pluginVersion:e.updateStatus.pluginVersion,openclawLatest:e.updateStatus.openclawLatest,pluginLatest:e.updateStatus.pluginLatest}:null}):h}

        ${e.tab==="second-brain"?(zn("gm-second-brain"),r`<gm-second-brain></gm-second-brain>`):h}

        ${e.tab==="dashboards"?(zn("gm-dashboards"),r`<gm-dashboards></gm-dashboards>`):h}

        ${e.tab==="config"?Gy({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:l=>{e.configRaw=l},onFormModeChange:l=>e.configFormMode=l,onFormPatch:(l,p)=>Bt(e,l,p),onSearchChange:l=>e.configSearchQuery=l,onSectionChange:l=>{e.configActiveSection=l,e.configActiveSubsection=null},onSubsectionChange:l=>e.configActiveSubsection=l,onReload:()=>ze(e),onSave:()=>Jn(e),onApply:()=>Md(e),onUpdate:()=>Dd(e),userName:e.userName||"",userAvatar:e.userAvatar,onUserProfileUpdate:(l,p)=>e.handleUpdateUserProfile(l,p),onModelSwitch:(l,p)=>Od(e,l,p)}):h}

        ${e.tab==="debug"?cb({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:l=>e.debugCallMethod=l,onCallParamsChange:l=>e.debugCallParams=l,onRefresh:()=>bs(e),onCall:()=>Jf(e)}):h}

        ${e.tab==="logs"?yb({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:l=>e.logsFilterText=l,onLevelToggle:(l,p)=>{e.logsLevelFilters={...e.logsLevelFilters,[l]:p}},onToggleAutoFollow:l=>e.logsAutoFollow=l,onRefresh:()=>aa(e,{reset:!0}),onExport:(l,p)=>e.exportLogs(l,p),onScroll:l=>e.handleLogsScroll(l)}):h}
      </main>
      ${e.tab!=="chat"?hv({allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:e.allyPanelOpen??!1,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:e.allyUnread??0,connected:e.connected,compact:!1,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:l=>e.handleAllyDraftChange(l),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:l=>e.handleAllyAttachmentsChange(l),onAction:(l,p,v,y)=>e.handleAllyAction(l,p,v,y)}):h}
      ${ub(e)}
      ${pb(e)}
      ${hb(e)}
      ${e.sidebarOpen&&e.tab!=="chat"?r`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${()=>e.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${Oi({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:()=>e.handleCloseSidebar(),onViewRawText:()=>{e.sidebarContent&&e.handleOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath,title:e.sidebarTitle})},onOpenFile:l=>e.handleOpenFile(l),onPushToDrive:(l,p)=>e.handlePushToDrive(l,p),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker()})}
              </div>
            </div>
          `:h}
      ${s0({toasts:e.toasts,onDismiss:l=>e.dismissToast(l)})}
      ${t0(e.lightbox,{onClose:()=>e.handleLightboxClose(),onNav:l=>e.handleLightboxNav(l)})}
    </div>
  `}async function sS(e){}async function iS(e){}async function aS(e,t){}async function oS(e){}async function rS(e){}async function lS(e){}async function Ea(e){if(!(!e.client||!e.connected)){e.trustTrackerLoading=!0;try{const[t,n]=await Promise.all([e.client.request("trust.dashboard",{}),e.client.request("trust.history",{limit:50})]);e.trustTrackerData={workflows:t.workflows,summaries:t.summaries,ratings:n.ratings,total:n.total,overallScore:t.overallScore,totalRatings:t.totalRatings,totalUses:t.totalUses,todayRating:t.todayRating??null,dailyAverage:t.dailyAverage??null,dailyStreak:t.dailyStreak??0,recentDaily:t.recentDaily??[]}}catch{e.trustTrackerData=null}finally{e.trustTrackerLoading=!1}}}async function rd(e,t){if(!(!e.client||!e.connected))try{await e.client.request("trust.workflows.set",{workflows:t}),e.showToast("Workflows updated","success",2e3),await Ea(e)}catch(n){e.showToast("Failed to update workflows","error"),console.error("[TrustTracker] setWorkflows error:",n)}}async function cS(e,t){const n=e.trustTrackerData?.workflows??[];if(n.length>=5){e.showToast("Maximum 5 workflows allowed","error");return}if(n.includes(t.trim())){e.showToast("Workflow already tracked","error");return}await rd(e,[...n,t.trim()])}async function dS(e,t){const n=e.trustTrackerData?.workflows??[];await rd(e,n.filter(s=>s!==t))}async function uS(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("trust.dailyRate",{rating:t,...n?{note:n}:{}}),e.showToast(`Rated ${t}/10 today`,"success",2e3),await Ea(e)}catch(s){e.showToast("Failed to submit daily rating","error"),console.error("[TrustTracker] dailyRate error:",s)}}const pS=6e4,_r=15,Cr=new Set;let Qn=null;async function Er(e){if(!(!e.client||!e.connected))try{const t=new Date,n=new Date(t.getTime()+_r*6e4+6e4),s=await e.client.request("calendar.events.range",{startDate:t.toISOString(),endDate:n.toISOString()});for(const i of s.events??[]){if(Cr.has(i.id))continue;const a=new Date(i.startTime),o=Math.round((a.getTime()-t.getTime())/6e4);if(o>0&&o<=_r){Cr.add(i.id);const c=a.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),d=i.location?` @ ${i.location}`:"",u=`${i.title} starts in ${o} min (${c})${d}`;e.showToast(u,"warning",0)}}}catch(t){console.warn("[MeetingNotify] Poll error:",t)}}function hS(e){ld(),Er(e),Qn=setInterval(()=>{Er(e)},pS)}function ld(){Qn&&(clearInterval(Qn),Qn=null)}let fS=0;function gS(e,t="info",n=3e3,s){return{id:`toast-${Date.now()}-${fS++}`,message:e,type:t,duration:n,createdAt:Date.now(),action:s}}function mS(e,t){return e.filter(n=>n.id!==t)}function vS(e,t){return[...e,t]}var yS=Object.defineProperty,bS=Object.getOwnPropertyDescriptor,g=(e,t,n,s)=>{for(var i=s>1?void 0:s?bS(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&yS(t,n,i),i};function gi(){return bh()}function Wn(){return Sh()}function wS(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}function SS(e,t){let n=e.trim();if(!n)return null;if(n.startsWith("Read HEARTBEAT.md")||n.startsWith("Read CONSCIOUSNESS.md")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(n)||n==="NO_REPLY"||n.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(n)||n.startsWith("# WORKING.md")||n.startsWith("# MISTAKES.md"))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/(?:VERIFIED|FIXED|NEW):\s/.test(n)&&/✅|🟡|☑/.test(n)&&n.length>300)return console.debug("[Ally] Filtered message (verification dump):",t,n.substring(0,100)),null;if(/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(n))return console.debug("[Ally] Filtered message (system block):",t,n.substring(0,100)),null;if(/^\[GodMode Context:[^\]]*\]\s*$/.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(n=n.replace(/^(?:HEARTBEAT_OK|CONSCIOUSNESS_OK)\s*/i,"").trim(),n=n.replace(/^Deep work window is yours\.\s*/i,"").trim(),!n)return null;if(/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(n)&&n.length>200||/^##\s*Your Team\s*\(Agent Roster\)/i.test(n)&&n.indexOf(`

## `)===-1)return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/^##?\s*Persistence Protocol/i.test(n)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(n)||/^##?\s*Core (?:Behaviors|Principles)/i.test(n)||/^##?\s*Your Role as \w+/i.test(n))return console.debug("[Ally] Filtered message (persona leak):",t,n.substring(0,100)),null;const s=n.toLowerCase();if(["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"].filter(o=>s.includes(o)).length>=2)return console.debug("[Ally] Filtered message (multi-signal system leak):",t,n.substring(0,100)),null;if(/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;const a=n.match(/\b[\w.-]+\.(?:json\b|db\b|html\b|log\b|flag\b|jsonl\b|bak\b|css\b|js\b|ts\b|md\b|txt\b)/gi);return a&&a.length>=8&&a.join(" ").length>n.length*.4?(console.debug("[Ally] Filtered message (file listing dump):",t,n.substring(0,100)),null):n}const Lr=new Set(["chat","today","workspaces","work","data","overview","channels","instances","sessions","cron","skills","nodes","config","debug","logs","my-day"]),kS=["path","filePath","file","workspacePath"];let f=class extends Pr{constructor(){super(...arguments),this._ctx=Cd(),this.settings=bm(),this.password="",this.tab="chat",this.onboarding=wS(),this.connected=!1,this.reconnecting=!1,this.reconnectAttempt=0,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.sessionPickerClickOutsideHandler=null,this.sessionSearchClickOutsideHandler=null,this.assistantName=gi().name,this.assistantAvatar=gi().avatar,this.assistantAgentId=gi().agentId??null,this.userName=Wn().name,this.userAvatar=Wn().avatar,this.sessionKey=this.settings.sessionKey,this.sessionPickerOpen=!1,this.sessionPickerPosition=null,this.sessionPickerSearch="",this.sessionSearchOpen=!1,this.sessionSearchPosition=null,this.sessionSearchQuery="",this.sessionSearchResults=[],this.sessionSearchLoading=!1,this.profilePopoverOpen=!1,this.profileEditName="",this.profileEditAvatar="",this.editingTabKey=null,this.chatLoading=!1,this.chatSending=!1,this.chatSendingSessionKey=null,this.chatMessage="",this.chatDrafts={},this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.currentToolName=null,this.currentToolInfo=null,this.workingSessions=new Set,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.pendingRetry=null,this.autoRetryAfterCompact=!1,this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.splitRatio=this.settings.splitRatio,this.lightbox=nd(),this.driveAccounts=[],this.showDrivePicker=!1,this.driveUploading=!1,this.updateStatus=null,this.updateLoading=!1,this.updateError=null,this.updateLastChecked=null,this.updatePollInterval=null,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.gatewayRestartPending=!1,this.gatewayRestartBusy=!1,this.deployPanelOpen=!1,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.archivedSessions=[],this.archivedSessionsLoading=!1,this.archivedSessionsExpanded=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...Dm},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.workspaceNeedsSetup=!1,this.onboardingPhase=0,this.onboardingData=null,this.onboardingActive=!1,this.wizardActive=!1,this.wizardState=null,this.showSetupTab=!1,this.setupCapabilities=null,this.setupCapabilitiesLoading=!1,this.setupQuickDone=!1,this.onboardingIntegrations=null,this.onboardingCoreProgress=null,this.onboardingExpandedCard=null,this.onboardingLoadingGuide=null,this.onboardingActiveGuide=null,this.onboardingTestingId=null,this.onboardingTestResult=null,this.onboardingConfigValues={},this.onboardingProgress=null,this.selectedWorkspace=null,this.workspacesSearchQuery="",this.workspaceItemSearchQuery="",this.workspacesLoading=!1,this.workspacesCreateLoading=!1,this.workspacesError=null,this.workspaceExpandedFolders=new Set,this.editingTaskId=null,this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null,this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=ie(),this.todayViewMode="brief",this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.todayEditingTaskId=null,this.todayShowCompleted=!1,this.allyPanelOpen=!1,this.allyMessages=[],this.allyStream=null,this.allyDraft="",this.allyUnread=0,this.allySending=!1,this.allyWorking=!1,this.allyAttachments=[],this.todayQueueResults=[],this.inboxItems=[],this.inboxLoading=!1,this.inboxCount=0,this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,this.inboxSortOrder="newest",this.trustSummary=null,this.chatPrivateMode=!1,this.privateSessions=new Map,this._privateSessionTimer=null,this.dynamicSlots={},this.workLoading=!1,this.workError=null,this.workExpandedProjects=new Set,this.workProjectFiles={},this.workDetailLoading=new Set,this.workResourcesLoading=!1,this.workResourceFilter="all",this.sessionResources=[],this.sessionResourcesCollapsed=!1,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.skillsSubTab="godmode",this.godmodeSkills=null,this.godmodeSkillsLoading=!1,this.expandedSkills=new Set,this.rosterData=[],this.rosterLoading=!1,this.rosterError=null,this.rosterFilter="",this.expandedAgents=new Set,this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...Mm},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.toasts=[],this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatIsAutoScrolling=!1,this.chatNewMessagesBelow=!1,this.consciousnessStatus="idle",this.focusPulseData=null,this.trustTrackerData=null,this.trustTrackerLoading=!1,this.guardrailsData=null,this.guardrailsLoading=!1,this.guardrailsShowAddForm=!1,this.missionControlData=null,this.missionControlLoading=!1,this.missionControlError=null,this.missionControlFullControl=(()=>{try{return localStorage.getItem("godmode.mc.fullControl")==="1"}catch{return!0}})(),this.missionControlPollInterval=null,this.godmodeOptions=null,this.godmodeOptionsLoading=!1,this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardPreviousSessionKey=null,this.dashboardChatOpen=!1,this.dashboardCategoryFilter=null,this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainVaultHealth=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=!1,this.basePath="",this.popStateHandler=()=>Sc(this),this.keydownHandler=()=>{},this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null}createRenderRoot(){return this}connectedCallback(){if(super.connectedCallback(),this.settings.userName)this.userName=this.settings.userName;else{const t=Wn();this.userName=t.name}if(this.settings.userAvatar)this.userAvatar=this.settings.userAvatar;else{const t=Wn();this.userAvatar=t.avatar}Ym(this);const e=ie();this.todaySelectedDate!==e&&(this.todaySelectedDate=e),hS(this),this._restorePrivateSessions()}firstUpdated(){Qm(this)}disconnectedCallback(){ld(),this._stopPrivateSessionTimer(),Jm(this),super.disconnectedCallback()}updated(e){Zm(this,e),this._syncContext()}_syncContext(){const e=this._ctx;e.connected===this.connected&&e.reconnecting===this.reconnecting&&e.sessionKey===this.sessionKey&&e.assistantName===this.assistantName&&e.assistantAvatar===this.assistantAvatar&&e.userName===this.userName&&e.userAvatar===this.userAvatar&&e.theme===this.theme&&e.themeResolved===this.themeResolved&&e.settings===this.settings&&e.basePath===this.basePath&&e.gateway===this.client||(this._ctx={connected:this.connected,reconnecting:this.reconnecting,sessionKey:this.sessionKey,assistantName:this.assistantName,assistantAvatar:this.assistantAvatar,userName:this.userName,userAvatar:this.userAvatar,theme:this.theme,themeResolved:this.themeResolved,settings:this.settings,basePath:this.basePath,gateway:this.client,send:(t,n)=>this.client?.request(t,n)??Promise.reject(new Error("Not connected")),setTab:t=>this.setTab(t),addToast:(t,n)=>this.showToast(t,n??"info"),openSidebar:t=>this.handleOpenSidebar(t.content,{title:t.title,mimeType:t.mimeType,filePath:t.filePath}),closeSidebar:()=>this.handleCloseSidebar()})}connect(){ia(this)}handleChatScroll(e){Zd(this,e)}handleLogsScroll(e){eu(this,e)}exportLogs(e,t){tu(e,t)}resetToolStream(){Wi(this),this.sessionResources=[]}resetChatScroll(){hs(this)}async loadAssistantIdentity(){await dl(this)}applySettings(e){We(this,e)}setTab(e){va(this,e)}setTheme(e,t){gc(this,e,t)}async loadOverview(){await wa(this)}async loadCron(){await Ts(this)}async handleAbortChat(){await Sa(this)}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}async loadFocusPulse(){await sS()}async handleFocusPulseStartMorning(){await iS(),this.setTab("chat");const e="Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan.",{createNewSession:t}=await E(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>Ye);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e)}async handleFocusPulseSetFocus(e){await aS()}async handleFocusPulseComplete(){await oS()}async handleFocusPulsePulseCheck(){await rS()}async handleFocusPulseEndDay(){await lS()}async handleTrustLoad(){await Ea(this)}async handleTrustAddWorkflow(e){await cS(this,e)}async handleTrustRemoveWorkflow(e){await dS(this,e)}async handleDailyRate(e,t){await uS(this,e,t)}async handleGuardrailsLoad(){const{loadGuardrails:e}=await E(async()=>{const{loadGuardrails:t}=await Promise.resolve().then(()=>Ot);return{loadGuardrails:t}},void 0,import.meta.url);await e(this)}async handleGuardrailToggle(e,t){const{toggleGuardrail:n}=await E(async()=>{const{toggleGuardrail:s}=await Promise.resolve().then(()=>Ot);return{toggleGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleGuardrailThresholdChange(e,t,n){const{updateGuardrailThreshold:s}=await E(async()=>{const{updateGuardrailThreshold:i}=await Promise.resolve().then(()=>Ot);return{updateGuardrailThreshold:i}},void 0,import.meta.url);await s(this,e,t,n)}async handleCustomGuardrailToggle(e,t){const{toggleCustomGuardrail:n}=await E(async()=>{const{toggleCustomGuardrail:s}=await Promise.resolve().then(()=>Ot);return{toggleCustomGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleCustomGuardrailDelete(e){const{deleteCustomGuardrail:t}=await E(async()=>{const{deleteCustomGuardrail:n}=await Promise.resolve().then(()=>Ot);return{deleteCustomGuardrail:n}},void 0,import.meta.url);await t(this,e)}async handleCustomGuardrailAdd(e){const{addCustomGuardrailFromUI:t}=await E(async()=>{const{addCustomGuardrailFromUI:n}=await Promise.resolve().then(()=>Ot);return{addCustomGuardrailFromUI:n}},void 0,import.meta.url);await t(this,e),this.guardrailsShowAddForm=!1}handleToggleGuardrailAddForm(){this.guardrailsShowAddForm=!this.guardrailsShowAddForm}handleMissionControlToggleFullControl(){this.missionControlFullControl=!this.missionControlFullControl;try{localStorage.setItem("godmode.mc.fullControl",this.missionControlFullControl?"1":"0")}catch{}}async handleMissionControlRefresh(){const{loadMissionControl:e}=await E(async()=>{const{loadMissionControl:t}=await Promise.resolve().then(()=>Ge);return{loadMissionControl:t}},void 0,import.meta.url);await e(this)}async handleMissionControlCancelTask(e){const{cancelCodingTask:t}=await E(async()=>{const{cancelCodingTask:n}=await Promise.resolve().then(()=>Ge);return{cancelCodingTask:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlApproveItem(e){const{approveCodingTask:t,approveQueueItem:n}=await E(async()=>{const{approveCodingTask:i,approveQueueItem:a}=await Promise.resolve().then(()=>Ge);return{approveCodingTask:i,approveQueueItem:a}},void 0,import.meta.url);await t(this,e)||await n(this,e)}async handleMissionControlRetryItem(e){const{retryQueueItem:t}=await E(async()=>{const{retryQueueItem:n}=await Promise.resolve().then(()=>Ge);return{retryQueueItem:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlViewDetail(e){const{loadAgentDetail:t}=await E(async()=>{const{loadAgentDetail:s}=await Promise.resolve().then(()=>Ge);return{loadAgentDetail:s}},void 0,import.meta.url),n=await t(this,e);this.handleOpenSidebar(n.content,{mimeType:n.mimeType,title:n.title})}async handleMissionControlOpenSession(e){const t=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:t,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:n}=await E(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>Be);return{loadChatHistory:s}},void 0,import.meta.url);await n(this),this.loadSessionResources()}async handleMissionControlOpenTaskSession(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e});if(t?.sessionId){if(t.task?.title){const{autoTitleCache:n}=await E(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>on);return{autoTitleCache:s}},void 0,import.meta.url);n.set(t.sessionId,t.task.title)}await this.handleMissionControlOpenSession(t.sessionId),t.queueOutput&&this.chatMessages.length===0&&await this.seedSessionWithAgentOutput(t.task?.title??"task",t.queueOutput,t.agentPrompt??void 0)}}catch(t){console.error("[MissionControl] Failed to open task session:",t),this.showToast("Failed to open session","error")}}async handleMissionControlStartQueueItem(e){await this.handleMissionControlOpenTaskSession(e)}async handleSwarmSelectProject(e){const{selectSwarmProject:t}=await E(async()=>{const{selectSwarmProject:n}=await Promise.resolve().then(()=>Ge);return{selectSwarmProject:n}},void 0,import.meta.url);await t(this,e)}async handleSwarmSteer(e,t,n){const{steerSwarmAgent:s}=await E(async()=>{const{steerSwarmAgent:i}=await Promise.resolve().then(()=>Ge);return{steerSwarmAgent:i}},void 0,import.meta.url);await s(this,e,t,n)}async handleSwarmViewProofDoc(e){return this.handleOpenProofDoc(e)}async handleSwarmViewRunLog(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("godmode.delegation.runLog",{queueItemId:e});t?.content?this.handleOpenSidebar(t.content,{mimeType:t.mimeType??"text/markdown",title:t.title??"Agent Logs"}):this.showToast("No logs available","error")}catch{this.showToast("Failed to load agent logs","error")}}async handleMissionControlViewTaskFiles(e){try{const n=(await this.client?.request("queue.taskFiles",{itemId:e}))?.files??[];if(n.length===0){this.showToast("No files found for this task","info");return}const i=`## Task Files

${n.map(a=>`- **${a.name}** (${a.type}, ${(a.size/1024).toFixed(1)} KB)
  \`${a.path}\``).join(`

`)}`;this.handleOpenSidebar(i,{title:"Task Files"})}catch(t){console.error("Failed to load task files:",t),this.showToast("Failed to load task files","error")}}async handleAllyAction(e,t,n,s){if(e==="navigate"&&t)this.setTab(t);else if(e==="rpc"&&n&&this.client)try{await this.client.request(n,s??{}),this.showToast("Done","success",2e3)}catch(i){console.error("[Ally] Action RPC failed:",i),this.showToast("Action failed","error")}}handleAllyToggle(){this.allyPanelOpen=!this.allyPanelOpen,this.allyPanelOpen&&(this.allyUnread=0,this._loadAllyHistory().then(()=>{this._scrollAllyToBottom(),requestAnimationFrame(()=>this._scrollAllyToBottom())}))}handleAllyDraftChange(e){this.allyDraft=e}handleAllyAttachmentsChange(e){this.allyAttachments=e}async handleAllySend(){const e=this.allyDraft.trim(),t=this.allyAttachments;if(!e&&t.length===0||this.allySending)return;const n=lu(this);let s=e?`${n}

${e}`:n;this.allyDraft="",this.allyAttachments=[],this.allySending=!0,this.allyMessages=[...this.allyMessages,{role:"user",content:e||"(image)",timestamp:Date.now()}];try{let i;if(t.length>0){const d=[];for(const u of t){if(!u.dataUrl)continue;const l=u.dataUrl.match(/^data:([^;]+);base64,(.+)$/);if(!l)continue;const[,p,v]=l;p.startsWith("image/")&&d.push({type:"image",mimeType:p,content:v,fileName:u.fileName})}if(d.length>0){i=d;try{await this.client?.request("images.cache",{images:d.map(u=>({data:u.content,mimeType:u.mimeType,fileName:u.fileName})),sessionKey:V})}catch{}}}const a=`ally-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;try{await this.client?.request("sessions.patch",{key:V,lastChannel:"webchat"})}catch{}await this.client?.request("agent",{sessionKey:V,message:s,deliver:!1,channel:"webchat",idempotencyKey:a,attachments:i}),this.allyWorking=!0;const o=this.allyMessages[this.allyMessages.length-1]?.content,c=setInterval(async()=>{if(!this.allyWorking){clearInterval(c);return}try{await this._loadAllyHistory();const d=this.allyMessages[this.allyMessages.length-1];d&&d.role==="assistant"&&d.content!==o&&(this.allyWorking=!1,this.allyStream=null,clearInterval(c),this._scrollAllyToBottom())}catch{}},5e3);setTimeout(()=>clearInterval(c),12e4)}catch(i){const a=i instanceof Error?i.message:String(i);console.error("[Ally] Failed to send ally message:",a),this.allyMessages=[...this.allyMessages,{role:"assistant",content:`*Send failed: ${a}*`,timestamp:Date.now()}]}finally{this.allySending=!1}}handleAllyOpenFull(){this.allyPanelOpen=!1,this.setTab("chat"),this.applySettings({...this.settings,sessionKey:V,lastActiveSessionKey:V,tabLastViewed:{...this.settings.tabLastViewed,[V]:Date.now()}}),this.sessionKey=V,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),E(async()=>{const{loadChatHistory:e}=await Promise.resolve().then(()=>Be);return{loadChatHistory:e}},void 0,import.meta.url).then(({loadChatHistory:e})=>e(this)),this.loadSessionResources()}_scrollAllyToBottom(){this.updateComplete.then(()=>{requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector?.(".ally-panel, .ally-inline")??document.querySelector(".ally-panel, .ally-inline");if(!e)return;const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)})})}async _loadAllyHistory(){try{const e=await this.client?.request("chat.history",{sessionKey:V,limit:100});if(e?.messages){const{extractText:t,formatApiError:n}=await E(async()=>{const{extractText:i,formatApiError:a}=await Promise.resolve().then(()=>xp);return{extractText:i,formatApiError:a}},void 0,import.meta.url);this.allyMessages=e.messages.map(i=>{const a=i.role??"assistant",o=a.toLowerCase();if(o==="tool"||o==="toolresult"||o==="tool_result"||o==="function"||o==="system")return null;const c=i;if(c.toolCallId||c.tool_call_id||c.toolName||c.tool_name)return null;if(Array.isArray(i.content)){const p=i.content;if(!p.some(y=>{const b=(typeof y.type=="string"?y.type:"").toLowerCase();return(b==="text"||b==="")&&typeof y.text=="string"&&y.text.trim().length>0})&&p.some(b=>{const k=(typeof b.type=="string"?b.type:"").toLowerCase();return k==="tool_use"||k==="tool_result"||k==="toolresult"||k==="tooluse"}))return null}let d=t(i);if(!d)return null;const u=n(d);if(u&&(d=u),d=d.replace(/^\[GodMode Context:[^\]]*\]\s*/i,"").trim(),!d)return null;const l=SS(d,a);return l?{role:o==="user"?"user":"assistant",content:l,timestamp:i.timestamp}:null}).filter(i=>i!==null);const s=[];for(const i of this.allyMessages){const a=s[s.length-1];a&&a.role===i.role&&a.content===i.content||s.push(i)}this.allyMessages=s}}catch{}}async handleDecisionApprove(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.approve",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Approve failed:",t),this.showToast("Failed to approve","error")}}async handleDecisionReject(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.reject",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Reject failed:",t),this.showToast("Failed to reject","error")}}async handleDecisionDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Dismiss failed:",t),this.showToast("Failed to dismiss","error")}}async handleDecisionMarkComplete(e){if(!(!this.client||!this.connected))try{const t=this.todayQueueResults?.find(n=>n.id===e);t?.sourceTaskId&&await this.client.request("tasks.update",{id:t.sourceTaskId,status:"complete"}),await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(n=>n.id!==e),this.showToast("Task marked complete","success")}catch(t){console.error("[DecisionCard] Mark complete failed:",t),this.showToast("Failed to mark complete","error")}}async handleDecisionRate(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("trust.rate",{workflow:t,rating:n});const s=n<7;this.todayQueueResults=this.todayQueueResults.map(i=>i.id===e?{...i,userRating:n,feedbackPending:s}:i),s?this.showToast(`Rated ${t} ${n}/10 — what could be better?`,"info"):(this.todayQueueResults?.find(a=>a.id===e)?.source==="cron"&&(await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(a=>a.id!==e)),this.showToast(`Rated ${t} ${n}/10`,"success"))}catch(s){console.error("[DecisionCard] Rate failed:",s),this.showToast("Failed to submit rating","error")}}async handleDecisionFeedback(e,t,n){if(!(!this.client||!this.connected))try{n&&(await this.client.request("trust.feedback",{workflow:t,feedback:n}),this.showToast(`Feedback saved for ${t} — will apply next time`,"success")),this.todayQueueResults?.find(i=>i.id===e)?.source==="cron"&&await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.map(i=>i.id===e?{...i,feedbackPending:!1}:i).filter(i=>!(i.id===e&&i.source==="cron"))}catch(s){console.error("[DecisionCard] Feedback failed:",s),this.showToast("Failed to save feedback","error")}}async handleDecisionViewOutput(e,t){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const n=await this.client.request("queue.readOutput",{path:t}),s=t.split("/").pop()??"Agent Output";this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t,title:s})}catch(n){console.error("[DecisionCard] View output failed:",n),this.handleOpenFile(t)}}async handleDecisionOpenChat(e){const t=this.todayQueueResults?.find(i=>i.id===e);if(!t)return;if(t.sourceTaskId){await this.handleMissionControlOpenTaskSession(t.sourceTaskId);return}const{createNewSession:n}=await E(async()=>{const{createNewSession:i}=await Promise.resolve().then(()=>Ye);return{createNewSession:i}},void 0,import.meta.url);n(this),this.setTab("chat");const{autoTitleCache:s}=await E(async()=>{const{autoTitleCache:i}=await Promise.resolve().then(()=>on);return{autoTitleCache:i}},void 0,import.meta.url);if(s.set(this.sessionKey,t.title),t.outputPath&&this.client&&this.connected)try{const i=await this.client.request("queue.readOutput",{path:t.outputPath});i?.content&&await this.seedSessionWithAgentOutput(t.title,i.content)}catch{await this.seedSessionWithAgentOutput(t.title,t.summary)}else t.summary&&await this.seedSessionWithAgentOutput(t.title,t.summary)}async handleTodayOpenChatToEdit(e){try{const t=this.todayQueueResults?.find(s=>s.id===e),n=t?.outputPath;if(n&&this.client&&this.connected)try{const s=await this.client.request("queue.readOutput",{path:n});this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n,title:t?.title??n.split("/").pop()??"Agent Output"})}catch{await this.handleOpenFile(n)}this.allyPanelOpen=!0,this.allyUnread=0,this.tab!=="chat"&&this.setTab("chat")}catch(t){console.error("Open chat to edit failed:",t)}}async seedSessionWithAgentOutput(e,t,n){if(!this.client||!this.connected)return;this.handleOpenSidebar(t,{title:`Agent Output: ${e}`,filePath:null,mimeType:null});const s=t.match(/## Summary\n([\s\S]*?)(?=\n## |$)/),i=s?s[1].trim().split(`
`).slice(0,3).join(`
`):"Output available in sidebar.",a=[`Agent completed **${e}**.`,"",i,"","Full output is in the sidebar. What would you like to do?"].join(`
`);try{const{sendChatMessage:o}=await E(async()=>{const{sendChatMessage:c}=await Promise.resolve().then(()=>Be);return{sendChatMessage:c}},void 0,import.meta.url);await o(this,a)}catch(o){console.error("[Session] Failed to seed session with agent output:",o)}}async handleMissionControlAddToQueue(e,t){if(!(!this.client||!this.connected))try{await this.client.request("queue.add",{type:e,title:t,priority:"normal"}),this.showToast("Added to queue","success",2e3);const{loadMissionControl:n}=await E(async()=>{const{loadMissionControl:s}=await Promise.resolve().then(()=>Ge);return{loadMissionControl:s}},void 0,import.meta.url);await n(this)}catch{this.showToast("Failed to add to queue","error")}}async handleDashboardsRefresh(){const{loadDashboards:e}=await E(async()=>{const{loadDashboards:t}=await import("./dashboards-CrT3s0NG.js");return{loadDashboards:t}},[],import.meta.url);await e(this)}async handleDashboardSelect(e){const{loadDashboard:t}=await E(async()=>{const{loadDashboard:n}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:n}},[],import.meta.url);if(await t(this,e),this.client&&this.connected)try{const n=await this.client.request("dashboards.openSession",{dashboardId:e});if(n?.sessionId){this.dashboardPreviousSessionKey=this.sessionKey;const s=n.sessionId,{autoTitleCache:i}=await E(async()=>{const{autoTitleCache:c}=await Promise.resolve().then(()=>on);return{autoTitleCache:c}},void 0,import.meta.url);i.set(s,n.manifest.title),this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:s});const{saveDraft:a}=await E(async()=>{const{saveDraft:c}=await Promise.resolve().then(()=>ai);return{saveDraft:c}},void 0,import.meta.url);a(this),this.sessionKey=s,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream();const{loadChatHistory:o}=await E(async()=>{const{loadChatHistory:c}=await Promise.resolve().then(()=>Be);return{loadChatHistory:c}},void 0,import.meta.url);await o(this),this.loadSessionResources(),this.dashboardChatOpen=!0}}catch(n){console.error("[Dashboards] Failed to init session on select:",n)}}async handleDashboardDelete(e){const{deleteDashboard:t}=await E(async()=>{const{deleteDashboard:n}=await import("./dashboards-CrT3s0NG.js");return{deleteDashboard:n}},[],import.meta.url);await t(this,e)}async handleDashboardTogglePin(e){const{toggleDashboardPin:t}=await E(async()=>{const{toggleDashboardPin:n}=await import("./dashboards-CrT3s0NG.js");return{toggleDashboardPin:n}},[],import.meta.url);await t(this,e)}async handleDashboardCreateViaChat(e){this.setTab("chat");const{createNewSession:t}=await E(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>Ye);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e??"I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more.")}handleDashboardCategoryFilter(e){this.dashboardCategoryFilter=e}handleDashboardBack(){if(this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1,this.dashboardPreviousSessionKey){const e=this.dashboardPreviousSessionKey;this.dashboardPreviousSessionKey=null,E(async()=>{const{saveDraft:t}=await Promise.resolve().then(()=>ai);return{saveDraft:t}},void 0,import.meta.url).then(({saveDraft:t})=>{t(this),this.sessionKey=e,E(async()=>{const{loadChatHistory:n}=await Promise.resolve().then(()=>Be);return{loadChatHistory:n}},void 0,import.meta.url).then(({loadChatHistory:n})=>{n(this)})})}}async handleDashboardOpenSession(e){const t=this.activeDashboardManifest?.sessionId;if(!t){this.showToast("No session for this dashboard","error");return}this.dashboardPreviousSessionKey=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1;const n=this.settings.openTabs.includes(t)?this.settings.openTabs:[...this.settings.openTabs,t];this.applySettings({...this.settings,openTabs:n,sessionKey:t,lastActiveSessionKey:t,tabLastViewed:{...this.settings.tabLastViewed,[t]:Date.now()}}),this.setTab("chat");const{syncUrlWithSessionKey:s}=await E(async()=>{const{syncUrlWithSessionKey:i}=await Promise.resolve().then(()=>Em);return{syncUrlWithSessionKey:i}},void 0,import.meta.url);s(this,t,!0)}async handleOptionsLoad(){const{loadOptions:e}=await E(async()=>{const{loadOptions:t}=await import("./options-QuHclvvX.js");return{loadOptions:t}},[],import.meta.url);await e(this)}async handleOptionToggle(e,t){const{saveOption:n}=await E(async()=>{const{saveOption:s}=await import("./options-QuHclvvX.js");return{saveOption:s}},[],import.meta.url);await n(this,e,t)}async handleSecondBrainRefresh(){const{loadSecondBrain:e}=await E(async()=>{const{loadSecondBrain:t}=await import("./second-brain-cP3vM8ym.js");return{loadSecondBrain:t}},[],import.meta.url);await e(this)}handleSecondBrainSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.handleSecondBrainRefresh().catch(t=>{console.error("[SecondBrain] Refresh after subtab change failed:",t),this.secondBrainError=t instanceof Error?t.message:"Failed to load data",this.secondBrainLoading=!1})}async handleSecondBrainSelectEntry(e){if(e.endsWith(".html")||e.endsWith(".htm")){try{const s=await this.client.request("secondBrain.memoryBankEntry",{path:e});s?.content&&this.handleOpenSidebar(s.content,{mimeType:"text/html",filePath:e,title:s.name||e.split("/").pop()||"File"})}catch(s){console.error("[SecondBrain] Failed to open HTML file:",s)}return}const{loadSecondBrainEntry:n}=await E(async()=>{const{loadSecondBrainEntry:s}=await import("./second-brain-cP3vM8ym.js");return{loadSecondBrainEntry:s}},[],import.meta.url);await n(this,e)}async handleSecondBrainBrowseFolder(e){const{browseFolder:t}=await E(async()=>{const{browseFolder:n}=await import("./second-brain-cP3vM8ym.js");return{browseFolder:n}},[],import.meta.url);await t(this,e)}handleSecondBrainBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}handleSecondBrainSearch(e){this.secondBrainSearchQuery=e}async handleSecondBrainSync(){const{syncSecondBrain:e}=await E(async()=>{const{syncSecondBrain:t}=await import("./second-brain-cP3vM8ym.js");return{syncSecondBrain:t}},[],import.meta.url);await e(this)}handleSecondBrainFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doSecondBrainFileSearch(e)}async _doSecondBrainFileSearch(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=t.results??[])}catch(t){console.error("[SecondBrain] search failed:",t)}}async handleSecondBrainFileSelect(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=e.endsWith(".html")||e.endsWith(".htm");this.handleOpenSidebar(t.content,{mimeType:n?"text/html":"text/markdown",filePath:e,title:t.name||e.split("/").pop()||"File"})}}catch(t){console.error("[SecondBrain] Failed to open file:",t),this.showToast("Failed to open file","error")}}async handleResearchSaveViaChat(){this.setTab("chat");const{createNewSession:e}=await E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>Ye);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save.")}async handleAddSource(){this.setTab("chat");const{createNewSession:e}=await E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>Ye);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect.")}removeQueuedMessage(e){Tc(this,e)}async handleSendChat(e,t){const n=this.sessionsResult?.sessions?.find(s=>s.key===this.sessionKey);if(n){const s=n.totalTokens??0,i=n.contextTokens??this.sessionsResult?.defaults?.contextTokens??2e5;if((i>0?s/i:0)>=.9&&!this.compactionStatus?.active){const o=(e??this.chatMessage).trim(),c=e==null?[...this.chatAttachments??[]]:[];if(o||c.length>0){this.pendingRetry={message:o,attachments:c,timestamp:Date.now()},this.autoRetryAfterCompact=!0,this.chatMessages=[...this.chatMessages,{role:"user",content:[{type:"text",text:o}],timestamp:Date.now()}],e==null&&(this.chatMessage="",this.chatAttachments=[]),this.showToast("Context near limit — auto-compacting...","info",3e3),this.handleCompactChat();return}}}await xc(this,e,t)}handleToggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen}handleToggleSessionSearch(e){if(!this.sessionSearchOpen&&e){const n=e.currentTarget.getBoundingClientRect();this.sessionSearchPosition={top:n.bottom+8,right:window.innerWidth-n.right}}this.sessionSearchOpen=!this.sessionSearchOpen,this.sessionSearchOpen||(this.sessionSearchQuery="",this.sessionSearchResults=[])}async handleSessionSearchQuery(e){if(this.sessionSearchQuery=e,!e.trim()){this.sessionSearchResults=[];return}if(this.client){this.sessionSearchLoading=!0;try{const t=await this.client.request("sessions.searchContent",{query:e.trim(),limit:20});this.sessionSearchResults=t.results}catch(t){console.error("Session search failed:",t),this.sessionSearchResults=[]}finally{this.sessionSearchLoading=!1}}}handleSelectSession(e){this.sessionPickerOpen=!1,this.sessionSearchOpen=!1,this.sessionSearchQuery="",this.sessionSearchResults=[]}async handleWhatsAppStart(e){await Ud(this,e)}async handleWhatsAppWait(){await Kd(this)}async handleWhatsAppLogout(){await zd(this)}async handleChannelConfigSave(){await Wd(this)}async handleChannelConfigReload(){await qd(this)}async handleCompactChat(){if(!this.connected){this.showToast("Cannot compact: not connected","error");return}if(!this.sessionKey){this.showToast("Cannot compact: no active session","error");return}this.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null};try{await this.handleSendChat("/compact")}catch(e){this.compactionStatus=null,console.error("Compaction failed:",e),this.showToast("Compaction failed","error")}}injectCompactionSummary(e,t){const n={role:"system",content:e,timestamp:Date.now(),isCompactionSummary:!0,keptMessages:t};this.chatMessages=[n,...this.chatMessages]}async handleRetryMessage(){const e={client:this.client,connected:this.connected,sessionKey:this.sessionKey,chatLoading:this.chatLoading,chatMessages:this.chatMessages,chatThinkingLevel:this.chatThinkingLevel,chatSending:this.chatSending,chatSendingSessionKey:this.chatSendingSessionKey,chatMessage:this.chatMessage,chatAttachments:this.chatAttachments,chatRunId:this.chatRunId,chatStream:this.chatStream,chatStreamStartedAt:this.chatStreamStartedAt,lastError:this.lastError,pendingRetry:this.pendingRetry},t=await gl(e);this.chatSending=e.chatSending,this.chatSendingSessionKey=e.chatSendingSessionKey,this.chatRunId=e.chatRunId,this.chatStream=e.chatStream,this.chatStreamStartedAt=e.chatStreamStartedAt,this.lastError=e.lastError,this.pendingRetry=e.pendingRetry??null,this.chatMessages=e.chatMessages,t&&this.showToast("Message resent","success",2e3)}handleClearRetry(){this.pendingRetry=null}handleNostrProfileEdit(e,t){Hd(this,e,t)}handleNostrProfileCancel(){Vd(this)}handleNostrProfileFieldChange(e,t){Gd(this,e,t)}async handleNostrProfileSave(){await Qd(this)}async handleNostrProfileImport(){await Jd(this)}handleNostrProfileToggleAdvanced(){Yd(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,We(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleGatewayRestartClick(){this.gatewayRestartPending=!0}async handleGatewayRestartConfirm(){if(!(!this.client||this.gatewayRestartBusy)){this.gatewayRestartBusy=!0;try{await this.client.request("godmode.gateway.restart")}catch{}finally{this.gatewayRestartBusy=!1,this.gatewayRestartPending=!1}}}handleGatewayRestartCancel(){this.gatewayRestartPending=!1}handleDeployPanelToggle(){this.deployPanelOpen=!this.deployPanelOpen}async handleDeployDismiss(){if(this.client){try{await this.client.request("godmode.deploy.dismiss")}catch{}this.deployPanelOpen=!1,this.updateStatus&&(this.updateStatus={...this.updateStatus,pendingDeploy:null})}}handleOpenSidebar(e,t={}){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarMimeType=t.mimeType?.trim()||null,this.sidebarFilePath=t.filePath?.trim()||null,this.sidebarTitle=t.title?.trim()||null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.showDrivePicker=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode!=="proof"&&(this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null),this.sidebarCloseTimer=null)},200)}async handleOpenFile(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}let t=e;if(!e.includes("/")&&!e.includes("\\")&&!e.startsWith("~"))try{t=(await this.client.request("files.resolve",{filename:e})).path}catch{}try{const n=await this.client.request("files.read",{path:t}),s=t.split(".").pop()?.toLowerCase()??"",i=n.contentType??n.mime??(s==="md"?"text/markdown":null),a=t.split("/").pop()??t;this.handleOpenSidebar(n.content,{mimeType:i,filePath:t,title:a}),n.truncated&&this.showToast(`Opened truncated file: ${a}`,"warning")}catch(n){console.error("[Chat] Failed to open file:",n),this.showToast(`Failed to open file: ${e}`,"error")}}async handleToggleDrivePicker(){if(this.showDrivePicker){this.showDrivePicker=!1;return}if(this.driveAccounts.length===0)try{const e=await this.client?.request("files.listDriveAccounts",{});this.driveAccounts=e?.accounts??[]}catch{this.driveAccounts=[]}this.showDrivePicker=!0}async handlePushToDrive(e,t){if(!this.driveUploading){if(this.showDrivePicker=!1,this._pendingBatchPaths&&this._pendingBatchPaths.length>0){const n=this._pendingBatchPaths;this._pendingBatchPaths=void 0,await this._executeBatchDrive(n,t);return}this.driveUploading=!0;try{const n={filePath:e};t&&(n.account=t);const s=await this.client?.request("files.pushToDrive",n),i=t?` to ${t.split("@")[0]}`:"",a=s?.message??`Uploaded${i} to Google Drive`,o=s?.driveUrl;this.showToast(a,"success",o?8e3:5e3,o?{label:"View in Drive",url:o}:void 0)}catch(n){console.error("Push to Drive failed:",n);const s=n instanceof Error?n.message:typeof n=="object"&&n!==null&&"message"in n?String(n.message):"Unknown error";s.includes("GOG_NOT_FOUND")||s.includes("gog CLI not found")?this.showToast("Google Drive not configured. Install gog CLI: npm install -g gog-cli, then run: gog auth add <email> --services drive","warning",1e4):s.includes("GOG_AUTH")||s.includes("auth")&&s.includes("expired")?this.showToast("Google Drive auth expired. Re-authenticate: gog auth add <email> --services drive","warning",8e3):this.showToast(`Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1}}}async handleBatchPushToDrive(e){if(this.driveUploading||e.length===0)return;if(!this.driveAccounts||this.driveAccounts.length===0)try{const n=await this.client?.request("files.listDriveAccounts");this.driveAccounts=n?.accounts??[]}catch{}if(this.driveAccounts&&this.driveAccounts.length>1){this._pendingBatchPaths=e,this.showDrivePicker=!0;return}const t=this.driveAccounts?.[0]?.email;await this._executeBatchDrive(e,t)}async _executeBatchDrive(e,t){this.driveUploading=!0,this.showToast(`Uploading ${e.length} files to Drive...`,"info",0);try{const n={filePaths:e};t&&(n.account=t);const s=await this.client?.request("files.batchPushToDrive",n);this.dismissAllToasts();const i=s?.results?.filter(o=>o.success).length??0,a=s?.results?.length??e.length;i===a?this.showToast(`Uploaded ${i} files to Google Drive`,"success",5e3):this.showToast(`Uploaded ${i}/${a} files (${a-i} failed)`,"warning",8e3)}catch(n){this.dismissAllToasts();const s=n instanceof Error?n.message:"Unknown error";this.showToast(`Batch Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1,this._pendingBatchPaths=void 0}}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}handleImageClick(e,t,n){this.lightbox=Yw(e,t,n)}handleLightboxClose(){this.lightbox=Qw()}handleLightboxNav(e){this.lightbox=Jw(this.lightbox,e)}normalizeWorkspacePathCandidate(e,t={}){let n=e.trim();if(!n||n.startsWith("#"))return null;for(;n.startsWith("./");)n=n.slice(2);if(n=n.replaceAll("\\","/"),!t.allowAbsolute)for(;n.startsWith("/");)n=n.slice(1);return!n||n.includes("\0")?null:n}isAbsoluteFilesystemPath(e){return e.startsWith("/")||e.startsWith("~/")||/^[a-z]:[\\/]/i.test(e)}inferMimeTypeFromPath(e){if(!e)return null;const t=e.trim().toLowerCase();if(!t)return null;const n=t.split(".").pop()??"";return n?n==="md"||n==="markdown"||n==="mdx"?"text/markdown":n==="html"||n==="htm"?"text/html":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":n==="svg"||n==="svgz"?"image/svg+xml":n==="avif"||n==="bmp"||n==="gif"||n==="heic"||n==="heif"||n==="jpeg"||n==="jpg"||n==="png"||n==="webp"?`image/${n==="jpg"?"jpeg":n}`:null:null}sidebarTitleForPath(e){const t=e.replaceAll("\\","/").trim();if(!t)return"Document";const n=t.split("/");return n[n.length-1]||t}async listWorkspaceIdsForPathResolution(){const e=[],t=new Set,n=s=>{if(typeof s!="string")return;const i=s.trim();!i||t.has(i)||(t.add(i),e.push(i))};n(this.selectedWorkspace?.id);for(const s of this.workspaces??[])n(s.id);if(e.length>0||!this.client||!this.connected)return e;try{const s=await this.client.request("workspaces.list",{});for(const i of s.workspaces??[])n(i.id)}catch{}return e}async openWorkspaceRelativeFileInViewer(e){if(!this.client||!this.connected)return!1;const t=await this.listWorkspaceIdsForPathResolution();for(const n of t)try{const s=await this.client.request("workspaces.readFile",{workspaceId:n,filePath:e});if(typeof s.content!="string")continue;return this.handleOpenSidebar(s.content,{mimeType:s.contentType??s.mime??this.inferMimeTypeFromPath(e),filePath:s.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}return!1}extractWorkspacePathCandidatesFromHref(e){const t=e.trim();if(!t)return[];const n=[],s=t.toLowerCase();if(s.startsWith("mailto:")||s.startsWith("tel:")||s.startsWith("javascript:")||s.startsWith("data:"))return[];if(t.startsWith("file://")){let u=t.slice(7);u.startsWith("/~/")&&(u="~"+u.slice(2));try{u=decodeURIComponent(u)}catch{}n.push(u);const l=[],p=new Set;for(const v of n){const y=this.normalizeWorkspacePathCandidate(v,{allowAbsolute:!0});!y||p.has(y)||(p.add(y),l.push(y))}return l}const i=/^[a-z][a-z0-9+.-]*:/i.test(t),a=/^[a-z]:[\\/]/i.test(t);(!i||a)&&n.push(t);let o=null;try{o=new URL(t,window.location.href)}catch{o=null}if(o&&/^https?:$/.test(o.protocol)&&o.origin===window.location.origin){for(const b of kS){const k=o.searchParams.get(b);k&&n.push(k)}const l=(t.split("#")[0]??"").split("?")[0]??"";l.length>0&&!l.startsWith("/")&&!l.includes("://")&&n.push(l);let v=o.pathname;this.basePath&&v.startsWith(`${this.basePath}/`)?v=v.slice(this.basePath.length):this.basePath&&v===this.basePath&&(v="");const y=v.startsWith("/")?v.slice(1):v;if(y){n.push(y);const b=y.indexOf("/");if(b>0){const k=y.slice(0,b).toLowerCase();Lr.has(k)&&n.push(y.slice(b+1))}}if(v.startsWith("/")&&y){const b=y.split("/")[0]?.toLowerCase()??"";Lr.has(b)||n.push(v)}}const c=[],d=new Set;for(const u of n){let l=u;try{l=decodeURIComponent(u)}catch{}const p=this.normalizeWorkspacePathCandidate(l,{allowAbsolute:!0});!p||d.has(p)||(d.add(p),c.push(p))}return c}async openWorkspaceFileInViewer(e){if(!this.client||!this.connected)return!1;const t=this.isAbsoluteFilesystemPath(e);if(!t&&await this.openWorkspaceRelativeFileInViewer(e))return!0;try{const n=await this.client.request("workspaces.readFile",{path:e});if(typeof n.content=="string")return this.handleOpenSidebar(n.content,{mimeType:n.contentType??n.mime??this.inferMimeTypeFromPath(e),filePath:n.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}if(!t)return!1;try{const n=await this.client.request("files.read",{path:e,maxSize:1e6});return typeof n.content!="string"?!1:(this.handleOpenSidebar(n.content,{mimeType:this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0)}catch{return!1}}async handleOpenMessageFileLink(e){const t=this.extractWorkspacePathCandidatesFromHref(e);if(t.length===0)return!1;for(const n of t)if(await this.openWorkspaceFileInViewer(n))return!0;return!1}showToast(e,t="info",n=5e3,s){const i=gS(e,t,n,s);this.toasts=vS(this.toasts,i),n>0&&window.setTimeout(()=>{this.dismissToast(i.id)},n)}dismissToast(e){this.toasts=mS(this.toasts,e)}dismissAllToasts(){this.toasts=[]}async handleMyDayRefresh(){await os(this),this._loadDecisionCards()}_loadDecisionCards(){E(()=>Promise.resolve().then(()=>dn),void 0,import.meta.url).then(async e=>{this.todayQueueResults=await e.loadTodayQueueResults(this)}).catch(()=>{})}async loadTodayQueueResults(){this._loadDecisionCards()}async handleMyDayTaskStatusChange(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,status:t,completedAt:t==="complete"?new Date().toISOString():null});const{loadTodayTasksWithQueueStatus:n}=await E(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>dn);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task status:",n)}}async handleTodayCreateTask(e){if(!(!this.client||!this.connected))try{await this.client.request("tasks.create",{title:e,dueDate:ie(),priority:"medium",source:"chat"});const{loadTodayTasksWithQueueStatus:t}=await E(async()=>{const{loadTodayTasksWithQueueStatus:n}=await Promise.resolve().then(()=>dn);return{loadTodayTasksWithQueueStatus:n}},void 0,import.meta.url);await t(this)}catch(t){console.error("[MyDay] Failed to create task:",t),this.showToast("Failed to create task","error")}}handleTodayEditTask(e){this.todayEditingTaskId=e}async handleTodayUpdateTask(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,...t}),this.todayEditingTaskId=null;const{loadTodayTasksWithQueueStatus:n}=await E(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>dn);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task:",n),this.showToast("Failed to update task","error")}}handleTodayToggleCompleted(){this.todayShowCompleted=!this.todayShowCompleted}async handleTodayViewTaskOutput(e){if(!(!this.client||!this.connected))try{const n=(await this.client.request("queue.list",{limit:100}))?.items?.find(a=>a.sourceTaskId===e);if(!n?.result?.outputPath){this.showToast("No output available for this task","info");return}const s=await this.client.request("queue.readOutput",{path:n.result.outputPath}),i=n.result.outputPath.split("/").pop()??"Agent Output";this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n.result.outputPath,title:i})}catch(t){console.error("[Tasks] View output failed:",t),this.showToast("Failed to load agent output","error")}}async handleTodayStartTask(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e}),n=t?.sessionId??t?.sessionKey;if(n){if(t.task?.title){const{autoTitleCache:a}=await E(async()=>{const{autoTitleCache:c}=await Promise.resolve().then(()=>on);return{autoTitleCache:c}},void 0,import.meta.url);a.set(n,t.task.title);const{hostPatchSession:o}=await E(async()=>{const{hostPatchSession:c}=await Promise.resolve().then(()=>Rf);return{hostPatchSession:c}},void 0,import.meta.url);o(this.client,n,t.task.title)}this.setTab("chat"),this.sessionKey=n;const s=this.settings.openTabs.includes(n)?this.settings.openTabs:[...this.settings.openTabs,n];this.applySettings({...this.settings,sessionKey:n,lastActiveSessionKey:n,openTabs:s}),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:i}=await E(async()=>{const{loadChatHistory:a}=await Promise.resolve().then(()=>Be);return{loadChatHistory:a}},void 0,import.meta.url);await i(this),this.loadSessionResources(),t.queueOutput&&this.chatMessages.length===0&&this.seedSessionWithAgentOutput(t.task?.title??"this task",t.queueOutput,t.agentPrompt??void 0),this.requestUpdate()}}catch(t){console.error("[MyDay] Failed to open session for task:",t),this.showToast("Failed to open session for task","error")}}handleDatePrev(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()-1),this.todaySelectedDate=ie(e),cn(this)}handleDateNext(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()+1);const t=ie(),n=ie(e);n>t||(this.todaySelectedDate=n,cn(this))}handleDateToday(){this.todaySelectedDate=ie(),os(this)}async handleDailyBriefRefresh(){await cn(this)}async handleDailyBriefGenerate(){if(!(!this.client||!this.connected)){this.dailyBriefLoading=!0;try{await this.client.request("dailyBrief.generate",{}),await cn(this)}catch(e){this.dailyBriefError=e instanceof Error?e.message:"Failed to generate brief"}finally{this.dailyBriefLoading=!1}}}handleDailyBriefOpenInObsidian(){const e=this.dailyBrief?.date;rc(e)}async loadBriefNotes(){if(!this.client||!this.connected)return;const e=this.todaySelectedDate;try{const t=await this.client.request("briefNotes.get",{date:e});this.briefNotes=t.notes??{}}catch(t){console.error("[BriefNotes] Load error:",t),this.briefNotes={}}}async handleBriefNoteSave(e,t){if(!this.client||!this.connected)return;const n=this.todaySelectedDate;try{const s=await this.client.request("briefNotes.update",{date:n,section:e,text:t});this.briefNotes=s.notes??{}}catch(s){console.error("[BriefNotes] Save error:",s),this.showToast("Failed to save note","error")}}handleTodayViewModeChange(e){this.todayViewMode=e}handlePrivateModeToggle(){if(this.chatPrivateMode){const e=this.sessionKey;this.chatPrivateMode=!1,this._destroyPrivateSession(e),this.showToast("Private session destroyed","info",2e3);return}this.chatPrivateMode=!0,this.setTab("chat"),E(async()=>{const{createNewSession:e}=await Promise.resolve().then(()=>Ye);return{createNewSession:e}},void 0,import.meta.url).then(({createNewSession:e})=>{e(this);const t=Date.now()+1440*60*1e3;this.privateSessions=new Map(this.privateSessions).set(this.sessionKey,t),this._persistPrivateSessions(),this._startPrivateSessionTimer(),this.client&&this.connected&&this.client.request("session.setPrivate",{sessionKey:this.sessionKey,enabled:!0}).catch(()=>{}),this.chatMessages=[{role:"assistant",content:`This is a **private session**. Nothing will be saved to memory or logs.

This session self-destructs when you close it or in **24 hours** — whichever comes first.`,timestamp:Date.now()}],this.requestUpdate()}),this.showToast("Private session created — 24h countdown started","info",3e3)}async _destroyPrivateSession(e){const t=new Map(this.privateSessions);if(t.delete(e),this.privateSessions=t,this._persistPrivateSessions(),this.sessionKey===e){this.chatPrivateMode=!1;const n=this.settings.openTabs.filter(i=>i!==e),s=n[0]||V;this.applySettings({...this.settings,openTabs:n,sessionKey:s,lastActiveSessionKey:s}),this.sessionKey=s,(await E(async()=>{const{loadChatHistory:i}=await Promise.resolve().then(()=>Be);return{loadChatHistory:i}},void 0,import.meta.url)).loadChatHistory(this)}else this.applySettings({...this.settings,openTabs:this.settings.openTabs.filter(n=>n!==e)});this.client&&this.connected&&(this.client.request("session.setPrivate",{sessionKey:e,enabled:!1}).catch(()=>{}),this.client.request("sessions.delete",{key:e,deleteTranscript:!0}).catch(()=>{})),this.privateSessions.size===0&&this._stopPrivateSessionTimer()}_persistPrivateSessions(){const e=Array.from(this.privateSessions.entries());e.length===0?localStorage.removeItem("godmode.privateSessions"):localStorage.setItem("godmode.privateSessions",JSON.stringify(e))}_restorePrivateSessions(){try{const e=localStorage.getItem("godmode.privateSessions");if(!e)return;const t=JSON.parse(e),n=Date.now(),s=t.filter(([,i])=>i>n);if(this.privateSessions=new Map(s),s.length!==t.length){const i=t.filter(([,a])=>a<=n);for(const[a]of i)this._destroyPrivateSession(a)}this.privateSessions.size>0&&(this.privateSessions.has(this.sessionKey)&&(this.chatPrivateMode=!0),this._startPrivateSessionTimer()),this._persistPrivateSessions()}catch{localStorage.removeItem("godmode.privateSessions")}}_startPrivateSessionTimer(){this._privateSessionTimer||(this._privateSessionTimer=setInterval(()=>{const e=Date.now();for(const[t,n]of this.privateSessions)n<=e&&(this._destroyPrivateSession(t),this.showToast("Private session expired and was destroyed","info",3e3));this.privateSessions.size>0&&this.requestUpdate()},3e4))}_stopPrivateSessionTimer(){this._privateSessionTimer&&(clearInterval(this._privateSessionTimer),this._privateSessionTimer=null)}async handleBriefSave(e){if(!this.client||!this.connected)return;const t=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.update",{date:t,content:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(n){console.error("[DailyBrief] Save error:",n),this.showToast("Failed to save brief","error")}}async handleBriefToggleCheckbox(e,t){if(!this.client||!this.connected)return;const n=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.toggleCheckbox",{date:n,index:e,checked:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(s){console.error("[DailyBrief] Checkbox toggle error:",s),this.showToast("Failed to toggle checkbox","error")}}async handleWorkRefresh(){await Promise.all([lc(this),cc(this)])}async handleResourcePin(e,t){await Hg(this,e,t)}async handleResourceDelete(e){await Vg(this,e)}handleResourceFilterChange(e){this.workResourceFilter=e}handleResourceClick(e){e.path?this.handleWorkFileClick(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}async loadSessionResources(){if(!(!this.client||!this.connected))try{const t=(await this.client.request("resources.list",{sessionKey:this.sessionKey,limit:20})).resources??[],n=new Set(t.filter(s=>s.proofSlug).map(s=>s.proofSlug));if(this.chatMessages?.length)for(const s of this.chatMessages){const i=s,a=Array.isArray(i.content)?i.content:[];for(const o of a){const c=typeof o.text=="string"?o.text:typeof o.content=="string"?o.content:null;if(c)try{const d=JSON.parse(c);d._sidebarAction?.type==="proof"&&d._sidebarAction.slug&&!n.has(d._sidebarAction.slug)&&(n.add(d._sidebarAction.slug),t.unshift({id:`proof:${d._sidebarAction.slug}`,title:d.title??"Proof Document",type:"doc",path:d.filePath,sessionKey:this.sessionKey,proofSlug:d._sidebarAction.slug}))}catch{}}}this.sessionResources=t}catch(e){console.warn("[SessionResources] load failed:",e),this.sessionResources=[]}}handleSessionResourceClick(e){e.proofSlug?this.handleOpenProofDoc(e.proofSlug):e.path?this.handleOpenFile(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}handleToggleSessionResources(){this.sessionResourcesCollapsed=!this.sessionResourcesCollapsed}handleViewAllResources(){this.setTab("work")}handleWorkToggleProject(e){const t=new Set(this.workExpandedProjects);t.has(e)?t.delete(e):(t.add(e),this.workProjectFiles[e]||jg(this,e)),this.workExpandedProjects=t}async handleWorkFileClick(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("workspaces.readFile",{path:e});if(!t.content){this.showToast(t.error??"Failed to read file","error");return}this.handleOpenSidebar(t.content,{mimeType:t.contentType??t.mime??this.inferMimeTypeFromPath(e),filePath:t.path??e,title:this.sidebarTitleForPath(e)})}catch(t){console.error("[Work] Failed to read file:",t),this.showToast(`Failed to open: ${e}`,"error")}}handleWorkSkillClick(e,t){this.handleStartChatWithPrompt(`Tell me about the "${e}" skill and how it's used in the ${t} project.`)}handlePeopleImport(e){const t=e==="apple"?"Import my contacts from Apple Contacts and organize them into categories.":"Import my contacts from Google Contacts and organize them into categories.";this.handleStartChatWithPrompt(t)}async handleWorkspacesRefresh(){await $s(this)}async handleWorkspaceBrowse(e){if(!this.selectedWorkspace)return;const{browseWorkspaceFolder:t}=await E(async()=>{const{browseWorkspaceFolder:s}=await Promise.resolve().then(()=>Yn);return{browseWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&(this.workspaceBrowsePath=e,this.workspaceBrowseEntries=n.entries,this.workspaceBreadcrumbs=n.breadcrumbs)}async handleWorkspaceBrowseSearch(e){if(this.workspaceBrowseSearchQuery=e,!e.trim()||!this.selectedWorkspace){this.workspaceBrowseSearchResults=null;return}const{searchWorkspaceFiles:t}=await E(async()=>{const{searchWorkspaceFiles:n}=await Promise.resolve().then(()=>Yn);return{searchWorkspaceFiles:n}},void 0,import.meta.url);this.workspaceBrowseSearchResults=await t(this,this.selectedWorkspace.id,e)}handleWorkspaceBrowseBack(){this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null}async handleWorkspaceCreateFolder(e){if(!this.selectedWorkspace)return;const{createWorkspaceFolder:t}=await E(async()=>{const{createWorkspaceFolder:s}=await Promise.resolve().then(()=>Yn);return{createWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&this.workspaceBrowsePath&&await this.handleWorkspaceBrowse(this.workspaceBrowsePath),n&&this.showToast("Folder created","success",2e3)}handleOnboardingStart(){this.onboardingPhase=1,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:1}),this.client?.request("onboarding.update",{phase:1,completePhase:0})}async handleOnboardingIdentitySubmit(e){if(this.client)try{await this.client.request("onboarding.update",{phase:2,completePhase:1,identity:e}),this.onboardingPhase=2,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:2,identity:e}),this.userName=e.name,this.userAvatar=e.emoji,this.applySettings({...this.settings,userName:e.name,userAvatar:e.emoji}),this.setTab("chat"),E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>Ye);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this);const n=`I just set up my GodMode identity. My name is ${e.name}${e.mission?` and my mission is: ${e.mission}`:""}. Let's set up my workspace.`;this.chatMessage=n,this.handleSendChat(n)})}catch(t){console.error("[Onboarding] Identity submit failed:",t),this.showToast("Failed to save identity","error")}}handleOnboardingSkipPhase(){if(!this.client)return;const e=Math.min(this.onboardingPhase+1,6);this.onboardingPhase=e,this.client.request("onboarding.update",{phase:e,completePhase:this.onboardingPhase})}handleOnboardingComplete(){this.onboardingActive=!1,this.onboardingPhase=6,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:6,completedAt:new Date().toISOString()}),this.client?.request("onboarding.complete",{summary:this.onboardingData?.summary??null}),this.showToast("Welcome to GodMode!","success",4e3)}handleStartChatWithPrompt(e){this.setTab("chat"),E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>Ye);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this),this.chatMessage=e,this.requestUpdate()})}handleOpenSupportChat(){const e="agent:main:support";if(this.sessionKey===e){this.setTab("chat");return}E(async()=>{const{saveDraft:s}=await Promise.resolve().then(()=>ai);return{saveDraft:s}},void 0,import.meta.url).then(({saveDraft:s})=>s(this));const n=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:n,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),E(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>on);return{autoTitleCache:s}},void 0,import.meta.url).then(({autoTitleCache:s})=>{s.set(e,"Support")}),E(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>Be);return{loadChatHistory:s}},void 0,import.meta.url).then(({loadChatHistory:s})=>{s(this).then(()=>{this.loadSessionResources(),this.chatMessages.length===0&&this.sessionKey===e&&(this.chatMessages=[{role:"assistant",content:`**Welcome to GodMode Support**

I have full access to your system diagnostics and GodMode knowledge base. I can help with:

- Troubleshooting issues
- Feature questions and configuration
- Setup guidance
- Escalation to the team if needed

What can I help you with?`,timestamp:Date.now()}],this.requestUpdate())}).catch(i=>{console.error("[Support] Failed to load chat history:",i)})})}handleWizardOpen(){E(async()=>{const{emptyWizardState:e}=await Promise.resolve().then(()=>k0);return{emptyWizardState:e}},void 0,import.meta.url).then(({emptyWizardState:e})=>{this.wizardState=e(),this.wizardActive=!0,this.requestUpdate()})}handleWizardClose(){this.wizardActive=!1,this.wizardState=null,this.requestUpdate()}handleWizardStepChange(e){this.wizardState&&(this.wizardState={...this.wizardState,step:e},this.requestUpdate())}handleWizardAnswerChange(e,t){this.wizardState&&(this.wizardState={...this.wizardState,answers:{...this.wizardState.answers,[e]:t}},this.requestUpdate())}async handleWizardPreview(){if(!(!this.client||!this.wizardState))try{const[e,t]=await Promise.all([this.client.request("onboarding.wizard.preview",this.wizardState.answers),this.client.request("onboarding.wizard.diff",this.wizardState.answers).catch(()=>null)]),n={};for(const i of e.files??[])n[i.path]=i.wouldCreate;const s={};if(t){for(const i of t.additions)s[i.path]=!0;for(const i of t.changes)s[i.path]=!1}this.wizardState={...this.wizardState,preview:e.files??[],diff:t,fileSelections:n,configSelections:s},this.requestUpdate()}catch(e){console.error("[Wizard] Preview failed:",e)}}handleWizardFileToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,fileSelections:{...this.wizardState.fileSelections,[e]:t}},this.requestUpdate())}handleWizardConfigToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,configSelections:{...this.wizardState.configSelections,[e]:t}},this.requestUpdate())}async handleWizardGenerate(){if(!this.client||!this.wizardState)return;this.wizardState={...this.wizardState,generating:!0,error:null},this.requestUpdate();const e=[];for(const[n,s]of Object.entries(this.wizardState.fileSelections))s||e.push(n);const t=[];for(const[n,s]of Object.entries(this.wizardState.configSelections))s||t.push(n);try{const n=await this.client.request("onboarding.wizard.generate",{...this.wizardState.answers,skipFiles:e,skipKeys:t});this.wizardState={...this.wizardState,generating:!1,step:9,result:{filesCreated:n.filesCreated,filesSkipped:n.filesSkipped,configPatched:n.configPatched,workspacePath:n.workspacePath}},this.requestUpdate(),this.showToast("Memory system generated!","success",4e3)}catch(n){const s=n instanceof Error?n.message:"Failed to generate workspace";this.wizardState={...this.wizardState,generating:!1,error:s},this.requestUpdate(),this.showToast(s,"error")}}async handleQuickSetup(e){E(()=>import("./setup-CWjMtnE4.js"),[],import.meta.url).then(async({quickSetup:t})=>{await t(this,e)&&(this.setTab("chat"),E(async()=>{const{loadCapabilities:s}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:s}},[],import.meta.url).then(({loadCapabilities:s})=>s(this)))})}handleLoadCapabilities(){E(async()=>{const{loadCapabilities:e}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:e}},[],import.meta.url).then(({loadCapabilities:e})=>e(this))}handleCapabilityAction(e){E(async()=>{const{capabilityAction:t}=await import("./setup-CWjMtnE4.js");return{capabilityAction:t}},[],import.meta.url).then(({capabilityAction:t})=>t(this,e))}handleHideSetup(){E(async()=>{const{hideSetup:e}=await import("./setup-CWjMtnE4.js");return{hideSetup:e}},[],import.meta.url).then(({hideSetup:e})=>e(this))}handleRunAssessment(){this.client&&this.client.request("onboarding.assess",{}).then(()=>{this.handleLoadCapabilities()})}handleUpdateUserProfile(e,t){const n=e.trim().slice(0,50),s=t.trim();this.userName=n||"You",this.userAvatar=s||null,this.applySettings({...this.settings,userName:n,userAvatar:s})}async handleLoadIntegrations(){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadIntegrations(this)}handleExpandCard(e){E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.expandCard(this,e))}async handleLoadGuide(e){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadGuide(this,e)}async handleTestIntegration(e){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).testIntegration(this,e)}async handleConfigureIntegration(e,t){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).configureIntegration(this,e,t)}handleUpdateConfigValue(e,t){this.onboardingConfigValues={...this.onboardingConfigValues,[e]:t}}handleSkipIntegration(e){E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.skipIntegration(this,e))}async handleMarkOnboardingComplete(){if(!(!this.client||!this.connected))try{await this.client.request("onboarding.complete",{}),this.godmodeOptions&&(this.godmodeOptions={...this.godmodeOptions,"onboarding.complete":!0}),this.showSetupTab=!1,this.setTab("chat")}catch(e){console.error("[onboarding] Failed to mark complete:",e)}}async handleInboxRefresh(){if(!(!this.client||!this.connected)){this.inboxLoading=!0;try{const e=await this.client.request("inbox.list",{status:"pending",limit:50});this.inboxItems=e.items,this.inboxCount=e.pendingCount}catch(e){console.error("[Inbox] Failed to load:",e)}finally{this.inboxLoading=!1}}}async handleInboxScore(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("inbox.score",{itemId:e,score:t,feedback:n}),this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,await this.handleInboxRefresh()}catch(s){console.error("[Inbox] Score failed:",s)}}async handleInboxDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("inbox.dismiss",{itemId:e}),await this.handleInboxRefresh()}catch(t){console.error("[Inbox] Dismiss failed:",t)}}async handleInboxMarkAll(){if(!(!this.client||!this.connected))try{await this.client.request("inbox.markAllComplete",{}),await this.handleInboxRefresh()}catch(e){console.error("[Inbox] Mark all failed:",e)}}async handleInboxViewOutput(e){const t=this.inboxItems?.find(n=>n.id===e);if(t){if(t.outputPath&&this.client)try{const n=await this.client.request("files.read",{path:t.outputPath,maxSize:5e5});if(n?.content){this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t.outputPath,title:t.title});return}}catch(n){console.error("[Inbox] Failed to load output file:",n)}t.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}}async handleInboxViewProof(e){const t=this.inboxItems?.find(n=>n.id===e);t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}handleInboxOpenChat(e){const t=this.inboxItems?.find(n=>n.id===e);if(t?.type==="project-completion"&&t.coworkSessionId){this.setSessionKey(t.coworkSessionId),this.setTab("chat"),t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug);return}if(t?.source.taskId){this.handleMissionControlOpenTaskSession(t.source.taskId);return}t?.sessionId&&(this.setSessionKey(t.sessionId),this.setTab("chat"))}handleInboxSetScoring(e,t){e!==this.inboxScoringId&&(this.inboxFeedbackText=""),this.inboxScoringId=e,this.inboxScoringValue=t??7}handleInboxFeedbackChange(e){this.inboxFeedbackText=e}handleInboxSortToggle(){this.inboxSortOrder=this.inboxSortOrder==="newest"?"oldest":"newest"}async handleTrustDailyRate(e){if(this.client)try{await this.client.request("trust.dailyRate",{rating:e}),this.trustSummary&&(this.trustSummary={...this.trustSummary,todayRated:!0})}catch(t){console.error("[Trust] Daily rate failed:",t),this.showToast("Failed to submit daily rating","error")}}async handleOpenProofDoc(e){let t="Proof Document",n=null,s=null;if(this.client&&this.connected)try{const i=await this.client.request("proof.get",{slug:e});t=i.title?.trim()||t,n=i.filePath?.trim()||null,s=i.viewUrl?.trim()||null}catch(i){console.warn("[Proof] Failed to resolve document metadata:",i)}this.sidebarOpen=!0,this.sidebarMode="proof",this.sidebarProofSlug=e,this.sidebarProofUrl=s,this.sidebarProofHtml=null,this.sidebarFilePath=n,this.sidebarTitle=t}handleCloseProofDoc(){this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.handleCloseSidebar()}render(){return nS(this)}};g([$d({context:xd}),m()],f.prototype,"_ctx",2);g([m()],f.prototype,"settings",2);g([m()],f.prototype,"password",2);g([m()],f.prototype,"tab",2);g([m()],f.prototype,"onboarding",2);g([m()],f.prototype,"connected",2);g([m()],f.prototype,"reconnecting",2);g([m()],f.prototype,"reconnectAttempt",2);g([m()],f.prototype,"theme",2);g([m()],f.prototype,"themeResolved",2);g([m()],f.prototype,"hello",2);g([m()],f.prototype,"lastError",2);g([m()],f.prototype,"eventLog",2);g([m()],f.prototype,"assistantName",2);g([m()],f.prototype,"assistantAvatar",2);g([m()],f.prototype,"assistantAgentId",2);g([m()],f.prototype,"userName",2);g([m()],f.prototype,"userAvatar",2);g([m()],f.prototype,"sessionKey",2);g([m()],f.prototype,"sessionPickerOpen",2);g([m()],f.prototype,"sessionPickerPosition",2);g([m()],f.prototype,"sessionPickerSearch",2);g([m()],f.prototype,"sessionSearchOpen",2);g([m()],f.prototype,"sessionSearchPosition",2);g([m()],f.prototype,"sessionSearchQuery",2);g([m()],f.prototype,"sessionSearchResults",2);g([m()],f.prototype,"sessionSearchLoading",2);g([m()],f.prototype,"profilePopoverOpen",2);g([m()],f.prototype,"profileEditName",2);g([m()],f.prototype,"profileEditAvatar",2);g([m()],f.prototype,"editingTabKey",2);g([m()],f.prototype,"chatLoading",2);g([m()],f.prototype,"chatSending",2);g([m()],f.prototype,"chatSendingSessionKey",2);g([m()],f.prototype,"chatMessage",2);g([m()],f.prototype,"chatDrafts",2);g([m()],f.prototype,"chatMessages",2);g([m()],f.prototype,"chatToolMessages",2);g([m()],f.prototype,"chatStream",2);g([m()],f.prototype,"chatStreamStartedAt",2);g([m()],f.prototype,"chatRunId",2);g([m()],f.prototype,"currentToolName",2);g([m()],f.prototype,"currentToolInfo",2);g([m()],f.prototype,"workingSessions",2);g([m()],f.prototype,"compactionStatus",2);g([m()],f.prototype,"chatAvatarUrl",2);g([m()],f.prototype,"chatThinkingLevel",2);g([m()],f.prototype,"chatQueue",2);g([m()],f.prototype,"chatAttachments",2);g([m()],f.prototype,"pendingRetry",2);g([m()],f.prototype,"autoRetryAfterCompact",2);g([m()],f.prototype,"sidebarOpen",2);g([m()],f.prototype,"sidebarContent",2);g([m()],f.prototype,"sidebarError",2);g([m()],f.prototype,"sidebarMimeType",2);g([m()],f.prototype,"sidebarFilePath",2);g([m()],f.prototype,"sidebarTitle",2);g([m()],f.prototype,"sidebarMode",2);g([m()],f.prototype,"sidebarProofSlug",2);g([m()],f.prototype,"sidebarProofUrl",2);g([m()],f.prototype,"sidebarProofHtml",2);g([m()],f.prototype,"splitRatio",2);g([m()],f.prototype,"lightbox",2);g([m()],f.prototype,"driveAccounts",2);g([m()],f.prototype,"showDrivePicker",2);g([m()],f.prototype,"driveUploading",2);g([m()],f.prototype,"updateStatus",2);g([m()],f.prototype,"updateLoading",2);g([m()],f.prototype,"updateError",2);g([m()],f.prototype,"updateLastChecked",2);g([m()],f.prototype,"nodesLoading",2);g([m()],f.prototype,"nodes",2);g([m()],f.prototype,"devicesLoading",2);g([m()],f.prototype,"devicesError",2);g([m()],f.prototype,"devicesList",2);g([m()],f.prototype,"execApprovalsLoading",2);g([m()],f.prototype,"execApprovalsSaving",2);g([m()],f.prototype,"execApprovalsDirty",2);g([m()],f.prototype,"execApprovalsSnapshot",2);g([m()],f.prototype,"execApprovalsForm",2);g([m()],f.prototype,"execApprovalsSelectedAgent",2);g([m()],f.prototype,"execApprovalsTarget",2);g([m()],f.prototype,"execApprovalsTargetNodeId",2);g([m()],f.prototype,"execApprovalQueue",2);g([m()],f.prototype,"execApprovalBusy",2);g([m()],f.prototype,"execApprovalError",2);g([m()],f.prototype,"pendingGatewayUrl",2);g([m()],f.prototype,"gatewayRestartPending",2);g([m()],f.prototype,"gatewayRestartBusy",2);g([m()],f.prototype,"deployPanelOpen",2);g([m()],f.prototype,"configLoading",2);g([m()],f.prototype,"configRaw",2);g([m()],f.prototype,"configRawOriginal",2);g([m()],f.prototype,"configValid",2);g([m()],f.prototype,"configIssues",2);g([m()],f.prototype,"configSaving",2);g([m()],f.prototype,"configApplying",2);g([m()],f.prototype,"updateRunning",2);g([m()],f.prototype,"applySessionKey",2);g([m()],f.prototype,"configSnapshot",2);g([m()],f.prototype,"configSchema",2);g([m()],f.prototype,"configSchemaVersion",2);g([m()],f.prototype,"configSchemaLoading",2);g([m()],f.prototype,"configUiHints",2);g([m()],f.prototype,"configForm",2);g([m()],f.prototype,"configFormOriginal",2);g([m()],f.prototype,"configFormDirty",2);g([m()],f.prototype,"configFormMode",2);g([m()],f.prototype,"configSearchQuery",2);g([m()],f.prototype,"configActiveSection",2);g([m()],f.prototype,"configActiveSubsection",2);g([m()],f.prototype,"channelsLoading",2);g([m()],f.prototype,"channelsSnapshot",2);g([m()],f.prototype,"channelsError",2);g([m()],f.prototype,"channelsLastSuccess",2);g([m()],f.prototype,"whatsappLoginMessage",2);g([m()],f.prototype,"whatsappLoginQrDataUrl",2);g([m()],f.prototype,"whatsappLoginConnected",2);g([m()],f.prototype,"whatsappBusy",2);g([m()],f.prototype,"nostrProfileFormState",2);g([m()],f.prototype,"nostrProfileAccountId",2);g([m()],f.prototype,"presenceLoading",2);g([m()],f.prototype,"presenceEntries",2);g([m()],f.prototype,"presenceError",2);g([m()],f.prototype,"presenceStatus",2);g([m()],f.prototype,"agentsLoading",2);g([m()],f.prototype,"agentsList",2);g([m()],f.prototype,"agentsError",2);g([m()],f.prototype,"sessionsLoading",2);g([m()],f.prototype,"sessionsResult",2);g([m()],f.prototype,"sessionsError",2);g([m()],f.prototype,"sessionsFilterActive",2);g([m()],f.prototype,"sessionsFilterLimit",2);g([m()],f.prototype,"sessionsIncludeGlobal",2);g([m()],f.prototype,"sessionsIncludeUnknown",2);g([m()],f.prototype,"archivedSessions",2);g([m()],f.prototype,"archivedSessionsLoading",2);g([m()],f.prototype,"archivedSessionsExpanded",2);g([m()],f.prototype,"cronLoading",2);g([m()],f.prototype,"cronJobs",2);g([m()],f.prototype,"cronStatus",2);g([m()],f.prototype,"cronError",2);g([m()],f.prototype,"cronForm",2);g([m()],f.prototype,"cronRunsJobId",2);g([m()],f.prototype,"cronRuns",2);g([m()],f.prototype,"cronBusy",2);g([m()],f.prototype,"workspaceNeedsSetup",2);g([m()],f.prototype,"onboardingPhase",2);g([m()],f.prototype,"onboardingData",2);g([m()],f.prototype,"onboardingActive",2);g([m()],f.prototype,"wizardActive",2);g([m()],f.prototype,"wizardState",2);g([m()],f.prototype,"showSetupTab",2);g([m()],f.prototype,"setupCapabilities",2);g([m()],f.prototype,"setupCapabilitiesLoading",2);g([m()],f.prototype,"setupQuickDone",2);g([m()],f.prototype,"onboardingIntegrations",2);g([m()],f.prototype,"onboardingCoreProgress",2);g([m()],f.prototype,"onboardingExpandedCard",2);g([m()],f.prototype,"onboardingLoadingGuide",2);g([m()],f.prototype,"onboardingActiveGuide",2);g([m()],f.prototype,"onboardingTestingId",2);g([m()],f.prototype,"onboardingTestResult",2);g([m()],f.prototype,"onboardingConfigValues",2);g([m()],f.prototype,"onboardingProgress",2);g([m()],f.prototype,"workspaces",2);g([m()],f.prototype,"selectedWorkspace",2);g([m()],f.prototype,"workspacesSearchQuery",2);g([m()],f.prototype,"workspaceItemSearchQuery",2);g([m()],f.prototype,"workspacesLoading",2);g([m()],f.prototype,"workspacesCreateLoading",2);g([m()],f.prototype,"workspacesError",2);g([m()],f.prototype,"workspaceExpandedFolders",2);g([m()],f.prototype,"allTasks",2);g([m()],f.prototype,"taskFilter",2);g([m()],f.prototype,"taskSort",2);g([m()],f.prototype,"taskSearch",2);g([m()],f.prototype,"showCompletedTasks",2);g([m()],f.prototype,"editingTaskId",2);g([m()],f.prototype,"workspaceBrowsePath",2);g([m()],f.prototype,"workspaceBrowseEntries",2);g([m()],f.prototype,"workspaceBreadcrumbs",2);g([m()],f.prototype,"workspaceBrowseSearchQuery",2);g([m()],f.prototype,"workspaceBrowseSearchResults",2);g([m()],f.prototype,"myDayLoading",2);g([m()],f.prototype,"myDayError",2);g([m()],f.prototype,"todaySelectedDate",2);g([m()],f.prototype,"todayViewMode",2);g([m()],f.prototype,"dailyBrief",2);g([m()],f.prototype,"dailyBriefLoading",2);g([m()],f.prototype,"dailyBriefError",2);g([m()],f.prototype,"agentLog",2);g([m()],f.prototype,"agentLogLoading",2);g([m()],f.prototype,"agentLogError",2);g([m()],f.prototype,"briefNotes",2);g([m()],f.prototype,"todayTasks",2);g([m()],f.prototype,"todayTasksLoading",2);g([m()],f.prototype,"todayEditingTaskId",2);g([m()],f.prototype,"todayShowCompleted",2);g([m()],f.prototype,"allyPanelOpen",2);g([m()],f.prototype,"allyMessages",2);g([m()],f.prototype,"allyStream",2);g([m()],f.prototype,"allyDraft",2);g([m()],f.prototype,"allyUnread",2);g([m()],f.prototype,"allySending",2);g([m()],f.prototype,"allyWorking",2);g([m()],f.prototype,"allyAttachments",2);g([m()],f.prototype,"todayQueueResults",2);g([m()],f.prototype,"inboxItems",2);g([m()],f.prototype,"inboxLoading",2);g([m()],f.prototype,"inboxCount",2);g([m()],f.prototype,"inboxScoringId",2);g([m()],f.prototype,"inboxScoringValue",2);g([m()],f.prototype,"inboxFeedbackText",2);g([m()],f.prototype,"inboxSortOrder",2);g([m()],f.prototype,"trustSummary",2);g([m()],f.prototype,"chatPrivateMode",2);g([m()],f.prototype,"privateSessions",2);g([m()],f.prototype,"dynamicSlots",2);g([m()],f.prototype,"workProjects",2);g([m()],f.prototype,"workLoading",2);g([m()],f.prototype,"workError",2);g([m()],f.prototype,"workExpandedProjects",2);g([m()],f.prototype,"workProjectFiles",2);g([m()],f.prototype,"workDetailLoading",2);g([m()],f.prototype,"workResources",2);g([m()],f.prototype,"workResourcesLoading",2);g([m()],f.prototype,"workResourceFilter",2);g([m()],f.prototype,"sessionResources",2);g([m()],f.prototype,"sessionResourcesCollapsed",2);g([m()],f.prototype,"skillsLoading",2);g([m()],f.prototype,"skillsReport",2);g([m()],f.prototype,"skillsError",2);g([m()],f.prototype,"skillsFilter",2);g([m()],f.prototype,"skillEdits",2);g([m()],f.prototype,"skillsBusyKey",2);g([m()],f.prototype,"skillMessages",2);g([m()],f.prototype,"skillsSubTab",2);g([m()],f.prototype,"godmodeSkills",2);g([m()],f.prototype,"godmodeSkillsLoading",2);g([m()],f.prototype,"expandedSkills",2);g([m()],f.prototype,"rosterData",2);g([m()],f.prototype,"rosterLoading",2);g([m()],f.prototype,"rosterError",2);g([m()],f.prototype,"rosterFilter",2);g([m()],f.prototype,"expandedAgents",2);g([m()],f.prototype,"debugLoading",2);g([m()],f.prototype,"debugStatus",2);g([m()],f.prototype,"debugHealth",2);g([m()],f.prototype,"debugModels",2);g([m()],f.prototype,"debugHeartbeat",2);g([m()],f.prototype,"debugCallMethod",2);g([m()],f.prototype,"debugCallParams",2);g([m()],f.prototype,"debugCallResult",2);g([m()],f.prototype,"debugCallError",2);g([m()],f.prototype,"logsLoading",2);g([m()],f.prototype,"logsError",2);g([m()],f.prototype,"logsFile",2);g([m()],f.prototype,"logsEntries",2);g([m()],f.prototype,"logsFilterText",2);g([m()],f.prototype,"logsLevelFilters",2);g([m()],f.prototype,"logsAutoFollow",2);g([m()],f.prototype,"logsTruncated",2);g([m()],f.prototype,"logsCursor",2);g([m()],f.prototype,"logsLastFetchAt",2);g([m()],f.prototype,"logsLimit",2);g([m()],f.prototype,"logsMaxBytes",2);g([m()],f.prototype,"logsAtBottom",2);g([m()],f.prototype,"toasts",2);g([m()],f.prototype,"chatUserNearBottom",2);g([m()],f.prototype,"chatNewMessagesBelow",2);g([m()],f.prototype,"consciousnessStatus",2);g([m()],f.prototype,"focusPulseData",2);g([m()],f.prototype,"trustTrackerData",2);g([m()],f.prototype,"trustTrackerLoading",2);g([m()],f.prototype,"guardrailsData",2);g([m()],f.prototype,"guardrailsLoading",2);g([m()],f.prototype,"guardrailsShowAddForm",2);g([m()],f.prototype,"missionControlData",2);g([m()],f.prototype,"missionControlLoading",2);g([m()],f.prototype,"missionControlError",2);g([m()],f.prototype,"missionControlFullControl",2);g([m()],f.prototype,"godmodeOptions",2);g([m()],f.prototype,"godmodeOptionsLoading",2);g([m()],f.prototype,"dashboardsList",2);g([m()],f.prototype,"dashboardsLoading",2);g([m()],f.prototype,"dashboardsError",2);g([m()],f.prototype,"activeDashboardId",2);g([m()],f.prototype,"activeDashboardHtml",2);g([m()],f.prototype,"activeDashboardManifest",2);g([m()],f.prototype,"dashboardChatOpen",2);g([m()],f.prototype,"dashboardCategoryFilter",2);g([m()],f.prototype,"secondBrainSubtab",2);g([m()],f.prototype,"secondBrainLoading",2);g([m()],f.prototype,"secondBrainError",2);g([m()],f.prototype,"secondBrainIdentity",2);g([m()],f.prototype,"secondBrainMemoryBank",2);g([m()],f.prototype,"secondBrainAiPacket",2);g([m()],f.prototype,"secondBrainSourcesData",2);g([m()],f.prototype,"secondBrainResearchData",2);g([m()],f.prototype,"secondBrainSelectedEntry",2);g([m()],f.prototype,"secondBrainSearchQuery",2);g([m()],f.prototype,"secondBrainSyncing",2);g([m()],f.prototype,"secondBrainBrowsingFolder",2);g([m()],f.prototype,"secondBrainFolderEntries",2);g([m()],f.prototype,"secondBrainFolderName",2);g([m()],f.prototype,"secondBrainVaultHealth",2);g([m()],f.prototype,"secondBrainFileTree",2);g([m()],f.prototype,"secondBrainFileTreeLoading",2);g([m()],f.prototype,"secondBrainFileSearchQuery",2);g([m()],f.prototype,"secondBrainFileSearchResults",2);f=g([Rr("godmode-app")],f);export{_S as A,B,ve as C,TS as D,cm as a,Yg as b,Zg as c,em as d,tm as e,am as f,dm as g,As as h,hm as i,pm as j,fm as k,$s as l,gm as m,mm as n,xd as o,ie as p,os as q,xS as r,Jg as s,Xg as t,um as u,cn as v,Fg as w,rc as x,ic as y,Qb as z};
