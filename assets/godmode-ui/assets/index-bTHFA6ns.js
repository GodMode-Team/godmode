const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./work-tab-CVTt6d4A.js","./lit-core-CTInmNPB.js","./workspaces-rW-yCNy8.js","./ctrl-settings-CzLVBbt9.js","./views-settings-COCxblgi.js","./markdown-i_gIkIP3.js","./today-tab-Ba-06UM3.js","./second-brain-tab-B2ltWxUr.js","./second-brain-cP3vM8ym.js","./dashboards-tab-DBH51KPR.js","./dashboards-CrT3s0NG.js"])))=>i.map(i=>d[i]);
import{s as Ui,l as G,w as Wi,e as qi,g as vt,h as de,t as Vi,i as it,j as ji,k as zi,m as Hi,n as Gi,o as Qi,p as Yi,q as je,r as ze,u as F,_ as w,v as le,x as Et,y as He,z as Ji,A as z,B as Mt,C as rs,D as Xi,E as wt,F as ls,G as bt,H as cs,I as Zi,J as ds,K as ea,L as at,M as ta,N as na,O as sa,P as ia,Q as aa,R as oa,S as ra,T as la,U as ca,V as da,W as ua,X as ha,Y as pa,Z as fa,$ as ma,a0 as ga,a1 as ya,a2 as xe,a3 as pn,a4 as va,a5 as wa,a6 as ba,a7 as Sa,a8 as ka,a9 as Ta,aa as _a,ab as Aa}from"./ctrl-settings-CzLVBbt9.js";import{n as Ca,b as f,A as v,o as ve,c as Ge,i as Pa,a as Qe,d as us,t as hs,e as $a,f as xa,r as u}from"./lit-core-CTInmNPB.js";import{c as Ia,t as Ae,a as V,i as C,b as ps,n as fs,d as Ra,e as fn,p as ms,f as La,l as Da,r as Ea,T as Ma,P as Oa,s as Fa,g as Ka,h as Na,j as Ba,k as Ua,m as Wa,o as qa,q as Va,u as ja,v as za,w as Ha,x as Ga,y as Qa,z as Ya}from"./views-settings-COCxblgi.js";import"./markdown-i_gIkIP3.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const Ja=Ca(Symbol("app-context")),Ie=()=>{},Xa=()=>Promise.resolve(void 0);function Za(){return{connected:!1,reconnecting:!1,sessionKey:"main",assistantName:"Prosper",assistantAvatar:null,userName:"",userAvatar:null,theme:"system",themeResolved:"dark",settings:{gatewayUrl:"",token:"",sessionKey:"main",lastActiveSessionKey:"",theme:"system",chatFocusMode:!1,chatShowThinking:!1,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]},basePath:"",gateway:null,send:Xa,setTab:Ie,addToast:Ie,openSidebar:Ie,closeSidebar:Ie}}class eo{constructor(){this.listeners=new Map}on(t,n){this.listeners.has(t)||this.listeners.set(t,new Set);const s=this.listeners.get(t);return s.add(n),()=>{s.delete(n)}}emit(t,...n){const s=this.listeners.get(t);if(!s)return;const i=n[0];for(const a of s)try{a(i)}catch(r){console.error(`[event-bus] Error in handler for "${t}":`,r)}}clear(){this.listeners.clear()}}const St=new eo;async function to(e,t){await Ui(e,t),await G(e,!0)}async function no(e){await Wi(e),await G(e,!0)}async function so(e){await qi(e),await G(e,!0)}async function io(e){await vt(e),await de(e),await G(e,!0)}async function ao(e){await de(e),await G(e,!0)}function oo(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...i]=n.split(":");if(!s||i.length===0)continue;const a=s.trim(),r=i.join(":").trim();a&&r&&(t[a]=r)}return t}function gs(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function ys(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function ro(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=Ia(n??void 0)}function lo(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function co(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function uo(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function ho(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=gs(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(ys(n),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const a=i?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:a,success:null,fieldErrors:oo(i?.details)};return}if(!i.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await G(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function po(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=gs(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(ys(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const h=i?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:h,success:null};return}const a=i.merged??i.imported??null,r=a?{...t.values,...a}:t.values,c=!!(r.banner||r.website||r.nip05||r.lud16);e.nostrProfileFormState={...t,importing:!1,values:r,error:null,success:i.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:c},i.saved&&await G(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}function vs(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),i=n.slice(2).join(":");return!s||!i?null:{agentId:s,rest:i}}const fo=80;function B(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const n=()=>{const s=e.querySelector(".chat-thread");if(s){const i=getComputedStyle(s).overflowY;if(i==="auto"||i==="scroll"||s.scrollHeight-s.clientHeight>1)return s}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const s=n();if(!s)return;if(!(t||e.chatUserNearBottom)){e.chatNewMessagesBelow=!0;return}t&&(e.chatHasAutoScrolled=!0),e.chatIsAutoScrolling=!0,s.scrollTop=s.scrollHeight,e.chatNewMessagesBelow=!1,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1});const a=t?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const r=n();!r||!(t||e.chatUserNearBottom)||(e.chatIsAutoScrolling=!0,r.scrollTop=r.scrollHeight,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1}))},a)})})}function ws(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function mo(e,t){const n=t.currentTarget;if(!n||e.chatIsAutoScrolling)return;n.scrollHeight-n.scrollTop-n.clientHeight<fo?(e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1):e.chatUserNearBottom=!1}function go(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function Ye(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function yo(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),i=document.createElement("a"),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");i.href=s,i.download=`godmode-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(s)}function vo(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}const x="main";function wo(e){const t=[`viewing ${Ae(e.tab)} tab`];return e.tab==="dashboards"&&e.activeDashboard&&t.push(`dashboard: ${e.activeDashboard.title}`),e.tab==="workspaces"&&e.selectedWorkspace&&t.push(`workspace: ${e.selectedWorkspace.name}`),e.sidebarOpen&&e.sidebarFilePath&&t.push(`viewing file: ${e.sidebarFilePath}`),`[GodMode Context: ${t.join(", ")}]`}const mn=50,bo=80,So=12e4;function E(e,t){if(!e)return"";const n=e.trim().replace(/\n/g," ");return n.length<=t?n:n.slice(0,t-1)+"…"}function D(e){return typeof e=="string"?e:e==null?"":JSON.stringify(e)}function gn(e,t){if(!t||typeof t!="object")return"";const n=t;switch(e.toLowerCase()){case"exec":return n.command?`\`${E(D(n.command),60)}\``:"";case"read":return n.path||n.file_path?`\`${E(D(n.path||n.file_path),50)}\``:"";case"write":return n.path||n.file_path?`→ \`${E(D(n.path||n.file_path),50)}\``:"";case"edit":return n.path||n.file_path?`\`${E(D(n.path||n.file_path),50)}\``:"";case"web_search":return n.query?`"${E(D(n.query),45)}"`:"";case"web_fetch":try{const m=new URL(D(n.url));return m.hostname+(m.pathname!=="/"?m.pathname.slice(0,30):"")}catch{return E(D(n.url||""),50)}case"memory_search":return n.query?`"${E(D(n.query),45)}"`:"";case"browser":const s=D(n.action),i=n.ref?` #${D(n.ref)}`:"",a=n.targetUrl?` ${E(D(n.targetUrl),30)}`:"";return`${s}${i}${a}`;case"message":return n.action?`${D(n.action)}${n.target?` → ${E(D(n.target),25)}`:""}`:"";case"sessions_spawn":return n.task?`"${E(D(n.task),40)}"`:"";case"cron":return n.action?D(n.action):"";case"files_read":return n.fileId?`file:${E(D(n.fileId),20)}`:"";case"image":return n.image?E(D(n.image),40):"";default:const r=Object.keys(n).filter(m=>!["timeout","timeoutMs"].includes(m));if(r.length===0)return"";const c=r[0],h=n[c];return typeof h=="string"?`${c}: ${E(h,35)}`:""}}function yn(e,t){if(!t)return"";const n=e.toLowerCase(),s=t.split(`
`),i=s.length,a=t.length;if(["read","files_read"].includes(n))return`${a.toLocaleString()} chars${i>1?`, ${i} lines`:""}`;if(n==="exec")return i>1?`${i} lines`:E(s[0],50);if(["web_search","memory_search"].includes(n))try{const r=JSON.parse(t),c=r.results?.length??r.count??0;return`${c} result${c!==1?"s":""}`}catch{return E(t,40)}return n==="browser"?t.includes("snapshot")?"snapshot captured":t.includes("success")?"success":E(t,40):a>100?`${a.toLocaleString()} chars`:E(t,50)}function vn(e){if(!e)return!0;const t=e.toLowerCase();return!(t.includes("error:")||t.includes("failed")||t.includes("exception")||t.includes("not found"))}function ko(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(i=>{if(!i||typeof i!="object")return null;const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>!!i);return s.length===0?null:s.join(`
`)}function wn(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=ko(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=typeof e=="object"?"[object]":String(e)}const s=Vi(n,So);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function To(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function _o(e){if(e.toolStreamOrder.length<=mn)return;const t=e.toolStreamOrder.length-mn,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function Ao(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function kt(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),Ao(e)}function Co(e,t=!1){if(t){kt(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>kt(e),bo))}function Ot(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],e.currentToolName=null,e.currentToolInfo=null;const t=e;t.compactionStatus&&(t.compactionStatus=null),t.compactionClearTimer!=null&&(window.clearTimeout(t.compactionClearTimer),t.compactionClearTimer=null),kt(e)}const Po=5e3;function $o(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},Po))}function xo(e,t){if(!t)return;if(t.stream==="compaction"){$o(e,t);return}if(t.stream!=="tool")return;const n=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(n&&n!==e.sessionKey||!n&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const s=t.data??{},i=typeof s.toolCallId=="string"?s.toolCallId:"";if(!i)return;const a=typeof s.name=="string"?s.name:"tool",r=typeof s.phase=="string"?s.phase:"",c=r==="start"?s.args:void 0,h=r==="update"?wn(s.partialResult):r==="result"?wn(s.result):void 0,m=Date.now();let o=e.toolStreamById.get(i);o?(o.name=a,c!==void 0&&(o.args=c,o.displayArgs=gn(a,c)),h!==void 0&&(o.output=h,o.resultSummary=yn(a,h),o.success=vn(h)),o.updatedAt=m):(o={toolCallId:i,runId:t.runId,sessionKey:n,name:a,args:c,output:h,startedAt:typeof t.ts=="number"?t.ts:m,updatedAt:m,message:{},displayArgs:c?gn(a,c):void 0},e.toolStreamById.set(i,o),e.toolStreamOrder.push(i)),r==="start"?(e.currentToolName=a,e.currentToolInfo={name:a,details:o.displayArgs||void 0,startedAt:o.startedAt}):r==="result"&&(e.currentToolName=null,e.currentToolInfo=null,o.completedAt=m,o.resultSummary=yn(a,o.output),o.success=vn(o.output)),o.message=To(o),_o(e),Co(e,r==="result")}const Io=500;let ae="",oe="";function bs(e){const t=e.trim();if(!t)return"";if(t.length<Io)return V(t);const n=Lo(t);if(n<0)return V(t);const s=t.slice(0,n),i=t.slice(n);if(s===ae)return oe+V(i);if(s.startsWith(ae)&&ae.length>0){const a=s.slice(ae.length);return oe=oe+V(a),ae=s,oe+V(i)}return oe=V(s),ae=s,oe+V(i)}function Ro(){ae="",oe=""}function Lo(e){let t=!1,n="";const s=[];let i=0;for(;i<e.length;){const a=e.indexOf(`
`,i),r=a===-1?e.length:a,c=e.slice(i,r),h=c.trimStart(),m=h.match(/^(`{3,}|~{3,})/);if(m){const o=m[1];t?o.charAt(0)===n.charAt(0)&&o.length>=n.length&&h.slice(o.length).trim()===""&&(t=!1,n=""):(t=!0,n=o)}if(!t&&c.trim()===""){let o=r+1;for(;o<e.length&&e[o]===`
`;)o++;o<e.length&&(s.length===0||s[s.length-1]!==o)&&s.push(o)}i=a===-1?e.length:a+1}return s.length<2?-1:s[s.length-2]}const Do=1500,Eo=2e3,Ss="Copy as markdown",Mo="Copied",Oo="Copy failed";async function Fo(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function Re(e,t){e.title=t,e.setAttribute("aria-label",t)}function Ko(e){const t=e.label??Ss;return f`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(s?.querySelector(".chat-copy-btn__icon"),!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const i=await Fo(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!i){s.dataset.error="1",Re(s,Oo),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,Re(s,t))},Eo);return}s.dataset.copied="1",Re(s,Mo),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,Re(s,t))},Do)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${C.copy}</span>
        <span class="chat-copy-btn__icon-check">${C.check}</span>
      </span>
    </button>
  `}function No(e){return Ko({text:()=>e,label:Ss})}const bn="NO_REPLY",Bo=/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,Uo=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi,Wo=["internal system context injected by godmode","treat it as invisible background instructions only","persistence protocol (non-negotiable)","you must follow these operating instructions. do not echo or quote this block","meta goal: earn trust through competence. search before asking","asking the user for info you could look up is a failure mode"];function ot(e){let t=e.replace(Bo,"").replace(Uo,"").trim();const n=t.toLowerCase();for(const s of Wo){const i=n.indexOf(s);if(i!==-1){const a=i+s.length,r=t.slice(a),c=r.search(/\n\n(?=[A-Z])/);c!==-1?t=r.slice(c).trim():t="";break}}return t}const qo=/^\s*\{[^{}]*"type"\s*:\s*"error"[^{}]*"error"\s*:\s*\{/,Vo=/^\s*(\d{3})\s+\{/;function Ft(e){const t=e.trim(),n=t.match(Vo);if(n){const s=Number(n[1]);if(s===529||s===503)return"*Switching models — Claude is temporarily overloaded.*";if(s===400&&t.includes("Unsupported value"))return null}if(t.startsWith("Unsupported value:")||t.includes("is not supported with the")||!qo.test(t))return null;try{const s=JSON.parse(t);if(s?.type==="error"&&s?.error?.message)return(s.error.type??"")==="overloaded_error"?"*Switching models — Claude is temporarily overloaded.*":`*API error: ${s.error.message}*`}catch{}return null}const jo=/\{"type":"error","error":\{[^}]*"type":"[^"]*"[^}]*\}[^}]*"request_id":"[^"]*"\}/g,zo=/\d{3}\s+\{"type":"error"[^\n]*\}\n?(?:https?:\/\/[^\n]*\n?)?/g,Ho=/\{"type":"error","error":\{"details":[^}]*"type":"overloaded_error"[^}]*\}[^}]*"request_id":"[^"]*"\}\n?/g;function Go(e){return e.replace(zo,"").replace(jo,"").replace(Ho,"").trim()}const Qo=/^\[([^\]]+)\]\s*/,Yo=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],rt=new WeakMap,lt=new WeakMap;function Jo(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:Yo.some(t=>e.startsWith(`${t} `))}function Me(e){const t=e.match(Qo);if(!t)return e;const n=t[1]??"";return Jo(n)?e.slice(t[0].length):e}function ct(e){const t=e.trim();return t===bn||t.startsWith(`${bn}
`)}function we(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string"){const i=ot(s);if(!i)return null;const a=Ft(i);if(a)return a;const r=n==="assistant"?Go(i):i;if(n==="assistant"&&!r)return null;const c=n==="assistant"?it(r):Me(i);return ct(c)?null:c}if(Array.isArray(s)){const i=s.map(a=>{const r=a;return r.type==="text"&&typeof r.text=="string"?ot(r.text):null}).filter(a=>typeof a=="string"&&a.length>0);if(i.length>0){const a=i.join(`
`),r=n==="assistant"?it(a):Me(a);return ct(r)?null:r}}if(typeof t.text=="string"){const i=ot(t.text);if(!i)return null;const a=n==="assistant"?it(i):Me(i);return ct(a)?null:a}return null}function Kt(e){if(!e||typeof e!="object")return we(e);const t=e;if(rt.has(t))return rt.get(t)??null;const n=we(e);return rt.set(t,n),n}function Tt(e){const n=e.content,s=[];if(Array.isArray(n))for(const c of n){const h=c;if(h.type==="thinking"&&typeof h.thinking=="string"){const m=h.thinking.trim();m&&s.push(m)}}if(s.length>0)return s.join(`
`);const i=Nt(e);if(!i)return null;const r=[...i.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(c=>(c[1]??"").trim()).filter(Boolean);return r.length>0?r.join(`
`):null}function ks(e){if(!e||typeof e!="object")return Tt(e);const t=e;if(lt.has(t))return lt.get(t)??null;const n=Tt(e);return lt.set(t,n),n}function Nt(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(i=>{const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>typeof i=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function Ts(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}const Xo=Object.freeze(Object.defineProperty({__proto__:null,extractRawText:Nt,extractText:we,extractTextCached:Kt,extractThinking:Tt,extractThinkingCached:ks,formatApiError:Ft,formatReasoningMarkdown:Ts,stripEnvelope:Me},Symbol.toStringTag,{value:"Module"}));function Bt(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",i=t.content,a=Array.isArray(i)?i:null,r=Array.isArray(a)&&a.some(p=>{const g=p,y=(typeof g.type=="string"?g.type:"").toLowerCase();return y==="toolresult"||y==="tool_result"}),c=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||r||c)&&(n="toolResult");let h=[];typeof t.content=="string"?h=[{type:"text",text:t.content}]:Array.isArray(t.content)?h=t.content.map(p=>({type:p.type||"text",text:p.text,name:p.name,args:p.args||p.arguments})):typeof t.text=="string"&&(h=[{type:"text",text:t.text}]);const m=typeof t.timestamp=="number"?t.timestamp:Date.now(),o=typeof t.id=="string"?t.id:void 0;return{role:n,content:h,timestamp:m,id:o}}function Je(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function _s(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}const Sn={pdf:"📕",doc:"📘",docx:"📘",txt:"📄",rtf:"📄",xls:"📗",xlsx:"📗",csv:"📊",ppt:"📙",pptx:"📙",jpg:"🖼️",jpeg:"🖼️",png:"🖼️",gif:"🖼️",webp:"🖼️",svg:"🖼️",mp3:"🎵",wav:"🎵",m4a:"🎵",mp4:"🎬",mov:"🎬",avi:"🎬",zip:"📦",rar:"📦","7z":"📦",tar:"📦",gz:"📦",js:"📜",ts:"📜",py:"📜",json:"📜",html:"📜",css:"📜",md:"📜",default:"📎"};function As(e){const t=e.split(".").pop()?.toLowerCase()||"";return Sn[t]??Sn.default}function Cs(e,t){const n=t.split(".").pop()?.toLowerCase()||"";return{pdf:"PDF Document",doc:"Word Document",docx:"Word Document",xls:"Excel Spreadsheet",xlsx:"Excel Spreadsheet",csv:"CSV File",ppt:"PowerPoint",pptx:"PowerPoint",txt:"Text File",md:"Markdown",json:"JSON File",zip:"ZIP Archive",png:"PNG Image",jpg:"JPEG Image",jpeg:"JPEG Image",gif:"GIF Image",mp3:"Audio File",mp4:"Video File",html:"HTML Document",css:"Stylesheet",js:"JavaScript",ts:"TypeScript",py:"Python"}[n]||e.split("/")[1]?.toUpperCase()||"File"}const Zo={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},er={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},proof_editor:{icon:"fileText",title:"Proof Editor",actions:{create:{label:"create",detailKeys:["title"]},write:{label:"write",detailKeys:["slug"]},read:{label:"read",detailKeys:["slug"]},comment:{label:"comment",detailKeys:["slug"]},suggest:{label:"suggest",detailKeys:["slug"]},open:{label:"open",detailKeys:["slug"]},share:{label:"share",detailKeys:["slug"]},export_gdrive:{label:"drive",detailKeys:["slug"]},list:{label:"list"}}},queue_steer:{icon:"messageSquare",title:"Queue Steer",detailKeys:["itemId","instruction"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},tr={fallback:Zo,tools:er},Ps=tr,kn=Ps.fallback??{icon:"puzzle"},nr=Ps.tools??{};function sr(e){return(e??"tool").trim()}function ir(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function ar(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function $s(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const n=t.split(/\r?\n/)[0]?.trim()??"";return n?n.length>160?`${n.slice(0,157)}…`:n:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(s=>$s(s)).filter(s=>!!s);if(t.length===0)return;const n=t.slice(0,3).join(", ");return t.length>3?`${n}…`:n}}}function or(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function rr(e,t){for(const n of t){const s=or(e,n),i=$s(s);if(i)return i}}function lr(e){if(!e||typeof e!="object")return;const t=e,n=typeof t.path=="string"?t.path:void 0;if(!n)return;const s=typeof t.offset=="number"?t.offset:void 0,i=typeof t.limit=="number"?t.limit:void 0;return s!==void 0&&i!==void 0?`${n}:${s}-${s+i}`:n}function cr(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function dr(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function ur(e){const t=sr(e.name),n=t.toLowerCase(),s=nr[n],i=s?.icon??kn.icon??"puzzle",a=s?.title??ir(t),r=s?.label??t,c=e.args&&typeof e.args=="object"?e.args.action:void 0,h=typeof c=="string"?c.trim():void 0,m=dr(s,h),o=ar(m?.label??h);let p;n==="read"&&(p=lr(e.args)),!p&&(n==="write"||n==="edit"||n==="attach")&&(p=cr(e.args));const g=m?.detailKeys??s?.detailKeys??kn.detailKeys??[];return!p&&g.length>0&&(p=rr(e.args,g)),!p&&e.meta&&(p=e.meta),p&&(p=pr(p)),{name:t,icon:i,title:a,label:r,verb:o,detail:p}}function hr(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function pr(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const fr=80,mr=2,Tn=100,gr=3;function _n(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function yr(e){const t=e.split(`
`),n=t.slice(0,mr),s=n.join(`
`);return s.length>Tn?s.slice(0,Tn)+"…":n.length<t.length?s+"…":s}function vr(e){const t=e,n=kr(t.content),s=[];for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(a)||typeof i.name=="string"&&i.arguments!=null)&&s.push({kind:"call",name:i.name??"tool",args:Tr(i.arguments??i.args)})}for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();if(a!=="toolresult"&&a!=="tool_result")continue;const r=_r(i);if(Cn(r))continue;const c=typeof i.name=="string"?i.name:"tool";s.push({kind:"result",name:c,text:r})}if(_s(e)&&!s.some(i=>i.kind==="result")){const i=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",a=Kt(e)??void 0;Cn(a)||s.push({kind:"result",name:i,text:a})}return s}const wr=new Set(["write","read","edit","attach"]);function br(e){if(!e||typeof e!="object")return null;const t=e,n=t.path??t.file_path??t.filePath;return typeof n=="string"&&n.trim()?n.trim():null}function Sr(e){if(!e)return null;const t=e.match(/(?:\/(?:Users|home|tmp|var)\/\S+|~\/\S+)/);return t?t[0].replace(/[.,;:!?)'"]+$/,""):null}function An(e,t,n,s,i){const a=ur({name:e.name,args:e.args}),r=hr(a),c=!!e.text?.trim(),h=Ar(e.text);if(h?.type==="proof"&&h.slug)return f`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${C.fileText}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name">${h.title??"Proof Document"}</span>
          <span class="chat-artifact-card__type">Live doc</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${s?f`<button class="chat-artifact-card__btn" @click=${P=>{P.stopPropagation(),s(h.slug)}}>Open</button>`:v}
          ${h.filePath&&i?f`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${P=>{P.stopPropagation(),i(h.filePath)}}>Drive</button>`:v}
        </div>
      </div>
    `;const m=wr.has(e.name.toLowerCase())?br(e.args)??Sr(e.text):null;if(m&&e.kind==="result"){const P=m.split("/").pop()||m,M=P.split(".").pop()?.toLowerCase()||"",X=As(P),S=Cs(M,P);return f`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${X}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name" title=${m}>${P}</span>
          <span class="chat-artifact-card__type">${S}</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${n?f`<button class="chat-artifact-card__btn" @click=${T=>{T.stopPropagation(),n(m)}}>Open</button>`:t&&c?f`<button class="chat-artifact-card__btn" @click=${T=>{T.stopPropagation(),t(_n(e.text))}}>View</button>`:v}
          ${i?f`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${T=>{T.stopPropagation(),i(m)}}>Drive</button>`:v}
        </div>
      </div>
    `}const o=!!t||!!(n&&m),p=o?P=>{if(P.stopPropagation(),n&&m){n(m);return}if(t&&c){t(_n(e.text));return}if(t){const M=`## ${a.label}

