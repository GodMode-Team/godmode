const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./work-tab-BpotlMC6.js","./lit-core-CTInmNPB.js","./event-bus-4tWT8iFZ.js","./ctrl-settings-rEJlXhcU.js","./views-settings-Dbe7GjNl.js","./markdown-i_gIkIP3.js","./today-tab-DbGLSlCX.js","./second-brain-tab-C_tAhJTI.js","./second-brain-cP3vM8ym.js","./dashboards-tab-C37cqKcW.js","./dashboards-CrT3s0NG.js"])))=>i.map(i=>d[i]);
import{s as ya,l as X,w as va,e as wa,g as Pt,h as ge,t as ba,i as ft,j as Sa,k as ka,m as Ta,n as _a,o as Aa,p as $a,q as Xe,r as Ze,u as W,_ as w,v as fe,x as jt,y as et,z as Ca,A as K,B as zt,C as Pn,D as xa,E as It,F as In,G as Dt,H as Dn,I as Pa,J as Rn,K as Ia,f as ke,L as mt,M as Da,N as Ra,O as La,P as Ea,Q as Ma,R as Oa,S as Fa,T as Na,U as Ka,V as Ba,W as Ua,X as Wa,Y as qa,Z as Va,$ as ja,a0 as za,a1 as Ha,a2 as Me,a3 as Is,a4 as Ga,a5 as Qa,a6 as Ya,a7 as Ja,a8 as Xa,a9 as Za,aa as eo,ab as to}from"./ctrl-settings-rEJlXhcU.js";import{n as so,b as c,A as y,o as Te,c as tt,i as no,a as st,d as Ln,t as En,e as io,f as ao,r as h}from"./lit-core-CTInmNPB.js";import{c as oo,t as Ie,a as G,i as R,b as Mn,n as On,d as ro,e as Ds,p as Fn,f as lo,l as co,r as uo,g as ho,T as po,P as fo,s as mo,h as go,j as yo,k as vo,m as wo,o as bo,q as So,u as ko,v as To,w as _o,x as Ao,y as $o,z as Co,A as xo}from"./views-settings-Dbe7GjNl.js";import"./markdown-i_gIkIP3.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function s(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=s(i);fetch(i.href,a)}})();const Po=so(Symbol("app-context")),Oe=()=>{},Io=()=>Promise.resolve(void 0);function Do(){return{connected:!1,reconnecting:!1,sessionKey:"main",assistantName:"Prosper",assistantAvatar:null,userName:"",userAvatar:null,theme:"system",themeResolved:"dark",settings:{gatewayUrl:"",token:"",sessionKey:"main",lastActiveSessionKey:"",theme:"system",chatFocusMode:!1,chatShowThinking:!1,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]},basePath:"",gateway:null,send:Io,setTab:Oe,addToast:Oe,openSidebar:Oe,closeSidebar:Oe}}async function Ro(e,t){await ya(e,t),await X(e,!0)}async function Lo(e){await va(e),await X(e,!0)}async function Eo(e){await wa(e),await X(e,!0)}async function Mo(e){await Pt(e),await ge(e),await X(e,!0)}async function Oo(e){await ge(e),await X(e,!0)}function Fo(e){if(!Array.isArray(e))return{};const t={};for(const s of e){if(typeof s!="string")continue;const[n,...i]=s.split(":");if(!n||i.length===0)continue;const a=n.trim(),o=i.join(":").trim();a&&o&&(t[a]=o)}return t}function Nn(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function Kn(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function No(e,t,s){e.nostrProfileAccountId=t,e.nostrProfileFormState=oo(s??void 0)}function Ko(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function Bo(e,t,s){const n=e.nostrProfileFormState;n&&(e.nostrProfileFormState={...n,values:{...n.values,[t]:s},fieldErrors:{...n.fieldErrors,[t]:""}})}function Uo(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function Wo(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const s=Nn(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const n=await fetch(Kn(s),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),i=await n.json().catch(()=>null);if(!n.ok||i?.ok===!1||!i){const a=i?.error??`Profile update failed (${n.status})`;e.nostrProfileFormState={...t,saving:!1,error:a,success:null,fieldErrors:Fo(i?.details)};return}if(!i.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await X(e,!0)}catch(n){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(n)}`,success:null}}}async function qo(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const s=Nn(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const n=await fetch(Kn(s,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),i=await n.json().catch(()=>null);if(!n.ok||i?.ok===!1||!i){const p=i?.error??`Profile import failed (${n.status})`;e.nostrProfileFormState={...t,importing:!1,error:p,success:null};return}const a=i.merged??i.imported??null,o=a?{...t.values,...a}:t.values,l=!!(o.banner||o.website||o.nip05||o.lud16);e.nostrProfileFormState={...t,importing:!1,values:o,error:null,success:i.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:l},i.saved&&await X(e,!0)}catch(n){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(n)}`,success:null}}}function Bn(e){const t=(e??"").trim();if(!t)return null;const s=t.split(":").filter(Boolean);if(s.length<3||s[0]!=="agent")return null;const n=s[1]?.trim(),i=s.slice(2).join(":");return!n||!i?null:{agentId:n,rest:i}}const Vo=80;function z(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const s=()=>{const n=e.querySelector(".chat-thread");if(n){const i=getComputedStyle(n).overflowY;if(i==="auto"||i==="scroll"||n.scrollHeight-n.clientHeight>1)return n}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const n=s();if(!n)return;if(!(t||e.chatUserNearBottom)){e.chatNewMessagesBelow=!0;return}t&&(e.chatHasAutoScrolled=!0),e.chatIsAutoScrolling=!0,n.scrollTop=n.scrollHeight,e.chatNewMessagesBelow=!1,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1});const a=t?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const o=s();!o||!(t||e.chatUserNearBottom)||(e.chatIsAutoScrolling=!0,o.scrollTop=o.scrollHeight,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1}))},a)})})}function Un(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const s=e.querySelector(".log-stream");if(!s)return;const n=s.scrollHeight-s.scrollTop-s.clientHeight;(t||n<80)&&(s.scrollTop=s.scrollHeight)})})}function jo(e,t){const s=t.currentTarget;if(!s||e.chatIsAutoScrolling)return;s.scrollHeight-s.scrollTop-s.clientHeight<Vo?(e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1):e.chatUserNearBottom=!1}function zo(e,t){const s=t.currentTarget;if(!s)return;const n=s.scrollHeight-s.scrollTop-s.clientHeight;e.logsAtBottom=n<80}function nt(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function Ho(e,t){if(e.length===0)return;const s=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),n=URL.createObjectURL(s),i=document.createElement("a"),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");i.href=n,i.download=`godmode-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(n)}function Go(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const s=()=>{const{height:n}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${n}px`)};s(),e.topbarObserver=new ResizeObserver(()=>s()),e.topbarObserver.observe(t)}const M="main";function Qo(e){const t=[`viewing ${Ie(e.tab)} tab`];return e.tab==="dashboards"&&e.activeDashboard&&t.push(`dashboard: ${e.activeDashboard.title}`),e.tab==="workspaces"&&e.selectedWorkspace&&t.push(`workspace: ${e.selectedWorkspace.name}`),e.sidebarOpen&&e.sidebarFilePath&&t.push(`viewing file: ${e.sidebarFilePath}`),`[GodMode Context: ${t.join(", ")}]`}const Rs=50,Yo=80,Jo=12e4;function N(e,t){if(!e)return"";const s=e.trim().replace(/\n/g," ");return s.length<=t?s:s.slice(0,t-1)+"…"}function F(e){return typeof e=="string"?e:e==null?"":JSON.stringify(e)}function Ls(e,t){if(!t||typeof t!="object")return"";const s=t;switch(e.toLowerCase()){case"exec":return s.command?`\`${N(F(s.command),60)}\``:"";case"read":return s.path||s.file_path?`\`${N(F(s.path||s.file_path),50)}\``:"";case"write":return s.path||s.file_path?`→ \`${N(F(s.path||s.file_path),50)}\``:"";case"edit":return s.path||s.file_path?`\`${N(F(s.path||s.file_path),50)}\``:"";case"web_search":return s.query?`"${N(F(s.query),45)}"`:"";case"web_fetch":try{const m=new URL(F(s.url));return m.hostname+(m.pathname!=="/"?m.pathname.slice(0,30):"")}catch{return N(F(s.url||""),50)}case"memory_search":return s.query?`"${N(F(s.query),45)}"`:"";case"browser":const n=F(s.action),i=s.ref?` #${F(s.ref)}`:"",a=s.targetUrl?` ${N(F(s.targetUrl),30)}`:"";return`${n}${i}${a}`;case"message":return s.action?`${F(s.action)}${s.target?` → ${N(F(s.target),25)}`:""}`:"";case"sessions_spawn":return s.task?`"${N(F(s.task),40)}"`:"";case"cron":return s.action?F(s.action):"";case"files_read":return s.fileId?`file:${N(F(s.fileId),20)}`:"";case"image":return s.image?N(F(s.image),40):"";default:const o=Object.keys(s).filter(m=>!["timeout","timeoutMs"].includes(m));if(o.length===0)return"";const l=o[0],p=s[l];return typeof p=="string"?`${l}: ${N(p,35)}`:""}}function Es(e,t){if(!t)return"";const s=e.toLowerCase(),n=t.split(`
`),i=n.length,a=t.length;if(["read","files_read"].includes(s))return`${a.toLocaleString()} chars${i>1?`, ${i} lines`:""}`;if(s==="exec")return i>1?`${i} lines`:N(n[0],50);if(["web_search","memory_search"].includes(s))try{const o=JSON.parse(t),l=o.results?.length??o.count??0;return`${l} result${l!==1?"s":""}`}catch{return N(t,40)}return s==="browser"?t.includes("snapshot")?"snapshot captured":t.includes("success")?"success":N(t,40):a>100?`${a.toLocaleString()} chars`:N(t,50)}function Ms(e){if(!e)return!0;const t=e.toLowerCase();return!(t.includes("error:")||t.includes("failed")||t.includes("exception")||t.includes("not found"))}function Xo(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const s=t.content;if(!Array.isArray(s))return null;const n=s.map(i=>{if(!i||typeof i!="object")return null;const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>!!i);return n.length===0?null:n.join(`
`)}function Os(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=Xo(e);let s;if(typeof e=="string")s=e;else if(t)s=t;else try{s=JSON.stringify(e,null,2)}catch{s=typeof e=="object"?"[object]":String(e)}const n=ba(s,Jo);return n.truncated?`${n.text}

… truncated (${n.total} chars, showing first ${n.text.length}).`:n.text}function Zo(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function er(e){if(e.toolStreamOrder.length<=Rs)return;const t=e.toolStreamOrder.length-Rs,s=e.toolStreamOrder.splice(0,t);for(const n of s)e.toolStreamById.delete(n)}function tr(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function Rt(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),tr(e)}function sr(e,t=!1){if(t){Rt(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>Rt(e),Yo))}function Ht(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],e.currentToolName=null,e.currentToolInfo=null;const t=e;t.compactionStatus&&(t.compactionStatus=null),t.compactionClearTimer!=null&&(window.clearTimeout(t.compactionClearTimer),t.compactionClearTimer=null),Rt(e)}const nr=5e3;function ir(e,t){const s=t.data??{},n=typeof s.phase=="string"?s.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),n==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:n==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},nr))}function ar(e,t){if(!t)return;if(t.stream==="compaction"){ir(e,t);return}if(t.stream!=="tool")return;const s=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(s&&s!==e.sessionKey||!s&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const n=t.data??{},i=typeof n.toolCallId=="string"?n.toolCallId:"";if(!i)return;const a=typeof n.name=="string"?n.name:"tool",o=typeof n.phase=="string"?n.phase:"",l=o==="start"?n.args:void 0,p=o==="update"?Os(n.partialResult):o==="result"?Os(n.result):void 0,m=Date.now();let r=e.toolStreamById.get(i);r?(r.name=a,l!==void 0&&(r.args=l,r.displayArgs=Ls(a,l)),p!==void 0&&(r.output=p,r.resultSummary=Es(a,p),r.success=Ms(p)),r.updatedAt=m):(r={toolCallId:i,runId:t.runId,sessionKey:s,name:a,args:l,output:p,startedAt:typeof t.ts=="number"?t.ts:m,updatedAt:m,message:{},displayArgs:l?Ls(a,l):void 0},e.toolStreamById.set(i,r),e.toolStreamOrder.push(i)),o==="start"?(e.currentToolName=a,e.currentToolInfo={name:a,details:r.displayArgs||void 0,startedAt:r.startedAt}):o==="result"&&(e.currentToolName=null,e.currentToolInfo=null,r.completedAt=m,r.resultSummary=Es(a,r.output),r.success=Ms(r.output)),r.message=Zo(r),er(e),sr(e,o==="result")}const or=500;let ue="",he="";function Wn(e){const t=e.trim();if(!t)return"";if(t.length<or)return G(t);const s=lr(t);if(s<0)return G(t);const n=t.slice(0,s),i=t.slice(s);if(n===ue)return he+G(i);if(n.startsWith(ue)&&ue.length>0){const a=n.slice(ue.length);return he=he+G(a),ue=n,he+G(i)}return he=G(n),ue=n,he+G(i)}function rr(){ue="",he=""}function lr(e){let t=!1,s="";const n=[];let i=0;for(;i<e.length;){const a=e.indexOf(`
`,i),o=a===-1?e.length:a,l=e.slice(i,o),p=l.trimStart(),m=p.match(/^(`{3,}|~{3,})/);if(m){const r=m[1];t?r.charAt(0)===s.charAt(0)&&r.length>=s.length&&p.slice(r.length).trim()===""&&(t=!1,s=""):(t=!0,s=r)}if(!t&&l.trim()===""){let r=o+1;for(;r<e.length&&e[r]===`
`;)r++;r<e.length&&(n.length===0||n[n.length-1]!==r)&&n.push(r)}i=a===-1?e.length:a+1}return n.length<2?-1:n[n.length-2]}const cr=1500,dr=2e3,qn="Copy as markdown",ur="Copied",hr="Copy failed";async function pr(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function Fe(e,t){e.title=t,e.setAttribute("aria-label",t)}function fr(e){const t=e.label??qn;return c`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async s=>{const n=s.currentTarget;if(n?.querySelector(".chat-copy-btn__icon"),!n||n.dataset.copying==="1")return;n.dataset.copying="1",n.setAttribute("aria-busy","true"),n.disabled=!0;const i=await pr(e.text());if(n.isConnected){if(delete n.dataset.copying,n.removeAttribute("aria-busy"),n.disabled=!1,!i){n.dataset.error="1",Fe(n,hr),window.setTimeout(()=>{n.isConnected&&(delete n.dataset.error,Fe(n,t))},dr);return}n.dataset.copied="1",Fe(n,ur),window.setTimeout(()=>{n.isConnected&&(delete n.dataset.copied,Fe(n,t))},cr)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${R.copy}</span>
        <span class="chat-copy-btn__icon-check">${R.check}</span>
      </span>
    </button>
  `}function mr(e){return fr({text:()=>e,label:qn})}const Fs="NO_REPLY",gr=/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,yr=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi,vr=["internal system context injected by godmode","treat it as invisible background instructions only","persistence protocol (non-negotiable)","you must follow these operating instructions. do not echo or quote this block","meta goal: earn trust through competence. search before asking","asking the user for info you could look up is a failure mode"];function gt(e){let t=e.replace(gr,"").replace(yr,"").trim();const s=t.toLowerCase();for(const n of vr){const i=s.indexOf(n);if(i!==-1){const a=i+n.length,o=t.slice(a),l=o.search(/\n\n(?=[A-Z])/);l!==-1?t=o.slice(l).trim():t="";break}}return t}const wr=/^\s*\{[^{}]*"type"\s*:\s*"error"[^{}]*"error"\s*:\s*\{/,br=/^\s*(\d{3})\s+\{/;function Gt(e){const t=e.trim(),s=t.match(br);if(s){const n=Number(s[1]);if(n===529||n===503)return"*Switching models — Claude is temporarily overloaded.*";if(n===400&&t.includes("Unsupported value"))return null}if(t.startsWith("Unsupported value:")||t.includes("is not supported with the")||!wr.test(t))return null;try{const n=JSON.parse(t);if(n?.type==="error"&&n?.error?.message)return(n.error.type??"")==="overloaded_error"?"*Switching models — Claude is temporarily overloaded.*":`*API error: ${n.error.message}*`}catch{}return null}const Sr=/\{"type":"error","error":\{[^}]*"type":"[^"]*"[^}]*\}[^}]*"request_id":"[^"]*"\}/g,kr=/\d{3}\s+\{"type":"error"[^\n]*\}\n?(?:https?:\/\/[^\n]*\n?)?/g,Tr=/\{"type":"error","error":\{"details":[^}]*"type":"overloaded_error"[^}]*\}[^}]*"request_id":"[^"]*"\}\n?/g;function _r(e){return e.replace(kr,"").replace(Sr,"").replace(Tr,"").trim()}const Ar=/^\[([^\]]+)\]\s*/,$r=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],yt=new WeakMap,vt=new WeakMap;function Cr(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:$r.some(t=>e.startsWith(`${t} `))}function Ue(e){const t=e.match(Ar);if(!t)return e;const s=t[1]??"";return Cr(s)?e.slice(t[0].length):e}function wt(e){const t=e.trim();return t===Fs||t.startsWith(`${Fs}
`)}function _e(e){const t=e,s=typeof t.role=="string"?t.role:"",n=t.content;if(typeof n=="string"){const i=gt(n);if(!i)return null;const a=Gt(i);if(a)return a;const o=s==="assistant"?_r(i):i;if(s==="assistant"&&!o)return null;const l=s==="assistant"?ft(o):Ue(i);return wt(l)?null:l}if(Array.isArray(n)){const i=n.map(a=>{const o=a;return o.type==="text"&&typeof o.text=="string"?gt(o.text):null}).filter(a=>typeof a=="string"&&a.length>0);if(i.length>0){const a=i.join(`
`),o=s==="assistant"?ft(a):Ue(a);return wt(o)?null:o}}if(typeof t.text=="string"){const i=gt(t.text);if(!i)return null;const a=s==="assistant"?ft(i):Ue(i);return wt(a)?null:a}return null}function Qt(e){if(!e||typeof e!="object")return _e(e);const t=e;if(yt.has(t))return yt.get(t)??null;const s=_e(e);return yt.set(t,s),s}function Lt(e){const s=e.content,n=[];if(Array.isArray(s))for(const l of s){const p=l;if(p.type==="thinking"&&typeof p.thinking=="string"){const m=p.thinking.trim();m&&n.push(m)}}if(n.length>0)return n.join(`
`);const i=Yt(e);if(!i)return null;const o=[...i.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(l=>(l[1]??"").trim()).filter(Boolean);return o.length>0?o.join(`
`):null}function Vn(e){if(!e||typeof e!="object")return Lt(e);const t=e;if(vt.has(t))return vt.get(t)??null;const s=Lt(e);return vt.set(t,s),s}function Yt(e){const t=e,s=t.content;if(typeof s=="string")return s;if(Array.isArray(s)){const n=s.map(i=>{const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>typeof i=="string");if(n.length>0)return n.join(`
`)}return typeof t.text=="string"?t.text:null}function jn(e){const t=e.trim();if(!t)return"";const s=t.split(/\r?\n/).map(n=>n.trim()).filter(Boolean).map(n=>`_${n}_`);return s.length?["_Reasoning:_",...s].join(`
`):""}const xr=Object.freeze(Object.defineProperty({__proto__:null,extractRawText:Yt,extractText:_e,extractTextCached:Qt,extractThinking:Lt,extractThinkingCached:Vn,formatApiError:Gt,formatReasoningMarkdown:jn,stripEnvelope:Ue},Symbol.toStringTag,{value:"Module"}));function Jt(e){const t=e;let s=typeof t.role=="string"?t.role:"unknown";const n=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",i=t.content,a=Array.isArray(i)?i:null,o=Array.isArray(a)&&a.some(f=>{const g=f,v=(typeof g.type=="string"?g.type:"").toLowerCase();return v==="toolresult"||v==="tool_result"}),l=typeof t.toolName=="string"||typeof t.tool_name=="string";(n||o||l)&&(s="toolResult");let p=[];typeof t.content=="string"?p=[{type:"text",text:t.content}]:Array.isArray(t.content)?p=t.content.map(f=>({type:f.type||"text",text:f.text,name:f.name,args:f.args||f.arguments})):typeof t.text=="string"&&(p=[{type:"text",text:t.text}]);const m=typeof t.timestamp=="number"?t.timestamp:Date.now(),r=typeof t.id=="string"?t.id:void 0;return{role:s,content:p,timestamp:m,id:r}}function it(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function zn(e){const t=e,s=typeof t.role=="string"?t.role.toLowerCase():"";return s==="toolresult"||s==="tool_result"}const Ns={pdf:"📕",doc:"📘",docx:"📘",txt:"📄",rtf:"📄",xls:"📗",xlsx:"📗",csv:"📊",ppt:"📙",pptx:"📙",jpg:"🖼️",jpeg:"🖼️",png:"🖼️",gif:"🖼️",webp:"🖼️",svg:"🖼️",mp3:"🎵",wav:"🎵",m4a:"🎵",mp4:"🎬",mov:"🎬",avi:"🎬",zip:"📦",rar:"📦","7z":"📦",tar:"📦",gz:"📦",js:"📜",ts:"📜",py:"📜",json:"📜",html:"📜",css:"📜",md:"📜",default:"📎"};function Hn(e){const t=e.split(".").pop()?.toLowerCase()||"";return Ns[t]??Ns.default}function Gn(e,t){const s=t.split(".").pop()?.toLowerCase()||"";return{pdf:"PDF Document",doc:"Word Document",docx:"Word Document",xls:"Excel Spreadsheet",xlsx:"Excel Spreadsheet",csv:"CSV File",ppt:"PowerPoint",pptx:"PowerPoint",txt:"Text File",md:"Markdown",json:"JSON File",zip:"ZIP Archive",png:"PNG Image",jpg:"JPEG Image",jpeg:"JPEG Image",gif:"GIF Image",mp3:"Audio File",mp4:"Video File",html:"HTML Document",css:"Stylesheet",js:"JavaScript",ts:"TypeScript",py:"Python"}[s]||e.split("/")[1]?.toUpperCase()||"File"}const Pr={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},Ir={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},proof_editor:{icon:"fileText",title:"Proof Editor",actions:{create:{label:"create",detailKeys:["title"]},write:{label:"write",detailKeys:["slug"]},read:{label:"read",detailKeys:["slug"]},comment:{label:"comment",detailKeys:["slug"]},suggest:{label:"suggest",detailKeys:["slug"]},open:{label:"open",detailKeys:["slug"]},share:{label:"share",detailKeys:["slug"]},export_gdrive:{label:"drive",detailKeys:["slug"]},list:{label:"list"}}},queue_steer:{icon:"messageSquare",title:"Queue Steer",detailKeys:["itemId","instruction"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},Dr={fallback:Pr,tools:Ir},Qn=Dr,Ks=Qn.fallback??{icon:"puzzle"},Rr=Qn.tools??{};function Lr(e){return(e??"tool").trim()}function Er(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(s=>s.length<=2&&s.toUpperCase()===s?s:`${s.at(0)?.toUpperCase()??""}${s.slice(1)}`).join(" "):"Tool"}function Mr(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function Yn(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const s=t.split(/\r?\n/)[0]?.trim()??"";return s?s.length>160?`${s.slice(0,157)}…`:s:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(n=>Yn(n)).filter(n=>!!n);if(t.length===0)return;const s=t.slice(0,3).join(", ");return t.length>3?`${s}…`:s}}}function Or(e,t){if(!e||typeof e!="object")return;let s=e;for(const n of t.split(".")){if(!n||!s||typeof s!="object")return;s=s[n]}return s}function Fr(e,t){for(const s of t){const n=Or(e,s),i=Yn(n);if(i)return i}}function Nr(e){if(!e||typeof e!="object")return;const t=e,s=typeof t.path=="string"?t.path:void 0;if(!s)return;const n=typeof t.offset=="number"?t.offset:void 0,i=typeof t.limit=="number"?t.limit:void 0;return n!==void 0&&i!==void 0?`${s}:${n}-${n+i}`:s}function Kr(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function Br(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function Ur(e){const t=Lr(e.name),s=t.toLowerCase(),n=Rr[s],i=n?.icon??Ks.icon??"puzzle",a=n?.title??Er(t),o=n?.label??t,l=e.args&&typeof e.args=="object"?e.args.action:void 0,p=typeof l=="string"?l.trim():void 0,m=Br(n,p),r=Mr(m?.label??p);let f;s==="read"&&(f=Nr(e.args)),!f&&(s==="write"||s==="edit"||s==="attach")&&(f=Kr(e.args));const g=m?.detailKeys??n?.detailKeys??Ks.detailKeys??[];return!f&&g.length>0&&(f=Fr(e.args,g)),!f&&e.meta&&(f=e.meta),f&&(f=qr(f)),{name:t,icon:i,title:a,label:o,verb:r,detail:f}}function Wr(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function qr(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const Vr=80,jr=2,Bs=100,zr=3;function Us(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const s=JSON.parse(t);return"```json\n"+JSON.stringify(s,null,2)+"\n```"}catch{}return e}function Hr(e){const t=e.split(`
`),s=t.slice(0,jr),n=s.join(`
`);return n.length>Bs?n.slice(0,Bs)+"…":s.length<t.length?n+"…":n}function Gr(e){const t=e,s=Xr(t.content),n=[];for(const i of s){const a=(typeof i.type=="string"?i.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(a)||typeof i.name=="string"&&i.arguments!=null)&&n.push({kind:"call",name:i.name??"tool",args:Zr(i.arguments??i.args)})}for(const i of s){const a=(typeof i.type=="string"?i.type:"").toLowerCase();if(a!=="toolresult"&&a!=="tool_result")continue;const o=el(i);if(qs(o))continue;const l=typeof i.name=="string"?i.name:"tool";n.push({kind:"result",name:l,text:o})}if(zn(e)&&!n.some(i=>i.kind==="result")){const i=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",a=Qt(e)??void 0;qs(a)||n.push({kind:"result",name:i,text:a})}return n}const Qr=new Set(["write","read","edit","attach"]);function Yr(e){if(!e||typeof e!="object")return null;const t=e,s=t.path??t.file_path??t.filePath;return typeof s=="string"&&s.trim()?s.trim():null}function Jr(e){if(!e)return null;const t=e.match(/(?:\/(?:Users|home|tmp|var)\/\S+|~\/\S+)/);return t?t[0].replace(/[.,;:!?)'"]+$/,""):null}function Ws(e,t,s,n,i){const a=Ur({name:e.name,args:e.args}),o=Wr(a),l=!!e.text?.trim(),p=tl(e.text);if(p?.type==="proof"&&p.slug)return c`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${R.fileText}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name">${p.title??"Proof Document"}</span>
          <span class="chat-artifact-card__type">Live doc</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${n?c`<button class="chat-artifact-card__btn" @click=${C=>{C.stopPropagation(),n(p.slug)}}>Open</button>`:y}
          ${p.filePath&&i?c`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${C=>{C.stopPropagation(),i(p.filePath)}}>Drive</button>`:y}
        </div>
      </div>
    `;const m=Qr.has(e.name.toLowerCase())?Yr(e.args)??Jr(e.text):null;if(m&&e.kind==="result"){const C=m.split("/").pop()||m,L=C.split(".").pop()?.toLowerCase()||"",B=Hn(C),S=Gn(L,C);return c`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${B}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name" title=${m}>${C}</span>
          <span class="chat-artifact-card__type">${S}</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${s?c`<button class="chat-artifact-card__btn" @click=${T=>{T.stopPropagation(),s(m)}}>Open</button>`:t&&l?c`<button class="chat-artifact-card__btn" @click=${T=>{T.stopPropagation(),t(Us(e.text))}}>View</button>`:y}
          ${i?c`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${T=>{T.stopPropagation(),i(m)}}>Drive</button>`:y}
        </div>
      </div>
    `}const r=!!t||!!(s&&m),f=r?C=>{if(C.stopPropagation(),s&&m){s(m);return}if(t&&l){t(Us(e.text));return}if(t){const L=`## ${a.label}

${o?`**Command:** \`${o}\`

`:""}*No output — tool completed successfully.*`;t(L)}}:void 0,g=e.text?e.text.split(`
`).length:0,v=l&&(e.text?.length??0)<=Vr,b=l&&!v&&g>zr,_=l&&!b,P=!l,x=e.kind==="call"?"chat-tool-card--call":"chat-tool-card--result";return c`
    <div
      class="chat-tool-card ${x} ${r?"chat-tool-card--clickable":""}"
      @click=${f}
      role=${r?"button":y}
      tabindex=${r?"0":y}
      @keydown=${r?C=>{C.key!=="Enter"&&C.key!==" "||(C.preventDefault(),C.stopPropagation(),f?.(C))}:y}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${R[a.icon]}</span>
          <span>${a.label}</span>
        </div>
        ${r?c`<span class="chat-tool-card__action">${l?"View":""} ${R.check}</span>`:y}
        ${P&&!r?c`<span class="chat-tool-card__status">${R.check}</span>`:y}
      </div>
      ${o?c`<div class="chat-tool-card__detail">${o}</div>`:y}
      ${P?c`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:y}
      ${b?c`<details class="chat-tool-card__expandable" @click=${C=>C.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${Hr(e.text)}</summary>
            <div class="chat-tool-card__full-output mono">${e.text}</div>
          </details>`:y}
      ${_?c`<div class="chat-tool-card__inline mono">${e.text}</div>`:y}
    </div>
  `}function Xr(e){return Array.isArray(e)?e.filter(Boolean):[]}function Zr(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function el(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function tl(e){if(!e)return null;try{const t=JSON.parse(e);return t._sidebarAction?{type:t._sidebarAction.type,slug:t._sidebarAction.slug,title:t.title,filePath:t.filePath}:null}catch{return null}}function qs(e){if(!e)return!1;const t=e.toLowerCase();return t.includes("process exited")?!1:t.includes("(no new output)")&&t.includes("still running")}function sl(e,t){if(!t)return;const n=e.target.closest("a");if(!n)return;const i=n.getAttribute("href");if(i){if(i.startsWith("file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(7);a.startsWith("/~/")&&(a="~"+a.slice(2));try{a=decodeURIComponent(a)}catch{}t(a);return}if(i.startsWith("godmode-file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(15);try{a=decodeURIComponent(a)}catch{}t(a);return}}}const Vs={exec:["Executing","Running","Conjuring","Manifesting","Brewing"],read:["Reading","Perusing","Absorbing","Scanning","Devouring"],write:["Writing","Scribbling","Crafting","Inscribing","Authoring"],edit:["Editing","Refining","Polishing","Tweaking","Sculpting"],browser:["Browsing","Surfing","Exploring","Navigating","Spelunking"],web_search:["Searching","Hunting","Investigating","Sleuthing","Scouring"],web_fetch:["Fetching","Grabbing","Retrieving","Summoning","Acquiring"],memory_search:["Remembering","Recalling","Pondering","Reflecting"],image:["Analyzing","Examining","Scrutinizing","Inspecting","Beholding"],default:["Working on","Processing","Handling","Tinkering with","Wrangling"]};function Jn(e){const t=e.toLowerCase().replace(/[^a-z_]/g,""),s=Vs[t]??Vs.default,n=Math.floor(Date.now()/2e3)%s.length;return s[n]}function nl(e){const t=e.match(/\[Files uploaded:\s*([^\]]+)\]/);if(!t)return null;const s=t[1],n=[],i=/([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;let a;for(;(a=i.exec(s))!==null;)n.push({fileName:a[1].trim(),fileId:a[2].trim(),size:a[3].trim(),mimeType:a[4].trim()});return n.length>0?n:null}function il(e){return c`
    <div class="chat-file-uploads">
      ${e.map(t=>c`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${Hn(t.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${t.fileName}">${t.fileName}</span>
            <span class="chat-file-upload-card__meta">${t.size} • ${Gn(t.mimeType,t.fileName)}</span>
          </div>
        </div>
      `)}
    </div>
  `}function al(e){return e.replace(/\[Files uploaded:[^\]]+\]\s*/g,"").trim()}const js=/<document>\s*<source>([^<]*)<\/source>\s*<mime_type>([^<]*)<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function ol(e){const t=[];let s;for(;(s=js.exec(e))!==null;){const n=s[1]?.trim()||"file",i=s[2]?.trim()||"application/octet-stream";t.push({fileName:n,fileId:"",size:"",mimeType:i})}return js.lastIndex=0,t.length>0?t:null}const rl=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function ll(e){return e.replace(rl,"").trim()}function cl(e){if(!e)return e;if(e.startsWith("System:")||e.startsWith("GatewayRestart:")||e.startsWith("Sender (untrusted metadata)")){const a=e.indexOf(`

`);return a!==-1?e.slice(a+2).trim():""}let i=e.split(`
`).filter(a=>{const o=a.trim();return!o.startsWith("System:")&&!o.startsWith("GatewayRestart:")}).join(`
`);for(;i.startsWith(`
`);)i=i.slice(1);return i.trim()}function dl(e){return typeof e!="number"||!Number.isFinite(e)||e<=0?null:e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${Math.round(e/1024)} KB`:`${Math.round(e)} B`}function Et(e){const t=e,s=t.content,n=[];if(Array.isArray(s))for(const a of s){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="image"){const l=o.source;if(l?.type==="base64"&&typeof l.data=="string"){const p=l.data,m=l.media_type||"image/png",r=p.startsWith("data:")?p:`data:${m};base64,${p}`;n.push({url:r})}else if(typeof o.data=="string"&&typeof o.mimeType=="string"){const p=o.data.startsWith("data:")?o.data:`data:${o.mimeType};base64,${o.data}`;n.push({url:p})}else typeof o.url=="string"?n.push({url:o.url}):o.omitted===!0&&n.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}else if(o.type==="image_url"){const l=o.image_url;typeof l?.url=="string"&&n.push({url:l.url})}else o.type==="attachment"&&typeof o.content=="string"&&(o.mimeType||"").startsWith("image/")&&n.push({url:o.content,alt:o.fileName||void 0});if(o.type==="text"&&typeof o.text=="string"){const l=/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,p=o.text.match(l);if(p)for(const m of p)n.push({url:m})}if(Array.isArray(o.content))for(const l of o.content){if(typeof l!="object"||l===null)continue;const p=l;if(p.type==="image"){const m=p.source;if(m?.type==="base64"&&typeof m.data=="string"){const r=m.media_type||"image/png",f=m.data.startsWith("data:")?m.data:`data:${r};base64,${m.data}`;n.push({url:f})}else if(typeof p.data=="string"&&typeof p.mimeType=="string"){const r=p.data.startsWith("data:")?p.data:`data:${p.mimeType};base64,${p.data}`;n.push({url:r})}else p.omitted===!0&&n.push({omitted:!0,bytes:typeof p.bytes=="number"?p.bytes:void 0,mimeType:typeof p.mimeType=="string"?p.mimeType:void 0,alt:typeof p.fileName=="string"?p.fileName:void 0})}}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="image"&&typeof o.content=="string"){const l=o.mimeType||"image/png",p=o.content.startsWith("data:")?o.content:`data:${l};base64,${o.content}`;n.push({url:p,alt:o.fileName||void 0})}else o.type==="image"&&o.omitted===!0&&n.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}return n}function ul(e){const t=e,s=t.content,n=[];if(Array.isArray(s))for(const a of s){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="attachment"&&typeof o.content=="string"){const l=o.mimeType||"application/octet-stream";l.startsWith("image/")||n.push({fileName:o.fileName||"file",mimeType:l,content:o.content})}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const o=a;o.type==="file"&&typeof o.content=="string"&&n.push({fileName:o.fileName||"file",mimeType:o.mimeType||"application/octet-stream",content:o.content})}return n}function hl(e,t){return c`
    <div class="chat-group assistant">
      ${Xt("assistant",{assistantName:e?.name,assistantAvatar:e?.avatar})}
      <div class="chat-group-messages">
        ${t?c`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${Jn(t.name)}</span>
                    <strong>${t.name}</strong>
                  </span>
                </div>
                ${t.details?c`<span class="chat-working-indicator__details">${t.details}</span>`:y}
              </div>
            `:y}
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
  `}function pl(e,t,s,n,i){const a=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),o=n?.name??"Assistant";return c`
    <div class="chat-group assistant">
      ${Xt("assistant",{assistantName:n?.name,assistantAvatar:n?.avatar})}
      <div class="chat-group-messages">
        ${i?c`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${Jn(i.name)}</span>
                    <strong>${i.name}</strong>
                  </span>
                </div>
                ${i.details?c`<span class="chat-working-indicator__details">${i.details}</span>`:y}
              </div>
            `:y}
        ${Xn({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},s)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${o}</span>
          <span class="chat-group-timestamp">${a}</span>
        </div>
      </div>
    </div>
  `}function fl(e,t){const s=it(e.role),n=t.assistantName??"Assistant",i=t.userName??"You",a=s==="user"?i:s==="assistant"?n:s,o=s==="user"?"user":s==="assistant"?"assistant":"other",l=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return c`
    <div class="chat-group ${o}">
      ${Xt(e.role,{assistantName:n,assistantAvatar:t.assistantAvatar??null,userName:i,userAvatar:t.userAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((p,m)=>Xn(p.message,{isStreaming:e.isStreaming&&m===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar,t.onOpenFile,t.onOpenProof,t.onImageClick,t.resolveImageUrl,t.onPushToDrive))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${a}</span>
          <span class="chat-group-timestamp">${l}</span>
        </div>
      </div>
    </div>
  `}function Xt(e,t){const s=it(e),n=t?.assistantName?.trim()||"Assistant",i=typeof t?.assistantAvatar=="string"?t.assistantAvatar.trim():"",a=t?.userName?.trim()||"You",o=typeof t?.userAvatar=="string"?t.userAvatar.trim():"",l=s==="user"?"user":s==="assistant"?"assistant":s==="tool"?"tool":"other";return s==="user"?o&&zs(o)?c`<img
        class="chat-avatar ${l}"
        src="${o}"
        alt="${a}"
      />`:o?c`<div class="chat-avatar ${l}">${o}</div>`:c`<div class="chat-avatar ${l}">${a.charAt(0).toUpperCase()||"C"}</div>`:s==="assistant"?i&&zs(i)?c`<img
        class="chat-avatar ${l}"
        src="${i}"
        alt="${n}"
      />`:i?c`<div class="chat-avatar ${l}" style="color: var(--accent);">${i}</div>`:c`<div class="chat-avatar ${l}" style="color: var(--accent);">⚛️</div>`:s==="tool"?c`<div class="chat-avatar ${l}">⚙</div>`:c`<div class="chat-avatar ${l}">?</div>`}function zs(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function Hs(e,t,s){if(e.length===0)return y;const n=e.map((a,o)=>{if((a.omitted||!a.url)&&s){const l=s(o);if(l)return{...a,resolvedUrl:l}}return a}),i=n.filter(a=>(a.resolvedUrl||a.url)&&!a.omitted||a.resolvedUrl).map(a=>({url:a.resolvedUrl||a.url,alt:a.alt}));return c`
    <div class="chat-message-images">
      ${n.map(a=>{const o=a.resolvedUrl||a.url;if(!o){const p=dl(a.bytes),r=[a.mimeType?a.mimeType.replace("image/","").toUpperCase():null,p].filter(Boolean).join(" · ");return c`
            <div
              class="chat-message-image chat-message-image--omitted"
              title=${a.alt??"Sent image"}
              aria-label="Sent image"
            >
              <span class="chat-message-image__omitted-icon">🖼</span>
              <span class="chat-message-image__omitted-label">${r||"Image"}</span>
            </div>
          `}const l=i.findIndex(p=>p.url===o);return c`
          <img
            src=${o}
            alt=${a.alt??"Attached image"}
            class="chat-message-image"
            @error=${p=>{const m=p.target;m.style.display="none"}}
            @click=${()=>{t&&t(o,i,Math.max(0,l))}}
          />
        `})}
    </div>
  `}function ml(e){return e.length===0?y:c`
    <div class="chat-message-files">
      ${e.map(t=>{const s=t.fileName.length>30?t.fileName.slice(0,27)+"...":t.fileName;return c`
            <a
              href=${t.content}
              download=${t.fileName}
              class="chat-file-attachment"
              title=${t.fileName}
            >
              📎 ${s}
            </a>
          `})}
    </div>
  `}function Xn(e,t,s,n,i,a,o,l){try{return gl(e,t,s,n,i,a,o,l)}catch(p){return console.error("[chat] message render error:",p),c`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `}}function gl(e,t,s,n,i,a,o,l){const p=e,m=typeof p.role=="string"?p.role:"unknown",r=zn(e)||m.toLowerCase()==="toolresult"||m.toLowerCase()==="tool_result"||typeof p.toolCallId=="string"||typeof p.tool_call_id=="string",f=Gr(e),g=f.length>0,v=Et(e),b=v.length>0,_=typeof p._chatIdx=="number"?p._chatIdx:-1,P=o&&_>=0?O=>o(_,O):void 0,x=ul(e),C=x.length>0,L=Qt(e),B=t.showReasoning&&m==="assistant"?Vn(e):null,S=m==="user"&&L?nl(L):null,T=m==="user"?Yt(e):null,$=T?ol(T):null,I=[...S??[],...$??[]],k=I.length>0;let D=L;if(m==="user"&&D&&(D=cl(D),D=ll(D)),D&&(D=D.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim()||null),D){const O=Gt(D);O&&(D=O)}k&&D&&(D=al(D));const j=D?.trim()?D:null,E=B?jn(B):null,Q=j,ce=m==="assistant"&&!!Q?.trim(),de=["chat-bubble",ce?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");if(g&&r)return c`
      ${b?Hs(v,a,P):y}
      ${f.map(O=>Ws(O,s,n,i,l))}
    `;if(!Q&&!g&&!b&&!C&&!k&&!E){const O=typeof p.errorMessage=="string"?p.errorMessage:null;if(p.stopReason==="error"&&O){let U=O;const A=O.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(A){const Z=parseInt(A[1]).toLocaleString(),Ee=parseInt(A[2]).toLocaleString();U=`Context overflow: ${Z} tokens exceeded the ${Ee} token limit. The conversation needs to be compacted.`}else O.includes("prompt is too long")&&(U="Context overflow: The conversation is too long for the model.");return c`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${U}</div>
        </div>
      `}if(m==="user"&&L?.trim()){let U=L.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim();if(U.startsWith("System:")||U.startsWith("GatewayRestart:")||U.startsWith("Sender (untrusted metadata)")){const A=U.indexOf(`

`);U=A!==-1?U.slice(A+2).trim():""}if(U)return c`
          <div class="chat-bubble fade-in">
            <div class="chat-text">${U}</div>
          </div>
        `}return y}return c`
    <div class="${de}">
      ${ce?mr(Q):y}
      ${k?il(I):y}
      ${Hs(v,a,P)}
      ${ml(x)}
      ${E?c`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${Te(G(E))}</div>
            </details>`:y}
      ${Q?c`<div class="chat-text" @click=${O=>sl(O,n)}>${Te(t.isStreaming?Wn(Q):G(Q))}</div>`:y}
      ${f.map(O=>Ws(O,s,n,i,l))}
    </div>
  `}function yl(e){const t=e,s=typeof t.content=="string"?t.content:"",n=typeof t.keptMessages=="number"?t.keptMessages:null,i=typeof t.timestamp=="number"?new Date(t.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"";return c`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${n!==null?c`<span class="chat-compaction-summary__kept">${n} messages kept</span>`:y}
      </div>
      <div class="chat-compaction-summary__content">
        ${Te(G(s))}
      </div>
      ${i?c`<div class="chat-compaction-summary__timestamp">${i}</div>`:y}
    </div>
  `}function vl(e){return e.isCompactionSummary===!0}const Zn=50,ei=200,wl="Assistant";function je(e,t){if(typeof e!="string")return;const s=e.trim();if(s)return s.length<=t?s:s.slice(0,t)}function Mt(e){const t=je(e?.name,Zn)??wl,s=je(e?.avatar??void 0,ei)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:s}}function bl(){return Mt(typeof window>"u"?{}:{name:window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__CLAWDBOT_ASSISTANT_AVATAR__})}const Sl="You";function Gs(e){const t=je(e?.name,Zn)??Sl,s=je(e?.avatar??void 0,ei)??null;return{name:t,avatar:s}}function kl(){return Gs(typeof window>"u"?{}:{name:window.__CLAWDBOT_USER_NAME__,avatar:window.__CLAWDBOT_USER_AVATAR__})}async function ti(e,t){if(!e.client||!e.connected)return;const s=e.sessionKey.trim(),n=s?{sessionKey:s}:{};try{const i=await e.client.request("agent.identity.get",n);if(!i)return;const a=Mt(i);e.assistantName=a.name,e.assistantAvatar=a.avatar,e.assistantAgentId=a.agentId??null}catch{}}let Qs=!1;function Ys(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let s=0;s<e.length;s++)t+=e[s].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function Tl(){const e=new Uint8Array(16),t=Date.now();for(let s=0;s<e.length;s++)e[s]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function _l(){Qs||(Qs=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function at(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),Ys(t)}return _l(),Ys(Tl())}let pe=null,We=null;function si(){return We}const ni=new Map,le=new Map;function Ot(e,t){const s=t.filter(n=>n?.role==="user").length;ni.set(e,s)}async function ii(e,t){try{const s=await e.request("chat.history",{sessionKey:t,limit:200}),n=Array.isArray(s.messages)?s.messages:[];return le.set(t,n),Ot(t,n),n}catch{return le.get(t)??[]}}let be=0;async function q(e){if(!e.client||!e.connected)return;const t=e.sessionKey,s=++be;e.chatLoading=!0,e.lastError=null;try{const n=await e.client.request("chat.history",{sessionKey:t,limit:200});if(s!==be||e.sessionKey!==t)return;e.chatMessages=Array.isArray(n.messages)?n.messages:[],e.chatThinkingLevel=n.thinkingLevel??null,Ot(t,e.chatMessages),le.set(t,e.chatMessages)}catch{if(s!==be||e.sessionKey!==t)return;try{const n=await e.client.request("chat.history",{sessionKey:t,limit:200});if(s!==be||e.sessionKey!==t)return;e.chatMessages=Array.isArray(n.messages)?n.messages:[],e.chatThinkingLevel=n.thinkingLevel??null,Ot(t,e.chatMessages),le.set(t,e.chatMessages)}catch(n){if(s!==be||e.sessionKey!==t)return;e.lastError=String(n)}}finally{s===be&&(e.chatLoading=!1)}}async function ai(e,t){const s=[...e.chatMessages],n=s.length;await q(e),e.chatStream=null,!t?.allowShrink&&n>0&&(e.chatMessages.length<n||Al(s,e.chatMessages))&&(e.chatMessages=s,setTimeout(()=>{q(e).then(()=>{e.chatStream=null})},2e3))}function Al(e,t){const s=$l(e,a=>a?.role==="user");if(s===-1)return!1;const i=e[s].timestamp;return typeof i!="number"?!1:!t.some(a=>a?.role==="user"&&a?.timestamp===i)}function $l(e,t){for(let s=e.length-1;s>=0;s--)if(t(e[s]))return s;return-1}function Cl(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}async function Zt(e,t,s,n){if(!e.client||!e.connected)return!1;let i=t.trim();const a=s&&s.length>0;if(!i&&!a)return!1;!i&&a&&(i="[attached]");const o=Date.now();if(!n?.skipOptimisticUpdate){const m=[];if(i&&m.push({type:"text",text:i}),a)for(const r of s)r.mimeType.startsWith("image/")?m.push({type:"image",source:{type:"base64",media_type:r.mimeType,data:r.dataUrl}}):m.push({type:"attachment",mimeType:r.mimeType,fileName:r.fileName,content:r.dataUrl});e.chatMessages=[...e.chatMessages,{role:"user",content:m,timestamp:o}]}e.chatSending=!0,e.chatSendingSessionKey=e.sessionKey,e.lastError=null;const l=at();e.chatRunId=l,e.chatStream="",e.chatStreamStartedAt=o,pe={message:i,attachments:a?s:void 0};let p;if(a){const m=[],r=[];for(const f of s){const g=Cl(f.dataUrl);if(g)if(g.mimeType.startsWith("image/"))m.push({type:"image",mimeType:g.mimeType,content:g.content,fileName:f.fileName});else{const v=f.fileName||"file";r.push(`<document>
<source>${v}</source>
<mime_type>${g.mimeType}</mime_type>
<content encoding="base64">
${g.content}
</content>
</document>`)}}if(m.length>0&&(p=m),r.length>0&&(i=`${r.join(`

`)}

${i}`),m.length>0){const f=e.chatMessages.length-1,g=e.sessionKey,v=e.client.request("images.cache",{images:m.map(b=>({data:b.content,mimeType:b.mimeType,fileName:b.fileName})),sessionKey:g}).then(b=>{if(b?.cached&&b.cached.length>0){const _=b.cached.map((P,x)=>({messageIndex:f,imageIndex:x,hash:P.hash,mimeType:P.mimeType,bytes:P.bytes,role:"user",timestamp:o}));return e.client.request("images.updateIndex",{sessionKey:g,images:_}).catch(()=>{})}}).catch(()=>{});We=v,v.finally(()=>{We===v&&(We=null)})}}try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:i,deliver:!1,idempotencyKey:l,attachments:p}),!0}catch(m){const r=String(m);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=r,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+r}],timestamp:Date.now()}],!1}finally{e.chatSending=!1,e.chatSendingSessionKey=null}}async function oi(e){const t=e.pendingRetry;return t?(e.pendingRetry=null,Zt(e,t.message,t.attachments,{skipOptimisticUpdate:!0})):!1}function xl(e){e.pendingRetry=null}async function es(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(s){return e.lastError=String(s),!1}}function ri(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?e.chatStream!==null?null:"final":null;if(t.state!=="delta"&&rr(),t.state==="delta"){const s=_e(t.message);if(typeof s=="string"){const n=e.chatStream??"";(!n||s.length>=n.length)&&(e.chatStream=s)}}else if(t.state==="final")e.chatRunId=null,e.chatStreamStartedAt=null,pe=null;else if(t.state==="aborted")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,pe=null;else if(t.state==="error"){e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;const s=t.errorMessage??"chat error";e.lastError=s;const n=s.includes("prompt is too long")||s.includes("tokens >");n&&pe&&(e.pendingRetry={message:pe.message,attachments:pe.attachments,timestamp:Date.now()}),pe=null;let i=s;if(n){const a=s.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(a){const o=parseInt(a[1]).toLocaleString(),l=parseInt(a[2]).toLocaleString();i=`⚠️ Context overflow: ${o} tokens exceeds ${l} limit. Compact the conversation, then click "Retry" to resend your message.`}else i='⚠️ Context overflow: The conversation is too long. Compact and click "Retry" to resend.'}e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:i}],timestamp:Date.now(),isError:!0}]}return t.state}const te=Object.freeze(Object.defineProperty({__proto__:null,abortChatRun:es,clearPendingRetry:xl,getPendingImageCache:si,handleChatEvent:ri,laneMessageCache:le,loadChatHistory:q,loadChatHistoryAfterFinal:ai,loadLaneHistory:ii,retryPendingMessage:oi,sendChatMessage:Zt,sessionTurnCounts:ni},Symbol.toStringTag,{value:"Module"}));function Ft(e){return typeof e=="object"&&e!==null}function Pl(e){if(!Ft(e))return null;const t=typeof e.id=="string"?e.id.trim():"",s=e.request;if(!t||!Ft(s))return null;const n=typeof s.command=="string"?s.command.trim():"";if(!n)return null;const i=typeof e.createdAtMs=="number"?e.createdAtMs:0,a=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!i||!a?null:{id:t,request:{command:n,cwd:typeof s.cwd=="string"?s.cwd:null,host:typeof s.host=="string"?s.host:null,security:typeof s.security=="string"?s.security:null,ask:typeof s.ask=="string"?s.ask:null,agentId:typeof s.agentId=="string"?s.agentId:null,resolvedPath:typeof s.resolvedPath=="string"?s.resolvedPath:null,sessionKey:typeof s.sessionKey=="string"?s.sessionKey:null},createdAtMs:i,expiresAtMs:a}}function Il(e){if(!Ft(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function li(e){const t=Date.now();return e.filter(s=>s.expiresAtMs>t)}function Dl(e,t){const s=li(e).filter(n=>n.id!==t.id);return s.push(t),s}function Js(e,t){return li(e).filter(s=>s.id!==t)}const Rl=1800*1e3;function ci(e){return{openclawVersion:e.openclaw.version,openclawLatest:e.openclaw.latest,openclawUpdateAvailable:e.openclaw.updateAvailable,openclawInstallKind:e.openclaw.installKind,openclawChannel:e.openclaw.channel,pluginVersion:e.plugin.version,pluginLatest:e.plugin.latest,pluginUpdateAvailable:e.plugin.updateAvailable,pendingDeploy:e.pendingDeploy??null,fetchOk:e.fetchOk}}function di(e){const t=typeof e.behind=="number"?e.behind:null;return{openclawVersion:String(e.version??"unknown"),openclawLatest:null,openclawUpdateAvailable:(t??0)>0,openclawInstallKind:"unknown",openclawChannel:null,pluginVersion:"unknown",pluginLatest:null,pluginUpdateAvailable:!1,pendingDeploy:null,fetchOk:e.fetchOk}}async function Ll(e){if(!(!e.client||!e.connected)){e.updateLoading=!0,e.updateError=null;try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=ci(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});t.error&&(e.updateError=String(t.error)),e.updateStatus=di(t),e.updateLastChecked=Date.now()}catch(t){e.updateError=String(t)}}finally{e.updateLoading=!1}}}async function Xs(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=ci(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});e.updateStatus=di(t),e.updateLastChecked=Date.now()}catch{}}}function El(e){e.updatePollInterval==null&&(Xs(e),e.updatePollInterval=window.setInterval(()=>{Xs(e)},Rl))}function Ml(e){const t=e;t.updatePollInterval!=null&&(clearInterval(t.updatePollInterval),t.updatePollInterval=null)}async function Ol(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.postStatus",{});if(!t)return;const s=t.overallStatus,n=t.summary;if(!n)return;const i=s==="healthy"?"success":s==="degraded"?"error":"warning";typeof e.showToast=="function"&&e.showToast(n,i),Ll(e)}catch{}}const ui={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},Zs=ui,Nt={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(ui));new Set(Object.values(Nt));function Fl(e){const t=e.version??(e.nonce?"v2":"v1"),s=e.scopes.join(","),n=e.token??"",i=[t,e.deviceId,e.clientId,e.clientMode,e.role,s,String(e.signedAtMs),n];return t==="v2"&&i.push(e.nonce??""),i.join("|")}const Nl=4008;class Kl{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const s=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${s}`)),this.opts.onClose?.({code:t.code,reason:s}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,s]of this.pending)s.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,s=["operator.admin","operator.read","operator.write","operator.approvals","operator.pairing"],n="operator";let i=null,a=!1,o=this.opts.token;if(t){i=await Sa();const r=ka({deviceId:i.deviceId,role:n})?.token;o=r??this.opts.token,a=!!(r&&this.opts.token)}const l=o||this.opts.password?{token:o,password:this.opts.password}:void 0;let p;if(t&&i){const r=Date.now(),f=this.connectNonce??void 0,g=Fl({deviceId:i.deviceId,clientId:this.opts.clientName??Zs.CONTROL_UI,clientMode:this.opts.mode??Nt.WEBCHAT,role:n,scopes:s,signedAtMs:r,token:o??null,nonce:f}),v=await Ta(i.privateKey,g);p={id:i.deviceId,publicKey:i.publicKey,signature:v,signedAt:r,nonce:f}}const m={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??Zs.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??Nt.WEBCHAT,instanceId:this.opts.instanceId},role:n,scopes:s,device:p,caps:[],auth:l,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",m).then(r=>{r?.auth?.deviceToken&&i&&_a({deviceId:i.deviceId,role:r.auth.role??n,token:r.auth.deviceToken,scopes:r.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(r)}).catch(()=>{a&&i&&Aa({deviceId:i.deviceId,role:n}),this.ws?.close(Nl,"connect failed")})}handleMessage(t){let s;try{s=JSON.parse(t)}catch{return}const n=s;if(n.type==="event"){const i=s;if(i.event==="connect.challenge"){const o=i.payload,l=o&&typeof o.nonce=="string"?o.nonce:null;l&&(this.connectNonce=l,this.sendConnect());return}const a=typeof i.seq=="number"?i.seq:null;a!==null&&(this.lastSeq!==null&&a>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:a}),this.lastSeq=a);try{this.opts.onEvent?.(i)}catch(o){console.error("[gateway] event handler error:",o)}return}if(n.type==="res"){const i=s,a=this.pending.get(i.id);if(!a)return;this.pending.delete(i.id),i.ok?a.resolve(i.payload):a.reject(new Error(i.error?.message??"request failed"));return}}request(t,s){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const n=at(),i={type:"req",id:n,method:t,params:s},a=new Promise((o,l)=>{this.pending.set(n,{resolve:p=>o(p),reject:l})});return this.ws.send(JSON.stringify(i)),a}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}const hi={displayName:"label",sessionKey:"conversationId"},pi={};for(const[e,t]of Object.entries(hi))pi[t]=e;const Bl={"sessions.autoTitle":["sessions.patch"],"sessions.rename":["sessions.patch"]},ye=new Map;function Ul(){try{const e=sessionStorage.getItem("godmode:healing-cache");if(e){const t=JSON.parse(e);for(const[s,n]of Object.entries(t))ye.set(s,n)}}catch{}}function en(){try{const e={};for(const[t,s]of ye)e[t]=s;sessionStorage.setItem("godmode:healing-cache",JSON.stringify(e))}catch{}}Ul();function Wl(e,t){const s=ye.get(e);if(!s)return{method:e,params:t};const n=s.resolvedMethod;if(t&&typeof t=="object"&&!Array.isArray(t)&&Object.keys(s.fieldRenames).length>0){const i={...t};for(const[a,o]of Object.entries(s.fieldRenames))a in i&&!(o in i)&&(i[o]=i[a],delete i[a]);return{method:n,params:i}}return{method:n,params:t}}function ql(e,t,s){const n=s.toLowerCase(),i=s.match(/unexpected property[:\s]*['"]?(\w+)['"]?/i);if(i){const a=i[1],o=hi[a];if(o&&t&&typeof t=="object"){const l={...t};if(a in l)return l[o]=l[a],delete l[a],console.log(`[safe-request] Self-heal: ${e} — rewrote "${a}" → "${o}"`),{method:e,params:l,renames:{[a]:o}}}}if(n.includes("unknown method")||n.includes("method not found")){const a=Bl[e];if(a&&a.length>0){const o=a[0];return console.log(`[safe-request] Self-heal: ${e} not found — falling back to ${o}`),{method:o,params:t,renames:{}}}}if((n.includes("unexpected property")||n.includes("unknown field"))&&t&&typeof t=="object"){const a={...t};let o=!1;const l={};for(const[p,m]of Object.entries(pi))p in a&&(a[m]=a[p],delete a[p],l[p]=m,o=!0,console.log(`[safe-request] Self-heal: ${e} — reverse alias "${p}" → "${m}"`));if(o)return{method:e,params:a,renames:l}}return null}async function ze(e,t,s,n){const i=n?.timeout??3e4;let{method:a,params:o}=n?.raw?{method:t,params:s}:Wl(t,s);const l=async(p,m)=>Promise.race([e.request(p,m),new Promise((r,f)=>setTimeout(()=>f(new Error(`Request timeout (${i}ms): ${p}`)),i))]);try{return{ok:!0,data:await l(a,o),method:a,healed:a!==t}}catch(p){const m=String(p instanceof Error?p.message:p);if(n?.raw)return{ok:!1,error:m,method:t};const r=ql(a,o,m);if(r)try{const f=await l(r.method,r.params);return ye.set(t,{resolvedMethod:r.method,fieldRenames:r.renames,ts:Date.now()}),en(),{ok:!0,data:f,method:r.method,healed:!0}}catch(f){return{ok:!1,error:String(f instanceof Error?f.message:f),method:r.method,healed:!0}}if(n?.fallbacks)for(const f of n.fallbacks)try{const g=await l(f,o);return ye.set(t,{resolvedMethod:f,fieldRenames:{},ts:Date.now()}),en(),{ok:!0,data:g,method:f,healed:!0}}catch{continue}return{ok:!1,error:m,method:a}}}function fi(){ye.clear();try{sessionStorage.removeItem("godmode:healing-cache")}catch{}}function Vl(){const e={};for(const[t,s]of ye)e[t]=s;return e}const Hh=Object.freeze(Object.defineProperty({__proto__:null,clearHealingCache:fi,getHealingEntries:Vl,safeRequest:ze},Symbol.toStringTag,{value:"Module"}));let V=null;function mi(e,t){fi();const s=String(e.version??e.serverVersion??e.gatewayVersion??"unknown"),n=typeof e.protocol=="number"?e.protocol:void 0;V={hostVersion:s,protocolVersion:n,methods:{},initializedAt:Date.now(),probing:!0};try{const i=sessionStorage.getItem("godmode:host-compat");if(i){const a=JSON.parse(i);if(a.hostVersion===s&&a.methods)return V.methods=a.methods,V.probing=!1,V}}catch{}return jl(t).catch(()=>{}),V}async function jl(e){if(!V)return;const t=[{method:"sessions.list",params:{limit:1}},{method:"sessions.patch",params:{key:"__compat_probe__"}},{method:"sessions.autoTitle",params:{sessionKey:"__compat_probe__"}},{method:"config.get",params:{}}];for(const s of t){const n={available:!1,testedAt:Date.now()};try{await e.request(s.method,s.params),n.available=!0}catch(i){const a=String(i instanceof Error?i.message:i),o=a.toLowerCase(),l=o.includes("unknown method")||o.includes("not found")&&o.includes("method");n.available=!l,l&&(n.error="method not available");const p=a.match(/(?:expected|valid|accepted) (?:fields?|properties?)[:\s]*\[([^\]]+)\]/i);p&&(n.fields=p[1].split(",").map(m=>m.trim().replace(/['"]/g,"")))}V.methods[s.method]=n}V.probing=!1;try{sessionStorage.setItem("godmode:host-compat",JSON.stringify(V))}catch{}}function gi(e){if(!V)return;const t=V.methods[e];if(t)return t.available}function zl(){return V?.hostVersion??"unknown"}function Hl(){return V}function Gl(){return V?.probing??!1}async function yi(e,t,s){const n=await ze(e,"sessions.patch",{key:t,label:s});return n.ok?{ok:!0}:(await ze(e,"sessions.patch",{key:t,displayName:s},{raw:!0})).ok?{ok:!0}:{ok:!1,error:n.error}}async function Ql(e,t,s){if(gi("sessions.autoTitle")!==!1){const l=await ze(e,"sessions.autoTitle",{sessionKey:t});if(l.ok)return{ok:!0,title:l.data?.title}}const i=s.find(l=>l.role==="user");if(!i)return{ok:!1,error:"No user message to derive title from"};const a=Yl(i.content),o=await yi(e,t,a);return o.ok?{ok:!0,title:a}:{ok:!1,error:o.error}}function Yl(e){let t=e.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").replace(/https?:\/\/\S+/g,"").replace(/[#*_~>]/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").trim();if(t=t.split(`
`).filter(n=>n.trim().length>0)[0]??"New conversation",t.length>60){const n=t.slice(0,57),i=n.lastIndexOf(" ");t=(i>30?n.slice(0,i):n)+"..."}return t}function Jl(e){return String(e.label??e.displayName??e.key??"Untitled")}const Xl=Object.freeze(Object.defineProperty({__proto__:null,getHostCompat:Hl,getHostVersion:zl,hasMethod:gi,hostAutoTitle:Ql,hostPatchSession:yi,initHostCompat:mi,isProbing:Gl,readSessionName:Jl},Symbol.toStringTag,{value:"Module"})),Kt=new Map;let tn=null,bt=!1;function Zl(e,t,s){return Kt.get(`${e}:${t}:${s}`)??null}async function vi(e){if(!e.client||!e.chatMessages?.length)return;const t=e.sessionKey,s=[];for(let n=0;n<e.chatMessages.length;n++){const i=e.chatMessages[n],a=Et(i);for(let o=0;o<a.length;o++)if(a[o].url&&!a[o].omitted){const l=/^data:([^;]+);base64,(.+)$/.exec(a[o].url);l&&s.push({data:l[2],mimeType:l[1],messageIndex:n,imageIndex:o,role:i.role||"unknown",timestamp:typeof i.timestamp=="number"?i.timestamp:void 0})}}if(s.length>0)try{const n=await e.client.request("images.cache",{images:s.map(i=>({data:i.data,mimeType:i.mimeType})),sessionKey:t});if(n?.cached){const i=s.map((a,o)=>({messageIndex:a.messageIndex,imageIndex:a.imageIndex,hash:n.cached[o]?.hash,mimeType:a.mimeType,bytes:n.cached[o]?.bytes??0,role:a.role,timestamp:a.timestamp})).filter(a=>!!a.hash);i.length>0&&await e.client.request("images.updateIndex",{sessionKey:t,images:i})}}catch{}if(!bt){bt=!0;try{const n=si();n&&await n.catch(()=>{});const i=async()=>{const o=await e.client.request("images.resolve",{sessionKey:t});if(o?.images&&Object.keys(o.images).length>0){tn!==t&&Kt.clear();for(const[l,p]of Object.entries(o.images))Kt.set(`${t}:${l}`,p);return tn=t,e.chatMessages=[...e.chatMessages],!0}return!1};if(!await i()&&e.chatMessages?.some(o=>Et(o).some(p=>p.omitted||!p.url))){for(const o of[500,1500,3e3])if(await new Promise(l=>setTimeout(l,o)),await i()||e.sessionKey!==t)break}}catch{}finally{bt=!1}}}let sn=null;function ec(e){if(!e.chatMessages?.length)return;const t=e.chatMessages.slice(-5);for(const s of t){const n=s,i=Array.isArray(n.content)?n.content:[];for(const a of i){const o=a,l=typeof o.text=="string"?o.text:typeof o.content=="string"?o.content:null;if(l)try{const p=JSON.parse(l);if(p._sidebarAction?.type==="proof"&&p._sidebarAction.slug){const m=p._sidebarAction.slug;if(m===sn)return;sn=m,e.handleOpenProofDoc(m);return}}catch{}}}}function He(e){vi(e)}const $e=[];function tc(){return[...$e]}let ae=null;const sc=10,nc=1e3,Y=new Map;function St(e,t){const s=(e??"").trim(),n=t.mainSessionKey?.trim();if(!n)return s;if(!s)return n;const i=t.mainKey?.trim()||"main",a=t.defaultAgentId?.trim();return s==="main"||s===i||a&&(s===`agent:${a}:main`||s===`agent:${a}:${i}`)?n:s}function ic(e,t){if(!t?.mainSessionKey)return;const s="main",n=r=>(r??"").trim()===s||(r??"").trim()==="",i=n(e.sessionKey)?e.sessionKey:St(e.sessionKey,t),a=n(e.settings.sessionKey)?e.settings.sessionKey:St(e.settings.sessionKey,t),o=n(e.settings.lastActiveSessionKey)?e.settings.lastActiveSessionKey:St(e.settings.lastActiveSessionKey,t),l=i||a||e.sessionKey,p={...e.settings,sessionKey:a||l,lastActiveSessionKey:o||l},m=p.sessionKey!==e.settings.sessionKey||p.lastActiveSessionKey!==e.settings.lastActiveSessionKey;l!==e.sessionKey&&(e.sessionKey=l),m&&ne(e,p)}function ac(e){ae&&(clearTimeout(ae),ae=null);const t=(e.reconnectAttempt??0)+1;if(t>sc){e.lastError="Connection lost. Please refresh the page.",e.reconnecting=!1;return}e.reconnectAttempt=t,e.reconnecting=!0;const s=Math.min(nc*Math.pow(2,t-1),3e4);ae=setTimeout(()=>{ae=null,e.connected||ts(e)},s)}async function oc(e){if(!e.client)return;const t=e;try{if(t.setupQuickDone){t.workspaceNeedsSetup=!1;return}try{if((await e.client.request("onboarding.status",{}))?.identity?.name){t.workspaceNeedsSetup=!1;return}}catch{}const s=await e.client.request("projects.list",{});t.workspaceNeedsSetup=!s?.projects||s.projects.length===0}catch{}}async function rc(e){if(!e.client)return;if(e.workspaceNeedsSetup===!1){try{const s=await e.client.request("onboarding.status",{});s&&!s.completedAt&&await e.client.request("onboarding.complete",{summary:null})}catch{}return}try{const s=await e.client.request("onboarding.status",{}),n=e;if(s&&!s.completedAt){n.onboardingActive=!0,n.onboardingPhase=s.phase??0,n.onboardingData=s;const i=e;if(i.showSetupTab=!0,s.identity?.name){i.setupQuickDone=!0;const a=e;(!a.userName||!a.settings.userName)&&(a.userName=s.identity.name,a.applySettings({...a.settings,userName:s.identity.name}))}}else n.onboardingActive=!1,n.onboardingData=s??null}catch{}}function lc(e,t){if(!e.sessionsResult?.sessions)return;const s=e.sessionsResult.sessions.map(n=>n.key===t?{...n,updatedAt:Date.now()}:n);e.sessionsResult={...e.sessionsResult,sessions:s}}const wi=new Set;function cc(){wi.clear()}async function dc(e,t){}function ts(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null,cc();const t=e;"sessionsLoading"in t&&(t.sessionsLoading=!1),"agentsLoading"in t&&(t.agentsLoading=!1),"nodesLoading"in t&&(t.nodesLoading=!1),"devicesLoading"in t&&(t.devicesLoading=!1),"channelsLoading"in t&&(t.channelsLoading=!1),"configLoading"in t&&(t.configLoading=!1),"presenceLoading"in t&&(t.presenceLoading=!1),"cronLoading"in t&&(t.cronLoading=!1),"skillsLoading"in t&&(t.skillsLoading=!1),"debugLoading"in t&&(t.debugLoading=!1),"logsLoading"in t&&(t.logsLoading=!1),ae&&(clearTimeout(ae),ae=null),e.client?.stop(),e.client=new Kl({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:s=>{const n=e.reconnecting;if(e.connected=!0,e.lastError=null,e.hello=s,e.reconnecting=!1,e.reconnectAttempt=0,n){const i=e;typeof i.showToast=="function"&&i.showToast("Gateway reconnected","success",4e3),e.lastError="✓ Reconnected",setTimeout(()=>{e.lastError==="✓ Reconnected"&&(e.lastError=null)},3e3),e.chatRunId=null;const a=e;"chatStream"in a&&(a.chatStream=null),"chatStreamStartedAt"in a&&(a.chatStreamStartedAt=null);const o=e;if(o.todaySelectedDate){const l=new Date,p=`${l.getFullYear()}-${String(l.getMonth()+1).padStart(2,"0")}-${String(l.getDate()).padStart(2,"0")}`;o.todaySelectedDate!==p&&(o.todaySelectedDate=p)}e.workingSessions.clear(),e.requestUpdate?.();for(const l of Y.values())clearTimeout(l);Y.clear()}mi(s,e.client),gc(e,s),ti(e),$a(e),Xe(e,{quiet:!0}),Ze(e,{quiet:!0}),W(e),De(e),oc(e).then(()=>rc(e)),pc(e),fc(e),El(e),Ol(e),mc(e)},onClose:({code:s,reason:n})=>{e.connected=!1,Ml(e);const i=e;"chatSending"in i&&(i.chatSending=!1),"chatSendingSessionKey"in i&&(i.chatSendingSessionKey=null),"chatRunId"in i&&(i.chatRunId=null),"chatStream"in i&&(i.chatStream=null),"chatStreamStartedAt"in i&&(i.chatStreamStartedAt=null);const a=e;"sessionsLoading"in a&&(a.sessionsLoading=!1),"agentsLoading"in a&&(a.agentsLoading=!1),"nodesLoading"in a&&(a.nodesLoading=!1),"devicesLoading"in a&&(a.devicesLoading=!1),"channelsLoading"in a&&(a.channelsLoading=!1),"presenceLoading"in a&&(a.presenceLoading=!1),s!==1012&&(e.lastError=`disconnected (${s}): ${n||"no reason"}`),ac(e)},onEvent:s=>uc(e,s),onGap:({expected:s,received:n})=>{e.lastError=`event gap detected (expected seq ${s}, got ${n}); refresh recommended`}}),e.client.start()}function uc(e,t){try{hc(e,t)}catch(s){console.error("[gateway] handleGatewayEvent error:",t.event,s)}}function hc(e,t){if($e.unshift({ts:Date.now(),event:t.event,payload:t.payload}),$e.length>250&&($e.length=250),e.tab==="debug"&&(e.eventLog=[...$e]),t.event==="agent"){if(e.onboarding)return;const s=t.payload,n=s?.sessionKey;n&&s?.stream==="tool"&&s.data?.phase==="start"&&(e.workingSessions.has(n)||(e.workingSessions.add(n),e.requestUpdate?.())),ar(e,s);return}if(t.event==="chat"){const s=t.payload;if(s?.sessionKey){if(ds(e,s.sessionKey),s.state==="delta"){const a=Y.get(s.sessionKey);a&&(clearTimeout(a),Y.delete(s.sessionKey)),e.workingSessions.has(s.sessionKey)||(e.workingSessions.add(s.sessionKey),e.requestUpdate?.());const o=`safety:${s.sessionKey}`,l=Y.get(o);l&&clearTimeout(l),Y.set(o,setTimeout(()=>{Y.delete(o),e.workingSessions.has(s.sessionKey)&&(e.workingSessions.delete(s.sessionKey),e.requestUpdate?.())},9e4))}else if((s.state==="final"||s.state==="error"||s.state==="aborted")&&e.workingSessions.has(s.sessionKey)){const a=Y.get(s.sessionKey);a&&(clearTimeout(a),Y.delete(s.sessionKey));const o=`safety:${s.sessionKey}`,l=Y.get(o);l&&(clearTimeout(l),Y.delete(o)),e.workingSessions.delete(s.sessionKey),e.requestUpdate?.()}}s.state==="final"&&lc(e,s.sessionKey);const n=ri(e,s),i=s?.sessionKey===M||(s?.sessionKey?.endsWith(`:${M}`)??!1);if(s&&i){const a=e,o=e.tab==="chat"&&e.sessionKey===M;if(s.state==="delta"){const l=_e(s.message);if(!o){if(typeof l=="string"){const p=a.allyStream??"";(!p||l.length>=p.length)&&(a.allyStream=l)}a.allyWorking=!0,a.requestUpdate?.()}}else if(s.state==="final"){a.allyStream=null,a.allyWorking=!1,!a.allyPanelOpen&&e.tab!=="chat"&&(a.allyUnread=(a.allyUnread??0)+1);const l=e;l._loadAllyHistory().then(()=>{a.allyPanelOpen&&l._scrollAllyToBottom(),a.requestUpdate?.()})}else if(s.state==="error"||s.state==="aborted"){const l=_e(s.message),p=s.state==="aborted"?"Response was stopped.":l||"Something went wrong — try again.";a.allyMessages=[...a.allyMessages??[],{role:"assistant",content:`*${p}*`,timestamp:Date.now()}],a.allyStream=null,a.allyWorking=!1,a.requestUpdate?.()}}if(s.state==="final"&&(async()=>{await dc(e,s.sessionKey);try{await W(e,{activeMinutes:0})}catch{}})(),n==="final"||n==="error"||n==="aborted"){if(Ht(e),Hi(e),n==="final"&&e.compactionStatus?.active){e.compactionStatus={active:!1,startedAt:e.compactionStatus.startedAt??null,completedAt:Date.now()};const a=e;a.autoRetryAfterCompact&&a.pendingRetry?(a.autoRetryAfterCompact=!1,setTimeout(()=>{a.handleRetryMessage?.()},500)):(a.showToast?.("Compaction complete — resuming...","info",2e3),setTimeout(()=>{a.handleSendChat?.("Continue where you left off.")},800))}(n==="error"||n==="aborted")&&e.compactionStatus?.active&&(e.compactionStatus=null),e.refreshSessionsAfterChat=!1}if(n==="final"){const a=!!e.compactionStatus?.completedAt;ai(e,{allowShrink:a}).then(()=>{vi(e),e.loadSessionResources?.(),ec(e);const l=e;if(!l.compactionStatus?.active){const m=[...Array.isArray(l.chatMessages)?l.chatMessages:[]].reverse().find(r=>typeof r=="object"&&r!==null&&r.role==="user");if(m){const r=m.content;let f="";typeof r=="string"?f=r:Array.isArray(r)&&(f=r.filter(g=>typeof g?.text=="string").map(g=>g.text).join(" ")),(f.includes("Pre-compaction memory flush")||f.includes("pre-compaction memory flush"))&&(l.showToast?.("Context compacted — resuming conversation...","info",2e3),setTimeout(()=>{l.handleSendChat?.("Continue where you left off.")},800))}}});const o=e;o.tab==="dashboards"&&o.activeDashboardManifest?.sessionId&&o.activeDashboardManifest.sessionId===s.sessionKey&&w(async()=>{const{loadDashboard:l}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:l}},[],import.meta.url).then(({loadDashboard:l})=>{l(e,o.activeDashboardManifest.id)})}return}if(t.event==="presence"){const s=t.payload;s?.presence&&Array.isArray(s.presence)&&(e.presenceEntries=s.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&ct(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&Ze(e,{quiet:!0}),t.event==="exec.approval.requested"){const s=Pl(t.payload);if(s){e.execApprovalQueue=Dl(e.execApprovalQueue,s),e.execApprovalError=null;const n=Math.max(0,s.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=Js(e.execApprovalQueue,s.id)},n)}return}if(t.event==="exec.process.completed"){const s=t.payload;if(s?.sessionId){const n=s.exitSignal?`signal ${s.exitSignal}`:`exit ${s.exitCode??0}`,i=s.status==="completed"?"✓":"✗",a=s.status==="completed"?"success":"warning",o=s.sessionId.slice(0,8),l=e;typeof l.showToast=="function"&&l.showToast(`${i} Process ${o} ${s.status} (${n})`,a,5e3)}return}if(t.event==="exec.approval.resolved"){const s=Il(t.payload);s&&(e.execApprovalQueue=Js(e.execApprovalQueue,s.id))}if(t.event==="daily-brief:update"){const s=t.payload;if(s){const n=e;n.dailyBrief=s}return}if(t.event==="ui.slot.update"){const s=t.payload;if(s?.tabId){const n=s.mode??"replace";if(s.html)n==="append"?e.dynamicSlots={...e.dynamicSlots,[s.tabId]:(e.dynamicSlots[s.tabId]??"")+s.html}:e.dynamicSlots={...e.dynamicSlots,[s.tabId]:s.html};else{const a={...e.dynamicSlots};delete a[s.tabId],e.dynamicSlots=a}e.requestUpdate?.()}return}if(t.event==="guardrails:update"){const s=e;typeof s.handleGuardrailsLoad=="function"&&s.handleGuardrailsLoad();return}if(t.event==="godmode.options:update"){const s=t.payload;if(s){const n=e;n.godmodeOptions=s,n.requestUpdate?.()}return}if(t.event==="fathom:meeting-processed"){const s=t.payload;if(s?.title){const n=e;typeof n.showToast=="function"&&n.showToast(`Meeting processed: ${s.title}`,"success",6e3);const i=s.message??`Meeting "${s.title}" has been processed.`;n.allyMessages=[...n.allyMessages??[],{role:"assistant",content:i,timestamp:Date.now()}],!n.allyPanelOpen&&n.tab!=="chat"&&(n.allyUnread=(n.allyUnread??0)+1),n.sessionKey===M&&n.chatMessages&&(n.chatMessages=[...n.chatMessages,{role:"assistant",content:i,timestamp:Date.now()}]),n.requestUpdate?.()}return}if(t.event==="onboarding:update"){const s=t.payload;if(s){const n=e;if(typeof s.phase=="number"&&(n.onboardingPhase=s.phase),n.onboardingData=s,s.completedAt&&(n.onboardingActive=!1),s.identity?.name){const i=e;(!i.userName||!i.settings.userName)&&(i.userName=s.identity.name,i.applySettings({...i.settings,userName:s.identity.name}))}n.requestUpdate?.()}return}if(t.event==="inbox:update"){const s=e;s.handleInboxRefresh?.().catch(()=>{}),s.requestUpdate?.();return}if(t.event==="queue:update"){const s=t.payload,n=e;s?.status==="processing"&&s.proofDocSlug&&n.handleOpenProofDoc?.(s.proofDocSlug).catch(()=>{}),n.handleInboxRefresh?.().catch(()=>{}),n.loadTodayQueueResults?.().catch(()=>{}),n.requestUpdate?.();return}if(t.event==="ally:notification"){const s=t.payload;if(s){const n=e,i={role:"assistant",content:s.summary||s.message||"Notification received.",timestamp:Date.now(),isNotification:!0,actions:s.actions??[]};n.allyMessages=[...n.allyMessages??[],i],!n.allyPanelOpen&&e.tab!=="chat"&&(n.allyUnread=(n.allyUnread??0)+1);const a=["queue-complete","queue-needs-review","queue-failed","cron-result","paperclip-completion"];if(s.type&&a.includes(s.type)&&n.loadTodayQueueResults&&n.loadTodayQueueResults().catch(()=>{}),s.type&&a.includes(s.type)&&n.handleInboxRefresh&&n.handleInboxRefresh().catch(()=>{}),s.type==="paperclip-completion"){const o=s,l=e;o.sessionKey&&l.sessionKey===o.sessionKey&&l.loadChatHistory?.().catch(()=>{}),i.content=o.message||i.content}n.requestUpdate?.()}return}if(t.event==="sessions:updated"){const s=t.payload;s?.sessionKey&&s?.title&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(n=>n.key===s.sessionKey||n.key?.endsWith(`:${s.sessionKey?.split(":").pop()}`)||s.sessionKey?.endsWith(`:${n.key?.split(":").pop()}`)?{...n,displayName:s.title,label:s.title}:n)}),fe.set(s.sessionKey,s.title),wi.add(s.sessionKey),e.requestUpdate?.());return}if(t.event==="session:auto-compact"){const s=t.payload;if(s?.sessionKey){const n=e;s.sessionKey===n.sessionKey&&!n.compactionStatus?.active&&n.connected&&(n.showToast?.("Context near limit — auto-compacting...","info",3e3),n.handleCompactChat?.())}return}}async function pc(e){const t=e;typeof t.loadFocusPulse=="function"&&await t.loadFocusPulse()}async function fc(e){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}async function mc(e){if(typeof window>"u")return;const t=new URLSearchParams(window.location.search),s=t.get("openTask");if(!s||!e.client)return;t.delete("openTask");const n=t.toString()?`${window.location.pathname}?${t.toString()}`:window.location.pathname;window.history.replaceState({},"",n);try{const i=await e.client.request("tasks.openSession",{taskId:s});if(i?.sessionKey){e.sessionKey=i.sessionKey,e.tab="chat";const{loadChatHistory:a}=await w(async()=>{const{loadChatHistory:o}=await Promise.resolve().then(()=>te);return{loadChatHistory:o}},void 0,import.meta.url);await a(e,i.sessionKey)}}catch(i){console.error("[GodMode] Failed to open task session:",i)}}function gc(e,t){const s=t.snapshot;s?.presence&&Array.isArray(s.presence)&&(e.presenceEntries=s.presence),s?.health&&(e.debugHealth=s.health),s?.sessionDefaults&&ic(e,s.sessionDefaults)}function ss(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{Xe(e,{quiet:!0})},5e3))}function ns(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function is(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&jt(e,{quiet:!0})},2e3))}function as(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function os(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&et(e)},3e3))}function rs(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}function bi(e){e.missionControlPollInterval==null&&(e.missionControlPollInterval=window.setInterval(()=>{e.tab==="mission-control"&&Ca(e,{quiet:!0})},5e3))}function Si(e){e.missionControlPollInterval!=null&&(clearInterval(e.missionControlPollInterval),e.missionControlPollInterval=null)}const yc=["~/godmode/memory/AGENT-DAY.md","~/godmode/AGENT-DAY.md"];function vc(e){return[...[`~/godmode/memory/agent-day/${e}.md`,`~/godmode/memory/agent-log/${e}.md`,`~/godmode/memory/daily/${e}-agent-log.md`],...yc]}function wc(e){return["Needs Review","Active Sub-Agents","Completed Today","Queue","Feedback Log","AGENT-DAY"].filter(n=>e.includes(n)).length>=2}async function ki(e,t){try{const s=t?{date:t}:{},n=await e.request("dailyBrief.get",s);return!n||!n.content||!n.date?null:n}catch(s){return console.error("[MyDay] Failed to load daily brief:",s),null}}async function Ti(e,t,s){const n=t||K(),i="agentLog.get";try{const a=await e.request(i,{date:n});if(a?.content?.trim()&&a?.sourcePath)return{date:a.date||n,content:a.content,updatedAt:a.updatedAt||new Date().toISOString(),sourcePath:a.sourcePath}}catch(a){console.warn(`[MyDay] ${i} unavailable, falling back to files.read:`,a)}return bc(e,n)}async function bc(e,t){const s=vc(t),n=i=>i.includes("AGENT-DAY.md");for(const i of s)try{const a=await e.request("files.read",{path:i,maxSize:1e6});if(!a?.content?.trim()||!wc(a.content)||n(i)&&typeof a.modifiedAt=="number"&&K(new Date(a.modifiedAt))!==t)continue;return{date:t,content:a.content,updatedAt:typeof a.modifiedAt=="number"?new Date(a.modifiedAt).toISOString():new Date().toISOString(),sourcePath:i}}catch{}return null}function Se(e,t,s){return new Promise((n,i)=>{const a=setTimeout(()=>i(new Error(`${s} timed out after ${t}ms`)),t);e.then(o=>{clearTimeout(a),n(o)},o=>{clearTimeout(a),i(o)})})}const Sc={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function _i(e){if(!e.client||!e.connected)return[];e.todayTasksLoading=!0;try{const t=e.todaySelectedDate??K(),[s,n]=await Promise.all([e.client.request("tasks.today",{date:t,includeCompleted:!0}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),i=new Map;for(const o of n.items)o.sourceTaskId&&(o.status==="processing"||o.status==="review"||o.status==="needs-review"||o.status==="done"||o.status==="failed")&&i.set(o.sourceTaskId,{status:o.status,type:o.type,roleName:Sc[o.type]??o.type,queueItemId:o.id});const a=(s.tasks??[]).map(o=>({id:o.id,title:o.title,status:o.status,project:o.project,dueDate:o.dueDate,priority:o.priority,createdAt:o.createdAt,completedAt:o.completedAt,queueStatus:i.get(o.id)??null}));return e.todayTasks=a,a}catch(t){return console.error("[MyDay] Failed to load today tasks:",t),e.todayTasks??[]}finally{e.todayTasksLoading=!1}}async function Ai(e){if(!(!e.client||!e.connected)){e.inboxLoading=!0;try{const t=await e.client.request("inbox.list",{status:"pending",limit:50});e.inboxItems=t.items??[],e.inboxCount=t.pendingCount??0}catch(t){console.error("[MyDay] Failed to load inbox items:",t),e.inboxItems=[],e.inboxCount=0}finally{e.inboxLoading=!1}}}async function $i(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("trust.dashboard",{}),s=t.summaries.filter(n=>n.trustScore!==null);e.trustSummary={overallScore:t.overallScore,dailyStreak:t.dailyStreak,todayRated:t.todayRating!==null,workflowCount:t.workflows.length,highPerformers:s.filter(n=>(n.trustScore??0)>=8).length,needsAttention:s.filter(n=>(n.trustScore??10)<7).length}}catch{e.trustSummary=null}}async function kc(e){if(!e.client||!e.connected)return[];try{const s=(await e.client.request("queue.list",{limit:50}))?.items??[],n=Date.now()-1440*60*1e3;return s.filter(i=>!(i.status!=="review"&&i.status!=="needs-review"&&i.status!=="done"||i.status==="done"&&(i.completedAt??0)<n)).sort((i,a)=>(a.completedAt??0)-(i.completedAt??0)).map(i=>({id:i.id,title:i.title,summary:i.result?.summary??i.description??"",status:i.status==="needs-review"?"review":i.status,completedAt:i.completedAt,outputPath:i.result?.outputPath,prUrl:i.result?.prUrl,sourceTaskId:i.sourceTaskId,persona:i.personaHint??void 0,source:i.source}))}catch(t){return console.error("[MyDay] Failed to load queue results for decision cards:",t),[]}}function Tc(e,t){e.request("dailyBrief.syncTasks",t?{date:t}:{}).catch(s=>{console.warn("[MyDay] dailyBrief.syncTasks failed (non-blocking):",s)})}async function Ce(e){if(!(!e.client||!e.connected)){e.dailyBriefLoading=!0,e.dailyBriefError=null;try{e.dailyBrief=await ki(e.client,e.todaySelectedDate),e.loadBriefNotes&&await e.loadBriefNotes()}catch(t){e.dailyBriefError=t instanceof Error?t.message:"Failed to load daily brief",console.error("[MyDay] Brief load error:",t)}finally{e.dailyBriefLoading=!1}}}async function _c(e,t){if(!(!e.client||!e.connected)){e.agentLogLoading=!0,e.agentLogError=null;try{e.agentLog=await Ti(e.client,e.todaySelectedDate,t)}catch(s){e.agentLogError=s instanceof Error?s.message:"Failed to load agent log",console.error("[MyDay] Agent log load error:",s)}finally{e.agentLogLoading=!1}}}function Ci(e){const t=e||K(),s="VAULT",n=`01-Daily/${t}`,i=`obsidian://open?vault=${encodeURIComponent(s)}&file=${encodeURIComponent(n)}`;window.open(i,"_blank")}async function Ge(e){if(!e.client||!e.connected)return;e.myDayLoading=!0,e.myDayError=null,e.dailyBriefLoading=!0,e.agentLogLoading=!0,e.todayTasksLoading=!0;const t=e.todaySelectedDate,s=e.loadBriefNotes?Se(e.loadBriefNotes(),5e3,"Brief Notes"):Promise.resolve(),n=await Promise.allSettled([Se(ki(e.client,t),1e4,"Daily Brief"),s,Se(Ti(e.client,t),1e4,"Agent Log"),Se(_i(e),8e3,"Today Tasks"),Se(Ai(e),5e3,"Inbox"),Se($i(e),5e3,"Trust Summary")]);e.dailyBrief=n[0].status==="fulfilled"?n[0].value:null,e.agentLog=n[2].status==="fulfilled"?n[2].value:null;const i=["Brief","Brief Notes","Agent Log","Today Tasks","Inbox","Trust"],a=n.map((o,l)=>o.status==="rejected"?{section:i[l],reason:o.reason}:null).filter(Boolean);if(a.length>0){for(const o of a)console.warn(`[MyDay] ${o.section} failed:`,o.reason);a.length===n.length&&(e.myDayError="Failed to load daily brief")}e.myDayLoading=!1,e.dailyBriefLoading=!1,e.agentLogLoading=!1,e.todayTasksLoading=!1}const xe=Object.freeze(Object.defineProperty({__proto__:null,loadAgentLogOnly:_c,loadBriefOnly:Ce,loadInboxItems:Ai,loadMyDay:Ge,loadTodayQueueResults:kc,loadTodayTasksWithQueueStatus:_i,loadTrustSummary:$i,openBriefInObsidian:Ci,syncTodayTasks:Tc},Symbol.toStringTag,{value:"Module"}));async function xi(e){if(!(!e.client||!e.connected)){e.workLoading=!0,e.workError=null;try{const t=await e.client.request("projects.list",{});e.workProjects=t.projects??[]}catch(t){console.error("[Work] Failed to load:",t),e.workError=t instanceof Error?t.message:"Failed to load"}finally{e.workLoading=!1}}}async function Ac(e,t){if(!e.client||!e.connected)return;const s=new Set(e.workDetailLoading??[]);s.add(t),e.workDetailLoading=s;try{const n=await e.client.request("projects.get",{id:t,includeFiles:!0,depth:2});if(n){const i=n.files??[];e.workProjectFiles={...e.workProjectFiles,[t]:i}}}catch(n){console.warn("[Work] Failed to load project details:",n)}finally{const n=new Set(e.workDetailLoading??[]);n.delete(t),e.workDetailLoading=n}}async function Pi(e){if(!(!e.client||!e.connected)){e.workResourcesLoading=!0;try{const t=await e.client.request("resources.list",{limit:100});e.workResources=t.resources??[]}catch(t){console.warn("[Work] Failed to load resources:",t),e.workResources=[]}finally{e.workResourcesLoading=!1}}}async function $c(e,t,s){if(!(!e.client||!e.connected))try{await e.client.request("resources.pin",{id:t,pinned:s}),e.workResources&&(e.workResources=e.workResources.map(n=>n.id===t?{...n,pinned:s}:n))}catch(n){console.warn("[Work] Failed to pin resource:",n)}}async function Cc(e,t){if(!(!e.client||!e.connected))try{await e.client.request("resources.delete",{id:t}),e.workResources&&(e.workResources=e.workResources.filter(s=>s.id!==t))}catch(s){console.warn("[Work] Failed to delete resource:",s)}}function ot(e,t=Date.now()){if(typeof e=="number"&&Number.isFinite(e))return new Date(e);if(typeof e=="string"){const s=Date.parse(e);if(Number.isFinite(s))return new Date(s)}return new Date(t)}function ls(e){return{id:e.id,name:e.name,emoji:e.emoji||"📁",type:e.type,path:e.path,artifactCount:e.artifactCount??0,sessionCount:e.sessionCount??0,lastUpdated:ot(e.lastUpdated,e.lastScanned)}}function kt(e){return{path:e.path,name:e.name,type:e.type,size:e.size,modified:ot(e.modified),isDirectory:e.isDirectory,searchText:e.searchText}}function nn(e){return{id:e.id,key:e.key,title:e.title,created:ot(e.created),status:e.status,workspaceSubfolder:e.workspaceSubfolder}}function we(e){return{id:e.id,title:e.title,status:e.status,project:e.project,dueDate:e.dueDate,priority:e.priority,createdAt:e.createdAt,completedAt:e.completedAt}}function Ii(e){return e.map(t=>({name:t.name,path:t.path,type:t.type,fileType:t.fileType,size:t.size,modified:t.modified?ot(t.modified):void 0,children:t.children?Ii(t.children):void 0}))}function xc(e,t){return{...t,id:e.id,name:e.name,emoji:e.emoji,type:e.type,path:e.path,artifactCount:e.artifactCount,sessionCount:e.sessionCount,lastUpdated:e.lastUpdated}}async function rt(e){if(!e.client||!e.connected){e.workspaces=[],e.workspacesLoading=!1,e.workspacesError="Connect to gateway to see workspaces";return}e.workspacesLoading=!0,e.workspacesError=null;try{const t=await e.client.request("workspaces.list",{});if(e.workspaces=(t.workspaces??[]).map(ls),e.selectedWorkspace){const s=e.workspaces.find(n=>n.id===e.selectedWorkspace?.id);s&&(e.selectedWorkspace=xc(s,e.selectedWorkspace))}}catch(t){console.error("[Workspaces] load failed:",t),e.workspacesError=t instanceof Error?t.message:"Failed to load workspaces",e.workspaces=[]}finally{e.workspacesLoading=!1}}async function lt(e,t){if(!e.client||!e.connected)return null;try{const s=await e.client.request("workspaces.get",{id:t});return s.workspace?{...ls(s.workspace),pinned:(s.pinned??[]).map(kt),pinnedSessions:(s.pinnedSessions??[]).map(nn),outputs:(s.outputs??[]).map(kt),folderTree:s.folderTree?Ii(s.folderTree):void 0,sessions:(s.sessions??[]).map(nn),tasks:(s.tasks??[]).map(we),memory:(s.memory??[]).map(kt)}:null}catch(s){return console.error("[Workspaces] get failed:",s),null}}async function Pc(e,t,s){if(!e.client||!e.connected)return null;try{const n=await e.client.request("workspaces.readFile",s?{workspaceId:s,filePath:t}:{path:t});return n.content?{content:n.content,mime:n.contentType??n.mime??"text/plain"}:(n.error&&console.warn("[Workspaces] readFile failed:",n.error),null)}catch(n){return console.error("[Workspaces] readFile error:",n),null}}async function Ic(e){if(!(!e.client||!e.connected))try{e.workspacesLoading=!0,e.workspacesError=null,await e.client.request("workspaces.scan",{}),await rt(e)}catch(t){e.workspacesError=t instanceof Error?t.message:"Failed to scan workspaces"}finally{e.workspacesLoading=!1}}async function Dc(e,t){if(!t){e.selectedWorkspace=null;return}const s=await lt(e,t.id);e.selectedWorkspace=s||{...t,pinned:[],pinnedSessions:[],outputs:[],sessions:[],tasks:[]}}async function Rc(e,t,s,n){if(!e.client||!e.connected)return!1;try{if(await e.client.request(n?"workspaces.unpin":"workspaces.pin",{workspaceId:t,filePath:s}),e.selectedWorkspace?.id===t){const i=await lt(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] pin toggle failed:",i),!1}}async function Lc(e,t,s,n){if(!e.client||!e.connected)return!1;try{if(await e.client.request(n?"workspaces.unpinSession":"workspaces.pinSession",{workspaceId:t,sessionKey:s}),e.selectedWorkspace?.id===t){const i=await lt(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] session pin toggle failed:",i),!1}}async function Ec(e,t){if(!e.client||!e.connected)return null;const s=String(t.name??"").trim();if(!s)return e.workspacesError="Workspace name is required",null;const n=t.type??"project",i=String(t.path??"").trim();try{const a=await e.client.request("workspaces.create",{name:s,type:n,...i?{path:i}:{}});if(!a.workspace)return e.workspacesError="Workspace creation returned no workspace",null;const o=ls(a.workspace),l=e.workspaces??[],p=new Map(l.map(m=>[m.id,m]));return p.set(o.id,o),e.workspaces=Array.from(p.values()).toSorted((m,r)=>r.lastUpdated.getTime()-m.lastUpdated.getTime()),e.workspacesError=null,o}catch(a){return console.error("[Workspaces] create failed:",a),e.workspacesError=a instanceof Error?a.message:"Failed to create workspace",null}}async function Mc(e,t){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.delete",{id:t}),e.workspaces=(e.workspaces??[]).filter(s=>s.id!==t),e.selectedWorkspace?.id===t&&(e.selectedWorkspace=null),e.workspacesError=null,!0}catch(s){return console.error("[Workspaces] delete failed:",s),e.workspacesError=s instanceof Error?s.message:"Failed to delete workspace",!1}}function Oc(e,t){e.workspacesSearchQuery=t}function Fc(e){e.selectedWorkspace=null}async function Nc(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("workspaces.teamSetupPrompt",{});t?.prompt&&(e.chatMessage=t.prompt,e.setTab?.("chat"))}catch{e.chatMessage="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.",e.setTab?.("chat")}}function Kc(e,t){const s=new Set(e);return s.has(t)?s.delete(t):s.add(t),s}async function Bc(e,t){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.byProject",{project:t})).tasks??[]).map(we)}catch(s){return console.error("[Workspaces] loadWorkspaceTasks failed:",s),[]}}async function Uc(e){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.list",{})).tasks??[]).map(we)}catch(t){return console.error("[Workspaces] loadAllTasks failed:",t),[]}}const Wc={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function qc(e){if(!e.client||!e.connected)return[];try{const[t,s]=await Promise.all([e.client.request("tasks.list",{}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),n=new Map;for(const i of s.items)i.sourceTaskId&&(i.status==="processing"||i.status==="review"||i.status==="needs-review"||i.status==="failed")&&n.set(i.sourceTaskId,{status:i.status==="needs-review"?"review":i.status,type:i.type,roleName:Wc[i.type]??i.type,queueItemId:i.id});return(t.tasks??[]).map(i=>({...we(i),queueStatus:n.get(i.id)??null}))}catch(t){return console.error("[Workspaces] loadAllTasksWithQueueStatus failed:",t),[]}}async function Vc(e,t,s){if(!e.client||!e.connected)return null;const n=s==="complete"?"pending":"complete";try{const i=await e.client.request("tasks.update",{id:t,status:n});return we(i)}catch(i){return console.error("[Workspaces] toggleTaskComplete failed:",i),null}}async function jc(e,t,s){if(!e.client||!e.connected)return null;try{const n=await e.client.request("tasks.update",{id:t,...s});return we(n)}catch(n){return console.error("[Workspaces] updateTask failed:",n),null}}async function zc(e,t){if(!e.client||!e.connected)return null;try{return await e.client.request("tasks.openSession",{taskId:t})}catch(s){return console.error("[Workspaces] startTask failed:",s),null}}async function Hc(e,t,s){if(!e.client||!e.connected)return null;try{const n=await e.client.request("tasks.create",{title:t,project:s,source:"chat"});return we(n)}catch(n){return console.error("[Workspaces] createTask failed:",n),null}}async function Gc(e,t,s){if(!e.client||!e.connected)return null;try{return await e.client.request("workspaces.browseFolder",{workspaceId:t,folderPath:s})}catch(n){return console.error("[Workspaces] browseFolder failed:",n),null}}async function Qc(e,t,s,n=50){if(!e.client||!e.connected)return[];try{return(await e.client.request("workspaces.search",{workspaceId:t,query:s,limit:n})).results??[]}catch(i){return console.error("[Workspaces] search failed:",i),[]}}async function Yc(e,t,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.createFolder",{workspaceId:t,folderPath:s}),!0}catch(n){return console.error("[Workspaces] createFolder failed:",n),!1}}async function Jc(e,t,s,n){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.moveFile",{workspaceId:t,sourcePath:s,destPath:n}),!0}catch(i){return console.error("[Workspaces] moveFile failed:",i),!1}}async function Xc(e,t,s,n){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.renameFile",{workspaceId:t,filePath:s,newName:n}),!0}catch(i){return console.error("[Workspaces] renameFile failed:",i),!1}}const qe=Object.freeze(Object.defineProperty({__proto__:null,browseWorkspaceFolder:Gc,clearWorkspaceSelection:Fc,createTask:Hc,createWorkspace:Ec,createWorkspaceFolder:Yc,deleteWorkspace:Mc,getWorkspace:lt,loadAllTasks:Uc,loadAllTasksWithQueueStatus:qc,loadWorkspaceTasks:Bc,loadWorkspaces:rt,moveWorkspaceFile:Jc,readWorkspaceFile:Pc,renameWorkspaceFile:Xc,scanWorkspaces:Ic,searchWorkspaceFiles:Qc,selectWorkspace:Dc,setWorkspacesSearchQuery:Oc,startTask:zc,startTeamSetup:Nc,toggleTaskComplete:Vc,toggleWorkspaceFolder:Kc,toggleWorkspacePin:Rc,toggleWorkspaceSessionPin:Lc,updateTask:jc},Symbol.toStringTag,{value:"Module"})),Di="godmode.ui.settings.v1";function Zc(){const e=new URLSearchParams(location.search),t=(()=>{const i=e.get("gatewayUrl");return i||(typeof window.__GODMODE_DEV__<"u"?"/ws":`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}`)})(),s=e.get("token")||"",n={gatewayUrl:t,token:s,sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{System:!0,__missionControl__:!1},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]};try{const i=localStorage.getItem(Di);if(!i)return n;const a=JSON.parse(i);return{gatewayUrl:e.get("gatewayUrl")||(typeof window.__GODMODE_DEV__<"u"?"/ws":typeof a.gatewayUrl=="string"&&a.gatewayUrl.trim()?a.gatewayUrl.trim():n.gatewayUrl),token:s||(typeof a.token=="string"?a.token:""),sessionKey:typeof a.sessionKey=="string"&&a.sessionKey.trim()?a.sessionKey.trim():n.sessionKey,lastActiveSessionKey:typeof a.lastActiveSessionKey=="string"&&a.lastActiveSessionKey.trim()?a.lastActiveSessionKey.trim():typeof a.sessionKey=="string"&&a.sessionKey.trim()||n.lastActiveSessionKey,theme:a.theme==="light"||a.theme==="dark"||a.theme==="system"||a.theme==="lifetrack"?a.theme:n.theme,chatFocusMode:typeof a.chatFocusMode=="boolean"?a.chatFocusMode:n.chatFocusMode,chatShowThinking:typeof a.chatShowThinking=="boolean"?a.chatShowThinking:n.chatShowThinking,splitRatio:typeof a.splitRatio=="number"&&a.splitRatio>=.4&&a.splitRatio<=.7?a.splitRatio:n.splitRatio,navCollapsed:typeof a.navCollapsed=="boolean"?a.navCollapsed:n.navCollapsed,navGroupsCollapsed:typeof a.navGroupsCollapsed=="object"&&a.navGroupsCollapsed!==null?a.navGroupsCollapsed:n.navGroupsCollapsed,openTabs:Array.isArray(a.openTabs)&&a.openTabs.every(o=>typeof o=="string")?a.openTabs:n.openTabs,tabLastViewed:typeof a.tabLastViewed=="object"&&a.tabLastViewed!==null?a.tabLastViewed:n.tabLastViewed,userName:typeof a.userName=="string"?a.userName.trim().slice(0,50):n.userName,userAvatar:typeof a.userAvatar=="string"?a.userAvatar.trim():n.userAvatar,chatParallelView:typeof a.chatParallelView=="boolean"?a.chatParallelView:n.chatParallelView,parallelLanes:Array.isArray(a.parallelLanes)&&a.parallelLanes.length===4?a.parallelLanes.map(o=>typeof o=="string"?o:null):n.parallelLanes}}catch{return n}}function ed(e){localStorage.setItem(Di,JSON.stringify(e))}const td=56,sd="quantum-particles",nd="quantum-particle";let oe=null,Pe=null;function H(e,t){return Math.random()*(t-e)+e}function Ri(){if(Li(),typeof document>"u")return;const e=document.querySelector(".shell");if(!e){Pe=requestAnimationFrame(()=>{Pe=null,Ri()});return}oe=document.createElement("div"),oe.className=sd,Object.assign(oe.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"1",overflow:"hidden"});for(let t=0;t<td;t++){const s=document.createElement("div");s.className=nd;const n=H(2,5),i=H(.3,.65),a=H(15,35),o=H(0,12),l=H(5,95),p=H(5,95),m=H(-150,150),r=H(-200,200),f=H(-250,250),g=H(-350,350),v=H(.8,1.5);Object.assign(s.style,{position:"absolute",left:`${l}%`,top:`${p}%`,width:`${n}px`,height:`${n}px`,borderRadius:"50%",background:`rgba(235, 158, 15, ${H(.7,1)})`,boxShadow:`0 0 ${n*3}px rgba(235, 158, 15, ${i*.7})`,opacity:"0",willChange:"transform, opacity",animation:`quantum-float ${a}s ${o}s ease-in-out infinite`}),s.style.setProperty("--particle-opacity",String(i)),s.style.setProperty("--drift-x",`${m}px`),s.style.setProperty("--drift-y",`${r}px`),s.style.setProperty("--drift-end-x",`${f}px`),s.style.setProperty("--drift-end-y",`${g}px`),s.style.setProperty("--particle-scale-mid",String(v)),oe.appendChild(s)}e.prepend(oe)}function Li(){Pe!==null&&(cancelAnimationFrame(Pe),Pe=null),oe&&(oe.remove(),oe=null)}function id(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"lifetrack"}function cs(e){return e==="system"?id():e==="light"?"lifetrack":e}const Ne=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,ad=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,Ae=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},od=({nextTheme:e,applyTheme:t,context:s,currentTheme:n})=>{if(n===e)return;const i=globalThis.document??null;if(!i){t();return}const a=i.documentElement,o=i,l=ad();if(!!o.startViewTransition&&!l){let m=.5,r=.5;if(s?.pointerClientX!==void 0&&s?.pointerClientY!==void 0&&typeof window<"u")m=Ne(s.pointerClientX/window.innerWidth),r=Ne(s.pointerClientY/window.innerHeight);else if(s?.element){const g=s.element.getBoundingClientRect();g.width>0&&g.height>0&&typeof window<"u"&&(m=Ne((g.left+g.width/2)/window.innerWidth),r=Ne((g.top+g.height/2)/window.innerHeight))}a.style.setProperty("--theme-switch-x",`${m*100}%`),a.style.setProperty("--theme-switch-y",`${r*100}%`),a.classList.add("theme-transition");const f=setTimeout(()=>{Ae(a)},1e3);try{const g=o.startViewTransition?.(()=>{t()});g?.finished?g.finished.finally(()=>{clearTimeout(f),Ae(a)}):(clearTimeout(f),Ae(a))}catch{clearTimeout(f),Ae(a),t()}return}t(),Ae(a)};function rd(e,t){const s=Array.isArray(e)?[...new Set(e.map(n=>n.trim()).filter(n=>n.length>0))]:[];if(s.length===0&&t){const n=t.toLowerCase();n==="main"||n==="agent:main:main"||n.endsWith(":main")||s.push(t)}return s}function ld(e){const t={};if(!e||typeof e!="object")return t;for(const[s,n]of Object.entries(e)){const i=s.trim();!i||typeof n!="number"||!Number.isFinite(n)||(t[i]=Math.max(t[i]??0,n))}return t}function ne(e,t){const s=t.sessionKey.trim()||"main",n=rd(t.openTabs,s),i=ld(t.tabLastViewed),a={...t,sessionKey:s,openTabs:n,tabLastViewed:i,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||s};e.settings=a,ed(a),a.theme!==e.theme&&(e.theme=a.theme,Re(e,cs(a.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function ds(e,t){const s=t.trim();s&&e.settings.lastActiveSessionKey!==s&&ne(e,{...e.settings,lastActiveSessionKey:s})}function Ei(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),s=t.get("token"),n=t.get("password"),i=t.get("session"),a=t.get("gatewayUrl");let o=!1;if(s!=null){const p=s.trim();p&&p!==e.settings.token&&ne(e,{...e.settings,token:p}),t.delete("token"),o=!0}if(n!=null){const p=n.trim();p&&(e.password=p),t.delete("password"),o=!0}if(i!=null){const p=i.trim();if(p){e.sessionKey=p;const m=p.toLowerCase(),f=m==="main"||m==="agent:main:main"||m.endsWith(":main")||e.settings.openTabs.includes(p)?e.settings.openTabs:[...e.settings.openTabs,p];ne(e,{...e.settings,sessionKey:p,lastActiveSessionKey:p,openTabs:f})}}if(a!=null){const p=a.trim();p&&p!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=p),t.delete("gatewayUrl"),o=!0}if(!o)return;const l=new URL(window.location.href);l.search=t.toString(),window.history.replaceState({},"",l.toString())}function us(e,t){const s=e.tab;if(s!==t&&(e.tab=t),s==="chat"&&t!=="chat"&&e.sessionKey===M&&e._loadAllyHistory?.(),s==="dashboards"&&t!=="dashboards"){const n=e;if(n.dashboardPreviousSessionKey&&n.activeDashboardId){const i=n.dashboardPreviousSessionKey;n.dashboardPreviousSessionKey=null,n.activeDashboardId=null,n.activeDashboardManifest=null,n.activeDashboardHtml=null,n.dashboardChatOpen=!1,e.sessionKey=i}}t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?ss(e):ns(e),t==="logs"?is(e):as(e),t==="debug"?os(e):rs(e),t==="mission-control"?bi(e):Si(e),De(e),ps(e,t,!1)}function Mi(e,t,s){od({nextTheme:t,applyTheme:()=>{e.theme=t,ne(e,{...e.settings,theme:t}),Re(e,cs(t))},context:s,currentTheme:e.theme})}async function De(e){if(e.tab==="overview"&&await fs(e),(e.tab==="today"||e.tab==="my-day")&&(await Ge(e),w(()=>Promise.resolve().then(()=>xe),void 0,import.meta.url).then(async({loadTodayQueueResults:t})=>{e.todayQueueResults=await t(e)}).catch(()=>{})),e.tab==="work"&&await Promise.all([xi(e),Pi(e)]),e.tab==="workspaces"&&(await rt(e),w(()=>Promise.resolve().then(()=>qe),void 0,import.meta.url).then(async({loadAllTasksWithQueueStatus:t})=>{e.allTasks=await t(e)})),e.tab==="channels"&&await Wi(e),e.tab==="instances"&&await zt(e),e.tab==="sessions"&&(await W(e),await It(e)),e.tab==="cron"&&await ct(e),e.tab==="skills"&&(await In(e),await Dt(e)),e.tab==="agents"){const{loadRoster:t}=await w(async()=>{const{loadRoster:s}=await import("./ctrl-settings-rEJlXhcU.js").then(n=>n.ac);return{loadRoster:s}},[],import.meta.url);await t(e)}if(e.tab==="nodes"&&(await Xe(e),await Ze(e),await ge(e),await Dn(e)),e.tab==="chat"&&(await ys(e),z(e,!e.chatHasAutoScrolled),e.loadSessionResources?.()),e.tab==="options"){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}if(e.tab==="trust"){const t=e,s=[];typeof t.handleTrustLoad=="function"&&s.push(t.handleTrustLoad()),s.push(Pa(t)),s.push(W(t)),await Promise.all(s)}if(e.tab==="guardrails"){const t=e;typeof t.handleGuardrailsLoad=="function"&&await t.handleGuardrailsLoad()}if(e.tab==="mission-control"){const t=e;typeof t.handleMissionControlRefresh=="function"&&await t.handleMissionControlRefresh()}if(e.tab==="setup"){const t=e;typeof t.handleLoadCapabilities=="function"&&t.handleLoadCapabilities()}if(e.tab==="dashboards"){const t=e;typeof t.handleDashboardsRefresh=="function"&&await t.handleDashboardsRefresh()}if(e.tab==="second-brain"){const t=e;typeof t.handleSecondBrainRefresh=="function"&&await t.handleSecondBrainRefresh()}e.tab==="config"&&(await Rn(e),await ge(e)),e.tab==="debug"&&(await et(e),e.eventLog=tc()),e.tab==="logs"&&(e.logsAtBottom=!0,await jt(e,{reset:!0}),Un(e,!0))}function Oi(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?On(e):ro(window.location.pathname)}function Fi(e){e.theme=e.settings.theme??"system",Re(e,cs(e.theme))}function Re(e,t){if(e.themeResolved=t,typeof document>"u")return;const s=document.documentElement;s.dataset.theme=t,s.style.colorScheme=t==="dark"?"dark":"light",t==="lifetrack"?Ri():Li()}function Ni(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=s=>{e.theme==="system"&&Re(e,s.matches?"dark":"lifetrack")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function Ki(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function Bi(e,t){if(typeof window>"u")return;const s=Mn(window.location.pathname,e.basePath)??"chat";hs(e,s),ps(e,s,t)}function Ui(e){if(typeof window>"u")return;const t=Mn(window.location.pathname,e.basePath);if(!t)return;const n=new URL(window.location.href).searchParams.get("session")?.trim();if(n){e.sessionKey=n;const i=e.settings.openTabs.includes(n)?e.settings.openTabs:[...e.settings.openTabs,n];ne(e,{...e.settings,sessionKey:n,lastActiveSessionKey:n,openTabs:i})}hs(e,t)}function hs(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?ss(e):ns(e),t==="logs"?is(e):as(e),t==="debug"?os(e):rs(e),t==="mission-control"?bi(e):Si(e),e.connected&&De(e)}function ps(e,t,s){if(typeof window>"u")return;const n=Ds(Fn(t,e.basePath)),i=Ds(window.location.pathname),a=new URL(window.location.href);t==="chat"&&e.sessionKey?a.searchParams.set("session",e.sessionKey):a.searchParams.delete("session"),i!==n&&(a.pathname=n),s?window.history.replaceState({},"",a.toString()):window.history.pushState({},"",a.toString())}function J(e,t,s){if(typeof window>"u")return;const n=new URL(window.location.href);n.searchParams.set("session",t),s?window.history.replaceState({},"",n.toString()):window.history.pushState({},"",n.toString())}async function fs(e){await Promise.all([X(e,!1),zt(e),W(e),Pn(e),et(e)])}async function Wi(e){await Promise.all([X(e,!0),Rn(e),ge(e)])}async function ct(e){await Promise.all([X(e,!1),Pn(e),xa(e)])}const cd=Object.freeze(Object.defineProperty({__proto__:null,applyResolvedTheme:Re,applySettings:ne,applySettingsFromUrl:Ei,attachThemeListener:Ni,detachThemeListener:Ki,inferBasePath:Oi,loadChannelsTab:Wi,loadCron:ct,loadOverview:fs,onPopState:Ui,refreshActiveTab:De,setLastActiveSessionKey:ds,setTab:us,setTabFromRoute:hs,setTheme:Mi,syncTabWithLocation:Bi,syncThemeWithSettings:Fi,syncUrlWithSessionKey:J,syncUrlWithTab:ps},Symbol.toStringTag,{value:"Module"}));function Qe(e){return e.chatSending||!!e.chatRunId}function se(e,t){const s=t??e.sessionKey,n=e.chatMessage.trim();if(n)e.chatDrafts={...e.chatDrafts,[s]:n};else{const{[s]:i,...a}=e.chatDrafts;e.chatDrafts=a}}function re(e,t){const s=t??e.sessionKey;e.chatMessage=e.chatDrafts[s]??""}function qi(e,t){const s=t??e.sessionKey,{[s]:n,...i}=e.chatDrafts;e.chatDrafts=i,s===e.sessionKey&&(e.chatMessage="")}function Vi(e){const t=e.trim();if(!t)return!1;const s=t.toLowerCase();return s==="/stop"?!0:s==="stop"||s==="esc"||s==="abort"||s==="wait"||s==="exit"}function dd(e){const t=e.trim();if(!t)return!1;const s=t.toLowerCase();return s==="/new"||s==="/reset"?!0:s.startsWith("/new ")||s.startsWith("/reset ")}async function ms(e){e.connected&&(e.chatMessage="",await es(e))}function ud(e,t,s){const n=t.trim(),i=!!(s&&s.length>0);if(!n&&!i)return;const a=Date.now();e.chatQueue=[...e.chatQueue,{id:at(),text:n,createdAt:a,attachments:i?s?.map(l=>({...l})):void 0}];const o=[];if(n&&o.push({type:"text",text:n}),i&&s)for(const l of s)o.push({type:"image",source:{type:"base64",media_type:l.mimeType,data:l.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:o,timestamp:a}],z(e,!0)}async function Bt(e,t,s){Ht(e);const n=e;n.sessionKey&&n.workingSessions&&(n.workingSessions=new Set([...n.workingSessions,n.sessionKey])),s?.skipOptimisticUpdate||queueMicrotask(()=>{z(e,!0)});const i=await Zt(e,t,s?.attachments,{skipOptimisticUpdate:s?.skipOptimisticUpdate});return!i&&s?.previousDraft!=null&&(e.chatMessage=s.previousDraft),!i&&s?.previousAttachments&&(e.chatAttachments=s.previousAttachments),i&&(ds(e,e.sessionKey),e.chatAttachments=[]),i&&s?.restoreDraft&&s.previousDraft?.trim()&&(e.chatMessage=s.previousDraft),i&&s?.restoreAttachments&&s.previousAttachments?.length&&(e.chatAttachments=s.previousAttachments),z(e,!0),i&&!e.chatRunId&&gs(e),i&&s?.refreshSessions&&(e.refreshSessionsAfterChat=!0),i}async function gs(e){if(!e.connected||Qe(e))return;const[t,...s]=e.chatQueue;if(!t)return;e.chatQueue=s,await Bt(e,t.text,{attachments:t.attachments,skipOptimisticUpdate:!0})||(e.chatQueue=[t,...e.chatQueue])}function ji(e,t){e.chatQueue=e.chatQueue.filter(s=>s.id!==t)}async function zi(e,t,s){if(!e.connected)return;const n=e.chatMessage,i=(t??e.chatMessage).trim(),a=e.chatAttachments??[],o=t==null?a:[],l=o.length>0;if(!i&&!l)return;if(Vi(i)){await ms(e);return}const p=dd(i);if(t==null&&(e.chatMessage="",qi(e)),s?.queue){ud(e,i,o),Qe(e)||await gs(e);return}if(Qe(e)){await es(e),await new Promise(m=>setTimeout(m,50)),await Bt(e,i,{attachments:l?o:void 0,refreshSessions:p});return}await Bt(e,i,{previousDraft:t==null?n:void 0,restoreDraft:!!(t&&s?.restoreDraft),attachments:l?o:void 0,previousAttachments:t==null?a:void 0,restoreAttachments:!!(t&&s?.restoreDraft),refreshSessions:p})}async function ys(e){await Promise.all([q(e),W(e,{activeMinutes:0}),Ye(e)]),z(e,!0)}const Hi=gs;function hd(e){const t=Bn(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function pd(e,t){const s=On(e),n=encodeURIComponent(t);return s?`${s}/avatar/${n}?meta=1`:`/avatar/${n}?meta=1`}async function Ye(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=hd(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const s=pd(e.basePath,t);try{const n=await fetch(s,{method:"GET"});if(!n.ok){e.chatAvatarUrl=null;return}const i=await n.json(),a=typeof i.avatarUrl=="string"?i.avatarUrl.trim():"";e.chatAvatarUrl=a||null}catch{e.chatAvatarUrl=null}}const Tt=Object.freeze(Object.defineProperty({__proto__:null,clearDraft:qi,flushChatQueueForEvent:Hi,handleAbortChat:ms,handleSendChat:zi,isChatBusy:Qe,isChatStopCommand:Vi,refreshChat:ys,refreshChatAvatar:Ye,removeQueuedMessage:ji,restoreDraft:re,saveDraft:se},Symbol.toStringTag,{value:"Module"})),fd={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},md={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};function Gi(e){return new Date(e).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function gd(e,t){const s=Jt(e),n=it(s.role);if(n==="system")return null;if(n==="tool"){const l=[];for(const p of s.content)if(p.name&&l.push(`**Tool:** ${p.name}`),p.text){const m=p.text.length>2e3?p.text.slice(0,2e3)+`

... (truncated)`:p.text;l.push(m)}return l.length===0?null:`<details>
<summary>Tool result</summary>

${l.join(`

`)}

</details>`}const i=n==="user"||s.role==="User"?"User":t,a=[];for(const l of s.content)if(l.type==="text"&&l.text)a.push(l.text);else if(l.type==="tool_call"&&l.name){const p=l.args?`\`${JSON.stringify(l.args).slice(0,200)}\``:"";a.push(`> **Called tool:** \`${l.name}\` ${p}`)}if(a.length===0)return null;const o=Gi(s.timestamp);return`## ${i}
_${o}_

${a.join(`

`)}`}function yd(){const e=new Date,t=e.getFullYear(),s=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${t}-${s}-${n}`}function vd(e){return e.replace(/[^a-zA-Z0-9_-]/g,"-").replace(/-+/g,"-").slice(0,60)}function wd(e,t,s){if(!e||e.length===0)return;const n=s||"Assistant",i=[];i.push("# Conversation Export"),i.push(`**Session:** \`${t}\`  `),i.push(`**Exported:** ${Gi(Date.now())}  `),i.push(`**Assistant:** ${n}`),i.push("---");for(const m of e){const r=gd(m,n);r&&i.push(r)}const a=i.join(`

`)+`
`,o=new Blob([a],{type:"text/markdown;charset=utf-8"}),l=URL.createObjectURL(o),p=document.createElement("a");p.href=l,p.download=`session-${vd(t)}-${yd()}.md`,document.body.appendChild(p),p.click(),requestAnimationFrame(()=>{document.body.removeChild(p),URL.revokeObjectURL(l)})}function vs(){requestAnimationFrame(()=>{document.querySelector(".session-tab--active")?.scrollIntoView({behavior:"smooth",inline:"nearest",block:"nearest"})})}function bd(){requestAnimationFrame(()=>{document.querySelector(".chat-compose__textarea")?.focus()})}function dt(e){se(e);const s=`agent:main:webchat-${at().slice(0,8)}`;e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,s],sessionKey:s,lastActiveSessionKey:s,tabLastViewed:{...e.settings.tabLastViewed,[s]:Date.now()}}),e.sessionKey=s,e.chatMessage="",e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),J(e,s,!0),q(e),vs(),bd()}function Ut(e,t){const s=Fn(t,e.basePath);return c`
    <a
      href=${s}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${n=>{n.defaultPrevented||n.button!==0||n.metaKey||n.ctrlKey||n.shiftKey||n.altKey||(n.preventDefault(),e.setTab(t))}}
      title=${Ie(t)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${lo(t)}</span>
      <span class="nav-item__text">${Ie(t)}</span>
    </a>
  `}function Qi(e){const t=e.onboarding,s=e.onboarding,n=e.onboarding?!1:e.settings.chatShowThinking,i=e.onboarding?!0:e.settings.chatFocusMode,a=c`
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
  `,o=c`
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
  `,l=c`
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
  `,p=c`
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
  `;return c`
    <div class="chat-toolbar">
      <!-- New session button -->
      <button
        class="chat-toolbar__btn"
        @click=${()=>dt(e)}
        title="Start a new session (⌘⇧P)"
        aria-label="New session"
      >
        ${l}
      </button>
      <!-- Session picker (folder dropdown) -->
      <div class="session-picker-container">
        <button
          class="chat-toolbar__btn ${e.sessionPickerOpen?"active":""}"
          @click=${m=>{const f=m.currentTarget.getBoundingClientRect();e.sessionPickerPosition={top:f.bottom+8,right:window.innerWidth-f.right},e.sessionPickerOpen||W(e),e.handleToggleSessionPicker()}}
          title="Open sessions"
          aria-label="Open sessions"
          aria-expanded=${e.sessionPickerOpen}
        >
          ${R.folderOpen}
        </button>
        ${e.sessionPickerOpen?Td(e):y}
      </div>
      <!-- Session search -->
      <div class="session-search-container">
        <button
          class="chat-toolbar__btn ${e.sessionSearchOpen?"active":""}"
          @click=${m=>e.handleToggleSessionSearch(m)}
          title="Search sessions"
          aria-label="Search session contents"
          aria-expanded=${e.sessionSearchOpen}
        >
          ${p}
        </button>
        ${e.sessionSearchOpen?kd(e):y}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),ys(e)}}
        title="Refresh chat data"
      >
        ${a}
      </button>
      <span class="chat-toolbar__separator"></span>
      <!-- Thinking toggle -->
      <button
        class="chat-toolbar__btn ${n?"active":""}"
        ?disabled=${t}
        @click=${()=>{t||e.applySettings({...e.settings,chatShowThinking:!e.settings.chatShowThinking})}}
        aria-pressed=${n}
        title=${t?"Disabled during onboarding":"Toggle assistant thinking/working output"}
      >
        ${R.brain}
      </button>
      <!-- Focus mode toggle -->
      <button
        class="chat-toolbar__btn ${i?"active":""}"
        ?disabled=${s}
        @click=${()=>{s||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})}}
        aria-pressed=${i}
        title=${s?"Disabled during onboarding":"Toggle focus mode (hide sidebar + page header)"}
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
        ${R.lock}
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
        @click=${()=>{wd(e.chatMessages,e.sessionKey,e.assistantName)}}
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
  `}function Sd(e){const t=new Date,s=new Date(t.getFullYear(),t.getMonth(),t.getDate()),n=new Date(s.getTime()-864e5);return{today:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=s),yesterday:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=n&&new Date(i.updatedAt)<s),older:e.filter(i=>!i.updatedAt||new Date(i.updatedAt)<n)}}let _t=null;function kd(e){if(!e.client||!e.connected)return c`
      <div
        class="session-search-dropdown"
        style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;const t=i=>{const a=i.target.value;e.sessionSearchQuery=a,_t&&clearTimeout(_t),_t=setTimeout(()=>{e.handleSessionSearchQuery(a)},300)},s=i=>{e.sessionSearchOpen=!1,e.sessionSearchQuery="",e.sessionSearchResults=[],se(e),e.settings.openTabs.includes(i)?(e.sessionKey=i,e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,i],sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.sessionKey=i),re(e,i),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),J(e,i,!0),q(e).then(()=>{nt(e),z(e,!0)})},n=i=>{const a=i.label??i.displayName??i.key,o=i.matches.length>0;return c`
      <div class="session-search-result" @click=${()=>s(i.key)}>
        <div class="session-search-result__header">
          <span class="session-search-result__name">${a}</span>
        </div>
        ${o?c`
              <div class="session-search-result__matches">
                ${i.matches.slice(0,2).map(l=>c`
                    <div class="session-search-result__match">
                      <span class="session-search-result__role">${l.role}:</span>
                      <span class="session-search-result__text">${l.text}</span>
                    </div>
                  `)}
              </div>
            `:y}
      </div>
    `};return c`
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
        ${e.sessionSearchLoading?c`
                <div class="session-search-empty">Searching...</div>
              `:e.sessionSearchQuery.trim()===""?c`
                  <div class="session-search-empty">Type to search session contents</div>
                `:e.sessionSearchResults.length===0?c`
                    <div class="session-search-empty">No results found</div>
                  `:e.sessionSearchResults.map(n)}
      </div>
    </div>
  `}function Td(e){const t=(e.sessionPickerSearch??"").toLowerCase().trim();if(!e.client||!e.connected)return c`
      <div
        class="session-picker-dropdown"
        style="top: ${e.sessionPickerPosition?.top??0}px; right: ${e.sessionPickerPosition?.right??0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Not connected</div>
        </div>
      </div>
    `;if(e.sessionsLoading)return c`
      <div
        class="session-picker-dropdown"
        style="top: ${e.sessionPickerPosition?.top??0}px; right: ${e.sessionPickerPosition?.right??0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Loading sessions...</div>
        </div>
      </div>
    `;let s=(e.sessionsResult?.sessions??[]).filter(g=>!e.settings.openTabs.includes(g.key));t&&(s=s.filter(g=>[g.label,g.displayName,g.key].filter(Boolean).some(b=>b.toLowerCase().includes(t))));const n=50,i=s.length,a=s.slice(0,n),o=Sd(a),l=g=>{e.sessionPickerOpen=!1,e.sessionPickerSearch="",se(e),e.settings.openTabs.includes(g)?(e.sessionKey=g,e.applySettings({...e.settings,sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,g],sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}}),e.sessionKey=g),re(e,g),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),J(e,g,!0),q(e).then(()=>{nt(e),z(e,!0)})},p=async(g,v)=>{if(g.stopPropagation(),!!window.confirm(`Delete session "${v}"?

Deletes the session entry and archives its transcript.`)&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.filter(_=>_.key!==v)}),e.client&&e.connected))try{await e.client.request("sessions.delete",{key:v,deleteTranscript:!0}),W(e)}catch(_){console.error("Failed to delete session:",_),W(e)}},m=g=>c`
    <div class="session-picker-item" @click=${()=>l(g.key)}>
      <span class="session-picker-item__status ${g.isActive?"active":""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${g.label??g.displayName??fe.get(g.key)??g.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${g.updatedAt?c`<span class="session-picker-item__time">${Ia(g.updatedAt)}</span>`:y}
        <button
          class="session-picker-item__close"
          @click=${v=>p(v,g.key)}
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
  `,r=(g,v)=>v.length===0?y:c`
      <div class="session-picker-group">
        <div class="session-picker-group__header">${g}</div>
        ${tt(v,b=>b.key,m)}
      </div>
    `,f=o.today.length+o.yesterday.length+o.older.length;return c`
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
          @input=${g=>{e.sessionPickerSearch=g.target.value}}
          @click=${g=>g.stopPropagation()}
        />
      </div>
      <div class="session-picker-list">
        ${f===0?c`
                <div class="session-picker-empty">No other sessions</div>
              `:c`
              ${r("Today",o.today)}
              ${r("Yesterday",o.yesterday)}
              ${r("Older",o.older)}
              ${i>n?c`<div class="session-picker-overflow">
                    Showing ${n} of ${i} sessions. Use search to find more.
                  </div>`:y}
            `}
      </div>
    </div>
  `}const _d=["system","light","dark","lifetrack"];function Yi(e){const t=Math.max(0,_d.indexOf(e.theme)),s=n=>i=>{const o={element:i.currentTarget};(i.clientX||i.clientY)&&(o.pointerClientX=i.clientX,o.pointerClientY=i.clientY),e.setTheme(n,o)};return c`
    <div class="theme-toggle" style="--theme-index: ${t};">
      <div class="theme-toggle__track" role="group" aria-label="Theme">
        <span class="theme-toggle__indicator"></span>
        <button
          class="theme-toggle__button ${e.theme==="system"?"active":""}"
          @click=${s("system")}
          aria-pressed=${e.theme==="system"}
          aria-label="System theme"
          title="System"
        >
          ${Cd()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${s("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${Ad()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${s("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${$d()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="lifetrack"?"active":""}"
          @click=${s("lifetrack")}
          aria-pressed=${e.theme==="lifetrack"}
          aria-label="Lifetrack theme"
          title="Lifetrack"
        >
          ${xd()}
        </button>
      </div>
    </div>
  `}function Ad(){return c`
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
  `}function $d(){return c`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function Cd(){return c`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function xd(){return c`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"></path>
      <path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67L19 15z"></path>
    </svg>
  `}const ie=Object.freeze(Object.defineProperty({__proto__:null,createNewSession:dt,renderChatControls:Qi,renderTab:Ut,renderThemeToggle:Yi,scrollActiveTabIntoView:vs},Symbol.toStringTag,{value:"Module"})),At=new Set;function an(e){if(!(!e.connected||!e.client||!e.settings.chatParallelView))for(const t of e.settings.parallelLanes){const s=t?.trim();if(!s)continue;const i=me(e.sessionsResult?.sessions,s)?.key??s;if(le.has(s)||le.has(i)||At.has(i))continue;At.add(i);const o=e.client;ii(o,i).then(l=>{i!==s&&l.length>0&&le.set(s,l)}).finally(()=>{At.delete(i),e.applySettings({...e.settings})})}}function Pd(e){e.basePath=Oi(),e._urlSettingsApplied||(Ei(e),e._urlSettingsApplied=!0),Bi(e,!0),Fi(e),Ni(e),window.addEventListener("popstate",e.popStateHandler),e.keydownHandler=t=>{if(e.tab!=="chat")return;if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="p"){t.preventDefault(),dt(e);return}if(!t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.key<"1"||t.key>"9")return;const s=parseInt(t.key,10)-1,n=e.settings.openTabs;if(s>=n.length)return;const i=n[s];i!==e.sessionKey&&(t.preventDefault(),se(e),e.sessionKey=i,re(e,i),e.chatLoading=!0,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.loadAssistantIdentity(),J(e,i,!0),q(e).then(()=>{He(e)}))},window.addEventListener("keydown",e.keydownHandler),ts(e),e.tab==="nodes"&&ss(e),e.tab==="logs"&&is(e),e.tab==="debug"&&os(e)}function Id(e){Go(e)}function Dd(e){window.removeEventListener("popstate",e.popStateHandler),window.removeEventListener("keydown",e.keydownHandler),e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null),e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null),ns(e),as(e),rs(e),Ki(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function me(e,t){if(!e||!t)return;const s=e.find(o=>o.key===t);if(s)return s;const n=t.split(":"),i=n[n.length-1];if(i&&i.length>=4){const o=e.find(l=>l.key===i||l.key.endsWith(`:${i}`));if(o)return o}const a=t.replace(/^webchat:/,"");if(a!==t){const o=e.find(l=>l.key.endsWith(a)||l.key.endsWith(`:${a}`));if(o)return o}}function Rd(e,t){if(!t||t.length===0)return;const s=p=>{const m=p.toLowerCase();return m==="main"||m==="agent:main:main"||m.endsWith(":main")},n=(p,m)=>{const r=p?.sessionId?.trim();if(r)return`session:${r}`;if(p){const g=[p.kind,p.surface,p.subject,p.room,p.space,p.label,p.displayName].map(v=>String(v??"").trim().toLowerCase()).join("|");if(g.replace(/\|/g,"").length>0)return`meta:${g}`}return`key:${m}`};let i=!1;const a=new Map,o=[];for(const p of e.settings.openTabs){const m=p.trim();if(!m){i=!0;continue}if(s(m)){i=!0;continue}const r=me(t,m),f=r?.key??m;f!==p&&(i=!0);const g=n(r,f);if(a.has(g)){i=!0;continue}a.set(g,f),o.push(f)}const l=o.length!==e.settings.openTabs.length;if(i||l){const p={};for(const[b,_]of Object.entries(e.settings.tabLastViewed)){const P=b.trim();if(!P||typeof _!="number"||!Number.isFinite(_))continue;const x=me(t,P),C=n(x,x?.key??P),L=a.get(C)??x?.key??P;p[L]=Math.max(p[L]??0,_)}const m=me(t,e.sessionKey),r=n(m,m?.key??e.sessionKey.trim()),f=a.get(r)??m?.key??(e.sessionKey.trim()||o[0]||"main"),v=f==="main"||f.endsWith(":main")||o.includes(f)?f:o[0]||"main";e.applySettings({...e.settings,openTabs:o,sessionKey:v,lastActiveSessionKey:v,tabLastViewed:p}),e.sessionKey!==v&&(e.sessionKey=v)}}function Ld(e,t){if((t.has("sessionsResult")||t.has("settings"))&&e.sessionsResult?.sessions&&Rd(e,e.sessionsResult.sessions),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.settings.chatParallelView&&an(e),t.has("settings")&&e.connected&&e.settings.chatParallelView){const s=t.get("settings"),n=s?!s.chatParallelView:!0,i=!s||s.parallelLanes.some((a,o)=>a!==e.settings.parallelLanes[o]);(n||i)&&an(e)}if(t.has("sessionPickerOpen")&&(e.sessionPickerOpen?setTimeout(()=>{e.sessionPickerOpen&&(e.sessionPickerClickOutsideHandler=s=>{const n=s.target,i=n.closest(".session-picker-container"),a=n.closest(".session-picker-dropdown");!i&&!a&&(e.sessionPickerOpen=!1)},document.addEventListener("click",e.sessionPickerClickOutsideHandler,!0))},0):e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null)),t.has("sessionSearchOpen")&&(e.sessionSearchOpen?setTimeout(()=>{e.sessionSearchOpen&&(e.sessionSearchClickOutsideHandler=s=>{const n=s.target,i=n.closest(".session-search-container"),a=n.closest(".session-search-dropdown");!i&&!a&&(e.sessionSearchOpen=!1)},document.addEventListener("click",e.sessionSearchClickOutsideHandler,!0))},0):e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null)),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab==="chat"&&!e.chatLoading&&q(e).then(()=>{He(e)}),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab!=="chat"&&De(e),e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("sessionKey")||t.has("tab"))){const s=t.has("tab"),n=t.has("sessionKey"),i=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;let a=!1;if(t.has("chatMessages")){const o=e.chatMessages;o[o.length-1]?.role==="user"&&(a=!0)}t.has("chatStream")&&(a=!1),(s||n||i)&&nt(e),z(e,s||n||i||a||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&Un(e,t.has("tab")||t.has("logsAutoFollow"))}async function on(e,t){return!1}async function Ed(e,t){return null}function rn(e){return e.charAt(0).toUpperCase()||"A"}function ln(e){if(!e)return"";const t=new Date(e),s=t.getHours(),n=t.getMinutes().toString().padStart(2,"0"),i=s>=12?"PM":"AM";return`${s%12||12}:${n} ${i}`}function Md(e){e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,120)}px`}function Ji(e,t=80){return e.scrollHeight-e.scrollTop-e.clientHeight<t}function Xi(e){const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)}const cn=new WeakMap;function Od(e){requestAnimationFrame(()=>{const t=document.querySelector(".ally-panel, .ally-inline");if(!t)return;const s=t.querySelector(".ally-panel__messages");if(!s)return;const n=cn.get(s),i=n??{lastMsgCount:0,lastStreamLen:0},a=e.messages.length,o=e.stream?.length??0,l=a!==i.lastMsgCount||o>i.lastStreamLen;cn.set(s,{lastMsgCount:a,lastStreamLen:o}),l&&(!n||Ji(s,120))&&Xi(t)})}function Fd(e){const t=e.currentTarget,s=t.querySelector(".ally-jump-bottom");s&&s.classList.toggle("ally-jump-bottom--visible",!Ji(t))}function Zi(e,t){return e.allyAvatar?c`<img class=${t==="bubble"?"ally-bubble__avatar":"ally-panel__header-avatar"} src=${e.allyAvatar} alt=${e.allyName} />`:t==="header"?c`<span class="ally-panel__header-initial">${rn(e.allyName)}</span>`:c`${rn(e.allyName)}`}function dn(e){if(e.role==="assistant"&&e.content){const t=G(e.content);return c`<div class="ally-msg__content chat-text">${Te(t)}</div>`}return c`<span class="ally-msg__content">${e.content}</span>`}function Nd(e,t){return!e.actions||e.actions.length===0?y:c`
    <div class="ally-msg__actions">
      ${e.actions.map(s=>c`
          <button
            type="button"
            class="ally-msg__action-btn"
            @click=${()=>t?.(s.action,s.target,s.method,s.params)}
          >
            ${s.label}
          </button>
        `)}
    </div>
  `}function Kd(e,t,s){if(e.isNotification)return c`
      <div class="ally-msg ally-msg--notification" data-idx=${t}>
        ${dn(e)}
        ${Nd(e,s)}
        ${e.timestamp?c`<div class="ally-msg__time">${ln(e.timestamp)}</div>`:y}
      </div>
    `;const n=e.role==="user"?"ally-msg--user":"ally-msg--assistant";return c`
    <div class="ally-msg ${n}" data-idx=${t}>
      ${dn(e)}
      ${e.timestamp?c`<div class="ally-msg__time">${ln(e.timestamp)}</div>`:y}
    </div>
  `}function Bd(e){if(!e)return y;const t=Wn(e);return c`
    <div class="ally-msg ally-msg--streaming">
      <div class="ally-msg__content chat-text">${Te(t)}</div>
    </div>
  `}function Ud(e){return e.connected?y:c`<div class="ally-panel__status ally-panel__status--disconnected">Disconnected</div>`}function Wd(){return c`
    <div class="ally-msg ally-msg--assistant ally-msg--reading-indicator">
      <span class="chat-reading-indicator__dots">
        <span></span><span></span><span></span>
      </span>
    </div>
  `}function qd(e,t){const s=e.clipboardData?.items;if(!s)return;const n=[];for(const i of Array.from(s)){if(!i.type.startsWith("image/"))continue;const a=i.getAsFile();if(!a)continue;e.preventDefault();const o=new FileReader,l=`paste-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;o.onload=()=>{const p=o.result;t.onAttachmentsChange([...t.attachments,{id:l,dataUrl:p,mimeType:a.type,fileName:a.name||"screenshot.png",status:"ready"}])},o.readAsDataURL(a),n.push({id:l,dataUrl:"",mimeType:a.type,fileName:a.name,status:"reading"})}n.length>0&&t.onAttachmentsChange([...t.attachments,...n])}function Vd(e){return e.attachments.length===0?y:c`
    <div class="ally-panel__attachments">
      ${e.attachments.map(t=>c`
          <div class="ally-panel__attachment">
            ${t.dataUrl?c`<img src=${t.dataUrl} alt=${t.fileName??"attachment"} class="ally-panel__attachment-img" />`:c`<span class="ally-panel__attachment-loading">...</span>`}
            <button
              type="button"
              class="ally-panel__attachment-remove"
              title="Remove"
              @click=${()=>e.onAttachmentsChange(e.attachments.filter(s=>s.id!==t.id))}
            >${R.x}</button>
          </div>
        `)}
    </div>
  `}function jd(e){const t=e.connected?`Message ${e.allyName}...`:"Reconnecting...",s=e.draft.trim()||e.attachments.length>0;return c`
    ${Vd(e)}
    <div class="ally-panel__input">
      <textarea
        class="ally-panel__textarea"
        .value=${e.draft}
        ?disabled=${!e.connected||e.sending}
        placeholder=${t}
        rows="1"
        @input=${n=>{const i=n.target;Md(i),e.onDraftChange(i.value)}}
        @paste=${n=>qd(n,e)}
        @keydown=${n=>{n.key==="Enter"&&(n.isComposing||n.keyCode===229||n.shiftKey||e.connected&&(n.preventDefault(),e.onSend()))}}
      ></textarea>
      <button
        class="ally-panel__send-btn"
        type="button"
        ?disabled=${!e.connected||!s&&!e.sending}
        title="Send"
        @click=${()=>e.onSend()}
      >
        ${R.arrowUp}
      </button>
    </div>
  `}function zd(e){return c`
    <div class="ally-bubble">
      <button
        type="button"
        class="ally-bubble__btn"
        title="Chat with ${e.allyName}"
        aria-label="Open ${e.allyName} chat"
        @click=${()=>e.onToggle()}
      >
        ${Zi(e,"bubble")}
        ${e.isWorking?c`<span class="ally-bubble__working"></span>`:y}
      </button>
      ${e.unreadCount>0?c`<span class="ally-bubble__badge">${e.unreadCount>99?"99+":e.unreadCount}</span>`:y}
    </div>
  `}function ea(e){return Od(e),c`
    <div class="ally-panel__header">
      <div class="ally-panel__header-left">
        ${Zi(e,"header")}
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

    ${Ud(e)}

    <div class="ally-panel__messages" @scroll=${Fd}>
      ${e.messages.length===0&&!e.stream?c`<div class="ally-panel__empty">
            Start a conversation with ${e.allyName}
          </div>`:y}
      ${e.messages.map((t,s)=>Kd(t,s,e.onAction))}
      ${e.stream?Bd(e.stream):y}
      ${(e.isWorking||e.sending)&&!e.stream?Wd():y}
      <button
        type="button"
        class="ally-jump-bottom"
        title="Jump to latest"
        @click=${t=>{const s=t.currentTarget.closest(".ally-panel, .ally-inline");s&&Xi(s)}}
      >${R.chevronDown}</button>
    </div>

    ${jd(e)}
  `}function Hd(e){return e.open?c`
    <div class="ally-panel">
      ${ea(e)}
    </div>
  `:zd(e)}function Gd(e){return e.open?c`
    <div class="ally-inline">
      ${ea(e)}
    </div>
  `:y}function Qd(e){return typeof e.content=="string"?e.content:typeof e.text=="string"?e.text:Array.isArray(e.content)?e.content.map(t=>typeof t.text=="string"?t.text:"").join(`
`):""}const Yd=["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"];function Jd(e){const t=typeof e.role=="string"?e.role.toLowerCase():"";if(t!=="user"&&t!=="system")return!1;const s=Qd(e).trim();if(!s)return!1;let n=s;if((s.includes("<system-context")||s.includes("<godmode-context"))&&(n=s.replace(/<system-context[\s\S]*?<\/system-context>/gi,"").replace(/<godmode-context[\s\S]*?<\/godmode-context>/gi,"").trim(),!n)||n.startsWith("Read HEARTBEAT.md")||n.startsWith("Read CONSCIOUSNESS.md")||n.startsWith("Pre-compaction memory flush")||n.startsWith("pre-compaction memory flush")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(n)||n==="NO_REPLY"||n.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(n)||n.startsWith("# WORKING.md")||n.startsWith("# MISTAKES.md")||/(?:VERIFIED|FIXED|NEW):\s/.test(n)&&/✅|🟡|☑/.test(n)&&n.length>300||/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(n)||/^\[GodMode Context:[^\]]*\]\s*$/.test(n)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(n)||/^##?\s*Persistence Protocol/i.test(n)||/^##?\s*Core (?:Behaviors|Principles)/i.test(n)||/^##?\s*Your Role as \w+/i.test(n)||/^##\s*Your Team\s*\(Agent Roster\)/i.test(n)&&n.indexOf(`

## `)===-1||/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(n)&&n.length>200||/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(n))return!0;const i=n.toLowerCase();return Yd.filter(a=>i.includes(a)).length>=2}const un=25*1024*1024,hn=50*1024*1024,pn=20;function $t(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:e<1024*1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:`${(e/(1024*1024*1024)).toFixed(1)} GB`}function ws(e,t=0){const s=[],n=[];let i=t;const a=Array.from(e);for(const o of a){if(s.length>=pn){n.push(`Maximum ${pn} files allowed per upload`);break}if(o.size>un){n.push(`"${o.name}" is too large (${$t(o.size)}). Max ${$t(un)}. For larger files, mention the file path instead.`);continue}if(i+o.size>hn){n.push(`Total upload size exceeds ${$t(hn)} limit`);break}i+=o.size,s.push(o)}return{validFiles:s,errors:n}}const Xd=new Set(["md","markdown","mdx"]),Zd=new Set(["htm","html"]),eu=new Set(["avif","bmp","gif","heic","heif","jpeg","jpg","png","svg","svgz","webp"]);function ta(e){const t=e.replaceAll("\\","/").trim();if(!t)return e;const s=t.split("/");return s[s.length-1]||t}function tu(e){if(!e)return null;const s=e.trim().toLowerCase().split(".").pop()??"";return s?Xd.has(s)?"text/markdown":Zd.has(s)?"text/html":eu.has(s)?s==="svg"||s==="svgz"?"image/svg+xml":s==="jpg"?"image/jpeg":`image/${s}`:s==="pdf"?"application/pdf":s==="json"||s==="json5"?"application/json":s==="txt"||s==="text"||s==="log"?"text/plain":null:null}function sa(e){const t=e.mimeType?.split(";")[0]?.trim().toLowerCase()??"";if(t)return t;const s=e.content?.trim()??"";if(s.startsWith("data:image/")){const n=/^data:(image\/[^;]+);/i.exec(s);return n?.[1]?n[1].toLowerCase():"image/*"}return tu(e.filePath??null)??"text/markdown"}function su(e){if(!e.startsWith("file://"))return null;let t=e.slice(7);return t.startsWith("/~/")&&(t="~"+t.slice(2)),decodeURIComponent(t)}function nu(e,t){if(!t)return;const n=e.target.closest("a");if(!n)return;const i=n.getAttribute("href");if(!i)return;const a=su(i);a&&(e.preventDefault(),e.stopPropagation(),t(a))}function iu(e){if(e.error)return c`
      <div class="callout danger">${e.error}</div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(!e.content)return c`
      <div class="muted">No content available</div>
    `;const t=sa(e),s=e.content,n=s.trim();if(t.startsWith("image/"))return n.startsWith("data:image/")?c`
        <div class="sidebar-image">
          <img src=${n} alt=${ta(e.filePath??"Image preview")} />
        </div>
      `:c`
      <div class="callout">
        Image preview unavailable for this payload format.
      </div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(t==="application/pdf")return n.startsWith("data:application/pdf")?c`<iframe
        class="sidebar-html-frame sidebar-pdf-frame"
        src=${n}
        type="application/pdf"
      ></iframe>`:c`
      <div class="callout">
        PDF preview unavailable. Use "Open in Browser" to view.
      </div>
    `;if(t==="text/html"||t==="application/xhtml+xml"){const i=new Blob([s],{type:"text/html"}),a=URL.createObjectURL(i);return c`<iframe
      class="sidebar-html-frame"
      src=${a}
      sandbox="allow-same-origin allow-top-navigation-by-user-activation allow-popups"
      @load=${o=>{URL.revokeObjectURL(a);const l=o.target;try{const p=l.contentDocument?.documentElement?.scrollHeight;p&&(l.style.height=`${p}px`)}catch{}}}
    ></iframe>`}if(t==="text/markdown"||t==="text/x-markdown"){const i=co(s);return c`<div
      class="sidebar-markdown"
      @click=${a=>nu(a,e.onOpenFile)}
    >${Te(G(i))}</div>`}return c`<pre class="sidebar-plain">${s}</pre>`}function au(e){const t=sa(e);return t==="text/html"||t==="application/xhtml+xml"}function ou(e){const t=new Blob([e],{type:"text/html"}),s=URL.createObjectURL(t);window.open(s,"_blank","noopener,noreferrer")}function Wt(e){const t=e.title?.trim()||"Tool Output",s=au(e)&&e.content;return c`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${t}</div>
          ${e.filePath?c`<div class="sidebar-path" title=${e.filePath}>${e.filePath}</div>`:y}
        </div>
        <div class="sidebar-header-actions">
          ${e.onPushToDrive&&e.filePath?c`<div class="sidebar-drive-wrap">
                <button
                  class="btn sidebar-open-browser-btn${e.driveUploading?" sidebar-drive-uploading":""}"
                  title="Push to Google Drive"
                  ?disabled=${e.driveUploading}
                  @click=${()=>e.driveUploading?void 0:e.onToggleDrivePicker?e.onToggleDrivePicker():e.onPushToDrive(e.filePath)}
                >${e.driveUploading?"Uploading...":"⬆ Drive"}</button>
                ${e.showDrivePicker&&e.driveAccounts&&!e.driveUploading?c`<div class="sidebar-drive-picker">
                      ${e.driveAccounts.length===0?c`<div class="sidebar-drive-item sidebar-drive-empty">No Google accounts configured</div>`:e.driveAccounts.map(n=>c`
                              <button
                                class="sidebar-drive-item"
                                @click=${()=>{e.onPushToDrive(e.filePath,n.email),e.onToggleDrivePicker?.()}}
                                title=${n.email}
                              >
                                <span class="sidebar-drive-label">${n.email.split("@")[0]}</span>
                                <span class="sidebar-drive-domain">@${n.email.split("@")[1]}</span>
                              </button>
                            `)}
                    </div>`:y}
              </div>`:y}
          ${s?c`<button
                class="btn sidebar-open-browser-btn"
                title="Open in browser tab"
                @click=${()=>ou(e.content)}
              >Open in Browser</button>`:y}
          <button @click=${e.onClose} class="btn" title="Close sidebar">
            ${R.x}
          </button>
        </div>
      </div>
      ${ru(e)}
      <div class="sidebar-content">${iu(e)}</div>
    </div>
  `}function ru(e){if(e.resource)return c`
      <div class="sidebar-resource-bar">
        <span class="resource-type-badge">${e.resource.type.replace("_"," ")}</span>
        <span style="flex: 1;">${e.resource.title}</span>
        <button
          class="sidebar-pin-btn${e.resource.pinned?" pinned":""}"
          title=${e.resource.pinned?"Unpin":"Pin"}
          @click=${()=>e.onToggleResourcePin?.(e.resource.id,!e.resource.pinned)}
        >${e.resource.pinned?"★":"☆"}</button>
      </div>
    `;if(e.filePath&&e.onSaveAsResource){const t=e.title?.trim()||ta(e.filePath);return c`
      <div class="sidebar-resource-bar">
        <button
          class="sidebar-save-resource-btn"
          @click=${()=>e.onSaveAsResource(e.filePath,t)}
        >Save as Resource</button>
      </div>
    `}return y}var lu=Object.defineProperty,cu=Object.getOwnPropertyDescriptor,Le=(e,t,s,n)=>{for(var i=n>1?void 0:n?cu(t,s):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(n?o(t,s,i):o(i))||i);return n&&i&&lu(t,s,i),i};let ve=class extends Ln{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.direction="horizontal",this.isDragging=!1,this.startPos=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startPos=this.direction==="vertical"?e.clientY:e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const s=this.direction==="vertical",n=s?t.getBoundingClientRect().height:t.getBoundingClientRect().width,o=((s?e.clientY:e.clientX)-this.startPos)/n;let l=this.startRatio+o;l=Math.max(this.minRatio,Math.min(this.maxRatio,l)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:l},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return c``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};ve.styles=no`
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
  `;Le([st({type:Number})],ve.prototype,"splitRatio",2);Le([st({type:Number})],ve.prototype,"minRatio",2);Le([st({type:Number})],ve.prototype,"maxRatio",2);Le([st({type:String})],ve.prototype,"direction",2);ve=Le([En("resizable-divider")],ve);const du=5e3;function fn(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function uu(e){const t=e.sessions?.sessions?.find(i=>i.key===e.sessionKey);if(!t)return null;const s=t.totalTokens??0,n=t.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return n<=0?null:s/n}function hu(e){const t=uu(e);if(t===null)return y;const s=Math.round(t*100),n=s>=90?"danger":s>=70?"warn":"ok",i=e.sessions?.sessions?.find(r=>r.key===e.sessionKey),a=i?.totalTokens??0,o=i?.contextTokens??e.sessions?.defaults?.contextTokens??2e5,l=s>=90?"Soul + identity only":s>=70?"P0 + P1 active":"Full context",p=s>=90?c`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--danger">
          Schedule, tasks, skill cards trimmed
        </span>`:s>=70?c`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--warn">
            Meetings, cron, queue review trimmed
          </span>`:y,m=c`
    <span class="chat-context-badge__tier ${s<70?"active":"trimmed"}">P3 Safety nudges, onboarding</span>
    <span class="chat-context-badge__tier ${s<70?"active":"trimmed"}">P2 Meetings, cron, queue review</span>
    <span class="chat-context-badge__tier ${s<90?"active":"trimmed"}">P1 Schedule, tasks, skill cards</span>
    <span class="chat-context-badge__tier active">P0 Soul, identity, memory</span>
  `;return c`
    <button
      type="button"
      class="chat-context-badge chat-context-badge--${n}"
      role="status"
      aria-label="Context window: ${s}% used (${l}). Click to compact."
      @click=${()=>e.onCompact?.()}
      ?disabled=${!e.connected}
    >
      ${s}%
      <span class="chat-context-badge__bar">
        <span class="chat-context-badge__bar-fill chat-context-badge__bar-fill--${n}" style="width:${s}%"></span>
      </span>
      <span class="chat-context-badge__tooltip">
        <span class="chat-context-badge__tooltip-header">
          ${a.toLocaleString()} / ${o.toLocaleString()} tokens
        </span>
        ${p}
        <span class="chat-context-badge__tier-list">${m}</span>
        <span class="chat-context-badge__tooltip-action">Click to compact</span>
      </span>
    </button>
  `}function pu(e){return e?e.active?c`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${R.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<du?c`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${R.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `:y:y}function bs(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function fu(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy")}function mu(e,t){e.preventDefault(),e.stopPropagation(),t.classList.add("chat--drag-over")}function gu(e,t){e.preventDefault(),e.stopPropagation();const s=t.getBoundingClientRect();(e.clientX<=s.left||e.clientX>=s.right||e.clientY<=s.top||e.clientY>=s.bottom)&&t.classList.remove("chat--drag-over")}function yu(e,t){e.preventDefault(),e.stopPropagation(),e.currentTarget.classList.remove("chat--drag-over");const n=e.dataTransfer?.files;if(!n||n.length===0||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((r,f)=>r+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=ws(n,a);for(const r of l)t.showToast?.(r,"error");if(o.length===0)return;const p=[];let m=o.length;for(const r of o){const f=new FileReader;f.addEventListener("load",()=>{const g=f.result;p.push({id:bs(),dataUrl:g,mimeType:r.type||"application/octet-stream",fileName:r.name}),m--,m===0&&t.onAttachmentsChange?.([...i,...p])}),f.addEventListener("error",()=>{t.showToast?.(`Failed to read "${r.name}"`,"error"),m--,m===0&&p.length>0&&t.onAttachmentsChange?.([...i,...p])}),f.readAsDataURL(r)}}function vu(e,t){const s=e.clipboardData?.items;if(!s||!t.onAttachmentsChange)return;const n=[];for(let r=0;r<s.length;r++){const f=s[r];if(f.type.startsWith("image/")){const g=f.getAsFile();g&&n.push(g)}}if(n.length===0)return;e.preventDefault();const i=t.attachments??[],a=i.reduce((r,f)=>r+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=ws(n,a);for(const r of l)t.showToast?.(r,"error");if(o.length===0)return;const p=[];let m=o.length;for(const r of o){const f=new FileReader;f.addEventListener("load",()=>{const g=f.result;p.push({id:bs(),dataUrl:g,mimeType:r.type,fileName:r.name||"pasted-image"}),m--,m===0&&t.onAttachmentsChange?.([...i,...p])}),f.addEventListener("error",()=>{t.showToast?.("Failed to read pasted image","error"),m--,m===0&&p.length>0&&t.onAttachmentsChange?.([...i,...p])}),f.readAsDataURL(r)}}function wu(e,t){const s=e.target,n=s.files;if(!n||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((r,f)=>r+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=ws(n,a);for(const r of l)t.showToast?.(r,"error");if(o.length===0){s.value="";return}const p=[];let m=o.length;for(const r of o){const f=new FileReader;f.addEventListener("load",()=>{const g=f.result;p.push({id:bs(),dataUrl:g,mimeType:r.type||"application/octet-stream",fileName:r.name}),m--,m===0&&t.onAttachmentsChange?.([...i,...p])}),f.addEventListener("error",()=>{t.showToast?.(`Failed to read "${r.name}"`,"error"),m--,m===0&&p.length>0&&t.onAttachmentsChange?.([...i,...p])}),f.readAsDataURL(r)}s.value=""}function bu(e){const t=e.attachments??[];return t.length===0?y:c`
    <div class="chat-attachments">
      ${t.map(s=>{const n=s.mimeType.startsWith("image/"),i=s.fileName||"file",a=i.length>40?i.slice(0,37)+"...":i;return c`
          <div class="chat-attachment ${n?"":"chat-attachment--file"}">
            ${n?c`<img src=${s.dataUrl} alt="Attachment preview" class="chat-attachment__img" />`:c`<div class="chat-attachment__file">
                  ${R.fileText}
                  <span class="chat-attachment__filename" title=${i}>${a}</span>
                </div>`}
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const o=(e.attachments??[]).filter(l=>l.id!==s.id);e.onAttachmentsChange?.(o)}}
            >
              ${R.x}
            </button>
          </div>
        `})}
    </div>
  `}function Su(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function ku(e){const t=e.href;if(t){if(e.target==="_blank"){window.open(t,"_blank","noopener,noreferrer");return}window.location.assign(t)}}function Tu(e){const t=e.trim();return!t||t.includes(`
`)?null:t.startsWith("/")||t.startsWith("~/")||t.startsWith("./")||t.startsWith("../")||/^[a-z]:[\\/]/i.test(t)||/^[^:\s]+\/[^\s]+$/.test(t)&&/\.[a-z0-9]{1,12}$/i.test(t)||/^[^\s/\\:*?"<>|]+\.[a-z0-9]{1,12}$/i.test(t)&&t.length<=100?t:null}async function _u(e,t){const s=e.target,n=s instanceof Element?s:s instanceof Node?s.parentElement:null;if(!n||!t.onMessageLinkClick||!Su(e))return;const i=n.closest("a");if(i instanceof HTMLAnchorElement){if(i.hasAttribute("download"))return;const p=i.getAttribute("href");if(!p)return;if(t.onOpenProof)try{const r=p.match(/(?:proofeditor\.ai|127\.0\.0\.1:\d+|localhost:\d+)\/d\/([a-zA-Z0-9_-]+)/);if(r){e.preventDefault(),t.onOpenProof(r[1]);return}}catch{}try{const r=new URL(p,window.location.href);if(/^https?:$/.test(r.protocol)&&r.origin!==window.location.origin){e.preventDefault(),window.open(r.href,"_blank","noopener,noreferrer");return}}catch{}e.preventDefault(),await t.onMessageLinkClick(p)||ku(i);return}const a=n.closest("code");if(!(a instanceof HTMLElement))return;const o=(a.textContent??"").trim();if(/^https?:\/\/\S+$/i.test(o)){e.preventDefault(),window.open(o,"_blank","noopener,noreferrer");return}if(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(\/\S*)?$/i.test(o)){e.preventDefault(),window.open(`https://${o}`,"_blank","noopener,noreferrer");return}const l=Tu(o);l&&(e.preventDefault(),await t.onMessageLinkClick(l))}const Au={html_report:"📊",plan:"📋",analysis:"🔍",code:"💻",doc:"📝",data:"📦",image:"🖼️",script:"⚙️"};function $u(e){const t=e.sessionResources;if(!t||t.length===0)return y;if(e.sessionResourcesCollapsed)return c`
      <div class="session-resources-strip">
        <div class="session-resources-header">
          <span class="session-resources-label">Resources (${t.length})</span>
          <button class="session-resources-toggle" @click=${e.onToggleSessionResources}>▲</button>
        </div>
      </div>
    `;const s=t.slice(0,5);return c`
    <div class="session-resources-strip">
      <div class="session-resources-header">
        <span class="session-resources-label">Resources (${t.length})</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          ${t.length>5?c`<button class="session-resources-view-all" @click=${e.onViewAllResources}>View all</button>`:y}
          <button class="session-resources-toggle" @click=${e.onToggleSessionResources}>▼</button>
        </div>
      </div>
      <div class="session-resources-cards">
        ${s.map(n=>c`
            <button
              class="session-resource-chip"
              @click=${()=>e.onSessionResourceClick?.(n)}
            >
              <span>${Au[n.type]||"📄"}</span>
              <span>${n.title}</span>
            </button>
          `)}
      </div>
    </div>
  `}function Cu(e){const t=e.connected,s=e.sending||e.stream!==null,n=!!(e.canAbort&&e.onAbort),a=e.sessions?.sessions?.find(v=>v.key===e.sessionKey)?.reasoningLevel??"off",o=e.showThinking&&a!=="off",l={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},p=(e.attachments?.length??0)>0,m=e.connected?p?"Add a message or paste more images...":"Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",r=e.splitRatio??.6,f=!!(e.sidebarOpen&&e.onCloseSidebar),g=c`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
      @click=${v=>{_u(v,e)}}
    >
      ${e.loading?c`
              <div class="muted">Loading chat…</div>
            `:y}
      ${tt(Du(e),v=>v.key,v=>{try{if(v.kind==="reading-indicator")return hl(l,e.currentToolInfo);if(v.kind==="stream")return pl(v.text,v.startedAt,e.onOpenSidebar,l,e.currentToolInfo);if(v.kind==="compaction-summary")return yl(v.message);if(v.kind==="group"){const b=e.resolveImageUrl?(_,P)=>e.resolveImageUrl(_,P):void 0;return fl(v,{onOpenSidebar:e.onOpenSidebar,onOpenFile:e.onOpenFile,onOpenProof:e.onOpenProof,onPushToDrive:e.onPushToDrive,onImageClick:e.onImageClick,resolveImageUrl:b,showReasoning:o,assistantName:e.assistantName,assistantAvatar:l.avatar,userName:e.userName,userAvatar:e.userAvatar})}return y}catch(b){return console.error("[chat] item render error:",b,v.key),y}})}
    </div>
  `;return c`
    <section 
      class="card chat"
      @dragover=${fu}
      @dragenter=${v=>mu(v,v.currentTarget)}
      @dragleave=${v=>gu(v,v.currentTarget)}
      @drop=${v=>yu(v,e)}
    >
      ${e.privateMode?c`<div class="callout callout--private" aria-live="polite">
            <span style="margin-right:6px">🔒</span>
            <strong>Private Session</strong> — Nothing from this conversation will be saved to memory or vault.
          </div>`:y}

      ${e.disabledReason?c`<div class="callout">${e.disabledReason}</div>`:y}

      ${e.error?c`<div class="callout danger">${e.error}</div>`:y}

      ${pu(e.compactionStatus)}

      ${e.pendingRetry&&e.onRetry?c`
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
                ${e.onClearRetry?c`
                      <button
                        class="btn btn--ghost btn--sm"
                        type="button"
                        @click=${e.onClearRetry}
                      >
                        Dismiss
                      </button>
                    `:y}
              </div>
            </div>
          `:y}

      ${e.focusMode?c`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${R.x}
            </button>
          `:y}

      <div
        class="chat-split-container ${f?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${f?`0 0 ${r*100}%`:"1 1 100%"}"
          @click=${f?()=>e.onCloseSidebar?.():y}
        >
          ${g}
          ${e.showScrollButton?c`
                <button
                  class="chat-scroll-bottom"
                  type="button"
                  aria-label="Scroll to bottom"
                  title="Scroll to bottom"
                  @click=${()=>e.onScrollToBottom?.()}
                >
                  ${e.showNewMessages?c`<span class="chat-scroll-bottom__badge"></span>`:y}
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              `:y}
        </div>

        ${f?c`
              <resizable-divider
                .splitRatio=${r}
                @resize=${v=>e.onSplitRatioChange?.(v.detail.splitRatio)}
              ></resizable-divider>
              ${e.allyPanelOpen&&e.allyProps?c`
                    <div class="chat-sidebar chat-sidebar--split">
                      <div class="chat-sidebar-top">
                      ${Wt({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                    </div>
                    <resizable-divider
                      direction="vertical"
                      .splitRatio=${.6}
                      .minRatio=${.2}
                      .maxRatio=${.8}
                    ></resizable-divider>
                    <div class="chat-sidebar-bottom">
                      ${Gd(e.allyProps)}
                    </div>
                  </div>
                `:c`
                  <div class="chat-sidebar">
                    ${Wt({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                  </div>
                `}
            `:y}
      </div>

      ${e.queue.length?c`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(v=>c`
                    <div class="chat-queue__item">
                      <div class="chat-queue__text">
                        ${v.text||(v.attachments?.length?`Image (${v.attachments.length})`:"")}
                      </div>
                      <button
                        class="btn chat-queue__remove"
                        type="button"
                        aria-label="Remove queued message"
                        @click=${()=>e.onQueueRemove(v.id)}
                      >
                        ${R.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:y}

      ${$u(e)}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${v=>wu(v,e)}
          />
          ${bu(e)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${io(v=>v&&fn(v))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${v=>{if(v.key!=="Enter"||v.isComposing||v.keyCode===229||v.shiftKey||!e.connected)return;v.preventDefault();const b=v.ctrlKey||v.metaKey;t&&e.onSend(b)}}
              @input=${v=>{const b=v.target;fn(b),e.onDraftChange(b.value)}}
              @paste=${v=>vu(v,e)}
              placeholder=${m}
            ></textarea>

            <div class="chat-compose__actions">
              ${hu(e)}

              <button
                class="chat-compose__toolbar-btn"
                type="button"
                title="Attach files"
                ?disabled=${!e.connected}
                @click=${()=>{document.getElementById("chat-file-input")?.click()}}
              >
                ${R.paperclip}
              </button>

              ${n?c`
                  <button
                    class="chat-compose__send-btn chat-compose__send-btn--stop"
                    @click=${()=>e.onAbort()}
                    title="Stop generating"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="3" y="3" width="10" height="10" rx="1.5" />
                    </svg>
                  </button>
                `:c`
                  <button
                    class="chat-compose__send-btn"
                    ?disabled=${!e.canSend||!e.connected}
                    @click=${()=>e.onSend(!1)}
                    title=${s?"Send now - interrupts current run (↵)":"Send message (↵)"}
                  >
                    ${R.arrowUp}
                  </button>
                `}
            </div>
          </div>
        </div>
      </div>
    </section>
  `}const mn=200;function xu(e){const t=[];let s=null;for(const n of e){if(n.kind!=="message"){s&&(t.push(s),s=null),t.push(n);continue}const i=Jt(n.message),a=it(i.role),o=i.timestamp||Date.now();!s||s.role!==a?(s&&t.push(s),s={kind:"group",key:`group:${a}:${n.key}`,role:a,messages:[{message:n.message,key:n.key}],timestamp:o,isStreaming:!1}):s.messages.push({message:n.message,key:n.key})}return s&&t.push(s),t}function Pu(e){const s=e.content;if(!Array.isArray(s))return!1;for(const n of s){if(typeof n!="object"||n===null)continue;const i=n;if(i.type==="image")return!0;if(Array.isArray(i.content)){for(const a of i.content)if(!(typeof a!="object"||a===null)&&a.type==="image")return!0}}return!1}function Iu(e){const s=e.content;if(!Array.isArray(s)||s.length===0)return!1;for(const n of s){if(typeof n!="object"||n===null)continue;const i=n,a=typeof i.type=="string"?i.type:"";if(a!=="toolCall"&&a!=="tool_use"&&a!=="thinking")return!1}return!0}function Du(e){const t=[],s=Array.isArray(e.messages)?e.messages:[],n=Array.isArray(e.toolMessages)?e.toolMessages:[],i=Math.max(0,s.length-mn);i>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${mn} messages (${i} hidden).`,timestamp:Date.now()}});for(let a=i;a<s.length;a++){const o=s[a];if(o._chatIdx=a,vl(o)){t.push({kind:"compaction-summary",key:`compaction:${a}`,message:o});continue}if(Jd(o))continue;const l=Jt(o);!e.showThinking&&l.role.toLowerCase()==="toolresult"&&!Pu(o)||!e.showThinking&&l.role.toLowerCase()==="assistant"&&Iu(o)||t.push({kind:"message",key:gn(o,a),message:o})}if(e.showThinking)for(let a=0;a<n.length;a++)t.push({kind:"message",key:gn(n[a],a+s.length),message:n[a]});if(e.stream!==null){const a=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:a,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:a})}else if(e.isWorking){const a=`working:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}else if(e.sending||e.canAbort){const a=`sending:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}return xu(t)}function gn(e,t){const s=e,n=typeof s.toolCallId=="string"?s.toolCallId:"";if(n)return`tool:${n}`;const i=typeof s.id=="string"?s.id:"";if(i)return`msg:${i}`;const a=typeof s.messageId=="string"?s.messageId:"";if(a)return`msg:${a}`;const o=typeof s.timestamp=="number"?s.timestamp:null,l=typeof s.role=="string"?s.role:"unknown";if(o!=null){const p=typeof s.content=="string"?s.content.slice(0,32):"";return`msg:${l}:${o}:${p||t}`}return`msg:${l}:${t}`}function Ru(e){const{pendingGatewayUrl:t}=e;return t?c`
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
  `:y}function Lu(e){if(!e.gatewayRestartPending)return y;const t=e.sessionsResult?.sessions?.length??0,s=t===1?"1 active session":`${t} active sessions`;return c`
    <div class="exec-approval-overlay" role="dialog" aria-modal="true" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Restart Gateway</div>
            <div class="exec-approval-sub">${s} will be terminated</div>
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
  `}function na(e){const t=Date.now()-new Date(e).getTime(),s=Math.floor(t/6e4);if(s<1)return"just now";if(s<60)return`${s}m ago`;const n=Math.floor(s/60);return n<24?`${n}h ago`:`${Math.floor(n/24)}d ago`}function Eu(e){return e.source.persona?e.source.persona.replace(/-/g," ").replace(/\b\w/g,t=>t.toUpperCase()):e.source.skill?e.source.skill:e.type==="agent-execution"?"Agent":"Skill"}function Mu(e){return e<=2?"Poor":e<=4?"Below expectations":e<=6?"Okay":e<=8?"Good":"Excellent"}function ia(e,t){if(e.scoringId!==t.id)return y;const s=e.scoringValue??7,n=e.feedbackText??"",i=s<=4,a=s<=4||s>=9;return c`
    <div class="inbox-scoring">
      <div class="inbox-score-label">
        Rate this output
        <span class="inbox-score-value ${s<=4?"low":s>=9?"high":""}">${s}/10 — ${Mu(s)}</span>
      </div>
      <div class="inbox-score-row">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>c`
            <button
              class="inbox-score-btn${o===s?" active":""}${o<=4?" low":o>=9?" high":""}"
              @click=${()=>e.onSetScoring(t.id,o)}
            >${o}</button>
          `)}
      </div>
      ${a?c`
            <div class="inbox-feedback">
              <textarea
                class="inbox-feedback-input"
                rows="3"
                placeholder=${i?"What went wrong? This feedback improves the agent. (required)":"What made this great? (optional)"}
                .value=${n}
                @input=${o=>e.onFeedbackChange(o.target.value)}
              ></textarea>
            </div>
          `:y}
      <div class="inbox-score-actions">
        <button
          class="btn btn--sm inbox-score-submit"
          ?disabled=${i&&!n.trim()}
          @click=${()=>e.onScore(t.id,s,n.trim()||void 0)}
        >Submit ${s}/10</button>
        <button
          class="btn btn--sm inbox-score-cancel"
          @click=${()=>e.onSetScoring(null)}
        >Cancel</button>
      </div>
    </div>
  `}function Ou(e,t){const s=t.deliverables??[];return c`
    <div class="inbox-card inbox-card--project">
      <div class="inbox-card-header">
        <span class="inbox-card-source">Project Complete</span>
        <span class="inbox-card-time">${na(t.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${t.title}</div>
        <div class="inbox-card-summary">${t.summary}</div>
        ${s.length>0?c`
              <div class="inbox-deliverables">
                ${s.map(n=>c`
                    <div class="inbox-deliverable-row">
                      <span class="inbox-deliverable-persona">${n.persona.replace(/-/g," ")}</span>
                      <span class="inbox-deliverable-title">${n.title}</span>
                      ${n.proofDocSlug?c`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View</button>`:y}
                    </div>
                  `)}
              </div>
            `:y}
      </div>
      <div class="inbox-card-actions">
        <button class="btn btn--sm primary" @click=${()=>e.onOpenChat(t.id)}>Review in Chat</button>
        ${t.proofDocSlug?c`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View Deliverables</button>`:y}
        <button class="btn btn--sm" @click=${()=>e.onSetScoring(t.id,7)}>Score</button>
        <button class="btn btn--sm" @click=${()=>e.onDismiss(t.id)}>Dismiss</button>
      </div>
      ${ia(e,t)}
    </div>
  `}function Fu(e,t){if(t.type==="project-completion")return Ou(e,t);const s=!!(t.sessionId||t.source.taskId||t.source.queueItemId);return c`
    <div class="inbox-card">
      <div class="inbox-card-header">
        <span class="inbox-card-source">${Eu(t)}</span>
        <span class="inbox-card-time">${na(t.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${t.title}</div>
        <div class="inbox-card-summary">${t.summary.slice(0,220)}${t.summary.length>220?"…":""}</div>
      </div>
      <div class="inbox-card-actions">
        ${t.outputPath?c`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View Output</button>`:y}
        ${t.proofDocSlug?c`<button class="btn btn--sm" @click=${()=>e.onViewProof(t.id)}>Proof</button>`:y}
        ${s?c`<button class="btn btn--sm" @click=${()=>e.onOpenChat(t.id)}>Open Chat</button>`:y}
        <button class="btn btn--sm primary" @click=${()=>e.onSetScoring(t.id,7)}>Complete</button>
        <button class="btn btn--sm" @click=${()=>e.onDismiss(t.id)}>Dismiss</button>
      </div>
      ${ia(e,t)}
    </div>
  `}function Nu(e){const t=e.sortOrder??"newest",s=e.items.filter(i=>i.status==="pending").sort((i,a)=>{const o=new Date(a.createdAt).getTime()-new Date(i.createdAt).getTime();return t==="oldest"?-o:o}),n=e.count??s.length;return e.loading?c`<div class="inbox-loading">Loading inbox…</div>`:n===0?c`
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
    `:c`
    <div class="my-day-card">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x1F4E5;</span>
          <span>INBOX</span>
          <span class="tab-badge" style="margin-left: 8px;">${n}</span>
        </div>
        <div class="inbox-header-actions">
          <button class="btn btn--sm" @click=${()=>e.onSortToggle?.()}>${t==="newest"?"Newest first":"Oldest first"}</button>
          <button class="btn btn--sm" @click=${()=>e.onMarkAll()}>Mark All Complete</button>
        </div>
      </div>
      <div class="my-day-card-content">
        <div class="inbox-list">
          ${s.map(i=>Fu(e,i))}
        </div>
      </div>
    </div>
  `}function aa(e){return!Number.isFinite(e)||e<=0?"0 B":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function Ss(e){switch(e){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function yn(e){return e==="running"?"ws-session-dot ws-session-dot--running":e==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function oa(e){return`ws-task-priority ws-task-priority--${e}`}function ra(e){return e==="high"?"High":e==="low"?"Low":"Med"}function la(e){if(!e)return"";const t=K();return e===t?"Today":e<t?`Overdue (${e})`:e}function ca(e){if(!e)return"ws-task-due";const t=K();return e<t?"ws-task-due ws-task-due--overdue":e===t?"ws-task-due ws-task-due--today":"ws-task-due"}function Je(e,t="due"){const s={high:0,medium:1,low:2};return[...e].sort((n,i)=>{if(t==="priority"){const a=s[n.priority]-s[i.priority];return a!==0?a:n.dueDate&&i.dueDate?n.dueDate.localeCompare(i.dueDate):n.dueDate&&!i.dueDate?-1:!n.dueDate&&i.dueDate?1:0}if(t==="newest")return(i.createdAt||"").localeCompare(n.createdAt||"");if(n.dueDate&&i.dueDate){const a=n.dueDate.localeCompare(i.dueDate);if(a!==0)return a}else{if(n.dueDate&&!i.dueDate)return-1;if(!n.dueDate&&i.dueDate)return 1}return s[n.priority]-s[i.priority]})}function vn(e,t,s,n,i,a,o){const l=e.status==="complete";return n===e.id?c`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${m=>{m.preventDefault();const r=m.currentTarget,f=r.querySelector(".ws-task-edit-input"),g=r.querySelector(".ws-task-date-input"),v=f.value.trim();v&&(a?.(e.id,{title:v,dueDate:g.value||null}),i?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${e.title}
          @click=${m=>m.stopPropagation()}
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
    `:c`
    <div class="ws-list-row ws-task-row ${l?"ws-task-row--complete":""}">
      <button
        class="ws-task-check ${l?"ws-task-check--done":""}"
        @click=${()=>t?.(e.id,e.status)}
        title=${l?"Mark incomplete":"Mark complete"}
      >
        ${l?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${l?"ws-task-title--done":""}"
        @click=${()=>i?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.briefSection?c`<span class="ws-task-section">${e.briefSection}</span>`:y}
      <span class=${oa(e.priority)}>${ra(e.priority)}</span>
      ${e.dueDate?c`<span class=${ca(e.dueDate)}>${la(e.dueDate)}</span>`:y}
      ${!l&&e.queueStatus?.status==="processing"?c`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!l&&e.queueStatus?.status==="review"&&s?c`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>s(e.id)}
              title="Review agent output"
            >Review</button>`:e.queueStatus?.status==="done"?c`
                ${y}
                ${s?c`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>s(e.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:y}
              `:!l&&s?c`<button
                  class="ws-task-start-btn"
                  @click=${()=>s(e.id)}
                  title="Start working on this task"
                >Start</button>`:y}
    </div>
  `}function qt(e,t,s,n,i,a,o){const l=e.status==="complete";return n===e.id?c`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${m=>{m.preventDefault();const r=m.currentTarget,f=r.querySelector(".ws-task-edit-input"),g=r.querySelector(".ws-task-date-input"),v=f.value.trim();v&&(a?.(e.id,{title:v,dueDate:g.value||null}),i?.(null))}}
      >
        <input
          type="text"
          class="ws-task-edit-input"
          .value=${e.title}
          @click=${m=>m.stopPropagation()}
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
    `:c`
    <div class="ws-list-row ws-task-row ${l?"ws-task-row--complete":""}">
      <button
        class="ws-task-check ${l?"ws-task-check--done":""}"
        @click=${()=>t?.(e.id,e.status)}
        title=${l?"Mark incomplete":"Mark complete"}
      >
        ${l?"✓":""}
      </button>
      <span
        class="ws-list-title ws-task-title-clickable ${l?"ws-task-title--done":""}"
        @click=${()=>i?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.project?c`<span class="ws-task-project">${e.project}</span>`:y}
      ${e.briefSection?c`<span class="ws-task-section">${e.briefSection}</span>`:y}
      <span class=${oa(e.priority)}>${ra(e.priority)}</span>
      ${e.dueDate?c`<span class=${ca(e.dueDate)}>${la(e.dueDate)}</span>`:y}
      ${!l&&e.queueStatus?.status==="processing"?c`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!l&&e.queueStatus?.status==="review"&&s?c`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>s(e.id)}
              title="Review agent output"
            >Review</button>`:e.queueStatus?.status==="done"?c`
                ${o?c`<button
                      class="ws-task-start-btn ws-task-start-btn--done"
                      @click=${()=>o(e.id)}
                      title="Preview agent output"
                    >View Output</button>`:y}
                ${s?c`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>s(e.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:y}
              `:!l&&s?c`<button
                  class="ws-task-start-btn"
                  @click=${()=>s(e.id)}
                  title="Start working on this task"
                >Start</button>`:y}
    </div>
  `}function Ku(e,t){return e.trim()?t.toLowerCase().includes(e.trim().toLowerCase()):!0}function wn(e,t){if(!e.trim())return t;const s=e.trim().toLowerCase();return t.filter(n=>n.name.toLowerCase().includes(s)||n.path.toLowerCase().includes(s)||n.type.toLowerCase().includes(s)||(n.searchText??"").toLowerCase().includes(s))}function bn(e,t){if(!e.trim())return t;const s=e.trim().toLowerCase();return t.filter(n=>n.title.toLowerCase().includes(s)||n.key.toLowerCase().includes(s))}function da(e,t){if(!e.trim())return t;const s=e.trim().toLowerCase();return t.reduce((n,i)=>{if(i.type==="file")(i.name.toLowerCase().includes(s)||i.path.toLowerCase().includes(s))&&n.push(i);else{const a=da(e,i.children??[]);a.length>0&&n.push({...i,children:a})}return n},[])}function ua(e){let t=0;for(const s of e)s.type==="file"?t++:s.children&&(t+=ua(s.children));return t}const Bu=10;function Uu(e){if(!e.searchText)return null;const t=e.searchText.trim();if(!t)return null;const s=t.match(/#+ (.+?)(?:\s#|$)/);return s?s[1].trim().slice(0,120):(t.startsWith("---")?t.replace(/^---.*?---\s*/s,""):t).slice(0,120)||null}function Wu(e,t=Bu){return[...e].sort((s,n)=>n.modified.getTime()-s.modified.getTime()).slice(0,t)}function ha(e,t,s){if(e.type==="file"){const o=s.pinnedPaths.has(e.path);return c`
      <div class="ws-folder-file-row" style="padding-left: ${12+t*16}px">
        <button
          class="ws-folder-file"
          @click=${()=>s.onItemClick?.({path:e.path,name:e.name,type:e.fileType??"text",size:e.size??0,modified:e.modified??new Date})}
        >
          <span class="ws-list-icon">${Ss(e.fileType??"text")}</span>
          <span class="ws-list-title">${e.name}</span>
          ${e.size!=null?c`<span class="ws-list-meta">${aa(e.size)}</span>`:y}
          ${e.modified?c`<span class="ws-list-meta">${ke(e.modified.getTime())}</span>`:y}
        </button>
        <button
          class="ws-pin-btn ${o?"active":""}"
          @click=${()=>s.onPinToggle?.(s.workspaceId,e.path,o)}
          title=${o?"Unpin":"Pin"}
        >
          ${o?"Unpin":"Pin"}
        </button>
      </div>
    `}const n=s.expandedFolders.has(e.path),i=e.children??[],a=ua(i);return c`
    <div class="ws-folder-node">
      <button
        class="ws-folder-header"
        style="padding-left: ${12+t*16}px"
        @click=${()=>s.onToggleFolder?.(e.path)}
      >
        <span class="ws-folder-chevron ${n?"expanded":""}">&#9654;</span>
        <span class="ws-list-icon">&#128193;</span>
        <span class="ws-folder-name">${e.name}</span>
        <span class="ws-folder-count">${a} ${a===1?"file":"files"}</span>
      </button>
      ${n?c`
            <div class="ws-folder-children">
              ${i.map(o=>ha(o,t+1,s))}
            </div>
          `:y}
    </div>
  `}function qu(e,t,s){return c`
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
            <span>${ke(e.lastUpdated.getTime())}</span>
          </div>
        </div>
      </button>
      ${s?c`<button
            class="workspace-card-delete"
            title="Delete workspace"
            @click=${n=>{n.stopPropagation(),confirm(`Delete workspace "${e.name}"? This removes it from your list but does not delete any files.`)&&s(e)}}
          >&times;</button>`:y}
    </div>
  `}function Ct(e){const{workspaceId:t,entry:s,pinned:n,onOpen:i,onPinToggle:a}=e;return c`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(s)}>
        <span class="ws-list-icon">${Ss(s.type)}</span>
        <span class="ws-list-title">${s.name}</span>
        <span class="ws-list-meta">${aa(s.size)}</span>
        <span class="ws-list-meta">${ke(s.modified.getTime())}</span>
      </button>
      <button
        class="ws-pin-btn ${n?"active":""}"
        @click=${()=>a?.(t,s.path,n)}
        title=${n?"Unpin":"Pin"}
      >
        ${n?"Unpin":"Pin"}
      </button>
    </div>
  `}function Vu(e){const{workspaceId:t,entry:s,pinned:n,onOpen:i,onPinToggle:a}=e,o=Uu(s);return c`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(s)}>
        <span class="ws-list-icon">${Ss(s.type)}</span>
        <span class="ws-list-title">${s.name}</span>
        <span class="ws-list-meta">${ke(s.modified.getTime())}</span>
        ${o?c`<span class="ws-list-desc">${o}</span>`:y}
      </button>
      <button
        class="ws-pin-btn ${n?"active":""}"
        @click=${()=>a?.(t,s.path,n)}
        title=${n?"Unpin":"Pin"}
      >
        ${n?"Unpin":"Pin"}
      </button>
    </div>
  `}function ju(e,t){return c`
    <div class="workspace-breadcrumbs">
      ${e.map((s,n)=>c`
          ${n>0?c`<span class="breadcrumb-sep">/</span>`:y}
          <button
            class="breadcrumb-item ${n===e.length-1?"breadcrumb-current":""}"
            @click=${()=>t(s.path)}
          >${s.name}</button>
        `)}
    </div>
  `}function zu(e){const{browseEntries:t,breadcrumbs:s,browseSearchQuery:n,browseSearchResults:i,onBrowseFolder:a,onBrowseSearch:o,onBrowseBack:l,onCreateFolder:p,onItemClick:m}=e,r=i??t??[];return c`
    <div class="workspace-browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${()=>l?.()}>
          &larr; Back
        </button>
        ${s?ju(s,f=>a?.(f)):y}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          .value=${n??""}
          @input=${f=>{const g=f.target;o?.(g.value)}}
        />
        <button
          class="workspace-browse-new-folder"
          @click=${()=>{const f=prompt("New folder name:");if(f?.trim()){const g=s?.[s.length-1]?.path??".";p?.(`${g}/${f.trim()}`)}}}
        >+ Folder</button>
      </div>

      <div class="workspace-browse-list">
        ${r.length===0?c`<div class="workspace-browse-empty">No files found</div>`:r.map(f=>c`
              <button
                class="workspace-browse-entry"
                @click=${()=>{f.type==="folder"?a?.(f.path):m&&m({path:f.path,name:f.name,type:f.fileType??"text",size:f.size??0,modified:new Date})}}
              >
                <span class="browse-entry-icon">${f.type==="folder"?"📁":"📄"}</span>
                <span class="browse-entry-name">${f.name}</span>
                ${f.excerpt?c`<span class="browse-entry-excerpt">${f.excerpt}</span>`:y}
              </button>
            `)}
      </div>
    </div>
  `}function Hu(e){const{workspace:t,itemSearchQuery:s,expandedFolders:n=new Set,showCompletedTasks:i=!1,onItemSearch:a,onBack:o,onItemClick:l,onSessionClick:p,onPinToggle:m,onPinSessionToggle:r,onToggleFolder:f,onToggleTaskComplete:g,onCreateTask:v,onToggleCompletedTasks:b,onStartTask:_,editingTaskId:P,onEditTask:x,onUpdateTask:C,onBatchPushToDrive:L}=e,B=wn(s,t.pinned).toSorted((A,Z)=>Z.modified.getTime()-A.modified.getTime()),S=bn(s,t.pinnedSessions),T=wn(s,t.outputs).filter(A=>!t.pinned.some(Z=>Z.path===A.path)),$=(t.folderTree?.length??0)>0,I=$?da(s,t.folderTree):[],k=bn(s,t.sessions),D=new Set(t.pinnedSessions.map(A=>A.key)),j=new Set(t.pinned.map(A=>A.path)),E=s.trim().length>0,Q=B.length>0||S.length>0,ce=k.length>0||t.sessions.length===0||E,de=Wu(t.outputs),O=de.length>0&&!E,U={expandedFolders:n,pinnedPaths:j,workspaceId:t.id,onToggleFolder:f,onItemClick:l,onPinToggle:m};return c`
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
            .value=${s}
            @input=${A=>a?.(A.target.value)}
          />
          <button
            class="workspace-browse-btn"
            @click=${()=>e.onBrowseFolder?.(".")}
          >Browse Files</button>
        </div>
      </div>

      <div class="workspace-content">
        ${e.browsePath!=null?zu(e):y}

        ${Q?c`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${B.length+S.length}</span>
                  </div>
                  <div class="ws-list">
                    ${S.map(A=>c`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>p?.(A)}>
                            <span class=${yn(A.status)}></span>
                            <span class="ws-list-title">${A.title}</span>
                            <span class="ws-list-meta">${ke(A.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>r?.(t.id,A.key,!0)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${B.map(A=>Ct({workspaceId:t.id,entry:A,pinned:!0,onOpen:l,onPinToggle:m}))}
                  </div>
                </section>
              `:y}

        ${Gu({tasks:t.tasks??[],workspaceName:t.name,showCompleted:i,onToggleTaskComplete:g,onCreateTask:v,onToggleCompletedTasks:b,onStartTask:_,editingTaskId:P,onEditTask:x,onUpdateTask:C})}

        ${O?c`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Recent</h3>
                  <span>${de.length}</span>
                </div>
                <div class="ws-list">
                  ${de.map(A=>Vu({workspaceId:t.id,entry:A,pinned:j.has(A.path),onOpen:l,onPinToggle:m}))}
                </div>
              </section>
            `:y}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${$?I.length:T.length}</span>
            ${L&&T.length>0?c`<button class="ws-export-drive-btn" @click=${()=>{const A=T.map(Z=>Z.path);L(A)}}>Export to Drive</button>`:y}
          </div>
          <div class="ws-list ws-list--scroll">
            ${$?I.length===0?c`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:I.map(A=>ha(A,0,U)):T.length===0?c`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:T.map(A=>Ct({workspaceId:t.id,entry:A,pinned:!1,onOpen:l,onPinToggle:m}))}
          </div>
        </section>

        ${ce?c`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${k.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${k.length===0?c`
                            <div class="ws-empty">
                              <span class="ws-empty-hint">No sessions yet. Sessions are saved conversations with your ally — start a chat to create one.</span>
                            </div>
                          `:k.map(A=>c`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>p?.(A)}>
                                  <span class=${yn(A.status)}></span>
                                  <span class="ws-list-title">${A.title}</span>
                                  <span class="ws-list-meta">${ke(A.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${D.has(A.key)?"active":""}"
                                  @click=${()=>r?.(t.id,A.key,D.has(A.key))}
                                  title=${D.has(A.key)?"Unpin":"Pin"}
                                >
                                  ${D.has(A.key)?"Unpin":"Pin"}
                                </button>
                              </div>
                            `)}
                  </div>
                </section>
              `:y}

        ${(t.memory?.length??0)>0?c`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Memory</h3>
                  <span>${t.memory.length}</span>
                </div>
                <div class="ws-list ws-list--scroll">
                  ${t.memory.map(A=>Ct({workspaceId:t.id,entry:A,pinned:j.has(A.path),onOpen:l,onPinToggle:m}))}
                </div>
              </section>
            `:y}
      </div>
    </div>
  `}function Gu(e){const{tasks:t,workspaceName:s,showCompleted:n,onToggleTaskComplete:i,onCreateTask:a,onToggleCompletedTasks:o,onStartTask:l,editingTaskId:p,onEditTask:m,onUpdateTask:r}=e,f=Je(t.filter(v=>v.status==="pending")),g=Je(t.filter(v=>v.status==="complete"));return c`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${f.length} open${g.length>0?`, ${g.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${f.length===0&&g.length===0?c`<div class="ws-empty">No tasks</div>`:y}
        ${f.map(v=>vn(v,i,l,p,m,r))}
        ${g.length>0?c`
              <button class="ws-task-completed-toggle" @click=${()=>o?.()}>
                ${n?"Hide":"Show"} ${g.length} completed
              </button>
              ${n?g.map(v=>vn(v,i,l,p,m,r)):y}
            `:y}
      </div>
      ${a?c`
            <form
              class="ws-task-create-form"
              @submit=${v=>{v.preventDefault();const _=v.currentTarget.querySelector("input"),P=_.value.trim();P&&(a(P,s),_.value="")}}
            >
              <input
                type="text"
                class="ws-task-create-input"
                placeholder="Add a task..."
              />
              <button type="submit" class="ws-task-create-btn">Add</button>
            </form>
          `:y}
    </section>
  `}function Gh(e){const{connected:t,workspaces:s,selectedWorkspace:n,searchQuery:i,itemSearchQuery:a,expandedFolders:o,loading:l,createLoading:p,error:m,allTasks:r=[],taskFilter:f="outstanding",taskSort:g="due",taskSearch:v="",showCompletedTasks:b=!1,editingTaskId:_,workspaceNames:P=[],onSearch:x,onItemSearch:C,onSelectWorkspace:L,onBack:B,onItemClick:S,onSessionClick:T,onPinToggle:$,onPinSessionToggle:I,onCreateWorkspace:k,onDeleteWorkspace:D,onToggleFolder:j,onTeamSetup:E,onToggleTaskComplete:Q,onCreateTask:ce,onSetTaskFilter:de,onSetTaskSort:O,onSetTaskSearch:U,onToggleCompletedTasks:A,onStartTask:Z,onEditTask:Ee,onUpdateTask:Ts}=e,ut=s.filter(ee=>Ku(i,`${ee.name} ${ee.path} ${ee.type}`));return n?Hu({workspace:n,itemSearchQuery:a??"",expandedFolders:o,showCompletedTasks:b,onItemSearch:C,onBack:B,onItemClick:S,onSessionClick:T,onPinToggle:$,onPinSessionToggle:I,onToggleFolder:j,onToggleTaskComplete:Q,onCreateTask:ce,onToggleCompletedTasks:A,onStartTask:Z,editingTaskId:_,onEditTask:Ee,onUpdateTask:Ts,browsePath:e.browsePath,browseEntries:e.browseEntries,breadcrumbs:e.breadcrumbs,browseSearchQuery:e.browseSearchQuery,browseSearchResults:e.browseSearchResults,onBrowseFolder:e.onBrowseFolder,onBrowseSearch:e.onBrowseSearch,onBrowseBack:e.onBrowseBack,onCreateFolder:e.onCreateFolder,onBatchPushToDrive:e.onBatchPushToDrive}):c`
    <div class="workspaces-container">
      <div class="workspaces-toolbar">
        <form
            class="workspaces-create-form"
            @submit=${async ee=>{if(ee.preventDefault(),p||!k)return;const _s=ee.currentTarget,ht=new FormData(_s),As=ht.get("name"),$s=(typeof As=="string"?As:"").trim();if(!$s)return;const Cs=ht.get("type"),pt=(typeof Cs=="string"?Cs:"project").trim().toLowerCase(),ga=pt==="team"||pt==="personal"?pt:"project",xs=ht.get("path"),Ps=(typeof xs=="string"?xs:"").trim();await k({name:$s,type:ga,...Ps?{path:Ps}:{}})!==!1&&_s.reset()}}
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
              ?disabled=${!!p}
            >
              ${p?"Adding...":"Add Workspace"}
            </button>
          </form>
          <input
            type="text"
            class="workspaces-search-input"
            placeholder="Search workspaces..."
            .value=${i}
            @input=${ee=>x?.(ee.target.value)}
          />
          <span class="workspaces-count">${ut.length} workspaces</span>
          <span class="workspaces-status ${t?"online":"offline"}">
            ${t?"Online":"Offline"}
          </span>
          ${E?c`<button class="ws-team-setup-btn" @click=${()=>E()}>Team Setup</button>`:y}
      </div>

      ${m?c`<div class="callout danger" style="margin: 16px;">${m}</div>`:y}

      ${l?c`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `:c`
              <div class="workspaces-body">
                <div class="workspace-grid">
                  ${ut.length===0?c`
                          <div class="workspaces-empty">
                            <span class="workspaces-empty-icon">${t?"📭":"🔌"}</span>
                            <span>${t?"No workspaces yet":"Connect to gateway to see workspaces"}</span>
                            ${t?c`<span class="workspaces-empty-hint">Workspaces organize your projects. Ask your ally to create one, or start a focused session in chat.</span>`:y}
                          </div>
                        `:ut.map(ee=>qu(ee,L,D))}
                </div>

                ${Qu({tasks:r,taskFilter:f,taskSort:g,taskSearch:v,onToggleTaskComplete:Q,onSetTaskFilter:de,onSetTaskSort:O,onSetTaskSearch:U,onCreateTask:ce,workspaceNames:P,onStartTask:Z,editingTaskId:_,onEditTask:Ee,onUpdateTask:Ts})}
              </div>
            `}
    </div>
  `}function Qu(e){const{tasks:t,taskFilter:s,taskSort:n="due",taskSearch:i="",onToggleTaskComplete:a,onSetTaskFilter:o,onSetTaskSort:l,onSetTaskSearch:p,onCreateTask:m,workspaceNames:r=[],onStartTask:f,editingTaskId:g,onEditTask:v,onUpdateTask:b}=e;if(t.length===0&&!m)return c``;let _;if(s==="outstanding")_=t.filter(x=>x.status==="pending");else if(s==="today"){const x=K();_=t.filter(C=>C.status==="pending"&&C.dueDate!=null&&C.dueDate<=x)}else s==="complete"?_=t.filter(x=>x.status==="complete"):_=t;if(i){const x=i.toLowerCase();_=_.filter(C=>C.title.toLowerCase().includes(x)||C.project?.toLowerCase().includes(x))}const P=Je(_,n);return c`
    <div class="ws-all-tasks-section">
      <section class="ws-section">
        <div class="ws-section__header">
          <div class="ws-section__header-left">
            <h3>All Tasks</h3>
            ${p?c`<input
                  type="text"
                  class="ws-task-search"
                  placeholder="Search tasks..."
                  .value=${i}
                  @input=${x=>p(x.target.value)}
                />`:y}
          </div>
          <div class="ws-task-controls">
            <div class="ws-task-filters">
              <button
                class="ws-task-filter-btn ${s==="all"?"active":""}"
                @click=${()=>o?.("all")}
              >All</button>
              <button
                class="ws-task-filter-btn ${s==="outstanding"?"active":""}"
                @click=${()=>o?.("outstanding")}
              >To Do</button>
              <button
                class="ws-task-filter-btn ${s==="today"?"active":""}"
                @click=${()=>o?.("today")}
              >Today</button>
              <button
                class="ws-task-filter-btn ${s==="complete"?"active":""}"
                @click=${()=>o?.("complete")}
              >Done</button>
            </div>
            <select
              class="ws-task-sort"
              .value=${n}
              @change=${x=>l?.(x.target.value)}
            >
              <option value="due">Due Date</option>
              <option value="priority">Priority</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        ${m?c`
              <form
                class="ws-task-create-form"
                @submit=${x=>{x.preventDefault();const C=x.currentTarget,L=C.querySelector(".ws-task-create-input"),B=C.querySelector(".ws-task-create-project"),S=L.value.trim();if(!S)return;const T=B?.value||r[0]||"";m(S,T),L.value=""}}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                />
                ${r.length>0?c`
                      <select class="ws-task-create-project">
                        ${r.map(x=>c`<option value=${x}>${x}</option>`)}
                      </select>
                    `:y}
                <button type="submit" class="ws-task-create-btn">Add</button>
              </form>
            `:y}
        <div class="ws-list ws-list--scroll">
          ${P.length===0?c`<div class="ws-empty">No tasks</div>`:P.map(x=>qt(x,a,f,g,v,b))}
        </div>
      </section>
    </div>
  `}function Yu(e){return e===K()}function Ju(e){const t=new Date(e+"T12:00:00");return Xu(t)}function Xu(e){const t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],s=["January","February","March","April","May","June","July","August","September","October","November","December"],n=t[e.getDay()],i=s[e.getMonth()],a=e.getDate();return`${n}, ${i} ${a}`}function Zu(e){return c`
    <form class="ws-task-create-form" @submit=${t=>{t.preventDefault();const n=t.currentTarget.querySelector("input"),i=n.value.trim();i&&(e(i),n.value="")}}>
      <input type="text" class="ws-task-create-input" placeholder="Add a task for today..." />
      <button type="submit" class="ws-task-create-btn">Add</button>
    </form>
  `}function eh(e){const t=Je(e.todayTasks??[],"due"),s=t.filter(i=>i.status==="pending"),n=t.filter(i=>i.status==="complete");return c`
    <div class="my-day-card today-tasks-panel">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x2705;</span>
          <span>TODAY'S TASKS</span>
        </div>
        <span class="today-tasks-count">
          ${s.length} open${n.length>0?c`, ${n.length} done`:y}
        </span>
      </div>
      <div class="my-day-card-content">
        ${e.todayTasksLoading?c`<div class="brief-loading"><div class="spinner"></div><span>Loading tasks...</span></div>`:c`
              ${e.onCreateTask?Zu(e.onCreateTask):y}
              <div class="today-tasks-list">
                ${s.length===0&&n.length===0?c`<div class="today-tasks-empty">No tasks for today. Add one above or drop tasks in your daily brief.</div>`:s.map(i=>qt(i,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask,e.onViewTaskOutput))}
              </div>
              ${n.length>0?c`
                    <button class="today-completed-toggle" @click=${()=>e.onToggleCompletedTasks?.()}>
                      ${e.showCompletedTasks?"Hide":"Show"} ${n.length} completed
                    </button>
                    ${e.showCompletedTasks?c`<div class="today-tasks-list today-tasks-list--completed">
                          ${n.map(i=>qt(i,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask))}
                        </div>`:y}
                  `:y}
            `}
      </div>
    </div>
  `}function th(e){const t=K(),s=e.selectedDate??t,n=Yu(s),i=Ju(s),a=e.viewMode??"brief";return c`
    <div class="my-day-toolbar">
      <div class="today-date-nav">
        ${e.onDatePrev?c`<button class="today-date-btn" @click=${e.onDatePrev} title="Previous day">&#x2039;</button>`:y}
        <span class="today-date-label ${n?"":"past-date"}">${i}</span>
        ${e.onDateNext?c`<button class="today-date-btn" @click=${e.onDateNext} title="Next day">&#x203A;</button>`:y}
        ${!n&&e.onDateToday?c`<button class="today-date-today-btn" @click=${e.onDateToday}>Today</button>`:y}
      </div>
      <div class="today-view-tabs">
        <button class="today-view-tab ${a==="brief"?"active":""}"
          @click=${()=>e.onViewModeChange?.("brief")}>Brief</button>
        <button class="today-view-tab ${a==="tasks"?"active":""}"
          @click=${()=>e.onViewModeChange?.("tasks")}>Tasks</button>
        <button class="today-view-tab ${a==="inbox"?"active":""}"
          @click=${()=>e.onViewModeChange?.("inbox")}>Inbox${(e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length??0)>0?c`<span class="tab-badge">${e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length}</span>`:y}</button>
      </div>
      <div class="today-quick-actions">
        ${new Date().getHours()<15?!e.focusPulseActive&&e.onStartMorningSet?c`<button class="today-morning-set-btn" @click=${e.onStartMorningSet}
                  title="Start your morning focus ritual">\u2600\uFE0F Start my day</button>`:y:e.onEveningCapture?c`<button class="today-evening-btn" @click=${e.onEveningCapture}
                  title="Reflect on your day and set up tomorrow">\uD83C\uDF19 Evening Capture</button>`:y}
        ${e.onRefresh?c`<button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh / Generate Brief">&#x21BB;</button>`:null}
      </div>
    </div>
  `}function sh(e){return c`
    <div class="my-day-brief-full">
      ${Nu({items:e.inboxItems??[],loading:e.inboxLoading,count:e.inboxCount,sortOrder:e.inboxSortOrder??"newest",scoringId:e.inboxScoringId,scoringValue:e.inboxScoringValue,feedbackText:e.inboxFeedbackText,onViewOutput:t=>e.onInboxViewOutput?.(t),onViewProof:t=>e.onInboxViewProof?.(t),onOpenChat:t=>e.onInboxOpenChat?.(t),onDismiss:t=>e.onInboxDismiss?.(t),onScore:(t,s,n)=>e.onInboxScore?.(t,s,n),onSetScoring:(t,s)=>e.onInboxSetScoring?.(t,s),onFeedbackChange:t=>e.onInboxFeedbackChange?.(t),onSortToggle:()=>e.onInboxSortToggle?.(),onMarkAll:()=>e.onInboxMarkAll?.()})}
    </div>
  `}function nh(e){const t=e.trustSummary;if(!t||t.workflowCount===0)return y;const s=t.overallScore===null?"var(--text-secondary)":t.overallScore>=8?"var(--ok, #22c55e)":t.overallScore>=5?"var(--warn, #eab308)":"var(--danger, #ef4444)",n=t.overallScore!==null?t.overallScore.toFixed(1):"--";return c`
    <div class="my-day-card trust-summary-card">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x1F3AF;</span>
          <span>TRUST</span>
        </div>
        ${e.onNavigateToTrust?c`<button class="brief-refresh-btn" @click=${e.onNavigateToTrust}
              title="View full trust dashboard">Details &#x2192;</button>`:y}
      </div>
      <div class="my-day-card-content" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
        <div style="text-align:center;min-width:60px;">
          <div style="font-size:28px;font-weight:700;color:${s};line-height:1;">${n}</div>
          <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">/ 10</div>
        </div>
        <div style="flex:1;min-width:120px;font-size:13px;color:var(--text-secondary);line-height:1.6;">
          <div>${t.workflowCount} workflow${t.workflowCount!==1?"s":""} tracked</div>
          ${t.highPerformers>0?c`<div style="color:var(--ok, #22c55e);">${t.highPerformers} above 8.0</div>`:y}
          ${t.needsAttention>0?c`<div style="color:var(--warn, #eab308);">${t.needsAttention} need${t.needsAttention!==1?"":"s"} attention</div>`:y}
          ${t.dailyStreak>0?c`<div>${t.dailyStreak}-day streak</div>`:y}
        </div>
        ${!t.todayRated&&e.onTrustDailyRate?c`
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
              <div style="font-size:11px;color:var(--text-secondary);">Rate today</div>
              <div style="display:flex;gap:2px;">
                ${[1,2,3,4,5,6,7,8,9,10].map(i=>c`<button
                    class="rating-btn"
                    style="width:24px;height:24px;font-size:11px;border:1px solid var(--border);border-radius:4px;background:var(--surface-2);color:var(--text-secondary);cursor:pointer;"
                    @click=${()=>e.onTrustDailyRate(i)}
                    title="${i}/10"
                  >${i}</button>`)}
              </div>
            </div>`:t.todayRated?c`<div style="font-size:12px;color:var(--ok, #22c55e);">Rated today &#x2713;</div>`:y}
      </div>
    </div>
  `}function Qh(e){const t=K();e.selectedDate;const s=e.viewMode??"brief";if(e.loading)return c`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading your day...</span>
        </div>
      </div>
    `;if(e.error)return c`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">&#x26A0;</span>
          <span>${e.error}</span>
          ${e.onRefresh?c`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:null}
        </div>
      </div>
    `;const n={connected:e.connected,data:e.dailyBrief??null,loading:e.dailyBriefLoading,error:e.dailyBriefError,onRefresh:e.onBriefRefresh,onGenerate:e.onBriefGenerate,onOpenInObsidian:e.onBriefOpenInObsidian,onSaveBrief:e.onBriefSave,onToggleCheckbox:e.onBriefToggleCheckbox,onOpenFile:e.onOpenFile};return c`
    <div class="my-day-container">
      ${nh(e)}
      ${s==="brief"?c`<div class="my-day-brief-full">
            ${uo(n)}
          </div>`:s==="tasks"?c`<div class="my-day-brief-full">${eh(e)}</div>`:sh(e)}
    </div>
  `}function pa(){return{open:!1,images:[],currentIndex:0}}function ih(e,t,s){return{open:!0,images:t,currentIndex:s}}function ah(){return pa()}function oh(e,t){const s=e.currentIndex+t;return s<0||s>=e.images.length?e:{...e,currentIndex:s}}const rh=c`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,lh=c`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,ch=c`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;function dh(e,t){if(!e.open||e.images.length===0)return y;const s=e.images[e.currentIndex];if(!s)return y;const n=e.images.length>1,i=e.currentIndex>0,a=e.currentIndex<e.images.length-1;return c`
    <div
      class="lightbox-overlay"
      @click=${o=>{o.target.classList.contains("lightbox-overlay")&&t.onClose()}}
      @keydown=${o=>{o.key==="Escape"&&t.onClose(),o.key==="ArrowRight"&&a&&t.onNav(1),o.key==="ArrowLeft"&&i&&t.onNav(-1)}}
      tabindex="0"
    >
      <button class="lightbox-close" @click=${t.onClose} aria-label="Close image viewer">
        ${rh}
      </button>

      ${n&&i?c`<button class="lightbox-nav lightbox-nav--prev" @click=${()=>t.onNav(-1)} aria-label="Previous image">${lh}</button>`:y}

      <img
        class="lightbox-image"
        src=${s.url}
        alt=${s.alt??"Image preview"}
        @click=${o=>o.stopPropagation()}
        @error=${o=>{o.target.classList.add("lightbox-image--broken")}}
      />

      ${n&&a?c`<button class="lightbox-nav lightbox-nav--next" @click=${()=>t.onNav(1)} aria-label="Next image">${ch}</button>`:y}

      ${n?c`<div class="lightbox-counter">${e.currentIndex+1} / ${e.images.length}</div>`:y}
    </div>
  `}const uh=e=>{switch(e){case"success":return c`
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
      `;case"error":return c`
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
      `;case"warning":return c`
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
      `;default:return c`
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
      `}};function hh({toasts:e,onDismiss:t}){return e.length===0?null:c`
    <div class="toast-container">
      ${tt(e,s=>s.id,s=>c`
          <div class="toast toast--${s.type}">
            <div class="toast__icon">${uh(s.type)}</div>
            <div class="toast__body">
              <div class="toast__message">${s.message}</div>
              ${s.action?c`${s.action.url?c`<a
                        class="toast__action"
                        href=${s.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >${s.action.label} &rarr;</a>`:c`<button
                        class="toast__action"
                        @click=${()=>{s.action.onClick?.(),t(s.id)}}
                      >${s.action.label}</button>`}`:nothing}
            </div>
            <button
              class="toast__close"
              @click=${()=>t(s.id)}
              aria-label="Dismiss notification"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 1l12 12M13 1L1 13"/>
              </svg>
            </button>
          </div>
        `)}
    </div>
  `}const Sn=[{key:"focusPulse.enabled",icon:"☀️",name:"Focus Pulse",description:"Morning priority ritual + persistent focus widget in the topbar. Silent 30-min pulse checks compare your activity against your plan.",default:!0}];function ph(e,t){return c`
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
  `}function fh(e,t,s){const i=!!(t?.[e.key]??e.default);return c`
    <div class="options-card card">
      <div class="options-card-header">
        <div class="options-card-info">
          <span class="options-card-icon">${e.icon}</span>
          <span class="options-card-name">${e.name}</span>
        </div>
        ${ph(i,()=>s(e.key,!i))}
      </div>
      <div class="options-card-description">${e.description}</div>
    </div>
  `}function mh(e){const{connected:t,loading:s,options:n,onToggle:i,onOpenWizard:a}=e;return t?s&&!n?c`
      <section class="tab-body options-section">
        <div class="options-loading">Loading options...</div>
      </section>
    `:c`
    <section class="tab-body options-section">
      <div class="options-grid">
        ${Sn.map(o=>fh(o,n,i))}
      </div>
      ${Sn.length===0?c`<div class="options-empty">
            No configurable features yet.
          </div>`:y}
      ${a?c`
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
          `:y}
    </section>
  `:c`
      <section class="tab-body options-section">
        <div class="options-empty">Not connected to gateway.</div>
      </section>
    `}const gh={"gm-work":()=>w(()=>import("./work-tab-BpotlMC6.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url),"gm-today":()=>w(()=>import("./today-tab-DbGLSlCX.js"),__vite__mapDeps([6,1,3,4,5]),import.meta.url),"gm-second-brain":()=>w(()=>import("./second-brain-tab-C_tAhJTI.js"),__vite__mapDeps([7,1,2,4,3,5,8]),import.meta.url),"gm-dashboards":()=>w(()=>import("./dashboards-tab-C37cqKcW.js"),__vite__mapDeps([9,1,2,4,3,5,10]),import.meta.url)},kn=new Set;function Ke(e){kn.has(e)||(kn.add(e),gh[e]?.())}const yh=/^data:/i,vh=/^https?:\/\//i;function wh(e){const t=e.agentsList?.agents??[],n=Bn(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",a=t.find(l=>l.id===n)?.identity,o=a?.avatarUrl??a?.avatar;if(o)return yh.test(o)||vh.test(o)?o:a?.avatarUrl}function Tn(e){const t=e.trim();if(!t)return t;const s=t.split(/\s+/);if(s.length>=2&&s.length%2===0){const l=s.length/2,p=s.slice(0,l).join(" "),m=s.slice(l).join(" ");if(p.toLowerCase()===m.toLowerCase())return p}const n=t.replace(/\s+/g," ").toLowerCase(),i=Math.floor(n.length/2),a=n.slice(0,i).trim(),o=n.slice(i).trim();return a&&a===o?t.slice(0,Math.ceil(t.length/2)).trim():t}function Vt(e,t){const s=t?.sessionId?.trim();return s?`session:${s}`:`key:${e.trim().toLowerCase()}`}function _n(e){if(e===M)return!0;const t=e.toLowerCase();return!!(t==="agent:main:main"||t.endsWith(":main"))}function bh(e){const t=e.sessionsResult?.sessions,s=[...new Set(e.settings.openTabs.map(l=>l.trim()).filter(Boolean))].filter(l=>!_n(l)),n=me(t,e.sessionKey),i=Vt(e.sessionKey,n),a=new Map;for(const l of s){const p=me(t,l),m=Vt(l,p);if(!a.has(m)){a.set(m,l);continue}l===e.sessionKey&&a.set(m,l)}const o=[...a.values()];if(o.length===0){const l=e.sessionKey.trim()||"main";_n(l)||o.push(l)}return{tabKeys:o,activeIdentity:i}}function Sh(e){if(e.wizardActive&&e.wizardState)return ho(e.wizardState,{onStepChange:r=>{e.handleWizardStepChange?.(r)},onAnswerChange:(r,f)=>{e.handleWizardAnswerChange?.(r,f)},onPreview:()=>{e.handleWizardPreview?.()},onGenerate:()=>{e.handleWizardGenerate?.()},onClose:()=>{e.handleWizardClose?.()},onFileToggle:(r,f)=>{e.handleWizardFileToggle?.(r,f)},onConfigToggle:(r,f)=>{e.handleWizardConfigToggle?.(r,f)}});e.presenceEntries.length;const t=e.sessionsResult?.count??null;e.cronStatus?.nextWakeAtMs;const s=e.connected?null:"Disconnected from gateway.",n=e.tab==="chat",i=n&&(e.settings.chatFocusMode||e.onboarding),a=e.onboarding?!1:e.settings.chatShowThinking,o=wh(e),l=e.chatAvatarUrl??o??null,{tabKeys:p,activeIdentity:m}=bh(e);return c`
    <div class="shell ${n?"shell--chat":""} ${i?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
            aria-label="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">${R.menu}</span>
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
          ${y}
        </div>
        <div class="topbar-status">
          ${e.updateStatus?.openclawUpdateAvailable||e.updateStatus?.pluginUpdateAvailable?c`<a
                  class="pill pill--update"
                  href="#"
                  title="${e.updateStatus?.openclawUpdateAvailable?"OpenClaw update available":"GodMode plugin update available"} — click to view"
                  @click=${r=>{r.preventDefault(),e.setTab("config")}}
                >
                  <span class="pill__icon">${R.zap}</span>
                  <span>Update Ready</span>
                </a>`:y}
          ${e.updateStatus?.pendingDeploy?c`<button
                  class="pill pill--deploy"
                  @click=${r=>{r.preventDefault(),e.handleDeployPanelToggle()}}
                  title="${e.updateStatus.pendingDeploy.summary??"pending fix"}"
                >
                  <span class="pill__icon">${R.rotateCcw}</span>
                  <span>Deploy Ready</span>
                </button>`:y}
          <button
            class="pill pill--support"
            @click=${r=>{r.preventDefault(),e.handleOpenSupportChat()}}
            title="Open support chat"
          >
            <span class="pill__icon">${R.headphones}</span>
            <span>Support</span>
          </button>
          <div class="pill ${e.reconnecting?"reconnecting":""}">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>Gateway</span>
            <span class="mono">${e.reconnecting?`Reconnecting${e.reconnectAttempt>1?` (${e.reconnectAttempt})`:""}...`:e.connected?"Connected":"Offline"}</span>
          </div>
          ${Yi(e)}
        </div>
      </header>
      ${e.deployPanelOpen&&e.updateStatus?.pendingDeploy?(()=>{const r=e.updateStatus.pendingDeploy,f=Date.now()-r.ts,g=Math.floor(f/6e4),v=g<1?"just now":g<60?`${g}m ago`:`${Math.floor(g/60)}h ago`;return c`
              <div class="deploy-review-panel">
                <div class="deploy-review-panel__body">
                  <div class="deploy-review-panel__info">
                    <strong>Staged Deploy</strong>
                    <span class="deploy-review-panel__summary">${r.summary??"Pending fix"}</span>
                    <span class="deploy-review-panel__meta">Staged ${v}</span>
                    ${r.files?.length?c`<details class="deploy-review-panel__files">
                          <summary>${r.files.length} file${r.files.length>1?"s":""} changed</summary>
                          <ul>${r.files.map(b=>c`<li>${b}</li>`)}</ul>
                        </details>`:y}
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
              </div>`})():y}
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">

        ${po.map(r=>{const f=e.settings.navGroupsCollapsed[r.label]??!1,g=r.tabs.some(b=>b===e.tab),v=!r.label||r.tabs.length===1&&Ie(r.tabs[0])===r.label;return c`
            <div class="nav-group ${f&&!g?"nav-group--collapsed":""} ${v?"nav-group--no-header":""}">
              ${v?y:c`
                <button
                  class="nav-label"
                  @click=${()=>{const b={...e.settings.navGroupsCollapsed};b[r.label]=!f,e.applySettings({...e.settings,navGroupsCollapsed:b})}}
                  aria-expanded=${!f}
                >
                  <span class="nav-label__text">${r.label}</span>
                  <span class="nav-label__chevron">${f?"+":"−"}</span>
                </button>
              `}
              <div class="nav-group__items">
                ${!r.label&&e.godmodeOptions!=null&&!e.godmodeOptions?.["onboarding.hidden"]?c`
                        <a
                          class="nav-item ${e.tab==="onboarding"?"active":""}"
                          href="#"
                          @click=${b=>{b.preventDefault(),e.handleWizardOpen?.()}}
                          title="Power up your GodMode ally."
                        >
                          <span class="nav-item__emoji" aria-hidden="true">\u{1F9ED}</span>
                          <span class="nav-item__text">Setup</span>
                        </a>
                      `:y}
                ${r.tabs.map(b=>Ut(e,b))}
              </div>
            </div>
          `})}
        ${fo.map(r=>{const f=e.settings.navGroupsCollapsed[r.label]??!0,g=r.tabs.some(v=>v===e.tab);return c`
            <div class="nav-group ${f&&!g?"nav-group--collapsed":""}">
              <button
                class="nav-label"
                @click=${()=>{const v={...e.settings.navGroupsCollapsed};v[r.label]=!f,e.applySettings({...e.settings,navGroupsCollapsed:v})}}
                aria-expanded=${!f}
              >
                <span class="nav-label__text">${r.label}</span>
                <span class="nav-label__chevron">${f?"+":"−"}</span>
              </button>
              <div class="nav-group__items">
                ${r.tabs.map(v=>Ut(e,v))}
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
              <span class="nav-item__icon" aria-hidden="true">${R.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${n?"content--chat":""}">
        <section class="content-header">
          <div>
            ${e.tab!=="chat"&&e.tab!=="onboarding"?c`
              <div class="page-title">${Ie(e.tab)}</div>
              <div class="page-sub">${mo(e.tab)}</div>
            `:e.tab==="chat"?c`
              <div class="session-tabs">
                <div class="session-tab session-tab--pinned ${e.sessionKey===M?"session-tab--active":""}"
                     @click=${()=>{e.sessionKey!==M&&(se(e),e.sessionKey=M,e.allyUnread=0,re(e,M),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:M,lastActiveSessionKey:M,tabLastViewed:{...e.settings.tabLastViewed,[M]:Date.now()}}),e.loadAssistantIdentity(),q(e).then(()=>{e.resetChatScroll(),z(e,!0)}),e.loadSessionResources(),W(e))}}
                     title="${e.assistantName||"Ally"}">
                  ${e.assistantAvatar?c`<img src="${e.assistantAvatar}" class="session-tab-avatar" width="16" height="16" style="border-radius:50%;vertical-align:middle;margin-right:4px;" />`:c`<span class="session-tab-icon" style="margin-right:4px;">&#x2726;</span>`}
                  ${e.assistantName||"Ally"}
                  ${(e.allyUnread??0)>0?c`<span class="ally-tab-badge" style="margin-left:4px;font-size:10px;background:var(--accent-color,#5b73e8);color:#fff;border-radius:50%;padding:1px 5px;">${e.allyUnread}</span>`:y}
                </div>
                ${tt(p,r=>r,(r,f)=>{const g=me(e.sessionsResult?.sessions,r),v=Vt(r,g)===m,_=(()=>{if(g?.label||g?.displayName)return Tn(g.label??g.displayName);const S=fe.get(r);if(S)return Tn(S);if(r==="agent:main:support")return"Support";if(r.includes("webchat")){const $=r.match(/webchat[:-](\d+)/);return $?`Chat ${$[1]}`:"Chat"}if(r.includes("main"))return"MAIN";const T=r.split(/[:-]/);return T[T.length-1]||r})(),P=e.workingSessions.has(r),x=e.settings.tabLastViewed[r]??0,C=g?.updatedAt??0,L=!v&&!P&&C>x,B=e.editingTabKey===r;return c`
                      <div
                        class="session-tab ${v?"session-tab--active":""} ${P?"session-tab--working":""} ${L?"session-tab--ready":""} ${B?"session-tab--editing":""}"
                        draggable="true"
                        @dragstart=${S=>{if(e.editingTabKey===r){S.preventDefault();return}S.dataTransfer.effectAllowed="move",S.dataTransfer.setData("text/session-key",r),S.dataTransfer.setData("text/plain",f.toString()),S.target.classList.add("dragging")}}
                        @click=${()=>{if(!B){if(v){e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}});return}se(e),e.sessionKey=r,re(e,r),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:r,lastActiveSessionKey:r,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}}),e.loadAssistantIdentity(),J(e,r,!0),q(e).then(()=>{e.resetChatScroll(),z(e,!0)}),e.loadSessionResources(),W(e),vs()}}}
                        @dragend=${S=>{S.target.classList.remove("dragging")}}
                        @dragover=${S=>{S.preventDefault(),S.dataTransfer.dropEffect="move";const T=S.currentTarget,$=T.getBoundingClientRect(),I=$.left+$.width/2;S.clientX<I?(T.classList.add("drop-left"),T.classList.remove("drop-right")):(T.classList.add("drop-right"),T.classList.remove("drop-left"))}}
                        @dragleave=${S=>{S.currentTarget.classList.remove("drop-left","drop-right")}}
                        @drop=${S=>{S.preventDefault();const T=parseInt(S.dataTransfer.getData("text/plain")),$=f;if(T===$)return;const I=e.settings.openTabs.slice(),[k]=I.splice(T,1);I.splice($,0,k),e.applySettings({...e.settings,openTabs:I}),S.currentTarget.classList.remove("drop-left","drop-right")}}
                        title=${_}
                      >
                        ${B?c`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${g?.label??g?.displayName??""}
                            @click=${S=>S.stopPropagation()}
                            @dblclick=${S=>S.stopPropagation()}
                            @blur=${async S=>{const T=S.target;if(T._committedByEnter)return;const $=T.value.trim();e.editingTabKey=null;const I=g?.label??g?.displayName??"";if($!==I){$?fe.set(r,$):fe.delete(r),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(E=>E.key===r?{...E,label:$||void 0,displayName:$||void 0}:E)});const k=await mt(e,r,{label:$||null,displayName:$||null});W(e);const D=k.ok&&k.canonicalKey!==r?k.canonicalKey:r,j=r===e.sessionKey;e.applySettings({...e.settings,...k.ok&&k.canonicalKey!==r&&e.settings.openTabs.includes(r)?{openTabs:e.settings.openTabs.map(E=>E===r?k.canonicalKey:E)}:{},tabLastViewed:{...e.settings.tabLastViewed,[D]:Date.now()},...j&&k.ok&&k.canonicalKey!==r?{sessionKey:k.canonicalKey,lastActiveSessionKey:k.canonicalKey}:{}}),j&&k.ok&&k.canonicalKey!==r&&(e.sessionKey=k.canonicalKey,J(e,k.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}})}}
                            @keydown=${async S=>{if(S.key==="Enter"){S.preventDefault();const T=S.target;T._committedByEnter=!0;const $=T.value.trim();e.editingTabKey=null;const I=g?.label??g?.displayName??"";if($!==I){$?fe.set(r,$):fe.delete(r),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(E=>E.key===r?{...E,label:$||void 0,displayName:$||void 0}:E)});const k=await mt(e,r,{label:$||null,displayName:$||null});W(e);const D=k.ok&&k.canonicalKey!==r?k.canonicalKey:r,j=r===e.sessionKey;e.applySettings({...e.settings,...k.ok&&k.canonicalKey!==r&&e.settings.openTabs.includes(r)?{openTabs:e.settings.openTabs.map(E=>E===r?k.canonicalKey:E)}:{},tabLastViewed:{...e.settings.tabLastViewed,[D]:Date.now()},...j&&k.ok&&k.canonicalKey!==r?{sessionKey:k.canonicalKey,lastActiveSessionKey:k.canonicalKey}:{}}),j&&k.ok&&k.canonicalKey!==r&&(e.sessionKey=k.canonicalKey,J(e,k.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}})}else S.key==="Escape"&&(S.preventDefault(),e.editingTabKey=null)}}
                          />
                        `:(()=>{let S=null;return c`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${T=>{T.stopPropagation(),S&&clearTimeout(S),S=setTimeout(()=>{S=null,e.editingTabKey!==r&&(r===e.sessionKey?e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}}):(se(e),e.sessionKey=r,e.chatPrivateMode=!!e.privateSessions?.has(r),re(e,r),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:r,lastActiveSessionKey:r,tabLastViewed:{...e.settings.tabLastViewed,[r]:Date.now()}}),e.loadAssistantIdentity(),J(e,r,!0),q(e).then(()=>{e.resetChatScroll(),z(e,!0)}),e.loadSessionResources(),W(e)))},250)}}
                            @dblclick=${T=>{T.preventDefault(),T.stopPropagation(),S&&(clearTimeout(S),S=null),e.editingTabKey=r;const $=T.target.closest(".session-tab"),I=k=>{const D=k.target;$&&!$.contains(D)&&(e.editingTabKey=null,document.removeEventListener("mousedown",I,!0))};document.addEventListener("mousedown",I,!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const k=$?.querySelector(".session-tab__name-input");k&&(k.focus(),k.select())})})}}
                          >${_}</span>
                        `})()}
                        ${e.privateSessions?.has(r)?(()=>{const S=e.privateSessions.get(r),T=Math.max(0,S-Date.now()),$=Math.floor(T/36e5),I=Math.floor(T%36e5/6e4),k=$>0?`${$}h ${I}m`:`${I}m`;return c`
                                  <span class="session-tab__private" title="Private session — expires in ${k}" style="font-size: 9px; margin-left: 3px; color: #f59e0b; white-space: nowrap;"
                                    >🔒 ${k}</span
                                  >
                                `})():y}
                        ${P?c`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `:y}
                        ${L?c`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `:y}
                        ${c`
                          <button
                            class="session-tab__close"
                            @click=${S=>{if(S.stopPropagation(),e.privateSessions?.has(r)){e._destroyPrivateSession(r);return}const T=e.settings.openTabs.filter(k=>k!==r),$=r===e.sessionKey,I=T[0]||M;e.applySettings({...e.settings,openTabs:T,...$?{sessionKey:I,lastActiveSessionKey:I}:{}}),$&&(e.sessionKey=I,e.sessionResources=[],J(e,I,!0),q(e).then(()=>{e.resetChatScroll(),z(e,!0)}),e.loadSessionResources())}}
                            title=${e.privateSessions?.has(r)?"Destroy private session":"Close tab"}
                          >×</button>
                        `}
                      </div>
                    `})}
              `:y}
          </div>
          <div class="page-meta">
            ${e.reconnecting?c`<div class="pill warning reconnecting">
                  <span class="reconnect-spinner"></span>
                  Reconnecting${e.reconnectAttempt>1?` (attempt ${e.reconnectAttempt})`:""}...
                </div>`:e.lastError?c`<div class="pill ${e.lastError.startsWith("✓")?"success":"danger"}">${e.lastError}</div>`:y}
            ${n?Qi(e):y}
            ${(e.tab==="today"||e.tab==="my-day")&&!e.dynamicSlots.today?th({connected:e.connected,onRefresh:()=>e.handleMyDayRefresh(),selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"brief",onViewModeChange:r=>e.handleTodayViewModeChange(r),focusPulseActive:!1,onStartMorningSet:()=>e.handleFocusPulseStartMorning(),inboxItems:e.inboxItems??[],inboxCount:e.inboxCount??0,onEveningCapture:()=>{e.setTab("chat"),e.handleSendChat(`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`)}}):y}
          </div>
        </section>

        ${i?c`<button
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
            </button>`:y}

        ${e.tab==="setup"||e.tab==="onboarding"?c`<div class="my-day-container">
                <div class="my-day-card">
                  <div class="my-day-card-content">
                    <p>Use the onboarding wizard to get started.</p>
                    <button class="retry-button" @click=${()=>e.handleWizardOpen?.()}>Open Wizard</button>
                  </div>
                </div>
              </div>`:y}

        ${e.tab==="workspaces"?(Ke("gm-work"),c`<gm-work></gm-work>`):y}

        ${e.tab==="today"||e.tab==="my-day"?(Ke("gm-today"),c`<gm-today></gm-today>`):y}

        ${e.tab==="channels"?go({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:r=>X(e,r),onWhatsAppStart:r=>e.handleWhatsAppStart(r),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(r,f)=>Me(e,r,f),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(r,f)=>e.handleNostrProfileEdit(r,f),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(r,f)=>e.handleNostrProfileFieldChange(r,f),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):y}

        ${e.tab==="instances"?yo({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>zt(e)}):y}

        ${e.tab==="sessions"?vo({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,archivedSessions:e.archivedSessions,archivedSessionsLoading:e.archivedSessionsLoading,archivedSessionsExpanded:e.archivedSessionsExpanded,onFiltersChange:r=>{e.sessionsFilterActive=r.activeMinutes,e.sessionsFilterLimit=r.limit,e.sessionsIncludeGlobal=r.includeGlobal,e.sessionsIncludeUnknown=r.includeUnknown},onRefresh:()=>{W(e),It(e)},onPatch:async(r,f)=>{const g=await mt(e,r,f);if(g.ok&&g.canonicalKey!==r&&e.settings.openTabs.includes(r)){const v=e.settings.openTabs.map(_=>_===r?g.canonicalKey:_),b=r===e.sessionKey;e.applySettings({...e.settings,openTabs:v,tabLastViewed:{...e.settings.tabLastViewed,[g.canonicalKey]:e.settings.tabLastViewed[r]??Date.now()},...b?{sessionKey:g.canonicalKey,lastActiveSessionKey:g.canonicalKey}:{}}),b&&(e.sessionKey=g.canonicalKey,J(e,g.canonicalKey,!0))}},onDelete:r=>Ea(e,r),onArchive:r=>La(e,r),onUnarchive:r=>Ra(e,r),onToggleArchived:()=>{e.archivedSessionsExpanded=!e.archivedSessionsExpanded,e.archivedSessionsExpanded&&e.archivedSessions.length===0&&It(e)},onAutoArchive:()=>Da(e)}):y}

        ${e.tab==="cron"?wo({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(r=>r.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:r=>e.cronForm={...e.cronForm,...r},onRefresh:()=>e.loadCron(),onAdd:()=>Ka(e),onToggle:(r,f)=>Na(e,r,f),onRun:r=>Fa(e,r),onRemove:r=>Oa(e,r),onLoadRuns:r=>Ma(e,r)}):y}

        ${e.tab==="skills"?bo({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,subTab:e.skillsSubTab,godmodeSkills:e.godmodeSkills??null,godmodeSkillsLoading:e.godmodeSkillsLoading??!1,expandedSkills:e.expandedSkills??new Set,onFilterChange:r=>e.skillsFilter=r,onRefresh:()=>{In(e,{clearMessages:!0}),Dt(e)},onToggle:(r,f)=>qa(e,r,f),onEdit:(r,f)=>Wa(e,r,f),onSaveKey:r=>Ua(e,r),onInstall:(r,f,g)=>Ba(e,r,f,g),onSubTabChange:r=>{e.skillsSubTab=r,r==="godmode"&&!e.godmodeSkills&&Dt(e),r==="clawhub"&&e.clawhubExploreItems},onToggleExpand:r=>{const f=new Set(e.expandedSkills);f.has(r)?f.delete(r):f.add(r),e.expandedSkills=f},clawhub:{loading:e.clawhubLoading,error:e.clawhubError,query:e.clawhubQuery,results:e.clawhubResults,exploreItems:e.clawhubExploreItems,exploreSort:e.clawhubExploreSort,detailSlug:e.clawhubDetailSlug,detail:e.clawhubDetail,importing:e.clawhubImporting,message:e.clawhubMessage,onSearch:r=>{e.clawhubQuery=r},onExplore:r=>void 0,onDetail:r=>void 0,onCloseDetail:()=>void 0,onImport:r=>on(),onImportAndPersonalize:async r=>{if(!await on())return;const g=await Ed();g&&(us(e,"chat"),dt(e),e.chatMessage=g)}}}):y}

        ${e.tab==="agents"?So({loading:e.rosterLoading,error:e.rosterError,roster:e.rosterData??[],filter:e.rosterFilter??"",expandedAgents:e.expandedAgents??new Set,onFilterChange:r=>e.rosterFilter=r,onRefresh:()=>Va(e),onToggleExpand:r=>{const f=new Set(e.expandedAgents);f.has(r)?f.delete(r):f.add(r),e.expandedAgents=f}}):y}

        ${e.tab==="nodes"?ko({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>Xe(e),onDevicesRefresh:()=>Ze(e),onDeviceApprove:r=>to(e,r),onDeviceReject:r=>eo(e,r),onDeviceRotate:(r,f,g)=>Za(e,{deviceId:r,role:f,scopes:g}),onDeviceRevoke:(r,f)=>Xa(e,{deviceId:r,role:f}),onLoadConfig:()=>ge(e),onLoadExecApprovals:()=>{const r=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Dn(e,r)},onBindDefault:r=>{r?Me(e,["tools","exec","node"],r):Is(e,["tools","exec","node"])},onBindAgent:(r,f)=>{const g=["agents","list",r,"tools","exec","node"];f?Me(e,g,f):Is(e,g)},onSaveBindings:()=>Pt(e),onExecApprovalsTargetChange:(r,f)=>{e.execApprovalsTarget=r,e.execApprovalsTargetNodeId=f,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:r=>{e.execApprovalsSelectedAgent=r},onExecApprovalsPatch:(r,f)=>Ha(e,r,f),onExecApprovalsRemove:r=>za(e,r),onSaveExecApprovals:()=>{const r=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return ja(e,r)}}):y}

        ${e.tab==="chat"&&e.workspaceNeedsSetup&&!e.chatMessages?.length?c`
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
                `:y}

        ${e.tab==="chat"?Cu({basePath:e.basePath,sessionKey:e.sessionKey,onSessionKeyChange:r=>{se(e),e.sessionKey=r,re(e,r),e.chatLoading=!0,e.chatMessages=[],e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:r,lastActiveSessionKey:r}),e.loadAssistantIdentity(),q(e).then(()=>{e.resetChatScroll(),z(e,!0)}),Ye(e),e.loadSessionResources(),He(e)},thinkingLevel:e.chatThinkingLevel,showThinking:a,loading:e.chatLoading,sending:e.chatSending,sendingSessionKey:e.chatSendingSessionKey,compactionStatus:e.compactionStatus,assistantAvatarUrl:l,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:s,error:e.lastError,sessions:e.sessionsResult,focusMode:i,onRefresh:()=>(e.resetToolStream(),e.loadSessionResources(),He(e),Promise.all([q(e),Ye(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:r=>e.handleChatScroll(r),onDraftChange:r=>e.chatMessage=r,attachments:e.chatAttachments,onAttachmentsChange:r=>e.chatAttachments=r,showToast:(r,f)=>e.showToast(r,f),onSend:r=>e.handleSendChat(void 0,{queue:r}),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onCompact:()=>{e.handleCompactChat()},pendingRetry:e.pendingRetry,onRetry:()=>{e.handleRetryMessage()},onClearRetry:()=>e.handleClearRetry(),onQueueRemove:r=>e.removeQueuedMessage(r),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,sidebarMimeType:e.sidebarMimeType,sidebarFilePath:e.sidebarFilePath,sidebarTitle:e.sidebarTitle,sidebarMode:e.sidebarMode,sidebarProofSlug:e.sidebarProofSlug,sidebarProofUrl:e.sidebarProofUrl,sidebarProofHtml:e.sidebarProofHtml,splitRatio:e.splitRatio,onOpenSidebar:(r,f)=>e.handleOpenSidebar(r,f),onMessageLinkClick:r=>e.handleOpenMessageFileLink(r),onCloseSidebar:()=>e.handleCloseSidebar(),onOpenProof:r=>{e.handleOpenProofDoc(r)},onOpenFile:r=>e.handleOpenFile(r),onSplitRatioChange:r=>e.handleSplitRatioChange(r),onPushToDrive:(r,f)=>e.handlePushToDrive(r,f),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker(),onImageClick:(r,f,g)=>e.handleImageClick(r,f,g),resolveImageUrl:(r,f)=>Zl(e.sessionKey,r,f),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,userName:e.userName,userAvatar:e.userAvatar,currentToolName:e.currentToolName,currentToolInfo:e.currentToolInfo,privateMode:e.chatPrivateMode,onTogglePrivateMode:()=>e.handlePrivateModeToggle(),isWorking:e.workingSessions.has(e.sessionKey),showScrollButton:!e.chatUserNearBottom,showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>{const r=document.querySelector(".chat-thread");r&&(r.scrollTo({top:r.scrollHeight,behavior:"smooth"}),e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1)},allyPanelOpen:e.allyPanelOpen??!1,allyProps:e.allyPanelOpen?{allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:!0,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:0,connected:e.connected,compact:!0,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:r=>e.handleAllyDraftChange(r),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:r=>e.handleAllyAttachmentsChange(r),onAction:(r,f,g,v)=>e.handleAllyAction(r,f,g,v)}:null,sessionResources:e.sessionResources,sessionResourcesCollapsed:e.sessionResourcesCollapsed,onToggleSessionResources:()=>e.handleToggleSessionResources(),onSessionResourceClick:r=>e.handleSessionResourceClick(r),onViewAllResources:()=>e.handleViewAllResources()}):y}

        ${e.tab==="options"?mh({connected:e.connected,loading:e.godmodeOptionsLoading,options:e.godmodeOptions,onToggle:(r,f)=>e.handleOptionToggle(r,f),onOpenWizard:e.handleWizardOpen?()=>e.handleWizardOpen?.():void 0}):y}

        ${e.tab==="guardrails"?To({connected:e.connected,loading:e.guardrailsLoading,data:e.guardrailsData,showAddForm:e.guardrailsShowAddForm,onToggle:(r,f)=>e.handleGuardrailToggle(r,f),onThresholdChange:(r,f,g)=>e.handleGuardrailThresholdChange(r,f,g),onCustomToggle:(r,f)=>e.handleCustomGuardrailToggle(r,f),onCustomDelete:r=>e.handleCustomGuardrailDelete(r),onToggleAddForm:()=>e.handleToggleGuardrailAddForm(),onOpenAllyChat:r=>{e.handleAllyToggle(),r&&e.handleAllyDraftChange(r)}}):y}

        ${e.tab==="trust"?_o({connected:e.connected,loading:e.trustTrackerLoading,data:e.trustTrackerData,onAddWorkflow:r=>e.handleTrustAddWorkflow(r),onRemoveWorkflow:r=>e.handleTrustRemoveWorkflow(r),onRefresh:()=>e.handleTrustLoad(),guardrailsData:e.guardrailsData,consciousnessStatus:e.consciousnessStatus,sessionsCount:t,gatewayUptimeMs:e.hello?.snapshot?.uptimeMs??null,onDailyRate:(r,f)=>e.handleDailyRate(r,f),updateStatus:e.updateStatus?{openclawUpdateAvailable:e.updateStatus.openclawUpdateAvailable,pluginUpdateAvailable:e.updateStatus.pluginUpdateAvailable,openclawVersion:e.updateStatus.openclawVersion,pluginVersion:e.updateStatus.pluginVersion,openclawLatest:e.updateStatus.openclawLatest,pluginLatest:e.updateStatus.pluginLatest}:null}):y}

        ${e.tab==="second-brain"?(Ke("gm-second-brain"),c`<gm-second-brain></gm-second-brain>`):y}

        ${e.tab==="dashboards"?(Ke("gm-dashboards"),c`<gm-dashboards></gm-dashboards>`):y}

        ${e.tab==="config"?Ao({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:r=>{e.configRaw=r},onFormModeChange:r=>e.configFormMode=r,onFormPatch:(r,f)=>Me(e,r,f),onSearchChange:r=>e.configSearchQuery=r,onSectionChange:r=>{e.configActiveSection=r,e.configActiveSubsection=null},onSubsectionChange:r=>e.configActiveSubsection=r,onReload:()=>ge(e),onSave:()=>Pt(e),onApply:()=>Ya(e),onUpdate:()=>Qa(e),userName:e.userName||"",userAvatar:e.userAvatar,onUserProfileUpdate:(r,f)=>e.handleUpdateUserProfile(r,f),onModelSwitch:(r,f)=>Ga(e,r,f)}):y}

        ${e.tab==="debug"?$o({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:r=>e.debugCallMethod=r,onCallParamsChange:r=>e.debugCallParams=r,onRefresh:()=>et(e),onCall:()=>Ja(e)}):y}

        ${e.tab==="logs"?Co({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:r=>e.logsFilterText=r,onLevelToggle:(r,f)=>{e.logsLevelFilters={...e.logsLevelFilters,[r]:f}},onToggleAutoFollow:r=>e.logsAutoFollow=r,onRefresh:()=>jt(e,{reset:!0}),onExport:(r,f)=>e.exportLogs(r,f),onScroll:r=>e.handleLogsScroll(r)}):y}
      </main>
      ${e.tab!=="chat"?Hd({allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:e.allyPanelOpen??!1,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:e.allyUnread??0,connected:e.connected,compact:!1,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:r=>e.handleAllyDraftChange(r),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:r=>e.handleAllyAttachmentsChange(r),onAction:(r,f,g,v)=>e.handleAllyAction(r,f,g,v)}):y}
      ${xo(e)}
      ${Ru(e)}
      ${Lu(e)}
      ${e.sidebarOpen&&e.tab!=="chat"?c`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${()=>e.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${Wt({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:()=>e.handleCloseSidebar(),onViewRawText:()=>{e.sidebarContent&&e.handleOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath,title:e.sidebarTitle})},onOpenFile:r=>e.handleOpenFile(r),onPushToDrive:(r,f)=>e.handlePushToDrive(r,f),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker()})}
              </div>
            </div>
          `:y}
      ${hh({toasts:e.toasts,onDismiss:r=>e.dismissToast(r)})}
      ${dh(e.lightbox,{onClose:()=>e.handleLightboxClose(),onNav:r=>e.handleLightboxNav(r)})}
    </div>
  `}async function kh(e){}async function Th(e){}async function _h(e,t){}async function Ah(e){}async function $h(e){}async function Ch(e){}async function ks(e){if(!(!e.client||!e.connected)){e.trustTrackerLoading=!0;try{const[t,s]=await Promise.all([e.client.request("trust.dashboard",{}),e.client.request("trust.history",{limit:50})]);e.trustTrackerData={workflows:t.workflows,summaries:t.summaries,ratings:s.ratings,total:s.total,overallScore:t.overallScore,totalRatings:t.totalRatings,totalUses:t.totalUses,todayRating:t.todayRating??null,dailyAverage:t.dailyAverage??null,dailyStreak:t.dailyStreak??0,recentDaily:t.recentDaily??[]}}catch{e.trustTrackerData=null}finally{e.trustTrackerLoading=!1}}}async function fa(e,t){if(!(!e.client||!e.connected))try{await e.client.request("trust.workflows.set",{workflows:t}),e.showToast("Workflows updated","success",2e3),await ks(e)}catch(s){e.showToast("Failed to update workflows","error"),console.error("[TrustTracker] setWorkflows error:",s)}}async function xh(e,t){const s=e.trustTrackerData?.workflows??[];if(s.length>=5){e.showToast("Maximum 5 workflows allowed","error");return}if(s.includes(t.trim())){e.showToast("Workflow already tracked","error");return}await fa(e,[...s,t.trim()])}async function Ph(e,t){const s=e.trustTrackerData?.workflows??[];await fa(e,s.filter(n=>n!==t))}async function Ih(e,t,s){if(!(!e.client||!e.connected))try{await e.client.request("trust.dailyRate",{rating:t,...s?{note:s}:{}}),e.showToast(`Rated ${t}/10 today`,"success",2e3),await ks(e)}catch(n){e.showToast("Failed to submit daily rating","error"),console.error("[TrustTracker] dailyRate error:",n)}}const Dh=6e4,An=15,$n=new Set;let Ve=null;async function Cn(e){if(!(!e.client||!e.connected))try{const t=new Date,s=new Date(t.getTime()+An*6e4+6e4),n=await e.client.request("calendar.events.range",{startDate:t.toISOString(),endDate:s.toISOString()});for(const i of n.events??[]){if($n.has(i.id))continue;const a=new Date(i.startTime),o=Math.round((a.getTime()-t.getTime())/6e4);if(o>0&&o<=An){$n.add(i.id);const l=a.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),p=i.location?` @ ${i.location}`:"",m=`${i.title} starts in ${o} min (${l})${p}`;e.showToast(m,"warning",0)}}}catch(t){console.warn("[MeetingNotify] Poll error:",t)}}function Rh(e){ma(),Cn(e),Ve=setInterval(()=>{Cn(e)},Dh)}function ma(){Ve&&(clearInterval(Ve),Ve=null)}let Lh=0;function Eh(e,t="info",s=3e3,n){return{id:`toast-${Date.now()}-${Lh++}`,message:e,type:t,duration:s,createdAt:Date.now(),action:n}}function Mh(e,t){return e.filter(s=>s.id!==t)}function Oh(e,t){return[...e,t]}var Fh=Object.defineProperty,Nh=Object.getOwnPropertyDescriptor,u=(e,t,s,n)=>{for(var i=n>1?void 0:n?Nh(t,s):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(n?o(t,s,i):o(i))||i);return n&&i&&Fh(t,s,i),i};function xt(){return bl()}function Be(){return kl()}function Kh(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const s=t.trim().toLowerCase();return s==="1"||s==="true"||s==="yes"||s==="on"}function Bh(e,t){let s=e.trim();if(!s)return null;if(s.startsWith("Read HEARTBEAT.md")||s.startsWith("Read CONSCIOUSNESS.md")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(s)||s==="NO_REPLY"||s.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(s)||s.startsWith("# WORKING.md")||s.startsWith("# MISTAKES.md"))return console.debug("[Ally] Filtered message:",t,s.substring(0,100)),null;if(/(?:VERIFIED|FIXED|NEW):\s/.test(s)&&/✅|🟡|☑/.test(s)&&s.length>300)return console.debug("[Ally] Filtered message (verification dump):",t,s.substring(0,100)),null;if(/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(s))return console.debug("[Ally] Filtered message (system block):",t,s.substring(0,100)),null;if(/^\[GodMode Context:[^\]]*\]\s*$/.test(s))return console.debug("[Ally] Filtered message:",t,s.substring(0,100)),null;if(s=s.replace(/^(?:HEARTBEAT_OK|CONSCIOUSNESS_OK)\s*/i,"").trim(),s=s.replace(/^Deep work window is yours\.\s*/i,"").trim(),!s)return null;if(/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)&&s.length>200||/^##\s*Your Team\s*\(Agent Roster\)/i.test(s)&&s.indexOf(`

## `)===-1)return console.debug("[Ally] Filtered message:",t,s.substring(0,100)),null;if(/^##?\s*Persistence Protocol/i.test(s)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(s)||/^##?\s*Core (?:Behaviors|Principles)/i.test(s)||/^##?\s*Your Role as \w+/i.test(s))return console.debug("[Ally] Filtered message (persona leak):",t,s.substring(0,100)),null;const n=s.toLowerCase();if(["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"].filter(o=>n.includes(o)).length>=2)return console.debug("[Ally] Filtered message (multi-signal system leak):",t,s.substring(0,100)),null;if(/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(s))return console.debug("[Ally] Filtered message:",t,s.substring(0,100)),null;const a=s.match(/\b[\w.-]+\.(?:json\b|db\b|html\b|log\b|flag\b|jsonl\b|bak\b|css\b|js\b|ts\b|md\b|txt\b)/gi);return a&&a.length>=8&&a.join(" ").length>s.length*.4?(console.debug("[Ally] Filtered message (file listing dump):",t,s.substring(0,100)),null):s}const xn=new Set(["chat","today","workspaces","work","data","overview","channels","instances","sessions","cron","skills","nodes","config","debug","logs","my-day"]),Uh=["path","filePath","file","workspacePath"];let d=class extends Ln{constructor(){super(...arguments),this._ctx=Do(),this.settings=Zc(),this.password="",this.tab="chat",this.onboarding=Kh(),this.connected=!1,this.reconnecting=!1,this.reconnectAttempt=0,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.sessionPickerClickOutsideHandler=null,this.sessionSearchClickOutsideHandler=null,this.assistantName=xt().name,this.assistantAvatar=xt().avatar,this.assistantAgentId=xt().agentId??null,this.userName=Be().name,this.userAvatar=Be().avatar,this.sessionKey=this.settings.sessionKey,this.sessionPickerOpen=!1,this.sessionPickerPosition=null,this.sessionPickerSearch="",this.sessionSearchOpen=!1,this.sessionSearchPosition=null,this.sessionSearchQuery="",this.sessionSearchResults=[],this.sessionSearchLoading=!1,this.profilePopoverOpen=!1,this.profileEditName="",this.profileEditAvatar="",this.editingTabKey=null,this.chatLoading=!1,this.chatSending=!1,this.chatSendingSessionKey=null,this.chatMessage="",this.chatDrafts={},this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.currentToolName=null,this.currentToolInfo=null,this.workingSessions=new Set,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.pendingRetry=null,this.autoRetryAfterCompact=!1,this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.splitRatio=this.settings.splitRatio,this.lightbox=pa(),this.driveAccounts=[],this.showDrivePicker=!1,this.driveUploading=!1,this.updateStatus=null,this.updateLoading=!1,this.updateError=null,this.updateLastChecked=null,this.updatePollInterval=null,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.gatewayRestartPending=!1,this.gatewayRestartBusy=!1,this.deployPanelOpen=!1,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.archivedSessions=[],this.archivedSessionsLoading=!1,this.archivedSessionsExpanded=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...md},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.workspaceNeedsSetup=!1,this.onboardingPhase=0,this.onboardingData=null,this.onboardingActive=!1,this.wizardActive=!1,this.wizardState=null,this.showSetupTab=!1,this.setupCapabilities=null,this.setupCapabilitiesLoading=!1,this.setupQuickDone=!1,this.onboardingIntegrations=null,this.onboardingCoreProgress=null,this.onboardingExpandedCard=null,this.onboardingLoadingGuide=null,this.onboardingActiveGuide=null,this.onboardingTestingId=null,this.onboardingTestResult=null,this.onboardingConfigValues={},this.onboardingProgress=null,this.selectedWorkspace=null,this.workspacesSearchQuery="",this.workspaceItemSearchQuery="",this.workspacesLoading=!1,this.workspacesCreateLoading=!1,this.workspacesError=null,this.workspaceExpandedFolders=new Set,this.editingTaskId=null,this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null,this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=K(),this.todayViewMode="brief",this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.todayEditingTaskId=null,this.todayShowCompleted=!1,this.allyPanelOpen=!1,this.allyMessages=[],this.allyStream=null,this.allyDraft="",this.allyUnread=0,this.allySending=!1,this.allyWorking=!1,this.allyAttachments=[],this.todayQueueResults=[],this.inboxItems=[],this.inboxLoading=!1,this.inboxCount=0,this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,this.inboxSortOrder="newest",this.trustSummary=null,this.chatPrivateMode=!1,this.privateSessions=new Map,this._privateSessionTimer=null,this.dynamicSlots={},this.workLoading=!1,this.workError=null,this.workExpandedProjects=new Set,this.workProjectFiles={},this.workDetailLoading=new Set,this.workResourcesLoading=!1,this.workResourceFilter="all",this.sessionResources=[],this.sessionResourcesCollapsed=!1,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.skillsSubTab="godmode",this.godmodeSkills=null,this.godmodeSkillsLoading=!1,this.expandedSkills=new Set,this.rosterData=[],this.rosterLoading=!1,this.rosterError=null,this.rosterFilter="",this.expandedAgents=new Set,this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...fd},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.toasts=[],this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatIsAutoScrolling=!1,this.chatNewMessagesBelow=!1,this.consciousnessStatus="idle",this.focusPulseData=null,this.trustTrackerData=null,this.trustTrackerLoading=!1,this.guardrailsData=null,this.guardrailsLoading=!1,this.guardrailsShowAddForm=!1,this.missionControlData=null,this.missionControlLoading=!1,this.missionControlError=null,this.missionControlFullControl=(()=>{try{return localStorage.getItem("godmode.mc.fullControl")==="1"}catch{return!0}})(),this.missionControlPollInterval=null,this.godmodeOptions=null,this.godmodeOptionsLoading=!1,this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardPreviousSessionKey=null,this.dashboardChatOpen=!1,this.dashboardCategoryFilter=null,this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainVaultHealth=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=!1,this.basePath="",this.popStateHandler=()=>Ui(this),this.keydownHandler=()=>{},this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null}createRenderRoot(){return this}connectedCallback(){if(super.connectedCallback(),this.settings.userName)this.userName=this.settings.userName;else{const t=Be();this.userName=t.name}if(this.settings.userAvatar)this.userAvatar=this.settings.userAvatar;else{const t=Be();this.userAvatar=t.avatar}Pd(this);const e=K();this.todaySelectedDate!==e&&(this.todaySelectedDate=e),Rh(this),this._restorePrivateSessions()}firstUpdated(){Id(this)}disconnectedCallback(){ma(),this._stopPrivateSessionTimer(),Dd(this),super.disconnectedCallback()}updated(e){Ld(this,e),this._syncContext()}_syncContext(){const e=this._ctx;e.connected===this.connected&&e.reconnecting===this.reconnecting&&e.sessionKey===this.sessionKey&&e.assistantName===this.assistantName&&e.assistantAvatar===this.assistantAvatar&&e.userName===this.userName&&e.userAvatar===this.userAvatar&&e.theme===this.theme&&e.themeResolved===this.themeResolved&&e.settings===this.settings&&e.basePath===this.basePath&&e.gateway===this.client||(this._ctx={connected:this.connected,reconnecting:this.reconnecting,sessionKey:this.sessionKey,assistantName:this.assistantName,assistantAvatar:this.assistantAvatar,userName:this.userName,userAvatar:this.userAvatar,theme:this.theme,themeResolved:this.themeResolved,settings:this.settings,basePath:this.basePath,gateway:this.client,send:(t,s)=>this.client?.request(t,s)??Promise.reject(new Error("Not connected")),setTab:t=>this.setTab(t),addToast:(t,s)=>this.showToast(t,s??"info"),openSidebar:t=>this.handleOpenSidebar(t.content,{title:t.title,mimeType:t.mimeType,filePath:t.filePath}),closeSidebar:()=>this.handleCloseSidebar()})}connect(){ts(this)}handleChatScroll(e){jo(this,e)}handleLogsScroll(e){zo(this,e)}exportLogs(e,t){Ho(e,t)}resetToolStream(){Ht(this),this.sessionResources=[]}resetChatScroll(){nt(this)}async loadAssistantIdentity(){await ti(this)}applySettings(e){ne(this,e)}setTab(e){us(this,e)}setTheme(e,t){Mi(this,e,t)}async loadOverview(){await fs(this)}async loadCron(){await ct(this)}async handleAbortChat(){await ms(this)}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}async loadFocusPulse(){await kh()}async handleFocusPulseStartMorning(){await Th(),this.setTab("chat");const e="Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan.",{createNewSession:t}=await w(async()=>{const{createNewSession:s}=await Promise.resolve().then(()=>ie);return{createNewSession:s}},void 0,import.meta.url);t(this),this.handleSendChat(e)}async handleFocusPulseSetFocus(e){await _h()}async handleFocusPulseComplete(){await Ah()}async handleFocusPulsePulseCheck(){await $h()}async handleFocusPulseEndDay(){await Ch()}async handleTrustLoad(){await ks(this)}async handleTrustAddWorkflow(e){await xh(this,e)}async handleTrustRemoveWorkflow(e){await Ph(this,e)}async handleDailyRate(e,t){await Ih(this,e,t)}async handleGuardrailsLoad(){const{loadGuardrails:e}=await w(async()=>{const{loadGuardrails:t}=await import("./ctrl-settings-rEJlXhcU.js").then(s=>s.af);return{loadGuardrails:t}},[],import.meta.url);await e(this)}async handleGuardrailToggle(e,t){const{toggleGuardrail:s}=await w(async()=>{const{toggleGuardrail:n}=await import("./ctrl-settings-rEJlXhcU.js").then(i=>i.af);return{toggleGuardrail:n}},[],import.meta.url);await s(this,e,t)}async handleGuardrailThresholdChange(e,t,s){const{updateGuardrailThreshold:n}=await w(async()=>{const{updateGuardrailThreshold:i}=await import("./ctrl-settings-rEJlXhcU.js").then(a=>a.af);return{updateGuardrailThreshold:i}},[],import.meta.url);await n(this,e,t,s)}async handleCustomGuardrailToggle(e,t){const{toggleCustomGuardrail:s}=await w(async()=>{const{toggleCustomGuardrail:n}=await import("./ctrl-settings-rEJlXhcU.js").then(i=>i.af);return{toggleCustomGuardrail:n}},[],import.meta.url);await s(this,e,t)}async handleCustomGuardrailDelete(e){const{deleteCustomGuardrail:t}=await w(async()=>{const{deleteCustomGuardrail:s}=await import("./ctrl-settings-rEJlXhcU.js").then(n=>n.af);return{deleteCustomGuardrail:s}},[],import.meta.url);await t(this,e)}async handleCustomGuardrailAdd(e){const{addCustomGuardrailFromUI:t}=await w(async()=>{const{addCustomGuardrailFromUI:s}=await import("./ctrl-settings-rEJlXhcU.js").then(n=>n.af);return{addCustomGuardrailFromUI:s}},[],import.meta.url);await t(this,e),this.guardrailsShowAddForm=!1}handleToggleGuardrailAddForm(){this.guardrailsShowAddForm=!this.guardrailsShowAddForm}handleMissionControlToggleFullControl(){this.missionControlFullControl=!this.missionControlFullControl;try{localStorage.setItem("godmode.mc.fullControl",this.missionControlFullControl?"1":"0")}catch{}}async handleMissionControlRefresh(){const{loadMissionControl:e}=await w(async()=>{const{loadMissionControl:t}=await import("./ctrl-settings-rEJlXhcU.js").then(s=>s.ae);return{loadMissionControl:t}},[],import.meta.url);await e(this)}async handleMissionControlCancelTask(e){const{cancelCodingTask:t}=await w(async()=>{const{cancelCodingTask:s}=await import("./ctrl-settings-rEJlXhcU.js").then(n=>n.ae);return{cancelCodingTask:s}},[],import.meta.url);await t(this,e)}async handleMissionControlApproveItem(e){const{approveCodingTask:t,approveQueueItem:s}=await w(async()=>{const{approveCodingTask:i,approveQueueItem:a}=await import("./ctrl-settings-rEJlXhcU.js").then(o=>o.ae);return{approveCodingTask:i,approveQueueItem:a}},[],import.meta.url);await t(this,e)||await s(this,e)}async handleMissionControlRetryItem(e){const{retryQueueItem:t}=await w(async()=>{const{retryQueueItem:s}=await import("./ctrl-settings-rEJlXhcU.js").then(n=>n.ae);return{retryQueueItem:s}},[],import.meta.url);await t(this,e)}async handleMissionControlViewDetail(e){const{loadAgentDetail:t}=await w(async()=>{const{loadAgentDetail:n}=await import("./ctrl-settings-rEJlXhcU.js").then(i=>i.ae);return{loadAgentDetail:n}},[],import.meta.url),s=await t(this,e);this.handleOpenSidebar(s.content,{mimeType:s.mimeType,title:s.title})}async handleMissionControlOpenSession(e){const t=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:t,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:s}=await w(async()=>{const{loadChatHistory:n}=await Promise.resolve().then(()=>te);return{loadChatHistory:n}},void 0,import.meta.url);await s(this),this.loadSessionResources()}async handleMissionControlOpenTaskSession(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e});if(t?.sessionId){if(t.task?.title){const{autoTitleCache:s}=await w(async()=>{const{autoTitleCache:n}=await import("./ctrl-settings-rEJlXhcU.js").then(i=>i.ad);return{autoTitleCache:n}},[],import.meta.url);s.set(t.sessionId,t.task.title)}await this.handleMissionControlOpenSession(t.sessionId),t.queueOutput&&this.chatMessages.length===0&&await this.seedSessionWithAgentOutput(t.task?.title??"task",t.queueOutput,t.agentPrompt??void 0)}}catch(t){console.error("[MissionControl] Failed to open task session:",t),this.showToast("Failed to open session","error")}}async handleMissionControlStartQueueItem(e){await this.handleMissionControlOpenTaskSession(e)}async handleSwarmSelectProject(e){const{selectSwarmProject:t}=await w(async()=>{const{selectSwarmProject:s}=await import("./ctrl-settings-rEJlXhcU.js").then(n=>n.ae);return{selectSwarmProject:s}},[],import.meta.url);await t(this,e)}async handleSwarmSteer(e,t,s){const{steerSwarmAgent:n}=await w(async()=>{const{steerSwarmAgent:i}=await import("./ctrl-settings-rEJlXhcU.js").then(a=>a.ae);return{steerSwarmAgent:i}},[],import.meta.url);await n(this,e,t,s)}async handleSwarmViewProofDoc(e){return this.handleOpenProofDoc(e)}async handleSwarmViewRunLog(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("godmode.delegation.runLog",{queueItemId:e});t?.content?this.handleOpenSidebar(t.content,{mimeType:t.mimeType??"text/markdown",title:t.title??"Agent Logs"}):this.showToast("No logs available","error")}catch{this.showToast("Failed to load agent logs","error")}}async handleMissionControlViewTaskFiles(e){try{const s=(await this.client?.request("queue.taskFiles",{itemId:e}))?.files??[];if(s.length===0){this.showToast("No files found for this task","info");return}const i=`## Task Files

${s.map(a=>`- **${a.name}** (${a.type}, ${(a.size/1024).toFixed(1)} KB)
  \`${a.path}\``).join(`

`)}`;this.handleOpenSidebar(i,{title:"Task Files"})}catch(t){console.error("Failed to load task files:",t),this.showToast("Failed to load task files","error")}}async handleAllyAction(e,t,s,n){if(e==="navigate"&&t)this.setTab(t);else if(e==="rpc"&&s&&this.client)try{await this.client.request(s,n??{}),this.showToast("Done","success",2e3)}catch(i){console.error("[Ally] Action RPC failed:",i),this.showToast("Action failed","error")}}handleAllyToggle(){this.allyPanelOpen=!this.allyPanelOpen,this.allyPanelOpen&&(this.allyUnread=0,this._loadAllyHistory().then(()=>{this._scrollAllyToBottom(),requestAnimationFrame(()=>this._scrollAllyToBottom())}))}handleAllyDraftChange(e){this.allyDraft=e}handleAllyAttachmentsChange(e){this.allyAttachments=e}async handleAllySend(){const e=this.allyDraft.trim(),t=this.allyAttachments;if(!e&&t.length===0||this.allySending)return;const s=Qo(this);let n=e?`${s}

${e}`:s;this.allyDraft="",this.allyAttachments=[],this.allySending=!0,this.allyMessages=[...this.allyMessages,{role:"user",content:e||"(image)",timestamp:Date.now()}];try{let i;if(t.length>0){const p=[];for(const m of t){if(!m.dataUrl)continue;const r=m.dataUrl.match(/^data:([^;]+);base64,(.+)$/);if(!r)continue;const[,f,g]=r;f.startsWith("image/")&&p.push({type:"image",mimeType:f,content:g,fileName:m.fileName})}if(p.length>0){i=p;try{await this.client?.request("images.cache",{images:p.map(m=>({data:m.content,mimeType:m.mimeType,fileName:m.fileName})),sessionKey:M})}catch{}}}const a=`ally-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;try{await this.client?.request("sessions.patch",{key:M,lastChannel:"webchat"})}catch{}await this.client?.request("agent",{sessionKey:M,message:n,deliver:!1,channel:"webchat",idempotencyKey:a,attachments:i}),this.allyWorking=!0;const o=this.allyMessages[this.allyMessages.length-1]?.content,l=setInterval(async()=>{if(!this.allyWorking){clearInterval(l);return}try{await this._loadAllyHistory();const p=this.allyMessages[this.allyMessages.length-1];p&&p.role==="assistant"&&p.content!==o&&(this.allyWorking=!1,this.allyStream=null,clearInterval(l),this._scrollAllyToBottom())}catch{}},5e3);setTimeout(()=>clearInterval(l),12e4)}catch(i){const a=i instanceof Error?i.message:String(i);console.error("[Ally] Failed to send ally message:",a),this.allyMessages=[...this.allyMessages,{role:"assistant",content:`*Send failed: ${a}*`,timestamp:Date.now()}]}finally{this.allySending=!1}}handleAllyOpenFull(){this.allyPanelOpen=!1,this.setTab("chat"),this.applySettings({...this.settings,sessionKey:M,lastActiveSessionKey:M,tabLastViewed:{...this.settings.tabLastViewed,[M]:Date.now()}}),this.sessionKey=M,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),w(async()=>{const{loadChatHistory:e}=await Promise.resolve().then(()=>te);return{loadChatHistory:e}},void 0,import.meta.url).then(({loadChatHistory:e})=>e(this)),this.loadSessionResources()}_scrollAllyToBottom(){this.updateComplete.then(()=>{requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector?.(".ally-panel, .ally-inline")??document.querySelector(".ally-panel, .ally-inline");if(!e)return;const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)})})}async _loadAllyHistory(){try{const e=await this.client?.request("chat.history",{sessionKey:M,limit:100});if(e?.messages){const{extractText:t,formatApiError:s}=await w(async()=>{const{extractText:i,formatApiError:a}=await Promise.resolve().then(()=>xr);return{extractText:i,formatApiError:a}},void 0,import.meta.url);this.allyMessages=e.messages.map(i=>{const a=i.role??"assistant",o=a.toLowerCase();if(o==="tool"||o==="toolresult"||o==="tool_result"||o==="function"||o==="system")return null;const l=i;if(l.toolCallId||l.tool_call_id||l.toolName||l.tool_name)return null;if(Array.isArray(i.content)){const f=i.content;if(!f.some(v=>{const b=(typeof v.type=="string"?v.type:"").toLowerCase();return(b==="text"||b==="")&&typeof v.text=="string"&&v.text.trim().length>0})&&f.some(b=>{const _=(typeof b.type=="string"?b.type:"").toLowerCase();return _==="tool_use"||_==="tool_result"||_==="toolresult"||_==="tooluse"}))return null}let p=t(i);if(!p)return null;const m=s(p);if(m&&(p=m),p=p.replace(/^\[GodMode Context:[^\]]*\]\s*/i,"").trim(),!p)return null;const r=Bh(p,a);return r?{role:o==="user"?"user":"assistant",content:r,timestamp:i.timestamp}:null}).filter(i=>i!==null);const n=[];for(const i of this.allyMessages){const a=n[n.length-1];a&&a.role===i.role&&a.content===i.content||n.push(i)}this.allyMessages=n}}catch{}}async handleDecisionApprove(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.approve",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Approve failed:",t),this.showToast("Failed to approve","error")}}async handleDecisionReject(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.reject",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Reject failed:",t),this.showToast("Failed to reject","error")}}async handleDecisionDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Dismiss failed:",t),this.showToast("Failed to dismiss","error")}}async handleDecisionMarkComplete(e){if(!(!this.client||!this.connected))try{const t=this.todayQueueResults?.find(s=>s.id===e);t?.sourceTaskId&&await this.client.request("tasks.update",{id:t.sourceTaskId,status:"complete"}),await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(s=>s.id!==e),this.showToast("Task marked complete","success")}catch(t){console.error("[DecisionCard] Mark complete failed:",t),this.showToast("Failed to mark complete","error")}}async handleDecisionRate(e,t,s){if(!(!this.client||!this.connected))try{await this.client.request("trust.rate",{workflow:t,rating:s});const n=s<7;this.todayQueueResults=this.todayQueueResults.map(i=>i.id===e?{...i,userRating:s,feedbackPending:n}:i),n?this.showToast(`Rated ${t} ${s}/10 — what could be better?`,"info"):(this.todayQueueResults?.find(a=>a.id===e)?.source==="cron"&&(await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(a=>a.id!==e)),this.showToast(`Rated ${t} ${s}/10`,"success"))}catch(n){console.error("[DecisionCard] Rate failed:",n),this.showToast("Failed to submit rating","error")}}async handleDecisionFeedback(e,t,s){if(!(!this.client||!this.connected))try{s&&(await this.client.request("trust.feedback",{workflow:t,feedback:s}),this.showToast(`Feedback saved for ${t} — will apply next time`,"success")),this.todayQueueResults?.find(i=>i.id===e)?.source==="cron"&&await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.map(i=>i.id===e?{...i,feedbackPending:!1}:i).filter(i=>!(i.id===e&&i.source==="cron"))}catch(n){console.error("[DecisionCard] Feedback failed:",n),this.showToast("Failed to save feedback","error")}}async handleDecisionViewOutput(e,t){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const s=await this.client.request("queue.readOutput",{path:t}),n=t.split("/").pop()??"Agent Output";this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:t,title:n})}catch(s){console.error("[DecisionCard] View output failed:",s),this.handleOpenFile(t)}}async handleDecisionOpenChat(e){const t=this.todayQueueResults?.find(i=>i.id===e);if(!t)return;if(t.sourceTaskId){await this.handleMissionControlOpenTaskSession(t.sourceTaskId);return}const{createNewSession:s}=await w(async()=>{const{createNewSession:i}=await Promise.resolve().then(()=>ie);return{createNewSession:i}},void 0,import.meta.url);s(this),this.setTab("chat");const{autoTitleCache:n}=await w(async()=>{const{autoTitleCache:i}=await import("./ctrl-settings-rEJlXhcU.js").then(a=>a.ad);return{autoTitleCache:i}},[],import.meta.url);if(n.set(this.sessionKey,t.title),t.outputPath&&this.client&&this.connected)try{const i=await this.client.request("queue.readOutput",{path:t.outputPath});i?.content&&await this.seedSessionWithAgentOutput(t.title,i.content)}catch{await this.seedSessionWithAgentOutput(t.title,t.summary)}else t.summary&&await this.seedSessionWithAgentOutput(t.title,t.summary)}async handleTodayOpenChatToEdit(e){try{const t=this.todayQueueResults?.find(n=>n.id===e),s=t?.outputPath;if(s&&this.client&&this.connected)try{const n=await this.client.request("queue.readOutput",{path:s});this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:s,title:t?.title??s.split("/").pop()??"Agent Output"})}catch{await this.handleOpenFile(s)}this.allyPanelOpen=!0,this.allyUnread=0,this.tab!=="chat"&&this.setTab("chat")}catch(t){console.error("Open chat to edit failed:",t)}}async seedSessionWithAgentOutput(e,t,s){if(!this.client||!this.connected)return;this.handleOpenSidebar(t,{title:`Agent Output: ${e}`,filePath:null,mimeType:null});const n=t.match(/## Summary\n([\s\S]*?)(?=\n## |$)/),i=n?n[1].trim().split(`
`).slice(0,3).join(`
`):"Output available in sidebar.",a=[`Agent completed **${e}**.`,"",i,"","Full output is in the sidebar. What would you like to do?"].join(`
`);try{const{sendChatMessage:o}=await w(async()=>{const{sendChatMessage:l}=await Promise.resolve().then(()=>te);return{sendChatMessage:l}},void 0,import.meta.url);await o(this,a)}catch(o){console.error("[Session] Failed to seed session with agent output:",o)}}async handleMissionControlAddToQueue(e,t){if(!(!this.client||!this.connected))try{await this.client.request("queue.add",{type:e,title:t,priority:"normal"}),this.showToast("Added to queue","success",2e3);const{loadMissionControl:s}=await w(async()=>{const{loadMissionControl:n}=await import("./ctrl-settings-rEJlXhcU.js").then(i=>i.ae);return{loadMissionControl:n}},[],import.meta.url);await s(this)}catch{this.showToast("Failed to add to queue","error")}}async handleDashboardsRefresh(){const{loadDashboards:e}=await w(async()=>{const{loadDashboards:t}=await import("./dashboards-CrT3s0NG.js");return{loadDashboards:t}},[],import.meta.url);await e(this)}async handleDashboardSelect(e){const{loadDashboard:t}=await w(async()=>{const{loadDashboard:s}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:s}},[],import.meta.url);if(await t(this,e),this.client&&this.connected)try{const s=await this.client.request("dashboards.openSession",{dashboardId:e});if(s?.sessionId){this.dashboardPreviousSessionKey=this.sessionKey;const n=s.sessionId,{autoTitleCache:i}=await w(async()=>{const{autoTitleCache:l}=await import("./ctrl-settings-rEJlXhcU.js").then(p=>p.ad);return{autoTitleCache:l}},[],import.meta.url);i.set(n,s.manifest.title),this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:n});const{saveDraft:a}=await w(async()=>{const{saveDraft:l}=await Promise.resolve().then(()=>Tt);return{saveDraft:l}},void 0,import.meta.url);a(this),this.sessionKey=n,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream();const{loadChatHistory:o}=await w(async()=>{const{loadChatHistory:l}=await Promise.resolve().then(()=>te);return{loadChatHistory:l}},void 0,import.meta.url);await o(this),this.loadSessionResources(),this.dashboardChatOpen=!0}}catch(s){console.error("[Dashboards] Failed to init session on select:",s)}}async handleDashboardDelete(e){const{deleteDashboard:t}=await w(async()=>{const{deleteDashboard:s}=await import("./dashboards-CrT3s0NG.js");return{deleteDashboard:s}},[],import.meta.url);await t(this,e)}async handleDashboardTogglePin(e){const{toggleDashboardPin:t}=await w(async()=>{const{toggleDashboardPin:s}=await import("./dashboards-CrT3s0NG.js");return{toggleDashboardPin:s}},[],import.meta.url);await t(this,e)}async handleDashboardCreateViaChat(e){this.setTab("chat");const{createNewSession:t}=await w(async()=>{const{createNewSession:s}=await Promise.resolve().then(()=>ie);return{createNewSession:s}},void 0,import.meta.url);t(this),this.handleSendChat(e??"I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more.")}handleDashboardCategoryFilter(e){this.dashboardCategoryFilter=e}handleDashboardBack(){if(this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1,this.dashboardPreviousSessionKey){const e=this.dashboardPreviousSessionKey;this.dashboardPreviousSessionKey=null,w(async()=>{const{saveDraft:t}=await Promise.resolve().then(()=>Tt);return{saveDraft:t}},void 0,import.meta.url).then(({saveDraft:t})=>{t(this),this.sessionKey=e,w(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>te);return{loadChatHistory:s}},void 0,import.meta.url).then(({loadChatHistory:s})=>{s(this)})})}}async handleDashboardOpenSession(e){const t=this.activeDashboardManifest?.sessionId;if(!t){this.showToast("No session for this dashboard","error");return}this.dashboardPreviousSessionKey=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1;const s=this.settings.openTabs.includes(t)?this.settings.openTabs:[...this.settings.openTabs,t];this.applySettings({...this.settings,openTabs:s,sessionKey:t,lastActiveSessionKey:t,tabLastViewed:{...this.settings.tabLastViewed,[t]:Date.now()}}),this.setTab("chat");const{syncUrlWithSessionKey:n}=await w(async()=>{const{syncUrlWithSessionKey:i}=await Promise.resolve().then(()=>cd);return{syncUrlWithSessionKey:i}},void 0,import.meta.url);n(this,t,!0)}async handleOptionsLoad(){const{loadOptions:e}=await w(async()=>{const{loadOptions:t}=await import("./options-QuHclvvX.js");return{loadOptions:t}},[],import.meta.url);await e(this)}async handleOptionToggle(e,t){const{saveOption:s}=await w(async()=>{const{saveOption:n}=await import("./options-QuHclvvX.js");return{saveOption:n}},[],import.meta.url);await s(this,e,t)}async handleSecondBrainRefresh(){const{loadSecondBrain:e}=await w(async()=>{const{loadSecondBrain:t}=await import("./second-brain-cP3vM8ym.js");return{loadSecondBrain:t}},[],import.meta.url);await e(this)}handleSecondBrainSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.handleSecondBrainRefresh().catch(t=>{console.error("[SecondBrain] Refresh after subtab change failed:",t),this.secondBrainError=t instanceof Error?t.message:"Failed to load data",this.secondBrainLoading=!1})}async handleSecondBrainSelectEntry(e){if(e.endsWith(".html")||e.endsWith(".htm")){try{const n=await this.client.request("secondBrain.memoryBankEntry",{path:e});n?.content&&this.handleOpenSidebar(n.content,{mimeType:"text/html",filePath:e,title:n.name||e.split("/").pop()||"File"})}catch(n){console.error("[SecondBrain] Failed to open HTML file:",n)}return}const{loadSecondBrainEntry:s}=await w(async()=>{const{loadSecondBrainEntry:n}=await import("./second-brain-cP3vM8ym.js");return{loadSecondBrainEntry:n}},[],import.meta.url);await s(this,e)}async handleSecondBrainBrowseFolder(e){const{browseFolder:t}=await w(async()=>{const{browseFolder:s}=await import("./second-brain-cP3vM8ym.js");return{browseFolder:s}},[],import.meta.url);await t(this,e)}handleSecondBrainBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}handleSecondBrainSearch(e){this.secondBrainSearchQuery=e}async handleSecondBrainSync(){const{syncSecondBrain:e}=await w(async()=>{const{syncSecondBrain:t}=await import("./second-brain-cP3vM8ym.js");return{syncSecondBrain:t}},[],import.meta.url);await e(this)}handleSecondBrainFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doSecondBrainFileSearch(e)}async _doSecondBrainFileSearch(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=t.results??[])}catch(t){console.error("[SecondBrain] search failed:",t)}}async handleSecondBrainFileSelect(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const s=e.endsWith(".html")||e.endsWith(".htm");this.handleOpenSidebar(t.content,{mimeType:s?"text/html":"text/markdown",filePath:e,title:t.name||e.split("/").pop()||"File"})}}catch(t){console.error("[SecondBrain] Failed to open file:",t),this.showToast("Failed to open file","error")}}async handleResearchSaveViaChat(){this.setTab("chat");const{createNewSession:e}=await w(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>ie);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save.")}async handleAddSource(){this.setTab("chat");const{createNewSession:e}=await w(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>ie);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect.")}removeQueuedMessage(e){ji(this,e)}async handleSendChat(e,t){const s=this.sessionsResult?.sessions?.find(n=>n.key===this.sessionKey);if(s){const n=s.totalTokens??0,i=s.contextTokens??this.sessionsResult?.defaults?.contextTokens??2e5;if((i>0?n/i:0)>=.9&&!this.compactionStatus?.active){const o=(e??this.chatMessage).trim(),l=e==null?[...this.chatAttachments??[]]:[];if(o||l.length>0){this.pendingRetry={message:o,attachments:l,timestamp:Date.now()},this.autoRetryAfterCompact=!0,this.chatMessages=[...this.chatMessages,{role:"user",content:[{type:"text",text:o}],timestamp:Date.now()}],e==null&&(this.chatMessage="",this.chatAttachments=[]),this.showToast("Context near limit — auto-compacting...","info",3e3),this.handleCompactChat();return}}}await zi(this,e,t)}handleToggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen}handleToggleSessionSearch(e){if(!this.sessionSearchOpen&&e){const s=e.currentTarget.getBoundingClientRect();this.sessionSearchPosition={top:s.bottom+8,right:window.innerWidth-s.right}}this.sessionSearchOpen=!this.sessionSearchOpen,this.sessionSearchOpen||(this.sessionSearchQuery="",this.sessionSearchResults=[])}async handleSessionSearchQuery(e){if(this.sessionSearchQuery=e,!e.trim()){this.sessionSearchResults=[];return}if(this.client){this.sessionSearchLoading=!0;try{const t=await this.client.request("sessions.searchContent",{query:e.trim(),limit:20});this.sessionSearchResults=t.results}catch(t){console.error("Session search failed:",t),this.sessionSearchResults=[]}finally{this.sessionSearchLoading=!1}}}handleSelectSession(e){this.sessionPickerOpen=!1,this.sessionSearchOpen=!1,this.sessionSearchQuery="",this.sessionSearchResults=[]}async handleWhatsAppStart(e){await Ro(this,e)}async handleWhatsAppWait(){await Lo(this)}async handleWhatsAppLogout(){await Eo(this)}async handleChannelConfigSave(){await Mo(this)}async handleChannelConfigReload(){await Oo(this)}async handleCompactChat(){if(!this.connected){this.showToast("Cannot compact: not connected","error");return}if(!this.sessionKey){this.showToast("Cannot compact: no active session","error");return}this.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null};try{await this.handleSendChat("/compact")}catch(e){this.compactionStatus=null,console.error("Compaction failed:",e),this.showToast("Compaction failed","error")}}injectCompactionSummary(e,t){const s={role:"system",content:e,timestamp:Date.now(),isCompactionSummary:!0,keptMessages:t};this.chatMessages=[s,...this.chatMessages]}async handleRetryMessage(){const e={client:this.client,connected:this.connected,sessionKey:this.sessionKey,chatLoading:this.chatLoading,chatMessages:this.chatMessages,chatThinkingLevel:this.chatThinkingLevel,chatSending:this.chatSending,chatSendingSessionKey:this.chatSendingSessionKey,chatMessage:this.chatMessage,chatAttachments:this.chatAttachments,chatRunId:this.chatRunId,chatStream:this.chatStream,chatStreamStartedAt:this.chatStreamStartedAt,lastError:this.lastError,pendingRetry:this.pendingRetry},t=await oi(e);this.chatSending=e.chatSending,this.chatSendingSessionKey=e.chatSendingSessionKey,this.chatRunId=e.chatRunId,this.chatStream=e.chatStream,this.chatStreamStartedAt=e.chatStreamStartedAt,this.lastError=e.lastError,this.pendingRetry=e.pendingRetry??null,this.chatMessages=e.chatMessages,t&&this.showToast("Message resent","success",2e3)}handleClearRetry(){this.pendingRetry=null}handleNostrProfileEdit(e,t){No(this,e,t)}handleNostrProfileCancel(){Ko(this)}handleNostrProfileFieldChange(e,t){Bo(this,e,t)}async handleNostrProfileSave(){await Wo(this)}async handleNostrProfileImport(){await qo(this)}handleNostrProfileToggleAdvanced(){Uo(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(s=>s.id!==t.id)}catch(s){this.execApprovalError=`Exec approval failed: ${String(s)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,ne(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleGatewayRestartClick(){this.gatewayRestartPending=!0}async handleGatewayRestartConfirm(){if(!(!this.client||this.gatewayRestartBusy)){this.gatewayRestartBusy=!0;try{await this.client.request("godmode.gateway.restart")}catch{}finally{this.gatewayRestartBusy=!1,this.gatewayRestartPending=!1}}}handleGatewayRestartCancel(){this.gatewayRestartPending=!1}handleDeployPanelToggle(){this.deployPanelOpen=!this.deployPanelOpen}async handleDeployDismiss(){if(this.client){try{await this.client.request("godmode.deploy.dismiss")}catch{}this.deployPanelOpen=!1,this.updateStatus&&(this.updateStatus={...this.updateStatus,pendingDeploy:null})}}handleOpenSidebar(e,t={}){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarMimeType=t.mimeType?.trim()||null,this.sidebarFilePath=t.filePath?.trim()||null,this.sidebarTitle=t.title?.trim()||null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.showDrivePicker=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode!=="proof"&&(this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null),this.sidebarCloseTimer=null)},200)}async handleOpenFile(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}let t=e;if(!e.includes("/")&&!e.includes("\\")&&!e.startsWith("~"))try{t=(await this.client.request("files.resolve",{filename:e})).path}catch{}try{const s=await this.client.request("files.read",{path:t}),n=t.split(".").pop()?.toLowerCase()??"",i=s.contentType??s.mime??(n==="md"?"text/markdown":null),a=t.split("/").pop()??t;this.handleOpenSidebar(s.content,{mimeType:i,filePath:t,title:a}),s.truncated&&this.showToast(`Opened truncated file: ${a}`,"warning")}catch(s){console.error("[Chat] Failed to open file:",s),this.showToast(`Failed to open file: ${e}`,"error")}}async handleToggleDrivePicker(){if(this.showDrivePicker){this.showDrivePicker=!1;return}if(this.driveAccounts.length===0)try{const e=await this.client?.request("files.listDriveAccounts",{});this.driveAccounts=e?.accounts??[]}catch{this.driveAccounts=[]}this.showDrivePicker=!0}async handlePushToDrive(e,t){if(!this.driveUploading){if(this.showDrivePicker=!1,this._pendingBatchPaths&&this._pendingBatchPaths.length>0){const s=this._pendingBatchPaths;this._pendingBatchPaths=void 0,await this._executeBatchDrive(s,t);return}this.driveUploading=!0;try{const s={filePath:e};t&&(s.account=t);const n=await this.client?.request("files.pushToDrive",s),i=t?` to ${t.split("@")[0]}`:"",a=n?.message??`Uploaded${i} to Google Drive`,o=n?.driveUrl;this.showToast(a,"success",o?8e3:5e3,o?{label:"View in Drive",url:o}:void 0)}catch(s){console.error("Push to Drive failed:",s);const n=s instanceof Error?s.message:typeof s=="object"&&s!==null&&"message"in s?String(s.message):"Unknown error";n.includes("GOG_NOT_FOUND")||n.includes("gog CLI not found")?this.showToast("Google Drive not configured. Install gog CLI: npm install -g gog-cli, then run: gog auth add <email> --services drive","warning",1e4):n.includes("GOG_AUTH")||n.includes("auth")&&n.includes("expired")?this.showToast("Google Drive auth expired. Re-authenticate: gog auth add <email> --services drive","warning",8e3):this.showToast(`Drive upload failed: ${n}`,"error",8e3)}finally{this.driveUploading=!1}}}async handleBatchPushToDrive(e){if(this.driveUploading||e.length===0)return;if(!this.driveAccounts||this.driveAccounts.length===0)try{const s=await this.client?.request("files.listDriveAccounts");this.driveAccounts=s?.accounts??[]}catch{}if(this.driveAccounts&&this.driveAccounts.length>1){this._pendingBatchPaths=e,this.showDrivePicker=!0;return}const t=this.driveAccounts?.[0]?.email;await this._executeBatchDrive(e,t)}async _executeBatchDrive(e,t){this.driveUploading=!0,this.showToast(`Uploading ${e.length} files to Drive...`,"info",0);try{const s={filePaths:e};t&&(s.account=t);const n=await this.client?.request("files.batchPushToDrive",s);this.dismissAllToasts();const i=n?.results?.filter(o=>o.success).length??0,a=n?.results?.length??e.length;i===a?this.showToast(`Uploaded ${i} files to Google Drive`,"success",5e3):this.showToast(`Uploaded ${i}/${a} files (${a-i} failed)`,"warning",8e3)}catch(s){this.dismissAllToasts();const n=s instanceof Error?s.message:"Unknown error";this.showToast(`Batch Drive upload failed: ${n}`,"error",8e3)}finally{this.driveUploading=!1,this._pendingBatchPaths=void 0}}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}handleImageClick(e,t,s){this.lightbox=ih(e,t,s)}handleLightboxClose(){this.lightbox=ah()}handleLightboxNav(e){this.lightbox=oh(this.lightbox,e)}normalizeWorkspacePathCandidate(e,t={}){let s=e.trim();if(!s||s.startsWith("#"))return null;for(;s.startsWith("./");)s=s.slice(2);if(s=s.replaceAll("\\","/"),!t.allowAbsolute)for(;s.startsWith("/");)s=s.slice(1);return!s||s.includes("\0")?null:s}isAbsoluteFilesystemPath(e){return e.startsWith("/")||e.startsWith("~/")||/^[a-z]:[\\/]/i.test(e)}inferMimeTypeFromPath(e){if(!e)return null;const t=e.trim().toLowerCase();if(!t)return null;const s=t.split(".").pop()??"";return s?s==="md"||s==="markdown"||s==="mdx"?"text/markdown":s==="html"||s==="htm"?"text/html":s==="json"||s==="json5"?"application/json":s==="txt"||s==="text"||s==="log"?"text/plain":s==="svg"||s==="svgz"?"image/svg+xml":s==="avif"||s==="bmp"||s==="gif"||s==="heic"||s==="heif"||s==="jpeg"||s==="jpg"||s==="png"||s==="webp"?`image/${s==="jpg"?"jpeg":s}`:null:null}sidebarTitleForPath(e){const t=e.replaceAll("\\","/").trim();if(!t)return"Document";const s=t.split("/");return s[s.length-1]||t}async listWorkspaceIdsForPathResolution(){const e=[],t=new Set,s=n=>{if(typeof n!="string")return;const i=n.trim();!i||t.has(i)||(t.add(i),e.push(i))};s(this.selectedWorkspace?.id);for(const n of this.workspaces??[])s(n.id);if(e.length>0||!this.client||!this.connected)return e;try{const n=await this.client.request("workspaces.list",{});for(const i of n.workspaces??[])s(i.id)}catch{}return e}async openWorkspaceRelativeFileInViewer(e){if(!this.client||!this.connected)return!1;const t=await this.listWorkspaceIdsForPathResolution();for(const s of t)try{const n=await this.client.request("workspaces.readFile",{workspaceId:s,filePath:e});if(typeof n.content!="string")continue;return this.handleOpenSidebar(n.content,{mimeType:n.contentType??n.mime??this.inferMimeTypeFromPath(e),filePath:n.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}return!1}extractWorkspacePathCandidatesFromHref(e){const t=e.trim();if(!t)return[];const s=[],n=t.toLowerCase();if(n.startsWith("mailto:")||n.startsWith("tel:")||n.startsWith("javascript:")||n.startsWith("data:"))return[];if(t.startsWith("file://")){let m=t.slice(7);m.startsWith("/~/")&&(m="~"+m.slice(2));try{m=decodeURIComponent(m)}catch{}s.push(m);const r=[],f=new Set;for(const g of s){const v=this.normalizeWorkspacePathCandidate(g,{allowAbsolute:!0});!v||f.has(v)||(f.add(v),r.push(v))}return r}const i=/^[a-z][a-z0-9+.-]*:/i.test(t),a=/^[a-z]:[\\/]/i.test(t);(!i||a)&&s.push(t);let o=null;try{o=new URL(t,window.location.href)}catch{o=null}if(o&&/^https?:$/.test(o.protocol)&&o.origin===window.location.origin){for(const b of Uh){const _=o.searchParams.get(b);_&&s.push(_)}const r=(t.split("#")[0]??"").split("?")[0]??"";r.length>0&&!r.startsWith("/")&&!r.includes("://")&&s.push(r);let g=o.pathname;this.basePath&&g.startsWith(`${this.basePath}/`)?g=g.slice(this.basePath.length):this.basePath&&g===this.basePath&&(g="");const v=g.startsWith("/")?g.slice(1):g;if(v){s.push(v);const b=v.indexOf("/");if(b>0){const _=v.slice(0,b).toLowerCase();xn.has(_)&&s.push(v.slice(b+1))}}if(g.startsWith("/")&&v){const b=v.split("/")[0]?.toLowerCase()??"";xn.has(b)||s.push(g)}}const l=[],p=new Set;for(const m of s){let r=m;try{r=decodeURIComponent(m)}catch{}const f=this.normalizeWorkspacePathCandidate(r,{allowAbsolute:!0});!f||p.has(f)||(p.add(f),l.push(f))}return l}async openWorkspaceFileInViewer(e){if(!this.client||!this.connected)return!1;const t=this.isAbsoluteFilesystemPath(e);if(!t&&await this.openWorkspaceRelativeFileInViewer(e))return!0;try{const s=await this.client.request("workspaces.readFile",{path:e});if(typeof s.content=="string")return this.handleOpenSidebar(s.content,{mimeType:s.contentType??s.mime??this.inferMimeTypeFromPath(e),filePath:s.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}if(!t)return!1;try{const s=await this.client.request("files.read",{path:e,maxSize:1e6});return typeof s.content!="string"?!1:(this.handleOpenSidebar(s.content,{mimeType:this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0)}catch{return!1}}async handleOpenMessageFileLink(e){const t=this.extractWorkspacePathCandidatesFromHref(e);if(t.length===0)return!1;for(const s of t)if(await this.openWorkspaceFileInViewer(s))return!0;return!1}showToast(e,t="info",s=5e3,n){const i=Eh(e,t,s,n);this.toasts=Oh(this.toasts,i),s>0&&window.setTimeout(()=>{this.dismissToast(i.id)},s)}dismissToast(e){this.toasts=Mh(this.toasts,e)}dismissAllToasts(){this.toasts=[]}async handleMyDayRefresh(){await Ge(this),this._loadDecisionCards()}_loadDecisionCards(){w(()=>Promise.resolve().then(()=>xe),void 0,import.meta.url).then(async e=>{this.todayQueueResults=await e.loadTodayQueueResults(this)}).catch(()=>{})}async loadTodayQueueResults(){this._loadDecisionCards()}async handleMyDayTaskStatusChange(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,status:t,completedAt:t==="complete"?new Date().toISOString():null});const{loadTodayTasksWithQueueStatus:s}=await w(async()=>{const{loadTodayTasksWithQueueStatus:n}=await Promise.resolve().then(()=>xe);return{loadTodayTasksWithQueueStatus:n}},void 0,import.meta.url);await s(this)}catch(s){console.error("[MyDay] Failed to update task status:",s)}}async handleTodayCreateTask(e){if(!(!this.client||!this.connected))try{await this.client.request("tasks.create",{title:e,dueDate:K(),priority:"medium",source:"chat"});const{loadTodayTasksWithQueueStatus:t}=await w(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>xe);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await t(this)}catch(t){console.error("[MyDay] Failed to create task:",t),this.showToast("Failed to create task","error")}}handleTodayEditTask(e){this.todayEditingTaskId=e}async handleTodayUpdateTask(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,...t}),this.todayEditingTaskId=null;const{loadTodayTasksWithQueueStatus:s}=await w(async()=>{const{loadTodayTasksWithQueueStatus:n}=await Promise.resolve().then(()=>xe);return{loadTodayTasksWithQueueStatus:n}},void 0,import.meta.url);await s(this)}catch(s){console.error("[MyDay] Failed to update task:",s),this.showToast("Failed to update task","error")}}handleTodayToggleCompleted(){this.todayShowCompleted=!this.todayShowCompleted}async handleTodayViewTaskOutput(e){if(!(!this.client||!this.connected))try{const s=(await this.client.request("queue.list",{limit:100}))?.items?.find(a=>a.sourceTaskId===e);if(!s?.result?.outputPath){this.showToast("No output available for this task","info");return}const n=await this.client.request("queue.readOutput",{path:s.result.outputPath}),i=s.result.outputPath.split("/").pop()??"Agent Output";this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:s.result.outputPath,title:i})}catch(t){console.error("[Tasks] View output failed:",t),this.showToast("Failed to load agent output","error")}}async handleTodayStartTask(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e}),s=t?.sessionId??t?.sessionKey;if(s){if(t.task?.title){const{autoTitleCache:a}=await w(async()=>{const{autoTitleCache:l}=await import("./ctrl-settings-rEJlXhcU.js").then(p=>p.ad);return{autoTitleCache:l}},[],import.meta.url);a.set(s,t.task.title);const{hostPatchSession:o}=await w(async()=>{const{hostPatchSession:l}=await Promise.resolve().then(()=>Xl);return{hostPatchSession:l}},void 0,import.meta.url);o(this.client,s,t.task.title)}this.setTab("chat"),this.sessionKey=s;const n=this.settings.openTabs.includes(s)?this.settings.openTabs:[...this.settings.openTabs,s];this.applySettings({...this.settings,sessionKey:s,lastActiveSessionKey:s,openTabs:n}),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:i}=await w(async()=>{const{loadChatHistory:a}=await Promise.resolve().then(()=>te);return{loadChatHistory:a}},void 0,import.meta.url);await i(this),this.loadSessionResources(),t.queueOutput&&this.chatMessages.length===0&&this.seedSessionWithAgentOutput(t.task?.title??"this task",t.queueOutput,t.agentPrompt??void 0),this.requestUpdate()}}catch(t){console.error("[MyDay] Failed to open session for task:",t),this.showToast("Failed to open session for task","error")}}handleDatePrev(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()-1),this.todaySelectedDate=K(e),Ce(this)}handleDateNext(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()+1);const t=K(),s=K(e);s>t||(this.todaySelectedDate=s,Ce(this))}handleDateToday(){this.todaySelectedDate=K(),Ge(this)}async handleDailyBriefRefresh(){await Ce(this)}async handleDailyBriefGenerate(){if(!(!this.client||!this.connected)){this.dailyBriefLoading=!0;try{await this.client.request("dailyBrief.generate",{}),await Ce(this)}catch(e){this.dailyBriefError=e instanceof Error?e.message:"Failed to generate brief"}finally{this.dailyBriefLoading=!1}}}handleDailyBriefOpenInObsidian(){const e=this.dailyBrief?.date;Ci(e)}async loadBriefNotes(){if(!this.client||!this.connected)return;const e=this.todaySelectedDate;try{const t=await this.client.request("briefNotes.get",{date:e});this.briefNotes=t.notes??{}}catch(t){console.error("[BriefNotes] Load error:",t),this.briefNotes={}}}async handleBriefNoteSave(e,t){if(!this.client||!this.connected)return;const s=this.todaySelectedDate;try{const n=await this.client.request("briefNotes.update",{date:s,section:e,text:t});this.briefNotes=n.notes??{}}catch(n){console.error("[BriefNotes] Save error:",n),this.showToast("Failed to save note","error")}}handleTodayViewModeChange(e){this.todayViewMode=e}handlePrivateModeToggle(){if(this.chatPrivateMode){const e=this.sessionKey;this.chatPrivateMode=!1,this._destroyPrivateSession(e),this.showToast("Private session destroyed","info",2e3);return}this.chatPrivateMode=!0,this.setTab("chat"),w(async()=>{const{createNewSession:e}=await Promise.resolve().then(()=>ie);return{createNewSession:e}},void 0,import.meta.url).then(({createNewSession:e})=>{e(this);const t=Date.now()+1440*60*1e3;this.privateSessions=new Map(this.privateSessions).set(this.sessionKey,t),this._persistPrivateSessions(),this._startPrivateSessionTimer(),this.client&&this.connected&&this.client.request("session.setPrivate",{sessionKey:this.sessionKey,enabled:!0}).catch(()=>{}),this.chatMessages=[{role:"assistant",content:`This is a **private session**. Nothing will be saved to memory or logs.

This session self-destructs when you close it or in **24 hours** — whichever comes first.`,timestamp:Date.now()}],this.requestUpdate()}),this.showToast("Private session created — 24h countdown started","info",3e3)}async _destroyPrivateSession(e){const t=new Map(this.privateSessions);if(t.delete(e),this.privateSessions=t,this._persistPrivateSessions(),this.sessionKey===e){this.chatPrivateMode=!1;const s=this.settings.openTabs.filter(i=>i!==e),n=s[0]||M;this.applySettings({...this.settings,openTabs:s,sessionKey:n,lastActiveSessionKey:n}),this.sessionKey=n,(await w(async()=>{const{loadChatHistory:i}=await Promise.resolve().then(()=>te);return{loadChatHistory:i}},void 0,import.meta.url)).loadChatHistory(this)}else this.applySettings({...this.settings,openTabs:this.settings.openTabs.filter(s=>s!==e)});this.client&&this.connected&&(this.client.request("session.setPrivate",{sessionKey:e,enabled:!1}).catch(()=>{}),this.client.request("sessions.delete",{key:e,deleteTranscript:!0}).catch(()=>{})),this.privateSessions.size===0&&this._stopPrivateSessionTimer()}_persistPrivateSessions(){const e=Array.from(this.privateSessions.entries());e.length===0?localStorage.removeItem("godmode.privateSessions"):localStorage.setItem("godmode.privateSessions",JSON.stringify(e))}_restorePrivateSessions(){try{const e=localStorage.getItem("godmode.privateSessions");if(!e)return;const t=JSON.parse(e),s=Date.now(),n=t.filter(([,i])=>i>s);if(this.privateSessions=new Map(n),n.length!==t.length){const i=t.filter(([,a])=>a<=s);for(const[a]of i)this._destroyPrivateSession(a)}this.privateSessions.size>0&&(this.privateSessions.has(this.sessionKey)&&(this.chatPrivateMode=!0),this._startPrivateSessionTimer()),this._persistPrivateSessions()}catch{localStorage.removeItem("godmode.privateSessions")}}_startPrivateSessionTimer(){this._privateSessionTimer||(this._privateSessionTimer=setInterval(()=>{const e=Date.now();for(const[t,s]of this.privateSessions)s<=e&&(this._destroyPrivateSession(t),this.showToast("Private session expired and was destroyed","info",3e3));this.privateSessions.size>0&&this.requestUpdate()},3e4))}_stopPrivateSessionTimer(){this._privateSessionTimer&&(clearInterval(this._privateSessionTimer),this._privateSessionTimer=null)}async handleBriefSave(e){if(!this.client||!this.connected)return;const t=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.update",{date:t,content:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(s){console.error("[DailyBrief] Save error:",s),this.showToast("Failed to save brief","error")}}async handleBriefToggleCheckbox(e,t){if(!this.client||!this.connected)return;const s=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.toggleCheckbox",{date:s,index:e,checked:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(n){console.error("[DailyBrief] Checkbox toggle error:",n),this.showToast("Failed to toggle checkbox","error")}}async handleWorkRefresh(){await Promise.all([xi(this),Pi(this)])}async handleResourcePin(e,t){await $c(this,e,t)}async handleResourceDelete(e){await Cc(this,e)}handleResourceFilterChange(e){this.workResourceFilter=e}handleResourceClick(e){e.path?this.handleWorkFileClick(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}async loadSessionResources(){if(!(!this.client||!this.connected))try{const t=(await this.client.request("resources.list",{sessionKey:this.sessionKey,limit:20})).resources??[],s=new Set(t.filter(n=>n.proofSlug).map(n=>n.proofSlug));if(this.chatMessages?.length)for(const n of this.chatMessages){const i=n,a=Array.isArray(i.content)?i.content:[];for(const o of a){const l=typeof o.text=="string"?o.text:typeof o.content=="string"?o.content:null;if(l)try{const p=JSON.parse(l);p._sidebarAction?.type==="proof"&&p._sidebarAction.slug&&!s.has(p._sidebarAction.slug)&&(s.add(p._sidebarAction.slug),t.unshift({id:`proof:${p._sidebarAction.slug}`,title:p.title??"Proof Document",type:"doc",path:p.filePath,sessionKey:this.sessionKey,proofSlug:p._sidebarAction.slug}))}catch{}}}this.sessionResources=t}catch(e){console.warn("[SessionResources] load failed:",e),this.sessionResources=[]}}handleSessionResourceClick(e){e.proofSlug?this.handleOpenProofDoc(e.proofSlug):e.path?this.handleOpenFile(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}handleToggleSessionResources(){this.sessionResourcesCollapsed=!this.sessionResourcesCollapsed}handleViewAllResources(){this.setTab("work")}handleWorkToggleProject(e){const t=new Set(this.workExpandedProjects);t.has(e)?t.delete(e):(t.add(e),this.workProjectFiles[e]||Ac(this,e)),this.workExpandedProjects=t}async handleWorkFileClick(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("workspaces.readFile",{path:e});if(!t.content){this.showToast(t.error??"Failed to read file","error");return}this.handleOpenSidebar(t.content,{mimeType:t.contentType??t.mime??this.inferMimeTypeFromPath(e),filePath:t.path??e,title:this.sidebarTitleForPath(e)})}catch(t){console.error("[Work] Failed to read file:",t),this.showToast(`Failed to open: ${e}`,"error")}}handleWorkSkillClick(e,t){this.handleStartChatWithPrompt(`Tell me about the "${e}" skill and how it's used in the ${t} project.`)}handlePeopleImport(e){const t=e==="apple"?"Import my contacts from Apple Contacts and organize them into categories.":"Import my contacts from Google Contacts and organize them into categories.";this.handleStartChatWithPrompt(t)}async handleWorkspacesRefresh(){await rt(this)}async handleWorkspaceBrowse(e){if(!this.selectedWorkspace)return;const{browseWorkspaceFolder:t}=await w(async()=>{const{browseWorkspaceFolder:n}=await Promise.resolve().then(()=>qe);return{browseWorkspaceFolder:n}},void 0,import.meta.url),s=await t(this,this.selectedWorkspace.id,e);s&&(this.workspaceBrowsePath=e,this.workspaceBrowseEntries=s.entries,this.workspaceBreadcrumbs=s.breadcrumbs)}async handleWorkspaceBrowseSearch(e){if(this.workspaceBrowseSearchQuery=e,!e.trim()||!this.selectedWorkspace){this.workspaceBrowseSearchResults=null;return}const{searchWorkspaceFiles:t}=await w(async()=>{const{searchWorkspaceFiles:s}=await Promise.resolve().then(()=>qe);return{searchWorkspaceFiles:s}},void 0,import.meta.url);this.workspaceBrowseSearchResults=await t(this,this.selectedWorkspace.id,e)}handleWorkspaceBrowseBack(){this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null}async handleWorkspaceCreateFolder(e){if(!this.selectedWorkspace)return;const{createWorkspaceFolder:t}=await w(async()=>{const{createWorkspaceFolder:n}=await Promise.resolve().then(()=>qe);return{createWorkspaceFolder:n}},void 0,import.meta.url),s=await t(this,this.selectedWorkspace.id,e);s&&this.workspaceBrowsePath&&await this.handleWorkspaceBrowse(this.workspaceBrowsePath),s&&this.showToast("Folder created","success",2e3)}handleOnboardingStart(){this.onboardingPhase=1,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:1}),this.client?.request("onboarding.update",{phase:1,completePhase:0})}async handleOnboardingIdentitySubmit(e){if(this.client)try{await this.client.request("onboarding.update",{phase:2,completePhase:1,identity:e}),this.onboardingPhase=2,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:2,identity:e}),this.userName=e.name,this.userAvatar=e.emoji,this.applySettings({...this.settings,userName:e.name,userAvatar:e.emoji}),this.setTab("chat"),w(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>ie);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this);const s=`I just set up my GodMode identity. My name is ${e.name}${e.mission?` and my mission is: ${e.mission}`:""}. Let's set up my workspace.`;this.chatMessage=s,this.handleSendChat(s)})}catch(t){console.error("[Onboarding] Identity submit failed:",t),this.showToast("Failed to save identity","error")}}handleOnboardingSkipPhase(){if(!this.client)return;const e=Math.min(this.onboardingPhase+1,6);this.onboardingPhase=e,this.client.request("onboarding.update",{phase:e,completePhase:this.onboardingPhase})}handleOnboardingComplete(){this.onboardingActive=!1,this.onboardingPhase=6,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:6,completedAt:new Date().toISOString()}),this.client?.request("onboarding.complete",{summary:this.onboardingData?.summary??null}),this.showToast("Welcome to GodMode!","success",4e3)}handleStartChatWithPrompt(e){this.setTab("chat"),w(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>ie);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this),this.chatMessage=e,this.requestUpdate()})}handleOpenSupportChat(){const e="agent:main:support";if(this.sessionKey===e){this.setTab("chat");return}w(async()=>{const{saveDraft:n}=await Promise.resolve().then(()=>Tt);return{saveDraft:n}},void 0,import.meta.url).then(({saveDraft:n})=>n(this));const s=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:s,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),w(async()=>{const{autoTitleCache:n}=await import("./ctrl-settings-rEJlXhcU.js").then(i=>i.ad);return{autoTitleCache:n}},[],import.meta.url).then(({autoTitleCache:n})=>{n.set(e,"Support")}),w(async()=>{const{loadChatHistory:n}=await Promise.resolve().then(()=>te);return{loadChatHistory:n}},void 0,import.meta.url).then(({loadChatHistory:n})=>{n(this).then(()=>{this.loadSessionResources(),this.chatMessages.length===0&&this.sessionKey===e&&(this.chatMessages=[{role:"assistant",content:`**Welcome to GodMode Support**

I have full access to your system diagnostics and GodMode knowledge base. I can help with:

- Troubleshooting issues
- Feature questions and configuration
- Setup guidance
- Escalation to the team if needed

What can I help you with?`,timestamp:Date.now()}],this.requestUpdate())}).catch(i=>{console.error("[Support] Failed to load chat history:",i)})})}handleWizardOpen(){w(async()=>{const{emptyWizardState:e}=await import("./views-settings-Dbe7GjNl.js").then(t=>t.C);return{emptyWizardState:e}},__vite__mapDeps([4,1,3,5]),import.meta.url).then(({emptyWizardState:e})=>{this.wizardState=e(),this.wizardActive=!0,this.requestUpdate()})}handleWizardClose(){this.wizardActive=!1,this.wizardState=null,this.requestUpdate()}handleWizardStepChange(e){this.wizardState&&(this.wizardState={...this.wizardState,step:e},this.requestUpdate())}handleWizardAnswerChange(e,t){this.wizardState&&(this.wizardState={...this.wizardState,answers:{...this.wizardState.answers,[e]:t}},this.requestUpdate())}async handleWizardPreview(){if(!(!this.client||!this.wizardState))try{const[e,t]=await Promise.all([this.client.request("onboarding.wizard.preview",this.wizardState.answers),this.client.request("onboarding.wizard.diff",this.wizardState.answers).catch(()=>null)]),s={};for(const i of e.files??[])s[i.path]=i.wouldCreate;const n={};if(t){for(const i of t.additions)n[i.path]=!0;for(const i of t.changes)n[i.path]=!1}this.wizardState={...this.wizardState,preview:e.files??[],diff:t,fileSelections:s,configSelections:n},this.requestUpdate()}catch(e){console.error("[Wizard] Preview failed:",e)}}handleWizardFileToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,fileSelections:{...this.wizardState.fileSelections,[e]:t}},this.requestUpdate())}handleWizardConfigToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,configSelections:{...this.wizardState.configSelections,[e]:t}},this.requestUpdate())}async handleWizardGenerate(){if(!this.client||!this.wizardState)return;this.wizardState={...this.wizardState,generating:!0,error:null},this.requestUpdate();const e=[];for(const[s,n]of Object.entries(this.wizardState.fileSelections))n||e.push(s);const t=[];for(const[s,n]of Object.entries(this.wizardState.configSelections))n||t.push(s);try{const s=await this.client.request("onboarding.wizard.generate",{...this.wizardState.answers,skipFiles:e,skipKeys:t});this.wizardState={...this.wizardState,generating:!1,step:9,result:{filesCreated:s.filesCreated,filesSkipped:s.filesSkipped,configPatched:s.configPatched,workspacePath:s.workspacePath}},this.requestUpdate(),this.showToast("Memory system generated!","success",4e3)}catch(s){const n=s instanceof Error?s.message:"Failed to generate workspace";this.wizardState={...this.wizardState,generating:!1,error:n},this.requestUpdate(),this.showToast(n,"error")}}async handleQuickSetup(e){w(()=>import("./setup-CWjMtnE4.js"),[],import.meta.url).then(async({quickSetup:t})=>{await t(this,e)&&(this.setTab("chat"),w(async()=>{const{loadCapabilities:n}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:n}},[],import.meta.url).then(({loadCapabilities:n})=>n(this)))})}handleLoadCapabilities(){w(async()=>{const{loadCapabilities:e}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:e}},[],import.meta.url).then(({loadCapabilities:e})=>e(this))}handleCapabilityAction(e){w(async()=>{const{capabilityAction:t}=await import("./setup-CWjMtnE4.js");return{capabilityAction:t}},[],import.meta.url).then(({capabilityAction:t})=>t(this,e))}handleHideSetup(){w(async()=>{const{hideSetup:e}=await import("./setup-CWjMtnE4.js");return{hideSetup:e}},[],import.meta.url).then(({hideSetup:e})=>e(this))}handleRunAssessment(){this.client&&this.client.request("onboarding.assess",{}).then(()=>{this.handleLoadCapabilities()})}handleUpdateUserProfile(e,t){const s=e.trim().slice(0,50),n=t.trim();this.userName=s||"You",this.userAvatar=n||null,this.applySettings({...this.settings,userName:s,userAvatar:n})}async handleLoadIntegrations(){await(await w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadIntegrations(this)}handleExpandCard(e){w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.expandCard(this,e))}async handleLoadGuide(e){await(await w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadGuide(this,e)}async handleTestIntegration(e){await(await w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).testIntegration(this,e)}async handleConfigureIntegration(e,t){await(await w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).configureIntegration(this,e,t)}handleUpdateConfigValue(e,t){this.onboardingConfigValues={...this.onboardingConfigValues,[e]:t}}handleSkipIntegration(e){w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.skipIntegration(this,e))}async handleMarkOnboardingComplete(){if(!(!this.client||!this.connected))try{await this.client.request("onboarding.complete",{}),this.godmodeOptions&&(this.godmodeOptions={...this.godmodeOptions,"onboarding.complete":!0}),this.showSetupTab=!1,this.setTab("chat")}catch(e){console.error("[onboarding] Failed to mark complete:",e)}}async handleInboxRefresh(){if(!(!this.client||!this.connected)){this.inboxLoading=!0;try{const e=await this.client.request("inbox.list",{status:"pending",limit:50});this.inboxItems=e.items,this.inboxCount=e.pendingCount}catch(e){console.error("[Inbox] Failed to load:",e)}finally{this.inboxLoading=!1}}}async handleInboxScore(e,t,s){if(!(!this.client||!this.connected))try{await this.client.request("inbox.score",{itemId:e,score:t,feedback:s}),this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,await this.handleInboxRefresh()}catch(n){console.error("[Inbox] Score failed:",n)}}async handleInboxDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("inbox.dismiss",{itemId:e}),await this.handleInboxRefresh()}catch(t){console.error("[Inbox] Dismiss failed:",t)}}async handleInboxMarkAll(){if(!(!this.client||!this.connected))try{await this.client.request("inbox.markAllComplete",{}),await this.handleInboxRefresh()}catch(e){console.error("[Inbox] Mark all failed:",e)}}async handleInboxViewOutput(e){const t=this.inboxItems?.find(s=>s.id===e);if(t){if(t.outputPath&&this.client)try{const s=await this.client.request("files.read",{path:t.outputPath,maxSize:5e5});if(s?.content){this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:t.outputPath,title:t.title});return}}catch(s){console.error("[Inbox] Failed to load output file:",s)}t.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}}async handleInboxViewProof(e){const t=this.inboxItems?.find(s=>s.id===e);t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}handleInboxOpenChat(e){const t=this.inboxItems?.find(s=>s.id===e);if(t?.type==="project-completion"&&t.coworkSessionId){this.setSessionKey(t.coworkSessionId),this.setTab("chat"),t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug);return}if(t?.source.taskId){this.handleMissionControlOpenTaskSession(t.source.taskId);return}t?.sessionId&&(this.setSessionKey(t.sessionId),this.setTab("chat"))}handleInboxSetScoring(e,t){e!==this.inboxScoringId&&(this.inboxFeedbackText=""),this.inboxScoringId=e,this.inboxScoringValue=t??7}handleInboxFeedbackChange(e){this.inboxFeedbackText=e}handleInboxSortToggle(){this.inboxSortOrder=this.inboxSortOrder==="newest"?"oldest":"newest"}async handleTrustDailyRate(e){if(this.client)try{await this.client.request("trust.dailyRate",{rating:e}),this.trustSummary&&(this.trustSummary={...this.trustSummary,todayRated:!0})}catch(t){console.error("[Trust] Daily rate failed:",t),this.showToast("Failed to submit daily rating","error")}}async handleOpenProofDoc(e){let t="Proof Document",s=null,n=null;if(this.client&&this.connected)try{const i=await this.client.request("proof.get",{slug:e});t=i.title?.trim()||t,s=i.filePath?.trim()||null,n=i.viewUrl?.trim()||null}catch(i){console.warn("[Proof] Failed to resolve document metadata:",i)}this.sidebarOpen=!0,this.sidebarMode="proof",this.sidebarProofSlug=e,this.sidebarProofUrl=n,this.sidebarProofHtml=null,this.sidebarFilePath=s,this.sidebarTitle=t}handleCloseProofDoc(){this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.handleCloseSidebar()}render(){return Sh(this)}};u([ao({context:Po}),h()],d.prototype,"_ctx",2);u([h()],d.prototype,"settings",2);u([h()],d.prototype,"password",2);u([h()],d.prototype,"tab",2);u([h()],d.prototype,"onboarding",2);u([h()],d.prototype,"connected",2);u([h()],d.prototype,"reconnecting",2);u([h()],d.prototype,"reconnectAttempt",2);u([h()],d.prototype,"theme",2);u([h()],d.prototype,"themeResolved",2);u([h()],d.prototype,"hello",2);u([h()],d.prototype,"lastError",2);u([h()],d.prototype,"eventLog",2);u([h()],d.prototype,"assistantName",2);u([h()],d.prototype,"assistantAvatar",2);u([h()],d.prototype,"assistantAgentId",2);u([h()],d.prototype,"userName",2);u([h()],d.prototype,"userAvatar",2);u([h()],d.prototype,"sessionKey",2);u([h()],d.prototype,"sessionPickerOpen",2);u([h()],d.prototype,"sessionPickerPosition",2);u([h()],d.prototype,"sessionPickerSearch",2);u([h()],d.prototype,"sessionSearchOpen",2);u([h()],d.prototype,"sessionSearchPosition",2);u([h()],d.prototype,"sessionSearchQuery",2);u([h()],d.prototype,"sessionSearchResults",2);u([h()],d.prototype,"sessionSearchLoading",2);u([h()],d.prototype,"profilePopoverOpen",2);u([h()],d.prototype,"profileEditName",2);u([h()],d.prototype,"profileEditAvatar",2);u([h()],d.prototype,"editingTabKey",2);u([h()],d.prototype,"chatLoading",2);u([h()],d.prototype,"chatSending",2);u([h()],d.prototype,"chatSendingSessionKey",2);u([h()],d.prototype,"chatMessage",2);u([h()],d.prototype,"chatDrafts",2);u([h()],d.prototype,"chatMessages",2);u([h()],d.prototype,"chatToolMessages",2);u([h()],d.prototype,"chatStream",2);u([h()],d.prototype,"chatStreamStartedAt",2);u([h()],d.prototype,"chatRunId",2);u([h()],d.prototype,"currentToolName",2);u([h()],d.prototype,"currentToolInfo",2);u([h()],d.prototype,"workingSessions",2);u([h()],d.prototype,"compactionStatus",2);u([h()],d.prototype,"chatAvatarUrl",2);u([h()],d.prototype,"chatThinkingLevel",2);u([h()],d.prototype,"chatQueue",2);u([h()],d.prototype,"chatAttachments",2);u([h()],d.prototype,"pendingRetry",2);u([h()],d.prototype,"autoRetryAfterCompact",2);u([h()],d.prototype,"sidebarOpen",2);u([h()],d.prototype,"sidebarContent",2);u([h()],d.prototype,"sidebarError",2);u([h()],d.prototype,"sidebarMimeType",2);u([h()],d.prototype,"sidebarFilePath",2);u([h()],d.prototype,"sidebarTitle",2);u([h()],d.prototype,"sidebarMode",2);u([h()],d.prototype,"sidebarProofSlug",2);u([h()],d.prototype,"sidebarProofUrl",2);u([h()],d.prototype,"sidebarProofHtml",2);u([h()],d.prototype,"splitRatio",2);u([h()],d.prototype,"lightbox",2);u([h()],d.prototype,"driveAccounts",2);u([h()],d.prototype,"showDrivePicker",2);u([h()],d.prototype,"driveUploading",2);u([h()],d.prototype,"updateStatus",2);u([h()],d.prototype,"updateLoading",2);u([h()],d.prototype,"updateError",2);u([h()],d.prototype,"updateLastChecked",2);u([h()],d.prototype,"nodesLoading",2);u([h()],d.prototype,"nodes",2);u([h()],d.prototype,"devicesLoading",2);u([h()],d.prototype,"devicesError",2);u([h()],d.prototype,"devicesList",2);u([h()],d.prototype,"execApprovalsLoading",2);u([h()],d.prototype,"execApprovalsSaving",2);u([h()],d.prototype,"execApprovalsDirty",2);u([h()],d.prototype,"execApprovalsSnapshot",2);u([h()],d.prototype,"execApprovalsForm",2);u([h()],d.prototype,"execApprovalsSelectedAgent",2);u([h()],d.prototype,"execApprovalsTarget",2);u([h()],d.prototype,"execApprovalsTargetNodeId",2);u([h()],d.prototype,"execApprovalQueue",2);u([h()],d.prototype,"execApprovalBusy",2);u([h()],d.prototype,"execApprovalError",2);u([h()],d.prototype,"pendingGatewayUrl",2);u([h()],d.prototype,"gatewayRestartPending",2);u([h()],d.prototype,"gatewayRestartBusy",2);u([h()],d.prototype,"deployPanelOpen",2);u([h()],d.prototype,"configLoading",2);u([h()],d.prototype,"configRaw",2);u([h()],d.prototype,"configRawOriginal",2);u([h()],d.prototype,"configValid",2);u([h()],d.prototype,"configIssues",2);u([h()],d.prototype,"configSaving",2);u([h()],d.prototype,"configApplying",2);u([h()],d.prototype,"updateRunning",2);u([h()],d.prototype,"applySessionKey",2);u([h()],d.prototype,"configSnapshot",2);u([h()],d.prototype,"configSchema",2);u([h()],d.prototype,"configSchemaVersion",2);u([h()],d.prototype,"configSchemaLoading",2);u([h()],d.prototype,"configUiHints",2);u([h()],d.prototype,"configForm",2);u([h()],d.prototype,"configFormOriginal",2);u([h()],d.prototype,"configFormDirty",2);u([h()],d.prototype,"configFormMode",2);u([h()],d.prototype,"configSearchQuery",2);u([h()],d.prototype,"configActiveSection",2);u([h()],d.prototype,"configActiveSubsection",2);u([h()],d.prototype,"channelsLoading",2);u([h()],d.prototype,"channelsSnapshot",2);u([h()],d.prototype,"channelsError",2);u([h()],d.prototype,"channelsLastSuccess",2);u([h()],d.prototype,"whatsappLoginMessage",2);u([h()],d.prototype,"whatsappLoginQrDataUrl",2);u([h()],d.prototype,"whatsappLoginConnected",2);u([h()],d.prototype,"whatsappBusy",2);u([h()],d.prototype,"nostrProfileFormState",2);u([h()],d.prototype,"nostrProfileAccountId",2);u([h()],d.prototype,"presenceLoading",2);u([h()],d.prototype,"presenceEntries",2);u([h()],d.prototype,"presenceError",2);u([h()],d.prototype,"presenceStatus",2);u([h()],d.prototype,"agentsLoading",2);u([h()],d.prototype,"agentsList",2);u([h()],d.prototype,"agentsError",2);u([h()],d.prototype,"sessionsLoading",2);u([h()],d.prototype,"sessionsResult",2);u([h()],d.prototype,"sessionsError",2);u([h()],d.prototype,"sessionsFilterActive",2);u([h()],d.prototype,"sessionsFilterLimit",2);u([h()],d.prototype,"sessionsIncludeGlobal",2);u([h()],d.prototype,"sessionsIncludeUnknown",2);u([h()],d.prototype,"archivedSessions",2);u([h()],d.prototype,"archivedSessionsLoading",2);u([h()],d.prototype,"archivedSessionsExpanded",2);u([h()],d.prototype,"cronLoading",2);u([h()],d.prototype,"cronJobs",2);u([h()],d.prototype,"cronStatus",2);u([h()],d.prototype,"cronError",2);u([h()],d.prototype,"cronForm",2);u([h()],d.prototype,"cronRunsJobId",2);u([h()],d.prototype,"cronRuns",2);u([h()],d.prototype,"cronBusy",2);u([h()],d.prototype,"workspaceNeedsSetup",2);u([h()],d.prototype,"onboardingPhase",2);u([h()],d.prototype,"onboardingData",2);u([h()],d.prototype,"onboardingActive",2);u([h()],d.prototype,"wizardActive",2);u([h()],d.prototype,"wizardState",2);u([h()],d.prototype,"showSetupTab",2);u([h()],d.prototype,"setupCapabilities",2);u([h()],d.prototype,"setupCapabilitiesLoading",2);u([h()],d.prototype,"setupQuickDone",2);u([h()],d.prototype,"onboardingIntegrations",2);u([h()],d.prototype,"onboardingCoreProgress",2);u([h()],d.prototype,"onboardingExpandedCard",2);u([h()],d.prototype,"onboardingLoadingGuide",2);u([h()],d.prototype,"onboardingActiveGuide",2);u([h()],d.prototype,"onboardingTestingId",2);u([h()],d.prototype,"onboardingTestResult",2);u([h()],d.prototype,"onboardingConfigValues",2);u([h()],d.prototype,"onboardingProgress",2);u([h()],d.prototype,"workspaces",2);u([h()],d.prototype,"selectedWorkspace",2);u([h()],d.prototype,"workspacesSearchQuery",2);u([h()],d.prototype,"workspaceItemSearchQuery",2);u([h()],d.prototype,"workspacesLoading",2);u([h()],d.prototype,"workspacesCreateLoading",2);u([h()],d.prototype,"workspacesError",2);u([h()],d.prototype,"workspaceExpandedFolders",2);u([h()],d.prototype,"allTasks",2);u([h()],d.prototype,"taskFilter",2);u([h()],d.prototype,"taskSort",2);u([h()],d.prototype,"taskSearch",2);u([h()],d.prototype,"showCompletedTasks",2);u([h()],d.prototype,"editingTaskId",2);u([h()],d.prototype,"workspaceBrowsePath",2);u([h()],d.prototype,"workspaceBrowseEntries",2);u([h()],d.prototype,"workspaceBreadcrumbs",2);u([h()],d.prototype,"workspaceBrowseSearchQuery",2);u([h()],d.prototype,"workspaceBrowseSearchResults",2);u([h()],d.prototype,"myDayLoading",2);u([h()],d.prototype,"myDayError",2);u([h()],d.prototype,"todaySelectedDate",2);u([h()],d.prototype,"todayViewMode",2);u([h()],d.prototype,"dailyBrief",2);u([h()],d.prototype,"dailyBriefLoading",2);u([h()],d.prototype,"dailyBriefError",2);u([h()],d.prototype,"agentLog",2);u([h()],d.prototype,"agentLogLoading",2);u([h()],d.prototype,"agentLogError",2);u([h()],d.prototype,"briefNotes",2);u([h()],d.prototype,"todayTasks",2);u([h()],d.prototype,"todayTasksLoading",2);u([h()],d.prototype,"todayEditingTaskId",2);u([h()],d.prototype,"todayShowCompleted",2);u([h()],d.prototype,"allyPanelOpen",2);u([h()],d.prototype,"allyMessages",2);u([h()],d.prototype,"allyStream",2);u([h()],d.prototype,"allyDraft",2);u([h()],d.prototype,"allyUnread",2);u([h()],d.prototype,"allySending",2);u([h()],d.prototype,"allyWorking",2);u([h()],d.prototype,"allyAttachments",2);u([h()],d.prototype,"todayQueueResults",2);u([h()],d.prototype,"inboxItems",2);u([h()],d.prototype,"inboxLoading",2);u([h()],d.prototype,"inboxCount",2);u([h()],d.prototype,"inboxScoringId",2);u([h()],d.prototype,"inboxScoringValue",2);u([h()],d.prototype,"inboxFeedbackText",2);u([h()],d.prototype,"inboxSortOrder",2);u([h()],d.prototype,"trustSummary",2);u([h()],d.prototype,"chatPrivateMode",2);u([h()],d.prototype,"privateSessions",2);u([h()],d.prototype,"dynamicSlots",2);u([h()],d.prototype,"workProjects",2);u([h()],d.prototype,"workLoading",2);u([h()],d.prototype,"workError",2);u([h()],d.prototype,"workExpandedProjects",2);u([h()],d.prototype,"workProjectFiles",2);u([h()],d.prototype,"workDetailLoading",2);u([h()],d.prototype,"workResources",2);u([h()],d.prototype,"workResourcesLoading",2);u([h()],d.prototype,"workResourceFilter",2);u([h()],d.prototype,"sessionResources",2);u([h()],d.prototype,"sessionResourcesCollapsed",2);u([h()],d.prototype,"skillsLoading",2);u([h()],d.prototype,"skillsReport",2);u([h()],d.prototype,"skillsError",2);u([h()],d.prototype,"skillsFilter",2);u([h()],d.prototype,"skillEdits",2);u([h()],d.prototype,"skillsBusyKey",2);u([h()],d.prototype,"skillMessages",2);u([h()],d.prototype,"skillsSubTab",2);u([h()],d.prototype,"godmodeSkills",2);u([h()],d.prototype,"godmodeSkillsLoading",2);u([h()],d.prototype,"expandedSkills",2);u([h()],d.prototype,"rosterData",2);u([h()],d.prototype,"rosterLoading",2);u([h()],d.prototype,"rosterError",2);u([h()],d.prototype,"rosterFilter",2);u([h()],d.prototype,"expandedAgents",2);u([h()],d.prototype,"debugLoading",2);u([h()],d.prototype,"debugStatus",2);u([h()],d.prototype,"debugHealth",2);u([h()],d.prototype,"debugModels",2);u([h()],d.prototype,"debugHeartbeat",2);u([h()],d.prototype,"debugCallMethod",2);u([h()],d.prototype,"debugCallParams",2);u([h()],d.prototype,"debugCallResult",2);u([h()],d.prototype,"debugCallError",2);u([h()],d.prototype,"logsLoading",2);u([h()],d.prototype,"logsError",2);u([h()],d.prototype,"logsFile",2);u([h()],d.prototype,"logsEntries",2);u([h()],d.prototype,"logsFilterText",2);u([h()],d.prototype,"logsLevelFilters",2);u([h()],d.prototype,"logsAutoFollow",2);u([h()],d.prototype,"logsTruncated",2);u([h()],d.prototype,"logsCursor",2);u([h()],d.prototype,"logsLastFetchAt",2);u([h()],d.prototype,"logsLimit",2);u([h()],d.prototype,"logsMaxBytes",2);u([h()],d.prototype,"logsAtBottom",2);u([h()],d.prototype,"toasts",2);u([h()],d.prototype,"chatUserNearBottom",2);u([h()],d.prototype,"chatNewMessagesBelow",2);u([h()],d.prototype,"consciousnessStatus",2);u([h()],d.prototype,"focusPulseData",2);u([h()],d.prototype,"trustTrackerData",2);u([h()],d.prototype,"trustTrackerLoading",2);u([h()],d.prototype,"guardrailsData",2);u([h()],d.prototype,"guardrailsLoading",2);u([h()],d.prototype,"guardrailsShowAddForm",2);u([h()],d.prototype,"missionControlData",2);u([h()],d.prototype,"missionControlLoading",2);u([h()],d.prototype,"missionControlError",2);u([h()],d.prototype,"missionControlFullControl",2);u([h()],d.prototype,"godmodeOptions",2);u([h()],d.prototype,"godmodeOptionsLoading",2);u([h()],d.prototype,"dashboardsList",2);u([h()],d.prototype,"dashboardsLoading",2);u([h()],d.prototype,"dashboardsError",2);u([h()],d.prototype,"activeDashboardId",2);u([h()],d.prototype,"activeDashboardHtml",2);u([h()],d.prototype,"activeDashboardManifest",2);u([h()],d.prototype,"dashboardChatOpen",2);u([h()],d.prototype,"dashboardCategoryFilter",2);u([h()],d.prototype,"secondBrainSubtab",2);u([h()],d.prototype,"secondBrainLoading",2);u([h()],d.prototype,"secondBrainError",2);u([h()],d.prototype,"secondBrainIdentity",2);u([h()],d.prototype,"secondBrainMemoryBank",2);u([h()],d.prototype,"secondBrainAiPacket",2);u([h()],d.prototype,"secondBrainSourcesData",2);u([h()],d.prototype,"secondBrainResearchData",2);u([h()],d.prototype,"secondBrainSelectedEntry",2);u([h()],d.prototype,"secondBrainSearchQuery",2);u([h()],d.prototype,"secondBrainSyncing",2);u([h()],d.prototype,"secondBrainBrowsingFolder",2);u([h()],d.prototype,"secondBrainFolderEntries",2);u([h()],d.prototype,"secondBrainFolderName",2);u([h()],d.prototype,"secondBrainVaultHealth",2);u([h()],d.prototype,"secondBrainFileTree",2);u([h()],d.prototype,"secondBrainFileTreeLoading",2);u([h()],d.prototype,"secondBrainFileSearchQuery",2);u([h()],d.prototype,"secondBrainFileSearchResults",2);d=u([En("godmode-app")],d);export{Hh as A,qc as a,Pc as b,Lc as c,Ec as d,Mc as e,Kc as f,Vc as g,lt as h,Hc as i,zc as j,Gc as k,rt as l,Qc as m,Yc as n,Po as o,Ge as p,Ce as q,Gh as r,Dc as s,Rc as t,jc as u,kc as v,Ci as w,_i as x,th as y,Qh as z};
