import{A as u,b as n,o as _n}from"./lit-core-CTInmNPB.js";import{t as Sn,f as L,a as He,b as Ya,c as Dt,d as je}from"./ctrl-settings-CAPtX3NX.js";import{g as We}from"./markdown-i_gIkIP3.js";function Cn(e){const{values:t,original:a}=e;return t.name!==a.name||t.displayName!==a.displayName||t.about!==a.about||t.picture!==a.picture||t.banner!==a.banner||t.website!==a.website||t.nip05!==a.nip05||t.lud16!==a.lud16}function Tn(e){const{state:t,callbacks:a,accountId:s}=e,i=Cn(t),l=(r,d,v={})=>{const{type:p="text",placeholder:g,maxLength:h,help:$}=v,b=t.values[r]??"",y=t.fieldErrors[r],f=`nostr-profile-${r}`;return p==="textarea"?n`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${f}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${d}
          </label>
          <textarea
            id="${f}"
            .value=${b}
            placeholder=${g??""}
            maxlength=${h??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${w=>{const C=w.target;a.onFieldChange(r,C.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${$?n`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${$}</div>`:u}
          ${y?n`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${y}</div>`:u}
        </div>
      `:n`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${f}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${d}
        </label>
        <input
          id="${f}"
          type=${p}
          .value=${b}
          placeholder=${g??""}
          maxlength=${h??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${w=>{const C=w.target;a.onFieldChange(r,C.value)}}
          ?disabled=${t.saving}
        />
        ${$?n`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${$}</div>`:u}
        ${y?n`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${y}</div>`:u}
      </div>
    `},o=()=>{const r=t.values.picture;return r?n`
      <div style="margin-bottom: 12px;">
        <img
          src=${r}
          alt="Profile picture preview"
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${d=>{const v=d.target;v.style.display="none"}}
          @load=${d=>{const v=d.target;v.style.display="block"}}
        />
      </div>
    `:u};return n`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${s}</div>
      </div>

      ${t.error?n`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:u}

      ${t.success?n`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:u}

      ${o()}

      ${l("name","Username",{placeholder:"satoshi",maxLength:256,help:"Short username (e.g., satoshi)"})}

      ${l("displayName","Display Name",{placeholder:"Satoshi Nakamoto",maxLength:256,help:"Your full display name"})}

      ${l("about","Bio",{type:"textarea",placeholder:"Tell people about yourself...",maxLength:2e3,help:"A brief bio or description"})}

      ${l("picture","Avatar URL",{type:"url",placeholder:"https://example.com/avatar.jpg",help:"HTTPS URL to your profile picture"})}

      ${t.showAdvanced?n`
            <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
              <div style="font-weight: 500; margin-bottom: 12px; color: var(--text-muted);">Advanced</div>

              ${l("banner","Banner URL",{type:"url",placeholder:"https://example.com/banner.jpg",help:"HTTPS URL to a banner image"})}

              ${l("website","Website",{type:"url",placeholder:"https://example.com",help:"Your personal website"})}

              ${l("nip05","NIP-05 Identifier",{placeholder:"you@example.com",help:"Verifiable identifier (e.g., you@domain.com)"})}

              ${l("lud16","Lightning Address",{placeholder:"you@getalby.com",help:"Lightning address for tips (LUD-16)"})}
            </div>
          `:u}

      <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
        <button
          class="btn primary"
          @click=${a.onSave}
          ?disabled=${t.saving||!i}
        >
          ${t.saving?"Saving...":"Save & Publish"}
        </button>

        <button
          class="btn"
          @click=${a.onImport}
          ?disabled=${t.importing||t.saving}
        >
          ${t.importing?"Importing...":"Import from Relays"}
        </button>

        <button
          class="btn"
          @click=${a.onToggleAdvanced}
        >
          ${t.showAdvanced?"Hide Advanced":"Show Advanced"}
        </button>

        <button
          class="btn"
          @click=${a.onCancel}
          ?disabled=${t.saving}
        >
          Cancel
        </button>
      </div>

      ${i?n`
              <div style="font-size: 12px; color: var(--warning-color); margin-top: 8px">
                You have unsaved changes
              </div>
            `:u}
    </div>
  `}function fo(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}const ho=[{label:"",tabs:["chat","today","team","workspaces","memory","dashboards"]},{label:"Settings",tabs:["overview","config","connections","skills","agents","trust","guardrails"]}],mo=[{label:"System",tabs:["channels","sessions","cron","debug"]}],bo=new Set([]),Ka={onboarding:"/onboarding",workspaces:"/workspaces",today:"/today",team:"/team",connections:"/connections",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",agents:"/agents",nodes:"/nodes",chat:"/chat",trust:"/trust",guardrails:"/guardrails",config:"/config",debug:"/debug",logs:"/logs",memory:"/memory",brain:"/brain","second-brain":"/second-brain",dashboards:"/dashboards",overview:"/overview"},K=new Map(Object.entries(Ka).map(([e,t])=>[t,e]));K.set("/my-day","today");K.set("/work","workspaces");K.set("/setup","onboarding");K.set("/mission-control","dashboards");K.set("/second-brain","memory");K.set("/brain","memory");function qa(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function Pt(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}const it=new Set;function yo(e){it.add(e),K.set(`/${e}`,e)}function $o(e){it.delete(e),K.delete(`/${e}`)}function wo(e){return it.has(e)}function xo(){return[...it]}function En(e,t=""){const a=qa(t),s=Ka[e]??`/${e}`;return a?`${a}${s}`:s}function ko(e,t=""){const a=qa(t);let s=e||"/";a&&(s===a?s="/":s.startsWith(`${a}/`)&&(s=s.slice(a.length)));let i=Pt(s).toLowerCase();return i.endsWith("/index.html")&&(i="/"),i==="/"?"chat":K.get(i)??null}function Ao(e){let t=Pt(e);if(t.endsWith("/index.html")&&(t=Pt(t.slice(0,-11))),t==="/")return"";const a=t.split("/").filter(Boolean);if(a.length===0)return"";for(let s=0;s<a.length;s++){const i=`/${a.slice(s).join("/")}`.toLowerCase();if(K.has(i)){const l=a.slice(0,s);return!l.length||l.some(r=>K.has(`/${r.toLowerCase()}`))?"":`/${l.join("/")}`}}return`/${a.join("/")}`}function _o(e){switch(e){case"onboarding":return"Connect Your World";case"chat":return"Chat";case"today":return"Today";case"team":return"Team";case"workspaces":return"Workspaces";case"connections":return"Connections";case"channels":return"Integrations";case"instances":return"Devices";case"sessions":return"Sessions";case"cron":return"Schedules";case"skills":return"Skills";case"agents":return"Agents";case"nodes":return"Network";case"trust":return"Trust";case"guardrails":return"Safety";case"memory":return"Memory";case"brain":return"Brain";case"second-brain":return"Second Brain";case"dashboards":return"Dashboards";case"overview":return"Overview";case"config":return"Settings";case"debug":return"Developer";case"logs":return"Logs";default:return"Control"}}function So(e){switch(e){case"onboarding":return"🧭";case"chat":return"💬";case"today":return"☀️";case"team":return"🤖";case"workspaces":return"📂";case"connections":return"🔌";case"channels":return"🔗";case"instances":return"📡";case"sessions":return"📄";case"cron":return"⏰";case"skills":return"🧩";case"agents":return"🤖";case"nodes":return"🖥️";case"trust":return"🛡️";case"guardrails":return"🚧";case"memory":case"brain":case"second-brain":return"🧠";case"dashboards":return"📊";case"overview":return"ℹ️";case"config":return"⚙️";case"debug":return"🐛";case"logs":return"📜";default:return"📁"}}function Co(e){switch(e){case"onboarding":return"Set up the integrations that power your daily brief and agent features. Everything is optional.";case"chat":return"Your command center. Ask anything, customize any view.";case"today":return"Calendar, brief, tasks, and schedule for the day.";case"workspaces":return"Projects, clients, and personal operating context.";case"connections":return"Your integrations and third-party connections.";case"channels":return"Connected apps — iMessage, Slack, email, calendar, and more.";case"instances":return"Your connected devices and where GodMode is running.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Recurring tasks — daily briefs, overnight agents, and timed automations.";case"skills":return"Manage your skills, discover new ones from ClawHub, and personalize them for your workflow.";case"agents":return"Your agent roster — sub-agents that handle queue tasks, grouped by category.";case"nodes":return"Devices in your GodMode network and what they can do.";case"trust":return"Scores build automatically as you use and rate skills.";case"guardrails":return"Boundaries that keep agents focused, honest, and within scope.";case"memory":return"Your Memory — identity, people, knowledge, and live AI context.";case"brain":return"Your Brain — identity, people, knowledge, and live AI context.";case"second-brain":return"Your Second Brain — identity, knowledge, and live AI context. Stores what your ally needs to act on your behalf.";case"dashboards":return"Custom data views built by your AI ally — remix anything.";case"team":return"Your AI agent team — orchestrated by Paperclip.";case"overview":return"Version info, gateway status, and updates.";case"config":return"Core settings — model, plugins, and API configuration.";case"debug":return"Gateway internals, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}const{entries:Ja,setPrototypeOf:ga,isFrozen:Mn,getPrototypeOf:Ln,getOwnPropertyDescriptor:Rn}=Object;let{freeze:H,seal:Y,create:nt}=Object,{apply:It,construct:zt}=typeof Reflect<"u"&&Reflect;H||(H=function(t){return t});Y||(Y=function(t){return t});It||(It=function(t,a){for(var s=arguments.length,i=new Array(s>2?s-2:0),l=2;l<s;l++)i[l-2]=arguments[l];return t.apply(a,i)});zt||(zt=function(t){for(var a=arguments.length,s=new Array(a>1?a-1:0),i=1;i<a;i++)s[i-1]=arguments[i];return new t(...s)});const tt=j(Array.prototype.forEach),Nn=j(Array.prototype.lastIndexOf),fa=j(Array.prototype.pop),Re=j(Array.prototype.push),Dn=j(Array.prototype.splice),st=j(String.prototype.toLowerCase),xt=j(String.prototype.toString),kt=j(String.prototype.match),Ne=j(String.prototype.replace),Pn=j(String.prototype.indexOf),In=j(String.prototype.trim),V=j(Object.prototype.hasOwnProperty),U=j(RegExp.prototype.test),De=zn(TypeError);function j(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var a=arguments.length,s=new Array(a>1?a-1:0),i=1;i<a;i++)s[i-1]=arguments[i];return It(e,t,s)}}function zn(e){return function(){for(var t=arguments.length,a=new Array(t),s=0;s<t;s++)a[s]=arguments[s];return zt(e,a)}}function E(e,t){let a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:st;ga&&ga(e,null);let s=t.length;for(;s--;){let i=t[s];if(typeof i=="string"){const l=a(i);l!==i&&(Mn(t)||(t[s]=l),i=l)}e[i]=!0}return e}function On(e){for(let t=0;t<e.length;t++)V(e,t)||(e[t]=null);return e}function X(e){const t=nt(null);for(const[a,s]of Ja(e))V(e,a)&&(Array.isArray(s)?t[a]=On(s):s&&typeof s=="object"&&s.constructor===Object?t[a]=X(s):t[a]=s);return t}function Pe(e,t){for(;e!==null;){const s=Rn(e,t);if(s){if(s.get)return j(s.get);if(typeof s.value=="function")return j(s.value)}e=Ln(e)}function a(){return null}return a}const ha=H(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),At=H(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),_t=H(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Bn=H(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),St=H(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Fn=H(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),ma=H(["#text"]),ba=H(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Ct=H(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),ya=H(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),at=H(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Un=Y(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Hn=Y(/<%[\w\W]*|[\w\W]*%>/gm),jn=Y(/\$\{[\w\W]*/gm),Wn=Y(/^data-[\-\w.\u00B7-\uFFFF]+$/),Vn=Y(/^aria-[\-\w]+$/),Xa=Y(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Gn=Y(/^(?:\w+script|data):/i),Yn=Y(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Za=Y(/^html$/i),Kn=Y(/^[a-z][.\w]*(-[.\w]+)+$/i);var $a=Object.freeze({__proto__:null,ARIA_ATTR:Vn,ATTR_WHITESPACE:Yn,CUSTOM_ELEMENT:Kn,DATA_ATTR:Wn,DOCTYPE_NAME:Za,ERB_EXPR:Hn,IS_ALLOWED_URI:Xa,IS_SCRIPT_OR_DATA:Gn,MUSTACHE_EXPR:Un,TMPLIT_EXPR:jn});const Ie={element:1,text:3,progressingInstruction:7,comment:8,document:9},qn=function(){return typeof window>"u"?null:window},Jn=function(t,a){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const i="data-tt-policy-suffix";a&&a.hasAttribute(i)&&(s=a.getAttribute(i));const l="dompurify"+(s?"#"+s:"");try{return t.createPolicy(l,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+l+" could not be created."),null}},wa=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Qa(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:qn();const t=A=>Qa(A);if(t.version="3.3.3",t.removed=[],!e||!e.document||e.document.nodeType!==Ie.document||!e.Element)return t.isSupported=!1,t;let{document:a}=e;const s=a,i=s.currentScript,{DocumentFragment:l,HTMLTemplateElement:o,Node:r,Element:d,NodeFilter:v,NamedNodeMap:p=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:g,DOMParser:h,trustedTypes:$}=e,b=d.prototype,y=Pe(b,"cloneNode"),f=Pe(b,"remove"),w=Pe(b,"nextSibling"),C=Pe(b,"childNodes"),T=Pe(b,"parentNode");if(typeof o=="function"){const A=a.createElement("template");A.content&&A.content.ownerDocument&&(a=A.content.ownerDocument)}let k,_="";const{implementation:M,createNodeIterator:S,createDocumentFragment:pe,getElementsByTagName:ot}=a,{importNode:pn}=s;let F=wa();t.isSupported=typeof Ja=="function"&&typeof T=="function"&&M&&M.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:rt,ERB_EXPR:ct,TMPLIT_EXPR:dt,DATA_ATTR:vn,ARIA_ATTR:gn,IS_SCRIPT_OR_DATA:fn,ATTR_WHITESPACE:Wt,CUSTOM_ELEMENT:hn}=$a;let{IS_ALLOWED_URI:Vt}=$a,I=null;const Gt=E({},[...ha,...At,..._t,...St,...ma]);let z=null;const Yt=E({},[...ba,...Ct,...ya,...at]);let N=Object.seal(nt(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Ee=null,Ye=null;const re=Object.seal(nt(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Kt=!0,ut=!0,qt=!1,Jt=!0,be=!1,Ke=!0,ve=!1,pt=!1,vt=!1,ye=!1,qe=!1,Je=!1,Xt=!0,Zt=!1;const mn="user-content-";let gt=!0,Me=!1,$e={},q=null;const ft=E({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Qt=null;const ea=E({},["audio","video","img","source","image","track"]);let ht=null;const ta=E({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Xe="http://www.w3.org/1998/Math/MathML",Ze="http://www.w3.org/2000/svg",ee="http://www.w3.org/1999/xhtml";let we=ee,mt=!1,bt=null;const bn=E({},[Xe,Ze,ee],xt);let Qe=E({},["mi","mo","mn","ms","mtext"]),et=E({},["annotation-xml"]);const yn=E({},["title","style","font","a","script"]);let Le=null;const $n=["application/xhtml+xml","text/html"],wn="text/html";let P=null,xe=null;const xn=a.createElement("form"),aa=function(c){return c instanceof RegExp||c instanceof Function},yt=function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(xe&&xe===c)){if((!c||typeof c!="object")&&(c={}),c=X(c),Le=$n.indexOf(c.PARSER_MEDIA_TYPE)===-1?wn:c.PARSER_MEDIA_TYPE,P=Le==="application/xhtml+xml"?xt:st,I=V(c,"ALLOWED_TAGS")?E({},c.ALLOWED_TAGS,P):Gt,z=V(c,"ALLOWED_ATTR")?E({},c.ALLOWED_ATTR,P):Yt,bt=V(c,"ALLOWED_NAMESPACES")?E({},c.ALLOWED_NAMESPACES,xt):bn,ht=V(c,"ADD_URI_SAFE_ATTR")?E(X(ta),c.ADD_URI_SAFE_ATTR,P):ta,Qt=V(c,"ADD_DATA_URI_TAGS")?E(X(ea),c.ADD_DATA_URI_TAGS,P):ea,q=V(c,"FORBID_CONTENTS")?E({},c.FORBID_CONTENTS,P):ft,Ee=V(c,"FORBID_TAGS")?E({},c.FORBID_TAGS,P):X({}),Ye=V(c,"FORBID_ATTR")?E({},c.FORBID_ATTR,P):X({}),$e=V(c,"USE_PROFILES")?c.USE_PROFILES:!1,Kt=c.ALLOW_ARIA_ATTR!==!1,ut=c.ALLOW_DATA_ATTR!==!1,qt=c.ALLOW_UNKNOWN_PROTOCOLS||!1,Jt=c.ALLOW_SELF_CLOSE_IN_ATTR!==!1,be=c.SAFE_FOR_TEMPLATES||!1,Ke=c.SAFE_FOR_XML!==!1,ve=c.WHOLE_DOCUMENT||!1,ye=c.RETURN_DOM||!1,qe=c.RETURN_DOM_FRAGMENT||!1,Je=c.RETURN_TRUSTED_TYPE||!1,vt=c.FORCE_BODY||!1,Xt=c.SANITIZE_DOM!==!1,Zt=c.SANITIZE_NAMED_PROPS||!1,gt=c.KEEP_CONTENT!==!1,Me=c.IN_PLACE||!1,Vt=c.ALLOWED_URI_REGEXP||Xa,we=c.NAMESPACE||ee,Qe=c.MATHML_TEXT_INTEGRATION_POINTS||Qe,et=c.HTML_INTEGRATION_POINTS||et,N=c.CUSTOM_ELEMENT_HANDLING||{},c.CUSTOM_ELEMENT_HANDLING&&aa(c.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(N.tagNameCheck=c.CUSTOM_ELEMENT_HANDLING.tagNameCheck),c.CUSTOM_ELEMENT_HANDLING&&aa(c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(N.attributeNameCheck=c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),c.CUSTOM_ELEMENT_HANDLING&&typeof c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(N.allowCustomizedBuiltInElements=c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),be&&(ut=!1),qe&&(ye=!0),$e&&(I=E({},ma),z=nt(null),$e.html===!0&&(E(I,ha),E(z,ba)),$e.svg===!0&&(E(I,At),E(z,Ct),E(z,at)),$e.svgFilters===!0&&(E(I,_t),E(z,Ct),E(z,at)),$e.mathMl===!0&&(E(I,St),E(z,ya),E(z,at))),V(c,"ADD_TAGS")||(re.tagCheck=null),V(c,"ADD_ATTR")||(re.attributeCheck=null),c.ADD_TAGS&&(typeof c.ADD_TAGS=="function"?re.tagCheck=c.ADD_TAGS:(I===Gt&&(I=X(I)),E(I,c.ADD_TAGS,P))),c.ADD_ATTR&&(typeof c.ADD_ATTR=="function"?re.attributeCheck=c.ADD_ATTR:(z===Yt&&(z=X(z)),E(z,c.ADD_ATTR,P))),c.ADD_URI_SAFE_ATTR&&E(ht,c.ADD_URI_SAFE_ATTR,P),c.FORBID_CONTENTS&&(q===ft&&(q=X(q)),E(q,c.FORBID_CONTENTS,P)),c.ADD_FORBID_CONTENTS&&(q===ft&&(q=X(q)),E(q,c.ADD_FORBID_CONTENTS,P)),gt&&(I["#text"]=!0),ve&&E(I,["html","head","body"]),I.table&&(E(I,["tbody"]),delete Ee.tbody),c.TRUSTED_TYPES_POLICY){if(typeof c.TRUSTED_TYPES_POLICY.createHTML!="function")throw De('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof c.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw De('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');k=c.TRUSTED_TYPES_POLICY,_=k.createHTML("")}else k===void 0&&(k=Jn($,i)),k!==null&&typeof _=="string"&&(_=k.createHTML(""));H&&H(c),xe=c}},na=E({},[...At,..._t,...Bn]),sa=E({},[...St,...Fn]),kn=function(c){let m=T(c);(!m||!m.tagName)&&(m={namespaceURI:we,tagName:"template"});const x=st(c.tagName),R=st(m.tagName);return bt[c.namespaceURI]?c.namespaceURI===Ze?m.namespaceURI===ee?x==="svg":m.namespaceURI===Xe?x==="svg"&&(R==="annotation-xml"||Qe[R]):!!na[x]:c.namespaceURI===Xe?m.namespaceURI===ee?x==="math":m.namespaceURI===Ze?x==="math"&&et[R]:!!sa[x]:c.namespaceURI===ee?m.namespaceURI===Ze&&!et[R]||m.namespaceURI===Xe&&!Qe[R]?!1:!sa[x]&&(yn[x]||!na[x]):!!(Le==="application/xhtml+xml"&&bt[c.namespaceURI]):!1},J=function(c){Re(t.removed,{element:c});try{T(c).removeChild(c)}catch{f(c)}},ge=function(c,m){try{Re(t.removed,{attribute:m.getAttributeNode(c),from:m})}catch{Re(t.removed,{attribute:null,from:m})}if(m.removeAttribute(c),c==="is")if(ye||qe)try{J(m)}catch{}else try{m.setAttribute(c,"")}catch{}},ia=function(c){let m=null,x=null;if(vt)c="<remove></remove>"+c;else{const D=kt(c,/^[\r\n\t ]+/);x=D&&D[0]}Le==="application/xhtml+xml"&&we===ee&&(c='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+c+"</body></html>");const R=k?k.createHTML(c):c;if(we===ee)try{m=new h().parseFromString(R,Le)}catch{}if(!m||!m.documentElement){m=M.createDocument(we,"template",null);try{m.documentElement.innerHTML=mt?_:R}catch{}}const B=m.body||m.documentElement;return c&&x&&B.insertBefore(a.createTextNode(x),B.childNodes[0]||null),we===ee?ot.call(m,ve?"html":"body")[0]:ve?m.documentElement:B},la=function(c){return S.call(c.ownerDocument||c,c,v.SHOW_ELEMENT|v.SHOW_COMMENT|v.SHOW_TEXT|v.SHOW_PROCESSING_INSTRUCTION|v.SHOW_CDATA_SECTION,null)},$t=function(c){return c instanceof g&&(typeof c.nodeName!="string"||typeof c.textContent!="string"||typeof c.removeChild!="function"||!(c.attributes instanceof p)||typeof c.removeAttribute!="function"||typeof c.setAttribute!="function"||typeof c.namespaceURI!="string"||typeof c.insertBefore!="function"||typeof c.hasChildNodes!="function")},oa=function(c){return typeof r=="function"&&c instanceof r};function te(A,c,m){tt(A,x=>{x.call(t,c,m,xe)})}const ra=function(c){let m=null;if(te(F.beforeSanitizeElements,c,null),$t(c))return J(c),!0;const x=P(c.nodeName);if(te(F.uponSanitizeElement,c,{tagName:x,allowedTags:I}),Ke&&c.hasChildNodes()&&!oa(c.firstElementChild)&&U(/<[/\w!]/g,c.innerHTML)&&U(/<[/\w!]/g,c.textContent)||c.nodeType===Ie.progressingInstruction||Ke&&c.nodeType===Ie.comment&&U(/<[/\w]/g,c.data))return J(c),!0;if(!(re.tagCheck instanceof Function&&re.tagCheck(x))&&(!I[x]||Ee[x])){if(!Ee[x]&&da(x)&&(N.tagNameCheck instanceof RegExp&&U(N.tagNameCheck,x)||N.tagNameCheck instanceof Function&&N.tagNameCheck(x)))return!1;if(gt&&!q[x]){const R=T(c)||c.parentNode,B=C(c)||c.childNodes;if(B&&R){const D=B.length;for(let W=D-1;W>=0;--W){const ae=y(B[W],!0);ae.__removalCount=(c.__removalCount||0)+1,R.insertBefore(ae,w(c))}}}return J(c),!0}return c instanceof d&&!kn(c)||(x==="noscript"||x==="noembed"||x==="noframes")&&U(/<\/no(script|embed|frames)/i,c.innerHTML)?(J(c),!0):(be&&c.nodeType===Ie.text&&(m=c.textContent,tt([rt,ct,dt],R=>{m=Ne(m,R," ")}),c.textContent!==m&&(Re(t.removed,{element:c.cloneNode()}),c.textContent=m)),te(F.afterSanitizeElements,c,null),!1)},ca=function(c,m,x){if(Ye[m]||Xt&&(m==="id"||m==="name")&&(x in a||x in xn))return!1;if(!(ut&&!Ye[m]&&U(vn,m))){if(!(Kt&&U(gn,m))){if(!(re.attributeCheck instanceof Function&&re.attributeCheck(m,c))){if(!z[m]||Ye[m]){if(!(da(c)&&(N.tagNameCheck instanceof RegExp&&U(N.tagNameCheck,c)||N.tagNameCheck instanceof Function&&N.tagNameCheck(c))&&(N.attributeNameCheck instanceof RegExp&&U(N.attributeNameCheck,m)||N.attributeNameCheck instanceof Function&&N.attributeNameCheck(m,c))||m==="is"&&N.allowCustomizedBuiltInElements&&(N.tagNameCheck instanceof RegExp&&U(N.tagNameCheck,x)||N.tagNameCheck instanceof Function&&N.tagNameCheck(x))))return!1}else if(!ht[m]){if(!U(Vt,Ne(x,Wt,""))){if(!((m==="src"||m==="xlink:href"||m==="href")&&c!=="script"&&Pn(x,"data:")===0&&Qt[c])){if(!(qt&&!U(fn,Ne(x,Wt,"")))){if(x)return!1}}}}}}}return!0},da=function(c){return c!=="annotation-xml"&&kt(c,hn)},ua=function(c){te(F.beforeSanitizeAttributes,c,null);const{attributes:m}=c;if(!m||$t(c))return;const x={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:z,forceKeepAttr:void 0};let R=m.length;for(;R--;){const B=m[R],{name:D,namespaceURI:W,value:ae}=B,ke=P(D),wt=ae;let O=D==="value"?wt:In(wt);if(x.attrName=ke,x.attrValue=O,x.keepAttr=!0,x.forceKeepAttr=void 0,te(F.uponSanitizeAttribute,c,x),O=x.attrValue,Zt&&(ke==="id"||ke==="name")&&(ge(D,c),O=mn+O),Ke&&U(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,O)){ge(D,c);continue}if(ke==="attributename"&&kt(O,"href")){ge(D,c);continue}if(x.forceKeepAttr)continue;if(!x.keepAttr){ge(D,c);continue}if(!Jt&&U(/\/>/i,O)){ge(D,c);continue}be&&tt([rt,ct,dt],va=>{O=Ne(O,va," ")});const pa=P(c.nodeName);if(!ca(pa,ke,O)){ge(D,c);continue}if(k&&typeof $=="object"&&typeof $.getAttributeType=="function"&&!W)switch($.getAttributeType(pa,ke)){case"TrustedHTML":{O=k.createHTML(O);break}case"TrustedScriptURL":{O=k.createScriptURL(O);break}}if(O!==wt)try{W?c.setAttributeNS(W,D,O):c.setAttribute(D,O),$t(c)?J(c):fa(t.removed)}catch{ge(D,c)}}te(F.afterSanitizeAttributes,c,null)},An=function A(c){let m=null;const x=la(c);for(te(F.beforeSanitizeShadowDOM,c,null);m=x.nextNode();)te(F.uponSanitizeShadowNode,m,null),ra(m),ua(m),m.content instanceof l&&A(m.content);te(F.afterSanitizeShadowDOM,c,null)};return t.sanitize=function(A){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},m=null,x=null,R=null,B=null;if(mt=!A,mt&&(A="<!-->"),typeof A!="string"&&!oa(A))if(typeof A.toString=="function"){if(A=A.toString(),typeof A!="string")throw De("dirty is not a string, aborting")}else throw De("toString is not a function");if(!t.isSupported)return A;if(pt||yt(c),t.removed=[],typeof A=="string"&&(Me=!1),Me){if(A.nodeName){const ae=P(A.nodeName);if(!I[ae]||Ee[ae])throw De("root node is forbidden and cannot be sanitized in-place")}}else if(A instanceof r)m=ia("<!---->"),x=m.ownerDocument.importNode(A,!0),x.nodeType===Ie.element&&x.nodeName==="BODY"||x.nodeName==="HTML"?m=x:m.appendChild(x);else{if(!ye&&!be&&!ve&&A.indexOf("<")===-1)return k&&Je?k.createHTML(A):A;if(m=ia(A),!m)return ye?null:Je?_:""}m&&vt&&J(m.firstChild);const D=la(Me?A:m);for(;R=D.nextNode();)ra(R),ua(R),R.content instanceof l&&An(R.content);if(Me)return A;if(ye){if(qe)for(B=pe.call(m.ownerDocument);m.firstChild;)B.appendChild(m.firstChild);else B=m;return(z.shadowroot||z.shadowrootmode)&&(B=pn.call(s,B,!0)),B}let W=ve?m.outerHTML:m.innerHTML;return ve&&I["!doctype"]&&m.ownerDocument&&m.ownerDocument.doctype&&m.ownerDocument.doctype.name&&U(Za,m.ownerDocument.doctype.name)&&(W="<!DOCTYPE "+m.ownerDocument.doctype.name+`>
`+W),be&&tt([rt,ct,dt],ae=>{W=Ne(W,ae," ")}),k&&Je?k.createHTML(W):W},t.setConfig=function(){let A=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};yt(A),pt=!0},t.clearConfig=function(){xe=null,pt=!1},t.isValidAttribute=function(A,c,m){xe||yt({});const x=P(A),R=P(c);return ca(x,R,m)},t.addHook=function(A,c){typeof c=="function"&&Re(F[A],c)},t.removeHook=function(A,c){if(c!==void 0){const m=Nn(F[A],c);return m===-1?void 0:Dn(F[A],m,1)[0]}return fa(F[A])},t.removeHooks=function(A){F[A]=[]},t.removeAllHooks=function(){F=wa()},t}var de=Qa();We.setOptions({gfm:!0,breaks:!0,mangle:!1});const Xn=/\.(html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log|mp4|mov|mkv|avi|webm|mp3|wav|aac|ogg|flac|zip|tar|gz|bz2|dmg|iso|doc|docx|xls|xlsx|ppt|pptx)$/i,Zn=new RegExp("(?<![(\\[`~]|:\\/\\/)(?:~\\/|\\/(?:Users|home|tmp|var|opt|etc|godmode)\\/)[\\w/.+@-]+(?:\\.\\w+|\\/)(?=\\s|[),;:!?]|$)","g"),Qn=new RegExp("(?<![(\\[`/~\\w-])(?:[\\w][\\w.-]*\\.(?:html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log|mp4|mov|mkv|avi|webm|mp3|wav|aac|ogg|flac|zip|tar|gz|bz2|dmg|iso|doc|docx|xls|xlsx|ppt|pptx))(?=\\s|[),;:!?|]|$)","gi");function Ot(e){const t=e.split(/(```[\s\S]*?```|`[^`\n]+`)/g);for(let a=0;a<t.length;a++)a%2===0&&(t[a]=t[a].replace(Zn,(s,i,l)=>{if(l.slice(Math.max(0,i-3),i).includes("://")||l.slice(Math.max(0,i-3),i).includes("]("))return s;const d=s.endsWith("/");if(!d&&!Xn.test(s))return s;const v=s.startsWith("~/")?`file:///~/${s.slice(2)}`:`file://${s}`,p=s.replace(/\/+$/,"").split("/");return`[${d?(p.pop()??s)+"/":p.pop()??s}](${v})`}),t[a]=t[a].replace(Qn,(s,i,l)=>{const o=l.slice(0,i),r=o.lastIndexOf("["),d=o.lastIndexOf("]");if(r>d)return s;const v=o.lastIndexOf("("),p=o.lastIndexOf(")");return v>p?s:`[${s}](godmode-file://${encodeURIComponent(s)})`}));return t.join("")}const _e=["a","article","aside","b","blockquote","br","caption","col","colgroup","code","div","del","details","em","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","hr","img","i","input","li","main","nav","ol","p","pre","section","span","strong","sub","sup","summary","table","tbody","td","th","thead","tr","ul"],Se=["alt","checked","class","decoding","disabled","height","href","loading","open","rel","src","start","target","title","type","width","style"],Be=/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file|godmode-file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;let xa=!1;const ka=14e4,es=14e4,ts=200,Tt=5e4,Et=5e4,me=new Map;let as=0;const Bt=new Map;function To(e){const t=Bt.get(e);if(!t)return null;Bt.delete(e);const a=Ot(t),s=We.parse(a);return de.sanitize(s,{ALLOWED_TAGS:_e,ALLOWED_ATTR:Se,ALLOWED_URI_REGEXP:Be})}function ns(e){const t=me.get(e);return t===void 0?null:(me.delete(e),me.set(e,t),t)}function Aa(e,t){if(me.set(e,t),me.size<=ts)return;const a=me.keys().next().value;a&&me.delete(a)}function Ht(){xa||(xa=!0,de.addHook("uponSanitizeElement",e=>{e instanceof HTMLInputElement&&e.getAttribute("type")!=="checkbox"&&e.remove()}),de.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function Eo(e){const t=e.trim();if(!t)return"";if(Ht(),t.length<=Tt){const r=ns(t);if(r!==null)return r}if(t.length>Et&&t.length<=ka){const r=t.slice(0,Et),d=Ot(r),v=We.parse(d),p=de.sanitize(v,{ALLOWED_TAGS:_e,ALLOWED_ATTR:Se,ALLOWED_URI_REGEXP:Be}),g=`expand-${++as}`;Bt.set(g,t);const h=Math.round((t.length-Et)/1e3);return p+`<div class="chat-expand-marker" data-expand-id="${g}"><button class="chat-expand-btn">Show ${h}k more characters</button></div>`}const a=Sn(t,ka),s=a.truncated?`

… truncated (${a.total} chars, showing first ${a.text.length}).`:"";if(a.text.length>es){const d=`<pre class="code-block">${ds(`${a.text}${s}`)}</pre>`,v=de.sanitize(d,{ALLOWED_TAGS:_e,ALLOWED_ATTR:Se,ALLOWED_URI_REGEXP:Be});return t.length<=Tt&&Aa(t,v),v}const i=Ot(`${a.text}${s}`),l=We.parse(i),o=de.sanitize(l,{ALLOWED_TAGS:_e,ALLOWED_ATTR:Se,ALLOWED_URI_REGEXP:Be});return t.length<=Tt&&Aa(t,o),o}function ss(e){const t=e.trim();if(!t)return"";Ht();const a=We.parse(t);return de.sanitize(a,{ALLOWED_TAGS:_e,ALLOWED_ATTR:Se,ALLOWED_URI_REGEXP:Be}).replace(/<input([^>]*)\bdisabled\b([^>]*)>/g,"<input$1$2>")}const is=[..._e,"svg","path","circle","ellipse","rect","line","polyline","polygon","text","tspan","g","defs","linearGradient","radialGradient","stop","clipPath","mask","use","symbol","marker","pattern","animate","animateTransform"],ls=[...Se,"viewBox","xmlns","preserveAspectRatio","d","cx","cy","r","rx","ry","x","x1","x2","y","y1","y2","dx","dy","fill","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","transform","opacity","points","text-anchor","dominant-baseline","font-size","font-weight","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","marker-start","marker-mid","marker-end","clip-path","patternUnits","patternTransform","rotate","textLength","lengthAdjust","values","dur","repeatCount","attributeName","from","to","begin","calcMode","keySplines","keyTimes"];function Mo(e){const t=e.trim();if(!t)return"";Ht();const{styles:a,html:s}=os(t),i=de.sanitize(s,{ALLOWED_TAGS:is,ALLOWED_ATTR:ls,FORBID_TAGS:["base","iframe","link","meta","object","script","style"]}),l=".dashboard-render";return a.map(r=>`<style>${cs(r,l)}</style>`).join(`
`)+i}function os(e){const t=[],a=e.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi,(o,r)=>(t.push(r),"")),s=a.match(/<body[^>]*>([\s\S]*)<\/body>/i),l=(s?s[1]:a).replace(/<!DOCTYPE[^>]*>/gi,"").replace(/<\/?html[^>]*>/gi,"").replace(/<\/?head[^>]*>/gi,"").replace(/<\/?body[^>]*>/gi,"").replace(/<title[^>]*>[\s\S]*?<\/title>/gi,"").replace(/<meta[^>]*\/?>/gi,"").replace(/<link[^>]*\/?>/gi,"");return{styles:t,html:l}}function rs(e,t){let a=0;for(let s=t;s<e.length;s++)if(e[s]==="{")a++;else if(e[s]==="}"&&(a--,a===0))return s+1;return e.length}function cs(e,t){let a=e.replace(/@import\b[^;]*;/gi,"");a=a.replace(/expression\s*\(/gi,"/* blocked */("),a=a.replace(/behavior\s*:/gi,"/* blocked */:"),a=a.replace(/-moz-binding\s*:/gi,"/* blocked */:");const s=[];let i=0;for(;i<a.length;){if(/\s/.test(a[i])){s.push(a[i]),i++;continue}if(a[i]==="/"&&a[i+1]==="*"){const p=a.indexOf("*/",i+2),g=p===-1?a.length:p+2;s.push(a.slice(i,g)),i=g;continue}if(a[i]==="}"){s.push("}"),i++;continue}if(/^@(-webkit-)?keyframes\s/.test(a.slice(i,i+30))){const p=rs(a,i);s.push(a.slice(i,p)),i=p;continue}if(/^@(media|supports|container|layer)\b/.test(a.slice(i,i+20))){const p=a.indexOf("{",i);if(p===-1){s.push(a.slice(i));break}s.push(a.slice(i,p+1)),i=p+1;continue}const l=a.indexOf("{",i);if(l===-1){s.push(a.slice(i));break}const o=a.slice(i,l).trim(),r=a.indexOf("}",l);if(r===-1){s.push(a.slice(i));break}const d=a.slice(l+1,r),v=o.split(",").map(p=>{const g=p.trim();if(!g)return p;if(g==="*")return`${t}, ${t} *`;if(/^(html|body|:root)$/i.test(g))return t;const h=g.replace(/^(html|body|:root)\s+/i,"");return`${t} ${h}`}).join(", ");s.push(`${v} {${d}}`),i=r+1}return s.join("")}function ds(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const us={messageSquare:n`
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  `,barChart:n`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  `,link:n`
    <svg viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  `,radio:n`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" />
      <path
        d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"
      />
    </svg>
  `,fileText:n`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  `,zap:n`
    <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  `,compass:n`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  `,monitor:n`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  `,settings:n`
    <svg viewBox="0 0 24 24">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,bug:n`
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
  `,scrollText:n`
    <svg viewBox="0 0 24 24">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  `,folder:n`
    <svg viewBox="0 0 24 24">
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </svg>
  `,folderOpen:n`
    <svg viewBox="0 0 24 24">
      <path
        d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"
      />
    </svg>
  `,file:n`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  `,chevronRight:n`
    <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
  `,chevronDown:n`
    <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
  `,panelLeft:n`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  `,panelLeftClose:n`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m16 15-3-3 3-3" />
    </svg>
  `,menu:n`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  `,x:n`
    <svg viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,check:n`
    <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
  `,copy:n`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  `,search:n`
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  `,brain:n`
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
  `,book:n`
    <svg viewBox="0 0 24 24">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  `,loader:n`
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
  `,arrowUp:n`
    <svg viewBox="0 0 24 24">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  `,calendar:n`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  `,heart:n`
    <svg viewBox="0 0 24 24">
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      />
    </svg>
  `,pieChart:n`
    <svg viewBox="0 0 24 24">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  `,star:n`
    <svg viewBox="0 0 24 24">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
  `,rotateCcw:n`
    <svg viewBox="0 0 24 24">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  `,headphones:n`
    <svg viewBox="0 0 24 24">
      <path
        d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"
      />
    </svg>
  `,helpCircle:n`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  `,messageCircle:n`
    <svg viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
  `,wrench:n`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </svg>
  `,fileCode:n`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  `,edit:n`
    <svg viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `,penLine:n`
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  `,paperclip:n`
    <svg viewBox="0 0 24 24">
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      />
    </svg>
  `,globe:n`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  `,image:n`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  `,smartphone:n`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  `,plug:n`
    <svg viewBox="0 0 24 24">
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  `,circle:n`
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
  `,puzzle:n`
    <svg viewBox="0 0 24 24">
      <path
        d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.076.874.54 1.02 1.02a2.5 2.5 0 1 0 3.237-3.237c-.48-.146-.944-.505-1.02-1.02a.98.98 0 0 1 .303-.917l1.526-1.526A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.236 3.236c-.464.18-.894.527-.967 1.02Z"
      />
    </svg>
  `,minimize:n`
    <svg viewBox="0 0 24 24">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" x2="21" y1="10" y2="3" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  `,users:n`
    <svg viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  `,briefcase:n`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  `,shield:n`
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  `,lock:n`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  `,lockOpen:n`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 5-5 5 5 0 0 1 4.63 3.13" />
    </svg>
  `,flask:n`
    <svg viewBox="0 0 24 24">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16.5h10" />
    </svg>
  `};function Q(e){if(e)return Array.isArray(e.type)?e.type.filter(a=>a!=="null")[0]??e.type[0]:e.type}function en(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(Q(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function lt(e){return e.filter(t=>typeof t=="string").join(".")}function G(e,t){const a=lt(e),s=t[a];if(s)return s;const i=a.split(".");for(const[l,o]of Object.entries(t)){if(!l.includes("*"))continue;const r=l.split(".");if(r.length!==i.length)continue;let d=!0;for(let v=0;v<i.length;v+=1)if(r[v]!=="*"&&r[v]!==i[v]){d=!1;break}if(d)return o}}function le(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function ps(e){const t=lt(e).toLowerCase();return t.includes("token")||t.includes("password")||t.includes("secret")||t.includes("apikey")||t.endsWith("key")}function ne(e){return typeof e=="string"?e:e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}const vs=new Set(["title","description","default","nullable"]);function gs(e){return Object.keys(e??{}).filter(a=>!vs.has(a)).length===0}function fs(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const Ve={chevronDown:n`
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
  `,plus:n`
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
  `,minus:n`
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
  `,trash:n`
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
  `,edit:n`
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
  `};function ie(e){const{schema:t,value:a,path:s,hints:i,unsupported:l,disabled:o,onPatch:r}=e,d=e.showLabel??!0,v=Q(t),p=G(s,i),g=p?.label??t.title??le(String(s.at(-1))),h=p?.help??t.description,$=lt(s);if(l.has($))return n`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${g}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const y=(t.anyOf??t.oneOf??[]).filter(_=>!(_.type==="null"||Array.isArray(_.type)&&_.type.includes("null")));if(y.length===1)return ie({...e,schema:y[0]});const f=_=>{if(_.const!==void 0)return _.const;if(_.enum&&_.enum.length===1)return _.enum[0]},w=y.map(f),C=w.every(_=>_!==void 0);if(C&&w.length>0&&w.length<=5){const _=a??t.default;return n`
        <div class="cfg-field">
          ${d?n`<label class="cfg-field__label">${g}</label>`:u}
          ${h?n`<div class="cfg-field__help">${h}</div>`:u}
          <div class="cfg-segmented" role="group" aria-label=${g}>
            ${w.map((M,S)=>n`
              <button
                type="button"
                class="cfg-segmented__btn ${M===_||ne(M)===ne(_)?"active":""}"
                aria-label="${g}: ${ne(M)}"
                aria-pressed=${M===_||ne(M)===ne(_)?"true":"false"}
                ?disabled=${o}
                @click=${()=>r(s,M)}
              >
                ${ne(M)}
              </button>
            `)}
          </div>
        </div>
      `}if(C&&w.length>5)return Sa({...e,options:w,value:a??t.default});const T=new Set(y.map(_=>Q(_)).filter(Boolean)),k=new Set([...T].map(_=>_==="integer"?"number":_));if([...k].every(_=>["string","number","boolean"].includes(_))){const _=k.has("string"),M=k.has("number");if(k.has("boolean")&&k.size===1)return ie({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(_||M)return _a({...e,inputType:M&&!_?"number":"text"})}}if(t.enum){const b=t.enum;if(b.length<=5){const y=a??t.default;return n`
        <div class="cfg-field">
          ${d?n`<label class="cfg-field__label">${g}</label>`:u}
          ${h?n`<div class="cfg-field__help">${h}</div>`:u}
          <div class="cfg-segmented" role="group" aria-label=${g}>
            ${b.map(f=>n`
              <button
                type="button"
                class="cfg-segmented__btn ${f===y||String(f)===String(y)?"active":""}"
                aria-label="${g}: ${String(f)}"
                aria-pressed=${f===y||String(f)===String(y)?"true":"false"}
                ?disabled=${o}
                @click=${()=>r(s,f)}
              >
                ${String(f)}
              </button>
            `)}
          </div>
        </div>
      `}return Sa({...e,options:b,value:a??t.default})}if(v==="object")return ms(e);if(v==="array")return bs(e);if(v==="boolean"){const b=typeof a=="boolean"?a:typeof t.default=="boolean"?t.default:!1;return n`
      <label class="cfg-toggle-row ${o?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${g}</span>
          ${h?n`<span class="cfg-toggle-row__help">${h}</span>`:u}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            aria-label=${g}
            role="switch"
            .checked=${b}
            ?disabled=${o}
            @change=${y=>r(s,y.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return v==="number"||v==="integer"?hs(e):v==="string"?_a({...e,inputType:"text"}):n`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${g}</div>
      <div class="cfg-field__error">Unsupported type: ${v}. Use Raw mode.</div>
    </div>
  `}function _a(e){const{schema:t,value:a,path:s,hints:i,disabled:l,onPatch:o,inputType:r}=e,d=e.showLabel??!0,v=G(s,i),p=v?.label??t.title??le(String(s.at(-1))),g=v?.help??t.description,h=v?.sensitive??ps(s),$=v?.placeholder??(h?"••••":t.default!==void 0?`Default: ${ne(t.default)}`:""),b=a??"";return n`
    <div class="cfg-field">
      ${d?n`<label class="cfg-field__label">${p}</label>`:u}
      ${g?n`<div class="cfg-field__help">${g}</div>`:u}
      <div class="cfg-input-wrap">
        <input
          type=${h?"password":r}
          class="cfg-input"
          placeholder=${$}
          aria-label=${p}
          .value=${ne(b)}
          ?disabled=${l}
          @input=${y=>{const f=y.target.value;if(r==="number"){if(f.trim()===""){o(s,void 0);return}const w=Number(f);o(s,Number.isNaN(w)?f:w);return}o(s,f)}}
          @change=${y=>{if(r==="number")return;const f=y.target.value;o(s,f.trim())}}
        />
        ${t.default!==void 0?n`
          <button
            type="button"
            class="cfg-input__reset"
            title="Reset to default"
            ?disabled=${l}
            @click=${()=>o(s,t.default)}
          >↺</button>
        `:u}
      </div>
    </div>
  `}function hs(e){const{schema:t,value:a,path:s,hints:i,disabled:l,onPatch:o}=e,r=e.showLabel??!0,d=G(s,i),v=d?.label??t.title??le(String(s.at(-1))),p=d?.help??t.description,g=a??t.default??"",h=typeof g=="number"?g:0;return n`
    <div class="cfg-field">
      ${r?n`<label class="cfg-field__label">${v}</label>`:u}
      ${p?n`<div class="cfg-field__help">${p}</div>`:u}
      <div class="cfg-number" role="group" aria-label="${v}">
        <button
          type="button"
          class="cfg-number__btn"
          aria-label="Decrease ${v}"
          ?disabled=${l}
          @click=${()=>o(s,h-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          aria-label=${v}
          .value=${ne(g)}
          ?disabled=${l}
          @input=${$=>{const b=$.target.value,y=b===""?void 0:Number(b);o(s,y)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          aria-label="Increase ${v}"
          ?disabled=${l}
          @click=${()=>o(s,h+1)}
        >+</button>
      </div>
    </div>
  `}function Sa(e){const{schema:t,value:a,path:s,hints:i,disabled:l,options:o,onPatch:r}=e,d=e.showLabel??!0,v=G(s,i),p=v?.label??t.title??le(String(s.at(-1))),g=v?.help??t.description,h=a??t.default,$=o.findIndex(y=>y===h||String(y)===String(h)),b="__unset__";return n`
    <div class="cfg-field">
      ${d?n`<label class="cfg-field__label">${p}</label>`:u}
      ${g?n`<div class="cfg-field__help">${g}</div>`:u}
      <select
        class="cfg-select"
        aria-label=${p}
        ?disabled=${l}
        .value=${$>=0?String($):b}
        @change=${y=>{const f=y.target.value;r(s,f===b?void 0:o[Number(f)])}}
      >
        <option value=${b}>Select...</option>
        ${o.map((y,f)=>n`
          <option value=${String(f)}>${String(y)}</option>
        `)}
      </select>
    </div>
  `}function ms(e){const{schema:t,value:a,path:s,hints:i,unsupported:l,disabled:o,onPatch:r}=e;e.showLabel;const d=G(s,i),v=d?.label??t.title??le(String(s.at(-1))),p=d?.help??t.description,g=a??t.default,h=g&&typeof g=="object"&&!Array.isArray(g)?g:{},$=t.properties??{},y=Object.entries($).toSorted((T,k)=>{const _=G([...s,T[0]],i)?.order??0,M=G([...s,k[0]],i)?.order??0;return _!==M?_-M:T[0].localeCompare(k[0])}),f=new Set(Object.keys($)),w=t.additionalProperties,C=!!w&&typeof w=="object";return s.length===1?n`
      <div class="cfg-fields">
        ${y.map(([T,k])=>ie({schema:k,value:h[T],path:[...s,T],hints:i,unsupported:l,disabled:o,onPatch:r}))}
        ${C?Ca({schema:w,value:h,path:s,hints:i,unsupported:l,disabled:o,reservedKeys:f,onPatch:r}):u}
      </div>
    `:n`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${v}</span>
        <span class="cfg-object__chevron">${Ve.chevronDown}</span>
      </summary>
      ${p?n`<div class="cfg-object__help">${p}</div>`:u}
      <div class="cfg-object__content">
        ${y.map(([T,k])=>ie({schema:k,value:h[T],path:[...s,T],hints:i,unsupported:l,disabled:o,onPatch:r}))}
        ${C?Ca({schema:w,value:h,path:s,hints:i,unsupported:l,disabled:o,reservedKeys:f,onPatch:r}):u}
      </div>
    </details>
  `}function bs(e){const{schema:t,value:a,path:s,hints:i,unsupported:l,disabled:o,onPatch:r}=e,d=e.showLabel??!0,v=G(s,i),p=v?.label??t.title??le(String(s.at(-1))),g=v?.help??t.description,h=Array.isArray(t.items)?t.items[0]:t.items;if(!h)return n`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${p}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const $=Array.isArray(a)?a:Array.isArray(t.default)?t.default:[];return n`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${d?n`<span class="cfg-array__label">${p}</span>`:u}
        <span class="cfg-array__count">${$.length} item${$.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          aria-label="Add ${p} item"
          ?disabled=${o}
          @click=${()=>{const b=[...$,en(h)];r(s,b)}}
        >
          <span class="cfg-array__add-icon">${Ve.plus}</span>
          Add
        </button>
      </div>
      ${g?n`<div class="cfg-array__help">${g}</div>`:u}

      ${$.length===0?n`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:n`
        <div class="cfg-array__items">
          ${$.map((b,y)=>n`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${y+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  aria-label="Remove ${p} item ${y+1}"
                  ?disabled=${o}
                  @click=${()=>{const f=[...$];f.splice(y,1),r(s,f)}}
                >
                  ${Ve.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${ie({schema:h,value:b,path:[...s,y],hints:i,unsupported:l,disabled:o,showLabel:!1,onPatch:r})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function Ca(e){const{schema:t,value:a,path:s,hints:i,unsupported:l,disabled:o,reservedKeys:r,onPatch:d}=e,v=gs(t),p=Object.entries(a??{}).filter(([g])=>!r.has(g));return n`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          aria-label="Add custom entry"
          ?disabled=${o}
          @click=${()=>{const g={...a};let h=1,$=`custom-${h}`;for(;$ in g;)h+=1,$=`custom-${h}`;g[$]=v?{}:en(t),d(s,g)}}
        >
          <span class="cfg-map__add-icon">${Ve.plus}</span>
          Add Entry
        </button>
      </div>

      ${p.length===0?n`
              <div class="cfg-map__empty">No custom entries.</div>
            `:n`
        <div class="cfg-map__items">
          ${p.map(([g,h])=>{const $=[...s,g],b=fs(h);return n`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    aria-label="Entry key for ${g}"
                    .value=${g}
                    ?disabled=${o}
                    @change=${y=>{const f=y.target.value.trim();if(!f||f===g)return;const w={...a};f in w||(w[f]=w[g],delete w[g],d(s,w))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${v?n`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          aria-label="JSON value for ${g}"
                          rows="2"
                          .value=${b}
                          ?disabled=${o}
                          @change=${y=>{const f=y.target,w=f.value.trim();if(!w){d($,void 0);return}try{d($,JSON.parse(w))}catch{f.value=b}}}
                        ></textarea>
                      `:ie({schema:t,value:h,path:$,hints:i,unsupported:l,disabled:o,showLabel:!1,onPatch:d})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  aria-label="Remove entry ${g}"
                  ?disabled=${o}
                  @click=${()=>{const y={...a};delete y[g],d(s,y)}}
                >
                  ${Ve.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const Ta={env:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:n`
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
  `,meta:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:n`
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
  `,default:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},jt={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"},user:{label:"User Profile",description:"Your display name and avatar"}};function Ea(e){return Ta[e]??Ta.default}function ys(e,t,a){if(!a)return!0;const s=a.toLowerCase(),i=jt[e];return e.toLowerCase().includes(s)||i&&(i.label.toLowerCase().includes(s)||i.description.toLowerCase().includes(s))?!0:ze(t,s)}function ze(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,i]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||ze(i,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const i of s)if(i&&ze(i,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&ze(e.additionalProperties,t))return!0;const a=e.anyOf??e.oneOf??e.allOf;if(a){for(const s of a)if(s&&ze(s,t))return!0}return!1}function $s(e){if(!e.schema)return n`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,a=e.value??{};if(Q(t)!=="object"||!t.properties)return n`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),i=t.properties,l=e.searchQuery??"",o=e.activeSection,r=e.activeSubsection??null,v=Object.entries(i).toSorted((g,h)=>{const $=G([g[0]],e.uiHints)?.order??50,b=G([h[0]],e.uiHints)?.order??50;return $!==b?$-b:g[0].localeCompare(h[0])}).filter(([g,h])=>!(o&&g!==o||l&&!ys(g,h,l)));let p=null;if(o&&r&&v.length===1){const g=v[0]?.[1];g&&Q(g)==="object"&&g.properties&&g.properties[r]&&(p={sectionKey:o,subsectionKey:r,schema:g.properties[r]})}return v.length===0?n`
      <div class="config-empty">
        <div class="config-empty__icon">${us.search}</div>
        <div class="config-empty__text">
          ${l?`No settings match "${l}"`:"No settings in this section"}
        </div>
      </div>
    `:n`
    <div class="config-form config-form--modern">
      ${p?(()=>{const{sectionKey:g,subsectionKey:h,schema:$}=p,b=G([g,h],e.uiHints),y=b?.label??$.title??le(h),f=b?.help??$.description??"",w=a[g],C=w&&typeof w=="object"?w[h]:void 0,T=`config-section-${g}-${h}`;return n`
              <section class="config-section-card" id=${T}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Ea(g)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${y}</h3>
                    ${f?n`<p class="config-section-card__desc">${f}</p>`:u}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${ie({schema:$,value:C,path:[g,h],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():v.map(([g,h])=>{const $=jt[g]??{label:g.charAt(0).toUpperCase()+g.slice(1),description:h.description??""};return n`
              <section class="config-section-card" id="config-section-${g}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Ea(g)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${$.label}</h3>
                    ${$.description?n`<p class="config-section-card__desc">${$.description}</p>`:u}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${ie({schema:h,value:a[g],path:[g],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const ws=new Set(["title","description","default","nullable"]);function xs(e){return Object.keys(e??{}).filter(a=>!ws.has(a)).length===0}function tn(e){const t=e.filter(i=>i!=null),a=t.length!==e.length,s=[];for(const i of t)s.some(l=>Object.is(l,i))||s.push(i);return{enumValues:s,nullable:a}}function an(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:Fe(e,[])}function Fe(e,t){const a=new Set,s={...e},i=lt(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const r=ks(e,t);return r||{schema:e,unsupportedPaths:[i]}}const l=Array.isArray(e.type)&&e.type.includes("null"),o=Q(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=o??e.type,s.nullable=l||e.nullable,s.enum){const{enumValues:r,nullable:d}=tn(s.enum);s.enum=r,d&&(s.nullable=!0),r.length===0&&a.add(i)}if(o==="object"){const r=e.properties??{},d={};for(const[v,p]of Object.entries(r)){const g=Fe(p,[...t,v]);g.schema&&(d[v]=g.schema);for(const h of g.unsupportedPaths)a.add(h)}if(s.properties=d,e.additionalProperties===!0)a.add(i);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!xs(e.additionalProperties)){const v=Fe(e.additionalProperties,[...t,"*"]);s.additionalProperties=v.schema??e.additionalProperties,v.unsupportedPaths.length>0&&a.add(i)}}else if(o==="array"){const r=Array.isArray(e.items)?e.items[0]:e.items;if(!r)a.add(i);else{const d=Fe(r,[...t,"*"]);s.items=d.schema??r,d.unsupportedPaths.length>0&&a.add(i)}}else o!=="string"&&o!=="number"&&o!=="integer"&&o!=="boolean"&&!s.enum&&a.add(i);return{schema:s,unsupportedPaths:Array.from(a)}}function ks(e,t){if(e.allOf)return null;const a=e.anyOf??e.oneOf;if(!a)return null;const s=[],i=[];let l=!1;for(const r of a){if(!r||typeof r!="object")return null;if(Array.isArray(r.enum)){const{enumValues:d,nullable:v}=tn(r.enum);s.push(...d),v&&(l=!0);continue}if("const"in r){if(r.const==null){l=!0;continue}s.push(r.const);continue}if(Q(r)==="null"){l=!0;continue}i.push(r)}if(s.length>0&&i.length===0){const r=[];for(const d of s)r.some(v=>Object.is(v,d))||r.push(d);return{schema:{...e,enum:r,nullable:l,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(i.length===1){const r=Fe(i[0],t);return r.schema&&(r.schema.nullable=l||r.schema.nullable),r}const o=new Set(["string","number","integer","boolean"]);return i.length>0&&s.length===0&&i.every(r=>r.type&&o.has(String(r.type)))?{schema:{...e,nullable:l},unsupportedPaths:[]}:null}function As(e,t){let a=e;for(const s of t){if(!a)return null;const i=Q(a);if(i==="object"){const l=a.properties??{};if(typeof s=="string"&&l[s]){a=l[s];continue}const o=a.additionalProperties;if(typeof s=="string"&&o&&typeof o=="object"){a=o;continue}return null}if(i==="array"){if(typeof s!="number")return null;a=(Array.isArray(a.items)?a.items[0]:a.items)??null;continue}return null}return a}function _s(e,t){const s=(e.channels??{})[t],i=e[t];return(s&&typeof s=="object"?s:null)??(i&&typeof i=="object"?i:null)??{}}function Ss(e){const t=an(e.schema),a=t.schema;if(!a)return n`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=As(a,["channels",e.channelId]);if(!s)return n`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const i=e.configValue??{},l=_s(i,e.channelId);return n`
    <div class="config-form">
      ${ie({schema:s,value:l,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
  `}function oe(e){const{channelId:t,props:a}=e,s=a.configSaving||a.configSchemaLoading;return n`
    <div style="margin-top: 16px;">
      ${a.configSchemaLoading?n`
              <div class="muted">Loading config schema…</div>
            `:Ss({channelId:t,configValue:a.configForm,schema:a.configSchema,uiHints:a.configUiHints,disabled:s,onPatch:a.onConfigPatch})}
      <div class="row" style="margin-top: 12px;">
        <button
          class="btn primary"
          ?disabled=${s||!a.configFormDirty}
          @click=${()=>a.onConfigSave()}
        >
          ${a.configSaving?"Saving…":"Save"}
        </button>
        <button
          class="btn"
          ?disabled=${s}
          @click=${()=>a.onConfigReload()}
        >
          Reload
        </button>
      </div>
    </div>
  `}function Cs(e){const{props:t,discord:a,accountCountLabel:s}=e;return n`
    <div class="card">
      <div class="card-title">Discord</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${a?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${a?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${a?.lastStartAt?L(a.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${a?.lastProbeAt?L(a.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${a?.lastError?n`<div class="callout danger" style="margin-top: 12px;">
            ${a.lastError}
          </div>`:u}

      ${a?.probe?n`<div class="callout" style="margin-top: 12px;">
            Probe ${a.probe.ok?"ok":"failed"} ·
            ${a.probe.status??""} ${a.probe.error??""}
          </div>`:u}

      ${oe({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Ts(e){const{props:t,googleChat:a,accountCountLabel:s}=e;return n`
    <div class="card">
      <div class="card-title">Google Chat</div>
      <div class="card-sub">Chat API webhook status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${a?a.configured?"Yes":"No":"n/a"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${a?a.running?"Yes":"No":"n/a"}</span>
        </div>
        <div>
          <span class="label">Credential</span>
          <span>${a?.credentialSource??"n/a"}</span>
        </div>
        <div>
          <span class="label">Audience</span>
          <span>
            ${a?.audienceType?`${a.audienceType}${a.audience?` · ${a.audience}`:""}`:"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${a?.lastStartAt?L(a.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${a?.lastProbeAt?L(a.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${a?.lastError?n`<div class="callout danger" style="margin-top: 12px;">
            ${a.lastError}
          </div>`:u}

      ${a?.probe?n`<div class="callout" style="margin-top: 12px;">
            Probe ${a.probe.ok?"ok":"failed"} ·
            ${a.probe.status??""} ${a.probe.error??""}
          </div>`:u}

      ${oe({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Es(e){const{props:t,imessage:a,accountCountLabel:s}=e;return n`
    <div class="card">
      <div class="card-title">iMessage</div>
      <div class="card-sub">macOS bridge status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${a?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${a?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${a?.lastStartAt?L(a.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${a?.lastProbeAt?L(a.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${a?.lastError?n`<div class="callout danger" style="margin-top: 12px;">
            ${a.lastError}
          </div>`:u}

      ${a?.probe?n`<div class="callout" style="margin-top: 12px;">
            Probe ${a.probe.ok?"ok":"failed"} ·
            ${a.probe.error??""}
          </div>`:u}

      ${oe({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Ma(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function Ms(e){const{props:t,nostr:a,nostrAccounts:s,accountCountLabel:i,profileFormState:l,profileFormCallbacks:o,onEditProfile:r}=e,d=s[0],v=a?.configured??d?.configured??!1,p=a?.running??d?.running??!1,g=a?.publicKey??d?.publicKey,h=a?.lastStartAt??d?.lastStartAt??null,$=a?.lastError??d?.lastError??null,b=s.length>1,y=l!=null,f=C=>{const T=C.publicKey,k=C.profile,_=k?.displayName??k?.name??C.name??C.accountId;return n`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${_}</div>
          <div class="account-card-id">${C.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${C.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${C.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${T??""}">${Ma(T)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${C.lastInboundAt?L(C.lastInboundAt):"n/a"}</span>
          </div>
          ${C.lastError?n`
                <div class="account-card-error">${C.lastError}</div>
              `:u}
        </div>
      </div>
    `},w=()=>{if(y&&o)return Tn({state:l,callbacks:o,accountId:s[0]?.accountId??"default"});const C=d?.profile??a?.profile,{name:T,displayName:k,about:_,picture:M,nip05:S}=C??{},pe=T||k||_||M||S;return n`
      <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 500;">Profile</div>
          ${v?n`
                <button
                  class="btn btn-sm"
                  @click=${r}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:u}
        </div>
        ${pe?n`
              <div class="status-list">
                ${M?n`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${M}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${ot=>{ot.target.style.display="none"}}
                        />
                      </div>
                    `:u}
                ${T?n`<div><span class="label">Name</span><span>${T}</span></div>`:u}
                ${k?n`<div><span class="label">Display Name</span><span>${k}</span></div>`:u}
                ${_?n`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${_}</span></div>`:u}
                ${S?n`<div><span class="label">NIP-05</span><span>${S}</span></div>`:u}
              </div>
            `:n`
                <div style="color: var(--text-muted); font-size: 13px">
                  No profile set. Click "Edit Profile" to add your name, bio, and avatar.
                </div>
              `}
      </div>
    `};return n`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${i}

      ${b?n`
            <div class="account-card-list">
              ${s.map(C=>f(C))}
            </div>
          `:n`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${v?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${p?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Public Key</span>
                <span class="monospace" title="${g??""}"
                  >${Ma(g)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${h?L(h):"n/a"}</span>
              </div>
            </div>
          `}

      ${$?n`<div class="callout danger" style="margin-top: 12px;">${$}</div>`:u}

      ${w()}

      ${oe({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function Ls(e){if(!e&&e!==0)return"n/a";const t=Math.round(e/1e3);if(t<60)return`${t}s`;const a=Math.round(t/60);return a<60?`${a}m`:`${Math.round(a/60)}h`}function Rs(e,t){const a=t.snapshot,s=a?.channels;if(!a||!s)return!1;const i=s[e],l=typeof i?.configured=="boolean"&&i.configured,o=typeof i?.running=="boolean"&&i.running,r=typeof i?.connected=="boolean"&&i.connected,v=(a.channelAccounts?.[e]??[]).some(p=>p.configured||p.running||p.connected);return l||o||r||v}function Ns(e,t){return t?.[e]?.length??0}function nn(e,t){const a=Ns(e,t);return a<2?u:n`<div class="account-count">Accounts (${a})</div>`}function Ds(e){const{props:t,signal:a,accountCountLabel:s}=e;return n`
    <div class="card">
      <div class="card-title">Signal</div>
      <div class="card-sub">signal-cli status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${a?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${a?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Base URL</span>
          <span>${a?.baseUrl??"n/a"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${a?.lastStartAt?L(a.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${a?.lastProbeAt?L(a.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${a?.lastError?n`<div class="callout danger" style="margin-top: 12px;">
            ${a.lastError}
          </div>`:u}

      ${a?.probe?n`<div class="callout" style="margin-top: 12px;">
            Probe ${a.probe.ok?"ok":"failed"} ·
            ${a.probe.status??""} ${a.probe.error??""}
          </div>`:u}

      ${oe({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Ps(e){const{props:t,slack:a,accountCountLabel:s}=e;return n`
    <div class="card">
      <div class="card-title">Slack</div>
      <div class="card-sub">Socket mode status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${a?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${a?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${a?.lastStartAt?L(a.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${a?.lastProbeAt?L(a.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${a?.lastError?n`<div class="callout danger" style="margin-top: 12px;">
            ${a.lastError}
          </div>`:u}

      ${a?.probe?n`<div class="callout" style="margin-top: 12px;">
            Probe ${a.probe.ok?"ok":"failed"} ·
            ${a.probe.status??""} ${a.probe.error??""}
          </div>`:u}

      ${oe({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Is(e){const{props:t,telegram:a,telegramAccounts:s,accountCountLabel:i}=e,l=s.length>1,o=r=>{const v=r.probe?.bot?.username,p=r.name||r.accountId;return n`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${v?`@${v}`:p}
          </div>
          <div class="account-card-id">${r.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${r.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${r.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${r.lastInboundAt?L(r.lastInboundAt):"n/a"}</span>
          </div>
          ${r.lastError?n`
                <div class="account-card-error">
                  ${r.lastError}
                </div>
              `:u}
        </div>
      </div>
    `};return n`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${i}

      ${l?n`
            <div class="account-card-list">
              ${s.map(r=>o(r))}
            </div>
          `:n`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${a?.configured?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${a?.running?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Mode</span>
                <span>${a?.mode??"n/a"}</span>
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${a?.lastStartAt?L(a.lastStartAt):"n/a"}</span>
              </div>
              <div>
                <span class="label">Last probe</span>
                <span>${a?.lastProbeAt?L(a.lastProbeAt):"n/a"}</span>
              </div>
            </div>
          `}

      ${a?.lastError?n`<div class="callout danger" style="margin-top: 12px;">
            ${a.lastError}
          </div>`:u}

      ${a?.probe?n`<div class="callout" style="margin-top: 12px;">
            Probe ${a.probe.ok?"ok":"failed"} ·
            ${a.probe.status??""} ${a.probe.error??""}
          </div>`:u}

      ${oe({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function zs(e){const{props:t,whatsapp:a,accountCountLabel:s}=e;return n`
    <div class="card">
      <div class="card-title">WhatsApp</div>
      <div class="card-sub">Link WhatsApp Web and monitor connection health.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${a?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Linked</span>
          <span>${a?.linked?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${a?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Connected</span>
          <span>${a?.connected?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last connect</span>
          <span>
            ${a?.lastConnectedAt?L(a.lastConnectedAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last message</span>
          <span>
            ${a?.lastMessageAt?L(a.lastMessageAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Auth age</span>
          <span>
            ${a?.authAgeMs!=null?Ls(a.authAgeMs):"n/a"}
          </span>
        </div>
      </div>

      ${a?.lastError?n`<div class="callout danger" style="margin-top: 12px;">
            ${a.lastError}
          </div>`:u}

      ${t.whatsappMessage?n`<div class="callout" style="margin-top: 12px;">
            ${t.whatsappMessage}
          </div>`:u}

      ${t.whatsappQrDataUrl?n`<div class="qr-wrap">
            <img src=${t.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:u}

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

      ${oe({channelId:"whatsapp",props:t})}
    </div>
  `}function Lo(e){const t=e.snapshot?.channels,a=t?.whatsapp??void 0,s=t?.telegram??void 0,i=t?.discord??null;t?.googlechat;const l=t?.slack??null,o=t?.signal??null,r=t?.imessage??null,d=t?.nostr??null,p=Os(e.snapshot).map((g,h)=>({key:g,enabled:Rs(g,e),order:h})).toSorted((g,h)=>g.enabled!==h.enabled?g.enabled?-1:1:g.order-h.order);return n`
    <section class="grid grid-cols-2">
      ${p.map(g=>Bs(g.key,e,{whatsapp:a,telegram:s,discord:i,slack:l,signal:o,imessage:r,nostr:d,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?L(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?n`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:u}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function Os(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function Bs(e,t,a){const s=nn(e,a.channelAccounts);switch(e){case"whatsapp":return zs({props:t,whatsapp:a.whatsapp,accountCountLabel:s});case"telegram":return Is({props:t,telegram:a.telegram,telegramAccounts:a.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return Cs({props:t,discord:a.discord,accountCountLabel:s});case"googlechat":return Ts({props:t,accountCountLabel:s});case"slack":return Ps({props:t,slack:a.slack,accountCountLabel:s});case"signal":return Ds({props:t,signal:a.signal,accountCountLabel:s});case"imessage":return Es({props:t,imessage:a.imessage,accountCountLabel:s});case"nostr":{const i=a.channelAccounts?.nostr??[],l=i[0],o=l?.accountId??"default",r=l?.profile??null,d=t.nostrProfileAccountId===o?t.nostrProfileFormState:null,v=d?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return Ms({props:t,nostr:a.nostr,nostrAccounts:i,accountCountLabel:s,profileFormState:d,profileFormCallbacks:v,onEditProfile:()=>t.onNostrProfileEdit(o,r)})}default:return Fs(e,t,a.channelAccounts??{})}}function Fs(e,t,a){const s=Hs(t.snapshot,e),i=t.snapshot?.channels?.[e],l=typeof i?.configured=="boolean"?i.configured:void 0,o=typeof i?.running=="boolean"?i.running:void 0,r=typeof i?.connected=="boolean"?i.connected:void 0,d=typeof i?.lastError=="string"?i.lastError:void 0,v=a[e]??[],p=nn(e,a);return n`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${p}

      ${v.length>0?n`
            <div class="account-card-list">
              ${v.map(g=>Gs(g))}
            </div>
          `:n`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${l==null?"n/a":l?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${o==null?"n/a":o?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Connected</span>
                <span>${r==null?"n/a":r?"Yes":"No"}</span>
              </div>
            </div>
          `}

      ${d?n`<div class="callout danger" style="margin-top: 12px;">
            ${d}
          </div>`:u}

      ${oe({channelId:e,props:t})}
    </div>
  `}function Us(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function Hs(e,t){return Us(e)[t]?.label??e?.channelLabels?.[t]??t}const js=600*1e3;function sn(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<js:!1}function Ws(e){return e.running?"Yes":sn(e)?"Active":"No"}function Vs(e){return e.connected===!0?"Yes":e.connected===!1?"No":sn(e)?"Active":"n/a"}function Gs(e){const t=Ws(e),a=Vs(e);return n`
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
          <span>${a}</span>
        </div>
        <div>
          <span class="label">Last inbound</span>
          <span>${e.lastInboundAt?L(e.lastInboundAt):"n/a"}</span>
        </div>
        ${e.lastError?n`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:u}
      </div>
    </div>
  `}function Ys(e,t=128){return new Promise((a,s)=>{const i=new Image;i.addEventListener("load",()=>{const l=document.createElement("canvas");l.width=t,l.height=t;const o=l.getContext("2d");if(!o){s(new Error("Could not get canvas context"));return}const r=Math.min(i.width,i.height),d=(i.width-r)/2,v=(i.height-r)/2;o.drawImage(i,d,v,r,r,0,0,t,t),a(l.toDataURL("image/png"))}),i.addEventListener("error",()=>s(new Error("Failed to load image"))),i.src=URL.createObjectURL(e)})}let Ae="",Oe=null,he=null,La=!1,ce=!1;function Ks(e){La||(Ae=e.userName||"",Oe=e.userAvatar||null,he=e.userAvatar||null,La=!0,ce=!1)}function qs(e){Ks(e);const t=d=>{Ae=d.target.value,ce=!0},a=async d=>{const p=d.target.files?.[0];if(p){if(!p.type.startsWith("image/")){alert("Please select an image file");return}if(p.size>5*1024*1024){alert("Image must be less than 5MB");return}try{const g=await Ys(p,128);Oe=g,he=g,ce=!0,document.dispatchEvent(new CustomEvent("user-settings-updated"))}catch(g){console.error("Failed to process image:",g),alert("Failed to process image")}}},s=()=>{Oe=null,he=null,ce=!0;const d=document.getElementById("user-avatar-input");d&&(d.value=""),document.dispatchEvent(new CustomEvent("user-settings-updated"))},i=()=>{e.onUpdate(Ae,Oe||""),ce=!1;const d=document.querySelector(".user-settings__save");d&&(d.textContent="Saved!",setTimeout(()=>{d.textContent="Save"},1500))},l=()=>{Ae=e.userName||"",Oe=e.userAvatar||null,he=e.userAvatar||null,ce=!1,document.dispatchEvent(new CustomEvent("user-settings-updated"))},o=Ae||"You",r=he?n`<img src="${he}" alt="${o}" class="user-settings__avatar-img" />`:n`<span class="user-settings__avatar-initial">${o.charAt(0).toUpperCase()}</span>`;return n`
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
                  ${r}
                </div>
                <div class="user-settings__avatar-actions">
                  <input
                    type="file"
                    id="user-avatar-input"
                    accept="image/*"
                    aria-label="Upload avatar image"
                    class="user-settings__file-input"
                    @change=${a}
                  />
                  <button
                    type="button"
                    class="user-settings__btn user-settings__btn--upload"
                    aria-label="Choose avatar image"
                    @click=${()=>document.getElementById("user-avatar-input")?.click()}
                  >
                    Choose Image
                  </button>
                  ${he?n`
                        <button
                          type="button"
                          class="user-settings__btn user-settings__btn--clear"
                          aria-label="Remove avatar"
                          @click=${s}
                        >
                          Remove
                        </button>
                      `:u}
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
                .value=${Ae}
                @input=${t}
                placeholder="Your name"
                maxlength="50"
              />
              <span class="user-settings__hint">This name appears on your chat messages</span>
            </div>

            <!-- Actions -->
            <div class="user-settings__actions">
              ${ce?n`
                    <button
                      type="button"
                      class="user-settings__btn user-settings__btn--cancel"
                      aria-label="Cancel profile changes"
                      @click=${l}
                    >
                      Cancel
                    </button>
                  `:u}
              <button
                type="button"
                class="user-settings__btn user-settings__btn--save user-settings__save"
                aria-label="Save profile"
                ?disabled=${!ce}
                @click=${i}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `}const Ft={all:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,env:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:n`
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
  `,meta:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:n`
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
  `,user:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  `,default:n`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},Mt=[{key:"model",label:"AI Model"},{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"},{key:"secrets",label:"Secrets"},{key:"webfetch",label:"Web Fetch"},{key:"search",label:"Search"},{key:"user",label:"User"}],Ra=new Set(["user","model","secrets","webfetch","search"]),Na="__all__";function Da(e){return Ft[e]??Ft.default}function Js(e,t){const a=jt[e];return a||{label:t?.title??le(e),description:t?.description??""}}function Xs(e){const{key:t,schema:a,uiHints:s}=e;if(!a||Q(a)!=="object"||!a.properties)return[];const i=Object.entries(a.properties).map(([l,o])=>{const r=G([t,l],s),d=r?.label??o.title??le(l),v=r?.help??o.description??"",p=r?.order??50;return{key:l,label:d,description:v,order:p}});return i.sort((l,o)=>l.order!==o.order?l.order-o.order:l.key.localeCompare(o.key)),i}function Zs(e,t){if(!e||!t)return[];const a=[];function s(i,l,o){if(i===l)return;if(typeof i!=typeof l){a.push({path:o,from:i,to:l});return}if(typeof i!="object"||i===null||l===null){i!==l&&a.push({path:o,from:i,to:l});return}if(Array.isArray(i)&&Array.isArray(l)){JSON.stringify(i)!==JSON.stringify(l)&&a.push({path:o,from:i,to:l});return}const r=i,d=l,v=new Set([...Object.keys(r),...Object.keys(d)]);for(const p of v)s(r[p],d[p],o?`${o}.${p}`:p)}return s(e,t,""),a}function Pa(e,t=40){let a;try{a=JSON.stringify(e)??String(e)}catch{a=String(e)}return a.length<=t?a:a.slice(0,t-3)+"..."}const Ia={anthropic:"#d97706",openai:"#10b981","openai-codex":"#10b981",xai:"#6366f1"};function Qs(e){const t=[],a=e.models,s=e.agents,i=a?.providers;if(i&&typeof i=="object")for(const[o,r]of Object.entries(i)){const d=r;for(const v of d.models??[])t.push({id:`${o}/${v.id}`,name:v.name??v.id,provider:o,providerLabel:o.charAt(0).toUpperCase()+o.slice(1),reasoning:v.reasoning??!1,contextWindow:v.contextWindow??0})}const l=s?.defaults?.models;if(l&&typeof l=="object")for(const o of Object.keys(l)){if(t.some(d=>d.id===o))continue;const r=o.split("/");t.push({id:o,name:r.slice(1).join("/"),provider:r[0]??"unknown",providerLabel:(r[0]??"unknown").replace(/-/g," ").replace(/\b\w/g,d=>d.toUpperCase()),reasoning:!1,contextWindow:0})}return t}function ei(e){return e.startsWith("anthropic/")?["openai-codex/gpt-5.3-codex"]:["anthropic/claude-sonnet-4-6"]}function ti(e){const t=e.formValue;if(!t)return n`<div class="config-loading"><span>Loading config...</span></div>`;const a=t.agents,s=a?.defaults?.model?.primary??"",i=a?.defaults?.model?.fallbacks??[],l=Qs(t),o=new Map;for(const d of l){const v=o.get(d.provider)??[];v.push(d),o.set(d.provider,v)}const r=e.saving||e.applying;return n`
    <div class="model-picker">
      <div class="model-picker__current">
        <div class="model-picker__current-label">Active Model</div>
        <div class="model-picker__current-value">${s||"Not set"}</div>
        ${i.length>0?n`<div class="model-picker__fallback">Fallback: ${i.join(", ")}</div>`:u}
      </div>

      ${r?n`<div class="model-picker__status">Switching model...</div>`:u}

      ${Array.from(o.entries()).map(([d,v])=>n`
          <div class="model-picker__group">
            <div class="model-picker__group-label">
              <span class="model-picker__group-dot" style="background: ${Ia[d]??"var(--accent)"}"></span>
              ${v[0]?.providerLabel??d}
            </div>
            <div class="model-picker__cards">
              ${v.map(p=>{const g=p.id===s,h=Ia[p.provider]??"var(--accent)";return n`
                  <button
                    class="model-card ${g?"model-card--active":""}"
                    style="--model-accent: ${h}"
                    aria-label="${g?`${p.name||p.id} (active)`:`Switch to ${p.name||p.id}`}"
                    aria-pressed=${g?"true":"false"}
                    ?disabled=${r}
                    @click=${()=>{g||!e.onModelSwitch||e.onModelSwitch(p.id,ei(p.id))}}
                  >
                    <div class="model-card__body">
                      <div class="model-card__name">${p.name||p.id}</div>
                      ${p.reasoning?n`<span class="model-card__tag">reasoning</span>`:u}
                      ${p.contextWindow>0?n`<span class="model-card__ctx">${Math.round(p.contextWindow/1e3)}k ctx</span>`:u}
                    </div>
                    ${g?n`<span class="model-card__check">Active</span>`:u}
                  </button>
                `})}
            </div>
          </div>
        `)}
    </div>
  `}function ai(e){return n`
    <div class="config-secrets">
      <div class="config-secrets__header">
        <h3 class="config-secrets__title">Stored Secrets</h3>
        <button class="btn btn--sm" aria-label="Refresh secrets" ?disabled=${e.secretsLoading} @click=${e.onSecretsRefresh}>
          ${e.secretsLoading?"Loading...":"Refresh"}
        </button>
      </div>
      <p class="config-secrets__hint muted">
        Encrypted secrets stored in the OpenClaw state directory. Manage via <code>/secrets set KEY</code> in chat.
      </p>
      ${e.secrets.length===0&&!e.secretsLoading?n`<div class="config-secrets__empty muted">No secrets stored yet.</div>`:n`
          <div class="config-secrets__list">
            ${e.secrets.map(t=>n`
                <div class="config-secrets__item">
                  <span class="config-secrets__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <span class="config-secrets__key">${t}</span>
                  <span class="config-secrets__badge">encrypted</span>
                </div>
              `)}
          </div>
        `}
    </div>
  `}function ni(e){return n`
    <div class="config-webfetch">
      <h3 class="config-webfetch__title">Web Fetch Provider</h3>
      <p class="config-webfetch__hint muted">
        Controls how web pages are fetched. Firecrawl renders JavaScript for dynamic sites.
      </p>
      <div class="config-webfetch__select">
        <select
          class="config-select"
          aria-label="Web fetch provider"
          .value=${e.webFetchProvider}
          ?disabled=${e.webFetchLoading}
          @change=${t=>e.onWebFetchChange(t.target.value)}
        >
          <option value="default" ?selected=${e.webFetchProvider==="default"}>Default (curl)</option>
          <option value="firecrawl" ?selected=${e.webFetchProvider==="firecrawl"}>Firecrawl (JS rendering)</option>
        </select>
      </div>
    </div>
  `}function si(e){return n`
    <div class="config-search-providers">
      <h3 class="config-search-providers__title">Search Providers</h3>
      <p class="config-search-providers__hint muted">
        Default provider for web search tools. Both Tavily and Exa require API keys.
      </p>
      <div class="config-search-providers__select">
        <label class="config-search-providers__label">Default Provider</label>
        <select
          class="config-select"
          aria-label="Default search provider"
          .value=${e.searchProvider}
          ?disabled=${e.searchLoading}
          @change=${t=>e.onSearchProviderChange(t.target.value)}
        >
          <option value="tavily" ?selected=${e.searchProvider==="tavily"}>Tavily</option>
          <option value="exa" ?selected=${e.searchProvider==="exa"}>Exa</option>
        </select>
      </div>
      <div class="config-search-providers__status">
        <div class="config-search-providers__row">
          <span class="config-search-providers__dot ${e.searchTavilyConfigured?"config-search-providers__dot--ok":"config-search-providers__dot--missing"}"></span>
          <span>Tavily API Key</span>
          <span class="config-search-providers__state">${e.searchTavilyConfigured?"Configured":"Not set"}</span>
        </div>
        <div class="config-search-providers__row">
          <span class="config-search-providers__dot ${e.searchExaConfigured?"config-search-providers__dot--ok":"config-search-providers__dot--missing"}"></span>
          <span>Exa API Key</span>
          <span class="config-search-providers__state">${e.searchExaConfigured?"Configured":"Not set"}</span>
        </div>
      </div>
      <p class="config-search-providers__keyhint muted">
        Set API keys via <code>/secrets set EXA_API_KEY</code> or <code>/secrets set TAVILY_API_KEY</code>
      </p>
    </div>
  `}function Ro(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",a=an(e.schema),s=a.schema?a.unsupportedPaths.length>0:!1,i=a.schema?.properties??{},l=Mt.filter(S=>S.key in i&&!Ra.has(S.key)),o=new Set(Mt.map(S=>S.key)),r=Object.keys(i).filter(S=>!o.has(S)).map(S=>({key:S,label:S.charAt(0).toUpperCase()+S.slice(1)})),d=Mt.filter(S=>Ra.has(S.key)),v=[...l,...r,...d],p=e.activeSection&&a.schema&&Q(a.schema)==="object"?a.schema.properties?.[e.activeSection]:void 0,g=e.activeSection?Js(e.activeSection,p):null,h=e.activeSection?Xs({key:e.activeSection,schema:p,uiHints:e.uiHints}):[],$=e.formMode==="form"&&!!e.activeSection&&h.length>0,b=e.activeSubsection===Na,y=e.searchQuery||b?null:e.activeSubsection??h[0]?.key??null,f=e.formMode==="form"?Zs(e.originalValue,e.formValue):[],w=e.formMode==="raw"&&e.raw!==e.originalRaw,C=e.formMode==="form"?f.length>0:w,T=!!e.formValue&&!e.loading&&!!a.schema,k=e.connected&&!e.saving&&C&&(e.formMode==="raw"?!0:T),_=e.connected&&!e.applying&&!e.updating&&C&&(e.formMode==="raw"?!0:T),M=e.connected&&!e.applying&&!e.updating;return n`
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
            aria-label="Search settings"
            .value=${e.searchQuery}
            @input=${S=>e.onSearchChange(S.target.value)}
          />
          ${e.searchQuery?n`
            <button
              class="config-search__clear"
              aria-label="Clear search"
              @click=${()=>e.onSearchChange("")}
            >×</button>
          `:u}
        </div>

        <!-- Section nav -->
        <nav class="config-nav" aria-label="Config sections">
          <button
            class="config-nav__item ${e.activeSection===null?"active":""}"
            aria-label="All Settings"
            aria-current=${e.activeSection===null?"page":"false"}
            @click=${()=>e.onSectionChange(null)}
          >
            <span class="config-nav__icon">${Ft.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${v.map(S=>n`
            <button
              class="config-nav__item ${e.activeSection===S.key?"active":""}"
              aria-label="${S.label} section"
              aria-current=${e.activeSection===S.key?"page":"false"}
              @click=${()=>e.onSectionChange(S.key)}
            >
              <span class="config-nav__icon">${Da(S.key)}</span>
              <span class="config-nav__label">${S.label}</span>
            </button>
          `)}
        </nav>

        <!-- Mode toggle at bottom -->
        <div class="config-sidebar__footer">
          <div class="config-mode-toggle" role="group" aria-label="Editor mode">
            <button
              class="config-mode-toggle__btn ${e.formMode==="form"?"active":""}"
              aria-label="Form editor mode"
              aria-pressed=${e.formMode==="form"?"true":"false"}
              ?disabled=${e.schemaLoading||!e.schema}
              @click=${()=>e.onFormModeChange("form")}
            >
              Form
            </button>
            <button
              class="config-mode-toggle__btn ${e.formMode==="raw"?"active":""}"
              aria-label="Raw JSON editor mode"
              aria-pressed=${e.formMode==="raw"?"true":"false"}
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
            ${C?n`
              <span class="config-changes-badge">${e.formMode==="raw"?"Unsaved changes":`${f.length} unsaved change${f.length!==1?"s":""}`}</span>
            `:n`
                    <span class="config-status muted">No changes</span>
                  `}
          </div>
          <div class="config-actions__right">
            <button class="btn btn--sm" aria-label="Reload configuration" ?disabled=${e.loading} @click=${e.onReload}>
              ${e.loading?"Loading…":"Reload"}
            </button>
            <button
              class="btn btn--sm primary"
              aria-label="Save configuration"
              ?disabled=${!k}
              @click=${e.onSave}
            >
              ${e.saving?"Saving…":"Save"}
            </button>
            <button
              class="btn btn--sm"
              aria-label="Apply configuration changes"
              ?disabled=${!_}
              @click=${e.onApply}
            >
              ${e.applying?"Applying…":"Apply"}
            </button>
            <button
              class="btn btn--sm"
              aria-label="Update gateway"
              ?disabled=${!M}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${C&&e.formMode==="form"?n`
          <details class="config-diff">
            <summary class="config-diff__summary">
              <span>View ${f.length} pending change${f.length!==1?"s":""}</span>
              <svg class="config-diff__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${f.map(S=>n`
                <div class="config-diff__item">
                  <div class="config-diff__path">${S.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${Pa(S.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${Pa(S.to)}</span>
                  </div>
                </div>
              `)}
            </div>
          </details>
        `:u}

        ${g&&e.formMode==="form"?n`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${Da(e.activeSection??"")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${g.label}</div>
                  ${g.description?n`<div class="config-section-hero__desc">${g.description}</div>`:u}
                </div>
              </div>
            `:u}

        ${$?n`
              <nav class="config-subnav" aria-label="Config subsections">
                <button
                  class="config-subnav__item ${y===null?"active":""}"
                  aria-label="Show all subsections"
                  aria-current=${y===null?"page":"false"}
                  @click=${()=>e.onSubsectionChange(Na)}
                >
                  All
                </button>
                ${h.map(S=>n`
                    <button
                      class="config-subnav__item ${y===S.key?"active":""}"
                      title=${S.description||S.label}
                      aria-label="${S.label} subsection"
                      aria-current=${y===S.key?"page":"false"}
                      @click=${()=>e.onSubsectionChange(S.key)}
                    >
                      ${S.label}
                    </button>
                  `)}
              </nav>
            `:u}

        <!-- Form content -->
        <div class="config-content">
          ${e.activeSection==="model"?ti(e):e.activeSection==="user"?qs({userName:e.userName,userAvatar:e.userAvatar,onUpdate:e.onUserProfileUpdate}):e.activeSection==="secrets"?ai(e):e.activeSection==="webfetch"?ni(e):e.activeSection==="search"?si(e):e.formMode==="form"?n`
                  ${e.schemaLoading?n`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `:$s({schema:a.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:a.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:y})}
                  ${s?n`
                          <div class="callout danger" style="margin-top: 12px">
                            Form view can't safely edit some fields. Use Raw to avoid losing config entries.
                          </div>
                        `:u}
                `:n`
                  <label class="field config-raw-field">
                    <span>Raw JSON5</span>
                    <textarea
                      aria-label="Raw JSON5 configuration editor"
                      .value=${e.raw}
                      @input=${S=>e.onRawChange(S.target.value)}
                    ></textarea>
                  </label>
                `}
        </div>

        ${e.issues.length>0?n`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:u}
      </main>
    </div>
  `}function ii(e){const t=e.host??"unknown",a=e.ip?`(${e.ip})`:"",s=e.mode??"",i=e.version??"";return`${t} ${a} ${s} ${i}`.trim()}function li(e){const t=e.ts??null;return t?L(t):"n/a"}function oi(e){return e?`${He(e)} (${L(e)})`:"n/a"}function ri(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,a=e.contextTokens??0;return a?`${t} / ${a}`:String(t)}function ci(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function di(e){const t=e.state??{},a=t.nextRunAtMs?He(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?He(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${a} · last ${s}`}function ui(e){const t=e.schedule;return t.kind==="at"?`At ${He(t.atMs)}`:t.kind==="every"?`Every ${Ya(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function pi(e){const t=e.payload;return t.kind==="systemEvent"?`System: ${t.text}`:`Agent: ${t.message}`}function vi(e){const t=["last",...e.channels.filter(Boolean)],a=e.form.channel?.trim();a&&!t.includes(a)&&t.push(a);const s=new Set;return t.filter(i=>s.has(i)?!1:(s.add(i),!0))}function gi(e,t){if(t==="last")return"last";const a=e.channelMeta?.find(s=>s.id===t);return a?.label?a.label:e.channelLabels?.[t]??t}function No(e){const t=vi(e);return n`
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
            <div class="stat-value">${oi(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
          ${e.error?n`<span class="muted">${e.error}</span>`:u}
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
              @input=${a=>e.onFormChange({name:a.target.value})}
            />
          </label>
          <label class="field">
            <span>Description</span>
            <input
              .value=${e.form.description}
              @input=${a=>e.onFormChange({description:a.target.value})}
            />
          </label>
          <label class="field">
            <span>Agent ID</span>
            <input
              .value=${e.form.agentId}
              @input=${a=>e.onFormChange({agentId:a.target.value})}
              placeholder="default"
            />
          </label>
          <label class="field checkbox">
            <span>Enabled</span>
            <input
              type="checkbox"
              .checked=${e.form.enabled}
              @change=${a=>e.onFormChange({enabled:a.target.checked})}
            />
          </label>
          <label class="field">
            <span>Schedule</span>
            <select
              .value=${e.form.scheduleKind}
              @change=${a=>e.onFormChange({scheduleKind:a.target.value})}
            >
              <option value="every">Every</option>
              <option value="at">At</option>
              <option value="cron">Cron</option>
            </select>
          </label>
        </div>
        ${fi(e)}
        <div class="form-grid" style="margin-top: 12px;">
          <label class="field">
            <span>Session</span>
            <select
              .value=${e.form.sessionTarget}
              @change=${a=>e.onFormChange({sessionTarget:a.target.value})}
            >
              <option value="main">Main</option>
              <option value="isolated">Isolated</option>
            </select>
          </label>
          <label class="field">
            <span>Wake mode</span>
            <select
              .value=${e.form.wakeMode}
              @change=${a=>e.onFormChange({wakeMode:a.target.value})}
            >
              <option value="next-heartbeat">Next heartbeat</option>
              <option value="now">Now</option>
            </select>
          </label>
          <label class="field">
            <span>Payload</span>
            <select
              .value=${e.form.payloadKind}
              @change=${a=>e.onFormChange({payloadKind:a.target.value})}
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
            @input=${a=>e.onFormChange({payloadText:a.target.value})}
            rows="4"
          ></textarea>
        </label>
	          ${e.form.payloadKind==="agentTurn"?n`
	              <div class="form-grid" style="margin-top: 12px;">
                <label class="field checkbox">
                  <span>Deliver</span>
                  <input
                    type="checkbox"
                    .checked=${e.form.deliver}
                    @change=${a=>e.onFormChange({deliver:a.target.checked})}
                  />
	                </label>
	                <label class="field">
	                  <span>Channel</span>
	                  <select
	                    .value=${e.form.channel||"last"}
	                    @change=${a=>e.onFormChange({channel:a.target.value})}
	                  >
	                    ${t.map(a=>n`<option value=${a}>
                            ${gi(e,a)}
                          </option>`)}
                  </select>
                </label>
                <label class="field">
                  <span>To</span>
                  <input
                    .value=${e.form.to}
                    @input=${a=>e.onFormChange({to:a.target.value})}
                    placeholder="+1555… or chat id"
                  />
                </label>
                <label class="field">
                  <span>Timeout (seconds)</span>
                  <input
                    .value=${e.form.timeoutSeconds}
                    @input=${a=>e.onFormChange({timeoutSeconds:a.target.value})}
                  />
                </label>
                ${e.form.sessionTarget==="isolated"?n`
                      <label class="field">
                        <span>Post to main prefix</span>
                        <input
                          .value=${e.form.postToMainPrefix}
                          @input=${a=>e.onFormChange({postToMainPrefix:a.target.value})}
                        />
                      </label>
                    `:u}
              </div>
            `:u}
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
      ${e.jobs.length===0?n`
              <div class="muted" style="margin-top: 12px">No jobs yet.</div>
            `:n`
            <div class="list" style="margin-top: 12px;">
              ${e.jobs.map(a=>hi(a,e))}
            </div>
          `}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Run history</div>
      <div class="card-sub">Latest runs for ${e.runsJobId??"(select a job)"}.</div>
      ${e.runsJobId==null?n`
              <div class="muted" style="margin-top: 12px">Select a job to inspect run history.</div>
            `:e.runs.length===0?n`
                <div class="muted" style="margin-top: 12px">No runs yet.</div>
              `:n`
              <div class="list" style="margin-top: 12px;">
                ${e.runs.map(a=>mi(a))}
              </div>
            `}
    </section>
  `}function fi(e){const t=e.form;return t.scheduleKind==="at"?n`
      <label class="field" style="margin-top: 12px;">
        <span>Run at</span>
        <input
          type="datetime-local"
          .value=${t.scheduleAt}
          @input=${a=>e.onFormChange({scheduleAt:a.target.value})}
        />
      </label>
    `:t.scheduleKind==="every"?n`
      <div class="form-grid" style="margin-top: 12px;">
        <label class="field">
          <span>Every</span>
          <input
            .value=${t.everyAmount}
            @input=${a=>e.onFormChange({everyAmount:a.target.value})}
          />
        </label>
        <label class="field">
          <span>Unit</span>
          <select
            .value=${t.everyUnit}
            @change=${a=>e.onFormChange({everyUnit:a.target.value})}
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </label>
      </div>
    `:n`
    <div class="form-grid" style="margin-top: 12px;">
      <label class="field">
        <span>Expression</span>
        <input
          .value=${t.cronExpr}
          @input=${a=>e.onFormChange({cronExpr:a.target.value})}
        />
      </label>
      <label class="field">
        <span>Timezone (optional)</span>
        <input
          .value=${t.cronTz}
          @input=${a=>e.onFormChange({cronTz:a.target.value})}
        />
      </label>
    </div>
  `}function hi(e,t){const s=`list-item list-item-clickable${t.runsJobId===e.id?" list-item-selected":""}`;return n`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${ui(e)}</div>
        <div class="muted">${pi(e)}</div>
        ${e.agentId?n`<div class="muted">Agent: ${e.agentId}</div>`:u}
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.enabled?"enabled":"disabled"}</span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
      </div>
      <div class="list-meta">
        <div>${di(e)}</div>
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
  `}function mi(e){return n`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${He(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?n`<div class="muted">${e.error}</div>`:u}
      </div>
    </div>
  `}function Do(e){const a=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=a?.critical??0,i=a?.warn??0,l=a?.info??0,o=s>0?"danger":i>0?"warn":"success",r=s>0?`${s} critical`:i>0?`${i} warnings`:"No critical issues";return n`
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
            ${a?n`<div class="callout ${o}" style="margin-top: 8px;">
                  Security audit: ${r}${l>0?` · ${l} info`:""}. Run
                  <span class="mono">openclaw security audit --deep</span> for details.
                </div>`:u}
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
        ${e.callError?n`<div class="callout danger" style="margin-top: 12px;">
              ${e.callError}
            </div>`:u}
        ${e.callResult?n`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:u}
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
      ${e.eventLog.length===0?n`
              <div class="muted" style="margin-top: 12px">No events yet.</div>
            `:n`
            <div class="list" style="margin-top: 12px;">
              ${e.eventLog.map(d=>n`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${d.event}</div>
                      <div class="list-sub">${new Date(d.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta">
                      <pre class="code-block">${ci(d.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function bi(e){const t=Math.max(0,e),a=Math.floor(t/1e3);if(a<60)return`${a}s`;const s=Math.floor(a/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function fe(e,t){return t?n`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:u}function Po(e){const t=e.execApprovalQueue[0];if(!t)return u;const a=t.request,s=t.expiresAtMs-Date.now(),i=s>0?`expires in ${bi(s)}`:"expired",l=e.execApprovalQueue.length;return n`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
          ${l>1?n`<div class="exec-approval-queue">${l} pending</div>`:u}
        </div>
        <div class="exec-approval-command mono">${a.command}</div>
        <div class="exec-approval-meta">
          ${fe("Host",a.host)}
          ${fe("Agent",a.agentId)}
          ${fe("Session",a.sessionKey)}
          ${fe("CWD",a.cwd)}
          ${fe("Resolved",a.resolvedPath)}
          ${fe("Security",a.security)}
          ${fe("Ask",a.ask)}
        </div>
        ${e.execApprovalError?n`<div class="exec-approval-error">${e.execApprovalError}</div>`:u}
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
  `}function Io(e){return n`
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
      ${e.lastError?n`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:u}
      ${e.statusMessage?n`<div class="callout" style="margin-top: 12px;">
            ${e.statusMessage}
          </div>`:u}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?n`
                <div class="muted">No instances reported yet.</div>
              `:e.entries.map(t=>yi(t))}
      </div>
    </section>
  `}function yi(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",a=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],i=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],l=i.length>0?i.length>3?`${i.length} scopes`:`scopes: ${i.join(", ")}`:null;return n`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${ii(e)}</div>
        <div class="chip-row">
          <span class="chip">${a}</span>
          ${s.map(o=>n`<span class="chip">${o}</span>`)}
          ${l?n`<span class="chip">${l}</span>`:u}
          ${e.platform?n`<span class="chip">${e.platform}</span>`:u}
          ${e.deviceFamily?n`<span class="chip">${e.deviceFamily}</span>`:u}
          ${e.modelIdentifier?n`<span class="chip">${e.modelIdentifier}</span>`:u}
          ${e.version?n`<span class="chip">${e.version}</span>`:u}
        </div>
      </div>
      <div class="list-meta">
        <div>${li(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}const za=["trace","debug","info","warn","error","fatal"];function $i(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function wi(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function zo(e){const t=e.filterText.trim().toLowerCase(),a=za.some(l=>!e.levelFilters[l]),s=e.entries.filter(l=>l.level&&!e.levelFilters[l.level]?!1:wi(l,t)),i=t||a?"filtered":"visible";return n`
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
            @click=${()=>e.onExport(s.map(l=>l.raw),i)}
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
            @input=${l=>e.onFilterTextChange(l.target.value)}
            placeholder="Search logs"
          />
        </label>
        <label class="field checkbox">
          <span>Auto-follow</span>
          <input
            type="checkbox"
            .checked=${e.autoFollow}
            @change=${l=>e.onToggleAutoFollow(l.target.checked)}
          />
        </label>
      </div>

      <div class="chip-row" style="margin-top: 12px;">
        ${za.map(l=>n`
            <label class="chip log-chip ${l}">
              <input
                type="checkbox"
                .checked=${e.levelFilters[l]}
                @change=${o=>e.onLevelToggle(l,o.target.checked)}
              />
              <span>${l}</span>
            </label>
          `)}
      </div>

      ${e.file?n`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:u}
      ${e.truncated?n`
              <div class="callout" style="margin-top: 10px">Log output truncated; showing latest chunk.</div>
            `:u}
      ${e.error?n`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:u}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${s.length===0?n`
                <div class="muted" style="padding: 12px">No log entries.</div>
              `:s.map(l=>n`
                <div class="log-row">
                  <div class="log-time mono">${$i(l.time)}</div>
                  <div class="log-level ${l.level??""}">${l.level??""}</div>
                  <div class="log-subsystem mono">${l.subsystem??""}</div>
                  <div class="log-message mono">${l.message??l.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}function Oo(e){const t=Ci(e),a=Ni(e);return n`
    ${Pi(a)}
    ${Di(t)}
    ${xi(e)}
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
        ${e.nodes.length===0?n`
                <div class="muted">No nodes found.</div>
              `:e.nodes.map(s=>Vi(s))}
      </div>
    </section>
  `}function xi(e){const t=e.devicesList??{pending:[],paired:[]},a=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return n`
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
      ${e.devicesError?n`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:u}
      <div class="list" style="margin-top: 16px;">
        ${a.length>0?n`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${a.map(i=>ki(i,e))}
            `:u}
        ${s.length>0?n`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(i=>Ai(i,e))}
            `:u}
        ${a.length===0&&s.length===0?n`
                <div class="muted">No paired devices.</div>
              `:u}
      </div>
    </section>
  `}function ki(e,t){const a=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?L(e.ts):"n/a",i=e.role?.trim()?`role: ${e.role}`:"role: -",l=e.isRepair?" · repair":"",o=e.remoteIp?` · ${e.remoteIp}`:"";return n`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${a}</div>
        <div class="list-sub">${e.deviceId}${o}</div>
        <div class="muted" style="margin-top: 6px;">
          ${i} · requested ${s}${l}
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
  `}function Ai(e,t){const a=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",i=`roles: ${Dt(e.roles)}`,l=`scopes: ${Dt(e.scopes)}`,o=Array.isArray(e.tokens)?e.tokens:[];return n`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${a}</div>
        <div class="list-sub">${e.deviceId}${s}</div>
        <div class="muted" style="margin-top: 6px;">${i} · ${l}</div>
        ${o.length===0?n`
                <div class="muted" style="margin-top: 6px">Tokens: none</div>
              `:n`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${o.map(r=>_i(e.deviceId,r,t))}
              </div>
            `}
      </div>
    </div>
  `}function _i(e,t,a){const s=t.revokedAtMs?"revoked":"active",i=`scopes: ${Dt(t.scopes)}`,l=L(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return n`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${i} · ${l}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>a.onDeviceRotate(e,t.role,t.scopes)}
        >
          Rotate
        </button>
        ${t.revokedAtMs?u:n`
              <button
                class="btn btn--sm danger"
                @click=${()=>a.onDeviceRevoke(e,t.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}const ue="__defaults__",Oa=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],Si=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function Ci(e){const t=e.configForm,a=Hi(e.nodes),{defaultBinding:s,agents:i}=Wi(t),l=!!t,o=e.configSaving||e.configFormMode==="raw";return{ready:l,disabled:o,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:i,nodes:a,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function Ba(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function Ti(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function Ei(e){const t=e?.defaults??{};return{security:Ba(t.security),ask:Ti(t.ask),askFallback:Ba(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function Mi(e){const t=e?.agents??{},a=Array.isArray(t.list)?t.list:[],s=[];return a.forEach(i=>{if(!i||typeof i!="object")return;const l=i,o=typeof l.id=="string"?l.id.trim():"";if(!o)return;const r=typeof l.name=="string"?l.name.trim():void 0,d=l.default===!0;s.push({id:o,name:r||void 0,isDefault:d})}),s}function Li(e,t){const a=Mi(e),s=Object.keys(t?.agents??{}),i=new Map;a.forEach(o=>i.set(o.id,o)),s.forEach(o=>{i.has(o)||i.set(o,{id:o})});const l=Array.from(i.values());return l.length===0&&l.push({id:"main",isDefault:!0}),l.sort((o,r)=>{if(o.isDefault&&!r.isDefault)return-1;if(!o.isDefault&&r.isDefault)return 1;const d=o.name?.trim()?o.name:o.id,v=r.name?.trim()?r.name:r.id;return d.localeCompare(v)}),l}function Ri(e,t){return e===ue?ue:e&&t.some(a=>a.id===e)?e:ue}function Ni(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,a=!!t,s=Ei(t),i=Li(e.configForm,t),l=ji(e.nodes),o=e.execApprovalsTarget;let r=o==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o==="node"&&r&&!l.some(g=>g.id===r)&&(r=null);const d=Ri(e.execApprovalsSelectedAgent,i),v=d!==ue?(t?.agents??{})[d]??null:null,p=Array.isArray(v?.allowlist)?v.allowlist??[]:[];return{ready:a,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:d,selectedAgent:v,agents:i,allowlist:p,target:o,targetNodeId:r,targetNodes:l,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function Di(e){const t=e.nodes.length>0,a=e.defaultBinding??"";return n`
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

      ${e.formMode==="raw"?n`
              <div class="callout warn" style="margin-top: 12px">
                Switch the Config tab to <strong>Form</strong> mode to edit bindings here.
              </div>
            `:u}

      ${e.ready?n`
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
                      @change=${s=>{const l=s.target.value.trim();e.onBindDefault(l||null)}}
                    >
                      <option value="" ?selected=${a===""}>Any node</option>
                      ${e.nodes.map(s=>n`<option
                            value=${s.id}
                            ?selected=${a===s.id}
                          >
                            ${s.label}
                          </option>`)}
                    </select>
                  </label>
                  ${t?u:n`
                          <div class="muted">No nodes with system.run available.</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?n`
                      <div class="muted">No agents found.</div>
                    `:e.agents.map(s=>Ui(s,e))}
            </div>
          `:n`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function Pi(e){const t=e.ready,a=e.target!=="node"||!!e.targetNodeId;return n`
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
          ?disabled=${e.disabled||!e.dirty||!a}
          @click=${e.onSave}
        >
          ${e.saving?"Saving…":"Save"}
        </button>
      </div>

      ${Ii(e)}

      ${t?n`
            ${zi(e)}
            ${Oi(e)}
            ${e.selectedScope===ue?u:Bi(e)}
          `:n`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!a} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function Ii(e){const t=e.targetNodes.length>0,a=e.targetNodeId??"";return n`
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
              @change=${s=>{if(s.target.value==="node"){const o=e.targetNodes[0]?.id??null;e.onSelectTarget("node",a||o)}else e.onSelectTarget("gateway",null)}}
            >
              <option value="gateway" ?selected=${e.target==="gateway"}>Gateway</option>
              <option value="node" ?selected=${e.target==="node"}>Node</option>
            </select>
          </label>
          ${e.target==="node"?n`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${e.disabled||!t}
                    @change=${s=>{const l=s.target.value.trim();e.onSelectTarget("node",l||null)}}
                  >
                    <option value="" ?selected=${a===""}>Select node</option>
                    ${e.targetNodes.map(s=>n`<option
                          value=${s.id}
                          ?selected=${a===s.id}
                        >
                          ${s.label}
                        </option>`)}
                  </select>
                </label>
              `:u}
        </div>
      </div>
      ${e.target==="node"&&!t?n`
              <div class="muted">No nodes advertise exec approvals yet.</div>
            `:u}
    </div>
  `}function zi(e){return n`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===ue?"active":""}"
          @click=${()=>e.onSelectScope(ue)}
        >
          Defaults
        </button>
        ${e.agents.map(t=>{const a=t.name?.trim()?`${t.name} (${t.id})`:t.id;return n`
            <button
              class="btn btn--sm ${e.selectedScope===t.id?"active":""}"
              @click=${()=>e.onSelectScope(t.id)}
            >
              ${a}
            </button>
          `})}
      </div>
    </div>
  `}function Oi(e){const t=e.selectedScope===ue,a=e.defaults,s=e.selectedAgent??{},i=t?["defaults"]:["agents",e.selectedScope],l=typeof s.security=="string"?s.security:void 0,o=typeof s.ask=="string"?s.ask:void 0,r=typeof s.askFallback=="string"?s.askFallback:void 0,d=t?a.security:l??"__default__",v=t?a.ask:o??"__default__",p=t?a.askFallback:r??"__default__",g=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,h=g??a.autoAllowSkills,$=g==null;return n`
    <div class="list" style="margin-top: 16px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Security</div>
          <div class="list-sub">
            ${t?"Default security mode.":`Default: ${a.security}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const f=b.target.value;!t&&f==="__default__"?e.onRemove([...i,"security"]):e.onPatch([...i,"security"],f)}}
            >
              ${t?u:n`<option value="__default__" ?selected=${d==="__default__"}>
                    Use default (${a.security})
                  </option>`}
              ${Oa.map(b=>n`<option
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
            ${t?"Default prompt policy.":`Default: ${a.ask}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const f=b.target.value;!t&&f==="__default__"?e.onRemove([...i,"ask"]):e.onPatch([...i,"ask"],f)}}
            >
              ${t?u:n`<option value="__default__" ?selected=${v==="__default__"}>
                    Use default (${a.ask})
                  </option>`}
              ${Si.map(b=>n`<option
                    value=${b.value}
                    ?selected=${v===b.value}
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
            ${t?"Applied when the UI prompt is unavailable.":`Default: ${a.askFallback}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Fallback</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const f=b.target.value;!t&&f==="__default__"?e.onRemove([...i,"askFallback"]):e.onPatch([...i,"askFallback"],f)}}
            >
              ${t?u:n`<option value="__default__" ?selected=${p==="__default__"}>
                    Use default (${a.askFallback})
                  </option>`}
              ${Oa.map(b=>n`<option
                    value=${b.value}
                    ?selected=${p===b.value}
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
            ${t?"Allow skill executables listed by the Gateway.":$?`Using default (${a.autoAllowSkills?"on":"off"}).`:`Override (${h?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${h}
              @change=${b=>{const y=b.target;e.onPatch([...i,"autoAllowSkills"],y.checked)}}
            />
          </label>
          ${!t&&!$?n`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,"autoAllowSkills"])}
              >
                Use default
              </button>`:u}
        </div>
      </div>
    </div>
  `}function Bi(e){const t=["agents",e.selectedScope,"allowlist"],a=e.allowlist;return n`
    <div class="row" style="margin-top: 18px; justify-content: space-between;">
      <div>
        <div class="card-title">Allowlist</div>
        <div class="card-sub">Case-insensitive glob patterns.</div>
      </div>
      <button
        class="btn btn--sm"
        ?disabled=${e.disabled}
        @click=${()=>{const s=[...a,{pattern:""}];e.onPatch(t,s)}}
      >
        Add pattern
      </button>
    </div>
    <div class="list" style="margin-top: 12px;">
      ${a.length===0?n`
              <div class="muted">No allowlist entries yet.</div>
            `:a.map((s,i)=>Fi(e,s,i))}
    </div>
  `}function Fi(e,t,a){const s=t.lastUsedAt?L(t.lastUsedAt):"never",i=t.lastUsedCommand?je(t.lastUsedCommand,120):null,l=t.lastResolvedPath?je(t.lastResolvedPath,120):null;return n`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${i?n`<div class="list-sub mono">${i}</div>`:u}
        ${l?n`<div class="list-sub mono">${l}</div>`:u}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${t.pattern??""}
            ?disabled=${e.disabled}
            @input=${o=>{const r=o.target;e.onPatch(["agents",e.selectedScope,"allowlist",a,"pattern"],r.value)}}
          />
        </label>
        <button
          class="btn btn--sm danger"
          ?disabled=${e.disabled}
          @click=${()=>{if(e.allowlist.length<=1){e.onRemove(["agents",e.selectedScope,"allowlist"]);return}e.onRemove(["agents",e.selectedScope,"allowlist",a])}}
        >
          Remove
        </button>
      </div>
    </div>
  `}function Ui(e,t){const a=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,i=t.nodes.length>0;return n`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="list-sub">
          ${e.isDefault?"default agent":"agent"} ·
          ${a==="__default__"?`uses default (${t.defaultBinding??"any"})`:`override: ${e.binding}`}
        </div>
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Binding</span>
          <select
            ?disabled=${t.disabled||!i}
            @change=${l=>{const r=l.target.value.trim();t.onBindAgent(e.index,r==="__default__"?null:r)}}
          >
            <option value="__default__" ?selected=${a==="__default__"}>
              Use default
            </option>
            ${t.nodes.map(l=>n`<option
                  value=${l.id}
                  ?selected=${a===l.id}
                >
                  ${l.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function Hi(e){const t=[];for(const a of e){if(!(Array.isArray(a.commands)?a.commands:[]).some(r=>String(r)==="system.run"))continue;const l=typeof a.nodeId=="string"?a.nodeId.trim():"";if(!l)continue;const o=typeof a.displayName=="string"&&a.displayName.trim()?a.displayName.trim():l;t.push({id:l,label:o===l?l:`${o} · ${l}`})}return t.sort((a,s)=>a.label.localeCompare(s.label)),t}function ji(e){const t=[];for(const a of e){if(!(Array.isArray(a.commands)?a.commands:[]).some(r=>String(r)==="system.execApprovals.get"||String(r)==="system.execApprovals.set"))continue;const l=typeof a.nodeId=="string"?a.nodeId.trim():"";if(!l)continue;const o=typeof a.displayName=="string"&&a.displayName.trim()?a.displayName.trim():l;t.push({id:l,label:o===l?l:`${o} · ${l}`})}return t.sort((a,s)=>a.label.localeCompare(s.label)),t}function Wi(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},i=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,l=e.agents??{},o=Array.isArray(l.list)?l.list:[];if(o.length===0)return{defaultBinding:i,agents:[t]};const r=[];return o.forEach((d,v)=>{if(!d||typeof d!="object")return;const p=d,g=typeof p.id=="string"?p.id.trim():"";if(!g)return;const h=typeof p.name=="string"?p.name.trim():void 0,$=p.default===!0,y=(p.tools??{}).exec??{},f=typeof y.node=="string"&&y.node.trim()?y.node.trim():null;r.push({id:g,name:h||void 0,index:v,isDefault:$,binding:f})}),r.length===0&&r.push(t),{defaultBinding:i,agents:r}}function Vi(e){const t=!!e.connected,a=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),i=Array.isArray(e.caps)?e.caps:[],l=Array.isArray(e.commands)?e.commands:[];return n`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="list-sub">
          ${typeof e.nodeId=="string"?e.nodeId:""}
          ${typeof e.remoteIp=="string"?` · ${e.remoteIp}`:""}
          ${typeof e.version=="string"?` · ${e.version}`:""}
        </div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${a?"paired":"unpaired"}</span>
          <span class="chip ${t?"chip-ok":"chip-warn"}">
            ${t?"connected":"offline"}
          </span>
          ${i.slice(0,12).map(o=>n`<span class="chip">${String(o)}</span>`)}
          ${l.slice(0,8).map(o=>n`<span class="chip">${String(o)}</span>`)}
        </div>
      </div>
    </div>
  `}const Gi=["","off","minimal","low","medium","high"],Yi=["","off","on"],Ki=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],qi=["","off","on","stream"];function Ji(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function ln(e){return Ji(e)==="zai"}function Xi(e){return ln(e)?Yi:Gi}function Zi(e,t){return!t||!e||e==="off"?e:"on"}function Qi(e,t){return e?t&&e==="on"?"low":e:null}function el(e){switch(e){case"idle-7d":return"Idle > 7 days";case"task-complete":return"Task completed";case"manual":return"Manual";default:return e}}function tl(){return n`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
    <path d="M10 12h4"/>
  </svg>`}function al(){return n`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 14 4 9 9 4"/>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
  </svg>`}function nl(e){return n`<svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="transition: transform 150ms ease; transform: rotate(${e?"90deg":"0deg"});"
  >
    <polyline points="9 18 15 12 9 6"/>
  </svg>`}function Bo(e){const t=e.result?.sessions??[],a=new Set(e.archivedSessions.map(l=>l.sessionKey)),s=t.filter(l=>!a.has(l.key)),i=e.archivedSessions.length;return n`
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
            @input=${l=>e.onFiltersChange({activeMinutes:l.target.value,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field">
          <span>Limit</span>
          <input
            .value=${e.limit}
            @input=${l=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:l.target.value,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include global</span>
          <input
            type="checkbox"
            .checked=${e.includeGlobal}
            @change=${l=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:l.target.checked,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include unknown</span>
          <input
            type="checkbox"
            .checked=${e.includeUnknown}
            @change=${l=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:l.target.checked})}
          />
        </label>
      </div>

      ${e.error?n`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:u}

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
        ${s.length===0?n`
                <div class="muted">No active sessions found.</div>
              `:s.map(l=>il(l,e.basePath,e.onPatch,e.onDelete,e.onArchive,e.loading))}
      </div>
    </section>

    ${sl(e,i)}
  `}function sl(e,t){return t===0&&!e.archivedSessionsLoading?u:n`
    <section class="card archived-section">
      <div
        class="archived-section__header"
        @click=${e.onToggleArchived}
      >
        <div class="row" style="gap: 8px; align-items: center;">
          ${nl(e.archivedSessionsExpanded)}
          <span class="archived-section__title">Archived</span>
          ${t>0?n`<span class="archived-badge">${t}</span>`:u}
        </div>
        <span class="archived-section__hint">
          Sessions removed from the active list
        </span>
      </div>

      ${e.archivedSessionsExpanded?n`
              <div class="archived-table" style="margin-top: 12px;">
                <div class="archived-table__head">
                  <div>Session Key</div>
                  <div>Archived</div>
                  <div>Reason</div>
                  <div>Linked Task</div>
                  <div>Actions</div>
                </div>
                ${e.archivedSessionsLoading?n`<div class="muted" style="padding: 12px;">Loading...</div>`:e.archivedSessions.length===0?n`<div class="muted" style="padding: 12px;">No archived sessions.</div>`:e.archivedSessions.map(a=>ll(a,e.onUnarchive,e.loading))}
              </div>
            `:u}
    </section>
  `}function il(e,t,a,s,i,l){const o=e.updatedAt?L(e.updatedAt):"n/a",r=e.thinkingLevel??"",d=ln(e.modelProvider),v=Zi(r,d),p=Xi(e.modelProvider),g=e.verboseLevel??"",h=e.reasoningLevel??"",$=e.displayName??e.key,b=e.kind!=="global",y=b?`${En("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return n`
    <div class="table-row">
      <div class="mono">${b?n`<a href=${y} class="session-link">${$}</a>`:$}</div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${l}
          placeholder="(optional)"
          @change=${f=>{const w=f.target.value.trim();a(e.key,{label:w||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${o}</div>
      <div>${ri(e)}</div>
      <div>
        <select
          .value=${v}
          ?disabled=${l}
          @change=${f=>{const w=f.target.value;a(e.key,{thinkingLevel:Qi(w,d)})}}
        >
          ${p.map(f=>n`<option value=${f}>${f||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${g}
          ?disabled=${l}
          @change=${f=>{const w=f.target.value;a(e.key,{verboseLevel:w||null})}}
        >
          ${Ki.map(f=>n`<option value=${f.value}>${f.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${h}
          ?disabled=${l}
          @change=${f=>{const w=f.target.value;a(e.key,{reasoningLevel:w||null})}}
        >
          ${qi.map(f=>n`<option value=${f}>${f||"inherit"}</option>`)}
        </select>
      </div>
      <div class="row" style="gap: 4px;">
        <button
          class="btn btn-icon"
          ?disabled=${l}
          @click=${()=>i(e.key)}
          title="Archive this session"
        >
          ${tl()}
        </button>
        <button class="btn danger btn--sm" ?disabled=${l} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function ll(e,t,a){const s=L(Date.parse(e.archivedAt));return n`
    <div class="archived-table__row">
      <div class="mono" style="opacity: 0.7;">${e.sessionKey}</div>
      <div>${s}</div>
      <div>${el(e.reason)}</div>
      <div class="mono" style="font-size: 11px; opacity: 0.6;">
        ${e.linkedTaskId?e.linkedTaskId.slice(0,8):"--"}
      </div>
      <div>
        <button
          class="btn btn-icon"
          ?disabled=${a}
          @click=${()=>t(e.sessionKey)}
          title="Restore this session"
        >
          ${al()}
        </button>
      </div>
    </div>
  `}function Fo(e){const t=e.subTab==="godmode",a=t||e.subTab==="my-skills";return n`
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
        </div>
        ${a?n`<button class="btn" ?disabled=${e.loading||e.godmodeSkillsLoading} @click=${e.onRefresh}>
              ${e.loading||e.godmodeSkillsLoading?"Loading…":"Refresh"}
            </button>`:u}
      </div>

      ${t?ol(e):u}
      ${e.subTab==="my-skills"?dl(e):u}
    </section>
  `}function ol(e){const t=e.godmodeSkills,a=e.godmodeSkillsLoading,s=e.filter.trim().toLowerCase();if(a&&!t)return n`<div class="muted" style="margin-top: 16px;">Loading GodMode skills...</div>`;if(!t||t.total===0)return n`<div class="muted" style="margin-top: 16px;">No GodMode skills found.</div>`;const i=[...t.skills.map(o=>({...o,_kind:"skill"})),...t.cards.map(o=>({...o,_kind:"card"}))],l=s?i.filter(o=>[o.slug,o.name,o.body.slice(0,200)].join(" ").toLowerCase().includes(s)):i;return n`
    <div class="filters" style="margin-top: 14px;">
      <label class="field" style="flex: 1;">
        <span>Filter</span>
        <input
          .value=${e.filter}
          @input=${o=>e.onFilterChange(o.target.value)}
          placeholder="Search skills and cards"
        />
      </label>
      <div class="muted">${l.length} of ${i.length}</div>
    </div>

    ${l.length===0?n`<div class="muted" style="margin-top: 16px;">No matches.</div>`:n`<div class="list" style="margin-top: 16px;">
          ${l.map(o=>o._kind==="skill"?rl(o,e.expandedSkills.has(o.slug),e.onToggleExpand):cl(o,e.expandedSkills.has(o.slug),e.onToggleExpand))}
        </div>`}
  `}function rl(e,t,a){const s=e.body.split(`
`).find(l=>l.trim().length>0)??"",i=!!e.schedule;return n`
    <div
      class="list-item"
      style="cursor: pointer;"
      @click=${()=>a(e.slug)}
    >
      <div class="list-main">
        <div class="row" style="align-items: center; gap: 8px;">
          <span style="font-size: 10px; color: var(--muted-color, #888); transition: transform 0.15s;
                       display: inline-block; transform: rotate(${t?"90deg":"0deg"});">
            \u25B6
          </span>
          <div class="list-title" style="flex: 1;">${e.name}</div>
          ${i?n`<span class="chip chip-ok" style="font-size: 11px;">scheduled</span>`:n`<span class="chip" style="font-size: 11px;">on-demand</span>`}
        </div>
        <div class="list-sub" style="margin-left: 18px;">${je(s,120)}</div>
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          <span class="chip chip-ok">skill</span>
          <span class="chip">${e.trigger}</span>
          ${e.schedule?n`<span class="chip">${e.schedule}</span>`:u}
          ${e.persona?n`<span class="chip">${e.persona}</span>`:u}
          <span class="chip">${e.taskType}</span>
        </div>
        ${t?n`
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
                  ${e.persona?n`
                        <span class="muted">Persona:</span>
                        <span>${e.persona}</span>
                      `:u}
                  ${e.schedule?n`
                        <span class="muted">Schedule:</span>
                        <span>${e.schedule}</span>
                      `:u}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${e.body}
                </div>
              </div>
            `:u}
      </div>
    </div>
  `}function cl(e,t,a){return n`
    <div
      class="list-item"
      style="cursor: pointer;"
      @click=${()=>a(e.slug)}
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
          ${e.tools.length>0?n`<span class="chip">${e.tools.length} tools</span>`:u}
        </div>
        ${t?n`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px;">
                  <span class="muted">Keywords:</span>
                  <span>${e.triggers.join(", ")}</span>
                  ${e.tools.length>0?n`
                        <span class="muted">Tools:</span>
                        <span>${e.tools.join(", ")}</span>
                      `:u}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${e.body}
                </div>
              </div>
            `:u}
      </div>
    </div>
  `}function dl(e){const t=e.report?.skills??[],a=e.filter.trim().toLowerCase(),s=a?t.filter(i=>[i.name,i.description,i.source].join(" ").toLowerCase().includes(a)):t;return n`
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

    ${e.error?n`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:u}

    ${s.length===0?n`<div class="muted" style="margin-top: 16px">No integrations found.</div>`:n`<div class="list" style="margin-top: 16px;">
            ${s.map(i=>ul(i,e))}
          </div>`}
  `}function ul(e,t){const a=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",i=t.messages[e.skillKey]??null,l=e.install.length>0&&e.missing.bins.length>0,o=[...e.missing.bins.map(d=>`bin:${d}`),...e.missing.env.map(d=>`env:${d}`),...e.missing.config.map(d=>`config:${d}`),...e.missing.os.map(d=>`os:${d}`)],r=[];return e.disabled&&r.push("disabled"),e.blockedByAllowlist&&r.push("blocked by allowlist"),n`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${je(e.description,140)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.source}</span>
          <span class="chip ${e.eligible?"chip-ok":"chip-warn"}">
            ${e.eligible?"eligible":"blocked"}
          </span>
          ${e.disabled?n`
                  <span class="chip chip-warn">disabled</span>
                `:u}
        </div>
        ${o.length>0?n`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${o.join(", ")}
              </div>
            `:u}
        ${r.length>0?n`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${r.join(", ")}
              </div>
            `:u}
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; flex-wrap: wrap;">
          <button
            class="btn"
            ?disabled=${a}
            @click=${()=>t.onToggle(e.skillKey,e.disabled)}
          >
            ${e.disabled?"Enable":"Disable"}
          </button>
          ${l?n`<button
                class="btn"
                ?disabled=${a}
                @click=${()=>t.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${a?"Installing…":e.install[0].label}
              </button>`:u}
        </div>
        ${i?n`<div
              class="muted"
              style="margin-top: 8px; color: ${i.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${i.message}
            </div>`:u}
        ${e.primaryEnv?n`
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
                ?disabled=${a}
                @click=${()=>t.onSaveKey(e.skillKey)}
              >
                Save key
              </button>
            `:u}
      </div>
    </div>
  `}function pl(e){switch(e){case"claude":return"chip-ok";case"codex":return"chip-warn";case"gemini":return"chip-info";default:return""}}function Uo(e){const t=e.filter.trim().toLowerCase(),a=t?e.roster.filter(l=>[l.slug,l.name,l.category,l.mission??"",...l.taskTypes].join(" ").toLowerCase().includes(t)):e.roster,s=new Map;for(const l of a){const o=l.category||"_default";s.has(o)||s.set(o,[]),s.get(o).push(l)}const i=[...s.keys()].sort((l,o)=>l==="_default"?1:o==="_default"?-1:l.localeCompare(o));return n`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div class="muted">${a.length} agent${a.length!==1?"s":""}</div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${e.filter}
            @input=${l=>e.onFilterChange(l.target.value)}
            placeholder="Search agents by name, category, or task type"
          />
        </label>
      </div>

      ${e.error?n`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:u}

      ${e.loading&&e.roster.length===0?n`<div class="muted" style="margin-top: 16px;">Loading agent roster...</div>`:u}

      ${!e.loading&&a.length===0?n`<div class="muted" style="margin-top: 16px;">
            ${e.roster.length===0?"No agents found. Add persona files to your agent-roster directory.":"No matches."}
          </div>`:u}

      ${i.map(l=>{const o=s.get(l),r=l==="_default"?"General":on(l);return n`
          <div style="margin-top: 20px;">
            <div
              style="font-size: 12px; font-weight: 600; text-transform: uppercase;
                     letter-spacing: 0.05em; color: var(--muted-color, #888);
                     margin-bottom: 8px; padding-left: 2px;"
            >
              ${r}
            </div>
            <div class="list">
              ${o.map(d=>vl(d,e.expandedAgents.has(d.slug),e.onToggleExpand))}
            </div>
          </div>
        `})}
    </section>
  `}function on(e){return e.replace(/[-_]/g," ").replace(/\b\w/g,t=>t.toUpperCase())}function vl(e,t,a){return n`
    <div
      class="list-item"
      style="cursor: pointer;"
      @click=${()=>a(e.slug)}
    >
      <div class="list-main">
        <div class="row" style="align-items: center; gap: 8px;">
          <span style="font-size: 10px; color: var(--muted-color, #888); transition: transform 0.15s;
                       display: inline-block; transform: rotate(${t?"90deg":"0deg"});">
            \u25B6
          </span>
          <div class="list-title" style="flex: 1;">${e.name}</div>
          ${e.engine?n`<span class="chip ${pl(e.engine)}" style="font-size: 11px;">${e.engine}</span>`:u}
        </div>
        ${e.mission?n`<div class="list-sub" style="margin-left: 18px;">${je(e.mission,120)}</div>`:u}
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          ${e.taskTypes.map(s=>n`<span class="chip">${s}</span>`)}
        </div>
        ${t?n`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px; margin-bottom: 10px;">
                  <span class="muted">Slug:</span>
                  <span style="font-family: monospace;">${e.slug}</span>
                  <span class="muted">Category:</span>
                  <span>${on(e.category||"_default")}</span>
                  ${e.engine?n`
                        <span class="muted">Engine:</span>
                        <span>${e.engine}</span>
                      `:u}
                  <span class="muted">Task types:</span>
                  <span>${e.taskTypes.join(", ")||"auto"}</span>
                </div>
                ${e.body?n`
                      <div
                        style="font-size: 13px; line-height: 1.6;
                               white-space: pre-wrap; color: var(--text-color, #333);
                               max-height: 400px; overflow-y: auto;
                               padding-top: 10px; border-top: 1px solid var(--border-color, #eee);"
                      >
                        ${e.body}
                      </div>
                    `:u}
              </div>
            `:u}
      </div>
    </div>
  `}const Fa=["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Anchorage","Pacific/Honolulu","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Shanghai","Asia/Kolkata","Australia/Sydney","Pacific/Auckland"],gl=["Direct and concise -- no fluff, just answers","Detailed explanations -- walk me through the reasoning","Casual and conversational -- like talking to a friend","Structured with bullet points -- organized and scannable","Technical and precise -- specifics matter"],fl=[{value:"sonnet",label:"Sonnet (fast, balanced)"},{value:"opus",label:"Opus (deep reasoning)"},{value:"haiku",label:"Haiku (quick, lightweight)"}],Lt=["Never send emails without explicit approval","Never delete or overwrite files without backup","Always search memory before guessing","Never share private information externally"],Ua=[{label:"Name",question:"What should I call you?"},{label:"Timezone",question:"What timezone are you in?"},{label:"Focus",question:"What are you building or focused on?"},{label:"Projects",question:"What are your top projects? (1-3)"},{label:"Style",question:"How do you like to communicate?"},{label:"Rules",question:"What rules must the AI always follow?"},{label:"People",question:"Who are the key people in your work/life?"},{label:"Model",question:"What AI model do you prefer?"}];function Ha(e){const a=Math.min(Number(e),8);return n`
    <div class="wizard-progress">
      <div class="wizard-progress-dots">
        ${Array.from({length:8},(s,i)=>n`
          <div class="wizard-progress-dot ${i<a?"completed":""} ${i===a?"active":""}"></div>
        `)}
      </div>
      <div class="wizard-progress-text">
        ${a<8?`Step ${a+1} of 8`:"Review"}
      </div>
    </div>
  `}function hl(e){if(e>=Ua.length)return n`${u}`;const t=Ua[e];return n`
    <div class="wizard-step-header">
      <h2 class="wizard-question">${t.question}</h2>
    </div>
  `}function ml(e,t,a,s){return n`
    <div class="wizard-nav">
      ${e>0?n`
            <button
              class="wizard-btn wizard-btn--back"
              @click=${()=>t.onStepChange(e-1)}
            >Back</button>
          `:n`<div></div>`}
      <button
        class="wizard-btn wizard-btn--next ${a?"":"wizard-btn--disabled"}"
        ?disabled=${!a}
        @click=${()=>{s?(t.onStepChange(8),t.onPreview()):t.onStepChange(e+1)}}
      >${s?"Review":"Continue"}</button>
    </div>
  `}function rn(){return n`<p class="wizard-skip-hint">Press Enter to use the default and continue</p>`}function bl(e,t){function a(i){const l=i.target.value;t.onAnswerChange("name",l)}function s(i){i.key==="Enter"&&(i.preventDefault(),t.onStepChange(1))}return n`
    <div class="wizard-field">
      <input
        type="text"
        class="wizard-input"
        .value=${e.name}
        placeholder="Your name"
        @input=${a}
        @keydown=${s}
        autofocus
      />
    </div>
  `}function yl(e,t){const a=Intl.DateTimeFormat().resolvedOptions().timeZone;return n`
    <div class="wizard-field">
      <div class="wizard-detected">
        Detected: <strong>${a}</strong>
      </div>
      <select
        class="wizard-select"
        .value=${e.timezone||a}
        @change=${s=>{t.onAnswerChange("timezone",s.target.value)}}
      >
        ${Fa.includes(a)?u:n`<option value="${a}">${a} (detected)</option>`}
        ${Fa.map(s=>n`
            <option value="${s}" ?selected=${(e.timezone||a)===s}>
              ${s}${s===a?" (detected)":""}
            </option>
          `)}
      </select>
      ${rn()}
    </div>
  `}function $l(e,t){function a(i){t.onAnswerChange("focus",i.target.value)}function s(i){i.key==="Enter"&&(i.preventDefault(),t.onStepChange(3))}return n`
    <div class="wizard-field">
      <input
        type="text"
        class="wizard-input"
        .value=${e.focus}
        placeholder="e.g. Building a SaaS product, Running my consulting business"
        @input=${a}
        @keydown=${s}
        autofocus
      />
    </div>
  `}function wl(e,t){function a(){const l=document.querySelector(".wizard-project-input");if(!l)return;const o=l.value.trim();o&&e.projects.length<5&&(t.onAnswerChange("projects",[...e.projects,o]),l.value="",l.focus())}function s(l){const o=e.projects.filter((r,d)=>d!==l);t.onAnswerChange("projects",o)}function i(l){l.key==="Enter"&&(l.preventDefault(),l.target.value.trim()?a():e.projects.length>0&&t.onStepChange(4))}return n`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.projects.map((l,o)=>n`
            <span class="wizard-tag">
              ${l}
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
        <button class="wizard-btn wizard-btn--small" @click=${a}>Add</button>
      </div>
      ${e.projects.length===0?n`<p class="wizard-hint">Add 1-3 projects, or skip to continue</p>`:u}
    </div>
  `}function xl(e,t){return n`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${gl.map(a=>n`
            <label class="wizard-radio ${e.commStyle===a?"wizard-radio--selected":""}">
              <input
                type="radio"
                name="commStyle"
                .value=${a}
                ?checked=${e.commStyle===a}
                @change=${()=>{t.onAnswerChange("commStyle",a)}}
              />
              <span class="wizard-radio-label">${a}</span>
            </label>
          `)}
      </div>
      <div class="wizard-or-custom">
        <span class="wizard-or">or type your own:</span>
        <input
          type="text"
          class="wizard-input wizard-input--small"
          placeholder="Custom preference..."
          @input=${a=>{const s=a.target.value;s.trim()&&t.onAnswerChange("commStyle",s)}}
        />
      </div>
    </div>
  `}function kl(e,t){const a=e.hardRules.length>0?e.hardRules:[];function s(o){a.includes(o)?t.onAnswerChange("hardRules",a.filter(r=>r!==o)):t.onAnswerChange("hardRules",[...a,o])}function i(){const o=document.querySelector(".wizard-rule-input");if(!o)return;const r=o.value.trim();r&&(t.onAnswerChange("hardRules",[...a,r]),o.value="",o.focus())}function l(o){o.key==="Enter"&&(o.preventDefault(),o.target.value.trim()&&i())}return n`
    <div class="wizard-field">
      <p class="wizard-hint">Select common rules or add your own:</p>
      <div class="wizard-checkbox-list">
        ${Lt.map(o=>n`
            <label class="wizard-checkbox ${a.includes(o)?"wizard-checkbox--selected":""}">
              <input
                type="checkbox"
                ?checked=${a.includes(o)}
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
          @keydown=${l}
        />
        <button class="wizard-btn wizard-btn--small" @click=${i}>Add</button>
      </div>
      ${a.filter(o=>!Lt.includes(o)).length>0?n`
            <div class="wizard-tag-list" style="margin-top: 8px;">
              ${a.filter(o=>!Lt.includes(o)).map(o=>n`
                    <span class="wizard-tag">
                      ${o}
                      <button class="wizard-tag-remove" @click=${()=>{t.onAnswerChange("hardRules",a.filter(r=>r!==o))}}>x</button>
                    </span>
                  `)}
            </div>
          `:u}
    </div>
  `}function Al(e,t){function a(){const l=document.querySelector(".wizard-person-input");if(!l)return;const o=l.value.trim();o&&e.keyPeople.length<10&&(t.onAnswerChange("keyPeople",[...e.keyPeople,o]),l.value="",l.focus())}function s(l){t.onAnswerChange("keyPeople",e.keyPeople.filter((o,r)=>r!==l))}function i(l){l.key==="Enter"&&(l.preventDefault(),l.target.value.trim()?a():e.keyPeople.length>0&&t.onStepChange(7))}return n`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.keyPeople.map((l,o)=>n`
            <span class="wizard-tag">
              ${l}
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
        <button class="wizard-btn wizard-btn--small" @click=${a}>Add</button>
      </div>
      <p class="wizard-hint">Co-founders, family, key collaborators. You can add more later.</p>
    </div>
  `}function _l(e,t){return n`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${fl.map(a=>n`
            <label class="wizard-radio ${e.defaultModel===a.value?"wizard-radio--selected":""}">
              <input
                type="radio"
                name="defaultModel"
                .value=${a.value}
                ?checked=${e.defaultModel===a.value}
                @change=${()=>t.onAnswerChange("defaultModel",a.value)}
              />
              <span class="wizard-radio-label">${a.label}</span>
            </label>
          `)}
      </div>
      ${rn()}
    </div>
  `}function Rt(e){return e==null?"not set":typeof e=="string"?e:typeof e=="boolean"||typeof e=="number"?String(e):(Array.isArray(e),JSON.stringify(e))}function Sl(e,t){const{answers:a,preview:s,diff:i,fileSelections:l,configSelections:o,generating:r}=e,d=s?.some(p=>p.exists)??!1,v=i&&(i.changes.length>0||i.additions.length>0);return n`
    <div class="wizard-review">
      <h2 class="wizard-review-title">Ready to generate your workspace</h2>

      <div class="wizard-review-summary">
        <div class="wizard-review-section">
          <h3>Your Profile</h3>
          <div class="wizard-review-item"><span class="wizard-review-label">Name:</span> ${a.name}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Timezone:</span> ${a.timezone}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Focus:</span> ${a.focus}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Model:</span> ${a.defaultModel}</div>
          <div class="wizard-review-item"><span class="wizard-review-label">Style:</span> ${a.commStyle}</div>
        </div>

        ${a.projects.length>0?n`
              <div class="wizard-review-section">
                <h3>Projects</h3>
                ${a.projects.map(p=>n`<div class="wizard-review-item">${p}</div>`)}
              </div>
            `:u}

        ${a.keyPeople.length>0?n`
              <div class="wizard-review-section">
                <h3>Key People</h3>
                ${a.keyPeople.map(p=>n`<div class="wizard-review-item">${p}</div>`)}
              </div>
            `:u}

        ${a.hardRules.length>0?n`
              <div class="wizard-review-section">
                <h3>AI Rules</h3>
                ${a.hardRules.map(p=>n`<div class="wizard-review-item">${p}</div>`)}
              </div>
            `:u}
      </div>

      ${s&&s.length>0?n`
            <div class="wizard-review-section wizard-review-files">
              <h3>Workspace Files</h3>
              ${d?n`<p class="wizard-hint">Some files already exist. Uncheck to keep your existing version.</p>`:u}
              <div class="wizard-file-list">
                ${s.map(p=>{const g=l[p.path]??p.wouldCreate;return n`
                    <label class="wizard-file-item ${p.wouldCreate?"wizard-file--new":"wizard-file--exists"}">
                      <input
                        type="checkbox"
                        ?checked=${g}
                        @change=${h=>t.onFileToggle(p.path,h.target.checked)}
                      />
                      <span class="wizard-file-path">${p.path}</span>
                      <span class="wizard-file-status">${p.exists?g?"overwrite":"keep existing":"new"}</span>
                    </label>
                  `})}
              </div>
            </div>
          `:u}

      ${v?n`
            <div class="wizard-review-section wizard-review-config">
              <h3>Config Changes</h3>

              ${i.additions.length>0?n`
                    <div class="wizard-config-group">
                      <h4>New settings</h4>
                      ${i.additions.map(p=>{const g=o[p.path]??!0;return n`
                          <label class="wizard-config-item">
                            <input
                              type="checkbox"
                              ?checked=${g}
                              @change=${h=>t.onConfigToggle(p.path,h.target.checked)}
                            />
                            <span class="wizard-config-path">${p.path}</span>
                            <span class="wizard-config-value">${Rt(p.recommended)}</span>
                          </label>
                        `})}
                    </div>
                  `:u}

              ${i.changes.length>0?n`
                    <div class="wizard-config-group">
                      <h4>Changed settings</h4>
                      <p class="wizard-hint">These differ from your current config. Check to update.</p>
                      ${i.changes.map(p=>{const g=o[p.path]??!1;return n`
                          <label class="wizard-config-item wizard-config-item--change">
                            <input
                              type="checkbox"
                              ?checked=${g}
                              @change=${h=>t.onConfigToggle(p.path,h.target.checked)}
                            />
                            <span class="wizard-config-path">${p.path}</span>
                            <span class="wizard-config-diff">
                              <span class="wizard-config-current">${Rt(p.current)}</span>
                              <span class="wizard-config-arrow">&rarr;</span>
                              <span class="wizard-config-recommended">${Rt(p.recommended)}</span>
                            </span>
                          </label>
                        `})}
                    </div>
                  `:u}

              ${i.matching.length>0?n`<p class="wizard-hint">${i.matching.length} settings already match GodMode's recommendations.</p>`:u}
            </div>
          `:n`<p class="wizard-hint">OC config will be patched with optimal memory/agent settings.</p>`}

      <div class="wizard-nav">
        <button
          class="wizard-btn wizard-btn--back"
          @click=${()=>t.onStepChange(7)}
          ?disabled=${r}
        >Back</button>
        <button
          class="wizard-btn wizard-btn--generate ${r?"wizard-btn--loading":""}"
          @click=${()=>t.onGenerate()}
          ?disabled=${r}
        >${r?"Generating...":"Generate Workspace"}</button>
      </div>

      ${e.error?n`<div class="wizard-error">${e.error}</div>`:u}
    </div>
  `}function Cl(e,t){const a=e.result;return a?n`
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
          <span class="wizard-stat-number">${a.filesCreated}</span>
          <span class="wizard-stat-label">files created</span>
        </div>
        <div class="wizard-stat">
          <span class="wizard-stat-number">${a.filesSkipped}</span>
          <span class="wizard-stat-label">files skipped</span>
        </div>
        <div class="wizard-stat">
          <span class="wizard-stat-number">${a.configPatched?"Yes":"No"}</span>
          <span class="wizard-stat-label">config patched</span>
        </div>
      </div>
      <p class="wizard-success-path">Workspace: <code>${a.workspacePath}</code></p>
      <p class="wizard-success-hint">
        Start a new chat session and the agent will automatically read your memory files.
        The system gets smarter with every conversation.
      </p>
      <button class="wizard-btn wizard-btn--next" @click=${()=>t.onClose()}>
        Start Using GodMode
      </button>
    </div>
  `:n`${u}`}function cn(){return{name:"",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,focus:"",projects:[],commStyle:"Direct and concise -- no fluff, just answers",hardRules:[],keyPeople:[],defaultModel:"sonnet"}}function Tl(){return{step:0,answers:cn(),preview:null,diff:null,fileSelections:{},configSelections:{},generating:!1,result:null,error:null}}function El(e,t){const{step:a,answers:s}=e;if(a===9)return n`
      <div class="wizard-fullscreen">
        ${Cl(e,t)}
      </div>
    `;if(a===8)return n`
      <div class="wizard-fullscreen">
        <div class="wizard-container">
          ${Ha(a)}
          ${Sl(e,t)}
        </div>
      </div>
    `;const i=(()=>{switch(a){case 0:return s.name.trim().length>0;case 1:return!0;case 2:return!0;case 3:return!0;case 4:return s.commStyle.trim().length>0;case 5:return!0;case 6:return!0;case 7:return!0;default:return!1}})(),l=a===7,o=(()=>{switch(a){case 0:return bl(s,t);case 1:return yl(s,t);case 2:return $l(s,t);case 3:return wl(s,t);case 4:return xl(s,t);case 5:return kl(s,t);case 6:return Al(s,t);case 7:return _l(s,t);default:return n`${u}`}})();return n`
    <div class="wizard-fullscreen">
      <div class="wizard-container">
        <div class="wizard-glow"></div>
        ${Ha(a)}
        ${hl(a)}
        ${o}
        ${ml(a,t,i,l)}
      </div>
    </div>
  `}const Ho=Object.freeze(Object.defineProperty({__proto__:null,emptyWizardAnswers:cn,emptyWizardState:Tl,renderOnboardingWizard:El},Symbol.toStringTag,{value:"Module"}));function Te(e){return e===null?"none":e>=8?"high":e>=5?"medium":"low"}function Ge(e){return{high:"trust-score--high",medium:"trust-score--medium",low:"trust-score--low",none:"trust-score--none"}[e]}function Ml(e){return{improving:"Improving",declining:"Declining",stable:"Stable",new:"New"}[e]??"New"}function Ll(e){return{improving:"trust-trend--up",declining:"trust-trend--down",stable:"trust-trend--stable",new:"trust-trend--new"}[e]??"trust-trend--new"}function Rl(e){return{improving:"↑",declining:"↓",stable:"→",new:"•"}[e]??"•"}function Nl(e){const t=Date.now()-Date.parse(e),a=Math.floor(t/6e4);if(a<1)return"just now";if(a<60)return`${a}m ago`;const s=Math.floor(a/60);if(s<24)return`${s}h ago`;const i=Math.floor(s/24);return i<7?`${i}d ago`:new Date(e).toLocaleDateString()}function Dl(e){const t=e.overallScore,a=Te(t);return n`
    <div class="trust-overall">
      <div class="trust-overall-score ${Ge(a)}">
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
  `}function Pl(e,t){const s=Math.min(100,Math.max(0,(e??t)/10*100)),i=Te(e??(t>0?t:null));return n`
    <div class="trust-progress">
      <div
        class="trust-progress-fill ${Ge(i)}"
        style="width: ${s}%"
      ></div>
    </div>
  `}function Il(e,t){const s=e.trustScore!==null?e.trustScore.toFixed(1):e.avgRating>0?e.avgRating.toFixed(1):"--",i=Te(e.trustScore??(e.avgRating>0?e.avgRating:null));return e.count<10&&10-e.count,n`
    <div class="trust-card">
      <div class="trust-card-header">
        <span class="trust-card-name">${e.workflow}</span>
        ${t?n`<button
              class="trust-card-remove"
              title="Remove workflow"
              @click=${()=>t(e.workflow)}
            >&times;</button>`:u}
      </div>

      <div class="trust-card-score-row">
        <span class="trust-card-score ${Ge(i)}">${s}</span>
        <span class="trust-card-score-label">/10</span>
        <span class="trust-trend ${Ll(e.trend)}">
          ${Rl(e.trend)} ${Ml(e.trend)}
        </span>
      </div>

      ${Pl(e.trustScore,e.avgRating)}

      <div class="trust-card-meta">
        <span class="trust-card-provenance" style="font-size: 0.75rem; color: var(--text-muted, #888); display: block; margin-top: 4px;">
          ${e.count} rating${e.count!==1?"s":""}${e.trustScore!=null?"":` — ${10-e.count} more for trust score`}
        </span>
        ${e.needsFeedback?n`<span class="trust-card-needs-feedback">Needs improvement</span>`:u}
      </div>

      ${e.recentFeedback.length>0?n`
            <div class="trust-card-feedback">
              <span class="trust-card-feedback-label">Feedback applied:</span>
              ${e.recentFeedback.map(l=>n`<span class="trust-card-feedback-item">${l}</span>`)}
            </div>
          `:u}
    </div>
  `}function zl(){return[{workflow:"Code Reviews",avgRating:8.2,count:14,trustScore:8.2,needsFeedback:!1,trend:"improving",recentNotes:[],recentFeedback:[]},{workflow:"Email Drafts",avgRating:6.5,count:11,trustScore:6.5,needsFeedback:!0,trend:"stable",recentNotes:[],recentFeedback:["Be more concise","Match my tone"]},{workflow:"Research",avgRating:7.8,count:3,trustScore:null,needsFeedback:!1,trend:"new",recentNotes:[],recentFeedback:[]}]}function Ol(){const e=zl();return{workflows:e.map(t=>t.workflow),summaries:e,ratings:[],total:0,overallScore:7.6,totalRatings:28,totalUses:28}}function Bl(e){const t=Te(e.rating);return n`
    <div class="trust-rating-row">
      <span class="trust-rating-score ${Ge(t)}">${e.rating}</span>
      <span class="trust-rating-workflow">${e.workflow}</span>
      ${e.note?n`<span class="trust-rating-note">${e.note}</span>`:u}
      <span class="trust-rating-time">${Nl(e.timestamp)}</span>
    </div>
  `}function Fl(){return n`
    <div class="trust-sample-banner">
      Sample data — use skills and rate them to build your real trust profile.
    </div>
  `}function Ul(e){const t=e.connected,a=e.guardrailsData,s=e.consciousnessStatus,i=e.data?.todayRating??null,l=e.updateStatus??null,o=l?.openclawUpdateAvailable||l?.pluginUpdateAvailable;if(!t)return{level:"alert",icon:"⚠️",text:"Gateway disconnected",detail:"Reconnect to restore full functionality."};if(o){const d=[];return l.openclawUpdateAvailable&&l.openclawLatest&&d.push(`OpenClaw ${l.openclawVersion} → ${l.openclawLatest}`),l.pluginUpdateAvailable&&l.pluginLatest&&d.push(`GodMode ${l.pluginVersion} → ${l.pluginLatest}`),{level:"warn",icon:"🔄",text:"Update available",detail:d.join(", ")+". Visit Overview to update."}}if(s==="error")return{level:"warn",icon:"🧠",text:"Consciousness sync needs attention",detail:"Your system is running but the last sync encountered an error."};if(a){const d=a.gates.filter(p=>p.enabled).length,v=a.gates.length;if(d<v)return{level:"warn",icon:"🛡",text:`${v-d} security gate${v-d!==1?"s":""} disabled`,detail:"Your system is running with reduced safety coverage."}}const r=l&&!o?" Up to date.":"";return i?i.rating>=8?{level:"ok",icon:"✨",text:`Rated ${i.rating}/10 today — GodMode is running great.`,detail:`All systems secure and building trust daily.${r}`}:i.rating>=5?{level:"ok",icon:"💪",text:`Rated ${i.rating}/10 today — working to improve.`,detail:`Your feedback is being applied. All systems secure.${r}`}:{level:"warn",icon:"💬",text:`Rated ${i.rating}/10 today — your feedback matters.`,detail:`We're using your input to get better. All systems secure.${r}`}:{level:"ok",icon:"✅",text:"Your GodMode is safe, secure, and building trust daily.",detail:`All systems healthy.${r} Rate your day below to help improve.`}}function Hl(e){const{level:t,icon:a,text:s,detail:i}=Ul(e);return n`
    <div class="trust-hero trust-hero--${t}">
      <span class="trust-hero-icon">${a}</span>
      <div class="trust-hero-body">
        <div class="trust-hero-text">${s}</div>
        <div class="trust-hero-detail">${i}</div>
      </div>
    </div>
  `}function jl(e){return e<=4?"trust-daily-button--low":e<=7?"trust-daily-button--med":"trust-daily-button--high"}function ja(e){const t=[];for(let a=0;a<7;a++)t.push(e[a]??null);return n`
    <div class="trust-daily-trend">
      ${t.map(a=>{if(!a)return n`<div class="trust-daily-trend-dot trust-daily-trend-dot--empty"></div>`;const s=Math.max(4,a.rating/10*28),i=Te(a.rating);return n`
          <div
            class="trust-daily-trend-dot trust-daily-trend-dot--${i==="none"?"medium":i}"
            style="height: ${s}px"
            title="${a.date}: ${a.rating}/10"
          ></div>
        `})}
    </div>
  `}function Wl(e){const t=e.data,a=t?.todayRating??null,s=t?.recentDaily??[],i=t?.dailyStreak??0,l=t?.dailyAverage??null;if(!e.onDailyRate)return u;if(a){const o=Te(a.rating),r=a.rating<7&&!a.note;return n`
      <div class="trust-daily">
        <div class="trust-daily-header">
          <span class="trust-daily-prompt">Today's Rating</span>
          ${i>1?n`<span class="trust-daily-streak">${i} day streak</span>`:u}
        </div>
        <div class="trust-daily-result">
          <div class="trust-daily-result-score ${Ge(o)}">
            ${a.rating}<span class="trust-daily-result-max">/10</span>
          </div>
          <div class="trust-daily-result-meta">
            <span class="trust-daily-result-label">
              ${a.rating>=8?"Great day!":a.rating>=5?"Good, working to improve":"Thanks for the honesty"}
            </span>
            ${a.note?n`<span class="trust-daily-result-note">"${a.note}"</span>`:u}
            ${l!==null?n`<span class="trust-daily-result-note">7-day avg: ${l}/10</span>`:u}
          </div>
          ${s.length>1?ja(s):u}
        </div>
        ${r?n`
              <div class="trust-daily-feedback">
                <input
                  class="trust-daily-feedback-input"
                  type="text"
                  placeholder="What could be better?"
                  @keydown=${d=>{if(d.key==="Enter"){const v=d.target,p=v.value.trim();p&&e.onDailyRate&&(e.onDailyRate(a.rating,p),v.value="")}}}
                />
                <button
                  class="trust-daily-feedback-submit"
                  type="button"
                  @click=${d=>{const p=d.target.previousElementSibling,g=p?.value?.trim();g&&e.onDailyRate&&(e.onDailyRate(a.rating,g),p.value="")}}
                >Send</button>
              </div>
            `:u}
      </div>
    `}return n`
    <div class="trust-daily">
      <div class="trust-daily-header">
        <span class="trust-daily-prompt">How happy were you with GodMode today?</span>
        ${i>0?n`<span class="trust-daily-streak">${i} day streak</span>`:u}
      </div>
      <div class="trust-daily-buttons">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>n`
            <button
              class="trust-daily-button ${jl(o)}"
              type="button"
              title="${o}/10"
              @click=${()=>e.onDailyRate(o)}
            >${o}</button>
          `)}
      </div>
      ${s.length>0?n`
            <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              ${ja(s)}
              ${l!==null?n`<span style="font-size: 0.75rem; color: var(--text-muted);">7-day avg: ${l}/10</span>`:u}
            </div>
          `:u}
    </div>
  `}function Vl(e){if(!e)return n`
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
    `;const t=e.gates,a=t.filter(p=>p.enabled).length,s=t.length,i=a===s,l=Date.now()-864e5,o=e.activity.filter(p=>Date.parse(p.timestamp)>l),r=o.filter(p=>p.action==="blocked").length,d=o.filter(p=>p.action==="fired").length,v=i?"trust-health-card-badge--ok":a>0?"trust-health-card-badge--warn":"trust-health-card-badge--error";return n`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F6E1}</span>
        Security
        <span class="trust-health-card-badge ${v}">
          ${a}/${s} Active
        </span>
      </div>

      <div class="trust-health-gate-list">
        ${t.map(p=>n`
            <div class="trust-health-gate ${p.enabled?"":"trust-health-gate--disabled"}">
              <span class="trust-health-dot ${p.enabled?"trust-health-dot--ok":"trust-health-dot--idle"}"></span>
              <span class="trust-health-gate-icon">${p.icon}</span>
              <span class="trust-health-gate-name">${p.name}</span>
            </div>
          `)}
      </div>

      ${o.length>0?n`
            <div class="trust-health-activity">
              <span class="trust-health-activity-count">${o.length}</span>
              event${o.length!==1?"s":""} in last 24h
              ${r>0?n` &middot; <span class="trust-health-activity-count">${r}</span> blocked`:u}
              ${d>0?n` &middot; <span class="trust-health-activity-count">${d}</span> fired`:u}
            </div>
          `:n`
            <div class="trust-health-activity">No activity in last 24h</div>
          `}
    </div>
  `}function Gl(e){return!e||e==="idle"?"Idle":e==="loading"?"Syncing...":e==="ok"?"Synced":"Error"}function Yl(e){return!e||e==="idle"?"trust-health-dot--idle":e==="loading"?"trust-health-dot--warn":e==="ok"?"trust-health-dot--ok":"trust-health-dot--error"}function Kl(e){const t=e.connected,a=e.consciousnessStatus,s=e.sessionsCount,i=e.gatewayUptimeMs,r=(t?1:0)+(a==="ok"||a==="idle"?1:0)===2&&t;return n`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F4E1}</span>
        Sentinel
        <span class="trust-health-card-badge ${r?"trust-health-card-badge--ok":t?"trust-health-card-badge--warn":"trust-health-card-badge--error"}">${r?"Healthy":t?"Degraded":"Offline"}</span>
      </div>

      <div class="trust-health-row">
        <span class="trust-health-dot ${t?"trust-health-dot--ok":"trust-health-dot--error"}"></span>
        <span class="trust-health-label">Gateway</span>
        <span class="trust-health-value">${t?"Connected":"Disconnected"}</span>
      </div>

      <div class="trust-health-row">
        <span class="trust-health-dot ${Yl(a)}"></span>
        <span class="trust-health-label">Consciousness</span>
        <span class="trust-health-value">${Gl(a)}</span>
      </div>

      ${s!=null?n`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Sessions</span>
              <span class="trust-health-value">${s} active</span>
            </div>
          `:u}

      ${i!=null?n`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Uptime</span>
              <span class="trust-health-value">${Ya(i)}</span>
            </div>
          `:u}
    </div>
  `}function ql(e){return n`
    <div class="trust-health">
      <h3 class="trust-health-title">System Health</h3>
      <div class="trust-health-grid">
        ${Vl(e.guardrailsData)}
        ${Kl(e)}
      </div>
    </div>
  `}function jo(e){const{connected:t,loading:a,data:s,onRemoveWorkflow:i,onRefresh:l}=e;if(!t)return n`
      <section class="tab-body trust-section">
        <div class="trust-disconnected">Not connected to gateway.</div>
      </section>
    `;if(a&&!s)return n`
      <section class="tab-body trust-section">
        <div class="trust-loading">Loading trust tracker...</div>
      </section>
    `;const r=!(s?.summaries??[]).some(g=>g.count>0),d=r?Ol():s,v=d.summaries,p=r?[]:s?.ratings??[];return n`
    <section class="tab-body trust-section">
      ${Hl(e)}

      ${r?Fl():u}

      ${Wl(e)}

      ${Dl(d)}

      <div class="trust-workflows-grid">
        ${v.map(g=>Il(g,r?null:i))}
      </div>

      ${ql(e)}

      ${p.length>0?n`
            <div class="trust-history">
              <h3 class="trust-history-title">Recent Ratings</h3>
              <div class="trust-history-list">
                ${p.slice(0,20).map(Bl)}
              </div>
            </div>
          `:u}
    </section>
  `}function Jl(e){const t=Date.now()-Date.parse(e),a=Math.floor(t/6e4);if(a<1)return"just now";if(a<60)return`${a}m ago`;const s=Math.floor(a/60);if(s<24)return`${s}h ago`;const i=Math.floor(s/24);return i<7?`${i}d ago`:new Date(e).toLocaleDateString()}function Xl(e){return{fired:"guardrails-badge--fired",blocked:"guardrails-badge--blocked",cleaned:"guardrails-badge--cleaned"}[e]??""}function dn(e,t){return n`
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
  `}function Zl(e,t,a,s){const i=e.thresholds?.[t]??0;return n`
    <div class="guardrails-threshold">
      <label class="guardrails-threshold-label">${a}</label>
      <input
        class="guardrails-threshold-input"
        type="number"
        min="1"
        .value=${String(i)}
        ?disabled=${!e.enabled}
        @change=${l=>{const o=Number(l.target.value);!Number.isNaN(o)&&o>0&&s(e.id,t,o)}}
      />
    </div>
  `}function Ql(e,t,a){const s=e.thresholdLabels?Object.keys(e.thresholdLabels):[];return n`
    <div class="guardrails-card card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${e.icon}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook">${e.hook}</span>
        </div>
        ${dn(e.enabled,()=>t(e.id,!e.enabled))}
      </div>
      <div class="guardrails-card-description">${e.description}</div>
      ${s.length>0?n`
            <div class="guardrails-thresholds">
              ${s.map(i=>Zl(e,i,e.thresholdLabels[i],a))}
            </div>
          `:u}
    </div>
  `}function eo(e,t,a){const s=e.action==="redirect"?"↪":"🚫",i=e.action==="redirect"?"redirect":"block";return n`
    <div class="guardrails-card card guardrails-custom-card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${s}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook guardrails-action-tag guardrails-action-tag--${i}">${i}</span>
        </div>
        <div class="guardrails-custom-actions">
          ${dn(e.enabled,()=>t(e.id,!e.enabled))}
          <button class="guardrails-delete-btn" title="Delete rule" @click=${()=>a(e.id)}>&times;</button>
        </div>
      </div>
      <div class="guardrails-card-description">${e.message}</div>
      <div class="guardrails-custom-meta">
        <span class="guardrails-custom-tool">${e.trigger.tool}</span>
        ${e.trigger.patterns.map(l=>n`<span class="guardrails-pattern-tag">${l}</span>`)}
      </div>
    </div>
  `}function to(e){return n`
    <div class="guardrails-activity-row">
      <span class="guardrails-badge ${Xl(e.action)}">${e.action}</span>
      <span class="guardrails-activity-gate">${e.gateId}</span>
      <span class="guardrails-activity-detail">${e.detail}</span>
      <span class="guardrails-activity-time">${Jl(e.timestamp)}</span>
    </div>
  `}function Wo(e){const{connected:t,loading:a,data:s,onToggle:i,onThresholdChange:l,onCustomToggle:o,onCustomDelete:r,onToggleAddForm:d,onOpenAllyChat:v}=e;if(!t)return n`
      <section class="tab-body guardrails-section">
        <div class="guardrails-empty">Not connected to gateway.</div>
      </section>
    `;if(a&&!s)return n`
      <section class="tab-body guardrails-section">
        <div class="guardrails-loading">Loading guardrails...</div>
      </section>
    `;const p=s?.gates??[],g=s?.activity??[],h=s?.custom??[],$=p.filter(f=>f.enabled).length,b=h.filter(f=>f.enabled).length,y=[`${$}/${p.length} gates active`];return h.length>0&&y.push(`${b} custom rule${h.length===1?"":"s"}`),n`
    <section class="tab-body guardrails-section">
      <div class="guardrails-two-col">
        <div class="guardrails-left">
          <h2 class="guardrails-col-heading">Safety Gates</h2>
          <p class="guardrails-col-subtitle">${$}/${p.length} active — prevent runaway loops, bad searches, and lazy responses.</p>
          <div class="guardrails-grid">
            ${p.map(f=>Ql(f,i,l))}
          </div>
        </div>

        <div class="guardrails-right">
          <h2 class="guardrails-col-heading">Custom Rules & Activity</h2>
          <p class="guardrails-col-subtitle">Your rules${h.length>0?` (${b} active)`:""} and recent gate events.</p>

          <div class="guardrails-custom-section">
            <div class="guardrails-custom-header">
              <h3 class="guardrails-custom-title">Custom Rules</h3>
              <button class="guardrails-add-btn" @click=${()=>{v?v("Create a new guardrail rule: "):d()}}>+ Add Rule</button>
            </div>

            ${h.length>0?n`
                  <div class="guardrails-custom-grid">
                    ${h.map(f=>eo(f,o,r))}
                  </div>
                `:n`
                  <div class="guardrails-custom-empty">
                    No custom rules yet. Click "+ Add Rule" to tell your ally what to block or redirect.
                  </div>
                `}
          </div>

          <div class="guardrails-history">
            <h3 class="guardrails-history-title">Recent Activity</h3>
            ${g.length>0?n`
                  <div class="guardrails-history-list">
                    ${g.slice(0,30).map(to)}
                  </div>
                `:n`<div class="guardrails-no-activity">No gate activity recorded yet.</div>`}
          </div>
        </div>
      </div>
    </section>
  `}const ao=/(^~\/|^\/|^\.\.?\/|[\\/])/;function Wa(e){const t=e.trim();if(!t)return null;const a=t.replace(/^["']|["']$/g,"").trim();return!a||/^[a-z][a-z0-9+.-]*:\/\//i.test(a)||/[*?<>|]/.test(a)||a.includes("\0")||a.includes(`
`)||a.includes("\r")||!ao.test(a)&&!/\.[a-z0-9]{1,12}$/i.test(a)?null:a}function no(e){const t=e instanceof Element?e:e instanceof Node?e.parentElement:null;if(!t)return null;const a=t.closest("a");if(a){const i=a.getAttribute("href")??"";let l=i;if(i.includes("%"))try{l=decodeURIComponent(i)}catch{l=i}return Wa(l)}const s=t.closest("code");return!s||s.closest("pre")?null:Wa(s.textContent??"")}function so(e){const a=new DOMParser().parseFromString(`<div>${e}</div>`,"text/html").body.firstElementChild;if(!a)return"";const i=Z(a,{listDepth:0,orderedIndex:[]});return lo(i)}function Ut(e,t){if(e.nodeType===Node.TEXT_NODE)return e.textContent??"";if(e.nodeType!==Node.ELEMENT_NODE)return"";const a=e;switch(a.tagName.toLowerCase()){case"h1":return`# ${se(a,t)}

`;case"h2":return`## ${se(a,t)}

`;case"h3":return`### ${se(a,t)}

`;case"h4":return`#### ${se(a,t)}

`;case"h5":return`##### ${se(a,t)}

`;case"h6":return`###### ${se(a,t)}

`;case"p":return`${Z(a,t)}

`;case"br":return`
`;case"hr":return`---

`;case"strong":case"b":return`**${Z(a,t)}**`;case"em":case"i":return`*${Z(a,t)}*`;case"del":return`~~${Z(a,t)}~~`;case"a":{const i=a.getAttribute("href")??"",l=Z(a,t);return!i||i===l?l:`[${l}](${i})`}case"code":return a.parentElement?.tagName.toLowerCase()==="pre"?a.textContent??"":`\`${a.textContent??""}\``;case"pre":{const i=a.querySelector("code"),l=i?i.textContent??"":a.textContent??"",o=i?.className.match(/language-(\S+)/);return`\`\`\`${o?o[1]:""}
${l}
\`\`\`

`}case"blockquote":return Z(a,t).trim().split(`
`).map(o=>`> ${o}`).join(`
`)+`

`;case"ul":return Va(a,t,!1);case"ol":return Va(a,t,!0);case"li":return un(a,t);case"input":return a.getAttribute("type")==="checkbox"?a.checked?"[x]":"[ ]":"";case"table":return io(a,t);case"div":case"span":case"section":case"article":case"main":case"header":case"footer":case"nav":case"aside":case"figure":case"figcaption":case"details":case"summary":return Z(a,t);default:return Z(a,t)}}function Z(e,t){let a="";for(const s of Array.from(e.childNodes))a+=Ut(s,t);return a}function se(e,t){return Z(e,t).replace(/\n+/g," ").trim()}function Va(e,t,a){const s=Array.from(e.children).filter(o=>o.tagName.toLowerCase()==="li"),i="  ".repeat(t.listDepth);let l="";for(let o=0;o<s.length;o++){const r=s[o],d={listDepth:t.listDepth+1,orderedIndex:[...t.orderedIndex,o+1]},v=a?`${o+1}. `:"- ",p=un(r,d);l+=`${i}${v}${p}
`}return t.listDepth===0&&(l+=`
`),l}function un(e,t){let a="";for(const s of Array.from(e.childNodes)){const i=s.tagName?.toLowerCase();i==="ul"||i==="ol"?a+=`
`+Ut(s,t):a+=Ut(s,t)}return a.trim()}function io(e,t){const a=[],s=e.querySelector("thead tr"),i=e.querySelectorAll("tbody tr");if(s){const v=Array.from(s.querySelectorAll("th, td")).map(p=>se(p,t));a.push(v)}for(const v of Array.from(i)){const p=Array.from(v.querySelectorAll("td, th")).map(g=>se(g,t));a.push(p)}if(a.length===0){const v=e.querySelectorAll("tr");for(const p of Array.from(v)){const g=Array.from(p.querySelectorAll("td, th")).map(h=>se(h,t));a.push(g)}}if(a.length===0)return"";const l=Math.max(...a.map(v=>v.length)),o=[];for(let v=0;v<l;v++)o[v]=Math.max(3,...a.map(p=>(p[v]??"").length));let r="";const d=v=>`| ${o.map((g,h)=>(v[h]??"").padEnd(g)).join(" | ")} |`;r+=d(a[0])+`
`,r+=`| ${o.map(v=>"-".repeat(v)).join(" | ")} |
`;for(let v=1;v<a.length;v++)r+=d(a[v])+`
`;return r+`
`}function lo(e){let t=e;return t=t.replace(/\u00a0/g," "),t=t.replace(/\n{3,}/g,`

`),t=t.trim(),t&&!t.endsWith(`
`)&&(t+=`
`),t}function oo(e){return e.includes(`
`)&&e.indexOf(`
`)<e.length-1?e:e.replace(/\\n/g,`
`)}function ro(e){const t=new Date(e),s=new Date().getTime()-t.getTime(),i=Math.floor(s/(1e3*60));if(i<1)return"Just now";if(i<60)return`${i}m ago`;const l=Math.floor(i/60);return l<24?`${l}h ago`:t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}function co(e){const t="VAULT",a=encodeURIComponent(`01-Daily/${e}`);return`obsidian://open?vault=${t}&file=${a}`}let Ue=null,Ce=null;function Ga(e,t,a=1500){Ue&&clearTimeout(Ue),Ue=setTimeout(()=>{e!==Ce&&(Ce=e,t(e))},a)}function uo(e,t){Ue&&clearTimeout(Ue),e!==Ce&&(Ce=e,t(e))}function Nt(e){for(const t of e.querySelectorAll('input[type="checkbox"]')){const a=t;a.checked?a.setAttribute("checked",""):a.removeAttribute("checked")}return so(e.innerHTML)}function Vo(e){const{data:t,loading:a,error:s,onRefresh:i,onGenerate:l,onOpenInObsidian:o,onSaveBrief:r,onToggleCheckbox:d,onOpenFile:v}=e;if(a)return n`
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
    `;if(s)return n`
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
            ${i?n`<button class="retry-button" @click=${i}>Retry</button>`:u}
          </div>
        </div>
      </div>
    `;if(!t||!t.content)return n`
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
            <span>No brief generated yet</span>
            <span class="empty-hint">Your daily brief pulls together your calendar, tasks, goals, and energy data into a single scannable page. Click the button below to create your first one.</span>
            ${l?n`<button class="brief-generate-btn" @click=${l}>Generate Brief Now</button>`:i?n`<button class="brief-generate-btn" @click=${i}>Generate Brief Now</button>`:u}
            <span class="empty-hint" style="margin-top: 8px; font-size: 12px;">Briefs auto-generate at 5:00 AM when configured.</span>
          </div>
        </div>
      </div>
    `;Ce===null&&(Ce=t.content);const p=f=>{const w=f.currentTarget;if(r){const C=Nt(w);Ga(C,r)}},g=f=>{if((f.ctrlKey||f.metaKey)&&f.key==="s"){f.preventDefault();const w=f.currentTarget;if(r){const C=Nt(w);uo(C,r)}}if((f.ctrlKey||f.metaKey)&&f.key==="l"){f.preventDefault();const w=window.getSelection();if(!w||w.rangeCount===0)return;const C=w.focusNode,T=C instanceof HTMLElement?C.closest("li"):C?.parentElement?.closest("li");if(T){const k=T.querySelector('input[type="checkbox"]');if(k)k.nextSibling?.nodeType===Node.TEXT_NODE&&k.nextSibling.textContent===" "&&k.nextSibling.remove(),k.remove();else{const M=document.createElement("input");M.type="checkbox",T.insertBefore(document.createTextNode(" "),T.firstChild),T.insertBefore(M,T.firstChild)}const _=f.currentTarget;if(r){const M=Nt(_);Ga(M,r)}}}if(f.key==="Enter"&&!f.shiftKey){const w=window.getSelection();if(!w||w.rangeCount===0)return;const C=w.focusNode,T=C instanceof HTMLElement?C.closest("li"):C?.parentElement?.closest("li");T&&T.querySelector('input[type="checkbox"]')&&setTimeout(()=>{const k=window.getSelection();if(!k||k.rangeCount===0)return;const _=k.focusNode,M=_ instanceof HTMLElement?_.closest("li"):_?.parentElement?.closest("li");if(M&&M!==T&&!M.querySelector('input[type="checkbox"]')){const S=document.createElement("input");S.type="checkbox",M.insertBefore(S,M.firstChild),M.insertBefore(document.createTextNode(" "),S.nextSibling);const pe=document.createRange();pe.setStartAfter(S.nextSibling),pe.collapse(!0),k.removeAllRanges(),k.addRange(pe)}},0)}},h=f=>{const w=f.target;if(w.tagName==="INPUT"&&w.getAttribute("type")==="checkbox"){const k=w,_=f.currentTarget;if(d&&_){const S=Array.from(_.querySelectorAll('input[type="checkbox"]')).indexOf(k);S>=0&&d(S,k.checked)}return}const C=no(f.target);if(C&&v){f.preventDefault(),v(C);return}const T=w.closest?.("a")??w.parentElement?.closest("a");if(T){const k=T.getAttribute("href")??"";/^https?:\/\//i.test(k)&&(f.preventDefault(),window.open(k,"_blank","noopener,noreferrer"))}},$=ss(oo(t.content)),b=t.summary.readiness!=null?n`<span class="brief-readiness" title="Readiness Score${t.summary.readinessMode?` — ${t.summary.readinessMode}`:""}">
        <span class="readiness-score">${t.summary.readiness}</span>
        <span class="readiness-label">Readiness</span>
      </span>`:u,y=t.summary.tasks.total>0?n`<span class="brief-task-progress" title="${t.summary.tasks.completed}/${t.summary.tasks.total} tasks done">
        ${t.summary.tasks.completed}/${t.summary.tasks.total}
      </span>`:u;return n`
    <div class="my-day-card brief-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83D\uDCCA</span>
          <span>DAILY BRIEF</span>
          ${b}
          ${y}
        </div>
        <div class="brief-header-actions">
          <span class="brief-updated">${ro(t.updatedAt)}</span>
          ${o?n`
                <a
                  href="${co(t.date)}"
                  class="brief-obsidian-link"
                  title="Open in Obsidian"
                  @click=${f=>{f.preventDefault(),o()}}
                >
                  <span class="obsidian-icon">\uD83D\uDCD3</span>
                </a>
              `:u}
          ${i?n`
                <button class="brief-refresh-btn" @click=${i} title="Refresh">
                  \uD83D\uDD04
                </button>
              `:u}
        </div>
      </div>

      <div class="my-day-card-content">
        <div class="brief-content brief-content--live">
          <div
            class="brief-rendered brief-editable"
            contenteditable="true"
            spellcheck="false"
            @input=${p}
            @keydown=${g}
            @click=${h}
          >${_n($)}</div>
        </div>
      </div>
    </div>
  `}export{jo as A,Ro as B,Do as C,zo as D,bo as E,Po as F,Vo as G,Mo as H,Ho as I,mo as P,ho as T,Eo as a,ko as b,fo as c,Ao as d,To as e,wo as f,xo as g,Pt as h,us as i,So as j,El as k,Ot as l,Lo as m,qa as n,Io as o,En as p,Bo as q,yo as r,Co as s,_o as t,$o as u,No as v,Fo as w,Uo as x,Oo as y,Wo as z};
