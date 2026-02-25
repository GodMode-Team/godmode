(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const nd="modulepreload",sd=function(e,t){return new URL(e,t).href},no={},Be=function(t,n,s){let i=Promise.resolve();if(n&&n.length>0){let u=function(p){return Promise.all(p.map(h=>Promise.resolve(h).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=l?.nonce||l?.getAttribute("nonce");i=u(n.map(p=>{if(p=sd(p,s),p in no)return;no[p]=!0;const h=p.endsWith(".css"),g=h?'[rel="stylesheet"]':"";if(s)for(let m=o.length-1;m>=0;m--){const k=o[m];if(k.href===p&&(!h||k.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${p}"]${g}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":nd,h||(d.as="script"),d.crossOrigin="",d.href=p,c&&d.setAttribute("nonce",c),document.head.appendChild(d),h)return new Promise((m,k)=>{d.addEventListener("load",m),d.addEventListener("error",()=>k(new Error(`Unable to preload CSS for ${p}`)))})}))}function a(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return i.then(o=>{for(const l of o||[])l.status==="rejected"&&a(l.reason);return t().catch(a)})};const Pn=globalThis,Oi=Pn.ShadowRoot&&(Pn.ShadyCSS===void 0||Pn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Bi=Symbol(),so=new WeakMap;let Jr=class{constructor(t,n,s){if(this._$cssResult$=!0,s!==Bi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o;const n=this.t;if(Oi&&t===void 0){const s=n!==void 0&&n.length===1;s&&(t=so.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&so.set(n,t))}return t}toString(){return this.cssText}};const id=e=>new Jr(typeof e=="string"?e:e+"",void 0,Bi),ad=(e,...t)=>{const n=e.length===1?e[0]:t.reduce((s,i,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new Jr(n,e,Bi)},od=(e,t)=>{if(Oi)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of t){const s=document.createElement("style"),i=Pn.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=n.cssText,e.appendChild(s)}},io=Oi?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(const s of t.cssRules)n+=s.cssText;return id(n)})(e):e;const{is:rd,defineProperty:ld,getOwnPropertyDescriptor:cd,getOwnPropertyNames:dd,getOwnPropertySymbols:ud,getPrototypeOf:pd}=Object,es=globalThis,ao=es.trustedTypes,hd=ao?ao.emptyScript:"",fd=es.reactiveElementPolyfillSupport,nn=(e,t)=>e,Un={toAttribute(e,t){switch(t){case Boolean:e=e?hd:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Fi=(e,t)=>!rd(e,t),oo={attribute:!0,type:String,converter:Un,reflect:!1,useDefault:!1,hasChanged:Fi};Symbol.metadata??=Symbol("metadata"),es.litPropertyMetadata??=new WeakMap;let xt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=oo){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,n);i!==void 0&&ld(this.prototype,t,i)}}static getPropertyDescriptor(t,n,s){const{get:i,set:a}=cd(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:i,set(o){const l=i?.call(this);a?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??oo}static _$Ei(){if(this.hasOwnProperty(nn("elementProperties")))return;const t=pd(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(nn("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(nn("properties"))){const n=this.properties,s=[...dd(n),...ud(n)];for(const i of s)this.createProperty(i,n[i])}const t=this[Symbol.metadata];if(t!==null){const n=litPropertyMetadata.get(t);if(n!==void 0)for(const[s,i]of n)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[n,s]of this.elementProperties){const i=this._$Eu(n,s);i!==void 0&&this._$Eh.set(i,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const n=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)n.unshift(io(i))}else t!==void 0&&n.push(io(t));return n}static _$Eu(t,n){const s=n.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,n=this.constructor.elementProperties;for(const s of n.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return od(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,s){this._$AK(t,s)}_$ET(t,n){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const a=(s.converter?.toAttribute!==void 0?s.converter:Un).toAttribute(n,s.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,n){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Un;this._$Em=i;const l=o.fromAttribute(n,a.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,n,s,i=!1,a){if(t!==void 0){const o=this.constructor;if(i===!1&&(a=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??Fi)(a,n)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,n,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),a!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(n=void 0),this._$AL.set(t,n)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,a]of s){const{wrapped:o}=a,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,a,l)}}let t=!1;const n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(n)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};xt.elementStyles=[],xt.shadowRootOptions={mode:"open"},xt[nn("elementProperties")]=new Map,xt[nn("finalized")]=new Map,fd?.({ReactiveElement:xt}),(es.reactiveElementVersions??=[]).push("2.1.2");const Ui=globalThis,ro=e=>e,Kn=Ui.trustedTypes,lo=Kn?Kn.createPolicy("lit-html",{createHTML:e=>e}):void 0,Xr="$lit$",Fe=`lit$${Math.random().toFixed(9).slice(2)}$`,Zr="?"+Fe,gd=`<${Zr}>`,dt=document,ln=()=>dt.createComment(""),cn=e=>e===null||typeof e!="object"&&typeof e!="function",Ki=Array.isArray,md=e=>Ki(e)||typeof e?.[Symbol.iterator]=="function",Ms=`[ 	
\f\r]`,Kt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,co=/-->/g,uo=/>/g,Xe=RegExp(`>|${Ms}(?:([^\\s"'>=/]+)(${Ms}*=${Ms}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),po=/'/g,ho=/"/g,el=/^(?:script|style|textarea|title)$/i,tl=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),r=tl(1),xn=tl(2),He=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),fo=new WeakMap,rt=dt.createTreeWalker(dt,129);function nl(e,t){if(!Ki(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return lo!==void 0?lo.createHTML(t):t}const vd=(e,t)=>{const n=e.length-1,s=[];let i,a=t===2?"<svg>":t===3?"<math>":"",o=Kt;for(let l=0;l<n;l++){const c=e[l];let u,p,h=-1,g=0;for(;g<c.length&&(o.lastIndex=g,p=o.exec(c),p!==null);)g=o.lastIndex,o===Kt?p[1]==="!--"?o=co:p[1]!==void 0?o=uo:p[2]!==void 0?(el.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=Xe):p[3]!==void 0&&(o=Xe):o===Xe?p[0]===">"?(o=i??Kt,h=-1):p[1]===void 0?h=-2:(h=o.lastIndex-p[2].length,u=p[1],o=p[3]===void 0?Xe:p[3]==='"'?ho:po):o===ho||o===po?o=Xe:o===co||o===uo?o=Kt:(o=Xe,i=void 0);const d=o===Xe&&e[l+1].startsWith("/>")?" ":"";a+=o===Kt?c+gd:h>=0?(s.push(u),c.slice(0,h)+Xr+c.slice(h)+Fe+d):c+Fe+(h===-2?l:d)}return[nl(e,a+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class dn{constructor({strings:t,_$litType$:n},s){let i;this.parts=[];let a=0,o=0;const l=t.length-1,c=this.parts,[u,p]=vd(t,n);if(this.el=dn.createElement(u,s),rt.currentNode=this.el.content,n===2||n===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=rt.nextNode())!==null&&c.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(Xr)){const g=p[o++],d=i.getAttribute(h).split(Fe),m=/([.?@])?(.*)/.exec(g);c.push({type:1,index:a,name:m[2],strings:d,ctor:m[1]==="."?bd:m[1]==="?"?wd:m[1]==="@"?kd:ns}),i.removeAttribute(h)}else h.startsWith(Fe)&&(c.push({type:6,index:a}),i.removeAttribute(h));if(el.test(i.tagName)){const h=i.textContent.split(Fe),g=h.length-1;if(g>0){i.textContent=Kn?Kn.emptyScript:"";for(let d=0;d<g;d++)i.append(h[d],ln()),rt.nextNode(),c.push({type:2,index:++a});i.append(h[g],ln())}}}else if(i.nodeType===8)if(i.data===Zr)c.push({type:2,index:a});else{let h=-1;for(;(h=i.data.indexOf(Fe,h+1))!==-1;)c.push({type:7,index:a}),h+=Fe.length-1}a++}}static createElement(t,n){const s=dt.createElement("template");return s.innerHTML=t,s}}function It(e,t,n=e,s){if(t===He)return t;let i=s!==void 0?n._$Co?.[s]:n._$Cl;const a=cn(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,s)),s!==void 0?(n._$Co??=[])[s]=i:n._$Cl=i),i!==void 0&&(t=It(e,i._$AS(e,t.values),i,s)),t}class yd{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:n},parts:s}=this._$AD,i=(t?.creationScope??dt).importNode(n,!0);rt.currentNode=i;let a=rt.nextNode(),o=0,l=0,c=s[0];for(;c!==void 0;){if(o===c.index){let u;c.type===2?u=new ts(a,a.nextSibling,this,t):c.type===1?u=new c.ctor(a,c.name,c.strings,this,t):c.type===6&&(u=new $d(a,this,t)),this._$AV.push(u),c=s[++l]}o!==c?.index&&(a=rt.nextNode(),o++)}return rt.currentNode=dt,i}p(t){let n=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,n),n+=s.strings.length-2):s._$AI(t[n])),n++}}let ts=class sl{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,s,i){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=It(this,t,n),cn(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==He&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):md(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==f&&cn(this._$AH)?this._$AA.nextSibling.data=t:this.T(dt.createTextNode(t)),this._$AH=t}$(t){const{values:n,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=dn.createElement(nl(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(n);else{const a=new yd(i,this),o=a.u(this.options);a.p(n),this.T(o),this._$AH=a}}_$AC(t){let n=fo.get(t.strings);return n===void 0&&fo.set(t.strings,n=new dn(t)),n}k(t){Ki(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let s,i=0;for(const a of t)i===n.length?n.push(s=new sl(this.O(ln()),this.O(ln()),this,this.options)):s=n[i],s._$AI(a),i++;i<n.length&&(this._$AR(s&&s._$AB.nextSibling,i),n.length=i)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){const s=ro(t).nextSibling;ro(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ns=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,s,i,a){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=n,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=f}_$AI(t,n=this,s,i){const a=this.strings;let o=!1;if(a===void 0)t=It(this,t,n,0),o=!cn(t)||t!==this._$AH&&t!==He,o&&(this._$AH=t);else{const l=t;let c,u;for(t=a[0],c=0;c<a.length-1;c++)u=It(this,l[s+c],n,c),u===He&&(u=this._$AH[c]),o||=!cn(u)||u!==this._$AH[c],u===f?t=f:t!==f&&(t+=(u??"")+a[c+1]),this._$AH[c]=u}o&&!i&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},bd=class extends ns{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}},wd=class extends ns{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==f)}},kd=class extends ns{constructor(t,n,s,i,a){super(t,n,s,i,a),this.type=5}_$AI(t,n=this){if((t=It(this,t,n,0)??f)===He)return;const s=this._$AH,i=t===f&&s!==f||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==f&&(s===f||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},$d=class{constructor(t,n,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){It(this,t)}};const Sd={I:ts},Ad=Ui.litHtmlPolyfillSupport;Ad?.(dn,ts),(Ui.litHtmlVersions??=[]).push("3.3.2");const xd=(e,t,n)=>{const s=n?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const a=n?.renderBefore??null;s._$litPart$=i=new ts(t.insertBefore(ln(),a),a,void 0,n??{})}return i._$AI(e),i};const Wi=globalThis;let Lt=class extends xt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=xd(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return He}};Lt._$litElement$=!0,Lt.finalized=!0,Wi.litElementHydrateSupport?.({LitElement:Lt});const _d=Wi.litElementPolyfillSupport;_d?.({LitElement:Lt});(Wi.litElementVersions??=[]).push("4.2.2");const il=e=>(t,n)=>{n!==void 0?n.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};const Td={attribute:!0,type:String,converter:Un,reflect:!1,hasChanged:Fi},Cd=(e=Td,t,n)=>{const{kind:s,metadata:i}=n;let a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),s==="setter"&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),s==="accessor"){const{name:o}=n;return{set(l){const c=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,c,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(s==="setter"){const{name:o}=n;return function(l){const c=this[o];t.call(this,l),this.requestUpdate(o,c,e,!0,l)}}throw Error("Unsupported decorator location: "+s)};function ss(e){return(t,n)=>typeof n=="object"?Cd(e,t,n):((s,i,a)=>{const o=i.hasOwnProperty(a);return i.constructor.createProperty(a,s),o?Object.getOwnPropertyDescriptor(i,a):void 0})(e,t,n)}function b(e){return ss({...e,state:!0,attribute:!1})}async function ye(e,t){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const n=await e.client.request("channels.status",{probe:t,timeoutMs:8e3});e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(n){e.channelsError=String(n)}finally{e.channelsLoading=!1}}}async function Ld(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.start",{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function Ed(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function Id(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function ut(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function Mt(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function al(e,t,n){if(t.length===0)return;let s=e;for(let a=0;a<t.length-1;a+=1){const o=t[a],l=t[a+1];if(typeof o=="number"){if(!Array.isArray(s))return;s[o]==null&&(s[o]=typeof l=="number"?[]:{}),s=s[o]}else{if(typeof s!="object"||s==null)return;const c=s;c[o]==null&&(c[o]=typeof l=="number"?[]:{}),s=c[o]}}const i=t[t.length-1];if(typeof i=="number"){Array.isArray(s)&&(s[i]=n);return}typeof s=="object"&&s!=null&&(s[i]=n)}function ol(e,t){if(t.length===0)return;let n=e;for(let i=0;i<t.length-1;i+=1){const a=t[i];if(typeof a=="number"){if(!Array.isArray(n))return;n=n[a]}else{if(typeof n!="object"||n==null)return;n=n[a]}if(n==null)return}const s=t[t.length-1];if(typeof s=="number"){Array.isArray(n)&&n.splice(s,1);return}typeof n=="object"&&n!=null&&delete n[s]}async function Ie(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const t=await e.client.request("config.get",{});Rd(e,t)}catch(t){e.lastError=String(t)}finally{e.configLoading=!1}}}async function rl(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const t=await e.client.request("config.schema",{});Md(e,t)}catch(t){e.lastError=String(t)}finally{e.configSchemaLoading=!1}}}function Md(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function Rd(e,t){e.configSnapshot=t;const n=typeof t.raw=="string"?t.raw:t.config&&typeof t.config=="object"?Mt(t.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=n:e.configForm?e.configRaw=Mt(e.configForm):e.configRaw=n,e.configValid=typeof t.valid=="boolean"?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],e.configFormDirty||(e.configForm=ut(t.config??{}),e.configFormOriginal=ut(t.config??{}),e.configRawOriginal=n)}async function ci(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?Mt(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:t,baseHash:n}),e.configFormDirty=!1,await Ie(e)}catch(t){e.lastError=String(t)}finally{e.configSaving=!1}}}async function Pd(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?Mt(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:t,baseHash:n,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await Ie(e)}catch(t){e.lastError=String(t)}finally{e.configApplying=!1}}}async function go(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("update.run",{sessionKey:e.applySessionKey})}catch(t){e.lastError=String(t)}finally{e.updateRunning=!1}}}function _n(e,t,n){const s=ut(e.configForm??e.configSnapshot?.config??{});al(s,t,n),e.configForm=s,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=Mt(s))}function mo(e,t){const n=ut(e.configForm??e.configSnapshot?.config??{});ol(n,t),e.configForm=n,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=Mt(n))}function Dd(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function Nd(e){const{state:t,callbacks:n,accountId:s}=e,i=Dd(t),a=(l,c,u={})=>{const{type:p="text",placeholder:h,maxLength:g,help:d}=u,m=t.values[l]??"",k=t.fieldErrors[l],$=`nostr-profile-${l}`;return p==="textarea"?r`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${$}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${c}
          </label>
          <textarea
            id="${$}"
            .value=${m}
            placeholder=${h??""}
            maxlength=${g??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${S=>{const x=S.target;n.onFieldChange(l,x.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${d?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${d}</div>`:f}
          ${k?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${k}</div>`:f}
        </div>
      `:r`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${$}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${c}
        </label>
        <input
          id="${$}"
          type=${p}
          .value=${m}
          placeholder=${h??""}
          maxlength=${g??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${S=>{const x=S.target;n.onFieldChange(l,x.value)}}
          ?disabled=${t.saving}
        />
        ${d?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${d}</div>`:f}
        ${k?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${k}</div>`:f}
      </div>
    `},o=()=>{const l=t.values.picture;return l?r`
      <div style="margin-bottom: 12px;">
        <img
          src=${l}
          alt="Profile picture preview"
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${c=>{const u=c.target;u.style.display="none"}}
          @load=${c=>{const u=c.target;u.style.display="block"}}
        />
      </div>
    `:f};return r`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${s}</div>
      </div>

      ${t.error?r`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:f}

      ${t.success?r`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:f}

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
          `:f}

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
            `:f}
    </div>
  `}function Od(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}async function Bd(e,t){await Ld(e,t),await ye(e,!0)}async function Fd(e){await Ed(e),await ye(e,!0)}async function Ud(e){await Id(e),await ye(e,!0)}async function Kd(e){await ci(e),await Ie(e),await ye(e,!0)}async function Wd(e){await Ie(e),await ye(e,!0)}function Hd(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...i]=n.split(":");if(!s||i.length===0)continue;const a=s.trim(),o=i.join(":").trim();a&&o&&(t[a]=o)}return t}function ll(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function cl(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function zd(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=Od(n??void 0)}function jd(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function Vd(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function Gd(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function qd(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=ll(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(cl(n),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const a=i?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:a,success:null,fieldErrors:Hd(i?.details)};return}if(!i.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await ye(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function Yd(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=ll(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(cl(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const c=i?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:c,success:null};return}const a=i.merged??i.imported??null,o=a?{...t.values,...a}:t.values,l=!!(o.banner||o.website||o.nip05||o.lud16);e.nostrProfileFormState={...t,importing:!1,values:o,error:null,success:i.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:l},i.saved&&await ye(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}function dl(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),i=n.slice(2).join(":");return!s||!i?null:{agentId:s,rest:i}}const Qd=80;function Rt(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const n=()=>{const s=e.querySelector(".chat-thread");if(s){const i=getComputedStyle(s).overflowY;if(i==="auto"||i==="scroll"||s.scrollHeight-s.clientHeight>1)return s}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const s=n();if(!s)return;s.scrollHeight-s.scrollTop-s.clientHeight;const i=t&&!e.chatHasAutoScrolled;if(!(i||e.chatUserNearBottom)){e.chatNewMessagesBelow=!0;return}i&&(e.chatHasAutoScrolled=!0),e.chatIsAutoScrolling=!0,s.scrollTop=s.scrollHeight,e.chatNewMessagesBelow=!1,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1});const o=i?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const l=n();!l||!(i||e.chatUserNearBottom)||(e.chatIsAutoScrolling=!0,l.scrollTop=l.scrollHeight,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1}))},o)})})}function ul(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function Jd(e,t){const n=t.currentTarget;if(!n||e.chatIsAutoScrolling)return;n.scrollHeight-n.scrollTop-n.clientHeight<Qd?(e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1):e.chatUserNearBottom=!1}function Xd(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function Zd(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function eu(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),i=document.createElement("a"),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");i.href=s,i.download=`godmode-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(s)}function tu(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}const nu=/<\s*\/?\s*(?:think(?:ing)?|thought|antthinking|final)\b/i,Tn=/<\s*\/?\s*final\b[^>]*>/gi,vo=/<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\b[^>]*>/gi;function su(e,t){return e.trimStart()}function iu(e,t){if(!e||!nu.test(e))return e;let n=e;Tn.test(n)?(Tn.lastIndex=0,n=n.replace(Tn,"")):Tn.lastIndex=0,vo.lastIndex=0;let s="",i=0,a=!1;for(const o of n.matchAll(vo)){const l=o.index??0,c=o[1]==="/";a?c&&(a=!1):(s+=n.slice(i,l),c||(a=!0)),i=l+o[0].length}return s+=n.slice(i),su(s)}function un(e){return!e&&e!==0?"n/a":new Date(e).toLocaleString()}function U(e){if(!e&&e!==0)return"n/a";const t=Date.now()-e;if(t<0)return"just now";const n=Math.round(t/1e3);if(n<60)return`${n}s ago`;const s=Math.round(n/60);if(s<60)return`${s}m ago`;const i=Math.round(s/60);return i<48?`${i}h ago`:`${Math.round(i/24)}d ago`}function au(e){if(!e&&e!==0)return"";const t=Date.now()-e;if(t<0)return"now";const n=Math.round(t/1e3);if(n<60)return"now";const s=Math.round(n/60);if(s<60)return`${s}m`;const i=Math.round(s/60);return i<24?`${i}h`:`${Math.round(i/24)}d`}function pl(e){if(!e&&e!==0)return"n/a";if(e<1e3)return`${e}ms`;const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);if(n<60)return`${n}m`;const s=Math.round(n/60);return s<48?`${s}h`:`${Math.round(s/24)}d`}function di(e){return!e||e.length===0?"none":e.filter(t=>!!(t&&t.trim())).join(", ")}function ui(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function hl(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function Wn(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function Rs(e){return iu(e)}const yo=50,ou=80,ru=12e4;function Z(e,t){if(!e)return"";const n=e.trim().replace(/\n/g," ");return n.length<=t?n:n.slice(0,t-1)+"…"}function X(e){return typeof e=="string"?e:e==null?"":JSON.stringify(e)}function bo(e,t){if(!t||typeof t!="object")return"";const n=t;switch(e.toLowerCase()){case"exec":return n.command?`\`${Z(X(n.command),60)}\``:"";case"read":return n.path||n.file_path?`\`${Z(X(n.path||n.file_path),50)}\``:"";case"write":return n.path||n.file_path?`→ \`${Z(X(n.path||n.file_path),50)}\``:"";case"edit":return n.path||n.file_path?`\`${Z(X(n.path||n.file_path),50)}\``:"";case"web_search":return n.query?`"${Z(X(n.query),45)}"`:"";case"web_fetch":try{const u=new URL(X(n.url));return u.hostname+(u.pathname!=="/"?u.pathname.slice(0,30):"")}catch{return Z(X(n.url||""),50)}case"memory_search":return n.query?`"${Z(X(n.query),45)}"`:"";case"browser":const s=X(n.action),i=n.ref?` #${X(n.ref)}`:"",a=n.targetUrl?` ${Z(X(n.targetUrl),30)}`:"";return`${s}${i}${a}`;case"message":return n.action?`${X(n.action)}${n.target?` → ${Z(X(n.target),25)}`:""}`:"";case"sessions_spawn":return n.task?`"${Z(X(n.task),40)}"`:"";case"cron":return n.action?X(n.action):"";case"files_read":return n.fileId?`file:${Z(X(n.fileId),20)}`:"";case"image":return n.image?Z(X(n.image),40):"";default:const o=Object.keys(n).filter(u=>!["timeout","timeoutMs"].includes(u));if(o.length===0)return"";const l=o[0],c=n[l];return typeof c=="string"?`${l}: ${Z(c,35)}`:""}}function wo(e,t){if(!t)return"";const n=e.toLowerCase(),s=t.split(`
`),i=s.length,a=t.length;if(["read","files_read"].includes(n))return`${a.toLocaleString()} chars${i>1?`, ${i} lines`:""}`;if(n==="exec")return i>1?`${i} lines`:Z(s[0],50);if(["web_search","memory_search"].includes(n))try{const o=JSON.parse(t),l=o.results?.length??o.count??0;return`${l} result${l!==1?"s":""}`}catch{return Z(t,40)}return n==="browser"?t.includes("snapshot")?"snapshot captured":t.includes("success")?"success":Z(t,40):a>100?`${a.toLocaleString()} chars`:Z(t,50)}function ko(e){if(!e)return!0;const t=e.toLowerCase();return!(t.includes("error:")||t.includes("failed")||t.includes("exception")||t.includes("not found"))}function lu(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(i=>{if(!i||typeof i!="object")return null;const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>!!i);return s.length===0?null:s.join(`
`)}function $o(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=lu(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=typeof e=="object"?"[object]":String(e)}const s=hl(n,ru);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function cu(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function du(e){if(e.toolStreamOrder.length<=yo)return;const t=e.toolStreamOrder.length-yo,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function uu(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function pi(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),uu(e)}function pu(e,t=!1){if(t){pi(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>pi(e),ou))}function Hi(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],e.currentToolName=null,e.currentToolInfo=null;const t=e;t.compactionStatus&&(t.compactionStatus=null),t.compactionClearTimer!=null&&(window.clearTimeout(t.compactionClearTimer),t.compactionClearTimer=null),pi(e)}const hu=5e3;function fu(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},hu))}function gu(e,t){if(!t)return;if(t.stream==="compaction"){fu(e,t);return}if(t.stream!=="tool")return;const n=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(n&&n!==e.sessionKey||!n&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const s=t.data??{},i=typeof s.toolCallId=="string"?s.toolCallId:"";if(!i)return;const a=typeof s.name=="string"?s.name:"tool",o=typeof s.phase=="string"?s.phase:"",l=o==="start"?s.args:void 0,c=o==="update"?$o(s.partialResult):o==="result"?$o(s.result):void 0,u=Date.now();let p=e.toolStreamById.get(i);p?(p.name=a,l!==void 0&&(p.args=l,p.displayArgs=bo(a,l)),c!==void 0&&(p.output=c,p.resultSummary=wo(a,c),p.success=ko(c)),p.updatedAt=u):(p={toolCallId:i,runId:t.runId,sessionKey:n,name:a,args:l,output:c,startedAt:typeof t.ts=="number"?t.ts:u,updatedAt:u,message:{},displayArgs:l?bo(a,l):void 0},e.toolStreamById.set(i,p),e.toolStreamOrder.push(i)),o==="start"?(e.currentToolName=a,e.currentToolInfo={name:a,details:p.displayArgs||void 0,startedAt:p.startedAt}):o==="result"&&(e.currentToolName=null,e.currentToolInfo=null,p.completedAt=u,p.resultSummary=wo(a,p.output),p.success=ko(p.output)),p.message=cu(p),du(e),pu(e,o==="result")}async function mu(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const t=await e.client.request("agents.list",{});t&&(e.agentsList=t)}catch(t){e.agentsError=String(t)}finally{e.agentsLoading=!1}}}const fl=50,gl=200,vu="Assistant";function Hn(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function hi(e){const t=Hn(e?.name,fl)??vu,n=Hn(e?.avatar??void 0,gl)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}function yu(){return hi(typeof window>"u"?{}:{name:window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__CLAWDBOT_ASSISTANT_AVATAR__})}const bu="You";function So(e){const t=Hn(e?.name,fl)??bu,n=Hn(e?.avatar??void 0,gl)??null;return{name:t,avatar:n}}function wu(){return So(typeof window>"u"?{}:{name:window.__CLAWDBOT_USER_NAME__,avatar:window.__CLAWDBOT_USER_AVATAR__})}async function ml(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const i=await e.client.request("agent.identity.get",s);if(!i)return;const a=hi(i);e.assistantName=a.name,e.assistantAvatar=a.avatar,e.assistantAgentId=a.agentId??null}catch{}}const Ao="NO_REPLY",ku=/^\[([^\]]+)\]\s*/,$u=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],Ps=new WeakMap,Ds=new WeakMap;function Su(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:$u.some(t=>e.startsWith(`${t} `))}function Ns(e){const t=e.match(ku);if(!t)return e;const n=t[1]??"";return Su(n)?e.slice(t[0].length):e}function Os(e){const t=e.trim();return t===Ao||t.startsWith(`${Ao}
`)}function fi(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string"){const i=n==="assistant"?Rs(s):Ns(s);return Os(i)?null:i}if(Array.isArray(s)){const i=s.map(a=>{const o=a;return o.type==="text"&&typeof o.text=="string"?o.text:null}).filter(a=>typeof a=="string");if(i.length>0){const a=i.join(`
`),o=n==="assistant"?Rs(a):Ns(a);return Os(o)?null:o}}if(typeof t.text=="string"){const i=n==="assistant"?Rs(t.text):Ns(t.text);return Os(i)?null:i}return null}function vl(e){if(!e||typeof e!="object")return fi(e);const t=e;if(Ps.has(t))return Ps.get(t)??null;const n=fi(e);return Ps.set(t,n),n}function xo(e){const n=e.content,s=[];if(Array.isArray(n))for(const l of n){const c=l;if(c.type==="thinking"&&typeof c.thinking=="string"){const u=c.thinking.trim();u&&s.push(u)}}if(s.length>0)return s.join(`
`);const i=xu(e);if(!i)return null;const o=[...i.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(l=>(l[1]??"").trim()).filter(Boolean);return o.length>0?o.join(`
`):null}function Au(e){if(!e||typeof e!="object")return xo(e);const t=e;if(Ds.has(t))return Ds.get(t)??null;const n=xo(e);return Ds.set(t,n),n}function xu(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(i=>{const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>typeof i=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function _u(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}const{entries:yl,setPrototypeOf:_o,isFrozen:Tu,getPrototypeOf:Cu,getOwnPropertyDescriptor:Lu}=Object;let{freeze:ie,seal:he,create:gi}=Object,{apply:mi,construct:vi}=typeof Reflect<"u"&&Reflect;ie||(ie=function(t){return t});he||(he=function(t){return t});mi||(mi=function(t,n){for(var s=arguments.length,i=new Array(s>2?s-2:0),a=2;a<s;a++)i[a-2]=arguments[a];return t.apply(n,i)});vi||(vi=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return new t(...s)});const Cn=ae(Array.prototype.forEach),Eu=ae(Array.prototype.lastIndexOf),To=ae(Array.prototype.pop),Wt=ae(Array.prototype.push),Iu=ae(Array.prototype.splice),Dn=ae(String.prototype.toLowerCase),Bs=ae(String.prototype.toString),Fs=ae(String.prototype.match),Ht=ae(String.prototype.replace),Mu=ae(String.prototype.indexOf),Ru=ae(String.prototype.trim),fe=ae(Object.prototype.hasOwnProperty),ne=ae(RegExp.prototype.test),zt=Pu(TypeError);function ae(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return mi(e,t,s)}}function Pu(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return vi(e,n)}}function O(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Dn;_o&&_o(e,null);let s=t.length;for(;s--;){let i=t[s];if(typeof i=="string"){const a=n(i);a!==i&&(Tu(t)||(t[s]=a),i=a)}e[i]=!0}return e}function Du(e){for(let t=0;t<e.length;t++)fe(e,t)||(e[t]=null);return e}function $e(e){const t=gi(null);for(const[n,s]of yl(e))fe(e,n)&&(Array.isArray(s)?t[n]=Du(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=$e(s):t[n]=s);return t}function jt(e,t){for(;e!==null;){const s=Lu(e,t);if(s){if(s.get)return ae(s.get);if(typeof s.value=="function")return ae(s.value)}e=Cu(e)}function n(){return null}return n}const Co=ie(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Us=ie(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Ks=ie(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Nu=ie(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Ws=ie(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Ou=ie(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Lo=ie(["#text"]),Eo=ie(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Hs=ie(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Io=ie(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Ln=ie(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Bu=he(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Fu=he(/<%[\w\W]*|[\w\W]*%>/gm),Uu=he(/\$\{[\w\W]*/gm),Ku=he(/^data-[\-\w.\u00B7-\uFFFF]+$/),Wu=he(/^aria-[\-\w]+$/),bl=he(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Hu=he(/^(?:\w+script|data):/i),zu=he(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),wl=he(/^html$/i),ju=he(/^[a-z][.\w]*(-[.\w]+)+$/i);var Mo=Object.freeze({__proto__:null,ARIA_ATTR:Wu,ATTR_WHITESPACE:zu,CUSTOM_ELEMENT:ju,DATA_ATTR:Ku,DOCTYPE_NAME:wl,ERB_EXPR:Fu,IS_ALLOWED_URI:bl,IS_SCRIPT_OR_DATA:Hu,MUSTACHE_EXPR:Bu,TMPLIT_EXPR:Uu});const Vt={element:1,text:3,progressingInstruction:7,comment:8,document:9},Vu=function(){return typeof window>"u"?null:window},Gu=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(s=n.getAttribute(i));const a="dompurify"+(s?"#"+s:"");try{return t.createPolicy(a,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+a+" could not be created."),null}},Ro=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function kl(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Vu();const t=I=>kl(I);if(t.version="3.3.1",t.removed=[],!e||!e.document||e.document.nodeType!==Vt.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,i=s.currentScript,{DocumentFragment:a,HTMLTemplateElement:o,Node:l,Element:c,NodeFilter:u,NamedNodeMap:p=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:h,DOMParser:g,trustedTypes:d}=e,m=c.prototype,k=jt(m,"cloneNode"),$=jt(m,"remove"),S=jt(m,"nextSibling"),x=jt(m,"childNodes"),L=jt(m,"parentNode");if(typeof o=="function"){const I=n.createElement("template");I.content&&I.content.ownerDocument&&(n=I.content.ownerDocument)}let C,E="";const{implementation:P,createNodeIterator:R,createDocumentFragment:oe,getElementsByTagName:M}=n,{importNode:B}=s;let N=Ro();t.isSupported=typeof yl=="function"&&typeof L=="function"&&P&&P.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:z,ERB_EXPR:D,TMPLIT_EXPR:xe,DATA_ATTR:qe,ARIA_ATTR:Ye,IS_SCRIPT_OR_DATA:Vc,ATTR_WHITESPACE:Ma,CUSTOM_ELEMENT:Gc}=Mo;let{IS_ALLOWED_URI:Ra}=Mo,q=null;const Pa=O({},[...Co,...Us,...Ks,...Ws,...Lo]);let Q=null;const Da=O({},[...Eo,...Hs,...Io,...Ln]);let j=Object.seal(gi(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Bt=null,ws=null;const mt=Object.seal(gi(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Na=!0,ks=!0,Oa=!1,Ba=!0,vt=!1,yn=!0,Qe=!1,$s=!1,Ss=!1,yt=!1,bn=!1,wn=!1,Fa=!0,Ua=!1;const qc="user-content-";let As=!0,Ft=!1,bt={},be=null;const xs=O({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Ka=null;const Wa=O({},["audio","video","img","source","image","track"]);let _s=null;const Ha=O({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),kn="http://www.w3.org/1998/Math/MathML",$n="http://www.w3.org/2000/svg",_e="http://www.w3.org/1999/xhtml";let wt=_e,Ts=!1,Cs=null;const Yc=O({},[kn,$n,_e],Bs);let Sn=O({},["mi","mo","mn","ms","mtext"]),An=O({},["annotation-xml"]);const Qc=O({},["title","style","font","a","script"]);let Ut=null;const Jc=["application/xhtml+xml","text/html"],Xc="text/html";let G=null,kt=null;const Zc=n.createElement("form"),za=function(w){return w instanceof RegExp||w instanceof Function},Ls=function(){let w=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(kt&&kt===w)){if((!w||typeof w!="object")&&(w={}),w=$e(w),Ut=Jc.indexOf(w.PARSER_MEDIA_TYPE)===-1?Xc:w.PARSER_MEDIA_TYPE,G=Ut==="application/xhtml+xml"?Bs:Dn,q=fe(w,"ALLOWED_TAGS")?O({},w.ALLOWED_TAGS,G):Pa,Q=fe(w,"ALLOWED_ATTR")?O({},w.ALLOWED_ATTR,G):Da,Cs=fe(w,"ALLOWED_NAMESPACES")?O({},w.ALLOWED_NAMESPACES,Bs):Yc,_s=fe(w,"ADD_URI_SAFE_ATTR")?O($e(Ha),w.ADD_URI_SAFE_ATTR,G):Ha,Ka=fe(w,"ADD_DATA_URI_TAGS")?O($e(Wa),w.ADD_DATA_URI_TAGS,G):Wa,be=fe(w,"FORBID_CONTENTS")?O({},w.FORBID_CONTENTS,G):xs,Bt=fe(w,"FORBID_TAGS")?O({},w.FORBID_TAGS,G):$e({}),ws=fe(w,"FORBID_ATTR")?O({},w.FORBID_ATTR,G):$e({}),bt=fe(w,"USE_PROFILES")?w.USE_PROFILES:!1,Na=w.ALLOW_ARIA_ATTR!==!1,ks=w.ALLOW_DATA_ATTR!==!1,Oa=w.ALLOW_UNKNOWN_PROTOCOLS||!1,Ba=w.ALLOW_SELF_CLOSE_IN_ATTR!==!1,vt=w.SAFE_FOR_TEMPLATES||!1,yn=w.SAFE_FOR_XML!==!1,Qe=w.WHOLE_DOCUMENT||!1,yt=w.RETURN_DOM||!1,bn=w.RETURN_DOM_FRAGMENT||!1,wn=w.RETURN_TRUSTED_TYPE||!1,Ss=w.FORCE_BODY||!1,Fa=w.SANITIZE_DOM!==!1,Ua=w.SANITIZE_NAMED_PROPS||!1,As=w.KEEP_CONTENT!==!1,Ft=w.IN_PLACE||!1,Ra=w.ALLOWED_URI_REGEXP||bl,wt=w.NAMESPACE||_e,Sn=w.MATHML_TEXT_INTEGRATION_POINTS||Sn,An=w.HTML_INTEGRATION_POINTS||An,j=w.CUSTOM_ELEMENT_HANDLING||{},w.CUSTOM_ELEMENT_HANDLING&&za(w.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(j.tagNameCheck=w.CUSTOM_ELEMENT_HANDLING.tagNameCheck),w.CUSTOM_ELEMENT_HANDLING&&za(w.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(j.attributeNameCheck=w.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),w.CUSTOM_ELEMENT_HANDLING&&typeof w.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(j.allowCustomizedBuiltInElements=w.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),vt&&(ks=!1),bn&&(yt=!0),bt&&(q=O({},Lo),Q=[],bt.html===!0&&(O(q,Co),O(Q,Eo)),bt.svg===!0&&(O(q,Us),O(Q,Hs),O(Q,Ln)),bt.svgFilters===!0&&(O(q,Ks),O(Q,Hs),O(Q,Ln)),bt.mathMl===!0&&(O(q,Ws),O(Q,Io),O(Q,Ln))),w.ADD_TAGS&&(typeof w.ADD_TAGS=="function"?mt.tagCheck=w.ADD_TAGS:(q===Pa&&(q=$e(q)),O(q,w.ADD_TAGS,G))),w.ADD_ATTR&&(typeof w.ADD_ATTR=="function"?mt.attributeCheck=w.ADD_ATTR:(Q===Da&&(Q=$e(Q)),O(Q,w.ADD_ATTR,G))),w.ADD_URI_SAFE_ATTR&&O(_s,w.ADD_URI_SAFE_ATTR,G),w.FORBID_CONTENTS&&(be===xs&&(be=$e(be)),O(be,w.FORBID_CONTENTS,G)),w.ADD_FORBID_CONTENTS&&(be===xs&&(be=$e(be)),O(be,w.ADD_FORBID_CONTENTS,G)),As&&(q["#text"]=!0),Qe&&O(q,["html","head","body"]),q.table&&(O(q,["tbody"]),delete Bt.tbody),w.TRUSTED_TYPES_POLICY){if(typeof w.TRUSTED_TYPES_POLICY.createHTML!="function")throw zt('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof w.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw zt('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');C=w.TRUSTED_TYPES_POLICY,E=C.createHTML("")}else C===void 0&&(C=Gu(d,i)),C!==null&&typeof E=="string"&&(E=C.createHTML(""));ie&&ie(w),kt=w}},ja=O({},[...Us,...Ks,...Nu]),Va=O({},[...Ws,...Ou]),ed=function(w){let A=L(w);(!A||!A.tagName)&&(A={namespaceURI:wt,tagName:"template"});const T=Dn(w.tagName),H=Dn(A.tagName);return Cs[w.namespaceURI]?w.namespaceURI===$n?A.namespaceURI===_e?T==="svg":A.namespaceURI===kn?T==="svg"&&(H==="annotation-xml"||Sn[H]):!!ja[T]:w.namespaceURI===kn?A.namespaceURI===_e?T==="math":A.namespaceURI===$n?T==="math"&&An[H]:!!Va[T]:w.namespaceURI===_e?A.namespaceURI===$n&&!An[H]||A.namespaceURI===kn&&!Sn[H]?!1:!Va[T]&&(Qc[T]||!ja[T]):!!(Ut==="application/xhtml+xml"&&Cs[w.namespaceURI]):!1},we=function(w){Wt(t.removed,{element:w});try{L(w).removeChild(w)}catch{$(w)}},Je=function(w,A){try{Wt(t.removed,{attribute:A.getAttributeNode(w),from:A})}catch{Wt(t.removed,{attribute:null,from:A})}if(A.removeAttribute(w),w==="is")if(yt||bn)try{we(A)}catch{}else try{A.setAttribute(w,"")}catch{}},Ga=function(w){let A=null,T=null;if(Ss)w="<remove></remove>"+w;else{const V=Fs(w,/^[\r\n\t ]+/);T=V&&V[0]}Ut==="application/xhtml+xml"&&wt===_e&&(w='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+w+"</body></html>");const H=C?C.createHTML(w):w;if(wt===_e)try{A=new g().parseFromString(H,Ut)}catch{}if(!A||!A.documentElement){A=P.createDocument(wt,"template",null);try{A.documentElement.innerHTML=Ts?E:H}catch{}}const ee=A.body||A.documentElement;return w&&T&&ee.insertBefore(n.createTextNode(T),ee.childNodes[0]||null),wt===_e?M.call(A,Qe?"html":"body")[0]:Qe?A.documentElement:ee},qa=function(w){return R.call(w.ownerDocument||w,w,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},Es=function(w){return w instanceof h&&(typeof w.nodeName!="string"||typeof w.textContent!="string"||typeof w.removeChild!="function"||!(w.attributes instanceof p)||typeof w.removeAttribute!="function"||typeof w.setAttribute!="function"||typeof w.namespaceURI!="string"||typeof w.insertBefore!="function"||typeof w.hasChildNodes!="function")},Ya=function(w){return typeof l=="function"&&w instanceof l};function Te(I,w,A){Cn(I,T=>{T.call(t,w,A,kt)})}const Qa=function(w){let A=null;if(Te(N.beforeSanitizeElements,w,null),Es(w))return we(w),!0;const T=G(w.nodeName);if(Te(N.uponSanitizeElement,w,{tagName:T,allowedTags:q}),yn&&w.hasChildNodes()&&!Ya(w.firstElementChild)&&ne(/<[/\w!]/g,w.innerHTML)&&ne(/<[/\w!]/g,w.textContent)||w.nodeType===Vt.progressingInstruction||yn&&w.nodeType===Vt.comment&&ne(/<[/\w]/g,w.data))return we(w),!0;if(!(mt.tagCheck instanceof Function&&mt.tagCheck(T))&&(!q[T]||Bt[T])){if(!Bt[T]&&Xa(T)&&(j.tagNameCheck instanceof RegExp&&ne(j.tagNameCheck,T)||j.tagNameCheck instanceof Function&&j.tagNameCheck(T)))return!1;if(As&&!be[T]){const H=L(w)||w.parentNode,ee=x(w)||w.childNodes;if(ee&&H){const V=ee.length;for(let re=V-1;re>=0;--re){const Ce=k(ee[re],!0);Ce.__removalCount=(w.__removalCount||0)+1,H.insertBefore(Ce,S(w))}}}return we(w),!0}return w instanceof c&&!ed(w)||(T==="noscript"||T==="noembed"||T==="noframes")&&ne(/<\/no(script|embed|frames)/i,w.innerHTML)?(we(w),!0):(vt&&w.nodeType===Vt.text&&(A=w.textContent,Cn([z,D,xe],H=>{A=Ht(A,H," ")}),w.textContent!==A&&(Wt(t.removed,{element:w.cloneNode()}),w.textContent=A)),Te(N.afterSanitizeElements,w,null),!1)},Ja=function(w,A,T){if(Fa&&(A==="id"||A==="name")&&(T in n||T in Zc))return!1;if(!(ks&&!ws[A]&&ne(qe,A))){if(!(Na&&ne(Ye,A))){if(!(mt.attributeCheck instanceof Function&&mt.attributeCheck(A,w))){if(!Q[A]||ws[A]){if(!(Xa(w)&&(j.tagNameCheck instanceof RegExp&&ne(j.tagNameCheck,w)||j.tagNameCheck instanceof Function&&j.tagNameCheck(w))&&(j.attributeNameCheck instanceof RegExp&&ne(j.attributeNameCheck,A)||j.attributeNameCheck instanceof Function&&j.attributeNameCheck(A,w))||A==="is"&&j.allowCustomizedBuiltInElements&&(j.tagNameCheck instanceof RegExp&&ne(j.tagNameCheck,T)||j.tagNameCheck instanceof Function&&j.tagNameCheck(T))))return!1}else if(!_s[A]){if(!ne(Ra,Ht(T,Ma,""))){if(!((A==="src"||A==="xlink:href"||A==="href")&&w!=="script"&&Mu(T,"data:")===0&&Ka[w])){if(!(Oa&&!ne(Vc,Ht(T,Ma,"")))){if(T)return!1}}}}}}}return!0},Xa=function(w){return w!=="annotation-xml"&&Fs(w,Gc)},Za=function(w){Te(N.beforeSanitizeAttributes,w,null);const{attributes:A}=w;if(!A||Es(w))return;const T={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:Q,forceKeepAttr:void 0};let H=A.length;for(;H--;){const ee=A[H],{name:V,namespaceURI:re,value:Ce}=ee,$t=G(V),Is=Ce;let J=V==="value"?Is:Ru(Is);if(T.attrName=$t,T.attrValue=J,T.keepAttr=!0,T.forceKeepAttr=void 0,Te(N.uponSanitizeAttribute,w,T),J=T.attrValue,Ua&&($t==="id"||$t==="name")&&(Je(V,w),J=qc+J),yn&&ne(/((--!?|])>)|<\/(style|title|textarea)/i,J)){Je(V,w);continue}if($t==="attributename"&&Fs(J,"href")){Je(V,w);continue}if(T.forceKeepAttr)continue;if(!T.keepAttr){Je(V,w);continue}if(!Ba&&ne(/\/>/i,J)){Je(V,w);continue}vt&&Cn([z,D,xe],to=>{J=Ht(J,to," ")});const eo=G(w.nodeName);if(!Ja(eo,$t,J)){Je(V,w);continue}if(C&&typeof d=="object"&&typeof d.getAttributeType=="function"&&!re)switch(d.getAttributeType(eo,$t)){case"TrustedHTML":{J=C.createHTML(J);break}case"TrustedScriptURL":{J=C.createScriptURL(J);break}}if(J!==Is)try{re?w.setAttributeNS(re,V,J):w.setAttribute(V,J),Es(w)?we(w):To(t.removed)}catch{Je(V,w)}}Te(N.afterSanitizeAttributes,w,null)},td=function I(w){let A=null;const T=qa(w);for(Te(N.beforeSanitizeShadowDOM,w,null);A=T.nextNode();)Te(N.uponSanitizeShadowNode,A,null),Qa(A),Za(A),A.content instanceof a&&I(A.content);Te(N.afterSanitizeShadowDOM,w,null)};return t.sanitize=function(I){let w=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},A=null,T=null,H=null,ee=null;if(Ts=!I,Ts&&(I="<!-->"),typeof I!="string"&&!Ya(I))if(typeof I.toString=="function"){if(I=I.toString(),typeof I!="string")throw zt("dirty is not a string, aborting")}else throw zt("toString is not a function");if(!t.isSupported)return I;if($s||Ls(w),t.removed=[],typeof I=="string"&&(Ft=!1),Ft){if(I.nodeName){const Ce=G(I.nodeName);if(!q[Ce]||Bt[Ce])throw zt("root node is forbidden and cannot be sanitized in-place")}}else if(I instanceof l)A=Ga("<!---->"),T=A.ownerDocument.importNode(I,!0),T.nodeType===Vt.element&&T.nodeName==="BODY"||T.nodeName==="HTML"?A=T:A.appendChild(T);else{if(!yt&&!vt&&!Qe&&I.indexOf("<")===-1)return C&&wn?C.createHTML(I):I;if(A=Ga(I),!A)return yt?null:wn?E:""}A&&Ss&&we(A.firstChild);const V=qa(Ft?I:A);for(;H=V.nextNode();)Qa(H),Za(H),H.content instanceof a&&td(H.content);if(Ft)return I;if(yt){if(bn)for(ee=oe.call(A.ownerDocument);A.firstChild;)ee.appendChild(A.firstChild);else ee=A;return(Q.shadowroot||Q.shadowrootmode)&&(ee=B.call(s,ee,!0)),ee}let re=Qe?A.outerHTML:A.innerHTML;return Qe&&q["!doctype"]&&A.ownerDocument&&A.ownerDocument.doctype&&A.ownerDocument.doctype.name&&ne(wl,A.ownerDocument.doctype.name)&&(re="<!DOCTYPE "+A.ownerDocument.doctype.name+`>
`+re),vt&&Cn([z,D,xe],Ce=>{re=Ht(re,Ce," ")}),C&&wn?C.createHTML(re):re},t.setConfig=function(){let I=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Ls(I),$s=!0},t.clearConfig=function(){kt=null,$s=!1},t.isValidAttribute=function(I,w,A){kt||Ls({});const T=G(I),H=G(w);return Ja(T,H,A)},t.addHook=function(I,w){typeof w=="function"&&Wt(N[I],w)},t.removeHook=function(I,w){if(w!==void 0){const A=Eu(N[I],w);return A===-1?void 0:Iu(N[I],A,1)[0]}return To(N[I])},t.removeHooks=function(I){N[I]=[]},t.removeAllHooks=function(){N=Ro()},t}var zn=kl();function zi(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var gt=zi();function $l(e){gt=e}var ot={exec:()=>null};function F(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(i,a)=>{let o=typeof a=="string"?a:a.source;return o=o.replace(se.caret,"$1"),n=n.replace(i,o),s},getRegex:()=>new RegExp(n,t)};return s}var qu=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),se={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},Yu=/^(?:[ \t]*(?:\n|$))+/,Qu=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ju=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,gn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Xu=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,ji=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Sl=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Al=F(Sl).replace(/bull/g,ji).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Zu=F(Sl).replace(/bull/g,ji).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Vi=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,ep=/^[^\n]+/,Gi=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,tp=F(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Gi).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),np=F(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,ji).getRegex(),is="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",qi=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,sp=F("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",qi).replace("tag",is).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),xl=F(Vi).replace("hr",gn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",is).getRegex(),ip=F(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",xl).getRegex(),Yi={blockquote:ip,code:Qu,def:tp,fences:Ju,heading:Xu,hr:gn,html:sp,lheading:Al,list:np,newline:Yu,paragraph:xl,table:ot,text:ep},Po=F("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",gn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",is).getRegex(),ap={...Yi,lheading:Zu,table:Po,paragraph:F(Vi).replace("hr",gn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Po).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",is).getRegex()},op={...Yi,html:F(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",qi).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:ot,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:F(Vi).replace("hr",gn).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Al).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},rp=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,lp=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,_l=/^( {2,}|\\)\n(?!\s*$)/,cp=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,as=/[\p{P}\p{S}]/u,Qi=/[\s\p{P}\p{S}]/u,Tl=/[^\s\p{P}\p{S}]/u,dp=F(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Qi).getRegex(),Cl=/(?!~)[\p{P}\p{S}]/u,up=/(?!~)[\s\p{P}\p{S}]/u,pp=/(?:[^\s\p{P}\p{S}]|~)/u,Ll=/(?![*_])[\p{P}\p{S}]/u,hp=/(?![*_])[\s\p{P}\p{S}]/u,fp=/(?:[^\s\p{P}\p{S}]|[*_])/u,gp=F(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",qu?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),El=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,mp=F(El,"u").replace(/punct/g,as).getRegex(),vp=F(El,"u").replace(/punct/g,Cl).getRegex(),Il="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",yp=F(Il,"gu").replace(/notPunctSpace/g,Tl).replace(/punctSpace/g,Qi).replace(/punct/g,as).getRegex(),bp=F(Il,"gu").replace(/notPunctSpace/g,pp).replace(/punctSpace/g,up).replace(/punct/g,Cl).getRegex(),wp=F("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Tl).replace(/punctSpace/g,Qi).replace(/punct/g,as).getRegex(),kp=F(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Ll).getRegex(),$p="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Sp=F($p,"gu").replace(/notPunctSpace/g,fp).replace(/punctSpace/g,hp).replace(/punct/g,Ll).getRegex(),Ap=F(/\\(punct)/,"gu").replace(/punct/g,as).getRegex(),xp=F(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),_p=F(qi).replace("(?:-->|$)","-->").getRegex(),Tp=F("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",_p).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),jn=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Cp=F(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",jn).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Ml=F(/^!?\[(label)\]\[(ref)\]/).replace("label",jn).replace("ref",Gi).getRegex(),Rl=F(/^!?\[(ref)\](?:\[\])?/).replace("ref",Gi).getRegex(),Lp=F("reflink|nolink(?!\\()","g").replace("reflink",Ml).replace("nolink",Rl).getRegex(),Do=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Ji={_backpedal:ot,anyPunctuation:Ap,autolink:xp,blockSkip:gp,br:_l,code:lp,del:ot,delLDelim:ot,delRDelim:ot,emStrongLDelim:mp,emStrongRDelimAst:yp,emStrongRDelimUnd:wp,escape:rp,link:Cp,nolink:Rl,punctuation:dp,reflink:Ml,reflinkSearch:Lp,tag:Tp,text:cp,url:ot},Ep={...Ji,link:F(/^!?\[(label)\]\((.*?)\)/).replace("label",jn).getRegex(),reflink:F(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",jn).getRegex()},yi={...Ji,emStrongRDelimAst:bp,emStrongLDelim:vp,delLDelim:kp,delRDelim:Sp,url:F(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Do).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:F(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Do).getRegex()},Ip={...yi,br:F(_l).replace("{2,}","*").getRegex(),text:F(yi.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},En={normal:Yi,gfm:ap,pedantic:op},Gt={normal:Ji,gfm:yi,breaks:Ip,pedantic:Ep},Mp={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},No=e=>Mp[e];function Se(e,t){if(t){if(se.escapeTest.test(e))return e.replace(se.escapeReplace,No)}else if(se.escapeTestNoEncode.test(e))return e.replace(se.escapeReplaceNoEncode,No);return e}function Oo(e){try{e=encodeURI(e).replace(se.percentDecode,"%")}catch{return null}return e}function Bo(e,t){let n=e.replace(se.findPipe,(a,o,l)=>{let c=!1,u=o;for(;--u>=0&&l[u]==="\\";)c=!c;return c?"|":" |"}),s=n.split(se.splitPipe),i=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;i<s.length;i++)s[i]=s[i].trim().replace(se.slashPipe,"|");return s}function qt(e,t,n){let s=e.length;if(s===0)return"";let i=0;for(;i<s&&e.charAt(s-i-1)===t;)i++;return e.slice(0,s-i)}function Rp(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function Pp(e,t=0){let n=t,s="";for(let i of e)if(i==="	"){let a=4-n%4;s+=" ".repeat(a),n+=a}else s+=i,n++;return s}function Fo(e,t,n,s,i){let a=t.href,o=t.title||null,l=e[1].replace(i.other.outputLinkReplace,"$1");s.state.inLink=!0;let c={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:o,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,c}function Dp(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let i=s[1];return t.split(`
`).map(a=>{let o=a.match(n.other.beginningSpace);if(o===null)return a;let[l]=o;return l.length>=i.length?a.slice(i.length):a}).join(`
`)}var Vn=class{options;rules;lexer;constructor(e){this.options=e||gt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:qt(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=Dp(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=qt(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:qt(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=qt(t[0],`
`).split(`
`),s="",i="",a=[];for(;n.length>0;){let o=!1,l=[],c;for(c=0;c<n.length;c++)if(this.rules.other.blockquoteStart.test(n[c]))l.push(n[c]),o=!0;else if(!o)l.push(n[c]);else break;n=n.slice(c);let u=l.join(`
`),p=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${u}`:u,i=i?`${i}
${p}`:p;let h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(p,a,!0),this.lexer.state.top=h,n.length===0)break;let g=a.at(-1);if(g?.type==="code")break;if(g?.type==="blockquote"){let d=g,m=d.raw+`
`+n.join(`
`),k=this.blockquote(m);a[a.length-1]=k,s=s.substring(0,s.length-d.raw.length)+k.raw,i=i.substring(0,i.length-d.text.length)+k.text;break}else if(g?.type==="list"){let d=g,m=d.raw+`
`+n.join(`
`),k=this.list(m);a[a.length-1]=k,s=s.substring(0,s.length-g.raw.length)+k.raw,i=i.substring(0,i.length-d.raw.length)+k.raw,n=m.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:a,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,i={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let c=!1,u="",p="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;u=t[0],e=e.substring(u.length);let h=Pp(t[2].split(`
`,1)[0],t[1].length),g=e.split(`
`,1)[0],d=!h.trim(),m=0;if(this.options.pedantic?(m=2,p=h.trimStart()):d?m=t[1].length+1:(m=h.search(this.rules.other.nonSpaceChar),m=m>4?1:m,p=h.slice(m),m+=t[1].length),d&&this.rules.other.blankLine.test(g)&&(u+=g+`
`,e=e.substring(g.length+1),c=!0),!c){let k=this.rules.other.nextBulletRegex(m),$=this.rules.other.hrRegex(m),S=this.rules.other.fencesBeginRegex(m),x=this.rules.other.headingBeginRegex(m),L=this.rules.other.htmlBeginRegex(m),C=this.rules.other.blockquoteBeginRegex(m);for(;e;){let E=e.split(`
`,1)[0],P;if(g=E,this.options.pedantic?(g=g.replace(this.rules.other.listReplaceNesting,"  "),P=g):P=g.replace(this.rules.other.tabCharGlobal,"    "),S.test(g)||x.test(g)||L.test(g)||C.test(g)||k.test(g)||$.test(g))break;if(P.search(this.rules.other.nonSpaceChar)>=m||!g.trim())p+=`
`+P.slice(m);else{if(d||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||S.test(h)||x.test(h)||$.test(h))break;p+=`
`+g}d=!g.trim(),u+=E+`
`,e=e.substring(E.length+1),h=P.slice(m)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(o=!0)),i.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(p),loose:!1,text:p,tokens:[]}),i.raw+=u}let l=i.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let c of i.items){if(this.lexer.state.top=!1,c.tokens=this.lexer.blockTokens(c.text,[]),c.task){if(c.text=c.text.replace(this.rules.other.listReplaceTask,""),c.tokens[0]?.type==="text"||c.tokens[0]?.type==="paragraph"){c.tokens[0].raw=c.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),c.tokens[0].text=c.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let p=this.lexer.inlineQueue.length-1;p>=0;p--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[p].src)){this.lexer.inlineQueue[p].src=this.lexer.inlineQueue[p].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(c.raw);if(u){let p={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};c.checked=p.checked,i.loose?c.tokens[0]&&["paragraph","text"].includes(c.tokens[0].type)&&"tokens"in c.tokens[0]&&c.tokens[0].tokens?(c.tokens[0].raw=p.raw+c.tokens[0].raw,c.tokens[0].text=p.raw+c.tokens[0].text,c.tokens[0].tokens.unshift(p)):c.tokens.unshift({type:"paragraph",raw:p.raw,text:p.raw,tokens:[p]}):c.tokens.unshift(p)}}if(!i.loose){let u=c.tokens.filter(h=>h.type==="space"),p=u.length>0&&u.some(h=>this.rules.other.anyLine.test(h.raw));i.loose=p}}if(i.loose)for(let c of i.items){c.loose=!0;for(let u of c.tokens)u.type==="text"&&(u.type="paragraph")}return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Bo(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let o of s)this.rules.other.tableAlignRight.test(o)?a.align.push("right"):this.rules.other.tableAlignCenter.test(o)?a.align.push("center"):this.rules.other.tableAlignLeft.test(o)?a.align.push("left"):a.align.push(null);for(let o=0;o<n.length;o++)a.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:a.align[o]});for(let o of i)a.rows.push(Bo(o,a.header.length).map((l,c)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:a.align[c]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=qt(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=Rp(t[2],"()");if(a===-2)return;if(a>-1){let o=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,o).trim(),t[3]=""}}let s=t[2],i="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(s);a&&(s=a[1],i=a[3])}else i=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Fo(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=t[s.toLowerCase()];if(!i){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return Fo(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,a,o,l=i,c=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+i);(s=u.exec(t))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a)continue;if(o=[...a].length,s[3]||s[4]){l+=o;continue}else if((s[5]||s[6])&&i%3&&!((i+o)%3)){c+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l+c);let p=[...s[0]][0].length,h=e.slice(0,i+s.index+p+o);if(Math.min(i,o)%2){let d=h.slice(1,-1);return{type:"em",raw:h,text:d,tokens:this.lexer.inlineTokens(d)}}let g=h.slice(2,-2);return{type:"strong",raw:h,text:g,tokens:this.lexer.inlineTokens(g)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,a,o,l=i,c=this.rules.inline.delRDelim;for(c.lastIndex=0,t=t.slice(-1*e.length+i);(s=c.exec(t))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a||(o=[...a].length,o!==i))continue;if(s[3]||s[4]){l+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l);let u=[...s[0]][0].length,p=e.slice(0,i+s.index+u+o),h=p.slice(i,-i);return{type:"del",raw:p,text:h,tokens:this.lexer.inlineTokens(h)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},me=class bi{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||gt,this.options.tokenizer=this.options.tokenizer||new Vn,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:se,block:En.normal,inline:Gt.normal};this.options.pedantic?(n.block=En.pedantic,n.inline=Gt.pedantic):this.options.gfm&&(n.block=En.gfm,this.options.breaks?n.inline=Gt.breaks:n.inline=Gt.gfm),this.tokenizer.rules=n}static get rules(){return{block:En,inline:Gt}}static lex(t,n){return new bi(n).lex(t)}static lexInline(t,n){return new bi(n).inlineTokens(t)}lex(t){t=t.replace(se.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(se.tabCharGlobal,"    ").replace(se.spaceLine,""));t;){let i;if(this.options.extensions?.block?.some(o=>(i=o.call({lexer:this},t,n))?(t=t.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(t)){t=t.substring(i.raw.length);let o=n.at(-1);i.raw.length===1&&o!==void 0?o.raw+=`
`:n.push(i);continue}if(i=this.tokenizer.code(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.at(-1).src=o.text):n.push(i);continue}if(i=this.tokenizer.fences(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.heading(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.hr(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.blockquote(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.list(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.html(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.def(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},n.push(i));continue}if(i=this.tokenizer.table(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.lheading(t)){t=t.substring(i.raw.length),n.push(i);continue}let a=t;if(this.options.extensions?.startBlock){let o=1/0,l=t.slice(1),c;this.options.extensions.startBlock.forEach(u=>{c=u.call({lexer:this},l),typeof c=="number"&&c>=0&&(o=Math.min(o,c))}),o<1/0&&o>=0&&(a=t.substring(0,o+1))}if(this.state.top&&(i=this.tokenizer.paragraph(a))){let o=n.at(-1);s&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(i),s=a.length!==t.length,t=t.substring(i.raw.length);continue}if(i=this.tokenizer.text(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(i);continue}if(t){let o="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,i=null;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)c.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,i.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(i=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)a=i[2]?i[2].length:0,s=s.slice(0,i.index+a)+"["+"a".repeat(i[0].length-a-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let o=!1,l="";for(;t;){o||(l=""),o=!1;let c;if(this.options.extensions?.inline?.some(p=>(c=p.call({lexer:this},t,n))?(t=t.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.escape(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.tag(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.link(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(c.raw.length);let p=n.at(-1);c.type==="text"&&p?.type==="text"?(p.raw+=c.raw,p.text+=c.text):n.push(c);continue}if(c=this.tokenizer.emStrong(t,s,l)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.codespan(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.br(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.del(t,s,l)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.autolink(t)){t=t.substring(c.raw.length),n.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(t))){t=t.substring(c.raw.length),n.push(c);continue}let u=t;if(this.options.extensions?.startInline){let p=1/0,h=t.slice(1),g;this.options.extensions.startInline.forEach(d=>{g=d.call({lexer:this},h),typeof g=="number"&&g>=0&&(p=Math.min(p,g))}),p<1/0&&p>=0&&(u=t.substring(0,p+1))}if(c=this.tokenizer.inlineText(u)){t=t.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(l=c.raw.slice(-1)),o=!0;let p=n.at(-1);p?.type==="text"?(p.raw+=c.raw,p.text+=c.text):n.push(c);continue}if(t){let p="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(p);break}else throw new Error(p)}}return n}},Gn=class{options;parser;constructor(e){this.options=e||gt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(se.notSpaceStart)?.[0],i=e.replace(se.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Se(s)+'">'+(n?i:Se(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:Se(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let o=0;o<e.items.length;o++){let l=e.items[o];s+=this.listitem(l)}let i=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+i+a+`>
`+s+"</"+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let i=0;i<e.header.length;i++)n+=this.tablecell(e.header[i]);t+=this.tablerow({text:n});let s="";for(let i=0;i<e.rows.length;i++){let a=e.rows[i];n="";for(let o=0;o<a.length;o++)n+=this.tablecell(a[o]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Se(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),i=Oo(e);if(i===null)return s;e=i;let a='<a href="'+e+'"';return t&&(a+=' title="'+Se(t)+'"'),a+=">"+s+"</a>",a}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let i=Oo(e);if(i===null)return Se(n);e=i;let a=`<img src="${e}" alt="${Se(n)}"`;return t&&(a+=` title="${Se(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Se(e.text)}},Xi=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},ve=class wi{options;renderer;textRenderer;constructor(t){this.options=t||gt,this.options.renderer=this.options.renderer||new Gn,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Xi}static parse(t,n){return new wi(n).parse(t)}static parseInline(t,n){return new wi(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let i=t[s];if(this.options.extensions?.renderers?.[i.type]){let o=i,l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){n+=l||"";continue}}let a=i;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(t,n=this.renderer){let s="";for(let i=0;i<t.length;i++){let a=t[i];if(this.options.extensions?.renderers?.[a.type]){let l=this.options.extensions.renderers[a.type].call({parser:this},a);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){s+=l||"";continue}}let o=a;switch(o.type){case"escape":{s+=n.text(o);break}case"html":{s+=n.html(o);break}case"link":{s+=n.link(o);break}case"image":{s+=n.image(o);break}case"checkbox":{s+=n.checkbox(o);break}case"strong":{s+=n.strong(o);break}case"em":{s+=n.em(o);break}case"codespan":{s+=n.codespan(o);break}case"br":{s+=n.br(o);break}case"del":{s+=n.del(o);break}case"text":{s+=n.text(o);break}default:{let l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}},Xt=class{options;block;constructor(t){this.options=t||gt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?me.lex:me.lexInline}provideParser(){return this.block?ve.parse:ve.parseInline}},Np=class{defaults=zi();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=ve;Renderer=Gn;TextRenderer=Xi;Lexer=me;Tokenizer=Vn;Hooks=Xt;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let i=s;for(let a of i.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of i.rows)for(let o of a)n=n.concat(this.walkTokens(o.tokens,t));break}case"list":{let i=s;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=s;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(a=>{let o=i[a].flat(1/0);n=n.concat(this.walkTokens(o,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let a=t.renderers[i.name];a?t.renderers[i.name]=function(...o){let l=i.renderer.apply(this,o);return l===!1&&(l=a.apply(this,o)),l}:t.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[i.level];a?a.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens)}),s.extensions=t),n.renderer){let i=this.defaults.renderer||new Gn(this.defaults);for(let a in n.renderer){if(!(a in i))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let o=a,l=n.renderer[o],c=i[o];i[o]=(...u)=>{let p=l.apply(i,u);return p===!1&&(p=c.apply(i,u)),p||""}}s.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new Vn(this.defaults);for(let a in n.tokenizer){if(!(a in i))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let o=a,l=n.tokenizer[o],c=i[o];i[o]=(...u)=>{let p=l.apply(i,u);return p===!1&&(p=c.apply(i,u)),p}}s.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new Xt;for(let a in n.hooks){if(!(a in i))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let o=a,l=n.hooks[o],c=i[o];Xt.passThroughHooks.has(a)?i[o]=u=>{if(this.defaults.async&&Xt.passThroughHooksRespectAsync.has(a))return(async()=>{let h=await l.call(i,u);return c.call(i,h)})();let p=l.call(i,u);return c.call(i,p)}:i[o]=(...u)=>{if(this.defaults.async)return(async()=>{let h=await l.apply(i,u);return h===!1&&(h=await c.apply(i,u)),h})();let p=l.apply(i,u);return p===!1&&(p=c.apply(i,u)),p}}s.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,a=n.walkTokens;s.walkTokens=function(o){let l=[];return l.push(a.call(this,o)),i&&(l=l.concat(i.call(this,o))),l}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return me.lex(e,t??this.defaults)}parser(e,t){return ve.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},i={...this.defaults,...s},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&s.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let o=i.hooks?await i.hooks.preprocess(t):t,l=await(i.hooks?await i.hooks.provideLexer():e?me.lex:me.lexInline)(o,i),c=i.hooks?await i.hooks.processAllTokens(l):l;i.walkTokens&&await Promise.all(this.walkTokens(c,i.walkTokens));let u=await(i.hooks?await i.hooks.provideParser():e?ve.parse:ve.parseInline)(c,i);return i.hooks?await i.hooks.postprocess(u):u})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let o=(i.hooks?i.hooks.provideLexer():e?me.lex:me.lexInline)(t,i);i.hooks&&(o=i.hooks.processAllTokens(o)),i.walkTokens&&this.walkTokens(o,i.walkTokens);let l=(i.hooks?i.hooks.provideParser():e?ve.parse:ve.parseInline)(o,i);return i.hooks&&(l=i.hooks.postprocess(l)),l}catch(o){return a(o)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+Se(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},pt=new Np;function K(e,t){return pt.parse(e,t)}K.options=K.setOptions=function(e){return pt.setOptions(e),K.defaults=pt.defaults,$l(K.defaults),K};K.getDefaults=zi;K.defaults=gt;K.use=function(...e){return pt.use(...e),K.defaults=pt.defaults,$l(K.defaults),K};K.walkTokens=function(e,t){return pt.walkTokens(e,t)};K.parseInline=pt.parseInline;K.Parser=ve;K.parser=ve.parse;K.Renderer=Gn;K.TextRenderer=Xi;K.Lexer=me;K.lexer=me.lex;K.Tokenizer=Vn;K.Hooks=Xt;K.parse=K;K.options;K.setOptions;K.use;K.walkTokens;K.parseInline;ve.parse;me.lex;K.setOptions({gfm:!0,breaks:!0,mangle:!1});const ki=["a","article","aside","b","blockquote","br","caption","col","colgroup","code","div","del","details","em","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","hr","img","i","li","main","nav","ol","p","pre","section","span","strong","sub","sup","summary","table","tbody","td","th","thead","tr","ul"],$i=["alt","class","decoding","height","href","loading","open","rel","src","start","target","title","width"];let Uo=!1;const Op=14e4,Bp=4e4,Fp=200,zs=5e4,lt=new Map;function Up(e){const t=lt.get(e);return t===void 0?null:(lt.delete(e),lt.set(e,t),t)}function Ko(e,t){if(lt.set(e,t),lt.size<=Fp)return;const n=lt.keys().next().value;n&&lt.delete(n)}function Pl(){Uo||(Uo=!0,zn.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function ce(e){const t=e.trim();if(!t)return"";if(Pl(),t.length<=zs){const o=Up(t);if(o!==null)return o}const n=hl(t,Op),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>Bp){const l=`<pre class="code-block">${Wp(`${n.text}${s}`)}</pre>`,c=zn.sanitize(l,{ALLOWED_TAGS:ki,ALLOWED_ATTR:$i});return t.length<=zs&&Ko(t,c),c}const i=K.parse(`${n.text}${s}`),a=zn.sanitize(i,{ALLOWED_TAGS:ki,ALLOWED_ATTR:$i});return t.length<=zs&&Ko(t,a),a}function Kp(e){const t=e.trim();return t?(Pl(),zn.sanitize(t,{ALLOWED_TAGS:ki,ALLOWED_ATTR:$i,FORBID_TAGS:["base","iframe","link","meta","object","script"]})):""}function Wp(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Hp=500;let tt="",nt="";function zp(e){const t=e.trim();if(!t)return"";if(t.length<Hp)return ce(t);const n=Vp(t);if(n<0)return ce(t);const s=t.slice(0,n),i=t.slice(n);if(s===tt)return nt+ce(i);if(s.startsWith(tt)&&tt.length>0){const a=s.slice(tt.length);return nt=nt+ce(a),tt=s,nt+ce(i)}return nt=ce(s),tt=s,nt+ce(i)}function jp(){tt="",nt=""}function Vp(e){let t=!1,n="";const s=[];let i=0;for(;i<e.length;){const a=e.indexOf(`
`,i),o=a===-1?e.length:a,l=e.slice(i,o),c=l.trimStart(),u=c.match(/^(`{3,}|~{3,})/);if(u){const p=u[1];t?p.charAt(0)===n.charAt(0)&&p.length>=n.length&&c.slice(p.length).trim()===""&&(t=!1,n=""):(t=!0,n=p)}if(!t&&l.trim()===""){let p=o+1;for(;p<e.length&&e[p]===`
`;)p++;p<e.length&&(s.length===0||s[s.length-1]!==p)&&s.push(p)}i=a===-1?e.length:a+1}return s.length<2?-1:s[s.length-2]}let Wo=!1;function Ho(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function Gp(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function qp(){Wo||(Wo=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function os(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),Ho(t)}return qp(),Ho(Gp())}let st=null,St=0;async function de(e){if(!e.client||!e.connected)return;const t=e.sessionKey,n=++St;e.chatLoading=!0,e.lastError=null;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==St||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null}catch{if(n!==St||e.sessionKey!==t)return;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==St||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null}catch(s){if(n!==St||e.sessionKey!==t)return;e.lastError=String(s)}}finally{n===St&&(e.chatLoading=!1)}}function Yp(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}async function Dl(e,t,n,s){if(!e.client||!e.connected)return!1;let i=t.trim();const a=n&&n.length>0;if(!i&&!a)return!1;!i&&a&&(i=n.some(p=>p.mimeType.startsWith("image/"))?"What's in this image?":"See attached file.");const o=Date.now();if(!s?.skipOptimisticUpdate){const u=[];if(i&&u.push({type:"text",text:i}),a)for(const p of n)p.mimeType.startsWith("image/")?u.push({type:"image",source:{type:"base64",media_type:p.mimeType,data:p.dataUrl}}):u.push({type:"attachment",mimeType:p.mimeType,fileName:p.fileName,content:p.dataUrl});e.chatMessages=[...e.chatMessages,{role:"user",content:u,timestamp:o}]}e.chatSending=!0,e.chatSendingSessionKey=e.sessionKey,e.lastError=null;const l=os();e.chatRunId=l,e.chatStream="",e.chatStreamStartedAt=o,st={message:i,attachments:a?n:void 0};const c=a?n.map(u=>{const p=Yp(u.dataUrl);return p?{type:p.mimeType.startsWith("image/")?"image":"file",mimeType:p.mimeType,content:p.content,fileName:u.fileName}:null}).filter(u=>u!==null):void 0;try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:i,deliver:!1,idempotencyKey:l,attachments:c,...e.chatPrivateMode?{privateMode:!0}:{}}),!0}catch(u){const p=String(u);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=p,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+p}],timestamp:Date.now()}],!1}finally{e.chatSending=!1,e.chatSendingSessionKey=null}}async function Qp(e){const t=e.pendingRetry;return t?(e.pendingRetry=null,Dl(e,t.message,t.attachments,{skipOptimisticUpdate:!0})):!1}async function Nl(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function Jp(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?"final":null;if(t.state!=="delta"&&jp(),t.state==="delta"){const n=fi(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final")e.chatStream&&e.chatStream.trim()&&(e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:e.chatStream}],timestamp:Date.now()}]),e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,st=null;else if(t.state==="aborted")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,st=null;else if(t.state==="error"){e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;const n=t.errorMessage??"chat error";e.lastError=n;const s=n.includes("prompt is too long")||n.includes("tokens >");s&&st&&(e.pendingRetry={message:st.message,attachments:st.attachments,timestamp:Date.now()}),st=null;let i=n;if(s){const a=n.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(a){const o=parseInt(a[1]).toLocaleString(),l=parseInt(a[2]).toLocaleString();i=`⚠️ Context overflow: ${o} tokens exceeds ${l} limit. Compact the conversation, then click "Retry" to resend your message.`}else i='⚠️ Context overflow: The conversation is too long. Compact and click "Retry" to resend.'}e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:i}],timestamp:Date.now(),isError:!0}]}return t.state}const Ol="godmode.device.auth.v1";function Zi(e){return e.trim()}function Xp(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e){const s=n.trim();s&&t.add(s)}return[...t].sort()}function ea(){try{const e=window.localStorage.getItem(Ol);if(!e)return null;const t=JSON.parse(e);return!t||t.version!==1||!t.deviceId||typeof t.deviceId!="string"||!t.tokens||typeof t.tokens!="object"?null:t}catch{return null}}function Bl(e){try{window.localStorage.setItem(Ol,JSON.stringify(e))}catch{}}function Zp(e){const t=ea();if(!t||t.deviceId!==e.deviceId)return null;const n=Zi(e.role),s=t.tokens[n];return!s||typeof s.token!="string"?null:s}function Fl(e){const t=Zi(e.role),n={version:1,deviceId:e.deviceId,tokens:{}},s=ea();s&&s.deviceId===e.deviceId&&(n.tokens={...s.tokens});const i={token:e.token,role:t,scopes:Xp(e.scopes),updatedAtMs:Date.now()};return n.tokens[t]=i,Bl(n),i}function Ul(e){const t=ea();if(!t||t.deviceId!==e.deviceId)return;const n=Zi(e.role);if(!t.tokens[n])return;const s={...t,tokens:{...t.tokens}};delete s.tokens[n],Bl(s)}const Kl={p:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,n:0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,h:8n,a:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,d:0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,Gx:0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,Gy:0x6666666666666666666666666666666666666666666666666666666666666658n},{p:te,n:Nn,Gx:zo,Gy:jo,a:js,d:Vs,h:eh}=Kl,ht=32,ta=64,th=(...e)=>{"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(...e)},Y=(e="")=>{const t=new Error(e);throw th(t,Y),t},nh=e=>typeof e=="bigint",sh=e=>typeof e=="string",ih=e=>e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array",Ve=(e,t,n="")=>{const s=ih(e),i=e?.length,a=t!==void 0;if(!s||a&&i!==t){const o=n&&`"${n}" `,l=a?` of length ${t}`:"",c=s?`length=${i}`:`type=${typeof e}`;Y(o+"expected Uint8Array"+l+", got "+c)}return e},rs=e=>new Uint8Array(e),Wl=e=>Uint8Array.from(e),Hl=(e,t)=>e.toString(16).padStart(t,"0"),zl=e=>Array.from(Ve(e)).map(t=>Hl(t,2)).join(""),Le={_0:48,_9:57,A:65,F:70,a:97,f:102},Vo=e=>{if(e>=Le._0&&e<=Le._9)return e-Le._0;if(e>=Le.A&&e<=Le.F)return e-(Le.A-10);if(e>=Le.a&&e<=Le.f)return e-(Le.a-10)},jl=e=>{const t="hex invalid";if(!sh(e))return Y(t);const n=e.length,s=n/2;if(n%2)return Y(t);const i=rs(s);for(let a=0,o=0;a<s;a++,o+=2){const l=Vo(e.charCodeAt(o)),c=Vo(e.charCodeAt(o+1));if(l===void 0||c===void 0)return Y(t);i[a]=l*16+c}return i},Vl=()=>globalThis?.crypto,ah=()=>Vl()?.subtle??Y("crypto.subtle must be defined, consider polyfill"),pn=(...e)=>{const t=rs(e.reduce((s,i)=>s+Ve(i).length,0));let n=0;return e.forEach(s=>{t.set(s,n),n+=s.length}),t},oh=(e=ht)=>Vl().getRandomValues(rs(e)),qn=BigInt,it=(e,t,n,s="bad number: out of range")=>nh(e)&&t<=e&&e<n?e:Y(s),_=(e,t=te)=>{const n=e%t;return n>=0n?n:t+n},Gl=e=>_(e,Nn),rh=(e,t)=>{(e===0n||t<=0n)&&Y("no inverse n="+e+" mod="+t);let n=_(e,t),s=t,i=0n,a=1n;for(;n!==0n;){const o=s/n,l=s%n,c=i-a*o;s=n,n=l,i=a,a=c}return s===1n?_(i,t):Y("no inverse")},lh=e=>{const t=Jl[e];return typeof t!="function"&&Y("hashes."+e+" not set"),t},Gs=e=>e instanceof ue?e:Y("Point expected"),Si=2n**256n;class ue{static BASE;static ZERO;X;Y;Z;T;constructor(t,n,s,i){const a=Si;this.X=it(t,0n,a),this.Y=it(n,0n,a),this.Z=it(s,1n,a),this.T=it(i,0n,a),Object.freeze(this)}static CURVE(){return Kl}static fromAffine(t){return new ue(t.x,t.y,1n,_(t.x*t.y))}static fromBytes(t,n=!1){const s=Vs,i=Wl(Ve(t,ht)),a=t[31];i[31]=a&-129;const o=Yl(i);it(o,0n,n?Si:te);const c=_(o*o),u=_(c-1n),p=_(s*c+1n);let{isValid:h,value:g}=dh(u,p);h||Y("bad point: y not sqrt");const d=(g&1n)===1n,m=(a&128)!==0;return!n&&g===0n&&m&&Y("bad point: x==0, isLastByteOdd"),m!==d&&(g=_(-g)),new ue(g,o,1n,_(g*o))}static fromHex(t,n){return ue.fromBytes(jl(t),n)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}assertValidity(){const t=js,n=Vs,s=this;if(s.is0())return Y("bad point: ZERO");const{X:i,Y:a,Z:o,T:l}=s,c=_(i*i),u=_(a*a),p=_(o*o),h=_(p*p),g=_(c*t),d=_(p*_(g+u)),m=_(h+_(n*_(c*u)));if(d!==m)return Y("bad point: equation left != right (1)");const k=_(i*a),$=_(o*l);return k!==$?Y("bad point: equation left != right (2)"):this}equals(t){const{X:n,Y:s,Z:i}=this,{X:a,Y:o,Z:l}=Gs(t),c=_(n*l),u=_(a*i),p=_(s*l),h=_(o*i);return c===u&&p===h}is0(){return this.equals(Tt)}negate(){return new ue(_(-this.X),this.Y,this.Z,_(-this.T))}double(){const{X:t,Y:n,Z:s}=this,i=js,a=_(t*t),o=_(n*n),l=_(2n*_(s*s)),c=_(i*a),u=t+n,p=_(_(u*u)-a-o),h=c+o,g=h-l,d=c-o,m=_(p*g),k=_(h*d),$=_(p*d),S=_(g*h);return new ue(m,k,S,$)}add(t){const{X:n,Y:s,Z:i,T:a}=this,{X:o,Y:l,Z:c,T:u}=Gs(t),p=js,h=Vs,g=_(n*o),d=_(s*l),m=_(a*h*u),k=_(i*c),$=_((n+s)*(o+l)-g-d),S=_(k-m),x=_(k+m),L=_(d-p*g),C=_($*S),E=_(x*L),P=_($*L),R=_(S*x);return new ue(C,E,R,P)}subtract(t){return this.add(Gs(t).negate())}multiply(t,n=!0){if(!n&&(t===0n||this.is0()))return Tt;if(it(t,1n,Nn),t===1n)return this;if(this.equals(ft))return kh(t).p;let s=Tt,i=ft;for(let a=this;t>0n;a=a.double(),t>>=1n)t&1n?s=s.add(a):n&&(i=i.add(a));return s}multiplyUnsafe(t){return this.multiply(t,!1)}toAffine(){const{X:t,Y:n,Z:s}=this;if(this.equals(Tt))return{x:0n,y:1n};const i=rh(s,te);_(s*i)!==1n&&Y("invalid inverse");const a=_(t*i),o=_(n*i);return{x:a,y:o}}toBytes(){const{x:t,y:n}=this.assertValidity().toAffine(),s=ql(n);return s[31]|=t&1n?128:0,s}toHex(){return zl(this.toBytes())}clearCofactor(){return this.multiply(qn(eh),!1)}isSmallOrder(){return this.clearCofactor().is0()}isTorsionFree(){let t=this.multiply(Nn/2n,!1).double();return Nn%2n&&(t=t.add(this)),t.is0()}}const ft=new ue(zo,jo,1n,_(zo*jo)),Tt=new ue(0n,1n,1n,0n);ue.BASE=ft;ue.ZERO=Tt;const ql=e=>jl(Hl(it(e,0n,Si),ta)).reverse(),Yl=e=>qn("0x"+zl(Wl(Ve(e)).reverse())),ke=(e,t)=>{let n=e;for(;t-- >0n;)n*=n,n%=te;return n},ch=e=>{const n=e*e%te*e%te,s=ke(n,2n)*n%te,i=ke(s,1n)*e%te,a=ke(i,5n)*i%te,o=ke(a,10n)*a%te,l=ke(o,20n)*o%te,c=ke(l,40n)*l%te,u=ke(c,80n)*c%te,p=ke(u,80n)*c%te,h=ke(p,10n)*a%te;return{pow_p_5_8:ke(h,2n)*e%te,b2:n}},Go=0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,dh=(e,t)=>{const n=_(t*t*t),s=_(n*n*t),i=ch(e*s).pow_p_5_8;let a=_(e*n*i);const o=_(t*a*a),l=a,c=_(a*Go),u=o===e,p=o===_(-e),h=o===_(-e*Go);return u&&(a=l),(p||h)&&(a=c),(_(a)&1n)===1n&&(a=_(-a)),{isValid:u||p,value:a}},Ai=e=>Gl(Yl(e)),na=(...e)=>Jl.sha512Async(pn(...e)),uh=(...e)=>lh("sha512")(pn(...e)),Ql=e=>{const t=e.slice(0,ht);t[0]&=248,t[31]&=127,t[31]|=64;const n=e.slice(ht,ta),s=Ai(t),i=ft.multiply(s),a=i.toBytes();return{head:t,prefix:n,scalar:s,point:i,pointBytes:a}},sa=e=>na(Ve(e,ht)).then(Ql),ph=e=>Ql(uh(Ve(e,ht))),hh=e=>sa(e).then(t=>t.pointBytes),fh=e=>na(e.hashable).then(e.finish),gh=(e,t,n)=>{const{pointBytes:s,scalar:i}=e,a=Ai(t),o=ft.multiply(a).toBytes();return{hashable:pn(o,s,n),finish:u=>{const p=Gl(a+Ai(u)*i);return Ve(pn(o,ql(p)),ta)}}},mh=async(e,t)=>{const n=Ve(e),s=await sa(t),i=await na(s.prefix,n);return fh(gh(s,i,n))},Jl={sha512Async:async e=>{const t=ah(),n=pn(e);return rs(await t.digest("SHA-512",n.buffer))},sha512:void 0},vh=(e=oh(ht))=>e,yh={getExtendedPublicKeyAsync:sa,getExtendedPublicKey:ph,randomSecretKey:vh},Yn=8,bh=256,Xl=Math.ceil(bh/Yn)+1,xi=2**(Yn-1),wh=()=>{const e=[];let t=ft,n=t;for(let s=0;s<Xl;s++){n=t,e.push(n);for(let i=1;i<xi;i++)n=n.add(t),e.push(n);t=n.double()}return e};let qo;const Yo=(e,t)=>{const n=t.negate();return e?n:t},kh=e=>{const t=qo||(qo=wh());let n=Tt,s=ft;const i=2**Yn,a=i,o=qn(i-1),l=qn(Yn);for(let c=0;c<Xl;c++){let u=Number(e&o);e>>=l,u>xi&&(u-=a,e+=1n);const p=c*xi,h=p,g=p+Math.abs(u)-1,d=c%2!==0,m=u<0;u===0?s=s.add(Yo(d,t[h])):n=n.add(Yo(m,t[g]))}return e!==0n&&Y("invalid wnaf"),{p:n,f:s}},qs="godmode-device-identity-v1";function _i(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"")}function Zl(e){const t=e.replaceAll("-","+").replaceAll("_","/"),n=t+"=".repeat((4-t.length%4)%4),s=atob(n),i=new Uint8Array(s.length);for(let a=0;a<s.length;a+=1)i[a]=s.charCodeAt(a);return i}function $h(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function ec(e){const t=await crypto.subtle.digest("SHA-256",e);return $h(new Uint8Array(t))}async function Sh(){const e=yh.randomSecretKey(),t=await hh(e);return{deviceId:await ec(t),publicKey:_i(t),privateKey:_i(e)}}async function ia(){try{const n=localStorage.getItem(qs);if(n){const s=JSON.parse(n);if(s?.version===1&&typeof s.deviceId=="string"&&typeof s.publicKey=="string"&&typeof s.privateKey=="string"){const i=await ec(Zl(s.publicKey));if(i!==s.deviceId){const a={...s,deviceId:i};return localStorage.setItem(qs,JSON.stringify(a)),{deviceId:i,publicKey:s.publicKey,privateKey:s.privateKey}}return{deviceId:s.deviceId,publicKey:s.publicKey,privateKey:s.privateKey}}}}catch{}const e=await Sh(),t={version:1,deviceId:e.deviceId,publicKey:e.publicKey,privateKey:e.privateKey,createdAtMs:Date.now()};return localStorage.setItem(qs,JSON.stringify(t)),e}async function Ah(e,t){const n=Zl(e),s=new TextEncoder().encode(t),i=await mh(s,n);return _i(i)}async function Ge(e,t){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,t?.quiet||(e.devicesError=null);try{const n=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(n?.pending)?n.pending:[],paired:Array.isArray(n?.paired)?n.paired:[]}}catch(n){t?.quiet||(e.devicesError=String(n))}finally{e.devicesLoading=!1}}}async function xh(e,t){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:t}),await Ge(e)}catch(n){e.devicesError=String(n)}}async function _h(e,t){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:t}),await Ge(e)}catch(s){e.devicesError=String(s)}}async function Th(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("device.token.rotate",t);if(n?.token){const s=await ia(),i=n.role??t.role;(n.deviceId===s.deviceId||t.deviceId===s.deviceId)&&Fl({deviceId:s.deviceId,role:i,token:n.token,scopes:n.scopes??t.scopes??[]}),window.prompt("New device token (copy and store securely):",n.token)}await Ge(e)}catch(n){e.devicesError=String(n)}}async function Ch(e,t){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)))try{await e.client.request("device.token.revoke",t);const s=await ia();t.deviceId===s.deviceId&&Ul({deviceId:s.deviceId,role:t.role}),await Ge(e)}catch(s){e.devicesError=String(s)}}function Ti(e){return typeof e=="object"&&e!==null}function Lh(e){if(!Ti(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!Ti(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const i=typeof e.createdAtMs=="number"?e.createdAtMs:0,a=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!i||!a?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:i,expiresAtMs:a}}function Eh(e){if(!Ti(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function tc(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function Ih(e,t){const n=tc(e).filter(s=>s.id!==t.id);return n.push(t),n}function Qo(e,t){return tc(e).filter(n=>n.id!==t)}async function nc(e){if(!(!e.client||!e.connected)){e.missionLoading=!0,e.missionError=null;try{const[t,n,s,i]=await Promise.all([e.client.request("agents.list",{}).catch(()=>null),e.client.request("agentLog.get",{}).catch(()=>null),e.client.request("subagents.list",{limit:50}).catch(()=>null),e.client.request("tasks.list",{status:"pending"}).catch(()=>null)]),a=t;a?.agents&&(e.missionAgents=Uh(a.agents,e.workingSessions??new Set));const o=n;o?.activeRuns&&(e.missionActiveRuns=o.activeRuns.map(u=>({runId:u.runId,sessionKey:u.sessionKey,agentName:aa(u.sessionKey),agentEmoji:Fh(u.sessionKey,e.missionAgents),startedAt:u.startedAt,durationMs:u.durationMs})));const l=s;l?.runs&&(e.missionSubagentRuns=l.runs);const c=i;c?.tasks&&(e.missionTasks=c.tasks)}catch(t){console.error("[Mission] Failed to load mission data:",t),e.missionError=String(t)}finally{e.missionLoading=!1}}}async function Mh(e){await nc(e)}async function Rh(e,t){if(!(!e.client||!e.connected))try{await e.client.request("tasks.update",{id:t,status:"complete",completedAt:new Date().toISOString()}),e.missionTasks=e.missionTasks.filter(n=>n.id!==t),ct(e,{agent:"You",action:"completed task",details:e.missionTasks.find(n=>n.id===t)?.title??t})}catch(n){console.error("[Mission] Failed to complete task:",n)}}const Ph=50;let Dh=0;function ct(e,t){const n={id:`feed-${++Dh}-${Date.now()}`,timestamp:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),...t};e.missionFeedItems=[n,...e.missionFeedItems].slice(0,Ph)}function Nh(e,t){if(!t)return;const n=t.data??{},s=t.sessionKey??"unknown",i=aa(s);if(t.stream==="tool"){const a=typeof n.phase=="string"?n.phase:"",o=typeof n.name=="string"?n.name:"tool";a==="start"&&ct(e,{agent:i,action:"using",details:o});return}if(t.stream==="message"){(typeof n.phase=="string"?n.phase:"")==="start"&&ct(e,{agent:i,action:"thinking",details:Ci(s,e.sessionsResult)});return}if(t.stream==="final"){ct(e,{agent:i,action:"finished",details:Ci(s,e.sessionsResult)});return}}function Oh(e,t){if(!t)return;const n=t.sessionKey??"unknown",s=aa(n),i=Ci(n,e.sessionsResult);t.state==="started"?ct(e,{agent:s,action:"started",details:i}):t.state==="final"?ct(e,{agent:s,action:"completed",details:i}):t.state==="error"&&ct(e,{agent:s,action:"error",details:i})}function Ys(e,t){const n=new Set;for(const s of t){const a=s.split(":")[0]?.toLowerCase();a&&n.add(a)}e.missionAgents=e.missionAgents.map(s=>({...s,status:n.has(s.id)||n.has(s.name.toLowerCase())?"WORKING":"IDLE"}))}const sc={atlas:"⚛️",oracle:"🔮",builder:"🔨",herald:"📢",sentinel:"🛡️",muse:"🎨",treasurer:"💰",main:"⚛️"},Bh={atlas:"Primary",oracle:"Research",builder:"Technical",herald:"Communications",sentinel:"Security",muse:"Creative",treasurer:"Finance",main:"Primary"};function aa(e){const t=e.split(":"),n=t[0]?.toLowerCase()??"";return{atlas:"Atlas",oracle:"Oracle",builder:"Builder",herald:"Herald",sentinel:"Sentinel",muse:"Muse",treasurer:"Treasurer",main:"Atlas",agent:t[1]?t[1].charAt(0).toUpperCase()+t[1].slice(1):"Agent"}[n]??n.charAt(0).toUpperCase()+n.slice(1)}function Fh(e,t){const s=e.split(":")[0]?.toLowerCase()??"",i=t.find(a=>a.id===s);return i?i.emoji:sc[s]??"🤖"}function Ci(e,t){if(t?.sessions){const a=t.sessions.find(o=>o.key===e);if(a?.displayName)return a.displayName}const n=e.split(":");return(n[n.length-1]??e).replace(/-[a-f0-9]{6,}$/i,"")||e}function Uh(e,t){const n=new Set;for(const s of t){const a=s.split(":")[0]?.toLowerCase();a&&n.add(a)}return e.map(s=>{const i=s.id.toLowerCase(),a=s.identity?.name??s.name??s.id,o=s.identity?.emoji??sc[i]??"🤖",l=Bh[i]??"Agent",c=n.has(i);return{id:i,emoji:o,name:a,role:l,model:s.model??void 0,workspace:s.workspace??void 0,status:c?"WORKING":"IDLE",activeSessions:0}})}async function ls(e,t){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,t?.quiet||(e.lastError=null);try{const n=await e.client.request("node.list",{}),s=Array.isArray(n.nodes)?n.nodes:[];JSON.stringify(s)!==JSON.stringify(e.nodes)&&(e.nodes=s)}catch(n){t?.quiet||(e.lastError=String(n))}finally{e.nodesLoading=!1}}}const sn=new Map;async function le(e,t){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const n=t?.includeGlobal??e.sessionsIncludeGlobal,s=t?.includeUnknown??e.sessionsIncludeUnknown,i=t?.activeMinutes??Wn(e.sessionsFilterActive,0),a=t?.limit??Wn(e.sessionsFilterLimit,50),o={includeGlobal:n,includeUnknown:s};i>0&&(o.activeMinutes=i),a>0&&(o.limit=a);const l=await e.client.request("sessions.list",o);if(l){if(l.sessions){const c=new Map;if(e.sessionsResult?.sessions)for(const u of e.sessionsResult.sessions)u.displayName&&c.set(u.key,u.displayName);l.sessions=l.sessions.map(u=>{if(u.displayName)return u;const p=sn.get(u.key);if(p)return{...u,displayName:p};const h=c.get(u.key);return h?{...u,displayName:h}:u})}e.sessionsResult=l}}catch(n){e.sessionsError=String(n)}finally{e.sessionsLoading=!1}}}async function Qs(e,t,n){if(!e.client||!e.connected)return{ok:!1};const s={key:t};"label"in n&&(s.label=n.label),"displayName"in n&&(s.displayName=n.displayName),"thinkingLevel"in n&&(s.thinkingLevel=n.thinkingLevel),"verboseLevel"in n&&(s.verboseLevel=n.verboseLevel),"reasoningLevel"in n&&(s.reasoningLevel=n.reasoningLevel);try{return{ok:!0,canonicalKey:(await e.client.request("sessions.patch",s))?.key??t}}catch(i){return e.sessionsError=String(i),{ok:!1}}}async function Kh(e,t){if(!(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${t}"?

Deletes the session entry and archives its transcript.`))){e.sessionsLoading=!0,e.sessionsError=null;try{await e.client.request("sessions.delete",{key:t,deleteTranscript:!0}),await le(e)}catch(s){e.sessionsError=String(s)}finally{e.sessionsLoading=!1}}}const Wh=1800*1e3;async function Hh(e){if(!(!e.client||!e.connected)){e.updateLoading=!0,e.updateError=null;try{const t=await e.client.request("system.checkUpdates",{fetch:!0});t.error&&(e.updateError=t.error),e.updateStatus=t,e.updateLastChecked=Date.now()}catch(t){e.updateError=String(t)}finally{e.updateLoading=!1}}}async function Jo(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("system.checkUpdates",{fetch:!0});e.updateStatus=t,e.updateLastChecked=Date.now()}catch{}}function zh(e){e.updatePollInterval==null&&(Jo(e),e.updatePollInterval=window.setInterval(()=>{Jo(e)},Wh))}function jh(e){const t=e;t.updatePollInterval!=null&&(clearInterval(t.updatePollInterval),t.updatePollInterval=null)}const ic={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},Xo=ic,Li={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(ic));new Set(Object.values(Li));function Vh(e){const t=e.version??(e.nonce?"v2":"v1"),n=e.scopes.join(","),s=e.token??"",i=[t,e.deviceId,e.clientId,e.clientMode,e.role,n,String(e.signedAtMs),s];return t==="v2"&&i.push(e.nonce??""),i.join("|")}const Gh=4008;class qh{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.read","operator.write","operator.approvals","operator.pairing"],s="operator";let i=null,a=!1,o=this.opts.token;if(t){i=await ia();const p=Zp({deviceId:i.deviceId,role:s})?.token;o=p??this.opts.token,a=!!(p&&this.opts.token)}const l=o||this.opts.password?{token:o,password:this.opts.password}:void 0;let c;if(t&&i){const p=Date.now(),h=this.connectNonce??void 0,g=Vh({deviceId:i.deviceId,clientId:this.opts.clientName??Xo.CONTROL_UI,clientMode:this.opts.mode??Li.WEBCHAT,role:s,scopes:n,signedAtMs:p,token:o??null,nonce:h}),d=await Ah(i.privateKey,g);c={id:i.deviceId,publicKey:i.publicKey,signature:d,signedAt:p,nonce:h}}const u={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??Xo.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??Li.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:c,caps:[],auth:l,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",u).then(p=>{p?.auth?.deviceToken&&i&&Fl({deviceId:i.deviceId,role:p.auth.role??s,token:p.auth.deviceToken,scopes:p.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(p)}).catch(()=>{a&&i&&Ul({deviceId:i.deviceId,role:s}),this.ws?.close(Gh,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const i=n;if(i.event==="connect.challenge"){const o=i.payload,l=o&&typeof o.nonce=="string"?o.nonce:null;l&&(this.connectNonce=l,this.sendConnect());return}const a=typeof i.seq=="number"?i.seq:null;a!==null&&(this.lastSeq!==null&&a>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:a}),this.lastSeq=a);try{this.opts.onEvent?.(i)}catch(o){console.error("[gateway] event handler error:",o)}return}if(s.type==="res"){const i=n,a=this.pending.get(i.id);if(!a)return;this.pending.delete(i.id),i.ok?a.resolve(i.payload):a.reject(new Error(i.error?.message??"request failed"));return}}request(t,n){if(console.log("[Gateway] request() called",{method:t,hasWs:!!this.ws,wsState:this.ws?.readyState,wsOpen:this.ws?.readyState===WebSocket.OPEN}),!this.ws||this.ws.readyState!==WebSocket.OPEN)return console.log("[Gateway] request() - WS not ready, rejecting"),Promise.reject(new Error("gateway not connected"));const s=os(),i={type:"req",id:s,method:t,params:n},a=new Promise((o,l)=>{this.pending.set(s,{resolve:c=>o(c),reject:l})});return console.log("[Gateway] Sending frame:",t,s.slice(0,8)),this.ws.send(JSON.stringify(i)),a}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}const Zt=[];function Yh(){return[...Zt]}let Ue=null;const Qh=10,Jh=1e3,Ct=new Map;function Js(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const i=t.mainKey?.trim()||"main",a=t.defaultAgentId?.trim();return n==="main"||n===i||a&&(n===`agent:${a}:main`||n===`agent:${a}:${i}`)?s:n}function Xh(e,t){if(!t?.mainSessionKey)return;const n=Js(e.sessionKey,t),s=Js(e.settings.sessionKey,t),i=Js(e.settings.lastActiveSessionKey,t),a=n||s||e.sessionKey,o={...e.settings,sessionKey:s||a,lastActiveSessionKey:i||a},l=o.sessionKey!==e.settings.sessionKey||o.lastActiveSessionKey!==e.settings.lastActiveSessionKey;a!==e.sessionKey&&(e.sessionKey=a),l&&ze(e,o)}function Zh(e){Ue&&(clearTimeout(Ue),Ue=null);const t=(e.reconnectAttempt??0)+1;if(t>Qh){e.lastError="Connection lost. Please refresh the page.",e.reconnecting=!1;return}e.reconnectAttempt=t,e.reconnecting=!0;const n=Math.min(Jh*Math.pow(2,t-1),3e4);Ue=setTimeout(()=>{Ue=null,e.connected||oa(e)},n)}async function ef(e){if(e.client)try{const t=await e.client.request("projects.list",{}),n=e;n.workspaceNeedsSetup=!t?.projects||t.projects.length===0}catch{}}async function tf(e){if(!e.client)return;if(e.workspaceNeedsSetup===!1){try{const n=await e.client.request("onboarding.status",{});n&&!n.completedAt&&await e.client.request("onboarding.complete",{summary:null})}catch{}return}try{const n=await e.client.request("onboarding.status",{}),s=e;n&&!n.completedAt?(s.onboardingActive=!0,s.onboardingPhase=n.phase??0,s.onboardingData=n):(s.onboardingActive=!1,s.onboardingData=n??null)}catch{}}function nf(e,t){if(!e.sessionsResult?.sessions)return;const n=e.sessionsResult.sessions.map(s=>s.key===t?{...s,updatedAt:Date.now()}:s);e.sessionsResult={...e.sessionsResult,sessions:n}}const Zo=new Set;async function sf(e,t){if(!(!t.includes("webchat")||Zo.has(t)||e.sessionsResult?.sessions?.find(s=>s.key===t)?.displayName?.trim())){if(Zo.add(t),!e.client||!e.connected){console.warn("[auto-title] skipped: not connected");return}try{const s=await e.client.request("sessions.autoTitle",{key:t});s?.ok||console.warn("[auto-title] failed:",s?.reason??"unknown"),s?.ok&&s.title&&(sn.set(t,s.title),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(i=>i.key===t?{...i,displayName:s.title}:i)}),e.requestUpdate?.())}catch(s){console.error("[auto-title] RPC call failed:",s)}}}function oa(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null;const t=e;"sessionsLoading"in t&&(t.sessionsLoading=!1),"agentsLoading"in t&&(t.agentsLoading=!1),"nodesLoading"in t&&(t.nodesLoading=!1),"devicesLoading"in t&&(t.devicesLoading=!1),"channelsLoading"in t&&(t.channelsLoading=!1),"configLoading"in t&&(t.configLoading=!1),"presenceLoading"in t&&(t.presenceLoading=!1),"cronLoading"in t&&(t.cronLoading=!1),"skillsLoading"in t&&(t.skillsLoading=!1),"debugLoading"in t&&(t.debugLoading=!1),"logsLoading"in t&&(t.logsLoading=!1),"missionLoading"in t&&(t.missionLoading=!1),Ue&&(clearTimeout(Ue),Ue=null),e.client?.stop(),e.client=new qh({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:n=>{const s=e.reconnecting;e.connected=!0,e.lastError=null,e.hello=n,e.reconnecting=!1,e.reconnectAttempt=0;const i=e;if(i.therapistController?.setSocket&&i.therapistController.setSocket(e.client),s){const a=e;typeof a.showToast=="function"&&a.showToast("Gateway reconnected","success",4e3),e.lastError="✓ Reconnected",setTimeout(()=>{e.lastError==="✓ Reconnected"&&(e.lastError=null)},3e3),e.chatRunId=null;const o=e;"chatStream"in o&&(o.chatStream=null),"chatStreamStartedAt"in o&&(o.chatStreamStartedAt=null),e.workingSessions.clear(),e.requestUpdate?.();for(const l of Ct.values())clearTimeout(l);Ct.clear()}rf(e,n),ml(e),mu(e),ls(e,{quiet:!0}),Ge(e,{quiet:!0}),le(e),gs(e),ef(e).then(()=>tf(e)),zh(e)},onClose:({code:n,reason:s})=>{e.connected=!1,jh(e);const i=e;"chatSending"in i&&(i.chatSending=!1),"chatSendingSessionKey"in i&&(i.chatSendingSessionKey=null),"chatRunId"in i&&(i.chatRunId=null),"chatStream"in i&&(i.chatStream=null),"chatStreamStartedAt"in i&&(i.chatStreamStartedAt=null);const a=e;"sessionsLoading"in a&&(a.sessionsLoading=!1),"agentsLoading"in a&&(a.agentsLoading=!1),"nodesLoading"in a&&(a.nodesLoading=!1),"devicesLoading"in a&&(a.devicesLoading=!1),"channelsLoading"in a&&(a.channelsLoading=!1),"presenceLoading"in a&&(a.presenceLoading=!1),n!==1012&&(e.lastError=`disconnected (${n}): ${s||"no reason"}`),Zh(e)},onEvent:n=>af(e,n),onGap:({expected:n,received:s})=>{e.lastError=`event gap detected (expected seq ${n}, got ${s}); refresh recommended`}}),e.client.start()}function af(e,t){try{of(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function of(e,t){if(Zt.unshift({ts:Date.now(),event:t.event,payload:t.payload}),Zt.length>250&&(Zt.length=250),e.tab==="debug"&&(e.eventLog=[...Zt]),t.event==="agent"){if(e.onboarding)return;const n=t.payload,s=n?.sessionKey;s&&n?.stream==="tool"&&n.data?.phase==="start"&&(e.workingSessions.has(s)||(e.workingSessions.add(s),e.requestUpdate?.(),Ys(e,e.workingSessions))),gu(e,n),Nh(e,n);return}if(t.event==="chat"){const n=t.payload;if(n?.sessionKey){if(fc(e,n.sessionKey),n.state==="delta"){const i=Ct.get(n.sessionKey);i&&(clearTimeout(i),Ct.delete(n.sessionKey)),e.workingSessions.has(n.sessionKey)||(e.workingSessions.add(n.sessionKey),e.requestUpdate?.(),Ys(e,e.workingSessions))}else if((n.state==="final"||n.state==="error"||n.state==="aborted")&&e.workingSessions.has(n.sessionKey)){const i=Ct.get(n.sessionKey);i&&(clearTimeout(i),Ct.delete(n.sessionKey)),e.workingSessions.delete(n.sessionKey),e.requestUpdate?.(),Ys(e,e.workingSessions)}}n.state==="final"&&nf(e,n.sessionKey);const s=Jp(e,n);Oh(e,n),n.state==="final"&&(async()=>{try{await le(e,{activeMinutes:0})}catch(i){console.error("[auto-title] loadSessions failed, proceeding anyway:",i)}sf(e,n.sessionKey)})(),(s==="final"||s==="error"||s==="aborted")&&(Hi(e),$g(e),s==="final"&&e.compactionStatus?.active&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus.startedAt??null,completedAt:Date.now()}),(s==="error"||s==="aborted")&&e.compactionStatus?.active&&(e.compactionStatus=null),e.refreshSessionsAfterChat=!1),s==="final"&&de(e);return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&wa(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&Ge(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=Lh(t.payload);if(n){e.execApprovalQueue=Ih(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=Qo(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.process.completed"){const n=t.payload;if(n?.sessionId){const s=n.exitSignal?`signal ${n.exitSignal}`:`exit ${n.exitCode??0}`,i=n.status==="completed"?"✓":"✗",a=n.status==="completed"?"success":"warning",o=n.sessionId.slice(0,8),l=e;typeof l.showToast=="function"&&l.showToast(`${i} Process ${o} ${n.status} (${s})`,a,5e3)}return}if(t.event==="exec.approval.resolved"){const n=Eh(t.payload);n&&(e.execApprovalQueue=Qo(e.execApprovalQueue,n.id))}if(t.event==="daily-brief:update"){const n=t.payload;if(n){console.log("[gateway] Daily brief update received:",n.date);const s=e;s.dailyBrief=n}return}if(t.event==="ui.slot.update"){const n=t.payload;if(n?.tabId){const s=n.mode??"replace";if(n.html)s==="append"?e.dynamicSlots={...e.dynamicSlots,[n.tabId]:(e.dynamicSlots[n.tabId]??"")+n.html}:e.dynamicSlots={...e.dynamicSlots,[n.tabId]:n.html};else{const a={...e.dynamicSlots};delete a[n.tabId],e.dynamicSlots=a}e.requestUpdate?.()}return}if(t.event==="onboarding:update"){const n=t.payload;if(n){const s=e;typeof n.phase=="number"&&(s.onboardingPhase=n.phase),s.onboardingData=n,n.completedAt&&(s.onboardingActive=!1),s.requestUpdate?.()}return}}function rf(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&Xh(e,n.sessionDefaults)}async function cs(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[t,n,s,i]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=t,e.debugHealth=n;const a=s;e.debugModels=Array.isArray(a?.models)?a?.models:[],e.debugHeartbeat=i}catch(t){e.debugCallError=String(t)}finally{e.debugLoading=!1}}}async function lf(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const t=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},n=await e.client.request(e.debugCallMethod.trim(),t);e.debugCallResult=JSON.stringify(n,null,2)}catch(t){e.debugCallError=String(t)}}}const cf=2e3,df=new Set(["trace","debug","info","warn","error","fatal"]);function uf(e){if(typeof e!="string")return null;const t=e.trim();if(!t.startsWith("{")||!t.endsWith("}"))return null;try{const n=JSON.parse(t);return!n||typeof n!="object"?null:n}catch{return null}}function pf(e){if(typeof e!="string")return null;const t=e.toLowerCase();return df.has(t)?t:null}function hf(e){if(!e.trim())return{raw:e,message:e};try{const t=JSON.parse(e),n=t&&typeof t._meta=="object"&&t._meta!==null?t._meta:null,s=typeof t.time=="string"?t.time:typeof n?.date=="string"?n?.date:null,i=pf(n?.logLevelName??n?.level),a=typeof t[0]=="string"?t[0]:typeof n?.name=="string"?n?.name:null,o=uf(a);let l=null;o&&(typeof o.subsystem=="string"?l=o.subsystem:typeof o.module=="string"&&(l=o.module)),!l&&a&&a.length<120&&(l=a);let c=null;return typeof t[1]=="string"?c=t[1]:!o&&typeof t[0]=="string"?c=t[0]:typeof t.message=="string"&&(c=t.message),{raw:e,time:s,level:i,subsystem:l,message:c??e,meta:n??void 0}}catch{return{raw:e,message:e}}}async function ra(e,t){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!t?.quiet)){t?.quiet||(e.logsLoading=!0),e.logsError=null;try{const s=await e.client.request("logs.tail",{cursor:t?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),a=(Array.isArray(s.lines)?s.lines.filter(l=>typeof l=="string"):[]).map(hf),o=!!(t?.reset||s.reset||e.logsCursor==null);e.logsEntries=o?a:[...e.logsEntries,...a].slice(-cf),typeof s.cursor=="number"&&(e.logsCursor=s.cursor),typeof s.file=="string"&&(e.logsFile=s.file),e.logsTruncated=!!s.truncated,e.logsLastFetchAt=Date.now()}catch(n){e.logsError=String(n)}finally{t?.quiet||(e.logsLoading=!1)}}}function la(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{ls(e,{quiet:!0})},5e3))}function ca(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function da(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&ra(e,{quiet:!0})},2e3))}function ua(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function pa(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&cs(e)},3e3))}function ha(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}async function mn(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.status",{});e.cronStatus=t}catch(t){e.cronError=String(t)}}async function ds(e){if(!(!e.client||!e.connected)&&!e.cronLoading){e.cronLoading=!0,e.cronError=null;try{const t=await e.client.request("cron.list",{includeDisabled:!0});e.cronJobs=Array.isArray(t.jobs)?t.jobs:[]}catch(t){e.cronError=String(t)}finally{e.cronLoading=!1}}}function ff(e){if(e.scheduleKind==="at"){const n=Date.parse(e.scheduleAt);if(!Number.isFinite(n))throw new Error("Invalid run time.");return{kind:"at",atMs:n}}if(e.scheduleKind==="every"){const n=Wn(e.everyAmount,0);if(n<=0)throw new Error("Invalid interval amount.");const s=e.everyUnit;return{kind:"every",everyMs:n*(s==="minutes"?6e4:s==="hours"?36e5:864e5)}}const t=e.cronExpr.trim();if(!t)throw new Error("Cron expression required.");return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0}}function gf(e){if(e.payloadKind==="systemEvent"){const i=e.payloadText.trim();if(!i)throw new Error("System event text required.");return{kind:"systemEvent",text:i}}const t=e.payloadText.trim();if(!t)throw new Error("Agent message required.");const n={kind:"agentTurn",message:t};e.deliver&&(n.deliver=!0),e.channel&&(n.channel=e.channel),e.to.trim()&&(n.to=e.to.trim());const s=Wn(e.timeoutSeconds,0);return s>0&&(n.timeoutSeconds=s),n}async function mf(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const t=ff(e.cronForm),n=gf(e.cronForm),s=e.cronForm.agentId.trim(),i={name:e.cronForm.name.trim(),description:e.cronForm.description.trim()||void 0,agentId:s||void 0,enabled:e.cronForm.enabled,schedule:t,sessionTarget:e.cronForm.sessionTarget,wakeMode:e.cronForm.wakeMode,payload:n,isolation:e.cronForm.postToMainPrefix.trim()&&e.cronForm.sessionTarget==="isolated"?{postToMainPrefix:e.cronForm.postToMainPrefix.trim()}:void 0};if(!i.name)throw new Error("Name required.");await e.client.request("cron.add",i),e.cronForm={...e.cronForm,name:"",description:"",payloadText:""},await ds(e),await mn(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function vf(e,t,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:t.id,patch:{enabled:n}}),await ds(e),await mn(e)}catch(s){e.cronError=String(s)}finally{e.cronBusy=!1}}}async function yf(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:t.id,mode:"force"}),await ac(e,t.id)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function bf(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:t.id}),e.cronRunsJobId===t.id&&(e.cronRunsJobId=null,e.cronRuns=[]),await ds(e),await mn(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function ac(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("cron.runs",{id:t,limit:50});e.cronRunsJobId=t,e.cronRuns=Array.isArray(n.entries)?n.entries:[]}catch(n){e.cronError=String(n)}}function wf(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.get",params:{nodeId:t}}:null}function kf(e,t){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:t};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.set",params:{...t,nodeId:n}}:null}async function fa(e,t){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const n=wf(t);if(!n){e.lastError="Select a node before loading exec approvals.";return}const s=await e.client.request(n.method,n.params);$f(e,s)}catch(n){e.lastError=String(n)}finally{e.execApprovalsLoading=!1}}}function $f(e,t){e.execApprovalsSnapshot=t,e.execApprovalsDirty||(e.execApprovalsForm=ut(t.file??{}))}async function Sf(e,t){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const n=e.execApprovalsSnapshot?.hash;if(!n){e.lastError="Exec approvals hash missing; reload and retry.";return}const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},i=kf(t,{file:s,baseHash:n});if(!i){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(i.method,i.params),e.execApprovalsDirty=!1,await fa(e,t)}catch(n){e.lastError=String(n)}finally{e.execApprovalsSaving=!1}}}function Af(e,t,n){const s=ut(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});al(s,t,n),e.execApprovalsForm=s,e.execApprovalsDirty=!0}function xf(e,t){const n=ut(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});ol(n,t),e.execApprovalsForm=n,e.execApprovalsDirty=!0}async function oc(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("lifetracks.config.get",{});t&&(e.lifetracksConfig=t)}catch(t){console.error("Failed to load lifetracks config:",t)}}async function Qn(e){if(!e.client||!e.connected){e.lifetracksError="Not connected to gateway";return}e.lifetracksLoading=!0,e.lifetracksError=null;try{await oc(e);const t=await e.client.request("lifetracks.list",{});if(t?.lifetracks)if(e.lifetracksData=t.lifetracks,t.lifetracks.length>0){const n=new Date().toISOString().split("T")[0],s=t.lifetracks.find(i=>i.date===n);e.lifetracksCurrentTrack=s||t.lifetracks[0]}else e.lifetracksCurrentTrack=null;else e.lifetracksData=[],e.lifetracksCurrentTrack=null}catch(t){e.lifetracksError=t instanceof Error?t.message:"Failed to load lifetracks"}finally{e.lifetracksLoading=!1}}function _f(e,t){e.lifetracksCurrentTrack=t}async function Tf(e){if(!e.client||!e.connected)return e.lifetracksError="Not connected to gateway",!1;try{const t=await e.client.request("lifetracks.config.update",{enabled:!0});return t?.updated?(e.lifetracksConfig=t.config,await Qn(e),!0):!1}catch(t){return e.lifetracksError=t instanceof Error?t.message:"Failed to enable lifetracks",!1}}async function Cf(e,t){if(!e.client||!e.connected)return e.lifetracksGenerationError="Not connected to gateway",!1;e.lifetracksGenerating=!0,e.lifetracksGenerationError=null;try{const n=await e.client.request("lifetracks.generate",t||{});return n?.generated&&n.track?(e.lifetracksData=[n.track,...e.lifetracksData||[]],e.lifetracksCurrentTrack=n.track,await oc(e),!0):n?.alreadyExists&&n.track?(e.lifetracksCurrentTrack=n.track,!0):(e.lifetracksGenerationError=n?.error||"Generation failed",!1)}catch(n){return e.lifetracksGenerationError=n instanceof Error?n.message:"Failed to generate lifetrack",!1}finally{e.lifetracksGenerating=!1}}const Lf=["~/godmode/memory/AGENT-DAY.md","~/godmode/AGENT-DAY.md"];function Ef(e){return[...[`~/godmode/memory/agent-day/${e}.md`,`~/godmode/memory/agent-log/${e}.md`,`~/godmode/memory/daily/${e}-agent-log.md`],...Lf]}function If(e){return["Needs Review","Active Sub-Agents","Completed Today","Queue","Feedback Log","AGENT-DAY"].filter(s=>e.includes(s)).length>=2}async function rc(e,t){try{const n=t?{date:t}:{},s=await e.request("dailyBrief.get",n);return!s||!s.content||!s.date?null:s}catch(n){return console.error("[MyDay] Failed to load daily brief:",n),null}}async function lc(e,t,n){const s=t||new Date().toISOString().split("T")[0],i="agentLog.get";try{const a=await e.request(i,{date:s});if(a?.content?.trim()&&a?.sourcePath)return{date:a.date||s,content:a.content,updatedAt:a.updatedAt||new Date().toISOString(),sourcePath:a.sourcePath}}catch(a){console.warn(`[MyDay] ${i} unavailable, falling back to files.read:`,a)}return Mf(e,s)}async function Mf(e,t){const n=Ef(t),s=i=>i.includes("AGENT-DAY.md");for(const i of n)try{const a=await e.request("files.read",{path:i,maxSize:1e6});if(!a?.content?.trim()||!If(a.content)||s(i)&&typeof a.modifiedAt=="number"&&new Date(a.modifiedAt).toISOString().split("T")[0]!==t)continue;return{date:t,content:a.content,updatedAt:typeof a.modifiedAt=="number"?new Date(a.modifiedAt).toISOString():new Date().toISOString(),sourcePath:i}}catch{}return null}function Xs(e,t,n){return new Promise((s,i)=>{const a=setTimeout(()=>i(new Error(`${n} timed out after ${t}ms`)),t);e.then(o=>{clearTimeout(a),s(o)},o=>{clearTimeout(a),i(o)})})}async function Zs(e){if(!(!e.client||!e.connected)){e.dailyBriefLoading=!0,e.dailyBriefError=null;try{e.dailyBrief=await rc(e.client,e.todaySelectedDate),e.loadBriefNotes&&await e.loadBriefNotes()}catch(t){e.dailyBriefError=t instanceof Error?t.message:"Failed to load daily brief",console.error("[MyDay] Brief load error:",t)}finally{e.dailyBriefLoading=!1}}}async function At(e,t){if(!(!e.client||!e.connected)){e.agentLogLoading=!0,e.agentLogError=null;try{e.agentLog=await lc(e.client,e.todaySelectedDate,t)}catch(n){e.agentLogError=n instanceof Error?n.message:"Failed to load agent log",console.error("[MyDay] Agent log load error:",n)}finally{e.agentLogLoading=!1}}}function Rf(e){const t=e||new Date().toISOString().split("T")[0],n="VAULT",s=`01-Daily/${t}`,i=`obsidian://open?vault=${encodeURIComponent(n)}&file=${encodeURIComponent(s)}`;window.open(i,"_blank")}async function Ei(e){if(!e.client||!e.connected)return;e.myDayLoading=!0,e.myDayError=null,e.dailyBriefLoading=!0,e.agentLogLoading=!0;const t=e.todaySelectedDate,n=e.loadBriefNotes?Xs(e.loadBriefNotes(),5e3,"Brief Notes"):Promise.resolve(),s=await Promise.allSettled([Xs(rc(e.client,t),1e4,"Daily Brief"),n,Xs(lc(e.client,t),1e4,"Agent Log")]);e.dailyBrief=s[0].status==="fulfilled"?s[0].value:null,e.agentLog=s[2].status==="fulfilled"?s[2].value:null;const i=["Brief","Brief Notes","Agent Log"],a=s.map((o,l)=>o.status==="rejected"?{section:i[l],reason:o.reason}:null).filter(Boolean);if(a.length>0){for(const o of a)console.warn(`[MyDay] ${o.section} failed:`,o.reason);a.length===s.length&&(e.myDayError="Failed to load daily brief")}e.myDayLoading=!1,e.dailyBriefLoading=!1,e.agentLogLoading=!1}function Pf(e,t){const n=()=>{console.log("[MyDay] Received agent log update"),t()};return e.on("agent-log:update",n),()=>{e.off("agent-log:update",n)}}async function cc(e){if(!(!e.client||!e.connected)){e.peopleLoading=!0,e.peopleError=null;try{const t=await e.client.request("people.list",{});e.peopleList=t.people??[]}catch(t){console.error("[People] Failed to load contacts:",t),e.peopleError=t instanceof Error?t.message:"Failed to load contacts"}finally{e.peopleLoading=!1}}}async function ga(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const t=await e.client.request("system-presence",{});Array.isArray(t)?(e.presenceEntries=t,e.presenceStatus=t.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(t){e.presenceError=String(t)}finally{e.presenceLoading=!1}}}function Pt(e,t,n){if(!t.trim())return;const s={...e.skillMessages};n?s[t]=n:delete s[t],e.skillMessages=s}function us(e){return e instanceof Error?e.message:String(e)}async function vn(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const n=await e.client.request("skills.status",{});n&&(e.skillsReport=n)}catch(n){e.skillsError=us(n)}finally{e.skillsLoading=!1}}}function Df(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function Nf(e,t,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:t,enabled:n}),await vn(e),Pt(e,t,{kind:"success",message:n?"Skill enabled":"Skill disabled"})}catch(s){const i=us(s);e.skillsError=i,Pt(e,t,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function Of(e,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const n=e.skillEdits[t]??"";await e.client.request("skills.update",{skillKey:t,apiKey:n}),await vn(e),Pt(e,t,{kind:"success",message:"API key saved"})}catch(n){const s=us(n);e.skillsError=s,Pt(e,t,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function Bf(e,t,n,s){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const i=await e.client.request("skills.install",{name:n,installId:s,timeoutMs:12e4});await vn(e),Pt(e,t,{kind:"success",message:i?.message??"Installed"})}catch(i){const a=us(i);e.skillsError=a,Pt(e,t,{kind:"error",message:a})}finally{e.skillsBusyKey=null}}}async function Ii(e){if(!e.client||!e.connected){e.visionBoardError="Not connected to gateway";return}e.visionBoardLoading=!0,e.visionBoardError=null;try{const[t,n]=await Promise.all([e.client.request("visionBoard.get",{}),e.client.request("visionBoard.identityToday",{})]);t?e.visionBoardData=t:e.visionBoardError="No data returned",n&&(e.visionBoardIdentityToday=n.identity)}catch(t){e.visionBoardError=t instanceof Error?t.message:"Failed to load vision board"}finally{e.visionBoardLoading=!1}}async function Jn(e){if(!e.client||!e.connected){e.wheelOfLifeError="Not connected to gateway";return}e.wheelOfLifeLoading=!0,e.wheelOfLifeError=null;try{const t=await e.client.request("wheelOfLife.get",{});t?e.wheelOfLifeData=t:e.wheelOfLifeError="No data returned"}catch(t){e.wheelOfLifeError=t instanceof Error?t.message:"Failed to load wheel data"}finally{e.wheelOfLifeLoading=!1}}async function Ff(e,t){if(!e.client||!e.connected)return e.wheelOfLifeError="Not connected to gateway",!1;try{return(await e.client.request("wheelOfLife.update",{updates:t}))?.updated?(await Jn(e),!0):!1}catch(n){return e.wheelOfLifeError=n instanceof Error?n.message:"Failed to update wheel",!1}}function Uf(e){e.wheelOfLifeEditMode=!0}function er(e){e.wheelOfLifeEditMode=!1}async function dc(e){if(!(!e.client||!e.connected)){e.workLoading=!0,e.workError=null;try{const t=await e.client.request("projects.list",{});e.workProjects=t.projects??[]}catch(t){console.error("[Work] Failed to load:",t),e.workError=t instanceof Error?t.message:"Failed to load"}finally{e.workLoading=!1}}}async function Kf(e,t){if(!e.client||!e.connected)return;const n=new Set(e.workDetailLoading??[]);n.add(t),e.workDetailLoading=n;try{const s=await e.client.request("projects.get",{id:t,includeFiles:!0,depth:2});if(s){const i=s.files??[];e.workProjectFiles={...e.workProjectFiles,[t]:i}}}catch(s){console.warn("[Work] Failed to load project details:",s)}finally{const s=new Set(e.workDetailLoading??[]);s.delete(t),e.workDetailLoading=s}}function ma(e,t=Date.now()){if(typeof e=="number"&&Number.isFinite(e))return new Date(e);if(typeof e=="string"){const n=Date.parse(e);if(Number.isFinite(n))return new Date(n)}return new Date(t)}function va(e){return{id:e.id,name:e.name,emoji:e.emoji||"📁",type:e.type,path:e.path,artifactCount:e.artifactCount??0,sessionCount:e.sessionCount??0,lastUpdated:ma(e.lastUpdated,e.lastScanned)}}function tr(e){return{path:e.path,name:e.name,type:e.type,size:e.size,modified:ma(e.modified),isDirectory:e.isDirectory,searchText:e.searchText}}function nr(e){return{id:e.id,key:e.key,title:e.title,created:ma(e.created),status:e.status,workspaceSubfolder:e.workspaceSubfolder}}function Wf(e,t){return{...t,id:e.id,name:e.name,emoji:e.emoji,type:e.type,path:e.path,artifactCount:e.artifactCount,sessionCount:e.sessionCount,lastUpdated:e.lastUpdated}}async function ps(e){if(!e.client||!e.connected){e.workspaces=[],e.workspacesLoading=!1,e.workspacesError="Connect to gateway to see workspaces";return}e.workspacesLoading=!0,e.workspacesError=null;try{const t=await e.client.request("workspaces.list",{});if(e.workspaces=(t.workspaces??[]).map(va),e.selectedWorkspace){const n=e.workspaces.find(s=>s.id===e.selectedWorkspace?.id);n&&(e.selectedWorkspace=Wf(n,e.selectedWorkspace))}}catch(t){console.error("[Workspaces] load failed:",t),e.workspacesError=t instanceof Error?t.message:"Failed to load workspaces",e.workspaces=[]}finally{e.workspacesLoading=!1}}async function hs(e,t){if(!e.client||!e.connected)return null;try{const n=await e.client.request("workspaces.get",{id:t});return n.workspace?{...va(n.workspace),pinned:(n.pinned??[]).map(tr),pinnedSessions:(n.pinnedSessions??[]).map(nr),outputs:(n.outputs??[]).map(tr),sessions:(n.sessions??[]).map(nr)}:null}catch(n){return console.error("[Workspaces] get failed:",n),null}}async function Hf(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("workspaces.readFile",n?{workspaceId:n,filePath:t}:{path:t});return s.content?{content:s.content,mime:s.contentType??s.mime??"text/plain"}:(s.error&&console.warn("[Workspaces] readFile failed:",s.error),null)}catch(s){return console.error("[Workspaces] readFile error:",s),null}}async function zf(e){if(!(!e.client||!e.connected))try{e.workspacesLoading=!0,e.workspacesError=null,await e.client.request("workspaces.scan",{}),await ps(e)}catch(t){e.workspacesError=t instanceof Error?t.message:"Failed to scan workspaces"}finally{e.workspacesLoading=!1}}async function jf(e,t){if(!t){e.selectedWorkspace=null;return}const n=await hs(e,t.id);e.selectedWorkspace=n||{...t,pinned:[],pinnedSessions:[],outputs:[],sessions:[]}}async function Vf(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpin":"workspaces.pin",{workspaceId:t,filePath:n}),e.selectedWorkspace?.id===t){const i=await hs(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] pin toggle failed:",i),!1}}async function Gf(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpinSession":"workspaces.pinSession",{workspaceId:t,sessionKey:n}),e.selectedWorkspace?.id===t){const i=await hs(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] session pin toggle failed:",i),!1}}async function qf(e,t){if(!e.client||!e.connected)return null;const n=String(t.name??"").trim();if(!n)return e.workspacesError="Workspace name is required",null;const s=t.type??"project",i=String(t.path??"").trim();try{const a=await e.client.request("workspaces.create",{name:n,type:s,...i?{path:i}:{}});if(!a.workspace)return e.workspacesError="Workspace creation returned no workspace",null;const o=va(a.workspace),l=e.workspaces??[],c=new Map(l.map(u=>[u.id,u]));return c.set(o.id,o),e.workspaces=Array.from(c.values()).toSorted((u,p)=>p.lastUpdated.getTime()-u.lastUpdated.getTime()),e.workspacesError=null,o}catch(a){return console.error("[Workspaces] create failed:",a),e.workspacesError=a instanceof Error?a.message:"Failed to create workspace",null}}function Yf(e,t){e.workspacesSearchQuery=t}function Qf(e){e.selectedWorkspace=null}const Yt=Object.freeze(Object.defineProperty({__proto__:null,clearWorkspaceSelection:Qf,createWorkspace:qf,getWorkspace:hs,loadWorkspaces:ps,readWorkspaceFile:Hf,scanWorkspaces:zf,selectWorkspace:jf,setWorkspacesSearchQuery:Yf,toggleWorkspacePin:Vf,toggleWorkspaceSessionPin:Gf},Symbol.toStringTag,{value:"Module"})),Jf=[{label:"",tabs:["chat","mission","today","workspaces"]},{label:"Control",tabs:["overview","channels","instances","sessions","cron"]},{label:"Agent",tabs:["skills","nodes"]},{label:"Settings",tabs:["config","debug","logs"]}],uc={overview:"/overview",mission:"/mission",workspaces:"/workspaces",today:"/today",work:"/work",people:"/people",life:"/life",data:"/data","my-day":"/today","inner-work":"/inner-work","wheel-of-life":"/wheel-of-life","vision-board":"/vision-board",lifetracks:"/lifetracks",therapist:"/therapist",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",nodes:"/nodes",chat:"/chat",config:"/config",debug:"/debug",logs:"/logs"},Dt=new Map(Object.entries(uc).map(([e,t])=>[t,e]));Dt.set("/today","today");Dt.set("/my-day","today");Dt.set("/work","workspaces");function fs(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function hn(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function ya(e,t=""){const n=fs(t),s=uc[e];return n?`${n}${s}`:s}function pc(e,t=""){const n=fs(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let i=hn(s).toLowerCase();return i.endsWith("/index.html")&&(i="/"),i==="/"?"chat":Dt.get(i)??null}function Xf(e){let t=hn(e);if(t.endsWith("/index.html")&&(t=hn(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const i=`/${n.slice(s).join("/")}`.toLowerCase();if(Dt.has(i)){const a=n.slice(0,s);return!a.length||a.some(l=>Dt.has(`/${l.toLowerCase()}`))?"":`/${a.join("/")}`}}return`/${n.join("/")}`}function Xn(e){switch(e){case"chat":return"Chat";case"today":case"my-day":return"Today";case"work":return"Workspaces";case"people":return"People";case"life":return"Life";case"data":return"Data";case"overview":return"Overview";case"mission":return"Mission Control";case"workspaces":return"Workspaces";case"inner-work":return"Inner Work";case"wheel-of-life":return"Wheel of Life";case"vision-board":return"Vision Board";case"lifetracks":return"Lifetracks";case"therapist":return"Therapist";case"channels":return"Channels";case"instances":return"Instances";case"sessions":return"Sessions";case"cron":return"Cron Jobs";case"skills":return"Skills";case"nodes":return"Nodes";case"config":return"Config";case"debug":return"Debug";case"logs":return"Logs";default:return"Control"}}function Zf(e){switch(e){case"chat":return"💬";case"today":case"my-day":return"☀️";case"work":return"💼";case"people":return"👥";case"life":return"✨";case"data":return"📊";case"overview":return"🎯";case"mission":return"⚡";case"workspaces":return"📂";case"inner-work":return"🧘";case"wheel-of-life":return"🎡";case"vision-board":return"🌠";case"lifetracks":return"🎵";case"therapist":return"🌿";case"channels":return"🔗";case"instances":return"📡";case"sessions":return"📄";case"cron":return"⏰";case"skills":return"🧩";case"nodes":return"🖥️";case"config":return"⚙️";case"debug":return"🐛";case"logs":return"📜";default:return"📁"}}function eg(e){switch(e){case"chat":return"Your command center. Ask anything, customize any view.";case"today":case"my-day":return"Calendar, brief, tasks, and schedule for the day.";case"work":return"Your projects, files, tasks, and team — organized by workspace.";case"people":return"Contacts, relationships, and follow-up suggestions.";case"life":return"Vision board, goals, life scores, and LifeTracks.";case"data":return"Connected integrations, data sources, and query interface.";case"overview":return"Gateway status, entry points, and a fast health read.";case"mission":return"Agent orchestration — active runs, fleet status, and task queue.";case"workspaces":return"Content explorer organized by project and client.";case"inner-work":return"Therapy, shadow work, and personal development with Sage.";case"wheel-of-life":return"Track balance across 8 life dimensions with scores, targets, and trends.";case"vision-board":return"Your Chief Definite Aim, annual themes, values, and identity statements.";case"lifetracks":return"Daily personalized meditation audio with affirmations and vision alignment.";case"therapist":return"Private, ephemeral space for processing thoughts. Auto-deletes in 24 hours.";case"channels":return"Manage channels and settings.";case"instances":return"Presence beacons from connected clients and nodes.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Schedule wakeups and recurring agent runs.";case"skills":return"Manage skill availability and API key injection.";case"nodes":return"Paired devices, capabilities, and command exposure.";case"config":return"Edit ~/.openclaw/config.json safely.";case"debug":return"Gateway snapshots, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}const hc="godmode.ui.settings.v1";function tg(){const e=new URLSearchParams(location.search),t=(()=>{const i=e.get("gatewayUrl");return i||(typeof window.__GODMODE_DEV__<"u"?"/ws":`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}`)})(),n=e.get("token")||"",s={gatewayUrl:t,token:n,sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{},openTabs:["agent:main:main"],tabLastViewed:{},userName:"",userAvatar:""};try{const i=localStorage.getItem(hc);if(!i)return s;const a=JSON.parse(i);return{gatewayUrl:e.get("gatewayUrl")||(typeof window.__GODMODE_DEV__<"u"?"/ws":typeof a.gatewayUrl=="string"&&a.gatewayUrl.trim()?a.gatewayUrl.trim():s.gatewayUrl),token:n||(typeof a.token=="string"?a.token:""),sessionKey:typeof a.sessionKey=="string"&&a.sessionKey.trim()?a.sessionKey.trim():s.sessionKey,lastActiveSessionKey:typeof a.lastActiveSessionKey=="string"&&a.lastActiveSessionKey.trim()?a.lastActiveSessionKey.trim():typeof a.sessionKey=="string"&&a.sessionKey.trim()||s.lastActiveSessionKey,theme:a.theme==="light"||a.theme==="dark"||a.theme==="system"?a.theme:s.theme,chatFocusMode:typeof a.chatFocusMode=="boolean"?a.chatFocusMode:s.chatFocusMode,chatShowThinking:typeof a.chatShowThinking=="boolean"?a.chatShowThinking:s.chatShowThinking,splitRatio:typeof a.splitRatio=="number"&&a.splitRatio>=.4&&a.splitRatio<=.7?a.splitRatio:s.splitRatio,navCollapsed:typeof a.navCollapsed=="boolean"?a.navCollapsed:s.navCollapsed,navGroupsCollapsed:typeof a.navGroupsCollapsed=="object"&&a.navGroupsCollapsed!==null?a.navGroupsCollapsed:s.navGroupsCollapsed,openTabs:Array.isArray(a.openTabs)&&a.openTabs.every(o=>typeof o=="string")?a.openTabs:s.openTabs,tabLastViewed:typeof a.tabLastViewed=="object"&&a.tabLastViewed!==null?a.tabLastViewed:s.tabLastViewed,userName:typeof a.userName=="string"?a.userName.trim().slice(0,50):s.userName,userAvatar:typeof a.userAvatar=="string"?a.userAvatar.trim():s.userAvatar}}catch{return s}}function ng(e){localStorage.setItem(hc,JSON.stringify(e))}function sg(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function ba(e){return e==="system"?sg():e}const In=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,ig=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,Qt=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},ag=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const i=globalThis.document??null;if(!i){t();return}const a=i.documentElement,o=i,l=ig();if(!!o.startViewTransition&&!l){let u=.5,p=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")u=In(n.pointerClientX/window.innerWidth),p=In(n.pointerClientY/window.innerHeight);else if(n?.element){const g=n.element.getBoundingClientRect();g.width>0&&g.height>0&&typeof window<"u"&&(u=In((g.left+g.width/2)/window.innerWidth),p=In((g.top+g.height/2)/window.innerHeight))}a.style.setProperty("--theme-switch-x",`${u*100}%`),a.style.setProperty("--theme-switch-y",`${p*100}%`),a.classList.add("theme-transition");const h=setTimeout(()=>{Qt(a)},1e3);try{const g=o.startViewTransition?.(()=>{t()});g?.finished?g.finished.finally(()=>{clearTimeout(h),Qt(a)}):(clearTimeout(h),Qt(a))}catch{clearTimeout(h),Qt(a),t()}return}t(),Qt(a)};function ze(e,t){const n={...t,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||t.sessionKey.trim()||"main"};e.settings=n,ng(n),t.theme!==e.theme&&(e.theme=t.theme,ms(e,ba(t.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function fc(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&ze(e,{...e.settings,lastActiveSessionKey:n})}function og(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),n=t.get("token"),s=t.get("password"),i=t.get("session"),a=t.get("gatewayUrl");let o=!1;if(n!=null){const c=n.trim();c&&c!==e.settings.token&&ze(e,{...e.settings,token:c}),t.delete("token"),o=!0}if(s!=null){const c=s.trim();c&&(e.password=c),t.delete("password"),o=!0}if(i!=null){const c=i.trim();if(c){e.sessionKey=c;const u=e.settings.openTabs.includes(c)?e.settings.openTabs:[...e.settings.openTabs,c];ze(e,{...e.settings,sessionKey:c,lastActiveSessionKey:c,openTabs:u})}}if(a!=null){const c=a.trim();c&&c!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=c),t.delete("gatewayUrl"),o=!0}if(!o)return;const l=new URL(window.location.href);l.search=t.toString(),window.history.replaceState({},"",l.toString())}function rg(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?la(e):ca(e),t==="logs"?da(e):ua(e),t==="debug"?pa(e):ha(e),gs(e),mc(e,t,!1)}function lg(e,t,n){ag({nextTheme:t,applyTheme:()=>{e.theme=t,ze(e,{...e.settings,theme:t}),ms(e,ba(t))},context:n,currentTheme:e.theme})}async function gs(e){e.tab==="overview"&&await vc(e),(e.tab==="today"||e.tab==="my-day")&&await Ei(e),e.tab==="work"&&await dc(e),e.tab==="people"&&await cc(e),e.tab==="mission"&&await nc(e),e.tab==="workspaces"&&await ps(e),e.tab==="wheel-of-life"&&await Jn(e),e.tab==="vision-board"&&await Ii(e),e.tab==="lifetracks"&&await Qn(e),e.tab==="life"&&await Promise.all([Jn(e),Ii(e),Qn(e)]),e.tab==="data"&&e.handleDataRefresh(),e.tab==="channels"&&await gg(e),e.tab==="instances"&&await ga(e),e.tab==="sessions"&&await le(e),e.tab==="cron"&&await wa(e),e.tab==="skills"&&await vn(e),e.tab==="nodes"&&(await ls(e),await Ge(e),await Ie(e),await fa(e)),e.tab==="chat"&&(await bc(e),Rt(e,!e.chatHasAutoScrolled)),e.tab==="config"&&(await rl(e),await Ie(e)),e.tab==="debug"&&(await cs(e),e.eventLog=Yh()),e.tab==="logs"&&(e.logsAtBottom=!0,await ra(e,{reset:!0}),ul(e,!0))}function cg(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?fs(e):Xf(window.location.pathname)}function dg(e){e.theme=e.settings.theme??"system",ms(e,ba(e.theme))}function ms(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t}function ug(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&ms(e,n.matches?"dark":"light")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function pg(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function hg(e,t){if(typeof window>"u")return;const n=pc(window.location.pathname,e.basePath)??"chat";gc(e,n),mc(e,n,t)}function fg(e){if(typeof window>"u")return;const t=pc(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();if(s){e.sessionKey=s;const i=e.settings.openTabs.includes(s)?e.settings.openTabs:[...e.settings.openTabs,s];ze(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s,openTabs:i})}gc(e,t)}function gc(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?la(e):ca(e),t==="logs"?da(e):ua(e),t==="debug"?pa(e):ha(e),e.connected&&gs(e)}function mc(e,t,n){if(typeof window>"u")return;const s=hn(ya(t,e.basePath)),i=hn(window.location.pathname),a=new URL(window.location.href);t==="chat"&&e.sessionKey?a.searchParams.set("session",e.sessionKey):a.searchParams.delete("session"),i!==s&&(a.pathname=s),n?window.history.replaceState({},"",a.toString()):window.history.pushState({},"",a.toString())}function ge(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),window.history.replaceState({},"",s.toString())}async function vc(e){await Promise.all([ye(e,!1),ga(e),le(e),mn(e),cs(e)])}async function gg(e){await Promise.all([ye(e,!0),rl(e),Ie(e)])}async function wa(e){await Promise.all([ye(e,!1),mn(e),ds(e)])}function Mi(e){return e.chatSending||!!e.chatRunId}function Ee(e,t){const n=e.sessionKey,s=e.chatMessage.trim();if(s)e.chatDrafts={...e.chatDrafts,[n]:s};else{const{[n]:i,...a}=e.chatDrafts;e.chatDrafts=a}}function Ke(e,t){const n=t??e.sessionKey;e.chatMessage=e.chatDrafts[n]??""}function mg(e,t){const n=e.sessionKey,{[n]:s,...i}=e.chatDrafts;e.chatDrafts=i,n===e.sessionKey&&(e.chatMessage="")}function vg(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function yg(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function yc(e){e.connected&&(e.chatMessage="",await Nl(e))}function bg(e,t,n){const s=t.trim(),i=!!(n&&n.length>0);if(!s&&!i)return;const a=Date.now();e.chatQueue=[...e.chatQueue,{id:os(),text:s,createdAt:a,attachments:i?n?.map(l=>({...l})):void 0}];const o=[];if(s&&o.push({type:"text",text:s}),i&&n)for(const l of n)o.push({type:"image",source:{type:"base64",media_type:l.mimeType,data:l.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:o,timestamp:a}],Rt(e,!0)}async function Ri(e,t,n){Hi(e);const s=e;s.sessionKey&&s.workingSessions&&(s.workingSessions=new Set([...s.workingSessions,s.sessionKey])),n?.skipOptimisticUpdate||queueMicrotask(()=>{Rt(e,!0)});const i=await Dl(e,t,n?.attachments,{skipOptimisticUpdate:n?.skipOptimisticUpdate});return!i&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!i&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),i&&(fc(e,e.sessionKey),e.chatAttachments=[]),i&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),i&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),Rt(e,!0),i&&!e.chatRunId&&ka(e),i&&n?.refreshSessions&&(e.refreshSessionsAfterChat=!0),i}async function ka(e){if(!e.connected||Mi(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await Ri(e,t.text,{attachments:t.attachments,skipOptimisticUpdate:!0})||(e.chatQueue=[t,...e.chatQueue])}function wg(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function kg(e,t,n){if(!e.connected)return;const s=e.chatMessage,i=(t??e.chatMessage).trim(),a=e.chatAttachments??[],o=t==null?a:[],l=o.length>0;if(!i&&!l)return;if(vg(i)){await yc(e);return}const c=yg(i);if(t==null&&(e.chatMessage="",mg(e)),n?.queue){bg(e,i,o),Mi(e)||await ka(e);return}if(Mi(e)){await Nl(e),await new Promise(u=>setTimeout(u,50)),await Ri(e,i,{attachments:l?o:void 0,refreshSessions:c});return}await Ri(e,i,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:l?o:void 0,previousAttachments:t==null?a:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:c})}async function bc(e){await Promise.all([de(e),le(e,{activeMinutes:0}),Pi(e)]),Rt(e,!0)}const $g=ka;function Sg(e){const t=dl(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function Ag(e,t){const n=fs(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function Pi(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=Sg(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=Ag(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const i=await s.json(),a=typeof i.avatarUrl=="string"?i.avatarUrl.trim():"";e.chatAvatarUrl=a||null}catch{e.chatAvatarUrl=null}}const xg={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},_g={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};const $a={CHILD:2},Sa=e=>(...t)=>({_$litDirective$:e,values:t});let Aa=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,s){this._$Ct=t,this._$AM=n,this._$Ci=s}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};const{I:Tg}=Sd,sr=e=>e,Cg=e=>e.strings===void 0,ir=()=>document.createComment(""),Jt=(e,t,n)=>{const s=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0){const a=s.insertBefore(ir(),i),o=s.insertBefore(ir(),i);n=new Tg(a,o,e,e.options)}else{const a=n._$AB.nextSibling,o=n._$AM,l=o!==e;if(l){let c;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(c=e._$AU)!==o._$AU&&n._$AP(c)}if(a!==i||l){let c=n._$AA;for(;c!==a;){const u=sr(c).nextSibling;sr(s).insertBefore(c,i),c=u}}}return n},Ze=(e,t,n=e)=>(e._$AI(t,n),e),Lg={},Eg=(e,t=Lg)=>e._$AH=t,Ig=e=>e._$AH,ei=e=>{e._$AR(),e._$AA.remove()};const ar=(e,t,n)=>{const s=new Map;for(let i=t;i<=n;i++)s.set(e[i],i);return s},vs=Sa(class extends Aa{constructor(e){if(super(e),e.type!==$a.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let s;n===void 0?n=t:t!==void 0&&(s=t);const i=[],a=[];let o=0;for(const l of e)i[o]=s?s(l,o):o,a[o]=n(l,o),o++;return{values:a,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,s]){const i=Ig(e),{values:a,keys:o}=this.dt(t,n,s);if(!Array.isArray(i))return this.ut=o,a;const l=this.ut??=[],c=[];let u,p,h=0,g=i.length-1,d=0,m=a.length-1;for(;h<=g&&d<=m;)if(i[h]===null)h++;else if(i[g]===null)g--;else if(l[h]===o[d])c[d]=Ze(i[h],a[d]),h++,d++;else if(l[g]===o[m])c[m]=Ze(i[g],a[m]),g--,m--;else if(l[h]===o[m])c[m]=Ze(i[h],a[m]),Jt(e,c[m+1],i[h]),h++,m--;else if(l[g]===o[d])c[d]=Ze(i[g],a[d]),Jt(e,i[h],i[g]),g--,d++;else if(u===void 0&&(u=ar(o,d,m),p=ar(l,h,g)),u.has(l[h]))if(u.has(l[g])){const k=p.get(o[d]),$=k!==void 0?i[k]:null;if($===null){const S=Jt(e,i[h]);Ze(S,a[d]),c[d]=S}else c[d]=Ze($,a[d]),Jt(e,i[h],$),i[k]=null;d++}else ei(i[g]),g--;else ei(i[h]),h++;for(;d<=m;){const k=Jt(e,c[m+1]);Ze(k,a[d]),c[d++]=k}for(;h<=g;){const k=i[h++];k!==null&&ei(k)}return this.ut=o,Eg(e,c),He}}),W={messageSquare:r`
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
  `};function xa(e){Ee(e);const n=`agent:main:webchat-${os().slice(0,8)}`;e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,n],sessionKey:n,lastActiveSessionKey:n,tabLastViewed:{...e.settings.tabLastViewed,[n]:Date.now()}}),e.sessionKey=n,e.chatMessage="",e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ge(e,n),de(e)}function wc(e,t){const n=ya(t,e.basePath);return r`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||(s.preventDefault(),e.setTab(t))}}
      title=${Xn(t)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${Zf(t)}</span>
      <span class="nav-item__text">${Xn(t)}</span>
    </a>
  `}function kc(e){const t=e.onboarding,n=e.onboarding,s=e.onboarding?!1:e.settings.chatShowThinking,i=e.onboarding?!0:e.settings.chatFocusMode,a=r`
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
  `,l=r`
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
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
  `;return r`
    <div class="chat-toolbar">
      <!-- New session button -->
      <button
        class="chat-toolbar__btn"
        @click=${()=>xa(e)}
        title="Start a new session (⌘⇧P)"
        aria-label="New session"
      >
        ${l}
      </button>
      <!-- Session picker (folder dropdown) -->
      <div class="session-picker-container">
        <button
          class="chat-toolbar__btn ${e.sessionPickerOpen?"active":""}"
          @click=${u=>{const h=u.currentTarget.getBoundingClientRect();e.sessionPickerPosition={top:h.bottom+8,right:window.innerWidth-h.right},e.sessionPickerOpen||le(e),e.handleToggleSessionPicker()}}
          title="Open sessions"
          aria-label="Open sessions"
          aria-expanded=${e.sessionPickerOpen}
        >
          ${W.folderOpen}
        </button>
        ${e.sessionPickerOpen?Pg(e):f}
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
          ${c}
        </button>
        ${e.sessionSearchOpen?Rg(e):f}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),bc(e)}}
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
        ${W.brain}
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
        title=${e.chatPrivateMode?"Private mode ON — click to disable":"Enable private mode (no memory/logging)"}
      >
        ${W.lock}
      </button>
      <span class="chat-toolbar__separator"></span>
      <!-- Compact chat button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${!e.connected}
        @click=${()=>{e.handleCompactChat()}}
        title="Compact chat context"
      >
        ${W.minimize}
      </button>
    </div>
  `}function Mg(e){const t=new Date,n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=new Date(n.getTime()-864e5);return{today:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=n),yesterday:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=s&&new Date(i.updatedAt)<n),older:e.filter(i=>!i.updatedAt||new Date(i.updatedAt)<s)}}let ti=null;function Rg(e){if(!e.client||!e.connected)return r`
      <div
        class="session-search-dropdown"
        style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;const t=i=>{const a=i.target.value;e.sessionSearchQuery=a,ti&&clearTimeout(ti),ti=setTimeout(()=>{e.handleSessionSearchQuery(a)},300)},n=i=>{e.sessionSearchOpen=!1,e.sessionSearchQuery="",e.sessionSearchResults=[],Ee(e),e.settings.openTabs.includes(i)?(e.sessionKey=i,e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,i],sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.sessionKey=i),Ke(e,i),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ge(e,i),de(e)},s=i=>{const a=i.label??i.displayName??i.key,o=i.matches.length>0;return r`
      <div class="session-search-result" @click=${()=>n(i.key)}>
        <div class="session-search-result__header">
          <span class="session-search-result__name">${a}</span>
        </div>
        ${o?r`
              <div class="session-search-result__matches">
                ${i.matches.slice(0,2).map(l=>r`
                    <div class="session-search-result__match">
                      <span class="session-search-result__role">${l.role}:</span>
                      <span class="session-search-result__text">${l.text}</span>
                    </div>
                  `)}
              </div>
            `:f}
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
  `}function Pg(e){const t=(e.sessionPickerSearch??"").toLowerCase().trim();if(!e.client||!e.connected)return r`
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
    `;let n=(e.sessionsResult?.sessions??[]).filter(g=>!e.settings.openTabs.includes(g.key));t&&(n=n.filter(g=>[g.label,g.displayName,g.key].filter(Boolean).some(m=>m.toLowerCase().includes(t))));const s=50,i=n.length,a=n.slice(0,s),o=Mg(a),l=g=>{e.sessionPickerOpen=!1,e.sessionPickerSearch="",Ee(e),e.settings.openTabs.includes(g)?(e.sessionKey=g,e.applySettings({...e.settings,sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,g],sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}}),e.sessionKey=g),Ke(e,g),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ge(e,g),de(e)},c=async(g,d)=>{if(g.stopPropagation(),!!window.confirm(`Delete session "${d}"?

Deletes the session entry and archives its transcript.`)&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.filter(k=>k.key!==d)}),e.client&&e.connected))try{await e.client.request("sessions.delete",{key:d,deleteTranscript:!0}),le(e)}catch(k){console.error("Failed to delete session:",k),le(e)}},u=g=>r`
    <div class="session-picker-item" @click=${()=>l(g.key)}>
      <span class="session-picker-item__status ${g.isActive?"active":""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${g.label??g.displayName??g.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${g.updatedAt?r`<span class="session-picker-item__time">${au(g.updatedAt)}</span>`:f}
        <button
          class="session-picker-item__close"
          @click=${d=>c(d,g.key)}
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
  `,p=(g,d)=>d.length===0?f:r`
      <div class="session-picker-group">
        <div class="session-picker-group__header">${g}</div>
        ${vs(d,m=>m.key,u)}
      </div>
    `,h=o.today.length+o.yesterday.length+o.older.length;return r`
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
        ${h===0?r`
                <div class="session-picker-empty">No other sessions</div>
              `:r`
              ${p("Today",o.today)}
              ${p("Yesterday",o.yesterday)}
              ${p("Older",o.older)}
              ${i>s?r`<div class="session-picker-overflow">
                    Showing ${s} of ${i} sessions. Use search to find more.
                  </div>`:f}
            `}
      </div>
    </div>
  `}const Dg=["system","light","dark"];function $c(e){const t=Math.max(0,Dg.indexOf(e.theme)),n=s=>i=>{const o={element:i.currentTarget};(i.clientX||i.clientY)&&(o.pointerClientX=i.clientX,o.pointerClientY=i.clientY),e.setTheme(s,o)};return r`
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
          ${Bg()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${Ng()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${Og()}
        </button>
      </div>
    </div>
  `}function Ng(){return r`
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
  `}function Og(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function Bg(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}const ni=Object.freeze(Object.defineProperty({__proto__:null,createNewSession:xa,renderChatControls:kc,renderTab:wc,renderThemeToggle:$c},Symbol.toStringTag,{value:"Module"}));function Fg(e){e.basePath=cg(),e._urlSettingsApplied||(og(e),e._urlSettingsApplied=!0),hg(e,!0),dg(e),ug(e),window.addEventListener("popstate",e.popStateHandler),e.keydownHandler=t=>{if(e.tab!=="chat")return;if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="p"){t.preventDefault(),xa(e);return}if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="h"){t.preventDefault(),e.handleConsciousnessFlush();return}if(!t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.key<"1"||t.key>"9")return;const n=parseInt(t.key,10)-1,s=e.settings.openTabs;if(n>=s.length)return;const i=s[n];i!==e.sessionKey&&(t.preventDefault(),Ee(e),e.sessionKey=i,Ke(e,i),e.chatLoading=!0,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.loadAssistantIdentity(),ge(e,i),de(e))},window.addEventListener("keydown",e.keydownHandler),oa(e),e.tab==="nodes"&&la(e),e.tab==="logs"&&da(e),e.tab==="debug"&&pa(e)}function Ug(e){tu(e)}function Kg(e){window.removeEventListener("popstate",e.popStateHandler),window.removeEventListener("keydown",e.keydownHandler),e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null),e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null),ca(e),ua(e),ha(e),pg(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function On(e,t){if(!e||!t)return;const n=e.find(o=>o.key===t);if(n)return n;const s=t.split(":"),i=s[s.length-1];if(i&&i.length>=4){const o=e.find(l=>l.key.includes(i));if(o)return o}const a=t.replace(/^webchat:/,"");if(a!==t){const o=e.find(l=>l.key.endsWith(a)||l.key.includes(a));if(o)return o}}function Wg(e,t){if(!t||t.length===0)return;let n=!1;const s=e.settings.openTabs.map(i=>{const a=On(t,i);return a&&a.key!==i?(n=!0,a.key):i});if(n){const i={};for(const[l,c]of Object.entries(e.settings.tabLastViewed)){const p=On(t,l)?.key??l;i[p]=c}const o=On(t,e.sessionKey)?.key??e.sessionKey;e.applySettings({...e.settings,openTabs:s,sessionKey:o,lastActiveSessionKey:o,tabLastViewed:i}),e.sessionKey!==o&&(e.sessionKey=o)}}function Hg(e,t){if(t.has("sessionsResult")&&e.sessionsResult?.sessions&&Wg(e,e.sessionsResult.sessions),t.has("sessionPickerOpen")&&(e.sessionPickerOpen?setTimeout(()=>{e.sessionPickerOpen&&(e.sessionPickerClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-picker-container"),a=s.closest(".session-picker-dropdown");!i&&!a&&(e.sessionPickerOpen=!1)},document.addEventListener("click",e.sessionPickerClickOutsideHandler,!0))},0):e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null)),t.has("sessionSearchOpen")&&(e.sessionSearchOpen?setTimeout(()=>{e.sessionSearchOpen&&(e.sessionSearchClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-search-container"),a=s.closest(".session-search-dropdown");!i&&!a&&(e.sessionSearchOpen=!1)},document.addEventListener("click",e.sessionSearchClickOutsideHandler,!0))},0):e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null)),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab==="chat"&&!e.chatLoading&&de(e),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab!=="chat"&&gs(e),e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("tab"))){const n=t.has("tab"),s=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;let i=!1;if(t.has("chatMessages")){const a=e.chatMessages;a[a.length-1]?.role==="user"&&(i=!0)}t.has("chatStream")&&(i=!1),Rt(e,n||s||i||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&ul(e,t.has("tab")||t.has("logsAutoFollow"))}class Di extends Aa{constructor(t){if(super(t),this.it=f,t.type!==$a.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===f||t==null)return this._t=void 0,this.it=t;if(t===He)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const n=[t];return n.raw=n,this._t={_$litType$:this.constructor.resultType,strings:n,values:[]}}}Di.directiveName="unsafeHTML",Di.resultType=1;const je=Sa(Di);function Ae(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function Sc(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(Ae(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function ys(e){return e.filter(t=>typeof t=="string").join(".")}function pe(e,t){const n=ys(e),s=t[n];if(s)return s;const i=n.split(".");for(const[a,o]of Object.entries(t)){if(!a.includes("*"))continue;const l=a.split(".");if(l.length!==i.length)continue;let c=!0;for(let u=0;u<i.length;u+=1)if(l[u]!=="*"&&l[u]!==i[u]){c=!1;break}if(c)return o}}function Re(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function zg(e){const t=ys(e).toLowerCase();return t.includes("token")||t.includes("password")||t.includes("secret")||t.includes("apikey")||t.endsWith("key")}function Et(e){return typeof e=="string"?e:e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}const jg=new Set(["title","description","default","nullable"]);function Vg(e){return Object.keys(e??{}).filter(n=>!jg.has(n)).length===0}function Gg(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const fn={chevronDown:r`
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
  `};function Me(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:l}=e,c=e.showLabel??!0,u=Ae(t),p=pe(s,i),h=p?.label??t.title??Re(String(s.at(-1))),g=p?.help??t.description,d=ys(s);if(a.has(d))return r`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${h}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const k=(t.anyOf??t.oneOf??[]).filter(E=>!(E.type==="null"||Array.isArray(E.type)&&E.type.includes("null")));if(k.length===1)return Me({...e,schema:k[0]});const $=E=>{if(E.const!==void 0)return E.const;if(E.enum&&E.enum.length===1)return E.enum[0]},S=k.map($),x=S.every(E=>E!==void 0);if(x&&S.length>0&&S.length<=5){const E=n??t.default;return r`
        <div class="cfg-field">
          ${c?r`<label class="cfg-field__label">${h}</label>`:f}
          ${g?r`<div class="cfg-field__help">${g}</div>`:f}
          <div class="cfg-segmented">
            ${S.map((P,R)=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${P===E||Et(P)===Et(E)?"active":""}"
                ?disabled=${o}
                @click=${()=>l(s,P)}
              >
                ${Et(P)}
              </button>
            `)}
          </div>
        </div>
      `}if(x&&S.length>5)return rr({...e,options:S,value:n??t.default});const L=new Set(k.map(E=>Ae(E)).filter(Boolean)),C=new Set([...L].map(E=>E==="integer"?"number":E));if([...C].every(E=>["string","number","boolean"].includes(E))){const E=C.has("string"),P=C.has("number");if(C.has("boolean")&&C.size===1)return Me({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(E||P)return or({...e,inputType:P&&!E?"number":"text"})}}if(t.enum){const m=t.enum;if(m.length<=5){const k=n??t.default;return r`
        <div class="cfg-field">
          ${c?r`<label class="cfg-field__label">${h}</label>`:f}
          ${g?r`<div class="cfg-field__help">${g}</div>`:f}
          <div class="cfg-segmented">
            ${m.map($=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${$===k||String($)===String(k)?"active":""}"
                ?disabled=${o}
                @click=${()=>l(s,$)}
              >
                ${String($)}
              </button>
            `)}
          </div>
        </div>
      `}return rr({...e,options:m,value:n??t.default})}if(u==="object")return Yg(e);if(u==="array")return Qg(e);if(u==="boolean"){const m=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return r`
      <label class="cfg-toggle-row ${o?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${h}</span>
          ${g?r`<span class="cfg-toggle-row__help">${g}</span>`:f}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${m}
            ?disabled=${o}
            @change=${k=>l(s,k.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return u==="number"||u==="integer"?qg(e):u==="string"?or({...e,inputType:"text"}):r`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${h}</div>
      <div class="cfg-field__error">Unsupported type: ${u}. Use Raw mode.</div>
    </div>
  `}function or(e){const{schema:t,value:n,path:s,hints:i,disabled:a,onPatch:o,inputType:l}=e,c=e.showLabel??!0,u=pe(s,i),p=u?.label??t.title??Re(String(s.at(-1))),h=u?.help??t.description,g=u?.sensitive??zg(s),d=u?.placeholder??(g?"••••":t.default!==void 0?`Default: ${Et(t.default)}`:""),m=n??"";return r`
    <div class="cfg-field">
      ${c?r`<label class="cfg-field__label">${p}</label>`:f}
      ${h?r`<div class="cfg-field__help">${h}</div>`:f}
      <div class="cfg-input-wrap">
        <input
          type=${g?"password":l}
          class="cfg-input"
          placeholder=${d}
          .value=${Et(m)}
          ?disabled=${a}
          @input=${k=>{const $=k.target.value;if(l==="number"){if($.trim()===""){o(s,void 0);return}const S=Number($);o(s,Number.isNaN(S)?$:S);return}o(s,$)}}
          @change=${k=>{if(l==="number")return;const $=k.target.value;o(s,$.trim())}}
        />
        ${t.default!==void 0?r`
          <button
            type="button"
            class="cfg-input__reset"
            title="Reset to default"
            ?disabled=${a}
            @click=${()=>o(s,t.default)}
          >↺</button>
        `:f}
      </div>
    </div>
  `}function qg(e){const{schema:t,value:n,path:s,hints:i,disabled:a,onPatch:o}=e,l=e.showLabel??!0,c=pe(s,i),u=c?.label??t.title??Re(String(s.at(-1))),p=c?.help??t.description,h=n??t.default??"",g=typeof h=="number"?h:0;return r`
    <div class="cfg-field">
      ${l?r`<label class="cfg-field__label">${u}</label>`:f}
      ${p?r`<div class="cfg-field__help">${p}</div>`:f}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(s,g-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${Et(h)}
          ?disabled=${a}
          @input=${d=>{const m=d.target.value,k=m===""?void 0:Number(m);o(s,k)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(s,g+1)}
        >+</button>
      </div>
    </div>
  `}function rr(e){const{schema:t,value:n,path:s,hints:i,disabled:a,options:o,onPatch:l}=e,c=e.showLabel??!0,u=pe(s,i),p=u?.label??t.title??Re(String(s.at(-1))),h=u?.help??t.description,g=n??t.default,d=o.findIndex(k=>k===g||String(k)===String(g)),m="__unset__";return r`
    <div class="cfg-field">
      ${c?r`<label class="cfg-field__label">${p}</label>`:f}
      ${h?r`<div class="cfg-field__help">${h}</div>`:f}
      <select
        class="cfg-select"
        ?disabled=${a}
        .value=${d>=0?String(d):m}
        @change=${k=>{const $=k.target.value;l(s,$===m?void 0:o[Number($)])}}
      >
        <option value=${m}>Select...</option>
        ${o.map((k,$)=>r`
          <option value=${String($)}>${String(k)}</option>
        `)}
      </select>
    </div>
  `}function Yg(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:l}=e;e.showLabel;const c=pe(s,i),u=c?.label??t.title??Re(String(s.at(-1))),p=c?.help??t.description,h=n??t.default,g=h&&typeof h=="object"&&!Array.isArray(h)?h:{},d=t.properties??{},k=Object.entries(d).toSorted((L,C)=>{const E=pe([...s,L[0]],i)?.order??0,P=pe([...s,C[0]],i)?.order??0;return E!==P?E-P:L[0].localeCompare(C[0])}),$=new Set(Object.keys(d)),S=t.additionalProperties,x=!!S&&typeof S=="object";return s.length===1?r`
      <div class="cfg-fields">
        ${k.map(([L,C])=>Me({schema:C,value:g[L],path:[...s,L],hints:i,unsupported:a,disabled:o,onPatch:l}))}
        ${x?lr({schema:S,value:g,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:$,onPatch:l}):f}
      </div>
    `:r`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${u}</span>
        <span class="cfg-object__chevron">${fn.chevronDown}</span>
      </summary>
      ${p?r`<div class="cfg-object__help">${p}</div>`:f}
      <div class="cfg-object__content">
        ${k.map(([L,C])=>Me({schema:C,value:g[L],path:[...s,L],hints:i,unsupported:a,disabled:o,onPatch:l}))}
        ${x?lr({schema:S,value:g,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:$,onPatch:l}):f}
      </div>
    </details>
  `}function Qg(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:l}=e,c=e.showLabel??!0,u=pe(s,i),p=u?.label??t.title??Re(String(s.at(-1))),h=u?.help??t.description,g=Array.isArray(t.items)?t.items[0]:t.items;if(!g)return r`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${p}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const d=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return r`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${c?r`<span class="cfg-array__label">${p}</span>`:f}
        <span class="cfg-array__count">${d.length} item${d.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${o}
          @click=${()=>{const m=[...d,Sc(g)];l(s,m)}}
        >
          <span class="cfg-array__add-icon">${fn.plus}</span>
          Add
        </button>
      </div>
      ${h?r`<div class="cfg-array__help">${h}</div>`:f}

      ${d.length===0?r`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:r`
        <div class="cfg-array__items">
          ${d.map((m,k)=>r`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${k+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${o}
                  @click=${()=>{const $=[...d];$.splice(k,1),l(s,$)}}
                >
                  ${fn.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${Me({schema:g,value:m,path:[...s,k],hints:i,unsupported:a,disabled:o,showLabel:!1,onPatch:l})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function lr(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:l,onPatch:c}=e,u=Vg(t),p=Object.entries(n??{}).filter(([h])=>!l.has(h));return r`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${o}
          @click=${()=>{const h={...n};let g=1,d=`custom-${g}`;for(;d in h;)g+=1,d=`custom-${g}`;h[d]=u?{}:Sc(t),c(s,h)}}
        >
          <span class="cfg-map__add-icon">${fn.plus}</span>
          Add Entry
        </button>
      </div>

      ${p.length===0?r`
              <div class="cfg-map__empty">No custom entries.</div>
            `:r`
        <div class="cfg-map__items">
          ${p.map(([h,g])=>{const d=[...s,h],m=Gg(g);return r`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${h}
                    ?disabled=${o}
                    @change=${k=>{const $=k.target.value.trim();if(!$||$===h)return;const S={...n};$ in S||(S[$]=S[h],delete S[h],c(s,S))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${u?r`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${m}
                          ?disabled=${o}
                          @change=${k=>{const $=k.target,S=$.value.trim();if(!S){c(d,void 0);return}try{c(d,JSON.parse(S))}catch{$.value=m}}}
                        ></textarea>
                      `:Me({schema:t,value:g,path:d,hints:i,unsupported:a,disabled:o,showLabel:!1,onPatch:c})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  ?disabled=${o}
                  @click=${()=>{const k={...n};delete k[h],c(s,k)}}
                >
                  ${fn.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const cr={env:r`
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
  `},_a={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"},user:{label:"User Profile",description:"Your display name and avatar"}};function dr(e){return cr[e]??cr.default}function Jg(e,t,n){if(!n)return!0;const s=n.toLowerCase(),i=_a[e];return e.toLowerCase().includes(s)||i&&(i.label.toLowerCase().includes(s)||i.description.toLowerCase().includes(s))?!0:en(t,s)}function en(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,i]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||en(i,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const i of s)if(i&&en(i,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&en(e.additionalProperties,t))return!0;const n=e.anyOf??e.oneOf??e.allOf;if(n){for(const s of n)if(s&&en(s,t))return!0}return!1}function Xg(e){if(!e.schema)return r`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,n=e.value??{};if(Ae(t)!=="object"||!t.properties)return r`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),i=t.properties,a=e.searchQuery??"",o=e.activeSection,l=e.activeSubsection??null,u=Object.entries(i).toSorted((h,g)=>{const d=pe([h[0]],e.uiHints)?.order??50,m=pe([g[0]],e.uiHints)?.order??50;return d!==m?d-m:h[0].localeCompare(g[0])}).filter(([h,g])=>!(o&&h!==o||a&&!Jg(h,g,a)));let p=null;if(o&&l&&u.length===1){const h=u[0]?.[1];h&&Ae(h)==="object"&&h.properties&&h.properties[l]&&(p={sectionKey:o,subsectionKey:l,schema:h.properties[l]})}return u.length===0?r`
      <div class="config-empty">
        <div class="config-empty__icon">${W.search}</div>
        <div class="config-empty__text">
          ${a?`No settings match "${a}"`:"No settings in this section"}
        </div>
      </div>
    `:r`
    <div class="config-form config-form--modern">
      ${p?(()=>{const{sectionKey:h,subsectionKey:g,schema:d}=p,m=pe([h,g],e.uiHints),k=m?.label??d.title??Re(g),$=m?.help??d.description??"",S=n[h],x=S&&typeof S=="object"?S[g]:void 0,L=`config-section-${h}-${g}`;return r`
              <section class="config-section-card" id=${L}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${dr(h)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${k}</h3>
                    ${$?r`<p class="config-section-card__desc">${$}</p>`:f}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${Me({schema:d,value:x,path:[h,g],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():u.map(([h,g])=>{const d=_a[h]??{label:h.charAt(0).toUpperCase()+h.slice(1),description:g.description??""};return r`
              <section class="config-section-card" id="config-section-${h}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${dr(h)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${d.label}</h3>
                    ${d.description?r`<p class="config-section-card__desc">${d.description}</p>`:f}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${Me({schema:g,value:n[h],path:[h],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const Zg=new Set(["title","description","default","nullable"]);function em(e){return Object.keys(e??{}).filter(n=>!Zg.has(n)).length===0}function Ac(e){const t=e.filter(i=>i!=null),n=t.length!==e.length,s=[];for(const i of t)s.some(a=>Object.is(a,i))||s.push(i);return{enumValues:s,nullable:n}}function xc(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:an(e,[])}function an(e,t){const n=new Set,s={...e},i=ys(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const l=tm(e,t);return l||{schema:e,unsupportedPaths:[i]}}const a=Array.isArray(e.type)&&e.type.includes("null"),o=Ae(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=o??e.type,s.nullable=a||e.nullable,s.enum){const{enumValues:l,nullable:c}=Ac(s.enum);s.enum=l,c&&(s.nullable=!0),l.length===0&&n.add(i)}if(o==="object"){const l=e.properties??{},c={};for(const[u,p]of Object.entries(l)){const h=an(p,[...t,u]);h.schema&&(c[u]=h.schema);for(const g of h.unsupportedPaths)n.add(g)}if(s.properties=c,e.additionalProperties===!0)n.add(i);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!em(e.additionalProperties)){const u=an(e.additionalProperties,[...t,"*"]);s.additionalProperties=u.schema??e.additionalProperties,u.unsupportedPaths.length>0&&n.add(i)}}else if(o==="array"){const l=Array.isArray(e.items)?e.items[0]:e.items;if(!l)n.add(i);else{const c=an(l,[...t,"*"]);s.items=c.schema??l,c.unsupportedPaths.length>0&&n.add(i)}}else o!=="string"&&o!=="number"&&o!=="integer"&&o!=="boolean"&&!s.enum&&n.add(i);return{schema:s,unsupportedPaths:Array.from(n)}}function tm(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],i=[];let a=!1;for(const l of n){if(!l||typeof l!="object")return null;if(Array.isArray(l.enum)){const{enumValues:c,nullable:u}=Ac(l.enum);s.push(...c),u&&(a=!0);continue}if("const"in l){if(l.const==null){a=!0;continue}s.push(l.const);continue}if(Ae(l)==="null"){a=!0;continue}i.push(l)}if(s.length>0&&i.length===0){const l=[];for(const c of s)l.some(u=>Object.is(u,c))||l.push(c);return{schema:{...e,enum:l,nullable:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(i.length===1){const l=an(i[0],t);return l.schema&&(l.schema.nullable=a||l.schema.nullable),l}const o=new Set(["string","number","integer","boolean"]);return i.length>0&&s.length===0&&i.every(l=>l.type&&o.has(String(l.type)))?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}function nm(e,t){let n=e;for(const s of t){if(!n)return null;const i=Ae(n);if(i==="object"){const a=n.properties??{};if(typeof s=="string"&&a[s]){n=a[s];continue}const o=n.additionalProperties;if(typeof s=="string"&&o&&typeof o=="object"){n=o;continue}return null}if(i==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function sm(e,t){const s=(e.channels??{})[t],i=e[t];return(s&&typeof s=="object"?s:null)??(i&&typeof i=="object"?i:null)??{}}function im(e){const t=xc(e.schema),n=t.schema;if(!n)return r`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=nm(n,["channels",e.channelId]);if(!s)return r`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const i=e.configValue??{},a=sm(i,e.channelId);return r`
    <div class="config-form">
      ${Me({schema:s,value:a,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
  `}function Pe(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return r`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?r`
              <div class="muted">Loading config schema…</div>
            `:im({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
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
  `}function am(e){const{props:t,discord:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?U(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?U(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:f}

      ${Pe({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function om(e){const{props:t,googleChat:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?U(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?U(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:f}

      ${Pe({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function rm(e){const{props:t,imessage:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?U(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?U(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:f}

      ${Pe({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function ur(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function lm(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:i,profileFormState:a,profileFormCallbacks:o,onEditProfile:l}=e,c=s[0],u=n?.configured??c?.configured??!1,p=n?.running??c?.running??!1,h=n?.publicKey??c?.publicKey,g=n?.lastStartAt??c?.lastStartAt??null,d=n?.lastError??c?.lastError??null,m=s.length>1,k=a!=null,$=x=>{const L=x.publicKey,C=x.profile,E=C?.displayName??C?.name??x.name??x.accountId;return r`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${E}</div>
          <div class="account-card-id">${x.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${x.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${x.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${L??""}">${ur(L)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${x.lastInboundAt?U(x.lastInboundAt):"n/a"}</span>
          </div>
          ${x.lastError?r`
                <div class="account-card-error">${x.lastError}</div>
              `:f}
        </div>
      </div>
    `},S=()=>{if(k&&o)return Nd({state:a,callbacks:o,accountId:s[0]?.accountId??"default"});const x=c?.profile??n?.profile,{name:L,displayName:C,about:E,picture:P,nip05:R}=x??{},oe=L||C||E||P||R;return r`
      <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 500;">Profile</div>
          ${u?r`
                <button
                  class="btn btn-sm"
                  @click=${l}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:f}
        </div>
        ${oe?r`
              <div class="status-list">
                ${P?r`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${P}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${M=>{M.target.style.display="none"}}
                        />
                      </div>
                    `:f}
                ${L?r`<div><span class="label">Name</span><span>${L}</span></div>`:f}
                ${C?r`<div><span class="label">Display Name</span><span>${C}</span></div>`:f}
                ${E?r`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${E}</span></div>`:f}
                ${R?r`<div><span class="label">NIP-05</span><span>${R}</span></div>`:f}
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

      ${m?r`
            <div class="account-card-list">
              ${s.map(x=>$(x))}
            </div>
          `:r`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${u?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${p?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Public Key</span>
                <span class="monospace" title="${h??""}"
                  >${ur(h)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${g?U(g):"n/a"}</span>
              </div>
            </div>
          `}

      ${d?r`<div class="callout danger" style="margin-top: 12px;">${d}</div>`:f}

      ${S()}

      ${Pe({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function cm(e){if(!e&&e!==0)return"n/a";const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);return n<60?`${n}m`:`${Math.round(n/60)}h`}function dm(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const i=s[e],a=typeof i?.configured=="boolean"&&i.configured,o=typeof i?.running=="boolean"&&i.running,l=typeof i?.connected=="boolean"&&i.connected,u=(n.channelAccounts?.[e]??[]).some(p=>p.configured||p.running||p.connected);return a||o||l||u}function um(e,t){return t?.[e]?.length??0}function _c(e,t){const n=um(e,t);return n<2?f:r`<div class="account-count">Accounts (${n})</div>`}function pm(e){const{props:t,signal:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?U(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?U(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:f}

      ${Pe({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function hm(e){const{props:t,slack:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?U(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?U(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:f}

      ${Pe({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function fm(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:i}=e,a=s.length>1,o=l=>{const u=l.probe?.bot?.username,p=l.name||l.accountId;return r`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${u?`@${u}`:p}
          </div>
          <div class="account-card-id">${l.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${l.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${l.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${l.lastInboundAt?U(l.lastInboundAt):"n/a"}</span>
          </div>
          ${l.lastError?r`
                <div class="account-card-error">
                  ${l.lastError}
                </div>
              `:f}
        </div>
      </div>
    `};return r`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${i}

      ${a?r`
            <div class="account-card-list">
              ${s.map(l=>o(l))}
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
                <span>${n?.lastStartAt?U(n.lastStartAt):"n/a"}</span>
              </div>
              <div>
                <span class="label">Last probe</span>
                <span>${n?.lastProbeAt?U(n.lastProbeAt):"n/a"}</span>
              </div>
            </div>
          `}

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:f}

      ${Pe({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function gm(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return r`
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
            ${n?.lastConnectedAt?U(n.lastConnectedAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last message</span>
          <span>
            ${n?.lastMessageAt?U(n.lastMessageAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Auth age</span>
          <span>
            ${n?.authAgeMs!=null?cm(n.authAgeMs):"n/a"}
          </span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:f}

      ${t.whatsappMessage?r`<div class="callout" style="margin-top: 12px;">
            ${t.whatsappMessage}
          </div>`:f}

      ${t.whatsappQrDataUrl?r`<div class="qr-wrap">
            <img src=${t.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:f}

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

      ${Pe({channelId:"whatsapp",props:t})}
    </div>
  `}function mm(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,i=t?.discord??null;t?.googlechat;const a=t?.slack??null,o=t?.signal??null,l=t?.imessage??null,c=t?.nostr??null,p=vm(e.snapshot).map((h,g)=>({key:h,enabled:dm(h,e),order:g})).toSorted((h,g)=>h.enabled!==g.enabled?h.enabled?-1:1:h.order-g.order);return r`
    <section class="grid grid-cols-2">
      ${p.map(h=>ym(h.key,e,{whatsapp:n,telegram:s,discord:i,slack:a,signal:o,imessage:l,nostr:c,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?U(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:f}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function vm(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function ym(e,t,n){const s=_c(e,n.channelAccounts);switch(e){case"whatsapp":return gm({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return fm({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return am({props:t,discord:n.discord,accountCountLabel:s});case"googlechat":return om({props:t,accountCountLabel:s});case"slack":return hm({props:t,slack:n.slack,accountCountLabel:s});case"signal":return pm({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return rm({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const i=n.channelAccounts?.nostr??[],a=i[0],o=a?.accountId??"default",l=a?.profile??null,c=t.nostrProfileAccountId===o?t.nostrProfileFormState:null,u=c?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return lm({props:t,nostr:n.nostr,nostrAccounts:i,accountCountLabel:s,profileFormState:c,profileFormCallbacks:u,onEditProfile:()=>t.onNostrProfileEdit(o,l)})}default:return bm(e,t,n.channelAccounts??{})}}function bm(e,t,n){const s=km(t.snapshot,e),i=t.snapshot?.channels?.[e],a=typeof i?.configured=="boolean"?i.configured:void 0,o=typeof i?.running=="boolean"?i.running:void 0,l=typeof i?.connected=="boolean"?i.connected:void 0,c=typeof i?.lastError=="string"?i.lastError:void 0,u=n[e]??[],p=_c(e,n);return r`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${p}

      ${u.length>0?r`
            <div class="account-card-list">
              ${u.map(h=>xm(h))}
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
                <span>${l==null?"n/a":l?"Yes":"No"}</span>
              </div>
            </div>
          `}

      ${c?r`<div class="callout danger" style="margin-top: 12px;">
            ${c}
          </div>`:f}

      ${Pe({channelId:e,props:t})}
    </div>
  `}function wm(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function km(e,t){return wm(e)[t]?.label??e?.channelLabels?.[t]??t}const $m=600*1e3;function Tc(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<$m:!1}function Sm(e){return e.running?"Yes":Tc(e)?"Active":"No"}function Am(e){return e.connected===!0?"Yes":e.connected===!1?"No":Tc(e)?"Active":"n/a"}function xm(e){const t=Sm(e),n=Am(e);return r`
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
          <span>${e.lastInboundAt?U(e.lastInboundAt):"n/a"}</span>
        </div>
        ${e.lastError?r`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:f}
      </div>
    </div>
  `}const on=(e,t)=>{const n=e._$AN;if(n===void 0)return!1;for(const s of n)s._$AO?.(t,!1),on(s,t);return!0},Zn=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Cc=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),Cm(t)}};function _m(e){this._$AN!==void 0?(Zn(this),this._$AM=e,Cc(this)):this._$AM=e}function Tm(e,t=!1,n=0){const s=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(s))for(let a=n;a<s.length;a++)on(s[a],!1),Zn(s[a]);else s!=null&&(on(s,!1),Zn(s));else on(this,e)}const Cm=e=>{e.type==$a.CHILD&&(e._$AP??=Tm,e._$AQ??=_m)};class Lm extends Aa{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,s){super._$AT(t,n,s),Cc(this),this.isConnected=t._$AU}_$AO(t,n=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),n&&(on(this,t),Zn(this))}setValue(t){if(Cg(this._$Ct))this._$Ct._$AI(t,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}const si=new WeakMap,Ta=Sa(class extends Lm{render(e){return f}update(e,[t]){const n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),f}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let n=si.get(t);n===void 0&&(n=new WeakMap,si.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?si.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),Em=1500,Im=2e3,Lc="Copy as markdown",Mm="Copied",Rm="Copy failed";async function Pm(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function Mn(e,t){e.title=t,e.setAttribute("aria-label",t)}function Dm(e){const t=e.label??Lc;return r`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(s?.querySelector(".chat-copy-btn__icon"),!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const i=await Pm(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!i){s.dataset.error="1",Mn(s,Rm),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,Mn(s,t))},Im);return}s.dataset.copied="1",Mn(s,Mm),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,Mn(s,t))},Em)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${W.copy}</span>
        <span class="chat-copy-btn__icon-check">${W.check}</span>
      </span>
    </button>
  `}function Nm(e){return Dm({text:()=>e,label:Lc})}function Ec(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",i=t.content,a=Array.isArray(i)?i:null,o=Array.isArray(a)&&a.some(h=>{const g=h,d=(typeof g.type=="string"?g.type:"").toLowerCase();return d==="toolresult"||d==="tool_result"}),l=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||o||l)&&(n="toolResult");let c=[];typeof t.content=="string"?c=[{type:"text",text:t.content}]:Array.isArray(t.content)?c=t.content.map(h=>({type:h.type||"text",text:h.text,name:h.name,args:h.args||h.arguments})):typeof t.text=="string"&&(c=[{type:"text",text:t.text}]);const u=typeof t.timestamp=="number"?t.timestamp:Date.now(),p=typeof t.id=="string"?t.id:void 0;return{role:n,content:c,timestamp:u,id:p}}function Ca(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function Ic(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}const Om={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},Bm={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},Fm={fallback:Om,tools:Bm},Mc=Fm,pr=Mc.fallback??{icon:"puzzle"},Um=Mc.tools??{};function Km(e){return(e??"tool").trim()}function Wm(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function Hm(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function Rc(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const n=t.split(/\r?\n/)[0]?.trim()??"";return n?n.length>160?`${n.slice(0,157)}…`:n:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(s=>Rc(s)).filter(s=>!!s);if(t.length===0)return;const n=t.slice(0,3).join(", ");return t.length>3?`${n}…`:n}}}function zm(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function jm(e,t){for(const n of t){const s=zm(e,n),i=Rc(s);if(i)return i}}function Vm(e){if(!e||typeof e!="object")return;const t=e,n=typeof t.path=="string"?t.path:void 0;if(!n)return;const s=typeof t.offset=="number"?t.offset:void 0,i=typeof t.limit=="number"?t.limit:void 0;return s!==void 0&&i!==void 0?`${n}:${s}-${s+i}`:n}function Gm(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function qm(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function Ym(e){const t=Km(e.name),n=t.toLowerCase(),s=Um[n],i=s?.icon??pr.icon??"puzzle",a=s?.title??Wm(t),o=s?.label??t,l=e.args&&typeof e.args=="object"?e.args.action:void 0,c=typeof l=="string"?l.trim():void 0,u=qm(s,c),p=Hm(u?.label??c);let h;n==="read"&&(h=Vm(e.args)),!h&&(n==="write"||n==="edit"||n==="attach")&&(h=Gm(e.args));const g=u?.detailKeys??s?.detailKeys??pr.detailKeys??[];return!h&&g.length>0&&(h=jm(e.args,g)),!h&&e.meta&&(h=e.meta),h&&(h=Jm(h)),{name:t,icon:i,title:a,label:o,verb:p,detail:h}}function Qm(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function Jm(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const Xm=80,Zm=2,hr=100,ev=3;function tv(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function nv(e){const t=e.split(`
`),n=t.slice(0,Zm),s=n.join(`
`);return s.length>hr?s.slice(0,hr)+"…":n.length<t.length?s+"…":s}function sv(e){const t=e,n=iv(t.content),s=[];for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(a)||typeof i.name=="string"&&i.arguments!=null)&&s.push({kind:"call",name:i.name??"tool",args:av(i.arguments??i.args)})}for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();if(a!=="toolresult"&&a!=="tool_result")continue;const o=ov(i);if(gr(o))continue;const l=typeof i.name=="string"?i.name:"tool";s.push({kind:"result",name:l,text:o})}if(Ic(e)&&!s.some(i=>i.kind==="result")){const i=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",a=vl(e)??void 0;gr(a)||s.push({kind:"result",name:i,text:a})}return s}function fr(e,t){const n=Ym({name:e.name,args:e.args}),s=Qm(n),i=!!e.text?.trim(),a=!!t,o=a?()=>{if(i){t(tv(e.text));return}const d=`## ${n.label}

${s?`**Command:** \`${s}\`

`:""}*No output — tool completed successfully.*`;t(d)}:void 0,l=e.text?e.text.split(`
`).length:0,c=i&&(e.text?.length??0)<=Xm,u=i&&!c&&l>ev,p=i&&!u,h=!i,g=e.kind==="call"?"chat-tool-card--call":"chat-tool-card--result";return r`
    <div
      class="chat-tool-card ${g} ${a?"chat-tool-card--clickable":""}"
      @click=${o}
      role=${a?"button":f}
      tabindex=${a?"0":f}
      @keydown=${a?d=>{d.key!=="Enter"&&d.key!==" "||(d.preventDefault(),o?.())}:f}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${W[n.icon]}</span>
          <span>${n.label}</span>
        </div>
        ${a?r`<span class="chat-tool-card__action">${i?"View":""} ${W.check}</span>`:f}
        ${h&&!a?r`<span class="chat-tool-card__status">${W.check}</span>`:f}
      </div>
      ${s?r`<div class="chat-tool-card__detail">${s}</div>`:f}
      ${h?r`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:f}
      ${u?r`<details class="chat-tool-card__expandable" @click=${d=>d.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${nv(e.text)}</summary>
            <div class="chat-tool-card__full-output mono">${e.text}</div>
          </details>`:f}
      ${p?r`<div class="chat-tool-card__inline mono">${e.text}</div>`:f}
    </div>
  `}function iv(e){return Array.isArray(e)?e.filter(Boolean):[]}function av(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function ov(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function gr(e){if(!e)return!1;const t=e.toLowerCase();return t.includes("process exited")?!1:t.includes("(no new output)")&&t.includes("still running")}const mr={exec:["Executing","Running","Conjuring","Manifesting","Brewing"],read:["Reading","Perusing","Absorbing","Scanning","Devouring"],write:["Writing","Scribbling","Crafting","Inscribing","Authoring"],edit:["Editing","Refining","Polishing","Tweaking","Sculpting"],browser:["Browsing","Surfing","Exploring","Navigating","Spelunking"],web_search:["Searching","Hunting","Investigating","Sleuthing","Scouring"],web_fetch:["Fetching","Grabbing","Retrieving","Summoning","Acquiring"],memory_search:["Remembering","Recalling","Pondering","Reflecting"],image:["Analyzing","Examining","Scrutinizing","Inspecting","Beholding"],default:["Working on","Processing","Handling","Tinkering with","Wrangling"]};function Pc(e){const t=e.toLowerCase().replace(/[^a-z_]/g,""),n=mr[t]??mr.default,s=Math.floor(Date.now()/2e3)%n.length;return n[s]}const vr={pdf:"📕",doc:"📘",docx:"📘",txt:"📄",rtf:"📄",xls:"📗",xlsx:"📗",csv:"📊",ppt:"📙",pptx:"📙",jpg:"🖼️",jpeg:"🖼️",png:"🖼️",gif:"🖼️",webp:"🖼️",svg:"🖼️",mp3:"🎵",wav:"🎵",m4a:"🎵",mp4:"🎬",mov:"🎬",avi:"🎬",zip:"📦",rar:"📦","7z":"📦",tar:"📦",gz:"📦",js:"📜",ts:"📜",py:"📜",json:"📜",html:"📜",css:"📜",md:"📜",default:"📎"};function rv(e){const t=e.split(".").pop()?.toLowerCase()||"";return vr[t]??vr.default}function lv(e,t){const n=t.split(".").pop()?.toLowerCase()||"";return{pdf:"PDF Document",doc:"Word Document",docx:"Word Document",xls:"Excel Spreadsheet",xlsx:"Excel Spreadsheet",csv:"CSV File",ppt:"PowerPoint",pptx:"PowerPoint",txt:"Text File",md:"Markdown",json:"JSON File",zip:"ZIP Archive",png:"PNG Image",jpg:"JPEG Image",jpeg:"JPEG Image",gif:"GIF Image",mp3:"Audio File",mp4:"Video File"}[n]||e.split("/")[1]?.toUpperCase()||"File"}function cv(e){const t=e.match(/\[Files uploaded:\s*([^\]]+)\]/);if(!t)return null;const n=t[1],s=[],i=/([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;let a;for(;(a=i.exec(n))!==null;)s.push({fileName:a[1].trim(),fileId:a[2].trim(),size:a[3].trim(),mimeType:a[4].trim()});return s.length>0?s:null}function dv(e){return r`
    <div class="chat-file-uploads">
      ${e.map(t=>r`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${rv(t.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${t.fileName}">${t.fileName}</span>
            <span class="chat-file-upload-card__meta">${t.size} • ${lv(t.mimeType,t.fileName)}</span>
          </div>
        </div>
      `)}
    </div>
  `}function uv(e){return e.replace(/\[Files uploaded:[^\]]+\]\s*/g,"").trim()}function pv(e){if(!e)return e;if(e.startsWith("System:")||e.startsWith("GatewayRestart:")){const a=e.indexOf(`

`);return a!==-1?e.slice(a+2).trim():""}let i=e.split(`
`).filter(a=>{const o=a.trim();return!o.startsWith("System:")&&!o.startsWith("GatewayRestart:")}).join(`
`);for(;i.startsWith(`
`);)i=i.slice(1);return i.trim()}function hv(e){return typeof e!="number"||!Number.isFinite(e)||e<=0?null:e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${Math.round(e/1024)} KB`:`${Math.round(e)} B`}function fv(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="image"){const l=o.source;if(l?.type==="base64"&&typeof l.data=="string"){const c=l.data,u=l.media_type||"image/png",p=c.startsWith("data:")?c:`data:${u};base64,${c}`;s.push({url:p})}else if(typeof o.data=="string"&&typeof o.mimeType=="string"){const c=o.data.startsWith("data:")?o.data:`data:${o.mimeType};base64,${o.data}`;s.push({url:c})}else typeof o.url=="string"?s.push({url:o.url}):o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}else if(o.type==="image_url"){const l=o.image_url;typeof l?.url=="string"&&s.push({url:l.url})}else o.type==="attachment"&&typeof o.content=="string"&&(o.mimeType||"").startsWith("image/")&&s.push({url:o.content,alt:o.fileName||void 0});if(o.type==="text"&&typeof o.text=="string"){const l=/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,c=o.text.match(l);if(c)for(const u of c)s.push({url:u})}if(Array.isArray(o.content))for(const l of o.content){if(typeof l!="object"||l===null)continue;const c=l;if(c.type==="image"){const u=c.source;if(u?.type==="base64"&&typeof u.data=="string"){const p=u.media_type||"image/png",h=u.data.startsWith("data:")?u.data:`data:${p};base64,${u.data}`;s.push({url:h})}else if(typeof c.data=="string"&&typeof c.mimeType=="string"){const p=c.data.startsWith("data:")?c.data:`data:${c.mimeType};base64,${c.data}`;s.push({url:p})}else c.omitted===!0&&s.push({omitted:!0,bytes:typeof c.bytes=="number"?c.bytes:void 0,mimeType:typeof c.mimeType=="string"?c.mimeType:void 0,alt:typeof c.fileName=="string"?c.fileName:void 0})}}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="image"&&typeof o.content=="string"){const l=o.mimeType||"image/png",c=o.content.startsWith("data:")?o.content:`data:${l};base64,${o.content}`;s.push({url:c,alt:o.fileName||void 0})}else o.type==="image"&&o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}return s}function gv(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="attachment"&&typeof o.content=="string"){const l=o.mimeType||"application/octet-stream";l.startsWith("image/")||s.push({fileName:o.fileName||"file",mimeType:l,content:o.content})}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const o=a;o.type==="file"&&typeof o.content=="string"&&s.push({fileName:o.fileName||"file",mimeType:o.mimeType||"application/octet-stream",content:o.content})}return s}function mv(e,t){return r`
    <div class="chat-group assistant">
      ${La("assistant",{assistantName:e?.name,assistantAvatar:e?.avatar})}
      <div class="chat-group-messages">
        ${t?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${Pc(t.name)}</span>
                    <strong>${t.name}</strong>
                  </span>
                </div>
                ${t.details?r`<span class="chat-working-indicator__details">${t.details}</span>`:f}
              </div>
            `:f}
        <div class="chat-bubble chat-reading-indicator" aria-hidden="true">
          <span class="chat-reading-indicator__dots">
            <span></span><span></span><span></span>
          </span>
        </div>
      </div>
    </div>
  `}function vv(e,t,n,s,i){const a=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),o=s?.name??"Assistant";return r`
    <div class="chat-group assistant">
      ${La("assistant",{assistantName:s?.name,assistantAvatar:s?.avatar})}
      <div class="chat-group-messages">
        ${i?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${Pc(i.name)}</span>
                    <strong>${i.name}</strong>
                  </span>
                </div>
                ${i.details?r`<span class="chat-working-indicator__details">${i.details}</span>`:f}
              </div>
            `:f}
        ${Dc({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${o}</span>
          <span class="chat-group-timestamp">${a}</span>
        </div>
      </div>
    </div>
  `}function yv(e,t){const n=Ca(e.role),s=t.assistantName??"Assistant",i=t.userName??"You",a=n==="user"?i:n==="assistant"?s:n,o=n==="user"?"user":n==="assistant"?"assistant":"other",l=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r`
    <div class="chat-group ${o}">
      ${La(e.role,{assistantName:s,assistantAvatar:t.assistantAvatar??null,userName:i,userAvatar:t.userAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((c,u)=>Dc(c.message,{isStreaming:e.isStreaming&&u===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${a}</span>
          <span class="chat-group-timestamp">${l}</span>
        </div>
      </div>
    </div>
  `}function La(e,t){const n=Ca(e),s=t?.assistantName?.trim()||"Assistant",i=typeof t?.assistantAvatar=="string"?t.assistantAvatar.trim():"",a=t?.userName?.trim()||"You",o=typeof t?.userAvatar=="string"?t.userAvatar.trim():"",l=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return n==="user"?o&&yr(o)?r`<img
        class="chat-avatar ${l}"
        src="${o}"
        alt="${a}"
      />`:o?r`<div class="chat-avatar ${l}">${o}</div>`:r`<div class="chat-avatar ${l}">${a.charAt(0).toUpperCase()||"C"}</div>`:n==="assistant"?i&&yr(i)?r`<img
        class="chat-avatar ${l}"
        src="${i}"
        alt="${s}"
      />`:i?r`<div class="chat-avatar ${l}" style="color: var(--accent);">${i}</div>`:r`<div class="chat-avatar ${l}" style="color: var(--accent);">⚛️</div>`:n==="tool"?r`<div class="chat-avatar ${l}">⚙</div>`:r`<div class="chat-avatar ${l}">?</div>`}function yr(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function br(e){return e.length===0?f:r`
    <div class="chat-message-images">
      ${e.map(t=>{if(t.omitted||!t.url){const n=hv(t.bytes),i=[t.mimeType?t.mimeType.replace("image/","").toUpperCase():null,n,"preview omitted"].filter(Boolean).join(" - ");return r`
            <div
              class="chat-message-image chat-message-image--omitted"
              title=${t.alt??"Attached image"}
              aria-label="Attached image preview omitted"
            >
              <span class="chat-message-image__omitted-label">Image attached</span>
              <span class="chat-message-image__omitted-meta">${i}</span>
            </div>
          `}return r`
          <img
            src=${t.url}
            alt=${t.alt??"Attached image"}
            class="chat-message-image"
            @error=${n=>{const s=n.target;s.style.display="none"}}
            @click=${()=>window.open(t.url,"_blank")}
          />
        `})}
    </div>
  `}function bv(e){return e.length===0?f:r`
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
  `}function Dc(e,t,n){try{return wv(e,t,n)}catch(s){return console.error("[chat] message render error:",s),r`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `}}function wv(e,t,n){const s=e,i=typeof s.role=="string"?s.role:"unknown",a=Ic(e)||i.toLowerCase()==="toolresult"||i.toLowerCase()==="tool_result"||typeof s.toolCallId=="string"||typeof s.tool_call_id=="string",o=sv(e),l=o.length>0,c=fv(e),u=c.length>0,p=gv(e),h=p.length>0,g=vl(e),d=t.showReasoning&&i==="assistant"?Au(e):null,m=i==="user"&&g?cv(g):null,k=m&&m.length>0;let $=g;i==="user"&&$&&($=pv($)),k&&$&&($=uv($));const S=$?.trim()?$:null,x=d?_u(d):null,L=S,C=i==="assistant"&&!!L?.trim(),E=["chat-bubble",C?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");if(l&&a)return r`
      ${u?br(c):f}
      ${o.map(P=>fr(P,n))}
    `;if(!L&&!l&&!u&&!h&&!k&&!x){const P=typeof s.errorMessage=="string"?s.errorMessage:null;if(s.stopReason==="error"&&P){let R=P;const oe=P.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(oe){const M=parseInt(oe[1]).toLocaleString(),B=parseInt(oe[2]).toLocaleString();R=`Context overflow: ${M} tokens exceeded the ${B} token limit. The conversation needs to be compacted.`}else P.includes("prompt is too long")&&(R="Context overflow: The conversation is too long for the model.");return r`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${R}</div>
        </div>
      `}return f}return r`
    <div class="${E}">
      ${C?Nm(L):f}
      ${k?dv(m):f}
      ${br(c)}
      ${bv(p)}
      ${x?r`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${je(ce(x))}</div>
            </details>`:f}
      ${L?r`<div class="chat-text">${je(t.isStreaming?zp(L):ce(L))}</div>`:f}
      ${o.map(P=>fr(P,n))}
    </div>
  `}function kv(e){const t=e,n=typeof t.content=="string"?t.content:"",s=typeof t.keptMessages=="number"?t.keptMessages:null,i=typeof t.timestamp=="number"?new Date(t.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"";return r`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${s!==null?r`<span class="chat-compaction-summary__kept">${s} messages kept</span>`:f}
      </div>
      <div class="chat-compaction-summary__content">
        ${je(ce(n))}
      </div>
      ${i?r`<div class="chat-compaction-summary__timestamp">${i}</div>`:f}
    </div>
  `}function $v(e){return e.isCompactionSummary===!0}const wr=25*1024*1024,kr=50*1024*1024,$r=20;function ii(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:e<1024*1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:`${(e/(1024*1024*1024)).toFixed(1)} GB`}function Ea(e,t=0){const n=[],s=[];let i=t;const a=Array.from(e);for(const o of a){if(n.length>=$r){s.push(`Maximum ${$r} files allowed per upload`);break}if(o.size>wr){s.push(`"${o.name}" is too large (${ii(o.size)}). Max ${ii(wr)}. For larger files, tell Atlas the file path instead.`);continue}if(i+o.size>kr){s.push(`Total upload size exceeds ${ii(kr)} limit`);break}i+=o.size,n.push(o)}return{validFiles:n,errors:s}}const Sv=new Set(["md","markdown","mdx"]),Av=new Set(["htm","html"]),xv=new Set(["avif","bmp","gif","heic","heif","jpeg","jpg","png","svg","svgz","webp"]);function _v(e){const t=e.replaceAll("\\","/").trim();if(!t)return e;const n=t.split("/");return n[n.length-1]||t}function Tv(e){if(!e)return null;const n=e.trim().toLowerCase().split(".").pop()??"";return n?Sv.has(n)?"text/markdown":Av.has(n)?"text/html":xv.has(n)?n==="svg"||n==="svgz"?"image/svg+xml":n==="jpg"?"image/jpeg":`image/${n}`:n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":null:null}function Cv(e){const t=e.mimeType?.split(";")[0]?.trim().toLowerCase()??"";if(t)return t;const n=e.content?.trim()??"";if(n.startsWith("data:image/")){const s=/^data:(image\/[^;]+);/i.exec(n);return s?.[1]?s[1].toLowerCase():"image/*"}return Tv(e.filePath??null)??"text/markdown"}function Lv(e){if(e.error)return r`
      <div class="callout danger">${e.error}</div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(!e.content)return r`
      <div class="muted">No content available</div>
    `;const t=Cv(e),n=e.content,s=n.trim();return t.startsWith("image/")?s.startsWith("data:image/")?r`
        <div class="sidebar-image">
          <img src=${s} alt=${_v(e.filePath??"Image preview")} />
        </div>
      `:r`
      <div class="callout">
        Image preview unavailable for this payload format.
      </div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `:t==="text/html"||t==="application/xhtml+xml"?r`<div class="sidebar-html">${je(Kp(n))}</div>`:t==="text/markdown"||t==="text/x-markdown"?r`<div class="sidebar-markdown">${je(ce(n))}</div>`:r`<pre class="sidebar-plain">${n}</pre>`}function Nc(e){const t=e.title?.trim()||"Tool Output";return r`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${t}</div>
          ${e.filePath?r`<div class="sidebar-path" title=${e.filePath}>${e.filePath}</div>`:f}
        </div>
        <button @click=${e.onClose} class="btn" title="Close sidebar">
          ${W.x}
        </button>
      </div>
      <div class="sidebar-content">${Lv(e)}</div>
    </div>
  `}var Ev=Object.defineProperty,Iv=Object.getOwnPropertyDescriptor,bs=(e,t,n,s)=>{for(var i=s>1?void 0:s?Iv(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&Ev(t,n,i),i};let Nt=class extends Lt{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.isDragging=!1,this.startX=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startX=e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=t.getBoundingClientRect().width,i=(e.clientX-this.startX)/n;let a=this.startRatio+i;a=Math.max(this.minRatio,Math.min(this.maxRatio,a)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:a},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return r``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};Nt.styles=ad`
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
  `;bs([ss({type:Number})],Nt.prototype,"splitRatio",2);bs([ss({type:Number})],Nt.prototype,"minRatio",2);bs([ss({type:Number})],Nt.prototype,"maxRatio",2);Nt=bs([il("resizable-divider")],Nt);const Mv=5e3;function Sr(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function Rv(e){const t=e.sessions?.sessions?.find(i=>i.key===e.sessionKey);if(!t)return null;const n=t.totalTokens??0,s=t.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return s<=0?null:n/s}function Pv(e){const t=Rv(e);if(t===null)return f;const n=Math.round(t*100),s=n>=90?"danger":n>=70?"warn":"ok",i=e.sessions?.sessions?.find(l=>l.key===e.sessionKey),a=i?.totalTokens??0,o=i?.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return r`
    <button
      type="button"
      class="chat-context-badge chat-context-badge--${s}"
      role="status"
      aria-label="Context window: ${n}% used. Click to compact."
      @click=${()=>e.onCompact?.()}
      ?disabled=${!e.connected}
    >
      ${n}%
      <span class="chat-context-badge__tooltip">
        ${a.toLocaleString()} / ${o.toLocaleString()} tokens<br>
        Click to compact
      </span>
    </button>
  `}function Dv(e){return e?e.active?r`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${W.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<Mv?r`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${W.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `:f:f}function Ia(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function Nv(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy")}function Ov(e,t){e.preventDefault(),e.stopPropagation(),t.classList.add("chat--drag-over")}function Bv(e,t){e.preventDefault(),e.stopPropagation();const n=t.getBoundingClientRect();(e.clientX<=n.left||e.clientX>=n.right||e.clientY<=n.top||e.clientY>=n.bottom)&&t.classList.remove("chat--drag-over")}function Fv(e,t){e.preventDefault(),e.stopPropagation(),e.currentTarget.classList.remove("chat--drag-over");const s=e.dataTransfer?.files;if(!s||s.length===0||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((p,h)=>p+(h.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=Ea(s,a);for(const p of l)t.showToast?.(p,"error");if(o.length===0)return;const c=[];let u=o.length;for(const p of o){const h=new FileReader;h.addEventListener("load",()=>{const g=h.result;c.push({id:Ia(),dataUrl:g,mimeType:p.type||"application/octet-stream",fileName:p.name}),u--,u===0&&t.onAttachmentsChange?.([...i,...c])}),h.addEventListener("error",()=>{t.showToast?.(`Failed to read "${p.name}"`,"error"),u--,u===0&&c.length>0&&t.onAttachmentsChange?.([...i,...c])}),h.readAsDataURL(p)}}function Uv(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let p=0;p<n.length;p++){const h=n[p];if(h.type.startsWith("image/")){const g=h.getAsFile();g&&s.push(g)}}if(s.length===0)return;e.preventDefault();const i=t.attachments??[],a=i.reduce((p,h)=>p+(h.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=Ea(s,a);for(const p of l)t.showToast?.(p,"error");if(o.length===0)return;const c=[];let u=o.length;for(const p of o){const h=new FileReader;h.addEventListener("load",()=>{const g=h.result;c.push({id:Ia(),dataUrl:g,mimeType:p.type,fileName:p.name||"pasted-image"}),u--,u===0&&t.onAttachmentsChange?.([...i,...c])}),h.addEventListener("error",()=>{t.showToast?.("Failed to read pasted image","error"),u--,u===0&&c.length>0&&t.onAttachmentsChange?.([...i,...c])}),h.readAsDataURL(p)}}function Kv(e,t){const n=e.target,s=n.files;if(!s||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((p,h)=>p+(h.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=Ea(s,a);for(const p of l)t.showToast?.(p,"error");if(o.length===0){n.value="";return}const c=[];let u=o.length;for(const p of o){const h=new FileReader;h.addEventListener("load",()=>{const g=h.result;c.push({id:Ia(),dataUrl:g,mimeType:p.type||"application/octet-stream",fileName:p.name}),u--,u===0&&t.onAttachmentsChange?.([...i,...c])}),h.addEventListener("error",()=>{t.showToast?.(`Failed to read "${p.name}"`,"error"),u--,u===0&&c.length>0&&t.onAttachmentsChange?.([...i,...c])}),h.readAsDataURL(p)}n.value=""}function Wv(e){const t=e.attachments??[];return t.length===0?f:r`
    <div class="chat-attachments">
      ${t.map(n=>{const s=n.mimeType.startsWith("image/"),i=n.fileName||"file",a=i.length>20?i.slice(0,17)+"...":i;return r`
          <div class="chat-attachment ${s?"":"chat-attachment--file"}">
            ${s?r`<img src=${n.dataUrl} alt="Attachment preview" class="chat-attachment__img" />`:r`<div class="chat-attachment__file">
                  ${W.fileText}
                  <span class="chat-attachment__filename" title=${i}>${a}</span>
                </div>`}
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const o=(e.attachments??[]).filter(l=>l.id!==n.id);e.onAttachmentsChange?.(o)}}
            >
              ${W.x}
            </button>
          </div>
        `})}
    </div>
  `}function Hv(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function zv(e){const t=e.href;if(t){if(e.target==="_blank"){window.open(t,"_blank","noopener,noreferrer");return}window.location.assign(t)}}function jv(e){const t=e.trim();return!t||t.includes(`
`)?null:t.startsWith("/")||t.startsWith("~/")||t.startsWith("./")||t.startsWith("../")||/^[a-z]:[\\/]/i.test(t)||/^[^:\s]+\/[^\s]+$/.test(t)&&/\.[a-z0-9]{1,12}$/i.test(t)?t:null}async function Vv(e,t){const n=e.target,s=n instanceof Element?n:n instanceof Node?n.parentElement:null;if(!s||!t.onMessageLinkClick||!Hv(e))return;const i=s.closest("a");if(i instanceof HTMLAnchorElement){if(i.hasAttribute("download"))return;const l=i.getAttribute("href");if(!l)return;e.preventDefault(),await t.onMessageLinkClick(l)||zv(i);return}const a=s.closest("code");if(!(a instanceof HTMLElement))return;const o=jv(a.textContent??"");o&&(e.preventDefault(),await t.onMessageLinkClick(o))}function Gv(e){const t=e.connected,n=e.sending||e.stream!==null;e.canAbort&&e.onAbort;const i=e.sessions?.sessions?.find(g=>g.key===e.sessionKey)?.reasoningLevel??"off",a=e.showThinking&&i!=="off",o={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},l=(e.attachments?.length??0)>0,c=e.connected?l?"Add a message or paste more images...":"Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",u=e.splitRatio??.6,p=!!(e.sidebarOpen&&e.onCloseSidebar),h=r`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
      @click=${g=>{Vv(g,e)}}
    >
      ${e.loading?r`
              <div class="muted">Loading chat…</div>
            `:f}
      ${vs(Qv(e),g=>g.key,g=>{try{return g.kind==="reading-indicator"?mv(o,e.currentToolInfo):g.kind==="stream"?vv(g.text,g.startedAt,e.onOpenSidebar,o,e.currentToolInfo):g.kind==="compaction-summary"?kv(g.message):g.kind==="group"?yv(g,{onOpenSidebar:e.onOpenSidebar,showReasoning:a,assistantName:e.assistantName,assistantAvatar:o.avatar,userName:e.userName,userAvatar:e.userAvatar}):f}catch(d){return console.error("[chat] item render error:",d,g.key),f}})}
    </div>
  `;return r`
    <section 
      class="card chat"
      @dragover=${Nv}
      @dragenter=${g=>Ov(g,g.currentTarget)}
      @dragleave=${g=>Bv(g,g.currentTarget)}
      @drop=${g=>Fv(g,e)}
    >
      ${e.disabledReason?r`<div class="callout">${e.disabledReason}</div>`:f}

      ${e.error?r`<div class="callout danger">${e.error}</div>`:f}

      ${Dv(e.compactionStatus)}

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
                    `:f}
              </div>
            </div>
          `:f}

      ${e.focusMode?r`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${W.x}
            </button>
          `:f}

      <div
        class="chat-split-container ${p?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${p?`0 0 ${u*100}%`:"1 1 100%"}"
        >
          ${h}
          ${e.showNewMessages&&e.onScrollToBottom?r`
                <button
                  class="chat-new-messages"
                  type="button"
                  @click=${e.onScrollToBottom}
                  aria-label="New messages below"
                  title="New messages"
                >
                  New messages ↓
                </button>
              `:f}
        </div>

        ${p?r`
              <resizable-divider
                .splitRatio=${u}
                @resize=${g=>e.onSplitRatioChange?.(g.detail.splitRatio)}
              ></resizable-divider>
              <div class="chat-sidebar">
                ${Nc({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})}})}
              </div>
            `:f}
      </div>

      ${e.queue.length?r`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(g=>r`
                    <div class="chat-queue__item">
                      <div class="chat-queue__text">
                        ${g.text||(g.attachments?.length?`Image (${g.attachments.length})`:"")}
                      </div>
                      <button
                        class="btn chat-queue__remove"
                        type="button"
                        aria-label="Remove queued message"
                        @click=${()=>e.onQueueRemove(g.id)}
                      >
                        ${W.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:f}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${g=>Kv(g,e)}
          />
          ${Wv(e)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${Ta(g=>g&&Sr(g))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${g=>{if(g.key!=="Enter"||g.isComposing||g.keyCode===229||g.shiftKey||!e.connected)return;g.preventDefault();const d=g.ctrlKey||g.metaKey;t&&e.onSend(d)}}
              @input=${g=>{const d=g.target;Sr(d),e.onDraftChange(d.value)}}
              @paste=${g=>Uv(g,e)}
              placeholder=${c}
            ></textarea>

            <div class="chat-compose__actions">
              ${Pv(e)}

              <button
                class="chat-compose__toolbar-btn"
                type="button"
                title="Attach files"
                ?disabled=${!e.connected}
                @click=${()=>{document.getElementById("chat-file-input")?.click()}}
              >
                ${W.paperclip}
              </button>

              ${e.onConsciousnessFlush?r`
                  <button
                    class="chat-compose__toolbar-btn consciousness-btn ${e.consciousnessStatus==="ok"?"consciousness-btn--ok":""} ${e.consciousnessStatus==="error"?"consciousness-btn--error":""}"
                    type="button"
                    ?disabled=${e.consciousnessStatus==="loading"}
                    @click=${e.onConsciousnessFlush}
                    title="Sync consciousness — refreshes Atlas's live context (⌘⇧H)"
                    aria-label="Sync consciousness"
                  >
                    ${e.consciousnessStatus==="loading"?W.loader:r`<img src="/consciousness-icon.webp" width="18" height="18" alt="" style="display:block;opacity:0.9;" />`}
                  </button>
                `:f}

              <button
                class="chat-compose__send-btn"
                ?disabled=${!e.canSend||!e.connected}
                @click=${()=>e.onSend(!1)}
                title=${n?"Send now - interrupts current run (↵)":"Send message (↵)"}
              >
                ${W.arrowUp}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `}const Ar=200;function qv(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const i=Ec(s.message),a=Ca(i.role),o=i.timestamp||Date.now();!n||n.role!==a?(n&&t.push(n),n={kind:"group",key:`group:${a}:${s.key}`,role:a,messages:[{message:s.message,key:s.key}],timestamp:o,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function Yv(e){const n=e.content;if(!Array.isArray(n))return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const i=s;if(i.type==="image")return!0;if(Array.isArray(i.content)){for(const a of i.content)if(!(typeof a!="object"||a===null)&&a.type==="image")return!0}}return!1}function Qv(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],i=Math.max(0,n.length-Ar);i>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${Ar} messages (${i} hidden).`,timestamp:Date.now()}});for(let a=i;a<n.length;a++){const o=n[a];if($v(o)){t.push({kind:"compaction-summary",key:`compaction:${a}`,message:o});continue}const l=Ec(o);!e.showThinking&&l.role.toLowerCase()==="toolresult"&&!Yv(o)||t.push({kind:"message",key:xr(o,a),message:o})}if(e.showThinking)for(let a=0;a<s.length;a++)t.push({kind:"message",key:xr(s[a],a+n.length),message:s[a]});if(e.stream!==null){const a=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:a,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:a})}else if(e.isWorking){const a=`working:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}else if(e.sending||e.canAbort){const a=`sending:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}return qv(t)}function xr(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const i=typeof n.id=="string"?n.id:"";if(i)return`msg:${i}`;const a=typeof n.messageId=="string"?n.messageId:"";if(a)return`msg:${a}`;const o=typeof n.timestamp=="number"?n.timestamp:null,l=typeof n.role=="string"?n.role:"unknown";return o!=null?`msg:${l}:${o}:${t}`:`msg:${l}:${t}`}function Jv(e,t=128){return new Promise((n,s)=>{const i=new Image;i.addEventListener("load",()=>{const a=document.createElement("canvas");a.width=t,a.height=t;const o=a.getContext("2d");if(!o){s(new Error("Could not get canvas context"));return}const l=Math.min(i.width,i.height),c=(i.width-l)/2,u=(i.height-l)/2;o.drawImage(i,c,u,l,l,0,0,t,t),n(a.toDataURL("image/png"))}),i.addEventListener("error",()=>s(new Error("Failed to load image"))),i.src=URL.createObjectURL(e)})}let _t="",tn=null,at=null,_r=!1,Ne=!1;function Xv(e){_r||(_t=e.userName||"",tn=e.userAvatar||null,at=e.userAvatar||null,_r=!0,Ne=!1)}function Zv(e){Xv(e);const t=c=>{_t=c.target.value,Ne=!0},n=async c=>{const p=c.target.files?.[0];if(p){if(!p.type.startsWith("image/")){alert("Please select an image file");return}if(p.size>5*1024*1024){alert("Image must be less than 5MB");return}try{const h=await Jv(p,128);tn=h,at=h,Ne=!0,document.dispatchEvent(new CustomEvent("user-settings-updated"))}catch(h){console.error("Failed to process image:",h),alert("Failed to process image")}}},s=()=>{tn=null,at=null,Ne=!0;const c=document.getElementById("user-avatar-input");c&&(c.value=""),document.dispatchEvent(new CustomEvent("user-settings-updated"))},i=()=>{e.onUpdate(_t,tn||""),Ne=!1;const c=document.querySelector(".user-settings__save");c&&(c.textContent="Saved!",setTimeout(()=>{c.textContent="Save"},1500))},a=()=>{_t=e.userName||"",tn=e.userAvatar||null,at=e.userAvatar||null,Ne=!1,document.dispatchEvent(new CustomEvent("user-settings-updated"))},o=_t||"You",l=at?r`<img src="${at}" alt="${o}" class="user-settings__avatar-img" />`:r`<span class="user-settings__avatar-initial">${o.charAt(0).toUpperCase()}</span>`;return r`
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
                  ${l}
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
                  ${at?r`
                        <button
                          type="button"
                          class="user-settings__btn user-settings__btn--clear"
                          @click=${s}
                        >
                          Remove
                        </button>
                      `:f}
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
                .value=${_t}
                @input=${t}
                placeholder="Your name"
                maxlength="50"
              />
              <span class="user-settings__hint">This name appears on your chat messages</span>
            </div>

            <!-- Actions -->
            <div class="user-settings__actions">
              ${Ne?r`
                    <button
                      type="button"
                      class="user-settings__btn user-settings__btn--cancel"
                      @click=${a}
                    >
                      Cancel
                    </button>
                  `:f}
              <button
                type="button"
                class="user-settings__btn user-settings__btn--save user-settings__save"
                ?disabled=${!Ne}
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
  `},ai=[{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"},{key:"user",label:"User"}],Tr=new Set(["user"]),Cr="__all__";function Lr(e){return Ni[e]??Ni.default}function ey(e,t){const n=_a[e];return n||{label:t?.title??Re(e),description:t?.description??""}}function ty(e){const{key:t,schema:n,uiHints:s}=e;if(!n||Ae(n)!=="object"||!n.properties)return[];const i=Object.entries(n.properties).map(([a,o])=>{const l=pe([t,a],s),c=l?.label??o.title??Re(a),u=l?.help??o.description??"",p=l?.order??50;return{key:a,label:c,description:u,order:p}});return i.sort((a,o)=>a.order!==o.order?a.order-o.order:a.key.localeCompare(o.key)),i}function ny(e,t){if(!e||!t)return[];const n=[];function s(i,a,o){if(i===a)return;if(typeof i!=typeof a){n.push({path:o,from:i,to:a});return}if(typeof i!="object"||i===null||a===null){i!==a&&n.push({path:o,from:i,to:a});return}if(Array.isArray(i)&&Array.isArray(a)){JSON.stringify(i)!==JSON.stringify(a)&&n.push({path:o,from:i,to:a});return}const l=i,c=a,u=new Set([...Object.keys(l),...Object.keys(c)]);for(const p of u)s(l[p],c[p],o?`${o}.${p}`:p)}return s(e,t,""),n}function Er(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}function sy(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=xc(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,i=n.schema?.properties??{},a=ai.filter(R=>R.key in i&&!Tr.has(R.key)),o=new Set(ai.map(R=>R.key)),l=Object.keys(i).filter(R=>!o.has(R)).map(R=>({key:R,label:R.charAt(0).toUpperCase()+R.slice(1)})),c=ai.filter(R=>Tr.has(R.key)),u=[...a,...l,...c],p=e.activeSection&&n.schema&&Ae(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,h=e.activeSection?ey(e.activeSection,p):null,g=e.activeSection?ty({key:e.activeSection,schema:p,uiHints:e.uiHints}):[],d=e.formMode==="form"&&!!e.activeSection&&g.length>0,m=e.activeSubsection===Cr,k=e.searchQuery||m?null:e.activeSubsection??g[0]?.key??null,$=e.formMode==="form"?ny(e.originalValue,e.formValue):[],S=e.formMode==="raw"&&e.raw!==e.originalRaw,x=e.formMode==="form"?$.length>0:S,L=!!e.formValue&&!e.loading&&!!n.schema,C=e.connected&&!e.saving&&x&&(e.formMode==="raw"?!0:L),E=e.connected&&!e.applying&&!e.updating&&x&&(e.formMode==="raw"?!0:L),P=e.connected&&!e.applying&&!e.updating;return r`
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
            @input=${R=>e.onSearchChange(R.target.value)}
          />
          ${e.searchQuery?r`
            <button
              class="config-search__clear"
              @click=${()=>e.onSearchChange("")}
            >×</button>
          `:f}
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
          ${u.map(R=>r`
            <button
              class="config-nav__item ${e.activeSection===R.key?"active":""}"
              @click=${()=>e.onSectionChange(R.key)}
            >
              <span class="config-nav__icon">${Lr(R.key)}</span>
              <span class="config-nav__label">${R.label}</span>
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
            ${x?r`
              <span class="config-changes-badge">${e.formMode==="raw"?"Unsaved changes":`${$.length} unsaved change${$.length!==1?"s":""}`}</span>
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
              ?disabled=${!C}
              @click=${e.onSave}
            >
              ${e.saving?"Saving…":"Save"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!E}
              @click=${e.onApply}
            >
              ${e.applying?"Applying…":"Apply"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!P}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${x&&e.formMode==="form"?r`
          <details class="config-diff">
            <summary class="config-diff__summary">
              <span>View ${$.length} pending change${$.length!==1?"s":""}</span>
              <svg class="config-diff__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${$.map(R=>r`
                <div class="config-diff__item">
                  <div class="config-diff__path">${R.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${Er(R.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${Er(R.to)}</span>
                  </div>
                </div>
              `)}
            </div>
          </details>
        `:f}

        ${h&&e.formMode==="form"?r`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${Lr(e.activeSection??"")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${h.label}</div>
                  ${h.description?r`<div class="config-section-hero__desc">${h.description}</div>`:f}
                </div>
              </div>
            `:f}

        ${d?r`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${k===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(Cr)}
                >
                  All
                </button>
                ${g.map(R=>r`
                    <button
                      class="config-subnav__item ${k===R.key?"active":""}"
                      title=${R.description||R.label}
                      @click=${()=>e.onSubsectionChange(R.key)}
                    >
                      ${R.label}
                    </button>
                  `)}
              </div>
            `:f}

        <!-- Form content -->
        <div class="config-content">
          ${e.activeSection==="user"?Zv({userName:e.userName,userAvatar:e.userAvatar,onUpdate:e.onUserProfileUpdate}):e.formMode==="form"?r`
                  ${e.schemaLoading?r`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `:Xg({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:k})}
                  ${s?r`
                          <div class="callout danger" style="margin-top: 12px">
                            Form view can't safely edit some fields. Use Raw to avoid losing config entries.
                          </div>
                        `:f}
                `:r`
                  <label class="field config-raw-field">
                    <span>Raw JSON5</span>
                    <textarea
                      .value=${e.raw}
                      @input=${R=>e.onRawChange(R.target.value)}
                    ></textarea>
                  </label>
                `}
        </div>

        ${e.issues.length>0?r`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:f}
      </main>
    </div>
  `}function iy(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",i=e.version??"";return`${t} ${n} ${s} ${i}`.trim()}function ay(e){const t=e.ts??null;return t?U(t):"n/a"}function Oc(e){return e?`${un(e)} (${U(e)})`:"n/a"}function oy(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function ry(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function ly(e){const t=e.state??{},n=t.nextRunAtMs?un(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?un(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function cy(e){const t=e.schedule;return t.kind==="at"?`At ${un(t.atMs)}`:t.kind==="every"?`Every ${pl(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function dy(e){const t=e.payload;return t.kind==="systemEvent"?`System: ${t.text}`:`Agent: ${t.message}`}function uy(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.channel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(i=>s.has(i)?!1:(s.add(i),!0))}function py(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function hy(e){const t=uy(e);return r`
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
            <div class="stat-value">${Oc(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
          ${e.error?r`<span class="muted">${e.error}</span>`:f}
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
        ${fy(e)}
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
                            ${py(e,n)}
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
                    `:f}
              </div>
            `:f}
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
              ${e.jobs.map(n=>gy(n,e))}
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
                ${e.runs.map(n=>my(n))}
              </div>
            `}
    </section>
  `}function fy(e){const t=e.form;return t.scheduleKind==="at"?r`
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
  `}function gy(e,t){const s=`list-item list-item-clickable${t.runsJobId===e.id?" list-item-selected":""}`;return r`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${cy(e)}</div>
        <div class="muted">${dy(e)}</div>
        ${e.agentId?r`<div class="muted">Agent: ${e.agentId}</div>`:f}
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.enabled?"enabled":"disabled"}</span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
      </div>
      <div class="list-meta">
        <div>${ly(e)}</div>
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
  `}function my(e){return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${un(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?r`<div class="muted">${e.error}</div>`:f}
      </div>
    </div>
  `}const vy={health:"❤️",calendar:"📅",tasks:"✅",email:"📧",meetings:"🎤",environment:"🌤️"},yy={connected:"#10b981",pending:"#f59e0b",disconnected:"#ef4444"},Ir={connected:"Connected",pending:"Pending",disconnected:"Disconnected"};function by(e){return vy[e.toLowerCase()]??"🔗"}function wy(e){if(!e)return"Never";const t=new Date(e),s=new Date().getTime()-t.getTime(),i=Math.floor(s/(1e3*60));if(i<1)return"Just now";if(i<60)return`${i}m ago`;const a=Math.floor(i/60);return a<24?`${a}h ago`:`${Math.floor(a/24)}d ago`}function ky(e,t){const n=yy[e.status];return r`
    <div class="my-day-card data-source-card">
      <div class="data-source-header">
        <span class="data-source-icon">${by(e.type)}</span>
        <div class="data-source-info">
          <div class="data-source-name">${e.name}</div>
          <span class="data-source-type-badge">${e.type}</span>
        </div>
        <div class="data-source-status" title="${Ir[e.status]}">
          <span
            class="data-source-status-dot"
            style="background: ${n};"
          ></span>
          <span class="data-source-status-label">${Ir[e.status]}</span>
        </div>
      </div>
      <div class="data-source-body">
        ${e.skill?r`<div class="data-source-skill">
              <span class="data-source-detail-label">Skill:</span>
              <span class="data-source-detail-value">${e.skill}</span>
            </div>`:f}
        <div class="data-source-sync">
          <span class="data-source-detail-label">Last sync:</span>
          <span class="data-source-detail-value">${wy(e.lastSync)}</span>
        </div>
      </div>
      ${e.status==="pending"&&t?r`
            <div class="data-source-actions">
              <button
                class="data-source-connect-btn"
                @click=${()=>t(e.id)}
              >
                Connect
              </button>
            </div>
          `:f}
    </div>
  `}function $y(e,t){return e.length===0?r`
      <div class="my-day-card">
        <div class="my-day-card-content">
          <div class="my-day-empty">
            No data sources configured. Chat to connect your first integration.
          </div>
        </div>
      </div>
    `:r`
    <div class="data-sources-grid">
      ${e.map(n=>ky(n,t))}
    </div>
  `}function Sy(e){return r`
    <div class="data-dashboard-section">
      <div class="data-dashboard-prompt">What do you want to know?</div>
      <div class="data-dashboard-hint">
        Ask questions about your connected data in chat.
        Dashboards and visualizations are generated on demand.
      </div>
      ${e?r`
            <button
              class="data-dashboard-btn"
              @click=${()=>e("Query my connected data")}
            >
              Open Data Chat
            </button>
          `:f}
    </div>
  `}function Ay(e){if(e.loading)return r`
      <div class="my-day-container" style="overflow-y: auto">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading data sources...</span>
        </div>
      </div>
    `;if(e.error)return r`
      <div class="my-day-container" style="overflow-y: auto;">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${e.error}</span>
          ${e.onRefresh?r`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:f}
        </div>
      </div>
    `;const t=e.sources.filter(n=>n.status==="connected").length;return r`
    <div class="my-day-container" style="overflow-y: auto;">
      <!-- Header -->
      <div class="my-day-header">
        <div class="my-day-header-left">
          <h1 class="my-day-title">Data</h1>
          <p class="my-day-subtitle">Explore your data and manage integrations.</p>
        </div>
        <div class="my-day-header-right">
          <div class="my-day-summary-stat">
            <span class="summary-value">${t}</span>
            <span class="summary-label">Connected</span>
          </div>
          <div class="my-day-summary-divider"></div>
          <div class="my-day-summary-stat">
            <span class="summary-value">${e.sources.length}</span>
            <span class="summary-label">Total</span>
          </div>
          ${e.onRefresh?r`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh">↻</button>
              `:f}
        </div>
      </div>

      <!-- Subtab navigation: Dashboard first, Sources second -->
      <div class="config-subnav">
        <button
          class="config-subnav__item ${e.subtab==="dashboard"?"active":""}"
          @click=${()=>e.onSubtabChange?.("dashboard")}
        >
          Dashboard
        </button>
        <button
          class="config-subnav__item ${e.subtab==="sources"?"active":""}"
          @click=${()=>e.onSubtabChange?.("sources")}
        >
          Sources
        </button>
      </div>

      <!-- Content -->
      <div style="padding: 0 24px 24px;">
        ${e.subtab==="dashboard"?Sy(e.onQuerySubmit):$y(e.sources,e.onConnectSource)}
      </div>
    </div>
  `}function xy(e){const n=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=n?.critical??0,i=n?.warn??0,a=n?.info??0,o=s>0?"danger":i>0?"warn":"success",l=s>0?`${s} critical`:i>0?`${i} warnings`:"No critical issues";return r`
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
                  Security audit: ${l}${a>0?` · ${a} info`:""}. Run
                  <span class="mono">openclaw security audit --deep</span> for details.
                </div>`:f}
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
              @input=${c=>e.onCallMethodChange(c.target.value)}
              placeholder="system-presence"
            />
          </label>
          <label class="field">
            <span>Params (JSON)</span>
            <textarea
              .value=${e.callParams}
              @input=${c=>e.onCallParamsChange(c.target.value)}
              rows="6"
            ></textarea>
          </label>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn primary" @click=${e.onCall}>Call</button>
        </div>
        ${e.callError?r`<div class="callout danger" style="margin-top: 12px;">
              ${e.callError}
            </div>`:f}
        ${e.callResult?r`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:f}
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
              ${e.eventLog.map(c=>r`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${c.event}</div>
                      <div class="list-sub">${new Date(c.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta">
                      <pre class="code-block">${ry(c.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function _y(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function et(e,t){return t?r`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:f}function Ty(e){const t=e.execApprovalQueue[0];if(!t)return f;const n=t.request,s=t.expiresAtMs-Date.now(),i=s>0?`expires in ${_y(s)}`:"expired",a=e.execApprovalQueue.length;return r`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
          ${a>1?r`<div class="exec-approval-queue">${a} pending</div>`:f}
        </div>
        <div class="exec-approval-command mono">${n.command}</div>
        <div class="exec-approval-meta">
          ${et("Host",n.host)}
          ${et("Agent",n.agentId)}
          ${et("Session",n.sessionKey)}
          ${et("CWD",n.cwd)}
          ${et("Resolved",n.resolvedPath)}
          ${et("Security",n.security)}
          ${et("Ask",n.ask)}
        </div>
        ${e.execApprovalError?r`<div class="exec-approval-error">${e.execApprovalError}</div>`:f}
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
  `}function Cy(e){const{pendingGatewayUrl:t}=e;return t?r`
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
  `:f}const Ly={professional:"#3b82f6",personal:"#10b981",health:"#ef4444",financial:"#f59e0b",creative:"#a855f7",relationship:"#ec4899"},Ey={active:"Active",completed:"Completed",paused:"Paused"},Iy={active:"●",completed:"✓",paused:"⏸"};function My(e){return e?Ly[e.toLowerCase()]??"var(--mc-text-muted)":"var(--mc-text-muted)"}function Ry(e){const t={active:[],completed:[],paused:[]};for(const n of e)t[n.status].push(n);return t}function Py(e){const t=Math.max(0,Math.min(100,e));return r`
    <div class="goals-progress-bar">
      <div
        class="goals-progress-fill"
        style="width: ${t}%; background: ${t>=100?"#10b981":"var(--mc-accent)"}"
      ></div>
    </div>
    <span class="goals-progress-label">${t}%</span>
  `}function Dy(e){const t=My(e.area);return r`
    <div class="my-day-card goals-card goals-status-${e.status}">
      <div class="goals-card-header">
        <div class="goals-card-title">${e.title}</div>
        <span class="goals-status-indicator goals-status-${e.status}" title="${Ey[e.status]}">
          ${Iy[e.status]}
        </span>
      </div>
      <div class="goals-card-body">
        ${e.area?r`
              <span
                class="goals-area-badge"
                style="background: ${t}22; color: ${t}; border: 1px solid ${t}44;"
              >
                ${e.area}
              </span>
            `:f}
        ${e.target?r`<div class="goals-target-text">${e.target}</div>`:f}
        ${e.progress!=null?r`<div class="goals-progress-row">${Py(e.progress)}</div>`:f}
      </div>
    </div>
  `}function oi(e,t){return t.length===0?f:r`
    <div class="goals-group">
      <div class="goals-group-label">
        <span>${e}</span>
        <span class="goals-group-count">${t.length}</span>
      </div>
      <div class="goals-group-cards">
        ${t.map(n=>Dy(n))}
      </div>
    </div>
  `}function Ny(e){if(e.loading)return r`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading goals...</span>
        </div>
      </div>
    `;if(e.error)return r`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${e.error}</span>
          ${e.onRefresh?r`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:f}
        </div>
      </div>
    `;const t=Ry(e.goals),n=t.active.length,s=t.completed.length;return r`
    <div class="my-day-container">
      <!-- Header -->
      <div class="my-day-header">
        <div class="my-day-header-left">
          <h1 class="my-day-title">Goals</h1>
        </div>
        <div class="my-day-header-right">
          <div class="my-day-summary-stat">
            <span class="summary-value">${n}</span>
            <span class="summary-label">Active</span>
          </div>
          <div class="my-day-summary-divider"></div>
          <div class="my-day-summary-stat">
            <span class="summary-value">${s}</span>
            <span class="summary-label">Done</span>
          </div>
          ${e.onUpdateViaChat?r`
                <div class="my-day-summary-divider"></div>
                <button class="goals-chat-btn" @click=${e.onUpdateViaChat} title="Update via Chat">
                  Update via Chat
                </button>
              `:f}
          ${e.onRefresh?r`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh">↻</button>
              `:f}
        </div>
      </div>

      <!-- Content -->
      <div class="my-day-grid" style="grid-template-columns: 1fr;">
        ${e.goals.length===0?r`
                <div class="my-day-card">
                  <div class="my-day-card-content">
                    <div class="my-day-empty">No goals yet. Chat to set up your goals.</div>
                  </div>
                </div>
              `:r`
              ${oi("ACTIVE",t.active)}
              ${oi("COMPLETED",t.completed)}
              ${oi("PAUSED",t.paused)}
            `}
      </div>
    </div>
  `}const Oy=[{id:"trigger",name:"Process Trigger",emoji:"🔥",description:"Work through something that activated you"},{id:"shadow",name:"Shadow Work",emoji:"🪞",description:"Explore unconscious patterns"},{id:"inner-child",name:"Inner Child",emoji:"👶",description:"Heal younger parts of yourself"},{id:"fear-shame",name:"Fear & Shame",emoji:"😰",description:"Process core fears and shame"},{id:"self-compassion",name:"Self-Compassion",emoji:"💚",description:"Practice self-kindness"},{id:"parts-work",name:"Parts Work",emoji:"🎯",description:"Dialogue with inner parts (IFS)"}];function Mr(e){e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,200)}px`}function Bc(e){return new Date(e).toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"})}function By(e){return r`
    <div class="sage-message sage-message--sage">
      <div class="sage-message__avatar">
        <span class="sage-avatar-icon">\u{1F9D8}</span>
      </div>
      <div class="sage-message__content">
        <div class="sage-message__header">
          <span class="sage-message__name">Sage</span>
          <span class="sage-message__time">${Bc(e.timestamp)}</span>
        </div>
        <div class="sage-message__text">${e.content}</div>
      </div>
    </div>
  `}function Fy(e){return r`
    <div class="sage-message sage-message--user">
      <div class="sage-message__content">
        <div class="sage-message__header">
          <span class="sage-message__time">${Bc(e.timestamp)}</span>
          <span class="sage-message__name">You</span>
        </div>
        <div class="sage-message__text">${e.content}</div>
      </div>
      <div class="sage-message__avatar sage-message__avatar--user">
        <span class="sage-avatar-icon">\u2764\uFE0F</span>
      </div>
    </div>
  `}function Uy(e){const t=e.activeSession?"Share what's coming up for you...":"Select a session type below to begin...",n=e.activeSession?`Welcome to ${e.activeSession.name}. I'm here to hold space for whatever arises. Take your time, breathe, and share when you're ready.`:"Choose a practice below to begin your inner work session.";return r`
    <div class="sage-chat">
      <div class="sage-chat__header">
        <div class="sage-chat__title-group">
          ${e.activeSession?r`
                <button
                  class="sage-chat__back-btn"
                  type="button"
                  @click=${()=>e.onBackToSessions?.()}
                  title="Back to sessions"
                >
                  \u2190
                </button>
              `:f}
          <span class="sage-chat__icon">\u{1F9D8}</span>
          <div class="sage-chat__title-text">
            <h2 class="sage-chat__title">
              ${e.activeSession?e.activeSession.name:"The Sage"}
            </h2>
            <span class="sage-chat__subtitle">
              ${e.activeSession?e.activeSession.description:"Your guide for inner work"}
            </span>
          </div>
        </div>
        <div class="sage-chat__status ${e.connected?"online":"offline"}">
          <span class="sage-status-dot"></span>
          <span>${e.connected?"Present":"Away"}</span>
        </div>
      </div>

      <div class="sage-chat__messages">
        ${e.messages.length===0?r`
              <div class="sage-welcome">
                <div class="sage-welcome__icon">\u{1F331}</div>
                <p class="sage-welcome__text">${n}</p>
              </div>
            `:e.messages.map(s=>s.role==="sage"?By(s):Fy(s))}
        ${e.loading?r`
                <div class="sage-message sage-message--sage sage-message--loading">
                  <div class="sage-message__avatar">
                    <span class="sage-avatar-icon">\u{1F9D8}</span>
                  </div>
                  <div class="sage-message__content">
                    <div class="sage-typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              `:f}
      </div>

      ${e.error?r`<div class="sage-error">${e.error}</div>`:f}

      <div class="sage-chat__compose">
        <textarea
          class="sage-chat__input"
          ${Ta(s=>s&&Mr(s))}
          .value=${e.inputValue}
          ?disabled=${!e.connected||!e.activeSession}
          placeholder=${t}
          @input=${s=>{const i=s.target;Mr(i),e.onInputChange?.(i.value)}}
          @keydown=${s=>{s.key==="Enter"&&!s.shiftKey&&(s.preventDefault(),e.inputValue.trim()&&e.onSend&&e.onSend(e.inputValue))}}
        ></textarea>
        <button
          class="sage-chat__send"
          type="button"
          ?disabled=${!e.connected||!e.inputValue.trim()||!e.activeSession}
          @click=${()=>{e.inputValue.trim()&&e.onSend&&e.onSend(e.inputValue)}}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    </div>
  `}function Ky(e,t){const n=t.activeSession?.id===e.id;return r`
    <button
      class="session-card ${n?"session-card--active":""}"
      type="button"
      @click=${()=>t.onSelectSession?.(e)}
    >
      <div class="session-card__emoji">${e.emoji}</div>
      <div class="session-card__content">
        <h3 class="session-card__title">${e.name}</h3>
        <p class="session-card__description">${e.description}</p>
      </div>
      <div class="session-card__arrow">\u2192</div>
    </button>
  `}function Wy(e){return r`
    <div class="session-grid">
      <div class="session-grid__header">
        <h2 class="session-grid__title">\u2728 Begin Your Practice</h2>
        <p class="session-grid__subtitle">
          Choose a session type to start working with your inner world
        </p>
      </div>
      <div class="session-grid__cards">
        ${Oy.map(t=>Ky(t,e))}
      </div>
    </div>
  `}function Hy(e){return r`
    <div class="inner-work-container">
      <div class="inner-work-chat-section">
        ${Uy(e)}
      </div>
      ${e.activeSession?f:r`
            <div class="inner-work-sessions-section">
              ${Wy(e)}
            </div>
          `}
    </div>
  `}function zy(e){return r`
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
          </div>`:f}
      ${e.statusMessage?r`<div class="callout" style="margin-top: 12px;">
            ${e.statusMessage}
          </div>`:f}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?r`
                <div class="muted">No instances reported yet.</div>
              `:e.entries.map(t=>jy(t))}
      </div>
    </section>
  `}function jy(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],i=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],a=i.length>0?i.length>3?`${i.length} scopes`:`scopes: ${i.join(", ")}`:null;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${iy(e)}</div>
        <div class="chip-row">
          <span class="chip">${n}</span>
          ${s.map(o=>r`<span class="chip">${o}</span>`)}
          ${a?r`<span class="chip">${a}</span>`:f}
          ${e.platform?r`<span class="chip">${e.platform}</span>`:f}
          ${e.deviceFamily?r`<span class="chip">${e.deviceFamily}</span>`:f}
          ${e.modelIdentifier?r`<span class="chip">${e.modelIdentifier}</span>`:f}
          ${e.version?r`<span class="chip">${e.version}</span>`:f}
        </div>
      </div>
      <div class="list-meta">
        <div>${ay(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}function Vy(e){return new Date(e).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}function Gy(e){return new Date(e).toLocaleDateString("en-US",{month:"short",day:"numeric"})}function Fc(e){const t=new Date().toISOString().split("T")[0];return e===t}function qy(e){const t=new Date,n=new Date(e),s=Math.floor((t.getTime()-n.getTime())/(1e3*60*60*24));return s===0?"Today":s===1?"Yesterday":s<7?`${s} days ago`:Gy(e)}function Yy(e){if(!e||e.length===0)return!1;const t=new Date().toISOString().split("T")[0];return e.some(n=>n.date===t)}function Qy(e){return r`
    <div class="lifetracks-container">
      <div class="lifetracks-enable-cta">
        <div class="cta-icon">🎧</div>
        <h2 class="cta-title">Enable LifeTracks</h2>
        <p class="cta-description">
          Generate personalized 5-minute daily affirmation audio based on your Vision Board and
          Wheel of Life. Each track is tailored to your goals and current focus areas.
        </p>
        <div class="cta-cost-info">
          <span class="cost-label">Cost:</span>
          <span class="cost-value">~$0.16 per track</span>
          <span class="cost-breakdown">(Claude + ElevenLabs)</span>
        </div>
        <div class="cta-monthly">
          <span>Daily: ~$5/month</span>
          <span class="separator">•</span>
          <span>Weekly: ~$1.12/month</span>
        </div>
        ${e?r`<button class="cta-button primary-button" @click=${e}>
              Enable LifeTracks
            </button>`:f}
        <p class="cta-note">You can pause or disable anytime in settings.</p>
      </div>
    </div>
  `}function Jy(e,t,n){return r`
    <div class="lifetracks-generate-cta">
      <div class="generate-header">
        <h3>No tracks yet</h3>
        <p>Generate your first personalized LifeTrack based on your Vision Board and goals.</p>
      </div>

      ${t?r`<div class="generate-error">
            <span class="error-icon">⚠️</span>
            <span>${t}</span>
          </div>`:f}

      <button
        class="generate-button primary-button ${e?"generating":""}"
        @click=${n}
        ?disabled=${e}
      >
        ${e?r`
                <span class="spinner-small"></span> Generating (~2 min)...
              `:r`
                Generate Today's Track
              `}
      </button>

      <p class="generate-cost">Cost: ~$0.16</p>
    </div>
  `}function Xy(e,t,n,s){return e?r`
    <div class="lifetracks-player">
      <div class="player-header">
        <div class="player-info">
          <span class="player-date">${Vy(e.date)}</span>
          ${Fc(e.date)?r`
                  <span class="player-badge today">Today's Track</span>
                `:f}
        </div>
      </div>
      <div class="player-audio-container">
        <audio class="player-audio" controls autoplay src=${e.url} preload="metadata">
          Your browser does not support the audio element.
        </audio>
      </div>
      <div class="player-actions">
        <a
          class="player-link"
          href=${e.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Download audio"
        >
          Download MP3
        </a>
        ${!t&&s?r`<button
              class="player-generate-btn ${n?"generating":""}"
              @click=${s}
              ?disabled=${n}
            >
              ${n?"Generating...":"Generate Today's"}
            </button>`:f}
      </div>
    </div>
  `:r`
      <div class="lifetracks-player-empty">
        <span class="player-empty-icon">🎧</span>
        <span class="player-empty-text">Select a track to play</span>
      </div>
    `}function Zy(e,t,n){return!e||e.length===0?r`
      <div class="lifetracks-empty-list">
        <span>No tracks available yet.</span>
      </div>
    `:r`
    <div class="lifetracks-list">
      ${e.map(s=>{const i=t?.date===s.date,a=Fc(s.date);return r`
          <button
            class="lifetracks-list-item ${i?"active":""} ${a?"today":""}"
            @click=${()=>n?.(s)}
          >
            <span class="list-item-date">${qy(s.date)}</span>
            ${a?r`
                    <span class="list-item-badge">NEW</span>
                  `:f}
            ${i?r`
                    <span class="list-item-playing">▶</span>
                  `:f}
          </button>
        `})}
    </div>
  `}function eb(e){if(!e?.stats)return f;const{totalGenerated:t,estimatedCost:n}=e.stats;return t===0?f:r`
    <div class="lifetracks-stats">
      <div class="stat">
        <span class="stat-value">${t}</span>
        <span class="stat-label">Tracks Generated</span>
      </div>
      <div class="stat">
        <span class="stat-value">$${n.toFixed(2)}</span>
        <span class="stat-label">Total Cost</span>
      </div>
    </div>
  `}function Rr(e){if(!e.config?.enabled&&!e.loading)return Qy(e.onEnable);if(e.loading)return r`
      <div class="lifetracks-container">
        <div class="lifetracks-loading">
          <div class="spinner"></div>
          <span>Loading Lifetracks...</span>
        </div>
      </div>
    `;if(e.error)return r`
      <div class="lifetracks-container">
        <div class="lifetracks-error">
          <span class="error-icon">⚠️</span>
          <span>${e.error}</span>
          ${e.onRefresh?r`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:f}
        </div>
      </div>
    `;if(!e.data||e.data.length===0)return r`
      <div class="lifetracks-container">
        <div class="lifetracks-header">
          <div class="lifetracks-header-left">
            <h1 class="lifetracks-title">LifeTracks</h1>
            <p class="lifetracks-subtitle">
              Daily personalized meditation audio with affirmations and vision alignment.
            </p>
          </div>
          <div class="lifetracks-header-right">
            <div class="lifetracks-status ${e.connected?"online":"offline"}">
              <span class="status-indicator status-${e.connected?"working":"idle"}"></span>
              <span class="status-label">${e.connected?"ONLINE":"OFFLINE"}</span>
            </div>
          </div>
        </div>

        ${Jy(e.generating??!1,e.generationError??null,e.onGenerate)}
      </div>
    `;const t=Yy(e.data);return r`
    <div class="lifetracks-container">
      <!-- Header -->
      <div class="lifetracks-header">
        <div class="lifetracks-header-left">
          <h1 class="lifetracks-title">LifeTracks</h1>
          <p class="lifetracks-subtitle">
            Daily personalized meditation audio with affirmations and vision alignment.
          </p>
        </div>
        <div class="lifetracks-header-right">
          <div class="lifetracks-status ${e.connected?"online":"offline"}">
            <span class="status-indicator status-${e.connected?"working":"idle"}"></span>
            <span class="status-label">${e.connected?"ONLINE":"OFFLINE"}</span>
          </div>
          ${e.onUpdateViaChat?r`<button class="goals-chat-btn" @click=${e.onUpdateViaChat} title="Update via Chat">
                Update via Chat
              </button>`:f}
          ${e.onRefresh?r`<button class="lifetracks-refresh-btn" @click=${e.onRefresh} title="Refresh">
                🔄
              </button>`:f}
        </div>
      </div>

      <!-- Main content -->
      <div class="lifetracks-content">
        <!-- Player section -->
        <div class="lifetracks-player-section">
          <div class="lifetracks-section-label">NOW PLAYING</div>
          ${Xy(e.currentTrack,t,e.generating??!1,e.onGenerate)}
        </div>

        <!-- Track list section -->
        <div class="lifetracks-list-section">
          <div class="lifetracks-section-label">ALL TRACKS (${e.data.length})</div>
          ${Zy(e.data,e.currentTrack,e.onSelectTrack)}
        </div>
      </div>

      <!-- Stats -->
      ${eb(e.config??null)}

      <!-- Info card -->
      <div class="lifetracks-info-card">
        <span class="info-icon">💡</span>
        <div class="info-content">
          <strong>About LifeTracks</strong>
          <p>
            Each track is generated based on your Chief Definite Aim, identity statements, and
            lowest Wheel of Life areas. Mixed with calming Starseed background music for a
            5-minute morning ritual.
          </p>
        </div>
      </div>
    </div>
  `}const Pr=["trace","debug","info","warn","error","fatal"];function tb(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function nb(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function sb(e){const t=e.filterText.trim().toLowerCase(),n=Pr.some(a=>!e.levelFilters[a]),s=e.entries.filter(a=>a.level&&!e.levelFilters[a.level]?!1:nb(a,t)),i=t||n?"filtered":"visible";return r`
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
        ${Pr.map(a=>r`
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

      ${e.file?r`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:f}
      ${e.truncated?r`
              <div class="callout" style="margin-top: 10px">Log output truncated; showing latest chunk.</div>
            `:f}
      ${e.error?r`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:f}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${s.length===0?r`
                <div class="muted" style="padding: 12px">No log entries.</div>
              `:s.map(a=>r`
                <div class="log-row">
                  <div class="log-time mono">${tb(a.time)}</div>
                  <div class="log-level ${a.level??""}">${a.level??""}</div>
                  <div class="log-subsystem mono">${a.subsystem??""}</div>
                  <div class="log-message mono">${a.message??a.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}function ib(e){return r`
    <div class="mission-iframe-container">
      <iframe
        src="/ops/"
        class="mission-iframe"
        title="Mission Control"
        allow="clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  `}const ab=/(^~\/|^\/|^\.\.?\/|[\\/])/;function Dr(e){const t=e.trim();if(!t)return null;const n=t.replace(/^["']|["']$/g,"").trim();return!n||/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/[*?<>|]/.test(n)||n.includes("\0")||n.includes(`
`)||n.includes("\r")||!ab.test(n)&&!/\.[a-z0-9]{1,12}$/i.test(n)?null:n}function Uc(e){const t=e instanceof Element?e:e instanceof Node?e.parentElement:null;if(!t)return null;const n=t.closest("a");if(n){const i=n.getAttribute("href")??"";let a=i;if(i.includes("%"))try{a=decodeURIComponent(i)}catch{a=i}return Dr(a)}const s=t.closest("code");return!s||s.closest("pre")?null:Dr(s.textContent??"")}function ob(e){return e.includes(`
`)&&e.indexOf(`
`)<e.length-1?e:e.replace(/\\n/g,`
`)}function rb(e){const t=new Date(e),s=new Date().getTime()-t.getTime(),i=Math.floor(s/(1e3*60));if(i<1)return"Just now";if(i<60)return`${i}m ago`;const a=Math.floor(i/60);return a<24?`${a}h ago`:t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}function lb(e){const t="VAULT",n=encodeURIComponent(`01-Daily/${e}`);return`obsidian://open?vault=${t}&file=${n}`}let rn=null,Ot=null;function cb(e,t,n=1500){rn&&clearTimeout(rn),rn=setTimeout(()=>{e!==Ot&&(Ot=e,t(e))},n)}function db(e,t){rn&&clearTimeout(rn),e!==Ot&&(Ot=e,t(e))}let ri=0;function ub(e){const{data:t,loading:n,error:s,onRefresh:i,onOpenInObsidian:a,onSaveBrief:o,onOpenFile:l,editing:c,onEditStart:u,onEditEnd:p}=e;if(n)return r`
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
            ${i?r`<button class="retry-button" @click=${i}>Retry</button>`:f}
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
            <span class="empty-hint">Brief compiles at 5:00 AM</span>
          </div>
        </div>
      </div>
    `;Ot===null&&(Ot=t.content);const h=k=>{const $=Uc(k.target);if($&&l){k.preventDefault(),l($);return}const S=k.currentTarget;ri=S.scrollTop,u?.(),setTimeout(()=>{const x=S.closest(".brief-editor")??S.parentElement,L=x?.querySelector(".brief-content");L&&(L.scrollTop=ri);const C=x?.querySelector(".brief-editor-textarea");C&&(C.style.height="auto",C.style.height=`${C.scrollHeight}px`,C.focus())},0)},g=k=>{const $=k.target;o&&cb($.value,o)},d=k=>{const $=k.target,S=$.closest(".brief-content");S&&(ri=S.scrollTop),o&&db($.value,o),p?.()},m=()=>c?r`
        <div class="brief-content brief-content--edit">
          <textarea
            class="brief-editor-textarea"
            .value=${t.content}
            @input=${g}
            @blur=${d}
            spellcheck="false"
          ></textarea>
        </div>
      `:r`
      <div class="brief-content brief-content--read" @click=${h}>
        <div class="brief-rendered">
          ${je(ce(ob(t.content)))}
        </div>
      </div>
    `;return r`
    <div class="my-day-card brief-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83D\uDCCA</span>
          <span>DAILY BRIEF</span>
        </div>
        <div class="brief-header-actions">
          <span class="brief-updated">${rb(t.updatedAt)}</span>
          ${a?r`
                <a
                  href="${lb(t.date)}"
                  class="brief-obsidian-link"
                  title="Open in Obsidian"
                  @click=${k=>{k.preventDefault(),a()}}
                >
                  <span class="obsidian-icon">\uD83D\uDCD3</span>
                </a>
              `:f}
          ${i?r`
                <button class="brief-refresh-btn" @click=${i} title="Refresh">
                  \uD83D\uDD04
                </button>
              `:f}
        </div>
      </div>

      <div class="my-day-card-content">
        ${m()}
      </div>
    </div>
  `}function pb(e){return e===new Date().toISOString().split("T")[0]}function hb(e){const t=new Date(e+"T12:00:00");return fb(t)}function fb(e){const t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],n=["January","February","March","April","May","June","July","August","September","October","November","December"],s=t[e.getDay()],i=n[e.getMonth()],a=e.getDate();return`${s}, ${i} ${a}`}function gb(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime()))return"";const s=new Date().getTime()-t.getTime(),i=Math.floor(s/(1e3*60));if(i<1)return"Just now";if(i<60)return`${i}m ago`;const a=Math.floor(i/60);return a<24?`${a}h ago`:t.toLocaleString()}function mb(e){if(!e)return"";const t=e.split("/");return t[t.length-1]||e}function vb(e){const t=new Date().toISOString().split("T")[0],n=e.selectedDate??t,s=pb(n),i=hb(n),a=e.viewMode??"my-day",o=e.agentLog??null;if(e.loading)return r`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading your day...</span>
        </div>
      </div>
    `;if(e.error)return r`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${e.error}</span>
          ${e.onRefresh?r`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:null}
        </div>
      </div>
    `;const l={connected:e.connected,data:e.dailyBrief??null,loading:e.dailyBriefLoading,error:e.dailyBriefError,onRefresh:e.onBriefRefresh,onOpenInObsidian:e.onBriefOpenInObsidian,onSaveBrief:e.onBriefSave,onOpenFile:e.onOpenFile,editing:e.briefEditing,onEditStart:e.onBriefEditStart,onEditEnd:e.onBriefEditEnd},c=u=>{if(!e.onOpenFile)return;const p=Uc(u.target);p&&(u.preventDefault(),e.onOpenFile(p))};return r`
    <div class="my-day-container">
      <!-- Header: Title + Date Nav + View Toggle -->
      <div class="my-day-header">
        <div class="my-day-header-left">
          <h1 class="my-day-title">Today</h1>
          <div class="my-day-header-nav-row">
            <div class="today-date-nav">
              ${e.onDatePrev?r`<button class="today-date-btn" @click=${e.onDatePrev} title="Previous day">‹</button>`:f}
              <span class="today-date-label ${s?"":"past-date"}">${i}</span>
              ${e.onDateNext?r`<button class="today-date-btn" @click=${e.onDateNext} title="Next day">›</button>`:f}
              ${!s&&e.onDateToday?r`<button class="today-date-today-btn" @click=${e.onDateToday}>Today</button>`:f}
            </div>
            <div class="today-view-toggle">
              <button
                class="${a==="my-day"?"active":""}"
                @click=${()=>e.onViewModeChange?.("my-day")}
              >My Day</button>
              <button
                class="${a==="agent-log"?"active":""}"
                @click=${()=>e.onViewModeChange?.("agent-log")}
              >Agent Log</button>
            </div>
          </div>
        </div>
        <div class="my-day-header-right">
          ${e.onRefresh?r`<button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh">
                ↻
              </button>`:null}
        </div>
      </div>

      <!-- Content: Brief or Agent Log -->
      <div class="today-content">
        ${a==="my-day"?ub(l):r`
                <div class="my-day-card agent-log-section brief-editor">
                  <div class="my-day-card-header">
                    <div class="my-day-card-title">
                      <span class="my-day-card-icon">⚡</span>
                      <span>AGENT LOG</span>
                    </div>
                    <div class="agent-log-header-actions">
                      ${o?.updatedAt?r`<span class="brief-updated">${gb(o.updatedAt)}</span>`:f}
                      ${o?.sourcePath?r`<span class="agent-log-file" title=${o.sourcePath}>
                              ${mb(o.sourcePath)}
                            </span>`:f}
                      ${e.onAgentLogRefresh?r`<button
                              class="brief-refresh-btn agent-log-refresh-btn"
                              @click=${e.onAgentLogRefresh}
                              title="Refresh agent log"
                            >
                              ↻
                            </button>`:f}
                    </div>
                  </div>
                  <div class="my-day-card-content agent-log-content">
                    ${e.agentLogLoading?r`
                            <div class="brief-loading">
                              <div class="spinner"></div>
                              <span>Loading agent day...</span>
                            </div>
                          `:e.agentLogError?r`
                              <div class="brief-error">
                                <span class="error-icon">⚠️</span>
                                <span>${e.agentLogError}</span>
                              </div>
                            `:o?.content?.trim()?r`
                                <div
                                  class="brief-content brief-content--read agent-log-readonly"
                                  @click=${c}
                                >
                                  <div class="brief-rendered agent-log-rendered">
                                    ${je(ce(o.content))}
                                  </div>
                                </div>
                              `:r`
                                <div class="my-day-empty">
                                  No agent day entry found for ${i}. Create/update
                                  <code>AGENT-DAY.md</code> and refresh.
                                </div>
                              `}
                  </div>
                </div>
              `}
      </div>
    </div>
  `}function yb(e){const t=Ab(e),n=Eb(e);return r`
    ${Mb(n)}
    ${Ib(t)}
    ${bb(e)}
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
              `:e.nodes.map(s=>Wb(s))}
      </div>
    </section>
  `}function bb(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return r`
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
      ${e.devicesError?r`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:f}
      <div class="list" style="margin-top: 16px;">
        ${n.length>0?r`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${n.map(i=>wb(i,e))}
            `:f}
        ${s.length>0?r`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(i=>kb(i,e))}
            `:f}
        ${n.length===0&&s.length===0?r`
                <div class="muted">No paired devices.</div>
              `:f}
      </div>
    </section>
  `}function wb(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?U(e.ts):"n/a",i=e.role?.trim()?`role: ${e.role}`:"role: -",a=e.isRepair?" · repair":"",o=e.remoteIp?` · ${e.remoteIp}`:"";return r`
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
  `}function kb(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",i=`roles: ${di(e.roles)}`,a=`scopes: ${di(e.scopes)}`,o=Array.isArray(e.tokens)?e.tokens:[];return r`
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
                ${o.map(l=>$b(e.deviceId,l,t))}
              </div>
            `}
      </div>
    </div>
  `}function $b(e,t,n){const s=t.revokedAtMs?"revoked":"active",i=`scopes: ${di(t.scopes)}`,a=U(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return r`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${i} · ${a}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          Rotate
        </button>
        ${t.revokedAtMs?f:r`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e,t.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}const We="__defaults__",Nr=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],Sb=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function Ab(e){const t=e.configForm,n=Fb(e.nodes),{defaultBinding:s,agents:i}=Kb(t),a=!!t,o=e.configSaving||e.configFormMode==="raw";return{ready:a,disabled:o,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function Or(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function xb(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function _b(e){const t=e?.defaults??{};return{security:Or(t.security),ask:xb(t.ask),askFallback:Or(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function Tb(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(i=>{if(!i||typeof i!="object")return;const a=i,o=typeof a.id=="string"?a.id.trim():"";if(!o)return;const l=typeof a.name=="string"?a.name.trim():void 0,c=a.default===!0;s.push({id:o,name:l||void 0,isDefault:c})}),s}function Cb(e,t){const n=Tb(e),s=Object.keys(t?.agents??{}),i=new Map;n.forEach(o=>i.set(o.id,o)),s.forEach(o=>{i.has(o)||i.set(o,{id:o})});const a=Array.from(i.values());return a.length===0&&a.push({id:"main",isDefault:!0}),a.sort((o,l)=>{if(o.isDefault&&!l.isDefault)return-1;if(!o.isDefault&&l.isDefault)return 1;const c=o.name?.trim()?o.name:o.id,u=l.name?.trim()?l.name:l.id;return c.localeCompare(u)}),a}function Lb(e,t){return e===We?We:e&&t.some(n=>n.id===e)?e:We}function Eb(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=_b(t),i=Cb(e.configForm,t),a=Ub(e.nodes),o=e.execApprovalsTarget;let l=o==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o==="node"&&l&&!a.some(h=>h.id===l)&&(l=null);const c=Lb(e.execApprovalsSelectedAgent,i),u=c!==We?(t?.agents??{})[c]??null:null,p=Array.isArray(u?.allowlist)?u.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:c,selectedAgent:u,agents:i,allowlist:p,target:o,targetNodeId:l,targetNodes:a,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function Ib(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return r`
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
            `:f}

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
                  ${t?f:r`
                          <div class="muted">No nodes with system.run available.</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?r`
                      <div class="muted">No agents found.</div>
                    `:e.agents.map(s=>Bb(s,e))}
            </div>
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function Mb(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return r`
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

      ${Rb(e)}

      ${t?r`
            ${Pb(e)}
            ${Db(e)}
            ${e.selectedScope===We?f:Nb(e)}
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function Rb(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return r`
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
              `:f}
        </div>
      </div>
      ${e.target==="node"&&!t?r`
              <div class="muted">No nodes advertise exec approvals yet.</div>
            `:f}
    </div>
  `}function Pb(e){return r`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===We?"active":""}"
          @click=${()=>e.onSelectScope(We)}
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
  `}function Db(e){const t=e.selectedScope===We,n=e.defaults,s=e.selectedAgent??{},i=t?["defaults"]:["agents",e.selectedScope],a=typeof s.security=="string"?s.security:void 0,o=typeof s.ask=="string"?s.ask:void 0,l=typeof s.askFallback=="string"?s.askFallback:void 0,c=t?n.security:a??"__default__",u=t?n.ask:o??"__default__",p=t?n.askFallback:l??"__default__",h=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,g=h??n.autoAllowSkills,d=h==null;return r`
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
              @change=${m=>{const $=m.target.value;!t&&$==="__default__"?e.onRemove([...i,"security"]):e.onPatch([...i,"security"],$)}}
            >
              ${t?f:r`<option value="__default__" ?selected=${c==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${Nr.map(m=>r`<option
                    value=${m.value}
                    ?selected=${c===m.value}
                  >
                    ${m.label}
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
              @change=${m=>{const $=m.target.value;!t&&$==="__default__"?e.onRemove([...i,"ask"]):e.onPatch([...i,"ask"],$)}}
            >
              ${t?f:r`<option value="__default__" ?selected=${u==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${Sb.map(m=>r`<option
                    value=${m.value}
                    ?selected=${u===m.value}
                  >
                    ${m.label}
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
              @change=${m=>{const $=m.target.value;!t&&$==="__default__"?e.onRemove([...i,"askFallback"]):e.onPatch([...i,"askFallback"],$)}}
            >
              ${t?f:r`<option value="__default__" ?selected=${p==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${Nr.map(m=>r`<option
                    value=${m.value}
                    ?selected=${p===m.value}
                  >
                    ${m.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${t?"Allow skill executables listed by the Gateway.":d?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${g?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${g}
              @change=${m=>{const k=m.target;e.onPatch([...i,"autoAllowSkills"],k.checked)}}
            />
          </label>
          ${!t&&!d?r`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,"autoAllowSkills"])}
              >
                Use default
              </button>`:f}
        </div>
      </div>
    </div>
  `}function Nb(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return r`
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
            `:n.map((s,i)=>Ob(e,s,i))}
    </div>
  `}function Ob(e,t,n){const s=t.lastUsedAt?U(t.lastUsedAt):"never",i=t.lastUsedCommand?ui(t.lastUsedCommand,120):null,a=t.lastResolvedPath?ui(t.lastResolvedPath,120):null;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${i?r`<div class="list-sub mono">${i}</div>`:f}
        ${a?r`<div class="list-sub mono">${a}</div>`:f}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${t.pattern??""}
            ?disabled=${e.disabled}
            @input=${o=>{const l=o.target;e.onPatch(["agents",e.selectedScope,"allowlist",n,"pattern"],l.value)}}
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
  `}function Bb(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,i=t.nodes.length>0;return r`
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
            @change=${a=>{const l=a.target.value.trim();t.onBindAgent(e.index,l==="__default__"?null:l)}}
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
  `}function Fb(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(l=>String(l)==="system.run"))continue;const a=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!a)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():a;t.push({id:a,label:o===a?a:`${o} · ${a}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function Ub(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(l=>String(l)==="system.execApprovals.get"||String(l)==="system.execApprovals.set"))continue;const a=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!a)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():a;t.push({id:a,label:o===a?a:`${o} · ${a}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function Kb(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},i=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,a=e.agents??{},o=Array.isArray(a.list)?a.list:[];if(o.length===0)return{defaultBinding:i,agents:[t]};const l=[];return o.forEach((c,u)=>{if(!c||typeof c!="object")return;const p=c,h=typeof p.id=="string"?p.id.trim():"";if(!h)return;const g=typeof p.name=="string"?p.name.trim():void 0,d=p.default===!0,k=(p.tools??{}).exec??{},$=typeof k.node=="string"&&k.node.trim()?k.node.trim():null;l.push({id:h,name:g||void 0,index:u,isDefault:d,binding:$})}),l.length===0&&l.push(t),{defaultBinding:i,agents:l}}function Wb(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),i=Array.isArray(e.caps)?e.caps:[],a=Array.isArray(e.commands)?e.commands:[];return r`
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
  `}function Hb(e){const t=e.hello?.snapshot,n=t?.uptimeMs?pl(t.uptimeMs):"n/a",s=t?.policy?.tickIntervalMs?`${t.policy.tickIntervalMs}ms`:"n/a",i=(()=>{if(e.connected||!e.lastError)return null;const o=e.lastError.toLowerCase();if(!(o.includes("unauthorized")||o.includes("connect failed")))return null;const c=!!e.settings.token.trim(),u=!!e.password.trim();return!c&&!u?r`
        <div class="muted" style="margin-top: 8px">
          This gateway requires auth. Add a token or password, then click Connect.
          <div style="margin-top: 6px">
            <span class="mono">openclaw dashboard --no-open</span> → tokenized URL<br />
            <span class="mono">openclaw doctor --generate-gateway-token</span> → set token
          </div>
          <div style="margin-top: 6px">
            <a
              class="session-link"
              href="https://docs.openclaw.io/web/dashboard"
              target="_blank"
              rel="noreferrer"
              title="Control UI auth docs (opens in new tab)"
              >Docs: Control UI auth</a
            >
          </div>
        </div>
      `:r`
      <div class="muted" style="margin-top: 8px">
        Auth failed. Re-copy a tokenized URL with
        <span class="mono">openclaw dashboard --no-open</span>, or update the token, then click Connect.
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.io/web/dashboard"
            target="_blank"
            rel="noreferrer"
            title="Control UI auth docs (opens in new tab)"
            >Docs: Control UI auth</a
          >
        </div>
      </div>
    `})(),a=(()=>{if(e.connected||!e.lastError||(typeof window<"u"?window.isSecureContext:!0))return null;const l=e.lastError.toLowerCase();return!l.includes("secure context")&&!l.includes("device identity required")?null:r`
      <div class="muted" style="margin-top: 8px">
        This page is HTTP, so the browser blocks device identity. Use HTTPS (Tailscale Serve) or open
        <span class="mono">http://127.0.0.1:18789</span> on the gateway host.
        <div style="margin-top: 6px">
          If you must stay on HTTP, set
          <span class="mono">gateway.controlUi.allowInsecureAuth: true</span> (token-only).
        </div>
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.io/gateway/tailscale"
            target="_blank"
            rel="noreferrer"
            title="Tailscale Serve docs (opens in new tab)"
            >Docs: Tailscale Serve</a
          >
          <span class="muted"> · </span>
          <a
            class="session-link"
            href="https://docs.openclaw.io/web/control-ui#insecure-http"
            target="_blank"
            rel="noreferrer"
            title="Insecure HTTP docs (opens in new tab)"
            >Docs: Insecure HTTP</a
          >
        </div>
      </div>
    `})();return r`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">Gateway Access</div>
        <div class="card-sub">Where the dashboard connects and how it authenticates.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>WebSocket URL</span>
            <input
              .value=${e.settings.gatewayUrl}
              @input=${o=>{const l=o.target.value;e.onSettingsChange({...e.settings,gatewayUrl:l})}}
              placeholder="ws://100.x.y.z:18789"
            />
          </label>
          <label class="field">
            <span>Gateway Token</span>
            <input
              .value=${e.settings.token}
              @input=${o=>{const l=o.target.value;e.onSettingsChange({...e.settings,token:l})}}
              placeholder="CLAWDBOT_GATEWAY_TOKEN"
            />
          </label>
          <label class="field">
            <span>Password (not stored)</span>
            <input
              type="password"
              .value=${e.password}
              @input=${o=>{const l=o.target.value;e.onPasswordChange(l)}}
              placeholder="system or shared password"
            />
          </label>
          <label class="field">
            <span>Default Session Key</span>
            <input
              .value=${e.settings.sessionKey}
              @input=${o=>{const l=o.target.value;e.onSessionKeyChange(l)}}
            />
          </label>
        </div>
        <div class="row" style="margin-top: 14px;">
          <button class="btn" @click=${()=>e.onConnect()}>Connect</button>
          <button class="btn" @click=${()=>e.onRefresh()}>Refresh</button>
          <span class="muted">Click Connect to apply connection changes.</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Snapshot</div>
        <div class="card-sub">Latest gateway handshake information.</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">Status</div>
            <div class="stat-value ${e.connected?"ok":"warn"}">
              ${e.connected?"Connected":"Disconnected"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Uptime</div>
            <div class="stat-value">${n}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Tick Interval</div>
            <div class="stat-value">${s}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Last Channels Refresh</div>
            <div class="stat-value">
              ${e.lastChannelsRefresh?U(e.lastChannelsRefresh):"n/a"}
            </div>
          </div>
        </div>
        ${e.lastError?r`<div class="callout danger" style="margin-top: 14px;">
              <div>${e.lastError}</div>
              ${i??""}
              ${a??""}
            </div>`:r`
                <div class="callout" style="margin-top: 14px">
                  Use Channels to link WhatsApp, Telegram, Discord, Signal, or iMessage.
                </div>
              `}
      </div>
    </section>

    <section class="grid grid-cols-3" style="margin-top: 18px;">
      <div class="card stat-card">
        <div class="stat-label">Instances</div>
        <div class="stat-value">${e.presenceCount}</div>
        <div class="muted">Presence beacons in the last 5 minutes.</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Sessions</div>
        <div class="stat-value">${e.sessionsCount??"n/a"}</div>
        <div class="muted">Recent session keys tracked by the gateway.</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Cron</div>
        <div class="stat-value">
          ${e.cronEnabled==null?"n/a":e.cronEnabled?"Enabled":"Disabled"}
        </div>
        <div class="muted">Next wake ${Oc(e.cronNext)}</div>
      </div>
    </section>

    <section class="grid grid-cols-2" style="margin-top: 18px;">
      <div class="card">
        <div class="card-title">Updates</div>
        <div class="card-sub">Current version and available updates.</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">Version</div>
            <div class="stat-value">
              ${e.updateStatus?.version??e.hello?.server?.version??"n/a"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Status</div>
            <div class="stat-value ${e.updateStatus?.behind?"warn":"ok"}">
              ${e.updateStatus?.behind?`${e.updateStatus.behind} behind`:e.updateStatus?"Up to date":"Unknown"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Branch</div>
            <div class="stat-value">${e.updateStatus?.branch??"n/a"}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Last Checked</div>
            <div class="stat-value">
              ${e.updateLastChecked?U(e.updateLastChecked):"Never"}
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 14px;">
          <button
            class="btn"
            ?disabled=${e.updateLoading||!e.connected}
            @click=${()=>e.onCheckUpdates()}
          >
            ${e.updateLoading?"Checking...":"Check for Updates"}
          </button>
        </div>
        ${e.updateStatus?.behind?r`
              <div class="callout" style="margin-top: 14px;">
                <div>
                  <b>${e.updateStatus.behind} update${e.updateStatus.behind>1?"s":""} available</b>
                </div>
                <div class="row" style="margin-top: 10px; gap: 8px;">
                  ${e.onUpdateNow?r`<button
                          class="btn primary"
                          ?disabled=${e.updateRunning||!e.connected}
                          @click=${()=>e.onUpdateNow?.()}
                        >
                          ${e.updateRunning?"Updating...":"Update Now"}
                        </button>`:f}
                  <button
                    class="btn"
                    @click=${()=>{navigator.clipboard.writeText("./scripts/self-update.sh")}}
                    title="Copy command to clipboard"
                  >
                    Copy Command
                  </button>
                </div>
                <div class="muted" style="margin-top: 8px; font-size: 12px;">
                  Or run manually: <span class="mono">./scripts/self-update.sh</span>
                </div>
              </div>
            `:f}
        ${e.updateError?r`<div class="callout danger" style="margin-top: 14px;">
              ${e.updateError}
            </div>`:f}
      </div>

      <div class="card">
        <div class="card-title">Notes</div>
        <div class="card-sub">Quick reminders for remote control setups.</div>
        <div class="note-grid" style="margin-top: 14px;">
          <div>
            <div class="note-title">Tailscale serve</div>
            <div class="muted">
              Prefer serve mode to keep the gateway on loopback with tailnet auth.
            </div>
          </div>
          <div>
            <div class="note-title">Session hygiene</div>
            <div class="muted">Use /new or sessions.patch to reset context.</div>
          </div>
          <div>
            <div class="note-title">Cron reminders</div>
            <div class="muted">Use isolated sessions for recurring runs.</div>
          </div>
        </div>
      </div>
    </section>
  `}function zb(e,t=5){return e.filter(n=>n.lastContact).toSorted((n,s)=>{const i=new Date(n.lastContact).getTime();return new Date(s.lastContact).getTime()-i}).slice(0,t)}function jb(e){const t=new Map;for(const n of e)if(n.tags.length===0){const s=t.get("uncategorized")??[];s.push(n),t.set("uncategorized",s)}else for(const s of n.tags){const i=t.get(s)??[];i.push(n),t.set(s,i)}return t}function Kc(e){if(!e)return"";const t=new Date(e),s=new Date().getTime()-t.getTime(),i=Math.floor(s/(1e3*60*60*24));return i===0?"Today":i===1?"Yesterday":i<7?`${i}d ago`:i<30?`${Math.floor(i/7)}w ago`:`${Math.floor(i/30)}mo ago`}function Br(e,t){return r`
    <button class="people-card" @click=${t} style="cursor: pointer; width: 100%; border: none; background: none; text-align: left;">
      <div class="people-card-main">
        <span class="people-avatar">${e.emoji??"👤"}</span>
        <div class="people-card-info">
          <span class="people-name">${e.name}</span>
          ${e.company||e.role?r`<span class="people-role">${[e.role,e.company].filter(Boolean).join(" at ")}</span>`:f}
        </div>
        ${e.lastContact?r`<span class="people-last-contact">${Kc(e.lastContact)}</span>`:f}
      </div>
      ${e.tags.length>0?r`
            <div class="people-tags">
              ${e.tags.map(n=>r`<span class="people-tag">${n}</span>`)}
            </div>
          `:f}
    </button>
  `}function Vb(e,t){return r`
    <div class="my-day-card people-detail">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          ${t?r`<button class="people-back-btn" @click=${t}>← Back</button>`:f}
          <span class="my-day-card-icon">${e.emoji??"👤"}</span>
          <span>${e.name}</span>
        </div>
      </div>
      <div class="my-day-card-content">
        ${e.company||e.role?r`<div class="people-detail-row">
              <span class="people-detail-label">Role</span>
              <span>${[e.role,e.company].filter(Boolean).join(" at ")}</span>
            </div>`:f}
        ${e.email?r`<div class="people-detail-row">
              <span class="people-detail-label">Email</span>
              <a href="mailto:${e.email}">${e.email}</a>
            </div>`:f}
        ${e.phone?r`<div class="people-detail-row">
              <span class="people-detail-label">Phone</span>
              <span>${e.phone}</span>
            </div>`:f}
        ${e.birthday?r`<div class="people-detail-row">
              <span class="people-detail-label">Birthday</span>
              <span>${e.birthday}</span>
            </div>`:f}
        ${e.lastContact?r`<div class="people-detail-row">
              <span class="people-detail-label">Last Contact</span>
              <span>${Kc(e.lastContact)}</span>
            </div>`:f}
        ${e.tags.length>0?r`<div class="people-detail-row">
              <span class="people-detail-label">Tags</span>
              <div class="people-tags">
                ${e.tags.map(n=>r`<span class="people-tag">${n}</span>`)}
              </div>
            </div>`:f}
        ${e.projects&&e.projects.length>0?r`<div class="people-detail-row">
              <span class="people-detail-label">Projects</span>
              <div class="people-tags">
                ${e.projects.map(n=>r`<span class="people-tag">${n}</span>`)}
              </div>
            </div>`:f}
        ${e.notes?r`<div class="people-detail-row">
              <span class="people-detail-label">Notes</span>
              <span style="white-space: pre-wrap;">${e.notes}</span>
            </div>`:f}
      </div>
    </div>
  `}function Gb(e){const{people:t,loading:n,error:s,selectedId:i,searchQuery:a="",onRefresh:o,onSelectPerson:l,onBack:c,onSearchChange:u,onImportContacts:p}=e;if(n)return r`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading contacts...</span>
        </div>
      </div>
    `;if(s)return r`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${s}</span>
          ${o?r`<button class="retry-button" @click=${o}>Retry</button>`:f}
        </div>
      </div>
    `;if(i){const m=t.find(k=>k.id===i);if(m)return r`
        <div class="my-day-container">
          <div class="my-day-header">
            <div class="my-day-header-left">
              <h1 class="my-day-title">People</h1>
              <p class="my-day-subtitle">Contacts, relationships, and follow-up suggestions.</p>
            </div>
          </div>
          <div class="my-day-grid" style="grid-template-columns: 1fr;">
            ${Vb(m,c)}
          </div>
        </div>
      `}const h=a?t.filter(m=>{const k=a.toLowerCase();return m.name.toLowerCase().includes(k)||(m.company??"").toLowerCase().includes(k)||(m.role??"").toLowerCase().includes(k)||m.tags.some($=>$.toLowerCase().includes(k))}):t,g=jb(h),d=zb(t);return r`
    <div class="my-day-container">
      <div class="my-day-header">
        <div class="my-day-header-left">
          <h1 class="my-day-title">People</h1>
          <p class="my-day-subtitle">Contacts, relationships, and follow-up suggestions.</p>
        </div>
        <div class="my-day-header-right">
          <div class="my-day-summary-stat">
            <span class="stat-value">${t.length}</span>
            <span class="stat-label">Contact${t.length!==1?"s":""}</span>
          </div>
          ${p?r`
                <div class="my-day-summary-divider"></div>
                <div style="position: relative;">
                  <button
                    class="my-day-refresh-btn"
                    @click=${m=>{const $=m.currentTarget.nextElementSibling;$.style.display=$.style.display==="block"?"none":"block"}}
                    title="Import Contacts"
                  >
                    ⬇ Import
                  </button>
                  <div
                    style="display: none; position: absolute; top: 100%; right: 0; margin-top: 4px; background: var(--mc-bg); border: 1px solid var(--mc-border); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 160px; z-index: 1000;"
                    @click=${m=>{const k=m.currentTarget;k.style.display="none"}}
                  >
                    <button
                      @click=${()=>p("apple")}
                      style="display: block; width: 100%; padding: 10px 16px; border: none; background: none; color: var(--mc-text); text-align: left; cursor: pointer; font-size: 14px;"
                      onmouseover="this.style.background='var(--mc-hover)'"
                      onmouseout="this.style.background='none'"
                    >
                      📱 Set up Apple Contacts (via Chat)
                    </button>
                    <button
                      @click=${()=>p("google")}
                      style="display: block; width: 100%; padding: 10px 16px; border: none; background: none; color: var(--mc-text); text-align: left; cursor: pointer; font-size: 14px;"
                      onmouseover="this.style.background='var(--mc-hover)'"
                      onmouseout="this.style.background='none'"
                    >
                      🌐 Set up Google Contacts (via Chat)
                    </button>
                  </div>
                </div>
              `:f}
          ${o?r`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${o} title="Refresh">↻</button>
              `:f}
        </div>
      </div>

      ${t.length>3?r`
            <div style="margin-bottom: 12px;">
              <input
                type="text"
                placeholder="Search contacts..."
                .value=${a}
                @input=${m=>u?.(m.target.value)}
                style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--mc-border); background: var(--mc-bg); color: var(--mc-text); font-size: 14px;"
              />
            </div>
          `:f}

      <div class="my-day-grid" style="grid-template-columns: 1fr;">
        ${h.length===0?r`
              <div class="my-day-card">
                <div class="my-day-card-content">
                  <div class="my-day-empty">
                    ${t.length===0?"No contacts yet. Use chat to add people or run onboarding.":"No contacts match your search."}
                  </div>
                </div>
              </div>
            `:f}
        ${!a&&d.length>0?r`
              <div class="my-day-card">
                <div class="my-day-card-header">
                  <div class="my-day-card-title">
                    <span class="my-day-card-icon">⭐</span>
                    <span>Top Contacts</span>
                  </div>
                  <div class="my-day-card-count">${d.length}</div>
                </div>
                <div class="my-day-card-content">
                  ${d.map(m=>Br(m,()=>l?.(m.id)))}
                </div>
              </div>
            `:f}
        ${Array.from(g.entries()).map(([m,k])=>r`
            <div class="my-day-card">
              <div class="my-day-card-header">
                <div class="my-day-card-title">
                  <span class="my-day-card-icon">${m==="uncategorized"?"📋":"🏷"}</span>
                  <span>${m==="uncategorized"?"Other":m}</span>
                </div>
                <div class="my-day-card-count">${k.length}</div>
              </div>
              <div class="my-day-card-content">
                ${k.map($=>Br($,()=>l?.($.id)))}
              </div>
            </div>
          `)}
      </div>
    </div>
  `}const qb=["","off","minimal","low","medium","high"],Yb=["","off","on"],Qb=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],Jb=["","off","on","stream"];function Xb(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function Wc(e){return Xb(e)==="zai"}function Zb(e){return Wc(e)?Yb:qb}function ew(e,t){return!t||!e||e==="off"?e:"on"}function tw(e,t){return e?t&&e==="on"?"low":e:null}function nw(e){const t=e.result?.sessions??[];return r`
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

      ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:f}

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
        ${t.length===0?r`
                <div class="muted">No sessions found.</div>
              `:t.map(n=>sw(n,e.basePath,e.onPatch,e.onDelete,e.loading))}
      </div>
    </section>
  `}function sw(e,t,n,s,i){const a=e.updatedAt?U(e.updatedAt):"n/a",o=e.thinkingLevel??"",l=Wc(e.modelProvider),c=ew(o,l),u=Zb(e.modelProvider),p=e.verboseLevel??"",h=e.reasoningLevel??"",g=e.displayName??e.key,d=e.kind!=="global",m=d?`${ya("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return r`
    <div class="table-row">
      <div class="mono">${d?r`<a href=${m} class="session-link">${g}</a>`:g}</div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${i}
          placeholder="(optional)"
          @change=${k=>{const $=k.target.value.trim();n(e.key,{label:$||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${a}</div>
      <div>${oy(e)}</div>
      <div>
        <select
          .value=${c}
          ?disabled=${i}
          @change=${k=>{const $=k.target.value;n(e.key,{thinkingLevel:tw($,l)})}}
        >
          ${u.map(k=>r`<option value=${k}>${k||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${p}
          ?disabled=${i}
          @change=${k=>{const $=k.target.value;n(e.key,{verboseLevel:$||null})}}
        >
          ${Qb.map(k=>r`<option value=${k.value}>${k.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${h}
          ?disabled=${i}
          @change=${k=>{const $=k.target.value;n(e.key,{reasoningLevel:$||null})}}
        >
          ${Jb.map(k=>r`<option value=${k}>${k||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <button class="btn danger" ?disabled=${i} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function iw(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(i=>[i.name,i.description,i.source].join(" ").toLowerCase().includes(n)):t;return r`
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
            @input=${i=>e.onFilterChange(i.target.value)}
            placeholder="Search skills"
          />
        </label>
        <div class="muted">${s.length} shown</div>
      </div>

      ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:f}

      ${s.length===0?r`
              <div class="muted" style="margin-top: 16px">No skills found.</div>
            `:r`
            <div class="list" style="margin-top: 16px;">
              ${s.map(i=>aw(i,e))}
            </div>
          `}
    </section>
  `}function aw(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",i=t.messages[e.skillKey]??null,a=e.install.length>0&&e.missing.bins.length>0,o=[...e.missing.bins.map(c=>`bin:${c}`),...e.missing.env.map(c=>`env:${c}`),...e.missing.config.map(c=>`config:${c}`),...e.missing.os.map(c=>`os:${c}`)],l=[];return e.disabled&&l.push("disabled"),e.blockedByAllowlist&&l.push("blocked by allowlist"),r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${ui(e.description,140)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.source}</span>
          <span class="chip ${e.eligible?"chip-ok":"chip-warn"}">
            ${e.eligible?"eligible":"blocked"}
          </span>
          ${e.disabled?r`
                  <span class="chip chip-warn">disabled</span>
                `:f}
        </div>
        ${o.length>0?r`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${o.join(", ")}
              </div>
            `:f}
        ${l.length>0?r`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${l.join(", ")}
              </div>
            `:f}
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
              </button>`:f}
        </div>
        ${i?r`<div
              class="muted"
              style="margin-top: 8px; color: ${i.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${i.message}
            </div>`:f}
        ${e.primaryEnv?r`
              <div class="field" style="margin-top: 10px;">
                <span>API key</span>
                <input
                  type="password"
                  .value=${s}
                  @input=${c=>t.onEdit(e.skillKey,c.target.value)}
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
            `:f}
      </div>
    </div>
  `}function Fr(e){e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,200)}px`}function ow(e){return new Date(e).toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"})}function rw(e,t){return r`
    <div class="therapy-message therapy-message--${t?"user":"assistant"}">
      ${t?f:r`
              <div class="therapy-message__avatar">
                <span class="therapy-avatar-icon">\u2764\uFE0F</span>
              </div>
            `}
      <div class="therapy-message__content">
        <div class="therapy-message__header">
          ${t?f:r`
                  <span class="therapy-message__name">Therapist</span>
                `}
          <span class="therapy-message__time">${ow(e.timestamp)}</span>
          ${t?r`
                  <span class="therapy-message__name">You</span>
                `:f}
        </div>
        <div class="therapy-message__text">${e.content}</div>
      </div>
      ${t?r`
              <div class="therapy-message__avatar therapy-message__avatar--user">
                <span class="therapy-avatar-icon">\u{1F9D1}</span>
              </div>
            `:f}
    </div>
  `}function lw(e){return r`
    <div class="therapy-privacy-banner">
      <div class="therapy-privacy-banner__icon">\uD83D\uDD12</div>
      <div class="therapy-privacy-banner__text">
        <strong>This is your private space.</strong>
        Nothing here gets saved to memory or session history.
        ${e.expiresIn?r`<span class="therapy-privacy-banner__expires">
              Auto-deletes in ${e.expiresIn}
            </span>`:f}
      </div>
    </div>
  `}function cw(e){return r`
    <div class="therapy-welcome">
      <div class="therapy-welcome__icon">\u2764\uFE0F</div>
      <h2 class="therapy-welcome__title">Your Private Space</h2>
      <p class="therapy-welcome__text">
        This is a judgment-free zone for processing thoughts, feelings, and inner experiences.
      </p>
      <div class="therapy-welcome__guarantees">
        <div class="therapy-guarantee">
          <span class="therapy-guarantee__icon">\uD83D\uDD12</span>
          <span>Not saved to memory</span>
        </div>
        <div class="therapy-guarantee">
          <span class="therapy-guarantee__icon">\u23F0</span>
          <span>Auto-deletes in 24 hours</span>
        </div>
        <div class="therapy-guarantee">
          <span class="therapy-guarantee__icon">\uD83D\uDEE1\uFE0F</span>
          <span>Completely isolated</span>
        </div>
      </div>
      <button
        class="btn btn--primary therapy-welcome__start"
        type="button"
        ?disabled=${!e.connected}
        @click=${e.onStartSession}
      >
        Begin Session
      </button>
    </div>
  `}function dw(e){return r`
    <div class="therapy-chat">
      ${lw(e)}

      <div class="therapy-chat__messages">
        ${e.messages.length===0&&!e.loading?r`
                <div class="therapy-empty">
                  <p>Say whatever you need to say. I'm here to listen.</p>
                </div>
              `:e.messages.map(t=>rw(t,t.role==="user"))}
        ${e.loading?r`
                <div class="therapy-message therapy-message--assistant therapy-message--loading">
                  <div class="therapy-message__avatar">
                    <span class="therapy-avatar-icon">\u2764\uFE0F</span>
                  </div>
                  <div class="therapy-message__content">
                    <div class="therapy-typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              `:f}
      </div>

      ${e.error?r`<div class="callout danger therapy-error">${e.error}</div>`:f}

      <div class="therapy-chat__compose">
        <textarea
          class="therapy-chat__input"
          ${Ta(t=>t&&Fr(t))}
          .value=${e.inputValue}
          ?disabled=${!e.connected||e.sending}
          placeholder="Share what's on your mind..."
          @input=${t=>{const n=t.target;Fr(n),e.onInputChange(n.value)}}
          @keydown=${t=>{t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),e.inputValue.trim()&&!e.sending&&e.onSend(e.inputValue))}}
        ></textarea>
        <div class="therapy-chat__actions">
          <button
            class="therapy-chat__send"
            type="button"
            ?disabled=${!e.connected||!e.inputValue.trim()||e.sending}
            @click=${()=>{e.inputValue.trim()&&e.onSend(e.inputValue)}}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="therapy-chat__footer">
        <button
          class="btn btn--ghost btn--sm"
          type="button"
          @click=${e.onEndSession}
        >
          End Session
        </button>
        <span class="therapy-chat__expires">
          ${e.expiresIn?`Expires in ${e.expiresIn}`:""}
        </span>
      </div>
    </div>
  `}function uw(e){return r`
    <div class="therapy-container">
      ${e.sessionId?dw(e):cw(e)}
    </div>
  `}const pw=e=>{switch(e){case"success":return r`
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
      `}};function hw({toasts:e,onDismiss:t}){return e.length===0?null:r`
    <div class="toast-container">
      ${vs(e,n=>n.id,n=>r`
          <div class="toast toast--${n.type}">
            <div class="toast__icon">${pw(n.type)}</div>
            <div class="toast__message">${n.message}</div>
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
  `}const Ur={"godmode-launch":"🚀","edison-year":"👶","health-foundation":"💪","pa-systematization":"⚙️",default:"🎯"},fw={health:"Health",wealth:"Wealth",career:"Career",relationships:"Relationships",fun:"Fun",environment:"Environment",growth:"Growth",contribution:"Contribution"};function gw(e){const t=new Date(e),n=new Date,s=t.getFullYear()-n.getFullYear();return s<=0?"This year":s===1?"Next year":`${s} years`}function Hc(e){return`${Math.round(e*100)}%`}function mw(e){return Ur[e]||Ur.default}function vw(e){const t=e.progress*100;return r`
    <div class="vision-cda-section">
      <div class="vision-cda-label">CHIEF DEFINITE AIM</div>
      <blockquote class="vision-cda-statement">"${e.statement}"</blockquote>
      <div class="vision-cda-meta">
        <div class="vision-cda-deadline">
          <span class="meta-icon">📅</span>
          <span class="meta-value">${e.deadline}</span>
          <span class="meta-label">(${gw(e.deadline)})</span>
        </div>
        <div class="vision-cda-progress">
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${t}%"></div>
          </div>
          <span class="progress-label">${Hc(e.progress)} progress</span>
        </div>
      </div>
    </div>
  `}function yw(e){return e?r`
    <div class="vision-identity-section">
      <div class="vision-section-label">TODAY'S IDENTITY</div>
      <div class="vision-identity-card">
        <span class="identity-icon">💎</span>
        <blockquote class="identity-statement">"${e}"</blockquote>
      </div>
    </div>
  `:null}function bw(e){return!e||e.length===0?r`
      <div class="vision-themes-section">
        <div class="vision-section-label">2026 THEMES</div>
        <div class="vision-empty-state">No themes defined yet.</div>
      </div>
    `:r`
    <div class="vision-themes-section">
      <div class="vision-section-label">2026 THEMES</div>
      <div class="vision-themes-grid">
        ${e.map(t=>{const n=t.progress*100;return r`
            <div class="vision-theme-card">
              <div class="theme-card-header">
                <span class="theme-icon">${mw(t.id)}</span>
                <span class="theme-title">${t.theme}</span>
              </div>
              <p class="theme-description">${t.description}</p>
              <div class="theme-progress">
                <div class="progress-bar-container small">
                  <div class="progress-bar-fill" style="width: ${n}%"></div>
                </div>
                <span class="progress-label">${Hc(t.progress)}</span>
              </div>
              ${t.wheelSpokes&&t.wheelSpokes.length>0?r`
                    <div class="theme-spokes">
                      ${t.wheelSpokes.map(s=>r`
                          <span class="theme-spoke-badge">${fw[s]||s}</span>
                        `)}
                    </div>
                  `:null}
              ${t.keyResults&&t.keyResults.length>0?r`
                    <div class="theme-key-results">
                      ${t.keyResults.map(s=>(s.current!==null&&s.current/s.target*100,r`
                          <div class="key-result-item">
                            <span class="kr-text">${s.kr}</span>
                            <span class="kr-progress">
                              ${s.current!==null?s.current:"—"} / ${s.target}
                            </span>
                          </div>
                        `))}
                    </div>
                  `:null}
            </div>
          `})}
      </div>
    </div>
  `}function ww(e){return!e||e.length===0?null:r`
    <div class="vision-values-section">
      <div class="vision-section-label">VALUES HIERARCHY</div>
      <div class="vision-values-list">
        ${e.map((t,n)=>r`
            <div class="vision-value-item">
              <span class="value-rank">${n+1}</span>
              <span class="value-text">${t}</span>
            </div>
          `)}
      </div>
    </div>
  `}function kw(e){return!e||e.length===0?null:r`
    <div class="vision-antigoals-section">
      <div class="vision-section-label">WHAT I'M NOT CHASING</div>
      <div class="vision-antigoals-list">
        ${e.map(t=>r`
            <div class="vision-antigoal-item">
              <span class="antigoal-icon">🚫</span>
              <span class="antigoal-text">${t}</span>
            </div>
          `)}
      </div>
    </div>
  `}function Kr(e){if(e.loading)return r`
      <div class="vision-container">
        <div class="vision-loading">
          <div class="spinner"></div>
          <span>Loading Vision Board...</span>
        </div>
      </div>
    `;if(e.error)return r`
      <div class="vision-container">
        <div class="vision-error">
          <span class="error-icon">⚠️</span>
          <span>${e.error}</span>
          ${e.onRefresh?r`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:null}
        </div>
      </div>
    `;if(!e.data)return r`
      <div class="vision-container">
        <div class="vision-empty">
          <span class="empty-icon">⭐</span>
          <span>No vision board yet. Define your Chief Definite Aim!</span>
          ${e.onRefresh?r`<button class="primary-button" @click=${e.onRefresh}>Load Data</button>`:null}
        </div>
      </div>
    `;const{data:t,identityToday:n}=e;return r`
    <div class="vision-container">
      <!-- Header -->
      <div class="vision-header">
        <div class="vision-header-left">
          <h1 class="vision-title">Vision Board</h1>
          <p class="vision-subtitle">
            Your Chief Definite Aim, annual themes, values, and identity statements.
          </p>
        </div>
        <div class="vision-header-right">
          <div class="vision-status ${e.connected?"online":"offline"}">
            <span class="status-indicator status-${e.connected?"working":"idle"}"></span>
            <span class="status-label">${e.connected?"ONLINE":"OFFLINE"}</span>
          </div>
          ${e.onUpdateViaChat?r`<button class="goals-chat-btn" @click=${e.onUpdateViaChat} title="Update via Chat">
                Update via Chat
              </button>`:null}
          ${e.onRefresh?r`<button class="vision-refresh-btn" @click=${e.onRefresh} title="Refresh">
                🔄
              </button>`:null}
        </div>
      </div>

      <!-- Chief Definite Aim -->
      ${vw(t.chiefDefiniteAim)}

      <!-- Today's Identity (rotated daily) -->
      ${yw(n)}

      <!-- Annual Themes -->
      ${bw(t.annualThemes)}

      <!-- Two-column layout for Values and Anti-Goals -->
      <div class="vision-bottom-grid">
        ${ww(t.values)} ${kw(t.antiGoals)}
      </div>
    </div>
  `}const Oe=["health","wealth","career","relationships","fun","environment","growth","contribution"],Bn={health:"Health",wealth:"Wealth",career:"Career",relationships:"Relationships",fun:"Fun",environment:"Environment",growth:"Growth",contribution:"Contribution"},zc={health:"💪",wealth:"💰",career:"🚀",relationships:"❤️",fun:"🎉",environment:"🏠",growth:"📚",contribution:"🤝"};function $w(e){return new Date(e).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}function Sw(e){switch(e){case"up":return"↑";case"down":return"↓";case"stable":return"→"}}function Aw(e){switch(e){case"up":return"trend-up";case"down":return"trend-down";case"stable":return"trend-stable"}}function xw(e){return e<=4?"score-low":e<=6?"score-medium":"score-high"}function _w(e){const i=2*Math.PI/Oe.length,a=Oe.map((l,c)=>{const u=c*i-Math.PI/2,p=(e[l]?.current??5)/10,h=150+Math.cos(u)*120*p,g=150+Math.sin(u)*120*p;return`${h},${g}`}).join(" "),o=Oe.map((l,c)=>{const u=c*i-Math.PI/2,p=(e[l]?.target??8)/10,h=150+Math.cos(u)*120*p,g=150+Math.sin(u)*120*p;return`${h},${g}`}).join(" ");return r`
    <div class="wheel-chart-container">
      <svg viewBox="0 0 300 300" class="wheel-chart">
        <!-- Grid circles -->
        ${[2,4,6,8,10].map(l=>xn`
            <circle
              cx="${150}"
              cy="${150}"
              r="${120*l/10}"
              fill="none"
              stroke="var(--border)"
              stroke-opacity="0.3"
              stroke-dasharray="${l===10?"none":"2,2"}"
            />
          `)}

        <!-- Spoke lines -->
        ${Oe.map((l,c)=>{const u=c*i-Math.PI/2,p=150+Math.cos(u)*120,h=150+Math.sin(u)*120;return xn`
            <line
              x1="${150}"
              y1="${150}"
              x2="${p}"
              y2="${h}"
              stroke="var(--border)"
              stroke-opacity="0.5"
            />
          `})}

        <!-- Target polygon (dashed) -->
        <polygon
          points="${o}"
          fill="none"
          stroke="var(--text-muted)"
          stroke-width="1.5"
          stroke-dasharray="4,4"
          stroke-opacity="0.5"
        />

        <!-- Current scores polygon -->
        <polygon
          points="${a}"
          fill="var(--accent)"
          fill-opacity="0.25"
          stroke="var(--accent)"
          stroke-width="2.5"
        />

        <!-- Score dots -->
        ${Oe.map((l,c)=>{const u=c*i-Math.PI/2,p=(e[l]?.current??5)/10,h=150+Math.cos(u)*120*p,g=150+Math.sin(u)*120*p;return xn`
            <circle
              cx="${h}"
              cy="${g}"
              r="5"
              fill="var(--accent)"
              stroke="var(--bg)"
              stroke-width="2"
            />
          `})}

        <!-- Spoke labels -->
        ${Oe.map((l,c)=>{const u=c*i-Math.PI/2,p=145,h=150+Math.cos(u)*p,g=150+Math.sin(u)*p,d=e[l]?.current??5;return xn`
            <text
              x="${h}"
              y="${g}"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="var(--text)"
              font-size="11"
              font-weight="500"
            >
              ${zc[l]} ${d}
            </text>
          `})}
      </svg>
    </div>
  `}function Tw(e,t,n){return r`
    <div class="wheel-spokes-grid">
      ${Oe.map(s=>{const i=e[s];if(!i)return null;const o=n[s]?.current??i.current,l=i.target-o;return r`
          <div class="wheel-spoke-card ${xw(o)}">
            <div class="spoke-card-header">
              <span class="spoke-icon">${zc[s]}</span>
              <span class="spoke-name">${Bn[s]}</span>
              <span class="spoke-trend ${Aw(i.trend)}">
                ${Sw(i.trend)}
              </span>
            </div>
            <div class="spoke-card-body">
              ${t?r`
                    <div class="spoke-edit-row">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        .value="${String(o)}"
                        class="spoke-slider"
                        data-spoke="${s}"
                      />
                      <span class="spoke-value-display">${o}</span>
                    </div>
                  `:r`
                    <div class="spoke-scores">
                      <div class="spoke-current">
                        <span class="spoke-score-value">${i.current}</span>
                        <span class="spoke-score-label">current</span>
                      </div>
                      <div class="spoke-target">
                        <span class="spoke-score-value">${i.target}</span>
                        <span class="spoke-score-label">target</span>
                      </div>
                      ${l>0?r`
                            <div class="spoke-gap">
                              <span class="spoke-gap-value">-${l}</span>
                              <span class="spoke-score-label">gap</span>
                            </div>
                          `:null}
                    </div>
                  `}
            </div>
          </div>
        `})}
    </div>
  `}function Wr(e){if(e.loading)return r`
      <div class="wheel-container">
        <div class="wheel-loading">
          <div class="spinner"></div>
          <span>Loading Wheel of Life...</span>
        </div>
      </div>
    `;if(e.error)return r`
      <div class="wheel-container">
        <div class="wheel-error">
          <span class="error-icon">⚠️</span>
          <span>${e.error}</span>
          ${e.onRefresh?r`<button class="retry-button" @click=${e.onRefresh}>Retry</button>`:null}
        </div>
      </div>
    `;if(!e.data)return r`
      <div class="wheel-container">
        <div class="wheel-empty">
          <span class="empty-icon">🎯</span>
          <span>No wheel data yet. Start tracking your life balance!</span>
          ${e.onRefresh?r`<button class="primary-button" @click=${e.onRefresh}>Load Data</button>`:null}
        </div>
      </div>
    `;const{data:t,editMode:n=!1}=e,s={},i=Oe.filter(a=>(t.scores[a]?.current??5)<=4);return r`
    <div class="wheel-container">
      <!-- Header -->
      <div class="wheel-header">
        <div class="wheel-header-left">
          <h1 class="wheel-title">Wheel of Life</h1>
          <p class="wheel-subtitle">
            Track balance across 8 life dimensions with scores, targets, and trends.
          </p>
        </div>
        <div class="wheel-header-right">
          <div class="wheel-summary-stat">
            <span class="summary-value">${t.overallBalance.toFixed(1)}</span>
            <span class="summary-label">Balance</span>
          </div>
          <div class="wheel-summary-divider"></div>
          <div class="wheel-summary-stat">
            <span class="summary-value">${i.length}</span>
            <span class="summary-label">Alerts</span>
          </div>
          <div class="wheel-summary-divider"></div>
          <div class="wheel-status ${e.connected?"online":"offline"}">
            <span class="status-indicator status-${e.connected?"working":"idle"}"></span>
            <span class="status-label">${e.connected?"ONLINE":"OFFLINE"}</span>
          </div>
          ${e.onUpdateViaChat&&!n?r`<button class="goals-chat-btn" @click=${e.onUpdateViaChat} title="Update via Chat">
                Update via Chat
              </button>`:null}
          ${e.onRefresh&&!n?r`<button class="wheel-refresh-btn" @click=${e.onRefresh} title="Refresh">
                🔄
              </button>`:null}
          ${e.onEdit&&!n?r`<button class="wheel-edit-btn" @click=${e.onEdit} title="Edit scores">
                ✏️ Update
              </button>`:null}
          ${n&&e.onSave&&e.onCancel?r`
                <button class="wheel-save-btn" @click=${()=>e.onSave(s)}>
                  💾 Save
                </button>
                <button class="wheel-cancel-btn" @click=${e.onCancel}>Cancel</button>
              `:null}
        </div>
      </div>

      <!-- Date badge -->
      <div class="wheel-date-badge">As of ${$w(t.asOf)}</div>

      <!-- Alerts -->
      ${i.length>0?r`
            <div class="wheel-alerts">
              <div class="wheel-alert warning">
                <span class="alert-icon">⚠️</span>
                <span class="alert-text">
                  <strong>Attention needed:</strong>
                  ${i.map(a=>Bn[a]).join(", ")}
                  ${i.length===1?"is":"are"} below 5
                </span>
              </div>
            </div>
          `:null}

      <!-- Main content grid -->
      <div class="wheel-content">
        <!-- Radar chart -->
        <div class="wheel-chart-section">${_w(t.scores)}</div>

        <!-- Spoke cards -->
        <div class="wheel-spokes-section">
          ${Tw(t.scores,n,s)}
        </div>
      </div>

      <!-- Insights -->
      <div class="wheel-insights">
        <div class="wheel-insight">
          <span class="insight-icon">📉</span>
          <span class="insight-label">Lowest</span>
          <span class="insight-value">${Bn[t.lowestSpoke]??"—"}</span>
        </div>
        <div class="wheel-insight">
          <span class="insight-icon">🎯</span>
          <span class="insight-label">Biggest Gap</span>
          <span class="insight-value">${Bn[t.biggestGap]??"—"}</span>
        </div>
      </div>
    </div>
  `}const Cw=20;function Lw(e){switch(e.split(".").pop()?.toLowerCase()){case"md":return"📝";case"html":return"🌐";case"json":case"yaml":case"yml":case"toml":return"⚙️";case"ts":case"js":case"py":case"sh":case"rs":case"go":return"💻";case"css":return"🎨";default:return"📄"}}function Ew(e){const t=[];function n(s){for(const i of s){if(t.length>=Cw)return;const a=i;a.type==="file"?t.push(a):a.type==="directory"&&a.children&&n(a.children)}}return n(e),t}function Iw(e,t){if(!e||e.length===0)return f;const n=Ew(e);return n.length===0?f:r`
    <div class="work-file-list">
      ${n.map(s=>r`
        <button
          class="work-file-item"
          @click=${i=>{i.stopPropagation(),s.path&&t&&t(s.path)}}
        >
          <span class="work-file-icon">${Lw(s.name)}</span>
          <span class="work-file-name">${s.name}</span>
          ${s.size!=null?r`<span class="work-file-meta">${(s.size/1024).toFixed(1)}KB</span>`:f}
        </button>
      `)}
      ${e.length>n.length?r`<div class="work-file-overflow">+${e.length-n.length} more files</div>`:f}
    </div>
  `}function Mw(e,t,n,s,i,a,o,l){return r`
    <div class="my-day-card work-project ${t?"expanded":""}">
      <button class="my-day-card-header" @click=${i} style="cursor: pointer; width: 100%; border: none; background: none; text-align: left;">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">${e.emoji}</span>
          <span>${e.name}</span>
          ${e.folder?r`<span class="work-folder-badge">${e.folder}</span>`:f}
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 10px; color: var(--mc-text-muted);">${t?"▼":"▶"}</span>
        </div>
      </button>
      ${t?r`
            <div class="my-day-card-content">
              ${s?r`
                      <div class="work-detail-loading">
                        <div class="spinner" style="width: 16px; height: 16px"></div>
                        Loading...
                      </div>
                    `:f}
              ${n.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Files</div>
                      ${Iw(n,o)}
                    </div>
                  `:e.outputs.length>0?r`
                      <div class="work-section">
                        <div class="work-section-label">Files & Outputs</div>
                        ${Rw(e.outputs)}
                      </div>
                    `:f}
              ${e.people.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Team</div>
                      <div class="work-people">
                        ${e.people.map(c=>r`
                            <button
                              class="work-person-chip"
                              @click=${u=>{u.stopPropagation(),a?.(c)}}
                            >
                              ${c}
                            </button>
                          `)}
                      </div>
                    </div>
                  `:f}
              ${e.skills.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Skills</div>
                      <div class="work-skills">
                        ${e.skills.map(c=>r`
                            <button
                              class="work-skill-chip"
                              @click=${u=>{u.stopPropagation(),l?.(c,e.name)}}
                            >
                              ${c}
                            </button>`)}
                      </div>
                    </div>
                  `:f}
              ${e.automations&&e.automations.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Automations</div>
                      <div class="work-skills">
                        ${e.automations.map(c=>r`<span class="work-skill-chip">${c}</span>`)}
                      </div>
                    </div>
                  `:f}
            </div>
          `:f}
    </div>
  `}function Rw(e){const t=e.reduce((s,i)=>{const a=i.type||"other";return s[a]||(s[a]=[]),s[a].push(i),s},{}),n={document:"📄",template:"📋",report:"📊",presentation:"📽️",spreadsheet:"📈",code:"💻",image:"🖼️",video:"🎬",audio:"🎵",archive:"📦",pdf:"📕",markdown:"📝"};return r`
    <div class="work-file-tree">
      ${Object.entries(t).map(([s,i])=>r`
        <div class="work-folder">
          <span class="work-folder-icon">📁</span>
          <span class="work-folder-name">${s}</span>
          <span class="work-file-meta">${i.length} ${i.length===1?"item":"items"}</span>
        </div>
        ${i.map(a=>r`
          <div class="work-file type-${s}">
            <span class="work-file-icon">${n[s.toLowerCase()]||"📄"}</span>
            ${a.url?r`<a href="${a.url}" target="_blank" rel="noopener noreferrer" class="work-file-name">${a.title}</a>`:r`<span class="work-file-name">${a.title}</span>`}
          </div>
        `)}
      `)}
    </div>
  `}function Pw(e){const{projects:t,loading:n,error:s,expandedProjects:i=new Set,projectFiles:a={},detailLoading:o=new Set,onRefresh:l,onToggleProject:c,onPersonClick:u,onFileClick:p,onSkillClick:h}=e;if(n)return r`
      <div class="my-day-container">
        <div class="my-day-loading">
          <div class="spinner"></div>
          <span>Loading workspace...</span>
        </div>
      </div>
    `;if(s)return r`
      <div class="my-day-container">
        <div class="my-day-error">
          <span class="error-icon">⚠</span>
          <span>${s}</span>
          ${l?r`<button class="retry-button" @click=${l}>Retry</button>`:f}
        </div>
      </div>
    `;const g=t.filter(m=>m.status==="active"),d=t.filter(m=>m.status==="archived");return r`
    <div class="my-day-container">
      <div class="my-day-header">
        <div class="my-day-header-left">
          <h1 class="my-day-title">Work</h1>
          <p class="my-day-subtitle">Your projects and workspaces.</p>
        </div>
        <div class="my-day-header-right">
          <div class="my-day-summary-stat">
            <span class="summary-value">${g.length}</span>
            <span class="summary-label">Projects</span>
          </div>
          ${l?r`
                <div class="my-day-summary-divider"></div>
                <button class="my-day-refresh-btn" @click=${l} title="Refresh">↻</button>
              `:f}
        </div>
      </div>

      <!-- Workspaces Section -->
      <div class="work-workspaces-section">
        <h2 class="work-section-title">Workspaces</h2>
        <div class="my-day-grid" style="grid-template-columns: 1fr;">
          ${g.length===0&&d.length===0?r`
                  <div class="my-day-card">
                    <div class="my-day-card-content">
                      <div class="my-day-empty">
                        No workspaces yet. Ask in chat: "Create a workspace for [project name]"
                      </div>
                    </div>
                  </div>
                `:f}
          ${g.map(m=>Mw(m,i.has(m.id),a[m.id]??[],o.has(m.id),()=>c?.(m.id),u,p,h))}
          ${d.length>0?r`
                <div style="margin-top: 16px; color: var(--mc-text-muted); font-size: 12px;">
                  ${d.length} archived project${d.length!==1?"s":""}
                </div>
              `:f}
        </div>
      </div>
    </div>
  `}function Dw(e){return!Number.isFinite(e)||e<=0?"0 B":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function Nw(e){switch(e){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function Hr(e){return e==="running"?"ws-session-dot ws-session-dot--running":e==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function Ow(e,t){return e.trim()?t.toLowerCase().includes(e.trim().toLowerCase()):!0}function zr(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.name.toLowerCase().includes(n)||s.path.toLowerCase().includes(n)||s.type.toLowerCase().includes(n)||(s.searchText??"").toLowerCase().includes(n))}function jr(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.title.toLowerCase().includes(n)||s.key.toLowerCase().includes(n))}function Bw(e,t){return r`
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
          <span>${U(e.lastUpdated.getTime())}</span>
        </div>
      </div>
    </button>
  `}function Vr(e){const{workspaceId:t,entry:n,pinned:s,onOpen:i,onPinToggle:a}=e;return r`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(n)}>
        <span class="ws-list-icon">${Nw(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${Dw(n.size)}</span>
        <span class="ws-list-meta">${U(n.modified.getTime())}</span>
      </button>
      <button
        class="ws-pin-btn ${s?"active":""}"
        @click=${()=>a?.(t,n.path,s)}
        title=${s?"Unpin":"Pin"}
      >
        ${s?"Unpin":"Pin"}
      </button>
    </div>
  `}function Fw(e){const{workspace:t,itemSearchQuery:n,onItemSearch:s,onBack:i,onItemClick:a,onSessionClick:o,onPinToggle:l,onPinSessionToggle:c}=e,u=zr(n,t.pinned).toSorted((S,x)=>x.modified.getTime()-S.modified.getTime()),p=jr(n,t.pinnedSessions),h=zr(n,t.outputs).filter(S=>!t.pinned.some(x=>x.path===S.path)),g=jr(n,t.sessions),d=new Set(t.pinnedSessions.map(S=>S.key)),m=n.trim().length>0,k=u.length>0||p.length>0,$=g.length>0||t.sessions.length===0||m;return r`
    <div class="workspaces-container">
      <div class="workspaces-header">
        <div class="workspaces-title">
          <button class="workspace-back-btn" @click=${i}>←</button>
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
            @input=${S=>s?.(S.target.value)}
          />
        </div>
      </div>

      <div class="workspace-content">
        ${k?r`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${u.length+p.length}</span>
                  </div>
                  <div class="ws-list">
                    ${p.map(S=>r`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>o?.(S)}>
                            <span class=${Hr(S.status)}></span>
                            <span class="ws-list-title">${S.title}</span>
                            <span class="ws-list-meta">${U(S.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>c?.(t.id,S.key,!0)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${u.map(S=>Vr({workspaceId:t.id,entry:S,pinned:!0,onOpen:a,onPinToggle:l}))}
                  </div>
                </section>
              `:f}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${h.length}</span>
          </div>
          <div class="ws-list ws-list--scroll">
            ${h.length===0?r`
                    <div class="ws-empty">No artifacts</div>
                  `:h.map(S=>Vr({workspaceId:t.id,entry:S,pinned:!1,onOpen:a,onPinToggle:l}))}
          </div>
        </section>

        ${$?r`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${g.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${g.length===0?r`
                            <div class="ws-empty">No sessions</div>
                          `:g.map(S=>r`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>o?.(S)}>
                                  <span class=${Hr(S.status)}></span>
                                  <span class="ws-list-title">${S.title}</span>
                                  <span class="ws-list-meta">${U(S.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${d.has(S.key)?"active":""}"
                                  @click=${()=>c?.(t.id,S.key,d.has(S.key))}
                                  title=${d.has(S.key)?"Unpin":"Pin"}
                                >
                                  ${d.has(S.key)?"Unpin":"Pin"}
                                </button>
                              </div>
                            `)}
                  </div>
                </section>
              `:f}
      </div>
    </div>
  `}function Uw(e){const{connected:t,workspaces:n,selectedWorkspace:s,searchQuery:i,itemSearchQuery:a,loading:o,createLoading:l,error:c,onSearch:u,onItemSearch:p,onSelectWorkspace:h,onBack:g,onItemClick:d,onSessionClick:m,onPinToggle:k,onPinSessionToggle:$,onCreateWorkspace:S}=e,x=n.filter(L=>Ow(i,`${L.name} ${L.path} ${L.type}`));return s?Fw({workspace:s,itemSearchQuery:a??"",onItemSearch:p,onBack:g,onItemClick:d,onSessionClick:m,onPinToggle:k,onPinSessionToggle:$}):r`
    <div class="workspaces-container">
      <div class="workspaces-header">
        <div class="workspaces-header-left">
          <h1 class="workspaces-title-text">Workspaces</h1>
          <p class="workspaces-subtitle">Projects, clients, and personal operating context.</p>
        </div>
        <div class="workspaces-header-right">
          <form
            class="workspaces-create-form"
            @submit=${async L=>{if(L.preventDefault(),l||!S)return;const C=L.currentTarget,E=new FormData(C),P=E.get("name"),R=(typeof P=="string"?P:"").trim();if(!R)return;const oe=E.get("type"),M=(typeof oe=="string"?oe:"project").trim().toLowerCase(),B=M==="team"||M==="personal"?M:"project",N=E.get("path"),z=(typeof N=="string"?N:"").trim();await S({name:R,type:B,...z?{path:z}:{}})!==!1&&C.reset()}}
          >
            <input
              type="text"
              name="name"
              class="workspaces-create-input"
              placeholder="New workspace name (e.g. Patient Autopilot)"
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
              ?disabled=${!!l}
            >
              ${l?"Adding...":"Add Workspace"}
            </button>
          </form>
          <input
            type="text"
            class="workspaces-search-input"
            placeholder="Search workspaces..."
            .value=${i}
            @input=${L=>u?.(L.target.value)}
          />
          <span class="workspaces-count">${x.length} workspaces</span>
          <span class="workspaces-status ${t?"online":"offline"}">
            ${t?"Online":"Offline"}
          </span>
        </div>
      </div>

      ${c?r`<div class="callout danger" style="margin: 16px;">${c}</div>`:f}

      ${o?r`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `:r`
              <div class="workspace-grid">
                ${x.length===0?r`
                        <div class="workspaces-empty">
                          <span class="workspaces-empty-icon">${t?"📭":"🔌"}</span>
                          <span>${t?"No workspaces found":"Connect to gateway to see workspaces"}</span>
                        </div>
                      `:x.map(L=>Bw(L,h))}
              </div>
            `}
    </div>
  `}const Kw={0:"Welcome",1:"Identity",2:"Your World",3:"Connect Tools",4:"GodMode Audit",5:"First Win",6:"Ready"},Ww=[{id:"slack",name:"Slack",icon:"#",desc:"Team messaging"},{id:"google-calendar",name:"Google Calendar",icon:"Cal",desc:"Events & scheduling"},{id:"clickup",name:"ClickUp",icon:"CU",desc:"Project management"},{id:"github",name:"GitHub",icon:"GH",desc:"Code & repos"},{id:"obsidian",name:"Obsidian",icon:"Ob",desc:"Notes & knowledge"},{id:"notion",name:"Notion",icon:"N",desc:"Docs & wikis"},{id:"linear",name:"Linear",icon:"Li",desc:"Issue tracking"},{id:"apple-reminders",name:"Apple Reminders",icon:"AR",desc:"Tasks (macOS)"},{id:"email",name:"Email",icon:"@",desc:"Gmail / Outlook"},{id:"things-mac",name:"Things",icon:"Th",desc:"Task manager (macOS)"}];function Hw(e){return r`
		<div class="onboarding-progress">
			<div class="onboarding-progress-bar">
				${[2,3,4,5].map(n=>r`
						<div
							class="onboarding-progress-step ${e>=n?"completed":""} ${e===n?"active":""}"
						>
							<div class="onboarding-progress-dot"></div>
							<span class="onboarding-progress-label">${Kw[n]}</span>
						</div>
					`)}
			</div>
			<div class="onboarding-progress-fill" style="width: ${(e-2)/4*100}%"></div>
		</div>
	`}function zw(e,t){return r`
		<div class="onboarding-tools-overlay">
			<div class="onboarding-tools-header">
				<h3>Connect Your Tools</h3>
				<p>Tap a tool to connect it. The agent will help with setup.</p>
			</div>
			<div class="onboarding-tools-grid">
				${Ww.map(n=>{const i=e.find(a=>a.id===n.id)?.status??"pending";return r`
						<div class="onboarding-tool-card ${i}" data-tool-id="${n.id}">
							<div class="onboarding-tool-icon">${n.icon}</div>
							<div class="onboarding-tool-name">${n.name}</div>
							<div class="onboarding-tool-desc">${n.desc}</div>
							<div class="onboarding-tool-status">
								${i==="connected"?r`<span class="status-connected">Connected</span>`:i==="skipped"?r`<span class="status-skipped">Skipped</span>`:r`<span class="status-pending">Tap to connect</span>`}
							</div>
						</div>
					`})}
			</div>
			<button class="onboarding-skip-btn" @click=${t}>Skip for now</button>
		</div>
	`}function jw(e){return e.length?r`
		<div class="onboarding-audit-overlay">
			<h3>GodMode Audit Results</h3>
			<div class="onboarding-audit-cards">
				${e.map(t=>r`
						<div class="onboarding-audit-card impact-${t.impact}">
							<div class="audit-problem">${t.problem}</div>
							${t.skill?r`<div class="audit-skill">Skill: ${t.skill}</div>`:f}
							${t.estimatedTimeSaved?r`<div class="audit-time">Saves ~${t.estimatedTimeSaved}</div>`:f}
							<div class="audit-impact">${t.impact} impact</div>
						</div>
					`)}
			</div>
		</div>
	`:r`${f}`}function Vw(e){return r`
		<div class="onboarding-fullscreen">
			<div class="onboarding-welcome">
				<div class="onboarding-welcome-glow"></div>
				<h1 class="onboarding-title">Welcome to GodMode</h1>
				<div class="onboarding-value-cards">
					<div class="onboarding-value-card">
						<div class="value-icon">OS</div>
						<div class="value-title">Your AI Operating System</div>
						<div class="value-desc">
							A personal AI that knows your projects, people, and goals.
						</div>
					</div>
					<div class="onboarding-value-card">
						<div class="value-icon">Work</div>
						<div class="value-title">Delegates Real Work</div>
						<div class="value-desc">
							Not just answers. Actions. Emails drafted, tasks organized, meetings prepped.
						</div>
					</div>
					<div class="onboarding-value-card">
						<div class="value-icon">+</div>
						<div class="value-title">Learns & Improves</div>
						<div class="value-desc">
							Gets better every day. Remembers context. Anticipates needs.
						</div>
					</div>
				</div>
				<button class="onboarding-cta" @click=${e}>Let's build your GodMode</button>
			</div>
		</div>
	`}function Gw(e){let t="",n="",s="";const i=["rocket","lightning","fire","star","brain","crown","diamond","target","compass","mountain"],a={rocket:"🚀",lightning:"⚡",fire:"🔥",star:"⭐",brain:"🧠",crown:"👑",diamond:"💎",target:"🎯",compass:"🧭",mountain:"⛰️"};function o(l){l.preventDefault();const c=l.target,u=new FormData(c);t=u.get("name")?.trim()??"",n=u.get("mission")?.trim()??"",s=u.get("emoji")?.trim()||"🚀",t&&e({name:t,mission:n,emoji:s})}return r`
		<div class="onboarding-fullscreen">
			<div class="onboarding-identity">
				<h2 class="onboarding-identity-title">Who are you?</h2>
				<p class="onboarding-identity-subtitle">Let's personalize your GodMode</p>
				<form class="onboarding-identity-form" @submit=${o}>
					<div class="identity-field">
						<label for="ob-name">Your name</label>
						<input
							type="text"
							id="ob-name"
							name="name"
							placeholder="What should I call you?"
							required
							autofocus
							autocomplete="off"
						/>
					</div>
					<div class="identity-field">
						<label for="ob-mission">Your mission <span class="optional">(one sentence)</span></label>
						<input
							type="text"
							id="ob-mission"
							name="mission"
							placeholder="e.g. Build the future of personal AI"
							autocomplete="off"
						/>
					</div>
					<div class="identity-field">
						<label>Choose your avatar</label>
						<div class="emoji-picker">
							${i.map((l,c)=>r`
									<label class="emoji-option">
										<input
											type="radio"
											name="emoji"
											value="${a[l]}"
											?checked=${c===0}
										/>
										<span class="emoji-display">${a[l]}</span>
									</label>
								`)}
						</div>
					</div>
					<button type="submit" class="onboarding-cta">Continue</button>
				</form>
			</div>
		</div>
	`}function qw(e){const{phase:t,tools:n,auditFindings:s,onSkipPhase:i}=e;return r`
		${Hw(t)}
		${t===3?zw(n,i):f}
		${t===4&&s.length>0?jw(s):f}
	`}function Yw(e,t,n){return e?r`
		<div class="onboarding-fullscreen onboarding-summary">
			<div class="onboarding-summary-content">
				<div class="onboarding-summary-emoji">${t?.emoji??"🚀"}</div>
				<h2 class="onboarding-summary-title">You're ready, ${t?.name??"friend"}.</h2>
				<div class="onboarding-summary-stats">
					<div class="summary-stat">
						<span class="stat-number">${e.projects}</span>
						<span class="stat-label">Projects</span>
					</div>
					<div class="summary-stat">
						<span class="stat-number">${e.people}</span>
						<span class="stat-label">People</span>
					</div>
					<div class="summary-stat">
						<span class="stat-number">${e.goals}</span>
						<span class="stat-label">Goals</span>
					</div>
					<div class="summary-stat">
						<span class="stat-number">${e.toolsConnected}</span>
						<span class="stat-label">Tools</span>
					</div>
					<div class="summary-stat">
						<span class="stat-number">${e.automations}</span>
						<span class="stat-label">Automations</span>
					</div>
				</div>
				${t?.mission?r`<p class="onboarding-summary-mission">"${t.mission}"</p>`:f}
				<button class="onboarding-cta onboarding-reveal-btn" @click=${n}>
					Welcome to GodMode
				</button>
			</div>
		</div>
	`:r`${f}`}const Qw=/^data:/i,Jw=/^https?:\/\//i;function Xw(e){const t=e.agentsList?.agents??[],s=dl(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",a=t.find(l=>l.id===s)?.identity,o=a?.avatarUrl??a?.avatar;if(o)return Qw.test(o)||Jw.test(o)?o:a?.avatarUrl}function De(e,t){const n=e.dynamicSlots[t];return n?r`
    <div class="dynamic-slot">
      <div class="dynamic-slot__toolbar">
        <span class="dynamic-slot__label">Custom view</span>
        <button
          class="dynamic-slot__reset"
          @click=${()=>{const s={...e.dynamicSlots};delete s[t],e.dynamicSlots=s}}
          title="Reset to default view"
        >Reset to default</button>
      </div>
      <div class="dynamic-slot__content">${je(n)}</div>
    </div>
  `:f}function Zw(e){const t=e.onboardingActive,n=e.onboardingPhase??0,s=e.onboardingData;if(t&&n===0)return Vw(()=>{e.handleOnboardingStart?.()});if(t&&n===1)return Gw(d=>{e.handleOnboardingIdentitySubmit?.(d)});if(t&&n===6)return Yw(s?.summary??null,s?.identity??null,()=>{e.handleOnboardingComplete?.()});const i=e.presenceEntries.length,a=e.sessionsResult?.count??null,o=e.cronStatus?.nextWakeAtMs??null,l=e.connected?null:"Disconnected from gateway.",c=e.tab==="chat",u=c&&(e.settings.chatFocusMode||e.onboarding||t&&n>=2),p=e.onboarding?!1:e.settings.chatShowThinking,h=Xw(e),g=e.chatAvatarUrl??h??null;return r`
    <div class="shell ${c?"shell--chat":""} ${u?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
            aria-label="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">${W.menu}</span>
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
        <div class="topbar-center"></div>
        <div class="topbar-status">
          ${e.updateStatus?.behind?r`<a
                  class="pill pill--update"
                  href="#"
                  title="${e.updateStatus.behind} update${e.updateStatus.behind>1?"s":""} available — click to view"
                  @click=${d=>{d.preventDefault(),e.setTab("overview")}}
                >
                  <span class="pill__icon">${W.zap}</span>
                  <span>Update Ready</span>
                </a>`:f}
          <a
            class="pill pill--guide"
            href="/how-to-godmode.html"
            target="_blank"
            title="Learn how to get the most out of GodMode"
          >
            <span class="pill__icon">${W.book}</span>
            <span>How to GodMode</span>
          </a>
          <a
            class="pill pill--help"
            href="https://t.me/GodModeSupportBot"
            target="_blank"
            rel="noreferrer"
            title="Get help from Atlas via Telegram"
          >
            <span class="pill__icon">${W.messageCircle}</span>
            <span>Get Help</span>
          </a>
          <div class="pill ${e.reconnecting?"reconnecting":""}">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>Gateway</span>
            <span class="mono">${e.reconnecting?`Reconnecting${e.reconnectAttempt>1?` (${e.reconnectAttempt})`:""}...`:e.connected?"Connected":"Offline"}</span>
          </div>
          ${$c(e)}
        </div>
      </header>
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">
        ${Jf.map(d=>{const m=e.settings.navGroupsCollapsed[d.label]??!1,k=d.tabs.some(S=>S===e.tab),$=!d.label||d.tabs.length===1&&Xn(d.tabs[0])===d.label;return r`
            <div class="nav-group ${m&&!k?"nav-group--collapsed":""} ${$?"nav-group--no-header":""}">
              ${$?f:r`
                <button
                  class="nav-label"
                  @click=${()=>{const S={...e.settings.navGroupsCollapsed};S[d.label]=!m,e.applySettings({...e.settings,navGroupsCollapsed:S})}}
                  aria-expanded=${!m}
                >
                  <span class="nav-label__text">${d.label}</span>
                  <span class="nav-label__chevron">${m?"+":"−"}</span>
                </button>
              `}
              <div class="nav-group__items">
                ${d.tabs.map(S=>wc(e,S))}
                ${d.label?f:r`
                        <a
                          class="nav-item nav-item--external"
                          href="/deck/"
                          target="_blank"
                          rel="noreferrer"
                          title="Open Deck — parallel agent sessions"
                        >
                          <span class="nav-item__emoji" aria-hidden="true">🏛️</span>
                          <span class="nav-item__text">Deck</span>
                        </a>
                      `}
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
              <span class="nav-item__icon" aria-hidden="true">${W.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${c?"content--chat":""}">
        <section class="content-header">
          <div>
            ${e.tab!=="chat"&&e.tab!=="mission"&&e.tab!=="workspaces"&&e.tab!=="today"&&e.tab!=="my-day"&&e.tab!=="work"&&e.tab!=="people"&&e.tab!=="life"&&e.tab!=="data"&&e.tab!=="inner-work"&&e.tab!=="wheel-of-life"&&e.tab!=="vision-board"&&e.tab!=="lifetracks"&&e.tab!=="therapist"?r`
              <div class="page-title">${Xn(e.tab)}</div>
              <div class="page-sub">${eg(e.tab)}</div>
            `:e.tab==="chat"?r`
              <div class="session-tabs">
                ${vs(e.settings.openTabs,d=>d,(d,m)=>{const k=On(e.sessionsResult?.sessions,d),$=d===e.sessionKey,x=(()=>{if(k?.displayName)return k.displayName;const M=sn.get(d);if(M)return M;if(k?.label)return k.label;if(d.includes("webchat")){const N=d.match(/webchat[:-](\d+)/);return N?`Chat ${N[1]}`:"Chat"}if(d.includes("main"))return"MAIN";const B=d.split(/[:-]/);return B[B.length-1]||d})(),L=e.settings.openTabs.length>1,C=e.workingSessions.has(d),E=e.settings.tabLastViewed[d]??0,P=k?.updatedAt??0,R=!$&&!C&&P>E,oe=e.editingTabKey===d;return r`
                      <div
                        class="session-tab ${$?"session-tab--active":""} ${C?"session-tab--working":""} ${R?"session-tab--ready":""} ${oe?"session-tab--editing":""}"
                        @click=${()=>{if(!oe){if($){e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}});return}Ee(e),e.sessionKey=d,Ke(e,d),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}}),e.loadAssistantIdentity(),ge(e,d),de(e),le(e)}}}
                        draggable="true"
                        @dragstart=${M=>{if(e.editingTabKey===d){M.preventDefault();return}M.dataTransfer.effectAllowed="move",M.dataTransfer.setData("text/plain",m.toString()),M.target.classList.add("dragging")}}
                        @dragend=${M=>{M.target.classList.remove("dragging")}}
                        @dragover=${M=>{M.preventDefault(),M.dataTransfer.dropEffect="move";const B=M.currentTarget,N=B.getBoundingClientRect(),z=N.left+N.width/2;M.clientX<z?(B.classList.add("drop-left"),B.classList.remove("drop-right")):(B.classList.add("drop-right"),B.classList.remove("drop-left"))}}
                        @dragleave=${M=>{M.currentTarget.classList.remove("drop-left","drop-right")}}
                        @drop=${M=>{M.preventDefault();const B=parseInt(M.dataTransfer.getData("text/plain")),N=m;if(B===N)return;const z=e.settings.openTabs.slice(),[D]=z.splice(B,1);z.splice(N,0,D),e.applySettings({...e.settings,openTabs:z}),M.currentTarget.classList.remove("drop-left","drop-right")}}
                        title=${x}
                      >
                        ${oe?r`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${k?.displayName??k?.label??""}
                            @click=${M=>M.stopPropagation()}
                            @dblclick=${M=>M.stopPropagation()}
                            @blur=${async M=>{const B=M.target;if(B._committedByEnter)return;const N=B.value.trim();e.editingTabKey=null;const z=k?.displayName??k?.label??"";if(N!==z){sn.delete(d);const D=await Qs(e,d,{displayName:N||null});le(e);const xe=D.ok&&D.canonicalKey!==d?D.canonicalKey:d,qe=d===e.sessionKey;e.applySettings({...e.settings,...D.ok&&D.canonicalKey!==d&&e.settings.openTabs.includes(d)?{openTabs:e.settings.openTabs.map(Ye=>Ye===d?D.canonicalKey:Ye)}:{},tabLastViewed:{...e.settings.tabLastViewed,[xe]:Date.now()},...qe&&D.ok&&D.canonicalKey!==d?{sessionKey:D.canonicalKey,lastActiveSessionKey:D.canonicalKey}:{}}),qe&&D.ok&&D.canonicalKey!==d&&(e.sessionKey=D.canonicalKey,ge(e,D.canonicalKey))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}})}}
                            @keydown=${async M=>{if(M.key==="Enter"){M.preventDefault();const B=M.target;B._committedByEnter=!0;const N=B.value.trim();e.editingTabKey=null;const z=k?.displayName??k?.label??"";if(N!==z){sn.delete(d);const D=await Qs(e,d,{displayName:N||null});le(e);const xe=D.ok&&D.canonicalKey!==d?D.canonicalKey:d,qe=d===e.sessionKey;e.applySettings({...e.settings,...D.ok&&D.canonicalKey!==d&&e.settings.openTabs.includes(d)?{openTabs:e.settings.openTabs.map(Ye=>Ye===d?D.canonicalKey:Ye)}:{},tabLastViewed:{...e.settings.tabLastViewed,[xe]:Date.now()},...qe&&D.ok&&D.canonicalKey!==d?{sessionKey:D.canonicalKey,lastActiveSessionKey:D.canonicalKey}:{}}),qe&&D.ok&&D.canonicalKey!==d&&(e.sessionKey=D.canonicalKey,ge(e,D.canonicalKey))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}})}else M.key==="Escape"&&(M.preventDefault(),e.editingTabKey=null)}}
                          />
                        `:(()=>{let M=null;return r`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${B=>{B.stopPropagation(),M&&clearTimeout(M),M=setTimeout(()=>{M=null,e.editingTabKey!==d&&(d===e.sessionKey?e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}}):(Ee(e),e.sessionKey=d,Ke(e,d),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}}),e.loadAssistantIdentity(),ge(e,d),de(e),le(e)))},250)}}
                            @dblclick=${B=>{B.preventDefault(),B.stopPropagation(),M&&(clearTimeout(M),M=null),e.editingTabKey=d;const N=B.target.closest(".session-tab"),z=D=>{const xe=D.target;N&&!N.contains(xe)&&(e.editingTabKey=null,document.removeEventListener("mousedown",z,!0))};document.addEventListener("mousedown",z,!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const D=N?.querySelector(".session-tab__name-input");D&&(D.focus(),D.select())})})}}
                          >${x}</span>
                        `})()}
                        ${e.chatPrivateMode&&d===e.sessionKey?r`
                                <span class="session-tab__lock" title="Private chat" style="font-size: 10px; margin-left: 2px"
                                  >🔒</span
                                >
                              `:f}
                        ${C?r`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `:f}
                        ${R?r`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `:f}
                        ${L?r`
                          <button
                            class="session-tab__close"
                            @click=${M=>{M.stopPropagation();const B=e.settings.openTabs.filter(z=>z!==d),N=d===e.sessionKey;e.applySettings({...e.settings,openTabs:B,...N?{sessionKey:B[0],lastActiveSessionKey:B[0]}:{}}),N&&(e.sessionKey=B[0],ge(e,B[0]),de(e))}}
                            title="Close tab"
                          >×</button>
                        `:f}
                      </div>
                    `})}
              `:f}
          </div>
          <div class="page-meta">
            ${e.reconnecting?r`<div class="pill warning reconnecting">
                  <span class="reconnect-spinner"></span>
                  Reconnecting${e.reconnectAttempt>1?` (attempt ${e.reconnectAttempt})`:""}...
                </div>`:e.lastError?r`<div class="pill ${e.lastError.startsWith("✓")?"success":"danger"}">${e.lastError}</div>`:f}
            ${c?kc(e):f}
          </div>
        </section>

        ${e.tab==="overview"?Hb({connected:e.connected,hello:e.hello,settings:e.settings,password:e.password,lastError:e.lastError,presenceCount:i,sessionsCount:a,cronEnabled:e.cronStatus?.enabled??null,cronNext:o,lastChannelsRefresh:e.channelsLastSuccess,updateStatus:e.updateStatus,updateLoading:e.updateLoading,updateError:e.updateError,updateLastChecked:e.updateLastChecked,updateRunning:e.updateRunning,onSettingsChange:d=>e.applySettings(d),onPasswordChange:d=>e.password=d,onSessionKeyChange:d=>{Ee(e),e.sessionKey=d,Ke(e,d),e.resetToolStream(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d}),e.loadAssistantIdentity()},onConnect:()=>e.connect(),onRefresh:()=>e.loadOverview(),onCheckUpdates:()=>Hh(e),onUpdateNow:()=>{go(e)}}):f}

        ${e.tab==="mission"?ib({connected:e.connected,loading:e.missionLoading,error:e.missionError,agents:e.missionAgents,activeRuns:e.missionActiveRuns,subagentRuns:e.missionSubagentRuns,tasks:e.missionTasks,feedItems:e.missionFeedItems}):f}

        ${e.tab==="workspaces"?Uw({connected:e.connected,workspaces:e.workspaces??[],selectedWorkspace:e.selectedWorkspace??null,searchQuery:e.workspacesSearchQuery??"",itemSearchQuery:e.workspaceItemSearchQuery??"",loading:e.workspacesLoading??!1,createLoading:e.workspacesCreateLoading??!1,error:e.workspacesError??null,onSearch:d=>e.workspacesSearchQuery=d,onItemSearch:d=>e.workspaceItemSearchQuery=d,onCreateWorkspace:async d=>{e.workspacesCreateLoading=!0;try{const{createWorkspace:m,selectWorkspace:k}=await Be(async()=>{const{createWorkspace:S,selectWorkspace:x}=await Promise.resolve().then(()=>Yt);return{createWorkspace:S,selectWorkspace:x}},void 0,import.meta.url),$=await m(e,d);return $?(e.workspaceItemSearchQuery="",await k(e,$),e.showToast(`Created workspace: ${$.name}`,"success"),!0):(e.showToast("Failed to create workspace","error"),!1)}finally{e.workspacesCreateLoading=!1}},onSelectWorkspace:async d=>{e.workspaceItemSearchQuery="";const{selectWorkspace:m}=await Be(async()=>{const{selectWorkspace:k}=await Promise.resolve().then(()=>Yt);return{selectWorkspace:k}},void 0,import.meta.url);await m(e,d)},onBack:()=>{e.selectedWorkspace=null,e.workspaceItemSearchQuery=""},onItemClick:async d=>{const{readWorkspaceFile:m}=await Be(async()=>{const{readWorkspaceFile:S}=await Promise.resolve().then(()=>Yt);return{readWorkspaceFile:S}},void 0,import.meta.url),k=e.selectedWorkspace?.id,$=await m(e,d.path,k);if(!$){e.showToast(`Failed to open ${d.name}`,"error");return}e.handleOpenSidebar($.content,{mimeType:$.mime,filePath:d.path,title:d.name})},onSessionClick:async d=>{if(!d.key)return;const m=d.key;Ee(e),e.sessionKey=m,Ke(e,m),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll();const k=e.settings.openTabs.includes(m)?e.settings.openTabs:[...e.settings.openTabs,m];e.applySettings({...e.settings,openTabs:k,sessionKey:m,lastActiveSessionKey:m,tabLastViewed:{...e.settings.tabLastViewed,[m]:Date.now()}}),e.setTab("chat"),e.loadAssistantIdentity(),ge(e,m),de(e)},onPinToggle:async(d,m,k)=>{const{toggleWorkspacePin:$}=await Be(async()=>{const{toggleWorkspacePin:x}=await Promise.resolve().then(()=>Yt);return{toggleWorkspacePin:x}},void 0,import.meta.url);await $(e,d,m,k)||e.showToast("Failed to update pin","error")},onPinSessionToggle:async(d,m,k)=>{const{toggleWorkspaceSessionPin:$}=await Be(async()=>{const{toggleWorkspaceSessionPin:x}=await Promise.resolve().then(()=>Yt);return{toggleWorkspaceSessionPin:x}},void 0,import.meta.url);await $(e,d,m,k)||e.showToast("Failed to update session pin","error")}}):f}

        ${e.tab==="today"||e.tab==="my-day"?e.dynamicSlots.today?De(e,"today"):vb({connected:e.connected,loading:e.myDayLoading??!1,error:e.myDayError??null,onRefresh:()=>e.handleMyDayRefresh(),dailyBrief:e.dailyBrief??null,dailyBriefLoading:e.dailyBriefLoading??!1,dailyBriefError:e.dailyBriefError??null,onBriefRefresh:()=>e.handleDailyBriefRefresh(),onBriefOpenInObsidian:()=>e.handleDailyBriefOpenInObsidian(),onBriefSave:d=>e.handleBriefSave(d),onOpenFile:d=>{e.handleOpenFile(d)},briefEditing:e.briefEditing??!1,onBriefEditStart:()=>e.handleBriefEditStart(),onBriefEditEnd:()=>e.handleBriefEditEnd(),selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"my-day",onViewModeChange:d=>e.handleTodayViewModeChange(d),agentLog:e.agentLog??null,agentLogLoading:e.agentLogLoading??!1,agentLogError:e.agentLogError??null,onAgentLogRefresh:()=>e.handleMyDayRefresh()}):f}

        ${e.tab==="work"?e.dynamicSlots.work?De(e,"work"):Pw({connected:e.connected,projects:e.workProjects??[],loading:e.workLoading??!1,error:e.workError??null,expandedProjects:e.workExpandedProjects,projectFiles:e.workProjectFiles??{},detailLoading:e.workDetailLoading??new Set,onRefresh:()=>e.handleWorkRefresh(),onToggleProject:d=>e.handleWorkToggleProject(d),onPersonClick:d=>e.handleWorkPersonClick(d),onFileClick:d=>e.handleWorkFileClick(d),onSkillClick:(d,m)=>e.handleWorkSkillClick(d,m)}):f}

        ${e.tab==="people"?e.dynamicSlots.people?De(e,"people"):Gb({connected:e.connected,people:e.peopleList??[],loading:e.peopleLoading??!1,error:e.peopleError??null,selectedId:e.peopleSelected??null,searchQuery:e.peopleSearchQuery??"",onRefresh:()=>e.handlePeopleRefresh(),onSelectPerson:d=>e.handlePeopleSelect(d),onBack:()=>e.handlePeopleBack(),onSearchChange:d=>e.handlePeopleSearch(d),onImportContacts:d=>e.handlePeopleImport(d)}):f}

        ${e.tab==="life"?e.dynamicSlots.life?De(e,"life"):r`
                <div class="my-day-container" style="overflow-y: auto;">
                  <div class="my-day-header">
                    <div class="my-day-header-left">
                      <h1 class="my-day-title">Life</h1>
                      <p class="my-day-subtitle">Vision board, goals, life scores, and LifeTracks.</p>
                    </div>
                    <div class="my-day-header-right">
                      <button class="my-day-refresh-btn" @click=${()=>e.handleStartChatWithPrompt(e.lifeSubtab==="vision-board"?"Let's update my Vision Board":e.lifeSubtab==="lifetracks"?"Generate a new LifeTrack for me":e.lifeSubtab==="goals"?"Let's review and update my goals":"Time for a Wheel of Life check-in")} title="Update via Chat">
                        💬 Update
                      </button>
                    </div>
                  </div>
                  <div class="life-subnav">
                    ${["vision-board","lifetracks","goals","wheel-of-life"].map(d=>{const m={"vision-board":"Vision Board",lifetracks:"LifeTracks",goals:"Goals","wheel-of-life":"Wheel of Life"},k=(e.lifeSubtab??"vision-board")===d;return r`
                        <button
                          class="life-subnav__item ${k?"active":""}"
                          @click=${()=>e.handleLifeSubtabChange(d)}
                        >${m[d]}</button>
                      `})}
                  </div>
                  <div class="life-subtab-content">
                    ${(e.lifeSubtab??"vision-board")==="vision-board"?Kr({connected:e.connected,data:e.visionBoardData??null,identityToday:e.visionBoardIdentityToday??null,loading:e.visionBoardLoading??!1,error:e.visionBoardError??null,onRefresh:()=>e.handleVisionBoardRefresh(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Let's update my Vision Board — review my Chief Definite Aim, annual themes, values, and identity statements.")}):f}
                    ${(e.lifeSubtab??"vision-board")==="lifetracks"?Rr({connected:e.connected,data:e.lifetracksData??null,currentTrack:e.lifetracksCurrentTrack??null,loading:e.lifetracksLoading??!1,error:e.lifetracksError??null,config:e.lifetracksConfig??null,generating:e.lifetracksGenerating??!1,generationError:e.lifetracksGenerationError??null,onRefresh:()=>e.handleLifetracksRefresh(),onSelectTrack:d=>e.handleLifetracksSelectTrack(d),onEnable:()=>e.handleLifetracksEnable(),onGenerate:()=>e.handleLifetracksGenerate(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Time to update my LifeTracks — let's review my meditation and affirmation audio settings.")}):f}
                    ${e.lifeSubtab==="goals"?Ny({connected:e.connected,goals:e.goals??[],loading:e.goalsLoading??!1,error:e.goalsError??null,onRefresh:()=>e.handleGoalsRefresh(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Let's review and update my goals")}):f}
                    ${e.lifeSubtab==="wheel-of-life"?Wr({connected:e.connected,data:e.wheelOfLifeData??null,loading:e.wheelOfLifeLoading??!1,error:e.wheelOfLifeError??null,editMode:e.wheelOfLifeEditMode??!1,onRefresh:()=>e.handleWheelOfLifeRefresh(),onEdit:()=>e.handleWheelOfLifeEdit(),onSave:d=>e.handleWheelOfLifeSave(d),onCancel:()=>e.handleWheelOfLifeCancel(),onUpdateViaChat:()=>e.handleStartChatWithPrompt("Let's do a Wheel of Life check-in — rate my current satisfaction across all 8 life areas.")}):f}
                  </div>
                </div>
              `:f}

        ${e.tab==="data"?e.dynamicSlots.data?De(e,"data"):Ay({connected:e.connected,sources:e.dataSources??[],loading:e.dataLoading??!1,error:e.dataError??null,subtab:e.dataSubtab??"dashboard",onRefresh:()=>e.handleDataRefresh(),onSubtabChange:d=>e.handleDataSubtabChange(d),onConnectSource:d=>e.handleDataConnectSource(d),onQuerySubmit:d=>e.handleDataQuerySubmit(d)}):f}

        ${e.tab==="inner-work"?Hy({connected:e.connected,messages:e.innerWorkMessages??[],activeSession:e.innerWorkActiveSession??null,inputValue:e.innerWorkInput??"",loading:e.innerWorkLoading??!1,error:e.innerWorkError??null,onInputChange:d=>e.innerWorkInput=d,onSend:d=>e.handleSendToSage(d),onSelectSession:d=>e.innerWorkActiveSession=d,onBackToSessions:()=>e.handleBackToSessions()}):f}

        ${e.tab==="wheel-of-life"?e.dynamicSlots["wheel-of-life"]?De(e,"wheel-of-life"):Wr({connected:e.connected,data:e.wheelOfLifeData??null,loading:e.wheelOfLifeLoading??!1,error:e.wheelOfLifeError??null,editMode:e.wheelOfLifeEditMode??!1,onRefresh:()=>e.handleWheelOfLifeRefresh(),onEdit:()=>e.handleWheelOfLifeEdit(),onSave:d=>e.handleWheelOfLifeSave(d),onCancel:()=>e.handleWheelOfLifeCancel()}):f}

        ${e.tab==="vision-board"?e.dynamicSlots["vision-board"]?De(e,"vision-board"):Kr({connected:e.connected,data:e.visionBoardData??null,identityToday:e.visionBoardIdentityToday??null,loading:e.visionBoardLoading??!1,error:e.visionBoardError??null,onRefresh:()=>e.handleVisionBoardRefresh()}):f}

        ${e.tab==="lifetracks"?e.dynamicSlots.lifetracks?De(e,"lifetracks"):Rr({connected:e.connected,data:e.lifetracksData??null,currentTrack:e.lifetracksCurrentTrack??null,loading:e.lifetracksLoading??!1,error:e.lifetracksError??null,config:e.lifetracksConfig??null,generating:e.lifetracksGenerating??!1,generationError:e.lifetracksGenerationError??null,onRefresh:()=>e.handleLifetracksRefresh(),onSelectTrack:d=>e.handleLifetracksSelectTrack(d),onEnable:()=>e.handleLifetracksEnable(),onGenerate:()=>e.handleLifetracksGenerate()}):f}

        ${e.tab==="therapist"?uw(e.therapistController?.getProps()??{connected:e.connected,sessionId:null,messages:[],inputValue:"",loading:!1,sending:!1,error:null,expiresIn:null,expiresAt:null,onInputChange:()=>{},onSend:()=>{},onStartSession:()=>{},onEndSession:()=>{}}):f}

        ${e.tab==="channels"?mm({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:d=>ye(e,d),onWhatsAppStart:d=>e.handleWhatsAppStart(d),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(d,m)=>_n(e,d,m),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(d,m)=>e.handleNostrProfileEdit(d,m),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(d,m)=>e.handleNostrProfileFieldChange(d,m),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):f}

        ${e.tab==="instances"?zy({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>ga(e)}):f}

        ${e.tab==="sessions"?nw({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,onFiltersChange:d=>{e.sessionsFilterActive=d.activeMinutes,e.sessionsFilterLimit=d.limit,e.sessionsIncludeGlobal=d.includeGlobal,e.sessionsIncludeUnknown=d.includeUnknown},onRefresh:()=>le(e),onPatch:async(d,m)=>{const k=await Qs(e,d,m);if(k.ok&&k.canonicalKey!==d&&e.settings.openTabs.includes(d)){const $=e.settings.openTabs.map(x=>x===d?k.canonicalKey:x),S=d===e.sessionKey;e.applySettings({...e.settings,openTabs:$,tabLastViewed:{...e.settings.tabLastViewed,[k.canonicalKey]:e.settings.tabLastViewed[d]??Date.now()},...S?{sessionKey:k.canonicalKey,lastActiveSessionKey:k.canonicalKey}:{}}),S&&(e.sessionKey=k.canonicalKey,ge(e,k.canonicalKey))}},onDelete:d=>Kh(e,d)}):f}

        ${e.tab==="cron"?hy({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(d=>d.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:d=>e.cronForm={...e.cronForm,...d},onRefresh:()=>e.loadCron(),onAdd:()=>mf(e),onToggle:(d,m)=>vf(e,d,m),onRun:d=>yf(e,d),onRemove:d=>bf(e,d),onLoadRuns:d=>ac(e,d)}):f}

        ${e.tab==="skills"?iw({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,onFilterChange:d=>e.skillsFilter=d,onRefresh:()=>vn(e,{clearMessages:!0}),onToggle:(d,m)=>Nf(e,d,m),onEdit:(d,m)=>Df(e,d,m),onSaveKey:d=>Of(e,d),onInstall:(d,m,k)=>Bf(e,d,m,k)}):f}

        ${e.tab==="nodes"?yb({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>ls(e),onDevicesRefresh:()=>Ge(e),onDeviceApprove:d=>xh(e,d),onDeviceReject:d=>_h(e,d),onDeviceRotate:(d,m,k)=>Th(e,{deviceId:d,role:m,scopes:k}),onDeviceRevoke:(d,m)=>Ch(e,{deviceId:d,role:m}),onLoadConfig:()=>Ie(e),onLoadExecApprovals:()=>{const d=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return fa(e,d)},onBindDefault:d=>{d?_n(e,["tools","exec","node"],d):mo(e,["tools","exec","node"])},onBindAgent:(d,m)=>{const k=["agents","list",d,"tools","exec","node"];m?_n(e,k,m):mo(e,k)},onSaveBindings:()=>ci(e),onExecApprovalsTargetChange:(d,m)=>{e.execApprovalsTarget=d,e.execApprovalsTargetNodeId=m,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:d=>{e.execApprovalsSelectedAgent=d},onExecApprovalsPatch:(d,m)=>Af(e,d,m),onExecApprovalsRemove:d=>xf(e,d),onSaveExecApprovals:()=>{const d=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Sf(e,d)}}):f}

        ${t&&n>=2&&n<=5&&e.tab==="chat"?qw({phase:n,identity:s?.identity??null,tools:s?.tools??[],auditFindings:s?.audit?.findings??[],summary:s?.summary??null,onSkipPhase:()=>e.handleOnboardingSkipPhase?.()}):e.tab==="chat"&&e.workspaceNeedsSetup&&!e.chatMessages?.length&&!t?r`
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
                `:f}

        ${e.tab==="chat"?Gv({sessionKey:e.sessionKey,onSessionKeyChange:d=>{Ee(e),e.sessionKey=d,Ke(e,d),e.chatLoading=!0,e.chatMessages=[],e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d}),e.loadAssistantIdentity(),de(e),Pi(e)},thinkingLevel:e.chatThinkingLevel,showThinking:p,loading:e.chatLoading,sending:e.chatSending,sendingSessionKey:e.chatSendingSessionKey,compactionStatus:e.compactionStatus,assistantAvatarUrl:g,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:l,error:e.lastError,sessions:e.sessionsResult,focusMode:u,onRefresh:()=>(e.resetToolStream(),Promise.all([de(e),Pi(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:d=>e.handleChatScroll(d),onDraftChange:d=>e.chatMessage=d,attachments:e.chatAttachments,onAttachmentsChange:d=>e.chatAttachments=d,showToast:(d,m)=>e.showToast(d,m),onSend:d=>e.handleSendChat(void 0,{queue:d}),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onCompact:()=>{e.handleCompactChat()},pendingRetry:e.pendingRetry,onRetry:()=>{e.handleRetryMessage()},onClearRetry:()=>e.handleClearRetry(),onQueueRemove:d=>e.removeQueuedMessage(d),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),onConsciousnessFlush:()=>{e.handleConsciousnessFlush()},consciousnessStatus:e.consciousnessStatus,sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,sidebarMimeType:e.sidebarMimeType,sidebarFilePath:e.sidebarFilePath,sidebarTitle:e.sidebarTitle,splitRatio:e.splitRatio,onOpenSidebar:(d,m)=>e.handleOpenSidebar(d,m),onMessageLinkClick:d=>e.handleOpenMessageFileLink(d),onCloseSidebar:()=>e.handleCloseSidebar(),onSplitRatioChange:d=>e.handleSplitRatioChange(d),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,userName:e.userName,userAvatar:e.userAvatar,currentToolName:e.currentToolName,currentToolInfo:e.currentToolInfo,isWorking:e.workingSessions.has(e.sessionKey),showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>{const d=document.querySelector(".chat-thread");d&&(d.scrollTo({top:d.scrollHeight,behavior:"smooth"}),e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1)}}):f}

        ${e.tab==="config"?sy({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:d=>{e.configRaw=d},onFormModeChange:d=>e.configFormMode=d,onFormPatch:(d,m)=>_n(e,d,m),onSearchChange:d=>e.configSearchQuery=d,onSectionChange:d=>{e.configActiveSection=d,e.configActiveSubsection=null},onSubsectionChange:d=>e.configActiveSubsection=d,onReload:()=>Ie(e),onSave:()=>ci(e),onApply:()=>Pd(e),onUpdate:()=>go(e),userName:e.userName||"",userAvatar:e.userAvatar,onUserProfileUpdate:(d,m)=>e.handleUpdateUserProfile(d,m)}):f}

        ${e.tab==="debug"?xy({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:d=>e.debugCallMethod=d,onCallParamsChange:d=>e.debugCallParams=d,onRefresh:()=>cs(e),onCall:()=>lf(e)}):f}

        ${e.tab==="logs"?sb({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:d=>e.logsFilterText=d,onLevelToggle:(d,m)=>{e.logsLevelFilters={...e.logsLevelFilters,[d]:m}},onToggleAutoFollow:d=>e.logsAutoFollow=d,onRefresh:()=>ra(e,{reset:!0}),onExport:(d,m)=>e.exportLogs(d,m),onScroll:d=>e.handleLogsScroll(d)}):f}
      </main>
      ${Ty(e)}
      ${Cy(e)}
      ${f}
      ${e.sidebarOpen&&e.tab!=="chat"?r`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${()=>e.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${Nc({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:()=>e.handleCloseSidebar(),onViewRawText:()=>{e.sidebarContent&&e.handleOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath,title:e.sidebarTitle})}})}
              </div>
            </div>
          `:f}
      ${hw({toasts:e.toasts,onDismiss:d=>e.dismissToast(d)})}
    </div>
  `}async function e0(e,t){if(!(!e.client||!e.connected))try{e.innerWorkLoading=!0,e.innerWorkError=null;const n={role:"user",content:t,timestamp:Date.now()};e.innerWorkMessages=[...e.innerWorkMessages??[],n],e.innerWorkInput="";const s=await e.client.request("innerwork.send",{sessionType:e.innerWorkActiveSession?.id,message:t});e.innerWorkMessages=[...e.innerWorkMessages,s.response]}catch(n){e.innerWorkError=n instanceof Error?n.message:"Failed to send message",console.error("[InnerWork] Send error:",n)}finally{e.innerWorkLoading=!1}}function t0(e){e.innerWorkMessages=[],e.innerWorkActiveSession=null,e.innerWorkInput="",e.innerWorkError=null}const n0=6e4,Gr=15,qr=new Set;let Fn=null;async function Yr(e){if(!(!e.client||!e.connected))try{const t=new Date,n=new Date(t.getTime()+Gr*6e4+6e4),s=await e.client.request("calendar.events.range",{startDate:t.toISOString(),endDate:n.toISOString()});for(const i of s.events??[]){if(qr.has(i.id))continue;const a=new Date(i.startTime),o=Math.round((a.getTime()-t.getTime())/6e4);if(o>0&&o<=Gr){qr.add(i.id);const l=a.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),c=i.location?` @ ${i.location}`:"",u=`${i.title} starts in ${o} min (${l})${c}`;e.showToast(u,"warning",0)}}}catch(t){console.warn("[MeetingNotify] Poll error:",t)}}function s0(e){jc(),Yr(e),Fn=setInterval(()=>{Yr(e)},n0)}function jc(){Fn&&(clearInterval(Fn),Fn=null)}class i0{constructor(t){this.socket=null,this.sessionId=null,this.messages=[],this.inputValue="",this.loading=!1,this.sending=!1,this.error=null,this.expiresIn=null,this.expiresAt=null,this.host=t,t.addController(this),this.senderId=this.getOrCreateSenderId()}hostConnected(){}hostDisconnected(){}setSocket(t){this.socket=t,t&&this.checkStatus()}get connected(){return this.socket?.connected??!1}getOrCreateSenderId(){const t="godmode-therapy-sender-id";let n=localStorage.getItem(t);return n||(n=`browser-${crypto.randomUUID()}`,localStorage.setItem(t,n)),n}async checkStatus(){if(this.socket)try{const t=await this.socket.request("therapy.status",{senderId:this.senderId});t.active&&t.sessionId&&(this.sessionId=t.sessionId,this.expiresIn=t.expiresIn??null,this.expiresAt=t.expiresAt??null,await this.loadHistory()),this.host.requestUpdate()}catch(t){console.warn("Failed to check therapy status:",t)}}async startSession(){if(!(!this.socket||this.sessionId)){this.loading=!0,this.error=null,this.host.requestUpdate();try{const t=await this.socket.request("therapy.start",{senderId:this.senderId});this.sessionId=t.sessionId,this.expiresIn=t.expiresIn,this.expiresAt=t.expiresAt,t.welcomeMessage&&(this.messages=[{id:crypto.randomUUID(),role:"assistant",content:t.welcomeMessage,timestamp:Date.now()}]),t.resumed&&await this.loadHistory()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loading=!1,this.host.requestUpdate()}}}async loadHistory(){if(!(!this.socket||!this.sessionId))try{const t=await this.socket.request("therapy.history",{sessionId:this.sessionId,limit:100});this.messages=t.messages,this.expiresIn=t.expiresIn,this.host.requestUpdate()}catch(t){console.warn("Failed to load therapy history:",t)}}async sendMessage(t){if(!this.socket||!this.sessionId||!t.trim())return;this.sending=!0,this.error=null,this.inputValue="";const n={id:crypto.randomUUID(),role:"user",content:t.trim(),timestamp:Date.now()};this.messages=[...this.messages,n],this.host.requestUpdate();try{const s=await this.socket.request("therapy.send",{sessionId:this.sessionId,message:t.trim()});this.messages=[...this.messages,s.response],this.expiresIn=s.expiresIn}catch(s){this.error=s instanceof Error?s.message:String(s)}finally{this.sending=!1,this.host.requestUpdate()}}async endSession(){if(this.socket){this.loading=!0,this.error=null,this.host.requestUpdate();try{const t=await this.socket.request("therapy.end",{senderId:this.senderId});t.ended&&(this.messages=[...this.messages,{id:crypto.randomUUID(),role:"assistant",content:t.message,timestamp:Date.now()}],setTimeout(()=>{this.sessionId=null,this.messages=[],this.expiresIn=null,this.expiresAt=null,this.host.requestUpdate()},3e3))}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loading=!1,this.host.requestUpdate()}}}setInputValue(t){this.inputValue=t,this.host.requestUpdate()}getProps(){return{connected:this.connected,sessionId:this.sessionId,messages:this.messages,inputValue:this.inputValue,loading:this.loading,sending:this.sending,error:this.error,expiresIn:this.expiresIn,expiresAt:this.expiresAt,onInputChange:t=>this.setInputValue(t),onSend:t=>{this.sendMessage(t)},onStartSession:()=>{this.startSession()},onEndSession:()=>{this.endSession()}}}}let a0=0;function o0(e,t="info",n=3e3){return{id:`toast-${Date.now()}-${a0++}`,message:e,type:t,duration:n,createdAt:Date.now()}}function r0(e,t){return e.filter(n=>n.id!==t)}function l0(e,t){return[...e,t]}var c0=Object.defineProperty,d0=Object.getOwnPropertyDescriptor,y=(e,t,n,s)=>{for(var i=s>1?void 0:s?d0(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&c0(t,n,i),i};function li(){return yu()}function Rn(){return wu()}function u0(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}const Qr=new Set(["chat","today","workspaces","work","people","life","data","overview","mission","channels","instances","sessions","cron","skills","nodes","config","debug","logs","inner-work","wheel-of-life","vision-board","lifetracks","therapist","my-day"]),p0=["path","filePath","file","workspacePath"];let v=class extends Lt{constructor(){super(...arguments),this.settings=tg(),this.password="",this.tab="chat",this.onboarding=u0(),this.connected=!1,this.reconnecting=!1,this.reconnectAttempt=0,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.sessionPickerClickOutsideHandler=null,this.sessionSearchClickOutsideHandler=null,this.assistantName=li().name,this.assistantAvatar=li().avatar,this.assistantAgentId=li().agentId??null,this.userName=Rn().name,this.userAvatar=Rn().avatar,this.sessionKey=this.settings.sessionKey,this.sessionPickerOpen=!1,this.sessionPickerPosition=null,this.sessionPickerSearch="",this.sessionSearchOpen=!1,this.sessionSearchPosition=null,this.sessionSearchQuery="",this.sessionSearchResults=[],this.sessionSearchLoading=!1,this.profilePopoverOpen=!1,this.profileEditName="",this.profileEditAvatar="",this.editingTabKey=null,this.chatLoading=!1,this.chatSending=!1,this.chatSendingSessionKey=null,this.chatMessage="",this.chatDrafts={},this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.currentToolName=null,this.currentToolInfo=null,this.workingSessions=new Set,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.pendingRetry=null,this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.splitRatio=this.settings.splitRatio,this.updateStatus=null,this.updateLoading=!1,this.updateError=null,this.updateLastChecked=null,this.updatePollInterval=null,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={..._g},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.missionLoading=!1,this.missionError=null,this.missionAgents=[],this.missionActiveRuns=[],this.missionSubagentRuns=[],this.missionTasks=[],this.missionFeedItems=[],this.workspaceNeedsSetup=!1,this.onboardingPhase=0,this.onboardingData=null,this.onboardingActive=!1,this.selectedWorkspace=null,this.workspacesSearchQuery="",this.workspaceItemSearchQuery="",this.workspacesLoading=!1,this.workspacesCreateLoading=!1,this.workspacesError=null,this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=new Date().toISOString().split("T")[0],this.todayViewMode="my-day",this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.briefEditing=!1,this.chatPrivateMode=!1,this.lifeSubtab="vision-board",this.goalsLoading=!1,this.goalsError=null,this.dataLoading=!1,this.dataError=null,this.dataSubtab="dashboard",this.dynamicSlots={},this.workLoading=!1,this.workError=null,this.workExpandedProjects=new Set,this.workProjectFiles={},this.workDetailLoading=new Set,this.peopleLoading=!1,this.peopleError=null,this.peopleSelected=null,this.peopleSearchQuery="",this.innerWorkActiveSession=null,this.innerWorkInput="",this.innerWorkLoading=!1,this.innerWorkError=null,this.wheelOfLifeLoading=!1,this.wheelOfLifeError=null,this.wheelOfLifeEditMode=!1,this.visionBoardLoading=!1,this.visionBoardError=null,this.lifetracksLoading=!1,this.lifetracksError=null,this.lifetracksGenerating=!1,this.lifetracksGenerationError=null,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...xg},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.toasts=[],this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatIsAutoScrolling=!1,this.chatNewMessagesBelow=!1,this.consciousnessStatus="idle",this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.agentLogPollInterval=null,this.agentLogUnsub=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=!1,this.basePath="",this.popStateHandler=()=>fg(this),this.keydownHandler=()=>{},this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null}createRenderRoot(){return this}connectedCallback(){if(super.connectedCallback(),this.settings.userName)this.userName=this.settings.userName;else{const e=Rn();this.userName=e.name}if(this.settings.userAvatar)this.userAvatar=this.settings.userAvatar;else{const e=Rn();this.userAvatar=e.avatar}Fg(this),this.agentLogPollInterval==null&&(this.agentLogPollInterval=window.setInterval(()=>{!this.connected||!(this.tab==="today"||this.tab==="my-day")||this.todayViewMode!=="agent-log"||At(this)},6e4)),!this.agentLogUnsub&&this.client&&(this.agentLogUnsub=Pf(this.client,()=>{this.todayViewMode==="agent-log"&&At(this)})),s0(this),this.therapistController=new i0(this)}firstUpdated(){Ug(this)}disconnectedCallback(){jc(),this.agentLogPollInterval!=null&&(clearInterval(this.agentLogPollInterval),this.agentLogPollInterval=null),this.agentLogUnsub&&(this.agentLogUnsub(),this.agentLogUnsub=null),Kg(this),super.disconnectedCallback()}updated(e){Hg(this,e)}connect(){oa(this)}handleChatScroll(e){Jd(this,e)}handleLogsScroll(e){Xd(this,e)}exportLogs(e,t){eu(e,t)}resetToolStream(){Hi(this)}resetChatScroll(){Zd(this)}async loadAssistantIdentity(){await ml(this)}applySettings(e){ze(this,e)}setTab(e){rg(this,e)}setTheme(e,t){lg(this,e,t)}async loadOverview(){await vc(this)}async loadCron(){await wa(this)}async handleAbortChat(){await yc(this)}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}removeQueuedMessage(e){wg(this,e)}async handleSendChat(e,t){const n=this.sessionsResult?.sessions?.find(s=>s.key===this.sessionKey);if(n){const s=n.totalTokens??0,i=n.contextTokens??this.sessionsResult?.defaults?.contextTokens??2e5;(i>0?s/i:0)>=.9&&!this.compactionStatus?.active&&(this.showToast("Context near limit — auto-compacting...","info",3e3),await this.handleCompactChat())}await kg(this,e,t)}handleToggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen}handleToggleSessionSearch(e){if(!this.sessionSearchOpen&&e){const n=e.currentTarget.getBoundingClientRect();this.sessionSearchPosition={top:n.bottom+8,right:window.innerWidth-n.right}}this.sessionSearchOpen=!this.sessionSearchOpen,this.sessionSearchOpen||(this.sessionSearchQuery="",this.sessionSearchResults=[])}async handleSessionSearchQuery(e){if(this.sessionSearchQuery=e,!e.trim()){this.sessionSearchResults=[];return}if(this.client){this.sessionSearchLoading=!0;try{const t=await this.client.request("sessions.searchContent",{query:e.trim(),limit:20});this.sessionSearchResults=t.results}catch(t){console.error("Session search failed:",t),this.sessionSearchResults=[]}finally{this.sessionSearchLoading=!1}}}handleSelectSession(e){this.sessionPickerOpen=!1,this.sessionSearchOpen=!1,this.sessionSearchQuery="",this.sessionSearchResults=[]}async handleWhatsAppStart(e){await Bd(this,e)}async handleWhatsAppWait(){await Fd(this)}async handleWhatsAppLogout(){await Ud(this)}async handleChannelConfigSave(){await Kd(this)}async handleChannelConfigReload(){await Wd(this)}async handleCompactChat(){if(!this.connected){this.showToast("Cannot compact: not connected","error");return}if(!this.sessionKey){this.showToast("Cannot compact: no active session","error");return}this.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null};try{await this.handleSendChat("/compact")}catch(e){this.compactionStatus=null,console.error("Compaction failed:",e),this.showToast("Compaction failed","error")}}injectCompactionSummary(e,t){const n={role:"system",content:e,timestamp:Date.now(),isCompactionSummary:!0,keptMessages:t};this.chatMessages=[n,...this.chatMessages]}async handleRetryMessage(){const e={client:this.client,connected:this.connected,sessionKey:this.sessionKey,chatLoading:this.chatLoading,chatMessages:this.chatMessages,chatThinkingLevel:this.chatThinkingLevel,chatSending:this.chatSending,chatSendingSessionKey:this.chatSendingSessionKey,chatMessage:this.chatMessage,chatAttachments:this.chatAttachments,chatRunId:this.chatRunId,chatStream:this.chatStream,chatStreamStartedAt:this.chatStreamStartedAt,lastError:this.lastError,pendingRetry:this.pendingRetry},t=await Qp(e);this.chatSending=e.chatSending,this.chatSendingSessionKey=e.chatSendingSessionKey,this.chatRunId=e.chatRunId,this.chatStream=e.chatStream,this.chatStreamStartedAt=e.chatStreamStartedAt,this.lastError=e.lastError,this.pendingRetry=e.pendingRetry??null,this.chatMessages=e.chatMessages,t&&this.showToast("Message resent","success",2e3)}handleClearRetry(){this.pendingRetry=null}handleNostrProfileEdit(e,t){zd(this,e,t)}handleNostrProfileCancel(){jd(this)}handleNostrProfileFieldChange(e,t){Vd(this,e,t)}async handleNostrProfileSave(){await qd(this)}async handleNostrProfileImport(){await Yd(this)}handleNostrProfileToggleAdvanced(){Gd(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,ze(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleOpenSidebar(e,t={}){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarMimeType=t.mimeType?.trim()||null,this.sidebarFilePath=t.filePath?.trim()||null,this.sidebarTitle=t.title?.trim()||null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarCloseTimer=null)},200)}async handleOpenFile(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("files.read",{path:e}),n=e.split(".").pop()?.toLowerCase()??"",s=t.contentType??t.mime??(n==="md"?"text/markdown":null),i=e.split("/").pop()??e;this.handleOpenSidebar(t.content,{mimeType:s,filePath:e,title:i}),t.truncated&&this.showToast(`Opened truncated file: ${e}`,"warning")}catch(t){console.error("[Chat] Failed to open file:",t),this.showToast(`Failed to open file: ${e}`,"error")}}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}normalizeWorkspacePathCandidate(e,t={}){let n=e.trim();if(!n||n.startsWith("#"))return null;for(;n.startsWith("./");)n=n.slice(2);if(n=n.replaceAll("\\","/"),!t.allowAbsolute)for(;n.startsWith("/");)n=n.slice(1);return!n||n.includes("\0")?null:n}isAbsoluteFilesystemPath(e){return e.startsWith("/")||e.startsWith("~/")||/^[a-z]:[\\/]/i.test(e)}inferMimeTypeFromPath(e){if(!e)return null;const t=e.trim().toLowerCase();if(!t)return null;const n=t.split(".").pop()??"";return n?n==="md"||n==="markdown"||n==="mdx"?"text/markdown":n==="html"||n==="htm"?"text/html":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":n==="svg"||n==="svgz"?"image/svg+xml":n==="avif"||n==="bmp"||n==="gif"||n==="heic"||n==="heif"||n==="jpeg"||n==="jpg"||n==="png"||n==="webp"?`image/${n==="jpg"?"jpeg":n}`:null:null}sidebarTitleForPath(e){const t=e.replaceAll("\\","/").trim();if(!t)return"Document";const n=t.split("/");return n[n.length-1]||t}async listWorkspaceIdsForPathResolution(){const e=[],t=new Set,n=s=>{if(typeof s!="string")return;const i=s.trim();!i||t.has(i)||(t.add(i),e.push(i))};n(this.selectedWorkspace?.id);for(const s of this.workspaces??[])n(s.id);if(e.length>0||!this.client||!this.connected)return e;try{const s=await this.client.request("workspaces.list",{});for(const i of s.workspaces??[])n(i.id)}catch{}return e}async openWorkspaceRelativeFileInViewer(e){if(!this.client||!this.connected)return!1;const t=await this.listWorkspaceIdsForPathResolution();for(const n of t)try{const s=await this.client.request("workspaces.readFile",{workspaceId:n,filePath:e});if(typeof s.content!="string")continue;return this.handleOpenSidebar(s.content,{mimeType:s.contentType??s.mime??this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0}catch{}return!1}extractWorkspacePathCandidatesFromHref(e){const t=e.trim();if(!t)return[];const n=[],s=t.toLowerCase();if(s.startsWith("mailto:")||s.startsWith("tel:")||s.startsWith("javascript:")||s.startsWith("data:"))return[];const i=/^[a-z][a-z0-9+.-]*:/i.test(t),a=/^[a-z]:[\\/]/i.test(t);(!i||a)&&n.push(t);let o=null;try{o=new URL(t,window.location.href)}catch{o=null}if(o&&/^https?:$/.test(o.protocol)&&o.origin===window.location.origin){for(const m of p0){const k=o.searchParams.get(m);k&&n.push(k)}const p=(t.split("#")[0]??"").split("?")[0]??"";p.length>0&&!p.startsWith("/")&&!p.includes("://")&&n.push(p);let g=o.pathname;this.basePath&&g.startsWith(`${this.basePath}/`)?g=g.slice(this.basePath.length):this.basePath&&g===this.basePath&&(g="");const d=g.startsWith("/")?g.slice(1):g;if(d){n.push(d);const m=d.indexOf("/");if(m>0){const k=d.slice(0,m).toLowerCase();Qr.has(k)&&n.push(d.slice(m+1))}}if(g.startsWith("/")&&d){const m=d.split("/")[0]?.toLowerCase()??"";Qr.has(m)||n.push(g)}}const l=[],c=new Set;for(const u of n){let p=u;try{p=decodeURIComponent(u)}catch{}const h=this.normalizeWorkspacePathCandidate(p,{allowAbsolute:!0});!h||c.has(h)||(c.add(h),l.push(h))}return l}async openWorkspaceFileInViewer(e){if(!this.client||!this.connected)return!1;const t=this.isAbsoluteFilesystemPath(e);if(!t&&await this.openWorkspaceRelativeFileInViewer(e))return!0;try{const n=await this.client.request("workspaces.readFile",{path:e});if(typeof n.content=="string")return this.handleOpenSidebar(n.content,{mimeType:n.contentType??n.mime??this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0}catch{}if(!t)return!1;try{const n=await this.client.request("files.read",{path:e,maxSize:1e6});return typeof n.content!="string"?!1:(this.handleOpenSidebar(n.content,{mimeType:this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0)}catch{return!1}}async handleOpenMessageFileLink(e){const t=this.extractWorkspacePathCandidatesFromHref(e);if(t.length===0)return!1;for(const n of t)if(await this.openWorkspaceFileInViewer(n))return!0;return!1}showToast(e,t="info",n=3e3){const s=o0(e,t,n);this.toasts=l0(this.toasts,s),n>0&&window.setTimeout(()=>{this.dismissToast(s.id)},n)}dismissToast(e){this.toasts=r0(this.toasts,e)}async handleMissionRefresh(){await Mh(this)}async handleMissionTaskComplete(e){await Rh(this,e)}handleMissionOpenDeck(){window.open("/deck/","_blank","noopener,noreferrer")}async handleMyDayRefresh(){if(this.todayViewMode==="agent-log"){await At(this,{refresh:!0});return}await Ei(this)}async handleMyDayTaskStatusChange(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,updates:{status:t,completedAt:t==="complete"?new Date().toISOString():null}})}catch(n){console.error("[MyDay] Failed to update task status:",n)}}handleDatePrev(){const e=new Date(this.todaySelectedDate+"T12:00:00");if(e.setDate(e.getDate()-1),this.todaySelectedDate=e.toISOString().split("T")[0],this.todayViewMode==="agent-log"){At(this);return}Zs(this)}handleDateNext(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()+1);const t=new Date().toISOString().split("T")[0],n=e.toISOString().split("T")[0];if(!(n>t)){if(this.todaySelectedDate=n,this.todayViewMode==="agent-log"){At(this);return}Zs(this)}}handleDateToday(){this.todaySelectedDate=new Date().toISOString().split("T")[0],Ei(this)}async handleDailyBriefRefresh(){await Zs(this)}handleDailyBriefOpenInObsidian(){const e=this.dailyBrief?.date;Rf(e)}async loadBriefNotes(){if(!this.client||!this.connected)return;const e=this.todaySelectedDate;try{const t=await this.client.request("briefNotes.get",{date:e});this.briefNotes=t.notes??{}}catch(t){console.error("[BriefNotes] Load error:",t),this.briefNotes={}}}async handleBriefNoteSave(e,t){if(!this.client||!this.connected)return;const n=this.todaySelectedDate;try{const s=await this.client.request("briefNotes.update",{date:n,section:e,text:t});this.briefNotes=s.notes??{}}catch(s){console.error("[BriefNotes] Save error:",s),this.showToast("Failed to save note","error")}}handleTodayViewModeChange(e){this.todayViewMode=e,e==="agent-log"&&!this.agentLog&&At(this)}handlePrivateModeToggle(){if(this.chatPrivateMode){this.chatPrivateMode=!1,this.showToast("Private mode OFF","info",2e3);return}this.chatPrivateMode=!0,this.setTab("chat"),Be(async()=>{const{createNewSession:e}=await Promise.resolve().then(()=>ni);return{createNewSession:e}},void 0,import.meta.url).then(({createNewSession:e})=>{e(this),this.chatMessages=[{role:"assistant",content:"This is a **private chat**. Nothing from this conversation will be saved to memory. The session will be deleted when you close it or after 24 hours.",timestamp:Date.now()}],this.requestUpdate()}),this.showToast("Private mode ON — new private chat created","info",3e3)}async handleBriefSave(e){if(!this.client||!this.connected)return;const t=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.update",{date:t,content:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,content:e,updatedAt:new Date().toISOString()})}catch(n){console.error("[DailyBrief] Save error:",n),this.showToast("Failed to save brief","error")}}handleBriefEditStart(){this.briefEditing=!0}handleBriefEditEnd(){this.briefEditing=!1}async handleSendToSage(e){await e0(this,e)}handleBackToSessions(){t0(this)}async handleWorkRefresh(){await dc(this)}handleWorkToggleProject(e){const t=new Set(this.workExpandedProjects);t.has(e)?t.delete(e):(t.add(e),this.workProjectFiles[e]||Kf(this,e)),this.workExpandedProjects=t}handleWorkPersonClick(e){this.peopleSelected=e,this.setTab("people")}async handleWorkFileClick(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("workspaces.readFile",{path:e});if(!t.content){this.showToast(t.error??"Failed to read file","error");return}this.handleOpenSidebar(t.content,{mimeType:t.contentType??t.mime??this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)})}catch(t){console.error("[Work] Failed to read file:",t),this.showToast(`Failed to open: ${e}`,"error")}}handleWorkSkillClick(e,t){this.handleStartChatWithPrompt(`Tell me about the "${e}" skill and how it's used in the ${t} project.`)}async handlePeopleRefresh(){await cc(this)}handlePeopleSelect(e){this.peopleSelected=e}handlePeopleBack(){this.peopleSelected=null}handlePeopleSearch(e){this.peopleSearchQuery=e}handlePeopleImport(e){const t=e==="apple"?"Import my contacts from Apple Contacts and organize them into categories.":"Import my contacts from Google Contacts and organize them into categories.";this.handleStartChatWithPrompt(t)}async handleWorkspacesRefresh(){await ps(this)}async handleWheelOfLifeRefresh(){await Jn(this)}handleWheelOfLifeEdit(){Uf(this)}handleWheelOfLifeCancel(){er(this)}async handleWheelOfLifeSave(e){await Ff(this,e),er(this)}async handleVisionBoardRefresh(){await Ii(this)}async handleLifetracksRefresh(){await Qn(this)}handleLifetracksSelectTrack(e){_f(this,e)}async handleLifetracksEnable(){await Tf(this)}async handleLifetracksGenerate(){await Cf(this)}handleLifeSubtabChange(e){this.lifeSubtab=e,e==="goals"&&!this.goals&&!this.goalsLoading&&this.handleGoalsRefresh()}async handleGoalsRefresh(){if(!(!this.client||!this.connected)){this.goalsLoading=!0,this.goalsError=null;try{const e=await this.client.request("goals.get",{});this.goals=e.goals??[]}catch(e){this.goalsError=e instanceof Error?e.message:"Failed to load goals",console.error("[Goals] Load error:",e)}finally{this.goalsLoading=!1}}}handleOnboardingStart(){this.onboardingPhase=1,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:1}),this.client?.request("onboarding.update",{phase:1,completePhase:0})}async handleOnboardingIdentitySubmit(e){if(this.client)try{await this.client.request("onboarding.update",{phase:2,completePhase:1,identity:e}),this.onboardingPhase=2,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:2,identity:e}),this.userName=e.name,this.userAvatar=e.emoji,this.applySettings({...this.settings,userName:e.name,userAvatar:e.emoji}),this.setTab("chat"),Be(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>ni);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this);const n=`I just set up my GodMode identity. My name is ${e.name}${e.mission?` and my mission is: ${e.mission}`:""}. Let's set up my workspace.`;this.chatMessage=n,this.handleSendChat(n)})}catch(t){console.error("[Onboarding] Identity submit failed:",t),this.showToast("Failed to save identity","error")}}handleOnboardingSkipPhase(){if(!this.client)return;const e=Math.min(this.onboardingPhase+1,6);this.onboardingPhase=e,this.client.request("onboarding.update",{phase:e,completePhase:this.onboardingPhase})}handleOnboardingComplete(){this.onboardingActive=!1,this.onboardingPhase=6,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:6,completedAt:new Date().toISOString()}),this.client?.request("onboarding.complete",{summary:this.onboardingData?.summary??null}),this.showToast("Welcome to GodMode!","success",4e3)}handleStartChatWithPrompt(e){this.setTab("chat"),Be(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>ni);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this),this.chatMessage=e,this.requestUpdate()})}async handleDataRefresh(){if(!(!this.client||!this.connected)){this.dataLoading=!0,this.dataError=null;try{const e=await this.client.request("dataSources.list",{});this.dataSources=e.sources??[]}catch(e){this.dataError=e instanceof Error?e.message:"Failed to load data sources",console.error("[Data] Load error:",e)}finally{this.dataLoading=!1}}}handleDataSubtabChange(e){this.dataSubtab=e}handleDataConnectSource(e){const n=this.dataSources?.find(s=>s.id===e)?.name??e;this.handleStartChatWithPrompt(`Help me connect and configure the ${n} integration.`)}handleDataQuerySubmit(e){this.handleStartChatWithPrompt(`Query my connected data: ${e}`)}handleUpdateUserProfile(e,t){const n=e.trim().slice(0,50),s=t.trim();this.userName=n||"You",this.userAvatar=s||null,this.applySettings({...this.settings,userName:n,userAvatar:s})}render(){return Zw(this)}};y([b()],v.prototype,"settings",2);y([b()],v.prototype,"password",2);y([b()],v.prototype,"tab",2);y([b()],v.prototype,"onboarding",2);y([b()],v.prototype,"connected",2);y([b()],v.prototype,"reconnecting",2);y([b()],v.prototype,"reconnectAttempt",2);y([b()],v.prototype,"theme",2);y([b()],v.prototype,"themeResolved",2);y([b()],v.prototype,"hello",2);y([b()],v.prototype,"lastError",2);y([b()],v.prototype,"eventLog",2);y([b()],v.prototype,"assistantName",2);y([b()],v.prototype,"assistantAvatar",2);y([b()],v.prototype,"assistantAgentId",2);y([b()],v.prototype,"userName",2);y([b()],v.prototype,"userAvatar",2);y([b()],v.prototype,"sessionKey",2);y([b()],v.prototype,"sessionPickerOpen",2);y([b()],v.prototype,"sessionPickerPosition",2);y([b()],v.prototype,"sessionPickerSearch",2);y([b()],v.prototype,"sessionSearchOpen",2);y([b()],v.prototype,"sessionSearchPosition",2);y([b()],v.prototype,"sessionSearchQuery",2);y([b()],v.prototype,"sessionSearchResults",2);y([b()],v.prototype,"sessionSearchLoading",2);y([b()],v.prototype,"profilePopoverOpen",2);y([b()],v.prototype,"profileEditName",2);y([b()],v.prototype,"profileEditAvatar",2);y([b()],v.prototype,"editingTabKey",2);y([b()],v.prototype,"chatLoading",2);y([b()],v.prototype,"chatSending",2);y([b()],v.prototype,"chatSendingSessionKey",2);y([b()],v.prototype,"chatMessage",2);y([b()],v.prototype,"chatDrafts",2);y([b()],v.prototype,"chatMessages",2);y([b()],v.prototype,"chatToolMessages",2);y([b()],v.prototype,"chatStream",2);y([b()],v.prototype,"chatStreamStartedAt",2);y([b()],v.prototype,"chatRunId",2);y([b()],v.prototype,"currentToolName",2);y([b()],v.prototype,"currentToolInfo",2);y([b()],v.prototype,"workingSessions",2);y([b()],v.prototype,"compactionStatus",2);y([b()],v.prototype,"chatAvatarUrl",2);y([b()],v.prototype,"chatThinkingLevel",2);y([b()],v.prototype,"chatQueue",2);y([b()],v.prototype,"chatAttachments",2);y([b()],v.prototype,"pendingRetry",2);y([b()],v.prototype,"sidebarOpen",2);y([b()],v.prototype,"sidebarContent",2);y([b()],v.prototype,"sidebarError",2);y([b()],v.prototype,"sidebarMimeType",2);y([b()],v.prototype,"sidebarFilePath",2);y([b()],v.prototype,"sidebarTitle",2);y([b()],v.prototype,"splitRatio",2);y([b()],v.prototype,"updateStatus",2);y([b()],v.prototype,"updateLoading",2);y([b()],v.prototype,"updateError",2);y([b()],v.prototype,"updateLastChecked",2);y([b()],v.prototype,"nodesLoading",2);y([b()],v.prototype,"nodes",2);y([b()],v.prototype,"devicesLoading",2);y([b()],v.prototype,"devicesError",2);y([b()],v.prototype,"devicesList",2);y([b()],v.prototype,"execApprovalsLoading",2);y([b()],v.prototype,"execApprovalsSaving",2);y([b()],v.prototype,"execApprovalsDirty",2);y([b()],v.prototype,"execApprovalsSnapshot",2);y([b()],v.prototype,"execApprovalsForm",2);y([b()],v.prototype,"execApprovalsSelectedAgent",2);y([b()],v.prototype,"execApprovalsTarget",2);y([b()],v.prototype,"execApprovalsTargetNodeId",2);y([b()],v.prototype,"execApprovalQueue",2);y([b()],v.prototype,"execApprovalBusy",2);y([b()],v.prototype,"execApprovalError",2);y([b()],v.prototype,"pendingGatewayUrl",2);y([b()],v.prototype,"configLoading",2);y([b()],v.prototype,"configRaw",2);y([b()],v.prototype,"configRawOriginal",2);y([b()],v.prototype,"configValid",2);y([b()],v.prototype,"configIssues",2);y([b()],v.prototype,"configSaving",2);y([b()],v.prototype,"configApplying",2);y([b()],v.prototype,"updateRunning",2);y([b()],v.prototype,"applySessionKey",2);y([b()],v.prototype,"configSnapshot",2);y([b()],v.prototype,"configSchema",2);y([b()],v.prototype,"configSchemaVersion",2);y([b()],v.prototype,"configSchemaLoading",2);y([b()],v.prototype,"configUiHints",2);y([b()],v.prototype,"configForm",2);y([b()],v.prototype,"configFormOriginal",2);y([b()],v.prototype,"configFormDirty",2);y([b()],v.prototype,"configFormMode",2);y([b()],v.prototype,"configSearchQuery",2);y([b()],v.prototype,"configActiveSection",2);y([b()],v.prototype,"configActiveSubsection",2);y([b()],v.prototype,"channelsLoading",2);y([b()],v.prototype,"channelsSnapshot",2);y([b()],v.prototype,"channelsError",2);y([b()],v.prototype,"channelsLastSuccess",2);y([b()],v.prototype,"whatsappLoginMessage",2);y([b()],v.prototype,"whatsappLoginQrDataUrl",2);y([b()],v.prototype,"whatsappLoginConnected",2);y([b()],v.prototype,"whatsappBusy",2);y([b()],v.prototype,"nostrProfileFormState",2);y([b()],v.prototype,"nostrProfileAccountId",2);y([b()],v.prototype,"presenceLoading",2);y([b()],v.prototype,"presenceEntries",2);y([b()],v.prototype,"presenceError",2);y([b()],v.prototype,"presenceStatus",2);y([b()],v.prototype,"agentsLoading",2);y([b()],v.prototype,"agentsList",2);y([b()],v.prototype,"agentsError",2);y([b()],v.prototype,"sessionsLoading",2);y([b()],v.prototype,"sessionsResult",2);y([b()],v.prototype,"sessionsError",2);y([b()],v.prototype,"sessionsFilterActive",2);y([b()],v.prototype,"sessionsFilterLimit",2);y([b()],v.prototype,"sessionsIncludeGlobal",2);y([b()],v.prototype,"sessionsIncludeUnknown",2);y([b()],v.prototype,"cronLoading",2);y([b()],v.prototype,"cronJobs",2);y([b()],v.prototype,"cronStatus",2);y([b()],v.prototype,"cronError",2);y([b()],v.prototype,"cronForm",2);y([b()],v.prototype,"cronRunsJobId",2);y([b()],v.prototype,"cronRuns",2);y([b()],v.prototype,"cronBusy",2);y([b()],v.prototype,"missionLoading",2);y([b()],v.prototype,"missionError",2);y([b()],v.prototype,"missionAgents",2);y([b()],v.prototype,"missionActiveRuns",2);y([b()],v.prototype,"missionSubagentRuns",2);y([b()],v.prototype,"missionTasks",2);y([b()],v.prototype,"missionFeedItems",2);y([b()],v.prototype,"workspaceNeedsSetup",2);y([b()],v.prototype,"onboardingPhase",2);y([b()],v.prototype,"onboardingData",2);y([b()],v.prototype,"onboardingActive",2);y([b()],v.prototype,"workspaces",2);y([b()],v.prototype,"selectedWorkspace",2);y([b()],v.prototype,"workspacesSearchQuery",2);y([b()],v.prototype,"workspaceItemSearchQuery",2);y([b()],v.prototype,"workspacesLoading",2);y([b()],v.prototype,"workspacesCreateLoading",2);y([b()],v.prototype,"workspacesError",2);y([b()],v.prototype,"myDayLoading",2);y([b()],v.prototype,"myDayError",2);y([b()],v.prototype,"todaySelectedDate",2);y([b()],v.prototype,"todayViewMode",2);y([b()],v.prototype,"dailyBrief",2);y([b()],v.prototype,"dailyBriefLoading",2);y([b()],v.prototype,"dailyBriefError",2);y([b()],v.prototype,"agentLog",2);y([b()],v.prototype,"agentLogLoading",2);y([b()],v.prototype,"agentLogError",2);y([b()],v.prototype,"briefNotes",2);y([b()],v.prototype,"briefEditing",2);y([b()],v.prototype,"chatPrivateMode",2);y([b()],v.prototype,"lifeSubtab",2);y([b()],v.prototype,"goals",2);y([b()],v.prototype,"goalsLoading",2);y([b()],v.prototype,"goalsError",2);y([b()],v.prototype,"dataSources",2);y([b()],v.prototype,"dataLoading",2);y([b()],v.prototype,"dataError",2);y([b()],v.prototype,"dataSubtab",2);y([b()],v.prototype,"dynamicSlots",2);y([b()],v.prototype,"workProjects",2);y([b()],v.prototype,"workLoading",2);y([b()],v.prototype,"workError",2);y([b()],v.prototype,"workExpandedProjects",2);y([b()],v.prototype,"workProjectFiles",2);y([b()],v.prototype,"workDetailLoading",2);y([b()],v.prototype,"peopleList",2);y([b()],v.prototype,"peopleLoading",2);y([b()],v.prototype,"peopleError",2);y([b()],v.prototype,"peopleSelected",2);y([b()],v.prototype,"peopleSearchQuery",2);y([b()],v.prototype,"innerWorkMessages",2);y([b()],v.prototype,"innerWorkActiveSession",2);y([b()],v.prototype,"innerWorkInput",2);y([b()],v.prototype,"innerWorkLoading",2);y([b()],v.prototype,"innerWorkError",2);y([b()],v.prototype,"wheelOfLifeData",2);y([b()],v.prototype,"wheelOfLifeLoading",2);y([b()],v.prototype,"wheelOfLifeError",2);y([b()],v.prototype,"wheelOfLifeEditMode",2);y([b()],v.prototype,"visionBoardData",2);y([b()],v.prototype,"visionBoardLoading",2);y([b()],v.prototype,"visionBoardError",2);y([b()],v.prototype,"visionBoardIdentityToday",2);y([b()],v.prototype,"lifetracksData",2);y([b()],v.prototype,"lifetracksLoading",2);y([b()],v.prototype,"lifetracksError",2);y([b()],v.prototype,"lifetracksCurrentTrack",2);y([b()],v.prototype,"lifetracksConfig",2);y([b()],v.prototype,"lifetracksGenerating",2);y([b()],v.prototype,"lifetracksGenerationError",2);y([b()],v.prototype,"skillsLoading",2);y([b()],v.prototype,"skillsReport",2);y([b()],v.prototype,"skillsError",2);y([b()],v.prototype,"skillsFilter",2);y([b()],v.prototype,"skillEdits",2);y([b()],v.prototype,"skillsBusyKey",2);y([b()],v.prototype,"skillMessages",2);y([b()],v.prototype,"debugLoading",2);y([b()],v.prototype,"debugStatus",2);y([b()],v.prototype,"debugHealth",2);y([b()],v.prototype,"debugModels",2);y([b()],v.prototype,"debugHeartbeat",2);y([b()],v.prototype,"debugCallMethod",2);y([b()],v.prototype,"debugCallParams",2);y([b()],v.prototype,"debugCallResult",2);y([b()],v.prototype,"debugCallError",2);y([b()],v.prototype,"logsLoading",2);y([b()],v.prototype,"logsError",2);y([b()],v.prototype,"logsFile",2);y([b()],v.prototype,"logsEntries",2);y([b()],v.prototype,"logsFilterText",2);y([b()],v.prototype,"logsLevelFilters",2);y([b()],v.prototype,"logsAutoFollow",2);y([b()],v.prototype,"logsTruncated",2);y([b()],v.prototype,"logsCursor",2);y([b()],v.prototype,"logsLastFetchAt",2);y([b()],v.prototype,"logsLimit",2);y([b()],v.prototype,"logsMaxBytes",2);y([b()],v.prototype,"logsAtBottom",2);y([b()],v.prototype,"toasts",2);y([b()],v.prototype,"chatNewMessagesBelow",2);y([b()],v.prototype,"consciousnessStatus",2);v=y([il("godmode-app")],v);
