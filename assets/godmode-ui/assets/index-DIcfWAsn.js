(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const hs=globalThis,lo=hs.ShadowRoot&&(hs.ShadyCSS===void 0||hs.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,co=Symbol(),ya=new WeakMap;let al=class{constructor(t,n,s){if(this._$cssResult$=!0,s!==co)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o;const n=this.t;if(lo&&t===void 0){const s=n!==void 0&&n.length===1;s&&(t=ya.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ya.set(n,t))}return t}toString(){return this.cssText}};const Ad=e=>new al(typeof e=="string"?e:e+"",void 0,co),Cd=(e,...t)=>{const n=e.length===1?e[0]:t.reduce((s,i,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new al(n,e,co)},Td=(e,t)=>{if(lo)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of t){const s=document.createElement("style"),i=hs.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=n.cssText,e.appendChild(s)}},xa=lo?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(const s of t.cssRules)n+=s.cssText;return Ad(n)})(e):e;const{is:_d,defineProperty:Ed,getOwnPropertyDescriptor:Rd,getOwnPropertyNames:Id,getOwnPropertySymbols:Ld,getPrototypeOf:Md}=Object,Ms=globalThis,$a=Ms.trustedTypes,Dd=$a?$a.emptyScript:"",Pd=Ms.reactiveElementPolyfillSupport,In=(e,t)=>e,ws={toAttribute(e,t){switch(t){case Boolean:e=e?Dd:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},uo=(e,t)=>!_d(e,t),wa={attribute:!0,type:String,converter:ws,reflect:!1,useDefault:!1,hasChanged:uo};Symbol.metadata??=Symbol("metadata"),Ms.litPropertyMetadata??=new WeakMap;let an=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=wa){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,n);i!==void 0&&Ed(this.prototype,t,i)}}static getPropertyDescriptor(t,n,s){const{get:i,set:o}=Rd(this.prototype,t)??{get(){return this[n]},set(a){this[n]=a}};return{get:i,set(a){const r=i?.call(this);o?.call(this,a),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??wa}static _$Ei(){if(this.hasOwnProperty(In("elementProperties")))return;const t=Md(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(In("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(In("properties"))){const n=this.properties,s=[...Id(n),...Ld(n)];for(const i of s)this.createProperty(i,n[i])}const t=this[Symbol.metadata];if(t!==null){const n=litPropertyMetadata.get(t);if(n!==void 0)for(const[s,i]of n)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[n,s]of this.elementProperties){const i=this._$Eu(n,s);i!==void 0&&this._$Eh.set(i,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const n=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)n.unshift(xa(i))}else t!==void 0&&n.push(xa(t));return n}static _$Eu(t,n){const s=n.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,n=this.constructor.elementProperties;for(const s of n.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Td(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,s){this._$AK(t,s)}_$ET(t,n){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(s.converter?.toAttribute!==void 0?s.converter:ws).toAttribute(n,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,n){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:ws;this._$Em=i;const r=a.fromAttribute(n,o.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,n,s,i=!1,o){if(t!==void 0){const a=this.constructor;if(i===!1&&(o=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??uo)(o,n)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,n,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:s,reflect:i,wrapped:o},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??n??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(n=void 0),this._$AL.set(t,n)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,o]of s){const{wrapped:a}=o,r=this[i];a!==!0||this._$AL.has(i)||r===void 0||this.C(i,void 0,o,r)}}let t=!1;const n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(n)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};an.elementStyles=[],an.shadowRootOptions={mode:"open"},an[In("elementProperties")]=new Map,an[In("finalized")]=new Map,Pd?.({ReactiveElement:an}),(Ms.reactiveElementVersions??=[]).push("2.1.2");const go=globalThis,ka=e=>e,ks=go.trustedTypes,Sa=ks?ks.createPolicy("lit-html",{createHTML:e=>e}):void 0,rl="$lit$",pt=`lit$${Math.random().toFixed(9).slice(2)}$`,ll="?"+pt,Fd=`<${ll}>`,jt=document,Nn=()=>jt.createComment(""),On=e=>e===null||typeof e!="object"&&typeof e!="function",po=Array.isArray,Nd=e=>po(e)||typeof e?.[Symbol.iterator]=="function",oi=`[ 	
\f\r]`,xn=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Aa=/-->/g,Ca=/>/g,Rt=RegExp(`>|${oi}(?:([^\\s"'>=/]+)(${oi}*=${oi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ta=/'/g,_a=/"/g,cl=/^(?:script|style|textarea|title)$/i,dl=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),c=dl(1),It=dl(2),wt=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),Ea=new WeakMap,Ht=jt.createTreeWalker(jt,129);function ul(e,t){if(!po(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Sa!==void 0?Sa.createHTML(t):t}const Od=(e,t)=>{const n=e.length-1,s=[];let i,o=t===2?"<svg>":t===3?"<math>":"",a=xn;for(let r=0;r<n;r++){const l=e[r];let d,u,g=-1,f=0;for(;f<l.length&&(a.lastIndex=f,u=a.exec(l),u!==null);)f=a.lastIndex,a===xn?u[1]==="!--"?a=Aa:u[1]!==void 0?a=Ca:u[2]!==void 0?(cl.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=Rt):u[3]!==void 0&&(a=Rt):a===Rt?u[0]===">"?(a=i??xn,g=-1):u[1]===void 0?g=-2:(g=a.lastIndex-u[2].length,d=u[1],a=u[3]===void 0?Rt:u[3]==='"'?_a:Ta):a===_a||a===Ta?a=Rt:a===Aa||a===Ca?a=xn:(a=Rt,i=void 0);const h=a===Rt&&e[r+1].startsWith("/>")?" ":"";o+=a===xn?l+Fd:g>=0?(s.push(d),l.slice(0,g)+rl+l.slice(g)+pt+h):l+pt+(g===-2?r:h)}return[ul(e,o+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class Un{constructor({strings:t,_$litType$:n},s){let i;this.parts=[];let o=0,a=0;const r=t.length-1,l=this.parts,[d,u]=Od(t,n);if(this.el=Un.createElement(d,s),Ht.currentNode=this.el.content,n===2||n===3){const g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(i=Ht.nextNode())!==null&&l.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(const g of i.getAttributeNames())if(g.endsWith(rl)){const f=u[a++],h=i.getAttribute(g).split(pt),v=/([.?@])?(.*)/.exec(f);l.push({type:1,index:o,name:v[2],strings:h,ctor:v[1]==="."?Bd:v[1]==="?"?Hd:v[1]==="@"?zd:Ps}),i.removeAttribute(g)}else g.startsWith(pt)&&(l.push({type:6,index:o}),i.removeAttribute(g));if(cl.test(i.tagName)){const g=i.textContent.split(pt),f=g.length-1;if(f>0){i.textContent=ks?ks.emptyScript:"";for(let h=0;h<f;h++)i.append(g[h],Nn()),Ht.nextNode(),l.push({type:2,index:++o});i.append(g[f],Nn())}}}else if(i.nodeType===8)if(i.data===ll)l.push({type:2,index:o});else{let g=-1;for(;(g=i.data.indexOf(pt,g+1))!==-1;)l.push({type:7,index:o}),g+=pt.length-1}o++}}static createElement(t,n){const s=jt.createElement("template");return s.innerHTML=t,s}}function un(e,t,n=e,s){if(t===wt)return t;let i=s!==void 0?n._$Co?.[s]:n._$Cl;const o=On(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(e),i._$AT(e,n,s)),s!==void 0?(n._$Co??=[])[s]=i:n._$Cl=i),i!==void 0&&(t=un(e,i._$AS(e,t.values),i,s)),t}class Ud{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:n},parts:s}=this._$AD,i=(t?.creationScope??jt).importNode(n,!0);Ht.currentNode=i;let o=Ht.nextNode(),a=0,r=0,l=s[0];for(;l!==void 0;){if(a===l.index){let d;l.type===2?d=new Ds(o,o.nextSibling,this,t):l.type===1?d=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(d=new Kd(o,this,t)),this._$AV.push(d),l=s[++r]}a!==l?.index&&(o=Ht.nextNode(),a++)}return Ht.currentNode=jt,i}p(t){let n=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,n),n+=s.strings.length-2):s._$AI(t[n])),n++}}let Ds=class gl{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,s,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=un(this,t,n),On(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==wt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Nd(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&On(this._$AH)?this._$AA.nextSibling.data=t:this.T(jt.createTextNode(t)),this._$AH=t}$(t){const{values:n,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Un.createElement(ul(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(n);else{const o=new Ud(i,this),a=o.u(this.options);o.p(n),this.T(a),this._$AH=o}}_$AC(t){let n=Ea.get(t.strings);return n===void 0&&Ea.set(t.strings,n=new Un(t)),n}k(t){po(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let s,i=0;for(const o of t)i===n.length?n.push(s=new gl(this.O(Nn()),this.O(Nn()),this,this.options)):s=n[i],s._$AI(o),i++;i<n.length&&(this._$AR(s&&s._$AB.nextSibling,i),n.length=i)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){const s=ka(t).nextSibling;ka(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ps=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,s,i,o){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=n,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=m}_$AI(t,n=this,s,i){const o=this.strings;let a=!1;if(o===void 0)t=un(this,t,n,0),a=!On(t)||t!==this._$AH&&t!==wt,a&&(this._$AH=t);else{const r=t;let l,d;for(t=o[0],l=0;l<o.length-1;l++)d=un(this,r[s+l],n,l),d===wt&&(d=this._$AH[l]),a||=!On(d)||d!==this._$AH[l],d===m?t=m:t!==m&&(t+=(d??"")+o[l+1]),this._$AH[l]=d}a&&!i&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Bd=class extends Ps{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},Hd=class extends Ps{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},zd=class extends Ps{constructor(t,n,s,i,o){super(t,n,s,i,o),this.type=5}_$AI(t,n=this){if((t=un(this,t,n,0)??m)===wt)return;const s=this._$AH,i=t===m&&s!==m||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==m&&(s===m||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Kd=class{constructor(t,n,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){un(this,t)}};const jd={I:Ds},Wd=go.litHtmlPolyfillSupport;Wd?.(Un,Ds),(go.litHtmlVersions??=[]).push("3.3.2");const qd=(e,t,n)=>{const s=n?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const o=n?.renderBefore??null;s._$litPart$=i=new Ds(t.insertBefore(Nn(),o),o,void 0,n??{})}return i._$AI(e),i};const fo=globalThis;let cn=class extends an{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=qd(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return wt}};cn._$litElement$=!0,cn.finalized=!0,fo.litElementHydrateSupport?.({LitElement:cn});const Gd=fo.litElementPolyfillSupport;Gd?.({LitElement:cn});(fo.litElementVersions??=[]).push("4.2.2");const pl=e=>(t,n)=>{n!==void 0?n.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};const Vd={attribute:!0,type:String,converter:ws,reflect:!1,hasChanged:uo},Jd=(e=Vd,t,n)=>{const{kind:s,metadata:i}=n;let o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),s==="setter"&&((e=Object.create(e)).wrapped=!0),o.set(n.name,e),s==="accessor"){const{name:a}=n;return{set(r){const l=t.get.call(this);t.set.call(this,r),this.requestUpdate(a,l,e,!0,r)},init(r){return r!==void 0&&this.C(a,void 0,e,r),r}}}if(s==="setter"){const{name:a}=n;return function(r){const l=this[a];t.call(this,r),this.requestUpdate(a,l,e,!0,r)}}throw Error("Unsupported decorator location: "+s)};function Fs(e){return(t,n)=>typeof n=="object"?Jd(e,t,n):((s,i,o)=>{const a=i.hasOwnProperty(o);return i.constructor.createProperty(o,s),a?Object.getOwnPropertyDescriptor(i,o):void 0})(e,t,n)}function $(e){return Fs({...e,state:!0,attribute:!1})}const Qd="modulepreload",Yd=function(e,t){return new URL(e,t).href},Ra={},ai=function(t,n,s){let i=Promise.resolve();if(n&&n.length>0){let d=function(u){return Promise.all(u.map(g=>Promise.resolve(g).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const a=document.getElementsByTagName("link"),r=document.querySelector("meta[property=csp-nonce]"),l=r?.nonce||r?.getAttribute("nonce");i=d(n.map(u=>{if(u=Yd(u,s),u in Ra)return;Ra[u]=!0;const g=u.endsWith(".css"),f=g?'[rel="stylesheet"]':"";if(s)for(let v=a.length-1;v>=0;v--){const b=a[v];if(b.href===u&&(!g||b.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const h=document.createElement("link");if(h.rel=g?"stylesheet":Qd,g||(h.as="script"),h.crossOrigin="",h.href=u,l&&h.setAttribute("nonce",l),document.head.appendChild(h),g)return new Promise((v,b)=>{h.addEventListener("load",v),h.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${u}`)))})}))}function o(a){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=a,window.dispatchEvent(r),!r.defaultPrevented)throw a}return i.then(a=>{for(const r of a||[])r.status==="rejected"&&o(r.reason);return t().catch(o)})},Xd={common:{version:"Version",health:"Health",ok:"OK",offline:"Offline",connect:"Connect",refresh:"Refresh",enabled:"Enabled",disabled:"Disabled",na:"n/a",docs:"Docs",resources:"Resources"},nav:{chat:"Chat",control:"Control",agent:"Agent",settings:"Settings",expand:"Expand sidebar",collapse:"Collapse sidebar"},tabs:{agents:"Agents",overview:"Overview",channels:"Channels",instances:"Instances",sessions:"Sessions",usage:"Usage",cron:"Cron Jobs",skills:"Skills",nodes:"Nodes",chat:"Chat",config:"Config",debug:"Debug",logs:"Logs"},subtitles:{agents:"Manage agent workspaces, tools, and identities.",overview:"Gateway status, entry points, and a fast health read.",channels:"Manage channels and settings.",instances:"Presence beacons from connected clients and nodes.",sessions:"Inspect active sessions and adjust per-session defaults.",usage:"Monitor API usage and costs.",cron:"Schedule wakeups and recurring agent runs.",skills:"Manage skill availability and API key injection.",nodes:"Paired devices, capabilities, and command exposure.",chat:"Direct gateway chat session for quick interventions.",config:"Edit ~/.openclaw/openclaw.json safely.",debug:"Gateway snapshots, events, and manual RPC calls.",logs:"Live tail of the gateway file logs."},overview:{access:{title:"Gateway Access",subtitle:"Where the dashboard connects and how it authenticates.",wsUrl:"WebSocket URL",token:"Gateway Token",password:"Password (not stored)",sessionKey:"Default Session Key",language:"Language",connectHint:"Click Connect to apply connection changes.",trustedProxy:"Authenticated via trusted proxy."},snapshot:{title:"Snapshot",subtitle:"Latest gateway handshake information.",status:"Status",uptime:"Uptime",tickInterval:"Tick Interval",lastChannelsRefresh:"Last Channels Refresh",channelsHint:"Use Channels to link WhatsApp, Telegram, Discord, Signal, or iMessage."},stats:{instances:"Instances",instancesHint:"Presence beacons in the last 5 minutes.",sessions:"Sessions",sessionsHint:"Recent session keys tracked by the gateway.",cron:"Cron",cronNext:"Next wake {time}"},notes:{title:"Notes",subtitle:"Quick reminders for remote control setups.",tailscaleTitle:"Tailscale serve",tailscaleText:"Prefer serve mode to keep the gateway on loopback with tailnet auth.",sessionTitle:"Session hygiene",sessionText:"Use /new or sessions.patch to reset context.",cronTitle:"Cron reminders",cronText:"Use isolated sessions for recurring runs."},auth:{required:"This gateway requires auth. Add a token or password, then click Connect.",failed:"Auth failed. Re-copy a tokenized URL with {command}, or update the token, then click Connect."},pairing:{hint:"This device needs pairing approval from the gateway host.",mobileHint:"On mobile? Copy the full URL (including #token=...) from openclaw dashboard --no-open on your desktop."},insecure:{hint:"This page is HTTP, so the browser blocks device identity. Use HTTPS (Tailscale Serve) or open {url} on the gateway host.",stayHttp:"If you must stay on HTTP, set {config} (token-only)."}},chat:{disconnected:"Disconnected from gateway.",refreshTitle:"Refresh chat data",thinkingToggle:"Toggle assistant thinking/working output",focusToggle:"Toggle focus mode (hide sidebar + page header)",onboardingDisabled:"Disabled during onboarding"},languages:{en:"English",zhCN:"简体中文 (Simplified Chinese)",zhTW:"繁體中文 (Traditional Chinese)",ptBR:"Português (Brazilian Portuguese)"}},Zd=["en","zh-CN","zh-TW","pt-BR"];function ho(e){return e!=null&&Zd.includes(e)}class eu{constructor(){this.locale="en",this.translations={en:Xd},this.subscribers=new Set,this.loadLocale()}loadLocale(){const t=localStorage.getItem("openclaw.i18n.locale");if(ho(t))this.locale=t;else{const n=navigator.language;n.startsWith("zh")?this.locale=n==="zh-TW"||n==="zh-HK"?"zh-TW":"zh-CN":n.startsWith("pt")?this.locale="pt-BR":this.locale="en"}}getLocale(){return this.locale}async setLocale(t){if(this.locale!==t){if(!this.translations[t])try{let n;if(t==="zh-CN")n=await ai(()=>import("./zh-CN-n93Es9-W.js"),[],import.meta.url);else if(t==="zh-TW")n=await ai(()=>import("./zh-TW-CFEBeZgX.js"),[],import.meta.url);else if(t==="pt-BR")n=await ai(()=>import("./pt-BR-B7bx-x44.js"),[],import.meta.url);else return;this.translations[t]=n[t.replace("-","_")]}catch(n){console.error(`Failed to load locale: ${t}`,n);return}this.locale=t,localStorage.setItem("openclaw.i18n.locale",t),this.notify()}}registerTranslation(t,n){this.translations[t]=n}subscribe(t){return this.subscribers.add(t),()=>this.subscribers.delete(t)}notify(){this.subscribers.forEach(t=>t(this.locale))}t(t,n){const s=t.split(".");let i=this.translations[this.locale]||this.translations.en;for(const o of s)if(i&&typeof i=="object")i=i[o];else{i=void 0;break}if(i===void 0&&this.locale!=="en"){i=this.translations.en;for(const o of s)if(i&&typeof i=="object")i=i[o];else{i=void 0;break}}return typeof i!="string"?t:n?i.replace(/\{(\w+)\}/g,(o,a)=>n[a]||`{${a}}`):i}}const Bn=new eu,F=(e,t)=>Bn.t(e,t);class tu{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){this.unsubscribe=Bn.subscribe(()=>{this.host.requestUpdate()})}hostDisconnected(){this.unsubscribe?.()}}async function Ee(e,t){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const n=await e.client.request("channels.status",{probe:t,timeoutMs:8e3});e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(n){e.channelsError=String(n)}finally{e.channelsLoading=!1}}}async function nu(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.start",{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function su(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function iu(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function Re(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function fl(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(Re(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function mo(e){return e.filter(t=>typeof t=="string").join(".")}function vt(e,t){const n=mo(e),s=t[n];if(s)return s;const i=n.split(".");for(const[o,a]of Object.entries(t)){if(!o.includes("*"))continue;const r=o.split(".");if(r.length!==i.length)continue;let l=!0;for(let d=0;d<i.length;d+=1)if(r[d]!=="*"&&r[d]!==i[d]){l=!1;break}if(l)return a}}function Ns(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function Ia(e,t){const n=e.trim();if(n==="")return;const s=Number(n);return!Number.isFinite(s)||t&&!Number.isInteger(s)?e:s}function La(e){const t=e.trim();return t==="true"?!0:t==="false"?!1:e}function gt(e,t){if(e==null)return e;if(t.allOf&&t.allOf.length>0){let s=e;for(const i of t.allOf)s=gt(s,i);return s}const n=Re(t);if(t.anyOf||t.oneOf){const s=(t.anyOf??t.oneOf??[]).filter(i=>!(i.type==="null"||Array.isArray(i.type)&&i.type.includes("null")));if(s.length===1)return gt(e,s[0]);if(typeof e=="string")for(const i of s){const o=Re(i);if(o==="number"||o==="integer"){const a=Ia(e,o==="integer");if(a===void 0||typeof a=="number")return a}if(o==="boolean"){const a=La(e);if(typeof a=="boolean")return a}}for(const i of s){const o=Re(i);if(o==="object"&&typeof e=="object"&&!Array.isArray(e)||o==="array"&&Array.isArray(e))return gt(e,i)}return e}if(n==="number"||n==="integer"){if(typeof e=="string"){const s=Ia(e,n==="integer");if(s===void 0||typeof s=="number")return s}return e}if(n==="boolean"){if(typeof e=="string"){const s=La(e);if(typeof s=="boolean")return s}return e}if(n==="object"){if(typeof e!="object"||Array.isArray(e))return e;const s=e,i=t.properties??{},o=t.additionalProperties&&typeof t.additionalProperties=="object"?t.additionalProperties:null,a={};for(const[r,l]of Object.entries(s)){const d=i[r]??o,u=d?gt(l,d):l;u!==void 0&&(a[r]=u)}return a}if(n==="array"){if(!Array.isArray(e))return e;if(Array.isArray(t.items)){const i=t.items;return e.map((o,a)=>{const r=a<i.length?i[a]:void 0;return r?gt(o,r):o})}const s=t.items;return s?e.map(i=>gt(i,s)).filter(i=>i!==void 0):e}return e}function Wt(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function Hn(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function hl(e,t,n){if(t.length===0)return;let s=e;for(let o=0;o<t.length-1;o+=1){const a=t[o],r=t[o+1];if(typeof a=="number"){if(!Array.isArray(s))return;s[a]==null&&(s[a]=typeof r=="number"?[]:{}),s=s[a]}else{if(typeof s!="object"||s==null)return;const l=s;l[a]==null&&(l[a]=typeof r=="number"?[]:{}),s=l[a]}}const i=t[t.length-1];if(typeof i=="number"){Array.isArray(s)&&(s[i]=n);return}typeof s=="object"&&s!=null&&(s[i]=n)}function ml(e,t){if(t.length===0)return;let n=e;for(let i=0;i<t.length-1;i+=1){const o=t[i];if(typeof o=="number"){if(!Array.isArray(n))return;n=n[o]}else{if(typeof n!="object"||n==null)return;n=n[o]}if(n==null)return}const s=t[t.length-1];if(typeof s=="number"){Array.isArray(n)&&n.splice(s,1);return}typeof n=="object"&&n!=null&&delete n[s]}async function Be(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const t=await e.client.request("config.get",{});au(e,t)}catch(t){e.lastError=String(t)}finally{e.configLoading=!1}}}async function vl(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const t=await e.client.request("config.schema",{});ou(e,t)}catch(t){e.lastError=String(t)}finally{e.configSchemaLoading=!1}}}function ou(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function au(e,t){e.configSnapshot=t;const n=typeof t.raw=="string"?t.raw:t.config&&typeof t.config=="object"?Hn(t.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=n:e.configForm?e.configRaw=Hn(e.configForm):e.configRaw=n,e.configValid=typeof t.valid=="boolean"?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],e.configFormDirty||(e.configForm=Wt(t.config??{}),e.configFormOriginal=Wt(t.config??{}),e.configRawOriginal=n)}function ru(e){return!e||typeof e!="object"||Array.isArray(e)?null:e}function bl(e){if(e.configFormMode!=="form"||!e.configForm)return e.configRaw;const t=ru(e.configSchema),n=t?gt(e.configForm,t):e.configForm;return Hn(n)}async function ms(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const t=bl(e),n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:t,baseHash:n}),e.configFormDirty=!1,await Be(e)}catch(t){e.lastError=String(t)}finally{e.configSaving=!1}}}async function lu(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const t=bl(e),n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:t,baseHash:n,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await Be(e)}catch(t){e.lastError=String(t)}finally{e.configApplying=!1}}}async function Ma(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("update.run",{sessionKey:e.applySessionKey})}catch(t){e.lastError=String(t)}finally{e.updateRunning=!1}}}function Le(e,t,n){const s=Wt(e.configForm??e.configSnapshot?.config??{});hl(s,t,n),e.configForm=s,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=Hn(s))}function tt(e,t){const n=Wt(e.configForm??e.configSnapshot?.config??{});ml(n,t),e.configForm=n,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=Hn(n))}function cu(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function du(e){const{state:t,callbacks:n,accountId:s}=e,i=cu(t),o=(r,l,d={})=>{const{type:u="text",placeholder:g,maxLength:f,help:h}=d,v=t.values[r]??"",b=t.fieldErrors[r],A=`nostr-profile-${r}`;return u==="textarea"?c`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${A}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${l}
          </label>
          <textarea
            id="${A}"
            .value=${v}
            placeholder=${g??""}
            maxlength=${f??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${k=>{const T=k.target;n.onFieldChange(r,T.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${h?c`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${h}</div>`:m}
          ${b?c`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${b}</div>`:m}
        </div>
      `:c`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${A}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${l}
        </label>
        <input
          id="${A}"
          type=${u}
          .value=${v}
          placeholder=${g??""}
          maxlength=${f??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${k=>{const T=k.target;n.onFieldChange(r,T.value)}}
          ?disabled=${t.saving}
        />
        ${h?c`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${h}</div>`:m}
        ${b?c`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${b}</div>`:m}
      </div>
    `},a=()=>{const r=t.values.picture;return r?c`
      <div style="margin-bottom: 12px;">
        <img
          src=${r}
          alt="Profile picture preview"
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${l=>{const d=l.target;d.style.display="none"}}
          @load=${l=>{const d=l.target;d.style.display="block"}}
        />
      </div>
    `:m};return c`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${s}</div>
      </div>

      ${t.error?c`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:m}

      ${t.success?c`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:m}

      ${a()}

      ${o("name","Username",{placeholder:"satoshi",maxLength:256,help:"Short username (e.g., satoshi)"})}

      ${o("displayName","Display Name",{placeholder:"Satoshi Nakamoto",maxLength:256,help:"Your full display name"})}

      ${o("about","Bio",{type:"textarea",placeholder:"Tell people about yourself...",maxLength:2e3,help:"A brief bio or description"})}

      ${o("picture","Avatar URL",{type:"url",placeholder:"https://example.com/avatar.jpg",help:"HTTPS URL to your profile picture"})}

      ${t.showAdvanced?c`
            <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
              <div style="font-weight: 500; margin-bottom: 12px; color: var(--text-muted);">Advanced</div>

              ${o("banner","Banner URL",{type:"url",placeholder:"https://example.com/banner.jpg",help:"HTTPS URL to a banner image"})}

              ${o("website","Website",{type:"url",placeholder:"https://example.com",help:"Your personal website"})}

              ${o("nip05","NIP-05 Identifier",{placeholder:"you@example.com",help:"Verifiable identifier (e.g., you@domain.com)"})}

              ${o("lud16","Lightning Address",{placeholder:"you@getalby.com",help:"Lightning address for tips (LUD-16)"})}
            </div>
          `:m}

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

      ${i?c`
              <div style="font-size: 12px; color: var(--warning-color); margin-top: 8px">
                You have unsaved changes
              </div>
            `:m}
    </div>
  `}function uu(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}async function gu(e,t){await nu(e,t),await Ee(e,!0)}async function pu(e){await su(e),await Ee(e,!0)}async function fu(e){await iu(e),await Ee(e,!0)}async function hu(e){await ms(e),await Be(e),await Ee(e,!0)}async function mu(e){await Be(e),await Ee(e,!0)}function vu(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...i]=n.split(":");if(!s||i.length===0)continue;const o=s.trim(),a=i.join(":").trim();o&&a&&(t[o]=a)}return t}function yl(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function xl(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function bu(e){const t=e.hello?.auth?.deviceToken?.trim();if(t)return`Bearer ${t}`;const n=e.settings.token.trim();if(n)return`Bearer ${n}`;const s=e.password.trim();return s?`Bearer ${s}`:null}function $l(e){const t=bu(e);return t?{Authorization:t}:{}}function yu(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=uu(n??void 0)}function xu(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function $u(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function wu(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function ku(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=yl(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(xl(n),{method:"PUT",headers:{"Content-Type":"application/json",...$l(e)},body:JSON.stringify(t.values)}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const o=i?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:o,success:null,fieldErrors:vu(i?.details)};return}if(!i.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await Ee(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function Su(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=yl(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(xl(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json",...$l(e)},body:JSON.stringify({autoMerge:!0})}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const l=i?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:l,success:null};return}const o=i.merged??i.imported??null,a=o?{...t.values,...o}:t.values,r=!!(a.banner||a.website||a.nip05||a.lud16);e.nostrProfileFormState={...t,importing:!1,values:a,error:null,success:i.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:r},i.saved&&await Ee(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}function wl(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),i=n.slice(2).join(":");return!s||!i?null:{agentId:s,rest:i}}const Pi=450;function Gn(e,t=!1,n=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const s=()=>{const i=e.querySelector(".chat-thread");if(i){const o=getComputedStyle(i).overflowY;if(o==="auto"||o==="scroll"||i.scrollHeight-i.clientHeight>1)return i}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const i=s();if(!i)return;const o=i.scrollHeight-i.scrollTop-i.clientHeight,a=t&&!e.chatHasAutoScrolled;if(!(a||e.chatUserNearBottom||o<Pi)){e.chatNewMessagesBelow=!0;return}a&&(e.chatHasAutoScrolled=!0);const l=n&&(typeof window>"u"||typeof window.matchMedia!="function"||!window.matchMedia("(prefers-reduced-motion: reduce)").matches),d=i.scrollHeight;typeof i.scrollTo=="function"?i.scrollTo({top:d,behavior:l?"smooth":"auto"}):i.scrollTop=d,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1;const u=a?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const g=s();if(!g)return;const f=g.scrollHeight-g.scrollTop-g.clientHeight;(a||e.chatUserNearBottom||f<Pi)&&(g.scrollTop=g.scrollHeight,e.chatUserNearBottom=!0)},u)})})}function kl(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function Au(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.chatUserNearBottom=s<Pi,e.chatUserNearBottom&&(e.chatNewMessagesBelow=!1)}function Cu(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function Da(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function Tu(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),i=document.createElement("a"),o=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");i.href=s,i.download=`openclaw-logs-${t}-${o}.log`,i.click(),URL.revokeObjectURL(s)}function _u(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}async function Os(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[t,n,s,i]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=t,e.debugHealth=n;const o=s;e.debugModels=Array.isArray(o?.models)?o?.models:[],e.debugHeartbeat=i}catch(t){e.debugCallError=String(t)}finally{e.debugLoading=!1}}}async function Eu(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const t=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},n=await e.client.request(e.debugCallMethod.trim(),t);e.debugCallResult=JSON.stringify(n,null,2)}catch(t){e.debugCallError=String(t)}}}const Ru=2e3,Iu=new Set(["trace","debug","info","warn","error","fatal"]);function Lu(e){if(typeof e!="string")return null;const t=e.trim();if(!t.startsWith("{")||!t.endsWith("}"))return null;try{const n=JSON.parse(t);return!n||typeof n!="object"?null:n}catch{return null}}function Mu(e){if(typeof e!="string")return null;const t=e.toLowerCase();return Iu.has(t)?t:null}function Du(e){if(!e.trim())return{raw:e,message:e};try{const t=JSON.parse(e),n=t&&typeof t._meta=="object"&&t._meta!==null?t._meta:null,s=typeof t.time=="string"?t.time:typeof n?.date=="string"?n?.date:null,i=Mu(n?.logLevelName??n?.level),o=typeof t[0]=="string"?t[0]:typeof n?.name=="string"?n?.name:null,a=Lu(o);let r=null;a&&(typeof a.subsystem=="string"?r=a.subsystem:typeof a.module=="string"&&(r=a.module)),!r&&o&&o.length<120&&(r=o);let l=null;return typeof t[1]=="string"?l=t[1]:!a&&typeof t[0]=="string"?l=t[0]:typeof t.message=="string"&&(l=t.message),{raw:e,time:s,level:i,subsystem:r,message:l??e,meta:n??void 0}}catch{return{raw:e,message:e}}}async function vo(e,t){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!t?.quiet)){t?.quiet||(e.logsLoading=!0),e.logsError=null;try{const s=await e.client.request("logs.tail",{cursor:t?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),o=(Array.isArray(s.lines)?s.lines.filter(r=>typeof r=="string"):[]).map(Du),a=!!(t?.reset||s.reset||e.logsCursor==null);e.logsEntries=a?o:[...e.logsEntries,...o].slice(-Ru),typeof s.cursor=="number"&&(e.logsCursor=s.cursor),typeof s.file=="string"&&(e.logsFile=s.file),e.logsTruncated=!!s.truncated,e.logsLastFetchAt=Date.now()}catch(n){e.logsError=String(n)}finally{t?.quiet||(e.logsLoading=!1)}}}async function Us(e,t){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,t?.quiet||(e.lastError=null);try{const n=await e.client.request("node.list",{});e.nodes=Array.isArray(n.nodes)?n.nodes:[]}catch(n){t?.quiet||(e.lastError=String(n))}finally{e.nodesLoading=!1}}}function Pu(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{Us(e,{quiet:!0})},5e3))}function Fu(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function bo(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&vo(e,{quiet:!0})},2e3))}function yo(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function xo(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&Os(e)},3e3))}function $o(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}async function Sl(e,t){if(!(!e.client||!e.connected||e.agentIdentityLoading)&&!e.agentIdentityById[t]){e.agentIdentityLoading=!0,e.agentIdentityError=null;try{const n=await e.client.request("agent.identity.get",{agentId:t});n&&(e.agentIdentityById={...e.agentIdentityById,[t]:n})}catch(n){e.agentIdentityError=String(n)}finally{e.agentIdentityLoading=!1}}}async function Al(e,t){if(!e.client||!e.connected||e.agentIdentityLoading)return;const n=t.filter(s=>!e.agentIdentityById[s]);if(n.length!==0){e.agentIdentityLoading=!0,e.agentIdentityError=null;try{for(const s of n){const i=await e.client.request("agent.identity.get",{agentId:s});i&&(e.agentIdentityById={...e.agentIdentityById,[s]:i})}}catch(s){e.agentIdentityError=String(s)}finally{e.agentIdentityLoading=!1}}}async function vs(e,t){if(!(!e.client||!e.connected)&&!e.agentSkillsLoading){e.agentSkillsLoading=!0,e.agentSkillsError=null;try{const n=await e.client.request("skills.status",{agentId:t});n&&(e.agentSkillsReport=n,e.agentSkillsAgentId=t)}catch(n){e.agentSkillsError=String(n)}finally{e.agentSkillsLoading=!1}}}async function wo(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const t=await e.client.request("agents.list",{});if(t){e.agentsList=t;const n=e.agentsSelectedId,s=t.agents.some(i=>i.id===n);(!n||!s)&&(e.agentsSelectedId=t.defaultId??t.agents[0]?.id??null)}}catch(t){e.agentsError=String(t)}finally{e.agentsLoading=!1}}}async function Ln(e,t){if(!(!e.client||!e.connected)&&!e.toolsCatalogLoading){e.toolsCatalogLoading=!0,e.toolsCatalogError=null;try{const n=await e.client.request("tools.catalog",{agentId:t??e.agentsSelectedId??void 0,includePlugins:!0});n&&(e.toolsCatalogResult=n)}catch(n){e.toolsCatalogError=String(n)}finally{e.toolsCatalogLoading=!1}}}const Nu={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},Cl={name:"",description:"",agentId:"",clearAgent:!1,enabled:!0,deleteAfterRun:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",scheduleExact:!1,staggerAmount:"",staggerUnit:"seconds",sessionTarget:"isolated",wakeMode:"now",payloadKind:"agentTurn",payloadText:"",payloadModel:"",payloadThinking:"",deliveryMode:"announce",deliveryChannel:"last",deliveryTo:"",deliveryBestEffort:!1,timeoutSeconds:""};function ko(e,t){if(e==null||!Number.isFinite(e)||e<=0)return;if(e<1e3)return`${Math.round(e)}ms`;const n=t?.spaced?" ":"",s=Math.round(e/1e3),i=Math.floor(s/3600),o=Math.floor(s%3600/60),a=s%60;if(i>=24){const r=Math.floor(i/24),l=i%24;return l>0?`${r}d${n}${l}h`:`${r}d`}return i>0?o>0?`${i}h${n}${o}m`:`${i}h`:o>0?a>0?`${o}m${n}${a}s`:`${o}m`:`${a}s`}function So(e,t="n/a"){if(e==null||!Number.isFinite(e)||e<0)return t;if(e<1e3)return`${Math.round(e)}ms`;const n=Math.round(e/1e3);if(n<60)return`${n}s`;const s=Math.round(n/60);if(s<60)return`${s}m`;const i=Math.round(s/60);return i<24?`${i}h`:`${Math.round(i/24)}d`}function se(e,t){const n=t?.fallback??"n/a";if(e==null||!Number.isFinite(e))return n;const s=Date.now()-e,i=Math.abs(s),o=s>=0,a=Math.round(i/1e3);if(a<60)return o?"just now":"in <1m";const r=Math.round(a/60);if(r<60)return o?`${r}m ago`:`in ${r}m`;const l=Math.round(r/60);if(l<48)return o?`${l}h ago`:`in ${l}h`;const d=Math.round(l/24);return o?`${d}d ago`:`in ${d}d`}function Pa(e){const t=[],n=/(^|\n)(```|~~~)[^\n]*\n[\s\S]*?(?:\n\2(?:\n|$)|$)/g;for(const i of e.matchAll(n)){const o=(i.index??0)+i[1].length;t.push({start:o,end:o+i[0].length-i[1].length})}const s=/`+[^`]+`+/g;for(const i of e.matchAll(s)){const o=i.index??0,a=o+i[0].length;t.some(l=>o>=l.start&&a<=l.end)||t.push({start:o,end:a})}return t.sort((i,o)=>i.start-o.start),t}function Fa(e,t){return t.some(n=>e>=n.start&&e<n.end)}const Ou=/<\s*\/?\s*(?:think(?:ing)?|thought|antthinking|final)\b/i,ss=/<\s*\/?\s*final\b[^<>]*>/gi,Na=/<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\b[^<>]*>/gi;function Uu(e,t){return e.trimStart()}function Bu(e,t){if(!e||!Ou.test(e))return e;let n=e;if(ss.test(n)){ss.lastIndex=0;const r=[],l=Pa(n);for(const d of n.matchAll(ss)){const u=d.index??0;r.push({start:u,length:d[0].length,inCode:Fa(u,l)})}for(let d=r.length-1;d>=0;d--){const u=r[d];u.inCode||(n=n.slice(0,u.start)+n.slice(u.start+u.length))}}else ss.lastIndex=0;const s=Pa(n);Na.lastIndex=0;let i="",o=0,a=!1;for(const r of n.matchAll(Na)){const l=r.index??0,d=r[1]==="/";Fa(l,s)||(a?d&&(a=!1):(i+=n.slice(o,l),d||(a=!0)),o=l+r[0].length)}return i+=n.slice(o),Uu(i)}function kt(e){return!e&&e!==0?"n/a":new Date(e).toLocaleString()}function Fi(e){return!e||e.length===0?"none":e.filter(t=>!!(t&&t.trim())).join(", ")}function Ni(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function Tl(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function bt(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function ri(e){return Bu(e)}const Hu="last";function zu(e){return e.sessionTarget==="isolated"&&e.payloadKind==="agentTurn"}function Ao(e){return e.deliveryMode!=="announce"||zu(e)?e:{...e,deliveryMode:"none"}}function Vn(e){const t={};if(e.name.trim()||(t.name="Name is required."),e.scheduleKind==="at"){const n=Date.parse(e.scheduleAt);Number.isFinite(n)||(t.scheduleAt="Enter a valid date/time.")}else if(e.scheduleKind==="every")bt(e.everyAmount,0)<=0&&(t.everyAmount="Interval must be greater than 0.");else if(e.cronExpr.trim()||(t.cronExpr="Cron expression is required."),!e.scheduleExact){const n=e.staggerAmount.trim();n&&bt(n,0)<=0&&(t.staggerAmount="Stagger must be greater than 0.")}if(e.payloadText.trim()||(t.payloadText=e.payloadKind==="systemEvent"?"System text is required.":"Agent message is required."),e.payloadKind==="agentTurn"){const n=e.timeoutSeconds.trim();n&&bt(n,0)<=0&&(t.timeoutSeconds="If set, timeout must be greater than 0 seconds.")}if(e.deliveryMode==="webhook"){const n=e.deliveryTo.trim();n?/^https?:\/\//i.test(n)||(t.deliveryTo="Webhook URL must start with http:// or https://."):t.deliveryTo="Webhook URL is required."}return t}function _l(e){return Object.keys(e).length>0}async function Jn(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.status",{});e.cronStatus=t}catch(t){e.cronError=String(t)}}async function Ku(e){if(!(!e.client||!e.connected))try{const n=(await e.client.request("models.list",{}))?.models;if(!Array.isArray(n)){e.cronModelSuggestions=[];return}const s=n.map(i=>{if(!i||typeof i!="object")return"";const o=i.id;return typeof o=="string"?o.trim():""}).filter(Boolean);e.cronModelSuggestions=Array.from(new Set(s)).toSorted((i,o)=>i.localeCompare(o))}catch{e.cronModelSuggestions=[]}}async function Bs(e){return await Co(e,{append:!1})}function El(e){const t=typeof e.totalRaw=="number"&&Number.isFinite(e.totalRaw)?Math.max(0,Math.floor(e.totalRaw)):e.pageCount,n=typeof e.limitRaw=="number"&&Number.isFinite(e.limitRaw)?Math.max(1,Math.floor(e.limitRaw)):Math.max(1,e.pageCount),s=typeof e.offsetRaw=="number"&&Number.isFinite(e.offsetRaw)?Math.max(0,Math.floor(e.offsetRaw)):0,i=typeof e.hasMoreRaw=="boolean"?e.hasMoreRaw:s+e.pageCount<Math.max(t,s+e.pageCount),o=typeof e.nextOffsetRaw=="number"&&Number.isFinite(e.nextOffsetRaw)?Math.max(0,Math.floor(e.nextOffsetRaw)):i?s+e.pageCount:null;return{total:t,limit:n,offset:s,hasMore:i,nextOffset:o}}async function Co(e,t){if(!e.client||!e.connected||e.cronLoading||e.cronJobsLoadingMore)return;const n=t?.append===!0;if(n){if(!e.cronJobsHasMore)return;e.cronJobsLoadingMore=!0}else e.cronLoading=!0;e.cronError=null;try{const s=n?Math.max(0,e.cronJobsNextOffset??e.cronJobs.length):0,i=await e.client.request("cron.list",{includeDisabled:e.cronJobsEnabledFilter==="all",limit:e.cronJobsLimit,offset:s,query:e.cronJobsQuery.trim()||void 0,enabled:e.cronJobsEnabledFilter,sortBy:e.cronJobsSortBy,sortDir:e.cronJobsSortDir}),o=Array.isArray(i.jobs)?i.jobs:[];e.cronJobs=n?[...e.cronJobs,...o]:o;const a=El({totalRaw:i.total,limitRaw:i.limit,offsetRaw:i.offset,nextOffsetRaw:i.nextOffset,hasMoreRaw:i.hasMore,pageCount:o.length});e.cronJobsTotal=Math.max(a.total,e.cronJobs.length),e.cronJobsHasMore=a.hasMore,e.cronJobsNextOffset=a.nextOffset,e.cronEditingJobId&&!e.cronJobs.some(r=>r.id===e.cronEditingJobId)&&Qn(e)}catch(s){e.cronError=String(s)}finally{n?e.cronJobsLoadingMore=!1:e.cronLoading=!1}}async function ju(e){await Co(e,{append:!0})}async function Wu(e){await Co(e,{append:!1})}function qu(e,t){typeof t.cronJobsQuery=="string"&&(e.cronJobsQuery=t.cronJobsQuery),t.cronJobsEnabledFilter&&(e.cronJobsEnabledFilter=t.cronJobsEnabledFilter),t.cronJobsSortBy&&(e.cronJobsSortBy=t.cronJobsSortBy),t.cronJobsSortDir&&(e.cronJobsSortDir=t.cronJobsSortDir)}function Qn(e){e.cronEditingJobId=null}function Rl(e){e.cronForm={...Cl},e.cronFieldErrors=Vn(e.cronForm)}function Gu(e){const t=Date.parse(e);if(!Number.isFinite(t))return"";const n=new Date(t),s=n.getFullYear(),i=String(n.getMonth()+1).padStart(2,"0"),o=String(n.getDate()).padStart(2,"0"),a=String(n.getHours()).padStart(2,"0"),r=String(n.getMinutes()).padStart(2,"0");return`${s}-${i}-${o}T${a}:${r}`}function Vu(e){if(e%864e5===0)return{everyAmount:String(Math.max(1,e/864e5)),everyUnit:"days"};if(e%36e5===0)return{everyAmount:String(Math.max(1,e/36e5)),everyUnit:"hours"};const t=Math.max(1,Math.ceil(e/6e4));return{everyAmount:String(t),everyUnit:"minutes"}}function Ju(e){return e===0?{scheduleExact:!0,staggerAmount:"",staggerUnit:"seconds"}:typeof e!="number"||!Number.isFinite(e)||e<0?{scheduleExact:!1,staggerAmount:"",staggerUnit:"seconds"}:e%6e4===0?{scheduleExact:!1,staggerAmount:String(Math.max(1,e/6e4)),staggerUnit:"minutes"}:{scheduleExact:!1,staggerAmount:String(Math.max(1,Math.ceil(e/1e3))),staggerUnit:"seconds"}}function Il(e,t){const n={...t,name:e.name,description:e.description??"",agentId:e.agentId??"",clearAgent:!1,enabled:e.enabled,deleteAfterRun:e.deleteAfterRun??!1,scheduleKind:e.schedule.kind,scheduleAt:"",everyAmount:t.everyAmount,everyUnit:t.everyUnit,cronExpr:t.cronExpr,cronTz:"",scheduleExact:!1,staggerAmount:"",staggerUnit:"seconds",sessionTarget:e.sessionTarget,wakeMode:e.wakeMode,payloadKind:e.payload.kind,payloadText:e.payload.kind==="systemEvent"?e.payload.text:e.payload.message,payloadModel:e.payload.kind==="agentTurn"?e.payload.model??"":"",payloadThinking:e.payload.kind==="agentTurn"?e.payload.thinking??"":"",deliveryMode:e.delivery?.mode??"none",deliveryChannel:e.delivery?.channel??Hu,deliveryTo:e.delivery?.to??"",deliveryBestEffort:e.delivery?.bestEffort??!1,timeoutSeconds:e.payload.kind==="agentTurn"&&typeof e.payload.timeoutSeconds=="number"?String(e.payload.timeoutSeconds):""};if(e.schedule.kind==="at")n.scheduleAt=Gu(e.schedule.at);else if(e.schedule.kind==="every"){const s=Vu(e.schedule.everyMs);n.everyAmount=s.everyAmount,n.everyUnit=s.everyUnit}else{n.cronExpr=e.schedule.expr,n.cronTz=e.schedule.tz??"";const s=Ju(e.schedule.staggerMs);n.scheduleExact=s.scheduleExact,n.staggerAmount=s.staggerAmount,n.staggerUnit=s.staggerUnit}return Ao(n)}function Qu(e){if(e.scheduleKind==="at"){const o=Date.parse(e.scheduleAt);if(!Number.isFinite(o))throw new Error("Invalid run time.");return{kind:"at",at:new Date(o).toISOString()}}if(e.scheduleKind==="every"){const o=bt(e.everyAmount,0);if(o<=0)throw new Error("Invalid interval amount.");const a=e.everyUnit;return{kind:"every",everyMs:o*(a==="minutes"?6e4:a==="hours"?36e5:864e5)}}const t=e.cronExpr.trim();if(!t)throw new Error("Cron expression required.");if(e.scheduleExact)return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0,staggerMs:0};const n=e.staggerAmount.trim();if(!n)return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0};const s=bt(n,0);if(s<=0)throw new Error("Invalid stagger amount.");const i=e.staggerUnit==="minutes"?s*6e4:s*1e3;return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0,staggerMs:i}}function Yu(e){if(e.payloadKind==="systemEvent"){const a=e.payloadText.trim();if(!a)throw new Error("System event text required.");return{kind:"systemEvent",text:a}}const t=e.payloadText.trim();if(!t)throw new Error("Agent message required.");const n={kind:"agentTurn",message:t},s=e.payloadModel.trim();s&&(n.model=s);const i=e.payloadThinking.trim();i&&(n.thinking=i);const o=bt(e.timeoutSeconds,0);return o>0&&(n.timeoutSeconds=o),n}async function Xu(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const t=Ao(e.cronForm);t!==e.cronForm&&(e.cronForm=t);const n=Vn(t);if(e.cronFieldErrors=n,_l(n))return;const s=Qu(t),i=Yu(t),o=t.deliveryMode,a=o&&o!=="none"?{mode:o,channel:o==="announce"?t.deliveryChannel.trim()||"last":void 0,to:t.deliveryTo.trim()||void 0,bestEffort:t.deliveryBestEffort}:void 0,r=t.clearAgent?null:t.agentId.trim(),l={name:t.name.trim(),description:t.description.trim(),agentId:r===null?null:r||void 0,enabled:t.enabled,deleteAfterRun:t.deleteAfterRun,schedule:s,sessionTarget:t.sessionTarget,wakeMode:t.wakeMode,payload:i,delivery:a};if(!l.name)throw new Error("Name required.");e.cronEditingJobId?(await e.client.request("cron.update",{id:e.cronEditingJobId,patch:l}),Qn(e)):(await e.client.request("cron.add",l),Rl(e)),await Bs(e),await Jn(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function Zu(e,t,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:t.id,patch:{enabled:n}}),await Bs(e),await Jn(e)}catch(s){e.cronError=String(s)}finally{e.cronBusy=!1}}}async function eg(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:t.id,mode:"force"}),e.cronRunsScope==="all"?await yt(e,null):await yt(e,t.id)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function tg(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:t.id}),e.cronEditingJobId===t.id&&Qn(e),e.cronRunsJobId===t.id&&(e.cronRunsJobId=null,e.cronRuns=[],e.cronRunsTotal=0,e.cronRunsHasMore=!1,e.cronRunsNextOffset=null),await Bs(e),await Jn(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function yt(e,t,n){if(!e.client||!e.connected)return;const s=e.cronRunsScope,i=t??e.cronRunsJobId;if(s==="job"&&!i){e.cronRuns=[],e.cronRunsTotal=0,e.cronRunsHasMore=!1,e.cronRunsNextOffset=null;return}const o=n?.append===!0;if(!(o&&!e.cronRunsHasMore))try{o&&(e.cronRunsLoadingMore=!0);const a=o?Math.max(0,e.cronRunsNextOffset??e.cronRuns.length):0,r=await e.client.request("cron.runs",{scope:s,id:s==="job"?i??void 0:void 0,limit:e.cronRunsLimit,offset:a,statuses:e.cronRunsStatuses.length>0?e.cronRunsStatuses:void 0,status:e.cronRunsStatusFilter,deliveryStatuses:e.cronRunsDeliveryStatuses.length>0?e.cronRunsDeliveryStatuses:void 0,query:e.cronRunsQuery.trim()||void 0,sortDir:e.cronRunsSortDir}),l=Array.isArray(r.entries)?r.entries:[];e.cronRuns=o&&(s==="all"||e.cronRunsJobId===i)?[...e.cronRuns,...l]:l,s==="job"&&(e.cronRunsJobId=i??null);const d=El({totalRaw:r.total,limitRaw:r.limit,offsetRaw:r.offset,nextOffsetRaw:r.nextOffset,hasMoreRaw:r.hasMore,pageCount:l.length});e.cronRunsTotal=Math.max(d.total,e.cronRuns.length),e.cronRunsHasMore=d.hasMore,e.cronRunsNextOffset=d.nextOffset}catch(a){e.cronError=String(a)}finally{o&&(e.cronRunsLoadingMore=!1)}}async function ng(e){e.cronRunsScope==="job"&&!e.cronRunsJobId||await yt(e,e.cronRunsJobId,{append:!0})}function Oa(e,t){t.cronRunsScope&&(e.cronRunsScope=t.cronRunsScope),Array.isArray(t.cronRunsStatuses)&&(e.cronRunsStatuses=t.cronRunsStatuses,e.cronRunsStatusFilter=t.cronRunsStatuses.length===1?t.cronRunsStatuses[0]:"all"),Array.isArray(t.cronRunsDeliveryStatuses)&&(e.cronRunsDeliveryStatuses=t.cronRunsDeliveryStatuses),t.cronRunsStatusFilter&&(e.cronRunsStatusFilter=t.cronRunsStatusFilter,e.cronRunsStatuses=t.cronRunsStatusFilter==="all"?[]:[t.cronRunsStatusFilter]),typeof t.cronRunsQuery=="string"&&(e.cronRunsQuery=t.cronRunsQuery),t.cronRunsSortDir&&(e.cronRunsSortDir=t.cronRunsSortDir)}function sg(e,t){e.cronEditingJobId=t.id,e.cronRunsJobId=t.id,e.cronForm=Il(t,e.cronForm),e.cronFieldErrors=Vn(e.cronForm)}function ig(e,t){const n=e.trim()||"Job",s=`${n} copy`;if(!t.has(s.toLowerCase()))return s;let i=2;for(;i<1e3;){const o=`${n} copy ${i}`;if(!t.has(o.toLowerCase()))return o;i+=1}return`${n} copy ${Date.now()}`}function og(e,t){Qn(e),e.cronRunsJobId=t.id;const n=new Set(e.cronJobs.map(i=>i.name.trim().toLowerCase())),s=Il(t,e.cronForm);s.name=ig(t.name,n),e.cronForm=s,e.cronFieldErrors=Vn(e.cronForm)}function ag(e){Qn(e),Rl(e)}function To(e){return e.trim()}function rg(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e){const s=n.trim();s&&t.add(s)}return[...t].toSorted()}const Ll="openclaw.device.auth.v1";function _o(){try{const e=window.localStorage.getItem(Ll);if(!e)return null;const t=JSON.parse(e);return!t||t.version!==1||!t.deviceId||typeof t.deviceId!="string"||!t.tokens||typeof t.tokens!="object"?null:t}catch{return null}}function Ml(e){try{window.localStorage.setItem(Ll,JSON.stringify(e))}catch{}}function lg(e){const t=_o();if(!t||t.deviceId!==e.deviceId)return null;const n=To(e.role),s=t.tokens[n];return!s||typeof s.token!="string"?null:s}function Dl(e){const t=To(e.role),n={version:1,deviceId:e.deviceId,tokens:{}},s=_o();s&&s.deviceId===e.deviceId&&(n.tokens={...s.tokens});const i={token:e.token,role:t,scopes:rg(e.scopes),updatedAtMs:Date.now()};return n.tokens[t]=i,Ml(n),i}function Pl(e){const t=_o();if(!t||t.deviceId!==e.deviceId)return;const n=To(e.role);if(!t.tokens[n])return;const s={...t,tokens:{...t.tokens}};delete s.tokens[n],Ml(s)}const Fl={p:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,n:0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,h:8n,a:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,d:0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,Gx:0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,Gy:0x6666666666666666666666666666666666666666666666666666666666666658n},{p:$e,n:bs,Gx:Ua,Gy:Ba,a:li,d:ci,h:cg}=Fl,qt=32,Eo=64,dg=(...e)=>{"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(...e)},fe=(e="")=>{const t=new Error(e);throw dg(t,fe),t},ug=e=>typeof e=="bigint",gg=e=>typeof e=="string",pg=e=>e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array",Ct=(e,t,n="")=>{const s=pg(e),i=e?.length,o=t!==void 0;if(!s||o&&i!==t){const a=n&&`"${n}" `,r=o?` of length ${t}`:"",l=s?`length=${i}`:`type=${typeof e}`;fe(a+"expected Uint8Array"+r+", got "+l)}return e},Hs=e=>new Uint8Array(e),Nl=e=>Uint8Array.from(e),Ol=(e,t)=>e.toString(16).padStart(t,"0"),Ul=e=>Array.from(Ct(e)).map(t=>Ol(t,2)).join(""),nt={_0:48,_9:57,A:65,F:70,a:97,f:102},Ha=e=>{if(e>=nt._0&&e<=nt._9)return e-nt._0;if(e>=nt.A&&e<=nt.F)return e-(nt.A-10);if(e>=nt.a&&e<=nt.f)return e-(nt.a-10)},Bl=e=>{const t="hex invalid";if(!gg(e))return fe(t);const n=e.length,s=n/2;if(n%2)return fe(t);const i=Hs(s);for(let o=0,a=0;o<s;o++,a+=2){const r=Ha(e.charCodeAt(a)),l=Ha(e.charCodeAt(a+1));if(r===void 0||l===void 0)return fe(t);i[o]=r*16+l}return i},Hl=()=>globalThis?.crypto,fg=()=>Hl()?.subtle??fe("crypto.subtle must be defined, consider polyfill"),zn=(...e)=>{const t=Hs(e.reduce((s,i)=>s+Ct(i).length,0));let n=0;return e.forEach(s=>{t.set(s,n),n+=s.length}),t},hg=(e=qt)=>Hl().getRandomValues(Hs(e)),Ss=BigInt,Ft=(e,t,n,s="bad number: out of range")=>ug(e)&&t<=e&&e<n?e:fe(s),B=(e,t=$e)=>{const n=e%t;return n>=0n?n:t+n},zl=e=>B(e,bs),mg=(e,t)=>{(e===0n||t<=0n)&&fe("no inverse n="+e+" mod="+t);let n=B(e,t),s=t,i=0n,o=1n;for(;n!==0n;){const a=s/n,r=s%n,l=i-o*a;s=n,n=r,i=o,o=l}return s===1n?B(i,t):fe("no inverse")},vg=e=>{const t=ql[e];return typeof t!="function"&&fe("hashes."+e+" not set"),t},di=e=>e instanceof De?e:fe("Point expected"),Oi=2n**256n;class De{static BASE;static ZERO;X;Y;Z;T;constructor(t,n,s,i){const o=Oi;this.X=Ft(t,0n,o),this.Y=Ft(n,0n,o),this.Z=Ft(s,1n,o),this.T=Ft(i,0n,o),Object.freeze(this)}static CURVE(){return Fl}static fromAffine(t){return new De(t.x,t.y,1n,B(t.x*t.y))}static fromBytes(t,n=!1){const s=ci,i=Nl(Ct(t,qt)),o=t[31];i[31]=o&-129;const a=jl(i);Ft(a,0n,n?Oi:$e);const l=B(a*a),d=B(l-1n),u=B(s*l+1n);let{isValid:g,value:f}=yg(d,u);g||fe("bad point: y not sqrt");const h=(f&1n)===1n,v=(o&128)!==0;return!n&&f===0n&&v&&fe("bad point: x==0, isLastByteOdd"),v!==h&&(f=B(-f)),new De(f,a,1n,B(f*a))}static fromHex(t,n){return De.fromBytes(Bl(t),n)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}assertValidity(){const t=li,n=ci,s=this;if(s.is0())return fe("bad point: ZERO");const{X:i,Y:o,Z:a,T:r}=s,l=B(i*i),d=B(o*o),u=B(a*a),g=B(u*u),f=B(l*t),h=B(u*B(f+d)),v=B(g+B(n*B(l*d)));if(h!==v)return fe("bad point: equation left != right (1)");const b=B(i*o),A=B(a*r);return b!==A?fe("bad point: equation left != right (2)"):this}equals(t){const{X:n,Y:s,Z:i}=this,{X:o,Y:a,Z:r}=di(t),l=B(n*r),d=B(o*i),u=B(s*r),g=B(a*i);return l===d&&u===g}is0(){return this.equals(ln)}negate(){return new De(B(-this.X),this.Y,this.Z,B(-this.T))}double(){const{X:t,Y:n,Z:s}=this,i=li,o=B(t*t),a=B(n*n),r=B(2n*B(s*s)),l=B(i*o),d=t+n,u=B(B(d*d)-o-a),g=l+a,f=g-r,h=l-a,v=B(u*f),b=B(g*h),A=B(u*h),k=B(f*g);return new De(v,b,k,A)}add(t){const{X:n,Y:s,Z:i,T:o}=this,{X:a,Y:r,Z:l,T:d}=di(t),u=li,g=ci,f=B(n*a),h=B(s*r),v=B(o*g*d),b=B(i*l),A=B((n+s)*(a+r)-f-h),k=B(b-v),T=B(b+v),S=B(h-u*f),R=B(A*k),I=B(T*S),C=B(A*S),p=B(k*T);return new De(R,I,p,C)}subtract(t){return this.add(di(t).negate())}multiply(t,n=!0){if(!n&&(t===0n||this.is0()))return ln;if(Ft(t,1n,bs),t===1n)return this;if(this.equals(Gt))return Rg(t).p;let s=ln,i=Gt;for(let o=this;t>0n;o=o.double(),t>>=1n)t&1n?s=s.add(o):n&&(i=i.add(o));return s}multiplyUnsafe(t){return this.multiply(t,!1)}toAffine(){const{X:t,Y:n,Z:s}=this;if(this.equals(ln))return{x:0n,y:1n};const i=mg(s,$e);B(s*i)!==1n&&fe("invalid inverse");const o=B(t*i),a=B(n*i);return{x:o,y:a}}toBytes(){const{x:t,y:n}=this.assertValidity().toAffine(),s=Kl(n);return s[31]|=t&1n?128:0,s}toHex(){return Ul(this.toBytes())}clearCofactor(){return this.multiply(Ss(cg),!1)}isSmallOrder(){return this.clearCofactor().is0()}isTorsionFree(){let t=this.multiply(bs/2n,!1).double();return bs%2n&&(t=t.add(this)),t.is0()}}const Gt=new De(Ua,Ba,1n,B(Ua*Ba)),ln=new De(0n,1n,1n,0n);De.BASE=Gt;De.ZERO=ln;const Kl=e=>Bl(Ol(Ft(e,0n,Oi),Eo)).reverse(),jl=e=>Ss("0x"+Ul(Nl(Ct(e)).reverse())),je=(e,t)=>{let n=e;for(;t-- >0n;)n*=n,n%=$e;return n},bg=e=>{const n=e*e%$e*e%$e,s=je(n,2n)*n%$e,i=je(s,1n)*e%$e,o=je(i,5n)*i%$e,a=je(o,10n)*o%$e,r=je(a,20n)*a%$e,l=je(r,40n)*r%$e,d=je(l,80n)*l%$e,u=je(d,80n)*l%$e,g=je(u,10n)*o%$e;return{pow_p_5_8:je(g,2n)*e%$e,b2:n}},za=0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,yg=(e,t)=>{const n=B(t*t*t),s=B(n*n*t),i=bg(e*s).pow_p_5_8;let o=B(e*n*i);const a=B(t*o*o),r=o,l=B(o*za),d=a===e,u=a===B(-e),g=a===B(-e*za);return d&&(o=r),(u||g)&&(o=l),(B(o)&1n)===1n&&(o=B(-o)),{isValid:d||u,value:o}},Ui=e=>zl(jl(e)),Ro=(...e)=>ql.sha512Async(zn(...e)),xg=(...e)=>vg("sha512")(zn(...e)),Wl=e=>{const t=e.slice(0,qt);t[0]&=248,t[31]&=127,t[31]|=64;const n=e.slice(qt,Eo),s=Ui(t),i=Gt.multiply(s),o=i.toBytes();return{head:t,prefix:n,scalar:s,point:i,pointBytes:o}},Io=e=>Ro(Ct(e,qt)).then(Wl),$g=e=>Wl(xg(Ct(e,qt))),wg=e=>Io(e).then(t=>t.pointBytes),kg=e=>Ro(e.hashable).then(e.finish),Sg=(e,t,n)=>{const{pointBytes:s,scalar:i}=e,o=Ui(t),a=Gt.multiply(o).toBytes();return{hashable:zn(a,s,n),finish:d=>{const u=zl(o+Ui(d)*i);return Ct(zn(a,Kl(u)),Eo)}}},Ag=async(e,t)=>{const n=Ct(e),s=await Io(t),i=await Ro(s.prefix,n);return kg(Sg(s,i,n))},ql={sha512Async:async e=>{const t=fg(),n=zn(e);return Hs(await t.digest("SHA-512",n.buffer))},sha512:void 0},Cg=(e=hg(qt))=>e,Tg={getExtendedPublicKeyAsync:Io,getExtendedPublicKey:$g,randomSecretKey:Cg},As=8,_g=256,Gl=Math.ceil(_g/As)+1,Bi=2**(As-1),Eg=()=>{const e=[];let t=Gt,n=t;for(let s=0;s<Gl;s++){n=t,e.push(n);for(let i=1;i<Bi;i++)n=n.add(t),e.push(n);t=n.double()}return e};let Ka;const ja=(e,t)=>{const n=t.negate();return e?n:t},Rg=e=>{const t=Ka||(Ka=Eg());let n=ln,s=Gt;const i=2**As,o=i,a=Ss(i-1),r=Ss(As);for(let l=0;l<Gl;l++){let d=Number(e&a);e>>=r,d>Bi&&(d-=o,e+=1n);const u=l*Bi,g=u,f=u+Math.abs(d)-1,h=l%2!==0,v=d<0;d===0?s=s.add(ja(h,t[g])):n=n.add(ja(v,t[f]))}return e!==0n&&fe("invalid wnaf"),{p:n,f:s}},ui="openclaw-device-identity-v1";function Hi(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"")}function Vl(e){const t=e.replaceAll("-","+").replaceAll("_","/"),n=t+"=".repeat((4-t.length%4)%4),s=atob(n),i=new Uint8Array(s.length);for(let o=0;o<s.length;o+=1)i[o]=s.charCodeAt(o);return i}function Ig(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function Jl(e){const t=await crypto.subtle.digest("SHA-256",e.slice().buffer);return Ig(new Uint8Array(t))}async function Lg(){const e=Tg.randomSecretKey(),t=await wg(e);return{deviceId:await Jl(t),publicKey:Hi(t),privateKey:Hi(e)}}async function Lo(){try{const n=localStorage.getItem(ui);if(n){const s=JSON.parse(n);if(s?.version===1&&typeof s.deviceId=="string"&&typeof s.publicKey=="string"&&typeof s.privateKey=="string"){const i=await Jl(Vl(s.publicKey));if(i!==s.deviceId){const o={...s,deviceId:i};return localStorage.setItem(ui,JSON.stringify(o)),{deviceId:i,publicKey:s.publicKey,privateKey:s.privateKey}}return{deviceId:s.deviceId,publicKey:s.publicKey,privateKey:s.privateKey}}}}catch{}const e=await Lg(),t={version:1,deviceId:e.deviceId,publicKey:e.publicKey,privateKey:e.privateKey,createdAtMs:Date.now()};return localStorage.setItem(ui,JSON.stringify(t)),e}async function Mg(e,t){const n=Vl(e),s=new TextEncoder().encode(t),i=await Ag(s,n);return Hi(i)}async function Tt(e,t){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,t?.quiet||(e.devicesError=null);try{const n=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(n?.pending)?n.pending:[],paired:Array.isArray(n?.paired)?n.paired:[]}}catch(n){t?.quiet||(e.devicesError=String(n))}finally{e.devicesLoading=!1}}}async function Dg(e,t){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:t}),await Tt(e)}catch(n){e.devicesError=String(n)}}async function Pg(e,t){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:t}),await Tt(e)}catch(s){e.devicesError=String(s)}}async function Fg(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("device.token.rotate",t);if(n?.token){const s=await Lo(),i=n.role??t.role;(n.deviceId===s.deviceId||t.deviceId===s.deviceId)&&Dl({deviceId:s.deviceId,role:i,token:n.token,scopes:n.scopes??t.scopes??[]}),window.prompt("New device token (copy and store securely):",n.token)}await Tt(e)}catch(n){e.devicesError=String(n)}}async function Ng(e,t){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)))try{await e.client.request("device.token.revoke",t);const s=await Lo();t.deviceId===s.deviceId&&Pl({deviceId:s.deviceId,role:t.role}),await Tt(e)}catch(s){e.devicesError=String(s)}}function Og(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.get",params:{nodeId:t}}:null}function Ug(e,t){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:t};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.set",params:{...t,nodeId:n}}:null}async function Mo(e,t){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const n=Og(t);if(!n){e.lastError="Select a node before loading exec approvals.";return}const s=await e.client.request(n.method,n.params);Bg(e,s)}catch(n){e.lastError=String(n)}finally{e.execApprovalsLoading=!1}}}function Bg(e,t){e.execApprovalsSnapshot=t,e.execApprovalsDirty||(e.execApprovalsForm=Wt(t.file??{}))}async function Hg(e,t){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const n=e.execApprovalsSnapshot?.hash;if(!n){e.lastError="Exec approvals hash missing; reload and retry.";return}const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},i=Ug(t,{file:s,baseHash:n});if(!i){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(i.method,i.params),e.execApprovalsDirty=!1,await Mo(e,t)}catch(n){e.lastError=String(n)}finally{e.execApprovalsSaving=!1}}}function zg(e,t,n){const s=Wt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});hl(s,t,n),e.execApprovalsForm=s,e.execApprovalsDirty=!0}function Kg(e,t){const n=Wt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});ml(n,t),e.execApprovalsForm=n,e.execApprovalsDirty=!0}async function Do(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const t=await e.client.request("system-presence",{});Array.isArray(t)?(e.presenceEntries=t,e.presenceStatus=t.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(t){e.presenceError=String(t)}finally{e.presenceLoading=!1}}}async function Jt(e,t){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const n=t?.includeGlobal??e.sessionsIncludeGlobal,s=t?.includeUnknown??e.sessionsIncludeUnknown,i=t?.activeMinutes??bt(e.sessionsFilterActive,0),o=t?.limit??bt(e.sessionsFilterLimit,0),a={includeGlobal:n,includeUnknown:s};i>0&&(a.activeMinutes=i),o>0&&(a.limit=o);const r=await e.client.request("sessions.list",a);r&&(e.sessionsResult=r)}catch(n){e.sessionsError=String(n)}finally{e.sessionsLoading=!1}}}async function jg(e,t,n){if(!e.client||!e.connected)return;const s={key:t};"label"in n&&(s.label=n.label),"thinkingLevel"in n&&(s.thinkingLevel=n.thinkingLevel),"verboseLevel"in n&&(s.verboseLevel=n.verboseLevel),"reasoningLevel"in n&&(s.reasoningLevel=n.reasoningLevel);try{await e.client.request("sessions.patch",s),await Jt(e)}catch(i){e.sessionsError=String(i)}}async function Wg(e,t){if(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${t}"?

Deletes the session entry and archives its transcript.`))return!1;e.sessionsLoading=!0,e.sessionsError=null;try{return await e.client.request("sessions.delete",{key:t,deleteTranscript:!0}),!0}catch(s){return e.sessionsError=String(s),!1}finally{e.sessionsLoading=!1}}async function qg(e,t){return await Wg(e,t)?(await Jt(e),!0):!1}function gn(e,t,n){if(!t.trim())return;const s={...e.skillMessages};n?s[t]=n:delete s[t],e.skillMessages=s}function zs(e){return e instanceof Error?e.message:String(e)}async function Yn(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const n=await e.client.request("skills.status",{});n&&(e.skillsReport=n)}catch(n){e.skillsError=zs(n)}finally{e.skillsLoading=!1}}}function Gg(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function Vg(e,t,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:t,enabled:n}),await Yn(e),gn(e,t,{kind:"success",message:n?"Skill enabled":"Skill disabled"})}catch(s){const i=zs(s);e.skillsError=i,gn(e,t,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function Jg(e,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const n=e.skillEdits[t]??"";await e.client.request("skills.update",{skillKey:t,apiKey:n}),await Yn(e),gn(e,t,{kind:"success",message:"API key saved"})}catch(n){const s=zs(n);e.skillsError=s,gn(e,t,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function Qg(e,t,n,s){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const i=await e.client.request("skills.install",{name:n,installId:s,timeoutMs:12e4});await Yn(e),gn(e,t,{kind:"success",message:i?.message??"Installed"})}catch(i){const o=zs(i);e.skillsError=o,gn(e,t,{kind:"error",message:o})}finally{e.skillsBusyKey=null}}}const Yg=[{label:"chat",tabs:["chat"]},{label:"control",tabs:["overview","channels","instances","sessions","usage","cron"]},{label:"agent",tabs:["agents","skills","nodes"]},{label:"settings",tabs:["config","debug","logs"]}],Ql={agents:"/agents",overview:"/overview",channels:"/channels",instances:"/instances",sessions:"/sessions",usage:"/usage",cron:"/cron",skills:"/skills",nodes:"/nodes",chat:"/chat",config:"/config",debug:"/debug",logs:"/logs"},Yl=new Map(Object.entries(Ql).map(([e,t])=>[t,e]));function fn(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function Kn(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function Ks(e,t=""){const n=fn(t),s=Ql[e];return n?`${n}${s}`:s}function Xl(e,t=""){const n=fn(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let i=Kn(s).toLowerCase();return i.endsWith("/index.html")&&(i="/"),i==="/"?"chat":Yl.get(i)??null}function Xg(e){let t=Kn(e);if(t.endsWith("/index.html")&&(t=Kn(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const i=`/${n.slice(s).join("/")}`.toLowerCase();if(Yl.has(i)){const o=n.slice(0,s);return o.length?`/${o.join("/")}`:""}}return`/${n.join("/")}`}function Zg(e){switch(e){case"agents":return"folder";case"chat":return"messageSquare";case"overview":return"barChart";case"channels":return"link";case"instances":return"radio";case"sessions":return"fileText";case"usage":return"barChart";case"cron":return"loader";case"skills":return"zap";case"nodes":return"monitor";case"config":return"settings";case"debug":return"bug";case"logs":return"scrollText";default:return"folder"}}function zi(e){return F(`tabs.${e}`)}function ep(e){return F(`subtitles.${e}`)}const Zl="openclaw.control.settings.v1";function tp(){const t={gatewayUrl:`${location.protocol==="https:"?"wss":"ws"}://${location.host}`,token:"",sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{}};try{const n=localStorage.getItem(Zl);if(!n)return t;const s=JSON.parse(n);return{gatewayUrl:typeof s.gatewayUrl=="string"&&s.gatewayUrl.trim()?s.gatewayUrl.trim():t.gatewayUrl,token:typeof s.token=="string"?s.token:t.token,sessionKey:typeof s.sessionKey=="string"&&s.sessionKey.trim()?s.sessionKey.trim():t.sessionKey,lastActiveSessionKey:typeof s.lastActiveSessionKey=="string"&&s.lastActiveSessionKey.trim()?s.lastActiveSessionKey.trim():typeof s.sessionKey=="string"&&s.sessionKey.trim()||t.lastActiveSessionKey,theme:s.theme==="light"||s.theme==="dark"||s.theme==="system"?s.theme:t.theme,chatFocusMode:typeof s.chatFocusMode=="boolean"?s.chatFocusMode:t.chatFocusMode,chatShowThinking:typeof s.chatShowThinking=="boolean"?s.chatShowThinking:t.chatShowThinking,splitRatio:typeof s.splitRatio=="number"&&s.splitRatio>=.4&&s.splitRatio<=.7?s.splitRatio:t.splitRatio,navCollapsed:typeof s.navCollapsed=="boolean"?s.navCollapsed:t.navCollapsed,navGroupsCollapsed:typeof s.navGroupsCollapsed=="object"&&s.navGroupsCollapsed!==null?s.navGroupsCollapsed:t.navGroupsCollapsed,locale:ho(s.locale)?s.locale:void 0}}catch{return t}}function np(e){localStorage.setItem(Zl,JSON.stringify(e))}const is=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,sp=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,os=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},ip=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const i=globalThis.document??null;if(!i){t();return}const o=i.documentElement,a=i,r=sp();if(!!a.startViewTransition&&!r){let d=.5,u=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")d=is(n.pointerClientX/window.innerWidth),u=is(n.pointerClientY/window.innerHeight);else if(n?.element){const g=n.element.getBoundingClientRect();g.width>0&&g.height>0&&typeof window<"u"&&(d=is((g.left+g.width/2)/window.innerWidth),u=is((g.top+g.height/2)/window.innerHeight))}o.style.setProperty("--theme-switch-x",`${d*100}%`),o.style.setProperty("--theme-switch-y",`${u*100}%`),o.classList.add("theme-transition");try{const g=a.startViewTransition?.(()=>{t()});g?.finished?g.finished.finally(()=>os(o)):os(o)}catch{os(o),t()}return}t(),os(o)};function op(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function Po(e){return e==="system"?op():e}function St(e,t){const n={...t,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||t.sessionKey.trim()||"main"};e.settings=n,np(n),t.theme!==e.theme&&(e.theme=t.theme,js(e,Po(t.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function ec(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&St(e,{...e.settings,lastActiveSessionKey:n})}function ap(e){if(!window.location.search&&!window.location.hash)return;const t=new URL(window.location.href),n=new URLSearchParams(t.search),s=new URLSearchParams(t.hash.startsWith("#")?t.hash.slice(1):t.hash),i=n.get("token")??s.get("token"),o=n.get("password")??s.get("password"),a=n.get("session")??s.get("session"),r=n.get("gatewayUrl")??s.get("gatewayUrl");let l=!1;if(i!=null){const u=i.trim();u&&u!==e.settings.token&&St(e,{...e.settings,token:u}),n.delete("token"),s.delete("token"),l=!0}if(o!=null&&(n.delete("password"),s.delete("password"),l=!0),a!=null){const u=a.trim();u&&(e.sessionKey=u,St(e,{...e.settings,sessionKey:u,lastActiveSessionKey:u}))}if(r!=null){const u=r.trim();u&&u!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=u),n.delete("gatewayUrl"),s.delete("gatewayUrl"),l=!0}if(!l)return;t.search=n.toString();const d=s.toString();t.hash=d?`#${d}`:"",window.history.replaceState({},"",t.toString())}function rp(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="logs"?bo(e):yo(e),t==="debug"?xo(e):$o(e),Fo(e),nc(e,t,!1)}function lp(e,t,n){ip({nextTheme:t,applyTheme:()=>{e.theme=t,St(e,{...e.settings,theme:t}),js(e,Po(t))},context:n,currentTheme:e.theme})}async function Fo(e){if(e.tab==="overview"&&await sc(e),e.tab==="channels"&&await mp(e),e.tab==="instances"&&await Do(e),e.tab==="sessions"&&await Jt(e),e.tab==="cron"&&await Cs(e),e.tab==="skills"&&await Yn(e),e.tab==="agents"){await wo(e),await Ln(e),await Be(e);const t=e.agentsList?.agents?.map(s=>s.id)??[];t.length>0&&Al(e,t);const n=e.agentsSelectedId??e.agentsList?.defaultId??e.agentsList?.agents?.[0]?.id;n&&(Sl(e,n),e.agentsPanel==="skills"&&vs(e,n),e.agentsPanel==="channels"&&Ee(e,!1),e.agentsPanel==="cron"&&Cs(e))}e.tab==="nodes"&&(await Us(e),await Tt(e),await Be(e),await Mo(e)),e.tab==="chat"&&(await fc(e),Gn(e,!e.chatHasAutoScrolled)),e.tab==="config"&&(await vl(e),await Be(e)),e.tab==="debug"&&(await Os(e),e.eventLog=e.eventLogBuffer),e.tab==="logs"&&(e.logsAtBottom=!0,await vo(e,{reset:!0}),kl(e,!0))}function cp(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?fn(e):Xg(window.location.pathname)}function dp(e){e.theme=e.settings.theme??"system",js(e,Po(e.theme))}function js(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t}function up(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&js(e,n.matches?"dark":"light")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function gp(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function pp(e,t){if(typeof window>"u")return;const n=Xl(window.location.pathname,e.basePath)??"chat";tc(e,n),nc(e,n,t)}function fp(e){if(typeof window>"u")return;const t=Xl(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();s&&(e.sessionKey=s,St(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s})),tc(e,t)}function tc(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="logs"?bo(e):yo(e),t==="debug"?xo(e):$o(e),e.connected&&Fo(e)}function nc(e,t,n){if(typeof window>"u")return;const s=Kn(Ks(t,e.basePath)),i=Kn(window.location.pathname),o=new URL(window.location.href);t==="chat"&&e.sessionKey?o.searchParams.set("session",e.sessionKey):o.searchParams.delete("session"),i!==s&&(o.pathname=s),n?window.history.replaceState({},"",o.toString()):window.history.pushState({},"",o.toString())}function hp(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),window.history.replaceState({},"",s.toString())}async function sc(e){await Promise.all([Ee(e,!1),Do(e),Jt(e),Jn(e),Os(e)])}async function mp(e){await Promise.all([Ee(e,!0),vl(e),Be(e)])}async function Cs(e){const t=e;if(await Promise.all([Ee(e,!1),Jn(t),Bs(t),Ku(t)]),t.cronRunsScope==="all"){await yt(t,null);return}t.cronRunsJobId&&await yt(t,t.cronRunsJobId)}const Wa=50,vp=80,bp=12e4;function Pe(e){if(typeof e!="string")return null;const t=e.trim();return t||null}function sn(e,t){const n=Pe(t);if(!n)return null;const s=Pe(e);if(s){const o=`${s}/`;if(n.toLowerCase().startsWith(o.toLowerCase())){const a=n.slice(o.length).trim();if(a)return`${s}/${a}`}return`${s}/${n}`}const i=n.indexOf("/");if(i>0){const o=n.slice(0,i).trim(),a=n.slice(i+1).trim();if(o&&a)return`${o}/${a}`}return n}function yp(e){return Array.isArray(e)?e.map(t=>Pe(t)).filter(t=>!!t):[]}function xp(e){if(!Array.isArray(e))return[];const t=[];for(const n of e){if(!n||typeof n!="object")continue;const s=n,i=Pe(s.provider),o=Pe(s.model);if(!i||!o)continue;const a=Pe(s.reason)?.replace(/_/g," ")??Pe(s.code)??(typeof s.status=="number"?`HTTP ${s.status}`:null)??Pe(s.error)??"error";t.push({provider:i,model:o,reason:a})}return t}function $p(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(i=>{if(!i||typeof i!="object")return null;const o=i;return o.type==="text"&&typeof o.text=="string"?o.text:null}).filter(i=>!!i);return s.length===0?null:s.join(`
`)}function qa(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=$p(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=String(e)}const s=Tl(n,bp);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function wp(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function kp(e){if(e.toolStreamOrder.length<=Wa)return;const t=e.toolStreamOrder.length-Wa,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function Sp(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function Ki(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),Sp(e)}function Ap(e,t=!1){if(t){Ki(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>Ki(e),vp))}function Ws(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],Ki(e)}const Cp=5e3,Tp=8e3;function _p(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},Cp))}function ic(e,t,n){const s=typeof t.sessionKey=="string"?t.sessionKey:void 0;return s&&s!==e.sessionKey?{accepted:!1}:!e.chatRunId&&n?.allowSessionScopedWhenIdle&&s?{accepted:!0,sessionKey:s}:!s&&e.chatRunId&&t.runId!==e.chatRunId?{accepted:!1}:e.chatRunId&&t.runId!==e.chatRunId?{accepted:!1}:e.chatRunId?{accepted:!0,sessionKey:s}:{accepted:!1}}function Ep(e,t){const n=t.data??{},s=t.stream==="fallback"?"fallback":Pe(n.phase);if(t.stream==="lifecycle"&&s!=="fallback"&&s!=="fallback_cleared"||!ic(e,t,{allowSessionScopedWhenIdle:!0}).accepted)return;const o=sn(n.selectedProvider,n.selectedModel)??sn(n.fromProvider,n.fromModel),a=sn(n.activeProvider,n.activeModel)??sn(n.toProvider,n.toModel),r=sn(n.previousActiveProvider,n.previousActiveModel)??Pe(n.previousActiveModel);if(!o||!a||s==="fallback"&&o===a)return;const l=Pe(n.reasonSummary)??Pe(n.reason),d=(()=>{const u=yp(n.attemptSummaries);return u.length>0?u:xp(n.attempts).map(g=>`${sn(g.provider,g.model)??`${g.provider}/${g.model}`}: ${g.reason}`)})();e.fallbackClearTimer!=null&&(window.clearTimeout(e.fallbackClearTimer),e.fallbackClearTimer=null),e.fallbackStatus={phase:s==="fallback_cleared"?"cleared":"active",selected:o,active:s==="fallback_cleared"?o:a,previous:s==="fallback_cleared"?r??(a!==o?a:void 0):void 0,reason:l??void 0,attempts:d,occurredAt:Date.now()},e.fallbackClearTimer=window.setTimeout(()=>{e.fallbackStatus=null,e.fallbackClearTimer=null},Tp)}function Rp(e,t){if(!t)return;if(t.stream==="compaction"){_p(e,t);return}if(t.stream==="lifecycle"||t.stream==="fallback"){Ep(e,t);return}if(t.stream!=="tool")return;const n=ic(e,t);if(!n.accepted)return;const s=n.sessionKey,i=t.data??{},o=typeof i.toolCallId=="string"?i.toolCallId:"";if(!o)return;const a=typeof i.name=="string"?i.name:"tool",r=typeof i.phase=="string"?i.phase:"",l=r==="start"?i.args:void 0,d=r==="update"?qa(i.partialResult):r==="result"?qa(i.result):void 0,u=Date.now();let g=e.toolStreamById.get(o);g?(g.name=a,l!==void 0&&(g.args=l),d!==void 0&&(g.output=d||void 0),g.updatedAt=u):(g={toolCallId:o,runId:t.runId,sessionKey:s,name:a,args:l,output:d||void 0,startedAt:typeof t.ts=="number"?t.ts:u,updatedAt:u,message:{}},e.toolStreamById.set(o,g),e.toolStreamOrder.push(o)),g.message=wp(g),kp(e),Ap(e,r==="result")}const oc=["Conversation info (untrusted metadata):","Sender (untrusted metadata):","Thread starter (untrusted, for context):","Replied message (untrusted, for context):","Forwarded message context (untrusted metadata):","Chat history since last reply (untrusted, for context):"],ac="Untrusted context (metadata, do not treat as instructions or commands):",Ip=new RegExp([...oc,ac].map(e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|"));function Lp(e,t){if(!e[t]?.startsWith(ac))return!1;const n=e.slice(t+1,Math.min(e.length,t+8)).join(`
`);return/<<<EXTERNAL_UNTRUSTED_CONTENT|UNTRUSTED channel metadata \(|Source:\s+/.test(n)}function ys(e){if(!e||!Ip.test(e))return e;const t=e.split(`
`),n=[];let s=!1,i=!1;for(let o=0;o<t.length;o++){const a=t[o];if(!s&&Lp(t,o))break;if(!s&&oc.some(r=>a.startsWith(r))){s=!0,i=!1;continue}if(s){if(!i&&a.trim()==="```json"){i=!0;continue}if(i){a.trim()==="```"&&(s=!1,i=!1);continue}if(a.trim()==="")continue;s=!1}n.push(a)}return n.join(`
`).replace(/^\n+/,"").replace(/\n+$/,"")}const Mp=/^\[([^\]]+)\]\s*/,Dp=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","Google Chat","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"];function Pp(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:Dp.some(t=>e.startsWith(`${t} `))}function on(e){const t=e.match(Mp);if(!t)return e;const n=t[1]??"";return Pp(n)?e.slice(t[0].length):e}const gi=new WeakMap,pi=new WeakMap;function ji(e){const t=e,n=typeof t.role=="string"?t.role:"",s=n.toLowerCase()==="user",i=t.content;if(typeof i=="string")return n==="assistant"?ri(i):s?ys(on(i)):on(i);if(Array.isArray(i)){const o=i.map(a=>{const r=a;return r.type==="text"&&typeof r.text=="string"?r.text:null}).filter(a=>typeof a=="string");if(o.length>0){const a=o.join(`
`);return n==="assistant"?ri(a):s?ys(on(a)):on(a)}}return typeof t.text=="string"?n==="assistant"?ri(t.text):s?ys(on(t.text)):on(t.text):null}function rc(e){if(!e||typeof e!="object")return ji(e);const t=e;if(gi.has(t))return gi.get(t)??null;const n=ji(e);return gi.set(t,n),n}function Ga(e){const n=e.content,s=[];if(Array.isArray(n))for(const r of n){const l=r;if(l.type==="thinking"&&typeof l.thinking=="string"){const d=l.thinking.trim();d&&s.push(d)}}if(s.length>0)return s.join(`
`);const i=Np(e);if(!i)return null;const a=[...i.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(r=>(r[1]??"").trim()).filter(Boolean);return a.length>0?a.join(`
`):null}function Fp(e){if(!e||typeof e!="object")return Ga(e);const t=e;if(pi.has(t))return pi.get(t)??null;const n=Ga(e);return pi.set(t,n),n}function Np(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(i=>{const o=i;return o.type==="text"&&typeof o.text=="string"?o.text:null}).filter(i=>typeof i=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function Op(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}let Va=!1;function Ja(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function Up(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function Bp(){Va||(Va=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function qs(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),Ja(t)}return Bp(),Ja(Up())}async function jn(e){if(!(!e.client||!e.connected)){e.chatLoading=!0,e.lastError=null;try{const t=await e.client.request("chat.history",{sessionKey:e.sessionKey,limit:200});e.chatMessages=Array.isArray(t.messages)?t.messages:[],e.chatThinkingLevel=t.thinkingLevel??null}catch(t){e.lastError=String(t)}finally{e.chatLoading=!1}}}function Hp(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}function lc(e,t){if(!e||typeof e!="object")return null;const n=e,s=n.role;if(typeof s=="string"){if((t.roleCaseSensitive?s:s.toLowerCase())!=="assistant")return null}else if(t.roleRequirement==="required")return null;return t.requireContentArray?Array.isArray(n.content)?n:null:!("content"in n)&&!(t.allowTextField&&"text"in n)?null:n}function zp(e){return lc(e,{roleRequirement:"required",roleCaseSensitive:!0,requireContentArray:!0})}function Qa(e){return lc(e,{roleRequirement:"optional",allowTextField:!0})}async function Kp(e,t,n){if(!e.client||!e.connected)return null;const s=t.trim(),i=n&&n.length>0;if(!s&&!i)return null;const o=Date.now(),a=[];if(s&&a.push({type:"text",text:s}),i)for(const d of n)a.push({type:"image",source:{type:"base64",media_type:d.mimeType,data:d.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:a,timestamp:o}],e.chatSending=!0,e.lastError=null;const r=qs();e.chatRunId=r,e.chatStream="",e.chatStreamStartedAt=o;const l=i?n.map(d=>{const u=Hp(d.dataUrl);return u?{type:"image",mimeType:u.mimeType,content:u.content}:null}).filter(d=>d!==null):void 0;try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:s,deliver:!1,idempotencyKey:r,attachments:l}),r}catch(d){const u=String(d);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=u,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+u}],timestamp:Date.now()}],null}finally{e.chatSending=!1}}async function jp(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function Wp(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId){if(t.state==="final"){const n=Qa(t.message);return n?(e.chatMessages=[...e.chatMessages,n],null):"final"}return null}if(t.state==="delta"){const n=ji(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final"){const n=Qa(t.message);n&&(e.chatMessages=[...e.chatMessages,n]),e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null}else if(t.state==="aborted"){const n=zp(t.message);if(n)e.chatMessages=[...e.chatMessages,n];else{const s=e.chatStream??"";s.trim()&&(e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:s}],timestamp:Date.now()}])}e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null}else t.state==="error"&&(e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,e.lastError=t.errorMessage??"chat error");return t.state}const cc=120;function dc(e){return e.chatSending||!!e.chatRunId}function qp(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function Gp(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function uc(e){e.connected&&(e.chatMessage="",await jp(e))}function Vp(e,t,n,s){const i=t.trim(),o=!!(n&&n.length>0);!i&&!o||(e.chatQueue=[...e.chatQueue,{id:qs(),text:i,createdAt:Date.now(),attachments:o?n?.map(a=>({...a})):void 0,refreshSessions:s}])}async function gc(e,t,n){Ws(e);const s=await Kp(e,t,n?.attachments),i=!!s;return!i&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!i&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),i&&ec(e,e.sessionKey),i&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),i&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),Gn(e),i&&!e.chatRunId&&pc(e),i&&n?.refreshSessions&&s&&e.refreshSessionsAfterChat.add(s),i}async function pc(e){if(!e.connected||dc(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await gc(e,t.text,{attachments:t.attachments,refreshSessions:t.refreshSessions})||(e.chatQueue=[t,...e.chatQueue])}function Jp(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function Qp(e,t,n){if(!e.connected)return;const s=e.chatMessage,i=(t??e.chatMessage).trim(),o=e.chatAttachments??[],a=t==null?o:[],r=a.length>0;if(!i&&!r)return;if(qp(i)){await uc(e);return}const l=Gp(i);if(t==null&&(e.chatMessage="",e.chatAttachments=[]),dc(e)){Vp(e,i,a,l);return}await gc(e,i,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:r?a:void 0,previousAttachments:t==null?o:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:l})}async function fc(e,t){await Promise.all([jn(e),Jt(e,{activeMinutes:cc}),Wi(e)]),t?.scheduleScroll!==!1&&Gn(e)}const Yp=pc;function Xp(e){const t=wl(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function Zp(e,t){const n=fn(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function Wi(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=Xp(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=Zp(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const i=await s.json(),o=typeof i.avatarUrl=="string"?i.avatarUrl.trim():"";e.chatAvatarUrl=o||null}catch{e.chatAvatarUrl=null}}const ef="update.available";function tf(e){if(!e||e.state!=="final")return!1;if(!e.message||typeof e.message!="object")return!0;const t=e.message,n=typeof t.role=="string"?t.role.toLowerCase():"";return!!(n&&n!=="assistant")}const nf=50,sf=200,of="Assistant";function Ya(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function No(e){const t=Ya(e?.name,nf)??of,n=Ya(e?.avatar??void 0,sf)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}async function hc(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const i=await e.client.request("agent.identity.get",s);if(!i)return;const o=No(i);e.assistantName=o.name,e.assistantAvatar=o.avatar,e.assistantAgentId=o.agentId??null}catch{}}function qi(e){return typeof e=="object"&&e!==null}function af(e){if(!qi(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!qi(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const i=typeof e.createdAtMs=="number"?e.createdAtMs:0,o=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!i||!o?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:i,expiresAtMs:o}}function rf(e){if(!qi(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function mc(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function lf(e,t){const n=mc(e).filter(s=>s.id!==t.id);return n.push(t),n}function Xa(e,t){return mc(e).filter(n=>n.id!==t)}function cf(e){const t=e.scopes.join(","),n=e.token??"";return["v2",e.deviceId,e.clientId,e.clientMode,e.role,t,String(e.signedAtMs),n,e.nonce].join("|")}const vc={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},Za=vc,Gi={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(vc));new Set(Object.values(Gi));const be={AUTH_REQUIRED:"AUTH_REQUIRED",AUTH_UNAUTHORIZED:"AUTH_UNAUTHORIZED",AUTH_TOKEN_MISSING:"AUTH_TOKEN_MISSING",AUTH_TOKEN_MISMATCH:"AUTH_TOKEN_MISMATCH",AUTH_TOKEN_NOT_CONFIGURED:"AUTH_TOKEN_NOT_CONFIGURED",AUTH_PASSWORD_MISSING:"AUTH_PASSWORD_MISSING",AUTH_PASSWORD_MISMATCH:"AUTH_PASSWORD_MISMATCH",AUTH_PASSWORD_NOT_CONFIGURED:"AUTH_PASSWORD_NOT_CONFIGURED",AUTH_DEVICE_TOKEN_MISMATCH:"AUTH_DEVICE_TOKEN_MISMATCH",AUTH_RATE_LIMITED:"AUTH_RATE_LIMITED",AUTH_TAILSCALE_IDENTITY_MISSING:"AUTH_TAILSCALE_IDENTITY_MISSING",AUTH_TAILSCALE_PROXY_MISSING:"AUTH_TAILSCALE_PROXY_MISSING",AUTH_TAILSCALE_WHOIS_FAILED:"AUTH_TAILSCALE_WHOIS_FAILED",AUTH_TAILSCALE_IDENTITY_MISMATCH:"AUTH_TAILSCALE_IDENTITY_MISMATCH",CONTROL_UI_DEVICE_IDENTITY_REQUIRED:"CONTROL_UI_DEVICE_IDENTITY_REQUIRED",DEVICE_IDENTITY_REQUIRED:"DEVICE_IDENTITY_REQUIRED",PAIRING_REQUIRED:"PAIRING_REQUIRED"};function df(e){if(!e||typeof e!="object"||Array.isArray(e))return null;const t=e.code;return typeof t=="string"&&t.trim().length>0?t:null}class er extends Error{constructor(t){super(t.message),this.name="GatewayRequestError",this.gatewayCode=t.code,this.details=t.details}}function uf(e){return df(e?.details)}const gf=4008;class pf{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.pendingConnectError=void 0,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??""),s=this.pendingConnectError;this.pendingConnectError=void 0,this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n,error:s}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.approvals","operator.pairing"],s="operator";let i=null,o=!1,a=this.opts.token;if(t){i=await Lo();const u=lg({deviceId:i.deviceId,role:s})?.token;a=u??this.opts.token,o=!!(u&&this.opts.token)}const r=a||this.opts.password?{token:a,password:this.opts.password}:void 0;let l;if(t&&i){const u=Date.now(),g=this.connectNonce??"",f=cf({deviceId:i.deviceId,clientId:this.opts.clientName??Za.CONTROL_UI,clientMode:this.opts.mode??Gi.WEBCHAT,role:s,scopes:n,signedAtMs:u,token:a??null,nonce:g}),h=await Mg(i.privateKey,f);l={id:i.deviceId,publicKey:i.publicKey,signature:h,signedAt:u,nonce:g}}const d={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??Za.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??Gi.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:l,caps:[],auth:r,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",d).then(u=>{u?.auth?.deviceToken&&i&&Dl({deviceId:i.deviceId,role:u.auth.role??s,token:u.auth.deviceToken,scopes:u.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(u)}).catch(u=>{u instanceof er?this.pendingConnectError={code:u.gatewayCode,message:u.message,details:u.details}:this.pendingConnectError=void 0,o&&i&&Pl({deviceId:i.deviceId,role:s}),this.ws?.close(gf,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const i=n;if(i.event==="connect.challenge"){const a=i.payload,r=a&&typeof a.nonce=="string"?a.nonce:null;r&&(this.connectNonce=r,this.sendConnect());return}const o=typeof i.seq=="number"?i.seq:null;o!==null&&(this.lastSeq!==null&&o>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:o}),this.lastSeq=o);try{this.opts.onEvent?.(i)}catch(a){console.error("[gateway] event handler error:",a)}return}if(s.type==="res"){const i=n,o=this.pending.get(i.id);if(!o)return;this.pending.delete(i.id),i.ok?o.resolve(i.payload):o.reject(new er({code:i.error?.code??"UNAVAILABLE",message:i.error?.message??"request failed",details:i.error?.details}));return}}request(t,n){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const s=qs(),i={type:"req",id:s,method:t,params:n},o=new Promise((a,r)=>{this.pending.set(s,{resolve:l=>a(l),reject:r})});return this.ws.send(JSON.stringify(i)),o}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}function fi(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const i=t.mainKey?.trim()||"main",o=t.defaultAgentId?.trim();return n==="main"||n===i||o&&(n===`agent:${o}:main`||n===`agent:${o}:${i}`)?s:n}function ff(e,t){if(!t?.mainSessionKey)return;const n=fi(e.sessionKey,t),s=fi(e.settings.sessionKey,t),i=fi(e.settings.lastActiveSessionKey,t),o=n||s||e.sessionKey,a={...e.settings,sessionKey:s||o,lastActiveSessionKey:i||o},r=a.sessionKey!==e.settings.sessionKey||a.lastActiveSessionKey!==e.settings.lastActiveSessionKey;o!==e.sessionKey&&(e.sessionKey=o),r&&St(e,a)}function bc(e){e.lastError=null,e.lastErrorCode=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null;const t=e.client,n=new pf({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",instanceId:e.clientInstanceId,onHello:s=>{e.client===n&&(e.connected=!0,e.lastError=null,e.lastErrorCode=null,e.hello=s,yf(e,s),e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,Ws(e),hc(e),wo(e),Ln(e),Us(e,{quiet:!0}),Tt(e,{quiet:!0}),Fo(e))},onClose:({code:s,reason:i,error:o})=>{if(e.client===n)if(e.connected=!1,e.lastErrorCode=uf(o)??(typeof o?.code=="string"?o.code:null),s!==1012){if(o?.message){e.lastError=o.message;return}e.lastError=`disconnected (${s}): ${i||"no reason"}`}else e.lastError=null,e.lastErrorCode=null},onEvent:s=>{e.client===n&&hf(e,s)},onGap:({expected:s,received:i})=>{e.client===n&&(e.lastError=`event gap detected (expected seq ${s}, got ${i}); refresh recommended`,e.lastErrorCode=null)}});e.client=n,t?.stop(),n.start()}function hf(e,t){try{bf(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function mf(e,t,n){if(n!=="final"&&n!=="error"&&n!=="aborted")return;Ws(e),Yp(e);const s=t?.runId;!s||!e.refreshSessionsAfterChat.has(s)||(e.refreshSessionsAfterChat.delete(s),n==="final"&&Jt(e,{activeMinutes:cc}))}function vf(e,t){t?.sessionKey&&ec(e,t.sessionKey);const n=Wp(e,t);mf(e,t,n),n==="final"&&tf(t)&&jn(e)}function bf(e,t){if(e.eventLogBuffer=[{ts:Date.now(),event:t.event,payload:t.payload},...e.eventLogBuffer].slice(0,250),e.tab==="debug"&&(e.eventLog=e.eventLogBuffer),t.event==="agent"){if(e.onboarding)return;Rp(e,t.payload);return}if(t.event==="chat"){vf(e,t.payload);return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&Cs(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&Tt(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=af(t.payload);if(n){e.execApprovalQueue=lf(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=Xa(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.approval.resolved"){const n=rf(t.payload);n&&(e.execApprovalQueue=Xa(e.execApprovalQueue,n.id));return}if(t.event===ef){const n=t.payload;e.updateAvailable=n?.updateAvailable??null}}function yf(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&ff(e,n.sessionDefaults),e.updateAvailable=n?.updateAvailable??null}const tr="/__openclaw/control-ui-config.json";async function xf(e){if(typeof window>"u"||typeof fetch!="function")return;const t=fn(e.basePath??""),n=t?`${t}${tr}`:tr;try{const s=await fetch(n,{method:"GET",headers:{Accept:"application/json"},credentials:"same-origin"});if(!s.ok)return;const i=await s.json(),o=No({agentId:i.assistantAgentId??null,name:i.assistantName,avatar:i.assistantAvatar??null});e.assistantName=o.name,e.assistantAvatar=o.avatar,e.assistantAgentId=o.agentId??null}catch{}}function $f(e){e.basePath=cp(),xf(e),ap(e),pp(e,!0),dp(e),up(e),window.addEventListener("popstate",e.popStateHandler),bc(e),Pu(e),e.tab==="logs"&&bo(e),e.tab==="debug"&&xo(e)}function wf(e){_u(e)}function kf(e){window.removeEventListener("popstate",e.popStateHandler),Fu(e),yo(e),$o(e),e.client?.stop(),e.client=null,e.connected=!1,gp(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function Sf(e,t){if(!(e.tab==="chat"&&e.chatManualRefreshInFlight)){if(e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("tab"))){const n=t.has("tab"),s=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;Gn(e,n||s||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&kl(e,t.has("tab")||t.has("logsAutoFollow"))}}const yc="openclaw.control.usage.date-params.v1",Af="__default__",Cf=/unexpected property ['"]mode['"]/i,Tf=/unexpected property ['"]utcoffset['"]/i,_f=/invalid sessions\.usage params/i;let hi=null;function xc(){return typeof window<"u"&&window.localStorage?window.localStorage:typeof localStorage<"u"?localStorage:null}function Ef(){const e=xc();if(!e)return new Set;try{const t=e.getItem(yc);if(!t)return new Set;const n=JSON.parse(t);return!n||!Array.isArray(n.unsupportedGatewayKeys)?new Set:new Set(n.unsupportedGatewayKeys.filter(s=>typeof s=="string").map(s=>s.trim()).filter(Boolean))}catch{return new Set}}function Rf(e){const t=xc();if(t)try{t.setItem(yc,JSON.stringify({unsupportedGatewayKeys:Array.from(e)}))}catch{}}function $c(){return hi||(hi=Ef()),hi}function If(e){const t=e?.trim();if(!t)return Af;try{const n=new URL(t),s=n.pathname==="/"?"":n.pathname;return`${n.protocol}//${n.host}${s}`.toLowerCase()}catch{return t.toLowerCase()}}function wc(e){return If(e.settings?.gatewayUrl)}function Lf(e){return!$c().has(wc(e))}function Mf(e){const t=$c();t.add(wc(e)),Rf(t)}function Df(e){const t=kc(e);return _f.test(t)&&(Cf.test(t)||Tf.test(t))}const Pf=e=>{const t=-e,n=t>=0?"+":"-",s=Math.abs(t),i=Math.floor(s/60),o=s%60;return o===0?`UTC${n}${i}`:`UTC${n}${i}:${o.toString().padStart(2,"0")}`},Ff=(e,t)=>{if(t)return e==="utc"?{mode:"utc"}:{mode:"specific",utcOffset:Pf(new Date().getTimezoneOffset())}};function kc(e){if(typeof e=="string")return e;if(e instanceof Error&&typeof e.message=="string"&&e.message.trim())return e.message;if(e&&typeof e=="object")try{const t=JSON.stringify(e);if(t)return t}catch{}return"request failed"}async function Vi(e,t){const n=e.client;if(!(!n||!e.connected)&&!e.usageLoading){e.usageLoading=!0,e.usageError=null;try{const s=t?.startDate??e.usageStartDate,i=t?.endDate??e.usageEndDate,o=async l=>{const d=Ff(e.usageTimeZone,l);return await Promise.all([n.request("sessions.usage",{startDate:s,endDate:i,...d,limit:1e3,includeContextWeight:!0}),n.request("usage.cost",{startDate:s,endDate:i,...d})])},a=(l,d)=>{l&&(e.usageResult=l),d&&(e.usageCostSummary=d)},r=Lf(e);try{const[l,d]=await o(r);a(l,d)}catch(l){if(r&&Df(l)){Mf(e);const[d,u]=await o(!1);a(d,u)}else throw l}}catch(s){e.usageError=kc(s)}finally{e.usageLoading=!1}}}async function Nf(e,t){if(!(!e.client||!e.connected)&&!e.usageTimeSeriesLoading){e.usageTimeSeriesLoading=!0,e.usageTimeSeries=null;try{const n=await e.client.request("sessions.usage.timeseries",{key:t});n&&(e.usageTimeSeries=n)}catch{e.usageTimeSeries=null}finally{e.usageTimeSeriesLoading=!1}}}async function Of(e,t){if(!(!e.client||!e.connected)&&!e.usageSessionLogsLoading){e.usageSessionLogsLoading=!0,e.usageSessionLogs=null;try{const n=await e.client.request("sessions.usage.logs",{key:t,limit:1e3});n&&Array.isArray(n.logs)&&(e.usageSessionLogs=n.logs)}catch{e.usageSessionLogs=null}finally{e.usageSessionLogsLoading=!1}}}const Uf=new Set(["agent","channel","chat","provider","model","tool","label","key","session","id","has","mintokens","maxtokens","mincost","maxcost","minmessages","maxmessages"]),Ts=e=>e.trim().toLowerCase(),Bf=e=>{const t=e.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp(`^${t}$`,"i")},Nt=e=>{let t=e.trim().toLowerCase();if(!t)return null;t.startsWith("$")&&(t=t.slice(1));let n=1;t.endsWith("k")?(n=1e3,t=t.slice(0,-1)):t.endsWith("m")&&(n=1e6,t=t.slice(0,-1));const s=Number(t);return Number.isFinite(s)?s*n:null},Oo=e=>(e.match(/"[^"]+"|\S+/g)??[]).map(n=>{const s=n.replace(/^"|"$/g,""),i=s.indexOf(":");if(i>0){const o=s.slice(0,i),a=s.slice(i+1);return{key:o,value:a,raw:s}}return{value:s,raw:s}}),Hf=e=>[e.label,e.key,e.sessionId].filter(n=>!!n).map(n=>n.toLowerCase()),nr=e=>{const t=new Set;e.modelProvider&&t.add(e.modelProvider.toLowerCase()),e.providerOverride&&t.add(e.providerOverride.toLowerCase()),e.origin?.provider&&t.add(e.origin.provider.toLowerCase());for(const n of e.usage?.modelUsage??[])n.provider&&t.add(n.provider.toLowerCase());return Array.from(t)},sr=e=>{const t=new Set;e.model&&t.add(e.model.toLowerCase());for(const n of e.usage?.modelUsage??[])n.model&&t.add(n.model.toLowerCase());return Array.from(t)},zf=e=>(e.usage?.toolUsage?.tools??[]).map(t=>t.name.toLowerCase()),Kf=(e,t)=>{const n=Ts(t.value??"");if(!n)return!0;if(!t.key)return Hf(e).some(i=>i.includes(n));switch(Ts(t.key)){case"agent":return e.agentId?.toLowerCase().includes(n)??!1;case"channel":return e.channel?.toLowerCase().includes(n)??!1;case"chat":return e.chatType?.toLowerCase().includes(n)??!1;case"provider":return nr(e).some(i=>i.includes(n));case"model":return sr(e).some(i=>i.includes(n));case"tool":return zf(e).some(i=>i.includes(n));case"label":return e.label?.toLowerCase().includes(n)??!1;case"key":case"session":case"id":if(n.includes("*")||n.includes("?")){const i=Bf(n);return i.test(e.key)||(e.sessionId?i.test(e.sessionId):!1)}return e.key.toLowerCase().includes(n)||(e.sessionId?.toLowerCase().includes(n)??!1);case"has":switch(n){case"tools":return(e.usage?.toolUsage?.totalCalls??0)>0;case"errors":return(e.usage?.messageCounts?.errors??0)>0;case"context":return!!e.contextWeight;case"usage":return!!e.usage;case"model":return sr(e).length>0;case"provider":return nr(e).length>0;default:return!0}case"mintokens":{const i=Nt(n);return i===null?!0:(e.usage?.totalTokens??0)>=i}case"maxtokens":{const i=Nt(n);return i===null?!0:(e.usage?.totalTokens??0)<=i}case"mincost":{const i=Nt(n);return i===null?!0:(e.usage?.totalCost??0)>=i}case"maxcost":{const i=Nt(n);return i===null?!0:(e.usage?.totalCost??0)<=i}case"minmessages":{const i=Nt(n);return i===null?!0:(e.usage?.messageCounts?.total??0)>=i}case"maxmessages":{const i=Nt(n);return i===null?!0:(e.usage?.messageCounts?.total??0)<=i}default:return!0}},jf=(e,t)=>{const n=Oo(t);if(n.length===0)return{sessions:e,warnings:[]};const s=[];for(const o of n){if(!o.key)continue;const a=Ts(o.key);if(!Uf.has(a)){s.push(`Unknown filter: ${o.key}`);continue}if(o.value===""&&s.push(`Missing value for ${o.key}`),a==="has"){const r=new Set(["tools","errors","context","usage","model","provider"]);o.value&&!r.has(Ts(o.value))&&s.push(`Unknown has:${o.value}`)}["mintokens","maxtokens","mincost","maxcost","minmessages","maxmessages"].includes(a)&&o.value&&Nt(o.value)===null&&s.push(`Invalid number for ${o.key}`)}return{sessions:e.filter(o=>n.every(a=>Kf(o,a))),warnings:s}};function Sc(e){const t=e.split(`
`),n=new Map,s=[];for(const r of t){const l=/^\[Tool:\s*([^\]]+)\]/.exec(r.trim());if(l){const d=l[1];n.set(d,(n.get(d)??0)+1);continue}r.trim().startsWith("[Tool Result]")||s.push(r)}const i=Array.from(n.entries()).toSorted((r,l)=>l[1]-r[1]),o=i.reduce((r,[,l])=>r+l,0),a=i.length>0?`Tools: ${i.map(([r,l])=>`${r}×${l}`).join(", ")} (${o} calls)`:"";return{tools:i,summary:a,cleanContent:s.join(`
`).trim()}}function Wf(e){return{byChannel:Array.from(e.byChannelMap.entries()).map(([t,n])=>({channel:t,totals:n})).toSorted((t,n)=>n.totals.totalCost-t.totals.totalCost),latency:e.latencyTotals.count>0?{count:e.latencyTotals.count,avgMs:e.latencyTotals.sum/e.latencyTotals.count,minMs:e.latencyTotals.min===Number.POSITIVE_INFINITY?0:e.latencyTotals.min,maxMs:e.latencyTotals.max,p95Ms:e.latencyTotals.p95Max}:void 0,dailyLatency:Array.from(e.dailyLatencyMap.values()).map(t=>({date:t.date,count:t.count,avgMs:t.count?t.sum/t.count:0,minMs:t.min===Number.POSITIVE_INFINITY?0:t.min,maxMs:t.max,p95Ms:t.p95Max})).toSorted((t,n)=>t.date.localeCompare(n.date)),modelDaily:Array.from(e.modelDailyMap.values()).toSorted((t,n)=>t.date.localeCompare(n.date)||n.cost-t.cost),daily:Array.from(e.dailyMap.values()).toSorted((t,n)=>t.date.localeCompare(n.date))}}const qf=4;function Lt(e){return Math.round(e/qf)}function z(e){return e>=1e6?`${(e/1e6).toFixed(1)}M`:e>=1e3?`${(e/1e3).toFixed(1)}K`:String(e)}function Gf(e){const t=new Date;return t.setHours(e,0,0,0),t.toLocaleTimeString(void 0,{hour:"numeric"})}function Vf(e,t){const n=Array.from({length:24},()=>0),s=Array.from({length:24},()=>0);for(const i of e){const o=i.usage;if(!o?.messageCounts||o.messageCounts.total===0)continue;const a=o.firstActivity??i.updatedAt,r=o.lastActivity??i.updatedAt;if(!a||!r)continue;const l=Math.min(a,r),d=Math.max(a,r),g=Math.max(d-l,1)/6e4;let f=l;for(;f<d;){const h=new Date(f),v=Uo(h,t),b=Bo(h,t),A=Math.min(b.getTime(),d),T=Math.max((A-f)/6e4,0)/g;n[v]+=o.messageCounts.errors*T,s[v]+=o.messageCounts.total*T,f=A+1}}return s.map((i,o)=>{const a=n[o],r=i>0?a/i:0;return{hour:o,rate:r,errors:a,msgs:i}}).filter(i=>i.msgs>0&&i.errors>0).toSorted((i,o)=>o.rate-i.rate).slice(0,5).map(i=>({label:Gf(i.hour),value:`${(i.rate*100).toFixed(2)}%`,sub:`${Math.round(i.errors)} errors · ${Math.round(i.msgs)} msgs`}))}const Jf=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Uo(e,t){return t==="utc"?e.getUTCHours():e.getHours()}function Qf(e,t){return t==="utc"?e.getUTCDay():e.getDay()}function Bo(e,t){const n=new Date(e);return t==="utc"?n.setUTCMinutes(59,59,999):n.setMinutes(59,59,999),n}function Yf(e,t){const n=Array.from({length:24},()=>0),s=Array.from({length:7},()=>0);let i=0,o=!1;for(const r of e){const l=r.usage;if(!l||!l.totalTokens||l.totalTokens<=0)continue;i+=l.totalTokens;const d=l.firstActivity??r.updatedAt,u=l.lastActivity??r.updatedAt;if(!d||!u)continue;o=!0;const g=Math.min(d,u),f=Math.max(d,u),v=Math.max(f-g,1)/6e4;let b=g;for(;b<f;){const A=new Date(b),k=Uo(A,t),T=Qf(A,t),S=Bo(A,t),R=Math.min(S.getTime(),f),C=Math.max((R-b)/6e4,0)/v;n[k]+=l.totalTokens*C,s[T]+=l.totalTokens*C,b=R+1}}const a=Jf.map((r,l)=>({label:r,tokens:s[l]}));return{hasData:o,totalTokens:i,hourTotals:n,weekdayTotals:a}}function Xf(e,t,n,s){const i=Yf(e,t);if(!i.hasData)return c`
      <div class="card usage-mosaic">
        <div class="usage-mosaic-header">
          <div>
            <div class="usage-mosaic-title">Activity by Time</div>
            <div class="usage-mosaic-sub">Estimates require session timestamps.</div>
          </div>
          <div class="usage-mosaic-total">${z(0)} tokens</div>
        </div>
        <div class="muted" style="padding: 12px; text-align: center;">No timeline data yet.</div>
      </div>
    `;const o=Math.max(...i.hourTotals,1),a=Math.max(...i.weekdayTotals.map(r=>r.tokens),1);return c`
    <div class="card usage-mosaic">
      <div class="usage-mosaic-header">
        <div>
          <div class="usage-mosaic-title">Activity by Time</div>
          <div class="usage-mosaic-sub">
            Estimated from session spans (first/last activity). Time zone: ${t==="utc"?"UTC":"Local"}.
          </div>
        </div>
        <div class="usage-mosaic-total">${z(i.totalTokens)} tokens</div>
      </div>
      <div class="usage-mosaic-grid">
        <div class="usage-mosaic-section">
          <div class="usage-mosaic-section-title">Day of Week</div>
          <div class="usage-daypart-grid">
            ${i.weekdayTotals.map(r=>{const l=Math.min(r.tokens/a,1),d=r.tokens>0?`rgba(255, 77, 77, ${.12+l*.6})`:"transparent";return c`
                <div class="usage-daypart-cell" style="background: ${d};">
                  <div class="usage-daypart-label">${r.label}</div>
                  <div class="usage-daypart-value">${z(r.tokens)}</div>
                </div>
              `})}
          </div>
        </div>
        <div class="usage-mosaic-section">
          <div class="usage-mosaic-section-title">
            <span>Hours</span>
            <span class="usage-mosaic-sub">0 → 23</span>
          </div>
          <div class="usage-hour-grid">
            ${i.hourTotals.map((r,l)=>{const d=Math.min(r/o,1),u=r>0?`rgba(255, 77, 77, ${.08+d*.7})`:"transparent",g=`${l}:00 · ${z(r)} tokens`,f=d>.7?"rgba(255, 77, 77, 0.6)":"rgba(255, 77, 77, 0.2)",h=n.includes(l);return c`
                <div
                  class="usage-hour-cell ${h?"selected":""}"
                  style="background: ${u}; border-color: ${f};"
                  title="${g}"
                  @click=${v=>s(l,v.shiftKey)}
                ></div>
              `})}
          </div>
          <div class="usage-hour-labels">
            <span>Midnight</span>
            <span>4am</span>
            <span>8am</span>
            <span>Noon</span>
            <span>4pm</span>
            <span>8pm</span>
          </div>
          <div class="usage-hour-legend">
            <span></span>
            Low → High token density
          </div>
        </div>
      </div>
    </div>
  `}function ie(e,t=2){return`$${e.toFixed(t)}`}function mi(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function Ac(e){const t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;const[,n,s,i]=t,o=new Date(Date.UTC(Number(n),Number(s)-1,Number(i)));return Number.isNaN(o.valueOf())?null:o}function Cc(e){const t=Ac(e);return t?t.toLocaleDateString(void 0,{month:"short",day:"numeric"}):e}function Zf(e){const t=Ac(e);return t?t.toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"}):e}const as=()=>({input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}),rs=(e,t)=>{e.input+=t.input??0,e.output+=t.output??0,e.cacheRead+=t.cacheRead??0,e.cacheWrite+=t.cacheWrite??0,e.totalTokens+=t.totalTokens??0,e.totalCost+=t.totalCost??0,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0},eh=(e,t)=>{if(e.length===0)return t??{messages:{total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},tools:{totalCalls:0,uniqueTools:0,tools:[]},byModel:[],byProvider:[],byAgent:[],byChannel:[],daily:[]};const n={total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},s=new Map,i=new Map,o=new Map,a=new Map,r=new Map,l=new Map,d=new Map,u=new Map,g={count:0,sum:0,min:Number.POSITIVE_INFINITY,max:0,p95Max:0};for(const h of e){const v=h.usage;if(v){if(v.messageCounts&&(n.total+=v.messageCounts.total,n.user+=v.messageCounts.user,n.assistant+=v.messageCounts.assistant,n.toolCalls+=v.messageCounts.toolCalls,n.toolResults+=v.messageCounts.toolResults,n.errors+=v.messageCounts.errors),v.toolUsage)for(const b of v.toolUsage.tools)s.set(b.name,(s.get(b.name)??0)+b.count);if(v.modelUsage)for(const b of v.modelUsage){const A=`${b.provider??"unknown"}::${b.model??"unknown"}`,k=i.get(A)??{provider:b.provider,model:b.model,count:0,totals:as()};k.count+=b.count,rs(k.totals,b.totals),i.set(A,k);const T=b.provider??"unknown",S=o.get(T)??{provider:b.provider,model:void 0,count:0,totals:as()};S.count+=b.count,rs(S.totals,b.totals),o.set(T,S)}if(v.latency){const{count:b,avgMs:A,minMs:k,maxMs:T,p95Ms:S}=v.latency;b>0&&(g.count+=b,g.sum+=A*b,g.min=Math.min(g.min,k),g.max=Math.max(g.max,T),g.p95Max=Math.max(g.p95Max,S))}if(h.agentId){const b=a.get(h.agentId)??as();rs(b,v),a.set(h.agentId,b)}if(h.channel){const b=r.get(h.channel)??as();rs(b,v),r.set(h.channel,b)}for(const b of v.dailyBreakdown??[]){const A=l.get(b.date)??{date:b.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};A.tokens+=b.tokens,A.cost+=b.cost,l.set(b.date,A)}for(const b of v.dailyMessageCounts??[]){const A=l.get(b.date)??{date:b.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};A.messages+=b.total,A.toolCalls+=b.toolCalls,A.errors+=b.errors,l.set(b.date,A)}for(const b of v.dailyLatency??[]){const A=d.get(b.date)??{date:b.date,count:0,sum:0,min:Number.POSITIVE_INFINITY,max:0,p95Max:0};A.count+=b.count,A.sum+=b.avgMs*b.count,A.min=Math.min(A.min,b.minMs),A.max=Math.max(A.max,b.maxMs),A.p95Max=Math.max(A.p95Max,b.p95Ms),d.set(b.date,A)}for(const b of v.dailyModelUsage??[]){const A=`${b.date}::${b.provider??"unknown"}::${b.model??"unknown"}`,k=u.get(A)??{date:b.date,provider:b.provider,model:b.model,tokens:0,cost:0,count:0};k.tokens+=b.tokens,k.cost+=b.cost,k.count+=b.count,u.set(A,k)}}}const f=Wf({byChannelMap:r,latencyTotals:g,dailyLatencyMap:d,modelDailyMap:u,dailyMap:l});return{messages:n,tools:{totalCalls:Array.from(s.values()).reduce((h,v)=>h+v,0),uniqueTools:s.size,tools:Array.from(s.entries()).map(([h,v])=>({name:h,count:v})).toSorted((h,v)=>v.count-h.count)},byModel:Array.from(i.values()).toSorted((h,v)=>v.totals.totalCost-h.totals.totalCost),byProvider:Array.from(o.values()).toSorted((h,v)=>v.totals.totalCost-h.totals.totalCost),byAgent:Array.from(a.entries()).map(([h,v])=>({agentId:h,totals:v})).toSorted((h,v)=>v.totals.totalCost-h.totals.totalCost),...f}},th=(e,t,n)=>{let s=0,i=0;for(const u of e){const g=u.usage?.durationMs??0;g>0&&(s+=g,i+=1)}const o=i?s/i:0,a=t&&s>0?t.totalTokens/(s/6e4):void 0,r=t&&s>0?t.totalCost/(s/6e4):void 0,l=n.messages.total?n.messages.errors/n.messages.total:0,d=n.daily.filter(u=>u.messages>0&&u.errors>0).map(u=>({date:u.date,errors:u.errors,messages:u.messages,rate:u.errors/u.messages})).toSorted((u,g)=>g.rate-u.rate||g.errors-u.errors)[0];return{durationSumMs:s,durationCount:i,avgDurationMs:o,throughputTokensPerMin:a,throughputCostPerMin:r,errorRate:l,peakErrorDay:d}};function vi(e,t,n="text/plain"){const s=new Blob([t],{type:`${n};charset=utf-8`}),i=URL.createObjectURL(s),o=document.createElement("a");o.href=i,o.download=e,o.click(),URL.revokeObjectURL(i)}function nh(e){return/[",\n]/.test(e)?`"${e.replaceAll('"','""')}"`:e}function _s(e){return e.map(t=>t==null?"":nh(String(t))).join(",")}const sh=e=>{const t=[_s(["key","label","agentId","channel","provider","model","updatedAt","durationMs","messages","errors","toolCalls","inputTokens","outputTokens","cacheReadTokens","cacheWriteTokens","totalTokens","totalCost"])];for(const n of e){const s=n.usage;t.push(_s([n.key,n.label??"",n.agentId??"",n.channel??"",n.modelProvider??n.providerOverride??"",n.model??n.modelOverride??"",n.updatedAt?new Date(n.updatedAt).toISOString():"",s?.durationMs??"",s?.messageCounts?.total??"",s?.messageCounts?.errors??"",s?.messageCounts?.toolCalls??"",s?.input??"",s?.output??"",s?.cacheRead??"",s?.cacheWrite??"",s?.totalTokens??"",s?.totalCost??""]))}return t.join(`
`)},ih=e=>{const t=[_s(["date","inputTokens","outputTokens","cacheReadTokens","cacheWriteTokens","totalTokens","inputCost","outputCost","cacheReadCost","cacheWriteCost","totalCost"])];for(const n of e)t.push(_s([n.date,n.input,n.output,n.cacheRead,n.cacheWrite,n.totalTokens,n.inputCost??"",n.outputCost??"",n.cacheReadCost??"",n.cacheWriteCost??"",n.totalCost]));return t.join(`
`)},oh=(e,t,n)=>{const s=e.trim();if(!s)return[];const i=s.length?s.split(/\s+/):[],o=i.length?i[i.length-1]:"",[a,r]=o.includes(":")?[o.slice(0,o.indexOf(":")),o.slice(o.indexOf(":")+1)]:["",""],l=a.toLowerCase(),d=r.toLowerCase(),u=T=>{const S=new Set;for(const R of T)R&&S.add(R);return Array.from(S)},g=u(t.map(T=>T.agentId)).slice(0,6),f=u(t.map(T=>T.channel)).slice(0,6),h=u([...t.map(T=>T.modelProvider),...t.map(T=>T.providerOverride),...n?.byProvider.map(T=>T.provider)??[]]).slice(0,6),v=u([...t.map(T=>T.model),...n?.byModel.map(T=>T.model)??[]]).slice(0,6),b=u(n?.tools.tools.map(T=>T.name)??[]).slice(0,6);if(!l)return[{label:"agent:",value:"agent:"},{label:"channel:",value:"channel:"},{label:"provider:",value:"provider:"},{label:"model:",value:"model:"},{label:"tool:",value:"tool:"},{label:"has:errors",value:"has:errors"},{label:"has:tools",value:"has:tools"},{label:"minTokens:",value:"minTokens:"},{label:"maxCost:",value:"maxCost:"}];const A=[],k=(T,S)=>{for(const R of S)(!d||R.toLowerCase().includes(d))&&A.push({label:`${T}:${R}`,value:`${T}:${R}`})};switch(l){case"agent":k("agent",g);break;case"channel":k("channel",f);break;case"provider":k("provider",h);break;case"model":k("model",v);break;case"tool":k("tool",b);break;case"has":["errors","tools","context","usage","model","provider"].forEach(T=>{(!d||T.includes(d))&&A.push({label:`has:${T}`,value:`has:${T}`})});break}return A},ah=(e,t)=>{const n=e.trim();if(!n)return`${t} `;const s=n.split(/\s+/);return s[s.length-1]=t,`${s.join(" ")} `},Ot=e=>e.trim().toLowerCase(),rh=(e,t)=>{const n=e.trim();if(!n)return`${t} `;const s=n.split(/\s+/),i=s[s.length-1]??"",o=t.includes(":")?t.split(":")[0]:null,a=i.includes(":")?i.split(":")[0]:null;return i.endsWith(":")&&o&&a===o?(s[s.length-1]=t,`${s.join(" ")} `):s.includes(t)?`${s.join(" ")} `:`${s.join(" ")} ${t} `},ir=(e,t)=>{const s=e.trim().split(/\s+/).filter(Boolean).filter(i=>i!==t);return s.length?`${s.join(" ")} `:""},or=(e,t,n)=>{const s=Ot(t),o=[...Oo(e).filter(a=>Ot(a.key??"")!==s).map(a=>a.raw),...n.map(a=>`${t}:${a}`)];return o.length?`${o.join(" ")} `:""};function ht(e,t){return t===0?0:e/t*100}function lh(e){const t=e.totalCost||0;return{input:{tokens:e.input,cost:e.inputCost||0,pct:ht(e.inputCost||0,t)},output:{tokens:e.output,cost:e.outputCost||0,pct:ht(e.outputCost||0,t)},cacheRead:{tokens:e.cacheRead,cost:e.cacheReadCost||0,pct:ht(e.cacheReadCost||0,t)},cacheWrite:{tokens:e.cacheWrite,cost:e.cacheWriteCost||0,pct:ht(e.cacheWriteCost||0,t)},totalCost:t}}function ch(e,t,n,s,i,o,a,r){if(!(e.length>0||t.length>0||n.length>0))return m;const d=n.length===1?s.find(v=>v.key===n[0]):null,u=d?(d.label||d.key).slice(0,20)+((d.label||d.key).length>20?"…":""):n.length===1?n[0].slice(0,8)+"…":`${n.length} sessions`,g=d?d.label||d.key:n.length===1?n[0]:n.join(", "),f=e.length===1?e[0]:`${e.length} days`,h=t.length===1?`${t[0]}:00`:`${t.length} hours`;return c`
    <div class="active-filters">
      ${e.length>0?c`
            <div class="filter-chip">
              <span class="filter-chip-label">Days: ${f}</span>
              <button class="filter-chip-remove" @click=${i} title="Remove filter">×</button>
            </div>
          `:m}
      ${t.length>0?c`
            <div class="filter-chip">
              <span class="filter-chip-label">Hours: ${h}</span>
              <button class="filter-chip-remove" @click=${o} title="Remove filter">×</button>
            </div>
          `:m}
      ${n.length>0?c`
            <div class="filter-chip" title="${g}">
              <span class="filter-chip-label">Session: ${u}</span>
              <button class="filter-chip-remove" @click=${a} title="Remove filter">×</button>
            </div>
          `:m}
      ${(e.length>0||t.length>0)&&n.length>0?c`
            <button class="btn btn-sm filter-clear-btn" @click=${r}>
              Clear All
            </button>
          `:m}
    </div>
  `}function dh(e,t,n,s,i,o){if(!e.length)return c`
      <div class="daily-chart-compact">
        <div class="sessions-panel-title">Daily Usage</div>
        <div class="muted" style="padding: 20px; text-align: center">No data</div>
      </div>
    `;const a=n==="tokens",r=e.map(g=>a?g.totalTokens:g.totalCost),l=Math.max(...r,a?1:1e-4),d=e.length>30?12:e.length>20?18:e.length>14?24:32,u=e.length<=14;return c`
    <div class="daily-chart-compact">
      <div class="daily-chart-header">
        <div class="chart-toggle small sessions-toggle">
          <button
            class="toggle-btn ${s==="total"?"active":""}"
            @click=${()=>i("total")}
          >
            Total
          </button>
          <button
            class="toggle-btn ${s==="by-type"?"active":""}"
            @click=${()=>i("by-type")}
          >
            By Type
          </button>
        </div>
        <div class="card-title">Daily ${a?"Token":"Cost"} Usage</div>
      </div>
      <div class="daily-chart">
        <div class="daily-chart-bars" style="--bar-max-width: ${d}px">
          ${e.map((g,f)=>{const v=r[f]/l*100,b=t.includes(g.date),A=Cc(g.date),k=e.length>20?String(parseInt(g.date.slice(8),10)):A,T=e.length>20?"font-size: 8px":"",S=s==="by-type"?a?[{value:g.output,class:"output"},{value:g.input,class:"input"},{value:g.cacheWrite,class:"cache-write"},{value:g.cacheRead,class:"cache-read"}]:[{value:g.outputCost??0,class:"output"},{value:g.inputCost??0,class:"input"},{value:g.cacheWriteCost??0,class:"cache-write"},{value:g.cacheReadCost??0,class:"cache-read"}]:[],R=s==="by-type"?a?[`Output ${z(g.output)}`,`Input ${z(g.input)}`,`Cache write ${z(g.cacheWrite)}`,`Cache read ${z(g.cacheRead)}`]:[`Output ${ie(g.outputCost??0)}`,`Input ${ie(g.inputCost??0)}`,`Cache write ${ie(g.cacheWriteCost??0)}`,`Cache read ${ie(g.cacheReadCost??0)}`]:[],I=a?z(g.totalTokens):ie(g.totalCost);return c`
              <div
                class="daily-bar-wrapper ${b?"selected":""}"
                @click=${C=>o(g.date,C.shiftKey)}
              >
                ${s==="by-type"?c`
                        <div
                          class="daily-bar"
                          style="height: ${v.toFixed(1)}%; display: flex; flex-direction: column;"
                        >
                          ${(()=>{const C=S.reduce((p,_)=>p+_.value,0)||1;return S.map(p=>c`
                                <div
                                  class="cost-segment ${p.class}"
                                  style="height: ${p.value/C*100}%"
                                ></div>
                              `)})()}
                        </div>
                      `:c`
                        <div class="daily-bar" style="height: ${v.toFixed(1)}%"></div>
                      `}
                ${u?c`<div class="daily-bar-total">${I}</div>`:m}
                <div class="daily-bar-label" style="${T}">${k}</div>
                <div class="daily-bar-tooltip">
                  <strong>${Zf(g.date)}</strong><br />
                  ${z(g.totalTokens)} tokens<br />
                  ${ie(g.totalCost)}
                  ${R.length?c`${R.map(C=>c`<div>${C}</div>`)}`:m}
                </div>
              </div>
            `})}
        </div>
      </div>
    </div>
  `}function uh(e,t){const n=lh(e),s=t==="tokens",i=e.totalTokens||1,o={output:ht(e.output,i),input:ht(e.input,i),cacheWrite:ht(e.cacheWrite,i),cacheRead:ht(e.cacheRead,i)};return c`
    <div class="cost-breakdown cost-breakdown-compact">
      <div class="cost-breakdown-header">${s?"Tokens":"Cost"} by Type</div>
      <div class="cost-breakdown-bar">
        <div class="cost-segment output" style="width: ${(s?o.output:n.output.pct).toFixed(1)}%"
          title="Output: ${s?z(e.output):ie(n.output.cost)}"></div>
        <div class="cost-segment input" style="width: ${(s?o.input:n.input.pct).toFixed(1)}%"
          title="Input: ${s?z(e.input):ie(n.input.cost)}"></div>
        <div class="cost-segment cache-write" style="width: ${(s?o.cacheWrite:n.cacheWrite.pct).toFixed(1)}%"
          title="Cache Write: ${s?z(e.cacheWrite):ie(n.cacheWrite.cost)}"></div>
        <div class="cost-segment cache-read" style="width: ${(s?o.cacheRead:n.cacheRead.pct).toFixed(1)}%"
          title="Cache Read: ${s?z(e.cacheRead):ie(n.cacheRead.cost)}"></div>
      </div>
      <div class="cost-breakdown-legend">
        <span class="legend-item"><span class="legend-dot output"></span>Output ${s?z(e.output):ie(n.output.cost)}</span>
        <span class="legend-item"><span class="legend-dot input"></span>Input ${s?z(e.input):ie(n.input.cost)}</span>
        <span class="legend-item"><span class="legend-dot cache-write"></span>Cache Write ${s?z(e.cacheWrite):ie(n.cacheWrite.cost)}</span>
        <span class="legend-item"><span class="legend-dot cache-read"></span>Cache Read ${s?z(e.cacheRead):ie(n.cacheRead.cost)}</span>
      </div>
      <div class="cost-breakdown-total">
        Total: ${s?z(e.totalTokens):ie(e.totalCost)}
      </div>
    </div>
  `}function Ut(e,t,n){return c`
    <div class="usage-insight-card">
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?c`<div class="muted">${n}</div>`:c`
              <div class="usage-list">
                ${t.map(s=>c`
                    <div class="usage-list-item">
                      <span>${s.label}</span>
                      <span class="usage-list-value">
                        <span>${s.value}</span>
                        ${s.sub?c`<span class="usage-list-sub">${s.sub}</span>`:m}
                      </span>
                    </div>
                  `)}
              </div>
            `}
    </div>
  `}function ar(e,t,n){return c`
    <div class="usage-insight-card">
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?c`<div class="muted">${n}</div>`:c`
              <div class="usage-error-list">
                ${t.map(s=>c`
                    <div class="usage-error-row">
                      <div class="usage-error-date">${s.label}</div>
                      <div class="usage-error-rate">${s.value}</div>
                      ${s.sub?c`<div class="usage-error-sub">${s.sub}</div>`:m}
                    </div>
                  `)}
              </div>
            `}
    </div>
  `}function gh(e,t,n,s,i,o,a){if(!e)return m;const r=t.messages.total?Math.round(e.totalTokens/t.messages.total):0,l=t.messages.total?e.totalCost/t.messages.total:0,d=e.input+e.cacheRead,u=d>0?e.cacheRead/d:0,g=d>0?`${(u*100).toFixed(1)}%`:"—",f=n.errorRate*100,h=n.throughputTokensPerMin!==void 0?`${z(Math.round(n.throughputTokensPerMin))} tok/min`:"—",v=n.throughputCostPerMin!==void 0?`${ie(n.throughputCostPerMin,4)} / min`:"—",b=n.durationCount>0?ko(n.avgDurationMs,{spaced:!0})??"—":"—",A="Cache hit rate = cache read / (input + cache read). Higher is better.",k="Error rate = errors / total messages. Lower is better.",T="Throughput shows tokens per minute over active time. Higher is better.",S="Average tokens per message in this range.",R=s?"Average cost per message when providers report costs. Cost data is missing for some or all sessions in this range.":"Average cost per message when providers report costs.",I=t.daily.filter(L=>L.messages>0&&L.errors>0).map(L=>{const q=L.errors/L.messages;return{label:Cc(L.date),value:`${(q*100).toFixed(2)}%`,sub:`${L.errors} errors · ${L.messages} msgs · ${z(L.tokens)}`,rate:q}}).toSorted((L,q)=>q.rate-L.rate).slice(0,5).map(({rate:L,...q})=>q),C=t.byModel.slice(0,5).map(L=>({label:L.model??"unknown",value:ie(L.totals.totalCost),sub:`${z(L.totals.totalTokens)} · ${L.count} msgs`})),p=t.byProvider.slice(0,5).map(L=>({label:L.provider??"unknown",value:ie(L.totals.totalCost),sub:`${z(L.totals.totalTokens)} · ${L.count} msgs`})),_=t.tools.tools.slice(0,6).map(L=>({label:L.name,value:`${L.count}`,sub:"calls"})),P=t.byAgent.slice(0,5).map(L=>({label:L.agentId,value:ie(L.totals.totalCost),sub:z(L.totals.totalTokens)})),O=t.byChannel.slice(0,5).map(L=>({label:L.channel,value:ie(L.totals.totalCost),sub:z(L.totals.totalTokens)}));return c`
    <section class="card" style="margin-top: 16px;">
      <div class="card-title">Usage Overview</div>
      <div class="usage-summary-grid">
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Messages
            <span class="usage-summary-hint" title="Total user + assistant messages in range.">?</span>
          </div>
          <div class="usage-summary-value">${t.messages.total}</div>
          <div class="usage-summary-sub">
            ${t.messages.user} user · ${t.messages.assistant} assistant
          </div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Tool Calls
            <span class="usage-summary-hint" title="Total tool call count across sessions.">?</span>
          </div>
          <div class="usage-summary-value">${t.tools.totalCalls}</div>
          <div class="usage-summary-sub">${t.tools.uniqueTools} tools used</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Errors
            <span class="usage-summary-hint" title="Total message/tool errors in range.">?</span>
          </div>
          <div class="usage-summary-value">${t.messages.errors}</div>
          <div class="usage-summary-sub">${t.messages.toolResults} tool results</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Avg Tokens / Msg
            <span class="usage-summary-hint" title=${S}>?</span>
          </div>
          <div class="usage-summary-value">${z(r)}</div>
          <div class="usage-summary-sub">Across ${t.messages.total||0} messages</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Avg Cost / Msg
            <span class="usage-summary-hint" title=${R}>?</span>
          </div>
          <div class="usage-summary-value">${ie(l,4)}</div>
          <div class="usage-summary-sub">${ie(e.totalCost)} total</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Sessions
            <span class="usage-summary-hint" title="Distinct sessions in the range.">?</span>
          </div>
          <div class="usage-summary-value">${o}</div>
          <div class="usage-summary-sub">of ${a} in range</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Throughput
            <span class="usage-summary-hint" title=${T}>?</span>
          </div>
          <div class="usage-summary-value">${h}</div>
          <div class="usage-summary-sub">${v}</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Error Rate
            <span class="usage-summary-hint" title=${k}>?</span>
          </div>
          <div class="usage-summary-value ${f>5?"bad":f>1?"warn":"good"}">${f.toFixed(2)}%</div>
          <div class="usage-summary-sub">
            ${t.messages.errors} errors · ${b} avg session
          </div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Cache Hit Rate
            <span class="usage-summary-hint" title=${A}>?</span>
          </div>
          <div class="usage-summary-value ${u>.6?"good":u>.3?"warn":"bad"}">${g}</div>
          <div class="usage-summary-sub">
            ${z(e.cacheRead)} cached · ${z(d)} prompt
          </div>
        </div>
      </div>
      <div class="usage-insights-grid">
        ${Ut("Top Models",C,"No model data")}
        ${Ut("Top Providers",p,"No provider data")}
        ${Ut("Top Tools",_,"No tool calls")}
        ${Ut("Top Agents",P,"No agent data")}
        ${Ut("Top Channels",O,"No channel data")}
        ${ar("Peak Error Days",I,"No error data")}
        ${ar("Peak Error Hours",i,"No error data")}
      </div>
    </section>
  `}function ph(e,t,n,s,i,o,a,r,l,d,u,g,f,h,v){const b=E=>f.includes(E),A=E=>{const j=E.label||E.key;return j.startsWith("agent:")&&j.includes("?token=")?j.slice(0,j.indexOf("?token=")):j},k=async E=>{const j=A(E);try{await navigator.clipboard.writeText(j)}catch{}},T=E=>{const j=[];return b("channel")&&E.channel&&j.push(`channel:${E.channel}`),b("agent")&&E.agentId&&j.push(`agent:${E.agentId}`),b("provider")&&(E.modelProvider||E.providerOverride)&&j.push(`provider:${E.modelProvider??E.providerOverride}`),b("model")&&E.model&&j.push(`model:${E.model}`),b("messages")&&E.usage?.messageCounts&&j.push(`msgs:${E.usage.messageCounts.total}`),b("tools")&&E.usage?.toolUsage&&j.push(`tools:${E.usage.toolUsage.totalCalls}`),b("errors")&&E.usage?.messageCounts&&j.push(`errors:${E.usage.messageCounts.errors}`),b("duration")&&E.usage?.durationMs&&j.push(`dur:${ko(E.usage.durationMs,{spaced:!0})??"—"}`),j},S=E=>{const j=E.usage;if(!j)return 0;if(n.length>0&&j.dailyBreakdown&&j.dailyBreakdown.length>0){const X=j.dailyBreakdown.filter(J=>n.includes(J.date));return s?X.reduce((J,pe)=>J+pe.tokens,0):X.reduce((J,pe)=>J+pe.cost,0)}return s?j.totalTokens??0:j.totalCost??0},R=[...e].toSorted((E,j)=>{switch(i){case"recent":return(j.updatedAt??0)-(E.updatedAt??0);case"messages":return(j.usage?.messageCounts?.total??0)-(E.usage?.messageCounts?.total??0);case"errors":return(j.usage?.messageCounts?.errors??0)-(E.usage?.messageCounts?.errors??0);case"cost":return S(j)-S(E);default:return S(j)-S(E)}}),I=o==="asc"?R.toReversed():R,C=I.reduce((E,j)=>E+S(j),0),p=I.length?C/I.length:0,_=I.reduce((E,j)=>E+(j.usage?.messageCounts?.errors??0),0),P=(E,j)=>{const X=S(E),J=A(E),pe=T(E);return c`
      <div
        class="session-bar-row ${j?"selected":""}"
        @click=${D=>l(E.key,D.shiftKey)}
        title="${E.key}"
      >
        <div class="session-bar-label">
          <div class="session-bar-title">${J}</div>
          ${pe.length>0?c`<div class="session-bar-meta">${pe.join(" · ")}</div>`:m}
        </div>
        <div class="session-bar-track" style="display: none;"></div>
        <div class="session-bar-actions">
          <button
            class="session-copy-btn"
            title="Copy session name"
            @click=${D=>{D.stopPropagation(),k(E)}}
          >
            Copy
          </button>
          <div class="session-bar-value">${s?z(X):ie(X)}</div>
        </div>
      </div>
    `},O=new Set(t),L=I.filter(E=>O.has(E.key)),q=L.length,G=new Map(I.map(E=>[E.key,E])),Q=a.map(E=>G.get(E)).filter(E=>!!E);return c`
    <div class="card sessions-card">
      <div class="sessions-card-header">
        <div class="card-title">Sessions</div>
        <div class="sessions-card-count">
          ${e.length} shown${h!==e.length?` · ${h} total`:""}
        </div>
      </div>
      <div class="sessions-card-meta">
        <div class="sessions-card-stats">
          <span>${s?z(p):ie(p)} avg</span>
          <span>${_} errors</span>
        </div>
        <div class="chart-toggle small">
          <button
            class="toggle-btn ${r==="all"?"active":""}"
            @click=${()=>g("all")}
          >
            All
          </button>
          <button
            class="toggle-btn ${r==="recent"?"active":""}"
            @click=${()=>g("recent")}
          >
            Recently viewed
          </button>
        </div>
        <label class="sessions-sort">
          <span>Sort</span>
          <select
            @change=${E=>d(E.target.value)}
          >
            <option value="cost" ?selected=${i==="cost"}>Cost</option>
            <option value="errors" ?selected=${i==="errors"}>Errors</option>
            <option value="messages" ?selected=${i==="messages"}>Messages</option>
            <option value="recent" ?selected=${i==="recent"}>Recent</option>
            <option value="tokens" ?selected=${i==="tokens"}>Tokens</option>
          </select>
        </label>
        <button
          class="btn btn-sm sessions-action-btn icon"
          @click=${()=>u(o==="desc"?"asc":"desc")}
          title=${o==="desc"?"Descending":"Ascending"}
        >
          ${o==="desc"?"↓":"↑"}
        </button>
        ${q>0?c`
                <button class="btn btn-sm sessions-action-btn sessions-clear-btn" @click=${v}>
                  Clear Selection
                </button>
              `:m}
      </div>
      ${r==="recent"?Q.length===0?c`
                <div class="muted" style="padding: 20px; text-align: center">No recent sessions</div>
              `:c`
	                <div class="session-bars" style="max-height: 220px; margin-top: 6px;">
	                  ${Q.map(E=>P(E,O.has(E.key)))}
	                </div>
	              `:e.length===0?c`
                <div class="muted" style="padding: 20px; text-align: center">No sessions in range</div>
              `:c`
	                <div class="session-bars">
	                  ${I.slice(0,50).map(E=>P(E,O.has(E.key)))}
	                  ${e.length>50?c`<div class="muted" style="padding: 8px; text-align: center; font-size: 11px;">+${e.length-50} more</div>`:m}
	                </div>
	              `}
      ${q>1?c`
              <div style="margin-top: 10px;">
                <div class="sessions-card-count">Selected (${q})</div>
                <div class="session-bars" style="max-height: 160px; margin-top: 6px;">
                  ${L.map(E=>P(E,!0))}
                </div>
              </div>
            `:m}
    </div>
  `}const fh=.75,hh=8,mh=.06,ls=5,Me=12,ut=.7;function mt(e,t){return!t||t<=0?0:e/t*100}function vh(){return m}function Tc(e){return e<1e12?e*1e3:e}function bh(e,t,n){const s=Math.min(t,n),i=Math.max(t,n);return e.filter(o=>{if(o.timestamp<=0)return!0;const a=Tc(o.timestamp);return a>=s&&a<=i})}function yh(e,t,n){const s=t||e.usage;if(!s)return c`
      <div class="muted">No usage data for this session.</div>
    `;const i=g=>g?new Date(g).toLocaleString():"—",o=[];e.channel&&o.push(`channel:${e.channel}`),e.agentId&&o.push(`agent:${e.agentId}`),(e.modelProvider||e.providerOverride)&&o.push(`provider:${e.modelProvider??e.providerOverride}`),e.model&&o.push(`model:${e.model}`);const a=s.toolUsage?.tools.slice(0,6)??[];let r,l,d;if(n){const g=new Map;for(const f of n){const{tools:h}=Sc(f.content);for(const[v]of h)g.set(v,(g.get(v)||0)+1)}d=a.map(f=>({label:f.name,value:`${g.get(f.name)??0}`,sub:"calls"})),r=[...g.values()].reduce((f,h)=>f+h,0),l=g.size}else d=a.map(g=>({label:g.name,value:`${g.count}`,sub:"calls"})),r=s.toolUsage?.totalCalls??0,l=s.toolUsage?.uniqueTools??0;const u=s.modelUsage?.slice(0,6).map(g=>({label:g.model??"unknown",value:ie(g.totals.totalCost),sub:z(g.totals.totalTokens)}))??[];return c`
    ${o.length>0?c`<div class="usage-badges">${o.map(g=>c`<span class="usage-badge">${g}</span>`)}</div>`:m}
    <div class="session-summary-grid">
      <div class="session-summary-card">
        <div class="session-summary-title">Messages</div>
        <div class="session-summary-value">${s.messageCounts?.total??0}</div>
        <div class="session-summary-meta">${s.messageCounts?.user??0} user · ${s.messageCounts?.assistant??0} assistant</div>
      </div>
      <div class="session-summary-card">
        <div class="session-summary-title">Tool Calls</div>
        <div class="session-summary-value">${r}</div>
        <div class="session-summary-meta">${l} tools</div>
      </div>
      <div class="session-summary-card">
        <div class="session-summary-title">Errors</div>
        <div class="session-summary-value">${s.messageCounts?.errors??0}</div>
        <div class="session-summary-meta">${s.messageCounts?.toolResults??0} tool results</div>
      </div>
      <div class="session-summary-card">
        <div class="session-summary-title">Duration</div>
        <div class="session-summary-value">${ko(s.durationMs,{spaced:!0})??"—"}</div>
        <div class="session-summary-meta">${i(s.firstActivity)} → ${i(s.lastActivity)}</div>
      </div>
    </div>
    <div class="usage-insights-grid" style="margin-top: 12px;">
      ${Ut("Top Tools",d,"No tool calls")}
      ${Ut("Model Mix",u,"No model data")}
    </div>
  `}function xh(e,t,n,s){const i=Math.min(n,s),o=Math.max(n,s),a=t.filter(b=>b.timestamp>=i&&b.timestamp<=o);if(a.length===0)return;let r=0,l=0,d=0,u=0,g=0,f=0,h=0,v=0;for(const b of a)r+=b.totalTokens||0,l+=b.cost||0,g+=b.input||0,f+=b.output||0,h+=b.cacheRead||0,v+=b.cacheWrite||0,b.output>0&&u++,b.input>0&&d++;return{...e,totalTokens:r,totalCost:l,input:g,output:f,cacheRead:h,cacheWrite:v,durationMs:a[a.length-1].timestamp-a[0].timestamp,firstActivity:a[0].timestamp,lastActivity:a[a.length-1].timestamp,messageCounts:{total:a.length,user:d,assistant:u,toolCalls:0,toolResults:0,errors:0}}}function $h(e,t,n,s,i,o,a,r,l,d,u,g,f,h,v,b,A,k,T,S,R,I,C,p,_,P){const O=e.label||e.key,L=O.length>50?O.slice(0,50)+"…":O,q=e.usage,G=r!==null&&l!==null,Q=r!==null&&l!==null&&t?.points&&q?xh(q,t.points,r,l):void 0,E=Q?{totalTokens:Q.totalTokens,totalCost:Q.totalCost}:{totalTokens:q?.totalTokens??0,totalCost:q?.totalCost??0},j=Q?" (filtered)":"";return c`
    <div class="card session-detail-panel">
      <div class="session-detail-header">
        <div class="session-detail-header-left">
          <div class="session-detail-title">
            ${L}
            ${j?c`<span style="font-size: 11px; color: var(--muted); margin-left: 8px;">${j}</span>`:m}
          </div>
        </div>
        <div class="session-detail-stats">
          ${q?c`
            <span><strong>${z(E.totalTokens)}</strong> tokens${j}</span>
            <span><strong>${ie(E.totalCost)}</strong>${j}</span>
          `:m}
        </div>
        <button class="session-close-btn" @click=${P} title="Close session details">×</button>
      </div>
      <div class="session-detail-content">
        ${yh(e,Q,r!=null&&l!=null&&h?bh(h,r,l):void 0)}
        <div class="session-detail-row">
          ${wh(t,n,s,i,o,a,u,g,f,r,l,d)}
        </div>
        <div class="session-detail-bottom">
          ${Sh(h,v,b,A,k,T,S,R,I,C,G?r:null,G?l:null)}
          ${kh(e.contextWeight,q,p,_)}
        </div>
      </div>
    </div>
  `}function wh(e,t,n,s,i,o,a,r,l,d,u,g){if(t)return c`
      <div class="session-timeseries-compact">
        <div class="muted" style="padding: 20px; text-align: center">Loading...</div>
      </div>
    `;if(!e||e.points.length<2)return c`
      <div class="session-timeseries-compact">
        <div class="muted" style="padding: 20px; text-align: center">No timeline data</div>
      </div>
    `;let f=e.points;if(a||r||l&&l.length>0){const W=a?new Date(a+"T00:00:00").getTime():0,ae=r?new Date(r+"T23:59:59").getTime():1/0;f=e.points.filter(le=>{if(le.timestamp<W||le.timestamp>ae)return!1;if(l&&l.length>0){const he=new Date(le.timestamp),Ie=`${he.getFullYear()}-${String(he.getMonth()+1).padStart(2,"0")}-${String(he.getDate()).padStart(2,"0")}`;return l.includes(Ie)}return!0})}if(f.length<2)return c`
      <div class="session-timeseries-compact">
        <div class="muted" style="padding: 20px; text-align: center">No data in range</div>
      </div>
    `;let h=0,v=0,b=0,A=0,k=0,T=0;f=f.map(W=>(h+=W.totalTokens,v+=W.cost,b+=W.output,A+=W.input,k+=W.cacheRead,T+=W.cacheWrite,{...W,cumulativeTokens:h,cumulativeCost:v}));const S=d!=null&&u!=null,R=S?Math.min(d,u):0,I=S?Math.max(d,u):1/0;let C=0,p=f.length;if(S){C=f.findIndex(ae=>ae.timestamp>=R),C===-1&&(C=f.length);const W=f.findIndex(ae=>ae.timestamp>I);p=W===-1?f.length:W}const _=S?f.slice(C,p):f;let P=0,O=0,L=0,q=0;for(const W of _)P+=W.output,O+=W.input,L+=W.cacheRead,q+=W.cacheWrite;const G=400,Q=100,E={top:8,right:4,bottom:14,left:30},j=G-E.left-E.right,X=Q-E.top-E.bottom,J=n==="cumulative",pe=n==="per-turn"&&i==="by-type",D=P+O+L+q,N=f.map(W=>J?W.cumulativeTokens:pe?W.input+W.output+W.cacheRead+W.cacheWrite:W.totalTokens),U=Math.max(...N,1),V=j/f.length,de=Math.min(hh,Math.max(1,V*fh)),ne=V-de,oe=E.left+C*(de+ne),Z=p>=f.length?E.left+(f.length-1)*(de+ne)+de:E.left+(p-1)*(de+ne)+de;return c`
    <div class="session-timeseries-compact">
      <div class="timeseries-header-row">
        <div class="card-title" style="font-size: 12px; color: var(--text);">Usage Over Time</div>
        <div class="timeseries-controls">
          ${S?c`
            <div class="chart-toggle small">
              <button class="toggle-btn active" @click=${()=>g?.(null,null)}>Reset</button>
            </div>
          `:m}
          <div class="chart-toggle small">
            <button
              class="toggle-btn ${J?"":"active"}"
              @click=${()=>s("per-turn")}
            >
              Per Turn
            </button>
            <button
              class="toggle-btn ${J?"active":""}"
              @click=${()=>s("cumulative")}
            >
              Cumulative
            </button>
          </div>
          ${J?m:c`
                  <div class="chart-toggle small">
                    <button
                      class="toggle-btn ${i==="total"?"active":""}"
                      @click=${()=>o("total")}
                    >
                      Total
                    </button>
                    <button
                      class="toggle-btn ${i==="by-type"?"active":""}"
                      @click=${()=>o("by-type")}
                    >
                      By Type
                    </button>
                  </div>
                `}
        </div>
      </div>
      <div class="timeseries-chart-wrapper" style="position: relative; cursor: crosshair;">
        <svg 
          viewBox="0 0 ${G} ${Q+18}" 
          class="timeseries-svg" 
          style="width: 100%; height: auto; display: block;"
        >
          <!-- Y axis -->
          <line x1="${E.left}" y1="${E.top}" x2="${E.left}" y2="${E.top+X}" stroke="var(--border)" />
          <!-- X axis -->
          <line x1="${E.left}" y1="${E.top+X}" x2="${G-E.right}" y2="${E.top+X}" stroke="var(--border)" />
          <!-- Y axis labels -->
          <text x="${E.left-4}" y="${E.top+5}" text-anchor="end" class="ts-axis-label">${z(U)}</text>
          <text x="${E.left-4}" y="${E.top+X}" text-anchor="end" class="ts-axis-label">0</text>
          <!-- X axis labels (first and last) -->
          ${f.length>0?It`
            <text x="${E.left}" y="${E.top+X+10}" text-anchor="start" class="ts-axis-label">${new Date(f[0].timestamp).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}</text>
            <text x="${G-E.right}" y="${E.top+X+10}" text-anchor="end" class="ts-axis-label">${new Date(f[f.length-1].timestamp).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}</text>
          `:m}
          <!-- Bars -->
          ${f.map((W,ae)=>{const le=N[ae],he=E.left+ae*(de+ne),Ie=le/U*X,Ve=E.top+X-Ie,me=[new Date(W.timestamp).toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),`${z(le)} tokens`];pe&&(me.push(`Out ${z(W.output)}`),me.push(`In ${z(W.input)}`),me.push(`CW ${z(W.cacheWrite)}`),me.push(`CR ${z(W.cacheRead)}`));const He=me.join(" · "),Je=S&&(ae<C||ae>=p);if(!pe)return It`<rect x="${he}" y="${Ve}" width="${de}" height="${Ie}" class="ts-bar${Je?" dimmed":""}" rx="1"><title>${He}</title></rect>`;const Qe=[{value:W.output,cls:"output"},{value:W.input,cls:"input"},{value:W.cacheWrite,cls:"cache-write"},{value:W.cacheRead,cls:"cache-read"}];let Ye=E.top+X;const rt=Je?" dimmed":"";return It`
              ${Qe.map(lt=>{if(lt.value<=0||le<=0)return m;const _t=Ie*(lt.value/le);return Ye-=_t,It`<rect x="${he}" y="${Ye}" width="${de}" height="${_t}" class="ts-bar ${lt.cls}${rt}" rx="1"><title>${He}</title></rect>`})}
            `})}
          <!-- Selection highlight overlay (always visible between handles) -->
          ${It`
            <rect 
              x="${oe}" 
              y="${E.top}" 
              width="${Math.max(1,Z-oe)}" 
              height="${X}" 
              fill="var(--accent)" 
              opacity="${mh}" 
              pointer-events="none"
            />
          `}
          <!-- Left cursor line + handle -->
          ${It`
            <line x1="${oe}" y1="${E.top}" x2="${oe}" y2="${E.top+X}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${oe-ls/2}" y="${E.top+X/2-Me/2}" width="${ls}" height="${Me}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${oe-ut}" y1="${E.top+X/2-Me/5}" x2="${oe-ut}" y2="${E.top+X/2+Me/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${oe+ut}" y1="${E.top+X/2-Me/5}" x2="${oe+ut}" y2="${E.top+X/2+Me/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
          <!-- Right cursor line + handle -->
          ${It`
            <line x1="${Z}" y1="${E.top}" x2="${Z}" y2="${E.top+X}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${Z-ls/2}" y="${E.top+X/2-Me/2}" width="${ls}" height="${Me}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${Z-ut}" y1="${E.top+X/2-Me/5}" x2="${Z-ut}" y2="${E.top+X/2+Me/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${Z+ut}" y1="${E.top+X/2-Me/5}" x2="${Z+ut}" y2="${E.top+X/2+Me/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
        </svg>
        <!-- Handle drag zones (only on handles, not full chart) -->
        ${(()=>{const W=`${(oe/G*100).toFixed(1)}%`,ae=`${(Z/G*100).toFixed(1)}%`,le=he=>Ie=>{if(!g)return;Ie.preventDefault(),Ie.stopPropagation();const at=Ie.currentTarget.closest(".timeseries-chart-wrapper")?.querySelector("svg");if(!at)return;const me=at.getBoundingClientRect(),He=me.width,Je=E.left/G*He,Ye=(G-E.right)/G*He-Je,rt=ze=>{const Te=Math.max(0,Math.min(1,(ze-me.left-Je)/Ye));return Math.min(Math.floor(Te*f.length),f.length-1)},lt=he==="left"?oe:Z,_t=me.left+lt/G*He,Xs=Ie.clientX-_t;document.body.style.cursor="col-resize";const Xt=ze=>{const Te=ze.clientX-Xs,bn=rt(Te),Zt=f[bn];if(Zt)if(he==="left"){const dt=u??f[f.length-1].timestamp;g(Math.min(Zt.timestamp,dt),dt)}else{const dt=d??f[0].timestamp;g(dt,Math.max(Zt.timestamp,dt))}},ct=()=>{document.body.style.cursor="",document.removeEventListener("mousemove",Xt),document.removeEventListener("mouseup",ct)};document.addEventListener("mousemove",Xt),document.addEventListener("mouseup",ct)};return c`
            <div class="chart-handle-zone chart-handle-left" 
                 style="left: ${W};"
                 @mousedown=${le("left")}></div>
            <div class="chart-handle-zone chart-handle-right" 
                 style="left: ${ae};"
                 @mousedown=${le("right")}></div>
          `})()}
      </div>
      <div class="timeseries-summary">
        ${S?c`
              <span style="color: var(--accent);">▶ Turns ${C+1}–${p} of ${f.length}</span> · 
              ${new Date(R).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}–${new Date(I).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})} · 
              ${z(P+O+L+q)} · 
              ${ie(_.reduce((W,ae)=>W+(ae.cost||0),0))}
            `:c`${f.length} msgs · ${z(h)} · ${ie(v)}`}
      </div>
      ${pe?c`
              <div style="margin-top: 8px;">
                <div class="card-title" style="font-size: 12px; margin-bottom: 6px; color: var(--text);">Tokens by Type</div>
                <div class="cost-breakdown-bar" style="height: 18px;">
                  <div class="cost-segment output" style="width: ${mt(P,D).toFixed(1)}%"></div>
                  <div class="cost-segment input" style="width: ${mt(O,D).toFixed(1)}%"></div>
                  <div class="cost-segment cache-write" style="width: ${mt(q,D).toFixed(1)}%"></div>
                  <div class="cost-segment cache-read" style="width: ${mt(L,D).toFixed(1)}%"></div>
                </div>
                <div class="cost-breakdown-legend">
                  <div class="legend-item" title="Assistant output tokens">
                    <span class="legend-dot output"></span>Output ${z(P)}
                  </div>
                  <div class="legend-item" title="User + tool input tokens">
                    <span class="legend-dot input"></span>Input ${z(O)}
                  </div>
                  <div class="legend-item" title="Tokens written to cache">
                    <span class="legend-dot cache-write"></span>Cache Write ${z(q)}
                  </div>
                  <div class="legend-item" title="Tokens read from cache">
                    <span class="legend-dot cache-read"></span>Cache Read ${z(L)}
                  </div>
                </div>
                <div class="cost-breakdown-total">Total: ${z(D)}</div>
              </div>
            `:m}
    </div>
  `}function kh(e,t,n,s){if(!e)return c`
      <div class="context-details-panel">
        <div class="muted" style="padding: 20px; text-align: center">No context data</div>
      </div>
    `;const i=Lt(e.systemPrompt.chars),o=Lt(e.skills.promptChars),a=Lt(e.tools.listChars+e.tools.schemaChars),r=Lt(e.injectedWorkspaceFiles.reduce((S,R)=>S+R.injectedChars,0)),l=i+o+a+r;let d="";if(t&&t.totalTokens>0){const S=t.input+t.cacheRead;S>0&&(d=`~${Math.min(l/S*100,100).toFixed(0)}% of input`)}const u=e.skills.entries.toSorted((S,R)=>R.blockChars-S.blockChars),g=e.tools.entries.toSorted((S,R)=>R.summaryChars+R.schemaChars-(S.summaryChars+S.schemaChars)),f=e.injectedWorkspaceFiles.toSorted((S,R)=>R.injectedChars-S.injectedChars),h=4,v=n,b=v?u:u.slice(0,h),A=v?g:g.slice(0,h),k=v?f:f.slice(0,h),T=u.length>h||g.length>h||f.length>h;return c`
    <div class="context-details-panel">
      <div class="context-breakdown-header">
        <div class="card-title" style="font-size: 12px; color: var(--text);">System Prompt Breakdown</div>
        ${T?c`<button class="context-expand-btn" @click=${s}>
                ${v?"Collapse":"Expand all"}
              </button>`:m}
      </div>
      <p class="context-weight-desc">
        ${d||"Base context per message"}
      </p>
      <div class="context-stacked-bar">
        <div class="context-segment system" style="width: ${mt(i,l).toFixed(1)}%" title="System: ~${z(i)}"></div>
        <div class="context-segment skills" style="width: ${mt(o,l).toFixed(1)}%" title="Skills: ~${z(o)}"></div>
        <div class="context-segment tools" style="width: ${mt(a,l).toFixed(1)}%" title="Tools: ~${z(a)}"></div>
        <div class="context-segment files" style="width: ${mt(r,l).toFixed(1)}%" title="Files: ~${z(r)}"></div>
      </div>
      <div class="context-legend">
        <span class="legend-item"><span class="legend-dot system"></span>Sys ~${z(i)}</span>
        <span class="legend-item"><span class="legend-dot skills"></span>Skills ~${z(o)}</span>
        <span class="legend-item"><span class="legend-dot tools"></span>Tools ~${z(a)}</span>
        <span class="legend-item"><span class="legend-dot files"></span>Files ~${z(r)}</span>
      </div>
      <div class="context-total">Total: ~${z(l)}</div>
      <div class="context-breakdown-grid">
        ${u.length>0?(()=>{const S=u.length-b.length;return c`
                  <div class="context-breakdown-card">
                    <div class="context-breakdown-title">Skills (${u.length})</div>
                    <div class="context-breakdown-list">
                      ${b.map(R=>c`
                          <div class="context-breakdown-item">
                            <span class="mono">${R.name}</span>
                            <span class="muted">~${z(Lt(R.blockChars))}</span>
                          </div>
                        `)}
                    </div>
                    ${S>0?c`<div class="context-breakdown-more">+${S} more</div>`:m}
                  </div>
                `})():m}
        ${g.length>0?(()=>{const S=g.length-A.length;return c`
                  <div class="context-breakdown-card">
                    <div class="context-breakdown-title">Tools (${g.length})</div>
                    <div class="context-breakdown-list">
                      ${A.map(R=>c`
                          <div class="context-breakdown-item">
                            <span class="mono">${R.name}</span>
                            <span class="muted">~${z(Lt(R.summaryChars+R.schemaChars))}</span>
                          </div>
                        `)}
                    </div>
                    ${S>0?c`<div class="context-breakdown-more">+${S} more</div>`:m}
                  </div>
                `})():m}
        ${f.length>0?(()=>{const S=f.length-k.length;return c`
                  <div class="context-breakdown-card">
                    <div class="context-breakdown-title">Files (${f.length})</div>
                    <div class="context-breakdown-list">
                      ${k.map(R=>c`
                          <div class="context-breakdown-item">
                            <span class="mono">${R.name}</span>
                            <span class="muted">~${z(Lt(R.injectedChars))}</span>
                          </div>
                        `)}
                    </div>
                    ${S>0?c`<div class="context-breakdown-more">+${S} more</div>`:m}
                  </div>
                `})():m}
      </div>
    </div>
  `}function Sh(e,t,n,s,i,o,a,r,l,d,u,g){if(t)return c`
      <div class="session-logs-compact">
        <div class="session-logs-header">Conversation</div>
        <div class="muted" style="padding: 20px; text-align: center">Loading...</div>
      </div>
    `;if(!e||e.length===0)return c`
      <div class="session-logs-compact">
        <div class="session-logs-header">Conversation</div>
        <div class="muted" style="padding: 20px; text-align: center">No messages</div>
      </div>
    `;const f=i.query.trim().toLowerCase(),h=e.map(I=>{const C=Sc(I.content),p=C.cleanContent||I.content;return{log:I,toolInfo:C,cleanContent:p}}),v=Array.from(new Set(h.flatMap(I=>I.toolInfo.tools.map(([C])=>C)))).toSorted((I,C)=>I.localeCompare(C)),b=h.filter(I=>{if(u!=null&&g!=null){const C=I.log.timestamp;if(C>0){const p=Math.min(u,g),_=Math.max(u,g),P=Tc(C);if(P<p||P>_)return!1}}return!(i.roles.length>0&&!i.roles.includes(I.log.role)||i.hasTools&&I.toolInfo.tools.length===0||i.tools.length>0&&!I.toolInfo.tools.some(([p])=>i.tools.includes(p))||f&&!I.cleanContent.toLowerCase().includes(f))}),A=i.roles.length>0||i.tools.length>0||i.hasTools||f,k=u!=null&&g!=null,T=A||k?`${b.length} of ${e.length} ${k?"(timeline filtered)":""}`:`${e.length}`,S=new Set(i.roles),R=new Set(i.tools);return c`
    <div class="session-logs-compact">
      <div class="session-logs-header">
        <span>Conversation <span style="font-weight: normal; color: var(--muted);">(${T} messages)</span></span>
        <button class="btn btn-sm usage-action-btn usage-secondary-btn" @click=${s}>
          ${n?"Collapse All":"Expand All"}
        </button>
      </div>
      <div class="usage-filters-inline" style="margin: 10px 12px;">
        <select
          multiple
          size="4"
          @change=${I=>o(Array.from(I.target.selectedOptions).map(C=>C.value))}
        >
          <option value="user" ?selected=${S.has("user")}>User</option>
          <option value="assistant" ?selected=${S.has("assistant")}>Assistant</option>
          <option value="tool" ?selected=${S.has("tool")}>Tool</option>
          <option value="toolResult" ?selected=${S.has("toolResult")}>Tool result</option>
        </select>
        <select
          multiple
          size="4"
          @change=${I=>a(Array.from(I.target.selectedOptions).map(C=>C.value))}
        >
          ${v.map(I=>c`<option value=${I} ?selected=${R.has(I)}>${I}</option>`)}
        </select>
        <label class="usage-filters-inline" style="gap: 6px;">
          <input
            type="checkbox"
            .checked=${i.hasTools}
            @change=${I=>r(I.target.checked)}
          />
          Has tools
        </label>
        <input
          type="text"
          placeholder="Search conversation"
          .value=${i.query}
          @input=${I=>l(I.target.value)}
        />
        <button class="btn btn-sm usage-action-btn usage-secondary-btn" @click=${d}>
          Clear
        </button>
      </div>
      <div class="session-logs-list">
        ${b.map(I=>{const{log:C,toolInfo:p,cleanContent:_}=I,P=C.role==="user"?"user":"assistant",O=C.role==="user"?"You":C.role==="assistant"?"Assistant":"Tool";return c`
          <div class="session-log-entry ${P}">
            <div class="session-log-meta">
              <span class="session-log-role">${O}</span>
              <span>${new Date(C.timestamp).toLocaleString()}</span>
              ${C.tokens?c`<span>${z(C.tokens)}</span>`:m}
            </div>
            <div class="session-log-content">${_}</div>
            ${p.tools.length>0?c`
                    <details class="session-log-tools" ?open=${n}>
                      <summary>${p.summary}</summary>
                      <div class="session-log-tools-list">
                        ${p.tools.map(([L,q])=>c`
                            <span class="session-log-tools-pill">${L} × ${q}</span>
                          `)}
                      </div>
                    </details>
                  `:m}
          </div>
        `})}
        ${b.length===0?c`
                <div class="muted" style="padding: 12px">No messages match the filters.</div>
              `:m}
      </div>
    </div>
  `}const Ah=`
  .usage-page-header {
    margin: 4px 0 12px;
  }
  .usage-page-title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .usage-page-subtitle {
    font-size: 13px;
    color: var(--muted);
    margin: 0 0 12px;
  }
  /* ===== FILTERS & HEADER ===== */
  .usage-filters-inline {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .usage-filters-inline select {
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
  }
  .usage-filters-inline input[type="date"] {
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
  }
  .usage-filters-inline input[type="text"] {
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
    min-width: 180px;
  }
  .usage-filters-inline .btn-sm {
    padding: 6px 12px;
    font-size: 14px;
  }
  .usage-refresh-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(255, 77, 77, 0.1);
    border-radius: 4px;
    font-size: 12px;
    color: #ff4d4d;
  }
  .usage-refresh-indicator::before {
    content: "";
    width: 10px;
    height: 10px;
    border: 2px solid #ff4d4d;
    border-top-color: transparent;
    border-radius: 50%;
    animation: usage-spin 0.6s linear infinite;
  }
  @keyframes usage-spin {
    to { transform: rotate(360deg); }
  }
  .active-filters {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .filter-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px 4px 12px;
    background: var(--accent-subtle);
    border: 1px solid var(--accent);
    border-radius: 16px;
    font-size: 12px;
  }
  .filter-chip-label {
    color: var(--accent);
    font-weight: 500;
  }
  .filter-chip-remove {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    padding: 2px 4px;
    font-size: 14px;
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.15s;
  }
  .filter-chip-remove:hover {
    opacity: 1;
  }
  .filter-clear-btn {
    padding: 4px 10px !important;
    font-size: 12px !important;
    line-height: 1 !important;
    margin-left: 8px;
  }
  .usage-query-bar {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) auto;
    gap: 10px;
    align-items: center;
    /* Keep the dropdown filter row from visually touching the query row. */
    margin-bottom: 10px;
  }
  .usage-query-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;
    justify-self: end;
  }
  .usage-query-actions .btn {
    height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 13px;
    line-height: 1;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text);
    box-shadow: none;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .usage-query-actions .btn:hover {
    background: var(--bg);
    border-color: var(--border-strong);
  }
  .usage-action-btn {
    height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 13px;
    line-height: 1;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text);
    box-shadow: none;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .usage-action-btn:hover {
    background: var(--bg);
    border-color: var(--border-strong);
  }
  .usage-primary-btn {
    background: #ff4d4d;
    color: #fff;
    border-color: #ff4d4d;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.12);
  }
  .btn.usage-primary-btn {
    background: #ff4d4d !important;
    border-color: #ff4d4d !important;
    color: #fff !important;
  }
  .usage-primary-btn:hover {
    background: #e64545;
    border-color: #e64545;
  }
  .btn.usage-primary-btn:hover {
    background: #e64545 !important;
    border-color: #e64545 !important;
  }
  .usage-primary-btn:disabled {
    background: rgba(255, 77, 77, 0.18);
    border-color: rgba(255, 77, 77, 0.3);
    color: #ff4d4d;
    box-shadow: none;
    cursor: default;
    opacity: 1;
  }
  .usage-primary-btn[disabled] {
    background: rgba(255, 77, 77, 0.18) !important;
    border-color: rgba(255, 77, 77, 0.3) !important;
    color: #ff4d4d !important;
    opacity: 1 !important;
  }
  .usage-secondary-btn {
    background: var(--bg-secondary);
    color: var(--text);
    border-color: var(--border);
  }
  .usage-query-input {
    width: 100%;
    min-width: 220px;
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
  }
  .usage-query-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }
  .usage-query-suggestion {
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    font-size: 11px;
    color: var(--text);
    cursor: pointer;
    transition: background 0.15s;
  }
  .usage-query-suggestion:hover {
    background: var(--bg-hover);
  }
  .usage-filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin-top: 14px;
  }
  details.usage-filter-select {
    position: relative;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 6px 10px;
    background: var(--bg);
    font-size: 12px;
    min-width: 140px;
  }
  details.usage-filter-select summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    font-weight: 500;
  }
  details.usage-filter-select summary::-webkit-details-marker {
    display: none;
  }
  .usage-filter-badge {
    font-size: 11px;
    color: var(--muted);
  }
  .usage-filter-popover {
    position: absolute;
    left: 0;
    top: calc(100% + 6px);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    min-width: 220px;
    z-index: 20;
  }
  .usage-filter-actions {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  }
  .usage-filter-actions button {
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 11px;
  }
  .usage-filter-options {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 200px;
    overflow: auto;
  }
  .usage-filter-option {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
  }
  .usage-query-hint {
    font-size: 11px;
    color: var(--muted);
  }
  .usage-query-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }
  .usage-query-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    font-size: 11px;
  }
  .usage-query-chip button {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  .usage-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--bg);
  }
  .usage-header.pinned {
    position: sticky;
    top: 12px;
    z-index: 6;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  }
  .usage-pin-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    font-size: 11px;
    color: var(--text);
    cursor: pointer;
  }
  .usage-pin-btn.active {
    background: var(--accent-subtle);
    border-color: var(--accent);
    color: var(--accent);
  }
  .usage-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .usage-header-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .usage-header-metrics {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .usage-metric-badge {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: transparent;
    font-size: 11px;
    color: var(--muted);
  }
  .usage-metric-badge strong {
    font-size: 12px;
    color: var(--text);
  }
  .usage-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .usage-controls .active-filters {
    flex: 1 1 100%;
  }
  .usage-controls input[type="date"] {
    min-width: 140px;
  }
  .usage-presets {
    display: inline-flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .usage-presets .btn {
    padding: 4px 8px;
    font-size: 11px;
  }
  .usage-quick-filters {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .usage-select {
    min-width: 120px;
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 12px;
  }
  .usage-export-menu summary {
    cursor: pointer;
    font-weight: 500;
    color: var(--text);
    list-style: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .usage-export-menu summary::-webkit-details-marker {
    display: none;
  }
  .usage-export-menu {
    position: relative;
  }
  .usage-export-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg);
    font-size: 12px;
  }
  .usage-export-popover {
    position: absolute;
    right: 0;
    top: calc(100% + 6px);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    min-width: 160px;
    z-index: 10;
  }
  .usage-export-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .usage-export-item {
    text-align: left;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    font-size: 12px;
  }
  .usage-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-top: 12px;
  }
  .usage-summary-card {
    padding: 12px;
    border-radius: 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
  }
  .usage-mosaic {
    margin-top: 16px;
    padding: 16px;
  }
  .usage-mosaic-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }
  .usage-mosaic-title {
    font-weight: 600;
  }
  .usage-mosaic-sub {
    font-size: 12px;
    color: var(--muted);
  }
  .usage-mosaic-grid {
    display: grid;
    grid-template-columns: minmax(200px, 1fr) minmax(260px, 2fr);
    gap: 16px;
    align-items: start;
  }
  .usage-mosaic-section {
    background: var(--bg-subtle);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
  }
  .usage-mosaic-section-title {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .usage-mosaic-total {
    font-size: 20px;
    font-weight: 700;
  }
  .usage-daypart-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 8px;
  }
  .usage-daypart-cell {
    border-radius: 8px;
    padding: 10px;
    color: var(--text);
    background: rgba(255, 77, 77, 0.08);
    border: 1px solid rgba(255, 77, 77, 0.2);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .usage-daypart-label {
    font-size: 12px;
    font-weight: 600;
  }
  .usage-daypart-value {
    font-size: 14px;
  }
  .usage-hour-grid {
    display: grid;
    grid-template-columns: repeat(24, minmax(6px, 1fr));
    gap: 4px;
  }
  .usage-hour-cell {
    height: 28px;
    border-radius: 6px;
    background: rgba(255, 77, 77, 0.1);
    border: 1px solid rgba(255, 77, 77, 0.2);
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .usage-hour-cell.selected {
    border-color: rgba(255, 77, 77, 0.8);
    box-shadow: 0 0 0 2px rgba(255, 77, 77, 0.2);
  }
  .usage-hour-labels {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 6px;
    margin-top: 8px;
    font-size: 11px;
    color: var(--muted);
  }
  .usage-hour-legend {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 10px;
    font-size: 11px;
    color: var(--muted);
  }
  .usage-hour-legend span {
    display: inline-block;
    width: 14px;
    height: 10px;
    border-radius: 4px;
    background: rgba(255, 77, 77, 0.15);
    border: 1px solid rgba(255, 77, 77, 0.2);
  }
  .usage-calendar-labels {
    display: grid;
    grid-template-columns: repeat(7, minmax(10px, 1fr));
    gap: 6px;
    font-size: 10px;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .usage-calendar {
    display: grid;
    grid-template-columns: repeat(7, minmax(10px, 1fr));
    gap: 6px;
  }
  .usage-calendar-cell {
    height: 18px;
    border-radius: 4px;
    border: 1px solid rgba(255, 77, 77, 0.2);
    background: rgba(255, 77, 77, 0.08);
  }
  .usage-calendar-cell.empty {
    background: transparent;
    border-color: transparent;
  }
  .usage-summary-title {
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .usage-info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 6px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg);
    font-size: 10px;
    color: var(--muted);
    cursor: help;
  }
  .usage-summary-value {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-strong);
  }
  .usage-summary-value.good {
    color: #1f8f4e;
  }
  .usage-summary-value.warn {
    color: #c57a00;
  }
  .usage-summary-value.bad {
    color: #c9372c;
  }
  .usage-summary-hint {
    font-size: 10px;
    color: var(--muted);
    cursor: help;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0 6px;
    line-height: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .usage-summary-sub {
    font-size: 11px;
    color: var(--muted);
    margin-top: 4px;
  }
  .usage-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .usage-list-item {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 12px;
    color: var(--text);
    align-items: flex-start;
  }
  .usage-list-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    text-align: right;
  }
  .usage-list-sub {
    font-size: 11px;
    color: var(--muted);
  }
  .usage-list-item.button {
    border: none;
    background: transparent;
    padding: 0;
    text-align: left;
    cursor: pointer;
  }
  .usage-list-item.button:hover {
    color: var(--text-strong);
  }
`,Ch=`
  .usage-list-item .muted {
    font-size: 11px;
  }
  .usage-error-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .usage-error-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
    align-items: center;
    font-size: 12px;
  }
  .usage-error-date {
    font-weight: 600;
  }
  .usage-error-rate {
    font-variant-numeric: tabular-nums;
  }
  .usage-error-sub {
    grid-column: 1 / -1;
    font-size: 11px;
    color: var(--muted);
  }
  .usage-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }
  .usage-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: 999px;
    font-size: 11px;
    background: var(--bg);
    color: var(--text);
  }
  .usage-meta-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }
  .usage-meta-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
  }
  .usage-meta-item span {
    color: var(--muted);
    font-size: 11px;
  }
  .usage-insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 12px;
  }
  .usage-insight-card {
    padding: 14px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
  }
  .usage-insight-title {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .usage-insight-subtitle {
    font-size: 11px;
    color: var(--muted);
    margin-top: 6px;
  }
  /* ===== CHART TOGGLE ===== */
  .chart-toggle {
    display: flex;
    background: var(--bg);
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .chart-toggle .toggle-btn {
    padding: 6px 14px;
    font-size: 13px;
    background: transparent;
    border: none;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  .chart-toggle .toggle-btn:hover {
    color: var(--text);
  }
  .chart-toggle .toggle-btn.active {
    background: #ff4d4d;
    color: white;
  }
  .chart-toggle.small .toggle-btn {
    padding: 4px 8px;
    font-size: 11px;
  }
  .sessions-toggle {
    border-radius: 4px;
  }
  .sessions-toggle .toggle-btn {
    border-radius: 4px;
  }
  .daily-chart-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    margin-bottom: 6px;
  }

  /* ===== DAILY BAR CHART ===== */
  .daily-chart {
    margin-top: 12px;
  }
  .daily-chart-bars {
    display: flex;
    align-items: flex-end;
    height: 200px;
    gap: 4px;
    padding: 8px 4px 36px;
  }
  .daily-bar-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
    cursor: pointer;
    position: relative;
    border-radius: 4px 4px 0 0;
    transition: background 0.15s;
    min-width: 0;
  }
  .daily-bar-wrapper:hover {
    background: var(--bg-hover);
  }
  .daily-bar-wrapper.selected {
    background: var(--accent-subtle);
  }
  .daily-bar-wrapper.selected .daily-bar {
    background: var(--accent);
  }
  .daily-bar {
    width: 100%;
    max-width: var(--bar-max-width, 32px);
    background: #ff4d4d;
    border-radius: 3px 3px 0 0;
    min-height: 2px;
    transition: all 0.15s;
    overflow: hidden;
  }
  .daily-bar-wrapper:hover .daily-bar {
    background: #cc3d3d;
  }
  .daily-bar-label {
    position: absolute;
    bottom: -28px;
    font-size: 10px;
    color: var(--muted);
    white-space: nowrap;
    text-align: center;
    transform: rotate(-35deg);
    transform-origin: top center;
  }
  .daily-bar-total {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: var(--muted);
    white-space: nowrap;
  }
  .daily-bar-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .daily-bar-wrapper:hover .daily-bar-tooltip {
    opacity: 1;
  }

  /* ===== COST/TOKEN BREAKDOWN BAR ===== */
  .cost-breakdown {
    margin-top: 18px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
  }
  .cost-breakdown-header {
    font-weight: 600;
    font-size: 15px;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
    color: var(--text-strong);
  }
  .cost-breakdown-bar {
    height: 28px;
    background: var(--bg);
    border-radius: 6px;
    overflow: hidden;
    display: flex;
  }
  .cost-segment {
    height: 100%;
    transition: width 0.3s ease;
    position: relative;
  }
  .cost-segment.output {
    background: #ef4444;
  }
  .cost-segment.input {
    background: #f59e0b;
  }
  .cost-segment.cache-write {
    background: #10b981;
  }
  .cost-segment.cache-read {
    background: #06b6d4;
  }
  .cost-breakdown-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 12px;
  }
  .cost-breakdown-total {
    margin-top: 10px;
    font-size: 12px;
    color: var(--muted);
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text);
    cursor: help;
  }
  .legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .legend-dot.output {
    background: #ef4444;
  }
  .legend-dot.input {
    background: #f59e0b;
  }
  .legend-dot.cache-write {
    background: #10b981;
  }
  .legend-dot.cache-read {
    background: #06b6d4;
  }
  .legend-dot.system {
    background: #ff4d4d;
  }
  .legend-dot.skills {
    background: #8b5cf6;
  }
  .legend-dot.tools {
    background: #ec4899;
  }
  .legend-dot.files {
    background: #f59e0b;
  }
  .cost-breakdown-note {
    margin-top: 10px;
    font-size: 11px;
    color: var(--muted);
    line-height: 1.4;
  }

  /* ===== SESSION BARS (scrollable list) ===== */
  .session-bars {
    margin-top: 16px;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
  }
  .session-bar-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.15s;
  }
  .session-bar-row:last-child {
    border-bottom: none;
  }
  .session-bar-row:hover {
    background: var(--bg-hover);
  }
  .session-bar-row.selected {
    background: var(--accent-subtle);
  }
  .session-bar-label {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 13px;
    color: var(--text);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .session-bar-title {
    /* Prefer showing the full name; wrap instead of truncating. */
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  .session-bar-meta {
    font-size: 10px;
    color: var(--muted);
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .session-bar-track {
    flex: 0 0 90px;
    height: 6px;
    background: var(--bg-secondary);
    border-radius: 4px;
    overflow: hidden;
    opacity: 0.6;
  }
  .session-bar-fill {
    height: 100%;
    background: rgba(255, 77, 77, 0.7);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  .session-bar-value {
    flex: 0 0 70px;
    text-align: right;
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--muted);
  }
  .session-bar-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex: 0 0 auto;
  }
  .session-copy-btn {
    height: 26px;
    padding: 0 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .session-copy-btn:hover {
    background: var(--bg);
    border-color: var(--border-strong);
    color: var(--text);
  }

  /* ===== TIME SERIES CHART ===== */
  .session-timeseries {
    margin-top: 24px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
  }
  .timeseries-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .timeseries-controls {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .timeseries-header {
    font-weight: 600;
    color: var(--text);
  }
  .timeseries-chart {
    width: 100%;
    overflow: hidden;
  }
  .timeseries-svg {
    width: 100%;
    height: auto;
    display: block;
  }
  .timeseries-svg .axis-label {
    font-size: 10px;
    fill: var(--muted);
  }
  .timeseries-svg .ts-area {
    fill: #ff4d4d;
    fill-opacity: 0.1;
  }
  .timeseries-svg .ts-line {
    fill: none;
    stroke: #ff4d4d;
    stroke-width: 2;
  }
  .timeseries-svg .ts-dot {
    fill: #ff4d4d;
    transition: r 0.15s, fill 0.15s;
  }
  .timeseries-svg .ts-dot:hover {
    r: 5;
  }
  .timeseries-svg .ts-bar {
    fill: #ff4d4d;
    transition: fill 0.15s;
  }
  .timeseries-svg .ts-bar:hover {
    fill: #cc3d3d;
  }
  .timeseries-svg .ts-bar.output { fill: #ef4444; }
  .timeseries-svg .ts-bar.input { fill: #f59e0b; }
  .timeseries-svg .ts-bar.cache-write { fill: #10b981; }
  .timeseries-svg .ts-bar.cache-read { fill: #06b6d4; }
  .timeseries-summary {
    margin-top: 12px;
    font-size: 13px;
    color: var(--muted);
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .timeseries-loading {
    padding: 24px;
    text-align: center;
    color: var(--muted);
  }

  /* ===== SESSION LOGS ===== */
  .session-logs {
    margin-top: 24px;
    background: var(--bg-secondary);
    border-radius: 8px;
    overflow: hidden;
  }
  .session-logs-header {
    padding: 10px 14px;
    font-weight: 600;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    background: var(--bg-secondary);
  }
  .session-logs-loading {
    padding: 24px;
    text-align: center;
    color: var(--muted);
  }
  .session-logs-list {
    max-height: 400px;
    overflow-y: auto;
  }
  .session-log-entry {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: var(--bg);
  }
  .session-log-entry:last-child {
    border-bottom: none;
  }
  .session-log-entry.user {
    border-left: 3px solid var(--accent);
  }
  .session-log-entry.assistant {
    border-left: 3px solid var(--border-strong);
  }
  .session-log-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 11px;
    color: var(--muted);
    flex-wrap: wrap;
  }
  .session-log-role {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 999px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
  }
  .session-log-entry.user .session-log-role {
    color: var(--accent);
  }
  .session-log-entry.assistant .session-log-role {
    color: var(--muted);
  }
  .session-log-content {
    font-size: 13px;
    line-height: 1.5;
    color: var(--text);
    white-space: pre-wrap;
    word-break: break-word;
    background: var(--bg-secondary);
    border-radius: 8px;
    padding: 8px 10px;
    border: 1px solid var(--border);
    max-height: 220px;
    overflow-y: auto;
  }

  /* ===== CONTEXT WEIGHT BREAKDOWN ===== */
  .context-weight-breakdown {
    margin-top: 24px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
  }
  .context-weight-breakdown .context-weight-header {
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 4px;
    color: var(--text);
  }
  .context-weight-desc {
    font-size: 12px;
    color: var(--muted);
    margin: 0 0 12px 0;
  }
  .context-stacked-bar {
    height: 24px;
    background: var(--bg);
    border-radius: 6px;
    overflow: hidden;
    display: flex;
  }
  .context-segment {
    height: 100%;
    transition: width 0.3s ease;
  }
  .context-segment.system {
    background: #ff4d4d;
  }
  .context-segment.skills {
    background: #8b5cf6;
  }
  .context-segment.tools {
    background: #ec4899;
  }
  .context-segment.files {
    background: #f59e0b;
  }
  .context-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 12px;
  }
  .context-total {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
  }
  .context-details {
    margin-top: 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
  }
  .context-details summary {
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }
  .context-details[open] summary {
    border-bottom: 1px solid var(--border);
  }
  .context-list {
    max-height: 200px;
    overflow-y: auto;
  }
  .context-list-header {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
    font-size: 11px;
    text-transform: uppercase;
    color: var(--muted);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
  }
  .context-list-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
    font-size: 12px;
    border-bottom: 1px solid var(--border);
  }
  .context-list-item:last-child {
    border-bottom: none;
  }
  .context-list-item .mono {
    font-family: var(--font-mono);
    color: var(--text);
  }
  .context-list-item .muted {
    color: var(--muted);
    font-family: var(--font-mono);
  }

  /* ===== NO CONTEXT NOTE ===== */
  .no-context-note {
    margin-top: 24px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.5;
  }

  /* ===== TWO COLUMN LAYOUT ===== */
  .usage-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-top: 18px;
    align-items: stretch;
  }
  .usage-grid-left {
    display: flex;
    flex-direction: column;
  }
  .usage-grid-right {
    display: flex;
    flex-direction: column;
  }
  
  /* ===== LEFT CARD (Daily + Breakdown) ===== */
  .usage-left-card {
    /* inherits background, border, shadow from .card */
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .usage-left-card .daily-chart-bars {
    flex: 1;
    min-height: 200px;
  }
  .usage-left-card .sessions-panel-title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 12px;
  }
`,Th=`
  
  /* ===== COMPACT DAILY CHART ===== */
  .daily-chart-compact {
    margin-bottom: 16px;
  }
  .daily-chart-compact .sessions-panel-title {
    margin-bottom: 8px;
  }
  .daily-chart-compact .daily-chart-bars {
    height: 100px;
    padding-bottom: 20px;
  }
  
  /* ===== COMPACT COST BREAKDOWN ===== */
  .cost-breakdown-compact {
    padding: 0;
    margin: 0;
    background: transparent;
    border-top: 1px solid var(--border);
    padding-top: 12px;
  }
  .cost-breakdown-compact .cost-breakdown-header {
    margin-bottom: 8px;
  }
  .cost-breakdown-compact .cost-breakdown-legend {
    gap: 12px;
  }
  .cost-breakdown-compact .cost-breakdown-note {
    display: none;
  }
  
  /* ===== SESSIONS CARD ===== */
  .sessions-card {
    /* inherits background, border, shadow from .card */
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .sessions-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .sessions-card-title {
    font-weight: 600;
    font-size: 14px;
  }
  .sessions-card-count {
    font-size: 12px;
    color: var(--muted);
  }
  .sessions-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 8px 0 10px;
    font-size: 12px;
    color: var(--muted);
  }
  .sessions-card-stats {
    display: inline-flex;
    gap: 12px;
  }
  .sessions-sort {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--muted);
  }
  .sessions-sort select {
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
    font-size: 12px;
  }
  .sessions-action-btn {
    height: 28px;
    padding: 0 10px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1;
  }
  .sessions-action-btn.icon {
    width: 32px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .sessions-card-hint {
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .sessions-card .session-bars {
    max-height: 280px;
    background: var(--bg);
    border-radius: 6px;
    border: 1px solid var(--border);
    margin: 0;
    overflow-y: auto;
    padding: 8px;
  }
  .sessions-card .session-bar-row {
    padding: 6px 8px;
    border-radius: 6px;
    margin-bottom: 3px;
    border: 1px solid transparent;
    transition: all 0.15s;
  }
  .sessions-card .session-bar-row:hover {
    border-color: var(--border);
    background: var(--bg-hover);
  }
  .sessions-card .session-bar-row.selected {
    border-color: var(--accent);
    background: var(--accent-subtle);
    box-shadow: inset 0 0 0 1px rgba(255, 77, 77, 0.15);
  }
  .sessions-card .session-bar-label {
    flex: 1 1 auto;
    min-width: 140px;
    font-size: 12px;
  }
  .sessions-card .session-bar-value {
    flex: 0 0 60px;
    font-size: 11px;
    font-weight: 600;
  }
  .sessions-card .session-bar-track {
    flex: 0 0 70px;
    height: 5px;
    opacity: 0.5;
  }
  .sessions-card .session-bar-fill {
    background: rgba(255, 77, 77, 0.55);
  }
  .sessions-clear-btn {
    margin-left: auto;
  }
  
  /* ===== EMPTY DETAIL STATE ===== */
  .session-detail-empty {
    margin-top: 18px;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 2px dashed var(--border);
    padding: 32px;
    text-align: center;
  }
  .session-detail-empty-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 8px;
  }
  .session-detail-empty-desc {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 16px;
    line-height: 1.5;
  }
  .session-detail-empty-features {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
  }
  .session-detail-empty-feature {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--muted);
  }
  .session-detail-empty-feature .icon {
    font-size: 16px;
  }
  
  /* ===== SESSION DETAIL PANEL ===== */
  .session-detail-panel {
    margin-top: 12px;
    /* inherits background, border-radius, shadow from .card */
    border: 2px solid var(--accent) !important;
  }
  .session-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
  }
  .session-detail-header:hover {
    background: var(--bg-hover);
  }
  .session-detail-title {
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .session-detail-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .session-close-btn {
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    cursor: pointer;
    padding: 2px 8px;
    font-size: 16px;
    line-height: 1;
    border-radius: 4px;
    transition: background 0.15s, color 0.15s;
  }
  .session-close-btn:hover {
    background: var(--bg-hover);
    color: var(--text);
    border-color: var(--accent);
  }
  .session-detail-stats {
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: var(--muted);
  }
  .session-detail-stats strong {
    color: var(--text);
    font-family: var(--font-mono);
  }
  .session-detail-content {
    padding: 12px;
  }
  .session-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
    margin-bottom: 12px;
  }
  .session-summary-card {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px;
    background: var(--bg-secondary);
  }
  .session-summary-title {
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .session-summary-value {
    font-size: 14px;
    font-weight: 600;
  }
  .session-summary-meta {
    font-size: 11px;
    color: var(--muted);
    margin-top: 4px;
  }
  .session-detail-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    /* Separate "Usage Over Time" from the summary + Top Tools/Model Mix cards above. */
    margin-top: 12px;
    margin-bottom: 10px;
  }
  .session-detail-bottom {
    display: grid;
    grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr);
    gap: 10px;
    align-items: stretch;
  }
  .session-detail-bottom .session-logs-compact {
    margin: 0;
    display: flex;
    flex-direction: column;
  }
  .session-detail-bottom .session-logs-compact .session-logs-list {
    flex: 1 1 auto;
    max-height: none;
  }
  .context-details-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--bg);
    border-radius: 6px;
    border: 1px solid var(--border);
    padding: 12px;
  }
  .context-breakdown-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
    margin-top: 8px;
  }
  .context-breakdown-card {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px;
    background: var(--bg-secondary);
  }
  .context-breakdown-title {
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .context-breakdown-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 11px;
  }
  .context-breakdown-item {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
  .context-breakdown-more {
    font-size: 10px;
    color: var(--muted);
    margin-top: 4px;
  }
  .context-breakdown-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .context-expand-btn {
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--muted);
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .context-expand-btn:hover {
    color: var(--text);
    border-color: var(--border-strong);
    background: var(--bg);
  }
  
  /* ===== COMPACT TIMESERIES ===== */
  .session-timeseries-compact {
    background: var(--bg);
    border-radius: 6px;
    border: 1px solid var(--border);
    padding: 12px;
    margin: 0;
  }
  .session-timeseries-compact .timeseries-header-row {
    margin-bottom: 8px;
  }
  .session-timeseries-compact .timeseries-header {
    font-size: 12px;
  }
  .session-timeseries-compact .timeseries-summary {
    font-size: 11px;
    margin-top: 8px;
  }
  
  /* ===== COMPACT CONTEXT ===== */
  .context-weight-compact {
    background: var(--bg);
    border-radius: 6px;
    border: 1px solid var(--border);
    padding: 12px;
    margin: 0;
  }
  .context-weight-compact .context-weight-header {
    font-size: 12px;
    margin-bottom: 4px;
  }
  .context-weight-compact .context-weight-desc {
    font-size: 11px;
    margin-bottom: 8px;
  }
  .context-weight-compact .context-stacked-bar {
    height: 16px;
  }
  .context-weight-compact .context-legend {
    font-size: 11px;
    gap: 10px;
    margin-top: 8px;
  }
  .context-weight-compact .context-total {
    font-size: 11px;
    margin-top: 6px;
  }
  .context-weight-compact .context-details {
    margin-top: 8px;
  }
  .context-weight-compact .context-details summary {
    font-size: 12px;
    padding: 6px 10px;
  }
  
  /* ===== COMPACT LOGS ===== */
  .session-logs-compact {
    background: var(--bg);
    border-radius: 10px;
    border: 1px solid var(--border);
    overflow: hidden;
    margin: 0;
    display: flex;
    flex-direction: column;
  }
  .session-logs-compact .session-logs-header {
    padding: 10px 12px;
    font-size: 12px;
  }
  .session-logs-compact .session-logs-list {
    max-height: none;
    flex: 1 1 auto;
    overflow: auto;
  }
  .session-logs-compact .session-log-entry {
    padding: 8px 12px;
  }
  .session-logs-compact .session-log-content {
    font-size: 12px;
    max-height: 160px;
  }
  .session-log-tools {
    margin-top: 6px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-secondary);
    padding: 6px 8px;
    font-size: 11px;
    color: var(--text);
  }
  .session-log-tools summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
  }
  .session-log-tools summary::-webkit-details-marker {
    display: none;
  }
  .session-log-tools-list {
    margin-top: 6px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .session-log-tools-pill {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 10px;
    background: var(--bg);
    color: var(--text);
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 900px) {
    .usage-grid {
      grid-template-columns: 1fr;
    }
    .session-detail-row {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 600px) {
    .session-bar-label {
      flex: 0 0 100px;
    }
    .cost-breakdown-legend {
      gap: 10px;
    }
    .legend-item {
      font-size: 11px;
    }
    .daily-chart-bars {
      height: 170px;
      gap: 6px;
      padding-bottom: 40px;
    }
    .daily-bar-label {
      font-size: 8px;
      bottom: -30px;
      transform: rotate(-45deg);
    }
    .usage-mosaic-grid {
      grid-template-columns: 1fr;
    }
    .usage-hour-grid {
      grid-template-columns: repeat(12, minmax(10px, 1fr));
    }
    .usage-hour-cell {
      height: 22px;
    }
  }

  /* ===== CHART AXIS ===== */
  .ts-axis-label {
    font-size: 5px;
    fill: var(--muted);
  }

  /* ===== RANGE SELECTION HANDLES ===== */
  .chart-handle-zone {
    position: absolute;
    top: 0;
    width: 16px;
    height: 100%;
    cursor: col-resize;
    z-index: 10;
    transform: translateX(-50%);
  }

  .timeseries-chart-wrapper {
    position: relative;
  }

  .timeseries-reset-btn {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 2px 10px;
    font-size: 11px;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s ease;
    margin-left: 8px;
  }

  .timeseries-reset-btn:hover {
    background: var(--bg-hover);
    color: var(--text);
    border-color: var(--border-strong);
  }
`,_h=[Ah,Ch,Th].join(`
`);function Eh(e){if(e.loading&&!e.totals)return c`
      <style>
        @keyframes initial-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes initial-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      </style>
      <section class="card">
        <div class="row" style="justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 2px;">
              <div class="card-title" style="margin: 0;">Token Usage</div>
              <span style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                background: rgba(255, 77, 77, 0.1);
                border-radius: 4px;
                font-size: 12px;
                color: #ff4d4d;
              ">
                <span style="
                  width: 10px;
                  height: 10px;
                  border: 2px solid #ff4d4d;
                  border-top-color: transparent;
                  border-radius: 50%;
                  animation: initial-spin 0.6s linear infinite;
                "></span>
                Loading
              </span>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
            <div style="display: flex; gap: 8px; align-items: center;">
              <input type="date" .value=${e.startDate} disabled style="padding: 6px 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text); font-size: 13px; opacity: 0.6;" />
              <span style="color: var(--muted);">to</span>
              <input type="date" .value=${e.endDate} disabled style="padding: 6px 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text); font-size: 13px; opacity: 0.6;" />
            </div>
          </div>
        </div>
      </section>
    `;const t=e.chartMode==="tokens",n=e.query.trim().length>0,s=e.queryDraft.trim().length>0,i=[...e.sessions].toSorted((D,N)=>{const U=t?D.usage?.totalTokens??0:D.usage?.totalCost??0;return(t?N.usage?.totalTokens??0:N.usage?.totalCost??0)-U}),o=e.selectedDays.length>0?i.filter(D=>{if(D.usage?.activityDates?.length)return D.usage.activityDates.some(V=>e.selectedDays.includes(V));if(!D.updatedAt)return!1;const N=new Date(D.updatedAt),U=`${N.getFullYear()}-${String(N.getMonth()+1).padStart(2,"0")}-${String(N.getDate()).padStart(2,"0")}`;return e.selectedDays.includes(U)}):i,a=(D,N)=>{if(N.length===0)return!0;const U=D.usage,V=U?.firstActivity??D.updatedAt,de=U?.lastActivity??D.updatedAt;if(!V||!de)return!1;const ne=Math.min(V,de),oe=Math.max(V,de);let Z=ne;for(;Z<=oe;){const W=new Date(Z),ae=Uo(W,e.timeZone);if(N.includes(ae))return!0;const le=Bo(W,e.timeZone);Z=Math.min(le.getTime(),oe)+1}return!1},r=e.selectedHours.length>0?o.filter(D=>a(D,e.selectedHours)):o,l=jf(r,e.query),d=l.sessions,u=l.warnings,g=oh(e.queryDraft,i,e.aggregates),f=Oo(e.query),h=D=>{const N=Ot(D);return f.filter(U=>Ot(U.key??"")===N).map(U=>U.value).filter(Boolean)},v=D=>{const N=new Set;for(const U of D)U&&N.add(U);return Array.from(N)},b=v(i.map(D=>D.agentId)).slice(0,12),A=v(i.map(D=>D.channel)).slice(0,12),k=v([...i.map(D=>D.modelProvider),...i.map(D=>D.providerOverride),...e.aggregates?.byProvider.map(D=>D.provider)??[]]).slice(0,12),T=v([...i.map(D=>D.model),...e.aggregates?.byModel.map(D=>D.model)??[]]).slice(0,12),S=v(e.aggregates?.tools.tools.map(D=>D.name)??[]).slice(0,12),R=e.selectedSessions.length===1?e.sessions.find(D=>D.key===e.selectedSessions[0])??d.find(D=>D.key===e.selectedSessions[0]):null,I=D=>D.reduce((N,U)=>(U.usage&&(N.input+=U.usage.input,N.output+=U.usage.output,N.cacheRead+=U.usage.cacheRead,N.cacheWrite+=U.usage.cacheWrite,N.totalTokens+=U.usage.totalTokens,N.totalCost+=U.usage.totalCost,N.inputCost+=U.usage.inputCost??0,N.outputCost+=U.usage.outputCost??0,N.cacheReadCost+=U.usage.cacheReadCost??0,N.cacheWriteCost+=U.usage.cacheWriteCost??0,N.missingCostEntries+=U.usage.missingCostEntries??0),N),{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}),C=D=>e.costDaily.filter(U=>D.includes(U.date)).reduce((U,V)=>(U.input+=V.input,U.output+=V.output,U.cacheRead+=V.cacheRead,U.cacheWrite+=V.cacheWrite,U.totalTokens+=V.totalTokens,U.totalCost+=V.totalCost,U.inputCost+=V.inputCost??0,U.outputCost+=V.outputCost??0,U.cacheReadCost+=V.cacheReadCost??0,U.cacheWriteCost+=V.cacheWriteCost??0,U),{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0});let p,_;const P=i.length;if(e.selectedSessions.length>0){const D=d.filter(N=>e.selectedSessions.includes(N.key));p=I(D),_=D.length}else e.selectedDays.length>0&&e.selectedHours.length===0?(p=C(e.selectedDays),_=d.length):e.selectedHours.length>0||n?(p=I(d),_=d.length):(p=e.totals,_=P);const O=e.selectedSessions.length>0?d.filter(D=>e.selectedSessions.includes(D.key)):n||e.selectedHours.length>0?d:e.selectedDays.length>0?o:i,L=eh(O,e.aggregates),q=e.selectedSessions.length>0?(()=>{const D=d.filter(U=>e.selectedSessions.includes(U.key)),N=new Set;for(const U of D)for(const V of U.usage?.activityDates??[])N.add(V);return N.size>0?e.costDaily.filter(U=>N.has(U.date)):e.costDaily})():e.costDaily,G=th(O,p,L),Q=!e.loading&&!e.totals&&e.sessions.length===0,E=(p?.missingCostEntries??0)>0||(p?p.totalTokens>0&&p.totalCost===0&&p.input+p.output+p.cacheRead+p.cacheWrite>0:!1),j=[{label:"Today",days:1},{label:"7d",days:7},{label:"30d",days:30}],X=D=>{const N=new Date,U=new Date;U.setDate(U.getDate()-(D-1)),e.onStartDateChange(mi(U)),e.onEndDateChange(mi(N))},J=(D,N,U)=>{if(U.length===0)return m;const V=h(D),de=new Set(V.map(Z=>Ot(Z))),ne=U.length>0&&U.every(Z=>de.has(Ot(Z))),oe=V.length;return c`
      <details
        class="usage-filter-select"
        @toggle=${Z=>{const W=Z.currentTarget;if(!W.open)return;const ae=le=>{le.composedPath().includes(W)||(W.open=!1,window.removeEventListener("click",ae,!0))};window.addEventListener("click",ae,!0)}}
      >
        <summary>
          <span>${N}</span>
          ${oe>0?c`<span class="usage-filter-badge">${oe}</span>`:c`
                  <span class="usage-filter-badge">All</span>
                `}
        </summary>
        <div class="usage-filter-popover">
          <div class="usage-filter-actions">
            <button
              class="btn btn-sm"
              @click=${Z=>{Z.preventDefault(),Z.stopPropagation(),e.onQueryDraftChange(or(e.queryDraft,D,U))}}
              ?disabled=${ne}
            >
              Select All
            </button>
            <button
              class="btn btn-sm"
              @click=${Z=>{Z.preventDefault(),Z.stopPropagation(),e.onQueryDraftChange(or(e.queryDraft,D,[]))}}
              ?disabled=${oe===0}
            >
              Clear
            </button>
          </div>
          <div class="usage-filter-options">
            ${U.map(Z=>{const W=de.has(Ot(Z));return c`
                <label class="usage-filter-option">
                  <input
                    type="checkbox"
                    .checked=${W}
                    @change=${ae=>{const le=ae.target,he=`${D}:${Z}`;e.onQueryDraftChange(le.checked?rh(e.queryDraft,he):ir(e.queryDraft,he))}}
                  />
                  <span>${Z}</span>
                </label>
              `})}
          </div>
        </div>
      </details>
    `},pe=mi(new Date);return c`
    <style>${_h}</style>

    <section class="usage-page-header">
      <div class="usage-page-title">Usage</div>
      <div class="usage-page-subtitle">See where tokens go, when sessions spike, and what drives cost.</div>
    </section>

    <section class="card usage-header ${e.headerPinned?"pinned":""}">
      <div class="usage-header-row">
        <div class="usage-header-title">
          <div class="card-title" style="margin: 0;">Filters</div>
          ${e.loading?c`
                  <span class="usage-refresh-indicator">Loading</span>
                `:m}
          ${Q?c`
                  <span class="usage-query-hint">Select a date range and click Refresh to load usage.</span>
                `:m}
        </div>
        <div class="usage-header-metrics">
          ${p?c`
                <span class="usage-metric-badge">
                  <strong>${z(p.totalTokens)}</strong> tokens
                </span>
                <span class="usage-metric-badge">
                  <strong>${ie(p.totalCost)}</strong> cost
                </span>
                <span class="usage-metric-badge">
                  <strong>${_}</strong>
                  session${_!==1?"s":""}
                </span>
              `:m}
          <button
            class="usage-pin-btn ${e.headerPinned?"active":""}"
            title=${e.headerPinned?"Unpin filters":"Pin filters"}
            @click=${e.onToggleHeaderPinned}
          >
            ${e.headerPinned?"Pinned":"Pin"}
          </button>
          <details
            class="usage-export-menu"
            @toggle=${D=>{const N=D.currentTarget;if(!N.open)return;const U=V=>{V.composedPath().includes(N)||(N.open=!1,window.removeEventListener("click",U,!0))};window.addEventListener("click",U,!0)}}
          >
            <summary class="usage-export-button">Export ▾</summary>
            <div class="usage-export-popover">
              <div class="usage-export-list">
                <button
                  class="usage-export-item"
                  @click=${()=>vi(`openclaw-usage-sessions-${pe}.csv`,sh(d),"text/csv")}
                  ?disabled=${d.length===0}
                >
                  Sessions CSV
                </button>
                <button
                  class="usage-export-item"
                  @click=${()=>vi(`openclaw-usage-daily-${pe}.csv`,ih(q),"text/csv")}
                  ?disabled=${q.length===0}
                >
                  Daily CSV
                </button>
                <button
                  class="usage-export-item"
                  @click=${()=>vi(`openclaw-usage-${pe}.json`,JSON.stringify({totals:p,sessions:d,daily:q,aggregates:L},null,2),"application/json")}
                  ?disabled=${d.length===0&&q.length===0}
                >
                  JSON
                </button>
              </div>
            </div>
          </details>
        </div>
      </div>
      <div class="usage-header-row">
        <div class="usage-controls">
          ${ch(e.selectedDays,e.selectedHours,e.selectedSessions,e.sessions,e.onClearDays,e.onClearHours,e.onClearSessions,e.onClearFilters)}
          <div class="usage-presets">
            ${j.map(D=>c`
                <button class="btn btn-sm" @click=${()=>X(D.days)}>
                  ${D.label}
                </button>
              `)}
          </div>
          <input
            type="date"
            .value=${e.startDate}
            title="Start Date"
            @change=${D=>e.onStartDateChange(D.target.value)}
          />
          <span style="color: var(--muted);">to</span>
          <input
            type="date"
            .value=${e.endDate}
            title="End Date"
            @change=${D=>e.onEndDateChange(D.target.value)}
          />
          <select
            title="Time zone"
            .value=${e.timeZone}
            @change=${D=>e.onTimeZoneChange(D.target.value)}
          >
            <option value="local">Local</option>
            <option value="utc">UTC</option>
          </select>
          <div class="chart-toggle">
            <button
              class="toggle-btn ${t?"active":""}"
              @click=${()=>e.onChartModeChange("tokens")}
            >
              Tokens
            </button>
            <button
              class="toggle-btn ${t?"":"active"}"
              @click=${()=>e.onChartModeChange("cost")}
            >
              Cost
            </button>
          </div>
          <button
            class="btn btn-sm usage-action-btn usage-primary-btn"
            @click=${e.onRefresh}
            ?disabled=${e.loading}
          >
            Refresh
          </button>
        </div>
        
      </div>

      <div style="margin-top: 12px;">
          <div class="usage-query-bar">
          <input
            class="usage-query-input"
            type="text"
            .value=${e.queryDraft}
            placeholder="Filter sessions (e.g. key:agent:main:cron* model:gpt-4o has:errors minTokens:2000)"
            @input=${D=>e.onQueryDraftChange(D.target.value)}
            @keydown=${D=>{D.key==="Enter"&&(D.preventDefault(),e.onApplyQuery())}}
          />
          <div class="usage-query-actions">
            <button
              class="btn btn-sm usage-action-btn usage-secondary-btn"
              @click=${e.onApplyQuery}
              ?disabled=${e.loading||!s&&!n}
            >
              Filter (client-side)
            </button>
            ${s||n?c`<button class="btn btn-sm usage-action-btn usage-secondary-btn" @click=${e.onClearQuery}>Clear</button>`:m}
            <span class="usage-query-hint">
              ${n?`${d.length} of ${P} sessions match`:`${P} sessions in range`}
            </span>
          </div>
        </div>
        <div class="usage-filter-row">
          ${J("agent","Agent",b)}
          ${J("channel","Channel",A)}
          ${J("provider","Provider",k)}
          ${J("model","Model",T)}
          ${J("tool","Tool",S)}
          <span class="usage-query-hint">
            Tip: use filters or click bars to filter days.
          </span>
        </div>
        ${f.length>0?c`
                <div class="usage-query-chips">
                  ${f.map(D=>{const N=D.raw;return c`
                      <span class="usage-query-chip">
                        ${N}
                        <button
                          title="Remove filter"
                          @click=${()=>e.onQueryDraftChange(ir(e.queryDraft,N))}
                        >
                          ×
                        </button>
                      </span>
                    `})}
                </div>
              `:m}
        ${g.length>0?c`
                <div class="usage-query-suggestions">
                  ${g.map(D=>c`
                      <button
                        class="usage-query-suggestion"
                        @click=${()=>e.onQueryDraftChange(ah(e.queryDraft,D.value))}
                      >
                        ${D.label}
                      </button>
                    `)}
                </div>
              `:m}
        ${u.length>0?c`
                <div class="callout warning" style="margin-top: 8px;">
                  ${u.join(" · ")}
                </div>
              `:m}
      </div>

      ${e.error?c`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:m}

      ${e.sessionsLimitReached?c`
              <div class="callout warning" style="margin-top: 12px">
                Showing first 1,000 sessions. Narrow date range for complete results.
              </div>
            `:m}
    </section>

    ${gh(p,L,G,E,Vf(O,e.timeZone),_,P)}

    ${Xf(O,e.timeZone,e.selectedHours,e.onSelectHour)}

    <!-- Two-column layout: Daily+Breakdown on left, Sessions on right -->
    <div class="usage-grid">
      <div class="usage-grid-left">
        <div class="card usage-left-card">
          ${dh(q,e.selectedDays,e.chartMode,e.dailyChartMode,e.onDailyChartModeChange,e.onSelectDay)}
          ${p?uh(p,e.chartMode):m}
        </div>
      </div>
      <div class="usage-grid-right">
        ${ph(d,e.selectedSessions,e.selectedDays,t,e.sessionSort,e.sessionSortDir,e.recentSessions,e.sessionsTab,e.onSelectSession,e.onSessionSortChange,e.onSessionSortDirChange,e.onSessionsTabChange,e.visibleColumns,P,e.onClearSessions)}
      </div>
    </div>

    <!-- Session Detail Panel (when selected) or Empty State -->
    ${R?$h(R,e.timeSeries,e.timeSeriesLoading,e.timeSeriesMode,e.onTimeSeriesModeChange,e.timeSeriesBreakdownMode,e.onTimeSeriesBreakdownChange,e.timeSeriesCursorStart,e.timeSeriesCursorEnd,e.onTimeSeriesCursorRangeChange,e.startDate,e.endDate,e.selectedDays,e.sessionLogs,e.sessionLogsLoading,e.sessionLogsExpanded,e.onToggleSessionLogsExpanded,{roles:e.logFilterRoles,tools:e.logFilterTools,hasTools:e.logFilterHasTools,query:e.logFilterQuery},e.onLogFilterRolesChange,e.onLogFilterToolsChange,e.onLogFilterHasToolsChange,e.onLogFilterQueryChange,e.onLogFilterClear,e.contextExpanded,e.onToggleContextExpanded,e.onClearSessions):vh()}
  `}let bi=null;const rr=e=>{bi&&clearTimeout(bi),bi=window.setTimeout(()=>{Vi(e)},400)};function Rh(e){return e.tab!=="usage"?m:Eh({loading:e.usageLoading,error:e.usageError,startDate:e.usageStartDate,endDate:e.usageEndDate,sessions:e.usageResult?.sessions??[],sessionsLimitReached:(e.usageResult?.sessions?.length??0)>=1e3,totals:e.usageResult?.totals??null,aggregates:e.usageResult?.aggregates??null,costDaily:e.usageCostSummary?.daily??[],selectedSessions:e.usageSelectedSessions,selectedDays:e.usageSelectedDays,selectedHours:e.usageSelectedHours,chartMode:e.usageChartMode,dailyChartMode:e.usageDailyChartMode,timeSeriesMode:e.usageTimeSeriesMode,timeSeriesBreakdownMode:e.usageTimeSeriesBreakdownMode,timeSeries:e.usageTimeSeries,timeSeriesLoading:e.usageTimeSeriesLoading,timeSeriesCursorStart:e.usageTimeSeriesCursorStart,timeSeriesCursorEnd:e.usageTimeSeriesCursorEnd,sessionLogs:e.usageSessionLogs,sessionLogsLoading:e.usageSessionLogsLoading,sessionLogsExpanded:e.usageSessionLogsExpanded,logFilterRoles:e.usageLogFilterRoles,logFilterTools:e.usageLogFilterTools,logFilterHasTools:e.usageLogFilterHasTools,logFilterQuery:e.usageLogFilterQuery,query:e.usageQuery,queryDraft:e.usageQueryDraft,sessionSort:e.usageSessionSort,sessionSortDir:e.usageSessionSortDir,recentSessions:e.usageRecentSessions,sessionsTab:e.usageSessionsTab,visibleColumns:e.usageVisibleColumns,timeZone:e.usageTimeZone,contextExpanded:e.usageContextExpanded,headerPinned:e.usageHeaderPinned,onStartDateChange:t=>{e.usageStartDate=t,e.usageSelectedDays=[],e.usageSelectedHours=[],e.usageSelectedSessions=[],rr(e)},onEndDateChange:t=>{e.usageEndDate=t,e.usageSelectedDays=[],e.usageSelectedHours=[],e.usageSelectedSessions=[],rr(e)},onRefresh:()=>Vi(e),onTimeZoneChange:t=>{e.usageTimeZone=t,e.usageSelectedDays=[],e.usageSelectedHours=[],e.usageSelectedSessions=[],Vi(e)},onToggleContextExpanded:()=>{e.usageContextExpanded=!e.usageContextExpanded},onToggleSessionLogsExpanded:()=>{e.usageSessionLogsExpanded=!e.usageSessionLogsExpanded},onLogFilterRolesChange:t=>{e.usageLogFilterRoles=t},onLogFilterToolsChange:t=>{e.usageLogFilterTools=t},onLogFilterHasToolsChange:t=>{e.usageLogFilterHasTools=t},onLogFilterQueryChange:t=>{e.usageLogFilterQuery=t},onLogFilterClear:()=>{e.usageLogFilterRoles=[],e.usageLogFilterTools=[],e.usageLogFilterHasTools=!1,e.usageLogFilterQuery=""},onToggleHeaderPinned:()=>{e.usageHeaderPinned=!e.usageHeaderPinned},onSelectHour:(t,n)=>{if(n&&e.usageSelectedHours.length>0){const s=Array.from({length:24},(r,l)=>l),i=e.usageSelectedHours[e.usageSelectedHours.length-1],o=s.indexOf(i),a=s.indexOf(t);if(o!==-1&&a!==-1){const[r,l]=o<a?[o,a]:[a,o],d=s.slice(r,l+1);e.usageSelectedHours=[...new Set([...e.usageSelectedHours,...d])]}}else e.usageSelectedHours.includes(t)?e.usageSelectedHours=e.usageSelectedHours.filter(s=>s!==t):e.usageSelectedHours=[...e.usageSelectedHours,t]},onQueryDraftChange:t=>{e.usageQueryDraft=t,e.usageQueryDebounceTimer&&window.clearTimeout(e.usageQueryDebounceTimer),e.usageQueryDebounceTimer=window.setTimeout(()=>{e.usageQuery=e.usageQueryDraft,e.usageQueryDebounceTimer=null},250)},onApplyQuery:()=>{e.usageQueryDebounceTimer&&(window.clearTimeout(e.usageQueryDebounceTimer),e.usageQueryDebounceTimer=null),e.usageQuery=e.usageQueryDraft},onClearQuery:()=>{e.usageQueryDebounceTimer&&(window.clearTimeout(e.usageQueryDebounceTimer),e.usageQueryDebounceTimer=null),e.usageQueryDraft="",e.usageQuery=""},onSessionSortChange:t=>{e.usageSessionSort=t},onSessionSortDirChange:t=>{e.usageSessionSortDir=t},onSessionsTabChange:t=>{e.usageSessionsTab=t},onToggleColumn:t=>{e.usageVisibleColumns.includes(t)?e.usageVisibleColumns=e.usageVisibleColumns.filter(n=>n!==t):e.usageVisibleColumns=[...e.usageVisibleColumns,t]},onSelectSession:(t,n)=>{if(e.usageTimeSeries=null,e.usageSessionLogs=null,e.usageRecentSessions=[t,...e.usageRecentSessions.filter(s=>s!==t)].slice(0,8),n&&e.usageSelectedSessions.length>0){const s=e.usageChartMode==="tokens",o=[...e.usageResult?.sessions??[]].toSorted((d,u)=>{const g=s?d.usage?.totalTokens??0:d.usage?.totalCost??0;return(s?u.usage?.totalTokens??0:u.usage?.totalCost??0)-g}).map(d=>d.key),a=e.usageSelectedSessions[e.usageSelectedSessions.length-1],r=o.indexOf(a),l=o.indexOf(t);if(r!==-1&&l!==-1){const[d,u]=r<l?[r,l]:[l,r],g=o.slice(d,u+1),f=[...new Set([...e.usageSelectedSessions,...g])];e.usageSelectedSessions=f}}else e.usageSelectedSessions.length===1&&e.usageSelectedSessions[0]===t?e.usageSelectedSessions=[]:e.usageSelectedSessions=[t];e.usageTimeSeriesCursorStart=null,e.usageTimeSeriesCursorEnd=null,e.usageSelectedSessions.length===1&&(Nf(e,e.usageSelectedSessions[0]),Of(e,e.usageSelectedSessions[0]))},onSelectDay:(t,n)=>{if(n&&e.usageSelectedDays.length>0){const s=(e.usageCostSummary?.daily??[]).map(r=>r.date),i=e.usageSelectedDays[e.usageSelectedDays.length-1],o=s.indexOf(i),a=s.indexOf(t);if(o!==-1&&a!==-1){const[r,l]=o<a?[o,a]:[a,o],d=s.slice(r,l+1),u=[...new Set([...e.usageSelectedDays,...d])];e.usageSelectedDays=u}}else e.usageSelectedDays.includes(t)?e.usageSelectedDays=e.usageSelectedDays.filter(s=>s!==t):e.usageSelectedDays=[t]},onChartModeChange:t=>{e.usageChartMode=t},onDailyChartModeChange:t=>{e.usageDailyChartMode=t},onTimeSeriesModeChange:t=>{e.usageTimeSeriesMode=t},onTimeSeriesBreakdownChange:t=>{e.usageTimeSeriesBreakdownMode=t},onTimeSeriesCursorRangeChange:(t,n)=>{e.usageTimeSeriesCursorStart=t,e.usageTimeSeriesCursorEnd=n},onClearDays:()=>{e.usageSelectedDays=[]},onClearHours:()=>{e.usageSelectedHours=[]},onClearSessions:()=>{e.usageSelectedSessions=[],e.usageTimeSeries=null,e.usageSessionLogs=null},onClearFilters:()=>{e.usageSelectedDays=[],e.usageSelectedHours=[],e.usageSelectedSessions=[],e.usageTimeSeries=null,e.usageSessionLogs=null}})}const Ho={CHILD:2},zo=e=>(...t)=>({_$litDirective$:e,values:t});let Ko=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,s){this._$Ct=t,this._$AM=n,this._$Ci=s}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};const{I:Ih}=jd,lr=e=>e,Lh=e=>e.strings===void 0,cr=()=>document.createComment(""),$n=(e,t,n)=>{const s=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0){const o=s.insertBefore(cr(),i),a=s.insertBefore(cr(),i);n=new Ih(o,a,e,e.options)}else{const o=n._$AB.nextSibling,a=n._$AM,r=a!==e;if(r){let l;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(l=e._$AU)!==a._$AU&&n._$AP(l)}if(o!==i||r){let l=n._$AA;for(;l!==o;){const d=lr(l).nextSibling;lr(s).insertBefore(l,i),l=d}}}return n},Mt=(e,t,n=e)=>(e._$AI(t,n),e),Mh={},Dh=(e,t=Mh)=>e._$AH=t,Ph=e=>e._$AH,yi=e=>{e._$AR(),e._$AA.remove()};const dr=(e,t,n)=>{const s=new Map;for(let i=t;i<=n;i++)s.set(e[i],i);return s},_c=zo(class extends Ko{constructor(e){if(super(e),e.type!==Ho.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let s;n===void 0?n=t:t!==void 0&&(s=t);const i=[],o=[];let a=0;for(const r of e)i[a]=s?s(r,a):a,o[a]=n(r,a),a++;return{values:o,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,s]){const i=Ph(e),{values:o,keys:a}=this.dt(t,n,s);if(!Array.isArray(i))return this.ut=a,o;const r=this.ut??=[],l=[];let d,u,g=0,f=i.length-1,h=0,v=o.length-1;for(;g<=f&&h<=v;)if(i[g]===null)g++;else if(i[f]===null)f--;else if(r[g]===a[h])l[h]=Mt(i[g],o[h]),g++,h++;else if(r[f]===a[v])l[v]=Mt(i[f],o[v]),f--,v--;else if(r[g]===a[v])l[v]=Mt(i[g],o[v]),$n(e,l[v+1],i[g]),g++,v--;else if(r[f]===a[h])l[h]=Mt(i[f],o[h]),$n(e,i[g],i[f]),f--,h++;else if(d===void 0&&(d=dr(a,h,v),u=dr(r,g,f)),d.has(r[g]))if(d.has(r[f])){const b=u.get(a[h]),A=b!==void 0?i[b]:null;if(A===null){const k=$n(e,i[g]);Mt(k,o[h]),l[h]=k}else l[h]=Mt(A,o[h]),$n(e,i[g],A),i[b]=null;h++}else yi(i[f]),f--;else yi(i[g]),g++;for(;h<=v;){const b=$n(e,l[v+1]);Mt(b,o[h]),l[h++]=b}for(;g<=f;){const b=i[g++];b!==null&&yi(b)}return this.ut=a,Dh(e,l),wt}}),ce={messageSquare:c`
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  `,barChart:c`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  `,link:c`
    <svg viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  `,radio:c`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" />
      <path
        d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"
      />
    </svg>
  `,fileText:c`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  `,zap:c`
    <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  `,monitor:c`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  `,settings:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,bug:c`
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
  `,scrollText:c`
    <svg viewBox="0 0 24 24">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  `,folder:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </svg>
  `,menu:c`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  `,x:c`
    <svg viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,check:c`
    <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
  `,arrowDown:c`
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  `,copy:c`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  `,search:c`
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  `,brain:c`
    <svg viewBox="1 2 22 21">
      <!-- Left half: heart curve -->
      <path d="M12 21C11 20 3 14.5 3 9a5 5 0 0 1 9-3" />
      <!-- Right half: brain folds -->
      <path d="M12 21c1-1 9-5.5 9-12a5 5 0 0 0-9-3" />
      <path d="M12 9.5c.8-1.2 2.4-1.8 4-1.2" />
      <path d="M12 13c1.2-1 3-.6 3.5.8" />
      <path d="M12 16.5c.8.6 2.2.4 2.8-.8" />
    </svg>
  `,book:c`
    <svg viewBox="0 0 24 24">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  `,loader:c`
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
  `,wrench:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </svg>
  `,fileCode:c`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  `,edit:c`
    <svg viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `,penLine:c`
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  `,paperclip:c`
    <svg viewBox="0 0 24 24">
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      />
    </svg>
  `,globe:c`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  `,image:c`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  `,smartphone:c`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  `,plug:c`
    <svg viewBox="0 0 24 24">
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  `,circle:c`
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
  `,puzzle:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.076.874.54 1.02 1.02a2.5 2.5 0 1 0 3.237-3.237c-.48-.146-.944-.505-1.02-1.02a.98.98 0 0 1 .303-.917l1.526-1.526A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.236 3.236c-.464.18-.894.527-.967 1.02Z"
      />
    </svg>
  `};function Fh(e){const t=e.hello?.snapshot,n=t?.sessionDefaults?.mainSessionKey?.trim();if(n)return n;const s=t?.sessionDefaults?.mainKey?.trim();return s||"main"}function Nh(e,t){e.sessionKey=t,e.chatMessage="",e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:t,lastActiveSessionKey:t})}function Oh(e,t){const n=Ks(t,e.basePath);return c`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{if(!(s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey)){if(s.preventDefault(),t==="chat"){const i=Fh(e);e.sessionKey!==i&&(Nh(e,i),e.loadAssistantIdentity())}e.setTab(t)}}}
      title=${zi(t)}
    >
      <span class="nav-item__icon" aria-hidden="true">${ce[Zg(t)]}</span>
      <span class="nav-item__text">${zi(t)}</span>
    </a>
  `}function Uh(e){const t=Bh(e.hello,e.sessionsResult),n=Kh(e.sessionKey,e.sessionsResult,t),s=e.onboarding,i=e.onboarding,o=e.onboarding?!1:e.settings.chatShowThinking,a=e.onboarding?!0:e.settings.chatFocusMode,r=c`
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
      <path d="M4 7V4h3"></path>
      <path d="M20 7V4h-3"></path>
      <path d="M4 17v3h3"></path>
      <path d="M20 17v3h-3"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;return c`
    <div class="chat-controls">
      <label class="field chat-controls__session">
        <select
          .value=${e.sessionKey}
          ?disabled=${!e.connected}
          @change=${d=>{const u=d.target.value;e.sessionKey=u,e.chatMessage="",e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:u,lastActiveSessionKey:u}),e.loadAssistantIdentity(),hp(e,u),jn(e)}}
        >
          ${_c(n,d=>d.key,d=>c`<option value=${d.key} title=${d.key}>
                ${d.displayName??d.key}
              </option>`)}
        </select>
      </label>
      <button
        class="btn btn--sm btn--icon"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${async()=>{const d=e;d.chatManualRefreshInFlight=!0,d.chatNewMessagesBelow=!1,await d.updateComplete,d.resetToolStream();try{await fc(e,{scheduleScroll:!1}),d.scrollToBottom({smooth:!0})}finally{requestAnimationFrame(()=>{d.chatManualRefreshInFlight=!1,d.chatNewMessagesBelow=!1})}}}
        title=${F("chat.refreshTitle")}
      >
        ${r}
      </button>
      <span class="chat-controls__separator">|</span>
      <button
        class="btn btn--sm btn--icon ${o?"active":""}"
        ?disabled=${s}
        @click=${()=>{s||e.applySettings({...e.settings,chatShowThinking:!e.settings.chatShowThinking})}}
        aria-pressed=${o}
        title=${F(s?"chat.onboardingDisabled":"chat.thinkingToggle")}
      >
        ${ce.brain}
      </button>
      <button
        class="btn btn--sm btn--icon ${a?"active":""}"
        ?disabled=${i}
        @click=${()=>{i||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})}}
        aria-pressed=${a}
        title=${F(i?"chat.onboardingDisabled":"chat.focusToggle")}
      >
        ${l}
      </button>
    </div>
  `}function Bh(e,t){const n=e?.snapshot,s=n?.sessionDefaults?.mainSessionKey?.trim();if(s)return s;const i=n?.sessionDefaults?.mainKey?.trim();return i||(t?.sessions?.some(o=>o.key==="main")?"main":null)}const xs={bluebubbles:"iMessage",telegram:"Telegram",discord:"Discord",signal:"Signal",slack:"Slack",whatsapp:"WhatsApp",matrix:"Matrix",email:"Email",sms:"SMS"},Hh=Object.keys(xs);function ur(e){return e.charAt(0).toUpperCase()+e.slice(1)}function zh(e){if(e==="main"||e==="agent:main:main")return{prefix:"",fallbackName:"Main Session"};if(e.includes(":subagent:"))return{prefix:"Subagent:",fallbackName:"Subagent:"};if(e.includes(":cron:"))return{prefix:"Cron:",fallbackName:"Cron Job:"};const t=e.match(/^agent:[^:]+:([^:]+):direct:(.+)$/);if(t){const s=t[1],i=t[2];return{prefix:"",fallbackName:`${xs[s]??ur(s)} · ${i}`}}const n=e.match(/^agent:[^:]+:([^:]+):group:(.+)$/);if(n){const s=n[1];return{prefix:"",fallbackName:`${xs[s]??ur(s)} Group`}}for(const s of Hh)if(e===s||e.startsWith(`${s}:`))return{prefix:"",fallbackName:`${xs[s]} Session`};return{prefix:"",fallbackName:e}}function xi(e,t){const n=t?.label?.trim()||"",s=t?.displayName?.trim()||"",{prefix:i,fallbackName:o}=zh(e),a=r=>i?new RegExp(`^${i.replace(/[.*+?^${}()|[\\]\\]/g,"\\$&")}\\s*`,"i").test(r)?r:`${i} ${r}`:r;return n&&n!==e?a(n):s&&s!==e?a(s):o}function Kh(e,t,n){const s=new Set,i=[],o=n&&t?.sessions?.find(r=>r.key===n),a=t?.sessions?.find(r=>r.key===e);if(n&&(s.add(n),i.push({key:n,displayName:xi(n,o||void 0)})),s.has(e)||(s.add(e),i.push({key:e,displayName:xi(e,a)})),t?.sessions)for(const r of t.sessions)s.has(r.key)||(s.add(r.key),i.push({key:r.key,displayName:xi(r.key,r)}));return i}const jh=["system","light","dark"];function Wh(e){const t=Math.max(0,jh.indexOf(e.theme)),n=s=>i=>{const a={element:i.currentTarget};(i.clientX||i.clientY)&&(a.pointerClientX=i.clientX,a.pointerClientY=i.clientY),e.setTheme(s,a)};return c`
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
          ${Vh()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${qh()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${Gh()}
        </button>
      </div>
    </div>
  `}function qh(){return c`
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
  `}function Gh(){return c`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function Vh(){return c`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function Ec(e,t){if(!e)return e;const s=e.files.some(i=>i.name===t.name)?e.files.map(i=>i.name===t.name?t:i):[...e.files,t];return{...e,files:s}}async function $i(e,t){if(!(!e.client||!e.connected||e.agentFilesLoading)){e.agentFilesLoading=!0,e.agentFilesError=null;try{const n=await e.client.request("agents.files.list",{agentId:t});n&&(e.agentFilesList=n,e.agentFileActive&&!n.files.some(s=>s.name===e.agentFileActive)&&(e.agentFileActive=null))}catch(n){e.agentFilesError=String(n)}finally{e.agentFilesLoading=!1}}}async function Jh(e,t,n,s){if(!(!e.client||!e.connected||e.agentFilesLoading)&&!Object.hasOwn(e.agentFileContents,n)){e.agentFilesLoading=!0,e.agentFilesError=null;try{const i=await e.client.request("agents.files.get",{agentId:t,name:n});if(i?.file){const o=i.file.content??"",a=e.agentFileContents[n]??"",r=e.agentFileDrafts[n],l=s?.preserveDraft??!0;e.agentFilesList=Ec(e.agentFilesList,i.file),e.agentFileContents={...e.agentFileContents,[n]:o},(!l||!Object.hasOwn(e.agentFileDrafts,n)||r===a)&&(e.agentFileDrafts={...e.agentFileDrafts,[n]:o})}}catch(i){e.agentFilesError=String(i)}finally{e.agentFilesLoading=!1}}}async function Qh(e,t,n,s){if(!(!e.client||!e.connected||e.agentFileSaving)){e.agentFileSaving=!0,e.agentFilesError=null;try{const i=await e.client.request("agents.files.set",{agentId:t,name:n,content:s});i?.file&&(e.agentFilesList=Ec(e.agentFilesList,i.file),e.agentFileContents={...e.agentFileContents,[n]:s},e.agentFileDrafts={...e.agentFileDrafts,[n]:s})}catch(i){e.agentFilesError=String(i)}finally{e.agentFileSaving=!1}}}function Yh(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",i=e.version??"";return`${t} ${n} ${s} ${i}`.trim()}function Xh(e){const t=e.ts??null;return t?se(t):"n/a"}function jo(e){return e?`${new Date(e).toLocaleDateString(void 0,{weekday:"short"})}, ${kt(e)} (${se(e)})`:"n/a"}function Zh(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function em(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function tm(e){const t=e.state??{},n=t.nextRunAtMs?kt(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?kt(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function Rc(e){const t=e.schedule;if(t.kind==="at"){const n=Date.parse(t.at);return Number.isFinite(n)?`At ${kt(n)}`:`At ${t.at}`}return t.kind==="every"?`Every ${So(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function nm(e){const t=e.payload;if(t.kind==="systemEvent")return`System: ${t.text}`;const n=`Agent: ${t.message}`,s=e.delivery;if(s&&s.mode!=="none"){const i=s.mode==="webhook"?s.to?` (${s.to})`:"":s.channel||s.to?` (${s.channel??"last"}${s.to?` -> ${s.to}`:""})`:"";return`${n} · ${s.mode}${i}`}return n}const sm=[{id:"fs",label:"Files"},{id:"runtime",label:"Runtime"},{id:"web",label:"Web"},{id:"memory",label:"Memory"},{id:"sessions",label:"Sessions"},{id:"ui",label:"UI"},{id:"messaging",label:"Messaging"},{id:"automation",label:"Automation"},{id:"nodes",label:"Nodes"},{id:"agents",label:"Agents"},{id:"media",label:"Media"}],Wn=[{id:"read",label:"read",description:"Read file contents",sectionId:"fs",profiles:["coding"]},{id:"write",label:"write",description:"Create or overwrite files",sectionId:"fs",profiles:["coding"]},{id:"edit",label:"edit",description:"Make precise edits",sectionId:"fs",profiles:["coding"]},{id:"apply_patch",label:"apply_patch",description:"Patch files (OpenAI)",sectionId:"fs",profiles:["coding"]},{id:"exec",label:"exec",description:"Run shell commands",sectionId:"runtime",profiles:["coding"]},{id:"process",label:"process",description:"Manage background processes",sectionId:"runtime",profiles:["coding"]},{id:"web_search",label:"web_search",description:"Search the web",sectionId:"web",profiles:[],includeInOpenClawGroup:!0},{id:"web_fetch",label:"web_fetch",description:"Fetch web content",sectionId:"web",profiles:[],includeInOpenClawGroup:!0},{id:"memory_search",label:"memory_search",description:"Semantic search",sectionId:"memory",profiles:["coding"],includeInOpenClawGroup:!0},{id:"memory_get",label:"memory_get",description:"Read memory files",sectionId:"memory",profiles:["coding"],includeInOpenClawGroup:!0},{id:"sessions_list",label:"sessions_list",description:"List sessions",sectionId:"sessions",profiles:["coding","messaging"],includeInOpenClawGroup:!0},{id:"sessions_history",label:"sessions_history",description:"Session history",sectionId:"sessions",profiles:["coding","messaging"],includeInOpenClawGroup:!0},{id:"sessions_send",label:"sessions_send",description:"Send to session",sectionId:"sessions",profiles:["coding","messaging"],includeInOpenClawGroup:!0},{id:"sessions_spawn",label:"sessions_spawn",description:"Spawn sub-agent",sectionId:"sessions",profiles:["coding"],includeInOpenClawGroup:!0},{id:"subagents",label:"subagents",description:"Manage sub-agents",sectionId:"sessions",profiles:["coding"],includeInOpenClawGroup:!0},{id:"session_status",label:"session_status",description:"Session status",sectionId:"sessions",profiles:["minimal","coding","messaging"],includeInOpenClawGroup:!0},{id:"browser",label:"browser",description:"Control web browser",sectionId:"ui",profiles:[],includeInOpenClawGroup:!0},{id:"canvas",label:"canvas",description:"Control canvases",sectionId:"ui",profiles:[],includeInOpenClawGroup:!0},{id:"message",label:"message",description:"Send messages",sectionId:"messaging",profiles:["messaging"],includeInOpenClawGroup:!0},{id:"cron",label:"cron",description:"Schedule tasks",sectionId:"automation",profiles:[],includeInOpenClawGroup:!0},{id:"gateway",label:"gateway",description:"Gateway control",sectionId:"automation",profiles:[],includeInOpenClawGroup:!0},{id:"nodes",label:"nodes",description:"Nodes + devices",sectionId:"nodes",profiles:[],includeInOpenClawGroup:!0},{id:"agents_list",label:"agents_list",description:"List agents",sectionId:"agents",profiles:[],includeInOpenClawGroup:!0},{id:"image",label:"image",description:"Image understanding",sectionId:"media",profiles:["coding"],includeInOpenClawGroup:!0},{id:"tts",label:"tts",description:"Text-to-speech conversion",sectionId:"media",profiles:[],includeInOpenClawGroup:!0}];new Map(Wn.map(e=>[e.id,e]));function wi(e){return Wn.filter(t=>t.profiles.includes(e)).map(t=>t.id)}const im={minimal:{allow:wi("minimal")},coding:{allow:wi("coding")},messaging:{allow:wi("messaging")},full:{}};function om(){const e=new Map;for(const n of Wn){const s=`group:${n.sectionId}`,i=e.get(s)??[];i.push(n.id),e.set(s,i)}return{"group:openclaw":Wn.filter(n=>n.includeInOpenClawGroup).map(n=>n.id),...Object.fromEntries(e.entries())}}const am=om(),rm=[{id:"minimal",label:"Minimal"},{id:"coding",label:"Coding"},{id:"messaging",label:"Messaging"},{id:"full",label:"Full"}];function lm(e){if(!e)return;const t=im[e];if(t&&!(!t.allow&&!t.deny))return{allow:t.allow?[...t.allow]:void 0,deny:t.deny?[...t.deny]:void 0}}function cm(){return sm.map(e=>({id:e.id,label:e.label,tools:Wn.filter(t=>t.sectionId===e.id).map(t=>({id:t.id,label:t.label,description:t.description}))})).filter(e=>e.tools.length>0)}const dm={bash:"exec","apply-patch":"apply_patch"},um={...am};function Ge(e){const t=e.trim().toLowerCase();return dm[t]??t}function gm(e){return e?e.map(Ge).filter(Boolean):[]}function pm(e){const t=gm(e),n=[];for(const s of t){const i=um[s];if(i){n.push(...i);continue}n.push(s)}return Array.from(new Set(n))}function fm(e){return lm(e)}const hm=cm(),mm=rm;function Ji(e){return e.name?.trim()||e.identity?.name?.trim()||e.id}function cs(e){const t=e.trim();if(!t||t.length>16)return!1;let n=!1;for(let s=0;s<t.length;s+=1)if(t.charCodeAt(s)>127){n=!0;break}return!(!n||t.includes("://")||t.includes("/")||t.includes("."))}function Gs(e,t){const n=t?.emoji?.trim();if(n&&cs(n))return n;const s=e.identity?.emoji?.trim();if(s&&cs(s))return s;const i=t?.avatar?.trim();if(i&&cs(i))return i;const o=e.identity?.avatar?.trim();return o&&cs(o)?o:""}function Ic(e,t){return t&&e===t?"default":null}function vm(e){if(e==null||!Number.isFinite(e))return"-";if(e<1024)return`${e} B`;const t=["KB","MB","GB","TB"];let n=e/1024,s=0;for(;n>=1024&&s<t.length-1;)n/=1024,s+=1;return`${n.toFixed(n<10?1:0)} ${t[s]}`}function Vs(e,t){const n=e;return{entry:(n?.agents?.list??[]).find(o=>o?.id===t),defaults:n?.agents?.defaults,globalTools:n?.tools}}function gr(e,t,n,s,i){const o=Vs(t,e.id),r=(n&&n.agentId===e.id?n.workspace:null)||o.entry?.workspace||o.defaults?.workspace||"default",l=o.entry?.model?Mn(o.entry?.model):Mn(o.defaults?.model),d=i?.name?.trim()||e.identity?.name?.trim()||e.name?.trim()||o.entry?.name||e.id,u=Gs(e,i)||"-",g=Array.isArray(o.entry?.skills)?o.entry?.skills:null,f=g?.length??null;return{workspace:r,model:l,identityName:d,identityEmoji:u,skillsLabel:g?`${f} selected`:"all skills",isDefault:!!(s&&e.id===s)}}function Mn(e){if(!e)return"-";if(typeof e=="string")return e.trim()||"-";if(typeof e=="object"&&e){const t=e,n=t.primary?.trim();if(n){const s=Array.isArray(t.fallbacks)?t.fallbacks.length:0;return s>0?`${n} (+${s} fallback)`:n}}return"-"}function pr(e){const t=e.match(/^(.+) \(\+\d+ fallback\)$/);return t?t[1]:e}function fr(e){if(!e)return null;if(typeof e=="string")return e.trim()||null;if(typeof e=="object"&&e){const t=e;return(typeof t.primary=="string"?t.primary:typeof t.model=="string"?t.model:typeof t.id=="string"?t.id:typeof t.value=="string"?t.value:null)?.trim()||null}return null}function bm(e){if(!e||typeof e=="string")return null;if(typeof e=="object"&&e){const t=e,n=Array.isArray(t.fallbacks)?t.fallbacks:Array.isArray(t.fallback)?t.fallback:null;return n?n.filter(s=>typeof s=="string"):null}return null}function ym(e){return e.split(",").map(t=>t.trim()).filter(Boolean)}function xm(e){const n=e?.agents?.defaults?.models;if(!n||typeof n!="object")return[];const s=[];for(const[i,o]of Object.entries(n)){const a=i.trim();if(!a)continue;const r=o&&typeof o=="object"&&"alias"in o&&typeof o.alias=="string"?o.alias?.trim():void 0,l=r&&r!==a?`${r} (${a})`:a;s.push({value:a,label:l})}return s}function $m(e,t){const n=xm(e),s=t?n.some(i=>i.value===t):!1;return t&&!s&&n.unshift({value:t,label:`Current (${t})`}),n.length===0?c`
      <option value="" disabled>No configured models</option>
    `:n.map(i=>c`<option value=${i.value}>${i.label}</option>`)}function wm(e){const t=Ge(e);if(!t)return{kind:"exact",value:""};if(t==="*")return{kind:"all"};if(!t.includes("*"))return{kind:"exact",value:t};const n=t.replace(/[.*+?^${}()|[\\]\\]/g,"\\$&");return{kind:"regex",value:new RegExp(`^${n.replaceAll("\\*",".*")}$`)}}function Qi(e){return Array.isArray(e)?pm(e).map(wm).filter(t=>t.kind!=="exact"||t.value.length>0):[]}function Dn(e,t){for(const n of t)if(n.kind==="all"||n.kind==="exact"&&e===n.value||n.kind==="regex"&&n.value.test(e))return!0;return!1}function km(e,t){if(!t)return!0;const n=Ge(e),s=Qi(t.deny);if(Dn(n,s))return!1;const i=Qi(t.allow);return!!(i.length===0||Dn(n,i)||n==="apply_patch"&&Dn("exec",i))}function hr(e,t){if(!Array.isArray(t)||t.length===0)return!1;const n=Ge(e),s=Qi(t);return!!(Dn(n,s)||n==="apply_patch"&&Dn("exec",s))}function Sm(e){return fm(e)??void 0}function Lc(e,t){return c`
    <section class="card">
      <div class="card-title">Agent Context</div>
      <div class="card-sub">${t}</div>
      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Workspace</div>
          <div class="mono">${e.workspace}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Primary Model</div>
          <div class="mono">${e.model}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Name</div>
          <div>${e.identityName}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Emoji</div>
          <div>${e.identityEmoji}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Skills Filter</div>
          <div>${e.skillsLabel}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Default</div>
          <div>${e.isDefault?"yes":"no"}</div>
        </div>
      </div>
    </section>
  `}function Am(e,t){const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function Cm(e){if(!e)return[];const t=new Set;for(const i of e.channelOrder??[])t.add(i);for(const i of e.channelMeta??[])t.add(i.id);for(const i of Object.keys(e.channelAccounts??{}))t.add(i);const n=[],s=e.channelOrder?.length?e.channelOrder:Array.from(t);for(const i of s)t.has(i)&&(n.push(i),t.delete(i));for(const i of t)n.push(i);return n.map(i=>({id:i,label:Am(e,i),accounts:e.channelAccounts?.[i]??[]}))}const Tm=["groupPolicy","streamMode","dmPolicy"];function _m(e,t){if(!e)return null;const s=(e.channels??{})[t];if(s&&typeof s=="object")return s;const i=e[t];return i&&typeof i=="object"?i:null}function Em(e){if(e==null)return"n/a";if(typeof e=="string"||typeof e=="number"||typeof e=="boolean")return String(e);try{return JSON.stringify(e)}catch{return"n/a"}}function Rm(e,t){const n=_m(e,t);return n?Tm.flatMap(s=>s in n?[{label:s,value:Em(n[s])}]:[]):[]}function Im(e){let t=0,n=0,s=0;for(const i of e){const o=i.probe&&typeof i.probe=="object"&&"ok"in i.probe?!!i.probe.ok:!1;(i.connected===!0||i.running===!0||o)&&(t+=1),i.configured&&(n+=1),i.enabled&&(s+=1)}return{total:e.length,connected:t,configured:n,enabled:s}}function Lm(e){const t=Cm(e.snapshot),n=e.lastSuccess?se(e.lastSuccess):"never";return c`
    <section class="grid grid-cols-2">
      ${Lc(e.context,"Workspace, identity, and model configuration.")}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Channels</div>
            <div class="card-sub">Gateway-wide channel status snapshot.</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
        </div>
        <div class="muted" style="margin-top: 8px;">
          Last refresh: ${n}
        </div>
        ${e.error?c`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:m}
        ${e.snapshot?m:c`
                <div class="callout info" style="margin-top: 12px">Load channels to see live status.</div>
              `}
        ${t.length===0?c`
                <div class="muted" style="margin-top: 16px">No channels found.</div>
              `:c`
                <div class="list" style="margin-top: 16px;">
                  ${t.map(s=>{const i=Im(s.accounts),o=i.total?`${i.connected}/${i.total} connected`:"no accounts",a=i.configured?`${i.configured} configured`:"not configured",r=i.total?`${i.enabled} enabled`:"disabled",l=Rm(e.configForm,s.id);return c`
                      <div class="list-item">
                        <div class="list-main">
                          <div class="list-title">${s.label}</div>
                          <div class="list-sub mono">${s.id}</div>
                        </div>
                        <div class="list-meta">
                          <div>${o}</div>
                          <div>${a}</div>
                          <div>${r}</div>
                          ${l.length>0?l.map(d=>c`<div>${d.label}: ${d.value}</div>`):m}
                        </div>
                      </div>
                    `})}
                </div>
              `}
      </section>
    </section>
  `}function Mm(e){const t=e.jobs.filter(n=>n.agentId===e.agentId);return c`
    <section class="grid grid-cols-2">
      ${Lc(e.context,"Workspace and scheduling targets.")}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Scheduler</div>
            <div class="card-sub">Gateway cron status.</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
        </div>
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
            <div class="stat-value">${jo(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        ${e.error?c`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:m}
      </section>
    </section>
    <section class="card">
      <div class="card-title">Agent Cron Jobs</div>
      <div class="card-sub">Scheduled jobs targeting this agent.</div>
      ${t.length===0?c`
              <div class="muted" style="margin-top: 16px">No jobs assigned.</div>
            `:c`
              <div class="list" style="margin-top: 16px;">
                ${t.map(n=>c`
                    <div class="list-item">
                      <div class="list-main">
                        <div class="list-title">${n.name}</div>
                        ${n.description?c`<div class="list-sub">${n.description}</div>`:m}
                        <div class="chip-row" style="margin-top: 6px;">
                          <span class="chip">${Rc(n)}</span>
                          <span class="chip ${n.enabled?"chip-ok":"chip-warn"}">
                            ${n.enabled?"enabled":"disabled"}
                          </span>
                          <span class="chip">${n.sessionTarget}</span>
                        </div>
                      </div>
                      <div class="list-meta">
                        <div class="mono">${tm(n)}</div>
                        <div class="muted">${nm(n)}</div>
                      </div>
                    </div>
                  `)}
              </div>
            `}
    </section>
  `}function Dm(e){const t=e.agentFilesList?.agentId===e.agentId?e.agentFilesList:null,n=t?.files??[],s=e.agentFileActive??null,i=s?n.find(l=>l.name===s)??null:null,o=s?e.agentFileContents[s]??"":"",a=s?e.agentFileDrafts[s]??o:"",r=s?a!==o:!1;return c`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Core Files</div>
          <div class="card-sub">Bootstrap persona, identity, and tool guidance.</div>
        </div>
        <button
          class="btn btn--sm"
          ?disabled=${e.agentFilesLoading}
          @click=${()=>e.onLoadFiles(e.agentId)}
        >
          ${e.agentFilesLoading?"Loading…":"Refresh"}
        </button>
      </div>
      ${t?c`<div class="muted mono" style="margin-top: 8px;">Workspace: ${t.workspace}</div>`:m}
      ${e.agentFilesError?c`<div class="callout danger" style="margin-top: 12px;">${e.agentFilesError}</div>`:m}
      ${t?c`
              <div class="agent-files-grid" style="margin-top: 16px;">
                <div class="agent-files-list">
                  ${n.length===0?c`
                          <div class="muted">No files found.</div>
                        `:n.map(l=>Pm(l,s,()=>e.onSelectFile(l.name)))}
                </div>
                <div class="agent-files-editor">
                  ${i?c`
                          <div class="agent-file-header">
                            <div>
                              <div class="agent-file-title mono">${i.name}</div>
                              <div class="agent-file-sub mono">${i.path}</div>
                            </div>
                            <div class="agent-file-actions">
                              <button
                                class="btn btn--sm"
                                ?disabled=${!r}
                                @click=${()=>e.onFileReset(i.name)}
                              >
                                Reset
                              </button>
                              <button
                                class="btn btn--sm primary"
                                ?disabled=${e.agentFileSaving||!r}
                                @click=${()=>e.onFileSave(i.name)}
                              >
                                ${e.agentFileSaving?"Saving…":"Save"}
                              </button>
                            </div>
                          </div>
                          ${i.missing?c`
                                  <div class="callout info" style="margin-top: 10px">
                                    This file is missing. Saving will create it in the agent workspace.
                                  </div>
                                `:m}
                          <label class="field" style="margin-top: 12px;">
                            <span>Content</span>
                            <textarea
                              .value=${a}
                              @input=${l=>e.onFileDraftChange(i.name,l.target.value)}
                            ></textarea>
                          </label>
                        `:c`
                          <div class="muted">Select a file to edit.</div>
                        `}
                </div>
              </div>
            `:c`
              <div class="callout info" style="margin-top: 12px">
                Load the agent workspace files to edit core instructions.
              </div>
            `}
    </section>
  `}function Pm(e,t,n){const s=e.missing?"Missing":`${vm(e.size)} · ${se(e.updatedAtMs??null)}`;return c`
    <button
      type="button"
      class="agent-file-row ${t===e.name?"active":""}"
      @click=${n}
    >
      <div>
        <div class="agent-file-name mono">${e.name}</div>
        <div class="agent-file-meta">${s}</div>
      </div>
      ${e.missing?c`
              <span class="agent-pill warn">missing</span>
            `:m}
    </button>
  `}const ds=[{id:"workspace",label:"Workspace Skills",sources:["openclaw-workspace"]},{id:"built-in",label:"Built-in Skills",sources:["openclaw-bundled"]},{id:"installed",label:"Installed Skills",sources:["openclaw-managed"]},{id:"extra",label:"Extra Skills",sources:["openclaw-extra"]}];function Mc(e){const t=new Map;for(const o of ds)t.set(o.id,{id:o.id,label:o.label,skills:[]});const n=ds.find(o=>o.id==="built-in"),s={id:"other",label:"Other Skills",skills:[]};for(const o of e){const a=o.bundled?n:ds.find(r=>r.sources.includes(o.source));a?t.get(a.id)?.skills.push(o):s.skills.push(o)}const i=ds.map(o=>t.get(o.id)).filter(o=>!!(o&&o.skills.length>0));return s.skills.length>0&&i.push(s),i}function Dc(e){return[...e.missing.bins.map(t=>`bin:${t}`),...e.missing.env.map(t=>`env:${t}`),...e.missing.config.map(t=>`config:${t}`),...e.missing.os.map(t=>`os:${t}`)]}function Pc(e){const t=[];return e.disabled&&t.push("disabled"),e.blockedByAllowlist&&t.push("blocked by allowlist"),t}function Fc(e){const t=e.skill,n=!!e.showBundledBadge;return c`
    <div class="chip-row" style="margin-top: 6px;">
      <span class="chip">${t.source}</span>
      ${n?c`
              <span class="chip">bundled</span>
            `:m}
      <span class="chip ${t.eligible?"chip-ok":"chip-warn"}">
        ${t.eligible?"eligible":"blocked"}
      </span>
      ${t.disabled?c`
              <span class="chip chip-warn">disabled</span>
            `:m}
    </div>
  `}function Fm(e){const t=Vs(e.configForm,e.agentId),n=t.entry?.tools??{},s=t.globalTools??{},i=n.profile??s.profile??"full",o=n.profile?"agent override":s.profile?"global default":"default",a=Array.isArray(n.allow)&&n.allow.length>0,r=Array.isArray(s.allow)&&s.allow.length>0,l=!!e.configForm&&!e.configLoading&&!e.configSaving&&!a,d=a?[]:Array.isArray(n.alsoAllow)?n.alsoAllow:[],u=a?[]:Array.isArray(n.deny)?n.deny:[],g=a?{allow:n.allow??[],deny:n.deny??[]}:Sm(i)??void 0,f=e.toolsCatalogResult?.groups?.length&&e.toolsCatalogResult.agentId===e.agentId?e.toolsCatalogResult.groups:hm,h=e.toolsCatalogResult?.profiles?.length&&e.toolsCatalogResult.agentId===e.agentId?e.toolsCatalogResult.profiles:mm,v=f.flatMap(S=>S.tools.map(R=>R.id)),b=S=>{const R=km(S,g),I=hr(S,d),C=hr(S,u);return{allowed:(R||I)&&!C,baseAllowed:R,denied:C}},A=v.filter(S=>b(S).allowed).length,k=(S,R)=>{const I=new Set(d.map(P=>Ge(P)).filter(P=>P.length>0)),C=new Set(u.map(P=>Ge(P)).filter(P=>P.length>0)),p=b(S).baseAllowed,_=Ge(S);R?(C.delete(_),p||I.add(_)):(I.delete(_),C.add(_)),e.onOverridesChange(e.agentId,[...I],[...C])},T=S=>{const R=new Set(d.map(C=>Ge(C)).filter(C=>C.length>0)),I=new Set(u.map(C=>Ge(C)).filter(C=>C.length>0));for(const C of v){const p=b(C).baseAllowed,_=Ge(C);S?(I.delete(_),p||R.add(_)):(R.delete(_),I.add(_))}e.onOverridesChange(e.agentId,[...R],[...I])};return c`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Tool Access</div>
          <div class="card-sub">
            Profile + per-tool overrides for this agent.
            <span class="mono">${A}/${v.length}</span> enabled.
          </div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn btn--sm" ?disabled=${!l} @click=${()=>T(!0)}>
            Enable All
          </button>
          <button class="btn btn--sm" ?disabled=${!l} @click=${()=>T(!1)}>
            Disable All
          </button>
          <button class="btn btn--sm" ?disabled=${e.configLoading} @click=${e.onConfigReload}>
            Reload Config
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?"Saving…":"Save"}
          </button>
        </div>
      </div>

      ${e.toolsCatalogError?c`
              <div class="callout warn" style="margin-top: 12px">
                Could not load runtime tool catalog. Showing fallback list.
              </div>
            `:m}
      ${e.configForm?m:c`
              <div class="callout info" style="margin-top: 12px">
                Load the gateway config to adjust tool profiles.
              </div>
            `}
      ${a?c`
              <div class="callout info" style="margin-top: 12px">
                This agent is using an explicit allowlist in config. Tool overrides are managed in the Config tab.
              </div>
            `:m}
      ${r?c`
              <div class="callout info" style="margin-top: 12px">
                Global tools.allow is set. Agent overrides cannot enable tools that are globally blocked.
              </div>
            `:m}

      <div class="agent-tools-meta" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Profile</div>
          <div class="mono">${i}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Source</div>
          <div>${o}</div>
        </div>
        ${e.configDirty?c`
                <div class="agent-kv">
                  <div class="label">Status</div>
                  <div class="mono">unsaved</div>
                </div>
              `:m}
      </div>

      <div class="agent-tools-presets" style="margin-top: 16px;">
        <div class="label">Quick Presets</div>
        <div class="agent-tools-buttons">
          ${h.map(S=>c`
              <button
                class="btn btn--sm ${i===S.id?"active":""}"
                ?disabled=${!l}
                @click=${()=>e.onProfileChange(e.agentId,S.id,!0)}
              >
                ${S.label}
              </button>
            `)}
          <button
            class="btn btn--sm"
            ?disabled=${!l}
            @click=${()=>e.onProfileChange(e.agentId,null,!1)}
          >
            Inherit
          </button>
        </div>
      </div>

      <div class="agent-tools-grid" style="margin-top: 20px;">
        ${f.map(S=>c`
              <div class="agent-tools-section">
                <div class="agent-tools-header">
                  ${S.label}
                  ${"source"in S&&S.source==="plugin"?c`
                          <span class="mono" style="margin-left: 6px">plugin</span>
                        `:m}
                </div>
                <div class="agent-tools-list">
                  ${S.tools.map(R=>{const{allowed:I}=b(R.id),C=R,p=C.source==="plugin"?C.pluginId?`plugin:${C.pluginId}`:"plugin":"core",_=C.optional===!0;return c`
                      <div class="agent-tool-row">
                        <div>
                          <div class="agent-tool-title mono">
                            ${R.label}
                            <span class="mono" style="margin-left: 8px; opacity: 0.8;">${p}</span>
                            ${_?c`
                                    <span class="mono" style="margin-left: 6px; opacity: 0.8">optional</span>
                                  `:m}
                          </div>
                          <div class="agent-tool-sub">${R.description}</div>
                        </div>
                        <label class="cfg-toggle">
                          <input
                            type="checkbox"
                            .checked=${I}
                            ?disabled=${!l}
                            @change=${P=>k(R.id,P.target.checked)}
                          />
                          <span class="cfg-toggle__track"></span>
                        </label>
                      </div>
                    `})}
                </div>
              </div>
            `)}
      </div>
      ${e.toolsCatalogLoading?c`
              <div class="card-sub" style="margin-top: 10px">Refreshing tool catalog…</div>
            `:m}
    </section>
  `}function Nm(e){const t=!!e.configForm&&!e.configLoading&&!e.configSaving,n=Vs(e.configForm,e.agentId),s=Array.isArray(n.entry?.skills)?n.entry?.skills:void 0,i=new Set((s??[]).map(h=>h.trim()).filter(Boolean)),o=s!==void 0,a=!!(e.report&&e.activeAgentId===e.agentId),r=a?e.report?.skills??[]:[],l=e.filter.trim().toLowerCase(),d=l?r.filter(h=>[h.name,h.description,h.source].join(" ").toLowerCase().includes(l)):r,u=Mc(d),g=o?r.filter(h=>i.has(h.name)).length:r.length,f=r.length;return c`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Skills</div>
          <div class="card-sub">
            Per-agent skill allowlist and workspace skills.
            ${f>0?c`<span class="mono">${g}/${f}</span>`:m}
          </div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn btn--sm" ?disabled=${!t} @click=${()=>e.onClear(e.agentId)}>
            Use All
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!t}
            @click=${()=>e.onDisableAll(e.agentId)}
          >
            Disable All
          </button>
          <button class="btn btn--sm" ?disabled=${e.configLoading} @click=${e.onConfigReload}>
            Reload Config
          </button>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Loading…":"Refresh"}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?"Saving…":"Save"}
          </button>
        </div>
      </div>

      ${e.configForm?m:c`
              <div class="callout info" style="margin-top: 12px">
                Load the gateway config to set per-agent skills.
              </div>
            `}
      ${o?c`
              <div class="callout info" style="margin-top: 12px">This agent uses a custom skill allowlist.</div>
            `:c`
              <div class="callout info" style="margin-top: 12px">
                All skills are enabled. Disabling any skill will create a per-agent allowlist.
              </div>
            `}
      ${!a&&!e.loading?c`
              <div class="callout info" style="margin-top: 12px">
                Load skills for this agent to view workspace-specific entries.
              </div>
            `:m}
      ${e.error?c`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:m}

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${e.filter}
            @input=${h=>e.onFilterChange(h.target.value)}
            placeholder="Search skills"
          />
        </label>
        <div class="muted">${d.length} shown</div>
      </div>

      ${d.length===0?c`
              <div class="muted" style="margin-top: 16px">No skills found.</div>
            `:c`
              <div class="agent-skills-groups" style="margin-top: 16px;">
                ${u.map(h=>Om(h,{agentId:e.agentId,allowSet:i,usingAllowlist:o,editable:t,onToggle:e.onToggle}))}
              </div>
            `}
    </section>
  `}function Om(e,t){const n=e.id==="workspace"||e.id==="built-in";return c`
    <details class="agent-skills-group" ?open=${!n}>
      <summary class="agent-skills-header">
        <span>${e.label}</span>
        <span class="muted">${e.skills.length}</span>
      </summary>
      <div class="list skills-grid">
        ${e.skills.map(s=>Um(s,{agentId:t.agentId,allowSet:t.allowSet,usingAllowlist:t.usingAllowlist,editable:t.editable,onToggle:t.onToggle}))}
      </div>
    </details>
  `}function Um(e,t){const n=t.usingAllowlist?t.allowSet.has(e.name):!0,s=Dc(e),i=Pc(e);return c`
    <div class="list-item agent-skill-row">
      <div class="list-main">
        <div class="list-title">${e.emoji?`${e.emoji} `:""}${e.name}</div>
        <div class="list-sub">${e.description}</div>
        ${Fc({skill:e})}
        ${s.length>0?c`<div class="muted" style="margin-top: 6px;">Missing: ${s.join(", ")}</div>`:m}
        ${i.length>0?c`<div class="muted" style="margin-top: 6px;">Reason: ${i.join(", ")}</div>`:m}
      </div>
      <div class="list-meta">
        <label class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${n}
            ?disabled=${!t.editable}
            @change=${o=>t.onToggle(t.agentId,e.name,o.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </label>
      </div>
    </div>
  `}function Bm(e){const t=e.agentsList?.agents??[],n=e.agentsList?.defaultId??null,s=e.selectedAgentId??n??t[0]?.id??null,i=s?t.find(o=>o.id===s)??null:null;return c`
    <div class="agents-layout">
      <section class="card agents-sidebar">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Agents</div>
            <div class="card-sub">${t.length} configured.</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Loading…":"Refresh"}
          </button>
        </div>
        ${e.error?c`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:m}
        <div class="agent-list" style="margin-top: 12px;">
          ${t.length===0?c`
                  <div class="muted">No agents found.</div>
                `:t.map(o=>{const a=Ic(o.id,n),r=Gs(o,e.agentIdentityById[o.id]??null);return c`
                    <button
                      type="button"
                      class="agent-row ${s===o.id?"active":""}"
                      @click=${()=>e.onSelectAgent(o.id)}
                    >
                      <div class="agent-avatar">${r||Ji(o).slice(0,1)}</div>
                      <div class="agent-info">
                        <div class="agent-title">${Ji(o)}</div>
                        <div class="agent-sub mono">${o.id}</div>
                      </div>
                      ${a?c`<span class="agent-pill">${a}</span>`:m}
                    </button>
                  `})}
        </div>
      </section>
      <section class="agents-main">
        ${i?c`
                ${Hm(i,n,e.agentIdentityById[i.id]??null)}
                ${zm(e.activePanel,o=>e.onSelectPanel(o))}
                ${e.activePanel==="overview"?Km({agent:i,defaultId:n,configForm:e.configForm,agentFilesList:e.agentFilesList,agentIdentity:e.agentIdentityById[i.id]??null,agentIdentityError:e.agentIdentityError,agentIdentityLoading:e.agentIdentityLoading,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configDirty,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave,onModelChange:e.onModelChange,onModelFallbacksChange:e.onModelFallbacksChange}):m}
                ${e.activePanel==="files"?Dm({agentId:i.id,agentFilesList:e.agentFilesList,agentFilesLoading:e.agentFilesLoading,agentFilesError:e.agentFilesError,agentFileActive:e.agentFileActive,agentFileContents:e.agentFileContents,agentFileDrafts:e.agentFileDrafts,agentFileSaving:e.agentFileSaving,onLoadFiles:e.onLoadFiles,onSelectFile:e.onSelectFile,onFileDraftChange:e.onFileDraftChange,onFileReset:e.onFileReset,onFileSave:e.onFileSave}):m}
                ${e.activePanel==="tools"?Fm({agentId:i.id,configForm:e.configForm,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configDirty,toolsCatalogLoading:e.toolsCatalogLoading,toolsCatalogError:e.toolsCatalogError,toolsCatalogResult:e.toolsCatalogResult,onProfileChange:e.onToolsProfileChange,onOverridesChange:e.onToolsOverridesChange,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):m}
                ${e.activePanel==="skills"?Nm({agentId:i.id,report:e.agentSkillsReport,loading:e.agentSkillsLoading,error:e.agentSkillsError,activeAgentId:e.agentSkillsAgentId,configForm:e.configForm,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configDirty,filter:e.skillsFilter,onFilterChange:e.onSkillsFilterChange,onRefresh:e.onSkillsRefresh,onToggle:e.onAgentSkillToggle,onClear:e.onAgentSkillsClear,onDisableAll:e.onAgentSkillsDisableAll,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):m}
                ${e.activePanel==="channels"?Lm({context:gr(i,e.configForm,e.agentFilesList,n,e.agentIdentityById[i.id]??null),configForm:e.configForm,snapshot:e.channelsSnapshot,loading:e.channelsLoading,error:e.channelsError,lastSuccess:e.channelsLastSuccess,onRefresh:e.onChannelsRefresh}):m}
                ${e.activePanel==="cron"?Mm({context:gr(i,e.configForm,e.agentFilesList,n,e.agentIdentityById[i.id]??null),agentId:i.id,jobs:e.cronJobs,status:e.cronStatus,loading:e.cronLoading,error:e.cronError,onRefresh:e.onCronRefresh}):m}
              `:c`
                <div class="card">
                  <div class="card-title">Select an agent</div>
                  <div class="card-sub">Pick an agent to inspect its workspace and tools.</div>
                </div>
              `}
      </section>
    </div>
  `}function Hm(e,t,n){const s=Ic(e.id,t),i=Ji(e),o=e.identity?.theme?.trim()||"Agent workspace and routing.",a=Gs(e,n);return c`
    <section class="card agent-header">
      <div class="agent-header-main">
        <div class="agent-avatar agent-avatar--lg">${a||i.slice(0,1)}</div>
        <div>
          <div class="card-title">${i}</div>
          <div class="card-sub">${o}</div>
        </div>
      </div>
      <div class="agent-header-meta">
        <div class="mono">${e.id}</div>
        ${s?c`<span class="agent-pill">${s}</span>`:m}
      </div>
    </section>
  `}function zm(e,t){return c`
    <div class="agent-tabs">
      ${[{id:"overview",label:"Overview"},{id:"files",label:"Files"},{id:"tools",label:"Tools"},{id:"skills",label:"Skills"},{id:"channels",label:"Channels"},{id:"cron",label:"Cron Jobs"}].map(s=>c`
          <button
            class="agent-tab ${e===s.id?"active":""}"
            type="button"
            @click=${()=>t(s.id)}
          >
            ${s.label}
          </button>
        `)}
    </div>
  `}function Km(e){const{agent:t,configForm:n,agentFilesList:s,agentIdentity:i,agentIdentityLoading:o,agentIdentityError:a,configLoading:r,configSaving:l,configDirty:d,onConfigReload:u,onConfigSave:g,onModelChange:f,onModelFallbacksChange:h}=e,v=Vs(n,t.id),A=(s&&s.agentId===t.id?s.workspace:null)||v.entry?.workspace||v.defaults?.workspace||"default",k=v.entry?.model?Mn(v.entry?.model):Mn(v.defaults?.model),T=Mn(v.defaults?.model),S=fr(v.entry?.model)||(k!=="-"?pr(k):null),R=fr(v.defaults?.model)||(T!=="-"?pr(T):null),I=S??R??null,C=bm(v.entry?.model),p=C?C.join(", "):"",_=i?.name?.trim()||t.identity?.name?.trim()||t.name?.trim()||v.entry?.name||"-",O=Gs(t,i)||"-",L=Array.isArray(v.entry?.skills)?v.entry?.skills:null,q=L?.length??null,G=o?"Loading…":a?"Unavailable":"",Q=!!(e.defaultId&&t.id===e.defaultId);return c`
    <section class="card">
      <div class="card-title">Overview</div>
      <div class="card-sub">Workspace paths and identity metadata.</div>
      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Workspace</div>
          <div class="mono">${A}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Primary Model</div>
          <div class="mono">${k}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Name</div>
          <div>${_}</div>
          ${G?c`<div class="agent-kv-sub muted">${G}</div>`:m}
        </div>
        <div class="agent-kv">
          <div class="label">Default</div>
          <div>${Q?"yes":"no"}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Emoji</div>
          <div>${O}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Skills Filter</div>
          <div>${L?`${q} selected`:"all skills"}</div>
        </div>
      </div>

      <div class="agent-model-select" style="margin-top: 20px;">
        <div class="label">Model Selection</div>
        <div class="row" style="gap: 12px; flex-wrap: wrap;">
          <label class="field" style="min-width: 260px; flex: 1;">
            <span>Primary model${Q?" (default)":""}</span>
            <select
              .value=${I??""}
              ?disabled=${!n||r||l}
              @change=${E=>f(t.id,E.target.value||null)}
            >
              ${Q?m:c`
                      <option value="">
                        ${R?`Inherit default (${R})`:"Inherit default"}
                      </option>
                    `}
              ${$m(n,I??void 0)}
            </select>
          </label>
          <label class="field" style="min-width: 260px; flex: 1;">
            <span>Fallbacks (comma-separated)</span>
            <input
              .value=${p}
              ?disabled=${!n||r||l}
              placeholder="provider/model, provider/model"
              @input=${E=>h(t.id,ym(E.target.value))}
            />
          </label>
        </div>
        <div class="row" style="justify-content: flex-end; gap: 8px;">
          <button class="btn btn--sm" ?disabled=${r} @click=${u}>
            Reload Config
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${l||!d}
            @click=${g}
          >
            ${l?"Saving…":"Save"}
          </button>
        </div>
      </div>
    </section>
  `}const jm=new Set(["title","description","default","nullable","tags","x-tags"]);function Wm(e){return Object.keys(e??{}).filter(n=>!jm.has(n)).length===0}function qm(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const qn={chevronDown:c`
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
  `,plus:c`
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
  `,minus:c`
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
  `,trash:c`
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
  `,edit:c`
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
  `};function hn(e){return!!(e&&(e.text.length>0||e.tags.length>0))}function Nc(e){const t=[],n=new Set;return{text:e.trim().replace(/(^|\s)tag:([^\s]+)/gi,(o,a,r)=>{const l=r.trim().toLowerCase();return l&&!n.has(l)&&(n.add(l),t.push(l)),a}).trim().toLowerCase(),tags:t}}function mr(e){if(!Array.isArray(e))return[];const t=new Set,n=[];for(const s of e){if(typeof s!="string")continue;const i=s.trim();if(!i)continue;const o=i.toLowerCase();t.has(o)||(t.add(o),n.push(i))}return n}function Qt(e,t,n){const s=vt(e,n),i=s?.label??t.title??Ns(String(e.at(-1))),o=s?.help??t.description,a=mr(t["x-tags"]??t.tags),r=mr(s?.tags);return{label:i,help:o,tags:r.length>0?r:a}}function Gm(e,t){if(!e)return!0;for(const n of t)if(n&&n.toLowerCase().includes(e))return!0;return!1}function Vm(e,t){if(e.length===0)return!0;const n=new Set(t.map(s=>s.toLowerCase()));return e.every(s=>n.has(s))}function Wo(e){const{schema:t,path:n,hints:s,criteria:i}=e;if(!hn(i))return!0;const{label:o,help:a,tags:r}=Qt(n,t,s);if(!Vm(i.tags,r))return!1;if(!i.text)return!0;const l=n.filter(u=>typeof u=="string").join("."),d=t.enum&&t.enum.length>0?t.enum.map(u=>String(u)).join(" "):"";return Gm(i.text,[o,a,t.title,t.description,l,d])}function dn(e){const{schema:t,value:n,path:s,hints:i,criteria:o}=e;if(!hn(o)||Wo({schema:t,path:s,hints:i,criteria:o}))return!0;const a=Re(t);if(a==="object"){const r=n??t.default,l=r&&typeof r=="object"&&!Array.isArray(r)?r:{},d=t.properties??{};for(const[g,f]of Object.entries(d))if(dn({schema:f,value:l[g],path:[...s,g],hints:i,criteria:o}))return!0;const u=t.additionalProperties;if(u&&typeof u=="object"){const g=new Set(Object.keys(d));for(const[f,h]of Object.entries(l))if(!g.has(f)&&dn({schema:u,value:h,path:[...s,f],hints:i,criteria:o}))return!0}return!1}if(a==="array"){const r=Array.isArray(t.items)?t.items[0]:t.items;if(!r)return!1;const l=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];if(l.length===0)return!1;for(let d=0;d<l.length;d+=1)if(dn({schema:r,value:l[d],path:[...s,d],hints:i,criteria:o}))return!0}return!1}function xt(e){return e.length===0?m:c`
    <div class="cfg-tags">
      ${e.map(t=>c`<span class="cfg-tag">${t}</span>`)}
    </div>
  `}function At(e){const{schema:t,value:n,path:s,hints:i,unsupported:o,disabled:a,onPatch:r}=e,l=e.showLabel??!0,d=Re(t),{label:u,help:g,tags:f}=Qt(s,t,i),h=mo(s),v=e.searchCriteria;if(o.has(h))return c`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${u}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(v&&hn(v)&&!dn({schema:t,value:n,path:s,hints:i,criteria:v}))return m;if(t.anyOf||t.oneOf){const A=(t.anyOf??t.oneOf??[]).filter(C=>!(C.type==="null"||Array.isArray(C.type)&&C.type.includes("null")));if(A.length===1)return At({...e,schema:A[0]});const k=C=>{if(C.const!==void 0)return C.const;if(C.enum&&C.enum.length===1)return C.enum[0]},T=A.map(k),S=T.every(C=>C!==void 0);if(S&&T.length>0&&T.length<=5){const C=n??t.default;return c`
        <div class="cfg-field">
          ${l?c`<label class="cfg-field__label">${u}</label>`:m}
          ${g?c`<div class="cfg-field__help">${g}</div>`:m}
          ${xt(f)}
          <div class="cfg-segmented">
            ${T.map(p=>c`
              <button
                type="button"
                class="cfg-segmented__btn ${p===C||String(p)===String(C)?"active":""}"
                ?disabled=${a}
                @click=${()=>r(s,p)}
              >
                ${String(p)}
              </button>
            `)}
          </div>
        </div>
      `}if(S&&T.length>5)return br({...e,options:T,value:n??t.default});const R=new Set(A.map(C=>Re(C)).filter(Boolean)),I=new Set([...R].map(C=>C==="integer"?"number":C));if([...I].every(C=>["string","number","boolean"].includes(C))){const C=I.has("string"),p=I.has("number");if(I.has("boolean")&&I.size===1)return At({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(C||p)return vr({...e,inputType:p&&!C?"number":"text"})}}if(t.enum){const b=t.enum;if(b.length<=5){const A=n??t.default;return c`
        <div class="cfg-field">
          ${l?c`<label class="cfg-field__label">${u}</label>`:m}
          ${g?c`<div class="cfg-field__help">${g}</div>`:m}
          ${xt(f)}
          <div class="cfg-segmented">
            ${b.map(k=>c`
              <button
                type="button"
                class="cfg-segmented__btn ${k===A||String(k)===String(A)?"active":""}"
                ?disabled=${a}
                @click=${()=>r(s,k)}
              >
                ${String(k)}
              </button>
            `)}
          </div>
        </div>
      `}return br({...e,options:b,value:n??t.default})}if(d==="object")return Qm(e);if(d==="array")return Ym(e);if(d==="boolean"){const b=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return c`
      <label class="cfg-toggle-row ${a?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${u}</span>
          ${g?c`<span class="cfg-toggle-row__help">${g}</span>`:m}
          ${xt(f)}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${b}
            ?disabled=${a}
            @change=${A=>r(s,A.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return d==="number"||d==="integer"?Jm(e):d==="string"?vr({...e,inputType:"text"}):c`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${u}</div>
      <div class="cfg-field__error">Unsupported type: ${d}. Use Raw mode.</div>
    </div>
  `}function vr(e){const{schema:t,value:n,path:s,hints:i,disabled:o,onPatch:a,inputType:r}=e,l=e.showLabel??!0,d=vt(s,i),{label:u,help:g,tags:f}=Qt(s,t,i),h=(d?.sensitive??!1)&&!/^\$\{[^}]*\}$/.test(String(n??"").trim()),v=d?.placeholder??(h?"••••":t.default!==void 0?`Default: ${String(t.default)}`:""),b=n??"";return c`
    <div class="cfg-field">
      ${l?c`<label class="cfg-field__label">${u}</label>`:m}
      ${g?c`<div class="cfg-field__help">${g}</div>`:m}
      ${xt(f)}
      <div class="cfg-input-wrap">
        <input
          type=${h?"password":r}
          class="cfg-input"
          placeholder=${v}
          .value=${b==null?"":String(b)}
          ?disabled=${o}
          @input=${A=>{const k=A.target.value;if(r==="number"){if(k.trim()===""){a(s,void 0);return}const T=Number(k);a(s,Number.isNaN(T)?k:T);return}a(s,k)}}
          @change=${A=>{if(r==="number")return;const k=A.target.value;a(s,k.trim())}}
        />
        ${t.default!==void 0?c`
          <button
            type="button"
            class="cfg-input__reset"
            title="Reset to default"
            ?disabled=${o}
            @click=${()=>a(s,t.default)}
          >↺</button>
        `:m}
      </div>
    </div>
  `}function Jm(e){const{schema:t,value:n,path:s,hints:i,disabled:o,onPatch:a}=e,r=e.showLabel??!0,{label:l,help:d,tags:u}=Qt(s,t,i),g=n??t.default??"",f=typeof g=="number"?g:0;return c`
    <div class="cfg-field">
      ${r?c`<label class="cfg-field__label">${l}</label>`:m}
      ${d?c`<div class="cfg-field__help">${d}</div>`:m}
      ${xt(u)}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${o}
          @click=${()=>a(s,f-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${g==null?"":String(g)}
          ?disabled=${o}
          @input=${h=>{const v=h.target.value,b=v===""?void 0:Number(v);a(s,b)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${o}
          @click=${()=>a(s,f+1)}
        >+</button>
      </div>
    </div>
  `}function br(e){const{schema:t,value:n,path:s,hints:i,disabled:o,options:a,onPatch:r}=e,l=e.showLabel??!0,{label:d,help:u,tags:g}=Qt(s,t,i),f=n??t.default,h=a.findIndex(b=>b===f||String(b)===String(f)),v="__unset__";return c`
    <div class="cfg-field">
      ${l?c`<label class="cfg-field__label">${d}</label>`:m}
      ${u?c`<div class="cfg-field__help">${u}</div>`:m}
      ${xt(g)}
      <select
        class="cfg-select"
        ?disabled=${o}
        .value=${h>=0?String(h):v}
        @change=${b=>{const A=b.target.value;r(s,A===v?void 0:a[Number(A)])}}
      >
        <option value=${v}>Select...</option>
        ${a.map((b,A)=>c`
          <option value=${String(A)}>${String(b)}</option>
        `)}
      </select>
    </div>
  `}function Qm(e){const{schema:t,value:n,path:s,hints:i,unsupported:o,disabled:a,onPatch:r,searchCriteria:l}=e,d=e.showLabel??!0,{label:u,help:g,tags:f}=Qt(s,t,i),v=(l&&hn(l)?Wo({schema:t,path:s,hints:i,criteria:l}):!1)?void 0:l,b=n??t.default,A=b&&typeof b=="object"&&!Array.isArray(b)?b:{},k=t.properties??{},S=Object.entries(k).toSorted((_,P)=>{const O=vt([...s,_[0]],i)?.order??0,L=vt([...s,P[0]],i)?.order??0;return O!==L?O-L:_[0].localeCompare(P[0])}),R=new Set(Object.keys(k)),I=t.additionalProperties,C=!!I&&typeof I=="object",p=c`
    ${S.map(([_,P])=>At({schema:P,value:A[_],path:[...s,_],hints:i,unsupported:o,disabled:a,searchCriteria:v,onPatch:r}))}
    ${C?Xm({schema:I,value:A,path:s,hints:i,unsupported:o,disabled:a,reservedKeys:R,searchCriteria:v,onPatch:r}):m}
  `;return s.length===1?c`
      <div class="cfg-fields">
        ${p}
      </div>
    `:d?c`
    <details class="cfg-object" ?open=${s.length<=2}>
      <summary class="cfg-object__header">
        <span class="cfg-object__title-wrap">
          <span class="cfg-object__title">${u}</span>
          ${xt(f)}
        </span>
        <span class="cfg-object__chevron">${qn.chevronDown}</span>
      </summary>
      ${g?c`<div class="cfg-object__help">${g}</div>`:m}
      <div class="cfg-object__content">
        ${p}
      </div>
    </details>
  `:c`
      <div class="cfg-fields cfg-fields--inline">
        ${p}
      </div>
    `}function Ym(e){const{schema:t,value:n,path:s,hints:i,unsupported:o,disabled:a,onPatch:r,searchCriteria:l}=e,d=e.showLabel??!0,{label:u,help:g,tags:f}=Qt(s,t,i),v=(l&&hn(l)?Wo({schema:t,path:s,hints:i,criteria:l}):!1)?void 0:l,b=Array.isArray(t.items)?t.items[0]:t.items;if(!b)return c`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${u}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const A=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return c`
    <div class="cfg-array">
      <div class="cfg-array__header">
        <div class="cfg-array__title">
          ${d?c`<span class="cfg-array__label">${u}</span>`:m}
          ${xt(f)}
        </div>
        <span class="cfg-array__count">${A.length} item${A.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${a}
          @click=${()=>{const k=[...A,fl(b)];r(s,k)}}
        >
          <span class="cfg-array__add-icon">${qn.plus}</span>
          Add
        </button>
      </div>
      ${g?c`<div class="cfg-array__help">${g}</div>`:m}

      ${A.length===0?c`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:c`
        <div class="cfg-array__items">
          ${A.map((k,T)=>c`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${T+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${a}
                  @click=${()=>{const S=[...A];S.splice(T,1),r(s,S)}}
                >
                  ${qn.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${At({schema:b,value:k,path:[...s,T],hints:i,unsupported:o,disabled:a,searchCriteria:v,showLabel:!1,onPatch:r})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function Xm(e){const{schema:t,value:n,path:s,hints:i,unsupported:o,disabled:a,reservedKeys:r,onPatch:l,searchCriteria:d}=e,u=Wm(t),g=Object.entries(n??{}).filter(([h])=>!r.has(h)),f=d&&hn(d)?g.filter(([h,v])=>dn({schema:t,value:v,path:[...s,h],hints:i,criteria:d})):g;return c`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${a}
          @click=${()=>{const h={...n};let v=1,b=`custom-${v}`;for(;b in h;)v+=1,b=`custom-${v}`;h[b]=u?{}:fl(t),l(s,h)}}
        >
          <span class="cfg-map__add-icon">${qn.plus}</span>
          Add Entry
        </button>
      </div>

      ${f.length===0?c`
              <div class="cfg-map__empty">No custom entries.</div>
            `:c`
        <div class="cfg-map__items">
          ${f.map(([h,v])=>{const b=[...s,h],A=qm(v);return c`
              <div class="cfg-map__item">
                <div class="cfg-map__item-header">
                  <div class="cfg-map__item-key">
                    <input
                      type="text"
                      class="cfg-input cfg-input--sm"
                      placeholder="Key"
                      .value=${h}
                      ?disabled=${a}
                      @change=${k=>{const T=k.target.value.trim();if(!T||T===h)return;const S={...n};T in S||(S[T]=S[h],delete S[h],l(s,S))}}
                    />
                  </div>
                  <button
                    type="button"
                    class="cfg-map__item-remove"
                    title="Remove entry"
                    ?disabled=${a}
                    @click=${()=>{const k={...n};delete k[h],l(s,k)}}
                  >
                    ${qn.trash}
                  </button>
                </div>
                <div class="cfg-map__item-value">
                  ${u?c`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${A}
                          ?disabled=${a}
                          @change=${k=>{const T=k.target,S=T.value.trim();if(!S){l(b,void 0);return}try{l(b,JSON.parse(S))}catch{T.value=A}}}
                        ></textarea>
                      `:At({schema:t,value:v,path:b,hints:i,unsupported:o,disabled:a,searchCriteria:d,showLabel:!1,onPatch:l})}
                </div>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const yr={env:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:c`
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
  `,meta:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:c`
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
  `,default:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},qo={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"}};function xr(e){return yr[e]??yr.default}function Zm(e){if(!e.query)return!0;const t=Nc(e.query),n=t.text,s=qo[e.key];return n&&e.key.toLowerCase().includes(n)||n&&s&&(s.label.toLowerCase().includes(n)||s.description.toLowerCase().includes(n))?!0:dn({schema:e.schema,value:e.sectionValue,path:[e.key],hints:e.uiHints,criteria:t})}function ev(e){if(!e.schema)return c`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,n=e.value??{};if(Re(t)!=="object"||!t.properties)return c`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),i=t.properties,o=e.searchQuery??"",a=Nc(o),r=e.activeSection,l=e.activeSubsection??null,u=Object.entries(i).toSorted((f,h)=>{const v=vt([f[0]],e.uiHints)?.order??50,b=vt([h[0]],e.uiHints)?.order??50;return v!==b?v-b:f[0].localeCompare(h[0])}).filter(([f,h])=>!(r&&f!==r||o&&!Zm({key:f,schema:h,sectionValue:n[f],uiHints:e.uiHints,query:o})));let g=null;if(r&&l&&u.length===1){const f=u[0]?.[1];f&&Re(f)==="object"&&f.properties&&f.properties[l]&&(g={sectionKey:r,subsectionKey:l,schema:f.properties[l]})}return u.length===0?c`
      <div class="config-empty">
        <div class="config-empty__icon">${ce.search}</div>
        <div class="config-empty__text">
          ${o?`No settings match "${o}"`:"No settings in this section"}
        </div>
      </div>
    `:c`
    <div class="config-form config-form--modern">
      ${g?(()=>{const{sectionKey:f,subsectionKey:h,schema:v}=g,b=vt([f,h],e.uiHints),A=b?.label??v.title??Ns(h),k=b?.help??v.description??"",T=n[f],S=T&&typeof T=="object"?T[h]:void 0,R=`config-section-${f}-${h}`;return c`
              <section class="config-section-card" id=${R}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${xr(f)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${A}</h3>
                    ${k?c`<p class="config-section-card__desc">${k}</p>`:m}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${At({schema:v,value:S,path:[f,h],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,searchCriteria:a,onPatch:e.onPatch})}
                </div>
              </section>
            `})():u.map(([f,h])=>{const v=qo[f]??{label:f.charAt(0).toUpperCase()+f.slice(1),description:h.description??""};return c`
              <section class="config-section-card" id="config-section-${f}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${xr(f)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${v.label}</h3>
                    ${v.description?c`<p class="config-section-card__desc">${v.description}</p>`:m}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${At({schema:h,value:n[f],path:[f],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,searchCriteria:a,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const tv=new Set(["title","description","default","nullable"]);function nv(e){return Object.keys(e??{}).filter(n=>!tv.has(n)).length===0}function Oc(e){const t=e.filter(i=>i!=null),n=t.length!==e.length,s=[];for(const i of t)s.some(o=>Object.is(o,i))||s.push(i);return{enumValues:s,nullable:n}}function Uc(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:Pn(e,[])}function Pn(e,t){const n=new Set,s={...e},i=mo(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const r=sv(e,t);return r||{schema:e,unsupportedPaths:[i]}}const o=Array.isArray(e.type)&&e.type.includes("null"),a=Re(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=a??e.type,s.nullable=o||e.nullable,s.enum){const{enumValues:r,nullable:l}=Oc(s.enum);s.enum=r,l&&(s.nullable=!0),r.length===0&&n.add(i)}if(a==="object"){const r=e.properties??{},l={};for(const[d,u]of Object.entries(r)){const g=Pn(u,[...t,d]);g.schema&&(l[d]=g.schema);for(const f of g.unsupportedPaths)n.add(f)}if(s.properties=l,e.additionalProperties===!0)n.add(i);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!nv(e.additionalProperties)){const d=Pn(e.additionalProperties,[...t,"*"]);s.additionalProperties=d.schema??e.additionalProperties,d.unsupportedPaths.length>0&&n.add(i)}}else if(a==="array"){const r=Array.isArray(e.items)?e.items[0]:e.items;if(!r)n.add(i);else{const l=Pn(r,[...t,"*"]);s.items=l.schema??r,l.unsupportedPaths.length>0&&n.add(i)}}else a!=="string"&&a!=="number"&&a!=="integer"&&a!=="boolean"&&!s.enum&&n.add(i);return{schema:s,unsupportedPaths:Array.from(n)}}function sv(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],i=[];let o=!1;for(const r of n){if(!r||typeof r!="object")return null;if(Array.isArray(r.enum)){const{enumValues:l,nullable:d}=Oc(r.enum);s.push(...l),d&&(o=!0);continue}if("const"in r){if(r.const==null){o=!0;continue}s.push(r.const);continue}if(Re(r)==="null"){o=!0;continue}i.push(r)}if(s.length>0&&i.length===0){const r=[];for(const l of s)r.some(d=>Object.is(d,l))||r.push(l);return{schema:{...e,enum:r,nullable:o,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(i.length===1){const r=Pn(i[0],t);return r.schema&&(r.schema.nullable=o||r.schema.nullable),r}const a=new Set(["string","number","integer","boolean"]);return i.length>0&&s.length===0&&i.every(r=>r.type&&a.has(String(r.type)))?{schema:{...e,nullable:o},unsupportedPaths:[]}:null}function iv(e,t){let n=e;for(const s of t){if(!n)return null;const i=Re(n);if(i==="object"){const o=n.properties??{};if(typeof s=="string"&&o[s]){n=o[s];continue}const a=n.additionalProperties;if(typeof s=="string"&&a&&typeof a=="object"){n=a;continue}return null}if(i==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function ov(e,t){const s=(e.channels??{})[t],i=e[t];return(s&&typeof s=="object"?s:null)??(i&&typeof i=="object"?i:null)??{}}const av=["groupPolicy","streamMode","dmPolicy"];function rv(e){if(e==null)return"n/a";if(typeof e=="string"||typeof e=="number"||typeof e=="boolean")return String(e);try{return JSON.stringify(e)}catch{return"n/a"}}function lv(e){const t=av.flatMap(n=>n in e?[[n,e[n]]]:[]);return t.length===0?null:c`
    <div class="status-list" style="margin-top: 12px;">
      ${t.map(([n,s])=>c`
          <div>
            <span class="label">${n}</span>
            <span>${rv(s)}</span>
          </div>
        `)}
    </div>
  `}function cv(e){const t=Uc(e.schema),n=t.schema;if(!n)return c`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=iv(n,["channels",e.channelId]);if(!s)return c`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const i=e.configValue??{},o=ov(i,e.channelId);return c`
    <div class="config-form">
      ${At({schema:s,value:o,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
    ${lv(o)}
  `}function ot(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return c`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?c`
              <div class="muted">Loading config schema…</div>
            `:cv({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
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
  `}function dv(e){const{props:t,discord:n,accountCountLabel:s}=e;return c`
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
          <span>${n?.lastStartAt?se(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?se(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?c`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${n?.probe?c`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:m}

      ${ot({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function uv(e){const{props:t,googleChat:n,accountCountLabel:s}=e;return c`
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
          <span>${n?.lastStartAt?se(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?se(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?c`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${n?.probe?c`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:m}

      ${ot({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function gv(e){const{props:t,imessage:n,accountCountLabel:s}=e;return c`
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
          <span>${n?.lastStartAt?se(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?se(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?c`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${n?.probe?c`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:m}

      ${ot({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function $r(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function pv(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:i,profileFormState:o,profileFormCallbacks:a,onEditProfile:r}=e,l=s[0],d=n?.configured??l?.configured??!1,u=n?.running??l?.running??!1,g=n?.publicKey??l?.publicKey,f=n?.lastStartAt??l?.lastStartAt??null,h=n?.lastError??l?.lastError??null,v=s.length>1,b=o!=null,A=T=>{const S=T.publicKey,R=T.profile,I=R?.displayName??R?.name??T.name??T.accountId;return c`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${I}</div>
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
            <span class="monospace" title="${S??""}">${$r(S)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${T.lastInboundAt?se(T.lastInboundAt):"n/a"}</span>
          </div>
          ${T.lastError?c`
                <div class="account-card-error">${T.lastError}</div>
              `:m}
        </div>
      </div>
    `},k=()=>{if(b&&a)return du({state:o,callbacks:a,accountId:s[0]?.accountId??"default"});const T=l?.profile??n?.profile,{name:S,displayName:R,about:I,picture:C,nip05:p}=T??{},_=S||R||I||C||p;return c`
      <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 500;">Profile</div>
          ${d?c`
                <button
                  class="btn btn-sm"
                  @click=${r}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:m}
        </div>
        ${_?c`
              <div class="status-list">
                ${C?c`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${C}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${P=>{P.target.style.display="none"}}
                        />
                      </div>
                    `:m}
                ${S?c`<div><span class="label">Name</span><span>${S}</span></div>`:m}
                ${R?c`<div><span class="label">Display Name</span><span>${R}</span></div>`:m}
                ${I?c`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${I}</span></div>`:m}
                ${p?c`<div><span class="label">NIP-05</span><span>${p}</span></div>`:m}
              </div>
            `:c`
                <div style="color: var(--text-muted); font-size: 13px">
                  No profile set. Click "Edit Profile" to add your name, bio, and avatar.
                </div>
              `}
      </div>
    `};return c`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${i}

      ${v?c`
            <div class="account-card-list">
              ${s.map(T=>A(T))}
            </div>
          `:c`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${d?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${u?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Public Key</span>
                <span class="monospace" title="${g??""}"
                  >${$r(g)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${f?se(f):"n/a"}</span>
              </div>
            </div>
          `}

      ${h?c`<div class="callout danger" style="margin-top: 12px;">${h}</div>`:m}

      ${k()}

      ${ot({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function fv(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const i=s[e],o=typeof i?.configured=="boolean"&&i.configured,a=typeof i?.running=="boolean"&&i.running,r=typeof i?.connected=="boolean"&&i.connected,d=(n.channelAccounts?.[e]??[]).some(u=>u.configured||u.running||u.connected);return o||a||r||d}function hv(e,t){return t?.[e]?.length??0}function Bc(e,t){const n=hv(e,t);return n<2?m:c`<div class="account-count">Accounts (${n})</div>`}function mv(e){const{props:t,signal:n,accountCountLabel:s}=e;return c`
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
          <span>${n?.lastStartAt?se(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?se(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?c`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${n?.probe?c`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:m}

      ${ot({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function vv(e){const{props:t,slack:n,accountCountLabel:s}=e;return c`
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
          <span>${n?.lastStartAt?se(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?se(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?c`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${n?.probe?c`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:m}

      ${ot({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function bv(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:i}=e,o=s.length>1,a=r=>{const d=r.probe?.bot?.username,u=r.name||r.accountId;return c`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${d?`@${d}`:u}
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
            <span>${r.lastInboundAt?se(r.lastInboundAt):"n/a"}</span>
          </div>
          ${r.lastError?c`
                <div class="account-card-error">
                  ${r.lastError}
                </div>
              `:m}
        </div>
      </div>
    `};return c`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${i}

      ${o?c`
            <div class="account-card-list">
              ${s.map(r=>a(r))}
            </div>
          `:c`
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
                <span>${n?.lastStartAt?se(n.lastStartAt):"n/a"}</span>
              </div>
              <div>
                <span class="label">Last probe</span>
                <span>${n?.lastProbeAt?se(n.lastProbeAt):"n/a"}</span>
              </div>
            </div>
          `}

      ${n?.lastError?c`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${n?.probe?c`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:m}

      ${ot({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function yv(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return c`
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
            ${n?.lastConnectedAt?se(n.lastConnectedAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last message</span>
          <span>
            ${n?.lastMessageAt?se(n.lastMessageAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Auth age</span>
          <span>
            ${n?.authAgeMs!=null?So(n.authAgeMs):"n/a"}
          </span>
        </div>
      </div>

      ${n?.lastError?c`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${t.whatsappMessage?c`<div class="callout" style="margin-top: 12px;">
            ${t.whatsappMessage}
          </div>`:m}

      ${t.whatsappQrDataUrl?c`<div class="qr-wrap">
            <img src=${t.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:m}

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

      ${ot({channelId:"whatsapp",props:t})}
    </div>
  `}function xv(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,i=t?.discord??null,o=t?.googlechat??null,a=t?.slack??null,r=t?.signal??null,l=t?.imessage??null,d=t?.nostr??null,g=$v(e.snapshot).map((f,h)=>({key:f,enabled:fv(f,e),order:h})).toSorted((f,h)=>f.enabled!==h.enabled?f.enabled?-1:1:f.order-h.order);return c`
    <section class="grid grid-cols-2">
      ${g.map(f=>wv(f.key,e,{whatsapp:n,telegram:s,discord:i,googlechat:o,slack:a,signal:r,imessage:l,nostr:d,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?se(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?c`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:m}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function $v(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function wv(e,t,n){const s=Bc(e,n.channelAccounts);switch(e){case"whatsapp":return yv({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return bv({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return dv({props:t,discord:n.discord,accountCountLabel:s});case"googlechat":return uv({props:t,googleChat:n.googlechat,accountCountLabel:s});case"slack":return vv({props:t,slack:n.slack,accountCountLabel:s});case"signal":return mv({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return gv({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const i=n.channelAccounts?.nostr??[],o=i[0],a=o?.accountId??"default",r=o?.profile??null,l=t.nostrProfileAccountId===a?t.nostrProfileFormState:null,d=l?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return pv({props:t,nostr:n.nostr,nostrAccounts:i,accountCountLabel:s,profileFormState:l,profileFormCallbacks:d,onEditProfile:()=>t.onNostrProfileEdit(a,r)})}default:return kv(e,t,n.channelAccounts??{})}}function kv(e,t,n){const s=Av(t.snapshot,e),i=t.snapshot?.channels?.[e],o=typeof i?.configured=="boolean"?i.configured:void 0,a=typeof i?.running=="boolean"?i.running:void 0,r=typeof i?.connected=="boolean"?i.connected:void 0,l=typeof i?.lastError=="string"?i.lastError:void 0,d=n[e]??[],u=Bc(e,n);return c`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${u}

      ${d.length>0?c`
            <div class="account-card-list">
              ${d.map(g=>Ev(g))}
            </div>
          `:c`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${o==null?"n/a":o?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${a==null?"n/a":a?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Connected</span>
                <span>${r==null?"n/a":r?"Yes":"No"}</span>
              </div>
            </div>
          `}

      ${l?c`<div class="callout danger" style="margin-top: 12px;">
            ${l}
          </div>`:m}

      ${ot({channelId:e,props:t})}
    </div>
  `}function Sv(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function Av(e,t){return Sv(e)[t]?.label??e?.channelLabels?.[t]??t}const Cv=600*1e3;function Hc(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<Cv:!1}function Tv(e){return e.running?"Yes":Hc(e)?"Active":"No"}function _v(e){return e.connected===!0?"Yes":e.connected===!1?"No":Hc(e)?"Active":"n/a"}function Ev(e){const t=Tv(e),n=_v(e);return c`
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
          <span>${e.lastInboundAt?se(e.lastInboundAt):"n/a"}</span>
        </div>
        ${e.lastError?c`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:m}
      </div>
    </div>
  `}const Fn=(e,t)=>{const n=e._$AN;if(n===void 0)return!1;for(const s of n)s._$AO?.(t,!1),Fn(s,t);return!0},Es=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},zc=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),Lv(t)}};function Rv(e){this._$AN!==void 0?(Es(this),this._$AM=e,zc(this)):this._$AM=e}function Iv(e,t=!1,n=0){const s=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(s))for(let o=n;o<s.length;o++)Fn(s[o],!1),Es(s[o]);else s!=null&&(Fn(s,!1),Es(s));else Fn(this,e)}const Lv=e=>{e.type==Ho.CHILD&&(e._$AP??=Iv,e._$AQ??=Rv)};class Mv extends Ko{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,s){super._$AT(t,n,s),zc(this),this.isConnected=t._$AU}_$AO(t,n=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),n&&(Fn(this,t),Es(this))}setValue(t){if(Lh(this._$Ct))this._$Ct._$AI(t,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}const ki=new WeakMap,Dv=zo(class extends Mv{render(e){return m}update(e,[t]){const n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),m}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let n=ki.get(t);n===void 0&&(n=new WeakMap,ki.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?ki.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});class Yi extends Ko{constructor(t){if(super(t),this.it=m,t.type!==Ho.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===m||t==null)return this._t=void 0,this.it=t;if(t===wt)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const n=[t];return n.raw=n,this._t={_$litType$:this.constructor.resultType,strings:n,values:[]}}}Yi.directiveName="unsafeHTML",Yi.resultType=1;const Xi=zo(Yi);const{entries:Kc,setPrototypeOf:wr,isFrozen:Pv,getPrototypeOf:Fv,getOwnPropertyDescriptor:Nv}=Object;let{freeze:Ae,seal:Fe,create:Zi}=Object,{apply:eo,construct:to}=typeof Reflect<"u"&&Reflect;Ae||(Ae=function(t){return t});Fe||(Fe=function(t){return t});eo||(eo=function(t,n){for(var s=arguments.length,i=new Array(s>2?s-2:0),o=2;o<s;o++)i[o-2]=arguments[o];return t.apply(n,i)});to||(to=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return new t(...s)});const us=Ce(Array.prototype.forEach),Ov=Ce(Array.prototype.lastIndexOf),kr=Ce(Array.prototype.pop),wn=Ce(Array.prototype.push),Uv=Ce(Array.prototype.splice),$s=Ce(String.prototype.toLowerCase),Si=Ce(String.prototype.toString),Ai=Ce(String.prototype.match),kn=Ce(String.prototype.replace),Bv=Ce(String.prototype.indexOf),Hv=Ce(String.prototype.trim),Ne=Ce(Object.prototype.hasOwnProperty),ke=Ce(RegExp.prototype.test),Sn=zv(TypeError);function Ce(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return eo(e,t,s)}}function zv(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return to(e,n)}}function Y(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:$s;wr&&wr(e,null);let s=t.length;for(;s--;){let i=t[s];if(typeof i=="string"){const o=n(i);o!==i&&(Pv(t)||(t[s]=o),i=o)}e[i]=!0}return e}function Kv(e){for(let t=0;t<e.length;t++)Ne(e,t)||(e[t]=null);return e}function We(e){const t=Zi(null);for(const[n,s]of Kc(e))Ne(e,n)&&(Array.isArray(s)?t[n]=Kv(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=We(s):t[n]=s);return t}function An(e,t){for(;e!==null;){const s=Nv(e,t);if(s){if(s.get)return Ce(s.get);if(typeof s.value=="function")return Ce(s.value)}e=Fv(e)}function n(){return null}return n}const Sr=Ae(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ci=Ae(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Ti=Ae(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),jv=Ae(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),_i=Ae(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Wv=Ae(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Ar=Ae(["#text"]),Cr=Ae(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Ei=Ae(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Tr=Ae(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),gs=Ae(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),qv=Fe(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Gv=Fe(/<%[\w\W]*|[\w\W]*%>/gm),Vv=Fe(/\$\{[\w\W]*/gm),Jv=Fe(/^data-[\-\w.\u00B7-\uFFFF]+$/),Qv=Fe(/^aria-[\-\w]+$/),jc=Fe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Yv=Fe(/^(?:\w+script|data):/i),Xv=Fe(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Wc=Fe(/^html$/i),Zv=Fe(/^[a-z][.\w]*(-[.\w]+)+$/i);var _r=Object.freeze({__proto__:null,ARIA_ATTR:Qv,ATTR_WHITESPACE:Xv,CUSTOM_ELEMENT:Zv,DATA_ATTR:Jv,DOCTYPE_NAME:Wc,ERB_EXPR:Gv,IS_ALLOWED_URI:jc,IS_SCRIPT_OR_DATA:Yv,MUSTACHE_EXPR:qv,TMPLIT_EXPR:Vv});const Cn={element:1,text:3,progressingInstruction:7,comment:8,document:9},eb=function(){return typeof window>"u"?null:window},tb=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(s=n.getAttribute(i));const o="dompurify"+(s?"#"+s:"");try{return t.createPolicy(o,{createHTML(a){return a},createScriptURL(a){return a}})}catch{return console.warn("TrustedTypes policy "+o+" could not be created."),null}},Er=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function qc(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:eb();const t=K=>qc(K);if(t.version="3.3.1",t.removed=[],!e||!e.document||e.document.nodeType!==Cn.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,i=s.currentScript,{DocumentFragment:o,HTMLTemplateElement:a,Node:r,Element:l,NodeFilter:d,NamedNodeMap:u=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:g,DOMParser:f,trustedTypes:h}=e,v=l.prototype,b=An(v,"cloneNode"),A=An(v,"remove"),k=An(v,"nextSibling"),T=An(v,"childNodes"),S=An(v,"parentNode");if(typeof a=="function"){const K=n.createElement("template");K.content&&K.content.ownerDocument&&(n=K.content.ownerDocument)}let R,I="";const{implementation:C,createNodeIterator:p,createDocumentFragment:_,getElementsByTagName:P}=n,{importNode:O}=s;let L=Er();t.isSupported=typeof Kc=="function"&&typeof S=="function"&&C&&C.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:q,ERB_EXPR:G,TMPLIT_EXPR:Q,DATA_ATTR:E,ARIA_ATTR:j,IS_SCRIPT_OR_DATA:X,ATTR_WHITESPACE:J,CUSTOM_ELEMENT:pe}=_r;let{IS_ALLOWED_URI:D}=_r,N=null;const U=Y({},[...Sr,...Ci,...Ti,..._i,...Ar]);let V=null;const de=Y({},[...Cr,...Ei,...Tr,...gs]);let ne=Object.seal(Zi(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),oe=null,Z=null;const W=Object.seal(Zi(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let ae=!0,le=!0,he=!1,Ie=!0,Ve=!1,at=!0,me=!1,He=!1,Je=!1,Qe=!1,Ye=!1,rt=!1,lt=!0,_t=!1;const Xs="user-content-";let Xt=!0,ct=!1,ze={},Te=null;const bn=Y({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Zt=null;const dt=Y({},["audio","video","img","source","image","track"]);let Zs=null;const aa=Y({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Zn="http://www.w3.org/1998/Math/MathML",es="http://www.w3.org/2000/svg",Xe="http://www.w3.org/1999/xhtml";let en=Xe,ei=!1,ti=null;const bd=Y({},[Zn,es,Xe],Si);let ts=Y({},["mi","mo","mn","ms","mtext"]),ns=Y({},["annotation-xml"]);const yd=Y({},["title","style","font","a","script"]);let yn=null;const xd=["application/xhtml+xml","text/html"],$d="text/html";let ge=null,tn=null;const wd=n.createElement("form"),ra=function(w){return w instanceof RegExp||w instanceof Function},ni=function(){let w=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(tn&&tn===w)){if((!w||typeof w!="object")&&(w={}),w=We(w),yn=xd.indexOf(w.PARSER_MEDIA_TYPE)===-1?$d:w.PARSER_MEDIA_TYPE,ge=yn==="application/xhtml+xml"?Si:$s,N=Ne(w,"ALLOWED_TAGS")?Y({},w.ALLOWED_TAGS,ge):U,V=Ne(w,"ALLOWED_ATTR")?Y({},w.ALLOWED_ATTR,ge):de,ti=Ne(w,"ALLOWED_NAMESPACES")?Y({},w.ALLOWED_NAMESPACES,Si):bd,Zs=Ne(w,"ADD_URI_SAFE_ATTR")?Y(We(aa),w.ADD_URI_SAFE_ATTR,ge):aa,Zt=Ne(w,"ADD_DATA_URI_TAGS")?Y(We(dt),w.ADD_DATA_URI_TAGS,ge):dt,Te=Ne(w,"FORBID_CONTENTS")?Y({},w.FORBID_CONTENTS,ge):bn,oe=Ne(w,"FORBID_TAGS")?Y({},w.FORBID_TAGS,ge):We({}),Z=Ne(w,"FORBID_ATTR")?Y({},w.FORBID_ATTR,ge):We({}),ze=Ne(w,"USE_PROFILES")?w.USE_PROFILES:!1,ae=w.ALLOW_ARIA_ATTR!==!1,le=w.ALLOW_DATA_ATTR!==!1,he=w.ALLOW_UNKNOWN_PROTOCOLS||!1,Ie=w.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Ve=w.SAFE_FOR_TEMPLATES||!1,at=w.SAFE_FOR_XML!==!1,me=w.WHOLE_DOCUMENT||!1,Qe=w.RETURN_DOM||!1,Ye=w.RETURN_DOM_FRAGMENT||!1,rt=w.RETURN_TRUSTED_TYPE||!1,Je=w.FORCE_BODY||!1,lt=w.SANITIZE_DOM!==!1,_t=w.SANITIZE_NAMED_PROPS||!1,Xt=w.KEEP_CONTENT!==!1,ct=w.IN_PLACE||!1,D=w.ALLOWED_URI_REGEXP||jc,en=w.NAMESPACE||Xe,ts=w.MATHML_TEXT_INTEGRATION_POINTS||ts,ns=w.HTML_INTEGRATION_POINTS||ns,ne=w.CUSTOM_ELEMENT_HANDLING||{},w.CUSTOM_ELEMENT_HANDLING&&ra(w.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(ne.tagNameCheck=w.CUSTOM_ELEMENT_HANDLING.tagNameCheck),w.CUSTOM_ELEMENT_HANDLING&&ra(w.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(ne.attributeNameCheck=w.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),w.CUSTOM_ELEMENT_HANDLING&&typeof w.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(ne.allowCustomizedBuiltInElements=w.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Ve&&(le=!1),Ye&&(Qe=!0),ze&&(N=Y({},Ar),V=[],ze.html===!0&&(Y(N,Sr),Y(V,Cr)),ze.svg===!0&&(Y(N,Ci),Y(V,Ei),Y(V,gs)),ze.svgFilters===!0&&(Y(N,Ti),Y(V,Ei),Y(V,gs)),ze.mathMl===!0&&(Y(N,_i),Y(V,Tr),Y(V,gs))),w.ADD_TAGS&&(typeof w.ADD_TAGS=="function"?W.tagCheck=w.ADD_TAGS:(N===U&&(N=We(N)),Y(N,w.ADD_TAGS,ge))),w.ADD_ATTR&&(typeof w.ADD_ATTR=="function"?W.attributeCheck=w.ADD_ATTR:(V===de&&(V=We(V)),Y(V,w.ADD_ATTR,ge))),w.ADD_URI_SAFE_ATTR&&Y(Zs,w.ADD_URI_SAFE_ATTR,ge),w.FORBID_CONTENTS&&(Te===bn&&(Te=We(Te)),Y(Te,w.FORBID_CONTENTS,ge)),w.ADD_FORBID_CONTENTS&&(Te===bn&&(Te=We(Te)),Y(Te,w.ADD_FORBID_CONTENTS,ge)),Xt&&(N["#text"]=!0),me&&Y(N,["html","head","body"]),N.table&&(Y(N,["tbody"]),delete oe.tbody),w.TRUSTED_TYPES_POLICY){if(typeof w.TRUSTED_TYPES_POLICY.createHTML!="function")throw Sn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof w.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw Sn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');R=w.TRUSTED_TYPES_POLICY,I=R.createHTML("")}else R===void 0&&(R=tb(h,i)),R!==null&&typeof I=="string"&&(I=R.createHTML(""));Ae&&Ae(w),tn=w}},la=Y({},[...Ci,...Ti,...jv]),ca=Y({},[..._i,...Wv]),kd=function(w){let M=S(w);(!M||!M.tagName)&&(M={namespaceURI:en,tagName:"template"});const H=$s(w.tagName),re=$s(M.tagName);return ti[w.namespaceURI]?w.namespaceURI===es?M.namespaceURI===Xe?H==="svg":M.namespaceURI===Zn?H==="svg"&&(re==="annotation-xml"||ts[re]):!!la[H]:w.namespaceURI===Zn?M.namespaceURI===Xe?H==="math":M.namespaceURI===es?H==="math"&&ns[re]:!!ca[H]:w.namespaceURI===Xe?M.namespaceURI===es&&!ns[re]||M.namespaceURI===Zn&&!ts[re]?!1:!ca[H]&&(yd[H]||!la[H]):!!(yn==="application/xhtml+xml"&&ti[w.namespaceURI]):!1},Ke=function(w){wn(t.removed,{element:w});try{S(w).removeChild(w)}catch{A(w)}},Et=function(w,M){try{wn(t.removed,{attribute:M.getAttributeNode(w),from:M})}catch{wn(t.removed,{attribute:null,from:M})}if(M.removeAttribute(w),w==="is")if(Qe||Ye)try{Ke(M)}catch{}else try{M.setAttribute(w,"")}catch{}},da=function(w){let M=null,H=null;if(Je)w="<remove></remove>"+w;else{const ue=Ai(w,/^[\r\n\t ]+/);H=ue&&ue[0]}yn==="application/xhtml+xml"&&en===Xe&&(w='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+w+"</body></html>");const re=R?R.createHTML(w):w;if(en===Xe)try{M=new f().parseFromString(re,yn)}catch{}if(!M||!M.documentElement){M=C.createDocument(en,"template",null);try{M.documentElement.innerHTML=ei?I:re}catch{}}const xe=M.body||M.documentElement;return w&&H&&xe.insertBefore(n.createTextNode(H),xe.childNodes[0]||null),en===Xe?P.call(M,me?"html":"body")[0]:me?M.documentElement:xe},ua=function(w){return p.call(w.ownerDocument||w,w,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},si=function(w){return w instanceof g&&(typeof w.nodeName!="string"||typeof w.textContent!="string"||typeof w.removeChild!="function"||!(w.attributes instanceof u)||typeof w.removeAttribute!="function"||typeof w.setAttribute!="function"||typeof w.namespaceURI!="string"||typeof w.insertBefore!="function"||typeof w.hasChildNodes!="function")},ga=function(w){return typeof r=="function"&&w instanceof r};function Ze(K,w,M){us(K,H=>{H.call(t,w,M,tn)})}const pa=function(w){let M=null;if(Ze(L.beforeSanitizeElements,w,null),si(w))return Ke(w),!0;const H=ge(w.nodeName);if(Ze(L.uponSanitizeElement,w,{tagName:H,allowedTags:N}),at&&w.hasChildNodes()&&!ga(w.firstElementChild)&&ke(/<[/\w!]/g,w.innerHTML)&&ke(/<[/\w!]/g,w.textContent)||w.nodeType===Cn.progressingInstruction||at&&w.nodeType===Cn.comment&&ke(/<[/\w]/g,w.data))return Ke(w),!0;if(!(W.tagCheck instanceof Function&&W.tagCheck(H))&&(!N[H]||oe[H])){if(!oe[H]&&ha(H)&&(ne.tagNameCheck instanceof RegExp&&ke(ne.tagNameCheck,H)||ne.tagNameCheck instanceof Function&&ne.tagNameCheck(H)))return!1;if(Xt&&!Te[H]){const re=S(w)||w.parentNode,xe=T(w)||w.childNodes;if(xe&&re){const ue=xe.length;for(let _e=ue-1;_e>=0;--_e){const et=b(xe[_e],!0);et.__removalCount=(w.__removalCount||0)+1,re.insertBefore(et,k(w))}}}return Ke(w),!0}return w instanceof l&&!kd(w)||(H==="noscript"||H==="noembed"||H==="noframes")&&ke(/<\/no(script|embed|frames)/i,w.innerHTML)?(Ke(w),!0):(Ve&&w.nodeType===Cn.text&&(M=w.textContent,us([q,G,Q],re=>{M=kn(M,re," ")}),w.textContent!==M&&(wn(t.removed,{element:w.cloneNode()}),w.textContent=M)),Ze(L.afterSanitizeElements,w,null),!1)},fa=function(w,M,H){if(lt&&(M==="id"||M==="name")&&(H in n||H in wd))return!1;if(!(le&&!Z[M]&&ke(E,M))){if(!(ae&&ke(j,M))){if(!(W.attributeCheck instanceof Function&&W.attributeCheck(M,w))){if(!V[M]||Z[M]){if(!(ha(w)&&(ne.tagNameCheck instanceof RegExp&&ke(ne.tagNameCheck,w)||ne.tagNameCheck instanceof Function&&ne.tagNameCheck(w))&&(ne.attributeNameCheck instanceof RegExp&&ke(ne.attributeNameCheck,M)||ne.attributeNameCheck instanceof Function&&ne.attributeNameCheck(M,w))||M==="is"&&ne.allowCustomizedBuiltInElements&&(ne.tagNameCheck instanceof RegExp&&ke(ne.tagNameCheck,H)||ne.tagNameCheck instanceof Function&&ne.tagNameCheck(H))))return!1}else if(!Zs[M]){if(!ke(D,kn(H,J,""))){if(!((M==="src"||M==="xlink:href"||M==="href")&&w!=="script"&&Bv(H,"data:")===0&&Zt[w])){if(!(he&&!ke(X,kn(H,J,"")))){if(H)return!1}}}}}}}return!0},ha=function(w){return w!=="annotation-xml"&&Ai(w,pe)},ma=function(w){Ze(L.beforeSanitizeAttributes,w,null);const{attributes:M}=w;if(!M||si(w))return;const H={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:V,forceKeepAttr:void 0};let re=M.length;for(;re--;){const xe=M[re],{name:ue,namespaceURI:_e,value:et}=xe,nn=ge(ue),ii=et;let ve=ue==="value"?ii:Hv(ii);if(H.attrName=nn,H.attrValue=ve,H.keepAttr=!0,H.forceKeepAttr=void 0,Ze(L.uponSanitizeAttribute,w,H),ve=H.attrValue,_t&&(nn==="id"||nn==="name")&&(Et(ue,w),ve=Xs+ve),at&&ke(/((--!?|])>)|<\/(style|title|textarea)/i,ve)){Et(ue,w);continue}if(nn==="attributename"&&Ai(ve,"href")){Et(ue,w);continue}if(H.forceKeepAttr)continue;if(!H.keepAttr){Et(ue,w);continue}if(!Ie&&ke(/\/>/i,ve)){Et(ue,w);continue}Ve&&us([q,G,Q],ba=>{ve=kn(ve,ba," ")});const va=ge(w.nodeName);if(!fa(va,nn,ve)){Et(ue,w);continue}if(R&&typeof h=="object"&&typeof h.getAttributeType=="function"&&!_e)switch(h.getAttributeType(va,nn)){case"TrustedHTML":{ve=R.createHTML(ve);break}case"TrustedScriptURL":{ve=R.createScriptURL(ve);break}}if(ve!==ii)try{_e?w.setAttributeNS(_e,ue,ve):w.setAttribute(ue,ve),si(w)?Ke(w):kr(t.removed)}catch{Et(ue,w)}}Ze(L.afterSanitizeAttributes,w,null)},Sd=function K(w){let M=null;const H=ua(w);for(Ze(L.beforeSanitizeShadowDOM,w,null);M=H.nextNode();)Ze(L.uponSanitizeShadowNode,M,null),pa(M),ma(M),M.content instanceof o&&K(M.content);Ze(L.afterSanitizeShadowDOM,w,null)};return t.sanitize=function(K){let w=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},M=null,H=null,re=null,xe=null;if(ei=!K,ei&&(K="<!-->"),typeof K!="string"&&!ga(K))if(typeof K.toString=="function"){if(K=K.toString(),typeof K!="string")throw Sn("dirty is not a string, aborting")}else throw Sn("toString is not a function");if(!t.isSupported)return K;if(He||ni(w),t.removed=[],typeof K=="string"&&(ct=!1),ct){if(K.nodeName){const et=ge(K.nodeName);if(!N[et]||oe[et])throw Sn("root node is forbidden and cannot be sanitized in-place")}}else if(K instanceof r)M=da("<!---->"),H=M.ownerDocument.importNode(K,!0),H.nodeType===Cn.element&&H.nodeName==="BODY"||H.nodeName==="HTML"?M=H:M.appendChild(H);else{if(!Qe&&!Ve&&!me&&K.indexOf("<")===-1)return R&&rt?R.createHTML(K):K;if(M=da(K),!M)return Qe?null:rt?I:""}M&&Je&&Ke(M.firstChild);const ue=ua(ct?K:M);for(;re=ue.nextNode();)pa(re),ma(re),re.content instanceof o&&Sd(re.content);if(ct)return K;if(Qe){if(Ye)for(xe=_.call(M.ownerDocument);M.firstChild;)xe.appendChild(M.firstChild);else xe=M;return(V.shadowroot||V.shadowrootmode)&&(xe=O.call(s,xe,!0)),xe}let _e=me?M.outerHTML:M.innerHTML;return me&&N["!doctype"]&&M.ownerDocument&&M.ownerDocument.doctype&&M.ownerDocument.doctype.name&&ke(Wc,M.ownerDocument.doctype.name)&&(_e="<!DOCTYPE "+M.ownerDocument.doctype.name+`>
`+_e),Ve&&us([q,G,Q],et=>{_e=kn(_e,et," ")}),R&&rt?R.createHTML(_e):_e},t.setConfig=function(){let K=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};ni(K),He=!0},t.clearConfig=function(){tn=null,He=!1},t.isValidAttribute=function(K,w,M){tn||ni({});const H=ge(K),re=ge(w);return fa(H,re,M)},t.addHook=function(K,w){typeof w=="function"&&wn(L[K],w)},t.removeHook=function(K,w){if(w!==void 0){const M=Ov(L[K],w);return M===-1?void 0:Uv(L[K],M,1)[0]}return kr(L[K])},t.removeHooks=function(K){L[K]=[]},t.removeAllHooks=function(){L=Er()},t}var no=qc();function Go(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Yt=Go();function Gc(e){Yt=e}var Bt={exec:()=>null};function ee(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(i,o)=>{let a=typeof o=="string"?o:o.source;return a=a.replace(Se.caret,"$1"),n=n.replace(i,a),s},getRegex:()=>new RegExp(n,t)};return s}var nb=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Se={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},sb=/^(?:[ \t]*(?:\n|$))+/,ib=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ob=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Xn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ab=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Vo=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Vc=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Jc=ee(Vc).replace(/bull/g,Vo).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),rb=ee(Vc).replace(/bull/g,Vo).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Jo=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,lb=/^[^\n]+/,Qo=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,cb=ee(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Qo).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),db=ee(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Vo).getRegex(),Js="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Yo=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ub=ee("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Yo).replace("tag",Js).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Qc=ee(Jo).replace("hr",Xn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Js).getRegex(),gb=ee(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Qc).getRegex(),Xo={blockquote:gb,code:ib,def:cb,fences:ob,heading:ab,hr:Xn,html:ub,lheading:Jc,list:db,newline:sb,paragraph:Qc,table:Bt,text:lb},Rr=ee("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Xn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Js).getRegex(),pb={...Xo,lheading:rb,table:Rr,paragraph:ee(Jo).replace("hr",Xn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Rr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Js).getRegex()},fb={...Xo,html:ee(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Yo).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Bt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ee(Jo).replace("hr",Xn).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Jc).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},hb=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,mb=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Yc=/^( {2,}|\\)\n(?!\s*$)/,vb=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Qs=/[\p{P}\p{S}]/u,Zo=/[\s\p{P}\p{S}]/u,Xc=/[^\s\p{P}\p{S}]/u,bb=ee(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Zo).getRegex(),Zc=/(?!~)[\p{P}\p{S}]/u,yb=/(?!~)[\s\p{P}\p{S}]/u,xb=/(?:[^\s\p{P}\p{S}]|~)/u,ed=/(?![*_])[\p{P}\p{S}]/u,$b=/(?![*_])[\s\p{P}\p{S}]/u,wb=/(?:[^\s\p{P}\p{S}]|[*_])/u,kb=ee(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",nb?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),td=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Sb=ee(td,"u").replace(/punct/g,Qs).getRegex(),Ab=ee(td,"u").replace(/punct/g,Zc).getRegex(),nd="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Cb=ee(nd,"gu").replace(/notPunctSpace/g,Xc).replace(/punctSpace/g,Zo).replace(/punct/g,Qs).getRegex(),Tb=ee(nd,"gu").replace(/notPunctSpace/g,xb).replace(/punctSpace/g,yb).replace(/punct/g,Zc).getRegex(),_b=ee("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Xc).replace(/punctSpace/g,Zo).replace(/punct/g,Qs).getRegex(),Eb=ee(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,ed).getRegex(),Rb="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Ib=ee(Rb,"gu").replace(/notPunctSpace/g,wb).replace(/punctSpace/g,$b).replace(/punct/g,ed).getRegex(),Lb=ee(/\\(punct)/,"gu").replace(/punct/g,Qs).getRegex(),Mb=ee(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Db=ee(Yo).replace("(?:-->|$)","-->").getRegex(),Pb=ee("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Db).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Rs=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Fb=ee(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Rs).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),sd=ee(/^!?\[(label)\]\[(ref)\]/).replace("label",Rs).replace("ref",Qo).getRegex(),id=ee(/^!?\[(ref)\](?:\[\])?/).replace("ref",Qo).getRegex(),Nb=ee("reflink|nolink(?!\\()","g").replace("reflink",sd).replace("nolink",id).getRegex(),Ir=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,ea={_backpedal:Bt,anyPunctuation:Lb,autolink:Mb,blockSkip:kb,br:Yc,code:mb,del:Bt,delLDelim:Bt,delRDelim:Bt,emStrongLDelim:Sb,emStrongRDelimAst:Cb,emStrongRDelimUnd:_b,escape:hb,link:Fb,nolink:id,punctuation:bb,reflink:sd,reflinkSearch:Nb,tag:Pb,text:vb,url:Bt},Ob={...ea,link:ee(/^!?\[(label)\]\((.*?)\)/).replace("label",Rs).getRegex(),reflink:ee(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Rs).getRegex()},so={...ea,emStrongRDelimAst:Tb,emStrongLDelim:Ab,delLDelim:Eb,delRDelim:Ib,url:ee(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Ir).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:ee(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Ir).getRegex()},Ub={...so,br:ee(Yc).replace("{2,}","*").getRegex(),text:ee(so.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},ps={normal:Xo,gfm:pb,pedantic:fb},Tn={normal:ea,gfm:so,breaks:Ub,pedantic:Ob},Bb={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Lr=e=>Bb[e];function qe(e,t){if(t){if(Se.escapeTest.test(e))return e.replace(Se.escapeReplace,Lr)}else if(Se.escapeTestNoEncode.test(e))return e.replace(Se.escapeReplaceNoEncode,Lr);return e}function Mr(e){try{e=encodeURI(e).replace(Se.percentDecode,"%")}catch{return null}return e}function Dr(e,t){let n=e.replace(Se.findPipe,(o,a,r)=>{let l=!1,d=a;for(;--d>=0&&r[d]==="\\";)l=!l;return l?"|":" |"}),s=n.split(Se.splitPipe),i=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;i<s.length;i++)s[i]=s[i].trim().replace(Se.slashPipe,"|");return s}function _n(e,t,n){let s=e.length;if(s===0)return"";let i=0;for(;i<s&&e.charAt(s-i-1)===t;)i++;return e.slice(0,s-i)}function Hb(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function zb(e,t=0){let n=t,s="";for(let i of e)if(i==="	"){let o=4-n%4;s+=" ".repeat(o),n+=o}else s+=i,n++;return s}function Pr(e,t,n,s,i){let o=t.href,a=t.title||null,r=e[1].replace(i.other.outputLinkReplace,"$1");s.state.inLink=!0;let l={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:o,title:a,text:r,tokens:s.inlineTokens(r)};return s.state.inLink=!1,l}function Kb(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let i=s[1];return t.split(`
`).map(o=>{let a=o.match(n.other.beginningSpace);if(a===null)return o;let[r]=a;return r.length>=i.length?o.slice(i.length):o}).join(`
`)}var Is=class{options;rules;lexer;constructor(e){this.options=e||Yt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:_n(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=Kb(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=_n(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:_n(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=_n(t[0],`
`).split(`
`),s="",i="",o=[];for(;n.length>0;){let a=!1,r=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))r.push(n[l]),a=!0;else if(!a)r.push(n[l]);else break;n=n.slice(l);let d=r.join(`
`),u=d.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${d}`:d,i=i?`${i}
${u}`:u;let g=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,o,!0),this.lexer.state.top=g,n.length===0)break;let f=o.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let h=f,v=h.raw+`
`+n.join(`
`),b=this.blockquote(v);o[o.length-1]=b,s=s.substring(0,s.length-h.raw.length)+b.raw,i=i.substring(0,i.length-h.text.length)+b.text;break}else if(f?.type==="list"){let h=f,v=h.raw+`
`+n.join(`
`),b=this.list(v);o[o.length-1]=b,s=s.substring(0,s.length-f.raw.length)+b.raw,i=i.substring(0,i.length-h.raw.length)+b.raw,n=v.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:o,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,i={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let o=this.rules.other.listItemRegex(n),a=!1;for(;e;){let l=!1,d="",u="";if(!(t=o.exec(e))||this.rules.block.hr.test(e))break;d=t[0],e=e.substring(d.length);let g=zb(t[2].split(`
`,1)[0],t[1].length),f=e.split(`
`,1)[0],h=!g.trim(),v=0;if(this.options.pedantic?(v=2,u=g.trimStart()):h?v=t[1].length+1:(v=g.search(this.rules.other.nonSpaceChar),v=v>4?1:v,u=g.slice(v),v+=t[1].length),h&&this.rules.other.blankLine.test(f)&&(d+=f+`
`,e=e.substring(f.length+1),l=!0),!l){let b=this.rules.other.nextBulletRegex(v),A=this.rules.other.hrRegex(v),k=this.rules.other.fencesBeginRegex(v),T=this.rules.other.headingBeginRegex(v),S=this.rules.other.htmlBeginRegex(v),R=this.rules.other.blockquoteBeginRegex(v);for(;e;){let I=e.split(`
`,1)[0],C;if(f=I,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),C=f):C=f.replace(this.rules.other.tabCharGlobal,"    "),k.test(f)||T.test(f)||S.test(f)||R.test(f)||b.test(f)||A.test(f))break;if(C.search(this.rules.other.nonSpaceChar)>=v||!f.trim())u+=`
`+C.slice(v);else{if(h||g.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||k.test(g)||T.test(g)||A.test(g))break;u+=`
`+f}h=!f.trim(),d+=I+`
`,e=e.substring(I.length+1),g=C.slice(v)}}i.loose||(a?i.loose=!0:this.rules.other.doubleBlankLine.test(d)&&(a=!0)),i.items.push({type:"list_item",raw:d,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),i.raw+=d}let r=i.items.at(-1);if(r)r.raw=r.raw.trimEnd(),r.text=r.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let l of i.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}}let d=this.rules.other.listTaskCheckbox.exec(l.raw);if(d){let u={type:"checkbox",raw:d[0]+" ",checked:d[0]!=="[ ]"};l.checked=u.checked,i.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=u.raw+l.tokens[0].raw,l.tokens[0].text=u.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(u)):l.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):l.tokens.unshift(u)}}if(!i.loose){let d=l.tokens.filter(g=>g.type==="space"),u=d.length>0&&d.some(g=>this.rules.other.anyLine.test(g.raw));i.loose=u}}if(i.loose)for(let l of i.items){l.loose=!0;for(let d of l.tokens)d.type==="text"&&(d.type="paragraph")}return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Dr(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?o.align.push("right"):this.rules.other.tableAlignCenter.test(a)?o.align.push("center"):this.rules.other.tableAlignLeft.test(a)?o.align.push("left"):o.align.push(null);for(let a=0;a<n.length;a++)o.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:o.align[a]});for(let a of i)o.rows.push(Dr(a,o.header.length).map((r,l)=>({text:r,tokens:this.lexer.inline(r),header:!1,align:o.align[l]})));return o}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let o=_n(n.slice(0,-1),"\\");if((n.length-o.length)%2===0)return}else{let o=Hb(t[2],"()");if(o===-2)return;if(o>-1){let a=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,a).trim(),t[3]=""}}let s=t[2],i="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(s);o&&(s=o[1],i=o[3])}else i=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Pr(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=t[s.toLowerCase()];if(!i){let o=n[0].charAt(0);return{type:"text",raw:o,text:o}}return Pr(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,o,a,r=i,l=0,d=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(d.lastIndex=0,t=t.slice(-1*e.length+i);(s=d.exec(t))!=null;){if(o=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!o)continue;if(a=[...o].length,s[3]||s[4]){r+=a;continue}else if((s[5]||s[6])&&i%3&&!((i+a)%3)){l+=a;continue}if(r-=a,r>0)continue;a=Math.min(a,a+r+l);let u=[...s[0]][0].length,g=e.slice(0,i+s.index+u+a);if(Math.min(i,a)%2){let h=g.slice(1,-1);return{type:"em",raw:g,text:h,tokens:this.lexer.inlineTokens(h)}}let f=g.slice(2,-2);return{type:"strong",raw:g,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,o,a,r=i,l=this.rules.inline.delRDelim;for(l.lastIndex=0,t=t.slice(-1*e.length+i);(s=l.exec(t))!=null;){if(o=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!o||(a=[...o].length,a!==i))continue;if(s[3]||s[4]){r+=a;continue}if(r-=a,r>0)continue;a=Math.min(a,a+r);let d=[...s[0]][0].length,u=e.slice(0,i+s.index+d+a),g=u.slice(i,-i);return{type:"del",raw:u,text:g,tokens:this.lexer.inlineTokens(g)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},Oe=class io{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Yt,this.options.tokenizer=this.options.tokenizer||new Is,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:Se,block:ps.normal,inline:Tn.normal};this.options.pedantic?(n.block=ps.pedantic,n.inline=Tn.pedantic):this.options.gfm&&(n.block=ps.gfm,this.options.breaks?n.inline=Tn.breaks:n.inline=Tn.gfm),this.tokenizer.rules=n}static get rules(){return{block:ps,inline:Tn}}static lex(t,n){return new io(n).lex(t)}static lexInline(t,n){return new io(n).inlineTokens(t)}lex(t){t=t.replace(Se.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(Se.tabCharGlobal,"    ").replace(Se.spaceLine,""));t;){let i;if(this.options.extensions?.block?.some(a=>(i=a.call({lexer:this},t,n))?(t=t.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(t)){t=t.substring(i.raw.length);let a=n.at(-1);i.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(i);continue}if(i=this.tokenizer.code(t)){t=t.substring(i.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.at(-1).src=a.text):n.push(i);continue}if(i=this.tokenizer.fences(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.heading(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.hr(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.blockquote(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.list(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.html(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.def(t)){t=t.substring(i.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},n.push(i));continue}if(i=this.tokenizer.table(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.lheading(t)){t=t.substring(i.raw.length),n.push(i);continue}let o=t;if(this.options.extensions?.startBlock){let a=1/0,r=t.slice(1),l;this.options.extensions.startBlock.forEach(d=>{l=d.call({lexer:this},r),typeof l=="number"&&l>=0&&(a=Math.min(a,l))}),a<1/0&&a>=0&&(o=t.substring(0,a+1))}if(this.state.top&&(i=this.tokenizer.paragraph(o))){let a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(i),s=o.length!==t.length,t=t.substring(i.raw.length);continue}if(i=this.tokenizer.text(t)){t=t.substring(i.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(i);continue}if(t){let a="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,i=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)l.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,i.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let o;for(;(i=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)o=i[2]?i[2].length:0,s=s.slice(0,i.index+o)+"["+"a".repeat(i[0].length-o-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,r="";for(;t;){a||(r=""),a=!1;let l;if(this.options.extensions?.inline?.some(u=>(l=u.call({lexer:this},t,n))?(t=t.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(l.raw.length);let u=n.at(-1);l.type==="text"&&u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(t,s,r)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(t,s,r)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(t)){t=t.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(t))){t=t.substring(l.raw.length),n.push(l);continue}let d=t;if(this.options.extensions?.startInline){let u=1/0,g=t.slice(1),f;this.options.extensions.startInline.forEach(h=>{f=h.call({lexer:this},g),typeof f=="number"&&f>=0&&(u=Math.min(u,f))}),u<1/0&&u>=0&&(d=t.substring(0,u+1))}if(l=this.tokenizer.inlineText(d)){t=t.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(r=l.raw.slice(-1)),a=!0;let u=n.at(-1);u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):n.push(l);continue}if(t){let u="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return n}},Ls=class{options;parser;constructor(e){this.options=e||Yt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(Se.notSpaceStart)?.[0],i=e.replace(Se.endingNewline,"")+`
`;return s?'<pre><code class="language-'+qe(s)+'">'+(n?i:qe(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:qe(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let a=0;a<e.items.length;a++){let r=e.items[a];s+=this.listitem(r)}let i=t?"ol":"ul",o=t&&n!==1?' start="'+n+'"':"";return"<"+i+o+`>
`+s+"</"+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let i=0;i<e.header.length;i++)n+=this.tablecell(e.header[i]);t+=this.tablerow({text:n});let s="";for(let i=0;i<e.rows.length;i++){let o=e.rows[i];n="";for(let a=0;a<o.length;a++)n+=this.tablecell(o[a]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${qe(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),i=Mr(e);if(i===null)return s;e=i;let o='<a href="'+e+'"';return t&&(o+=' title="'+qe(t)+'"'),o+=">"+s+"</a>",o}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let i=Mr(e);if(i===null)return qe(n);e=i;let o=`<img src="${e}" alt="${qe(n)}"`;return t&&(o+=` title="${qe(t)}"`),o+=">",o}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:qe(e.text)}},ta=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Ue=class oo{options;renderer;textRenderer;constructor(t){this.options=t||Yt,this.options.renderer=this.options.renderer||new Ls,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ta}static parse(t,n){return new oo(n).parse(t)}static parseInline(t,n){return new oo(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let i=t[s];if(this.options.extensions?.renderers?.[i.type]){let a=i,r=this.options.extensions.renderers[a.type].call({parser:this},a);if(r!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=r||"";continue}}let o=i;switch(o.type){case"space":{n+=this.renderer.space(o);break}case"hr":{n+=this.renderer.hr(o);break}case"heading":{n+=this.renderer.heading(o);break}case"code":{n+=this.renderer.code(o);break}case"table":{n+=this.renderer.table(o);break}case"blockquote":{n+=this.renderer.blockquote(o);break}case"list":{n+=this.renderer.list(o);break}case"checkbox":{n+=this.renderer.checkbox(o);break}case"html":{n+=this.renderer.html(o);break}case"def":{n+=this.renderer.def(o);break}case"paragraph":{n+=this.renderer.paragraph(o);break}case"text":{n+=this.renderer.text(o);break}default:{let a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(t,n=this.renderer){let s="";for(let i=0;i<t.length;i++){let o=t[i];if(this.options.extensions?.renderers?.[o.type]){let r=this.options.extensions.renderers[o.type].call({parser:this},o);if(r!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(o.type)){s+=r||"";continue}}let a=o;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"checkbox":{s+=n.checkbox(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{let r='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return s}},Rn=class{options;block;constructor(e){this.options=e||Yt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?Oe.lex:Oe.lexInline}provideParser(){return this.block?Ue.parse:Ue.parseInline}},jb=class{defaults=Go();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Ue;Renderer=Ls;TextRenderer=ta;Lexer=Oe;Tokenizer=Is;Hooks=Rn;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let i=s;for(let o of i.header)n=n.concat(this.walkTokens(o.tokens,t));for(let o of i.rows)for(let a of o)n=n.concat(this.walkTokens(a.tokens,t));break}case"list":{let i=s;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=s;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(o=>{let a=i[o].flat(1/0);n=n.concat(this.walkTokens(a,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let o=t.renderers[i.name];o?t.renderers[i.name]=function(...a){let r=i.renderer.apply(this,a);return r===!1&&(r=o.apply(this,a)),r}:t.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=t[i.level];o?o.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens)}),s.extensions=t),n.renderer){let i=this.defaults.renderer||new Ls(this.defaults);for(let o in n.renderer){if(!(o in i))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let a=o,r=n.renderer[a],l=i[a];i[a]=(...d)=>{let u=r.apply(i,d);return u===!1&&(u=l.apply(i,d)),u||""}}s.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new Is(this.defaults);for(let o in n.tokenizer){if(!(o in i))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let a=o,r=n.tokenizer[a],l=i[a];i[a]=(...d)=>{let u=r.apply(i,d);return u===!1&&(u=l.apply(i,d)),u}}s.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new Rn;for(let o in n.hooks){if(!(o in i))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let a=o,r=n.hooks[a],l=i[a];Rn.passThroughHooks.has(o)?i[a]=d=>{if(this.defaults.async&&Rn.passThroughHooksRespectAsync.has(o))return(async()=>{let g=await r.call(i,d);return l.call(i,g)})();let u=r.call(i,d);return l.call(i,u)}:i[a]=(...d)=>{if(this.defaults.async)return(async()=>{let g=await r.apply(i,d);return g===!1&&(g=await l.apply(i,d)),g})();let u=r.apply(i,d);return u===!1&&(u=l.apply(i,d)),u}}s.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,o=n.walkTokens;s.walkTokens=function(a){let r=[];return r.push(o.call(this,a)),i&&(r=r.concat(i.call(this,a))),r}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Oe.lex(e,t??this.defaults)}parser(e,t){return Ue.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},i={...this.defaults,...s},o=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&s.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let a=i.hooks?await i.hooks.preprocess(t):t,r=await(i.hooks?await i.hooks.provideLexer():e?Oe.lex:Oe.lexInline)(a,i),l=i.hooks?await i.hooks.processAllTokens(r):r;i.walkTokens&&await Promise.all(this.walkTokens(l,i.walkTokens));let d=await(i.hooks?await i.hooks.provideParser():e?Ue.parse:Ue.parseInline)(l,i);return i.hooks?await i.hooks.postprocess(d):d})().catch(o);try{i.hooks&&(t=i.hooks.preprocess(t));let a=(i.hooks?i.hooks.provideLexer():e?Oe.lex:Oe.lexInline)(t,i);i.hooks&&(a=i.hooks.processAllTokens(a)),i.walkTokens&&this.walkTokens(a,i.walkTokens);let r=(i.hooks?i.hooks.provideParser():e?Ue.parse:Ue.parseInline)(a,i);return i.hooks&&(r=i.hooks.postprocess(r)),r}catch(a){return o(a)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+qe(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},Vt=new jb;function te(e,t){return Vt.parse(e,t)}te.options=te.setOptions=function(e){return Vt.setOptions(e),te.defaults=Vt.defaults,Gc(te.defaults),te};te.getDefaults=Go;te.defaults=Yt;te.use=function(...e){return Vt.use(...e),te.defaults=Vt.defaults,Gc(te.defaults),te};te.walkTokens=function(e,t){return Vt.walkTokens(e,t)};te.parseInline=Vt.parseInline;te.Parser=Ue;te.parser=Ue.parse;te.Renderer=Ls;te.TextRenderer=ta;te.Lexer=Oe;te.lexer=Oe.lex;te.Tokenizer=Is;te.Hooks=Rn;te.parse=te;te.options;te.setOptions;te.use;te.walkTokens;te.parseInline;Ue.parse;Oe.lex;te.setOptions({gfm:!0,breaks:!0});const Wb=["a","b","blockquote","br","code","del","em","h1","h2","h3","h4","hr","i","li","ol","p","pre","strong","table","tbody","td","th","thead","tr","ul","img"],qb=["class","href","rel","target","title","start","src","alt"],Fr={ALLOWED_TAGS:Wb,ALLOWED_ATTR:qb,ADD_DATA_URI_TAGS:["img"]};let Nr=!1;const Gb=14e4,Vb=4e4,Jb=200,Ri=5e4,zt=new Map;function Qb(e){const t=zt.get(e);return t===void 0?null:(zt.delete(e),zt.set(e,t),t)}function Or(e,t){if(zt.set(e,t),zt.size<=Jb)return;const n=zt.keys().next().value;n&&zt.delete(n)}function Yb(){Nr||(Nr=!0,no.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function ao(e){const t=e.trim();if(!t)return"";if(Yb(),t.length<=Ri){const a=Qb(t);if(a!==null)return a}const n=Tl(t,Gb),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>Vb){const r=`<pre class="code-block">${ad(`${n.text}${s}`)}</pre>`,l=no.sanitize(r,Fr);return t.length<=Ri&&Or(t,l),l}const i=te.parse(`${n.text}${s}`,{renderer:od}),o=no.sanitize(i,Fr);return t.length<=Ri&&Or(t,o),o}const od=new te.Renderer;od.html=({text:e})=>ad(e);function ad(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Xb=new RegExp("\\p{Script=Hebrew}|\\p{Script=Arabic}|\\p{Script=Syriac}|\\p{Script=Thaana}|\\p{Script=Nko}|\\p{Script=Samaritan}|\\p{Script=Mandaic}|\\p{Script=Adlam}|\\p{Script=Phoenician}|\\p{Script=Lydian}","u");function rd(e,t=/[\s\p{P}\p{S}]/u){if(!e)return"ltr";for(const n of e)if(!t.test(n))return Xb.test(n)?"rtl":"ltr";return"ltr"}const Zb=1500,ey=2e3,ld="Copy as markdown",ty="Copied",ny="Copy failed";async function sy(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function fs(e,t){e.title=t,e.setAttribute("aria-label",t)}function iy(e){const t=e.label??ld;return c`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const i=await sy(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!i){s.dataset.error="1",fs(s,ny),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,fs(s,t))},ey);return}s.dataset.copied="1",fs(s,ty),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,fs(s,t))},Zb)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${ce.copy}</span>
        <span class="chat-copy-btn__icon-check">${ce.check}</span>
      </span>
    </button>
  `}function oy(e){return iy({text:()=>e,label:ld})}function cd(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",i=t.content,o=Array.isArray(i)?i:null,a=Array.isArray(o)&&o.some(g=>{const f=g,h=(typeof f.type=="string"?f.type:"").toLowerCase();return h==="toolresult"||h==="tool_result"}),r=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||a||r)&&(n="toolResult");let l=[];typeof t.content=="string"?l=[{type:"text",text:t.content}]:Array.isArray(t.content)?l=t.content.map(g=>({type:g.type||"text",text:g.text,name:g.name,args:g.args||g.arguments})):typeof t.text=="string"&&(l=[{type:"text",text:t.text}]);const d=typeof t.timestamp=="number"?t.timestamp:Date.now(),u=typeof t.id=="string"?t.id:void 0;return(n==="user"||n==="User")&&(l=l.map(g=>g.type==="text"&&typeof g.text=="string"?{...g,text:ys(g.text)}:g)),{role:n,content:l,timestamp:d,id:u}}function na(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function dd(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}function mn(e){return e&&typeof e=="object"?e:void 0}function ay(e){return(e??"tool").trim()}function ry(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function ly(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function ud(e,t={}){const n=t.maxStringChars??160,s=t.maxArrayEntries??3;if(e!=null){if(typeof e=="string"){const i=e.trim();if(!i)return;const o=i.split(/\r?\n/)[0]?.trim()??"";return o?o.length>n?`${o.slice(0,Math.max(0,n-3))}…`:o:void 0}if(typeof e=="boolean")return!e&&!t.includeFalse?void 0:e?"true":"false";if(typeof e=="number")return Number.isFinite(e)?e===0&&!t.includeZero?void 0:String(e):t.includeNonFinite?String(e):void 0;if(Array.isArray(e)){const i=e.map(a=>ud(a,t)).filter(a=>!!a);if(i.length===0)return;const o=i.slice(0,s).join(", ");return i.length>s?`${o}…`:o}}}function cy(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function gd(e){const t=mn(e);if(t)for(const n of[t.path,t.file_path,t.filePath]){if(typeof n!="string")continue;const s=n.trim();if(s)return s}}function dy(e){const t=mn(e);if(!t)return;const n=gd(t);if(!n)return;const s=typeof t.offset=="number"&&Number.isFinite(t.offset)?Math.floor(t.offset):void 0,i=typeof t.limit=="number"&&Number.isFinite(t.limit)?Math.floor(t.limit):void 0,o=s!==void 0?Math.max(1,s):void 0,a=i!==void 0?Math.max(1,i):void 0;return o!==void 0&&a!==void 0?`${a===1?"line":"lines"} ${o}-${o+a-1} from ${n}`:o!==void 0?`from line ${o} in ${n}`:a!==void 0?`first ${a} ${a===1?"line":"lines"} of ${n}`:`from ${n}`}function uy(e,t){const n=mn(t);if(!n)return;const s=gd(n)??(typeof n.url=="string"?n.url.trim():void 0);if(!s)return;if(e==="attach")return`from ${s}`;const i=e==="edit"?"in":"to",o=typeof n.content=="string"?n.content:typeof n.newText=="string"?n.newText:typeof n.new_string=="string"?n.new_string:void 0;return o&&o.length>0?`${i} ${s} (${o.length} chars)`:`${i} ${s}`}function gy(e){const t=mn(e);if(!t)return;const n=typeof t.query=="string"?t.query.trim():void 0,s=typeof t.count=="number"&&Number.isFinite(t.count)&&t.count>0?Math.floor(t.count):void 0;if(n)return s!==void 0?`for "${n}" (top ${s})`:`for "${n}"`}function py(e){const t=mn(e);if(!t)return;const n=typeof t.url=="string"?t.url.trim():void 0;if(!n)return;const s=typeof t.extractMode=="string"?t.extractMode.trim():void 0,i=typeof t.maxChars=="number"&&Number.isFinite(t.maxChars)&&t.maxChars>0?Math.floor(t.maxChars):void 0,o=[s?`mode ${s}`:void 0,i!==void 0?`max ${i} chars`:void 0].filter(a=>!!a).join(", ");return o?`from ${n} (${o})`:`from ${n}`}function sa(e){if(!e)return e;const t=e.trim();return t.length>=2&&(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))?t.slice(1,-1).trim():t}function Kt(e,t=48){if(!e)return[];const n=[];let s="",i,o=!1;for(let a=0;a<e.length;a+=1){const r=e[a];if(o){s+=r,o=!1;continue}if(r==="\\"){o=!0;continue}if(i){r===i?i=void 0:s+=r;continue}if(r==='"'||r==="'"){i=r;continue}if(/\s/.test(r)){if(!s)continue;if(n.push(s),n.length>=t)return n;s="";continue}s+=r}return s&&n.push(s),n}function vn(e){if(!e)return;const t=sa(e)??e;return(t.split(/[/]/).at(-1)??t).trim().toLowerCase()}function Dt(e,t){const n=new Set(t);for(let s=0;s<e.length;s+=1){const i=e[s];if(i){if(n.has(i)){const o=e[s+1];if(o&&!o.startsWith("-"))return o;continue}for(const o of t)if(o.startsWith("--")&&i.startsWith(`${o}=`))return i.slice(o.length+1)}}}function rn(e,t=1,n=[]){const s=[],i=new Set(n);for(let o=t;o<e.length;o+=1){const a=e[o];if(a){if(a==="--"){for(let r=o+1;r<e.length;r+=1){const l=e[r];l&&s.push(l)}break}if(a.startsWith("--")){if(a.includes("="))continue;i.has(a)&&(o+=1);continue}if(a.startsWith("-")){i.has(a)&&(o+=1);continue}s.push(a)}}return s}function st(e,t=1,n=[]){return rn(e,t,n)[0]}function Ii(e){if(e.length===0)return e;let t=0;if(vn(e[0])==="env"){for(t=1;t<e.length;){const n=e[t];if(!n)break;if(n.startsWith("-")){t+=1;continue}if(/^[A-Za-z_][A-Za-z0-9_]*=/.test(n)){t+=1;continue}break}return e.slice(t)}for(;t<e.length&&/^[A-Za-z_][A-Za-z0-9_]*=/.test(e[t]);)t+=1;return e.slice(t)}function fy(e){const t=Kt(e,10);if(t.length<3)return e;const n=vn(t[0]);if(!(n==="bash"||n==="sh"||n==="zsh"||n==="fish"))return e;const s=t.findIndex((o,a)=>a>0&&(o==="-c"||o==="-lc"||o==="-ic"));if(s===-1)return e;const i=t.slice(s+1).join(" ").trim();return i?sa(i)??e:e}function ia(e,t){let n,s=!1;for(let i=0;i<e.length;i+=1){const o=e[i];if(s){s=!1;continue}if(o==="\\"){s=!0;continue}if(n){o===n&&(n=void 0);continue}if(o==='"'||o==="'"){n=o;continue}if(t(o,i)===!1)return}}function hy(e){const t=[];let n=0;return ia(e,(s,i)=>s===";"?(t.push(e.slice(n,i)),n=i+1,!0):((s==="&"||s==="|")&&e[i+1]===s&&(t.push(e.slice(n,i)),n=i+2),!0)),t.push(e.slice(n)),t.map(s=>s.trim()).filter(s=>s.length>0)}function my(e){const t=[];let n=0;return ia(e,(s,i)=>(s==="|"&&e[i-1]!=="|"&&e[i+1]!=="|"&&(t.push(e.slice(n,i)),n=i+1),!0)),t.push(e.slice(n)),t.map(s=>s.trim()).filter(s=>s.length>0)}function vy(e){const t=Kt(e,3),n=vn(t[0]);if(n==="cd"||n==="pushd")return t[1]||void 0}function by(e){const t=vn(Kt(e,2)[0]);return t==="cd"||t==="pushd"||t==="popd"}function yy(e){return vn(Kt(e,2)[0])==="popd"}function xy(e){let t=e.trim(),n;for(let s=0;s<4;s+=1){let i;ia(t,(l,d)=>{if(l==="&"&&t[d+1]==="&")return i={index:d,length:2},!1;if(l==="|"&&t[d+1]==="|")return i={index:d,length:2,isOr:!0},!1;if(l===";"||l===`
`)return i={index:d,length:1},!1});const o=(i?t.slice(0,i.index):t).trim(),a=(i?!i.isOr:s>0)&&by(o);if(!(o.startsWith("set ")||o.startsWith("export ")||o.startsWith("unset ")||a)||(a&&(yy(o)?n=void 0:n=vy(o)??n),t=i?t.slice(i.index+i.length).trimStart():"",!t))break}return{command:t.trim(),chdirPath:n}}function Li(e){if(e.length===0)return"run command";const t=vn(e[0])??"command";if(t==="git"){const s=new Set(["-C","-c","--git-dir","--work-tree","--namespace","--config-env"]),i=Dt(e,["-C"]);let o;for(let r=1;r<e.length;r+=1){const l=e[r];if(l){if(l==="--"){o=st(e,r+1);break}if(l.startsWith("--")){if(l.includes("="))continue;s.has(l)&&(r+=1);continue}if(l.startsWith("-")){s.has(l)&&(r+=1);continue}o=l;break}}const a={status:"check git status",diff:"check git diff",log:"view git history",show:"show git object",branch:"list git branches",checkout:"switch git branch",switch:"switch git branch",commit:"create git commit",pull:"pull git changes",push:"push git changes",fetch:"fetch git changes",merge:"merge git changes",rebase:"rebase git branch",add:"stage git changes",restore:"restore git files",reset:"reset git state",stash:"stash git changes"};return o&&a[o]?a[o]:!o||o.startsWith("/")||o.startsWith("~")||o.includes("/")?i?`run git command in ${i}`:"run git command":`run git ${o}`}if(t==="grep"||t==="rg"||t==="ripgrep"){const s=rn(e,1,["-e","--regexp","-f","--file","-m","--max-count","-A","--after-context","-B","--before-context","-C","--context"]),i=Dt(e,["-e","--regexp"])??s[0],o=s.length>1?s.at(-1):void 0;return i?o?`search "${i}" in ${o}`:`search "${i}"`:"search text"}if(t==="find"){const s=e[1]&&!e[1].startsWith("-")?e[1]:".",i=Dt(e,["-name","-iname"]);return i?`find files named "${i}" in ${s}`:`find files in ${s}`}if(t==="ls"){const s=st(e,1);return s?`list files in ${s}`:"list files"}if(t==="head"||t==="tail"){const s=Dt(e,["-n","--lines"])??e.slice(1).find(l=>/^-\d+$/.test(l))?.slice(1),i=rn(e,1,["-n","--lines"]);let o=i.at(-1);o&&/^\d+$/.test(o)&&i.length===1&&(o=void 0);const a=t==="head"?"first":"last",r=s==="1"?"line":"lines";return s&&o?`show ${a} ${s} ${r} of ${o}`:s?`show ${a} ${s} ${r}`:o?`show ${o}`:`show ${t} output`}if(t==="cat"){const s=st(e,1);return s?`show ${s}`:"show output"}if(t==="sed"){const s=Dt(e,["-e","--expression"]),i=rn(e,1,["-e","--expression","-f","--file"]),o=s??i[0],a=s?i[0]:i[1];if(o){const r=(sa(o)??o).replace(/\s+/g,""),l=r.match(/^([0-9]+),([0-9]+)p$/);if(l)return a?`print lines ${l[1]}-${l[2]} from ${a}`:`print lines ${l[1]}-${l[2]}`;const d=r.match(/^([0-9]+)p$/);if(d)return a?`print line ${d[1]} from ${a}`:`print line ${d[1]}`}return a?`run sed on ${a}`:"run sed transform"}if(t==="printf"||t==="echo")return"print text";if(t==="cp"||t==="mv"){const s=rn(e,1,["-t","--target-directory","-S","--suffix"]),i=s[0],o=s[1],a=t==="cp"?"copy":"move";return i&&o?`${a} ${i} to ${o}`:i?`${a} ${i}`:`${a} files`}if(t==="rm"){const s=st(e,1);return s?`remove ${s}`:"remove files"}if(t==="mkdir"){const s=st(e,1);return s?`create folder ${s}`:"create folder"}if(t==="touch"){const s=st(e,1);return s?`create file ${s}`:"create file"}if(t==="curl"||t==="wget"){const s=e.find(i=>/^https?:\/\//i.test(i));return s?`fetch ${s}`:"fetch url"}if(t==="npm"||t==="pnpm"||t==="yarn"||t==="bun"){const s=rn(e,1,["--prefix","-C","--cwd","--config"]),i=s[0]??"command";return{install:"install dependencies",test:"run tests",build:"run build",start:"start app",lint:"run lint",run:s[1]?`run ${s[1]}`:"run script"}[i]??`run ${t} ${i}`}if(t==="node"||t==="python"||t==="python3"||t==="ruby"||t==="php"){if(e.slice(1).find(l=>l.startsWith("<<")))return`run ${t} inline script (heredoc)`;if((t==="node"?Dt(e,["-e","--eval"]):t==="python"||t==="python3"?Dt(e,["-c"]):void 0)!==void 0)return`run ${t} inline script`;const r=st(e,1,t==="node"?["-e","--eval","-m"]:["-c","-e","--eval","-m"]);return r?t==="node"?`${e.includes("--check")||e.includes("-c")?"check js syntax for":"run node script"} ${r}`:`run ${t} ${r}`:`run ${t}`}if(t==="openclaw"){const s=st(e,1);return s?`run openclaw ${s}`:"run openclaw"}const n=st(e,1);return!n||n.length>48?`run ${t}`:/^[A-Za-z0-9._/-]+$/.test(n)?`run ${t} ${n}`:`run ${t}`}function $y(e){const t=my(e);if(t.length>1){const n=Li(Ii(Kt(t[0]))),s=Li(Ii(Kt(t[t.length-1]))),i=t.length>2?` (+${t.length-2} steps)`:"";return`${n} -> ${s}${i}`}return Li(Ii(Kt(e)))}function Ur(e){const{command:t,chdirPath:n}=xy(e);if(!t)return n?{text:"",chdirPath:n}:void 0;const s=hy(t);if(s.length===0)return;const i=s.map(r=>$y(r)),o=i.length===1?i[0]:i.join(" → "),a=i.every(r=>pd(r));return{text:o,chdirPath:n,allGeneric:a}}const wy=["check git","view git","show git","list git","switch git","create git","pull git","push git","fetch git","merge git","rebase git","stage git","restore git","reset git","stash git","search ","find files","list files","show first","show last","print line","print text","copy ","move ","remove ","create folder","create file","fetch http","install dependencies","run tests","run build","start app","run lint","run openclaw","run node script","run node ","run python","run ruby","run php","run sed","run git ","run npm ","run pnpm ","run yarn ","run bun ","check js syntax"];function pd(e){return e==="run command"?!0:e.startsWith("run ")?!wy.some(t=>e.startsWith(t)):!1}function ky(e,t=120){const n=e.replace(/\s*\n\s*/g," ").replace(/\s{2,}/g," ").trim();return n.length<=t?n:`${n.slice(0,Math.max(0,t-1))}…`}function Sy(e){const t=mn(e);if(!t)return;const n=typeof t.command=="string"?t.command.trim():void 0;if(!n)return;const s=fy(n),i=Ur(s)??Ur(n),o=i?.text||"run command",r=(typeof t.workdir=="string"?t.workdir:typeof t.cwd=="string"?t.cwd:void 0)?.trim()||i?.chdirPath||void 0,l=ky(s);if(i?.allGeneric!==!1&&pd(o))return r?`${l} (in ${r})`:l;const d=r?`${o} (in ${r})`:o;return l&&l!==d&&l!==o?`${d}

\`${l}\``:d}function Ay(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function Cy(e,t,n){{for(const s of t){const i=cy(e,s),o=ud(i,n.coerce);if(o)return o}return}}const Ty={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},_y={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},Ey={fallback:Ty,tools:_y},fd=Ey,Br=fd.fallback??{icon:"puzzle"},Ry=fd.tools??{};function Iy(e){if(!e)return e;const t=[{re:/^\/Users\/[^/]+(\/|$)/,replacement:"~$1"},{re:/^\/home\/[^/]+(\/|$)/,replacement:"~$1"},{re:/^C:\\Users\\[^\\]+(\\|$)/i,replacement:"~$1"}];for(const n of t)if(n.re.test(e))return e.replace(n.re,n.replacement);return e}function Ly(e){const t=ay(e.name),n=t.toLowerCase(),s=Ry[n],i=s?.icon??Br.icon??"puzzle",o=s?.title??ry(t),a=s?.label??o,r=e.args&&typeof e.args=="object"?e.args.action:void 0,l=typeof r=="string"?r.trim():void 0,d=Ay(s,l),u=n==="web_search"?"search":n==="web_fetch"?"fetch":n.replace(/_/g," ").replace(/\./g," "),g=ly(d?.label??l??u);let f;n==="exec"&&(f=Sy(e.args)),!f&&n==="read"&&(f=dy(e.args)),!f&&(n==="write"||n==="edit"||n==="attach")&&(f=uy(n,e.args)),!f&&n==="web_search"&&(f=gy(e.args)),!f&&n==="web_fetch"&&(f=py(e.args));const h=d?.detailKeys??s?.detailKeys??Br.detailKeys??[];return!f&&h.length>0&&(f=Cy(e.args,h,{coerce:{includeFalse:!0,includeZero:!0}})),!f&&e.meta&&(f=e.meta),f&&(f=Iy(f)),{name:t,icon:i,title:o,label:a,verb:g,detail:f}}function My(e){if(e.detail){if(e.detail.includes(" · ")){const t=e.detail.split(" · ").map(n=>n.trim()).filter(n=>n.length>0).join(", ");return t?`with ${t}`:void 0}return e.detail}}const Dy=80,Py=2,Hr=100;function Fy(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function Ny(e){const t=e.split(`
`),n=t.slice(0,Py),s=n.join(`
`);return s.length>Hr?s.slice(0,Hr)+"…":n.length<t.length?s+"…":s}function Oy(e){const t=e,n=Uy(t.content),s=[];for(const i of n){const o=(typeof i.type=="string"?i.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(o)||typeof i.name=="string"&&i.arguments!=null)&&s.push({kind:"call",name:i.name??"tool",args:By(i.arguments??i.args)})}for(const i of n){const o=(typeof i.type=="string"?i.type:"").toLowerCase();if(o!=="toolresult"&&o!=="tool_result")continue;const a=Hy(i),r=typeof i.name=="string"?i.name:"tool";s.push({kind:"result",name:r,text:a})}if(dd(e)&&!s.some(i=>i.kind==="result")){const i=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",o=rc(e)??void 0;s.push({kind:"result",name:i,text:o})}return s}function zr(e,t){const n=Ly({name:e.name,args:e.args}),s=My(n),i=!!e.text?.trim(),o=!!t,a=o?()=>{if(i){t(Fy(e.text));return}const g=`## ${n.label}

${s?`**Command:** \`${s}\`

`:""}*No output — tool completed successfully.*`;t(g)}:void 0,r=i&&(e.text?.length??0)<=Dy,l=i&&!r,d=i&&r,u=!i;return c`
    <div
      class="chat-tool-card ${o?"chat-tool-card--clickable":""}"
      @click=${a}
      role=${o?"button":m}
      tabindex=${o?"0":m}
      @keydown=${o?g=>{g.key!=="Enter"&&g.key!==" "||(g.preventDefault(),a?.())}:m}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${ce[n.icon]}</span>
          <span>${n.label}</span>
        </div>
        ${o?c`<span class="chat-tool-card__action">${i?"View":""} ${ce.check}</span>`:m}
        ${u&&!o?c`<span class="chat-tool-card__status">${ce.check}</span>`:m}
      </div>
      ${s?c`<div class="chat-tool-card__detail">${s}</div>`:m}
      ${u?c`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:m}
      ${l?c`<div class="chat-tool-card__preview mono">${Ny(e.text)}</div>`:m}
      ${d?c`<div class="chat-tool-card__inline mono">${e.text}</div>`:m}
    </div>
  `}function Uy(e){return Array.isArray(e)?e.filter(Boolean):[]}function By(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function Hy(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function zy(e){const n=e.content,s=[];if(Array.isArray(n))for(const i of n){if(typeof i!="object"||i===null)continue;const o=i;if(o.type==="image"){const a=o.source;if(a?.type==="base64"&&typeof a.data=="string"){const r=a.data,l=a.media_type||"image/png",d=r.startsWith("data:")?r:`data:${l};base64,${r}`;s.push({url:d})}else typeof o.url=="string"&&s.push({url:o.url})}else if(o.type==="image_url"){const a=o.image_url;typeof a?.url=="string"&&s.push({url:a.url})}}return s}function Ky(e){return c`
    <div class="chat-group assistant">
      ${oa("assistant",e)}
      <div class="chat-group-messages">
        <div class="chat-bubble chat-reading-indicator" aria-hidden="true">
          <span class="chat-reading-indicator__dots">
            <span></span><span></span><span></span>
          </span>
        </div>
      </div>
    </div>
  `}function jy(e,t,n,s){const i=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),o=s?.name??"Assistant";return c`
    <div class="chat-group assistant">
      ${oa("assistant",s)}
      <div class="chat-group-messages">
        ${hd({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${o}</span>
          <span class="chat-group-timestamp">${i}</span>
        </div>
      </div>
    </div>
  `}function Wy(e,t){const n=na(e.role),s=t.assistantName??"Assistant",i=n==="user"?"You":n==="assistant"?s:n,o=n==="user"?"user":n==="assistant"?"assistant":"other",a=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return c`
    <div class="chat-group ${o}">
      ${oa(e.role,{name:s,avatar:t.assistantAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((r,l)=>hd(r.message,{isStreaming:e.isStreaming&&l===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${i}</span>
          <span class="chat-group-timestamp">${a}</span>
        </div>
      </div>
    </div>
  `}function oa(e,t){const n=na(e),s=t?.name?.trim()||"Assistant",i=t?.avatar?.trim()||"",o=n==="user"?"U":n==="assistant"?s.charAt(0).toUpperCase()||"A":n==="tool"?"⚙":"?",a=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return i&&n==="assistant"?qy(i)?c`<img
        class="chat-avatar ${a}"
        src="${i}"
        alt="${s}"
      />`:c`<div class="chat-avatar ${a}">${i}</div>`:c`<div class="chat-avatar ${a}">${o}</div>`}function qy(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function Gy(e){return e.length===0?m:c`
    <div class="chat-message-images">
      ${e.map(t=>c`
          <img
            src=${t.url}
            alt=${t.alt??"Attached image"}
            class="chat-message-image"
            @click=${()=>window.open(t.url,"_blank")}
          />
        `)}
    </div>
  `}function hd(e,t,n){const s=e,i=typeof s.role=="string"?s.role:"unknown",o=dd(e)||i.toLowerCase()==="toolresult"||i.toLowerCase()==="tool_result"||typeof s.toolCallId=="string"||typeof s.tool_call_id=="string",a=Oy(e),r=a.length>0,l=zy(e),d=l.length>0,u=rc(e),g=t.showReasoning&&i==="assistant"?Fp(e):null,f=u?.trim()?u:null,h=g?Op(g):null,v=f,b=i==="assistant"&&!!v?.trim(),A=["chat-bubble",b?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");return!v&&r&&o?c`${a.map(k=>zr(k,n))}`:!v&&!r&&!d?m:c`
    <div class="${A}">
      ${b?oy(v):m}
      ${Gy(l)}
      ${h?c`<div class="chat-thinking">${Xi(ao(h))}</div>`:m}
      ${v?c`<div class="chat-text" dir="${rd(v)}">${Xi(ao(v))}</div>`:m}
      ${a.map(k=>zr(k,n))}
    </div>
  `}function Vy(e){return c`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title">Tool Output</div>
        <button @click=${e.onClose} class="btn" title="Close sidebar">
          ${ce.x}
        </button>
      </div>
      <div class="sidebar-content">
        ${e.error?c`
              <div class="callout danger">${e.error}</div>
              <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
                View Raw Text
              </button>
            `:e.content?c`<div class="sidebar-markdown">${Xi(ao(e.content))}</div>`:c`
                  <div class="muted">No content available</div>
                `}
      </div>
    </div>
  `}var Jy=Object.defineProperty,Qy=Object.getOwnPropertyDescriptor,Ys=(e,t,n,s)=>{for(var i=s>1?void 0:s?Qy(t,n):t,o=e.length-1,a;o>=0;o--)(a=e[o])&&(i=(s?a(t,n,i):a(i))||i);return s&&i&&Jy(t,n,i),i};let pn=class extends cn{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.isDragging=!1,this.startX=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startX=e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=t.getBoundingClientRect().width,i=(e.clientX-this.startX)/n;let o=this.startRatio+i;o=Math.max(this.minRatio,Math.min(this.maxRatio,o)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:o},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return m}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};pn.styles=Cd`
    :host {
      width: 4px;
      cursor: col-resize;
      background: var(--border, #333);
      transition: background 150ms ease-out;
      flex-shrink: 0;
      position: relative;
    }
    :host::before {
      content: "";
      position: absolute;
      top: 0;
      left: -4px;
      right: -4px;
      bottom: 0;
    }
    :host(:hover) {
      background: var(--accent, #007bff);
    }
    :host(.dragging) {
      background: var(--accent, #007bff);
    }
  `;Ys([Fs({type:Number})],pn.prototype,"splitRatio",2);Ys([Fs({type:Number})],pn.prototype,"minRatio",2);Ys([Fs({type:Number})],pn.prototype,"maxRatio",2);pn=Ys([pl("resizable-divider")],pn);const Yy=5e3,Xy=8e3;function Kr(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function Zy(e){return e?e.active?c`
      <div class="compaction-indicator compaction-indicator--active" role="status" aria-live="polite">
        ${ce.loader} Compacting context...
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<Yy?c`
        <div class="compaction-indicator compaction-indicator--complete" role="status" aria-live="polite">
          ${ce.check} Context compacted
        </div>
      `:m:m}function e0(e){if(!e)return m;const t=e.phase??"active";if(Date.now()-e.occurredAt>=Xy)return m;const s=[`Selected: ${e.selected}`,t==="cleared"?`Active: ${e.selected}`:`Active: ${e.active}`,t==="cleared"&&e.previous?`Previous fallback: ${e.previous}`:null,e.reason?`Reason: ${e.reason}`:null,e.attempts.length>0?`Attempts: ${e.attempts.slice(0,3).join(" | ")}`:null].filter(Boolean).join(" • "),i=t==="cleared"?`Fallback cleared: ${e.selected}`:`Fallback active: ${e.active}`,o=t==="cleared"?"compaction-indicator compaction-indicator--fallback-cleared":"compaction-indicator compaction-indicator--fallback",a=t==="cleared"?ce.check:ce.brain;return c`
    <div
      class=${o}
      role="status"
      aria-live="polite"
      title=${s}
    >
      ${a} ${i}
    </div>
  `}function t0(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function n0(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let i=0;i<n.length;i++){const o=n[i];o.type.startsWith("image/")&&s.push(o)}if(s.length!==0){e.preventDefault();for(const i of s){const o=i.getAsFile();if(!o)continue;const a=new FileReader;a.addEventListener("load",()=>{const r=a.result,l={id:t0(),dataUrl:r,mimeType:o.type},d=t.attachments??[];t.onAttachmentsChange?.([...d,l])}),a.readAsDataURL(o)}}}function s0(e){const t=e.attachments??[];return t.length===0?m:c`
    <div class="chat-attachments">
      ${t.map(n=>c`
          <div class="chat-attachment">
            <img
              src=${n.dataUrl}
              alt="Attachment preview"
              class="chat-attachment__img"
            />
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const s=(e.attachments??[]).filter(i=>i.id!==n.id);e.onAttachmentsChange?.(s)}}
            >
              ${ce.x}
            </button>
          </div>
        `)}
    </div>
  `}function i0(e){const t=e.connected,n=e.sending||e.stream!==null,s=!!(e.canAbort&&e.onAbort),o=e.sessions?.sessions?.find(h=>h.key===e.sessionKey)?.reasoningLevel??"off",a=e.showThinking&&o!=="off",r={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},l=(e.attachments?.length??0)>0,d=e.connected?l?"Add a message or paste more images...":"Message (↩ to send, Shift+↩ for line breaks, paste images)":"Connect to the gateway to start chatting…",u=e.splitRatio??.6,g=!!(e.sidebarOpen&&e.onCloseSidebar),f=c`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
    >
      ${e.loading?c`
              <div class="muted">Loading chat…</div>
            `:m}
      ${_c(a0(e),h=>h.key,h=>h.kind==="divider"?c`
              <div class="chat-divider" role="separator" data-ts=${String(h.timestamp)}>
                <span class="chat-divider__line"></span>
                <span class="chat-divider__label">${h.label}</span>
                <span class="chat-divider__line"></span>
              </div>
            `:h.kind==="reading-indicator"?Ky(r):h.kind==="stream"?jy(h.text,h.startedAt,e.onOpenSidebar,r):h.kind==="group"?Wy(h,{onOpenSidebar:e.onOpenSidebar,showReasoning:a,assistantName:e.assistantName,assistantAvatar:r.avatar}):m)}
    </div>
  `;return c`
    <section class="card chat">
      ${e.disabledReason?c`<div class="callout">${e.disabledReason}</div>`:m}

      ${e.error?c`<div class="callout danger">${e.error}</div>`:m}

      ${e.focusMode?c`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${ce.x}
            </button>
          `:m}

      <div
        class="chat-split-container ${g?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${g?`0 0 ${u*100}%`:"1 1 100%"}"
        >
          ${f}
        </div>

        ${g?c`
              <resizable-divider
                .splitRatio=${u}
                @resize=${h=>e.onSplitRatioChange?.(h.detail.splitRatio)}
              ></resizable-divider>
              <div class="chat-sidebar">
                ${Vy({content:e.sidebarContent??null,error:e.sidebarError??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(`\`\`\`
${e.sidebarContent}
\`\`\``)}})}
              </div>
            `:m}
      </div>

      ${e.queue.length?c`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(h=>c`
                    <div class="chat-queue__item">
                      <div class="chat-queue__text">
                        ${h.text||(h.attachments?.length?`Image (${h.attachments.length})`:"")}
                      </div>
                      <button
                        class="btn chat-queue__remove"
                        type="button"
                        aria-label="Remove queued message"
                        @click=${()=>e.onQueueRemove(h.id)}
                      >
                        ${ce.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:m}

      ${e0(e.fallbackStatus)}
      ${Zy(e.compactionStatus)}

      ${e.showNewMessages?c`
            <button
              class="btn chat-new-messages"
              type="button"
              @click=${e.onScrollToBottom}
            >
              New messages ${ce.arrowDown}
            </button>
          `:m}

      <div class="chat-compose">
        ${s0(e)}
        <div class="chat-compose__row">
          <label class="field chat-compose__field">
            <span>Message</span>
            <textarea
              ${Dv(h=>h&&Kr(h))}
              .value=${e.draft}
              dir=${rd(e.draft)}
              ?disabled=${!e.connected}
              @keydown=${h=>{h.key==="Enter"&&(h.isComposing||h.keyCode===229||h.shiftKey||e.connected&&(h.preventDefault(),t&&e.onSend()))}}
              @input=${h=>{const v=h.target;Kr(v),e.onDraftChange(v.value)}}
              @paste=${h=>n0(h,e)}
              placeholder=${d}
            ></textarea>
          </label>
          <div class="chat-compose__actions">
            ${e.onConsciousnessFlush?c`
                  <button
                    class="btn btn--icon consciousness-btn ${e.consciousnessStatus==="ok"?"consciousness-btn--ok":""} ${e.consciousnessStatus==="error"?"consciousness-btn--error":""}"
                    type="button"
                    ?disabled=${e.consciousnessStatus==="loading"}
                    @click=${e.onConsciousnessFlush}
                    aria-label="Sync consciousness (⌘⇧H)"
                    title="Sync consciousness — refreshes Atlas's live context across all sessions (⌘⇧H)"
                  >
                    ${e.consciousnessStatus==="loading"?ce.loader:ce.brain}
                  </button>
                `:m}
            <button
              class="btn"
              ?disabled=${!e.connected||!s&&e.sending}
              @click=${s?e.onAbort:e.onNewSession}
            >
              ${s?"Stop":"New session"}
            </button>
            <button
              class="btn primary"
              ?disabled=${!e.connected}
              @click=${e.onSend}
            >
              ${n?"Queue":"Send"}<kbd class="btn-kbd">↵</kbd>
            </button>
          </div>
        </div>
      </div>
    </section>
  `}const jr=200;function o0(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const i=cd(s.message),o=na(i.role),a=i.timestamp||Date.now();!n||n.role!==o?(n&&t.push(n),n={kind:"group",key:`group:${o}:${s.key}`,role:o,messages:[{message:s.message,key:s.key}],timestamp:a,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function a0(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],i=Math.max(0,n.length-jr);i>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${jr} messages (${i} hidden).`,timestamp:Date.now()}});for(let o=i;o<n.length;o++){const a=n[o],r=cd(a),d=a.__openclaw;if(d&&d.kind==="compaction"){t.push({kind:"divider",key:typeof d.id=="string"?`divider:compaction:${d.id}`:`divider:compaction:${r.timestamp}:${o}`,label:"Compaction",timestamp:r.timestamp??Date.now()});continue}!e.showThinking&&r.role.toLowerCase()==="toolresult"||t.push({kind:"message",key:Wr(a,o),message:a})}if(e.showThinking)for(let o=0;o<s.length;o++)t.push({kind:"message",key:Wr(s[o],o+n.length),message:s[o]});if(e.stream!==null){const o=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:o,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:o})}return o0(t)}function Wr(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const i=typeof n.id=="string"?n.id:"";if(i)return`msg:${i}`;const o=typeof n.messageId=="string"?n.messageId:"";if(o)return`msg:${o}`;const a=typeof n.timestamp=="number"?n.timestamp:null,r=typeof n.role=="string"?n.role:"unknown";return a!=null?`msg:${r}:${a}:${t}`:`msg:${r}:${t}`}function md(e){return e.trim().toLowerCase()}function r0(e){const t=new Set,n=[],s=/(^|\s)tag:([^\s]+)/gi,i=e.trim();let o=s.exec(i);for(;o;){const a=md(o[2]??"");a&&!t.has(a)&&(t.add(a),n.push(a)),o=s.exec(i)}return n}function l0(e,t){const n=[],s=new Set;for(const r of t){const l=md(r);!l||s.has(l)||(s.add(l),n.push(l))}const o=e.trim().replace(/(^|\s)tag:([^\s]+)/gi," ").replace(/\s+/g," ").trim(),a=n.map(r=>`tag:${r}`).join(" ");return o&&a?`${o} ${a}`:o||a}const c0=["security","auth","network","access","privacy","observability","performance","reliability","storage","models","media","automation","channels","tools","advanced"],ro={all:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,env:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:c`
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
  `,meta:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:c`
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
  `,default:c`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},qr=[{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"}],Gr="__all__";function Vr(e){return ro[e]??ro.default}function d0(e,t){const n=qo[e];return n||{label:t?.title??Ns(e),description:t?.description??""}}function u0(e){const{key:t,schema:n,uiHints:s}=e;if(!n||Re(n)!=="object"||!n.properties)return[];const i=Object.entries(n.properties).map(([o,a])=>{const r=vt([t,o],s),l=r?.label??a.title??Ns(o),d=r?.help??a.description??"",u=r?.order??50;return{key:o,label:l,description:d,order:u}});return i.sort((o,a)=>o.order!==a.order?o.order-a.order:o.key.localeCompare(a.key)),i}function g0(e,t){if(!e||!t)return[];const n=[];function s(i,o,a){if(i===o)return;if(typeof i!=typeof o){n.push({path:a,from:i,to:o});return}if(typeof i!="object"||i===null||o===null){i!==o&&n.push({path:a,from:i,to:o});return}if(Array.isArray(i)&&Array.isArray(o)){JSON.stringify(i)!==JSON.stringify(o)&&n.push({path:a,from:i,to:o});return}const r=i,l=o,d=new Set([...Object.keys(r),...Object.keys(l)]);for(const u of d)s(r[u],l[u],a?`${a}.${u}`:u)}return s(e,t,""),n}function Jr(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}function p0(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=Uc(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,i=n.schema?.properties??{},o=qr.filter(p=>p.key in i),a=new Set(qr.map(p=>p.key)),r=Object.keys(i).filter(p=>!a.has(p)).map(p=>({key:p,label:p.charAt(0).toUpperCase()+p.slice(1)})),l=[...o,...r],d=e.activeSection&&n.schema&&Re(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,u=e.activeSection?d0(e.activeSection,d):null,g=e.activeSection?u0({key:e.activeSection,schema:d,uiHints:e.uiHints}):[],f=e.formMode==="form"&&!!e.activeSection&&g.length>0,h=e.activeSubsection===Gr,v=e.searchQuery||h?null:e.activeSubsection??g[0]?.key??null,b=e.formMode==="form"?g0(e.originalValue,e.formValue):[],A=e.formMode==="raw"&&e.raw!==e.originalRaw,k=e.formMode==="form"?b.length>0:A,T=!!e.formValue&&!e.loading&&!!n.schema,S=e.connected&&!e.saving&&k&&(e.formMode==="raw"?!0:T),R=e.connected&&!e.applying&&!e.updating&&k&&(e.formMode==="raw"?!0:T),I=e.connected&&!e.applying&&!e.updating,C=new Set(r0(e.searchQuery));return c`
    <div class="config-layout">
      <!-- Sidebar -->
      <aside class="config-sidebar">
        <div class="config-sidebar__header">
          <div class="config-sidebar__title">Settings</div>
          <span
            class="pill pill--sm ${t==="valid"?"pill--ok":t==="invalid"?"pill--danger":""}"
            >${t}</span
          >
        </div>

        <!-- Search -->
        <div class="config-search">
          <div class="config-search__input-row">
            <svg
              class="config-search__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              class="config-search__input"
              placeholder="Search settings..."
              .value=${e.searchQuery}
              @input=${p=>e.onSearchChange(p.target.value)}
            />
            ${e.searchQuery?c`
                  <button
                    class="config-search__clear"
                    @click=${()=>e.onSearchChange("")}
                  >
                    ×
                  </button>
                `:m}
          </div>
          <div class="config-search__hint">
            <span class="config-search__hint-label" id="config-tag-filter-label">Tag filters:</span>
            <details class="config-search__tag-picker">
              <summary class="config-search__tag-trigger" aria-labelledby="config-tag-filter-label">
                ${C.size===0?c`
                        <span class="config-search__tag-placeholder">Add tags</span>
                      `:c`
                        <div class="config-search__tag-chips">
                          ${Array.from(C).slice(0,2).map(p=>c`<span class="config-search__tag-chip">tag:${p}</span>`)}
                          ${C.size>2?c`
                                  <span class="config-search__tag-chip config-search__tag-chip--count"
                                    >+${C.size-2}</span
                                  >
                                `:m}
                        </div>
                      `}
                <span class="config-search__tag-caret" aria-hidden="true">▾</span>
              </summary>
              <div class="config-search__tag-menu">
                ${c0.map(p=>{const _=C.has(p);return c`
                    <button
                      type="button"
                      class="config-search__tag-option ${_?"active":""}"
                      data-tag="${p}"
                      aria-pressed=${_?"true":"false"}
                      @click=${()=>{const P=_?Array.from(C).filter(O=>O!==p):[...C,p];e.onSearchChange(l0(e.searchQuery,P))}}
                    >
                      tag:${p}
                    </button>
                  `})}
              </div>
            </details>
          </div>
        </div>

        <!-- Section nav -->
        <nav class="config-nav">
          <button
            class="config-nav__item ${e.activeSection===null?"active":""}"
            @click=${()=>e.onSectionChange(null)}
          >
            <span class="config-nav__icon">${ro.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${l.map(p=>c`
              <button
                class="config-nav__item ${e.activeSection===p.key?"active":""}"
                @click=${()=>e.onSectionChange(p.key)}
              >
                <span class="config-nav__icon"
                  >${Vr(p.key)}</span
                >
                <span class="config-nav__label">${p.label}</span>
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
            ${k?c`
                  <span class="config-changes-badge"
                    >${e.formMode==="raw"?"Unsaved changes":`${b.length} unsaved change${b.length!==1?"s":""}`}</span
                  >
                `:c`
                    <span class="config-status muted">No changes</span>
                  `}
          </div>
          <div class="config-actions__right">
            <button
              class="btn btn--sm"
              ?disabled=${e.loading}
              @click=${e.onReload}
            >
              ${e.loading?"Loading…":"Reload"}
            </button>
            <button
              class="btn btn--sm primary"
              ?disabled=${!S}
              @click=${e.onSave}
            >
              ${e.saving?"Saving…":"Save"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!R}
              @click=${e.onApply}
            >
              ${e.applying?"Applying…":"Apply"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!I}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${k&&e.formMode==="form"?c`
              <details class="config-diff">
                <summary class="config-diff__summary">
                  <span
                    >View ${b.length} pending
                    change${b.length!==1?"s":""}</span
                  >
                  <svg
                    class="config-diff__chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div class="config-diff__content">
                  ${b.map(p=>c`
                      <div class="config-diff__item">
                        <div class="config-diff__path">${p.path}</div>
                        <div class="config-diff__values">
                          <span class="config-diff__from"
                            >${Jr(p.from)}</span
                          >
                          <span class="config-diff__arrow">→</span>
                          <span class="config-diff__to"
                            >${Jr(p.to)}</span
                          >
                        </div>
                      </div>
                    `)}
                </div>
              </details>
            `:m}
        ${u&&e.formMode==="form"?c`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">
                  ${Vr(e.activeSection??"")}
                </div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">
                    ${u.label}
                  </div>
                  ${u.description?c`<div class="config-section-hero__desc">
                        ${u.description}
                      </div>`:m}
                </div>
              </div>
            `:m}
        ${f?c`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${v===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(Gr)}
                >
                  All
                </button>
                ${g.map(p=>c`
                    <button
                      class="config-subnav__item ${v===p.key?"active":""}"
                      title=${p.description||p.label}
                      @click=${()=>e.onSubsectionChange(p.key)}
                    >
                      ${p.label}
                    </button>
                  `)}
              </div>
            `:m}

        <!-- Form content -->
        <div class="config-content">
          ${e.formMode==="form"?c`
                ${e.schemaLoading?c`
                        <div class="config-loading">
                          <div class="config-loading__spinner"></div>
                          <span>Loading schema…</span>
                        </div>
                      `:ev({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:v})}
                ${s?c`
                        <div class="callout danger" style="margin-top: 12px">
                          Form view can't safely edit some fields. Use Raw to avoid losing config entries.
                        </div>
                      `:m}
              `:c`
                <label class="field config-raw-field">
                  <span>Raw JSON5</span>
                  <textarea
                    .value=${e.raw}
                    @input=${p=>e.onRawChange(p.target.value)}
                  ></textarea>
                </label>
              `}
        </div>

        ${e.issues.length>0?c`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">
${JSON.stringify(e.issues,null,2)}</pre
              >
            </div>`:m}
      </main>
    </div>
  `}const it=e=>e??m,Qr=[{value:"ok",label:"OK"},{value:"error",label:"Error"},{value:"skipped",label:"Skipped"}],Yr=[{value:"delivered",label:"Delivered"},{value:"not-delivered",label:"Not delivered"},{value:"unknown",label:"Unknown"},{value:"not-requested",label:"Not requested"}];function Xr(e,t,n){const s=new Set(e);return n?s.add(t):s.delete(t),Array.from(s)}function Zr(e,t){return e.length===0?t:e.length<=2?e.join(", "):`${e[0]} +${e.length-1}`}function f0(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.deliveryChannel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(i=>s.has(i)?!1:(s.add(i),!0))}function h0(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function el(e){return c`
    <div class="field cron-filter-dropdown" data-filter=${e.id}>
      <span>${e.title}</span>
      <details class="cron-filter-dropdown__details">
        <summary class="btn cron-filter-dropdown__trigger">
          <span>${e.summary}</span>
        </summary>
        <div class="cron-filter-dropdown__panel">
          <div class="cron-filter-dropdown__list">
            ${e.options.map(t=>c`
                <label class="cron-filter-dropdown__option">
                  <input
                    type="checkbox"
                    value=${t.value}
                    .checked=${e.selected.includes(t.value)}
                    @change=${n=>{const s=n.target;e.onToggle(t.value,s.checked)}}
                  />
                  <span>${t.label}</span>
                </label>
              `)}
          </div>
          <div class="row">
            <button class="btn" type="button" @click=${e.onClear}>Clear</button>
          </div>
        </div>
      </details>
    </div>
  `}function En(e,t){const n=Array.from(new Set(t.map(s=>s.trim()).filter(Boolean)));return n.length===0?m:c`<datalist id=${e}>
    ${n.map(s=>c`<option value=${s}></option> `)}
  </datalist>`}function we(e){return`cron-error-${e}`}function m0(e){return e==="name"?"cron-name":e==="scheduleAt"?"cron-schedule-at":e==="everyAmount"?"cron-every-amount":e==="cronExpr"?"cron-cron-expr":e==="staggerAmount"?"cron-stagger-amount":e==="payloadText"?"cron-payload-text":e==="payloadModel"?"cron-payload-model":e==="payloadThinking"?"cron-payload-thinking":e==="timeoutSeconds"?"cron-timeout-seconds":"cron-delivery-to"}function v0(e,t,n){return e==="payloadText"?t.payloadKind==="systemEvent"?"Main timeline message":"Assistant task prompt":e==="deliveryTo"?n==="webhook"?"Webhook URL":"To":{name:"Name",scheduleAt:"Run at",everyAmount:"Every",cronExpr:"Expression",staggerAmount:"Stagger window",payloadText:"Payload text",payloadModel:"Model",payloadThinking:"Thinking",timeoutSeconds:"Timeout (seconds)",deliveryTo:"To"}[e]}function b0(e,t,n){const s=["name","scheduleAt","everyAmount","cronExpr","staggerAmount","payloadText","payloadModel","payloadThinking","timeoutSeconds","deliveryTo"],i=[];for(const o of s){const a=e[o];a&&i.push({key:o,label:v0(o,t,n),message:a,inputId:m0(o)})}return i}function y0(e){const t=document.getElementById(e);t instanceof HTMLElement&&(typeof t.scrollIntoView=="function"&&t.scrollIntoView({block:"center",behavior:"smooth"}),t.focus())}function ye(e,t=!1){return c`<span>
    ${e}
    ${t?c`
            <span class="cron-required-marker" aria-hidden="true">*</span>
            <span class="cron-required-sr">required</span>
          `:m}
  </span>`}function x0(e){const t=!!e.editingJobId,n=e.form.payloadKind==="agentTurn",s=e.form.scheduleKind==="cron",i=f0(e),o=e.runsJobId==null?void 0:e.jobs.find(k=>k.id===e.runsJobId),a=e.runsScope==="all"?"all jobs":o?.name??e.runsJobId??"(select a job)",r=e.runs,l=Qr.filter(k=>e.runsStatuses.includes(k.value)).map(k=>k.label),d=Yr.filter(k=>e.runsDeliveryStatuses.includes(k.value)).map(k=>k.label),u=Zr(l,"All statuses"),g=Zr(d,"All delivery"),f=e.form.sessionTarget==="isolated"&&e.form.payloadKind==="agentTurn",h=e.form.deliveryMode==="announce"&&!f?"none":e.form.deliveryMode,v=b0(e.fieldErrors,e.form,h),b=!e.busy&&v.length>0,A=b&&!e.canSubmit?`Fix ${v.length} ${v.length===1?"field":"fields"} to continue.`:"";return c`
    <section class="card cron-summary-strip">
      <div class="cron-summary-strip__left">
        <div class="cron-summary-item">
          <div class="cron-summary-label">Enabled</div>
          <div class="cron-summary-value">
            <span class=${`chip ${e.status?.enabled?"chip-ok":"chip-danger"}`}>
              ${e.status?e.status.enabled?"Yes":"No":"n/a"}
            </span>
          </div>
        </div>
        <div class="cron-summary-item">
          <div class="cron-summary-label">Jobs</div>
          <div class="cron-summary-value">${e.status?.jobs??"n/a"}</div>
        </div>
        <div class="cron-summary-item cron-summary-item--wide">
          <div class="cron-summary-label">Next wake</div>
          <div class="cron-summary-value">${jo(e.status?.nextWakeAtMs??null)}</div>
        </div>
      </div>
      <div class="cron-summary-strip__actions">
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Refreshing...":"Refresh"}
        </button>
        ${e.error?c`<span class="muted">${e.error}</span>`:m}
      </div>
    </section>

    <section class="cron-workspace">
      <div class="cron-workspace-main">
        <section class="card">
          <div class="row" style="justify-content: space-between; align-items: flex-start; gap: 12px;">
            <div>
              <div class="card-title">Jobs</div>
              <div class="card-sub">All scheduled jobs stored in the gateway.</div>
            </div>
            <div class="muted">${e.jobs.length} shown of ${e.jobsTotal}</div>
          </div>
          <div class="filters" style="margin-top: 12px;">
            <label class="field cron-filter-search">
              <span>Search jobs</span>
              <input
                .value=${e.jobsQuery}
                placeholder="Name, description, or agent"
                @input=${k=>e.onJobsFiltersChange({cronJobsQuery:k.target.value})}
              />
            </label>
            <label class="field">
              <span>Enabled</span>
              <select
                .value=${e.jobsEnabledFilter}
                @change=${k=>e.onJobsFiltersChange({cronJobsEnabledFilter:k.target.value})}
              >
                <option value="all">All</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </label>
            <label class="field">
              <span>Sort</span>
              <select
                .value=${e.jobsSortBy}
                @change=${k=>e.onJobsFiltersChange({cronJobsSortBy:k.target.value})}
              >
                <option value="nextRunAtMs">Next run</option>
                <option value="updatedAtMs">Recently updated</option>
                <option value="name">Name</option>
              </select>
            </label>
            <label class="field">
              <span>Direction</span>
              <select
                .value=${e.jobsSortDir}
                @change=${k=>e.onJobsFiltersChange({cronJobsSortDir:k.target.value})}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
          ${e.jobs.length===0?c`
                  <div class="muted" style="margin-top: 12px">No matching jobs.</div>
                `:c`
                  <div class="list" style="margin-top: 12px;">
                    ${e.jobs.map(k=>w0(k,e))}
                  </div>
                `}
          ${e.jobsHasMore?c`
                  <div class="row" style="margin-top: 12px">
                    <button
                      class="btn"
                      ?disabled=${e.loading||e.jobsLoadingMore}
                      @click=${e.onLoadMoreJobs}
                    >
                      ${e.jobsLoadingMore?"Loading...":"Load more jobs"}
                    </button>
                  </div>
                `:m}
        </section>

        <section class="card">
          <div class="row" style="justify-content: space-between; align-items: flex-start; gap: 12px;">
            <div>
              <div class="card-title">Run history</div>
              <div class="card-sub">
                ${e.runsScope==="all"?"Latest runs across all jobs.":`Latest runs for ${a}.`}
              </div>
            </div>
            <div class="muted">${r.length} shown of ${e.runsTotal}</div>
          </div>
          <div class="cron-run-filters">
            <div class="cron-run-filters__row cron-run-filters__row--primary">
              <label class="field">
                <span>Scope</span>
                <select
                  .value=${e.runsScope}
                  @change=${k=>e.onRunsFiltersChange({cronRunsScope:k.target.value})}
                >
                  <option value="all">All jobs</option>
                  <option value="job" ?disabled=${e.runsJobId==null}>Selected job</option>
                </select>
              </label>
              <label class="field cron-run-filter-search">
                <span>Search runs</span>
                <input
                  .value=${e.runsQuery}
                  placeholder="Summary, error, or job"
                  @input=${k=>e.onRunsFiltersChange({cronRunsQuery:k.target.value})}
                />
              </label>
              <label class="field">
                <span>Sort</span>
                <select
                  .value=${e.runsSortDir}
                  @change=${k=>e.onRunsFiltersChange({cronRunsSortDir:k.target.value})}
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>
              </label>
            </div>
            <div class="cron-run-filters__row cron-run-filters__row--secondary">
              ${el({id:"status",title:"Status",summary:u,options:Qr,selected:e.runsStatuses,onToggle:(k,T)=>{const S=Xr(e.runsStatuses,k,T);e.onRunsFiltersChange({cronRunsStatuses:S})},onClear:()=>{e.onRunsFiltersChange({cronRunsStatuses:[]})}})}
              ${el({id:"delivery",title:"Delivery",summary:g,options:Yr,selected:e.runsDeliveryStatuses,onToggle:(k,T)=>{const S=Xr(e.runsDeliveryStatuses,k,T);e.onRunsFiltersChange({cronRunsDeliveryStatuses:S})},onClear:()=>{e.onRunsFiltersChange({cronRunsDeliveryStatuses:[]})}})}
            </div>
          </div>
          ${e.runsScope==="job"&&e.runsJobId==null?c`
                  <div class="muted" style="margin-top: 12px">Select a job to inspect run history.</div>
                `:r.length===0?c`
                    <div class="muted" style="margin-top: 12px">No matching runs.</div>
                  `:c`
                    <div class="list" style="margin-top: 12px;">
                      ${r.map(k=>C0(k,e.basePath))}
                    </div>
                  `}
          ${(e.runsScope==="all"||e.runsJobId!=null)&&e.runsHasMore?c`
                  <div class="row" style="margin-top: 12px">
                    <button
                      class="btn"
                      ?disabled=${e.runsLoadingMore}
                      @click=${e.onLoadMoreRuns}
                    >
                      ${e.runsLoadingMore?"Loading...":"Load more runs"}
                    </button>
                  </div>
                `:m}
        </section>
      </div>

      <section class="card cron-workspace-form">
        <div class="card-title">${t?"Edit Job":"New Job"}</div>
        <div class="card-sub">
          ${t?"Update the selected scheduled job.":"Create a scheduled wakeup or agent run."}
        </div>
        <div class="cron-form">
          <div class="cron-required-legend">
            <span class="cron-required-marker" aria-hidden="true">*</span> Required
          </div>
          <section class="cron-form-section">
            <div class="cron-form-section__title">Basics</div>
            <div class="cron-form-section__sub">Name it, choose the assistant, and set enabled state.</div>
            <div class="form-grid cron-form-grid">
              <label class="field">
                ${ye("Name",!0)}
                <input
                  id="cron-name"
                  .value=${e.form.name}
                  placeholder="Morning brief"
                  aria-invalid=${e.fieldErrors.name?"true":"false"}
                  aria-describedby=${it(e.fieldErrors.name?we("name"):void 0)}
                  @input=${k=>e.onFormChange({name:k.target.value})}
                />
                ${ft(e.fieldErrors.name,we("name"))}
              </label>
              <label class="field">
                <span>Description</span>
                <input
                  .value=${e.form.description}
                  placeholder="Optional context for this job"
                  @input=${k=>e.onFormChange({description:k.target.value})}
                />
              </label>
              <label class="field">
                ${ye("Agent ID")}
                <input
                  id="cron-agent-id"
                  .value=${e.form.agentId}
                  list="cron-agent-suggestions"
                  ?disabled=${e.form.clearAgent}
                  @input=${k=>e.onFormChange({agentId:k.target.value})}
                  placeholder="main or ops"
                />
                <div class="cron-help">
                  Start typing to pick a known agent, or enter a custom one.
                </div>
              </label>
              <label class="field checkbox cron-checkbox cron-checkbox-inline">
                <input
                  type="checkbox"
                  .checked=${e.form.enabled}
                  @change=${k=>e.onFormChange({enabled:k.target.checked})}
                />
                <span class="field-checkbox__label">Enabled</span>
              </label>
            </div>
          </section>

          <section class="cron-form-section">
            <div class="cron-form-section__title">Schedule</div>
            <div class="cron-form-section__sub">Control when this job runs.</div>
            <div class="form-grid cron-form-grid">
              <label class="field cron-span-2">
                ${ye("Schedule")}
                <select
                  id="cron-schedule-kind"
                  .value=${e.form.scheduleKind}
                  @change=${k=>e.onFormChange({scheduleKind:k.target.value})}
                >
                  <option value="every">Every</option>
                  <option value="at">At</option>
                  <option value="cron">Cron</option>
                </select>
              </label>
            </div>
            ${$0(e)}
          </section>

          <section class="cron-form-section">
            <div class="cron-form-section__title">Execution</div>
            <div class="cron-form-section__sub">Choose when to wake, and what this job should do.</div>
            <div class="form-grid cron-form-grid">
              <label class="field">
                ${ye("Session")}
                <select
                  id="cron-session-target"
                  .value=${e.form.sessionTarget}
                  @change=${k=>e.onFormChange({sessionTarget:k.target.value})}
                >
                  <option value="main">Main</option>
                  <option value="isolated">Isolated</option>
                </select>
                <div class="cron-help">Main posts a system event. Isolated runs a dedicated agent turn.</div>
              </label>
              <label class="field">
                ${ye("Wake mode")}
                <select
                  id="cron-wake-mode"
                  .value=${e.form.wakeMode}
                  @change=${k=>e.onFormChange({wakeMode:k.target.value})}
                >
                  <option value="now">Now</option>
                  <option value="next-heartbeat">Next heartbeat</option>
                </select>
                <div class="cron-help">Now triggers immediately. Next heartbeat waits for the next cycle.</div>
              </label>
              <label class="field ${n?"":"cron-span-2"}">
                ${ye("What should run?")}
                <select
                  id="cron-payload-kind"
                  .value=${e.form.payloadKind}
                  @change=${k=>e.onFormChange({payloadKind:k.target.value})}
                >
                  <option value="systemEvent">Post message to main timeline</option>
                  <option value="agentTurn">Run assistant task (isolated)</option>
                </select>
                <div class="cron-help">
                  ${e.form.payloadKind==="systemEvent"?"Sends your text to the gateway main timeline (good for reminders/triggers).":"Starts an assistant run in its own session using your prompt."}
                </div>
              </label>
              ${n?c`
                      <label class="field">
                        ${ye("Timeout (seconds)")}
                        <input
                          id="cron-timeout-seconds"
                          .value=${e.form.timeoutSeconds}
                          placeholder="Optional, e.g. 90"
                          aria-invalid=${e.fieldErrors.timeoutSeconds?"true":"false"}
                          aria-describedby=${it(e.fieldErrors.timeoutSeconds?we("timeoutSeconds"):void 0)}
                          @input=${k=>e.onFormChange({timeoutSeconds:k.target.value})}
                        />
                        <div class="cron-help">
                          Optional. Leave blank to use the gateway default timeout behavior for this run.
                        </div>
                        ${ft(e.fieldErrors.timeoutSeconds,we("timeoutSeconds"))}
                      </label>
                    `:m}
            </div>
            <label class="field cron-span-2">
              ${ye(e.form.payloadKind==="systemEvent"?"Main timeline message":"Assistant task prompt",!0)}
              <textarea
                id="cron-payload-text"
                .value=${e.form.payloadText}
                aria-invalid=${e.fieldErrors.payloadText?"true":"false"}
                aria-describedby=${it(e.fieldErrors.payloadText?we("payloadText"):void 0)}
                @input=${k=>e.onFormChange({payloadText:k.target.value})}
                rows="4"
              ></textarea>
              ${ft(e.fieldErrors.payloadText,we("payloadText"))}
            </label>
          </section>

          <section class="cron-form-section">
            <div class="cron-form-section__title">Delivery</div>
            <div class="cron-form-section__sub">Choose where run summaries are sent.</div>
            <div class="form-grid cron-form-grid">
              <label class="field ${h==="none"?"cron-span-2":""}">
                ${ye("Result delivery")}
                <select
                  id="cron-delivery-mode"
                  .value=${h}
                  @change=${k=>e.onFormChange({deliveryMode:k.target.value})}
                >
                  ${f?c`
                          <option value="announce">Announce summary (default)</option>
                        `:m}
                  <option value="webhook">Webhook POST</option>
                  <option value="none">None (internal)</option>
                </select>
                <div class="cron-help">Announce posts a summary to chat. None keeps execution internal.</div>
              </label>
              ${h!=="none"?c`
                      <label class="field ${h==="webhook"?"cron-span-2":""}">
                        ${ye(h==="webhook"?"Webhook URL":"Channel",h==="webhook")}
                        ${h==="webhook"?c`
                                <input
                                  id="cron-delivery-to"
                                  .value=${e.form.deliveryTo}
                                  list="cron-delivery-to-suggestions"
                                  aria-invalid=${e.fieldErrors.deliveryTo?"true":"false"}
                                  aria-describedby=${it(e.fieldErrors.deliveryTo?we("deliveryTo"):void 0)}
                                  @input=${k=>e.onFormChange({deliveryTo:k.target.value})}
                                  placeholder="https://example.com/cron"
                                />
                              `:c`
                                <select
                                  id="cron-delivery-channel"
                                  .value=${e.form.deliveryChannel||"last"}
                                  @change=${k=>e.onFormChange({deliveryChannel:k.target.value})}
                                >
                                  ${i.map(k=>c`<option value=${k}>
                                        ${h0(e,k)}
                                      </option>`)}
                                </select>
                              `}
                        ${h==="announce"?c`
                                <div class="cron-help">Choose which connected channel receives the summary.</div>
                              `:c`
                                <div class="cron-help">Send run summaries to a webhook endpoint.</div>
                              `}
                      </label>
                      ${h==="announce"?c`
                              <label class="field cron-span-2">
                                ${ye("To")}
                                <input
                                  id="cron-delivery-to"
                                  .value=${e.form.deliveryTo}
                                  list="cron-delivery-to-suggestions"
                                  @input=${k=>e.onFormChange({deliveryTo:k.target.value})}
                                  placeholder="+1555... or chat id"
                                />
                                <div class="cron-help">Optional recipient override (chat id, phone, or user id).</div>
                              </label>
                            `:m}
                      ${h==="webhook"?ft(e.fieldErrors.deliveryTo,we("deliveryTo")):m}
                    `:m}
            </div>
          </section>

          <details class="cron-advanced">
            <summary class="cron-advanced__summary">Advanced</summary>
            <div class="cron-help">
              Optional overrides for delivery guarantees, schedule jitter, and model controls.
            </div>
            <div class="form-grid cron-form-grid">
              <label class="field checkbox cron-checkbox">
                <input
                  type="checkbox"
                  .checked=${e.form.deleteAfterRun}
                  @change=${k=>e.onFormChange({deleteAfterRun:k.target.checked})}
                />
                <span class="field-checkbox__label">Delete after run</span>
                <div class="cron-help">Best for one-shot reminders that should auto-clean up.</div>
              </label>
              <label class="field checkbox cron-checkbox">
                <input
                  type="checkbox"
                  .checked=${e.form.clearAgent}
                  @change=${k=>e.onFormChange({clearAgent:k.target.checked})}
                />
                <span class="field-checkbox__label">Clear agent override</span>
                <div class="cron-help">Force this job to use the gateway default assistant.</div>
              </label>
              ${s?c`
                      <label class="field checkbox cron-checkbox cron-span-2">
                        <input
                          type="checkbox"
                          .checked=${e.form.scheduleExact}
                          @change=${k=>e.onFormChange({scheduleExact:k.target.checked})}
                        />
                        <span class="field-checkbox__label">Exact timing (no stagger)</span>
                        <div class="cron-help">Run on exact cron boundaries with no spread.</div>
                      </label>
                      <div class="cron-stagger-group cron-span-2">
                        <label class="field">
                          ${ye("Stagger window")}
                          <input
                            id="cron-stagger-amount"
                            .value=${e.form.staggerAmount}
                            ?disabled=${e.form.scheduleExact}
                            aria-invalid=${e.fieldErrors.staggerAmount?"true":"false"}
                            aria-describedby=${it(e.fieldErrors.staggerAmount?we("staggerAmount"):void 0)}
                            @input=${k=>e.onFormChange({staggerAmount:k.target.value})}
                            placeholder="30"
                          />
                          ${ft(e.fieldErrors.staggerAmount,we("staggerAmount"))}
                        </label>
                        <label class="field">
                          <span>Stagger unit</span>
                          <select
                            .value=${e.form.staggerUnit}
                            ?disabled=${e.form.scheduleExact}
                            @change=${k=>e.onFormChange({staggerUnit:k.target.value})}
                          >
                            <option value="seconds">Seconds</option>
                            <option value="minutes">Minutes</option>
                          </select>
                        </label>
                      </div>
                    `:m}
              ${n?c`
                      <label class="field">
                        ${ye("Model")}
                        <input
                          id="cron-payload-model"
                          .value=${e.form.payloadModel}
                          list="cron-model-suggestions"
                          @input=${k=>e.onFormChange({payloadModel:k.target.value})}
                          placeholder="openai/gpt-5.2"
                        />
                        <div class="cron-help">
                          Start typing to pick a known model, or enter a custom one.
                        </div>
                      </label>
                      <label class="field">
                        ${ye("Thinking")}
                        <input
                          id="cron-payload-thinking"
                          .value=${e.form.payloadThinking}
                          list="cron-thinking-suggestions"
                          @input=${k=>e.onFormChange({payloadThinking:k.target.value})}
                          placeholder="low"
                        />
                        <div class="cron-help">Use a suggested level or enter a provider-specific value.</div>
                      </label>
                    `:m}
              ${h!=="none"?c`
                      <label class="field checkbox cron-checkbox cron-span-2">
                        <input
                          type="checkbox"
                          .checked=${e.form.deliveryBestEffort}
                          @change=${k=>e.onFormChange({deliveryBestEffort:k.target.checked})}
                        />
                        <span class="field-checkbox__label">Best effort delivery</span>
                        <div class="cron-help">Do not fail the job if delivery itself fails.</div>
                      </label>
                    `:m}
            </div>
          </details>
        </div>
        ${b?c`
                <div class="cron-form-status" role="status" aria-live="polite">
                  <div class="cron-form-status__title">Can't add job yet</div>
                  <div class="cron-help">Fill the required fields below to enable submit.</div>
                  <ul class="cron-form-status__list">
                    ${v.map(k=>c`
                        <li>
                          <button
                            type="button"
                            class="cron-form-status__link"
                            @click=${()=>y0(k.inputId)}
                          >
                            ${k.label}: ${k.message}
                          </button>
                        </li>
                      `)}
                  </ul>
                </div>
              `:m}
        <div class="row cron-form-actions">
          <button class="btn primary" ?disabled=${e.busy||!e.canSubmit} @click=${e.onAdd}>
            ${e.busy?"Saving...":t?"Save changes":"Add job"}
          </button>
          ${A?c`<div class="cron-submit-reason" aria-live="polite">${A}</div>`:m}
          ${t?c`
                  <button class="btn" ?disabled=${e.busy} @click=${e.onCancelEdit}>
                    Cancel
                  </button>
                `:m}
        </div>
      </section>
    </section>

    ${En("cron-agent-suggestions",e.agentSuggestions)}
    ${En("cron-model-suggestions",e.modelSuggestions)}
    ${En("cron-thinking-suggestions",e.thinkingSuggestions)}
    ${En("cron-tz-suggestions",e.timezoneSuggestions)}
    ${En("cron-delivery-to-suggestions",e.deliveryToSuggestions)}
  `}function $0(e){const t=e.form;return t.scheduleKind==="at"?c`
      <label class="field cron-span-2" style="margin-top: 12px;">
        ${ye("Run at",!0)}
        <input
          id="cron-schedule-at"
          type="datetime-local"
          .value=${t.scheduleAt}
          aria-invalid=${e.fieldErrors.scheduleAt?"true":"false"}
          aria-describedby=${it(e.fieldErrors.scheduleAt?we("scheduleAt"):void 0)}
          @input=${n=>e.onFormChange({scheduleAt:n.target.value})}
        />
        ${ft(e.fieldErrors.scheduleAt,we("scheduleAt"))}
      </label>
    `:t.scheduleKind==="every"?c`
      <div class="form-grid cron-form-grid" style="margin-top: 12px;">
        <label class="field">
          ${ye("Every",!0)}
          <input
            id="cron-every-amount"
            .value=${t.everyAmount}
            aria-invalid=${e.fieldErrors.everyAmount?"true":"false"}
            aria-describedby=${it(e.fieldErrors.everyAmount?we("everyAmount"):void 0)}
            @input=${n=>e.onFormChange({everyAmount:n.target.value})}
            placeholder="30"
          />
          ${ft(e.fieldErrors.everyAmount,we("everyAmount"))}
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
    `:c`
    <div class="form-grid cron-form-grid" style="margin-top: 12px;">
      <label class="field">
        ${ye("Expression",!0)}
        <input
          id="cron-cron-expr"
          .value=${t.cronExpr}
          aria-invalid=${e.fieldErrors.cronExpr?"true":"false"}
          aria-describedby=${it(e.fieldErrors.cronExpr?we("cronExpr"):void 0)}
          @input=${n=>e.onFormChange({cronExpr:n.target.value})}
          placeholder="0 7 * * *"
        />
        ${ft(e.fieldErrors.cronExpr,we("cronExpr"))}
      </label>
      <label class="field">
        <span>Timezone (optional)</span>
        <input
          .value=${t.cronTz}
          list="cron-tz-suggestions"
          @input=${n=>e.onFormChange({cronTz:n.target.value})}
          placeholder="America/Los_Angeles"
        />
        <div class="cron-help">Pick a common timezone or enter any valid IANA timezone.</div>
      </label>
      <div class="cron-help cron-span-2">Need jitter? Use Advanced → Stagger window / Stagger unit.</div>
    </div>
  `}function ft(e,t){return e?c`<div id=${it(t)} class="cron-help cron-error">${e}</div>`:m}function w0(e,t){const s=`list-item list-item-clickable cron-job${t.runsJobId===e.id?" list-item-selected":""}`,i=o=>{t.onLoadRuns(e.id),o()};return c`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${Rc(e)}</div>
        ${k0(e)}
        ${e.agentId?c`<div class="muted cron-job-agent">Agent: ${e.agentId}</div>`:m}
      </div>
      <div class="list-meta">
        ${A0(e)}
      </div>
      <div class="cron-job-footer">
        <div class="chip-row cron-job-chips">
          <span class=${`chip ${e.enabled?"chip-ok":"chip-danger"}`}>
            ${e.enabled?"enabled":"disabled"}
          </span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
        <div class="row cron-job-actions">
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${o=>{o.stopPropagation(),i(()=>t.onEdit(e))}}
          >
            Edit
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${o=>{o.stopPropagation(),i(()=>t.onClone(e))}}
          >
            Clone
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${o=>{o.stopPropagation(),i(()=>t.onToggle(e,!e.enabled))}}
          >
            ${e.enabled?"Disable":"Enable"}
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${o=>{o.stopPropagation(),i(()=>t.onRun(e))}}
          >
            Run
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${o=>{o.stopPropagation(),i(()=>t.onLoadRuns(e.id))}}
          >
            History
          </button>
          <button
            class="btn danger"
            ?disabled=${t.busy}
            @click=${o=>{o.stopPropagation(),i(()=>t.onRemove(e))}}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  `}function k0(e){if(e.payload.kind==="systemEvent")return c`<div class="cron-job-detail">
      <span class="cron-job-detail-label">System</span>
      <span class="muted cron-job-detail-value">${e.payload.text}</span>
    </div>`;const t=e.delivery,n=t?.mode==="webhook"?t.to?` (${t.to})`:"":t?.channel||t?.to?` (${t.channel??"last"}${t.to?` -> ${t.to}`:""})`:"";return c`
    <div class="cron-job-detail">
      <span class="cron-job-detail-label">Prompt</span>
      <span class="muted cron-job-detail-value">${e.payload.message}</span>
    </div>
    ${t?c`<div class="cron-job-detail">
            <span class="cron-job-detail-label">Delivery</span>
            <span class="muted cron-job-detail-value">${t.mode}${n}</span>
          </div>`:m}
  `}function tl(e){return typeof e!="number"||!Number.isFinite(e)?"n/a":se(e)}function S0(e,t=Date.now()){const n=se(e);return e>t?`Next ${n}`:`Due ${n}`}function A0(e){const t=e.state?.lastStatus??"n/a",n=t==="ok"?"cron-job-status-ok":t==="error"?"cron-job-status-error":t==="skipped"?"cron-job-status-skipped":"cron-job-status-na",s=e.state?.nextRunAtMs,i=e.state?.lastRunAtMs;return c`
    <div class="cron-job-state">
      <div class="cron-job-state-row">
        <span class="cron-job-state-key">Status</span>
        <span class=${`cron-job-status-pill ${n}`}>${t}</span>
      </div>
      <div class="cron-job-state-row">
        <span class="cron-job-state-key">Next</span>
        <span class="cron-job-state-value" title=${kt(s)}>
          ${tl(s)}
        </span>
      </div>
      <div class="cron-job-state-row">
        <span class="cron-job-state-key">Last</span>
        <span class="cron-job-state-value" title=${kt(i)}>
          ${tl(i)}
        </span>
      </div>
    </div>
  `}function C0(e,t){const n=typeof e.sessionKey=="string"&&e.sessionKey.trim().length>0?`${Ks("chat",t)}?session=${encodeURIComponent(e.sessionKey)}`:null,s=e.status??"unknown",i=e.deliveryStatus??"not-requested",o=e.usage,a=o&&typeof o.total_tokens=="number"?`${o.total_tokens} tokens`:o&&typeof o.input_tokens=="number"&&typeof o.output_tokens=="number"?`${o.input_tokens} in / ${o.output_tokens} out`:null;return c`
    <div class="list-item cron-run-entry">
      <div class="list-main cron-run-entry__main">
        <div class="list-title cron-run-entry__title">
          ${e.jobName??e.jobId}
          <span class="muted"> · ${s}</span>
        </div>
        <div class="list-sub cron-run-entry__summary">${e.summary??e.error??"No summary."}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${i}</span>
          ${e.model?c`<span class="chip">${e.model}</span>`:m}
          ${e.provider?c`<span class="chip">${e.provider}</span>`:m}
          ${a?c`<span class="chip">${a}</span>`:m}
        </div>
      </div>
      <div class="list-meta cron-run-entry__meta">
        <div>${kt(e.ts)}</div>
        ${typeof e.runAtMs=="number"?c`<div class="muted">Run at ${kt(e.runAtMs)}</div>`:m}
        <div class="muted">${e.durationMs??0}ms</div>
        ${typeof e.nextRunAtMs=="number"?c`<div class="muted">${S0(e.nextRunAtMs)}</div>`:m}
        ${n?c`<div><a class="session-link" href=${n}>Open run chat</a></div>`:m}
        ${e.error?c`<div class="muted">${e.error}</div>`:m}
        ${e.deliveryError?c`<div class="muted">${e.deliveryError}</div>`:m}
      </div>
    </div>
  `}function T0(e){const n=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=n?.critical??0,i=n?.warn??0,o=n?.info??0,a=s>0?"danger":i>0?"warn":"success",r=s>0?`${s} critical`:i>0?`${i} warnings`:"No critical issues";return c`
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
            ${n?c`<div class="callout ${a}" style="margin-top: 8px;">
                  Security audit: ${r}${o>0?` · ${o} info`:""}. Run
                  <span class="mono">openclaw security audit --deep</span> for details.
                </div>`:m}
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
              @input=${l=>e.onCallMethodChange(l.target.value)}
              placeholder="system-presence"
            />
          </label>
          <label class="field">
            <span>Params (JSON)</span>
            <textarea
              .value=${e.callParams}
              @input=${l=>e.onCallParamsChange(l.target.value)}
              rows="6"
            ></textarea>
          </label>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn primary" @click=${e.onCall}>Call</button>
        </div>
        ${e.callError?c`<div class="callout danger" style="margin-top: 12px;">
              ${e.callError}
            </div>`:m}
        ${e.callResult?c`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:m}
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
      ${e.eventLog.length===0?c`
              <div class="muted" style="margin-top: 12px">No events yet.</div>
            `:c`
            <div class="list" style="margin-top: 12px;">
              ${e.eventLog.map(l=>c`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${l.event}</div>
                      <div class="list-sub">${new Date(l.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta">
                      <pre class="code-block">${em(l.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function _0(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function Pt(e,t){return t?c`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:m}function E0(e){const t=e.execApprovalQueue[0];if(!t)return m;const n=t.request,s=t.expiresAtMs-Date.now(),i=s>0?`expires in ${_0(s)}`:"expired",o=e.execApprovalQueue.length;return c`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
          ${o>1?c`<div class="exec-approval-queue">${o} pending</div>`:m}
        </div>
        <div class="exec-approval-command mono">${n.command}</div>
        <div class="exec-approval-meta">
          ${Pt("Host",n.host)}
          ${Pt("Agent",n.agentId)}
          ${Pt("Session",n.sessionKey)}
          ${Pt("CWD",n.cwd)}
          ${Pt("Resolved",n.resolvedPath)}
          ${Pt("Security",n.security)}
          ${Pt("Ask",n.ask)}
        </div>
        ${e.execApprovalError?c`<div class="exec-approval-error">${e.execApprovalError}</div>`:m}
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
  `}function R0(e){const{pendingGatewayUrl:t}=e;return t?c`
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
  `:m}function I0(e){return c`
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
      ${e.lastError?c`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:m}
      ${e.statusMessage?c`<div class="callout" style="margin-top: 12px;">
            ${e.statusMessage}
          </div>`:m}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?c`
                <div class="muted">No instances reported yet.</div>
              `:e.entries.map(t=>L0(t))}
      </div>
    </section>
  `}function L0(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],i=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],o=i.length>0?i.length>3?`${i.length} scopes`:`scopes: ${i.join(", ")}`:null;return c`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${Yh(e)}</div>
        <div class="chip-row">
          <span class="chip">${n}</span>
          ${s.map(a=>c`<span class="chip">${a}</span>`)}
          ${o?c`<span class="chip">${o}</span>`:m}
          ${e.platform?c`<span class="chip">${e.platform}</span>`:m}
          ${e.deviceFamily?c`<span class="chip">${e.deviceFamily}</span>`:m}
          ${e.modelIdentifier?c`<span class="chip">${e.modelIdentifier}</span>`:m}
          ${e.version?c`<span class="chip">${e.version}</span>`:m}
        </div>
      </div>
      <div class="list-meta">
        <div>${Xh(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}const nl=["trace","debug","info","warn","error","fatal"];function M0(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function D0(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function P0(e){const t=e.filterText.trim().toLowerCase(),n=nl.some(o=>!e.levelFilters[o]),s=e.entries.filter(o=>o.level&&!e.levelFilters[o.level]?!1:D0(o,t)),i=t||n?"filtered":"visible";return c`
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
            @click=${()=>e.onExport(s.map(o=>o.raw),i)}
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
            @input=${o=>e.onFilterTextChange(o.target.value)}
            placeholder="Search logs"
          />
        </label>
        <label class="field checkbox">
          <span>Auto-follow</span>
          <input
            type="checkbox"
            .checked=${e.autoFollow}
            @change=${o=>e.onToggleAutoFollow(o.target.checked)}
          />
        </label>
      </div>

      <div class="chip-row" style="margin-top: 12px;">
        ${nl.map(o=>c`
            <label class="chip log-chip ${o}">
              <input
                type="checkbox"
                .checked=${e.levelFilters[o]}
                @change=${a=>e.onLevelToggle(o,a.target.checked)}
              />
              <span>${o}</span>
            </label>
          `)}
      </div>

      ${e.file?c`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:m}
      ${e.truncated?c`
              <div class="callout" style="margin-top: 10px">Log output truncated; showing latest chunk.</div>
            `:m}
      ${e.error?c`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:m}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${s.length===0?c`
                <div class="muted" style="padding: 12px">No log entries.</div>
              `:s.map(o=>c`
                <div class="log-row">
                  <div class="log-time mono">${M0(o.time)}</div>
                  <div class="log-level ${o.level??""}">${o.level??""}</div>
                  <div class="log-subsystem mono">${o.subsystem??""}</div>
                  <div class="log-message mono">${o.message??o.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}const $t="__defaults__",sl=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],F0=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function il(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function N0(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function O0(e){const t=e?.defaults??{};return{security:il(t.security),ask:N0(t.ask),askFallback:il(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function U0(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(i=>{if(!i||typeof i!="object")return;const o=i,a=typeof o.id=="string"?o.id.trim():"";if(!a)return;const r=typeof o.name=="string"?o.name.trim():void 0,l=o.default===!0;s.push({id:a,name:r||void 0,isDefault:l})}),s}function B0(e,t){const n=U0(e),s=Object.keys(t?.agents??{}),i=new Map;n.forEach(a=>i.set(a.id,a)),s.forEach(a=>{i.has(a)||i.set(a,{id:a})});const o=Array.from(i.values());return o.length===0&&o.push({id:"main",isDefault:!0}),o.sort((a,r)=>{if(a.isDefault&&!r.isDefault)return-1;if(!a.isDefault&&r.isDefault)return 1;const l=a.name?.trim()?a.name:a.id,d=r.name?.trim()?r.name:r.id;return l.localeCompare(d)}),o}function H0(e,t){return e===$t?$t:e&&t.some(n=>n.id===e)?e:$t}function z0(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=O0(t),i=B0(e.configForm,t),o=J0(e.nodes),a=e.execApprovalsTarget;let r=a==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;a==="node"&&r&&!o.some(g=>g.id===r)&&(r=null);const l=H0(e.execApprovalsSelectedAgent,i),d=l!==$t?(t?.agents??{})[l]??null:null,u=Array.isArray(d?.allowlist)?d.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:l,selectedAgent:d,agents:i,allowlist:u,target:a,targetNodeId:r,targetNodes:o,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function K0(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return c`
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

      ${j0(e)}

      ${t?c`
            ${W0(e)}
            ${q0(e)}
            ${e.selectedScope===$t?m:G0(e)}
          `:c`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function j0(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return c`
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
              @change=${s=>{if(s.target.value==="node"){const a=e.targetNodes[0]?.id??null;e.onSelectTarget("node",n||a)}else e.onSelectTarget("gateway",null)}}
            >
              <option value="gateway" ?selected=${e.target==="gateway"}>Gateway</option>
              <option value="node" ?selected=${e.target==="node"}>Node</option>
            </select>
          </label>
          ${e.target==="node"?c`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${e.disabled||!t}
                    @change=${s=>{const o=s.target.value.trim();e.onSelectTarget("node",o||null)}}
                  >
                    <option value="" ?selected=${n===""}>Select node</option>
                    ${e.targetNodes.map(s=>c`<option
                          value=${s.id}
                          ?selected=${n===s.id}
                        >
                          ${s.label}
                        </option>`)}
                  </select>
                </label>
              `:m}
        </div>
      </div>
      ${e.target==="node"&&!t?c`
              <div class="muted">No nodes advertise exec approvals yet.</div>
            `:m}
    </div>
  `}function W0(e){return c`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===$t?"active":""}"
          @click=${()=>e.onSelectScope($t)}
        >
          Defaults
        </button>
        ${e.agents.map(t=>{const n=t.name?.trim()?`${t.name} (${t.id})`:t.id;return c`
            <button
              class="btn btn--sm ${e.selectedScope===t.id?"active":""}"
              @click=${()=>e.onSelectScope(t.id)}
            >
              ${n}
            </button>
          `})}
      </div>
    </div>
  `}function q0(e){const t=e.selectedScope===$t,n=e.defaults,s=e.selectedAgent??{},i=t?["defaults"]:["agents",e.selectedScope],o=typeof s.security=="string"?s.security:void 0,a=typeof s.ask=="string"?s.ask:void 0,r=typeof s.askFallback=="string"?s.askFallback:void 0,l=t?n.security:o??"__default__",d=t?n.ask:a??"__default__",u=t?n.askFallback:r??"__default__",g=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,f=g??n.autoAllowSkills,h=g==null;return c`
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
              @change=${v=>{const A=v.target.value;!t&&A==="__default__"?e.onRemove([...i,"security"]):e.onPatch([...i,"security"],A)}}
            >
              ${t?m:c`<option value="__default__" ?selected=${l==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${sl.map(v=>c`<option
                    value=${v.value}
                    ?selected=${l===v.value}
                  >
                    ${v.label}
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
              @change=${v=>{const A=v.target.value;!t&&A==="__default__"?e.onRemove([...i,"ask"]):e.onPatch([...i,"ask"],A)}}
            >
              ${t?m:c`<option value="__default__" ?selected=${d==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${F0.map(v=>c`<option
                    value=${v.value}
                    ?selected=${d===v.value}
                  >
                    ${v.label}
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
              @change=${v=>{const A=v.target.value;!t&&A==="__default__"?e.onRemove([...i,"askFallback"]):e.onPatch([...i,"askFallback"],A)}}
            >
              ${t?m:c`<option value="__default__" ?selected=${u==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${sl.map(v=>c`<option
                    value=${v.value}
                    ?selected=${u===v.value}
                  >
                    ${v.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${t?"Allow skill executables listed by the Gateway.":h?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${f?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${f}
              @change=${v=>{const b=v.target;e.onPatch([...i,"autoAllowSkills"],b.checked)}}
            />
          </label>
          ${!t&&!h?c`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,"autoAllowSkills"])}
              >
                Use default
              </button>`:m}
        </div>
      </div>
    </div>
  `}function G0(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return c`
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
      ${n.length===0?c`
              <div class="muted">No allowlist entries yet.</div>
            `:n.map((s,i)=>V0(e,s,i))}
    </div>
  `}function V0(e,t,n){const s=t.lastUsedAt?se(t.lastUsedAt):"never",i=t.lastUsedCommand?Ni(t.lastUsedCommand,120):null,o=t.lastResolvedPath?Ni(t.lastResolvedPath,120):null;return c`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${i?c`<div class="list-sub mono">${i}</div>`:m}
        ${o?c`<div class="list-sub mono">${o}</div>`:m}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${t.pattern??""}
            ?disabled=${e.disabled}
            @input=${a=>{const r=a.target;e.onPatch(["agents",e.selectedScope,"allowlist",n,"pattern"],r.value)}}
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
  `}function J0(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(r=>String(r)==="system.execApprovals.get"||String(r)==="system.execApprovals.set"))continue;const o=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!o)continue;const a=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():o;t.push({id:o,label:a===o?o:`${a} · ${o}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function Q0(e){const t=tx(e),n=z0(e);return c`
    ${K0(n)}
    ${nx(t)}
    ${Y0(e)}
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
        ${e.nodes.length===0?c`
                <div class="muted">No nodes found.</div>
              `:e.nodes.map(s=>ax(s))}
      </div>
    </section>
  `}function Y0(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return c`
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
      ${e.devicesError?c`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:m}
      <div class="list" style="margin-top: 16px;">
        ${n.length>0?c`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${n.map(i=>X0(i,e))}
            `:m}
        ${s.length>0?c`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(i=>Z0(i,e))}
            `:m}
        ${n.length===0&&s.length===0?c`
                <div class="muted">No paired devices.</div>
              `:m}
      </div>
    </section>
  `}function X0(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?se(e.ts):"n/a",i=e.role?.trim()?`role: ${e.role}`:"role: -",o=e.isRepair?" · repair":"",a=e.remoteIp?` · ${e.remoteIp}`:"";return c`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${a}</div>
        <div class="muted" style="margin-top: 6px;">
          ${i} · requested ${s}${o}
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
  `}function Z0(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",i=`roles: ${Fi(e.roles)}`,o=`scopes: ${Fi(e.scopes)}`,a=Array.isArray(e.tokens)?e.tokens:[];return c`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${s}</div>
        <div class="muted" style="margin-top: 6px;">${i} · ${o}</div>
        ${a.length===0?c`
                <div class="muted" style="margin-top: 6px">Tokens: none</div>
              `:c`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${a.map(r=>ex(e.deviceId,r,t))}
              </div>
            `}
      </div>
    </div>
  `}function ex(e,t,n){const s=t.revokedAtMs?"revoked":"active",i=`scopes: ${Fi(t.scopes)}`,o=se(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return c`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${i} · ${o}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          Rotate
        </button>
        ${t.revokedAtMs?m:c`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e,t.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}function tx(e){const t=e.configForm,n=ix(e.nodes),{defaultBinding:s,agents:i}=ox(t),o=!!t,a=e.configSaving||e.configFormMode==="raw";return{ready:o,disabled:a,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function nx(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return c`
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

      ${e.formMode==="raw"?c`
              <div class="callout warn" style="margin-top: 12px">
                Switch the Config tab to <strong>Form</strong> mode to edit bindings here.
              </div>
            `:m}

      ${e.ready?c`
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
                      @change=${s=>{const o=s.target.value.trim();e.onBindDefault(o||null)}}
                    >
                      <option value="" ?selected=${n===""}>Any node</option>
                      ${e.nodes.map(s=>c`<option
                            value=${s.id}
                            ?selected=${n===s.id}
                          >
                            ${s.label}
                          </option>`)}
                    </select>
                  </label>
                  ${t?m:c`
                          <div class="muted">No nodes with system.run available.</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?c`
                      <div class="muted">No agents found.</div>
                    `:e.agents.map(s=>sx(s,e))}
            </div>
          `:c`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function sx(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,i=t.nodes.length>0;return c`
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
            @change=${o=>{const r=o.target.value.trim();t.onBindAgent(e.index,r==="__default__"?null:r)}}
          >
            <option value="__default__" ?selected=${n==="__default__"}>
              Use default
            </option>
            ${t.nodes.map(o=>c`<option
                  value=${o.id}
                  ?selected=${n===o.id}
                >
                  ${o.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function ix(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(r=>String(r)==="system.run"))continue;const o=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!o)continue;const a=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():o;t.push({id:o,label:a===o?o:`${a} · ${o}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function ox(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},i=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,o=e.agents??{},a=Array.isArray(o.list)?o.list:[];if(a.length===0)return{defaultBinding:i,agents:[t]};const r=[];return a.forEach((l,d)=>{if(!l||typeof l!="object")return;const u=l,g=typeof u.id=="string"?u.id.trim():"";if(!g)return;const f=typeof u.name=="string"?u.name.trim():void 0,h=u.default===!0,b=(u.tools??{}).exec??{},A=typeof b.node=="string"&&b.node.trim()?b.node.trim():null;r.push({id:g,name:f||void 0,index:d,isDefault:h,binding:A})}),r.length===0&&r.push(t),{defaultBinding:i,agents:r}}function ax(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),i=Array.isArray(e.caps)?e.caps:[],o=Array.isArray(e.commands)?e.commands:[];return c`
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
          ${i.slice(0,12).map(a=>c`<span class="chip">${String(a)}</span>`)}
          ${o.slice(0,8).map(a=>c`<span class="chip">${String(a)}</span>`)}
        </div>
      </div>
    </div>
  `}function rx(e,t,n){return e||!t?!1:n===be.PAIRING_REQUIRED?!0:t.toLowerCase().includes("pairing required")}function lx(e){const t=e.hello?.snapshot,n=t?.uptimeMs?So(t.uptimeMs):F("common.na"),s=t?.policy?.tickIntervalMs?`${t.policy.tickIntervalMs}ms`:F("common.na"),o=t?.authMode==="trusted-proxy",a=rx(e.connected,e.lastError,e.lastErrorCode)?c`
      <div class="muted" style="margin-top: 8px">
        ${F("overview.pairing.hint")}
        <div style="margin-top: 6px">
          <span class="mono">openclaw devices list</span><br />
          <span class="mono">openclaw devices approve &lt;requestId&gt;</span>
        </div>
        <div style="margin-top: 6px; font-size: 12px;">
          ${F("overview.pairing.mobileHint")}
        </div>
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.ai/web/control-ui#device-pairing-first-connection"
            target="_blank"
            rel="noreferrer"
            title="Device pairing docs (opens in new tab)"
            >Docs: Device pairing</a
          >
        </div>
      </div>
    `:null,r=(()=>{if(e.connected||!e.lastError)return null;const u=e.lastError.toLowerCase(),g=new Set([be.AUTH_REQUIRED,be.AUTH_TOKEN_MISSING,be.AUTH_PASSWORD_MISSING,be.AUTH_TOKEN_NOT_CONFIGURED,be.AUTH_PASSWORD_NOT_CONFIGURED]),f=new Set([...g,be.AUTH_UNAUTHORIZED,be.AUTH_TOKEN_MISMATCH,be.AUTH_PASSWORD_MISMATCH,be.AUTH_DEVICE_TOKEN_MISMATCH,be.AUTH_RATE_LIMITED,be.AUTH_TAILSCALE_IDENTITY_MISSING,be.AUTH_TAILSCALE_PROXY_MISSING,be.AUTH_TAILSCALE_WHOIS_FAILED,be.AUTH_TAILSCALE_IDENTITY_MISMATCH]);if(!(e.lastErrorCode?f.has(e.lastErrorCode):u.includes("unauthorized")||u.includes("connect failed")))return null;const v=!!e.settings.token.trim(),b=!!e.password.trim();return(e.lastErrorCode?g.has(e.lastErrorCode):!v&&!b)?c`
        <div class="muted" style="margin-top: 8px">
          ${F("overview.auth.required")}
          <div style="margin-top: 6px">
            <span class="mono">openclaw dashboard --no-open</span> → tokenized URL<br />
            <span class="mono">openclaw doctor --generate-gateway-token</span> → set token
          </div>
          <div style="margin-top: 6px">
            <a
              class="session-link"
              href="https://docs.openclaw.ai/web/dashboard"
              target="_blank"
              rel="noreferrer"
              title="Control UI auth docs (opens in new tab)"
              >Docs: Control UI auth</a
            >
          </div>
        </div>
      `:c`
      <div class="muted" style="margin-top: 8px">
        ${F("overview.auth.failed",{command:"openclaw dashboard --no-open"})}
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.ai/web/dashboard"
            target="_blank"
            rel="noreferrer"
            title="Control UI auth docs (opens in new tab)"
            >Docs: Control UI auth</a
          >
        </div>
      </div>
    `})(),l=(()=>{if(e.connected||!e.lastError||(typeof window<"u"?window.isSecureContext:!0))return null;const g=e.lastError.toLowerCase();return!(e.lastErrorCode===be.CONTROL_UI_DEVICE_IDENTITY_REQUIRED||e.lastErrorCode===be.DEVICE_IDENTITY_REQUIRED)&&!g.includes("secure context")&&!g.includes("device identity required")?null:c`
      <div class="muted" style="margin-top: 8px">
        ${F("overview.insecure.hint",{url:"http://127.0.0.1:18789"})}
        <div style="margin-top: 6px">
          ${F("overview.insecure.stayHttp",{config:"gateway.controlUi.allowInsecureAuth: true"})}
        </div>
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.ai/gateway/tailscale"
            target="_blank"
            rel="noreferrer"
            title="Tailscale Serve docs (opens in new tab)"
            >Docs: Tailscale Serve</a
          >
          <span class="muted"> · </span>
          <a
            class="session-link"
            href="https://docs.openclaw.ai/web/control-ui#insecure-http"
            target="_blank"
            rel="noreferrer"
            title="Insecure HTTP docs (opens in new tab)"
            >Docs: Insecure HTTP</a
          >
        </div>
      </div>
    `})(),d=Bn.getLocale();return c`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">${F("overview.access.title")}</div>
        <div class="card-sub">${F("overview.access.subtitle")}</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>${F("overview.access.wsUrl")}</span>
            <input
              .value=${e.settings.gatewayUrl}
              @input=${u=>{const g=u.target.value;e.onSettingsChange({...e.settings,gatewayUrl:g})}}
              placeholder="ws://100.x.y.z:18789"
            />
          </label>
          ${o?"":c`
                <label class="field">
                  <span>${F("overview.access.token")}</span>
                  <input
                    .value=${e.settings.token}
                    @input=${u=>{const g=u.target.value;e.onSettingsChange({...e.settings,token:g})}}
                    placeholder="OPENCLAW_GATEWAY_TOKEN"
                  />
                </label>
                <label class="field">
                  <span>${F("overview.access.password")}</span>
                  <input
                    type="password"
                    .value=${e.password}
                    @input=${u=>{const g=u.target.value;e.onPasswordChange(g)}}
                    placeholder="system or shared password"
                  />
                </label>
              `}
          <label class="field">
            <span>${F("overview.access.sessionKey")}</span>
            <input
              .value=${e.settings.sessionKey}
              @input=${u=>{const g=u.target.value;e.onSessionKeyChange(g)}}
            />
          </label>
          <label class="field">
            <span>${F("overview.access.language")}</span>
            <select
              .value=${d}
              @change=${u=>{const g=u.target.value;Bn.setLocale(g),e.onSettingsChange({...e.settings,locale:g})}}
            >
              <option value="en">${F("languages.en")}</option>
              <option value="zh-CN">${F("languages.zhCN")}</option>
              <option value="zh-TW">${F("languages.zhTW")}</option>
              <option value="pt-BR">${F("languages.ptBR")}</option>
            </select>
          </label>
        </div>
        <div class="row" style="margin-top: 14px;">
          <button class="btn" @click=${()=>e.onConnect()}>${F("common.connect")}</button>
          <button class="btn" @click=${()=>e.onRefresh()}>${F("common.refresh")}</button>
          <span class="muted">${F(o?"overview.access.trustedProxy":"overview.access.connectHint")}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">${F("overview.snapshot.title")}</div>
        <div class="card-sub">${F("overview.snapshot.subtitle")}</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">${F("overview.snapshot.status")}</div>
            <div class="stat-value ${e.connected?"ok":"warn"}">
              ${e.connected?F("common.ok"):F("common.offline")}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">${F("overview.snapshot.uptime")}</div>
            <div class="stat-value">${n}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${F("overview.snapshot.tickInterval")}</div>
            <div class="stat-value">${s}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${F("overview.snapshot.lastChannelsRefresh")}</div>
            <div class="stat-value">
              ${e.lastChannelsRefresh?se(e.lastChannelsRefresh):F("common.na")}
            </div>
          </div>
        </div>
        ${e.lastError?c`<div class="callout danger" style="margin-top: 14px;">
              <div>${e.lastError}</div>
              ${a??""}
              ${r??""}
              ${l??""}
            </div>`:c`
                <div class="callout" style="margin-top: 14px">
                  ${F("overview.snapshot.channelsHint")}
                </div>
              `}
      </div>
    </section>

    <section class="grid grid-cols-3" style="margin-top: 18px;">
      <div class="card stat-card">
        <div class="stat-label">${F("overview.stats.instances")}</div>
        <div class="stat-value">${e.presenceCount}</div>
        <div class="muted">${F("overview.stats.instancesHint")}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${F("overview.stats.sessions")}</div>
        <div class="stat-value">${e.sessionsCount??F("common.na")}</div>
        <div class="muted">${F("overview.stats.sessionsHint")}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${F("overview.stats.cron")}</div>
        <div class="stat-value">
          ${e.cronEnabled==null?F("common.na"):e.cronEnabled?F("common.enabled"):F("common.disabled")}
        </div>
        <div class="muted">${F("overview.stats.cronNext",{time:jo(e.cronNext)})}</div>
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">${F("overview.notes.title")}</div>
      <div class="card-sub">${F("overview.notes.subtitle")}</div>
      <div class="note-grid" style="margin-top: 14px;">
        <div>
          <div class="note-title">${F("overview.notes.tailscaleTitle")}</div>
          <div class="muted">
            ${F("overview.notes.tailscaleText")}
          </div>
        </div>
        <div>
          <div class="note-title">${F("overview.notes.sessionTitle")}</div>
          <div class="muted">${F("overview.notes.sessionText")}</div>
        </div>
        <div>
          <div class="note-title">${F("overview.notes.cronTitle")}</div>
          <div class="muted">${F("overview.notes.cronText")}</div>
        </div>
      </div>
    </section>
  `}const cx=["","off","minimal","low","medium","high","xhigh"],dx=["","off","on"],ux=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"},{value:"full",label:"full"}],gx=["","off","on","stream"];function px(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function vd(e){return px(e)==="zai"}function fx(e){return vd(e)?dx:cx}function ol(e,t){return t?e.includes(t)?[...e]:[...e,t]:[...e]}function hx(e,t){return t?e.some(n=>n.value===t)?[...e]:[...e,{value:t,label:`${t} (custom)`}]:[...e]}function mx(e,t){return!t||!e||e==="off"?e:"on"}function vx(e,t){return e?t&&e==="on"?"low":e:null}function bx(e){const t=e.result?.sessions??[];return c`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Sessions</div>
          <div class="card-sub">Active session keys and per-session overrides.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field">
          <span>Active within (minutes)</span>
          <input
            .value=${e.activeMinutes}
            @input=${n=>e.onFiltersChange({activeMinutes:n.target.value,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field">
          <span>Limit</span>
          <input
            .value=${e.limit}
            @input=${n=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:n.target.value,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include global</span>
          <input
            type="checkbox"
            .checked=${e.includeGlobal}
            @change=${n=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:n.target.checked,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include unknown</span>
          <input
            type="checkbox"
            .checked=${e.includeUnknown}
            @change=${n=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:n.target.checked})}
          />
        </label>
      </div>

      ${e.error?c`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:m}

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
        ${t.length===0?c`
                <div class="muted">No sessions found.</div>
              `:t.map(n=>yx(n,e.basePath,e.onPatch,e.onDelete,e.loading))}
      </div>
    </section>
  `}function yx(e,t,n,s,i){const o=e.updatedAt?se(e.updatedAt):"n/a",a=e.thinkingLevel??"",r=vd(e.modelProvider),l=mx(a,r),d=ol(fx(e.modelProvider),l),u=e.verboseLevel??"",g=hx(ux,u),f=e.reasoningLevel??"",h=ol(gx,f),v=typeof e.displayName=="string"&&e.displayName.trim().length>0?e.displayName.trim():null,b=typeof e.label=="string"?e.label.trim():"",A=!!(v&&v!==e.key&&v!==b),k=e.kind!=="global",T=k?`${Ks("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return c`
    <div class="table-row">
      <div class="mono session-key-cell">
        ${k?c`<a href=${T} class="session-link">${e.key}</a>`:e.key}
        ${A?c`<span class="muted session-key-display-name">${v}</span>`:m}
      </div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${i}
          placeholder="(optional)"
          @change=${S=>{const R=S.target.value.trim();n(e.key,{label:R||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${o}</div>
      <div>${Zh(e)}</div>
      <div>
        <select
          ?disabled=${i}
          @change=${S=>{const R=S.target.value;n(e.key,{thinkingLevel:vx(R,r)})}}
        >
          ${d.map(S=>c`<option value=${S} ?selected=${l===S}>
                ${S||"inherit"}
              </option>`)}
        </select>
      </div>
      <div>
        <select
          ?disabled=${i}
          @change=${S=>{const R=S.target.value;n(e.key,{verboseLevel:R||null})}}
        >
          ${g.map(S=>c`<option value=${S.value} ?selected=${u===S.value}>
                ${S.label}
              </option>`)}
        </select>
      </div>
      <div>
        <select
          ?disabled=${i}
          @change=${S=>{const R=S.target.value;n(e.key,{reasoningLevel:R||null})}}
        >
          ${h.map(S=>c`<option value=${S} ?selected=${f===S}>
                ${S||"inherit"}
              </option>`)}
        </select>
      </div>
      <div>
        <button class="btn danger" ?disabled=${i} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function xx(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(o=>[o.name,o.description,o.source].join(" ").toLowerCase().includes(n)):t,i=Mc(s);return c`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Skills</div>
          <div class="card-sub">Bundled, managed, and workspace skills.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${e.filter}
            @input=${o=>e.onFilterChange(o.target.value)}
            placeholder="Search skills"
          />
        </label>
        <div class="muted">${s.length} shown</div>
      </div>

      ${e.error?c`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:m}

      ${s.length===0?c`
              <div class="muted" style="margin-top: 16px">No skills found.</div>
            `:c`
            <div class="agent-skills-groups" style="margin-top: 16px;">
              ${i.map(o=>{const a=o.id==="workspace"||o.id==="built-in";return c`
                  <details class="agent-skills-group" ?open=${!a}>
                    <summary class="agent-skills-header">
                      <span>${o.label}</span>
                      <span class="muted">${o.skills.length}</span>
                    </summary>
                    <div class="list skills-grid">
                      ${o.skills.map(r=>$x(r,e))}
                    </div>
                  </details>
                `})}
            </div>
          `}
    </section>
  `}function $x(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",i=t.messages[e.skillKey]??null,o=e.install.length>0&&e.missing.bins.length>0,a=!!(e.bundled&&e.source!=="openclaw-bundled"),r=Dc(e),l=Pc(e);return c`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${Ni(e.description,140)}</div>
        ${Fc({skill:e,showBundledBadge:a})}
        ${r.length>0?c`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${r.join(", ")}
              </div>
            `:m}
        ${l.length>0?c`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${l.join(", ")}
              </div>
            `:m}
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
          ${o?c`<button
                class="btn"
                ?disabled=${n}
                @click=${()=>t.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${n?"Installing…":e.install[0].label}
              </button>`:m}
        </div>
        ${i?c`<div
              class="muted"
              style="margin-top: 8px; color: ${i.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${i.message}
            </div>`:m}
        ${e.primaryEnv?c`
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
            `:m}
      </div>
    </div>
  `}const wx=/^data:/i,kx=/^https?:\/\//i,Sx=["off","minimal","low","medium","high"],Ax=["UTC","America/Los_Angeles","America/Denver","America/Chicago","America/New_York","Europe/London","Europe/Berlin","Asia/Tokyo"];function Cx(e){return/^https?:\/\//i.test(e.trim())}function Mi(e){return typeof e=="string"?e.trim():""}function Tx(e){const t=new Set,n=[];for(const s of e){const i=s.trim();if(!i)continue;const o=i.toLowerCase();t.has(o)||(t.add(o),n.push(i))}return n}function _x(e){const t=e.agentsList?.agents??[],s=wl(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",o=t.find(r=>r.id===s)?.identity,a=o?.avatarUrl??o?.avatar;if(a)return wx.test(a)||kx.test(a)?a:o?.avatarUrl}function Ex(e){const t=typeof e.hello?.server?.version=="string"&&e.hello.server.version.trim()||e.updateAvailable?.currentVersion||F("common.na"),n=e.updateAvailable&&e.updateAvailable.latestVersion!==e.updateAvailable.currentVersion?e.updateAvailable:null,s=n?"warn":"ok",i=e.presenceEntries.length,o=e.sessionsResult?.count??null,a=e.cronStatus?.nextWakeAtMs??null,r=e.connected?null:F("chat.disconnected"),l=e.tab==="chat",d=l&&(e.settings.chatFocusMode||e.onboarding),u=e.onboarding?!1:e.settings.chatShowThinking,g=_x(e),f=e.chatAvatarUrl??g??null,h=e.configForm??e.configSnapshot?.config,v=fn(e.basePath??""),b=e.agentsSelectedId??e.agentsList?.defaultId??e.agentsList?.agents?.[0]?.id??null,A=Array.from(new Set([...e.agentsList?.agents?.map(p=>p.id.trim())??[],...e.cronJobs.map(p=>typeof p.agentId=="string"?p.agentId.trim():"").filter(Boolean)].filter(Boolean))).toSorted((p,_)=>p.localeCompare(_)),k=Array.from(new Set([...e.cronModelSuggestions,...e.cronJobs.map(p=>p.payload.kind!=="agentTurn"||typeof p.payload.model!="string"?"":p.payload.model.trim()).filter(Boolean)].filter(Boolean))).toSorted((p,_)=>p.localeCompare(_)),T=e.cronForm.deliveryChannel&&e.cronForm.deliveryChannel.trim()?e.cronForm.deliveryChannel.trim():"last",S=e.cronJobs.map(p=>Mi(p.delivery?.to)).filter(Boolean),R=(T==="last"?Object.values(e.channelsSnapshot?.channelAccounts??{}).flat():e.channelsSnapshot?.channelAccounts?.[T]??[]).flatMap(p=>[Mi(p.accountId),Mi(p.name)]).filter(Boolean),I=Tx([...S,...R]),C=e.cronForm.deliveryMode==="webhook"?I.filter(p=>Cx(p)):I;return c`
    <div class="shell ${l?"shell--chat":""} ${d?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?F("nav.expand"):F("nav.collapse")}"
            aria-label="${e.settings.navCollapsed?F("nav.expand"):F("nav.collapse")}"
          >
            <span class="nav-collapse-toggle__icon">${ce.menu}</span>
          </button>
          <div class="brand">
            <div class="brand-logo">
              <img src=${v?`${v}/favicon.svg`:"/favicon.svg"} alt="OpenClaw" />
            </div>
            <div class="brand-text">
              <div class="brand-title">OPENCLAW</div>
              <div class="brand-sub">Gateway Dashboard</div>
            </div>
          </div>
        </div>
        <div class="topbar-status">
          <div class="pill">
            <span class="statusDot ${s}"></span>
            <span>${F("common.version")}</span>
            <span class="mono">${t}</span>
          </div>
          <div class="pill">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>${F("common.health")}</span>
            <span class="mono">${e.connected?F("common.ok"):F("common.offline")}</span>
          </div>
          ${Wh(e)}
        </div>
      </header>
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">
        ${Yg.map(p=>{const _=e.settings.navGroupsCollapsed[p.label]??!1,P=p.tabs.some(O=>O===e.tab);return c`
            <div class="nav-group ${_&&!P?"nav-group--collapsed":""}">
              <button
                class="nav-label"
                @click=${()=>{const O={...e.settings.navGroupsCollapsed};O[p.label]=!_,e.applySettings({...e.settings,navGroupsCollapsed:O})}}
                aria-expanded=${!_}
              >
                <span class="nav-label__text">${F(`nav.${p.label}`)}</span>
                <span class="nav-label__chevron">${_?"+":"−"}</span>
              </button>
              <div class="nav-group__items">
                ${p.tabs.map(O=>Oh(e,O))}
              </div>
            </div>
          `})}
        <div class="nav-group nav-group--links">
          <div class="nav-label nav-label--static">
            <span class="nav-label__text">${F("common.resources")}</span>
          </div>
          <div class="nav-group__items">
            <a
              class="nav-item nav-item--external"
              href="https://docs.openclaw.ai"
              target="_blank"
              rel="noreferrer"
              title="${F("common.docs")} (opens in new tab)"
            >
              <span class="nav-item__icon" aria-hidden="true">${ce.book}</span>
              <span class="nav-item__text">${F("common.docs")}</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${l?"content--chat":""}">
        ${n?c`<div class="update-banner callout danger" role="alert">
              <strong>Update available:</strong> v${n.latestVersion}
              (running v${n.currentVersion}).
              <button
                class="btn btn--sm update-banner__btn"
                ?disabled=${e.updateRunning||!e.connected}
                @click=${()=>Ma(e)}
              >${e.updateRunning?"Updating…":"Update now"}</button>
            </div>`:m}
        <section class="content-header">
          <div>
            ${e.tab==="usage"?m:c`<div class="page-title">${zi(e.tab)}</div>`}
            ${e.tab==="usage"?m:c`<div class="page-sub">${ep(e.tab)}</div>`}
          </div>
          <div class="page-meta">
            ${e.lastError?c`<div class="pill danger">${e.lastError}</div>`:m}
            ${l?Uh(e):m}
          </div>
        </section>

        ${e.tab==="overview"?lx({connected:e.connected,hello:e.hello,settings:e.settings,password:e.password,lastError:e.lastError,lastErrorCode:e.lastErrorCode,presenceCount:i,sessionsCount:o,cronEnabled:e.cronStatus?.enabled??null,cronNext:a,lastChannelsRefresh:e.channelsLastSuccess,onSettingsChange:p=>e.applySettings(p),onPasswordChange:p=>e.password=p,onSessionKeyChange:p=>{e.sessionKey=p,e.chatMessage="",e.resetToolStream(),e.applySettings({...e.settings,sessionKey:p,lastActiveSessionKey:p}),e.loadAssistantIdentity()},onConnect:()=>e.connect(),onRefresh:()=>e.loadOverview()}):m}

        ${e.tab==="channels"?xv({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:p=>Ee(e,p),onWhatsAppStart:p=>e.handleWhatsAppStart(p),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(p,_)=>Le(e,p,_),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(p,_)=>e.handleNostrProfileEdit(p,_),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(p,_)=>e.handleNostrProfileFieldChange(p,_),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):m}

        ${e.tab==="instances"?I0({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>Do(e)}):m}

        ${e.tab==="sessions"?bx({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,onFiltersChange:p=>{e.sessionsFilterActive=p.activeMinutes,e.sessionsFilterLimit=p.limit,e.sessionsIncludeGlobal=p.includeGlobal,e.sessionsIncludeUnknown=p.includeUnknown},onRefresh:()=>Jt(e),onPatch:(p,_)=>jg(e,p,_),onDelete:p=>qg(e,p)}):m}

        ${Rh(e)}

        ${e.tab==="cron"?x0({basePath:e.basePath,loading:e.cronLoading,jobsLoadingMore:e.cronJobsLoadingMore,status:e.cronStatus,jobs:e.cronJobs,jobsTotal:e.cronJobsTotal,jobsHasMore:e.cronJobsHasMore,jobsQuery:e.cronJobsQuery,jobsEnabledFilter:e.cronJobsEnabledFilter,jobsSortBy:e.cronJobsSortBy,jobsSortDir:e.cronJobsSortDir,error:e.cronError,busy:e.cronBusy,form:e.cronForm,fieldErrors:e.cronFieldErrors,canSubmit:!_l(e.cronFieldErrors),editingJobId:e.cronEditingJobId,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(p=>p.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,runsTotal:e.cronRunsTotal,runsHasMore:e.cronRunsHasMore,runsLoadingMore:e.cronRunsLoadingMore,runsScope:e.cronRunsScope,runsStatuses:e.cronRunsStatuses,runsDeliveryStatuses:e.cronRunsDeliveryStatuses,runsStatusFilter:e.cronRunsStatusFilter,runsQuery:e.cronRunsQuery,runsSortDir:e.cronRunsSortDir,agentSuggestions:A,modelSuggestions:k,thinkingSuggestions:Sx,timezoneSuggestions:Ax,deliveryToSuggestions:C,onFormChange:p=>{e.cronForm=Ao({...e.cronForm,...p}),e.cronFieldErrors=Vn(e.cronForm)},onRefresh:()=>e.loadCron(),onAdd:()=>Xu(e),onEdit:p=>sg(e,p),onClone:p=>og(e,p),onCancelEdit:()=>ag(e),onToggle:(p,_)=>Zu(e,p,_),onRun:p=>eg(e,p),onRemove:p=>tg(e,p),onLoadRuns:async p=>{Oa(e,{cronRunsScope:"job"}),await yt(e,p)},onLoadMoreJobs:()=>ju(e),onJobsFiltersChange:async p=>{qu(e,p),await Wu(e)},onLoadMoreRuns:()=>ng(e),onRunsFiltersChange:async p=>{if(Oa(e,p),e.cronRunsScope==="all"){await yt(e,null);return}await yt(e,e.cronRunsJobId)}}):m}

        ${e.tab==="agents"?Bm({loading:e.agentsLoading,error:e.agentsError,agentsList:e.agentsList,selectedAgentId:b,activePanel:e.agentsPanel,configForm:h,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,channelsLoading:e.channelsLoading,channelsError:e.channelsError,channelsSnapshot:e.channelsSnapshot,channelsLastSuccess:e.channelsLastSuccess,cronLoading:e.cronLoading,cronStatus:e.cronStatus,cronJobs:e.cronJobs,cronError:e.cronError,agentFilesLoading:e.agentFilesLoading,agentFilesError:e.agentFilesError,agentFilesList:e.agentFilesList,agentFileActive:e.agentFileActive,agentFileContents:e.agentFileContents,agentFileDrafts:e.agentFileDrafts,agentFileSaving:e.agentFileSaving,agentIdentityLoading:e.agentIdentityLoading,agentIdentityError:e.agentIdentityError,agentIdentityById:e.agentIdentityById,agentSkillsLoading:e.agentSkillsLoading,agentSkillsReport:e.agentSkillsReport,agentSkillsError:e.agentSkillsError,agentSkillsAgentId:e.agentSkillsAgentId,toolsCatalogLoading:e.toolsCatalogLoading,toolsCatalogError:e.toolsCatalogError,toolsCatalogResult:e.toolsCatalogResult,skillsFilter:e.skillsFilter,onRefresh:async()=>{await wo(e);const p=e.agentsSelectedId??e.agentsList?.defaultId??e.agentsList?.agents?.[0]?.id??null;await Ln(e,p);const _=e.agentsList?.agents?.map(P=>P.id)??[];_.length>0&&Al(e,_)},onSelectAgent:p=>{e.agentsSelectedId!==p&&(e.agentsSelectedId=p,e.agentFilesList=null,e.agentFilesError=null,e.agentFilesLoading=!1,e.agentFileActive=null,e.agentFileContents={},e.agentFileDrafts={},e.agentSkillsReport=null,e.agentSkillsError=null,e.agentSkillsAgentId=null,Sl(e,p),e.agentsPanel==="tools"&&Ln(e,p),e.agentsPanel==="files"&&$i(e,p),e.agentsPanel==="skills"&&vs(e,p))},onSelectPanel:p=>{e.agentsPanel=p,p==="files"&&b&&e.agentFilesList?.agentId!==b&&(e.agentFilesList=null,e.agentFilesError=null,e.agentFileActive=null,e.agentFileContents={},e.agentFileDrafts={},$i(e,b)),p==="tools"&&Ln(e,b),p==="skills"&&b&&vs(e,b),p==="channels"&&Ee(e,!1),p==="cron"&&e.loadCron()},onLoadFiles:p=>$i(e,p),onSelectFile:p=>{e.agentFileActive=p,b&&Jh(e,b,p)},onFileDraftChange:(p,_)=>{e.agentFileDrafts={...e.agentFileDrafts,[p]:_}},onFileReset:p=>{const _=e.agentFileContents[p]??"";e.agentFileDrafts={...e.agentFileDrafts,[p]:_}},onFileSave:p=>{if(!b)return;const _=e.agentFileDrafts[p]??e.agentFileContents[p]??"";Qh(e,b,p,_)},onToolsProfileChange:(p,_,P)=>{if(!h)return;const O=h.agents?.list;if(!Array.isArray(O))return;const L=O.findIndex(G=>G&&typeof G=="object"&&"id"in G&&G.id===p);if(L<0)return;const q=["agents","list",L,"tools"];_?Le(e,[...q,"profile"],_):tt(e,[...q,"profile"]),P&&tt(e,[...q,"allow"])},onToolsOverridesChange:(p,_,P)=>{if(!h)return;const O=h.agents?.list;if(!Array.isArray(O))return;const L=O.findIndex(G=>G&&typeof G=="object"&&"id"in G&&G.id===p);if(L<0)return;const q=["agents","list",L,"tools"];_.length>0?Le(e,[...q,"alsoAllow"],_):tt(e,[...q,"alsoAllow"]),P.length>0?Le(e,[...q,"deny"],P):tt(e,[...q,"deny"])},onConfigReload:()=>Be(e),onConfigSave:()=>ms(e),onChannelsRefresh:()=>Ee(e,!1),onCronRefresh:()=>e.loadCron(),onSkillsFilterChange:p=>e.skillsFilter=p,onSkillsRefresh:()=>{b&&vs(e,b)},onAgentSkillToggle:(p,_,P)=>{if(!h)return;const O=h.agents?.list;if(!Array.isArray(O))return;const L=O.findIndex(J=>J&&typeof J=="object"&&"id"in J&&J.id===p);if(L<0)return;const q=O[L],G=_.trim();if(!G)return;const Q=e.agentSkillsReport?.skills?.map(J=>J.name).filter(Boolean)??[],j=(Array.isArray(q.skills)?q.skills.map(J=>String(J).trim()).filter(Boolean):void 0)??Q,X=new Set(j);P?X.add(G):X.delete(G),Le(e,["agents","list",L,"skills"],[...X])},onAgentSkillsClear:p=>{if(!h)return;const _=h.agents?.list;if(!Array.isArray(_))return;const P=_.findIndex(O=>O&&typeof O=="object"&&"id"in O&&O.id===p);P<0||tt(e,["agents","list",P,"skills"])},onAgentSkillsDisableAll:p=>{if(!h)return;const _=h.agents?.list;if(!Array.isArray(_))return;const P=_.findIndex(O=>O&&typeof O=="object"&&"id"in O&&O.id===p);P<0||Le(e,["agents","list",P,"skills"],[])},onModelChange:(p,_)=>{if(!h)return;const P=h.agents?.list;if(!Array.isArray(P))return;const O=P.findIndex(Q=>Q&&typeof Q=="object"&&"id"in Q&&Q.id===p);if(O<0)return;const L=["agents","list",O,"model"];if(!_){tt(e,L);return}const G=P[O]?.model;if(G&&typeof G=="object"&&!Array.isArray(G)){const Q=G.fallbacks,E={primary:_,...Array.isArray(Q)?{fallbacks:Q}:{}};Le(e,L,E)}else Le(e,L,_)},onModelFallbacksChange:(p,_)=>{if(!h)return;const P=h.agents?.list;if(!Array.isArray(P))return;const O=P.findIndex(J=>J&&typeof J=="object"&&"id"in J&&J.id===p);if(O<0)return;const L=["agents","list",O,"model"],q=P[O],G=_.map(J=>J.trim()).filter(Boolean),Q=q.model,j=(()=>{if(typeof Q=="string")return Q.trim()||null;if(Q&&typeof Q=="object"&&!Array.isArray(Q)){const J=Q.primary;if(typeof J=="string")return J.trim()||null}return null})();if(G.length===0){j?Le(e,L,j):tt(e,L);return}Le(e,L,j?{primary:j,fallbacks:G}:{fallbacks:G})}}):m}

        ${e.tab==="skills"?xx({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,onFilterChange:p=>e.skillsFilter=p,onRefresh:()=>Yn(e,{clearMessages:!0}),onToggle:(p,_)=>Vg(e,p,_),onEdit:(p,_)=>Gg(e,p,_),onSaveKey:p=>Jg(e,p),onInstall:(p,_,P)=>Qg(e,p,_,P)}):m}

        ${e.tab==="nodes"?Q0({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>Us(e),onDevicesRefresh:()=>Tt(e),onDeviceApprove:p=>Dg(e,p),onDeviceReject:p=>Pg(e,p),onDeviceRotate:(p,_,P)=>Fg(e,{deviceId:p,role:_,scopes:P}),onDeviceRevoke:(p,_)=>Ng(e,{deviceId:p,role:_}),onLoadConfig:()=>Be(e),onLoadExecApprovals:()=>{const p=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Mo(e,p)},onBindDefault:p=>{p?Le(e,["tools","exec","node"],p):tt(e,["tools","exec","node"])},onBindAgent:(p,_)=>{const P=["agents","list",p,"tools","exec","node"];_?Le(e,P,_):tt(e,P)},onSaveBindings:()=>ms(e),onExecApprovalsTargetChange:(p,_)=>{e.execApprovalsTarget=p,e.execApprovalsTargetNodeId=_,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:p=>{e.execApprovalsSelectedAgent=p},onExecApprovalsPatch:(p,_)=>zg(e,p,_),onExecApprovalsRemove:p=>Kg(e,p),onSaveExecApprovals:()=>{const p=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Hg(e,p)}}):m}

        ${e.tab==="chat"?i0({sessionKey:e.sessionKey,onSessionKeyChange:p=>{e.sessionKey=p,e.chatMessage="",e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:p,lastActiveSessionKey:p}),e.loadAssistantIdentity(),jn(e),Wi(e)},thinkingLevel:e.chatThinkingLevel,showThinking:u,loading:e.chatLoading,sending:e.chatSending,compactionStatus:e.compactionStatus,fallbackStatus:e.fallbackStatus,assistantAvatarUrl:f,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:r,error:e.lastError,sessions:e.sessionsResult,focusMode:d,onRefresh:()=>(e.resetToolStream(),Promise.all([jn(e),Wi(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:p=>e.handleChatScroll(p),onDraftChange:p=>e.chatMessage=p,attachments:e.chatAttachments,onAttachmentsChange:p=>e.chatAttachments=p,onSend:()=>e.handleSendChat(),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onQueueRemove:p=>e.removeQueuedMessage(p),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),onConsciousnessFlush:()=>{e.handleConsciousnessFlush()},consciousnessStatus:e.consciousnessStatus,showNewMessages:e.chatNewMessagesBelow&&!e.chatManualRefreshInFlight,onScrollToBottom:()=>e.scrollToBottom(),sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,splitRatio:e.splitRatio,onOpenSidebar:p=>e.handleOpenSidebar(p),onCloseSidebar:()=>e.handleCloseSidebar(),onSplitRatioChange:p=>e.handleSplitRatioChange(p),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar}):m}

        ${e.tab==="config"?p0({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:p=>{e.configRaw=p},onFormModeChange:p=>e.configFormMode=p,onFormPatch:(p,_)=>Le(e,p,_),onSearchChange:p=>e.configSearchQuery=p,onSectionChange:p=>{e.configActiveSection=p,e.configActiveSubsection=null},onSubsectionChange:p=>e.configActiveSubsection=p,onReload:()=>Be(e),onSave:()=>ms(e),onApply:()=>lu(e),onUpdate:()=>Ma(e)}):m}

        ${e.tab==="debug"?T0({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:p=>e.debugCallMethod=p,onCallParamsChange:p=>e.debugCallParams=p,onRefresh:()=>Os(e),onCall:()=>Eu(e)}):m}

        ${e.tab==="logs"?P0({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:p=>e.logsFilterText=p,onLevelToggle:(p,_)=>{e.logsLevelFilters={...e.logsLevelFilters,[p]:_}},onToggleAutoFollow:p=>e.logsAutoFollow=p,onRefresh:()=>vo(e,{reset:!0}),onExport:(p,_)=>e.exportLogs(p,_),onScroll:p=>e.handleLogsScroll(p)}):m}
      </main>
      ${E0(e)}
      ${R0(e)}
    </div>
  `}var Rx=Object.defineProperty,Ix=Object.getOwnPropertyDescriptor,x=(e,t,n,s)=>{for(var i=s>1?void 0:s?Ix(t,n):t,o=e.length-1,a;o>=0;o--)(a=e[o])&&(i=(s?a(t,n,i):a(i))||i);return s&&i&&Rx(t,n,i),i};const Di=No({});function Lx(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}let y=class extends cn{constructor(){super(),this.i18nController=new tu(this),this.clientInstanceId=qs(),this.settings=tp(),this.password="",this.tab="chat",this.onboarding=Lx(),this.connected=!1,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.lastErrorCode=null,this.eventLog=[],this.eventLogBuffer=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.assistantName=Di.name,this.assistantAvatar=Di.avatar,this.assistantAgentId=Di.agentId??null,this.sessionKey=this.settings.sessionKey,this.chatLoading=!1,this.chatSending=!1,this.chatMessage="",this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.compactionStatus=null,this.fallbackStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.chatManualRefreshInFlight=!1,this.consciousnessStatus="idle",this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.splitRatio=this.settings.splitRatio,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.agentsSelectedId=null,this.toolsCatalogLoading=!1,this.toolsCatalogError=null,this.toolsCatalogResult=null,this.agentsPanel="overview",this.agentFilesLoading=!1,this.agentFilesError=null,this.agentFilesList=null,this.agentFileContents={},this.agentFileDrafts={},this.agentFileActive=null,this.agentFileSaving=!1,this.agentIdentityLoading=!1,this.agentIdentityError=null,this.agentIdentityById={},this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsReport=null,this.agentSkillsAgentId=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.usageLoading=!1,this.usageResult=null,this.usageCostSummary=null,this.usageError=null,this.usageStartDate=(()=>{const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`})(),this.usageEndDate=(()=>{const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`})(),this.usageSelectedSessions=[],this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageChartMode="tokens",this.usageDailyChartMode="by-type",this.usageTimeSeriesMode="per-turn",this.usageTimeSeriesBreakdownMode="by-type",this.usageTimeSeries=null,this.usageTimeSeriesLoading=!1,this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null,this.usageSessionLogs=null,this.usageSessionLogsLoading=!1,this.usageSessionLogsExpanded=!1,this.usageQuery="",this.usageQueryDraft="",this.usageSessionSort="recent",this.usageSessionSortDir="desc",this.usageRecentSessions=[],this.usageTimeZone="local",this.usageContextExpanded=!1,this.usageHeaderPinned=!1,this.usageSessionsTab="all",this.usageVisibleColumns=["channel","agent","provider","model","messages","tools","errors","duration"],this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery="",this.usageQueryDebounceTimer=null,this.cronLoading=!1,this.cronJobsLoadingMore=!1,this.cronJobs=[],this.cronJobsTotal=0,this.cronJobsHasMore=!1,this.cronJobsNextOffset=null,this.cronJobsLimit=50,this.cronJobsQuery="",this.cronJobsEnabledFilter="all",this.cronJobsSortBy="nextRunAtMs",this.cronJobsSortDir="asc",this.cronStatus=null,this.cronError=null,this.cronForm={...Cl},this.cronFieldErrors={},this.cronEditingJobId=null,this.cronRunsJobId=null,this.cronRunsLoadingMore=!1,this.cronRuns=[],this.cronRunsTotal=0,this.cronRunsHasMore=!1,this.cronRunsNextOffset=null,this.cronRunsLimit=50,this.cronRunsScope="all",this.cronRunsStatuses=[],this.cronRunsDeliveryStatuses=[],this.cronRunsStatusFilter="all",this.cronRunsQuery="",this.cronRunsSortDir="desc",this.cronModelSuggestions=[],this.cronBusy=!1,this.updateAvailable=null,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...Nu},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatNewMessagesBelow=!1,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=new Set,this.basePath="",this.popStateHandler=()=>fp(this),this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null,this._consciousnessKeyHandler=e=>{(e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key==="H"&&(e.preventDefault(),this.handleConsciousnessFlush())},ho(this.settings.locale)&&Bn.setLocale(this.settings.locale)}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),$f(this),document.addEventListener("keydown",this._consciousnessKeyHandler)}firstUpdated(){wf(this)}disconnectedCallback(){document.removeEventListener("keydown",this._consciousnessKeyHandler),kf(this),super.disconnectedCallback()}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}updated(e){Sf(this,e)}connect(){bc(this)}handleChatScroll(e){Au(this,e)}handleLogsScroll(e){Cu(this,e)}exportLogs(e,t){Tu(e,t)}resetToolStream(){Ws(this)}resetChatScroll(){Da(this)}scrollToBottom(e){Da(this),Gn(this,!0,!!e?.smooth)}async loadAssistantIdentity(){await hc(this)}applySettings(e){St(this,e)}setTab(e){rp(this,e)}setTheme(e,t){lp(this,e,t)}async loadOverview(){await sc(this)}async loadCron(){await Cs(this)}async handleAbortChat(){await uc(this)}removeQueuedMessage(e){Jp(this,e)}async handleSendChat(e,t){await Qp(this,e,t)}async handleWhatsAppStart(e){await gu(this,e)}async handleWhatsAppWait(){await pu(this)}async handleWhatsAppLogout(){await fu(this)}async handleChannelConfigSave(){await hu(this)}async handleChannelConfigReload(){await mu(this)}handleNostrProfileEdit(e,t){yu(this,e,t)}handleNostrProfileCancel(){xu(this)}handleNostrProfileFieldChange(e,t){$u(this,e,t)}async handleNostrProfileSave(){await ku(this)}async handleNostrProfileImport(){await Su(this)}handleNostrProfileToggleAdvanced(){wu(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,St(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleOpenSidebar(e){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarCloseTimer=null)},200)}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}render(){return Ex(this)}};x([$()],y.prototype,"settings",2);x([$()],y.prototype,"password",2);x([$()],y.prototype,"tab",2);x([$()],y.prototype,"onboarding",2);x([$()],y.prototype,"connected",2);x([$()],y.prototype,"theme",2);x([$()],y.prototype,"themeResolved",2);x([$()],y.prototype,"hello",2);x([$()],y.prototype,"lastError",2);x([$()],y.prototype,"lastErrorCode",2);x([$()],y.prototype,"eventLog",2);x([$()],y.prototype,"assistantName",2);x([$()],y.prototype,"assistantAvatar",2);x([$()],y.prototype,"assistantAgentId",2);x([$()],y.prototype,"sessionKey",2);x([$()],y.prototype,"chatLoading",2);x([$()],y.prototype,"chatSending",2);x([$()],y.prototype,"chatMessage",2);x([$()],y.prototype,"chatMessages",2);x([$()],y.prototype,"chatToolMessages",2);x([$()],y.prototype,"chatStream",2);x([$()],y.prototype,"chatStreamStartedAt",2);x([$()],y.prototype,"chatRunId",2);x([$()],y.prototype,"compactionStatus",2);x([$()],y.prototype,"fallbackStatus",2);x([$()],y.prototype,"chatAvatarUrl",2);x([$()],y.prototype,"chatThinkingLevel",2);x([$()],y.prototype,"chatQueue",2);x([$()],y.prototype,"chatAttachments",2);x([$()],y.prototype,"chatManualRefreshInFlight",2);x([$()],y.prototype,"consciousnessStatus",2);x([$()],y.prototype,"sidebarOpen",2);x([$()],y.prototype,"sidebarContent",2);x([$()],y.prototype,"sidebarError",2);x([$()],y.prototype,"splitRatio",2);x([$()],y.prototype,"nodesLoading",2);x([$()],y.prototype,"nodes",2);x([$()],y.prototype,"devicesLoading",2);x([$()],y.prototype,"devicesError",2);x([$()],y.prototype,"devicesList",2);x([$()],y.prototype,"execApprovalsLoading",2);x([$()],y.prototype,"execApprovalsSaving",2);x([$()],y.prototype,"execApprovalsDirty",2);x([$()],y.prototype,"execApprovalsSnapshot",2);x([$()],y.prototype,"execApprovalsForm",2);x([$()],y.prototype,"execApprovalsSelectedAgent",2);x([$()],y.prototype,"execApprovalsTarget",2);x([$()],y.prototype,"execApprovalsTargetNodeId",2);x([$()],y.prototype,"execApprovalQueue",2);x([$()],y.prototype,"execApprovalBusy",2);x([$()],y.prototype,"execApprovalError",2);x([$()],y.prototype,"pendingGatewayUrl",2);x([$()],y.prototype,"configLoading",2);x([$()],y.prototype,"configRaw",2);x([$()],y.prototype,"configRawOriginal",2);x([$()],y.prototype,"configValid",2);x([$()],y.prototype,"configIssues",2);x([$()],y.prototype,"configSaving",2);x([$()],y.prototype,"configApplying",2);x([$()],y.prototype,"updateRunning",2);x([$()],y.prototype,"applySessionKey",2);x([$()],y.prototype,"configSnapshot",2);x([$()],y.prototype,"configSchema",2);x([$()],y.prototype,"configSchemaVersion",2);x([$()],y.prototype,"configSchemaLoading",2);x([$()],y.prototype,"configUiHints",2);x([$()],y.prototype,"configForm",2);x([$()],y.prototype,"configFormOriginal",2);x([$()],y.prototype,"configFormDirty",2);x([$()],y.prototype,"configFormMode",2);x([$()],y.prototype,"configSearchQuery",2);x([$()],y.prototype,"configActiveSection",2);x([$()],y.prototype,"configActiveSubsection",2);x([$()],y.prototype,"channelsLoading",2);x([$()],y.prototype,"channelsSnapshot",2);x([$()],y.prototype,"channelsError",2);x([$()],y.prototype,"channelsLastSuccess",2);x([$()],y.prototype,"whatsappLoginMessage",2);x([$()],y.prototype,"whatsappLoginQrDataUrl",2);x([$()],y.prototype,"whatsappLoginConnected",2);x([$()],y.prototype,"whatsappBusy",2);x([$()],y.prototype,"nostrProfileFormState",2);x([$()],y.prototype,"nostrProfileAccountId",2);x([$()],y.prototype,"presenceLoading",2);x([$()],y.prototype,"presenceEntries",2);x([$()],y.prototype,"presenceError",2);x([$()],y.prototype,"presenceStatus",2);x([$()],y.prototype,"agentsLoading",2);x([$()],y.prototype,"agentsList",2);x([$()],y.prototype,"agentsError",2);x([$()],y.prototype,"agentsSelectedId",2);x([$()],y.prototype,"toolsCatalogLoading",2);x([$()],y.prototype,"toolsCatalogError",2);x([$()],y.prototype,"toolsCatalogResult",2);x([$()],y.prototype,"agentsPanel",2);x([$()],y.prototype,"agentFilesLoading",2);x([$()],y.prototype,"agentFilesError",2);x([$()],y.prototype,"agentFilesList",2);x([$()],y.prototype,"agentFileContents",2);x([$()],y.prototype,"agentFileDrafts",2);x([$()],y.prototype,"agentFileActive",2);x([$()],y.prototype,"agentFileSaving",2);x([$()],y.prototype,"agentIdentityLoading",2);x([$()],y.prototype,"agentIdentityError",2);x([$()],y.prototype,"agentIdentityById",2);x([$()],y.prototype,"agentSkillsLoading",2);x([$()],y.prototype,"agentSkillsError",2);x([$()],y.prototype,"agentSkillsReport",2);x([$()],y.prototype,"agentSkillsAgentId",2);x([$()],y.prototype,"sessionsLoading",2);x([$()],y.prototype,"sessionsResult",2);x([$()],y.prototype,"sessionsError",2);x([$()],y.prototype,"sessionsFilterActive",2);x([$()],y.prototype,"sessionsFilterLimit",2);x([$()],y.prototype,"sessionsIncludeGlobal",2);x([$()],y.prototype,"sessionsIncludeUnknown",2);x([$()],y.prototype,"usageLoading",2);x([$()],y.prototype,"usageResult",2);x([$()],y.prototype,"usageCostSummary",2);x([$()],y.prototype,"usageError",2);x([$()],y.prototype,"usageStartDate",2);x([$()],y.prototype,"usageEndDate",2);x([$()],y.prototype,"usageSelectedSessions",2);x([$()],y.prototype,"usageSelectedDays",2);x([$()],y.prototype,"usageSelectedHours",2);x([$()],y.prototype,"usageChartMode",2);x([$()],y.prototype,"usageDailyChartMode",2);x([$()],y.prototype,"usageTimeSeriesMode",2);x([$()],y.prototype,"usageTimeSeriesBreakdownMode",2);x([$()],y.prototype,"usageTimeSeries",2);x([$()],y.prototype,"usageTimeSeriesLoading",2);x([$()],y.prototype,"usageTimeSeriesCursorStart",2);x([$()],y.prototype,"usageTimeSeriesCursorEnd",2);x([$()],y.prototype,"usageSessionLogs",2);x([$()],y.prototype,"usageSessionLogsLoading",2);x([$()],y.prototype,"usageSessionLogsExpanded",2);x([$()],y.prototype,"usageQuery",2);x([$()],y.prototype,"usageQueryDraft",2);x([$()],y.prototype,"usageSessionSort",2);x([$()],y.prototype,"usageSessionSortDir",2);x([$()],y.prototype,"usageRecentSessions",2);x([$()],y.prototype,"usageTimeZone",2);x([$()],y.prototype,"usageContextExpanded",2);x([$()],y.prototype,"usageHeaderPinned",2);x([$()],y.prototype,"usageSessionsTab",2);x([$()],y.prototype,"usageVisibleColumns",2);x([$()],y.prototype,"usageLogFilterRoles",2);x([$()],y.prototype,"usageLogFilterTools",2);x([$()],y.prototype,"usageLogFilterHasTools",2);x([$()],y.prototype,"usageLogFilterQuery",2);x([$()],y.prototype,"cronLoading",2);x([$()],y.prototype,"cronJobsLoadingMore",2);x([$()],y.prototype,"cronJobs",2);x([$()],y.prototype,"cronJobsTotal",2);x([$()],y.prototype,"cronJobsHasMore",2);x([$()],y.prototype,"cronJobsNextOffset",2);x([$()],y.prototype,"cronJobsLimit",2);x([$()],y.prototype,"cronJobsQuery",2);x([$()],y.prototype,"cronJobsEnabledFilter",2);x([$()],y.prototype,"cronJobsSortBy",2);x([$()],y.prototype,"cronJobsSortDir",2);x([$()],y.prototype,"cronStatus",2);x([$()],y.prototype,"cronError",2);x([$()],y.prototype,"cronForm",2);x([$()],y.prototype,"cronFieldErrors",2);x([$()],y.prototype,"cronEditingJobId",2);x([$()],y.prototype,"cronRunsJobId",2);x([$()],y.prototype,"cronRunsLoadingMore",2);x([$()],y.prototype,"cronRuns",2);x([$()],y.prototype,"cronRunsTotal",2);x([$()],y.prototype,"cronRunsHasMore",2);x([$()],y.prototype,"cronRunsNextOffset",2);x([$()],y.prototype,"cronRunsLimit",2);x([$()],y.prototype,"cronRunsScope",2);x([$()],y.prototype,"cronRunsStatuses",2);x([$()],y.prototype,"cronRunsDeliveryStatuses",2);x([$()],y.prototype,"cronRunsStatusFilter",2);x([$()],y.prototype,"cronRunsQuery",2);x([$()],y.prototype,"cronRunsSortDir",2);x([$()],y.prototype,"cronModelSuggestions",2);x([$()],y.prototype,"cronBusy",2);x([$()],y.prototype,"updateAvailable",2);x([$()],y.prototype,"skillsLoading",2);x([$()],y.prototype,"skillsReport",2);x([$()],y.prototype,"skillsError",2);x([$()],y.prototype,"skillsFilter",2);x([$()],y.prototype,"skillEdits",2);x([$()],y.prototype,"skillsBusyKey",2);x([$()],y.prototype,"skillMessages",2);x([$()],y.prototype,"debugLoading",2);x([$()],y.prototype,"debugStatus",2);x([$()],y.prototype,"debugHealth",2);x([$()],y.prototype,"debugModels",2);x([$()],y.prototype,"debugHeartbeat",2);x([$()],y.prototype,"debugCallMethod",2);x([$()],y.prototype,"debugCallParams",2);x([$()],y.prototype,"debugCallResult",2);x([$()],y.prototype,"debugCallError",2);x([$()],y.prototype,"logsLoading",2);x([$()],y.prototype,"logsError",2);x([$()],y.prototype,"logsFile",2);x([$()],y.prototype,"logsEntries",2);x([$()],y.prototype,"logsFilterText",2);x([$()],y.prototype,"logsLevelFilters",2);x([$()],y.prototype,"logsAutoFollow",2);x([$()],y.prototype,"logsTruncated",2);x([$()],y.prototype,"logsCursor",2);x([$()],y.prototype,"logsLastFetchAt",2);x([$()],y.prototype,"logsLimit",2);x([$()],y.prototype,"logsMaxBytes",2);x([$()],y.prototype,"logsAtBottom",2);x([$()],y.prototype,"chatNewMessagesBelow",2);y=x([pl("openclaw-app")],y);
//# sourceMappingURL=index-DIcfWAsn.js.map
