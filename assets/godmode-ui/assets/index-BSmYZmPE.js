const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./work-tab-CpwH2Z5D.js","./lit-core-CTInmNPB.js","./workspaces-Dt6BuaGe.js","./ctrl-settings-C0Jr7LNg.js","./views-settings-DqDrIl47.js","./markdown-i_gIkIP3.js","./today-tab-gkWtZuCc.js","./team-tab-BZPiRt7g.js","./second-brain-tab-BEQ9aTL1.js","./dashboards-tab-CZnCrA9n.js","./connections-tab-Cs_0xERz.js"])))=>i.map(i=>d[i]);
import{s as yi,l as H,w as vi,e as bi,g as at,h as ae,t as wi,i as He,j as Si,k as Ti,m as Ai,n as ki,o as _i,p as $i,q as Ee,r as De,u as K,_ as T,v as se,x as At,y as Oe,z as kt,A as Hn,B as Ci,C as ot,D as zn,E as rt,F as Vn,G as xi,H as Gn,I as Pi,J as ze,K as Li,L as Ii,M as Mi,N as Ri,O as Ei,P as Di,Q as Oi,R as Ki,S as Ni,T as Fi,U as Ui,V as Wi,W as Bi,X as qi,Y as ji,Z as Hi,$ as zi,a0 as Ae,a1 as Xt,a2 as Vi,a3 as Gi,a4 as Qi,a5 as Yi,a6 as Ji,a7 as Xi,a8 as Zi,a9 as ea}from"./ctrl-settings-C0Jr7LNg.js";import{n as ta,b as f,A as v,o as pe,c as Ke,i as na,a as Ne,d as Qn,t as Yn,e as sa,f as ia,r as h}from"./lit-core-CTInmNPB.js";import{c as aa,t as oe,a as q,i as $,b as Jn,n as Xn,d as oa,e as Zt,p as Zn,E as ra,f as es,l as la,r as ca,T as da,P as ua,s as ha,g as pa,h as fa,j as ma,k as ga,m as ya,o as va,q as ba,u as wa,v as Sa,w as Ta,x as Aa,y as ka,z as _a}from"./views-settings-DqDrIl47.js";import"./markdown-i_gIkIP3.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const $a=ta(Symbol("app-context")),ke=()=>{},Ca=()=>Promise.resolve(void 0);function xa(){return{connected:!1,reconnecting:!1,sessionKey:"main",assistantName:"Assistant",assistantAvatar:null,userName:"",userAvatar:null,theme:"system",themeResolved:"dark",settings:{gatewayUrl:"",token:"",sessionKey:"main",lastActiveSessionKey:"",theme:"system",chatFocusMode:!1,chatShowThinking:!1,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]},basePath:"",gateway:null,send:Ca,setTab:ke,addToast:ke,openSidebar:ke,closeSidebar:ke}}class Pa{constructor(){this.listeners=new Map}on(t,n){this.listeners.has(t)||this.listeners.set(t,new Set);const s=this.listeners.get(t);return s.add(n),()=>{s.delete(n)}}emit(t,...n){const s=this.listeners.get(t);if(!s)return;const i=n[0];for(const a of s)try{a(i)}catch(r){console.error(`[event-bus] Error in handler for "${t}":`,r)}}clear(){this.listeners.clear()}}const V=new Pa;async function La(e,t){await yi(e,t),await H(e,!0)}async function Ia(e){await vi(e),await H(e,!0)}async function Ma(e){await bi(e),await H(e,!0)}async function Ra(e){await at(e),await ae(e),await H(e,!0)}async function Ea(e){await ae(e),await H(e,!0)}function Da(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...i]=n.split(":");if(!s||i.length===0)continue;const a=s.trim(),r=i.join(":").trim();a&&r&&(t[a]=r)}return t}function ts(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function ns(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function Oa(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=aa(n??void 0)}function Ka(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function Na(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function Fa(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function Ua(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=ts(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(ns(n),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const a=i?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:a,success:null,fieldErrors:Da(i?.details)};return}if(!i.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await H(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function Wa(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=ts(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(ns(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const c=i?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:c,success:null};return}const a=i.merged??i.imported??null,r=a?{...t.values,...a}:t.values,l=!!(r.banner||r.website||r.nip05||r.lud16);e.nostrProfileFormState={...t,importing:!1,values:r,error:null,success:i.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:l},i.saved&&await H(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}function ss(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),i=n.slice(2).join(":");return!s||!i?null:{agentId:s,rest:i}}function lt(e){const t=(e??"").trim();if(!t)return!1;if(t==="main")return!0;const n=t.toLowerCase();return!!(n==="agent:main:main"||n.endsWith(":main"))}function ct(e){const t=(e??"").trim();return t?!!(lt(t)||t.toLowerCase().startsWith("agent:main:")):!1}function Ba(e,t){return!!(e===t||ct(e)&&ct(t)&&(lt(e)||lt(t)))}const qa=80;function F(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const n=()=>{const s=e.querySelector(".chat-thread");if(s){const i=getComputedStyle(s).overflowY;if(i==="auto"||i==="scroll"||s.scrollHeight-s.clientHeight>1)return s}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;let s=n();if(!s||s===document.scrollingElement||s===document.documentElement){requestAnimationFrame(()=>{s=n(),s&&s!==document.scrollingElement&&s!==document.documentElement&&(s.scrollTop=s.scrollHeight)});return}if(!(t||e.chatUserNearBottom)){e.chatNewMessagesBelow=!0;return}t&&(e.chatHasAutoScrolled=!0),e.chatIsAutoScrolling=!0,s.scrollTop=s.scrollHeight,e.chatNewMessagesBelow=!1,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1});const a=t?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const r=n();!r||!(t||e.chatUserNearBottom)||(e.chatIsAutoScrolling=!0,r.scrollTop=r.scrollHeight,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1}))},a)})})}function _t(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function is(e,t){const n=t.currentTarget;if(!n||e.chatIsAutoScrolling)return;n.scrollHeight-n.scrollTop-n.clientHeight<qa?(e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1):e.chatUserNearBottom=!1}function as(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function we(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function os(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),i=document.createElement("a"),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");i.href=s,i.download=`godmode-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(s)}function rs(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}const ja=Object.freeze(Object.defineProperty({__proto__:null,exportLogs:os,handleChatScroll:is,handleLogsScroll:as,observeTopbar:rs,resetChatScroll:we,scheduleChatScroll:F,scheduleLogsScroll:_t},Symbol.toStringTag,{value:"Module"})),L="main";function Ha(e){const t=[`viewing ${oe(e.tab)} tab`];return e.tab==="dashboards"&&e.activeDashboard&&t.push(`dashboard: ${e.activeDashboard.title}`),e.tab==="workspaces"&&e.selectedWorkspace&&t.push(`workspace: ${e.selectedWorkspace.name}`),e.sidebarOpen&&e.sidebarFilePath&&t.push(`viewing file: ${e.sidebarFilePath}`),`[GodMode Context: ${t.join(", ")}]`}const en=50,za=80,Va=12e4;function E(e,t){if(!e)return"";const n=e.trim().replace(/\n/g," ");return n.length<=t?n:n.slice(0,t-1)+"…"}function R(e){return typeof e=="string"?e:e==null?"":JSON.stringify(e)}function tn(e,t){if(!t||typeof t!="object")return"";const n=t;switch(e.toLowerCase()){case"exec":return n.command?`\`${E(R(n.command),60)}\``:"";case"read":return n.path||n.file_path?`\`${E(R(n.path||n.file_path),50)}\``:"";case"write":return n.path||n.file_path?`→ \`${E(R(n.path||n.file_path),50)}\``:"";case"edit":return n.path||n.file_path?`\`${E(R(n.path||n.file_path),50)}\``:"";case"web_search":return n.query?`"${E(R(n.query),45)}"`:"";case"web_fetch":try{const m=new URL(R(n.url));return m.hostname+(m.pathname!=="/"?m.pathname.slice(0,30):"")}catch{return E(R(n.url||""),50)}case"memory_search":case"honcho_query":return n.query||n.question?`"${E(R(n.query||n.question),45)}"`:"";case"browser":const s=R(n.action),i=n.ref?` #${R(n.ref)}`:"",a=n.targetUrl?` ${E(R(n.targetUrl),30)}`:"";return`${s}${i}${a}`;case"message":return n.action?`${R(n.action)}${n.target?` → ${E(R(n.target),25)}`:""}`:"";case"sessions_spawn":return n.task?`"${E(R(n.task),40)}"`:"";case"cron":return n.action?R(n.action):"";case"files_read":return n.fileId?`file:${E(R(n.fileId),20)}`:"";case"image":return n.image?E(R(n.image),40):"";default:const r=Object.keys(n).filter(m=>!["timeout","timeoutMs"].includes(m));if(r.length===0)return"";const l=r[0],c=n[l];return typeof c=="string"?`${l}: ${E(c,35)}`:""}}function nn(e,t){if(!t)return"";const n=e.toLowerCase(),s=t.split(`
`),i=s.length,a=t.length;if(["read","files_read"].includes(n))return`${a.toLocaleString()} chars${i>1?`, ${i} lines`:""}`;if(n==="exec")return i>1?`${i} lines`:E(s[0],50);if(["web_search","memory_search","honcho_query"].includes(n))try{const r=JSON.parse(t),l=r.results?.length??r.count??0;return`${l} result${l!==1?"s":""}`}catch{return E(t,40)}return n==="browser"?t.includes("snapshot")?"snapshot captured":t.includes("success")?"success":E(t,40):a>100?`${a.toLocaleString()} chars`:E(t,50)}function sn(e){if(!e)return!0;const t=e.toLowerCase();return!(t.includes("error:")||t.includes("failed")||t.includes("exception")||t.includes("not found"))}function Ga(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(i=>{if(!i||typeof i!="object")return null;const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>!!i);return s.length===0?null:s.join(`
`)}function an(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=Ga(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=typeof e=="object"?"[object]":String(e)}const s=wi(n,Va);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function Qa(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function Ya(e){if(e.toolStreamOrder.length<=en)return;const t=e.toolStreamOrder.length-en,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function Ja(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function dt(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),Ja(e)}function Xa(e,t=!1){if(t){dt(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>dt(e),za))}function $t(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],e.currentToolName=null,e.currentToolInfo=null;const t=e;t.compactionStatus&&(t.compactionStatus=null),t.compactionClearTimer!=null&&(window.clearTimeout(t.compactionClearTimer),t.compactionClearTimer=null),dt(e)}const Za=5e3;function eo(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},Za))}function to(e,t){if(!t)return;if(t.stream==="compaction"){eo(e,t);return}if(t.stream!=="tool")return;const n=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(n&&n!==e.sessionKey||!n&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const s=t.data??{},i=typeof s.toolCallId=="string"?s.toolCallId:"";if(!i)return;const a=typeof s.name=="string"?s.name:"tool",r=typeof s.phase=="string"?s.phase:"",l=r==="start"?s.args:void 0,c=r==="update"?an(s.partialResult):r==="result"?an(s.result):void 0,m=Date.now();let o=e.toolStreamById.get(i);o?(o.name=a,l!==void 0&&(o.args=l,o.displayArgs=tn(a,l)),c!==void 0&&(o.output=c,o.resultSummary=nn(a,c),o.success=sn(c)),o.updatedAt=m):(o={toolCallId:i,runId:t.runId,sessionKey:n,name:a,args:l,output:c,startedAt:typeof t.ts=="number"?t.ts:m,updatedAt:m,message:{},displayArgs:l?tn(a,l):void 0},e.toolStreamById.set(i,o),e.toolStreamOrder.push(i)),r==="start"?(e.currentToolName=a,e.currentToolInfo={name:a,details:o.displayArgs||void 0,startedAt:o.startedAt}):r==="result"&&(e.currentToolName=null,e.currentToolInfo=null,o.completedAt=m,o.resultSummary=nn(a,o.output),o.success=sn(o.output)),o.message=Qa(o),Ya(e),Xa(e,r==="result")}const no=500,ut=new Map,so="__default__";function ls(e,t){const n=e.trim();if(!n)return"";const s=so;if(n.length<no)return q(n);const i=io(n);if(i<0)return q(n);const a=n.slice(0,i),r=n.slice(i);let l=ut.get(s);if(l||(l={prefixText:"",prefixHtml:""},ut.set(s,l)),a===l.prefixText)return l.prefixHtml+q(r);if(a.startsWith(l.prefixText)&&l.prefixText.length>0){const c=a.slice(l.prefixText.length);return l.prefixHtml=l.prefixHtml+q(c),l.prefixText=a,l.prefixHtml+q(r)}return l.prefixHtml=q(a),l.prefixText=a,l.prefixHtml+q(r)}function cs(e){ut.clear()}function io(e){let t=!1,n="";const s=[];let i=0;for(;i<e.length;){const a=e.indexOf(`
`,i),r=a===-1?e.length:a,l=e.slice(i,r),c=l.trimStart(),m=c.match(/^(`{3,}|~{3,})/);if(m){const o=m[1];t?o.charAt(0)===n.charAt(0)&&o.length>=n.length&&c.slice(o.length).trim()===""&&(t=!1,n=""):(t=!0,n=o)}if(!t&&l.trim()===""){let o=r+1;for(;o<e.length&&e[o]===`
`;)o++;o<e.length&&(s.length===0||s[s.length-1]!==o)&&s.push(o)}i=a===-1?e.length:a+1}return s.length<2?-1:s[s.length-2]}const ao=1500,oo=2e3,ds="Copy as markdown",ro="Copied",lo="Copy failed";async function co(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function _e(e,t){e.title=t,e.setAttribute("aria-label",t)}function uo(e){const t=e.label??ds;return f`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(s?.querySelector(".chat-copy-btn__icon"),!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const i=await co(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!i){s.dataset.error="1",_e(s,lo),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,_e(s,t))},oo);return}s.dataset.copied="1",_e(s,ro),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,_e(s,t))},ao)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${$.copy}</span>
        <span class="chat-copy-btn__icon-check">${$.check}</span>
      </span>
    </button>
  `}function ho(e){return uo({text:()=>e,label:ds})}const on="NO_REPLY",po=/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,fo=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi,mo=["internal system context injected by godmode","treat it as invisible background instructions only","persistence protocol (non-negotiable)","you must follow these operating instructions. do not echo or quote this block","meta goal: earn trust through competence. search before asking","asking the user for info you could look up is a failure mode"];function Ve(e){let t=e.replace(po,"").replace(fo,"").trim();const n=t.toLowerCase();for(const s of mo){const i=n.indexOf(s);if(i!==-1){const a=i+s.length,r=t.slice(a),l=r.search(/\n\n(?=[A-Z])/);l!==-1?t=r.slice(l).trim():t="";break}}return t}const go=/^\s*\{[^{}]*"type"\s*:\s*"error"[^{}]*"error"\s*:\s*\{/,yo=/^\s*(\d{3})\s+\{/;function Ct(e){const t=e.trim(),n=t.match(yo);if(n){const s=Number(n[1]);if(s===529||s===503)return"*Switching models — Claude is temporarily overloaded.*";if(s===400&&t.includes("Unsupported value"))return null}if(t.startsWith("Unsupported value:")||t.includes("is not supported with the")||!go.test(t))return null;try{const s=JSON.parse(t);if(s?.type==="error"&&s?.error?.message)return(s.error.type??"")==="overloaded_error"?"*Switching models — Claude is temporarily overloaded.*":`*API error: ${s.error.message}*`}catch{}return null}const vo=/\{"type":"error","error":\{[^}]*"type":"[^"]*"[^}]*\}[^}]*"request_id":"[^"]*"\}/g,bo=/\d{3}\s+\{"type":"error"[^\n]*\}\n?(?:https?:\/\/[^\n]*\n?)?/g,wo=/\{"type":"error","error":\{"details":[^}]*"type":"overloaded_error"[^}]*\}[^}]*"request_id":"[^"]*"\}\n?/g;function So(e){return e.replace(bo,"").replace(vo,"").replace(wo,"").trim()}const To=/^\[([^\]]+)\]\s*/,Ao=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],Ge=new WeakMap,Qe=new WeakMap;function ko(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:Ao.some(t=>e.startsWith(`${t} `))}function xe(e){const t=e.match(To);if(!t)return e;const n=t[1]??"";return ko(n)?e.slice(t[0].length):e}function Ye(e){const t=e.trim();return t===on||t.startsWith(`${on}
`)}function fe(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string"){const i=Ve(s);if(!i)return null;const a=Ct(i);if(a)return a;const r=n==="assistant"?So(i):i;if(n==="assistant"&&!r)return null;const l=n==="assistant"?He(r):xe(i);return Ye(l)?null:l}if(Array.isArray(s)){const i=s.map(a=>{const r=a;return r.type==="text"&&typeof r.text=="string"?Ve(r.text):null}).filter(a=>typeof a=="string"&&a.length>0);if(i.length>0){const a=i.join(`
`),r=n==="assistant"?He(a):xe(a);return Ye(r)?null:r}}if(typeof t.text=="string"){const i=Ve(t.text);if(!i)return null;const a=n==="assistant"?He(i):xe(i);return Ye(a)?null:a}return null}function xt(e){if(!e||typeof e!="object")return fe(e);const t=e;if(Ge.has(t))return Ge.get(t)??null;const n=fe(e);return Ge.set(t,n),n}function ht(e){const n=e.content,s=[];if(Array.isArray(n))for(const l of n){const c=l;if(c.type==="thinking"&&typeof c.thinking=="string"){const m=c.thinking.trim();m&&s.push(m)}}if(s.length>0)return s.join(`
`);const i=Pt(e);if(!i)return null;const r=[...i.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(l=>(l[1]??"").trim()).filter(Boolean);return r.length>0?r.join(`
`):null}function us(e){if(!e||typeof e!="object")return ht(e);const t=e;if(Qe.has(t))return Qe.get(t)??null;const n=ht(e);return Qe.set(t,n),n}function Pt(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(i=>{const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>typeof i=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function hs(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}const _o=Object.freeze(Object.defineProperty({__proto__:null,extractRawText:Pt,extractText:fe,extractTextCached:xt,extractThinking:ht,extractThinkingCached:us,formatApiError:Ct,formatReasoningMarkdown:hs,stripEnvelope:xe},Symbol.toStringTag,{value:"Module"}));function Lt(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",i=t.content,a=Array.isArray(i)?i:null,r=Array.isArray(a)&&a.some(p=>{const g=p,y=(typeof g.type=="string"?g.type:"").toLowerCase();return y==="toolresult"||y==="tool_result"}),l=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||r||l)&&(n="toolResult");let c=[];typeof t.content=="string"?c=[{type:"text",text:t.content}]:Array.isArray(t.content)?c=t.content.map(p=>({type:p.type||"text",text:p.text,name:p.name,args:p.args||p.arguments})):typeof t.text=="string"&&(c=[{type:"text",text:t.text}]);const m=typeof t.timestamp=="number"?t.timestamp:Date.now(),o=typeof t.id=="string"?t.id:void 0;return{role:n,content:c,timestamp:m,id:o}}function Fe(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function ps(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}const rn={pdf:"📕",doc:"📘",docx:"📘",txt:"📄",rtf:"📄",xls:"📗",xlsx:"📗",csv:"📊",ppt:"📙",pptx:"📙",jpg:"🖼️",jpeg:"🖼️",png:"🖼️",gif:"🖼️",webp:"🖼️",svg:"🖼️",mp3:"🎵",wav:"🎵",m4a:"🎵",mp4:"🎬",mov:"🎬",avi:"🎬",zip:"📦",rar:"📦","7z":"📦",tar:"📦",gz:"📦",js:"📜",ts:"📜",py:"📜",json:"📜",html:"📜",css:"📜",md:"📜",default:"📎"};function fs(e){const t=e.split(".").pop()?.toLowerCase()||"";return rn[t]??rn.default}function ms(e,t){const n=t.split(".").pop()?.toLowerCase()||"";return{pdf:"PDF Document",doc:"Word Document",docx:"Word Document",xls:"Excel Spreadsheet",xlsx:"Excel Spreadsheet",csv:"CSV File",ppt:"PowerPoint",pptx:"PowerPoint",txt:"Text File",md:"Markdown",json:"JSON File",zip:"ZIP Archive",png:"PNG Image",jpg:"JPEG Image",jpeg:"JPEG Image",gif:"GIF Image",mp3:"Audio File",mp4:"Video File",html:"HTML Document",css:"Stylesheet",js:"JavaScript",ts:"TypeScript",py:"Python"}[n]||e.split("/")[1]?.toUpperCase()||"File"}const $o={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},Co={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},proof_editor:{icon:"fileText",title:"Proof Editor",actions:{create:{label:"create",detailKeys:["title"]},write:{label:"write",detailKeys:["slug"]},read:{label:"read",detailKeys:["slug"]},comment:{label:"comment",detailKeys:["slug"]},suggest:{label:"suggest",detailKeys:["slug"]},open:{label:"open",detailKeys:["slug"]},share:{label:"share",detailKeys:["slug"]},export_gdrive:{label:"drive",detailKeys:["slug"]},list:{label:"list"}}},queue_steer:{icon:"messageSquare",title:"Queue Steer",detailKeys:["itemId","instruction"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},xo={fallback:$o,tools:Co},gs=xo,ln=gs.fallback??{icon:"puzzle"},Po=gs.tools??{};function Lo(e){return(e??"tool").trim()}function Io(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function Mo(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function ys(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const n=t.split(/\r?\n/)[0]?.trim()??"";return n?n.length>160?`${n.slice(0,157)}…`:n:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(s=>ys(s)).filter(s=>!!s);if(t.length===0)return;const n=t.slice(0,3).join(", ");return t.length>3?`${n}…`:n}}}function Ro(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function Eo(e,t){for(const n of t){const s=Ro(e,n),i=ys(s);if(i)return i}}function Do(e){if(!e||typeof e!="object")return;const t=e,n=typeof t.path=="string"?t.path:void 0;if(!n)return;const s=typeof t.offset=="number"?t.offset:void 0,i=typeof t.limit=="number"?t.limit:void 0;return s!==void 0&&i!==void 0?`${n}:${s}-${s+i}`:n}function Oo(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function Ko(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function No(e){const t=Lo(e.name),n=t.toLowerCase(),s=Po[n],i=s?.icon??ln.icon??"puzzle",a=s?.title??Io(t),r=s?.label??t,l=e.args&&typeof e.args=="object"?e.args.action:void 0,c=typeof l=="string"?l.trim():void 0,m=Ko(s,c),o=Mo(m?.label??c);let p;n==="read"&&(p=Do(e.args)),!p&&(n==="write"||n==="edit"||n==="attach")&&(p=Oo(e.args));const g=m?.detailKeys??s?.detailKeys??ln.detailKeys??[];return!p&&g.length>0&&(p=Eo(e.args,g)),!p&&e.meta&&(p=e.meta),p&&(p=Uo(p)),{name:t,icon:i,title:a,label:r,verb:o,detail:p}}function Fo(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function Uo(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const Wo=80,Bo=2,cn=100,qo=3;function dn(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function jo(e){const t=e.split(`
`),n=t.slice(0,Bo),s=n.join(`
`);return s.length>cn?s.slice(0,cn)+"…":n.length<t.length?s+"…":s}function Ho(e){const t=e,n=Qo(t.content),s=[];for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(a)||typeof i.name=="string"&&i.arguments!=null)&&s.push({kind:"call",name:i.name??"tool",args:Yo(i.arguments??i.args)})}for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();if(a!=="toolresult"&&a!=="tool_result")continue;const r=Jo(i);if(hn(r))continue;const l=typeof i.name=="string"?i.name:"tool";s.push({kind:"result",name:l,text:r})}if(ps(e)&&!s.some(i=>i.kind==="result")){const i=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",a=xt(e)??void 0;hn(a)||s.push({kind:"result",name:i,text:a})}return s}const zo=new Set(["write","read","edit","attach"]);function Vo(e){if(!e||typeof e!="object")return null;const t=e,n=t.path??t.file_path??t.filePath;return typeof n=="string"&&n.trim()?n.trim():null}function Go(e){if(!e)return null;const t=e.match(/(?:\/(?:Users|home|tmp|var)\/\S+|~\/\S+)/);return t?t[0].replace(/[.,;:!?)'"]+$/,""):null}function un(e,t,n,s,i){const a=No({name:e.name,args:e.args}),r=Fo(a),l=!!e.text?.trim(),c=Xo(e.text);if(c?.type==="proof"&&c.slug)return f`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${$.fileText}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name">${c.title??"Proof Document"}</span>
          <span class="chat-artifact-card__type">Live doc</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${s?f`<button class="chat-artifact-card__btn" @click=${C=>{C.stopPropagation(),s(c.slug)}}>Open</button>`:v}
          ${c.filePath&&i?f`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${C=>{C.stopPropagation(),i(c.filePath)}}>Drive</button>`:v}
        </div>
      </div>
    `;const m=zo.has(e.name.toLowerCase())?Vo(e.args)??Go(e.text):null;if(m&&e.kind==="result"){const C=m.split("/").pop()||m,D=C.split(".").pop()?.toLowerCase()||"",Y=fs(C),w=ms(D,C);return f`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${Y}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name" title=${m}>${C}</span>
          <span class="chat-artifact-card__type">${w}</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${n?f`<button class="chat-artifact-card__btn" @click=${A=>{A.stopPropagation(),n(m,e.text??void 0)}}>Open</button>`:t&&l?f`<button class="chat-artifact-card__btn" @click=${A=>{A.stopPropagation(),t(dn(e.text))}}>View</button>`:v}
          ${i?f`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${A=>{A.stopPropagation(),i(m)}}>Drive</button>`:v}
        </div>
      </div>
    `}const o=!!t||!!(n&&m),p=o?C=>{if(C.stopPropagation(),n&&m){n(m,e.text??void 0);return}if(t&&l){t(dn(e.text));return}if(t){const D=`## ${a.label}

