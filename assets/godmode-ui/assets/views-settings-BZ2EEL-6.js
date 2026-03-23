import{A as d,b as a,o as $a}from"./lit-core-CTInmNPB.js";import{t as wa,f as L,a as Be,b as jn,c as Et,d as Fe}from"./ctrl-settings-CprBjyAl.js";import{g as Pt}from"./markdown-i_gIkIP3.js";function xa(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function ka(e){const{state:t,callbacks:n,accountId:s}=e,i=xa(t),l=(r,u,v={})=>{const{type:p="text",placeholder:g,maxLength:h,help:$}=v,b=t.values[r]??"",y=t.fieldErrors[r],f=`nostr-profile-${r}`;return p==="textarea"?a`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${f}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${u}
          </label>
          <textarea
            id="${f}"
            .value=${b}
            placeholder=${g??""}
            maxlength=${h??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${w=>{const S=w.target;n.onFieldChange(r,S.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${$?a`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${$}</div>`:d}
          ${y?a`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${y}</div>`:d}
        </div>
      `:a`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${f}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${u}
        </label>
        <input
          id="${f}"
          type=${p}
          .value=${b}
          placeholder=${g??""}
          maxlength=${h??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${w=>{const S=w.target;n.onFieldChange(r,S.value)}}
          ?disabled=${t.saving}
        />
        ${$?a`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${$}</div>`:d}
        ${y?a`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${y}</div>`:d}
      </div>
    `},o=()=>{const r=t.values.picture;return r?a`
      <div style="margin-bottom: 12px;">
        <img
          src=${r}
          alt="Profile picture preview"
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${u=>{const v=u.target;v.style.display="none"}}
          @load=${u=>{const v=u.target;v.style.display="block"}}
        />
      </div>
    `:d};return a`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${s}</div>
      </div>

      ${t.error?a`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:d}

      ${t.success?a`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:d}

      ${o()}

      ${l("name","Username",{placeholder:"satoshi",maxLength:256,help:"Short username (e.g., satoshi)"})}

      ${l("displayName","Display Name",{placeholder:"Satoshi Nakamoto",maxLength:256,help:"Your full display name"})}

      ${l("about","Bio",{type:"textarea",placeholder:"Tell people about yourself...",maxLength:2e3,help:"A brief bio or description"})}

      ${l("picture","Avatar URL",{type:"url",placeholder:"https://example.com/avatar.jpg",help:"HTTPS URL to your profile picture"})}

      ${t.showAdvanced?a`
            <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
              <div style="font-weight: 500; margin-bottom: 12px; color: var(--text-muted);">Advanced</div>

              ${l("banner","Banner URL",{type:"url",placeholder:"https://example.com/banner.jpg",help:"HTTPS URL to a banner image"})}

              ${l("website","Website",{type:"url",placeholder:"https://example.com",help:"Your personal website"})}

              ${l("nip05","NIP-05 Identifier",{placeholder:"you@example.com",help:"Verifiable identifier (e.g., you@domain.com)"})}

              ${l("lud16","Lightning Address",{placeholder:"you@getalby.com",help:"Lightning address for tips (LUD-16)"})}
            </div>
          `:d}

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

      ${i?a`
              <div style="font-size: 12px; color: var(--warning-color); margin-top: 8px">
                You have unsaved changes
              </div>
            `:d}
    </div>
  `}function oo(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}const ro=[{label:"",tabs:["chat","today","team","workspaces","second-brain","dashboards"]},{label:"Settings",tabs:["config","connections","skills","agents","trust","guardrails"]}],co=[{label:"System",tabs:["channels","sessions","cron","debug"]}],uo=new Set([]),Wn={onboarding:"/onboarding",workspaces:"/workspaces",today:"/today",team:"/team",connections:"/connections",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",agents:"/agents",nodes:"/nodes",chat:"/chat",trust:"/trust",guardrails:"/guardrails",config:"/config",debug:"/debug",logs:"/logs","second-brain":"/second-brain",dashboards:"/dashboards"},re=new Map(Object.entries(Wn).map(([e,t])=>[t,e]));re.set("/my-day","today");re.set("/work","workspaces");re.set("/setup","onboarding");re.set("/overview","dashboards");re.set("/mission-control","dashboards");function Vn(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function Mt(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function Aa(e,t=""){const n=Vn(t),s=Wn[e]??`/${e}`;return n?`${n}${s}`:s}function po(e,t=""){const n=Vn(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let i=Mt(s).toLowerCase();return i.endsWith("/index.html")&&(i="/"),i==="/"?"chat":re.get(i)??null}function vo(e){let t=Mt(e);if(t.endsWith("/index.html")&&(t=Mt(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const i=`/${n.slice(s).join("/")}`.toLowerCase();if(re.has(i)){const l=n.slice(0,s);return!l.length||l.some(r=>re.has(`/${r.toLowerCase()}`))?"":`/${l.join("/")}`}}return`/${n.join("/")}`}function go(e){switch(e){case"onboarding":return"Connect Your World";case"chat":return"Chat";case"today":return"Today";case"team":return"Team";case"workspaces":return"Workspaces";case"connections":return"Connections";case"channels":return"Integrations";case"instances":return"Devices";case"sessions":return"Sessions";case"cron":return"Schedules";case"skills":return"Skills";case"agents":return"Agents";case"nodes":return"Network";case"trust":return"Trust";case"guardrails":return"Safety";case"second-brain":return"Second Brain";case"dashboards":return"Dashboards";case"config":return"Settings";case"debug":return"Developer";case"logs":return"Logs";default:return"Control"}}function fo(e){switch(e){case"onboarding":return"🧭";case"chat":return"💬";case"today":return"☀️";case"team":return"🤖";case"workspaces":return"📂";case"connections":return"🔌";case"channels":return"🔗";case"instances":return"📡";case"sessions":return"📄";case"cron":return"⏰";case"skills":return"🧩";case"agents":return"🤖";case"nodes":return"🖥️";case"trust":return"🛡️";case"guardrails":return"🚧";case"second-brain":return"🧠";case"dashboards":return"📊";case"config":return"⚙️";case"debug":return"🐛";case"logs":return"📜";default:return"📁"}}function ho(e){switch(e){case"onboarding":return"Set up the integrations that power your daily brief and agent features. Everything is optional.";case"chat":return"Your command center. Ask anything, customize any view.";case"today":return"Calendar, brief, tasks, and schedule for the day.";case"workspaces":return"Projects, clients, and personal operating context.";case"connections":return"Your integrations and third-party connections.";case"channels":return"Connected apps — iMessage, Slack, email, calendar, and more.";case"instances":return"Your connected devices and where GodMode is running.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Recurring tasks — daily briefs, overnight agents, and timed automations.";case"skills":return"Manage your skills, discover new ones from ClawHub, and personalize them for your workflow.";case"agents":return"Your agent roster — sub-agents that handle queue tasks, grouped by category.";case"nodes":return"Devices in your GodMode network and what they can do.";case"trust":return"Scores build automatically as you use and rate skills.";case"guardrails":return"Boundaries that keep agents focused, honest, and within scope.";case"second-brain":return"Your Second Brain — identity, knowledge, and live AI context. Stores what your ally needs to act on your behalf.";case"dashboards":return"Custom data views built by your AI ally — remix anything.";case"team":return"Your AI agent team — orchestrated by Paperclip.";case"config":return"Core settings — model, plugins, and API configuration.";case"debug":return"Gateway internals, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}const{entries:Gn,setPrototypeOf:un,isFrozen:_a,getPrototypeOf:Sa,getOwnPropertyDescriptor:Ca}=Object;let{freeze:H,seal:G,create:Lt}=Object,{apply:Rt,construct:Nt}=typeof Reflect<"u"&&Reflect;H||(H=function(t){return t});G||(G=function(t){return t});Rt||(Rt=function(t,n){for(var s=arguments.length,i=new Array(s>2?s-2:0),l=2;l<s;l++)i[l-2]=arguments[l];return t.apply(n,i)});Nt||(Nt=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return new t(...s)});const Je=j(Array.prototype.forEach),Ta=j(Array.prototype.lastIndexOf),pn=j(Array.prototype.pop),Me=j(Array.prototype.push),Ea=j(Array.prototype.splice),Ze=j(String.prototype.toLowerCase),bt=j(String.prototype.toString),yt=j(String.prototype.match),Le=j(String.prototype.replace),Ma=j(String.prototype.indexOf),La=j(String.prototype.trim),Y=j(Object.prototype.hasOwnProperty),U=j(RegExp.prototype.test),Re=Ra(TypeError);function j(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return Rt(e,t,s)}}function Ra(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return Nt(e,n)}}function E(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ze;un&&un(e,null);let s=t.length;for(;s--;){let i=t[s];if(typeof i=="string"){const l=n(i);l!==i&&(_a(t)||(t[s]=l),i=l)}e[i]=!0}return e}function Na(e){for(let t=0;t<e.length;t++)Y(e,t)||(e[t]=null);return e}function J(e){const t=Lt(null);for(const[n,s]of Gn(e))Y(e,n)&&(Array.isArray(s)?t[n]=Na(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=J(s):t[n]=s);return t}function Ne(e,t){for(;e!==null;){const s=Ca(e,t);if(s){if(s.get)return j(s.get);if(typeof s.value=="function")return j(s.value)}e=Sa(e)}function n(){return null}return n}const vn=H(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),$t=H(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),wt=H(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Da=H(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),xt=H(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),za=H(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),gn=H(["#text"]),fn=H(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),kt=H(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),hn=H(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Xe=H(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Ia=G(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Pa=G(/<%[\w\W]*|[\w\W]*%>/gm),Oa=G(/\$\{[\w\W]*/gm),Ba=G(/^data-[\-\w.\u00B7-\uFFFF]+$/),Fa=G(/^aria-[\-\w]+$/),Yn=G(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ua=G(/^(?:\w+script|data):/i),Ha=G(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Kn=G(/^html$/i),ja=G(/^[a-z][.\w]*(-[.\w]+)+$/i);var mn=Object.freeze({__proto__:null,ARIA_ATTR:Fa,ATTR_WHITESPACE:Ha,CUSTOM_ELEMENT:ja,DATA_ATTR:Ba,DOCTYPE_NAME:Kn,ERB_EXPR:Pa,IS_ALLOWED_URI:Yn,IS_SCRIPT_OR_DATA:Ua,MUSTACHE_EXPR:Ia,TMPLIT_EXPR:Oa});const De={element:1,text:3,progressingInstruction:7,comment:8,document:9},Wa=function(){return typeof window>"u"?null:window},Va=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(s=n.getAttribute(i));const l="dompurify"+(s?"#"+s:"");try{return t.createPolicy(l,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+l+" could not be created."),null}},bn=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function qn(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Wa();const t=A=>qn(A);if(t.version="3.3.1",t.removed=[],!e||!e.document||e.document.nodeType!==De.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,i=s.currentScript,{DocumentFragment:l,HTMLTemplateElement:o,Node:r,Element:u,NodeFilter:v,NamedNodeMap:p=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:g,DOMParser:h,trustedTypes:$}=e,b=u.prototype,y=Ne(b,"cloneNode"),f=Ne(b,"remove"),w=Ne(b,"nextSibling"),S=Ne(b,"childNodes"),T=Ne(b,"parentNode");if(typeof o=="function"){const A=n.createElement("template");A.content&&A.content.ownerDocument&&(n=A.content.ownerDocument)}let k,_="";const{implementation:M,createNodeIterator:C,createDocumentFragment:ce,getElementsByTagName:nt}=n,{importNode:oa}=s;let F=bn();t.isSupported=typeof Gn=="function"&&typeof T=="function"&&M&&M.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:at,ERB_EXPR:st,TMPLIT_EXPR:it,DATA_ATTR:ra,ARIA_ATTR:ca,IS_SCRIPT_OR_DATA:da,ATTR_WHITESPACE:Ft,CUSTOM_ELEMENT:ua}=mn;let{IS_ALLOWED_URI:Ut}=mn,I=null;const Ht=E({},[...vn,...$t,...wt,...xt,...gn]);let P=null;const jt=E({},[...fn,...kt,...hn,...Xe]);let N=Object.seal(Lt(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Ce=null,lt=null;const fe=Object.seal(Lt(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Wt=!0,ot=!0,Vt=!1,Gt=!0,he=!1,je=!0,de=!1,rt=!1,ct=!1,me=!1,We=!1,Ve=!1,Yt=!0,Kt=!1;const pa="user-content-";let dt=!0,Te=!1,be={},K=null;const ut=E({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let qt=null;const Jt=E({},["audio","video","img","source","image","track"]);let pt=null;const Xt=E({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Ge="http://www.w3.org/1998/Math/MathML",Ye="http://www.w3.org/2000/svg",Q="http://www.w3.org/1999/xhtml";let ye=Q,vt=!1,gt=null;const va=E({},[Ge,Ye,Q],bt);let Ke=E({},["mi","mo","mn","ms","mtext"]),qe=E({},["annotation-xml"]);const ga=E({},["title","style","font","a","script"]);let Ee=null;const fa=["application/xhtml+xml","text/html"],ha="text/html";let z=null,$e=null;const ma=n.createElement("form"),Zt=function(c){return c instanceof RegExp||c instanceof Function},ft=function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!($e&&$e===c)){if((!c||typeof c!="object")&&(c={}),c=J(c),Ee=fa.indexOf(c.PARSER_MEDIA_TYPE)===-1?ha:c.PARSER_MEDIA_TYPE,z=Ee==="application/xhtml+xml"?bt:Ze,I=Y(c,"ALLOWED_TAGS")?E({},c.ALLOWED_TAGS,z):Ht,P=Y(c,"ALLOWED_ATTR")?E({},c.ALLOWED_ATTR,z):jt,gt=Y(c,"ALLOWED_NAMESPACES")?E({},c.ALLOWED_NAMESPACES,bt):va,pt=Y(c,"ADD_URI_SAFE_ATTR")?E(J(Xt),c.ADD_URI_SAFE_ATTR,z):Xt,qt=Y(c,"ADD_DATA_URI_TAGS")?E(J(Jt),c.ADD_DATA_URI_TAGS,z):Jt,K=Y(c,"FORBID_CONTENTS")?E({},c.FORBID_CONTENTS,z):ut,Ce=Y(c,"FORBID_TAGS")?E({},c.FORBID_TAGS,z):J({}),lt=Y(c,"FORBID_ATTR")?E({},c.FORBID_ATTR,z):J({}),be=Y(c,"USE_PROFILES")?c.USE_PROFILES:!1,Wt=c.ALLOW_ARIA_ATTR!==!1,ot=c.ALLOW_DATA_ATTR!==!1,Vt=c.ALLOW_UNKNOWN_PROTOCOLS||!1,Gt=c.ALLOW_SELF_CLOSE_IN_ATTR!==!1,he=c.SAFE_FOR_TEMPLATES||!1,je=c.SAFE_FOR_XML!==!1,de=c.WHOLE_DOCUMENT||!1,me=c.RETURN_DOM||!1,We=c.RETURN_DOM_FRAGMENT||!1,Ve=c.RETURN_TRUSTED_TYPE||!1,ct=c.FORCE_BODY||!1,Yt=c.SANITIZE_DOM!==!1,Kt=c.SANITIZE_NAMED_PROPS||!1,dt=c.KEEP_CONTENT!==!1,Te=c.IN_PLACE||!1,Ut=c.ALLOWED_URI_REGEXP||Yn,ye=c.NAMESPACE||Q,Ke=c.MATHML_TEXT_INTEGRATION_POINTS||Ke,qe=c.HTML_INTEGRATION_POINTS||qe,N=c.CUSTOM_ELEMENT_HANDLING||{},c.CUSTOM_ELEMENT_HANDLING&&Zt(c.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(N.tagNameCheck=c.CUSTOM_ELEMENT_HANDLING.tagNameCheck),c.CUSTOM_ELEMENT_HANDLING&&Zt(c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(N.attributeNameCheck=c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),c.CUSTOM_ELEMENT_HANDLING&&typeof c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(N.allowCustomizedBuiltInElements=c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),he&&(ot=!1),We&&(me=!0),be&&(I=E({},gn),P=[],be.html===!0&&(E(I,vn),E(P,fn)),be.svg===!0&&(E(I,$t),E(P,kt),E(P,Xe)),be.svgFilters===!0&&(E(I,wt),E(P,kt),E(P,Xe)),be.mathMl===!0&&(E(I,xt),E(P,hn),E(P,Xe))),c.ADD_TAGS&&(typeof c.ADD_TAGS=="function"?fe.tagCheck=c.ADD_TAGS:(I===Ht&&(I=J(I)),E(I,c.ADD_TAGS,z))),c.ADD_ATTR&&(typeof c.ADD_ATTR=="function"?fe.attributeCheck=c.ADD_ATTR:(P===jt&&(P=J(P)),E(P,c.ADD_ATTR,z))),c.ADD_URI_SAFE_ATTR&&E(pt,c.ADD_URI_SAFE_ATTR,z),c.FORBID_CONTENTS&&(K===ut&&(K=J(K)),E(K,c.FORBID_CONTENTS,z)),c.ADD_FORBID_CONTENTS&&(K===ut&&(K=J(K)),E(K,c.ADD_FORBID_CONTENTS,z)),dt&&(I["#text"]=!0),de&&E(I,["html","head","body"]),I.table&&(E(I,["tbody"]),delete Ce.tbody),c.TRUSTED_TYPES_POLICY){if(typeof c.TRUSTED_TYPES_POLICY.createHTML!="function")throw Re('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof c.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw Re('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');k=c.TRUSTED_TYPES_POLICY,_=k.createHTML("")}else k===void 0&&(k=Va($,i)),k!==null&&typeof _=="string"&&(_=k.createHTML(""));H&&H(c),$e=c}},Qt=E({},[...$t,...wt,...Da]),en=E({},[...xt,...za]),ba=function(c){let m=T(c);(!m||!m.tagName)&&(m={namespaceURI:ye,tagName:"template"});const x=Ze(c.tagName),R=Ze(m.tagName);return gt[c.namespaceURI]?c.namespaceURI===Ye?m.namespaceURI===Q?x==="svg":m.namespaceURI===Ge?x==="svg"&&(R==="annotation-xml"||Ke[R]):!!Qt[x]:c.namespaceURI===Ge?m.namespaceURI===Q?x==="math":m.namespaceURI===Ye?x==="math"&&qe[R]:!!en[x]:c.namespaceURI===Q?m.namespaceURI===Ye&&!qe[R]||m.namespaceURI===Ge&&!Ke[R]?!1:!en[x]&&(ga[x]||!Qt[x]):!!(Ee==="application/xhtml+xml"&&gt[c.namespaceURI]):!1},q=function(c){Me(t.removed,{element:c});try{T(c).removeChild(c)}catch{f(c)}},ue=function(c,m){try{Me(t.removed,{attribute:m.getAttributeNode(c),from:m})}catch{Me(t.removed,{attribute:null,from:m})}if(m.removeAttribute(c),c==="is")if(me||We)try{q(m)}catch{}else try{m.setAttribute(c,"")}catch{}},tn=function(c){let m=null,x=null;if(ct)c="<remove></remove>"+c;else{const D=yt(c,/^[\r\n\t ]+/);x=D&&D[0]}Ee==="application/xhtml+xml"&&ye===Q&&(c='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+c+"</body></html>");const R=k?k.createHTML(c):c;if(ye===Q)try{m=new h().parseFromString(R,Ee)}catch{}if(!m||!m.documentElement){m=M.createDocument(ye,"template",null);try{m.documentElement.innerHTML=vt?_:R}catch{}}const B=m.body||m.documentElement;return c&&x&&B.insertBefore(n.createTextNode(x),B.childNodes[0]||null),ye===Q?nt.call(m,de?"html":"body")[0]:de?m.documentElement:B},nn=function(c){return C.call(c.ownerDocument||c,c,v.SHOW_ELEMENT|v.SHOW_COMMENT|v.SHOW_TEXT|v.SHOW_PROCESSING_INSTRUCTION|v.SHOW_CDATA_SECTION,null)},ht=function(c){return c instanceof g&&(typeof c.nodeName!="string"||typeof c.textContent!="string"||typeof c.removeChild!="function"||!(c.attributes instanceof p)||typeof c.removeAttribute!="function"||typeof c.setAttribute!="function"||typeof c.namespaceURI!="string"||typeof c.insertBefore!="function"||typeof c.hasChildNodes!="function")},an=function(c){return typeof r=="function"&&c instanceof r};function ee(A,c,m){Je(A,x=>{x.call(t,c,m,$e)})}const sn=function(c){let m=null;if(ee(F.beforeSanitizeElements,c,null),ht(c))return q(c),!0;const x=z(c.nodeName);if(ee(F.uponSanitizeElement,c,{tagName:x,allowedTags:I}),je&&c.hasChildNodes()&&!an(c.firstElementChild)&&U(/<[/\w!]/g,c.innerHTML)&&U(/<[/\w!]/g,c.textContent)||c.nodeType===De.progressingInstruction||je&&c.nodeType===De.comment&&U(/<[/\w]/g,c.data))return q(c),!0;if(!(fe.tagCheck instanceof Function&&fe.tagCheck(x))&&(!I[x]||Ce[x])){if(!Ce[x]&&on(x)&&(N.tagNameCheck instanceof RegExp&&U(N.tagNameCheck,x)||N.tagNameCheck instanceof Function&&N.tagNameCheck(x)))return!1;if(dt&&!K[x]){const R=T(c)||c.parentNode,B=S(c)||c.childNodes;if(B&&R){const D=B.length;for(let W=D-1;W>=0;--W){const te=y(B[W],!0);te.__removalCount=(c.__removalCount||0)+1,R.insertBefore(te,w(c))}}}return q(c),!0}return c instanceof u&&!ba(c)||(x==="noscript"||x==="noembed"||x==="noframes")&&U(/<\/no(script|embed|frames)/i,c.innerHTML)?(q(c),!0):(he&&c.nodeType===De.text&&(m=c.textContent,Je([at,st,it],R=>{m=Le(m,R," ")}),c.textContent!==m&&(Me(t.removed,{element:c.cloneNode()}),c.textContent=m)),ee(F.afterSanitizeElements,c,null),!1)},ln=function(c,m,x){if(Yt&&(m==="id"||m==="name")&&(x in n||x in ma))return!1;if(!(ot&&!lt[m]&&U(ra,m))){if(!(Wt&&U(ca,m))){if(!(fe.attributeCheck instanceof Function&&fe.attributeCheck(m,c))){if(!P[m]||lt[m]){if(!(on(c)&&(N.tagNameCheck instanceof RegExp&&U(N.tagNameCheck,c)||N.tagNameCheck instanceof Function&&N.tagNameCheck(c))&&(N.attributeNameCheck instanceof RegExp&&U(N.attributeNameCheck,m)||N.attributeNameCheck instanceof Function&&N.attributeNameCheck(m,c))||m==="is"&&N.allowCustomizedBuiltInElements&&(N.tagNameCheck instanceof RegExp&&U(N.tagNameCheck,x)||N.tagNameCheck instanceof Function&&N.tagNameCheck(x))))return!1}else if(!pt[m]){if(!U(Ut,Le(x,Ft,""))){if(!((m==="src"||m==="xlink:href"||m==="href")&&c!=="script"&&Ma(x,"data:")===0&&qt[c])){if(!(Vt&&!U(da,Le(x,Ft,"")))){if(x)return!1}}}}}}}return!0},on=function(c){return c!=="annotation-xml"&&yt(c,ua)},rn=function(c){ee(F.beforeSanitizeAttributes,c,null);const{attributes:m}=c;if(!m||ht(c))return;const x={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:P,forceKeepAttr:void 0};let R=m.length;for(;R--;){const B=m[R],{name:D,namespaceURI:W,value:te}=B,we=z(D),mt=te;let O=D==="value"?mt:La(mt);if(x.attrName=we,x.attrValue=O,x.keepAttr=!0,x.forceKeepAttr=void 0,ee(F.uponSanitizeAttribute,c,x),O=x.attrValue,Kt&&(we==="id"||we==="name")&&(ue(D,c),O=pa+O),je&&U(/((--!?|])>)|<\/(style|title|textarea)/i,O)){ue(D,c);continue}if(we==="attributename"&&yt(O,"href")){ue(D,c);continue}if(x.forceKeepAttr)continue;if(!x.keepAttr){ue(D,c);continue}if(!Gt&&U(/\/>/i,O)){ue(D,c);continue}he&&Je([at,st,it],dn=>{O=Le(O,dn," ")});const cn=z(c.nodeName);if(!ln(cn,we,O)){ue(D,c);continue}if(k&&typeof $=="object"&&typeof $.getAttributeType=="function"&&!W)switch($.getAttributeType(cn,we)){case"TrustedHTML":{O=k.createHTML(O);break}case"TrustedScriptURL":{O=k.createScriptURL(O);break}}if(O!==mt)try{W?c.setAttributeNS(W,D,O):c.setAttribute(D,O),ht(c)?q(c):pn(t.removed)}catch{ue(D,c)}}ee(F.afterSanitizeAttributes,c,null)},ya=function A(c){let m=null;const x=nn(c);for(ee(F.beforeSanitizeShadowDOM,c,null);m=x.nextNode();)ee(F.uponSanitizeShadowNode,m,null),sn(m),rn(m),m.content instanceof l&&A(m.content);ee(F.afterSanitizeShadowDOM,c,null)};return t.sanitize=function(A){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},m=null,x=null,R=null,B=null;if(vt=!A,vt&&(A="<!-->"),typeof A!="string"&&!an(A))if(typeof A.toString=="function"){if(A=A.toString(),typeof A!="string")throw Re("dirty is not a string, aborting")}else throw Re("toString is not a function");if(!t.isSupported)return A;if(rt||ft(c),t.removed=[],typeof A=="string"&&(Te=!1),Te){if(A.nodeName){const te=z(A.nodeName);if(!I[te]||Ce[te])throw Re("root node is forbidden and cannot be sanitized in-place")}}else if(A instanceof r)m=tn("<!---->"),x=m.ownerDocument.importNode(A,!0),x.nodeType===De.element&&x.nodeName==="BODY"||x.nodeName==="HTML"?m=x:m.appendChild(x);else{if(!me&&!he&&!de&&A.indexOf("<")===-1)return k&&Ve?k.createHTML(A):A;if(m=tn(A),!m)return me?null:Ve?_:""}m&&ct&&q(m.firstChild);const D=nn(Te?A:m);for(;R=D.nextNode();)sn(R),rn(R),R.content instanceof l&&ya(R.content);if(Te)return A;if(me){if(We)for(B=ce.call(m.ownerDocument);m.firstChild;)B.appendChild(m.firstChild);else B=m;return(P.shadowroot||P.shadowrootmode)&&(B=oa.call(s,B,!0)),B}let W=de?m.outerHTML:m.innerHTML;return de&&I["!doctype"]&&m.ownerDocument&&m.ownerDocument.doctype&&m.ownerDocument.doctype.name&&U(Kn,m.ownerDocument.doctype.name)&&(W="<!DOCTYPE "+m.ownerDocument.doctype.name+`>
`+W),he&&Je([at,st,it],te=>{W=Le(W,te," ")}),k&&Ve?k.createHTML(W):W},t.setConfig=function(){let A=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};ft(A),rt=!0},t.clearConfig=function(){$e=null,rt=!1},t.isValidAttribute=function(A,c,m){$e||ft({});const x=z(A),R=z(c);return ln(x,R,m)},t.addHook=function(A,c){typeof c=="function"&&Me(F[A],c)},t.removeHook=function(A,c){if(c!==void 0){const m=Ta(F[A],c);return m===-1?void 0:Ea(F[A],m,1)[0]}return pn(F[A])},t.removeHooks=function(A){F[A]=[]},t.removeAllHooks=function(){F=bn()},t}var Ae=qn();Pt.setOptions({gfm:!0,breaks:!0,mangle:!1});const Ga=/\.(html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log|mp4|mov|mkv|avi|webm|mp3|wav|aac|ogg|flac|zip|tar|gz|bz2|dmg|iso|doc|docx|xls|xlsx|ppt|pptx)$/i,Ya=new RegExp("(?<![(\\[`]|:\\/\\/)(?:~\\/|\\/(?:Users|home|tmp|var|opt|etc|godmode)\\/)[\\w/.+@-]+(?:\\.\\w+|\\/)(?=\\s|[),;:!?]|$)","g"),Ka=new RegExp("(?<![(\\[`/~\\w])(?:[\\w][\\w.-]*\\.(?:html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log|mp4|mov|mkv|avi|webm|mp3|wav|aac|ogg|flac|zip|tar|gz|bz2|dmg|iso|doc|docx|xls|xlsx|ppt|pptx))(?=\\s|[),;:!?|]|$)","gi");function qa(e){const t=e.split(/(```[\s\S]*?```|`[^`\n]+`)/g);for(let n=0;n<t.length;n++)n%2===0&&(t[n]=t[n].replace(Ya,(s,i,l)=>{if(l.slice(Math.max(0,i-3),i).includes("://")||l.slice(Math.max(0,i-2),i).includes("]("))return s;const u=s.endsWith("/");if(!u&&!Ga.test(s))return s;const v=s.startsWith("~/")?`file:///~/${s.slice(2)}`:`file://${s}`,p=s.replace(/\/+$/,"").split("/");return`[${u?(p.pop()??s)+"/":p.pop()??s}](${v})`}),t[n]=t[n].replace(Ka,s=>`[${s}](godmode-file://${encodeURIComponent(s)})`));return t.join("")}const Qe=["a","article","aside","b","blockquote","br","caption","col","colgroup","code","div","del","details","em","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","hr","img","i","input","li","main","nav","ol","p","pre","section","span","strong","sub","sup","summary","table","tbody","td","th","thead","tr","ul"],et=["alt","checked","class","decoding","disabled","height","href","loading","open","rel","src","start","target","title","type","width","style"],Dt=/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file|godmode-file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;let yn=!1;const Ja=14e4,Xa=14e4,Za=200,At=5e4,ge=new Map;function Qa(e){const t=ge.get(e);return t===void 0?null:(ge.delete(e),ge.set(e,t),t)}function $n(e,t){if(ge.set(e,t),ge.size<=Za)return;const n=ge.keys().next().value;n&&ge.delete(n)}function Ot(){yn||(yn=!0,Ae.addHook("uponSanitizeElement",e=>{e instanceof HTMLInputElement&&e.getAttribute("type")!=="checkbox"&&e.remove()}),Ae.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function mo(e){const t=e.trim();if(!t)return"";if(Ot(),t.length<=At){const r=Qa(t);if(r!==null)return r}const n=wa(t,Ja),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>Xa){const u=`<pre class="code-block">${ls(`${n.text}${s}`)}</pre>`,v=Ae.sanitize(u,{ALLOWED_TAGS:Qe,ALLOWED_ATTR:et,ALLOWED_URI_REGEXP:Dt});return t.length<=At&&$n(t,v),v}const i=qa(`${n.text}${s}`),l=Pt.parse(i),o=Ae.sanitize(l,{ALLOWED_TAGS:Qe,ALLOWED_ATTR:et,ALLOWED_URI_REGEXP:Dt});return t.length<=At&&$n(t,o),o}function es(e){const t=e.trim();if(!t)return"";Ot();const n=Pt.parse(t);return Ae.sanitize(n,{ALLOWED_TAGS:Qe,ALLOWED_ATTR:et,ALLOWED_URI_REGEXP:Dt}).replace(/<input([^>]*)\bdisabled\b([^>]*)>/g,"<input$1$2>")}const ts=[...Qe,"svg","path","circle","ellipse","rect","line","polyline","polygon","text","tspan","g","defs","linearGradient","radialGradient","stop","clipPath","mask","use","symbol","marker","pattern","animate","animateTransform"],ns=[...et,"viewBox","xmlns","preserveAspectRatio","d","cx","cy","r","rx","ry","x","x1","x2","y","y1","y2","dx","dy","fill","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","transform","opacity","points","text-anchor","dominant-baseline","font-size","font-weight","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","marker-start","marker-mid","marker-end","clip-path","patternUnits","patternTransform","rotate","textLength","lengthAdjust","values","dur","repeatCount","attributeName","from","to","begin","calcMode","keySplines","keyTimes"];function bo(e){const t=e.trim();if(!t)return"";Ot();const{styles:n,html:s}=as(t),i=Ae.sanitize(s,{ALLOWED_TAGS:ts,ALLOWED_ATTR:ns,FORBID_TAGS:["base","iframe","link","meta","object","script","style"]}),l=".dashboard-render";return n.map(r=>`<style>${is(r,l)}</style>`).join(`
`)+i}function as(e){const t=[],n=e.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi,(o,r)=>(t.push(r),"")),s=n.match(/<body[^>]*>([\s\S]*)<\/body>/i),l=(s?s[1]:n).replace(/<!DOCTYPE[^>]*>/gi,"").replace(/<\/?html[^>]*>/gi,"").replace(/<\/?head[^>]*>/gi,"").replace(/<\/?body[^>]*>/gi,"").replace(/<title[^>]*>[\s\S]*?<\/title>/gi,"").replace(/<meta[^>]*\/?>/gi,"").replace(/<link[^>]*\/?>/gi,"");return{styles:t,html:l}}function ss(e,t){let n=0;for(let s=t;s<e.length;s++)if(e[s]==="{")n++;else if(e[s]==="}"&&(n--,n===0))return s+1;return e.length}function is(e,t){let n=e.replace(/@import\b[^;]*;/gi,"");n=n.replace(/expression\s*\(/gi,"/* blocked */("),n=n.replace(/behavior\s*:/gi,"/* blocked */:"),n=n.replace(/-moz-binding\s*:/gi,"/* blocked */:");const s=[];let i=0;for(;i<n.length;){if(/\s/.test(n[i])){s.push(n[i]),i++;continue}if(n[i]==="/"&&n[i+1]==="*"){const p=n.indexOf("*/",i+2),g=p===-1?n.length:p+2;s.push(n.slice(i,g)),i=g;continue}if(n[i]==="}"){s.push("}"),i++;continue}if(/^@(-webkit-)?keyframes\s/.test(n.slice(i,i+30))){const p=ss(n,i);s.push(n.slice(i,p)),i=p;continue}if(/^@(media|supports|container|layer)\b/.test(n.slice(i,i+20))){const p=n.indexOf("{",i);if(p===-1){s.push(n.slice(i));break}s.push(n.slice(i,p+1)),i=p+1;continue}const l=n.indexOf("{",i);if(l===-1){s.push(n.slice(i));break}const o=n.slice(i,l).trim(),r=n.indexOf("}",l);if(r===-1){s.push(n.slice(i));break}const u=n.slice(l+1,r),v=o.split(",").map(p=>{const g=p.trim();if(!g)return p;if(g==="*")return`${t}, ${t} *`;if(/^(html|body|:root)$/i.test(g))return t;const h=g.replace(/^(html|body|:root)\s+/i,"");return`${t} ${h}`}).join(", ");s.push(`${v} {${u}}`),i=r+1}return s.join("")}function ls(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const os={messageSquare:a`
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  `,barChart:a`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  `,link:a`
    <svg viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  `,radio:a`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" />
      <path
        d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"
      />
    </svg>
  `,fileText:a`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  `,zap:a`
    <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  `,compass:a`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  `,monitor:a`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  `,settings:a`
    <svg viewBox="0 0 24 24">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,bug:a`
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
  `,scrollText:a`
    <svg viewBox="0 0 24 24">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  `,folder:a`
    <svg viewBox="0 0 24 24">
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </svg>
  `,folderOpen:a`
    <svg viewBox="0 0 24 24">
      <path
        d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"
      />
    </svg>
  `,file:a`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  `,chevronRight:a`
    <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
  `,chevronDown:a`
    <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
  `,panelLeft:a`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  `,panelLeftClose:a`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m16 15-3-3 3-3" />
    </svg>
  `,menu:a`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  `,x:a`
    <svg viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,check:a`
    <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
  `,copy:a`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  `,search:a`
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  `,brain:a`
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
  `,book:a`
    <svg viewBox="0 0 24 24">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  `,loader:a`
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
  `,arrowUp:a`
    <svg viewBox="0 0 24 24">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  `,calendar:a`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  `,heart:a`
    <svg viewBox="0 0 24 24">
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      />
    </svg>
  `,pieChart:a`
    <svg viewBox="0 0 24 24">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  `,star:a`
    <svg viewBox="0 0 24 24">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
  `,rotateCcw:a`
    <svg viewBox="0 0 24 24">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  `,headphones:a`
    <svg viewBox="0 0 24 24">
      <path
        d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"
      />
    </svg>
  `,helpCircle:a`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  `,messageCircle:a`
    <svg viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
  `,wrench:a`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </svg>
  `,fileCode:a`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  `,edit:a`
    <svg viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `,penLine:a`
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  `,paperclip:a`
    <svg viewBox="0 0 24 24">
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      />
    </svg>
  `,globe:a`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  `,image:a`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  `,smartphone:a`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  `,plug:a`
    <svg viewBox="0 0 24 24">
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  `,circle:a`
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
  `,puzzle:a`
    <svg viewBox="0 0 24 24">
      <path
        d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.076.874.54 1.02 1.02a2.5 2.5 0 1 0 3.237-3.237c-.48-.146-.944-.505-1.02-1.02a.98.98 0 0 1 .303-.917l1.526-1.526A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.236 3.236c-.464.18-.894.527-.967 1.02Z"
      />
    </svg>
  `,minimize:a`
    <svg viewBox="0 0 24 24">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" x2="21" y1="10" y2="3" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  `,users:a`
    <svg viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  `,briefcase:a`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  `,shield:a`
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  `,lock:a`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  `,lockOpen:a`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 5-5 5 5 0 0 1 4.63 3.13" />
    </svg>
  `,flask:a`
    <svg viewBox="0 0 24 24">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16.5h10" />
    </svg>
  `};function Z(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function Jn(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(Z(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function tt(e){return e.filter(t=>typeof t=="string").join(".")}function V(e,t){const n=tt(e),s=t[n];if(s)return s;const i=n.split(".");for(const[l,o]of Object.entries(t)){if(!l.includes("*"))continue;const r=l.split(".");if(r.length!==i.length)continue;let u=!0;for(let v=0;v<i.length;v+=1)if(r[v]!=="*"&&r[v]!==i[v]){u=!1;break}if(u)return o}}function se(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function rs(e){const t=tt(e).toLowerCase();return t.includes("token")||t.includes("password")||t.includes("secret")||t.includes("apikey")||t.endsWith("key")}function ke(e){return typeof e=="string"?e:e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}const cs=new Set(["title","description","default","nullable"]);function ds(e){return Object.keys(e??{}).filter(n=>!cs.has(n)).length===0}function us(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const Ue={chevronDown:a`
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
  `,plus:a`
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
  `,minus:a`
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
  `,trash:a`
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
  `,edit:a`
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
  `};function ae(e){const{schema:t,value:n,path:s,hints:i,unsupported:l,disabled:o,onPatch:r}=e,u=e.showLabel??!0,v=Z(t),p=V(s,i),g=p?.label??t.title??se(String(s.at(-1))),h=p?.help??t.description,$=tt(s);if(l.has($))return a`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${g}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const y=(t.anyOf??t.oneOf??[]).filter(_=>!(_.type==="null"||Array.isArray(_.type)&&_.type.includes("null")));if(y.length===1)return ae({...e,schema:y[0]});const f=_=>{if(_.const!==void 0)return _.const;if(_.enum&&_.enum.length===1)return _.enum[0]},w=y.map(f),S=w.every(_=>_!==void 0);if(S&&w.length>0&&w.length<=5){const _=n??t.default;return a`
        <div class="cfg-field">
          ${u?a`<label class="cfg-field__label">${g}</label>`:d}
          ${h?a`<div class="cfg-field__help">${h}</div>`:d}
          <div class="cfg-segmented">
            ${w.map((M,C)=>a`
              <button
                type="button"
                class="cfg-segmented__btn ${M===_||ke(M)===ke(_)?"active":""}"
                ?disabled=${o}
                @click=${()=>r(s,M)}
              >
                ${ke(M)}
              </button>
            `)}
          </div>
        </div>
      `}if(S&&w.length>5)return xn({...e,options:w,value:n??t.default});const T=new Set(y.map(_=>Z(_)).filter(Boolean)),k=new Set([...T].map(_=>_==="integer"?"number":_));if([...k].every(_=>["string","number","boolean"].includes(_))){const _=k.has("string"),M=k.has("number");if(k.has("boolean")&&k.size===1)return ae({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(_||M)return wn({...e,inputType:M&&!_?"number":"text"})}}if(t.enum){const b=t.enum;if(b.length<=5){const y=n??t.default;return a`
        <div class="cfg-field">
          ${u?a`<label class="cfg-field__label">${g}</label>`:d}
          ${h?a`<div class="cfg-field__help">${h}</div>`:d}
          <div class="cfg-segmented">
            ${b.map(f=>a`
              <button
                type="button"
                class="cfg-segmented__btn ${f===y||String(f)===String(y)?"active":""}"
                ?disabled=${o}
                @click=${()=>r(s,f)}
              >
                ${String(f)}
              </button>
            `)}
          </div>
        </div>
      `}return xn({...e,options:b,value:n??t.default})}if(v==="object")return vs(e);if(v==="array")return gs(e);if(v==="boolean"){const b=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return a`
      <label class="cfg-toggle-row ${o?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${g}</span>
          ${h?a`<span class="cfg-toggle-row__help">${h}</span>`:d}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${b}
            ?disabled=${o}
            @change=${y=>r(s,y.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return v==="number"||v==="integer"?ps(e):v==="string"?wn({...e,inputType:"text"}):a`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${g}</div>
      <div class="cfg-field__error">Unsupported type: ${v}. Use Raw mode.</div>
    </div>
  `}function wn(e){const{schema:t,value:n,path:s,hints:i,disabled:l,onPatch:o,inputType:r}=e,u=e.showLabel??!0,v=V(s,i),p=v?.label??t.title??se(String(s.at(-1))),g=v?.help??t.description,h=v?.sensitive??rs(s),$=v?.placeholder??(h?"••••":t.default!==void 0?`Default: ${ke(t.default)}`:""),b=n??"";return a`
    <div class="cfg-field">
      ${u?a`<label class="cfg-field__label">${p}</label>`:d}
      ${g?a`<div class="cfg-field__help">${g}</div>`:d}
      <div class="cfg-input-wrap">
        <input
          type=${h?"password":r}
          class="cfg-input"
          placeholder=${$}
          .value=${ke(b)}
          ?disabled=${l}
          @input=${y=>{const f=y.target.value;if(r==="number"){if(f.trim()===""){o(s,void 0);return}const w=Number(f);o(s,Number.isNaN(w)?f:w);return}o(s,f)}}
          @change=${y=>{if(r==="number")return;const f=y.target.value;o(s,f.trim())}}
        />
        ${t.default!==void 0?a`
          <button
            type="button"
            class="cfg-input__reset"
            title="Reset to default"
            ?disabled=${l}
            @click=${()=>o(s,t.default)}
          >↺</button>
        `:d}
      </div>
    </div>
  `}function ps(e){const{schema:t,value:n,path:s,hints:i,disabled:l,onPatch:o}=e,r=e.showLabel??!0,u=V(s,i),v=u?.label??t.title??se(String(s.at(-1))),p=u?.help??t.description,g=n??t.default??"",h=typeof g=="number"?g:0;return a`
    <div class="cfg-field">
      ${r?a`<label class="cfg-field__label">${v}</label>`:d}
      ${p?a`<div class="cfg-field__help">${p}</div>`:d}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${l}
          @click=${()=>o(s,h-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${ke(g)}
          ?disabled=${l}
          @input=${$=>{const b=$.target.value,y=b===""?void 0:Number(b);o(s,y)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${l}
          @click=${()=>o(s,h+1)}
        >+</button>
      </div>
    </div>
  `}function xn(e){const{schema:t,value:n,path:s,hints:i,disabled:l,options:o,onPatch:r}=e,u=e.showLabel??!0,v=V(s,i),p=v?.label??t.title??se(String(s.at(-1))),g=v?.help??t.description,h=n??t.default,$=o.findIndex(y=>y===h||String(y)===String(h)),b="__unset__";return a`
    <div class="cfg-field">
      ${u?a`<label class="cfg-field__label">${p}</label>`:d}
      ${g?a`<div class="cfg-field__help">${g}</div>`:d}
      <select
        class="cfg-select"
        ?disabled=${l}
        .value=${$>=0?String($):b}
        @change=${y=>{const f=y.target.value;r(s,f===b?void 0:o[Number(f)])}}
      >
        <option value=${b}>Select...</option>
        ${o.map((y,f)=>a`
          <option value=${String(f)}>${String(y)}</option>
        `)}
      </select>
    </div>
  `}function vs(e){const{schema:t,value:n,path:s,hints:i,unsupported:l,disabled:o,onPatch:r}=e;e.showLabel;const u=V(s,i),v=u?.label??t.title??se(String(s.at(-1))),p=u?.help??t.description,g=n??t.default,h=g&&typeof g=="object"&&!Array.isArray(g)?g:{},$=t.properties??{},y=Object.entries($).toSorted((T,k)=>{const _=V([...s,T[0]],i)?.order??0,M=V([...s,k[0]],i)?.order??0;return _!==M?_-M:T[0].localeCompare(k[0])}),f=new Set(Object.keys($)),w=t.additionalProperties,S=!!w&&typeof w=="object";return s.length===1?a`
      <div class="cfg-fields">
        ${y.map(([T,k])=>ae({schema:k,value:h[T],path:[...s,T],hints:i,unsupported:l,disabled:o,onPatch:r}))}
        ${S?kn({schema:w,value:h,path:s,hints:i,unsupported:l,disabled:o,reservedKeys:f,onPatch:r}):d}
      </div>
    `:a`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${v}</span>
        <span class="cfg-object__chevron">${Ue.chevronDown}</span>
      </summary>
      ${p?a`<div class="cfg-object__help">${p}</div>`:d}
      <div class="cfg-object__content">
        ${y.map(([T,k])=>ae({schema:k,value:h[T],path:[...s,T],hints:i,unsupported:l,disabled:o,onPatch:r}))}
        ${S?kn({schema:w,value:h,path:s,hints:i,unsupported:l,disabled:o,reservedKeys:f,onPatch:r}):d}
      </div>
    </details>
  `}function gs(e){const{schema:t,value:n,path:s,hints:i,unsupported:l,disabled:o,onPatch:r}=e,u=e.showLabel??!0,v=V(s,i),p=v?.label??t.title??se(String(s.at(-1))),g=v?.help??t.description,h=Array.isArray(t.items)?t.items[0]:t.items;if(!h)return a`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${p}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const $=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return a`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${u?a`<span class="cfg-array__label">${p}</span>`:d}
        <span class="cfg-array__count">${$.length} item${$.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${o}
          @click=${()=>{const b=[...$,Jn(h)];r(s,b)}}
        >
          <span class="cfg-array__add-icon">${Ue.plus}</span>
          Add
        </button>
      </div>
      ${g?a`<div class="cfg-array__help">${g}</div>`:d}

      ${$.length===0?a`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:a`
        <div class="cfg-array__items">
          ${$.map((b,y)=>a`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${y+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${o}
                  @click=${()=>{const f=[...$];f.splice(y,1),r(s,f)}}
                >
                  ${Ue.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${ae({schema:h,value:b,path:[...s,y],hints:i,unsupported:l,disabled:o,showLabel:!1,onPatch:r})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function kn(e){const{schema:t,value:n,path:s,hints:i,unsupported:l,disabled:o,reservedKeys:r,onPatch:u}=e,v=ds(t),p=Object.entries(n??{}).filter(([g])=>!r.has(g));return a`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${o}
          @click=${()=>{const g={...n};let h=1,$=`custom-${h}`;for(;$ in g;)h+=1,$=`custom-${h}`;g[$]=v?{}:Jn(t),u(s,g)}}
        >
          <span class="cfg-map__add-icon">${Ue.plus}</span>
          Add Entry
        </button>
      </div>

      ${p.length===0?a`
              <div class="cfg-map__empty">No custom entries.</div>
            `:a`
        <div class="cfg-map__items">
          ${p.map(([g,h])=>{const $=[...s,g],b=us(h);return a`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${g}
                    ?disabled=${o}
                    @change=${y=>{const f=y.target.value.trim();if(!f||f===g)return;const w={...n};f in w||(w[f]=w[g],delete w[g],u(s,w))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${v?a`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${b}
                          ?disabled=${o}
                          @change=${y=>{const f=y.target,w=f.value.trim();if(!w){u($,void 0);return}try{u($,JSON.parse(w))}catch{f.value=b}}}
                        ></textarea>
                      `:ae({schema:t,value:h,path:$,hints:i,unsupported:l,disabled:o,showLabel:!1,onPatch:u})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  ?disabled=${o}
                  @click=${()=>{const y={...n};delete y[g],u(s,y)}}
                >
                  ${Ue.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const An={env:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:a`
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
  `,meta:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:a`
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
  `,default:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},Bt={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"},user:{label:"User Profile",description:"Your display name and avatar"}};function _n(e){return An[e]??An.default}function fs(e,t,n){if(!n)return!0;const s=n.toLowerCase(),i=Bt[e];return e.toLowerCase().includes(s)||i&&(i.label.toLowerCase().includes(s)||i.description.toLowerCase().includes(s))?!0:ze(t,s)}function ze(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,i]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||ze(i,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const i of s)if(i&&ze(i,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&ze(e.additionalProperties,t))return!0;const n=e.anyOf??e.oneOf??e.allOf;if(n){for(const s of n)if(s&&ze(s,t))return!0}return!1}function hs(e){if(!e.schema)return a`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,n=e.value??{};if(Z(t)!=="object"||!t.properties)return a`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),i=t.properties,l=e.searchQuery??"",o=e.activeSection,r=e.activeSubsection??null,v=Object.entries(i).toSorted((g,h)=>{const $=V([g[0]],e.uiHints)?.order??50,b=V([h[0]],e.uiHints)?.order??50;return $!==b?$-b:g[0].localeCompare(h[0])}).filter(([g,h])=>!(o&&g!==o||l&&!fs(g,h,l)));let p=null;if(o&&r&&v.length===1){const g=v[0]?.[1];g&&Z(g)==="object"&&g.properties&&g.properties[r]&&(p={sectionKey:o,subsectionKey:r,schema:g.properties[r]})}return v.length===0?a`
      <div class="config-empty">
        <div class="config-empty__icon">${os.search}</div>
        <div class="config-empty__text">
          ${l?`No settings match "${l}"`:"No settings in this section"}
        </div>
      </div>
    `:a`
    <div class="config-form config-form--modern">
      ${p?(()=>{const{sectionKey:g,subsectionKey:h,schema:$}=p,b=V([g,h],e.uiHints),y=b?.label??$.title??se(h),f=b?.help??$.description??"",w=n[g],S=w&&typeof w=="object"?w[h]:void 0,T=`config-section-${g}-${h}`;return a`
              <section class="config-section-card" id=${T}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${_n(g)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${y}</h3>
                    ${f?a`<p class="config-section-card__desc">${f}</p>`:d}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${ae({schema:$,value:S,path:[g,h],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():v.map(([g,h])=>{const $=Bt[g]??{label:g.charAt(0).toUpperCase()+g.slice(1),description:h.description??""};return a`
              <section class="config-section-card" id="config-section-${g}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${_n(g)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${$.label}</h3>
                    ${$.description?a`<p class="config-section-card__desc">${$.description}</p>`:d}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${ae({schema:h,value:n[g],path:[g],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const ms=new Set(["title","description","default","nullable"]);function bs(e){return Object.keys(e??{}).filter(n=>!ms.has(n)).length===0}function Xn(e){const t=e.filter(i=>i!=null),n=t.length!==e.length,s=[];for(const i of t)s.some(l=>Object.is(l,i))||s.push(i);return{enumValues:s,nullable:n}}function Zn(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:Pe(e,[])}function Pe(e,t){const n=new Set,s={...e},i=tt(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const r=ys(e,t);return r||{schema:e,unsupportedPaths:[i]}}const l=Array.isArray(e.type)&&e.type.includes("null"),o=Z(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=o??e.type,s.nullable=l||e.nullable,s.enum){const{enumValues:r,nullable:u}=Xn(s.enum);s.enum=r,u&&(s.nullable=!0),r.length===0&&n.add(i)}if(o==="object"){const r=e.properties??{},u={};for(const[v,p]of Object.entries(r)){const g=Pe(p,[...t,v]);g.schema&&(u[v]=g.schema);for(const h of g.unsupportedPaths)n.add(h)}if(s.properties=u,e.additionalProperties===!0)n.add(i);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!bs(e.additionalProperties)){const v=Pe(e.additionalProperties,[...t,"*"]);s.additionalProperties=v.schema??e.additionalProperties,v.unsupportedPaths.length>0&&n.add(i)}}else if(o==="array"){const r=Array.isArray(e.items)?e.items[0]:e.items;if(!r)n.add(i);else{const u=Pe(r,[...t,"*"]);s.items=u.schema??r,u.unsupportedPaths.length>0&&n.add(i)}}else o!=="string"&&o!=="number"&&o!=="integer"&&o!=="boolean"&&!s.enum&&n.add(i);return{schema:s,unsupportedPaths:Array.from(n)}}function ys(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],i=[];let l=!1;for(const r of n){if(!r||typeof r!="object")return null;if(Array.isArray(r.enum)){const{enumValues:u,nullable:v}=Xn(r.enum);s.push(...u),v&&(l=!0);continue}if("const"in r){if(r.const==null){l=!0;continue}s.push(r.const);continue}if(Z(r)==="null"){l=!0;continue}i.push(r)}if(s.length>0&&i.length===0){const r=[];for(const u of s)r.some(v=>Object.is(v,u))||r.push(u);return{schema:{...e,enum:r,nullable:l,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(i.length===1){const r=Pe(i[0],t);return r.schema&&(r.schema.nullable=l||r.schema.nullable),r}const o=new Set(["string","number","integer","boolean"]);return i.length>0&&s.length===0&&i.every(r=>r.type&&o.has(String(r.type)))?{schema:{...e,nullable:l},unsupportedPaths:[]}:null}function $s(e,t){let n=e;for(const s of t){if(!n)return null;const i=Z(n);if(i==="object"){const l=n.properties??{};if(typeof s=="string"&&l[s]){n=l[s];continue}const o=n.additionalProperties;if(typeof s=="string"&&o&&typeof o=="object"){n=o;continue}return null}if(i==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function ws(e,t){const s=(e.channels??{})[t],i=e[t];return(s&&typeof s=="object"?s:null)??(i&&typeof i=="object"?i:null)??{}}function xs(e){const t=Zn(e.schema),n=t.schema;if(!n)return a`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=$s(n,["channels",e.channelId]);if(!s)return a`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const i=e.configValue??{},l=ws(i,e.channelId);return a`
    <div class="config-form">
      ${ae({schema:s,value:l,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
  `}function ie(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return a`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?a`
              <div class="muted">Loading config schema…</div>
            `:xs({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
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
  `}function ks(e){const{props:t,discord:n,accountCountLabel:s}=e;return a`
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
          <span>${n?.lastStartAt?L(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?L(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?a`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:d}

      ${n?.probe?a`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:d}

      ${ie({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function As(e){const{props:t,googleChat:n,accountCountLabel:s}=e;return a`
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
          <span>${n?.lastStartAt?L(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?L(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?a`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:d}

      ${n?.probe?a`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:d}

      ${ie({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function _s(e){const{props:t,imessage:n,accountCountLabel:s}=e;return a`
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
          <span>${n?.lastStartAt?L(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?L(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?a`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:d}

      ${n?.probe?a`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:d}

      ${ie({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Sn(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function Ss(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:i,profileFormState:l,profileFormCallbacks:o,onEditProfile:r}=e,u=s[0],v=n?.configured??u?.configured??!1,p=n?.running??u?.running??!1,g=n?.publicKey??u?.publicKey,h=n?.lastStartAt??u?.lastStartAt??null,$=n?.lastError??u?.lastError??null,b=s.length>1,y=l!=null,f=S=>{const T=S.publicKey,k=S.profile,_=k?.displayName??k?.name??S.name??S.accountId;return a`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${_}</div>
          <div class="account-card-id">${S.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${S.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${S.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${T??""}">${Sn(T)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${S.lastInboundAt?L(S.lastInboundAt):"n/a"}</span>
          </div>
          ${S.lastError?a`
                <div class="account-card-error">${S.lastError}</div>
              `:d}
        </div>
      </div>
    `},w=()=>{if(y&&o)return ka({state:l,callbacks:o,accountId:s[0]?.accountId??"default"});const S=u?.profile??n?.profile,{name:T,displayName:k,about:_,picture:M,nip05:C}=S??{},ce=T||k||_||M||C;return a`
      <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 500;">Profile</div>
          ${v?a`
                <button
                  class="btn btn-sm"
                  @click=${r}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:d}
        </div>
        ${ce?a`
              <div class="status-list">
                ${M?a`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${M}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${nt=>{nt.target.style.display="none"}}
                        />
                      </div>
                    `:d}
                ${T?a`<div><span class="label">Name</span><span>${T}</span></div>`:d}
                ${k?a`<div><span class="label">Display Name</span><span>${k}</span></div>`:d}
                ${_?a`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${_}</span></div>`:d}
                ${C?a`<div><span class="label">NIP-05</span><span>${C}</span></div>`:d}
              </div>
            `:a`
                <div style="color: var(--text-muted); font-size: 13px">
                  No profile set. Click "Edit Profile" to add your name, bio, and avatar.
                </div>
              `}
      </div>
    `};return a`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${i}

      ${b?a`
            <div class="account-card-list">
              ${s.map(S=>f(S))}
            </div>
          `:a`
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
                  >${Sn(g)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${h?L(h):"n/a"}</span>
              </div>
            </div>
          `}

      ${$?a`<div class="callout danger" style="margin-top: 12px;">${$}</div>`:d}

      ${w()}

      ${ie({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function Cs(e){if(!e&&e!==0)return"n/a";const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);return n<60?`${n}m`:`${Math.round(n/60)}h`}function Ts(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const i=s[e],l=typeof i?.configured=="boolean"&&i.configured,o=typeof i?.running=="boolean"&&i.running,r=typeof i?.connected=="boolean"&&i.connected,v=(n.channelAccounts?.[e]??[]).some(p=>p.configured||p.running||p.connected);return l||o||r||v}function Es(e,t){return t?.[e]?.length??0}function Qn(e,t){const n=Es(e,t);return n<2?d:a`<div class="account-count">Accounts (${n})</div>`}function Ms(e){const{props:t,signal:n,accountCountLabel:s}=e;return a`
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
          <span>${n?.lastStartAt?L(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?L(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?a`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:d}

      ${n?.probe?a`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:d}

      ${ie({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Ls(e){const{props:t,slack:n,accountCountLabel:s}=e;return a`
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
          <span>${n?.lastStartAt?L(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?L(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?a`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:d}

      ${n?.probe?a`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:d}

      ${ie({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Rs(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:i}=e,l=s.length>1,o=r=>{const v=r.probe?.bot?.username,p=r.name||r.accountId;return a`
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
          ${r.lastError?a`
                <div class="account-card-error">
                  ${r.lastError}
                </div>
              `:d}
        </div>
      </div>
    `};return a`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${i}

      ${l?a`
            <div class="account-card-list">
              ${s.map(r=>o(r))}
            </div>
          `:a`
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
                <span>${n?.lastStartAt?L(n.lastStartAt):"n/a"}</span>
              </div>
              <div>
                <span class="label">Last probe</span>
                <span>${n?.lastProbeAt?L(n.lastProbeAt):"n/a"}</span>
              </div>
            </div>
          `}

      ${n?.lastError?a`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:d}

      ${n?.probe?a`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:d}

      ${ie({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Ns(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return a`
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
            ${n?.lastConnectedAt?L(n.lastConnectedAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last message</span>
          <span>
            ${n?.lastMessageAt?L(n.lastMessageAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Auth age</span>
          <span>
            ${n?.authAgeMs!=null?Cs(n.authAgeMs):"n/a"}
          </span>
        </div>
      </div>

      ${n?.lastError?a`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:d}

      ${t.whatsappMessage?a`<div class="callout" style="margin-top: 12px;">
            ${t.whatsappMessage}
          </div>`:d}

      ${t.whatsappQrDataUrl?a`<div class="qr-wrap">
            <img src=${t.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:d}

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

      ${ie({channelId:"whatsapp",props:t})}
    </div>
  `}function yo(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,i=t?.discord??null;t?.googlechat;const l=t?.slack??null,o=t?.signal??null,r=t?.imessage??null,u=t?.nostr??null,p=Ds(e.snapshot).map((g,h)=>({key:g,enabled:Ts(g,e),order:h})).toSorted((g,h)=>g.enabled!==h.enabled?g.enabled?-1:1:g.order-h.order);return a`
    <section class="grid grid-cols-2">
      ${p.map(g=>zs(g.key,e,{whatsapp:n,telegram:s,discord:i,slack:l,signal:o,imessage:r,nostr:u,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?L(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?a`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:d}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function Ds(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function zs(e,t,n){const s=Qn(e,n.channelAccounts);switch(e){case"whatsapp":return Ns({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return Rs({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return ks({props:t,discord:n.discord,accountCountLabel:s});case"googlechat":return As({props:t,accountCountLabel:s});case"slack":return Ls({props:t,slack:n.slack,accountCountLabel:s});case"signal":return Ms({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return _s({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const i=n.channelAccounts?.nostr??[],l=i[0],o=l?.accountId??"default",r=l?.profile??null,u=t.nostrProfileAccountId===o?t.nostrProfileFormState:null,v=u?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return Ss({props:t,nostr:n.nostr,nostrAccounts:i,accountCountLabel:s,profileFormState:u,profileFormCallbacks:v,onEditProfile:()=>t.onNostrProfileEdit(o,r)})}default:return Is(e,t,n.channelAccounts??{})}}function Is(e,t,n){const s=Os(t.snapshot,e),i=t.snapshot?.channels?.[e],l=typeof i?.configured=="boolean"?i.configured:void 0,o=typeof i?.running=="boolean"?i.running:void 0,r=typeof i?.connected=="boolean"?i.connected:void 0,u=typeof i?.lastError=="string"?i.lastError:void 0,v=n[e]??[],p=Qn(e,n);return a`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${p}

      ${v.length>0?a`
            <div class="account-card-list">
              ${v.map(g=>Hs(g))}
            </div>
          `:a`
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

      ${u?a`<div class="callout danger" style="margin-top: 12px;">
            ${u}
          </div>`:d}

      ${ie({channelId:e,props:t})}
    </div>
  `}function Ps(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function Os(e,t){return Ps(e)[t]?.label??e?.channelLabels?.[t]??t}const Bs=600*1e3;function ea(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<Bs:!1}function Fs(e){return e.running?"Yes":ea(e)?"Active":"No"}function Us(e){return e.connected===!0?"Yes":e.connected===!1?"No":ea(e)?"Active":"n/a"}function Hs(e){const t=Fs(e),n=Us(e);return a`
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
          <span>${e.lastInboundAt?L(e.lastInboundAt):"n/a"}</span>
        </div>
        ${e.lastError?a`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:d}
      </div>
    </div>
  `}function js(e,t=128){return new Promise((n,s)=>{const i=new Image;i.addEventListener("load",()=>{const l=document.createElement("canvas");l.width=t,l.height=t;const o=l.getContext("2d");if(!o){s(new Error("Could not get canvas context"));return}const r=Math.min(i.width,i.height),u=(i.width-r)/2,v=(i.height-r)/2;o.drawImage(i,u,v,r,r,0,0,t,t),n(l.toDataURL("image/png"))}),i.addEventListener("error",()=>s(new Error("Failed to load image"))),i.src=URL.createObjectURL(e)})}let xe="",Ie=null,ve=null,Cn=!1,le=!1;function Ws(e){Cn||(xe=e.userName||"",Ie=e.userAvatar||null,ve=e.userAvatar||null,Cn=!0,le=!1)}function Vs(e){Ws(e);const t=u=>{xe=u.target.value,le=!0},n=async u=>{const p=u.target.files?.[0];if(p){if(!p.type.startsWith("image/")){alert("Please select an image file");return}if(p.size>5*1024*1024){alert("Image must be less than 5MB");return}try{const g=await js(p,128);Ie=g,ve=g,le=!0,document.dispatchEvent(new CustomEvent("user-settings-updated"))}catch(g){console.error("Failed to process image:",g),alert("Failed to process image")}}},s=()=>{Ie=null,ve=null,le=!0;const u=document.getElementById("user-avatar-input");u&&(u.value=""),document.dispatchEvent(new CustomEvent("user-settings-updated"))},i=()=>{e.onUpdate(xe,Ie||""),le=!1;const u=document.querySelector(".user-settings__save");u&&(u.textContent="Saved!",setTimeout(()=>{u.textContent="Save"},1500))},l=()=>{xe=e.userName||"",Ie=e.userAvatar||null,ve=e.userAvatar||null,le=!1,document.dispatchEvent(new CustomEvent("user-settings-updated"))},o=xe||"You",r=ve?a`<img src="${ve}" alt="${o}" class="user-settings__avatar-img" />`:a`<span class="user-settings__avatar-initial">${o.charAt(0).toUpperCase()}</span>`;return a`
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
                  ${ve?a`
                        <button
                          type="button"
                          class="user-settings__btn user-settings__btn--clear"
                          @click=${s}
                        >
                          Remove
                        </button>
                      `:d}
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
                .value=${xe}
                @input=${t}
                placeholder="Your name"
                maxlength="50"
              />
              <span class="user-settings__hint">This name appears on your chat messages</span>
            </div>

            <!-- Actions -->
            <div class="user-settings__actions">
              ${le?a`
                    <button
                      type="button"
                      class="user-settings__btn user-settings__btn--cancel"
                      @click=${l}
                    >
                      Cancel
                    </button>
                  `:d}
              <button
                type="button"
                class="user-settings__btn user-settings__btn--save user-settings__save"
                ?disabled=${!le}
                @click=${i}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `}const zt={all:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,env:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:a`
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
  `,meta:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:a`
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
  `,user:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  `,default:a`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},_t=[{key:"model",label:"AI Model"},{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"},{key:"user",label:"User"}],Tn=new Set(["user","model"]),En="__all__";function Mn(e){return zt[e]??zt.default}function Gs(e,t){const n=Bt[e];return n||{label:t?.title??se(e),description:t?.description??""}}function Ys(e){const{key:t,schema:n,uiHints:s}=e;if(!n||Z(n)!=="object"||!n.properties)return[];const i=Object.entries(n.properties).map(([l,o])=>{const r=V([t,l],s),u=r?.label??o.title??se(l),v=r?.help??o.description??"",p=r?.order??50;return{key:l,label:u,description:v,order:p}});return i.sort((l,o)=>l.order!==o.order?l.order-o.order:l.key.localeCompare(o.key)),i}function Ks(e,t){if(!e||!t)return[];const n=[];function s(i,l,o){if(i===l)return;if(typeof i!=typeof l){n.push({path:o,from:i,to:l});return}if(typeof i!="object"||i===null||l===null){i!==l&&n.push({path:o,from:i,to:l});return}if(Array.isArray(i)&&Array.isArray(l)){JSON.stringify(i)!==JSON.stringify(l)&&n.push({path:o,from:i,to:l});return}const r=i,u=l,v=new Set([...Object.keys(r),...Object.keys(u)]);for(const p of v)s(r[p],u[p],o?`${o}.${p}`:p)}return s(e,t,""),n}function Ln(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}const Rn={anthropic:"#d97706",openai:"#10b981","openai-codex":"#10b981",xai:"#6366f1"};function qs(e){const t=[],n=e.models,s=e.agents,i=n?.providers;if(i&&typeof i=="object")for(const[o,r]of Object.entries(i)){const u=r;for(const v of u.models??[])t.push({id:`${o}/${v.id}`,name:v.name??v.id,provider:o,providerLabel:o.charAt(0).toUpperCase()+o.slice(1),reasoning:v.reasoning??!1,contextWindow:v.contextWindow??0})}const l=s?.defaults?.models;if(l&&typeof l=="object")for(const o of Object.keys(l)){if(t.some(u=>u.id===o))continue;const r=o.split("/");t.push({id:o,name:r.slice(1).join("/"),provider:r[0]??"unknown",providerLabel:(r[0]??"unknown").replace(/-/g," ").replace(/\b\w/g,u=>u.toUpperCase()),reasoning:!1,contextWindow:0})}return t}function Js(e){return e.startsWith("anthropic/")?["openai-codex/gpt-5.3-codex"]:["anthropic/claude-sonnet-4-6"]}function Xs(e){const t=e.formValue;if(!t)return a`<div class="config-loading"><span>Loading config...</span></div>`;const n=t.agents,s=n?.defaults?.model?.primary??"",i=n?.defaults?.model?.fallbacks??[],l=qs(t),o=new Map;for(const u of l){const v=o.get(u.provider)??[];v.push(u),o.set(u.provider,v)}const r=e.saving||e.applying;return a`
    <div class="model-picker">
      <div class="model-picker__current">
        <div class="model-picker__current-label">Active Model</div>
        <div class="model-picker__current-value">${s||"Not set"}</div>
        ${i.length>0?a`<div class="model-picker__fallback">Fallback: ${i.join(", ")}</div>`:d}
      </div>

      ${r?a`<div class="model-picker__status">Switching model...</div>`:d}

      ${Array.from(o.entries()).map(([u,v])=>a`
          <div class="model-picker__group">
            <div class="model-picker__group-label">
              <span class="model-picker__group-dot" style="background: ${Rn[u]??"var(--accent)"}"></span>
              ${v[0]?.providerLabel??u}
            </div>
            <div class="model-picker__cards">
              ${v.map(p=>{const g=p.id===s,h=Rn[p.provider]??"var(--accent)";return a`
                  <button
                    class="model-card ${g?"model-card--active":""}"
                    style="--model-accent: ${h}"
                    ?disabled=${r}
                    @click=${()=>{g||!e.onModelSwitch||e.onModelSwitch(p.id,Js(p.id))}}
                  >
                    <div class="model-card__body">
                      <div class="model-card__name">${p.name||p.id}</div>
                      ${p.reasoning?a`<span class="model-card__tag">reasoning</span>`:d}
                      ${p.contextWindow>0?a`<span class="model-card__ctx">${Math.round(p.contextWindow/1e3)}k ctx</span>`:d}
                    </div>
                    ${g?a`<span class="model-card__check">Active</span>`:d}
                  </button>
                `})}
            </div>
          </div>
        `)}
    </div>
  `}function $o(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=Zn(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,i=n.schema?.properties??{},l=_t.filter(C=>C.key in i&&!Tn.has(C.key)),o=new Set(_t.map(C=>C.key)),r=Object.keys(i).filter(C=>!o.has(C)).map(C=>({key:C,label:C.charAt(0).toUpperCase()+C.slice(1)})),u=_t.filter(C=>Tn.has(C.key)),v=[...l,...r,...u],p=e.activeSection&&n.schema&&Z(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,g=e.activeSection?Gs(e.activeSection,p):null,h=e.activeSection?Ys({key:e.activeSection,schema:p,uiHints:e.uiHints}):[],$=e.formMode==="form"&&!!e.activeSection&&h.length>0,b=e.activeSubsection===En,y=e.searchQuery||b?null:e.activeSubsection??h[0]?.key??null,f=e.formMode==="form"?Ks(e.originalValue,e.formValue):[],w=e.formMode==="raw"&&e.raw!==e.originalRaw,S=e.formMode==="form"?f.length>0:w,T=!!e.formValue&&!e.loading&&!!n.schema,k=e.connected&&!e.saving&&S&&(e.formMode==="raw"?!0:T),_=e.connected&&!e.applying&&!e.updating&&S&&(e.formMode==="raw"?!0:T),M=e.connected&&!e.applying&&!e.updating;return a`
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
            @input=${C=>e.onSearchChange(C.target.value)}
          />
          ${e.searchQuery?a`
            <button
              class="config-search__clear"
              @click=${()=>e.onSearchChange("")}
            >×</button>
          `:d}
        </div>

        <!-- Section nav -->
        <nav class="config-nav">
          <button
            class="config-nav__item ${e.activeSection===null?"active":""}"
            @click=${()=>e.onSectionChange(null)}
          >
            <span class="config-nav__icon">${zt.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${v.map(C=>a`
            <button
              class="config-nav__item ${e.activeSection===C.key?"active":""}"
              @click=${()=>e.onSectionChange(C.key)}
            >
              <span class="config-nav__icon">${Mn(C.key)}</span>
              <span class="config-nav__label">${C.label}</span>
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
            ${S?a`
              <span class="config-changes-badge">${e.formMode==="raw"?"Unsaved changes":`${f.length} unsaved change${f.length!==1?"s":""}`}</span>
            `:a`
                    <span class="config-status muted">No changes</span>
                  `}
          </div>
          <div class="config-actions__right">
            <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onReload}>
              ${e.loading?"Loading…":"Reload"}
            </button>
            <button
              class="btn btn--sm primary"
              ?disabled=${!k}
              @click=${e.onSave}
            >
              ${e.saving?"Saving…":"Save"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!_}
              @click=${e.onApply}
            >
              ${e.applying?"Applying…":"Apply"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!M}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${S&&e.formMode==="form"?a`
          <details class="config-diff">
            <summary class="config-diff__summary">
              <span>View ${f.length} pending change${f.length!==1?"s":""}</span>
              <svg class="config-diff__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${f.map(C=>a`
                <div class="config-diff__item">
                  <div class="config-diff__path">${C.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${Ln(C.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${Ln(C.to)}</span>
                  </div>
                </div>
              `)}
            </div>
          </details>
        `:d}

        ${g&&e.formMode==="form"?a`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${Mn(e.activeSection??"")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${g.label}</div>
                  ${g.description?a`<div class="config-section-hero__desc">${g.description}</div>`:d}
                </div>
              </div>
            `:d}

        ${$?a`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${y===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(En)}
                >
                  All
                </button>
                ${h.map(C=>a`
                    <button
                      class="config-subnav__item ${y===C.key?"active":""}"
                      title=${C.description||C.label}
                      @click=${()=>e.onSubsectionChange(C.key)}
                    >
                      ${C.label}
                    </button>
                  `)}
              </div>
            `:d}

        <!-- Form content -->
        <div class="config-content">
          ${e.activeSection==="model"?Xs(e):e.activeSection==="user"?Vs({userName:e.userName,userAvatar:e.userAvatar,onUpdate:e.onUserProfileUpdate}):e.formMode==="form"?a`
                  ${e.schemaLoading?a`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `:hs({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:y})}
                  ${s?a`
                          <div class="callout danger" style="margin-top: 12px">
                            Form view can't safely edit some fields. Use Raw to avoid losing config entries.
                          </div>
                        `:d}
                `:a`
                  <label class="field config-raw-field">
                    <span>Raw JSON5</span>
                    <textarea
                      .value=${e.raw}
                      @input=${C=>e.onRawChange(C.target.value)}
                    ></textarea>
                  </label>
                `}
        </div>

        ${e.issues.length>0?a`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:d}
      </main>
    </div>
  `}function Zs(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",i=e.version??"";return`${t} ${n} ${s} ${i}`.trim()}function Qs(e){const t=e.ts??null;return t?L(t):"n/a"}function ei(e){return e?`${Be(e)} (${L(e)})`:"n/a"}function ti(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function ni(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function ai(e){const t=e.state??{},n=t.nextRunAtMs?Be(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?Be(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function si(e){const t=e.schedule;return t.kind==="at"?`At ${Be(t.atMs)}`:t.kind==="every"?`Every ${jn(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function ii(e){const t=e.payload;return t.kind==="systemEvent"?`System: ${t.text}`:`Agent: ${t.message}`}function li(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.channel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(i=>s.has(i)?!1:(s.add(i),!0))}function oi(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function wo(e){const t=li(e);return a`
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
            <div class="stat-value">${ei(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
          ${e.error?a`<span class="muted">${e.error}</span>`:d}
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
        ${ri(e)}
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
	          ${e.form.payloadKind==="agentTurn"?a`
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
	                    ${t.map(n=>a`<option value=${n}>
                            ${oi(e,n)}
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
                ${e.form.sessionTarget==="isolated"?a`
                      <label class="field">
                        <span>Post to main prefix</span>
                        <input
                          .value=${e.form.postToMainPrefix}
                          @input=${n=>e.onFormChange({postToMainPrefix:n.target.value})}
                        />
                      </label>
                    `:d}
              </div>
            `:d}
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
      ${e.jobs.length===0?a`
              <div class="muted" style="margin-top: 12px">No jobs yet.</div>
            `:a`
            <div class="list" style="margin-top: 12px;">
              ${e.jobs.map(n=>ci(n,e))}
            </div>
          `}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Run history</div>
      <div class="card-sub">Latest runs for ${e.runsJobId??"(select a job)"}.</div>
      ${e.runsJobId==null?a`
              <div class="muted" style="margin-top: 12px">Select a job to inspect run history.</div>
            `:e.runs.length===0?a`
                <div class="muted" style="margin-top: 12px">No runs yet.</div>
              `:a`
              <div class="list" style="margin-top: 12px;">
                ${e.runs.map(n=>di(n))}
              </div>
            `}
    </section>
  `}function ri(e){const t=e.form;return t.scheduleKind==="at"?a`
      <label class="field" style="margin-top: 12px;">
        <span>Run at</span>
        <input
          type="datetime-local"
          .value=${t.scheduleAt}
          @input=${n=>e.onFormChange({scheduleAt:n.target.value})}
        />
      </label>
    `:t.scheduleKind==="every"?a`
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
    `:a`
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
  `}function ci(e,t){const s=`list-item list-item-clickable${t.runsJobId===e.id?" list-item-selected":""}`;return a`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${si(e)}</div>
        <div class="muted">${ii(e)}</div>
        ${e.agentId?a`<div class="muted">Agent: ${e.agentId}</div>`:d}
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.enabled?"enabled":"disabled"}</span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
      </div>
      <div class="list-meta">
        <div>${ai(e)}</div>
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
  `}function di(e){return a`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${Be(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?a`<div class="muted">${e.error}</div>`:d}
      </div>
    </div>
  `}function xo(e){const n=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=n?.critical??0,i=n?.warn??0,l=n?.info??0,o=s>0?"danger":i>0?"warn":"success",r=s>0?`${s} critical`:i>0?`${i} warnings`:"No critical issues";return a`
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
            ${n?a`<div class="callout ${o}" style="margin-top: 8px;">
                  Security audit: ${r}${l>0?` · ${l} info`:""}. Run
                  <span class="mono">openclaw security audit --deep</span> for details.
                </div>`:d}
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
              @input=${u=>e.onCallMethodChange(u.target.value)}
              placeholder="system-presence"
            />
          </label>
          <label class="field">
            <span>Params (JSON)</span>
            <textarea
              .value=${e.callParams}
              @input=${u=>e.onCallParamsChange(u.target.value)}
              rows="6"
            ></textarea>
          </label>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn primary" @click=${e.onCall}>Call</button>
        </div>
        ${e.callError?a`<div class="callout danger" style="margin-top: 12px;">
              ${e.callError}
            </div>`:d}
        ${e.callResult?a`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:d}
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
      ${e.eventLog.length===0?a`
              <div class="muted" style="margin-top: 12px">No events yet.</div>
            `:a`
            <div class="list" style="margin-top: 12px;">
              ${e.eventLog.map(u=>a`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${u.event}</div>
                      <div class="list-sub">${new Date(u.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta">
                      <pre class="code-block">${ni(u.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function ui(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function pe(e,t){return t?a`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:d}function ko(e){const t=e.execApprovalQueue[0];if(!t)return d;const n=t.request,s=t.expiresAtMs-Date.now(),i=s>0?`expires in ${ui(s)}`:"expired",l=e.execApprovalQueue.length;return a`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
          ${l>1?a`<div class="exec-approval-queue">${l} pending</div>`:d}
        </div>
        <div class="exec-approval-command mono">${n.command}</div>
        <div class="exec-approval-meta">
          ${pe("Host",n.host)}
          ${pe("Agent",n.agentId)}
          ${pe("Session",n.sessionKey)}
          ${pe("CWD",n.cwd)}
          ${pe("Resolved",n.resolvedPath)}
          ${pe("Security",n.security)}
          ${pe("Ask",n.ask)}
        </div>
        ${e.execApprovalError?a`<div class="exec-approval-error">${e.execApprovalError}</div>`:d}
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
  `}function Ao(e){return a`
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
      ${e.lastError?a`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:d}
      ${e.statusMessage?a`<div class="callout" style="margin-top: 12px;">
            ${e.statusMessage}
          </div>`:d}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?a`
                <div class="muted">No instances reported yet.</div>
              `:e.entries.map(t=>pi(t))}
      </div>
    </section>
  `}function pi(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],i=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],l=i.length>0?i.length>3?`${i.length} scopes`:`scopes: ${i.join(", ")}`:null;return a`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${Zs(e)}</div>
        <div class="chip-row">
          <span class="chip">${n}</span>
          ${s.map(o=>a`<span class="chip">${o}</span>`)}
          ${l?a`<span class="chip">${l}</span>`:d}
          ${e.platform?a`<span class="chip">${e.platform}</span>`:d}
          ${e.deviceFamily?a`<span class="chip">${e.deviceFamily}</span>`:d}
          ${e.modelIdentifier?a`<span class="chip">${e.modelIdentifier}</span>`:d}
          ${e.version?a`<span class="chip">${e.version}</span>`:d}
        </div>
      </div>
      <div class="list-meta">
        <div>${Qs(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}const Nn=["trace","debug","info","warn","error","fatal"];function vi(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function gi(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function _o(e){const t=e.filterText.trim().toLowerCase(),n=Nn.some(l=>!e.levelFilters[l]),s=e.entries.filter(l=>l.level&&!e.levelFilters[l.level]?!1:gi(l,t)),i=t||n?"filtered":"visible";return a`
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
        ${Nn.map(l=>a`
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

      ${e.file?a`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:d}
      ${e.truncated?a`
              <div class="callout" style="margin-top: 10px">Log output truncated; showing latest chunk.</div>
            `:d}
      ${e.error?a`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:d}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${s.length===0?a`
                <div class="muted" style="padding: 12px">No log entries.</div>
              `:s.map(l=>a`
                <div class="log-row">
                  <div class="log-time mono">${vi(l.time)}</div>
                  <div class="log-level ${l.level??""}">${l.level??""}</div>
                  <div class="log-subsystem mono">${l.subsystem??""}</div>
                  <div class="log-message mono">${l.message??l.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}function So(e){const t=$i(e),n=Si(e);return a`
    ${Ti(n)}
    ${Ci(t)}
    ${fi(e)}
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
        ${e.nodes.length===0?a`
                <div class="muted">No nodes found.</div>
              `:e.nodes.map(s=>Oi(s))}
      </div>
    </section>
  `}function fi(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return a`
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
      ${e.devicesError?a`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:d}
      <div class="list" style="margin-top: 16px;">
        ${n.length>0?a`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${n.map(i=>hi(i,e))}
            `:d}
        ${s.length>0?a`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(i=>mi(i,e))}
            `:d}
        ${n.length===0&&s.length===0?a`
                <div class="muted">No paired devices.</div>
              `:d}
      </div>
    </section>
  `}function hi(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?L(e.ts):"n/a",i=e.role?.trim()?`role: ${e.role}`:"role: -",l=e.isRepair?" · repair":"",o=e.remoteIp?` · ${e.remoteIp}`:"";return a`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
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
  `}function mi(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",i=`roles: ${Et(e.roles)}`,l=`scopes: ${Et(e.scopes)}`,o=Array.isArray(e.tokens)?e.tokens:[];return a`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${s}</div>
        <div class="muted" style="margin-top: 6px;">${i} · ${l}</div>
        ${o.length===0?a`
                <div class="muted" style="margin-top: 6px">Tokens: none</div>
              `:a`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${o.map(r=>bi(e.deviceId,r,t))}
              </div>
            `}
      </div>
    </div>
  `}function bi(e,t,n){const s=t.revokedAtMs?"revoked":"active",i=`scopes: ${Et(t.scopes)}`,l=L(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return a`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${i} · ${l}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          Rotate
        </button>
        ${t.revokedAtMs?d:a`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e,t.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}const oe="__defaults__",Dn=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],yi=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function $i(e){const t=e.configForm,n=zi(e.nodes),{defaultBinding:s,agents:i}=Pi(t),l=!!t,o=e.configSaving||e.configFormMode==="raw";return{ready:l,disabled:o,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function zn(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function wi(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function xi(e){const t=e?.defaults??{};return{security:zn(t.security),ask:wi(t.ask),askFallback:zn(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function ki(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(i=>{if(!i||typeof i!="object")return;const l=i,o=typeof l.id=="string"?l.id.trim():"";if(!o)return;const r=typeof l.name=="string"?l.name.trim():void 0,u=l.default===!0;s.push({id:o,name:r||void 0,isDefault:u})}),s}function Ai(e,t){const n=ki(e),s=Object.keys(t?.agents??{}),i=new Map;n.forEach(o=>i.set(o.id,o)),s.forEach(o=>{i.has(o)||i.set(o,{id:o})});const l=Array.from(i.values());return l.length===0&&l.push({id:"main",isDefault:!0}),l.sort((o,r)=>{if(o.isDefault&&!r.isDefault)return-1;if(!o.isDefault&&r.isDefault)return 1;const u=o.name?.trim()?o.name:o.id,v=r.name?.trim()?r.name:r.id;return u.localeCompare(v)}),l}function _i(e,t){return e===oe?oe:e&&t.some(n=>n.id===e)?e:oe}function Si(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=xi(t),i=Ai(e.configForm,t),l=Ii(e.nodes),o=e.execApprovalsTarget;let r=o==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o==="node"&&r&&!l.some(g=>g.id===r)&&(r=null);const u=_i(e.execApprovalsSelectedAgent,i),v=u!==oe?(t?.agents??{})[u]??null:null,p=Array.isArray(v?.allowlist)?v.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:u,selectedAgent:v,agents:i,allowlist:p,target:o,targetNodeId:r,targetNodes:l,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function Ci(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return a`
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

      ${e.formMode==="raw"?a`
              <div class="callout warn" style="margin-top: 12px">
                Switch the Config tab to <strong>Form</strong> mode to edit bindings here.
              </div>
            `:d}

      ${e.ready?a`
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
                      <option value="" ?selected=${n===""}>Any node</option>
                      ${e.nodes.map(s=>a`<option
                            value=${s.id}
                            ?selected=${n===s.id}
                          >
                            ${s.label}
                          </option>`)}
                    </select>
                  </label>
                  ${t?d:a`
                          <div class="muted">No nodes with system.run available.</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?a`
                      <div class="muted">No agents found.</div>
                    `:e.agents.map(s=>Di(s,e))}
            </div>
          `:a`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function Ti(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return a`
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

      ${Ei(e)}

      ${t?a`
            ${Mi(e)}
            ${Li(e)}
            ${e.selectedScope===oe?d:Ri(e)}
          `:a`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function Ei(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return a`
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
          ${e.target==="node"?a`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${e.disabled||!t}
                    @change=${s=>{const l=s.target.value.trim();e.onSelectTarget("node",l||null)}}
                  >
                    <option value="" ?selected=${n===""}>Select node</option>
                    ${e.targetNodes.map(s=>a`<option
                          value=${s.id}
                          ?selected=${n===s.id}
                        >
                          ${s.label}
                        </option>`)}
                  </select>
                </label>
              `:d}
        </div>
      </div>
      ${e.target==="node"&&!t?a`
              <div class="muted">No nodes advertise exec approvals yet.</div>
            `:d}
    </div>
  `}function Mi(e){return a`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===oe?"active":""}"
          @click=${()=>e.onSelectScope(oe)}
        >
          Defaults
        </button>
        ${e.agents.map(t=>{const n=t.name?.trim()?`${t.name} (${t.id})`:t.id;return a`
            <button
              class="btn btn--sm ${e.selectedScope===t.id?"active":""}"
              @click=${()=>e.onSelectScope(t.id)}
            >
              ${n}
            </button>
          `})}
      </div>
    </div>
  `}function Li(e){const t=e.selectedScope===oe,n=e.defaults,s=e.selectedAgent??{},i=t?["defaults"]:["agents",e.selectedScope],l=typeof s.security=="string"?s.security:void 0,o=typeof s.ask=="string"?s.ask:void 0,r=typeof s.askFallback=="string"?s.askFallback:void 0,u=t?n.security:l??"__default__",v=t?n.ask:o??"__default__",p=t?n.askFallback:r??"__default__",g=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,h=g??n.autoAllowSkills,$=g==null;return a`
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
              @change=${b=>{const f=b.target.value;!t&&f==="__default__"?e.onRemove([...i,"security"]):e.onPatch([...i,"security"],f)}}
            >
              ${t?d:a`<option value="__default__" ?selected=${u==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${Dn.map(b=>a`<option
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
              @change=${b=>{const f=b.target.value;!t&&f==="__default__"?e.onRemove([...i,"ask"]):e.onPatch([...i,"ask"],f)}}
            >
              ${t?d:a`<option value="__default__" ?selected=${v==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${yi.map(b=>a`<option
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
            ${t?"Applied when the UI prompt is unavailable.":`Default: ${n.askFallback}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Fallback</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const f=b.target.value;!t&&f==="__default__"?e.onRemove([...i,"askFallback"]):e.onPatch([...i,"askFallback"],f)}}
            >
              ${t?d:a`<option value="__default__" ?selected=${p==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${Dn.map(b=>a`<option
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
            ${t?"Allow skill executables listed by the Gateway.":$?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${h?"on":"off"}).`}
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
          ${!t&&!$?a`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,"autoAllowSkills"])}
              >
                Use default
              </button>`:d}
        </div>
      </div>
    </div>
  `}function Ri(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return a`
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
      ${n.length===0?a`
              <div class="muted">No allowlist entries yet.</div>
            `:n.map((s,i)=>Ni(e,s,i))}
    </div>
  `}function Ni(e,t,n){const s=t.lastUsedAt?L(t.lastUsedAt):"never",i=t.lastUsedCommand?Fe(t.lastUsedCommand,120):null,l=t.lastResolvedPath?Fe(t.lastResolvedPath,120):null;return a`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${i?a`<div class="list-sub mono">${i}</div>`:d}
        ${l?a`<div class="list-sub mono">${l}</div>`:d}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${t.pattern??""}
            ?disabled=${e.disabled}
            @input=${o=>{const r=o.target;e.onPatch(["agents",e.selectedScope,"allowlist",n,"pattern"],r.value)}}
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
  `}function Di(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,i=t.nodes.length>0;return a`
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
            @change=${l=>{const r=l.target.value.trim();t.onBindAgent(e.index,r==="__default__"?null:r)}}
          >
            <option value="__default__" ?selected=${n==="__default__"}>
              Use default
            </option>
            ${t.nodes.map(l=>a`<option
                  value=${l.id}
                  ?selected=${n===l.id}
                >
                  ${l.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function zi(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(r=>String(r)==="system.run"))continue;const l=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!l)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():l;t.push({id:l,label:o===l?l:`${o} · ${l}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function Ii(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(r=>String(r)==="system.execApprovals.get"||String(r)==="system.execApprovals.set"))continue;const l=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!l)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():l;t.push({id:l,label:o===l?l:`${o} · ${l}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function Pi(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},i=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,l=e.agents??{},o=Array.isArray(l.list)?l.list:[];if(o.length===0)return{defaultBinding:i,agents:[t]};const r=[];return o.forEach((u,v)=>{if(!u||typeof u!="object")return;const p=u,g=typeof p.id=="string"?p.id.trim():"";if(!g)return;const h=typeof p.name=="string"?p.name.trim():void 0,$=p.default===!0,y=(p.tools??{}).exec??{},f=typeof y.node=="string"&&y.node.trim()?y.node.trim():null;r.push({id:g,name:h||void 0,index:v,isDefault:$,binding:f})}),r.length===0&&r.push(t),{defaultBinding:i,agents:r}}function Oi(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),i=Array.isArray(e.caps)?e.caps:[],l=Array.isArray(e.commands)?e.commands:[];return a`
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
          ${i.slice(0,12).map(o=>a`<span class="chip">${String(o)}</span>`)}
          ${l.slice(0,8).map(o=>a`<span class="chip">${String(o)}</span>`)}
        </div>
      </div>
    </div>
  `}const Bi=["","off","minimal","low","medium","high"],Fi=["","off","on"],Ui=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],Hi=["","off","on","stream"];function ji(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function ta(e){return ji(e)==="zai"}function Wi(e){return ta(e)?Fi:Bi}function Vi(e,t){return!t||!e||e==="off"?e:"on"}function Gi(e,t){return e?t&&e==="on"?"low":e:null}function Yi(e){switch(e){case"idle-7d":return"Idle > 7 days";case"task-complete":return"Task completed";case"manual":return"Manual";default:return e}}function Ki(){return a`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
    <path d="M10 12h4"/>
  </svg>`}function qi(){return a`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 14 4 9 9 4"/>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
  </svg>`}function Ji(e){return a`<svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="transition: transform 150ms ease; transform: rotate(${e?"90deg":"0deg"});"
  >
    <polyline points="9 18 15 12 9 6"/>
  </svg>`}function Co(e){const t=e.result?.sessions??[],n=new Set(e.archivedSessions.map(l=>l.sessionKey)),s=t.filter(l=>!n.has(l.key)),i=e.archivedSessions.length;return a`
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

      ${e.error?a`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:d}

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
        ${s.length===0?a`
                <div class="muted">No active sessions found.</div>
              `:s.map(l=>Zi(l,e.basePath,e.onPatch,e.onDelete,e.onArchive,e.loading))}
      </div>
    </section>

    ${Xi(e,i)}
  `}function Xi(e,t){return t===0&&!e.archivedSessionsLoading?d:a`
    <section class="card archived-section">
      <div
        class="archived-section__header"
        @click=${e.onToggleArchived}
      >
        <div class="row" style="gap: 8px; align-items: center;">
          ${Ji(e.archivedSessionsExpanded)}
          <span class="archived-section__title">Archived</span>
          ${t>0?a`<span class="archived-badge">${t}</span>`:d}
        </div>
        <span class="archived-section__hint">
          Sessions removed from the active list
        </span>
      </div>

      ${e.archivedSessionsExpanded?a`
              <div class="archived-table" style="margin-top: 12px;">
                <div class="archived-table__head">
                  <div>Session Key</div>
                  <div>Archived</div>
                  <div>Reason</div>
                  <div>Linked Task</div>
                  <div>Actions</div>
                </div>
                ${e.archivedSessionsLoading?a`<div class="muted" style="padding: 12px;">Loading...</div>`:e.archivedSessions.length===0?a`<div class="muted" style="padding: 12px;">No archived sessions.</div>`:e.archivedSessions.map(n=>Qi(n,e.onUnarchive,e.loading))}
              </div>
            `:d}
    </section>
  `}function Zi(e,t,n,s,i,l){const o=e.updatedAt?L(e.updatedAt):"n/a",r=e.thinkingLevel??"",u=ta(e.modelProvider),v=Vi(r,u),p=Wi(e.modelProvider),g=e.verboseLevel??"",h=e.reasoningLevel??"",$=e.displayName??e.key,b=e.kind!=="global",y=b?`${Aa("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return a`
    <div class="table-row">
      <div class="mono">${b?a`<a href=${y} class="session-link">${$}</a>`:$}</div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${l}
          placeholder="(optional)"
          @change=${f=>{const w=f.target.value.trim();n(e.key,{label:w||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${o}</div>
      <div>${ti(e)}</div>
      <div>
        <select
          .value=${v}
          ?disabled=${l}
          @change=${f=>{const w=f.target.value;n(e.key,{thinkingLevel:Gi(w,u)})}}
        >
          ${p.map(f=>a`<option value=${f}>${f||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${g}
          ?disabled=${l}
          @change=${f=>{const w=f.target.value;n(e.key,{verboseLevel:w||null})}}
        >
          ${Ui.map(f=>a`<option value=${f.value}>${f.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${h}
          ?disabled=${l}
          @change=${f=>{const w=f.target.value;n(e.key,{reasoningLevel:w||null})}}
        >
          ${Hi.map(f=>a`<option value=${f}>${f||"inherit"}</option>`)}
        </select>
      </div>
      <div class="row" style="gap: 4px;">
        <button
          class="btn btn-icon"
          ?disabled=${l}
          @click=${()=>i(e.key)}
          title="Archive this session"
        >
          ${Ki()}
        </button>
        <button class="btn danger btn--sm" ?disabled=${l} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function Qi(e,t,n){const s=L(Date.parse(e.archivedAt));return a`
    <div class="archived-table__row">
      <div class="mono" style="opacity: 0.7;">${e.sessionKey}</div>
      <div>${s}</div>
      <div>${Yi(e.reason)}</div>
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
          ${qi()}
        </button>
      </div>
    </div>
  `}function To(e){const t=e.subTab==="godmode",n=t||e.subTab==="my-skills";return a`
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
        ${n?a`<button class="btn" ?disabled=${e.loading||e.godmodeSkillsLoading} @click=${e.onRefresh}>
              ${e.loading||e.godmodeSkillsLoading?"Loading…":"Refresh"}
            </button>`:d}
      </div>

      ${t?el(e):d}
      ${e.subTab==="my-skills"?al(e):d}
    </section>
  `}function el(e){const t=e.godmodeSkills,n=e.godmodeSkillsLoading,s=e.filter.trim().toLowerCase();if(n&&!t)return a`<div class="muted" style="margin-top: 16px;">Loading GodMode skills...</div>`;if(!t||t.total===0)return a`<div class="muted" style="margin-top: 16px;">No GodMode skills found.</div>`;const i=[...t.skills.map(o=>({...o,_kind:"skill"})),...t.cards.map(o=>({...o,_kind:"card"}))],l=s?i.filter(o=>[o.slug,o.name,o.body.slice(0,200)].join(" ").toLowerCase().includes(s)):i;return a`
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

    ${l.length===0?a`<div class="muted" style="margin-top: 16px;">No matches.</div>`:a`<div class="list" style="margin-top: 16px;">
          ${l.map(o=>o._kind==="skill"?tl(o,e.expandedSkills.has(o.slug),e.onToggleExpand):nl(o,e.expandedSkills.has(o.slug),e.onToggleExpand))}
        </div>`}
  `}function tl(e,t,n){const s=e.body.split(`
`).find(l=>l.trim().length>0)??"",i=!!e.schedule;return a`
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
          ${i?a`<span class="chip chip-ok" style="font-size: 11px;">scheduled</span>`:a`<span class="chip" style="font-size: 11px;">on-demand</span>`}
        </div>
        <div class="list-sub" style="margin-left: 18px;">${Fe(s,120)}</div>
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          <span class="chip chip-ok">skill</span>
          <span class="chip">${e.trigger}</span>
          ${e.schedule?a`<span class="chip">${e.schedule}</span>`:d}
          ${e.persona?a`<span class="chip">${e.persona}</span>`:d}
          <span class="chip">${e.taskType}</span>
        </div>
        ${t?a`
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
                  ${e.persona?a`
                        <span class="muted">Persona:</span>
                        <span>${e.persona}</span>
                      `:d}
                  ${e.schedule?a`
                        <span class="muted">Schedule:</span>
                        <span>${e.schedule}</span>
                      `:d}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${e.body}
                </div>
              </div>
            `:d}
      </div>
    </div>
  `}function nl(e,t,n){return a`
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
          ${e.tools.length>0?a`<span class="chip">${e.tools.length} tools</span>`:d}
        </div>
        ${t?a`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px;">
                  <span class="muted">Keywords:</span>
                  <span>${e.triggers.join(", ")}</span>
                  ${e.tools.length>0?a`
                        <span class="muted">Tools:</span>
                        <span>${e.tools.join(", ")}</span>
                      `:d}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${e.body}
                </div>
              </div>
            `:d}
      </div>
    </div>
  `}function al(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(i=>[i.name,i.description,i.source].join(" ").toLowerCase().includes(n)):t;return a`
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

    ${e.error?a`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:d}

    ${s.length===0?a`<div class="muted" style="margin-top: 16px">No integrations found.</div>`:a`<div class="list" style="margin-top: 16px;">
            ${s.map(i=>sl(i,e))}
          </div>`}
  `}function sl(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",i=t.messages[e.skillKey]??null,l=e.install.length>0&&e.missing.bins.length>0,o=[...e.missing.bins.map(u=>`bin:${u}`),...e.missing.env.map(u=>`env:${u}`),...e.missing.config.map(u=>`config:${u}`),...e.missing.os.map(u=>`os:${u}`)],r=[];return e.disabled&&r.push("disabled"),e.blockedByAllowlist&&r.push("blocked by allowlist"),a`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${Fe(e.description,140)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.source}</span>
          <span class="chip ${e.eligible?"chip-ok":"chip-warn"}">
            ${e.eligible?"eligible":"blocked"}
          </span>
          ${e.disabled?a`
                  <span class="chip chip-warn">disabled</span>
                `:d}
        </div>
        ${o.length>0?a`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${o.join(", ")}
              </div>
            `:d}
        ${r.length>0?a`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${r.join(", ")}
              </div>
            `:d}
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
          ${l?a`<button
                class="btn"
                ?disabled=${n}
                @click=${()=>t.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${n?"Installing…":e.install[0].label}
              </button>`:d}
        </div>
        ${i?a`<div
              class="muted"
              style="margin-top: 8px; color: ${i.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${i.message}
            </div>`:d}
        ${e.primaryEnv?a`
              <div class="field" style="margin-top: 10px;">
                <span>API key</span>
                <input
                  type="password"
                  .value=${s}
                  @input=${u=>t.onEdit(e.skillKey,u.target.value)}
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
            `:d}
      </div>
    </div>
  `}function il(e){switch(e){case"claude":return"chip-ok";case"codex":return"chip-warn";case"gemini":return"chip-info";default:return""}}function Eo(e){const t=e.filter.trim().toLowerCase(),n=t?e.roster.filter(l=>[l.slug,l.name,l.category,l.mission??"",...l.taskTypes].join(" ").toLowerCase().includes(t)):e.roster,s=new Map;for(const l of n){const o=l.category||"_default";s.has(o)||s.set(o,[]),s.get(o).push(l)}const i=[...s.keys()].sort((l,o)=>l==="_default"?1:o==="_default"?-1:l.localeCompare(o));return a`
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
            @input=${l=>e.onFilterChange(l.target.value)}
            placeholder="Search agents by name, category, or task type"
          />
        </label>
      </div>

      ${e.error?a`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:d}

      ${e.loading&&e.roster.length===0?a`<div class="muted" style="margin-top: 16px;">Loading agent roster...</div>`:d}

      ${!e.loading&&n.length===0?a`<div class="muted" style="margin-top: 16px;">
            ${e.roster.length===0?"No agents found. Add persona files to your agent-roster directory.":"No matches."}
          </div>`:d}

      ${i.map(l=>{const o=s.get(l),r=l==="_default"?"General":na(l);return a`
          <div style="margin-top: 20px;">
            <div
              style="font-size: 12px; font-weight: 600; text-transform: uppercase;
                     letter-spacing: 0.05em; color: var(--muted-color, #888);
                     margin-bottom: 8px; padding-left: 2px;"
            >
              ${r}
            </div>
            <div class="list">
              ${o.map(u=>ll(u,e.expandedAgents.has(u.slug),e.onToggleExpand))}
            </div>
          </div>
        `})}
    </section>
  `}function na(e){return e.replace(/[-_]/g," ").replace(/\b\w/g,t=>t.toUpperCase())}function ll(e,t,n){return a`
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
          ${e.engine?a`<span class="chip ${il(e.engine)}" style="font-size: 11px;">${e.engine}</span>`:d}
        </div>
        ${e.mission?a`<div class="list-sub" style="margin-left: 18px;">${Fe(e.mission,120)}</div>`:d}
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          ${e.taskTypes.map(s=>a`<span class="chip">${s}</span>`)}
        </div>
        ${t?a`
              <div
                style="margin-top: 12px; margin-left: 18px; padding: 12px; border-radius: 8px;
                       background: var(--card-bg, #fafafa); border: 1px solid var(--border-color, #eee);"
              >
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px; margin-bottom: 10px;">
                  <span class="muted">Slug:</span>
                  <span style="font-family: monospace;">${e.slug}</span>
                  <span class="muted">Category:</span>
                  <span>${na(e.category||"_default")}</span>
                  ${e.engine?a`
                        <span class="muted">Engine:</span>
                        <span>${e.engine}</span>
                      `:d}
                  <span class="muted">Task types:</span>
                  <span>${e.taskTypes.join(", ")||"auto"}</span>
                </div>
                ${e.body?a`
                      <div
                        style="font-size: 13px; line-height: 1.6;
                               white-space: pre-wrap; color: var(--text-color, #333);
                               max-height: 400px; overflow-y: auto;
                               padding-top: 10px; border-top: 1px solid var(--border-color, #eee);"
                      >
                        ${e.body}
                      </div>
                    `:d}
              </div>
            `:d}
      </div>
    </div>
  `}const In=["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Anchorage","Pacific/Honolulu","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Shanghai","Asia/Kolkata","Australia/Sydney","Pacific/Auckland"],ol=["Direct and concise -- no fluff, just answers","Detailed explanations -- walk me through the reasoning","Casual and conversational -- like talking to a friend","Structured with bullet points -- organized and scannable","Technical and precise -- specifics matter"],rl=[{value:"sonnet",label:"Sonnet (fast, balanced)"},{value:"opus",label:"Opus (deep reasoning)"},{value:"haiku",label:"Haiku (quick, lightweight)"}],St=["Never send emails without explicit approval","Never delete or overwrite files without backup","Always search memory before guessing","Never share private information externally"],Pn=[{label:"Name",question:"What should I call you?"},{label:"Timezone",question:"What timezone are you in?"},{label:"Focus",question:"What are you building or focused on?"},{label:"Projects",question:"What are your top projects? (1-3)"},{label:"Style",question:"How do you like to communicate?"},{label:"Rules",question:"What rules must the AI always follow?"},{label:"People",question:"Who are the key people in your work/life?"},{label:"Model",question:"What AI model do you prefer?"}];function On(e){const n=Math.min(Number(e),8);return a`
    <div class="wizard-progress">
      <div class="wizard-progress-dots">
        ${Array.from({length:8},(s,i)=>a`
          <div class="wizard-progress-dot ${i<n?"completed":""} ${i===n?"active":""}"></div>
        `)}
      </div>
      <div class="wizard-progress-text">
        ${n<8?`Step ${n+1} of 8`:"Review"}
      </div>
    </div>
  `}function cl(e){if(e>=Pn.length)return a`${d}`;const t=Pn[e];return a`
    <div class="wizard-step-header">
      <h2 class="wizard-question">${t.question}</h2>
    </div>
  `}function dl(e,t,n,s){return a`
    <div class="wizard-nav">
      ${e>0?a`
            <button
              class="wizard-btn wizard-btn--back"
              @click=${()=>t.onStepChange(e-1)}
            >Back</button>
          `:a`<div></div>`}
      <button
        class="wizard-btn wizard-btn--next ${n?"":"wizard-btn--disabled"}"
        ?disabled=${!n}
        @click=${()=>{s?(t.onStepChange(8),t.onPreview()):t.onStepChange(e+1)}}
      >${s?"Review":"Continue"}</button>
    </div>
  `}function aa(){return a`<p class="wizard-skip-hint">Press Enter to use the default and continue</p>`}function ul(e,t){function n(i){const l=i.target.value;t.onAnswerChange("name",l)}function s(i){i.key==="Enter"&&(i.preventDefault(),t.onStepChange(1))}return a`
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
  `}function pl(e,t){const n=Intl.DateTimeFormat().resolvedOptions().timeZone;return a`
    <div class="wizard-field">
      <div class="wizard-detected">
        Detected: <strong>${n}</strong>
      </div>
      <select
        class="wizard-select"
        .value=${e.timezone||n}
        @change=${s=>{t.onAnswerChange("timezone",s.target.value)}}
      >
        ${In.includes(n)?d:a`<option value="${n}">${n} (detected)</option>`}
        ${In.map(s=>a`
            <option value="${s}" ?selected=${(e.timezone||n)===s}>
              ${s}${s===n?" (detected)":""}
            </option>
          `)}
      </select>
      ${aa()}
    </div>
  `}function vl(e,t){function n(i){t.onAnswerChange("focus",i.target.value)}function s(i){i.key==="Enter"&&(i.preventDefault(),t.onStepChange(3))}return a`
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
  `}function gl(e,t){function n(){const l=document.querySelector(".wizard-project-input");if(!l)return;const o=l.value.trim();o&&e.projects.length<5&&(t.onAnswerChange("projects",[...e.projects,o]),l.value="",l.focus())}function s(l){const o=e.projects.filter((r,u)=>u!==l);t.onAnswerChange("projects",o)}function i(l){l.key==="Enter"&&(l.preventDefault(),l.target.value.trim()?n():e.projects.length>0&&t.onStepChange(4))}return a`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.projects.map((l,o)=>a`
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
        <button class="wizard-btn wizard-btn--small" @click=${n}>Add</button>
      </div>
      ${e.projects.length===0?a`<p class="wizard-hint">Add 1-3 projects, or skip to continue</p>`:d}
    </div>
  `}function fl(e,t){return a`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${ol.map(n=>a`
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
  `}function hl(e,t){const n=e.hardRules.length>0?e.hardRules:[];function s(o){n.includes(o)?t.onAnswerChange("hardRules",n.filter(r=>r!==o)):t.onAnswerChange("hardRules",[...n,o])}function i(){const o=document.querySelector(".wizard-rule-input");if(!o)return;const r=o.value.trim();r&&(t.onAnswerChange("hardRules",[...n,r]),o.value="",o.focus())}function l(o){o.key==="Enter"&&(o.preventDefault(),o.target.value.trim()&&i())}return a`
    <div class="wizard-field">
      <p class="wizard-hint">Select common rules or add your own:</p>
      <div class="wizard-checkbox-list">
        ${St.map(o=>a`
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
          @keydown=${l}
        />
        <button class="wizard-btn wizard-btn--small" @click=${i}>Add</button>
      </div>
      ${n.filter(o=>!St.includes(o)).length>0?a`
            <div class="wizard-tag-list" style="margin-top: 8px;">
              ${n.filter(o=>!St.includes(o)).map(o=>a`
                    <span class="wizard-tag">
                      ${o}
                      <button class="wizard-tag-remove" @click=${()=>{t.onAnswerChange("hardRules",n.filter(r=>r!==o))}}>x</button>
                    </span>
                  `)}
            </div>
          `:d}
    </div>
  `}function ml(e,t){function n(){const l=document.querySelector(".wizard-person-input");if(!l)return;const o=l.value.trim();o&&e.keyPeople.length<10&&(t.onAnswerChange("keyPeople",[...e.keyPeople,o]),l.value="",l.focus())}function s(l){t.onAnswerChange("keyPeople",e.keyPeople.filter((o,r)=>r!==l))}function i(l){l.key==="Enter"&&(l.preventDefault(),l.target.value.trim()?n():e.keyPeople.length>0&&t.onStepChange(7))}return a`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.keyPeople.map((l,o)=>a`
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
        <button class="wizard-btn wizard-btn--small" @click=${n}>Add</button>
      </div>
      <p class="wizard-hint">Co-founders, family, key collaborators. You can add more later.</p>
    </div>
  `}function bl(e,t){return a`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${rl.map(n=>a`
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
      ${aa()}
    </div>
  `}function Ct(e){return e==null?"not set":typeof e=="string"?e:typeof e=="boolean"||typeof e=="number"?String(e):(Array.isArray(e),JSON.stringify(e))}function yl(e,t){const{answers:n,preview:s,diff:i,fileSelections:l,configSelections:o,generating:r}=e,u=s?.some(p=>p.exists)??!1,v=i&&(i.changes.length>0||i.additions.length>0);return a`
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

        ${n.projects.length>0?a`
              <div class="wizard-review-section">
                <h3>Projects</h3>
                ${n.projects.map(p=>a`<div class="wizard-review-item">${p}</div>`)}
              </div>
            `:d}

        ${n.keyPeople.length>0?a`
              <div class="wizard-review-section">
                <h3>Key People</h3>
                ${n.keyPeople.map(p=>a`<div class="wizard-review-item">${p}</div>`)}
              </div>
            `:d}

        ${n.hardRules.length>0?a`
              <div class="wizard-review-section">
                <h3>AI Rules</h3>
                ${n.hardRules.map(p=>a`<div class="wizard-review-item">${p}</div>`)}
              </div>
            `:d}
      </div>

      ${s&&s.length>0?a`
            <div class="wizard-review-section wizard-review-files">
              <h3>Workspace Files</h3>
              ${u?a`<p class="wizard-hint">Some files already exist. Uncheck to keep your existing version.</p>`:d}
              <div class="wizard-file-list">
                ${s.map(p=>{const g=l[p.path]??p.wouldCreate;return a`
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
          `:d}

      ${v?a`
            <div class="wizard-review-section wizard-review-config">
              <h3>Config Changes</h3>

              ${i.additions.length>0?a`
                    <div class="wizard-config-group">
                      <h4>New settings</h4>
                      ${i.additions.map(p=>{const g=o[p.path]??!0;return a`
                          <label class="wizard-config-item">
                            <input
                              type="checkbox"
                              ?checked=${g}
                              @change=${h=>t.onConfigToggle(p.path,h.target.checked)}
                            />
                            <span class="wizard-config-path">${p.path}</span>
                            <span class="wizard-config-value">${Ct(p.recommended)}</span>
                          </label>
                        `})}
                    </div>
                  `:d}

              ${i.changes.length>0?a`
                    <div class="wizard-config-group">
                      <h4>Changed settings</h4>
                      <p class="wizard-hint">These differ from your current config. Check to update.</p>
                      ${i.changes.map(p=>{const g=o[p.path]??!1;return a`
                          <label class="wizard-config-item wizard-config-item--change">
                            <input
                              type="checkbox"
                              ?checked=${g}
                              @change=${h=>t.onConfigToggle(p.path,h.target.checked)}
                            />
                            <span class="wizard-config-path">${p.path}</span>
                            <span class="wizard-config-diff">
                              <span class="wizard-config-current">${Ct(p.current)}</span>
                              <span class="wizard-config-arrow">&rarr;</span>
                              <span class="wizard-config-recommended">${Ct(p.recommended)}</span>
                            </span>
                          </label>
                        `})}
                    </div>
                  `:d}

              ${i.matching.length>0?a`<p class="wizard-hint">${i.matching.length} settings already match GodMode's recommendations.</p>`:d}
            </div>
          `:a`<p class="wizard-hint">OC config will be patched with optimal memory/agent settings.</p>`}

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

      ${e.error?a`<div class="wizard-error">${e.error}</div>`:d}
    </div>
  `}function $l(e,t){const n=e.result;return n?a`
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
  `:a`${d}`}function sa(){return{name:"",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,focus:"",projects:[],commStyle:"Direct and concise -- no fluff, just answers",hardRules:[],keyPeople:[],defaultModel:"sonnet"}}function wl(){return{step:0,answers:sa(),preview:null,diff:null,fileSelections:{},configSelections:{},generating:!1,result:null,error:null}}function xl(e,t){const{step:n,answers:s}=e;if(n===9)return a`
      <div class="wizard-fullscreen">
        ${$l(e,t)}
      </div>
    `;if(n===8)return a`
      <div class="wizard-fullscreen">
        <div class="wizard-container">
          ${On(n)}
          ${yl(e,t)}
        </div>
      </div>
    `;const i=(()=>{switch(n){case 0:return s.name.trim().length>0;case 1:return!0;case 2:return!0;case 3:return!0;case 4:return s.commStyle.trim().length>0;case 5:return!0;case 6:return!0;case 7:return!0;default:return!1}})(),l=n===7,o=(()=>{switch(n){case 0:return ul(s,t);case 1:return pl(s,t);case 2:return vl(s,t);case 3:return gl(s,t);case 4:return fl(s,t);case 5:return hl(s,t);case 6:return ml(s,t);case 7:return bl(s,t);default:return a`${d}`}})();return a`
    <div class="wizard-fullscreen">
      <div class="wizard-container">
        <div class="wizard-glow"></div>
        ${On(n)}
        ${cl(n)}
        ${o}
        ${dl(n,t,i,l)}
      </div>
    </div>
  `}const Mo=Object.freeze(Object.defineProperty({__proto__:null,emptyWizardAnswers:sa,emptyWizardState:wl,renderOnboardingWizard:xl},Symbol.toStringTag,{value:"Module"}));function Se(e){return e===null?"none":e>=8?"high":e>=5?"medium":"low"}function He(e){return{high:"trust-score--high",medium:"trust-score--medium",low:"trust-score--low",none:"trust-score--none"}[e]}function kl(e){return{improving:"Improving",declining:"Declining",stable:"Stable",new:"New"}[e]??"New"}function Al(e){return{improving:"trust-trend--up",declining:"trust-trend--down",stable:"trust-trend--stable",new:"trust-trend--new"}[e]??"trust-trend--new"}function _l(e){return{improving:"↑",declining:"↓",stable:"→",new:"•"}[e]??"•"}function Sl(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const i=Math.floor(s/24);return i<7?`${i}d ago`:new Date(e).toLocaleDateString()}function Cl(e){const t=e.overallScore,n=Se(t);return a`
    <div class="trust-overall">
      <div class="trust-overall-score ${He(n)}">
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
  `}function Tl(e,t){const s=Math.min(100,Math.max(0,(e??t)/10*100)),i=Se(e??(t>0?t:null));return a`
    <div class="trust-progress">
      <div
        class="trust-progress-fill ${He(i)}"
        style="width: ${s}%"
      ></div>
    </div>
  `}function El(e,t){const s=e.trustScore!==null?e.trustScore.toFixed(1):e.avgRating>0?e.avgRating.toFixed(1):"--",i=Se(e.trustScore??(e.avgRating>0?e.avgRating:null)),l=e.count<10?10-e.count:0;return a`
    <div class="trust-card">
      <div class="trust-card-header">
        <span class="trust-card-name">${e.workflow}</span>
        ${t?a`<button
              class="trust-card-remove"
              title="Remove workflow"
              @click=${()=>t(e.workflow)}
            >&times;</button>`:d}
      </div>

      <div class="trust-card-score-row">
        <span class="trust-card-score ${He(i)}">${s}</span>
        <span class="trust-card-score-label">/10</span>
        <span class="trust-trend ${Al(e.trend)}">
          ${_l(e.trend)} ${kl(e.trend)}
        </span>
      </div>

      ${Tl(e.trustScore,e.avgRating)}

      <div class="trust-card-meta">
        <span class="trust-card-count">${e.count} rating${e.count!==1?"s":""}</span>
        ${l>0?a`<span class="trust-card-pending">${l} more until trust score</span>`:d}
        ${e.needsFeedback?a`<span class="trust-card-needs-feedback">Needs improvement</span>`:d}
      </div>

      ${e.recentFeedback.length>0?a`
            <div class="trust-card-feedback">
              <span class="trust-card-feedback-label">Feedback applied:</span>
              ${e.recentFeedback.map(o=>a`<span class="trust-card-feedback-item">${o}</span>`)}
            </div>
          `:d}
    </div>
  `}function Ml(){return[{workflow:"Code Reviews",avgRating:8.2,count:14,trustScore:8.2,needsFeedback:!1,trend:"improving",recentNotes:[],recentFeedback:[]},{workflow:"Email Drafts",avgRating:6.5,count:11,trustScore:6.5,needsFeedback:!0,trend:"stable",recentNotes:[],recentFeedback:["Be more concise","Match my tone"]},{workflow:"Research",avgRating:7.8,count:3,trustScore:null,needsFeedback:!1,trend:"new",recentNotes:[],recentFeedback:[]}]}function Ll(){const e=Ml();return{workflows:e.map(t=>t.workflow),summaries:e,ratings:[],total:0,overallScore:7.6,totalRatings:28,totalUses:28}}function Rl(e){const t=Se(e.rating);return a`
    <div class="trust-rating-row">
      <span class="trust-rating-score ${He(t)}">${e.rating}</span>
      <span class="trust-rating-workflow">${e.workflow}</span>
      ${e.note?a`<span class="trust-rating-note">${e.note}</span>`:d}
      <span class="trust-rating-time">${Sl(e.timestamp)}</span>
    </div>
  `}function Nl(){return a`
    <div class="trust-sample-banner">
      Sample data — use skills and rate them to build your real trust profile.
    </div>
  `}function Dl(e){const t=e.connected,n=e.guardrailsData,s=e.consciousnessStatus,i=e.data?.todayRating??null,l=e.updateStatus??null,o=l?.openclawUpdateAvailable||l?.pluginUpdateAvailable;if(!t)return{level:"alert",icon:"⚠️",text:"Gateway disconnected",detail:"Reconnect to restore full functionality."};if(o){const u=[];return l.openclawUpdateAvailable&&l.openclawLatest&&u.push(`OpenClaw ${l.openclawVersion} → ${l.openclawLatest}`),l.pluginUpdateAvailable&&l.pluginLatest&&u.push(`GodMode ${l.pluginVersion} → ${l.pluginLatest}`),{level:"warn",icon:"🔄",text:"Update available",detail:u.join(", ")+". Visit Overview to update."}}if(s==="error")return{level:"warn",icon:"🧠",text:"Consciousness sync needs attention",detail:"Your system is running but the last sync encountered an error."};if(n){const u=n.gates.filter(p=>p.enabled).length,v=n.gates.length;if(u<v)return{level:"warn",icon:"🛡",text:`${v-u} security gate${v-u!==1?"s":""} disabled`,detail:"Your system is running with reduced safety coverage."}}const r=l&&!o?" Up to date.":"";return i?i.rating>=8?{level:"ok",icon:"✨",text:`Rated ${i.rating}/10 today — GodMode is running great.`,detail:`All systems secure and building trust daily.${r}`}:i.rating>=5?{level:"ok",icon:"💪",text:`Rated ${i.rating}/10 today — working to improve.`,detail:`Your feedback is being applied. All systems secure.${r}`}:{level:"warn",icon:"💬",text:`Rated ${i.rating}/10 today — your feedback matters.`,detail:`We're using your input to get better. All systems secure.${r}`}:{level:"ok",icon:"✅",text:"Your GodMode is safe, secure, and building trust daily.",detail:`All systems healthy.${r} Rate your day below to help improve.`}}function zl(e){const{level:t,icon:n,text:s,detail:i}=Dl(e);return a`
    <div class="trust-hero trust-hero--${t}">
      <span class="trust-hero-icon">${n}</span>
      <div class="trust-hero-body">
        <div class="trust-hero-text">${s}</div>
        <div class="trust-hero-detail">${i}</div>
      </div>
    </div>
  `}function Il(e){return e<=4?"trust-daily-button--low":e<=7?"trust-daily-button--med":"trust-daily-button--high"}function Bn(e){const t=[];for(let n=0;n<7;n++)t.push(e[n]??null);return a`
    <div class="trust-daily-trend">
      ${t.map(n=>{if(!n)return a`<div class="trust-daily-trend-dot trust-daily-trend-dot--empty"></div>`;const s=Math.max(4,n.rating/10*28),i=Se(n.rating);return a`
          <div
            class="trust-daily-trend-dot trust-daily-trend-dot--${i==="none"?"medium":i}"
            style="height: ${s}px"
            title="${n.date}: ${n.rating}/10"
          ></div>
        `})}
    </div>
  `}function Pl(e){const t=e.data,n=t?.todayRating??null,s=t?.recentDaily??[],i=t?.dailyStreak??0,l=t?.dailyAverage??null;if(!e.onDailyRate)return d;if(n){const o=Se(n.rating),r=n.rating<7&&!n.note;return a`
      <div class="trust-daily">
        <div class="trust-daily-header">
          <span class="trust-daily-prompt">Today's Rating</span>
          ${i>1?a`<span class="trust-daily-streak">${i} day streak</span>`:d}
        </div>
        <div class="trust-daily-result">
          <div class="trust-daily-result-score ${He(o)}">
            ${n.rating}<span class="trust-daily-result-max">/10</span>
          </div>
          <div class="trust-daily-result-meta">
            <span class="trust-daily-result-label">
              ${n.rating>=8?"Great day!":n.rating>=5?"Good, working to improve":"Thanks for the honesty"}
            </span>
            ${n.note?a`<span class="trust-daily-result-note">"${n.note}"</span>`:d}
            ${l!==null?a`<span class="trust-daily-result-note">7-day avg: ${l}/10</span>`:d}
          </div>
          ${s.length>1?Bn(s):d}
        </div>
        ${r?a`
              <div class="trust-daily-feedback">
                <input
                  class="trust-daily-feedback-input"
                  type="text"
                  placeholder="What could be better?"
                  @keydown=${u=>{if(u.key==="Enter"){const v=u.target,p=v.value.trim();p&&e.onDailyRate&&(e.onDailyRate(n.rating,p),v.value="")}}}
                />
                <button
                  class="trust-daily-feedback-submit"
                  type="button"
                  @click=${u=>{const p=u.target.previousElementSibling,g=p?.value?.trim();g&&e.onDailyRate&&(e.onDailyRate(n.rating,g),p.value="")}}
                >Send</button>
              </div>
            `:d}
      </div>
    `}return a`
    <div class="trust-daily">
      <div class="trust-daily-header">
        <span class="trust-daily-prompt">How happy were you with GodMode today?</span>
        ${i>0?a`<span class="trust-daily-streak">${i} day streak</span>`:d}
      </div>
      <div class="trust-daily-buttons">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>a`
            <button
              class="trust-daily-button ${Il(o)}"
              type="button"
              title="${o}/10"
              @click=${()=>e.onDailyRate(o)}
            >${o}</button>
          `)}
      </div>
      ${s.length>0?a`
            <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              ${Bn(s)}
              ${l!==null?a`<span style="font-size: 0.75rem; color: var(--text-muted);">7-day avg: ${l}/10</span>`:d}
            </div>
          `:d}
    </div>
  `}function Ol(e){if(!e)return a`
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
    `;const t=e.gates,n=t.filter(p=>p.enabled).length,s=t.length,i=n===s,l=Date.now()-864e5,o=e.activity.filter(p=>Date.parse(p.timestamp)>l),r=o.filter(p=>p.action==="blocked").length,u=o.filter(p=>p.action==="fired").length,v=i?"trust-health-card-badge--ok":n>0?"trust-health-card-badge--warn":"trust-health-card-badge--error";return a`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F6E1}</span>
        Security
        <span class="trust-health-card-badge ${v}">
          ${n}/${s} Active
        </span>
      </div>

      <div class="trust-health-gate-list">
        ${t.map(p=>a`
            <div class="trust-health-gate ${p.enabled?"":"trust-health-gate--disabled"}">
              <span class="trust-health-dot ${p.enabled?"trust-health-dot--ok":"trust-health-dot--idle"}"></span>
              <span class="trust-health-gate-icon">${p.icon}</span>
              <span class="trust-health-gate-name">${p.name}</span>
            </div>
          `)}
      </div>

      ${o.length>0?a`
            <div class="trust-health-activity">
              <span class="trust-health-activity-count">${o.length}</span>
              event${o.length!==1?"s":""} in last 24h
              ${r>0?a` &middot; <span class="trust-health-activity-count">${r}</span> blocked`:d}
              ${u>0?a` &middot; <span class="trust-health-activity-count">${u}</span> fired`:d}
            </div>
          `:a`
            <div class="trust-health-activity">No activity in last 24h</div>
          `}
    </div>
  `}function Bl(e){return!e||e==="idle"?"Idle":e==="loading"?"Syncing...":e==="ok"?"Synced":"Error"}function Fl(e){return!e||e==="idle"?"trust-health-dot--idle":e==="loading"?"trust-health-dot--warn":e==="ok"?"trust-health-dot--ok":"trust-health-dot--error"}function Ul(e){const t=e.connected,n=e.consciousnessStatus,s=e.sessionsCount,i=e.gatewayUptimeMs,r=(t?1:0)+(n==="ok"||n==="idle"?1:0)===2&&t;return a`
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
        <span class="trust-health-dot ${Fl(n)}"></span>
        <span class="trust-health-label">Consciousness</span>
        <span class="trust-health-value">${Bl(n)}</span>
      </div>

      ${s!=null?a`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Sessions</span>
              <span class="trust-health-value">${s} active</span>
            </div>
          `:d}

      ${i!=null?a`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Uptime</span>
              <span class="trust-health-value">${jn(i)}</span>
            </div>
          `:d}
    </div>
  `}function Hl(e){return a`
    <div class="trust-health">
      <h3 class="trust-health-title">System Health</h3>
      <div class="trust-health-grid">
        ${Ol(e.guardrailsData)}
        ${Ul(e)}
      </div>
    </div>
  `}function Lo(e){const{connected:t,loading:n,data:s,onRemoveWorkflow:i,onRefresh:l}=e;if(!t)return a`
      <section class="tab-body trust-section">
        <div class="trust-disconnected">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return a`
      <section class="tab-body trust-section">
        <div class="trust-loading">Loading trust tracker...</div>
      </section>
    `;const r=!(s?.summaries??[]).some(g=>g.count>0),u=r?Ll():s,v=u.summaries,p=r?[]:s?.ratings??[];return a`
    <section class="tab-body trust-section">
      ${zl(e)}

      ${r?Nl():d}

      ${Pl(e)}

      ${Cl(u)}

      <div class="trust-workflows-grid">
        ${v.map(g=>El(g,r?null:i))}
      </div>

      ${Hl(e)}

      ${p.length>0?a`
            <div class="trust-history">
              <h3 class="trust-history-title">Recent Ratings</h3>
              <div class="trust-history-list">
                ${p.slice(0,20).map(Rl)}
              </div>
            </div>
          `:d}
    </section>
  `}function jl(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const i=Math.floor(s/24);return i<7?`${i}d ago`:new Date(e).toLocaleDateString()}function Wl(e){return{fired:"guardrails-badge--fired",blocked:"guardrails-badge--blocked",cleaned:"guardrails-badge--cleaned"}[e]??""}function ia(e,t){return a`
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
  `}function Vl(e,t,n,s){const i=e.thresholds?.[t]??0;return a`
    <div class="guardrails-threshold">
      <label class="guardrails-threshold-label">${n}</label>
      <input
        class="guardrails-threshold-input"
        type="number"
        min="1"
        .value=${String(i)}
        ?disabled=${!e.enabled}
        @change=${l=>{const o=Number(l.target.value);!Number.isNaN(o)&&o>0&&s(e.id,t,o)}}
      />
    </div>
  `}function Gl(e,t,n){const s=e.thresholdLabels?Object.keys(e.thresholdLabels):[];return a`
    <div class="guardrails-card card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${e.icon}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook">${e.hook}</span>
        </div>
        ${ia(e.enabled,()=>t(e.id,!e.enabled))}
      </div>
      <div class="guardrails-card-description">${e.description}</div>
      ${s.length>0?a`
            <div class="guardrails-thresholds">
              ${s.map(i=>Vl(e,i,e.thresholdLabels[i],n))}
            </div>
          `:d}
    </div>
  `}function Yl(e,t,n){const s=e.action==="redirect"?"↪":"🚫",i=e.action==="redirect"?"redirect":"block";return a`
    <div class="guardrails-card card guardrails-custom-card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${s}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook guardrails-action-tag guardrails-action-tag--${i}">${i}</span>
        </div>
        <div class="guardrails-custom-actions">
          ${ia(e.enabled,()=>t(e.id,!e.enabled))}
          <button class="guardrails-delete-btn" title="Delete rule" @click=${()=>n(e.id)}>&times;</button>
        </div>
      </div>
      <div class="guardrails-card-description">${e.message}</div>
      <div class="guardrails-custom-meta">
        <span class="guardrails-custom-tool">${e.trigger.tool}</span>
        ${e.trigger.patterns.map(l=>a`<span class="guardrails-pattern-tag">${l}</span>`)}
      </div>
    </div>
  `}function Kl(e){return a`
    <div class="guardrails-activity-row">
      <span class="guardrails-badge ${Wl(e.action)}">${e.action}</span>
      <span class="guardrails-activity-gate">${e.gateId}</span>
      <span class="guardrails-activity-detail">${e.detail}</span>
      <span class="guardrails-activity-time">${jl(e.timestamp)}</span>
    </div>
  `}function Ro(e){const{connected:t,loading:n,data:s,onToggle:i,onThresholdChange:l,onCustomToggle:o,onCustomDelete:r,onToggleAddForm:u,onOpenAllyChat:v}=e;if(!t)return a`
      <section class="tab-body guardrails-section">
        <div class="guardrails-empty">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return a`
      <section class="tab-body guardrails-section">
        <div class="guardrails-loading">Loading guardrails...</div>
      </section>
    `;const p=s?.gates??[],g=s?.activity??[],h=s?.custom??[],$=p.filter(f=>f.enabled).length,b=h.filter(f=>f.enabled).length,y=[`${$}/${p.length} gates active`];return h.length>0&&y.push(`${b} custom rule${h.length===1?"":"s"}`),a`
    <section class="tab-body guardrails-section">
      <div class="guardrails-two-col">
        <div class="guardrails-left">
          <h2 class="guardrails-col-heading">Safety Gates</h2>
          <p class="guardrails-col-subtitle">${$}/${p.length} active — prevent runaway loops, bad searches, and lazy responses.</p>
          <div class="guardrails-grid">
            ${p.map(f=>Gl(f,i,l))}
          </div>
        </div>

        <div class="guardrails-right">
          <h2 class="guardrails-col-heading">Custom Rules & Activity</h2>
          <p class="guardrails-col-subtitle">Your rules${h.length>0?` (${b} active)`:""} and recent gate events.</p>

          <div class="guardrails-custom-section">
            <div class="guardrails-custom-header">
              <h3 class="guardrails-custom-title">Custom Rules</h3>
              <button class="guardrails-add-btn" @click=${()=>{v?v("Create a new guardrail rule: "):u()}}>+ Add Rule</button>
            </div>

            ${h.length>0?a`
                  <div class="guardrails-custom-grid">
                    ${h.map(f=>Yl(f,o,r))}
                  </div>
                `:a`
                  <div class="guardrails-custom-empty">
                    No custom rules yet. Click "+ Add Rule" to tell your ally what to block or redirect.
                  </div>
                `}
          </div>

          <div class="guardrails-history">
            <h3 class="guardrails-history-title">Recent Activity</h3>
            ${g.length>0?a`
                  <div class="guardrails-history-list">
                    ${g.slice(0,30).map(Kl)}
                  </div>
                `:a`<div class="guardrails-no-activity">No gate activity recorded yet.</div>`}
          </div>
        </div>
      </div>
    </section>
  `}const ql=/(^~\/|^\/|^\.\.?\/|[\\/])/;function Fn(e){const t=e.trim();if(!t)return null;const n=t.replace(/^["']|["']$/g,"").trim();return!n||/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/[*?<>|]/.test(n)||n.includes("\0")||n.includes(`
`)||n.includes("\r")||!ql.test(n)&&!/\.[a-z0-9]{1,12}$/i.test(n)?null:n}function Jl(e){const t=e instanceof Element?e:e instanceof Node?e.parentElement:null;if(!t)return null;const n=t.closest("a");if(n){const i=n.getAttribute("href")??"";let l=i;if(i.includes("%"))try{l=decodeURIComponent(i)}catch{l=i}return Fn(l)}const s=t.closest("code");return!s||s.closest("pre")?null:Fn(s.textContent??"")}function Xl(e){const n=new DOMParser().parseFromString(`<div>${e}</div>`,"text/html").body.firstElementChild;if(!n)return"";const i=X(n,{listDepth:0,orderedIndex:[]});return Ql(i)}function It(e,t){if(e.nodeType===Node.TEXT_NODE)return e.textContent??"";if(e.nodeType!==Node.ELEMENT_NODE)return"";const n=e;switch(n.tagName.toLowerCase()){case"h1":return`# ${ne(n,t)}

`;case"h2":return`## ${ne(n,t)}

`;case"h3":return`### ${ne(n,t)}

`;case"h4":return`#### ${ne(n,t)}

`;case"h5":return`##### ${ne(n,t)}

`;case"h6":return`###### ${ne(n,t)}

`;case"p":return`${X(n,t)}

`;case"br":return`
`;case"hr":return`---

`;case"strong":case"b":return`**${X(n,t)}**`;case"em":case"i":return`*${X(n,t)}*`;case"del":return`~~${X(n,t)}~~`;case"a":{const i=n.getAttribute("href")??"",l=X(n,t);return!i||i===l?l:`[${l}](${i})`}case"code":return n.parentElement?.tagName.toLowerCase()==="pre"?n.textContent??"":`\`${n.textContent??""}\``;case"pre":{const i=n.querySelector("code"),l=i?i.textContent??"":n.textContent??"",o=i?.className.match(/language-(\S+)/);return`\`\`\`${o?o[1]:""}
${l}
\`\`\`

`}case"blockquote":return X(n,t).trim().split(`
`).map(o=>`> ${o}`).join(`
`)+`

`;case"ul":return Un(n,t,!1);case"ol":return Un(n,t,!0);case"li":return la(n,t);case"input":return n.getAttribute("type")==="checkbox"?n.checked?"[x]":"[ ]":"";case"table":return Zl(n,t);case"div":case"span":case"section":case"article":case"main":case"header":case"footer":case"nav":case"aside":case"figure":case"figcaption":case"details":case"summary":return X(n,t);default:return X(n,t)}}function X(e,t){let n="";for(const s of Array.from(e.childNodes))n+=It(s,t);return n}function ne(e,t){return X(e,t).replace(/\n+/g," ").trim()}function Un(e,t,n){const s=Array.from(e.children).filter(o=>o.tagName.toLowerCase()==="li"),i="  ".repeat(t.listDepth);let l="";for(let o=0;o<s.length;o++){const r=s[o],u={listDepth:t.listDepth+1,orderedIndex:[...t.orderedIndex,o+1]},v=n?`${o+1}. `:"- ",p=la(r,u);l+=`${i}${v}${p}
`}return t.listDepth===0&&(l+=`
`),l}function la(e,t){let n="";for(const s of Array.from(e.childNodes)){const i=s.tagName?.toLowerCase();i==="ul"||i==="ol"?n+=`
`+It(s,t):n+=It(s,t)}return n.trim()}function Zl(e,t){const n=[],s=e.querySelector("thead tr"),i=e.querySelectorAll("tbody tr");if(s){const v=Array.from(s.querySelectorAll("th, td")).map(p=>ne(p,t));n.push(v)}for(const v of Array.from(i)){const p=Array.from(v.querySelectorAll("td, th")).map(g=>ne(g,t));n.push(p)}if(n.length===0){const v=e.querySelectorAll("tr");for(const p of Array.from(v)){const g=Array.from(p.querySelectorAll("td, th")).map(h=>ne(h,t));n.push(g)}}if(n.length===0)return"";const l=Math.max(...n.map(v=>v.length)),o=[];for(let v=0;v<l;v++)o[v]=Math.max(3,...n.map(p=>(p[v]??"").length));let r="";const u=v=>`| ${o.map((g,h)=>(v[h]??"").padEnd(g)).join(" | ")} |`;r+=u(n[0])+`
`,r+=`| ${o.map(v=>"-".repeat(v)).join(" | ")} |
`;for(let v=1;v<n.length;v++)r+=u(n[v])+`
`;return r+`
`}function Ql(e){let t=e;return t=t.replace(/\u00a0/g," "),t=t.replace(/\n{3,}/g,`

`),t=t.trim(),t&&!t.endsWith(`
`)&&(t+=`
`),t}function eo(e){return e.includes(`
`)&&e.indexOf(`
`)<e.length-1?e:e.replace(/\\n/g,`
`)}function to(e){const t=new Date(e),s=new Date().getTime()-t.getTime(),i=Math.floor(s/(1e3*60));if(i<1)return"Just now";if(i<60)return`${i}m ago`;const l=Math.floor(i/60);return l<24?`${l}h ago`:t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}function no(e){const t="VAULT",n=encodeURIComponent(`01-Daily/${e}`);return`obsidian://open?vault=${t}&file=${n}`}let Oe=null,_e=null;function Hn(e,t,n=1500){Oe&&clearTimeout(Oe),Oe=setTimeout(()=>{e!==_e&&(_e=e,t(e))},n)}function ao(e,t){Oe&&clearTimeout(Oe),e!==_e&&(_e=e,t(e))}function Tt(e){for(const t of e.querySelectorAll('input[type="checkbox"]')){const n=t;n.checked?n.setAttribute("checked",""):n.removeAttribute("checked")}return Xl(e.innerHTML)}function No(e){const{data:t,loading:n,error:s,onRefresh:i,onGenerate:l,onOpenInObsidian:o,onSaveBrief:r,onToggleCheckbox:u,onOpenFile:v}=e;if(n)return a`
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
    `;if(s)return a`
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
            ${i?a`<button class="retry-button" @click=${i}>Retry</button>`:d}
          </div>
        </div>
      </div>
    `;if(!t||!t.content)return a`
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
            ${l?a`<button class="brief-generate-btn" @click=${l}>Generate Brief Now</button>`:i?a`<button class="brief-generate-btn" @click=${i}>Generate Brief Now</button>`:d}
            <span class="empty-hint" style="margin-top: 8px; font-size: 12px;">Briefs auto-generate at 5:00 AM when configured.</span>
          </div>
        </div>
      </div>
    `;_e===null&&(_e=t.content);const p=f=>{const w=f.currentTarget;if(r){const S=Tt(w);Hn(S,r)}},g=f=>{if((f.ctrlKey||f.metaKey)&&f.key==="s"){f.preventDefault();const w=f.currentTarget;if(r){const S=Tt(w);ao(S,r)}}if((f.ctrlKey||f.metaKey)&&f.key==="l"){f.preventDefault();const w=window.getSelection();if(!w||w.rangeCount===0)return;const S=w.focusNode,T=S instanceof HTMLElement?S.closest("li"):S?.parentElement?.closest("li");if(T){const k=T.querySelector('input[type="checkbox"]');if(k)k.nextSibling?.nodeType===Node.TEXT_NODE&&k.nextSibling.textContent===" "&&k.nextSibling.remove(),k.remove();else{const M=document.createElement("input");M.type="checkbox",T.insertBefore(document.createTextNode(" "),T.firstChild),T.insertBefore(M,T.firstChild)}const _=f.currentTarget;if(r){const M=Tt(_);Hn(M,r)}}}if(f.key==="Enter"&&!f.shiftKey){const w=window.getSelection();if(!w||w.rangeCount===0)return;const S=w.focusNode,T=S instanceof HTMLElement?S.closest("li"):S?.parentElement?.closest("li");T&&T.querySelector('input[type="checkbox"]')&&setTimeout(()=>{const k=window.getSelection();if(!k||k.rangeCount===0)return;const _=k.focusNode,M=_ instanceof HTMLElement?_.closest("li"):_?.parentElement?.closest("li");if(M&&M!==T&&!M.querySelector('input[type="checkbox"]')){const C=document.createElement("input");C.type="checkbox",M.insertBefore(C,M.firstChild),M.insertBefore(document.createTextNode(" "),C.nextSibling);const ce=document.createRange();ce.setStartAfter(C.nextSibling),ce.collapse(!0),k.removeAllRanges(),k.addRange(ce)}},0)}},h=f=>{const w=f.target;if(w.tagName==="INPUT"&&w.getAttribute("type")==="checkbox"){const k=w,_=f.currentTarget;if(u&&_){const C=Array.from(_.querySelectorAll('input[type="checkbox"]')).indexOf(k);C>=0&&u(C,k.checked)}return}const S=Jl(f.target);if(S&&v){f.preventDefault(),v(S);return}const T=w.closest?.("a")??w.parentElement?.closest("a");if(T){const k=T.getAttribute("href")??"";/^https?:\/\//i.test(k)&&(f.preventDefault(),window.open(k,"_blank","noopener,noreferrer"))}},$=es(eo(t.content)),b=t.summary.readiness!=null?a`<span class="brief-readiness" title="Readiness Score${t.summary.readinessMode?` — ${t.summary.readinessMode}`:""}">
        <span class="readiness-score">${t.summary.readiness}</span>
        <span class="readiness-label">Readiness</span>
      </span>`:d,y=t.summary.tasks.total>0?a`<span class="brief-task-progress" title="${t.summary.tasks.completed}/${t.summary.tasks.total} tasks done">
        ${t.summary.tasks.completed}/${t.summary.tasks.total}
      </span>`:d;return a`
    <div class="my-day-card brief-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83D\uDCCA</span>
          <span>DAILY BRIEF</span>
          ${b}
          ${y}
        </div>
        <div class="brief-header-actions">
          <span class="brief-updated">${to(t.updatedAt)}</span>
          ${o?a`
                <a
                  href="${no(t.date)}"
                  class="brief-obsidian-link"
                  title="Open in Obsidian"
                  @click=${f=>{f.preventDefault(),o()}}
                >
                  <span class="obsidian-icon">\uD83D\uDCD3</span>
                </a>
              `:d}
          ${i?a`
                <button class="brief-refresh-btn" @click=${i} title="Refresh">
                  \uD83D\uDD04
                </button>
              `:d}
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
          >${$a($)}</div>
        </div>
      </div>
    </div>
  `}export{No as A,bo as B,Mo as C,uo as E,co as P,ro as T,mo as a,po as b,oo as c,vo as d,Mt as e,fo as f,yo as g,Ao as h,os as i,Co as j,wo as k,qa as l,To as m,Vn as n,Eo as o,Aa as p,So as q,xl as r,ho as s,go as t,Ro as u,Lo as v,$o as w,xo as x,_o as y,ko as z};