${r?`**Command:** \`${r}\`

`:""}*No output — tool completed successfully.*`;t(M)}}:void 0,g=e.text?e.text.split(`
`).length:0,y=c&&(e.text?.length??0)<=fr,b=c&&!y&&g>gr,A=c&&!b,R=!c,U=e.kind==="call"?"chat-tool-card--call":"chat-tool-card--result";return f`
    <div
      class="chat-tool-card ${U} ${o?"chat-tool-card--clickable":""}"
      @click=${p}
      role=${o?"button":v}
      tabindex=${o?"0":v}
      @keydown=${o?P=>{P.key!=="Enter"&&P.key!==" "||(P.preventDefault(),P.stopPropagation(),p?.(P))}:v}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${C[a.icon]}</span>
          <span>${a.label}</span>
        </div>
        ${o?f`<span class="chat-tool-card__action">${c?"View":""} ${C.check}</span>`:v}
        ${R&&!o?f`<span class="chat-tool-card__status">${C.check}</span>`:v}
      </div>
      ${r?f`<div class="chat-tool-card__detail">${r}</div>`:v}
      ${R?f`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:v}
      ${b?f`<details class="chat-tool-card__expandable" @click=${P=>P.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${yr(e.text)}</summary>
            <div class="chat-tool-card__full-output mono">${e.text}</div>
          </details>`:v}
      ${A?f`<div class="chat-tool-card__inline mono">${e.text}</div>`:v}
    </div>
  `}function kr(e){return Array.isArray(e)?e.filter(Boolean):[]}function Tr(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function _r(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function Ar(e){if(!e)return null;try{const t=JSON.parse(e);return t._sidebarAction?{type:t._sidebarAction.type,slug:t._sidebarAction.slug,title:t.title,filePath:t.filePath}:null}catch{return null}}function Cn(e){if(!e)return!1;const t=e.toLowerCase();return t.includes("process exited")?!1:t.includes("(no new output)")&&t.includes("still running")}function Cr(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const i=s.getAttribute("href");if(i){if(i.startsWith("file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(7);a.startsWith("/~/")&&(a="~"+a.slice(2));try{a=decodeURIComponent(a)}catch{}t(a);return}if(i.startsWith("godmode-file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(15);try{a=decodeURIComponent(a)}catch{}t(a);return}}}const Pn={exec:["Executing","Running","Conjuring","Manifesting","Brewing"],read:["Reading","Perusing","Absorbing","Scanning","Devouring"],write:["Writing","Scribbling","Crafting","Inscribing","Authoring"],edit:["Editing","Refining","Polishing","Tweaking","Sculpting"],browser:["Browsing","Surfing","Exploring","Navigating","Spelunking"],web_search:["Searching","Hunting","Investigating","Sleuthing","Scouring"],web_fetch:["Fetching","Grabbing","Retrieving","Summoning","Acquiring"],memory_search:["Remembering","Recalling","Pondering","Reflecting"],image:["Analyzing","Examining","Scrutinizing","Inspecting","Beholding"],default:["Working on","Processing","Handling","Tinkering with","Wrangling"]};function xs(e){const t=e.toLowerCase().replace(/[^a-z_]/g,""),n=Pn[t]??Pn.default,s=Math.floor(Date.now()/2e3)%n.length;return n[s]}function Pr(e){const t=e.match(/\[Files uploaded:\s*([^\]]+)\]/);if(!t)return null;const n=t[1],s=[],i=/([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;let a;for(;(a=i.exec(n))!==null;)s.push({fileName:a[1].trim(),fileId:a[2].trim(),size:a[3].trim(),mimeType:a[4].trim()});return s.length>0?s:null}function $r(e){return f`
    <div class="chat-file-uploads">
      ${e.map(t=>f`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${As(t.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${t.fileName}">${t.fileName}</span>
            <span class="chat-file-upload-card__meta">${t.size} • ${Cs(t.mimeType,t.fileName)}</span>
          </div>
        </div>
      `)}
    </div>
  `}function xr(e){return e.replace(/\[Files uploaded:[^\]]+\]\s*/g,"").trim()}const $n=/<document>\s*<source>([^<]*)<\/source>\s*<mime_type>([^<]*)<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function Ir(e){const t=[];let n;for(;(n=$n.exec(e))!==null;){const s=n[1]?.trim()||"file",i=n[2]?.trim()||"application/octet-stream";t.push({fileName:s,fileId:"",size:"",mimeType:i})}return $n.lastIndex=0,t.length>0?t:null}const Rr=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function Lr(e){return e.replace(Rr,"").trim()}function Dr(e){if(!e)return e;if(e.startsWith("System:")||e.startsWith("GatewayRestart:")||e.startsWith("Sender (untrusted metadata)")){const a=e.indexOf(`

`);return a!==-1?e.slice(a+2).trim():""}let i=e.split(`
`).filter(a=>{const r=a.trim();return!r.startsWith("System:")&&!r.startsWith("GatewayRestart:")}).join(`
`);for(;i.startsWith(`
`);)i=i.slice(1);return i.trim()}function Er(e){return typeof e!="number"||!Number.isFinite(e)||e<=0?null:e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${Math.round(e/1024)} KB`:`${Math.round(e)} B`}function _t(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const r=a;if(r.type==="image"){const c=r.source;if(c?.type==="base64"&&typeof c.data=="string"){const h=c.data,m=c.media_type||"image/png",o=h.startsWith("data:")?h:`data:${m};base64,${h}`;s.push({url:o})}else if(typeof r.data=="string"&&typeof r.mimeType=="string"){const h=r.data.startsWith("data:")?r.data:`data:${r.mimeType};base64,${r.data}`;s.push({url:h})}else typeof r.url=="string"?s.push({url:r.url}):r.omitted===!0&&s.push({omitted:!0,bytes:typeof r.bytes=="number"?r.bytes:void 0,mimeType:typeof r.mimeType=="string"?r.mimeType:void 0,alt:typeof r.fileName=="string"?r.fileName:void 0})}else if(r.type==="image_url"){const c=r.image_url;typeof c?.url=="string"&&s.push({url:c.url})}else r.type==="attachment"&&typeof r.content=="string"&&(r.mimeType||"").startsWith("image/")&&s.push({url:r.content,alt:r.fileName||void 0});if(r.type==="text"&&typeof r.text=="string"){const c=/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,h=r.text.match(c);if(h)for(const m of h)s.push({url:m})}if(Array.isArray(r.content))for(const c of r.content){if(typeof c!="object"||c===null)continue;const h=c;if(h.type==="image"){const m=h.source;if(m?.type==="base64"&&typeof m.data=="string"){const o=m.media_type||"image/png",p=m.data.startsWith("data:")?m.data:`data:${o};base64,${m.data}`;s.push({url:p})}else if(typeof h.data=="string"&&typeof h.mimeType=="string"){const o=h.data.startsWith("data:")?h.data:`data:${h.mimeType};base64,${h.data}`;s.push({url:o})}else h.omitted===!0&&s.push({omitted:!0,bytes:typeof h.bytes=="number"?h.bytes:void 0,mimeType:typeof h.mimeType=="string"?h.mimeType:void 0,alt:typeof h.fileName=="string"?h.fileName:void 0})}}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const r=a;if(r.type==="image"&&typeof r.content=="string"){const c=r.mimeType||"image/png",h=r.content.startsWith("data:")?r.content:`data:${c};base64,${r.content}`;s.push({url:h,alt:r.fileName||void 0})}else r.type==="image"&&r.omitted===!0&&s.push({omitted:!0,bytes:typeof r.bytes=="number"?r.bytes:void 0,mimeType:typeof r.mimeType=="string"?r.mimeType:void 0,alt:typeof r.fileName=="string"?r.fileName:void 0})}return s}function Mr(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const r=a;if(r.type==="attachment"&&typeof r.content=="string"){const c=r.mimeType||"application/octet-stream";c.startsWith("image/")||s.push({fileName:r.fileName||"file",mimeType:c,content:r.content})}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const r=a;r.type==="file"&&typeof r.content=="string"&&s.push({fileName:r.fileName||"file",mimeType:r.mimeType||"application/octet-stream",content:r.content})}return s}function Or(e,t){return f`
    <div class="chat-group assistant">
      ${Ut("assistant",{assistantName:e?.name,assistantAvatar:e?.avatar})}
      <div class="chat-group-messages">
        ${t?f`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${xs(t.name)}</span>
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
  `}function Fr(e,t,n,s,i){const a=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),r=s?.name??"Assistant";return f`
    <div class="chat-group assistant">
      ${Ut("assistant",{assistantName:s?.name,assistantAvatar:s?.avatar})}
      <div class="chat-group-messages">
        ${i?f`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${xs(i.name)}</span>
                    <strong>${i.name}</strong>
                  </span>
                </div>
                ${i.details?f`<span class="chat-working-indicator__details">${i.details}</span>`:v}
              </div>
            `:v}
        ${Is({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${r}</span>
          <span class="chat-group-timestamp">${a}</span>
        </div>
      </div>
    </div>
  `}function Kr(e,t){const n=Je(e.role),s=t.assistantName??"Assistant",i=t.userName??"You",a=n==="user"?i:n==="assistant"?s:n,r=n==="user"?"user":n==="assistant"?"assistant":"other",c=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return f`
    <div class="chat-group ${r}">
      ${Ut(e.role,{assistantName:s,assistantAvatar:t.assistantAvatar??null,userName:i,userAvatar:t.userAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((h,m)=>Is(h.message,{isStreaming:e.isStreaming&&m===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar,t.onOpenFile,t.onOpenProof,t.onImageClick,t.resolveImageUrl,t.onPushToDrive))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${a}</span>
          <span class="chat-group-timestamp">${c}</span>
        </div>
      </div>
    </div>
  `}function Ut(e,t){const n=Je(e),s=t?.assistantName?.trim()||"Assistant",i=typeof t?.assistantAvatar=="string"?t.assistantAvatar.trim():"",a=t?.userName?.trim()||"You",r=typeof t?.userAvatar=="string"?t.userAvatar.trim():"",c=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return n==="user"?r&&xn(r)?f`<img
        class="chat-avatar ${c}"
        src="${r}"
        alt="${a}"
      />`:r?f`<div class="chat-avatar ${c}">${r}</div>`:f`<div class="chat-avatar ${c}">${a.charAt(0).toUpperCase()||"C"}</div>`:n==="assistant"?i&&xn(i)?f`<img
        class="chat-avatar ${c}"
        src="${i}"
        alt="${s}"
      />`:i?f`<div class="chat-avatar ${c}" style="color: var(--accent);">${i}</div>`:f`<div class="chat-avatar ${c}" style="color: var(--accent);">⚛️</div>`:n==="tool"?f`<div class="chat-avatar ${c}">⚙</div>`:f`<div class="chat-avatar ${c}">?</div>`}function xn(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function In(e,t,n){if(e.length===0)return v;const s=e.map((a,r)=>{if((a.omitted||!a.url)&&n){const c=n(r);if(c)return{...a,resolvedUrl:c}}return a}),i=s.filter(a=>(a.resolvedUrl||a.url)&&!a.omitted||a.resolvedUrl).map(a=>({url:a.resolvedUrl||a.url,alt:a.alt}));return f`
    <div class="chat-message-images">
      ${s.map(a=>{const r=a.resolvedUrl||a.url;if(!r){const h=Er(a.bytes),o=[a.mimeType?a.mimeType.replace("image/","").toUpperCase():null,h].filter(Boolean).join(" · ");return f`
            <div
              class="chat-message-image chat-message-image--omitted"
              title=${a.alt??"Sent image"}
              aria-label="Sent image"
            >
              <span class="chat-message-image__omitted-icon">🖼</span>
              <span class="chat-message-image__omitted-label">${o||"Image"}</span>
            </div>
          `}const c=i.findIndex(h=>h.url===r);return f`
          <img
            src=${r}
            alt=${a.alt??"Attached image"}
            class="chat-message-image"
            @error=${h=>{const m=h.target;m.style.display="none"}}
            @click=${()=>{t&&t(r,i,Math.max(0,c))}}
          />
        `})}
    </div>
  `}function Nr(e){return e.length===0?v:f`
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
  `}function Is(e,t,n,s,i,a,r,c){try{return Br(e,t,n,s,i,a,r,c)}catch(h){return console.error("[chat] message render error:",h),f`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `}}function Br(e,t,n,s,i,a,r,c){const h=e,m=typeof h.role=="string"?h.role:"unknown",o=_s(e)||m.toLowerCase()==="toolresult"||m.toLowerCase()==="tool_result"||typeof h.toolCallId=="string"||typeof h.tool_call_id=="string",p=vr(e),g=p.length>0,y=_t(e),b=y.length>0,A=typeof h._chatIdx=="number"?h._chatIdx:-1,R=r&&A>=0?O=>r(A,O):void 0,U=Mr(e),P=U.length>0,M=Kt(e),X=t.showReasoning&&m==="assistant"?ks(e):null,S=m==="user"&&M?Pr(M):null,T=m==="user"?Nt(e):null,_=T?Ir(T):null,$=[...S??[],..._??[]],k=$.length>0;let I=M;if(m==="user"&&I&&(I=Dr(I),I=Lr(I)),I&&(I=I.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim()||null),I){const O=Ft(I);O&&(I=O)}k&&I&&(I=xr(I));const ie=I?.trim()?I:null,L=X?Ts(X):null,fe=ie,hn=m==="assistant"&&!!fe?.trim(),Ki=["chat-bubble",hn?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");if(g&&o)return f`
      ${b?In(y,a,R):v}
      ${p.map(O=>An(O,n,s,i,c))}
    `;if(!fe&&!g&&!b&&!P&&!k&&!L){const O=typeof h.errorMessage=="string"?h.errorMessage:null;if(h.stopReason==="error"&&O){let W=O;const me=O.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(me){const Ni=parseInt(me[1]).toLocaleString(),Bi=parseInt(me[2]).toLocaleString();W=`Context overflow: ${Ni} tokens exceeded the ${Bi} token limit. The conversation needs to be compacted.`}else O.includes("prompt is too long")&&(W="Context overflow: The conversation is too long for the model.");return f`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${W}</div>
        </div>
      `}if(m==="user"&&M?.trim()){let W=M.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim();if(W.startsWith("System:")||W.startsWith("GatewayRestart:")||W.startsWith("Sender (untrusted metadata)")){const me=W.indexOf(`

`);W=me!==-1?W.slice(me+2).trim():""}if(W)return f`
          <div class="chat-bubble fade-in">
            <div class="chat-text">${W}</div>
          </div>
        `}return v}return f`
    <div class="${Ki}">
      ${hn?No(fe):v}
      ${k?$r($):v}
      ${In(y,a,R)}
      ${Nr(U)}
      ${L?f`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${ve(V(L))}</div>
            </details>`:v}
      ${fe?f`<div class="chat-text" @click=${O=>Cr(O,s)}>${ve(t.isStreaming?bs(fe):V(fe))}</div>`:v}
      ${p.map(O=>An(O,n,s,i,c))}
    </div>
  `}function Ur(e){const t=e,n=typeof t.content=="string"?t.content:"",s=typeof t.keptMessages=="number"?t.keptMessages:null,i=typeof t.timestamp=="number"?new Date(t.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"";return f`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${s!==null?f`<span class="chat-compaction-summary__kept">${s} messages kept</span>`:v}
      </div>
      <div class="chat-compaction-summary__content">
        ${ve(V(n))}
      </div>
      ${i?f`<div class="chat-compaction-summary__timestamp">${i}</div>`:v}
    </div>
  `}function Wr(e){return e.isCompactionSummary===!0}const Rs=50,Ls=200,qr="Assistant";function Ne(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function At(e){const t=Ne(e?.name,Rs)??qr,n=Ne(e?.avatar??void 0,Ls)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}function Vr(){return At(typeof window>"u"?{}:{name:window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__CLAWDBOT_ASSISTANT_AVATAR__})}const jr="You";function Rn(e){const t=Ne(e?.name,Rs)??jr,n=Ne(e?.avatar??void 0,Ls)??null;return{name:t,avatar:n}}function zr(){return Rn(typeof window>"u"?{}:{name:window.__CLAWDBOT_USER_NAME__,avatar:window.__CLAWDBOT_USER_AVATAR__})}async function Ds(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const i=await e.client.request("agent.identity.get",s);if(!i)return;const a=At(i);e.assistantName=a.name,e.assistantAvatar=a.avatar,e.assistantAgentId=a.agentId??null}catch{}}let Ln=!1;function Dn(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function Hr(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function Gr(){Ln||(Ln=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function Xe(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),Dn(t)}return Gr(),Dn(Hr())}let re=null,Oe=null;function Es(){return Oe}const Ms=new Map,se=new Map;function Ct(e,t){const n=t.filter(s=>s?.role==="user").length;Ms.set(e,n)}async function Os(e,t){try{const n=await e.request("chat.history",{sessionKey:t,limit:200}),s=Array.isArray(n.messages)?n.messages:[];return se.set(t,s),Ct(t,s),s}catch{return se.get(t)??[]}}let ge=0;async function K(e){if(!e.client||!e.connected)return;const t=e.sessionKey,n=++ge;e.chatLoading=!0,e.lastError=null;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==ge||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,Ct(t,e.chatMessages),se.set(t,e.chatMessages)}catch{if(n!==ge||e.sessionKey!==t)return;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==ge||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,Ct(t,e.chatMessages),se.set(t,e.chatMessages)}catch(s){if(n!==ge||e.sessionKey!==t)return;e.lastError=String(s)}}finally{n===ge&&(e.chatLoading=!1)}}async function Fs(e,t){const n=[...e.chatMessages],s=n.length;await K(e),e.chatStream=null,!t?.allowShrink&&s>0&&(e.chatMessages.length<s||Qr(n,e.chatMessages))&&(e.chatMessages=n,setTimeout(()=>{K(e).then(()=>{e.chatStream=null})},2e3))}function Qr(e,t){const n=Yr(e,a=>a?.role==="user");if(n===-1)return!1;const i=e[n].timestamp;return typeof i!="number"?!1:!t.some(a=>a?.role==="user"&&a?.timestamp===i)}function Yr(e,t){for(let n=e.length-1;n>=0;n--)if(t(e[n]))return n;return-1}function Jr(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}async function Wt(e,t,n,s){if(!e.client||!e.connected)return!1;let i=t.trim();const a=n&&n.length>0;if(!i&&!a)return!1;!i&&a&&(i="[attached]");const r=Date.now();if(!s?.skipOptimisticUpdate){const m=[];if(i&&m.push({type:"text",text:i}),a)for(const o of n)o.mimeType.startsWith("image/")?m.push({type:"image",source:{type:"base64",media_type:o.mimeType,data:o.dataUrl}}):m.push({type:"attachment",mimeType:o.mimeType,fileName:o.fileName,content:o.dataUrl});e.chatMessages=[...e.chatMessages,{role:"user",content:m,timestamp:r}]}e.chatSending=!0,e.chatSendingSessionKey=e.sessionKey,e.lastError=null;const c=Xe();e.chatRunId=c,e.chatStream="",e.chatStreamStartedAt=r,re={message:i,attachments:a?n:void 0};let h;if(a){const m=[],o=[];for(const p of n){const g=Jr(p.dataUrl);if(g)if(g.mimeType.startsWith("image/"))m.push({type:"image",mimeType:g.mimeType,content:g.content,fileName:p.fileName});else{const y=p.fileName||"file";o.push(`<document>
<source>${y}</source>
<mime_type>${g.mimeType}</mime_type>
<content encoding="base64">
${g.content}
</content>
</document>`)}}if(m.length>0&&(h=m),o.length>0&&(i=`${o.join(`

`)}

${i}`),m.length>0){const p=e.chatMessages.length-1,g=e.sessionKey,y=e.client.request("images.cache",{images:m.map(b=>({data:b.content,mimeType:b.mimeType,fileName:b.fileName})),sessionKey:g}).then(b=>{if(b?.cached&&b.cached.length>0){const A=b.cached.map((R,U)=>({messageIndex:p,imageIndex:U,hash:R.hash,mimeType:R.mimeType,bytes:R.bytes,role:"user",timestamp:r}));return e.client.request("images.updateIndex",{sessionKey:g,images:A}).catch(()=>{})}}).catch(()=>{});Oe=y,y.finally(()=>{Oe===y&&(Oe=null)})}}try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:i,deliver:!1,idempotencyKey:c,attachments:h}),!0}catch(m){const o=String(m);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=o,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+o}],timestamp:Date.now()}],!1}finally{e.chatSending=!1,e.chatSendingSessionKey=null}}async function Ks(e){const t=e.pendingRetry;return t?(e.pendingRetry=null,Wt(e,t.message,t.attachments,{skipOptimisticUpdate:!0})):!1}function Xr(e){e.pendingRetry=null}async function qt(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function Ns(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?e.chatStream!==null?null:"final":null;if(t.state!=="delta"&&Ro(),t.state==="delta"){const n=we(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final")e.chatRunId=null,e.chatStreamStartedAt=null,re=null;else if(t.state==="aborted")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,re=null;else if(t.state==="error"){e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;const n=t.errorMessage??"chat error";e.lastError=n;const s=n.includes("prompt is too long")||n.includes("tokens >");s&&re&&(e.pendingRetry={message:re.message,attachments:re.attachments,timestamp:Date.now()}),re=null;let i=n;if(s){const a=n.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(a){const r=parseInt(a[1]).toLocaleString(),c=parseInt(a[2]).toLocaleString();i=`⚠️ Context overflow: ${r} tokens exceeds ${c} limit. Compact the conversation, then click "Retry" to resend your message.`}else i='⚠️ Context overflow: The conversation is too long. Compact and click "Retry" to resend.'}e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:i}],timestamp:Date.now(),isError:!0}]}return t.state}const Q=Object.freeze(Object.defineProperty({__proto__:null,abortChatRun:qt,clearPendingRetry:Xr,getPendingImageCache:Es,handleChatEvent:Ns,laneMessageCache:se,loadChatHistory:K,loadChatHistoryAfterFinal:Fs,loadLaneHistory:Os,retryPendingMessage:Ks,sendChatMessage:Wt,sessionTurnCounts:Ms},Symbol.toStringTag,{value:"Module"}));function Pt(e){return typeof e=="object"&&e!==null}function Zr(e){if(!Pt(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!Pt(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const i=typeof e.createdAtMs=="number"?e.createdAtMs:0,a=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!i||!a?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:i,expiresAtMs:a}}function el(e){if(!Pt(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function Bs(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function tl(e,t){const n=Bs(e).filter(s=>s.id!==t.id);return n.push(t),n}function En(e,t){return Bs(e).filter(n=>n.id!==t)}const nl=1800*1e3;function Us(e){return{openclawVersion:e.openclaw.version,openclawLatest:e.openclaw.latest,openclawUpdateAvailable:e.openclaw.updateAvailable,openclawInstallKind:e.openclaw.installKind,openclawChannel:e.openclaw.channel,pluginVersion:e.plugin.version,pluginLatest:e.plugin.latest,pluginUpdateAvailable:e.plugin.updateAvailable,pendingDeploy:e.pendingDeploy??null,fetchOk:e.fetchOk}}function Ws(e){const t=typeof e.behind=="number"?e.behind:null;return{openclawVersion:String(e.version??"unknown"),openclawLatest:null,openclawUpdateAvailable:(t??0)>0,openclawInstallKind:"unknown",openclawChannel:null,pluginVersion:"unknown",pluginLatest:null,pluginUpdateAvailable:!1,pendingDeploy:null,fetchOk:e.fetchOk}}async function sl(e){if(!(!e.client||!e.connected)){e.updateLoading=!0,e.updateError=null;try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Us(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});t.error&&(e.updateError=String(t.error)),e.updateStatus=Ws(t),e.updateLastChecked=Date.now()}catch(t){e.updateError=String(t)}}finally{e.updateLoading=!1}}}async function Mn(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Us(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});e.updateStatus=Ws(t),e.updateLastChecked=Date.now()}catch{}}}function il(e){e.updatePollInterval==null&&(Mn(e),e.updatePollInterval=window.setInterval(()=>{Mn(e)},nl))}function al(e){const t=e;t.updatePollInterval!=null&&(clearInterval(t.updatePollInterval),t.updatePollInterval=null)}async function ol(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.postStatus",{});if(!t)return;const n=t.overallStatus,s=t.summary;if(!s)return;const i=n==="healthy"?"success":n==="degraded"?"error":"warning";typeof e.showToast=="function"&&e.showToast(s,i),sl(e)}catch{}}const qs={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},On=qs,$t={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(qs));new Set(Object.values($t));function rl(e){const t=e.version??(e.nonce?"v2":"v1"),n=e.scopes.join(","),s=e.token??"",i=[t,e.deviceId,e.clientId,e.clientMode,e.role,n,String(e.signedAtMs),s];return t==="v2"&&i.push(e.nonce??""),i.join("|")}const ll=4008;class cl{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.read","operator.write","operator.approvals","operator.pairing"],s="operator";let i=null,a=!1,r=this.opts.token;if(t){i=await ji();const o=zi({deviceId:i.deviceId,role:s})?.token;r=o??this.opts.token,a=!!(o&&this.opts.token)}const c=r||this.opts.password?{token:r,password:this.opts.password}:void 0;let h;if(t&&i){const o=Date.now(),p=this.connectNonce??void 0,g=rl({deviceId:i.deviceId,clientId:this.opts.clientName??On.CONTROL_UI,clientMode:this.opts.mode??$t.WEBCHAT,role:s,scopes:n,signedAtMs:o,token:r??null,nonce:p}),y=await Hi(i.privateKey,g);h={id:i.deviceId,publicKey:i.publicKey,signature:y,signedAt:o,nonce:p}}const m={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??On.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??$t.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:h,caps:[],auth:c,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",m).then(o=>{o?.auth?.deviceToken&&i&&Gi({deviceId:i.deviceId,role:o.auth.role??s,token:o.auth.deviceToken,scopes:o.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(o)}).catch(()=>{a&&i&&Qi({deviceId:i.deviceId,role:s}),this.ws?.close(ll,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const i=n;if(i.event==="connect.challenge"){const r=i.payload,c=r&&typeof r.nonce=="string"?r.nonce:null;c&&(this.connectNonce=c,this.sendConnect());return}const a=typeof i.seq=="number"?i.seq:null;a!==null&&(this.lastSeq!==null&&a>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:a}),this.lastSeq=a);try{this.opts.onEvent?.(i)}catch(r){console.error("[gateway] event handler error:",r)}return}if(s.type==="res"){const i=n,a=this.pending.get(i.id);if(!a)return;this.pending.delete(i.id),i.ok?a.resolve(i.payload):a.reject(new Error(i.error?.message??"request failed"));return}}request(t,n){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const s=Xe(),i={type:"req",id:s,method:t,params:n},a=new Promise((r,c)=>{this.pending.set(s,{resolve:h=>r(h),reject:c})});return this.ws.send(JSON.stringify(i)),a}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}const Vs={displayName:"label",sessionKey:"conversationId"},js={};for(const[e,t]of Object.entries(Vs))js[t]=e;const dl={"sessions.autoTitle":["sessions.patch"],"sessions.rename":["sessions.patch"]},ue=new Map;function ul(){try{const e=sessionStorage.getItem("godmode:healing-cache");if(e){const t=JSON.parse(e);for(const[n,s]of Object.entries(t))ue.set(n,s)}}catch{}}function Fn(){try{const e={};for(const[t,n]of ue)e[t]=n;sessionStorage.setItem("godmode:healing-cache",JSON.stringify(e))}catch{}}ul();function hl(e,t){const n=ue.get(e);if(!n)return{method:e,params:t};const s=n.resolvedMethod;if(t&&typeof t=="object"&&!Array.isArray(t)&&Object.keys(n.fieldRenames).length>0){const i={...t};for(const[a,r]of Object.entries(n.fieldRenames))a in i&&!(r in i)&&(i[r]=i[a],delete i[a]);return{method:s,params:i}}return{method:s,params:t}}function pl(e,t,n){const s=n.toLowerCase(),i=n.match(/unexpected property[:\s]*['"]?(\w+)['"]?/i);if(i){const a=i[1],r=Vs[a];if(r&&t&&typeof t=="object"){const c={...t};if(a in c)return c[r]=c[a],delete c[a],console.log(`[safe-request] Self-heal: ${e} — rewrote "${a}" → "${r}"`),{method:e,params:c,renames:{[a]:r}}}}if(s.includes("unknown method")||s.includes("method not found")){const a=dl[e];if(a&&a.length>0){const r=a[0];return console.log(`[safe-request] Self-heal: ${e} not found — falling back to ${r}`),{method:r,params:t,renames:{}}}}if((s.includes("unexpected property")||s.includes("unknown field"))&&t&&typeof t=="object"){const a={...t};let r=!1;const c={};for(const[h,m]of Object.entries(js))h in a&&(a[m]=a[h],delete a[h],c[h]=m,r=!0,console.log(`[safe-request] Self-heal: ${e} — reverse alias "${h}" → "${m}"`));if(r)return{method:e,params:a,renames:c}}return null}async function Be(e,t,n,s){const i=s?.timeout??3e4;let{method:a,params:r}=s?.raw?{method:t,params:n}:hl(t,n);const c=async(h,m)=>Promise.race([e.request(h,m),new Promise((o,p)=>setTimeout(()=>p(new Error(`Request timeout (${i}ms): ${h}`)),i))]);try{return{ok:!0,data:await c(a,r),method:a,healed:a!==t}}catch(h){const m=String(h instanceof Error?h.message:h);if(s?.raw)return{ok:!1,error:m,method:t};const o=pl(a,r,m);if(o)try{const p=await c(o.method,o.params);return ue.set(t,{resolvedMethod:o.method,fieldRenames:o.renames,ts:Date.now()}),Fn(),{ok:!0,data:p,method:o.method,healed:!0}}catch(p){return{ok:!1,error:String(p instanceof Error?p.message:p),method:o.method,healed:!0}}if(s?.fallbacks)for(const p of s.fallbacks)try{const g=await c(p,r);return ue.set(t,{resolvedMethod:p,fieldRenames:{},ts:Date.now()}),Fn(),{ok:!0,data:g,method:p,healed:!0}}catch{continue}return{ok:!1,error:m,method:a}}}function zs(){ue.clear();try{sessionStorage.removeItem("godmode:healing-cache")}catch{}}function fl(){const e={};for(const[t,n]of ue)e[t]=n;return e}const zu=Object.freeze(Object.defineProperty({__proto__:null,clearHealingCache:zs,getHealingEntries:fl,safeRequest:Be},Symbol.toStringTag,{value:"Module"}));let N=null;function Hs(e,t){zs();const n=String(e.version??e.serverVersion??e.gatewayVersion??"unknown"),s=typeof e.protocol=="number"?e.protocol:void 0;N={hostVersion:n,protocolVersion:s,methods:{},initializedAt:Date.now(),probing:!0};try{const i=sessionStorage.getItem("godmode:host-compat");if(i){const a=JSON.parse(i);if(a.hostVersion===n&&a.methods)return N.methods=a.methods,N.probing=!1,N}}catch{}return ml(t).catch(()=>{}),N}async function ml(e){if(!N)return;const t=[{method:"sessions.list",params:{limit:1}},{method:"sessions.patch",params:{key:"__compat_probe__"}},{method:"sessions.autoTitle",params:{sessionKey:"__compat_probe__"}},{method:"config.get",params:{}}];for(const n of t){const s={available:!1,testedAt:Date.now()};try{await e.request(n.method,n.params),s.available=!0}catch(i){const a=String(i instanceof Error?i.message:i),r=a.toLowerCase(),c=r.includes("unknown method")||r.includes("not found")&&r.includes("method");s.available=!c,c&&(s.error="method not available");const h=a.match(/(?:expected|valid|accepted) (?:fields?|properties?)[:\s]*\[([^\]]+)\]/i);h&&(s.fields=h[1].split(",").map(m=>m.trim().replace(/['"]/g,"")))}N.methods[n.method]=s}N.probing=!1;try{sessionStorage.setItem("godmode:host-compat",JSON.stringify(N))}catch{}}function Gs(e){if(!N)return;const t=N.methods[e];if(t)return t.available}function gl(){return N?.hostVersion??"unknown"}function yl(){return N}function vl(){return N?.probing??!1}async function Qs(e,t,n){const s=await Be(e,"sessions.patch",{key:t,label:n});return s.ok?{ok:!0}:(await Be(e,"sessions.patch",{key:t,displayName:n},{raw:!0})).ok?{ok:!0}:{ok:!1,error:s.error}}async function wl(e,t,n){if(Gs("sessions.autoTitle")!==!1){const c=await Be(e,"sessions.autoTitle",{sessionKey:t});if(c.ok)return{ok:!0,title:c.data?.title}}const i=n.find(c=>c.role==="user");if(!i)return{ok:!1,error:"No user message to derive title from"};const a=bl(i.content),r=await Qs(e,t,a);return r.ok?{ok:!0,title:a}:{ok:!1,error:r.error}}function bl(e){let t=e.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").replace(/https?:\/\/\S+/g,"").replace(/[#*_~>]/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").trim();if(t=t.split(`
`).filter(s=>s.trim().length>0)[0]??"New conversation",t.length>60){const s=t.slice(0,57),i=s.lastIndexOf(" ");t=(i>30?s.slice(0,i):s)+"..."}return t}function Sl(e){return String(e.label??e.displayName??e.key??"Untitled")}const kl=Object.freeze(Object.defineProperty({__proto__:null,getHostCompat:yl,getHostVersion:gl,hasMethod:Gs,hostAutoTitle:wl,hostPatchSession:Qs,initHostCompat:Hs,isProbing:vl,readSessionName:Sl},Symbol.toStringTag,{value:"Module"})),xt=new Map;let Kn=null,dt=!1;function Tl(e,t,n){return xt.get(`${e}:${t}:${n}`)??null}async function Ys(e){if(!e.client||!e.chatMessages?.length)return;const t=e.sessionKey,n=[];for(let s=0;s<e.chatMessages.length;s++){const i=e.chatMessages[s],a=_t(i);for(let r=0;r<a.length;r++)if(a[r].url&&!a[r].omitted){const c=/^data:([^;]+);base64,(.+)$/.exec(a[r].url);c&&n.push({data:c[2],mimeType:c[1],messageIndex:s,imageIndex:r,role:i.role||"unknown",timestamp:typeof i.timestamp=="number"?i.timestamp:void 0})}}if(n.length>0)try{const s=await e.client.request("images.cache",{images:n.map(i=>({data:i.data,mimeType:i.mimeType})),sessionKey:t});if(s?.cached){const i=n.map((a,r)=>({messageIndex:a.messageIndex,imageIndex:a.imageIndex,hash:s.cached[r]?.hash,mimeType:a.mimeType,bytes:s.cached[r]?.bytes??0,role:a.role,timestamp:a.timestamp})).filter(a=>!!a.hash);i.length>0&&await e.client.request("images.updateIndex",{sessionKey:t,images:i})}}catch{}if(!dt){dt=!0;try{const s=Es();s&&await s.catch(()=>{});const i=async()=>{const r=await e.client.request("images.resolve",{sessionKey:t});if(r?.images&&Object.keys(r.images).length>0){Kn!==t&&xt.clear();for(const[c,h]of Object.entries(r.images))xt.set(`${t}:${c}`,h);return Kn=t,e.chatMessages=[...e.chatMessages],!0}return!1};if(!await i()&&e.chatMessages?.some(r=>_t(r).some(h=>h.omitted||!h.url))){for(const r of[500,1500,3e3])if(await new Promise(c=>setTimeout(c,r)),await i()||e.sessionKey!==t)break}}catch{}finally{dt=!1}}}let Nn=null;function _l(e){if(!e.chatMessages?.length)return;const t=e.chatMessages.slice(-5);for(const n of t){const s=n,i=Array.isArray(s.content)?s.content:[];for(const a of i){const r=a,c=typeof r.text=="string"?r.text:typeof r.content=="string"?r.content:null;if(c)try{const h=JSON.parse(c);if(h._sidebarAction?.type==="proof"&&h._sidebarAction.slug){const m=h._sidebarAction.slug;if(m===Nn)return;Nn=m,e.handleOpenProofDoc(m);return}}catch{}}}}function Ue(e){Ys(e)}const Se=[];function Al(){return[...Se]}let ee=null;const Cl=10,Pl=1e3,j=new Map;function ut(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const i=t.mainKey?.trim()||"main",a=t.defaultAgentId?.trim();return n==="main"||n===i||a&&(n===`agent:${a}:main`||n===`agent:${a}:${i}`)?s:n}function $l(e,t){if(!t?.mainSessionKey)return;const n="main",s=o=>(o??"").trim()===n||(o??"").trim()==="",i=s(e.sessionKey)?e.sessionKey:ut(e.sessionKey,t),a=s(e.settings.sessionKey)?e.settings.sessionKey:ut(e.settings.sessionKey,t),r=s(e.settings.lastActiveSessionKey)?e.settings.lastActiveSessionKey:ut(e.settings.lastActiveSessionKey,t),c=i||a||e.sessionKey,h={...e.settings,sessionKey:a||c,lastActiveSessionKey:r||c},m=h.sessionKey!==e.settings.sessionKey||h.lastActiveSessionKey!==e.settings.lastActiveSessionKey;c!==e.sessionKey&&(e.sessionKey=c),m&&J(e,h)}function xl(e){ee&&(clearTimeout(ee),ee=null);const t=(e.reconnectAttempt??0)+1;if(t>Cl){e.lastError="Connection lost. Please refresh the page.",e.reconnecting=!1;return}e.reconnectAttempt=t,e.reconnecting=!0;const n=Math.min(Pl*Math.pow(2,t-1),3e4);ee=setTimeout(()=>{ee=null,e.connected||Vt(e)},n)}async function Il(e){if(!e.client)return;const t=e;try{if(t.setupQuickDone){t.workspaceNeedsSetup=!1;return}try{if((await e.client.request("onboarding.status",{}))?.identity?.name){t.workspaceNeedsSetup=!1;return}}catch{}const n=await e.client.request("projects.list",{});t.workspaceNeedsSetup=!n?.projects||n.projects.length===0}catch{}}async function Rl(e){if(!e.client)return;if(e.workspaceNeedsSetup===!1){try{const n=await e.client.request("onboarding.status",{});n&&!n.completedAt&&await e.client.request("onboarding.complete",{summary:null})}catch{}return}try{const n=await e.client.request("onboarding.status",{}),s=e;if(n&&!n.completedAt){s.onboardingActive=!0,s.onboardingPhase=n.phase??0,s.onboardingData=n;const i=e;if(i.showSetupTab=!0,n.identity?.name){i.setupQuickDone=!0;const a=e;a.settings.userName||(a.userName=n.identity.name,a.applySettings({...a.settings,userName:n.identity.name}))}}else if(s.onboardingActive=!1,s.onboardingData=n??null,n?.identity?.name){const i=e;i.settings.userName||(i.userName=n.identity.name,i.applySettings({...i.settings,userName:n.identity.name}))}}catch{}}function Ll(e,t){if(!e.sessionsResult?.sessions)return;const n=e.sessionsResult.sessions.map(s=>s.key===t?{...s,updatedAt:Date.now()}:s);e.sessionsResult={...e.sessionsResult,sessions:n}}const Js=new Set;function Dl(){Js.clear()}async function El(e,t){}function Vt(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null,Dl();const t=e;"sessionsLoading"in t&&(t.sessionsLoading=!1),"agentsLoading"in t&&(t.agentsLoading=!1),"nodesLoading"in t&&(t.nodesLoading=!1),"devicesLoading"in t&&(t.devicesLoading=!1),"channelsLoading"in t&&(t.channelsLoading=!1),"configLoading"in t&&(t.configLoading=!1),"presenceLoading"in t&&(t.presenceLoading=!1),"cronLoading"in t&&(t.cronLoading=!1),"skillsLoading"in t&&(t.skillsLoading=!1),"debugLoading"in t&&(t.debugLoading=!1),"logsLoading"in t&&(t.logsLoading=!1),ee&&(clearTimeout(ee),ee=null),e.client?.stop(),e.client=new cl({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:n=>{const s=e.reconnecting;if(e.connected=!0,e.lastError=null,e.hello=n,e.reconnecting=!1,e.reconnectAttempt=0,s){const a=e;typeof a.showToast=="function"&&a.showToast("Gateway reconnected","success",4e3),e.lastError="✓ Reconnected",setTimeout(()=>{e.lastError==="✓ Reconnected"&&(e.lastError=null)},3e3),e.chatRunId=null;const r=e;"chatStream"in r&&(r.chatStream=null),"chatStreamStartedAt"in r&&(r.chatStreamStartedAt=null);const c=e;if(c.todaySelectedDate){const h=new Date,m=`${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,"0")}-${String(h.getDate()).padStart(2,"0")}`;c.todaySelectedDate!==m&&(c.todaySelectedDate=m)}e.workingSessions.clear(),e.requestUpdate?.();for(const h of j.values())clearTimeout(h);j.clear()}const i=n.features;document.title=i?.hermes?"Hermes - GodMode":"OC - GodMode",Hs(n,e.client),Bl(e,n),Ds(e),Yi(e),je(e,{quiet:!0}),ze(e,{quiet:!0}),F(e),Ce(e),Il(e).then(()=>Rl(e)),Fl(e),Kl(e),il(e),ol(e),Nl(e)},onClose:({code:n,reason:s})=>{e.connected=!1,al(e);const i=e;"chatSending"in i&&(i.chatSending=!1),"chatSendingSessionKey"in i&&(i.chatSendingSessionKey=null),"chatRunId"in i&&(i.chatRunId=null),"chatStream"in i&&(i.chatStream=null),"chatStreamStartedAt"in i&&(i.chatStreamStartedAt=null);const a=e;"sessionsLoading"in a&&(a.sessionsLoading=!1),"agentsLoading"in a&&(a.agentsLoading=!1),"nodesLoading"in a&&(a.nodesLoading=!1),"devicesLoading"in a&&(a.devicesLoading=!1),"channelsLoading"in a&&(a.channelsLoading=!1),"presenceLoading"in a&&(a.presenceLoading=!1),n!==1012&&(e.lastError=`disconnected (${n}): ${s||"no reason"}`),xl(e)},onEvent:n=>Ml(e,n),onGap:({expected:n,received:s})=>{e.lastError=`event gap detected (expected seq ${n}, got ${s}); refresh recommended`}}),e.client.start()}function Ml(e,t){try{Ol(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function Ol(e,t){if(Se.unshift({ts:Date.now(),event:t.event,payload:t.payload}),Se.length>250&&(Se.length=250),e.tab==="debug"&&(e.eventLog=[...Se]),t.event==="agent"){if(e.onboarding)return;const n=t.payload,s=n?.sessionKey;s&&n?.stream==="tool"&&n.data?.phase==="start"&&(e.workingSessions.has(s)||(e.workingSessions.add(s),e.requestUpdate?.())),xo(e,n);return}if(t.event==="chat"){const n=t.payload;if(n?.sessionKey){if(Zt(e,n.sessionKey),n.state==="delta"){const a=j.get(n.sessionKey);a&&(clearTimeout(a),j.delete(n.sessionKey)),e.workingSessions.has(n.sessionKey)||(e.workingSessions.add(n.sessionKey),e.requestUpdate?.());const r=`safety:${n.sessionKey}`,c=j.get(r);c&&clearTimeout(c),j.set(r,setTimeout(()=>{j.delete(r),e.workingSessions.has(n.sessionKey)&&(e.workingSessions.delete(n.sessionKey),e.requestUpdate?.())},9e4))}else if((n.state==="final"||n.state==="error"||n.state==="aborted")&&e.workingSessions.has(n.sessionKey)){const a=j.get(n.sessionKey);a&&(clearTimeout(a),j.delete(n.sessionKey));const r=`safety:${n.sessionKey}`,c=j.get(r);c&&(clearTimeout(c),j.delete(r)),e.workingSessions.delete(n.sessionKey),e.requestUpdate?.()}}n.state==="final"&&Ll(e,n.sessionKey);const s=Ns(e,n),i=n?.sessionKey===x||(n?.sessionKey?.endsWith(`:${x}`)??!1);if(n&&i){const a=e,r=e.tab==="chat"&&e.sessionKey===x;if(n.state==="delta"){const c=we(n.message);if(!r){if(typeof c=="string"){const h=a.allyStream??"";(!h||c.length>=h.length)&&(a.allyStream=c)}a.allyWorking=!0,a.requestUpdate?.()}}else if(n.state==="final"){a.allyStream=null,a.allyWorking=!1,!a.allyPanelOpen&&e.tab!=="chat"&&(a.allyUnread=(a.allyUnread??0)+1);const c=e;c._loadAllyHistory().then(()=>{a.allyPanelOpen&&c._scrollAllyToBottom(),a.requestUpdate?.()})}else if(n.state==="error"||n.state==="aborted"){const c=we(n.message),h=n.state==="aborted"?"Response was stopped.":c||"Something went wrong — try again.";a.allyMessages=[...a.allyMessages??[],{role:"assistant",content:`*${h}*`,timestamp:Date.now()}],a.allyStream=null,a.allyWorking=!1,a.requestUpdate?.()}}if(n.state==="final"&&(async()=>{await El(e,n.sessionKey);try{await F(e,{activeMinutes:0})}catch{}})(),s==="final"||s==="error"||s==="aborted"){if(Ot(e),Ai(e),s==="final"&&e.compactionStatus?.active){e.compactionStatus={active:!1,startedAt:e.compactionStatus.startedAt??null,completedAt:Date.now()};const a=e;a.autoRetryAfterCompact&&a.pendingRetry?(a.autoRetryAfterCompact=!1,setTimeout(()=>{a.handleRetryMessage?.()},500)):(a.showToast?.("Compaction complete — resuming...","info",2e3),setTimeout(()=>{a.handleSendChat?.("Continue where you left off.")},800))}(s==="error"||s==="aborted")&&e.compactionStatus?.active&&(e.compactionStatus=null),e.refreshSessionsAfterChat=!1}if(s==="final"){const a=!!e.compactionStatus?.completedAt;Fs(e,{allowShrink:a}).then(()=>{Ys(e),e.loadSessionResources?.(),_l(e);const c=e;if(!c.compactionStatus?.active){const m=[...Array.isArray(c.chatMessages)?c.chatMessages:[]].reverse().find(o=>typeof o=="object"&&o!==null&&o.role==="user");if(m){const o=m.content;let p="";typeof o=="string"?p=o:Array.isArray(o)&&(p=o.filter(g=>typeof g?.text=="string").map(g=>g.text).join(" ")),(p.includes("Pre-compaction memory flush")||p.includes("pre-compaction memory flush"))&&(c.showToast?.("Context compacted — resuming conversation...","info",2e3),setTimeout(()=>{c.handleSendChat?.("Continue where you left off.")},800))}}});const r=e;r.tab==="dashboards"&&r.activeDashboardManifest?.sessionId&&r.activeDashboardManifest.sessionId===n.sessionKey&&w(async()=>{const{loadDashboard:c}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:c}},[],import.meta.url).then(({loadDashboard:c})=>{c(e,r.activeDashboardManifest.id)})}return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&nt(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&ze(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=Zr(t.payload);if(n){e.execApprovalQueue=tl(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=En(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.process.completed"){const n=t.payload;if(n?.sessionId){const s=n.exitSignal?`signal ${n.exitSignal}`:`exit ${n.exitCode??0}`,i=n.status==="completed"?"✓":"✗",a=n.status==="completed"?"success":"warning",r=n.sessionId.slice(0,8),c=e;typeof c.showToast=="function"&&c.showToast(`${i} Process ${r} ${n.status} (${s})`,a,5e3)}return}if(t.event==="exec.approval.resolved"){const n=el(t.payload);n&&(e.execApprovalQueue=En(e.execApprovalQueue,n.id))}if(t.event==="daily-brief:update"){const n=t.payload;if(n){const s=e;s.dailyBrief=n}return}if(t.event==="ui.slot.update"){const n=t.payload;if(n?.tabId){const s=n.mode??"replace";if(n.html)s==="append"?e.dynamicSlots={...e.dynamicSlots,[n.tabId]:(e.dynamicSlots[n.tabId]??"")+n.html}:e.dynamicSlots={...e.dynamicSlots,[n.tabId]:n.html};else{const a={...e.dynamicSlots};delete a[n.tabId],e.dynamicSlots=a}e.requestUpdate?.()}return}if(t.event==="guardrails:update"){const n=e;typeof n.handleGuardrailsLoad=="function"&&n.handleGuardrailsLoad();return}if(t.event==="godmode.options:update"){const n=t.payload;if(n){const s=e;s.godmodeOptions=n,s.requestUpdate?.()}return}if(t.event==="fathom:meeting-processed"){const n=t.payload;if(n?.title){const s=e;typeof s.showToast=="function"&&s.showToast(`Meeting processed: ${n.title}`,"success",6e3);const i=n.message??`Meeting "${n.title}" has been processed.`;s.allyMessages=[...s.allyMessages??[],{role:"assistant",content:i,timestamp:Date.now()}],!s.allyPanelOpen&&s.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1),s.sessionKey===x&&s.chatMessages&&(s.chatMessages=[...s.chatMessages,{role:"assistant",content:i,timestamp:Date.now()}]),s.requestUpdate?.()}return}if(t.event==="onboarding:update"){const n=t.payload;if(n){const s=e;if(typeof n.phase=="number"&&(s.onboardingPhase=n.phase),s.onboardingData=n,n.completedAt&&(s.onboardingActive=!1),n.identity?.name){const i=e;(!i.userName||!i.settings.userName)&&(i.userName=n.identity.name,i.applySettings({...i.settings,userName:n.identity.name}))}s.requestUpdate?.()}return}if(t.event==="inbox:update"){const n=e;n.handleInboxRefresh?.().catch(()=>{}),n.requestUpdate?.();return}if(t.event==="queue:update"){const n=t.payload,s=e;n?.status==="processing"&&n.proofDocSlug&&s.handleOpenProofDoc?.(n.proofDocSlug).catch(()=>{}),s.handleInboxRefresh?.().catch(()=>{}),s.loadTodayQueueResults?.().catch(()=>{}),s.requestUpdate?.();return}if(t.event==="ally:notification"){const n=t.payload;if(n){const s=e,i={role:"assistant",content:n.summary||n.message||"Notification received.",timestamp:Date.now(),isNotification:!0,actions:n.actions??[]};s.allyMessages=[...s.allyMessages??[],i],!s.allyPanelOpen&&e.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1);const a=["queue-complete","queue-needs-review","queue-failed","cron-result","paperclip-completion"];if(n.type&&a.includes(n.type)&&s.loadTodayQueueResults&&s.loadTodayQueueResults().catch(()=>{}),n.type&&a.includes(n.type)&&s.handleInboxRefresh&&s.handleInboxRefresh().catch(()=>{}),n.type==="paperclip-completion"){const r=n,c=e;r.sessionKey&&c.sessionKey===r.sessionKey&&c.loadChatHistory?.().catch(()=>{}),i.content=r.message||i.content}s.requestUpdate?.()}return}if(t.event==="sessions:updated"){const n=t.payload;n?.sessionKey&&n?.title&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(s=>s.key===n.sessionKey||s.key?.endsWith(`:${n.sessionKey?.split(":").pop()}`)||n.sessionKey?.endsWith(`:${s.key?.split(":").pop()}`)?{...s,displayName:n.title,label:n.title}:s)}),le.set(n.sessionKey,n.title),Js.add(n.sessionKey),e.requestUpdate?.());return}if(t.event==="session:auto-compact"){const n=t.payload;if(n?.sessionKey){const s=e;n.sessionKey===s.sessionKey&&!s.compactionStatus?.active&&s.connected&&(s.showToast?.("Context near limit — auto-compacting...","info",3e3),s.handleCompactChat?.())}return}}async function Fl(e){const t=e;typeof t.loadFocusPulse=="function"&&await t.loadFocusPulse()}async function Kl(e){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}async function Nl(e){if(typeof window>"u")return;const t=new URLSearchParams(window.location.search),n=t.get("openTask");if(!n||!e.client)return;t.delete("openTask");const s=t.toString()?`${window.location.pathname}?${t.toString()}`:window.location.pathname;window.history.replaceState({},"",s);try{const i=await e.client.request("tasks.openSession",{taskId:n});if(i?.sessionKey){e.sessionKey=i.sessionKey,e.tab="chat";const{loadChatHistory:a}=await w(async()=>{const{loadChatHistory:r}=await Promise.resolve().then(()=>Q);return{loadChatHistory:r}},void 0,import.meta.url);await a(e,i.sessionKey)}}catch(i){console.error("[GodMode] Failed to open task session:",i)}}function Bl(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&$l(e,n.sessionDefaults)}function jt(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{je(e,{quiet:!0})},5e3))}function zt(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function Ht(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&Et(e,{quiet:!0})},2e3))}function Gt(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function Qt(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&He(e)},3e3))}function Yt(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}function Xs(e){e.missionControlPollInterval==null&&(e.missionControlPollInterval=window.setInterval(()=>{e.tab==="mission-control"&&Ji(e,{quiet:!0})},5e3))}function Zs(e){e.missionControlPollInterval!=null&&(clearInterval(e.missionControlPollInterval),e.missionControlPollInterval=null)}const Ul=["~/godmode/memory/AGENT-DAY.md","~/godmode/AGENT-DAY.md"];function Wl(e){return[...[`~/godmode/memory/agent-day/${e}.md`,`~/godmode/memory/agent-log/${e}.md`,`~/godmode/memory/daily/${e}-agent-log.md`],...Ul]}function ql(e){return["Needs Review","Active Sub-Agents","Completed Today","Queue","Feedback Log","AGENT-DAY"].filter(s=>e.includes(s)).length>=2}async function ei(e,t){try{const n=t?{date:t}:{},s=await e.request("dailyBrief.get",n);return!s||!s.content||!s.date?null:s}catch(n){return console.error("[MyDay] Failed to load daily brief:",n),null}}async function ti(e,t,n){const s=t||z(),i="agentLog.get";try{const a=await e.request(i,{date:s});if(a?.content?.trim()&&a?.sourcePath)return{date:a.date||s,content:a.content,updatedAt:a.updatedAt||new Date().toISOString(),sourcePath:a.sourcePath}}catch(a){console.warn(`[MyDay] ${i} unavailable, falling back to files.read:`,a)}return Vl(e,s)}async function Vl(e,t){const n=Wl(t),s=i=>i.includes("AGENT-DAY.md");for(const i of n)try{const a=await e.request("files.read",{path:i,maxSize:1e6});if(!a?.content?.trim()||!ql(a.content)||s(i)&&typeof a.modifiedAt=="number"&&z(new Date(a.modifiedAt))!==t)continue;return{date:t,content:a.content,updatedAt:typeof a.modifiedAt=="number"?new Date(a.modifiedAt).toISOString():new Date().toISOString(),sourcePath:i}}catch{}return null}function ye(e,t,n){return new Promise((s,i)=>{const a=setTimeout(()=>i(new Error(`${n} timed out after ${t}ms`)),t);e.then(r=>{clearTimeout(a),s(r)},r=>{clearTimeout(a),i(r)})})}const jl={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function ni(e){if(!e.client||!e.connected)return[];e.todayTasksLoading=!0;try{const t=e.todaySelectedDate??z(),[n,s]=await Promise.all([e.client.request("tasks.today",{date:t,includeCompleted:!0}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),i=new Map;for(const r of s.items)r.sourceTaskId&&(r.status==="processing"||r.status==="review"||r.status==="needs-review"||r.status==="done"||r.status==="failed")&&i.set(r.sourceTaskId,{status:r.status,type:r.type,roleName:jl[r.type]??r.type,queueItemId:r.id});const a=(n.tasks??[]).map(r=>({id:r.id,title:r.title,status:r.status,project:r.project,dueDate:r.dueDate,priority:r.priority,createdAt:r.createdAt,completedAt:r.completedAt,queueStatus:i.get(r.id)??null}));return e.todayTasks=a,a}catch(t){return console.error("[MyDay] Failed to load today tasks:",t),e.todayTasks??[]}finally{e.todayTasksLoading=!1}}async function si(e){if(!(!e.client||!e.connected)){e.inboxLoading=!0;try{const t=await e.client.request("inbox.list",{status:"pending",limit:50});e.inboxItems=t.items??[],e.inboxCount=t.pendingCount??0}catch(t){console.error("[MyDay] Failed to load inbox items:",t),e.inboxItems=[],e.inboxCount=0}finally{e.inboxLoading=!1}}}async function ii(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("trust.dashboard",{}),n=t.summaries.filter(s=>s.trustScore!==null);e.trustSummary={overallScore:t.overallScore,dailyStreak:t.dailyStreak,todayRated:t.todayRating!==null,workflowCount:t.workflows.length,highPerformers:n.filter(s=>(s.trustScore??0)>=8).length,needsAttention:n.filter(s=>(s.trustScore??10)<7).length}}catch{e.trustSummary=null}}async function zl(e){if(!e.client||!e.connected)return[];try{const n=(await e.client.request("queue.list",{limit:50}))?.items??[],s=Date.now()-1440*60*1e3;return n.filter(i=>!(i.status!=="review"&&i.status!=="needs-review"&&i.status!=="done"||i.status==="done"&&(i.completedAt??0)<s)).sort((i,a)=>(a.completedAt??0)-(i.completedAt??0)).map(i=>({id:i.id,title:i.title,summary:i.result?.summary??i.description??"",status:i.status==="needs-review"?"review":i.status,completedAt:i.completedAt,outputPath:i.result?.outputPath,prUrl:i.result?.prUrl,sourceTaskId:i.sourceTaskId,persona:i.personaHint??void 0,source:i.source}))}catch(t){return console.error("[MyDay] Failed to load queue results for decision cards:",t),[]}}function Hl(e,t){e.request("dailyBrief.syncTasks",t?{date:t}:{}).catch(n=>{console.warn("[MyDay] dailyBrief.syncTasks failed (non-blocking):",n)})}async function ke(e){if(!(!e.client||!e.connected)){e.dailyBriefLoading=!0,e.dailyBriefError=null;try{e.dailyBrief=await ei(e.client,e.todaySelectedDate),e.loadBriefNotes&&await e.loadBriefNotes()}catch(t){e.dailyBriefError=t instanceof Error?t.message:"Failed to load daily brief",console.error("[MyDay] Brief load error:",t)}finally{e.dailyBriefLoading=!1}}}async function Gl(e,t){if(!(!e.client||!e.connected)){e.agentLogLoading=!0,e.agentLogError=null;try{e.agentLog=await ti(e.client,e.todaySelectedDate,t)}catch(n){e.agentLogError=n instanceof Error?n.message:"Failed to load agent log",console.error("[MyDay] Agent log load error:",n)}finally{e.agentLogLoading=!1}}}function ai(e){const t=e||z(),n="VAULT",s=`01-Daily/${t}`,i=`obsidian://open?vault=${encodeURIComponent(n)}&file=${encodeURIComponent(s)}`;window.open(i,"_blank")}async function We(e){if(!e.client||!e.connected)return;e.myDayLoading=!0,e.myDayError=null,e.dailyBriefLoading=!0,e.agentLogLoading=!0,e.todayTasksLoading=!0;const t=e.todaySelectedDate,n=e.loadBriefNotes?ye(e.loadBriefNotes(),5e3,"Brief Notes"):Promise.resolve(),s=await Promise.allSettled([ye(ei(e.client,t),1e4,"Daily Brief"),n,ye(ti(e.client,t),1e4,"Agent Log"),ye(ni(e),8e3,"Today Tasks"),ye(si(e),5e3,"Inbox"),ye(ii(e),5e3,"Trust Summary")]);e.dailyBrief=s[0].status==="fulfilled"?s[0].value:null,e.agentLog=s[2].status==="fulfilled"?s[2].value:null;const i=["Brief","Brief Notes","Agent Log","Today Tasks","Inbox","Trust"],a=s.map((r,c)=>r.status==="rejected"?{section:i[c],reason:r.reason}:null).filter(Boolean);if(a.length>0){for(const r of a)console.warn(`[MyDay] ${r.section} failed:`,r.reason);a.length===s.length&&(e.myDayError="Failed to load daily brief")}e.myDayLoading=!1,e.dailyBriefLoading=!1,e.agentLogLoading=!1,e.todayTasksLoading=!1}const Te=Object.freeze(Object.defineProperty({__proto__:null,loadAgentLogOnly:Gl,loadBriefOnly:ke,loadInboxItems:si,loadMyDay:We,loadTodayQueueResults:zl,loadTodayTasksWithQueueStatus:ni,loadTrustSummary:ii,openBriefInObsidian:ai,syncTodayTasks:Hl},Symbol.toStringTag,{value:"Module"}));async function oi(e){if(!(!e.client||!e.connected)){e.workLoading=!0,e.workError=null;try{const t=await e.client.request("projects.list",{});e.workProjects=t.projects??[]}catch(t){console.error("[Work] Failed to load:",t),e.workError=t instanceof Error?t.message:"Failed to load"}finally{e.workLoading=!1}}}async function Ql(e,t){if(!e.client||!e.connected)return;const n=new Set(e.workDetailLoading??[]);n.add(t),e.workDetailLoading=n;try{const s=await e.client.request("projects.get",{id:t,includeFiles:!0,depth:2});if(s){const i=s.files??[];e.workProjectFiles={...e.workProjectFiles,[t]:i}}}catch(s){console.warn("[Work] Failed to load project details:",s)}finally{const s=new Set(e.workDetailLoading??[]);s.delete(t),e.workDetailLoading=s}}async function ri(e){if(!(!e.client||!e.connected)){e.workResourcesLoading=!0;try{const t=await e.client.request("resources.list",{limit:100});e.workResources=t.resources??[]}catch(t){console.warn("[Work] Failed to load resources:",t),e.workResources=[]}finally{e.workResourcesLoading=!1}}}async function Yl(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("resources.pin",{id:t,pinned:n}),e.workResources&&(e.workResources=e.workResources.map(s=>s.id===t?{...s,pinned:n}:s))}catch(s){console.warn("[Work] Failed to pin resource:",s)}}async function Jl(e,t){if(!(!e.client||!e.connected))try{await e.client.request("resources.delete",{id:t}),e.workResources&&(e.workResources=e.workResources.filter(n=>n.id!==t))}catch(n){console.warn("[Work] Failed to delete resource:",n)}}function Ze(e,t=Date.now()){if(typeof e=="number"&&Number.isFinite(e))return new Date(e);if(typeof e=="string"){const n=Date.parse(e);if(Number.isFinite(n))return new Date(n)}return new Date(t)}function Jt(e){return{id:e.id,name:e.name,emoji:e.emoji||"📁",type:e.type,path:e.path,artifactCount:e.artifactCount??0,sessionCount:e.sessionCount??0,lastUpdated:Ze(e.lastUpdated,e.lastScanned)}}function ht(e){return{path:e.path,name:e.name,type:e.type,size:e.size,modified:Ze(e.modified),isDirectory:e.isDirectory,searchText:e.searchText}}function Bn(e){return{id:e.id,key:e.key,title:e.title,created:Ze(e.created),status:e.status,workspaceSubfolder:e.workspaceSubfolder}}function pe(e){return{id:e.id,title:e.title,status:e.status,project:e.project,dueDate:e.dueDate,priority:e.priority,createdAt:e.createdAt,completedAt:e.completedAt}}function li(e){return e.map(t=>({name:t.name,path:t.path,type:t.type,fileType:t.fileType,size:t.size,modified:t.modified?Ze(t.modified):void 0,children:t.children?li(t.children):void 0}))}function Xl(e,t){return{...t,id:e.id,name:e.name,emoji:e.emoji,type:e.type,path:e.path,artifactCount:e.artifactCount,sessionCount:e.sessionCount,lastUpdated:e.lastUpdated}}async function et(e){if(!e.client||!e.connected){e.workspaces=[],e.workspacesLoading=!1,e.workspacesError="Connect to gateway to see workspaces";return}e.workspacesLoading=!0,e.workspacesError=null;try{const t=await e.client.request("workspaces.list",{});if(e.workspaces=(t.workspaces??[]).map(Jt),e.selectedWorkspace){const n=e.workspaces.find(s=>s.id===e.selectedWorkspace?.id);n&&(e.selectedWorkspace=Xl(n,e.selectedWorkspace))}}catch(t){console.error("[Workspaces] load failed:",t),e.workspacesError=t instanceof Error?t.message:"Failed to load workspaces",e.workspaces=[]}finally{e.workspacesLoading=!1}}async function tt(e,t){if(!e.client||!e.connected)return null;try{const n=await e.client.request("workspaces.get",{id:t});return n.workspace?{...Jt(n.workspace),pinned:(n.pinned??[]).map(ht),pinnedSessions:(n.pinnedSessions??[]).map(Bn),outputs:(n.outputs??[]).map(ht),folderTree:n.folderTree?li(n.folderTree):void 0,sessions:(n.sessions??[]).map(Bn),tasks:(n.tasks??[]).map(pe),memory:(n.memory??[]).map(ht)}:null}catch(n){return console.error("[Workspaces] get failed:",n),null}}async function Zl(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("workspaces.readFile",n?{workspaceId:n,filePath:t}:{path:t});return s.content?{content:s.content,mime:s.contentType??s.mime??"text/plain"}:(s.error&&console.warn("[Workspaces] readFile failed:",s.error),null)}catch(s){return console.error("[Workspaces] readFile error:",s),null}}async function ec(e){if(!(!e.client||!e.connected))try{e.workspacesLoading=!0,e.workspacesError=null,await e.client.request("workspaces.scan",{}),await et(e)}catch(t){e.workspacesError=t instanceof Error?t.message:"Failed to scan workspaces"}finally{e.workspacesLoading=!1}}async function tc(e,t){if(!t){e.selectedWorkspace=null;return}const n=await tt(e,t.id);e.selectedWorkspace=n||{...t,pinned:[],pinnedSessions:[],outputs:[],sessions:[],tasks:[]}}async function nc(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpin":"workspaces.pin",{workspaceId:t,filePath:n}),e.selectedWorkspace?.id===t){const i=await tt(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] pin toggle failed:",i),!1}}async function sc(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpinSession":"workspaces.pinSession",{workspaceId:t,sessionKey:n}),e.selectedWorkspace?.id===t){const i=await tt(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] session pin toggle failed:",i),!1}}async function ic(e,t){if(!e.client||!e.connected)return null;const n=String(t.name??"").trim();if(!n)return e.workspacesError="Workspace name is required",null;const s=t.type??"project",i=String(t.path??"").trim();try{const a=await e.client.request("workspaces.create",{name:n,type:s,...i?{path:i}:{}});if(!a.workspace)return e.workspacesError="Workspace creation returned no workspace",null;const r=Jt(a.workspace),c=e.workspaces??[],h=new Map(c.map(m=>[m.id,m]));return h.set(r.id,r),e.workspaces=Array.from(h.values()).toSorted((m,o)=>o.lastUpdated.getTime()-m.lastUpdated.getTime()),e.workspacesError=null,r}catch(a){return console.error("[Workspaces] create failed:",a),e.workspacesError=a instanceof Error?a.message:"Failed to create workspace",null}}async function ac(e,t){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.delete",{id:t}),e.workspaces=(e.workspaces??[]).filter(n=>n.id!==t),e.selectedWorkspace?.id===t&&(e.selectedWorkspace=null),e.workspacesError=null,!0}catch(n){return console.error("[Workspaces] delete failed:",n),e.workspacesError=n instanceof Error?n.message:"Failed to delete workspace",!1}}function oc(e,t){e.workspacesSearchQuery=t}function rc(e){e.selectedWorkspace=null}async function lc(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("workspaces.teamSetupPrompt",{});t?.prompt&&(e.chatMessage=t.prompt,e.setTab?.("chat"))}catch{e.chatMessage="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.",e.setTab?.("chat")}}function cc(e,t){const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}async function dc(e,t){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.byProject",{project:t})).tasks??[]).map(pe)}catch(n){return console.error("[Workspaces] loadWorkspaceTasks failed:",n),[]}}async function uc(e){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.list",{})).tasks??[]).map(pe)}catch(t){return console.error("[Workspaces] loadAllTasks failed:",t),[]}}const hc={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function pc(e){if(!e.client||!e.connected)return[];try{const[t,n]=await Promise.all([e.client.request("tasks.list",{}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),s=new Map;for(const i of n.items)i.sourceTaskId&&(i.status==="processing"||i.status==="review"||i.status==="needs-review"||i.status==="failed")&&s.set(i.sourceTaskId,{status:i.status==="needs-review"?"review":i.status,type:i.type,roleName:hc[i.type]??i.type,queueItemId:i.id});return(t.tasks??[]).map(i=>({...pe(i),queueStatus:s.get(i.id)??null}))}catch(t){return console.error("[Workspaces] loadAllTasksWithQueueStatus failed:",t),[]}}async function fc(e,t,n){if(!e.client||!e.connected)return null;const s=n==="complete"?"pending":"complete";try{const i=await e.client.request("tasks.update",{id:t,status:s});return pe(i)}catch(i){return console.error("[Workspaces] toggleTaskComplete failed:",i),null}}async function mc(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.update",{id:t,...n});return pe(s)}catch(s){return console.error("[Workspaces] updateTask failed:",s),null}}async function gc(e,t){if(!e.client||!e.connected)return null;try{return await e.client.request("tasks.openSession",{taskId:t})}catch(n){return console.error("[Workspaces] startTask failed:",n),null}}async function yc(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.create",{title:t,project:n,source:"chat"});return pe(s)}catch(s){return console.error("[Workspaces] createTask failed:",s),null}}async function vc(e,t,n){if(!e.client||!e.connected)return null;try{return await e.client.request("workspaces.browseFolder",{workspaceId:t,folderPath:n})}catch(s){return console.error("[Workspaces] browseFolder failed:",s),null}}async function wc(e,t,n,s=50){if(!e.client||!e.connected)return[];try{return(await e.client.request("workspaces.search",{workspaceId:t,query:n,limit:s})).results??[]}catch(i){return console.error("[Workspaces] search failed:",i),[]}}async function bc(e,t,n){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.createFolder",{workspaceId:t,folderPath:n}),!0}catch(s){return console.error("[Workspaces] createFolder failed:",s),!1}}async function Sc(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.moveFile",{workspaceId:t,sourcePath:n,destPath:s}),!0}catch(i){return console.error("[Workspaces] moveFile failed:",i),!1}}async function kc(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.renameFile",{workspaceId:t,filePath:n,newName:s}),!0}catch(i){return console.error("[Workspaces] renameFile failed:",i),!1}}const Fe=Object.freeze(Object.defineProperty({__proto__:null,browseWorkspaceFolder:vc,clearWorkspaceSelection:rc,createTask:yc,createWorkspace:ic,createWorkspaceFolder:bc,deleteWorkspace:ac,getWorkspace:tt,loadAllTasks:uc,loadAllTasksWithQueueStatus:pc,loadWorkspaceTasks:dc,loadWorkspaces:et,moveWorkspaceFile:Sc,readWorkspaceFile:Zl,renameWorkspaceFile:kc,scanWorkspaces:ec,searchWorkspaceFiles:wc,selectWorkspace:tc,setWorkspacesSearchQuery:oc,startTask:gc,startTeamSetup:lc,toggleTaskComplete:fc,toggleWorkspaceFolder:cc,toggleWorkspacePin:nc,toggleWorkspaceSessionPin:sc,updateTask:mc},Symbol.toStringTag,{value:"Module"})),ci="godmode.ui.settings.v1";function Tc(){const e=new URLSearchParams(location.search),t=(()=>{const i=e.get("gatewayUrl");return i||(typeof window.__GODMODE_DEV__<"u"?"/ws":`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}`)})(),n=e.get("token")||"",s={gatewayUrl:t,token:n,sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{System:!0,__missionControl__:!1},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]};try{const i=localStorage.getItem(ci);if(!i)return s;const a=JSON.parse(i);return{gatewayUrl:e.get("gatewayUrl")||(typeof window.__GODMODE_DEV__<"u"?"/ws":typeof a.gatewayUrl=="string"&&a.gatewayUrl.trim()?a.gatewayUrl.trim():s.gatewayUrl),token:n||(typeof a.token=="string"?a.token:""),sessionKey:typeof a.sessionKey=="string"&&a.sessionKey.trim()?a.sessionKey.trim():s.sessionKey,lastActiveSessionKey:typeof a.lastActiveSessionKey=="string"&&a.lastActiveSessionKey.trim()?a.lastActiveSessionKey.trim():typeof a.sessionKey=="string"&&a.sessionKey.trim()||s.lastActiveSessionKey,theme:a.theme==="light"||a.theme==="dark"||a.theme==="system"||a.theme==="lifetrack"?a.theme:s.theme,chatFocusMode:typeof a.chatFocusMode=="boolean"?a.chatFocusMode:s.chatFocusMode,chatShowThinking:typeof a.chatShowThinking=="boolean"?a.chatShowThinking:s.chatShowThinking,splitRatio:typeof a.splitRatio=="number"&&a.splitRatio>=.4&&a.splitRatio<=.7?a.splitRatio:s.splitRatio,navCollapsed:typeof a.navCollapsed=="boolean"?a.navCollapsed:s.navCollapsed,navGroupsCollapsed:typeof a.navGroupsCollapsed=="object"&&a.navGroupsCollapsed!==null?a.navGroupsCollapsed:s.navGroupsCollapsed,openTabs:Array.isArray(a.openTabs)&&a.openTabs.every(r=>typeof r=="string")?a.openTabs:s.openTabs,tabLastViewed:typeof a.tabLastViewed=="object"&&a.tabLastViewed!==null?a.tabLastViewed:s.tabLastViewed,userName:typeof a.userName=="string"?a.userName.trim().slice(0,50):s.userName,userAvatar:typeof a.userAvatar=="string"?a.userAvatar.trim():s.userAvatar,chatParallelView:typeof a.chatParallelView=="boolean"?a.chatParallelView:s.chatParallelView,parallelLanes:Array.isArray(a.parallelLanes)&&a.parallelLanes.length===4?a.parallelLanes.map(r=>typeof r=="string"?r:null):s.parallelLanes}}catch{return s}}function _c(e){localStorage.setItem(ci,JSON.stringify(e))}const Ac=56,Cc="quantum-particles",Pc="quantum-particle";let te=null,_e=null;function q(e,t){return Math.random()*(t-e)+e}function di(){if(ui(),typeof document>"u")return;const e=document.querySelector(".shell");if(!e){_e=requestAnimationFrame(()=>{_e=null,di()});return}te=document.createElement("div"),te.className=Cc,Object.assign(te.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"1",overflow:"hidden"});for(let t=0;t<Ac;t++){const n=document.createElement("div");n.className=Pc;const s=q(2,5),i=q(.3,.65),a=q(15,35),r=q(0,12),c=q(5,95),h=q(5,95),m=q(-150,150),o=q(-200,200),p=q(-250,250),g=q(-350,350),y=q(.8,1.5);Object.assign(n.style,{position:"absolute",left:`${c}%`,top:`${h}%`,width:`${s}px`,height:`${s}px`,borderRadius:"50%",background:`rgba(235, 158, 15, ${q(.7,1)})`,boxShadow:`0 0 ${s*3}px rgba(235, 158, 15, ${i*.7})`,opacity:"0",willChange:"transform, opacity",animation:`quantum-float ${a}s ${r}s ease-in-out infinite`}),n.style.setProperty("--particle-opacity",String(i)),n.style.setProperty("--drift-x",`${m}px`),n.style.setProperty("--drift-y",`${o}px`),n.style.setProperty("--drift-end-x",`${p}px`),n.style.setProperty("--drift-end-y",`${g}px`),n.style.setProperty("--particle-scale-mid",String(y)),te.appendChild(n)}e.prepend(te)}function ui(){_e!==null&&(cancelAnimationFrame(_e),_e=null),te&&(te.remove(),te=null)}function $c(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"lifetrack"}function Xt(e){return e==="system"?$c():e==="light"?"lifetrack":e}const Le=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,xc=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,be=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},Ic=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const i=globalThis.document??null;if(!i){t();return}const a=i.documentElement,r=i,c=xc();if(!!r.startViewTransition&&!c){let m=.5,o=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")m=Le(n.pointerClientX/window.innerWidth),o=Le(n.pointerClientY/window.innerHeight);else if(n?.element){const g=n.element.getBoundingClientRect();g.width>0&&g.height>0&&typeof window<"u"&&(m=Le((g.left+g.width/2)/window.innerWidth),o=Le((g.top+g.height/2)/window.innerHeight))}a.style.setProperty("--theme-switch-x",`${m*100}%`),a.style.setProperty("--theme-switch-y",`${o*100}%`),a.classList.add("theme-transition");const p=setTimeout(()=>{be(a)},1e3);try{const g=r.startViewTransition?.(()=>{t()});g?.finished?g.finished.finally(()=>{clearTimeout(p),be(a)}):(clearTimeout(p),be(a))}catch{clearTimeout(p),be(a),t()}return}t(),be(a)};function Rc(e,t){const n=Array.isArray(e)?[...new Set(e.map(s=>s.trim()).filter(s=>s.length>0))]:[];if(n.length===0&&t){const s=t.toLowerCase();s==="main"||s==="agent:main:main"||s.endsWith(":main")||n.push(t)}return n}function Lc(e){const t={};if(!e||typeof e!="object")return t;for(const[n,s]of Object.entries(e)){const i=n.trim();!i||typeof s!="number"||!Number.isFinite(s)||(t[i]=Math.max(t[i]??0,s))}return t}function J(e,t){const n=t.sessionKey.trim()||"main",s=Rc(t.openTabs,n),i=Lc(t.tabLastViewed),a={...t,sessionKey:n,openTabs:s,tabLastViewed:i,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||n};e.settings=a,_c(a),a.theme!==e.theme&&(e.theme=a.theme,Pe(e,Xt(a.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function Zt(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&J(e,{...e.settings,lastActiveSessionKey:n})}function hi(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),n=t.get("token"),s=t.get("password"),i=t.get("session"),a=t.get("gatewayUrl");let r=!1;if(n!=null){const h=n.trim();h&&h!==e.settings.token&&J(e,{...e.settings,token:h}),t.delete("token"),r=!0}if(s!=null){const h=s.trim();h&&(e.password=h),t.delete("password"),r=!0}if(i!=null){const h=i.trim();if(h){e.sessionKey=h;const m=h.toLowerCase(),p=m==="main"||m==="agent:main:main"||m.endsWith(":main")||e.settings.openTabs.includes(h)?e.settings.openTabs:[...e.settings.openTabs,h];J(e,{...e.settings,sessionKey:h,lastActiveSessionKey:h,openTabs:p})}}if(a!=null){const h=a.trim();h&&h!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=h),t.delete("gatewayUrl"),r=!0}if(!r)return;const c=new URL(window.location.href);c.search=t.toString(),window.history.replaceState({},"",c.toString())}function en(e,t){const n=e.tab;if(n!==t&&(e.tab=t),n==="chat"&&t!=="chat"&&e.sessionKey===x&&e._loadAllyHistory?.(),n==="dashboards"&&t!=="dashboards"){const s=e;if(s.dashboardPreviousSessionKey&&s.activeDashboardId){const i=s.dashboardPreviousSessionKey;s.dashboardPreviousSessionKey=null,s.activeDashboardId=null,s.activeDashboardManifest=null,s.activeDashboardHtml=null,s.dashboardChatOpen=!1,e.sessionKey=i}}t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?jt(e):zt(e),t==="logs"?Ht(e):Gt(e),t==="debug"?Qt(e):Yt(e),t==="mission-control"?Xs(e):Zs(e),Ce(e),nn(e,t,!1)}function pi(e,t,n){Ic({nextTheme:t,applyTheme:()=>{e.theme=t,J(e,{...e.settings,theme:t}),Pe(e,Xt(t))},context:n,currentTheme:e.theme})}async function Ce(e){if(e.tab==="overview"&&await sn(e),(e.tab==="today"||e.tab==="my-day")&&(await We(e),w(()=>Promise.resolve().then(()=>Te),void 0,import.meta.url).then(async({loadTodayQueueResults:t})=>{e.todayQueueResults=await t(e)}).catch(()=>{})),e.tab==="work"&&await Promise.all([oi(e),ri(e)]),e.tab==="workspaces"&&(await et(e),w(()=>Promise.resolve().then(()=>Fe),void 0,import.meta.url).then(async({loadAllTasksWithQueueStatus:t})=>{e.allTasks=await t(e)})),e.tab==="channels"&&await bi(e),e.tab==="instances"&&await Mt(e),e.tab==="sessions"&&(await F(e),await wt(e)),e.tab==="cron"&&await nt(e),e.tab==="skills"&&(await ls(e),await bt(e)),e.tab==="agents"){const{loadRoster:t}=await w(async()=>{const{loadRoster:n}=await import("./ctrl-settings-CzLVBbt9.js").then(s=>s.ac);return{loadRoster:n}},[],import.meta.url);await t(e)}if(e.tab==="nodes"&&(await je(e),await ze(e),await de(e),await cs(e)),e.tab==="chat"&&(await rn(e),B(e,!e.chatHasAutoScrolled),e.loadSessionResources?.()),e.tab==="options"){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}if(e.tab==="trust"){const t=e,n=[];typeof t.handleTrustLoad=="function"&&n.push(t.handleTrustLoad()),n.push(Zi(t)),n.push(F(t)),await Promise.all(n)}if(e.tab==="guardrails"){const t=e;typeof t.handleGuardrailsLoad=="function"&&await t.handleGuardrailsLoad()}if(e.tab==="mission-control"){const t=e;typeof t.handleMissionControlRefresh=="function"&&await t.handleMissionControlRefresh()}if(e.tab==="setup"){const t=e;typeof t.handleLoadCapabilities=="function"&&t.handleLoadCapabilities()}if(e.tab==="dashboards"){const t=e;typeof t.handleDashboardsRefresh=="function"&&await t.handleDashboardsRefresh()}if(e.tab==="second-brain"){const t=e;typeof t.handleSecondBrainRefresh=="function"&&await t.handleSecondBrainRefresh()}e.tab==="config"&&(await ds(e),await de(e)),e.tab==="debug"&&(await He(e),e.eventLog=Al()),e.tab==="logs"&&(e.logsAtBottom=!0,await Et(e,{reset:!0}),ws(e,!0))}function fi(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?fs(e):Ra(window.location.pathname)}function mi(e){e.theme=e.settings.theme??"system",Pe(e,Xt(e.theme))}function Pe(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t==="dark"?"dark":"light",t==="lifetrack"?di():ui()}function gi(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&Pe(e,n.matches?"dark":"lifetrack")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function yi(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function vi(e,t){if(typeof window>"u")return;const n=ps(window.location.pathname,e.basePath)??"chat";tn(e,n),nn(e,n,t)}function wi(e){if(typeof window>"u")return;const t=ps(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();if(s){e.sessionKey=s;const i=e.settings.openTabs.includes(s)?e.settings.openTabs:[...e.settings.openTabs,s];J(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s,openTabs:i})}tn(e,t)}function tn(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?jt(e):zt(e),t==="logs"?Ht(e):Gt(e),t==="debug"?Qt(e):Yt(e),t==="mission-control"?Xs(e):Zs(e),e.connected&&Ce(e)}function nn(e,t,n){if(typeof window>"u")return;const s=fn(ms(t,e.basePath)),i=fn(window.location.pathname),a=new URL(window.location.href);t==="chat"&&e.sessionKey?a.searchParams.set("session",e.sessionKey):a.searchParams.delete("session"),i!==s&&(a.pathname=s),n?window.history.replaceState({},"",a.toString()):window.history.pushState({},"",a.toString())}function H(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),n?window.history.replaceState({},"",s.toString()):window.history.pushState({},"",s.toString())}async function sn(e){await Promise.all([G(e,!1),Mt(e),F(e),rs(e),He(e)])}async function bi(e){await Promise.all([G(e,!0),ds(e),de(e)])}async function nt(e){await Promise.all([G(e,!1),rs(e),Xi(e)])}const Dc=Object.freeze(Object.defineProperty({__proto__:null,applyResolvedTheme:Pe,applySettings:J,applySettingsFromUrl:hi,attachThemeListener:gi,detachThemeListener:yi,inferBasePath:fi,loadChannelsTab:bi,loadCron:nt,loadOverview:sn,onPopState:wi,refreshActiveTab:Ce,setLastActiveSessionKey:Zt,setTab:en,setTabFromRoute:tn,setTheme:pi,syncTabWithLocation:vi,syncThemeWithSettings:mi,syncUrlWithSessionKey:H,syncUrlWithTab:nn},Symbol.toStringTag,{value:"Module"}));function qe(e){return e.chatSending||!!e.chatRunId}function Y(e,t){const n=t??e.sessionKey,s=e.chatMessage.trim();if(s)e.chatDrafts={...e.chatDrafts,[n]:s};else{const{[n]:i,...a}=e.chatDrafts;e.chatDrafts=a}}function ne(e,t){const n=t??e.sessionKey;e.chatMessage=e.chatDrafts[n]??""}function Si(e,t){const n=t??e.sessionKey,{[n]:s,...i}=e.chatDrafts;e.chatDrafts=i,n===e.sessionKey&&(e.chatMessage="")}function ki(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function Ec(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function an(e){e.connected&&(e.chatMessage="",await qt(e))}function Mc(e,t,n){const s=t.trim(),i=!!(n&&n.length>0);if(!s&&!i)return;const a=Date.now();e.chatQueue=[...e.chatQueue,{id:Xe(),text:s,createdAt:a,attachments:i?n?.map(c=>({...c})):void 0}];const r=[];if(s&&r.push({type:"text",text:s}),i&&n)for(const c of n)r.push({type:"image",source:{type:"base64",media_type:c.mimeType,data:c.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:r,timestamp:a}],B(e,!0)}async function It(e,t,n){Ot(e);const s=e;s.sessionKey&&s.workingSessions&&(s.workingSessions=new Set([...s.workingSessions,s.sessionKey])),n?.skipOptimisticUpdate||queueMicrotask(()=>{B(e,!0)});const i=await Wt(e,t,n?.attachments,{skipOptimisticUpdate:n?.skipOptimisticUpdate});return!i&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!i&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),i&&(Zt(e,e.sessionKey),e.chatAttachments=[]),i&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),i&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),B(e,!0),i&&!e.chatRunId&&on(e),i&&n?.refreshSessions&&(e.refreshSessionsAfterChat=!0),i}async function on(e){if(!e.connected||qe(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await It(e,t.text,{attachments:t.attachments,skipOptimisticUpdate:!0})||(e.chatQueue=[t,...e.chatQueue])}function Ti(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function _i(e,t,n){if(!e.connected)return;const s=e.chatMessage,i=(t??e.chatMessage).trim(),a=e.chatAttachments??[],r=t==null?a:[],c=r.length>0;if(!i&&!c)return;if(ki(i)){await an(e);return}const h=Ec(i);if(t==null&&(e.chatMessage="",Si(e)),n?.queue){Mc(e,i,r),qe(e)||await on(e);return}if(qe(e)){await qt(e),await new Promise(m=>setTimeout(m,50)),await It(e,i,{attachments:c?r:void 0,refreshSessions:h});return}await It(e,i,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:c?r:void 0,previousAttachments:t==null?a:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:h})}async function rn(e){await Promise.all([K(e),F(e,{activeMinutes:0}),Ve(e)]),B(e,!0)}const Ai=on;function Oc(e){const t=vs(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function Fc(e,t){const n=fs(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function Ve(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=Oc(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=Fc(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const i=await s.json(),a=typeof i.avatarUrl=="string"?i.avatarUrl.trim():"";e.chatAvatarUrl=a||null}catch{e.chatAvatarUrl=null}}const pt=Object.freeze(Object.defineProperty({__proto__:null,clearDraft:Si,flushChatQueueForEvent:Ai,handleAbortChat:an,handleSendChat:_i,isChatBusy:qe,isChatStopCommand:ki,refreshChat:rn,refreshChatAvatar:Ve,removeQueuedMessage:Ti,restoreDraft:ne,saveDraft:Y},Symbol.toStringTag,{value:"Module"})),Kc={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},Nc={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};function Ci(e){return new Date(e).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Bc(e,t){const n=Bt(e),s=Je(n.role);if(s==="system")return null;if(s==="tool"){const c=[];for(const h of n.content)if(h.name&&c.push(`**Tool:** ${h.name}`),h.text){const m=h.text.length>2e3?h.text.slice(0,2e3)+`

... (truncated)`:h.text;c.push(m)}return c.length===0?null:`<details>
<summary>Tool result</summary>

${c.join(`

`)}

</details>`}const i=s==="user"||n.role==="User"?"User":t,a=[];for(const c of n.content)if(c.type==="text"&&c.text)a.push(c.text);else if(c.type==="tool_call"&&c.name){const h=c.args?`\`${JSON.stringify(c.args).slice(0,200)}\``:"";a.push(`> **Called tool:** \`${c.name}\` ${h}`)}if(a.length===0)return null;const r=Ci(n.timestamp);return`## ${i}
_${r}_

${a.join(`

`)}`}function Uc(){const e=new Date,t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${s}`}function Wc(e){return e.replace(/[^a-zA-Z0-9_-]/g,"-").replace(/-+/g,"-").slice(0,60)}function qc(e,t,n){if(!e||e.length===0)return;const s=n||"Assistant",i=[];i.push("# Conversation Export"),i.push(`**Session:** \`${t}\`  `),i.push(`**Exported:** ${Ci(Date.now())}  `),i.push(`**Assistant:** ${s}`),i.push("---");for(const m of e){const o=Bc(m,s);o&&i.push(o)}const a=i.join(`

`)+`
`,r=new Blob([a],{type:"text/markdown;charset=utf-8"}),c=URL.createObjectURL(r),h=document.createElement("a");h.href=c,h.download=`session-${Wc(t)}-${Uc()}.md`,document.body.appendChild(h),h.click(),requestAnimationFrame(()=>{document.body.removeChild(h),URL.revokeObjectURL(c)})}function ln(){requestAnimationFrame(()=>{document.querySelector(".session-tab--active")?.scrollIntoView({behavior:"smooth",inline:"nearest",block:"nearest"})})}function Vc(){requestAnimationFrame(()=>{document.querySelector(".chat-compose__textarea")?.focus()})}function st(e){Y(e);const n=`agent:main:webchat-${Xe().slice(0,8)}`;e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,n],sessionKey:n,lastActiveSessionKey:n,tabLastViewed:{...e.settings.tabLastViewed,[n]:Date.now()}}),e.sessionKey=n,e.chatMessage="",e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),H(e,n,!0),K(e),ln(),Vc()}function Rt(e,t){const n=ms(t,e.basePath);return f`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||(s.preventDefault(),e.setTab(t))}}
      title=${Ae(t)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${La(t)}</span>
      <span class="nav-item__text">${Ae(t)}</span>
    </a>
  `}function Pi(e){const t=e.onboarding,n=e.onboarding,s=e.onboarding?!1:e.settings.chatShowThinking,i=e.onboarding?!0:e.settings.chatFocusMode,a=f`
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
      <path d="M12 5v14"></path>
      <path d="M5 12h14"></path>
    </svg>
  `,h=f`
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
        @click=${()=>st(e)}
        title="Start a new session (⌘⇧P)"
        aria-label="New session"
      >
        ${c}
      </button>
      <!-- Session picker (folder dropdown) -->
      <div class="session-picker-container">
        <button
          class="chat-toolbar__btn ${e.sessionPickerOpen?"active":""}"
          @click=${m=>{const p=m.currentTarget.getBoundingClientRect();e.sessionPickerPosition={top:p.bottom+8,right:window.innerWidth-p.right},e.sessionPickerOpen||F(e),e.handleToggleSessionPicker()}}
          title="Open sessions"
          aria-label="Open sessions"
          aria-expanded=${e.sessionPickerOpen}
        >
          ${C.folderOpen}
        </button>
        ${e.sessionPickerOpen?Hc(e):v}
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
          ${h}
        </button>
        ${e.sessionSearchOpen?zc(e):v}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),rn(e)}}
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
        ${C.brain}
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
        ${C.lock}
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
        @click=${()=>{qc(e.chatMessages,e.sessionKey,e.assistantName)}}
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
  `}function jc(e){const t=new Date,n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=new Date(n.getTime()-864e5);return{today:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=n),yesterday:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=s&&new Date(i.updatedAt)<n),older:e.filter(i=>!i.updatedAt||new Date(i.updatedAt)<s)}}let ft=null;function zc(e){if(!e.client||!e.connected)return f`
      <div
        class="session-search-dropdown"
        style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;const t=i=>{const a=i.target.value;e.sessionSearchQuery=a,ft&&clearTimeout(ft),ft=setTimeout(()=>{e.handleSessionSearchQuery(a)},300)},n=i=>{e.sessionSearchOpen=!1,e.sessionSearchQuery="",e.sessionSearchResults=[],Y(e),e.settings.openTabs.includes(i)?(e.sessionKey=i,e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,i],sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.sessionKey=i),ne(e,i),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),H(e,i,!0),K(e).then(()=>{Ye(e),B(e,!0)})},s=i=>{const a=i.label??i.displayName??i.key,r=i.matches.length>0;return f`
      <div class="session-search-result" @click=${()=>n(i.key)}>
        <div class="session-search-result__header">
          <span class="session-search-result__name">${a}</span>
        </div>
        ${r?f`
              <div class="session-search-result__matches">
                ${i.matches.slice(0,2).map(c=>f`
                    <div class="session-search-result__match">
                      <span class="session-search-result__role">${c.role}:</span>
                      <span class="session-search-result__text">${c.text}</span>
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
  `}function Hc(e){const t=(e.sessionPickerSearch??"").toLowerCase().trim();if(!e.client||!e.connected)return f`
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
    `;let n=(e.sessionsResult?.sessions??[]).filter(g=>!e.settings.openTabs.includes(g.key));t&&(n=n.filter(g=>[g.label,g.displayName,g.key].filter(Boolean).some(b=>b.toLowerCase().includes(t))));const s=50,i=n.length,a=n.slice(0,s),r=jc(a),c=g=>{e.sessionPickerOpen=!1,e.sessionPickerSearch="",Y(e),e.settings.openTabs.includes(g)?(e.sessionKey=g,e.applySettings({...e.settings,sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,g],sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}}),e.sessionKey=g),ne(e,g),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),H(e,g,!0),K(e).then(()=>{Ye(e),B(e,!0)})},h=async(g,y)=>{if(g.stopPropagation(),!!window.confirm(`Delete session "${y}"?

Deletes the session entry and archives its transcript.`)&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.filter(A=>A.key!==y)}),e.client&&e.connected))try{await e.client.request("sessions.delete",{key:y,deleteTranscript:!0}),F(e)}catch(A){console.error("Failed to delete session:",A),F(e)}},m=g=>f`
    <div class="session-picker-item" @click=${()=>c(g.key)}>
      <span class="session-picker-item__status ${g.isActive?"active":""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${g.label??g.displayName??le.get(g.key)??g.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${g.updatedAt?f`<span class="session-picker-item__time">${ea(g.updatedAt)}</span>`:v}
        <button
          class="session-picker-item__close"
          @click=${y=>h(y,g.key)}
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
        ${Ge(y,b=>b.key,m)}
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
  `}const Gc=["system","light","dark","lifetrack"];function $i(e){const t=Math.max(0,Gc.indexOf(e.theme)),n=s=>i=>{const r={element:i.currentTarget};(i.clientX||i.clientY)&&(r.pointerClientX=i.clientX,r.pointerClientY=i.clientY),e.setTheme(s,r)};return f`
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
          ${Jc()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${Qc()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${Yc()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="lifetrack"?"active":""}"
          @click=${n("lifetrack")}
          aria-pressed=${e.theme==="lifetrack"}
          aria-label="Lifetrack theme"
          title="Lifetrack"
        >
          ${Xc()}
        </button>
      </div>
    </div>
  `}function Qc(){return f`
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
  `}function Yc(){return f`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function Jc(){return f`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function Xc(){return f`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"></path>
      <path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67L19 15z"></path>
    </svg>
  `}const Z=Object.freeze(Object.defineProperty({__proto__:null,createNewSession:st,renderChatControls:Pi,renderTab:Rt,renderThemeToggle:$i,scrollActiveTabIntoView:ln},Symbol.toStringTag,{value:"Module"})),mt=new Set;function Un(e){if(!(!e.connected||!e.client||!e.settings.chatParallelView))for(const t of e.settings.parallelLanes){const n=t?.trim();if(!n)continue;const i=ce(e.sessionsResult?.sessions,n)?.key??n;if(se.has(n)||se.has(i)||mt.has(i))continue;mt.add(i);const r=e.client;Os(r,i).then(c=>{i!==n&&c.length>0&&se.set(n,c)}).finally(()=>{mt.delete(i),e.applySettings({...e.settings})})}}function Zc(e){e.basePath=fi(),e._urlSettingsApplied||(hi(e),e._urlSettingsApplied=!0),vi(e,!0),mi(e),gi(e),window.addEventListener("popstate",e.popStateHandler),e.keydownHandler=t=>{if(e.tab!=="chat")return;if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="p"){t.preventDefault(),st(e);return}if(!t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.key<"1"||t.key>"9")return;const n=parseInt(t.key,10)-1,s=e.settings.openTabs;if(n>=s.length)return;const i=s[n];i!==e.sessionKey&&(t.preventDefault(),Y(e),e.sessionKey=i,ne(e,i),e.chatLoading=!0,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.loadAssistantIdentity(),H(e,i,!0),K(e).then(()=>{Ue(e)}))},window.addEventListener("keydown",e.keydownHandler),Vt(e),e.tab==="nodes"&&jt(e),e.tab==="logs"&&Ht(e),e.tab==="debug"&&Qt(e)}function ed(e){vo(e)}function td(e){window.removeEventListener("popstate",e.popStateHandler),window.removeEventListener("keydown",e.keydownHandler),e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null),e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null),zt(e),Gt(e),Yt(e),yi(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function ce(e,t){if(!e||!t)return;const n=e.find(r=>r.key===t);if(n)return n;const s=t.split(":"),i=s[s.length-1];if(i&&i.length>=4){const r=e.find(c=>c.key===i||c.key.endsWith(`:${i}`));if(r)return r}const a=t.replace(/^webchat:/,"");if(a!==t){const r=e.find(c=>c.key.endsWith(a)||c.key.endsWith(`:${a}`));if(r)return r}}function nd(e,t){if(!t||t.length===0)return;const n=h=>{const m=h.toLowerCase();return m==="main"||m==="agent:main:main"||m.endsWith(":main")},s=(h,m)=>{const o=h?.sessionId?.trim();if(o)return`session:${o}`;if(h){const g=[h.kind,h.surface,h.subject,h.room,h.space,h.label,h.displayName].map(y=>String(y??"").trim().toLowerCase()).join("|");if(g.replace(/\|/g,"").length>0)return`meta:${g}`}return`key:${m}`};let i=!1;const a=new Map,r=[];for(const h of e.settings.openTabs){const m=h.trim();if(!m){i=!0;continue}if(n(m)){i=!0;continue}const o=ce(t,m),p=o?.key??m;p!==h&&(i=!0);const g=s(o,p);if(a.has(g)){i=!0;continue}a.set(g,p),r.push(p)}const c=r.length!==e.settings.openTabs.length;if(i||c){const h={};for(const[b,A]of Object.entries(e.settings.tabLastViewed)){const R=b.trim();if(!R||typeof A!="number"||!Number.isFinite(A))continue;const U=ce(t,R),P=s(U,U?.key??R),M=a.get(P)??U?.key??R;h[M]=Math.max(h[M]??0,A)}const m=ce(t,e.sessionKey),o=s(m,m?.key??e.sessionKey.trim()),p=a.get(o)??m?.key??(e.sessionKey.trim()||r[0]||"main"),y=p==="main"||p.endsWith(":main")||r.includes(p)?p:r[0]||"main";e.applySettings({...e.settings,openTabs:r,sessionKey:y,lastActiveSessionKey:y,tabLastViewed:h}),e.sessionKey!==y&&(e.sessionKey=y)}}function sd(e,t){if((t.has("sessionsResult")||t.has("settings"))&&e.sessionsResult?.sessions&&nd(e,e.sessionsResult.sessions),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.settings.chatParallelView&&Un(e),t.has("settings")&&e.connected&&e.settings.chatParallelView){const n=t.get("settings"),s=n?!n.chatParallelView:!0,i=!n||n.parallelLanes.some((a,r)=>a!==e.settings.parallelLanes[r]);(s||i)&&Un(e)}if(t.has("sessionPickerOpen")&&(e.sessionPickerOpen?setTimeout(()=>{e.sessionPickerOpen&&(e.sessionPickerClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-picker-container"),a=s.closest(".session-picker-dropdown");!i&&!a&&(e.sessionPickerOpen=!1)},document.addEventListener("click",e.sessionPickerClickOutsideHandler,!0))},0):e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null)),t.has("sessionSearchOpen")&&(e.sessionSearchOpen?setTimeout(()=>{e.sessionSearchOpen&&(e.sessionSearchClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-search-container"),a=s.closest(".session-search-dropdown");!i&&!a&&(e.sessionSearchOpen=!1)},document.addEventListener("click",e.sessionSearchClickOutsideHandler,!0))},0):e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null)),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab==="chat"&&!e.chatLoading&&K(e).then(()=>{Ue(e)}),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab!=="chat"&&Ce(e),e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("sessionKey")||t.has("tab"))){const n=t.has("tab"),s=t.has("sessionKey"),i=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;let a=!1;if(t.has("chatMessages")){const r=e.chatMessages;r[r.length-1]?.role==="user"&&(a=!0)}t.has("chatStream")&&(a=!1),(n||s||i)&&Ye(e),B(e,n||s||i||a||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&ws(e,t.has("tab")||t.has("logsAutoFollow"))}async function Wn(e,t){return!1}async function id(e,t){return null}function qn(e){return e.charAt(0).toUpperCase()||"A"}function Vn(e){if(!e)return"";const t=new Date(e),n=t.getHours(),s=t.getMinutes().toString().padStart(2,"0"),i=n>=12?"PM":"AM";return`${n%12||12}:${s} ${i}`}function ad(e){e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,120)}px`}function xi(e,t=80){return e.scrollHeight-e.scrollTop-e.clientHeight<t}function Ii(e){const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)}const jn=new WeakMap;function od(e){requestAnimationFrame(()=>{const t=document.querySelector(".ally-panel, .ally-inline");if(!t)return;const n=t.querySelector(".ally-panel__messages");if(!n)return;const s=jn.get(n),i=s??{lastMsgCount:0,lastStreamLen:0},a=e.messages.length,r=e.stream?.length??0,c=a!==i.lastMsgCount||r>i.lastStreamLen;jn.set(n,{lastMsgCount:a,lastStreamLen:r}),c&&(!s||xi(n,120))&&Ii(t)})}function rd(e){const t=e.currentTarget,n=t.querySelector(".ally-jump-bottom");n&&n.classList.toggle("ally-jump-bottom--visible",!xi(t))}function Ri(e,t){return e.allyAvatar?f`<img class=${t==="bubble"?"ally-bubble__avatar":"ally-panel__header-avatar"} src=${e.allyAvatar} alt=${e.allyName} />`:t==="header"?f`<span class="ally-panel__header-initial">${qn(e.allyName)}</span>`:f`${qn(e.allyName)}`}function zn(e){if(e.role==="assistant"&&e.content){const t=V(e.content);return f`<div class="ally-msg__content chat-text">${ve(t)}</div>`}return f`<span class="ally-msg__content">${e.content}</span>`}function ld(e,t){return!e.actions||e.actions.length===0?v:f`
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
  `}function cd(e,t,n){if(e.isNotification)return f`
      <div class="ally-msg ally-msg--notification" data-idx=${t}>
        ${zn(e)}
        ${ld(e,n)}
        ${e.timestamp?f`<div class="ally-msg__time">${Vn(e.timestamp)}</div>`:v}
      </div>
    `;const s=e.role==="user"?"ally-msg--user":"ally-msg--assistant";return f`
    <div class="ally-msg ${s}" data-idx=${t}>
      ${zn(e)}
      ${e.timestamp?f`<div class="ally-msg__time">${Vn(e.timestamp)}</div>`:v}
    </div>
  `}function dd(e){if(!e)return v;const t=bs(e);return f`
    <div class="ally-msg ally-msg--streaming">
      <div class="ally-msg__content chat-text">${ve(t)}</div>
    </div>
  `}function ud(e){return e.connected?v:f`<div class="ally-panel__status ally-panel__status--disconnected">Disconnected</div>`}function hd(){return f`
    <div class="ally-msg ally-msg--assistant ally-msg--reading-indicator">
      <span class="chat-reading-indicator__dots">
        <span></span><span></span><span></span>
      </span>
    </div>
  `}function pd(e,t){const n=e.clipboardData?.items;if(!n)return;const s=[];for(const i of Array.from(n)){if(!i.type.startsWith("image/"))continue;const a=i.getAsFile();if(!a)continue;e.preventDefault();const r=new FileReader,c=`paste-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;r.onload=()=>{const h=r.result;t.onAttachmentsChange([...t.attachments,{id:c,dataUrl:h,mimeType:a.type,fileName:a.name||"screenshot.png",status:"ready"}])},r.readAsDataURL(a),s.push({id:c,dataUrl:"",mimeType:a.type,fileName:a.name,status:"reading"})}s.length>0&&t.onAttachmentsChange([...t.attachments,...s])}function fd(e){return e.attachments.length===0?v:f`
    <div class="ally-panel__attachments">
      ${e.attachments.map(t=>f`
          <div class="ally-panel__attachment">
            ${t.dataUrl?f`<img src=${t.dataUrl} alt=${t.fileName??"attachment"} class="ally-panel__attachment-img" />`:f`<span class="ally-panel__attachment-loading">...</span>`}
            <button
              type="button"
              class="ally-panel__attachment-remove"
              title="Remove"
              @click=${()=>e.onAttachmentsChange(e.attachments.filter(n=>n.id!==t.id))}
            >${C.x}</button>
          </div>
        `)}
    </div>
  `}function md(e){const t=e.connected?`Message ${e.allyName}...`:"Reconnecting...",n=e.draft.trim()||e.attachments.length>0;return f`
    ${fd(e)}
    <div class="ally-panel__input">
      <textarea
        class="ally-panel__textarea"
        .value=${e.draft}
        ?disabled=${!e.connected||e.sending}
        placeholder=${t}
        rows="1"
        @input=${s=>{const i=s.target;ad(i),e.onDraftChange(i.value)}}
        @paste=${s=>pd(s,e)}
        @keydown=${s=>{s.key==="Enter"&&(s.isComposing||s.keyCode===229||s.shiftKey||e.connected&&(s.preventDefault(),e.onSend()))}}
      ></textarea>
      <button
        class="ally-panel__send-btn"
        type="button"
        ?disabled=${!e.connected||!n&&!e.sending}
        title="Send"
        @click=${()=>e.onSend()}
      >
        ${C.arrowUp}
      </button>
    </div>
  `}function gd(e){return f`
    <div class="ally-bubble">
      <button
        type="button"
        class="ally-bubble__btn"
        title="Chat with ${e.allyName}"
        aria-label="Open ${e.allyName} chat"
        @click=${()=>e.onToggle()}
      >
        ${Ri(e,"bubble")}
        ${e.isWorking?f`<span class="ally-bubble__working"></span>`:v}
      </button>
      ${e.unreadCount>0?f`<span class="ally-bubble__badge">${e.unreadCount>99?"99+":e.unreadCount}</span>`:v}
    </div>
  `}function Li(e){return od(e),f`
    <div class="ally-panel__header">
      <div class="ally-panel__header-left">
        ${Ri(e,"header")}
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

    ${ud(e)}

    <div class="ally-panel__messages" @scroll=${rd}>
      ${e.messages.length===0&&!e.stream?f`<div class="ally-panel__empty">
            Start a conversation with ${e.allyName}
          </div>`:v}
      ${e.messages.map((t,n)=>cd(t,n,e.onAction))}
      ${e.stream?dd(e.stream):v}
      ${(e.isWorking||e.sending)&&!e.stream?hd():v}
      <button
        type="button"
        class="ally-jump-bottom"
        title="Jump to latest"
        @click=${t=>{const n=t.currentTarget.closest(".ally-panel, .ally-inline");n&&Ii(n)}}
      >${C.chevronDown}</button>
    </div>

    ${md(e)}
  `}function yd(e){return e.open?f`
    <div class="ally-panel">
      ${Li(e)}
    </div>
  `:gd(e)}function vd(e){return e.open?f`
    <div class="ally-inline">
      ${Li(e)}
    </div>
  `:v}function wd(e){return typeof e.content=="string"?e.content:typeof e.text=="string"?e.text:Array.isArray(e.content)?e.content.map(t=>typeof t.text=="string"?t.text:"").join(`
`):""}const bd=["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"];function Sd(e){const t=typeof e.role=="string"?e.role.toLowerCase():"";if(t!=="user"&&t!=="system")return!1;const n=wd(e).trim();if(!n)return!1;let s=n;if((n.includes("<system-context")||n.includes("<godmode-context"))&&(s=n.replace(/<system-context[\s\S]*?<\/system-context>/gi,"").replace(/<godmode-context[\s\S]*?<\/godmode-context>/gi,"").trim(),!s)||s.startsWith("Read HEARTBEAT.md")||s.startsWith("Read CONSCIOUSNESS.md")||s.startsWith("Pre-compaction memory flush")||s.startsWith("pre-compaction memory flush")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(s)||s==="NO_REPLY"||s.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(s)||s.startsWith("# WORKING.md")||s.startsWith("# MISTAKES.md")||/(?:VERIFIED|FIXED|NEW):\s/.test(s)&&/✅|🟡|☑/.test(s)&&s.length>300||/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(s)||/^\[GodMode Context:[^\]]*\]\s*$/.test(s)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(s)||/^##?\s*Persistence Protocol/i.test(s)||/^##?\s*Core (?:Behaviors|Principles)/i.test(s)||/^##?\s*Your Role as \w+/i.test(s)||/^##\s*Your Team\s*\(Agent Roster\)/i.test(s)&&s.indexOf(`

## `)===-1||/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)&&s.length>200||/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(s))return!0;const i=s.toLowerCase();return bd.filter(a=>i.includes(a)).length>=2}const Hn=25*1024*1024,Gn=50*1024*1024,Qn=20;function gt(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:e<1024*1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:`${(e/(1024*1024*1024)).toFixed(1)} GB`}function cn(e,t=0){const n=[],s=[];let i=t;const a=Array.from(e);for(const r of a){if(n.length>=Qn){s.push(`Maximum ${Qn} files allowed per upload`);break}if(r.size>Hn){s.push(`"${r.name}" is too large (${gt(r.size)}). Max ${gt(Hn)}. For larger files, mention the file path instead.`);continue}if(i+r.size>Gn){s.push(`Total upload size exceeds ${gt(Gn)} limit`);break}i+=r.size,n.push(r)}return{validFiles:n,errors:s}}const kd=new Set(["md","markdown","mdx"]),Td=new Set(["htm","html"]),_d=new Set(["avif","bmp","gif","heic","heif","jpeg","jpg","png","svg","svgz","webp"]);function Di(e){const t=e.replaceAll("\\","/").trim();if(!t)return e;const n=t.split("/");return n[n.length-1]||t}function Ad(e){if(!e)return null;const n=e.trim().toLowerCase().split(".").pop()??"";return n?kd.has(n)?"text/markdown":Td.has(n)?"text/html":_d.has(n)?n==="svg"||n==="svgz"?"image/svg+xml":n==="jpg"?"image/jpeg":`image/${n}`:n==="pdf"?"application/pdf":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":null:null}function Ei(e){const t=e.mimeType?.split(";")[0]?.trim().toLowerCase()??"";if(t)return t;const n=e.content?.trim()??"";if(n.startsWith("data:image/")){const s=/^data:(image\/[^;]+);/i.exec(n);return s?.[1]?s[1].toLowerCase():"image/*"}return Ad(e.filePath??null)??"text/markdown"}function Cd(e){if(!e.startsWith("file://"))return null;let t=e.slice(7);return t.startsWith("/~/")&&(t="~"+t.slice(2)),decodeURIComponent(t)}function Pd(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const i=s.getAttribute("href");if(!i)return;const a=Cd(i);a&&(e.preventDefault(),e.stopPropagation(),t(a))}function $d(e){if(e.error)return f`
      <div class="callout danger">${e.error}</div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(!e.content)return f`
      <div class="muted">No content available</div>
    `;const t=Ei(e),n=e.content,s=n.trim();if(t.startsWith("image/"))return s.startsWith("data:image/")?f`
        <div class="sidebar-image">
          <img src=${s} alt=${Di(e.filePath??"Image preview")} />
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
      @load=${r=>{URL.revokeObjectURL(a);const c=r.target;try{const h=c.contentDocument?.documentElement?.scrollHeight;h&&(c.style.height=`${h}px`)}catch{}}}
    ></iframe>`}if(t==="text/markdown"||t==="text/x-markdown"){const i=Da(n);return f`<div
      class="sidebar-markdown"
      @click=${a=>Pd(a,e.onOpenFile)}
    >${ve(V(i))}</div>`}return f`<pre class="sidebar-plain">${n}</pre>`}function xd(e){const t=Ei(e);return t==="text/html"||t==="application/xhtml+xml"}function Id(e){const t=new Blob([e],{type:"text/html"}),n=URL.createObjectURL(t);window.open(n,"_blank","noopener,noreferrer")}function Lt(e){const t=e.title?.trim()||"Tool Output",n=xd(e)&&e.content;return f`
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
                @click=${()=>Id(e.content)}
              >Open in Browser</button>`:v}
          <button @click=${e.onClose} class="btn" title="Close sidebar">
            ${C.x}
          </button>
        </div>
      </div>
      ${Rd(e)}
      <div class="sidebar-content">${$d(e)}</div>
    </div>
  `}function Rd(e){if(e.resource)return f`
      <div class="sidebar-resource-bar">
        <span class="resource-type-badge">${e.resource.type.replace("_"," ")}</span>
        <span style="flex: 1;">${e.resource.title}</span>
        <button
          class="sidebar-pin-btn${e.resource.pinned?" pinned":""}"
          title=${e.resource.pinned?"Unpin":"Pin"}
          @click=${()=>e.onToggleResourcePin?.(e.resource.id,!e.resource.pinned)}
        >${e.resource.pinned?"★":"☆"}</button>
      </div>
    `;if(e.filePath&&e.onSaveAsResource){const t=e.title?.trim()||Di(e.filePath);return f`
      <div class="sidebar-resource-bar">
        <button
          class="sidebar-save-resource-btn"
          @click=${()=>e.onSaveAsResource(e.filePath,t)}
        >Save as Resource</button>
      </div>
    `}return v}var Ld=Object.defineProperty,Dd=Object.getOwnPropertyDescriptor,$e=(e,t,n,s)=>{for(var i=s>1?void 0:s?Dd(t,n):t,a=e.length-1,r;a>=0;a--)(r=e[a])&&(i=(s?r(t,n,i):r(i))||i);return s&&i&&Ld(t,n,i),i};let he=class extends us{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.direction="horizontal",this.isDragging=!1,this.startPos=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startPos=this.direction==="vertical"?e.clientY:e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=this.direction==="vertical",s=n?t.getBoundingClientRect().height:t.getBoundingClientRect().width,r=((n?e.clientY:e.clientX)-this.startPos)/s;let c=this.startRatio+r;c=Math.max(this.minRatio,Math.min(this.maxRatio,c)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:c},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return f``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};he.styles=Pa`
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
  `;$e([Qe({type:Number})],he.prototype,"splitRatio",2);$e([Qe({type:Number})],he.prototype,"minRatio",2);$e([Qe({type:Number})],he.prototype,"maxRatio",2);$e([Qe({type:String})],he.prototype,"direction",2);he=$e([hs("resizable-divider")],he);const Ed=5e3;function Yn(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function Md(e){const t=e.sessions?.sessions?.find(i=>i.key===e.sessionKey);if(!t)return null;const n=t.totalTokens??0,s=t.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return s<=0?null:n/s}function Od(e){const t=Md(e);if(t===null)return v;const n=Math.round(t*100),s=n>=90?"danger":n>=70?"warn":"ok",i=e.sessions?.sessions?.find(o=>o.key===e.sessionKey),a=i?.totalTokens??0,r=i?.contextTokens??e.sessions?.defaults?.contextTokens??2e5,c=n>=90?"Soul + identity only":n>=70?"P0 + P1 active":"Full context",h=n>=90?f`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--danger">
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
          ${a.toLocaleString()} / ${r.toLocaleString()} tokens
        </span>
        ${h}
        <span class="chat-context-badge__tier-list">${m}</span>
        <span class="chat-context-badge__tooltip-action">Click to compact</span>
      </span>
    </button>
  `}function Fd(e){return e?e.active?f`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${C.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<Ed?f`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${C.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `:v:v}function dn(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function Kd(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy")}function Nd(e,t){e.preventDefault(),e.stopPropagation(),t.classList.add("chat--drag-over")}function Bd(e,t){e.preventDefault(),e.stopPropagation();const n=t.getBoundingClientRect();(e.clientX<=n.left||e.clientX>=n.right||e.clientY<=n.top||e.clientY>=n.bottom)&&t.classList.remove("chat--drag-over")}function Ud(e,t){e.preventDefault(),e.stopPropagation(),e.currentTarget.classList.remove("chat--drag-over");const s=e.dataTransfer?.files;if(!s||s.length===0||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((o,p)=>o+(p.dataUrl?.length??0)*.75,0),{validFiles:r,errors:c}=cn(s,a);for(const o of c)t.showToast?.(o,"error");if(r.length===0)return;const h=[];let m=r.length;for(const o of r){const p=new FileReader;p.addEventListener("load",()=>{const g=p.result;h.push({id:dn(),dataUrl:g,mimeType:o.type||"application/octet-stream",fileName:o.name}),m--,m===0&&t.onAttachmentsChange?.([...i,...h])}),p.addEventListener("error",()=>{t.showToast?.(`Failed to read "${o.name}"`,"error"),m--,m===0&&h.length>0&&t.onAttachmentsChange?.([...i,...h])}),p.readAsDataURL(o)}}function Wd(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let o=0;o<n.length;o++){const p=n[o];if(p.type.startsWith("image/")){const g=p.getAsFile();g&&s.push(g)}}if(s.length===0)return;e.preventDefault();const i=t.attachments??[],a=i.reduce((o,p)=>o+(p.dataUrl?.length??0)*.75,0),{validFiles:r,errors:c}=cn(s,a);for(const o of c)t.showToast?.(o,"error");if(r.length===0)return;const h=[];let m=r.length;for(const o of r){const p=new FileReader;p.addEventListener("load",()=>{const g=p.result;h.push({id:dn(),dataUrl:g,mimeType:o.type,fileName:o.name||"pasted-image"}),m--,m===0&&t.onAttachmentsChange?.([...i,...h])}),p.addEventListener("error",()=>{t.showToast?.("Failed to read pasted image","error"),m--,m===0&&h.length>0&&t.onAttachmentsChange?.([...i,...h])}),p.readAsDataURL(o)}}function qd(e,t){const n=e.target,s=n.files;if(!s||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((o,p)=>o+(p.dataUrl?.length??0)*.75,0),{validFiles:r,errors:c}=cn(s,a);for(const o of c)t.showToast?.(o,"error");if(r.length===0){n.value="";return}const h=[];let m=r.length;for(const o of r){const p=new FileReader;p.addEventListener("load",()=>{const g=p.result;h.push({id:dn(),dataUrl:g,mimeType:o.type||"application/octet-stream",fileName:o.name}),m--,m===0&&t.onAttachmentsChange?.([...i,...h])}),p.addEventListener("error",()=>{t.showToast?.(`Failed to read "${o.name}"`,"error"),m--,m===0&&h.length>0&&t.onAttachmentsChange?.([...i,...h])}),p.readAsDataURL(o)}n.value=""}function Vd(e){const t=e.attachments??[];return t.length===0?v:f`
    <div class="chat-attachments">
      ${t.map(n=>{const s=n.mimeType.startsWith("image/"),i=n.fileName||"file",a=i.length>40?i.slice(0,37)+"...":i;return f`
          <div class="chat-attachment ${s?"":"chat-attachment--file"}">
            ${s?f`<img src=${n.dataUrl} alt="Attachment preview" class="chat-attachment__img" />`:f`<div class="chat-attachment__file">
                  ${C.fileText}
                  <span class="chat-attachment__filename" title=${i}>${a}</span>
                </div>`}
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const r=(e.attachments??[]).filter(c=>c.id!==n.id);e.onAttachmentsChange?.(r)}}
            >
              ${C.x}
            </button>
          </div>
        `})}
    </div>
  `}function jd(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function zd(e){const t=e.href;if(t){if(e.target==="_blank"){window.open(t,"_blank","noopener,noreferrer");return}window.location.assign(t)}}function Hd(e){const t=e.trim();return!t||t.includes(`
`)?null:t.startsWith("/")||t.startsWith("~/")||t.startsWith("./")||t.startsWith("../")||/^[a-z]:[\\/]/i.test(t)||/^[^:\s]+\/[^\s]+$/.test(t)&&/\.[a-z0-9]{1,12}$/i.test(t)||/^[^\s/\\:*?"<>|]+\.[a-z0-9]{1,12}$/i.test(t)&&t.length<=100?t:null}async function Gd(e,t){const n=e.target,s=n instanceof Element?n:n instanceof Node?n.parentElement:null;if(!s||!t.onMessageLinkClick||!jd(e))return;const i=s.closest("a");if(i instanceof HTMLAnchorElement){if(i.hasAttribute("download"))return;const h=i.getAttribute("href");if(!h)return;if(t.onOpenProof)try{const o=h.match(/(?:proofeditor\.ai|127\.0\.0\.1:\d+|localhost:\d+)\/d\/([a-zA-Z0-9_-]+)/);if(o){e.preventDefault(),t.onOpenProof(o[1]);return}}catch{}try{const o=new URL(h,window.location.href);if(/^https?:$/.test(o.protocol)&&o.origin!==window.location.origin){e.preventDefault(),window.open(o.href,"_blank","noopener,noreferrer");return}}catch{}e.preventDefault(),await t.onMessageLinkClick(h)||zd(i);return}const a=s.closest("code");if(!(a instanceof HTMLElement))return;const r=(a.textContent??"").trim();if(/^https?:\/\/\S+$/i.test(r)){e.preventDefault(),window.open(r,"_blank","noopener,noreferrer");return}if(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(\/\S*)?$/i.test(r)){e.preventDefault(),window.open(`https://${r}`,"_blank","noopener,noreferrer");return}const c=Hd(r);c&&(e.preventDefault(),await t.onMessageLinkClick(c))}const Qd={html_report:"📊",plan:"📋",analysis:"🔍",code:"💻",doc:"📝",data:"📦",image:"🖼️",script:"⚙️"};function Yd(e){const t=e.sessionResources;if(!t||t.length===0)return v;if(e.sessionResourcesCollapsed)return f`
      <div class="session-resources-strip">
        <div class="session-resources-header">
          <span class="session-resources-label">Resources (${t.length})</span>
          <button class="session-resources-toggle" @click=${e.onToggleSessionResources}>▲</button>
        </div>
      </div>
    `;const n=t.slice(0,5);return f`
    <div class="session-resources-strip">
      <div class="session-resources-header">
        <span class="session-resources-label">Resources (${t.length})</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          ${t.length>5?f`<button class="session-resources-view-all" @click=${e.onViewAllResources}>View all</button>`:v}
          <button class="session-resources-toggle" @click=${e.onToggleSessionResources}>▼</button>
        </div>
      </div>
      <div class="session-resources-cards">
        ${n.map(s=>f`
            <button
              class="session-resource-chip"
              @click=${()=>e.onSessionResourceClick?.(s)}
            >
              <span>${Qd[s.type]||"📄"}</span>
              <span>${s.title}</span>
            </button>
          `)}
      </div>
    </div>
  `}function Jd(e){const t=e.connected,n=e.sending||e.stream!==null,s=!!(e.canAbort&&e.onAbort),a=e.sessions?.sessions?.find(y=>y.key===e.sessionKey)?.reasoningLevel??"off",r=e.showThinking&&a!=="off",c={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},h=(e.attachments?.length??0)>0,m=e.connected?h?"Add a message or paste more images...":"Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",o=e.splitRatio??.6,p=!!(e.sidebarOpen&&e.onCloseSidebar),g=f`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
      @click=${y=>{Gd(y,e)}}
    >
      ${e.loading?f`
              <div class="muted">Loading chat…</div>
            `:v}
      ${Ge(tu(e),y=>y.key,y=>{try{if(y.kind==="reading-indicator")return Or(c,e.currentToolInfo);if(y.kind==="stream")return Fr(y.text,y.startedAt,e.onOpenSidebar,c,e.currentToolInfo);if(y.kind==="compaction-summary")return Ur(y.message);if(y.kind==="group"){const b=e.resolveImageUrl?(A,R)=>e.resolveImageUrl(A,R):void 0;return Kr(y,{onOpenSidebar:e.onOpenSidebar,onOpenFile:e.onOpenFile,onOpenProof:e.onOpenProof,onPushToDrive:e.onPushToDrive,onImageClick:e.onImageClick,resolveImageUrl:b,showReasoning:r,assistantName:e.assistantName,assistantAvatar:c.avatar,userName:e.userName,userAvatar:e.userAvatar})}return v}catch(b){return console.error("[chat] item render error:",b,y.key),v}})}
    </div>
  `;return f`
    <section 
      class="card chat"
      @dragover=${Kd}
      @dragenter=${y=>Nd(y,y.currentTarget)}
      @dragleave=${y=>Bd(y,y.currentTarget)}
      @drop=${y=>Ud(y,e)}
    >
      ${e.privateMode?f`<div class="callout callout--private" aria-live="polite">
            <span style="margin-right:6px">🔒</span>
            <strong>Private Session</strong> — Nothing from this conversation will be saved to memory or vault.
          </div>`:v}

      ${e.disabledReason?f`<div class="callout">${e.disabledReason}</div>`:v}

      ${e.error?f`<div class="callout danger">${e.error}</div>`:v}

      ${Fd(e.compactionStatus)}

      ${e.pendingRetry&&e.onRetry?f`
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
                ${e.onClearRetry?f`
                      <button
                        class="btn btn--ghost btn--sm"
                        type="button"
                        @click=${e.onClearRetry}
                      >
                        Dismiss
                      </button>
                    `:v}
              </div>
            </div>
          `:v}

      ${e.focusMode?f`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${C.x}
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
                      ${Lt({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                    </div>
                    <resizable-divider
                      direction="vertical"
                      .splitRatio=${.6}
                      .minRatio=${.2}
                      .maxRatio=${.8}
                    ></resizable-divider>
                    <div class="chat-sidebar-bottom">
                      ${vd(e.allyProps)}
                    </div>
                  </div>
                `:f`
                  <div class="chat-sidebar">
                    ${Lt({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
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
                        ${C.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:v}

      ${Yd(e)}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${y=>qd(y,e)}
          />
          ${Vd(e)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${$a(y=>y&&Yn(y))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${y=>{if(y.key!=="Enter"||y.isComposing||y.keyCode===229||y.shiftKey||!e.connected)return;y.preventDefault();const b=y.ctrlKey||y.metaKey;t&&e.onSend(b)}}
              @input=${y=>{const b=y.target;Yn(b),e.onDraftChange(b.value)}}
              @paste=${y=>Wd(y,e)}
              placeholder=${m}
            ></textarea>

            <div class="chat-compose__actions">
              ${Od(e)}

              <button
                class="chat-compose__toolbar-btn"
                type="button"
                title="Attach files"
                ?disabled=${!e.connected}
                @click=${()=>{document.getElementById("chat-file-input")?.click()}}
              >
                ${C.paperclip}
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
                    ${C.arrowUp}
                  </button>
                `}
            </div>
          </div>
        </div>
      </div>
    </section>
  `}const Jn=200;function Xd(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const i=Bt(s.message),a=Je(i.role),r=i.timestamp||Date.now();!n||n.role!==a?(n&&t.push(n),n={kind:"group",key:`group:${a}:${s.key}`,role:a,messages:[{message:s.message,key:s.key}],timestamp:r,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function Zd(e){const n=e.content;if(!Array.isArray(n))return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const i=s;if(i.type==="image")return!0;if(Array.isArray(i.content)){for(const a of i.content)if(!(typeof a!="object"||a===null)&&a.type==="image")return!0}}return!1}function eu(e){const n=e.content;if(!Array.isArray(n)||n.length===0)return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const i=s,a=typeof i.type=="string"?i.type:"";if(a!=="toolCall"&&a!=="tool_use"&&a!=="thinking")return!1}return!0}function tu(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],i=Math.max(0,n.length-Jn);i>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${Jn} messages (${i} hidden).`,timestamp:Date.now()}});for(let a=i;a<n.length;a++){const r=n[a];if(r._chatIdx=a,Wr(r)){t.push({kind:"compaction-summary",key:`compaction:${a}`,message:r});continue}if(Sd(r))continue;const c=Bt(r);!e.showThinking&&c.role.toLowerCase()==="toolresult"&&!Zd(r)||!e.showThinking&&c.role.toLowerCase()==="assistant"&&eu(r)||t.push({kind:"message",key:Xn(r,a),message:r})}if(e.showThinking)for(let a=0;a<s.length;a++)t.push({kind:"message",key:Xn(s[a],a+n.length),message:s[a]});if(e.stream!==null){const a=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:a,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:a})}else if(e.isWorking){const a=`working:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}else if(e.sending||e.canAbort){const a=`sending:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}return Xd(t)}function Xn(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const i=typeof n.id=="string"?n.id:"";if(i)return`msg:${i}`;const a=typeof n.messageId=="string"?n.messageId:"";if(a)return`msg:${a}`;const r=typeof n.timestamp=="number"?n.timestamp:null,c=typeof n.role=="string"?n.role:"unknown";if(r!=null){const h=typeof n.content=="string"?n.content.slice(0,32):"";return`msg:${c}:${r}:${h||t}`}return`msg:${c}:${t}`}function nu(e){const{pendingGatewayUrl:t}=e;return t?f`
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
  `:v}function su(e){if(!e.gatewayRestartPending)return v;const t=e.sessionsResult?.sessions?.length??0,n=t===1?"1 active session":`${t} active sessions`;return f`
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
  `}function Mi(){return{open:!1,images:[],currentIndex:0}}function iu(e,t,n){return{open:!0,images:t,currentIndex:n}}function au(){return Mi()}function ou(e,t){const n=e.currentIndex+t;return n<0||n>=e.images.length?e:{...e,currentIndex:n}}const ru=f`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,lu=f`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,cu=f`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;function du(e,t){if(!e.open||e.images.length===0)return v;const n=e.images[e.currentIndex];if(!n)return v;const s=e.images.length>1,i=e.currentIndex>0,a=e.currentIndex<e.images.length-1;return f`
    <div
      class="lightbox-overlay"
      @click=${r=>{r.target.classList.contains("lightbox-overlay")&&t.onClose()}}
      @keydown=${r=>{r.key==="Escape"&&t.onClose(),r.key==="ArrowRight"&&a&&t.onNav(1),r.key==="ArrowLeft"&&i&&t.onNav(-1)}}
      tabindex="0"
    >
      <button class="lightbox-close" @click=${t.onClose} aria-label="Close image viewer">
        ${ru}
      </button>

      ${s&&i?f`<button class="lightbox-nav lightbox-nav--prev" @click=${()=>t.onNav(-1)} aria-label="Previous image">${lu}</button>`:v}

      <img
        class="lightbox-image"
        src=${n.url}
        alt=${n.alt??"Image preview"}
        @click=${r=>r.stopPropagation()}
        @error=${r=>{r.target.classList.add("lightbox-image--broken")}}
      />

      ${s&&a?f`<button class="lightbox-nav lightbox-nav--next" @click=${()=>t.onNav(1)} aria-label="Next image">${cu}</button>`:v}

      ${s?f`<div class="lightbox-counter">${e.currentIndex+1} / ${e.images.length}</div>`:v}
    </div>
  `}const uu=e=>{switch(e){case"success":return f`
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
      `}};function hu({toasts:e,onDismiss:t}){return e.length===0?null:f`
    <div class="toast-container">
      ${Ge(e,n=>n.id,n=>f`
          <div class="toast toast--${n.type}">
            <div class="toast__icon">${uu(n.type)}</div>
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
  `}const Zn=[{key:"focusPulse.enabled",icon:"☀️",name:"Focus Pulse",description:"Morning priority ritual + persistent focus widget in the topbar. Silent 30-min pulse checks compare your activity against your plan.",default:!0}];function pu(e,t){return f`
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
  `}function fu(e,t,n){const i=!!(t?.[e.key]??e.default);return f`
    <div class="options-card card">
      <div class="options-card-header">
        <div class="options-card-info">
          <span class="options-card-icon">${e.icon}</span>
          <span class="options-card-name">${e.name}</span>
        </div>
        ${pu(i,()=>n(e.key,!i))}
      </div>
      <div class="options-card-description">${e.description}</div>
    </div>
  `}function mu(e){const{connected:t,loading:n,options:s,onToggle:i,onOpenWizard:a}=e;return t?n&&!s?f`
      <section class="tab-body options-section">
        <div class="options-loading">Loading options...</div>
      </section>
    `:f`
    <section class="tab-body options-section">
      <div class="options-grid">
        ${Zn.map(r=>fu(r,s,i))}
      </div>
      ${Zn.length===0?f`<div class="options-empty">
            No configurable features yet.
          </div>`:v}
      ${a?f`
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
          `:v}
    </section>
  `:f`
      <section class="tab-body options-section">
        <div class="options-empty">Not connected to gateway.</div>
      </section>
    `}const gu={"gm-work":()=>w(()=>import("./work-tab-CVTt6d4A.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url),"gm-today":()=>w(()=>import("./today-tab-Ba-06UM3.js"),__vite__mapDeps([6,1,3,4,5,2]),import.meta.url),"gm-second-brain":()=>w(()=>import("./second-brain-tab-B2ltWxUr.js"),__vite__mapDeps([7,1,4,3,5,8]),import.meta.url),"gm-dashboards":()=>w(()=>import("./dashboards-tab-DBH51KPR.js"),__vite__mapDeps([9,1,4,3,5,10]),import.meta.url)},es=new Set;function De(e){es.has(e)||(es.add(e),gu[e]?.())}const yu=/^data:/i,vu=/^https?:\/\//i;function wu(e){const t=e.agentsList?.agents??[],s=vs(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",a=t.find(c=>c.id===s)?.identity,r=a?.avatarUrl??a?.avatar;if(r)return yu.test(r)||vu.test(r)?r:a?.avatarUrl}function ts(e){const t=e.trim();if(!t)return t;const n=t.split(/\s+/);if(n.length>=2&&n.length%2===0){const c=n.length/2,h=n.slice(0,c).join(" "),m=n.slice(c).join(" ");if(h.toLowerCase()===m.toLowerCase())return h}const s=t.replace(/\s+/g," ").toLowerCase(),i=Math.floor(s.length/2),a=s.slice(0,i).trim(),r=s.slice(i).trim();return a&&a===r?t.slice(0,Math.ceil(t.length/2)).trim():t}function Dt(e,t){const n=t?.sessionId?.trim();return n?`session:${n}`:`key:${e.trim().toLowerCase()}`}function ns(e){if(e===x)return!0;const t=e.toLowerCase();return!!(t==="agent:main:main"||t.endsWith(":main"))}function bu(e){const t=e.sessionsResult?.sessions,n=[...new Set(e.settings.openTabs.map(c=>c.trim()).filter(Boolean))].filter(c=>!ns(c)),s=ce(t,e.sessionKey),i=Dt(e.sessionKey,s),a=new Map;for(const c of n){const h=ce(t,c),m=Dt(c,h);if(!a.has(m)){a.set(m,c);continue}c===e.sessionKey&&a.set(m,c)}const r=[...a.values()];if(r.length===0){const c=e.sessionKey.trim()||"main";ns(c)||r.push(c)}return{tabKeys:r,activeIdentity:i}}function Su(e){if(e.wizardActive&&e.wizardState)return Ea(e.wizardState,{onStepChange:o=>{e.handleWizardStepChange?.(o)},onAnswerChange:(o,p)=>{e.handleWizardAnswerChange?.(o,p)},onPreview:()=>{e.handleWizardPreview?.()},onGenerate:()=>{e.handleWizardGenerate?.()},onClose:()=>{e.handleWizardClose?.()},onFileToggle:(o,p)=>{e.handleWizardFileToggle?.(o,p)},onConfigToggle:(o,p)=>{e.handleWizardConfigToggle?.(o,p)}});e.presenceEntries.length;const t=e.sessionsResult?.count??null;e.cronStatus?.nextWakeAtMs;const n=e.connected?null:"Disconnected from gateway.",s=e.tab==="chat",i=s&&(e.settings.chatFocusMode||e.onboarding),a=e.onboarding?!1:e.settings.chatShowThinking,r=wu(e),c=e.chatAvatarUrl??r??null,{tabKeys:h,activeIdentity:m}=bu(e);return f`
    <div class="shell ${s?"shell--chat":""} ${i?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
            aria-label="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">${C.menu}</span>
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
                  <span class="pill__icon">${C.zap}</span>
                  <span>Update Ready</span>
                </a>`:v}
          ${e.updateStatus?.pendingDeploy?f`<button
                  class="pill pill--deploy"
                  @click=${o=>{o.preventDefault(),e.handleDeployPanelToggle()}}
                  title="${e.updateStatus.pendingDeploy.summary??"pending fix"}"
                >
                  <span class="pill__icon">${C.rotateCcw}</span>
                  <span>Deploy Ready</span>
                </button>`:v}
          <button
            class="pill pill--support"
            @click=${o=>{o.preventDefault(),e.handleOpenSupportChat()}}
            title="Open support chat"
          >
            <span class="pill__icon">${C.headphones}</span>
            <span>Support</span>
          </button>
          <div class="pill ${e.reconnecting?"reconnecting":""}">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>Gateway</span>
            <span class="mono">${e.reconnecting?`Reconnecting${e.reconnectAttempt>1?` (${e.reconnectAttempt})`:""}...`:e.connected?"Connected":"Offline"}</span>
          </div>
          ${$i(e)}
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

        ${Ma.map(o=>{const p=e.settings.navGroupsCollapsed[o.label]??!1,g=o.tabs.some(b=>b===e.tab),y=!o.label||o.tabs.length===1&&Ae(o.tabs[0])===o.label;return f`
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
                ${!o.label&&e.godmodeOptions!=null&&!e.godmodeOptions?.["onboarding.hidden"]?f`
                        <a
                          class="nav-item ${e.tab==="onboarding"?"active":""}"
                          href="#"
                          @click=${b=>{b.preventDefault(),e.handleWizardOpen?.()}}
                          title="Power up your GodMode ally."
                        >
                          <span class="nav-item__emoji" aria-hidden="true">\u{1F9ED}</span>
                          <span class="nav-item__text">Setup</span>
                        </a>
                      `:v}
                ${o.tabs.map(b=>Rt(e,b))}
              </div>
            </div>
          `})}
        ${Oa.map(o=>{const p=e.settings.navGroupsCollapsed[o.label]??!0,g=o.tabs.some(y=>y===e.tab);return f`
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
                ${o.tabs.map(y=>Rt(e,y))}
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
              <span class="nav-item__icon" aria-hidden="true">${C.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${s?"content--chat":""}">
        <section class="content-header">
          <div>
            ${e.tab!=="chat"&&e.tab!=="onboarding"?f`
              <div class="page-title">${Ae(e.tab)}</div>
              <div class="page-sub">${Fa(e.tab)}</div>
            `:e.tab==="chat"?f`
              <div class="session-tabs">
                <div class="session-tab session-tab--pinned ${e.sessionKey===x?"session-tab--active":""}"
                     @click=${()=>{e.sessionKey!==x&&(Y(e),e.sessionKey=x,e.allyUnread=0,ne(e,x),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:x,lastActiveSessionKey:x,tabLastViewed:{...e.settings.tabLastViewed,[x]:Date.now()}}),e.loadAssistantIdentity(),K(e).then(()=>{e.resetChatScroll(),B(e,!0)}),e.loadSessionResources(),F(e))}}
                     title="${e.assistantName||"Ally"}">
                  ${e.assistantAvatar?f`<img src="${e.assistantAvatar}" class="session-tab-avatar" width="16" height="16" style="border-radius:50%;vertical-align:middle;margin-right:4px;" />`:f`<span class="session-tab-icon" style="margin-right:4px;">&#x2726;</span>`}
                  ${e.assistantName||"Ally"}
                  ${(e.allyUnread??0)>0?f`<span class="ally-tab-badge" style="margin-left:4px;font-size:10px;background:var(--accent-color,#5b73e8);color:#fff;border-radius:50%;padding:1px 5px;">${e.allyUnread}</span>`:v}
                </div>
                ${Ge(h,o=>o,(o,p)=>{const g=ce(e.sessionsResult?.sessions,o),y=Dt(o,g)===m,A=(()=>{if(g?.label||g?.displayName)return ts(g.label??g.displayName);const S=le.get(o);if(S)return ts(S);if(o==="agent:main:support")return"Support";if(o.includes("webchat")){const _=o.match(/webchat[:-](\d+)/);return _?`Chat ${_[1]}`:"Chat"}if(o.includes("main"))return"MAIN";const T=o.split(/[:-]/);return T[T.length-1]||o})(),R=e.workingSessions.has(o),U=e.settings.tabLastViewed[o]??0,P=g?.updatedAt??0,M=!y&&!R&&P>U,X=e.editingTabKey===o;return f`
                      <div
                        class="session-tab ${y?"session-tab--active":""} ${R?"session-tab--working":""} ${M?"session-tab--ready":""} ${X?"session-tab--editing":""}"
                        draggable="true"
                        @dragstart=${S=>{if(e.editingTabKey===o){S.preventDefault();return}S.dataTransfer.effectAllowed="move",S.dataTransfer.setData("text/session-key",o),S.dataTransfer.setData("text/plain",p.toString()),S.target.classList.add("dragging")}}
                        @click=${()=>{if(!X){if(y){e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}});return}Y(e),e.sessionKey=o,ne(e,o),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:o,lastActiveSessionKey:o,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}}),e.loadAssistantIdentity(),H(e,o,!0),K(e).then(()=>{e.resetChatScroll(),B(e,!0)}),e.loadSessionResources(),F(e),ln()}}}
                        @dragend=${S=>{S.target.classList.remove("dragging")}}
                        @dragover=${S=>{S.preventDefault(),S.dataTransfer.dropEffect="move";const T=S.currentTarget,_=T.getBoundingClientRect(),$=_.left+_.width/2;S.clientX<$?(T.classList.add("drop-left"),T.classList.remove("drop-right")):(T.classList.add("drop-right"),T.classList.remove("drop-left"))}}
                        @dragleave=${S=>{S.currentTarget.classList.remove("drop-left","drop-right")}}
                        @drop=${S=>{S.preventDefault();const T=parseInt(S.dataTransfer.getData("text/plain")),_=p;if(T===_)return;const $=e.settings.openTabs.slice(),[k]=$.splice(T,1);$.splice(_,0,k),e.applySettings({...e.settings,openTabs:$}),S.currentTarget.classList.remove("drop-left","drop-right")}}
                        title=${A}
                      >
                        ${X?f`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${g?.label??g?.displayName??""}
                            @click=${S=>S.stopPropagation()}
                            @dblclick=${S=>S.stopPropagation()}
                            @blur=${async S=>{const T=S.target;if(T._committedByEnter)return;const _=T.value.trim();e.editingTabKey=null;const $=g?.label??g?.displayName??"";if(_!==$){_?le.set(o,_):le.delete(o),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(L=>L.key===o?{...L,label:_||void 0,displayName:_||void 0}:L)});const k=await at(e,o,{label:_||null,displayName:_||null});F(e);const I=k.ok&&k.canonicalKey!==o?k.canonicalKey:o,ie=o===e.sessionKey;e.applySettings({...e.settings,...k.ok&&k.canonicalKey!==o&&e.settings.openTabs.includes(o)?{openTabs:e.settings.openTabs.map(L=>L===o?k.canonicalKey:L)}:{},tabLastViewed:{...e.settings.tabLastViewed,[I]:Date.now()},...ie&&k.ok&&k.canonicalKey!==o?{sessionKey:k.canonicalKey,lastActiveSessionKey:k.canonicalKey}:{}}),ie&&k.ok&&k.canonicalKey!==o&&(e.sessionKey=k.canonicalKey,H(e,k.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}})}}
                            @keydown=${async S=>{if(S.key==="Enter"){S.preventDefault();const T=S.target;T._committedByEnter=!0;const _=T.value.trim();e.editingTabKey=null;const $=g?.label??g?.displayName??"";if(_!==$){_?le.set(o,_):le.delete(o),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(L=>L.key===o?{...L,label:_||void 0,displayName:_||void 0}:L)});const k=await at(e,o,{label:_||null,displayName:_||null});F(e);const I=k.ok&&k.canonicalKey!==o?k.canonicalKey:o,ie=o===e.sessionKey;e.applySettings({...e.settings,...k.ok&&k.canonicalKey!==o&&e.settings.openTabs.includes(o)?{openTabs:e.settings.openTabs.map(L=>L===o?k.canonicalKey:L)}:{},tabLastViewed:{...e.settings.tabLastViewed,[I]:Date.now()},...ie&&k.ok&&k.canonicalKey!==o?{sessionKey:k.canonicalKey,lastActiveSessionKey:k.canonicalKey}:{}}),ie&&k.ok&&k.canonicalKey!==o&&(e.sessionKey=k.canonicalKey,H(e,k.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}})}else S.key==="Escape"&&(S.preventDefault(),e.editingTabKey=null)}}
                          />
                        `:(()=>{let S=null;return f`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${T=>{T.stopPropagation(),S&&clearTimeout(S),S=setTimeout(()=>{S=null,e.editingTabKey!==o&&(o===e.sessionKey?e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}}):(Y(e),e.sessionKey=o,e.chatPrivateMode=!!e.privateSessions?.has(o),ne(e,o),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:o,lastActiveSessionKey:o,tabLastViewed:{...e.settings.tabLastViewed,[o]:Date.now()}}),e.loadAssistantIdentity(),H(e,o,!0),K(e).then(()=>{e.resetChatScroll(),B(e,!0)}),e.loadSessionResources(),F(e)))},250)}}
                            @dblclick=${T=>{T.preventDefault(),T.stopPropagation(),S&&(clearTimeout(S),S=null),e.editingTabKey=o;const _=T.target.closest(".session-tab"),$=k=>{const I=k.target;_&&!_.contains(I)&&(e.editingTabKey=null,document.removeEventListener("mousedown",$,!0))};document.addEventListener("mousedown",$,!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const k=_?.querySelector(".session-tab__name-input");k&&(k.focus(),k.select())})})}}
                          >${A}</span>
                        `})()}
                        ${e.privateSessions?.has(o)?(()=>{const S=e.privateSessions.get(o),T=Math.max(0,S-Date.now()),_=Math.floor(T/36e5),$=Math.floor(T%36e5/6e4),k=_>0?`${_}h ${$}m`:`${$}m`;return f`
                                  <span class="session-tab__private" title="Private session — expires in ${k}" style="font-size: 9px; margin-left: 3px; color: #f59e0b; white-space: nowrap;"
                                    >🔒 ${k}</span
                                  >
                                `})():v}
                        ${R?f`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `:v}
                        ${M?f`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `:v}
                        ${f`
                          <button
                            class="session-tab__close"
                            @click=${S=>{if(S.stopPropagation(),e.privateSessions?.has(o)){e._destroyPrivateSession(o);return}const T=e.settings.openTabs.filter(k=>k!==o),_=o===e.sessionKey,$=T[0]||x;e.applySettings({...e.settings,openTabs:T,..._?{sessionKey:$,lastActiveSessionKey:$}:{}}),_&&(e.sessionKey=$,e.sessionResources=[],H(e,$,!0),K(e).then(()=>{e.resetChatScroll(),B(e,!0)}),e.loadSessionResources())}}
                            title=${e.privateSessions?.has(o)?"Destroy private session":"Close tab"}
                          >×</button>
                        `}
                      </div>
                    `})}
              `:v}
          </div>
          <div class="page-meta">
            ${e.reconnecting?f`<div class="pill warning reconnecting">
                  <span class="reconnect-spinner"></span>
                  Reconnecting${e.reconnectAttempt>1?` (attempt ${e.reconnectAttempt})`:""}...
                </div>`:e.lastError?f`<div class="pill ${e.lastError.startsWith("✓")?"success":"danger"}">${e.lastError}</div>`:v}
            ${s?Pi(e):v}
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
                    <p>Use the onboarding wizard to get started.</p>
                    <button class="retry-button" @click=${()=>e.handleWizardOpen?.()}>Open Wizard</button>
                  </div>
                </div>
              </div>`:v}

        ${e.tab==="workspaces"?(De("gm-work"),f`<gm-work></gm-work>`):v}

        ${e.tab==="today"||e.tab==="my-day"?(De("gm-today"),f`<gm-today
                @today-start-task=${o=>{const p=o.detail.taskId;e.setTab("chat"),e.setChatMessage(`Let's work on task ${p}. Pull up the details and let's discuss an approach.`)}}
                @today-open-file=${o=>{e.handleOpenFile(o.detail.path)}}
                @today-decision-open-chat=${o=>{const p=o.detail.item;e.setTab("chat");const g=p?.title??o.detail.id;e.setChatMessage(`Let's discuss the agent result for: "${g}". What are your thoughts on the output?`)}}
                @today-inbox-open-chat=${o=>{const p=o.detail.item;if(p?.coworkSessionId)St.emit("chat-navigate",{sessionKey:`agent:prosper:${p.coworkSessionId}`,tab:"chat"});else if(p?.sessionId)St.emit("chat-navigate",{sessionKey:p.sessionId,tab:"chat"});else{e.setTab("chat");const g=p?.title??o.detail.itemId;e.setChatMessage(`Let's review the inbox item: "${g}". Can you summarize the key points and what actions I should take?`)}}}
                @today-open-proof=${o=>{e.handleOpenProofDoc(o.detail.slug)}}
              ></gm-today>`):v}

        ${e.tab==="channels"?Ka({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:o=>G(e,o),onWhatsAppStart:o=>e.handleWhatsAppStart(o),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(o,p)=>xe(e,o,p),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(o,p)=>e.handleNostrProfileEdit(o,p),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(o,p)=>e.handleNostrProfileFieldChange(o,p),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):v}

        ${e.tab==="instances"?Na({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>Mt(e)}):v}

        ${e.tab==="sessions"?Ba({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,archivedSessions:e.archivedSessions,archivedSessionsLoading:e.archivedSessionsLoading,archivedSessionsExpanded:e.archivedSessionsExpanded,onFiltersChange:o=>{e.sessionsFilterActive=o.activeMinutes,e.sessionsFilterLimit=o.limit,e.sessionsIncludeGlobal=o.includeGlobal,e.sessionsIncludeUnknown=o.includeUnknown},onRefresh:()=>{F(e),wt(e)},onPatch:async(o,p)=>{const g=await at(e,o,p);if(g.ok&&g.canonicalKey!==o&&e.settings.openTabs.includes(o)){const y=e.settings.openTabs.map(A=>A===o?g.canonicalKey:A),b=o===e.sessionKey;e.applySettings({...e.settings,openTabs:y,tabLastViewed:{...e.settings.tabLastViewed,[g.canonicalKey]:e.settings.tabLastViewed[o]??Date.now()},...b?{sessionKey:g.canonicalKey,lastActiveSessionKey:g.canonicalKey}:{}}),b&&(e.sessionKey=g.canonicalKey,H(e,g.canonicalKey,!0))}},onDelete:o=>ia(e,o),onArchive:o=>sa(e,o),onUnarchive:o=>na(e,o),onToggleArchived:()=>{e.archivedSessionsExpanded=!e.archivedSessionsExpanded,e.archivedSessionsExpanded&&e.archivedSessions.length===0&&wt(e)},onAutoArchive:()=>ta(e)}):v}

        ${e.tab==="cron"?Ua({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(o=>o.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:o=>e.cronForm={...e.cronForm,...o},onRefresh:()=>e.loadCron(),onAdd:()=>ca(e),onToggle:(o,p)=>la(e,o,p),onRun:o=>ra(e,o),onRemove:o=>oa(e,o),onLoadRuns:o=>aa(e,o)}):v}

        ${e.tab==="skills"?Wa({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,subTab:e.skillsSubTab,godmodeSkills:e.godmodeSkills??null,godmodeSkillsLoading:e.godmodeSkillsLoading??!1,expandedSkills:e.expandedSkills??new Set,onFilterChange:o=>e.skillsFilter=o,onRefresh:()=>{ls(e,{clearMessages:!0}),bt(e)},onToggle:(o,p)=>pa(e,o,p),onEdit:(o,p)=>ha(e,o,p),onSaveKey:o=>ua(e,o),onInstall:(o,p,g)=>da(e,o,p,g),onSubTabChange:o=>{e.skillsSubTab=o,o==="godmode"&&!e.godmodeSkills&&bt(e),o==="clawhub"&&e.clawhubExploreItems},onToggleExpand:o=>{const p=new Set(e.expandedSkills);p.has(o)?p.delete(o):p.add(o),e.expandedSkills=p},clawhub:{loading:e.clawhubLoading,error:e.clawhubError,query:e.clawhubQuery,results:e.clawhubResults,exploreItems:e.clawhubExploreItems,exploreSort:e.clawhubExploreSort,detailSlug:e.clawhubDetailSlug,detail:e.clawhubDetail,importing:e.clawhubImporting,message:e.clawhubMessage,onSearch:o=>{e.clawhubQuery=o},onExplore:o=>void 0,onDetail:o=>void 0,onCloseDetail:()=>void 0,onImport:o=>Wn(),onImportAndPersonalize:async o=>{if(!await Wn())return;const g=await id();g&&(en(e,"chat"),st(e),e.chatMessage=g)}}}):v}

        ${e.tab==="agents"?qa({loading:e.rosterLoading,error:e.rosterError,roster:e.rosterData??[],filter:e.rosterFilter??"",expandedAgents:e.expandedAgents??new Set,onFilterChange:o=>e.rosterFilter=o,onRefresh:()=>fa(e),onToggleExpand:o=>{const p=new Set(e.expandedAgents);p.has(o)?p.delete(o):p.add(o),e.expandedAgents=p}}):v}

        ${e.tab==="nodes"?Va({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>je(e),onDevicesRefresh:()=>ze(e),onDeviceApprove:o=>Aa(e,o),onDeviceReject:o=>_a(e,o),onDeviceRotate:(o,p,g)=>Ta(e,{deviceId:o,role:p,scopes:g}),onDeviceRevoke:(o,p)=>ka(e,{deviceId:o,role:p}),onLoadConfig:()=>de(e),onLoadExecApprovals:()=>{const o=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return cs(e,o)},onBindDefault:o=>{o?xe(e,["tools","exec","node"],o):pn(e,["tools","exec","node"])},onBindAgent:(o,p)=>{const g=["agents","list",o,"tools","exec","node"];p?xe(e,g,p):pn(e,g)},onSaveBindings:()=>vt(e),onExecApprovalsTargetChange:(o,p)=>{e.execApprovalsTarget=o,e.execApprovalsTargetNodeId=p,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:o=>{e.execApprovalsSelectedAgent=o},onExecApprovalsPatch:(o,p)=>ya(e,o,p),onExecApprovalsRemove:o=>ga(e,o),onSaveExecApprovals:()=>{const o=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return ma(e,o)}}):v}

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

        ${e.tab==="chat"?Jd({basePath:e.basePath,sessionKey:e.sessionKey,onSessionKeyChange:o=>{Y(e),e.sessionKey=o,ne(e,o),e.chatLoading=!0,e.chatMessages=[],e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:o,lastActiveSessionKey:o}),e.loadAssistantIdentity(),K(e).then(()=>{e.resetChatScroll(),B(e,!0)}),Ve(e),e.loadSessionResources(),Ue(e)},thinkingLevel:e.chatThinkingLevel,showThinking:a,loading:e.chatLoading,sending:e.chatSending,sendingSessionKey:e.chatSendingSessionKey,compactionStatus:e.compactionStatus,assistantAvatarUrl:c,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:n,error:e.lastError,sessions:e.sessionsResult,focusMode:i,onRefresh:()=>(e.resetToolStream(),e.loadSessionResources(),Ue(e),Promise.all([K(e),Ve(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:o=>e.handleChatScroll(o),onDraftChange:o=>e.chatMessage=o,attachments:e.chatAttachments,onAttachmentsChange:o=>e.chatAttachments=o,showToast:(o,p)=>e.showToast(o,p),onSend:o=>e.handleSendChat(void 0,{queue:o}),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onCompact:()=>{e.handleCompactChat()},pendingRetry:e.pendingRetry,onRetry:()=>{e.handleRetryMessage()},onClearRetry:()=>e.handleClearRetry(),onQueueRemove:o=>e.removeQueuedMessage(o),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,sidebarMimeType:e.sidebarMimeType,sidebarFilePath:e.sidebarFilePath,sidebarTitle:e.sidebarTitle,sidebarMode:e.sidebarMode,sidebarProofSlug:e.sidebarProofSlug,sidebarProofUrl:e.sidebarProofUrl,sidebarProofHtml:e.sidebarProofHtml,splitRatio:e.splitRatio,onOpenSidebar:(o,p)=>e.handleOpenSidebar(o,p),onMessageLinkClick:o=>e.handleOpenMessageFileLink(o),onCloseSidebar:()=>e.handleCloseSidebar(),onOpenProof:o=>{e.handleOpenProofDoc(o)},onOpenFile:o=>e.handleOpenFile(o),onSplitRatioChange:o=>e.handleSplitRatioChange(o),onPushToDrive:(o,p)=>e.handlePushToDrive(o,p),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker(),onImageClick:(o,p,g)=>e.handleImageClick(o,p,g),resolveImageUrl:(o,p)=>Tl(e.sessionKey,o,p),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,userName:e.userName,userAvatar:e.userAvatar,currentToolName:e.currentToolName,currentToolInfo:e.currentToolInfo,privateMode:e.chatPrivateMode,onTogglePrivateMode:()=>e.handlePrivateModeToggle(),isWorking:e.workingSessions.has(e.sessionKey),showScrollButton:!e.chatUserNearBottom,showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>{const o=document.querySelector(".chat-thread");o&&(o.scrollTo({top:o.scrollHeight,behavior:"smooth"}),e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1)},allyPanelOpen:e.allyPanelOpen??!1,allyProps:e.allyPanelOpen?{allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:!0,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:0,connected:e.connected,compact:!0,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:o=>e.handleAllyDraftChange(o),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:o=>e.handleAllyAttachmentsChange(o),onAction:(o,p,g,y)=>e.handleAllyAction(o,p,g,y)}:null,sessionResources:e.sessionResources,sessionResourcesCollapsed:e.sessionResourcesCollapsed,onToggleSessionResources:()=>e.handleToggleSessionResources(),onSessionResourceClick:o=>e.handleSessionResourceClick(o),onViewAllResources:()=>e.handleViewAllResources()}):v}

        ${e.tab==="options"?mu({connected:e.connected,loading:e.godmodeOptionsLoading,options:e.godmodeOptions,onToggle:(o,p)=>e.handleOptionToggle(o,p),onOpenWizard:e.handleWizardOpen?()=>e.handleWizardOpen?.():void 0}):v}

        ${e.tab==="guardrails"?ja({connected:e.connected,loading:e.guardrailsLoading,data:e.guardrailsData,showAddForm:e.guardrailsShowAddForm,onToggle:(o,p)=>e.handleGuardrailToggle(o,p),onThresholdChange:(o,p,g)=>e.handleGuardrailThresholdChange(o,p,g),onCustomToggle:(o,p)=>e.handleCustomGuardrailToggle(o,p),onCustomDelete:o=>e.handleCustomGuardrailDelete(o),onToggleAddForm:()=>e.handleToggleGuardrailAddForm(),onOpenAllyChat:o=>{e.handleAllyToggle(),o&&e.handleAllyDraftChange(o)}}):v}

        ${e.tab==="trust"?za({connected:e.connected,loading:e.trustTrackerLoading,data:e.trustTrackerData,onAddWorkflow:o=>e.handleTrustAddWorkflow(o),onRemoveWorkflow:o=>e.handleTrustRemoveWorkflow(o),onRefresh:()=>e.handleTrustLoad(),guardrailsData:e.guardrailsData,consciousnessStatus:e.consciousnessStatus,sessionsCount:t,gatewayUptimeMs:e.hello?.snapshot?.uptimeMs??null,onDailyRate:(o,p)=>e.handleDailyRate(o,p),updateStatus:e.updateStatus?{openclawUpdateAvailable:e.updateStatus.openclawUpdateAvailable,pluginUpdateAvailable:e.updateStatus.pluginUpdateAvailable,openclawVersion:e.updateStatus.openclawVersion,pluginVersion:e.updateStatus.pluginVersion,openclawLatest:e.updateStatus.openclawLatest,pluginLatest:e.updateStatus.pluginLatest}:null}):v}

        ${e.tab==="second-brain"?(De("gm-second-brain"),f`<gm-second-brain></gm-second-brain>`):v}

        ${e.tab==="dashboards"?(De("gm-dashboards"),f`<gm-dashboards></gm-dashboards>`):v}

        ${e.tab==="config"?Ha({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:o=>{e.configRaw=o},onFormModeChange:o=>e.configFormMode=o,onFormPatch:(o,p)=>xe(e,o,p),onSearchChange:o=>e.configSearchQuery=o,onSectionChange:o=>{e.configActiveSection=o,e.configActiveSubsection=null},onSubsectionChange:o=>e.configActiveSubsection=o,onReload:()=>de(e),onSave:()=>vt(e),onApply:()=>ba(e),onUpdate:()=>wa(e),userName:e.userName||"",userAvatar:e.userAvatar,onUserProfileUpdate:(o,p)=>e.handleUpdateUserProfile(o,p),onModelSwitch:(o,p)=>va(e,o,p)}):v}

        ${e.tab==="debug"?Ga({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:o=>e.debugCallMethod=o,onCallParamsChange:o=>e.debugCallParams=o,onRefresh:()=>He(e),onCall:()=>Sa(e)}):v}

        ${e.tab==="logs"?Qa({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:o=>e.logsFilterText=o,onLevelToggle:(o,p)=>{e.logsLevelFilters={...e.logsLevelFilters,[o]:p}},onToggleAutoFollow:o=>e.logsAutoFollow=o,onRefresh:()=>Et(e,{reset:!0}),onExport:(o,p)=>e.exportLogs(o,p),onScroll:o=>e.handleLogsScroll(o)}):v}
      </main>
      ${e.tab!=="chat"?yd({allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:e.allyPanelOpen??!1,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:e.allyUnread??0,connected:e.connected,compact:!1,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:o=>e.handleAllyDraftChange(o),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:o=>e.handleAllyAttachmentsChange(o),onAction:(o,p,g,y)=>e.handleAllyAction(o,p,g,y)}):v}
      ${Ya(e)}
      ${nu(e)}
      ${su(e)}
      ${e.sidebarOpen&&e.tab!=="chat"?f`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${()=>e.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${Lt({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:()=>e.handleCloseSidebar(),onViewRawText:()=>{e.sidebarContent&&e.handleOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath,title:e.sidebarTitle})},onOpenFile:o=>e.handleOpenFile(o),onPushToDrive:(o,p)=>e.handlePushToDrive(o,p),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker()})}
              </div>
            </div>
          `:v}
      ${hu({toasts:e.toasts,onDismiss:o=>e.dismissToast(o)})}
      ${du(e.lightbox,{onClose:()=>e.handleLightboxClose(),onNav:o=>e.handleLightboxNav(o)})}
    </div>
  `}async function ku(e){}async function Tu(e){}async function _u(e,t){}async function Au(e){}async function Cu(e){}async function Pu(e){}async function un(e){if(!(!e.client||!e.connected)){e.trustTrackerLoading=!0;try{const[t,n]=await Promise.all([e.client.request("trust.dashboard",{}),e.client.request("trust.history",{limit:50})]);e.trustTrackerData={workflows:t.workflows,summaries:t.summaries,ratings:n.ratings,total:n.total,overallScore:t.overallScore,totalRatings:t.totalRatings,totalUses:t.totalUses,todayRating:t.todayRating??null,dailyAverage:t.dailyAverage??null,dailyStreak:t.dailyStreak??0,recentDaily:t.recentDaily??[]}}catch{e.trustTrackerData=null}finally{e.trustTrackerLoading=!1}}}async function Oi(e,t){if(!(!e.client||!e.connected))try{await e.client.request("trust.workflows.set",{workflows:t}),e.showToast("Workflows updated","success",2e3),await un(e)}catch(n){e.showToast("Failed to update workflows","error"),console.error("[TrustTracker] setWorkflows error:",n)}}async function $u(e,t){const n=e.trustTrackerData?.workflows??[];if(n.length>=5){e.showToast("Maximum 5 workflows allowed","error");return}if(n.includes(t.trim())){e.showToast("Workflow already tracked","error");return}await Oi(e,[...n,t.trim()])}async function xu(e,t){const n=e.trustTrackerData?.workflows??[];await Oi(e,n.filter(s=>s!==t))}async function Iu(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("trust.dailyRate",{rating:t,...n?{note:n}:{}}),e.showToast(`Rated ${t}/10 today`,"success",2e3),await un(e)}catch(s){e.showToast("Failed to submit daily rating","error"),console.error("[TrustTracker] dailyRate error:",s)}}const Ru=6e4,ss=15,is=new Set;let Ke=null;async function as(e){if(!(!e.client||!e.connected))try{const t=new Date,n=new Date(t.getTime()+ss*6e4+6e4),s=await e.client.request("calendar.events.range",{startDate:t.toISOString(),endDate:n.toISOString()});for(const i of s.events??[]){if(is.has(i.id))continue;const a=new Date(i.startTime),r=Math.round((a.getTime()-t.getTime())/6e4);if(r>0&&r<=ss){is.add(i.id);const c=a.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),h=i.location?` @ ${i.location}`:"",m=`${i.title} starts in ${r} min (${c})${h}`;e.showToast(m,"warning",0)}}}catch(t){console.warn("[MeetingNotify] Poll error:",t)}}function Lu(e){Fi(),as(e),Ke=setInterval(()=>{as(e)},Ru)}function Fi(){Ke&&(clearInterval(Ke),Ke=null)}let Du=0;function Eu(e,t="info",n=3e3,s){return{id:`toast-${Date.now()}-${Du++}`,message:e,type:t,duration:n,createdAt:Date.now(),action:s}}function Mu(e,t){return e.filter(n=>n.id!==t)}function Ou(e,t){return[...e,t]}var Fu=Object.defineProperty,Ku=Object.getOwnPropertyDescriptor,d=(e,t,n,s)=>{for(var i=s>1?void 0:s?Ku(t,n):t,a=e.length-1,r;a>=0;a--)(r=e[a])&&(i=(s?r(t,n,i):r(i))||i);return s&&i&&Fu(t,n,i),i};function yt(){return Vr()}function Ee(){return zr()}function Nu(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}function Bu(e,t){let n=e.trim();if(!n)return null;if(n.startsWith("Read HEARTBEAT.md")||n.startsWith("Read CONSCIOUSNESS.md")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(n)||n==="NO_REPLY"||n.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(n)||n.startsWith("# WORKING.md")||n.startsWith("# MISTAKES.md"))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/(?:VERIFIED|FIXED|NEW):\s/.test(n)&&/✅|🟡|☑/.test(n)&&n.length>300)return console.debug("[Ally] Filtered message (verification dump):",t,n.substring(0,100)),null;if(/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(n))return console.debug("[Ally] Filtered message (system block):",t,n.substring(0,100)),null;if(/^\[GodMode Context:[^\]]*\]\s*$/.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(n=n.replace(/^(?:HEARTBEAT_OK|CONSCIOUSNESS_OK)\s*/i,"").trim(),n=n.replace(/^Deep work window is yours\.\s*/i,"").trim(),!n)return null;if(/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(n)&&n.length>200||/^##\s*Your Team\s*\(Agent Roster\)/i.test(n)&&n.indexOf(`

## `)===-1)return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/^##?\s*Persistence Protocol/i.test(n)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(n)||/^##?\s*Core (?:Behaviors|Principles)/i.test(n)||/^##?\s*Your Role as \w+/i.test(n))return console.debug("[Ally] Filtered message (persona leak):",t,n.substring(0,100)),null;const s=n.toLowerCase();if(["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"].filter(r=>s.includes(r)).length>=2)return console.debug("[Ally] Filtered message (multi-signal system leak):",t,n.substring(0,100)),null;if(/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;const a=n.match(/\b[\w.-]+\.(?:json\b|db\b|html\b|log\b|flag\b|jsonl\b|bak\b|css\b|js\b|ts\b|md\b|txt\b)/gi);return a&&a.length>=8&&a.join(" ").length>n.length*.4?(console.debug("[Ally] Filtered message (file listing dump):",t,n.substring(0,100)),null):n}const os=new Set(["chat","today","workspaces","work","data","overview","channels","instances","sessions","cron","skills","nodes","config","debug","logs","my-day"]),Uu=["path","filePath","file","workspacePath"];let l=class extends us{constructor(){super(...arguments),this._ctx=Za(),this.settings=Tc(),this.password="",this.tab="chat",this.onboarding=Nu(),this.connected=!1,this.reconnecting=!1,this.reconnectAttempt=0,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.sessionPickerClickOutsideHandler=null,this.sessionSearchClickOutsideHandler=null,this.assistantName=yt().name,this.assistantAvatar=yt().avatar,this.assistantAgentId=yt().agentId??null,this.userName=Ee().name,this.userAvatar=Ee().avatar,this.sessionKey=this.settings.sessionKey,this.sessionPickerOpen=!1,this.sessionPickerPosition=null,this.sessionPickerSearch="",this.sessionSearchOpen=!1,this.sessionSearchPosition=null,this.sessionSearchQuery="",this.sessionSearchResults=[],this.sessionSearchLoading=!1,this.profilePopoverOpen=!1,this.profileEditName="",this.profileEditAvatar="",this.editingTabKey=null,this.chatLoading=!1,this.chatSending=!1,this.chatSendingSessionKey=null,this.chatMessage="",this.chatDrafts={},this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.currentToolName=null,this.currentToolInfo=null,this.workingSessions=new Set,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.pendingRetry=null,this.autoRetryAfterCompact=!1,this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.splitRatio=this.settings.splitRatio,this.lightbox=Mi(),this.driveAccounts=[],this.showDrivePicker=!1,this.driveUploading=!1,this.updateStatus=null,this.updateLoading=!1,this.updateError=null,this.updateLastChecked=null,this.updatePollInterval=null,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.gatewayRestartPending=!1,this.gatewayRestartBusy=!1,this.deployPanelOpen=!1,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.archivedSessions=[],this.archivedSessionsLoading=!1,this.archivedSessionsExpanded=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...Nc},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.workspaceNeedsSetup=!1,this.onboardingPhase=0,this.onboardingData=null,this.onboardingActive=!1,this.wizardActive=!1,this.wizardState=null,this.showSetupTab=!1,this.setupCapabilities=null,this.setupCapabilitiesLoading=!1,this.setupQuickDone=!1,this.onboardingIntegrations=null,this.onboardingCoreProgress=null,this.onboardingExpandedCard=null,this.onboardingLoadingGuide=null,this.onboardingActiveGuide=null,this.onboardingTestingId=null,this.onboardingTestResult=null,this.onboardingConfigValues={},this.onboardingProgress=null,this.selectedWorkspace=null,this.workspacesSearchQuery="",this.workspaceItemSearchQuery="",this.workspacesLoading=!1,this.workspacesCreateLoading=!1,this.workspacesError=null,this.workspaceExpandedFolders=new Set,this.editingTaskId=null,this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null,this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=z(),this.todayViewMode="brief",this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.todayEditingTaskId=null,this.todayShowCompleted=!1,this.allyPanelOpen=!1,this.allyMessages=[],this.allyStream=null,this.allyDraft="",this.allyUnread=0,this.allySending=!1,this.allyWorking=!1,this.allyAttachments=[],this.todayQueueResults=[],this.inboxItems=[],this.inboxLoading=!1,this.inboxCount=0,this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,this.inboxSortOrder="newest",this.trustSummary=null,this.chatPrivateMode=!1,this.privateSessions=new Map,this._privateSessionTimer=null,this.dynamicSlots={},this.workLoading=!1,this.workError=null,this.workExpandedProjects=new Set,this.workProjectFiles={},this.workDetailLoading=new Set,this.workResourcesLoading=!1,this.workResourceFilter="all",this.sessionResources=[],this.sessionResourcesCollapsed=!1,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.skillsSubTab="godmode",this.godmodeSkills=null,this.godmodeSkillsLoading=!1,this.expandedSkills=new Set,this.rosterData=[],this.rosterLoading=!1,this.rosterError=null,this.rosterFilter="",this.expandedAgents=new Set,this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...Kc},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.toasts=[],this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatIsAutoScrolling=!1,this.chatNewMessagesBelow=!1,this.consciousnessStatus="idle",this.focusPulseData=null,this.trustTrackerData=null,this.trustTrackerLoading=!1,this.guardrailsData=null,this.guardrailsLoading=!1,this.guardrailsShowAddForm=!1,this.missionControlData=null,this.missionControlLoading=!1,this.missionControlError=null,this.missionControlFullControl=(()=>{try{return localStorage.getItem("godmode.mc.fullControl")==="1"}catch{return!0}})(),this.missionControlPollInterval=null,this.godmodeOptions=null,this.godmodeOptionsLoading=!1,this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardPreviousSessionKey=null,this.dashboardChatOpen=!1,this.dashboardCategoryFilter=null,this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainVaultHealth=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=!1,this.basePath="",this.popStateHandler=()=>wi(this),this.keydownHandler=()=>{},this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null,this._eventBusUnsubs=[]}createRenderRoot(){return this}connectedCallback(){if(super.connectedCallback(),this.settings.userName)this.userName=this.settings.userName;else{const t=Ee();this.userName=t.name}if(this.settings.userAvatar)this.userAvatar=this.settings.userAvatar;else{const t=Ee();this.userAvatar=t.avatar}Zc(this);const e=z();this.todaySelectedDate!==e&&(this.todaySelectedDate=e),Lu(this),this._restorePrivateSessions(),this._eventBusUnsubs.push(St.on("chat-navigate",t=>{t.sessionKey&&t.sessionKey!==this.sessionKey&&(t.sessionKey==="new"?this.sessionKey=`webchat-${Date.now()}`:this.sessionKey=t.sessionKey),t.tab==="chat"&&this.setTab("chat"),t.message&&(this.chatMessage=t.message)}))}firstUpdated(){ed(this)}disconnectedCallback(){Fi(),this._stopPrivateSessionTimer();for(const e of this._eventBusUnsubs)e();this._eventBusUnsubs=[],td(this),super.disconnectedCallback()}updated(e){sd(this,e),this._syncContext()}_syncContext(){const e=this._ctx;e.connected===this.connected&&e.reconnecting===this.reconnecting&&e.sessionKey===this.sessionKey&&e.assistantName===this.assistantName&&e.assistantAvatar===this.assistantAvatar&&e.userName===this.userName&&e.userAvatar===this.userAvatar&&e.theme===this.theme&&e.themeResolved===this.themeResolved&&e.settings===this.settings&&e.basePath===this.basePath&&e.gateway===this.client||(this._ctx={connected:this.connected,reconnecting:this.reconnecting,sessionKey:this.sessionKey,assistantName:this.assistantName,assistantAvatar:this.assistantAvatar,userName:this.userName,userAvatar:this.userAvatar,theme:this.theme,themeResolved:this.themeResolved,settings:this.settings,basePath:this.basePath,gateway:this.client,send:(t,n)=>this.client?.request(t,n)??Promise.reject(new Error("Not connected")),setTab:t=>this.setTab(t),addToast:(t,n)=>this.showToast(t,n??"info"),openSidebar:t=>this.handleOpenSidebar(t.content,{title:t.title,mimeType:t.mimeType,filePath:t.filePath}),closeSidebar:()=>this.handleCloseSidebar()})}connect(){Vt(this)}handleChatScroll(e){mo(this,e)}handleLogsScroll(e){go(this,e)}exportLogs(e,t){yo(e,t)}resetToolStream(){Ot(this),this.sessionResources=[]}resetChatScroll(){Ye(this)}async loadAssistantIdentity(){await Ds(this)}applySettings(e){J(this,e)}setTab(e){en(this,e)}setTheme(e,t){pi(this,e,t)}async loadOverview(){await sn(this)}async loadCron(){await nt(this)}async handleAbortChat(){await an(this)}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}async loadFocusPulse(){await ku()}async handleFocusPulseStartMorning(){await Tu(),this.setTab("chat");const e="Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan.",{createNewSession:t}=await w(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>Z);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e)}async handleFocusPulseSetFocus(e){await _u()}async handleFocusPulseComplete(){await Au()}async handleFocusPulsePulseCheck(){await Cu()}async handleFocusPulseEndDay(){await Pu()}async handleTrustLoad(){await un(this)}async handleTrustAddWorkflow(e){await $u(this,e)}async handleTrustRemoveWorkflow(e){await xu(this,e)}async handleDailyRate(e,t){await Iu(this,e,t)}async handleGuardrailsLoad(){const{loadGuardrails:e}=await w(async()=>{const{loadGuardrails:t}=await import("./ctrl-settings-CzLVBbt9.js").then(n=>n.af);return{loadGuardrails:t}},[],import.meta.url);await e(this)}async handleGuardrailToggle(e,t){const{toggleGuardrail:n}=await w(async()=>{const{toggleGuardrail:s}=await import("./ctrl-settings-CzLVBbt9.js").then(i=>i.af);return{toggleGuardrail:s}},[],import.meta.url);await n(this,e,t)}async handleGuardrailThresholdChange(e,t,n){const{updateGuardrailThreshold:s}=await w(async()=>{const{updateGuardrailThreshold:i}=await import("./ctrl-settings-CzLVBbt9.js").then(a=>a.af);return{updateGuardrailThreshold:i}},[],import.meta.url);await s(this,e,t,n)}async handleCustomGuardrailToggle(e,t){const{toggleCustomGuardrail:n}=await w(async()=>{const{toggleCustomGuardrail:s}=await import("./ctrl-settings-CzLVBbt9.js").then(i=>i.af);return{toggleCustomGuardrail:s}},[],import.meta.url);await n(this,e,t)}async handleCustomGuardrailDelete(e){const{deleteCustomGuardrail:t}=await w(async()=>{const{deleteCustomGuardrail:n}=await import("./ctrl-settings-CzLVBbt9.js").then(s=>s.af);return{deleteCustomGuardrail:n}},[],import.meta.url);await t(this,e)}async handleCustomGuardrailAdd(e){const{addCustomGuardrailFromUI:t}=await w(async()=>{const{addCustomGuardrailFromUI:n}=await import("./ctrl-settings-CzLVBbt9.js").then(s=>s.af);return{addCustomGuardrailFromUI:n}},[],import.meta.url);await t(this,e),this.guardrailsShowAddForm=!1}handleToggleGuardrailAddForm(){this.guardrailsShowAddForm=!this.guardrailsShowAddForm}handleMissionControlToggleFullControl(){this.missionControlFullControl=!this.missionControlFullControl;try{localStorage.setItem("godmode.mc.fullControl",this.missionControlFullControl?"1":"0")}catch{}}async handleMissionControlRefresh(){const{loadMissionControl:e}=await w(async()=>{const{loadMissionControl:t}=await import("./ctrl-settings-CzLVBbt9.js").then(n=>n.ae);return{loadMissionControl:t}},[],import.meta.url);await e(this)}async handleMissionControlCancelTask(e){const{cancelCodingTask:t}=await w(async()=>{const{cancelCodingTask:n}=await import("./ctrl-settings-CzLVBbt9.js").then(s=>s.ae);return{cancelCodingTask:n}},[],import.meta.url);await t(this,e)}async handleMissionControlApproveItem(e){const{approveCodingTask:t,approveQueueItem:n}=await w(async()=>{const{approveCodingTask:i,approveQueueItem:a}=await import("./ctrl-settings-CzLVBbt9.js").then(r=>r.ae);return{approveCodingTask:i,approveQueueItem:a}},[],import.meta.url);await t(this,e)||await n(this,e)}async handleMissionControlRetryItem(e){const{retryQueueItem:t}=await w(async()=>{const{retryQueueItem:n}=await import("./ctrl-settings-CzLVBbt9.js").then(s=>s.ae);return{retryQueueItem:n}},[],import.meta.url);await t(this,e)}async handleMissionControlViewDetail(e){const{loadAgentDetail:t}=await w(async()=>{const{loadAgentDetail:s}=await import("./ctrl-settings-CzLVBbt9.js").then(i=>i.ae);return{loadAgentDetail:s}},[],import.meta.url),n=await t(this,e);this.handleOpenSidebar(n.content,{mimeType:n.mimeType,title:n.title})}async handleMissionControlOpenSession(e){const t=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:t,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:n}=await w(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>Q);return{loadChatHistory:s}},void 0,import.meta.url);await n(this),this.loadSessionResources()}async handleMissionControlOpenTaskSession(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e});if(t?.sessionId){if(t.task?.title){const{autoTitleCache:n}=await w(async()=>{const{autoTitleCache:s}=await import("./ctrl-settings-CzLVBbt9.js").then(i=>i.ad);return{autoTitleCache:s}},[],import.meta.url);n.set(t.sessionId,t.task.title)}await this.handleMissionControlOpenSession(t.sessionId),t.queueOutput&&this.chatMessages.length===0&&await this.seedSessionWithAgentOutput(t.task?.title??"task",t.queueOutput,t.agentPrompt??void 0)}}catch(t){console.error("[MissionControl] Failed to open task session:",t),this.showToast("Failed to open session","error")}}async handleMissionControlStartQueueItem(e){await this.handleMissionControlOpenTaskSession(e)}async handleSwarmSelectProject(e){const{selectSwarmProject:t}=await w(async()=>{const{selectSwarmProject:n}=await import("./ctrl-settings-CzLVBbt9.js").then(s=>s.ae);return{selectSwarmProject:n}},[],import.meta.url);await t(this,e)}async handleSwarmSteer(e,t,n){const{steerSwarmAgent:s}=await w(async()=>{const{steerSwarmAgent:i}=await import("./ctrl-settings-CzLVBbt9.js").then(a=>a.ae);return{steerSwarmAgent:i}},[],import.meta.url);await s(this,e,t,n)}async handleSwarmViewProofDoc(e){return this.handleOpenProofDoc(e)}async handleSwarmViewRunLog(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("godmode.delegation.runLog",{queueItemId:e});t?.content?this.handleOpenSidebar(t.content,{mimeType:t.mimeType??"text/markdown",title:t.title??"Agent Logs"}):this.showToast("No logs available","error")}catch{this.showToast("Failed to load agent logs","error")}}async handleMissionControlViewTaskFiles(e){try{const n=(await this.client?.request("queue.taskFiles",{itemId:e}))?.files??[];if(n.length===0){this.showToast("No files found for this task","info");return}const i=`## Task Files

${n.map(a=>`- **${a.name}** (${a.type}, ${(a.size/1024).toFixed(1)} KB)
  \`${a.path}\``).join(`

`)}`;this.handleOpenSidebar(i,{title:"Task Files"})}catch(t){console.error("Failed to load task files:",t),this.showToast("Failed to load task files","error")}}async handleAllyAction(e,t,n,s){if(e==="navigate"&&t)this.setTab(t);else if(e==="rpc"&&n&&this.client)try{await this.client.request(n,s??{}),this.showToast("Done","success",2e3)}catch(i){console.error("[Ally] Action RPC failed:",i),this.showToast("Action failed","error")}}handleAllyToggle(){this.allyPanelOpen=!this.allyPanelOpen,this.allyPanelOpen&&(this.allyUnread=0,this._loadAllyHistory().then(()=>{this._scrollAllyToBottom(),requestAnimationFrame(()=>this._scrollAllyToBottom())}))}handleAllyDraftChange(e){this.allyDraft=e}handleAllyAttachmentsChange(e){this.allyAttachments=e}async handleAllySend(){const e=this.allyDraft.trim(),t=this.allyAttachments;if(!e&&t.length===0||this.allySending)return;const n=wo(this);let s=e?`${n}

${e}`:n;this.allyDraft="",this.allyAttachments=[],this.allySending=!0,this.allyMessages=[...this.allyMessages,{role:"user",content:e||"(image)",timestamp:Date.now()}];try{let i;if(t.length>0){const h=[];for(const m of t){if(!m.dataUrl)continue;const o=m.dataUrl.match(/^data:([^;]+);base64,(.+)$/);if(!o)continue;const[,p,g]=o;p.startsWith("image/")&&h.push({type:"image",mimeType:p,content:g,fileName:m.fileName})}if(h.length>0){i=h;try{await this.client?.request("images.cache",{images:h.map(m=>({data:m.content,mimeType:m.mimeType,fileName:m.fileName})),sessionKey:x})}catch{}}}const a=`ally-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;try{await this.client?.request("sessions.patch",{key:x,lastChannel:"webchat"})}catch{}await this.client?.request("agent",{sessionKey:x,message:s,deliver:!1,channel:"webchat",idempotencyKey:a,attachments:i}),this.allyWorking=!0;const r=this.allyMessages[this.allyMessages.length-1]?.content,c=setInterval(async()=>{if(!this.allyWorking){clearInterval(c);return}try{await this._loadAllyHistory();const h=this.allyMessages[this.allyMessages.length-1];h&&h.role==="assistant"&&h.content!==r&&(this.allyWorking=!1,this.allyStream=null,clearInterval(c),this._scrollAllyToBottom())}catch{}},5e3);setTimeout(()=>clearInterval(c),12e4)}catch(i){const a=i instanceof Error?i.message:String(i);console.error("[Ally] Failed to send ally message:",a),this.allyMessages=[...this.allyMessages,{role:"assistant",content:`*Send failed: ${a}*`,timestamp:Date.now()}]}finally{this.allySending=!1}}handleAllyOpenFull(){this.allyPanelOpen=!1,this.setTab("chat"),this.applySettings({...this.settings,sessionKey:x,lastActiveSessionKey:x,tabLastViewed:{...this.settings.tabLastViewed,[x]:Date.now()}}),this.sessionKey=x,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),w(async()=>{const{loadChatHistory:e}=await Promise.resolve().then(()=>Q);return{loadChatHistory:e}},void 0,import.meta.url).then(({loadChatHistory:e})=>e(this)),this.loadSessionResources()}_scrollAllyToBottom(){this.updateComplete.then(()=>{requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector?.(".ally-panel, .ally-inline")??document.querySelector(".ally-panel, .ally-inline");if(!e)return;const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)})})}async _loadAllyHistory(){try{const e=await this.client?.request("chat.history",{sessionKey:x,limit:100});if(e?.messages){const{extractText:t,formatApiError:n}=await w(async()=>{const{extractText:i,formatApiError:a}=await Promise.resolve().then(()=>Xo);return{extractText:i,formatApiError:a}},void 0,import.meta.url);this.allyMessages=e.messages.map(i=>{const a=i.role??"assistant",r=a.toLowerCase();if(r==="tool"||r==="toolresult"||r==="tool_result"||r==="function"||r==="system")return null;const c=i;if(c.toolCallId||c.tool_call_id||c.toolName||c.tool_name)return null;if(Array.isArray(i.content)){const p=i.content;if(!p.some(y=>{const b=(typeof y.type=="string"?y.type:"").toLowerCase();return(b==="text"||b==="")&&typeof y.text=="string"&&y.text.trim().length>0})&&p.some(b=>{const A=(typeof b.type=="string"?b.type:"").toLowerCase();return A==="tool_use"||A==="tool_result"||A==="toolresult"||A==="tooluse"}))return null}let h=t(i);if(!h)return null;const m=n(h);if(m&&(h=m),h=h.replace(/^\[GodMode Context:[^\]]*\]\s*/i,"").trim(),!h)return null;const o=Bu(h,a);return o?{role:r==="user"?"user":"assistant",content:o,timestamp:i.timestamp}:null}).filter(i=>i!==null);const s=[];for(const i of this.allyMessages){const a=s[s.length-1];a&&a.role===i.role&&a.content===i.content||s.push(i)}this.allyMessages=s}}catch{}}async handleDecisionApprove(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.approve",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Approve failed:",t),this.showToast("Failed to approve","error")}}async handleDecisionReject(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.reject",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Reject failed:",t),this.showToast("Failed to reject","error")}}async handleDecisionDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Dismiss failed:",t),this.showToast("Failed to dismiss","error")}}async handleDecisionMarkComplete(e){if(!(!this.client||!this.connected))try{const t=this.todayQueueResults?.find(n=>n.id===e);t?.sourceTaskId&&await this.client.request("tasks.update",{id:t.sourceTaskId,status:"complete"}),await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(n=>n.id!==e),this.showToast("Task marked complete","success")}catch(t){console.error("[DecisionCard] Mark complete failed:",t),this.showToast("Failed to mark complete","error")}}async handleDecisionRate(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("trust.rate",{workflow:t,rating:n});const s=n<7;this.todayQueueResults=this.todayQueueResults.map(i=>i.id===e?{...i,userRating:n,feedbackPending:s}:i),s?this.showToast(`Rated ${t} ${n}/10 — what could be better?`,"info"):(this.todayQueueResults?.find(a=>a.id===e)?.source==="cron"&&(await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(a=>a.id!==e)),this.showToast(`Rated ${t} ${n}/10`,"success"))}catch(s){console.error("[DecisionCard] Rate failed:",s),this.showToast("Failed to submit rating","error")}}async handleDecisionFeedback(e,t,n){if(!(!this.client||!this.connected))try{n&&(await this.client.request("trust.feedback",{workflow:t,feedback:n}),this.showToast(`Feedback saved for ${t} — will apply next time`,"success")),this.todayQueueResults?.find(i=>i.id===e)?.source==="cron"&&await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.map(i=>i.id===e?{...i,feedbackPending:!1}:i).filter(i=>!(i.id===e&&i.source==="cron"))}catch(s){console.error("[DecisionCard] Feedback failed:",s),this.showToast("Failed to save feedback","error")}}async handleDecisionViewOutput(e,t){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const n=await this.client.request("queue.readOutput",{path:t}),s=t.split("/").pop()??"Agent Output";this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t,title:s})}catch(n){console.error("[DecisionCard] View output failed:",n),this.handleOpenFile(t)}}async handleDecisionOpenChat(e){const t=this.todayQueueResults?.find(i=>i.id===e);if(!t)return;if(t.sourceTaskId){await this.handleMissionControlOpenTaskSession(t.sourceTaskId);return}const{createNewSession:n}=await w(async()=>{const{createNewSession:i}=await Promise.resolve().then(()=>Z);return{createNewSession:i}},void 0,import.meta.url);n(this),this.setTab("chat");const{autoTitleCache:s}=await w(async()=>{const{autoTitleCache:i}=await import("./ctrl-settings-CzLVBbt9.js").then(a=>a.ad);return{autoTitleCache:i}},[],import.meta.url);if(s.set(this.sessionKey,t.title),t.outputPath&&this.client&&this.connected)try{const i=await this.client.request("queue.readOutput",{path:t.outputPath});i?.content&&await this.seedSessionWithAgentOutput(t.title,i.content)}catch{await this.seedSessionWithAgentOutput(t.title,t.summary)}else t.summary&&await this.seedSessionWithAgentOutput(t.title,t.summary)}async handleTodayOpenChatToEdit(e){try{const t=this.todayQueueResults?.find(s=>s.id===e),n=t?.outputPath;if(n&&this.client&&this.connected)try{const s=await this.client.request("queue.readOutput",{path:n});this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n,title:t?.title??n.split("/").pop()??"Agent Output"})}catch{await this.handleOpenFile(n)}this.allyPanelOpen=!0,this.allyUnread=0,this.tab!=="chat"&&this.setTab("chat")}catch(t){console.error("Open chat to edit failed:",t)}}async seedSessionWithAgentOutput(e,t,n){if(!this.client||!this.connected)return;this.handleOpenSidebar(t,{title:`Agent Output: ${e}`,filePath:null,mimeType:null});const s=t.match(/## Summary\n([\s\S]*?)(?=\n## |$)/),i=s?s[1].trim().split(`
`).slice(0,3).join(`
`):"Output available in sidebar.",a=[`Agent completed **${e}**.`,"",i,"","Full output is in the sidebar. What would you like to do?"].join(`
`);try{const{sendChatMessage:r}=await w(async()=>{const{sendChatMessage:c}=await Promise.resolve().then(()=>Q);return{sendChatMessage:c}},void 0,import.meta.url);await r(this,a)}catch(r){console.error("[Session] Failed to seed session with agent output:",r)}}async handleMissionControlAddToQueue(e,t){if(!(!this.client||!this.connected))try{await this.client.request("queue.add",{type:e,title:t,priority:"normal"}),this.showToast("Added to queue","success",2e3);const{loadMissionControl:n}=await w(async()=>{const{loadMissionControl:s}=await import("./ctrl-settings-CzLVBbt9.js").then(i=>i.ae);return{loadMissionControl:s}},[],import.meta.url);await n(this)}catch{this.showToast("Failed to add to queue","error")}}async handleDashboardsRefresh(){const{loadDashboards:e}=await w(async()=>{const{loadDashboards:t}=await import("./dashboards-CrT3s0NG.js");return{loadDashboards:t}},[],import.meta.url);await e(this)}async handleDashboardSelect(e){const{loadDashboard:t}=await w(async()=>{const{loadDashboard:n}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:n}},[],import.meta.url);if(await t(this,e),this.client&&this.connected)try{const n=await this.client.request("dashboards.openSession",{dashboardId:e});if(n?.sessionId){this.dashboardPreviousSessionKey=this.sessionKey;const s=n.sessionId,{autoTitleCache:i}=await w(async()=>{const{autoTitleCache:c}=await import("./ctrl-settings-CzLVBbt9.js").then(h=>h.ad);return{autoTitleCache:c}},[],import.meta.url);i.set(s,n.manifest.title),this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:s});const{saveDraft:a}=await w(async()=>{const{saveDraft:c}=await Promise.resolve().then(()=>pt);return{saveDraft:c}},void 0,import.meta.url);a(this),this.sessionKey=s,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream();const{loadChatHistory:r}=await w(async()=>{const{loadChatHistory:c}=await Promise.resolve().then(()=>Q);return{loadChatHistory:c}},void 0,import.meta.url);await r(this),this.loadSessionResources(),this.dashboardChatOpen=!0}}catch(n){console.error("[Dashboards] Failed to init session on select:",n)}}async handleDashboardDelete(e){const{deleteDashboard:t}=await w(async()=>{const{deleteDashboard:n}=await import("./dashboards-CrT3s0NG.js");return{deleteDashboard:n}},[],import.meta.url);await t(this,e)}async handleDashboardTogglePin(e){const{toggleDashboardPin:t}=await w(async()=>{const{toggleDashboardPin:n}=await import("./dashboards-CrT3s0NG.js");return{toggleDashboardPin:n}},[],import.meta.url);await t(this,e)}async handleDashboardCreateViaChat(e){this.setTab("chat");const{createNewSession:t}=await w(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>Z);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e??"I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more.")}handleDashboardCategoryFilter(e){this.dashboardCategoryFilter=e}handleDashboardBack(){if(this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1,this.dashboardPreviousSessionKey){const e=this.dashboardPreviousSessionKey;this.dashboardPreviousSessionKey=null,w(async()=>{const{saveDraft:t}=await Promise.resolve().then(()=>pt);return{saveDraft:t}},void 0,import.meta.url).then(({saveDraft:t})=>{t(this),this.sessionKey=e,w(async()=>{const{loadChatHistory:n}=await Promise.resolve().then(()=>Q);return{loadChatHistory:n}},void 0,import.meta.url).then(({loadChatHistory:n})=>{n(this)})})}}async handleDashboardOpenSession(e){const t=this.activeDashboardManifest?.sessionId;if(!t){this.showToast("No session for this dashboard","error");return}this.dashboardPreviousSessionKey=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1;const n=this.settings.openTabs.includes(t)?this.settings.openTabs:[...this.settings.openTabs,t];this.applySettings({...this.settings,openTabs:n,sessionKey:t,lastActiveSessionKey:t,tabLastViewed:{...this.settings.tabLastViewed,[t]:Date.now()}}),this.setTab("chat");const{syncUrlWithSessionKey:s}=await w(async()=>{const{syncUrlWithSessionKey:i}=await Promise.resolve().then(()=>Dc);return{syncUrlWithSessionKey:i}},void 0,import.meta.url);s(this,t,!0)}async handleOptionsLoad(){const{loadOptions:e}=await w(async()=>{const{loadOptions:t}=await import("./options-QuHclvvX.js");return{loadOptions:t}},[],import.meta.url);await e(this)}async handleOptionToggle(e,t){const{saveOption:n}=await w(async()=>{const{saveOption:s}=await import("./options-QuHclvvX.js");return{saveOption:s}},[],import.meta.url);await n(this,e,t)}async handleSecondBrainRefresh(){const{loadSecondBrain:e}=await w(async()=>{const{loadSecondBrain:t}=await import("./second-brain-cP3vM8ym.js");return{loadSecondBrain:t}},[],import.meta.url);await e(this)}handleSecondBrainSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.handleSecondBrainRefresh().catch(t=>{console.error("[SecondBrain] Refresh after subtab change failed:",t),this.secondBrainError=t instanceof Error?t.message:"Failed to load data",this.secondBrainLoading=!1})}async handleSecondBrainSelectEntry(e){if(e.endsWith(".html")||e.endsWith(".htm")){try{const s=await this.client.request("secondBrain.memoryBankEntry",{path:e});s?.content&&this.handleOpenSidebar(s.content,{mimeType:"text/html",filePath:e,title:s.name||e.split("/").pop()||"File"})}catch(s){console.error("[SecondBrain] Failed to open HTML file:",s)}return}const{loadSecondBrainEntry:n}=await w(async()=>{const{loadSecondBrainEntry:s}=await import("./second-brain-cP3vM8ym.js");return{loadSecondBrainEntry:s}},[],import.meta.url);await n(this,e)}async handleSecondBrainBrowseFolder(e){const{browseFolder:t}=await w(async()=>{const{browseFolder:n}=await import("./second-brain-cP3vM8ym.js");return{browseFolder:n}},[],import.meta.url);await t(this,e)}handleSecondBrainBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}handleSecondBrainSearch(e){this.secondBrainSearchQuery=e}async handleSecondBrainSync(){const{syncSecondBrain:e}=await w(async()=>{const{syncSecondBrain:t}=await import("./second-brain-cP3vM8ym.js");return{syncSecondBrain:t}},[],import.meta.url);await e(this)}handleSecondBrainFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doSecondBrainFileSearch(e)}async _doSecondBrainFileSearch(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=t.results??[])}catch(t){console.error("[SecondBrain] search failed:",t)}}async handleSecondBrainFileSelect(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=e.endsWith(".html")||e.endsWith(".htm");this.handleOpenSidebar(t.content,{mimeType:n?"text/html":"text/markdown",filePath:e,title:t.name||e.split("/").pop()||"File"})}}catch(t){console.error("[SecondBrain] Failed to open file:",t),this.showToast("Failed to open file","error")}}async handleResearchSaveViaChat(){this.setTab("chat");const{createNewSession:e}=await w(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>Z);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save.")}async handleAddSource(){this.setTab("chat");const{createNewSession:e}=await w(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>Z);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect.")}removeQueuedMessage(e){Ti(this,e)}async handleSendChat(e,t){const n=this.sessionsResult?.sessions?.find(s=>s.key===this.sessionKey);if(n){const s=n.totalTokens??0,i=n.contextTokens??this.sessionsResult?.defaults?.contextTokens??2e5;if((i>0?s/i:0)>=.9&&!this.compactionStatus?.active){const r=(e??this.chatMessage).trim(),c=e==null?[...this.chatAttachments??[]]:[];if(r||c.length>0){this.pendingRetry={message:r,attachments:c,timestamp:Date.now()},this.autoRetryAfterCompact=!0,this.chatMessages=[...this.chatMessages,{role:"user",content:[{type:"text",text:r}],timestamp:Date.now()}],e==null&&(this.chatMessage="",this.chatAttachments=[]),this.showToast("Context near limit — auto-compacting...","info",3e3),this.handleCompactChat();return}}}await _i(this,e,t)}handleToggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen}handleToggleSessionSearch(e){if(!this.sessionSearchOpen&&e){const n=e.currentTarget.getBoundingClientRect();this.sessionSearchPosition={top:n.bottom+8,right:window.innerWidth-n.right}}this.sessionSearchOpen=!this.sessionSearchOpen,this.sessionSearchOpen||(this.sessionSearchQuery="",this.sessionSearchResults=[])}async handleSessionSearchQuery(e){if(this.sessionSearchQuery=e,!e.trim()){this.sessionSearchResults=[];return}if(this.client){this.sessionSearchLoading=!0;try{const t=await this.client.request("sessions.searchContent",{query:e.trim(),limit:20});this.sessionSearchResults=t.results}catch(t){console.error("Session search failed:",t),this.sessionSearchResults=[]}finally{this.sessionSearchLoading=!1}}}handleSelectSession(e){this.sessionPickerOpen=!1,this.sessionSearchOpen=!1,this.sessionSearchQuery="",this.sessionSearchResults=[]}async handleWhatsAppStart(e){await to(this,e)}async handleWhatsAppWait(){await no(this)}async handleWhatsAppLogout(){await so(this)}async handleChannelConfigSave(){await io(this)}async handleChannelConfigReload(){await ao(this)}async handleCompactChat(){if(!this.connected){this.showToast("Cannot compact: not connected","error");return}if(!this.sessionKey){this.showToast("Cannot compact: no active session","error");return}this.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null};try{await this.handleSendChat("/compact")}catch(e){this.compactionStatus=null,console.error("Compaction failed:",e),this.showToast("Compaction failed","error")}}injectCompactionSummary(e,t){const n={role:"system",content:e,timestamp:Date.now(),isCompactionSummary:!0,keptMessages:t};this.chatMessages=[n,...this.chatMessages]}async handleRetryMessage(){const e={client:this.client,connected:this.connected,sessionKey:this.sessionKey,chatLoading:this.chatLoading,chatMessages:this.chatMessages,chatThinkingLevel:this.chatThinkingLevel,chatSending:this.chatSending,chatSendingSessionKey:this.chatSendingSessionKey,chatMessage:this.chatMessage,chatAttachments:this.chatAttachments,chatRunId:this.chatRunId,chatStream:this.chatStream,chatStreamStartedAt:this.chatStreamStartedAt,lastError:this.lastError,pendingRetry:this.pendingRetry},t=await Ks(e);this.chatSending=e.chatSending,this.chatSendingSessionKey=e.chatSendingSessionKey,this.chatRunId=e.chatRunId,this.chatStream=e.chatStream,this.chatStreamStartedAt=e.chatStreamStartedAt,this.lastError=e.lastError,this.pendingRetry=e.pendingRetry??null,this.chatMessages=e.chatMessages,t&&this.showToast("Message resent","success",2e3)}handleClearRetry(){this.pendingRetry=null}handleNostrProfileEdit(e,t){ro(this,e,t)}handleNostrProfileCancel(){lo(this)}handleNostrProfileFieldChange(e,t){co(this,e,t)}async handleNostrProfileSave(){await ho(this)}async handleNostrProfileImport(){await po(this)}handleNostrProfileToggleAdvanced(){uo(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,J(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleGatewayRestartClick(){this.gatewayRestartPending=!0}async handleGatewayRestartConfirm(){if(!(!this.client||this.gatewayRestartBusy)){this.gatewayRestartBusy=!0;try{await this.client.request("godmode.gateway.restart")}catch{}finally{this.gatewayRestartBusy=!1,this.gatewayRestartPending=!1}}}handleGatewayRestartCancel(){this.gatewayRestartPending=!1}handleDeployPanelToggle(){this.deployPanelOpen=!this.deployPanelOpen}async handleDeployDismiss(){if(this.client){try{await this.client.request("godmode.deploy.dismiss")}catch{}this.deployPanelOpen=!1,this.updateStatus&&(this.updateStatus={...this.updateStatus,pendingDeploy:null})}}handleOpenSidebar(e,t={}){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarMimeType=t.mimeType?.trim()||null,this.sidebarFilePath=t.filePath?.trim()||null,this.sidebarTitle=t.title?.trim()||null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.showDrivePicker=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode!=="proof"&&(this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null),this.sidebarCloseTimer=null)},200)}async handleOpenFile(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}let t=e;if(!e.includes("/")&&!e.includes("\\")&&!e.startsWith("~"))try{t=(await this.client.request("files.resolve",{filename:e})).path}catch{}try{const n=await this.client.request("files.read",{path:t}),s=t.split(".").pop()?.toLowerCase()??"",i=n.contentType??n.mime??(s==="md"?"text/markdown":null),a=t.split("/").pop()??t;this.handleOpenSidebar(n.content,{mimeType:i,filePath:t,title:a}),n.truncated&&this.showToast(`Opened truncated file: ${a}`,"warning")}catch(n){console.error("[Chat] Failed to open file:",n),this.showToast(`Failed to open file: ${e}`,"error")}}async handleToggleDrivePicker(){if(this.showDrivePicker){this.showDrivePicker=!1;return}if(this.driveAccounts.length===0)try{const e=await this.client?.request("files.listDriveAccounts",{});this.driveAccounts=e?.accounts??[]}catch{this.driveAccounts=[]}this.showDrivePicker=!0}async handlePushToDrive(e,t){if(!this.driveUploading){if(this.showDrivePicker=!1,this._pendingBatchPaths&&this._pendingBatchPaths.length>0){const n=this._pendingBatchPaths;this._pendingBatchPaths=void 0,await this._executeBatchDrive(n,t);return}this.driveUploading=!0;try{const n={filePath:e};t&&(n.account=t);const s=await this.client?.request("files.pushToDrive",n),i=t?` to ${t.split("@")[0]}`:"",a=s?.message??`Uploaded${i} to Google Drive`,r=s?.driveUrl;this.showToast(a,"success",r?8e3:5e3,r?{label:"View in Drive",url:r}:void 0)}catch(n){console.error("Push to Drive failed:",n);const s=n instanceof Error?n.message:typeof n=="object"&&n!==null&&"message"in n?String(n.message):"Unknown error";s.includes("GOG_NOT_FOUND")||s.includes("gog CLI not found")?this.showToast("Google Drive not configured. Install gog CLI: npm install -g gog-cli, then run: gog auth add <email> --services drive","warning",1e4):s.includes("GOG_AUTH")||s.includes("auth")&&s.includes("expired")?this.showToast("Google Drive auth expired. Re-authenticate: gog auth add <email> --services drive","warning",8e3):this.showToast(`Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1}}}async handleBatchPushToDrive(e){if(this.driveUploading||e.length===0)return;if(!this.driveAccounts||this.driveAccounts.length===0)try{const n=await this.client?.request("files.listDriveAccounts");this.driveAccounts=n?.accounts??[]}catch{}if(this.driveAccounts&&this.driveAccounts.length>1){this._pendingBatchPaths=e,this.showDrivePicker=!0;return}const t=this.driveAccounts?.[0]?.email;await this._executeBatchDrive(e,t)}async _executeBatchDrive(e,t){this.driveUploading=!0,this.showToast(`Uploading ${e.length} files to Drive...`,"info",0);try{const n={filePaths:e};t&&(n.account=t);const s=await this.client?.request("files.batchPushToDrive",n);this.dismissAllToasts();const i=s?.results?.filter(r=>r.success).length??0,a=s?.results?.length??e.length;i===a?this.showToast(`Uploaded ${i} files to Google Drive`,"success",5e3):this.showToast(`Uploaded ${i}/${a} files (${a-i} failed)`,"warning",8e3)}catch(n){this.dismissAllToasts();const s=n instanceof Error?n.message:"Unknown error";this.showToast(`Batch Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1,this._pendingBatchPaths=void 0}}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}handleImageClick(e,t,n){this.lightbox=iu(e,t,n)}handleLightboxClose(){this.lightbox=au()}handleLightboxNav(e){this.lightbox=ou(this.lightbox,e)}normalizeWorkspacePathCandidate(e,t={}){let n=e.trim();if(!n||n.startsWith("#"))return null;for(;n.startsWith("./");)n=n.slice(2);if(n=n.replaceAll("\\","/"),!t.allowAbsolute)for(;n.startsWith("/");)n=n.slice(1);return!n||n.includes("\0")?null:n}isAbsoluteFilesystemPath(e){return e.startsWith("/")||e.startsWith("~/")||/^[a-z]:[\\/]/i.test(e)}inferMimeTypeFromPath(e){if(!e)return null;const t=e.trim().toLowerCase();if(!t)return null;const n=t.split(".").pop()??"";return n?n==="md"||n==="markdown"||n==="mdx"?"text/markdown":n==="html"||n==="htm"?"text/html":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":n==="svg"||n==="svgz"?"image/svg+xml":n==="avif"||n==="bmp"||n==="gif"||n==="heic"||n==="heif"||n==="jpeg"||n==="jpg"||n==="png"||n==="webp"?`image/${n==="jpg"?"jpeg":n}`:null:null}sidebarTitleForPath(e){const t=e.replaceAll("\\","/").trim();if(!t)return"Document";const n=t.split("/");return n[n.length-1]||t}async listWorkspaceIdsForPathResolution(){const e=[],t=new Set,n=s=>{if(typeof s!="string")return;const i=s.trim();!i||t.has(i)||(t.add(i),e.push(i))};n(this.selectedWorkspace?.id);for(const s of this.workspaces??[])n(s.id);if(e.length>0||!this.client||!this.connected)return e;try{const s=await this.client.request("workspaces.list",{});for(const i of s.workspaces??[])n(i.id)}catch{}return e}async openWorkspaceRelativeFileInViewer(e){if(!this.client||!this.connected)return!1;const t=await this.listWorkspaceIdsForPathResolution();for(const n of t)try{const s=await this.client.request("workspaces.readFile",{workspaceId:n,filePath:e});if(typeof s.content!="string")continue;return this.handleOpenSidebar(s.content,{mimeType:s.contentType??s.mime??this.inferMimeTypeFromPath(e),filePath:s.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}return!1}extractWorkspacePathCandidatesFromHref(e){const t=e.trim();if(!t)return[];const n=[],s=t.toLowerCase();if(s.startsWith("mailto:")||s.startsWith("tel:")||s.startsWith("javascript:")||s.startsWith("data:"))return[];if(t.startsWith("file://")){let m=t.slice(7);m.startsWith("/~/")&&(m="~"+m.slice(2));try{m=decodeURIComponent(m)}catch{}n.push(m);const o=[],p=new Set;for(const g of n){const y=this.normalizeWorkspacePathCandidate(g,{allowAbsolute:!0});!y||p.has(y)||(p.add(y),o.push(y))}return o}const i=/^[a-z][a-z0-9+.-]*:/i.test(t),a=/^[a-z]:[\\/]/i.test(t);(!i||a)&&n.push(t);let r=null;try{r=new URL(t,window.location.href)}catch{r=null}if(r&&/^https?:$/.test(r.protocol)&&r.origin===window.location.origin){for(const b of Uu){const A=r.searchParams.get(b);A&&n.push(A)}const o=(t.split("#")[0]??"").split("?")[0]??"";o.length>0&&!o.startsWith("/")&&!o.includes("://")&&n.push(o);let g=r.pathname;this.basePath&&g.startsWith(`${this.basePath}/`)?g=g.slice(this.basePath.length):this.basePath&&g===this.basePath&&(g="");const y=g.startsWith("/")?g.slice(1):g;if(y){n.push(y);const b=y.indexOf("/");if(b>0){const A=y.slice(0,b).toLowerCase();os.has(A)&&n.push(y.slice(b+1))}}if(g.startsWith("/")&&y){const b=y.split("/")[0]?.toLowerCase()??"";os.has(b)||n.push(g)}}const c=[],h=new Set;for(const m of n){let o=m;try{o=decodeURIComponent(m)}catch{}const p=this.normalizeWorkspacePathCandidate(o,{allowAbsolute:!0});!p||h.has(p)||(h.add(p),c.push(p))}return c}async openWorkspaceFileInViewer(e){if(!this.client||!this.connected)return!1;const t=this.isAbsoluteFilesystemPath(e);if(!t&&await this.openWorkspaceRelativeFileInViewer(e))return!0;try{const n=await this.client.request("workspaces.readFile",{path:e});if(typeof n.content=="string")return this.handleOpenSidebar(n.content,{mimeType:n.contentType??n.mime??this.inferMimeTypeFromPath(e),filePath:n.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}if(!t)return!1;try{const n=await this.client.request("files.read",{path:e,maxSize:1e6});return typeof n.content!="string"?!1:(this.handleOpenSidebar(n.content,{mimeType:this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0)}catch{return!1}}async handleOpenMessageFileLink(e){const t=this.extractWorkspacePathCandidatesFromHref(e);if(t.length===0)return!1;for(const n of t)if(await this.openWorkspaceFileInViewer(n))return!0;return!1}showToast(e,t="info",n=5e3,s){const i=Eu(e,t,n,s);this.toasts=Ou(this.toasts,i),n>0&&window.setTimeout(()=>{this.dismissToast(i.id)},n)}dismissToast(e){this.toasts=Mu(this.toasts,e)}dismissAllToasts(){this.toasts=[]}async handleMyDayRefresh(){await We(this),this._loadDecisionCards()}_loadDecisionCards(){w(()=>Promise.resolve().then(()=>Te),void 0,import.meta.url).then(async e=>{this.todayQueueResults=await e.loadTodayQueueResults(this)}).catch(()=>{})}async loadTodayQueueResults(){this._loadDecisionCards()}async handleMyDayTaskStatusChange(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,status:t,completedAt:t==="complete"?new Date().toISOString():null});const{loadTodayTasksWithQueueStatus:n}=await w(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>Te);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task status:",n)}}async handleTodayCreateTask(e){if(!(!this.client||!this.connected))try{await this.client.request("tasks.create",{title:e,dueDate:z(),priority:"medium",source:"chat"});const{loadTodayTasksWithQueueStatus:t}=await w(async()=>{const{loadTodayTasksWithQueueStatus:n}=await Promise.resolve().then(()=>Te);return{loadTodayTasksWithQueueStatus:n}},void 0,import.meta.url);await t(this)}catch(t){console.error("[MyDay] Failed to create task:",t),this.showToast("Failed to create task","error")}}handleTodayEditTask(e){this.todayEditingTaskId=e}async handleTodayUpdateTask(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,...t}),this.todayEditingTaskId=null;const{loadTodayTasksWithQueueStatus:n}=await w(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>Te);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task:",n),this.showToast("Failed to update task","error")}}handleTodayToggleCompleted(){this.todayShowCompleted=!this.todayShowCompleted}async handleTodayViewTaskOutput(e){if(!(!this.client||!this.connected))try{const n=(await this.client.request("queue.list",{limit:100}))?.items?.find(a=>a.sourceTaskId===e);if(!n?.result?.outputPath){this.showToast("No output available for this task","info");return}const s=await this.client.request("queue.readOutput",{path:n.result.outputPath}),i=n.result.outputPath.split("/").pop()??"Agent Output";this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n.result.outputPath,title:i})}catch(t){console.error("[Tasks] View output failed:",t),this.showToast("Failed to load agent output","error")}}async handleTodayStartTask(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e}),n=t?.sessionId??t?.sessionKey;if(n){if(t.task?.title){const{autoTitleCache:a}=await w(async()=>{const{autoTitleCache:c}=await import("./ctrl-settings-CzLVBbt9.js").then(h=>h.ad);return{autoTitleCache:c}},[],import.meta.url);a.set(n,t.task.title);const{hostPatchSession:r}=await w(async()=>{const{hostPatchSession:c}=await Promise.resolve().then(()=>kl);return{hostPatchSession:c}},void 0,import.meta.url);r(this.client,n,t.task.title)}this.setTab("chat"),this.sessionKey=n;const s=this.settings.openTabs.includes(n)?this.settings.openTabs:[...this.settings.openTabs,n];this.applySettings({...this.settings,sessionKey:n,lastActiveSessionKey:n,openTabs:s}),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:i}=await w(async()=>{const{loadChatHistory:a}=await Promise.resolve().then(()=>Q);return{loadChatHistory:a}},void 0,import.meta.url);await i(this),this.loadSessionResources(),t.queueOutput&&this.chatMessages.length===0&&this.seedSessionWithAgentOutput(t.task?.title??"this task",t.queueOutput,t.agentPrompt??void 0),this.requestUpdate()}}catch(t){console.error("[MyDay] Failed to open session for task:",t),this.showToast("Failed to open session for task","error")}}handleDatePrev(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()-1),this.todaySelectedDate=z(e),ke(this)}handleDateNext(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()+1);const t=z(),n=z(e);n>t||(this.todaySelectedDate=n,ke(this))}handleDateToday(){this.todaySelectedDate=z(),We(this)}async handleDailyBriefRefresh(){await ke(this)}async handleDailyBriefGenerate(){if(!(!this.client||!this.connected)){this.dailyBriefLoading=!0;try{await this.client.request("dailyBrief.generate",{}),await ke(this)}catch(e){this.dailyBriefError=e instanceof Error?e.message:"Failed to generate brief"}finally{this.dailyBriefLoading=!1}}}handleDailyBriefOpenInObsidian(){const e=this.dailyBrief?.date;ai(e)}async loadBriefNotes(){if(!this.client||!this.connected)return;const e=this.todaySelectedDate;try{const t=await this.client.request("briefNotes.get",{date:e});this.briefNotes=t.notes??{}}catch(t){console.error("[BriefNotes] Load error:",t),this.briefNotes={}}}async handleBriefNoteSave(e,t){if(!this.client||!this.connected)return;const n=this.todaySelectedDate;try{const s=await this.client.request("briefNotes.update",{date:n,section:e,text:t});this.briefNotes=s.notes??{}}catch(s){console.error("[BriefNotes] Save error:",s),this.showToast("Failed to save note","error")}}handleTodayViewModeChange(e){this.todayViewMode=e}handlePrivateModeToggle(){if(this.chatPrivateMode){const e=this.sessionKey;this.chatPrivateMode=!1,this._destroyPrivateSession(e),this.showToast("Private session destroyed","info",2e3);return}this.chatPrivateMode=!0,this.setTab("chat"),w(async()=>{const{createNewSession:e}=await Promise.resolve().then(()=>Z);return{createNewSession:e}},void 0,import.meta.url).then(({createNewSession:e})=>{e(this);const t=Date.now()+1440*60*1e3;this.privateSessions=new Map(this.privateSessions).set(this.sessionKey,t),this._persistPrivateSessions(),this._startPrivateSessionTimer(),this.client&&this.connected&&this.client.request("session.setPrivate",{sessionKey:this.sessionKey,enabled:!0}).catch(()=>{}),this.chatMessages=[{role:"assistant",content:`This is a **private session**. Nothing will be saved to memory or logs.

This session self-destructs when you close it or in **24 hours** — whichever comes first.`,timestamp:Date.now()}],this.requestUpdate()}),this.showToast("Private session created — 24h countdown started","info",3e3)}async _destroyPrivateSession(e){const t=new Map(this.privateSessions);if(t.delete(e),this.privateSessions=t,this._persistPrivateSessions(),this.sessionKey===e){this.chatPrivateMode=!1;const n=this.settings.openTabs.filter(i=>i!==e),s=n[0]||x;this.applySettings({...this.settings,openTabs:n,sessionKey:s,lastActiveSessionKey:s}),this.sessionKey=s,(await w(async()=>{const{loadChatHistory:i}=await Promise.resolve().then(()=>Q);return{loadChatHistory:i}},void 0,import.meta.url)).loadChatHistory(this)}else this.applySettings({...this.settings,openTabs:this.settings.openTabs.filter(n=>n!==e)});this.client&&this.connected&&(this.client.request("session.setPrivate",{sessionKey:e,enabled:!1}).catch(()=>{}),this.client.request("sessions.delete",{key:e,deleteTranscript:!0}).catch(()=>{})),this.privateSessions.size===0&&this._stopPrivateSessionTimer()}_persistPrivateSessions(){const e=Array.from(this.privateSessions.entries());e.length===0?localStorage.removeItem("godmode.privateSessions"):localStorage.setItem("godmode.privateSessions",JSON.stringify(e))}_restorePrivateSessions(){try{const e=localStorage.getItem("godmode.privateSessions");if(!e)return;const t=JSON.parse(e),n=Date.now(),s=t.filter(([,i])=>i>n);if(this.privateSessions=new Map(s),s.length!==t.length){const i=t.filter(([,a])=>a<=n);for(const[a]of i)this._destroyPrivateSession(a)}this.privateSessions.size>0&&(this.privateSessions.has(this.sessionKey)&&(this.chatPrivateMode=!0),this._startPrivateSessionTimer()),this._persistPrivateSessions()}catch{localStorage.removeItem("godmode.privateSessions")}}_startPrivateSessionTimer(){this._privateSessionTimer||(this._privateSessionTimer=setInterval(()=>{const e=Date.now();for(const[t,n]of this.privateSessions)n<=e&&(this._destroyPrivateSession(t),this.showToast("Private session expired and was destroyed","info",3e3));this.privateSessions.size>0&&this.requestUpdate()},3e4))}_stopPrivateSessionTimer(){this._privateSessionTimer&&(clearInterval(this._privateSessionTimer),this._privateSessionTimer=null)}async handleBriefSave(e){if(!this.client||!this.connected)return;const t=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.update",{date:t,content:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(n){console.error("[DailyBrief] Save error:",n),this.showToast("Failed to save brief","error")}}async handleBriefToggleCheckbox(e,t){if(!this.client||!this.connected)return;const n=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.toggleCheckbox",{date:n,index:e,checked:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(s){console.error("[DailyBrief] Checkbox toggle error:",s),this.showToast("Failed to toggle checkbox","error")}}async handleWorkRefresh(){await Promise.all([oi(this),ri(this)])}async handleResourcePin(e,t){await Yl(this,e,t)}async handleResourceDelete(e){await Jl(this,e)}handleResourceFilterChange(e){this.workResourceFilter=e}handleResourceClick(e){e.path?this.handleWorkFileClick(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}async loadSessionResources(){if(!(!this.client||!this.connected))try{const t=(await this.client.request("resources.list",{sessionKey:this.sessionKey,limit:20})).resources??[],n=new Set(t.filter(s=>s.proofSlug).map(s=>s.proofSlug));if(this.chatMessages?.length)for(const s of this.chatMessages){const i=s,a=Array.isArray(i.content)?i.content:[];for(const r of a){const c=typeof r.text=="string"?r.text:typeof r.content=="string"?r.content:null;if(c)try{const h=JSON.parse(c);h._sidebarAction?.type==="proof"&&h._sidebarAction.slug&&!n.has(h._sidebarAction.slug)&&(n.add(h._sidebarAction.slug),t.unshift({id:`proof:${h._sidebarAction.slug}`,title:h.title??"Proof Document",type:"doc",path:h.filePath,sessionKey:this.sessionKey,proofSlug:h._sidebarAction.slug}))}catch{}}}this.sessionResources=t}catch(e){console.warn("[SessionResources] load failed:",e),this.sessionResources=[]}}handleSessionResourceClick(e){e.proofSlug?this.handleOpenProofDoc(e.proofSlug):e.path?this.handleOpenFile(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}handleToggleSessionResources(){this.sessionResourcesCollapsed=!this.sessionResourcesCollapsed}handleViewAllResources(){this.setTab("work")}handleWorkToggleProject(e){const t=new Set(this.workExpandedProjects);t.has(e)?t.delete(e):(t.add(e),this.workProjectFiles[e]||Ql(this,e)),this.workExpandedProjects=t}async handleWorkFileClick(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("workspaces.readFile",{path:e});if(!t.content){this.showToast(t.error??"Failed to read file","error");return}this.handleOpenSidebar(t.content,{mimeType:t.contentType??t.mime??this.inferMimeTypeFromPath(e),filePath:t.path??e,title:this.sidebarTitleForPath(e)})}catch(t){console.error("[Work] Failed to read file:",t),this.showToast(`Failed to open: ${e}`,"error")}}handleWorkSkillClick(e,t){this.handleStartChatWithPrompt(`Tell me about the "${e}" skill and how it's used in the ${t} project.`)}handlePeopleImport(e){const t=e==="apple"?"Import my contacts from Apple Contacts and organize them into categories.":"Import my contacts from Google Contacts and organize them into categories.";this.handleStartChatWithPrompt(t)}async handleWorkspacesRefresh(){await et(this)}async handleWorkspaceBrowse(e){if(!this.selectedWorkspace)return;const{browseWorkspaceFolder:t}=await w(async()=>{const{browseWorkspaceFolder:s}=await Promise.resolve().then(()=>Fe);return{browseWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&(this.workspaceBrowsePath=e,this.workspaceBrowseEntries=n.entries,this.workspaceBreadcrumbs=n.breadcrumbs)}async handleWorkspaceBrowseSearch(e){if(this.workspaceBrowseSearchQuery=e,!e.trim()||!this.selectedWorkspace){this.workspaceBrowseSearchResults=null;return}const{searchWorkspaceFiles:t}=await w(async()=>{const{searchWorkspaceFiles:n}=await Promise.resolve().then(()=>Fe);return{searchWorkspaceFiles:n}},void 0,import.meta.url);this.workspaceBrowseSearchResults=await t(this,this.selectedWorkspace.id,e)}handleWorkspaceBrowseBack(){this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null}async handleWorkspaceCreateFolder(e){if(!this.selectedWorkspace)return;const{createWorkspaceFolder:t}=await w(async()=>{const{createWorkspaceFolder:s}=await Promise.resolve().then(()=>Fe);return{createWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&this.workspaceBrowsePath&&await this.handleWorkspaceBrowse(this.workspaceBrowsePath),n&&this.showToast("Folder created","success",2e3)}handleOnboardingStart(){this.onboardingPhase=1,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:1}),this.client?.request("onboarding.update",{phase:1,completePhase:0})}async handleOnboardingIdentitySubmit(e){if(this.client)try{await this.client.request("onboarding.update",{phase:2,completePhase:1,identity:e}),this.onboardingPhase=2,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:2,identity:e}),this.userName=e.name,this.userAvatar=e.emoji,this.applySettings({...this.settings,userName:e.name,userAvatar:e.emoji}),this.setTab("chat"),w(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>Z);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this);const n=`I just set up my GodMode identity. My name is ${e.name}${e.mission?` and my mission is: ${e.mission}`:""}. Let's set up my workspace.`;this.chatMessage=n,this.handleSendChat(n)})}catch(t){console.error("[Onboarding] Identity submit failed:",t),this.showToast("Failed to save identity","error")}}handleOnboardingSkipPhase(){if(!this.client)return;const e=Math.min(this.onboardingPhase+1,6);this.onboardingPhase=e,this.client.request("onboarding.update",{phase:e,completePhase:this.onboardingPhase})}handleOnboardingComplete(){this.onboardingActive=!1,this.onboardingPhase=6,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:6,completedAt:new Date().toISOString()}),this.client?.request("onboarding.complete",{summary:this.onboardingData?.summary??null}),this.showToast("Welcome to GodMode!","success",4e3)}handleStartChatWithPrompt(e){this.setTab("chat"),w(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>Z);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this),this.chatMessage=e,this.requestUpdate()})}handleOpenSupportChat(){const e="agent:main:support";if(this.sessionKey===e){this.setTab("chat");return}w(async()=>{const{saveDraft:s}=await Promise.resolve().then(()=>pt);return{saveDraft:s}},void 0,import.meta.url).then(({saveDraft:s})=>s(this));const n=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:n,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),w(async()=>{const{autoTitleCache:s}=await import("./ctrl-settings-CzLVBbt9.js").then(i=>i.ad);return{autoTitleCache:s}},[],import.meta.url).then(({autoTitleCache:s})=>{s.set(e,"Support")}),w(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>Q);return{loadChatHistory:s}},void 0,import.meta.url).then(({loadChatHistory:s})=>{s(this).then(()=>{this.loadSessionResources(),this.chatMessages.length===0&&this.sessionKey===e&&(this.chatMessages=[{role:"assistant",content:`**Welcome to GodMode Support**

I have full access to your system diagnostics and GodMode knowledge base. I can help with:

- Troubleshooting issues
- Feature questions and configuration
- Setup guidance
- Escalation to the team if needed

What can I help you with?`,timestamp:Date.now()}],this.requestUpdate())}).catch(i=>{console.error("[Support] Failed to load chat history:",i)})})}handleWizardOpen(){w(async()=>{const{emptyWizardState:e}=await import("./views-settings-COCxblgi.js").then(t=>t.C);return{emptyWizardState:e}},__vite__mapDeps([4,1,3,5]),import.meta.url).then(({emptyWizardState:e})=>{this.wizardState=e(),this.wizardActive=!0,this.requestUpdate()})}handleWizardClose(){this.wizardActive=!1,this.wizardState=null,this.requestUpdate()}handleWizardStepChange(e){this.wizardState&&(this.wizardState={...this.wizardState,step:e},this.requestUpdate())}handleWizardAnswerChange(e,t){this.wizardState&&(this.wizardState={...this.wizardState,answers:{...this.wizardState.answers,[e]:t}},this.requestUpdate())}async handleWizardPreview(){if(!(!this.client||!this.wizardState))try{const[e,t]=await Promise.all([this.client.request("onboarding.wizard.preview",this.wizardState.answers),this.client.request("onboarding.wizard.diff",this.wizardState.answers).catch(()=>null)]),n={};for(const i of e.files??[])n[i.path]=i.wouldCreate;const s={};if(t){for(const i of t.additions)s[i.path]=!0;for(const i of t.changes)s[i.path]=!1}this.wizardState={...this.wizardState,preview:e.files??[],diff:t,fileSelections:n,configSelections:s},this.requestUpdate()}catch(e){console.error("[Wizard] Preview failed:",e)}}handleWizardFileToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,fileSelections:{...this.wizardState.fileSelections,[e]:t}},this.requestUpdate())}handleWizardConfigToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,configSelections:{...this.wizardState.configSelections,[e]:t}},this.requestUpdate())}async handleWizardGenerate(){if(!this.client||!this.wizardState)return;this.wizardState={...this.wizardState,generating:!0,error:null},this.requestUpdate();const e=[];for(const[n,s]of Object.entries(this.wizardState.fileSelections))s||e.push(n);const t=[];for(const[n,s]of Object.entries(this.wizardState.configSelections))s||t.push(n);try{const n=await this.client.request("onboarding.wizard.generate",{...this.wizardState.answers,skipFiles:e,skipKeys:t});this.wizardState={...this.wizardState,generating:!1,step:9,result:{filesCreated:n.filesCreated,filesSkipped:n.filesSkipped,configPatched:n.configPatched,workspacePath:n.workspacePath}},this.requestUpdate(),this.showToast("Memory system generated!","success",4e3)}catch(n){const s=n instanceof Error?n.message:"Failed to generate workspace";this.wizardState={...this.wizardState,generating:!1,error:s},this.requestUpdate(),this.showToast(s,"error")}}async handleQuickSetup(e){w(()=>import("./setup-CWjMtnE4.js"),[],import.meta.url).then(async({quickSetup:t})=>{await t(this,e)&&(this.setTab("chat"),w(async()=>{const{loadCapabilities:s}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:s}},[],import.meta.url).then(({loadCapabilities:s})=>s(this)))})}handleLoadCapabilities(){w(async()=>{const{loadCapabilities:e}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:e}},[],import.meta.url).then(({loadCapabilities:e})=>e(this))}handleCapabilityAction(e){w(async()=>{const{capabilityAction:t}=await import("./setup-CWjMtnE4.js");return{capabilityAction:t}},[],import.meta.url).then(({capabilityAction:t})=>t(this,e))}handleHideSetup(){w(async()=>{const{hideSetup:e}=await import("./setup-CWjMtnE4.js");return{hideSetup:e}},[],import.meta.url).then(({hideSetup:e})=>e(this))}handleRunAssessment(){this.client&&this.client.request("onboarding.assess",{}).then(()=>{this.handleLoadCapabilities()})}handleUpdateUserProfile(e,t){const n=e.trim().slice(0,50),s=t.trim();this.userName=n||"You",this.userAvatar=s||null,this.applySettings({...this.settings,userName:n,userAvatar:s})}async handleLoadIntegrations(){await(await w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadIntegrations(this)}handleExpandCard(e){w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.expandCard(this,e))}async handleLoadGuide(e){await(await w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadGuide(this,e)}async handleTestIntegration(e){await(await w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).testIntegration(this,e)}async handleConfigureIntegration(e,t){await(await w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).configureIntegration(this,e,t)}handleUpdateConfigValue(e,t){this.onboardingConfigValues={...this.onboardingConfigValues,[e]:t}}handleSkipIntegration(e){w(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.skipIntegration(this,e))}async handleMarkOnboardingComplete(){if(!(!this.client||!this.connected))try{await this.client.request("onboarding.complete",{}),this.godmodeOptions&&(this.godmodeOptions={...this.godmodeOptions,"onboarding.complete":!0}),this.showSetupTab=!1,this.setTab("chat")}catch(e){console.error("[onboarding] Failed to mark complete:",e)}}async handleInboxRefresh(){if(!(!this.client||!this.connected)){this.inboxLoading=!0;try{const e=await this.client.request("inbox.list",{status:"pending",limit:50});this.inboxItems=e.items,this.inboxCount=e.pendingCount}catch(e){console.error("[Inbox] Failed to load:",e)}finally{this.inboxLoading=!1}}}async handleInboxScore(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("inbox.score",{itemId:e,score:t,feedback:n}),this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,await this.handleInboxRefresh()}catch(s){console.error("[Inbox] Score failed:",s)}}async handleInboxDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("inbox.dismiss",{itemId:e}),await this.handleInboxRefresh()}catch(t){console.error("[Inbox] Dismiss failed:",t)}}async handleInboxMarkAll(){if(!(!this.client||!this.connected))try{await this.client.request("inbox.markAllComplete",{}),await this.handleInboxRefresh()}catch(e){console.error("[Inbox] Mark all failed:",e)}}async handleInboxViewOutput(e){const t=this.inboxItems?.find(n=>n.id===e);if(t){if(t.outputPath&&this.client)try{const n=await this.client.request("files.read",{path:t.outputPath,maxSize:5e5});if(n?.content){this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t.outputPath,title:t.title});return}}catch(n){console.error("[Inbox] Failed to load output file:",n)}t.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}}async handleInboxViewProof(e){const t=this.inboxItems?.find(n=>n.id===e);t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}handleInboxOpenChat(e){const t=this.inboxItems?.find(n=>n.id===e);if(t?.type==="project-completion"&&t.coworkSessionId){this.setSessionKey(t.coworkSessionId),this.setTab("chat"),t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug);return}if(t?.source.taskId){this.handleMissionControlOpenTaskSession(t.source.taskId);return}t?.sessionId&&(this.setSessionKey(t.sessionId),this.setTab("chat"))}handleInboxSetScoring(e,t){e!==this.inboxScoringId&&(this.inboxFeedbackText=""),this.inboxScoringId=e,this.inboxScoringValue=t??7}handleInboxFeedbackChange(e){this.inboxFeedbackText=e}handleInboxSortToggle(){this.inboxSortOrder=this.inboxSortOrder==="newest"?"oldest":"newest"}async handleTrustDailyRate(e){if(this.client)try{await this.client.request("trust.dailyRate",{rating:e}),this.trustSummary&&(this.trustSummary={...this.trustSummary,todayRated:!0})}catch(t){console.error("[Trust] Daily rate failed:",t),this.showToast("Failed to submit daily rating","error")}}async handleOpenProofDoc(e){let t="Proof Document",n=null,s=null;if(this.client&&this.connected)try{const i=await this.client.request("proof.get",{slug:e});t=i.title?.trim()||t,n=i.filePath?.trim()||null,s=i.viewUrl?.trim()||null}catch(i){console.warn("[Proof] Failed to resolve document metadata:",i)}this.sidebarOpen=!0,this.sidebarMode="proof",this.sidebarProofSlug=e,this.sidebarProofUrl=s,this.sidebarProofHtml=null,this.sidebarFilePath=n,this.sidebarTitle=t}handleCloseProofDoc(){this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.handleCloseSidebar()}render(){return Su(this)}};d([xa({context:Ja}),u()],l.prototype,"_ctx",2);d([u()],l.prototype,"settings",2);d([u()],l.prototype,"password",2);d([u()],l.prototype,"tab",2);d([u()],l.prototype,"onboarding",2);d([u()],l.prototype,"connected",2);d([u()],l.prototype,"reconnecting",2);d([u()],l.prototype,"reconnectAttempt",2);d([u()],l.prototype,"theme",2);d([u()],l.prototype,"themeResolved",2);d([u()],l.prototype,"hello",2);d([u()],l.prototype,"lastError",2);d([u()],l.prototype,"eventLog",2);d([u()],l.prototype,"assistantName",2);d([u()],l.prototype,"assistantAvatar",2);d([u()],l.prototype,"assistantAgentId",2);d([u()],l.prototype,"userName",2);d([u()],l.prototype,"userAvatar",2);d([u()],l.prototype,"sessionKey",2);d([u()],l.prototype,"sessionPickerOpen",2);d([u()],l.prototype,"sessionPickerPosition",2);d([u()],l.prototype,"sessionPickerSearch",2);d([u()],l.prototype,"sessionSearchOpen",2);d([u()],l.prototype,"sessionSearchPosition",2);d([u()],l.prototype,"sessionSearchQuery",2);d([u()],l.prototype,"sessionSearchResults",2);d([u()],l.prototype,"sessionSearchLoading",2);d([u()],l.prototype,"profilePopoverOpen",2);d([u()],l.prototype,"profileEditName",2);d([u()],l.prototype,"profileEditAvatar",2);d([u()],l.prototype,"editingTabKey",2);d([u()],l.prototype,"chatLoading",2);d([u()],l.prototype,"chatSending",2);d([u()],l.prototype,"chatSendingSessionKey",2);d([u()],l.prototype,"chatMessage",2);d([u()],l.prototype,"chatDrafts",2);d([u()],l.prototype,"chatMessages",2);d([u()],l.prototype,"chatToolMessages",2);d([u()],l.prototype,"chatStream",2);d([u()],l.prototype,"chatStreamStartedAt",2);d([u()],l.prototype,"chatRunId",2);d([u()],l.prototype,"currentToolName",2);d([u()],l.prototype,"currentToolInfo",2);d([u()],l.prototype,"workingSessions",2);d([u()],l.prototype,"compactionStatus",2);d([u()],l.prototype,"chatAvatarUrl",2);d([u()],l.prototype,"chatThinkingLevel",2);d([u()],l.prototype,"chatQueue",2);d([u()],l.prototype,"chatAttachments",2);d([u()],l.prototype,"pendingRetry",2);d([u()],l.prototype,"autoRetryAfterCompact",2);d([u()],l.prototype,"sidebarOpen",2);d([u()],l.prototype,"sidebarContent",2);d([u()],l.prototype,"sidebarError",2);d([u()],l.prototype,"sidebarMimeType",2);d([u()],l.prototype,"sidebarFilePath",2);d([u()],l.prototype,"sidebarTitle",2);d([u()],l.prototype,"sidebarMode",2);d([u()],l.prototype,"sidebarProofSlug",2);d([u()],l.prototype,"sidebarProofUrl",2);d([u()],l.prototype,"sidebarProofHtml",2);d([u()],l.prototype,"splitRatio",2);d([u()],l.prototype,"lightbox",2);d([u()],l.prototype,"driveAccounts",2);d([u()],l.prototype,"showDrivePicker",2);d([u()],l.prototype,"driveUploading",2);d([u()],l.prototype,"updateStatus",2);d([u()],l.prototype,"updateLoading",2);d([u()],l.prototype,"updateError",2);d([u()],l.prototype,"updateLastChecked",2);d([u()],l.prototype,"nodesLoading",2);d([u()],l.prototype,"nodes",2);d([u()],l.prototype,"devicesLoading",2);d([u()],l.prototype,"devicesError",2);d([u()],l.prototype,"devicesList",2);d([u()],l.prototype,"execApprovalsLoading",2);d([u()],l.prototype,"execApprovalsSaving",2);d([u()],l.prototype,"execApprovalsDirty",2);d([u()],l.prototype,"execApprovalsSnapshot",2);d([u()],l.prototype,"execApprovalsForm",2);d([u()],l.prototype,"execApprovalsSelectedAgent",2);d([u()],l.prototype,"execApprovalsTarget",2);d([u()],l.prototype,"execApprovalsTargetNodeId",2);d([u()],l.prototype,"execApprovalQueue",2);d([u()],l.prototype,"execApprovalBusy",2);d([u()],l.prototype,"execApprovalError",2);d([u()],l.prototype,"pendingGatewayUrl",2);d([u()],l.prototype,"gatewayRestartPending",2);d([u()],l.prototype,"gatewayRestartBusy",2);d([u()],l.prototype,"deployPanelOpen",2);d([u()],l.prototype,"configLoading",2);d([u()],l.prototype,"configRaw",2);d([u()],l.prototype,"configRawOriginal",2);d([u()],l.prototype,"configValid",2);d([u()],l.prototype,"configIssues",2);d([u()],l.prototype,"configSaving",2);d([u()],l.prototype,"configApplying",2);d([u()],l.prototype,"updateRunning",2);d([u()],l.prototype,"applySessionKey",2);d([u()],l.prototype,"configSnapshot",2);d([u()],l.prototype,"configSchema",2);d([u()],l.prototype,"configSchemaVersion",2);d([u()],l.prototype,"configSchemaLoading",2);d([u()],l.prototype,"configUiHints",2);d([u()],l.prototype,"configForm",2);d([u()],l.prototype,"configFormOriginal",2);d([u()],l.prototype,"configFormDirty",2);d([u()],l.prototype,"configFormMode",2);d([u()],l.prototype,"configSearchQuery",2);d([u()],l.prototype,"configActiveSection",2);d([u()],l.prototype,"configActiveSubsection",2);d([u()],l.prototype,"channelsLoading",2);d([u()],l.prototype,"channelsSnapshot",2);d([u()],l.prototype,"channelsError",2);d([u()],l.prototype,"channelsLastSuccess",2);d([u()],l.prototype,"whatsappLoginMessage",2);d([u()],l.prototype,"whatsappLoginQrDataUrl",2);d([u()],l.prototype,"whatsappLoginConnected",2);d([u()],l.prototype,"whatsappBusy",2);d([u()],l.prototype,"nostrProfileFormState",2);d([u()],l.prototype,"nostrProfileAccountId",2);d([u()],l.prototype,"presenceLoading",2);d([u()],l.prototype,"presenceEntries",2);d([u()],l.prototype,"presenceError",2);d([u()],l.prototype,"presenceStatus",2);d([u()],l.prototype,"agentsLoading",2);d([u()],l.prototype,"agentsList",2);d([u()],l.prototype,"agentsError",2);d([u()],l.prototype,"sessionsLoading",2);d([u()],l.prototype,"sessionsResult",2);d([u()],l.prototype,"sessionsError",2);d([u()],l.prototype,"sessionsFilterActive",2);d([u()],l.prototype,"sessionsFilterLimit",2);d([u()],l.prototype,"sessionsIncludeGlobal",2);d([u()],l.prototype,"sessionsIncludeUnknown",2);d([u()],l.prototype,"archivedSessions",2);d([u()],l.prototype,"archivedSessionsLoading",2);d([u()],l.prototype,"archivedSessionsExpanded",2);d([u()],l.prototype,"cronLoading",2);d([u()],l.prototype,"cronJobs",2);d([u()],l.prototype,"cronStatus",2);d([u()],l.prototype,"cronError",2);d([u()],l.prototype,"cronForm",2);d([u()],l.prototype,"cronRunsJobId",2);d([u()],l.prototype,"cronRuns",2);d([u()],l.prototype,"cronBusy",2);d([u()],l.prototype,"workspaceNeedsSetup",2);d([u()],l.prototype,"onboardingPhase",2);d([u()],l.prototype,"onboardingData",2);d([u()],l.prototype,"onboardingActive",2);d([u()],l.prototype,"wizardActive",2);d([u()],l.prototype,"wizardState",2);d([u()],l.prototype,"showSetupTab",2);d([u()],l.prototype,"setupCapabilities",2);d([u()],l.prototype,"setupCapabilitiesLoading",2);d([u()],l.prototype,"setupQuickDone",2);d([u()],l.prototype,"onboardingIntegrations",2);d([u()],l.prototype,"onboardingCoreProgress",2);d([u()],l.prototype,"onboardingExpandedCard",2);d([u()],l.prototype,"onboardingLoadingGuide",2);d([u()],l.prototype,"onboardingActiveGuide",2);d([u()],l.prototype,"onboardingTestingId",2);d([u()],l.prototype,"onboardingTestResult",2);d([u()],l.prototype,"onboardingConfigValues",2);d([u()],l.prototype,"onboardingProgress",2);d([u()],l.prototype,"workspaces",2);d([u()],l.prototype,"selectedWorkspace",2);d([u()],l.prototype,"workspacesSearchQuery",2);d([u()],l.prototype,"workspaceItemSearchQuery",2);d([u()],l.prototype,"workspacesLoading",2);d([u()],l.prototype,"workspacesCreateLoading",2);d([u()],l.prototype,"workspacesError",2);d([u()],l.prototype,"workspaceExpandedFolders",2);d([u()],l.prototype,"allTasks",2);d([u()],l.prototype,"taskFilter",2);d([u()],l.prototype,"taskSort",2);d([u()],l.prototype,"taskSearch",2);d([u()],l.prototype,"showCompletedTasks",2);d([u()],l.prototype,"editingTaskId",2);d([u()],l.prototype,"workspaceBrowsePath",2);d([u()],l.prototype,"workspaceBrowseEntries",2);d([u()],l.prototype,"workspaceBreadcrumbs",2);d([u()],l.prototype,"workspaceBrowseSearchQuery",2);d([u()],l.prototype,"workspaceBrowseSearchResults",2);d([u()],l.prototype,"myDayLoading",2);d([u()],l.prototype,"myDayError",2);d([u()],l.prototype,"todaySelectedDate",2);d([u()],l.prototype,"todayViewMode",2);d([u()],l.prototype,"dailyBrief",2);d([u()],l.prototype,"dailyBriefLoading",2);d([u()],l.prototype,"dailyBriefError",2);d([u()],l.prototype,"agentLog",2);d([u()],l.prototype,"agentLogLoading",2);d([u()],l.prototype,"agentLogError",2);d([u()],l.prototype,"briefNotes",2);d([u()],l.prototype,"todayTasks",2);d([u()],l.prototype,"todayTasksLoading",2);d([u()],l.prototype,"todayEditingTaskId",2);d([u()],l.prototype,"todayShowCompleted",2);d([u()],l.prototype,"allyPanelOpen",2);d([u()],l.prototype,"allyMessages",2);d([u()],l.prototype,"allyStream",2);d([u()],l.prototype,"allyDraft",2);d([u()],l.prototype,"allyUnread",2);d([u()],l.prototype,"allySending",2);d([u()],l.prototype,"allyWorking",2);d([u()],l.prototype,"allyAttachments",2);d([u()],l.prototype,"todayQueueResults",2);d([u()],l.prototype,"inboxItems",2);d([u()],l.prototype,"inboxLoading",2);d([u()],l.prototype,"inboxCount",2);d([u()],l.prototype,"inboxScoringId",2);d([u()],l.prototype,"inboxScoringValue",2);d([u()],l.prototype,"inboxFeedbackText",2);d([u()],l.prototype,"inboxSortOrder",2);d([u()],l.prototype,"trustSummary",2);d([u()],l.prototype,"chatPrivateMode",2);d([u()],l.prototype,"privateSessions",2);d([u()],l.prototype,"dynamicSlots",2);d([u()],l.prototype,"workProjects",2);d([u()],l.prototype,"workLoading",2);d([u()],l.prototype,"workError",2);d([u()],l.prototype,"workExpandedProjects",2);d([u()],l.prototype,"workProjectFiles",2);d([u()],l.prototype,"workDetailLoading",2);d([u()],l.prototype,"workResources",2);d([u()],l.prototype,"workResourcesLoading",2);d([u()],l.prototype,"workResourceFilter",2);d([u()],l.prototype,"sessionResources",2);d([u()],l.prototype,"sessionResourcesCollapsed",2);d([u()],l.prototype,"skillsLoading",2);d([u()],l.prototype,"skillsReport",2);d([u()],l.prototype,"skillsError",2);d([u()],l.prototype,"skillsFilter",2);d([u()],l.prototype,"skillEdits",2);d([u()],l.prototype,"skillsBusyKey",2);d([u()],l.prototype,"skillMessages",2);d([u()],l.prototype,"skillsSubTab",2);d([u()],l.prototype,"godmodeSkills",2);d([u()],l.prototype,"godmodeSkillsLoading",2);d([u()],l.prototype,"expandedSkills",2);d([u()],l.prototype,"rosterData",2);d([u()],l.prototype,"rosterLoading",2);d([u()],l.prototype,"rosterError",2);d([u()],l.prototype,"rosterFilter",2);d([u()],l.prototype,"expandedAgents",2);d([u()],l.prototype,"debugLoading",2);d([u()],l.prototype,"debugStatus",2);d([u()],l.prototype,"debugHealth",2);d([u()],l.prototype,"debugModels",2);d([u()],l.prototype,"debugHeartbeat",2);d([u()],l.prototype,"debugCallMethod",2);d([u()],l.prototype,"debugCallParams",2);d([u()],l.prototype,"debugCallResult",2);d([u()],l.prototype,"debugCallError",2);d([u()],l.prototype,"logsLoading",2);d([u()],l.prototype,"logsError",2);d([u()],l.prototype,"logsFile",2);d([u()],l.prototype,"logsEntries",2);d([u()],l.prototype,"logsFilterText",2);d([u()],l.prototype,"logsLevelFilters",2);d([u()],l.prototype,"logsAutoFollow",2);d([u()],l.prototype,"logsTruncated",2);d([u()],l.prototype,"logsCursor",2);d([u()],l.prototype,"logsLastFetchAt",2);d([u()],l.prototype,"logsLimit",2);d([u()],l.prototype,"logsMaxBytes",2);d([u()],l.prototype,"logsAtBottom",2);d([u()],l.prototype,"toasts",2);d([u()],l.prototype,"chatUserNearBottom",2);d([u()],l.prototype,"chatNewMessagesBelow",2);d([u()],l.prototype,"consciousnessStatus",2);d([u()],l.prototype,"focusPulseData",2);d([u()],l.prototype,"trustTrackerData",2);d([u()],l.prototype,"trustTrackerLoading",2);d([u()],l.prototype,"guardrailsData",2);d([u()],l.prototype,"guardrailsLoading",2);d([u()],l.prototype,"guardrailsShowAddForm",2);d([u()],l.prototype,"missionControlData",2);d([u()],l.prototype,"missionControlLoading",2);d([u()],l.prototype,"missionControlError",2);d([u()],l.prototype,"missionControlFullControl",2);d([u()],l.prototype,"godmodeOptions",2);d([u()],l.prototype,"godmodeOptionsLoading",2);d([u()],l.prototype,"dashboardsList",2);d([u()],l.prototype,"dashboardsLoading",2);d([u()],l.prototype,"dashboardsError",2);d([u()],l.prototype,"activeDashboardId",2);d([u()],l.prototype,"activeDashboardHtml",2);d([u()],l.prototype,"activeDashboardManifest",2);d([u()],l.prototype,"dashboardChatOpen",2);d([u()],l.prototype,"dashboardCategoryFilter",2);d([u()],l.prototype,"secondBrainSubtab",2);d([u()],l.prototype,"secondBrainLoading",2);d([u()],l.prototype,"secondBrainError",2);d([u()],l.prototype,"secondBrainIdentity",2);d([u()],l.prototype,"secondBrainMemoryBank",2);d([u()],l.prototype,"secondBrainAiPacket",2);d([u()],l.prototype,"secondBrainSourcesData",2);d([u()],l.prototype,"secondBrainResearchData",2);d([u()],l.prototype,"secondBrainSelectedEntry",2);d([u()],l.prototype,"secondBrainSearchQuery",2);d([u()],l.prototype,"secondBrainSyncing",2);d([u()],l.prototype,"secondBrainBrowsingFolder",2);d([u()],l.prototype,"secondBrainFolderEntries",2);d([u()],l.prototype,"secondBrainFolderName",2);d([u()],l.prototype,"secondBrainVaultHealth",2);d([u()],l.prototype,"secondBrainFileTree",2);d([u()],l.prototype,"secondBrainFileTreeLoading",2);d([u()],l.prototype,"secondBrainFileSearchQuery",2);d([u()],l.prototype,"secondBrainFileSearchResults",2);l=d([hs("godmode-app")],l);export{St as a,pc as b,sc as c,ic as d,ac as e,cc as f,fc as g,tt as h,yc as i,gc as j,vc as k,et as l,wc as m,bc as n,Ja as o,We as p,ke as q,Zl as r,tc as s,nc as t,mc as u,zl as v,ai as w,ni as x,zu as y};
