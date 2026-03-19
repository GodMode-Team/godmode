(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const rp="modulepreload",lp=function(e,t){return new URL(e,t).href},_r={},R=function(t,n,s){let i=Promise.resolve();if(n&&n.length>0){let u=function(l){return Promise.all(l.map(h=>Promise.resolve(h).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),d=c?.nonce||c?.getAttribute("nonce");i=u(n.map(l=>{if(l=lp(l,s),l in _r)return;_r[l]=!0;const h=l.endsWith(".css"),f=h?'[rel="stylesheet"]':"";if(s)for(let b=o.length-1;b>=0;b--){const $=o[b];if($.href===l&&(!h||$.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${f}`))return;const v=document.createElement("link");if(v.rel=h?"stylesheet":rp,h||(v.as="script"),v.crossOrigin="",v.href=l,d&&v.setAttribute("nonce",d),document.head.appendChild(v),h)return new Promise((b,$)=>{v.addEventListener("load",b),v.addEventListener("error",()=>$(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return i.then(o=>{for(const c of o||[])c.status==="rejected"&&a(c.reason);return t().catch(a)})};const Fs=globalThis,eo=Fs.ShadowRoot&&(Fs.ShadyCSS===void 0||Fs.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,to=Symbol(),Ar=new WeakMap;let Pc=class{constructor(t,n,s){if(this._$cssResult$=!0,s!==to)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o;const n=this.t;if(eo&&t===void 0){const s=n!==void 0&&n.length===1;s&&(t=Ar.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ar.set(n,t))}return t}toString(){return this.cssText}};const cp=e=>new Pc(typeof e=="string"?e:e+"",void 0,to),dp=(e,...t)=>{const n=e.length===1?e[0]:t.reduce((s,i,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new Pc(n,e,to)},up=(e,t)=>{if(eo)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of t){const s=document.createElement("style"),i=Fs.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=n.cssText,e.appendChild(s)}},Tr=eo?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(const s of t.cssRules)n+=s.cssText;return cp(n)})(e):e;const{is:hp,defineProperty:pp,getOwnPropertyDescriptor:fp,getOwnPropertyNames:gp,getOwnPropertySymbols:mp,getPrototypeOf:yp}=Object,hi=globalThis,Cr=hi.trustedTypes,vp=Cr?Cr.emptyScript:"",bp=hi.reactiveElementPolyfillSupport,Yn=(e,t)=>e,Vs={toAttribute(e,t){switch(t){case Boolean:e=e?vp:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},no=(e,t)=>!hp(e,t),Er={attribute:!0,type:String,converter:Vs,reflect:!1,useDefault:!1,hasChanged:no};Symbol.metadata??=Symbol("metadata"),hi.litPropertyMetadata??=new WeakMap;let pn=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=Er){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,n);i!==void 0&&pp(this.prototype,t,i)}}static getPropertyDescriptor(t,n,s){const{get:i,set:a}=fp(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:i,set(o){const c=i?.call(this);a?.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Er}static _$Ei(){if(this.hasOwnProperty(Yn("elementProperties")))return;const t=yp(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Yn("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Yn("properties"))){const n=this.properties,s=[...gp(n),...mp(n)];for(const i of s)this.createProperty(i,n[i])}const t=this[Symbol.metadata];if(t!==null){const n=litPropertyMetadata.get(t);if(n!==void 0)for(const[s,i]of n)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[n,s]of this.elementProperties){const i=this._$Eu(n,s);i!==void 0&&this._$Eh.set(i,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const n=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)n.unshift(Tr(i))}else t!==void 0&&n.push(Tr(t));return n}static _$Eu(t,n){const s=n.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,n=this.constructor.elementProperties;for(const s of n.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return up(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,s){this._$AK(t,s)}_$ET(t,n){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const a=(s.converter?.toAttribute!==void 0?s.converter:Vs).toAttribute(n,s.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,n){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Vs;this._$Em=i;const c=o.fromAttribute(n,a.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,n,s,i=!1,a){if(t!==void 0){const o=this.constructor;if(i===!1&&(a=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??no)(a,n)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,n,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),a!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(n=void 0),this._$AL.set(t,n)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,a]of s){const{wrapped:o}=a,c=this[i];o!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,a,c)}}let t=!1;const n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(n)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};pn.elementStyles=[],pn.shadowRootOptions={mode:"open"},pn[Yn("elementProperties")]=new Map,pn[Yn("finalized")]=new Map,bp?.({ReactiveElement:pn}),(hi.reactiveElementVersions??=[]).push("2.1.2");const so=globalThis,Rr=e=>e,Gs=so.trustedTypes,Lr=Gs?Gs.createPolicy("lit-html",{createHTML:e=>e}):void 0,Dc="$lit$",ft=`lit$${Math.random().toFixed(9).slice(2)}$`,Ic="?"+ft,wp=`<${Ic}>`,Wt=document,ns=()=>Wt.createComment(""),ss=e=>e===null||typeof e!="object"&&typeof e!="function",io=Array.isArray,kp=e=>io(e)||typeof e?.[Symbol.iterator]=="function",Ki=`[ 	
\f\r]`,Dn=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pr=/-->/g,Dr=/>/g,Rt=RegExp(`>|${Ki}(?:([^\\s"'>=/]+)(${Ki}*=${Ki}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ir=/'/g,Mr=/"/g,Mc=/^(?:script|style|textarea|title)$/i,$p=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),r=$p(1),wt=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Or=new WeakMap,Ut=Wt.createTreeWalker(Wt,129);function Oc(e,t){if(!io(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Lr!==void 0?Lr.createHTML(t):t}const Sp=(e,t)=>{const n=e.length-1,s=[];let i,a=t===2?"<svg>":t===3?"<math>":"",o=Dn;for(let c=0;c<n;c++){const d=e[c];let u,l,h=-1,f=0;for(;f<d.length&&(o.lastIndex=f,l=o.exec(d),l!==null);)f=o.lastIndex,o===Dn?l[1]==="!--"?o=Pr:l[1]!==void 0?o=Dr:l[2]!==void 0?(Mc.test(l[2])&&(i=RegExp("</"+l[2],"g")),o=Rt):l[3]!==void 0&&(o=Rt):o===Rt?l[0]===">"?(o=i??Dn,h=-1):l[1]===void 0?h=-2:(h=o.lastIndex-l[2].length,u=l[1],o=l[3]===void 0?Rt:l[3]==='"'?Mr:Ir):o===Mr||o===Ir?o=Rt:o===Pr||o===Dr?o=Dn:(o=Rt,i=void 0);const v=o===Rt&&e[c+1].startsWith("/>")?" ":"";a+=o===Dn?d+wp:h>=0?(s.push(u),d.slice(0,h)+Dc+d.slice(h)+ft+v):d+ft+(h===-2?c:v)}return[Oc(e,a+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class is{constructor({strings:t,_$litType$:n},s){let i;this.parts=[];let a=0,o=0;const c=t.length-1,d=this.parts,[u,l]=Sp(t,n);if(this.el=is.createElement(u,s),Ut.currentNode=this.el.content,n===2||n===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=Ut.nextNode())!==null&&d.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(Dc)){const f=l[o++],v=i.getAttribute(h).split(ft),b=/([.?@])?(.*)/.exec(f);d.push({type:1,index:a,name:b[2],strings:v,ctor:b[1]==="."?_p:b[1]==="?"?Ap:b[1]==="@"?Tp:fi}),i.removeAttribute(h)}else h.startsWith(ft)&&(d.push({type:6,index:a}),i.removeAttribute(h));if(Mc.test(i.tagName)){const h=i.textContent.split(ft),f=h.length-1;if(f>0){i.textContent=Gs?Gs.emptyScript:"";for(let v=0;v<f;v++)i.append(h[v],ns()),Ut.nextNode(),d.push({type:2,index:++a});i.append(h[f],ns())}}}else if(i.nodeType===8)if(i.data===Ic)d.push({type:2,index:a});else{let h=-1;for(;(h=i.data.indexOf(ft,h+1))!==-1;)d.push({type:7,index:a}),h+=ft.length-1}a++}}static createElement(t,n){const s=Wt.createElement("template");return s.innerHTML=t,s}}function bn(e,t,n=e,s){if(t===wt)return t;let i=s!==void 0?n._$Co?.[s]:n._$Cl;const a=ss(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,s)),s!==void 0?(n._$Co??=[])[s]=i:n._$Cl=i),i!==void 0&&(t=bn(e,i._$AS(e,t.values),i,s)),t}class xp{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:n},parts:s}=this._$AD,i=(t?.creationScope??Wt).importNode(n,!0);Ut.currentNode=i;let a=Ut.nextNode(),o=0,c=0,d=s[0];for(;d!==void 0;){if(o===d.index){let u;d.type===2?u=new pi(a,a.nextSibling,this,t):d.type===1?u=new d.ctor(a,d.name,d.strings,this,t):d.type===6&&(u=new Cp(a,this,t)),this._$AV.push(u),d=s[++c]}o!==d?.index&&(a=Ut.nextNode(),o++)}return Ut.currentNode=Wt,i}p(t){let n=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,n),n+=s.strings.length-2):s._$AI(t[n])),n++}}let pi=class Bc{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=bn(this,t,n),ss(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==wt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):kp(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&ss(this._$AH)?this._$AA.nextSibling.data=t:this.T(Wt.createTextNode(t)),this._$AH=t}$(t){const{values:n,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=is.createElement(Oc(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(n);else{const a=new xp(i,this),o=a.u(this.options);a.p(n),this.T(o),this._$AH=a}}_$AC(t){let n=Or.get(t.strings);return n===void 0&&Or.set(t.strings,n=new is(t)),n}k(t){io(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let s,i=0;for(const a of t)i===n.length?n.push(s=new Bc(this.O(ns()),this.O(ns()),this,this.options)):s=n[i],s._$AI(a),i++;i<n.length&&(this._$AR(s&&s._$AB.nextSibling,i),n.length=i)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){const s=Rr(t).nextSibling;Rr(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},fi=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,s,i,a){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=n,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,n=this,s,i){const a=this.strings;let o=!1;if(a===void 0)t=bn(this,t,n,0),o=!ss(t)||t!==this._$AH&&t!==wt,o&&(this._$AH=t);else{const c=t;let d,u;for(t=a[0],d=0;d<a.length-1;d++)u=bn(this,c[s+d],n,d),u===wt&&(u=this._$AH[d]),o||=!ss(u)||u!==this._$AH[d],u===p?t=p:t!==p&&(t+=(u??"")+a[d+1]),this._$AH[d]=u}o&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},_p=class extends fi{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},Ap=class extends fi{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},Tp=class extends fi{constructor(t,n,s,i,a){super(t,n,s,i,a),this.type=5}_$AI(t,n=this){if((t=bn(this,t,n,0)??p)===wt)return;const s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Cp=class{constructor(t,n,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){bn(this,t)}};const Ep={I:pi},Rp=so.litHtmlPolyfillSupport;Rp?.(is,pi),(so.litHtmlVersions??=[]).push("3.3.2");const Lp=(e,t,n)=>{const s=n?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const a=n?.renderBefore??null;s._$litPart$=i=new pi(t.insertBefore(ns(),a),a,void 0,n??{})}return i._$AI(e),i};const ao=globalThis;let He=class extends pn{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Lp(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return wt}};He._$litElement$=!0,He.finalized=!0,ao.litElementHydrateSupport?.({LitElement:He});const Pp=ao.litElementPolyfillSupport;Pp?.({LitElement:He});(ao.litElementVersions??=[]).push("4.2.2");const _n=e=>(t,n)=>{n!==void 0?n.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};const Dp={attribute:!0,type:String,converter:Vs,reflect:!1,hasChanged:no},Ip=(e=Dp,t,n)=>{const{kind:s,metadata:i}=n;let a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),s==="setter"&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),s==="accessor"){const{name:o}=n;return{set(c){const d=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,d,e,!0,c)},init(c){return c!==void 0&&this.C(o,void 0,e,c),c}}}if(s==="setter"){const{name:o}=n;return function(c){const d=this[o];t.call(this,c),this.requestUpdate(o,d,e,!0,c)}}throw Error("Unsupported decorator location: "+s)};function hs(e){return(t,n)=>typeof n=="object"?Ip(e,t,n):((s,i,a)=>{const o=i.hasOwnProperty(a);return i.constructor.createProperty(a,s),o?Object.getOwnPropertyDescriptor(i,a):void 0})(e,t,n)}function g(e){return hs({...e,state:!0,attribute:!1})}let Fc=class extends Event{constructor(t,n,s,i){super("context-request",{bubbles:!0,composed:!0}),this.context=t,this.contextTarget=n,this.callback=s,this.subscribe=i??!1}};let Br=class{constructor(t,n,s,i){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(a,o)=>{this.unsubscribe&&(this.unsubscribe!==o&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=a,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(a,o)),this.unsubscribe=o},this.host=t,n.context!==void 0){const a=n;this.context=a.context,this.callback=a.callback,this.subscribe=a.subscribe??!1}else this.context=n,this.callback=s,this.subscribe=i??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0)}dispatchRequest(){this.host.dispatchEvent(new Fc(this.context,this.host,this.t,this.subscribe))}};let Mp=class{get value(){return this.o}set value(t){this.setValue(t)}setValue(t,n=!1){const s=n||!Object.is(t,this.o);this.o=t,s&&this.updateObservers()}constructor(t){this.subscriptions=new Map,this.updateObservers=()=>{for(const[n,{disposer:s}]of this.subscriptions)n(this.o,s)},t!==void 0&&(this.value=t)}addCallback(t,n,s){if(!s)return void t(this.value);this.subscriptions.has(t)||this.subscriptions.set(t,{disposer:()=>{this.subscriptions.delete(t)},consumerHost:n});const{disposer:i}=this.subscriptions.get(t);t(this.value,i)}clearCallbacks(){this.subscriptions.clear()}};let Op=class extends Event{constructor(t,n){super("context-provider",{bubbles:!0,composed:!0}),this.context=t,this.contextTarget=n}},Fr=class extends Mp{constructor(t,n,s){super(n.context!==void 0?n.initialValue:s),this.onContextRequest=i=>{if(i.context!==this.context)return;const a=i.contextTarget??i.composedPath()[0];a!==this.host&&(i.stopPropagation(),this.addCallback(i.callback,a,i.subscribe))},this.onProviderRequest=i=>{if(i.context!==this.context||(i.contextTarget??i.composedPath()[0])===this.host)return;const a=new Set;for(const[o,{consumerHost:c}]of this.subscriptions)a.has(o)||(a.add(o),c.dispatchEvent(new Fc(this.context,c,o,!0)));i.stopPropagation()},this.host=t,n.context!==void 0?this.context=n.context:this.context=n,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener("context-request",this.onContextRequest),this.host.addEventListener("context-provider",this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new Op(this.context,this.host))}};function Bp({context:e}){return(t,n)=>{const s=new WeakMap;if(typeof n=="object")return{get(){return t.get.call(this)},set(i){return s.get(this).setValue(i),t.set.call(this,i)},init(i){return s.set(this,new Fr(this,{context:e,initialValue:i})),i}};{t.constructor.addInitializer((o=>{s.set(o,new Fr(o,{context:e}))}));const i=Object.getOwnPropertyDescriptor(t,n);let a;if(i===void 0){const o=new WeakMap;a={get(){return o.get(this)},set(c){s.get(this).setValue(c),o.set(this,c)},configurable:!0,enumerable:!0}}else{const o=i.set;a={...i,set(c){s.get(this).setValue(c),o?.call(this,c)}}}return void Object.defineProperty(t,n,a)}}}function gi({context:e,subscribe:t}){return(n,s)=>{typeof s=="object"?s.addInitializer((function(){new Br(this,{context:e,callback:i=>{n.set.call(this,i)},subscribe:t})})):n.constructor.addInitializer((i=>{new Br(i,{context:e,callback:a=>{i[s]=a},subscribe:t})}))}}const ps=Symbol("app-context"),Es=()=>{},Fp=()=>Promise.resolve(void 0);function Np(){return{connected:!1,reconnecting:!1,sessionKey:"main",assistantName:"Prosper",assistantAvatar:null,userName:"",userAvatar:null,theme:"system",themeResolved:"dark",settings:{gatewayUrl:"",token:"",sessionKey:"main",lastActiveSessionKey:"",theme:"system",chatFocusMode:!1,chatShowThinking:!1,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]},basePath:"",gateway:null,send:Fp,setTab:Es,addToast:Es,openSidebar:Es,closeSidebar:Es}}async function Fe(e,t){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const n=await e.client.request("channels.status",{probe:t,timeoutMs:8e3});e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(n){e.channelsError=String(n)}finally{e.channelsLoading=!1}}}async function Up(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.start",{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function zp(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function Kp(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function jt(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function wn(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function Nc(e,t,n){if(t.length===0)return;let s=e;for(let a=0;a<t.length-1;a+=1){const o=t[a],c=t[a+1];if(typeof o=="number"){if(!Array.isArray(s))return;s[o]==null&&(s[o]=typeof c=="number"?[]:{}),s=s[o]}else{if(typeof s!="object"||s==null)return;const d=s;d[o]==null&&(d[o]=typeof c=="number"?[]:{}),s=d[o]}}const i=t[t.length-1];if(typeof i=="number"){Array.isArray(s)&&(s[i]=n);return}typeof s=="object"&&s!=null&&(s[i]=n)}function Uc(e,t){if(t.length===0)return;let n=e;for(let i=0;i<t.length-1;i+=1){const a=t[i];if(typeof a=="number"){if(!Array.isArray(n))return;n=n[a]}else{if(typeof n!="object"||n==null)return;n=n[a]}if(n==null)return}const s=t[t.length-1];if(typeof s=="number"){Array.isArray(n)&&n.splice(s,1);return}typeof n=="object"&&n!=null&&delete n[s]}async function it(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const t=await e.client.request("config.get",{});Wp(e,t)}catch(t){e.lastError=String(t)}finally{e.configLoading=!1}}}async function zc(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const t=await e.client.request("config.schema",{});qp(e,t)}catch(t){e.lastError=String(t)}finally{e.configSchemaLoading=!1}}}function qp(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function Wp(e,t){e.configSnapshot=t;const n=typeof t.raw=="string"?t.raw:t.config&&typeof t.config=="object"?wn(t.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=n:e.configForm?e.configRaw=wn(e.configForm):e.configRaw=n,e.configValid=typeof t.valid=="boolean"?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],e.configFormDirty||(e.configForm=jt(t.config??{}),e.configFormOriginal=jt(t.config??{}),e.configRawOriginal=n)}async function Qs(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?wn(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:t,baseHash:n}),e.configFormDirty=!1,await it(e)}catch(t){e.lastError=String(t)}finally{e.configSaving=!1}}}async function jp(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?wn(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:t,baseHash:n,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await it(e)}catch(t){e.lastError=String(t)}finally{e.configApplying=!1}}}async function Hp(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("godmode.update.run",{})}catch(t){e.lastError=String(t)}finally{e.updateRunning=!1}}}function gn(e,t,n){const s=jt(e.configForm??e.configSnapshot?.config??{});Nc(s,t,n),e.configForm=s,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=wn(s))}function Nr(e,t){const n=jt(e.configForm??e.configSnapshot?.config??{});Uc(n,t),e.configForm=n,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=wn(n))}async function Vp(e,t,n){gn(e,["agents","defaults","model","primary"],t),gn(e,["agents","defaults","model","fallbacks"],n),await Qs(e)}function Gp(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function Qp(e){const{state:t,callbacks:n,accountId:s}=e,i=Gp(t),a=(c,d,u={})=>{const{type:l="text",placeholder:h,maxLength:f,help:v}=u,b=t.values[c]??"",$=t.fieldErrors[c],k=`nostr-profile-${c}`;return l==="textarea"?r`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${k}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${d}
          </label>
          <textarea
            id="${k}"
            .value=${b}
            placeholder=${h??""}
            maxlength=${f??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${S=>{const _=S.target;n.onFieldChange(c,_.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${v?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${v}</div>`:p}
          ${$?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${$}</div>`:p}
        </div>
      `:r`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${k}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${d}
        </label>
        <input
          id="${k}"
          type=${l}
          .value=${b}
          placeholder=${h??""}
          maxlength=${f??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${S=>{const _=S.target;n.onFieldChange(c,_.value)}}
          ?disabled=${t.saving}
        />
        ${v?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${v}</div>`:p}
        ${$?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${$}</div>`:p}
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
    `:p};return r`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${s}</div>
      </div>

      ${t.error?r`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:p}

      ${t.success?r`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:p}

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
          `:p}

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
            `:p}
    </div>
  `}function Yp(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}async function Jp(e,t){await Up(e,t),await Fe(e,!0)}async function Xp(e){await zp(e),await Fe(e,!0)}async function Zp(e){await Kp(e),await Fe(e,!0)}async function ef(e){await Qs(e),await it(e),await Fe(e,!0)}async function tf(e){await it(e),await Fe(e,!0)}function nf(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...i]=n.split(":");if(!s||i.length===0)continue;const a=s.trim(),o=i.join(":").trim();a&&o&&(t[a]=o)}return t}function Kc(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function qc(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function sf(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=Yp(n??void 0)}function af(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function of(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function rf(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function lf(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=Kc(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(qc(n),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const a=i?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:a,success:null,fieldErrors:nf(i?.details)};return}if(!i.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await Fe(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function cf(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=Kc(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(qc(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const d=i?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:d,success:null};return}const a=i.merged??i.imported??null,o=a?{...t.values,...a}:t.values,c=!!(o.banner||o.website||o.nip05||o.lud16);e.nostrProfileFormState={...t,importing:!1,values:o,error:null,success:i.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:c},i.saved&&await Fe(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}function Wc(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),i=n.slice(2).join(":");return!s||!i?null:{agentId:s,rest:i}}const df=80;function xe(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const n=()=>{const s=e.querySelector(".chat-thread");if(s){const i=getComputedStyle(s).overflowY;if(i==="auto"||i==="scroll"||s.scrollHeight-s.clientHeight>1)return s}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const s=n();if(!s)return;if(!(t||e.chatUserNearBottom)){e.chatNewMessagesBelow=!0;return}t&&(e.chatHasAutoScrolled=!0),e.chatIsAutoScrolling=!0,s.scrollTop=s.scrollHeight,e.chatNewMessagesBelow=!1,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1});const a=t?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const o=n();!o||!(t||e.chatUserNearBottom)||(e.chatIsAutoScrolling=!0,o.scrollTop=o.scrollHeight,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1}))},a)})})}function jc(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function uf(e,t){const n=t.currentTarget;if(!n||e.chatIsAutoScrolling)return;n.scrollHeight-n.scrollTop-n.clientHeight<df?(e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1):e.chatUserNearBottom=!1}function hf(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function mi(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function pf(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),i=document.createElement("a"),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");i.href=s,i.download=`godmode-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(s)}function ff(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}const gf=[{label:"",tabs:["chat","today","workspaces","second-brain","dashboards"]},{label:"Settings",tabs:["config","skills","agents","trust","guardrails","options"]}],mf=[{label:"System",tabs:["channels","sessions","cron","debug"]}],Hc={onboarding:"/onboarding",options:"/options",workspaces:"/workspaces",today:"/today",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",agents:"/agents",nodes:"/nodes",chat:"/chat",trust:"/trust",guardrails:"/guardrails",config:"/config",debug:"/debug",logs:"/logs","second-brain":"/second-brain",dashboards:"/dashboards"},kt=new Map(Object.entries(Hc).map(([e,t])=>[t,e]));kt.set("/my-day","today");kt.set("/work","workspaces");kt.set("/setup","onboarding");kt.set("/overview","dashboards");kt.set("/mission-control","dashboards");function yi(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function as(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function oo(e,t=""){const n=yi(t),s=Hc[e]??`/${e}`;return n?`${n}${s}`:s}function Vc(e,t=""){const n=yi(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let i=as(s).toLowerCase();return i.endsWith("/index.html")&&(i="/"),i==="/"?"chat":kt.get(i)??null}function yf(e){let t=as(e);if(t.endsWith("/index.html")&&(t=as(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const i=`/${n.slice(s).join("/")}`.toLowerCase();if(kt.has(i)){const a=n.slice(0,s);return!a.length||a.some(c=>kt.has(`/${c.toLowerCase()}`))?"":`/${a.join("/")}`}}return`/${n.join("/")}`}function os(e){switch(e){case"onboarding":return"Connect Your World";case"chat":return"Chat";case"today":return"Today";case"workspaces":return"Work";case"channels":return"Integrations";case"instances":return"Devices";case"sessions":return"Sessions";case"cron":return"Schedules";case"skills":return"Skills";case"agents":return"Agents";case"nodes":return"Network";case"options":return"Experiments";case"trust":return"Trust";case"guardrails":return"Safety";case"second-brain":return"Second Brain";case"dashboards":return"Dashboards";case"config":return"Settings";case"debug":return"Developer";case"logs":return"Logs";default:return"Control"}}function vf(e){switch(e){case"onboarding":return"🧭";case"chat":return"💬";case"today":return"☀️";case"workspaces":return"📂";case"channels":return"🔗";case"instances":return"📡";case"sessions":return"📄";case"cron":return"⏰";case"skills":return"🧩";case"agents":return"🤖";case"nodes":return"🖥️";case"options":return"🧪";case"trust":return"🛡️";case"guardrails":return"🚧";case"second-brain":return"🧠";case"dashboards":return"📊";case"config":return"⚙️";case"debug":return"🐛";case"logs":return"📜";default:return"📁"}}function bf(e){switch(e){case"onboarding":return"Set up the integrations that power your daily brief and agent features. Everything is optional.";case"chat":return"Your command center. Ask anything, customize any view.";case"today":return"Calendar, brief, tasks, and schedule for the day.";case"workspaces":return"Projects, clients, and personal operating context.";case"channels":return"Connected apps — iMessage, Slack, email, calendar, and more.";case"instances":return"Your connected devices and where GodMode is running.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Recurring tasks — daily briefs, overnight agents, and timed automations.";case"skills":return"Manage your skills, discover new ones from ClawHub, and personalize them for your workflow.";case"agents":return"Your agent roster — sub-agents that handle queue tasks, grouped by category.";case"nodes":return"Devices in your GodMode network and what they can do.";case"options":return"Beta features you can toggle on or off.";case"trust":return"Scores build automatically as you use and rate skills.";case"guardrails":return"Boundaries that keep agents focused, honest, and within scope.";case"second-brain":return"Your Second Brain — identity, knowledge, and live AI context. Stores what your ally needs to act on your behalf.";case"dashboards":return"Custom data views built by your AI ally — remix anything.";case"config":return"Core settings — model, plugins, and API configuration.";case"debug":return"Gateway internals, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}const J="main";function wf(e){const t=[`viewing ${os(e.tab)} tab`];return e.tab==="dashboards"&&e.activeDashboard&&t.push(`dashboard: ${e.activeDashboard.title}`),e.tab==="workspaces"&&e.selectedWorkspace&&t.push(`workspace: ${e.selectedWorkspace.name}`),e.sidebarOpen&&e.sidebarFilePath&&t.push(`viewing file: ${e.sidebarFilePath}`),`[GodMode Context: ${t.join(", ")}]`}const kf=/<\s*\/?\s*(?:think(?:ing)?|thought|antthinking|final)\b/i,Rs=/<\s*\/?\s*final\b[^>]*>/gi,Ur=/<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\b[^>]*>/gi;function $f(e,t){return e.trimStart()}function Sf(e,t){if(!e||!kf.test(e))return e;let n=e;Rs.test(n)?(Rs.lastIndex=0,n=n.replace(Rs,"")):Rs.lastIndex=0,Ur.lastIndex=0;let s="",i=0,a=!1;for(const o of n.matchAll(Ur)){const c=o.index??0,d=o[1]==="/";a?d&&(a=!1):(s+=n.slice(i,c),d||(a=!0)),i=c+o[0].length}return s+=n.slice(i),$f(s)}function rs(e){return!e&&e!==0?"n/a":new Date(e).toLocaleString()}function N(e){if(!e&&e!==0)return"n/a";const t=Date.now()-e;if(t<0)return"just now";const n=Math.round(t/1e3);if(n<60)return`${n}s ago`;const s=Math.round(n/60);if(s<60)return`${s}m ago`;const i=Math.round(s/60);return i<48?`${i}h ago`:`${Math.round(i/24)}d ago`}function xf(e){if(!e&&e!==0)return"";const t=Date.now()-e;if(t<0)return"now";const n=Math.round(t/1e3);if(n<60)return"now";const s=Math.round(n/60);if(s<60)return`${s}m`;const i=Math.round(s/60);return i<24?`${i}h`:`${Math.round(i/24)}d`}function Gc(e){if(!e&&e!==0)return"n/a";if(e<1e3)return`${e}ms`;const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);if(n<60)return`${n}m`;const s=Math.round(n/60);return s<48?`${s}h`:`${Math.round(s/24)}d`}function Sa(e){return!e||e.length===0?"none":e.filter(t=>!!(t&&t.trim())).join(", ")}function ls(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function Qc(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function Ys(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function X(e){const t=e??new Date,n=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),i=String(t.getDate()).padStart(2,"0");return`${n}-${s}-${i}`}function qi(e){return Sf(e)}const zr=50,_f=80,Af=12e4;function he(e,t){if(!e)return"";const n=e.trim().replace(/\n/g," ");return n.length<=t?n:n.slice(0,t-1)+"…"}function ue(e){return typeof e=="string"?e:e==null?"":JSON.stringify(e)}function Kr(e,t){if(!t||typeof t!="object")return"";const n=t;switch(e.toLowerCase()){case"exec":return n.command?`\`${he(ue(n.command),60)}\``:"";case"read":return n.path||n.file_path?`\`${he(ue(n.path||n.file_path),50)}\``:"";case"write":return n.path||n.file_path?`→ \`${he(ue(n.path||n.file_path),50)}\``:"";case"edit":return n.path||n.file_path?`\`${he(ue(n.path||n.file_path),50)}\``:"";case"web_search":return n.query?`"${he(ue(n.query),45)}"`:"";case"web_fetch":try{const u=new URL(ue(n.url));return u.hostname+(u.pathname!=="/"?u.pathname.slice(0,30):"")}catch{return he(ue(n.url||""),50)}case"memory_search":return n.query?`"${he(ue(n.query),45)}"`:"";case"browser":const s=ue(n.action),i=n.ref?` #${ue(n.ref)}`:"",a=n.targetUrl?` ${he(ue(n.targetUrl),30)}`:"";return`${s}${i}${a}`;case"message":return n.action?`${ue(n.action)}${n.target?` → ${he(ue(n.target),25)}`:""}`:"";case"sessions_spawn":return n.task?`"${he(ue(n.task),40)}"`:"";case"cron":return n.action?ue(n.action):"";case"files_read":return n.fileId?`file:${he(ue(n.fileId),20)}`:"";case"image":return n.image?he(ue(n.image),40):"";default:const o=Object.keys(n).filter(u=>!["timeout","timeoutMs"].includes(u));if(o.length===0)return"";const c=o[0],d=n[c];return typeof d=="string"?`${c}: ${he(d,35)}`:""}}function qr(e,t){if(!t)return"";const n=e.toLowerCase(),s=t.split(`
`),i=s.length,a=t.length;if(["read","files_read"].includes(n))return`${a.toLocaleString()} chars${i>1?`, ${i} lines`:""}`;if(n==="exec")return i>1?`${i} lines`:he(s[0],50);if(["web_search","memory_search"].includes(n))try{const o=JSON.parse(t),c=o.results?.length??o.count??0;return`${c} result${c!==1?"s":""}`}catch{return he(t,40)}return n==="browser"?t.includes("snapshot")?"snapshot captured":t.includes("success")?"success":he(t,40):a>100?`${a.toLocaleString()} chars`:he(t,50)}function Wr(e){if(!e)return!0;const t=e.toLowerCase();return!(t.includes("error:")||t.includes("failed")||t.includes("exception")||t.includes("not found"))}function Tf(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(i=>{if(!i||typeof i!="object")return null;const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>!!i);return s.length===0?null:s.join(`
`)}function jr(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=Tf(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=typeof e=="object"?"[object]":String(e)}const s=Qc(n,Af);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function Cf(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function Ef(e){if(e.toolStreamOrder.length<=zr)return;const t=e.toolStreamOrder.length-zr,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function Rf(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function xa(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),Rf(e)}function Lf(e,t=!1){if(t){xa(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>xa(e),_f))}function ro(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],e.currentToolName=null,e.currentToolInfo=null;const t=e;t.compactionStatus&&(t.compactionStatus=null),t.compactionClearTimer!=null&&(window.clearTimeout(t.compactionClearTimer),t.compactionClearTimer=null),xa(e)}const Pf=5e3;function Df(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},Pf))}function If(e,t){if(!t)return;if(t.stream==="compaction"){Df(e,t);return}if(t.stream!=="tool")return;const n=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(n&&n!==e.sessionKey||!n&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const s=t.data??{},i=typeof s.toolCallId=="string"?s.toolCallId:"";if(!i)return;const a=typeof s.name=="string"?s.name:"tool",o=typeof s.phase=="string"?s.phase:"",c=o==="start"?s.args:void 0,d=o==="update"?jr(s.partialResult):o==="result"?jr(s.result):void 0,u=Date.now();let l=e.toolStreamById.get(i);l?(l.name=a,c!==void 0&&(l.args=c,l.displayArgs=Kr(a,c)),d!==void 0&&(l.output=d,l.resultSummary=qr(a,d),l.success=Wr(d)),l.updatedAt=u):(l={toolCallId:i,runId:t.runId,sessionKey:n,name:a,args:c,output:d,startedAt:typeof t.ts=="number"?t.ts:u,updatedAt:u,message:{},displayArgs:c?Kr(a,c):void 0},e.toolStreamById.set(i,l),e.toolStreamOrder.push(i)),o==="start"?(e.currentToolName=a,e.currentToolInfo={name:a,details:l.displayArgs||void 0,startedAt:l.startedAt}):o==="result"&&(e.currentToolName=null,e.currentToolInfo=null,l.completedAt=u,l.resultSummary=qr(a,l.output),l.success=Wr(l.output)),l.message=Cf(l),Ef(e),Lf(e,o==="result")}const lo={CHILD:2},co=e=>(...t)=>({_$litDirective$:e,values:t});let uo=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,s){this._$Ct=t,this._$AM=n,this._$Ci=s}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};class _a extends uo{constructor(t){if(super(t),this.it=p,t.type!==lo.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===p||t==null)return this._t=void 0,this.it=t;if(t===wt)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const n=[t];return n.raw=n,this._t={_$litType$:this.constructor.resultType,strings:n,values:[]}}}_a.directiveName="unsafeHTML",_a.resultType=1;const at=co(_a);const{entries:Yc,setPrototypeOf:Hr,isFrozen:Mf,getPrototypeOf:Of,getOwnPropertyDescriptor:Bf}=Object;let{freeze:be,seal:Ee,create:Aa}=Object,{apply:Ta,construct:Ca}=typeof Reflect<"u"&&Reflect;be||(be=function(t){return t});Ee||(Ee=function(t){return t});Ta||(Ta=function(t,n){for(var s=arguments.length,i=new Array(s>2?s-2:0),a=2;a<s;a++)i[a-2]=arguments[a];return t.apply(n,i)});Ca||(Ca=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return new t(...s)});const Ls=we(Array.prototype.forEach),Ff=we(Array.prototype.lastIndexOf),Vr=we(Array.prototype.pop),In=we(Array.prototype.push),Nf=we(Array.prototype.splice),Ns=we(String.prototype.toLowerCase),Wi=we(String.prototype.toString),ji=we(String.prototype.match),Mn=we(String.prototype.replace),Uf=we(String.prototype.indexOf),zf=we(String.prototype.trim),Le=we(Object.prototype.hasOwnProperty),me=we(RegExp.prototype.test),On=Kf(TypeError);function we(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return Ta(e,t,s)}}function Kf(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return Ca(e,n)}}function B(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ns;Hr&&Hr(e,null);let s=t.length;for(;s--;){let i=t[s];if(typeof i=="string"){const a=n(i);a!==i&&(Mf(t)||(t[s]=a),i=a)}e[i]=!0}return e}function qf(e){for(let t=0;t<e.length;t++)Le(e,t)||(e[t]=null);return e}function Ke(e){const t=Aa(null);for(const[n,s]of Yc(e))Le(e,n)&&(Array.isArray(s)?t[n]=qf(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=Ke(s):t[n]=s);return t}function Bn(e,t){for(;e!==null;){const s=Bf(e,t);if(s){if(s.get)return we(s.get);if(typeof s.value=="function")return we(s.value)}e=Of(e)}function n(){return null}return n}const Gr=be(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Hi=be(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Vi=be(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Wf=be(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Gi=be(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),jf=be(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Qr=be(["#text"]),Yr=be(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Qi=be(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Jr=be(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Ps=be(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Hf=Ee(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Vf=Ee(/<%[\w\W]*|[\w\W]*%>/gm),Gf=Ee(/\$\{[\w\W]*/gm),Qf=Ee(/^data-[\-\w.\u00B7-\uFFFF]+$/),Yf=Ee(/^aria-[\-\w]+$/),Jc=Ee(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Jf=Ee(/^(?:\w+script|data):/i),Xf=Ee(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Xc=Ee(/^html$/i),Zf=Ee(/^[a-z][.\w]*(-[.\w]+)+$/i);var Xr=Object.freeze({__proto__:null,ARIA_ATTR:Yf,ATTR_WHITESPACE:Xf,CUSTOM_ELEMENT:Zf,DATA_ATTR:Qf,DOCTYPE_NAME:Xc,ERB_EXPR:Vf,IS_ALLOWED_URI:Jc,IS_SCRIPT_OR_DATA:Jf,MUSTACHE_EXPR:Hf,TMPLIT_EXPR:Gf});const Fn={element:1,text:3,progressingInstruction:7,comment:8,document:9},eg=function(){return typeof window>"u"?null:window},tg=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(s=n.getAttribute(i));const a="dompurify"+(s?"#"+s:"");try{return t.createPolicy(a,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+a+" could not be created."),null}},Zr=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Zc(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:eg();const t=M=>Zc(M);if(t.version="3.3.1",t.removed=[],!e||!e.document||e.document.nodeType!==Fn.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,i=s.currentScript,{DocumentFragment:a,HTMLTemplateElement:o,Node:c,Element:d,NodeFilter:u,NamedNodeMap:l=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:h,DOMParser:f,trustedTypes:v}=e,b=d.prototype,$=Bn(b,"cloneNode"),k=Bn(b,"remove"),S=Bn(b,"nextSibling"),_=Bn(b,"childNodes"),L=Bn(b,"parentNode");if(typeof o=="function"){const M=n.createElement("template");M.content&&M.content.ownerDocument&&(n=M.content.ownerDocument)}let E,x="";const{implementation:T,createNodeIterator:A,createDocumentFragment:F,getElementsByTagName:I}=n,{importNode:z}=s;let q=Zr();t.isSupported=typeof Yc=="function"&&typeof L=="function"&&T&&T.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:j,ERB_EXPR:ge,TMPLIT_EXPR:Re,DATA_ATTR:Qe,ARIA_ATTR:te,IS_SCRIPT_OR_DATA:le,ATTR_WHITESPACE:O,CUSTOM_ELEMENT:_e}=Xr;let{IS_ALLOWED_URI:At}=Xr,ne=null;const tn=B({},[...Gr,...Hi,...Vi,...Gi,...Qr]);let W=null;const Tn=B({},[...Yr,...Qi,...Jr,...Ps]);let Q=Object.seal(Aa(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),dt=null,nn=null;const Ye=Object.seal(Aa(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let sn=!0,Cn=!0,En=!1,Rn=!0,Tt=!1,$s=!0,Ct=!1,Pi=!1,Di=!1,an=!1,Ss=!1,xs=!1,lr=!0,cr=!1;const Zh="user-content-";let Ii=!0,Ln=!1,on={},Ne=null;const Mi=B({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let dr=null;const ur=B({},["audio","video","img","source","image","track"]);let Oi=null;const hr=B({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),_s="http://www.w3.org/1998/Math/MathML",As="http://www.w3.org/2000/svg",Je="http://www.w3.org/1999/xhtml";let rn=Je,Bi=!1,Fi=null;const ep=B({},[_s,As,Je],Wi);let Ts=B({},["mi","mo","mn","ms","mtext"]),Cs=B({},["annotation-xml"]);const tp=B({},["title","style","font","a","script"]);let Pn=null;const np=["application/xhtml+xml","text/html"],sp="text/html";let re=null,ln=null;const ip=n.createElement("form"),pr=function(w){return w instanceof RegExp||w instanceof Function},Ni=function(){let w=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(ln&&ln===w)){if((!w||typeof w!="object")&&(w={}),w=Ke(w),Pn=np.indexOf(w.PARSER_MEDIA_TYPE)===-1?sp:w.PARSER_MEDIA_TYPE,re=Pn==="application/xhtml+xml"?Wi:Ns,ne=Le(w,"ALLOWED_TAGS")?B({},w.ALLOWED_TAGS,re):tn,W=Le(w,"ALLOWED_ATTR")?B({},w.ALLOWED_ATTR,re):Tn,Fi=Le(w,"ALLOWED_NAMESPACES")?B({},w.ALLOWED_NAMESPACES,Wi):ep,Oi=Le(w,"ADD_URI_SAFE_ATTR")?B(Ke(hr),w.ADD_URI_SAFE_ATTR,re):hr,dr=Le(w,"ADD_DATA_URI_TAGS")?B(Ke(ur),w.ADD_DATA_URI_TAGS,re):ur,Ne=Le(w,"FORBID_CONTENTS")?B({},w.FORBID_CONTENTS,re):Mi,dt=Le(w,"FORBID_TAGS")?B({},w.FORBID_TAGS,re):Ke({}),nn=Le(w,"FORBID_ATTR")?B({},w.FORBID_ATTR,re):Ke({}),on=Le(w,"USE_PROFILES")?w.USE_PROFILES:!1,sn=w.ALLOW_ARIA_ATTR!==!1,Cn=w.ALLOW_DATA_ATTR!==!1,En=w.ALLOW_UNKNOWN_PROTOCOLS||!1,Rn=w.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Tt=w.SAFE_FOR_TEMPLATES||!1,$s=w.SAFE_FOR_XML!==!1,Ct=w.WHOLE_DOCUMENT||!1,an=w.RETURN_DOM||!1,Ss=w.RETURN_DOM_FRAGMENT||!1,xs=w.RETURN_TRUSTED_TYPE||!1,Di=w.FORCE_BODY||!1,lr=w.SANITIZE_DOM!==!1,cr=w.SANITIZE_NAMED_PROPS||!1,Ii=w.KEEP_CONTENT!==!1,Ln=w.IN_PLACE||!1,At=w.ALLOWED_URI_REGEXP||Jc,rn=w.NAMESPACE||Je,Ts=w.MATHML_TEXT_INTEGRATION_POINTS||Ts,Cs=w.HTML_INTEGRATION_POINTS||Cs,Q=w.CUSTOM_ELEMENT_HANDLING||{},w.CUSTOM_ELEMENT_HANDLING&&pr(w.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(Q.tagNameCheck=w.CUSTOM_ELEMENT_HANDLING.tagNameCheck),w.CUSTOM_ELEMENT_HANDLING&&pr(w.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(Q.attributeNameCheck=w.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),w.CUSTOM_ELEMENT_HANDLING&&typeof w.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(Q.allowCustomizedBuiltInElements=w.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Tt&&(Cn=!1),Ss&&(an=!0),on&&(ne=B({},Qr),W=[],on.html===!0&&(B(ne,Gr),B(W,Yr)),on.svg===!0&&(B(ne,Hi),B(W,Qi),B(W,Ps)),on.svgFilters===!0&&(B(ne,Vi),B(W,Qi),B(W,Ps)),on.mathMl===!0&&(B(ne,Gi),B(W,Jr),B(W,Ps))),w.ADD_TAGS&&(typeof w.ADD_TAGS=="function"?Ye.tagCheck=w.ADD_TAGS:(ne===tn&&(ne=Ke(ne)),B(ne,w.ADD_TAGS,re))),w.ADD_ATTR&&(typeof w.ADD_ATTR=="function"?Ye.attributeCheck=w.ADD_ATTR:(W===Tn&&(W=Ke(W)),B(W,w.ADD_ATTR,re))),w.ADD_URI_SAFE_ATTR&&B(Oi,w.ADD_URI_SAFE_ATTR,re),w.FORBID_CONTENTS&&(Ne===Mi&&(Ne=Ke(Ne)),B(Ne,w.FORBID_CONTENTS,re)),w.ADD_FORBID_CONTENTS&&(Ne===Mi&&(Ne=Ke(Ne)),B(Ne,w.ADD_FORBID_CONTENTS,re)),Ii&&(ne["#text"]=!0),Ct&&B(ne,["html","head","body"]),ne.table&&(B(ne,["tbody"]),delete dt.tbody),w.TRUSTED_TYPES_POLICY){if(typeof w.TRUSTED_TYPES_POLICY.createHTML!="function")throw On('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof w.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw On('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');E=w.TRUSTED_TYPES_POLICY,x=E.createHTML("")}else E===void 0&&(E=tg(v,i)),E!==null&&typeof x=="string"&&(x=E.createHTML(""));be&&be(w),ln=w}},fr=B({},[...Hi,...Vi,...Wf]),gr=B({},[...Gi,...jf]),ap=function(w){let C=L(w);(!C||!C.tagName)&&(C={namespaceURI:rn,tagName:"template"});const D=Ns(w.tagName),Y=Ns(C.tagName);return Fi[w.namespaceURI]?w.namespaceURI===As?C.namespaceURI===Je?D==="svg":C.namespaceURI===_s?D==="svg"&&(Y==="annotation-xml"||Ts[Y]):!!fr[D]:w.namespaceURI===_s?C.namespaceURI===Je?D==="math":C.namespaceURI===As?D==="math"&&Cs[Y]:!!gr[D]:w.namespaceURI===Je?C.namespaceURI===As&&!Cs[Y]||C.namespaceURI===_s&&!Ts[Y]?!1:!gr[D]&&(tp[D]||!fr[D]):!!(Pn==="application/xhtml+xml"&&Fi[w.namespaceURI]):!1},Ue=function(w){In(t.removed,{element:w});try{L(w).removeChild(w)}catch{k(w)}},Et=function(w,C){try{In(t.removed,{attribute:C.getAttributeNode(w),from:C})}catch{In(t.removed,{attribute:null,from:C})}if(C.removeAttribute(w),w==="is")if(an||Ss)try{Ue(C)}catch{}else try{C.setAttribute(w,"")}catch{}},mr=function(w){let C=null,D=null;if(Di)w="<remove></remove>"+w;else{const ae=ji(w,/^[\r\n\t ]+/);D=ae&&ae[0]}Pn==="application/xhtml+xml"&&rn===Je&&(w='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+w+"</body></html>");const Y=E?E.createHTML(w):w;if(rn===Je)try{C=new f().parseFromString(Y,Pn)}catch{}if(!C||!C.documentElement){C=T.createDocument(rn,"template",null);try{C.documentElement.innerHTML=Bi?x:Y}catch{}}const pe=C.body||C.documentElement;return w&&D&&pe.insertBefore(n.createTextNode(D),pe.childNodes[0]||null),rn===Je?I.call(C,Ct?"html":"body")[0]:Ct?C.documentElement:pe},yr=function(w){return A.call(w.ownerDocument||w,w,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},Ui=function(w){return w instanceof h&&(typeof w.nodeName!="string"||typeof w.textContent!="string"||typeof w.removeChild!="function"||!(w.attributes instanceof l)||typeof w.removeAttribute!="function"||typeof w.setAttribute!="function"||typeof w.namespaceURI!="string"||typeof w.insertBefore!="function"||typeof w.hasChildNodes!="function")},vr=function(w){return typeof c=="function"&&w instanceof c};function Xe(M,w,C){Ls(M,D=>{D.call(t,w,C,ln)})}const br=function(w){let C=null;if(Xe(q.beforeSanitizeElements,w,null),Ui(w))return Ue(w),!0;const D=re(w.nodeName);if(Xe(q.uponSanitizeElement,w,{tagName:D,allowedTags:ne}),$s&&w.hasChildNodes()&&!vr(w.firstElementChild)&&me(/<[/\w!]/g,w.innerHTML)&&me(/<[/\w!]/g,w.textContent)||w.nodeType===Fn.progressingInstruction||$s&&w.nodeType===Fn.comment&&me(/<[/\w]/g,w.data))return Ue(w),!0;if(!(Ye.tagCheck instanceof Function&&Ye.tagCheck(D))&&(!ne[D]||dt[D])){if(!dt[D]&&kr(D)&&(Q.tagNameCheck instanceof RegExp&&me(Q.tagNameCheck,D)||Q.tagNameCheck instanceof Function&&Q.tagNameCheck(D)))return!1;if(Ii&&!Ne[D]){const Y=L(w)||w.parentNode,pe=_(w)||w.childNodes;if(pe&&Y){const ae=pe.length;for(let ke=ae-1;ke>=0;--ke){const Ze=$(pe[ke],!0);Ze.__removalCount=(w.__removalCount||0)+1,Y.insertBefore(Ze,S(w))}}}return Ue(w),!0}return w instanceof d&&!ap(w)||(D==="noscript"||D==="noembed"||D==="noframes")&&me(/<\/no(script|embed|frames)/i,w.innerHTML)?(Ue(w),!0):(Tt&&w.nodeType===Fn.text&&(C=w.textContent,Ls([j,ge,Re],Y=>{C=Mn(C,Y," ")}),w.textContent!==C&&(In(t.removed,{element:w.cloneNode()}),w.textContent=C)),Xe(q.afterSanitizeElements,w,null),!1)},wr=function(w,C,D){if(lr&&(C==="id"||C==="name")&&(D in n||D in ip))return!1;if(!(Cn&&!nn[C]&&me(Qe,C))){if(!(sn&&me(te,C))){if(!(Ye.attributeCheck instanceof Function&&Ye.attributeCheck(C,w))){if(!W[C]||nn[C]){if(!(kr(w)&&(Q.tagNameCheck instanceof RegExp&&me(Q.tagNameCheck,w)||Q.tagNameCheck instanceof Function&&Q.tagNameCheck(w))&&(Q.attributeNameCheck instanceof RegExp&&me(Q.attributeNameCheck,C)||Q.attributeNameCheck instanceof Function&&Q.attributeNameCheck(C,w))||C==="is"&&Q.allowCustomizedBuiltInElements&&(Q.tagNameCheck instanceof RegExp&&me(Q.tagNameCheck,D)||Q.tagNameCheck instanceof Function&&Q.tagNameCheck(D))))return!1}else if(!Oi[C]){if(!me(At,Mn(D,O,""))){if(!((C==="src"||C==="xlink:href"||C==="href")&&w!=="script"&&Uf(D,"data:")===0&&dr[w])){if(!(En&&!me(le,Mn(D,O,"")))){if(D)return!1}}}}}}}return!0},kr=function(w){return w!=="annotation-xml"&&ji(w,_e)},$r=function(w){Xe(q.beforeSanitizeAttributes,w,null);const{attributes:C}=w;if(!C||Ui(w))return;const D={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:W,forceKeepAttr:void 0};let Y=C.length;for(;Y--;){const pe=C[Y],{name:ae,namespaceURI:ke,value:Ze}=pe,cn=re(ae),zi=Ze;let de=ae==="value"?zi:zf(zi);if(D.attrName=cn,D.attrValue=de,D.keepAttr=!0,D.forceKeepAttr=void 0,Xe(q.uponSanitizeAttribute,w,D),de=D.attrValue,cr&&(cn==="id"||cn==="name")&&(Et(ae,w),de=Zh+de),$s&&me(/((--!?|])>)|<\/(style|title|textarea)/i,de)){Et(ae,w);continue}if(cn==="attributename"&&ji(de,"href")){Et(ae,w);continue}if(D.forceKeepAttr)continue;if(!D.keepAttr){Et(ae,w);continue}if(!Rn&&me(/\/>/i,de)){Et(ae,w);continue}Tt&&Ls([j,ge,Re],xr=>{de=Mn(de,xr," ")});const Sr=re(w.nodeName);if(!wr(Sr,cn,de)){Et(ae,w);continue}if(E&&typeof v=="object"&&typeof v.getAttributeType=="function"&&!ke)switch(v.getAttributeType(Sr,cn)){case"TrustedHTML":{de=E.createHTML(de);break}case"TrustedScriptURL":{de=E.createScriptURL(de);break}}if(de!==zi)try{ke?w.setAttributeNS(ke,ae,de):w.setAttribute(ae,de),Ui(w)?Ue(w):Vr(t.removed)}catch{Et(ae,w)}}Xe(q.afterSanitizeAttributes,w,null)},op=function M(w){let C=null;const D=yr(w);for(Xe(q.beforeSanitizeShadowDOM,w,null);C=D.nextNode();)Xe(q.uponSanitizeShadowNode,C,null),br(C),$r(C),C.content instanceof a&&M(C.content);Xe(q.afterSanitizeShadowDOM,w,null)};return t.sanitize=function(M){let w=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},C=null,D=null,Y=null,pe=null;if(Bi=!M,Bi&&(M="<!-->"),typeof M!="string"&&!vr(M))if(typeof M.toString=="function"){if(M=M.toString(),typeof M!="string")throw On("dirty is not a string, aborting")}else throw On("toString is not a function");if(!t.isSupported)return M;if(Pi||Ni(w),t.removed=[],typeof M=="string"&&(Ln=!1),Ln){if(M.nodeName){const Ze=re(M.nodeName);if(!ne[Ze]||dt[Ze])throw On("root node is forbidden and cannot be sanitized in-place")}}else if(M instanceof c)C=mr("<!---->"),D=C.ownerDocument.importNode(M,!0),D.nodeType===Fn.element&&D.nodeName==="BODY"||D.nodeName==="HTML"?C=D:C.appendChild(D);else{if(!an&&!Tt&&!Ct&&M.indexOf("<")===-1)return E&&xs?E.createHTML(M):M;if(C=mr(M),!C)return an?null:xs?x:""}C&&Di&&Ue(C.firstChild);const ae=yr(Ln?M:C);for(;Y=ae.nextNode();)br(Y),$r(Y),Y.content instanceof a&&op(Y.content);if(Ln)return M;if(an){if(Ss)for(pe=F.call(C.ownerDocument);C.firstChild;)pe.appendChild(C.firstChild);else pe=C;return(W.shadowroot||W.shadowrootmode)&&(pe=z.call(s,pe,!0)),pe}let ke=Ct?C.outerHTML:C.innerHTML;return Ct&&ne["!doctype"]&&C.ownerDocument&&C.ownerDocument.doctype&&C.ownerDocument.doctype.name&&me(Xc,C.ownerDocument.doctype.name)&&(ke="<!DOCTYPE "+C.ownerDocument.doctype.name+`>
`+ke),Tt&&Ls([j,ge,Re],Ze=>{ke=Mn(ke,Ze," ")}),E&&xs?E.createHTML(ke):ke},t.setConfig=function(){let M=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Ni(M),Pi=!0},t.clearConfig=function(){ln=null,Pi=!1},t.isValidAttribute=function(M,w,C){ln||Ni({});const D=re(M),Y=re(w);return wr(D,Y,C)},t.addHook=function(M,w){typeof w=="function"&&In(q[M],w)},t.removeHook=function(M,w){if(w!==void 0){const C=Ff(q[M],w);return C===-1?void 0:Nf(q[M],C,1)[0]}return Vr(q[M])},t.removeHooks=function(M){q[M]=[]},t.removeAllHooks=function(){q=Zr()},t}var kn=Zc();function ho(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Xt=ho();function ed(e){Xt=e}var Nt={exec:()=>null};function U(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(i,a)=>{let o=typeof a=="string"?a:a.source;return o=o.replace(ve.caret,"$1"),n=n.replace(i,o),s},getRegex:()=>new RegExp(n,t)};return s}var ng=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),ve={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},sg=/^(?:[ \t]*(?:\n|$))+/,ig=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ag=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,fs=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,og=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,po=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,td=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,nd=U(td).replace(/bull/g,po).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),rg=U(td).replace(/bull/g,po).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),fo=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,lg=/^[^\n]+/,go=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,cg=U(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",go).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),dg=U(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,po).getRegex(),vi="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",mo=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ug=U("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",mo).replace("tag",vi).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),sd=U(fo).replace("hr",fs).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",vi).getRegex(),hg=U(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",sd).getRegex(),yo={blockquote:hg,code:ig,def:cg,fences:ag,heading:og,hr:fs,html:ug,lheading:nd,list:dg,newline:sg,paragraph:sd,table:Nt,text:lg},el=U("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",fs).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",vi).getRegex(),pg={...yo,lheading:rg,table:el,paragraph:U(fo).replace("hr",fs).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",el).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",vi).getRegex()},fg={...yo,html:U(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",mo).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Nt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:U(fo).replace("hr",fs).replace("heading",` *#{1,6} *[^
]`).replace("lheading",nd).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},gg=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,mg=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,id=/^( {2,}|\\)\n(?!\s*$)/,yg=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,bi=/[\p{P}\p{S}]/u,vo=/[\s\p{P}\p{S}]/u,ad=/[^\s\p{P}\p{S}]/u,vg=U(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,vo).getRegex(),od=/(?!~)[\p{P}\p{S}]/u,bg=/(?!~)[\s\p{P}\p{S}]/u,wg=/(?:[^\s\p{P}\p{S}]|~)/u,rd=/(?![*_])[\p{P}\p{S}]/u,kg=/(?![*_])[\s\p{P}\p{S}]/u,$g=/(?:[^\s\p{P}\p{S}]|[*_])/u,Sg=U(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",ng?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),ld=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,xg=U(ld,"u").replace(/punct/g,bi).getRegex(),_g=U(ld,"u").replace(/punct/g,od).getRegex(),cd="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ag=U(cd,"gu").replace(/notPunctSpace/g,ad).replace(/punctSpace/g,vo).replace(/punct/g,bi).getRegex(),Tg=U(cd,"gu").replace(/notPunctSpace/g,wg).replace(/punctSpace/g,bg).replace(/punct/g,od).getRegex(),Cg=U("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,ad).replace(/punctSpace/g,vo).replace(/punct/g,bi).getRegex(),Eg=U(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,rd).getRegex(),Rg="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Lg=U(Rg,"gu").replace(/notPunctSpace/g,$g).replace(/punctSpace/g,kg).replace(/punct/g,rd).getRegex(),Pg=U(/\\(punct)/,"gu").replace(/punct/g,bi).getRegex(),Dg=U(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ig=U(mo).replace("(?:-->|$)","-->").getRegex(),Mg=U("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ig).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Js=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Og=U(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Js).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),dd=U(/^!?\[(label)\]\[(ref)\]/).replace("label",Js).replace("ref",go).getRegex(),ud=U(/^!?\[(ref)\](?:\[\])?/).replace("ref",go).getRegex(),Bg=U("reflink|nolink(?!\\()","g").replace("reflink",dd).replace("nolink",ud).getRegex(),tl=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,bo={_backpedal:Nt,anyPunctuation:Pg,autolink:Dg,blockSkip:Sg,br:id,code:mg,del:Nt,delLDelim:Nt,delRDelim:Nt,emStrongLDelim:xg,emStrongRDelimAst:Ag,emStrongRDelimUnd:Cg,escape:gg,link:Og,nolink:ud,punctuation:vg,reflink:dd,reflinkSearch:Bg,tag:Mg,text:yg,url:Nt},Fg={...bo,link:U(/^!?\[(label)\]\((.*?)\)/).replace("label",Js).getRegex(),reflink:U(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Js).getRegex()},Ea={...bo,emStrongRDelimAst:Tg,emStrongLDelim:_g,delLDelim:Eg,delRDelim:Lg,url:U(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",tl).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:U(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",tl).getRegex()},Ng={...Ea,br:U(id).replace("{2,}","*").getRegex(),text:U(Ea.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ds={normal:yo,gfm:pg,pedantic:fg},Nn={normal:bo,gfm:Ea,breaks:Ng,pedantic:Fg},Ug={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},nl=e=>Ug[e];function qe(e,t){if(t){if(ve.escapeTest.test(e))return e.replace(ve.escapeReplace,nl)}else if(ve.escapeTestNoEncode.test(e))return e.replace(ve.escapeReplaceNoEncode,nl);return e}function sl(e){try{e=encodeURI(e).replace(ve.percentDecode,"%")}catch{return null}return e}function il(e,t){let n=e.replace(ve.findPipe,(a,o,c)=>{let d=!1,u=o;for(;--u>=0&&c[u]==="\\";)d=!d;return d?"|":" |"}),s=n.split(ve.splitPipe),i=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;i<s.length;i++)s[i]=s[i].trim().replace(ve.slashPipe,"|");return s}function Un(e,t,n){let s=e.length;if(s===0)return"";let i=0;for(;i<s&&e.charAt(s-i-1)===t;)i++;return e.slice(0,s-i)}function zg(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function Kg(e,t=0){let n=t,s="";for(let i of e)if(i==="	"){let a=4-n%4;s+=" ".repeat(a),n+=a}else s+=i,n++;return s}function al(e,t,n,s,i){let a=t.href,o=t.title||null,c=e[1].replace(i.other.outputLinkReplace,"$1");s.state.inLink=!0;let d={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:o,text:c,tokens:s.inlineTokens(c)};return s.state.inLink=!1,d}function qg(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let i=s[1];return t.split(`
`).map(a=>{let o=a.match(n.other.beginningSpace);if(o===null)return a;let[c]=o;return c.length>=i.length?a.slice(i.length):a}).join(`
`)}var Xs=class{options;rules;lexer;constructor(e){this.options=e||Xt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Un(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=qg(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=Un(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Un(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=Un(t[0],`
`).split(`
`),s="",i="",a=[];for(;n.length>0;){let o=!1,c=[],d;for(d=0;d<n.length;d++)if(this.rules.other.blockquoteStart.test(n[d]))c.push(n[d]),o=!0;else if(!o)c.push(n[d]);else break;n=n.slice(d);let u=c.join(`
`),l=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${u}`:u,i=i?`${i}
${l}`:l;let h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(l,a,!0),this.lexer.state.top=h,n.length===0)break;let f=a.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let v=f,b=v.raw+`
`+n.join(`
`),$=this.blockquote(b);a[a.length-1]=$,s=s.substring(0,s.length-v.raw.length)+$.raw,i=i.substring(0,i.length-v.text.length)+$.text;break}else if(f?.type==="list"){let v=f,b=v.raw+`
`+n.join(`
`),$=this.list(b);a[a.length-1]=$,s=s.substring(0,s.length-f.raw.length)+$.raw,i=i.substring(0,i.length-v.raw.length)+$.raw,n=b.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:a,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,i={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let d=!1,u="",l="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;u=t[0],e=e.substring(u.length);let h=Kg(t[2].split(`
`,1)[0],t[1].length),f=e.split(`
`,1)[0],v=!h.trim(),b=0;if(this.options.pedantic?(b=2,l=h.trimStart()):v?b=t[1].length+1:(b=h.search(this.rules.other.nonSpaceChar),b=b>4?1:b,l=h.slice(b),b+=t[1].length),v&&this.rules.other.blankLine.test(f)&&(u+=f+`
`,e=e.substring(f.length+1),d=!0),!d){let $=this.rules.other.nextBulletRegex(b),k=this.rules.other.hrRegex(b),S=this.rules.other.fencesBeginRegex(b),_=this.rules.other.headingBeginRegex(b),L=this.rules.other.htmlBeginRegex(b),E=this.rules.other.blockquoteBeginRegex(b);for(;e;){let x=e.split(`
`,1)[0],T;if(f=x,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),T=f):T=f.replace(this.rules.other.tabCharGlobal,"    "),S.test(f)||_.test(f)||L.test(f)||E.test(f)||$.test(f)||k.test(f))break;if(T.search(this.rules.other.nonSpaceChar)>=b||!f.trim())l+=`
`+T.slice(b);else{if(v||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||S.test(h)||_.test(h)||k.test(h))break;l+=`
`+f}v=!f.trim(),u+=x+`
`,e=e.substring(x.length+1),h=T.slice(b)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(o=!0)),i.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(l),loose:!1,text:l,tokens:[]}),i.raw+=u}let c=i.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let d of i.items){if(this.lexer.state.top=!1,d.tokens=this.lexer.blockTokens(d.text,[]),d.task){if(d.text=d.text.replace(this.rules.other.listReplaceTask,""),d.tokens[0]?.type==="text"||d.tokens[0]?.type==="paragraph"){d.tokens[0].raw=d.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),d.tokens[0].text=d.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let l=this.lexer.inlineQueue.length-1;l>=0;l--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[l].src)){this.lexer.inlineQueue[l].src=this.lexer.inlineQueue[l].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(d.raw);if(u){let l={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};d.checked=l.checked,i.loose?d.tokens[0]&&["paragraph","text"].includes(d.tokens[0].type)&&"tokens"in d.tokens[0]&&d.tokens[0].tokens?(d.tokens[0].raw=l.raw+d.tokens[0].raw,d.tokens[0].text=l.raw+d.tokens[0].text,d.tokens[0].tokens.unshift(l)):d.tokens.unshift({type:"paragraph",raw:l.raw,text:l.raw,tokens:[l]}):d.tokens.unshift(l)}}if(!i.loose){let u=d.tokens.filter(h=>h.type==="space"),l=u.length>0&&u.some(h=>this.rules.other.anyLine.test(h.raw));i.loose=l}}if(i.loose)for(let d of i.items){d.loose=!0;for(let u of d.tokens)u.type==="text"&&(u.type="paragraph")}return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=il(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let o of s)this.rules.other.tableAlignRight.test(o)?a.align.push("right"):this.rules.other.tableAlignCenter.test(o)?a.align.push("center"):this.rules.other.tableAlignLeft.test(o)?a.align.push("left"):a.align.push(null);for(let o=0;o<n.length;o++)a.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:a.align[o]});for(let o of i)a.rows.push(il(o,a.header.length).map((c,d)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:a.align[d]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=Un(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=zg(t[2],"()");if(a===-2)return;if(a>-1){let o=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,o).trim(),t[3]=""}}let s=t[2],i="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(s);a&&(s=a[1],i=a[3])}else i=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),al(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=t[s.toLowerCase()];if(!i){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return al(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,a,o,c=i,d=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+i);(s=u.exec(t))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a)continue;if(o=[...a].length,s[3]||s[4]){c+=o;continue}else if((s[5]||s[6])&&i%3&&!((i+o)%3)){d+=o;continue}if(c-=o,c>0)continue;o=Math.min(o,o+c+d);let l=[...s[0]][0].length,h=e.slice(0,i+s.index+l+o);if(Math.min(i,o)%2){let v=h.slice(1,-1);return{type:"em",raw:h,text:v,tokens:this.lexer.inlineTokens(v)}}let f=h.slice(2,-2);return{type:"strong",raw:h,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,a,o,c=i,d=this.rules.inline.delRDelim;for(d.lastIndex=0,t=t.slice(-1*e.length+i);(s=d.exec(t))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a||(o=[...a].length,o!==i))continue;if(s[3]||s[4]){c+=o;continue}if(c-=o,c>0)continue;o=Math.min(o,o+c);let u=[...s[0]][0].length,l=e.slice(0,i+s.index+u+o),h=l.slice(i,-i);return{type:"del",raw:l,text:h,tokens:this.lexer.inlineTokens(h)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},De=class Ra{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Xt,this.options.tokenizer=this.options.tokenizer||new Xs,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:ve,block:Ds.normal,inline:Nn.normal};this.options.pedantic?(n.block=Ds.pedantic,n.inline=Nn.pedantic):this.options.gfm&&(n.block=Ds.gfm,this.options.breaks?n.inline=Nn.breaks:n.inline=Nn.gfm),this.tokenizer.rules=n}static get rules(){return{block:Ds,inline:Nn}}static lex(t,n){return new Ra(n).lex(t)}static lexInline(t,n){return new Ra(n).inlineTokens(t)}lex(t){t=t.replace(ve.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(ve.tabCharGlobal,"    ").replace(ve.spaceLine,""));t;){let i;if(this.options.extensions?.block?.some(o=>(i=o.call({lexer:this},t,n))?(t=t.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(t)){t=t.substring(i.raw.length);let o=n.at(-1);i.raw.length===1&&o!==void 0?o.raw+=`
`:n.push(i);continue}if(i=this.tokenizer.code(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.at(-1).src=o.text):n.push(i);continue}if(i=this.tokenizer.fences(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.heading(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.hr(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.blockquote(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.list(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.html(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.def(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},n.push(i));continue}if(i=this.tokenizer.table(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.lheading(t)){t=t.substring(i.raw.length),n.push(i);continue}let a=t;if(this.options.extensions?.startBlock){let o=1/0,c=t.slice(1),d;this.options.extensions.startBlock.forEach(u=>{d=u.call({lexer:this},c),typeof d=="number"&&d>=0&&(o=Math.min(o,d))}),o<1/0&&o>=0&&(a=t.substring(0,o+1))}if(this.state.top&&(i=this.tokenizer.paragraph(a))){let o=n.at(-1);s&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(i),s=a.length!==t.length,t=t.substring(i.raw.length);continue}if(i=this.tokenizer.text(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(i);continue}if(t){let o="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,i=null;if(this.tokens.links){let d=Object.keys(this.tokens.links);if(d.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)d.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,i.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(i=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)a=i[2]?i[2].length:0,s=s.slice(0,i.index+a)+"["+"a".repeat(i[0].length-a-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let o=!1,c="";for(;t;){o||(c=""),o=!1;let d;if(this.options.extensions?.inline?.some(l=>(d=l.call({lexer:this},t,n))?(t=t.substring(d.raw.length),n.push(d),!0):!1))continue;if(d=this.tokenizer.escape(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.tag(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.link(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(d.raw.length);let l=n.at(-1);d.type==="text"&&l?.type==="text"?(l.raw+=d.raw,l.text+=d.text):n.push(d);continue}if(d=this.tokenizer.emStrong(t,s,c)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.codespan(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.br(t)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.del(t,s,c)){t=t.substring(d.raw.length),n.push(d);continue}if(d=this.tokenizer.autolink(t)){t=t.substring(d.raw.length),n.push(d);continue}if(!this.state.inLink&&(d=this.tokenizer.url(t))){t=t.substring(d.raw.length),n.push(d);continue}let u=t;if(this.options.extensions?.startInline){let l=1/0,h=t.slice(1),f;this.options.extensions.startInline.forEach(v=>{f=v.call({lexer:this},h),typeof f=="number"&&f>=0&&(l=Math.min(l,f))}),l<1/0&&l>=0&&(u=t.substring(0,l+1))}if(d=this.tokenizer.inlineText(u)){t=t.substring(d.raw.length),d.raw.slice(-1)!=="_"&&(c=d.raw.slice(-1)),o=!0;let l=n.at(-1);l?.type==="text"?(l.raw+=d.raw,l.text+=d.text):n.push(d);continue}if(t){let l="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return n}},Zs=class{options;parser;constructor(e){this.options=e||Xt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(ve.notSpaceStart)?.[0],i=e.replace(ve.endingNewline,"")+`
`;return s?'<pre><code class="language-'+qe(s)+'">'+(n?i:qe(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:qe(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let o=0;o<e.items.length;o++){let c=e.items[o];s+=this.listitem(c)}let i=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+i+a+`>
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
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${qe(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),i=sl(e);if(i===null)return s;e=i;let a='<a href="'+e+'"';return t&&(a+=' title="'+qe(t)+'"'),a+=">"+s+"</a>",a}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let i=sl(e);if(i===null)return qe(n);e=i;let a=`<img src="${e}" alt="${qe(n)}"`;return t&&(a+=` title="${qe(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:qe(e.text)}},wo=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Ie=class La{options;renderer;textRenderer;constructor(t){this.options=t||Xt,this.options.renderer=this.options.renderer||new Zs,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new wo}static parse(t,n){return new La(n).parse(t)}static parseInline(t,n){return new La(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let i=t[s];if(this.options.extensions?.renderers?.[i.type]){let o=i,c=this.options.extensions.renderers[o.type].call({parser:this},o);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){n+=c||"";continue}}let a=i;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(t,n=this.renderer){let s="";for(let i=0;i<t.length;i++){let a=t[i];if(this.options.extensions?.renderers?.[a.type]){let c=this.options.extensions.renderers[a.type].call({parser:this},a);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){s+=c||"";continue}}let o=a;switch(o.type){case"escape":{s+=n.text(o);break}case"html":{s+=n.html(o);break}case"link":{s+=n.link(o);break}case"image":{s+=n.image(o);break}case"checkbox":{s+=n.checkbox(o);break}case"strong":{s+=n.strong(o);break}case"em":{s+=n.em(o);break}case"codespan":{s+=n.codespan(o);break}case"br":{s+=n.br(o);break}case"del":{s+=n.del(o);break}case"text":{s+=n.text(o);break}default:{let c='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return s}},Wn=class{options;block;constructor(t){this.options=t||Xt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?De.lex:De.lexInline}provideParser(){return this.block?Ie.parse:Ie.parseInline}},Wg=class{defaults=ho();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Ie;Renderer=Zs;TextRenderer=wo;Lexer=De;Tokenizer=Xs;Hooks=Wn;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let i=s;for(let a of i.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of i.rows)for(let o of a)n=n.concat(this.walkTokens(o.tokens,t));break}case"list":{let i=s;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=s;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(a=>{let o=i[a].flat(1/0);n=n.concat(this.walkTokens(o,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let a=t.renderers[i.name];a?t.renderers[i.name]=function(...o){let c=i.renderer.apply(this,o);return c===!1&&(c=a.apply(this,o)),c}:t.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[i.level];a?a.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens)}),s.extensions=t),n.renderer){let i=this.defaults.renderer||new Zs(this.defaults);for(let a in n.renderer){if(!(a in i))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let o=a,c=n.renderer[o],d=i[o];i[o]=(...u)=>{let l=c.apply(i,u);return l===!1&&(l=d.apply(i,u)),l||""}}s.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new Xs(this.defaults);for(let a in n.tokenizer){if(!(a in i))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let o=a,c=n.tokenizer[o],d=i[o];i[o]=(...u)=>{let l=c.apply(i,u);return l===!1&&(l=d.apply(i,u)),l}}s.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new Wn;for(let a in n.hooks){if(!(a in i))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let o=a,c=n.hooks[o],d=i[o];Wn.passThroughHooks.has(a)?i[o]=u=>{if(this.defaults.async&&Wn.passThroughHooksRespectAsync.has(a))return(async()=>{let h=await c.call(i,u);return d.call(i,h)})();let l=c.call(i,u);return d.call(i,l)}:i[o]=(...u)=>{if(this.defaults.async)return(async()=>{let h=await c.apply(i,u);return h===!1&&(h=await d.apply(i,u)),h})();let l=c.apply(i,u);return l===!1&&(l=d.apply(i,u)),l}}s.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,a=n.walkTokens;s.walkTokens=function(o){let c=[];return c.push(a.call(this,o)),i&&(c=c.concat(i.call(this,o))),c}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return De.lex(e,t??this.defaults)}parser(e,t){return Ie.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},i={...this.defaults,...s},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&s.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let o=i.hooks?await i.hooks.preprocess(t):t,c=await(i.hooks?await i.hooks.provideLexer():e?De.lex:De.lexInline)(o,i),d=i.hooks?await i.hooks.processAllTokens(c):c;i.walkTokens&&await Promise.all(this.walkTokens(d,i.walkTokens));let u=await(i.hooks?await i.hooks.provideParser():e?Ie.parse:Ie.parseInline)(d,i);return i.hooks?await i.hooks.postprocess(u):u})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let o=(i.hooks?i.hooks.provideLexer():e?De.lex:De.lexInline)(t,i);i.hooks&&(o=i.hooks.processAllTokens(o)),i.walkTokens&&this.walkTokens(o,i.walkTokens);let c=(i.hooks?i.hooks.provideParser():e?Ie.parse:Ie.parseInline)(o,i);return i.hooks&&(c=i.hooks.postprocess(c)),c}catch(o){return a(o)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+qe(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},Ht=new Wg;function K(e,t){return Ht.parse(e,t)}K.options=K.setOptions=function(e){return Ht.setOptions(e),K.defaults=Ht.defaults,ed(K.defaults),K};K.getDefaults=ho;K.defaults=Xt;K.use=function(...e){return Ht.use(...e),K.defaults=Ht.defaults,ed(K.defaults),K};K.walkTokens=function(e,t){return Ht.walkTokens(e,t)};K.parseInline=Ht.parseInline;K.Parser=Ie;K.parser=Ie.parse;K.Renderer=Zs;K.TextRenderer=wo;K.Lexer=De;K.lexer=De.lex;K.Tokenizer=Xs;K.Hooks=Wn;K.parse=K;K.options;K.setOptions;K.use;K.walkTokens;K.parseInline;Ie.parse;De.lex;K.setOptions({gfm:!0,breaks:!0,mangle:!1});const jg=/\.(html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log|mp4|mov|mkv|avi|webm|mp3|wav|aac|ogg|flac|zip|tar|gz|bz2|dmg|iso|doc|docx|xls|xlsx|ppt|pptx)$/i,Hg=new RegExp("(?<![(\\[`])(?:~\\/|\\/(?:Users|home|tmp|var|opt|etc|godmode)\\/)[\\w/.+@-]+(?:\\.\\w+|\\/)(?=\\s|[),;:!?]|$)","g"),Vg=new RegExp("(?<![(\\[`/~\\w])(?:[\\w][\\w.-]*[-_][\\w.-]*\\.(?:html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log|mp4|mov|mkv|avi|webm|mp3|wav|aac|ogg|flac|zip|tar|gz|bz2|dmg|iso|doc|docx|xls|xlsx|ppt|pptx))(?=\\s|[),;:!?|]|$)","gi");function hd(e){const t=e.split(/(```[\s\S]*?```|`[^`\n]+`)/g);for(let n=0;n<t.length;n++)n%2===0&&(t[n]=t[n].replace(Hg,s=>{const i=s.endsWith("/");if(!i&&!jg.test(s))return s;const a=s.startsWith("~/")?`file:///~/${s.slice(2)}`:`file://${s}`,o=s.replace(/\/+$/,"").split("/");return`[${i?(o.pop()??s)+"/":o.pop()??s}](${a})`}),t[n]=t[n].replace(Vg,s=>`[${s}](godmode-file://${encodeURIComponent(s)})`));return t.join("")}const ei=["a","article","aside","b","blockquote","br","caption","col","colgroup","code","div","del","details","em","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","hr","img","i","input","li","main","nav","ol","p","pre","section","span","strong","sub","sup","summary","table","tbody","td","th","thead","tr","ul"],ti=["alt","checked","class","decoding","disabled","height","href","loading","open","rel","src","start","target","title","type","width","style"],Pa=/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file|godmode-file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;let ol=!1;const Gg=14e4,Qg=14e4,Yg=200,Yi=5e4,zt=new Map;function Jg(e){const t=zt.get(e);return t===void 0?null:(zt.delete(e),zt.set(e,t),t)}function rl(e,t){if(zt.set(e,t),zt.size<=Yg)return;const n=zt.keys().next().value;n&&zt.delete(n)}function ko(){ol||(ol=!0,kn.addHook("uponSanitizeElement",e=>{e instanceof HTMLInputElement&&e.getAttribute("type")!=="checkbox"&&e.remove()}),kn.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function Se(e){const t=e.trim();if(!t)return"";if(ko(),t.length<=Yi){const c=Jg(t);if(c!==null)return c}const n=Qc(t,Gg),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>Qg){const d=`<pre class="code-block">${am(`${n.text}${s}`)}</pre>`,u=kn.sanitize(d,{ALLOWED_TAGS:ei,ALLOWED_ATTR:ti,ALLOWED_URI_REGEXP:Pa});return t.length<=Yi&&rl(t,u),u}const i=hd(`${n.text}${s}`),a=K.parse(i),o=kn.sanitize(a,{ALLOWED_TAGS:ei,ALLOWED_ATTR:ti,ALLOWED_URI_REGEXP:Pa});return t.length<=Yi&&rl(t,o),o}function Xg(e){const t=e.trim();if(!t)return"";ko();const n=K.parse(t);return kn.sanitize(n,{ALLOWED_TAGS:ei,ALLOWED_ATTR:ti,ALLOWED_URI_REGEXP:Pa}).replace(/<input([^>]*)\bdisabled\b([^>]*)>/g,"<input$1$2>")}const Zg=[...ei,"svg","path","circle","ellipse","rect","line","polyline","polygon","text","tspan","g","defs","linearGradient","radialGradient","stop","clipPath","mask","use","symbol","marker","pattern","animate","animateTransform"],em=[...ti,"viewBox","xmlns","preserveAspectRatio","d","cx","cy","r","rx","ry","x","x1","x2","y","y1","y2","dx","dy","fill","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","transform","opacity","points","text-anchor","dominant-baseline","font-size","font-weight","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","marker-start","marker-mid","marker-end","clip-path","patternUnits","patternTransform","rotate","textLength","lengthAdjust","values","dur","repeatCount","attributeName","from","to","begin","calcMode","keySplines","keyTimes"];function tm(e){const t=e.trim();if(!t)return"";ko();const{styles:n,html:s}=nm(t),i=kn.sanitize(s,{ALLOWED_TAGS:Zg,ALLOWED_ATTR:em,FORBID_TAGS:["base","iframe","link","meta","object","script","style"]}),a=".dashboard-render";return n.map(c=>`<style>${im(c,a)}</style>`).join(`
`)+i}function nm(e){const t=[],n=e.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi,(o,c)=>(t.push(c),"")),s=n.match(/<body[^>]*>([\s\S]*)<\/body>/i),a=(s?s[1]:n).replace(/<!DOCTYPE[^>]*>/gi,"").replace(/<\/?html[^>]*>/gi,"").replace(/<\/?head[^>]*>/gi,"").replace(/<\/?body[^>]*>/gi,"").replace(/<title[^>]*>[\s\S]*?<\/title>/gi,"").replace(/<meta[^>]*\/?>/gi,"").replace(/<link[^>]*\/?>/gi,"");return{styles:t,html:a}}function sm(e,t){let n=0;for(let s=t;s<e.length;s++)if(e[s]==="{")n++;else if(e[s]==="}"&&(n--,n===0))return s+1;return e.length}function im(e,t){let n=e.replace(/@import\b[^;]*;/gi,"");n=n.replace(/expression\s*\(/gi,"/* blocked */("),n=n.replace(/behavior\s*:/gi,"/* blocked */:"),n=n.replace(/-moz-binding\s*:/gi,"/* blocked */:");const s=[];let i=0;for(;i<n.length;){if(/\s/.test(n[i])){s.push(n[i]),i++;continue}if(n[i]==="/"&&n[i+1]==="*"){const l=n.indexOf("*/",i+2),h=l===-1?n.length:l+2;s.push(n.slice(i,h)),i=h;continue}if(n[i]==="}"){s.push("}"),i++;continue}if(/^@(-webkit-)?keyframes\s/.test(n.slice(i,i+30))){const l=sm(n,i);s.push(n.slice(i,l)),i=l;continue}if(/^@(media|supports|container|layer)\b/.test(n.slice(i,i+20))){const l=n.indexOf("{",i);if(l===-1){s.push(n.slice(i));break}s.push(n.slice(i,l+1)),i=l+1;continue}const a=n.indexOf("{",i);if(a===-1){s.push(n.slice(i));break}const o=n.slice(i,a).trim(),c=n.indexOf("}",a);if(c===-1){s.push(n.slice(i));break}const d=n.slice(a+1,c),u=o.split(",").map(l=>{const h=l.trim();if(!h)return l;if(h==="*")return`${t}, ${t} *`;if(/^(html|body|:root)$/i.test(h))return t;const f=h.replace(/^(html|body|:root)\s+/i,"");return`${t} ${f}`}).join(", ");s.push(`${u} {${d}}`),i=c+1}return s.join("")}function am(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const om=500;let Dt="",It="";function pd(e){const t=e.trim();if(!t)return"";if(t.length<om)return Se(t);const n=lm(t);if(n<0)return Se(t);const s=t.slice(0,n),i=t.slice(n);if(s===Dt)return It+Se(i);if(s.startsWith(Dt)&&Dt.length>0){const a=s.slice(Dt.length);return It=It+Se(a),Dt=s,It+Se(i)}return It=Se(s),Dt=s,It+Se(i)}function rm(){Dt="",It=""}function lm(e){let t=!1,n="";const s=[];let i=0;for(;i<e.length;){const a=e.indexOf(`
`,i),o=a===-1?e.length:a,c=e.slice(i,o),d=c.trimStart(),u=d.match(/^(`{3,}|~{3,})/);if(u){const l=u[1];t?l.charAt(0)===n.charAt(0)&&l.length>=n.length&&d.slice(l.length).trim()===""&&(t=!1,n=""):(t=!0,n=l)}if(!t&&c.trim()===""){let l=o+1;for(;l<e.length&&e[l]===`
`;)l++;l<e.length&&(s.length===0||s[s.length-1]!==l)&&s.push(l)}i=a===-1?e.length:a+1}return s.length<2?-1:s[s.length-2]}const H={messageSquare:r`
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
  `},cm=1500,dm=2e3,fd="Copy as markdown",um="Copied",hm="Copy failed";async function pm(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function Is(e,t){e.title=t,e.setAttribute("aria-label",t)}function fm(e){const t=e.label??fd;return r`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(s?.querySelector(".chat-copy-btn__icon"),!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const i=await pm(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!i){s.dataset.error="1",Is(s,hm),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,Is(s,t))},dm);return}s.dataset.copied="1",Is(s,um),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,Is(s,t))},cm)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${H.copy}</span>
        <span class="chat-copy-btn__icon-check">${H.check}</span>
      </span>
    </button>
  `}function gm(e){return fm({text:()=>e,label:fd})}const ll="NO_REPLY",mm=/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,ym=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi,vm=["internal system context injected by godmode","treat it as invisible background instructions only","persistence protocol (non-negotiable)","you must follow these operating instructions. do not echo or quote this block","meta goal: earn trust through competence. search before asking","asking the user for info you could look up is a failure mode"];function Ji(e){let t=e.replace(mm,"").replace(ym,"").trim();const n=t.toLowerCase();for(const s of vm){const i=n.indexOf(s);if(i!==-1){const a=i+s.length,o=t.slice(a),c=o.search(/\n\n(?=[A-Z])/);c!==-1?t=o.slice(c).trim():t="";break}}return t}const bm=/^\s*\{[^{}]*"type"\s*:\s*"error"[^{}]*"error"\s*:\s*\{/,wm=/^\s*(\d{3})\s+\{/;function $o(e){const t=e.trim(),n=t.match(wm);if(n){const s=Number(n[1]);if(s===529||s===503)return"*Switching models — Claude is temporarily overloaded.*";if(s===400&&t.includes("Unsupported value"))return null}if(t.startsWith("Unsupported value:")||t.includes("is not supported with the")||!bm.test(t))return null;try{const s=JSON.parse(t);if(s?.type==="error"&&s?.error?.message)return(s.error.type??"")==="overloaded_error"?"*Switching models — Claude is temporarily overloaded.*":`*API error: ${s.error.message}*`}catch{}return null}const km=/\{"type":"error","error":\{[^}]*"type":"[^"]*"[^}]*\}[^}]*"request_id":"[^"]*"\}/g,$m=/\d{3}\s+\{"type":"error"[^\n]*\}\n?(?:https?:\/\/[^\n]*\n?)?/g,Sm=/\{"type":"error","error":\{"details":[^}]*"type":"overloaded_error"[^}]*\}[^}]*"request_id":"[^"]*"\}\n?/g;function xm(e){return e.replace($m,"").replace(km,"").replace(Sm,"").trim()}const _m=/^\[([^\]]+)\]\s*/,Am=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],Xi=new WeakMap,Zi=new WeakMap;function Tm(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:Am.some(t=>e.startsWith(`${t} `))}function Us(e){const t=e.match(_m);if(!t)return e;const n=t[1]??"";return Tm(n)?e.slice(t[0].length):e}function ea(e){const t=e.trim();return t===ll||t.startsWith(`${ll}
`)}function $n(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string"){const i=Ji(s);if(!i)return null;const a=$o(i);if(a)return a;const o=n==="assistant"?xm(i):i;if(n==="assistant"&&!o)return null;const c=n==="assistant"?qi(o):Us(i);return ea(c)?null:c}if(Array.isArray(s)){const i=s.map(a=>{const o=a;return o.type==="text"&&typeof o.text=="string"?Ji(o.text):null}).filter(a=>typeof a=="string"&&a.length>0);if(i.length>0){const a=i.join(`
`),o=n==="assistant"?qi(a):Us(a);return ea(o)?null:o}}if(typeof t.text=="string"){const i=Ji(t.text);if(!i)return null;const a=n==="assistant"?qi(i):Us(i);return ea(a)?null:a}return null}function So(e){if(!e||typeof e!="object")return $n(e);const t=e;if(Xi.has(t))return Xi.get(t)??null;const n=$n(e);return Xi.set(t,n),n}function Da(e){const n=e.content,s=[];if(Array.isArray(n))for(const c of n){const d=c;if(d.type==="thinking"&&typeof d.thinking=="string"){const u=d.thinking.trim();u&&s.push(u)}}if(s.length>0)return s.join(`
`);const i=xo(e);if(!i)return null;const o=[...i.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(c=>(c[1]??"").trim()).filter(Boolean);return o.length>0?o.join(`
`):null}function gd(e){if(!e||typeof e!="object")return Da(e);const t=e;if(Zi.has(t))return Zi.get(t)??null;const n=Da(e);return Zi.set(t,n),n}function xo(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(i=>{const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>typeof i=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function md(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}const Cm=Object.freeze(Object.defineProperty({__proto__:null,extractRawText:xo,extractText:$n,extractTextCached:So,extractThinking:Da,extractThinkingCached:gd,formatApiError:$o,formatReasoningMarkdown:md,stripEnvelope:Us},Symbol.toStringTag,{value:"Module"}));function _o(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",i=t.content,a=Array.isArray(i)?i:null,o=Array.isArray(a)&&a.some(h=>{const f=h,v=(typeof f.type=="string"?f.type:"").toLowerCase();return v==="toolresult"||v==="tool_result"}),c=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||o||c)&&(n="toolResult");let d=[];typeof t.content=="string"?d=[{type:"text",text:t.content}]:Array.isArray(t.content)?d=t.content.map(h=>({type:h.type||"text",text:h.text,name:h.name,args:h.args||h.arguments})):typeof t.text=="string"&&(d=[{type:"text",text:t.text}]);const u=typeof t.timestamp=="number"?t.timestamp:Date.now(),l=typeof t.id=="string"?t.id:void 0;return{role:n,content:d,timestamp:u,id:l}}function wi(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function yd(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}const cl={pdf:"📕",doc:"📘",docx:"📘",txt:"📄",rtf:"📄",xls:"📗",xlsx:"📗",csv:"📊",ppt:"📙",pptx:"📙",jpg:"🖼️",jpeg:"🖼️",png:"🖼️",gif:"🖼️",webp:"🖼️",svg:"🖼️",mp3:"🎵",wav:"🎵",m4a:"🎵",mp4:"🎬",mov:"🎬",avi:"🎬",zip:"📦",rar:"📦","7z":"📦",tar:"📦",gz:"📦",js:"📜",ts:"📜",py:"📜",json:"📜",html:"📜",css:"📜",md:"📜",default:"📎"};function vd(e){const t=e.split(".").pop()?.toLowerCase()||"";return cl[t]??cl.default}function bd(e,t){const n=t.split(".").pop()?.toLowerCase()||"";return{pdf:"PDF Document",doc:"Word Document",docx:"Word Document",xls:"Excel Spreadsheet",xlsx:"Excel Spreadsheet",csv:"CSV File",ppt:"PowerPoint",pptx:"PowerPoint",txt:"Text File",md:"Markdown",json:"JSON File",zip:"ZIP Archive",png:"PNG Image",jpg:"JPEG Image",jpeg:"JPEG Image",gif:"GIF Image",mp3:"Audio File",mp4:"Video File",html:"HTML Document",css:"Stylesheet",js:"JavaScript",ts:"TypeScript",py:"Python"}[n]||e.split("/")[1]?.toUpperCase()||"File"}const Em={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},Rm={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},proof_editor:{icon:"fileText",title:"Proof Editor",actions:{create:{label:"create",detailKeys:["title"]},write:{label:"write",detailKeys:["slug"]},read:{label:"read",detailKeys:["slug"]},comment:{label:"comment",detailKeys:["slug"]},suggest:{label:"suggest",detailKeys:["slug"]},open:{label:"open",detailKeys:["slug"]},share:{label:"share",detailKeys:["slug"]},export_gdrive:{label:"drive",detailKeys:["slug"]},list:{label:"list"}}},queue_steer:{icon:"messageSquare",title:"Queue Steer",detailKeys:["itemId","instruction"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},Lm={fallback:Em,tools:Rm},wd=Lm,dl=wd.fallback??{icon:"puzzle"},Pm=wd.tools??{};function Dm(e){return(e??"tool").trim()}function Im(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function Mm(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function kd(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const n=t.split(/\r?\n/)[0]?.trim()??"";return n?n.length>160?`${n.slice(0,157)}…`:n:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(s=>kd(s)).filter(s=>!!s);if(t.length===0)return;const n=t.slice(0,3).join(", ");return t.length>3?`${n}…`:n}}}function Om(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function Bm(e,t){for(const n of t){const s=Om(e,n),i=kd(s);if(i)return i}}function Fm(e){if(!e||typeof e!="object")return;const t=e,n=typeof t.path=="string"?t.path:void 0;if(!n)return;const s=typeof t.offset=="number"?t.offset:void 0,i=typeof t.limit=="number"?t.limit:void 0;return s!==void 0&&i!==void 0?`${n}:${s}-${s+i}`:n}function Nm(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function Um(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function zm(e){const t=Dm(e.name),n=t.toLowerCase(),s=Pm[n],i=s?.icon??dl.icon??"puzzle",a=s?.title??Im(t),o=s?.label??t,c=e.args&&typeof e.args=="object"?e.args.action:void 0,d=typeof c=="string"?c.trim():void 0,u=Um(s,d),l=Mm(u?.label??d);let h;n==="read"&&(h=Fm(e.args)),!h&&(n==="write"||n==="edit"||n==="attach")&&(h=Nm(e.args));const f=u?.detailKeys??s?.detailKeys??dl.detailKeys??[];return!h&&f.length>0&&(h=Bm(e.args,f)),!h&&e.meta&&(h=e.meta),h&&(h=qm(h)),{name:t,icon:i,title:a,label:o,verb:l,detail:h}}function Km(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function qm(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const Wm=80,jm=2,ul=100,Hm=3;function hl(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function Vm(e){const t=e.split(`
`),n=t.slice(0,jm),s=n.join(`
`);return s.length>ul?s.slice(0,ul)+"…":n.length<t.length?s+"…":s}function Gm(e){const t=e,n=Xm(t.content),s=[];for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(a)||typeof i.name=="string"&&i.arguments!=null)&&s.push({kind:"call",name:i.name??"tool",args:Zm(i.arguments??i.args)})}for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();if(a!=="toolresult"&&a!=="tool_result")continue;const o=ey(i);if(fl(o))continue;const c=typeof i.name=="string"?i.name:"tool";s.push({kind:"result",name:c,text:o})}if(yd(e)&&!s.some(i=>i.kind==="result")){const i=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",a=So(e)??void 0;fl(a)||s.push({kind:"result",name:i,text:a})}return s}const Qm=new Set(["write","read","edit","attach"]);function Ym(e){if(!e||typeof e!="object")return null;const t=e,n=t.path??t.file_path??t.filePath;return typeof n=="string"&&n.trim()?n.trim():null}function Jm(e){if(!e)return null;const t=e.match(/(?:\/(?:Users|home|tmp|var)\/\S+|~\/\S+)/);return t?t[0].replace(/[.,;:!?)'"]+$/,""):null}function pl(e,t,n,s,i){const a=zm({name:e.name,args:e.args}),o=Km(a),c=!!e.text?.trim(),d=ty(e.text);if(d?.type==="proof"&&d.slug)return r`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${H.fileText}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name">${d.title??"Proof Document"}</span>
          <span class="chat-artifact-card__type">Live doc</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${s?r`<button class="chat-artifact-card__btn" @click=${_=>{_.stopPropagation(),s(d.slug)}}>Open</button>`:p}
          ${d.filePath&&i?r`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${_=>{_.stopPropagation(),i(d.filePath)}}>Drive</button>`:p}
        </div>
      </div>
    `;const u=Qm.has(e.name.toLowerCase())?Ym(e.args)??Jm(e.text):null;if(u&&e.kind==="result"){const _=u.split("/").pop()||u,L=_.split(".").pop()?.toLowerCase()||"",E=vd(_),x=bd(L,_);return r`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${E}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name" title=${u}>${_}</span>
          <span class="chat-artifact-card__type">${x}</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${n?r`<button class="chat-artifact-card__btn" @click=${T=>{T.stopPropagation(),n(u)}}>Open</button>`:t&&c?r`<button class="chat-artifact-card__btn" @click=${T=>{T.stopPropagation(),t(hl(e.text))}}>View</button>`:p}
          ${i?r`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${T=>{T.stopPropagation(),i(u)}}>Drive</button>`:p}
        </div>
      </div>
    `}const l=!!t||!!(n&&u),h=l?_=>{if(_.stopPropagation(),n&&u){n(u);return}if(t&&c){t(hl(e.text));return}if(t){const L=`## ${a.label}

${o?`**Command:** \`${o}\`

`:""}*No output — tool completed successfully.*`;t(L)}}:void 0,f=e.text?e.text.split(`
`).length:0,v=c&&(e.text?.length??0)<=Wm,b=c&&!v&&f>Hm,$=c&&!b,k=!c,S=e.kind==="call"?"chat-tool-card--call":"chat-tool-card--result";return r`
    <div
      class="chat-tool-card ${S} ${l?"chat-tool-card--clickable":""}"
      @click=${h}
      role=${l?"button":p}
      tabindex=${l?"0":p}
      @keydown=${l?_=>{_.key!=="Enter"&&_.key!==" "||(_.preventDefault(),_.stopPropagation(),h?.(_))}:p}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${H[a.icon]}</span>
          <span>${a.label}</span>
        </div>
        ${l?r`<span class="chat-tool-card__action">${c?"View":""} ${H.check}</span>`:p}
        ${k&&!l?r`<span class="chat-tool-card__status">${H.check}</span>`:p}
      </div>
      ${o?r`<div class="chat-tool-card__detail">${o}</div>`:p}
      ${k?r`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:p}
      ${b?r`<details class="chat-tool-card__expandable" @click=${_=>_.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${Vm(e.text)}</summary>
            <div class="chat-tool-card__full-output mono">${e.text}</div>
          </details>`:p}
      ${$?r`<div class="chat-tool-card__inline mono">${e.text}</div>`:p}
    </div>
  `}function Xm(e){return Array.isArray(e)?e.filter(Boolean):[]}function Zm(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function ey(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function ty(e){if(!e)return null;try{const t=JSON.parse(e);return t._sidebarAction?{type:t._sidebarAction.type,slug:t._sidebarAction.slug,title:t.title,filePath:t.filePath}:null}catch{return null}}function fl(e){if(!e)return!1;const t=e.toLowerCase();return t.includes("process exited")?!1:t.includes("(no new output)")&&t.includes("still running")}function ny(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const i=s.getAttribute("href");if(i){if(i.startsWith("file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(7);a.startsWith("/~/")&&(a="~"+a.slice(2));try{a=decodeURIComponent(a)}catch{}t(a);return}if(i.startsWith("godmode-file://")){e.preventDefault(),e.stopPropagation();let a=i.slice(15);try{a=decodeURIComponent(a)}catch{}t(a);return}}}const gl={exec:["Executing","Running","Conjuring","Manifesting","Brewing"],read:["Reading","Perusing","Absorbing","Scanning","Devouring"],write:["Writing","Scribbling","Crafting","Inscribing","Authoring"],edit:["Editing","Refining","Polishing","Tweaking","Sculpting"],browser:["Browsing","Surfing","Exploring","Navigating","Spelunking"],web_search:["Searching","Hunting","Investigating","Sleuthing","Scouring"],web_fetch:["Fetching","Grabbing","Retrieving","Summoning","Acquiring"],memory_search:["Remembering","Recalling","Pondering","Reflecting"],image:["Analyzing","Examining","Scrutinizing","Inspecting","Beholding"],default:["Working on","Processing","Handling","Tinkering with","Wrangling"]};function $d(e){const t=e.toLowerCase().replace(/[^a-z_]/g,""),n=gl[t]??gl.default,s=Math.floor(Date.now()/2e3)%n.length;return n[s]}function sy(e){const t=e.match(/\[Files uploaded:\s*([^\]]+)\]/);if(!t)return null;const n=t[1],s=[],i=/([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;let a;for(;(a=i.exec(n))!==null;)s.push({fileName:a[1].trim(),fileId:a[2].trim(),size:a[3].trim(),mimeType:a[4].trim()});return s.length>0?s:null}function iy(e){return r`
    <div class="chat-file-uploads">
      ${e.map(t=>r`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${vd(t.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${t.fileName}">${t.fileName}</span>
            <span class="chat-file-upload-card__meta">${t.size} • ${bd(t.mimeType,t.fileName)}</span>
          </div>
        </div>
      `)}
    </div>
  `}function ay(e){return e.replace(/\[Files uploaded:[^\]]+\]\s*/g,"").trim()}const ml=/<document>\s*<source>([^<]*)<\/source>\s*<mime_type>([^<]*)<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function oy(e){const t=[];let n;for(;(n=ml.exec(e))!==null;){const s=n[1]?.trim()||"file",i=n[2]?.trim()||"application/octet-stream";t.push({fileName:s,fileId:"",size:"",mimeType:i})}return ml.lastIndex=0,t.length>0?t:null}const ry=/<document>\s*<source>[^<]*<\/source>\s*<mime_type>[^<]*<\/mime_type>\s*<content\s+encoding="base64">\s*[\s\S]*?<\/content>\s*<\/document>/gi;function ly(e){return e.replace(ry,"").trim()}function cy(e){if(!e)return e;if(e.startsWith("System:")||e.startsWith("GatewayRestart:")||e.startsWith("Sender (untrusted metadata)")){const a=e.indexOf(`

`);return a!==-1?e.slice(a+2).trim():""}let i=e.split(`
`).filter(a=>{const o=a.trim();return!o.startsWith("System:")&&!o.startsWith("GatewayRestart:")}).join(`
`);for(;i.startsWith(`
`);)i=i.slice(1);return i.trim()}function dy(e){return typeof e!="number"||!Number.isFinite(e)||e<=0?null:e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${Math.round(e/1024)} KB`:`${Math.round(e)} B`}function Ia(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="image"){const c=o.source;if(c?.type==="base64"&&typeof c.data=="string"){const d=c.data,u=c.media_type||"image/png",l=d.startsWith("data:")?d:`data:${u};base64,${d}`;s.push({url:l})}else if(typeof o.data=="string"&&typeof o.mimeType=="string"){const d=o.data.startsWith("data:")?o.data:`data:${o.mimeType};base64,${o.data}`;s.push({url:d})}else typeof o.url=="string"?s.push({url:o.url}):o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}else if(o.type==="image_url"){const c=o.image_url;typeof c?.url=="string"&&s.push({url:c.url})}else o.type==="attachment"&&typeof o.content=="string"&&(o.mimeType||"").startsWith("image/")&&s.push({url:o.content,alt:o.fileName||void 0});if(o.type==="text"&&typeof o.text=="string"){const c=/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,d=o.text.match(c);if(d)for(const u of d)s.push({url:u})}if(Array.isArray(o.content))for(const c of o.content){if(typeof c!="object"||c===null)continue;const d=c;if(d.type==="image"){const u=d.source;if(u?.type==="base64"&&typeof u.data=="string"){const l=u.media_type||"image/png",h=u.data.startsWith("data:")?u.data:`data:${l};base64,${u.data}`;s.push({url:h})}else if(typeof d.data=="string"&&typeof d.mimeType=="string"){const l=d.data.startsWith("data:")?d.data:`data:${d.mimeType};base64,${d.data}`;s.push({url:l})}else d.omitted===!0&&s.push({omitted:!0,bytes:typeof d.bytes=="number"?d.bytes:void 0,mimeType:typeof d.mimeType=="string"?d.mimeType:void 0,alt:typeof d.fileName=="string"?d.fileName:void 0})}}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="image"&&typeof o.content=="string"){const c=o.mimeType||"image/png",d=o.content.startsWith("data:")?o.content:`data:${c};base64,${o.content}`;s.push({url:d,alt:o.fileName||void 0})}else o.type==="image"&&o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}return s}function uy(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const a of n){if(typeof a!="object"||a===null)continue;const o=a;if(o.type==="attachment"&&typeof o.content=="string"){const c=o.mimeType||"application/octet-stream";c.startsWith("image/")||s.push({fileName:o.fileName||"file",mimeType:c,content:o.content})}}const i=t.attachments;if(Array.isArray(i))for(const a of i){if(typeof a!="object"||a===null)continue;const o=a;o.type==="file"&&typeof o.content=="string"&&s.push({fileName:o.fileName||"file",mimeType:o.mimeType||"application/octet-stream",content:o.content})}return s}function hy(e,t){return r`
    <div class="chat-group assistant">
      ${Ao("assistant",{assistantName:e?.name,assistantAvatar:e?.avatar})}
      <div class="chat-group-messages">
        ${t?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${$d(t.name)}</span>
                    <strong>${t.name}</strong>
                  </span>
                </div>
                ${t.details?r`<span class="chat-working-indicator__details">${t.details}</span>`:p}
              </div>
            `:p}
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
  `}function py(e,t,n,s,i){const a=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),o=s?.name??"Assistant";return r`
    <div class="chat-group assistant">
      ${Ao("assistant",{assistantName:s?.name,assistantAvatar:s?.avatar})}
      <div class="chat-group-messages">
        ${i?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${$d(i.name)}</span>
                    <strong>${i.name}</strong>
                  </span>
                </div>
                ${i.details?r`<span class="chat-working-indicator__details">${i.details}</span>`:p}
              </div>
            `:p}
        ${Sd({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${o}</span>
          <span class="chat-group-timestamp">${a}</span>
        </div>
      </div>
    </div>
  `}function fy(e,t){const n=wi(e.role),s=t.assistantName??"Assistant",i=t.userName??"You",a=n==="user"?i:n==="assistant"?s:n,o=n==="user"?"user":n==="assistant"?"assistant":"other",c=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r`
    <div class="chat-group ${o}">
      ${Ao(e.role,{assistantName:s,assistantAvatar:t.assistantAvatar??null,userName:i,userAvatar:t.userAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((d,u)=>Sd(d.message,{isStreaming:e.isStreaming&&u===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar,t.onOpenFile,t.onOpenProof,t.onImageClick,t.resolveImageUrl,t.onPushToDrive))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${a}</span>
          <span class="chat-group-timestamp">${c}</span>
        </div>
      </div>
    </div>
  `}function Ao(e,t){const n=wi(e),s=t?.assistantName?.trim()||"Assistant",i=typeof t?.assistantAvatar=="string"?t.assistantAvatar.trim():"",a=t?.userName?.trim()||"You",o=typeof t?.userAvatar=="string"?t.userAvatar.trim():"",c=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return n==="user"?o&&yl(o)?r`<img
        class="chat-avatar ${c}"
        src="${o}"
        alt="${a}"
      />`:o?r`<div class="chat-avatar ${c}">${o}</div>`:r`<div class="chat-avatar ${c}">${a.charAt(0).toUpperCase()||"C"}</div>`:n==="assistant"?i&&yl(i)?r`<img
        class="chat-avatar ${c}"
        src="${i}"
        alt="${s}"
      />`:i?r`<div class="chat-avatar ${c}" style="color: var(--accent);">${i}</div>`:r`<div class="chat-avatar ${c}" style="color: var(--accent);">⚛️</div>`:n==="tool"?r`<div class="chat-avatar ${c}">⚙</div>`:r`<div class="chat-avatar ${c}">?</div>`}function yl(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function vl(e,t,n){if(e.length===0)return p;const s=e.map((a,o)=>{if((a.omitted||!a.url)&&n){const c=n(o);if(c)return{...a,resolvedUrl:c}}return a}),i=s.filter(a=>(a.resolvedUrl||a.url)&&!a.omitted||a.resolvedUrl).map(a=>({url:a.resolvedUrl||a.url,alt:a.alt}));return r`
    <div class="chat-message-images">
      ${s.map(a=>{const o=a.resolvedUrl||a.url;if(!o){const d=dy(a.bytes),l=[a.mimeType?a.mimeType.replace("image/","").toUpperCase():null,d].filter(Boolean).join(" · ");return r`
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
  `}function gy(e){return e.length===0?p:r`
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
  `}function Sd(e,t,n,s,i,a,o,c){try{return my(e,t,n,s,i,a,o,c)}catch(d){return console.error("[chat] message render error:",d),r`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `}}function my(e,t,n,s,i,a,o,c){const d=e,u=typeof d.role=="string"?d.role:"unknown",l=yd(e)||u.toLowerCase()==="toolresult"||u.toLowerCase()==="tool_result"||typeof d.toolCallId=="string"||typeof d.tool_call_id=="string",h=Gm(e),f=h.length>0,v=Ia(e),b=v.length>0,$=typeof d._chatIdx=="number"?d._chatIdx:-1,k=o&&$>=0?te=>o($,te):void 0,S=uy(e),_=S.length>0,L=So(e),E=t.showReasoning&&u==="assistant"?gd(e):null,x=u==="user"&&L?sy(L):null,T=u==="user"?xo(e):null,A=T?oy(T):null,F=[...x??[],...A??[]],I=F.length>0;let z=L;if(u==="user"&&z&&(z=cy(z),z=ly(z)),z&&(z=z.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim()||null),z){const te=$o(z);te&&(z=te)}I&&z&&(z=ay(z));const q=z?.trim()?z:null,j=E?md(E):null,ge=q,Re=u==="assistant"&&!!ge?.trim(),Qe=["chat-bubble",Re?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");if(f&&l)return r`
      ${b?vl(v,a,k):p}
      ${h.map(te=>pl(te,n,s,i,c))}
    `;if(!ge&&!f&&!b&&!_&&!I&&!j){const te=typeof d.errorMessage=="string"?d.errorMessage:null;if(d.stopReason==="error"&&te){let le=te;const O=te.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(O){const _e=parseInt(O[1]).toLocaleString(),At=parseInt(O[2]).toLocaleString();le=`Context overflow: ${_e} tokens exceeded the ${At} token limit. The conversation needs to be compacted.`}else te.includes("prompt is too long")&&(le="Context overflow: The conversation is too long for the model.");return r`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${le}</div>
        </div>
      `}if(u==="user"&&L?.trim()){let le=L.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim();if(le.startsWith("System:")||le.startsWith("GatewayRestart:")||le.startsWith("Sender (untrusted metadata)")){const O=le.indexOf(`

`);le=O!==-1?le.slice(O+2).trim():""}if(le)return r`
          <div class="chat-bubble fade-in">
            <div class="chat-text">${le}</div>
          </div>
        `}return p}return r`
    <div class="${Qe}">
      ${Re?gm(ge):p}
      ${I?iy(F):p}
      ${vl(v,a,k)}
      ${gy(S)}
      ${j?r`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${at(Se(j))}</div>
            </details>`:p}
      ${ge?r`<div class="chat-text" @click=${te=>ny(te,s)}>${at(t.isStreaming?pd(ge):Se(ge))}</div>`:p}
      ${h.map(te=>pl(te,n,s,i,c))}
    </div>
  `}function yy(e){const t=e,n=typeof t.content=="string"?t.content:"",s=typeof t.keptMessages=="number"?t.keptMessages:null,i=typeof t.timestamp=="number"?new Date(t.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"";return r`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${s!==null?r`<span class="chat-compaction-summary__kept">${s} messages kept</span>`:p}
      </div>
      <div class="chat-compaction-summary__content">
        ${at(Se(n))}
      </div>
      ${i?r`<div class="chat-compaction-summary__timestamp">${i}</div>`:p}
    </div>
  `}function vy(e){return e.isCompactionSummary===!0}async function xd(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const t=await e.client.request("agents.list",{});t&&(e.agentsList=t)}catch(t){e.agentsError=String(t)}finally{e.agentsLoading=!1}}}async function _d(e){if(!(!e.client||!e.connected)&&!e.rosterLoading){e.rosterLoading=!0,e.rosterError=null;try{const t=await e.client.request("queue.roster",{});t?.roster&&(e.rosterData=t.roster)}catch(t){e.rosterError=String(t)}finally{e.rosterLoading=!1}}}const by=Object.freeze(Object.defineProperty({__proto__:null,loadAgents:xd,loadRoster:_d},Symbol.toStringTag,{value:"Module"})),Ad=50,Td=200,wy="Assistant";function ni(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function Ma(e){const t=ni(e?.name,Ad)??wy,n=ni(e?.avatar??void 0,Td)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}function ky(){return Ma(typeof window>"u"?{}:{name:window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__CLAWDBOT_ASSISTANT_AVATAR__})}const $y="You";function bl(e){const t=ni(e?.name,Ad)??$y,n=ni(e?.avatar??void 0,Td)??null;return{name:t,avatar:n}}function Sy(){return bl(typeof window>"u"?{}:{name:window.__CLAWDBOT_USER_NAME__,avatar:window.__CLAWDBOT_USER_AVATAR__})}async function Cd(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const i=await e.client.request("agent.identity.get",s);if(!i)return;const a=Ma(i);e.assistantName=a.name,e.assistantAvatar=a.avatar,e.assistantAgentId=a.agentId??null}catch{}}let wl=!1;function kl(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function xy(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function _y(){wl||(wl=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function ki(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),kl(t)}return _y(),kl(xy())}let Mt=null,zs=null;function Ed(){return zs}const Rd=new Map,vt=new Map;function Oa(e,t){const n=t.filter(s=>s?.role==="user").length;Rd.set(e,n)}async function Ld(e,t){try{const n=await e.request("chat.history",{sessionKey:t,limit:200}),s=Array.isArray(n.messages)?n.messages:[];return vt.set(t,s),Oa(t,s),s}catch{return vt.get(t)??[]}}let dn=0;async function ye(e){if(!e.client||!e.connected)return;const t=e.sessionKey,n=++dn;e.chatLoading=!0,e.lastError=null;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==dn||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,Oa(t,e.chatMessages),vt.set(t,e.chatMessages)}catch{if(n!==dn||e.sessionKey!==t)return;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==dn||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,Oa(t,e.chatMessages),vt.set(t,e.chatMessages)}catch(s){if(n!==dn||e.sessionKey!==t)return;e.lastError=String(s)}}finally{n===dn&&(e.chatLoading=!1)}}async function Pd(e,t){const n=[...e.chatMessages],s=n.length;await ye(e),e.chatStream=null,!t?.allowShrink&&s>0&&(e.chatMessages.length<s||Ay(n,e.chatMessages))&&(e.chatMessages=n,setTimeout(()=>{ye(e).then(()=>{e.chatStream=null})},2e3))}function Ay(e,t){const n=Ty(e,a=>a?.role==="user");if(n===-1)return!1;const i=e[n].timestamp;return typeof i!="number"?!1:!t.some(a=>a?.role==="user"&&a?.timestamp===i)}function Ty(e,t){for(let n=e.length-1;n>=0;n--)if(t(e[n]))return n;return-1}function Cy(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}async function To(e,t,n,s){if(!e.client||!e.connected)return!1;let i=t.trim();const a=n&&n.length>0;if(!i&&!a)return!1;!i&&a&&(i="[attached]");const o=Date.now();if(!s?.skipOptimisticUpdate){const u=[];if(i&&u.push({type:"text",text:i}),a)for(const l of n)l.mimeType.startsWith("image/")?u.push({type:"image",source:{type:"base64",media_type:l.mimeType,data:l.dataUrl}}):u.push({type:"attachment",mimeType:l.mimeType,fileName:l.fileName,content:l.dataUrl});e.chatMessages=[...e.chatMessages,{role:"user",content:u,timestamp:o}]}e.chatSending=!0,e.chatSendingSessionKey=e.sessionKey,e.lastError=null;const c=ki();e.chatRunId=c,e.chatStream="",e.chatStreamStartedAt=o,Mt={message:i,attachments:a?n:void 0};let d;if(a){const u=[],l=[];for(const h of n){const f=Cy(h.dataUrl);if(f)if(f.mimeType.startsWith("image/"))u.push({type:"image",mimeType:f.mimeType,content:f.content,fileName:h.fileName});else{const v=h.fileName||"file";l.push(`<document>
<source>${v}</source>
<mime_type>${f.mimeType}</mime_type>
<content encoding="base64">
${f.content}
</content>
</document>`)}}if(u.length>0&&(d=u),l.length>0&&(i=`${l.join(`

`)}

${i}`),u.length>0){const h=e.chatMessages.length-1,f=e.sessionKey,v=e.client.request("images.cache",{images:u.map(b=>({data:b.content,mimeType:b.mimeType,fileName:b.fileName})),sessionKey:f}).then(b=>{if(b?.cached&&b.cached.length>0){const $=b.cached.map((k,S)=>({messageIndex:h,imageIndex:S,hash:k.hash,mimeType:k.mimeType,bytes:k.bytes,role:"user",timestamp:o}));return e.client.request("images.updateIndex",{sessionKey:f,images:$}).catch(()=>{})}}).catch(()=>{});zs=v,v.finally(()=>{zs===v&&(zs=null)})}}try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:i,deliver:!1,idempotencyKey:c,attachments:d}),!0}catch(u){const l=String(u);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=l,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+l}],timestamp:Date.now()}],!1}finally{e.chatSending=!1,e.chatSendingSessionKey=null}}async function Dd(e){const t=e.pendingRetry;return t?(e.pendingRetry=null,To(e,t.message,t.attachments,{skipOptimisticUpdate:!0})):!1}function Ey(e){e.pendingRetry=null}async function Co(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function Id(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?e.chatStream!==null?null:"final":null;if(t.state!=="delta"&&rm(),t.state==="delta"){const n=$n(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final")e.chatRunId=null,e.chatStreamStartedAt=null,Mt=null;else if(t.state==="aborted")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,Mt=null;else if(t.state==="error"){e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;const n=t.errorMessage??"chat error";e.lastError=n;const s=n.includes("prompt is too long")||n.includes("tokens >");s&&Mt&&(e.pendingRetry={message:Mt.message,attachments:Mt.attachments,timestamp:Date.now()}),Mt=null;let i=n;if(s){const a=n.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(a){const o=parseInt(a[1]).toLocaleString(),c=parseInt(a[2]).toLocaleString();i=`⚠️ Context overflow: ${o} tokens exceeds ${c} limit. Compact the conversation, then click "Retry" to resend your message.`}else i='⚠️ Context overflow: The conversation is too long. Compact and click "Retry" to resend.'}e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:i}],timestamp:Date.now(),isError:!0}]}return t.state}const tt=Object.freeze(Object.defineProperty({__proto__:null,abortChatRun:Co,clearPendingRetry:Ey,getPendingImageCache:Ed,handleChatEvent:Id,laneMessageCache:vt,loadChatHistory:ye,loadChatHistoryAfterFinal:Pd,loadLaneHistory:Ld,retryPendingMessage:Dd,sendChatMessage:To,sessionTurnCounts:Rd},Symbol.toStringTag,{value:"Module"})),Md="godmode.device.auth.v1";function Eo(e){return e.trim()}function Ry(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e){const s=n.trim();s&&t.add(s)}return[...t].sort()}function Ro(){try{const e=window.localStorage.getItem(Md);if(!e)return null;const t=JSON.parse(e);return!t||t.version!==1||!t.deviceId||typeof t.deviceId!="string"||!t.tokens||typeof t.tokens!="object"?null:t}catch{return null}}function Od(e){try{window.localStorage.setItem(Md,JSON.stringify(e))}catch{}}function Ly(e){const t=Ro();if(!t||t.deviceId!==e.deviceId)return null;const n=Eo(e.role),s=t.tokens[n];return!s||typeof s.token!="string"?null:s}function Bd(e){const t=Eo(e.role),n={version:1,deviceId:e.deviceId,tokens:{}},s=Ro();s&&s.deviceId===e.deviceId&&(n.tokens={...s.tokens});const i={token:e.token,role:t,scopes:Ry(e.scopes),updatedAtMs:Date.now()};return n.tokens[t]=i,Od(n),i}function Fd(e){const t=Ro();if(!t||t.deviceId!==e.deviceId)return;const n=Eo(e.role);if(!t.tokens[n])return;const s={...t,tokens:{...t.tokens}};delete s.tokens[n],Od(s)}const Nd={p:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,n:0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,h:8n,a:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,d:0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,Gx:0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,Gy:0x6666666666666666666666666666666666666666666666666666666666666658n},{p:fe,n:Ks,Gx:$l,Gy:Sl,a:ta,d:na,h:Py}=Nd,Vt=32,Lo=64,Dy=(...e)=>{"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(...e)},ce=(e="")=>{const t=new Error(e);throw Dy(t,ce),t},Iy=e=>typeof e=="bigint",My=e=>typeof e=="string",Oy=e=>e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array",St=(e,t,n="")=>{const s=Oy(e),i=e?.length,a=t!==void 0;if(!s||a&&i!==t){const o=n&&`"${n}" `,c=a?` of length ${t}`:"",d=s?`length=${i}`:`type=${typeof e}`;ce(o+"expected Uint8Array"+c+", got "+d)}return e},$i=e=>new Uint8Array(e),Ud=e=>Uint8Array.from(e),zd=(e,t)=>e.toString(16).padStart(t,"0"),Kd=e=>Array.from(St(e)).map(t=>zd(t,2)).join(""),et={_0:48,_9:57,A:65,F:70,a:97,f:102},xl=e=>{if(e>=et._0&&e<=et._9)return e-et._0;if(e>=et.A&&e<=et.F)return e-(et.A-10);if(e>=et.a&&e<=et.f)return e-(et.a-10)},qd=e=>{const t="hex invalid";if(!My(e))return ce(t);const n=e.length,s=n/2;if(n%2)return ce(t);const i=$i(s);for(let a=0,o=0;a<s;a++,o+=2){const c=xl(e.charCodeAt(o)),d=xl(e.charCodeAt(o+1));if(c===void 0||d===void 0)return ce(t);i[a]=c*16+d}return i},Wd=()=>globalThis?.crypto,By=()=>Wd()?.subtle??ce("crypto.subtle must be defined, consider polyfill"),cs=(...e)=>{const t=$i(e.reduce((s,i)=>s+St(i).length,0));let n=0;return e.forEach(s=>{t.set(s,n),n+=s.length}),t},Fy=(e=Vt)=>Wd().getRandomValues($i(e)),si=BigInt,Ot=(e,t,n,s="bad number: out of range")=>Iy(e)&&t<=e&&e<n?e:ce(s),P=(e,t=fe)=>{const n=e%t;return n>=0n?n:t+n},jd=e=>P(e,Ks),Ny=(e,t)=>{(e===0n||t<=0n)&&ce("no inverse n="+e+" mod="+t);let n=P(e,t),s=t,i=0n,a=1n;for(;n!==0n;){const o=s/n,c=s%n,d=i-a*o;s=n,n=c,i=a,a=d}return s===1n?P(i,t):ce("no inverse")},Uy=e=>{const t=Qd[e];return typeof t!="function"&&ce("hashes."+e+" not set"),t},sa=e=>e instanceof Te?e:ce("Point expected"),Ba=2n**256n;class Te{static BASE;static ZERO;X;Y;Z;T;constructor(t,n,s,i){const a=Ba;this.X=Ot(t,0n,a),this.Y=Ot(n,0n,a),this.Z=Ot(s,1n,a),this.T=Ot(i,0n,a),Object.freeze(this)}static CURVE(){return Nd}static fromAffine(t){return new Te(t.x,t.y,1n,P(t.x*t.y))}static fromBytes(t,n=!1){const s=na,i=Ud(St(t,Vt)),a=t[31];i[31]=a&-129;const o=Vd(i);Ot(o,0n,n?Ba:fe);const d=P(o*o),u=P(d-1n),l=P(s*d+1n);let{isValid:h,value:f}=Ky(u,l);h||ce("bad point: y not sqrt");const v=(f&1n)===1n,b=(a&128)!==0;return!n&&f===0n&&b&&ce("bad point: x==0, isLastByteOdd"),b!==v&&(f=P(-f)),new Te(f,o,1n,P(f*o))}static fromHex(t,n){return Te.fromBytes(qd(t),n)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}assertValidity(){const t=ta,n=na,s=this;if(s.is0())return ce("bad point: ZERO");const{X:i,Y:a,Z:o,T:c}=s,d=P(i*i),u=P(a*a),l=P(o*o),h=P(l*l),f=P(d*t),v=P(l*P(f+u)),b=P(h+P(n*P(d*u)));if(v!==b)return ce("bad point: equation left != right (1)");const $=P(i*a),k=P(o*c);return $!==k?ce("bad point: equation left != right (2)"):this}equals(t){const{X:n,Y:s,Z:i}=this,{X:a,Y:o,Z:c}=sa(t),d=P(n*c),u=P(a*i),l=P(s*c),h=P(o*i);return d===u&&l===h}is0(){return this.equals(mn)}negate(){return new Te(P(-this.X),this.Y,this.Z,P(-this.T))}double(){const{X:t,Y:n,Z:s}=this,i=ta,a=P(t*t),o=P(n*n),c=P(2n*P(s*s)),d=P(i*a),u=t+n,l=P(P(u*u)-a-o),h=d+o,f=h-c,v=d-o,b=P(l*f),$=P(h*v),k=P(l*v),S=P(f*h);return new Te(b,$,S,k)}add(t){const{X:n,Y:s,Z:i,T:a}=this,{X:o,Y:c,Z:d,T:u}=sa(t),l=ta,h=na,f=P(n*o),v=P(s*c),b=P(a*h*u),$=P(i*d),k=P((n+s)*(o+c)-f-v),S=P($-b),_=P($+b),L=P(v-l*f),E=P(k*S),x=P(_*L),T=P(k*L),A=P(S*_);return new Te(E,x,A,T)}subtract(t){return this.add(sa(t).negate())}multiply(t,n=!0){if(!n&&(t===0n||this.is0()))return mn;if(Ot(t,1n,Ks),t===1n)return this;if(this.equals(Gt))return Zy(t).p;let s=mn,i=Gt;for(let a=this;t>0n;a=a.double(),t>>=1n)t&1n?s=s.add(a):n&&(i=i.add(a));return s}multiplyUnsafe(t){return this.multiply(t,!1)}toAffine(){const{X:t,Y:n,Z:s}=this;if(this.equals(mn))return{x:0n,y:1n};const i=Ny(s,fe);P(s*i)!==1n&&ce("invalid inverse");const a=P(t*i),o=P(n*i);return{x:a,y:o}}toBytes(){const{x:t,y:n}=this.assertValidity().toAffine(),s=Hd(n);return s[31]|=t&1n?128:0,s}toHex(){return Kd(this.toBytes())}clearCofactor(){return this.multiply(si(Py),!1)}isSmallOrder(){return this.clearCofactor().is0()}isTorsionFree(){let t=this.multiply(Ks/2n,!1).double();return Ks%2n&&(t=t.add(this)),t.is0()}}const Gt=new Te($l,Sl,1n,P($l*Sl)),mn=new Te(0n,1n,1n,0n);Te.BASE=Gt;Te.ZERO=mn;const Hd=e=>qd(zd(Ot(e,0n,Ba),Lo)).reverse(),Vd=e=>si("0x"+Kd(Ud(St(e)).reverse())),ze=(e,t)=>{let n=e;for(;t-- >0n;)n*=n,n%=fe;return n},zy=e=>{const n=e*e%fe*e%fe,s=ze(n,2n)*n%fe,i=ze(s,1n)*e%fe,a=ze(i,5n)*i%fe,o=ze(a,10n)*a%fe,c=ze(o,20n)*o%fe,d=ze(c,40n)*c%fe,u=ze(d,80n)*d%fe,l=ze(u,80n)*d%fe,h=ze(l,10n)*a%fe;return{pow_p_5_8:ze(h,2n)*e%fe,b2:n}},_l=0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,Ky=(e,t)=>{const n=P(t*t*t),s=P(n*n*t),i=zy(e*s).pow_p_5_8;let a=P(e*n*i);const o=P(t*a*a),c=a,d=P(a*_l),u=o===e,l=o===P(-e),h=o===P(-e*_l);return u&&(a=c),(l||h)&&(a=d),(P(a)&1n)===1n&&(a=P(-a)),{isValid:u||l,value:a}},Fa=e=>jd(Vd(e)),Po=(...e)=>Qd.sha512Async(cs(...e)),qy=(...e)=>Uy("sha512")(cs(...e)),Gd=e=>{const t=e.slice(0,Vt);t[0]&=248,t[31]&=127,t[31]|=64;const n=e.slice(Vt,Lo),s=Fa(t),i=Gt.multiply(s),a=i.toBytes();return{head:t,prefix:n,scalar:s,point:i,pointBytes:a}},Do=e=>Po(St(e,Vt)).then(Gd),Wy=e=>Gd(qy(St(e,Vt))),jy=e=>Do(e).then(t=>t.pointBytes),Hy=e=>Po(e.hashable).then(e.finish),Vy=(e,t,n)=>{const{pointBytes:s,scalar:i}=e,a=Fa(t),o=Gt.multiply(a).toBytes();return{hashable:cs(o,s,n),finish:u=>{const l=jd(a+Fa(u)*i);return St(cs(o,Hd(l)),Lo)}}},Gy=async(e,t)=>{const n=St(e),s=await Do(t),i=await Po(s.prefix,n);return Hy(Vy(s,i,n))},Qd={sha512Async:async e=>{const t=By(),n=cs(e);return $i(await t.digest("SHA-512",n.buffer))},sha512:void 0},Qy=(e=Fy(Vt))=>e,Yy={getExtendedPublicKeyAsync:Do,getExtendedPublicKey:Wy,randomSecretKey:Qy},ii=8,Jy=256,Yd=Math.ceil(Jy/ii)+1,Na=2**(ii-1),Xy=()=>{const e=[];let t=Gt,n=t;for(let s=0;s<Yd;s++){n=t,e.push(n);for(let i=1;i<Na;i++)n=n.add(t),e.push(n);t=n.double()}return e};let Al;const Tl=(e,t)=>{const n=t.negate();return e?n:t},Zy=e=>{const t=Al||(Al=Xy());let n=mn,s=Gt;const i=2**ii,a=i,o=si(i-1),c=si(ii);for(let d=0;d<Yd;d++){let u=Number(e&o);e>>=c,u>Na&&(u-=a,e+=1n);const l=d*Na,h=l,f=l+Math.abs(u)-1,v=d%2!==0,b=u<0;u===0?s=s.add(Tl(v,t[h])):n=n.add(Tl(b,t[f]))}return e!==0n&&ce("invalid wnaf"),{p:n,f:s}},ia="godmode-device-identity-v1";function Ua(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"")}function Jd(e){const t=e.replaceAll("-","+").replaceAll("_","/"),n=t+"=".repeat((4-t.length%4)%4),s=atob(n),i=new Uint8Array(s.length);for(let a=0;a<s.length;a+=1)i[a]=s.charCodeAt(a);return i}function ev(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function Xd(e){const t=await crypto.subtle.digest("SHA-256",e);return ev(new Uint8Array(t))}async function tv(){const e=Yy.randomSecretKey(),t=await jy(e);return{deviceId:await Xd(t),publicKey:Ua(t),privateKey:Ua(e)}}async function Io(){try{const n=localStorage.getItem(ia);if(n){const s=JSON.parse(n);if(s?.version===1&&typeof s.deviceId=="string"&&typeof s.publicKey=="string"&&typeof s.privateKey=="string"){const i=await Xd(Jd(s.publicKey));if(i!==s.deviceId){const a={...s,deviceId:i};return localStorage.setItem(ia,JSON.stringify(a)),{deviceId:i,publicKey:s.publicKey,privateKey:s.privateKey}}return{deviceId:s.deviceId,publicKey:s.publicKey,privateKey:s.privateKey}}}}catch{}const e=await tv(),t={version:1,deviceId:e.deviceId,publicKey:e.publicKey,privateKey:e.privateKey,createdAtMs:Date.now()};return localStorage.setItem(ia,JSON.stringify(t)),e}async function nv(e,t){const n=Jd(e),s=new TextEncoder().encode(t),i=await Gy(s,n);return Ua(i)}async function xt(e,t){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,t?.quiet||(e.devicesError=null);try{const n=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(n?.pending)?n.pending:[],paired:Array.isArray(n?.paired)?n.paired:[]}}catch(n){t?.quiet||(e.devicesError=String(n))}finally{e.devicesLoading=!1}}}async function sv(e,t){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:t}),await xt(e)}catch(n){e.devicesError=String(n)}}async function iv(e,t){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:t}),await xt(e)}catch(s){e.devicesError=String(s)}}async function av(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("device.token.rotate",t);if(n?.token){const s=await Io(),i=n.role??t.role;(n.deviceId===s.deviceId||t.deviceId===s.deviceId)&&Bd({deviceId:s.deviceId,role:i,token:n.token,scopes:n.scopes??t.scopes??[]}),window.prompt("New device token (copy and store securely):",n.token)}await xt(e)}catch(n){e.devicesError=String(n)}}async function ov(e,t){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)))try{await e.client.request("device.token.revoke",t);const s=await Io();t.deviceId===s.deviceId&&Fd({deviceId:s.deviceId,role:t.role}),await xt(e)}catch(s){e.devicesError=String(s)}}function za(e){return typeof e=="object"&&e!==null}function rv(e){if(!za(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!za(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const i=typeof e.createdAtMs=="number"?e.createdAtMs:0,a=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!i||!a?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:i,expiresAtMs:a}}function lv(e){if(!za(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function Zd(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function cv(e,t){const n=Zd(e).filter(s=>s.id!==t.id);return n.push(t),n}function Cl(e,t){return Zd(e).filter(n=>n.id!==t)}async function Si(e,t){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,t?.quiet||(e.lastError=null);try{const n=await e.client.request("node.list",{}),s=Array.isArray(n.nodes)?n.nodes:[];JSON.stringify(s)!==JSON.stringify(e.nodes)&&(e.nodes=s)}catch(n){t?.quiet||(e.lastError=String(n))}finally{e.nodesLoading=!1}}}const eu="godmode:autoTitleCache";function dv(){try{const e=localStorage.getItem(eu);if(e){const t=JSON.parse(e);return new Map(t)}}catch{}return new Map}function aa(e){try{const t=[...e.entries()],n=t.length>200?t.slice(-200):t;localStorage.setItem(eu,JSON.stringify(n))}catch{}}class uv extends Map{set(t,n){return super.set(t,n),aa(this),this}delete(t){const n=super.delete(t);return n&&aa(this),n}clear(){super.clear(),aa(this)}}const je=new uv(dv());async function oe(e,t){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const n=t?.includeGlobal??e.sessionsIncludeGlobal,s=t?.includeUnknown??e.sessionsIncludeUnknown,i=t?.activeMinutes??Ys(e.sessionsFilterActive,0),a=t?.limit??Ys(e.sessionsFilterLimit,50),o={includeGlobal:n,includeUnknown:s};i>0&&(o.activeMinutes=i),a>0&&(o.limit=a);const c=await e.client.request("sessions.list",o);if(c){if(c.sessions){const d=new Map;if(e.sessionsResult?.sessions)for(const u of e.sessionsResult.sessions)u.displayName&&d.set(u.key,u.displayName);c.sessions=c.sessions.map(u=>{if(u.label||u.displayName)return u;let l=je.get(u.key);if(!l){const f=u.key.split(":").pop();if(f&&f.length>=4){for(const[v,b]of je)if(v===u.key||v.endsWith(`:${f}`)||u.key.endsWith(`:${v.split(":").pop()}`)){l=b;break}}}if(l)return{...u,displayName:l};const h=d.get(u.key);return h?{...u,displayName:h}:u})}e.sessionsResult=c}}catch(n){e.sessionsError=String(n)}finally{e.sessionsLoading=!1}}}async function qs(e,t,n){if(!e.client||!e.connected)return{ok:!1};const s={key:t};"label"in n&&(s.label=n.label),"displayName"in n&&(s.displayName=n.displayName),"thinkingLevel"in n&&(s.thinkingLevel=n.thinkingLevel),"verboseLevel"in n&&(s.verboseLevel=n.verboseLevel),"reasoningLevel"in n&&(s.reasoningLevel=n.reasoningLevel);try{const{safeRequest:i}=await R(async()=>{const{safeRequest:o}=await Promise.resolve().then(()=>_v);return{safeRequest:o}},void 0,import.meta.url),a=await i(e.client,"sessions.patch",s);return a.ok?{ok:!0,canonicalKey:a.data?.key??t}:(e.sessionsError=a.error,{ok:!1})}catch(i){return e.sessionsError=String(i),{ok:!1}}}async function tu(e,t){if(!(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${t}"?

Deletes the session entry and archives its transcript.`))){e.sessionsLoading=!0,e.sessionsError=null;try{await e.client.request("sessions.delete",{key:t,deleteTranscript:!0}),await oe(e)}catch(s){e.sessionsError=String(s)}finally{e.sessionsLoading=!1}}}async function Qt(e){if(!(!e.client||!e.connected)){e.archivedSessionsLoading=!0;try{const t=await e.client.request("sessions.archived",{});t?.archived&&(e.archivedSessions=t.archived)}catch{}finally{e.archivedSessionsLoading=!1}}}async function nu(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.archive",{sessionKey:t}),await Qt(e),await oe(e)}catch(n){e.sessionsError=`Archive failed: ${String(n)}`}}async function su(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.unarchive",{sessionKey:t}),await Qt(e),await oe(e)}catch(n){e.sessionsError=`Unarchive failed: ${String(n)}`}}async function iu(e){if(!e.client||!e.connected)return 0;try{const n=(await e.client.request("sessions.autoArchive",{}))?.archivedCount??0;return await Qt(e),await oe(e),n}catch(t){return e.sessionsError=`Auto-archive failed: ${String(t)}`,0}}const zn=Object.freeze(Object.defineProperty({__proto__:null,archiveSession:nu,autoTitleCache:je,deleteSession:tu,loadArchivedSessions:Qt,loadSessions:oe,patchSession:qs,triggerAutoArchive:iu,unarchiveSession:su},Symbol.toStringTag,{value:"Module"})),hv=1800*1e3;function au(e){return{openclawVersion:e.openclaw.version,openclawLatest:e.openclaw.latest,openclawUpdateAvailable:e.openclaw.updateAvailable,openclawInstallKind:e.openclaw.installKind,openclawChannel:e.openclaw.channel,pluginVersion:e.plugin.version,pluginLatest:e.plugin.latest,pluginUpdateAvailable:e.plugin.updateAvailable,pendingDeploy:e.pendingDeploy??null,fetchOk:e.fetchOk}}function ou(e){const t=typeof e.behind=="number"?e.behind:null;return{openclawVersion:String(e.version??"unknown"),openclawLatest:null,openclawUpdateAvailable:(t??0)>0,openclawInstallKind:"unknown",openclawChannel:null,pluginVersion:"unknown",pluginLatest:null,pluginUpdateAvailable:!1,pendingDeploy:null,fetchOk:e.fetchOk}}async function pv(e){if(!(!e.client||!e.connected)){e.updateLoading=!0,e.updateError=null;try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=au(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});t.error&&(e.updateError=String(t.error)),e.updateStatus=ou(t),e.updateLastChecked=Date.now()}catch(t){e.updateError=String(t)}}finally{e.updateLoading=!1}}}async function El(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=au(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});e.updateStatus=ou(t),e.updateLastChecked=Date.now()}catch{}}}function fv(e){e.updatePollInterval==null&&(El(e),e.updatePollInterval=window.setInterval(()=>{El(e)},hv))}function gv(e){const t=e;t.updatePollInterval!=null&&(clearInterval(t.updatePollInterval),t.updatePollInterval=null)}async function mv(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.postStatus",{});if(!t)return;const n=t.overallStatus,s=t.summary;if(!s)return;const i=n==="healthy"?"success":n==="degraded"?"error":"warning";typeof e.showToast=="function"&&e.showToast(s,i),pv(e)}catch{}}const ru={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},Rl=ru,Ka={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(ru));new Set(Object.values(Ka));function yv(e){const t=e.version??(e.nonce?"v2":"v1"),n=e.scopes.join(","),s=e.token??"",i=[t,e.deviceId,e.clientId,e.clientMode,e.role,n,String(e.signedAtMs),s];return t==="v2"&&i.push(e.nonce??""),i.join("|")}const vv=4008;class bv{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.read","operator.write","operator.approvals","operator.pairing"],s="operator";let i=null,a=!1,o=this.opts.token;if(t){i=await Io();const l=Ly({deviceId:i.deviceId,role:s})?.token;o=l??this.opts.token,a=!!(l&&this.opts.token)}const c=o||this.opts.password?{token:o,password:this.opts.password}:void 0;let d;if(t&&i){const l=Date.now(),h=this.connectNonce??void 0,f=yv({deviceId:i.deviceId,clientId:this.opts.clientName??Rl.CONTROL_UI,clientMode:this.opts.mode??Ka.WEBCHAT,role:s,scopes:n,signedAtMs:l,token:o??null,nonce:h}),v=await nv(i.privateKey,f);d={id:i.deviceId,publicKey:i.publicKey,signature:v,signedAt:l,nonce:h}}const u={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??Rl.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??Ka.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:d,caps:[],auth:c,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",u).then(l=>{l?.auth?.deviceToken&&i&&Bd({deviceId:i.deviceId,role:l.auth.role??s,token:l.auth.deviceToken,scopes:l.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(l)}).catch(()=>{a&&i&&Fd({deviceId:i.deviceId,role:s}),this.ws?.close(vv,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const i=n;if(i.event==="connect.challenge"){const o=i.payload,c=o&&typeof o.nonce=="string"?o.nonce:null;c&&(this.connectNonce=c,this.sendConnect());return}const a=typeof i.seq=="number"?i.seq:null;a!==null&&(this.lastSeq!==null&&a>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:a}),this.lastSeq=a);try{this.opts.onEvent?.(i)}catch(o){console.error("[gateway] event handler error:",o)}return}if(s.type==="res"){const i=n,a=this.pending.get(i.id);if(!a)return;this.pending.delete(i.id),i.ok?a.resolve(i.payload):a.reject(new Error(i.error?.message??"request failed"));return}}request(t,n){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const s=ki(),i={type:"req",id:s,method:t,params:n},a=new Promise((o,c)=>{this.pending.set(s,{resolve:d=>o(d),reject:c})});return this.ws.send(JSON.stringify(i)),a}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}const lu={displayName:"label",sessionKey:"conversationId"},cu={};for(const[e,t]of Object.entries(lu))cu[t]=e;const wv={"sessions.autoTitle":["sessions.patch"],"sessions.rename":["sessions.patch"]},Yt=new Map;function kv(){try{const e=sessionStorage.getItem("godmode:healing-cache");if(e){const t=JSON.parse(e);for(const[n,s]of Object.entries(t))Yt.set(n,s)}}catch{}}function Ll(){try{const e={};for(const[t,n]of Yt)e[t]=n;sessionStorage.setItem("godmode:healing-cache",JSON.stringify(e))}catch{}}kv();function $v(e,t){const n=Yt.get(e);if(!n)return{method:e,params:t};const s=n.resolvedMethod;if(t&&typeof t=="object"&&!Array.isArray(t)&&Object.keys(n.fieldRenames).length>0){const i={...t};for(const[a,o]of Object.entries(n.fieldRenames))a in i&&!(o in i)&&(i[o]=i[a],delete i[a]);return{method:s,params:i}}return{method:s,params:t}}function Sv(e,t,n){const s=n.toLowerCase(),i=n.match(/unexpected property[:\s]*['"]?(\w+)['"]?/i);if(i){const a=i[1],o=lu[a];if(o&&t&&typeof t=="object"){const c={...t};if(a in c)return c[o]=c[a],delete c[a],console.log(`[safe-request] Self-heal: ${e} — rewrote "${a}" → "${o}"`),{method:e,params:c,renames:{[a]:o}}}}if(s.includes("unknown method")||s.includes("method not found")){const a=wv[e];if(a&&a.length>0){const o=a[0];return console.log(`[safe-request] Self-heal: ${e} not found — falling back to ${o}`),{method:o,params:t,renames:{}}}}if((s.includes("unexpected property")||s.includes("unknown field"))&&t&&typeof t=="object"){const a={...t};let o=!1;const c={};for(const[d,u]of Object.entries(cu))d in a&&(a[u]=a[d],delete a[d],c[d]=u,o=!0,console.log(`[safe-request] Self-heal: ${e} — reverse alias "${d}" → "${u}"`));if(o)return{method:e,params:a,renames:c}}return null}async function ai(e,t,n,s){const i=s?.timeout??3e4;let{method:a,params:o}=s?.raw?{method:t,params:n}:$v(t,n);const c=async(d,u)=>Promise.race([e.request(d,u),new Promise((l,h)=>setTimeout(()=>h(new Error(`Request timeout (${i}ms): ${d}`)),i))]);try{return{ok:!0,data:await c(a,o),method:a,healed:a!==t}}catch(d){const u=String(d instanceof Error?d.message:d);if(s?.raw)return{ok:!1,error:u,method:t};const l=Sv(a,o,u);if(l)try{const h=await c(l.method,l.params);return Yt.set(t,{resolvedMethod:l.method,fieldRenames:l.renames,ts:Date.now()}),Ll(),{ok:!0,data:h,method:l.method,healed:!0}}catch(h){return{ok:!1,error:String(h instanceof Error?h.message:h),method:l.method,healed:!0}}if(s?.fallbacks)for(const h of s.fallbacks)try{const f=await c(h,o);return Yt.set(t,{resolvedMethod:h,fieldRenames:{},ts:Date.now()}),Ll(),{ok:!0,data:f,method:h,healed:!0}}catch{continue}return{ok:!1,error:u,method:a}}}function du(){Yt.clear();try{sessionStorage.removeItem("godmode:healing-cache")}catch{}}function xv(){const e={};for(const[t,n]of Yt)e[t]=n;return e}const _v=Object.freeze(Object.defineProperty({__proto__:null,clearHealingCache:du,getHealingEntries:xv,safeRequest:ai},Symbol.toStringTag,{value:"Module"}));let $e=null;function uu(e,t){du();const n=String(e.version??e.serverVersion??e.gatewayVersion??"unknown"),s=typeof e.protocol=="number"?e.protocol:void 0;$e={hostVersion:n,protocolVersion:s,methods:{},initializedAt:Date.now(),probing:!0};try{const i=sessionStorage.getItem("godmode:host-compat");if(i){const a=JSON.parse(i);if(a.hostVersion===n&&a.methods)return $e.methods=a.methods,$e.probing=!1,$e}}catch{}return Av(t).catch(()=>{}),$e}async function Av(e){if(!$e)return;const t=[{method:"sessions.list",params:{limit:1}},{method:"sessions.patch",params:{key:"__compat_probe__"}},{method:"sessions.autoTitle",params:{sessionKey:"__compat_probe__"}},{method:"config.get",params:{}}];for(const n of t){const s={available:!1,testedAt:Date.now()};try{await e.request(n.method,n.params),s.available=!0}catch(i){const a=String(i instanceof Error?i.message:i),o=a.toLowerCase(),c=o.includes("unknown method")||o.includes("not found")&&o.includes("method");s.available=!c,c&&(s.error="method not available");const d=a.match(/(?:expected|valid|accepted) (?:fields?|properties?)[:\s]*\[([^\]]+)\]/i);d&&(s.fields=d[1].split(",").map(u=>u.trim().replace(/['"]/g,"")))}$e.methods[n.method]=s}$e.probing=!1;try{sessionStorage.setItem("godmode:host-compat",JSON.stringify($e))}catch{}}function hu(e){if(!$e)return;const t=$e.methods[e];if(t)return t.available}function Tv(){return $e?.hostVersion??"unknown"}function Cv(){return $e}function Ev(){return $e?.probing??!1}async function pu(e,t,n){const s=await ai(e,"sessions.patch",{key:t,label:n});return s.ok?{ok:!0}:(await ai(e,"sessions.patch",{key:t,displayName:n},{raw:!0})).ok?{ok:!0}:{ok:!1,error:s.error}}async function Rv(e,t,n){if(hu("sessions.autoTitle")!==!1){const c=await ai(e,"sessions.autoTitle",{sessionKey:t});if(c.ok)return{ok:!0,title:c.data?.title}}const i=n.find(c=>c.role==="user");if(!i)return{ok:!1,error:"No user message to derive title from"};const a=Lv(i.content),o=await pu(e,t,a);return o.ok?{ok:!0,title:a}:{ok:!1,error:o.error}}function Lv(e){let t=e.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").replace(/https?:\/\/\S+/g,"").replace(/[#*_~>]/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").trim();if(t=t.split(`
`).filter(s=>s.trim().length>0)[0]??"New conversation",t.length>60){const s=t.slice(0,57),i=s.lastIndexOf(" ");t=(i>30?s.slice(0,i):s)+"..."}return t}function Pv(e){return String(e.label??e.displayName??e.key??"Untitled")}const Dv=Object.freeze(Object.defineProperty({__proto__:null,getHostCompat:Cv,getHostVersion:Tv,hasMethod:hu,hostAutoTitle:Rv,hostPatchSession:pu,initHostCompat:uu,isProbing:Ev,readSessionName:Pv},Symbol.toStringTag,{value:"Module"})),qa=new Map;let Pl=null,oa=!1;function Iv(e,t,n){return qa.get(`${e}:${t}:${n}`)??null}async function fu(e){if(!e.client||!e.chatMessages?.length)return;const t=e.sessionKey,n=[];for(let s=0;s<e.chatMessages.length;s++){const i=e.chatMessages[s],a=Ia(i);for(let o=0;o<a.length;o++)if(a[o].url&&!a[o].omitted){const c=/^data:([^;]+);base64,(.+)$/.exec(a[o].url);c&&n.push({data:c[2],mimeType:c[1],messageIndex:s,imageIndex:o,role:i.role||"unknown",timestamp:typeof i.timestamp=="number"?i.timestamp:void 0})}}if(n.length>0)try{const s=await e.client.request("images.cache",{images:n.map(i=>({data:i.data,mimeType:i.mimeType})),sessionKey:t});if(s?.cached){const i=n.map((a,o)=>({messageIndex:a.messageIndex,imageIndex:a.imageIndex,hash:s.cached[o]?.hash,mimeType:a.mimeType,bytes:s.cached[o]?.bytes??0,role:a.role,timestamp:a.timestamp})).filter(a=>!!a.hash);i.length>0&&await e.client.request("images.updateIndex",{sessionKey:t,images:i})}}catch{}if(!oa){oa=!0;try{const s=Ed();s&&await s.catch(()=>{});const i=async()=>{const o=await e.client.request("images.resolve",{sessionKey:t});if(o?.images&&Object.keys(o.images).length>0){Pl!==t&&qa.clear();for(const[c,d]of Object.entries(o.images))qa.set(`${t}:${c}`,d);return Pl=t,e.chatMessages=[...e.chatMessages],!0}return!1};if(!await i()&&e.chatMessages?.some(o=>Ia(o).some(d=>d.omitted||!d.url))){for(const o of[500,1500,3e3])if(await new Promise(c=>setTimeout(c,o)),await i()||e.sessionKey!==t)break}}catch{}finally{oa=!1}}}let Dl=null;function Mv(e){if(!e.chatMessages?.length)return;const t=e.chatMessages.slice(-5);for(const n of t){const s=n,i=Array.isArray(s.content)?s.content:[];for(const a of i){const o=a,c=typeof o.text=="string"?o.text:typeof o.content=="string"?o.content:null;if(c)try{const d=JSON.parse(c);if(d._sidebarAction?.type==="proof"&&d._sidebarAction.slug){const u=d._sidebarAction.slug;if(u===Dl)return;Dl=u,e.handleOpenProofDoc(u);return}}catch{}}}}function oi(e){fu(e)}const jn=[];function Ov(){return[...jn]}let gt=null;const Bv=10,Fv=1e3,Pe=new Map;function ra(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const i=t.mainKey?.trim()||"main",a=t.defaultAgentId?.trim();return n==="main"||n===i||a&&(n===`agent:${a}:main`||n===`agent:${a}:${i}`)?s:n}function Nv(e,t){if(!t?.mainSessionKey)return;const n="main",s=l=>(l??"").trim()===n||(l??"").trim()==="",i=s(e.sessionKey)?e.sessionKey:ra(e.sessionKey,t),a=s(e.settings.sessionKey)?e.settings.sessionKey:ra(e.settings.sessionKey,t),o=s(e.settings.lastActiveSessionKey)?e.settings.lastActiveSessionKey:ra(e.settings.lastActiveSessionKey,t),c=i||a||e.sessionKey,d={...e.settings,sessionKey:a||c,lastActiveSessionKey:o||c},u=d.sessionKey!==e.settings.sessionKey||d.lastActiveSessionKey!==e.settings.lastActiveSessionKey;c!==e.sessionKey&&(e.sessionKey=c),u&&ot(e,d)}function Uv(e){gt&&(clearTimeout(gt),gt=null);const t=(e.reconnectAttempt??0)+1;if(t>Bv){e.lastError="Connection lost. Please refresh the page.",e.reconnecting=!1;return}e.reconnectAttempt=t,e.reconnecting=!0;const n=Math.min(Fv*Math.pow(2,t-1),3e4);gt=setTimeout(()=>{gt=null,e.connected||Mo(e)},n)}async function zv(e){if(!e.client)return;const t=e;try{if(t.setupQuickDone){t.workspaceNeedsSetup=!1;return}try{if((await e.client.request("onboarding.status",{}))?.identity?.name){t.workspaceNeedsSetup=!1;return}}catch{}const n=await e.client.request("projects.list",{});t.workspaceNeedsSetup=!n?.projects||n.projects.length===0}catch{}}async function Kv(e){if(!e.client)return;if(e.workspaceNeedsSetup===!1){try{const n=await e.client.request("onboarding.status",{});n&&!n.completedAt&&await e.client.request("onboarding.complete",{summary:null})}catch{}return}try{const n=await e.client.request("onboarding.status",{}),s=e;if(n&&!n.completedAt){s.onboardingActive=!0,s.onboardingPhase=n.phase??0,s.onboardingData=n;const i=e;if(i.showSetupTab=!0,n.identity?.name){i.setupQuickDone=!0;const a=e;(!a.userName||!a.settings.userName)&&(a.userName=n.identity.name,a.applySettings({...a.settings,userName:n.identity.name}))}}else s.onboardingActive=!1,s.onboardingData=n??null}catch{}}function qv(e,t){if(!e.sessionsResult?.sessions)return;const n=e.sessionsResult.sessions.map(s=>s.key===t?{...s,updatedAt:Date.now()}:s);e.sessionsResult={...e.sessionsResult,sessions:n}}const gu=new Set;function Wv(){gu.clear()}async function jv(e,t){}function Mo(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null,Wv();const t=e;"sessionsLoading"in t&&(t.sessionsLoading=!1),"agentsLoading"in t&&(t.agentsLoading=!1),"nodesLoading"in t&&(t.nodesLoading=!1),"devicesLoading"in t&&(t.devicesLoading=!1),"channelsLoading"in t&&(t.channelsLoading=!1),"configLoading"in t&&(t.configLoading=!1),"presenceLoading"in t&&(t.presenceLoading=!1),"cronLoading"in t&&(t.cronLoading=!1),"skillsLoading"in t&&(t.skillsLoading=!1),"debugLoading"in t&&(t.debugLoading=!1),"logsLoading"in t&&(t.logsLoading=!1),gt&&(clearTimeout(gt),gt=null),e.client?.stop(),e.client=new bv({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:n=>{const s=e.reconnecting;if(e.connected=!0,e.lastError=null,e.hello=n,e.reconnecting=!1,e.reconnectAttempt=0,s){const i=e;typeof i.showToast=="function"&&i.showToast("Gateway reconnected","success",4e3),e.lastError="✓ Reconnected",setTimeout(()=>{e.lastError==="✓ Reconnected"&&(e.lastError=null)},3e3),e.chatRunId=null;const a=e;"chatStream"in a&&(a.chatStream=null),"chatStreamStartedAt"in a&&(a.chatStreamStartedAt=null);const o=e;if(o.todaySelectedDate){const c=new Date,d=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}-${String(c.getDate()).padStart(2,"0")}`;o.todaySelectedDate!==d&&(o.todaySelectedDate=d)}e.workingSessions.clear(),e.requestUpdate?.();for(const c of Pe.values())clearTimeout(c);Pe.clear()}uu(n,e.client),Jv(e,n),Cd(e),xd(e),Si(e,{quiet:!0}),xt(e,{quiet:!0}),oe(e),vs(e),zv(e).then(()=>Kv(e)),Gv(e),Qv(e),fv(e),mv(e),Yv(e)},onClose:({code:n,reason:s})=>{e.connected=!1,gv(e);const i=e;"chatSending"in i&&(i.chatSending=!1),"chatSendingSessionKey"in i&&(i.chatSendingSessionKey=null),"chatRunId"in i&&(i.chatRunId=null),"chatStream"in i&&(i.chatStream=null),"chatStreamStartedAt"in i&&(i.chatStreamStartedAt=null);const a=e;"sessionsLoading"in a&&(a.sessionsLoading=!1),"agentsLoading"in a&&(a.agentsLoading=!1),"nodesLoading"in a&&(a.nodesLoading=!1),"devicesLoading"in a&&(a.devicesLoading=!1),"channelsLoading"in a&&(a.channelsLoading=!1),"presenceLoading"in a&&(a.presenceLoading=!1),n!==1012&&(e.lastError=`disconnected (${n}): ${s||"no reason"}`),Uv(e)},onEvent:n=>Hv(e,n),onGap:({expected:n,received:s})=>{e.lastError=`event gap detected (expected seq ${n}, got ${s}); refresh recommended`}}),e.client.start()}function Hv(e,t){try{Vv(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function Vv(e,t){if(jn.unshift({ts:Date.now(),event:t.event,payload:t.payload}),jn.length>250&&(jn.length=250),e.tab==="debug"&&(e.eventLog=[...jn]),t.event==="agent"){if(e.onboarding)return;const n=t.payload,s=n?.sessionKey;s&&n?.stream==="tool"&&n.data?.phase==="start"&&(e.workingSessions.has(s)||(e.workingSessions.add(s),e.requestUpdate?.())),If(e,n);return}if(t.event==="chat"){const n=t.payload;if(n?.sessionKey){if(Go(e,n.sessionKey),n.state==="delta"){const a=Pe.get(n.sessionKey);a&&(clearTimeout(a),Pe.delete(n.sessionKey)),e.workingSessions.has(n.sessionKey)||(e.workingSessions.add(n.sessionKey),e.requestUpdate?.());const o=`safety:${n.sessionKey}`,c=Pe.get(o);c&&clearTimeout(c),Pe.set(o,setTimeout(()=>{Pe.delete(o),e.workingSessions.has(n.sessionKey)&&(e.workingSessions.delete(n.sessionKey),e.requestUpdate?.())},9e4))}else if((n.state==="final"||n.state==="error"||n.state==="aborted")&&e.workingSessions.has(n.sessionKey)){const a=Pe.get(n.sessionKey);a&&(clearTimeout(a),Pe.delete(n.sessionKey));const o=`safety:${n.sessionKey}`,c=Pe.get(o);c&&(clearTimeout(c),Pe.delete(o)),e.workingSessions.delete(n.sessionKey),e.requestUpdate?.()}}n.state==="final"&&qv(e,n.sessionKey);const s=Id(e,n),i=n?.sessionKey===J||(n?.sessionKey?.endsWith(`:${J}`)??!1);if(n&&i){const a=e,o=e.tab==="chat"&&e.sessionKey===J;if(n.state==="delta"){const c=$n(n.message);if(!o){if(typeof c=="string"){const d=a.allyStream??"";(!d||c.length>=d.length)&&(a.allyStream=c)}a.allyWorking=!0,a.requestUpdate?.()}}else if(n.state==="final"){a.allyStream=null,a.allyWorking=!1,!a.allyPanelOpen&&e.tab!=="chat"&&(a.allyUnread=(a.allyUnread??0)+1);const c=e;c._loadAllyHistory().then(()=>{a.allyPanelOpen&&c._scrollAllyToBottom(),a.requestUpdate?.()})}else if(n.state==="error"||n.state==="aborted"){const c=$n(n.message),d=n.state==="aborted"?"Response was stopped.":c||"Something went wrong — try again.";a.allyMessages=[...a.allyMessages??[],{role:"assistant",content:`*${d}*`,timestamp:Date.now()}],a.allyStream=null,a.allyWorking=!1,a.requestUpdate?.()}}if(n.state==="final"&&(async()=>{await jv(e,n.sessionKey);try{await oe(e,{activeMinutes:0})}catch{}})(),s==="final"||s==="error"||s==="aborted"){if(ro(e),sh(e),s==="final"&&e.compactionStatus?.active){e.compactionStatus={active:!1,startedAt:e.compactionStatus.startedAt??null,completedAt:Date.now()};const a=e;a.autoRetryAfterCompact&&a.pendingRetry?(a.autoRetryAfterCompact=!1,setTimeout(()=>{a.handleRetryMessage?.()},500)):(a.showToast?.("Compaction complete — resuming...","info",2e3),setTimeout(()=>{a.handleSendChat?.("Continue where you left off.")},800))}(s==="error"||s==="aborted")&&e.compactionStatus?.active&&(e.compactionStatus=null),e.refreshSessionsAfterChat=!1}if(s==="final"){const a=!!e.compactionStatus?.completedAt;Pd(e,{allowShrink:a}).then(()=>{fu(e),e.loadSessionResources?.(),Mv(e);const c=e;if(!c.compactionStatus?.active){const u=[...Array.isArray(c.chatMessages)?c.chatMessages:[]].reverse().find(l=>typeof l=="object"&&l!==null&&l.role==="user");if(u){const l=u.content;let h="";typeof l=="string"?h=l:Array.isArray(l)&&(h=l.filter(f=>typeof f?.text=="string").map(f=>f.text).join(" ")),(h.includes("Pre-compaction memory flush")||h.includes("pre-compaction memory flush"))&&(c.showToast?.("Context compacted — resuming conversation...","info",2e3),setTimeout(()=>{c.handleSendChat?.("Continue where you left off.")},800))}}});const o=e;o.tab==="dashboards"&&o.activeDashboardManifest?.sessionId&&o.activeDashboardManifest.sessionId===n.sessionKey&&R(async()=>{const{loadDashboard:c}=await Promise.resolve().then(()=>Qn);return{loadDashboard:c}},void 0,import.meta.url).then(({loadDashboard:c})=>{c(e,o.activeDashboardManifest.id)})}return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&Ci(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&xt(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=rv(t.payload);if(n){e.execApprovalQueue=cv(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=Cl(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.process.completed"){const n=t.payload;if(n?.sessionId){const s=n.exitSignal?`signal ${n.exitSignal}`:`exit ${n.exitCode??0}`,i=n.status==="completed"?"✓":"✗",a=n.status==="completed"?"success":"warning",o=n.sessionId.slice(0,8),c=e;typeof c.showToast=="function"&&c.showToast(`${i} Process ${o} ${n.status} (${s})`,a,5e3)}return}if(t.event==="exec.approval.resolved"){const n=lv(t.payload);n&&(e.execApprovalQueue=Cl(e.execApprovalQueue,n.id))}if(t.event==="daily-brief:update"){const n=t.payload;if(n){const s=e;s.dailyBrief=n}return}if(t.event==="ui.slot.update"){const n=t.payload;if(n?.tabId){const s=n.mode??"replace";if(n.html)s==="append"?e.dynamicSlots={...e.dynamicSlots,[n.tabId]:(e.dynamicSlots[n.tabId]??"")+n.html}:e.dynamicSlots={...e.dynamicSlots,[n.tabId]:n.html};else{const a={...e.dynamicSlots};delete a[n.tabId],e.dynamicSlots=a}e.requestUpdate?.()}return}if(t.event==="guardrails:update"){const n=e;typeof n.handleGuardrailsLoad=="function"&&n.handleGuardrailsLoad();return}if(t.event==="godmode.options:update"){const n=t.payload;if(n){const s=e;s.godmodeOptions=n,s.requestUpdate?.()}return}if(t.event==="fathom:meeting-processed"){const n=t.payload;if(n?.title){const s=e;typeof s.showToast=="function"&&s.showToast(`Meeting processed: ${n.title}`,"success",6e3);const i=n.message??`Meeting "${n.title}" has been processed.`;s.allyMessages=[...s.allyMessages??[],{role:"assistant",content:i,timestamp:Date.now()}],!s.allyPanelOpen&&s.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1),s.sessionKey===J&&s.chatMessages&&(s.chatMessages=[...s.chatMessages,{role:"assistant",content:i,timestamp:Date.now()}]),s.requestUpdate?.()}return}if(t.event==="onboarding:update"){const n=t.payload;if(n){const s=e;if(typeof n.phase=="number"&&(s.onboardingPhase=n.phase),s.onboardingData=n,n.completedAt&&(s.onboardingActive=!1),n.identity?.name){const i=e;(!i.userName||!i.settings.userName)&&(i.userName=n.identity.name,i.applySettings({...i.settings,userName:n.identity.name}))}s.requestUpdate?.()}return}if(t.event==="inbox:update"){const n=e;n.handleInboxRefresh?.().catch(()=>{}),n.requestUpdate?.();return}if(t.event==="queue:update"){const n=t.payload,s=e;n?.status==="processing"&&n.proofDocSlug&&s.handleOpenProofDoc?.(n.proofDocSlug).catch(()=>{}),s.handleInboxRefresh?.().catch(()=>{}),s.loadTodayQueueResults?.().catch(()=>{}),s.requestUpdate?.();return}if(t.event==="ally:notification"){const n=t.payload;if(n){const s=e,i={role:"assistant",content:n.summary||"Notification received.",timestamp:Date.now(),isNotification:!0,actions:n.actions??[]};s.allyMessages=[...s.allyMessages??[],i],!s.allyPanelOpen&&e.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1);const a=["queue-complete","queue-needs-review","queue-failed","cron-result"];n.type&&a.includes(n.type)&&s.loadTodayQueueResults&&s.loadTodayQueueResults().catch(()=>{}),n.type&&a.includes(n.type)&&s.handleInboxRefresh&&s.handleInboxRefresh().catch(()=>{}),s.requestUpdate?.()}return}if(t.event==="sessions:updated"){const n=t.payload;n?.sessionKey&&n?.title&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(s=>s.key===n.sessionKey||s.key?.endsWith(`:${n.sessionKey?.split(":").pop()}`)||n.sessionKey?.endsWith(`:${s.key?.split(":").pop()}`)?{...s,displayName:n.title,label:n.title}:s)}),je.set(n.sessionKey,n.title),gu.add(n.sessionKey),e.requestUpdate?.());return}if(t.event==="session:auto-compact"){const n=t.payload;if(n?.sessionKey){const s=e;n.sessionKey===s.sessionKey&&!s.compactionStatus?.active&&s.connected&&(s.showToast?.("Context near limit — auto-compacting...","info",3e3),s.handleCompactChat?.())}return}}async function Gv(e){const t=e;typeof t.loadFocusPulse=="function"&&await t.loadFocusPulse()}async function Qv(e){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}async function Yv(e){if(typeof window>"u")return;const t=new URLSearchParams(window.location.search),n=t.get("openTask");if(!n||!e.client)return;t.delete("openTask");const s=t.toString()?`${window.location.pathname}?${t.toString()}`:window.location.pathname;window.history.replaceState({},"",s);try{const i=await e.client.request("tasks.openSession",{taskId:n});if(i?.sessionKey){e.sessionKey=i.sessionKey,e.tab="chat";const{loadChatHistory:a}=await R(async()=>{const{loadChatHistory:o}=await Promise.resolve().then(()=>tt);return{loadChatHistory:o}},void 0,import.meta.url);await a(e,i.sessionKey)}}catch(i){console.error("[GodMode] Failed to open task session:",i)}}function Jv(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&Nv(e,n.sessionDefaults)}async function xi(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[t,n,s,i]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=t,e.debugHealth=n;const a=s;e.debugModels=Array.isArray(a?.models)?a?.models:[],e.debugHeartbeat=i}catch(t){e.debugCallError=String(t)}finally{e.debugLoading=!1}}}async function Xv(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const t=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},n=await e.client.request(e.debugCallMethod.trim(),t);e.debugCallResult=JSON.stringify(n,null,2)}catch(t){e.debugCallError=String(t)}}}const Zv=2e3,eb=new Set(["trace","debug","info","warn","error","fatal"]);function tb(e){if(typeof e!="string")return null;const t=e.trim();if(!t.startsWith("{")||!t.endsWith("}"))return null;try{const n=JSON.parse(t);return!n||typeof n!="object"?null:n}catch{return null}}function nb(e){if(typeof e!="string")return null;const t=e.toLowerCase();return eb.has(t)?t:null}function sb(e){if(!e.trim())return{raw:e,message:e};try{const t=JSON.parse(e),n=t&&typeof t._meta=="object"&&t._meta!==null?t._meta:null,s=typeof t.time=="string"?t.time:typeof n?.date=="string"?n?.date:null,i=nb(n?.logLevelName??n?.level),a=typeof t[0]=="string"?t[0]:typeof n?.name=="string"?n?.name:null,o=tb(a);let c=null;o&&(typeof o.subsystem=="string"?c=o.subsystem:typeof o.module=="string"&&(c=o.module)),!c&&a&&a.length<120&&(c=a);let d=null;return typeof t[1]=="string"?d=t[1]:!o&&typeof t[0]=="string"?d=t[0]:typeof t.message=="string"&&(d=t.message),{raw:e,time:s,level:i,subsystem:c,message:d??e,meta:n??void 0}}catch{return{raw:e,message:e}}}async function Oo(e,t){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!t?.quiet)){t?.quiet||(e.logsLoading=!0),e.logsError=null;try{const s=await e.client.request("logs.tail",{cursor:t?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),a=(Array.isArray(s.lines)?s.lines.filter(c=>typeof c=="string"):[]).map(sb),o=!!(t?.reset||s.reset||e.logsCursor==null);e.logsEntries=o?a:[...e.logsEntries,...a].slice(-Zv),typeof s.cursor=="number"&&(e.logsCursor=s.cursor),typeof s.file=="string"&&(e.logsFile=s.file),e.logsTruncated=!!s.truncated,e.logsLastFetchAt=Date.now()}catch(n){e.logsError=String(n)}finally{t?.quiet||(e.logsLoading=!1)}}}const mu={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer",subagent:"Sub-Agent",swarm:"Team"};function la(e,t,n){return n?n.replace(/-/g," ").replace(/\b\w/g,s=>s.toUpperCase()):mu[t??e]??e}function ib(e,t){const n=(t??Date.now())-e;if(n<0)return"0s";const s=Math.floor(n/1e3);if(s<60)return`${s}s`;const i=Math.floor(s/60),a=s%60;if(i<60)return`${i}m ${a}s`;const o=Math.floor(i/60),c=i%60;return`${o}h ${c}m`}function ab(){const e=new Date;return e.setHours(0,0,0,0),e.getTime()}function ob(e){switch(e){case"running":case"validating":return"active";case"queued":return"queued";case"failed":return"failed";default:return"done"}}function rb(e,t){const n=[],s=new Set;for(const i of t){i.childSessionKey&&s.add(i.childSessionKey);const a=i.swarm?.enabled===!0,o=i.status==="review";n.push({id:i.id,type:a?"swarm":"coding",task:i.description,status:ob(i.status),model:i.model??null,startedAt:i.startedAt??i.createdAt,endedAt:i.completedAt??null,branch:i.branch,prUrl:i.prUrl,swarmStage:a?i.swarm.currentStage:void 0,swarmStages:a?i.swarm.stages:void 0,error:i.error,canCancel:i.status==="running"||i.status==="validating"||i.status==="queued",roleName:a?"Swarm":"Builder",childSessionKey:i.childSessionKey,isReview:o})}for(const i of e)s.has(i.childSessionKey)||n.push({id:i.runId,type:"subagent",task:i.task,status:i.endedAt?i.outcome?.status==="error"?"failed":"done":"active",model:i.model,startedAt:i.startedAt??i.createdAt,endedAt:i.endedAt,label:i.label,error:i.outcome?.error??void 0,roleName:i.label??"Sub-Agent",childSessionKey:i.childSessionKey});return n.sort((i,a)=>{const o={active:0,queued:1,failed:2,done:3},c=o[i.status]-o[a.status];return c!==0?c:(a.startedAt??0)-(i.startedAt??0)}),n}function lb(e){const t=[];for(const n of e)n.status==="done"&&n.endedAt&&t.push({id:`${n.id}-done`,timestamp:n.endedAt,type:"completed",summary:n.task,prUrl:n.prUrl,agentRef:n}),n.status==="failed"&&n.endedAt&&t.push({id:`${n.id}-fail`,timestamp:n.endedAt,type:"failed",summary:`${n.task}${n.error?` — ${n.error}`:""}`,agentRef:n}),n.status==="active"&&n.startedAt&&t.push({id:`${n.id}-start`,timestamp:n.startedAt,type:"started",summary:n.task,agentRef:n}),n.status==="queued"&&n.startedAt&&t.push({id:`${n.id}-queue`,timestamp:n.startedAt,type:"queued",summary:n.task,agentRef:n});return t.sort((n,s)=>s.timestamp-n.timestamp),t.slice(0,50)}function cb(e,t=0,n=0){const s=ab();let i=0,a=0,o=0,c=0;for(const u of e)u.status==="active"&&i++,u.status==="done"&&u.endedAt&&u.endedAt>=s&&a++,u.status==="failed"&&u.endedAt&&u.endedAt>=s&&o++,u.type==="swarm"&&(u.status==="active"||u.status==="queued")&&c++;const d=e.filter(u=>u.isReview&&(u.type==="coding"||u.type==="swarm")).length;return{activeNow:i,completedToday:a,failed:o,swarmPipelines:c,queueDepth:t,queueReview:n+d}}async function _t(e,t){if(!e.client||!e.connected)return;const n=e;t?.quiet||(n.missionControlLoading=!0),n.missionControlError=null;try{let s=null;try{s=await e.client.request("queue.list",{limit:100})}catch{}let i=[],a=[];try{i=(await e.client.request("subagents.list",{limit:200})).runs??[]}catch{}try{a=(await e.client.request("coding.list",{})).tasks??[]}catch{}const o=rb(i,a),c=s?.items??[],d=[];let u=0;for(const b of c)b.status==="processing"?o.push({id:b.id,type:"queue",task:b.title,status:"active",model:null,startedAt:b.startedAt??b.createdAt,endedAt:null,error:b.error,roleName:la(b.type,void 0,b.personaHint),queueItemType:b.type,outputPath:b.result?.outputPath,sourceTaskId:b.sourceTaskId,retryCount:b.retryCount,prUrl:b.result?.prUrl}):b.status==="review"?(u++,o.push({id:b.id,type:"queue",task:b.title,status:"done",model:null,startedAt:b.startedAt??b.createdAt,endedAt:b.completedAt??null,roleName:la(b.type,void 0,b.personaHint),queueItemType:b.type,outputPath:b.result?.outputPath,sourceTaskId:b.sourceTaskId,retryCount:b.retryCount,prUrl:b.result?.prUrl,isReview:!0})):b.status==="failed"?o.push({id:b.id,type:"queue",task:b.title,status:"failed",model:null,startedAt:b.startedAt??b.createdAt,endedAt:b.completedAt??null,error:b.error,roleName:la(b.type,void 0,b.personaHint),queueItemType:b.type,outputPath:b.result?.outputPath,sourceTaskId:b.sourceTaskId,retryCount:b.retryCount}):b.status==="pending"&&d.push(b);o.sort((b,$)=>{const k={active:0,queued:1,failed:2,done:3},S=k[b.status]-k[$.status];return S!==0?S:($.startedAt??0)-(b.startedAt??0)});const l=d.length,h=cb(o,l,u),f=lb(o);let v={projects:[],selectedProjectId:null,detail:null,feed:[],running:!1};try{const b=await e.client.request("godmode.delegation.projects",{});if(b?.running&&b.projects.length>0){const $=b.projects,k=n.missionControlData?.swarm?.selectedProjectId,S=k&&$.some(E=>E.projectId===k)?k:$.find(E=>E.status==="in_progress")?.projectId??$[0].projectId;let _=null,L=[];if(S){try{_=await e.client.request("godmode.delegation.status",{projectId:S})}catch{}try{L=(await e.client.request("godmode.delegation.feed",{projectId:S}))?.events??[]}catch{}}v={projects:$,selectedProjectId:S,detail:_,feed:L,running:!0}}}catch{}n.missionControlData={agents:o,stats:h,activityFeed:f,lastRefreshedAt:Date.now(),queueItems:d,swarm:v}}catch(s){console.error("[MissionControl] load error:",s),n.missionControlError=s instanceof Error?s.message:"Failed to load agent data"}finally{n.missionControlLoading=!1}}async function db(e,t){if(!(!e.client||!e.connected))try{await e.client.request("coding.cancel",{taskId:t}),e.showToast("Task cancelled","success",2e3),await _t(e)}catch(n){e.showToast("Failed to cancel task","error"),console.error("[MissionControl] cancel error:",n)}}async function ub(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("queue.approve",{id:t}),s=n?.item?.personaHint,i=n?.item?.title??"task";if(s){const a=s.replace(/-/g," ").replace(/\b\w/g,o=>o.toUpperCase());e.showToast(`Approved! How did ${a} do on "${i}"? Rate in Trust Tracker.`,"success",4e3)}else e.showToast("Item approved","success",2e3);await _t(e)}catch(n){e.showToast("Failed to approve item","error"),console.error("[MissionControl] approve error:",n)}}async function hb(e,t){if(!e.client||!e.connected)return!1;try{return(await e.client.request("coding.approve",{taskId:t}))?.approved?(e.showToast("Task approved","success",2e3),await _t(e),!0):!1}catch{return!1}}async function pb(e,t){if(!(!e.client||!e.connected))try{await e.client.request("queue.retry",{id:t}),e.showToast("Retrying...","success",2e3),await _t(e)}catch(n){e.showToast("Failed to retry","error"),console.error("[MissionControl] retry error:",n)}}async function fb(e,t){if(t.status==="failed")return{content:[`# Failed: ${t.task}`,"",`**Agent:** ${t.roleName}`,`**Retries:** ${t.retryCount??0}/2`,"","## Error","```",t.error??"Unknown error","```","","## What to do",t.retryCount&&t.retryCount>=2?"- This task failed after 2 automatic retries. Consider rephrasing the task or breaking it into smaller pieces.":"- Click **Retry** to attempt again with an improved prompt.","- Or remove this item and create a new one with more context."].join(`
`),title:`Failed: ${t.task}`,mimeType:"text/markdown"};if(t.prUrl&&e.client)try{return{content:(await e.client.request("queue.prDiff",{prUrl:t.prUrl})).content,title:`PR: ${t.task}`,mimeType:"text/markdown"}}catch{return{content:`# ${t.task}

[Open in GitHub](${t.prUrl})`,title:t.task,mimeType:"text/markdown"}}if(t.outputPath&&e.client)try{return{content:(await e.client.request("queue.readOutput",{path:t.outputPath})).content,title:t.task,mimeType:"text/markdown"}}catch{return{content:`Output file not found: ${t.outputPath}`,title:t.task,mimeType:"text/plain"}}return{content:`# ${t.task}

No details available.`,title:t.task,mimeType:"text/markdown"}}async function gb(e,t){const n=e;n.missionControlData?.swarm&&(n.missionControlData={...n.missionControlData,swarm:{...n.missionControlData.swarm,selectedProjectId:t}}),await _t(e,{quiet:!0})}async function mb(e,t,n,s){if(!e.client||!e.connected)return!1;try{const i=await e.client.request("godmode.delegation.steer",{projectId:t,issueTitle:n,instructions:s});return i?.success?(e.showToast("Steering sent","success",2e3),await _t(e,{quiet:!0}),!0):(e.showToast(i?.error??"Failed to steer","error"),!1)}catch(i){return e.showToast("Failed to send steering","error"),console.error("[MissionControl] steer error:",i),!1}}const ut=Object.freeze(Object.defineProperty({__proto__:null,AGENT_ROLE_NAMES:mu,approveCodingTask:hb,approveQueueItem:ub,cancelCodingTask:db,formatDuration:ib,loadAgentDetail:fb,loadMissionControl:_t,retryQueueItem:pb,selectSwarmProject:gb,steerSwarmAgent:mb},Symbol.toStringTag,{value:"Module"}));function Bo(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{Si(e,{quiet:!0})},5e3))}function Fo(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function No(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&Oo(e,{quiet:!0})},2e3))}function Uo(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function zo(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&xi(e)},3e3))}function Ko(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}function yu(e){e.missionControlPollInterval==null&&(e.missionControlPollInterval=window.setInterval(()=>{e.tab==="mission-control"&&_t(e,{quiet:!0})},5e3))}function vu(e){e.missionControlPollInterval!=null&&(clearInterval(e.missionControlPollInterval),e.missionControlPollInterval=null)}async function gs(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.status",{});e.cronStatus=t}catch(t){e.cronError=String(t)}}async function _i(e){if(!(!e.client||!e.connected)&&!e.cronLoading){e.cronLoading=!0,e.cronError=null;try{const t=await e.client.request("cron.list",{includeDisabled:!0});e.cronJobs=Array.isArray(t.jobs)?t.jobs:[]}catch(t){e.cronError=String(t)}finally{e.cronLoading=!1}}}function yb(e){if(e.scheduleKind==="at"){const n=Date.parse(e.scheduleAt);if(!Number.isFinite(n))throw new Error("Invalid run time.");return{kind:"at",atMs:n}}if(e.scheduleKind==="every"){const n=Ys(e.everyAmount,0);if(n<=0)throw new Error("Invalid interval amount.");const s=e.everyUnit;return{kind:"every",everyMs:n*(s==="minutes"?6e4:s==="hours"?36e5:864e5)}}const t=e.cronExpr.trim();if(!t)throw new Error("Cron expression required.");return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0}}function vb(e){if(e.payloadKind==="systemEvent"){const i=e.payloadText.trim();if(!i)throw new Error("System event text required.");return{kind:"systemEvent",text:i}}const t=e.payloadText.trim();if(!t)throw new Error("Agent message required.");const n={kind:"agentTurn",message:t};e.deliver&&(n.deliver=!0),e.channel&&(n.channel=e.channel),e.to.trim()&&(n.to=e.to.trim());const s=Ys(e.timeoutSeconds,0);return s>0&&(n.timeoutSeconds=s),n}async function bb(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const t=yb(e.cronForm),n=vb(e.cronForm),s=e.cronForm.agentId.trim(),i={name:e.cronForm.name.trim(),description:e.cronForm.description.trim()||void 0,agentId:s||void 0,enabled:e.cronForm.enabled,schedule:t,sessionTarget:e.cronForm.sessionTarget,wakeMode:e.cronForm.wakeMode,payload:n,isolation:e.cronForm.postToMainPrefix.trim()&&e.cronForm.sessionTarget==="isolated"?{postToMainPrefix:e.cronForm.postToMainPrefix.trim()}:void 0};if(!i.name)throw new Error("Name required.");await e.client.request("cron.add",i),e.cronForm={...e.cronForm,name:"",description:"",payloadText:""},await _i(e),await gs(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function wb(e,t,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:t.id,patch:{enabled:n}}),await _i(e),await gs(e)}catch(s){e.cronError=String(s)}finally{e.cronBusy=!1}}}async function kb(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:t.id,mode:"force"}),await bu(e,t.id)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function $b(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:t.id}),e.cronRunsJobId===t.id&&(e.cronRunsJobId=null,e.cronRuns=[]),await _i(e),await gs(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function bu(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("cron.runs",{id:t,limit:50});e.cronRunsJobId=t,e.cronRuns=Array.isArray(n.entries)?n.entries:[]}catch(n){e.cronError=String(n)}}async function Zt(e){if(!(!e.client||!e.connected)){e.guardrailsLoading=!0;try{const[t,n]=await Promise.all([e.client.request("guardrails.list",{}),e.client.request("guardrails.history",{limit:50})]);e.guardrailsData={gates:t.gates,activity:n.activity,custom:t.custom??[]}}catch(t){console.error("[Guardrails] load error:",t),e.guardrailsData=null}finally{e.guardrailsLoading=!1}}}async function Sb(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,enabled:n});const i=e.guardrailsData?.gates.find(a=>a.id===t)?.name??t;e.showToast(`${i} ${n?"enabled":"disabled"}`,"success",2e3),await Zt(e)}catch(s){e.showToast("Failed to update guardrail","error"),console.error("[Guardrails] toggle error:",s)}}async function xb(e,t,n,s){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,thresholds:{[n]:s}}),e.showToast("Threshold updated","success",2e3),await Zt(e)}catch(i){e.showToast("Failed to update threshold","error"),console.error("[Guardrails] threshold error:",i)}}async function _b(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.setCustom",{id:t,enabled:n}),e.showToast(`Custom rule ${n?"enabled":"disabled"}`,"success",2e3),await Zt(e)}catch(s){e.showToast("Failed to update custom rule","error"),console.error("[Guardrails] toggleCustom error:",s)}}async function Ab(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.removeCustom",{id:t}),e.showToast("Custom rule removed","success",2e3),await Zt(e)}catch(n){e.showToast("Failed to remove custom rule","error"),console.error("[Guardrails] deleteCustom error:",n)}}async function Tb(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.addCustom",{guardrail:{name:t.name,description:"",enabled:!0,trigger:{tool:t.tool,patterns:t.patterns},action:t.action,message:t.message,...t.redirectTo?{redirectTo:t.redirectTo}:{}}}),e.showToast("Custom rule created","success",2e3),await Zt(e)}catch(n){e.showToast("Failed to create custom rule","error"),console.error("[Guardrails] addCustom error:",n)}}const un=Object.freeze(Object.defineProperty({__proto__:null,addCustomGuardrailFromUI:Tb,deleteCustomGuardrail:Ab,loadGuardrails:Zt,toggleCustomGuardrail:_b,toggleGuardrail:Sb,updateGuardrailThreshold:xb},Symbol.toStringTag,{value:"Module"}));function Cb(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.get",params:{nodeId:t}}:null}function Eb(e,t){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:t};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.set",params:{...t,nodeId:n}}:null}async function qo(e,t){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const n=Cb(t);if(!n){e.lastError="Select a node before loading exec approvals.";return}const s=await e.client.request(n.method,n.params);Rb(e,s)}catch(n){e.lastError=String(n)}finally{e.execApprovalsLoading=!1}}}function Rb(e,t){e.execApprovalsSnapshot=t,e.execApprovalsDirty||(e.execApprovalsForm=jt(t.file??{}))}async function Lb(e,t){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const n=e.execApprovalsSnapshot?.hash;if(!n){e.lastError="Exec approvals hash missing; reload and retry.";return}const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},i=Eb(t,{file:s,baseHash:n});if(!i){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(i.method,i.params),e.execApprovalsDirty=!1,await qo(e,t)}catch(n){e.lastError=String(n)}finally{e.execApprovalsSaving=!1}}}function Pb(e,t,n){const s=jt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Nc(s,t,n),e.execApprovalsForm=s,e.execApprovalsDirty=!0}function Db(e,t){const n=jt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Uc(n,t),e.execApprovalsForm=n,e.execApprovalsDirty=!0}const Ib=["~/godmode/memory/AGENT-DAY.md","~/godmode/AGENT-DAY.md"];function Mb(e){return[...[`~/godmode/memory/agent-day/${e}.md`,`~/godmode/memory/agent-log/${e}.md`,`~/godmode/memory/daily/${e}-agent-log.md`],...Ib]}function Ob(e){return["Needs Review","Active Sub-Agents","Completed Today","Queue","Feedback Log","AGENT-DAY"].filter(s=>e.includes(s)).length>=2}async function wu(e,t){try{const n=t?{date:t}:{},s=await e.request("dailyBrief.get",n);return!s||!s.content||!s.date?null:s}catch(n){return console.error("[MyDay] Failed to load daily brief:",n),null}}async function ku(e,t,n){const s=t||X(),i="agentLog.get";try{const a=await e.request(i,{date:s});if(a?.content?.trim()&&a?.sourcePath)return{date:a.date||s,content:a.content,updatedAt:a.updatedAt||new Date().toISOString(),sourcePath:a.sourcePath}}catch(a){console.warn(`[MyDay] ${i} unavailable, falling back to files.read:`,a)}return Bb(e,s)}async function Bb(e,t){const n=Mb(t),s=i=>i.includes("AGENT-DAY.md");for(const i of n)try{const a=await e.request("files.read",{path:i,maxSize:1e6});if(!a?.content?.trim()||!Ob(a.content)||s(i)&&typeof a.modifiedAt=="number"&&X(new Date(a.modifiedAt))!==t)continue;return{date:t,content:a.content,updatedAt:typeof a.modifiedAt=="number"?new Date(a.modifiedAt).toISOString():new Date().toISOString(),sourcePath:i}}catch{}return null}function hn(e,t,n){return new Promise((s,i)=>{const a=setTimeout(()=>i(new Error(`${n} timed out after ${t}ms`)),t);e.then(o=>{clearTimeout(a),s(o)},o=>{clearTimeout(a),i(o)})})}const Fb={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function Jn(e){if(!e.client||!e.connected)return[];e.todayTasksLoading=!0;try{const t=e.todaySelectedDate??X(),[n,s]=await Promise.all([e.client.request("tasks.today",{date:t,includeCompleted:!0}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),i=new Map;for(const o of s.items)o.sourceTaskId&&(o.status==="processing"||o.status==="review"||o.status==="needs-review"||o.status==="done"||o.status==="failed")&&i.set(o.sourceTaskId,{status:o.status,type:o.type,roleName:Fb[o.type]??o.type,queueItemId:o.id});const a=(n.tasks??[]).map(o=>({id:o.id,title:o.title,status:o.status,project:o.project,dueDate:o.dueDate,priority:o.priority,createdAt:o.createdAt,completedAt:o.completedAt,queueStatus:i.get(o.id)??null}));return e.todayTasks=a,a}catch(t){return console.error("[MyDay] Failed to load today tasks:",t),e.todayTasks??[]}finally{e.todayTasksLoading=!1}}async function $u(e){if(!(!e.client||!e.connected)){e.inboxLoading=!0;try{const t=await e.client.request("inbox.list",{status:"pending",limit:50});e.inboxItems=t.items??[],e.inboxCount=t.pendingCount??0}catch(t){console.error("[MyDay] Failed to load inbox items:",t),e.inboxItems=[],e.inboxCount=0}finally{e.inboxLoading=!1}}}async function Su(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("trust.dashboard",{}),n=t.summaries.filter(s=>s.trustScore!==null);e.trustSummary={overallScore:t.overallScore,dailyStreak:t.dailyStreak,todayRated:t.todayRating!==null,workflowCount:t.workflows.length,highPerformers:n.filter(s=>(s.trustScore??0)>=8).length,needsAttention:n.filter(s=>(s.trustScore??10)<7).length}}catch{e.trustSummary=null}}async function xu(e){if(!e.client||!e.connected)return[];try{const n=(await e.client.request("queue.list",{limit:50}))?.items??[],s=Date.now()-1440*60*1e3;return n.filter(i=>!(i.status!=="review"&&i.status!=="needs-review"&&i.status!=="done"||i.status==="done"&&(i.completedAt??0)<s)).sort((i,a)=>(a.completedAt??0)-(i.completedAt??0)).map(i=>({id:i.id,title:i.title,summary:i.result?.summary??i.description??"",status:i.status==="needs-review"?"review":i.status,completedAt:i.completedAt,outputPath:i.result?.outputPath,prUrl:i.result?.prUrl,sourceTaskId:i.sourceTaskId,persona:i.personaHint??void 0,source:i.source}))}catch(t){return console.error("[MyDay] Failed to load queue results for decision cards:",t),[]}}function Nb(e,t){e.request("dailyBrief.syncTasks",t?{date:t}:{}).catch(n=>{console.warn("[MyDay] dailyBrief.syncTasks failed (non-blocking):",n)})}async function yn(e){if(!(!e.client||!e.connected)){e.dailyBriefLoading=!0,e.dailyBriefError=null;try{e.dailyBrief=await wu(e.client,e.todaySelectedDate),e.loadBriefNotes&&await e.loadBriefNotes()}catch(t){e.dailyBriefError=t instanceof Error?t.message:"Failed to load daily brief",console.error("[MyDay] Brief load error:",t)}finally{e.dailyBriefLoading=!1}}}async function Ub(e,t){if(!(!e.client||!e.connected)){e.agentLogLoading=!0,e.agentLogError=null;try{e.agentLog=await ku(e.client,e.todaySelectedDate,t)}catch(n){e.agentLogError=n instanceof Error?n.message:"Failed to load agent log",console.error("[MyDay] Agent log load error:",n)}finally{e.agentLogLoading=!1}}}function Wo(e){const t=e||X(),n="VAULT",s=`01-Daily/${t}`,i=`obsidian://open?vault=${encodeURIComponent(n)}&file=${encodeURIComponent(s)}`;window.open(i,"_blank")}async function ds(e){if(!e.client||!e.connected)return;e.myDayLoading=!0,e.myDayError=null,e.dailyBriefLoading=!0,e.agentLogLoading=!0,e.todayTasksLoading=!0;const t=e.todaySelectedDate,n=e.loadBriefNotes?hn(e.loadBriefNotes(),5e3,"Brief Notes"):Promise.resolve(),s=await Promise.allSettled([hn(wu(e.client,t),1e4,"Daily Brief"),n,hn(ku(e.client,t),1e4,"Agent Log"),hn(Jn(e),8e3,"Today Tasks"),hn($u(e),5e3,"Inbox"),hn(Su(e),5e3,"Trust Summary")]);e.dailyBrief=s[0].status==="fulfilled"?s[0].value:null,e.agentLog=s[2].status==="fulfilled"?s[2].value:null;const i=["Brief","Brief Notes","Agent Log","Today Tasks","Inbox","Trust"],a=s.map((o,c)=>o.status==="rejected"?{section:i[c],reason:o.reason}:null).filter(Boolean);if(a.length>0){for(const o of a)console.warn(`[MyDay] ${o.section} failed:`,o.reason);a.length===s.length&&(e.myDayError="Failed to load daily brief")}e.myDayLoading=!1,e.dailyBriefLoading=!1,e.agentLogLoading=!1,e.todayTasksLoading=!1}const Hn=Object.freeze(Object.defineProperty({__proto__:null,loadAgentLogOnly:Ub,loadBriefOnly:yn,loadInboxItems:$u,loadMyDay:ds,loadTodayQueueResults:xu,loadTodayTasksWithQueueStatus:Jn,loadTrustSummary:Su,openBriefInObsidian:Wo,syncTodayTasks:Nb},Symbol.toStringTag,{value:"Module"}));async function jo(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const t=await e.client.request("system-presence",{});Array.isArray(t)?(e.presenceEntries=t,e.presenceStatus=t.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(t){e.presenceError=String(t)}finally{e.presenceLoading=!1}}}function Sn(e,t,n){if(!t.trim())return;const s={...e.skillMessages};n?s[t]=n:delete s[t],e.skillMessages=s}function Ai(e){return e instanceof Error?e.message:String(e)}async function ms(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const n=await e.client.request("skills.status",{});n&&(e.skillsReport=n)}catch(n){e.skillsError=Ai(n)}finally{e.skillsLoading=!1}}}async function Wa(e){if(!(!e.client||!e.connected)){e.godmodeSkillsLoading=!0;try{const t=await e.client.request("godmode.skills.list",{});e.godmodeSkills=t??null}catch(t){console.error("[Skills] Failed to load GodMode skills:",t),e.godmodeSkills=null}finally{e.godmodeSkillsLoading=!1}}}function zb(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function Kb(e,t,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:t,enabled:n}),await ms(e),Sn(e,t,{kind:"success",message:n?"Skill enabled":"Skill disabled"})}catch(s){const i=Ai(s);e.skillsError=i,Sn(e,t,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function qb(e,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const n=e.skillEdits[t]??"";await e.client.request("skills.update",{skillKey:t,apiKey:n}),await ms(e),Sn(e,t,{kind:"success",message:"API key saved"})}catch(n){const s=Ai(n);e.skillsError=s,Sn(e,t,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function Wb(e,t,n,s){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const i=await e.client.request("skills.install",{name:n,installId:s,timeoutMs:12e4});await ms(e),Sn(e,t,{kind:"success",message:i?.message??"Installed"})}catch(i){const a=Ai(i);e.skillsError=a,Sn(e,t,{kind:"error",message:a})}finally{e.skillsBusyKey=null}}}async function _u(e){if(!(!e.client||!e.connected)){e.workLoading=!0,e.workError=null;try{const t=await e.client.request("projects.list",{});e.workProjects=t.projects??[]}catch(t){console.error("[Work] Failed to load:",t),e.workError=t instanceof Error?t.message:"Failed to load"}finally{e.workLoading=!1}}}async function jb(e,t){if(!e.client||!e.connected)return;const n=new Set(e.workDetailLoading??[]);n.add(t),e.workDetailLoading=n;try{const s=await e.client.request("projects.get",{id:t,includeFiles:!0,depth:2});if(s){const i=s.files??[];e.workProjectFiles={...e.workProjectFiles,[t]:i}}}catch(s){console.warn("[Work] Failed to load project details:",s)}finally{const s=new Set(e.workDetailLoading??[]);s.delete(t),e.workDetailLoading=s}}async function Au(e){if(!(!e.client||!e.connected)){e.workResourcesLoading=!0;try{const t=await e.client.request("resources.list",{limit:100});e.workResources=t.resources??[]}catch(t){console.warn("[Work] Failed to load resources:",t),e.workResources=[]}finally{e.workResourcesLoading=!1}}}async function Hb(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("resources.pin",{id:t,pinned:n}),e.workResources&&(e.workResources=e.workResources.map(s=>s.id===t?{...s,pinned:n}:s))}catch(s){console.warn("[Work] Failed to pin resource:",s)}}async function Vb(e,t){if(!(!e.client||!e.connected))try{await e.client.request("resources.delete",{id:t}),e.workResources&&(e.workResources=e.workResources.filter(n=>n.id!==t))}catch(n){console.warn("[Work] Failed to delete resource:",n)}}function Ti(e,t=Date.now()){if(typeof e=="number"&&Number.isFinite(e))return new Date(e);if(typeof e=="string"){const n=Date.parse(e);if(Number.isFinite(n))return new Date(n)}return new Date(t)}function Ho(e){return{id:e.id,name:e.name,emoji:e.emoji||"📁",type:e.type,path:e.path,artifactCount:e.artifactCount??0,sessionCount:e.sessionCount??0,lastUpdated:Ti(e.lastUpdated,e.lastScanned)}}function ca(e){return{path:e.path,name:e.name,type:e.type,size:e.size,modified:Ti(e.modified),isDirectory:e.isDirectory,searchText:e.searchText}}function Il(e){return{id:e.id,key:e.key,title:e.title,created:Ti(e.created),status:e.status,workspaceSubfolder:e.workspaceSubfolder}}function en(e){return{id:e.id,title:e.title,status:e.status,project:e.project,dueDate:e.dueDate,priority:e.priority,createdAt:e.createdAt,completedAt:e.completedAt}}function Tu(e){return e.map(t=>({name:t.name,path:t.path,type:t.type,fileType:t.fileType,size:t.size,modified:t.modified?Ti(t.modified):void 0,children:t.children?Tu(t.children):void 0}))}function Gb(e,t){return{...t,id:e.id,name:e.name,emoji:e.emoji,type:e.type,path:e.path,artifactCount:e.artifactCount,sessionCount:e.sessionCount,lastUpdated:e.lastUpdated}}async function ys(e){if(!e.client||!e.connected){e.workspaces=[],e.workspacesLoading=!1,e.workspacesError="Connect to gateway to see workspaces";return}e.workspacesLoading=!0,e.workspacesError=null;try{const t=await e.client.request("workspaces.list",{});if(e.workspaces=(t.workspaces??[]).map(Ho),e.selectedWorkspace){const n=e.workspaces.find(s=>s.id===e.selectedWorkspace?.id);n&&(e.selectedWorkspace=Gb(n,e.selectedWorkspace))}}catch(t){console.error("[Workspaces] load failed:",t),e.workspacesError=t instanceof Error?t.message:"Failed to load workspaces",e.workspaces=[]}finally{e.workspacesLoading=!1}}async function Kt(e,t){if(!e.client||!e.connected)return null;try{const n=await e.client.request("workspaces.get",{id:t});return n.workspace?{...Ho(n.workspace),pinned:(n.pinned??[]).map(ca),pinnedSessions:(n.pinnedSessions??[]).map(Il),outputs:(n.outputs??[]).map(ca),folderTree:n.folderTree?Tu(n.folderTree):void 0,sessions:(n.sessions??[]).map(Il),tasks:(n.tasks??[]).map(en),memory:(n.memory??[]).map(ca)}:null}catch(n){return console.error("[Workspaces] get failed:",n),null}}async function Cu(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("workspaces.readFile",n?{workspaceId:n,filePath:t}:{path:t});return s.content?{content:s.content,mime:s.contentType??s.mime??"text/plain"}:(s.error&&console.warn("[Workspaces] readFile failed:",s.error),null)}catch(s){return console.error("[Workspaces] readFile error:",s),null}}async function Qb(e){if(!(!e.client||!e.connected))try{e.workspacesLoading=!0,e.workspacesError=null,await e.client.request("workspaces.scan",{}),await ys(e)}catch(t){e.workspacesError=t instanceof Error?t.message:"Failed to scan workspaces"}finally{e.workspacesLoading=!1}}async function ja(e,t){if(!t){e.selectedWorkspace=null;return}const n=await Kt(e,t.id);e.selectedWorkspace=n||{...t,pinned:[],pinnedSessions:[],outputs:[],sessions:[],tasks:[]}}async function Eu(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpin":"workspaces.pin",{workspaceId:t,filePath:n}),e.selectedWorkspace?.id===t){const i=await Kt(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] pin toggle failed:",i),!1}}async function Ru(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpinSession":"workspaces.pinSession",{workspaceId:t,sessionKey:n}),e.selectedWorkspace?.id===t){const i=await Kt(e,t);i&&(e.selectedWorkspace=i)}return!0}catch(i){return console.error("[Workspaces] session pin toggle failed:",i),!1}}async function Lu(e,t){if(!e.client||!e.connected)return null;const n=String(t.name??"").trim();if(!n)return e.workspacesError="Workspace name is required",null;const s=t.type??"project",i=String(t.path??"").trim();try{const a=await e.client.request("workspaces.create",{name:n,type:s,...i?{path:i}:{}});if(!a.workspace)return e.workspacesError="Workspace creation returned no workspace",null;const o=Ho(a.workspace),c=e.workspaces??[],d=new Map(c.map(u=>[u.id,u]));return d.set(o.id,o),e.workspaces=Array.from(d.values()).toSorted((u,l)=>l.lastUpdated.getTime()-u.lastUpdated.getTime()),e.workspacesError=null,o}catch(a){return console.error("[Workspaces] create failed:",a),e.workspacesError=a instanceof Error?a.message:"Failed to create workspace",null}}async function Pu(e,t){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.delete",{id:t}),e.workspaces=(e.workspaces??[]).filter(n=>n.id!==t),e.selectedWorkspace?.id===t&&(e.selectedWorkspace=null),e.workspacesError=null,!0}catch(n){return console.error("[Workspaces] delete failed:",n),e.workspacesError=n instanceof Error?n.message:"Failed to delete workspace",!1}}function Yb(e,t){e.workspacesSearchQuery=t}function Jb(e){e.selectedWorkspace=null}async function Xb(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("workspaces.teamSetupPrompt",{});t?.prompt&&(e.chatMessage=t.prompt,e.setTab?.("chat"))}catch{e.chatMessage="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.",e.setTab?.("chat")}}function Du(e,t){const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}async function Zb(e,t){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.byProject",{project:t})).tasks??[]).map(en)}catch(n){return console.error("[Workspaces] loadWorkspaceTasks failed:",n),[]}}async function ew(e){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.list",{})).tasks??[]).map(en)}catch(t){return console.error("[Workspaces] loadAllTasks failed:",t),[]}}const tw={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function Bt(e){if(!e.client||!e.connected)return[];try{const[t,n]=await Promise.all([e.client.request("tasks.list",{}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),s=new Map;for(const i of n.items)i.sourceTaskId&&(i.status==="processing"||i.status==="review"||i.status==="needs-review"||i.status==="failed")&&s.set(i.sourceTaskId,{status:i.status==="needs-review"?"review":i.status,type:i.type,roleName:tw[i.type]??i.type,queueItemId:i.id});return(t.tasks??[]).map(i=>({...en(i),queueStatus:s.get(i.id)??null}))}catch(t){return console.error("[Workspaces] loadAllTasksWithQueueStatus failed:",t),[]}}async function Iu(e,t,n){if(!e.client||!e.connected)return null;const s=n==="complete"?"pending":"complete";try{const i=await e.client.request("tasks.update",{id:t,status:s});return en(i)}catch(i){return console.error("[Workspaces] toggleTaskComplete failed:",i),null}}async function Mu(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.update",{id:t,...n});return en(s)}catch(s){return console.error("[Workspaces] updateTask failed:",s),null}}async function Ou(e,t){if(!e.client||!e.connected)return null;try{return await e.client.request("tasks.openSession",{taskId:t})}catch(n){return console.error("[Workspaces] startTask failed:",n),null}}async function Bu(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.create",{title:t,project:n,source:"chat"});return en(s)}catch(s){return console.error("[Workspaces] createTask failed:",s),null}}async function Fu(e,t,n){if(!e.client||!e.connected)return null;try{return await e.client.request("workspaces.browseFolder",{workspaceId:t,folderPath:n})}catch(s){return console.error("[Workspaces] browseFolder failed:",s),null}}async function Nu(e,t,n,s=50){if(!e.client||!e.connected)return[];try{return(await e.client.request("workspaces.search",{workspaceId:t,query:n,limit:s})).results??[]}catch(i){return console.error("[Workspaces] search failed:",i),[]}}async function Uu(e,t,n){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.createFolder",{workspaceId:t,folderPath:n}),!0}catch(s){return console.error("[Workspaces] createFolder failed:",s),!1}}async function nw(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.moveFile",{workspaceId:t,sourcePath:n,destPath:s}),!0}catch(i){return console.error("[Workspaces] moveFile failed:",i),!1}}async function sw(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.renameFile",{workspaceId:t,filePath:n,newName:s}),!0}catch(i){return console.error("[Workspaces] renameFile failed:",i),!1}}const Ws=Object.freeze(Object.defineProperty({__proto__:null,browseWorkspaceFolder:Fu,clearWorkspaceSelection:Jb,createTask:Bu,createWorkspace:Lu,createWorkspaceFolder:Uu,deleteWorkspace:Pu,getWorkspace:Kt,loadAllTasks:ew,loadAllTasksWithQueueStatus:Bt,loadWorkspaceTasks:Zb,loadWorkspaces:ys,moveWorkspaceFile:nw,readWorkspaceFile:Cu,renameWorkspaceFile:sw,scanWorkspaces:Qb,searchWorkspaceFiles:Nu,selectWorkspace:ja,setWorkspacesSearchQuery:Yb,startTask:Ou,startTeamSetup:Xb,toggleTaskComplete:Iu,toggleWorkspaceFolder:Du,toggleWorkspacePin:Eu,toggleWorkspaceSessionPin:Ru,updateTask:Mu},Symbol.toStringTag,{value:"Module"})),zu="godmode.ui.settings.v1";function iw(){const e=new URLSearchParams(location.search),t=(()=>{const i=e.get("gatewayUrl");return i||(typeof window.__GODMODE_DEV__<"u"?"/ws":`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}`)})(),n=e.get("token")||"",s={gatewayUrl:t,token:n,sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{System:!0,__missionControl__:!1},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]};try{const i=localStorage.getItem(zu);if(!i)return s;const a=JSON.parse(i);return{gatewayUrl:e.get("gatewayUrl")||(typeof window.__GODMODE_DEV__<"u"?"/ws":typeof a.gatewayUrl=="string"&&a.gatewayUrl.trim()?a.gatewayUrl.trim():s.gatewayUrl),token:n||(typeof a.token=="string"?a.token:""),sessionKey:typeof a.sessionKey=="string"&&a.sessionKey.trim()?a.sessionKey.trim():s.sessionKey,lastActiveSessionKey:typeof a.lastActiveSessionKey=="string"&&a.lastActiveSessionKey.trim()?a.lastActiveSessionKey.trim():typeof a.sessionKey=="string"&&a.sessionKey.trim()||s.lastActiveSessionKey,theme:a.theme==="light"||a.theme==="dark"||a.theme==="system"||a.theme==="lifetrack"?a.theme:s.theme,chatFocusMode:typeof a.chatFocusMode=="boolean"?a.chatFocusMode:s.chatFocusMode,chatShowThinking:typeof a.chatShowThinking=="boolean"?a.chatShowThinking:s.chatShowThinking,splitRatio:typeof a.splitRatio=="number"&&a.splitRatio>=.4&&a.splitRatio<=.7?a.splitRatio:s.splitRatio,navCollapsed:typeof a.navCollapsed=="boolean"?a.navCollapsed:s.navCollapsed,navGroupsCollapsed:typeof a.navGroupsCollapsed=="object"&&a.navGroupsCollapsed!==null?a.navGroupsCollapsed:s.navGroupsCollapsed,openTabs:Array.isArray(a.openTabs)&&a.openTabs.every(o=>typeof o=="string")?a.openTabs:s.openTabs,tabLastViewed:typeof a.tabLastViewed=="object"&&a.tabLastViewed!==null?a.tabLastViewed:s.tabLastViewed,userName:typeof a.userName=="string"?a.userName.trim().slice(0,50):s.userName,userAvatar:typeof a.userAvatar=="string"?a.userAvatar.trim():s.userAvatar,chatParallelView:typeof a.chatParallelView=="boolean"?a.chatParallelView:s.chatParallelView,parallelLanes:Array.isArray(a.parallelLanes)&&a.parallelLanes.length===4?a.parallelLanes.map(o=>typeof o=="string"?o:null):s.parallelLanes}}catch{return s}}function aw(e){localStorage.setItem(zu,JSON.stringify(e))}const ow=56,rw="quantum-particles",lw="quantum-particle";let mt=null,Xn=null;function Ae(e,t){return Math.random()*(t-e)+e}function Ku(){if(qu(),typeof document>"u")return;const e=document.querySelector(".shell");if(!e){Xn=requestAnimationFrame(()=>{Xn=null,Ku()});return}mt=document.createElement("div"),mt.className=rw,Object.assign(mt.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"1",overflow:"hidden"});for(let t=0;t<ow;t++){const n=document.createElement("div");n.className=lw;const s=Ae(2,5),i=Ae(.3,.65),a=Ae(15,35),o=Ae(0,12),c=Ae(5,95),d=Ae(5,95),u=Ae(-150,150),l=Ae(-200,200),h=Ae(-250,250),f=Ae(-350,350),v=Ae(.8,1.5);Object.assign(n.style,{position:"absolute",left:`${c}%`,top:`${d}%`,width:`${s}px`,height:`${s}px`,borderRadius:"50%",background:`rgba(235, 158, 15, ${Ae(.7,1)})`,boxShadow:`0 0 ${s*3}px rgba(235, 158, 15, ${i*.7})`,opacity:"0",willChange:"transform, opacity",animation:`quantum-float ${a}s ${o}s ease-in-out infinite`}),n.style.setProperty("--particle-opacity",String(i)),n.style.setProperty("--drift-x",`${u}px`),n.style.setProperty("--drift-y",`${l}px`),n.style.setProperty("--drift-end-x",`${h}px`),n.style.setProperty("--drift-end-y",`${f}px`),n.style.setProperty("--particle-scale-mid",String(v)),mt.appendChild(n)}e.prepend(mt)}function qu(){Xn!==null&&(cancelAnimationFrame(Xn),Xn=null),mt&&(mt.remove(),mt=null)}function cw(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"lifetrack"}function Vo(e){return e==="system"?cw():e==="light"?"lifetrack":e}const Ms=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,dw=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,Kn=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},uw=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const i=globalThis.document??null;if(!i){t();return}const a=i.documentElement,o=i,c=dw();if(!!o.startViewTransition&&!c){let u=.5,l=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")u=Ms(n.pointerClientX/window.innerWidth),l=Ms(n.pointerClientY/window.innerHeight);else if(n?.element){const f=n.element.getBoundingClientRect();f.width>0&&f.height>0&&typeof window<"u"&&(u=Ms((f.left+f.width/2)/window.innerWidth),l=Ms((f.top+f.height/2)/window.innerHeight))}a.style.setProperty("--theme-switch-x",`${u*100}%`),a.style.setProperty("--theme-switch-y",`${l*100}%`),a.classList.add("theme-transition");const h=setTimeout(()=>{Kn(a)},1e3);try{const f=o.startViewTransition?.(()=>{t()});f?.finished?f.finished.finally(()=>{clearTimeout(h),Kn(a)}):(clearTimeout(h),Kn(a))}catch{clearTimeout(h),Kn(a),t()}return}t(),Kn(a)};function hw(e,t){const n=Array.isArray(e)?[...new Set(e.map(s=>s.trim()).filter(s=>s.length>0))]:[];if(n.length===0&&t){const s=t.toLowerCase();s==="main"||s==="agent:main:main"||s.endsWith(":main")||n.push(t)}return n}function pw(e){const t={};if(!e||typeof e!="object")return t;for(const[n,s]of Object.entries(e)){const i=n.trim();!i||typeof s!="number"||!Number.isFinite(s)||(t[i]=Math.max(t[i]??0,s))}return t}function ot(e,t){const n=t.sessionKey.trim()||"main",s=hw(t.openTabs,n),i=pw(t.tabLastViewed),a={...t,sessionKey:n,openTabs:s,tabLastViewed:i,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||n};e.settings=a,aw(a),a.theme!==e.theme&&(e.theme=a.theme,bs(e,Vo(a.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function Go(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&ot(e,{...e.settings,lastActiveSessionKey:n})}function Wu(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),n=t.get("token"),s=t.get("password"),i=t.get("session"),a=t.get("gatewayUrl");let o=!1;if(n!=null){const d=n.trim();d&&d!==e.settings.token&&ot(e,{...e.settings,token:d}),t.delete("token"),o=!0}if(s!=null){const d=s.trim();d&&(e.password=d),t.delete("password"),o=!0}if(i!=null){const d=i.trim();if(d){e.sessionKey=d;const u=d.toLowerCase(),h=u==="main"||u==="agent:main:main"||u.endsWith(":main")||e.settings.openTabs.includes(d)?e.settings.openTabs:[...e.settings.openTabs,d];ot(e,{...e.settings,sessionKey:d,lastActiveSessionKey:d,openTabs:h})}}if(a!=null){const d=a.trim();d&&d!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=d),t.delete("gatewayUrl"),o=!0}if(!o)return;const c=new URL(window.location.href);c.search=t.toString(),window.history.replaceState({},"",c.toString())}function Qo(e,t){const n=e.tab;if(n!==t&&(e.tab=t),n==="chat"&&t!=="chat"&&e.sessionKey===J&&e._loadAllyHistory?.(),n==="dashboards"&&t!=="dashboards"){const s=e;if(s.dashboardPreviousSessionKey&&s.activeDashboardId){const i=s.dashboardPreviousSessionKey;s.dashboardPreviousSessionKey=null,s.activeDashboardId=null,s.activeDashboardManifest=null,s.activeDashboardHtml=null,s.dashboardChatOpen=!1,e.sessionKey=i}}t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?Bo(e):Fo(e),t==="logs"?No(e):Uo(e),t==="debug"?zo(e):Ko(e),t==="mission-control"?yu(e):vu(e),vs(e),Jo(e,t,!1)}function ju(e,t,n){uw({nextTheme:t,applyTheme:()=>{e.theme=t,ot(e,{...e.settings,theme:t}),bs(e,Vo(t))},context:n,currentTheme:e.theme})}async function vs(e){if(e.tab==="overview"&&await Xo(e),(e.tab==="today"||e.tab==="my-day")&&(await ds(e),R(()=>Promise.resolve().then(()=>Hn),void 0,import.meta.url).then(async({loadTodayQueueResults:t})=>{e.todayQueueResults=await t(e)}).catch(()=>{})),e.tab==="work"&&await Promise.all([_u(e),Au(e)]),e.tab==="workspaces"&&(await ys(e),R(()=>Promise.resolve().then(()=>Ws),void 0,import.meta.url).then(async({loadAllTasksWithQueueStatus:t})=>{e.allTasks=await t(e)})),e.tab==="channels"&&await Xu(e),e.tab==="instances"&&await jo(e),e.tab==="sessions"&&(await oe(e),await Qt(e)),e.tab==="cron"&&await Ci(e),e.tab==="skills"&&(await ms(e),await Wa(e)),e.tab==="agents"){const{loadRoster:t}=await R(async()=>{const{loadRoster:n}=await Promise.resolve().then(()=>by);return{loadRoster:n}},void 0,import.meta.url);await t(e)}if(e.tab==="nodes"&&(await Si(e),await xt(e),await it(e),await qo(e)),e.tab==="chat"&&(await tr(e),xe(e,!e.chatHasAutoScrolled),e.loadSessionResources?.()),e.tab==="options"){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}if(e.tab==="trust"){const t=e,n=[];typeof t.handleTrustLoad=="function"&&n.push(t.handleTrustLoad()),n.push(Zt(t)),n.push(oe(t)),await Promise.all(n)}if(e.tab==="guardrails"){const t=e;typeof t.handleGuardrailsLoad=="function"&&await t.handleGuardrailsLoad()}if(e.tab==="mission-control"){const t=e;typeof t.handleMissionControlRefresh=="function"&&await t.handleMissionControlRefresh()}if(e.tab==="setup"){const t=e;typeof t.handleLoadCapabilities=="function"&&t.handleLoadCapabilities()}if(e.tab==="dashboards"){const t=e;typeof t.handleDashboardsRefresh=="function"&&await t.handleDashboardsRefresh()}if(e.tab==="second-brain"){const t=e;typeof t.handleSecondBrainRefresh=="function"&&await t.handleSecondBrainRefresh()}e.tab==="config"&&(await zc(e),await it(e)),e.tab==="debug"&&(await xi(e),e.eventLog=Ov()),e.tab==="logs"&&(e.logsAtBottom=!0,await Oo(e,{reset:!0}),jc(e,!0))}function Hu(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?yi(e):yf(window.location.pathname)}function Vu(e){e.theme=e.settings.theme??"system",bs(e,Vo(e.theme))}function bs(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t==="dark"?"dark":"light",t==="lifetrack"?Ku():qu()}function Gu(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&bs(e,n.matches?"dark":"lifetrack")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function Qu(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function Yu(e,t){if(typeof window>"u")return;const n=Vc(window.location.pathname,e.basePath)??"chat";Yo(e,n),Jo(e,n,t)}function Ju(e){if(typeof window>"u")return;const t=Vc(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();if(s){e.sessionKey=s;const i=e.settings.openTabs.includes(s)?e.settings.openTabs:[...e.settings.openTabs,s];ot(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s,openTabs:i})}Yo(e,t)}function Yo(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?Bo(e):Fo(e),t==="logs"?No(e):Uo(e),t==="debug"?zo(e):Ko(e),t==="mission-control"?yu(e):vu(e),e.connected&&vs(e)}function Jo(e,t,n){if(typeof window>"u")return;const s=as(oo(t,e.basePath)),i=as(window.location.pathname),a=new URL(window.location.href);t==="chat"&&e.sessionKey?a.searchParams.set("session",e.sessionKey):a.searchParams.delete("session"),i!==s&&(a.pathname=s),n?window.history.replaceState({},"",a.toString()):window.history.pushState({},"",a.toString())}function Me(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),n?window.history.replaceState({},"",s.toString()):window.history.pushState({},"",s.toString())}async function Xo(e){await Promise.all([Fe(e,!1),jo(e),oe(e),gs(e),xi(e)])}async function Xu(e){await Promise.all([Fe(e,!0),zc(e),it(e)])}async function Ci(e){await Promise.all([Fe(e,!1),gs(e),_i(e)])}const fw=Object.freeze(Object.defineProperty({__proto__:null,applyResolvedTheme:bs,applySettings:ot,applySettingsFromUrl:Wu,attachThemeListener:Gu,detachThemeListener:Qu,inferBasePath:Hu,loadChannelsTab:Xu,loadCron:Ci,loadOverview:Xo,onPopState:Ju,refreshActiveTab:vs,setLastActiveSessionKey:Go,setTab:Qo,setTabFromRoute:Yo,setTheme:ju,syncTabWithLocation:Yu,syncThemeWithSettings:Vu,syncUrlWithSessionKey:Me,syncUrlWithTab:Jo},Symbol.toStringTag,{value:"Module"}));function ri(e){return e.chatSending||!!e.chatRunId}function st(e,t){const n=t??e.sessionKey,s=e.chatMessage.trim();if(s)e.chatDrafts={...e.chatDrafts,[n]:s};else{const{[n]:i,...a}=e.chatDrafts;e.chatDrafts=a}}function yt(e,t){const n=t??e.sessionKey;e.chatMessage=e.chatDrafts[n]??""}function Zu(e,t){const n=t??e.sessionKey,{[n]:s,...i}=e.chatDrafts;e.chatDrafts=i,n===e.sessionKey&&(e.chatMessage="")}function eh(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function gw(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function Zo(e){e.connected&&(e.chatMessage="",await Co(e))}function mw(e,t,n){const s=t.trim(),i=!!(n&&n.length>0);if(!s&&!i)return;const a=Date.now();e.chatQueue=[...e.chatQueue,{id:ki(),text:s,createdAt:a,attachments:i?n?.map(c=>({...c})):void 0}];const o=[];if(s&&o.push({type:"text",text:s}),i&&n)for(const c of n)o.push({type:"image",source:{type:"base64",media_type:c.mimeType,data:c.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:o,timestamp:a}],xe(e,!0)}async function Ha(e,t,n){ro(e);const s=e;s.sessionKey&&s.workingSessions&&(s.workingSessions=new Set([...s.workingSessions,s.sessionKey])),n?.skipOptimisticUpdate||queueMicrotask(()=>{xe(e,!0)});const i=await To(e,t,n?.attachments,{skipOptimisticUpdate:n?.skipOptimisticUpdate});return!i&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!i&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),i&&(Go(e,e.sessionKey),e.chatAttachments=[]),i&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),i&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),xe(e,!0),i&&!e.chatRunId&&er(e),i&&n?.refreshSessions&&(e.refreshSessionsAfterChat=!0),i}async function er(e){if(!e.connected||ri(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await Ha(e,t.text,{attachments:t.attachments,skipOptimisticUpdate:!0})||(e.chatQueue=[t,...e.chatQueue])}function th(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function nh(e,t,n){if(!e.connected)return;const s=e.chatMessage,i=(t??e.chatMessage).trim(),a=e.chatAttachments??[],o=t==null?a:[],c=o.length>0;if(!i&&!c)return;if(eh(i)){await Zo(e);return}const d=gw(i);if(t==null&&(e.chatMessage="",Zu(e)),n?.queue){mw(e,i,o),ri(e)||await er(e);return}if(ri(e)){await Co(e),await new Promise(u=>setTimeout(u,50)),await Ha(e,i,{attachments:c?o:void 0,refreshSessions:d});return}await Ha(e,i,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:c?o:void 0,previousAttachments:t==null?a:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:d})}async function tr(e){await Promise.all([ye(e),oe(e,{activeMinutes:0}),li(e)]),xe(e,!0)}const sh=er;function yw(e){const t=Wc(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function vw(e,t){const n=yi(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function li(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=yw(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=vw(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const i=await s.json(),a=typeof i.avatarUrl=="string"?i.avatarUrl.trim():"";e.chatAvatarUrl=a||null}catch{e.chatAvatarUrl=null}}const da=Object.freeze(Object.defineProperty({__proto__:null,clearDraft:Zu,flushChatQueueForEvent:sh,handleAbortChat:Zo,handleSendChat:nh,isChatBusy:ri,isChatStopCommand:eh,refreshChat:tr,refreshChatAvatar:li,removeQueuedMessage:th,restoreDraft:yt,saveDraft:st},Symbol.toStringTag,{value:"Module"})),bw={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},ww={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};const{I:kw}=Ep,Ml=e=>e,$w=e=>e.strings===void 0,Ol=()=>document.createComment(""),qn=(e,t,n)=>{const s=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0){const a=s.insertBefore(Ol(),i),o=s.insertBefore(Ol(),i);n=new kw(a,o,e,e.options)}else{const a=n._$AB.nextSibling,o=n._$AM,c=o!==e;if(c){let d;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(d=e._$AU)!==o._$AU&&n._$AP(d)}if(a!==i||c){let d=n._$AA;for(;d!==a;){const u=Ml(d).nextSibling;Ml(s).insertBefore(d,i),d=u}}}return n},Lt=(e,t,n=e)=>(e._$AI(t,n),e),Sw={},xw=(e,t=Sw)=>e._$AH=t,_w=e=>e._$AH,ua=e=>{e._$AR(),e._$AA.remove()};const Bl=(e,t,n)=>{const s=new Map;for(let i=t;i<=n;i++)s.set(e[i],i);return s},Ei=co(class extends uo{constructor(e){if(super(e),e.type!==lo.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let s;n===void 0?n=t:t!==void 0&&(s=t);const i=[],a=[];let o=0;for(const c of e)i[o]=s?s(c,o):o,a[o]=n(c,o),o++;return{values:a,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,s]){const i=_w(e),{values:a,keys:o}=this.dt(t,n,s);if(!Array.isArray(i))return this.ut=o,a;const c=this.ut??=[],d=[];let u,l,h=0,f=i.length-1,v=0,b=a.length-1;for(;h<=f&&v<=b;)if(i[h]===null)h++;else if(i[f]===null)f--;else if(c[h]===o[v])d[v]=Lt(i[h],a[v]),h++,v++;else if(c[f]===o[b])d[b]=Lt(i[f],a[b]),f--,b--;else if(c[h]===o[b])d[b]=Lt(i[h],a[b]),qn(e,d[b+1],i[h]),h++,b--;else if(c[f]===o[v])d[v]=Lt(i[f],a[v]),qn(e,i[h],i[f]),f--,v++;else if(u===void 0&&(u=Bl(o,v,b),l=Bl(c,h,f)),u.has(c[h]))if(u.has(c[f])){const $=l.get(o[v]),k=$!==void 0?i[$]:null;if(k===null){const S=qn(e,i[h]);Lt(S,a[v]),d[v]=S}else d[v]=Lt(k,a[v]),qn(e,i[h],k),i[$]=null;v++}else ua(i[f]),f--;else ua(i[h]),h++;for(;v<=b;){const $=qn(e,d[b+1]);Lt($,a[v]),d[v++]=$}for(;h<=f;){const $=i[h++];$!==null&&ua($)}return this.ut=o,xw(e,d),wt}});function ih(e){return new Date(e).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Aw(e,t){const n=_o(e),s=wi(n.role);if(s==="system")return null;if(s==="tool"){const c=[];for(const d of n.content)if(d.name&&c.push(`**Tool:** ${d.name}`),d.text){const u=d.text.length>2e3?d.text.slice(0,2e3)+`

... (truncated)`:d.text;c.push(u)}return c.length===0?null:`<details>
<summary>Tool result</summary>

${c.join(`

`)}

</details>`}const i=s==="user"||n.role==="User"?"User":t,a=[];for(const c of n.content)if(c.type==="text"&&c.text)a.push(c.text);else if(c.type==="tool_call"&&c.name){const d=c.args?`\`${JSON.stringify(c.args).slice(0,200)}\``:"";a.push(`> **Called tool:** \`${c.name}\` ${d}`)}if(a.length===0)return null;const o=ih(n.timestamp);return`## ${i}
_${o}_

${a.join(`

`)}`}function Tw(){const e=new Date,t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${s}`}function Cw(e){return e.replace(/[^a-zA-Z0-9_-]/g,"-").replace(/-+/g,"-").slice(0,60)}function Ew(e,t,n){if(!e||e.length===0)return;const s=n||"Assistant",i=[];i.push("# Conversation Export"),i.push(`**Session:** \`${t}\`  `),i.push(`**Exported:** ${ih(Date.now())}  `),i.push(`**Assistant:** ${s}`),i.push("---");for(const u of e){const l=Aw(u,s);l&&i.push(l)}const a=i.join(`

`)+`
`,o=new Blob([a],{type:"text/markdown;charset=utf-8"}),c=URL.createObjectURL(o),d=document.createElement("a");d.href=c,d.download=`session-${Cw(t)}-${Tw()}.md`,document.body.appendChild(d),d.click(),requestAnimationFrame(()=>{document.body.removeChild(d),URL.revokeObjectURL(c)})}function nr(){requestAnimationFrame(()=>{document.querySelector(".session-tab--active")?.scrollIntoView({behavior:"smooth",inline:"nearest",block:"nearest"})})}function Rw(){requestAnimationFrame(()=>{document.querySelector(".chat-compose__textarea")?.focus()})}function Ri(e){st(e);const n=`agent:main:webchat-${ki().slice(0,8)}`;e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,n],sessionKey:n,lastActiveSessionKey:n,tabLastViewed:{...e.settings.tabLastViewed,[n]:Date.now()}}),e.sessionKey=n,e.chatMessage="",e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),Me(e,n,!0),ye(e),nr(),Rw()}function Va(e,t){const n=oo(t,e.basePath);return r`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||(s.preventDefault(),e.setTab(t))}}
      title=${os(t)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${vf(t)}</span>
      <span class="nav-item__text">${os(t)}</span>
    </a>
  `}function ah(e){const t=e.onboarding,n=e.onboarding,s=e.onboarding?!1:e.settings.chatShowThinking,i=e.onboarding?!0:e.settings.chatFocusMode,a=r`
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
        @click=${()=>Ri(e)}
        title="Start a new session (⌘⇧P)"
        aria-label="New session"
      >
        ${c}
      </button>
      <!-- Session picker (folder dropdown) -->
      <div class="session-picker-container">
        <button
          class="chat-toolbar__btn ${e.sessionPickerOpen?"active":""}"
          @click=${u=>{const h=u.currentTarget.getBoundingClientRect();e.sessionPickerPosition={top:h.bottom+8,right:window.innerWidth-h.right},e.sessionPickerOpen||oe(e),e.handleToggleSessionPicker()}}
          title="Open sessions"
          aria-label="Open sessions"
          aria-expanded=${e.sessionPickerOpen}
        >
          ${H.folderOpen}
        </button>
        ${e.sessionPickerOpen?Dw(e):p}
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
        ${e.sessionSearchOpen?Pw(e):p}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),tr(e)}}
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
        ${H.brain}
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
        ${H.lock}
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
        @click=${()=>{Ew(e.chatMessages,e.sessionKey,e.assistantName)}}
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
  `}function Lw(e){const t=new Date,n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=new Date(n.getTime()-864e5);return{today:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=n),yesterday:e.filter(i=>i.updatedAt&&new Date(i.updatedAt)>=s&&new Date(i.updatedAt)<n),older:e.filter(i=>!i.updatedAt||new Date(i.updatedAt)<s)}}let ha=null;function Pw(e){if(!e.client||!e.connected)return r`
      <div
        class="session-search-dropdown"
        style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;const t=i=>{const a=i.target.value;e.sessionSearchQuery=a,ha&&clearTimeout(ha),ha=setTimeout(()=>{e.handleSessionSearchQuery(a)},300)},n=i=>{e.sessionSearchOpen=!1,e.sessionSearchQuery="",e.sessionSearchResults=[],st(e),e.settings.openTabs.includes(i)?(e.sessionKey=i,e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,i],sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.sessionKey=i),yt(e,i),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),Me(e,i,!0),ye(e).then(()=>{mi(e),xe(e,!0)})},s=i=>{const a=i.label??i.displayName??i.key,o=i.matches.length>0;return r`
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
            `:p}
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
  `}function Dw(e){const t=(e.sessionPickerSearch??"").toLowerCase().trim();if(!e.client||!e.connected)return r`
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
    `;let n=(e.sessionsResult?.sessions??[]).filter(f=>!e.settings.openTabs.includes(f.key));t&&(n=n.filter(f=>[f.label,f.displayName,f.key].filter(Boolean).some(b=>b.toLowerCase().includes(t))));const s=50,i=n.length,a=n.slice(0,s),o=Lw(a),c=f=>{e.sessionPickerOpen=!1,e.sessionPickerSearch="",st(e),e.settings.openTabs.includes(f)?(e.sessionKey=f,e.applySettings({...e.settings,sessionKey:f,lastActiveSessionKey:f,tabLastViewed:{...e.settings.tabLastViewed,[f]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,f],sessionKey:f,lastActiveSessionKey:f,tabLastViewed:{...e.settings.tabLastViewed,[f]:Date.now()}}),e.sessionKey=f),yt(e,f),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),Me(e,f,!0),ye(e).then(()=>{mi(e),xe(e,!0)})},d=async(f,v)=>{if(f.stopPropagation(),!!window.confirm(`Delete session "${v}"?

Deletes the session entry and archives its transcript.`)&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.filter($=>$.key!==v)}),e.client&&e.connected))try{await e.client.request("sessions.delete",{key:v,deleteTranscript:!0}),oe(e)}catch($){console.error("Failed to delete session:",$),oe(e)}},u=f=>r`
    <div class="session-picker-item" @click=${()=>c(f.key)}>
      <span class="session-picker-item__status ${f.isActive?"active":""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${f.label??f.displayName??je.get(f.key)??f.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${f.updatedAt?r`<span class="session-picker-item__time">${xf(f.updatedAt)}</span>`:p}
        <button
          class="session-picker-item__close"
          @click=${v=>d(v,f.key)}
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
  `,l=(f,v)=>v.length===0?p:r`
      <div class="session-picker-group">
        <div class="session-picker-group__header">${f}</div>
        ${Ei(v,b=>b.key,u)}
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
          @input=${f=>{e.sessionPickerSearch=f.target.value}}
          @click=${f=>f.stopPropagation()}
        />
      </div>
      <div class="session-picker-list">
        ${h===0?r`
                <div class="session-picker-empty">No other sessions</div>
              `:r`
              ${l("Today",o.today)}
              ${l("Yesterday",o.yesterday)}
              ${l("Older",o.older)}
              ${i>s?r`<div class="session-picker-overflow">
                    Showing ${s} of ${i} sessions. Use search to find more.
                  </div>`:p}
            `}
      </div>
    </div>
  `}const Iw=["system","light","dark","lifetrack"];function oh(e){const t=Math.max(0,Iw.indexOf(e.theme)),n=s=>i=>{const o={element:i.currentTarget};(i.clientX||i.clientY)&&(o.pointerClientX=i.clientX,o.pointerClientY=i.clientY),e.setTheme(s,o)};return r`
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
          ${Bw()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${Mw()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${Ow()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="lifetrack"?"active":""}"
          @click=${n("lifetrack")}
          aria-pressed=${e.theme==="lifetrack"}
          aria-label="Lifetrack theme"
          title="Lifetrack"
        >
          ${Fw()}
        </button>
      </div>
    </div>
  `}function Mw(){return r`
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
  `}function Ow(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function Bw(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function Fw(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"></path>
      <path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67L19 15z"></path>
    </svg>
  `}const ht=Object.freeze(Object.defineProperty({__proto__:null,createNewSession:Ri,renderChatControls:ah,renderTab:Va,renderThemeToggle:oh,scrollActiveTabIntoView:nr},Symbol.toStringTag,{value:"Module"})),pa=new Set;function Fl(e){if(!(!e.connected||!e.client||!e.settings.chatParallelView))for(const t of e.settings.parallelLanes){const n=t?.trim();if(!n)continue;const i=qt(e.sessionsResult?.sessions,n)?.key??n;if(vt.has(n)||vt.has(i)||pa.has(i))continue;pa.add(i);const o=e.client;Ld(o,i).then(c=>{i!==n&&c.length>0&&vt.set(n,c)}).finally(()=>{pa.delete(i),e.applySettings({...e.settings})})}}function Nw(e){e.basePath=Hu(),e._urlSettingsApplied||(Wu(e),e._urlSettingsApplied=!0),Yu(e,!0),Vu(e),Gu(e),window.addEventListener("popstate",e.popStateHandler),e.keydownHandler=t=>{if(e.tab!=="chat")return;if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="p"){t.preventDefault(),Ri(e);return}if(!t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.key<"1"||t.key>"9")return;const n=parseInt(t.key,10)-1,s=e.settings.openTabs;if(n>=s.length)return;const i=s[n];i!==e.sessionKey&&(t.preventDefault(),st(e),e.sessionKey=i,yt(e,i),e.chatLoading=!0,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:i,lastActiveSessionKey:i,tabLastViewed:{...e.settings.tabLastViewed,[i]:Date.now()}}),e.loadAssistantIdentity(),Me(e,i,!0),ye(e).then(()=>{oi(e)}))},window.addEventListener("keydown",e.keydownHandler),Mo(e),e.tab==="nodes"&&Bo(e),e.tab==="logs"&&No(e),e.tab==="debug"&&zo(e)}function Uw(e){ff(e)}function zw(e){window.removeEventListener("popstate",e.popStateHandler),window.removeEventListener("keydown",e.keydownHandler),e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null),e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null),Fo(e),Uo(e),Ko(e),Qu(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function qt(e,t){if(!e||!t)return;const n=e.find(o=>o.key===t);if(n)return n;const s=t.split(":"),i=s[s.length-1];if(i&&i.length>=4){const o=e.find(c=>c.key===i||c.key.endsWith(`:${i}`));if(o)return o}const a=t.replace(/^webchat:/,"");if(a!==t){const o=e.find(c=>c.key.endsWith(a)||c.key.endsWith(`:${a}`));if(o)return o}}function Kw(e,t){if(!t||t.length===0)return;const n=d=>{const u=d.toLowerCase();return u==="main"||u==="agent:main:main"||u.endsWith(":main")},s=(d,u)=>{const l=d?.sessionId?.trim();if(l)return`session:${l}`;if(d){const f=[d.kind,d.surface,d.subject,d.room,d.space,d.label,d.displayName].map(v=>String(v??"").trim().toLowerCase()).join("|");if(f.replace(/\|/g,"").length>0)return`meta:${f}`}return`key:${u}`};let i=!1;const a=new Map,o=[];for(const d of e.settings.openTabs){const u=d.trim();if(!u){i=!0;continue}if(n(u)){i=!0;continue}const l=qt(t,u),h=l?.key??u;h!==d&&(i=!0);const f=s(l,h);if(a.has(f)){i=!0;continue}a.set(f,h),o.push(h)}const c=o.length!==e.settings.openTabs.length;if(i||c){const d={};for(const[b,$]of Object.entries(e.settings.tabLastViewed)){const k=b.trim();if(!k||typeof $!="number"||!Number.isFinite($))continue;const S=qt(t,k),_=s(S,S?.key??k),L=a.get(_)??S?.key??k;d[L]=Math.max(d[L]??0,$)}const u=qt(t,e.sessionKey),l=s(u,u?.key??e.sessionKey.trim()),h=a.get(l)??u?.key??(e.sessionKey.trim()||o[0]||"main"),v=h==="main"||h.endsWith(":main")||o.includes(h)?h:o[0]||"main";e.applySettings({...e.settings,openTabs:o,sessionKey:v,lastActiveSessionKey:v,tabLastViewed:d}),e.sessionKey!==v&&(e.sessionKey=v)}}function qw(e,t){if((t.has("sessionsResult")||t.has("settings"))&&e.sessionsResult?.sessions&&Kw(e,e.sessionsResult.sessions),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.settings.chatParallelView&&Fl(e),t.has("settings")&&e.connected&&e.settings.chatParallelView){const n=t.get("settings"),s=n?!n.chatParallelView:!0,i=!n||n.parallelLanes.some((a,o)=>a!==e.settings.parallelLanes[o]);(s||i)&&Fl(e)}if(t.has("sessionPickerOpen")&&(e.sessionPickerOpen?setTimeout(()=>{e.sessionPickerOpen&&(e.sessionPickerClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-picker-container"),a=s.closest(".session-picker-dropdown");!i&&!a&&(e.sessionPickerOpen=!1)},document.addEventListener("click",e.sessionPickerClickOutsideHandler,!0))},0):e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null)),t.has("sessionSearchOpen")&&(e.sessionSearchOpen?setTimeout(()=>{e.sessionSearchOpen&&(e.sessionSearchClickOutsideHandler=n=>{const s=n.target,i=s.closest(".session-search-container"),a=s.closest(".session-search-dropdown");!i&&!a&&(e.sessionSearchOpen=!1)},document.addEventListener("click",e.sessionSearchClickOutsideHandler,!0))},0):e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null)),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab==="chat"&&!e.chatLoading&&ye(e).then(()=>{oi(e)}),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab!=="chat"&&vs(e),e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("sessionKey")||t.has("tab"))){const n=t.has("tab"),s=t.has("sessionKey"),i=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;let a=!1;if(t.has("chatMessages")){const o=e.chatMessages;o[o.length-1]?.role==="user"&&(a=!0)}t.has("chatStream")&&(a=!1),(n||s||i)&&mi(e),xe(e,n||s||i||a||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&jc(e,t.has("tab")||t.has("logsAutoFollow"))}async function Nl(e,t){return!1}async function Ww(e,t){return null}function Ul(e){return e.charAt(0).toUpperCase()||"A"}function zl(e){if(!e)return"";const t=new Date(e),n=t.getHours(),s=t.getMinutes().toString().padStart(2,"0"),i=n>=12?"PM":"AM";return`${n%12||12}:${s} ${i}`}function jw(e){e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,120)}px`}function rh(e,t=80){return e.scrollHeight-e.scrollTop-e.clientHeight<t}function lh(e){const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)}const Kl=new WeakMap;function Hw(e){requestAnimationFrame(()=>{const t=document.querySelector(".ally-panel, .ally-inline");if(!t)return;const n=t.querySelector(".ally-panel__messages");if(!n)return;const s=Kl.get(n),i=s??{lastMsgCount:0,lastStreamLen:0},a=e.messages.length,o=e.stream?.length??0,c=a!==i.lastMsgCount||o>i.lastStreamLen;Kl.set(n,{lastMsgCount:a,lastStreamLen:o}),c&&(!s||rh(n,120))&&lh(t)})}function Vw(e){const t=e.currentTarget,n=t.querySelector(".ally-jump-bottom");n&&n.classList.toggle("ally-jump-bottom--visible",!rh(t))}function ch(e,t){return e.allyAvatar?r`<img class=${t==="bubble"?"ally-bubble__avatar":"ally-panel__header-avatar"} src=${e.allyAvatar} alt=${e.allyName} />`:t==="header"?r`<span class="ally-panel__header-initial">${Ul(e.allyName)}</span>`:r`${Ul(e.allyName)}`}function ql(e){if(e.role==="assistant"&&e.content){const t=Se(e.content);return r`<div class="ally-msg__content chat-text">${at(t)}</div>`}return r`<span class="ally-msg__content">${e.content}</span>`}function Gw(e,t){return!e.actions||e.actions.length===0?p:r`
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
  `}function Qw(e,t,n){if(e.isNotification)return r`
      <div class="ally-msg ally-msg--notification" data-idx=${t}>
        ${ql(e)}
        ${Gw(e,n)}
        ${e.timestamp?r`<div class="ally-msg__time">${zl(e.timestamp)}</div>`:p}
      </div>
    `;const s=e.role==="user"?"ally-msg--user":"ally-msg--assistant";return r`
    <div class="ally-msg ${s}" data-idx=${t}>
      ${ql(e)}
      ${e.timestamp?r`<div class="ally-msg__time">${zl(e.timestamp)}</div>`:p}
    </div>
  `}function Yw(e){if(!e)return p;const t=pd(e);return r`
    <div class="ally-msg ally-msg--streaming">
      <div class="ally-msg__content chat-text">${at(t)}</div>
    </div>
  `}function Jw(e){return e.connected?p:r`<div class="ally-panel__status ally-panel__status--disconnected">Disconnected</div>`}function Xw(){return r`
    <div class="ally-msg ally-msg--assistant ally-msg--reading-indicator">
      <span class="chat-reading-indicator__dots">
        <span></span><span></span><span></span>
      </span>
    </div>
  `}function Zw(e,t){const n=e.clipboardData?.items;if(!n)return;const s=[];for(const i of Array.from(n)){if(!i.type.startsWith("image/"))continue;const a=i.getAsFile();if(!a)continue;e.preventDefault();const o=new FileReader,c=`paste-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;o.onload=()=>{const d=o.result;t.onAttachmentsChange([...t.attachments,{id:c,dataUrl:d,mimeType:a.type,fileName:a.name||"screenshot.png",status:"ready"}])},o.readAsDataURL(a),s.push({id:c,dataUrl:"",mimeType:a.type,fileName:a.name,status:"reading"})}s.length>0&&t.onAttachmentsChange([...t.attachments,...s])}function ek(e){return e.attachments.length===0?p:r`
    <div class="ally-panel__attachments">
      ${e.attachments.map(t=>r`
          <div class="ally-panel__attachment">
            ${t.dataUrl?r`<img src=${t.dataUrl} alt=${t.fileName??"attachment"} class="ally-panel__attachment-img" />`:r`<span class="ally-panel__attachment-loading">...</span>`}
            <button
              type="button"
              class="ally-panel__attachment-remove"
              title="Remove"
              @click=${()=>e.onAttachmentsChange(e.attachments.filter(n=>n.id!==t.id))}
            >${H.x}</button>
          </div>
        `)}
    </div>
  `}function tk(e){const t=e.connected?`Message ${e.allyName}...`:"Reconnecting...",n=e.draft.trim()||e.attachments.length>0;return r`
    ${ek(e)}
    <div class="ally-panel__input">
      <textarea
        class="ally-panel__textarea"
        .value=${e.draft}
        ?disabled=${!e.connected||e.sending}
        placeholder=${t}
        rows="1"
        @input=${s=>{const i=s.target;jw(i),e.onDraftChange(i.value)}}
        @paste=${s=>Zw(s,e)}
        @keydown=${s=>{s.key==="Enter"&&(s.isComposing||s.keyCode===229||s.shiftKey||e.connected&&(s.preventDefault(),e.onSend()))}}
      ></textarea>
      <button
        class="ally-panel__send-btn"
        type="button"
        ?disabled=${!e.connected||!n&&!e.sending}
        title="Send"
        @click=${()=>e.onSend()}
      >
        ${H.arrowUp}
      </button>
    </div>
  `}function nk(e){return r`
    <div class="ally-bubble">
      <button
        type="button"
        class="ally-bubble__btn"
        title="Chat with ${e.allyName}"
        aria-label="Open ${e.allyName} chat"
        @click=${()=>e.onToggle()}
      >
        ${ch(e,"bubble")}
        ${e.isWorking?r`<span class="ally-bubble__working"></span>`:p}
      </button>
      ${e.unreadCount>0?r`<span class="ally-bubble__badge">${e.unreadCount>99?"99+":e.unreadCount}</span>`:p}
    </div>
  `}function dh(e){return Hw(e),r`
    <div class="ally-panel__header">
      <div class="ally-panel__header-left">
        ${ch(e,"header")}
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

    ${Jw(e)}

    <div class="ally-panel__messages" @scroll=${Vw}>
      ${e.messages.length===0&&!e.stream?r`<div class="ally-panel__empty">
            Start a conversation with ${e.allyName}
          </div>`:p}
      ${e.messages.map((t,n)=>Qw(t,n,e.onAction))}
      ${e.stream?Yw(e.stream):p}
      ${(e.isWorking||e.sending)&&!e.stream?Xw():p}
      <button
        type="button"
        class="ally-jump-bottom"
        title="Jump to latest"
        @click=${t=>{const n=t.currentTarget.closest(".ally-panel, .ally-inline");n&&lh(n)}}
      >${H.chevronDown}</button>
    </div>

    ${tk(e)}
  `}function sk(e){return e.open?r`
    <div class="ally-panel">
      ${dh(e)}
    </div>
  `:nk(e)}function ik(e){return e.open?r`
    <div class="ally-inline">
      ${dh(e)}
    </div>
  `:p}function Ve(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function uh(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(Ve(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function Li(e){return e.filter(t=>typeof t=="string").join(".")}function Ce(e,t){const n=Li(e),s=t[n];if(s)return s;const i=n.split(".");for(const[a,o]of Object.entries(t)){if(!a.includes("*"))continue;const c=a.split(".");if(c.length!==i.length)continue;let d=!0;for(let u=0;u<i.length;u+=1)if(c[u]!=="*"&&c[u]!==i[u]){d=!1;break}if(d)return o}}function lt(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function ak(e){const t=Li(e).toLowerCase();return t.includes("token")||t.includes("password")||t.includes("secret")||t.includes("apikey")||t.endsWith("key")}function vn(e){return typeof e=="string"?e:e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}const ok=new Set(["title","description","default","nullable"]);function rk(e){return Object.keys(e??{}).filter(n=>!ok.has(n)).length===0}function lk(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const us={chevronDown:r`
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
  `};function rt(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:c}=e,d=e.showLabel??!0,u=Ve(t),l=Ce(s,i),h=l?.label??t.title??lt(String(s.at(-1))),f=l?.help??t.description,v=Li(s);if(a.has(v))return r`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${h}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const $=(t.anyOf??t.oneOf??[]).filter(x=>!(x.type==="null"||Array.isArray(x.type)&&x.type.includes("null")));if($.length===1)return rt({...e,schema:$[0]});const k=x=>{if(x.const!==void 0)return x.const;if(x.enum&&x.enum.length===1)return x.enum[0]},S=$.map(k),_=S.every(x=>x!==void 0);if(_&&S.length>0&&S.length<=5){const x=n??t.default;return r`
        <div class="cfg-field">
          ${d?r`<label class="cfg-field__label">${h}</label>`:p}
          ${f?r`<div class="cfg-field__help">${f}</div>`:p}
          <div class="cfg-segmented">
            ${S.map((T,A)=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${T===x||vn(T)===vn(x)?"active":""}"
                ?disabled=${o}
                @click=${()=>c(s,T)}
              >
                ${vn(T)}
              </button>
            `)}
          </div>
        </div>
      `}if(_&&S.length>5)return jl({...e,options:S,value:n??t.default});const L=new Set($.map(x=>Ve(x)).filter(Boolean)),E=new Set([...L].map(x=>x==="integer"?"number":x));if([...E].every(x=>["string","number","boolean"].includes(x))){const x=E.has("string"),T=E.has("number");if(E.has("boolean")&&E.size===1)return rt({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(x||T)return Wl({...e,inputType:T&&!x?"number":"text"})}}if(t.enum){const b=t.enum;if(b.length<=5){const $=n??t.default;return r`
        <div class="cfg-field">
          ${d?r`<label class="cfg-field__label">${h}</label>`:p}
          ${f?r`<div class="cfg-field__help">${f}</div>`:p}
          <div class="cfg-segmented">
            ${b.map(k=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${k===$||String(k)===String($)?"active":""}"
                ?disabled=${o}
                @click=${()=>c(s,k)}
              >
                ${String(k)}
              </button>
            `)}
          </div>
        </div>
      `}return jl({...e,options:b,value:n??t.default})}if(u==="object")return dk(e);if(u==="array")return uk(e);if(u==="boolean"){const b=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return r`
      <label class="cfg-toggle-row ${o?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${h}</span>
          ${f?r`<span class="cfg-toggle-row__help">${f}</span>`:p}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${b}
            ?disabled=${o}
            @change=${$=>c(s,$.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return u==="number"||u==="integer"?ck(e):u==="string"?Wl({...e,inputType:"text"}):r`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${h}</div>
      <div class="cfg-field__error">Unsupported type: ${u}. Use Raw mode.</div>
    </div>
  `}function Wl(e){const{schema:t,value:n,path:s,hints:i,disabled:a,onPatch:o,inputType:c}=e,d=e.showLabel??!0,u=Ce(s,i),l=u?.label??t.title??lt(String(s.at(-1))),h=u?.help??t.description,f=u?.sensitive??ak(s),v=u?.placeholder??(f?"••••":t.default!==void 0?`Default: ${vn(t.default)}`:""),b=n??"";return r`
    <div class="cfg-field">
      ${d?r`<label class="cfg-field__label">${l}</label>`:p}
      ${h?r`<div class="cfg-field__help">${h}</div>`:p}
      <div class="cfg-input-wrap">
        <input
          type=${f?"password":c}
          class="cfg-input"
          placeholder=${v}
          .value=${vn(b)}
          ?disabled=${a}
          @input=${$=>{const k=$.target.value;if(c==="number"){if(k.trim()===""){o(s,void 0);return}const S=Number(k);o(s,Number.isNaN(S)?k:S);return}o(s,k)}}
          @change=${$=>{if(c==="number")return;const k=$.target.value;o(s,k.trim())}}
        />
        ${t.default!==void 0?r`
          <button
            type="button"
            class="cfg-input__reset"
            title="Reset to default"
            ?disabled=${a}
            @click=${()=>o(s,t.default)}
          >↺</button>
        `:p}
      </div>
    </div>
  `}function ck(e){const{schema:t,value:n,path:s,hints:i,disabled:a,onPatch:o}=e,c=e.showLabel??!0,d=Ce(s,i),u=d?.label??t.title??lt(String(s.at(-1))),l=d?.help??t.description,h=n??t.default??"",f=typeof h=="number"?h:0;return r`
    <div class="cfg-field">
      ${c?r`<label class="cfg-field__label">${u}</label>`:p}
      ${l?r`<div class="cfg-field__help">${l}</div>`:p}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(s,f-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${vn(h)}
          ?disabled=${a}
          @input=${v=>{const b=v.target.value,$=b===""?void 0:Number(b);o(s,$)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(s,f+1)}
        >+</button>
      </div>
    </div>
  `}function jl(e){const{schema:t,value:n,path:s,hints:i,disabled:a,options:o,onPatch:c}=e,d=e.showLabel??!0,u=Ce(s,i),l=u?.label??t.title??lt(String(s.at(-1))),h=u?.help??t.description,f=n??t.default,v=o.findIndex($=>$===f||String($)===String(f)),b="__unset__";return r`
    <div class="cfg-field">
      ${d?r`<label class="cfg-field__label">${l}</label>`:p}
      ${h?r`<div class="cfg-field__help">${h}</div>`:p}
      <select
        class="cfg-select"
        ?disabled=${a}
        .value=${v>=0?String(v):b}
        @change=${$=>{const k=$.target.value;c(s,k===b?void 0:o[Number(k)])}}
      >
        <option value=${b}>Select...</option>
        ${o.map(($,k)=>r`
          <option value=${String(k)}>${String($)}</option>
        `)}
      </select>
    </div>
  `}function dk(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:c}=e;e.showLabel;const d=Ce(s,i),u=d?.label??t.title??lt(String(s.at(-1))),l=d?.help??t.description,h=n??t.default,f=h&&typeof h=="object"&&!Array.isArray(h)?h:{},v=t.properties??{},$=Object.entries(v).toSorted((L,E)=>{const x=Ce([...s,L[0]],i)?.order??0,T=Ce([...s,E[0]],i)?.order??0;return x!==T?x-T:L[0].localeCompare(E[0])}),k=new Set(Object.keys(v)),S=t.additionalProperties,_=!!S&&typeof S=="object";return s.length===1?r`
      <div class="cfg-fields">
        ${$.map(([L,E])=>rt({schema:E,value:f[L],path:[...s,L],hints:i,unsupported:a,disabled:o,onPatch:c}))}
        ${_?Hl({schema:S,value:f,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:k,onPatch:c}):p}
      </div>
    `:r`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${u}</span>
        <span class="cfg-object__chevron">${us.chevronDown}</span>
      </summary>
      ${l?r`<div class="cfg-object__help">${l}</div>`:p}
      <div class="cfg-object__content">
        ${$.map(([L,E])=>rt({schema:E,value:f[L],path:[...s,L],hints:i,unsupported:a,disabled:o,onPatch:c}))}
        ${_?Hl({schema:S,value:f,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:k,onPatch:c}):p}
      </div>
    </details>
  `}function uk(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:c}=e,d=e.showLabel??!0,u=Ce(s,i),l=u?.label??t.title??lt(String(s.at(-1))),h=u?.help??t.description,f=Array.isArray(t.items)?t.items[0]:t.items;if(!f)return r`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${l}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const v=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return r`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${d?r`<span class="cfg-array__label">${l}</span>`:p}
        <span class="cfg-array__count">${v.length} item${v.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${o}
          @click=${()=>{const b=[...v,uh(f)];c(s,b)}}
        >
          <span class="cfg-array__add-icon">${us.plus}</span>
          Add
        </button>
      </div>
      ${h?r`<div class="cfg-array__help">${h}</div>`:p}

      ${v.length===0?r`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:r`
        <div class="cfg-array__items">
          ${v.map((b,$)=>r`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${$+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${o}
                  @click=${()=>{const k=[...v];k.splice($,1),c(s,k)}}
                >
                  ${us.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${rt({schema:f,value:b,path:[...s,$],hints:i,unsupported:a,disabled:o,showLabel:!1,onPatch:c})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function Hl(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:c,onPatch:d}=e,u=rk(t),l=Object.entries(n??{}).filter(([h])=>!c.has(h));return r`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${o}
          @click=${()=>{const h={...n};let f=1,v=`custom-${f}`;for(;v in h;)f+=1,v=`custom-${f}`;h[v]=u?{}:uh(t),d(s,h)}}
        >
          <span class="cfg-map__add-icon">${us.plus}</span>
          Add Entry
        </button>
      </div>

      ${l.length===0?r`
              <div class="cfg-map__empty">No custom entries.</div>
            `:r`
        <div class="cfg-map__items">
          ${l.map(([h,f])=>{const v=[...s,h],b=lk(f);return r`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${h}
                    ?disabled=${o}
                    @change=${$=>{const k=$.target.value.trim();if(!k||k===h)return;const S={...n};k in S||(S[k]=S[h],delete S[h],d(s,S))}}
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
                          @change=${$=>{const k=$.target,S=k.value.trim();if(!S){d(v,void 0);return}try{d(v,JSON.parse(S))}catch{k.value=b}}}
                        ></textarea>
                      `:rt({schema:t,value:f,path:v,hints:i,unsupported:a,disabled:o,showLabel:!1,onPatch:d})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  ?disabled=${o}
                  @click=${()=>{const $={...n};delete $[h],d(s,$)}}
                >
                  ${us.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const Vl={env:r`
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
  `},sr={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"},user:{label:"User Profile",description:"Your display name and avatar"}};function Gl(e){return Vl[e]??Vl.default}function hk(e,t,n){if(!n)return!0;const s=n.toLowerCase(),i=sr[e];return e.toLowerCase().includes(s)||i&&(i.label.toLowerCase().includes(s)||i.description.toLowerCase().includes(s))?!0:Vn(t,s)}function Vn(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,i]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||Vn(i,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const i of s)if(i&&Vn(i,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&Vn(e.additionalProperties,t))return!0;const n=e.anyOf??e.oneOf??e.allOf;if(n){for(const s of n)if(s&&Vn(s,t))return!0}return!1}function pk(e){if(!e.schema)return r`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,n=e.value??{};if(Ve(t)!=="object"||!t.properties)return r`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),i=t.properties,a=e.searchQuery??"",o=e.activeSection,c=e.activeSubsection??null,u=Object.entries(i).toSorted((h,f)=>{const v=Ce([h[0]],e.uiHints)?.order??50,b=Ce([f[0]],e.uiHints)?.order??50;return v!==b?v-b:h[0].localeCompare(f[0])}).filter(([h,f])=>!(o&&h!==o||a&&!hk(h,f,a)));let l=null;if(o&&c&&u.length===1){const h=u[0]?.[1];h&&Ve(h)==="object"&&h.properties&&h.properties[c]&&(l={sectionKey:o,subsectionKey:c,schema:h.properties[c]})}return u.length===0?r`
      <div class="config-empty">
        <div class="config-empty__icon">${H.search}</div>
        <div class="config-empty__text">
          ${a?`No settings match "${a}"`:"No settings in this section"}
        </div>
      </div>
    `:r`
    <div class="config-form config-form--modern">
      ${l?(()=>{const{sectionKey:h,subsectionKey:f,schema:v}=l,b=Ce([h,f],e.uiHints),$=b?.label??v.title??lt(f),k=b?.help??v.description??"",S=n[h],_=S&&typeof S=="object"?S[f]:void 0,L=`config-section-${h}-${f}`;return r`
              <section class="config-section-card" id=${L}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Gl(h)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${$}</h3>
                    ${k?r`<p class="config-section-card__desc">${k}</p>`:p}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${rt({schema:v,value:_,path:[h,f],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():u.map(([h,f])=>{const v=sr[h]??{label:h.charAt(0).toUpperCase()+h.slice(1),description:f.description??""};return r`
              <section class="config-section-card" id="config-section-${h}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Gl(h)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${v.label}</h3>
                    ${v.description?r`<p class="config-section-card__desc">${v.description}</p>`:p}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${rt({schema:f,value:n[h],path:[h],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const fk=new Set(["title","description","default","nullable"]);function gk(e){return Object.keys(e??{}).filter(n=>!fk.has(n)).length===0}function hh(e){const t=e.filter(i=>i!=null),n=t.length!==e.length,s=[];for(const i of t)s.some(a=>Object.is(a,i))||s.push(i);return{enumValues:s,nullable:n}}function ph(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:Zn(e,[])}function Zn(e,t){const n=new Set,s={...e},i=Li(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const c=mk(e,t);return c||{schema:e,unsupportedPaths:[i]}}const a=Array.isArray(e.type)&&e.type.includes("null"),o=Ve(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=o??e.type,s.nullable=a||e.nullable,s.enum){const{enumValues:c,nullable:d}=hh(s.enum);s.enum=c,d&&(s.nullable=!0),c.length===0&&n.add(i)}if(o==="object"){const c=e.properties??{},d={};for(const[u,l]of Object.entries(c)){const h=Zn(l,[...t,u]);h.schema&&(d[u]=h.schema);for(const f of h.unsupportedPaths)n.add(f)}if(s.properties=d,e.additionalProperties===!0)n.add(i);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!gk(e.additionalProperties)){const u=Zn(e.additionalProperties,[...t,"*"]);s.additionalProperties=u.schema??e.additionalProperties,u.unsupportedPaths.length>0&&n.add(i)}}else if(o==="array"){const c=Array.isArray(e.items)?e.items[0]:e.items;if(!c)n.add(i);else{const d=Zn(c,[...t,"*"]);s.items=d.schema??c,d.unsupportedPaths.length>0&&n.add(i)}}else o!=="string"&&o!=="number"&&o!=="integer"&&o!=="boolean"&&!s.enum&&n.add(i);return{schema:s,unsupportedPaths:Array.from(n)}}function mk(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],i=[];let a=!1;for(const c of n){if(!c||typeof c!="object")return null;if(Array.isArray(c.enum)){const{enumValues:d,nullable:u}=hh(c.enum);s.push(...d),u&&(a=!0);continue}if("const"in c){if(c.const==null){a=!0;continue}s.push(c.const);continue}if(Ve(c)==="null"){a=!0;continue}i.push(c)}if(s.length>0&&i.length===0){const c=[];for(const d of s)c.some(u=>Object.is(u,d))||c.push(d);return{schema:{...e,enum:c,nullable:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(i.length===1){const c=Zn(i[0],t);return c.schema&&(c.schema.nullable=a||c.schema.nullable),c}const o=new Set(["string","number","integer","boolean"]);return i.length>0&&s.length===0&&i.every(c=>c.type&&o.has(String(c.type)))?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}function yk(e,t){let n=e;for(const s of t){if(!n)return null;const i=Ve(n);if(i==="object"){const a=n.properties??{};if(typeof s=="string"&&a[s]){n=a[s];continue}const o=n.additionalProperties;if(typeof s=="string"&&o&&typeof o=="object"){n=o;continue}return null}if(i==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function vk(e,t){const s=(e.channels??{})[t],i=e[t];return(s&&typeof s=="object"?s:null)??(i&&typeof i=="object"?i:null)??{}}function bk(e){const t=ph(e.schema),n=t.schema;if(!n)return r`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=yk(n,["channels",e.channelId]);if(!s)return r`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const i=e.configValue??{},a=vk(i,e.channelId);return r`
    <div class="config-form">
      ${rt({schema:s,value:a,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
  `}function ct(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return r`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?r`
              <div class="muted">Loading config schema…</div>
            `:bk({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
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
  `}function wk(e){const{props:t,discord:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?N(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?N(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${ct({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function kk(e){const{props:t,googleChat:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?N(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?N(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${ct({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function $k(e){const{props:t,imessage:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?N(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?N(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:p}

      ${ct({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Ql(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function Sk(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:i,profileFormState:a,profileFormCallbacks:o,onEditProfile:c}=e,d=s[0],u=n?.configured??d?.configured??!1,l=n?.running??d?.running??!1,h=n?.publicKey??d?.publicKey,f=n?.lastStartAt??d?.lastStartAt??null,v=n?.lastError??d?.lastError??null,b=s.length>1,$=a!=null,k=_=>{const L=_.publicKey,E=_.profile,x=E?.displayName??E?.name??_.name??_.accountId;return r`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${x}</div>
          <div class="account-card-id">${_.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${_.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${_.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${L??""}">${Ql(L)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${_.lastInboundAt?N(_.lastInboundAt):"n/a"}</span>
          </div>
          ${_.lastError?r`
                <div class="account-card-error">${_.lastError}</div>
              `:p}
        </div>
      </div>
    `},S=()=>{if($&&o)return Qp({state:a,callbacks:o,accountId:s[0]?.accountId??"default"});const _=d?.profile??n?.profile,{name:L,displayName:E,about:x,picture:T,nip05:A}=_??{},F=L||E||x||T||A;return r`
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
              `:p}
        </div>
        ${F?r`
              <div class="status-list">
                ${T?r`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${T}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${I=>{I.target.style.display="none"}}
                        />
                      </div>
                    `:p}
                ${L?r`<div><span class="label">Name</span><span>${L}</span></div>`:p}
                ${E?r`<div><span class="label">Display Name</span><span>${E}</span></div>`:p}
                ${x?r`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${x}</span></div>`:p}
                ${A?r`<div><span class="label">NIP-05</span><span>${A}</span></div>`:p}
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
              ${s.map(_=>k(_))}
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
                <span class="monospace" title="${h??""}"
                  >${Ql(h)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${f?N(f):"n/a"}</span>
              </div>
            </div>
          `}

      ${v?r`<div class="callout danger" style="margin-top: 12px;">${v}</div>`:p}

      ${S()}

      ${ct({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function xk(e){if(!e&&e!==0)return"n/a";const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);return n<60?`${n}m`:`${Math.round(n/60)}h`}function _k(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const i=s[e],a=typeof i?.configured=="boolean"&&i.configured,o=typeof i?.running=="boolean"&&i.running,c=typeof i?.connected=="boolean"&&i.connected,u=(n.channelAccounts?.[e]??[]).some(l=>l.configured||l.running||l.connected);return a||o||c||u}function Ak(e,t){return t?.[e]?.length??0}function fh(e,t){const n=Ak(e,t);return n<2?p:r`<div class="account-count">Accounts (${n})</div>`}function Tk(e){const{props:t,signal:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?N(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?N(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${ct({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Ck(e){const{props:t,slack:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?N(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?N(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${ct({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Ek(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:i}=e,a=s.length>1,o=c=>{const u=c.probe?.bot?.username,l=c.name||c.accountId;return r`
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
            <span>${c.lastInboundAt?N(c.lastInboundAt):"n/a"}</span>
          </div>
          ${c.lastError?r`
                <div class="account-card-error">
                  ${c.lastError}
                </div>
              `:p}
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
                <span>${n?.lastStartAt?N(n.lastStartAt):"n/a"}</span>
              </div>
              <div>
                <span class="label">Last probe</span>
                <span>${n?.lastProbeAt?N(n.lastProbeAt):"n/a"}</span>
              </div>
            </div>
          `}

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:p}

      ${ct({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Rk(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return r`
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
            ${n?.lastConnectedAt?N(n.lastConnectedAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last message</span>
          <span>
            ${n?.lastMessageAt?N(n.lastMessageAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Auth age</span>
          <span>
            ${n?.authAgeMs!=null?xk(n.authAgeMs):"n/a"}
          </span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:p}

      ${t.whatsappMessage?r`<div class="callout" style="margin-top: 12px;">
            ${t.whatsappMessage}
          </div>`:p}

      ${t.whatsappQrDataUrl?r`<div class="qr-wrap">
            <img src=${t.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:p}

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

      ${ct({channelId:"whatsapp",props:t})}
    </div>
  `}function Lk(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,i=t?.discord??null;t?.googlechat;const a=t?.slack??null,o=t?.signal??null,c=t?.imessage??null,d=t?.nostr??null,l=Pk(e.snapshot).map((h,f)=>({key:h,enabled:_k(h,e),order:f})).toSorted((h,f)=>h.enabled!==f.enabled?h.enabled?-1:1:h.order-f.order);return r`
    <section class="grid grid-cols-2">
      ${l.map(h=>Dk(h.key,e,{whatsapp:n,telegram:s,discord:i,slack:a,signal:o,imessage:c,nostr:d,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?N(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:p}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function Pk(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function Dk(e,t,n){const s=fh(e,n.channelAccounts);switch(e){case"whatsapp":return Rk({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return Ek({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return wk({props:t,discord:n.discord,accountCountLabel:s});case"googlechat":return kk({props:t,accountCountLabel:s});case"slack":return Ck({props:t,slack:n.slack,accountCountLabel:s});case"signal":return Tk({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return $k({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const i=n.channelAccounts?.nostr??[],a=i[0],o=a?.accountId??"default",c=a?.profile??null,d=t.nostrProfileAccountId===o?t.nostrProfileFormState:null,u=d?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return Sk({props:t,nostr:n.nostr,nostrAccounts:i,accountCountLabel:s,profileFormState:d,profileFormCallbacks:u,onEditProfile:()=>t.onNostrProfileEdit(o,c)})}default:return Ik(e,t,n.channelAccounts??{})}}function Ik(e,t,n){const s=Ok(t.snapshot,e),i=t.snapshot?.channels?.[e],a=typeof i?.configured=="boolean"?i.configured:void 0,o=typeof i?.running=="boolean"?i.running:void 0,c=typeof i?.connected=="boolean"?i.connected:void 0,d=typeof i?.lastError=="string"?i.lastError:void 0,u=n[e]??[],l=fh(e,n);return r`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${l}

      ${u.length>0?r`
            <div class="account-card-list">
              ${u.map(h=>Uk(h))}
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
          </div>`:p}

      ${ct({channelId:e,props:t})}
    </div>
  `}function Mk(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function Ok(e,t){return Mk(e)[t]?.label??e?.channelLabels?.[t]??t}const Bk=600*1e3;function gh(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<Bk:!1}function Fk(e){return e.running?"Yes":gh(e)?"Active":"No"}function Nk(e){return e.connected===!0?"Yes":e.connected===!1?"No":gh(e)?"Active":"n/a"}function Uk(e){const t=Fk(e),n=Nk(e);return r`
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
          <span>${e.lastInboundAt?N(e.lastInboundAt):"n/a"}</span>
        </div>
        ${e.lastError?r`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:p}
      </div>
    </div>
  `}const es=(e,t)=>{const n=e._$AN;if(n===void 0)return!1;for(const s of n)s._$AO?.(t,!1),es(s,t);return!0},ci=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},mh=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),qk(t)}};function zk(e){this._$AN!==void 0?(ci(this),this._$AM=e,mh(this)):this._$AM=e}function Kk(e,t=!1,n=0){const s=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(s))for(let a=n;a<s.length;a++)es(s[a],!1),ci(s[a]);else s!=null&&(es(s,!1),ci(s));else es(this,e)}const qk=e=>{e.type==lo.CHILD&&(e._$AP??=Kk,e._$AQ??=zk)};class Wk extends uo{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,s){super._$AT(t,n,s),mh(this),this.isConnected=t._$AU}_$AO(t,n=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),n&&(es(this,t),ci(this))}setValue(t){if($w(this._$Ct))this._$Ct._$AI(t,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}const fa=new WeakMap,jk=co(class extends Wk{render(e){return p}update(e,[t]){const n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),p}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let n=fa.get(t);n===void 0&&(n=new WeakMap,fa.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?fa.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function Hk(e){return typeof e.content=="string"?e.content:typeof e.text=="string"?e.text:Array.isArray(e.content)?e.content.map(t=>typeof t.text=="string"?t.text:"").join(`
`):""}const Vk=["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"];function Gk(e){const t=typeof e.role=="string"?e.role.toLowerCase():"";if(t!=="user"&&t!=="system")return!1;const n=Hk(e).trim();if(!n)return!1;let s=n;if((n.includes("<system-context")||n.includes("<godmode-context"))&&(s=n.replace(/<system-context[\s\S]*?<\/system-context>/gi,"").replace(/<godmode-context[\s\S]*?<\/godmode-context>/gi,"").trim(),!s)||s.startsWith("Read HEARTBEAT.md")||s.startsWith("Read CONSCIOUSNESS.md")||s.startsWith("Pre-compaction memory flush")||s.startsWith("pre-compaction memory flush")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(s)||s==="NO_REPLY"||s.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(s)||s.startsWith("# WORKING.md")||s.startsWith("# MISTAKES.md")||/(?:VERIFIED|FIXED|NEW):\s/.test(s)&&/✅|🟡|☑/.test(s)&&s.length>300||/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(s)||/^\[GodMode Context:[^\]]*\]\s*$/.test(s)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(s)||/^##?\s*Persistence Protocol/i.test(s)||/^##?\s*Core (?:Behaviors|Principles)/i.test(s)||/^##?\s*Your Role as \w+/i.test(s)||/^##\s*Your Team\s*\(Agent Roster\)/i.test(s)&&s.indexOf(`

## `)===-1||/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)&&s.length>200||/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(s))return!0;const i=s.toLowerCase();return Vk.filter(a=>i.includes(a)).length>=2}const Yl=25*1024*1024,Jl=50*1024*1024,Xl=20;function ga(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:e<1024*1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:`${(e/(1024*1024*1024)).toFixed(1)} GB`}function ir(e,t=0){const n=[],s=[];let i=t;const a=Array.from(e);for(const o of a){if(n.length>=Xl){s.push(`Maximum ${Xl} files allowed per upload`);break}if(o.size>Yl){s.push(`"${o.name}" is too large (${ga(o.size)}). Max ${ga(Yl)}. For larger files, mention the file path instead.`);continue}if(i+o.size>Jl){s.push(`Total upload size exceeds ${ga(Jl)} limit`);break}i+=o.size,n.push(o)}return{validFiles:n,errors:s}}const Qk=new Set(["md","markdown","mdx"]),Yk=new Set(["htm","html"]),Jk=new Set(["avif","bmp","gif","heic","heif","jpeg","jpg","png","svg","svgz","webp"]);function yh(e){const t=e.replaceAll("\\","/").trim();if(!t)return e;const n=t.split("/");return n[n.length-1]||t}function Xk(e){if(!e)return null;const n=e.trim().toLowerCase().split(".").pop()??"";return n?Qk.has(n)?"text/markdown":Yk.has(n)?"text/html":Jk.has(n)?n==="svg"||n==="svgz"?"image/svg+xml":n==="jpg"?"image/jpeg":`image/${n}`:n==="pdf"?"application/pdf":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":null:null}function vh(e){const t=e.mimeType?.split(";")[0]?.trim().toLowerCase()??"";if(t)return t;const n=e.content?.trim()??"";if(n.startsWith("data:image/")){const s=/^data:(image\/[^;]+);/i.exec(n);return s?.[1]?s[1].toLowerCase():"image/*"}return Xk(e.filePath??null)??"text/markdown"}function Zk(e){if(!e.startsWith("file://"))return null;let t=e.slice(7);return t.startsWith("/~/")&&(t="~"+t.slice(2)),decodeURIComponent(t)}function e0(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const i=s.getAttribute("href");if(!i)return;const a=Zk(i);a&&(e.preventDefault(),e.stopPropagation(),t(a))}function t0(e){if(e.error)return r`
      <div class="callout danger">${e.error}</div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(!e.content)return r`
      <div class="muted">No content available</div>
    `;const t=vh(e),n=e.content,s=n.trim();if(t.startsWith("image/"))return s.startsWith("data:image/")?r`
        <div class="sidebar-image">
          <img src=${s} alt=${yh(e.filePath??"Image preview")} />
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
    ></iframe>`}if(t==="text/markdown"||t==="text/x-markdown"){const i=hd(n);return r`<div
      class="sidebar-markdown"
      @click=${a=>e0(a,e.onOpenFile)}
    >${at(Se(i))}</div>`}return r`<pre class="sidebar-plain">${n}</pre>`}function n0(e){const t=vh(e);return t==="text/html"||t==="application/xhtml+xml"}function s0(e){const t=new Blob([e],{type:"text/html"}),n=URL.createObjectURL(t);window.open(n,"_blank","noopener,noreferrer")}function Ga(e){const t=e.title?.trim()||"Tool Output",n=n0(e)&&e.content;return r`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${t}</div>
          ${e.filePath?r`<div class="sidebar-path" title=${e.filePath}>${e.filePath}</div>`:p}
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
                    </div>`:p}
              </div>`:p}
          ${n?r`<button
                class="btn sidebar-open-browser-btn"
                title="Open in browser tab"
                @click=${()=>s0(e.content)}
              >Open in Browser</button>`:p}
          <button @click=${e.onClose} class="btn" title="Close sidebar">
            ${H.x}
          </button>
        </div>
      </div>
      ${i0(e)}
      <div class="sidebar-content">${t0(e)}</div>
    </div>
  `}function i0(e){if(e.resource)return r`
      <div class="sidebar-resource-bar">
        <span class="resource-type-badge">${e.resource.type.replace("_"," ")}</span>
        <span style="flex: 1;">${e.resource.title}</span>
        <button
          class="sidebar-pin-btn${e.resource.pinned?" pinned":""}"
          title=${e.resource.pinned?"Unpin":"Pin"}
          @click=${()=>e.onToggleResourcePin?.(e.resource.id,!e.resource.pinned)}
        >${e.resource.pinned?"★":"☆"}</button>
      </div>
    `;if(e.filePath&&e.onSaveAsResource){const t=e.title?.trim()||yh(e.filePath);return r`
      <div class="sidebar-resource-bar">
        <button
          class="sidebar-save-resource-btn"
          @click=${()=>e.onSaveAsResource(e.filePath,t)}
        >Save as Resource</button>
      </div>
    `}return p}var a0=Object.defineProperty,o0=Object.getOwnPropertyDescriptor,ws=(e,t,n,s)=>{for(var i=s>1?void 0:s?o0(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&a0(t,n,i),i};let Jt=class extends He{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.direction="horizontal",this.isDragging=!1,this.startPos=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startPos=this.direction==="vertical"?e.clientY:e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=this.direction==="vertical",s=n?t.getBoundingClientRect().height:t.getBoundingClientRect().width,o=((n?e.clientY:e.clientX)-this.startPos)/s;let c=this.startRatio+o;c=Math.max(this.minRatio,Math.min(this.maxRatio,c)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:c},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return r``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};Jt.styles=dp`
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
  `;ws([hs({type:Number})],Jt.prototype,"splitRatio",2);ws([hs({type:Number})],Jt.prototype,"minRatio",2);ws([hs({type:Number})],Jt.prototype,"maxRatio",2);ws([hs({type:String})],Jt.prototype,"direction",2);Jt=ws([_n("resizable-divider")],Jt);const r0=5e3;function Zl(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function l0(e){const t=e.sessions?.sessions?.find(i=>i.key===e.sessionKey);if(!t)return null;const n=t.totalTokens??0,s=t.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return s<=0?null:n/s}function c0(e){const t=l0(e);if(t===null)return p;const n=Math.round(t*100),s=n>=90?"danger":n>=70?"warn":"ok",i=e.sessions?.sessions?.find(l=>l.key===e.sessionKey),a=i?.totalTokens??0,o=i?.contextTokens??e.sessions?.defaults?.contextTokens??2e5,c=n>=90?"Soul + identity only":n>=70?"P0 + P1 active":"Full context",d=n>=90?r`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--danger">
          Schedule, tasks, skill cards trimmed
        </span>`:n>=70?r`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--warn">
            Meetings, cron, queue review trimmed
          </span>`:p,u=r`
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
  `}function d0(e){return e?e.active?r`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${H.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<r0?r`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${H.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `:p:p}function ar(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function u0(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy")}function h0(e,t){e.preventDefault(),e.stopPropagation(),t.classList.add("chat--drag-over")}function p0(e,t){e.preventDefault(),e.stopPropagation();const n=t.getBoundingClientRect();(e.clientX<=n.left||e.clientX>=n.right||e.clientY<=n.top||e.clientY>=n.bottom)&&t.classList.remove("chat--drag-over")}function f0(e,t){e.preventDefault(),e.stopPropagation(),e.currentTarget.classList.remove("chat--drag-over");const s=e.dataTransfer?.files;if(!s||s.length===0||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((l,h)=>l+(h.dataUrl?.length??0)*.75,0),{validFiles:o,errors:c}=ir(s,a);for(const l of c)t.showToast?.(l,"error");if(o.length===0)return;const d=[];let u=o.length;for(const l of o){const h=new FileReader;h.addEventListener("load",()=>{const f=h.result;d.push({id:ar(),dataUrl:f,mimeType:l.type||"application/octet-stream",fileName:l.name}),u--,u===0&&t.onAttachmentsChange?.([...i,...d])}),h.addEventListener("error",()=>{t.showToast?.(`Failed to read "${l.name}"`,"error"),u--,u===0&&d.length>0&&t.onAttachmentsChange?.([...i,...d])}),h.readAsDataURL(l)}}function g0(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let l=0;l<n.length;l++){const h=n[l];if(h.type.startsWith("image/")){const f=h.getAsFile();f&&s.push(f)}}if(s.length===0)return;e.preventDefault();const i=t.attachments??[],a=i.reduce((l,h)=>l+(h.dataUrl?.length??0)*.75,0),{validFiles:o,errors:c}=ir(s,a);for(const l of c)t.showToast?.(l,"error");if(o.length===0)return;const d=[];let u=o.length;for(const l of o){const h=new FileReader;h.addEventListener("load",()=>{const f=h.result;d.push({id:ar(),dataUrl:f,mimeType:l.type,fileName:l.name||"pasted-image"}),u--,u===0&&t.onAttachmentsChange?.([...i,...d])}),h.addEventListener("error",()=>{t.showToast?.("Failed to read pasted image","error"),u--,u===0&&d.length>0&&t.onAttachmentsChange?.([...i,...d])}),h.readAsDataURL(l)}}function m0(e,t){const n=e.target,s=n.files;if(!s||!t.onAttachmentsChange)return;const i=t.attachments??[],a=i.reduce((l,h)=>l+(h.dataUrl?.length??0)*.75,0),{validFiles:o,errors:c}=ir(s,a);for(const l of c)t.showToast?.(l,"error");if(o.length===0){n.value="";return}const d=[];let u=o.length;for(const l of o){const h=new FileReader;h.addEventListener("load",()=>{const f=h.result;d.push({id:ar(),dataUrl:f,mimeType:l.type||"application/octet-stream",fileName:l.name}),u--,u===0&&t.onAttachmentsChange?.([...i,...d])}),h.addEventListener("error",()=>{t.showToast?.(`Failed to read "${l.name}"`,"error"),u--,u===0&&d.length>0&&t.onAttachmentsChange?.([...i,...d])}),h.readAsDataURL(l)}n.value=""}function y0(e){const t=e.attachments??[];return t.length===0?p:r`
    <div class="chat-attachments">
      ${t.map(n=>{const s=n.mimeType.startsWith("image/"),i=n.fileName||"file",a=i.length>40?i.slice(0,37)+"...":i;return r`
          <div class="chat-attachment ${s?"":"chat-attachment--file"}">
            ${s?r`<img src=${n.dataUrl} alt="Attachment preview" class="chat-attachment__img" />`:r`<div class="chat-attachment__file">
                  ${H.fileText}
                  <span class="chat-attachment__filename" title=${i}>${a}</span>
                </div>`}
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const o=(e.attachments??[]).filter(c=>c.id!==n.id);e.onAttachmentsChange?.(o)}}
            >
              ${H.x}
            </button>
          </div>
        `})}
    </div>
  `}function v0(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function b0(e){const t=e.href;if(t){if(e.target==="_blank"){window.open(t,"_blank","noopener,noreferrer");return}window.location.assign(t)}}function w0(e){const t=e.trim();return!t||t.includes(`
`)?null:t.startsWith("/")||t.startsWith("~/")||t.startsWith("./")||t.startsWith("../")||/^[a-z]:[\\/]/i.test(t)||/^[^:\s]+\/[^\s]+$/.test(t)&&/\.[a-z0-9]{1,12}$/i.test(t)||/^[^\s/\\:*?"<>|]+\.[a-z0-9]{1,12}$/i.test(t)&&t.length<=100?t:null}async function k0(e,t){const n=e.target,s=n instanceof Element?n:n instanceof Node?n.parentElement:null;if(!s||!t.onMessageLinkClick||!v0(e))return;const i=s.closest("a");if(i instanceof HTMLAnchorElement){if(i.hasAttribute("download"))return;const d=i.getAttribute("href");if(!d)return;if(t.onOpenProof)try{const l=d.match(/(?:proofeditor\.ai|127\.0\.0\.1:\d+|localhost:\d+)\/d\/([a-zA-Z0-9_-]+)/);if(l){e.preventDefault(),t.onOpenProof(l[1]);return}}catch{}try{const l=new URL(d,window.location.href);if(/^https?:$/.test(l.protocol)&&l.origin!==window.location.origin){e.preventDefault(),window.open(l.href,"_blank","noopener,noreferrer");return}}catch{}e.preventDefault(),await t.onMessageLinkClick(d)||b0(i);return}const a=s.closest("code");if(!(a instanceof HTMLElement))return;const o=(a.textContent??"").trim();if(/^https?:\/\/\S+$/i.test(o)){e.preventDefault(),window.open(o,"_blank","noopener,noreferrer");return}if(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(\/\S*)?$/i.test(o)){e.preventDefault(),window.open(`https://${o}`,"_blank","noopener,noreferrer");return}const c=w0(o);c&&(e.preventDefault(),await t.onMessageLinkClick(c))}const $0={html_report:"📊",plan:"📋",analysis:"🔍",code:"💻",doc:"📝",data:"📦",image:"🖼️",script:"⚙️"};function S0(e){const t=e.sessionResources;if(!t||t.length===0)return p;if(e.sessionResourcesCollapsed)return r`
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
          ${t.length>5?r`<button class="session-resources-view-all" @click=${e.onViewAllResources}>View all</button>`:p}
          <button class="session-resources-toggle" @click=${e.onToggleSessionResources}>▼</button>
        </div>
      </div>
      <div class="session-resources-cards">
        ${n.map(s=>r`
            <button
              class="session-resource-chip"
              @click=${()=>e.onSessionResourceClick?.(s)}
            >
              <span>${$0[s.type]||"📄"}</span>
              <span>${s.title}</span>
            </button>
          `)}
      </div>
    </div>
  `}function x0(e){const t=e.connected,n=e.sending||e.stream!==null,s=!!(e.canAbort&&e.onAbort),a=e.sessions?.sessions?.find(v=>v.key===e.sessionKey)?.reasoningLevel??"off",o=e.showThinking&&a!=="off",c={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},d=(e.attachments?.length??0)>0,u=e.connected?d?"Add a message or paste more images...":"Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",l=e.splitRatio??.6,h=!!(e.sidebarOpen&&e.onCloseSidebar),f=r`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
      @click=${v=>{k0(v,e)}}
    >
      ${e.loading?r`
              <div class="muted">Loading chat…</div>
            `:p}
      ${Ei(C0(e),v=>v.key,v=>{try{if(v.kind==="reading-indicator")return hy(c,e.currentToolInfo);if(v.kind==="stream")return py(v.text,v.startedAt,e.onOpenSidebar,c,e.currentToolInfo);if(v.kind==="compaction-summary")return yy(v.message);if(v.kind==="group"){const b=e.resolveImageUrl?($,k)=>e.resolveImageUrl($,k):void 0;return fy(v,{onOpenSidebar:e.onOpenSidebar,onOpenFile:e.onOpenFile,onOpenProof:e.onOpenProof,onPushToDrive:e.onPushToDrive,onImageClick:e.onImageClick,resolveImageUrl:b,showReasoning:o,assistantName:e.assistantName,assistantAvatar:c.avatar,userName:e.userName,userAvatar:e.userAvatar})}return p}catch(b){return console.error("[chat] item render error:",b,v.key),p}})}
    </div>
  `;return r`
    <section 
      class="card chat"
      @dragover=${u0}
      @dragenter=${v=>h0(v,v.currentTarget)}
      @dragleave=${v=>p0(v,v.currentTarget)}
      @drop=${v=>f0(v,e)}
    >
      ${e.privateMode?r`<div class="callout callout--private" aria-live="polite">
            <span style="margin-right:6px">🔒</span>
            <strong>Private Session</strong> — Nothing from this conversation will be saved to memory or vault.
          </div>`:p}

      ${e.disabledReason?r`<div class="callout">${e.disabledReason}</div>`:p}

      ${e.error?r`<div class="callout danger">${e.error}</div>`:p}

      ${d0(e.compactionStatus)}

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
                    `:p}
              </div>
            </div>
          `:p}

      ${e.focusMode?r`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${H.x}
            </button>
          `:p}

      <div
        class="chat-split-container ${h?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${h?`0 0 ${l*100}%`:"1 1 100%"}"
          @click=${h?()=>e.onCloseSidebar?.():p}
        >
          ${f}
          ${e.showScrollButton?r`
                <button
                  class="chat-scroll-bottom"
                  type="button"
                  aria-label="Scroll to bottom"
                  title="Scroll to bottom"
                  @click=${()=>e.onScrollToBottom?.()}
                >
                  ${e.showNewMessages?r`<span class="chat-scroll-bottom__badge"></span>`:p}
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              `:p}
        </div>

        ${h?r`
              <resizable-divider
                .splitRatio=${l}
                @resize=${v=>e.onSplitRatioChange?.(v.detail.splitRatio)}
              ></resizable-divider>
              ${e.allyPanelOpen&&e.allyProps?r`
                    <div class="chat-sidebar chat-sidebar--split">
                      <div class="chat-sidebar-top">
                      ${Ga({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                    </div>
                    <resizable-divider
                      direction="vertical"
                      .splitRatio=${.6}
                      .minRatio=${.2}
                      .maxRatio=${.8}
                    ></resizable-divider>
                    <div class="chat-sidebar-bottom">
                      ${ik(e.allyProps)}
                    </div>
                  </div>
                `:r`
                  <div class="chat-sidebar">
                    ${Ga({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                  </div>
                `}
            `:p}
      </div>

      ${e.queue.length?r`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(v=>r`
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
                        ${H.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:p}

      ${S0(e)}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${v=>m0(v,e)}
          />
          ${y0(e)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${jk(v=>v&&Zl(v))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${v=>{if(v.key!=="Enter"||v.isComposing||v.keyCode===229||v.shiftKey||!e.connected)return;v.preventDefault();const b=v.ctrlKey||v.metaKey;t&&e.onSend(b)}}
              @input=${v=>{const b=v.target;Zl(b),e.onDraftChange(b.value)}}
              @paste=${v=>g0(v,e)}
              placeholder=${u}
            ></textarea>

            <div class="chat-compose__actions">
              ${c0(e)}

              <button
                class="chat-compose__toolbar-btn"
                type="button"
                title="Attach files"
                ?disabled=${!e.connected}
                @click=${()=>{document.getElementById("chat-file-input")?.click()}}
              >
                ${H.paperclip}
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
                    ${H.arrowUp}
                  </button>
                `}
            </div>
          </div>
        </div>
      </div>
    </section>
  `}const ec=200;function _0(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const i=_o(s.message),a=wi(i.role),o=i.timestamp||Date.now();!n||n.role!==a?(n&&t.push(n),n={kind:"group",key:`group:${a}:${s.key}`,role:a,messages:[{message:s.message,key:s.key}],timestamp:o,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function A0(e){const n=e.content;if(!Array.isArray(n))return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const i=s;if(i.type==="image")return!0;if(Array.isArray(i.content)){for(const a of i.content)if(!(typeof a!="object"||a===null)&&a.type==="image")return!0}}return!1}function T0(e){const n=e.content;if(!Array.isArray(n)||n.length===0)return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const i=s,a=typeof i.type=="string"?i.type:"";if(a!=="toolCall"&&a!=="tool_use"&&a!=="thinking")return!1}return!0}function C0(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],i=Math.max(0,n.length-ec);i>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${ec} messages (${i} hidden).`,timestamp:Date.now()}});for(let a=i;a<n.length;a++){const o=n[a];if(o._chatIdx=a,vy(o)){t.push({kind:"compaction-summary",key:`compaction:${a}`,message:o});continue}if(Gk(o))continue;const c=_o(o);!e.showThinking&&c.role.toLowerCase()==="toolresult"&&!A0(o)||!e.showThinking&&c.role.toLowerCase()==="assistant"&&T0(o)||t.push({kind:"message",key:tc(o,a),message:o})}if(e.showThinking)for(let a=0;a<s.length;a++)t.push({kind:"message",key:tc(s[a],a+n.length),message:s[a]});if(e.stream!==null){const a=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:a,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:a})}else if(e.isWorking){const a=`working:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}else if(e.sending||e.canAbort){const a=`sending:${e.sessionKey}`;t.push({kind:"reading-indicator",key:a})}return _0(t)}function tc(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const i=typeof n.id=="string"?n.id:"";if(i)return`msg:${i}`;const a=typeof n.messageId=="string"?n.messageId:"";if(a)return`msg:${a}`;const o=typeof n.timestamp=="number"?n.timestamp:null,c=typeof n.role=="string"?n.role:"unknown";if(o!=null){const d=typeof n.content=="string"?n.content.slice(0,32):"";return`msg:${c}:${o}:${d||t}`}return`msg:${c}:${t}`}function E0(e,t=128){return new Promise((n,s)=>{const i=new Image;i.addEventListener("load",()=>{const a=document.createElement("canvas");a.width=t,a.height=t;const o=a.getContext("2d");if(!o){s(new Error("Could not get canvas context"));return}const c=Math.min(i.width,i.height),d=(i.width-c)/2,u=(i.height-c)/2;o.drawImage(i,d,u,c,c,0,0,t,t),n(a.toDataURL("image/png"))}),i.addEventListener("error",()=>s(new Error("Failed to load image"))),i.src=URL.createObjectURL(e)})}let fn="",Gn=null,Ft=null,nc=!1,pt=!1;function R0(e){nc||(fn=e.userName||"",Gn=e.userAvatar||null,Ft=e.userAvatar||null,nc=!0,pt=!1)}function L0(e){R0(e);const t=d=>{fn=d.target.value,pt=!0},n=async d=>{const l=d.target.files?.[0];if(l){if(!l.type.startsWith("image/")){alert("Please select an image file");return}if(l.size>5*1024*1024){alert("Image must be less than 5MB");return}try{const h=await E0(l,128);Gn=h,Ft=h,pt=!0,document.dispatchEvent(new CustomEvent("user-settings-updated"))}catch(h){console.error("Failed to process image:",h),alert("Failed to process image")}}},s=()=>{Gn=null,Ft=null,pt=!0;const d=document.getElementById("user-avatar-input");d&&(d.value=""),document.dispatchEvent(new CustomEvent("user-settings-updated"))},i=()=>{e.onUpdate(fn,Gn||""),pt=!1;const d=document.querySelector(".user-settings__save");d&&(d.textContent="Saved!",setTimeout(()=>{d.textContent="Save"},1500))},a=()=>{fn=e.userName||"",Gn=e.userAvatar||null,Ft=e.userAvatar||null,pt=!1,document.dispatchEvent(new CustomEvent("user-settings-updated"))},o=fn||"You",c=Ft?r`<img src="${Ft}" alt="${o}" class="user-settings__avatar-img" />`:r`<span class="user-settings__avatar-initial">${o.charAt(0).toUpperCase()}</span>`;return r`
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
                  ${Ft?r`
                        <button
                          type="button"
                          class="user-settings__btn user-settings__btn--clear"
                          @click=${s}
                        >
                          Remove
                        </button>
                      `:p}
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
                .value=${fn}
                @input=${t}
                placeholder="Your name"
                maxlength="50"
              />
              <span class="user-settings__hint">This name appears on your chat messages</span>
            </div>

            <!-- Actions -->
            <div class="user-settings__actions">
              ${pt?r`
                    <button
                      type="button"
                      class="user-settings__btn user-settings__btn--cancel"
                      @click=${a}
                    >
                      Cancel
                    </button>
                  `:p}
              <button
                type="button"
                class="user-settings__btn user-settings__btn--save user-settings__save"
                ?disabled=${!pt}
                @click=${i}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `}const Qa={all:r`
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
  `},ma=[{key:"model",label:"AI Model"},{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"},{key:"user",label:"User"}],sc=new Set(["user","model"]),ic="__all__";function ac(e){return Qa[e]??Qa.default}function P0(e,t){const n=sr[e];return n||{label:t?.title??lt(e),description:t?.description??""}}function D0(e){const{key:t,schema:n,uiHints:s}=e;if(!n||Ve(n)!=="object"||!n.properties)return[];const i=Object.entries(n.properties).map(([a,o])=>{const c=Ce([t,a],s),d=c?.label??o.title??lt(a),u=c?.help??o.description??"",l=c?.order??50;return{key:a,label:d,description:u,order:l}});return i.sort((a,o)=>a.order!==o.order?a.order-o.order:a.key.localeCompare(o.key)),i}function I0(e,t){if(!e||!t)return[];const n=[];function s(i,a,o){if(i===a)return;if(typeof i!=typeof a){n.push({path:o,from:i,to:a});return}if(typeof i!="object"||i===null||a===null){i!==a&&n.push({path:o,from:i,to:a});return}if(Array.isArray(i)&&Array.isArray(a)){JSON.stringify(i)!==JSON.stringify(a)&&n.push({path:o,from:i,to:a});return}const c=i,d=a,u=new Set([...Object.keys(c),...Object.keys(d)]);for(const l of u)s(c[l],d[l],o?`${o}.${l}`:l)}return s(e,t,""),n}function oc(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}const rc={anthropic:"#d97706",openai:"#10b981","openai-codex":"#10b981",xai:"#6366f1"};function M0(e){const t=[],n=e.models,s=e.agents,i=n?.providers;if(i&&typeof i=="object")for(const[o,c]of Object.entries(i)){const d=c;for(const u of d.models??[])t.push({id:`${o}/${u.id}`,name:u.name??u.id,provider:o,providerLabel:o.charAt(0).toUpperCase()+o.slice(1),reasoning:u.reasoning??!1,contextWindow:u.contextWindow??0})}const a=s?.defaults?.models;if(a&&typeof a=="object")for(const o of Object.keys(a)){if(t.some(d=>d.id===o))continue;const c=o.split("/");t.push({id:o,name:c.slice(1).join("/"),provider:c[0]??"unknown",providerLabel:(c[0]??"unknown").replace(/-/g," ").replace(/\b\w/g,d=>d.toUpperCase()),reasoning:!1,contextWindow:0})}return t}function O0(e){return e.startsWith("anthropic/")?["openai-codex/gpt-5.3-codex"]:["anthropic/claude-sonnet-4-6"]}function B0(e){const t=e.formValue;if(!t)return r`<div class="config-loading"><span>Loading config...</span></div>`;const n=t.agents,s=n?.defaults?.model?.primary??"",i=n?.defaults?.model?.fallbacks??[],a=M0(t),o=new Map;for(const d of a){const u=o.get(d.provider)??[];u.push(d),o.set(d.provider,u)}const c=e.saving||e.applying;return r`
    <div class="model-picker">
      <div class="model-picker__current">
        <div class="model-picker__current-label">Active Model</div>
        <div class="model-picker__current-value">${s||"Not set"}</div>
        ${i.length>0?r`<div class="model-picker__fallback">Fallback: ${i.join(", ")}</div>`:p}
      </div>

      ${c?r`<div class="model-picker__status">Switching model...</div>`:p}

      ${Array.from(o.entries()).map(([d,u])=>r`
          <div class="model-picker__group">
            <div class="model-picker__group-label">
              <span class="model-picker__group-dot" style="background: ${rc[d]??"var(--accent)"}"></span>
              ${u[0]?.providerLabel??d}
            </div>
            <div class="model-picker__cards">
              ${u.map(l=>{const h=l.id===s,f=rc[l.provider]??"var(--accent)";return r`
                  <button
                    class="model-card ${h?"model-card--active":""}"
                    style="--model-accent: ${f}"
                    ?disabled=${c}
                    @click=${()=>{h||!e.onModelSwitch||e.onModelSwitch(l.id,O0(l.id))}}
                  >
                    <div class="model-card__body">
                      <div class="model-card__name">${l.name||l.id}</div>
                      ${l.reasoning?r`<span class="model-card__tag">reasoning</span>`:p}
                      ${l.contextWindow>0?r`<span class="model-card__ctx">${Math.round(l.contextWindow/1e3)}k ctx</span>`:p}
                    </div>
                    ${h?r`<span class="model-card__check">Active</span>`:p}
                  </button>
                `})}
            </div>
          </div>
        `)}
    </div>
  `}function F0(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=ph(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,i=n.schema?.properties??{},a=ma.filter(A=>A.key in i&&!sc.has(A.key)),o=new Set(ma.map(A=>A.key)),c=Object.keys(i).filter(A=>!o.has(A)).map(A=>({key:A,label:A.charAt(0).toUpperCase()+A.slice(1)})),d=ma.filter(A=>sc.has(A.key)),u=[...a,...c,...d],l=e.activeSection&&n.schema&&Ve(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,h=e.activeSection?P0(e.activeSection,l):null,f=e.activeSection?D0({key:e.activeSection,schema:l,uiHints:e.uiHints}):[],v=e.formMode==="form"&&!!e.activeSection&&f.length>0,b=e.activeSubsection===ic,$=e.searchQuery||b?null:e.activeSubsection??f[0]?.key??null,k=e.formMode==="form"?I0(e.originalValue,e.formValue):[],S=e.formMode==="raw"&&e.raw!==e.originalRaw,_=e.formMode==="form"?k.length>0:S,L=!!e.formValue&&!e.loading&&!!n.schema,E=e.connected&&!e.saving&&_&&(e.formMode==="raw"?!0:L),x=e.connected&&!e.applying&&!e.updating&&_&&(e.formMode==="raw"?!0:L),T=e.connected&&!e.applying&&!e.updating;return r`
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
            @input=${A=>e.onSearchChange(A.target.value)}
          />
          ${e.searchQuery?r`
            <button
              class="config-search__clear"
              @click=${()=>e.onSearchChange("")}
            >×</button>
          `:p}
        </div>

        <!-- Section nav -->
        <nav class="config-nav">
          <button
            class="config-nav__item ${e.activeSection===null?"active":""}"
            @click=${()=>e.onSectionChange(null)}
          >
            <span class="config-nav__icon">${Qa.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${u.map(A=>r`
            <button
              class="config-nav__item ${e.activeSection===A.key?"active":""}"
              @click=${()=>e.onSectionChange(A.key)}
            >
              <span class="config-nav__icon">${ac(A.key)}</span>
              <span class="config-nav__label">${A.label}</span>
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
            ${_?r`
              <span class="config-changes-badge">${e.formMode==="raw"?"Unsaved changes":`${k.length} unsaved change${k.length!==1?"s":""}`}</span>
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
              ?disabled=${!E}
              @click=${e.onSave}
            >
              ${e.saving?"Saving…":"Save"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!x}
              @click=${e.onApply}
            >
              ${e.applying?"Applying…":"Apply"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!T}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${_&&e.formMode==="form"?r`
          <details class="config-diff">
            <summary class="config-diff__summary">
              <span>View ${k.length} pending change${k.length!==1?"s":""}</span>
              <svg class="config-diff__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${k.map(A=>r`
                <div class="config-diff__item">
                  <div class="config-diff__path">${A.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${oc(A.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${oc(A.to)}</span>
                  </div>
                </div>
              `)}
            </div>
          </details>
        `:p}

        ${h&&e.formMode==="form"?r`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${ac(e.activeSection??"")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${h.label}</div>
                  ${h.description?r`<div class="config-section-hero__desc">${h.description}</div>`:p}
                </div>
              </div>
            `:p}

        ${v?r`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${$===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(ic)}
                >
                  All
                </button>
                ${f.map(A=>r`
                    <button
                      class="config-subnav__item ${$===A.key?"active":""}"
                      title=${A.description||A.label}
                      @click=${()=>e.onSubsectionChange(A.key)}
                    >
                      ${A.label}
                    </button>
                  `)}
              </div>
            `:p}

        <!-- Form content -->
        <div class="config-content">
          ${e.activeSection==="model"?B0(e):e.activeSection==="user"?L0({userName:e.userName,userAvatar:e.userAvatar,onUpdate:e.onUserProfileUpdate}):e.formMode==="form"?r`
                  ${e.schemaLoading?r`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `:pk({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:$})}
                  ${s?r`
                          <div class="callout danger" style="margin-top: 12px">
                            Form view can't safely edit some fields. Use Raw to avoid losing config entries.
                          </div>
                        `:p}
                `:r`
                  <label class="field config-raw-field">
                    <span>Raw JSON5</span>
                    <textarea
                      .value=${e.raw}
                      @input=${A=>e.onRawChange(A.target.value)}
                    ></textarea>
                  </label>
                `}
        </div>

        ${e.issues.length>0?r`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:p}
      </main>
    </div>
  `}function N0(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",i=e.version??"";return`${t} ${n} ${s} ${i}`.trim()}function U0(e){const t=e.ts??null;return t?N(t):"n/a"}function z0(e){return e?`${rs(e)} (${N(e)})`:"n/a"}function K0(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function q0(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function W0(e){const t=e.state??{},n=t.nextRunAtMs?rs(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?rs(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function j0(e){const t=e.schedule;return t.kind==="at"?`At ${rs(t.atMs)}`:t.kind==="every"?`Every ${Gc(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function H0(e){const t=e.payload;return t.kind==="systemEvent"?`System: ${t.text}`:`Agent: ${t.message}`}function V0(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.channel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(i=>s.has(i)?!1:(s.add(i),!0))}function G0(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function Q0(e){const t=V0(e);return r`
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
            <div class="stat-value">${z0(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
          ${e.error?r`<span class="muted">${e.error}</span>`:p}
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
        ${Y0(e)}
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
                            ${G0(e,n)}
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
                    `:p}
              </div>
            `:p}
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
              ${e.jobs.map(n=>J0(n,e))}
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
                ${e.runs.map(n=>X0(n))}
              </div>
            `}
    </section>
  `}function Y0(e){const t=e.form;return t.scheduleKind==="at"?r`
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
  `}function J0(e,t){const s=`list-item list-item-clickable${t.runsJobId===e.id?" list-item-selected":""}`;return r`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${j0(e)}</div>
        <div class="muted">${H0(e)}</div>
        ${e.agentId?r`<div class="muted">Agent: ${e.agentId}</div>`:p}
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.enabled?"enabled":"disabled"}</span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
      </div>
      <div class="list-meta">
        <div>${W0(e)}</div>
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
  `}function X0(e){return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${rs(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?r`<div class="muted">${e.error}</div>`:p}
      </div>
    </div>
  `}function Z0(e){const n=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=n?.critical??0,i=n?.warn??0,a=n?.info??0,o=s>0?"danger":i>0?"warn":"success",c=s>0?`${s} critical`:i>0?`${i} warnings`:"No critical issues";return r`
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
                </div>`:p}
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
            </div>`:p}
        ${e.callResult?r`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:p}
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
                      <pre class="code-block">${q0(d.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function e$(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function Pt(e,t){return t?r`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:p}function t$(e){const t=e.execApprovalQueue[0];if(!t)return p;const n=t.request,s=t.expiresAtMs-Date.now(),i=s>0?`expires in ${e$(s)}`:"expired",a=e.execApprovalQueue.length;return r`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
          ${a>1?r`<div class="exec-approval-queue">${a} pending</div>`:p}
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
        ${e.execApprovalError?r`<div class="exec-approval-error">${e.execApprovalError}</div>`:p}
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
  `}function n$(e){const{pendingGatewayUrl:t}=e;return t?r`
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
  `:p}function s$(e){if(!e.gatewayRestartPending)return p;const t=e.sessionsResult?.sessions?.length??0,n=t===1?"1 active session":`${t} active sessions`;return r`
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
  `}function i$(e){return r`
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
          </div>`:p}
      ${e.statusMessage?r`<div class="callout" style="margin-top: 12px;">
            ${e.statusMessage}
          </div>`:p}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?r`
                <div class="muted">No instances reported yet.</div>
              `:e.entries.map(t=>a$(t))}
      </div>
    </section>
  `}function a$(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],i=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],a=i.length>0?i.length>3?`${i.length} scopes`:`scopes: ${i.join(", ")}`:null;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${N0(e)}</div>
        <div class="chip-row">
          <span class="chip">${n}</span>
          ${s.map(o=>r`<span class="chip">${o}</span>`)}
          ${a?r`<span class="chip">${a}</span>`:p}
          ${e.platform?r`<span class="chip">${e.platform}</span>`:p}
          ${e.deviceFamily?r`<span class="chip">${e.deviceFamily}</span>`:p}
          ${e.modelIdentifier?r`<span class="chip">${e.modelIdentifier}</span>`:p}
          ${e.version?r`<span class="chip">${e.version}</span>`:p}
        </div>
      </div>
      <div class="list-meta">
        <div>${U0(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}const lc=["trace","debug","info","warn","error","fatal"];function o$(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function r$(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function l$(e){const t=e.filterText.trim().toLowerCase(),n=lc.some(a=>!e.levelFilters[a]),s=e.entries.filter(a=>a.level&&!e.levelFilters[a.level]?!1:r$(a,t)),i=t||n?"filtered":"visible";return r`
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
        ${lc.map(a=>r`
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

      ${e.file?r`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:p}
      ${e.truncated?r`
              <div class="callout" style="margin-top: 10px">Log output truncated; showing latest chunk.</div>
            `:p}
      ${e.error?r`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:p}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${s.length===0?r`
                <div class="muted" style="padding: 12px">No log entries.</div>
              `:s.map(a=>r`
                <div class="log-row">
                  <div class="log-time mono">${o$(a.time)}</div>
                  <div class="log-level ${a.level??""}">${a.level??""}</div>
                  <div class="log-subsystem mono">${a.subsystem??""}</div>
                  <div class="log-message mono">${a.message??a.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}const c$=/(^~\/|^\/|^\.\.?\/|[\\/])/;function cc(e){const t=e.trim();if(!t)return null;const n=t.replace(/^["']|["']$/g,"").trim();return!n||/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/[*?<>|]/.test(n)||n.includes("\0")||n.includes(`
`)||n.includes("\r")||!c$.test(n)&&!/\.[a-z0-9]{1,12}$/i.test(n)?null:n}function d$(e){const t=e instanceof Element?e:e instanceof Node?e.parentElement:null;if(!t)return null;const n=t.closest("a");if(n){const i=n.getAttribute("href")??"";let a=i;if(i.includes("%"))try{a=decodeURIComponent(i)}catch{a=i}return cc(a)}const s=t.closest("code");return!s||s.closest("pre")?null:cc(s.textContent??"")}function u$(e){const n=new DOMParser().parseFromString(`<div>${e}</div>`,"text/html").body.firstElementChild;if(!n)return"";const i=We(n,{listDepth:0,orderedIndex:[]});return p$(i)}function Ya(e,t){if(e.nodeType===Node.TEXT_NODE)return e.textContent??"";if(e.nodeType!==Node.ELEMENT_NODE)return"";const n=e;switch(n.tagName.toLowerCase()){case"h1":return`# ${nt(n,t)}

`;case"h2":return`## ${nt(n,t)}

`;case"h3":return`### ${nt(n,t)}

`;case"h4":return`#### ${nt(n,t)}

`;case"h5":return`##### ${nt(n,t)}

`;case"h6":return`###### ${nt(n,t)}

`;case"p":return`${We(n,t)}

`;case"br":return`
`;case"hr":return`---

`;case"strong":case"b":return`**${We(n,t)}**`;case"em":case"i":return`*${We(n,t)}*`;case"del":return`~~${We(n,t)}~~`;case"a":{const i=n.getAttribute("href")??"",a=We(n,t);return!i||i===a?a:`[${a}](${i})`}case"code":return n.parentElement?.tagName.toLowerCase()==="pre"?n.textContent??"":`\`${n.textContent??""}\``;case"pre":{const i=n.querySelector("code"),a=i?i.textContent??"":n.textContent??"",o=i?.className.match(/language-(\S+)/);return`\`\`\`${o?o[1]:""}
${a}
\`\`\`

`}case"blockquote":return We(n,t).trim().split(`
`).map(o=>`> ${o}`).join(`
`)+`

`;case"ul":return dc(n,t,!1);case"ol":return dc(n,t,!0);case"li":return bh(n,t);case"input":return n.getAttribute("type")==="checkbox"?n.checked?"[x]":"[ ]":"";case"table":return h$(n,t);case"div":case"span":case"section":case"article":case"main":case"header":case"footer":case"nav":case"aside":case"figure":case"figcaption":case"details":case"summary":return We(n,t);default:return We(n,t)}}function We(e,t){let n="";for(const s of Array.from(e.childNodes))n+=Ya(s,t);return n}function nt(e,t){return We(e,t).replace(/\n+/g," ").trim()}function dc(e,t,n){const s=Array.from(e.children).filter(o=>o.tagName.toLowerCase()==="li"),i="  ".repeat(t.listDepth);let a="";for(let o=0;o<s.length;o++){const c=s[o],d={listDepth:t.listDepth+1,orderedIndex:[...t.orderedIndex,o+1]},u=n?`${o+1}. `:"- ",l=bh(c,d);a+=`${i}${u}${l}
`}return t.listDepth===0&&(a+=`
`),a}function bh(e,t){let n="";for(const s of Array.from(e.childNodes)){const i=s.tagName?.toLowerCase();i==="ul"||i==="ol"?n+=`
`+Ya(s,t):n+=Ya(s,t)}return n.trim()}function h$(e,t){const n=[],s=e.querySelector("thead tr"),i=e.querySelectorAll("tbody tr");if(s){const u=Array.from(s.querySelectorAll("th, td")).map(l=>nt(l,t));n.push(u)}for(const u of Array.from(i)){const l=Array.from(u.querySelectorAll("td, th")).map(h=>nt(h,t));n.push(l)}if(n.length===0){const u=e.querySelectorAll("tr");for(const l of Array.from(u)){const h=Array.from(l.querySelectorAll("td, th")).map(f=>nt(f,t));n.push(h)}}if(n.length===0)return"";const a=Math.max(...n.map(u=>u.length)),o=[];for(let u=0;u<a;u++)o[u]=Math.max(3,...n.map(l=>(l[u]??"").length));let c="";const d=u=>`| ${o.map((h,f)=>(u[f]??"").padEnd(h)).join(" | ")} |`;c+=d(n[0])+`
`,c+=`| ${o.map(u=>"-".repeat(u)).join(" | ")} |
`;for(let u=1;u<n.length;u++)c+=d(n[u])+`
`;return c+`
`}function p$(e){let t=e;return t=t.replace(/\u00a0/g," "),t=t.replace(/\n{3,}/g,`

`),t=t.trim(),t&&!t.endsWith(`
`)&&(t+=`
`),t}function f$(e){return e.includes(`
`)&&e.indexOf(`
`)<e.length-1?e:e.replace(/\\n/g,`
`)}function g$(e){const t=new Date(e),s=new Date().getTime()-t.getTime(),i=Math.floor(s/(1e3*60));if(i<1)return"Just now";if(i<60)return`${i}m ago`;const a=Math.floor(i/60);return a<24?`${a}h ago`:t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}function m$(e){const t="VAULT",n=encodeURIComponent(`01-Daily/${e}`);return`obsidian://open?vault=${t}&file=${n}`}let ts=null,xn=null;function uc(e,t,n=1500){ts&&clearTimeout(ts),ts=setTimeout(()=>{e!==xn&&(xn=e,t(e))},n)}function y$(e,t){ts&&clearTimeout(ts),e!==xn&&(xn=e,t(e))}function ya(e){for(const t of e.querySelectorAll('input[type="checkbox"]')){const n=t;n.checked?n.setAttribute("checked",""):n.removeAttribute("checked")}return u$(e.innerHTML)}function v$(e){const{data:t,loading:n,error:s,onRefresh:i,onGenerate:a,onOpenInObsidian:o,onSaveBrief:c,onToggleCheckbox:d,onOpenFile:u}=e;if(n)return r`
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
            ${i?r`<button class="retry-button" @click=${i}>Retry</button>`:p}
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
            ${a?r`<button class="brief-generate-btn" @click=${a}>Generate Brief Now</button>`:i?r`<button class="brief-generate-btn" @click=${i}>Generate Brief Now</button>`:p}
            <span class="empty-hint" style="margin-top: 8px; font-size: 12px;">Briefs auto-generate at 5:00 AM when configured.</span>
          </div>
        </div>
      </div>
    `;xn===null&&(xn=t.content);const l=k=>{const S=k.currentTarget;if(c){const _=ya(S);uc(_,c)}},h=k=>{if((k.ctrlKey||k.metaKey)&&k.key==="s"){k.preventDefault();const S=k.currentTarget;if(c){const _=ya(S);y$(_,c)}}if((k.ctrlKey||k.metaKey)&&k.key==="l"){k.preventDefault();const S=window.getSelection();if(!S||S.rangeCount===0)return;const _=S.focusNode,L=_ instanceof HTMLElement?_.closest("li"):_?.parentElement?.closest("li");if(L){const E=L.querySelector('input[type="checkbox"]');if(E)E.nextSibling?.nodeType===Node.TEXT_NODE&&E.nextSibling.textContent===" "&&E.nextSibling.remove(),E.remove();else{const T=document.createElement("input");T.type="checkbox",L.insertBefore(document.createTextNode(" "),L.firstChild),L.insertBefore(T,L.firstChild)}const x=k.currentTarget;if(c){const T=ya(x);uc(T,c)}}}if(k.key==="Enter"&&!k.shiftKey){const S=window.getSelection();if(!S||S.rangeCount===0)return;const _=S.focusNode,L=_ instanceof HTMLElement?_.closest("li"):_?.parentElement?.closest("li");L&&L.querySelector('input[type="checkbox"]')&&setTimeout(()=>{const E=window.getSelection();if(!E||E.rangeCount===0)return;const x=E.focusNode,T=x instanceof HTMLElement?x.closest("li"):x?.parentElement?.closest("li");if(T&&T!==L&&!T.querySelector('input[type="checkbox"]')){const A=document.createElement("input");A.type="checkbox",T.insertBefore(A,T.firstChild),T.insertBefore(document.createTextNode(" "),A.nextSibling);const F=document.createRange();F.setStartAfter(A.nextSibling),F.collapse(!0),E.removeAllRanges(),E.addRange(F)}},0)}},f=k=>{const S=k.target;if(S.tagName==="INPUT"&&S.getAttribute("type")==="checkbox"){const E=S,x=k.currentTarget;if(d&&x){const A=Array.from(x.querySelectorAll('input[type="checkbox"]')).indexOf(E);A>=0&&d(A,E.checked)}return}const _=d$(k.target);if(_&&u){k.preventDefault(),u(_);return}const L=S.closest?.("a")??S.parentElement?.closest("a");if(L){const E=L.getAttribute("href")??"";/^https?:\/\//i.test(E)&&(k.preventDefault(),window.open(E,"_blank","noopener,noreferrer"))}},v=Xg(f$(t.content)),b=t.summary.readiness!=null?r`<span class="brief-readiness" title="Readiness Score${t.summary.readinessMode?` — ${t.summary.readinessMode}`:""}">
        <span class="readiness-score">${t.summary.readiness}</span>
        <span class="readiness-label">Readiness</span>
      </span>`:p,$=t.summary.tasks.total>0?r`<span class="brief-task-progress" title="${t.summary.tasks.completed}/${t.summary.tasks.total} tasks done">
        ${t.summary.tasks.completed}/${t.summary.tasks.total}
      </span>`:p;return r`
    <div class="my-day-card brief-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83D\uDCCA</span>
          <span>DAILY BRIEF</span>
          ${b}
          ${$}
        </div>
        <div class="brief-header-actions">
          <span class="brief-updated">${g$(t.updatedAt)}</span>
          ${o?r`
                <a
                  href="${m$(t.date)}"
                  class="brief-obsidian-link"
                  title="Open in Obsidian"
                  @click=${k=>{k.preventDefault(),o()}}
                >
                  <span class="obsidian-icon">\uD83D\uDCD3</span>
                </a>
              `:p}
          ${i?r`
                <button class="brief-refresh-btn" @click=${i} title="Refresh">
                  \uD83D\uDD04
                </button>
              `:p}
        </div>
      </div>

      <div class="my-day-card-content">
        <div class="brief-content brief-content--live">
          <div
            class="brief-rendered brief-editable"
            contenteditable="true"
            spellcheck="false"
            @input=${l}
            @keydown=${h}
            @click=${f}
          >${at(v)}</div>
        </div>
      </div>
    </div>
  `}function wh(e){const t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}function b$(e){return e.source.persona?e.source.persona.replace(/-/g," ").replace(/\b\w/g,t=>t.toUpperCase()):e.source.skill?e.source.skill:e.type==="agent-execution"?"Agent":"Skill"}function w$(e){return e<=2?"Poor":e<=4?"Below expectations":e<=6?"Okay":e<=8?"Good":"Excellent"}function kh(e,t){if(e.scoringId!==t.id)return p;const n=e.scoringValue??7,s=e.feedbackText??"",i=n<=4,a=n<=4||n>=9;return r`
    <div class="inbox-scoring">
      <div class="inbox-score-label">
        Rate this output
        <span class="inbox-score-value ${n<=4?"low":n>=9?"high":""}">${n}/10 — ${w$(n)}</span>
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
          `:p}
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
  `}function k$(e,t){const n=t.deliverables??[];return r`
    <div class="inbox-card inbox-card--project">
      <div class="inbox-card-header">
        <span class="inbox-card-source">Project Complete</span>
        <span class="inbox-card-time">${wh(t.createdAt)}</span>
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
                      ${s.proofDocSlug?r`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View</button>`:p}
                    </div>
                  `)}
              </div>
            `:p}
      </div>
      <div class="inbox-card-actions">
        <button class="btn btn--sm primary" @click=${()=>e.onOpenChat(t.id)}>Review in Chat</button>
        ${t.proofDocSlug?r`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View Deliverables</button>`:p}
        <button class="btn btn--sm" @click=${()=>e.onSetScoring(t.id,7)}>Score</button>
        <button class="btn btn--sm" @click=${()=>e.onDismiss(t.id)}>Dismiss</button>
      </div>
      ${kh(e,t)}
    </div>
  `}function $$(e,t){if(t.type==="project-completion")return k$(e,t);const n=!!(t.sessionId||t.source.taskId||t.source.queueItemId);return r`
    <div class="inbox-card">
      <div class="inbox-card-header">
        <span class="inbox-card-source">${b$(t)}</span>
        <span class="inbox-card-time">${wh(t.createdAt)}</span>
      </div>
      <div class="inbox-card-body">
        <div class="inbox-card-title">${t.title}</div>
        <div class="inbox-card-summary">${t.summary.slice(0,220)}${t.summary.length>220?"…":""}</div>
      </div>
      <div class="inbox-card-actions">
        ${t.outputPath?r`<button class="btn btn--sm" @click=${()=>e.onViewOutput(t.id)}>View Output</button>`:p}
        ${t.proofDocSlug?r`<button class="btn btn--sm" @click=${()=>e.onViewProof(t.id)}>Proof</button>`:p}
        ${n?r`<button class="btn btn--sm" @click=${()=>e.onOpenChat(t.id)}>Open Chat</button>`:p}
        <button class="btn btn--sm primary" @click=${()=>e.onSetScoring(t.id,7)}>Complete</button>
        <button class="btn btn--sm" @click=${()=>e.onDismiss(t.id)}>Dismiss</button>
      </div>
      ${kh(e,t)}
    </div>
  `}function S$(e){const t=e.sortOrder??"newest",n=e.items.filter(i=>i.status==="pending").sort((i,a)=>{const o=new Date(a.createdAt).getTime()-new Date(i.createdAt).getTime();return t==="oldest"?-o:o}),s=e.count??n.length;return e.loading?r`<div class="inbox-loading">Loading inbox…</div>`:s===0?r`
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
          ${n.map(i=>$$(e,i))}
        </div>
      </div>
    </div>
  `}function $h(e){return!Number.isFinite(e)||e<=0?"0 B":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function or(e){switch(e){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function hc(e){return e==="running"?"ws-session-dot ws-session-dot--running":e==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function Sh(e){return`ws-task-priority ws-task-priority--${e}`}function xh(e){return e==="high"?"High":e==="low"?"Low":"Med"}function _h(e){if(!e)return"";const t=X();return e===t?"Today":e<t?`Overdue (${e})`:e}function Ah(e){if(!e)return"ws-task-due";const t=X();return e<t?"ws-task-due ws-task-due--overdue":e===t?"ws-task-due ws-task-due--today":"ws-task-due"}function di(e,t="due"){const n={high:0,medium:1,low:2};return[...e].sort((s,i)=>{if(t==="priority"){const a=n[s.priority]-n[i.priority];return a!==0?a:s.dueDate&&i.dueDate?s.dueDate.localeCompare(i.dueDate):s.dueDate&&!i.dueDate?-1:!s.dueDate&&i.dueDate?1:0}if(t==="newest")return(i.createdAt||"").localeCompare(s.createdAt||"");if(s.dueDate&&i.dueDate){const a=s.dueDate.localeCompare(i.dueDate);if(a!==0)return a}else{if(s.dueDate&&!i.dueDate)return-1;if(!s.dueDate&&i.dueDate)return 1}return n[s.priority]-n[i.priority]})}function pc(e,t,n,s,i,a,o){const c=e.status==="complete";return s===e.id?r`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${u=>{u.preventDefault();const l=u.currentTarget,h=l.querySelector(".ws-task-edit-input"),f=l.querySelector(".ws-task-date-input"),v=h.value.trim();v&&(a?.(e.id,{title:v,dueDate:f.value||null}),i?.(null))}}
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
      ${e.briefSection?r`<span class="ws-task-section">${e.briefSection}</span>`:p}
      <span class=${Sh(e.priority)}>${xh(e.priority)}</span>
      ${e.dueDate?r`<span class=${Ah(e.dueDate)}>${_h(e.dueDate)}</span>`:p}
      ${!c&&e.queueStatus?.status==="processing"?r`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!c&&e.queueStatus?.status==="review"&&n?r`<button
              class="ws-task-start-btn ws-task-start-btn--review"
              @click=${()=>n(e.id)}
              title="Review agent output"
            >Review</button>`:e.queueStatus?.status==="done"?r`
                ${p}
                ${n?r`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>n(e.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:p}
              `:!c&&n?r`<button
                  class="ws-task-start-btn"
                  @click=${()=>n(e.id)}
                  title="Start working on this task"
                >Start</button>`:p}
    </div>
  `}function Ja(e,t,n,s,i,a,o){const c=e.status==="complete";return s===e.id?r`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${u=>{u.preventDefault();const l=u.currentTarget,h=l.querySelector(".ws-task-edit-input"),f=l.querySelector(".ws-task-date-input"),v=h.value.trim();v&&(a?.(e.id,{title:v,dueDate:f.value||null}),i?.(null))}}
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
      ${e.project?r`<span class="ws-task-project">${e.project}</span>`:p}
      ${e.briefSection?r`<span class="ws-task-section">${e.briefSection}</span>`:p}
      <span class=${Sh(e.priority)}>${xh(e.priority)}</span>
      ${e.dueDate?r`<span class=${Ah(e.dueDate)}>${_h(e.dueDate)}</span>`:p}
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
                    >View Output</button>`:p}
                ${n?r`<button
                      class="ws-task-start-btn ws-task-start-btn--chat"
                      @click=${()=>n(e.id)}
                      title="Open chat session for this task"
                    >Open Chat</button>`:p}
              `:!c&&n?r`<button
                  class="ws-task-start-btn"
                  @click=${()=>n(e.id)}
                  title="Start working on this task"
                >Start</button>`:p}
    </div>
  `}function x$(e,t){return e.trim()?t.toLowerCase().includes(e.trim().toLowerCase()):!0}function fc(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.name.toLowerCase().includes(n)||s.path.toLowerCase().includes(n)||s.type.toLowerCase().includes(n)||(s.searchText??"").toLowerCase().includes(n))}function gc(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.title.toLowerCase().includes(n)||s.key.toLowerCase().includes(n))}function Th(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.reduce((s,i)=>{if(i.type==="file")(i.name.toLowerCase().includes(n)||i.path.toLowerCase().includes(n))&&s.push(i);else{const a=Th(e,i.children??[]);a.length>0&&s.push({...i,children:a})}return s},[])}function Ch(e){let t=0;for(const n of e)n.type==="file"?t++:n.children&&(t+=Ch(n.children));return t}const _$=10;function A$(e){if(!e.searchText)return null;const t=e.searchText.trim();if(!t)return null;const n=t.match(/#+ (.+?)(?:\s#|$)/);return n?n[1].trim().slice(0,120):(t.startsWith("---")?t.replace(/^---.*?---\s*/s,""):t).slice(0,120)||null}function T$(e,t=_$){return[...e].sort((n,s)=>s.modified.getTime()-n.modified.getTime()).slice(0,t)}function Eh(e,t,n){if(e.type==="file"){const o=n.pinnedPaths.has(e.path);return r`
      <div class="ws-folder-file-row" style="padding-left: ${12+t*16}px">
        <button
          class="ws-folder-file"
          @click=${()=>n.onItemClick?.({path:e.path,name:e.name,type:e.fileType??"text",size:e.size??0,modified:e.modified??new Date})}
        >
          <span class="ws-list-icon">${or(e.fileType??"text")}</span>
          <span class="ws-list-title">${e.name}</span>
          ${e.size!=null?r`<span class="ws-list-meta">${$h(e.size)}</span>`:p}
          ${e.modified?r`<span class="ws-list-meta">${N(e.modified.getTime())}</span>`:p}
        </button>
        <button
          class="ws-pin-btn ${o?"active":""}"
          @click=${()=>n.onPinToggle?.(n.workspaceId,e.path,o)}
          title=${o?"Unpin":"Pin"}
        >
          ${o?"Unpin":"Pin"}
        </button>
      </div>
    `}const s=n.expandedFolders.has(e.path),i=e.children??[],a=Ch(i);return r`
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
              ${i.map(o=>Eh(o,t+1,n))}
            </div>
          `:p}
    </div>
  `}function C$(e,t,n){return r`
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
            <span>${N(e.lastUpdated.getTime())}</span>
          </div>
        </div>
      </button>
      ${n?r`<button
            class="workspace-card-delete"
            title="Delete workspace"
            @click=${s=>{s.stopPropagation(),confirm(`Delete workspace "${e.name}"? This removes it from your list but does not delete any files.`)&&n(e)}}
          >&times;</button>`:p}
    </div>
  `}function va(e){const{workspaceId:t,entry:n,pinned:s,onOpen:i,onPinToggle:a}=e;return r`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(n)}>
        <span class="ws-list-icon">${or(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${$h(n.size)}</span>
        <span class="ws-list-meta">${N(n.modified.getTime())}</span>
      </button>
      <button
        class="ws-pin-btn ${s?"active":""}"
        @click=${()=>a?.(t,n.path,s)}
        title=${s?"Unpin":"Pin"}
      >
        ${s?"Unpin":"Pin"}
      </button>
    </div>
  `}function E$(e){const{workspaceId:t,entry:n,pinned:s,onOpen:i,onPinToggle:a}=e,o=A$(n);return r`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>i?.(n)}>
        <span class="ws-list-icon">${or(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${N(n.modified.getTime())}</span>
        ${o?r`<span class="ws-list-desc">${o}</span>`:p}
      </button>
      <button
        class="ws-pin-btn ${s?"active":""}"
        @click=${()=>a?.(t,n.path,s)}
        title=${s?"Unpin":"Pin"}
      >
        ${s?"Unpin":"Pin"}
      </button>
    </div>
  `}function R$(e,t){return r`
    <div class="workspace-breadcrumbs">
      ${e.map((n,s)=>r`
          ${s>0?r`<span class="breadcrumb-sep">/</span>`:p}
          <button
            class="breadcrumb-item ${s===e.length-1?"breadcrumb-current":""}"
            @click=${()=>t(n.path)}
          >${n.name}</button>
        `)}
    </div>
  `}function L$(e){const{browseEntries:t,breadcrumbs:n,browseSearchQuery:s,browseSearchResults:i,onBrowseFolder:a,onBrowseSearch:o,onBrowseBack:c,onCreateFolder:d,onItemClick:u}=e,l=i??t??[];return r`
    <div class="workspace-browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${()=>c?.()}>
          &larr; Back
        </button>
        ${n?R$(n,h=>a?.(h)):p}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          .value=${s??""}
          @input=${h=>{const f=h.target;o?.(f.value)}}
        />
        <button
          class="workspace-browse-new-folder"
          @click=${()=>{const h=prompt("New folder name:");if(h?.trim()){const f=n?.[n.length-1]?.path??".";d?.(`${f}/${h.trim()}`)}}}
        >+ Folder</button>
      </div>

      <div class="workspace-browse-list">
        ${l.length===0?r`<div class="workspace-browse-empty">No files found</div>`:l.map(h=>r`
              <button
                class="workspace-browse-entry"
                @click=${()=>{h.type==="folder"?a?.(h.path):u&&u({path:h.path,name:h.name,type:h.fileType??"text",size:h.size??0,modified:new Date})}}
              >
                <span class="browse-entry-icon">${h.type==="folder"?"📁":"📄"}</span>
                <span class="browse-entry-name">${h.name}</span>
                ${h.excerpt?r`<span class="browse-entry-excerpt">${h.excerpt}</span>`:p}
              </button>
            `)}
      </div>
    </div>
  `}function P$(e){const{workspace:t,itemSearchQuery:n,expandedFolders:s=new Set,showCompletedTasks:i=!1,onItemSearch:a,onBack:o,onItemClick:c,onSessionClick:d,onPinToggle:u,onPinSessionToggle:l,onToggleFolder:h,onToggleTaskComplete:f,onCreateTask:v,onToggleCompletedTasks:b,onStartTask:$,editingTaskId:k,onEditTask:S,onUpdateTask:_,onBatchPushToDrive:L}=e,E=fc(n,t.pinned).toSorted((O,_e)=>_e.modified.getTime()-O.modified.getTime()),x=gc(n,t.pinnedSessions),T=fc(n,t.outputs).filter(O=>!t.pinned.some(_e=>_e.path===O.path)),A=(t.folderTree?.length??0)>0,F=A?Th(n,t.folderTree):[],I=gc(n,t.sessions),z=new Set(t.pinnedSessions.map(O=>O.key)),q=new Set(t.pinned.map(O=>O.path)),j=n.trim().length>0,ge=E.length>0||x.length>0,Re=I.length>0||t.sessions.length===0||j,Qe=T$(t.outputs),te=Qe.length>0&&!j,le={expandedFolders:s,pinnedPaths:q,workspaceId:t.id,onToggleFolder:h,onItemClick:c,onPinToggle:u};return r`
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
        ${e.browsePath!=null?L$(e):p}

        ${ge?r`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${E.length+x.length}</span>
                  </div>
                  <div class="ws-list">
                    ${x.map(O=>r`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>d?.(O)}>
                            <span class=${hc(O.status)}></span>
                            <span class="ws-list-title">${O.title}</span>
                            <span class="ws-list-meta">${N(O.created.getTime())}</span>
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
                    ${E.map(O=>va({workspaceId:t.id,entry:O,pinned:!0,onOpen:c,onPinToggle:u}))}
                  </div>
                </section>
              `:p}

        ${D$({tasks:t.tasks??[],workspaceName:t.name,showCompleted:i,onToggleTaskComplete:f,onCreateTask:v,onToggleCompletedTasks:b,onStartTask:$,editingTaskId:k,onEditTask:S,onUpdateTask:_})}

        ${te?r`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Recent</h3>
                  <span>${Qe.length}</span>
                </div>
                <div class="ws-list">
                  ${Qe.map(O=>E$({workspaceId:t.id,entry:O,pinned:q.has(O.path),onOpen:c,onPinToggle:u}))}
                </div>
              </section>
            `:p}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${A?F.length:T.length}</span>
            ${L&&T.length>0?r`<button class="ws-export-drive-btn" @click=${()=>{const O=T.map(_e=>_e.path);L(O)}}>Export to Drive</button>`:p}
          </div>
          <div class="ws-list ws-list--scroll">
            ${A?F.length===0?r`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:F.map(O=>Eh(O,0,le)):T.length===0?r`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:T.map(O=>va({workspaceId:t.id,entry:O,pinned:!1,onOpen:c,onPinToggle:u}))}
          </div>
        </section>

        ${Re?r`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${I.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${I.length===0?r`
                            <div class="ws-empty">
                              <span class="ws-empty-hint">No sessions yet. Sessions are saved conversations with your ally — start a chat to create one.</span>
                            </div>
                          `:I.map(O=>r`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>d?.(O)}>
                                  <span class=${hc(O.status)}></span>
                                  <span class="ws-list-title">${O.title}</span>
                                  <span class="ws-list-meta">${N(O.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${z.has(O.key)?"active":""}"
                                  @click=${()=>l?.(t.id,O.key,z.has(O.key))}
                                  title=${z.has(O.key)?"Unpin":"Pin"}
                                >
                                  ${z.has(O.key)?"Unpin":"Pin"}
                                </button>
                              </div>
                            `)}
                  </div>
                </section>
              `:p}

        ${(t.memory?.length??0)>0?r`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Memory</h3>
                  <span>${t.memory.length}</span>
                </div>
                <div class="ws-list ws-list--scroll">
                  ${t.memory.map(O=>va({workspaceId:t.id,entry:O,pinned:q.has(O.path),onOpen:c,onPinToggle:u}))}
                </div>
              </section>
            `:p}
      </div>
    </div>
  `}function D$(e){const{tasks:t,workspaceName:n,showCompleted:s,onToggleTaskComplete:i,onCreateTask:a,onToggleCompletedTasks:o,onStartTask:c,editingTaskId:d,onEditTask:u,onUpdateTask:l}=e,h=di(t.filter(v=>v.status==="pending")),f=di(t.filter(v=>v.status==="complete"));return r`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${h.length} open${f.length>0?`, ${f.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${h.length===0&&f.length===0?r`<div class="ws-empty">No tasks</div>`:p}
        ${h.map(v=>pc(v,i,c,d,u,l))}
        ${f.length>0?r`
              <button class="ws-task-completed-toggle" @click=${()=>o?.()}>
                ${s?"Hide":"Show"} ${f.length} completed
              </button>
              ${s?f.map(v=>pc(v,i,c,d,u,l)):p}
            `:p}
      </div>
      ${a?r`
            <form
              class="ws-task-create-form"
              @submit=${v=>{v.preventDefault();const $=v.currentTarget.querySelector("input"),k=$.value.trim();k&&(a(k,n),$.value="")}}
            >
              <input
                type="text"
                class="ws-task-create-input"
                placeholder="Add a task..."
              />
              <button type="submit" class="ws-task-create-btn">Add</button>
            </form>
          `:p}
    </section>
  `}function I$(e){const{connected:t,workspaces:n,selectedWorkspace:s,searchQuery:i,itemSearchQuery:a,expandedFolders:o,loading:c,createLoading:d,error:u,allTasks:l=[],taskFilter:h="outstanding",taskSort:f="due",taskSearch:v="",showCompletedTasks:b=!1,editingTaskId:$,workspaceNames:k=[],onSearch:S,onItemSearch:_,onSelectWorkspace:L,onBack:E,onItemClick:x,onSessionClick:T,onPinToggle:A,onPinSessionToggle:F,onCreateWorkspace:I,onDeleteWorkspace:z,onToggleFolder:q,onTeamSetup:j,onToggleTaskComplete:ge,onCreateTask:Re,onSetTaskFilter:Qe,onSetTaskSort:te,onSetTaskSearch:le,onToggleCompletedTasks:O,onStartTask:_e,onEditTask:At,onUpdateTask:ne}=e,tn=n.filter(W=>x$(i,`${W.name} ${W.path} ${W.type}`));return s?P$({workspace:s,itemSearchQuery:a??"",expandedFolders:o,showCompletedTasks:b,onItemSearch:_,onBack:E,onItemClick:x,onSessionClick:T,onPinToggle:A,onPinSessionToggle:F,onToggleFolder:q,onToggleTaskComplete:ge,onCreateTask:Re,onToggleCompletedTasks:O,onStartTask:_e,editingTaskId:$,onEditTask:At,onUpdateTask:ne,browsePath:e.browsePath,browseEntries:e.browseEntries,breadcrumbs:e.breadcrumbs,browseSearchQuery:e.browseSearchQuery,browseSearchResults:e.browseSearchResults,onBrowseFolder:e.onBrowseFolder,onBrowseSearch:e.onBrowseSearch,onBrowseBack:e.onBrowseBack,onCreateFolder:e.onCreateFolder,onBatchPushToDrive:e.onBatchPushToDrive}):r`
    <div class="workspaces-container">
      <div class="workspaces-toolbar">
        <form
            class="workspaces-create-form"
            @submit=${async W=>{if(W.preventDefault(),d||!I)return;const Tn=W.currentTarget,Q=new FormData(Tn),dt=Q.get("name"),nn=(typeof dt=="string"?dt:"").trim();if(!nn)return;const Ye=Q.get("type"),sn=(typeof Ye=="string"?Ye:"project").trim().toLowerCase(),Cn=sn==="team"||sn==="personal"?sn:"project",En=Q.get("path"),Rn=(typeof En=="string"?En:"").trim();await I({name:nn,type:Cn,...Rn?{path:Rn}:{}})!==!1&&Tn.reset()}}
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
            @input=${W=>S?.(W.target.value)}
          />
          <span class="workspaces-count">${tn.length} workspaces</span>
          <span class="workspaces-status ${t?"online":"offline"}">
            ${t?"Online":"Offline"}
          </span>
          ${j?r`<button class="ws-team-setup-btn" @click=${()=>j()}>Team Setup</button>`:p}
      </div>

      ${u?r`<div class="callout danger" style="margin: 16px;">${u}</div>`:p}

      ${c?r`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `:r`
              <div class="workspaces-body">
                <div class="workspace-grid">
                  ${tn.length===0?r`
                          <div class="workspaces-empty">
                            <span class="workspaces-empty-icon">${t?"📭":"🔌"}</span>
                            <span>${t?"No workspaces yet":"Connect to gateway to see workspaces"}</span>
                            ${t?r`<span class="workspaces-empty-hint">Workspaces organize your projects. Ask your ally to create one, or start a focused session in chat.</span>`:p}
                          </div>
                        `:tn.map(W=>C$(W,L,z))}
                </div>

                ${M$({tasks:l,taskFilter:h,taskSort:f,taskSearch:v,onToggleTaskComplete:ge,onSetTaskFilter:Qe,onSetTaskSort:te,onSetTaskSearch:le,onCreateTask:Re,workspaceNames:k,onStartTask:_e,editingTaskId:$,onEditTask:At,onUpdateTask:ne})}
              </div>
            `}
    </div>
  `}function M$(e){const{tasks:t,taskFilter:n,taskSort:s="due",taskSearch:i="",onToggleTaskComplete:a,onSetTaskFilter:o,onSetTaskSort:c,onSetTaskSearch:d,onCreateTask:u,workspaceNames:l=[],onStartTask:h,editingTaskId:f,onEditTask:v,onUpdateTask:b}=e;if(t.length===0&&!u)return r``;let $;if(n==="outstanding")$=t.filter(S=>S.status==="pending");else if(n==="today"){const S=X();$=t.filter(_=>_.status==="pending"&&_.dueDate!=null&&_.dueDate<=S)}else n==="complete"?$=t.filter(S=>S.status==="complete"):$=t;if(i){const S=i.toLowerCase();$=$.filter(_=>_.title.toLowerCase().includes(S)||_.project?.toLowerCase().includes(S))}const k=di($,s);return r`
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
                  @input=${S=>d(S.target.value)}
                />`:p}
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
              @change=${S=>c?.(S.target.value)}
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
                @submit=${S=>{S.preventDefault();const _=S.currentTarget,L=_.querySelector(".ws-task-create-input"),E=_.querySelector(".ws-task-create-project"),x=L.value.trim();if(!x)return;const T=E?.value||l[0]||"";u(x,T),L.value=""}}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                />
                ${l.length>0?r`
                      <select class="ws-task-create-project">
                        ${l.map(S=>r`<option value=${S}>${S}</option>`)}
                      </select>
                    `:p}
                <button type="submit" class="ws-task-create-btn">Add</button>
              </form>
            `:p}
        <div class="ws-list ws-list--scroll">
          ${k.length===0?r`<div class="ws-empty">No tasks</div>`:k.map(S=>Ja(S,a,h,f,v,b))}
        </div>
      </section>
    </div>
  `}function O$(e){return e===X()}function B$(e){const t=new Date(e+"T12:00:00");return F$(t)}function F$(e){const t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],n=["January","February","March","April","May","June","July","August","September","October","November","December"],s=t[e.getDay()],i=n[e.getMonth()],a=e.getDate();return`${s}, ${i} ${a}`}function N$(e){return r`
    <form class="ws-task-create-form" @submit=${t=>{t.preventDefault();const s=t.currentTarget.querySelector("input"),i=s.value.trim();i&&(e(i),s.value="")}}>
      <input type="text" class="ws-task-create-input" placeholder="Add a task for today..." />
      <button type="submit" class="ws-task-create-btn">Add</button>
    </form>
  `}function U$(e){const t=di(e.todayTasks??[],"due"),n=t.filter(i=>i.status==="pending"),s=t.filter(i=>i.status==="complete");return r`
    <div class="my-day-card today-tasks-panel">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x2705;</span>
          <span>TODAY'S TASKS</span>
        </div>
        <span class="today-tasks-count">
          ${n.length} open${s.length>0?r`, ${s.length} done`:p}
        </span>
      </div>
      <div class="my-day-card-content">
        ${e.todayTasksLoading?r`<div class="brief-loading"><div class="spinner"></div><span>Loading tasks...</span></div>`:r`
              ${e.onCreateTask?N$(e.onCreateTask):p}
              <div class="today-tasks-list">
                ${n.length===0&&s.length===0?r`<div class="today-tasks-empty">No tasks for today. Add one above or drop tasks in your daily brief.</div>`:n.map(i=>Ja(i,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask,e.onViewTaskOutput))}
              </div>
              ${s.length>0?r`
                    <button class="today-completed-toggle" @click=${()=>e.onToggleCompletedTasks?.()}>
                      ${e.showCompletedTasks?"Hide":"Show"} ${s.length} completed
                    </button>
                    ${e.showCompletedTasks?r`<div class="today-tasks-list today-tasks-list--completed">
                          ${s.map(i=>Ja(i,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask))}
                        </div>`:p}
                  `:p}
            `}
      </div>
    </div>
  `}function Rh(e){const t=X(),n=e.selectedDate??t,s=O$(n),i=B$(n),a=e.viewMode??"brief";return r`
    <div class="my-day-toolbar">
      <div class="today-date-nav">
        ${e.onDatePrev?r`<button class="today-date-btn" @click=${e.onDatePrev} title="Previous day">&#x2039;</button>`:p}
        <span class="today-date-label ${s?"":"past-date"}">${i}</span>
        ${e.onDateNext?r`<button class="today-date-btn" @click=${e.onDateNext} title="Next day">&#x203A;</button>`:p}
        ${!s&&e.onDateToday?r`<button class="today-date-today-btn" @click=${e.onDateToday}>Today</button>`:p}
      </div>
      <div class="today-view-tabs">
        <button class="today-view-tab ${a==="brief"?"active":""}"
          @click=${()=>e.onViewModeChange?.("brief")}>Brief</button>
        <button class="today-view-tab ${a==="tasks"?"active":""}"
          @click=${()=>e.onViewModeChange?.("tasks")}>Tasks</button>
        <button class="today-view-tab ${a==="inbox"?"active":""}"
          @click=${()=>e.onViewModeChange?.("inbox")}>Inbox${(e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length??0)>0?r`<span class="tab-badge">${e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length}</span>`:p}</button>
      </div>
      <div class="today-quick-actions">
        ${new Date().getHours()<15?!e.focusPulseActive&&e.onStartMorningSet?r`<button class="today-morning-set-btn" @click=${e.onStartMorningSet}
                  title="Start your morning focus ritual">\u2600\uFE0F Start my day</button>`:p:e.onEveningCapture?r`<button class="today-evening-btn" @click=${e.onEveningCapture}
                  title="Reflect on your day and set up tomorrow">\uD83C\uDF19 Evening Capture</button>`:p}
        ${e.onRefresh?r`<button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh / Generate Brief">&#x21BB;</button>`:null}
      </div>
    </div>
  `}function z$(e){return r`
    <div class="my-day-brief-full">
      ${S$({items:e.inboxItems??[],loading:e.inboxLoading,count:e.inboxCount,sortOrder:e.inboxSortOrder??"newest",scoringId:e.inboxScoringId,scoringValue:e.inboxScoringValue,feedbackText:e.inboxFeedbackText,onViewOutput:t=>e.onInboxViewOutput?.(t),onViewProof:t=>e.onInboxViewProof?.(t),onOpenChat:t=>e.onInboxOpenChat?.(t),onDismiss:t=>e.onInboxDismiss?.(t),onScore:(t,n,s)=>e.onInboxScore?.(t,n,s),onSetScoring:(t,n)=>e.onInboxSetScoring?.(t,n),onFeedbackChange:t=>e.onInboxFeedbackChange?.(t),onSortToggle:()=>e.onInboxSortToggle?.(),onMarkAll:()=>e.onInboxMarkAll?.()})}
    </div>
  `}function K$(e){const t=e.trustSummary;if(!t||t.workflowCount===0)return p;const n=t.overallScore===null?"var(--text-secondary)":t.overallScore>=8?"var(--ok, #22c55e)":t.overallScore>=5?"var(--warn, #eab308)":"var(--danger, #ef4444)",s=t.overallScore!==null?t.overallScore.toFixed(1):"--";return r`
    <div class="my-day-card trust-summary-card">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">&#x1F3AF;</span>
          <span>TRUST</span>
        </div>
        ${e.onNavigateToTrust?r`<button class="brief-refresh-btn" @click=${e.onNavigateToTrust}
              title="View full trust dashboard">Details &#x2192;</button>`:p}
      </div>
      <div class="my-day-card-content" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
        <div style="text-align:center;min-width:60px;">
          <div style="font-size:28px;font-weight:700;color:${n};line-height:1;">${s}</div>
          <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">/ 10</div>
        </div>
        <div style="flex:1;min-width:120px;font-size:13px;color:var(--text-secondary);line-height:1.6;">
          <div>${t.workflowCount} workflow${t.workflowCount!==1?"s":""} tracked</div>
          ${t.highPerformers>0?r`<div style="color:var(--ok, #22c55e);">${t.highPerformers} above 8.0</div>`:p}
          ${t.needsAttention>0?r`<div style="color:var(--warn, #eab308);">${t.needsAttention} need${t.needsAttention!==1?"":"s"} attention</div>`:p}
          ${t.dailyStreak>0?r`<div>${t.dailyStreak}-day streak</div>`:p}
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
            </div>`:t.todayRated?r`<div style="font-size:12px;color:var(--ok, #22c55e);">Rated today &#x2713;</div>`:p}
      </div>
    </div>
  `}function q$(e){const t=X();e.selectedDate;const n=e.viewMode??"brief";if(e.loading)return r`
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
      ${K$(e)}
      ${n==="brief"?r`<div class="my-day-brief-full">
            ${v$(s)}
          </div>`:n==="tasks"?r`<div class="my-day-brief-full">${U$(e)}</div>`:z$(e)}
    </div>
  `}function W$(e){const t=Y$(e),n=nS(e);return r`
    ${iS(n)}
    ${sS(t)}
    ${j$(e)}
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
              `:e.nodes.map(s=>fS(s))}
      </div>
    </section>
  `}function j$(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return r`
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
      ${e.devicesError?r`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:p}
      <div class="list" style="margin-top: 16px;">
        ${n.length>0?r`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${n.map(i=>H$(i,e))}
            `:p}
        ${s.length>0?r`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(i=>V$(i,e))}
            `:p}
        ${n.length===0&&s.length===0?r`
                <div class="muted">No paired devices.</div>
              `:p}
      </div>
    </section>
  `}function H$(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?N(e.ts):"n/a",i=e.role?.trim()?`role: ${e.role}`:"role: -",a=e.isRepair?" · repair":"",o=e.remoteIp?` · ${e.remoteIp}`:"";return r`
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
  `}function V$(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",i=`roles: ${Sa(e.roles)}`,a=`scopes: ${Sa(e.scopes)}`,o=Array.isArray(e.tokens)?e.tokens:[];return r`
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
                ${o.map(c=>G$(e.deviceId,c,t))}
              </div>
            `}
      </div>
    </div>
  `}function G$(e,t,n){const s=t.revokedAtMs?"revoked":"active",i=`scopes: ${Sa(t.scopes)}`,a=N(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return r`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${i} · ${a}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          Rotate
        </button>
        ${t.revokedAtMs?p:r`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e,t.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}const bt="__defaults__",mc=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],Q$=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function Y$(e){const t=e.configForm,n=uS(e.nodes),{defaultBinding:s,agents:i}=pS(t),a=!!t,o=e.configSaving||e.configFormMode==="raw";return{ready:a,disabled:o,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function yc(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function J$(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function X$(e){const t=e?.defaults??{};return{security:yc(t.security),ask:J$(t.ask),askFallback:yc(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function Z$(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(i=>{if(!i||typeof i!="object")return;const a=i,o=typeof a.id=="string"?a.id.trim():"";if(!o)return;const c=typeof a.name=="string"?a.name.trim():void 0,d=a.default===!0;s.push({id:o,name:c||void 0,isDefault:d})}),s}function eS(e,t){const n=Z$(e),s=Object.keys(t?.agents??{}),i=new Map;n.forEach(o=>i.set(o.id,o)),s.forEach(o=>{i.has(o)||i.set(o,{id:o})});const a=Array.from(i.values());return a.length===0&&a.push({id:"main",isDefault:!0}),a.sort((o,c)=>{if(o.isDefault&&!c.isDefault)return-1;if(!o.isDefault&&c.isDefault)return 1;const d=o.name?.trim()?o.name:o.id,u=c.name?.trim()?c.name:c.id;return d.localeCompare(u)}),a}function tS(e,t){return e===bt?bt:e&&t.some(n=>n.id===e)?e:bt}function nS(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=X$(t),i=eS(e.configForm,t),a=hS(e.nodes),o=e.execApprovalsTarget;let c=o==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o==="node"&&c&&!a.some(h=>h.id===c)&&(c=null);const d=tS(e.execApprovalsSelectedAgent,i),u=d!==bt?(t?.agents??{})[d]??null:null,l=Array.isArray(u?.allowlist)?u.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:d,selectedAgent:u,agents:i,allowlist:l,target:o,targetNodeId:c,targetNodes:a,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function sS(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return r`
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
            `:p}

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
                  ${t?p:r`
                          <div class="muted">No nodes with system.run available.</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?r`
                      <div class="muted">No agents found.</div>
                    `:e.agents.map(s=>dS(s,e))}
            </div>
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function iS(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return r`
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

      ${aS(e)}

      ${t?r`
            ${oS(e)}
            ${rS(e)}
            ${e.selectedScope===bt?p:lS(e)}
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function aS(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return r`
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
              `:p}
        </div>
      </div>
      ${e.target==="node"&&!t?r`
              <div class="muted">No nodes advertise exec approvals yet.</div>
            `:p}
    </div>
  `}function oS(e){return r`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===bt?"active":""}"
          @click=${()=>e.onSelectScope(bt)}
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
  `}function rS(e){const t=e.selectedScope===bt,n=e.defaults,s=e.selectedAgent??{},i=t?["defaults"]:["agents",e.selectedScope],a=typeof s.security=="string"?s.security:void 0,o=typeof s.ask=="string"?s.ask:void 0,c=typeof s.askFallback=="string"?s.askFallback:void 0,d=t?n.security:a??"__default__",u=t?n.ask:o??"__default__",l=t?n.askFallback:c??"__default__",h=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,f=h??n.autoAllowSkills,v=h==null;return r`
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
              @change=${b=>{const k=b.target.value;!t&&k==="__default__"?e.onRemove([...i,"security"]):e.onPatch([...i,"security"],k)}}
            >
              ${t?p:r`<option value="__default__" ?selected=${d==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${mc.map(b=>r`<option
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
              @change=${b=>{const k=b.target.value;!t&&k==="__default__"?e.onRemove([...i,"ask"]):e.onPatch([...i,"ask"],k)}}
            >
              ${t?p:r`<option value="__default__" ?selected=${u==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${Q$.map(b=>r`<option
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
              @change=${b=>{const k=b.target.value;!t&&k==="__default__"?e.onRemove([...i,"askFallback"]):e.onPatch([...i,"askFallback"],k)}}
            >
              ${t?p:r`<option value="__default__" ?selected=${l==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${mc.map(b=>r`<option
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
            ${t?"Allow skill executables listed by the Gateway.":v?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${f?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${f}
              @change=${b=>{const $=b.target;e.onPatch([...i,"autoAllowSkills"],$.checked)}}
            />
          </label>
          ${!t&&!v?r`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,"autoAllowSkills"])}
              >
                Use default
              </button>`:p}
        </div>
      </div>
    </div>
  `}function lS(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return r`
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
            `:n.map((s,i)=>cS(e,s,i))}
    </div>
  `}function cS(e,t,n){const s=t.lastUsedAt?N(t.lastUsedAt):"never",i=t.lastUsedCommand?ls(t.lastUsedCommand,120):null,a=t.lastResolvedPath?ls(t.lastResolvedPath,120):null;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${i?r`<div class="list-sub mono">${i}</div>`:p}
        ${a?r`<div class="list-sub mono">${a}</div>`:p}
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
  `}function dS(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,i=t.nodes.length>0;return r`
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
  `}function uS(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(c=>String(c)==="system.run"))continue;const a=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!a)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():a;t.push({id:a,label:o===a?a:`${o} · ${a}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function hS(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(c=>String(c)==="system.execApprovals.get"||String(c)==="system.execApprovals.set"))continue;const a=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!a)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():a;t.push({id:a,label:o===a?a:`${o} · ${a}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function pS(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},i=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,a=e.agents??{},o=Array.isArray(a.list)?a.list:[];if(o.length===0)return{defaultBinding:i,agents:[t]};const c=[];return o.forEach((d,u)=>{if(!d||typeof d!="object")return;const l=d,h=typeof l.id=="string"?l.id.trim():"";if(!h)return;const f=typeof l.name=="string"?l.name.trim():void 0,v=l.default===!0,$=(l.tools??{}).exec??{},k=typeof $.node=="string"&&$.node.trim()?$.node.trim():null;c.push({id:h,name:f||void 0,index:u,isDefault:v,binding:k})}),c.length===0&&c.push(t),{defaultBinding:i,agents:c}}function fS(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),i=Array.isArray(e.caps)?e.caps:[],a=Array.isArray(e.commands)?e.commands:[];return r`
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
  `}const gS=["","off","minimal","low","medium","high"],mS=["","off","on"],yS=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],vS=["","off","on","stream"];function bS(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function Lh(e){return bS(e)==="zai"}function wS(e){return Lh(e)?mS:gS}function kS(e,t){return!t||!e||e==="off"?e:"on"}function $S(e,t){return e?t&&e==="on"?"low":e:null}function SS(e){switch(e){case"idle-7d":return"Idle > 7 days";case"task-complete":return"Task completed";case"manual":return"Manual";default:return e}}function xS(){return r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
    <path d="M10 12h4"/>
  </svg>`}function _S(){return r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 14 4 9 9 4"/>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
  </svg>`}function AS(e){return r`<svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="transition: transform 150ms ease; transform: rotate(${e?"90deg":"0deg"});"
  >
    <polyline points="9 18 15 12 9 6"/>
  </svg>`}function TS(e){const t=e.result?.sessions??[],n=new Set(e.archivedSessions.map(a=>a.sessionKey)),s=t.filter(a=>!n.has(a.key)),i=e.archivedSessions.length;return r`
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

      ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:p}

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
              `:s.map(a=>ES(a,e.basePath,e.onPatch,e.onDelete,e.onArchive,e.loading))}
      </div>
    </section>

    ${CS(e,i)}
  `}function CS(e,t){return t===0&&!e.archivedSessionsLoading?p:r`
    <section class="card archived-section">
      <div
        class="archived-section__header"
        @click=${e.onToggleArchived}
      >
        <div class="row" style="gap: 8px; align-items: center;">
          ${AS(e.archivedSessionsExpanded)}
          <span class="archived-section__title">Archived</span>
          ${t>0?r`<span class="archived-badge">${t}</span>`:p}
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
                ${e.archivedSessionsLoading?r`<div class="muted" style="padding: 12px;">Loading...</div>`:e.archivedSessions.length===0?r`<div class="muted" style="padding: 12px;">No archived sessions.</div>`:e.archivedSessions.map(n=>RS(n,e.onUnarchive,e.loading))}
              </div>
            `:p}
    </section>
  `}function ES(e,t,n,s,i,a){const o=e.updatedAt?N(e.updatedAt):"n/a",c=e.thinkingLevel??"",d=Lh(e.modelProvider),u=kS(c,d),l=wS(e.modelProvider),h=e.verboseLevel??"",f=e.reasoningLevel??"",v=e.displayName??e.key,b=e.kind!=="global",$=b?`${oo("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return r`
    <div class="table-row">
      <div class="mono">${b?r`<a href=${$} class="session-link">${v}</a>`:v}</div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${a}
          placeholder="(optional)"
          @change=${k=>{const S=k.target.value.trim();n(e.key,{label:S||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${o}</div>
      <div>${K0(e)}</div>
      <div>
        <select
          .value=${u}
          ?disabled=${a}
          @change=${k=>{const S=k.target.value;n(e.key,{thinkingLevel:$S(S,d)})}}
        >
          ${l.map(k=>r`<option value=${k}>${k||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${h}
          ?disabled=${a}
          @change=${k=>{const S=k.target.value;n(e.key,{verboseLevel:S||null})}}
        >
          ${yS.map(k=>r`<option value=${k.value}>${k.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${f}
          ?disabled=${a}
          @change=${k=>{const S=k.target.value;n(e.key,{reasoningLevel:S||null})}}
        >
          ${vS.map(k=>r`<option value=${k}>${k||"inherit"}</option>`)}
        </select>
      </div>
      <div class="row" style="gap: 4px;">
        <button
          class="btn btn-icon"
          ?disabled=${a}
          @click=${()=>i(e.key)}
          title="Archive this session"
        >
          ${xS()}
        </button>
        <button class="btn danger btn--sm" ?disabled=${a} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function RS(e,t,n){const s=N(Date.parse(e.archivedAt));return r`
    <div class="archived-table__row">
      <div class="mono" style="opacity: 0.7;">${e.sessionKey}</div>
      <div>${s}</div>
      <div>${SS(e.reason)}</div>
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
          ${_S()}
        </button>
      </div>
    </div>
  `}function LS(e){const t=e.subTab==="godmode",n=t||e.subTab==="my-skills";return r`
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
            </button>`:p}
      </div>

      ${t?PS(e):p}
      ${e.subTab==="my-skills"?MS(e):p}
    </section>
  `}function PS(e){const t=e.godmodeSkills,n=e.godmodeSkillsLoading,s=e.filter.trim().toLowerCase();if(n&&!t)return r`<div class="muted" style="margin-top: 16px;">Loading GodMode skills...</div>`;if(!t||t.total===0)return r`<div class="muted" style="margin-top: 16px;">No GodMode skills found.</div>`;const i=[...t.skills.map(o=>({...o,_kind:"skill"})),...t.cards.map(o=>({...o,_kind:"card"}))],a=s?i.filter(o=>[o.slug,o.name,o.body.slice(0,200)].join(" ").toLowerCase().includes(s)):i;return r`
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
          ${a.map(o=>o._kind==="skill"?DS(o,e.expandedSkills.has(o.slug),e.onToggleExpand):IS(o,e.expandedSkills.has(o.slug),e.onToggleExpand))}
        </div>`}
  `}function DS(e,t,n){const s=e.body.split(`
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
        <div class="list-sub" style="margin-left: 18px;">${ls(s,120)}</div>
        <div class="chip-row" style="margin-top: 6px; margin-left: 18px;">
          <span class="chip chip-ok">skill</span>
          <span class="chip">${e.trigger}</span>
          ${e.schedule?r`<span class="chip">${e.schedule}</span>`:p}
          ${e.persona?r`<span class="chip">${e.persona}</span>`:p}
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
                      `:p}
                  ${e.schedule?r`
                        <span class="muted">Schedule:</span>
                        <span>${e.schedule}</span>
                      `:p}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${e.body}
                </div>
              </div>
            `:p}
      </div>
    </div>
  `}function IS(e,t,n){return r`
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
          ${e.tools.length>0?r`<span class="chip">${e.tools.length} tools</span>`:p}
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
                      `:p}
                </div>
                <div
                  style="margin-top: 10px; font-size: 13px; line-height: 1.5;
                         white-space: pre-wrap; color: var(--text-color, #333);
                         max-height: 200px; overflow-y: auto;"
                >
                  ${e.body}
                </div>
              </div>
            `:p}
      </div>
    </div>
  `}function MS(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(i=>[i.name,i.description,i.source].join(" ").toLowerCase().includes(n)):t;return r`
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

    ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:p}

    ${s.length===0?r`<div class="muted" style="margin-top: 16px">No integrations found.</div>`:r`<div class="list" style="margin-top: 16px;">
            ${s.map(i=>OS(i,e))}
          </div>`}
  `}function OS(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",i=t.messages[e.skillKey]??null,a=e.install.length>0&&e.missing.bins.length>0,o=[...e.missing.bins.map(d=>`bin:${d}`),...e.missing.env.map(d=>`env:${d}`),...e.missing.config.map(d=>`config:${d}`),...e.missing.os.map(d=>`os:${d}`)],c=[];return e.disabled&&c.push("disabled"),e.blockedByAllowlist&&c.push("blocked by allowlist"),r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${ls(e.description,140)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.source}</span>
          <span class="chip ${e.eligible?"chip-ok":"chip-warn"}">
            ${e.eligible?"eligible":"blocked"}
          </span>
          ${e.disabled?r`
                  <span class="chip chip-warn">disabled</span>
                `:p}
        </div>
        ${o.length>0?r`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${o.join(", ")}
              </div>
            `:p}
        ${c.length>0?r`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${c.join(", ")}
              </div>
            `:p}
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
              </button>`:p}
        </div>
        ${i?r`<div
              class="muted"
              style="margin-top: 8px; color: ${i.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${i.message}
            </div>`:p}
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
            `:p}
      </div>
    </div>
  `}function BS(e){switch(e){case"claude":return"chip-ok";case"codex":return"chip-warn";case"gemini":return"chip-info";default:return""}}function FS(e){const t=e.filter.trim().toLowerCase(),n=t?e.roster.filter(a=>[a.slug,a.name,a.category,a.mission??"",...a.taskTypes].join(" ").toLowerCase().includes(t)):e.roster,s=new Map;for(const a of n){const o=a.category||"_default";s.has(o)||s.set(o,[]),s.get(o).push(a)}const i=[...s.keys()].sort((a,o)=>a==="_default"?1:o==="_default"?-1:a.localeCompare(o));return r`
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

      ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:p}

      ${e.loading&&e.roster.length===0?r`<div class="muted" style="margin-top: 16px;">Loading agent roster...</div>`:p}

      ${!e.loading&&n.length===0?r`<div class="muted" style="margin-top: 16px;">
            ${e.roster.length===0?"No agents found. Add persona files to your agent-roster directory.":"No matches."}
          </div>`:p}

      ${i.map(a=>{const o=s.get(a),c=a==="_default"?"General":Ph(a);return r`
          <div style="margin-top: 20px;">
            <div
              style="font-size: 12px; font-weight: 600; text-transform: uppercase;
                     letter-spacing: 0.05em; color: var(--muted-color, #888);
                     margin-bottom: 8px; padding-left: 2px;"
            >
              ${c}
            </div>
            <div class="list">
              ${o.map(d=>NS(d,e.expandedAgents.has(d.slug),e.onToggleExpand))}
            </div>
          </div>
        `})}
    </section>
  `}function Ph(e){return e.replace(/[-_]/g," ").replace(/\b\w/g,t=>t.toUpperCase())}function NS(e,t,n){return r`
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
          ${e.engine?r`<span class="chip ${BS(e.engine)}" style="font-size: 11px;">${e.engine}</span>`:p}
        </div>
        ${e.mission?r`<div class="list-sub" style="margin-left: 18px;">${ls(e.mission,120)}</div>`:p}
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
                  <span>${Ph(e.category||"_default")}</span>
                  ${e.engine?r`
                        <span class="muted">Engine:</span>
                        <span>${e.engine}</span>
                      `:p}
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
                    `:p}
              </div>
            `:p}
      </div>
    </div>
  `}function Dh(){return{open:!1,images:[],currentIndex:0}}function US(e,t,n){return{open:!0,images:t,currentIndex:n}}function zS(){return Dh()}function KS(e,t){const n=e.currentIndex+t;return n<0||n>=e.images.length?e:{...e,currentIndex:n}}const qS=r`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,WS=r`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,jS=r`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;function HS(e,t){if(!e.open||e.images.length===0)return p;const n=e.images[e.currentIndex];if(!n)return p;const s=e.images.length>1,i=e.currentIndex>0,a=e.currentIndex<e.images.length-1;return r`
    <div
      class="lightbox-overlay"
      @click=${o=>{o.target.classList.contains("lightbox-overlay")&&t.onClose()}}
      @keydown=${o=>{o.key==="Escape"&&t.onClose(),o.key==="ArrowRight"&&a&&t.onNav(1),o.key==="ArrowLeft"&&i&&t.onNav(-1)}}
      tabindex="0"
    >
      <button class="lightbox-close" @click=${t.onClose} aria-label="Close image viewer">
        ${qS}
      </button>

      ${s&&i?r`<button class="lightbox-nav lightbox-nav--prev" @click=${()=>t.onNav(-1)} aria-label="Previous image">${WS}</button>`:p}

      <img
        class="lightbox-image"
        src=${n.url}
        alt=${n.alt??"Image preview"}
        @click=${o=>o.stopPropagation()}
        @error=${o=>{o.target.classList.add("lightbox-image--broken")}}
      />

      ${s&&a?r`<button class="lightbox-nav lightbox-nav--next" @click=${()=>t.onNav(1)} aria-label="Next image">${jS}</button>`:p}

      ${s?r`<div class="lightbox-counter">${e.currentIndex+1} / ${e.images.length}</div>`:p}
    </div>
  `}const VS=e=>{switch(e){case"success":return r`
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
      `}};function GS({toasts:e,onDismiss:t}){return e.length===0?null:r`
    <div class="toast-container">
      ${Ei(e,n=>n.id,n=>r`
          <div class="toast toast--${n.type}">
            <div class="toast__icon">${VS(n.type)}</div>
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
  `}const vc=[{key:"focusPulse.enabled",icon:"☀️",name:"Focus Pulse",description:"Morning priority ritual + persistent focus widget in the topbar. Silent 30-min pulse checks compare your activity against your plan.",default:!0}];function QS(e,t){return r`
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
  `}function YS(e,t,n){const i=!!(t?.[e.key]??e.default);return r`
    <div class="options-card card">
      <div class="options-card-header">
        <div class="options-card-info">
          <span class="options-card-icon">${e.icon}</span>
          <span class="options-card-name">${e.name}</span>
        </div>
        ${QS(i,()=>n(e.key,!i))}
      </div>
      <div class="options-card-description">${e.description}</div>
    </div>
  `}function JS(e){const{connected:t,loading:n,options:s,onToggle:i,onOpenWizard:a}=e;return t?n&&!s?r`
      <section class="tab-body options-section">
        <div class="options-loading">Loading options...</div>
      </section>
    `:r`
    <section class="tab-body options-section">
      <div class="options-grid">
        ${vc.map(o=>YS(o,s,i))}
      </div>
      ${vc.length===0?r`<div class="options-empty">
            No configurable features yet.
          </div>`:p}
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
          `:p}
    </section>
  `:r`
      <section class="tab-body options-section">
        <div class="options-empty">Not connected to gateway.</div>
      </section>
    `}const bc=["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Anchorage","Pacific/Honolulu","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Shanghai","Asia/Kolkata","Australia/Sydney","Pacific/Auckland"],XS=["Direct and concise -- no fluff, just answers","Detailed explanations -- walk me through the reasoning","Casual and conversational -- like talking to a friend","Structured with bullet points -- organized and scannable","Technical and precise -- specifics matter"],ZS=[{value:"sonnet",label:"Sonnet (fast, balanced)"},{value:"opus",label:"Opus (deep reasoning)"},{value:"haiku",label:"Haiku (quick, lightweight)"}],ba=["Never send emails without explicit approval","Never delete or overwrite files without backup","Always search memory before guessing","Never share private information externally"],wc=[{label:"Name",question:"What should I call you?"},{label:"Timezone",question:"What timezone are you in?"},{label:"Focus",question:"What are you building or focused on?"},{label:"Projects",question:"What are your top projects? (1-3)"},{label:"Style",question:"How do you like to communicate?"},{label:"Rules",question:"What rules must the AI always follow?"},{label:"People",question:"Who are the key people in your work/life?"},{label:"Model",question:"What AI model do you prefer?"}];function kc(e){const n=Math.min(Number(e),8);return r`
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
  `}function e1(e){if(e>=wc.length)return r`${p}`;const t=wc[e];return r`
    <div class="wizard-step-header">
      <h2 class="wizard-question">${t.question}</h2>
    </div>
  `}function t1(e,t,n,s){return r`
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
  `}function Ih(){return r`<p class="wizard-skip-hint">Press Enter to use the default and continue</p>`}function n1(e,t){function n(i){const a=i.target.value;t.onAnswerChange("name",a)}function s(i){i.key==="Enter"&&(i.preventDefault(),t.onStepChange(1))}return r`
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
  `}function s1(e,t){const n=Intl.DateTimeFormat().resolvedOptions().timeZone;return r`
    <div class="wizard-field">
      <div class="wizard-detected">
        Detected: <strong>${n}</strong>
      </div>
      <select
        class="wizard-select"
        .value=${e.timezone||n}
        @change=${s=>{t.onAnswerChange("timezone",s.target.value)}}
      >
        ${bc.includes(n)?p:r`<option value="${n}">${n} (detected)</option>`}
        ${bc.map(s=>r`
            <option value="${s}" ?selected=${(e.timezone||n)===s}>
              ${s}${s===n?" (detected)":""}
            </option>
          `)}
      </select>
      ${Ih()}
    </div>
  `}function i1(e,t){function n(i){t.onAnswerChange("focus",i.target.value)}function s(i){i.key==="Enter"&&(i.preventDefault(),t.onStepChange(3))}return r`
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
  `}function a1(e,t){function n(){const a=document.querySelector(".wizard-project-input");if(!a)return;const o=a.value.trim();o&&e.projects.length<5&&(t.onAnswerChange("projects",[...e.projects,o]),a.value="",a.focus())}function s(a){const o=e.projects.filter((c,d)=>d!==a);t.onAnswerChange("projects",o)}function i(a){a.key==="Enter"&&(a.preventDefault(),a.target.value.trim()?n():e.projects.length>0&&t.onStepChange(4))}return r`
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
      ${e.projects.length===0?r`<p class="wizard-hint">Add 1-3 projects, or skip to continue</p>`:p}
    </div>
  `}function o1(e,t){return r`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${XS.map(n=>r`
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
  `}function r1(e,t){const n=e.hardRules.length>0?e.hardRules:[];function s(o){n.includes(o)?t.onAnswerChange("hardRules",n.filter(c=>c!==o)):t.onAnswerChange("hardRules",[...n,o])}function i(){const o=document.querySelector(".wizard-rule-input");if(!o)return;const c=o.value.trim();c&&(t.onAnswerChange("hardRules",[...n,c]),o.value="",o.focus())}function a(o){o.key==="Enter"&&(o.preventDefault(),o.target.value.trim()&&i())}return r`
    <div class="wizard-field">
      <p class="wizard-hint">Select common rules or add your own:</p>
      <div class="wizard-checkbox-list">
        ${ba.map(o=>r`
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
      ${n.filter(o=>!ba.includes(o)).length>0?r`
            <div class="wizard-tag-list" style="margin-top: 8px;">
              ${n.filter(o=>!ba.includes(o)).map(o=>r`
                    <span class="wizard-tag">
                      ${o}
                      <button class="wizard-tag-remove" @click=${()=>{t.onAnswerChange("hardRules",n.filter(c=>c!==o))}}>x</button>
                    </span>
                  `)}
            </div>
          `:p}
    </div>
  `}function l1(e,t){function n(){const a=document.querySelector(".wizard-person-input");if(!a)return;const o=a.value.trim();o&&e.keyPeople.length<10&&(t.onAnswerChange("keyPeople",[...e.keyPeople,o]),a.value="",a.focus())}function s(a){t.onAnswerChange("keyPeople",e.keyPeople.filter((o,c)=>c!==a))}function i(a){a.key==="Enter"&&(a.preventDefault(),a.target.value.trim()?n():e.keyPeople.length>0&&t.onStepChange(7))}return r`
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
  `}function c1(e,t){return r`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${ZS.map(n=>r`
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
      ${Ih()}
    </div>
  `}function wa(e){return e==null?"not set":typeof e=="string"?e:typeof e=="boolean"||typeof e=="number"?String(e):(Array.isArray(e),JSON.stringify(e))}function d1(e,t){const{answers:n,preview:s,diff:i,fileSelections:a,configSelections:o,generating:c}=e,d=s?.some(l=>l.exists)??!1,u=i&&(i.changes.length>0||i.additions.length>0);return r`
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
            `:p}

        ${n.keyPeople.length>0?r`
              <div class="wizard-review-section">
                <h3>Key People</h3>
                ${n.keyPeople.map(l=>r`<div class="wizard-review-item">${l}</div>`)}
              </div>
            `:p}

        ${n.hardRules.length>0?r`
              <div class="wizard-review-section">
                <h3>AI Rules</h3>
                ${n.hardRules.map(l=>r`<div class="wizard-review-item">${l}</div>`)}
              </div>
            `:p}
      </div>

      ${s&&s.length>0?r`
            <div class="wizard-review-section wizard-review-files">
              <h3>Workspace Files</h3>
              ${d?r`<p class="wizard-hint">Some files already exist. Uncheck to keep your existing version.</p>`:p}
              <div class="wizard-file-list">
                ${s.map(l=>{const h=a[l.path]??l.wouldCreate;return r`
                    <label class="wizard-file-item ${l.wouldCreate?"wizard-file--new":"wizard-file--exists"}">
                      <input
                        type="checkbox"
                        ?checked=${h}
                        @change=${f=>t.onFileToggle(l.path,f.target.checked)}
                      />
                      <span class="wizard-file-path">${l.path}</span>
                      <span class="wizard-file-status">${l.exists?h?"overwrite":"keep existing":"new"}</span>
                    </label>
                  `})}
              </div>
            </div>
          `:p}

      ${u?r`
            <div class="wizard-review-section wizard-review-config">
              <h3>Config Changes</h3>

              ${i.additions.length>0?r`
                    <div class="wizard-config-group">
                      <h4>New settings</h4>
                      ${i.additions.map(l=>{const h=o[l.path]??!0;return r`
                          <label class="wizard-config-item">
                            <input
                              type="checkbox"
                              ?checked=${h}
                              @change=${f=>t.onConfigToggle(l.path,f.target.checked)}
                            />
                            <span class="wizard-config-path">${l.path}</span>
                            <span class="wizard-config-value">${wa(l.recommended)}</span>
                          </label>
                        `})}
                    </div>
                  `:p}

              ${i.changes.length>0?r`
                    <div class="wizard-config-group">
                      <h4>Changed settings</h4>
                      <p class="wizard-hint">These differ from your current config. Check to update.</p>
                      ${i.changes.map(l=>{const h=o[l.path]??!1;return r`
                          <label class="wizard-config-item wizard-config-item--change">
                            <input
                              type="checkbox"
                              ?checked=${h}
                              @change=${f=>t.onConfigToggle(l.path,f.target.checked)}
                            />
                            <span class="wizard-config-path">${l.path}</span>
                            <span class="wizard-config-diff">
                              <span class="wizard-config-current">${wa(l.current)}</span>
                              <span class="wizard-config-arrow">&rarr;</span>
                              <span class="wizard-config-recommended">${wa(l.recommended)}</span>
                            </span>
                          </label>
                        `})}
                    </div>
                  `:p}

              ${i.matching.length>0?r`<p class="wizard-hint">${i.matching.length} settings already match GodMode's recommendations.</p>`:p}
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

      ${e.error?r`<div class="wizard-error">${e.error}</div>`:p}
    </div>
  `}function u1(e,t){const n=e.result;return n?r`
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
  `:r`${p}`}function Mh(){return{name:"",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,focus:"",projects:[],commStyle:"Direct and concise -- no fluff, just answers",hardRules:[],keyPeople:[],defaultModel:"sonnet"}}function h1(){return{step:0,answers:Mh(),preview:null,diff:null,fileSelections:{},configSelections:{},generating:!1,result:null,error:null}}function Oh(e,t){const{step:n,answers:s}=e;if(n===9)return r`
      <div class="wizard-fullscreen">
        ${u1(e,t)}
      </div>
    `;if(n===8)return r`
      <div class="wizard-fullscreen">
        <div class="wizard-container">
          ${kc(n)}
          ${d1(e,t)}
        </div>
      </div>
    `;const i=(()=>{switch(n){case 0:return s.name.trim().length>0;case 1:return!0;case 2:return!0;case 3:return!0;case 4:return s.commStyle.trim().length>0;case 5:return!0;case 6:return!0;case 7:return!0;default:return!1}})(),a=n===7,o=(()=>{switch(n){case 0:return n1(s,t);case 1:return s1(s,t);case 2:return i1(s,t);case 3:return a1(s,t);case 4:return o1(s,t);case 5:return r1(s,t);case 6:return l1(s,t);case 7:return c1(s,t);default:return r`${p}`}})();return r`
    <div class="wizard-fullscreen">
      <div class="wizard-container">
        <div class="wizard-glow"></div>
        ${kc(n)}
        ${e1(n)}
        ${o}
        ${t1(n,t,i,a)}
      </div>
    </div>
  `}const p1=Object.freeze(Object.defineProperty({__proto__:null,emptyWizardAnswers:Mh,emptyWizardState:h1,renderOnboardingWizard:Oh},Symbol.toStringTag,{value:"Module"}));function An(e){return e===null?"none":e>=8?"high":e>=5?"medium":"low"}function ks(e){return{high:"trust-score--high",medium:"trust-score--medium",low:"trust-score--low",none:"trust-score--none"}[e]}function f1(e){return{improving:"Improving",declining:"Declining",stable:"Stable",new:"New"}[e]??"New"}function g1(e){return{improving:"trust-trend--up",declining:"trust-trend--down",stable:"trust-trend--stable",new:"trust-trend--new"}[e]??"trust-trend--new"}function m1(e){return{improving:"↑",declining:"↓",stable:"→",new:"•"}[e]??"•"}function y1(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const i=Math.floor(s/24);return i<7?`${i}d ago`:new Date(e).toLocaleDateString()}function v1(e){const t=e.overallScore,n=An(t);return r`
    <div class="trust-overall">
      <div class="trust-overall-score ${ks(n)}">
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
  `}function b1(e,t){const s=Math.min(100,Math.max(0,(e??t)/10*100)),i=An(e??(t>0?t:null));return r`
    <div class="trust-progress">
      <div
        class="trust-progress-fill ${ks(i)}"
        style="width: ${s}%"
      ></div>
    </div>
  `}function w1(e,t){const s=e.trustScore!==null?e.trustScore.toFixed(1):e.avgRating>0?e.avgRating.toFixed(1):"--",i=An(e.trustScore??(e.avgRating>0?e.avgRating:null)),a=e.count<10?10-e.count:0;return r`
    <div class="trust-card">
      <div class="trust-card-header">
        <span class="trust-card-name">${e.workflow}</span>
        ${t?r`<button
              class="trust-card-remove"
              title="Remove workflow"
              @click=${()=>t(e.workflow)}
            >&times;</button>`:p}
      </div>

      <div class="trust-card-score-row">
        <span class="trust-card-score ${ks(i)}">${s}</span>
        <span class="trust-card-score-label">/10</span>
        <span class="trust-trend ${g1(e.trend)}">
          ${m1(e.trend)} ${f1(e.trend)}
        </span>
      </div>

      ${b1(e.trustScore,e.avgRating)}

      <div class="trust-card-meta">
        <span class="trust-card-count">${e.count} rating${e.count!==1?"s":""}</span>
        ${a>0?r`<span class="trust-card-pending">${a} more until trust score</span>`:p}
        ${e.needsFeedback?r`<span class="trust-card-needs-feedback">Needs improvement</span>`:p}
      </div>

      ${e.recentFeedback.length>0?r`
            <div class="trust-card-feedback">
              <span class="trust-card-feedback-label">Feedback applied:</span>
              ${e.recentFeedback.map(o=>r`<span class="trust-card-feedback-item">${o}</span>`)}
            </div>
          `:p}
    </div>
  `}function k1(){return[{workflow:"Code Reviews",avgRating:8.2,count:14,trustScore:8.2,needsFeedback:!1,trend:"improving",recentNotes:[],recentFeedback:[]},{workflow:"Email Drafts",avgRating:6.5,count:11,trustScore:6.5,needsFeedback:!0,trend:"stable",recentNotes:[],recentFeedback:["Be more concise","Match my tone"]},{workflow:"Research",avgRating:7.8,count:3,trustScore:null,needsFeedback:!1,trend:"new",recentNotes:[],recentFeedback:[]}]}function $1(){const e=k1();return{workflows:e.map(t=>t.workflow),summaries:e,ratings:[],total:0,overallScore:7.6,totalRatings:28,totalUses:28}}function S1(e){const t=An(e.rating);return r`
    <div class="trust-rating-row">
      <span class="trust-rating-score ${ks(t)}">${e.rating}</span>
      <span class="trust-rating-workflow">${e.workflow}</span>
      ${e.note?r`<span class="trust-rating-note">${e.note}</span>`:p}
      <span class="trust-rating-time">${y1(e.timestamp)}</span>
    </div>
  `}function x1(){return r`
    <div class="trust-sample-banner">
      Sample data — use skills and rate them to build your real trust profile.
    </div>
  `}function _1(e){const t=e.connected,n=e.guardrailsData,s=e.consciousnessStatus,i=e.data?.todayRating??null,a=e.updateStatus??null,o=a?.openclawUpdateAvailable||a?.pluginUpdateAvailable;if(!t)return{level:"alert",icon:"⚠️",text:"Gateway disconnected",detail:"Reconnect to restore full functionality."};if(o){const d=[];return a.openclawUpdateAvailable&&a.openclawLatest&&d.push(`OpenClaw ${a.openclawVersion} → ${a.openclawLatest}`),a.pluginUpdateAvailable&&a.pluginLatest&&d.push(`GodMode ${a.pluginVersion} → ${a.pluginLatest}`),{level:"warn",icon:"🔄",text:"Update available",detail:d.join(", ")+". Visit Overview to update."}}if(s==="error")return{level:"warn",icon:"🧠",text:"Consciousness sync needs attention",detail:"Your system is running but the last sync encountered an error."};if(n){const d=n.gates.filter(l=>l.enabled).length,u=n.gates.length;if(d<u)return{level:"warn",icon:"🛡",text:`${u-d} security gate${u-d!==1?"s":""} disabled`,detail:"Your system is running with reduced safety coverage."}}const c=a&&!o?" Up to date.":"";return i?i.rating>=8?{level:"ok",icon:"✨",text:`Rated ${i.rating}/10 today — GodMode is running great.`,detail:`All systems secure and building trust daily.${c}`}:i.rating>=5?{level:"ok",icon:"💪",text:`Rated ${i.rating}/10 today — working to improve.`,detail:`Your feedback is being applied. All systems secure.${c}`}:{level:"warn",icon:"💬",text:`Rated ${i.rating}/10 today — your feedback matters.`,detail:`We're using your input to get better. All systems secure.${c}`}:{level:"ok",icon:"✅",text:"Your GodMode is safe, secure, and building trust daily.",detail:`All systems healthy.${c} Rate your day below to help improve.`}}function A1(e){const{level:t,icon:n,text:s,detail:i}=_1(e);return r`
    <div class="trust-hero trust-hero--${t}">
      <span class="trust-hero-icon">${n}</span>
      <div class="trust-hero-body">
        <div class="trust-hero-text">${s}</div>
        <div class="trust-hero-detail">${i}</div>
      </div>
    </div>
  `}function T1(e){return e<=4?"trust-daily-button--low":e<=7?"trust-daily-button--med":"trust-daily-button--high"}function $c(e){const t=[];for(let n=0;n<7;n++)t.push(e[n]??null);return r`
    <div class="trust-daily-trend">
      ${t.map(n=>{if(!n)return r`<div class="trust-daily-trend-dot trust-daily-trend-dot--empty"></div>`;const s=Math.max(4,n.rating/10*28),i=An(n.rating);return r`
          <div
            class="trust-daily-trend-dot trust-daily-trend-dot--${i==="none"?"medium":i}"
            style="height: ${s}px"
            title="${n.date}: ${n.rating}/10"
          ></div>
        `})}
    </div>
  `}function C1(e){const t=e.data,n=t?.todayRating??null,s=t?.recentDaily??[],i=t?.dailyStreak??0,a=t?.dailyAverage??null;if(!e.onDailyRate)return p;if(n){const o=An(n.rating),c=n.rating<7&&!n.note;return r`
      <div class="trust-daily">
        <div class="trust-daily-header">
          <span class="trust-daily-prompt">Today's Rating</span>
          ${i>1?r`<span class="trust-daily-streak">${i} day streak</span>`:p}
        </div>
        <div class="trust-daily-result">
          <div class="trust-daily-result-score ${ks(o)}">
            ${n.rating}<span class="trust-daily-result-max">/10</span>
          </div>
          <div class="trust-daily-result-meta">
            <span class="trust-daily-result-label">
              ${n.rating>=8?"Great day!":n.rating>=5?"Good, working to improve":"Thanks for the honesty"}
            </span>
            ${n.note?r`<span class="trust-daily-result-note">"${n.note}"</span>`:p}
            ${a!==null?r`<span class="trust-daily-result-note">7-day avg: ${a}/10</span>`:p}
          </div>
          ${s.length>1?$c(s):p}
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
                  @click=${d=>{const l=d.target.previousElementSibling,h=l?.value?.trim();h&&e.onDailyRate&&(e.onDailyRate(n.rating,h),l.value="")}}
                >Send</button>
              </div>
            `:p}
      </div>
    `}return r`
    <div class="trust-daily">
      <div class="trust-daily-header">
        <span class="trust-daily-prompt">How happy were you with GodMode today?</span>
        ${i>0?r`<span class="trust-daily-streak">${i} day streak</span>`:p}
      </div>
      <div class="trust-daily-buttons">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>r`
            <button
              class="trust-daily-button ${T1(o)}"
              type="button"
              title="${o}/10"
              @click=${()=>e.onDailyRate(o)}
            >${o}</button>
          `)}
      </div>
      ${s.length>0?r`
            <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              ${$c(s)}
              ${a!==null?r`<span style="font-size: 0.75rem; color: var(--text-muted);">7-day avg: ${a}/10</span>`:p}
            </div>
          `:p}
    </div>
  `}function E1(e){if(!e)return r`
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
              ${c>0?r` &middot; <span class="trust-health-activity-count">${c}</span> blocked`:p}
              ${d>0?r` &middot; <span class="trust-health-activity-count">${d}</span> fired`:p}
            </div>
          `:r`
            <div class="trust-health-activity">No activity in last 24h</div>
          `}
    </div>
  `}function R1(e){return!e||e==="idle"?"Idle":e==="loading"?"Syncing...":e==="ok"?"Synced":"Error"}function L1(e){return!e||e==="idle"?"trust-health-dot--idle":e==="loading"?"trust-health-dot--warn":e==="ok"?"trust-health-dot--ok":"trust-health-dot--error"}function P1(e){const t=e.connected,n=e.consciousnessStatus,s=e.sessionsCount,i=e.gatewayUptimeMs,c=(t?1:0)+(n==="ok"||n==="idle"?1:0)===2&&t;return r`
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
        <span class="trust-health-dot ${L1(n)}"></span>
        <span class="trust-health-label">Consciousness</span>
        <span class="trust-health-value">${R1(n)}</span>
      </div>

      ${s!=null?r`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Sessions</span>
              <span class="trust-health-value">${s} active</span>
            </div>
          `:p}

      ${i!=null?r`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Uptime</span>
              <span class="trust-health-value">${Gc(i)}</span>
            </div>
          `:p}
    </div>
  `}function D1(e){return r`
    <div class="trust-health">
      <h3 class="trust-health-title">System Health</h3>
      <div class="trust-health-grid">
        ${E1(e.guardrailsData)}
        ${P1(e)}
      </div>
    </div>
  `}function I1(e){const{connected:t,loading:n,data:s,onRemoveWorkflow:i,onRefresh:a}=e;if(!t)return r`
      <section class="tab-body trust-section">
        <div class="trust-disconnected">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return r`
      <section class="tab-body trust-section">
        <div class="trust-loading">Loading trust tracker...</div>
      </section>
    `;const c=!(s?.summaries??[]).some(h=>h.count>0),d=c?$1():s,u=d.summaries,l=c?[]:s?.ratings??[];return r`
    <section class="tab-body trust-section">
      ${A1(e)}

      ${c?x1():p}

      ${C1(e)}

      ${v1(d)}

      <div class="trust-workflows-grid">
        ${u.map(h=>w1(h,c?null:i))}
      </div>

      ${D1(e)}

      ${l.length>0?r`
            <div class="trust-history">
              <h3 class="trust-history-title">Recent Ratings</h3>
              <div class="trust-history-list">
                ${l.slice(0,20).map(S1)}
              </div>
            </div>
          `:p}
    </section>
  `}function M1(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const i=Math.floor(s/24);return i<7?`${i}d ago`:new Date(e).toLocaleDateString()}function O1(e){return{fired:"guardrails-badge--fired",blocked:"guardrails-badge--blocked",cleaned:"guardrails-badge--cleaned"}[e]??""}function Bh(e,t){return r`
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
  `}function B1(e,t,n,s){const i=e.thresholds?.[t]??0;return r`
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
  `}function F1(e,t,n){const s=e.thresholdLabels?Object.keys(e.thresholdLabels):[];return r`
    <div class="guardrails-card card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${e.icon}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook">${e.hook}</span>
        </div>
        ${Bh(e.enabled,()=>t(e.id,!e.enabled))}
      </div>
      <div class="guardrails-card-description">${e.description}</div>
      ${s.length>0?r`
            <div class="guardrails-thresholds">
              ${s.map(i=>B1(e,i,e.thresholdLabels[i],n))}
            </div>
          `:p}
    </div>
  `}function N1(e,t,n){const s=e.action==="redirect"?"↪":"🚫",i=e.action==="redirect"?"redirect":"block";return r`
    <div class="guardrails-card card guardrails-custom-card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${s}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook guardrails-action-tag guardrails-action-tag--${i}">${i}</span>
        </div>
        <div class="guardrails-custom-actions">
          ${Bh(e.enabled,()=>t(e.id,!e.enabled))}
          <button class="guardrails-delete-btn" title="Delete rule" @click=${()=>n(e.id)}>&times;</button>
        </div>
      </div>
      <div class="guardrails-card-description">${e.message}</div>
      <div class="guardrails-custom-meta">
        <span class="guardrails-custom-tool">${e.trigger.tool}</span>
        ${e.trigger.patterns.map(a=>r`<span class="guardrails-pattern-tag">${a}</span>`)}
      </div>
    </div>
  `}function U1(e){return r`
    <div class="guardrails-activity-row">
      <span class="guardrails-badge ${O1(e.action)}">${e.action}</span>
      <span class="guardrails-activity-gate">${e.gateId}</span>
      <span class="guardrails-activity-detail">${e.detail}</span>
      <span class="guardrails-activity-time">${M1(e.timestamp)}</span>
    </div>
  `}function z1(e){const{connected:t,loading:n,data:s,onToggle:i,onThresholdChange:a,onCustomToggle:o,onCustomDelete:c,onToggleAddForm:d,onOpenAllyChat:u}=e;if(!t)return r`
      <section class="tab-body guardrails-section">
        <div class="guardrails-empty">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return r`
      <section class="tab-body guardrails-section">
        <div class="guardrails-loading">Loading guardrails...</div>
      </section>
    `;const l=s?.gates??[],h=s?.activity??[],f=s?.custom??[],v=l.filter(k=>k.enabled).length,b=f.filter(k=>k.enabled).length,$=[`${v}/${l.length} gates active`];return f.length>0&&$.push(`${b} custom rule${f.length===1?"":"s"}`),r`
    <section class="tab-body guardrails-section">
      <div class="guardrails-two-col">
        <div class="guardrails-left">
          <h2 class="guardrails-col-heading">Safety Gates</h2>
          <p class="guardrails-col-subtitle">${v}/${l.length} active — prevent runaway loops, bad searches, and lazy responses.</p>
          <div class="guardrails-grid">
            ${l.map(k=>F1(k,i,a))}
          </div>
        </div>

        <div class="guardrails-right">
          <h2 class="guardrails-col-heading">Custom Rules & Activity</h2>
          <p class="guardrails-col-subtitle">Your rules${f.length>0?` (${b} active)`:""} and recent gate events.</p>

          <div class="guardrails-custom-section">
            <div class="guardrails-custom-header">
              <h3 class="guardrails-custom-title">Custom Rules</h3>
              <button class="guardrails-add-btn" @click=${()=>{u?u("Create a new guardrail rule: "):d()}}>+ Add Rule</button>
            </div>

            ${f.length>0?r`
                  <div class="guardrails-custom-grid">
                    ${f.map(k=>N1(k,o,c))}
                  </div>
                `:r`
                  <div class="guardrails-custom-empty">
                    No custom rules yet. Click "+ Add Rule" to tell your ally what to block or redirect.
                  </div>
                `}
          </div>

          <div class="guardrails-history">
            <h3 class="guardrails-history-title">Recent Activity</h3>
            ${h.length>0?r`
                  <div class="guardrails-history-list">
                    ${h.slice(0,30).map(U1)}
                  </div>
                `:r`<div class="guardrails-no-activity">No gate activity recorded yet.</div>`}
          </div>
        </div>
      </div>
    </section>
  `}class K1{constructor(){this.listeners=new Map}on(t,n){this.listeners.has(t)||this.listeners.set(t,new Set);const s=this.listeners.get(t);return s.add(n),()=>{s.delete(n)}}emit(t,...n){const s=this.listeners.get(t);if(!s)return;const i=n[0];for(const a of s)try{a(i)}catch(o){console.error(`[event-bus] Error in handler for "${t}":`,o)}}clear(){this.listeners.clear()}}const Oe=new K1;function $t(e){if(!e)return"";try{return N(new Date(e).getTime())}catch{return""}}function ui(e){return r`<div class="second-brain-md-body">${at(Se(e))}</div>`}function q1(e){const{identity:t}=e;return!t||t.files.length===0?r`
      <div class="second-brain-panel">
        <div class="second-brain-empty-block">
          <div class="second-brain-empty-icon">\u{1F464}</div>
          <div class="second-brain-empty-title">No identity files found</div>
          <div class="second-brain-empty-hint">Tell your ally about yourself to start building your profile. Your identity helps the ally personalize everything.</div>
          <button class="sb-chat-btn" @click=${()=>e.onSaveViaChat()} style="margin-top: 12px;">
            Tell your ally about you
          </button>
        </div>
      </div>
    `:r`
    <div class="second-brain-panel">
      <div class="sb-identity-actions" style="display: flex; gap: 8px; margin-bottom: 12px;">
        <button class="sb-chat-btn" @click=${()=>e.onSaveViaChat()}>
          \u{1F4AC} Update via Chat
        </button>
      </div>

      ${t.files.map(n=>r`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.label}</span>
            ${n.updatedAt?r`<span class="second-brain-card-updated">${$t(n.updatedAt)}</span>`:p}
          </div>
          <div class="second-brain-card-content">${ui(n.content)}</div>
        </div>
      `)}
    </div>
  `}function ka(e,t){const n=e.isDirectory;return r`
    <div class="second-brain-entry" @click=${()=>{n?t.onBrowseFolder(e.path):t.onSelectEntry(e.path)}}>
      <div class="second-brain-entry-icon ${n?"second-brain-entry-icon--folder":""}">${n?"📁":"📄"}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${e.name}${n?"/":""}</div>
        ${e.excerpt?r`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:p}
      </div>
      ${e.updatedAt?r`<div class="second-brain-entry-meta">${$t(e.updatedAt)}</div>`:p}
    </div>
  `}function W1(e,t){const n=e.isDirectory,s=n?"📁":"📑",i=()=>{n?t.onBrowseFolder(e.path):t.onSelectEntry(e.path)},a=e.frontmatter?.title||e.name;return r`
    <div class="second-brain-entry" @click=${i}>
      <div class="second-brain-entry-icon ${n?"second-brain-entry-icon--folder":""}">${s}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${a}${n?"/":""}</div>
        ${e.frontmatter?.url?r`<div class="second-brain-research-url">${e.frontmatter.url}</div>`:p}
        ${e.excerpt&&!n?r`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:p}
        ${e.frontmatter?.tags?.length?r`
          <div class="second-brain-research-tags">
            ${e.frontmatter.tags.map(o=>r`<span class="second-brain-research-tag">${o}</span>`)}
          </div>
        `:p}
      </div>
      ${e.updatedAt?r`<div class="second-brain-entry-meta">${$t(e.updatedAt)}</div>`:p}
    </div>
  `}function j1(e){return e<1024?`${e}B`:e<1024*1024?`${(e/1024).toFixed(1)}K`:`${(e/(1024*1024)).toFixed(1)}M`}function Fh(e,t,n=0){return r`
    <div class="sb-file-tree" style="padding-left: ${n*16}px">
      ${e.map(s=>s.type==="folder"?r`
            <details class="sb-tree-folder">
              <summary class="sb-tree-item sb-tree-folder-name">
                <span class="sb-file-icon">\u{1F4C1}</span>
                <span>${s.name}</span>
                ${s.childCount!=null?r`<span class="sb-tree-count">${s.childCount}</span>`:p}
              </summary>
              ${s.children?Fh(s.children,t,n+1):p}
            </details>
          `:r`
          <button
            class="sb-tree-item sb-tree-file"
            @click=${()=>t.onFileSelect?.(s.path)}
          >
            <span class="sb-file-icon">\u{1F4C4}</span>
            <span class="sb-file-name">${s.name}</span>
            ${s.size!=null?r`<span class="sb-tree-size">${j1(s.size)}</span>`:p}
          </button>
        `)}
    </div>
  `}function H1(e){const{memoryBank:t,researchData:n,selectedEntry:s,searchQuery:i,browsingFolder:a,folderEntries:o,folderName:c}=e;if(s)return r`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${s.name}</span>
            ${s.updatedAt?r`<span class="second-brain-card-updated">${$t(s.updatedAt)}</span>`:p}
          </div>
          ${s.relativePath?r`<div class="second-brain-card-path">${s.relativePath}</div>`:p}
          <div class="second-brain-card-content">${ui(s.content)}</div>
        </div>
      </div>
    `;if(a&&o)return r`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${c??"Folder"}</span>
            <span class="second-brain-section-count">${o.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${o.length>0?o.map(f=>ka(f,e)):r`<div class="second-brain-empty-inline">Empty folder</div>`}
          </div>
        </div>
      </div>
    `;if(!(t&&t.totalEntries>0||n&&n.totalEntries>0||e.fileTree&&e.fileTree.length>0))return G1("No knowledge found","Start building your second brain by telling your ally about the people, companies, and projects in your life.");const u=(i??"").toLowerCase().trim(),l=f=>u?f.filter(v=>v.name.toLowerCase().includes(u)||v.excerpt.toLowerCase().includes(u)):f,h=e.fileSearchResults;return r`
    <div class="second-brain-panel">
      <div class="second-brain-search knowledge-search">
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Search your second brain..."
          .value=${i??""}
          @input=${f=>{const v=f.target.value;e.onSearch(v),e.onFileSearch?.(v)}}
        />
      </div>

      ${h&&u?r`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F50D} Search Results</span>
            <span class="second-brain-section-count">${h.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${h.length>0?h.map(f=>r`
                  <div class="second-brain-entry" @click=${()=>e.onFileSelect?.(f.path)}>
                    <div class="second-brain-entry-icon">${f.type==="folder"?"📁":"📄"}</div>
                    <div class="second-brain-entry-body">
                      <div class="second-brain-entry-name">${f.name}</div>
                      ${f.matchContext||f.excerpt?r`<div class="second-brain-entry-excerpt">${f.matchContext??f.excerpt}</div>`:p}
                    </div>
                  </div>
                `):r`<div class="second-brain-empty-inline">No results</div>`}
          </div>
        </div>
      `:p}

      ${!u&&t?r`
        ${t.sections.map(f=>{const v=l(f.entries);return f.entries.length===0?p:r`
            <div class="second-brain-section">
              <div class="second-brain-section-header">
                <span class="second-brain-section-title">${f.icon} ${f.label}</span>
                <span class="second-brain-section-count">${f.entries.length}</span>
              </div>
              <div class="second-brain-entry-list">
                ${v.length>0?v.map(b=>ka(b,e)):u?r`<div class="second-brain-empty-inline">No matches</div>`:p}
              </div>
            </div>
          `})}

        ${t.extraFiles.length>0?r`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4CB} Reference Files</span>
              <span class="second-brain-section-count">${t.extraFiles.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${t.extraFiles.map(f=>ka(f,e))}
            </div>
          </div>
        `:p}

        ${t.curated?r`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{2B50} Curated Facts</span>
              <span class="second-brain-section-count">${$t(t.curated.updatedAt)}</span>
            </div>
            <div class="second-brain-card">
              <div class="second-brain-card-content">${ui(t.curated.content)}</div>
            </div>
          </div>
        `:p}
      `:p}

      ${!u&&n&&n.totalEntries>0?r`
        ${n.categories.map(f=>f.entries.length===0?p:r`
            <div class="second-brain-section">
              <div class="second-brain-section-header">
                <span class="second-brain-section-title">\u{1F50D} ${f.label}</span>
                <span class="second-brain-section-count">${f.entries.length}</span>
              </div>
              <div class="second-brain-entry-list">
                ${f.entries.map(v=>W1(v,e))}
              </div>
            </div>
          `)}
      `:p}

      ${!u&&e.fileTree&&e.fileTree.length>0?r`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F5C2}\uFE0F Browse All</span>
          </div>
          ${Fh(e.fileTree,e)}
        </div>
      `:p}
    </div>
  `}const Sc={connected:{dot:"●",label:"Connected",cls:"second-brain-source--connected"},available:{dot:"○",label:"Available",cls:"second-brain-source--available"}};function xc(e){const t=Sc[e.status]??Sc.available;return r`
    <div class="second-brain-source-card ${t.cls}">
      <div class="second-brain-source-icon">${e.icon}</div>
      <div class="second-brain-source-body">
        <div class="second-brain-source-name">${e.name}</div>
        <div class="second-brain-source-desc">${e.description}</div>
        ${e.stats?r`<div class="second-brain-source-stats">${e.stats}</div>`:p}
      </div>
      <div class="second-brain-source-status">
        <span class="second-brain-source-dot" style="color: ${e.status==="connected"?"var(--success, #10b981)":e.status==="available"?"var(--warning, #f59e0b)":"var(--muted)"}">${t.dot}</span>
        <span class="second-brain-source-status-label">${t.label}</span>
        ${e.status==="connected"&&e.lastSync?r`<span class="second-brain-source-sync">${$t(e.lastSync)}</span>`:p}
      </div>
    </div>
  `}function V1(e){const{aiPacket:t,sourcesData:n,vaultHealth:s,syncing:i}=e,a=t?.snapshot??null;return r`
    <div class="second-brain-panel">
      <!-- Awareness Snapshot (hero) -->
      <div class="second-brain-section">
        <div class="second-brain-sync-bar">
          <div class="second-brain-sync-info">
            <span class="second-brain-sync-label">Awareness Snapshot</span>
            <span class="second-brain-sync-time">
              ${a?.updatedAt?`Last synced ${$t(a.updatedAt)}`:"Not yet synced"}
              ${a?` • ${a.lineCount} lines`:""}
            </span>
          </div>
          <button
            class="second-brain-sync-btn ${i?"syncing":""}"
            ?disabled=${i}
            @click=${()=>e.onSync()}
          >
            ${i?"Syncing...":"⚡ Sync Now"}
          </button>
        </div>

        ${a?r`
          <div class="second-brain-card">
            <div class="second-brain-card-content">${ui(a.content)}</div>
          </div>
        `:r`
          <div class="second-brain-empty-block">
            <div class="second-brain-empty-icon">\u{1F9E0}</div>
            <div class="second-brain-empty-title">No awareness snapshot yet</div>
            <div class="second-brain-empty-hint">Hit "Sync Now" to generate your first awareness snapshot. It includes your schedule, tasks, goals, and agent activity.</div>
          </div>
        `}
      </div>

      <!-- Connected Sources -->
      ${n&&n.sources.length>0?r`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F310} Connected Sources</span>
            <span class="second-brain-section-count">${n.connectedCount} of ${n.totalCount}</span>
            <button class="second-brain-add-source-btn" @click=${()=>e.onAddSource()}>+ Add</button>
          </div>
          <div class="second-brain-sources-grid">
            ${n.sources.filter(o=>o.status==="connected").map(o=>xc(o))}
          </div>
          ${n.sources.some(o=>o.status==="available")?r`
            <details style="margin-top: 8px;">
              <summary style="cursor: pointer; font-size: 12px; color: var(--muted);">
                ${n.sources.filter(o=>o.status==="available").length} available sources
              </summary>
              <div class="second-brain-sources-grid" style="margin-top: 8px;">
                ${n.sources.filter(o=>o.status==="available").map(o=>xc(o))}
              </div>
            </details>
          `:p}
        </div>
      `:p}

      <!-- Vault Health -->
      ${s?r`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F4D3} Vault Health</span>
          </div>
          ${s.available&&s.stats?r`
            <div class="context-health-row">
              <span>${s.stats.totalNotes} notes</span>
              <span>\u00B7</span>
              <span>${s.stats.brainCount} brain</span>
              <span>\u00B7</span>
              <span>${s.stats.inboxCount} inbox</span>
              <span>\u00B7</span>
              <span>${s.stats.dailyCount} daily</span>
              <span>\u00B7</span>
              <span>Last: ${s.stats.lastActivity?$t(s.stats.lastActivity):"never"}</span>
            </div>
          `:r`
            <div class="context-health-row" style="color: var(--muted);">
              Vault not connected. Set OBSIDIAN_VAULT_PATH to enable.
            </div>
          `}
        </div>
      `:p}
    </div>
  `}function G1(e,t){return r`
    <div class="second-brain-empty-block">
      <div class="second-brain-empty-icon">\u{1F9E0}</div>
      <div class="second-brain-empty-title">${e}</div>
      <div class="second-brain-empty-hint">${t}</div>
    </div>
  `}function Q1(e){const{subtab:t,loading:n}=e;return r`
    <section class="second-brain-container">
      <div class="second-brain-tabs">
        <button
          class="second-brain-tab ${t==="identity"?"active":""}"
          @click=${()=>e.onSubtabChange("identity")}
        >
          \u{1F464} Identity
        </button>
        <button
          class="second-brain-tab ${t==="knowledge"?"active":""}"
          @click=${()=>e.onSubtabChange("knowledge")}
        >
          \u{1F4DA} Knowledge
        </button>
        <button
          class="second-brain-tab ${t==="context"?"active":""}"
          @click=${()=>e.onSubtabChange("context")}
        >
          \u{26A1} Context
        </button>
      </div>

      ${n?r`<div class="second-brain-loading"><div class="second-brain-loading-spinner"></div>Loading...</div>`:t==="identity"?q1(e):t==="knowledge"?H1(e):V1(e)}
    </section>
  `}async function Nh(e){if(!e.client||!e.connected)return;const t=e.secondBrainSubtab??"identity";e.secondBrainLoading=!0,e.secondBrainError=null;try{if(t==="identity"){const n=await e.client.request("secondBrain.identity",{});e.secondBrainIdentity=n}else if(t==="knowledge"){const[n,s,i]=await Promise.all([e.client.request("secondBrain.memoryBank",{}),e.client.request("secondBrain.research",{}),e.client.request("secondBrain.fileTree",{depth:4})]);e.secondBrainMemoryBank=n,e.secondBrainResearchData=s,e.secondBrainFileTree=i.tree??[],e.secondBrainBrowsingFolder=null,e.secondBrainFolderEntries=null,e.secondBrainFolderName=null}else if(t==="context"){const[n,s,i]=await Promise.all([e.client.request("secondBrain.aiPacket",{}),e.client.request("secondBrain.sources",{}),e.client.request("secondBrain.vaultHealth",{})]);e.secondBrainAiPacket=n,e.secondBrainSourcesData=s,e.secondBrainVaultHealth=i}}catch(n){console.error("[SecondBrain] Failed to load:",n),e.secondBrainError=n instanceof Error?n.message:"Failed to load Second Brain data"}finally{e.secondBrainLoading=!1}}async function Uh(e,t){if(!(!e.client||!e.connected)){e.secondBrainLoading=!0;try{const n=await e.client.request("secondBrain.memoryBank",{folder:t});e.secondBrainBrowsingFolder=n.folder,e.secondBrainFolderName=n.folderName,e.secondBrainFolderEntries=n.entries}catch(n){console.error("[SecondBrain] Failed to browse folder:",n),e.secondBrainError=n instanceof Error?n.message:"Failed to browse folder"}finally{e.secondBrainLoading=!1}}}async function zh(e,t){if(!(!e.client||!e.connected)){e.secondBrainLoading=!0;try{const n=await e.client.request("secondBrain.memoryBankEntry",{path:t});e.secondBrainSelectedEntry=n}catch(n){console.error("[SecondBrain] Failed to load entry:",n),e.secondBrainError=n instanceof Error?n.message:"Failed to load entry"}finally{e.secondBrainLoading=!1}}}async function Kh(e){if(!(!e.client||!e.connected)){e.secondBrainSyncing=!0;try{const t=await e.client.request("secondBrain.sync",{});e.secondBrainAiPacket={snapshot:t.snapshot??null}}catch(t){console.error("[SecondBrain] Sync failed:",t),e.secondBrainError=t instanceof Error?t.message:"Sync failed"}finally{e.secondBrainSyncing=!1}}}const Os=Object.freeze(Object.defineProperty({__proto__:null,browseFolder:Uh,loadSecondBrain:Nh,loadSecondBrainEntry:zh,syncSecondBrain:Kh},Symbol.toStringTag,{value:"Module"}));var Y1=Object.defineProperty,J1=Object.getOwnPropertyDescriptor,se=(e,t,n,s)=>{for(var i=s>1?void 0:s?J1(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&Y1(t,n,i),i};let Z=class extends He{constructor(){super(...arguments),this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainVaultHealth=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this._unsubs=[]}createRenderRoot(){return this}get client(){return this.ctx.gateway}get connected(){return this.ctx.connected}connectedCallback(){super.connectedCallback(),this._unsubs.push(Oe.on("refresh-requested",e=>{e.target==="second-brain"&&this._refresh()})),this._refresh()}disconnectedCallback(){for(const e of this._unsubs)e();this._unsubs=[],super.disconnectedCallback()}render(){return Q1({connected:this.ctx.connected,loading:this.secondBrainLoading,error:this.secondBrainError,subtab:this.secondBrainSubtab,identity:this.secondBrainIdentity,memoryBank:this.secondBrainMemoryBank,researchData:this.secondBrainResearchData,fileTree:this.secondBrainFileTree,fileTreeLoading:this.secondBrainFileTreeLoading,fileSearchQuery:this.secondBrainFileSearchQuery,fileSearchResults:this.secondBrainFileSearchResults,selectedEntry:this.secondBrainSelectedEntry,searchQuery:this.secondBrainSearchQuery,browsingFolder:this.secondBrainBrowsingFolder,folderEntries:this.secondBrainFolderEntries,folderName:this.secondBrainFolderName,aiPacket:this.secondBrainAiPacket,sourcesData:this.secondBrainSourcesData,vaultHealth:this.secondBrainVaultHealth,syncing:this.secondBrainSyncing,onSubtabChange:e=>this._onSubtabChange(e),onSelectEntry:e=>this._onSelectEntry(e),onBrowseFolder:e=>this._onBrowseFolder(e),onBack:()=>this._onBack(),onSearch:e=>this._onSearch(e),onFileSearch:e=>this._onFileSearch(e),onFileSelect:e=>this._onFileSelect(e),onSync:()=>this._onSync(),onRefresh:()=>this._refresh(),onSaveViaChat:()=>this._onSaveViaChat(),onAddSource:()=>this._onAddSource()})}async _refresh(){await Nh(this),this.requestUpdate()}_onSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this._refresh().catch(t=>{console.error("[SecondBrain] Refresh after subtab change failed:",t),this.secondBrainError=t instanceof Error?t.message:"Failed to load data",this.secondBrainLoading=!1})}async _onSelectEntry(e){if(e.endsWith(".html")||e.endsWith(".htm")){try{const n=await this.ctx.gateway.request("secondBrain.memoryBankEntry",{path:e});n?.content&&this.ctx.openSidebar({content:n.content,mimeType:"text/html",filePath:e,title:n.name||e.split("/").pop()||"File"})}catch(n){console.error("[SecondBrain] Failed to open HTML file:",n)}return}await zh(this,e),this.requestUpdate()}async _onBrowseFolder(e){await Uh(this,e),this.requestUpdate()}_onBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}_onSearch(e){this.secondBrainSearchQuery=e}_onFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doFileSearch(e)}async _doFileSearch(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const t=await this.ctx.gateway.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=t.results??[])}catch(t){console.error("[SecondBrain] search failed:",t)}}async _onFileSelect(e){if(!(!this.ctx.gateway||!this.ctx.connected))try{const t=await this.ctx.gateway.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=e.endsWith(".html")||e.endsWith(".htm");this.ctx.openSidebar({content:t.content,mimeType:n?"text/html":"text/markdown",filePath:e,title:t.name||e.split("/").pop()||"File"})}}catch(t){console.error("[SecondBrain] Failed to open file:",t),this.ctx.addToast("Failed to open file","error")}}async _onSync(){await Kh(this),this.requestUpdate()}_onSaveViaChat(){Oe.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:"I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save."})}_onAddSource(){Oe.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:"I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect."})}};se([gi({context:ps,subscribe:!0})],Z.prototype,"ctx",2);se([g()],Z.prototype,"secondBrainSubtab",2);se([g()],Z.prototype,"secondBrainLoading",2);se([g()],Z.prototype,"secondBrainError",2);se([g()],Z.prototype,"secondBrainIdentity",2);se([g()],Z.prototype,"secondBrainMemoryBank",2);se([g()],Z.prototype,"secondBrainAiPacket",2);se([g()],Z.prototype,"secondBrainSourcesData",2);se([g()],Z.prototype,"secondBrainResearchData",2);se([g()],Z.prototype,"secondBrainSelectedEntry",2);se([g()],Z.prototype,"secondBrainSearchQuery",2);se([g()],Z.prototype,"secondBrainSyncing",2);se([g()],Z.prototype,"secondBrainBrowsingFolder",2);se([g()],Z.prototype,"secondBrainFolderEntries",2);se([g()],Z.prototype,"secondBrainFolderName",2);se([g()],Z.prototype,"secondBrainVaultHealth",2);se([g()],Z.prototype,"secondBrainFileTree",2);se([g()],Z.prototype,"secondBrainFileTreeLoading",2);se([g()],Z.prototype,"secondBrainFileSearchQuery",2);se([g()],Z.prototype,"secondBrainFileSearchResults",2);Z=se([_n("gm-second-brain")],Z);var X1=Object.defineProperty,Z1=Object.getOwnPropertyDescriptor,qh=e=>{throw TypeError(e)},G=(e,t,n,s)=>{for(var i=s>1?void 0:s?Z1(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&X1(t,n,i),i},Wh=(e,t,n)=>t.has(e)||qh("Cannot "+n),e2=(e,t,n)=>(Wh(e,t,"read from private field"),n?n.call(e):t.get(e)),t2=(e,t,n)=>t.has(e)?qh("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,n),n2=(e,t,n,s)=>(Wh(e,t,"write to private field"),t.set(e,n),n),js;let V=class extends He{constructor(){super(...arguments),t2(this,js),this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=X(),this.todayViewMode="brief",this.dailyBrief=null,this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLog=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.todayEditingTaskId=null,this.todayShowCompleted=!1,this.todayQueueResults=[],this.inboxItems=[],this.inboxLoading=!1,this.inboxCount=0,this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,this.inboxSortOrder="newest",this.trustSummary=null}get ctx(){return e2(this,js)}set ctx(e){n2(this,js,e)}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this.ctx?.connected&&this._loadAll()})}get _state(){return{client:this.ctx?.gateway??null,connected:this.ctx?.connected??!1,myDayLoading:this.myDayLoading,myDayError:this.myDayError,dailyBrief:this.dailyBrief,dailyBriefLoading:this.dailyBriefLoading,dailyBriefError:this.dailyBriefError,agentLog:this.agentLog,agentLogLoading:this.agentLogLoading,agentLogError:this.agentLogError,briefNotes:this.briefNotes,todaySelectedDate:this.todaySelectedDate,todayViewMode:this.todayViewMode,todayTasks:this.todayTasks,todayTasksLoading:this.todayTasksLoading,trustSummary:this.trustSummary,inboxItems:this.inboxItems,inboxLoading:this.inboxLoading,inboxCount:this.inboxCount,loadBriefNotes:()=>this._loadBriefNotes()}}_syncFromState(e){this.myDayLoading=e.myDayLoading??!1,this.myDayError=e.myDayError??null,this.dailyBrief=e.dailyBrief??null,this.dailyBriefLoading=e.dailyBriefLoading??!1,this.dailyBriefError=e.dailyBriefError??null,this.agentLog=e.agentLog??null,this.agentLogLoading=e.agentLogLoading??!1,this.agentLogError=e.agentLogError??null,this.briefNotes=e.briefNotes??{},this.todayTasks=e.todayTasks??[],this.todayTasksLoading=e.todayTasksLoading??!1,this.trustSummary=e.trustSummary??null,this.inboxItems=e.inboxItems??[],this.inboxLoading=e.inboxLoading??!1,this.inboxCount=e.inboxCount??0}async _loadAll(){const e=this._state;await ds(e),this._syncFromState(e),this._loadDecisionCards()}async _loadBriefOnly(){const e=this._state;await yn(e),this._syncFromState(e)}async _loadBriefNotes(){const e=this.ctx?.gateway;if(!e||!this.ctx?.connected)return;const t=this.todaySelectedDate;try{const n=await e.request("briefNotes.get",{date:t});this.briefNotes=n.notes??{}}catch(n){console.error("[GmToday] Brief notes load error:",n),this.briefNotes={}}}async _loadDecisionCards(){if(!(!this.ctx?.gateway||!this.ctx?.connected))try{const t=this._state;this.todayQueueResults=await xu(t)}catch{}}async refresh(){await this._loadAll()}_handleDatePrev(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()-1),this.todaySelectedDate=X(e),this._loadBriefOnly()}_handleDateNext(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()+1);const t=X(),n=X(e);n>t||(this.todaySelectedDate=n,this._loadBriefOnly())}_handleDateToday(){this.todaySelectedDate=X(),this._loadAll()}async _handleDailyBriefRefresh(){await this._loadBriefOnly()}async _handleDailyBriefGenerate(){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected)){this.dailyBriefLoading=!0;try{await e.request("dailyBrief.generate",{}),await this._loadBriefOnly()}catch(t){this.dailyBriefError=t instanceof Error?t.message:"Failed to generate brief"}finally{this.dailyBriefLoading=!1}}}_handleDailyBriefOpenInObsidian(){const e=this.dailyBrief?.date;Wo(e)}async _handleBriefSave(e){const t=this.ctx?.gateway;if(!t||!this.ctx?.connected)return;const n=this.dailyBrief?.date||this.todaySelectedDate;try{await t.request("dailyBrief.update",{date:n,content:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(s){console.error("[GmToday] Brief save failed:",s),this.ctx?.addToast?.("Failed to save brief","error")}}async _handleBriefToggleCheckbox(e,t){const n=this.ctx?.gateway;if(!n||!this.ctx?.connected)return;const s=this.dailyBrief?.date||this.todaySelectedDate;try{await n.request("dailyBrief.toggleCheckbox",{date:s,index:e,checked:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(i){console.error("[GmToday] Checkbox toggle failed:",i)}}_handleViewModeChange(e){this.todayViewMode=e}_handleStartMorningSet(){this.ctx?.setTab?.("chat"),this.ctx?.send?.("chat.send",{message:"Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan."})}_handleEveningCapture(){this.ctx?.setTab?.("chat"),this.ctx?.send?.("chat.send",{message:`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`})}async _handleTaskStatusChange(e,t){const n=this.ctx?.gateway;if(!n||!this.ctx?.connected)return;const s=t==="complete"?"pending":"complete";try{await n.request("tasks.update",{id:e,status:s,completedAt:s==="complete"?new Date().toISOString():null});const i=this._state;await Jn(i),this.todayTasks=i.todayTasks??[],this.todayTasksLoading=i.todayTasksLoading??!1}catch(i){console.error("[GmToday] Task status change failed:",i)}}async _handleCreateTask(e){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected))try{await t.request("tasks.create",{title:e,dueDate:X(),priority:"medium",source:"chat"});const n=this._state;await Jn(n),this.todayTasks=n.todayTasks??[],this.todayTasksLoading=n.todayTasksLoading??!1}catch(n){console.error("[GmToday] Create task failed:",n),this.ctx?.addToast?.("Failed to create task","error")}}_handleEditTask(e){this.todayEditingTaskId=e}async _handleUpdateTask(e,t){const n=this.ctx?.gateway;if(!(!n||!this.ctx?.connected))try{await n.request("tasks.update",{id:e,...t}),this.todayEditingTaskId=null;const s=this._state;await Jn(s),this.todayTasks=s.todayTasks??[],this.todayTasksLoading=s.todayTasksLoading??!1}catch(s){console.error("[GmToday] Update task failed:",s),this.ctx?.addToast?.("Failed to update task","error")}}_handleToggleCompleted(){this.todayShowCompleted=!this.todayShowCompleted}async _handleViewTaskOutput(e){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected))try{const s=(await t.request("queue.list",{limit:100}))?.items?.find(o=>o.sourceTaskId===e);if(!s?.result?.outputPath){this.ctx?.addToast?.("No output available for this task","info");return}const i=await t.request("queue.readOutput",{path:s.result.outputPath}),a=s.result.outputPath.split("/").pop()??"Agent Output";this.ctx?.openSidebar?.({content:i.content,mimeType:"text/markdown",filePath:s.result.outputPath,title:a})}catch(n){console.error("[GmToday] View task output failed:",n),this.ctx?.addToast?.("Failed to load agent output","error")}}_handleStartTask(e){this.dispatchEvent(new CustomEvent("today-start-task",{detail:{taskId:e},bubbles:!0,composed:!0}))}async _handleDecisionApprove(e){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected))try{await t.request("queue.approve",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(n=>n.id!==e)}catch(n){console.error("[GmToday] Approve failed:",n),this.ctx?.addToast?.("Failed to approve","error")}}async _handleDecisionReject(e){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected))try{await t.request("queue.reject",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(n=>n.id!==e)}catch(n){console.error("[GmToday] Reject failed:",n),this.ctx?.addToast?.("Failed to reject","error")}}async _handleDecisionDismiss(e){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected))try{await t.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(n=>n.id!==e)}catch(n){console.error("[GmToday] Dismiss failed:",n),this.ctx?.addToast?.("Failed to dismiss","error")}}async _handleDecisionMarkComplete(e){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected))try{const n=this.todayQueueResults?.find(s=>s.id===e);n?.sourceTaskId&&await t.request("tasks.update",{id:n.sourceTaskId,status:"complete"}),await t.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(s=>s.id!==e),this.ctx?.addToast?.("Task marked complete","success")}catch(n){console.error("[GmToday] Mark complete failed:",n),this.ctx?.addToast?.("Failed to mark complete","error")}}async _handleDecisionRate(e,t,n){const s=this.ctx?.gateway;if(!(!s||!this.ctx?.connected))try{await s.request("trust.rate",{workflow:t,rating:n});const i=n<7;this.todayQueueResults=this.todayQueueResults.map(a=>a.id===e?{...a,userRating:n,feedbackPending:i}:a),i?this.ctx?.addToast?.(`Rated ${t} ${n}/10 — what could be better?`,"info"):(this.todayQueueResults?.find(o=>o.id===e)?.source==="cron"&&(await s.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(o=>o.id!==e)),this.ctx?.addToast?.(`Rated ${t} ${n}/10`,"success"))}catch(i){console.error("[GmToday] Rate failed:",i),this.ctx?.addToast?.("Failed to submit rating","error")}}async _handleDecisionFeedback(e,t,n){const s=this.ctx?.gateway;if(!(!s||!this.ctx?.connected))try{n&&(await s.request("trust.feedback",{workflow:t,feedback:n}),this.ctx?.addToast?.(`Feedback saved for ${t} — will apply next time`,"success")),this.todayQueueResults?.find(a=>a.id===e)?.source==="cron"&&await s.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.map(a=>a.id===e?{...a,feedbackPending:!1}:a).filter(a=>!(a.id===e&&a.source==="cron"))}catch(i){console.error("[GmToday] Feedback failed:",i),this.ctx?.addToast?.("Failed to save feedback","error")}}_handleDecisionViewOutput(e,t){const n=this.ctx?.gateway;if(!n||!this.ctx?.connected){this.ctx?.addToast?.("Not connected to gateway","error");return}n.request("queue.readOutput",{path:t}).then(s=>{const i=t.split("/").pop()??"Agent Output";this.ctx?.openSidebar?.({content:s.content,mimeType:"text/markdown",filePath:t,title:i})}).catch(s=>{console.error("[GmToday] View output failed:",s),this.dispatchEvent(new CustomEvent("today-open-file",{detail:{path:t},bubbles:!0,composed:!0}))})}_handleDecisionOpenChat(e){this.dispatchEvent(new CustomEvent("today-decision-open-chat",{detail:{id:e,item:this.todayQueueResults?.find(t=>t.id===e)},bubbles:!0,composed:!0}))}async _handleInboxRefresh(){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected)){this.inboxLoading=!0;try{const t=await e.request("inbox.list",{status:"pending",limit:50});this.inboxItems=t.items,this.inboxCount=t.pendingCount}catch(t){console.error("[GmToday] Inbox load failed:",t)}finally{this.inboxLoading=!1}}}async _handleInboxScore(e,t,n){const s=this.ctx?.gateway;if(!(!s||!this.ctx?.connected))try{await s.request("inbox.score",{itemId:e,score:t,feedback:n}),this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,await this._handleInboxRefresh()}catch(i){console.error("[GmToday] Inbox score failed:",i)}}async _handleInboxDismiss(e){const t=this.ctx?.gateway;if(!(!t||!this.ctx?.connected))try{await t.request("inbox.dismiss",{itemId:e}),await this._handleInboxRefresh()}catch(n){console.error("[GmToday] Inbox dismiss failed:",n)}}async _handleInboxMarkAll(){const e=this.ctx?.gateway;if(!(!e||!this.ctx?.connected))try{await e.request("inbox.markAllComplete",{}),await this._handleInboxRefresh()}catch(t){console.error("[GmToday] Inbox mark all failed:",t)}}_handleInboxViewOutput(e){const t=this.inboxItems?.find(s=>s.id===e);if(!t)return;const n=this.ctx?.gateway;if(t.outputPath&&n){n.request("files.read",{path:t.outputPath,maxSize:5e5}).then(s=>{s?.content&&this.ctx?.openSidebar?.({content:s.content,mimeType:"text/markdown",filePath:t.outputPath,title:t.title})}).catch(s=>{console.error("[GmToday] Inbox view output failed:",s)});return}t.proofDocSlug&&this.dispatchEvent(new CustomEvent("today-open-proof",{detail:{slug:t.proofDocSlug},bubbles:!0,composed:!0}))}_handleInboxViewProof(e){const t=this.inboxItems?.find(n=>n.id===e);t?.proofDocSlug&&this.dispatchEvent(new CustomEvent("today-open-proof",{detail:{slug:t.proofDocSlug},bubbles:!0,composed:!0}))}_handleInboxOpenChat(e){this.dispatchEvent(new CustomEvent("today-inbox-open-chat",{detail:{itemId:e,item:this.inboxItems?.find(t=>t.id===e)},bubbles:!0,composed:!0}))}_handleInboxSetScoring(e,t){e!==this.inboxScoringId&&(this.inboxFeedbackText=""),this.inboxScoringId=e,this.inboxScoringValue=t??7}_handleInboxFeedbackChange(e){this.inboxFeedbackText=e}_handleInboxSortToggle(){this.inboxSortOrder=this.inboxSortOrder==="newest"?"oldest":"newest"}async _handleTrustDailyRate(e){const t=this.ctx?.gateway;if(t)try{await t.request("trust.dailyRate",{rating:e}),this.trustSummary&&(this.trustSummary={...this.trustSummary,todayRated:!0})}catch(n){console.error("[GmToday] Daily rate failed:",n),this.ctx?.addToast?.("Failed to submit daily rating","error")}}_handleNavigateToTrust(){this.ctx?.setTab?.("trust")}_handleOpenFile(e){this.dispatchEvent(new CustomEvent("today-open-file",{detail:{path:e},bubbles:!0,composed:!0}))}renderToolbar(){return Rh({connected:this.ctx?.connected??!1,onRefresh:()=>{this.refresh()},selectedDate:this.todaySelectedDate,onDatePrev:()=>this._handleDatePrev(),onDateNext:()=>this._handleDateNext(),onDateToday:()=>this._handleDateToday(),viewMode:this.todayViewMode,onViewModeChange:e=>this._handleViewModeChange(e),focusPulseActive:!1,onStartMorningSet:()=>this._handleStartMorningSet(),inboxItems:this.inboxItems,inboxCount:this.inboxCount,onEveningCapture:()=>this._handleEveningCapture()})}render(){const e={connected:this.ctx?.connected??!1,loading:this.myDayLoading,error:this.myDayError,onRefresh:()=>{this.refresh()},dailyBrief:this.dailyBrief,dailyBriefLoading:this.dailyBriefLoading,dailyBriefError:this.dailyBriefError,onBriefRefresh:()=>{this._handleDailyBriefRefresh()},onBriefGenerate:()=>{this._handleDailyBriefGenerate()},onBriefOpenInObsidian:()=>this._handleDailyBriefOpenInObsidian(),onBriefSave:t=>{this._handleBriefSave(t)},onBriefToggleCheckbox:(t,n)=>{this._handleBriefToggleCheckbox(t,n)},onOpenFile:t=>this._handleOpenFile(t),selectedDate:this.todaySelectedDate,onDatePrev:()=>this._handleDatePrev(),onDateNext:()=>this._handleDateNext(),onDateToday:()=>this._handleDateToday(),viewMode:this.todayViewMode,onViewModeChange:t=>this._handleViewModeChange(t),agentLog:this.agentLog,agentLogLoading:this.agentLogLoading,agentLogError:this.agentLogError,onAgentLogRefresh:()=>{this.refresh()},focusPulseActive:!1,onStartMorningSet:()=>this._handleStartMorningSet(),todayTasks:this.todayTasks,todayTasksLoading:this.todayTasksLoading,onToggleTaskComplete:(t,n)=>{this._handleTaskStatusChange(t,n)},onStartTask:t=>this._handleStartTask(t),onViewTaskOutput:t=>{this._handleViewTaskOutput(t)},onCreateTask:t=>{this._handleCreateTask(t)},onEditTask:t=>this._handleEditTask(t),onUpdateTask:(t,n)=>{this._handleUpdateTask(t,n)},editingTaskId:this.todayEditingTaskId,showCompletedTasks:this.todayShowCompleted,onToggleCompletedTasks:()=>this._handleToggleCompleted(),decisionCards:(this.todayQueueResults??[]).length>0?{items:this.todayQueueResults,onApprove:t=>{this._handleDecisionApprove(t)},onReject:t=>{this._handleDecisionReject(t)},onDismiss:t=>{this._handleDecisionDismiss(t)},onViewOutput:(t,n)=>this._handleDecisionViewOutput(t,n),onOpenChat:t=>this._handleDecisionOpenChat(t),onMarkComplete:t=>{this._handleDecisionMarkComplete(t)},onRate:(t,n,s)=>{this._handleDecisionRate(t,n,s)},onFeedback:(t,n,s)=>{this._handleDecisionFeedback(t,n,s)}}:void 0,inboxItems:this.inboxItems,inboxLoading:this.inboxLoading,inboxCount:this.inboxCount,inboxScoringId:this.inboxScoringId,inboxScoringValue:this.inboxScoringValue,inboxFeedbackText:this.inboxFeedbackText,onInboxViewOutput:t=>this._handleInboxViewOutput(t),onInboxViewProof:t=>this._handleInboxViewProof(t),onInboxOpenChat:t=>this._handleInboxOpenChat(t),onInboxDismiss:t=>{this._handleInboxDismiss(t)},onInboxScore:(t,n,s)=>{this._handleInboxScore(t,n,s)},onInboxSetScoring:(t,n)=>this._handleInboxSetScoring(t,n),onInboxFeedbackChange:t=>this._handleInboxFeedbackChange(t),onInboxSortToggle:()=>this._handleInboxSortToggle(),inboxSortOrder:this.inboxSortOrder,onInboxMarkAll:()=>{this._handleInboxMarkAll()},trustSummary:this.trustSummary,onTrustDailyRate:t=>{this._handleTrustDailyRate(t)},onNavigateToTrust:()=>this._handleNavigateToTrust(),onEveningCapture:()=>this._handleEveningCapture()};return q$(e)}};js=new WeakMap;G([gi({context:ps,subscribe:!0})],V.prototype,"ctx",1);G([g()],V.prototype,"myDayLoading",2);G([g()],V.prototype,"myDayError",2);G([g()],V.prototype,"todaySelectedDate",2);G([g()],V.prototype,"todayViewMode",2);G([g()],V.prototype,"dailyBrief",2);G([g()],V.prototype,"dailyBriefLoading",2);G([g()],V.prototype,"dailyBriefError",2);G([g()],V.prototype,"agentLog",2);G([g()],V.prototype,"agentLogLoading",2);G([g()],V.prototype,"agentLogError",2);G([g()],V.prototype,"briefNotes",2);G([g()],V.prototype,"todayTasks",2);G([g()],V.prototype,"todayTasksLoading",2);G([g()],V.prototype,"todayEditingTaskId",2);G([g()],V.prototype,"todayShowCompleted",2);G([g()],V.prototype,"todayQueueResults",2);G([g()],V.prototype,"inboxItems",2);G([g()],V.prototype,"inboxLoading",2);G([g()],V.prototype,"inboxCount",2);G([g()],V.prototype,"inboxScoringId",2);G([g()],V.prototype,"inboxScoringValue",2);G([g()],V.prototype,"inboxFeedbackText",2);G([g()],V.prototype,"inboxSortOrder",2);G([g()],V.prototype,"trustSummary",2);V=G([_n("gm-today")],V);const Xa={all:{icon:"📊",label:"All"},productivity:{icon:"📋",label:"Productivity"},personal:{icon:"🧑",label:"Personal"},business:{icon:"💼",label:"Business"},system:{icon:"⚙️",label:"System"},custom:{icon:"✨",label:"Custom"}},s2=[{id:"morning-overview",name:"Morning Overview",category:"productivity",description:"Tasks, calendar, priorities, and focus score",prompt:"Create a morning overview dashboard that shows my top priorities, today's calendar events, active queue items, and readiness score. Use clean CSS grid layout."},{id:"weekly-impact",name:"Weekly Impact",category:"productivity",description:"What you accomplished this week",prompt:"Create a weekly impact dashboard showing tasks completed vs created this week, agent task outcomes, trust score changes, and top 3 wins. Use CSS bar charts."},{id:"agent-activity",name:"Agent Activity",category:"system",description:"Queue throughput, personas, and trust scores",prompt:"Create an agent activity dashboard showing queue stats (pending, processing, completed, failed), most active personas, cron skill execution log, and trust scores by workflow."},{id:"health-energy",name:"Health & Energy",category:"personal",description:"Sleep, readiness, and activity from Oura",prompt:"Create a health and energy dashboard showing last night's sleep score, 7-day sleep trend, today's readiness score, activity level, and HRV trend. Pull from Oura integration."},{id:"goals-tracker",name:"Goals Tracker",category:"personal",description:"Active goals with progress bars",prompt:"Create a goals tracker dashboard showing my active goals as cards with progress bars, grouped by area (health, career, finance, personal), with overall completion percentage."},{id:"content-performance",name:"Content Performance",category:"business",description:"Social posts and content pipeline",prompt:"Create a content performance dashboard showing recent content pieces, content pipeline status, engagement metrics from X intelligence, and a content calendar for the next 7 days."}];function i2(e){return e==="global"?r`<span class="dashboard-card-scope">Global</span>`:r`<span class="dashboard-card-scope">${e}</span>`}function jh(e){return Date.now()-new Date(e).getTime()>1440*60*1e3}function Hh(e){const t=(e.title+" "+(e.description??"")).toLowerCase();return t.includes("health")||t.includes("sleep")||t.includes("oura")||t.includes("energy")||t.includes("goal")?"personal":t.includes("agent")||t.includes("queue")||t.includes("trust")||t.includes("skill")?"system":t.includes("revenue")||t.includes("business")||t.includes("content")||t.includes("metric")?"business":t.includes("task")||t.includes("calendar")||t.includes("morning")||t.includes("impact")||t.includes("weekly")?"productivity":"custom"}function _c(e,t){const n=Xa[e.category]??Xa.custom;return r`
    <div class="dashboard-card dashboard-card--template">
      <button
        class="dashboard-card-main"
        @click=${()=>t(e.prompt)}
      >
        <div class="dashboard-card-title">${e.name}</div>
        <div class="dashboard-card-desc">${e.description}</div>
        <div class="dashboard-card-meta">
          <span class="dashboard-card-scope">${n.icon} ${n.label}</span>
          <span class="dashboard-card-template-label">Template</span>
        </div>
      </button>
    </div>
  `}function a2(e,t,n,s){const i=jh(e.updatedAt);return r`
    <div class="dashboard-card ${e.pinned?"dashboard-card--pinned":""}">
      <button
        class="dashboard-card-main"
        @click=${()=>t(e.id)}
      >
        <div class="dashboard-card-title">
          ${e.pinned?r`<span class="pin-icon" title="Pinned">\u{1F4CC}</span>`:p}
          ${e.title}
        </div>
        ${e.description?r`<div class="dashboard-card-desc">${e.description}</div>`:p}
        <div class="dashboard-card-meta">
          ${i2(e.scope)}
          <span>${N(new Date(e.updatedAt).getTime())}</span>
          ${i?r`<span class="dashboard-card-stale" title="Last updated over 24 hours ago">\u{1F7E1} Stale</span>`:p}
        </div>
      </button>
      <div class="dashboard-card-actions">
        ${s?r`<button
              class="dashboard-card-pin"
              title="${e.pinned?"Unpin":"Pin"}"
              @click=${a=>{a.stopPropagation(),s(e.id)}}
            >${e.pinned?"📌":"📅"}</button>`:p}
        <button
          class="dashboard-card-delete"
          title="Delete dashboard"
          @click=${a=>{a.stopPropagation(),confirm(`Delete "${e.title}"?`)&&n(e.id)}}
        >&times;</button>
      </div>
    </div>
  `}function o2(e){const{activeDashboardHtml:t,activeDashboardManifest:n,isWorking:s}=e;if(!t||!n)return p;const i=jh(n.updatedAt);return r`
    <section class="dashboards-container">
      <div class="dashboards-active-header">
        <button
          class="dashboards-back-btn"
          @click=${()=>e.onBack()}
        >&larr; All Dashboards</button>
        <div class="dashboards-active-title-group">
          <span class="dashboards-active-title">${n.title}</span>
          <span class="dashboards-active-meta">
            ${N(new Date(n.updatedAt).getTime())}
            ${i?r` &middot; <span class="dashboard-card-stale">\u{1F7E1} Stale</span>`:p}
          </span>
        </div>
        <button
          class="dashboards-session-btn"
          @click=${()=>e.onOpenSession(n.id)}
        >${s?"Working...":"Edit in Chat"}</button>
        <button
          class="dashboards-refresh-btn"
          @click=${()=>e.onRefresh()}
        >Refresh</button>
      </div>
      <div class="dashboards-content">
        <div class="dashboard-render">
          ${at(tm(t))}
        </div>
      </div>
    </section>
  `}function r2(e,t,n){const s={all:t.length};for(const i of t){const a=Hh(i);s[a]=(s[a]??0)+1}return r`
    <div class="dashboards-category-bar">
      ${Object.entries(Xa).map(([i,a])=>r`
        <button
          class="dashboards-category-btn ${e===i?"active":""}"
          @click=${()=>n(i)}
        >
          ${a.icon} ${a.label}
          ${s[i]?r`<span class="category-count">${s[i]}</span>`:p}
        </button>
      `)}
    </div>
  `}function l2(e){const{loading:t,dashboards:n}=e,s=e.categoryFilter??"all",i=e.templates??s2,o=[...s==="all"?n??[]:(n??[]).filter(u=>Hh(u)===s)].sort((u,l)=>u.pinned&&!l.pinned?-1:!u.pinned&&l.pinned?1:new Date(l.updatedAt).getTime()-new Date(u.updatedAt).getTime()),c=s==="all"?i:i.filter(u=>u.category===s),d=(n??[]).length>0;return r`
    <section class="dashboards-container">
      <div class="dashboards-toolbar">
        <span class="dashboards-count">${(n??[]).length} dashboard${(n??[]).length===1?"":"s"}</span>
        <button
          class="dashboards-create-btn"
          @click=${()=>e.onCreateViaChat()}
        >+ Create via Chat</button>
      </div>

      ${d&&e.onCategoryFilter?r2(s,n??[],e.onCategoryFilter):p}

      ${t?r`<div class="dashboards-loading"><div class="spinner"></div> Loading dashboards...</div>`:o.length===0&&!d?r`
              <div class="dashboards-empty">
                <div class="dashboards-empty-icon">&#128202;</div>
                <div class="dashboards-empty-title">No dashboards yet</div>
                <div class="dashboards-empty-hint">
                  Dashboards are AI-generated views your ally builds for you.
                  Pick a template below or describe what you want to see.
                </div>
              </div>
              <div class="dashboards-templates-section">
                <h3 class="dashboards-section-title">Start from a template</h3>
                <div class="dashboards-grid">
                  ${i.map(u=>_c(u,e.onCreateViaChat))}
                </div>
              </div>
            `:r`
              <div class="dashboards-grid">
                ${o.map(u=>a2(u,e.onSelectDashboard,e.onDeleteDashboard,e.onTogglePin))}
              </div>
              ${c.length>0?r`
                <div class="dashboards-templates-section">
                  <h3 class="dashboards-section-title">Create from template</h3>
                  <div class="dashboards-grid dashboards-grid--templates">
                    ${c.map(u=>_c(u,e.onCreateViaChat))}
                  </div>
                </div>
              `:p}
            `}
    </section>
  `}function c2(e){return e.error?r`
      <section class="dashboards-container">
        <div class="dashboards-error">
          <span class="error-icon">\u26A0</span>
          <p>${e.error}</p>
          <button class="retry-button" @click=${()=>e.onRefresh()}>Retry</button>
        </div>
      </section>
    `:e.activeDashboardHtml&&e.activeDashboardManifest?o2(e):l2(e)}async function Vh(e,t){if(!e.client||!e.connected){e.dashboardsError="Not connected to gateway";return}e.dashboardsLoading=!0,e.dashboardsError=null;try{const n=await e.client.request("dashboards.list",t?{scope:t}:{});e.dashboardsList=n.dashboards,e.activeDashboardId=n.activeDashboard}catch(n){e.dashboardsError=n instanceof Error?n.message:"Failed to load dashboards"}finally{e.dashboardsLoading=!1}}async function Gh(e,t){if(!e.client||!e.connected){e.dashboardsError="Not connected to gateway";return}e.dashboardsLoading=!0,e.dashboardsError=null;try{const n=await e.client.request("dashboards.get",{id:t});e.activeDashboardId=t,e.activeDashboardManifest=n.manifest,e.activeDashboardHtml=n.html}catch(n){e.dashboardsError=n instanceof Error?n.message:"Failed to load dashboard"}finally{e.dashboardsLoading=!1}}async function Qh(e,t){if(!e.client||!e.connected)return;const n=(e.dashboardsList??[]).find(i=>i.id===t);if(!n)return;const s=!n.pinned;try{await e.client.request("dashboards.save",{id:n.id,title:n.title,description:n.description,scope:n.scope,pinned:s}),n.pinned=s,e.dashboardsList=[...e.dashboardsList??[]]}catch(i){e.dashboardsError=i instanceof Error?i.message:"Failed to toggle pin"}}async function Yh(e,t){if(!e.client||!e.connected)return!1;try{return await e.client.request("dashboards.remove",{id:t}),e.dashboardsList=(e.dashboardsList??[]).filter(n=>n.id!==t),e.activeDashboardId===t&&(e.activeDashboardId=null,e.activeDashboardHtml=null,e.activeDashboardManifest=null),!0}catch(n){return e.dashboardsError=n instanceof Error?n.message:"Failed to delete dashboard",!1}}const Qn=Object.freeze(Object.defineProperty({__proto__:null,deleteDashboard:Yh,loadDashboard:Gh,loadDashboards:Vh,toggleDashboardPin:Qh},Symbol.toStringTag,{value:"Module"}));var d2=Object.defineProperty,u2=Object.getOwnPropertyDescriptor,Ge=(e,t,n,s)=>{for(var i=s>1?void 0:s?u2(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&d2(t,n,i),i};let Be=class extends He{constructor(){super(...arguments),this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardCategoryFilter=null,this._workingSessionIds=new Set,this._unsubs=[]}createRenderRoot(){return this}get client(){return this.ctx.gateway}get connected(){return this.ctx.connected}connectedCallback(){super.connectedCallback(),this._unsubs.push(Oe.on("refresh-requested",e=>{e.target==="dashboards"&&this._refresh()})),this._refresh()}disconnectedCallback(){for(const e of this._unsubs)e();this._unsubs=[],super.disconnectedCallback()}render(){const e=this.activeDashboardManifest?.sessionId;return c2({connected:this.ctx.connected,loading:this.dashboardsLoading,error:this.dashboardsError,dashboards:this.dashboardsList,activeDashboardId:this.activeDashboardId,activeDashboardHtml:this.activeDashboardHtml,activeDashboardManifest:this.activeDashboardManifest,isWorking:e?this._workingSessionIds.has(e):!1,onSelectDashboard:t=>this._onSelectDashboard(t),onDeleteDashboard:t=>this._onDeleteDashboard(t),onCreateViaChat:t=>this._onCreateViaChat(t),onTogglePin:t=>this._onTogglePin(t),categoryFilter:this.dashboardCategoryFilter??void 0,onCategoryFilter:t=>this._onCategoryFilter(t),onBack:()=>this._onBack(),onRefresh:()=>this._refresh(),onOpenSession:t=>this._onOpenSession(t)})}async _refresh(){await Vh(this),this.requestUpdate()}async _onSelectDashboard(e){if(await Gh(this,e),this.requestUpdate(),this.ctx.gateway&&this.ctx.connected)try{const t=await this.ctx.gateway.request("dashboards.openSession",{dashboardId:e});t?.sessionId&&(this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:t.sessionId}),Oe.emit("chat-navigate",{sessionKey:t.sessionId}))}catch(t){console.error("[Dashboards] Failed to init session on select:",t)}}async _onDeleteDashboard(e){await Yh(this,e),this.requestUpdate()}async _onTogglePin(e){await Qh(this,e),this.requestUpdate()}_onCreateViaChat(e){Oe.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:e??"I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more."})}_onCategoryFilter(e){this.dashboardCategoryFilter=e}_onBack(){this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null}_onOpenSession(e){const t=this.activeDashboardManifest?.sessionId;if(!t){this.ctx.addToast("No session for this dashboard","error");return}this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,Oe.emit("chat-navigate",{sessionKey:t,tab:"chat"})}};Ge([gi({context:ps,subscribe:!0})],Be.prototype,"ctx",2);Ge([g()],Be.prototype,"dashboardsList",2);Ge([g()],Be.prototype,"dashboardsLoading",2);Ge([g()],Be.prototype,"dashboardsError",2);Ge([g()],Be.prototype,"activeDashboardId",2);Ge([g()],Be.prototype,"activeDashboardHtml",2);Ge([g()],Be.prototype,"activeDashboardManifest",2);Ge([g()],Be.prototype,"dashboardCategoryFilter",2);Ge([g()],Be.prototype,"_workingSessionIds",2);Be=Ge([_n("gm-dashboards")],Be);var h2=Object.defineProperty,p2=Object.getOwnPropertyDescriptor,ie=(e,t,n,s)=>{for(var i=s>1?void 0:s?p2(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&h2(t,n,i),i};let ee=class extends He{constructor(){super(...arguments),this.selectedWorkspace=null,this.workspacesSearchQuery="",this.workspaceItemSearchQuery="",this.workspacesLoading=!1,this.workspacesCreateLoading=!1,this.workspacesError=null,this.workspaceExpandedFolders=new Set,this.taskFilter="outstanding",this.taskSort="due",this.taskSearch="",this.showCompletedTasks=!1,this.editingTaskId=null,this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null,this._unsubs=[]}createRenderRoot(){return this}get client(){return this.ctx.gateway}get connected(){return this.ctx.connected}connectedCallback(){super.connectedCallback(),this._unsubs.push(Oe.on("refresh-requested",e=>{(e.target==="workspaces"||e.target==="work")&&this._refresh()})),this._refresh()}disconnectedCallback(){for(const e of this._unsubs)e();this._unsubs=[],super.disconnectedCallback()}render(){return I$({connected:this.ctx.connected,workspaces:this.workspaces??[],selectedWorkspace:this.selectedWorkspace??null,searchQuery:this.workspacesSearchQuery,itemSearchQuery:this.workspaceItemSearchQuery,expandedFolders:this.workspaceExpandedFolders,loading:this.workspacesLoading,createLoading:this.workspacesCreateLoading,error:this.workspacesError,allTasks:this.allTasks??[],taskFilter:this.taskFilter,taskSort:this.taskSort,taskSearch:this.taskSearch,showCompletedTasks:this.showCompletedTasks,editingTaskId:this.editingTaskId,workspaceNames:(this.workspaces??[]).map(e=>e.name),browsePath:this.workspaceBrowsePath,browseEntries:this.workspaceBrowseEntries,breadcrumbs:this.workspaceBreadcrumbs,browseSearchQuery:this.workspaceBrowseSearchQuery,browseSearchResults:this.workspaceBrowseSearchResults,onSearch:e=>{this.workspacesSearchQuery=e},onItemSearch:e=>{this.workspaceItemSearchQuery=e},onSelectWorkspace:e=>this._onSelectWorkspace(e),onBack:()=>this._onBack(),onItemClick:e=>this._onItemClick(e),onSessionClick:e=>this._onSessionClick(e),onPinToggle:(e,t,n)=>this._onPinToggle(e,t,n),onPinSessionToggle:(e,t,n)=>this._onPinSessionToggle(e,t,n),onCreateWorkspace:e=>this._onCreateWorkspace(e),onDeleteWorkspace:e=>this._onDeleteWorkspace(e),onToggleFolder:e=>this._onToggleFolder(e),onTeamSetup:()=>this._onTeamSetup(),onToggleTaskComplete:(e,t)=>this._onToggleTaskComplete(e,t),onCreateTask:(e,t)=>this._onCreateTask(e,t),onSetTaskFilter:e=>{this.taskFilter=e},onSetTaskSort:e=>{this.taskSort=e},onSetTaskSearch:e=>{this.taskSearch=e},onToggleCompletedTasks:()=>{this.showCompletedTasks=!this.showCompletedTasks},onStartTask:e=>this._onStartTask(e),onEditTask:e=>{this.editingTaskId=e},onUpdateTask:(e,t)=>this._onUpdateTask(e,t),onBrowseFolder:e=>this._onBrowseFolder(e),onBrowseSearch:e=>this._onBrowseSearch(e),onBrowseBack:()=>this._onBrowseBack(),onCreateFolder:e=>this._onCreateFolder(e),onBatchPushToDrive:e=>this._onBatchPushToDrive(e)})}async _refresh(){await ys(this),this.allTasks=await Bt(this),this.requestUpdate()}async _onSelectWorkspace(e){this.workspaceItemSearchQuery="",await ja(this,e),this.requestUpdate()}_onBack(){this.selectedWorkspace=null,this.workspaceItemSearchQuery="",this._onBrowseBack()}async _onItemClick(e){const t=this.selectedWorkspace?.id,n=await Cu(this,e.path,t);if(!n){this.ctx.addToast("Failed to open "+e.name,"error");return}this.ctx.openSidebar({content:n.content,mimeType:n.mime,filePath:e.path,title:e.name})}_onSessionClick(e){e.key&&Oe.emit("chat-navigate",{sessionKey:e.key,tab:"chat"})}async _onPinToggle(e,t,n){await Eu(this,e,t,n)||this.ctx.addToast("Failed to update pin","error"),this.requestUpdate()}async _onPinSessionToggle(e,t,n){await Ru(this,e,t,n)||this.ctx.addToast("Failed to update session pin","error"),this.requestUpdate()}async _onCreateWorkspace(e){this.workspacesCreateLoading=!0;try{const t=await Lu(this,e);return t?(this.workspaceItemSearchQuery="",await ja(this,t),this.ctx.addToast("Created workspace: "+t.name,"success"),this.requestUpdate(),!0):(this.ctx.addToast("Failed to create workspace","error"),!1)}finally{this.workspacesCreateLoading=!1}}async _onDeleteWorkspace(e){if(!await Pu(this,e.id)){this.ctx.addToast("Failed to delete "+e.name,"error");return}this.ctx.addToast("Deleted workspace: "+e.name,"success"),this.allTasks=await Bt(this),this.requestUpdate()}_onToggleFolder(e){this.workspaceExpandedFolders=Du(this.workspaceExpandedFolders,e),this.requestUpdate()}_onTeamSetup(){Oe.emit("chat-navigate",{sessionKey:"new",tab:"chat",message:"I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple."})}async _onToggleTaskComplete(e,t){if(!await Iu(this,e,t)){this.ctx.addToast("Failed to update task","error");return}if(this.allTasks=await Bt(this),this.selectedWorkspace){const s=await Kt(this,this.selectedWorkspace.id);s&&(this.selectedWorkspace=s)}this.requestUpdate()}async _onCreateTask(e,t){const n=await Bu(this,e,t);if(!n){this.ctx.addToast("Failed to create task","error");return}if(this.ctx.addToast("Task created: "+n.title,"success"),this.allTasks=await Bt(this),this.selectedWorkspace){const s=await Kt(this,this.selectedWorkspace.id);s&&(this.selectedWorkspace=s)}this.requestUpdate()}async _onUpdateTask(e,t){if(!await Mu(this,e,t)){this.ctx.addToast("Failed to update task","error");return}if(this.editingTaskId=null,this.allTasks=await Bt(this),this.selectedWorkspace){const s=await Kt(this,this.selectedWorkspace.id);s&&(this.selectedWorkspace=s)}this.requestUpdate()}async _onStartTask(e){const t=await Ou(this,e);if(!t?.sessionId){this.ctx.addToast("Failed to open session for task","error");return}let n="";if(t.created&&!t.queueOutput){const s=[...this.allTasks??[],...this.selectedWorkspace?.tasks??[]].find(a=>a.id===e),i=s?.project?` (project: ${s.project})`:"";n="Let's work on: "+(s?.title??"this task")+i}this.allTasks=await Bt(this),this.requestUpdate(),Oe.emit("chat-navigate",{sessionKey:t.sessionId,tab:"chat",message:n})}async _onBrowseFolder(e){if(!this.selectedWorkspace)return;const t=await Fu(this,this.selectedWorkspace.id,e);t&&(this.workspaceBrowsePath=e,this.workspaceBrowseEntries=t.entries,this.workspaceBreadcrumbs=t.breadcrumbs)}async _onBrowseSearch(e){if(this.workspaceBrowseSearchQuery=e,!e.trim()||!this.selectedWorkspace){this.workspaceBrowseSearchResults=null;return}this.workspaceBrowseSearchResults=await Nu(this,this.selectedWorkspace.id,e)}_onBrowseBack(){this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null}async _onCreateFolder(e){if(!this.selectedWorkspace)return;const t=await Uu(this,this.selectedWorkspace.id,e);t&&this.workspaceBrowsePath&&await this._onBrowseFolder(this.workspaceBrowsePath),t&&this.ctx.addToast("Folder created","success")}async _onBatchPushToDrive(e){if(!(e.length===0||!this.ctx.gateway||!this.ctx.connected)){this.ctx.addToast("Uploading "+e.length+" files to Drive...","info");try{const t=await this.ctx.gateway.request("files.batchPushToDrive",{filePaths:e}),n=t?.results?.filter(i=>i.success).length??0,s=t?.results?.length??e.length;n===s?this.ctx.addToast("Uploaded "+n+" files to Google Drive","success"):this.ctx.addToast("Uploaded "+n+"/"+s+" files ("+(s-n)+" failed)","warning")}catch(t){const n=t instanceof Error?t.message:"Unknown error";this.ctx.addToast("Batch Drive upload failed: "+n,"error")}}}};ie([gi({context:ps,subscribe:!0})],ee.prototype,"ctx",2);ie([g()],ee.prototype,"workspaces",2);ie([g()],ee.prototype,"selectedWorkspace",2);ie([g()],ee.prototype,"workspacesSearchQuery",2);ie([g()],ee.prototype,"workspaceItemSearchQuery",2);ie([g()],ee.prototype,"workspacesLoading",2);ie([g()],ee.prototype,"workspacesCreateLoading",2);ie([g()],ee.prototype,"workspacesError",2);ie([g()],ee.prototype,"workspaceExpandedFolders",2);ie([g()],ee.prototype,"allTasks",2);ie([g()],ee.prototype,"taskFilter",2);ie([g()],ee.prototype,"taskSort",2);ie([g()],ee.prototype,"taskSearch",2);ie([g()],ee.prototype,"showCompletedTasks",2);ie([g()],ee.prototype,"editingTaskId",2);ie([g()],ee.prototype,"workspaceBrowsePath",2);ie([g()],ee.prototype,"workspaceBrowseEntries",2);ie([g()],ee.prototype,"workspaceBreadcrumbs",2);ie([g()],ee.prototype,"workspaceBrowseSearchQuery",2);ie([g()],ee.prototype,"workspaceBrowseSearchResults",2);ee=ie([_n("gm-work")],ee);const f2=/^data:/i,g2=/^https?:\/\//i;function m2(e){const t=e.agentsList?.agents??[],s=Wc(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",a=t.find(c=>c.id===s)?.identity,o=a?.avatarUrl??a?.avatar;if(o)return f2.test(o)||g2.test(o)?o:a?.avatarUrl}function Ac(e){const t=e.trim();if(!t)return t;const n=t.split(/\s+/);if(n.length>=2&&n.length%2===0){const c=n.length/2,d=n.slice(0,c).join(" "),u=n.slice(c).join(" ");if(d.toLowerCase()===u.toLowerCase())return d}const s=t.replace(/\s+/g," ").toLowerCase(),i=Math.floor(s.length/2),a=s.slice(0,i).trim(),o=s.slice(i).trim();return a&&a===o?t.slice(0,Math.ceil(t.length/2)).trim():t}function Za(e,t){const n=t?.sessionId?.trim();return n?`session:${n}`:`key:${e.trim().toLowerCase()}`}function Tc(e){if(e===J)return!0;const t=e.toLowerCase();return!!(t==="agent:main:main"||t.endsWith(":main"))}function y2(e){const t=e.sessionsResult?.sessions,n=[...new Set(e.settings.openTabs.map(c=>c.trim()).filter(Boolean))].filter(c=>!Tc(c)),s=qt(t,e.sessionKey),i=Za(e.sessionKey,s),a=new Map;for(const c of n){const d=qt(t,c),u=Za(c,d);if(!a.has(u)){a.set(u,c);continue}c===e.sessionKey&&a.set(u,c)}const o=[...a.values()];if(o.length===0){const c=e.sessionKey.trim()||"main";Tc(c)||o.push(c)}return{tabKeys:o,activeIdentity:i}}function v2(e){if(e.wizardActive&&e.wizardState)return Oh(e.wizardState,{onStepChange:l=>{e.handleWizardStepChange?.(l)},onAnswerChange:(l,h)=>{e.handleWizardAnswerChange?.(l,h)},onPreview:()=>{e.handleWizardPreview?.()},onGenerate:()=>{e.handleWizardGenerate?.()},onClose:()=>{e.handleWizardClose?.()},onFileToggle:(l,h)=>{e.handleWizardFileToggle?.(l,h)},onConfigToggle:(l,h)=>{e.handleWizardConfigToggle?.(l,h)}});e.presenceEntries.length;const t=e.sessionsResult?.count??null;e.cronStatus?.nextWakeAtMs;const n=e.connected?null:"Disconnected from gateway.",s=e.tab==="chat",i=s&&(e.settings.chatFocusMode||e.onboarding),a=e.onboarding?!1:e.settings.chatShowThinking,o=m2(e),c=e.chatAvatarUrl??o??null,{tabKeys:d,activeIdentity:u}=y2(e);return r`
    <div class="shell ${s?"shell--chat":""} ${i?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
            aria-label="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">${H.menu}</span>
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
          ${p}
        </div>
        <div class="topbar-status">
          ${e.updateStatus?.openclawUpdateAvailable||e.updateStatus?.pluginUpdateAvailable?r`<a
                  class="pill pill--update"
                  href="#"
                  title="${e.updateStatus?.openclawUpdateAvailable?"OpenClaw update available":"GodMode plugin update available"} — click to view"
                  @click=${l=>{l.preventDefault(),e.setTab("config")}}
                >
                  <span class="pill__icon">${H.zap}</span>
                  <span>Update Ready</span>
                </a>`:p}
          ${e.updateStatus?.pendingDeploy?r`<button
                  class="pill pill--deploy"
                  @click=${l=>{l.preventDefault(),e.handleDeployPanelToggle()}}
                  title="${e.updateStatus.pendingDeploy.summary??"pending fix"}"
                >
                  <span class="pill__icon">${H.rotateCcw}</span>
                  <span>Deploy Ready</span>
                </button>`:p}
          <button
            class="pill pill--support"
            @click=${l=>{l.preventDefault(),e.handleOpenSupportChat()}}
            title="Open support chat"
          >
            <span class="pill__icon">${H.headphones}</span>
            <span>Support</span>
          </button>
          <div class="pill ${e.reconnecting?"reconnecting":""}">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>Gateway</span>
            <span class="mono">${e.reconnecting?`Reconnecting${e.reconnectAttempt>1?` (${e.reconnectAttempt})`:""}...`:e.connected?"Connected":"Offline"}</span>
          </div>
          ${oh(e)}
        </div>
      </header>
      ${e.deployPanelOpen&&e.updateStatus?.pendingDeploy?(()=>{const l=e.updateStatus.pendingDeploy,h=Date.now()-l.ts,f=Math.floor(h/6e4),v=f<1?"just now":f<60?`${f}m ago`:`${Math.floor(f/60)}h ago`;return r`
              <div class="deploy-review-panel">
                <div class="deploy-review-panel__body">
                  <div class="deploy-review-panel__info">
                    <strong>Staged Deploy</strong>
                    <span class="deploy-review-panel__summary">${l.summary??"Pending fix"}</span>
                    <span class="deploy-review-panel__meta">Staged ${v}</span>
                    ${l.files?.length?r`<details class="deploy-review-panel__files">
                          <summary>${l.files.length} file${l.files.length>1?"s":""} changed</summary>
                          <ul>${l.files.map(b=>r`<li>${b}</li>`)}</ul>
                        </details>`:p}
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
              </div>`})():p}
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">

        ${gf.map(l=>{const h=e.settings.navGroupsCollapsed[l.label]??!1,f=l.tabs.some(b=>b===e.tab),v=!l.label||l.tabs.length===1&&os(l.tabs[0])===l.label;return r`
            <div class="nav-group ${h&&!f?"nav-group--collapsed":""} ${v?"nav-group--no-header":""}">
              ${v?p:r`
                <button
                  class="nav-label"
                  @click=${()=>{const b={...e.settings.navGroupsCollapsed};b[l.label]=!h,e.applySettings({...e.settings,navGroupsCollapsed:b})}}
                  aria-expanded=${!h}
                >
                  <span class="nav-label__text">${l.label}</span>
                  <span class="nav-label__chevron">${h?"+":"−"}</span>
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
                      `:p}
                ${l.tabs.map(b=>Va(e,b))}
              </div>
            </div>
          `})}
        ${mf.map(l=>{const h=e.settings.navGroupsCollapsed[l.label]??!0,f=l.tabs.some(v=>v===e.tab);return r`
            <div class="nav-group ${h&&!f?"nav-group--collapsed":""}">
              <button
                class="nav-label"
                @click=${()=>{const v={...e.settings.navGroupsCollapsed};v[l.label]=!h,e.applySettings({...e.settings,navGroupsCollapsed:v})}}
                aria-expanded=${!h}
              >
                <span class="nav-label__text">${l.label}</span>
                <span class="nav-label__chevron">${h?"+":"−"}</span>
              </button>
              <div class="nav-group__items">
                ${l.tabs.map(v=>Va(e,v))}
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
              <span class="nav-item__icon" aria-hidden="true">${H.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${s?"content--chat":""}">
        <section class="content-header">
          <div>
            ${e.tab!=="chat"&&e.tab!=="onboarding"?r`
              <div class="page-title">${os(e.tab)}</div>
              <div class="page-sub">${bf(e.tab)}</div>
            `:e.tab==="chat"?r`
              <div class="session-tabs">
                <div class="session-tab session-tab--pinned ${e.sessionKey===J?"session-tab--active":""}"
                     @click=${()=>{e.sessionKey!==J&&(st(e),e.sessionKey=J,e.allyUnread=0,yt(e,J),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:J,lastActiveSessionKey:J,tabLastViewed:{...e.settings.tabLastViewed,[J]:Date.now()}}),e.loadAssistantIdentity(),ye(e).then(()=>{e.resetChatScroll(),xe(e,!0)}),e.loadSessionResources(),oe(e))}}
                     title="${e.assistantName||"Ally"}">
                  ${e.assistantAvatar?r`<img src="${e.assistantAvatar}" class="session-tab-avatar" width="16" height="16" style="border-radius:50%;vertical-align:middle;margin-right:4px;" />`:r`<span class="session-tab-icon" style="margin-right:4px;">&#x2726;</span>`}
                  ${e.assistantName||"Ally"}
                  ${(e.allyUnread??0)>0?r`<span class="ally-tab-badge" style="margin-left:4px;font-size:10px;background:var(--accent-color,#5b73e8);color:#fff;border-radius:50%;padding:1px 5px;">${e.allyUnread}</span>`:p}
                </div>
                ${Ei(d,l=>l,(l,h)=>{const f=qt(e.sessionsResult?.sessions,l),v=Za(l,f)===u,$=(()=>{if(f?.label||f?.displayName)return Ac(f.label??f.displayName);const x=je.get(l);if(x)return Ac(x);if(l==="agent:main:support")return"Support";if(l.includes("webchat")){const A=l.match(/webchat[:-](\d+)/);return A?`Chat ${A[1]}`:"Chat"}if(l.includes("main"))return"MAIN";const T=l.split(/[:-]/);return T[T.length-1]||l})(),k=e.workingSessions.has(l),S=e.settings.tabLastViewed[l]??0,_=f?.updatedAt??0,L=!v&&!k&&_>S,E=e.editingTabKey===l;return r`
                      <div
                        class="session-tab ${v?"session-tab--active":""} ${k?"session-tab--working":""} ${L?"session-tab--ready":""} ${E?"session-tab--editing":""}"
                        draggable="true"
                        @dragstart=${x=>{if(e.editingTabKey===l){x.preventDefault();return}x.dataTransfer.effectAllowed="move",x.dataTransfer.setData("text/session-key",l),x.dataTransfer.setData("text/plain",h.toString()),x.target.classList.add("dragging")}}
                        @click=${()=>{if(!E){if(v){e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}});return}st(e),e.sessionKey=l,yt(e,l),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:l,lastActiveSessionKey:l,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}}),e.loadAssistantIdentity(),Me(e,l,!0),ye(e).then(()=>{e.resetChatScroll(),xe(e,!0)}),e.loadSessionResources(),oe(e),nr()}}}
                        @dragend=${x=>{x.target.classList.remove("dragging")}}
                        @dragover=${x=>{x.preventDefault(),x.dataTransfer.dropEffect="move";const T=x.currentTarget,A=T.getBoundingClientRect(),F=A.left+A.width/2;x.clientX<F?(T.classList.add("drop-left"),T.classList.remove("drop-right")):(T.classList.add("drop-right"),T.classList.remove("drop-left"))}}
                        @dragleave=${x=>{x.currentTarget.classList.remove("drop-left","drop-right")}}
                        @drop=${x=>{x.preventDefault();const T=parseInt(x.dataTransfer.getData("text/plain")),A=h;if(T===A)return;const F=e.settings.openTabs.slice(),[I]=F.splice(T,1);F.splice(A,0,I),e.applySettings({...e.settings,openTabs:F}),x.currentTarget.classList.remove("drop-left","drop-right")}}
                        title=${$}
                      >
                        ${E?r`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${f?.label??f?.displayName??""}
                            @click=${x=>x.stopPropagation()}
                            @dblclick=${x=>x.stopPropagation()}
                            @blur=${async x=>{const T=x.target;if(T._committedByEnter)return;const A=T.value.trim();e.editingTabKey=null;const F=f?.label??f?.displayName??"";if(A!==F){A?je.set(l,A):je.delete(l),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(j=>j.key===l?{...j,label:A||void 0,displayName:A||void 0}:j)});const I=await qs(e,l,{label:A||null,displayName:A||null});oe(e);const z=I.ok&&I.canonicalKey!==l?I.canonicalKey:l,q=l===e.sessionKey;e.applySettings({...e.settings,...I.ok&&I.canonicalKey!==l&&e.settings.openTabs.includes(l)?{openTabs:e.settings.openTabs.map(j=>j===l?I.canonicalKey:j)}:{},tabLastViewed:{...e.settings.tabLastViewed,[z]:Date.now()},...q&&I.ok&&I.canonicalKey!==l?{sessionKey:I.canonicalKey,lastActiveSessionKey:I.canonicalKey}:{}}),q&&I.ok&&I.canonicalKey!==l&&(e.sessionKey=I.canonicalKey,Me(e,I.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}})}}
                            @keydown=${async x=>{if(x.key==="Enter"){x.preventDefault();const T=x.target;T._committedByEnter=!0;const A=T.value.trim();e.editingTabKey=null;const F=f?.label??f?.displayName??"";if(A!==F){A?je.set(l,A):je.delete(l),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(j=>j.key===l?{...j,label:A||void 0,displayName:A||void 0}:j)});const I=await qs(e,l,{label:A||null,displayName:A||null});oe(e);const z=I.ok&&I.canonicalKey!==l?I.canonicalKey:l,q=l===e.sessionKey;e.applySettings({...e.settings,...I.ok&&I.canonicalKey!==l&&e.settings.openTabs.includes(l)?{openTabs:e.settings.openTabs.map(j=>j===l?I.canonicalKey:j)}:{},tabLastViewed:{...e.settings.tabLastViewed,[z]:Date.now()},...q&&I.ok&&I.canonicalKey!==l?{sessionKey:I.canonicalKey,lastActiveSessionKey:I.canonicalKey}:{}}),q&&I.ok&&I.canonicalKey!==l&&(e.sessionKey=I.canonicalKey,Me(e,I.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}})}else x.key==="Escape"&&(x.preventDefault(),e.editingTabKey=null)}}
                          />
                        `:(()=>{let x=null;return r`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${T=>{T.stopPropagation(),x&&clearTimeout(x),x=setTimeout(()=>{x=null,e.editingTabKey!==l&&(l===e.sessionKey?e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}}):(st(e),e.sessionKey=l,e.chatPrivateMode=!!e.privateSessions?.has(l),yt(e,l),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:l,lastActiveSessionKey:l,tabLastViewed:{...e.settings.tabLastViewed,[l]:Date.now()}}),e.loadAssistantIdentity(),Me(e,l,!0),ye(e).then(()=>{e.resetChatScroll(),xe(e,!0)}),e.loadSessionResources(),oe(e)))},250)}}
                            @dblclick=${T=>{T.preventDefault(),T.stopPropagation(),x&&(clearTimeout(x),x=null),e.editingTabKey=l;const A=T.target.closest(".session-tab"),F=I=>{const z=I.target;A&&!A.contains(z)&&(e.editingTabKey=null,document.removeEventListener("mousedown",F,!0))};document.addEventListener("mousedown",F,!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const I=A?.querySelector(".session-tab__name-input");I&&(I.focus(),I.select())})})}}
                          >${$}</span>
                        `})()}
                        ${e.privateSessions?.has(l)?(()=>{const x=e.privateSessions.get(l),T=Math.max(0,x-Date.now()),A=Math.floor(T/36e5),F=Math.floor(T%36e5/6e4),I=A>0?`${A}h ${F}m`:`${F}m`;return r`
                                  <span class="session-tab__private" title="Private session — expires in ${I}" style="font-size: 9px; margin-left: 3px; color: #f59e0b; white-space: nowrap;"
                                    >🔒 ${I}</span
                                  >
                                `})():p}
                        ${k?r`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `:p}
                        ${L?r`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `:p}
                        ${r`
                          <button
                            class="session-tab__close"
                            @click=${x=>{if(x.stopPropagation(),e.privateSessions?.has(l)){e._destroyPrivateSession(l);return}const T=e.settings.openTabs.filter(I=>I!==l),A=l===e.sessionKey,F=T[0]||J;e.applySettings({...e.settings,openTabs:T,...A?{sessionKey:F,lastActiveSessionKey:F}:{}}),A&&(e.sessionKey=F,e.sessionResources=[],Me(e,F,!0),ye(e).then(()=>{e.resetChatScroll(),xe(e,!0)}),e.loadSessionResources())}}
                            title=${e.privateSessions?.has(l)?"Destroy private session":"Close tab"}
                          >×</button>
                        `}
                      </div>
                    `})}
              `:p}
          </div>
          <div class="page-meta">
            ${e.reconnecting?r`<div class="pill warning reconnecting">
                  <span class="reconnect-spinner"></span>
                  Reconnecting${e.reconnectAttempt>1?` (attempt ${e.reconnectAttempt})`:""}...
                </div>`:e.lastError?r`<div class="pill ${e.lastError.startsWith("✓")?"success":"danger"}">${e.lastError}</div>`:p}
            ${s?ah(e):p}
            ${(e.tab==="today"||e.tab==="my-day")&&!e.dynamicSlots.today?Rh({connected:e.connected,onRefresh:()=>e.handleMyDayRefresh(),selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"brief",onViewModeChange:l=>e.handleTodayViewModeChange(l),focusPulseActive:!1,onStartMorningSet:()=>e.handleFocusPulseStartMorning(),inboxItems:e.inboxItems??[],inboxCount:e.inboxCount??0,onEveningCapture:()=>{e.setTab("chat"),e.handleSendChat(`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`)}}):p}
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
            </button>`:p}

        ${e.tab==="setup"||e.tab==="onboarding"?r`<div class="my-day-container">
                <div class="my-day-card">
                  <div class="my-day-card-content">
                    <p>Use the onboarding wizard to get started.</p>
                    <button class="retry-button" @click=${()=>e.handleWizardOpen?.()}>Open Wizard</button>
                  </div>
                </div>
              </div>`:p}

        ${e.tab==="workspaces"?r`<gm-work></gm-work>`:p}

        ${e.tab==="today"||e.tab==="my-day"?r`<gm-today></gm-today>`:p}

        ${e.tab==="channels"?Lk({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:l=>Fe(e,l),onWhatsAppStart:l=>e.handleWhatsAppStart(l),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(l,h)=>gn(e,l,h),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(l,h)=>e.handleNostrProfileEdit(l,h),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(l,h)=>e.handleNostrProfileFieldChange(l,h),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):p}

        ${e.tab==="instances"?i$({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>jo(e)}):p}

        ${e.tab==="sessions"?TS({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,archivedSessions:e.archivedSessions,archivedSessionsLoading:e.archivedSessionsLoading,archivedSessionsExpanded:e.archivedSessionsExpanded,onFiltersChange:l=>{e.sessionsFilterActive=l.activeMinutes,e.sessionsFilterLimit=l.limit,e.sessionsIncludeGlobal=l.includeGlobal,e.sessionsIncludeUnknown=l.includeUnknown},onRefresh:()=>{oe(e),Qt(e)},onPatch:async(l,h)=>{const f=await qs(e,l,h);if(f.ok&&f.canonicalKey!==l&&e.settings.openTabs.includes(l)){const v=e.settings.openTabs.map($=>$===l?f.canonicalKey:$),b=l===e.sessionKey;e.applySettings({...e.settings,openTabs:v,tabLastViewed:{...e.settings.tabLastViewed,[f.canonicalKey]:e.settings.tabLastViewed[l]??Date.now()},...b?{sessionKey:f.canonicalKey,lastActiveSessionKey:f.canonicalKey}:{}}),b&&(e.sessionKey=f.canonicalKey,Me(e,f.canonicalKey,!0))}},onDelete:l=>tu(e,l),onArchive:l=>nu(e,l),onUnarchive:l=>su(e,l),onToggleArchived:()=>{e.archivedSessionsExpanded=!e.archivedSessionsExpanded,e.archivedSessionsExpanded&&e.archivedSessions.length===0&&Qt(e)},onAutoArchive:()=>iu(e)}):p}

        ${e.tab==="cron"?Q0({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(l=>l.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:l=>e.cronForm={...e.cronForm,...l},onRefresh:()=>e.loadCron(),onAdd:()=>bb(e),onToggle:(l,h)=>wb(e,l,h),onRun:l=>kb(e,l),onRemove:l=>$b(e,l),onLoadRuns:l=>bu(e,l)}):p}

        ${e.tab==="skills"?LS({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,subTab:e.skillsSubTab,godmodeSkills:e.godmodeSkills??null,godmodeSkillsLoading:e.godmodeSkillsLoading??!1,expandedSkills:e.expandedSkills??new Set,onFilterChange:l=>e.skillsFilter=l,onRefresh:()=>{ms(e,{clearMessages:!0}),Wa(e)},onToggle:(l,h)=>Kb(e,l,h),onEdit:(l,h)=>zb(e,l,h),onSaveKey:l=>qb(e,l),onInstall:(l,h,f)=>Wb(e,l,h,f),onSubTabChange:l=>{e.skillsSubTab=l,l==="godmode"&&!e.godmodeSkills&&Wa(e),l==="clawhub"&&e.clawhubExploreItems},onToggleExpand:l=>{const h=new Set(e.expandedSkills);h.has(l)?h.delete(l):h.add(l),e.expandedSkills=h},clawhub:{loading:e.clawhubLoading,error:e.clawhubError,query:e.clawhubQuery,results:e.clawhubResults,exploreItems:e.clawhubExploreItems,exploreSort:e.clawhubExploreSort,detailSlug:e.clawhubDetailSlug,detail:e.clawhubDetail,importing:e.clawhubImporting,message:e.clawhubMessage,onSearch:l=>{e.clawhubQuery=l},onExplore:l=>void 0,onDetail:l=>void 0,onCloseDetail:()=>void 0,onImport:l=>Nl(),onImportAndPersonalize:async l=>{if(!await Nl())return;const f=await Ww();f&&(Qo(e,"chat"),Ri(e),e.chatMessage=f)}}}):p}

        ${e.tab==="agents"?FS({loading:e.rosterLoading,error:e.rosterError,roster:e.rosterData??[],filter:e.rosterFilter??"",expandedAgents:e.expandedAgents??new Set,onFilterChange:l=>e.rosterFilter=l,onRefresh:()=>_d(e),onToggleExpand:l=>{const h=new Set(e.expandedAgents);h.has(l)?h.delete(l):h.add(l),e.expandedAgents=h}}):p}

        ${e.tab==="nodes"?W$({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>Si(e),onDevicesRefresh:()=>xt(e),onDeviceApprove:l=>sv(e,l),onDeviceReject:l=>iv(e,l),onDeviceRotate:(l,h,f)=>av(e,{deviceId:l,role:h,scopes:f}),onDeviceRevoke:(l,h)=>ov(e,{deviceId:l,role:h}),onLoadConfig:()=>it(e),onLoadExecApprovals:()=>{const l=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return qo(e,l)},onBindDefault:l=>{l?gn(e,["tools","exec","node"],l):Nr(e,["tools","exec","node"])},onBindAgent:(l,h)=>{const f=["agents","list",l,"tools","exec","node"];h?gn(e,f,h):Nr(e,f)},onSaveBindings:()=>Qs(e),onExecApprovalsTargetChange:(l,h)=>{e.execApprovalsTarget=l,e.execApprovalsTargetNodeId=h,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:l=>{e.execApprovalsSelectedAgent=l},onExecApprovalsPatch:(l,h)=>Pb(e,l,h),onExecApprovalsRemove:l=>Db(e,l),onSaveExecApprovals:()=>{const l=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Lb(e,l)}}):p}

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
                `:p}

        ${e.tab==="chat"?x0({basePath:e.basePath,sessionKey:e.sessionKey,onSessionKeyChange:l=>{st(e),e.sessionKey=l,yt(e,l),e.chatLoading=!0,e.chatMessages=[],e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:l,lastActiveSessionKey:l}),e.loadAssistantIdentity(),ye(e).then(()=>{e.resetChatScroll(),xe(e,!0)}),li(e),e.loadSessionResources(),oi(e)},thinkingLevel:e.chatThinkingLevel,showThinking:a,loading:e.chatLoading,sending:e.chatSending,sendingSessionKey:e.chatSendingSessionKey,compactionStatus:e.compactionStatus,assistantAvatarUrl:c,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:n,error:e.lastError,sessions:e.sessionsResult,focusMode:i,onRefresh:()=>(e.resetToolStream(),e.loadSessionResources(),oi(e),Promise.all([ye(e),li(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:l=>e.handleChatScroll(l),onDraftChange:l=>e.chatMessage=l,attachments:e.chatAttachments,onAttachmentsChange:l=>e.chatAttachments=l,showToast:(l,h)=>e.showToast(l,h),onSend:l=>e.handleSendChat(void 0,{queue:l}),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onCompact:()=>{e.handleCompactChat()},pendingRetry:e.pendingRetry,onRetry:()=>{e.handleRetryMessage()},onClearRetry:()=>e.handleClearRetry(),onQueueRemove:l=>e.removeQueuedMessage(l),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,sidebarMimeType:e.sidebarMimeType,sidebarFilePath:e.sidebarFilePath,sidebarTitle:e.sidebarTitle,sidebarMode:e.sidebarMode,sidebarProofSlug:e.sidebarProofSlug,sidebarProofUrl:e.sidebarProofUrl,sidebarProofHtml:e.sidebarProofHtml,splitRatio:e.splitRatio,onOpenSidebar:(l,h)=>e.handleOpenSidebar(l,h),onMessageLinkClick:l=>e.handleOpenMessageFileLink(l),onCloseSidebar:()=>e.handleCloseSidebar(),onOpenProof:l=>{e.handleOpenProofDoc(l)},onOpenFile:l=>e.handleOpenFile(l),onSplitRatioChange:l=>e.handleSplitRatioChange(l),onPushToDrive:(l,h)=>e.handlePushToDrive(l,h),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker(),onImageClick:(l,h,f)=>e.handleImageClick(l,h,f),resolveImageUrl:(l,h)=>Iv(e.sessionKey,l,h),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,userName:e.userName,userAvatar:e.userAvatar,currentToolName:e.currentToolName,currentToolInfo:e.currentToolInfo,privateMode:e.chatPrivateMode,onTogglePrivateMode:()=>e.handlePrivateModeToggle(),isWorking:e.workingSessions.has(e.sessionKey),showScrollButton:!e.chatUserNearBottom,showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>{const l=document.querySelector(".chat-thread");l&&(l.scrollTo({top:l.scrollHeight,behavior:"smooth"}),e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1)},allyPanelOpen:e.allyPanelOpen??!1,allyProps:e.allyPanelOpen?{allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:!0,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:0,connected:e.connected,compact:!0,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:l=>e.handleAllyDraftChange(l),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:l=>e.handleAllyAttachmentsChange(l),onAction:(l,h,f,v)=>e.handleAllyAction(l,h,f,v)}:null,sessionResources:e.sessionResources,sessionResourcesCollapsed:e.sessionResourcesCollapsed,onToggleSessionResources:()=>e.handleToggleSessionResources(),onSessionResourceClick:l=>e.handleSessionResourceClick(l),onViewAllResources:()=>e.handleViewAllResources()}):p}

        ${e.tab==="options"?JS({connected:e.connected,loading:e.godmodeOptionsLoading,options:e.godmodeOptions,onToggle:(l,h)=>e.handleOptionToggle(l,h),onOpenWizard:e.handleWizardOpen?()=>e.handleWizardOpen?.():void 0}):p}

        ${e.tab==="guardrails"?z1({connected:e.connected,loading:e.guardrailsLoading,data:e.guardrailsData,showAddForm:e.guardrailsShowAddForm,onToggle:(l,h)=>e.handleGuardrailToggle(l,h),onThresholdChange:(l,h,f)=>e.handleGuardrailThresholdChange(l,h,f),onCustomToggle:(l,h)=>e.handleCustomGuardrailToggle(l,h),onCustomDelete:l=>e.handleCustomGuardrailDelete(l),onToggleAddForm:()=>e.handleToggleGuardrailAddForm(),onOpenAllyChat:l=>{e.handleAllyToggle(),l&&e.handleAllyDraftChange(l)}}):p}

        ${e.tab==="trust"?I1({connected:e.connected,loading:e.trustTrackerLoading,data:e.trustTrackerData,onAddWorkflow:l=>e.handleTrustAddWorkflow(l),onRemoveWorkflow:l=>e.handleTrustRemoveWorkflow(l),onRefresh:()=>e.handleTrustLoad(),guardrailsData:e.guardrailsData,consciousnessStatus:e.consciousnessStatus,sessionsCount:t,gatewayUptimeMs:e.hello?.snapshot?.uptimeMs??null,onDailyRate:(l,h)=>e.handleDailyRate(l,h),updateStatus:e.updateStatus?{openclawUpdateAvailable:e.updateStatus.openclawUpdateAvailable,pluginUpdateAvailable:e.updateStatus.pluginUpdateAvailable,openclawVersion:e.updateStatus.openclawVersion,pluginVersion:e.updateStatus.pluginVersion,openclawLatest:e.updateStatus.openclawLatest,pluginLatest:e.updateStatus.pluginLatest}:null}):p}

        ${e.tab==="second-brain"?r`<gm-second-brain></gm-second-brain>`:p}

        ${e.tab==="dashboards"?r`<gm-dashboards></gm-dashboards>`:p}

        ${e.tab==="config"?F0({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:l=>{e.configRaw=l},onFormModeChange:l=>e.configFormMode=l,onFormPatch:(l,h)=>gn(e,l,h),onSearchChange:l=>e.configSearchQuery=l,onSectionChange:l=>{e.configActiveSection=l,e.configActiveSubsection=null},onSubsectionChange:l=>e.configActiveSubsection=l,onReload:()=>it(e),onSave:()=>Qs(e),onApply:()=>jp(e),onUpdate:()=>Hp(e),userName:e.userName||"",userAvatar:e.userAvatar,onUserProfileUpdate:(l,h)=>e.handleUpdateUserProfile(l,h),onModelSwitch:(l,h)=>Vp(e,l,h)}):p}

        ${e.tab==="debug"?Z0({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:l=>e.debugCallMethod=l,onCallParamsChange:l=>e.debugCallParams=l,onRefresh:()=>xi(e),onCall:()=>Xv(e)}):p}

        ${e.tab==="logs"?l$({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:l=>e.logsFilterText=l,onLevelToggle:(l,h)=>{e.logsLevelFilters={...e.logsLevelFilters,[l]:h}},onToggleAutoFollow:l=>e.logsAutoFollow=l,onRefresh:()=>Oo(e,{reset:!0}),onExport:(l,h)=>e.exportLogs(l,h),onScroll:l=>e.handleLogsScroll(l)}):p}
      </main>
      ${e.tab!=="chat"?sk({allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:e.allyPanelOpen??!1,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:e.allyUnread??0,connected:e.connected,compact:!1,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:l=>e.handleAllyDraftChange(l),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:l=>e.handleAllyAttachmentsChange(l),onAction:(l,h,f,v)=>e.handleAllyAction(l,h,f,v)}):p}
      ${t$(e)}
      ${n$(e)}
      ${s$(e)}
      ${e.sidebarOpen&&e.tab!=="chat"?r`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${()=>e.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${Ga({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:()=>e.handleCloseSidebar(),onViewRawText:()=>{e.sidebarContent&&e.handleOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath,title:e.sidebarTitle})},onOpenFile:l=>e.handleOpenFile(l),onPushToDrive:(l,h)=>e.handlePushToDrive(l,h),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker()})}
              </div>
            </div>
          `:p}
      ${GS({toasts:e.toasts,onDismiss:l=>e.dismissToast(l)})}
      ${HS(e.lightbox,{onClose:()=>e.handleLightboxClose(),onNav:l=>e.handleLightboxNav(l)})}
    </div>
  `}async function b2(e){}async function w2(e){}async function k2(e,t){}async function $2(e){}async function S2(e){}async function x2(e){}async function rr(e){if(!(!e.client||!e.connected)){e.trustTrackerLoading=!0;try{const[t,n]=await Promise.all([e.client.request("trust.dashboard",{}),e.client.request("trust.history",{limit:50})]);e.trustTrackerData={workflows:t.workflows,summaries:t.summaries,ratings:n.ratings,total:n.total,overallScore:t.overallScore,totalRatings:t.totalRatings,totalUses:t.totalUses,todayRating:t.todayRating??null,dailyAverage:t.dailyAverage??null,dailyStreak:t.dailyStreak??0,recentDaily:t.recentDaily??[]}}catch{e.trustTrackerData=null}finally{e.trustTrackerLoading=!1}}}async function Jh(e,t){if(!(!e.client||!e.connected))try{await e.client.request("trust.workflows.set",{workflows:t}),e.showToast("Workflows updated","success",2e3),await rr(e)}catch(n){e.showToast("Failed to update workflows","error"),console.error("[TrustTracker] setWorkflows error:",n)}}async function _2(e,t){const n=e.trustTrackerData?.workflows??[];if(n.length>=5){e.showToast("Maximum 5 workflows allowed","error");return}if(n.includes(t.trim())){e.showToast("Workflow already tracked","error");return}await Jh(e,[...n,t.trim()])}async function A2(e,t){const n=e.trustTrackerData?.workflows??[];await Jh(e,n.filter(s=>s!==t))}async function T2(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("trust.dailyRate",{rating:t,...n?{note:n}:{}}),e.showToast(`Rated ${t}/10 today`,"success",2e3),await rr(e)}catch(s){e.showToast("Failed to submit daily rating","error"),console.error("[TrustTracker] dailyRate error:",s)}}const C2=6e4,Cc=15,Ec=new Set;let Hs=null;async function Rc(e){if(!(!e.client||!e.connected))try{const t=new Date,n=new Date(t.getTime()+Cc*6e4+6e4),s=await e.client.request("calendar.events.range",{startDate:t.toISOString(),endDate:n.toISOString()});for(const i of s.events??[]){if(Ec.has(i.id))continue;const a=new Date(i.startTime),o=Math.round((a.getTime()-t.getTime())/6e4);if(o>0&&o<=Cc){Ec.add(i.id);const c=a.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),d=i.location?` @ ${i.location}`:"",u=`${i.title} starts in ${o} min (${c})${d}`;e.showToast(u,"warning",0)}}}catch(t){console.warn("[MeetingNotify] Poll error:",t)}}function E2(e){Xh(),Rc(e),Hs=setInterval(()=>{Rc(e)},C2)}function Xh(){Hs&&(clearInterval(Hs),Hs=null)}let R2=0;function L2(e,t="info",n=3e3,s){return{id:`toast-${Date.now()}-${R2++}`,message:e,type:t,duration:n,createdAt:Date.now(),action:s}}function P2(e,t){return e.filter(n=>n.id!==t)}function D2(e,t){return[...e,t]}var I2=Object.defineProperty,M2=Object.getOwnPropertyDescriptor,y=(e,t,n,s)=>{for(var i=s>1?void 0:s?M2(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&I2(t,n,i),i};function $a(){return ky()}function Bs(){return Sy()}function O2(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}function B2(e,t){let n=e.trim();if(!n)return null;if(n.startsWith("Read HEARTBEAT.md")||n.startsWith("Read CONSCIOUSNESS.md")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(n)||n==="NO_REPLY"||n.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(n)||n.startsWith("# WORKING.md")||n.startsWith("# MISTAKES.md"))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/(?:VERIFIED|FIXED|NEW):\s/.test(n)&&/✅|🟡|☑/.test(n)&&n.length>300)return console.debug("[Ally] Filtered message (verification dump):",t,n.substring(0,100)),null;if(/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(n))return console.debug("[Ally] Filtered message (system block):",t,n.substring(0,100)),null;if(/^\[GodMode Context:[^\]]*\]\s*$/.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(n=n.replace(/^(?:HEARTBEAT_OK|CONSCIOUSNESS_OK)\s*/i,"").trim(),n=n.replace(/^Deep work window is yours\.\s*/i,"").trim(),!n)return null;if(/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(n)&&n.length>200||/^##\s*Your Team\s*\(Agent Roster\)/i.test(n)&&n.indexOf(`

## `)===-1)return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/^##?\s*Persistence Protocol/i.test(n)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(n)||/^##?\s*Core (?:Behaviors|Principles)/i.test(n)||/^##?\s*Your Role as \w+/i.test(n))return console.debug("[Ally] Filtered message (persona leak):",t,n.substring(0,100)),null;const s=n.toLowerCase();if(["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"].filter(o=>s.includes(o)).length>=2)return console.debug("[Ally] Filtered message (multi-signal system leak):",t,n.substring(0,100)),null;if(/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;const a=n.match(/\b[\w.-]+\.(?:json\b|db\b|html\b|log\b|flag\b|jsonl\b|bak\b|css\b|js\b|ts\b|md\b|txt\b)/gi);return a&&a.length>=8&&a.join(" ").length>n.length*.4?(console.debug("[Ally] Filtered message (file listing dump):",t,n.substring(0,100)),null):n}const Lc=new Set(["chat","today","workspaces","work","data","overview","channels","instances","sessions","cron","skills","nodes","config","debug","logs","my-day"]),F2=["path","filePath","file","workspacePath"];let m=class extends He{constructor(){super(...arguments),this._ctx=Np(),this.settings=iw(),this.password="",this.tab="chat",this.onboarding=O2(),this.connected=!1,this.reconnecting=!1,this.reconnectAttempt=0,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.sessionPickerClickOutsideHandler=null,this.sessionSearchClickOutsideHandler=null,this.assistantName=$a().name,this.assistantAvatar=$a().avatar,this.assistantAgentId=$a().agentId??null,this.userName=Bs().name,this.userAvatar=Bs().avatar,this.sessionKey=this.settings.sessionKey,this.sessionPickerOpen=!1,this.sessionPickerPosition=null,this.sessionPickerSearch="",this.sessionSearchOpen=!1,this.sessionSearchPosition=null,this.sessionSearchQuery="",this.sessionSearchResults=[],this.sessionSearchLoading=!1,this.profilePopoverOpen=!1,this.profileEditName="",this.profileEditAvatar="",this.editingTabKey=null,this.chatLoading=!1,this.chatSending=!1,this.chatSendingSessionKey=null,this.chatMessage="",this.chatDrafts={},this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.currentToolName=null,this.currentToolInfo=null,this.workingSessions=new Set,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.pendingRetry=null,this.autoRetryAfterCompact=!1,this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.splitRatio=this.settings.splitRatio,this.lightbox=Dh(),this.driveAccounts=[],this.showDrivePicker=!1,this.driveUploading=!1,this.updateStatus=null,this.updateLoading=!1,this.updateError=null,this.updateLastChecked=null,this.updatePollInterval=null,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.gatewayRestartPending=!1,this.gatewayRestartBusy=!1,this.deployPanelOpen=!1,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.archivedSessions=[],this.archivedSessionsLoading=!1,this.archivedSessionsExpanded=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...ww},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.workspaceNeedsSetup=!1,this.onboardingPhase=0,this.onboardingData=null,this.onboardingActive=!1,this.wizardActive=!1,this.wizardState=null,this.showSetupTab=!1,this.setupCapabilities=null,this.setupCapabilitiesLoading=!1,this.setupQuickDone=!1,this.onboardingIntegrations=null,this.onboardingCoreProgress=null,this.onboardingExpandedCard=null,this.onboardingLoadingGuide=null,this.onboardingActiveGuide=null,this.onboardingTestingId=null,this.onboardingTestResult=null,this.onboardingConfigValues={},this.onboardingProgress=null,this.selectedWorkspace=null,this.workspacesSearchQuery="",this.workspaceItemSearchQuery="",this.workspacesLoading=!1,this.workspacesCreateLoading=!1,this.workspacesError=null,this.workspaceExpandedFolders=new Set,this.editingTaskId=null,this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null,this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=X(),this.todayViewMode="brief",this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.todayEditingTaskId=null,this.todayShowCompleted=!1,this.allyPanelOpen=!1,this.allyMessages=[],this.allyStream=null,this.allyDraft="",this.allyUnread=0,this.allySending=!1,this.allyWorking=!1,this.allyAttachments=[],this.todayQueueResults=[],this.inboxItems=[],this.inboxLoading=!1,this.inboxCount=0,this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,this.inboxSortOrder="newest",this.trustSummary=null,this.chatPrivateMode=!1,this.privateSessions=new Map,this._privateSessionTimer=null,this.dynamicSlots={},this.workLoading=!1,this.workError=null,this.workExpandedProjects=new Set,this.workProjectFiles={},this.workDetailLoading=new Set,this.workResourcesLoading=!1,this.workResourceFilter="all",this.sessionResources=[],this.sessionResourcesCollapsed=!1,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.skillsSubTab="godmode",this.godmodeSkills=null,this.godmodeSkillsLoading=!1,this.expandedSkills=new Set,this.rosterData=[],this.rosterLoading=!1,this.rosterError=null,this.rosterFilter="",this.expandedAgents=new Set,this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...bw},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.toasts=[],this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatIsAutoScrolling=!1,this.chatNewMessagesBelow=!1,this.consciousnessStatus="idle",this.focusPulseData=null,this.trustTrackerData=null,this.trustTrackerLoading=!1,this.guardrailsData=null,this.guardrailsLoading=!1,this.guardrailsShowAddForm=!1,this.missionControlData=null,this.missionControlLoading=!1,this.missionControlError=null,this.missionControlFullControl=(()=>{try{return localStorage.getItem("godmode.mc.fullControl")==="1"}catch{return!0}})(),this.missionControlPollInterval=null,this.godmodeOptions=null,this.godmodeOptionsLoading=!1,this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardPreviousSessionKey=null,this.dashboardChatOpen=!1,this.dashboardCategoryFilter=null,this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainVaultHealth=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=!1,this.basePath="",this.popStateHandler=()=>Ju(this),this.keydownHandler=()=>{},this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null}createRenderRoot(){return this}connectedCallback(){if(super.connectedCallback(),this.settings.userName)this.userName=this.settings.userName;else{const t=Bs();this.userName=t.name}if(this.settings.userAvatar)this.userAvatar=this.settings.userAvatar;else{const t=Bs();this.userAvatar=t.avatar}Nw(this);const e=X();this.todaySelectedDate!==e&&(this.todaySelectedDate=e),E2(this),this._restorePrivateSessions()}firstUpdated(){Uw(this)}disconnectedCallback(){Xh(),this._stopPrivateSessionTimer(),zw(this),super.disconnectedCallback()}updated(e){qw(this,e),this._syncContext()}_syncContext(){const e=this._ctx;e.connected===this.connected&&e.reconnecting===this.reconnecting&&e.sessionKey===this.sessionKey&&e.assistantName===this.assistantName&&e.assistantAvatar===this.assistantAvatar&&e.userName===this.userName&&e.userAvatar===this.userAvatar&&e.theme===this.theme&&e.themeResolved===this.themeResolved&&e.settings===this.settings&&e.basePath===this.basePath&&e.gateway===this.client||(this._ctx={connected:this.connected,reconnecting:this.reconnecting,sessionKey:this.sessionKey,assistantName:this.assistantName,assistantAvatar:this.assistantAvatar,userName:this.userName,userAvatar:this.userAvatar,theme:this.theme,themeResolved:this.themeResolved,settings:this.settings,basePath:this.basePath,gateway:this.client,send:(t,n)=>this.client?.request(t,n)??Promise.reject(new Error("Not connected")),setTab:t=>this.setTab(t),addToast:(t,n)=>this.showToast(t,n??"info"),openSidebar:t=>this.handleOpenSidebar(t.content,{title:t.title,mimeType:t.mimeType,filePath:t.filePath}),closeSidebar:()=>this.handleCloseSidebar()})}connect(){Mo(this)}handleChatScroll(e){uf(this,e)}handleLogsScroll(e){hf(this,e)}exportLogs(e,t){pf(e,t)}resetToolStream(){ro(this),this.sessionResources=[]}resetChatScroll(){mi(this)}async loadAssistantIdentity(){await Cd(this)}applySettings(e){ot(this,e)}setTab(e){Qo(this,e)}setTheme(e,t){ju(this,e,t)}async loadOverview(){await Xo(this)}async loadCron(){await Ci(this)}async handleAbortChat(){await Zo(this)}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}async loadFocusPulse(){await b2()}async handleFocusPulseStartMorning(){await w2(),this.setTab("chat");const e="Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan.",{createNewSession:t}=await R(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>ht);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e)}async handleFocusPulseSetFocus(e){await k2()}async handleFocusPulseComplete(){await $2()}async handleFocusPulsePulseCheck(){await S2()}async handleFocusPulseEndDay(){await x2()}async handleTrustLoad(){await rr(this)}async handleTrustAddWorkflow(e){await _2(this,e)}async handleTrustRemoveWorkflow(e){await A2(this,e)}async handleDailyRate(e,t){await T2(this,e,t)}async handleGuardrailsLoad(){const{loadGuardrails:e}=await R(async()=>{const{loadGuardrails:t}=await Promise.resolve().then(()=>un);return{loadGuardrails:t}},void 0,import.meta.url);await e(this)}async handleGuardrailToggle(e,t){const{toggleGuardrail:n}=await R(async()=>{const{toggleGuardrail:s}=await Promise.resolve().then(()=>un);return{toggleGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleGuardrailThresholdChange(e,t,n){const{updateGuardrailThreshold:s}=await R(async()=>{const{updateGuardrailThreshold:i}=await Promise.resolve().then(()=>un);return{updateGuardrailThreshold:i}},void 0,import.meta.url);await s(this,e,t,n)}async handleCustomGuardrailToggle(e,t){const{toggleCustomGuardrail:n}=await R(async()=>{const{toggleCustomGuardrail:s}=await Promise.resolve().then(()=>un);return{toggleCustomGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleCustomGuardrailDelete(e){const{deleteCustomGuardrail:t}=await R(async()=>{const{deleteCustomGuardrail:n}=await Promise.resolve().then(()=>un);return{deleteCustomGuardrail:n}},void 0,import.meta.url);await t(this,e)}async handleCustomGuardrailAdd(e){const{addCustomGuardrailFromUI:t}=await R(async()=>{const{addCustomGuardrailFromUI:n}=await Promise.resolve().then(()=>un);return{addCustomGuardrailFromUI:n}},void 0,import.meta.url);await t(this,e),this.guardrailsShowAddForm=!1}handleToggleGuardrailAddForm(){this.guardrailsShowAddForm=!this.guardrailsShowAddForm}handleMissionControlToggleFullControl(){this.missionControlFullControl=!this.missionControlFullControl;try{localStorage.setItem("godmode.mc.fullControl",this.missionControlFullControl?"1":"0")}catch{}}async handleMissionControlRefresh(){const{loadMissionControl:e}=await R(async()=>{const{loadMissionControl:t}=await Promise.resolve().then(()=>ut);return{loadMissionControl:t}},void 0,import.meta.url);await e(this)}async handleMissionControlCancelTask(e){const{cancelCodingTask:t}=await R(async()=>{const{cancelCodingTask:n}=await Promise.resolve().then(()=>ut);return{cancelCodingTask:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlApproveItem(e){const{approveCodingTask:t,approveQueueItem:n}=await R(async()=>{const{approveCodingTask:i,approveQueueItem:a}=await Promise.resolve().then(()=>ut);return{approveCodingTask:i,approveQueueItem:a}},void 0,import.meta.url);await t(this,e)||await n(this,e)}async handleMissionControlRetryItem(e){const{retryQueueItem:t}=await R(async()=>{const{retryQueueItem:n}=await Promise.resolve().then(()=>ut);return{retryQueueItem:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlViewDetail(e){const{loadAgentDetail:t}=await R(async()=>{const{loadAgentDetail:s}=await Promise.resolve().then(()=>ut);return{loadAgentDetail:s}},void 0,import.meta.url),n=await t(this,e);this.handleOpenSidebar(n.content,{mimeType:n.mimeType,title:n.title})}async handleMissionControlOpenSession(e){const t=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:t,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:n}=await R(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>tt);return{loadChatHistory:s}},void 0,import.meta.url);await n(this),this.loadSessionResources()}async handleMissionControlOpenTaskSession(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e});if(t?.sessionId){if(t.task?.title){const{autoTitleCache:n}=await R(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>zn);return{autoTitleCache:s}},void 0,import.meta.url);n.set(t.sessionId,t.task.title)}await this.handleMissionControlOpenSession(t.sessionId),t.queueOutput&&this.chatMessages.length===0&&await this.seedSessionWithAgentOutput(t.task?.title??"task",t.queueOutput,t.agentPrompt??void 0)}}catch(t){console.error("[MissionControl] Failed to open task session:",t),this.showToast("Failed to open session","error")}}async handleMissionControlStartQueueItem(e){await this.handleMissionControlOpenTaskSession(e)}async handleSwarmSelectProject(e){const{selectSwarmProject:t}=await R(async()=>{const{selectSwarmProject:n}=await Promise.resolve().then(()=>ut);return{selectSwarmProject:n}},void 0,import.meta.url);await t(this,e)}async handleSwarmSteer(e,t,n){const{steerSwarmAgent:s}=await R(async()=>{const{steerSwarmAgent:i}=await Promise.resolve().then(()=>ut);return{steerSwarmAgent:i}},void 0,import.meta.url);await s(this,e,t,n)}async handleSwarmViewProofDoc(e){return this.handleOpenProofDoc(e)}async handleSwarmViewRunLog(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("godmode.delegation.runLog",{queueItemId:e});t?.content?this.handleOpenSidebar(t.content,{mimeType:t.mimeType??"text/markdown",title:t.title??"Agent Logs"}):this.showToast("No logs available","error")}catch{this.showToast("Failed to load agent logs","error")}}async handleMissionControlViewTaskFiles(e){try{const n=(await this.client?.request("queue.taskFiles",{itemId:e}))?.files??[];if(n.length===0){this.showToast("No files found for this task","info");return}const i=`## Task Files

${n.map(a=>`- **${a.name}** (${a.type}, ${(a.size/1024).toFixed(1)} KB)
  \`${a.path}\``).join(`

`)}`;this.handleOpenSidebar(i,{title:"Task Files"})}catch(t){console.error("Failed to load task files:",t),this.showToast("Failed to load task files","error")}}async handleAllyAction(e,t,n,s){if(e==="navigate"&&t)this.setTab(t);else if(e==="rpc"&&n&&this.client)try{await this.client.request(n,s??{}),this.showToast("Done","success",2e3)}catch(i){console.error("[Ally] Action RPC failed:",i),this.showToast("Action failed","error")}}handleAllyToggle(){this.allyPanelOpen=!this.allyPanelOpen,this.allyPanelOpen&&(this.allyUnread=0,this._loadAllyHistory().then(()=>{this._scrollAllyToBottom(),requestAnimationFrame(()=>this._scrollAllyToBottom())}))}handleAllyDraftChange(e){this.allyDraft=e}handleAllyAttachmentsChange(e){this.allyAttachments=e}async handleAllySend(){const e=this.allyDraft.trim(),t=this.allyAttachments;if(!e&&t.length===0||this.allySending)return;const n=wf(this);let s=e?`${n}

${e}`:n;this.allyDraft="",this.allyAttachments=[],this.allySending=!0,this.allyMessages=[...this.allyMessages,{role:"user",content:e||"(image)",timestamp:Date.now()}];try{let i;if(t.length>0){const d=[];for(const u of t){if(!u.dataUrl)continue;const l=u.dataUrl.match(/^data:([^;]+);base64,(.+)$/);if(!l)continue;const[,h,f]=l;h.startsWith("image/")&&d.push({type:"image",mimeType:h,content:f,fileName:u.fileName})}if(d.length>0){i=d;try{await this.client?.request("images.cache",{images:d.map(u=>({data:u.content,mimeType:u.mimeType,fileName:u.fileName})),sessionKey:J})}catch{}}}const a=`ally-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;try{await this.client?.request("sessions.patch",{key:J,lastChannel:"webchat"})}catch{}await this.client?.request("agent",{sessionKey:J,message:s,deliver:!1,channel:"webchat",idempotencyKey:a,attachments:i}),this.allyWorking=!0;const o=this.allyMessages[this.allyMessages.length-1]?.content,c=setInterval(async()=>{if(!this.allyWorking){clearInterval(c);return}try{await this._loadAllyHistory();const d=this.allyMessages[this.allyMessages.length-1];d&&d.role==="assistant"&&d.content!==o&&(this.allyWorking=!1,this.allyStream=null,clearInterval(c),this._scrollAllyToBottom())}catch{}},5e3);setTimeout(()=>clearInterval(c),12e4)}catch(i){const a=i instanceof Error?i.message:String(i);console.error("[Ally] Failed to send ally message:",a),this.allyMessages=[...this.allyMessages,{role:"assistant",content:`*Send failed: ${a}*`,timestamp:Date.now()}]}finally{this.allySending=!1}}handleAllyOpenFull(){this.allyPanelOpen=!1,this.setTab("chat"),this.applySettings({...this.settings,sessionKey:J,lastActiveSessionKey:J,tabLastViewed:{...this.settings.tabLastViewed,[J]:Date.now()}}),this.sessionKey=J,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),R(async()=>{const{loadChatHistory:e}=await Promise.resolve().then(()=>tt);return{loadChatHistory:e}},void 0,import.meta.url).then(({loadChatHistory:e})=>e(this)),this.loadSessionResources()}_scrollAllyToBottom(){this.updateComplete.then(()=>{requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector?.(".ally-panel, .ally-inline")??document.querySelector(".ally-panel, .ally-inline");if(!e)return;const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)})})}async _loadAllyHistory(){try{const e=await this.client?.request("chat.history",{sessionKey:J,limit:100});if(e?.messages){const{extractText:t,formatApiError:n}=await R(async()=>{const{extractText:i,formatApiError:a}=await Promise.resolve().then(()=>Cm);return{extractText:i,formatApiError:a}},void 0,import.meta.url);this.allyMessages=e.messages.map(i=>{const a=i.role??"assistant",o=a.toLowerCase();if(o==="tool"||o==="toolresult"||o==="tool_result"||o==="function"||o==="system")return null;const c=i;if(c.toolCallId||c.tool_call_id||c.toolName||c.tool_name)return null;if(Array.isArray(i.content)){const h=i.content;if(!h.some(v=>{const b=(typeof v.type=="string"?v.type:"").toLowerCase();return(b==="text"||b==="")&&typeof v.text=="string"&&v.text.trim().length>0})&&h.some(b=>{const $=(typeof b.type=="string"?b.type:"").toLowerCase();return $==="tool_use"||$==="tool_result"||$==="toolresult"||$==="tooluse"}))return null}let d=t(i);if(!d)return null;const u=n(d);if(u&&(d=u),d=d.replace(/^\[GodMode Context:[^\]]*\]\s*/i,"").trim(),!d)return null;const l=B2(d,a);return l?{role:o==="user"?"user":"assistant",content:l,timestamp:i.timestamp}:null}).filter(i=>i!==null);const s=[];for(const i of this.allyMessages){const a=s[s.length-1];a&&a.role===i.role&&a.content===i.content||s.push(i)}this.allyMessages=s}}catch{}}async handleDecisionApprove(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.approve",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Approve failed:",t),this.showToast("Failed to approve","error")}}async handleDecisionReject(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.reject",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Reject failed:",t),this.showToast("Failed to reject","error")}}async handleDecisionDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Dismiss failed:",t),this.showToast("Failed to dismiss","error")}}async handleDecisionMarkComplete(e){if(!(!this.client||!this.connected))try{const t=this.todayQueueResults?.find(n=>n.id===e);t?.sourceTaskId&&await this.client.request("tasks.update",{id:t.sourceTaskId,status:"complete"}),await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(n=>n.id!==e),this.showToast("Task marked complete","success")}catch(t){console.error("[DecisionCard] Mark complete failed:",t),this.showToast("Failed to mark complete","error")}}async handleDecisionRate(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("trust.rate",{workflow:t,rating:n});const s=n<7;this.todayQueueResults=this.todayQueueResults.map(i=>i.id===e?{...i,userRating:n,feedbackPending:s}:i),s?this.showToast(`Rated ${t} ${n}/10 — what could be better?`,"info"):(this.todayQueueResults?.find(a=>a.id===e)?.source==="cron"&&(await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(a=>a.id!==e)),this.showToast(`Rated ${t} ${n}/10`,"success"))}catch(s){console.error("[DecisionCard] Rate failed:",s),this.showToast("Failed to submit rating","error")}}async handleDecisionFeedback(e,t,n){if(!(!this.client||!this.connected))try{n&&(await this.client.request("trust.feedback",{workflow:t,feedback:n}),this.showToast(`Feedback saved for ${t} — will apply next time`,"success")),this.todayQueueResults?.find(i=>i.id===e)?.source==="cron"&&await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.map(i=>i.id===e?{...i,feedbackPending:!1}:i).filter(i=>!(i.id===e&&i.source==="cron"))}catch(s){console.error("[DecisionCard] Feedback failed:",s),this.showToast("Failed to save feedback","error")}}async handleDecisionViewOutput(e,t){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const n=await this.client.request("queue.readOutput",{path:t}),s=t.split("/").pop()??"Agent Output";this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t,title:s})}catch(n){console.error("[DecisionCard] View output failed:",n),this.handleOpenFile(t)}}async handleDecisionOpenChat(e){const t=this.todayQueueResults?.find(i=>i.id===e);if(!t)return;if(t.sourceTaskId){await this.handleMissionControlOpenTaskSession(t.sourceTaskId);return}const{createNewSession:n}=await R(async()=>{const{createNewSession:i}=await Promise.resolve().then(()=>ht);return{createNewSession:i}},void 0,import.meta.url);n(this),this.setTab("chat");const{autoTitleCache:s}=await R(async()=>{const{autoTitleCache:i}=await Promise.resolve().then(()=>zn);return{autoTitleCache:i}},void 0,import.meta.url);if(s.set(this.sessionKey,t.title),t.outputPath&&this.client&&this.connected)try{const i=await this.client.request("queue.readOutput",{path:t.outputPath});i?.content&&await this.seedSessionWithAgentOutput(t.title,i.content)}catch{await this.seedSessionWithAgentOutput(t.title,t.summary)}else t.summary&&await this.seedSessionWithAgentOutput(t.title,t.summary)}async handleTodayOpenChatToEdit(e){try{const t=this.todayQueueResults?.find(s=>s.id===e),n=t?.outputPath;if(n&&this.client&&this.connected)try{const s=await this.client.request("queue.readOutput",{path:n});this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n,title:t?.title??n.split("/").pop()??"Agent Output"})}catch{await this.handleOpenFile(n)}this.allyPanelOpen=!0,this.allyUnread=0,this.tab!=="chat"&&this.setTab("chat")}catch(t){console.error("Open chat to edit failed:",t)}}async seedSessionWithAgentOutput(e,t,n){if(!this.client||!this.connected)return;this.handleOpenSidebar(t,{title:`Agent Output: ${e}`,filePath:null,mimeType:null});const s=t.match(/## Summary\n([\s\S]*?)(?=\n## |$)/),i=s?s[1].trim().split(`
`).slice(0,3).join(`
`):"Output available in sidebar.",a=[`Agent completed **${e}**.`,"",i,"","Full output is in the sidebar. What would you like to do?"].join(`
`);try{const{sendChatMessage:o}=await R(async()=>{const{sendChatMessage:c}=await Promise.resolve().then(()=>tt);return{sendChatMessage:c}},void 0,import.meta.url);await o(this,a)}catch(o){console.error("[Session] Failed to seed session with agent output:",o)}}async handleMissionControlAddToQueue(e,t){if(!(!this.client||!this.connected))try{await this.client.request("queue.add",{type:e,title:t,priority:"normal"}),this.showToast("Added to queue","success",2e3);const{loadMissionControl:n}=await R(async()=>{const{loadMissionControl:s}=await Promise.resolve().then(()=>ut);return{loadMissionControl:s}},void 0,import.meta.url);await n(this)}catch{this.showToast("Failed to add to queue","error")}}async handleDashboardsRefresh(){const{loadDashboards:e}=await R(async()=>{const{loadDashboards:t}=await Promise.resolve().then(()=>Qn);return{loadDashboards:t}},void 0,import.meta.url);await e(this)}async handleDashboardSelect(e){const{loadDashboard:t}=await R(async()=>{const{loadDashboard:n}=await Promise.resolve().then(()=>Qn);return{loadDashboard:n}},void 0,import.meta.url);if(await t(this,e),this.client&&this.connected)try{const n=await this.client.request("dashboards.openSession",{dashboardId:e});if(n?.sessionId){this.dashboardPreviousSessionKey=this.sessionKey;const s=n.sessionId,{autoTitleCache:i}=await R(async()=>{const{autoTitleCache:c}=await Promise.resolve().then(()=>zn);return{autoTitleCache:c}},void 0,import.meta.url);i.set(s,n.manifest.title),this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:s});const{saveDraft:a}=await R(async()=>{const{saveDraft:c}=await Promise.resolve().then(()=>da);return{saveDraft:c}},void 0,import.meta.url);a(this),this.sessionKey=s,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream();const{loadChatHistory:o}=await R(async()=>{const{loadChatHistory:c}=await Promise.resolve().then(()=>tt);return{loadChatHistory:c}},void 0,import.meta.url);await o(this),this.loadSessionResources(),this.dashboardChatOpen=!0}}catch(n){console.error("[Dashboards] Failed to init session on select:",n)}}async handleDashboardDelete(e){const{deleteDashboard:t}=await R(async()=>{const{deleteDashboard:n}=await Promise.resolve().then(()=>Qn);return{deleteDashboard:n}},void 0,import.meta.url);await t(this,e)}async handleDashboardTogglePin(e){const{toggleDashboardPin:t}=await R(async()=>{const{toggleDashboardPin:n}=await Promise.resolve().then(()=>Qn);return{toggleDashboardPin:n}},void 0,import.meta.url);await t(this,e)}async handleDashboardCreateViaChat(e){this.setTab("chat");const{createNewSession:t}=await R(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>ht);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e??"I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more.")}handleDashboardCategoryFilter(e){this.dashboardCategoryFilter=e}handleDashboardBack(){if(this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1,this.dashboardPreviousSessionKey){const e=this.dashboardPreviousSessionKey;this.dashboardPreviousSessionKey=null,R(async()=>{const{saveDraft:t}=await Promise.resolve().then(()=>da);return{saveDraft:t}},void 0,import.meta.url).then(({saveDraft:t})=>{t(this),this.sessionKey=e,R(async()=>{const{loadChatHistory:n}=await Promise.resolve().then(()=>tt);return{loadChatHistory:n}},void 0,import.meta.url).then(({loadChatHistory:n})=>{n(this)})})}}async handleDashboardOpenSession(e){const t=this.activeDashboardManifest?.sessionId;if(!t){this.showToast("No session for this dashboard","error");return}this.dashboardPreviousSessionKey=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1;const n=this.settings.openTabs.includes(t)?this.settings.openTabs:[...this.settings.openTabs,t];this.applySettings({...this.settings,openTabs:n,sessionKey:t,lastActiveSessionKey:t,tabLastViewed:{...this.settings.tabLastViewed,[t]:Date.now()}}),this.setTab("chat");const{syncUrlWithSessionKey:s}=await R(async()=>{const{syncUrlWithSessionKey:i}=await Promise.resolve().then(()=>fw);return{syncUrlWithSessionKey:i}},void 0,import.meta.url);s(this,t,!0)}async handleOptionsLoad(){const{loadOptions:e}=await R(async()=>{const{loadOptions:t}=await import("./options-QuHclvvX.js");return{loadOptions:t}},[],import.meta.url);await e(this)}async handleOptionToggle(e,t){const{saveOption:n}=await R(async()=>{const{saveOption:s}=await import("./options-QuHclvvX.js");return{saveOption:s}},[],import.meta.url);await n(this,e,t)}async handleSecondBrainRefresh(){const{loadSecondBrain:e}=await R(async()=>{const{loadSecondBrain:t}=await Promise.resolve().then(()=>Os);return{loadSecondBrain:t}},void 0,import.meta.url);await e(this)}handleSecondBrainSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.handleSecondBrainRefresh().catch(t=>{console.error("[SecondBrain] Refresh after subtab change failed:",t),this.secondBrainError=t instanceof Error?t.message:"Failed to load data",this.secondBrainLoading=!1})}async handleSecondBrainSelectEntry(e){if(e.endsWith(".html")||e.endsWith(".htm")){try{const s=await this.client.request("secondBrain.memoryBankEntry",{path:e});s?.content&&this.handleOpenSidebar(s.content,{mimeType:"text/html",filePath:e,title:s.name||e.split("/").pop()||"File"})}catch(s){console.error("[SecondBrain] Failed to open HTML file:",s)}return}const{loadSecondBrainEntry:n}=await R(async()=>{const{loadSecondBrainEntry:s}=await Promise.resolve().then(()=>Os);return{loadSecondBrainEntry:s}},void 0,import.meta.url);await n(this,e)}async handleSecondBrainBrowseFolder(e){const{browseFolder:t}=await R(async()=>{const{browseFolder:n}=await Promise.resolve().then(()=>Os);return{browseFolder:n}},void 0,import.meta.url);await t(this,e)}handleSecondBrainBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}handleSecondBrainSearch(e){this.secondBrainSearchQuery=e}async handleSecondBrainSync(){const{syncSecondBrain:e}=await R(async()=>{const{syncSecondBrain:t}=await Promise.resolve().then(()=>Os);return{syncSecondBrain:t}},void 0,import.meta.url);await e(this)}handleSecondBrainFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doSecondBrainFileSearch(e)}async _doSecondBrainFileSearch(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=t.results??[])}catch(t){console.error("[SecondBrain] search failed:",t)}}async handleSecondBrainFileSelect(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=e.endsWith(".html")||e.endsWith(".htm");this.handleOpenSidebar(t.content,{mimeType:n?"text/html":"text/markdown",filePath:e,title:t.name||e.split("/").pop()||"File"})}}catch(t){console.error("[SecondBrain] Failed to open file:",t),this.showToast("Failed to open file","error")}}async handleResearchSaveViaChat(){this.setTab("chat");const{createNewSession:e}=await R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>ht);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save.")}async handleAddSource(){this.setTab("chat");const{createNewSession:e}=await R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>ht);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect.")}removeQueuedMessage(e){th(this,e)}async handleSendChat(e,t){const n=this.sessionsResult?.sessions?.find(s=>s.key===this.sessionKey);if(n){const s=n.totalTokens??0,i=n.contextTokens??this.sessionsResult?.defaults?.contextTokens??2e5;if((i>0?s/i:0)>=.9&&!this.compactionStatus?.active){const o=(e??this.chatMessage).trim(),c=e==null?[...this.chatAttachments??[]]:[];if(o||c.length>0){this.pendingRetry={message:o,attachments:c,timestamp:Date.now()},this.autoRetryAfterCompact=!0,this.chatMessages=[...this.chatMessages,{role:"user",content:[{type:"text",text:o}],timestamp:Date.now()}],e==null&&(this.chatMessage="",this.chatAttachments=[]),this.showToast("Context near limit — auto-compacting...","info",3e3),this.handleCompactChat();return}}}await nh(this,e,t)}handleToggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen}handleToggleSessionSearch(e){if(!this.sessionSearchOpen&&e){const n=e.currentTarget.getBoundingClientRect();this.sessionSearchPosition={top:n.bottom+8,right:window.innerWidth-n.right}}this.sessionSearchOpen=!this.sessionSearchOpen,this.sessionSearchOpen||(this.sessionSearchQuery="",this.sessionSearchResults=[])}async handleSessionSearchQuery(e){if(this.sessionSearchQuery=e,!e.trim()){this.sessionSearchResults=[];return}if(this.client){this.sessionSearchLoading=!0;try{const t=await this.client.request("sessions.searchContent",{query:e.trim(),limit:20});this.sessionSearchResults=t.results}catch(t){console.error("Session search failed:",t),this.sessionSearchResults=[]}finally{this.sessionSearchLoading=!1}}}handleSelectSession(e){this.sessionPickerOpen=!1,this.sessionSearchOpen=!1,this.sessionSearchQuery="",this.sessionSearchResults=[]}async handleWhatsAppStart(e){await Jp(this,e)}async handleWhatsAppWait(){await Xp(this)}async handleWhatsAppLogout(){await Zp(this)}async handleChannelConfigSave(){await ef(this)}async handleChannelConfigReload(){await tf(this)}async handleCompactChat(){if(!this.connected){this.showToast("Cannot compact: not connected","error");return}if(!this.sessionKey){this.showToast("Cannot compact: no active session","error");return}this.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null};try{await this.handleSendChat("/compact")}catch(e){this.compactionStatus=null,console.error("Compaction failed:",e),this.showToast("Compaction failed","error")}}injectCompactionSummary(e,t){const n={role:"system",content:e,timestamp:Date.now(),isCompactionSummary:!0,keptMessages:t};this.chatMessages=[n,...this.chatMessages]}async handleRetryMessage(){const e={client:this.client,connected:this.connected,sessionKey:this.sessionKey,chatLoading:this.chatLoading,chatMessages:this.chatMessages,chatThinkingLevel:this.chatThinkingLevel,chatSending:this.chatSending,chatSendingSessionKey:this.chatSendingSessionKey,chatMessage:this.chatMessage,chatAttachments:this.chatAttachments,chatRunId:this.chatRunId,chatStream:this.chatStream,chatStreamStartedAt:this.chatStreamStartedAt,lastError:this.lastError,pendingRetry:this.pendingRetry},t=await Dd(e);this.chatSending=e.chatSending,this.chatSendingSessionKey=e.chatSendingSessionKey,this.chatRunId=e.chatRunId,this.chatStream=e.chatStream,this.chatStreamStartedAt=e.chatStreamStartedAt,this.lastError=e.lastError,this.pendingRetry=e.pendingRetry??null,this.chatMessages=e.chatMessages,t&&this.showToast("Message resent","success",2e3)}handleClearRetry(){this.pendingRetry=null}handleNostrProfileEdit(e,t){sf(this,e,t)}handleNostrProfileCancel(){af(this)}handleNostrProfileFieldChange(e,t){of(this,e,t)}async handleNostrProfileSave(){await lf(this)}async handleNostrProfileImport(){await cf(this)}handleNostrProfileToggleAdvanced(){rf(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,ot(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleGatewayRestartClick(){this.gatewayRestartPending=!0}async handleGatewayRestartConfirm(){if(!(!this.client||this.gatewayRestartBusy)){this.gatewayRestartBusy=!0;try{await this.client.request("godmode.gateway.restart")}catch{}finally{this.gatewayRestartBusy=!1,this.gatewayRestartPending=!1}}}handleGatewayRestartCancel(){this.gatewayRestartPending=!1}handleDeployPanelToggle(){this.deployPanelOpen=!this.deployPanelOpen}async handleDeployDismiss(){if(this.client){try{await this.client.request("godmode.deploy.dismiss")}catch{}this.deployPanelOpen=!1,this.updateStatus&&(this.updateStatus={...this.updateStatus,pendingDeploy:null})}}handleOpenSidebar(e,t={}){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarMimeType=t.mimeType?.trim()||null,this.sidebarFilePath=t.filePath?.trim()||null,this.sidebarTitle=t.title?.trim()||null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.showDrivePicker=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode!=="proof"&&(this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null),this.sidebarCloseTimer=null)},200)}async handleOpenFile(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}let t=e;if(!e.includes("/")&&!e.includes("\\")&&!e.startsWith("~"))try{t=(await this.client.request("files.resolve",{filename:e})).path}catch{}try{const n=await this.client.request("files.read",{path:t}),s=t.split(".").pop()?.toLowerCase()??"",i=n.contentType??n.mime??(s==="md"?"text/markdown":null),a=t.split("/").pop()??t;this.handleOpenSidebar(n.content,{mimeType:i,filePath:t,title:a}),n.truncated&&this.showToast(`Opened truncated file: ${a}`,"warning")}catch(n){console.error("[Chat] Failed to open file:",n),this.showToast(`Failed to open file: ${e}`,"error")}}async handleToggleDrivePicker(){if(this.showDrivePicker){this.showDrivePicker=!1;return}if(this.driveAccounts.length===0)try{const e=await this.client?.request("files.listDriveAccounts",{});this.driveAccounts=e?.accounts??[]}catch{this.driveAccounts=[]}this.showDrivePicker=!0}async handlePushToDrive(e,t){if(!this.driveUploading){if(this.showDrivePicker=!1,this._pendingBatchPaths&&this._pendingBatchPaths.length>0){const n=this._pendingBatchPaths;this._pendingBatchPaths=void 0,await this._executeBatchDrive(n,t);return}this.driveUploading=!0;try{const n={filePath:e};t&&(n.account=t);const s=await this.client?.request("files.pushToDrive",n),i=t?` to ${t.split("@")[0]}`:"",a=s?.message??`Uploaded${i} to Google Drive`,o=s?.driveUrl;this.showToast(a,"success",o?8e3:5e3,o?{label:"View in Drive",url:o}:void 0)}catch(n){console.error("Push to Drive failed:",n);const s=n instanceof Error?n.message:typeof n=="object"&&n!==null&&"message"in n?String(n.message):"Unknown error";s.includes("GOG_NOT_FOUND")||s.includes("gog CLI not found")?this.showToast("Google Drive not configured. Install gog CLI: npm install -g gog-cli, then run: gog auth add <email> --services drive","warning",1e4):s.includes("GOG_AUTH")||s.includes("auth")&&s.includes("expired")?this.showToast("Google Drive auth expired. Re-authenticate: gog auth add <email> --services drive","warning",8e3):this.showToast(`Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1}}}async handleBatchPushToDrive(e){if(this.driveUploading||e.length===0)return;if(!this.driveAccounts||this.driveAccounts.length===0)try{const n=await this.client?.request("files.listDriveAccounts");this.driveAccounts=n?.accounts??[]}catch{}if(this.driveAccounts&&this.driveAccounts.length>1){this._pendingBatchPaths=e,this.showDrivePicker=!0;return}const t=this.driveAccounts?.[0]?.email;await this._executeBatchDrive(e,t)}async _executeBatchDrive(e,t){this.driveUploading=!0,this.showToast(`Uploading ${e.length} files to Drive...`,"info",0);try{const n={filePaths:e};t&&(n.account=t);const s=await this.client?.request("files.batchPushToDrive",n);this.dismissAllToasts();const i=s?.results?.filter(o=>o.success).length??0,a=s?.results?.length??e.length;i===a?this.showToast(`Uploaded ${i} files to Google Drive`,"success",5e3):this.showToast(`Uploaded ${i}/${a} files (${a-i} failed)`,"warning",8e3)}catch(n){this.dismissAllToasts();const s=n instanceof Error?n.message:"Unknown error";this.showToast(`Batch Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1,this._pendingBatchPaths=void 0}}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}handleImageClick(e,t,n){this.lightbox=US(e,t,n)}handleLightboxClose(){this.lightbox=zS()}handleLightboxNav(e){this.lightbox=KS(this.lightbox,e)}normalizeWorkspacePathCandidate(e,t={}){let n=e.trim();if(!n||n.startsWith("#"))return null;for(;n.startsWith("./");)n=n.slice(2);if(n=n.replaceAll("\\","/"),!t.allowAbsolute)for(;n.startsWith("/");)n=n.slice(1);return!n||n.includes("\0")?null:n}isAbsoluteFilesystemPath(e){return e.startsWith("/")||e.startsWith("~/")||/^[a-z]:[\\/]/i.test(e)}inferMimeTypeFromPath(e){if(!e)return null;const t=e.trim().toLowerCase();if(!t)return null;const n=t.split(".").pop()??"";return n?n==="md"||n==="markdown"||n==="mdx"?"text/markdown":n==="html"||n==="htm"?"text/html":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":n==="svg"||n==="svgz"?"image/svg+xml":n==="avif"||n==="bmp"||n==="gif"||n==="heic"||n==="heif"||n==="jpeg"||n==="jpg"||n==="png"||n==="webp"?`image/${n==="jpg"?"jpeg":n}`:null:null}sidebarTitleForPath(e){const t=e.replaceAll("\\","/").trim();if(!t)return"Document";const n=t.split("/");return n[n.length-1]||t}async listWorkspaceIdsForPathResolution(){const e=[],t=new Set,n=s=>{if(typeof s!="string")return;const i=s.trim();!i||t.has(i)||(t.add(i),e.push(i))};n(this.selectedWorkspace?.id);for(const s of this.workspaces??[])n(s.id);if(e.length>0||!this.client||!this.connected)return e;try{const s=await this.client.request("workspaces.list",{});for(const i of s.workspaces??[])n(i.id)}catch{}return e}async openWorkspaceRelativeFileInViewer(e){if(!this.client||!this.connected)return!1;const t=await this.listWorkspaceIdsForPathResolution();for(const n of t)try{const s=await this.client.request("workspaces.readFile",{workspaceId:n,filePath:e});if(typeof s.content!="string")continue;return this.handleOpenSidebar(s.content,{mimeType:s.contentType??s.mime??this.inferMimeTypeFromPath(e),filePath:s.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}return!1}extractWorkspacePathCandidatesFromHref(e){const t=e.trim();if(!t)return[];const n=[],s=t.toLowerCase();if(s.startsWith("mailto:")||s.startsWith("tel:")||s.startsWith("javascript:")||s.startsWith("data:"))return[];if(t.startsWith("file://")){let u=t.slice(7);u.startsWith("/~/")&&(u="~"+u.slice(2));try{u=decodeURIComponent(u)}catch{}n.push(u);const l=[],h=new Set;for(const f of n){const v=this.normalizeWorkspacePathCandidate(f,{allowAbsolute:!0});!v||h.has(v)||(h.add(v),l.push(v))}return l}const i=/^[a-z][a-z0-9+.-]*:/i.test(t),a=/^[a-z]:[\\/]/i.test(t);(!i||a)&&n.push(t);let o=null;try{o=new URL(t,window.location.href)}catch{o=null}if(o&&/^https?:$/.test(o.protocol)&&o.origin===window.location.origin){for(const b of F2){const $=o.searchParams.get(b);$&&n.push($)}const l=(t.split("#")[0]??"").split("?")[0]??"";l.length>0&&!l.startsWith("/")&&!l.includes("://")&&n.push(l);let f=o.pathname;this.basePath&&f.startsWith(`${this.basePath}/`)?f=f.slice(this.basePath.length):this.basePath&&f===this.basePath&&(f="");const v=f.startsWith("/")?f.slice(1):f;if(v){n.push(v);const b=v.indexOf("/");if(b>0){const $=v.slice(0,b).toLowerCase();Lc.has($)&&n.push(v.slice(b+1))}}if(f.startsWith("/")&&v){const b=v.split("/")[0]?.toLowerCase()??"";Lc.has(b)||n.push(f)}}const c=[],d=new Set;for(const u of n){let l=u;try{l=decodeURIComponent(u)}catch{}const h=this.normalizeWorkspacePathCandidate(l,{allowAbsolute:!0});!h||d.has(h)||(d.add(h),c.push(h))}return c}async openWorkspaceFileInViewer(e){if(!this.client||!this.connected)return!1;const t=this.isAbsoluteFilesystemPath(e);if(!t&&await this.openWorkspaceRelativeFileInViewer(e))return!0;try{const n=await this.client.request("workspaces.readFile",{path:e});if(typeof n.content=="string")return this.handleOpenSidebar(n.content,{mimeType:n.contentType??n.mime??this.inferMimeTypeFromPath(e),filePath:n.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}if(!t)return!1;try{const n=await this.client.request("files.read",{path:e,maxSize:1e6});return typeof n.content!="string"?!1:(this.handleOpenSidebar(n.content,{mimeType:this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0)}catch{return!1}}async handleOpenMessageFileLink(e){const t=this.extractWorkspacePathCandidatesFromHref(e);if(t.length===0)return!1;for(const n of t)if(await this.openWorkspaceFileInViewer(n))return!0;return!1}showToast(e,t="info",n=5e3,s){const i=L2(e,t,n,s);this.toasts=D2(this.toasts,i),n>0&&window.setTimeout(()=>{this.dismissToast(i.id)},n)}dismissToast(e){this.toasts=P2(this.toasts,e)}dismissAllToasts(){this.toasts=[]}async handleMyDayRefresh(){await ds(this),this._loadDecisionCards()}_loadDecisionCards(){R(()=>Promise.resolve().then(()=>Hn),void 0,import.meta.url).then(async e=>{this.todayQueueResults=await e.loadTodayQueueResults(this)}).catch(()=>{})}async loadTodayQueueResults(){this._loadDecisionCards()}async handleMyDayTaskStatusChange(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,status:t,completedAt:t==="complete"?new Date().toISOString():null});const{loadTodayTasksWithQueueStatus:n}=await R(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>Hn);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task status:",n)}}async handleTodayCreateTask(e){if(!(!this.client||!this.connected))try{await this.client.request("tasks.create",{title:e,dueDate:X(),priority:"medium",source:"chat"});const{loadTodayTasksWithQueueStatus:t}=await R(async()=>{const{loadTodayTasksWithQueueStatus:n}=await Promise.resolve().then(()=>Hn);return{loadTodayTasksWithQueueStatus:n}},void 0,import.meta.url);await t(this)}catch(t){console.error("[MyDay] Failed to create task:",t),this.showToast("Failed to create task","error")}}handleTodayEditTask(e){this.todayEditingTaskId=e}async handleTodayUpdateTask(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,...t}),this.todayEditingTaskId=null;const{loadTodayTasksWithQueueStatus:n}=await R(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>Hn);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task:",n),this.showToast("Failed to update task","error")}}handleTodayToggleCompleted(){this.todayShowCompleted=!this.todayShowCompleted}async handleTodayViewTaskOutput(e){if(!(!this.client||!this.connected))try{const n=(await this.client.request("queue.list",{limit:100}))?.items?.find(a=>a.sourceTaskId===e);if(!n?.result?.outputPath){this.showToast("No output available for this task","info");return}const s=await this.client.request("queue.readOutput",{path:n.result.outputPath}),i=n.result.outputPath.split("/").pop()??"Agent Output";this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n.result.outputPath,title:i})}catch(t){console.error("[Tasks] View output failed:",t),this.showToast("Failed to load agent output","error")}}async handleTodayStartTask(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e}),n=t?.sessionId??t?.sessionKey;if(n){if(t.task?.title){const{autoTitleCache:a}=await R(async()=>{const{autoTitleCache:c}=await Promise.resolve().then(()=>zn);return{autoTitleCache:c}},void 0,import.meta.url);a.set(n,t.task.title);const{hostPatchSession:o}=await R(async()=>{const{hostPatchSession:c}=await Promise.resolve().then(()=>Dv);return{hostPatchSession:c}},void 0,import.meta.url);o(this.client,n,t.task.title)}this.setTab("chat"),this.sessionKey=n;const s=this.settings.openTabs.includes(n)?this.settings.openTabs:[...this.settings.openTabs,n];this.applySettings({...this.settings,sessionKey:n,lastActiveSessionKey:n,openTabs:s}),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:i}=await R(async()=>{const{loadChatHistory:a}=await Promise.resolve().then(()=>tt);return{loadChatHistory:a}},void 0,import.meta.url);await i(this),this.loadSessionResources(),t.queueOutput&&this.chatMessages.length===0&&this.seedSessionWithAgentOutput(t.task?.title??"this task",t.queueOutput,t.agentPrompt??void 0),this.requestUpdate()}}catch(t){console.error("[MyDay] Failed to open session for task:",t),this.showToast("Failed to open session for task","error")}}handleDatePrev(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()-1),this.todaySelectedDate=X(e),yn(this)}handleDateNext(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()+1);const t=X(),n=X(e);n>t||(this.todaySelectedDate=n,yn(this))}handleDateToday(){this.todaySelectedDate=X(),ds(this)}async handleDailyBriefRefresh(){await yn(this)}async handleDailyBriefGenerate(){if(!(!this.client||!this.connected)){this.dailyBriefLoading=!0;try{await this.client.request("dailyBrief.generate",{}),await yn(this)}catch(e){this.dailyBriefError=e instanceof Error?e.message:"Failed to generate brief"}finally{this.dailyBriefLoading=!1}}}handleDailyBriefOpenInObsidian(){const e=this.dailyBrief?.date;Wo(e)}async loadBriefNotes(){if(!this.client||!this.connected)return;const e=this.todaySelectedDate;try{const t=await this.client.request("briefNotes.get",{date:e});this.briefNotes=t.notes??{}}catch(t){console.error("[BriefNotes] Load error:",t),this.briefNotes={}}}async handleBriefNoteSave(e,t){if(!this.client||!this.connected)return;const n=this.todaySelectedDate;try{const s=await this.client.request("briefNotes.update",{date:n,section:e,text:t});this.briefNotes=s.notes??{}}catch(s){console.error("[BriefNotes] Save error:",s),this.showToast("Failed to save note","error")}}handleTodayViewModeChange(e){this.todayViewMode=e}handlePrivateModeToggle(){if(this.chatPrivateMode){const e=this.sessionKey;this.chatPrivateMode=!1,this._destroyPrivateSession(e),this.showToast("Private session destroyed","info",2e3);return}this.chatPrivateMode=!0,this.setTab("chat"),R(async()=>{const{createNewSession:e}=await Promise.resolve().then(()=>ht);return{createNewSession:e}},void 0,import.meta.url).then(({createNewSession:e})=>{e(this);const t=Date.now()+1440*60*1e3;this.privateSessions=new Map(this.privateSessions).set(this.sessionKey,t),this._persistPrivateSessions(),this._startPrivateSessionTimer(),this.client&&this.connected&&this.client.request("session.setPrivate",{sessionKey:this.sessionKey,enabled:!0}).catch(()=>{}),this.chatMessages=[{role:"assistant",content:`This is a **private session**. Nothing will be saved to memory or logs.

This session self-destructs when you close it or in **24 hours** — whichever comes first.`,timestamp:Date.now()}],this.requestUpdate()}),this.showToast("Private session created — 24h countdown started","info",3e3)}async _destroyPrivateSession(e){const t=new Map(this.privateSessions);if(t.delete(e),this.privateSessions=t,this._persistPrivateSessions(),this.sessionKey===e){this.chatPrivateMode=!1;const n=this.settings.openTabs.filter(i=>i!==e),s=n[0]||J;this.applySettings({...this.settings,openTabs:n,sessionKey:s,lastActiveSessionKey:s}),this.sessionKey=s,(await R(async()=>{const{loadChatHistory:i}=await Promise.resolve().then(()=>tt);return{loadChatHistory:i}},void 0,import.meta.url)).loadChatHistory(this)}else this.applySettings({...this.settings,openTabs:this.settings.openTabs.filter(n=>n!==e)});this.client&&this.connected&&(this.client.request("session.setPrivate",{sessionKey:e,enabled:!1}).catch(()=>{}),this.client.request("sessions.delete",{key:e,deleteTranscript:!0}).catch(()=>{})),this.privateSessions.size===0&&this._stopPrivateSessionTimer()}_persistPrivateSessions(){const e=Array.from(this.privateSessions.entries());e.length===0?localStorage.removeItem("godmode.privateSessions"):localStorage.setItem("godmode.privateSessions",JSON.stringify(e))}_restorePrivateSessions(){try{const e=localStorage.getItem("godmode.privateSessions");if(!e)return;const t=JSON.parse(e),n=Date.now(),s=t.filter(([,i])=>i>n);if(this.privateSessions=new Map(s),s.length!==t.length){const i=t.filter(([,a])=>a<=n);for(const[a]of i)this._destroyPrivateSession(a)}this.privateSessions.size>0&&(this.privateSessions.has(this.sessionKey)&&(this.chatPrivateMode=!0),this._startPrivateSessionTimer()),this._persistPrivateSessions()}catch{localStorage.removeItem("godmode.privateSessions")}}_startPrivateSessionTimer(){this._privateSessionTimer||(this._privateSessionTimer=setInterval(()=>{const e=Date.now();for(const[t,n]of this.privateSessions)n<=e&&(this._destroyPrivateSession(t),this.showToast("Private session expired and was destroyed","info",3e3));this.privateSessions.size>0&&this.requestUpdate()},3e4))}_stopPrivateSessionTimer(){this._privateSessionTimer&&(clearInterval(this._privateSessionTimer),this._privateSessionTimer=null)}async handleBriefSave(e){if(!this.client||!this.connected)return;const t=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.update",{date:t,content:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(n){console.error("[DailyBrief] Save error:",n),this.showToast("Failed to save brief","error")}}async handleBriefToggleCheckbox(e,t){if(!this.client||!this.connected)return;const n=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.toggleCheckbox",{date:n,index:e,checked:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(s){console.error("[DailyBrief] Checkbox toggle error:",s),this.showToast("Failed to toggle checkbox","error")}}async handleWorkRefresh(){await Promise.all([_u(this),Au(this)])}async handleResourcePin(e,t){await Hb(this,e,t)}async handleResourceDelete(e){await Vb(this,e)}handleResourceFilterChange(e){this.workResourceFilter=e}handleResourceClick(e){e.path?this.handleWorkFileClick(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}async loadSessionResources(){if(!(!this.client||!this.connected))try{const t=(await this.client.request("resources.list",{sessionKey:this.sessionKey,limit:20})).resources??[],n=new Set(t.filter(s=>s.proofSlug).map(s=>s.proofSlug));if(this.chatMessages?.length)for(const s of this.chatMessages){const i=s,a=Array.isArray(i.content)?i.content:[];for(const o of a){const c=typeof o.text=="string"?o.text:typeof o.content=="string"?o.content:null;if(c)try{const d=JSON.parse(c);d._sidebarAction?.type==="proof"&&d._sidebarAction.slug&&!n.has(d._sidebarAction.slug)&&(n.add(d._sidebarAction.slug),t.unshift({id:`proof:${d._sidebarAction.slug}`,title:d.title??"Proof Document",type:"doc",path:d.filePath,sessionKey:this.sessionKey,proofSlug:d._sidebarAction.slug}))}catch{}}}this.sessionResources=t}catch(e){console.warn("[SessionResources] load failed:",e),this.sessionResources=[]}}handleSessionResourceClick(e){e.proofSlug?this.handleOpenProofDoc(e.proofSlug):e.path?this.handleOpenFile(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}handleToggleSessionResources(){this.sessionResourcesCollapsed=!this.sessionResourcesCollapsed}handleViewAllResources(){this.setTab("work")}handleWorkToggleProject(e){const t=new Set(this.workExpandedProjects);t.has(e)?t.delete(e):(t.add(e),this.workProjectFiles[e]||jb(this,e)),this.workExpandedProjects=t}async handleWorkFileClick(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("workspaces.readFile",{path:e});if(!t.content){this.showToast(t.error??"Failed to read file","error");return}this.handleOpenSidebar(t.content,{mimeType:t.contentType??t.mime??this.inferMimeTypeFromPath(e),filePath:t.path??e,title:this.sidebarTitleForPath(e)})}catch(t){console.error("[Work] Failed to read file:",t),this.showToast(`Failed to open: ${e}`,"error")}}handleWorkSkillClick(e,t){this.handleStartChatWithPrompt(`Tell me about the "${e}" skill and how it's used in the ${t} project.`)}handlePeopleImport(e){const t=e==="apple"?"Import my contacts from Apple Contacts and organize them into categories.":"Import my contacts from Google Contacts and organize them into categories.";this.handleStartChatWithPrompt(t)}async handleWorkspacesRefresh(){await ys(this)}async handleWorkspaceBrowse(e){if(!this.selectedWorkspace)return;const{browseWorkspaceFolder:t}=await R(async()=>{const{browseWorkspaceFolder:s}=await Promise.resolve().then(()=>Ws);return{browseWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&(this.workspaceBrowsePath=e,this.workspaceBrowseEntries=n.entries,this.workspaceBreadcrumbs=n.breadcrumbs)}async handleWorkspaceBrowseSearch(e){if(this.workspaceBrowseSearchQuery=e,!e.trim()||!this.selectedWorkspace){this.workspaceBrowseSearchResults=null;return}const{searchWorkspaceFiles:t}=await R(async()=>{const{searchWorkspaceFiles:n}=await Promise.resolve().then(()=>Ws);return{searchWorkspaceFiles:n}},void 0,import.meta.url);this.workspaceBrowseSearchResults=await t(this,this.selectedWorkspace.id,e)}handleWorkspaceBrowseBack(){this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null}async handleWorkspaceCreateFolder(e){if(!this.selectedWorkspace)return;const{createWorkspaceFolder:t}=await R(async()=>{const{createWorkspaceFolder:s}=await Promise.resolve().then(()=>Ws);return{createWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&this.workspaceBrowsePath&&await this.handleWorkspaceBrowse(this.workspaceBrowsePath),n&&this.showToast("Folder created","success",2e3)}handleOnboardingStart(){this.onboardingPhase=1,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:1}),this.client?.request("onboarding.update",{phase:1,completePhase:0})}async handleOnboardingIdentitySubmit(e){if(this.client)try{await this.client.request("onboarding.update",{phase:2,completePhase:1,identity:e}),this.onboardingPhase=2,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:2,identity:e}),this.userName=e.name,this.userAvatar=e.emoji,this.applySettings({...this.settings,userName:e.name,userAvatar:e.emoji}),this.setTab("chat"),R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>ht);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this);const n=`I just set up my GodMode identity. My name is ${e.name}${e.mission?` and my mission is: ${e.mission}`:""}. Let's set up my workspace.`;this.chatMessage=n,this.handleSendChat(n)})}catch(t){console.error("[Onboarding] Identity submit failed:",t),this.showToast("Failed to save identity","error")}}handleOnboardingSkipPhase(){if(!this.client)return;const e=Math.min(this.onboardingPhase+1,6);this.onboardingPhase=e,this.client.request("onboarding.update",{phase:e,completePhase:this.onboardingPhase})}handleOnboardingComplete(){this.onboardingActive=!1,this.onboardingPhase=6,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:6,completedAt:new Date().toISOString()}),this.client?.request("onboarding.complete",{summary:this.onboardingData?.summary??null}),this.showToast("Welcome to GodMode!","success",4e3)}handleStartChatWithPrompt(e){this.setTab("chat"),R(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>ht);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this),this.chatMessage=e,this.requestUpdate()})}handleOpenSupportChat(){const e="agent:main:support";if(this.sessionKey===e){this.setTab("chat");return}R(async()=>{const{saveDraft:s}=await Promise.resolve().then(()=>da);return{saveDraft:s}},void 0,import.meta.url).then(({saveDraft:s})=>s(this));const n=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:n,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),R(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>zn);return{autoTitleCache:s}},void 0,import.meta.url).then(({autoTitleCache:s})=>{s.set(e,"Support")}),R(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>tt);return{loadChatHistory:s}},void 0,import.meta.url).then(({loadChatHistory:s})=>{s(this).then(()=>{this.loadSessionResources(),this.chatMessages.length===0&&this.sessionKey===e&&(this.chatMessages=[{role:"assistant",content:`**Welcome to GodMode Support**

I have full access to your system diagnostics and GodMode knowledge base. I can help with:

- Troubleshooting issues
- Feature questions and configuration
- Setup guidance
- Escalation to the team if needed

What can I help you with?`,timestamp:Date.now()}],this.requestUpdate())}).catch(i=>{console.error("[Support] Failed to load chat history:",i)})})}handleWizardOpen(){R(async()=>{const{emptyWizardState:e}=await Promise.resolve().then(()=>p1);return{emptyWizardState:e}},void 0,import.meta.url).then(({emptyWizardState:e})=>{this.wizardState=e(),this.wizardActive=!0,this.requestUpdate()})}handleWizardClose(){this.wizardActive=!1,this.wizardState=null,this.requestUpdate()}handleWizardStepChange(e){this.wizardState&&(this.wizardState={...this.wizardState,step:e},this.requestUpdate())}handleWizardAnswerChange(e,t){this.wizardState&&(this.wizardState={...this.wizardState,answers:{...this.wizardState.answers,[e]:t}},this.requestUpdate())}async handleWizardPreview(){if(!(!this.client||!this.wizardState))try{const[e,t]=await Promise.all([this.client.request("onboarding.wizard.preview",this.wizardState.answers),this.client.request("onboarding.wizard.diff",this.wizardState.answers).catch(()=>null)]),n={};for(const i of e.files??[])n[i.path]=i.wouldCreate;const s={};if(t){for(const i of t.additions)s[i.path]=!0;for(const i of t.changes)s[i.path]=!1}this.wizardState={...this.wizardState,preview:e.files??[],diff:t,fileSelections:n,configSelections:s},this.requestUpdate()}catch(e){console.error("[Wizard] Preview failed:",e)}}handleWizardFileToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,fileSelections:{...this.wizardState.fileSelections,[e]:t}},this.requestUpdate())}handleWizardConfigToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,configSelections:{...this.wizardState.configSelections,[e]:t}},this.requestUpdate())}async handleWizardGenerate(){if(!this.client||!this.wizardState)return;this.wizardState={...this.wizardState,generating:!0,error:null},this.requestUpdate();const e=[];for(const[n,s]of Object.entries(this.wizardState.fileSelections))s||e.push(n);const t=[];for(const[n,s]of Object.entries(this.wizardState.configSelections))s||t.push(n);try{const n=await this.client.request("onboarding.wizard.generate",{...this.wizardState.answers,skipFiles:e,skipKeys:t});this.wizardState={...this.wizardState,generating:!1,step:9,result:{filesCreated:n.filesCreated,filesSkipped:n.filesSkipped,configPatched:n.configPatched,workspacePath:n.workspacePath}},this.requestUpdate(),this.showToast("Memory system generated!","success",4e3)}catch(n){const s=n instanceof Error?n.message:"Failed to generate workspace";this.wizardState={...this.wizardState,generating:!1,error:s},this.requestUpdate(),this.showToast(s,"error")}}async handleQuickSetup(e){R(()=>import("./setup-CWjMtnE4.js"),[],import.meta.url).then(async({quickSetup:t})=>{await t(this,e)&&(this.setTab("chat"),R(async()=>{const{loadCapabilities:s}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:s}},[],import.meta.url).then(({loadCapabilities:s})=>s(this)))})}handleLoadCapabilities(){R(async()=>{const{loadCapabilities:e}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:e}},[],import.meta.url).then(({loadCapabilities:e})=>e(this))}handleCapabilityAction(e){R(async()=>{const{capabilityAction:t}=await import("./setup-CWjMtnE4.js");return{capabilityAction:t}},[],import.meta.url).then(({capabilityAction:t})=>t(this,e))}handleHideSetup(){R(async()=>{const{hideSetup:e}=await import("./setup-CWjMtnE4.js");return{hideSetup:e}},[],import.meta.url).then(({hideSetup:e})=>e(this))}handleRunAssessment(){this.client&&this.client.request("onboarding.assess",{}).then(()=>{this.handleLoadCapabilities()})}handleUpdateUserProfile(e,t){const n=e.trim().slice(0,50),s=t.trim();this.userName=n||"You",this.userAvatar=s||null,this.applySettings({...this.settings,userName:n,userAvatar:s})}async handleLoadIntegrations(){await(await R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadIntegrations(this)}handleExpandCard(e){R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.expandCard(this,e))}async handleLoadGuide(e){await(await R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadGuide(this,e)}async handleTestIntegration(e){await(await R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).testIntegration(this,e)}async handleConfigureIntegration(e,t){await(await R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).configureIntegration(this,e,t)}handleUpdateConfigValue(e,t){this.onboardingConfigValues={...this.onboardingConfigValues,[e]:t}}handleSkipIntegration(e){R(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.skipIntegration(this,e))}async handleMarkOnboardingComplete(){if(!(!this.client||!this.connected))try{await this.client.request("onboarding.complete",{}),this.godmodeOptions&&(this.godmodeOptions={...this.godmodeOptions,"onboarding.complete":!0}),this.showSetupTab=!1,this.setTab("chat")}catch(e){console.error("[onboarding] Failed to mark complete:",e)}}async handleInboxRefresh(){if(!(!this.client||!this.connected)){this.inboxLoading=!0;try{const e=await this.client.request("inbox.list",{status:"pending",limit:50});this.inboxItems=e.items,this.inboxCount=e.pendingCount}catch(e){console.error("[Inbox] Failed to load:",e)}finally{this.inboxLoading=!1}}}async handleInboxScore(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("inbox.score",{itemId:e,score:t,feedback:n}),this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,await this.handleInboxRefresh()}catch(s){console.error("[Inbox] Score failed:",s)}}async handleInboxDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("inbox.dismiss",{itemId:e}),await this.handleInboxRefresh()}catch(t){console.error("[Inbox] Dismiss failed:",t)}}async handleInboxMarkAll(){if(!(!this.client||!this.connected))try{await this.client.request("inbox.markAllComplete",{}),await this.handleInboxRefresh()}catch(e){console.error("[Inbox] Mark all failed:",e)}}async handleInboxViewOutput(e){const t=this.inboxItems?.find(n=>n.id===e);if(t){if(t.outputPath&&this.client)try{const n=await this.client.request("files.read",{path:t.outputPath,maxSize:5e5});if(n?.content){this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t.outputPath,title:t.title});return}}catch(n){console.error("[Inbox] Failed to load output file:",n)}t.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}}async handleInboxViewProof(e){const t=this.inboxItems?.find(n=>n.id===e);t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug)}handleInboxOpenChat(e){const t=this.inboxItems?.find(n=>n.id===e);if(t?.type==="project-completion"&&t.coworkSessionId){this.setSessionKey(t.coworkSessionId),this.setTab("chat"),t?.proofDocSlug&&this.handleOpenProofDoc(t.proofDocSlug);return}if(t?.source.taskId){this.handleMissionControlOpenTaskSession(t.source.taskId);return}t?.sessionId&&(this.setSessionKey(t.sessionId),this.setTab("chat"))}handleInboxSetScoring(e,t){e!==this.inboxScoringId&&(this.inboxFeedbackText=""),this.inboxScoringId=e,this.inboxScoringValue=t??7}handleInboxFeedbackChange(e){this.inboxFeedbackText=e}handleInboxSortToggle(){this.inboxSortOrder=this.inboxSortOrder==="newest"?"oldest":"newest"}async handleTrustDailyRate(e){if(this.client)try{await this.client.request("trust.dailyRate",{rating:e}),this.trustSummary&&(this.trustSummary={...this.trustSummary,todayRated:!0})}catch(t){console.error("[Trust] Daily rate failed:",t),this.showToast("Failed to submit daily rating","error")}}async handleOpenProofDoc(e){let t="Proof Document",n=null,s=null;if(this.client&&this.connected)try{const i=await this.client.request("proof.get",{slug:e});t=i.title?.trim()||t,n=i.filePath?.trim()||null,s=i.viewUrl?.trim()||null}catch(i){console.warn("[Proof] Failed to resolve document metadata:",i)}this.sidebarOpen=!0,this.sidebarMode="proof",this.sidebarProofSlug=e,this.sidebarProofUrl=s,this.sidebarProofHtml=null,this.sidebarFilePath=n,this.sidebarTitle=t}handleCloseProofDoc(){this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarProofHtml=null,this.handleCloseSidebar()}render(){return v2(this)}};y([Bp({context:ps}),g()],m.prototype,"_ctx",2);y([g()],m.prototype,"settings",2);y([g()],m.prototype,"password",2);y([g()],m.prototype,"tab",2);y([g()],m.prototype,"onboarding",2);y([g()],m.prototype,"connected",2);y([g()],m.prototype,"reconnecting",2);y([g()],m.prototype,"reconnectAttempt",2);y([g()],m.prototype,"theme",2);y([g()],m.prototype,"themeResolved",2);y([g()],m.prototype,"hello",2);y([g()],m.prototype,"lastError",2);y([g()],m.prototype,"eventLog",2);y([g()],m.prototype,"assistantName",2);y([g()],m.prototype,"assistantAvatar",2);y([g()],m.prototype,"assistantAgentId",2);y([g()],m.prototype,"userName",2);y([g()],m.prototype,"userAvatar",2);y([g()],m.prototype,"sessionKey",2);y([g()],m.prototype,"sessionPickerOpen",2);y([g()],m.prototype,"sessionPickerPosition",2);y([g()],m.prototype,"sessionPickerSearch",2);y([g()],m.prototype,"sessionSearchOpen",2);y([g()],m.prototype,"sessionSearchPosition",2);y([g()],m.prototype,"sessionSearchQuery",2);y([g()],m.prototype,"sessionSearchResults",2);y([g()],m.prototype,"sessionSearchLoading",2);y([g()],m.prototype,"profilePopoverOpen",2);y([g()],m.prototype,"profileEditName",2);y([g()],m.prototype,"profileEditAvatar",2);y([g()],m.prototype,"editingTabKey",2);y([g()],m.prototype,"chatLoading",2);y([g()],m.prototype,"chatSending",2);y([g()],m.prototype,"chatSendingSessionKey",2);y([g()],m.prototype,"chatMessage",2);y([g()],m.prototype,"chatDrafts",2);y([g()],m.prototype,"chatMessages",2);y([g()],m.prototype,"chatToolMessages",2);y([g()],m.prototype,"chatStream",2);y([g()],m.prototype,"chatStreamStartedAt",2);y([g()],m.prototype,"chatRunId",2);y([g()],m.prototype,"currentToolName",2);y([g()],m.prototype,"currentToolInfo",2);y([g()],m.prototype,"workingSessions",2);y([g()],m.prototype,"compactionStatus",2);y([g()],m.prototype,"chatAvatarUrl",2);y([g()],m.prototype,"chatThinkingLevel",2);y([g()],m.prototype,"chatQueue",2);y([g()],m.prototype,"chatAttachments",2);y([g()],m.prototype,"pendingRetry",2);y([g()],m.prototype,"autoRetryAfterCompact",2);y([g()],m.prototype,"sidebarOpen",2);y([g()],m.prototype,"sidebarContent",2);y([g()],m.prototype,"sidebarError",2);y([g()],m.prototype,"sidebarMimeType",2);y([g()],m.prototype,"sidebarFilePath",2);y([g()],m.prototype,"sidebarTitle",2);y([g()],m.prototype,"sidebarMode",2);y([g()],m.prototype,"sidebarProofSlug",2);y([g()],m.prototype,"sidebarProofUrl",2);y([g()],m.prototype,"sidebarProofHtml",2);y([g()],m.prototype,"splitRatio",2);y([g()],m.prototype,"lightbox",2);y([g()],m.prototype,"driveAccounts",2);y([g()],m.prototype,"showDrivePicker",2);y([g()],m.prototype,"driveUploading",2);y([g()],m.prototype,"updateStatus",2);y([g()],m.prototype,"updateLoading",2);y([g()],m.prototype,"updateError",2);y([g()],m.prototype,"updateLastChecked",2);y([g()],m.prototype,"nodesLoading",2);y([g()],m.prototype,"nodes",2);y([g()],m.prototype,"devicesLoading",2);y([g()],m.prototype,"devicesError",2);y([g()],m.prototype,"devicesList",2);y([g()],m.prototype,"execApprovalsLoading",2);y([g()],m.prototype,"execApprovalsSaving",2);y([g()],m.prototype,"execApprovalsDirty",2);y([g()],m.prototype,"execApprovalsSnapshot",2);y([g()],m.prototype,"execApprovalsForm",2);y([g()],m.prototype,"execApprovalsSelectedAgent",2);y([g()],m.prototype,"execApprovalsTarget",2);y([g()],m.prototype,"execApprovalsTargetNodeId",2);y([g()],m.prototype,"execApprovalQueue",2);y([g()],m.prototype,"execApprovalBusy",2);y([g()],m.prototype,"execApprovalError",2);y([g()],m.prototype,"pendingGatewayUrl",2);y([g()],m.prototype,"gatewayRestartPending",2);y([g()],m.prototype,"gatewayRestartBusy",2);y([g()],m.prototype,"deployPanelOpen",2);y([g()],m.prototype,"configLoading",2);y([g()],m.prototype,"configRaw",2);y([g()],m.prototype,"configRawOriginal",2);y([g()],m.prototype,"configValid",2);y([g()],m.prototype,"configIssues",2);y([g()],m.prototype,"configSaving",2);y([g()],m.prototype,"configApplying",2);y([g()],m.prototype,"updateRunning",2);y([g()],m.prototype,"applySessionKey",2);y([g()],m.prototype,"configSnapshot",2);y([g()],m.prototype,"configSchema",2);y([g()],m.prototype,"configSchemaVersion",2);y([g()],m.prototype,"configSchemaLoading",2);y([g()],m.prototype,"configUiHints",2);y([g()],m.prototype,"configForm",2);y([g()],m.prototype,"configFormOriginal",2);y([g()],m.prototype,"configFormDirty",2);y([g()],m.prototype,"configFormMode",2);y([g()],m.prototype,"configSearchQuery",2);y([g()],m.prototype,"configActiveSection",2);y([g()],m.prototype,"configActiveSubsection",2);y([g()],m.prototype,"channelsLoading",2);y([g()],m.prototype,"channelsSnapshot",2);y([g()],m.prototype,"channelsError",2);y([g()],m.prototype,"channelsLastSuccess",2);y([g()],m.prototype,"whatsappLoginMessage",2);y([g()],m.prototype,"whatsappLoginQrDataUrl",2);y([g()],m.prototype,"whatsappLoginConnected",2);y([g()],m.prototype,"whatsappBusy",2);y([g()],m.prototype,"nostrProfileFormState",2);y([g()],m.prototype,"nostrProfileAccountId",2);y([g()],m.prototype,"presenceLoading",2);y([g()],m.prototype,"presenceEntries",2);y([g()],m.prototype,"presenceError",2);y([g()],m.prototype,"presenceStatus",2);y([g()],m.prototype,"agentsLoading",2);y([g()],m.prototype,"agentsList",2);y([g()],m.prototype,"agentsError",2);y([g()],m.prototype,"sessionsLoading",2);y([g()],m.prototype,"sessionsResult",2);y([g()],m.prototype,"sessionsError",2);y([g()],m.prototype,"sessionsFilterActive",2);y([g()],m.prototype,"sessionsFilterLimit",2);y([g()],m.prototype,"sessionsIncludeGlobal",2);y([g()],m.prototype,"sessionsIncludeUnknown",2);y([g()],m.prototype,"archivedSessions",2);y([g()],m.prototype,"archivedSessionsLoading",2);y([g()],m.prototype,"archivedSessionsExpanded",2);y([g()],m.prototype,"cronLoading",2);y([g()],m.prototype,"cronJobs",2);y([g()],m.prototype,"cronStatus",2);y([g()],m.prototype,"cronError",2);y([g()],m.prototype,"cronForm",2);y([g()],m.prototype,"cronRunsJobId",2);y([g()],m.prototype,"cronRuns",2);y([g()],m.prototype,"cronBusy",2);y([g()],m.prototype,"workspaceNeedsSetup",2);y([g()],m.prototype,"onboardingPhase",2);y([g()],m.prototype,"onboardingData",2);y([g()],m.prototype,"onboardingActive",2);y([g()],m.prototype,"wizardActive",2);y([g()],m.prototype,"wizardState",2);y([g()],m.prototype,"showSetupTab",2);y([g()],m.prototype,"setupCapabilities",2);y([g()],m.prototype,"setupCapabilitiesLoading",2);y([g()],m.prototype,"setupQuickDone",2);y([g()],m.prototype,"onboardingIntegrations",2);y([g()],m.prototype,"onboardingCoreProgress",2);y([g()],m.prototype,"onboardingExpandedCard",2);y([g()],m.prototype,"onboardingLoadingGuide",2);y([g()],m.prototype,"onboardingActiveGuide",2);y([g()],m.prototype,"onboardingTestingId",2);y([g()],m.prototype,"onboardingTestResult",2);y([g()],m.prototype,"onboardingConfigValues",2);y([g()],m.prototype,"onboardingProgress",2);y([g()],m.prototype,"workspaces",2);y([g()],m.prototype,"selectedWorkspace",2);y([g()],m.prototype,"workspacesSearchQuery",2);y([g()],m.prototype,"workspaceItemSearchQuery",2);y([g()],m.prototype,"workspacesLoading",2);y([g()],m.prototype,"workspacesCreateLoading",2);y([g()],m.prototype,"workspacesError",2);y([g()],m.prototype,"workspaceExpandedFolders",2);y([g()],m.prototype,"allTasks",2);y([g()],m.prototype,"taskFilter",2);y([g()],m.prototype,"taskSort",2);y([g()],m.prototype,"taskSearch",2);y([g()],m.prototype,"showCompletedTasks",2);y([g()],m.prototype,"editingTaskId",2);y([g()],m.prototype,"workspaceBrowsePath",2);y([g()],m.prototype,"workspaceBrowseEntries",2);y([g()],m.prototype,"workspaceBreadcrumbs",2);y([g()],m.prototype,"workspaceBrowseSearchQuery",2);y([g()],m.prototype,"workspaceBrowseSearchResults",2);y([g()],m.prototype,"myDayLoading",2);y([g()],m.prototype,"myDayError",2);y([g()],m.prototype,"todaySelectedDate",2);y([g()],m.prototype,"todayViewMode",2);y([g()],m.prototype,"dailyBrief",2);y([g()],m.prototype,"dailyBriefLoading",2);y([g()],m.prototype,"dailyBriefError",2);y([g()],m.prototype,"agentLog",2);y([g()],m.prototype,"agentLogLoading",2);y([g()],m.prototype,"agentLogError",2);y([g()],m.prototype,"briefNotes",2);y([g()],m.prototype,"todayTasks",2);y([g()],m.prototype,"todayTasksLoading",2);y([g()],m.prototype,"todayEditingTaskId",2);y([g()],m.prototype,"todayShowCompleted",2);y([g()],m.prototype,"allyPanelOpen",2);y([g()],m.prototype,"allyMessages",2);y([g()],m.prototype,"allyStream",2);y([g()],m.prototype,"allyDraft",2);y([g()],m.prototype,"allyUnread",2);y([g()],m.prototype,"allySending",2);y([g()],m.prototype,"allyWorking",2);y([g()],m.prototype,"allyAttachments",2);y([g()],m.prototype,"todayQueueResults",2);y([g()],m.prototype,"inboxItems",2);y([g()],m.prototype,"inboxLoading",2);y([g()],m.prototype,"inboxCount",2);y([g()],m.prototype,"inboxScoringId",2);y([g()],m.prototype,"inboxScoringValue",2);y([g()],m.prototype,"inboxFeedbackText",2);y([g()],m.prototype,"inboxSortOrder",2);y([g()],m.prototype,"trustSummary",2);y([g()],m.prototype,"chatPrivateMode",2);y([g()],m.prototype,"privateSessions",2);y([g()],m.prototype,"dynamicSlots",2);y([g()],m.prototype,"workProjects",2);y([g()],m.prototype,"workLoading",2);y([g()],m.prototype,"workError",2);y([g()],m.prototype,"workExpandedProjects",2);y([g()],m.prototype,"workProjectFiles",2);y([g()],m.prototype,"workDetailLoading",2);y([g()],m.prototype,"workResources",2);y([g()],m.prototype,"workResourcesLoading",2);y([g()],m.prototype,"workResourceFilter",2);y([g()],m.prototype,"sessionResources",2);y([g()],m.prototype,"sessionResourcesCollapsed",2);y([g()],m.prototype,"skillsLoading",2);y([g()],m.prototype,"skillsReport",2);y([g()],m.prototype,"skillsError",2);y([g()],m.prototype,"skillsFilter",2);y([g()],m.prototype,"skillEdits",2);y([g()],m.prototype,"skillsBusyKey",2);y([g()],m.prototype,"skillMessages",2);y([g()],m.prototype,"skillsSubTab",2);y([g()],m.prototype,"godmodeSkills",2);y([g()],m.prototype,"godmodeSkillsLoading",2);y([g()],m.prototype,"expandedSkills",2);y([g()],m.prototype,"rosterData",2);y([g()],m.prototype,"rosterLoading",2);y([g()],m.prototype,"rosterError",2);y([g()],m.prototype,"rosterFilter",2);y([g()],m.prototype,"expandedAgents",2);y([g()],m.prototype,"debugLoading",2);y([g()],m.prototype,"debugStatus",2);y([g()],m.prototype,"debugHealth",2);y([g()],m.prototype,"debugModels",2);y([g()],m.prototype,"debugHeartbeat",2);y([g()],m.prototype,"debugCallMethod",2);y([g()],m.prototype,"debugCallParams",2);y([g()],m.prototype,"debugCallResult",2);y([g()],m.prototype,"debugCallError",2);y([g()],m.prototype,"logsLoading",2);y([g()],m.prototype,"logsError",2);y([g()],m.prototype,"logsFile",2);y([g()],m.prototype,"logsEntries",2);y([g()],m.prototype,"logsFilterText",2);y([g()],m.prototype,"logsLevelFilters",2);y([g()],m.prototype,"logsAutoFollow",2);y([g()],m.prototype,"logsTruncated",2);y([g()],m.prototype,"logsCursor",2);y([g()],m.prototype,"logsLastFetchAt",2);y([g()],m.prototype,"logsLimit",2);y([g()],m.prototype,"logsMaxBytes",2);y([g()],m.prototype,"logsAtBottom",2);y([g()],m.prototype,"toasts",2);y([g()],m.prototype,"chatUserNearBottom",2);y([g()],m.prototype,"chatNewMessagesBelow",2);y([g()],m.prototype,"consciousnessStatus",2);y([g()],m.prototype,"focusPulseData",2);y([g()],m.prototype,"trustTrackerData",2);y([g()],m.prototype,"trustTrackerLoading",2);y([g()],m.prototype,"guardrailsData",2);y([g()],m.prototype,"guardrailsLoading",2);y([g()],m.prototype,"guardrailsShowAddForm",2);y([g()],m.prototype,"missionControlData",2);y([g()],m.prototype,"missionControlLoading",2);y([g()],m.prototype,"missionControlError",2);y([g()],m.prototype,"missionControlFullControl",2);y([g()],m.prototype,"godmodeOptions",2);y([g()],m.prototype,"godmodeOptionsLoading",2);y([g()],m.prototype,"dashboardsList",2);y([g()],m.prototype,"dashboardsLoading",2);y([g()],m.prototype,"dashboardsError",2);y([g()],m.prototype,"activeDashboardId",2);y([g()],m.prototype,"activeDashboardHtml",2);y([g()],m.prototype,"activeDashboardManifest",2);y([g()],m.prototype,"dashboardChatOpen",2);y([g()],m.prototype,"dashboardCategoryFilter",2);y([g()],m.prototype,"secondBrainSubtab",2);y([g()],m.prototype,"secondBrainLoading",2);y([g()],m.prototype,"secondBrainError",2);y([g()],m.prototype,"secondBrainIdentity",2);y([g()],m.prototype,"secondBrainMemoryBank",2);y([g()],m.prototype,"secondBrainAiPacket",2);y([g()],m.prototype,"secondBrainSourcesData",2);y([g()],m.prototype,"secondBrainResearchData",2);y([g()],m.prototype,"secondBrainSelectedEntry",2);y([g()],m.prototype,"secondBrainSearchQuery",2);y([g()],m.prototype,"secondBrainSyncing",2);y([g()],m.prototype,"secondBrainBrowsingFolder",2);y([g()],m.prototype,"secondBrainFolderEntries",2);y([g()],m.prototype,"secondBrainFolderName",2);y([g()],m.prototype,"secondBrainVaultHealth",2);y([g()],m.prototype,"secondBrainFileTree",2);y([g()],m.prototype,"secondBrainFileTreeLoading",2);y([g()],m.prototype,"secondBrainFileSearchQuery",2);y([g()],m.prototype,"secondBrainFileSearchResults",2);m=y([_n("godmode-app")],m);