${r?`**Command:** \`${r}\`

`:""}*No output — tool completed successfully.*`;t(D)}}:void 0,g=e.text?e.text.split(`
`).length:0,y=l&&(e.text?.length??0)<=Wo,b=l&&!y&&g>qo,_=l&&!b,I=!l,U=e.kind==="call"?"chat-tool-card--call":"chat-tool-card--result";return f`
    <div
      class="chat-tool-card ${U} ${o?"chat-tool-card--clickable":""}"
      @click=${p}
      role=${o?"button":v}
      tabindex=${o?"0":v}
      @keydown=${o?C=>{C.key!=="Enter"&&C.key!==" "||(C.preventDefault(),C.stopPropagation(),p?.(C))}:v}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${$[a.icon]}</span>
          <span>${a.label}</span>
        </div>
        ${o?f`<span class="chat-tool-card__action">${l?"View":""} ${$.check}</span>`:v}
        ${I&&!o?f`<span class="chat-tool-card__status">${$.check}</span>`:v}
      </div>
      ${r?f`<div class="chat-tool-card__detail">${r}</div>`:v}
      ${I?f`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:v}
      ${b?f`<details class="chat-tool-card__expandable" @click=${C=>C.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${jo(e.text)}</summary>
            <div class="chat-tool-card__full-output mono">${e.text}</div>
          </details>`:v}
      ${_?f`<div class="chat-tool-card__inline mono">${e.text}</div>`:v}
    </div>
  `}function Qo(e){return Array.isArray(e)?e.filter(Boolean):[]}function Yo(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function Jo(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function Xo(e){if(!e)return null;try{const t=JSON.parse(e);return t._sidebarAction?{type:t._sidebarAction.type,slug:t._sidebarAction.slug,title:t.title,filePath:t.filePath}:null}catch{return null}}function hn(e){if(!e)return!1;const t=e.toLowerCase();return t.includes("process exited")?!1:t.includes("(no new output)")&&t.includes("still running")}function Zo(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const i=s.getAttribute("href");if(i){if(i.startsWith("file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(7);a.startsWith("/~/")&&(a="~"+a.slice(2));try{a=decodeURIComponent(a)}catch{}t(a);return}if(i.startsWith("godmode-file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(15);try{a=decodeURIComponent(a)}catch{}t(a);return}}}const pn={exec:["Executing","Running","Conjuring","Manifesting","Brewing"],read:["Reading","Perusing","Absorbing","Scanning","Devouring"],write:["Writing","Scribbling","Crafting","Inscribing","Authoring"],edit:["Editing","Refining","Polishing","Tweaking","Sculpting"],browser:["Browsing","Surfing","Exploring","Navigating","Spelunking"],web_search:["Searching","Hunting","Investigating","Sleuthing","Scouring"],web_fetch:["Fetching","Grabbing","Retrieving","Summoning","Acquiring"],memory_search:["Remembering","Recalling","Pondering","Reflecting"],honcho_query:["Remembering","Recalling","Pondering","Reflecting"],image:["Analyzing","Examining","Scrutinizing","Inspecting","Beholding"],default:["Working on","Processing","Handling","Tinkering with","Wrangling"]};function vs(e){const t=e.toLowerCase().replace(/[^a-z_]/g,""),n=pn[t]??pn.default,s=Math.floor(Date.now()/2e3)%n.length;return n[s]}function er(e){const t=e.match(/\[Files uploaded:\s*([^\]]+)\]/);if(!t)return null;const n=t[1],s=[],i=/([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;let a;for(;(a=i.exec(n))!==null;)s.push({fileName:a[1].trim(),fileId:a[2].trim(),size:a[3].trim(),mimeType:a[4].trim()});return s.length>0?s:null}function tr(e){return f`
    <div class="chat-file-uploads">
      ${e.map(t=>f`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${fs(t.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${t.fileName}">${t.fileName}</span>
            <span class="chat-file-upload-card__meta">${t.size} • ${ms(t.mimeType,t.fileName)}</span>
          </div>
        </div>
      `)}
    </div>
  `}function nr(e){return e.replace(/\[Files uploaded:[^\]]+\]\s*/g,"").trim()}const fn=/<document>\s*<source>([^<]*)<\/source>\s*<mime_type>([^<]*)<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function sr(e){const t=[];let n;for(;(n=fn.exec(e))!==null;){const s=n[1]?.trim()||"file",i=n[2]?.trim()||"application/octet-stream";t.push({fileName:s,fileId:"",size:"",mimeType:i})}return fn.lastIndex=0,t.length>0?t:null}const ir=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function ar(e){return e.replace(ir,"").trim()}function or(e){if(!e)return e;if(e.startsWith("System:")||e.startsWith("GatewayRestart:")||e.startsWith("Sender (untrusted metadata)")){const a=e.indexOf(`

`);return a!==-1?e.slice(a+2).trim():""}let i=e.split(`
`).filter(a=>{const r=a.trim();return!r.startsWith("System:")&&!r.startsWith("GatewayRestart:")}).join(`
`);for(;i.startsWith(`
`);)i=i.slice(1);return i.trim()}function rr(e){return typeof e!="number"||!Number.isFinite(e)||e<=0?null:e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${Math.round(e/1024)} KB`:`${Math.round(e)} B`}function pt(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const r=a;if(r.type==="image"){const l=r.source;if(l?.type==="base64"&&typeof l.data=="string"){const c=l.data,m=l.media_type||"image/png",o=c.startsWith("data:")?c:`data:${m};base64,${c}`;s.push({url:o})}else if(typeof r.data=="string"&&typeof r.mimeType=="string"){const c=r.data.startsWith("data:")?r.data:`data:${r.mimeType};base64,${r.data}`;s.push({url:c})}else typeof r.url=="string"?s.push({url:r.url}):r.omitted===!0&&s.push({omitted:!0,bytes:typeof r.bytes=="number"?r.bytes:void 0,mimeType:typeof r.mimeType=="string"?r.mimeType:void 0,alt:typeof r.fileName=="string"?r.fileName:void 0})}else if(r.type==="image_url"){const l=r.image_url;typeof l?.url=="string"&&s.push({url:l.url})}else r.type==="attachment"&&typeof r.content=="string"&&(r.mimeType||"").startsWith("image/")&&s.push({url:r.content,alt:r.fileName||void 0});if(r.type==="text"&&typeof r.text=="string"){const l=/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,c=r.text.match(l);if(c)for(const m of c)s.push({url:m})}if(Array.isArray(r.content))for(const l of r.content){if(typeof l!="object"||l===null)continue;const c=l;if(c.type==="image"){const m=c.source;if(m?.type==="base64"&&typeof m.data=="string"){const o=m.media_type||"image/png",p=m.data.startsWith("data:")?m.data:`data:${o};base64,${m.data}`;s.push({url:p})}else if(typeof c.data=="string"&&typeof c.mimeType=="string"){const o=c.data.startsWith("data:")?c.data:`data:${c.mimeType};base64,${c.data}`;s.push({url:o})}else c.omitted===!0&&s.push({omitted:!0,bytes:typeof c.bytes=="number"?c.bytes:void 0,mimeType:typeof c.mimeType=="string"?c.mimeType:void 0,alt:typeof c.fileName=="string"?c.fileName:void 0})}}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const r=a;if(r.type==="image"&&typeof r.content=="string"){const l=r.mimeType||"image/png",c=r.content.startsWith("data:")?r.content:`data:${l};base64,${r.content}`;s.push({url:c,alt:r.fileName||void 0})}else r.type==="image"&&r.omitted===!0&&s.push({omitted:!0,bytes:typeof r.bytes=="number"?r.bytes:void 0,mimeType:typeof r.mimeType=="string"?r.mimeType:void 0,alt:typeof r.fileName=="string"?r.fileName:void 0})}return s}function lr(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const r=a;if(r.type==="attachment"&&typeof r.content=="string"){const l=r.mimeType||"application/octet-stream";l.startsWith("image/")||s.push({fileName:r.fileName||"file",mimeType:l,content:r.content})}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const r=a;r.type==="file"&&typeof r.content=="string"&&s.push({fileName:r.fileName||"file",mimeType:r.mimeType||"application/octet-stream",content:r.content})}return s}function cr(e,t){return f`
    <div class="chat-group assistant">
      ${It("assistant",{assistantName:e?.name,assistantAvatar:e?.avatar})}
      <div class="chat-group-messages">
        ${t?f`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${vs(t.name)}</span>
                    <strong>${t.name}</strong>
                  </span>
                </div>
                ${t.details?f`<span class="chat-working-indicator__details">${t.details}</span>`:v}
              </div>
            `:v}
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
  `}function dr(e,t,n,s,i){const a=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),r=s?.name??"Assistant";return f`
    <div class="chat-group assistant">
      ${It("assistant",{assistantName:s?.name,assistantAvatar:s?.avatar})}
      <div class="chat-group-messages">
        ${i?f`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${vs(i.name)}</span>
                    <strong>${i.name}</strong>
                  </span>
                </div>
                ${i.details?f`<span class="chat-working-indicator__details">${i.details}</span>`:v}
              </div>
            `:v}
        ${bs({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${r}</span>
          <span class="chat-group-timestamp">${a}</span>
        </div>
      </div>
    </div>
  `}function ur(e,t){const n=Fe(e.role),s=t.assistantName??"Assistant",i=t.userName??"You",a=n==="user"?i:n==="assistant"?s:n,r=n==="user"?"user":n==="assistant"?"assistant":"other",l=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return f`
    <div class="chat-group ${r}">
      ${It(e.role,{assistantName:s,assistantAvatar:t.assistantAvatar??null,userName:i,userAvatar:t.userAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((c,m)=>bs(c.message,{isStreaming:e.isStreaming&&m===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar,t.onOpenFile,t.onOpenProof,t.onImageClick,t.resolveImageUrl,t.onPushToDrive))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${a}</span>
          <span class="chat-group-timestamp">${l}</span>
        </div>
      </div>
    </div>
  `}function It(e,t){const n=Fe(e),s=t?.assistantName?.trim()||"Assistant",i=typeof t?.assistantAvatar=="string"?t.assistantAvatar.trim():"",a=t?.userName?.trim()||"You",r=typeof t?.userAvatar=="string"?t.userAvatar.trim():"",l=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return n==="user"?r&&mn(r)?f`<img
        class="chat-avatar ${l}"
        src="${r}"
        alt="${a}"
      />`:r?f`<div class="chat-avatar ${l}">${r}</div>`:f`<div class="chat-avatar ${l}">${a.charAt(0).toUpperCase()||"C"}</div>`:n==="assistant"?i&&mn(i)?f`<img
        class="chat-avatar ${l}"
        src="${i}"
        alt="${s}"
      />`:i?f`<div class="chat-avatar ${l}" style="color: var(--accent);">${i}</div>`:f`<div class="chat-avatar ${l}" style="color: var(--accent);">⚛️</div>`:n==="tool"?f`<div class="chat-avatar ${l}">⚙</div>`:f`<div class="chat-avatar ${l}">?</div>`}function mn(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function gn(e,t,n){if(e.length===0)return v;const s=e.map((a,r)=>{if((a.omitted||!a.url)&&n){const l=n(r);if(l)return{...a,resolvedUrl:l}}return a}),i=s.filter(a=>(a.resolvedUrl||a.url)&&!a.omitted||a.resolvedUrl).map(a=>({url:a.resolvedUrl||a.url,alt:a.alt}));return f`
    <div class="chat-message-images">
      ${s.map(a=>{const r=a.resolvedUrl||a.url;if(!r){const c=rr(a.bytes),o=[a.mimeType?a.mimeType.replace("image/","").toUpperCase():null,c].filter(Boolean).join(" · ");return f`
            <div
              class="chat-message-image chat-message-image--omitted"
              title=${a.alt??"Sent image"}
              aria-label="Sent image"
            >
              <span class="chat-message-image__omitted-icon">🖼</span>
              <span class="chat-message-image__omitted-label">${o||"Image"}</span>
            </div>
          `}const l=i.findIndex(c=>c.url===r);return f`
          <img
            src=${r}
            alt=${a.alt??"Attached image"}
            class="chat-message-image"
            @error=${c=>{const m=c.target;m.style.display="none"}}
            @click=${()=>{t&&t(r,i,Math.max(0,l))}}
          />
        `})}
    </div>
  `}function hr(e){return e.length===0?v:f`
    <div class="chat-message-files">
      ${e.map(t=>{const n=t.fileName.length>30?t.fileName.slice(0,27)+"...":t.fileName;return f`
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
  `}function bs(e,t,n,s,i,a,r,l){try{return pr(e,t,n,s,i,a,r,l)}catch(c){return console.error("[chat] message render error:",c),f`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `}}function pr(e,t,n,s,i,a,r,l){const c=e,m=typeof c.role=="string"?c.role:"unknown",o=ps(e)||m.toLowerCase()==="toolresult"||m.toLowerCase()==="tool_result"||typeof c.toolCallId=="string"||typeof c.tool_call_id=="string",p=Ho(e),g=p.length>0,y=pt(e),b=y.length>0,_=typeof c._chatIdx=="number"?c._chatIdx:-1,I=r&&_>=0?O=>r(_,O):void 0,U=lr(e),C=U.length>0,D=xt(e),Y=t.showReasoning&&m==="assistant"?us(e):null,w=m==="user"&&D?er(D):null,A=m==="user"?Pt(e):null,k=A?sr(A):null,x=[...w??[],...k??[]],S=x.length>0;let P=D;if(m==="user"&&P&&(P=or(P),P=ar(P)),P&&(P=P.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim()||null),P){const O=Ct(P);O&&(P=O)}S&&P&&(P=nr(P));const ne=P?.trim()?P:null,M=Y?hs(Y):null,ce=ne,Jt=m==="assistant"&&!!ce?.trim(),fi=["chat-bubble",Jt?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");if(g&&o)return f`
      ${b?gn(y,a,I):v}
      ${p.map(O=>un(O,n,s,i,l))}
    `;if(!ce&&!g&&!b&&!C&&!S&&!M){const O=typeof c.errorMessage=="string"?c.errorMessage:null;if(c.stopReason==="error"&&O){let W=O;const de=O.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(de){const mi=parseInt(de[1]).toLocaleString(),gi=parseInt(de[2]).toLocaleString();W=`Context overflow: ${mi} tokens exceeded the ${gi} token limit. The conversation needs to be compacted.`}else O.includes("prompt is too long")&&(W="Context overflow: The conversation is too long for the model.");return f`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${W}</div>
        </div>
      `}if(m==="user"&&D?.trim()){let W=D.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim();if(W.startsWith("System:")||W.startsWith("GatewayRestart:")||W.startsWith("Sender (untrusted metadata)")){const de=W.indexOf(`

`);W=de!==-1?W.slice(de+2).trim():""}if(W)return f`
          <div class="chat-bubble fade-in">
            <div class="chat-text">${W}</div>
          </div>
        `}return v}return f`
    <div class="${fi}">
      ${Jt?ho(ce):v}
      ${S?tr(x):v}
      ${gn(y,a,I)}
      ${hr(U)}
      ${M?f`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${pe(q(M))}</div>
            </details>`:v}
      ${ce?f`<div class="chat-text" @click=${O=>Zo(O,s)}>${pe(t.isStreaming?ls(ce):q(ce))}</div>`:v}
      ${p.map(O=>un(O,n,s,i,l))}
    </div>
  `}function fr(e){const t=e,n=typeof t.content=="string"?t.content:"",s=typeof t.keptMessages=="number"?t.keptMessages:null,i=typeof t.timestamp=="number"?new Date(t.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"";return f`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${s!==null?f`<span class="chat-compaction-summary__kept">${s} messages kept</span>`:v}
      </div>
      <div class="chat-compaction-summary__content">
        ${pe(q(n))}
      </div>
      ${i?f`<div class="chat-compaction-summary__timestamp">${i}</div>`:v}
    </div>
  `}function mr(e){return e.isCompactionSummary===!0}const ws=50,Ss=200,gr="Assistant";function Ie(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function ft(e){const t=Ie(e?.name,ws)??gr,n=Ie(e?.avatar??void 0,Ss)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}function yr(){return ft(typeof window>"u"?{}:{name:window.__OPENCLAW_ASSISTANT_NAME__||window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__OPENCLAW_ASSISTANT_AVATAR__||window.__CLAWDBOT_ASSISTANT_AVATAR__})}const vr="You";function yn(e){const t=Ie(e?.name,ws)??vr,n=Ie(e?.avatar??void 0,Ss)??null;return{name:t,avatar:n}}function br(){return yn(typeof window>"u"?{}:{name:window.__OPENCLAW_USER_NAME__||window.__CLAWDBOT_USER_NAME__,avatar:window.__OPENCLAW_USER_AVATAR__||window.__CLAWDBOT_USER_AVATAR__})}async function Ts(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const i=await e.client.request("agent.identity.get",s);if(!i)return;const a=ft(i);e.assistantName=a.name,e.assistantAvatar=a.avatar,e.assistantAgentId=a.agentId??null}catch{}}let vn=!1;function bn(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function wr(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function Sr(){vn||(vn=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function Ue(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),bn(t)}return Sr(),bn(wr())}let Pe=null;function As(){return Pe}const ks=new Map,ee=new Map;function mt(e,t){const n=t.filter(s=>s?.role==="user").length;ks.set(e,n)}async function _s(e,t){try{const n=await e.request("chat.history",{sessionKey:t,limit:200}),s=Array.isArray(n.messages)?n.messages:[];return ee.set(t,s),mt(t,s),s}catch{return ee.get(t)??[]}}let me=0;async function N(e){if(!e.client||!e.connected)return;const t=e.sessionKey,n=++me;e.chatLoading=!0,e.lastError=null;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==me||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,mt(t,e.chatMessages),ee.set(t,e.chatMessages)}catch{if(n!==me||e.sessionKey!==t)return;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==me||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,mt(t,e.chatMessages),ee.set(t,e.chatMessages)}catch(s){if(n!==me||e.sessionKey!==t)return;e.lastError=String(s)}}finally{e.chatLoading=!1}}async function $s(e,t){const n=[...e.chatMessages],s=n.length;await N(e),!t?.allowShrink&&s>0&&(e.chatMessages.length<s||Tr(n,e.chatMessages))?(e.chatMessages=n,setTimeout(()=>{N(e).then(()=>{e.chatStream=null})},2e3)):e.chatStream=null}function Tr(e,t){const n=Ar(e,a=>a?.role==="user");if(n===-1)return!1;const i=e[n].timestamp;return typeof i!="number"?!1:!t.some(a=>a?.role==="user"&&a?.timestamp===i)}function Ar(e,t){for(let n=e.length-1;n>=0;n--)if(t(e[n]))return n;return-1}function kr(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}async function Cs(e,t,n,s){if(!e.client||!e.connected)return!1;let i=t.trim();const a=n&&n.length>0;if(!i&&!a)return!1;!i&&a&&(i="[attached]");const r=Date.now();if(!s?.skipOptimisticUpdate){const m=[];if(i&&m.push({type:"text",text:i}),a)for(const o of n)o.mimeType.startsWith("image/")?m.push({type:"image",source:{type:"base64",media_type:o.mimeType,data:o.dataUrl}}):m.push({type:"attachment",mimeType:o.mimeType,fileName:o.fileName,content:o.dataUrl});e.chatMessages=[...e.chatMessages,{role:"user",content:m,timestamp:r}]}e.chatSending=!0,e.chatSendingSessionKey=e.sessionKey,e.lastError=null;const l=Ue();e.chatRunId=l,e.chatStream="",e.chatStreamStartedAt=r;let c;if(a){const m=[],o=[];for(const p of n){const g=kr(p.dataUrl);if(g)if(g.mimeType.startsWith("image/"))m.push({type:"image",mimeType:g.mimeType,content:g.content,fileName:p.fileName});else{const y=p.fileName||"file";o.push(`<document>
<source>${y}</source>
<mime_type>${g.mimeType}</mime_type>
<content encoding="base64">
${g.content}
</content>
</document>`)}}if(m.length>0&&(c=m),o.length>0&&(i=`${o.join(`

`)}

${i}`),m.length>0){const p=e.chatMessages.length-1,g=e.sessionKey,y=e.client.request("images.cache",{images:m.map(b=>({data:b.content,mimeType:b.mimeType,fileName:b.fileName})),sessionKey:g}).then(b=>{if(b?.cached&&b.cached.length>0){const _=b.cached.map((I,U)=>({messageIndex:p,imageIndex:U,hash:I.hash,mimeType:I.mimeType,bytes:I.bytes,role:"user",timestamp:r}));return e.client.request("images.updateIndex",{sessionKey:g,images:_}).catch(()=>{})}}).catch(()=>{});Pe=y,y.finally(()=>{Pe===y&&(Pe=null)})}}try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:i,deliver:!1,idempotencyKey:l,attachments:c}),!0}catch(m){const o=String(m);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=o,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+o}],timestamp:Date.now()}],!1}finally{e.chatSending=!1,e.chatSendingSessionKey=null}}async function Mt(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function xs(e,t){if(!t||!Ba(t.sessionKey,e.sessionKey))return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?e.chatStream!==null?(e.refreshSessionsAfterChat=!0,null):"final":null;if(t.state!=="delta"&&cs(),t.state==="delta"){const n=fe(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final")e.chatRunId=null,e.chatStreamStartedAt=null;else if(t.state==="aborted")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;else if(t.state==="error"){e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;const n=t.errorMessage??"chat error";e.lastError=n;let s=n;if(n.includes("prompt is too long")||n.includes("tokens >")){const a=n.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(a){const r=parseInt(a[1]).toLocaleString(),l=parseInt(a[2]).toLocaleString();s=`⚠️ Context overflow: ${r} tokens exceeds ${l} limit. Use /compact to free up space.`}else s="⚠️ Context overflow: The conversation is too long. Use /compact to free up space."}e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:s}],timestamp:Date.now(),isError:!0}]}return t.state}const he=Object.freeze(Object.defineProperty({__proto__:null,abortChatRun:Mt,getPendingImageCache:As,handleChatEvent:xs,laneMessageCache:ee,loadChatHistory:N,loadChatHistoryAfterFinal:$s,loadLaneHistory:_s,sendChatMessage:Cs,sessionTurnCounts:ks},Symbol.toStringTag,{value:"Module"}));function gt(e){return typeof e=="object"&&e!==null}function _r(e){if(!gt(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!gt(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const i=typeof e.createdAtMs=="number"?e.createdAtMs:0,a=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!i||!a?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:i,expiresAtMs:a}}function $r(e){if(!gt(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function Ps(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function Cr(e,t){const n=Ps(e).filter(s=>s.id!==t.id);return n.push(t),n}function wn(e,t){return Ps(e).filter(n=>n.id!==t)}const xr=1800*1e3;function Ls(e){return{openclawVersion:e.openclaw.version,openclawLatest:e.openclaw.latest,openclawUpdateAvailable:e.openclaw.updateAvailable,openclawInstallKind:e.openclaw.installKind,openclawChannel:e.openclaw.channel,pluginVersion:e.plugin.version,pluginLatest:e.plugin.latest,pluginUpdateAvailable:e.plugin.updateAvailable,pendingDeploy:e.pendingDeploy??null,fetchOk:e.fetchOk}}function Is(e){const t=typeof e.behind=="number"?e.behind:null;return{openclawVersion:String(e.version??"unknown"),openclawLatest:null,openclawUpdateAvailable:(t??0)>0,openclawInstallKind:"unknown",openclawChannel:null,pluginVersion:"unknown",pluginLatest:null,pluginUpdateAvailable:!1,pendingDeploy:null,fetchOk:e.fetchOk}}async function Pr(e){if(!(!e.client||!e.connected)){e.updateLoading=!0,e.updateError=null;try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Ls(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});t.error&&(e.updateError=String(t.error)),e.updateStatus=Is(t),e.updateLastChecked=Date.now()}catch(t){e.updateError=String(t)}}finally{e.updateLoading=!1}}}async function Sn(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Ls(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});e.updateStatus=Is(t),e.updateLastChecked=Date.now()}catch{}}}function Lr(e){e.updatePollInterval==null&&(Sn(e),e.updatePollInterval=window.setInterval(()=>{Sn(e)},xr))}function Ir(e){const t=e;t.updatePollInterval!=null&&(clearInterval(t.updatePollInterval),t.updatePollInterval=null)}async function Mr(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.postStatus",{});if(!t)return;const n=t.overallStatus,s=t.summary;if(!s)return;const i=n==="healthy"?"success":n==="degraded"?"error":"warning";typeof e.showToast=="function"&&e.showToast(s,i),Pr(e)}catch{}}const Ms={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},Tn=Ms,yt={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(Ms));new Set(Object.values(yt));function Rr(e){const t=e.version??(e.nonce?"v2":"v1"),n=e.scopes.join(","),s=e.token??"",i=[t,e.deviceId,e.clientId,e.clientMode,e.role,n,String(e.signedAtMs),s];return t==="v2"&&i.push(e.nonce??""),i.join("|")}const Er=4008;class Dr{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.read","operator.write","operator.approvals","operator.pairing"],s="operator";let i=null,a=!1,r=this.opts.token;if(t){i=await Si();const o=Ti({deviceId:i.deviceId,role:s})?.token;r=o??this.opts.token,a=!!(o&&this.opts.token)}const l=r||this.opts.password?{token:r,password:this.opts.password}:void 0;let c;if(t&&i){const o=Date.now(),p=this.connectNonce??void 0,g=Rr({deviceId:i.deviceId,clientId:this.opts.clientName??Tn.CONTROL_UI,clientMode:this.opts.mode??yt.WEBCHAT,role:s,scopes:n,signedAtMs:o,token:r??null,nonce:p}),y=await Ai(i.privateKey,g);c={id:i.deviceId,publicKey:i.publicKey,signature:y,signedAt:o,nonce:p}}const m={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??Tn.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??yt.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:c,caps:[],auth:l,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",m).then(o=>{o?.auth?.deviceToken&&i&&ki({deviceId:i.deviceId,role:o.auth.role??s,token:o.auth.deviceToken,scopes:o.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(o)}).catch(()=>{a&&i&&_i({deviceId:i.deviceId,role:s}),this.ws?.close(Er,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const i=n;if(i.event==="connect.challenge"){const r=i.payload,l=r&&typeof r.nonce=="string"?r.nonce:null;l&&(this.connectNonce=l,this.sendConnect());return}const a=typeof i.seq=="number"?i.seq:null;a!==null&&(this.lastSeq!==null&&a>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:a}),this.lastSeq=a);try{this.opts.onEvent?.(i)}catch(r){console.error("[gateway] event handler error:",r)}return}if(s.type==="res"){const i=n,a=this.pending.get(i.id);if(!a)return;this.pending.delete(i.id),i.ok?a.resolve(i.payload):a.reject(new Error(i.error?.message??"request failed"));return}}request(t,n){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const s=Ue(),i={type:"req",id:s,method:t,params:n},a=new Promise((r,l)=>{this.pending.set(s,{resolve:c=>r(c),reject:l})});return this.ws.send(JSON.stringify(i)),a}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}const Rs={displayName:"label",sessionKey:"conversationId"},Es={};for(const[e,t]of Object.entries(Rs))Es[t]=e;const Or={"sessions.autoTitle":["sessions.patch"],"sessions.rename":["sessions.patch"]},re=new Map;function Kr(){try{const e=sessionStorage.getItem("godmode:healing-cache");if(e){const t=JSON.parse(e);for(const[n,s]of Object.entries(t))re.set(n,s)}}catch{}}function An(){try{const e={};for(const[t,n]of re)e[t]=n;sessionStorage.setItem("godmode:healing-cache",JSON.stringify(e))}catch{}}Kr();function Nr(e,t){const n=re.get(e);if(!n)return{method:e,params:t};const s=n.resolvedMethod;if(t&&typeof t=="object"&&!Array.isArray(t)&&Object.keys(n.fieldRenames).length>0){const i={...t};for(const[a,r]of Object.entries(n.fieldRenames))a in i&&!(r in i)&&(i[r]=i[a],delete i[a]);return{method:s,params:i}}return{method:s,params:t}}function Fr(e,t,n){const s=n.toLowerCase(),i=n.match(/unexpected property[:\s]*['"]?(\w+)['"]?/i);if(i){const a=i[1],r=Rs[a];if(r&&t&&typeof t=="object"){const l={...t};if(a in l)return l[r]=l[a],delete l[a],console.log(`[safe-request] Self-heal: ${e} — rewrote "${a}" → "${r}"`),{method:e,params:l,renames:{[a]:r}}}}if(s.includes("unknown method")||s.includes("method not found")){const a=Or[e];if(a&&a.length>0){const r=a[0];return console.log(`[safe-request] Self-heal: ${e} not found — falling back to ${r}`),{method:r,params:t,renames:{}}}}if((s.includes("unexpected property")||s.includes("unknown field"))&&t&&typeof t=="object"){const a={...t};let r=!1;const l={};for(const[c,m]of Object.entries(Es))c in a&&(a[m]=a[c],delete a[c],l[c]=m,r=!0,console.log(`[safe-request] Self-heal: ${e} — reverse alias "${c}" → "${m}"`));if(r)return{method:e,params:a,renames:l}}return null}async function Ur(e,t,n,s){const i=s?.timeout??3e4;let{method:a,params:r}=s?.raw?{method:t,params:n}:Nr(t,n);const l=async(c,m)=>Promise.race([e.request(c,m),new Promise((o,p)=>setTimeout(()=>p(new Error(`Request timeout (${i}ms): ${c}`)),i))]);try{return{ok:!0,data:await l(a,r),method:a,healed:a!==t}}catch(c){const m=String(c instanceof Error?c.message:c);if(s?.raw)return{ok:!1,error:m,method:t};const o=Fr(a,r,m);if(o)try{const p=await l(o.method,o.params);return re.set(t,{resolvedMethod:o.method,fieldRenames:o.renames,ts:Date.now()}),An(),{ok:!0,data:p,method:o.method,healed:!0}}catch(p){return{ok:!1,error:String(p instanceof Error?p.message:p),method:o.method,healed:!0}}if(s?.fallbacks)for(const p of s.fallbacks)try{const g=await l(p,r);return re.set(t,{resolvedMethod:p,fieldRenames:{},ts:Date.now()}),An(),{ok:!0,data:g,method:p,healed:!0}}catch{continue}return{ok:!1,error:m,method:a}}}function Ds(){re.clear();try{sessionStorage.removeItem("godmode:healing-cache")}catch{}}function Wr(){const e={};for(const[t,n]of re)e[t]=n;return e}const Md=Object.freeze(Object.defineProperty({__proto__:null,clearHealingCache:Ds,getHealingEntries:Wr,safeRequest:Ur},Symbol.toStringTag,{value:"Module"}));let G=null;function Br(e,t){Ds();const n=String(e.version??e.serverVersion??e.gatewayVersion??"unknown"),s=typeof e.protocol=="number"?e.protocol:void 0;G={hostVersion:n,protocolVersion:s,methods:{},initializedAt:Date.now(),probing:!0};try{const i=sessionStorage.getItem("godmode:host-compat");if(i){const a=JSON.parse(i);if(a.hostVersion===n&&a.methods)return G.methods=a.methods,G.probing=!1,G}}catch{}return qr(t).catch(()=>{}),G}async function qr(e){if(!G)return;const t=[{method:"sessions.list",params:{limit:1}},{method:"sessions.patch",params:{key:"__compat_probe__"}},{method:"sessions.autoTitle",params:{sessionKey:"__compat_probe__"}},{method:"config.get",params:{}}];for(const n of t){const s={available:!1,testedAt:Date.now()};try{await e.request(n.method,n.params),s.available=!0}catch(i){const a=String(i instanceof Error?i.message:i),r=a.toLowerCase(),l=r.includes("unknown method")||r.includes("not found")&&r.includes("method");s.available=!l,l&&(s.error="method not available");const c=a.match(/(?:expected|valid|accepted) (?:fields?|properties?)[:\s]*\[([^\]]+)\]/i);c&&(s.fields=c[1].split(",").map(m=>m.trim().replace(/['"]/g,"")))}G.methods[n.method]=s}G.probing=!1;try{sessionStorage.setItem("godmode:host-compat",JSON.stringify(G))}catch{}}const vt=new Map;let kn=null,Je=!1;function Os(e,t,n){return vt.get(`${e}:${t}:${n}`)??null}async function Ks(e){if(!e.client||!e.chatMessages?.length)return;const t=e.sessionKey,n=[];for(let s=0;s<e.chatMessages.length;s++){const i=e.chatMessages[s],a=pt(i);for(let r=0;r<a.length;r++)if(a[r].url&&!a[r].omitted){const l=/^data:([^;]+);base64,(.+)$/.exec(a[r].url);l&&n.push({data:l[2],mimeType:l[1],messageIndex:s,imageIndex:r,role:i.role||"unknown",timestamp:typeof i.timestamp=="number"?i.timestamp:void 0})}}if(n.length>0)try{const s=await e.client.request("images.cache",{images:n.map(i=>({data:i.data,mimeType:i.mimeType})),sessionKey:t});if(s?.cached){const i=n.map((a,r)=>({messageIndex:a.messageIndex,imageIndex:a.imageIndex,hash:s.cached[r]?.hash,mimeType:a.mimeType,bytes:s.cached[r]?.bytes??0,role:a.role,timestamp:a.timestamp})).filter(a=>!!a.hash);i.length>0&&await e.client.request("images.updateIndex",{sessionKey:t,images:i})}}catch{}if(!Je){Je=!0;try{const s=As();s&&await s.catch(()=>{});const i=async()=>{const r=await e.client.request("images.resolve",{sessionKey:t});if(r?.images&&Object.keys(r.images).length>0){kn!==t&&vt.clear();for(const[l,c]of Object.entries(r.images))vt.set(`${t}:${l}`,c);return kn=t,e.chatMessages=[...e.chatMessages],!0}return!1};if(!await i()&&e.chatMessages?.some(r=>pt(r).some(c=>c.omitted||!c.url))){for(const r of[500,1500,3e3])if(await new Promise(l=>setTimeout(l,r)),await i()||e.sessionKey!==t)break}}catch{}finally{Je=!1}}}let _n=null;function jr(e){if(!e.chatMessages?.length)return;const t=e.chatMessages.slice(-5);for(const n of t){const s=n,i=Array.isArray(s.content)?s.content:[];for(const a of i){const r=a,l=typeof r.text=="string"?r.text:typeof r.content=="string"?r.content:null;if(l)try{const c=JSON.parse(l);if(c._sidebarAction?.type==="proof"&&c._sidebarAction.slug){const m=c._sidebarAction.slug;if(m===_n)return;_n=m,e.handleOpenProofDoc(m);return}}catch{}}}}function be(e){Ks(e)}const ye=[];function Ns(){return[...ye]}let J=null;const Hr=10,zr=1e3,j=new Map;function Xe(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const i=t.mainKey?.trim()||"main",a=t.defaultAgentId?.trim();return n==="main"||n===i||a&&(n===`agent:${a}:main`||n===`agent:${a}:${i}`)?s:n}function Vr(e,t){if(!t?.mainSessionKey)return;const n="main",s=o=>(o??"").trim()===n||(o??"").trim()==="",i=s(e.sessionKey)?e.sessionKey:Xe(e.sessionKey,t),a=s(e.settings.sessionKey)?e.settings.sessionKey:Xe(e.settings.sessionKey,t),r=s(e.settings.lastActiveSessionKey)?e.settings.lastActiveSessionKey:Xe(e.settings.lastActiveSessionKey,t),l=i||a||e.sessionKey,c={...e.settings,sessionKey:a||l,lastActiveSessionKey:r||l},m=c.sessionKey!==e.settings.sessionKey||c.lastActiveSessionKey!==e.settings.lastActiveSessionKey;l!==e.sessionKey&&(e.sessionKey=l),m&&te(e,c)}function Gr(e){J&&(clearTimeout(J),J=null);const t=(e.reconnectAttempt??0)+1;e.reconnectAttempt=t,e.reconnecting=!0;const n=t<=Hr?Math.min(zr*Math.pow(2,t-1),3e4):6e4;J=setTimeout(()=>{J=null,e.connected||We(e)},n)}async function Qr(e){if(!e.client)return;const t=e;try{if(t.setupQuickDone){t.workspaceNeedsSetup=!1;return}try{if((await e.client.request("onboarding.status",{}))?.identity?.name){t.workspaceNeedsSetup=!1;return}}catch{}const n=await e.client.request("projects.list",{});t.workspaceNeedsSetup=!n?.projects||n.projects.length===0}catch{}}async function Yr(e){if(!e.client)return;if(e.workspaceNeedsSetup===!1){try{const n=await e.client.request("onboarding.status",{});n&&!n.completedAt&&await e.client.request("onboarding.complete",{summary:null})}catch{}return}try{const n=await e.client.request("onboarding.status",{}),s=e;if(n&&!n.completedAt){s.onboardingActive=!0,s.onboardingPhase=n.phase??0,s.onboardingData=n;const i=e;i.showSetupTab=!0;try{const a=await e.client.request("onboarding.setupProgress",{});e.setupProgress=a}catch{}if(n.identity?.name){i.setupQuickDone=!0;const a=e;a.settings.userName||(a.userName=n.identity.name,a.applySettings({...a.settings,userName:n.identity.name}))}}else if(s.onboardingActive=!1,s.onboardingData=n??null,n?.identity?.name){const i=e;i.settings.userName||(i.userName=n.identity.name,i.applySettings({...i.settings,userName:n.identity.name}))}}catch{}}function Jr(e,t){if(!e.sessionsResult?.sessions)return;const n=e.sessionsResult.sessions.map(s=>s.key===t?{...s,updatedAt:Date.now()}:s);e.sessionsResult={...e.sessionsResult,sessions:n}}const Fs=new Set;function Us(){Fs.clear()}async function Xr(e,t){}function We(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null,Us();const t=e;"sessionsLoading"in t&&(t.sessionsLoading=!1),"agentsLoading"in t&&(t.agentsLoading=!1),"nodesLoading"in t&&(t.nodesLoading=!1),"devicesLoading"in t&&(t.devicesLoading=!1),"channelsLoading"in t&&(t.channelsLoading=!1),"configLoading"in t&&(t.configLoading=!1),"presenceLoading"in t&&(t.presenceLoading=!1),"cronLoading"in t&&(t.cronLoading=!1),"skillsLoading"in t&&(t.skillsLoading=!1),"debugLoading"in t&&(t.debugLoading=!1),"logsLoading"in t&&(t.logsLoading=!1),J&&(clearTimeout(J),J=null),e.client?.stop(),e.client=new Dr({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:async n=>{const s=e.reconnecting;if(e.connected=!0,e.lastError=null,e.hello=n,e.reconnecting=!1,e.reconnectAttempt=0,s){const a=e;let r="Gateway reconnected";try{const l=await e.client.request("godmode.health",{});l?.crashRecovery&&(r=`Recovered from crash (${Math.round((l.crashRecovery.downtimeMs??0)/1e3)}s downtime). Everything is back online.`)}catch{}typeof a.showToast=="function"&&a.showToast(r,"success",6e3),e.lastError="✓ Reconnected",setTimeout(()=>{e.lastError==="✓ Reconnected"&&(e.lastError=null)},3e3),e.chatRunId=null,e.workingSessions.clear(),e.requestUpdate?.();for(const l of j.values())clearTimeout(l);j.clear()}const i=n.features;document.title=i?.hermes?"Hermes - GodMode":"OC - GodMode",Br(n,e.client),Bs(e,n),Ts(e),el(e),$i(e),Ee(e,{quiet:!0}),De(e,{quiet:!0}),K(e),qe(e),Qr(e).then(()=>Yr(e)),Lr(e),Mr(e),nl(e)},onClose:({code:n,reason:s})=>{e.connected=!1,Ir(e);const i=e;"chatSending"in i&&(i.chatSending=!1),"chatSendingSessionKey"in i&&(i.chatSendingSessionKey=null),"chatRunId"in i&&(i.chatRunId=null),"chatStream"in i&&(i.chatStream=null),"chatStreamStartedAt"in i&&(i.chatStreamStartedAt=null);const a=e;"sessionsLoading"in a&&(a.sessionsLoading=!1),"agentsLoading"in a&&(a.agentsLoading=!1),"nodesLoading"in a&&(a.nodesLoading=!1),"devicesLoading"in a&&(a.devicesLoading=!1),"channelsLoading"in a&&(a.channelsLoading=!1),"presenceLoading"in a&&(a.presenceLoading=!1),n!==1012&&(e.lastError=`disconnected (${n}): ${s||"no reason"}`),Gr(e)},onEvent:n=>Ws(e,n),onGap:({expected:n,received:s})=>{e.lastError=`event gap detected (expected seq ${n}, got ${s}); refresh recommended`}}),e.client.start()}function Ws(e,t){try{Zr(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function Zr(e,t){if(ye.unshift({ts:Date.now(),event:t.event,payload:t.payload}),ye.length>250&&(ye.length=250),e.tab==="debug"&&(e.eventLog=[...ye]),t.event==="agent"){if(e.onboarding)return;const n=t.payload,s=n?.sessionKey;s&&n?.stream==="tool"&&n.data?.phase==="start"&&(e.workingSessions.has(s)||(e.workingSessions.add(s),e.requestUpdate?.())),to(e,n);return}if(t.event==="chat"){const n=t.payload;if(n?.sessionKey){if(Vs(e,n.sessionKey),n.state==="delta"){const a=j.get(n.sessionKey);a&&(clearTimeout(a),j.delete(n.sessionKey)),e.workingSessions.has(n.sessionKey)||(e.workingSessions.add(n.sessionKey),e.requestUpdate?.());const r=`safety:${n.sessionKey}`,l=j.get(r);l&&clearTimeout(l),j.set(r,setTimeout(()=>{j.delete(r),e.workingSessions.has(n.sessionKey)&&(e.workingSessions.delete(n.sessionKey),e.requestUpdate?.())},9e4))}else if((n.state==="final"||n.state==="error"||n.state==="aborted")&&e.workingSessions.has(n.sessionKey)){const a=j.get(n.sessionKey);a&&(clearTimeout(a),j.delete(n.sessionKey));const r=`safety:${n.sessionKey}`,l=j.get(r);l&&(clearTimeout(l),j.delete(r)),e.workingSessions.delete(n.sessionKey),e.requestUpdate?.()}}n.state==="final"&&Jr(e,n.sessionKey);const s=xs(e,n),i=ct(n?.sessionKey);if(n&&i){const a=e,r=e.tab==="chat"&&e.sessionKey===L;if(n.state==="delta"){const l=fe(n.message);if(!r){if(typeof l=="string"){const c=a.allyStream??"";(!c||l.length>=c.length)&&(a.allyStream=l)}a.allyWorking=!0,a.requestUpdate?.()}}else if(n.state==="final"){a.allyStream=null,a.allyWorking=!1,!a.allyPanelOpen&&e.tab!=="chat"&&(a.allyUnread=(a.allyUnread??0)+1);const l=e;l._loadAllyHistory().then(()=>{a.allyPanelOpen&&l._scrollAllyToBottom(),a.requestUpdate?.()})}else if(n.state==="error"||n.state==="aborted"){const l=fe(n.message),c=n.state==="aborted"?"Response was stopped.":l||"Something went wrong — try again.";a.allyMessages=[...a.allyMessages??[],{role:"assistant",content:`*${c}*`,timestamp:Date.now()}],a.allyStream=null,a.allyWorking=!1,a.requestUpdate?.()}}if(n.state==="final"&&(async()=>{await Xr(e,n.sessionKey);try{await K(e,{activeMinutes:0})}catch{}})(),(s==="final"||s==="error"||s==="aborted")&&($t(e),ti(e),s==="final"&&e.compactionStatus?.active&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus.startedAt??null,completedAt:Date.now()},e.showToast?.("Compaction complete","info",2e3)),(s==="error"||s==="aborted")&&e.compactionStatus?.active&&(e.compactionStatus=null),e.refreshSessionsAfterChat=!1),s==="final"){const a=!!e.compactionStatus?.completedAt;$s(e,{allowShrink:a}).then(()=>{F(e,!0),Ks(e),e.loadSessionResources?.(),jr(e)}),e.tab==="dashboards"&&V.emit("refresh-requested",{target:"dashboards",sessionKey:n.sessionKey})}return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&Bt(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&De(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=_r(t.payload);if(n){e.execApprovalQueue=Cr(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=wn(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.process.completed"){const n=t.payload;if(n?.sessionId){const s=n.exitSignal?`signal ${n.exitSignal}`:`exit ${n.exitCode??0}`,i=n.status==="completed"?"✓":"✗",a=n.status==="completed"?"success":"warning",r=n.sessionId.slice(0,8),l=e;typeof l.showToast=="function"&&l.showToast(`${i} Process ${r} ${n.status} (${s})`,a,5e3)}return}if(t.event==="exec.approval.resolved"){const n=$r(t.payload);n&&(e.execApprovalQueue=wn(e.execApprovalQueue,n.id))}if(t.event==="daily-brief:update"){V.emit("refresh-requested",{target:"today"});return}if(t.event==="ui.slot.update"){const n=t.payload;if(n?.tabId){const s=n.mode??"replace";if(n.html)s==="append"?e.dynamicSlots={...e.dynamicSlots,[n.tabId]:(e.dynamicSlots[n.tabId]??"")+n.html}:e.dynamicSlots={...e.dynamicSlots,[n.tabId]:n.html};else{const a={...e.dynamicSlots};delete a[n.tabId],e.dynamicSlots=a}e.requestUpdate?.()}return}if(t.event==="guardrails:update"){const n=e;typeof n.handleGuardrailsLoad=="function"&&n.handleGuardrailsLoad();return}if(t.event==="fathom:meeting-processed"){const n=t.payload;if(n?.title){const s=e;typeof s.showToast=="function"&&s.showToast(`Meeting processed: ${n.title}`,"success",6e3);const i=n.message??`Meeting "${n.title}" has been processed.`;s.allyMessages=[...s.allyMessages??[],{role:"assistant",content:i,timestamp:Date.now()}],!s.allyPanelOpen&&s.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1),s.sessionKey===L&&s.chatMessages&&(s.chatMessages=[...s.chatMessages,{role:"assistant",content:i,timestamp:Date.now()}]),s.requestUpdate?.()}return}if(t.event==="onboarding:update"){const n=t.payload;if(n){const s=e;if(typeof n.phase=="number"&&(s.onboardingPhase=n.phase),s.onboardingData=n,n.completedAt&&(s.onboardingActive=!1),n.identity?.name){const i=e;(!i.userName||!i.settings.userName)&&(i.userName=n.identity.name,i.applySettings({...i.settings,userName:n.identity.name}))}s.requestUpdate?.()}return}if(t.event==="inbox:update"){V.emit("refresh-requested",{target:"today"});return}if(t.event==="queue:update"){const n=t.payload;n?.status==="processing"&&n.proofDocSlug&&e.handleOpenProofDoc?.(n.proofDocSlug).catch(()=>{}),V.emit("refresh-requested",{target:"today"});return}if(t.event==="ally:notification"){const n=t.payload;if(n){const s=e,i={role:"assistant",content:n.summary||n.message||"Notification received.",timestamp:Date.now(),isNotification:!0,actions:n.actions??[]};s.allyMessages=[...s.allyMessages??[],i],!s.allyPanelOpen&&e.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1);const a=["queue-complete","queue-needs-review","queue-failed","cron-result","paperclip-completion"];if(n.type&&a.includes(n.type)&&V.emit("refresh-requested",{target:"today"}),n.type==="paperclip-completion"){const r=n,l=e;r.sessionKey&&l.sessionKey===r.sessionKey&&l.loadChatHistory?.().catch(()=>{}),i.content=r.message||i.content}s.requestUpdate?.()}return}if(t.event==="sessions:updated"){const n=t.payload;n?.sessionKey&&n?.title&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(s=>s.key===n.sessionKey||s.key?.endsWith(`:${n.sessionKey?.split(":").pop()}`)||n.sessionKey?.endsWith(`:${s.key?.split(":").pop()}`)?{...s,displayName:n.title,label:n.title}:s)}),se.set(n.sessionKey,n.title),Fs.add(n.sessionKey),e.requestUpdate?.());return}if(t.event==="session:auto-compact"){const n=t.payload;if(n?.sessionKey){const s=e;n.sessionKey===s.sessionKey&&!s.compactionStatus?.active&&s.connected&&(s.showToast?.("Context near limit — auto-compacting...","info",3e3),s.handleCompactChat?.())}return}}async function el(e){if(e.client)try{const t=await e.client.request("godmode.config.model",{}),n=e;t?.primary&&(n.currentModel=t.primary),Array.isArray(t?.available)&&(n.availableModels=t.available)}catch{}}async function tl(e,t){if(!e.client)return;const n=e;try{await e.client.request("godmode.config.model.set",{primary:t}),n.currentModel=t,n.modelPickerOpen=!1}catch(s){console.error("[model-switch]",s)}}async function nl(e){if(typeof window>"u")return;const t=new URLSearchParams(window.location.search),n=t.get("openTask");if(!n||!e.client)return;t.delete("openTask");const s=t.toString()?`${window.location.pathname}?${t.toString()}`:window.location.pathname;window.history.replaceState({},"",s);try{const i=await e.client.request("tasks.openSession",{taskId:n});if(i?.sessionKey){e.sessionKey=i.sessionKey,e.tab="chat";const{loadChatHistory:a}=await T(async()=>{const{loadChatHistory:r}=await Promise.resolve().then(()=>he);return{loadChatHistory:r}},void 0,import.meta.url);await a(e,i.sessionKey)}}catch(i){console.error("[GodMode] Failed to open task session:",i)}}function Bs(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&Vr(e,n.sessionDefaults)}const sl=Object.freeze(Object.defineProperty({__proto__:null,applySnapshot:Bs,connectGateway:We,getEventLogSnapshot:Ns,getResolvedImageUrl:Os,handleGatewayEvent:Ws,resetAutoTitleState:Us,switchModelFromChat:tl,triggerImageResolve:be},Symbol.toStringTag,{value:"Module"}));function Rt(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{Ee(e,{quiet:!0})},5e3))}function Et(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function Dt(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&At(e,{quiet:!0})},2e3))}function Ot(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function Kt(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&Oe(e)},3e3))}function Nt(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}function Be(e,t=Date.now()){if(typeof e=="number"&&Number.isFinite(e))return new Date(e);if(typeof e=="string"){const n=Date.parse(e);if(Number.isFinite(n))return new Date(n)}return new Date(t)}function Ft(e){return{id:e.id,name:e.name,emoji:e.emoji||"📁",type:e.type,path:e.path,artifactCount:e.artifactCount??0,sessionCount:e.sessionCount??0,lastUpdated:Be(e.lastUpdated,e.lastScanned)}}function Ze(e){return{path:e.path,name:e.name,type:e.type,size:e.size,modified:Be(e.modified),isDirectory:e.isDirectory,searchText:e.searchText}}function $n(e){return{id:e.id,key:e.key,title:e.title,created:Be(e.created),status:e.status,workspaceSubfolder:e.workspaceSubfolder}}function Se(e){return{id:e.id,title:e.title,status:e.status,project:e.project,dueDate:e.dueDate,priority:e.priority,createdAt:e.createdAt,completedAt:e.completedAt}}function qs(e){return e.map(t=>({name:t.name,path:t.path,type:t.type,fileType:t.fileType,size:t.size,modified:t.modified?Be(t.modified):void 0,children:t.children?qs(t.children):void 0}))}function il(e,t){return{...t,id:e.id,name:e.name,emoji:e.emoji,type:e.type,path:e.path,artifactCount:e.artifactCount,sessionCount:e.sessionCount,lastUpdated:e.lastUpdated}}async function al(e){if(!e.client||!e.connected){e.workspaces=[],e.workspacesLoading=!1,e.workspacesError="Connect to gateway to see workspaces";return}e.workspacesLoading=!0,e.workspacesError=null;try{const t=await e.client.request("workspaces.list",{});if(e.workspaces=(t.workspaces??[]).map(Ft),e.selectedWorkspace){const n=e.workspaces.find(s=>s.id===e.selectedWorkspace?.id);n&&(e.selectedWorkspace=il(n,e.selectedWorkspace))}}catch(t){console.error("[Workspaces] load failed:",t),e.workspacesError=t instanceof Error?t.message:"Failed to load workspaces",e.workspaces=[]}finally{e.workspacesLoading=!1}}async function Ut(e,t){if(!e.client||!e.connected)return null;try{const n=await e.client.request("workspaces.get",{id:t});return n.workspace?{...Ft(n.workspace),pinned:(n.pinned??[]).map(Ze),pinnedSessions:(n.pinnedSessions??[]).map($n),outputs:(n.outputs??[]).map(Ze),folderTree:n.folderTree?qs(n.folderTree):void 0,sessions:(n.sessions??[]).map($n),tasks:(n.tasks??[]).map(Se),memory:(n.memory??[]).map(Ze)}:null}catch(n){return console.error("[Workspaces] get failed:",n),null}}async function Rd(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("workspaces.readFile",n?{workspaceId:n,filePath:t}:{path:t});return s.content?{content:s.content,mime:s.contentType??s.mime??"text/plain"}:(s.error&&console.warn("[Workspaces] readFile failed:",s.error),null)}catch(s){return console.error("[Workspaces] readFile error:",s),null}}async function Ed(e,t){if(!t){e.selectedWorkspace=null;return}const n=await Ut(e,t.id);e.selectedWorkspace=n||{...t,pinned:[],pinnedSessions:[],outputs:[],sessions:[],tasks:[]}}async function Dd(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpin":"workspaces.pin",{workspaceId:t,filePath:n}),e.selectedWorkspace?.id===t){const i=await Ut(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] pin toggle failed:",i),!1}}async function Od(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpinSession":"workspaces.pinSession",{workspaceId:t,sessionKey:n}),e.selectedWorkspace?.id===t){const i=await Ut(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] session pin toggle failed:",i),!1}}async function Kd(e,t){if(!e.client||!e.connected)return null;const n=String(t.name??"").trim();if(!n)return e.workspacesError="Workspace name is required",null;const s=t.type??"project",i=String(t.path??"").trim();try{const a=await e.client.request("workspaces.create",{name:n,type:s,...i?{path:i}:{}});if(!a.workspace)return e.workspacesError="Workspace creation returned no workspace",null;const r=Ft(a.workspace),l=e.workspaces??[],c=new Map(l.map(m=>[m.id,m]));return c.set(r.id,r),e.workspaces=Array.from(c.values()).toSorted((m,o)=>o.lastUpdated.getTime()-m.lastUpdated.getTime()),e.workspacesError=null,r}catch(a){return console.error("[Workspaces] create failed:",a),e.workspacesError=a instanceof Error?a.message:"Failed to create workspace",null}}async function Nd(e,t){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.delete",{id:t}),e.workspaces=(e.workspaces??[]).filter(n=>n.id!==t),e.selectedWorkspace?.id===t&&(e.selectedWorkspace=null),e.workspacesError=null,!0}catch(n){return console.error("[Workspaces] delete failed:",n),e.workspacesError=n instanceof Error?n.message:"Failed to delete workspace",!1}}function Fd(e,t){const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}const ol={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function Ud(e){if(!e.client||!e.connected)return[];try{const[t,n]=await Promise.all([e.client.request("tasks.list",{}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),s=new Map;for(const i of n.items)i.sourceTaskId&&(i.status==="processing"||i.status==="review"||i.status==="needs-review"||i.status==="failed")&&s.set(i.sourceTaskId,{status:i.status==="needs-review"?"review":i.status,type:i.type,roleName:ol[i.type]??i.type,queueItemId:i.id});return(t.tasks??[]).map(i=>({...Se(i),queueStatus:s.get(i.id)??null}))}catch(t){return console.error("[Workspaces] loadAllTasksWithQueueStatus failed:",t),[]}}async function Wd(e,t,n){if(!e.client||!e.connected)return null;const s=n==="complete"?"pending":"complete";try{const i=await e.client.request("tasks.update",{id:t,status:s});return Se(i)}catch(i){return console.error("[Workspaces] toggleTaskComplete failed:",i),null}}async function Bd(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.update",{id:t,...n});return Se(s)}catch(s){return console.error("[Workspaces] updateTask failed:",s),null}}async function qd(e,t){if(!e.client||!e.connected)return null;try{return await e.client.request("tasks.openSession",{taskId:t})}catch(n){return console.error("[Workspaces] startTask failed:",n),null}}async function jd(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.create",{title:t,project:n,source:"chat"});return Se(s)}catch(s){return console.error("[Workspaces] createTask failed:",s),null}}async function Hd(e,t,n){if(!e.client||!e.connected)return null;try{return await e.client.request("workspaces.browseFolder",{workspaceId:t,folderPath:n})}catch(s){return console.error("[Workspaces] browseFolder failed:",s),null}}async function zd(e,t,n,s=50){if(!e.client||!e.connected)return[];try{return(await e.client.request("workspaces.search",{workspaceId:t,query:n,limit:s})).results??[]}catch(i){return console.error("[Workspaces] search failed:",i),[]}}async function Vd(e,t,n){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.createFolder",{workspaceId:t,folderPath:n}),!0}catch(s){return console.error("[Workspaces] createFolder failed:",s),!1}}const js="godmode.ui.settings.v1";function rl(){const e=new URLSearchParams(location.search),t=(()=>{const i=e.get("gatewayUrl");return i||(typeof window.__GODMODE_DEV__<"u"?"/ws":`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}`)})(),n=e.get("token")||"",s={gatewayUrl:t,token:n,sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{System:!0,__missionControl__:!1},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]};try{const i=localStorage.getItem(js);if(!i)return s;const a=JSON.parse(i);return{gatewayUrl:e.get("gatewayUrl")||(typeof window.__GODMODE_DEV__<"u"?"/ws":typeof a.gatewayUrl=="string"&&a.gatewayUrl.trim()?a.gatewayUrl.trim():s.gatewayUrl),token:n||(typeof a.token=="string"?a.token:""),sessionKey:typeof a.sessionKey=="string"&&a.sessionKey.trim()?a.sessionKey.trim():s.sessionKey,lastActiveSessionKey:typeof a.lastActiveSessionKey=="string"&&a.lastActiveSessionKey.trim()?a.lastActiveSessionKey.trim():typeof a.sessionKey=="string"&&a.sessionKey.trim()||s.lastActiveSessionKey,theme:a.theme==="light"||a.theme==="dark"||a.theme==="system"||a.theme==="lifetrack"?a.theme:s.theme,chatFocusMode:typeof a.chatFocusMode=="boolean"?a.chatFocusMode:s.chatFocusMode,chatShowThinking:typeof a.chatShowThinking=="boolean"?a.chatShowThinking:s.chatShowThinking,splitRatio:typeof a.splitRatio=="number"&&a.splitRatio>=.4&&a.splitRatio<=.7?a.splitRatio:s.splitRatio,navCollapsed:typeof a.navCollapsed=="boolean"?a.navCollapsed:s.navCollapsed,navGroupsCollapsed:typeof a.navGroupsCollapsed=="object"&&a.navGroupsCollapsed!==null?a.navGroupsCollapsed:s.navGroupsCollapsed,openTabs:Array.isArray(a.openTabs)&&a.openTabs.every(r=>typeof r=="string")?a.openTabs:s.openTabs,tabLastViewed:typeof a.tabLastViewed=="object"&&a.tabLastViewed!==null?a.tabLastViewed:s.tabLastViewed,userName:typeof a.userName=="string"?a.userName.trim().slice(0,50):s.userName,userAvatar:typeof a.userAvatar=="string"?a.userAvatar.trim():s.userAvatar,chatParallelView:typeof a.chatParallelView=="boolean"?a.chatParallelView:s.chatParallelView,parallelLanes:Array.isArray(a.parallelLanes)&&a.parallelLanes.length===4?a.parallelLanes.map(r=>typeof r=="string"?r:null):s.parallelLanes}}catch{return s}}function ll(e){localStorage.setItem(js,JSON.stringify(e))}const cl=56,dl="quantum-particles",ul="quantum-particle";let X=null,ve=null;function B(e,t){return Math.random()*(t-e)+e}function Hs(){if(zs(),typeof document>"u")return;const e=document.querySelector(".shell");if(!e){ve=requestAnimationFrame(()=>{ve=null,Hs()});return}X=document.createElement("div"),X.className=dl,Object.assign(X.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"1",overflow:"hidden"});for(let t=0;t<cl;t++){const n=document.createElement("div");n.className=ul;const s=B(2,5),i=B(.3,.65),a=B(15,35),r=B(0,12),l=B(5,95),c=B(5,95),m=B(-150,150),o=B(-200,200),p=B(-250,250),g=B(-350,350),y=B(.8,1.5);Object.assign(n.style,{position:"absolute",left:`${l}%`,top:`${c}%`,width:`${s}px`,height:`${s}px`,borderRadius:"50%",background:`rgba(235, 158, 15, ${B(.7,1)})`,boxShadow:`0 0 ${s*3}px rgba(235, 158, 15, ${i*.7})`,opacity:"0",willChange:"transform, opacity",animation:`quantum-float ${a}s ${r}s ease-in-out infinite`}),n.style.setProperty("--particle-opacity",String(i)),n.style.setProperty("--drift-x",`${m}px`),n.style.setProperty("--drift-y",`${o}px`),n.style.setProperty("--drift-end-x",`${p}px`),n.style.setProperty("--drift-end-y",`${g}px`),n.style.setProperty("--particle-scale-mid",String(y)),X.appendChild(n)}e.prepend(X)}function zs(){ve!==null&&(cancelAnimationFrame(ve),ve=null),X&&(X.remove(),X=null)}function hl(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"lifetrack"}function Wt(e){return e==="system"?hl():e==="light"?"lifetrack":e}const $e=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,pl=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,ge=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},fl=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const i=globalThis.document??null;if(!i){t();return}const a=i.documentElement,r=i,l=pl();if(!!r.startViewTransition&&!l){let m=.5,o=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")m=$e(n.pointerClientX/window.innerWidth),o=$e(n.pointerClientY/window.innerHeight);else if(n?.element){const g=n.element.getBoundingClientRect();g.width>0&&g.height>0&&typeof window<"u"&&(m=$e((g.left+g.width/2)/window.innerWidth),o=$e((g.top+g.height/2)/window.innerHeight))}a.style.setProperty("--theme-switch-x",`${m*100}%`),a.style.setProperty("--theme-switch-y",`${o*100}%`),a.classList.add("theme-transition");const p=setTimeout(()=>{ge(a)},1e3);try{const g=r.startViewTransition?.(()=>{t()});g?.finished?g.finished.finally(()=>{clearTimeout(p),ge(a)}):(clearTimeout(p),ge(a))}catch{clearTimeout(p),ge(a),t()}return}t(),ge(a)};function ml(e,t){const n=Array.isArray(e)?[...new Set(e.map(s=>s.trim()).filter(s=>s.length>0))]:[];if(n.length===0&&t){const s=t.toLowerCase();s==="main"||s==="agent:main:main"||s.endsWith(":main")||n.push(t)}return n}function gl(e){const t={};if(!e||typeof e!="object")return t;for(const[n,s]of Object.entries(e)){const i=n.trim();!i||typeof s!="number"||!Number.isFinite(s)||(t[i]=Math.max(t[i]??0,s))}return t}function te(e,t){const n=t.sessionKey.trim()||"main",s=ml(t.openTabs,n),i=gl(t.tabLastViewed),a={...t,sessionKey:n,openTabs:s,tabLastViewed:i,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||n};e.settings=a,ll(a),a.theme!==e.theme&&(e.theme=a.theme,je(e,Wt(a.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function Vs(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&te(e,{...e.settings,lastActiveSessionKey:n})}function yl(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),n=t.get("token"),s=t.get("password"),i=t.get("session"),a=t.get("gatewayUrl");let r=!1;if(n!=null){const c=n.trim();c&&c!==e.settings.token&&te(e,{...e.settings,token:c}),t.delete("token"),r=!0}if(s!=null){const c=s.trim();c&&(e.password=c),t.delete("password"),r=!0}if(i!=null){const c=i.trim();if(c){e.sessionKey=c;const m=c.toLowerCase(),p=m==="main"||m==="agent:main:main"||m.endsWith(":main")||e.settings.openTabs.includes(c)?e.settings.openTabs:[...e.settings.openTabs,c];te(e,{...e.settings,sessionKey:c,lastActiveSessionKey:c,openTabs:p})}}if(a!=null){const c=a.trim();c&&c!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=c),t.delete("gatewayUrl"),r=!0}if(!r)return;const l=new URL(window.location.href);l.search=t.toString(),window.history.replaceState({},"",l.toString())}function vl(e,t){const n=e.tab;if(n!==t&&(e.tab=t),n==="chat"&&t!=="chat"&&e.sessionKey===L&&e._loadAllyHistory?.(),n==="dashboards"&&t!=="dashboards"){const s=e;if(s.dashboardPreviousSessionKey&&s.activeDashboardId){const i=s.dashboardPreviousSessionKey;s.dashboardPreviousSessionKey=null,s.activeDashboardId=null,s.activeDashboardManifest=null,s.activeDashboardHtml=null,s.dashboardChatOpen=!1,e.sessionKey=i}}t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?Rt(e):Et(e),t==="logs"?Dt(e):Ot(e),t==="debug"?Kt(e):Nt(e),qe(e),Qs(e,t,!1)}function bl(e,t,n){fl({nextTheme:t,applyTheme:()=>{e.theme=t,te(e,{...e.settings,theme:t}),je(e,Wt(t))},context:n,currentTheme:e.theme})}async function qe(e){if(e.tab==="overview"&&await Ys(e),(e.tab==="today"||e.tab==="my-day")&&V.emit("refresh-requested",{target:"today"}),e.tab==="workspaces"&&await al(e),e.tab==="channels"&&await $l(e),e.tab==="instances"&&await kt(e),e.tab==="sessions"&&(await K(e),await ot(e)),e.tab==="cron"&&await Bt(e),e.tab==="skills"&&(await zn(e),await rt(e)),e.tab==="agents"){const{loadRoster:t}=await T(async()=>{const{loadRoster:n}=await import("./ctrl-settings-C0Jr7LNg.js").then(s=>s.ab);return{loadRoster:n}},[],import.meta.url);await t(e)}if(e.tab==="nodes"&&(await Ee(e),await De(e),await ae(e),await Vn(e)),e.tab==="chat"&&(await Ht(e),F(e,!e.chatHasAutoScrolled),e.loadSessionResources?.()),e.tab==="trust"){const t=e,n=[];typeof t.handleTrustLoad=="function"&&n.push(t.handleTrustLoad()),n.push(xi(t)),n.push(K(t)),await Promise.all(n)}if(e.tab==="guardrails"){const t=e;typeof t.handleGuardrailsLoad=="function"&&await t.handleGuardrailsLoad()}if(e.tab==="setup"){const t=e;typeof t.handleLoadCapabilities=="function"&&t.handleLoadCapabilities()}if(e.tab==="dashboards"){const t=e;typeof t.handleDashboardsRefresh=="function"&&await t.handleDashboardsRefresh()}if(e.tab==="second-brain"){const t=e;typeof t.handleSecondBrainRefresh=="function"&&await t.handleSecondBrainRefresh()}e.tab==="config"&&(await Gn(e),await ae(e)),e.tab==="debug"&&(await Oe(e),e.eventLog=Ns()),e.tab==="logs"&&(e.logsAtBottom=!0,await At(e,{reset:!0}),_t(e,!0))}function wl(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?Xn(e):oa(window.location.pathname)}function Sl(e){e.theme=e.settings.theme??"system",je(e,Wt(e.theme))}function je(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t==="dark"?"dark":"light",t==="lifetrack"?Hs():zs()}function Tl(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&je(e,n.matches?"dark":"lifetrack")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function Al(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function kl(e,t){if(typeof window>"u")return;const n=Jn(window.location.pathname,e.basePath)??"chat";Gs(e,n),Qs(e,n,t)}function _l(e){if(typeof window>"u")return;const t=Jn(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();if(s){e.sessionKey=s;const i=e.settings.openTabs.includes(s)?e.settings.openTabs:[...e.settings.openTabs,s];te(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s,openTabs:i})}Gs(e,t)}function Gs(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?Rt(e):Et(e),t==="logs"?Dt(e):Ot(e),t==="debug"?Kt(e):Nt(e),e.connected&&qe(e)}function Qs(e,t,n){if(typeof window>"u")return;const s=Zt(Zn(t,e.basePath)),i=Zt(window.location.pathname),a=new URL(window.location.href);t==="chat"&&e.sessionKey?a.searchParams.set("session",e.sessionKey):a.searchParams.delete("session"),i!==s&&(a.pathname=s),n?window.history.replaceState({},"",a.toString()):window.history.pushState({},"",a.toString())}function z(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),window.history.replaceState({},"",s.toString())}async function Ys(e){await Promise.all([H(e,!1),kt(e),K(e),Hn(e),Oe(e)])}async function $l(e){await Promise.all([H(e,!0),Gn(e),ae(e)])}async function Bt(e){await Promise.all([H(e,!1),Hn(e),Ci(e)])}function Me(e){return e.chatSending||!!e.chatRunId}function Q(e,t){const n=t??e.sessionKey,s=e.chatMessage.trim();if(s)e.chatDrafts={...e.chatDrafts,[n]:s};else{const{[n]:i,...a}=e.chatDrafts;e.chatDrafts=a}}function Z(e,t){const n=t??e.sessionKey;e.chatMessage=e.chatDrafts[n]??""}function Js(e,t){const n=e.sessionKey,{[n]:s,...i}=e.chatDrafts;e.chatDrafts=i,n===e.sessionKey&&(e.chatMessage="")}function Xs(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function Cl(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function qt(e){e.connected&&(e.chatMessage="",await Mt(e))}function xl(e,t,n){const s=t.trim(),i=!!(n&&n.length>0);if(!s&&!i)return;const a=Date.now();e.chatQueue=[...e.chatQueue,{id:Ue(),text:s,createdAt:a,attachments:i?n?.map(l=>({...l})):void 0}];const r=[];if(s&&r.push({type:"text",text:s}),i&&n)for(const l of n)r.push({type:"image",source:{type:"base64",media_type:l.mimeType,data:l.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:r,timestamp:a}],F(e,!0)}async function bt(e,t,n){$t(e);const s=e;s.sessionKey&&s.workingSessions&&(s.workingSessions=new Set([...s.workingSessions,s.sessionKey])),n?.skipOptimisticUpdate||queueMicrotask(()=>{F(e,!0)});const i=await Cs(e,t,n?.attachments,{skipOptimisticUpdate:n?.skipOptimisticUpdate});return!i&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!i&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),i&&(Vs(e,e.sessionKey),e.chatAttachments=[]),i&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),i&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),F(e,!0),i&&!e.chatRunId&&jt(e),i&&n?.refreshSessions&&(e.refreshSessionsAfterChat=!0),i}async function jt(e){if(!e.connected||Me(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await bt(e,t.text,{attachments:t.attachments,skipOptimisticUpdate:!0})||(e.chatQueue=[t,...e.chatQueue])}function Zs(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function ei(e,t,n){if(!e.connected)return;const s=e.chatMessage,i=(t??e.chatMessage).trim(),a=e.chatAttachments??[],r=t==null?a:[],l=r.length>0;if(!i&&!l)return;if(Xs(i)){await qt(e);return}const c=Cl(i);if(t==null&&(e.chatMessage="",Js(e)),n?.queue){xl(e,i,r),Me(e)||await jt(e);return}if(Me(e)){await Mt(e),await new Promise(m=>setTimeout(m,50)),await bt(e,i,{attachments:l?r:void 0,refreshSessions:c});return}await bt(e,i,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:l?r:void 0,previousAttachments:t==null?a:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:c})}async function Ht(e){await Promise.all([N(e),K(e,{activeMinutes:0}),Re(e)]),F(e,!0)}const ti=jt;function Pl(e){const t=ss(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function Ll(e,t){const n=Xn(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function Re(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=Pl(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=Ll(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const i=await s.json(),a=typeof i.avatarUrl=="string"?i.avatarUrl.trim():"";e.chatAvatarUrl=a||null}catch{e.chatAvatarUrl=null}}const Il=Object.freeze(Object.defineProperty({__proto__:null,clearDraft:Js,flushChatQueueForEvent:ti,handleAbortChat:qt,handleSendChat:ei,isChatBusy:Me,isChatStopCommand:Xs,refreshChat:Ht,refreshChatAvatar:Re,removeQueuedMessage:Zs,restoreDraft:Z,saveDraft:Q},Symbol.toStringTag,{value:"Module"})),Ml={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},Rl={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};function ni(e){return new Date(e).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function El(e,t){const n=Lt(e),s=Fe(n.role);if(s==="system")return null;if(s==="tool"){const l=[];for(const c of n.content)if(c.name&&l.push(`**Tool:** ${c.name}`),c.text){const m=c.text.length>2e3?c.text.slice(0,2e3)+`

... (truncated)`:c.text;l.push(m)}return l.length===0?null:`<details>
<summary>Tool result</summary>

${l.join(`

`)}

</details>`}const i=s==="user"||n.role==="User"?"User":t,a=[];for(const l of n.content)if(l.type==="text"&&l.text)a.push(l.text);else if(l.type==="tool_call"&&l.name){const c=l.args?`\`${JSON.stringify(l.args).slice(0,200)}\``:"";a.push(`> **Called tool:** \`${l.name}\` ${c}`)}if(a.length===0)return null;const r=ni(n.timestamp);return`## ${i}
_${r}_

${a.join(`

`)}`}function Dl(){const e=new Date,t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${s}`}function Ol(e){return e.replace(/[^a-zA-Z0-9_-]/g,"-").replace(/-+/g,"-").slice(0,60)}function Kl(e,t,n){if(!e||e.length===0)return;const s=n||"Assistant",i=[];i.push("# Conversation Export"),i.push(`**Session:** \`${t}\`  `),i.push(`**Exported:** ${ni(Date.now())}  `),i.push(`**Assistant:** ${s}`),i.push("---");for(const m of e){const o=El(m,s);o&&i.push(o)}const a=i.join(`

`)+`
`,r=new Blob([a],{type:"text/markdown;charset=utf-8"}),l=URL.createObjectURL(r),c=document.createElement("a");c.href=l,c.download=`session-${Ol(t)}-${Dl()}.md`,document.body.appendChild(c),c.click(),requestAnimationFrame(()=>{document.body.removeChild(c),URL.revokeObjectURL(l)})}function zt(){requestAnimationFrame(()=>{document.querySelector(".session-tab--active")?.scrollIntoView({behavior:"smooth",inline:"nearest",block:"nearest"})})}function Nl(){requestAnimationFrame(()=>{document.querySelector(".chat-compose__textarea")?.focus()})}function Vt(e){Q(e);const n=`agent:main:webchat-${Ue().slice(0,8)}`;e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,n],sessionKey:n,lastActiveSessionKey:n,tabLastViewed:{...e.settings.tabLastViewed,[n]:Date.now()}}),e.sessionKey=n,e.chatMessage="",e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,cs(),e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),z(e,n),N(e),zt(),Nl()}function wt(e,t){if(ra.has(t))return Fl(e,t);const n=Zn(t,e.basePath);return f`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||(s.preventDefault(),e.setTab(t))}}
      title=${oe(t)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${es(t)}</span>
      <span class="nav-item__text">${oe(t)}</span>
    </a>
  `}function Fl(e,t){return f`
    <a
      href="#"
      class="nav-item nav-item--external"
      @click=${async n=>{if(n.preventDefault(),t==="team")try{const s=await e.client?.request("paperclip.dashboardUrl",{});s?.ready&&s.url?window.open(s.url,"_blank","noopener"):window.alert("Paperclip is not configured yet. Set PAPERCLIP_URL in your .env file to connect your AI team.")}catch{window.alert("Could not reach Paperclip. Check your connection and PAPERCLIP_URL setting.")}}}
      title="${oe(t)} (opens in new tab)"
    >
      <span class="nav-item__emoji" aria-hidden="true">${es(t)}</span>
      <span class="nav-item__text">${oe(t)}</span>
      <span class="nav-item__external-icon" aria-hidden="true">\u2197\uFE0F</span>
    </a>
  `}function si(e){const t=e.onboarding,n=e.onboarding,s=e.onboarding?!1:e.settings.chatShowThinking,i=e.onboarding?!0:e.settings.chatFocusMode,a=f`
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
  `,r=f`
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
  `,l=f`
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
  `,c=f`
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
  `;return f`
    <div class="chat-toolbar">
      <!-- New session button -->
      <button
        class="chat-toolbar__btn"
        @click=${()=>Vt(e)}
        title="Start a new session (⌘⇧P)"
        aria-label="New session"
      >
        ${l}
      </button>
      <!-- Session picker (folder dropdown) -->
      <div class="session-picker-container">
        <button
          class="chat-toolbar__btn ${e.sessionPickerOpen?"active":""}"
          @click=${m=>{const p=m.currentTarget.getBoundingClientRect();e.sessionPickerPosition={top:p.bottom+8,right:window.innerWidth-p.right},e.sessionPickerOpen||K(e),e.handleToggleSessionPicker()}}
          title="Open sessions"
          aria-label="Open sessions"
          aria-expanded=${e.sessionPickerOpen}
        >
          ${$.folderOpen}
        </button>
        ${e.sessionPickerOpen?Bl(e):v}
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
          ${c}
        </button>
        ${e.sessionSearchOpen?Wl(e):v}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),Ht(e)}}
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
        ${$.brain}
      </button>
      <!-- Focus mode toggle -->
      <button
        class="chat-toolbar__btn ${i?"active":""}"
        ?disabled=${n}
        @click=${()=>{n||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})}}
        aria-pressed=${i}
        title=${n?"Disabled during onboarding":"Toggle focus mode (hide sidebar + page header)"}
      >
        ${r}
      </button>
      <!-- Private mode toggle -->
      <button
        class="chat-toolbar__btn ${e.chatPrivateMode?"active private-mode":""}"
        @click=${()=>e.handlePrivateModeToggle()}
        aria-pressed=${e.chatPrivateMode??!1}
        title=${e.chatPrivateMode?"Private mode ON — click to destroy session":"Start a private session (ephemeral, 24h auto-delete)"}
      >
        ${$.lock}
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
        @click=${()=>{Kl(e.chatMessages,e.sessionKey,e.assistantName)}}
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
  `}function Ul(e){const t=new Date,n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=new Date(n.getTime()-864e5);return{today:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=n),yesterday:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=s&&new Date(i.updatedAt)<n),older:e.filter(i=>!i.updatedAt||new Date(i.updatedAt)<s)}}let et=null;function Wl(e){if(!e.client||!e.connected)return f`
      <div
        class="session-search-dropdown"
        style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;const t=i=>{const a=i.target.value;e.sessionSearchQuery=a,et&&clearTimeout(et),et=setTimeout(()=>{e.handleSessionSearchQuery(a)},300)},n=i=>{e.sessionSearchOpen=!1,e.sessionSearchQuery="",e.sessionSearchResults=[],Q(e),e.settings.openTabs.includes(i)?(e.sessionKey=i,e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,i],sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.sessionKey=i),Z(e,i),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),z(e,i),N(e).then(()=>{we(e),F(e,!0)})},s=i=>{const a=i.label??i.displayName??i.key,r=i.matches.length>0;return f`
      <div class="session-search-result" @click=${()=>n(i.key)}>
        <div class="session-search-result__header">
          <span class="session-search-result__name">${a}</span>
        </div>
        ${r?f`
              <div class="session-search-result__matches">
                ${i.matches.slice(0,2).map(l=>f`
                    <div class="session-search-result__match">
                      <span class="session-search-result__role">${l.role}:</span>
                      <span class="session-search-result__text">${l.text}</span>
                    </div>
                  `)}
              </div>
            `:v}
      </div>
    `};return f`
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
        ${e.sessionSearchLoading?f`
                <div class="session-search-empty">Searching...</div>
              `:e.sessionSearchQuery.trim()===""?f`
                  <div class="session-search-empty">Type to search session contents</div>
                `:e.sessionSearchResults.length===0?f`
                    <div class="session-search-empty">No results found</div>
                  `:e.sessionSearchResults.map(s)}
      </div>
    </div>
  `}function Bl(e){const t=(e.sessionPickerSearch??"").toLowerCase().trim();if(!e.client||!e.connected)return f`
      <div
        class="session-picker-dropdown"
        style="top: ${e.sessionPickerPosition?.top??0}px; right: ${e.sessionPickerPosition?.right??0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Not connected</div>
        </div>
      </div>
    `;if(e.sessionsLoading)return f`
      <div
        class="session-picker-dropdown"
        style="top: ${e.sessionPickerPosition?.top??0}px; right: ${e.sessionPickerPosition?.right??0}px;"
      >
        <div class="session-picker-list">
          <div class="session-picker-empty">Loading sessions...</div>
        </div>
      </div>
    `;let n=(e.sessionsResult?.sessions??[]).filter(g=>!e.settings.openTabs.includes(g.key));t&&(n=n.filter(g=>[g.label,g.displayName,g.key].filter(Boolean).some(b=>b.toLowerCase().includes(t))));const s=50,i=n.length,a=n.slice(0,s),r=Ul(a),l=g=>{e.sessionPickerOpen=!1,e.sessionPickerSearch="",Q(e),e.settings.openTabs.includes(g)?(e.sessionKey=g,e.applySettings({...e.settings,sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,g],sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}}),e.sessionKey=g),Z(e,g),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),z(e,g),N(e).then(()=>{we(e),F(e,!0)})},c=async(g,y)=>{if(g.stopPropagation(),!!window.confirm(`Delete session "${y}"?

Deletes the session entry and archives its transcript.`)&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.filter(_=>_.key!==y)}),e.client&&e.connected))try{await e.client.request("sessions.delete",{key:y,deleteTranscript:!0}),K(e)}catch(_){console.error("Failed to delete session:",_),K(e)}},m=g=>f`
    <div class="session-picker-item" @click=${()=>l(g.key)}>
      <span class="session-picker-item__status ${g.isActive?"active":""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${g.label??g.displayName??se.get(g.key)??g.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${g.updatedAt?f`<span class="session-picker-item__time">${Pi(g.updatedAt)}</span>`:v}
        <button
          class="session-picker-item__close"
          @click=${y=>c(y,g.key)}
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
  `,o=(g,y)=>y.length===0?v:f`
      <div class="session-picker-group">
        <div class="session-picker-group__header">${g}</div>
        ${Ke(y,b=>b.key,m)}
      </div>
    `,p=r.today.length+r.yesterday.length+r.older.length;return f`
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
        ${p===0?f`
                <div class="session-picker-empty">No other sessions</div>
              `:f`
              ${o("Today",r.today)}
              ${o("Yesterday",r.yesterday)}
              ${o("Older",r.older)}
              ${i>s?f`<div class="session-picker-overflow">
                    Showing ${s} of ${i} sessions. Use search to find more.
                  </div>`:v}
            `}
      </div>
    </div>
  `}const ql=["system","light","dark","lifetrack"];function ii(e){const t=Math.max(0,ql.indexOf(e.theme)),n=s=>i=>{const r={element:i.currentTarget};(i.clientX||i.clientY)&&(r.pointerClientX=i.clientX,r.pointerClientY=i.clientY),e.setTheme(s,r)};return f`
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
          ${zl()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${jl()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${Hl()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="lifetrack"?"active":""}"
          @click=${n("lifetrack")}
          aria-pressed=${e.theme==="lifetrack"}
          aria-label="Lifetrack theme"
          title="Lifetrack"
        >
          ${Vl()}
        </button>
      </div>
    </div>
  `}function jl(){return f`
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
  `}function Hl(){return f`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function zl(){return f`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function Vl(){return f`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"></path>
      <path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67L19 15z"></path>
    </svg>
  `}const tt=Object.freeze(Object.defineProperty({__proto__:null,createNewSession:Vt,renderChatControls:si,renderTab:wt,renderThemeToggle:ii,scrollActiveTabIntoView:zt},Symbol.toStringTag,{value:"Module"})),nt=new Set;function Cn(e){if(!(!e.connected||!e.client||!e.settings.chatParallelView))for(const t of e.settings.parallelLanes){const n=t?.trim();if(!n)continue;const i=ie(e.sessionsResult?.sessions,n)?.key??n;if(ee.has(n)||ee.has(i)||nt.has(i))continue;nt.add(i);const r=e.client;_s(r,i).then(l=>{i!==n&&l.length>0&&ee.set(n,l)}).finally(()=>{nt.delete(i),e.applySettings({...e.settings})})}}function Gl(e){e.basePath=wl(),e._urlSettingsApplied||(yl(e),e._urlSettingsApplied=!0),kl(e,!0),Sl(e),Tl(e),window.addEventListener("popstate",e.popStateHandler),e.keydownHandler=t=>{if(e.tab!=="chat")return;if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="p"){t.preventDefault(),Vt(e);return}if(!t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.key<"1"||t.key>"9")return;const n=parseInt(t.key,10)-1,s=e.settings.openTabs;if(n>=s.length)return;const i=s[n];i!==e.sessionKey&&(t.preventDefault(),Q(e),e.sessionKey=i,Z(e,i),e.chatLoading=!0,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.loadAssistantIdentity(),z(e,i),N(e).then(()=>{be(e)}))},window.addEventListener("keydown",e.keydownHandler),We(e),e.tab==="nodes"&&Rt(e),e.tab==="logs"&&Dt(e),e.tab==="debug"&&Kt(e)}function Ql(e){rs(e)}function Yl(e){window.removeEventListener("popstate",e.popStateHandler),window.removeEventListener("keydown",e.keydownHandler),e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null),e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null),Et(e),Ot(e),Nt(e),Al(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function ie(e,t){if(!e||!t)return;const n=e.find(r=>r.key===t);if(n)return n;const s=t.split(":"),i=s[s.length-1];if(i&&i.length>=4){const r=e.find(l=>l.key===i||l.key.endsWith(`:${i}`));if(r)return r}const a=t.replace(/^webchat:/,"");if(a!==t){const r=e.find(l=>l.key.endsWith(a)||l.key.endsWith(`:${a}`));if(r)return r}}function Jl(e,t){if(!t||t.length===0)return;const n=c=>{const m=c.toLowerCase();return m==="main"||m==="agent:main:main"||m.endsWith(":main")},s=(c,m)=>{const o=c?.sessionId?.trim();if(o)return`session:${o}`;if(c){const g=[c.kind,c.surface,c.subject,c.room,c.space,c.label,c.displayName].map(y=>String(y??"").trim().toLowerCase()).join("|");if(g.replace(/\|/g,"").length>0)return`meta:${g}`}return`key:${m}`};let i=!1;const a=new Map,r=[];for(const c of e.settings.openTabs){const m=c.trim();if(!m){i=!0;continue}if(n(m)){i=!0;continue}const o=ie(t,m),p=o?.key??m;p!==c&&(i=!0);const g=s(o,p);if(a.has(g)){i=!0;continue}a.set(g,p),r.push(p)}const l=r.length!==e.settings.openTabs.length;if(i||l){const c={};for(const[b,_]of Object.entries(e.settings.tabLastViewed)){const I=b.trim();if(!I||typeof _!="number"||!Number.isFinite(_))continue;const U=ie(t,I),C=s(U,U?.key??I),D=a.get(C)??U?.key??I;c[D]=Math.max(c[D]??0,_)}const m=ie(t,e.sessionKey),o=s(m,m?.key??e.sessionKey.trim()),p=a.get(o)??m?.key??(e.sessionKey.trim()||r[0]||"main"),y=p==="main"||p.endsWith(":main")||r.includes(p)?p:r[0]||"main";e.applySettings({...e.settings,openTabs:r,sessionKey:y,lastActiveSessionKey:y,tabLastViewed:c}),e.sessionKey!==y&&(e.sessionKey=y)}}function Xl(e,t){if((t.has("sessionsResult")||t.has("settings"))&&e.sessionsResult?.sessions&&Jl(e,e.sessionsResult.sessions),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.settings.chatParallelView&&Cn(e),t.has("settings")&&e.connected&&e.settings.chatParallelView){const n=t.get("settings"),s=n?!n.chatParallelView:!0,i=!n||n.parallelLanes.some((a,r)=>a!==e.settings.parallelLanes[r]);(s||i)&&Cn(e)}if(t.has("sessionPickerOpen")&&(e.sessionPickerOpen?setTimeout(()=>{e.sessionPickerOpen&&(e.sessionPickerClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-picker-container"),a=s.closest(".session-picker-dropdown");!i&&!a&&(e.sessionPickerOpen=!1)},document.addEventListener("click",e.sessionPickerClickOutsideHandler,!0))},0):e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null)),t.has("sessionSearchOpen")&&(e.sessionSearchOpen?setTimeout(()=>{e.sessionSearchOpen&&(e.sessionSearchClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-search-container"),a=s.closest(".session-search-dropdown");!i&&!a&&(e.sessionSearchOpen=!1)},document.addEventListener("click",e.sessionSearchClickOutsideHandler,!0))},0):e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null)),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab==="chat"&&!e.chatLoading&&setTimeout(()=>{const n=e;n.tab==="chat"&&!n.chatLoading&&N(n).then(()=>{be(e)})},500),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab!=="chat"&&qe(e),e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("sessionKey")||t.has("tab"))){const n=t.has("tab"),s=t.has("sessionKey"),i=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;let a=!1;if(t.has("chatMessages")){const r=e.chatMessages;r[r.length-1]?.role==="user"&&(a=!0)}t.has("chatStream")&&(a=!1),(n||s||i)&&we(e),F(e,n||s||i||a||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&_t(e,t.has("tab")||t.has("logsAutoFollow"))}function xn(e){return e.charAt(0).toUpperCase()||"A"}function Pn(e){if(!e)return"";const t=new Date(e),n=t.getHours(),s=t.getMinutes().toString().padStart(2,"0"),i=n>=12?"PM":"AM";return`${n%12||12}:${s} ${i}`}function Zl(e){e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,120)}px`}function ai(e,t=80){return e.scrollHeight-e.scrollTop-e.clientHeight<t}function oi(e){const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)}const Ln=new WeakMap;function ec(e){requestAnimationFrame(()=>{const t=document.querySelector(".ally-panel, .ally-inline");if(!t)return;const n=t.querySelector(".ally-panel__messages");if(!n)return;const s=Ln.get(n),i=s??{lastMsgCount:0,lastStreamLen:0},a=e.messages.length,r=e.stream?.length??0,l=a!==i.lastMsgCount||r>i.lastStreamLen;Ln.set(n,{lastMsgCount:a,lastStreamLen:r}),l&&(!s||ai(n,120))&&oi(t)})}function tc(e){const t=e.currentTarget,n=t.querySelector(".ally-jump-bottom");n&&n.classList.toggle("ally-jump-bottom--visible",!ai(t))}function ri(e,t){return e.allyAvatar?f`<img class=${t==="bubble"?"ally-bubble__avatar":"ally-panel__header-avatar"} src=${e.allyAvatar} alt=${e.allyName} />`:t==="header"?f`<span class="ally-panel__header-initial">${xn(e.allyName)}</span>`:f`${xn(e.allyName)}`}function In(e){if(e.role==="assistant"&&e.content){const t=q(e.content);return f`<div class="ally-msg__content chat-text">${pe(t)}</div>`}return f`<span class="ally-msg__content">${e.content}</span>`}function nc(e,t){return!e.actions||e.actions.length===0?v:f`
    <div class="ally-msg__actions">
      ${e.actions.map(n=>f`
          <button
            type="button"
            class="ally-msg__action-btn"
            @click=${()=>t?.(n.action,n.target,n.method,n.params)}
          >
            ${n.label}
          </button>
        `)}
    </div>
  `}function sc(e,t,n){if(e.isNotification)return f`
      <div class="ally-msg ally-msg--notification" data-idx=${t}>
        ${In(e)}
        ${nc(e,n)}
        ${e.timestamp?f`<div class="ally-msg__time">${Pn(e.timestamp)}</div>`:v}
      </div>
    `;const s=e.role==="user"?"ally-msg--user":"ally-msg--assistant";return f`
    <div class="ally-msg ${s}" data-idx=${t}>
      ${In(e)}
      ${e.timestamp?f`<div class="ally-msg__time">${Pn(e.timestamp)}</div>`:v}
    </div>
  `}function ic(e){if(!e)return v;const t=ls(e);return f`
    <div class="ally-msg ally-msg--streaming">
      <div class="ally-msg__content chat-text">${pe(t)}</div>
    </div>
  `}function ac(e){return e.connected?v:f`<div class="ally-panel__status ally-panel__status--disconnected">Disconnected</div>`}function oc(){return f`
    <div class="ally-msg ally-msg--assistant ally-msg--reading-indicator">
      <span class="chat-reading-indicator__dots">
        <span></span><span></span><span></span>
      </span>
    </div>
  `}function rc(e,t){const n=e.clipboardData?.items;if(!n)return;const s=[];for(const i of Array.from(n)){if(!i.type.startsWith("image/"))continue;const a=i.getAsFile();if(!a)continue;e.preventDefault();const r=new FileReader,l=`paste-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;r.onload=()=>{const c=r.result;t.onAttachmentsChange([...t.attachments,{id:l,dataUrl:c,mimeType:a.type,fileName:a.name||"screenshot.png",status:"ready"}])},r.readAsDataURL(a),s.push({id:l,dataUrl:"",mimeType:a.type,fileName:a.name,status:"reading"})}s.length>0&&t.onAttachmentsChange([...t.attachments,...s])}function lc(e){return e.attachments.length===0?v:f`
    <div class="ally-panel__attachments">
      ${e.attachments.map(t=>f`
          <div class="ally-panel__attachment">
            ${t.dataUrl?f`<img src=${t.dataUrl} alt=${t.fileName??"attachment"} class="ally-panel__attachment-img" />`:f`<span class="ally-panel__attachment-loading">...</span>`}
            <button
              type="button"
              class="ally-panel__attachment-remove"
              title="Remove"
              @click=${()=>e.onAttachmentsChange(e.attachments.filter(n=>n.id!==t.id))}
            >${$.x}</button>
          </div>
        `)}
    </div>
  `}function cc(e){const t=e.connected?`Message ${e.allyName}...`:"Reconnecting...",n=e.draft.trim()||e.attachments.length>0;return f`
    ${lc(e)}
    <div class="ally-panel__input">
      <textarea
        class="ally-panel__textarea"
        .value=${e.draft}
        ?disabled=${!e.connected||e.sending}
        placeholder=${t}
        rows="1"
        @input=${s=>{const i=s.target;Zl(i),e.onDraftChange(i.value)}}
        @paste=${s=>rc(s,e)}
        @keydown=${s=>{s.key==="Enter"&&(s.isComposing||s.keyCode===229||s.shiftKey||e.connected&&(s.preventDefault(),e.onSend()))}}
      ></textarea>
      <button
        class="ally-panel__send-btn"
        type="button"
        ?disabled=${!e.connected||!n&&!e.sending}
        title="Send"
        @click=${()=>e.onSend()}
      >
        ${$.arrowUp}
      </button>
    </div>
  `}function dc(e){return f`
    <div class="ally-bubble">
      <button
        type="button"
        class="ally-bubble__btn"
        title="Chat with ${e.allyName}"
        aria-label="Open ${e.allyName} chat"
        @click=${()=>e.onToggle()}
      >
        ${ri(e,"bubble")}
        ${e.isWorking?f`<span class="ally-bubble__working"></span>`:v}
      </button>
      ${e.unreadCount>0?f`<span class="ally-bubble__badge">${e.unreadCount>99?"99+":e.unreadCount}</span>`:v}
    </div>
  `}function li(e){return ec(e),f`
    <div class="ally-panel__header">
      <div class="ally-panel__header-left">
        ${ri(e,"header")}
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

    ${ac(e)}

    <div class="ally-panel__messages" @scroll=${tc}>
      ${e.messages.length===0&&!e.stream?f`<div class="ally-panel__empty">
            Start a conversation with ${e.allyName}
          </div>`:v}
      ${e.messages.map((t,n)=>sc(t,n,e.onAction))}
      ${e.stream?ic(e.stream):v}
      ${(e.isWorking||e.sending)&&!e.stream?oc():v}
      <button
        type="button"
        class="ally-jump-bottom"
        title="Jump to latest"
        @click=${t=>{const n=t.currentTarget.closest(".ally-panel, .ally-inline");n&&oi(n)}}
      >${$.chevronDown}</button>
    </div>

    ${cc(e)}
  `}function uc(e){return e.open?f`
    <div class="ally-panel">
      ${li(e)}
    </div>
  `:dc(e)}function hc(e){return e.open?f`
    <div class="ally-inline">
      ${li(e)}
    </div>
  `:v}function pc(e){return typeof e.content=="string"?e.content:typeof e.text=="string"?e.text:Array.isArray(e.content)?e.content.map(t=>typeof t.text=="string"?t.text:"").join(`
`):""}const fc=["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"];function mc(e){const t=typeof e.role=="string"?e.role.toLowerCase():"";if(t!=="user"&&t!=="system")return!1;const n=pc(e).trim();if(!n)return!1;let s=n;if((n.includes("<system-context")||n.includes("<godmode-context"))&&(s=n.replace(/<system-context[\s\S]*?<\/system-context>/gi,"").replace(/<godmode-context[\s\S]*?<\/godmode-context>/gi,"").trim(),!s)||s.startsWith("Read HEARTBEAT.md")||s.startsWith("Read CONSCIOUSNESS.md")||s.startsWith("Pre-compaction memory flush")||s.startsWith("pre-compaction memory flush")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(s)||s==="NO_REPLY"||s.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(s)||s.startsWith("# WORKING.md")||s.startsWith("# MISTAKES.md")||/(?:VERIFIED|FIXED|NEW):\s/.test(s)&&/✅|🟡|☑/.test(s)&&s.length>300||/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(s)||/^\[GodMode Context:[^\]]*\]\s*$/.test(s)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(s)||/^##?\s*Persistence Protocol/i.test(s)||/^##?\s*Core (?:Behaviors|Principles)/i.test(s)||/^##?\s*Your Role as \w+/i.test(s)||/^##\s*Your Team\s*\(Agent Roster\)/i.test(s)&&s.indexOf(`

## `)===-1||/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)&&s.length>200||/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(s))return!0;const i=s.toLowerCase();return fc.filter(a=>i.includes(a)).length>=2}const Mn=25*1024*1024,Rn=50*1024*1024,En=20;function st(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:e<1024*1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:`${(e/(1024*1024*1024)).toFixed(1)} GB`}function Gt(e,t=0){const n=[],s=[];let i=t;const a=Array.from(e);for(const r of a){if(n.length>=En){s.push(`Maximum ${En} files allowed per upload`);break}if(r.size>Mn){s.push(`"${r.name}" is too large (${st(r.size)}). Max ${st(Mn)}. For larger files, mention the file path instead.`);continue}if(i+r.size>Rn){s.push(`Total upload size exceeds ${st(Rn)} limit`);break}i+=r.size,n.push(r)}return{validFiles:n,errors:s}}const gc=new Set(["md","markdown","mdx"]),yc=new Set(["htm","html"]),vc=new Set(["avif","bmp","gif","heic","heif","jpeg","jpg","png","svg","svgz","webp"]);function ci(e){const t=e.replaceAll("\\","/").trim();if(!t)return e;const n=t.split("/");return n[n.length-1]||t}function bc(e){if(!e)return null;const n=e.trim().toLowerCase().split(".").pop()??"";return n?gc.has(n)?"text/markdown":yc.has(n)?"text/html":vc.has(n)?n==="svg"||n==="svgz"?"image/svg+xml":n==="jpg"?"image/jpeg":`image/${n}`:n==="pdf"?"application/pdf":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":null:null}function di(e){const t=e.mimeType?.split(";")[0]?.trim().toLowerCase()??"";if(t)return t;const n=e.content?.trim()??"";if(n.startsWith("data:image/")){const s=/^data:(image\/[^;]+);/i.exec(n);return s?.[1]?s[1].toLowerCase():"image/*"}return bc(e.filePath??null)??"text/markdown"}function wc(e){if(!e.startsWith("file://"))return null;let t=e.slice(7);return t.startsWith("/~/")&&(t="~"+t.slice(2)),decodeURIComponent(t)}function Sc(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const i=s.getAttribute("href");if(!i)return;const a=wc(i);a&&(e.preventDefault(),e.stopPropagation(),t(a))}function Tc(e){if(e.error)return f`
      <div class="callout danger">${e.error}</div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(!e.content)return f`
      <div class="muted">No content available</div>
    `;const t=di(e),n=e.content,s=n.trim();if(t.startsWith("image/"))return s.startsWith("data:image/")?f`
        <div class="sidebar-image">
          <img src=${s} alt=${ci(e.filePath??"Image preview")} />
        </div>
      `:f`
      <div class="callout">
        Image preview unavailable for this payload format.
      </div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(t==="application/pdf")return s.startsWith("data:application/pdf")?f`<iframe
        class="sidebar-html-frame sidebar-pdf-frame"
        src=${s}
        type="application/pdf"
      ></iframe>`:f`
      <div class="callout">
        PDF preview unavailable. Use "Open in Browser" to view.
      </div>
    `;if(t==="text/html"||t==="application/xhtml+xml"){const i=new Blob([n],{type:"text/html"}),a=URL.createObjectURL(i);return f`<iframe
      class="sidebar-html-frame"
      src=${a}
      sandbox="allow-same-origin allow-top-navigation-by-user-activation allow-popups"
      @load=${r=>{URL.revokeObjectURL(a);const l=r.target;try{const c=l.contentDocument?.documentElement?.scrollHeight;c&&(l.style.height=`${c}px`)}catch{}}}
    ></iframe>`}if(t==="text/markdown"||t==="text/x-markdown"){const i=la(n);return f`<div
      class="sidebar-markdown"
      @click=${a=>Sc(a,e.onOpenFile)}
    >${pe(q(i))}</div>`}return f`<pre class="sidebar-plain">${n}</pre>`}function Ac(e){const t=di(e);return t==="text/html"||t==="application/xhtml+xml"}function kc(e){const t=new Blob([e],{type:"text/html"}),n=URL.createObjectURL(t);window.open(n,"_blank","noopener,noreferrer")}function St(e){const t=e.title?.trim()||"Tool Output",n=Ac(e)&&e.content;return f`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${t}</div>
          ${e.filePath?f`<div class="sidebar-path" title=${e.filePath}>${e.filePath}</div>`:v}
        </div>
        <div class="sidebar-header-actions">
          ${e.onPushToDrive&&e.filePath?f`<div class="sidebar-drive-wrap">
                <button
                  class="btn sidebar-open-browser-btn${e.driveUploading?" sidebar-drive-uploading":""}"
                  title="Push to Google Drive"
                  ?disabled=${e.driveUploading}
                  @click=${()=>e.driveUploading?void 0:e.onToggleDrivePicker?e.onToggleDrivePicker():e.onPushToDrive(e.filePath)}
                >${e.driveUploading?"Uploading...":"⬆ Drive"}</button>
                ${e.showDrivePicker&&e.driveAccounts&&!e.driveUploading?f`<div class="sidebar-drive-picker">
                      ${e.driveAccounts.length===0?f`<div class="sidebar-drive-item sidebar-drive-empty">No Google accounts configured</div>`:e.driveAccounts.map(s=>f`
                              <button
                                class="sidebar-drive-item"
                                @click=${()=>{e.onPushToDrive(e.filePath,s.email),e.onToggleDrivePicker?.()}}
                                title=${s.email}
                              >
                                <span class="sidebar-drive-label">${s.email.split("@")[0]}</span>
                                <span class="sidebar-drive-domain">@${s.email.split("@")[1]}</span>
                              </button>
                            `)}
                    </div>`:v}
              </div>`:v}
          ${n?f`<button
                class="btn sidebar-open-browser-btn"
                title="Open in browser tab"
                @click=${()=>kc(e.content)}
              >Open in Browser</button>`:v}
          <button @click=${e.onClose} class="btn" title="Close sidebar">
            ${$.x}
          </button>
        </div>
      </div>
      ${_c(e)}
      <div class="sidebar-content">${Tc(e)}</div>
    </div>
  `}function _c(e){if(e.resource)return f`
      <div class="sidebar-resource-bar">
        <span class="resource-type-badge">${e.resource.type.replace("_"," ")}</span>
        <span style="flex: 1;">${e.resource.title}</span>
        <button
          class="sidebar-pin-btn${e.resource.pinned?" pinned":""}"
          title=${e.resource.pinned?"Unpin":"Pin"}
          @click=${()=>e.onToggleResourcePin?.(e.resource.id,!e.resource.pinned)}
        >${e.resource.pinned?"★":"☆"}</button>
      </div>
    `;if(e.filePath&&e.onSaveAsResource){const t=e.title?.trim()||ci(e.filePath);return f`
      <div class="sidebar-resource-bar">
        <button
          class="sidebar-save-resource-btn"
          @click=${()=>e.onSaveAsResource(e.filePath,t)}
        >Save as Resource</button>
      </div>
    `}return v}var $c=Object.defineProperty,Cc=Object.getOwnPropertyDescriptor,Te=(e,t,n,s)=>{for(var i=s>1?void 0:s?Cc(t,n):t,a=e.length-1,r;a>=0;a--)(r=e[a])&&(i=(s?r(t,n,i):r(i))||i);return s&&i&&$c(t,n,i),i};let le=class extends Qn{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.direction="horizontal",this.isDragging=!1,this.startPos=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startPos=this.direction==="vertical"?e.clientY:e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=this.direction==="vertical",s=n?t.getBoundingClientRect().height:t.getBoundingClientRect().width,r=((n?e.clientY:e.clientX)-this.startPos)/s;let l=this.startRatio+r;l=Math.max(this.minRatio,Math.min(this.maxRatio,l)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:l},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return f``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};le.styles=na`
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
  `;Te([Ne({type:Number})],le.prototype,"splitRatio",2);Te([Ne({type:Number})],le.prototype,"minRatio",2);Te([Ne({type:Number})],le.prototype,"maxRatio",2);Te([Ne({type:String})],le.prototype,"direction",2);le=Te([Yn("resizable-divider")],le);function xc(e){const t=e.includes("/")?e.split("/").pop():e,n=t.match(/claude-(\w+)-(\d+)-(\d+)/);return n?`${n[1].charAt(0).toUpperCase()+n[1].slice(1)} ${n[2]}.${n[3]}`:t.replace(/^claude-/,"").replace(/-/g," ")}const Pc=5e3;function Dn(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function Lc(e){const t=e.sessions?.sessions?.find(i=>i.key===e.sessionKey);if(!t)return null;const n=t.totalTokens??0,s=t.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return s<=0?null:n/s}function Ic(e){const t=Lc(e);if(t===null)return v;const n=Math.round(t*100),s=n>=90?"danger":n>=70?"warn":"ok",i=e.sessions?.sessions?.find(o=>o.key===e.sessionKey),a=i?.totalTokens??0,r=i?.contextTokens??e.sessions?.defaults?.contextTokens??2e5,l=n>=90?"Soul + identity only":n>=70?"P0 + P1 active":"Full context",c=n>=90?f`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--danger">
          Schedule, tasks, skill cards trimmed
        </span>`:n>=70?f`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--warn">
            Meetings, cron, queue review trimmed
          </span>`:v,m=f`
    <span class="chat-context-badge__tier ${n<70?"active":"trimmed"}">P3 Safety nudges, onboarding</span>
    <span class="chat-context-badge__tier ${n<70?"active":"trimmed"}">P2 Meetings, cron, queue review</span>
    <span class="chat-context-badge__tier ${n<90?"active":"trimmed"}">P1 Schedule, tasks, skill cards</span>
    <span class="chat-context-badge__tier active">P0 Soul, identity, memory</span>
  `;return f`
    <button
      type="button"
      class="chat-context-badge chat-context-badge--${s}"
      role="status"
      aria-label="Context window: ${n}% used (${l}). Click to compact."
      @click=${()=>e.onCompact?.()}
      ?disabled=${!e.connected}
    >
      ${n}%
      <span class="chat-context-badge__bar">
        <span class="chat-context-badge__bar-fill chat-context-badge__bar-fill--${s}" style="width:${n}%"></span>
      </span>
      <span class="chat-context-badge__tooltip">
        <span class="chat-context-badge__tooltip-header">
          ${a.toLocaleString()} / ${r.toLocaleString()} tokens
        </span>
        ${c}
        <span class="chat-context-badge__tier-list">${m}</span>
        <span class="chat-context-badge__tooltip-action">Click to compact</span>
      </span>
    </button>
  `}function Mc(e){return e?e.active?f`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${$.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<Pc?f`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${$.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `:v:v}function Qt(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function Rc(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy")}function Ec(e,t){e.preventDefault(),e.stopPropagation(),t.classList.add("chat--drag-over")}function Dc(e,t){e.preventDefault(),e.stopPropagation();const n=t.getBoundingClientRect();(e.clientX<=n.left||e.clientX>=n.right||e.clientY<=n.top||e.clientY>=n.bottom)&&t.classList.remove("chat--drag-over")}function Oc(e,t){e.preventDefault(),e.stopPropagation(),e.currentTarget.classList.remove("chat--drag-over");const s=e.dataTransfer?.files;if(!s||s.length===0||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((o,p)=>o+(p.dataUrl?.length??0)*.75,0),{validFiles:r,errors:l}=Gt(s,a);for(const o of l)t.showToast?.(o,"error");if(r.length===0)return;const c=[];let m=r.length;for(const o of r){const p=new FileReader;p.addEventListener("load",()=>{const g=p.result;c.push({id:Qt(),dataUrl:g,mimeType:o.type||"application/octet-stream",fileName:o.name}),m--,m===0&&t.onAttachmentsChange?.([...i,...c])}),p.addEventListener("error",()=>{t.showToast?.(`Failed to read "${o.name}"`,"error"),m--,m===0&&c.length>0&&t.onAttachmentsChange?.([...i,...c])}),p.readAsDataURL(o)}}function Kc(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let o=0;o<n.length;o++){const p=n[o];if(p.type.startsWith("image/")){const g=p.getAsFile();g&&s.push(g)}}if(s.length===0)return;e.preventDefault();const i=t.attachments??[],a=i.reduce((o,p)=>o+(p.dataUrl?.length??0)*.75,0),{validFiles:r,errors:l}=Gt(s,a);for(const o of l)t.showToast?.(o,"error");if(r.length===0)return;const c=[];let m=r.length;for(const o of r){const p=new FileReader;p.addEventListener("load",()=>{const g=p.result;c.push({id:Qt(),dataUrl:g,mimeType:o.type,fileName:o.name||"pasted-image"}),m--,m===0&&t.onAttachmentsChange?.([...i,...c])}),p.addEventListener("error",()=>{t.showToast?.("Failed to read pasted image","error"),m--,m===0&&c.length>0&&t.onAttachmentsChange?.([...i,...c])}),p.readAsDataURL(o)}}function Nc(e,t){const n=e.target,s=n.files;if(!s||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((o,p)=>o+(p.dataUrl?.length??0)*.75,0),{validFiles:r,errors:l}=Gt(s,a);for(const o of l)t.showToast?.(o,"error");if(r.length===0){n.value="";return}const c=[];let m=r.length;for(const o of r){const p=new FileReader;p.addEventListener("load",()=>{const g=p.result;c.push({id:Qt(),dataUrl:g,mimeType:o.type||"application/octet-stream",fileName:o.name}),m--,m===0&&t.onAttachmentsChange?.([...i,...c])}),p.addEventListener("error",()=>{t.showToast?.(`Failed to read "${o.name}"`,"error"),m--,m===0&&c.length>0&&t.onAttachmentsChange?.([...i,...c])}),p.readAsDataURL(o)}n.value=""}function Fc(e){const t=e.attachments??[];return t.length===0?v:f`
    <div class="chat-attachments">
      ${t.map(n=>{const s=n.mimeType.startsWith("image/"),i=n.fileName||"file",a=i.length>40?i.slice(0,37)+"...":i;return f`
          <div class="chat-attachment ${s?"":"chat-attachment--file"}">
            ${s?f`<img src=${n.dataUrl} alt="Attachment preview" class="chat-attachment__img" />`:f`<div class="chat-attachment__file">
                  ${$.fileText}
                  <span class="chat-attachment__filename" title=${i}>${a}</span>
                </div>`}
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const r=(e.attachments??[]).filter(l=>l.id!==n.id);e.onAttachmentsChange?.(r)}}
            >
              ${$.x}
            </button>
          </div>
        `})}
    </div>
  `}function Uc(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function Wc(e){const t=e.href;if(t){if(e.target==="_blank"){window.open(t,"_blank","noopener,noreferrer");return}window.location.assign(t)}}function Bc(e){const t=e.trim();return!t||t.includes(`
`)?null:t.startsWith("/")||t.startsWith("~/")||t.startsWith("./")||t.startsWith("../")||/^[a-z]:[\\/]/i.test(t)||/^[^:\s]+\/[^\s]+$/.test(t)&&/\.[a-z0-9]{1,12}$/i.test(t)||/^[^\s/\\:*?"<>|]+\.[a-z0-9]{1,12}$/i.test(t)&&t.length<=100?t:null}async function qc(e,t){const n=e.target,s=n instanceof Element?n:n instanceof Node?n.parentElement:null;if(!s||!t.onMessageLinkClick||!Uc(e))return;const i=s.closest("a");if(i instanceof HTMLAnchorElement){if(i.hasAttribute("download"))return;const c=i.getAttribute("href");if(!c)return;if(t.onOpenProof)try{const o=c.match(/(?:proofeditor\.ai|127\.0\.0\.1:\d+|localhost:\d+)\/d\/([a-zA-Z0-9_-]+)/);if(o){e.preventDefault(),t.onOpenProof(o[1]);return}}catch{}try{const o=new URL(c,window.location.href);if(/^https?:$/.test(o.protocol)&&o.origin!==window.location.origin){e.preventDefault(),window.open(o.href,"_blank","noopener,noreferrer");return}}catch{}e.preventDefault(),await t.onMessageLinkClick(c)||Wc(i);return}const a=s.closest("code");if(!(a instanceof HTMLElement))return;const r=(a.textContent??"").trim();if(/^https?:\/\/\S+$/i.test(r)){e.preventDefault(),window.open(r,"_blank","noopener,noreferrer");return}if(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(\/\S*)?$/i.test(r)){e.preventDefault(),window.open(`https://${r}`,"_blank","noopener,noreferrer");return}const l=Bc(r);l&&(e.preventDefault(),await t.onMessageLinkClick(l))}const jc={html_report:"📊",plan:"📋",analysis:"🔍",code:"💻",doc:"📝",data:"📦",image:"🖼️",script:"⚙️"};function Hc(e){const t=e.sessionResources;if(!t||t.length===0)return v;if(e.sessionResourcesCollapsed)return f`
      <div class="session-resources-strip">
        <div class="session-resources-header">
          <span class="session-resources-label">Resources (${t.length})</span>
          <button class="session-resources-toggle" @click=${e.onToggleSessionResources}>▲</button>
        </div>
      </div>
    `;const n=e.sessionResourcesShowAll,s=n?t:t.slice(0,5);return f`
    <div class="session-resources-strip">
      <div class="session-resources-header">
        <span class="session-resources-label">Resources (${t.length})</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          ${t.length>5?f`<button class="session-resources-view-all" @click=${e.onViewAllResources}>${n?"Show less":"View all"}</button>`:v}
          <button class="session-resources-toggle" @click=${e.onToggleSessionResources}>▼</button>
        </div>
      </div>
      <div class="session-resources-cards"${n?f` style="flex-wrap: wrap;"`:v}>
        ${s.map(i=>f`
            <button
              class="session-resource-chip"
              @click=${()=>e.onSessionResourceClick?.(i)}
            >
              <span>${jc[i.type]||"📄"}</span>
              <span>${i.title}</span>
            </button>
          `)}
      </div>
    </div>
  `}function zc(e){const t=e.connected,n=e.sending||e.stream!==null,s=!!(e.canAbort&&e.onAbort),a=e.sessions?.sessions?.find(y=>y.key===e.sessionKey)?.reasoningLevel??"off",r=e.showThinking&&a!=="off",l={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},c=(e.attachments?.length??0)>0,m=e.connected?c?"Add a message or paste more images...":"Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",o=e.splitRatio??.6,p=!!(e.sidebarOpen&&e.onCloseSidebar),g=f`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
      @click=${y=>{qc(y,e)}}
    >
      ${e.loading?f`
              <div class="muted">Loading chat…</div>
            `:v}
      ${Ke(Yc(e),y=>y.key,y=>{try{if(y.kind==="reading-indicator")return cr(l,e.currentToolInfo);if(y.kind==="stream")return dr(y.text,y.startedAt,e.onOpenSidebar,l,e.currentToolInfo);if(y.kind==="compaction-summary")return fr(y.message);if(y.kind==="group"){const b=e.resolveImageUrl?(_,I)=>e.resolveImageUrl(_,I):void 0;return ur(y,{onOpenSidebar:e.onOpenSidebar,onOpenFile:e.onOpenFile,onOpenProof:e.onOpenProof,onPushToDrive:e.onPushToDrive,onImageClick:e.onImageClick,resolveImageUrl:b,showReasoning:r,assistantName:e.assistantName,assistantAvatar:l.avatar,userName:e.userName,userAvatar:e.userAvatar})}return v}catch(b){return console.error("[chat] item render error:",b,y.key),v}})}
    </div>
  `;return f`
    <section 
      class="card chat"
      @dragover=${Rc}
      @dragenter=${y=>Ec(y,y.currentTarget)}
      @dragleave=${y=>Dc(y,y.currentTarget)}
      @drop=${y=>Oc(y,e)}
    >
      ${e.privateMode?f`<div class="callout callout--private" aria-live="polite">
            <span style="margin-right:6px">🔒</span>
            <strong>Private Session</strong> — Nothing from this conversation will be saved to memory or vault.
          </div>`:v}

      ${e.disabledReason?f`<div class="callout">${e.disabledReason}</div>`:v}

      ${e.error?f`<div class="callout danger">${e.error}</div>`:v}

      ${Mc(e.compactionStatus)}

      ${e.focusMode?f`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${$.x}
            </button>
          `:v}

      <div
        class="chat-split-container ${p?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${p?`0 0 ${o*100}%`:"1 1 100%"}"
          @click=${p?()=>e.onCloseSidebar?.():v}
        >
          ${g}
          ${e.showScrollButton?f`
                <button
                  class="chat-scroll-bottom"
                  type="button"
                  aria-label="Scroll to bottom"
                  title="Scroll to bottom"
                  @click=${()=>e.onScrollToBottom?.()}
                >
                  ${e.showNewMessages?f`<span class="chat-scroll-bottom__badge"></span>`:v}
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              `:v}
        </div>

        ${p?f`
              <resizable-divider
                .splitRatio=${o}
                @resize=${y=>e.onSplitRatioChange?.(y.detail.splitRatio)}
              ></resizable-divider>
              ${e.allyPanelOpen&&e.allyProps?f`
                    <div class="chat-sidebar chat-sidebar--split">
                      <div class="chat-sidebar-top">
                      ${St({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                    </div>
                    <resizable-divider
                      direction="vertical"
                      .splitRatio=${.6}
                      .minRatio=${.2}
                      .maxRatio=${.8}
                    ></resizable-divider>
                    <div class="chat-sidebar-bottom">
                      ${hc(e.allyProps)}
                    </div>
                  </div>
                `:f`
                  <div class="chat-sidebar">
                    ${St({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                  </div>
                `}
            `:v}
      </div>

      ${e.queue.length?f`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(y=>f`
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
                        ${$.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:v}

      ${Hc(e)}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${y=>Nc(y,e)}
          />
          ${Fc(e)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${sa(y=>y&&Dn(y))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${y=>{if(y.key!=="Enter"||y.isComposing||y.keyCode===229||y.shiftKey||!e.connected)return;y.preventDefault();const b=y.ctrlKey||y.metaKey;t&&e.onSend(b)}}
              @input=${y=>{const b=y.target;Dn(b),e.onDraftChange(b.value)}}
              @paste=${y=>Kc(y,e)}
              placeholder=${m}
            ></textarea>

            <div class="chat-compose__actions">
              ${e.currentModel?f`
                <div class="model-picker-inline">
                  <button
                    class="chat-model-label chat-model-label--clickable"
                    @click=${y=>{y.stopPropagation(),e.onToggleModelPicker?.()}}
                    title="Switch model"
                  >${xc(e.currentModel)} &#9662;</button>
                  ${e.modelPickerOpen&&(e.availableModels?.length??0)>0?f`
                    <div class="model-picker-dropdown">
                      ${e.availableModels.map(y=>f`
                        <button
                          class="model-picker-dropdown__item ${y.id===e.currentModel?"model-picker-dropdown__item--active":""}"
                          @click=${b=>{b.stopPropagation(),y.id!==e.currentModel&&e.onSwitchModel?.(y.id)}}
                        >
                          <span class="model-picker-dropdown__name">${y.name}</span>
                          <span class="model-picker-dropdown__provider">${y.provider}</span>
                          ${y.id===e.currentModel?f`<span class="model-picker-dropdown__check">&#10003;</span>`:v}
                        </button>
                      `)}
                    </div>
                  `:v}
                </div>
              `:v}
              ${Ic(e)}

              <button
                class="chat-compose__toolbar-btn"
                type="button"
                title="Attach files"
                ?disabled=${!e.connected}
                @click=${()=>{document.getElementById("chat-file-input")?.click()}}
              >
                ${$.paperclip}
              </button>

              ${s?f`
                  <button
                    class="chat-compose__send-btn chat-compose__send-btn--stop"
                    @click=${()=>e.onAbort()}
                    title="Stop generating"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="3" y="3" width="10" height="10" rx="1.5" />
                    </svg>
                  </button>
                `:f`
                  <button
                    class="chat-compose__send-btn"
                    ?disabled=${!e.canSend||!e.connected}
                    @click=${()=>e.onSend(!1)}
                    title=${n?"Send now - interrupts current run (↵)":"Send message (↵)"}
                  >
                    ${$.arrowUp}
                  </button>
                `}
            </div>
          </div>
        </div>
      </div>
    </section>
  `}const On=200;function Vc(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const i=Lt(s.message),a=Fe(i.role),r=i.timestamp||Date.now();!n||n.role!==a?(n&&t.push(n),n={kind:"group",key:`group:${a}:${s.key}`,role:a,messages:[{message:s.message,key:s.key}],timestamp:r,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function Gc(e){const n=e.content;if(!Array.isArray(n))return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const i=s;if(i.type==="image")return!0;if(Array.isArray(i.content)){for(const a of i.content)if(!(typeof a!="object"||a===null)&&a.type==="image")return!0}}return!1}function Qc(e){const n=e.content;if(!Array.isArray(n)||n.length===0)return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const i=s,a=typeof i.type=="string"?i.type:"";if(a!=="toolCall"&&a!=="tool_use"&&a!=="thinking")return!1}return!0}function Yc(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],i=Math.max(0,n.length-On);i>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${On} messages (${i} hidden).`,timestamp:Date.now()}});for(let a=i;a<n.length;a++){const r=n[a];if(r._chatIdx=a,mr(r)){t.push({kind:"compaction-summary",key:`compaction:${a}`,message:r});continue}if(mc(r))continue;const l=Lt(r);!e.showThinking&&l.role.toLowerCase()==="toolresult"&&!Gc(r)||!e.showThinking&&l.role.toLowerCase()==="assistant"&&Qc(r)||t.push({kind:"message",key:Kn(r,a),message:r})}if(e.showThinking)for(let a=0;a<s.length;a++)t.push({kind:"message",key:Kn(s[a],a+n.length),message:s[a]});if(e.stream!==null){let a=!1;if(e.stream.trim().length>0&&n.length>0){const r=n[n.length-1];if(typeof r.role=="string"&&r.role.toLowerCase()==="assistant"){const l=r.content;let c="";typeof l=="string"?c=l:Array.isArray(l)&&(c=l.filter(m=>m.type==="text"&&typeof m.text=="string").map(m=>m.text).join("")),c.length>0&&c.length>=e.stream.trim().length&&(a=!0)}}if(!a){const r=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:r,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:r})}}else if(e.isWorking){const a=`working:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}else if(e.sending||e.canAbort){const a=`sending:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}return Vc(t)}function Kn(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const i=typeof n.id=="string"?n.id:"";if(i)return`msg:${i}`;const a=typeof n.messageId=="string"?n.messageId:"";if(a)return`msg:${a}`;const r=typeof n.timestamp=="number"?n.timestamp:null,l=typeof n.role=="string"?n.role:"unknown";if(r!=null){const c=typeof n.content=="string"?n.content.slice(0,32):"";return`msg:${l}:${r}:${c||t}`}return`msg:${l}:${t}`}function Jc(e){const{pendingGatewayUrl:t}=e;return t?f`
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
  `:v}function Xc(e){if(!e.gatewayRestartPending)return v;const t=e.sessionsResult?.sessions?.length??0,n=t===1?"1 active session":`${t} active sessions`;return f`
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
  `}function ui(){return{open:!1,images:[],currentIndex:0}}function Zc(e,t,n){return{open:!0,images:t,currentIndex:n}}function ed(){return ui()}function td(e,t){const n=e.currentIndex+t;return n<0||n>=e.images.length?e:{...e,currentIndex:n}}const nd=f`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,sd=f`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,id=f`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;function ad(e,t){if(!e.open||e.images.length===0)return v;const n=e.images[e.currentIndex];if(!n)return v;const s=e.images.length>1,i=e.currentIndex>0,a=e.currentIndex<e.images.length-1;return f`
    <div
      class="lightbox-overlay"
      @click=${r=>{r.target.classList.contains("lightbox-overlay")&&t.onClose()}}
      @keydown=${r=>{r.key==="Escape"&&t.onClose(),r.key==="ArrowRight"&&a&&t.onNav(1),r.key==="ArrowLeft"&&i&&t.onNav(-1)}}
      tabindex="0"
    >
      <button class="lightbox-close" @click=${t.onClose} aria-label="Close image viewer">
        ${nd}
      </button>

      ${s&&i?f`<button class="lightbox-nav lightbox-nav--prev" @click=${()=>t.onNav(-1)} aria-label="Previous image">${sd}</button>`:v}

      <img
        class="lightbox-image"
        src=${n.url}
        alt=${n.alt??"Image preview"}
        @click=${r=>r.stopPropagation()}
        @error=${r=>{r.target.classList.add("lightbox-image--broken")}}
      />

      ${s&&a?f`<button class="lightbox-nav lightbox-nav--next" @click=${()=>t.onNav(1)} aria-label="Next image">${id}</button>`:v}

      ${s?f`<div class="lightbox-counter">${e.currentIndex+1} / ${e.images.length}</div>`:v}
    </div>
  `}const od=e=>{switch(e){case"success":return f`
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
      `;case"error":return f`
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
      `;case"warning":return f`
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
      `;default:return f`
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
      `}};function rd({toasts:e,onDismiss:t}){return e.length===0?null:f`
    <div class="toast-container">
      ${Ke(e,n=>n.id,n=>f`
          <div class="toast toast--${n.type}">
            <div class="toast__icon">${od(n.type)}</div>
            <div class="toast__body">
              <div class="toast__message">${n.message}</div>
              ${n.action?f`${n.action.url?f`<a
                        class="toast__action"
                        href=${n.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >${n.action.label} &rarr;</a>`:f`<button
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
  `}const ld={"gm-work":()=>T(()=>import("./work-tab-CpwH2Z5D.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url),"gm-today":()=>T(()=>import("./today-tab-gkWtZuCc.js"),__vite__mapDeps([6,1,3,4,5,2]),import.meta.url),"gm-team":()=>T(()=>import("./team-tab-BZPiRt7g.js"),__vite__mapDeps([7,1,3,4,5]),import.meta.url),"gm-second-brain":()=>T(()=>import("./second-brain-tab-BEQ9aTL1.js"),__vite__mapDeps([8,1,4,3,5]),import.meta.url),"gm-dashboards":()=>T(()=>import("./dashboards-tab-CZnCrA9n.js"),__vite__mapDeps([9,1,4,3,5]),import.meta.url),"gm-connections":()=>T(()=>import("./connections-tab-Cs_0xERz.js"),__vite__mapDeps([10,1,3,4,5]),import.meta.url)},Nn=new Set;function ue(e){Nn.has(e)||(Nn.add(e),ld[e]?.())}const cd=/^data:/i,dd=/^https?:\/\//i;function ud(e){const t=e.agentsList?.agents??[],s=ss(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",a=t.find(l=>l.id===s)?.identity,r=a?.avatarUrl??a?.avatar;if(r)return cd.test(r)||dd.test(r)?r:a?.avatarUrl}function Fn(e){const t=e.trim();if(!t)return t;const n=t.split(/\s+/);if(n.length>=2&&n.length%2===0){const l=n.length/2,c=n.slice(0,l).join(" "),m=n.slice(l).join(" ");if(c.toLowerCase()===m.toLowerCase())return c}const s=t.replace(/\s+/g," ").toLowerCase(),i=Math.floor(s.length/2),a=s.slice(0,i).trim(),r=s.slice(i).trim();return a&&a===r?t.slice(0,Math.ceil(t.length/2)).trim():t}function Tt(e,t){const n=t?.sessionId?.trim();return n?`session:${n}`:`key:${e.trim().toLowerCase()}`}function Un(e){if(e===L)return!0;const t=e.toLowerCase();return!!(t==="agent:main:main"||t.endsWith(":main"))}function hd(e){const t=e.sessionsResult?.sessions,n=[...new Set(e.settings.openTabs.map(l=>l.trim()).filter(Boolean))].filter(l=>!Un(l)),s=ie(t,e.sessionKey),i=Tt(e.sessionKey,s),a=new Map;for(const l of n){const c=ie(t,l),m=Tt(l,c);if(!a.has(m)){a.set(m,l);continue}l===e.sessionKey&&a.set(m,l)}const r=[...a.values()];if(r.length===0){const l=e.sessionKey.trim()||"main";Un(l)||r.push(l)}return{tabKeys:r,activeIdentity:i}}function pd(e){if(e.wizardActive&&e.wizardState)return ca(e.wizardState,{onStepChange:o=>{e.handleWizardStepChange?.(o)},onAnswerChange:(o,p)=>{e.handleWizardAnswerChange?.(o,p)},onPreview:()=>{e.handleWizardPreview?.()},onGenerate:()=>{e.handleWizardGenerate?.()},onClose:()=>{e.handleWizardClose?.()},onFileToggle:(o,p)=>{e.handleWizardFileToggle?.(o,p)},onConfigToggle:(o,p)=>{e.handleWizardConfigToggle?.(o,p)}});e.presenceEntries.length;const t=e.sessionsResult?.count??null;e.cronStatus?.nextWakeAtMs;const n=e.connected?null:"Disconnected from gateway.",s=e.tab==="chat",i=s&&(e.settings.chatFocusMode||e.onboarding),a=e.onboarding?!1:e.settings.chatShowThinking,r=ud(e),l=e.chatAvatarUrl??r??null,{tabKeys:c,activeIdentity:m}=hd(e);return f`
    <div class="shell ${s?"shell--chat":""} ${i?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
            aria-label="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">${$.menu}</span>
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
          ${v}
        </div>
        <div class="topbar-status">
          ${e.updateStatus?.openclawUpdateAvailable||e.updateStatus?.pluginUpdateAvailable?f`<a
                  class="pill pill--update"
                  href="#"
                  title="${e.updateStatus?.openclawUpdateAvailable?"OpenClaw update available":"GodMode plugin update available"} — click to view"
                  @click=${o=>{o.preventDefault(),e.setTab("config")}}
                >
                  <span class="pill__icon">${$.zap}</span>
                  <span>Update Ready</span>
                </a>`:v}
          ${e.updateStatus?.pendingDeploy?f`<button
                  class="pill pill--deploy"
                  @click=${o=>{o.preventDefault(),e.handleDeployPanelToggle()}}
                  title="${e.updateStatus.pendingDeploy.summary??"pending fix"}"
                >
                  <span class="pill__icon">${$.rotateCcw}</span>
                  <span>Deploy Ready</span>
                </button>`:v}
          <button
            class="pill pill--support"
            @click=${o=>{o.preventDefault(),e.handleOpenSupportChat()}}
            title="Open support chat"
          >
            <span class="pill__icon">${$.headphones}</span>
            <span>Support</span>
          </button>
          <div class="pill ${e.reconnecting?"reconnecting":""}">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>Gateway</span>
            <span class="mono">${e.reconnecting?`Reconnecting${e.reconnectAttempt>1?` (${e.reconnectAttempt})`:""}...`:e.connected?"Connected":"Offline"}</span>
          </div>
          ${ii(e)}
        </div>
      </header>
      ${e.deployPanelOpen&&e.updateStatus?.pendingDeploy?(()=>{const o=e.updateStatus.pendingDeploy,p=Date.now()-o.ts,g=Math.floor(p/6e4),y=g<1?"just now":g<60?`${g}m ago`:`${Math.floor(g/60)}h ago`;return f`
              <div class="deploy-review-panel">
                <div class="deploy-review-panel__body">
                  <div class="deploy-review-panel__info">
                    <strong>Staged Deploy</strong>
                    <span class="deploy-review-panel__summary">${o.summary??"Pending fix"}</span>
                    <span class="deploy-review-panel__meta">Staged ${y}</span>
                    ${o.files?.length?f`<details class="deploy-review-panel__files">
                          <summary>${o.files.length} file${o.files.length>1?"s":""} changed</summary>
                          <ul>${o.files.map(b=>f`<li>${b}</li>`)}</ul>
                        </details>`:v}
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
              </div>`})():v}
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">

        ${da.map(o=>{const p=e.settings.navGroupsCollapsed[o.label]??!1,g=o.tabs.some(b=>b===e.tab),y=!o.label||o.tabs.length===1&&oe(o.tabs[0])===o.label;return f`
            <div class="nav-group ${p&&!g?"nav-group--collapsed":""} ${y?"nav-group--no-header":""}">
              ${y?v:f`
                <button
                  class="nav-label"
                  @click=${()=>{const b={...e.settings.navGroupsCollapsed};b[o.label]=!p,e.applySettings({...e.settings,navGroupsCollapsed:b})}}
                  aria-expanded=${!p}
                >
                  <span class="nav-label__text">${o.label}</span>
                  <span class="nav-label__chevron">${p?"+":"−"}</span>
                </button>
              `}
              <div class="nav-group__items">
                ${v}
                ${o.tabs.map(b=>wt(e,b))}
              </div>
            </div>
          `})}
        ${ua.map(o=>{const p=e.settings.navGroupsCollapsed[o.label]??!0,g=o.tabs.some(y=>y===e.tab);return f`
            <div class="nav-group ${p&&!g?"nav-group--collapsed":""}">
              <button
                class="nav-label"
                @click=${()=>{const y={...e.settings.navGroupsCollapsed};y[o.label]=!p,e.applySettings({...e.settings,navGroupsCollapsed:y})}}
                aria-expanded=${!p}
              >
                <span class="nav-label__text">${o.label}</span>
                <span class="nav-label__chevron">${p?"+":"−"}</span>
              </button>
              <div class="nav-group__items">
                ${o.tabs.map(y=>wt(e,y))}
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
              href="https://docs.lifeongodmode.com"
              target="_blank"
              rel="noreferrer"
              title="GodMode Documentation"
            >
              <span class="nav-item__icon" aria-hidden="true">${$.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
            <a
              class="nav-item nav-item--external"
              href="https://community.lifeongodmode.com"
              target="_blank"
              rel="noreferrer"
              title="Join the GodMode Community"
            >
              <span class="nav-item__icon" aria-hidden="true">${$.globe}</span>
              <span class="nav-item__text">Community</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${s?"content--chat":""}">
        <section class="content-header">
          <div>
            ${e.tab!=="chat"&&e.tab!=="onboarding"&&e.tab!=="team"?f`
              <div class="page-title">${oe(e.tab)}</div>
              <div class="page-sub">${ha(e.tab)}</div>
            `:e.tab==="chat"?f`
              <div class="session-tabs">
                <div class="session-tab session-tab--pinned ${e.sessionKey===L?"session-tab--active":""}"
                     @click=${()=>{e.sessionKey!==L&&(Q(e),e.sessionKey=L,e.allyUnread=0,Z(e,L),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:L,lastActiveSessionKey:L,tabLastViewed:{...e.settings.tabLastViewed,[L]:Date.now()}}),e.loadAssistantIdentity(),N(e).then(()=>{e.resetChatScroll(),F(e,!0)}),e.loadSessionResources(),K(e))}}
                     title="${e.assistantName||"Ally"}">
                  ${e.assistantAvatar?f`<img src="${e.assistantAvatar}" class="session-tab-avatar" width="16" height="16" style="border-radius:50%;vertical-align:middle;margin-right:4px;" />`:f`<span class="session-tab-icon" style="margin-right:4px;">&#x2726;</span>`}
                  ${e.assistantName||"Ally"}
                  ${(e.allyUnread??0)>0?f`<span class="ally-tab-badge" style="margin-left:4px;font-size:10px;background:var(--accent-color,#5b73e8);color:#fff;border-radius:50%;padding:1px 5px;">${e.allyUnread}</span>`:v}
                </div>
                ${Ke(c,o=>o,(o,p)=>{const g=ie(e.sessionsResult?.sessions,o),y=Tt(o,g)===m,_=(()=>{if(g?.label||g?.displayName)return Fn(g.label??g.displayName);const w=se.get(o);if(w)return Fn(w);if(o==="agent:main:support")return"Support";if(o.includes("webchat")){const k=o.match(/webchat[:-](\d+)/);return k?`Chat ${k[1]}`:"Chat"}if(o.includes("main"))return"MAIN";const A=o.split(/[:-]/);return A[A.length-1]||o})(),I=e.workingSessions.has(o),U=e.settings.tabLastViewed[o]??0,C=g?.updatedAt??0,D=!y&&!I&&C>U,Y=e.editingTabKey===o;return f`
                      <div
                        class="session-tab ${y?"session-tab--active":""} ${I?"session-tab--working":""} ${D?"session-tab--ready":""} ${Y?"session-tab--editing":""}"
                        draggable="true"
                        @dragstart=${w=>{if(e.editingTabKey===o){w.preventDefault();return}w.dataTransfer.effectAllowed="move",w.dataTransfer.setData("text/session-key",o),w.dataTransfer.setData("text/plain",p.toString()),w.target.classList.add("dragging")}}
                        @click=${()=>{if(!Y){if(y){e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}});return}Q(e),e.sessionKey=o,Z(e,o),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:o,lastActiveSessionKey:o,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}}),e.loadAssistantIdentity(),z(e,o),N(e).then(()=>{e.resetChatScroll(),F(e,!0)}),e.loadSessionResources(),K(e),zt()}}}
                        @dragend=${w=>{w.target.classList.remove("dragging")}}
                        @dragover=${w=>{w.preventDefault(),w.dataTransfer.dropEffect="move";const A=w.currentTarget,k=A.getBoundingClientRect(),x=k.left+k.width/2;w.clientX<x?(A.classList.add("drop-left"),A.classList.remove("drop-right")):(A.classList.add("drop-right"),A.classList.remove("drop-left"))}}
                        @dragleave=${w=>{w.currentTarget.classList.remove("drop-left","drop-right")}}
                        @drop=${w=>{w.preventDefault();const A=parseInt(w.dataTransfer.getData("text/plain")),k=p;if(A===k)return;const x=e.settings.openTabs.slice(),[S]=x.splice(A,1);x.splice(k,0,S),e.applySettings({...e.settings,openTabs:x}),w.currentTarget.classList.remove("drop-left","drop-right")}}
                        title=${_}
                      >
                        ${Y?f`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${g?.label??g?.displayName??""}
                            @click=${w=>w.stopPropagation()}
                            @dblclick=${w=>w.stopPropagation()}
                            @blur=${async w=>{const A=w.target;if(A._committedByEnter)return;const k=A.value.trim();e.editingTabKey=null;const x=g?.label??g?.displayName??"";if(k!==x){k?se.set(o,k):se.delete(o),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(M=>M.key===o?{...M,label:k||void 0,displayName:k||void 0}:M)});const S=await ze(e,o,{label:k||null,displayName:k||null});K(e);const P=S.ok&&S.canonicalKey!==o?S.canonicalKey:o,ne=o===e.sessionKey;e.applySettings({...e.settings,...S.ok&&S.canonicalKey!==o&&e.settings.openTabs.includes(o)?{openTabs:e.settings.openTabs.map(M=>M===o?S.canonicalKey:M)}:{},tabLastViewed:{...e.settings.tabLastViewed,[P]:Date.now()},...ne&&S.ok&&S.canonicalKey!==o?{sessionKey:S.canonicalKey,lastActiveSessionKey:S.canonicalKey}:{}}),ne&&S.ok&&S.canonicalKey!==o&&(e.sessionKey=S.canonicalKey,z(e,S.canonicalKey))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}})}}
                            @keydown=${async w=>{if(w.key==="Enter"){w.preventDefault();const A=w.target;A._committedByEnter=!0;const k=A.value.trim();e.editingTabKey=null;const x=g?.label??g?.displayName??"";if(k!==x){k?se.set(o,k):se.delete(o),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(M=>M.key===o?{...M,label:k||void 0,displayName:k||void 0}:M)});const S=await ze(e,o,{label:k||null,displayName:k||null});K(e);const P=S.ok&&S.canonicalKey!==o?S.canonicalKey:o,ne=o===e.sessionKey;e.applySettings({...e.settings,...S.ok&&S.canonicalKey!==o&&e.settings.openTabs.includes(o)?{openTabs:e.settings.openTabs.map(M=>M===o?S.canonicalKey:M)}:{},tabLastViewed:{...e.settings.tabLastViewed,[P]:Date.now()},...ne&&S.ok&&S.canonicalKey!==o?{sessionKey:S.canonicalKey,lastActiveSessionKey:S.canonicalKey}:{}}),ne&&S.ok&&S.canonicalKey!==o&&(e.sessionKey=S.canonicalKey,z(e,S.canonicalKey))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}})}else w.key==="Escape"&&(w.preventDefault(),e.editingTabKey=null)}}
                          />
                        `:(()=>{let w=null;return f`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${A=>{A.stopPropagation(),w&&clearTimeout(w),w=setTimeout(()=>{w=null,e.editingTabKey!==o&&(o===e.sessionKey?e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}}):(Q(e),e.sessionKey=o,e.chatPrivateMode=!!e.privateSessions?.has(o),Z(e,o),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:o,lastActiveSessionKey:o,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}}),e.loadAssistantIdentity(),z(e,o),N(e).then(()=>{e.resetChatScroll(),F(e,!0)}),e.loadSessionResources(),K(e)))},250)}}
                            @dblclick=${A=>{A.preventDefault(),A.stopPropagation(),w&&(clearTimeout(w),w=null),e.editingTabKey=o;const k=A.target.closest(".session-tab"),x=S=>{const P=S.target;k&&!k.contains(P)&&(e.editingTabKey=null,document.removeEventListener("mousedown",x,!0))};document.addEventListener("mousedown",x,!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const S=k?.querySelector(".session-tab__name-input");S&&(S.focus(),S.select())})})}}
                          >${_}</span>
                        `})()}
                        ${e.privateSessions?.has(o)?(()=>{const w=e.privateSessions.get(o),A=Math.max(0,w-Date.now()),k=Math.floor(A/36e5),x=Math.floor(A%36e5/6e4),S=k>0?`${k}h ${x}m`:`${x}m`;return f`
                                  <span class="session-tab__private" title="Private session — expires in ${S}" style="font-size: 9px; margin-left: 3px; color: #f59e0b; white-space: nowrap;"
                                    >🔒 ${S}</span
                                  >
                                `})():v}
                        ${I?f`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `:v}
                        ${D?f`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `:v}
                        ${f`
                          <button
                            class="session-tab__close"
                            @click=${w=>{if(w.stopPropagation(),e.privateSessions?.has(o)){e._destroyPrivateSession(o);return}const A=e.settings.openTabs.filter(S=>S!==o),k=o===e.sessionKey,x=A[0]||L;e.applySettings({...e.settings,openTabs:A,...k?{sessionKey:x,lastActiveSessionKey:x}:{}}),k&&(e.sessionKey=x,e.sessionResources=[],z(e,x),N(e).then(()=>{e.resetChatScroll(),F(e,!0)}),e.loadSessionResources())}}
                            title=${e.privateSessions?.has(o)?"Destroy private session":"Close tab"}
                          >×</button>
                        `}
                      </div>
                    `})}
              `:v}
          </div>
          <div class="page-meta">
            ${e.reconnecting?(e.reconnectAttempt??0)>10?f`<div class="pill danger gateway-offline">
                      Gateway offline — retrying every 60s (attempt ${e.reconnectAttempt}).
                      Try: <code>oc gateway restart</code>
                    </div>`:f`<div class="pill warning reconnecting">
                      <span class="reconnect-spinner"></span>
                      Reconnecting${e.reconnectAttempt>1?` (attempt ${e.reconnectAttempt})`:""}...
                    </div>`:e.lastError?f`<div class="pill ${e.lastError.startsWith("✓")?"success":"danger"}">${e.lastError}</div>`:v}
            ${s?si(e):v}
            ${v}
          </div>
        </section>

        ${i?f`<button
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
            </button>`:v}

        ${e.tab==="setup"||e.tab==="onboarding"?f`<div class="my-day-container">
                <div class="my-day-card">
                  <div class="my-day-card-content">
                    <p>Use the Setup Bar in the left navigation to continue setup, or go to Settings to run the full wizard.</p>
                  </div>
                </div>
              </div>`:v}

        ${e.tab==="workspaces"?(ue("gm-work"),f`<gm-work></gm-work>`):v}

        ${e.tab==="team"?(ue("gm-team"),f`<gm-team .host=${e}></gm-team>`):v}

        ${e.tab==="today"||e.tab==="my-day"?(ue("gm-today"),f`<gm-today
                @today-start-task=${o=>{const p=o.detail.taskId;e.setTab("chat"),e.setChatMessage(`Let's work on task ${p}. Pull up the details and let's discuss an approach.`)}}
                @today-open-file=${o=>{e.handleOpenFile(o.detail.path)}}
                @today-decision-open-chat=${o=>{const p=o.detail.item;e.setTab("chat");const g=p?.title??o.detail.id;e.setChatMessage(`Let's discuss the agent result for: "${g}". What are your thoughts on the output?`)}}
                @today-inbox-open-chat=${o=>{const p=o.detail.item;if(p?.coworkSessionId)V.emit("chat-navigate",{sessionKey:`agent:prosper:${p.coworkSessionId}`,tab:"chat"});else if(p?.sessionId)V.emit("chat-navigate",{sessionKey:p.sessionId,tab:"chat"});else{e.setTab("chat");const g=p?.title??o.detail.itemId;e.setChatMessage(`Let's review the inbox item: "${g}". Can you summarize the key points and what actions I should take?`)}}}
                @today-open-proof=${o=>{e.handleOpenProofDoc(o.detail.slug)}}
              ></gm-today>`):v}

        ${e.tab==="channels"?pa({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:o=>H(e,o),onWhatsAppStart:o=>e.handleWhatsAppStart(o),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(o,p)=>Ae(e,o,p),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(o,p)=>e.handleNostrProfileEdit(o,p),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(o,p)=>e.handleNostrProfileFieldChange(o,p),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):v}

        ${e.tab==="instances"?fa({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>kt(e)}):v}

        ${e.tab==="sessions"?ma({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,archivedSessions:e.archivedSessions,archivedSessionsLoading:e.archivedSessionsLoading,archivedSessionsExpanded:e.archivedSessionsExpanded,onFiltersChange:o=>{e.sessionsFilterActive=o.activeMinutes,e.sessionsFilterLimit=o.limit,e.sessionsIncludeGlobal=o.includeGlobal,e.sessionsIncludeUnknown=o.includeUnknown},onRefresh:()=>{K(e),ot(e)},onPatch:async(o,p)=>{const g=await ze(e,o,p);if(g.ok&&g.canonicalKey!==o&&e.settings.openTabs.includes(o)){const y=e.settings.openTabs.map(_=>_===o?g.canonicalKey:_),b=o===e.sessionKey;e.applySettings({...e.settings,openTabs:y,tabLastViewed:{...e.settings.tabLastViewed,[g.canonicalKey]:e.settings.tabLastViewed[o]??Date.now()},...b?{sessionKey:g.canonicalKey,lastActiveSessionKey:g.canonicalKey}:{}}),b&&(e.sessionKey=g.canonicalKey,z(e,g.canonicalKey))}},onDelete:o=>Ri(e,o),onArchive:o=>Mi(e,o),onUnarchive:o=>Ii(e,o),onToggleArchived:()=>{e.archivedSessionsExpanded=!e.archivedSessionsExpanded,e.archivedSessionsExpanded&&e.archivedSessions.length===0&&ot(e)},onAutoArchive:()=>Li(e)}):v}

        ${e.tab==="cron"?ga({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(o=>o.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:o=>e.cronForm={...e.cronForm,...o},onRefresh:()=>e.loadCron(),onAdd:()=>Ni(e),onToggle:(o,p)=>Ki(e,o,p),onRun:o=>Oi(e,o),onRemove:o=>Di(e,o),onLoadRuns:o=>Ei(e,o)}):v}

        ${e.tab==="skills"?ya({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,subTab:e.skillsSubTab,godmodeSkills:e.godmodeSkills??null,godmodeSkillsLoading:e.godmodeSkillsLoading??!1,expandedSkills:e.expandedSkills??new Set,onFilterChange:o=>e.skillsFilter=o,onRefresh:()=>{zn(e,{clearMessages:!0}),rt(e)},onToggle:(o,p)=>Bi(e,o,p),onEdit:(o,p)=>Wi(e,o,p),onSaveKey:o=>Ui(e,o),onInstall:(o,p,g)=>Fi(e,o,p,g),onSubTabChange:o=>{e.skillsSubTab=o,o==="godmode"&&!e.godmodeSkills&&rt(e)},onToggleExpand:o=>{const p=new Set(e.expandedSkills);p.has(o)?p.delete(o):p.add(o),e.expandedSkills=p}}):v}

        ${e.tab==="agents"?va({loading:e.rosterLoading,error:e.rosterError,roster:e.rosterData??[],filter:e.rosterFilter??"",expandedAgents:e.expandedAgents??new Set,onFilterChange:o=>e.rosterFilter=o,onRefresh:()=>qi(e),onToggleExpand:o=>{const p=new Set(e.expandedAgents);p.has(o)?p.delete(o):p.add(o),e.expandedAgents=p}}):v}

        ${e.tab==="nodes"?ba({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>Ee(e),onDevicesRefresh:()=>De(e),onDeviceApprove:o=>ea(e,o),onDeviceReject:o=>Zi(e,o),onDeviceRotate:(o,p,g)=>Xi(e,{deviceId:o,role:p,scopes:g}),onDeviceRevoke:(o,p)=>Ji(e,{deviceId:o,role:p}),onLoadConfig:()=>ae(e),onLoadExecApprovals:()=>{const o=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Vn(e,o)},onBindDefault:o=>{o?Ae(e,["tools","exec","node"],o):Xt(e,["tools","exec","node"])},onBindAgent:(o,p)=>{const g=["agents","list",o,"tools","exec","node"];p?Ae(e,g,p):Xt(e,g)},onSaveBindings:()=>at(e),onExecApprovalsTargetChange:(o,p)=>{e.execApprovalsTarget=o,e.execApprovalsTargetNodeId=p,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:o=>{e.execApprovalsSelectedAgent=o},onExecApprovalsPatch:(o,p)=>zi(e,o,p),onExecApprovalsRemove:o=>Hi(e,o),onSaveExecApprovals:()=>{const o=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return ji(e,o)}}):v}

        ${e.tab==="chat"&&e.workspaceNeedsSetup&&!e.chatMessages?.length?f`
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
                `:v}

        ${e.tab==="chat"?zc({basePath:e.basePath,sessionKey:e.sessionKey,onSessionKeyChange:o=>{Q(e),e.sessionKey=o,Z(e,o),e.chatLoading=!0,e.chatMessages=[],e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:o,lastActiveSessionKey:o}),e.loadAssistantIdentity(),N(e).then(()=>{e.resetChatScroll(),F(e,!0)}),Re(e),e.loadSessionResources(),be(e)},thinkingLevel:e.chatThinkingLevel,showThinking:a,loading:e.chatLoading,sending:e.chatSending,sendingSessionKey:e.chatSendingSessionKey,compactionStatus:e.compactionStatus,assistantAvatarUrl:l,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:n,error:e.lastError,sessions:e.sessionsResult,focusMode:i,onRefresh:()=>(e.resetToolStream(),e.loadSessionResources(),be(e),Promise.all([N(e),Re(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:o=>e.handleChatScroll(o),onDraftChange:o=>e.chatMessage=o,attachments:e.chatAttachments,onAttachmentsChange:o=>e.chatAttachments=o,showToast:(o,p)=>e.showToast(o,p),onSend:o=>e.handleSendChat(void 0,{queue:o}),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onCompact:()=>{e.handleCompactChat()},onQueueRemove:o=>e.removeQueuedMessage(o),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,sidebarMimeType:e.sidebarMimeType,sidebarFilePath:e.sidebarFilePath,sidebarTitle:e.sidebarTitle,sidebarMode:e.sidebarMode,sidebarProofSlug:e.sidebarProofSlug,sidebarProofUrl:e.sidebarProofUrl,sidebarProofHtml:e.sidebarProofHtml,splitRatio:e.splitRatio,onOpenSidebar:(o,p)=>e.handleOpenSidebar(o,p),onMessageLinkClick:o=>e.handleOpenMessageFileLink(o),onCloseSidebar:()=>e.handleCloseSidebar(),onOpenProof:o=>{e.handleOpenProofDoc(o)},onOpenFile:o=>e.handleOpenFile(o),onSplitRatioChange:o=>e.handleSplitRatioChange(o),onPushToDrive:(o,p)=>e.handlePushToDrive(o,p),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker(),onImageClick:(o,p,g)=>e.handleImageClick(o,p,g),resolveImageUrl:(o,p)=>Os(e.sessionKey,o,p),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,userName:e.userName,userAvatar:e.userAvatar,currentModel:e.currentModel,availableModels:e.availableModels,modelPickerOpen:e.modelPickerOpen,onToggleModelPicker:()=>{const o=!e.modelPickerOpen;e.modelPickerOpen=o,o&&setTimeout(()=>{const p=()=>{e.modelPickerOpen=!1,document.removeEventListener("click",p,!0)};document.addEventListener("click",p,!0)},0)},onSwitchModel:o=>{(async()=>{const{switchModelFromChat:p}=await T(async()=>{const{switchModelFromChat:g}=await Promise.resolve().then(()=>sl);return{switchModelFromChat:g}},void 0,import.meta.url);await p(e,o)})()},currentToolName:e.currentToolName,currentToolInfo:e.currentToolInfo,privateMode:e.chatPrivateMode,onTogglePrivateMode:()=>e.handlePrivateModeToggle(),isWorking:e.workingSessions.has(e.sessionKey),showScrollButton:!e.chatUserNearBottom,showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>{const o=document.querySelector(".chat-thread");o&&(o.scrollTo({top:o.scrollHeight,behavior:"smooth"}),e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1)},allyPanelOpen:e.allyPanelOpen??!1,allyProps:e.allyPanelOpen?{allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:!0,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:0,connected:e.connected,compact:!0,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:o=>e.handleAllyDraftChange(o),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:o=>e.handleAllyAttachmentsChange(o),onAction:(o,p,g,y)=>e.handleAllyAction(o,p,g,y)}:null,sessionResources:e.sessionResources,sessionResourcesCollapsed:e.sessionResourcesCollapsed,onToggleSessionResources:()=>e.handleToggleSessionResources(),onSessionResourceClick:o=>e.handleSessionResourceClick(o),onViewAllResources:()=>e.handleViewAllResources()}):v}

        ${e.tab==="guardrails"?wa({connected:e.connected,loading:e.guardrailsLoading,data:e.guardrailsData,showAddForm:e.guardrailsShowAddForm,onToggle:(o,p)=>e.handleGuardrailToggle(o,p),onThresholdChange:(o,p,g)=>e.handleGuardrailThresholdChange(o,p,g),onCustomToggle:(o,p)=>e.handleCustomGuardrailToggle(o,p),onCustomDelete:o=>e.handleCustomGuardrailDelete(o),onToggleAddForm:()=>e.handleToggleGuardrailAddForm(),onOpenAllyChat:o=>{e.handleAllyToggle(),o&&e.handleAllyDraftChange(o)}}):v}

        ${e.tab==="trust"?Sa({connected:e.connected,loading:e.trustTrackerLoading,data:e.trustTrackerData,onAddWorkflow:o=>e.handleTrustAddWorkflow(o),onRemoveWorkflow:o=>e.handleTrustRemoveWorkflow(o),onRefresh:()=>e.handleTrustLoad(),guardrailsData:e.guardrailsData,consciousnessStatus:e.consciousnessStatus,sessionsCount:t,gatewayUptimeMs:e.hello?.snapshot?.uptimeMs??null,onDailyRate:(o,p)=>e.handleDailyRate(o,p),updateStatus:e.updateStatus?{openclawUpdateAvailable:e.updateStatus.openclawUpdateAvailable,pluginUpdateAvailable:e.updateStatus.pluginUpdateAvailable,openclawVersion:e.updateStatus.openclawVersion,pluginVersion:e.updateStatus.pluginVersion,openclawLatest:e.updateStatus.openclawLatest,pluginLatest:e.updateStatus.pluginLatest}:null}):v}

        ${e.tab==="second-brain"?(ue("gm-second-brain"),f`<gm-second-brain></gm-second-brain>`):v}

        ${e.tab==="dashboards"?(ue("gm-dashboards"),f`<gm-dashboards></gm-dashboards>`):v}

        ${e.tab==="connections"?(ue("gm-connections"),f`<gm-connections></gm-connections>`):v}

        ${e.tab==="config"?f`${Ta({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:o=>{e.configRaw=o},onFormModeChange:o=>e.configFormMode=o,onFormPatch:(o,p)=>Ae(e,o,p),onSearchChange:o=>e.configSearchQuery=o,onSectionChange:o=>{e.configActiveSection=o,e.configActiveSubsection=null},onSubsectionChange:o=>e.configActiveSubsection=o,onReload:()=>ae(e),onSave:()=>at(e),onApply:()=>Qi(e),onUpdate:()=>Gi(e),userName:e.userName||"",userAvatar:e.userAvatar,onUserProfileUpdate:(o,p)=>e.handleUpdateUserProfile(o,p),onModelSwitch:(o,p)=>Vi(e,o,p)})}
              <div style="margin-top: 24px; padding: 16px; border-top: 1px solid var(--border, #333);">
                <button
                  class="btn btn--secondary"
                  style="font-size: 13px; opacity: 0.8;"
                  @click=${()=>e.handleWizardOpen?.()}
                >
                  Run Setup Wizard
                </button>
                <span style="margin-left: 8px; font-size: 12px; opacity: 0.5;">Full 8-step onboarding form</span>
              </div>
            `:v}

        ${e.tab==="debug"?Aa({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:o=>e.debugCallMethod=o,onCallParamsChange:o=>e.debugCallParams=o,onRefresh:()=>Oe(e),onCall:()=>Yi(e)}):v}

        ${e.tab==="logs"?ka({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:o=>e.logsFilterText=o,onLevelToggle:(o,p)=>{e.logsLevelFilters={...e.logsLevelFilters,[o]:p}},onToggleAutoFollow:o=>e.logsAutoFollow=o,onRefresh:()=>At(e,{reset:!0}),onExport:(o,p)=>e.exportLogs(o,p),onScroll:o=>e.handleLogsScroll(o)}):v}
      </main>
      ${e.tab!=="chat"?uc({allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:e.allyPanelOpen??!1,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:e.allyUnread??0,connected:e.connected,compact:!1,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:o=>e.handleAllyDraftChange(o),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:o=>e.handleAllyAttachmentsChange(o),onAction:(o,p,g,y)=>e.handleAllyAction(o,p,g,y)}):v}
      ${_a(e)}
      ${Jc(e)}
      ${Xc(e)}
      ${e.sidebarOpen&&e.tab!=="chat"?f`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${()=>e.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${St({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:()=>e.handleCloseSidebar(),onViewRawText:()=>{e.sidebarContent&&e.handleOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath,title:e.sidebarTitle})},onOpenFile:o=>e.handleOpenFile(o),onPushToDrive:(o,p)=>e.handlePushToDrive(o,p),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker()})}
              </div>
            </div>
          `:v}
      ${rd({toasts:e.toasts,onDismiss:o=>e.dismissToast(o)})}
      ${ad(e.lightbox,{onClose:()=>e.handleLightboxClose(),onNav:o=>e.handleLightboxNav(o)})}
    </div>
  `}async function Yt(e){if(!(!e.client||!e.connected)){e.trustTrackerLoading=!0;try{const[t,n]=await Promise.all([e.client.request("trust.dashboard",{}),e.client.request("trust.history",{limit:50})]);e.trustTrackerData={workflows:t.workflows,summaries:t.summaries,ratings:n.ratings,total:n.total,overallScore:t.overallScore,totalRatings:t.totalRatings,totalUses:t.totalUses,todayRating:t.todayRating??null,dailyAverage:t.dailyAverage??null,dailyStreak:t.dailyStreak??0,recentDaily:t.recentDaily??[]}}catch{e.trustTrackerData=null}finally{e.trustTrackerLoading=!1}}}async function hi(e,t){if(!(!e.client||!e.connected))try{await e.client.request("trust.workflows.set",{workflows:t}),e.showToast("Workflows updated","success",2e3),await Yt(e)}catch(n){e.showToast("Failed to update workflows","error"),console.error("[TrustTracker] setWorkflows error:",n)}}async function fd(e,t){const n=e.trustTrackerData?.workflows??[];if(n.length>=5){e.showToast("Maximum 5 workflows allowed","error");return}if(n.includes(t.trim())){e.showToast("Workflow already tracked","error");return}await hi(e,[...n,t.trim()])}async function md(e,t){const n=e.trustTrackerData?.workflows??[];await hi(e,n.filter(s=>s!==t))}async function gd(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("trust.dailyRate",{rating:t,...n?{note:n}:{}}),e.showToast(`Rated ${t}/10 today`,"success",2e3),await Yt(e)}catch(s){e.showToast("Failed to submit daily rating","error"),console.error("[TrustTracker] dailyRate error:",s)}}const yd=6e4,Wn=15,Bn=new Set;let Le=null;async function qn(e){if(!(!e.client||!e.connected))try{const t=new Date,n=new Date(t.getTime()+Wn*6e4+6e4),s=await e.client.request("calendar.events.range",{startDate:t.toISOString(),endDate:n.toISOString()});for(const i of s.events??[]){if(Bn.has(i.id))continue;const a=new Date(i.startTime),r=Math.round((a.getTime()-t.getTime())/6e4);if(r>0&&r<=Wn){Bn.add(i.id);const l=a.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),c=i.location?` @ ${i.location}`:"",m=`${i.title} starts in ${r} min (${l})${c}`;e.showToast(m,"warning",0)}}}catch(t){console.warn("[MeetingNotify] Poll error:",t)}}function vd(e){pi(),qn(e),Le=setInterval(()=>{qn(e)},yd)}function pi(){Le&&(clearInterval(Le),Le=null)}let bd=0;function wd(e,t="info",n=3e3,s){return{id:`toast-${Date.now()}-${bd++}`,message:e,type:t,duration:n,createdAt:Date.now(),action:s}}function Sd(e,t){return e.filter(n=>n.id!==t)}function Td(e,t){return[...e,t]}var Ad=Object.defineProperty,kd=Object.getOwnPropertyDescriptor,u=(e,t,n,s)=>{for(var i=s>1?void 0:s?kd(t,n):t,a=e.length-1,r;a>=0;a--)(r=e[a])&&(i=(s?r(t,n,i):r(i))||i);return s&&i&&Ad(t,n,i),i};function it(){return yr()}function Ce(){return br()}function _d(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}function $d(e,t){let n=e.trim();if(!n)return null;if(n.startsWith("Read HEARTBEAT.md")||n.startsWith("Read CONSCIOUSNESS.md")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(n)||n==="NO_REPLY"||n.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(n)||n.startsWith("# WORKING.md")||n.startsWith("# MISTAKES.md"))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/(?:VERIFIED|FIXED|NEW):\s/.test(n)&&/✅|🟡|☑/.test(n)&&n.length>300)return console.debug("[Ally] Filtered message (verification dump):",t,n.substring(0,100)),null;if(/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(n))return console.debug("[Ally] Filtered message (system block):",t,n.substring(0,100)),null;if(/^\[GodMode Context:[^\]]*\]\s*$/.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(n=n.replace(/^(?:HEARTBEAT_OK|CONSCIOUSNESS_OK)\s*/i,"").trim(),n=n.replace(/^Deep work window is yours\.\s*/i,"").trim(),!n)return null;if(/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(n)&&n.length>200||/^##\s*Your Team\s*\(Agent Roster\)/i.test(n)&&n.indexOf(`

## `)===-1)return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/^##?\s*Persistence Protocol/i.test(n)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(n)||/^##?\s*Core (?:Behaviors|Principles)/i.test(n)||/^##?\s*Your Role as \w+/i.test(n))return console.debug("[Ally] Filtered message (persona leak):",t,n.substring(0,100)),null;const s=n.toLowerCase();if(["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"].filter(r=>s.includes(r)).length>=2)return console.debug("[Ally] Filtered message (multi-signal system leak):",t,n.substring(0,100)),null;if(/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;const a=n.match(/\b[\w.-]+\.(?:json\b|db\b|html\b|log\b|flag\b|jsonl\b|bak\b|css\b|js\b|ts\b|md\b|txt\b)/gi);return a&&a.length>=8&&a.join(" ").length>n.length*.4?(console.debug("[Ally] Filtered message (file listing dump):",t,n.substring(0,100)),null):n}const jn=new Set(["chat","today","workspaces","work","data","overview","channels","instances","sessions","cron","skills","nodes","config","debug","logs","my-day"]),Cd=["path","filePath","file","workspacePath"];let d=class extends Qn{constructor(){super(...arguments),this._ctx=xa(),this.settings=rl(),this.password="",this.tab="chat",this.onboarding=_d(),this.connected=!1,this.reconnecting=!1,this.reconnectAttempt=0,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.sessionPickerClickOutsideHandler=null,this.sessionSearchClickOutsideHandler=null,this.assistantName=it().name,this.assistantAvatar=it().avatar,this.assistantAgentId=it().agentId??null,this.userName=Ce().name,this.userAvatar=Ce().avatar,this.currentModel=null,this.availableModels=[],this.modelPickerOpen=!1,this.sessionKey=this.settings.sessionKey,this.sessionPickerOpen=!1,this.sessionPickerPosition=null,this.sessionPickerSearch="",this.sessionSearchOpen=!1,this.sessionSearchPosition=null,this.sessionSearchQuery="",this.sessionSearchResults=[],this.sessionSearchLoading=!1,this.profilePopoverOpen=!1,this.profileEditName="",this.profileEditAvatar="",this.editingTabKey=null,this.chatLoading=!1,this.chatSending=!1,this.chatSendingSessionKey=null,this.chatMessage="",this.chatDrafts={},this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.currentToolName=null,this.currentToolInfo=null,this.workingSessions=new Set,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.splitRatio=this.settings.splitRatio,this.lightbox=ui(),this.driveAccounts=[],this.showDrivePicker=!1,this.driveUploading=!1,this.updateStatus=null,this.updateLoading=!1,this.updateError=null,this.updateLastChecked=null,this.updatePollInterval=null,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.gatewayRestartPending=!1,this.gatewayRestartBusy=!1,this.deployPanelOpen=!1,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.archivedSessions=[],this.archivedSessionsLoading=!1,this.archivedSessionsExpanded=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...Rl},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.workspaceNeedsSetup=!1,this.onboardingPhase=0,this.onboardingData=null,this.onboardingActive=!1,this.wizardActive=!1,this.wizardState=null,this.showSetupTab=!1,this.setupBarDismissed=!1,this.setupProgress=null,this.setupCapabilities=null,this.setupCapabilitiesLoading=!1,this.setupQuickDone=!1,this.onboardingIntegrations=null,this.onboardingCoreProgress=null,this.onboardingExpandedCard=null,this.onboardingLoadingGuide=null,this.onboardingActiveGuide=null,this.onboardingTestingId=null,this.onboardingTestResult=null,this.onboardingConfigValues={},this.onboardingProgress=null,this.allyPanelOpen=!1,this.allyMessages=[],this.allyStream=null,this.allyDraft="",this.allyUnread=0,this.allySending=!1,this.allyWorking=!1,this.allyAttachments=[],this.chatPrivateMode=!1,this.privateSessions=new Map,this._privateSessionTimer=null,this.dynamicSlots={},this.sessionResources=[],this.sessionResourcesCollapsed=!1,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.skillsSubTab="godmode",this.godmodeSkills=null,this.godmodeSkillsLoading=!1,this.expandedSkills=new Set,this.rosterData=[],this.rosterLoading=!1,this.rosterError=null,this.rosterFilter="",this.expandedAgents=new Set,this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...Ml},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.toasts=[],this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatUserNearBottom=!0,this.chatIsAutoScrolling=!1,this.chatNewMessagesBelow=!1,this.consciousnessStatus="idle",this.trustTrackerData=null,this.trustTrackerLoading=!1,this.guardrailsData=null,this.guardrailsLoading=!1,this.guardrailsShowAddForm=!1,this.dashboardPreviousSessionKey=null,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=!1,this.basePath="",this.popStateHandler=()=>_l(this),this.keydownHandler=()=>{},this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null,this._eventBusUnsubs=[]}createRenderRoot(){return this}connectedCallback(){if(super.connectedCallback(),this.settings.userName)this.userName=this.settings.userName;else{const e=Ce();this.userName=e.name}if(this.settings.userAvatar)this.userAvatar=this.settings.userAvatar;else{const e=Ce();this.userAvatar=e.avatar}Gl(this),vd(this),this._restorePrivateSessions(),this._eventBusUnsubs.push(V.on("chat-navigate",e=>{e.sessionKey&&e.sessionKey!==this.sessionKey&&(e.sessionKey==="new"?this.sessionKey=`webchat-${Date.now()}`:this.sessionKey=e.sessionKey),e.tab==="chat"&&this.setTab("chat"),e.message&&(this.chatMessage=e.message)}))}firstUpdated(){Ql(this)}disconnectedCallback(){pi(),this._stopPrivateSessionTimer();for(const e of this._eventBusUnsubs)e();this._eventBusUnsubs=[],Yl(this),super.disconnectedCallback()}updated(e){Xl(this,e),this._syncContext()}_syncContext(){const e=this._ctx;e.connected===this.connected&&e.reconnecting===this.reconnecting&&e.sessionKey===this.sessionKey&&e.assistantName===this.assistantName&&e.assistantAvatar===this.assistantAvatar&&e.userName===this.userName&&e.userAvatar===this.userAvatar&&e.theme===this.theme&&e.themeResolved===this.themeResolved&&e.settings===this.settings&&e.basePath===this.basePath&&e.gateway===this.client||(this._ctx={connected:this.connected,reconnecting:this.reconnecting,sessionKey:this.sessionKey,assistantName:this.assistantName,assistantAvatar:this.assistantAvatar,userName:this.userName,userAvatar:this.userAvatar,theme:this.theme,themeResolved:this.themeResolved,settings:this.settings,basePath:this.basePath,gateway:this.client,send:(t,n)=>this.client?.request(t,n)??Promise.reject(new Error("Not connected")),setTab:t=>this.setTab(t),addToast:(t,n)=>this.showToast(t,n??"info"),openSidebar:t=>this.handleOpenSidebar(t.content,{title:t.title,mimeType:t.mimeType,filePath:t.filePath}),closeSidebar:()=>this.handleCloseSidebar()})}connect(){We(this)}handleChatScroll(e){is(this,e)}handleLogsScroll(e){as(this,e)}exportLogs(e,t){os(e,t)}resetToolStream(){$t(this),this.sessionResources=[]}resetChatScroll(){we(this)}async loadAssistantIdentity(){await Ts(this)}applySettings(e){te(this,e)}setTab(e){vl(this,e)}setTheme(e,t){bl(this,e,t)}async loadOverview(){await Ys(this)}async loadCron(){await Bt(this)}async handleAbortChat(){await qt(this)}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}async handleTrustLoad(){await Yt(this)}async handleTrustAddWorkflow(e){await fd(this,e)}async handleTrustRemoveWorkflow(e){await md(this,e)}async handleDailyRate(e,t){await gd(this,e,t)}async handleGuardrailsLoad(){const{loadGuardrails:e}=await T(async()=>{const{loadGuardrails:t}=await import("./ctrl-settings-C0Jr7LNg.js").then(n=>n.ad);return{loadGuardrails:t}},[],import.meta.url);await e(this)}async handleGuardrailToggle(e,t){const{toggleGuardrail:n}=await T(async()=>{const{toggleGuardrail:s}=await import("./ctrl-settings-C0Jr7LNg.js").then(i=>i.ad);return{toggleGuardrail:s}},[],import.meta.url);await n(this,e,t)}async handleGuardrailThresholdChange(e,t,n){const{updateGuardrailThreshold:s}=await T(async()=>{const{updateGuardrailThreshold:i}=await import("./ctrl-settings-C0Jr7LNg.js").then(a=>a.ad);return{updateGuardrailThreshold:i}},[],import.meta.url);await s(this,e,t,n)}async handleCustomGuardrailToggle(e,t){const{toggleCustomGuardrail:n}=await T(async()=>{const{toggleCustomGuardrail:s}=await import("./ctrl-settings-C0Jr7LNg.js").then(i=>i.ad);return{toggleCustomGuardrail:s}},[],import.meta.url);await n(this,e,t)}async handleCustomGuardrailDelete(e){const{deleteCustomGuardrail:t}=await T(async()=>{const{deleteCustomGuardrail:n}=await import("./ctrl-settings-C0Jr7LNg.js").then(s=>s.ad);return{deleteCustomGuardrail:n}},[],import.meta.url);await t(this,e)}async handleCustomGuardrailAdd(e){const{addCustomGuardrailFromUI:t}=await T(async()=>{const{addCustomGuardrailFromUI:n}=await import("./ctrl-settings-C0Jr7LNg.js").then(s=>s.ad);return{addCustomGuardrailFromUI:n}},[],import.meta.url);await t(this,e),this.guardrailsShowAddForm=!1}handleToggleGuardrailAddForm(){this.guardrailsShowAddForm=!this.guardrailsShowAddForm}async handleMissionControlOpenSession(e){const t=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:t,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:n}=await T(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>he);return{loadChatHistory:s}},void 0,import.meta.url);await n(this),this.loadSessionResources()}async handleMissionControlOpenTaskSession(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e});if(t?.sessionId){if(t.task?.title){const{autoTitleCache:n}=await T(async()=>{const{autoTitleCache:s}=await import("./ctrl-settings-C0Jr7LNg.js").then(i=>i.ac);return{autoTitleCache:s}},[],import.meta.url);n.set(t.sessionId,t.task.title)}await this.handleMissionControlOpenSession(t.sessionId),t.queueOutput&&this.chatMessages.length===0&&await this.seedSessionWithAgentOutput(t.task?.title??"task",t.queueOutput,t.agentPrompt??void 0)}}catch(t){console.error("[MissionControl] Failed to open task session:",t),this.showToast("Failed to open session","error")}}async handleMissionControlStartQueueItem(e){await this.handleMissionControlOpenTaskSession(e)}async handleSwarmViewProofDoc(e){return this.handleOpenProofDoc(e)}async handleSwarmViewRunLog(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("godmode.delegation.runLog",{queueItemId:e});t?.content?this.handleOpenSidebar(t.content,{mimeType:t.mimeType??"text/markdown",title:t.title??"Agent Logs"}):this.showToast("No logs available","error")}catch{this.showToast("Failed to load agent logs","error")}}async handleAllyAction(e,t,n,s){if(e==="navigate"&&t)this.setTab(t);else if(e==="rpc"&&n&&this.client)try{await this.client.request(n,s??{}),this.showToast("Done","success",2e3)}catch(i){console.error("[Ally] Action RPC failed:",i),this.showToast("Action failed","error")}}handleAllyToggle(){this.allyPanelOpen=!this.allyPanelOpen,this.allyPanelOpen&&(this.allyUnread=0,this._loadAllyHistory().then(()=>{this._scrollAllyToBottom(),requestAnimationFrame(()=>this._scrollAllyToBottom())}))}handleAllyDraftChange(e){this.allyDraft=e}handleAllyAttachmentsChange(e){this.allyAttachments=e}async handleAllySend(){const e=this.allyDraft.trim(),t=this.allyAttachments;if(!e&&t.length===0||this.allySending)return;const n=Ha(this);let s=e?`${n}

${e}`:n;this.allyDraft="",this.allyAttachments=[],this.allySending=!0,this.allyMessages=[...this.allyMessages,{role:"user",content:e||"(image)",timestamp:Date.now()}];try{let i;if(t.length>0){const c=[];for(const m of t){if(!m.dataUrl)continue;const o=m.dataUrl.match(/^data:([^;]+);base64,(.+)$/);if(!o)continue;const[,p,g]=o;p.startsWith("image/")&&c.push({type:"image",mimeType:p,content:g,fileName:m.fileName})}if(c.length>0){i=c;try{await this.client?.request("images.cache",{images:c.map(m=>({data:m.content,mimeType:m.mimeType,fileName:m.fileName})),sessionKey:L})}catch{}}}const a=`ally-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;try{await this.client?.request("sessions.patch",{key:L,lastChannel:"webchat"})}catch{}await this.client?.request("agent",{sessionKey:L,message:s,deliver:!1,channel:"webchat",idempotencyKey:a,attachments:i}),this.allyWorking=!0;const r=this.allyMessages[this.allyMessages.length-1]?.content,l=setInterval(async()=>{if(!this.allyWorking){clearInterval(l);return}try{await this._loadAllyHistory();const c=this.allyMessages[this.allyMessages.length-1];c&&c.role==="assistant"&&c.content!==r&&(this.allyWorking=!1,this.allyStream=null,clearInterval(l),this._scrollAllyToBottom())}catch{}},5e3);setTimeout(()=>clearInterval(l),12e4)}catch(i){const a=i instanceof Error?i.message:String(i);console.error("[Ally] Failed to send ally message:",a),this.allyMessages=[...this.allyMessages,{role:"assistant",content:`*Send failed: ${a}*`,timestamp:Date.now()}]}finally{this.allySending=!1}}handleAllyOpenFull(){this.allyPanelOpen=!1,this.setTab("chat"),this.applySettings({...this.settings,sessionKey:L,lastActiveSessionKey:L,tabLastViewed:{...this.settings.tabLastViewed,[L]:Date.now()}}),this.sessionKey=L,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),T(async()=>{const{loadChatHistory:e}=await Promise.resolve().then(()=>he);return{loadChatHistory:e}},void 0,import.meta.url).then(({loadChatHistory:e})=>e(this)),this.loadSessionResources()}_scrollAllyToBottom(){this.updateComplete.then(()=>{requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector?.(".ally-panel, .ally-inline")??document.querySelector(".ally-panel, .ally-inline");if(!e)return;const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)})})}async _loadAllyHistory(){try{const e=await this.client?.request("chat.history",{sessionKey:L,limit:100});if(e?.messages){const{extractText:t,formatApiError:n}=await T(async()=>{const{extractText:i,formatApiError:a}=await Promise.resolve().then(()=>_o);return{extractText:i,formatApiError:a}},void 0,import.meta.url);this.allyMessages=e.messages.map(i=>{const a=i.role??"assistant",r=a.toLowerCase();if(r==="tool"||r==="toolresult"||r==="tool_result"||r==="function"||r==="system")return null;const l=i;if(l.toolCallId||l.tool_call_id||l.toolName||l.tool_name)return null;if(Array.isArray(i.content)){const p=i.content;if(!p.some(y=>{const b=(typeof y.type=="string"?y.type:"").toLowerCase();return(b==="text"||b==="")&&typeof y.text=="string"&&y.text.trim().length>0})&&p.some(b=>{const _=(typeof b.type=="string"?b.type:"").toLowerCase();return _==="tool_use"||_==="tool_result"||_==="toolresult"||_==="tooluse"}))return null}let c=t(i);if(!c)return null;const m=n(c);if(m&&(c=m),c=c.replace(/^\[GodMode Context:[^\]]*\]\s*/i,"").trim(),!c)return null;const o=$d(c,a);return o?{role:r==="user"?"user":"assistant",content:o,timestamp:i.timestamp}:null}).filter(i=>i!==null);const s=[];for(const i of this.allyMessages){const a=s[s.length-1];a&&a.role===i.role&&a.content===i.content||s.push(i)}this.allyMessages=s}}catch{}}async seedSessionWithAgentOutput(e,t,n){if(!this.client||!this.connected)return;this.handleOpenSidebar(t,{title:`Agent Output: ${e}`,filePath:null,mimeType:null});const s=t.match(/## Summary\n([\s\S]*?)(?=\n## |$)/),i=s?s[1].trim().split(`
`).slice(0,3).join(`
`):"Output available in sidebar.",a=[`Agent completed **${e}**.`,"",i,"","Full output is in the sidebar. What would you like to do?"].join(`
`);try{const{sendChatMessage:r}=await T(async()=>{const{sendChatMessage:l}=await Promise.resolve().then(()=>he);return{sendChatMessage:l}},void 0,import.meta.url);await r(this,a)}catch(r){console.error("[Session] Failed to seed session with agent output:",r)}}async handleMissionControlAddToQueue(e,t){if(!(!this.client||!this.connected))try{await this.client.request("queue.add",{type:e,title:t,priority:"normal"}),this.showToast("Added to queue","success",2e3)}catch{this.showToast("Failed to add to queue","error")}}removeQueuedMessage(e){Zs(this,e)}async handleSendChat(e,t){await ei(this,e,t)}handleToggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen}handleToggleSessionSearch(e){if(!this.sessionSearchOpen&&e){const n=e.currentTarget.getBoundingClientRect();this.sessionSearchPosition={top:n.bottom+8,right:window.innerWidth-n.right}}this.sessionSearchOpen=!this.sessionSearchOpen,this.sessionSearchOpen||(this.sessionSearchQuery="",this.sessionSearchResults=[])}async handleSessionSearchQuery(e){if(this.sessionSearchQuery=e,!e.trim()){this.sessionSearchResults=[];return}if(this.client){this.sessionSearchLoading=!0;try{const t=await this.client.request("sessions.searchContent",{query:e.trim(),limit:20});this.sessionSearchResults=t.results}catch(t){console.error("Session search failed:",t),this.sessionSearchResults=[]}finally{this.sessionSearchLoading=!1}}}handleSelectSession(e){this.sessionPickerOpen=!1,this.sessionSearchOpen=!1,this.sessionSearchQuery="",this.sessionSearchResults=[]}async handleWhatsAppStart(e){await La(this,e)}async handleWhatsAppWait(){await Ia(this)}async handleWhatsAppLogout(){await Ma(this)}async handleChannelConfigSave(){await Ra(this)}async handleChannelConfigReload(){await Ea(this)}async handleCompactChat(){if(!this.connected){this.showToast("Cannot compact: not connected","error");return}if(!this.sessionKey){this.showToast("Cannot compact: no active session","error");return}this.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null};try{await this.handleSendChat("/compact")}catch(e){this.compactionStatus=null,console.error("Compaction failed:",e),this.showToast("Compaction failed","error")}}injectCompactionSummary(e,t){const n={role:"system",content:e,timestamp:Date.now(),isCompactionSummary:!0,keptMessages:t};this.chatMessages=[n,...this.chatMessages]}handleNostrProfileEdit(e,t){Oa(this,e,t)}handleNostrProfileCancel(){Ka(this)}handleNostrProfileFieldChange(e,t){Na(this,e,t)}async handleNostrProfileSave(){await Ua(this)}async handleNostrProfileImport(){await Wa(this)}handleNostrProfileToggleAdvanced(){Fa(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,te(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleGatewayRestartClick(){this.gatewayRestartPending=!0}async handleGatewayRestartConfirm(){if(!(!this.client||this.gatewayRestartBusy)){this.gatewayRestartBusy=!0;try{await this.client.request("godmode.gateway.restart")}catch{}finally{this.gatewayRestartBusy=!1,this.gatewayRestartPending=!1}}}handleGatewayRestartCancel(){this.gatewayRestartPending=!1}handleDeployPanelToggle(){this.deployPanelOpen=!this.deployPanelOpen}async handleDeployDismiss(){if(this.client){try{await this.client.request("godmode.deploy.dismiss")}catch{}this.deployPanelOpen=!1,this.updateStatus&&(this.updateStatus={...this.updateStatus,pendingDeploy:null})}}handleOpenSidebar(e,t={}){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarMimeType=t.mimeType?.trim()||null,this.sidebarFilePath=t.filePath?.trim()||null,this.sidebarTitle=t.title?.trim()||null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.showDrivePicker=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode!=="proof"&&(this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null),this.sidebarCloseTimer=null)},200)}async handleOpenFile(e,t){if(!this.client||!this.connected){if(t){const s=e.split(".").pop()?.toLowerCase()??"",a={md:"text/markdown",markdown:"text/markdown",mdx:"text/markdown",json:"application/json",json5:"application/json",yaml:"text/yaml",yml:"text/yaml",csv:"text/csv",tsv:"text/tab-separated-values",html:"text/html",htm:"text/html"}[s]??null,r=e.split("/").pop()??e;this.showToast("Opening cached version (gateway offline)","warning"),this.handleOpenSidebar(t,{mimeType:a,filePath:e,title:r});return}this.showToast("Not connected to gateway","error");return}let n=e;if(!e.includes("/")&&!e.includes("\\")&&!e.startsWith("~"))try{n=(await this.client.request("files.resolve",{filename:e})).path}catch{}try{const s=await this.client.request("files.read",{path:n}),i=n.split(".").pop()?.toLowerCase()??"",r={md:"text/markdown",markdown:"text/markdown",mdx:"text/markdown",json:"application/json",json5:"application/json",yaml:"text/yaml",yml:"text/yaml",csv:"text/csv",tsv:"text/tab-separated-values",html:"text/html",htm:"text/html"}[i]??s.contentType??s.mime??null,l=n.split("/").pop()??n;this.handleOpenSidebar(s.content,{mimeType:r,filePath:n,title:l}),s.truncated&&this.showToast(`Opened truncated file: ${l}`,"warning")}catch(s){console.error("[Chat] Failed to open file via gateway:",s);const i=n.match(/\/inbox\/([^/]+)$/);if(i)try{const a=await fetch(`${this.basePath}/godmode/artifacts/${encodeURIComponent(i[1])}`);if(a.ok){const r=await a.text(),l=n.split(".").pop()?.toLowerCase()??"",m={md:"text/markdown",markdown:"text/markdown",mdx:"text/markdown",json:"application/json",yaml:"text/yaml",yml:"text/yaml",csv:"text/csv",html:"text/html",htm:"text/html"}[l]??a.headers.get("content-type")??null,o=n.split("/").pop()??n;this.handleOpenSidebar(r,{mimeType:m,filePath:n,title:o});return}}catch{}if(t){const a=e.split(".").pop()?.toLowerCase()??"",l={md:"text/markdown",markdown:"text/markdown",mdx:"text/markdown",json:"application/json",yaml:"text/yaml",yml:"text/yaml",csv:"text/csv",html:"text/html",htm:"text/html"}[a]??null,c=e.split("/").pop()??e;this.showToast("Opening cached version (file read failed)","warning"),this.handleOpenSidebar(t,{mimeType:l,filePath:e,title:c});return}this.showToast(`Failed to open file: ${e}`,"error")}}async handleToggleDrivePicker(){if(this.showDrivePicker){this.showDrivePicker=!1;return}if(this.driveAccounts.length===0)try{const e=await this.client?.request("files.listDriveAccounts",{});this.driveAccounts=e?.accounts??[]}catch{this.driveAccounts=[]}this.showDrivePicker=!0}async handlePushToDrive(e,t){if(!this.driveUploading){if(this.showDrivePicker=!1,this._pendingBatchPaths&&this._pendingBatchPaths.length>0){const n=this._pendingBatchPaths;this._pendingBatchPaths=void 0,await this._executeBatchDrive(n,t);return}this.driveUploading=!0;try{const n={filePath:e};t&&(n.account=t);const s=await this.client?.request("files.pushToDrive",n),i=t?` to ${t.split("@")[0]}`:"",a=s?.message??`Uploaded${i} to Google Drive`,r=s?.driveUrl;this.showToast(a,"success",r?8e3:5e3,r?{label:"View in Drive",url:r}:void 0)}catch(n){console.error("Push to Drive failed:",n);const s=n instanceof Error?n.message:typeof n=="object"&&n!==null&&"message"in n?String(n.message):"Unknown error";s.includes("GOG_NOT_FOUND")||s.includes("gog CLI not found")?this.showToast("Google Drive not configured. Install gog CLI: npm install -g gog-cli, then run: gog auth add <email> --services drive","warning",1e4):s.includes("GOG_AUTH")||s.includes("auth")&&s.includes("expired")?this.showToast("Google Drive auth expired. Re-authenticate: gog auth add <email> --services drive","warning",8e3):this.showToast(`Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1}}}async handleBatchPushToDrive(e){if(this.driveUploading||e.length===0)return;if(!this.driveAccounts||this.driveAccounts.length===0)try{const n=await this.client?.request("files.listDriveAccounts");this.driveAccounts=n?.accounts??[]}catch{}if(this.driveAccounts&&this.driveAccounts.length>1){this._pendingBatchPaths=e,this.showDrivePicker=!0;return}const t=this.driveAccounts?.[0]?.email;await this._executeBatchDrive(e,t)}async _executeBatchDrive(e,t){this.driveUploading=!0,this.showToast(`Uploading ${e.length} files to Drive...`,"info",0);try{const n={filePaths:e};t&&(n.account=t);const s=await this.client?.request("files.batchPushToDrive",n);this.dismissAllToasts();const i=s?.results?.filter(r=>r.success).length??0,a=s?.results?.length??e.length;i===a?this.showToast(`Uploaded ${i} files to Google Drive`,"success",5e3):this.showToast(`Uploaded ${i}/${a} files (${a-i} failed)`,"warning",8e3)}catch(n){this.dismissAllToasts();const s=n instanceof Error?n.message:"Unknown error";this.showToast(`Batch Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1,this._pendingBatchPaths=void 0}}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}handleImageClick(e,t,n){this.lightbox=Zc(e,t,n)}handleLightboxClose(){this.lightbox=ed()}handleLightboxNav(e){this.lightbox=td(this.lightbox,e)}normalizeWorkspacePathCandidate(e,t={}){let n=e.trim();if(!n||n.startsWith("#"))return null;for(;n.startsWith("./");)n=n.slice(2);if(n=n.replaceAll("\\","/"),!t.allowAbsolute)for(;n.startsWith("/");)n=n.slice(1);return!n||n.includes("\0")?null:n}isAbsoluteFilesystemPath(e){return e.startsWith("/")||e.startsWith("~/")||/^[a-z]:[\\/]/i.test(e)}inferMimeTypeFromPath(e){if(!e)return null;const t=e.trim().toLowerCase();if(!t)return null;const n=t.split(".").pop()??"";return n?n==="md"||n==="markdown"||n==="mdx"?"text/markdown":n==="html"||n==="htm"?"text/html":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":n==="svg"||n==="svgz"?"image/svg+xml":n==="avif"||n==="bmp"||n==="gif"||n==="heic"||n==="heif"||n==="jpeg"||n==="jpg"||n==="png"||n==="webp"?`image/${n==="jpg"?"jpeg":n}`:null:null}sidebarTitleForPath(e){const t=e.replaceAll("\\","/").trim();if(!t)return"Document";const n=t.split("/");return n[n.length-1]||t}async listWorkspaceIdsForPathResolution(){const e=[],t=new Set,n=s=>{if(typeof s!="string")return;const i=s.trim();!i||t.has(i)||(t.add(i),e.push(i))};n(this.selectedWorkspace?.id);for(const s of this.workspaces??[])n(s.id);if(e.length>0||!this.client||!this.connected)return e;try{const s=await this.client.request("workspaces.list",{});for(const i of s.workspaces??[])n(i.id)}catch{}return e}async openWorkspaceRelativeFileInViewer(e){if(!this.client||!this.connected)return!1;const t=await this.listWorkspaceIdsForPathResolution();for(const n of t)try{const s=await this.client.request("workspaces.readFile",{workspaceId:n,filePath:e});if(typeof s.content!="string")continue;return this.handleOpenSidebar(s.content,{mimeType:s.contentType??s.mime??this.inferMimeTypeFromPath(e),filePath:s.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}return!1}extractWorkspacePathCandidatesFromHref(e){const t=e.trim();if(!t)return[];const n=[],s=t.toLowerCase();if(s.startsWith("mailto:")||s.startsWith("tel:")||s.startsWith("javascript:")||s.startsWith("data:"))return[];if(t.startsWith("godmode-file://")){let m=t.slice(15);try{m=decodeURIComponent(m)}catch{}return n.push(m),n}if(t.startsWith("file://")){let m=t.slice(7);m.startsWith("/~/")&&(m="~"+m.slice(2));try{m=decodeURIComponent(m)}catch{}n.push(m);const o=[],p=new Set;for(const g of n){const y=this.normalizeWorkspacePathCandidate(g,{allowAbsolute:!0});!y||p.has(y)||(p.add(y),o.push(y))}return o}const i=/^[a-z][a-z0-9+.-]*:/i.test(t),a=/^[a-z]:[\\/]/i.test(t);(!i||a)&&n.push(t);let r=null;try{r=new URL(t,window.location.href)}catch{r=null}if(r&&/^https?:$/.test(r.protocol)&&r.origin===window.location.origin){for(const b of Cd){const _=r.searchParams.get(b);_&&n.push(_)}const o=(t.split("#")[0]??"").split("?")[0]??"";o.length>0&&!o.startsWith("/")&&!o.includes("://")&&n.push(o);let g=r.pathname;this.basePath&&g.startsWith(`${this.basePath}/`)?g=g.slice(this.basePath.length):this.basePath&&g===this.basePath&&(g="");const y=g.startsWith("/")?g.slice(1):g;if(y){n.push(y);const b=y.indexOf("/");if(b>0){const _=y.slice(0,b).toLowerCase();jn.has(_)&&n.push(y.slice(b+1))}}if(g.startsWith("/")&&y){const b=y.split("/")[0]?.toLowerCase()??"";jn.has(b)||n.push(g)}}const l=[],c=new Set;for(const m of n){let o=m;try{o=decodeURIComponent(m)}catch{}const p=this.normalizeWorkspacePathCandidate(o,{allowAbsolute:!0});!p||c.has(p)||(c.add(p),l.push(p))}return l}async openWorkspaceFileInViewer(e){if(!this.client||!this.connected)return!1;const t=this.isAbsoluteFilesystemPath(e);if(!t&&await this.openWorkspaceRelativeFileInViewer(e))return!0;try{const n=await this.client.request("workspaces.readFile",{path:e});if(typeof n.content=="string")return this.handleOpenSidebar(n.content,{mimeType:n.contentType??n.mime??this.inferMimeTypeFromPath(e),filePath:n.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}if(!t)return!1;try{const n=await this.client.request("files.read",{path:e,maxSize:1e6});return typeof n.content!="string"?!1:(this.handleOpenSidebar(n.content,{mimeType:this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0)}catch{return!1}}async handleOpenMessageFileLink(e){const t=this.extractWorkspacePathCandidatesFromHref(e);if(t.length===0)return!1;for(const n of t)if(await this.openWorkspaceFileInViewer(n))return!0;return!1}showToast(e,t="info",n=5e3,s){const i=wd(e,t,n,s);this.toasts=Td(this.toasts,i),n>0&&window.setTimeout(()=>{this.dismissToast(i.id)},n)}dismissToast(e){this.toasts=Sd(this.toasts,e)}dismissAllToasts(){this.toasts=[]}handlePrivateModeToggle(){if(this.chatPrivateMode){const e=this.sessionKey;this.chatPrivateMode=!1,this._destroyPrivateSession(e),this.showToast("Private session destroyed","info",2e3);return}this.chatPrivateMode=!0,this.setTab("chat"),T(async()=>{const{createNewSession:e}=await Promise.resolve().then(()=>tt);return{createNewSession:e}},void 0,import.meta.url).then(({createNewSession:e})=>{e(this);const t=Date.now()+1440*60*1e3;this.privateSessions=new Map(this.privateSessions).set(this.sessionKey,t),this._persistPrivateSessions(),this._startPrivateSessionTimer(),this.client&&this.connected&&this.client.request("session.setPrivate",{sessionKey:this.sessionKey,enabled:!0}).catch(()=>{}),this.chatMessages=[{role:"assistant",content:`This is a **private session**. Nothing will be saved to memory or logs.

This session self-destructs when you close it or in **24 hours** — whichever comes first.`,timestamp:Date.now()}],this.requestUpdate()}),this.showToast("Private session created — 24h countdown started","info",3e3)}async _destroyPrivateSession(e){const t=new Map(this.privateSessions);if(t.delete(e),this.privateSessions=t,this._persistPrivateSessions(),this.sessionKey===e){this.chatPrivateMode=!1;const n=this.settings.openTabs.filter(a=>a!==e),s=n[0]||L;this.applySettings({...this.settings,openTabs:n,sessionKey:s,lastActiveSessionKey:s}),this.sessionKey=s,await(await T(async()=>{const{loadChatHistory:a}=await Promise.resolve().then(()=>he);return{loadChatHistory:a}},void 0,import.meta.url)).loadChatHistory(this);const{scheduleChatScroll:i}=await T(async()=>{const{scheduleChatScroll:a}=await Promise.resolve().then(()=>ja);return{scheduleChatScroll:a}},void 0,import.meta.url);i(this,!0)}else this.applySettings({...this.settings,openTabs:this.settings.openTabs.filter(n=>n!==e)});this.client&&this.connected&&(this.client.request("session.setPrivate",{sessionKey:e,enabled:!1}).catch(()=>{}),this.client.request("sessions.delete",{key:e,deleteTranscript:!0}).catch(()=>{})),this.privateSessions.size===0&&this._stopPrivateSessionTimer()}_persistPrivateSessions(){const e=Array.from(this.privateSessions.entries());e.length===0?localStorage.removeItem("godmode.privateSessions"):localStorage.setItem("godmode.privateSessions",JSON.stringify(e))}_restorePrivateSessions(){try{const e=localStorage.getItem("godmode.privateSessions");if(!e)return;const t=JSON.parse(e),n=Date.now(),s=t.filter(([,i])=>i>n);if(this.privateSessions=new Map(s),s.length!==t.length){const i=t.filter(([,a])=>a<=n);for(const[a]of i)this._destroyPrivateSession(a)}this.privateSessions.size>0&&(this.privateSessions.has(this.sessionKey)&&(this.chatPrivateMode=!0),this._startPrivateSessionTimer()),this._persistPrivateSessions()}catch{localStorage.removeItem("godmode.privateSessions")}}_startPrivateSessionTimer(){this._privateSessionTimer||(this._privateSessionTimer=setInterval(()=>{const e=Date.now();for(const[t,n]of this.privateSessions)n<=e&&(this._destroyPrivateSession(t),this.showToast("Private session expired and was destroyed","info",3e3));this.privateSessions.size>0&&this.requestUpdate()},3e4))}_stopPrivateSessionTimer(){this._privateSessionTimer&&(clearInterval(this._privateSessionTimer),this._privateSessionTimer=null)}handleResourceClick(e){e.path?this.handleWorkFileClick(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}async loadSessionResources(){if(!(!this.client||!this.connected))try{const t=(await this.client.request("resources.list",{sessionKey:this.sessionKey,limit:20})).resources??[],n=new Set(t.filter(s=>s.proofSlug).map(s=>s.proofSlug));if(this.chatMessages?.length)for(const s of this.chatMessages){const i=s,a=Array.isArray(i.content)?i.content:[];for(const r of a){const l=typeof r.text=="string"?r.text:typeof r.content=="string"?r.content:null;if(l)try{const c=JSON.parse(l);c._sidebarAction?.type==="proof"&&c._sidebarAction.slug&&!n.has(c._sidebarAction.slug)&&(n.add(c._sidebarAction.slug),t.unshift({id:`proof:${c._sidebarAction.slug}`,title:c.title??"Proof Document",type:"doc",path:c.filePath,sessionKey:this.sessionKey,proofSlug:c._sidebarAction.slug}))}catch{}}}this.sessionResources=t}catch(e){console.warn("[SessionResources] load failed:",e),this.sessionResources=[]}}handleSessionResourceClick(e){e.proofSlug?this.handleOpenProofDoc(e.proofSlug):e.path?this.handleOpenFile(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}handleToggleSessionResources(){this.sessionResourcesCollapsed=!this.sessionResourcesCollapsed}handleViewAllResources(){this.setTab("work")}async handleWorkFileClick(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("workspaces.readFile",{path:e});if(!t.content){this.showToast(t.error??"Failed to read file","error");return}this.handleOpenSidebar(t.content,{mimeType:t.contentType??t.mime??this.inferMimeTypeFromPath(e),filePath:t.path??e,title:this.sidebarTitleForPath(e)})}catch(t){console.error("[Work] Failed to read file:",t),this.showToast(`Failed to open: ${e}`,"error")}}handleWorkSkillClick(e,t){this.handleStartChatWithPrompt(`Tell me about the "${e}" skill and how it's used in the ${t} project.`)}handlePeopleImport(e){const t=e==="apple"?"Import my contacts from Apple Contacts and organize them into categories.":"Import my contacts from Google Contacts and organize them into categories.";this.handleStartChatWithPrompt(t)}handleOnboardingStart(){this.onboardingPhase=1,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:1}),this.client?.request("onboarding.update",{phase:1,completePhase:0})}async handleOnboardingIdentitySubmit(e){if(this.client)try{await this.client.request("onboarding.update",{phase:2,completePhase:1,identity:e}),this.onboardingPhase=2,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:2,identity:e}),this.userName=e.name,this.userAvatar=e.emoji,this.applySettings({...this.settings,userName:e.name,userAvatar:e.emoji}),this.setTab("chat"),T(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>tt);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this);const n=`I just set up my GodMode identity. My name is ${e.name}${e.mission?` and my mission is: ${e.mission}`:""}. Let's set up my workspace.`;this.chatMessage=n,this.handleSendChat(n)})}catch(t){console.error("[Onboarding] Identity submit failed:",t),this.showToast("Failed to save identity","error")}}handleOnboardingSkipPhase(){if(!this.client)return;const e=Math.min(this.onboardingPhase+1,6);this.onboardingPhase=e,this.client.request("onboarding.update",{phase:e,completePhase:this.onboardingPhase})}handleOnboardingComplete(){this.onboardingActive=!1,this.onboardingPhase=6,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:6,completedAt:new Date().toISOString()}),this.client?.request("onboarding.complete",{summary:this.onboardingData?.summary??null}),this.showToast("Welcome to GodMode!","success",4e3)}handleStartChatWithPrompt(e){this.setTab("chat"),T(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>tt);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this),this.chatMessage=e,this.requestUpdate()})}handleOpenSupportChat(){const e="agent:main:support";if(this.sessionKey===e){this.setTab("chat");return}T(async()=>{const{saveDraft:s}=await Promise.resolve().then(()=>Il);return{saveDraft:s}},void 0,import.meta.url).then(({saveDraft:s})=>s(this));const n=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:n,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),T(async()=>{const{autoTitleCache:s}=await import("./ctrl-settings-C0Jr7LNg.js").then(i=>i.ac);return{autoTitleCache:s}},[],import.meta.url).then(({autoTitleCache:s})=>{s.set(e,"Support")}),T(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>he);return{loadChatHistory:s}},void 0,import.meta.url).then(({loadChatHistory:s})=>{s(this).then(()=>{this.loadSessionResources(),this.chatMessages.length===0&&this.sessionKey===e&&(this.chatMessages=[{role:"assistant",content:`**Welcome to GodMode Support**

I have full access to your system diagnostics and GodMode knowledge base. I can help with:

- Troubleshooting issues
- Feature questions and configuration
- Setup guidance
- Escalation to the team if needed

What can I help you with?`,timestamp:Date.now()}],this.requestUpdate())}).catch(i=>{console.error("[Support] Failed to load chat history:",i)})})}handleWizardOpen(){T(async()=>{const{emptyWizardState:e}=await import("./views-settings-DqDrIl47.js").then(t=>t.C);return{emptyWizardState:e}},__vite__mapDeps([4,1,3,5]),import.meta.url).then(({emptyWizardState:e})=>{this.wizardState=e(),this.wizardActive=!0,this.requestUpdate()})}handleWizardClose(){this.wizardActive=!1,this.wizardState=null,this.requestUpdate()}handleWizardStepChange(e){this.wizardState&&(this.wizardState={...this.wizardState,step:e},this.requestUpdate())}handleWizardAnswerChange(e,t){this.wizardState&&(this.wizardState={...this.wizardState,answers:{...this.wizardState.answers,[e]:t}},this.requestUpdate())}async handleWizardPreview(){if(!(!this.client||!this.wizardState))try{const[e,t]=await Promise.all([this.client.request("onboarding.wizard.preview",this.wizardState.answers),this.client.request("onboarding.wizard.diff",this.wizardState.answers).catch(()=>null)]),n={};for(const i of e.files??[])n[i.path]=i.wouldCreate;const s={};if(t){for(const i of t.additions)s[i.path]=!0;for(const i of t.changes)s[i.path]=!1}this.wizardState={...this.wizardState,preview:e.files??[],diff:t,fileSelections:n,configSelections:s},this.requestUpdate()}catch(e){console.error("[Wizard] Preview failed:",e)}}handleWizardFileToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,fileSelections:{...this.wizardState.fileSelections,[e]:t}},this.requestUpdate())}handleWizardConfigToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,configSelections:{...this.wizardState.configSelections,[e]:t}},this.requestUpdate())}async handleWizardGenerate(){if(!this.client||!this.wizardState)return;this.wizardState={...this.wizardState,generating:!0,error:null},this.requestUpdate();const e=[];for(const[n,s]of Object.entries(this.wizardState.fileSelections))s||e.push(n);const t=[];for(const[n,s]of Object.entries(this.wizardState.configSelections))s||t.push(n);try{const n=await this.client.request("onboarding.wizard.generate",{...this.wizardState.answers,skipFiles:e,skipKeys:t});this.wizardState={...this.wizardState,generating:!1,step:9,result:{filesCreated:n.filesCreated,filesSkipped:n.filesSkipped,configPatched:n.configPatched,workspacePath:n.workspacePath}},this.requestUpdate(),this.showToast("Memory system generated!","success",4e3)}catch(n){const s=n instanceof Error?n.message:"Failed to generate workspace";this.wizardState={...this.wizardState,generating:!1,error:s},this.requestUpdate(),this.showToast(s,"error")}}async handleQuickSetup(e){T(()=>import("./setup-PC6Qa1Xp.js"),[],import.meta.url).then(async({quickSetup:t})=>{await t(this,e)&&(this.setTab("chat"),T(async()=>{const{loadCapabilities:s}=await import("./setup-PC6Qa1Xp.js");return{loadCapabilities:s}},[],import.meta.url).then(({loadCapabilities:s})=>s(this)))})}handleLoadCapabilities(){T(async()=>{const{loadCapabilities:e}=await import("./setup-PC6Qa1Xp.js");return{loadCapabilities:e}},[],import.meta.url).then(({loadCapabilities:e})=>e(this))}handleCapabilityAction(e){T(async()=>{const{capabilityAction:t}=await import("./setup-PC6Qa1Xp.js");return{capabilityAction:t}},[],import.meta.url).then(({capabilityAction:t})=>t(this,e))}handleHideSetup(){T(async()=>{const{hideSetup:e}=await import("./setup-PC6Qa1Xp.js");return{hideSetup:e}},[],import.meta.url).then(({hideSetup:e})=>e(this))}handleRunAssessment(){this.client&&this.client.request("onboarding.assess",{}).then(()=>{this.handleLoadCapabilities()})}continueSetup(){const e=this.setupProgress?.currentStep??"welcome";this._navigateToSetupStep(e)}dismissSetup(){this.setupBarDismissed=!0,T(async()=>{const{dismissSetupBar:e}=await import("./setup-PC6Qa1Xp.js");return{dismissSetupBar:e}},[],import.meta.url).then(({dismissSetupBar:e})=>e(this))}handleSetupStepClick(e){this._navigateToSetupStep(e)}async loadSetupProgress(){await(await T(()=>import("./setup-PC6Qa1Xp.js"),[],import.meta.url)).loadSetupProgress(this)}_navigateToSetupStep(e){const n={welcome:"Let's get started! What should I call you?","api-key":"Help me connect my Anthropic API key so you can work at full power.",memory:"Help me set up persistent memory with Honcho so you remember our conversations.",integrations:"Help me connect my tools via Composio — starting with Google and GitHub.","second-brain":"Help me link my Obsidian vault as my Second Brain."}[e]??"Help me continue setting up GodMode.";this.handleStartChatWithPrompt(n)}handleUpdateUserProfile(e,t){const n=e.trim().slice(0,50),s=t.trim();this.userName=n||"You",this.userAvatar=s||null,this.applySettings({...this.settings,userName:n,userAvatar:s})}async handleLoadIntegrations(){await(await T(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadIntegrations(this)}handleExpandCard(e){T(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.expandCard(this,e))}async handleLoadGuide(e){await(await T(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadGuide(this,e)}async handleTestIntegration(e){await(await T(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).testIntegration(this,e)}async handleConfigureIntegration(e,t){await(await T(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).configureIntegration(this,e,t)}handleUpdateConfigValue(e,t){this.onboardingConfigValues={...this.onboardingConfigValues,[e]:t}}handleSkipIntegration(e){T(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.skipIntegration(this,e))}async handleMarkOnboardingComplete(){if(!(!this.client||!this.connected))try{await this.client.request("onboarding.complete",{}),this.showSetupTab=!1,this.setTab("chat")}catch(e){console.error("[onboarding] Failed to mark complete:",e)}}async handleOpenProofDoc(e){let t="Proof Document",n=null,s=null;if(this.client&&this.connected)try{const i=await this.client.request("proof.get",{slug:e});t=i.title?.trim()||t,n=i.filePath?.trim()||null,s=i.viewUrl?.trim()||null}catch(i){console.warn("[Proof] Failed to resolve document metadata:",i)}this.sidebarOpen=!0,this.sidebarMode="proof",this.sidebarProofSlug=e,this.sidebarProofUrl=s,this.sidebarProofHtml=null,this.sidebarFilePath=n,this.sidebarTitle=t}handleCloseProofDoc(){this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.handleCloseSidebar()}render(){return pd(this)}};u([ia({context:$a}),h()],d.prototype,"_ctx",2);u([h()],d.prototype,"settings",2);u([h()],d.prototype,"password",2);u([h()],d.prototype,"tab",2);u([h()],d.prototype,"onboarding",2);u([h()],d.prototype,"connected",2);u([h()],d.prototype,"reconnecting",2);u([h()],d.prototype,"reconnectAttempt",2);u([h()],d.prototype,"theme",2);u([h()],d.prototype,"themeResolved",2);u([h()],d.prototype,"hello",2);u([h()],d.prototype,"lastError",2);u([h()],d.prototype,"eventLog",2);u([h()],d.prototype,"assistantName",2);u([h()],d.prototype,"assistantAvatar",2);u([h()],d.prototype,"assistantAgentId",2);u([h()],d.prototype,"userName",2);u([h()],d.prototype,"userAvatar",2);u([h()],d.prototype,"currentModel",2);u([h()],d.prototype,"availableModels",2);u([h()],d.prototype,"modelPickerOpen",2);u([h()],d.prototype,"sessionKey",2);u([h()],d.prototype,"sessionPickerOpen",2);u([h()],d.prototype,"sessionPickerPosition",2);u([h()],d.prototype,"sessionPickerSearch",2);u([h()],d.prototype,"sessionSearchOpen",2);u([h()],d.prototype,"sessionSearchPosition",2);u([h()],d.prototype,"sessionSearchQuery",2);u([h()],d.prototype,"sessionSearchResults",2);u([h()],d.prototype,"sessionSearchLoading",2);u([h()],d.prototype,"profilePopoverOpen",2);u([h()],d.prototype,"profileEditName",2);u([h()],d.prototype,"profileEditAvatar",2);u([h()],d.prototype,"editingTabKey",2);u([h()],d.prototype,"chatLoading",2);u([h()],d.prototype,"chatSending",2);u([h()],d.prototype,"chatSendingSessionKey",2);u([h()],d.prototype,"chatMessage",2);u([h()],d.prototype,"chatDrafts",2);u([h()],d.prototype,"chatMessages",2);u([h()],d.prototype,"chatToolMessages",2);u([h()],d.prototype,"chatStream",2);u([h()],d.prototype,"chatStreamStartedAt",2);u([h()],d.prototype,"chatRunId",2);u([h()],d.prototype,"currentToolName",2);u([h()],d.prototype,"currentToolInfo",2);u([h()],d.prototype,"workingSessions",2);u([h()],d.prototype,"compactionStatus",2);u([h()],d.prototype,"chatAvatarUrl",2);u([h()],d.prototype,"chatThinkingLevel",2);u([h()],d.prototype,"chatQueue",2);u([h()],d.prototype,"chatAttachments",2);u([h()],d.prototype,"sidebarOpen",2);u([h()],d.prototype,"sidebarContent",2);u([h()],d.prototype,"sidebarError",2);u([h()],d.prototype,"sidebarMimeType",2);u([h()],d.prototype,"sidebarFilePath",2);u([h()],d.prototype,"sidebarTitle",2);u([h()],d.prototype,"sidebarMode",2);u([h()],d.prototype,"sidebarProofSlug",2);u([h()],d.prototype,"sidebarProofUrl",2);u([h()],d.prototype,"sidebarProofHtml",2);u([h()],d.prototype,"splitRatio",2);u([h()],d.prototype,"lightbox",2);u([h()],d.prototype,"driveAccounts",2);u([h()],d.prototype,"showDrivePicker",2);u([h()],d.prototype,"driveUploading",2);u([h()],d.prototype,"updateStatus",2);u([h()],d.prototype,"updateLoading",2);u([h()],d.prototype,"updateError",2);u([h()],d.prototype,"updateLastChecked",2);u([h()],d.prototype,"nodesLoading",2);u([h()],d.prototype,"nodes",2);u([h()],d.prototype,"devicesLoading",2);u([h()],d.prototype,"devicesError",2);u([h()],d.prototype,"devicesList",2);u([h()],d.prototype,"execApprovalsLoading",2);u([h()],d.prototype,"execApprovalsSaving",2);u([h()],d.prototype,"execApprovalsDirty",2);u([h()],d.prototype,"execApprovalsSnapshot",2);u([h()],d.prototype,"execApprovalsForm",2);u([h()],d.prototype,"execApprovalsSelectedAgent",2);u([h()],d.prototype,"execApprovalsTarget",2);u([h()],d.prototype,"execApprovalsTargetNodeId",2);u([h()],d.prototype,"execApprovalQueue",2);u([h()],d.prototype,"execApprovalBusy",2);u([h()],d.prototype,"execApprovalError",2);u([h()],d.prototype,"pendingGatewayUrl",2);u([h()],d.prototype,"gatewayRestartPending",2);u([h()],d.prototype,"gatewayRestartBusy",2);u([h()],d.prototype,"deployPanelOpen",2);u([h()],d.prototype,"configLoading",2);u([h()],d.prototype,"configRaw",2);u([h()],d.prototype,"configRawOriginal",2);u([h()],d.prototype,"configValid",2);u([h()],d.prototype,"configIssues",2);u([h()],d.prototype,"configSaving",2);u([h()],d.prototype,"configApplying",2);u([h()],d.prototype,"updateRunning",2);u([h()],d.prototype,"applySessionKey",2);u([h()],d.prototype,"configSnapshot",2);u([h()],d.prototype,"configSchema",2);u([h()],d.prototype,"configSchemaVersion",2);u([h()],d.prototype,"configSchemaLoading",2);u([h()],d.prototype,"configUiHints",2);u([h()],d.prototype,"configForm",2);u([h()],d.prototype,"configFormOriginal",2);u([h()],d.prototype,"configFormDirty",2);u([h()],d.prototype,"configFormMode",2);u([h()],d.prototype,"configSearchQuery",2);u([h()],d.prototype,"configActiveSection",2);u([h()],d.prototype,"configActiveSubsection",2);u([h()],d.prototype,"channelsLoading",2);u([h()],d.prototype,"channelsSnapshot",2);u([h()],d.prototype,"channelsError",2);u([h()],d.prototype,"channelsLastSuccess",2);u([h()],d.prototype,"whatsappLoginMessage",2);u([h()],d.prototype,"whatsappLoginQrDataUrl",2);u([h()],d.prototype,"whatsappLoginConnected",2);u([h()],d.prototype,"whatsappBusy",2);u([h()],d.prototype,"nostrProfileFormState",2);u([h()],d.prototype,"nostrProfileAccountId",2);u([h()],d.prototype,"presenceLoading",2);u([h()],d.prototype,"presenceEntries",2);u([h()],d.prototype,"presenceError",2);u([h()],d.prototype,"presenceStatus",2);u([h()],d.prototype,"agentsLoading",2);u([h()],d.prototype,"agentsList",2);u([h()],d.prototype,"agentsError",2);u([h()],d.prototype,"sessionsLoading",2);u([h()],d.prototype,"sessionsResult",2);u([h()],d.prototype,"sessionsError",2);u([h()],d.prototype,"sessionsFilterActive",2);u([h()],d.prototype,"sessionsFilterLimit",2);u([h()],d.prototype,"sessionsIncludeGlobal",2);u([h()],d.prototype,"sessionsIncludeUnknown",2);u([h()],d.prototype,"archivedSessions",2);u([h()],d.prototype,"archivedSessionsLoading",2);u([h()],d.prototype,"archivedSessionsExpanded",2);u([h()],d.prototype,"cronLoading",2);u([h()],d.prototype,"cronJobs",2);u([h()],d.prototype,"cronStatus",2);u([h()],d.prototype,"cronError",2);u([h()],d.prototype,"cronForm",2);u([h()],d.prototype,"cronRunsJobId",2);u([h()],d.prototype,"cronRuns",2);u([h()],d.prototype,"cronBusy",2);u([h()],d.prototype,"workspaceNeedsSetup",2);u([h()],d.prototype,"onboardingPhase",2);u([h()],d.prototype,"onboardingData",2);u([h()],d.prototype,"onboardingActive",2);u([h()],d.prototype,"wizardActive",2);u([h()],d.prototype,"wizardState",2);u([h()],d.prototype,"showSetupTab",2);u([h()],d.prototype,"setupBarDismissed",2);u([h()],d.prototype,"setupProgress",2);u([h()],d.prototype,"setupCapabilities",2);u([h()],d.prototype,"setupCapabilitiesLoading",2);u([h()],d.prototype,"setupQuickDone",2);u([h()],d.prototype,"onboardingIntegrations",2);u([h()],d.prototype,"onboardingCoreProgress",2);u([h()],d.prototype,"onboardingExpandedCard",2);u([h()],d.prototype,"onboardingLoadingGuide",2);u([h()],d.prototype,"onboardingActiveGuide",2);u([h()],d.prototype,"onboardingTestingId",2);u([h()],d.prototype,"onboardingTestResult",2);u([h()],d.prototype,"onboardingConfigValues",2);u([h()],d.prototype,"onboardingProgress",2);u([h()],d.prototype,"allyPanelOpen",2);u([h()],d.prototype,"allyMessages",2);u([h()],d.prototype,"allyStream",2);u([h()],d.prototype,"allyDraft",2);u([h()],d.prototype,"allyUnread",2);u([h()],d.prototype,"allySending",2);u([h()],d.prototype,"allyWorking",2);u([h()],d.prototype,"allyAttachments",2);u([h()],d.prototype,"chatPrivateMode",2);u([h()],d.prototype,"privateSessions",2);u([h()],d.prototype,"dynamicSlots",2);u([h()],d.prototype,"sessionResources",2);u([h()],d.prototype,"sessionResourcesCollapsed",2);u([h()],d.prototype,"skillsLoading",2);u([h()],d.prototype,"skillsReport",2);u([h()],d.prototype,"skillsError",2);u([h()],d.prototype,"skillsFilter",2);u([h()],d.prototype,"skillEdits",2);u([h()],d.prototype,"skillsBusyKey",2);u([h()],d.prototype,"skillMessages",2);u([h()],d.prototype,"skillsSubTab",2);u([h()],d.prototype,"godmodeSkills",2);u([h()],d.prototype,"godmodeSkillsLoading",2);u([h()],d.prototype,"expandedSkills",2);u([h()],d.prototype,"rosterData",2);u([h()],d.prototype,"rosterLoading",2);u([h()],d.prototype,"rosterError",2);u([h()],d.prototype,"rosterFilter",2);u([h()],d.prototype,"expandedAgents",2);u([h()],d.prototype,"debugLoading",2);u([h()],d.prototype,"debugStatus",2);u([h()],d.prototype,"debugHealth",2);u([h()],d.prototype,"debugModels",2);u([h()],d.prototype,"debugHeartbeat",2);u([h()],d.prototype,"debugCallMethod",2);u([h()],d.prototype,"debugCallParams",2);u([h()],d.prototype,"debugCallResult",2);u([h()],d.prototype,"debugCallError",2);u([h()],d.prototype,"logsLoading",2);u([h()],d.prototype,"logsError",2);u([h()],d.prototype,"logsFile",2);u([h()],d.prototype,"logsEntries",2);u([h()],d.prototype,"logsFilterText",2);u([h()],d.prototype,"logsLevelFilters",2);u([h()],d.prototype,"logsAutoFollow",2);u([h()],d.prototype,"logsTruncated",2);u([h()],d.prototype,"logsCursor",2);u([h()],d.prototype,"logsLastFetchAt",2);u([h()],d.prototype,"logsLimit",2);u([h()],d.prototype,"logsMaxBytes",2);u([h()],d.prototype,"logsAtBottom",2);u([h()],d.prototype,"toasts",2);u([h()],d.prototype,"chatUserNearBottom",2);u([h()],d.prototype,"chatNewMessagesBelow",2);u([h()],d.prototype,"consciousnessStatus",2);u([h()],d.prototype,"trustTrackerData",2);u([h()],d.prototype,"trustTrackerLoading",2);u([h()],d.prototype,"guardrailsData",2);u([h()],d.prototype,"guardrailsLoading",2);u([h()],d.prototype,"guardrailsShowAddForm",2);d=u([Yn("godmode-app")],d);export{V as a,Ud as b,Od as c,Kd as d,Nd as e,Fd as f,Wd as g,Ut as h,jd as i,qd as j,Hd as k,al as l,zd as m,Vd as n,$a as o,Md as p,Rd as r,Ed as s,Dd as t,Bd as u};
