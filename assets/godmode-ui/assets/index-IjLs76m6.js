(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const Op="modulepreload",Np=function(e,t){return new URL(e,t).href},lr={},E=function(t,n,s){let a=Promise.resolve();if(n&&n.length>0){let u=function(p){return Promise.all(p.map(f=>Promise.resolve(f).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=l?.nonce||l?.getAttribute("nonce");a=u(n.map(p=>{if(p=Np(p,s),p in lr)return;lr[p]=!0;const f=p.endsWith(".css"),v=f?'[rel="stylesheet"]':"";if(s)for(let k=o.length-1;k>=0;k--){const d=o[k];if(d.href===p&&(!f||d.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${p}"]${v}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":Op,f||(m.as="script"),m.crossOrigin="",m.href=p,c&&m.setAttribute("nonce",c),document.head.appendChild(m),f)return new Promise((k,d)=>{m.addEventListener("load",k),m.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${p}`)))})}))}function i(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return a.then(o=>{for(const l of o||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})};const xs=globalThis,Bi=xs.ShadowRoot&&(xs.ShadyCSS===void 0||xs.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ui=Symbol(),cr=new WeakMap;let Sc=class{constructor(t,n,s){if(this._$cssResult$=!0,s!==Ui)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o;const n=this.t;if(Bi&&t===void 0){const s=n!==void 0&&n.length===1;s&&(t=cr.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&cr.set(n,t))}return t}toString(){return this.cssText}};const Fp=e=>new Sc(typeof e=="string"?e:e+"",void 0,Ui),Bp=(e,...t)=>{const n=e.length===1?e[0]:t.reduce((s,a,i)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[i+1],e[0]);return new Sc(n,e,Ui)},Up=(e,t)=>{if(Bi)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of t){const s=document.createElement("style"),a=xs.litNonce;a!==void 0&&s.setAttribute("nonce",a),s.textContent=n.cssText,e.appendChild(s)}},dr=Bi?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(const s of t.cssRules)n+=s.cssText;return Fp(n)})(e):e;const{is:zp,defineProperty:Kp,getOwnPropertyDescriptor:Wp,getOwnPropertyNames:qp,getOwnPropertySymbols:jp,getPrototypeOf:Vp}=Object,Ys=globalThis,ur=Ys.trustedTypes,Hp=ur?ur.emptyScript:"",Gp=Ys.reactiveElementPolyfillSupport,Un=(e,t)=>e,Is={toAttribute(e,t){switch(t){case Boolean:e=e?Hp:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},zi=(e,t)=>!zp(e,t),pr={attribute:!0,type:String,converter:Is,reflect:!1,useDefault:!1,hasChanged:zi};Symbol.metadata??=Symbol("metadata"),Ys.litPropertyMetadata??=new WeakMap;let Jt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=pr){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){const s=Symbol(),a=this.getPropertyDescriptor(t,s,n);a!==void 0&&Kp(this.prototype,t,a)}}static getPropertyDescriptor(t,n,s){const{get:a,set:i}=Wp(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:a,set(o){const l=a?.call(this);i?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??pr}static _$Ei(){if(this.hasOwnProperty(Un("elementProperties")))return;const t=Vp(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Un("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Un("properties"))){const n=this.properties,s=[...qp(n),...jp(n)];for(const a of s)this.createProperty(a,n[a])}const t=this[Symbol.metadata];if(t!==null){const n=litPropertyMetadata.get(t);if(n!==void 0)for(const[s,a]of n)this.elementProperties.set(s,a)}this._$Eh=new Map;for(const[n,s]of this.elementProperties){const a=this._$Eu(n,s);a!==void 0&&this._$Eh.set(a,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const n=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const a of s)n.unshift(dr(a))}else t!==void 0&&n.push(dr(t));return n}static _$Eu(t,n){const s=n.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,n=this.constructor.elementProperties;for(const s of n.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Up(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,s){this._$AK(t,s)}_$ET(t,n){const s=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,s);if(a!==void 0&&s.reflect===!0){const i=(s.converter?.toAttribute!==void 0?s.converter:Is).toAttribute(n,s.type);this._$Em=t,i==null?this.removeAttribute(a):this.setAttribute(a,i),this._$Em=null}}_$AK(t,n){const s=this.constructor,a=s._$Eh.get(t);if(a!==void 0&&this._$Em!==a){const i=s.getPropertyOptions(a),o=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Is;this._$Em=a;const l=o.fromAttribute(n,i.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(t,n,s,a=!1,i){if(t!==void 0){const o=this.constructor;if(a===!1&&(i=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??zi)(i,n)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,n,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:s,reflect:a,wrapped:i},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),i!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(n=void 0),this._$AL.set(t,n)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[a,i]of this._$Ep)this[a]=i;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[a,i]of s){const{wrapped:o}=i,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,i,l)}}let t=!1;const n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(n)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};Jt.elementStyles=[],Jt.shadowRootOptions={mode:"open"},Jt[Un("elementProperties")]=new Map,Jt[Un("finalized")]=new Map,Gp?.({ReactiveElement:Jt}),(Ys.reactiveElementVersions??=[]).push("2.1.2");const Ki=globalThis,hr=e=>e,Ds=Ki.trustedTypes,fr=Ds?Ds.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ac="$lit$",rt=`lit$${Math.random().toFixed(9).slice(2)}$`,xc="?"+rt,Qp=`<${xc}>`,Ct=document,Vn=()=>Ct.createComment(""),Hn=e=>e===null||typeof e!="object"&&typeof e!="function",Wi=Array.isArray,Yp=e=>Wi(e)||typeof e?.[Symbol.iterator]=="function",_a=`[ 	
\f\r]`,$n=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,gr=/-->/g,mr=/>/g,vt=RegExp(`>|${_a}(?:([^\\s"'>=/]+)(${_a}*=${_a}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vr=/'/g,yr=/"/g,Tc=/^(?:script|style|textarea|title)$/i,Jp=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),r=Jp(1),ut=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),br=new WeakMap,Tt=Ct.createTreeWalker(Ct,129);function _c(e,t){if(!Wi(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return fr!==void 0?fr.createHTML(t):t}const Xp=(e,t)=>{const n=e.length-1,s=[];let a,i=t===2?"<svg>":t===3?"<math>":"",o=$n;for(let l=0;l<n;l++){const c=e[l];let u,p,f=-1,v=0;for(;v<c.length&&(o.lastIndex=v,p=o.exec(c),p!==null);)v=o.lastIndex,o===$n?p[1]==="!--"?o=gr:p[1]!==void 0?o=mr:p[2]!==void 0?(Tc.test(p[2])&&(a=RegExp("</"+p[2],"g")),o=vt):p[3]!==void 0&&(o=vt):o===vt?p[0]===">"?(o=a??$n,f=-1):p[1]===void 0?f=-2:(f=o.lastIndex-p[2].length,u=p[1],o=p[3]===void 0?vt:p[3]==='"'?yr:vr):o===yr||o===vr?o=vt:o===gr||o===mr?o=$n:(o=vt,a=void 0);const m=o===vt&&e[l+1].startsWith("/>")?" ":"";i+=o===$n?c+Qp:f>=0?(s.push(u),c.slice(0,f)+Ac+c.slice(f)+rt+m):c+rt+(f===-2?l:m)}return[_c(e,i+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class Gn{constructor({strings:t,_$litType$:n},s){let a;this.parts=[];let i=0,o=0;const l=t.length-1,c=this.parts,[u,p]=Xp(t,n);if(this.el=Gn.createElement(u,s),Tt.currentNode=this.el.content,n===2||n===3){const f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(a=Tt.nextNode())!==null&&c.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(const f of a.getAttributeNames())if(f.endsWith(Ac)){const v=p[o++],m=a.getAttribute(f).split(rt),k=/([.?@])?(.*)/.exec(v);c.push({type:1,index:i,name:k[2],strings:m,ctor:k[1]==="."?eh:k[1]==="?"?th:k[1]==="@"?nh:Xs}),a.removeAttribute(f)}else f.startsWith(rt)&&(c.push({type:6,index:i}),a.removeAttribute(f));if(Tc.test(a.tagName)){const f=a.textContent.split(rt),v=f.length-1;if(v>0){a.textContent=Ds?Ds.emptyScript:"";for(let m=0;m<v;m++)a.append(f[m],Vn()),Tt.nextNode(),c.push({type:2,index:++i});a.append(f[v],Vn())}}}else if(a.nodeType===8)if(a.data===xc)c.push({type:2,index:i});else{let f=-1;for(;(f=a.data.indexOf(rt,f+1))!==-1;)c.push({type:7,index:i}),f+=rt.length-1}i++}}static createElement(t,n){const s=Ct.createElement("template");return s.innerHTML=t,s}}function an(e,t,n=e,s){if(t===ut)return t;let a=s!==void 0?n._$Co?.[s]:n._$Cl;const i=Hn(t)?void 0:t._$litDirective$;return a?.constructor!==i&&(a?._$AO?.(!1),i===void 0?a=void 0:(a=new i(e),a._$AT(e,n,s)),s!==void 0?(n._$Co??=[])[s]=a:n._$Cl=a),a!==void 0&&(t=an(e,a._$AS(e,t.values),a,s)),t}class Zp{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:n},parts:s}=this._$AD,a=(t?.creationScope??Ct).importNode(n,!0);Tt.currentNode=a;let i=Tt.nextNode(),o=0,l=0,c=s[0];for(;c!==void 0;){if(o===c.index){let u;c.type===2?u=new Js(i,i.nextSibling,this,t):c.type===1?u=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(u=new sh(i,this,t)),this._$AV.push(u),c=s[++l]}o!==c?.index&&(i=Tt.nextNode(),o++)}return Tt.currentNode=Ct,a}p(t){let n=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,n),n+=s.strings.length-2):s._$AI(t[n])),n++}}let Js=class Cc{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,s,a){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=s,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=an(this,t,n),Hn(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==ut&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Yp(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&Hn(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ct.createTextNode(t)),this._$AH=t}$(t){const{values:n,_$litType$:s}=t,a=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Gn.createElement(_c(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===a)this._$AH.p(n);else{const i=new Zp(a,this),o=i.u(this.options);i.p(n),this.T(o),this._$AH=i}}_$AC(t){let n=br.get(t.strings);return n===void 0&&br.set(t.strings,n=new Gn(t)),n}k(t){Wi(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let s,a=0;for(const i of t)a===n.length?n.push(s=new Cc(this.O(Vn()),this.O(Vn()),this,this.options)):s=n[a],s._$AI(i),a++;a<n.length&&(this._$AR(s&&s._$AB.nextSibling,a),n.length=a)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){const s=hr(t).nextSibling;hr(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Xs=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,s,a,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=n,this._$AM=a,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(t,n=this,s,a){const i=this.strings;let o=!1;if(i===void 0)t=an(this,t,n,0),o=!Hn(t)||t!==this._$AH&&t!==ut,o&&(this._$AH=t);else{const l=t;let c,u;for(t=i[0],c=0;c<i.length-1;c++)u=an(this,l[s+c],n,c),u===ut&&(u=this._$AH[c]),o||=!Hn(u)||u!==this._$AH[c],u===h?t=h:t!==h&&(t+=(u??"")+i[c+1]),this._$AH[c]=u}o&&!a&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},eh=class extends Xs{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},th=class extends Xs{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},nh=class extends Xs{constructor(t,n,s,a,i){super(t,n,s,a,i),this.type=5}_$AI(t,n=this){if((t=an(this,t,n,0)??h)===ut)return;const s=this._$AH,a=t===h&&s!==h||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==h&&(s===h||a);a&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},sh=class{constructor(t,n,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){an(this,t)}};const ah={I:Js},ih=Ki.litHtmlPolyfillSupport;ih?.(Gn,Js),(Ki.litHtmlVersions??=[]).push("3.3.2");const oh=(e,t,n)=>{const s=n?.renderBefore??t;let a=s._$litPart$;if(a===void 0){const i=n?.renderBefore??null;s._$litPart$=a=new Js(t.insertBefore(Vn(),i),i,void 0,n??{})}return a._$AI(e),a};const qi=globalThis;let nn=class extends Jt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=oh(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ut}};nn._$litElement$=!0,nn.finalized=!0,qi.litElementHydrateSupport?.({LitElement:nn});const rh=qi.litElementPolyfillSupport;rh?.({LitElement:nn});(qi.litElementVersions??=[]).push("4.2.2");const Ec=e=>(t,n)=>{n!==void 0?n.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};const lh={attribute:!0,type:String,converter:Is,reflect:!1,hasChanged:zi},ch=(e=lh,t,n)=>{const{kind:s,metadata:a}=n;let i=globalThis.litPropertyMetadata.get(a);if(i===void 0&&globalThis.litPropertyMetadata.set(a,i=new Map),s==="setter"&&((e=Object.create(e)).wrapped=!0),i.set(n.name,e),s==="accessor"){const{name:o}=n;return{set(l){const c=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,c,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(s==="setter"){const{name:o}=n;return function(l){const c=this[o];t.call(this,l),this.requestUpdate(o,c,e,!0,l)}}throw Error("Unsupported decorator location: "+s)};function ss(e){return(t,n)=>typeof n=="object"?ch(e,t,n):((s,a,i)=>{const o=a.hasOwnProperty(i);return a.constructor.createProperty(i,s),o?Object.getOwnPropertyDescriptor(a,i):void 0})(e,t,n)}function w(e){return ss({...e,state:!0,attribute:!1})}async function Me(e,t){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const n=await e.client.request("channels.status",{probe:t,timeoutMs:8e3});e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(n){e.channelsError=String(n)}finally{e.channelsLoading=!1}}}async function dh(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.start",{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function uh(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function ph(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function Et(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function on(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function Rc(e,t,n){if(t.length===0)return;let s=e;for(let i=0;i<t.length-1;i+=1){const o=t[i],l=t[i+1];if(typeof o=="number"){if(!Array.isArray(s))return;s[o]==null&&(s[o]=typeof l=="number"?[]:{}),s=s[o]}else{if(typeof s!="object"||s==null)return;const c=s;c[o]==null&&(c[o]=typeof l=="number"?[]:{}),s=c[o]}}const a=t[t.length-1];if(typeof a=="number"){Array.isArray(s)&&(s[a]=n);return}typeof s=="object"&&s!=null&&(s[a]=n)}function Lc(e,t){if(t.length===0)return;let n=e;for(let a=0;a<t.length-1;a+=1){const i=t[a];if(typeof i=="number"){if(!Array.isArray(n))return;n=n[i]}else{if(typeof n!="object"||n==null)return;n=n[i]}if(n==null)return}const s=t[t.length-1];if(typeof s=="number"){Array.isArray(n)&&n.splice(s,1);return}typeof n=="object"&&n!=null&&delete n[s]}async function Xe(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const t=await e.client.request("config.get",{});fh(e,t)}catch(t){e.lastError=String(t)}finally{e.configLoading=!1}}}async function Pc(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const t=await e.client.request("config.schema",{});hh(e,t)}catch(t){e.lastError=String(t)}finally{e.configSchemaLoading=!1}}}function hh(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function fh(e,t){e.configSnapshot=t;const n=typeof t.raw=="string"?t.raw:t.config&&typeof t.config=="object"?on(t.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=n:e.configForm?e.configRaw=on(e.configForm):e.configRaw=n,e.configValid=typeof t.valid=="boolean"?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],e.configFormDirty||(e.configForm=Et(t.config??{}),e.configFormOriginal=Et(t.config??{}),e.configRawOriginal=n)}async function Ms(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?on(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:t,baseHash:n}),e.configFormDirty=!1,await Xe(e)}catch(t){e.lastError=String(t)}finally{e.configSaving=!1}}}async function gh(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?on(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:t,baseHash:n,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await Xe(e)}catch(t){e.lastError=String(t)}finally{e.configApplying=!1}}}async function wr(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("godmode.update.run",{})}catch(t){e.lastError=String(t)}finally{e.updateRunning=!1}}}async function mh(e){if(!(!e.client||!e.connected)){e.pluginUpdateRunning=!0,e.lastError=null;try{await e.client.request("godmode.update.pluginRun",{})}catch(t){e.lastError=String(t)}finally{e.pluginUpdateRunning=!1}}}function Zt(e,t,n){const s=Et(e.configForm??e.configSnapshot?.config??{});Rc(s,t,n),e.configForm=s,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=on(s))}function kr(e,t){const n=Et(e.configForm??e.configSnapshot?.config??{});Lc(n,t),e.configForm=n,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=on(n))}async function vh(e,t,n){Zt(e,["agents","defaults","model","primary"],t),Zt(e,["agents","defaults","model","fallbacks"],n),await Ms(e)}function yh(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function bh(e){const{state:t,callbacks:n,accountId:s}=e,a=yh(t),i=(l,c,u={})=>{const{type:p="text",placeholder:f,maxLength:v,help:m}=u,k=t.values[l]??"",d=t.fieldErrors[l],g=`nostr-profile-${l}`;return p==="textarea"?r`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${g}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${c}
          </label>
          <textarea
            id="${g}"
            .value=${k}
            placeholder=${f??""}
            maxlength=${v??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${S=>{const A=S.target;n.onFieldChange(l,A.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${m?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${m}</div>`:h}
          ${d?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${d}</div>`:h}
        </div>
      `:r`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${g}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${c}
        </label>
        <input
          id="${g}"
          type=${p}
          .value=${k}
          placeholder=${f??""}
          maxlength=${v??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${S=>{const A=S.target;n.onFieldChange(l,A.value)}}
          ?disabled=${t.saving}
        />
        ${m?r`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${m}</div>`:h}
        ${d?r`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${d}</div>`:h}
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
    `:h};return r`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${s}</div>
      </div>

      ${t.error?r`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:h}

      ${t.success?r`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:h}

      ${o()}

      ${i("name","Username",{placeholder:"satoshi",maxLength:256,help:"Short username (e.g., satoshi)"})}

      ${i("displayName","Display Name",{placeholder:"Satoshi Nakamoto",maxLength:256,help:"Your full display name"})}

      ${i("about","Bio",{type:"textarea",placeholder:"Tell people about yourself...",maxLength:2e3,help:"A brief bio or description"})}

      ${i("picture","Avatar URL",{type:"url",placeholder:"https://example.com/avatar.jpg",help:"HTTPS URL to your profile picture"})}

      ${t.showAdvanced?r`
            <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
              <div style="font-weight: 500; margin-bottom: 12px; color: var(--text-muted);">Advanced</div>

              ${i("banner","Banner URL",{type:"url",placeholder:"https://example.com/banner.jpg",help:"HTTPS URL to a banner image"})}

              ${i("website","Website",{type:"url",placeholder:"https://example.com",help:"Your personal website"})}

              ${i("nip05","NIP-05 Identifier",{placeholder:"you@example.com",help:"Verifiable identifier (e.g., you@domain.com)"})}

              ${i("lud16","Lightning Address",{placeholder:"you@getalby.com",help:"Lightning address for tips (LUD-16)"})}
            </div>
          `:h}

      <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
        <button
          class="btn primary"
          @click=${n.onSave}
          ?disabled=${t.saving||!a}
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

      ${a?r`
              <div style="font-size: 12px; color: var(--warning-color); margin-top: 8px">
                You have unsaved changes
              </div>
            `:h}
    </div>
  `}function wh(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}async function kh(e,t){await dh(e,t),await Me(e,!0)}async function $h(e){await uh(e),await Me(e,!0)}async function Sh(e){await ph(e),await Me(e,!0)}async function Ah(e){await Ms(e),await Xe(e),await Me(e,!0)}async function xh(e){await Xe(e),await Me(e,!0)}function Th(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...a]=n.split(":");if(!s||a.length===0)continue;const i=s.trim(),o=a.join(":").trim();i&&o&&(t[i]=o)}return t}function Ic(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function Dc(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function _h(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=wh(n??void 0)}function Ch(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function Eh(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function Rh(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function Lh(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=Ic(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(Dc(n),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),a=await s.json().catch(()=>null);if(!s.ok||a?.ok===!1||!a){const i=a?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:i,success:null,fieldErrors:Th(a?.details)};return}if(!a.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await Me(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function Ph(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=Ic(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(Dc(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),a=await s.json().catch(()=>null);if(!s.ok||a?.ok===!1||!a){const c=a?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:c,success:null};return}const i=a.merged??a.imported??null,o=i?{...t.values,...i}:t.values,l=!!(o.banner||o.website||o.nip05||o.lud16);e.nostrProfileFormState={...t,importing:!1,values:o,error:null,success:a.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:l},a.saved&&await Me(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}function Mc(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),a=n.slice(2).join(":");return!s||!a?null:{agentId:s,rest:a}}const Ih=80;function rn(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const n=()=>{const s=e.querySelector(".chat-thread");if(s){const a=getComputedStyle(s).overflowY;if(a==="auto"||a==="scroll"||s.scrollHeight-s.clientHeight>1)return s}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const s=n();if(!s)return;if(!(t||e.chatUserNearBottom)){e.chatNewMessagesBelow=!0;return}t&&(e.chatHasAutoScrolled=!0),e.chatIsAutoScrolling=!0,s.scrollTop=s.scrollHeight,e.chatNewMessagesBelow=!1,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1});const i=t?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const o=n();!o||!(t||e.chatUserNearBottom)||(e.chatIsAutoScrolling=!0,o.scrollTop=o.scrollHeight,requestAnimationFrame(()=>{e.chatIsAutoScrolling=!1}))},i)})})}function Oc(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function Dh(e,t){const n=t.currentTarget;if(!n||e.chatIsAutoScrolling)return;n.scrollHeight-n.scrollTop-n.clientHeight<Ih?(e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1):e.chatUserNearBottom=!1}function Mh(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function Nc(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function Oh(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),a=document.createElement("a"),i=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");a.href=s,a.download=`godmode-logs-${t}-${i}.log`,a.click(),URL.revokeObjectURL(s)}function Nh(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}const Fh=[{label:"",tabs:["chat","today","workspaces","second-brain","dashboards"]},{label:"Settings",tabs:["config","skills","agents","trust","guardrails","options"]}],Bh=[{label:"System",tabs:["mission-control","overview","channels","instances","sessions","cron","nodes","debug","logs"]}],Fc={setup:"/setup",onboarding:"/onboarding",options:"/options",overview:"/overview",workspaces:"/workspaces",today:"/today",work:"/work","my-day":"/today",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",agents:"/agents",nodes:"/nodes",chat:"/chat",trust:"/trust",guardrails:"/guardrails",config:"/config",debug:"/debug",logs:"/logs","second-brain":"/second-brain","mission-control":"/mission-control",dashboards:"/dashboards"},ln=new Map(Object.entries(Fc).map(([e,t])=>[t,e]));ln.set("/today","today");ln.set("/my-day","today");ln.set("/work","workspaces");function Zs(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function Qn(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function ji(e,t=""){const n=Zs(t),s=Fc[e];return n?`${n}${s}`:s}function Bc(e,t=""){const n=Zs(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let a=Qn(s).toLowerCase();return a.endsWith("/index.html")&&(a="/"),a==="/"?"chat":ln.get(a)??null}function Uh(e){let t=Qn(e);if(t.endsWith("/index.html")&&(t=Qn(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const a=`/${n.slice(s).join("/")}`.toLowerCase();if(ln.has(a)){const i=n.slice(0,s);return!i.length||i.some(l=>ln.has(`/${l.toLowerCase()}`))?"":`/${i.join("/")}`}}return`/${n.join("/")}`}function Yn(e){switch(e){case"setup":return"Setup";case"onboarding":return"Connect Your World";case"chat":return"Chat";case"today":case"my-day":return"Today";case"work":return"Work";case"overview":return"Overview";case"workspaces":return"Work";case"channels":return"Channels";case"instances":return"Instances";case"sessions":return"Sessions";case"cron":return"Cron Jobs";case"skills":return"Skills";case"agents":return"Agents";case"nodes":return"Nodes";case"options":return"Lab";case"trust":return"Trust";case"guardrails":return"Guardrails";case"second-brain":return"Second Brain";case"mission-control":return"Mission Control";case"dashboards":return"Dashboards";case"config":return"Config";case"debug":return"Debug";case"logs":return"Logs";default:return"Control"}}function zh(e){switch(e){case"setup":return"🧭";case"onboarding":return"🧭";case"chat":return"💬";case"today":case"my-day":return"☀️";case"work":return"💼";case"overview":return"🎯";case"workspaces":return"📂";case"channels":return"🔗";case"instances":return"📡";case"sessions":return"📄";case"cron":return"⏰";case"skills":return"🧩";case"agents":return"🤖";case"nodes":return"🖥️";case"options":return"🧪";case"trust":return"🛡️";case"guardrails":return"🚧";case"second-brain":return"🧠";case"mission-control":return"🛰️";case"dashboards":return"📊";case"config":return"⚙️";case"debug":return"🐛";case"logs":return"📜";default:return"📁"}}function Kh(e){switch(e){case"setup":return"Get GodMode configured and running.";case"onboarding":return"Set up the integrations that power your daily brief and agent features. Everything is optional.";case"chat":return"Your command center. Ask anything, customize any view.";case"today":case"my-day":return"Calendar, brief, tasks, and schedule for the day.";case"work":return"Your projects, files, tasks, and team — organized by workspace.";case"overview":return"Gateway status, entry points, and a fast health read.";case"workspaces":return"Projects, clients, and personal operating context.";case"channels":return"Manage channels and settings.";case"instances":return"Presence beacons from connected clients and nodes.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Schedule wakeups and recurring agent runs.";case"skills":return"Manage your skills, discover new ones from ClawHub, and personalize them for your workflow.";case"agents":return"Your agent roster — sub-agents that handle queue tasks, grouped by category.";case"nodes":return"Paired devices, capabilities, and command exposure.";case"options":return"Toggle experimental features and modules on and off.";case"trust":return"Scores build automatically as you use and rate skills.";case"guardrails":return"Safety gates that prevent runaway loops, bad searches, and lazy responses.";case"second-brain":return"Your Obsidian-powered second brain — identity, knowledge, and live AI context.";case"mission-control":return"Live command center — active agents, pipelines, and activity feed.";case"dashboards":return"Custom data views built by your AI ally — remix anything.";case"config":return"Edit ~/.openclaw/config.json safely.";case"debug":return"Gateway snapshots, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}const Q="main";function Wh(e){const t=[`viewing ${Yn(e.tab)} tab`];return e.tab==="dashboards"&&e.activeDashboard&&t.push(`dashboard: ${e.activeDashboard.title}`),e.tab==="workspaces"&&e.selectedWorkspace&&t.push(`workspace: ${e.selectedWorkspace.name}`),e.sidebarOpen&&e.sidebarFilePath&&t.push(`viewing file: ${e.sidebarFilePath}`),`[GodMode Context: ${t.join(", ")}]`}const qh=/<\s*\/?\s*(?:think(?:ing)?|thought|antthinking|final)\b/i,ys=/<\s*\/?\s*final\b[^>]*>/gi,$r=/<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\b[^>]*>/gi;function jh(e,t){return e.trimStart()}function Vh(e,t){if(!e||!qh.test(e))return e;let n=e;ys.test(n)?(ys.lastIndex=0,n=n.replace(ys,"")):ys.lastIndex=0,$r.lastIndex=0;let s="",a=0,i=!1;for(const o of n.matchAll($r)){const l=o.index??0,c=o[1]==="/";i?c&&(i=!1):(s+=n.slice(a,l),c||(i=!0)),a=l+o[0].length}return s+=n.slice(a),jh(s)}function Jn(e){return!e&&e!==0?"n/a":new Date(e).toLocaleString()}function K(e){if(!e&&e!==0)return"n/a";const t=Date.now()-e;if(t<0)return"just now";const n=Math.round(t/1e3);if(n<60)return`${n}s ago`;const s=Math.round(n/60);if(s<60)return`${s}m ago`;const a=Math.round(s/60);return a<48?`${a}h ago`:`${Math.round(a/24)}d ago`}function Hh(e){if(!e&&e!==0)return"";const t=Date.now()-e;if(t<0)return"now";const n=Math.round(t/1e3);if(n<60)return"now";const s=Math.round(n/60);if(s<60)return`${s}m`;const a=Math.round(s/60);return a<24?`${a}h`:`${Math.round(a/24)}d`}function Vi(e){if(!e&&e!==0)return"n/a";if(e<1e3)return`${e}ms`;const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);if(n<60)return`${n}m`;const s=Math.round(n/60);return s<48?`${s}h`:`${Math.round(s/24)}d`}function li(e){return!e||e.length===0?"none":e.filter(t=>!!(t&&t.trim())).join(", ")}function Xn(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function Uc(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function Os(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function ce(e){const t=e??new Date,n=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${n}-${s}-${a}`}function Ca(e){return Vh(e)}const Sr=50,Gh=80,Qh=12e4;function le(e,t){if(!e)return"";const n=e.trim().replace(/\n/g," ");return n.length<=t?n:n.slice(0,t-1)+"…"}function re(e){return typeof e=="string"?e:e==null?"":JSON.stringify(e)}function Ar(e,t){if(!t||typeof t!="object")return"";const n=t;switch(e.toLowerCase()){case"exec":return n.command?`\`${le(re(n.command),60)}\``:"";case"read":return n.path||n.file_path?`\`${le(re(n.path||n.file_path),50)}\``:"";case"write":return n.path||n.file_path?`→ \`${le(re(n.path||n.file_path),50)}\``:"";case"edit":return n.path||n.file_path?`\`${le(re(n.path||n.file_path),50)}\``:"";case"web_search":return n.query?`"${le(re(n.query),45)}"`:"";case"web_fetch":try{const u=new URL(re(n.url));return u.hostname+(u.pathname!=="/"?u.pathname.slice(0,30):"")}catch{return le(re(n.url||""),50)}case"memory_search":return n.query?`"${le(re(n.query),45)}"`:"";case"browser":const s=re(n.action),a=n.ref?` #${re(n.ref)}`:"",i=n.targetUrl?` ${le(re(n.targetUrl),30)}`:"";return`${s}${a}${i}`;case"message":return n.action?`${re(n.action)}${n.target?` → ${le(re(n.target),25)}`:""}`:"";case"sessions_spawn":return n.task?`"${le(re(n.task),40)}"`:"";case"cron":return n.action?re(n.action):"";case"files_read":return n.fileId?`file:${le(re(n.fileId),20)}`:"";case"image":return n.image?le(re(n.image),40):"";default:const o=Object.keys(n).filter(u=>!["timeout","timeoutMs"].includes(u));if(o.length===0)return"";const l=o[0],c=n[l];return typeof c=="string"?`${l}: ${le(c,35)}`:""}}function xr(e,t){if(!t)return"";const n=e.toLowerCase(),s=t.split(`
`),a=s.length,i=t.length;if(["read","files_read"].includes(n))return`${i.toLocaleString()} chars${a>1?`, ${a} lines`:""}`;if(n==="exec")return a>1?`${a} lines`:le(s[0],50);if(["web_search","memory_search"].includes(n))try{const o=JSON.parse(t),l=o.results?.length??o.count??0;return`${l} result${l!==1?"s":""}`}catch{return le(t,40)}return n==="browser"?t.includes("snapshot")?"snapshot captured":t.includes("success")?"success":le(t,40):i>100?`${i.toLocaleString()} chars`:le(t,50)}function Tr(e){if(!e)return!0;const t=e.toLowerCase();return!(t.includes("error:")||t.includes("failed")||t.includes("exception")||t.includes("not found"))}function Yh(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(a=>{if(!a||typeof a!="object")return null;const i=a;return i.type==="text"&&typeof i.text=="string"?i.text:null}).filter(a=>!!a);return s.length===0?null:s.join(`
`)}function _r(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=Yh(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=typeof e=="object"?"[object]":String(e)}const s=Uc(n,Qh);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function Jh(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function Xh(e){if(e.toolStreamOrder.length<=Sr)return;const t=e.toolStreamOrder.length-Sr,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function Zh(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function ci(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),Zh(e)}function ef(e,t=!1){if(t){ci(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>ci(e),Gh))}function Hi(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],e.currentToolName=null,e.currentToolInfo=null;const t=e;t.compactionStatus&&(t.compactionStatus=null),t.compactionClearTimer!=null&&(window.clearTimeout(t.compactionClearTimer),t.compactionClearTimer=null),ci(e)}const tf=5e3;function nf(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},tf))}function sf(e,t){if(!t)return;if(t.stream==="compaction"){nf(e,t);return}if(t.stream!=="tool")return;const n=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(n&&n!==e.sessionKey||!n&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const s=t.data??{},a=typeof s.toolCallId=="string"?s.toolCallId:"";if(!a)return;const i=typeof s.name=="string"?s.name:"tool",o=typeof s.phase=="string"?s.phase:"",l=o==="start"?s.args:void 0,c=o==="update"?_r(s.partialResult):o==="result"?_r(s.result):void 0,u=Date.now();let p=e.toolStreamById.get(a);p?(p.name=i,l!==void 0&&(p.args=l,p.displayArgs=Ar(i,l)),c!==void 0&&(p.output=c,p.resultSummary=xr(i,c),p.success=Tr(c)),p.updatedAt=u):(p={toolCallId:a,runId:t.runId,sessionKey:n,name:i,args:l,output:c,startedAt:typeof t.ts=="number"?t.ts:u,updatedAt:u,message:{},displayArgs:l?Ar(i,l):void 0},e.toolStreamById.set(a,p),e.toolStreamOrder.push(a)),o==="start"?(e.currentToolName=i,e.currentToolInfo={name:i,details:p.displayArgs||void 0,startedAt:p.startedAt}):o==="result"&&(e.currentToolName=null,e.currentToolInfo=null,p.completedAt=u,p.resultSummary=xr(i,p.output),p.success=Tr(p.output)),p.message=Jh(p),Xh(e),ef(e,o==="result")}const Gi={CHILD:2},Qi=e=>(...t)=>({_$litDirective$:e,values:t});let Yi=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,s){this._$Ct=t,this._$AM=n,this._$Ci=s}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};class di extends Yi{constructor(t){if(super(t),this.it=h,t.type!==Gi.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===h||t==null)return this._t=void 0,this.it=t;if(t===ut)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const n=[t];return n.raw=n,this._t={_$litType$:this.constructor.resultType,strings:n,values:[]}}}di.directiveName="unsafeHTML",di.resultType=1;const Ce=Qi(di);const{entries:zc,setPrototypeOf:Cr,isFrozen:af,getPrototypeOf:of,getOwnPropertyDescriptor:rf}=Object;let{freeze:ge,seal:Ee,create:ui}=Object,{apply:pi,construct:hi}=typeof Reflect<"u"&&Reflect;ge||(ge=function(t){return t});Ee||(Ee=function(t){return t});pi||(pi=function(t,n){for(var s=arguments.length,a=new Array(s>2?s-2:0),i=2;i<s;i++)a[i-2]=arguments[i];return t.apply(n,a)});hi||(hi=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),a=1;a<n;a++)s[a-1]=arguments[a];return new t(...s)});const bs=me(Array.prototype.forEach),lf=me(Array.prototype.lastIndexOf),Er=me(Array.prototype.pop),Sn=me(Array.prototype.push),cf=me(Array.prototype.splice),Ts=me(String.prototype.toLowerCase),Ea=me(String.prototype.toString),Ra=me(String.prototype.match),An=me(String.prototype.replace),df=me(String.prototype.indexOf),uf=me(String.prototype.trim),Re=me(Object.prototype.hasOwnProperty),pe=me(RegExp.prototype.test),xn=pf(TypeError);function me(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),a=1;a<n;a++)s[a-1]=arguments[a];return pi(e,t,s)}}function pf(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return hi(e,n)}}function z(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ts;Cr&&Cr(e,null);let s=t.length;for(;s--;){let a=t[s];if(typeof a=="string"){const i=n(a);i!==a&&(af(t)||(t[s]=i),a=i)}e[a]=!0}return e}function hf(e){for(let t=0;t<e.length;t++)Re(e,t)||(e[t]=null);return e}function Ue(e){const t=ui(null);for(const[n,s]of zc(e))Re(e,n)&&(Array.isArray(s)?t[n]=hf(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=Ue(s):t[n]=s);return t}function Tn(e,t){for(;e!==null;){const s=rf(e,t);if(s){if(s.get)return me(s.get);if(typeof s.value=="function")return me(s.value)}e=of(e)}function n(){return null}return n}const Rr=ge(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),La=ge(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Pa=ge(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),ff=ge(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Ia=ge(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),gf=ge(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Lr=ge(["#text"]),Pr=ge(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Da=ge(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Ir=ge(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),ws=ge(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),mf=Ee(/\{\{[\w\W]*|[\w\W]*\}\}/gm),vf=Ee(/<%[\w\W]*|[\w\W]*%>/gm),yf=Ee(/\$\{[\w\W]*/gm),bf=Ee(/^data-[\-\w.\u00B7-\uFFFF]+$/),wf=Ee(/^aria-[\-\w]+$/),Kc=Ee(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),kf=Ee(/^(?:\w+script|data):/i),$f=Ee(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Wc=Ee(/^html$/i),Sf=Ee(/^[a-z][.\w]*(-[.\w]+)+$/i);var Dr=Object.freeze({__proto__:null,ARIA_ATTR:wf,ATTR_WHITESPACE:$f,CUSTOM_ELEMENT:Sf,DATA_ATTR:bf,DOCTYPE_NAME:Wc,ERB_EXPR:vf,IS_ALLOWED_URI:Kc,IS_SCRIPT_OR_DATA:kf,MUSTACHE_EXPR:mf,TMPLIT_EXPR:yf});const _n={element:1,text:3,progressingInstruction:7,comment:8,document:9},Af=function(){return typeof window>"u"?null:window},xf=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const a="data-tt-policy-suffix";n&&n.hasAttribute(a)&&(s=n.getAttribute(a));const i="dompurify"+(s?"#"+s:"");try{return t.createPolicy(i,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},Mr=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function qc(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Af();const t=N=>qc(N);if(t.version="3.3.1",t.removed=[],!e||!e.document||e.document.nodeType!==_n.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,a=s.currentScript,{DocumentFragment:i,HTMLTemplateElement:o,Node:l,Element:c,NodeFilter:u,NamedNodeMap:p=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:f,DOMParser:v,trustedTypes:m}=e,k=c.prototype,d=Tn(k,"cloneNode"),g=Tn(k,"remove"),S=Tn(k,"nextSibling"),A=Tn(k,"childNodes"),T=Tn(k,"parentNode");if(typeof o=="function"){const N=n.createElement("template");N.content&&N.content.ownerDocument&&(n=N.content.ownerDocument)}let x,_="";const{implementation:L,createNodeIterator:R,createDocumentFragment:Z,getElementsByTagName:Y}=n,{importNode:I}=s;let M=Mr();t.isSupported=typeof zc=="function"&&typeof T=="function"&&L&&L.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:F,ERB_EXPR:U,TMPLIT_EXPR:O,DATA_ATTR:ie,ARIA_ATTR:ke,IS_SCRIPT_OR_DATA:J,ATTR_WHITESPACE:B,CUSTOM_ELEMENT:Oe}=Dr;let{IS_ALLOWED_URI:gn}=Dr,X=null;const Ut=z({},[...Rr,...La,...Pa,...Ia,...Lr]);let V=null;const mn=z({},[...Pr,...Da,...Ir,...ws]);let H=Object.seal(ui(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),at=null,zt=null;const je=Object.seal(ui(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Kt=!0,vn=!0,yn=!1,bn=!0,ft=!1,us=!0,gt=!1,va=!1,ya=!1,Wt=!1,ps=!1,hs=!1,jo=!0,Vo=!1;const Cp="user-content-";let ba=!0,wn=!1,qt={},Ne=null;const wa=z({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Ho=null;const Go=z({},["audio","video","img","source","image","track"]);let ka=null;const Qo=z({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),fs="http://www.w3.org/1998/Math/MathML",gs="http://www.w3.org/2000/svg",Ve="http://www.w3.org/1999/xhtml";let jt=Ve,$a=!1,Sa=null;const Ep=z({},[fs,gs,Ve],Ea);let ms=z({},["mi","mo","mn","ms","mtext"]),vs=z({},["annotation-xml"]);const Rp=z({},["title","style","font","a","script"]);let kn=null;const Lp=["application/xhtml+xml","text/html"],Pp="text/html";let ne=null,Vt=null;const Ip=n.createElement("form"),Yo=function($){return $ instanceof RegExp||$ instanceof Function},Aa=function(){let $=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Vt&&Vt===$)){if((!$||typeof $!="object")&&($={}),$=Ue($),kn=Lp.indexOf($.PARSER_MEDIA_TYPE)===-1?Pp:$.PARSER_MEDIA_TYPE,ne=kn==="application/xhtml+xml"?Ea:Ts,X=Re($,"ALLOWED_TAGS")?z({},$.ALLOWED_TAGS,ne):Ut,V=Re($,"ALLOWED_ATTR")?z({},$.ALLOWED_ATTR,ne):mn,Sa=Re($,"ALLOWED_NAMESPACES")?z({},$.ALLOWED_NAMESPACES,Ea):Ep,ka=Re($,"ADD_URI_SAFE_ATTR")?z(Ue(Qo),$.ADD_URI_SAFE_ATTR,ne):Qo,Ho=Re($,"ADD_DATA_URI_TAGS")?z(Ue(Go),$.ADD_DATA_URI_TAGS,ne):Go,Ne=Re($,"FORBID_CONTENTS")?z({},$.FORBID_CONTENTS,ne):wa,at=Re($,"FORBID_TAGS")?z({},$.FORBID_TAGS,ne):Ue({}),zt=Re($,"FORBID_ATTR")?z({},$.FORBID_ATTR,ne):Ue({}),qt=Re($,"USE_PROFILES")?$.USE_PROFILES:!1,Kt=$.ALLOW_ARIA_ATTR!==!1,vn=$.ALLOW_DATA_ATTR!==!1,yn=$.ALLOW_UNKNOWN_PROTOCOLS||!1,bn=$.ALLOW_SELF_CLOSE_IN_ATTR!==!1,ft=$.SAFE_FOR_TEMPLATES||!1,us=$.SAFE_FOR_XML!==!1,gt=$.WHOLE_DOCUMENT||!1,Wt=$.RETURN_DOM||!1,ps=$.RETURN_DOM_FRAGMENT||!1,hs=$.RETURN_TRUSTED_TYPE||!1,ya=$.FORCE_BODY||!1,jo=$.SANITIZE_DOM!==!1,Vo=$.SANITIZE_NAMED_PROPS||!1,ba=$.KEEP_CONTENT!==!1,wn=$.IN_PLACE||!1,gn=$.ALLOWED_URI_REGEXP||Kc,jt=$.NAMESPACE||Ve,ms=$.MATHML_TEXT_INTEGRATION_POINTS||ms,vs=$.HTML_INTEGRATION_POINTS||vs,H=$.CUSTOM_ELEMENT_HANDLING||{},$.CUSTOM_ELEMENT_HANDLING&&Yo($.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(H.tagNameCheck=$.CUSTOM_ELEMENT_HANDLING.tagNameCheck),$.CUSTOM_ELEMENT_HANDLING&&Yo($.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(H.attributeNameCheck=$.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),$.CUSTOM_ELEMENT_HANDLING&&typeof $.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(H.allowCustomizedBuiltInElements=$.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),ft&&(vn=!1),ps&&(Wt=!0),qt&&(X=z({},Lr),V=[],qt.html===!0&&(z(X,Rr),z(V,Pr)),qt.svg===!0&&(z(X,La),z(V,Da),z(V,ws)),qt.svgFilters===!0&&(z(X,Pa),z(V,Da),z(V,ws)),qt.mathMl===!0&&(z(X,Ia),z(V,Ir),z(V,ws))),$.ADD_TAGS&&(typeof $.ADD_TAGS=="function"?je.tagCheck=$.ADD_TAGS:(X===Ut&&(X=Ue(X)),z(X,$.ADD_TAGS,ne))),$.ADD_ATTR&&(typeof $.ADD_ATTR=="function"?je.attributeCheck=$.ADD_ATTR:(V===mn&&(V=Ue(V)),z(V,$.ADD_ATTR,ne))),$.ADD_URI_SAFE_ATTR&&z(ka,$.ADD_URI_SAFE_ATTR,ne),$.FORBID_CONTENTS&&(Ne===wa&&(Ne=Ue(Ne)),z(Ne,$.FORBID_CONTENTS,ne)),$.ADD_FORBID_CONTENTS&&(Ne===wa&&(Ne=Ue(Ne)),z(Ne,$.ADD_FORBID_CONTENTS,ne)),ba&&(X["#text"]=!0),gt&&z(X,["html","head","body"]),X.table&&(z(X,["tbody"]),delete at.tbody),$.TRUSTED_TYPES_POLICY){if(typeof $.TRUSTED_TYPES_POLICY.createHTML!="function")throw xn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof $.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw xn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');x=$.TRUSTED_TYPES_POLICY,_=x.createHTML("")}else x===void 0&&(x=xf(m,a)),x!==null&&typeof _=="string"&&(_=x.createHTML(""));ge&&ge($),Vt=$}},Jo=z({},[...La,...Pa,...ff]),Xo=z({},[...Ia,...gf]),Dp=function($){let C=T($);(!C||!C.tagName)&&(C={namespaceURI:jt,tagName:"template"});const D=Ts($.tagName),G=Ts(C.tagName);return Sa[$.namespaceURI]?$.namespaceURI===gs?C.namespaceURI===Ve?D==="svg":C.namespaceURI===fs?D==="svg"&&(G==="annotation-xml"||ms[G]):!!Jo[D]:$.namespaceURI===fs?C.namespaceURI===Ve?D==="math":C.namespaceURI===gs?D==="math"&&vs[G]:!!Xo[D]:$.namespaceURI===Ve?C.namespaceURI===gs&&!vs[G]||C.namespaceURI===fs&&!ms[G]?!1:!Xo[D]&&(Rp[D]||!Jo[D]):!!(kn==="application/xhtml+xml"&&Sa[$.namespaceURI]):!1},Fe=function($){Sn(t.removed,{element:$});try{T($).removeChild($)}catch{g($)}},mt=function($,C){try{Sn(t.removed,{attribute:C.getAttributeNode($),from:C})}catch{Sn(t.removed,{attribute:null,from:C})}if(C.removeAttribute($),$==="is")if(Wt||ps)try{Fe(C)}catch{}else try{C.setAttribute($,"")}catch{}},Zo=function($){let C=null,D=null;if(ya)$="<remove></remove>"+$;else{const ee=Ra($,/^[\r\n\t ]+/);D=ee&&ee[0]}kn==="application/xhtml+xml"&&jt===Ve&&($='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+$+"</body></html>");const G=x?x.createHTML($):$;if(jt===Ve)try{C=new v().parseFromString(G,kn)}catch{}if(!C||!C.documentElement){C=L.createDocument(jt,"template",null);try{C.documentElement.innerHTML=$a?_:G}catch{}}const de=C.body||C.documentElement;return $&&D&&de.insertBefore(n.createTextNode(D),de.childNodes[0]||null),jt===Ve?Y.call(C,gt?"html":"body")[0]:gt?C.documentElement:de},er=function($){return R.call($.ownerDocument||$,$,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},xa=function($){return $ instanceof f&&(typeof $.nodeName!="string"||typeof $.textContent!="string"||typeof $.removeChild!="function"||!($.attributes instanceof p)||typeof $.removeAttribute!="function"||typeof $.setAttribute!="function"||typeof $.namespaceURI!="string"||typeof $.insertBefore!="function"||typeof $.hasChildNodes!="function")},tr=function($){return typeof l=="function"&&$ instanceof l};function He(N,$,C){bs(N,D=>{D.call(t,$,C,Vt)})}const nr=function($){let C=null;if(He(M.beforeSanitizeElements,$,null),xa($))return Fe($),!0;const D=ne($.nodeName);if(He(M.uponSanitizeElement,$,{tagName:D,allowedTags:X}),us&&$.hasChildNodes()&&!tr($.firstElementChild)&&pe(/<[/\w!]/g,$.innerHTML)&&pe(/<[/\w!]/g,$.textContent)||$.nodeType===_n.progressingInstruction||us&&$.nodeType===_n.comment&&pe(/<[/\w]/g,$.data))return Fe($),!0;if(!(je.tagCheck instanceof Function&&je.tagCheck(D))&&(!X[D]||at[D])){if(!at[D]&&ar(D)&&(H.tagNameCheck instanceof RegExp&&pe(H.tagNameCheck,D)||H.tagNameCheck instanceof Function&&H.tagNameCheck(D)))return!1;if(ba&&!Ne[D]){const G=T($)||$.parentNode,de=A($)||$.childNodes;if(de&&G){const ee=de.length;for(let ve=ee-1;ve>=0;--ve){const Ge=d(de[ve],!0);Ge.__removalCount=($.__removalCount||0)+1,G.insertBefore(Ge,S($))}}}return Fe($),!0}return $ instanceof c&&!Dp($)||(D==="noscript"||D==="noembed"||D==="noframes")&&pe(/<\/no(script|embed|frames)/i,$.innerHTML)?(Fe($),!0):(ft&&$.nodeType===_n.text&&(C=$.textContent,bs([F,U,O],G=>{C=An(C,G," ")}),$.textContent!==C&&(Sn(t.removed,{element:$.cloneNode()}),$.textContent=C)),He(M.afterSanitizeElements,$,null),!1)},sr=function($,C,D){if(jo&&(C==="id"||C==="name")&&(D in n||D in Ip))return!1;if(!(vn&&!zt[C]&&pe(ie,C))){if(!(Kt&&pe(ke,C))){if(!(je.attributeCheck instanceof Function&&je.attributeCheck(C,$))){if(!V[C]||zt[C]){if(!(ar($)&&(H.tagNameCheck instanceof RegExp&&pe(H.tagNameCheck,$)||H.tagNameCheck instanceof Function&&H.tagNameCheck($))&&(H.attributeNameCheck instanceof RegExp&&pe(H.attributeNameCheck,C)||H.attributeNameCheck instanceof Function&&H.attributeNameCheck(C,$))||C==="is"&&H.allowCustomizedBuiltInElements&&(H.tagNameCheck instanceof RegExp&&pe(H.tagNameCheck,D)||H.tagNameCheck instanceof Function&&H.tagNameCheck(D))))return!1}else if(!ka[C]){if(!pe(gn,An(D,B,""))){if(!((C==="src"||C==="xlink:href"||C==="href")&&$!=="script"&&df(D,"data:")===0&&Ho[$])){if(!(yn&&!pe(J,An(D,B,"")))){if(D)return!1}}}}}}}return!0},ar=function($){return $!=="annotation-xml"&&Ra($,Oe)},ir=function($){He(M.beforeSanitizeAttributes,$,null);const{attributes:C}=$;if(!C||xa($))return;const D={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:V,forceKeepAttr:void 0};let G=C.length;for(;G--;){const de=C[G],{name:ee,namespaceURI:ve,value:Ge}=de,Ht=ne(ee),Ta=Ge;let oe=ee==="value"?Ta:uf(Ta);if(D.attrName=Ht,D.attrValue=oe,D.keepAttr=!0,D.forceKeepAttr=void 0,He(M.uponSanitizeAttribute,$,D),oe=D.attrValue,Vo&&(Ht==="id"||Ht==="name")&&(mt(ee,$),oe=Cp+oe),us&&pe(/((--!?|])>)|<\/(style|title|textarea)/i,oe)){mt(ee,$);continue}if(Ht==="attributename"&&Ra(oe,"href")){mt(ee,$);continue}if(D.forceKeepAttr)continue;if(!D.keepAttr){mt(ee,$);continue}if(!bn&&pe(/\/>/i,oe)){mt(ee,$);continue}ft&&bs([F,U,O],rr=>{oe=An(oe,rr," ")});const or=ne($.nodeName);if(!sr(or,Ht,oe)){mt(ee,$);continue}if(x&&typeof m=="object"&&typeof m.getAttributeType=="function"&&!ve)switch(m.getAttributeType(or,Ht)){case"TrustedHTML":{oe=x.createHTML(oe);break}case"TrustedScriptURL":{oe=x.createScriptURL(oe);break}}if(oe!==Ta)try{ve?$.setAttributeNS(ve,ee,oe):$.setAttribute(ee,oe),xa($)?Fe($):Er(t.removed)}catch{mt(ee,$)}}He(M.afterSanitizeAttributes,$,null)},Mp=function N($){let C=null;const D=er($);for(He(M.beforeSanitizeShadowDOM,$,null);C=D.nextNode();)He(M.uponSanitizeShadowNode,C,null),nr(C),ir(C),C.content instanceof i&&N(C.content);He(M.afterSanitizeShadowDOM,$,null)};return t.sanitize=function(N){let $=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},C=null,D=null,G=null,de=null;if($a=!N,$a&&(N="<!-->"),typeof N!="string"&&!tr(N))if(typeof N.toString=="function"){if(N=N.toString(),typeof N!="string")throw xn("dirty is not a string, aborting")}else throw xn("toString is not a function");if(!t.isSupported)return N;if(va||Aa($),t.removed=[],typeof N=="string"&&(wn=!1),wn){if(N.nodeName){const Ge=ne(N.nodeName);if(!X[Ge]||at[Ge])throw xn("root node is forbidden and cannot be sanitized in-place")}}else if(N instanceof l)C=Zo("<!---->"),D=C.ownerDocument.importNode(N,!0),D.nodeType===_n.element&&D.nodeName==="BODY"||D.nodeName==="HTML"?C=D:C.appendChild(D);else{if(!Wt&&!ft&&!gt&&N.indexOf("<")===-1)return x&&hs?x.createHTML(N):N;if(C=Zo(N),!C)return Wt?null:hs?_:""}C&&ya&&Fe(C.firstChild);const ee=er(wn?N:C);for(;G=ee.nextNode();)nr(G),ir(G),G.content instanceof i&&Mp(G.content);if(wn)return N;if(Wt){if(ps)for(de=Z.call(C.ownerDocument);C.firstChild;)de.appendChild(C.firstChild);else de=C;return(V.shadowroot||V.shadowrootmode)&&(de=I.call(s,de,!0)),de}let ve=gt?C.outerHTML:C.innerHTML;return gt&&X["!doctype"]&&C.ownerDocument&&C.ownerDocument.doctype&&C.ownerDocument.doctype.name&&pe(Wc,C.ownerDocument.doctype.name)&&(ve="<!DOCTYPE "+C.ownerDocument.doctype.name+`>
`+ve),ft&&bs([F,U,O],Ge=>{ve=An(ve,Ge," ")}),x&&hs?x.createHTML(ve):ve},t.setConfig=function(){let N=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Aa(N),va=!0},t.clearConfig=function(){Vt=null,va=!1},t.isValidAttribute=function(N,$,C){Vt||Aa({});const D=ne(N),G=ne($);return sr(D,G,C)},t.addHook=function(N,$){typeof $=="function"&&Sn(M[N],$)},t.removeHook=function(N,$){if($!==void 0){const C=lf(M[N],$);return C===-1?void 0:cf(M[N],C,1)[0]}return Er(M[N])},t.removeHooks=function(N){M[N]=[]},t.removeAllHooks=function(){M=Mr()},t}var Rt=qc();function Ji(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Nt=Ji();function jc(e){Nt=e}var xt={exec:()=>null};function W(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(a,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(fe.caret,"$1"),n=n.replace(a,o),s},getRegex:()=>new RegExp(n,t)};return s}var Tf=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),fe={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},_f=/^(?:[ \t]*(?:\n|$))+/,Cf=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ef=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,as=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Rf=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Xi=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Vc=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Hc=W(Vc).replace(/bull/g,Xi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Lf=W(Vc).replace(/bull/g,Xi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Zi=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Pf=/^[^\n]+/,eo=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,If=W(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",eo).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Df=W(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Xi).getRegex(),ea="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",to=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Mf=W("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",to).replace("tag",ea).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Gc=W(Zi).replace("hr",as).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ea).getRegex(),Of=W(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Gc).getRegex(),no={blockquote:Of,code:Cf,def:If,fences:Ef,heading:Rf,hr:as,html:Mf,lheading:Hc,list:Df,newline:_f,paragraph:Gc,table:xt,text:Pf},Or=W("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",as).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ea).getRegex(),Nf={...no,lheading:Lf,table:Or,paragraph:W(Zi).replace("hr",as).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Or).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ea).getRegex()},Ff={...no,html:W(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",to).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:xt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:W(Zi).replace("hr",as).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Hc).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Bf=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Uf=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Qc=/^( {2,}|\\)\n(?!\s*$)/,zf=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ta=/[\p{P}\p{S}]/u,so=/[\s\p{P}\p{S}]/u,Yc=/[^\s\p{P}\p{S}]/u,Kf=W(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,so).getRegex(),Jc=/(?!~)[\p{P}\p{S}]/u,Wf=/(?!~)[\s\p{P}\p{S}]/u,qf=/(?:[^\s\p{P}\p{S}]|~)/u,Xc=/(?![*_])[\p{P}\p{S}]/u,jf=/(?![*_])[\s\p{P}\p{S}]/u,Vf=/(?:[^\s\p{P}\p{S}]|[*_])/u,Hf=W(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Tf?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Zc=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Gf=W(Zc,"u").replace(/punct/g,ta).getRegex(),Qf=W(Zc,"u").replace(/punct/g,Jc).getRegex(),ed="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Yf=W(ed,"gu").replace(/notPunctSpace/g,Yc).replace(/punctSpace/g,so).replace(/punct/g,ta).getRegex(),Jf=W(ed,"gu").replace(/notPunctSpace/g,qf).replace(/punctSpace/g,Wf).replace(/punct/g,Jc).getRegex(),Xf=W("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Yc).replace(/punctSpace/g,so).replace(/punct/g,ta).getRegex(),Zf=W(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Xc).getRegex(),eg="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",tg=W(eg,"gu").replace(/notPunctSpace/g,Vf).replace(/punctSpace/g,jf).replace(/punct/g,Xc).getRegex(),ng=W(/\\(punct)/,"gu").replace(/punct/g,ta).getRegex(),sg=W(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ag=W(to).replace("(?:-->|$)","-->").getRegex(),ig=W("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ag).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ns=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,og=W(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Ns).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),td=W(/^!?\[(label)\]\[(ref)\]/).replace("label",Ns).replace("ref",eo).getRegex(),nd=W(/^!?\[(ref)\](?:\[\])?/).replace("ref",eo).getRegex(),rg=W("reflink|nolink(?!\\()","g").replace("reflink",td).replace("nolink",nd).getRegex(),Nr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,ao={_backpedal:xt,anyPunctuation:ng,autolink:sg,blockSkip:Hf,br:Qc,code:Uf,del:xt,delLDelim:xt,delRDelim:xt,emStrongLDelim:Gf,emStrongRDelimAst:Yf,emStrongRDelimUnd:Xf,escape:Bf,link:og,nolink:nd,punctuation:Kf,reflink:td,reflinkSearch:rg,tag:ig,text:zf,url:xt},lg={...ao,link:W(/^!?\[(label)\]\((.*?)\)/).replace("label",Ns).getRegex(),reflink:W(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ns).getRegex()},fi={...ao,emStrongRDelimAst:Jf,emStrongLDelim:Qf,delLDelim:Zf,delRDelim:tg,url:W(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Nr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:W(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Nr).getRegex()},cg={...fi,br:W(Qc).replace("{2,}","*").getRegex(),text:W(fi.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},ks={normal:no,gfm:Nf,pedantic:Ff},Cn={normal:ao,gfm:fi,breaks:cg,pedantic:lg},dg={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Fr=e=>dg[e];function ze(e,t){if(t){if(fe.escapeTest.test(e))return e.replace(fe.escapeReplace,Fr)}else if(fe.escapeTestNoEncode.test(e))return e.replace(fe.escapeReplaceNoEncode,Fr);return e}function Br(e){try{e=encodeURI(e).replace(fe.percentDecode,"%")}catch{return null}return e}function Ur(e,t){let n=e.replace(fe.findPipe,(i,o,l)=>{let c=!1,u=o;for(;--u>=0&&l[u]==="\\";)c=!c;return c?"|":" |"}),s=n.split(fe.splitPipe),a=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;a<s.length;a++)s[a]=s[a].trim().replace(fe.slashPipe,"|");return s}function En(e,t,n){let s=e.length;if(s===0)return"";let a=0;for(;a<s&&e.charAt(s-a-1)===t;)a++;return e.slice(0,s-a)}function ug(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function pg(e,t=0){let n=t,s="";for(let a of e)if(a==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=a,n++;return s}function zr(e,t,n,s,a){let i=t.href,o=t.title||null,l=e[1].replace(a.other.outputLinkReplace,"$1");s.state.inLink=!0;let c={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:o,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,c}function hg(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let a=s[1];return t.split(`
`).map(i=>{let o=i.match(n.other.beginningSpace);if(o===null)return i;let[l]=o;return l.length>=a.length?i.slice(a.length):i}).join(`
`)}var Fs=class{options;rules;lexer;constructor(e){this.options=e||Nt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:En(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=hg(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=En(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:En(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=En(t[0],`
`).split(`
`),s="",a="",i=[];for(;n.length>0;){let o=!1,l=[],c;for(c=0;c<n.length;c++)if(this.rules.other.blockquoteStart.test(n[c]))l.push(n[c]),o=!0;else if(!o)l.push(n[c]);else break;n=n.slice(c);let u=l.join(`
`),p=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${u}`:u,a=a?`${a}
${p}`:p;let f=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(p,i,!0),this.lexer.state.top=f,n.length===0)break;let v=i.at(-1);if(v?.type==="code")break;if(v?.type==="blockquote"){let m=v,k=m.raw+`
`+n.join(`
`),d=this.blockquote(k);i[i.length-1]=d,s=s.substring(0,s.length-m.raw.length)+d.raw,a=a.substring(0,a.length-m.text.length)+d.text;break}else if(v?.type==="list"){let m=v,k=m.raw+`
`+n.join(`
`),d=this.list(k);i[i.length-1]=d,s=s.substring(0,s.length-v.raw.length)+d.raw,a=a.substring(0,a.length-m.raw.length)+d.raw,n=k.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:a}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,a={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),o=!1;for(;e;){let c=!1,u="",p="";if(!(t=i.exec(e))||this.rules.block.hr.test(e))break;u=t[0],e=e.substring(u.length);let f=pg(t[2].split(`
`,1)[0],t[1].length),v=e.split(`
`,1)[0],m=!f.trim(),k=0;if(this.options.pedantic?(k=2,p=f.trimStart()):m?k=t[1].length+1:(k=f.search(this.rules.other.nonSpaceChar),k=k>4?1:k,p=f.slice(k),k+=t[1].length),m&&this.rules.other.blankLine.test(v)&&(u+=v+`
`,e=e.substring(v.length+1),c=!0),!c){let d=this.rules.other.nextBulletRegex(k),g=this.rules.other.hrRegex(k),S=this.rules.other.fencesBeginRegex(k),A=this.rules.other.headingBeginRegex(k),T=this.rules.other.htmlBeginRegex(k),x=this.rules.other.blockquoteBeginRegex(k);for(;e;){let _=e.split(`
`,1)[0],L;if(v=_,this.options.pedantic?(v=v.replace(this.rules.other.listReplaceNesting,"  "),L=v):L=v.replace(this.rules.other.tabCharGlobal,"    "),S.test(v)||A.test(v)||T.test(v)||x.test(v)||d.test(v)||g.test(v))break;if(L.search(this.rules.other.nonSpaceChar)>=k||!v.trim())p+=`
`+L.slice(k);else{if(m||f.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||S.test(f)||A.test(f)||g.test(f))break;p+=`
`+v}m=!v.trim(),u+=_+`
`,e=e.substring(_.length+1),f=L.slice(k)}}a.loose||(o?a.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(o=!0)),a.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(p),loose:!1,text:p,tokens:[]}),a.raw+=u}let l=a.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;a.raw=a.raw.trimEnd();for(let c of a.items){if(this.lexer.state.top=!1,c.tokens=this.lexer.blockTokens(c.text,[]),c.task){if(c.text=c.text.replace(this.rules.other.listReplaceTask,""),c.tokens[0]?.type==="text"||c.tokens[0]?.type==="paragraph"){c.tokens[0].raw=c.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),c.tokens[0].text=c.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let p=this.lexer.inlineQueue.length-1;p>=0;p--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[p].src)){this.lexer.inlineQueue[p].src=this.lexer.inlineQueue[p].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(c.raw);if(u){let p={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};c.checked=p.checked,a.loose?c.tokens[0]&&["paragraph","text"].includes(c.tokens[0].type)&&"tokens"in c.tokens[0]&&c.tokens[0].tokens?(c.tokens[0].raw=p.raw+c.tokens[0].raw,c.tokens[0].text=p.raw+c.tokens[0].text,c.tokens[0].tokens.unshift(p)):c.tokens.unshift({type:"paragraph",raw:p.raw,text:p.raw,tokens:[p]}):c.tokens.unshift(p)}}if(!a.loose){let u=c.tokens.filter(f=>f.type==="space"),p=u.length>0&&u.some(f=>this.rules.other.anyLine.test(f.raw));a.loose=p}}if(a.loose)for(let c of a.items){c.loose=!0;for(let u of c.tokens)u.type==="text"&&(u.type="paragraph")}return a}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",a=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:a}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Ur(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),a=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let o of s)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<n.length;o++)i.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:i.align[o]});for(let o of a)i.rows.push(Ur(o,i.header.length).map((l,c)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:i.align[c]})));return i}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=En(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=ug(t[2],"()");if(i===-2)return;if(i>-1){let o=(t[0].indexOf("!")===0?5:4)+t[1].length+i;t[2]=t[2].substring(0,i),t[0]=t[0].substring(0,o).trim(),t[3]=""}}let s=t[2],a="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],a=i[3])}else a=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),zr(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:a&&a.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),a=t[s.toLowerCase()];if(!a){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return zr(n,a,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let a=[...s[0]].length-1,i,o,l=a,c=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+a);(s=u.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(o=[...i].length,s[3]||s[4]){l+=o;continue}else if((s[5]||s[6])&&a%3&&!((a+o)%3)){c+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l+c);let p=[...s[0]][0].length,f=e.slice(0,a+s.index+p+o);if(Math.min(a,o)%2){let m=f.slice(1,-1);return{type:"em",raw:f,text:m,tokens:this.lexer.inlineTokens(m)}}let v=f.slice(2,-2);return{type:"strong",raw:f,text:v,tokens:this.lexer.inlineTokens(v)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),a=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&a&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let a=[...s[0]].length-1,i,o,l=a,c=this.rules.inline.delRDelim;for(c.lastIndex=0,t=t.slice(-1*e.length+a);(s=c.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(o=[...i].length,o!==a))continue;if(s[3]||s[4]){l+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l);let u=[...s[0]][0].length,p=e.slice(0,a+s.index+u+o),f=p.slice(a,-a);return{type:"del",raw:p,text:f,tokens:this.lexer.inlineTokens(f)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let a;do a=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(a!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},Ie=class gi{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Nt,this.options.tokenizer=this.options.tokenizer||new Fs,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:fe,block:ks.normal,inline:Cn.normal};this.options.pedantic?(n.block=ks.pedantic,n.inline=Cn.pedantic):this.options.gfm&&(n.block=ks.gfm,this.options.breaks?n.inline=Cn.breaks:n.inline=Cn.gfm),this.tokenizer.rules=n}static get rules(){return{block:ks,inline:Cn}}static lex(t,n){return new gi(n).lex(t)}static lexInline(t,n){return new gi(n).inlineTokens(t)}lex(t){t=t.replace(fe.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(fe.tabCharGlobal,"    ").replace(fe.spaceLine,""));t;){let a;if(this.options.extensions?.block?.some(o=>(a=o.call({lexer:this},t,n))?(t=t.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.space(t)){t=t.substring(a.raw.length);let o=n.at(-1);a.raw.length===1&&o!==void 0?o.raw+=`
`:n.push(a);continue}if(a=this.tokenizer.code(t)){t=t.substring(a.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.text,this.inlineQueue.at(-1).src=o.text):n.push(a);continue}if(a=this.tokenizer.fences(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.heading(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.hr(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.blockquote(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.list(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.html(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.def(t)){t=t.substring(a.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[a.tag]||(this.tokens.links[a.tag]={href:a.href,title:a.title},n.push(a));continue}if(a=this.tokenizer.table(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.lheading(t)){t=t.substring(a.raw.length),n.push(a);continue}let i=t;if(this.options.extensions?.startBlock){let o=1/0,l=t.slice(1),c;this.options.extensions.startBlock.forEach(u=>{c=u.call({lexer:this},l),typeof c=="number"&&c>=0&&(o=Math.min(o,c))}),o<1/0&&o>=0&&(i=t.substring(0,o+1))}if(this.state.top&&(a=this.tokenizer.paragraph(i))){let o=n.at(-1);s&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(a),s=i.length!==t.length,t=t.substring(a.raw.length);continue}if(a=this.tokenizer.text(t)){t=t.substring(a.raw.length);let o=n.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+a.raw,o.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(a);continue}if(t){let o="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,a=null;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(a=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)c.includes(a[0].slice(a[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,a.index)+"["+"a".repeat(a[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(a=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,a.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(a=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=a[2]?a[2].length:0,s=s.slice(0,a.index+i)+"["+"a".repeat(a[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let o=!1,l="";for(;t;){o||(l=""),o=!1;let c;if(this.options.extensions?.inline?.some(p=>(c=p.call({lexer:this},t,n))?(t=t.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.escape(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.tag(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.link(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(c.raw.length);let p=n.at(-1);c.type==="text"&&p?.type==="text"?(p.raw+=c.raw,p.text+=c.text):n.push(c);continue}if(c=this.tokenizer.emStrong(t,s,l)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.codespan(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.br(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.del(t,s,l)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.autolink(t)){t=t.substring(c.raw.length),n.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(t))){t=t.substring(c.raw.length),n.push(c);continue}let u=t;if(this.options.extensions?.startInline){let p=1/0,f=t.slice(1),v;this.options.extensions.startInline.forEach(m=>{v=m.call({lexer:this},f),typeof v=="number"&&v>=0&&(p=Math.min(p,v))}),p<1/0&&p>=0&&(u=t.substring(0,p+1))}if(c=this.tokenizer.inlineText(u)){t=t.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(l=c.raw.slice(-1)),o=!0;let p=n.at(-1);p?.type==="text"?(p.raw+=c.raw,p.text+=c.text):n.push(c);continue}if(t){let p="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(p);break}else throw new Error(p)}}return n}},Bs=class{options;parser;constructor(e){this.options=e||Nt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(fe.notSpaceStart)?.[0],a=e.replace(fe.endingNewline,"")+`
`;return s?'<pre><code class="language-'+ze(s)+'">'+(n?a:ze(a,!0))+`</code></pre>
`:"<pre><code>"+(n?a:ze(a,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let o=0;o<e.items.length;o++){let l=e.items[o];s+=this.listitem(l)}let a=t?"ol":"ul",i=t&&n!==1?' start="'+n+'"':"";return"<"+a+i+`>
`+s+"</"+a+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let a=0;a<e.header.length;a++)n+=this.tablecell(e.header[a]);t+=this.tablerow({text:n});let s="";for(let a=0;a<e.rows.length;a++){let i=e.rows[a];n="";for(let o=0;o<i.length;o++)n+=this.tablecell(i[o]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${ze(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),a=Br(e);if(a===null)return s;e=a;let i='<a href="'+e+'"';return t&&(i+=' title="'+ze(t)+'"'),i+=">"+s+"</a>",i}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let a=Br(e);if(a===null)return ze(n);e=a;let i=`<img src="${e}" alt="${ze(n)}"`;return t&&(i+=` title="${ze(t)}"`),i+=">",i}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:ze(e.text)}},io=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},De=class mi{options;renderer;textRenderer;constructor(t){this.options=t||Nt,this.options.renderer=this.options.renderer||new Bs,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new io}static parse(t,n){return new mi(n).parse(t)}static parseInline(t,n){return new mi(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let a=t[s];if(this.options.extensions?.renderers?.[a.type]){let o=a,l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){n+=l||"";continue}}let i=a;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(t,n=this.renderer){let s="";for(let a=0;a<t.length;a++){let i=t[a];if(this.options.extensions?.renderers?.[i.type]){let l=this.options.extensions.renderers[i.type].call({parser:this},i);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=l||"";continue}}let o=i;switch(o.type){case"escape":{s+=n.text(o);break}case"html":{s+=n.html(o);break}case"link":{s+=n.link(o);break}case"image":{s+=n.image(o);break}case"checkbox":{s+=n.checkbox(o);break}case"strong":{s+=n.strong(o);break}case"em":{s+=n.em(o);break}case"codespan":{s+=n.codespan(o);break}case"br":{s+=n.br(o);break}case"del":{s+=n.del(o);break}case"text":{s+=n.text(o);break}default:{let l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}},Dn=class{options;block;constructor(t){this.options=t||Nt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?Ie.lex:Ie.lexInline}provideParser(){return this.block?De.parse:De.parseInline}},fg=class{defaults=Ji();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=De;Renderer=Bs;TextRenderer=io;Lexer=Ie;Tokenizer=Fs;Hooks=Dn;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let a=s;for(let i of a.header)n=n.concat(this.walkTokens(i.tokens,t));for(let i of a.rows)for(let o of i)n=n.concat(this.walkTokens(o.tokens,t));break}case"list":{let a=s;n=n.concat(this.walkTokens(a.items,t));break}default:{let a=s;this.defaults.extensions?.childTokens?.[a.type]?this.defaults.extensions.childTokens[a.type].forEach(i=>{let o=a[i].flat(1/0);n=n.concat(this.walkTokens(o,t))}):a.tokens&&(n=n.concat(this.walkTokens(a.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(a=>{if(!a.name)throw new Error("extension name required");if("renderer"in a){let i=t.renderers[a.name];i?t.renderers[a.name]=function(...o){let l=a.renderer.apply(this,o);return l===!1&&(l=i.apply(this,o)),l}:t.renderers[a.name]=a.renderer}if("tokenizer"in a){if(!a.level||a.level!=="block"&&a.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=t[a.level];i?i.unshift(a.tokenizer):t[a.level]=[a.tokenizer],a.start&&(a.level==="block"?t.startBlock?t.startBlock.push(a.start):t.startBlock=[a.start]:a.level==="inline"&&(t.startInline?t.startInline.push(a.start):t.startInline=[a.start]))}"childTokens"in a&&a.childTokens&&(t.childTokens[a.name]=a.childTokens)}),s.extensions=t),n.renderer){let a=this.defaults.renderer||new Bs(this.defaults);for(let i in n.renderer){if(!(i in a))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,l=n.renderer[o],c=a[o];a[o]=(...u)=>{let p=l.apply(a,u);return p===!1&&(p=c.apply(a,u)),p||""}}s.renderer=a}if(n.tokenizer){let a=this.defaults.tokenizer||new Fs(this.defaults);for(let i in n.tokenizer){if(!(i in a))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,l=n.tokenizer[o],c=a[o];a[o]=(...u)=>{let p=l.apply(a,u);return p===!1&&(p=c.apply(a,u)),p}}s.tokenizer=a}if(n.hooks){let a=this.defaults.hooks||new Dn;for(let i in n.hooks){if(!(i in a))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,l=n.hooks[o],c=a[o];Dn.passThroughHooks.has(i)?a[o]=u=>{if(this.defaults.async&&Dn.passThroughHooksRespectAsync.has(i))return(async()=>{let f=await l.call(a,u);return c.call(a,f)})();let p=l.call(a,u);return c.call(a,p)}:a[o]=(...u)=>{if(this.defaults.async)return(async()=>{let f=await l.apply(a,u);return f===!1&&(f=await c.apply(a,u)),f})();let p=l.apply(a,u);return p===!1&&(p=c.apply(a,u)),p}}s.hooks=a}if(n.walkTokens){let a=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(o){let l=[];return l.push(i.call(this,o)),a&&(l=l.concat(a.call(this,o))),l}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Ie.lex(e,t??this.defaults)}parser(e,t){return De.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},a={...this.defaults,...s},i=this.onError(!!a.silent,!!a.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(a.hooks&&(a.hooks.options=a,a.hooks.block=e),a.async)return(async()=>{let o=a.hooks?await a.hooks.preprocess(t):t,l=await(a.hooks?await a.hooks.provideLexer():e?Ie.lex:Ie.lexInline)(o,a),c=a.hooks?await a.hooks.processAllTokens(l):l;a.walkTokens&&await Promise.all(this.walkTokens(c,a.walkTokens));let u=await(a.hooks?await a.hooks.provideParser():e?De.parse:De.parseInline)(c,a);return a.hooks?await a.hooks.postprocess(u):u})().catch(i);try{a.hooks&&(t=a.hooks.preprocess(t));let o=(a.hooks?a.hooks.provideLexer():e?Ie.lex:Ie.lexInline)(t,a);a.hooks&&(o=a.hooks.processAllTokens(o)),a.walkTokens&&this.walkTokens(o,a.walkTokens);let l=(a.hooks?a.hooks.provideParser():e?De.parse:De.parseInline)(o,a);return a.hooks&&(l=a.hooks.postprocess(l)),l}catch(o){return i(o)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+ze(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},Lt=new fg;function j(e,t){return Lt.parse(e,t)}j.options=j.setOptions=function(e){return Lt.setOptions(e),j.defaults=Lt.defaults,jc(j.defaults),j};j.getDefaults=Ji;j.defaults=Nt;j.use=function(...e){return Lt.use(...e),j.defaults=Lt.defaults,jc(j.defaults),j};j.walkTokens=function(e,t){return Lt.walkTokens(e,t)};j.parseInline=Lt.parseInline;j.Parser=De;j.parser=De.parse;j.Renderer=Bs;j.TextRenderer=io;j.Lexer=Ie;j.lexer=Ie.lex;j.Tokenizer=Fs;j.Hooks=Dn;j.parse=j;j.options;j.setOptions;j.use;j.walkTokens;j.parseInline;De.parse;Ie.lex;j.setOptions({gfm:!0,breaks:!0,mangle:!1});const gg=/\.(html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log)$/i,mg=new RegExp("(?<![(\\[`])(?:~\\/|\\/(?:Users|home|tmp|var|opt|etc|godmode)\\/)[\\w/.+@-]+\\.\\w+","g");function sd(e){const t=e.split(/(```[\s\S]*?```|`[^`\n]+`)/g);for(let n=0;n<t.length;n++)n%2===0&&(t[n]=t[n].replace(mg,s=>{if(!gg.test(s))return s;const a=s.startsWith("~/")?`file:///~/${s.slice(2)}`:`file://${s}`;return`[${s.split("/").pop()??s}](${a})`}));return t.join("")}const Zn=["a","article","aside","b","blockquote","br","caption","col","colgroup","code","div","del","details","em","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","hr","img","i","input","li","main","nav","ol","p","pre","section","span","strong","sub","sup","summary","table","tbody","td","th","thead","tr","ul"],es=["alt","checked","class","decoding","disabled","height","href","loading","open","rel","src","start","target","title","type","width","style"],vi=/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;let Kr=!1;const vg=14e4,yg=14e4,bg=200,Ma=5e4,_t=new Map;function wg(e){const t=_t.get(e);return t===void 0?null:(_t.delete(e),_t.set(e,t),t)}function Wr(e,t){if(_t.set(e,t),_t.size<=bg)return;const n=_t.keys().next().value;n&&_t.delete(n)}function na(){Kr||(Kr=!0,Rt.addHook("uponSanitizeElement",e=>{e instanceof HTMLInputElement&&e.getAttribute("type")!=="checkbox"&&e.remove()}),Rt.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function Se(e){const t=e.trim();if(!t)return"";if(na(),t.length<=Ma){const l=wg(t);if(l!==null)return l}const n=Uc(t,vg),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>yg){const c=`<pre class="code-block">${Cg(`${n.text}${s}`)}</pre>`,u=Rt.sanitize(c,{ALLOWED_TAGS:Zn,ALLOWED_ATTR:es,ALLOWED_URI_REGEXP:vi});return t.length<=Ma&&Wr(t,u),u}const a=sd(`${n.text}${s}`),i=j.parse(a),o=Rt.sanitize(i,{ALLOWED_TAGS:Zn,ALLOWED_ATTR:es,ALLOWED_URI_REGEXP:vi});return t.length<=Ma&&Wr(t,o),o}function kg(e){const t=e.trim();if(!t)return"";na();const n=j.parse(t);return Rt.sanitize(n,{ALLOWED_TAGS:Zn,ALLOWED_ATTR:es,ALLOWED_URI_REGEXP:vi}).replace(/<input([^>]*)\bdisabled\b([^>]*)>/g,"<input$1$2>")}function ad(e){const t=e.trim();return t?(na(),Rt.sanitize(t,{ALLOWED_TAGS:Zn,ALLOWED_ATTR:es,FORBID_TAGS:["base","iframe","link","meta","object","script"]})):""}const $g=[...Zn,"svg","path","circle","ellipse","rect","line","polyline","polygon","text","tspan","g","defs","linearGradient","radialGradient","stop","clipPath","mask","use","symbol","marker","pattern","animate","animateTransform"],Sg=[...es,"viewBox","xmlns","preserveAspectRatio","d","cx","cy","r","rx","ry","x","x1","x2","y","y1","y2","dx","dy","fill","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","transform","opacity","points","text-anchor","dominant-baseline","font-size","font-weight","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","marker-start","marker-mid","marker-end","clip-path","patternUnits","patternTransform","rotate","textLength","lengthAdjust","values","dur","repeatCount","attributeName","from","to","begin","calcMode","keySplines","keyTimes"];function Ag(e){const t=e.trim();if(!t)return"";na();const{styles:n,html:s}=xg(t),a=Rt.sanitize(s,{ALLOWED_TAGS:$g,ALLOWED_ATTR:Sg,FORBID_TAGS:["base","iframe","link","meta","object","script","style"]}),i=".dashboard-render";return n.map(l=>`<style>${_g(l,i)}</style>`).join(`
`)+a}function xg(e){const t=[],n=e.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi,(o,l)=>(t.push(l),"")),s=n.match(/<body[^>]*>([\s\S]*)<\/body>/i),i=(s?s[1]:n).replace(/<!DOCTYPE[^>]*>/gi,"").replace(/<\/?html[^>]*>/gi,"").replace(/<\/?head[^>]*>/gi,"").replace(/<\/?body[^>]*>/gi,"").replace(/<title[^>]*>[\s\S]*?<\/title>/gi,"").replace(/<meta[^>]*\/?>/gi,"").replace(/<link[^>]*\/?>/gi,"");return{styles:t,html:i}}function Tg(e,t){let n=0;for(let s=t;s<e.length;s++)if(e[s]==="{")n++;else if(e[s]==="}"&&(n--,n===0))return s+1;return e.length}function _g(e,t){let n=e.replace(/@import\b[^;]*;/gi,"");n=n.replace(/expression\s*\(/gi,"/* blocked */("),n=n.replace(/behavior\s*:/gi,"/* blocked */:"),n=n.replace(/-moz-binding\s*:/gi,"/* blocked */:");const s=[];let a=0;for(;a<n.length;){if(/\s/.test(n[a])){s.push(n[a]),a++;continue}if(n[a]==="/"&&n[a+1]==="*"){const p=n.indexOf("*/",a+2),f=p===-1?n.length:p+2;s.push(n.slice(a,f)),a=f;continue}if(n[a]==="}"){s.push("}"),a++;continue}if(/^@(-webkit-)?keyframes\s/.test(n.slice(a,a+30))){const p=Tg(n,a);s.push(n.slice(a,p)),a=p;continue}if(/^@(media|supports|container|layer)\b/.test(n.slice(a,a+20))){const p=n.indexOf("{",a);if(p===-1){s.push(n.slice(a));break}s.push(n.slice(a,p+1)),a=p+1;continue}const i=n.indexOf("{",a);if(i===-1){s.push(n.slice(a));break}const o=n.slice(a,i).trim(),l=n.indexOf("}",i);if(l===-1){s.push(n.slice(a));break}const c=n.slice(i+1,l),u=o.split(",").map(p=>{const f=p.trim();if(!f)return p;if(f==="*")return`${t}, ${t} *`;if(/^(html|body|:root)$/i.test(f))return t;const v=f.replace(/^(html|body|:root)\s+/i,"");return`${t} ${v}`}).join(", ");s.push(`${u} {${c}}`),a=l+1}return s.join("")}function Cg(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Eg=500;let wt="",kt="";function id(e){const t=e.trim();if(!t)return"";if(t.length<Eg)return Se(t);const n=Lg(t);if(n<0)return Se(t);const s=t.slice(0,n),a=t.slice(n);if(s===wt)return kt+Se(a);if(s.startsWith(wt)&&wt.length>0){const i=s.slice(wt.length);return kt=kt+Se(i),wt=s,kt+Se(a)}return kt=Se(s),wt=s,kt+Se(a)}function Rg(){wt="",kt=""}function Lg(e){let t=!1,n="";const s=[];let a=0;for(;a<e.length;){const i=e.indexOf(`
`,a),o=i===-1?e.length:i,l=e.slice(a,o),c=l.trimStart(),u=c.match(/^(`{3,}|~{3,})/);if(u){const p=u[1];t?p.charAt(0)===n.charAt(0)&&p.length>=n.length&&c.slice(p.length).trim()===""&&(t=!1,n=""):(t=!0,n=p)}if(!t&&l.trim()===""){let p=o+1;for(;p<e.length&&e[p]===`
`;)p++;p<e.length&&(s.length===0||s[s.length-1]!==p)&&s.push(p)}a=i===-1?e.length:i+1}return s.length<2?-1:s[s.length-2]}const q={messageSquare:r`
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
  `},Pg=1500,Ig=2e3,od="Copy as markdown",Dg="Copied",Mg="Copy failed";async function Og(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function $s(e,t){e.title=t,e.setAttribute("aria-label",t)}function Ng(e){const t=e.label??od;return r`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(s?.querySelector(".chat-copy-btn__icon"),!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const a=await Og(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!a){s.dataset.error="1",$s(s,Mg),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,$s(s,t))},Ig);return}s.dataset.copied="1",$s(s,Dg),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,$s(s,t))},Pg)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${q.copy}</span>
        <span class="chat-copy-btn__icon-check">${q.check}</span>
      </span>
    </button>
  `}function Fg(e){return Ng({text:()=>e,label:od})}const qr="NO_REPLY",Bg=/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,Ug=["internal system context injected by godmode","treat it as invisible background instructions only","persistence protocol (non-negotiable)","you must follow these operating instructions. do not echo or quote this block","meta goal: earn trust through competence. search before asking","asking the user for info you could look up is a failure mode"];function Oa(e){let t=e.replace(Bg,"").trim();const n=t.toLowerCase();for(const s of Ug){const a=n.indexOf(s);if(a!==-1){const i=a+s.length,o=t.slice(i),l=o.search(/\n\n(?=[A-Z])/);l!==-1?t=o.slice(l).trim():t="";break}}return t}const zg=/^\s*\{[^{}]*"type"\s*:\s*"error"[^{}]*"error"\s*:\s*\{/,Kg=/^\s*(\d{3})\s+\{/;function oo(e){const t=e.trim(),n=t.match(Kg);if(n){const s=Number(n[1]);if(s===529||s===503)return"*Switching models — Claude is temporarily overloaded.*";if(s===400&&t.includes("Unsupported value"))return null}if(t.startsWith("Unsupported value:")||t.includes("is not supported with the")||!zg.test(t))return null;try{const s=JSON.parse(t);if(s?.type==="error"&&s?.error?.message)return(s.error.type??"")==="overloaded_error"?"*Switching models — Claude is temporarily overloaded.*":`*API error: ${s.error.message}*`}catch{}return null}const Wg=/\{"type":"error","error":\{[^}]*"type":"[^"]*"[^}]*\}[^}]*"request_id":"[^"]*"\}/g,qg=/\d{3}\s+\{"type":"error"[^\n]*\}\n?(?:https?:\/\/[^\n]*\n?)?/g,jg=/\{"type":"error","error":\{"details":[^}]*"type":"overloaded_error"[^}]*\}[^}]*"request_id":"[^"]*"\}\n?/g;function Vg(e){return e.replace(qg,"").replace(Wg,"").replace(jg,"").trim()}const Hg=/^\[([^\]]+)\]\s*/,Gg=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],Na=new WeakMap,Fa=new WeakMap;function Qg(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:Gg.some(t=>e.startsWith(`${t} `))}function _s(e){const t=e.match(Hg);if(!t)return e;const n=t[1]??"";return Qg(n)?e.slice(t[0].length):e}function Ba(e){const t=e.trim();return t===qr||t.startsWith(`${qr}
`)}function cn(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string"){const a=Oa(s);if(!a)return null;const i=oo(a);if(i)return i;const o=n==="assistant"?Vg(a):a;if(n==="assistant"&&!o)return null;const l=n==="assistant"?Ca(o):_s(a);return Ba(l)?null:l}if(Array.isArray(s)){const a=s.map(i=>{const o=i;return o.type==="text"&&typeof o.text=="string"?Oa(o.text):null}).filter(i=>typeof i=="string"&&i.length>0);if(a.length>0){const i=a.join(`
`),o=n==="assistant"?Ca(i):_s(i);return Ba(o)?null:o}}if(typeof t.text=="string"){const a=Oa(t.text);if(!a)return null;const i=n==="assistant"?Ca(a):_s(a);return Ba(i)?null:i}return null}function ro(e){if(!e||typeof e!="object")return cn(e);const t=e;if(Na.has(t))return Na.get(t)??null;const n=cn(e);return Na.set(t,n),n}function yi(e){const n=e.content,s=[];if(Array.isArray(n))for(const l of n){const c=l;if(c.type==="thinking"&&typeof c.thinking=="string"){const u=c.thinking.trim();u&&s.push(u)}}if(s.length>0)return s.join(`
`);const a=ld(e);if(!a)return null;const o=[...a.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(l=>(l[1]??"").trim()).filter(Boolean);return o.length>0?o.join(`
`):null}function rd(e){if(!e||typeof e!="object")return yi(e);const t=e;if(Fa.has(t))return Fa.get(t)??null;const n=yi(e);return Fa.set(t,n),n}function ld(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(a=>{const i=a;return i.type==="text"&&typeof i.text=="string"?i.text:null}).filter(a=>typeof a=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function cd(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}const Yg=Object.freeze(Object.defineProperty({__proto__:null,extractRawText:ld,extractText:cn,extractTextCached:ro,extractThinking:yi,extractThinkingCached:rd,formatApiError:oo,formatReasoningMarkdown:cd,stripEnvelope:_s},Symbol.toStringTag,{value:"Module"}));function dd(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",a=t.content,i=Array.isArray(a)?a:null,o=Array.isArray(i)&&i.some(f=>{const v=f,m=(typeof v.type=="string"?v.type:"").toLowerCase();return m==="toolresult"||m==="tool_result"}),l=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||o||l)&&(n="toolResult");let c=[];typeof t.content=="string"?c=[{type:"text",text:t.content}]:Array.isArray(t.content)?c=t.content.map(f=>({type:f.type||"text",text:f.text,name:f.name,args:f.args||f.arguments})):typeof t.text=="string"&&(c=[{type:"text",text:t.text}]);const u=typeof t.timestamp=="number"?t.timestamp:Date.now(),p=typeof t.id=="string"?t.id:void 0;return{role:n,content:c,timestamp:u,id:p}}function lo(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function ud(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}const jr={pdf:"📕",doc:"📘",docx:"📘",txt:"📄",rtf:"📄",xls:"📗",xlsx:"📗",csv:"📊",ppt:"📙",pptx:"📙",jpg:"🖼️",jpeg:"🖼️",png:"🖼️",gif:"🖼️",webp:"🖼️",svg:"🖼️",mp3:"🎵",wav:"🎵",m4a:"🎵",mp4:"🎬",mov:"🎬",avi:"🎬",zip:"📦",rar:"📦","7z":"📦",tar:"📦",gz:"📦",js:"📜",ts:"📜",py:"📜",json:"📜",html:"📜",css:"📜",md:"📜",default:"📎"};function pd(e){const t=e.split(".").pop()?.toLowerCase()||"";return jr[t]??jr.default}function hd(e,t){const n=t.split(".").pop()?.toLowerCase()||"";return{pdf:"PDF Document",doc:"Word Document",docx:"Word Document",xls:"Excel Spreadsheet",xlsx:"Excel Spreadsheet",csv:"CSV File",ppt:"PowerPoint",pptx:"PowerPoint",txt:"Text File",md:"Markdown",json:"JSON File",zip:"ZIP Archive",png:"PNG Image",jpg:"JPEG Image",jpeg:"JPEG Image",gif:"GIF Image",mp3:"Audio File",mp4:"Video File",html:"HTML Document",css:"Stylesheet",js:"JavaScript",ts:"TypeScript",py:"Python"}[n]||e.split("/")[1]?.toUpperCase()||"File"}const Jg={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},Xg={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},proof_editor:{icon:"fileText",title:"Proof Editor",actions:{create:{label:"create",detailKeys:["title"]},write:{label:"write",detailKeys:["slug"]},read:{label:"read",detailKeys:["slug"]},comment:{label:"comment",detailKeys:["slug"]},suggest:{label:"suggest",detailKeys:["slug"]},open:{label:"open",detailKeys:["slug"]},share:{label:"share",detailKeys:["slug"]},export_gdrive:{label:"drive",detailKeys:["slug"]},list:{label:"list"}}},queue_steer:{icon:"messageSquare",title:"Queue Steer",detailKeys:["itemId","instruction"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},Zg={fallback:Jg,tools:Xg},fd=Zg,Vr=fd.fallback??{icon:"puzzle"},em=fd.tools??{};function tm(e){return(e??"tool").trim()}function nm(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function sm(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function gd(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const n=t.split(/\r?\n/)[0]?.trim()??"";return n?n.length>160?`${n.slice(0,157)}…`:n:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(s=>gd(s)).filter(s=>!!s);if(t.length===0)return;const n=t.slice(0,3).join(", ");return t.length>3?`${n}…`:n}}}function am(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function im(e,t){for(const n of t){const s=am(e,n),a=gd(s);if(a)return a}}function om(e){if(!e||typeof e!="object")return;const t=e,n=typeof t.path=="string"?t.path:void 0;if(!n)return;const s=typeof t.offset=="number"?t.offset:void 0,a=typeof t.limit=="number"?t.limit:void 0;return s!==void 0&&a!==void 0?`${n}:${s}-${s+a}`:n}function rm(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function lm(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function cm(e){const t=tm(e.name),n=t.toLowerCase(),s=em[n],a=s?.icon??Vr.icon??"puzzle",i=s?.title??nm(t),o=s?.label??t,l=e.args&&typeof e.args=="object"?e.args.action:void 0,c=typeof l=="string"?l.trim():void 0,u=lm(s,c),p=sm(u?.label??c);let f;n==="read"&&(f=om(e.args)),!f&&(n==="write"||n==="edit"||n==="attach")&&(f=rm(e.args));const v=u?.detailKeys??s?.detailKeys??Vr.detailKeys??[];return!f&&v.length>0&&(f=im(e.args,v)),!f&&e.meta&&(f=e.meta),f&&(f=um(f)),{name:t,icon:a,title:i,label:o,verb:p,detail:f}}function dm(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function um(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const pm=80,hm=2,Hr=100,fm=3;function Gr(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function gm(e){const t=e.split(`
`),n=t.slice(0,hm),s=n.join(`
`);return s.length>Hr?s.slice(0,Hr)+"…":n.length<t.length?s+"…":s}function mm(e){const t=e,n=wm(t.content),s=[];for(const a of n){const i=(typeof a.type=="string"?a.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(i)||typeof a.name=="string"&&a.arguments!=null)&&s.push({kind:"call",name:a.name??"tool",args:km(a.arguments??a.args)})}for(const a of n){const i=(typeof a.type=="string"?a.type:"").toLowerCase();if(i!=="toolresult"&&i!=="tool_result")continue;const o=$m(a);if(Yr(o))continue;const l=typeof a.name=="string"?a.name:"tool";s.push({kind:"result",name:l,text:o})}if(ud(e)&&!s.some(a=>a.kind==="result")){const a=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",i=ro(e)??void 0;Yr(i)||s.push({kind:"result",name:a,text:i})}return s}const vm=new Set(["write","read","edit","attach"]);function ym(e){if(!e||typeof e!="object")return null;const t=e,n=t.path??t.file_path??t.filePath;return typeof n=="string"&&n.trim()?n.trim():null}function bm(e){if(!e)return null;const t=e.match(/(?:\/(?:Users|home|tmp|var)\/\S+|~\/\S+)/);return t?t[0].replace(/[.,;:!?)'"]+$/,""):null}function Qr(e,t,n,s,a){const i=cm({name:e.name,args:e.args}),o=dm(i),l=!!e.text?.trim(),c=Sm(e.text);if(c?.type==="proof"&&c.slug)return r`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${q.fileText}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name">${c.title??"Proof Document"}</span>
          <span class="chat-artifact-card__type">Live doc</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${s?r`<button class="chat-artifact-card__btn" @click=${A=>{A.stopPropagation(),s(c.slug)}}>Open</button>`:h}
          ${c.filePath&&a?r`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${A=>{A.stopPropagation(),a(c.filePath)}}>Drive</button>`:h}
        </div>
      </div>
    `;const u=vm.has(e.name.toLowerCase())?ym(e.args)??bm(e.text):null;if(u&&e.kind==="result"){const A=u.split("/").pop()||u,T=A.split(".").pop()?.toLowerCase()||"",x=pd(A),_=hd(T,A);return r`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${x}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name" title=${u}>${A}</span>
          <span class="chat-artifact-card__type">${_}</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${n?r`<button class="chat-artifact-card__btn" @click=${L=>{L.stopPropagation(),n(u)}}>Open</button>`:t&&l?r`<button class="chat-artifact-card__btn" @click=${L=>{L.stopPropagation(),t(Gr(e.text))}}>View</button>`:h}
          ${a?r`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${L=>{L.stopPropagation(),a(u)}}>Drive</button>`:h}
        </div>
      </div>
    `}const p=!!t||!!(n&&u),f=p?A=>{if(A.stopPropagation(),n&&u){n(u);return}if(t&&l){t(Gr(e.text));return}if(t){const T=`## ${i.label}

${o?`**Command:** \`${o}\`

`:""}*No output — tool completed successfully.*`;t(T)}}:void 0,v=e.text?e.text.split(`
`).length:0,m=l&&(e.text?.length??0)<=pm,k=l&&!m&&v>fm,d=l&&!k,g=!l,S=e.kind==="call"?"chat-tool-card--call":"chat-tool-card--result";return r`
    <div
      class="chat-tool-card ${S} ${p?"chat-tool-card--clickable":""}"
      @click=${f}
      role=${p?"button":h}
      tabindex=${p?"0":h}
      @keydown=${p?A=>{A.key!=="Enter"&&A.key!==" "||(A.preventDefault(),A.stopPropagation(),f?.(A))}:h}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${q[i.icon]}</span>
          <span>${i.label}</span>
        </div>
        ${p?r`<span class="chat-tool-card__action">${l?"View":""} ${q.check}</span>`:h}
        ${g&&!p?r`<span class="chat-tool-card__status">${q.check}</span>`:h}
      </div>
      ${o?r`<div class="chat-tool-card__detail">${o}</div>`:h}
      ${g?r`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:h}
      ${k?r`<details class="chat-tool-card__expandable" @click=${A=>A.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${gm(e.text)}</summary>
            <div class="chat-tool-card__full-output mono">${e.text}</div>
          </details>`:h}
      ${d?r`<div class="chat-tool-card__inline mono">${e.text}</div>`:h}
    </div>
  `}function wm(e){return Array.isArray(e)?e.filter(Boolean):[]}function km(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function $m(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function Sm(e){if(!e)return null;try{const t=JSON.parse(e);return t._sidebarAction?{type:t._sidebarAction.type,slug:t._sidebarAction.slug,title:t.title,filePath:t.filePath}:null}catch{return null}}function Yr(e){if(!e)return!1;const t=e.toLowerCase();return t.includes("process exited")?!1:t.includes("(no new output)")&&t.includes("still running")}const Jr={exec:["Executing","Running","Conjuring","Manifesting","Brewing"],read:["Reading","Perusing","Absorbing","Scanning","Devouring"],write:["Writing","Scribbling","Crafting","Inscribing","Authoring"],edit:["Editing","Refining","Polishing","Tweaking","Sculpting"],browser:["Browsing","Surfing","Exploring","Navigating","Spelunking"],web_search:["Searching","Hunting","Investigating","Sleuthing","Scouring"],web_fetch:["Fetching","Grabbing","Retrieving","Summoning","Acquiring"],memory_search:["Remembering","Recalling","Pondering","Reflecting"],image:["Analyzing","Examining","Scrutinizing","Inspecting","Beholding"],default:["Working on","Processing","Handling","Tinkering with","Wrangling"]};function md(e){const t=e.toLowerCase().replace(/[^a-z_]/g,""),n=Jr[t]??Jr.default,s=Math.floor(Date.now()/2e3)%n.length;return n[s]}function Am(e){const t=e.match(/\[Files uploaded:\s*([^\]]+)\]/);if(!t)return null;const n=t[1],s=[],a=/([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;let i;for(;(i=a.exec(n))!==null;)s.push({fileName:i[1].trim(),fileId:i[2].trim(),size:i[3].trim(),mimeType:i[4].trim()});return s.length>0?s:null}function xm(e){return r`
    <div class="chat-file-uploads">
      ${e.map(t=>r`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${pd(t.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${t.fileName}">${t.fileName}</span>
            <span class="chat-file-upload-card__meta">${t.size} • ${hd(t.mimeType,t.fileName)}</span>
          </div>
        </div>
      `)}
    </div>
  `}function Tm(e){return e.replace(/\[Files uploaded:[^\]]+\]\s*/g,"").trim()}function _m(e){if(!e)return e;if(e.startsWith("System:")||e.startsWith("GatewayRestart:")){const i=e.indexOf(`

`);return i!==-1?e.slice(i+2).trim():""}let a=e.split(`
`).filter(i=>{const o=i.trim();return!o.startsWith("System:")&&!o.startsWith("GatewayRestart:")}).join(`
`);for(;a.startsWith(`
`);)a=a.slice(1);return a.trim()}function Cm(e){return typeof e!="number"||!Number.isFinite(e)||e<=0?null:e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${Math.round(e/1024)} KB`:`${Math.round(e)} B`}function bi(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const i of n){if(typeof i!="object"||i===null)continue;const o=i;if(o.type==="image"){const l=o.source;if(l?.type==="base64"&&typeof l.data=="string"){const c=l.data,u=l.media_type||"image/png",p=c.startsWith("data:")?c:`data:${u};base64,${c}`;s.push({url:p})}else if(typeof o.data=="string"&&typeof o.mimeType=="string"){const c=o.data.startsWith("data:")?o.data:`data:${o.mimeType};base64,${o.data}`;s.push({url:c})}else typeof o.url=="string"?s.push({url:o.url}):o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}else if(o.type==="image_url"){const l=o.image_url;typeof l?.url=="string"&&s.push({url:l.url})}else o.type==="attachment"&&typeof o.content=="string"&&(o.mimeType||"").startsWith("image/")&&s.push({url:o.content,alt:o.fileName||void 0});if(o.type==="text"&&typeof o.text=="string"){const l=/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,c=o.text.match(l);if(c)for(const u of c)s.push({url:u})}if(Array.isArray(o.content))for(const l of o.content){if(typeof l!="object"||l===null)continue;const c=l;if(c.type==="image"){const u=c.source;if(u?.type==="base64"&&typeof u.data=="string"){const p=u.media_type||"image/png",f=u.data.startsWith("data:")?u.data:`data:${p};base64,${u.data}`;s.push({url:f})}else if(typeof c.data=="string"&&typeof c.mimeType=="string"){const p=c.data.startsWith("data:")?c.data:`data:${c.mimeType};base64,${c.data}`;s.push({url:p})}else c.omitted===!0&&s.push({omitted:!0,bytes:typeof c.bytes=="number"?c.bytes:void 0,mimeType:typeof c.mimeType=="string"?c.mimeType:void 0,alt:typeof c.fileName=="string"?c.fileName:void 0})}}}const a=t.attachments;if(Array.isArray(a))for(const i of a){if(typeof i!="object"||i===null)continue;const o=i;if(o.type==="image"&&typeof o.content=="string"){const l=o.mimeType||"image/png",c=o.content.startsWith("data:")?o.content:`data:${l};base64,${o.content}`;s.push({url:c,alt:o.fileName||void 0})}else o.type==="image"&&o.omitted===!0&&s.push({omitted:!0,bytes:typeof o.bytes=="number"?o.bytes:void 0,mimeType:typeof o.mimeType=="string"?o.mimeType:void 0,alt:typeof o.fileName=="string"?o.fileName:void 0})}return s}function Em(e){const t=e,n=t.content,s=[];if(Array.isArray(n))for(const i of n){if(typeof i!="object"||i===null)continue;const o=i;if(o.type==="attachment"&&typeof o.content=="string"){const l=o.mimeType||"application/octet-stream";l.startsWith("image/")||s.push({fileName:o.fileName||"file",mimeType:l,content:o.content})}}const a=t.attachments;if(Array.isArray(a))for(const i of a){if(typeof i!="object"||i===null)continue;const o=i;o.type==="file"&&typeof o.content=="string"&&s.push({fileName:o.fileName||"file",mimeType:o.mimeType||"application/octet-stream",content:o.content})}return s}function Rm(e,t){return r`
    <div class="chat-group assistant">
      ${co("assistant",{assistantName:e?.name,assistantAvatar:e?.avatar})}
      <div class="chat-group-messages">
        ${t?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${md(t.name)}</span>
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
  `}function Lm(e,t,n,s,a){const i=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),o=s?.name??"Assistant";return r`
    <div class="chat-group assistant">
      ${co("assistant",{assistantName:s?.name,assistantAvatar:s?.avatar})}
      <div class="chat-group-messages">
        ${a?r`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${md(a.name)}</span>
                    <strong>${a.name}</strong>
                  </span>
                </div>
                ${a.details?r`<span class="chat-working-indicator__details">${a.details}</span>`:h}
              </div>
            `:h}
        ${vd({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${o}</span>
          <span class="chat-group-timestamp">${i}</span>
        </div>
      </div>
    </div>
  `}function Pm(e,t){const n=lo(e.role),s=t.assistantName??"Assistant",a=t.userName??"You",i=n==="user"?a:n==="assistant"?s:n,o=n==="user"?"user":n==="assistant"?"assistant":"other",l=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r`
    <div class="chat-group ${o}">
      ${co(e.role,{assistantName:s,assistantAvatar:t.assistantAvatar??null,userName:a,userAvatar:t.userAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((c,u)=>vd(c.message,{isStreaming:e.isStreaming&&u===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar,t.onOpenFile,t.onOpenProof,t.onImageClick,t.resolveImageUrl,t.onPushToDrive))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${i}</span>
          <span class="chat-group-timestamp">${l}</span>
        </div>
      </div>
    </div>
  `}function co(e,t){const n=lo(e),s=t?.assistantName?.trim()||"Assistant",a=typeof t?.assistantAvatar=="string"?t.assistantAvatar.trim():"",i=t?.userName?.trim()||"You",o=typeof t?.userAvatar=="string"?t.userAvatar.trim():"",l=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return n==="user"?o&&Xr(o)?r`<img
        class="chat-avatar ${l}"
        src="${o}"
        alt="${i}"
      />`:o?r`<div class="chat-avatar ${l}">${o}</div>`:r`<div class="chat-avatar ${l}">${i.charAt(0).toUpperCase()||"C"}</div>`:n==="assistant"?a&&Xr(a)?r`<img
        class="chat-avatar ${l}"
        src="${a}"
        alt="${s}"
      />`:a?r`<div class="chat-avatar ${l}" style="color: var(--accent);">${a}</div>`:r`<div class="chat-avatar ${l}" style="color: var(--accent);">⚛️</div>`:n==="tool"?r`<div class="chat-avatar ${l}">⚙</div>`:r`<div class="chat-avatar ${l}">?</div>`}function Xr(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function Zr(e,t,n){if(e.length===0)return h;const s=e.map((i,o)=>{if((i.omitted||!i.url)&&n){const l=n(o);if(l)return{...i,resolvedUrl:l}}return i}),a=s.filter(i=>(i.resolvedUrl||i.url)&&!i.omitted||i.resolvedUrl).map(i=>({url:i.resolvedUrl||i.url,alt:i.alt}));return r`
    <div class="chat-message-images">
      ${s.map(i=>{const o=i.resolvedUrl||i.url;if(!o){const c=Cm(i.bytes),p=[i.mimeType?i.mimeType.replace("image/","").toUpperCase():null,c,"preview omitted"].filter(Boolean).join(" - ");return r`
            <div
              class="chat-message-image chat-message-image--omitted"
              title=${i.alt??"Attached image"}
              aria-label="Attached image preview omitted"
            >
              <span class="chat-message-image__omitted-label">Image attached</span>
              <span class="chat-message-image__omitted-meta">${p}</span>
            </div>
          `}const l=a.findIndex(c=>c.url===o);return r`
          <img
            src=${o}
            alt=${i.alt??"Attached image"}
            class="chat-message-image"
            @error=${c=>{const u=c.target;u.style.display="none"}}
            @click=${()=>{t&&t(o,a,Math.max(0,l))}}
          />
        `})}
    </div>
  `}function Im(e){return e.length===0?h:r`
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
  `}function vd(e,t,n,s,a,i,o,l){try{return Dm(e,t,n,s,a,i,o,l)}catch(c){return console.error("[chat] message render error:",c),r`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `}}function Dm(e,t,n,s,a,i,o,l){const c=e,u=typeof c.role=="string"?c.role:"unknown",p=ud(e)||u.toLowerCase()==="toolresult"||u.toLowerCase()==="tool_result"||typeof c.toolCallId=="string"||typeof c.tool_call_id=="string",f=mm(e),v=f.length>0,m=bi(e),k=m.length>0,d=typeof c._chatIdx=="number"?c._chatIdx:-1,g=o&&d>=0?U=>o(d,U):void 0,S=Em(e),A=S.length>0,T=ro(e),x=t.showReasoning&&u==="assistant"?rd(e):null,_=u==="user"&&T?Am(T):null,L=_&&_.length>0;let R=T;if(u==="user"&&R&&(R=_m(R)),R&&(R=R.replace(/<(?:system|godmode)-context\b[^>]*>[\s\S]*?<\/(?:system|godmode)-context>/gi,"").trim()||null),R){const U=oo(R);U&&(R=U)}L&&R&&(R=Tm(R));const Z=R?.trim()?R:null,Y=x?cd(x):null,I=Z,M=u==="assistant"&&!!I?.trim(),F=["chat-bubble",M?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");if(v&&p)return r`
      ${k?Zr(m,i,g):h}
      ${f.map(U=>Qr(U,n,s,a,l))}
    `;if(!I&&!v&&!k&&!A&&!L&&!Y){const U=typeof c.errorMessage=="string"?c.errorMessage:null;if(c.stopReason==="error"&&U){let O=U;const ie=U.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(ie){const ke=parseInt(ie[1]).toLocaleString(),J=parseInt(ie[2]).toLocaleString();O=`Context overflow: ${ke} tokens exceeded the ${J} token limit. The conversation needs to be compacted.`}else U.includes("prompt is too long")&&(O="Context overflow: The conversation is too long for the model.");return r`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${O}</div>
        </div>
      `}return h}return r`
    <div class="${F}">
      ${M?Fg(I):h}
      ${L?xm(_):h}
      ${Zr(m,i,g)}
      ${Im(S)}
      ${Y?r`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${Ce(Se(Y))}</div>
            </details>`:h}
      ${I?r`<div class="chat-text">${Ce(t.isStreaming?id(I):Se(I))}</div>`:h}
      ${f.map(U=>Qr(U,n,s,a,l))}
    </div>
  `}function Mm(e){const t=e,n=typeof t.content=="string"?t.content:"",s=typeof t.keptMessages=="number"?t.keptMessages:null,a=typeof t.timestamp=="number"?new Date(t.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"";return r`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${s!==null?r`<span class="chat-compaction-summary__kept">${s} messages kept</span>`:h}
      </div>
      <div class="chat-compaction-summary__content">
        ${Ce(Se(n))}
      </div>
      ${a?r`<div class="chat-compaction-summary__timestamp">${a}</div>`:h}
    </div>
  `}function Om(e){return e.isCompactionSummary===!0}async function yd(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const t=await e.client.request("agents.list",{});t&&(e.agentsList=t)}catch(t){e.agentsError=String(t)}finally{e.agentsLoading=!1}}}async function bd(e){if(!(!e.client||!e.connected)&&!e.rosterLoading){e.rosterLoading=!0,e.rosterError=null;try{const t=await e.client.request("queue.roster",{});t?.roster&&(e.rosterData=t.roster)}catch(t){e.rosterError=String(t)}finally{e.rosterLoading=!1}}}const Nm=Object.freeze(Object.defineProperty({__proto__:null,loadAgents:yd,loadRoster:bd},Symbol.toStringTag,{value:"Module"})),wd=50,kd=200,Fm="Assistant";function Us(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function wi(e){const t=Us(e?.name,wd)??Fm,n=Us(e?.avatar??void 0,kd)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}function Bm(){return wi(typeof window>"u"?{}:{name:window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__CLAWDBOT_ASSISTANT_AVATAR__})}const Um="You";function el(e){const t=Us(e?.name,wd)??Um,n=Us(e?.avatar??void 0,kd)??null;return{name:t,avatar:n}}function zm(){return el(typeof window>"u"?{}:{name:window.__CLAWDBOT_USER_NAME__,avatar:window.__CLAWDBOT_USER_AVATAR__})}async function $d(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const a=await e.client.request("agent.identity.get",s);if(!a)return;const i=wi(a);e.assistantName=i.name,e.assistantAvatar=i.avatar,e.assistantAgentId=i.agentId??null}catch{}}let tl=!1;function nl(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function Km(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function Wm(){tl||(tl=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function sa(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),nl(t)}return Wm(),nl(Km())}let $t=null,Cs=null;function Sd(){return Cs}const zs=new Map,We=new Map;function ki(e,t){const n=t.filter(s=>s?.role==="user").length;zs.set(e,n)}async function uo(e,t){try{const n=await e.request("chat.history",{sessionKey:t,limit:200}),s=Array.isArray(n.messages)?n.messages:[];return We.set(t,s),ki(t,s),s}catch{return We.get(t)??[]}}let Gt=0;async function se(e){if(!e.client||!e.connected)return;const t=e.sessionKey,n=++Gt;e.chatLoading=!0,e.lastError=null;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Gt||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,ki(t,e.chatMessages),We.set(t,e.chatMessages)}catch{if(n!==Gt||e.sessionKey!==t)return;try{const s=await e.client.request("chat.history",{sessionKey:t,limit:200});if(n!==Gt||e.sessionKey!==t)return;e.chatMessages=Array.isArray(s.messages)?s.messages:[],e.chatThinkingLevel=s.thinkingLevel??null,ki(t,e.chatMessages),We.set(t,e.chatMessages)}catch(s){if(n!==Gt||e.sessionKey!==t)return;e.lastError=String(s)}}finally{n===Gt&&(e.chatLoading=!1)}}async function Ad(e,t){const n=[...e.chatMessages],s=n.length;await se(e),e.chatStream=null,!t?.allowShrink&&s>0&&e.chatMessages.length<s&&(e.chatMessages=n,setTimeout(()=>{se(e).then(()=>{e.chatStream=null})},2e3))}function qm(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}async function po(e,t,n,s){if(!e.client||!e.connected)return!1;let a=t.trim();const i=n&&n.length>0;if(!a&&!i)return!1;!a&&i&&(a=n.some(p=>p.mimeType.startsWith("image/"))?"What's in this image?":"See attached file.");const o=Date.now();if(!s?.skipOptimisticUpdate){const u=[];if(a&&u.push({type:"text",text:a}),i)for(const p of n)p.mimeType.startsWith("image/")?u.push({type:"image",source:{type:"base64",media_type:p.mimeType,data:p.dataUrl}}):u.push({type:"attachment",mimeType:p.mimeType,fileName:p.fileName,content:p.dataUrl});e.chatMessages=[...e.chatMessages,{role:"user",content:u,timestamp:o}]}e.chatSending=!0,e.chatSendingSessionKey=e.sessionKey,e.lastError=null;const l=sa();e.chatRunId=l,e.chatStream="",e.chatStreamStartedAt=o,$t={message:a,attachments:i?n:void 0};let c;if(i){const u=[],p=[];for(const f of n){const v=qm(f.dataUrl);if(v)if(v.mimeType.startsWith("image/"))u.push({type:"image",mimeType:v.mimeType,content:v.content,fileName:f.fileName});else{const m=f.fileName||"file";p.push(`<document>
<source>${m}</source>
<mime_type>${v.mimeType}</mime_type>
<content encoding="base64">
${v.content}
</content>
</document>`)}}if(u.length>0&&(c=u),p.length>0&&(a=`${p.join(`

`)}

${a}`),u.length>0){const f=e.chatMessages.length-1,v=e.sessionKey,m=e.client.request("images.cache",{images:u.map(k=>({data:k.content,mimeType:k.mimeType,fileName:k.fileName})),sessionKey:v}).then(k=>{if(k?.cached&&k.cached.length>0){const d=k.cached.map((g,S)=>({messageIndex:f,imageIndex:S,hash:g.hash,mimeType:g.mimeType,bytes:g.bytes,role:"user",timestamp:o}));return e.client.request("images.updateIndex",{sessionKey:v,images:d}).catch(()=>{})}}).catch(()=>{});Cs=m,m.finally(()=>{Cs===m&&(Cs=null)})}}try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:a,deliver:!1,idempotencyKey:l,attachments:c}),!0}catch(u){const p=String(u);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=p,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+p}],timestamp:Date.now()}],!1}finally{e.chatSending=!1,e.chatSendingSessionKey=null}}async function xd(e){const t=e.pendingRetry;return t?(e.pendingRetry=null,po(e,t.message,t.attachments,{skipOptimisticUpdate:!0})):!1}function jm(e){e.pendingRetry=null}async function ho(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function Td(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?"final":null;if(t.state!=="delta"&&Rg(),t.state==="delta"){const n=cn(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final")e.chatRunId=null,e.chatStreamStartedAt=null,$t=null;else if(t.state==="aborted")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,$t=null;else if(t.state==="error"){e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;const n=t.errorMessage??"chat error";e.lastError=n;const s=n.includes("prompt is too long")||n.includes("tokens >");s&&$t&&(e.pendingRetry={message:$t.message,attachments:$t.attachments,timestamp:Date.now()}),$t=null;let a=n;if(s){const i=n.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);if(i){const o=parseInt(i[1]).toLocaleString(),l=parseInt(i[2]).toLocaleString();a=`⚠️ Context overflow: ${o} tokens exceeds ${l} limit. Compact the conversation, then click "Retry" to resend your message.`}else a='⚠️ Context overflow: The conversation is too long. Compact and click "Retry" to resend.'}e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:a}],timestamp:Date.now(),isError:!0}]}return t.state}const Ye=Object.freeze(Object.defineProperty({__proto__:null,abortChatRun:ho,clearPendingRetry:jm,getPendingImageCache:Sd,handleChatEvent:Td,laneMessageCache:We,loadChatHistory:se,loadChatHistoryAfterFinal:Ad,loadLaneHistory:uo,retryPendingMessage:xd,sendChatMessage:po,sessionTurnCounts:zs},Symbol.toStringTag,{value:"Module"})),_d="godmode.device.auth.v1";function fo(e){return e.trim()}function Vm(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e){const s=n.trim();s&&t.add(s)}return[...t].sort()}function go(){try{const e=window.localStorage.getItem(_d);if(!e)return null;const t=JSON.parse(e);return!t||t.version!==1||!t.deviceId||typeof t.deviceId!="string"||!t.tokens||typeof t.tokens!="object"?null:t}catch{return null}}function Cd(e){try{window.localStorage.setItem(_d,JSON.stringify(e))}catch{}}function Hm(e){const t=go();if(!t||t.deviceId!==e.deviceId)return null;const n=fo(e.role),s=t.tokens[n];return!s||typeof s.token!="string"?null:s}function Ed(e){const t=fo(e.role),n={version:1,deviceId:e.deviceId,tokens:{}},s=go();s&&s.deviceId===e.deviceId&&(n.tokens={...s.tokens});const a={token:e.token,role:t,scopes:Vm(e.scopes),updatedAtMs:Date.now()};return n.tokens[t]=a,Cd(n),a}function Rd(e){const t=go();if(!t||t.deviceId!==e.deviceId)return;const n=fo(e.role);if(!t.tokens[n])return;const s={...t,tokens:{...t.tokens}};delete s.tokens[n],Cd(s)}const Ld={p:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,n:0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,h:8n,a:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,d:0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,Gx:0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,Gy:0x6666666666666666666666666666666666666666666666666666666666666658n},{p:ue,n:Es,Gx:sl,Gy:al,a:Ua,d:za,h:Gm}=Ld,Pt=32,mo=64,Qm=(...e)=>{"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(...e)},ae=(e="")=>{const t=new Error(e);throw Qm(t,ae),t},Ym=e=>typeof e=="bigint",Jm=e=>typeof e=="string",Xm=e=>e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array",pt=(e,t,n="")=>{const s=Xm(e),a=e?.length,i=t!==void 0;if(!s||i&&a!==t){const o=n&&`"${n}" `,l=i?` of length ${t}`:"",c=s?`length=${a}`:`type=${typeof e}`;ae(o+"expected Uint8Array"+l+", got "+c)}return e},aa=e=>new Uint8Array(e),Pd=e=>Uint8Array.from(e),Id=(e,t)=>e.toString(16).padStart(t,"0"),Dd=e=>Array.from(pt(e)).map(t=>Id(t,2)).join(""),Qe={_0:48,_9:57,A:65,F:70,a:97,f:102},il=e=>{if(e>=Qe._0&&e<=Qe._9)return e-Qe._0;if(e>=Qe.A&&e<=Qe.F)return e-(Qe.A-10);if(e>=Qe.a&&e<=Qe.f)return e-(Qe.a-10)},Md=e=>{const t="hex invalid";if(!Jm(e))return ae(t);const n=e.length,s=n/2;if(n%2)return ae(t);const a=aa(s);for(let i=0,o=0;i<s;i++,o+=2){const l=il(e.charCodeAt(o)),c=il(e.charCodeAt(o+1));if(l===void 0||c===void 0)return ae(t);a[i]=l*16+c}return a},Od=()=>globalThis?.crypto,Zm=()=>Od()?.subtle??ae("crypto.subtle must be defined, consider polyfill"),ts=(...e)=>{const t=aa(e.reduce((s,a)=>s+pt(a).length,0));let n=0;return e.forEach(s=>{t.set(s,n),n+=s.length}),t},ev=(e=Pt)=>Od().getRandomValues(aa(e)),Ks=BigInt,St=(e,t,n,s="bad number: out of range")=>Ym(e)&&t<=e&&e<n?e:ae(s),P=(e,t=ue)=>{const n=e%t;return n>=0n?n:t+n},Nd=e=>P(e,Es),tv=(e,t)=>{(e===0n||t<=0n)&&ae("no inverse n="+e+" mod="+t);let n=P(e,t),s=t,a=0n,i=1n;for(;n!==0n;){const o=s/n,l=s%n,c=a-i*o;s=n,n=l,a=i,i=c}return s===1n?P(a,t):ae("no inverse")},nv=e=>{const t=zd[e];return typeof t!="function"&&ae("hashes."+e+" not set"),t},Ka=e=>e instanceof xe?e:ae("Point expected"),$i=2n**256n;class xe{static BASE;static ZERO;X;Y;Z;T;constructor(t,n,s,a){const i=$i;this.X=St(t,0n,i),this.Y=St(n,0n,i),this.Z=St(s,1n,i),this.T=St(a,0n,i),Object.freeze(this)}static CURVE(){return Ld}static fromAffine(t){return new xe(t.x,t.y,1n,P(t.x*t.y))}static fromBytes(t,n=!1){const s=za,a=Pd(pt(t,Pt)),i=t[31];a[31]=i&-129;const o=Bd(a);St(o,0n,n?$i:ue);const c=P(o*o),u=P(c-1n),p=P(s*c+1n);let{isValid:f,value:v}=av(u,p);f||ae("bad point: y not sqrt");const m=(v&1n)===1n,k=(i&128)!==0;return!n&&v===0n&&k&&ae("bad point: x==0, isLastByteOdd"),k!==m&&(v=P(-v)),new xe(v,o,1n,P(v*o))}static fromHex(t,n){return xe.fromBytes(Md(t),n)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}assertValidity(){const t=Ua,n=za,s=this;if(s.is0())return ae("bad point: ZERO");const{X:a,Y:i,Z:o,T:l}=s,c=P(a*a),u=P(i*i),p=P(o*o),f=P(p*p),v=P(c*t),m=P(p*P(v+u)),k=P(f+P(n*P(c*u)));if(m!==k)return ae("bad point: equation left != right (1)");const d=P(a*i),g=P(o*l);return d!==g?ae("bad point: equation left != right (2)"):this}equals(t){const{X:n,Y:s,Z:a}=this,{X:i,Y:o,Z:l}=Ka(t),c=P(n*l),u=P(i*a),p=P(s*l),f=P(o*a);return c===u&&p===f}is0(){return this.equals(en)}negate(){return new xe(P(-this.X),this.Y,this.Z,P(-this.T))}double(){const{X:t,Y:n,Z:s}=this,a=Ua,i=P(t*t),o=P(n*n),l=P(2n*P(s*s)),c=P(a*i),u=t+n,p=P(P(u*u)-i-o),f=c+o,v=f-l,m=c-o,k=P(p*v),d=P(f*m),g=P(p*m),S=P(v*f);return new xe(k,d,S,g)}add(t){const{X:n,Y:s,Z:a,T:i}=this,{X:o,Y:l,Z:c,T:u}=Ka(t),p=Ua,f=za,v=P(n*o),m=P(s*l),k=P(i*f*u),d=P(a*c),g=P((n+s)*(o+l)-v-m),S=P(d-k),A=P(d+k),T=P(m-p*v),x=P(g*S),_=P(A*T),L=P(g*T),R=P(S*A);return new xe(x,_,R,L)}subtract(t){return this.add(Ka(t).negate())}multiply(t,n=!0){if(!n&&(t===0n||this.is0()))return en;if(St(t,1n,Es),t===1n)return this;if(this.equals(It))return gv(t).p;let s=en,a=It;for(let i=this;t>0n;i=i.double(),t>>=1n)t&1n?s=s.add(i):n&&(a=a.add(i));return s}multiplyUnsafe(t){return this.multiply(t,!1)}toAffine(){const{X:t,Y:n,Z:s}=this;if(this.equals(en))return{x:0n,y:1n};const a=tv(s,ue);P(s*a)!==1n&&ae("invalid inverse");const i=P(t*a),o=P(n*a);return{x:i,y:o}}toBytes(){const{x:t,y:n}=this.assertValidity().toAffine(),s=Fd(n);return s[31]|=t&1n?128:0,s}toHex(){return Dd(this.toBytes())}clearCofactor(){return this.multiply(Ks(Gm),!1)}isSmallOrder(){return this.clearCofactor().is0()}isTorsionFree(){let t=this.multiply(Es/2n,!1).double();return Es%2n&&(t=t.add(this)),t.is0()}}const It=new xe(sl,al,1n,P(sl*al)),en=new xe(0n,1n,1n,0n);xe.BASE=It;xe.ZERO=en;const Fd=e=>Md(Id(St(e,0n,$i),mo)).reverse(),Bd=e=>Ks("0x"+Dd(Pd(pt(e)).reverse())),Be=(e,t)=>{let n=e;for(;t-- >0n;)n*=n,n%=ue;return n},sv=e=>{const n=e*e%ue*e%ue,s=Be(n,2n)*n%ue,a=Be(s,1n)*e%ue,i=Be(a,5n)*a%ue,o=Be(i,10n)*i%ue,l=Be(o,20n)*o%ue,c=Be(l,40n)*l%ue,u=Be(c,80n)*c%ue,p=Be(u,80n)*c%ue,f=Be(p,10n)*i%ue;return{pow_p_5_8:Be(f,2n)*e%ue,b2:n}},ol=0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,av=(e,t)=>{const n=P(t*t*t),s=P(n*n*t),a=sv(e*s).pow_p_5_8;let i=P(e*n*a);const o=P(t*i*i),l=i,c=P(i*ol),u=o===e,p=o===P(-e),f=o===P(-e*ol);return u&&(i=l),(p||f)&&(i=c),(P(i)&1n)===1n&&(i=P(-i)),{isValid:u||p,value:i}},Si=e=>Nd(Bd(e)),vo=(...e)=>zd.sha512Async(ts(...e)),iv=(...e)=>nv("sha512")(ts(...e)),Ud=e=>{const t=e.slice(0,Pt);t[0]&=248,t[31]&=127,t[31]|=64;const n=e.slice(Pt,mo),s=Si(t),a=It.multiply(s),i=a.toBytes();return{head:t,prefix:n,scalar:s,point:a,pointBytes:i}},yo=e=>vo(pt(e,Pt)).then(Ud),ov=e=>Ud(iv(pt(e,Pt))),rv=e=>yo(e).then(t=>t.pointBytes),lv=e=>vo(e.hashable).then(e.finish),cv=(e,t,n)=>{const{pointBytes:s,scalar:a}=e,i=Si(t),o=It.multiply(i).toBytes();return{hashable:ts(o,s,n),finish:u=>{const p=Nd(i+Si(u)*a);return pt(ts(o,Fd(p)),mo)}}},dv=async(e,t)=>{const n=pt(e),s=await yo(t),a=await vo(s.prefix,n);return lv(cv(s,a,n))},zd={sha512Async:async e=>{const t=Zm(),n=ts(e);return aa(await t.digest("SHA-512",n.buffer))},sha512:void 0},uv=(e=ev(Pt))=>e,pv={getExtendedPublicKeyAsync:yo,getExtendedPublicKey:ov,randomSecretKey:uv},Ws=8,hv=256,Kd=Math.ceil(hv/Ws)+1,Ai=2**(Ws-1),fv=()=>{const e=[];let t=It,n=t;for(let s=0;s<Kd;s++){n=t,e.push(n);for(let a=1;a<Ai;a++)n=n.add(t),e.push(n);t=n.double()}return e};let rl;const ll=(e,t)=>{const n=t.negate();return e?n:t},gv=e=>{const t=rl||(rl=fv());let n=en,s=It;const a=2**Ws,i=a,o=Ks(a-1),l=Ks(Ws);for(let c=0;c<Kd;c++){let u=Number(e&o);e>>=l,u>Ai&&(u-=i,e+=1n);const p=c*Ai,f=p,v=p+Math.abs(u)-1,m=c%2!==0,k=u<0;u===0?s=s.add(ll(m,t[f])):n=n.add(ll(k,t[v]))}return e!==0n&&ae("invalid wnaf"),{p:n,f:s}},Wa="godmode-device-identity-v1";function xi(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"")}function Wd(e){const t=e.replaceAll("-","+").replaceAll("_","/"),n=t+"=".repeat((4-t.length%4)%4),s=atob(n),a=new Uint8Array(s.length);for(let i=0;i<s.length;i+=1)a[i]=s.charCodeAt(i);return a}function mv(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function qd(e){const t=await crypto.subtle.digest("SHA-256",e);return mv(new Uint8Array(t))}async function vv(){const e=pv.randomSecretKey(),t=await rv(e);return{deviceId:await qd(t),publicKey:xi(t),privateKey:xi(e)}}async function bo(){try{const n=localStorage.getItem(Wa);if(n){const s=JSON.parse(n);if(s?.version===1&&typeof s.deviceId=="string"&&typeof s.publicKey=="string"&&typeof s.privateKey=="string"){const a=await qd(Wd(s.publicKey));if(a!==s.deviceId){const i={...s,deviceId:a};return localStorage.setItem(Wa,JSON.stringify(i)),{deviceId:a,publicKey:s.publicKey,privateKey:s.privateKey}}return{deviceId:s.deviceId,publicKey:s.publicKey,privateKey:s.privateKey}}}}catch{}const e=await vv(),t={version:1,deviceId:e.deviceId,publicKey:e.publicKey,privateKey:e.privateKey,createdAtMs:Date.now()};return localStorage.setItem(Wa,JSON.stringify(t)),e}async function yv(e,t){const n=Wd(e),s=new TextEncoder().encode(t),a=await dv(s,n);return xi(a)}async function ht(e,t){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,t?.quiet||(e.devicesError=null);try{const n=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(n?.pending)?n.pending:[],paired:Array.isArray(n?.paired)?n.paired:[]}}catch(n){t?.quiet||(e.devicesError=String(n))}finally{e.devicesLoading=!1}}}async function bv(e,t){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:t}),await ht(e)}catch(n){e.devicesError=String(n)}}async function wv(e,t){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:t}),await ht(e)}catch(s){e.devicesError=String(s)}}async function kv(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("device.token.rotate",t);if(n?.token){const s=await bo(),a=n.role??t.role;(n.deviceId===s.deviceId||t.deviceId===s.deviceId)&&Ed({deviceId:s.deviceId,role:a,token:n.token,scopes:n.scopes??t.scopes??[]}),window.prompt("New device token (copy and store securely):",n.token)}await ht(e)}catch(n){e.devicesError=String(n)}}async function $v(e,t){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)))try{await e.client.request("device.token.revoke",t);const s=await bo();t.deviceId===s.deviceId&&Rd({deviceId:s.deviceId,role:t.role}),await ht(e)}catch(s){e.devicesError=String(s)}}function Ti(e){return typeof e=="object"&&e!==null}function Sv(e){if(!Ti(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!Ti(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const a=typeof e.createdAtMs=="number"?e.createdAtMs:0,i=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!a||!i?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:a,expiresAtMs:i}}function Av(e){if(!Ti(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function jd(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function xv(e,t){const n=jd(e).filter(s=>s.id!==t.id);return n.push(t),n}function cl(e,t){return jd(e).filter(n=>n.id!==t)}async function ia(e,t){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,t?.quiet||(e.lastError=null);try{const n=await e.client.request("node.list",{}),s=Array.isArray(n.nodes)?n.nodes:[];JSON.stringify(s)!==JSON.stringify(e.nodes)&&(e.nodes=s)}catch(n){t?.quiet||(e.lastError=String(n))}finally{e.nodesLoading=!1}}}const be=new Map;async function te(e,t){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const n=t?.includeGlobal??e.sessionsIncludeGlobal,s=t?.includeUnknown??e.sessionsIncludeUnknown,a=t?.activeMinutes??Os(e.sessionsFilterActive,0),i=t?.limit??Os(e.sessionsFilterLimit,50),o={includeGlobal:n,includeUnknown:s};a>0&&(o.activeMinutes=a),i>0&&(o.limit=i);const l=await e.client.request("sessions.list",o);if(l){if(l.sessions){const c=new Map;if(e.sessionsResult?.sessions)for(const u of e.sessionsResult.sessions)u.displayName&&c.set(u.key,u.displayName);l.sessions=l.sessions.map(u=>{if(u.label||u.displayName)return u;let p=be.get(u.key);if(!p){const v=u.key.split(":").pop();if(v&&v.length>=4){for(const[m,k]of be)if(m===u.key||m.endsWith(`:${v}`)||u.key.endsWith(`:${m.split(":").pop()}`)){p=k;break}}}if(p)return{...u,displayName:p};const f=c.get(u.key);return f?{...u,displayName:f}:u})}e.sessionsResult=l}}catch(n){e.sessionsError=String(n)}finally{e.sessionsLoading=!1}}}async function Rs(e,t,n){if(!e.client||!e.connected)return{ok:!1};const s={key:t};"label"in n&&(s.label=n.label),"displayName"in n&&(s.displayName=n.displayName),"thinkingLevel"in n&&(s.thinkingLevel=n.thinkingLevel),"verboseLevel"in n&&(s.verboseLevel=n.verboseLevel),"reasoningLevel"in n&&(s.reasoningLevel=n.reasoningLevel);try{const{safeRequest:a}=await E(async()=>{const{safeRequest:o}=await Promise.resolve().then(()=>Fv);return{safeRequest:o}},void 0,import.meta.url),i=await a(e.client,"sessions.patch",s);return i.ok?{ok:!0,canonicalKey:i.data?.key??t}:(e.sessionsError=i.error,{ok:!1})}catch(a){return e.sessionsError=String(a),{ok:!1}}}async function Vd(e,t){if(!(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${t}"?

Deletes the session entry and archives its transcript.`))){e.sessionsLoading=!0,e.sessionsError=null;try{await e.client.request("sessions.delete",{key:t,deleteTranscript:!0}),await te(e)}catch(s){e.sessionsError=String(s)}finally{e.sessionsLoading=!1}}}async function Dt(e){if(!(!e.client||!e.connected)){e.archivedSessionsLoading=!0;try{const t=await e.client.request("sessions.archived",{});t?.archived&&(e.archivedSessions=t.archived)}catch{}finally{e.archivedSessionsLoading=!1}}}async function Hd(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.archive",{sessionKey:t}),await Dt(e),await te(e)}catch(n){e.sessionsError=`Archive failed: ${String(n)}`}}async function Gd(e,t){if(!(!e.client||!e.connected))try{await e.client.request("sessions.unarchive",{sessionKey:t}),await Dt(e),await te(e)}catch(n){e.sessionsError=`Unarchive failed: ${String(n)}`}}async function Qd(e){if(!e.client||!e.connected)return 0;try{const n=(await e.client.request("sessions.autoArchive",{}))?.archivedCount??0;return await Dt(e),await te(e),n}catch(t){return e.sessionsError=`Auto-archive failed: ${String(t)}`,0}}const Rn=Object.freeze(Object.defineProperty({__proto__:null,archiveSession:Hd,autoTitleCache:be,deleteSession:Vd,loadArchivedSessions:Dt,loadSessions:te,patchSession:Rs,triggerAutoArchive:Qd,unarchiveSession:Gd},Symbol.toStringTag,{value:"Module"})),Tv=1800*1e3;function Yd(e){return{openclawVersion:e.openclaw.version,openclawLatest:e.openclaw.latest,openclawUpdateAvailable:e.openclaw.updateAvailable,openclawInstallKind:e.openclaw.installKind,openclawChannel:e.openclaw.channel,pluginVersion:e.plugin.version,pluginLatest:e.plugin.latest,pluginUpdateAvailable:e.plugin.updateAvailable,pendingDeploy:e.pendingDeploy??null,fetchOk:e.fetchOk}}function Jd(e){const t=typeof e.behind=="number"?e.behind:null;return{openclawVersion:String(e.version??"unknown"),openclawLatest:null,openclawUpdateAvailable:(t??0)>0,openclawInstallKind:"unknown",openclawChannel:null,pluginVersion:"unknown",pluginLatest:null,pluginUpdateAvailable:!1,pendingDeploy:null,fetchOk:e.fetchOk}}async function _v(e){if(!(!e.client||!e.connected)){e.updateLoading=!0,e.updateError=null;try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Yd(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});t.error&&(e.updateError=String(t.error)),e.updateStatus=Jd(t),e.updateLastChecked=Date.now()}catch(t){e.updateError=String(t)}}finally{e.updateLoading=!1}}}async function dl(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("godmode.update.check",{});e.updateStatus=Yd(t),e.updateLastChecked=Date.now()}catch{try{const t=await e.client.request("system.checkUpdates",{fetch:!0});e.updateStatus=Jd(t),e.updateLastChecked=Date.now()}catch{}}}function Cv(e){e.updatePollInterval==null&&(dl(e),e.updatePollInterval=window.setInterval(()=>{dl(e)},Tv))}function Ev(e){const t=e;t.updatePollInterval!=null&&(clearInterval(t.updatePollInterval),t.updatePollInterval=null)}const Xd={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",GODMODE_WEBCHAT:"godmode-webchat",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",MOLTBOT_MACOS:"moltbot-macos",MOLTBOT_IOS:"moltbot-ios",MOLTBOT_ANDROID:"moltbot-android",MOLTBOT_PROBE:"moltbot-probe",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},ul=Xd,_i={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(Xd));new Set(Object.values(_i));function Rv(e){const t=e.version??(e.nonce?"v2":"v1"),n=e.scopes.join(","),s=e.token??"",a=[t,e.deviceId,e.clientId,e.clientMode,e.role,n,String(e.signedAtMs),s];return t==="v2"&&a.push(e.nonce??""),a.join("|")}const Lv=4008;class Pv{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.read","operator.write","operator.approvals","operator.pairing"],s="operator";let a=null,i=!1,o=this.opts.token;if(t){a=await bo();const p=Hm({deviceId:a.deviceId,role:s})?.token;o=p??this.opts.token,i=!!(p&&this.opts.token)}const l=o||this.opts.password?{token:o,password:this.opts.password}:void 0;let c;if(t&&a){const p=Date.now(),f=this.connectNonce??void 0,v=Rv({deviceId:a.deviceId,clientId:this.opts.clientName??ul.CONTROL_UI,clientMode:this.opts.mode??_i.WEBCHAT,role:s,scopes:n,signedAtMs:p,token:o??null,nonce:f}),m=await yv(a.privateKey,v);c={id:a.deviceId,publicKey:a.publicKey,signature:m,signedAt:p,nonce:f}}const u={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??ul.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??_i.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:c,caps:[],auth:l,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",u).then(p=>{p?.auth?.deviceToken&&a&&Ed({deviceId:a.deviceId,role:p.auth.role??s,token:p.auth.deviceToken,scopes:p.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(p)}).catch(()=>{i&&a&&Rd({deviceId:a.deviceId,role:s}),this.ws?.close(Lv,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const a=n;if(a.event==="connect.challenge"){const o=a.payload,l=o&&typeof o.nonce=="string"?o.nonce:null;l&&(this.connectNonce=l,this.sendConnect());return}const i=typeof a.seq=="number"?a.seq:null;i!==null&&(this.lastSeq!==null&&i>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:i}),this.lastSeq=i);try{this.opts.onEvent?.(a)}catch(o){console.error("[gateway] event handler error:",o)}return}if(s.type==="res"){const a=n,i=this.pending.get(a.id);if(!i)return;this.pending.delete(a.id),a.ok?i.resolve(a.payload):i.reject(new Error(a.error?.message??"request failed"));return}}request(t,n){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const s=sa(),a={type:"req",id:s,method:t,params:n},i=new Promise((o,l)=>{this.pending.set(s,{resolve:c=>o(c),reject:l})});return this.ws.send(JSON.stringify(a)),i}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}const Zd={displayName:"label",sessionKey:"conversationId"},eu={};for(const[e,t]of Object.entries(Zd))eu[t]=e;const Iv={"sessions.autoTitle":["sessions.patch"],"sessions.rename":["sessions.patch"]},Mt=new Map;function Dv(){try{const e=sessionStorage.getItem("godmode:healing-cache");if(e){const t=JSON.parse(e);for(const[n,s]of Object.entries(t))Mt.set(n,s)}}catch{}}function pl(){try{const e={};for(const[t,n]of Mt)e[t]=n;sessionStorage.setItem("godmode:healing-cache",JSON.stringify(e))}catch{}}Dv();function Mv(e,t){const n=Mt.get(e);if(!n)return{method:e,params:t};const s=n.resolvedMethod;if(t&&typeof t=="object"&&!Array.isArray(t)&&Object.keys(n.fieldRenames).length>0){const a={...t};for(const[i,o]of Object.entries(n.fieldRenames))i in a&&!(o in a)&&(a[o]=a[i],delete a[i]);return{method:s,params:a}}return{method:s,params:t}}function Ov(e,t,n){const s=n.toLowerCase(),a=n.match(/unexpected property[:\s]*['"]?(\w+)['"]?/i);if(a){const i=a[1],o=Zd[i];if(o&&t&&typeof t=="object"){const l={...t};if(i in l)return l[o]=l[i],delete l[i],console.log(`[safe-request] Self-heal: ${e} — rewrote "${i}" → "${o}"`),{method:e,params:l,renames:{[i]:o}}}}if(s.includes("unknown method")||s.includes("method not found")){const i=Iv[e];if(i&&i.length>0){const o=i[0];return console.log(`[safe-request] Self-heal: ${e} not found — falling back to ${o}`),{method:o,params:t,renames:{}}}}if((s.includes("unexpected property")||s.includes("unknown field"))&&t&&typeof t=="object"){const i={...t};let o=!1;const l={};for(const[c,u]of Object.entries(eu))c in i&&(i[u]=i[c],delete i[c],l[c]=u,o=!0,console.log(`[safe-request] Self-heal: ${e} — reverse alias "${c}" → "${u}"`));if(o)return{method:e,params:i,renames:l}}return null}async function qs(e,t,n,s){const a=s?.timeout??3e4;let{method:i,params:o}=s?.raw?{method:t,params:n}:Mv(t,n);const l=async(c,u)=>Promise.race([e.request(c,u),new Promise((p,f)=>setTimeout(()=>f(new Error(`Request timeout (${a}ms): ${c}`)),a))]);try{return{ok:!0,data:await l(i,o),method:i,healed:i!==t}}catch(c){const u=String(c instanceof Error?c.message:c);if(s?.raw)return{ok:!1,error:u,method:t};const p=Ov(i,o,u);if(p)try{const f=await l(p.method,p.params);return Mt.set(t,{resolvedMethod:p.method,fieldRenames:p.renames,ts:Date.now()}),pl(),{ok:!0,data:f,method:p.method,healed:!0}}catch(f){return{ok:!1,error:String(f instanceof Error?f.message:f),method:p.method,healed:!0}}if(s?.fallbacks)for(const f of s.fallbacks)try{const v=await l(f,o);return Mt.set(t,{resolvedMethod:f,fieldRenames:{},ts:Date.now()}),pl(),{ok:!0,data:v,method:f,healed:!0}}catch{continue}return{ok:!1,error:u,method:i}}}function tu(){Mt.clear();try{sessionStorage.removeItem("godmode:healing-cache")}catch{}}function Nv(){const e={};for(const[t,n]of Mt)e[t]=n;return e}const Fv=Object.freeze(Object.defineProperty({__proto__:null,clearHealingCache:tu,getHealingEntries:Nv,safeRequest:qs},Symbol.toStringTag,{value:"Module"}));let we=null;function nu(e,t){tu();const n=String(e.version??e.serverVersion??e.gatewayVersion??"unknown"),s=typeof e.protocol=="number"?e.protocol:void 0;we={hostVersion:n,protocolVersion:s,methods:{},initializedAt:Date.now(),probing:!0};try{const a=sessionStorage.getItem("godmode:host-compat");if(a){const i=JSON.parse(a);if(i.hostVersion===n&&i.methods)return we.methods=i.methods,we.probing=!1,we}}catch{}return Bv(t).catch(()=>{}),we}async function Bv(e){if(!we)return;const t=[{method:"sessions.list",params:{limit:1}},{method:"sessions.patch",params:{key:"__compat_probe__"}},{method:"sessions.autoTitle",params:{sessionKey:"__compat_probe__"}},{method:"config.get",params:{}}];for(const n of t){const s={available:!1,testedAt:Date.now()};try{await e.request(n.method,n.params),s.available=!0}catch(a){const i=String(a instanceof Error?a.message:a),o=i.toLowerCase(),l=o.includes("unknown method")||o.includes("not found")&&o.includes("method");s.available=!l,l&&(s.error="method not available");const c=i.match(/(?:expected|valid|accepted) (?:fields?|properties?)[:\s]*\[([^\]]+)\]/i);c&&(s.fields=c[1].split(",").map(u=>u.trim().replace(/['"]/g,"")))}we.methods[n.method]=s}we.probing=!1;try{sessionStorage.setItem("godmode:host-compat",JSON.stringify(we))}catch{}}function su(e){if(!we)return;const t=we.methods[e];if(t)return t.available}function Uv(){return we?.hostVersion??"unknown"}function zv(){return we}function Kv(){return we?.probing??!1}async function au(e,t,n){const s=await qs(e,"sessions.patch",{key:t,label:n});return s.ok?{ok:!0}:(await qs(e,"sessions.patch",{key:t,displayName:n},{raw:!0})).ok?{ok:!0}:{ok:!1,error:s.error}}async function Wv(e,t,n){if(su("sessions.autoTitle")!==!1){const l=await qs(e,"sessions.autoTitle",{sessionKey:t});if(l.ok)return{ok:!0,title:l.data?.title}}const a=n.find(l=>l.role==="user");if(!a)return{ok:!1,error:"No user message to derive title from"};const i=qv(a.content),o=await au(e,t,i);return o.ok?{ok:!0,title:i}:{ok:!1,error:o.error}}function qv(e){let t=e.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").replace(/https?:\/\/\S+/g,"").replace(/[#*_~>]/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").trim();if(t=t.split(`
`).filter(s=>s.trim().length>0)[0]??"New conversation",t.length>60){const s=t.slice(0,57),a=s.lastIndexOf(" ");t=(a>30?s.slice(0,a):s)+"..."}return t}function jv(e){return String(e.label??e.displayName??e.key??"Untitled")}const iu=Object.freeze(Object.defineProperty({__proto__:null,getHostCompat:zv,getHostVersion:Uv,hasMethod:su,hostAutoTitle:Wv,hostPatchSession:au,initHostCompat:nu,isProbing:Kv,readSessionName:jv},Symbol.toStringTag,{value:"Module"})),Ci=new Map;let hl=null,qa=!1;function Vv(e,t,n){return Ci.get(`${e}:${t}:${n}`)??null}async function ou(e){if(!e.client||!e.chatMessages?.length)return;const t=e.sessionKey,n=[];for(let s=0;s<e.chatMessages.length;s++){const a=e.chatMessages[s],i=bi(a);for(let o=0;o<i.length;o++)if(i[o].url&&!i[o].omitted){const l=/^data:([^;]+);base64,(.+)$/.exec(i[o].url);l&&n.push({data:l[2],mimeType:l[1],messageIndex:s,imageIndex:o,role:a.role||"unknown",timestamp:typeof a.timestamp=="number"?a.timestamp:void 0})}}if(n.length>0)try{const s=await e.client.request("images.cache",{images:n.map(a=>({data:a.data,mimeType:a.mimeType})),sessionKey:t});if(s?.cached){const a=n.map((i,o)=>({messageIndex:i.messageIndex,imageIndex:i.imageIndex,hash:s.cached[o]?.hash,mimeType:i.mimeType,bytes:s.cached[o]?.bytes??0,role:i.role,timestamp:i.timestamp})).filter(i=>!!i.hash);a.length>0&&await e.client.request("images.updateIndex",{sessionKey:t,images:a})}}catch{}if(!qa){qa=!0;try{const s=Sd();s&&await s.catch(()=>{});const a=async()=>{const o=await e.client.request("images.resolve",{sessionKey:t});if(o?.images&&Object.keys(o.images).length>0){hl!==t&&Ci.clear();for(const[l,c]of Object.entries(o.images))Ci.set(`${t}:${l}`,c);return hl=t,e.chatMessages=[...e.chatMessages],!0}return!1};!await a()&&e.chatMessages?.some(o=>bi(o).some(c=>c.omitted||!c.url))&&(await new Promise(o=>setTimeout(o,500)),await a())}catch{}finally{qa=!1}}}function ru(e){ou(e)}const Mn=[];function Hv(){return[...Mn]}let lt=null;const Gv=10,Qv=1e3,Le=new Map;function ja(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const a=t.mainKey?.trim()||"main",i=t.defaultAgentId?.trim();return n==="main"||n===a||i&&(n===`agent:${i}:main`||n===`agent:${i}:${a}`)?s:n}function Yv(e,t){if(!t?.mainSessionKey)return;const n="main",s=p=>(p??"").trim()===n||(p??"").trim()==="",a=s(e.sessionKey)?e.sessionKey:ja(e.sessionKey,t),i=s(e.settings.sessionKey)?e.settings.sessionKey:ja(e.settings.sessionKey,t),o=s(e.settings.lastActiveSessionKey)?e.settings.lastActiveSessionKey:ja(e.settings.lastActiveSessionKey,t),l=a||i||e.sessionKey,c={...e.settings,sessionKey:i||l,lastActiveSessionKey:o||l},u=c.sessionKey!==e.settings.sessionKey||c.lastActiveSessionKey!==e.settings.lastActiveSessionKey;l!==e.sessionKey&&(e.sessionKey=l),u&&Ze(e,c)}function Jv(e){lt&&(clearTimeout(lt),lt=null);const t=(e.reconnectAttempt??0)+1;if(t>Gv){e.lastError="Connection lost. Please refresh the page.",e.reconnecting=!1;return}e.reconnectAttempt=t,e.reconnecting=!0;const n=Math.min(Qv*Math.pow(2,t-1),3e4);lt=setTimeout(()=>{lt=null,e.connected||wo(e)},n)}async function Xv(e){if(!e.client)return;const t=e;try{if(t.setupQuickDone){t.workspaceNeedsSetup=!1;return}try{if((await e.client.request("onboarding.status",{}))?.identity?.name){t.workspaceNeedsSetup=!1;return}}catch{}const n=await e.client.request("projects.list",{});t.workspaceNeedsSetup=!n?.projects||n.projects.length===0}catch{}}async function Zv(e){if(!e.client)return;if(e.workspaceNeedsSetup===!1){try{const n=await e.client.request("onboarding.status",{});n&&!n.completedAt&&await e.client.request("onboarding.complete",{summary:null})}catch{}return}try{const n=await e.client.request("onboarding.status",{}),s=e;if(n&&!n.completedAt){s.onboardingActive=!0,s.onboardingPhase=n.phase??0,s.onboardingData=n;const a=e;if(a.showSetupTab=!0,n.identity?.name){a.setupQuickDone=!0;const i=e;(!i.userName||!i.settings.userName)&&(i.userName=n.identity.name,i.applySettings({...i.settings,userName:n.identity.name}))}}else s.onboardingActive=!1,s.onboardingData=n??null}catch{}}function ey(e,t){if(!e.sessionsResult?.sessions)return;const n=e.sessionsResult.sessions.map(s=>s.key===t?{...s,updatedAt:Date.now()}:s);e.sessionsResult={...e.sessionsResult,sessions:n}}const tn=new Set;function ty(){tn.clear()}function zn(e){return typeof e.content=="string"?e.content:Array.isArray(e.content)?e.content.find(n=>n.type==="text")?.text??"":""}function ny(e){const t=e.filter(s=>s.role==="user");if(t.length===0)return null;const n=e.find(s=>s.role==="assistant");if(n){const s=sy(zn(n));if(s)return s}for(const s of t){const a=gl(zn(s));if(!a.trim())continue;const i=ay(a);if(i)return i}for(const s of t){const a=gl(zn(s));if(!a.trim())continue;const i=iy(a);if(i)return i}return null}function sy(e){if(!e||e.length<10)return null;const n=e.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,i=>i.slice(1,-1)).replace(/https?:\/\/\S+/g,"").replace(/[*_~[\]]/g,"").replace(/^#+\s*/gm,"").split(/\n+/).filter(i=>i.trim().length>5);if(n.length===0)return null;let s=n[0].trim();if(s=s.replace(/^(sure[!,.]?\s*|of course[!,.]?\s*|absolutely[!,.]?\s*|great[!,.]?\s*|certainly[!,.]?\s*|happy to help[!,.]?\s*|no problem[!,.]?\s*)/i,"").replace(/^(I'll|I will|let me|I can|I'm going to|here's|here is|here are)\s+/i,"").replace(/^(help you\s+(with\s+)?|take a look at\s+|check\s+(on\s+)?|look into\s+|review\s+)/i,(i,o)=>"").trim(),s.length<5)return null;const a=s.search(/[.!?:]\s/);return a>10&&(s=s.substring(0,a)),s=s.replace(/[.!?:,]+$/,"").trim(),s.length>0&&(s=s[0].toUpperCase()+s.slice(1)),s.length>40&&(s=s.slice(0,37).replace(/\s+\S*$/,"").trim()+"..."),s.length<5||/^(the|a|an|some|this|that|your|my|our)\s*$/i.test(s)?null:s}function ay(e){const n=e.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,i=>i.slice(1,-1)).replace(/https?:\/\/\S+/g,"").replace(/!\[.*?\]\(.*?\)/g,"").replace(/[*_~[\]]/g,"").replace(/^#+\s*/gm,"").split(/\n+/).map(i=>i.trim()).filter(i=>i.length>3);if(n.length===0)return null;let s=n[0];return s=s.replace(/^(what|how|where|when|why|which|who)\s+(is|are|was|were|do|does|did|can|could|would|should|will|about)\s+/i,"").replace(/^(can|could|would|will|should)\s+(you|we|I)\s+/i,"").replace(/^(do|does)\s+(this|that|it)\s+/i,"").replace(/^(is|are)\s+(there|this|that|it)\s+/i,""),s=s.replace(/^(I need you to|I want you to|I'd like you to|I need to|I want to|I'd like to)\s+/i,"").replace(/^(help me\s+(to\s+)?|go ahead and|let'?s|so\s+|okay so\s+|also\s+)/i,"").replace(/^(please|pls)\s+/i,"").replace(/^(can you|could you|would you|will you)\s+/i,"").replace(/^(tell me about|explain|describe|show me)\s+/i,"").replace(/\?+$/,"").trim(),s.length<4||(s=s.replace(/\s+(if|when|before|after|so that|because|since|unless|and then)\s+.*/i,"").replace(/\s+[-—]\s+.*/,"").trim(),s.length>0&&(s=s[0].toUpperCase()+s.slice(1)),s=s.replace(/[.!?:,]+$/,"").trim(),s.length>40&&(s=s.slice(0,37).replace(/\s+\S*$/,"").trim()+"..."),s.length<4)||/^(hi|hey|hello|thanks|thank\s+you|thx|ok|okay|sure|alright|great|good\s+(morning|afternoon|evening))\b/i.test(s)?null:s}const fl=["internal system context injected by godmode","treat it as invisible background instructions only","persistence protocol (non-negotiable)","[godmode — consciousness context]","[godmode — working context]","[enforcement: self-service gate]","[enforcement: output shield]","[godmode queue]","you are resourceful and thorough. your job is to get the job done","## persistence protocol","## core behaviors","## your role as ","(godmode ea)","elite executive assistant powering a personal ai operating system","be diligent first time.","exhaust reasonable options.","assume capability exists."];function gl(e){let t=e.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g,"").replace(/<system>[\s\S]*?<\/system>/g,"").replace(/<context>[\s\S]*?<\/context>/g,"").replace(/<ide_selection>[\s\S]*?<\/ide_selection>/g,"").replace(/<ide_opened_file>[\s\S]*?<\/ide_opened_file>/g,"").replace(/<[a-z][a-z_-]*>[\s\S]*?<\/[a-z][a-z_-]*>/g,"").replace(/^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*\s+)?\d{4}-\d{2}-\d{2}[\sT]\d{1,2}:\d{2}(?::\d{2})?(?:\s*[A-Z]{2,5})?\s*/gm,"").replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[^\s]*\s*/gm,"");const n=t.toLowerCase();let s=0;for(const a of fl)n.includes(a.toLowerCase())&&s++;if(s>=2)t="";else if(s===1)for(const a of fl){const i=n.indexOf(a.toLowerCase());if(i!==-1){t=t.substring(0,i).trim();break}}return t.trim()}function iy(e){const n=e.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,u=>u.slice(1,-1)).replace(/https?:\/\/\S+/g,"").replace(/!\[.*?\]\(.*?\)/g,"").split(new RegExp("(?<=[.!?])\\s+|\\n+")).map(u=>u.replace(/^#+\s*/,"").replace(/[*_`~[\]]/g,"").trim()).filter(u=>u.length>5);if(n.length===0)return null;const s=/^(hi|hey|hello|thanks|thank\s+you|thx|ok|okay|sure|alright|great|good\s+(morning|afternoon|evening))\b/i,a=/^(fix|add|create|update|change|build|implement|remove|delete|refactor|make|set\s+up|configure|enable|disable|show|hide|move|rename|convert|replace|write|edit|debug|test|deploy|install|run|check|review|optimize|improve|clean|reset|open|close|connect|disconnect|sync|upload|download|merge|split|sort|filter|search|format|generate|export|import|migrate|monitor|schedule|cancel|approve|reject|assign|unassign|plan|draft|prep|book|find|send|call|email|reach\s+out|follow\s+up|look\s+into|figure\s+out|research|compare|analyze|summarize)\b/i,i=/\b(function|component|file|page|button|API|error|bug|feature|config|style|layout|route|test|database|server|client|UI|CSS|HTML|TypeScript|view|sidebar|modal|tab|form|input|output|session|message|chat|title|drive|upload|deploy|build|meeting|email|invoice|proposal|contract|lead|customer|prospect|client|website|landing|content|strategy|schedule|flight|trip|travel|appointment|haircut|doctor|dentist|gym|workout|diet|recipe|budget|expense|report|presentation|pitch|pricing|competitor|marketing|sales|hiring|onboarding|feedback|review|goal|milestone|deadline|launch|release)\b/i;function o(u){let p=0;return u.includes("?")&&(p+=3),a.test(u)&&(p+=5),i.test(u)&&(p+=2),s.test(u)&&(p-=5),/^(it'?s |this is |that |there )/i.test(u)&&(p-=1),u.length<15&&(p-=1),u.length>=15&&u.length<=60&&(p+=1),p}const l=n.map(u=>({text:u,score:o(u)}));l.sort((u,p)=>p.score-u.score);let c=l[0].text;return c=c.replace(/^(can you|could you|would you|will you|I need you to|I want you to|I'd like you to|I need to|I want to|I'd like to|help me to?|go ahead and|let'?s|so |okay so )\s+/i,"").replace(/^(please|pls)\s+/i,"").replace(/^(what|how|where|when|why|which|who)\s+(is|are|was|were|do|does|did|can|could|would|should|will|about)\s+/i,"").replace(/\?+$/,"").trim(),c=c.replace(/\s+(if|when|before|after|so that|because|since|unless|and then)\s+.*/i,"").trim(),c.length>0&&(c=c[0].toUpperCase()+c.slice(1)),c=c.replace(/[.!?:,]+$/,"").trim(),c.length>40&&(c=c.slice(0,37).replace(/\s+\S*$/,"").trim()+"..."),c||null}async function oy(e,t){const n=["telegram","slack","discord","whatsapp"],s=t.toLowerCase();if(n.some(o=>s.includes(o))||e.privateSessions?.has(t)||tn.has(t))return;const{findSessionByKey:a}=await E(async()=>{const{findSessionByKey:o}=await Promise.resolve().then(()=>cw);return{findSessionByKey:o}},void 0,import.meta.url),i=a(e.sessionsResult?.sessions,t);if(i?.label?.trim()||i?.displayName?.trim()){tn.add(t);return}if(be.has(t)){tn.add(t);return}if(!(!e.client||!e.connected))try{const o=e;let c=o.sessionKey===t||i?.key&&o.sessionKey===i.key?o.chatMessages??[]:[];if(c.length===0&&e.client)try{const d=await e.client.request("chat.history",{sessionKey:t,limit:10});Array.isArray(d?.messages)&&(c=d.messages)}catch{return}let u=null;const p=c.find(d=>d.role==="user"),f=c.find(d=>d.role==="assistant");if(p&&e.client)try{const d=await e.client.request("sessions.generateTitle",{userMessage:zn(p),assistantMessage:f?zn(f):""});d?.title&&(u=d.title)}catch{}if(u||(u=ny(c)),!u)return;const v=i?.key??t,{hostPatchSession:m}=await E(async()=>{const{hostPatchSession:d}=await Promise.resolve().then(()=>iu);return{hostPatchSession:d}},void 0,import.meta.url),k=await m(e.client,v,u);if(!k.ok){console.error("[auto-title] patch failed:",k.error);return}tn.add(t),be.set(t,u),i?.key&&i.key!==t&&be.set(i.key,u),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(d=>d.key===t||d.key===v?{...d,label:u,displayName:u}:d)}),e.requestUpdate?.()}catch(o){console.error("[auto-title] RPC call failed:",o)}}function wo(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null,ty();const t=e;"sessionsLoading"in t&&(t.sessionsLoading=!1),"agentsLoading"in t&&(t.agentsLoading=!1),"nodesLoading"in t&&(t.nodesLoading=!1),"devicesLoading"in t&&(t.devicesLoading=!1),"channelsLoading"in t&&(t.channelsLoading=!1),"configLoading"in t&&(t.configLoading=!1),"presenceLoading"in t&&(t.presenceLoading=!1),"cronLoading"in t&&(t.cronLoading=!1),"skillsLoading"in t&&(t.skillsLoading=!1),"debugLoading"in t&&(t.debugLoading=!1),"logsLoading"in t&&(t.logsLoading=!1),lt&&(clearTimeout(lt),lt=null),e.client?.stop(),e.client=new Pv({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:n=>{const s=e.reconnecting;if(e.connected=!0,e.lastError=null,e.hello=n,e.reconnecting=!1,e.reconnectAttempt=0,s){const a=e;typeof a.showToast=="function"&&a.showToast("Gateway reconnected","success",4e3),e.lastError="✓ Reconnected",setTimeout(()=>{e.lastError==="✓ Reconnected"&&(e.lastError=null)},3e3),e.chatRunId=null;const i=e;"chatStream"in i&&(i.chatStream=null),"chatStreamStartedAt"in i&&(i.chatStreamStartedAt=null);const o=e;if(o.todaySelectedDate){const l=new Date,c=`${l.getFullYear()}-${String(l.getMonth()+1).padStart(2,"0")}-${String(l.getDate()).padStart(2,"0")}`;o.todaySelectedDate!==c&&(o.todaySelectedDate=c)}e.workingSessions.clear(),e.requestUpdate?.();for(const l of Le.values())clearTimeout(l);Le.clear()}nu(n,e.client),py(e,n),$d(e),yd(e),ia(e,{quiet:!0}),ht(e,{quiet:!0}),te(e),rs(e),Xv(e).then(()=>Zv(e)),cy(e),dy(e),Cv(e),uy(e)},onClose:({code:n,reason:s})=>{e.connected=!1,Ev(e);const a=e;"chatSending"in a&&(a.chatSending=!1),"chatSendingSessionKey"in a&&(a.chatSendingSessionKey=null),"chatRunId"in a&&(a.chatRunId=null),"chatStream"in a&&(a.chatStream=null),"chatStreamStartedAt"in a&&(a.chatStreamStartedAt=null);const i=e;"sessionsLoading"in i&&(i.sessionsLoading=!1),"agentsLoading"in i&&(i.agentsLoading=!1),"nodesLoading"in i&&(i.nodesLoading=!1),"devicesLoading"in i&&(i.devicesLoading=!1),"channelsLoading"in i&&(i.channelsLoading=!1),"presenceLoading"in i&&(i.presenceLoading=!1),n!==1012&&(e.lastError=`disconnected (${n}): ${s||"no reason"}`),Jv(e)},onEvent:n=>ry(e,n),onGap:({expected:n,received:s})=>{e.lastError=`event gap detected (expected seq ${n}, got ${s}); refresh recommended`}}),e.client.start()}function ry(e,t){try{ly(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function ly(e,t){if(Mn.unshift({ts:Date.now(),event:t.event,payload:t.payload}),Mn.length>250&&(Mn.length=250),e.tab==="debug"&&(e.eventLog=[...Mn]),t.event==="agent"){if(e.onboarding)return;const n=t.payload,s=n?.sessionKey;s&&n?.stream==="tool"&&n.data?.phase==="start"&&(e.workingSessions.has(s)||(e.workingSessions.add(s),e.requestUpdate?.())),sf(e,n);return}if(t.event==="chat"){const n=t.payload;if(n?.sessionKey){if(Po(e,n.sessionKey),n.state==="delta"){const i=Le.get(n.sessionKey);i&&(clearTimeout(i),Le.delete(n.sessionKey)),e.workingSessions.has(n.sessionKey)||(e.workingSessions.add(n.sessionKey),e.requestUpdate?.());const o=`safety:${n.sessionKey}`,l=Le.get(o);l&&clearTimeout(l),Le.set(o,setTimeout(()=>{Le.delete(o),e.workingSessions.has(n.sessionKey)&&(e.workingSessions.delete(n.sessionKey),e.requestUpdate?.())},9e4))}else if((n.state==="final"||n.state==="error"||n.state==="aborted")&&e.workingSessions.has(n.sessionKey)){const i=Le.get(n.sessionKey);i&&(clearTimeout(i),Le.delete(n.sessionKey));const o=`safety:${n.sessionKey}`,l=Le.get(o);l&&(clearTimeout(l),Le.delete(o)),e.workingSessions.delete(n.sessionKey),e.requestUpdate?.()}}n.state==="final"&&ey(e,n.sessionKey);const s=Td(e,n),a=n?.sessionKey===Q||(n?.sessionKey?.endsWith(`:${Q}`)??!1);if(n&&a){const i=e,o=e.tab==="chat"&&e.sessionKey===Q;if(n.state==="delta"){const l=cn(n.message);if(!o){if(typeof l=="string"){const c=i.allyStream??"";(!c||l.length>=c.length)&&(i.allyStream=l)}i.allyWorking=!0,i.requestUpdate?.()}}else if(n.state==="final"){i.allyStream=null,i.allyWorking=!1,!i.allyPanelOpen&&e.tab!=="chat"&&(i.allyUnread=(i.allyUnread??0)+1);const l=e;l._loadAllyHistory().then(()=>{i.allyPanelOpen&&l._scrollAllyToBottom(),i.requestUpdate?.()})}else if(n.state==="error"||n.state==="aborted"){const l=cn(n.message),c=n.state==="aborted"?"Response was stopped.":l||"Something went wrong — try again.";i.allyMessages=[...i.allyMessages??[],{role:"assistant",content:`*${c}*`,timestamp:Date.now()}],i.allyStream=null,i.allyWorking=!1,i.requestUpdate?.()}}if(n.state==="final"&&(async()=>{await oy(e,n.sessionKey);try{await te(e,{activeMinutes:0})}catch{}})(),(s==="final"||s==="error"||s==="aborted")&&(Hi(e),Nu(e),s==="final"&&e.compactionStatus?.active&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus.startedAt??null,completedAt:Date.now()}),(s==="error"||s==="aborted")&&e.compactionStatus?.active&&(e.compactionStatus=null),e.refreshSessionsAfterChat=!1),s==="final"){const i=!!e.compactionStatus?.completedAt;Ad(e,{allowShrink:i}).then(()=>{ou(e)});const o=e;o.tab==="dashboards"&&o.activeDashboardManifest?.sessionId&&o.activeDashboardManifest.sessionId===n.sessionKey&&E(async()=>{const{loadDashboard:l}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:l}},[],import.meta.url).then(({loadDashboard:l})=>{l(e,o.activeDashboardManifest.id)})}return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&pa(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&ht(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=Sv(t.payload);if(n){e.execApprovalQueue=xv(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=cl(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.process.completed"){const n=t.payload;if(n?.sessionId){const s=n.exitSignal?`signal ${n.exitSignal}`:`exit ${n.exitCode??0}`,a=n.status==="completed"?"✓":"✗",i=n.status==="completed"?"success":"warning",o=n.sessionId.slice(0,8),l=e;typeof l.showToast=="function"&&l.showToast(`${a} Process ${o} ${n.status} (${s})`,i,5e3)}return}if(t.event==="exec.approval.resolved"){const n=Av(t.payload);n&&(e.execApprovalQueue=cl(e.execApprovalQueue,n.id))}if(t.event==="daily-brief:update"){const n=t.payload;if(n){const s=e;s.dailyBrief=n}return}if(t.event==="ui.slot.update"){const n=t.payload;if(n?.tabId){const s=n.mode??"replace";if(n.html)s==="append"?e.dynamicSlots={...e.dynamicSlots,[n.tabId]:(e.dynamicSlots[n.tabId]??"")+n.html}:e.dynamicSlots={...e.dynamicSlots,[n.tabId]:n.html};else{const i={...e.dynamicSlots};delete i[n.tabId],e.dynamicSlots=i}e.requestUpdate?.()}return}if(t.event==="guardrails:update"){const n=e;typeof n.handleGuardrailsLoad=="function"&&n.handleGuardrailsLoad();return}if(t.event==="godmode.options:update"){const n=t.payload;if(n){const s=e;s.godmodeOptions=n,s.requestUpdate?.()}return}if(t.event==="fathom:meeting-processed"){const n=t.payload;if(n?.title){const s=e;typeof s.showToast=="function"&&s.showToast(`Meeting processed: ${n.title}`,"success",6e3);const a=n.message??`Meeting "${n.title}" has been processed.`;s.allyMessages=[...s.allyMessages??[],{role:"assistant",content:a,timestamp:Date.now()}],!s.allyPanelOpen&&s.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1),s.sessionKey===Q&&s.chatMessages&&(s.chatMessages=[...s.chatMessages,{role:"assistant",content:a,timestamp:Date.now()}]),s.requestUpdate?.()}return}if(t.event==="onboarding:update"){const n=t.payload;if(n){const s=e;if(typeof n.phase=="number"&&(s.onboardingPhase=n.phase),s.onboardingData=n,n.completedAt&&(s.onboardingActive=!1),n.identity?.name){const a=e;(!a.userName||!a.settings.userName)&&(a.userName=n.identity.name,a.applySettings({...a.settings,userName:n.identity.name}))}s.requestUpdate?.()}return}if(t.event==="inbox:update"){const n=e;n.handleInboxRefresh?.().catch(()=>{}),n.requestUpdate?.();return}if(t.event==="queue:update"){const n=t.payload,s=e;n?.status==="processing"&&n.proofDocSlug&&s.handleOpenProofDoc?.(n.proofDocSlug).catch(()=>{}),s.handleInboxRefresh?.().catch(()=>{}),s.loadTodayQueueResults?.().catch(()=>{}),s.requestUpdate?.();return}if(t.event==="ally:notification"){const n=t.payload;if(n){const s=e,a={role:"assistant",content:n.summary||"Notification received.",timestamp:Date.now(),isNotification:!0,actions:n.actions??[]};s.allyMessages=[...s.allyMessages??[],a],!s.allyPanelOpen&&e.tab!=="chat"&&(s.allyUnread=(s.allyUnread??0)+1);const i=["queue-complete","queue-needs-review","queue-failed","cron-result"];n.type&&i.includes(n.type)&&s.loadTodayQueueResults&&s.loadTodayQueueResults().catch(()=>{}),n.type&&i.includes(n.type)&&s.handleInboxRefresh&&s.handleInboxRefresh().catch(()=>{}),s.requestUpdate?.()}return}if(t.event==="sessions:updated"){const n=t.payload;n?.sessionKey&&n?.title&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(s=>s.key===n.sessionKey||s.key?.endsWith(`:${n.sessionKey?.split(":").pop()}`)||n.sessionKey?.endsWith(`:${s.key?.split(":").pop()}`)?{...s,displayName:n.title,label:n.title}:s)}),be.set(n.sessionKey,n.title),tn.add(n.sessionKey),e.requestUpdate?.());return}if(t.event==="session:auto-compact"){const n=t.payload;if(n?.sessionKey){const s=e;n.sessionKey===s.sessionKey&&!s.compactionStatus?.active&&s.connected&&(s.showToast?.("Context near limit — auto-compacting...","info",3e3),s.handleCompactChat?.())}return}}async function cy(e){const t=e;typeof t.loadFocusPulse=="function"&&await t.loadFocusPulse()}async function dy(e){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}async function uy(e){if(typeof window>"u")return;const t=new URLSearchParams(window.location.search),n=t.get("openTask");if(!n||!e.client)return;t.delete("openTask");const s=t.toString()?`${window.location.pathname}?${t.toString()}`:window.location.pathname;window.history.replaceState({},"",s);try{const a=await e.client.request("tasks.openSession",{taskId:n});if(a?.sessionKey){e.sessionKey=a.sessionKey,e.tab="chat";const{loadChatHistory:i}=await E(async()=>{const{loadChatHistory:o}=await Promise.resolve().then(()=>Ye);return{loadChatHistory:o}},void 0,import.meta.url);await i(e,a.sessionKey)}}catch(a){console.error("[GodMode] Failed to open task session:",a)}}function py(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&Yv(e,n.sessionDefaults)}async function oa(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[t,n,s,a]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=t,e.debugHealth=n;const i=s;e.debugModels=Array.isArray(i?.models)?i?.models:[],e.debugHeartbeat=a}catch(t){e.debugCallError=String(t)}finally{e.debugLoading=!1}}}async function hy(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const t=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},n=await e.client.request(e.debugCallMethod.trim(),t);e.debugCallResult=JSON.stringify(n,null,2)}catch(t){e.debugCallError=String(t)}}}const fy=2e3,gy=new Set(["trace","debug","info","warn","error","fatal"]);function my(e){if(typeof e!="string")return null;const t=e.trim();if(!t.startsWith("{")||!t.endsWith("}"))return null;try{const n=JSON.parse(t);return!n||typeof n!="object"?null:n}catch{return null}}function vy(e){if(typeof e!="string")return null;const t=e.toLowerCase();return gy.has(t)?t:null}function yy(e){if(!e.trim())return{raw:e,message:e};try{const t=JSON.parse(e),n=t&&typeof t._meta=="object"&&t._meta!==null?t._meta:null,s=typeof t.time=="string"?t.time:typeof n?.date=="string"?n?.date:null,a=vy(n?.logLevelName??n?.level),i=typeof t[0]=="string"?t[0]:typeof n?.name=="string"?n?.name:null,o=my(i);let l=null;o&&(typeof o.subsystem=="string"?l=o.subsystem:typeof o.module=="string"&&(l=o.module)),!l&&i&&i.length<120&&(l=i);let c=null;return typeof t[1]=="string"?c=t[1]:!o&&typeof t[0]=="string"?c=t[0]:typeof t.message=="string"&&(c=t.message),{raw:e,time:s,level:a,subsystem:l,message:c??e,meta:n??void 0}}catch{return{raw:e,message:e}}}async function ko(e,t){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!t?.quiet)){t?.quiet||(e.logsLoading=!0),e.logsError=null;try{const s=await e.client.request("logs.tail",{cursor:t?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),i=(Array.isArray(s.lines)?s.lines.filter(l=>typeof l=="string"):[]).map(yy),o=!!(t?.reset||s.reset||e.logsCursor==null);e.logsEntries=o?i:[...e.logsEntries,...i].slice(-fy),typeof s.cursor=="number"&&(e.logsCursor=s.cursor),typeof s.file=="string"&&(e.logsFile=s.file),e.logsTruncated=!!s.truncated,e.logsLastFetchAt=Date.now()}catch(n){e.logsError=String(n)}finally{t?.quiet||(e.logsLoading=!1)}}}const lu={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer",subagent:"Sub-Agent",swarm:"Swarm"};function Va(e,t,n){return n?n.replace(/-/g," ").replace(/\b\w/g,s=>s.toUpperCase()):lu[t??e]??e}function cu(e,t){const n=(t??Date.now())-e;if(n<0)return"0s";const s=Math.floor(n/1e3);if(s<60)return`${s}s`;const a=Math.floor(s/60),i=s%60;if(a<60)return`${a}m ${i}s`;const o=Math.floor(a/60),l=a%60;return`${o}h ${l}m`}function by(){const e=new Date;return e.setHours(0,0,0,0),e.getTime()}function wy(e){switch(e){case"running":case"validating":return"active";case"queued":return"queued";case"failed":return"failed";default:return"done"}}function ky(e,t){const n=[],s=new Set;for(const a of t){a.childSessionKey&&s.add(a.childSessionKey);const i=a.swarm?.enabled===!0,o=a.status==="review";n.push({id:a.id,type:i?"swarm":"coding",task:a.description,status:wy(a.status),model:a.model??null,startedAt:a.startedAt??a.createdAt,endedAt:a.completedAt??null,branch:a.branch,prUrl:a.prUrl,swarmStage:i?a.swarm.currentStage:void 0,swarmStages:i?a.swarm.stages:void 0,error:a.error,canCancel:a.status==="running"||a.status==="validating"||a.status==="queued",roleName:i?"Swarm":"Builder",childSessionKey:a.childSessionKey,isReview:o})}for(const a of e)s.has(a.childSessionKey)||n.push({id:a.runId,type:"subagent",task:a.task,status:a.endedAt?a.outcome?.status==="error"?"failed":"done":"active",model:a.model,startedAt:a.startedAt??a.createdAt,endedAt:a.endedAt,label:a.label,error:a.outcome?.error??void 0,roleName:a.label??"Sub-Agent",childSessionKey:a.childSessionKey});return n.sort((a,i)=>{const o={active:0,queued:1,failed:2,done:3},l=o[a.status]-o[i.status];return l!==0?l:(i.startedAt??0)-(a.startedAt??0)}),n}function $y(e){const t=[];for(const n of e)n.status==="done"&&n.endedAt&&t.push({id:`${n.id}-done`,timestamp:n.endedAt,type:"completed",summary:n.task,prUrl:n.prUrl,agentRef:n}),n.status==="failed"&&n.endedAt&&t.push({id:`${n.id}-fail`,timestamp:n.endedAt,type:"failed",summary:`${n.task}${n.error?` — ${n.error}`:""}`,agentRef:n}),n.status==="active"&&n.startedAt&&t.push({id:`${n.id}-start`,timestamp:n.startedAt,type:"started",summary:n.task,agentRef:n}),n.status==="queued"&&n.startedAt&&t.push({id:`${n.id}-queue`,timestamp:n.startedAt,type:"queued",summary:n.task,agentRef:n});return t.sort((n,s)=>s.timestamp-n.timestamp),t.slice(0,50)}function Sy(e,t=0,n=0){const s=by();let a=0,i=0,o=0,l=0;for(const u of e)u.status==="active"&&a++,u.status==="done"&&u.endedAt&&u.endedAt>=s&&i++,u.status==="failed"&&u.endedAt&&u.endedAt>=s&&o++,u.type==="swarm"&&(u.status==="active"||u.status==="queued")&&l++;const c=e.filter(u=>u.isReview&&(u.type==="coding"||u.type==="swarm")).length;return{activeNow:a,completedToday:i,failed:o,swarmPipelines:l,queueDepth:t,queueReview:n+c}}async function hn(e,t){if(!e.client||!e.connected)return;const n=e;t?.quiet||(n.missionControlLoading=!0),n.missionControlError=null;try{let s=null;try{s=await e.client.request("queue.list",{limit:100})}catch{}let a=[],i=[];try{a=(await e.client.request("subagents.list",{limit:200})).runs??[]}catch{}try{i=(await e.client.request("coding.list",{})).tasks??[]}catch{}const o=ky(a,i),l=s?.items??[],c=[];let u=0;for(const m of l)m.status==="processing"?o.push({id:m.id,type:"queue",task:m.title,status:"active",model:null,startedAt:m.startedAt??m.createdAt,endedAt:null,error:m.error,roleName:Va(m.type,void 0,m.personaHint),queueItemType:m.type,outputPath:m.result?.outputPath,sourceTaskId:m.sourceTaskId,retryCount:m.retryCount,prUrl:m.result?.prUrl}):m.status==="review"?(u++,o.push({id:m.id,type:"queue",task:m.title,status:"done",model:null,startedAt:m.startedAt??m.createdAt,endedAt:m.completedAt??null,roleName:Va(m.type,void 0,m.personaHint),queueItemType:m.type,outputPath:m.result?.outputPath,sourceTaskId:m.sourceTaskId,retryCount:m.retryCount,prUrl:m.result?.prUrl,isReview:!0})):m.status==="failed"?o.push({id:m.id,type:"queue",task:m.title,status:"failed",model:null,startedAt:m.startedAt??m.createdAt,endedAt:m.completedAt??null,error:m.error,roleName:Va(m.type,void 0,m.personaHint),queueItemType:m.type,outputPath:m.result?.outputPath,sourceTaskId:m.sourceTaskId,retryCount:m.retryCount}):m.status==="pending"&&c.push(m);o.sort((m,k)=>{const d={active:0,queued:1,failed:2,done:3},g=d[m.status]-d[k.status];return g!==0?g:(k.startedAt??0)-(m.startedAt??0)});const p=c.length,f=Sy(o,p,u),v=$y(o);n.missionControlData={agents:o,stats:f,activityFeed:v,lastRefreshedAt:Date.now(),queueItems:c}}catch(s){console.error("[MissionControl] load error:",s),n.missionControlError=s instanceof Error?s.message:"Failed to load agent data"}finally{n.missionControlLoading=!1}}async function Ay(e,t){if(!(!e.client||!e.connected))try{await e.client.request("coding.cancel",{taskId:t}),e.showToast("Task cancelled","success",2e3),await hn(e)}catch(n){e.showToast("Failed to cancel task","error"),console.error("[MissionControl] cancel error:",n)}}async function xy(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("queue.approve",{id:t}),s=n?.item?.personaHint,a=n?.item?.title??"task";if(s){const i=s.replace(/-/g," ").replace(/\b\w/g,o=>o.toUpperCase());e.showToast(`Approved! How did ${i} do on "${a}"? Rate in Trust Tracker.`,"success",4e3)}else e.showToast("Item approved","success",2e3);await hn(e)}catch(n){e.showToast("Failed to approve item","error"),console.error("[MissionControl] approve error:",n)}}async function Ty(e,t){if(!e.client||!e.connected)return!1;try{return(await e.client.request("coding.approve",{taskId:t}))?.approved?(e.showToast("Task approved","success",2e3),await hn(e),!0):!1}catch{return!1}}async function _y(e,t){if(!(!e.client||!e.connected))try{await e.client.request("queue.retry",{id:t}),e.showToast("Retrying...","success",2e3),await hn(e)}catch(n){e.showToast("Failed to retry","error"),console.error("[MissionControl] retry error:",n)}}async function Cy(e,t){if(t.status==="failed")return{content:[`# Failed: ${t.task}`,"",`**Agent:** ${t.roleName}`,`**Retries:** ${t.retryCount??0}/2`,"","## Error","```",t.error??"Unknown error","```","","## What to do",t.retryCount&&t.retryCount>=2?"- This task failed after 2 automatic retries. Consider rephrasing the task or breaking it into smaller pieces.":"- Click **Retry** to attempt again with an improved prompt.","- Or remove this item and create a new one with more context."].join(`
`),title:`Failed: ${t.task}`,mimeType:"text/markdown"};if(t.prUrl&&e.client)try{return{content:(await e.client.request("queue.prDiff",{prUrl:t.prUrl})).content,title:`PR: ${t.task}`,mimeType:"text/markdown"}}catch{return{content:`# ${t.task}

[Open in GitHub](${t.prUrl})`,title:t.task,mimeType:"text/markdown"}}if(t.outputPath&&e.client)try{return{content:(await e.client.request("queue.readOutput",{path:t.outputPath})).content,title:t.task,mimeType:"text/markdown"}}catch{return{content:`Output file not found: ${t.outputPath}`,title:t.task,mimeType:"text/plain"}}return{content:`# ${t.task}

No details available.`,title:t.task,mimeType:"text/markdown"}}const Qt=Object.freeze(Object.defineProperty({__proto__:null,AGENT_ROLE_NAMES:lu,approveCodingTask:Ty,approveQueueItem:xy,cancelCodingTask:Ay,formatDuration:cu,loadAgentDetail:Cy,loadMissionControl:hn,retryQueueItem:_y},Symbol.toStringTag,{value:"Module"}));function $o(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{ia(e,{quiet:!0})},5e3))}function So(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function Ao(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&ko(e,{quiet:!0})},2e3))}function xo(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function To(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&oa(e)},3e3))}function _o(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}function du(e){e.missionControlPollInterval==null&&(e.missionControlPollInterval=window.setInterval(()=>{e.tab==="mission-control"&&hn(e,{quiet:!0})},5e3))}function uu(e){e.missionControlPollInterval!=null&&(clearInterval(e.missionControlPollInterval),e.missionControlPollInterval=null)}async function is(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.status",{});e.cronStatus=t}catch(t){e.cronError=String(t)}}async function ra(e){if(!(!e.client||!e.connected)&&!e.cronLoading){e.cronLoading=!0,e.cronError=null;try{const t=await e.client.request("cron.list",{includeDisabled:!0});e.cronJobs=Array.isArray(t.jobs)?t.jobs:[]}catch(t){e.cronError=String(t)}finally{e.cronLoading=!1}}}function Ey(e){if(e.scheduleKind==="at"){const n=Date.parse(e.scheduleAt);if(!Number.isFinite(n))throw new Error("Invalid run time.");return{kind:"at",atMs:n}}if(e.scheduleKind==="every"){const n=Os(e.everyAmount,0);if(n<=0)throw new Error("Invalid interval amount.");const s=e.everyUnit;return{kind:"every",everyMs:n*(s==="minutes"?6e4:s==="hours"?36e5:864e5)}}const t=e.cronExpr.trim();if(!t)throw new Error("Cron expression required.");return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0}}function Ry(e){if(e.payloadKind==="systemEvent"){const a=e.payloadText.trim();if(!a)throw new Error("System event text required.");return{kind:"systemEvent",text:a}}const t=e.payloadText.trim();if(!t)throw new Error("Agent message required.");const n={kind:"agentTurn",message:t};e.deliver&&(n.deliver=!0),e.channel&&(n.channel=e.channel),e.to.trim()&&(n.to=e.to.trim());const s=Os(e.timeoutSeconds,0);return s>0&&(n.timeoutSeconds=s),n}async function Ly(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const t=Ey(e.cronForm),n=Ry(e.cronForm),s=e.cronForm.agentId.trim(),a={name:e.cronForm.name.trim(),description:e.cronForm.description.trim()||void 0,agentId:s||void 0,enabled:e.cronForm.enabled,schedule:t,sessionTarget:e.cronForm.sessionTarget,wakeMode:e.cronForm.wakeMode,payload:n,isolation:e.cronForm.postToMainPrefix.trim()&&e.cronForm.sessionTarget==="isolated"?{postToMainPrefix:e.cronForm.postToMainPrefix.trim()}:void 0};if(!a.name)throw new Error("Name required.");await e.client.request("cron.add",a),e.cronForm={...e.cronForm,name:"",description:"",payloadText:""},await ra(e),await is(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function Py(e,t,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:t.id,patch:{enabled:n}}),await ra(e),await is(e)}catch(s){e.cronError=String(s)}finally{e.cronBusy=!1}}}async function Iy(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:t.id,mode:"force"}),await pu(e,t.id)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function Dy(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:t.id}),e.cronRunsJobId===t.id&&(e.cronRunsJobId=null,e.cronRuns=[]),await ra(e),await is(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function pu(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("cron.runs",{id:t,limit:50});e.cronRunsJobId=t,e.cronRuns=Array.isArray(n.entries)?n.entries:[]}catch(n){e.cronError=String(n)}}async function Ft(e){if(!(!e.client||!e.connected)){e.guardrailsLoading=!0;try{const[t,n]=await Promise.all([e.client.request("guardrails.list",{}),e.client.request("guardrails.history",{limit:50})]);e.guardrailsData={gates:t.gates,activity:n.activity,custom:t.custom??[]}}catch(t){console.error("[Guardrails] load error:",t),e.guardrailsData=null}finally{e.guardrailsLoading=!1}}}async function My(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,enabled:n});const a=e.guardrailsData?.gates.find(i=>i.id===t)?.name??t;e.showToast(`${a} ${n?"enabled":"disabled"}`,"success",2e3),await Ft(e)}catch(s){e.showToast("Failed to update guardrail","error"),console.error("[Guardrails] toggle error:",s)}}async function Oy(e,t,n,s){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.set",{gateId:t,thresholds:{[n]:s}}),e.showToast("Threshold updated","success",2e3),await Ft(e)}catch(a){e.showToast("Failed to update threshold","error"),console.error("[Guardrails] threshold error:",a)}}async function Ny(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.setCustom",{id:t,enabled:n}),e.showToast(`Custom rule ${n?"enabled":"disabled"}`,"success",2e3),await Ft(e)}catch(s){e.showToast("Failed to update custom rule","error"),console.error("[Guardrails] toggleCustom error:",s)}}async function Fy(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.removeCustom",{id:t}),e.showToast("Custom rule removed","success",2e3),await Ft(e)}catch(n){e.showToast("Failed to remove custom rule","error"),console.error("[Guardrails] deleteCustom error:",n)}}async function By(e,t){if(!(!e.client||!e.connected))try{await e.client.request("guardrails.addCustom",{guardrail:{name:t.name,description:"",enabled:!0,trigger:{tool:t.tool,patterns:t.patterns},action:t.action,message:t.message,...t.redirectTo?{redirectTo:t.redirectTo}:{}}}),e.showToast("Custom rule created","success",2e3),await Ft(e)}catch(n){e.showToast("Failed to create custom rule","error"),console.error("[Guardrails] addCustom error:",n)}}const Yt=Object.freeze(Object.defineProperty({__proto__:null,addCustomGuardrailFromUI:By,deleteCustomGuardrail:Fy,loadGuardrails:Ft,toggleCustomGuardrail:Ny,toggleGuardrail:My,updateGuardrailThreshold:Oy},Symbol.toStringTag,{value:"Module"}));function Uy(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.get",params:{nodeId:t}}:null}function zy(e,t){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:t};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.set",params:{...t,nodeId:n}}:null}async function Co(e,t){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const n=Uy(t);if(!n){e.lastError="Select a node before loading exec approvals.";return}const s=await e.client.request(n.method,n.params);Ky(e,s)}catch(n){e.lastError=String(n)}finally{e.execApprovalsLoading=!1}}}function Ky(e,t){e.execApprovalsSnapshot=t,e.execApprovalsDirty||(e.execApprovalsForm=Et(t.file??{}))}async function Wy(e,t){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const n=e.execApprovalsSnapshot?.hash;if(!n){e.lastError="Exec approvals hash missing; reload and retry.";return}const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},a=zy(t,{file:s,baseHash:n});if(!a){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(a.method,a.params),e.execApprovalsDirty=!1,await Co(e,t)}catch(n){e.lastError=String(n)}finally{e.execApprovalsSaving=!1}}}function qy(e,t,n){const s=Et(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Rc(s,t,n),e.execApprovalsForm=s,e.execApprovalsDirty=!0}function jy(e,t){const n=Et(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Lc(n,t),e.execApprovalsForm=n,e.execApprovalsDirty=!0}const Vy=["~/godmode/memory/AGENT-DAY.md","~/godmode/AGENT-DAY.md"];function Hy(e){return[...[`~/godmode/memory/agent-day/${e}.md`,`~/godmode/memory/agent-log/${e}.md`,`~/godmode/memory/daily/${e}-agent-log.md`],...Vy]}function Gy(e){return["Needs Review","Active Sub-Agents","Completed Today","Queue","Feedback Log","AGENT-DAY"].filter(s=>e.includes(s)).length>=2}async function hu(e,t){try{const n=t?{date:t}:{},s=await e.request("dailyBrief.get",n);return!s||!s.content||!s.date?null:s}catch(n){return console.error("[MyDay] Failed to load daily brief:",n),null}}async function fu(e,t,n){const s=t||ce(),a="agentLog.get";try{const i=await e.request(a,{date:s});if(i?.content?.trim()&&i?.sourcePath)return{date:i.date||s,content:i.content,updatedAt:i.updatedAt||new Date().toISOString(),sourcePath:i.sourcePath}}catch(i){console.warn(`[MyDay] ${a} unavailable, falling back to files.read:`,i)}return Qy(e,s)}async function Qy(e,t){const n=Hy(t),s=a=>a.includes("AGENT-DAY.md");for(const a of n)try{const i=await e.request("files.read",{path:a,maxSize:1e6});if(!i?.content?.trim()||!Gy(i.content)||s(a)&&typeof i.modifiedAt=="number"&&ce(new Date(i.modifiedAt))!==t)continue;return{date:t,content:i.content,updatedAt:typeof i.modifiedAt=="number"?new Date(i.modifiedAt).toISOString():new Date().toISOString(),sourcePath:a}}catch{}return null}function Ln(e,t,n){return new Promise((s,a)=>{const i=setTimeout(()=>a(new Error(`${n} timed out after ${t}ms`)),t);e.then(o=>{clearTimeout(i),s(o)},o=>{clearTimeout(i),a(o)})})}const Yy={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function gu(e){if(!e.client||!e.connected)return[];e.todayTasksLoading=!0;try{const t=e.todaySelectedDate??ce(),[n,s]=await Promise.all([e.client.request("tasks.today",{date:t,includeCompleted:!0}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),a=new Map;for(const o of s.items)o.sourceTaskId&&(o.status==="processing"||o.status==="review"||o.status==="needs-review"||o.status==="done"||o.status==="failed")&&a.set(o.sourceTaskId,{status:o.status,type:o.type,roleName:Yy[o.type]??o.type,queueItemId:o.id});const i=(n.tasks??[]).map(o=>({id:o.id,title:o.title,status:o.status,project:o.project,dueDate:o.dueDate,priority:o.priority,createdAt:o.createdAt,completedAt:o.completedAt,queueStatus:a.get(o.id)??null}));return e.todayTasks=i,i}catch(t){return console.error("[MyDay] Failed to load today tasks:",t),e.todayTasks??[]}finally{e.todayTasksLoading=!1}}async function mu(e){if(!(!e.client||!e.connected)){e.inboxLoading=!0;try{const t=await e.client.request("inbox.list",{status:"pending",limit:50});e.inboxItems=t.items??[],e.inboxCount=t.pendingCount??0}catch(t){console.error("[MyDay] Failed to load inbox items:",t),e.inboxItems=[],e.inboxCount=0}finally{e.inboxLoading=!1}}}async function Jy(e){if(!e.client||!e.connected)return[];try{const n=(await e.client.request("queue.list",{limit:50}))?.items??[],s=Date.now()-1440*60*1e3;return n.filter(a=>!(a.status!=="review"&&a.status!=="needs-review"&&a.status!=="done"||a.status==="done"&&(a.completedAt??0)<s)).sort((a,i)=>(i.completedAt??0)-(a.completedAt??0)).map(a=>({id:a.id,title:a.title,summary:a.result?.summary??a.description??"",status:a.status==="needs-review"?"review":a.status,completedAt:a.completedAt,outputPath:a.result?.outputPath,prUrl:a.result?.prUrl,sourceTaskId:a.sourceTaskId,persona:a.personaHint??void 0,source:a.source}))}catch(t){return console.error("[MyDay] Failed to load queue results for decision cards:",t),[]}}function Xy(e,t){e.request("dailyBrief.syncTasks",t?{date:t}:{}).catch(n=>{console.warn("[MyDay] dailyBrief.syncTasks failed (non-blocking):",n)})}async function On(e){if(!(!e.client||!e.connected)){e.dailyBriefLoading=!0,e.dailyBriefError=null;try{e.dailyBrief=await hu(e.client,e.todaySelectedDate),e.loadBriefNotes&&await e.loadBriefNotes()}catch(t){e.dailyBriefError=t instanceof Error?t.message:"Failed to load daily brief",console.error("[MyDay] Brief load error:",t)}finally{e.dailyBriefLoading=!1}}}async function Zy(e,t){if(!(!e.client||!e.connected)){e.agentLogLoading=!0,e.agentLogError=null;try{e.agentLog=await fu(e.client,e.todaySelectedDate,t)}catch(n){e.agentLogError=n instanceof Error?n.message:"Failed to load agent log",console.error("[MyDay] Agent log load error:",n)}finally{e.agentLogLoading=!1}}}function vu(e){const t=e||ce(),n="VAULT",s=`01-Daily/${t}`,a=`obsidian://open?vault=${encodeURIComponent(n)}&file=${encodeURIComponent(s)}`;window.open(a,"_blank")}async function js(e){if(!e.client||!e.connected)return;e.myDayLoading=!0,e.myDayError=null,e.dailyBriefLoading=!0,e.agentLogLoading=!0,e.todayTasksLoading=!0;const t=e.todaySelectedDate,n=e.loadBriefNotes?Ln(e.loadBriefNotes(),5e3,"Brief Notes"):Promise.resolve(),s=await Promise.allSettled([Ln(hu(e.client,t),1e4,"Daily Brief"),n,Ln(fu(e.client,t),1e4,"Agent Log"),Ln(gu(e),8e3,"Today Tasks"),Ln(mu(e),5e3,"Inbox")]);e.dailyBrief=s[0].status==="fulfilled"?s[0].value:null,e.agentLog=s[2].status==="fulfilled"?s[2].value:null;const a=["Brief","Brief Notes","Agent Log","Today Tasks","Inbox"],i=s.map((o,l)=>o.status==="rejected"?{section:a[l],reason:o.reason}:null).filter(Boolean);if(i.length>0){for(const o of i)console.warn(`[MyDay] ${o.section} failed:`,o.reason);i.length===s.length&&(e.myDayError="Failed to load daily brief")}e.myDayLoading=!1,e.dailyBriefLoading=!1,e.agentLogLoading=!1,e.todayTasksLoading=!1}const Nn=Object.freeze(Object.defineProperty({__proto__:null,loadAgentLogOnly:Zy,loadBriefOnly:On,loadInboxItems:mu,loadMyDay:js,loadTodayQueueResults:Jy,loadTodayTasksWithQueueStatus:gu,openBriefInObsidian:vu,syncTodayTasks:Xy},Symbol.toStringTag,{value:"Module"}));async function Eo(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const t=await e.client.request("system-presence",{});Array.isArray(t)?(e.presenceEntries=t,e.presenceStatus=t.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(t){e.presenceError=String(t)}finally{e.presenceLoading=!1}}}function dn(e,t,n){if(!t.trim())return;const s={...e.skillMessages};n?s[t]=n:delete s[t],e.skillMessages=s}function la(e){return e instanceof Error?e.message:String(e)}async function os(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const n=await e.client.request("skills.status",{});n&&(e.skillsReport=n)}catch(n){e.skillsError=la(n)}finally{e.skillsLoading=!1}}}async function Ei(e){if(!(!e.client||!e.connected)){e.godmodeSkillsLoading=!0;try{const t=await e.client.request("godmode.skills.list",{});e.godmodeSkills=t??null}catch(t){console.error("[Skills] Failed to load GodMode skills:",t),e.godmodeSkills=null}finally{e.godmodeSkillsLoading=!1}}}function eb(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function tb(e,t,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:t,enabled:n}),await os(e),dn(e,t,{kind:"success",message:n?"Skill enabled":"Skill disabled"})}catch(s){const a=la(s);e.skillsError=a,dn(e,t,{kind:"error",message:a})}finally{e.skillsBusyKey=null}}}async function nb(e,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const n=e.skillEdits[t]??"";await e.client.request("skills.update",{skillKey:t,apiKey:n}),await os(e),dn(e,t,{kind:"success",message:"API key saved"})}catch(n){const s=la(n);e.skillsError=s,dn(e,t,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function sb(e,t,n,s){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const a=await e.client.request("skills.install",{name:n,installId:s,timeoutMs:12e4});await os(e),dn(e,t,{kind:"success",message:a?.message??"Installed"})}catch(a){const i=la(a);e.skillsError=i,dn(e,t,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function yu(e){if(!(!e.client||!e.connected)){e.workLoading=!0,e.workError=null;try{const t=await e.client.request("projects.list",{});e.workProjects=t.projects??[]}catch(t){console.error("[Work] Failed to load:",t),e.workError=t instanceof Error?t.message:"Failed to load"}finally{e.workLoading=!1}}}async function ab(e,t){if(!e.client||!e.connected)return;const n=new Set(e.workDetailLoading??[]);n.add(t),e.workDetailLoading=n;try{const s=await e.client.request("projects.get",{id:t,includeFiles:!0,depth:2});if(s){const a=s.files??[];e.workProjectFiles={...e.workProjectFiles,[t]:a}}}catch(s){console.warn("[Work] Failed to load project details:",s)}finally{const s=new Set(e.workDetailLoading??[]);s.delete(t),e.workDetailLoading=s}}async function bu(e){if(!(!e.client||!e.connected)){e.workResourcesLoading=!0;try{const t=await e.client.request("resources.list",{limit:100});e.workResources=t.resources??[]}catch(t){console.warn("[Work] Failed to load resources:",t),e.workResources=[]}finally{e.workResourcesLoading=!1}}}async function ib(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("resources.pin",{id:t,pinned:n}),e.workResources&&(e.workResources=e.workResources.map(s=>s.id===t?{...s,pinned:n}:s))}catch(s){console.warn("[Work] Failed to pin resource:",s)}}async function ob(e,t){if(!(!e.client||!e.connected))try{await e.client.request("resources.delete",{id:t}),e.workResources&&(e.workResources=e.workResources.filter(n=>n.id!==t))}catch(n){console.warn("[Work] Failed to delete resource:",n)}}function ca(e,t=Date.now()){if(typeof e=="number"&&Number.isFinite(e))return new Date(e);if(typeof e=="string"){const n=Date.parse(e);if(Number.isFinite(n))return new Date(n)}return new Date(t)}function Ro(e){return{id:e.id,name:e.name,emoji:e.emoji||"📁",type:e.type,path:e.path,artifactCount:e.artifactCount??0,sessionCount:e.sessionCount??0,lastUpdated:ca(e.lastUpdated,e.lastScanned)}}function Ha(e){return{path:e.path,name:e.name,type:e.type,size:e.size,modified:ca(e.modified),isDirectory:e.isDirectory,searchText:e.searchText}}function ml(e){return{id:e.id,key:e.key,title:e.title,created:ca(e.created),status:e.status,workspaceSubfolder:e.workspaceSubfolder}}function Bt(e){return{id:e.id,title:e.title,status:e.status,project:e.project,dueDate:e.dueDate,priority:e.priority,createdAt:e.createdAt,completedAt:e.completedAt}}function wu(e){return e.map(t=>({name:t.name,path:t.path,type:t.type,fileType:t.fileType,size:t.size,modified:t.modified?ca(t.modified):void 0,children:t.children?wu(t.children):void 0}))}function rb(e,t){return{...t,id:e.id,name:e.name,emoji:e.emoji,type:e.type,path:e.path,artifactCount:e.artifactCount,sessionCount:e.sessionCount,lastUpdated:e.lastUpdated}}async function da(e){if(!e.client||!e.connected){e.workspaces=[],e.workspacesLoading=!1,e.workspacesError="Connect to gateway to see workspaces";return}e.workspacesLoading=!0,e.workspacesError=null;try{const t=await e.client.request("workspaces.list",{});if(e.workspaces=(t.workspaces??[]).map(Ro),e.selectedWorkspace){const n=e.workspaces.find(s=>s.id===e.selectedWorkspace?.id);n&&(e.selectedWorkspace=rb(n,e.selectedWorkspace))}}catch(t){console.error("[Workspaces] load failed:",t),e.workspacesError=t instanceof Error?t.message:"Failed to load workspaces",e.workspaces=[]}finally{e.workspacesLoading=!1}}async function ua(e,t){if(!e.client||!e.connected)return null;try{const n=await e.client.request("workspaces.get",{id:t});return n.workspace?{...Ro(n.workspace),pinned:(n.pinned??[]).map(Ha),pinnedSessions:(n.pinnedSessions??[]).map(ml),outputs:(n.outputs??[]).map(Ha),folderTree:n.folderTree?wu(n.folderTree):void 0,sessions:(n.sessions??[]).map(ml),tasks:(n.tasks??[]).map(Bt),memory:(n.memory??[]).map(Ha)}:null}catch(n){return console.error("[Workspaces] get failed:",n),null}}async function lb(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("workspaces.readFile",n?{workspaceId:n,filePath:t}:{path:t});return s.content?{content:s.content,mime:s.contentType??s.mime??"text/plain"}:(s.error&&console.warn("[Workspaces] readFile failed:",s.error),null)}catch(s){return console.error("[Workspaces] readFile error:",s),null}}async function cb(e){if(!(!e.client||!e.connected))try{e.workspacesLoading=!0,e.workspacesError=null,await e.client.request("workspaces.scan",{}),await da(e)}catch(t){e.workspacesError=t instanceof Error?t.message:"Failed to scan workspaces"}finally{e.workspacesLoading=!1}}async function db(e,t){if(!t){e.selectedWorkspace=null;return}const n=await ua(e,t.id);e.selectedWorkspace=n||{...t,pinned:[],pinnedSessions:[],outputs:[],sessions:[],tasks:[]}}async function ub(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpin":"workspaces.pin",{workspaceId:t,filePath:n}),e.selectedWorkspace?.id===t){const a=await ua(e,t);a&&(e.selectedWorkspace=a)}return!0}catch(a){return console.error("[Workspaces] pin toggle failed:",a),!1}}async function pb(e,t,n,s){if(!e.client||!e.connected)return!1;try{if(await e.client.request(s?"workspaces.unpinSession":"workspaces.pinSession",{workspaceId:t,sessionKey:n}),e.selectedWorkspace?.id===t){const a=await ua(e,t);a&&(e.selectedWorkspace=a)}return!0}catch(a){return console.error("[Workspaces] session pin toggle failed:",a),!1}}async function hb(e,t){if(!e.client||!e.connected)return null;const n=String(t.name??"").trim();if(!n)return e.workspacesError="Workspace name is required",null;const s=t.type??"project",a=String(t.path??"").trim();try{const i=await e.client.request("workspaces.create",{name:n,type:s,...a?{path:a}:{}});if(!i.workspace)return e.workspacesError="Workspace creation returned no workspace",null;const o=Ro(i.workspace),l=e.workspaces??[],c=new Map(l.map(u=>[u.id,u]));return c.set(o.id,o),e.workspaces=Array.from(c.values()).toSorted((u,p)=>p.lastUpdated.getTime()-u.lastUpdated.getTime()),e.workspacesError=null,o}catch(i){return console.error("[Workspaces] create failed:",i),e.workspacesError=i instanceof Error?i.message:"Failed to create workspace",null}}async function fb(e,t){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.delete",{id:t}),e.workspaces=(e.workspaces??[]).filter(n=>n.id!==t),e.selectedWorkspace?.id===t&&(e.selectedWorkspace=null),e.workspacesError=null,!0}catch(n){return console.error("[Workspaces] delete failed:",n),e.workspacesError=n instanceof Error?n.message:"Failed to delete workspace",!1}}function gb(e,t){e.workspacesSearchQuery=t}function mb(e){e.selectedWorkspace=null}async function vb(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("workspaces.teamSetupPrompt",{});t?.prompt&&(e.chatMessage=t.prompt,e.setTab?.("chat"))}catch{e.chatMessage="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.",e.setTab?.("chat")}}function yb(e,t){const n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n}async function bb(e,t){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.byProject",{project:t})).tasks??[]).map(Bt)}catch(n){return console.error("[Workspaces] loadWorkspaceTasks failed:",n),[]}}async function wb(e){if(!e.client||!e.connected)return[];try{return((await e.client.request("tasks.list",{})).tasks??[]).map(Bt)}catch(t){return console.error("[Workspaces] loadAllTasks failed:",t),[]}}const kb={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};async function $b(e){if(!e.client||!e.connected)return[];try{const[t,n]=await Promise.all([e.client.request("tasks.list",{}),e.client.request("queue.list",{limit:100}).catch(()=>({items:[]}))]),s=new Map;for(const a of n.items)a.sourceTaskId&&(a.status==="processing"||a.status==="review"||a.status==="needs-review"||a.status==="failed")&&s.set(a.sourceTaskId,{status:a.status==="needs-review"?"review":a.status,type:a.type,roleName:kb[a.type]??a.type,queueItemId:a.id});return(t.tasks??[]).map(a=>({...Bt(a),queueStatus:s.get(a.id)??null}))}catch(t){return console.error("[Workspaces] loadAllTasksWithQueueStatus failed:",t),[]}}async function Sb(e,t,n){if(!e.client||!e.connected)return null;const s=n==="complete"?"pending":"complete";try{const a=await e.client.request("tasks.update",{id:t,status:s});return Bt(a)}catch(a){return console.error("[Workspaces] toggleTaskComplete failed:",a),null}}async function Ab(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.update",{id:t,...n});return Bt(s)}catch(s){return console.error("[Workspaces] updateTask failed:",s),null}}async function xb(e,t){if(!e.client||!e.connected)return null;try{return await e.client.request("tasks.openSession",{taskId:t})}catch(n){return console.error("[Workspaces] startTask failed:",n),null}}async function Tb(e,t,n){if(!e.client||!e.connected)return null;try{const s=await e.client.request("tasks.create",{title:t,project:n,source:"chat"});return Bt(s)}catch(s){return console.error("[Workspaces] createTask failed:",s),null}}async function _b(e,t,n){if(!e.client||!e.connected)return null;try{return await e.client.request("workspaces.browseFolder",{workspaceId:t,folderPath:n})}catch(s){return console.error("[Workspaces] browseFolder failed:",s),null}}async function Cb(e,t,n,s=50){if(!e.client||!e.connected)return[];try{return(await e.client.request("workspaces.search",{workspaceId:t,query:n,limit:s})).results??[]}catch(a){return console.error("[Workspaces] search failed:",a),[]}}async function Eb(e,t,n){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.createFolder",{workspaceId:t,folderPath:n}),!0}catch(s){return console.error("[Workspaces] createFolder failed:",s),!1}}async function Rb(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.moveFile",{workspaceId:t,sourcePath:n,destPath:s}),!0}catch(a){return console.error("[Workspaces] moveFile failed:",a),!1}}async function Lb(e,t,n,s){if(!e.client||!e.connected)return!1;try{return await e.client.request("workspaces.renameFile",{workspaceId:t,filePath:n,newName:s}),!0}catch(a){return console.error("[Workspaces] renameFile failed:",a),!1}}const he=Object.freeze(Object.defineProperty({__proto__:null,browseWorkspaceFolder:_b,clearWorkspaceSelection:mb,createTask:Tb,createWorkspace:hb,createWorkspaceFolder:Eb,deleteWorkspace:fb,getWorkspace:ua,loadAllTasks:wb,loadAllTasksWithQueueStatus:$b,loadWorkspaceTasks:bb,loadWorkspaces:da,moveWorkspaceFile:Rb,readWorkspaceFile:lb,renameWorkspaceFile:Lb,scanWorkspaces:cb,searchWorkspaceFiles:Cb,selectWorkspace:db,setWorkspacesSearchQuery:gb,startTask:xb,startTeamSetup:vb,toggleTaskComplete:Sb,toggleWorkspaceFolder:yb,toggleWorkspacePin:ub,toggleWorkspaceSessionPin:pb,updateTask:Ab},Symbol.toStringTag,{value:"Module"})),ku="godmode.ui.settings.v1";function Pb(){const e=new URLSearchParams(location.search),t=(()=>{const a=e.get("gatewayUrl");return a||(typeof window.__GODMODE_DEV__<"u"?"/ws":`${location.protocol==="https:"?"wss:":"ws:"}//${location.host}`)})(),n=e.get("token")||"",s={gatewayUrl:t,token:n,sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{System:!0,__missionControl__:!1},openTabs:[],tabLastViewed:{},userName:"",userAvatar:"",chatParallelView:!1,parallelLanes:[null,null,null,null]};try{const a=localStorage.getItem(ku);if(!a)return s;const i=JSON.parse(a);return{gatewayUrl:e.get("gatewayUrl")||(typeof window.__GODMODE_DEV__<"u"?"/ws":typeof i.gatewayUrl=="string"&&i.gatewayUrl.trim()?i.gatewayUrl.trim():s.gatewayUrl),token:n||(typeof i.token=="string"?i.token:""),sessionKey:typeof i.sessionKey=="string"&&i.sessionKey.trim()?i.sessionKey.trim():s.sessionKey,lastActiveSessionKey:typeof i.lastActiveSessionKey=="string"&&i.lastActiveSessionKey.trim()?i.lastActiveSessionKey.trim():typeof i.sessionKey=="string"&&i.sessionKey.trim()||s.lastActiveSessionKey,theme:i.theme==="light"||i.theme==="dark"||i.theme==="system"||i.theme==="lifetrack"?i.theme:s.theme,chatFocusMode:typeof i.chatFocusMode=="boolean"?i.chatFocusMode:s.chatFocusMode,chatShowThinking:typeof i.chatShowThinking=="boolean"?i.chatShowThinking:s.chatShowThinking,splitRatio:typeof i.splitRatio=="number"&&i.splitRatio>=.4&&i.splitRatio<=.7?i.splitRatio:s.splitRatio,navCollapsed:typeof i.navCollapsed=="boolean"?i.navCollapsed:s.navCollapsed,navGroupsCollapsed:typeof i.navGroupsCollapsed=="object"&&i.navGroupsCollapsed!==null?i.navGroupsCollapsed:s.navGroupsCollapsed,openTabs:Array.isArray(i.openTabs)&&i.openTabs.every(o=>typeof o=="string")?i.openTabs:s.openTabs,tabLastViewed:typeof i.tabLastViewed=="object"&&i.tabLastViewed!==null?i.tabLastViewed:s.tabLastViewed,userName:typeof i.userName=="string"?i.userName.trim().slice(0,50):s.userName,userAvatar:typeof i.userAvatar=="string"?i.userAvatar.trim():s.userAvatar,chatParallelView:typeof i.chatParallelView=="boolean"?i.chatParallelView:s.chatParallelView,parallelLanes:Array.isArray(i.parallelLanes)&&i.parallelLanes.length===4?i.parallelLanes.map(o=>typeof o=="string"?o:null):s.parallelLanes}}catch{return s}}function Ib(e){localStorage.setItem(ku,JSON.stringify(e))}const Db=56,Mb="quantum-particles",Ob="quantum-particle";let ct=null,Kn=null;function Ae(e,t){return Math.random()*(t-e)+e}function $u(){if(Su(),typeof document>"u")return;const e=document.querySelector(".shell");if(!e){Kn=requestAnimationFrame(()=>{Kn=null,$u()});return}ct=document.createElement("div"),ct.className=Mb,Object.assign(ct.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"1",overflow:"hidden"});for(let t=0;t<Db;t++){const n=document.createElement("div");n.className=Ob;const s=Ae(2,5),a=Ae(.3,.65),i=Ae(15,35),o=Ae(0,12),l=Ae(5,95),c=Ae(5,95),u=Ae(-150,150),p=Ae(-200,200),f=Ae(-250,250),v=Ae(-350,350),m=Ae(.8,1.5);Object.assign(n.style,{position:"absolute",left:`${l}%`,top:`${c}%`,width:`${s}px`,height:`${s}px`,borderRadius:"50%",background:`rgba(235, 158, 15, ${Ae(.7,1)})`,boxShadow:`0 0 ${s*3}px rgba(235, 158, 15, ${a*.7})`,opacity:"0",willChange:"transform, opacity",animation:`quantum-float ${i}s ${o}s ease-in-out infinite`}),n.style.setProperty("--particle-opacity",String(a)),n.style.setProperty("--drift-x",`${u}px`),n.style.setProperty("--drift-y",`${p}px`),n.style.setProperty("--drift-end-x",`${f}px`),n.style.setProperty("--drift-end-y",`${v}px`),n.style.setProperty("--particle-scale-mid",String(m)),ct.appendChild(n)}e.prepend(ct)}function Su(){Kn!==null&&(cancelAnimationFrame(Kn),Kn=null),ct&&(ct.remove(),ct=null)}function Nb(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"lifetrack"}function Lo(e){return e==="system"?Nb():e==="light"?"lifetrack":e}const Ss=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,Fb=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,Pn=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},Bb=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const a=globalThis.document??null;if(!a){t();return}const i=a.documentElement,o=a,l=Fb();if(!!o.startViewTransition&&!l){let u=.5,p=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")u=Ss(n.pointerClientX/window.innerWidth),p=Ss(n.pointerClientY/window.innerHeight);else if(n?.element){const v=n.element.getBoundingClientRect();v.width>0&&v.height>0&&typeof window<"u"&&(u=Ss((v.left+v.width/2)/window.innerWidth),p=Ss((v.top+v.height/2)/window.innerHeight))}i.style.setProperty("--theme-switch-x",`${u*100}%`),i.style.setProperty("--theme-switch-y",`${p*100}%`),i.classList.add("theme-transition");const f=setTimeout(()=>{Pn(i)},1e3);try{const v=o.startViewTransition?.(()=>{t()});v?.finished?v.finished.finally(()=>{clearTimeout(f),Pn(i)}):(clearTimeout(f),Pn(i))}catch{clearTimeout(f),Pn(i),t()}return}t(),Pn(i)};function Ub(e,t){const n=Array.isArray(e)?[...new Set(e.map(s=>s.trim()).filter(s=>s.length>0))]:[];if(n.length===0&&t){const s=t.toLowerCase();s==="main"||s==="agent:main:main"||s.endsWith(":main")||n.push(t)}return n}function zb(e){const t={};if(!e||typeof e!="object")return t;for(const[n,s]of Object.entries(e)){const a=n.trim();!a||typeof s!="number"||!Number.isFinite(s)||(t[a]=Math.max(t[a]??0,s))}return t}function Ze(e,t){const n=t.sessionKey.trim()||"main",s=Ub(t.openTabs,n),a=zb(t.tabLastViewed),i={...t,sessionKey:n,openTabs:s,tabLastViewed:a,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||n};e.settings=i,Ib(i),i.theme!==e.theme&&(e.theme=i.theme,ls(e,Lo(i.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function Po(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&Ze(e,{...e.settings,lastActiveSessionKey:n})}function Au(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),n=t.get("token"),s=t.get("password"),a=t.get("session"),i=t.get("gatewayUrl");let o=!1;if(n!=null){const c=n.trim();c&&c!==e.settings.token&&Ze(e,{...e.settings,token:c}),t.delete("token"),o=!0}if(s!=null){const c=s.trim();c&&(e.password=c),t.delete("password"),o=!0}if(a!=null){const c=a.trim();if(c){e.sessionKey=c;const u=c.toLowerCase(),f=u==="main"||u==="agent:main:main"||u.endsWith(":main")||e.settings.openTabs.includes(c)?e.settings.openTabs:[...e.settings.openTabs,c];Ze(e,{...e.settings,sessionKey:c,lastActiveSessionKey:c,openTabs:f})}}if(i!=null){const c=i.trim();c&&c!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=c),t.delete("gatewayUrl"),o=!0}if(!o)return;const l=new URL(window.location.href);l.search=t.toString(),window.history.replaceState({},"",l.toString())}function Io(e,t){const n=e.tab;if(n!==t&&(e.tab=t),n==="chat"&&t!=="chat"&&e.sessionKey===Q&&e._loadAllyHistory?.(),n==="dashboards"&&t!=="dashboards"){const s=e;if(s.dashboardPreviousSessionKey&&s.activeDashboardId){const a=s.dashboardPreviousSessionKey;s.dashboardPreviousSessionKey=null,s.activeDashboardId=null,s.activeDashboardManifest=null,s.activeDashboardHtml=null,s.dashboardChatOpen=!1,e.sessionKey=a}}t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?$o(e):So(e),t==="logs"?Ao(e):xo(e),t==="debug"?To(e):_o(e),t==="mission-control"?du(e):uu(e),rs(e),Mo(e,t,!1)}function xu(e,t,n){Bb({nextTheme:t,applyTheme:()=>{e.theme=t,Ze(e,{...e.settings,theme:t}),ls(e,Lo(t))},context:n,currentTheme:e.theme})}async function rs(e){if(e.tab==="overview"&&await Oo(e),(e.tab==="today"||e.tab==="my-day")&&(await js(e),E(()=>Promise.resolve().then(()=>Nn),void 0,import.meta.url).then(async({loadTodayQueueResults:t})=>{e.todayQueueResults=await t(e)}).catch(()=>{})),e.tab==="work"&&await Promise.all([yu(e),bu(e)]),e.tab==="workspaces"&&(await da(e),E(()=>Promise.resolve().then(()=>he),void 0,import.meta.url).then(async({loadAllTasksWithQueueStatus:t})=>{e.allTasks=await t(e)})),e.tab==="channels"&&await Pu(e),e.tab==="instances"&&await Eo(e),e.tab==="sessions"&&(await te(e),await Dt(e)),e.tab==="cron"&&await pa(e),e.tab==="skills"&&(await os(e),await Ei(e)),e.tab==="agents"){const{loadRoster:t}=await E(async()=>{const{loadRoster:n}=await Promise.resolve().then(()=>Nm);return{loadRoster:n}},void 0,import.meta.url);await t(e)}if(e.tab==="nodes"&&(await ia(e),await ht(e),await Xe(e),await Co(e)),e.tab==="chat"&&(await Bo(e),rn(e,!e.chatHasAutoScrolled)),e.tab==="options"){const t=e;typeof t.handleOptionsLoad=="function"&&await t.handleOptionsLoad()}if(e.tab==="trust"){const t=e,n=[];typeof t.handleTrustLoad=="function"&&n.push(t.handleTrustLoad()),n.push(Ft(t)),n.push(te(t)),await Promise.all(n)}if(e.tab==="guardrails"){const t=e;typeof t.handleGuardrailsLoad=="function"&&await t.handleGuardrailsLoad()}if(e.tab==="mission-control"){const t=e;typeof t.handleMissionControlRefresh=="function"&&await t.handleMissionControlRefresh()}if(e.tab==="setup"){const t=e;typeof t.handleLoadCapabilities=="function"&&t.handleLoadCapabilities()}if(e.tab==="dashboards"){const t=e;typeof t.handleDashboardsRefresh=="function"&&await t.handleDashboardsRefresh()}if(e.tab==="second-brain"){const t=e,n=t.secondBrainSubtab;n==="intel"?typeof t.handleIntelLoad=="function"&&await t.handleIntelLoad():n==="files"?typeof t.handleSecondBrainFileTreeRefresh=="function"&&await t.handleSecondBrainFileTreeRefresh():typeof t.handleSecondBrainRefresh=="function"&&await t.handleSecondBrainRefresh()}e.tab==="config"&&(await Pc(e),await Xe(e)),e.tab==="debug"&&(await oa(e),e.eventLog=Hv()),e.tab==="logs"&&(e.logsAtBottom=!0,await ko(e,{reset:!0}),Oc(e,!0))}function Tu(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?Zs(e):Uh(window.location.pathname)}function _u(e){e.theme=e.settings.theme??"system",ls(e,Lo(e.theme))}function ls(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t==="dark"?"dark":"light",t==="lifetrack"?$u():Su()}function Cu(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&ls(e,n.matches?"dark":"lifetrack")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function Eu(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function Ru(e,t){if(typeof window>"u")return;const n=Bc(window.location.pathname,e.basePath)??"chat";Do(e,n),Mo(e,n,t)}function Lu(e){if(typeof window>"u")return;const t=Bc(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();if(s){e.sessionKey=s;const a=e.settings.openTabs.includes(s)?e.settings.openTabs:[...e.settings.openTabs,s];Ze(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s,openTabs:a})}Do(e,t)}function Do(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="nodes"?$o(e):So(e),t==="logs"?Ao(e):xo(e),t==="debug"?To(e):_o(e),t==="mission-control"?du(e):uu(e),e.connected&&rs(e)}function Mo(e,t,n){if(typeof window>"u")return;const s=Qn(ji(t,e.basePath)),a=Qn(window.location.pathname),i=new URL(window.location.href);t==="chat"&&e.sessionKey?i.searchParams.set("session",e.sessionKey):i.searchParams.delete("session"),a!==s&&(i.pathname=s),n?window.history.replaceState({},"",i.toString()):window.history.pushState({},"",i.toString())}function ye(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),n?window.history.replaceState({},"",s.toString()):window.history.pushState({},"",s.toString())}async function Oo(e){await Promise.all([Me(e,!1),Eo(e),te(e),is(e),oa(e)])}async function Pu(e){await Promise.all([Me(e,!0),Pc(e),Xe(e)])}async function pa(e){await Promise.all([Me(e,!1),is(e),ra(e)])}const Kb=Object.freeze(Object.defineProperty({__proto__:null,applyResolvedTheme:ls,applySettings:Ze,applySettingsFromUrl:Au,attachThemeListener:Cu,detachThemeListener:Eu,inferBasePath:Tu,loadChannelsTab:Pu,loadCron:pa,loadOverview:Oo,onPopState:Lu,refreshActiveTab:rs,setLastActiveSessionKey:Po,setTab:Io,setTabFromRoute:Do,setTheme:xu,syncTabWithLocation:Ru,syncThemeWithSettings:_u,syncUrlWithSessionKey:ye,syncUrlWithTab:Mo},Symbol.toStringTag,{value:"Module"}));function Vs(e){return e.chatSending||!!e.chatRunId}function $e(e,t){const n=t??e.sessionKey,s=e.chatMessage.trim();if(s)e.chatDrafts={...e.chatDrafts,[n]:s};else{const{[n]:a,...i}=e.chatDrafts;e.chatDrafts=i}}function Pe(e,t){const n=t??e.sessionKey;e.chatMessage=e.chatDrafts[n]??""}function Iu(e,t){const n=t??e.sessionKey,{[n]:s,...a}=e.chatDrafts;e.chatDrafts=a,n===e.sessionKey&&(e.chatMessage="")}function Du(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function Wb(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function No(e){e.connected&&(e.chatMessage="",await ho(e))}function qb(e,t,n){const s=t.trim(),a=!!(n&&n.length>0);if(!s&&!a)return;const i=Date.now();e.chatQueue=[...e.chatQueue,{id:sa(),text:s,createdAt:i,attachments:a?n?.map(l=>({...l})):void 0}];const o=[];if(s&&o.push({type:"text",text:s}),a&&n)for(const l of n)o.push({type:"image",source:{type:"base64",media_type:l.mimeType,data:l.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:o,timestamp:i}],rn(e,!0)}async function Ri(e,t,n){Hi(e);const s=e;s.sessionKey&&s.workingSessions&&(s.workingSessions=new Set([...s.workingSessions,s.sessionKey])),n?.skipOptimisticUpdate||queueMicrotask(()=>{rn(e,!0)});const a=await po(e,t,n?.attachments,{skipOptimisticUpdate:n?.skipOptimisticUpdate});return!a&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!a&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),a&&(Po(e,e.sessionKey),e.chatAttachments=[]),a&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),a&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),rn(e,!0),a&&!e.chatRunId&&Fo(e),a&&n?.refreshSessions&&(e.refreshSessionsAfterChat=!0),a}async function Fo(e){if(!e.connected||Vs(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await Ri(e,t.text,{attachments:t.attachments,skipOptimisticUpdate:!0})||(e.chatQueue=[t,...e.chatQueue])}function Mu(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function Ou(e,t,n){if(!e.connected)return;const s=e.chatMessage,a=(t??e.chatMessage).trim(),i=e.chatAttachments??[],o=t==null?i:[],l=o.length>0;if(!a&&!l)return;if(Du(a)){await No(e);return}const c=Wb(a);if(t==null&&(e.chatMessage="",Iu(e)),n?.queue){qb(e,a,o),Vs(e)||await Fo(e);return}if(Vs(e)){await ho(e),await new Promise(u=>setTimeout(u,50)),await Ri(e,a,{attachments:l?o:void 0,refreshSessions:c});return}await Ri(e,a,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:l?o:void 0,previousAttachments:t==null?i:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:c})}async function Bo(e){await Promise.all([se(e),te(e,{activeMinutes:0}),Hs(e)]),rn(e,!0)}const Nu=Fo;function jb(e){const t=Mc(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function Vb(e,t){const n=Zs(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function Hs(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=jb(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=Vb(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const a=await s.json(),i=typeof a.avatarUrl=="string"?a.avatarUrl.trim():"";e.chatAvatarUrl=i||null}catch{e.chatAvatarUrl=null}}const Ga=Object.freeze(Object.defineProperty({__proto__:null,clearDraft:Iu,flushChatQueueForEvent:Nu,handleAbortChat:No,handleSendChat:Ou,isChatBusy:Vs,isChatStopCommand:Du,refreshChat:Bo,refreshChatAvatar:Hs,removeQueuedMessage:Mu,restoreDraft:Pe,saveDraft:$e},Symbol.toStringTag,{value:"Module"})),Hb={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},Gb={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};const{I:Qb}=ah,vl=e=>e,Yb=e=>e.strings===void 0,yl=()=>document.createComment(""),In=(e,t,n)=>{const s=e._$AA.parentNode,a=t===void 0?e._$AB:t._$AA;if(n===void 0){const i=s.insertBefore(yl(),a),o=s.insertBefore(yl(),a);n=new Qb(i,o,e,e.options)}else{const i=n._$AB.nextSibling,o=n._$AM,l=o!==e;if(l){let c;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(c=e._$AU)!==o._$AU&&n._$AP(c)}if(i!==a||l){let c=n._$AA;for(;c!==i;){const u=vl(c).nextSibling;vl(s).insertBefore(c,a),c=u}}}return n},yt=(e,t,n=e)=>(e._$AI(t,n),e),Jb={},Xb=(e,t=Jb)=>e._$AH=t,Zb=e=>e._$AH,Qa=e=>{e._$AR(),e._$AA.remove()};const bl=(e,t,n)=>{const s=new Map;for(let a=t;a<=n;a++)s.set(e[a],a);return s},ha=Qi(class extends Yi{constructor(e){if(super(e),e.type!==Gi.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let s;n===void 0?n=t:t!==void 0&&(s=t);const a=[],i=[];let o=0;for(const l of e)a[o]=s?s(l,o):o,i[o]=n(l,o),o++;return{values:i,keys:a}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,s]){const a=Zb(e),{values:i,keys:o}=this.dt(t,n,s);if(!Array.isArray(a))return this.ut=o,i;const l=this.ut??=[],c=[];let u,p,f=0,v=a.length-1,m=0,k=i.length-1;for(;f<=v&&m<=k;)if(a[f]===null)f++;else if(a[v]===null)v--;else if(l[f]===o[m])c[m]=yt(a[f],i[m]),f++,m++;else if(l[v]===o[k])c[k]=yt(a[v],i[k]),v--,k--;else if(l[f]===o[k])c[k]=yt(a[f],i[k]),In(e,c[k+1],a[f]),f++,k--;else if(l[v]===o[m])c[m]=yt(a[v],i[m]),In(e,a[f],a[v]),v--,m++;else if(u===void 0&&(u=bl(o,m,k),p=bl(l,f,v)),u.has(l[f]))if(u.has(l[v])){const d=p.get(o[m]),g=d!==void 0?a[d]:null;if(g===null){const S=In(e,a[f]);yt(S,i[m]),c[m]=S}else c[m]=yt(g,i[m]),In(e,a[f],g),a[d]=null;m++}else Qa(a[v]),v--;else Qa(a[f]),f++;for(;m<=k;){const d=In(e,c[k+1]);yt(d,i[m]),c[m++]=d}for(;f<=v;){const d=a[f++];d!==null&&Qa(d)}return this.ut=o,Xb(e,c),ut}});function fa(e){$e(e);const n=`agent:main:webchat-${sa().slice(0,8)}`;e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,n],sessionKey:n,lastActiveSessionKey:n,tabLastViewed:{...e.settings.tabLastViewed,[n]:Date.now()}}),e.sessionKey=n,e.chatMessage="",e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,n,!0),se(e)}function Li(e,t){const n=ji(t,e.basePath);return r`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||(s.preventDefault(),e.setTab(t))}}
      title=${Yn(t)}
    >
      <span class="nav-item__emoji" aria-hidden="true">${zh(t)}</span>
      <span class="nav-item__text">${Yn(t)}</span>
    </a>
  `}function Fu(e){const t=e.onboarding,n=e.onboarding,s=e.onboarding?!1:e.settings.chatShowThinking,a=e.onboarding?!0:e.settings.chatFocusMode,i=r`
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
        @click=${()=>fa(e)}
        title="Start a new session (⌘⇧P)"
        aria-label="New session"
      >
        ${l}
      </button>
      <!-- Session picker (folder dropdown) -->
      <div class="session-picker-container">
        <button
          class="chat-toolbar__btn ${e.sessionPickerOpen?"active":""}"
          @click=${u=>{const f=u.currentTarget.getBoundingClientRect();e.sessionPickerPosition={top:f.bottom+8,right:window.innerWidth-f.right},e.sessionPickerOpen||te(e),e.handleToggleSessionPicker()}}
          title="Open sessions"
          aria-label="Open sessions"
          aria-expanded=${e.sessionPickerOpen}
        >
          ${q.folderOpen}
        </button>
        ${e.sessionPickerOpen?nw(e):h}
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
        ${e.sessionSearchOpen?tw(e):h}
      </div>
      <span class="chat-toolbar__separator"></span>
      <!-- Refresh button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),Bo(e)}}
        title="Refresh chat data"
      >
        ${i}
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
        class="chat-toolbar__btn ${a?"active":""}"
        ?disabled=${n}
        @click=${()=>{n||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})}}
        aria-pressed=${a}
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
      <!-- Parallel sessions toggle -->
      <button
        class="chat-toolbar__btn ${e.settings.chatParallelView?"active":""}"
        @click=${()=>e.applySettings({...e.settings,chatParallelView:!e.settings.chatParallelView})}
        aria-pressed=${e.settings.chatParallelView}
        title=${e.settings.chatParallelView?"Exit parallel sessions view":"Parallel sessions view"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="18" rx="1"></rect>
          <rect x="14" y="3" width="7" height="18" rx="1"></rect>
        </svg>
      </button>
      <span class="chat-toolbar__separator"></span>
      <!-- Compact chat button -->
      <button
        class="chat-toolbar__btn"
        ?disabled=${!e.connected}
        @click=${()=>{e.handleCompactChat()}}
        title="Compact chat context"
      >
        ${q.minimize}
      </button>
    </div>
  `}function ew(e){const t=new Date,n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=new Date(n.getTime()-864e5);return{today:e.filter(a=>a.updatedAt&&new Date(a.updatedAt)>=n),yesterday:e.filter(a=>a.updatedAt&&new Date(a.updatedAt)>=s&&new Date(a.updatedAt)<n),older:e.filter(a=>!a.updatedAt||new Date(a.updatedAt)<s)}}let Ya=null;function tw(e){if(!e.client||!e.connected)return r`
      <div
        class="session-search-dropdown"
        style="top: ${e.sessionSearchPosition?.top??0}px; right: ${e.sessionSearchPosition?.right??0}px;"
      >
        <div class="session-search-list">
          <div class="session-search-empty">Not connected</div>
        </div>
      </div>
    `;const t=a=>{const i=a.target.value;e.sessionSearchQuery=i,Ya&&clearTimeout(Ya),Ya=setTimeout(()=>{e.handleSessionSearchQuery(i)},300)},n=a=>{e.sessionSearchOpen=!1,e.sessionSearchQuery="",e.sessionSearchResults=[],$e(e),e.settings.openTabs.includes(a)?(e.sessionKey=a,e.applySettings({...e.settings,sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,a],sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}}),e.sessionKey=a),Pe(e,a),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,a,!0),se(e)},s=a=>{const i=a.label??a.displayName??a.key,o=a.matches.length>0;return r`
      <div class="session-search-result" @click=${()=>n(a.key)}>
        <div class="session-search-result__header">
          <span class="session-search-result__name">${i}</span>
        </div>
        ${o?r`
              <div class="session-search-result__matches">
                ${a.matches.slice(0,2).map(l=>r`
                    <div class="session-search-result__match">
                      <span class="session-search-result__role">${l.role}:</span>
                      <span class="session-search-result__text">${l.text}</span>
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
          @click=${a=>a.stopPropagation()}
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
  `}function nw(e){const t=(e.sessionPickerSearch??"").toLowerCase().trim();if(!e.client||!e.connected)return r`
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
    `;let n=(e.sessionsResult?.sessions??[]).filter(v=>!e.settings.openTabs.includes(v.key));t&&(n=n.filter(v=>[v.label,v.displayName,v.key].filter(Boolean).some(k=>k.toLowerCase().includes(t))));const s=50,a=n.length,i=n.slice(0,s),o=ew(i),l=v=>{e.sessionPickerOpen=!1,e.sessionPickerSearch="",$e(e),e.settings.openTabs.includes(v)?(e.sessionKey=v,e.applySettings({...e.settings,sessionKey:v,lastActiveSessionKey:v,tabLastViewed:{...e.settings.tabLastViewed,[v]:Date.now()}})):(e.applySettings({...e.settings,openTabs:[...e.settings.openTabs,v],sessionKey:v,lastActiveSessionKey:v,tabLastViewed:{...e.settings.tabLastViewed,[v]:Date.now()}}),e.sessionKey=v),Pe(e,v),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,v,!0),se(e)},c=async(v,m)=>{if(v.stopPropagation(),!!window.confirm(`Delete session "${m}"?

Deletes the session entry and archives its transcript.`)&&(e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.filter(d=>d.key!==m)}),e.client&&e.connected))try{await e.client.request("sessions.delete",{key:m,deleteTranscript:!0}),te(e)}catch(d){console.error("Failed to delete session:",d),te(e)}},u=v=>r`
    <div class="session-picker-item" @click=${()=>l(v.key)}>
      <span class="session-picker-item__status ${v.isActive?"active":""}"></span>
      <div class="session-picker-item__content">
        <div class="session-picker-item__name">${v.label??v.displayName??v.key}</div>
      </div>
      <div class="session-picker-item__actions">
        ${v.updatedAt?r`<span class="session-picker-item__time">${Hh(v.updatedAt)}</span>`:h}
        <button
          class="session-picker-item__close"
          @click=${m=>c(m,v.key)}
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
  `,p=(v,m)=>m.length===0?h:r`
      <div class="session-picker-group">
        <div class="session-picker-group__header">${v}</div>
        ${ha(m,k=>k.key,u)}
      </div>
    `,f=o.today.length+o.yesterday.length+o.older.length;return r`
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
        ${f===0?r`
                <div class="session-picker-empty">No other sessions</div>
              `:r`
              ${p("Today",o.today)}
              ${p("Yesterday",o.yesterday)}
              ${p("Older",o.older)}
              ${a>s?r`<div class="session-picker-overflow">
                    Showing ${s} of ${a} sessions. Use search to find more.
                  </div>`:h}
            `}
      </div>
    </div>
  `}const sw=["system","light","dark","lifetrack"];function Bu(e){const t=Math.max(0,sw.indexOf(e.theme)),n=s=>a=>{const o={element:a.currentTarget};(a.clientX||a.clientY)&&(o.pointerClientX=a.clientX,o.pointerClientY=a.clientY),e.setTheme(s,o)};return r`
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
          ${ow()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${aw()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${iw()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="lifetrack"?"active":""}"
          @click=${n("lifetrack")}
          aria-pressed=${e.theme==="lifetrack"}
          aria-label="Lifetrack theme"
          title="Lifetrack"
        >
          ${rw()}
        </button>
      </div>
    </div>
  `}function aw(){return r`
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
  `}function iw(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function ow(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function rw(){return r`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"></path>
      <path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67L19 15z"></path>
    </svg>
  `}const it=Object.freeze(Object.defineProperty({__proto__:null,createNewSession:fa,renderChatControls:Fu,renderTab:Li,renderThemeToggle:Bu},Symbol.toStringTag,{value:"Module"})),Ja=new Set;function wl(e){if(!(!e.connected||!e.client||!e.settings.chatParallelView))for(const t of e.settings.parallelLanes){const n=t?.trim();if(!n)continue;const a=Te(e.sessionsResult?.sessions,n)?.key??n;if(We.has(n)||We.has(a)||Ja.has(a))continue;Ja.add(a);const o=e.client;uo(o,a).then(l=>{a!==n&&l.length>0&&We.set(n,l)}).finally(()=>{Ja.delete(a),e.applySettings({...e.settings})})}}function Uu(e){e.basePath=Tu(),e._urlSettingsApplied||(Au(e),e._urlSettingsApplied=!0),Ru(e,!0),_u(e),Cu(e),window.addEventListener("popstate",e.popStateHandler),e.keydownHandler=t=>{if(e.tab!=="chat")return;if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="p"){t.preventDefault(),fa(e);return}if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="h"){t.preventDefault(),e.handleConsciousnessFlush();return}if(!t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.key<"1"||t.key>"9")return;const n=parseInt(t.key,10)-1,s=e.settings.openTabs;if(n>=s.length)return;const a=s[n];a!==e.sessionKey&&(t.preventDefault(),$e(e),e.sessionKey=a,Pe(e,a),e.chatLoading=!0,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:a,lastActiveSessionKey:a,tabLastViewed:{...e.settings.tabLastViewed,[a]:Date.now()}}),e.loadAssistantIdentity(),ye(e,a,!0),se(e).then(()=>{ru(e)}))},window.addEventListener("keydown",e.keydownHandler),wo(e),e.tab==="nodes"&&$o(e),e.tab==="logs"&&Ao(e),e.tab==="debug"&&To(e)}function zu(e){Nh(e)}function Ku(e){window.removeEventListener("popstate",e.popStateHandler),window.removeEventListener("keydown",e.keydownHandler),e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null),e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null),So(e),xo(e),_o(e),Eu(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function Te(e,t){if(!e||!t)return;const n=e.find(o=>o.key===t);if(n)return n;const s=t.split(":"),a=s[s.length-1];if(a&&a.length>=4){const o=e.find(l=>l.key===a||l.key.endsWith(`:${a}`));if(o)return o}const i=t.replace(/^webchat:/,"");if(i!==t){const o=e.find(l=>l.key.endsWith(i)||l.key.endsWith(`:${i}`));if(o)return o}}function lw(e,t){if(!t||t.length===0)return;const n=c=>{const u=c.toLowerCase();return u==="main"||u==="agent:main:main"||u.endsWith(":main")},s=(c,u)=>{const p=c?.sessionId?.trim();if(p)return`session:${p}`;if(c){const v=[c.kind,c.surface,c.subject,c.room,c.space,c.label,c.displayName].map(m=>String(m??"").trim().toLowerCase()).join("|");if(v.replace(/\|/g,"").length>0)return`meta:${v}`}return`key:${u}`};let a=!1;const i=new Map,o=[];for(const c of e.settings.openTabs){const u=c.trim();if(!u){a=!0;continue}if(n(u)){a=!0;continue}const p=Te(t,u),f=p?.key??u;f!==c&&(a=!0);const v=s(p,f);if(i.has(v)){a=!0;continue}i.set(v,f),o.push(f)}const l=o.length!==e.settings.openTabs.length;if(a||l){const c={};for(const[k,d]of Object.entries(e.settings.tabLastViewed)){const g=k.trim();if(!g||typeof d!="number"||!Number.isFinite(d))continue;const S=Te(t,g),A=s(S,S?.key??g),T=i.get(A)??S?.key??g;c[T]=Math.max(c[T]??0,d)}const u=Te(t,e.sessionKey),p=s(u,u?.key??e.sessionKey.trim()),f=i.get(p)??u?.key??(e.sessionKey.trim()||o[0]||"main"),m=f==="main"||f.endsWith(":main")||o.includes(f)?f:o[0]||"main";e.applySettings({...e.settings,openTabs:o,sessionKey:m,lastActiveSessionKey:m,tabLastViewed:c}),e.sessionKey!==m&&(e.sessionKey=m)}}function Wu(e,t){if((t.has("sessionsResult")||t.has("settings"))&&e.sessionsResult?.sessions&&lw(e,e.sessionsResult.sessions),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.settings.chatParallelView&&wl(e),t.has("settings")&&e.connected&&e.settings.chatParallelView){const n=t.get("settings"),s=n?!n.chatParallelView:!0,a=!n||n.parallelLanes.some((i,o)=>i!==e.settings.parallelLanes[o]);(s||a)&&wl(e)}if(t.has("sessionPickerOpen")&&(e.sessionPickerOpen?setTimeout(()=>{e.sessionPickerOpen&&(e.sessionPickerClickOutsideHandler=n=>{const s=n.target,a=s.closest(".session-picker-container"),i=s.closest(".session-picker-dropdown");!a&&!i&&(e.sessionPickerOpen=!1)},document.addEventListener("click",e.sessionPickerClickOutsideHandler,!0))},0):e.sessionPickerClickOutsideHandler&&(document.removeEventListener("click",e.sessionPickerClickOutsideHandler,!0),e.sessionPickerClickOutsideHandler=null)),t.has("sessionSearchOpen")&&(e.sessionSearchOpen?setTimeout(()=>{e.sessionSearchOpen&&(e.sessionSearchClickOutsideHandler=n=>{const s=n.target,a=s.closest(".session-search-container"),i=s.closest(".session-search-dropdown");!a&&!i&&(e.sessionSearchOpen=!1)},document.addEventListener("click",e.sessionSearchClickOutsideHandler,!0))},0):e.sessionSearchClickOutsideHandler&&(document.removeEventListener("click",e.sessionSearchClickOutsideHandler,!0),e.sessionSearchClickOutsideHandler=null)),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab==="chat"&&!e.chatLoading&&se(e).then(()=>{ru(e)}),t.has("connected")&&t.get("connected")===!1&&e.connected&&e.tab!=="chat"&&rs(e),e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("sessionKey")||t.has("tab"))){const n=t.has("tab"),s=t.has("sessionKey"),a=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;let i=!1;if(t.has("chatMessages")){const o=e.chatMessages;o[o.length-1]?.role==="user"&&(i=!0)}t.has("chatStream")&&(i=!1),(n||s||a)&&Nc(e),rn(e,n||s||a||i||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&Oc(e,t.has("tab")||t.has("logsAutoFollow"))}const cw=Object.freeze(Object.defineProperty({__proto__:null,findSessionByKey:Te,handleConnected:Uu,handleDisconnected:Ku,handleFirstUpdated:zu,handleUpdated:Wu},Symbol.toStringTag,{value:"Module"}));async function kl(e,t){return!1}async function dw(e,t){return null}function $l(e){return e.charAt(0).toUpperCase()||"A"}function Sl(e){if(!e)return"";const t=new Date(e),n=t.getHours(),s=t.getMinutes().toString().padStart(2,"0"),a=n>=12?"PM":"AM";return`${n%12||12}:${s} ${a}`}function uw(e){e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,120)}px`}function qu(e,t=80){return e.scrollHeight-e.scrollTop-e.clientHeight<t}function ju(e){const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)}const Al=new WeakMap;function pw(e){requestAnimationFrame(()=>{const t=document.querySelector(".ally-panel, .ally-inline");if(!t)return;const n=t.querySelector(".ally-panel__messages");if(!n)return;const s=Al.get(n),a=s??{lastMsgCount:0,lastStreamLen:0},i=e.messages.length,o=e.stream?.length??0,l=i!==a.lastMsgCount||o>a.lastStreamLen;Al.set(n,{lastMsgCount:i,lastStreamLen:o}),l&&(!s||qu(n,120))&&ju(t)})}function hw(e){const t=e.currentTarget,n=t.querySelector(".ally-jump-bottom");n&&n.classList.toggle("ally-jump-bottom--visible",!qu(t))}function Vu(e,t){return e.allyAvatar?r`<img class=${t==="bubble"?"ally-bubble__avatar":"ally-panel__header-avatar"} src=${e.allyAvatar} alt=${e.allyName} />`:t==="header"?r`<span class="ally-panel__header-initial">${$l(e.allyName)}</span>`:r`${$l(e.allyName)}`}function xl(e){if(e.role==="assistant"&&e.content){const t=Se(e.content);return r`<div class="ally-msg__content chat-text">${Ce(t)}</div>`}return r`<span class="ally-msg__content">${e.content}</span>`}function fw(e,t){return!e.actions||e.actions.length===0?h:r`
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
  `}function gw(e,t,n){if(e.isNotification)return r`
      <div class="ally-msg ally-msg--notification" data-idx=${t}>
        ${xl(e)}
        ${fw(e,n)}
        ${e.timestamp?r`<div class="ally-msg__time">${Sl(e.timestamp)}</div>`:h}
      </div>
    `;const s=e.role==="user"?"ally-msg--user":"ally-msg--assistant";return r`
    <div class="ally-msg ${s}" data-idx=${t}>
      ${xl(e)}
      ${e.timestamp?r`<div class="ally-msg__time">${Sl(e.timestamp)}</div>`:h}
    </div>
  `}function mw(e){if(!e)return h;const t=id(e);return r`
    <div class="ally-msg ally-msg--streaming">
      <div class="ally-msg__content chat-text">${Ce(t)}</div>
    </div>
  `}function vw(e){return e.connected?h:r`<div class="ally-panel__status ally-panel__status--disconnected">Disconnected</div>`}function yw(){return r`
    <div class="ally-msg ally-msg--assistant ally-msg--reading-indicator">
      <span class="chat-reading-indicator__dots">
        <span></span><span></span><span></span>
      </span>
    </div>
  `}function bw(e,t){const n=e.clipboardData?.items;if(!n)return;const s=[];for(const a of Array.from(n)){if(!a.type.startsWith("image/"))continue;const i=a.getAsFile();if(!i)continue;e.preventDefault();const o=new FileReader,l=`paste-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;o.onload=()=>{const c=o.result;t.onAttachmentsChange([...t.attachments,{id:l,dataUrl:c,mimeType:i.type,fileName:i.name||"screenshot.png",status:"ready"}])},o.readAsDataURL(i),s.push({id:l,dataUrl:"",mimeType:i.type,fileName:i.name,status:"reading"})}s.length>0&&t.onAttachmentsChange([...t.attachments,...s])}function ww(e){return e.attachments.length===0?h:r`
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
  `}function kw(e){const t=e.connected?`Message ${e.allyName}...`:"Reconnecting...",n=e.draft.trim()||e.attachments.length>0;return r`
    ${ww(e)}
    <div class="ally-panel__input">
      <textarea
        class="ally-panel__textarea"
        .value=${e.draft}
        ?disabled=${!e.connected||e.sending}
        placeholder=${t}
        rows="1"
        @input=${s=>{const a=s.target;uw(a),e.onDraftChange(a.value)}}
        @paste=${s=>bw(s,e)}
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
  `}function $w(e){return r`
    <div class="ally-bubble">
      <button
        type="button"
        class="ally-bubble__btn"
        title="Chat with ${e.allyName}"
        aria-label="Open ${e.allyName} chat"
        @click=${()=>e.onToggle()}
      >
        ${Vu(e,"bubble")}
        ${e.isWorking?r`<span class="ally-bubble__working"></span>`:h}
      </button>
      ${e.unreadCount>0?r`<span class="ally-bubble__badge">${e.unreadCount>99?"99+":e.unreadCount}</span>`:h}
    </div>
  `}function Hu(e){return pw(e),r`
    <div class="ally-panel__header">
      <div class="ally-panel__header-left">
        ${Vu(e,"header")}
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

    ${vw(e)}

    <div class="ally-panel__messages" @scroll=${hw}>
      ${e.messages.length===0&&!e.stream?r`<div class="ally-panel__empty">
            Start a conversation with ${e.allyName}
          </div>`:h}
      ${e.messages.map((t,n)=>gw(t,n,e.onAction))}
      ${e.stream?mw(e.stream):h}
      ${(e.isWorking||e.sending)&&!e.stream?yw():h}
      <button
        type="button"
        class="ally-jump-bottom"
        title="Jump to latest"
        @click=${t=>{const n=t.currentTarget.closest(".ally-panel, .ally-inline");n&&ju(n)}}
      >${q.chevronDown}</button>
    </div>

    ${kw(e)}
  `}function Sw(e){return e.open?r`
    <div class="ally-panel">
      ${Hu(e)}
    </div>
  `:$w(e)}function Aw(e){return e.open?r`
    <div class="ally-inline">
      ${Hu(e)}
    </div>
  `:h}function qe(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function Gu(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(qe(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function ga(e){return e.filter(t=>typeof t=="string").join(".")}function _e(e,t){const n=ga(e),s=t[n];if(s)return s;const a=n.split(".");for(const[i,o]of Object.entries(t)){if(!i.includes("*"))continue;const l=i.split(".");if(l.length!==a.length)continue;let c=!0;for(let u=0;u<a.length;u+=1)if(l[u]!=="*"&&l[u]!==a[u]){c=!1;break}if(c)return o}}function nt(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function xw(e){const t=ga(e).toLowerCase();return t.includes("token")||t.includes("password")||t.includes("secret")||t.includes("apikey")||t.endsWith("key")}function sn(e){return typeof e=="string"?e:e==null?"":typeof e=="object"?JSON.stringify(e):String(e)}const Tw=new Set(["title","description","default","nullable"]);function _w(e){return Object.keys(e??{}).filter(n=>!Tw.has(n)).length===0}function Cw(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const ns={chevronDown:r`
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
  `};function et(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,onPatch:l}=e,c=e.showLabel??!0,u=qe(t),p=_e(s,a),f=p?.label??t.title??nt(String(s.at(-1))),v=p?.help??t.description,m=ga(s);if(i.has(m))return r`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${f}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const d=(t.anyOf??t.oneOf??[]).filter(_=>!(_.type==="null"||Array.isArray(_.type)&&_.type.includes("null")));if(d.length===1)return et({...e,schema:d[0]});const g=_=>{if(_.const!==void 0)return _.const;if(_.enum&&_.enum.length===1)return _.enum[0]},S=d.map(g),A=S.every(_=>_!==void 0);if(A&&S.length>0&&S.length<=5){const _=n??t.default;return r`
        <div class="cfg-field">
          ${c?r`<label class="cfg-field__label">${f}</label>`:h}
          ${v?r`<div class="cfg-field__help">${v}</div>`:h}
          <div class="cfg-segmented">
            ${S.map((L,R)=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${L===_||sn(L)===sn(_)?"active":""}"
                ?disabled=${o}
                @click=${()=>l(s,L)}
              >
                ${sn(L)}
              </button>
            `)}
          </div>
        </div>
      `}if(A&&S.length>5)return _l({...e,options:S,value:n??t.default});const T=new Set(d.map(_=>qe(_)).filter(Boolean)),x=new Set([...T].map(_=>_==="integer"?"number":_));if([...x].every(_=>["string","number","boolean"].includes(_))){const _=x.has("string"),L=x.has("number");if(x.has("boolean")&&x.size===1)return et({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(_||L)return Tl({...e,inputType:L&&!_?"number":"text"})}}if(t.enum){const k=t.enum;if(k.length<=5){const d=n??t.default;return r`
        <div class="cfg-field">
          ${c?r`<label class="cfg-field__label">${f}</label>`:h}
          ${v?r`<div class="cfg-field__help">${v}</div>`:h}
          <div class="cfg-segmented">
            ${k.map(g=>r`
              <button
                type="button"
                class="cfg-segmented__btn ${g===d||String(g)===String(d)?"active":""}"
                ?disabled=${o}
                @click=${()=>l(s,g)}
              >
                ${String(g)}
              </button>
            `)}
          </div>
        </div>
      `}return _l({...e,options:k,value:n??t.default})}if(u==="object")return Rw(e);if(u==="array")return Lw(e);if(u==="boolean"){const k=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return r`
      <label class="cfg-toggle-row ${o?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${f}</span>
          ${v?r`<span class="cfg-toggle-row__help">${v}</span>`:h}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${k}
            ?disabled=${o}
            @change=${d=>l(s,d.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return u==="number"||u==="integer"?Ew(e):u==="string"?Tl({...e,inputType:"text"}):r`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${f}</div>
      <div class="cfg-field__error">Unsupported type: ${u}. Use Raw mode.</div>
    </div>
  `}function Tl(e){const{schema:t,value:n,path:s,hints:a,disabled:i,onPatch:o,inputType:l}=e,c=e.showLabel??!0,u=_e(s,a),p=u?.label??t.title??nt(String(s.at(-1))),f=u?.help??t.description,v=u?.sensitive??xw(s),m=u?.placeholder??(v?"••••":t.default!==void 0?`Default: ${sn(t.default)}`:""),k=n??"";return r`
    <div class="cfg-field">
      ${c?r`<label class="cfg-field__label">${p}</label>`:h}
      ${f?r`<div class="cfg-field__help">${f}</div>`:h}
      <div class="cfg-input-wrap">
        <input
          type=${v?"password":l}
          class="cfg-input"
          placeholder=${m}
          .value=${sn(k)}
          ?disabled=${i}
          @input=${d=>{const g=d.target.value;if(l==="number"){if(g.trim()===""){o(s,void 0);return}const S=Number(g);o(s,Number.isNaN(S)?g:S);return}o(s,g)}}
          @change=${d=>{if(l==="number")return;const g=d.target.value;o(s,g.trim())}}
        />
        ${t.default!==void 0?r`
          <button
            type="button"
            class="cfg-input__reset"
            title="Reset to default"
            ?disabled=${i}
            @click=${()=>o(s,t.default)}
          >↺</button>
        `:h}
      </div>
    </div>
  `}function Ew(e){const{schema:t,value:n,path:s,hints:a,disabled:i,onPatch:o}=e,l=e.showLabel??!0,c=_e(s,a),u=c?.label??t.title??nt(String(s.at(-1))),p=c?.help??t.description,f=n??t.default??"",v=typeof f=="number"?f:0;return r`
    <div class="cfg-field">
      ${l?r`<label class="cfg-field__label">${u}</label>`:h}
      ${p?r`<div class="cfg-field__help">${p}</div>`:h}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${i}
          @click=${()=>o(s,v-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${sn(f)}
          ?disabled=${i}
          @input=${m=>{const k=m.target.value,d=k===""?void 0:Number(k);o(s,d)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${i}
          @click=${()=>o(s,v+1)}
        >+</button>
      </div>
    </div>
  `}function _l(e){const{schema:t,value:n,path:s,hints:a,disabled:i,options:o,onPatch:l}=e,c=e.showLabel??!0,u=_e(s,a),p=u?.label??t.title??nt(String(s.at(-1))),f=u?.help??t.description,v=n??t.default,m=o.findIndex(d=>d===v||String(d)===String(v)),k="__unset__";return r`
    <div class="cfg-field">
      ${c?r`<label class="cfg-field__label">${p}</label>`:h}
      ${f?r`<div class="cfg-field__help">${f}</div>`:h}
      <select
        class="cfg-select"
        ?disabled=${i}
        .value=${m>=0?String(m):k}
        @change=${d=>{const g=d.target.value;l(s,g===k?void 0:o[Number(g)])}}
      >
        <option value=${k}>Select...</option>
        ${o.map((d,g)=>r`
          <option value=${String(g)}>${String(d)}</option>
        `)}
      </select>
    </div>
  `}function Rw(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,onPatch:l}=e;e.showLabel;const c=_e(s,a),u=c?.label??t.title??nt(String(s.at(-1))),p=c?.help??t.description,f=n??t.default,v=f&&typeof f=="object"&&!Array.isArray(f)?f:{},m=t.properties??{},d=Object.entries(m).toSorted((T,x)=>{const _=_e([...s,T[0]],a)?.order??0,L=_e([...s,x[0]],a)?.order??0;return _!==L?_-L:T[0].localeCompare(x[0])}),g=new Set(Object.keys(m)),S=t.additionalProperties,A=!!S&&typeof S=="object";return s.length===1?r`
      <div class="cfg-fields">
        ${d.map(([T,x])=>et({schema:x,value:v[T],path:[...s,T],hints:a,unsupported:i,disabled:o,onPatch:l}))}
        ${A?Cl({schema:S,value:v,path:s,hints:a,unsupported:i,disabled:o,reservedKeys:g,onPatch:l}):h}
      </div>
    `:r`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${u}</span>
        <span class="cfg-object__chevron">${ns.chevronDown}</span>
      </summary>
      ${p?r`<div class="cfg-object__help">${p}</div>`:h}
      <div class="cfg-object__content">
        ${d.map(([T,x])=>et({schema:x,value:v[T],path:[...s,T],hints:a,unsupported:i,disabled:o,onPatch:l}))}
        ${A?Cl({schema:S,value:v,path:s,hints:a,unsupported:i,disabled:o,reservedKeys:g,onPatch:l}):h}
      </div>
    </details>
  `}function Lw(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,onPatch:l}=e,c=e.showLabel??!0,u=_e(s,a),p=u?.label??t.title??nt(String(s.at(-1))),f=u?.help??t.description,v=Array.isArray(t.items)?t.items[0]:t.items;if(!v)return r`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${p}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const m=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return r`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${c?r`<span class="cfg-array__label">${p}</span>`:h}
        <span class="cfg-array__count">${m.length} item${m.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${o}
          @click=${()=>{const k=[...m,Gu(v)];l(s,k)}}
        >
          <span class="cfg-array__add-icon">${ns.plus}</span>
          Add
        </button>
      </div>
      ${f?r`<div class="cfg-array__help">${f}</div>`:h}

      ${m.length===0?r`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:r`
        <div class="cfg-array__items">
          ${m.map((k,d)=>r`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${d+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${o}
                  @click=${()=>{const g=[...m];g.splice(d,1),l(s,g)}}
                >
                  ${ns.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${et({schema:v,value:k,path:[...s,d],hints:a,unsupported:i,disabled:o,showLabel:!1,onPatch:l})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function Cl(e){const{schema:t,value:n,path:s,hints:a,unsupported:i,disabled:o,reservedKeys:l,onPatch:c}=e,u=_w(t),p=Object.entries(n??{}).filter(([f])=>!l.has(f));return r`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${o}
          @click=${()=>{const f={...n};let v=1,m=`custom-${v}`;for(;m in f;)v+=1,m=`custom-${v}`;f[m]=u?{}:Gu(t),c(s,f)}}
        >
          <span class="cfg-map__add-icon">${ns.plus}</span>
          Add Entry
        </button>
      </div>

      ${p.length===0?r`
              <div class="cfg-map__empty">No custom entries.</div>
            `:r`
        <div class="cfg-map__items">
          ${p.map(([f,v])=>{const m=[...s,f],k=Cw(v);return r`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${f}
                    ?disabled=${o}
                    @change=${d=>{const g=d.target.value.trim();if(!g||g===f)return;const S={...n};g in S||(S[g]=S[f],delete S[f],c(s,S))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${u?r`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${k}
                          ?disabled=${o}
                          @change=${d=>{const g=d.target,S=g.value.trim();if(!S){c(m,void 0);return}try{c(m,JSON.parse(S))}catch{g.value=k}}}
                        ></textarea>
                      `:et({schema:t,value:v,path:m,hints:a,unsupported:i,disabled:o,showLabel:!1,onPatch:c})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  ?disabled=${o}
                  @click=${()=>{const d={...n};delete d[f],c(s,d)}}
                >
                  ${ns.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const El={env:r`
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
  `},Uo={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"},user:{label:"User Profile",description:"Your display name and avatar"}};function Rl(e){return El[e]??El.default}function Pw(e,t,n){if(!n)return!0;const s=n.toLowerCase(),a=Uo[e];return e.toLowerCase().includes(s)||a&&(a.label.toLowerCase().includes(s)||a.description.toLowerCase().includes(s))?!0:Fn(t,s)}function Fn(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,a]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||Fn(a,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const a of s)if(a&&Fn(a,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&Fn(e.additionalProperties,t))return!0;const n=e.anyOf??e.oneOf??e.allOf;if(n){for(const s of n)if(s&&Fn(s,t))return!0}return!1}function Iw(e){if(!e.schema)return r`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,n=e.value??{};if(qe(t)!=="object"||!t.properties)return r`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),a=t.properties,i=e.searchQuery??"",o=e.activeSection,l=e.activeSubsection??null,u=Object.entries(a).toSorted((f,v)=>{const m=_e([f[0]],e.uiHints)?.order??50,k=_e([v[0]],e.uiHints)?.order??50;return m!==k?m-k:f[0].localeCompare(v[0])}).filter(([f,v])=>!(o&&f!==o||i&&!Pw(f,v,i)));let p=null;if(o&&l&&u.length===1){const f=u[0]?.[1];f&&qe(f)==="object"&&f.properties&&f.properties[l]&&(p={sectionKey:o,subsectionKey:l,schema:f.properties[l]})}return u.length===0?r`
      <div class="config-empty">
        <div class="config-empty__icon">${q.search}</div>
        <div class="config-empty__text">
          ${i?`No settings match "${i}"`:"No settings in this section"}
        </div>
      </div>
    `:r`
    <div class="config-form config-form--modern">
      ${p?(()=>{const{sectionKey:f,subsectionKey:v,schema:m}=p,k=_e([f,v],e.uiHints),d=k?.label??m.title??nt(v),g=k?.help??m.description??"",S=n[f],A=S&&typeof S=="object"?S[v]:void 0,T=`config-section-${f}-${v}`;return r`
              <section class="config-section-card" id=${T}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Rl(f)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${d}</h3>
                    ${g?r`<p class="config-section-card__desc">${g}</p>`:h}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${et({schema:m,value:A,path:[f,v],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():u.map(([f,v])=>{const m=Uo[f]??{label:f.charAt(0).toUpperCase()+f.slice(1),description:v.description??""};return r`
              <section class="config-section-card" id="config-section-${f}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Rl(f)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${m.label}</h3>
                    ${m.description?r`<p class="config-section-card__desc">${m.description}</p>`:h}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${et({schema:v,value:n[f],path:[f],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const Dw=new Set(["title","description","default","nullable"]);function Mw(e){return Object.keys(e??{}).filter(n=>!Dw.has(n)).length===0}function Qu(e){const t=e.filter(a=>a!=null),n=t.length!==e.length,s=[];for(const a of t)s.some(i=>Object.is(i,a))||s.push(a);return{enumValues:s,nullable:n}}function Yu(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:Wn(e,[])}function Wn(e,t){const n=new Set,s={...e},a=ga(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const l=Ow(e,t);return l||{schema:e,unsupportedPaths:[a]}}const i=Array.isArray(e.type)&&e.type.includes("null"),o=qe(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=o??e.type,s.nullable=i||e.nullable,s.enum){const{enumValues:l,nullable:c}=Qu(s.enum);s.enum=l,c&&(s.nullable=!0),l.length===0&&n.add(a)}if(o==="object"){const l=e.properties??{},c={};for(const[u,p]of Object.entries(l)){const f=Wn(p,[...t,u]);f.schema&&(c[u]=f.schema);for(const v of f.unsupportedPaths)n.add(v)}if(s.properties=c,e.additionalProperties===!0)n.add(a);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!Mw(e.additionalProperties)){const u=Wn(e.additionalProperties,[...t,"*"]);s.additionalProperties=u.schema??e.additionalProperties,u.unsupportedPaths.length>0&&n.add(a)}}else if(o==="array"){const l=Array.isArray(e.items)?e.items[0]:e.items;if(!l)n.add(a);else{const c=Wn(l,[...t,"*"]);s.items=c.schema??l,c.unsupportedPaths.length>0&&n.add(a)}}else o!=="string"&&o!=="number"&&o!=="integer"&&o!=="boolean"&&!s.enum&&n.add(a);return{schema:s,unsupportedPaths:Array.from(n)}}function Ow(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],a=[];let i=!1;for(const l of n){if(!l||typeof l!="object")return null;if(Array.isArray(l.enum)){const{enumValues:c,nullable:u}=Qu(l.enum);s.push(...c),u&&(i=!0);continue}if("const"in l){if(l.const==null){i=!0;continue}s.push(l.const);continue}if(qe(l)==="null"){i=!0;continue}a.push(l)}if(s.length>0&&a.length===0){const l=[];for(const c of s)l.some(u=>Object.is(u,c))||l.push(c);return{schema:{...e,enum:l,nullable:i,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(a.length===1){const l=Wn(a[0],t);return l.schema&&(l.schema.nullable=i||l.schema.nullable),l}const o=new Set(["string","number","integer","boolean"]);return a.length>0&&s.length===0&&a.every(l=>l.type&&o.has(String(l.type)))?{schema:{...e,nullable:i},unsupportedPaths:[]}:null}function Nw(e,t){let n=e;for(const s of t){if(!n)return null;const a=qe(n);if(a==="object"){const i=n.properties??{};if(typeof s=="string"&&i[s]){n=i[s];continue}const o=n.additionalProperties;if(typeof s=="string"&&o&&typeof o=="object"){n=o;continue}return null}if(a==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function Fw(e,t){const s=(e.channels??{})[t],a=e[t];return(s&&typeof s=="object"?s:null)??(a&&typeof a=="object"?a:null)??{}}function Bw(e){const t=Yu(e.schema),n=t.schema;if(!n)return r`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=Nw(n,["channels",e.channelId]);if(!s)return r`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const a=e.configValue??{},i=Fw(a,e.channelId);return r`
    <div class="config-form">
      ${et({schema:s,value:i,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
  `}function st(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return r`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?r`
              <div class="muted">Loading config schema…</div>
            `:Bw({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
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
  `}function Uw(e){const{props:t,discord:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?K(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?K(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${st({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function zw(e){const{props:t,googleChat:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?K(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?K(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${st({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Kw(e){const{props:t,imessage:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?K(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?K(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:h}

      ${st({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Ll(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function Ww(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:a,profileFormState:i,profileFormCallbacks:o,onEditProfile:l}=e,c=s[0],u=n?.configured??c?.configured??!1,p=n?.running??c?.running??!1,f=n?.publicKey??c?.publicKey,v=n?.lastStartAt??c?.lastStartAt??null,m=n?.lastError??c?.lastError??null,k=s.length>1,d=i!=null,g=A=>{const T=A.publicKey,x=A.profile,_=x?.displayName??x?.name??A.name??A.accountId;return r`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${_}</div>
          <div class="account-card-id">${A.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${A.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${A.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${T??""}">${Ll(T)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${A.lastInboundAt?K(A.lastInboundAt):"n/a"}</span>
          </div>
          ${A.lastError?r`
                <div class="account-card-error">${A.lastError}</div>
              `:h}
        </div>
      </div>
    `},S=()=>{if(d&&o)return bh({state:i,callbacks:o,accountId:s[0]?.accountId??"default"});const A=c?.profile??n?.profile,{name:T,displayName:x,about:_,picture:L,nip05:R}=A??{},Z=T||x||_||L||R;return r`
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
              `:h}
        </div>
        ${Z?r`
              <div class="status-list">
                ${L?r`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${L}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${Y=>{Y.target.style.display="none"}}
                        />
                      </div>
                    `:h}
                ${T?r`<div><span class="label">Name</span><span>${T}</span></div>`:h}
                ${x?r`<div><span class="label">Display Name</span><span>${x}</span></div>`:h}
                ${_?r`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${_}</span></div>`:h}
                ${R?r`<div><span class="label">NIP-05</span><span>${R}</span></div>`:h}
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
      ${a}

      ${k?r`
            <div class="account-card-list">
              ${s.map(A=>g(A))}
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
                <span class="monospace" title="${f??""}"
                  >${Ll(f)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${v?K(v):"n/a"}</span>
              </div>
            </div>
          `}

      ${m?r`<div class="callout danger" style="margin-top: 12px;">${m}</div>`:h}

      ${S()}

      ${st({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function qw(e){if(!e&&e!==0)return"n/a";const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);return n<60?`${n}m`:`${Math.round(n/60)}h`}function jw(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const a=s[e],i=typeof a?.configured=="boolean"&&a.configured,o=typeof a?.running=="boolean"&&a.running,l=typeof a?.connected=="boolean"&&a.connected,u=(n.channelAccounts?.[e]??[]).some(p=>p.configured||p.running||p.connected);return i||o||l||u}function Vw(e,t){return t?.[e]?.length??0}function Ju(e,t){const n=Vw(e,t);return n<2?h:r`<div class="account-count">Accounts (${n})</div>`}function Hw(e){const{props:t,signal:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?K(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?K(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${st({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Gw(e){const{props:t,slack:n,accountCountLabel:s}=e;return r`
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
          <span>${n?.lastStartAt?K(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?K(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:h}

      ${n?.probe?r`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:h}

      ${st({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Qw(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:a}=e,i=s.length>1,o=l=>{const u=l.probe?.bot?.username,p=l.name||l.accountId;return r`
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
            <span>${l.lastInboundAt?K(l.lastInboundAt):"n/a"}</span>
          </div>
          ${l.lastError?r`
                <div class="account-card-error">
                  ${l.lastError}
                </div>
              `:h}
        </div>
      </div>
    `};return r`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${a}

      ${i?r`
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
                <span>${n?.lastStartAt?K(n.lastStartAt):"n/a"}</span>
              </div>
              <div>
                <span class="label">Last probe</span>
                <span>${n?.lastProbeAt?K(n.lastProbeAt):"n/a"}</span>
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

      ${st({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Yw(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return r`
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
            ${n?.lastConnectedAt?K(n.lastConnectedAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last message</span>
          <span>
            ${n?.lastMessageAt?K(n.lastMessageAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Auth age</span>
          <span>
            ${n?.authAgeMs!=null?qw(n.authAgeMs):"n/a"}
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

      ${st({channelId:"whatsapp",props:t})}
    </div>
  `}function Jw(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,a=t?.discord??null;t?.googlechat;const i=t?.slack??null,o=t?.signal??null,l=t?.imessage??null,c=t?.nostr??null,p=Xw(e.snapshot).map((f,v)=>({key:f,enabled:jw(f,e),order:v})).toSorted((f,v)=>f.enabled!==v.enabled?f.enabled?-1:1:f.order-v.order);return r`
    <section class="grid grid-cols-2">
      ${p.map(f=>Zw(f.key,e,{whatsapp:n,telegram:s,discord:a,slack:i,signal:o,imessage:l,nostr:c,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?K(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?r`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:h}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function Xw(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function Zw(e,t,n){const s=Ju(e,n.channelAccounts);switch(e){case"whatsapp":return Yw({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return Qw({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return Uw({props:t,discord:n.discord,accountCountLabel:s});case"googlechat":return zw({props:t,accountCountLabel:s});case"slack":return Gw({props:t,slack:n.slack,accountCountLabel:s});case"signal":return Hw({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return Kw({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const a=n.channelAccounts?.nostr??[],i=a[0],o=i?.accountId??"default",l=i?.profile??null,c=t.nostrProfileAccountId===o?t.nostrProfileFormState:null,u=c?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return Ww({props:t,nostr:n.nostr,nostrAccounts:a,accountCountLabel:s,profileFormState:c,profileFormCallbacks:u,onEditProfile:()=>t.onNostrProfileEdit(o,l)})}default:return ek(e,t,n.channelAccounts??{})}}function ek(e,t,n){const s=nk(t.snapshot,e),a=t.snapshot?.channels?.[e],i=typeof a?.configured=="boolean"?a.configured:void 0,o=typeof a?.running=="boolean"?a.running:void 0,l=typeof a?.connected=="boolean"?a.connected:void 0,c=typeof a?.lastError=="string"?a.lastError:void 0,u=n[e]??[],p=Ju(e,n);return r`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${p}

      ${u.length>0?r`
            <div class="account-card-list">
              ${u.map(f=>ok(f))}
            </div>
          `:r`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${i==null?"n/a":i?"Yes":"No"}</span>
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
          </div>`:h}

      ${st({channelId:e,props:t})}
    </div>
  `}function tk(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function nk(e,t){return tk(e)[t]?.label??e?.channelLabels?.[t]??t}const sk=600*1e3;function Xu(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<sk:!1}function ak(e){return e.running?"Yes":Xu(e)?"Active":"No"}function ik(e){return e.connected===!0?"Yes":e.connected===!1?"No":Xu(e)?"Active":"n/a"}function ok(e){const t=ak(e),n=ik(e);return r`
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
          <span>${e.lastInboundAt?K(e.lastInboundAt):"n/a"}</span>
        </div>
        ${e.lastError?r`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:h}
      </div>
    </div>
  `}const qn=(e,t)=>{const n=e._$AN;if(n===void 0)return!1;for(const s of n)s._$AO?.(t,!1),qn(s,t);return!0},Gs=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Zu=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),ck(t)}};function rk(e){this._$AN!==void 0?(Gs(this),this._$AM=e,Zu(this)):this._$AM=e}function lk(e,t=!1,n=0){const s=this._$AH,a=this._$AN;if(a!==void 0&&a.size!==0)if(t)if(Array.isArray(s))for(let i=n;i<s.length;i++)qn(s[i],!1),Gs(s[i]);else s!=null&&(qn(s,!1),Gs(s));else qn(this,e)}const ck=e=>{e.type==Gi.CHILD&&(e._$AP??=lk,e._$AQ??=rk)};class dk extends Yi{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,s){super._$AT(t,n,s),Zu(this),this.isConnected=t._$AU}_$AO(t,n=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),n&&(qn(this,t),Gs(this))}setValue(t){if(Yb(this._$Ct))this._$Ct._$AI(t,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}const Xa=new WeakMap,uk=Qi(class extends dk{render(e){return h}update(e,[t]){const n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),h}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let n=Xa.get(t);n===void 0&&(n=new WeakMap,Xa.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?Xa.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function pk(e){return typeof e.content=="string"?e.content:typeof e.text=="string"?e.text:Array.isArray(e.content)?e.content.map(t=>typeof t.text=="string"?t.text:"").join(`
`):""}const hk=["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"];function fk(e){const t=typeof e.role=="string"?e.role.toLowerCase():"";if(t!=="user"&&t!=="system")return!1;const n=pk(e).trim();if(!n)return!1;if(n.startsWith("Read HEARTBEAT.md")||n.startsWith("Read CONSCIOUSNESS.md")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(n)||n==="NO_REPLY"||n.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(n)||n.startsWith("# WORKING.md")||n.startsWith("# MISTAKES.md")||/(?:VERIFIED|FIXED|NEW):\s/.test(n)&&/✅|🟡|☑/.test(n)&&n.length>300||/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(n)||/^\[GodMode Context:[^\]]*\]\s*$/.test(n)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(n)||/^##?\s*Persistence Protocol/i.test(n)||/^##?\s*Core (?:Behaviors|Principles)/i.test(n)||/^##?\s*Your Role as \w+/i.test(n)||/^##\s*Your Team\s*\(Agent Roster\)/i.test(n)&&n.indexOf(`

## `)===-1||/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(n)&&n.length>200||/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(n))return!0;const s=n.toLowerCase();return hk.filter(a=>s.includes(a)).length>=2}const Pl=25*1024*1024,Il=50*1024*1024,Dl=20;function Za(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:e<1024*1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:`${(e/(1024*1024*1024)).toFixed(1)} GB`}function zo(e,t=0){const n=[],s=[];let a=t;const i=Array.from(e);for(const o of i){if(n.length>=Dl){s.push(`Maximum ${Dl} files allowed per upload`);break}if(o.size>Pl){s.push(`"${o.name}" is too large (${Za(o.size)}). Max ${Za(Pl)}. For larger files, mention the file path instead.`);continue}if(a+o.size>Il){s.push(`Total upload size exceeds ${Za(Il)} limit`);break}a+=o.size,n.push(o)}return{validFiles:n,errors:s}}const gk=new Set(["md","markdown","mdx"]),mk=new Set(["htm","html"]),vk=new Set(["avif","bmp","gif","heic","heif","jpeg","jpg","png","svg","svgz","webp"]);function ep(e){const t=e.replaceAll("\\","/").trim();if(!t)return e;const n=t.split("/");return n[n.length-1]||t}function yk(e){if(!e)return null;const n=e.trim().toLowerCase().split(".").pop()??"";return n?gk.has(n)?"text/markdown":mk.has(n)?"text/html":vk.has(n)?n==="svg"||n==="svgz"?"image/svg+xml":n==="jpg"?"image/jpeg":`image/${n}`:n==="pdf"?"application/pdf":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":null:null}function tp(e){const t=e.mimeType?.split(";")[0]?.trim().toLowerCase()??"";if(t)return t;const n=e.content?.trim()??"";if(n.startsWith("data:image/")){const s=/^data:(image\/[^;]+);/i.exec(n);return s?.[1]?s[1].toLowerCase():"image/*"}return yk(e.filePath??null)??"text/markdown"}function bk(e){if(!e.startsWith("file://"))return null;let t=e.slice(7);return t.startsWith("/~/")&&(t="~"+t.slice(2)),decodeURIComponent(t)}function wk(e,t){if(!t)return;const s=e.target.closest("a");if(!s)return;const a=s.getAttribute("href");if(!a)return;const i=bk(a);i&&(e.preventDefault(),e.stopPropagation(),t(i))}function kk(e){if(e.error)return r`
      <div class="callout danger">${e.error}</div>
      <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;if(!e.content)return r`
      <div class="muted">No content available</div>
    `;const t=tp(e),n=e.content,s=n.trim();if(t.startsWith("image/"))return s.startsWith("data:image/")?r`
        <div class="sidebar-image">
          <img src=${s} alt=${ep(e.filePath??"Image preview")} />
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
    `;if(t==="text/html"||t==="application/xhtml+xml"){const a=new Blob([n],{type:"text/html"}),i=URL.createObjectURL(a);return r`<iframe
      class="sidebar-html-frame"
      src=${i}
      sandbox="allow-same-origin allow-top-navigation-by-user-activation allow-popups"
      @load=${o=>{URL.revokeObjectURL(i);const l=o.target;try{const c=l.contentDocument?.documentElement?.scrollHeight;c&&(l.style.height=`${c}px`)}catch{}}}
    ></iframe>`}if(t==="text/markdown"||t==="text/x-markdown"){const a=sd(n);return r`<div
      class="sidebar-markdown"
      @click=${i=>wk(i,e.onOpenFile)}
    >${Ce(Se(a))}</div>`}return r`<pre class="sidebar-plain">${n}</pre>`}function $k(e){const t=tp(e);return t==="text/html"||t==="application/xhtml+xml"}function Sk(e){const t=new Blob([e],{type:"text/html"}),n=URL.createObjectURL(t);window.open(n,"_blank","noopener,noreferrer")}function Pi(e){const t=e.title?.trim()||"Tool Output",n=$k(e)&&e.content;return r`
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
                @click=${()=>Sk(e.content)}
              >Open in Browser</button>`:h}
          <button @click=${e.onClose} class="btn" title="Close sidebar">
            ${q.x}
          </button>
        </div>
      </div>
      ${Ak(e)}
      <div class="sidebar-content">${kk(e)}</div>
    </div>
  `}function Ak(e){if(e.resource)return r`
      <div class="sidebar-resource-bar">
        <span class="resource-type-badge">${e.resource.type.replace("_"," ")}</span>
        <span style="flex: 1;">${e.resource.title}</span>
        <button
          class="sidebar-pin-btn${e.resource.pinned?" pinned":""}"
          title=${e.resource.pinned?"Unpin":"Pin"}
          @click=${()=>e.onToggleResourcePin?.(e.resource.id,!e.resource.pinned)}
        >${e.resource.pinned?"★":"☆"}</button>
      </div>
    `;if(e.filePath&&e.onSaveAsResource){const t=e.title?.trim()||ep(e.filePath);return r`
      <div class="sidebar-resource-bar">
        <button
          class="sidebar-save-resource-btn"
          @click=${()=>e.onSaveAsResource(e.filePath,t)}
        >Save as Resource</button>
      </div>
    `}return h}function Ii(e){const t=e.viewUrl?.trim()||`http://127.0.0.1:4000/documents/${e.slug}/view`,n=e.title?.trim()||e.slug;return r`
    <div class="sidebar-panel proof-viewer">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${n}</div>
          <div class="sidebar-path" title=${t}>Live co-editing via Proof</div>
        </div>
        <div class="sidebar-header-actions">
          <button
            class="btn sidebar-open-browser-btn"
            title="Copy share link"
            @click=${async()=>{try{await navigator.clipboard.writeText(t)}catch{window.prompt("Copy Proof link",t)}}}
          >Share</button>
          ${e.filePath&&e.onPushToDrive?r`<button
                class="btn sidebar-open-browser-btn"
                title="Upload the Proof markdown mirror to Google Drive"
                @click=${()=>e.onPushToDrive?.(e.filePath)}
              >Drive</button>`:h}
          <button
            class="btn sidebar-open-browser-btn"
            title="Open in browser"
            @click=${()=>window.open(t,"_blank","noopener,noreferrer")}
          >Open in Browser</button>
          <button @click=${e.onClose} class="btn" title="Close sidebar">
            ${q.x}
          </button>
        </div>
      </div>
      <div class="sidebar-content proof-content" style="padding: 0;">
        <iframe
          src=${t}
          class="proof-iframe"
          style="width: 100%; height: 100%; border: none; flex: 1;"
          sandbox="allow-same-origin allow-scripts allow-forms"
        ></iframe>
      </div>
    </div>
  `}var xk=Object.defineProperty,Tk=Object.getOwnPropertyDescriptor,cs=(e,t,n,s)=>{for(var a=s>1?void 0:s?Tk(t,n):t,i=e.length-1,o;i>=0;i--)(o=e[i])&&(a=(s?o(t,n,a):o(a))||a);return s&&a&&xk(t,n,a),a};let Ot=class extends nn{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.direction="horizontal",this.isDragging=!1,this.startPos=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startPos=this.direction==="vertical"?e.clientY:e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=this.direction==="vertical",s=n?t.getBoundingClientRect().height:t.getBoundingClientRect().width,o=((n?e.clientY:e.clientX)-this.startPos)/s;let l=this.startRatio+o;l=Math.max(this.minRatio,Math.min(this.maxRatio,l)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:l},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return r``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};Ot.styles=Bp`
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
  `;cs([ss({type:Number})],Ot.prototype,"splitRatio",2);cs([ss({type:Number})],Ot.prototype,"minRatio",2);cs([ss({type:Number})],Ot.prototype,"maxRatio",2);cs([ss({type:String})],Ot.prototype,"direction",2);Ot=cs([Ec("resizable-divider")],Ot);const _k=5e3;function Ck(e){const t=(e??"").trim();if(!t||t==="/")return"/consciousness-icon.webp";const n=t.startsWith("/")?t:`/${t}`;return`${n.endsWith("/")?n.slice(0,-1):n}/consciousness-icon.webp`}function Ml(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function Ek(e){const t=e.sessions?.sessions?.find(a=>a.key===e.sessionKey);if(!t)return null;const n=t.totalTokens??0,s=t.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return s<=0?null:n/s}function Rk(e){const t=Ek(e);if(t===null)return h;const n=Math.round(t*100),s=n>=90?"danger":n>=70?"warn":"ok",a=e.sessions?.sessions?.find(l=>l.key===e.sessionKey),i=a?.totalTokens??0,o=a?.contextTokens??e.sessions?.defaults?.contextTokens??2e5;return r`
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
        ${i.toLocaleString()} / ${o.toLocaleString()} tokens<br>
        Click to compact
      </span>
    </button>
  `}function Lk(e){return e?e.active?r`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${q.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<_k?r`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${q.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `:h:h}function Ko(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function Pk(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy")}function Ik(e,t){e.preventDefault(),e.stopPropagation(),t.classList.add("chat--drag-over")}function Dk(e,t){e.preventDefault(),e.stopPropagation();const n=t.getBoundingClientRect();(e.clientX<=n.left||e.clientX>=n.right||e.clientY<=n.top||e.clientY>=n.bottom)&&t.classList.remove("chat--drag-over")}function Mk(e,t){e.preventDefault(),e.stopPropagation(),e.currentTarget.classList.remove("chat--drag-over");const s=e.dataTransfer?.files;if(!s||s.length===0||!t.onAttachmentsChange)return;const a=t.attachments??[],i=a.reduce((p,f)=>p+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=zo(s,i);for(const p of l)t.showToast?.(p,"error");if(o.length===0)return;const c=[];let u=o.length;for(const p of o){const f=new FileReader;f.addEventListener("load",()=>{const v=f.result;c.push({id:Ko(),dataUrl:v,mimeType:p.type||"application/octet-stream",fileName:p.name}),u--,u===0&&t.onAttachmentsChange?.([...a,...c])}),f.addEventListener("error",()=>{t.showToast?.(`Failed to read "${p.name}"`,"error"),u--,u===0&&c.length>0&&t.onAttachmentsChange?.([...a,...c])}),f.readAsDataURL(p)}}function Ok(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let p=0;p<n.length;p++){const f=n[p];if(f.type.startsWith("image/")){const v=f.getAsFile();v&&s.push(v)}}if(s.length===0)return;e.preventDefault();const a=t.attachments??[],i=a.reduce((p,f)=>p+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=zo(s,i);for(const p of l)t.showToast?.(p,"error");if(o.length===0)return;const c=[];let u=o.length;for(const p of o){const f=new FileReader;f.addEventListener("load",()=>{const v=f.result;c.push({id:Ko(),dataUrl:v,mimeType:p.type,fileName:p.name||"pasted-image"}),u--,u===0&&t.onAttachmentsChange?.([...a,...c])}),f.addEventListener("error",()=>{t.showToast?.("Failed to read pasted image","error"),u--,u===0&&c.length>0&&t.onAttachmentsChange?.([...a,...c])}),f.readAsDataURL(p)}}function Nk(e,t){const n=e.target,s=n.files;if(!s||!t.onAttachmentsChange)return;const a=t.attachments??[],i=a.reduce((p,f)=>p+(f.dataUrl?.length??0)*.75,0),{validFiles:o,errors:l}=zo(s,i);for(const p of l)t.showToast?.(p,"error");if(o.length===0){n.value="";return}const c=[];let u=o.length;for(const p of o){const f=new FileReader;f.addEventListener("load",()=>{const v=f.result;c.push({id:Ko(),dataUrl:v,mimeType:p.type||"application/octet-stream",fileName:p.name}),u--,u===0&&t.onAttachmentsChange?.([...a,...c])}),f.addEventListener("error",()=>{t.showToast?.(`Failed to read "${p.name}"`,"error"),u--,u===0&&c.length>0&&t.onAttachmentsChange?.([...a,...c])}),f.readAsDataURL(p)}n.value=""}function Fk(e){const t=e.attachments??[];return t.length===0?h:r`
    <div class="chat-attachments">
      ${t.map(n=>{const s=n.mimeType.startsWith("image/"),a=n.fileName||"file",i=a.length>40?a.slice(0,37)+"...":a;return r`
          <div class="chat-attachment ${s?"":"chat-attachment--file"}">
            ${s?r`<img src=${n.dataUrl} alt="Attachment preview" class="chat-attachment__img" />`:r`<div class="chat-attachment__file">
                  ${q.fileText}
                  <span class="chat-attachment__filename" title=${a}>${i}</span>
                </div>`}
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const o=(e.attachments??[]).filter(l=>l.id!==n.id);e.onAttachmentsChange?.(o)}}
            >
              ${q.x}
            </button>
          </div>
        `})}
    </div>
  `}function Bk(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function Uk(e){const t=e.href;if(t){if(e.target==="_blank"){window.open(t,"_blank","noopener,noreferrer");return}window.location.assign(t)}}function zk(e){const t=e.trim();return!t||t.includes(`
`)?null:t.startsWith("/")||t.startsWith("~/")||t.startsWith("./")||t.startsWith("../")||/^[a-z]:[\\/]/i.test(t)||/^[^:\s]+\/[^\s]+$/.test(t)&&/\.[a-z0-9]{1,12}$/i.test(t)||/^[^\s/\\:*?"<>|]+\.[a-z0-9]{1,12}$/i.test(t)&&t.length<=100?t:null}async function Kk(e,t){const n=e.target,s=n instanceof Element?n:n instanceof Node?n.parentElement:null;if(!s||!t.onMessageLinkClick||!Bk(e))return;const a=s.closest("a");if(a instanceof HTMLAnchorElement){if(a.hasAttribute("download"))return;const c=a.getAttribute("href");if(!c)return;try{const p=new URL(c,window.location.href);if(/^https?:$/.test(p.protocol)&&p.origin!==window.location.origin){e.preventDefault(),window.open(p.href,"_blank","noopener,noreferrer");return}}catch{}e.preventDefault(),await t.onMessageLinkClick(c)||Uk(a);return}const i=s.closest("code");if(!(i instanceof HTMLElement))return;const o=(i.textContent??"").trim();if(/^https?:\/\/\S+$/i.test(o)){e.preventDefault(),window.open(o,"_blank","noopener,noreferrer");return}if(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(\/\S*)?$/i.test(o)){e.preventDefault(),window.open(`https://${o}`,"_blank","noopener,noreferrer");return}const l=zk(o);l&&(e.preventDefault(),await t.onMessageLinkClick(l))}const Wk={html_report:"📊",plan:"📋",analysis:"🔍",code:"💻",doc:"📝",data:"📦",image:"🖼️",script:"⚙️"};function qk(e){const t=e.sessionResources;if(!t||t.length===0)return h;if(e.sessionResourcesCollapsed)return r`
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
              <span>${Wk[s.type]||"📄"}</span>
              <span>${s.title}</span>
            </button>
          `)}
      </div>
    </div>
  `}function jk(e){const t=e.connected,n=e.sending||e.stream!==null;e.canAbort&&e.onAbort;const a=e.sessions?.sessions?.find(m=>m.key===e.sessionKey)?.reasoningLevel??"off",i=e.showThinking&&a!=="off",o={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},l=(e.attachments?.length??0)>0,c=e.connected?l?"Add a message or paste more images...":"Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",u=e.splitRatio??.6,p=!!(e.sidebarOpen&&e.onCloseSidebar),f=Ck(e.basePath),v=r`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
      @click=${m=>{Kk(m,e)}}
    >
      ${e.loading?r`
              <div class="muted">Loading chat…</div>
            `:h}
      ${ha(Gk(e),m=>m.key,m=>{try{if(m.kind==="reading-indicator")return Rm(o,e.currentToolInfo);if(m.kind==="stream")return Lm(m.text,m.startedAt,e.onOpenSidebar,o,e.currentToolInfo);if(m.kind==="compaction-summary")return Mm(m.message);if(m.kind==="group"){const k=e.resolveImageUrl?(d,g)=>e.resolveImageUrl(d,g):void 0;return Pm(m,{onOpenSidebar:e.onOpenSidebar,onOpenFile:e.onOpenFile,onOpenProof:e.onOpenProof,onPushToDrive:e.onPushToDrive,onImageClick:e.onImageClick,resolveImageUrl:k,showReasoning:i,assistantName:e.assistantName,assistantAvatar:o.avatar,userName:e.userName,userAvatar:e.userAvatar})}return h}catch(k){return console.error("[chat] item render error:",k,m.key),h}})}
    </div>
  `;return r`
    <section 
      class="card chat"
      @dragover=${Pk}
      @dragenter=${m=>Ik(m,m.currentTarget)}
      @dragleave=${m=>Dk(m,m.currentTarget)}
      @drop=${m=>Mk(m,e)}
    >
      ${e.privateMode?r`<div class="callout callout--private" aria-live="polite">
            <span style="margin-right:6px">🔒</span>
            <strong>Private Session</strong> — Nothing from this conversation will be saved to memory or vault.
          </div>`:h}

      ${e.disabledReason?r`<div class="callout">${e.disabledReason}</div>`:h}

      ${e.error?r`<div class="callout danger">${e.error}</div>`:h}

      ${Lk(e.compactionStatus)}

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
          style="flex: ${p?`0 0 ${u*100}%`:"1 1 100%"}"
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
                .splitRatio=${u}
                @resize=${m=>e.onSplitRatioChange?.(m.detail.splitRatio)}
              ></resizable-divider>
              ${e.allyPanelOpen&&e.allyProps?r`
                    <div class="chat-sidebar chat-sidebar--split">
                      <div class="chat-sidebar-top">
                      ${e.sidebarMode==="proof"&&e.sidebarProofSlug?Ii({slug:e.sidebarProofSlug,title:e.sidebarTitle??null,viewUrl:e.sidebarProofUrl??null,filePath:e.sidebarFilePath??null,onClose:e.onCloseSidebar,onPushToDrive:e.onPushToDrive}):Pi({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                    </div>
                    <resizable-divider
                      direction="vertical"
                      .splitRatio=${.6}
                      .minRatio=${.2}
                      .maxRatio=${.8}
                    ></resizable-divider>
                    <div class="chat-sidebar-bottom">
                      ${Aw(e.allyProps)}
                    </div>
                  </div>
                `:r`
                  <div class="chat-sidebar">
                    ${e.sidebarMode==="proof"&&e.sidebarProofSlug?Ii({slug:e.sidebarProofSlug,title:e.sidebarTitle??null,viewUrl:e.sidebarProofUrl??null,filePath:e.sidebarFilePath??null,onClose:e.onCloseSidebar,onPushToDrive:e.onPushToDrive}):Pi({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null})},onOpenFile:e.onOpenFile,onPushToDrive:e.onPushToDrive,driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:e.onToggleDrivePicker})}
                  </div>
                `}
            `:h}
      </div>

      ${e.queue.length?r`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(m=>r`
                    <div class="chat-queue__item">
                      <div class="chat-queue__text">
                        ${m.text||(m.attachments?.length?`Image (${m.attachments.length})`:"")}
                      </div>
                      <button
                        class="btn chat-queue__remove"
                        type="button"
                        aria-label="Remove queued message"
                        @click=${()=>e.onQueueRemove(m.id)}
                      >
                        ${q.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:h}

      ${qk(e)}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${m=>Nk(m,e)}
          />
          ${Fk(e)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${uk(m=>m&&Ml(m))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${m=>{if(m.key!=="Enter"||m.isComposing||m.keyCode===229||m.shiftKey||!e.connected)return;m.preventDefault();const k=m.ctrlKey||m.metaKey;t&&e.onSend(k)}}
              @input=${m=>{const k=m.target;Ml(k),e.onDraftChange(k.value)}}
              @paste=${m=>Ok(m,e)}
              placeholder=${c}
            ></textarea>

            <div class="chat-compose__actions">
              ${Rk(e)}

              <button
                class="chat-compose__toolbar-btn"
                type="button"
                title="Attach files"
                ?disabled=${!e.connected}
                @click=${()=>{document.getElementById("chat-file-input")?.click()}}
              >
                ${q.paperclip}
              </button>

              ${e.onTogglePrivateMode?r`
                  <button
                    class="chat-compose__toolbar-btn ${e.privateMode?"private-mode--active":""}"
                    type="button"
                    @click=${e.onTogglePrivateMode}
                    title=${e.privateMode?"Private mode ON — this session won't be saved to memory or vault. Click to disable.":"Enable private mode — prevents this session from being saved"}
                    aria-label=${e.privateMode?"Disable private mode":"Enable private mode"}
                  >
                    ${e.privateMode?q.lock:q.lockOpen}
                  </button>
                `:h}

              ${e.onConsciousnessFlush?r`
                  <button
                    class="chat-compose__toolbar-btn consciousness-btn ${e.consciousnessStatus==="ok"?"consciousness-btn--ok":""} ${e.consciousnessStatus==="error"?"consciousness-btn--error":""}"
                    type="button"
                    ?disabled=${e.consciousnessStatus==="loading"}
                    @click=${e.onConsciousnessFlush}
                    title="Sync consciousness — refreshes your agent's live context (⌘⇧H)"
                    aria-label="Sync consciousness"
                  >
                    ${e.consciousnessStatus==="loading"?q.loader:r`<img src=${f} width="18" height="18" alt="" style="display:block;opacity:0.9;" />`}
                  </button>
                `:h}

              <button
                class="chat-compose__send-btn"
                ?disabled=${!e.canSend||!e.connected}
                @click=${()=>e.onSend(!1)}
                title=${n?"Send now - interrupts current run (↵)":"Send message (↵)"}
              >
                ${q.arrowUp}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `}const Ol=200;function Vk(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const a=dd(s.message),i=lo(a.role),o=a.timestamp||Date.now();!n||n.role!==i?(n&&t.push(n),n={kind:"group",key:`group:${i}:${s.key}`,role:i,messages:[{message:s.message,key:s.key}],timestamp:o,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function Hk(e){const n=e.content;if(!Array.isArray(n))return!1;for(const s of n){if(typeof s!="object"||s===null)continue;const a=s;if(a.type==="image")return!0;if(Array.isArray(a.content)){for(const i of a.content)if(!(typeof i!="object"||i===null)&&i.type==="image")return!0}}return!1}function Gk(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],a=Math.max(0,n.length-Ol);a>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${Ol} messages (${a} hidden).`,timestamp:Date.now()}});for(let i=a;i<n.length;i++){const o=n[i];if(o._chatIdx=i,Om(o)){t.push({kind:"compaction-summary",key:`compaction:${i}`,message:o});continue}if(fk(o))continue;const l=dd(o);!e.showThinking&&l.role.toLowerCase()==="toolresult"&&!Hk(o)||t.push({kind:"message",key:Nl(o,i),message:o})}if(e.showThinking)for(let i=0;i<s.length;i++)t.push({kind:"message",key:Nl(s[i],i+n.length),message:s[i]});if(e.stream!==null){const i=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:i,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:i})}else if(e.isWorking){const i=`working:${e.sessionKey}`;t.push({kind:"reading-indicator",key:i})}else if(e.sending||e.canAbort){const i=`sending:${e.sessionKey}`;t.push({kind:"reading-indicator",key:i})}return Vk(t)}function Nl(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const a=typeof n.id=="string"?n.id:"";if(a)return`msg:${a}`;const i=typeof n.messageId=="string"?n.messageId:"";if(i)return`msg:${i}`;const o=typeof n.timestamp=="number"?n.timestamp:null,l=typeof n.role=="string"?n.role:"unknown";return o!=null?`msg:${l}:${o}:${t}`:`msg:${l}:${t}`}function Qk(e,t=128){return new Promise((n,s)=>{const a=new Image;a.addEventListener("load",()=>{const i=document.createElement("canvas");i.width=t,i.height=t;const o=i.getContext("2d");if(!o){s(new Error("Could not get canvas context"));return}const l=Math.min(a.width,a.height),c=(a.width-l)/2,u=(a.height-l)/2;o.drawImage(a,c,u,l,l,0,0,t,t),n(i.toDataURL("image/png"))}),a.addEventListener("error",()=>s(new Error("Failed to load image"))),a.src=URL.createObjectURL(e)})}let Xt="",Bn=null,At=null,Fl=!1,ot=!1;function Yk(e){Fl||(Xt=e.userName||"",Bn=e.userAvatar||null,At=e.userAvatar||null,Fl=!0,ot=!1)}function Jk(e){Yk(e);const t=c=>{Xt=c.target.value,ot=!0},n=async c=>{const p=c.target.files?.[0];if(p){if(!p.type.startsWith("image/")){alert("Please select an image file");return}if(p.size>5*1024*1024){alert("Image must be less than 5MB");return}try{const f=await Qk(p,128);Bn=f,At=f,ot=!0,document.dispatchEvent(new CustomEvent("user-settings-updated"))}catch(f){console.error("Failed to process image:",f),alert("Failed to process image")}}},s=()=>{Bn=null,At=null,ot=!0;const c=document.getElementById("user-avatar-input");c&&(c.value=""),document.dispatchEvent(new CustomEvent("user-settings-updated"))},a=()=>{e.onUpdate(Xt,Bn||""),ot=!1;const c=document.querySelector(".user-settings__save");c&&(c.textContent="Saved!",setTimeout(()=>{c.textContent="Save"},1500))},i=()=>{Xt=e.userName||"",Bn=e.userAvatar||null,At=e.userAvatar||null,ot=!1,document.dispatchEvent(new CustomEvent("user-settings-updated"))},o=Xt||"You",l=At?r`<img src="${At}" alt="${o}" class="user-settings__avatar-img" />`:r`<span class="user-settings__avatar-initial">${o.charAt(0).toUpperCase()}</span>`;return r`
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
                  ${At?r`
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
                .value=${Xt}
                @input=${t}
                placeholder="Your name"
                maxlength="50"
              />
              <span class="user-settings__hint">This name appears on your chat messages</span>
            </div>

            <!-- Actions -->
            <div class="user-settings__actions">
              ${ot?r`
                    <button
                      type="button"
                      class="user-settings__btn user-settings__btn--cancel"
                      @click=${i}
                    >
                      Cancel
                    </button>
                  `:h}
              <button
                type="button"
                class="user-settings__btn user-settings__btn--save user-settings__save"
                ?disabled=${!ot}
                @click=${a}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `}const Di={all:r`
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
  `},ei=[{key:"model",label:"AI Model"},{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"},{key:"user",label:"User"}],Bl=new Set(["user","model"]),Ul="__all__";function zl(e){return Di[e]??Di.default}function Xk(e,t){const n=Uo[e];return n||{label:t?.title??nt(e),description:t?.description??""}}function Zk(e){const{key:t,schema:n,uiHints:s}=e;if(!n||qe(n)!=="object"||!n.properties)return[];const a=Object.entries(n.properties).map(([i,o])=>{const l=_e([t,i],s),c=l?.label??o.title??nt(i),u=l?.help??o.description??"",p=l?.order??50;return{key:i,label:c,description:u,order:p}});return a.sort((i,o)=>i.order!==o.order?i.order-o.order:i.key.localeCompare(o.key)),a}function e$(e,t){if(!e||!t)return[];const n=[];function s(a,i,o){if(a===i)return;if(typeof a!=typeof i){n.push({path:o,from:a,to:i});return}if(typeof a!="object"||a===null||i===null){a!==i&&n.push({path:o,from:a,to:i});return}if(Array.isArray(a)&&Array.isArray(i)){JSON.stringify(a)!==JSON.stringify(i)&&n.push({path:o,from:a,to:i});return}const l=a,c=i,u=new Set([...Object.keys(l),...Object.keys(c)]);for(const p of u)s(l[p],c[p],o?`${o}.${p}`:p)}return s(e,t,""),n}function Kl(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}const Wl={anthropic:"#d97706",openai:"#10b981","openai-codex":"#10b981",xai:"#6366f1"};function t$(e){const t=[],n=e.models,s=e.agents,a=n?.providers;if(a&&typeof a=="object")for(const[o,l]of Object.entries(a)){const c=l;for(const u of c.models??[])t.push({id:`${o}/${u.id}`,name:u.name??u.id,provider:o,providerLabel:o.charAt(0).toUpperCase()+o.slice(1),reasoning:u.reasoning??!1,contextWindow:u.contextWindow??0})}const i=s?.defaults?.models;if(i&&typeof i=="object")for(const o of Object.keys(i)){if(t.some(c=>c.id===o))continue;const l=o.split("/");t.push({id:o,name:l.slice(1).join("/"),provider:l[0]??"unknown",providerLabel:(l[0]??"unknown").replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase()),reasoning:!1,contextWindow:0})}return t}function n$(e){return e.startsWith("anthropic/")?["openai-codex/gpt-5.3-codex"]:["anthropic/claude-sonnet-4-6"]}function s$(e){const t=e.formValue;if(!t)return r`<div class="config-loading"><span>Loading config...</span></div>`;const n=t.agents,s=n?.defaults?.model?.primary??"",a=n?.defaults?.model?.fallbacks??[],i=t$(t),o=new Map;for(const c of i){const u=o.get(c.provider)??[];u.push(c),o.set(c.provider,u)}const l=e.saving||e.applying;return r`
    <div class="model-picker">
      <div class="model-picker__current">
        <div class="model-picker__current-label">Active Model</div>
        <div class="model-picker__current-value">${s||"Not set"}</div>
        ${a.length>0?r`<div class="model-picker__fallback">Fallback: ${a.join(", ")}</div>`:h}
      </div>

      ${l?r`<div class="model-picker__status">Switching model...</div>`:h}

      ${Array.from(o.entries()).map(([c,u])=>r`
          <div class="model-picker__group">
            <div class="model-picker__group-label">
              <span class="model-picker__group-dot" style="background: ${Wl[c]??"var(--accent)"}"></span>
              ${u[0]?.providerLabel??c}
            </div>
            <div class="model-picker__cards">
              ${u.map(p=>{const f=p.id===s,v=Wl[p.provider]??"var(--accent)";return r`
                  <button
                    class="model-card ${f?"model-card--active":""}"
                    style="--model-accent: ${v}"
                    ?disabled=${l}
                    @click=${()=>{f||!e.onModelSwitch||e.onModelSwitch(p.id,n$(p.id))}}
                  >
                    <div class="model-card__body">
                      <div class="model-card__name">${p.name||p.id}</div>
                      ${p.reasoning?r`<span class="model-card__tag">reasoning</span>`:h}
                      ${p.contextWindow>0?r`<span class="model-card__ctx">${Math.round(p.contextWindow/1e3)}k ctx</span>`:h}
                    </div>
                    ${f?r`<span class="model-card__check">Active</span>`:h}
                  </button>
                `})}
            </div>
          </div>
        `)}
    </div>
  `}function a$(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=Yu(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,a=n.schema?.properties??{},i=ei.filter(R=>R.key in a&&!Bl.has(R.key)),o=new Set(ei.map(R=>R.key)),l=Object.keys(a).filter(R=>!o.has(R)).map(R=>({key:R,label:R.charAt(0).toUpperCase()+R.slice(1)})),c=ei.filter(R=>Bl.has(R.key)),u=[...i,...l,...c],p=e.activeSection&&n.schema&&qe(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,f=e.activeSection?Xk(e.activeSection,p):null,v=e.activeSection?Zk({key:e.activeSection,schema:p,uiHints:e.uiHints}):[],m=e.formMode==="form"&&!!e.activeSection&&v.length>0,k=e.activeSubsection===Ul,d=e.searchQuery||k?null:e.activeSubsection??v[0]?.key??null,g=e.formMode==="form"?e$(e.originalValue,e.formValue):[],S=e.formMode==="raw"&&e.raw!==e.originalRaw,A=e.formMode==="form"?g.length>0:S,T=!!e.formValue&&!e.loading&&!!n.schema,x=e.connected&&!e.saving&&A&&(e.formMode==="raw"?!0:T),_=e.connected&&!e.applying&&!e.updating&&A&&(e.formMode==="raw"?!0:T),L=e.connected&&!e.applying&&!e.updating;return r`
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
          `:h}
        </div>

        <!-- Section nav -->
        <nav class="config-nav">
          <button
            class="config-nav__item ${e.activeSection===null?"active":""}"
            @click=${()=>e.onSectionChange(null)}
          >
            <span class="config-nav__icon">${Di.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${u.map(R=>r`
            <button
              class="config-nav__item ${e.activeSection===R.key?"active":""}"
              @click=${()=>e.onSectionChange(R.key)}
            >
              <span class="config-nav__icon">${zl(R.key)}</span>
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
            ${A?r`
              <span class="config-changes-badge">${e.formMode==="raw"?"Unsaved changes":`${g.length} unsaved change${g.length!==1?"s":""}`}</span>
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
              ?disabled=${!x}
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
              ?disabled=${!L}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${A&&e.formMode==="form"?r`
          <details class="config-diff">
            <summary class="config-diff__summary">
              <span>View ${g.length} pending change${g.length!==1?"s":""}</span>
              <svg class="config-diff__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${g.map(R=>r`
                <div class="config-diff__item">
                  <div class="config-diff__path">${R.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${Kl(R.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${Kl(R.to)}</span>
                  </div>
                </div>
              `)}
            </div>
          </details>
        `:h}

        ${f&&e.formMode==="form"?r`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${zl(e.activeSection??"")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${f.label}</div>
                  ${f.description?r`<div class="config-section-hero__desc">${f.description}</div>`:h}
                </div>
              </div>
            `:h}

        ${m?r`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${d===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(Ul)}
                >
                  All
                </button>
                ${v.map(R=>r`
                    <button
                      class="config-subnav__item ${d===R.key?"active":""}"
                      title=${R.description||R.label}
                      @click=${()=>e.onSubsectionChange(R.key)}
                    >
                      ${R.label}
                    </button>
                  `)}
              </div>
            `:h}

        <!-- Form content -->
        <div class="config-content">
          ${e.activeSection==="model"?s$(e):e.activeSection==="user"?Jk({userName:e.userName,userAvatar:e.userAvatar,onUpdate:e.onUserProfileUpdate}):e.formMode==="form"?r`
                  ${e.schemaLoading?r`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `:Iw({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:d})}
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
                      @input=${R=>e.onRawChange(R.target.value)}
                    ></textarea>
                  </label>
                `}
        </div>

        ${e.issues.length>0?r`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:h}
      </main>
    </div>
  `}function i$(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",a=e.version??"";return`${t} ${n} ${s} ${a}`.trim()}function o$(e){const t=e.ts??null;return t?K(t):"n/a"}function np(e){return e?`${Jn(e)} (${K(e)})`:"n/a"}function r$(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function l$(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function c$(e){const t=e.state??{},n=t.nextRunAtMs?Jn(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?Jn(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function d$(e){const t=e.schedule;return t.kind==="at"?`At ${Jn(t.atMs)}`:t.kind==="every"?`Every ${Vi(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function u$(e){const t=e.payload;return t.kind==="systemEvent"?`System: ${t.text}`:`Agent: ${t.message}`}function p$(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.channel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(a=>s.has(a)?!1:(s.add(a),!0))}function h$(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function f$(e){const t=p$(e);return r`
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
            <div class="stat-value">${np(e.status?.nextWakeAtMs??null)}</div>
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
        ${g$(e)}
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
                            ${h$(e,n)}
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
              ${e.jobs.map(n=>m$(n,e))}
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
                ${e.runs.map(n=>v$(n))}
              </div>
            `}
    </section>
  `}function g$(e){const t=e.form;return t.scheduleKind==="at"?r`
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
  `}function m$(e,t){const s=`list-item list-item-clickable${t.runsJobId===e.id?" list-item-selected":""}`;return r`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${d$(e)}</div>
        <div class="muted">${u$(e)}</div>
        ${e.agentId?r`<div class="muted">Agent: ${e.agentId}</div>`:h}
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.enabled?"enabled":"disabled"}</span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
      </div>
      <div class="list-meta">
        <div>${c$(e)}</div>
        <div class="row" style="justify-content: flex-end; margin-top: 8px;">
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${a=>{a.stopPropagation(),t.onToggle(e,!e.enabled)}}
          >
            ${e.enabled?"Disable":"Enable"}
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${a=>{a.stopPropagation(),t.onRun(e)}}
          >
            Run
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${a=>{a.stopPropagation(),t.onLoadRuns(e.id)}}
          >
            Runs
          </button>
          <button
            class="btn danger"
            ?disabled=${t.busy}
            @click=${a=>{a.stopPropagation(),t.onRemove(e)}}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  `}function v$(e){return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${Jn(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?r`<div class="muted">${e.error}</div>`:h}
      </div>
    </div>
  `}function y$(e){const n=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=n?.critical??0,a=n?.warn??0,i=n?.info??0,o=s>0?"danger":a>0?"warn":"success",l=s>0?`${s} critical`:a>0?`${a} warnings`:"No critical issues";return r`
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
                  Security audit: ${l}${i>0?` · ${i} info`:""}. Run
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
              ${e.eventLog.map(c=>r`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${c.event}</div>
                      <div class="list-sub">${new Date(c.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta">
                      <pre class="code-block">${l$(c.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function b$(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function bt(e,t){return t?r`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:h}function w$(e){const t=e.execApprovalQueue[0];if(!t)return h;const n=t.request,s=t.expiresAtMs-Date.now(),a=s>0?`expires in ${b$(s)}`:"expired",i=e.execApprovalQueue.length;return r`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${a}</div>
          </div>
          ${i>1?r`<div class="exec-approval-queue">${i} pending</div>`:h}
        </div>
        <div class="exec-approval-command mono">${n.command}</div>
        <div class="exec-approval-meta">
          ${bt("Host",n.host)}
          ${bt("Agent",n.agentId)}
          ${bt("Session",n.sessionKey)}
          ${bt("CWD",n.cwd)}
          ${bt("Resolved",n.resolvedPath)}
          ${bt("Security",n.security)}
          ${bt("Ask",n.ask)}
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
  `}function k$(e){const{pendingGatewayUrl:t}=e;return t?r`
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
  `:h}function $$(e){if(!e.gatewayRestartPending)return h;const t=e.sessionsResult?.sessions?.length??0,n=t===1?"1 active session":`${t} active sessions`;return r`
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
  `}function S$(e){return r`
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
              `:e.entries.map(t=>A$(t))}
      </div>
    </section>
  `}function A$(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],a=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],i=a.length>0?a.length>3?`${a.length} scopes`:`scopes: ${a.join(", ")}`:null;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${i$(e)}</div>
        <div class="chip-row">
          <span class="chip">${n}</span>
          ${s.map(o=>r`<span class="chip">${o}</span>`)}
          ${i?r`<span class="chip">${i}</span>`:h}
          ${e.platform?r`<span class="chip">${e.platform}</span>`:h}
          ${e.deviceFamily?r`<span class="chip">${e.deviceFamily}</span>`:h}
          ${e.modelIdentifier?r`<span class="chip">${e.modelIdentifier}</span>`:h}
          ${e.version?r`<span class="chip">${e.version}</span>`:h}
        </div>
      </div>
      <div class="list-meta">
        <div>${o$(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}const ql=["trace","debug","info","warn","error","fatal"];function x$(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function T$(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function _$(e){const t=e.filterText.trim().toLowerCase(),n=ql.some(i=>!e.levelFilters[i]),s=e.entries.filter(i=>i.level&&!e.levelFilters[i.level]?!1:T$(i,t)),a=t||n?"filtered":"visible";return r`
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
            @click=${()=>e.onExport(s.map(i=>i.raw),a)}
          >
            Export ${a}
          </button>
        </div>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="min-width: 220px;">
          <span>Filter</span>
          <input
            .value=${e.filterText}
            @input=${i=>e.onFilterTextChange(i.target.value)}
            placeholder="Search logs"
          />
        </label>
        <label class="field checkbox">
          <span>Auto-follow</span>
          <input
            type="checkbox"
            .checked=${e.autoFollow}
            @change=${i=>e.onToggleAutoFollow(i.target.checked)}
          />
        </label>
      </div>

      <div class="chip-row" style="margin-top: 12px;">
        ${ql.map(i=>r`
            <label class="chip log-chip ${i}">
              <input
                type="checkbox"
                .checked=${e.levelFilters[i]}
                @change=${o=>e.onLevelToggle(i,o.target.checked)}
              />
              <span>${i}</span>
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
              `:s.map(i=>r`
                <div class="log-row">
                  <div class="log-time mono">${x$(i.time)}</div>
                  <div class="log-level ${i.level??""}">${i.level??""}</div>
                  <div class="log-subsystem mono">${i.subsystem??""}</div>
                  <div class="log-message mono">${i.message??i.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}const C$=/(^~\/|^\/|^\.\.?\/|[\\/])/;function jl(e){const t=e.trim();if(!t)return null;const n=t.replace(/^["']|["']$/g,"").trim();return!n||/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/[*?<>|]/.test(n)||n.includes("\0")||n.includes(`
`)||n.includes("\r")||!C$.test(n)&&!/\.[a-z0-9]{1,12}$/i.test(n)?null:n}function E$(e){const t=e instanceof Element?e:e instanceof Node?e.parentElement:null;if(!t)return null;const n=t.closest("a");if(n){const a=n.getAttribute("href")??"";let i=a;if(a.includes("%"))try{i=decodeURIComponent(a)}catch{i=a}return jl(i)}const s=t.closest("code");return!s||s.closest("pre")?null:jl(s.textContent??"")}function R$(e){const n=new DOMParser().parseFromString(`<div>${e}</div>`,"text/html").body.firstElementChild;if(!n)return"";const a=Ke(n,{listDepth:0,orderedIndex:[]});return P$(a)}function Mi(e,t){if(e.nodeType===Node.TEXT_NODE)return e.textContent??"";if(e.nodeType!==Node.ELEMENT_NODE)return"";const n=e;switch(n.tagName.toLowerCase()){case"h1":return`# ${Je(n,t)}

`;case"h2":return`## ${Je(n,t)}

`;case"h3":return`### ${Je(n,t)}

`;case"h4":return`#### ${Je(n,t)}

`;case"h5":return`##### ${Je(n,t)}

`;case"h6":return`###### ${Je(n,t)}

`;case"p":return`${Ke(n,t)}

`;case"br":return`
`;case"hr":return`---

`;case"strong":case"b":return`**${Ke(n,t)}**`;case"em":case"i":return`*${Ke(n,t)}*`;case"del":return`~~${Ke(n,t)}~~`;case"a":{const a=n.getAttribute("href")??"",i=Ke(n,t);return!a||a===i?i:`[${i}](${a})`}case"code":return n.parentElement?.tagName.toLowerCase()==="pre"?n.textContent??"":`\`${n.textContent??""}\``;case"pre":{const a=n.querySelector("code"),i=a?a.textContent??"":n.textContent??"",o=a?.className.match(/language-(\S+)/);return`\`\`\`${o?o[1]:""}
${i}
\`\`\`

`}case"blockquote":return Ke(n,t).trim().split(`
`).map(o=>`> ${o}`).join(`
`)+`

`;case"ul":return Vl(n,t,!1);case"ol":return Vl(n,t,!0);case"li":return sp(n,t);case"input":return n.getAttribute("type")==="checkbox"?n.checked?"[x]":"[ ]":"";case"table":return L$(n,t);case"div":case"span":case"section":case"article":case"main":case"header":case"footer":case"nav":case"aside":case"figure":case"figcaption":case"details":case"summary":return Ke(n,t);default:return Ke(n,t)}}function Ke(e,t){let n="";for(const s of Array.from(e.childNodes))n+=Mi(s,t);return n}function Je(e,t){return Ke(e,t).replace(/\n+/g," ").trim()}function Vl(e,t,n){const s=Array.from(e.children).filter(o=>o.tagName.toLowerCase()==="li"),a="  ".repeat(t.listDepth);let i="";for(let o=0;o<s.length;o++){const l=s[o],c={listDepth:t.listDepth+1,orderedIndex:[...t.orderedIndex,o+1]},u=n?`${o+1}. `:"- ",p=sp(l,c);i+=`${a}${u}${p}
`}return t.listDepth===0&&(i+=`
`),i}function sp(e,t){let n="";for(const s of Array.from(e.childNodes)){const a=s.tagName?.toLowerCase();a==="ul"||a==="ol"?n+=`
`+Mi(s,t):n+=Mi(s,t)}return n.trim()}function L$(e,t){const n=[],s=e.querySelector("thead tr"),a=e.querySelectorAll("tbody tr");if(s){const u=Array.from(s.querySelectorAll("th, td")).map(p=>Je(p,t));n.push(u)}for(const u of Array.from(a)){const p=Array.from(u.querySelectorAll("td, th")).map(f=>Je(f,t));n.push(p)}if(n.length===0){const u=e.querySelectorAll("tr");for(const p of Array.from(u)){const f=Array.from(p.querySelectorAll("td, th")).map(v=>Je(v,t));n.push(f)}}if(n.length===0)return"";const i=Math.max(...n.map(u=>u.length)),o=[];for(let u=0;u<i;u++)o[u]=Math.max(3,...n.map(p=>(p[u]??"").length));let l="";const c=u=>`| ${o.map((f,v)=>(u[v]??"").padEnd(f)).join(" | ")} |`;l+=c(n[0])+`
`,l+=`| ${o.map(u=>"-".repeat(u)).join(" | ")} |
`;for(let u=1;u<n.length;u++)l+=c(n[u])+`
`;return l+`
`}function P$(e){let t=e;return t=t.replace(/\u00a0/g," "),t=t.replace(/\n{3,}/g,`

`),t=t.trim(),t&&!t.endsWith(`
`)&&(t+=`
`),t}function I$(e){return e.includes(`
`)&&e.indexOf(`
`)<e.length-1?e:e.replace(/\\n/g,`
`)}function D$(e){const t=new Date(e),s=new Date().getTime()-t.getTime(),a=Math.floor(s/(1e3*60));if(a<1)return"Just now";if(a<60)return`${a}m ago`;const i=Math.floor(a/60);return i<24?`${i}h ago`:t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}function M$(e){const t="VAULT",n=encodeURIComponent(`01-Daily/${e}`);return`obsidian://open?vault=${t}&file=${n}`}let jn=null,un=null;function Hl(e,t,n=1500){jn&&clearTimeout(jn),jn=setTimeout(()=>{e!==un&&(un=e,t(e))},n)}function O$(e,t){jn&&clearTimeout(jn),e!==un&&(un=e,t(e))}function ti(e){for(const t of e.querySelectorAll('input[type="checkbox"]')){const n=t;n.checked?n.setAttribute("checked",""):n.removeAttribute("checked")}return R$(e.innerHTML)}function N$(e){const{data:t,loading:n,error:s,onRefresh:a,onGenerate:i,onOpenInObsidian:o,onSaveBrief:l,onToggleCheckbox:c,onOpenFile:u}=e;if(n)return r`
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
            ${a?r`<button class="retry-button" @click=${a}>Retry</button>`:h}
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
            ${i?r`<button class="brief-generate-btn" @click=${i}>Generate Brief Now</button>`:a?r`<button class="brief-generate-btn" @click=${a}>Generate Brief Now</button>`:h}
            <span class="empty-hint" style="margin-top: 8px; font-size: 12px;">Briefs auto-generate at 5:00 AM when configured.</span>
          </div>
        </div>
      </div>
    `;un===null&&(un=t.content);const p=g=>{const S=g.currentTarget;if(l){const A=ti(S);Hl(A,l)}},f=g=>{if((g.ctrlKey||g.metaKey)&&g.key==="s"){g.preventDefault();const S=g.currentTarget;if(l){const A=ti(S);O$(A,l)}}if((g.ctrlKey||g.metaKey)&&g.key==="l"){g.preventDefault();const S=window.getSelection();if(!S||S.rangeCount===0)return;const A=S.focusNode,T=A instanceof HTMLElement?A.closest("li"):A?.parentElement?.closest("li");if(T){const x=T.querySelector('input[type="checkbox"]');if(x)x.nextSibling?.nodeType===Node.TEXT_NODE&&x.nextSibling.textContent===" "&&x.nextSibling.remove(),x.remove();else{const L=document.createElement("input");L.type="checkbox",T.insertBefore(document.createTextNode(" "),T.firstChild),T.insertBefore(L,T.firstChild)}const _=g.currentTarget;if(l){const L=ti(_);Hl(L,l)}}}if(g.key==="Enter"&&!g.shiftKey){const S=window.getSelection();if(!S||S.rangeCount===0)return;const A=S.focusNode,T=A instanceof HTMLElement?A.closest("li"):A?.parentElement?.closest("li");T&&T.querySelector('input[type="checkbox"]')&&setTimeout(()=>{const x=window.getSelection();if(!x||x.rangeCount===0)return;const _=x.focusNode,L=_ instanceof HTMLElement?_.closest("li"):_?.parentElement?.closest("li");if(L&&L!==T&&!L.querySelector('input[type="checkbox"]')){const R=document.createElement("input");R.type="checkbox",L.insertBefore(R,L.firstChild),L.insertBefore(document.createTextNode(" "),R.nextSibling);const Z=document.createRange();Z.setStartAfter(R.nextSibling),Z.collapse(!0),x.removeAllRanges(),x.addRange(Z)}},0)}},v=g=>{const S=g.target;if(S.tagName==="INPUT"&&S.getAttribute("type")==="checkbox"){const x=S,_=g.currentTarget;if(c&&_){const R=Array.from(_.querySelectorAll('input[type="checkbox"]')).indexOf(x);R>=0&&c(R,x.checked)}return}const A=E$(g.target);if(A&&u){g.preventDefault(),u(A);return}const T=S.closest?.("a")??S.parentElement?.closest("a");if(T){const x=T.getAttribute("href")??"";/^https?:\/\//i.test(x)&&(g.preventDefault(),window.open(x,"_blank","noopener,noreferrer"))}},m=kg(I$(t.content)),k=t.summary.readiness!=null?r`<span class="brief-readiness" title="Readiness Score${t.summary.readinessMode?` — ${t.summary.readinessMode}`:""}">
        <span class="readiness-score">${t.summary.readiness}</span>
        <span class="readiness-label">Readiness</span>
      </span>`:h,d=t.summary.tasks.total>0?r`<span class="brief-task-progress" title="${t.summary.tasks.completed}/${t.summary.tasks.total} tasks done">
        ${t.summary.tasks.completed}/${t.summary.tasks.total}
      </span>`:h;return r`
    <div class="my-day-card brief-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83D\uDCCA</span>
          <span>DAILY BRIEF</span>
          ${k}
          ${d}
        </div>
        <div class="brief-header-actions">
          <span class="brief-updated">${D$(t.updatedAt)}</span>
          ${o?r`
                <a
                  href="${M$(t.date)}"
                  class="brief-obsidian-link"
                  title="Open in Obsidian"
                  @click=${g=>{g.preventDefault(),o()}}
                >
                  <span class="obsidian-icon">\uD83D\uDCD3</span>
                </a>
              `:h}
          ${a?r`
                <button class="brief-refresh-btn" @click=${a} title="Refresh">
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
            @input=${p}
            @keydown=${f}
            @click=${v}
          >${Ce(m)}</div>
        </div>
      </div>
    </div>
  `}function F$(e){const t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}function B$(e){return e.source.persona?e.source.persona.replace(/-/g," ").replace(/\b\w/g,t=>t.toUpperCase()):e.source.skill?e.source.skill:e.type==="agent-execution"?"Agent":"Skill"}function U$(e,t){if(e.scoringId!==t.id)return h;const n=e.scoringValue??7,s=e.feedbackText??"",a=n<=4,i=n>=9;return r`
    <div class="inbox-scoring">
      <div class="inbox-score-row">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>r`
            <button
              class="inbox-score-btn${o===n?" active":""}${o<=4?" low":o>=9?" high":""}"
              @click=${()=>e.onSetScoring(t.id,o)}
            >${o}</button>
          `)}
      </div>
      ${a||i?r`
            <div class="inbox-feedback">
              <textarea
                class="inbox-feedback-input"
                placeholder=${a?"What went wrong? (required)":"What was great? (optional)"}
                .value=${s}
                @input=${o=>e.onFeedbackChange(o.target.value)}
              ></textarea>
            </div>
          `:h}
      <div class="inbox-score-actions">
        <button
          class="btn inbox-score-submit"
          ?disabled=${a&&!s.trim()}
          @click=${()=>e.onScore(t.id,n,s.trim()||void 0)}
        >Complete (${n}/10)</button>
        <button
          class="btn inbox-score-cancel"
          @click=${()=>e.onSetScoring(null)}
        >Cancel</button>
      </div>
    </div>
  `}function z$(e,t){const n=!!(t.proofDocSlug||t.outputPath),s=!!(t.sessionId||t.source.taskId||t.source.queueItemId);return r`
    <div class="inbox-card">
      <div class="inbox-card-header">
        <span class="inbox-card-source">${B$(t)}</span>
        <span class="inbox-card-time">${F$(t.createdAt)}</span>
      </div>
      <div class="inbox-card-title">${t.title}</div>
      <div class="inbox-card-summary">${t.summary.slice(0,220)}${t.summary.length>220?"...":""}</div>
      <div class="inbox-card-actions">
        ${n?r`<button class="btn btn-sm" @click=${()=>e.onViewOutput(t.id)}>View Output</button>`:h}
        ${s?r`<button class="btn btn-sm" @click=${()=>e.onOpenChat(t.id)}>Open Chat</button>`:h}
        <button class="btn btn-sm btn-primary" @click=${()=>e.onSetScoring(t.id,7)}>Complete</button>
        <button class="btn btn-sm btn-ghost" @click=${()=>e.onDismiss(t.id)}>Dismiss</button>
      </div>
      ${U$(e,t)}
    </div>
  `}function K$(e){const t=e.items.filter(s=>s.status==="pending"),n=e.count??t.length;return e.loading?r`<div class="inbox-loading">Loading inbox...</div>`:n===0?r`
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
          <span class="tab-badge" style="margin-left: 8px;">${n}</span>
        </div>
        <button class="btn btn-sm" @click=${()=>e.onMarkAll()}>Mark All Complete</button>
      </div>
      <div class="my-day-card-content">
        <div class="inbox-list">
          ${t.map(s=>z$(e,s))}
        </div>
      </div>
    </div>
  `}function ap(e){return!Number.isFinite(e)||e<=0?"0 B":e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function Wo(e){switch(e){case"markdown":return"📄";case"html":return"🌐";case"image":return"🖼️";case"json":return"🧩";case"folder":return"📁";default:return"📄"}}function Gl(e){return e==="running"?"ws-session-dot ws-session-dot--running":e==="blocked"?"ws-session-dot ws-session-dot--blocked":"ws-session-dot ws-session-dot--complete"}function ip(e){return`ws-task-priority ws-task-priority--${e}`}function op(e){return e==="high"?"High":e==="low"?"Low":"Med"}function rp(e){if(!e)return"";const t=ce();return e===t?"Today":e<t?`Overdue (${e})`:e}function lp(e){if(!e)return"ws-task-due";const t=ce();return e<t?"ws-task-due ws-task-due--overdue":e===t?"ws-task-due ws-task-due--today":"ws-task-due"}function Qs(e,t="due"){const n={high:0,medium:1,low:2};return[...e].sort((s,a)=>{if(t==="priority"){const i=n[s.priority]-n[a.priority];return i!==0?i:s.dueDate&&a.dueDate?s.dueDate.localeCompare(a.dueDate):s.dueDate&&!a.dueDate?-1:!s.dueDate&&a.dueDate?1:0}if(t==="newest")return(a.createdAt||"").localeCompare(s.createdAt||"");if(s.dueDate&&a.dueDate){const i=s.dueDate.localeCompare(a.dueDate);if(i!==0)return i}else{if(s.dueDate&&!a.dueDate)return-1;if(!s.dueDate&&a.dueDate)return 1}return n[s.priority]-n[a.priority]})}function Ql(e,t,n,s,a,i,o){const l=e.status==="complete";return s===e.id?r`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${u=>{u.preventDefault();const p=u.currentTarget,f=p.querySelector(".ws-task-edit-input"),v=p.querySelector(".ws-task-date-input"),m=f.value.trim();m&&(i?.(e.id,{title:m,dueDate:v.value||null}),a?.(null))}}
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
          @click=${()=>a?.(null)}
        >Cancel</button>
      </form>
    `:r`
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
        @click=${()=>a?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.briefSection?r`<span class="ws-task-section">${e.briefSection}</span>`:h}
      <span class=${ip(e.priority)}>${op(e.priority)}</span>
      ${e.dueDate?r`<span class=${lp(e.dueDate)}>${rp(e.dueDate)}</span>`:h}
      ${!l&&e.queueStatus?.status==="processing"?r`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!l&&e.queueStatus?.status==="review"&&n?r`<button
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
              `:!l&&n?r`<button
                  class="ws-task-start-btn"
                  @click=${()=>n(e.id)}
                  title="Start working on this task"
                >Start</button>`:h}
    </div>
  `}function Oi(e,t,n,s,a,i,o){const l=e.status==="complete";return s===e.id?r`
      <form
        class="ws-list-row ws-task-row ws-task-edit-row"
        @submit=${u=>{u.preventDefault();const p=u.currentTarget,f=p.querySelector(".ws-task-edit-input"),v=p.querySelector(".ws-task-date-input"),m=f.value.trim();m&&(i?.(e.id,{title:m,dueDate:v.value||null}),a?.(null))}}
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
          @click=${()=>a?.(null)}
        >Cancel</button>
      </form>
    `:r`
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
        @click=${()=>a?.(e.id)}
        title="Click to edit"
      >${e.title}</span>
      ${e.project?r`<span class="ws-task-project">${e.project}</span>`:h}
      ${e.briefSection?r`<span class="ws-task-section">${e.briefSection}</span>`:h}
      <span class=${ip(e.priority)}>${op(e.priority)}</span>
      ${e.dueDate?r`<span class=${lp(e.dueDate)}>${rp(e.dueDate)}</span>`:h}
      ${!l&&e.queueStatus?.status==="processing"?r`<span class="ws-task-agent-status ws-task-agent-status--processing">
            <span class="ws-task-agent-dot"></span>
            ${e.queueStatus.roleName} working...
          </span>`:!l&&e.queueStatus?.status==="review"&&n?r`<button
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
              `:!l&&n?r`<button
                  class="ws-task-start-btn"
                  @click=${()=>n(e.id)}
                  title="Start working on this task"
                >Start</button>`:h}
    </div>
  `}function W$(e,t){return e.trim()?t.toLowerCase().includes(e.trim().toLowerCase()):!0}function Yl(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.name.toLowerCase().includes(n)||s.path.toLowerCase().includes(n)||s.type.toLowerCase().includes(n)||(s.searchText??"").toLowerCase().includes(n))}function Jl(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.filter(s=>s.title.toLowerCase().includes(n)||s.key.toLowerCase().includes(n))}function cp(e,t){if(!e.trim())return t;const n=e.trim().toLowerCase();return t.reduce((s,a)=>{if(a.type==="file")(a.name.toLowerCase().includes(n)||a.path.toLowerCase().includes(n))&&s.push(a);else{const i=cp(e,a.children??[]);i.length>0&&s.push({...a,children:i})}return s},[])}function dp(e){let t=0;for(const n of e)n.type==="file"?t++:n.children&&(t+=dp(n.children));return t}const q$=10;function j$(e){if(!e.searchText)return null;const t=e.searchText.trim();if(!t)return null;const n=t.match(/#+ (.+?)(?:\s#|$)/);return n?n[1].trim().slice(0,120):(t.startsWith("---")?t.replace(/^---.*?---\s*/s,""):t).slice(0,120)||null}function V$(e,t=q$){return[...e].sort((n,s)=>s.modified.getTime()-n.modified.getTime()).slice(0,t)}function up(e,t,n){if(e.type==="file"){const o=n.pinnedPaths.has(e.path);return r`
      <div class="ws-folder-file-row" style="padding-left: ${12+t*16}px">
        <button
          class="ws-folder-file"
          @click=${()=>n.onItemClick?.({path:e.path,name:e.name,type:e.fileType??"text",size:e.size??0,modified:e.modified??new Date})}
        >
          <span class="ws-list-icon">${Wo(e.fileType??"text")}</span>
          <span class="ws-list-title">${e.name}</span>
          ${e.size!=null?r`<span class="ws-list-meta">${ap(e.size)}</span>`:h}
          ${e.modified?r`<span class="ws-list-meta">${K(e.modified.getTime())}</span>`:h}
        </button>
        <button
          class="ws-pin-btn ${o?"active":""}"
          @click=${()=>n.onPinToggle?.(n.workspaceId,e.path,o)}
          title=${o?"Unpin":"Pin"}
        >
          ${o?"Unpin":"Pin"}
        </button>
      </div>
    `}const s=n.expandedFolders.has(e.path),a=e.children??[],i=dp(a);return r`
    <div class="ws-folder-node">
      <button
        class="ws-folder-header"
        style="padding-left: ${12+t*16}px"
        @click=${()=>n.onToggleFolder?.(e.path)}
      >
        <span class="ws-folder-chevron ${s?"expanded":""}">&#9654;</span>
        <span class="ws-list-icon">&#128193;</span>
        <span class="ws-folder-name">${e.name}</span>
        <span class="ws-folder-count">${i} ${i===1?"file":"files"}</span>
      </button>
      ${s?r`
            <div class="ws-folder-children">
              ${a.map(o=>up(o,t+1,n))}
            </div>
          `:h}
    </div>
  `}function H$(e,t,n){return r`
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
            <span>${K(e.lastUpdated.getTime())}</span>
          </div>
        </div>
      </button>
      ${n?r`<button
            class="workspace-card-delete"
            title="Delete workspace"
            @click=${s=>{s.stopPropagation(),confirm(`Delete workspace "${e.name}"? This removes it from your list but does not delete any files.`)&&n(e)}}
          >&times;</button>`:h}
    </div>
  `}function ni(e){const{workspaceId:t,entry:n,pinned:s,onOpen:a,onPinToggle:i}=e;return r`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>a?.(n)}>
        <span class="ws-list-icon">${Wo(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${ap(n.size)}</span>
        <span class="ws-list-meta">${K(n.modified.getTime())}</span>
      </button>
      <button
        class="ws-pin-btn ${s?"active":""}"
        @click=${()=>i?.(t,n.path,s)}
        title=${s?"Unpin":"Pin"}
      >
        ${s?"Unpin":"Pin"}
      </button>
    </div>
  `}function G$(e){const{workspaceId:t,entry:n,pinned:s,onOpen:a,onPinToggle:i}=e,o=j$(n);return r`
    <div class="ws-list-row">
      <button class="ws-list-main" @click=${()=>a?.(n)}>
        <span class="ws-list-icon">${Wo(n.type)}</span>
        <span class="ws-list-title">${n.name}</span>
        <span class="ws-list-meta">${K(n.modified.getTime())}</span>
        ${o?r`<span class="ws-list-desc">${o}</span>`:h}
      </button>
      <button
        class="ws-pin-btn ${s?"active":""}"
        @click=${()=>i?.(t,n.path,s)}
        title=${s?"Unpin":"Pin"}
      >
        ${s?"Unpin":"Pin"}
      </button>
    </div>
  `}function Q$(e,t){return r`
    <div class="workspace-breadcrumbs">
      ${e.map((n,s)=>r`
          ${s>0?r`<span class="breadcrumb-sep">/</span>`:h}
          <button
            class="breadcrumb-item ${s===e.length-1?"breadcrumb-current":""}"
            @click=${()=>t(n.path)}
          >${n.name}</button>
        `)}
    </div>
  `}function Y$(e){const{browseEntries:t,breadcrumbs:n,browseSearchQuery:s,browseSearchResults:a,onBrowseFolder:i,onBrowseSearch:o,onBrowseBack:l,onCreateFolder:c,onItemClick:u}=e,p=a??t??[];return r`
    <div class="workspace-browser">
      <div class="workspace-browser-toolbar">
        <button class="workspace-browse-back" @click=${()=>l?.()}>
          &larr; Back
        </button>
        ${n?Q$(n,f=>i?.(f)):h}
        <input
          type="text"
          class="workspace-browse-search"
          placeholder="Search files..."
          .value=${s??""}
          @input=${f=>{const v=f.target;o?.(v.value)}}
        />
        <button
          class="workspace-browse-new-folder"
          @click=${()=>{const f=prompt("New folder name:");if(f?.trim()){const v=n?.[n.length-1]?.path??".";c?.(`${v}/${f.trim()}`)}}}
        >+ Folder</button>
      </div>

      <div class="workspace-browse-list">
        ${p.length===0?r`<div class="workspace-browse-empty">No files found</div>`:p.map(f=>r`
              <button
                class="workspace-browse-entry"
                @click=${()=>{f.type==="folder"?i?.(f.path):u&&u({path:f.path,name:f.name,type:f.fileType??"text",size:f.size??0,modified:new Date})}}
              >
                <span class="browse-entry-icon">${f.type==="folder"?"📁":"📄"}</span>
                <span class="browse-entry-name">${f.name}</span>
                ${f.excerpt?r`<span class="browse-entry-excerpt">${f.excerpt}</span>`:h}
              </button>
            `)}
      </div>
    </div>
  `}function J$(e){const{workspace:t,itemSearchQuery:n,expandedFolders:s=new Set,showCompletedTasks:a=!1,onItemSearch:i,onBack:o,onItemClick:l,onSessionClick:c,onPinToggle:u,onPinSessionToggle:p,onToggleFolder:f,onToggleTaskComplete:v,onCreateTask:m,onToggleCompletedTasks:k,onStartTask:d,editingTaskId:g,onEditTask:S,onUpdateTask:A,onBatchPushToDrive:T}=e,x=Yl(n,t.pinned).toSorted((B,Oe)=>Oe.modified.getTime()-B.modified.getTime()),_=Jl(n,t.pinnedSessions),L=Yl(n,t.outputs).filter(B=>!t.pinned.some(Oe=>Oe.path===B.path)),R=(t.folderTree?.length??0)>0,Z=R?cp(n,t.folderTree):[],Y=Jl(n,t.sessions),I=new Set(t.pinnedSessions.map(B=>B.key)),M=new Set(t.pinned.map(B=>B.path)),F=n.trim().length>0,U=x.length>0||_.length>0,O=Y.length>0||t.sessions.length===0||F,ie=V$(t.outputs),ke=ie.length>0&&!F,J={expandedFolders:s,pinnedPaths:M,workspaceId:t.id,onToggleFolder:f,onItemClick:l,onPinToggle:u};return r`
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
            @input=${B=>i?.(B.target.value)}
          />
          <button
            class="workspace-browse-btn"
            @click=${()=>e.onBrowseFolder?.(".")}
          >Browse Files</button>
        </div>
      </div>

      <div class="workspace-content">
        ${e.browsePath!=null?Y$(e):h}

        ${U?r`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Pinned</h3>
                    <span>${x.length+_.length}</span>
                  </div>
                  <div class="ws-list">
                    ${_.map(B=>r`
                        <div class="ws-list-row">
                          <button class="ws-list-main" @click=${()=>c?.(B)}>
                            <span class=${Gl(B.status)}></span>
                            <span class="ws-list-title">${B.title}</span>
                            <span class="ws-list-meta">${K(B.created.getTime())}</span>
                          </button>
                          <button
                            class="ws-pin-btn active"
                            @click=${()=>p?.(t.id,B.key,!0)}
                            title="Unpin"
                          >
                            Unpin
                          </button>
                        </div>
                      `)}
                    ${x.map(B=>ni({workspaceId:t.id,entry:B,pinned:!0,onOpen:l,onPinToggle:u}))}
                  </div>
                </section>
              `:h}

        ${X$({tasks:t.tasks??[],workspaceName:t.name,showCompleted:a,onToggleTaskComplete:v,onCreateTask:m,onToggleCompletedTasks:k,onStartTask:d,editingTaskId:g,onEditTask:S,onUpdateTask:A})}

        ${ke?r`
              <section class="ws-section">
                <div class="ws-section__header">
                  <h3>Recent</h3>
                  <span>${ie.length}</span>
                </div>
                <div class="ws-list">
                  ${ie.map(B=>G$({workspaceId:t.id,entry:B,pinned:M.has(B.path),onOpen:l,onPinToggle:u}))}
                </div>
              </section>
            `:h}

        <section class="ws-section">
          <div class="ws-section__header">
            <h3>Artifacts</h3>
            <span>${R?Z.length:L.length}</span>
            ${T&&L.length>0?r`<button class="ws-export-drive-btn" @click=${()=>{const B=L.map(Oe=>Oe.path);T(B)}}>Export to Drive</button>`:h}
          </div>
          <div class="ws-list ws-list--scroll">
            ${R?Z.length===0?r`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:Z.map(B=>up(B,0,J)):L.length===0?r`<div class="ws-empty">
                      <span class="ws-empty-hint">No artifacts yet. Ask your ally to create a document, plan, or analysis — it'll appear here.</span>
                    </div>`:L.map(B=>ni({workspaceId:t.id,entry:B,pinned:!1,onOpen:l,onPinToggle:u}))}
          </div>
        </section>

        ${O?r`
                <section class="ws-section">
                  <div class="ws-section__header">
                    <h3>Sessions</h3>
                    <span>${Y.length}</span>
                  </div>
                  <div class="ws-list ws-list--scroll">
                    ${Y.length===0?r`
                            <div class="ws-empty">
                              <span class="ws-empty-hint">No sessions yet. Sessions are saved conversations with your ally — start a chat to create one.</span>
                            </div>
                          `:Y.map(B=>r`
                              <div class="ws-list-row">
                                <button class="ws-list-main ws-list-row--button" @click=${()=>c?.(B)}>
                                  <span class=${Gl(B.status)}></span>
                                  <span class="ws-list-title">${B.title}</span>
                                  <span class="ws-list-meta">${K(B.created.getTime())}</span>
                                </button>
                                <button
                                  class="ws-pin-btn ${I.has(B.key)?"active":""}"
                                  @click=${()=>p?.(t.id,B.key,I.has(B.key))}
                                  title=${I.has(B.key)?"Unpin":"Pin"}
                                >
                                  ${I.has(B.key)?"Unpin":"Pin"}
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
                  ${t.memory.map(B=>ni({workspaceId:t.id,entry:B,pinned:M.has(B.path),onOpen:l,onPinToggle:u}))}
                </div>
              </section>
            `:h}
      </div>
    </div>
  `}function X$(e){const{tasks:t,workspaceName:n,showCompleted:s,onToggleTaskComplete:a,onCreateTask:i,onToggleCompletedTasks:o,onStartTask:l,editingTaskId:c,onEditTask:u,onUpdateTask:p}=e,f=Qs(t.filter(m=>m.status==="pending")),v=Qs(t.filter(m=>m.status==="complete"));return r`
    <section class="ws-section">
      <div class="ws-section__header">
        <h3>Tasks</h3>
        <span>${f.length} open${v.length>0?`, ${v.length} done`:""}</span>
      </div>
      <div class="ws-list ws-list--scroll">
        ${f.length===0&&v.length===0?r`<div class="ws-empty">No tasks</div>`:h}
        ${f.map(m=>Ql(m,a,l,c,u,p))}
        ${v.length>0?r`
              <button class="ws-task-completed-toggle" @click=${()=>o?.()}>
                ${s?"Hide":"Show"} ${v.length} completed
              </button>
              ${s?v.map(m=>Ql(m,a,l,c,u,p)):h}
            `:h}
      </div>
      ${i?r`
            <form
              class="ws-task-create-form"
              @submit=${m=>{m.preventDefault();const d=m.currentTarget.querySelector("input"),g=d.value.trim();g&&(i(g,n),d.value="")}}
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
  `}function Z$(e){const{connected:t,workspaces:n,selectedWorkspace:s,searchQuery:a,itemSearchQuery:i,expandedFolders:o,loading:l,createLoading:c,error:u,allTasks:p=[],taskFilter:f="outstanding",taskSort:v="due",taskSearch:m="",showCompletedTasks:k=!1,editingTaskId:d,workspaceNames:g=[],onSearch:S,onItemSearch:A,onSelectWorkspace:T,onBack:x,onItemClick:_,onSessionClick:L,onPinToggle:R,onPinSessionToggle:Z,onCreateWorkspace:Y,onDeleteWorkspace:I,onToggleFolder:M,onTeamSetup:F,onToggleTaskComplete:U,onCreateTask:O,onSetTaskFilter:ie,onSetTaskSort:ke,onSetTaskSearch:J,onToggleCompletedTasks:B,onStartTask:Oe,onEditTask:gn,onUpdateTask:X}=e,Ut=n.filter(V=>W$(a,`${V.name} ${V.path} ${V.type}`));return s?J$({workspace:s,itemSearchQuery:i??"",expandedFolders:o,showCompletedTasks:k,onItemSearch:A,onBack:x,onItemClick:_,onSessionClick:L,onPinToggle:R,onPinSessionToggle:Z,onToggleFolder:M,onToggleTaskComplete:U,onCreateTask:O,onToggleCompletedTasks:B,onStartTask:Oe,editingTaskId:d,onEditTask:gn,onUpdateTask:X,browsePath:e.browsePath,browseEntries:e.browseEntries,breadcrumbs:e.breadcrumbs,browseSearchQuery:e.browseSearchQuery,browseSearchResults:e.browseSearchResults,onBrowseFolder:e.onBrowseFolder,onBrowseSearch:e.onBrowseSearch,onBrowseBack:e.onBrowseBack,onCreateFolder:e.onCreateFolder,onBatchPushToDrive:e.onBatchPushToDrive}):r`
    <div class="workspaces-container">
      <div class="workspaces-toolbar">
        <form
            class="workspaces-create-form"
            @submit=${async V=>{if(V.preventDefault(),c||!Y)return;const mn=V.currentTarget,H=new FormData(mn),at=H.get("name"),zt=(typeof at=="string"?at:"").trim();if(!zt)return;const je=H.get("type"),Kt=(typeof je=="string"?je:"project").trim().toLowerCase(),vn=Kt==="team"||Kt==="personal"?Kt:"project",yn=H.get("path"),bn=(typeof yn=="string"?yn:"").trim();await Y({name:zt,type:vn,...bn?{path:bn}:{}})!==!1&&mn.reset()}}
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
              ?disabled=${!!c}
            >
              ${c?"Adding...":"Add Workspace"}
            </button>
          </form>
          <input
            type="text"
            class="workspaces-search-input"
            placeholder="Search workspaces..."
            .value=${a}
            @input=${V=>S?.(V.target.value)}
          />
          <span class="workspaces-count">${Ut.length} workspaces</span>
          <span class="workspaces-status ${t?"online":"offline"}">
            ${t?"Online":"Offline"}
          </span>
          ${F?r`<button class="ws-team-setup-btn" @click=${()=>F()}>Team Setup</button>`:h}
      </div>

      ${u?r`<div class="callout danger" style="margin: 16px;">${u}</div>`:h}

      ${l?r`
              <div class="workspaces-loading">
                <div class="spinner"></div>
                <span>Loading workspaces...</span>
              </div>
            `:r`
              <div class="workspaces-body">
                <div class="workspace-grid">
                  ${Ut.length===0?r`
                          <div class="workspaces-empty">
                            <span class="workspaces-empty-icon">${t?"📭":"🔌"}</span>
                            <span>${t?"No workspaces yet":"Connect to gateway to see workspaces"}</span>
                            ${t?r`<span class="workspaces-empty-hint">Workspaces organize your projects. Ask your ally to create one, or start a focused session in chat.</span>`:h}
                          </div>
                        `:Ut.map(V=>H$(V,T,I))}
                </div>

                ${e0({tasks:p,taskFilter:f,taskSort:v,taskSearch:m,onToggleTaskComplete:U,onSetTaskFilter:ie,onSetTaskSort:ke,onSetTaskSearch:J,onCreateTask:O,workspaceNames:g,onStartTask:Oe,editingTaskId:d,onEditTask:gn,onUpdateTask:X})}
              </div>
            `}
    </div>
  `}function e0(e){const{tasks:t,taskFilter:n,taskSort:s="due",taskSearch:a="",onToggleTaskComplete:i,onSetTaskFilter:o,onSetTaskSort:l,onSetTaskSearch:c,onCreateTask:u,workspaceNames:p=[],onStartTask:f,editingTaskId:v,onEditTask:m,onUpdateTask:k}=e;if(t.length===0&&!u)return r``;let d;if(n==="outstanding")d=t.filter(S=>S.status==="pending");else if(n==="today"){const S=ce();d=t.filter(A=>A.status==="pending"&&A.dueDate!=null&&A.dueDate<=S)}else n==="complete"?d=t.filter(S=>S.status==="complete"):d=t;if(a){const S=a.toLowerCase();d=d.filter(A=>A.title.toLowerCase().includes(S)||A.project?.toLowerCase().includes(S))}const g=Qs(d,s);return r`
    <div class="ws-all-tasks-section">
      <section class="ws-section">
        <div class="ws-section__header">
          <div class="ws-section__header-left">
            <h3>All Tasks</h3>
            ${c?r`<input
                  type="text"
                  class="ws-task-search"
                  placeholder="Search tasks..."
                  .value=${a}
                  @input=${S=>c(S.target.value)}
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
              @change=${S=>l?.(S.target.value)}
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
                @submit=${S=>{S.preventDefault();const A=S.currentTarget,T=A.querySelector(".ws-task-create-input"),x=A.querySelector(".ws-task-create-project"),_=T.value.trim();if(!_)return;const L=x?.value||p[0]||"";u(_,L),T.value=""}}
              >
                <input
                  type="text"
                  class="ws-task-create-input"
                  placeholder="Add a task..."
                />
                ${p.length>0?r`
                      <select class="ws-task-create-project">
                        ${p.map(S=>r`<option value=${S}>${S}</option>`)}
                      </select>
                    `:h}
                <button type="submit" class="ws-task-create-btn">Add</button>
              </form>
            `:h}
        <div class="ws-list ws-list--scroll">
          ${g.length===0?r`<div class="ws-empty">No tasks</div>`:g.map(S=>Oi(S,i,f,v,m,k))}
        </div>
      </section>
    </div>
  `}function t0(e){return e===ce()}function n0(e){const t=new Date(e+"T12:00:00");return s0(t)}function s0(e){const t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],n=["January","February","March","April","May","June","July","August","September","October","November","December"],s=t[e.getDay()],a=n[e.getMonth()],i=e.getDate();return`${s}, ${a} ${i}`}function a0(e){return r`
    <form class="ws-task-create-form" @submit=${t=>{t.preventDefault();const s=t.currentTarget.querySelector("input"),a=s.value.trim();a&&(e(a),s.value="")}}>
      <input type="text" class="ws-task-create-input" placeholder="Add a task for today..." />
      <button type="submit" class="ws-task-create-btn">Add</button>
    </form>
  `}function i0(e){const t=Qs(e.todayTasks??[],"due"),n=t.filter(a=>a.status==="pending"),s=t.filter(a=>a.status==="complete");return r`
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
              ${e.onCreateTask?a0(e.onCreateTask):h}
              <div class="today-tasks-list">
                ${n.length===0&&s.length===0?r`<div class="today-tasks-empty">No tasks for today. Add one above or drop tasks in your daily brief.</div>`:n.map(a=>Oi(a,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask,e.onViewTaskOutput))}
              </div>
              ${s.length>0?r`
                    <button class="today-completed-toggle" @click=${()=>e.onToggleCompletedTasks?.()}>
                      ${e.showCompletedTasks?"Hide":"Show"} ${s.length} completed
                    </button>
                    ${e.showCompletedTasks?r`<div class="today-tasks-list today-tasks-list--completed">
                          ${s.map(a=>Oi(a,e.onToggleTaskComplete,e.onStartTask,e.editingTaskId,e.onEditTask,e.onUpdateTask))}
                        </div>`:h}
                  `:h}
            `}
      </div>
    </div>
  `}function o0(e){const t=ce(),n=e.selectedDate??t,s=t0(n),a=n0(n),i=e.viewMode??"brief";return r`
    <div class="my-day-toolbar">
      <div class="today-date-nav">
        ${e.onDatePrev?r`<button class="today-date-btn" @click=${e.onDatePrev} title="Previous day">&#x2039;</button>`:h}
        <span class="today-date-label ${s?"":"past-date"}">${a}</span>
        ${e.onDateNext?r`<button class="today-date-btn" @click=${e.onDateNext} title="Next day">&#x203A;</button>`:h}
        ${!s&&e.onDateToday?r`<button class="today-date-today-btn" @click=${e.onDateToday}>Today</button>`:h}
      </div>
      <div class="today-view-tabs">
        <button class="today-view-tab ${i==="brief"?"active":""}"
          @click=${()=>e.onViewModeChange?.("brief")}>Brief</button>
        <button class="today-view-tab ${i==="tasks"?"active":""}"
          @click=${()=>e.onViewModeChange?.("tasks")}>Tasks</button>
        <button class="today-view-tab ${i==="inbox"?"active":""}"
          @click=${()=>e.onViewModeChange?.("inbox")}>Inbox${(e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length??0)>0?r`<span class="tab-badge">${e.inboxCount??e.inboxItems?.filter(o=>o.status==="pending").length??e.decisionCards?.items.length}</span>`:h}</button>
      </div>
      <div class="today-quick-actions">
        ${new Date().getHours()<15?!e.focusPulseActive&&e.onStartMorningSet?r`<button class="today-morning-set-btn" @click=${e.onStartMorningSet}
                  title="Start your morning focus ritual">\u2600\uFE0F Start my day</button>`:h:e.onEveningCapture?r`<button class="today-evening-btn" @click=${e.onEveningCapture}
                  title="Reflect on your day and set up tomorrow">\uD83C\uDF19 Evening Capture</button>`:h}
        ${e.onRefresh?r`<button class="my-day-refresh-btn" @click=${e.onRefresh} title="Refresh / Generate Brief">&#x21BB;</button>`:null}
      </div>
    </div>
  `}function r0(e){return r`
    <div class="my-day-brief-full">
      ${K$({items:e.inboxItems??[],loading:e.inboxLoading,count:e.inboxCount,scoringId:e.inboxScoringId,scoringValue:e.inboxScoringValue,feedbackText:e.inboxFeedbackText,onViewOutput:t=>e.onInboxViewOutput?.(t),onOpenChat:t=>e.onInboxOpenChat?.(t),onDismiss:t=>e.onInboxDismiss?.(t),onScore:(t,n,s)=>e.onInboxScore?.(t,n,s),onSetScoring:(t,n)=>e.onInboxSetScoring?.(t,n),onFeedbackChange:t=>e.onInboxFeedbackChange?.(t),onMarkAll:()=>e.onInboxMarkAll?.()})}
    </div>
  `}function l0(e){const t=ce();e.selectedDate;const n=e.viewMode??"brief";if(e.loading)return r`
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
      ${n==="brief"?r`<div class="my-day-brief-full">
            ${N$(s)}
          </div>`:n==="tasks"?r`<div class="my-day-brief-full">${i0(e)}</div>`:r0(e)}
    </div>
  `}function c0(e){const t=g0(e),n=k0(e);return r`
    ${S0(n)}
    ${$0(t)}
    ${d0(e)}
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
              `:e.nodes.map(s=>I0(s))}
      </div>
    </section>
  `}function d0(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return r`
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
              ${n.map(a=>u0(a,e))}
            `:h}
        ${s.length>0?r`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(a=>p0(a,e))}
            `:h}
        ${n.length===0&&s.length===0?r`
                <div class="muted">No paired devices.</div>
              `:h}
      </div>
    </section>
  `}function u0(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?K(e.ts):"n/a",a=e.role?.trim()?`role: ${e.role}`:"role: -",i=e.isRepair?" · repair":"",o=e.remoteIp?` · ${e.remoteIp}`:"";return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${o}</div>
        <div class="muted" style="margin-top: 6px;">
          ${a} · requested ${s}${i}
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
  `}function p0(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",a=`roles: ${li(e.roles)}`,i=`scopes: ${li(e.scopes)}`,o=Array.isArray(e.tokens)?e.tokens:[];return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${s}</div>
        <div class="muted" style="margin-top: 6px;">${a} · ${i}</div>
        ${o.length===0?r`
                <div class="muted" style="margin-top: 6px">Tokens: none</div>
              `:r`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${o.map(l=>h0(e.deviceId,l,t))}
              </div>
            `}
      </div>
    </div>
  `}function h0(e,t,n){const s=t.revokedAtMs?"revoked":"active",a=`scopes: ${li(t.scopes)}`,i=K(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return r`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${a} · ${i}</div>
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
  `}const dt="__defaults__",Xl=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],f0=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function g0(e){const t=e.configForm,n=R0(e.nodes),{defaultBinding:s,agents:a}=P0(t),i=!!t,o=e.configSaving||e.configFormMode==="raw";return{ready:i,disabled:o,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:a,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function Zl(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function m0(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function v0(e){const t=e?.defaults??{};return{security:Zl(t.security),ask:m0(t.ask),askFallback:Zl(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function y0(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(a=>{if(!a||typeof a!="object")return;const i=a,o=typeof i.id=="string"?i.id.trim():"";if(!o)return;const l=typeof i.name=="string"?i.name.trim():void 0,c=i.default===!0;s.push({id:o,name:l||void 0,isDefault:c})}),s}function b0(e,t){const n=y0(e),s=Object.keys(t?.agents??{}),a=new Map;n.forEach(o=>a.set(o.id,o)),s.forEach(o=>{a.has(o)||a.set(o,{id:o})});const i=Array.from(a.values());return i.length===0&&i.push({id:"main",isDefault:!0}),i.sort((o,l)=>{if(o.isDefault&&!l.isDefault)return-1;if(!o.isDefault&&l.isDefault)return 1;const c=o.name?.trim()?o.name:o.id,u=l.name?.trim()?l.name:l.id;return c.localeCompare(u)}),i}function w0(e,t){return e===dt?dt:e&&t.some(n=>n.id===e)?e:dt}function k0(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=v0(t),a=b0(e.configForm,t),i=L0(e.nodes),o=e.execApprovalsTarget;let l=o==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o==="node"&&l&&!i.some(f=>f.id===l)&&(l=null);const c=w0(e.execApprovalsSelectedAgent,a),u=c!==dt?(t?.agents??{})[c]??null:null,p=Array.isArray(u?.allowlist)?u.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:c,selectedAgent:u,agents:a,allowlist:p,target:o,targetNodeId:l,targetNodes:i,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function $0(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return r`
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
                      @change=${s=>{const i=s.target.value.trim();e.onBindDefault(i||null)}}
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
                    `:e.agents.map(s=>E0(s,e))}
            </div>
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function S0(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return r`
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

      ${A0(e)}

      ${t?r`
            ${x0(e)}
            ${T0(e)}
            ${e.selectedScope===dt?h:_0(e)}
          `:r`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function A0(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return r`
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
                    @change=${s=>{const i=s.target.value.trim();e.onSelectTarget("node",i||null)}}
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
  `}function x0(e){return r`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===dt?"active":""}"
          @click=${()=>e.onSelectScope(dt)}
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
  `}function T0(e){const t=e.selectedScope===dt,n=e.defaults,s=e.selectedAgent??{},a=t?["defaults"]:["agents",e.selectedScope],i=typeof s.security=="string"?s.security:void 0,o=typeof s.ask=="string"?s.ask:void 0,l=typeof s.askFallback=="string"?s.askFallback:void 0,c=t?n.security:i??"__default__",u=t?n.ask:o??"__default__",p=t?n.askFallback:l??"__default__",f=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,v=f??n.autoAllowSkills,m=f==null;return r`
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
              @change=${k=>{const g=k.target.value;!t&&g==="__default__"?e.onRemove([...a,"security"]):e.onPatch([...a,"security"],g)}}
            >
              ${t?h:r`<option value="__default__" ?selected=${c==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${Xl.map(k=>r`<option
                    value=${k.value}
                    ?selected=${c===k.value}
                  >
                    ${k.label}
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
              @change=${k=>{const g=k.target.value;!t&&g==="__default__"?e.onRemove([...a,"ask"]):e.onPatch([...a,"ask"],g)}}
            >
              ${t?h:r`<option value="__default__" ?selected=${u==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${f0.map(k=>r`<option
                    value=${k.value}
                    ?selected=${u===k.value}
                  >
                    ${k.label}
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
              @change=${k=>{const g=k.target.value;!t&&g==="__default__"?e.onRemove([...a,"askFallback"]):e.onPatch([...a,"askFallback"],g)}}
            >
              ${t?h:r`<option value="__default__" ?selected=${p==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${Xl.map(k=>r`<option
                    value=${k.value}
                    ?selected=${p===k.value}
                  >
                    ${k.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${t?"Allow skill executables listed by the Gateway.":m?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${v?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${v}
              @change=${k=>{const d=k.target;e.onPatch([...a,"autoAllowSkills"],d.checked)}}
            />
          </label>
          ${!t&&!m?r`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...a,"autoAllowSkills"])}
              >
                Use default
              </button>`:h}
        </div>
      </div>
    </div>
  `}function _0(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return r`
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
            `:n.map((s,a)=>C0(e,s,a))}
    </div>
  `}function C0(e,t,n){const s=t.lastUsedAt?K(t.lastUsedAt):"never",a=t.lastUsedCommand?Xn(t.lastUsedCommand,120):null,i=t.lastResolvedPath?Xn(t.lastResolvedPath,120):null;return r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${a?r`<div class="list-sub mono">${a}</div>`:h}
        ${i?r`<div class="list-sub mono">${i}</div>`:h}
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
  `}function E0(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,a=t.nodes.length>0;return r`
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
            ?disabled=${t.disabled||!a}
            @change=${i=>{const l=i.target.value.trim();t.onBindAgent(e.index,l==="__default__"?null:l)}}
          >
            <option value="__default__" ?selected=${n==="__default__"}>
              Use default
            </option>
            ${t.nodes.map(i=>r`<option
                  value=${i.id}
                  ?selected=${n===i.id}
                >
                  ${i.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function R0(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(l=>String(l)==="system.run"))continue;const i=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!i)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():i;t.push({id:i,label:o===i?i:`${o} · ${i}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function L0(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(l=>String(l)==="system.execApprovals.get"||String(l)==="system.execApprovals.set"))continue;const i=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!i)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():i;t.push({id:i,label:o===i?i:`${o} · ${i}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function P0(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},a=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,i=e.agents??{},o=Array.isArray(i.list)?i.list:[];if(o.length===0)return{defaultBinding:a,agents:[t]};const l=[];return o.forEach((c,u)=>{if(!c||typeof c!="object")return;const p=c,f=typeof p.id=="string"?p.id.trim():"";if(!f)return;const v=typeof p.name=="string"?p.name.trim():void 0,m=p.default===!0,d=(p.tools??{}).exec??{},g=typeof d.node=="string"&&d.node.trim()?d.node.trim():null;l.push({id:f,name:v||void 0,index:u,isDefault:m,binding:g})}),l.length===0&&l.push(t),{defaultBinding:a,agents:l}}function I0(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),a=Array.isArray(e.caps)?e.caps:[],i=Array.isArray(e.commands)?e.commands:[];return r`
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
          ${a.slice(0,12).map(o=>r`<span class="chip">${String(o)}</span>`)}
          ${i.slice(0,8).map(o=>r`<span class="chip">${String(o)}</span>`)}
        </div>
      </div>
    </div>
  `}function D0(e){const t=e.hello?.snapshot,n=t?.uptimeMs?Vi(t.uptimeMs):"n/a",s=t?.policy?.tickIntervalMs?`${t.policy.tickIntervalMs}ms`:"n/a",a=(()=>{if(e.connected||!e.lastError)return null;const o=e.lastError.toLowerCase();if(!(o.includes("unauthorized")||o.includes("connect failed")))return null;const c=!!e.settings.token.trim(),u=!!e.password.trim();return!c&&!u?r`
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
    `})(),i=(()=>{if(e.connected||!e.lastError||(typeof window<"u"?window.isSecureContext:!0))return null;const l=e.lastError.toLowerCase();return!l.includes("secure context")&&!l.includes("device identity required")?null:r`
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
              ${e.lastChannelsRefresh?K(e.lastChannelsRefresh):"n/a"}
            </div>
          </div>
        </div>
        ${e.lastError?r`<div class="callout danger" style="margin-top: 14px;">
              <div>${e.lastError}</div>
              ${a??""}
              ${i??""}
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
        <div class="muted">Next wake ${np(e.cronNext)}</div>
      </div>
    </section>

    <section class="grid grid-cols-2" style="margin-top: 18px;">
      <div class="card">
        <div class="card-title">Updates</div>
        <div class="card-sub">OpenClaw runtime and GodMode plugin versions.</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">OpenClaw</div>
            <div class="stat-value">
              ${e.updateStatus?.openclawVersion??e.hello?.server?.version??"n/a"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">GodMode</div>
            <div class="stat-value">
              ${e.updateStatus?.pluginVersion??"n/a"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Status</div>
            <div class="stat-value ${e.updateStatus?.openclawUpdateAvailable||e.updateStatus?.pluginUpdateAvailable?"warn":"ok"}">
              ${e.updateStatus?.openclawUpdateAvailable||e.updateStatus?.pluginUpdateAvailable?"Update Available":e.updateStatus?"Up to Date":"Unknown"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Last Checked</div>
            <div class="stat-value">
              ${e.updateLastChecked?K(e.updateLastChecked):"Never"}
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
        ${e.updateStatus?.openclawUpdateAvailable?r`
              <div class="callout" style="margin-top: 14px;">
                <div>
                  <b>OpenClaw ${e.updateStatus.openclawVersion} \u2192 ${e.updateStatus.openclawLatest??"newer"}</b>
                </div>
                <div class="row" style="margin-top: 10px; gap: 8px;">
                  ${e.onUpdateNow?r`<button
                          class="btn primary"
                          ?disabled=${e.updateRunning||!e.connected}
                          @click=${()=>e.onUpdateNow?.()}
                        >
                          ${e.updateRunning?"Updating...":"Update Now"}
                        </button>`:h}
                </div>
                <div class="muted" style="margin-top: 8px; font-size: 12px;">
                  Or run manually: <span class="mono">openclaw update</span>
                </div>
              </div>
            `:h}
        ${e.updateStatus?.pluginUpdateAvailable?r`
              <div class="callout" style="margin-top: ${e.updateStatus?.openclawUpdateAvailable?"10":"14"}px;">
                <div>
                  <b>GodMode ${e.updateStatus.pluginVersion} \u2192 ${e.updateStatus.pluginLatest??"newer"}</b>
                </div>
                <div class="row" style="margin-top: 10px; gap: 8px;">
                  ${e.onUpdatePlugin?r`<button
                          class="btn primary"
                          ?disabled=${e.pluginUpdateRunning||!e.connected}
                          @click=${()=>e.onUpdatePlugin?.()}
                        >
                          ${e.pluginUpdateRunning?"Updating...":"Update Now"}
                        </button>`:h}
                </div>
                <div class="muted" style="margin-top: 8px; font-size: 12px;">
                  Or run manually: <span class="mono">curl -fsSL https://lifeongodmode.com/install.sh | sh</span>
                </div>
              </div>
            `:h}
        ${e.updateError?r`<div class="callout danger" style="margin-top: 14px;">
              ${e.updateError}
            </div>`:h}
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
  `}const M0=["","off","minimal","low","medium","high"],O0=["","off","on"],N0=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],F0=["","off","on","stream"];function B0(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function pp(e){return B0(e)==="zai"}function U0(e){return pp(e)?O0:M0}function z0(e,t){return!t||!e||e==="off"?e:"on"}function K0(e,t){return e?t&&e==="on"?"low":e:null}function W0(e){switch(e){case"idle-7d":return"Idle > 7 days";case"task-complete":return"Task completed";case"manual":return"Manual";default:return e}}function q0(){return r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
    <path d="M10 12h4"/>
  </svg>`}function j0(){return r`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 14 4 9 9 4"/>
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
  </svg>`}function V0(e){return r`<svg
    width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="transition: transform 150ms ease; transform: rotate(${e?"90deg":"0deg"});"
  >
    <polyline points="9 18 15 12 9 6"/>
  </svg>`}function H0(e){const t=e.result?.sessions??[],n=new Set(e.archivedSessions.map(i=>i.sessionKey)),s=t.filter(i=>!n.has(i.key)),a=e.archivedSessions.length;return r`
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
            @input=${i=>e.onFiltersChange({activeMinutes:i.target.value,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field">
          <span>Limit</span>
          <input
            .value=${e.limit}
            @input=${i=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:i.target.value,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include global</span>
          <input
            type="checkbox"
            .checked=${e.includeGlobal}
            @change=${i=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:i.target.checked,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include unknown</span>
          <input
            type="checkbox"
            .checked=${e.includeUnknown}
            @change=${i=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:i.target.checked})}
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
              `:s.map(i=>Q0(i,e.basePath,e.onPatch,e.onDelete,e.onArchive,e.loading))}
      </div>
    </section>

    ${G0(e,a)}
  `}function G0(e,t){return t===0&&!e.archivedSessionsLoading?h:r`
    <section class="card archived-section">
      <div
        class="archived-section__header"
        @click=${e.onToggleArchived}
      >
        <div class="row" style="gap: 8px; align-items: center;">
          ${V0(e.archivedSessionsExpanded)}
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
                ${e.archivedSessionsLoading?r`<div class="muted" style="padding: 12px;">Loading...</div>`:e.archivedSessions.length===0?r`<div class="muted" style="padding: 12px;">No archived sessions.</div>`:e.archivedSessions.map(n=>Y0(n,e.onUnarchive,e.loading))}
              </div>
            `:h}
    </section>
  `}function Q0(e,t,n,s,a,i){const o=e.updatedAt?K(e.updatedAt):"n/a",l=e.thinkingLevel??"",c=pp(e.modelProvider),u=z0(l,c),p=U0(e.modelProvider),f=e.verboseLevel??"",v=e.reasoningLevel??"",m=e.displayName??e.key,k=e.kind!=="global",d=k?`${ji("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return r`
    <div class="table-row">
      <div class="mono">${k?r`<a href=${d} class="session-link">${m}</a>`:m}</div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${i}
          placeholder="(optional)"
          @change=${g=>{const S=g.target.value.trim();n(e.key,{label:S||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${o}</div>
      <div>${r$(e)}</div>
      <div>
        <select
          .value=${u}
          ?disabled=${i}
          @change=${g=>{const S=g.target.value;n(e.key,{thinkingLevel:K0(S,c)})}}
        >
          ${p.map(g=>r`<option value=${g}>${g||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${f}
          ?disabled=${i}
          @change=${g=>{const S=g.target.value;n(e.key,{verboseLevel:S||null})}}
        >
          ${N0.map(g=>r`<option value=${g.value}>${g.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${v}
          ?disabled=${i}
          @change=${g=>{const S=g.target.value;n(e.key,{reasoningLevel:S||null})}}
        >
          ${F0.map(g=>r`<option value=${g}>${g||"inherit"}</option>`)}
        </select>
      </div>
      <div class="row" style="gap: 4px;">
        <button
          class="btn btn-icon"
          ?disabled=${i}
          @click=${()=>a(e.key)}
          title="Archive this session"
        >
          ${q0()}
        </button>
        <button class="btn danger btn--sm" ?disabled=${i} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function Y0(e,t,n){const s=K(Date.parse(e.archivedAt));return r`
    <div class="archived-table__row">
      <div class="mono" style="opacity: 0.7;">${e.sessionKey}</div>
      <div>${s}</div>
      <div>${W0(e.reason)}</div>
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
          ${j0()}
        </button>
      </div>
    </div>
  `}function J0(e){return r`<div class="muted" style="padding: 16px;">ClawHub has been retired.</div>`}function X0(e){const t=e.subTab==="godmode",n=t||e.subTab==="my-skills";return r`
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

      ${t?Z0(e):h}
      ${e.subTab==="my-skills"?nS(e):h}
      ${e.subTab==="clawhub"?r`<div style="margin-top: 16px;">${J0(e.clawhub)}</div>`:h}
    </section>
  `}function Z0(e){const t=e.godmodeSkills,n=e.godmodeSkillsLoading,s=e.filter.trim().toLowerCase();if(n&&!t)return r`<div class="muted" style="margin-top: 16px;">Loading GodMode skills...</div>`;if(!t||t.total===0)return r`<div class="muted" style="margin-top: 16px;">No GodMode skills found.</div>`;const a=[...t.skills.map(o=>({...o,_kind:"skill"})),...t.cards.map(o=>({...o,_kind:"card"}))],i=s?a.filter(o=>[o.slug,o.name,o.body.slice(0,200)].join(" ").toLowerCase().includes(s)):a;return r`
    <div class="filters" style="margin-top: 14px;">
      <label class="field" style="flex: 1;">
        <span>Filter</span>
        <input
          .value=${e.filter}
          @input=${o=>e.onFilterChange(o.target.value)}
          placeholder="Search skills and cards"
        />
      </label>
      <div class="muted">${i.length} of ${a.length}</div>
    </div>

    ${i.length===0?r`<div class="muted" style="margin-top: 16px;">No matches.</div>`:r`<div class="list" style="margin-top: 16px;">
          ${i.map(o=>o._kind==="skill"?eS(o,e.expandedSkills.has(o.slug),e.onToggleExpand):tS(o,e.expandedSkills.has(o.slug),e.onToggleExpand))}
        </div>`}
  `}function eS(e,t,n){const s=e.body.split(`
`).find(i=>i.trim().length>0)??"",a=!!e.schedule;return r`
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
          ${a?r`<span class="chip chip-ok" style="font-size: 11px;">scheduled</span>`:r`<span class="chip" style="font-size: 11px;">on-demand</span>`}
        </div>
        <div class="list-sub" style="margin-left: 18px;">${Xn(s,120)}</div>
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
  `}function tS(e,t,n){return r`
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
  `}function nS(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(a=>[a.name,a.description,a.source].join(" ").toLowerCase().includes(n)):t;return r`
    <div class="filters" style="margin-top: 14px;">
      <label class="field" style="flex: 1;">
        <span>Filter</span>
        <input
          .value=${e.filter}
          @input=${a=>e.onFilterChange(a.target.value)}
          placeholder="Search integrations"
        />
      </label>
      <div class="muted">${s.length} shown</div>
    </div>

    ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:h}

    ${s.length===0?r`<div class="muted" style="margin-top: 16px">No integrations found.</div>`:r`<div class="list" style="margin-top: 16px;">
            ${s.map(a=>sS(a,e))}
          </div>`}
  `}function sS(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",a=t.messages[e.skillKey]??null,i=e.install.length>0&&e.missing.bins.length>0,o=[...e.missing.bins.map(c=>`bin:${c}`),...e.missing.env.map(c=>`env:${c}`),...e.missing.config.map(c=>`config:${c}`),...e.missing.os.map(c=>`os:${c}`)],l=[];return e.disabled&&l.push("disabled"),e.blockedByAllowlist&&l.push("blocked by allowlist"),r`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${Xn(e.description,140)}</div>
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
        ${l.length>0?r`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${l.join(", ")}
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
          ${i?r`<button
                class="btn"
                ?disabled=${n}
                @click=${()=>t.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${n?"Installing…":e.install[0].label}
              </button>`:h}
        </div>
        ${a?r`<div
              class="muted"
              style="margin-top: 8px; color: ${a.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${a.message}
            </div>`:h}
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
            `:h}
      </div>
    </div>
  `}function aS(e){switch(e){case"claude":return"chip-ok";case"codex":return"chip-warn";case"gemini":return"chip-info";default:return""}}function iS(e){const t=e.filter.trim().toLowerCase(),n=t?e.roster.filter(i=>[i.slug,i.name,i.category,i.mission??"",...i.taskTypes].join(" ").toLowerCase().includes(t)):e.roster,s=new Map;for(const i of n){const o=i.category||"_default";s.has(o)||s.set(o,[]),s.get(o).push(i)}const a=[...s.keys()].sort((i,o)=>i==="_default"?1:o==="_default"?-1:i.localeCompare(o));return r`
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
            @input=${i=>e.onFilterChange(i.target.value)}
            placeholder="Search agents by name, category, or task type"
          />
        </label>
      </div>

      ${e.error?r`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:h}

      ${e.loading&&e.roster.length===0?r`<div class="muted" style="margin-top: 16px;">Loading agent roster...</div>`:h}

      ${!e.loading&&n.length===0?r`<div class="muted" style="margin-top: 16px;">
            ${e.roster.length===0?"No agents found. Add persona files to your agent-roster directory.":"No matches."}
          </div>`:h}

      ${a.map(i=>{const o=s.get(i),l=i==="_default"?"General":hp(i);return r`
          <div style="margin-top: 20px;">
            <div
              style="font-size: 12px; font-weight: 600; text-transform: uppercase;
                     letter-spacing: 0.05em; color: var(--muted-color, #888);
                     margin-bottom: 8px; padding-left: 2px;"
            >
              ${l}
            </div>
            <div class="list">
              ${o.map(c=>oS(c,e.expandedAgents.has(c.slug),e.onToggleExpand))}
            </div>
          </div>
        `})}
    </section>
  `}function hp(e){return e.replace(/[-_]/g," ").replace(/\b\w/g,t=>t.toUpperCase())}function oS(e,t,n){return r`
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
          ${e.engine?r`<span class="chip ${aS(e.engine)}" style="font-size: 11px;">${e.engine}</span>`:h}
        </div>
        ${e.mission?r`<div class="list-sub" style="margin-left: 18px;">${Xn(e.mission,120)}</div>`:h}
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
                  <span>${hp(e.category||"_default")}</span>
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
  `}function fp(){return{open:!1,images:[],currentIndex:0}}function rS(e,t,n){return{open:!0,images:t,currentIndex:n}}function lS(){return fp()}function cS(e,t){const n=e.currentIndex+t;return n<0||n>=e.images.length?e:{...e,currentIndex:n}}const dS=r`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,uS=r`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,pS=r`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;function hS(e,t){if(!e.open||e.images.length===0)return h;const n=e.images[e.currentIndex];if(!n)return h;const s=e.images.length>1,a=e.currentIndex>0,i=e.currentIndex<e.images.length-1;return r`
    <div
      class="lightbox-overlay"
      @click=${o=>{o.target.classList.contains("lightbox-overlay")&&t.onClose()}}
      @keydown=${o=>{o.key==="Escape"&&t.onClose(),o.key==="ArrowRight"&&i&&t.onNav(1),o.key==="ArrowLeft"&&a&&t.onNav(-1)}}
      tabindex="0"
    >
      <button class="lightbox-close" @click=${t.onClose} aria-label="Close image viewer">
        ${dS}
      </button>

      ${s&&a?r`<button class="lightbox-nav lightbox-nav--prev" @click=${()=>t.onNav(-1)} aria-label="Previous image">${uS}</button>`:h}

      <img
        class="lightbox-image"
        src=${n.url}
        alt=${n.alt??"Image preview"}
        @click=${o=>o.stopPropagation()}
        @error=${o=>{o.target.classList.add("lightbox-image--broken")}}
      />

      ${s&&i?r`<button class="lightbox-nav lightbox-nav--next" @click=${()=>t.onNav(1)} aria-label="Next image">${pS}</button>`:h}

      ${s?r`<div class="lightbox-counter">${e.currentIndex+1} / ${e.images.length}</div>`:h}
    </div>
  `}const fS=e=>{switch(e){case"success":return r`
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
      `}};function gS({toasts:e,onDismiss:t}){return e.length===0?null:r`
    <div class="toast-container">
      ${ha(e,n=>n.id,n=>r`
          <div class="toast toast--${n.type}">
            <div class="toast__icon">${fS(n.type)}</div>
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
  `}const ec=[{key:"focusPulse.enabled",icon:"☀️",name:"Focus Pulse",description:"Morning priority ritual + persistent focus widget in the topbar. Silent 30-min pulse checks compare your activity against your plan.",default:!0}];function mS(e,t){return r`
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
  `}function vS(e,t,n){const a=!!(t?.[e.key]??e.default);return r`
    <div class="options-card card">
      <div class="options-card-header">
        <div class="options-card-info">
          <span class="options-card-icon">${e.icon}</span>
          <span class="options-card-name">${e.name}</span>
        </div>
        ${mS(a,()=>n(e.key,!a))}
      </div>
      <div class="options-card-description">${e.description}</div>
    </div>
  `}function yS(e){const{connected:t,loading:n,options:s,onToggle:a,onOpenWizard:i}=e;return t?n&&!s?r`
      <section class="tab-body options-section">
        <div class="options-loading">Loading options...</div>
      </section>
    `:r`
    <section class="tab-body options-section">
      <div class="options-grid">
        ${ec.map(o=>vS(o,s,a))}
      </div>
      ${ec.length===0?r`<div class="options-empty">
            No configurable features yet.
          </div>`:h}
      ${i?r`
            <div class="options-wizard-section">
              <div class="options-card card">
                <div class="options-card-header">
                  <div class="options-card-info">
                    <span class="options-card-icon">Setup</span>
                    <span class="options-card-name">Memory Setup Wizard</span>
                  </div>
                  <button
                    class="options-wizard-btn"
                    @click=${i}
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
    `}const tc=["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Anchorage","Pacific/Honolulu","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Shanghai","Asia/Kolkata","Australia/Sydney","Pacific/Auckland"],bS=["Direct and concise -- no fluff, just answers","Detailed explanations -- walk me through the reasoning","Casual and conversational -- like talking to a friend","Structured with bullet points -- organized and scannable","Technical and precise -- specifics matter"],wS=[{value:"sonnet",label:"Sonnet (fast, balanced)"},{value:"opus",label:"Opus (deep reasoning)"},{value:"haiku",label:"Haiku (quick, lightweight)"}],si=["Never send emails without explicit approval","Never delete or overwrite files without backup","Always search memory before guessing","Never share private information externally"],nc=[{label:"Name",question:"What should I call you?"},{label:"Timezone",question:"What timezone are you in?"},{label:"Focus",question:"What are you building or focused on?"},{label:"Projects",question:"What are your top projects? (1-3)"},{label:"Style",question:"How do you like to communicate?"},{label:"Rules",question:"What rules must the AI always follow?"},{label:"People",question:"Who are the key people in your work/life?"},{label:"Model",question:"What AI model do you prefer?"}];function sc(e){const n=Math.min(Number(e),8);return r`
    <div class="wizard-progress">
      <div class="wizard-progress-dots">
        ${Array.from({length:8},(s,a)=>r`
          <div class="wizard-progress-dot ${a<n?"completed":""} ${a===n?"active":""}"></div>
        `)}
      </div>
      <div class="wizard-progress-text">
        ${n<8?`Step ${n+1} of 8`:"Review"}
      </div>
    </div>
  `}function kS(e){if(e>=nc.length)return r`${h}`;const t=nc[e];return r`
    <div class="wizard-step-header">
      <h2 class="wizard-question">${t.question}</h2>
    </div>
  `}function $S(e,t,n,s){return r`
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
  `}function gp(){return r`<p class="wizard-skip-hint">Press Enter to use the default and continue</p>`}function SS(e,t){function n(a){const i=a.target.value;t.onAnswerChange("name",i)}function s(a){a.key==="Enter"&&(a.preventDefault(),t.onStepChange(1))}return r`
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
  `}function AS(e,t){const n=Intl.DateTimeFormat().resolvedOptions().timeZone;return r`
    <div class="wizard-field">
      <div class="wizard-detected">
        Detected: <strong>${n}</strong>
      </div>
      <select
        class="wizard-select"
        .value=${e.timezone||n}
        @change=${s=>{t.onAnswerChange("timezone",s.target.value)}}
      >
        ${tc.includes(n)?h:r`<option value="${n}">${n} (detected)</option>`}
        ${tc.map(s=>r`
            <option value="${s}" ?selected=${(e.timezone||n)===s}>
              ${s}${s===n?" (detected)":""}
            </option>
          `)}
      </select>
      ${gp()}
    </div>
  `}function xS(e,t){function n(a){t.onAnswerChange("focus",a.target.value)}function s(a){a.key==="Enter"&&(a.preventDefault(),t.onStepChange(3))}return r`
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
  `}function TS(e,t){function n(){const i=document.querySelector(".wizard-project-input");if(!i)return;const o=i.value.trim();o&&e.projects.length<5&&(t.onAnswerChange("projects",[...e.projects,o]),i.value="",i.focus())}function s(i){const o=e.projects.filter((l,c)=>c!==i);t.onAnswerChange("projects",o)}function a(i){i.key==="Enter"&&(i.preventDefault(),i.target.value.trim()?n():e.projects.length>0&&t.onStepChange(4))}return r`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.projects.map((i,o)=>r`
            <span class="wizard-tag">
              ${i}
              <button class="wizard-tag-remove" @click=${()=>s(o)}>x</button>
            </span>
          `)}
      </div>
      <div class="wizard-input-row">
        <input
          type="text"
          class="wizard-input wizard-project-input"
          placeholder="Project name, then press Enter to add"
          @keydown=${a}
          autofocus
        />
        <button class="wizard-btn wizard-btn--small" @click=${n}>Add</button>
      </div>
      ${e.projects.length===0?r`<p class="wizard-hint">Add 1-3 projects, or skip to continue</p>`:h}
    </div>
  `}function _S(e,t){return r`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${bS.map(n=>r`
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
  `}function CS(e,t){const n=e.hardRules.length>0?e.hardRules:[];function s(o){n.includes(o)?t.onAnswerChange("hardRules",n.filter(l=>l!==o)):t.onAnswerChange("hardRules",[...n,o])}function a(){const o=document.querySelector(".wizard-rule-input");if(!o)return;const l=o.value.trim();l&&(t.onAnswerChange("hardRules",[...n,l]),o.value="",o.focus())}function i(o){o.key==="Enter"&&(o.preventDefault(),o.target.value.trim()&&a())}return r`
    <div class="wizard-field">
      <p class="wizard-hint">Select common rules or add your own:</p>
      <div class="wizard-checkbox-list">
        ${si.map(o=>r`
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
          @keydown=${i}
        />
        <button class="wizard-btn wizard-btn--small" @click=${a}>Add</button>
      </div>
      ${n.filter(o=>!si.includes(o)).length>0?r`
            <div class="wizard-tag-list" style="margin-top: 8px;">
              ${n.filter(o=>!si.includes(o)).map(o=>r`
                    <span class="wizard-tag">
                      ${o}
                      <button class="wizard-tag-remove" @click=${()=>{t.onAnswerChange("hardRules",n.filter(l=>l!==o))}}>x</button>
                    </span>
                  `)}
            </div>
          `:h}
    </div>
  `}function ES(e,t){function n(){const i=document.querySelector(".wizard-person-input");if(!i)return;const o=i.value.trim();o&&e.keyPeople.length<10&&(t.onAnswerChange("keyPeople",[...e.keyPeople,o]),i.value="",i.focus())}function s(i){t.onAnswerChange("keyPeople",e.keyPeople.filter((o,l)=>l!==i))}function a(i){i.key==="Enter"&&(i.preventDefault(),i.target.value.trim()?n():e.keyPeople.length>0&&t.onStepChange(7))}return r`
    <div class="wizard-field">
      <div class="wizard-tag-list">
        ${e.keyPeople.map((i,o)=>r`
            <span class="wizard-tag">
              ${i}
              <button class="wizard-tag-remove" @click=${()=>s(o)}>x</button>
            </span>
          `)}
      </div>
      <div class="wizard-input-row">
        <input
          type="text"
          class="wizard-input wizard-person-input"
          placeholder="Person's name, then press Enter"
          @keydown=${a}
          autofocus
        />
        <button class="wizard-btn wizard-btn--small" @click=${n}>Add</button>
      </div>
      <p class="wizard-hint">Co-founders, family, key collaborators. You can add more later.</p>
    </div>
  `}function RS(e,t){return r`
    <div class="wizard-field">
      <div class="wizard-radio-list">
        ${wS.map(n=>r`
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
      ${gp()}
    </div>
  `}function ai(e){return e==null?"not set":typeof e=="string"?e:typeof e=="boolean"||typeof e=="number"?String(e):(Array.isArray(e),JSON.stringify(e))}function LS(e,t){const{answers:n,preview:s,diff:a,fileSelections:i,configSelections:o,generating:l}=e,c=s?.some(p=>p.exists)??!1,u=a&&(a.changes.length>0||a.additions.length>0);return r`
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
                ${n.projects.map(p=>r`<div class="wizard-review-item">${p}</div>`)}
              </div>
            `:h}

        ${n.keyPeople.length>0?r`
              <div class="wizard-review-section">
                <h3>Key People</h3>
                ${n.keyPeople.map(p=>r`<div class="wizard-review-item">${p}</div>`)}
              </div>
            `:h}

        ${n.hardRules.length>0?r`
              <div class="wizard-review-section">
                <h3>AI Rules</h3>
                ${n.hardRules.map(p=>r`<div class="wizard-review-item">${p}</div>`)}
              </div>
            `:h}
      </div>

      ${s&&s.length>0?r`
            <div class="wizard-review-section wizard-review-files">
              <h3>Workspace Files</h3>
              ${c?r`<p class="wizard-hint">Some files already exist. Uncheck to keep your existing version.</p>`:h}
              <div class="wizard-file-list">
                ${s.map(p=>{const f=i[p.path]??p.wouldCreate;return r`
                    <label class="wizard-file-item ${p.wouldCreate?"wizard-file--new":"wizard-file--exists"}">
                      <input
                        type="checkbox"
                        ?checked=${f}
                        @change=${v=>t.onFileToggle(p.path,v.target.checked)}
                      />
                      <span class="wizard-file-path">${p.path}</span>
                      <span class="wizard-file-status">${p.exists?f?"overwrite":"keep existing":"new"}</span>
                    </label>
                  `})}
              </div>
            </div>
          `:h}

      ${u?r`
            <div class="wizard-review-section wizard-review-config">
              <h3>Config Changes</h3>

              ${a.additions.length>0?r`
                    <div class="wizard-config-group">
                      <h4>New settings</h4>
                      ${a.additions.map(p=>{const f=o[p.path]??!0;return r`
                          <label class="wizard-config-item">
                            <input
                              type="checkbox"
                              ?checked=${f}
                              @change=${v=>t.onConfigToggle(p.path,v.target.checked)}
                            />
                            <span class="wizard-config-path">${p.path}</span>
                            <span class="wizard-config-value">${ai(p.recommended)}</span>
                          </label>
                        `})}
                    </div>
                  `:h}

              ${a.changes.length>0?r`
                    <div class="wizard-config-group">
                      <h4>Changed settings</h4>
                      <p class="wizard-hint">These differ from your current config. Check to update.</p>
                      ${a.changes.map(p=>{const f=o[p.path]??!1;return r`
                          <label class="wizard-config-item wizard-config-item--change">
                            <input
                              type="checkbox"
                              ?checked=${f}
                              @change=${v=>t.onConfigToggle(p.path,v.target.checked)}
                            />
                            <span class="wizard-config-path">${p.path}</span>
                            <span class="wizard-config-diff">
                              <span class="wizard-config-current">${ai(p.current)}</span>
                              <span class="wizard-config-arrow">&rarr;</span>
                              <span class="wizard-config-recommended">${ai(p.recommended)}</span>
                            </span>
                          </label>
                        `})}
                    </div>
                  `:h}

              ${a.matching.length>0?r`<p class="wizard-hint">${a.matching.length} settings already match GodMode's recommendations.</p>`:h}
            </div>
          `:r`<p class="wizard-hint">OC config will be patched with optimal memory/agent settings.</p>`}

      <div class="wizard-nav">
        <button
          class="wizard-btn wizard-btn--back"
          @click=${()=>t.onStepChange(7)}
          ?disabled=${l}
        >Back</button>
        <button
          class="wizard-btn wizard-btn--generate ${l?"wizard-btn--loading":""}"
          @click=${()=>t.onGenerate()}
          ?disabled=${l}
        >${l?"Generating...":"Generate Workspace"}</button>
      </div>

      ${e.error?r`<div class="wizard-error">${e.error}</div>`:h}
    </div>
  `}function PS(e,t){const n=e.result;return n?r`
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
  `:r`${h}`}function mp(){return{name:"",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,focus:"",projects:[],commStyle:"Direct and concise -- no fluff, just answers",hardRules:[],keyPeople:[],defaultModel:"sonnet"}}function IS(){return{step:0,answers:mp(),preview:null,diff:null,fileSelections:{},configSelections:{},generating:!1,result:null,error:null}}function vp(e,t){const{step:n,answers:s}=e;if(n===9)return r`
      <div class="wizard-fullscreen">
        ${PS(e,t)}
      </div>
    `;if(n===8)return r`
      <div class="wizard-fullscreen">
        <div class="wizard-container">
          ${sc(n)}
          ${LS(e,t)}
        </div>
      </div>
    `;const a=(()=>{switch(n){case 0:return s.name.trim().length>0;case 1:return!0;case 2:return!0;case 3:return!0;case 4:return s.commStyle.trim().length>0;case 5:return!0;case 6:return!0;case 7:return!0;default:return!1}})(),i=n===7,o=(()=>{switch(n){case 0:return SS(s,t);case 1:return AS(s,t);case 2:return xS(s,t);case 3:return TS(s,t);case 4:return _S(s,t);case 5:return CS(s,t);case 6:return ES(s,t);case 7:return RS(s,t);default:return r`${h}`}})();return r`
    <div class="wizard-fullscreen">
      <div class="wizard-container">
        <div class="wizard-glow"></div>
        ${sc(n)}
        ${kS(n)}
        ${o}
        ${$S(n,t,a,i)}
      </div>
    </div>
  `}const DS=Object.freeze(Object.defineProperty({__proto__:null,emptyWizardAnswers:mp,emptyWizardState:IS,renderOnboardingWizard:vp},Symbol.toStringTag,{value:"Module"}));function fn(e){return e===null?"none":e>=8?"high":e>=5?"medium":"low"}function ds(e){return{high:"trust-score--high",medium:"trust-score--medium",low:"trust-score--low",none:"trust-score--none"}[e]}function MS(e){return{improving:"Improving",declining:"Declining",stable:"Stable",new:"New"}[e]??"New"}function OS(e){return{improving:"trust-trend--up",declining:"trust-trend--down",stable:"trust-trend--stable",new:"trust-trend--new"}[e]??"trust-trend--new"}function NS(e){return{improving:"↑",declining:"↓",stable:"→",new:"•"}[e]??"•"}function FS(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const a=Math.floor(s/24);return a<7?`${a}d ago`:new Date(e).toLocaleDateString()}function BS(e){const t=e.overallScore,n=fn(t);return r`
    <div class="trust-overall">
      <div class="trust-overall-score ${ds(n)}">
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
  `}function US(e,t){const s=Math.min(100,Math.max(0,(e??t)/10*100)),a=fn(e??(t>0?t:null));return r`
    <div class="trust-progress">
      <div
        class="trust-progress-fill ${ds(a)}"
        style="width: ${s}%"
      ></div>
    </div>
  `}function zS(e,t){const s=e.trustScore!==null?e.trustScore.toFixed(1):e.avgRating>0?e.avgRating.toFixed(1):"--",a=fn(e.trustScore??(e.avgRating>0?e.avgRating:null)),i=e.count<10?10-e.count:0;return r`
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
        <span class="trust-card-score ${ds(a)}">${s}</span>
        <span class="trust-card-score-label">/10</span>
        <span class="trust-trend ${OS(e.trend)}">
          ${NS(e.trend)} ${MS(e.trend)}
        </span>
      </div>

      ${US(e.trustScore,e.avgRating)}

      <div class="trust-card-meta">
        <span class="trust-card-count">${e.count} rating${e.count!==1?"s":""}</span>
        ${i>0?r`<span class="trust-card-pending">${i} more until trust score</span>`:h}
        ${e.needsFeedback?r`<span class="trust-card-needs-feedback">Needs improvement</span>`:h}
      </div>

      ${e.recentFeedback.length>0?r`
            <div class="trust-card-feedback">
              <span class="trust-card-feedback-label">Feedback applied:</span>
              ${e.recentFeedback.map(o=>r`<span class="trust-card-feedback-item">${o}</span>`)}
            </div>
          `:h}
    </div>
  `}function KS(){return[{workflow:"Code Reviews",avgRating:8.2,count:14,trustScore:8.2,needsFeedback:!1,trend:"improving",recentNotes:[],recentFeedback:[]},{workflow:"Email Drafts",avgRating:6.5,count:11,trustScore:6.5,needsFeedback:!0,trend:"stable",recentNotes:[],recentFeedback:["Be more concise","Match my tone"]},{workflow:"Research",avgRating:7.8,count:3,trustScore:null,needsFeedback:!1,trend:"new",recentNotes:[],recentFeedback:[]}]}function WS(){const e=KS();return{workflows:e.map(t=>t.workflow),summaries:e,ratings:[],total:0,overallScore:7.6,totalRatings:28,totalUses:28}}function qS(e){const t=fn(e.rating);return r`
    <div class="trust-rating-row">
      <span class="trust-rating-score ${ds(t)}">${e.rating}</span>
      <span class="trust-rating-workflow">${e.workflow}</span>
      ${e.note?r`<span class="trust-rating-note">${e.note}</span>`:h}
      <span class="trust-rating-time">${FS(e.timestamp)}</span>
    </div>
  `}function jS(){return r`
    <div class="trust-sample-banner">
      Sample data — use skills and rate them to build your real trust profile.
    </div>
  `}function VS(e){const t=e.connected,n=e.guardrailsData,s=e.consciousnessStatus,a=e.data?.todayRating??null,i=e.updateStatus??null,o=i?.openclawUpdateAvailable||i?.pluginUpdateAvailable;if(!t)return{level:"alert",icon:"⚠️",text:"Gateway disconnected",detail:"Reconnect to restore full functionality."};if(o){const c=[];return i.openclawUpdateAvailable&&i.openclawLatest&&c.push(`OpenClaw ${i.openclawVersion} → ${i.openclawLatest}`),i.pluginUpdateAvailable&&i.pluginLatest&&c.push(`GodMode ${i.pluginVersion} → ${i.pluginLatest}`),{level:"warn",icon:"🔄",text:"Update available",detail:c.join(", ")+". Visit Overview to update."}}if(s==="error")return{level:"warn",icon:"🧠",text:"Consciousness sync needs attention",detail:"Your system is running but the last sync encountered an error."};if(n){const c=n.gates.filter(p=>p.enabled).length,u=n.gates.length;if(c<u)return{level:"warn",icon:"🛡",text:`${u-c} security gate${u-c!==1?"s":""} disabled`,detail:"Your system is running with reduced safety coverage."}}const l=i&&!o?" Up to date.":"";return a?a.rating>=8?{level:"ok",icon:"✨",text:`Rated ${a.rating}/10 today — GodMode is running great.`,detail:`All systems secure and building trust daily.${l}`}:a.rating>=5?{level:"ok",icon:"💪",text:`Rated ${a.rating}/10 today — working to improve.`,detail:`Your feedback is being applied. All systems secure.${l}`}:{level:"warn",icon:"💬",text:`Rated ${a.rating}/10 today — your feedback matters.`,detail:`We're using your input to get better. All systems secure.${l}`}:{level:"ok",icon:"✅",text:"Your GodMode is safe, secure, and building trust daily.",detail:`All systems healthy.${l} Rate your day below to help improve.`}}function HS(e){const{level:t,icon:n,text:s,detail:a}=VS(e);return r`
    <div class="trust-hero trust-hero--${t}">
      <span class="trust-hero-icon">${n}</span>
      <div class="trust-hero-body">
        <div class="trust-hero-text">${s}</div>
        <div class="trust-hero-detail">${a}</div>
      </div>
    </div>
  `}function GS(e){return e<=4?"trust-daily-button--low":e<=7?"trust-daily-button--med":"trust-daily-button--high"}function ac(e){const t=[];for(let n=0;n<7;n++)t.push(e[n]??null);return r`
    <div class="trust-daily-trend">
      ${t.map(n=>{if(!n)return r`<div class="trust-daily-trend-dot trust-daily-trend-dot--empty"></div>`;const s=Math.max(4,n.rating/10*28),a=fn(n.rating);return r`
          <div
            class="trust-daily-trend-dot trust-daily-trend-dot--${a==="none"?"medium":a}"
            style="height: ${s}px"
            title="${n.date}: ${n.rating}/10"
          ></div>
        `})}
    </div>
  `}function QS(e){const t=e.data,n=t?.todayRating??null,s=t?.recentDaily??[],a=t?.dailyStreak??0,i=t?.dailyAverage??null;if(!e.onDailyRate)return h;if(n){const o=fn(n.rating),l=n.rating<7&&!n.note;return r`
      <div class="trust-daily">
        <div class="trust-daily-header">
          <span class="trust-daily-prompt">Today's Rating</span>
          ${a>1?r`<span class="trust-daily-streak">${a} day streak</span>`:h}
        </div>
        <div class="trust-daily-result">
          <div class="trust-daily-result-score ${ds(o)}">
            ${n.rating}<span class="trust-daily-result-max">/10</span>
          </div>
          <div class="trust-daily-result-meta">
            <span class="trust-daily-result-label">
              ${n.rating>=8?"Great day!":n.rating>=5?"Good, working to improve":"Thanks for the honesty"}
            </span>
            ${n.note?r`<span class="trust-daily-result-note">"${n.note}"</span>`:h}
            ${i!==null?r`<span class="trust-daily-result-note">7-day avg: ${i}/10</span>`:h}
          </div>
          ${s.length>1?ac(s):h}
        </div>
        ${l?r`
              <div class="trust-daily-feedback">
                <input
                  class="trust-daily-feedback-input"
                  type="text"
                  placeholder="What could be better?"
                  @keydown=${c=>{if(c.key==="Enter"){const u=c.target,p=u.value.trim();p&&e.onDailyRate&&(e.onDailyRate(n.rating,p),u.value="")}}}
                />
                <button
                  class="trust-daily-feedback-submit"
                  type="button"
                  @click=${c=>{const p=c.target.previousElementSibling,f=p?.value?.trim();f&&e.onDailyRate&&(e.onDailyRate(n.rating,f),p.value="")}}
                >Send</button>
              </div>
            `:h}
      </div>
    `}return r`
    <div class="trust-daily">
      <div class="trust-daily-header">
        <span class="trust-daily-prompt">How happy were you with GodMode today?</span>
        ${a>0?r`<span class="trust-daily-streak">${a} day streak</span>`:h}
      </div>
      <div class="trust-daily-buttons">
        ${[1,2,3,4,5,6,7,8,9,10].map(o=>r`
            <button
              class="trust-daily-button ${GS(o)}"
              type="button"
              title="${o}/10"
              @click=${()=>e.onDailyRate(o)}
            >${o}</button>
          `)}
      </div>
      ${s.length>0?r`
            <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              ${ac(s)}
              ${i!==null?r`<span style="font-size: 0.75rem; color: var(--text-muted);">7-day avg: ${i}/10</span>`:h}
            </div>
          `:h}
    </div>
  `}function YS(e){if(!e)return r`
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
    `;const t=e.gates,n=t.filter(p=>p.enabled).length,s=t.length,a=n===s,i=Date.now()-864e5,o=e.activity.filter(p=>Date.parse(p.timestamp)>i),l=o.filter(p=>p.action==="blocked").length,c=o.filter(p=>p.action==="fired").length,u=a?"trust-health-card-badge--ok":n>0?"trust-health-card-badge--warn":"trust-health-card-badge--error";return r`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F6E1}</span>
        Security
        <span class="trust-health-card-badge ${u}">
          ${n}/${s} Active
        </span>
      </div>

      <div class="trust-health-gate-list">
        ${t.map(p=>r`
            <div class="trust-health-gate ${p.enabled?"":"trust-health-gate--disabled"}">
              <span class="trust-health-dot ${p.enabled?"trust-health-dot--ok":"trust-health-dot--idle"}"></span>
              <span class="trust-health-gate-icon">${p.icon}</span>
              <span class="trust-health-gate-name">${p.name}</span>
            </div>
          `)}
      </div>

      ${o.length>0?r`
            <div class="trust-health-activity">
              <span class="trust-health-activity-count">${o.length}</span>
              event${o.length!==1?"s":""} in last 24h
              ${l>0?r` &middot; <span class="trust-health-activity-count">${l}</span> blocked`:h}
              ${c>0?r` &middot; <span class="trust-health-activity-count">${c}</span> fired`:h}
            </div>
          `:r`
            <div class="trust-health-activity">No activity in last 24h</div>
          `}
    </div>
  `}function JS(e){return!e||e==="idle"?"Idle":e==="loading"?"Syncing...":e==="ok"?"Synced":"Error"}function XS(e){return!e||e==="idle"?"trust-health-dot--idle":e==="loading"?"trust-health-dot--warn":e==="ok"?"trust-health-dot--ok":"trust-health-dot--error"}function ZS(e){const t=e.connected,n=e.consciousnessStatus,s=e.sessionsCount,a=e.gatewayUptimeMs,l=(t?1:0)+(n==="ok"||n==="idle"?1:0)===2&&t;return r`
    <div class="trust-health-card">
      <div class="trust-health-card-header">
        <span class="trust-health-card-icon">\u{1F4E1}</span>
        Sentinel
        <span class="trust-health-card-badge ${l?"trust-health-card-badge--ok":t?"trust-health-card-badge--warn":"trust-health-card-badge--error"}">${l?"Healthy":t?"Degraded":"Offline"}</span>
      </div>

      <div class="trust-health-row">
        <span class="trust-health-dot ${t?"trust-health-dot--ok":"trust-health-dot--error"}"></span>
        <span class="trust-health-label">Gateway</span>
        <span class="trust-health-value">${t?"Connected":"Disconnected"}</span>
      </div>

      <div class="trust-health-row">
        <span class="trust-health-dot ${XS(n)}"></span>
        <span class="trust-health-label">Consciousness</span>
        <span class="trust-health-value">${JS(n)}</span>
      </div>

      ${s!=null?r`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Sessions</span>
              <span class="trust-health-value">${s} active</span>
            </div>
          `:h}

      ${a!=null?r`
            <div class="trust-health-row">
              <span class="trust-health-dot trust-health-dot--ok"></span>
              <span class="trust-health-label">Uptime</span>
              <span class="trust-health-value">${Vi(a)}</span>
            </div>
          `:h}
    </div>
  `}function e1(e){return r`
    <div class="trust-health">
      <h3 class="trust-health-title">System Health</h3>
      <div class="trust-health-grid">
        ${YS(e.guardrailsData)}
        ${ZS(e)}
      </div>
    </div>
  `}function t1(e){const{connected:t,loading:n,data:s,onRemoveWorkflow:a,onRefresh:i}=e;if(!t)return r`
      <section class="tab-body trust-section">
        <div class="trust-disconnected">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return r`
      <section class="tab-body trust-section">
        <div class="trust-loading">Loading trust tracker...</div>
      </section>
    `;const l=!(s?.summaries??[]).some(f=>f.count>0),c=l?WS():s,u=c.summaries,p=l?[]:s?.ratings??[];return r`
    <section class="tab-body trust-section">
      ${HS(e)}

      ${l?jS():h}

      ${QS(e)}

      ${BS(c)}

      <div class="trust-workflows-grid">
        ${u.map(f=>zS(f,l?null:a))}
      </div>

      ${e1(e)}

      ${p.length>0?r`
            <div class="trust-history">
              <h3 class="trust-history-title">Recent Ratings</h3>
              <div class="trust-history-list">
                ${p.slice(0,20).map(qS)}
              </div>
            </div>
          `:h}
    </section>
  `}function n1(e){const t=Date.now()-Date.parse(e),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);if(s<24)return`${s}h ago`;const a=Math.floor(s/24);return a<7?`${a}d ago`:new Date(e).toLocaleDateString()}function s1(e){return{fired:"guardrails-badge--fired",blocked:"guardrails-badge--blocked",cleaned:"guardrails-badge--cleaned"}[e]??""}function yp(e,t){return r`
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
  `}function a1(e,t,n,s){const a=e.thresholds?.[t]??0;return r`
    <div class="guardrails-threshold">
      <label class="guardrails-threshold-label">${n}</label>
      <input
        class="guardrails-threshold-input"
        type="number"
        min="1"
        .value=${String(a)}
        ?disabled=${!e.enabled}
        @change=${i=>{const o=Number(i.target.value);!Number.isNaN(o)&&o>0&&s(e.id,t,o)}}
      />
    </div>
  `}function i1(e,t,n){const s=e.thresholdLabels?Object.keys(e.thresholdLabels):[];return r`
    <div class="guardrails-card card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${e.icon}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook">${e.hook}</span>
        </div>
        ${yp(e.enabled,()=>t(e.id,!e.enabled))}
      </div>
      <div class="guardrails-card-description">${e.description}</div>
      ${s.length>0?r`
            <div class="guardrails-thresholds">
              ${s.map(a=>a1(e,a,e.thresholdLabels[a],n))}
            </div>
          `:h}
    </div>
  `}function o1(e,t,n){const s=e.action==="redirect"?"↪":"🚫",a=e.action==="redirect"?"redirect":"block";return r`
    <div class="guardrails-card card guardrails-custom-card ${e.enabled?"":"guardrails-card--disabled"}">
      <div class="guardrails-card-header">
        <div class="guardrails-card-info">
          <span class="guardrails-card-icon">${s}</span>
          <span class="guardrails-card-name">${e.name}</span>
          <span class="guardrails-card-hook guardrails-action-tag guardrails-action-tag--${a}">${a}</span>
        </div>
        <div class="guardrails-custom-actions">
          ${yp(e.enabled,()=>t(e.id,!e.enabled))}
          <button class="guardrails-delete-btn" title="Delete rule" @click=${()=>n(e.id)}>&times;</button>
        </div>
      </div>
      <div class="guardrails-card-description">${e.message}</div>
      <div class="guardrails-custom-meta">
        <span class="guardrails-custom-tool">${e.trigger.tool}</span>
        ${e.trigger.patterns.map(i=>r`<span class="guardrails-pattern-tag">${i}</span>`)}
      </div>
    </div>
  `}function r1(e){return r`
    <div class="guardrails-activity-row">
      <span class="guardrails-badge ${s1(e.action)}">${e.action}</span>
      <span class="guardrails-activity-gate">${e.gateId}</span>
      <span class="guardrails-activity-detail">${e.detail}</span>
      <span class="guardrails-activity-time">${n1(e.timestamp)}</span>
    </div>
  `}function l1(e){const{connected:t,loading:n,data:s,onToggle:a,onThresholdChange:i,onCustomToggle:o,onCustomDelete:l,onToggleAddForm:c,onOpenAllyChat:u}=e;if(!t)return r`
      <section class="tab-body guardrails-section">
        <div class="guardrails-empty">Not connected to gateway.</div>
      </section>
    `;if(n&&!s)return r`
      <section class="tab-body guardrails-section">
        <div class="guardrails-loading">Loading guardrails...</div>
      </section>
    `;const p=s?.gates??[],f=s?.activity??[],v=s?.custom??[],m=p.filter(g=>g.enabled).length,k=v.filter(g=>g.enabled).length,d=[`${m}/${p.length} gates active`];return v.length>0&&d.push(`${k} custom rule${v.length===1?"":"s"}`),r`
    <section class="tab-body guardrails-section">
      <div class="guardrails-two-col">
        <div class="guardrails-left">
          <h2 class="guardrails-col-heading">Safety Gates</h2>
          <p class="guardrails-col-subtitle">${m}/${p.length} active — prevent runaway loops, bad searches, and lazy responses.</p>
          <div class="guardrails-grid">
            ${p.map(g=>i1(g,a,i))}
          </div>
        </div>

        <div class="guardrails-right">
          <h2 class="guardrails-col-heading">Custom Rules & Activity</h2>
          <p class="guardrails-col-subtitle">Your rules${v.length>0?` (${k} active)`:""} and recent gate events.</p>

          <div class="guardrails-custom-section">
            <div class="guardrails-custom-header">
              <h3 class="guardrails-custom-title">Custom Rules</h3>
              <button class="guardrails-add-btn" @click=${()=>{u?u("Create a new guardrail rule: "):c()}}>+ Add Rule</button>
            </div>

            ${v.length>0?r`
                  <div class="guardrails-custom-grid">
                    ${v.map(g=>o1(g,o,l))}
                  </div>
                `:r`
                  <div class="guardrails-custom-empty">
                    No custom rules yet. Click "+ Add Rule" to tell your ally what to block or redirect.
                  </div>
                `}
          </div>

          <div class="guardrails-history">
            <h3 class="guardrails-history-title">Recent Activity</h3>
            ${f.length>0?r`
                  <div class="guardrails-history-list">
                    ${f.slice(0,30).map(r1)}
                  </div>
                `:r`<div class="guardrails-no-activity">No gate activity recorded yet.</div>`}
          </div>
        </div>
      </div>
    </section>
  `}const c1={coding:"Builder",research:"Researcher",analysis:"Analyst",creative:"Creative",review:"Reviewer",ops:"Ops",task:"Agent",url:"Reader",idea:"Explorer"};function d1(e){const t=Date.now()-e,n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const s=Math.floor(n/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}function u1(e){switch(e){case"started":return"▶️";case"completed":return"✅";case"failed":return"❌";case"queued":return"⏳";case"stage":return"🔄";default:return"📋"}}function ic(e){switch(e){case"coding":return"mc-type-badge mc-type-badge--coding";case"subagent":return"mc-type-badge mc-type-badge--subagent";case"swarm":return"mc-type-badge mc-type-badge--swarm";case"queue":return"mc-type-badge mc-type-badge--queue";default:return"mc-type-badge"}}function oc(e){return`mc-agent-card mc-agent-card--${e}`}function p1(e){const t=[];return e.activeNow>0&&t.push(`${e.activeNow} agent${e.activeNow>1?"s":""} working`),e.queueReview>0&&t.push(`${e.queueReview} need${e.queueReview>1?"":"s"} your attention`),e.completedToday>0&&t.push(`${e.completedToday} done today`),t.length===0&&(t.push("Nothing running"),e.completedToday>0&&t.push(`${e.completedToday} completed today`)),r`
    <div class="mc-status-line">
      ${e.activeNow>0?r`<span class="mc-active-dot"></span>`:h}
      <span>${t.join(" · ")}</span>
    </div>
  `}function h1(e){return r`
    <div class="mc-stats-banner">
      <div class="mc-stat-card">
        <div class="mc-stat-value">
          ${e.activeNow}
          ${e.activeNow>0?r`<span class="mc-active-dot"></span>`:h}
        </div>
        <div class="mc-stat-label">Active Now</div>
      </div>
      <div class="mc-stat-card">
        <div class="mc-stat-value">${e.completedToday}</div>
        <div class="mc-stat-label">Completed Today</div>
      </div>
      <div class="mc-stat-card">
        <div class="mc-stat-value">${e.failed}</div>
        <div class="mc-stat-label">Failed</div>
      </div>
      <div class="mc-stat-card">
        <div class="mc-stat-value">
          ${e.queueDepth+e.queueReview}
          ${e.queueReview>0?r`<span class="mc-active-dot" style="background:#14b8a6"></span>`:h}
        </div>
        <div class="mc-stat-label">Queue${e.queueReview>0?` (${e.queueReview} review)`:""}</div>
      </div>
    </div>
  `}function f1(e){return e.swarmStages?r`
    <div class="mc-pipeline">
      ${["design","build","qc"].map((n,s)=>{const i=e.swarmStages?.[n]?.status??"pending";return r`
          ${s>0?r`<span class="mc-pipeline-arrow">\u2192</span>`:h}
          <span class="mc-pipeline-stage mc-pipeline-stage--${i}">
            ${n}
          </span>
        `})}
    </div>
  `:h}const ii=new Set;function bp(e,t,n=!1){const s=e.startedAt?cu(e.startedAt,e.endedAt??void 0):null,a=e.childSessionKey&&t.onOpenSession?r`<button class="mc-open-session-btn" @click=${i=>{i.stopPropagation(),t.onOpenSession(e.childSessionKey)}}>Open</button>`:e.sourceTaskId&&t.onOpenTaskSession?r`<button class="mc-open-session-btn" @click=${i=>{i.stopPropagation(),t.onOpenTaskSession(e.sourceTaskId)}}>Open Task</button>`:h;return n&&!ii.has(e.id)?r`
      <div class="${oc(e.status)} mc-agent-card--compact"
           @click=${()=>{ii.add(e.id)}}>
        <div class="mc-agent-card-header">
          <div class="mc-agent-card-info">
            <span class="${ic(e.type)}">${e.roleName}</span>
            <span class="mc-agent-card-task">${e.task}</span>
          </div>
          ${s?r`<span class="mc-agent-card-duration">${s}</span>`:h}
          ${a}
        </div>
      </div>
    `:r`
    <div class="${oc(e.status)}"
         ${n?r``:h}
         @click=${n?()=>{ii.delete(e.id)}:h}>
      <div class="mc-agent-card-header">
        <div class="mc-agent-card-info">
          <span class="${ic(e.type)}">${e.roleName}</span>
          <span class="mc-agent-card-task">${e.task}</span>
        </div>
        ${a}
        ${e.canCancel?r`<button class="mc-cancel-btn" @click=${i=>{i.stopPropagation(),t.onCancel(e.id)}}>Cancel</button>`:h}
        ${e.prUrl?r`<button class="mc-pr-btn" @click=${i=>{i.stopPropagation(),t.onViewDetail(e)}}>View PR</button>`:h}
      </div>
      <div class="mc-agent-card-meta">
        ${s?r`<span class="mc-agent-card-duration">${s}</span>`:h}
        ${e.model?r`<span class="mc-agent-card-model">${e.model}</span>`:h}
        ${e.branch?r`<span class="mc-agent-card-model">${e.branch}</span>`:h}
        ${e.error&&e.status!=="failed"?r`<span style="color: var(--danger, #ef4444)">${e.error}</span>`:h}
      </div>
      ${e.type==="swarm"?f1(e):h}
      ${e.status==="failed"?r`
        <div class="mc-agent-card-actions">
          <button class="mc-detail-btn" @click=${i=>{i.stopPropagation(),t.onViewDetail(e)}}>View Error</button>
          <button class="mc-retry-btn" @click=${i=>{i.stopPropagation(),t.onRetry(e.id)}}>Retry</button>
        </div>
      `:h}
    </div>
  `}function rc(e,t,n=!1){const s=e.filter(a=>a.status==="active"||a.status==="queued");return s.length===0?r`
      <div class="mc-empty">
        No active agents
        <div class="mc-empty-hint">Your agents will appear here. Drop tasks into the queue or ask your ally to spawn agents.</div>
      </div>
    `:r`
    <div class="mc-agents-grid">
      ${s.map(a=>bp(a,t,n))}
    </div>
  `}function g1(e,t,n,s,a){const i=e.filter(o=>o.isReview===!0);return i.length===0?h:r`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Ready for Review</h3>
      <div class="mc-agents-grid">
        ${i.map(o=>r`
          <div class="mc-agent-card mc-agent-card--review">
            <div class="mc-agent-card-header">
              <div class="mc-agent-card-info">
                <span class="mc-type-badge mc-type-badge--queue">${o.roleName}</span>
                <span class="mc-agent-card-task">${o.task}</span>
              </div>
              ${o.sourceTaskId&&s?r`<button class="mc-open-session-btn" @click=${()=>s(o.sourceTaskId)}>Open Session</button>`:h}
              ${a?r`<button class="mc-detail-btn" @click=${()=>a(o.id)}>Files</button>`:h}
              <button class="mc-approve-btn" @click=${()=>t(o.id)}>Done</button>
              <button class="mc-detail-btn" @click=${()=>n(o)}>View Output</button>
            </div>
          </div>
        `)}
      </div>
    </div>
  `}function m1(e,t){const n=e.filter(s=>s.status==="pending");return n.length===0?h:r`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Queued (${n.length})</h3>
      <div class="mc-agents-grid">
        ${n.map(s=>r`
          <div class="mc-agent-card mc-agent-card--queued">
            <div class="mc-agent-card-header">
              <div class="mc-agent-card-info">
                <span class="mc-type-badge mc-type-badge--queue">${c1[s.type]??s.type}</span>
                <span class="mc-agent-card-task">${s.title}</span>
              </div>
              ${t?r`<button class="mc-open-session-btn" @click=${()=>t(s.id)}>Start</button>`:h}
              <span class="mc-priority-badge mc-priority-badge--${s.priority}">${s.priority}</span>
            </div>
          </div>
        `)}
      </div>
    </div>
  `}function v1(e,t,n){const s=e.filter(a=>a.isReview===!0||a.status==="failed");return s.length===0?r`
      <div class="mc-attention-section">
        <div class="mc-attention-empty">
          Nothing needs you right now.
        </div>
      </div>
    `:r`
    <div class="mc-attention-section">
      <h3 class="mc-section-title">Needs Your Attention</h3>
      <div class="mc-agents-grid">
        ${s.map(a=>r`
          <div class="mc-attention-card mc-agent-card--${a.isReview?"review":"failed"}">
            <div class="mc-agent-card-header">
              <div class="mc-agent-card-info">
                <span class="mc-agent-card-task">${a.task}</span>
              </div>
              ${a.isReview?r`
                <button class="mc-approve-btn" @click=${()=>n(a.id)}>Done</button>
                <button class="mc-detail-btn" @click=${()=>t.onViewDetail(a)}>View</button>
              `:r`
                <button class="mc-detail-btn" @click=${()=>t.onViewDetail(a)}>View Error</button>
                <button class="mc-retry-btn" @click=${()=>t.onRetry(a.id)}>Retry</button>
              `}
            </div>
          </div>
        `)}
      </div>
    </div>
  `}function y1(e){const t=e.filter(n=>n.status==="pending");return t.length===0?h:r`<div class="mc-queue-depth-text">${t.length} more queued</div>`}function b1(e,t="Ally"){return e?r`
    <div class="mc-idle-cta">
      <p>${t} is idle.</p>
      <button class="mc-open-session-btn" @click=${e}>Ask ${t} what to work on</button>
    </div>
  `:h}function w1(e,t){const n=(e.type==="failed"||e.type==="completed")&&e.agentRef;return r`
    <div class="mc-feed-item ${n?"mc-feed-item--clickable":""}"
         @click=${n?()=>t?.(e.agentRef):h}>
      <span class="mc-feed-time">${d1(e.timestamp)}</span>
      <span class="mc-feed-icon">${u1(e.type)}</span>
      <span class="mc-feed-text">${e.summary}</span>
      ${e.prUrl&&!n?r`<a class="mc-feed-link" href="${e.prUrl}" target="_blank">View PR</a>`:h}
    </div>
  `}let oi=!0;function lc(e,t,n,s=!1){if(e.length===0)return h;if(s&&oi)return r`
      <div class="mc-feed">
        <div class="mc-collapsible-header" @click=${()=>{oi=!1}}>
          <span class="mc-collapsible-chevron">\u25B6</span>
          <h3 class="mc-section-title" style="margin:0">Activity (${e.length})</h3>
        </div>
      </div>
    `;const a=e.slice(0,20),i=e.length>20;return r`
    <div class="mc-feed">
      ${s?r`
        <div class="mc-collapsible-header" @click=${()=>{oi=!0}}>
          <span class="mc-collapsible-chevron mc-collapsible-chevron--open">\u25B6</span>
          <h3 class="mc-section-title" style="margin:0">Activity (${e.length})</h3>
        </div>
      `:r`
        <h3 class="mc-section-title">Activity Feed</h3>
      `}
      <div class="mc-feed-list">
        ${a.map(o=>w1(o,n))}
      </div>
      ${i?r`<button class="mc-show-more-btn" @click=${()=>{}}>Show all ${e.length} events</button>`:h}
    </div>
  `}function k1(e,t){const s=e.filter(i=>i.status==="done"||i.status==="failed").filter(i=>!i.isReview);if(s.length===0)return h;const a=s.slice(0,10);return r`
    <div style="margin-bottom: 1.5rem">
      <h3 class="mc-section-title">Recent Completed</h3>
      <div class="mc-agents-grid">
        ${a.map(i=>bp(i,t))}
      </div>
    </div>
  `}function $1(e){if(!e.connected)return r`<div class="mc-section"><div class="mc-empty">Not connected to gateway.</div></div>`;if(e.loading&&!e.data)return r`<div class="mc-section"><div class="mc-loading">Loading agent data...</div></div>`;if(e.error&&!e.data)return r`
      <div class="mc-section">
        <div class="mc-empty" style="color: var(--danger, #ef4444)">
          ${e.error}
          <div class="mc-empty-hint">
            <button class="mc-show-more-btn" @click=${e.onRefresh}>Retry</button>
          </div>
        </div>
      </div>
    `;const t=e.data;if(!t)return r`<div class="mc-section"><div class="mc-empty">No data available.</div></div>`;const n={onCancel:e.onCancelTask,onViewDetail:e.onViewDetail,onRetry:e.onRetryItem,onOpenSession:e.onOpenSession,onOpenTaskSession:e.onOpenTaskSession};return r`
    <div class="mc-section">
      <div class="mc-header-row">
        <button class="mc-full-control-toggle" @click=${e.onToggleFullControl}>
          ${e.fullControl?"Simplified":"Full Control"}
        </button>
      </div>

      ${e.fullControl?h1(t.stats):p1(t.stats)}

      ${e.fullControl?r`
        <div class="mc-two-col">
          <div class="mc-col-main">
            <h3 class="mc-section-title">Active Agents</h3>
            ${rc(t.agents,n)}

            ${g1(t.agents,e.onApproveItem,e.onViewDetail,e.onOpenTaskSession,e.onViewTaskFiles)}

            ${m1(t.queueItems,e.onStartQueueItem)}

            ${lc(t.activityFeed,!1,e.onViewDetail)}
          </div>

          <div class="mc-col-side">
            ${k1(t.agents,n)}
          </div>
        </div>
      `:r`
        <div>
          ${v1(t.agents,n,e.onApproveItem)}

          ${t.stats.activeNow>0||t.agents.some(s=>s.status==="active"||s.status==="queued")?r`
            <h3 class="mc-section-title">Active</h3>
            ${rc(t.agents,n,!0)}
          `:h}

          ${y1(t.queueItems)}

          ${t.stats.activeNow===0&&t.stats.queueDepth===0?b1(e.onAskAlly,e.allyName):h}

          ${lc(t.activityFeed,!1,e.onViewDetail,!0)}
        </div>
      `}
    </div>
  `}function S1(e,t){if(e?.label)return e.label;if(e?.displayName)return e.displayName;const n=be.get(t);if(n)return n;if(t.includes("webchat")){const a=t.match(/webchat[:-](\d+)/);return a?`Chat ${a[1]}`:"Chat"}if(t.includes("main"))return"MAIN";const s=t.split(/[:-]/);return s[s.length-1]||t}function A1(e){return e?e>=1e3?`${(e/1e3).toFixed(1)}k`:String(e):"0"}function x1(e){const t=e,n=String(t.role??"");if(n!=="user"&&n!=="assistant")return h;const s=typeof t.content=="string"?t.content:Array.isArray(t.content)?t.content.filter(i=>i.type==="text").map(i=>String(i.text??"")).join(" "):"";if(!s.trim())return h;const a=s.slice(0,300);return r`
    <div class="parallel-col__msg parallel-col__msg--${n}">
      <span class="parallel-col__msg-role">${n==="user"?"You":"AI"}</span>
      <span class="parallel-col__msg-text">${a}${s.length>300?"...":""}</span>
    </div>
  `}function T1(e){return r`
    <div
      class="parallel-col parallel-col--empty"
      @dragover=${t=>{t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move"),t.currentTarget.classList.add("parallel-col--dragover")}}
      @dragleave=${t=>{t.currentTarget.classList.remove("parallel-col--dragover")}}
      @drop=${t=>{t.preventDefault(),t.currentTarget.classList.remove("parallel-col--dragover");const n=t.dataTransfer?.getData("text/lane-index");if(n!=null&&n!==""){const a=Number.parseInt(n,10);if(!Number.isNaN(a)){t.currentTarget.dispatchEvent(new CustomEvent("lane-reorder",{detail:{fromIndex:a,toIndex:e},bubbles:!0,composed:!0}));return}}const s=t.dataTransfer?.getData("text/session-key");s&&t.currentTarget.dispatchEvent(new CustomEvent("lane-drop",{detail:{laneIndex:e,sessionKey:s},bubbles:!0,composed:!0}))}}
      data-lane-index="${e}"
    >
      <div class="parallel-col__drop-zone">
        <div class="parallel-col__drop-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.4">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M12 8v8M8 12h8"></path>
          </svg>
        </div>
        <span class="parallel-col__drop-text">Drag a session here</span>
      </div>
    </div>
  `}function _1(e,t,n){const{state:s,onAssignLane:a,onSendInLane:i}=n,o=s.sessionsResult?.sessions??[],l=Te(o,t),c=l?.key??t,u=s.workingSessions.has(t)||s.workingSessions.has(c),p=S1(l,t),f=zs.get(t)??zs.get(c),v=l?.model??"",m=l?.totalTokens??0,k=s.settings.tabLastViewed[c]??s.settings.tabLastViewed[t]??0,d=l?.updatedAt??0,g=!u&&d>k,A=t===s.sessionKey?s.chatMessages:We.get(t)??We.get(c)??[],T=x=>{x instanceof HTMLElement&&x.dispatchEvent(new CustomEvent("lane-viewed",{detail:{sessionKey:c},bubbles:!0,composed:!0}))};return r`
    <div
      class="parallel-col parallel-col--filled ${u?"parallel-col--working":""} ${g?"parallel-col--ready":""}"
      @pointerdown=${x=>T(x.currentTarget)}
      @focusin=${x=>T(x.currentTarget)}
      @dragover=${x=>{x.preventDefault(),x.dataTransfer&&(x.dataTransfer.dropEffect="move"),x.currentTarget.classList.add("parallel-col--dragover")}}
      @dragleave=${x=>{x.currentTarget.classList.remove("parallel-col--dragover")}}
      @drop=${x=>{x.preventDefault(),x.currentTarget.classList.remove("parallel-col--dragover");const _=x.dataTransfer?.getData("text/lane-index");if(_!=null&&_!==""){const R=Number.parseInt(_,10);if(!Number.isNaN(R)){x.currentTarget.dispatchEvent(new CustomEvent("lane-reorder",{detail:{fromIndex:R,toIndex:e},bubbles:!0,composed:!0}));return}}const L=x.dataTransfer?.getData("text/session-key");L&&x.currentTarget.dispatchEvent(new CustomEvent("lane-drop",{detail:{laneIndex:e,sessionKey:L},bubbles:!0,composed:!0}))}}
      data-lane-index="${e}"
    >
      <!-- Header -->
      <div
        class="parallel-col__header"
        draggable="true"
        @dragstart=${x=>{x.dataTransfer&&(x.dataTransfer.effectAllowed="move",x.dataTransfer.setData("text/lane-index",String(e)),x.currentTarget.classList.add("parallel-col__header--dragging"))}}
        @dragend=${x=>{x.currentTarget.classList.remove("parallel-col__header--dragging")}}
      >
        <div class="parallel-col__title-row">
          <span class="parallel-col__drag-handle" title="Drag to reorder lanes" aria-hidden="true"
            >⋮⋮</span
          >
          <span class="parallel-col__name">${p}</span>
          <div class="parallel-col__header-actions">
            <span
              class="parallel-col__status-dot ${u?"parallel-col__status-dot--working":g?"parallel-col__status-dot--ready":"parallel-col__status-dot--idle"}"
              title=${u?"Working":g?"Ready":"Idle"}
            ></span>
            <span
              class="parallel-col__status ${u?"parallel-col__status--working":g?"parallel-col__status--ready":""}"
              >${u?"WORKING":g?"READY":"IDLE"}</span
            >
            <button
              class="parallel-col__close"
              draggable="false"
              @click=${()=>a(e,null)}
              title="Remove from lane"
            >&times;</button>
          </div>
        </div>
        <div class="parallel-col__meta">
          ${v?r`<span class="parallel-col__model">${v}</span>`:h}
          <span class="parallel-col__turns">${f!=null?`${f} turns`:"--"}</span>
          <span class="parallel-col__tokens">${A1(m)} tokens</span>
        </div>
      </div>

      <!-- Messages -->
      <div class="parallel-col__messages">
        ${A.length>0?A.slice(-120).map(x1):r`<div class="parallel-col__empty">No messages yet</div>`}
      </div>

      <!-- Compose -->
      <div class="parallel-col__compose">
        <input
          type="text"
          class="parallel-col__input"
          draggable="false"
          placeholder="Message..."
          @keydown=${x=>{if(x.key==="Enter"&&!x.shiftKey){x.preventDefault();const _=x.target,L=_.value.trim();L&&(i(t,L),_.value="")}}}
        />
      </div>
    </div>
  `}function C1(e){const t=e.state.settings.parallelLanes;return r`
    <div
      class="parallel-columns"
      @lane-drop=${n=>{e.onAssignLane(n.detail.laneIndex,n.detail.sessionKey)}}
      @lane-reorder=${n=>{e.onReorderLanes(n.detail.fromIndex,n.detail.toIndex)}}
      @lane-viewed=${n=>{e.onLaneViewed(n.detail.sessionKey)}}
    >
      ${t.map((n,s)=>n?_1(s,n,e):T1(s))}
    </div>
  `}const E1=20;function wp(e){switch(e.split(".").pop()?.toLowerCase()){case"md":return"📝";case"html":return"🌐";case"json":case"yaml":case"yml":case"toml":return"⚙️";case"ts":case"js":case"py":case"sh":case"rs":case"go":return"💻";case"css":return"🎨";default:return"📄"}}function kp(e,t=E1){const n=[];function s(a){for(const i of a){if(n.length>=t)return;const o=i;o.type==="file"?n.push(o):o.type==="directory"&&o.children&&s(o.children)}}return s(e),n}const R1=8;function L1(e){return kp(e,500).filter(n=>n.modifiedAt!=null).sort((n,s)=>(s.modifiedAt??0)-(n.modifiedAt??0)).slice(0,R1)}function $p(e){const n=Date.now()-e,s=Math.floor(n/6e4);if(s<1)return"just now";if(s<60)return`${s}m ago`;const a=Math.floor(s/60);if(a<24)return`${a}h ago`;const i=Math.floor(a/24);return i<30?`${i}d ago`:`${Math.floor(i/30)}mo ago`}function P1(e,t){if(!e||e.length===0)return h;const n=L1(e);return n.length===0?h:r`
    <div class="work-section">
      <div class="work-section-label">Recent</div>
      <div class="work-file-list">
        ${n.map(s=>r`
          <button
            class="work-file-item"
            @click=${a=>{a.stopPropagation(),s.path&&t&&t(s.path)}}
          >
            <span class="work-file-icon">${wp(s.name)}</span>
            <span class="work-file-name">${s.name}</span>
            <span class="work-file-meta">${s.modifiedAt?$p(s.modifiedAt):""}</span>
          </button>
        `)}
      </div>
    </div>
  `}function I1(e,t){if(!e||e.length===0)return h;const n=kp(e);return n.length===0?h:r`
    <div class="work-file-list">
      ${n.map(s=>r`
        <button
          class="work-file-item"
          @click=${a=>{a.stopPropagation(),s.path&&t&&t(s.path)}}
        >
          <span class="work-file-icon">${wp(s.name)}</span>
          <span class="work-file-name">${s.name}</span>
          ${s.size!=null?r`<span class="work-file-meta">${(s.size/1024).toFixed(1)}KB</span>`:h}
        </button>
      `)}
      ${e.length>n.length?r`<div class="work-file-overflow">+${e.length-n.length} more files</div>`:h}
    </div>
  `}function D1(e,t,n,s,a,i,o,l){return r`
    <div class="my-day-card work-project ${t?"expanded":""}">
      <button class="my-day-card-header" @click=${a} style="cursor: pointer; width: 100%; border: none; background: none; text-align: left;">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">${e.emoji}</span>
          <span>${e.name}</span>
          ${e.folder?r`<span class="work-folder-badge">${e.folder}</span>`:h}
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
                    `:h}
              ${n.length>0?P1(n,o):h}
              ${n.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Files</div>
                      ${I1(n,o)}
                    </div>
                  `:e.outputs.length>0?r`
                      <div class="work-section">
                        <div class="work-section-label">Files & Outputs</div>
                        ${M1(e.outputs)}
                      </div>
                    `:h}
              ${e.people.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Team</div>
                      <div class="work-people">
                        ${e.people.map(c=>r`
                            <button
                              class="work-person-chip"
                              @click=${u=>{u.stopPropagation(),i?.(c)}}
                            >
                              ${c}
                            </button>
                          `)}
                      </div>
                    </div>
                  `:h}
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
                  `:h}
              ${e.automations&&e.automations.length>0?r`
                    <div class="work-section">
                      <div class="work-section-label">Automations</div>
                      <div class="work-skills">
                        ${e.automations.map(c=>r`<span class="work-skill-chip">${c}</span>`)}
                      </div>
                    </div>
                  `:h}
            </div>
          `:h}
    </div>
  `}function M1(e){const t=e.reduce((s,a)=>{const i=a.type||"other";return s[i]||(s[i]=[]),s[i].push(a),s},{}),n={document:"📄",template:"📋",report:"📊",presentation:"📽️",spreadsheet:"📈",code:"💻",image:"🖼️",video:"🎬",audio:"🎵",archive:"📦",pdf:"📕",markdown:"📝"};return r`
    <div class="work-file-tree">
      ${Object.entries(t).map(([s,a])=>r`
        <div class="work-folder">
          <span class="work-folder-icon">📁</span>
          <span class="work-folder-name">${s}</span>
          <span class="work-file-meta">${a.length} ${a.length===1?"item":"items"}</span>
        </div>
        ${a.map(i=>r`
          <div class="work-file type-${s}">
            <span class="work-file-icon">${n[s.toLowerCase()]||"📄"}</span>
            ${i.url?r`<a href="${i.url}" target="_blank" rel="noopener noreferrer" class="work-file-name">${i.title}</a>`:r`<span class="work-file-name">${i.title}</span>`}
          </div>
        `)}
      `)}
    </div>
  `}const O1={html_report:"📊",plan:"📋",analysis:"🔍",code:"💻",doc:"📝",data:"📦",image:"🖼️",script:"⚙️"},N1=[{key:"all",label:"All"},{key:"pinned",label:"Pinned"},{key:"html_report",label:"Reports"},{key:"plan",label:"Plans"},{key:"code",label:"Code"},{key:"recent",label:"Recent"}];function F1(e,t){switch(t){case"pinned":return e.filter(n=>n.pinned);case"html_report":case"plan":case"code":return e.filter(n=>n.type===t);case"recent":{const n=Date.now()-6048e5;return e.filter(s=>new Date(s.createdAt).getTime()>n)}default:return e}}function B1(e,t,n,s){const a=O1[e.type]||"📄",i=new Date(e.createdAt),o=$p(i.getTime());return r`
    <div class="resource-card">
      <button
        class="resource-card-main"
        @click=${()=>t?.(e)}
        title=${e.summary||e.title}
      >
        <span class="resource-card-icon">${a}</span>
        <div class="resource-card-info">
          <span class="resource-card-title">${e.title}</span>
          <span class="resource-card-meta">
            <span class="resource-type-badge">${e.type.replace("_"," ")}</span>
            <span>${o}</span>
          </span>
        </div>
      </button>
      <div class="resource-card-actions">
        <button
          class="resource-action-btn${e.pinned?" pinned":""}"
          title=${e.pinned?"Unpin":"Pin"}
          @click=${l=>{l.stopPropagation(),n?.(e.id,!e.pinned)}}
        >${e.pinned?"★":"☆"}</button>
        <button
          class="resource-action-btn delete"
          title="Delete"
          @click=${l=>{l.stopPropagation(),s?.(e.id)}}
        >×</button>
      </div>
    </div>
  `}function U1(e){const{resources:t=[],resourcesLoading:n,resourceFilter:s="all",onResourceFilterChange:a,onResourceClick:i,onResourcePin:o,onResourceDelete:l}=e,c=F1(t,s);return c.sort((u,p)=>u.pinned!==p.pinned?u.pinned?-1:1:p.createdAt.localeCompare(u.createdAt)),r`
    <div class="work-workspaces-section">
      <h2 class="work-section-title">Resources</h2>

      <div class="resource-filter-strip">
        ${N1.map(u=>r`
            <button
              class="resource-filter-btn${s===u.key?" active":""}"
              @click=${()=>a?.(u.key)}
            >${u.label}</button>
          `)}
      </div>

      ${n?r`<div class="work-detail-loading">
            <div class="spinner" style="width: 16px; height: 16px"></div>
            Loading resources...
          </div>`:c.length===0?r`<div class="my-day-card">
              <div class="my-day-card-content">
                <div class="my-day-empty">
                  No resources yet. Resources are created automatically when the ally generates reports, plans, or docs.
                </div>
              </div>
            </div>`:r`<div class="resource-grid">
              ${c.map(u=>B1(u,i,o,l))}
            </div>`}
    </div>
  `}function z1(e){const{projects:t,loading:n,error:s,expandedProjects:a=new Set,projectFiles:i={},detailLoading:o=new Set,onRefresh:l,onToggleProject:c,onPersonClick:u,onFileClick:p,onSkillClick:f}=e;if(n)return r`
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
          ${l?r`<button class="retry-button" @click=${l}>Retry</button>`:h}
        </div>
      </div>
    `;const v=t.filter(k=>k.status==="active"),m=t.filter(k=>k.status==="archived");return r`
    <div class="my-day-container">
      <div class="my-day-toolbar">
        <div class="my-day-summary-stat">
          <span class="summary-value">${v.length}</span>
          <span class="summary-label">Projects</span>
        </div>
        ${l?r`<button class="my-day-refresh-btn" @click=${l} title="Refresh">↻</button>`:h}
      </div>

      <!-- Resources Section -->
      ${U1(e)}

      <!-- Workspaces Section -->
      <div class="work-workspaces-section">
        <h2 class="work-section-title">Workspaces</h2>
        <div class="my-day-grid" style="grid-template-columns: 1fr;">
          ${v.length===0&&m.length===0?r`
                  <div class="my-day-card">
                    <div class="my-day-card-content">
                      <div class="my-day-empty">
                        No workspaces yet. Ask in chat: "Create a workspace for [project name]"
                      </div>
                    </div>
                  </div>
                `:h}
          ${v.map(k=>D1(k,a.has(k.id),i[k.id]??[],o.has(k.id),()=>c?.(k.id),u,p,f))}
          ${m.length>0?r`
                <div style="margin-top: 16px; color: var(--mc-text-muted); font-size: 12px;">
                  ${m.length} archived project${m.length!==1?"s":""}
                </div>
              `:h}
        </div>
      </div>
    </div>
  `}function tt(e){if(!e)return"";try{return K(new Date(e).getTime())}catch{return""}}function pn(e){return r`<div class="second-brain-md-body">${Ce(Se(e))}</div>`}function K1(e){const{identity:t}=e;return!t||t.files.length===0?r`
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
      ${t.identityOs?r`
        <div
          class="second-brain-hero"
          @click=${()=>{const n=t.identityOs?.dashboardPath;n&&e.onOpenInBrowser(n)}}
        >
          <div class="second-brain-hero-content">
            <div class="second-brain-hero-badge">IDENTITY OS</div>
            <div class="second-brain-hero-title">Your Identity Profile</div>
            <div class="second-brain-hero-desc">
              Your complete identity extraction — voice, values, story, thinking patterns, and life arc.
              ${t.identityOs.artifacts.length} artifacts compiled.
            </div>
          </div>
          <div class="second-brain-hero-arrow">\u{2192}</div>
        </div>
      `:h}

      ${t.files.map(n=>r`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.label}</span>
            ${n.updatedAt?r`<span class="second-brain-card-updated">${tt(n.updatedAt)}</span>`:h}
          </div>
          <div class="second-brain-card-content">${pn(n.content)}</div>
        </div>
      `)}

      ${t.identityOs&&t.identityOs.artifacts.length>0?r`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">Identity OS Artifacts</span>
            <span class="second-brain-section-count">${t.identityOs.artifacts.length}</span>
          </div>
          <div class="second-brain-entry-list">
            ${t.identityOs.artifacts.map(n=>Ls(n,e))}
          </div>
        </div>
      `:h}
    </div>
  `}function W1(e){const{memoryBank:t,selectedEntry:n,searchQuery:s,browsingFolder:a,folderEntries:i,folderName:o}=e;if(n)return r`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.name}</span>
            ${n.updatedAt?r`<span class="second-brain-card-updated">${tt(n.updatedAt)}</span>`:h}
          </div>
          ${n.relativePath?r`<div class="second-brain-card-path">${n.relativePath}</div>`:h}
          <div class="second-brain-card-content">${pn(n.content)}</div>
        </div>
      </div>
    `;if(a&&i)return r`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${o??"Folder"}</span>
            <span class="second-brain-section-count">${i.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${i.length>0?i.map(u=>Ls(u,e)):r`<div class="second-brain-empty-inline">Empty folder</div>`}
          </div>
        </div>
      </div>
    `;if(!t)return ma("No memory bank files found","Start building your memory bank by telling your ally about the people, companies, and projects in your life.");const l=(s??"").toLowerCase().trim(),c=u=>l?u.filter(p=>p.name.toLowerCase().includes(l)||p.excerpt.toLowerCase().includes(l)):u;return r`
    <div class="second-brain-panel">
      <div class="second-brain-search">
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Search people, companies, projects..."
          .value=${s??""}
          @input=${u=>e.onSearch(u.target.value)}
        />
        <span class="second-brain-search-count">${t.totalEntries} entries</span>
      </div>

      ${t.sections.map(u=>{const p=c(u.entries);return u.entries.length===0?h:r`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">${u.icon} ${u.label}</span>
              <span class="second-brain-section-count">${u.entries.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${p.length>0?p.map(f=>Ls(f,e)):l?r`<div class="second-brain-empty-inline">No matches</div>`:h}
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
            ${t.extraFiles.map(u=>Ls(u,e))}
          </div>
        </div>
      `:h}

      ${t.curated?r`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{2B50} Curated Facts</span>
            <span class="second-brain-section-count">${tt(t.curated.updatedAt)}</span>
          </div>
          <div class="second-brain-card">
            <div class="second-brain-card-content">${pn(t.curated.content)}</div>
          </div>
        </div>
      `:h}
    </div>
  `}function Ls(e,t){const n=e.isDirectory;return r`
    <div class="second-brain-entry" @click=${()=>{n?t.onBrowseFolder(e.path):t.onSelectEntry(e.path)}}>
      <div class="second-brain-entry-icon ${n?"second-brain-entry-icon--folder":""}">${n?"📁":"📄"}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${e.name}${n?"/":""}</div>
        ${e.excerpt?r`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:h}
      </div>
      ${e.updatedAt?r`<div class="second-brain-entry-meta">${tt(e.updatedAt)}</div>`:h}
    </div>
  `}function q1(e){const{aiPacket:t,syncing:n}=e,s=t?.snapshot??t?.consciousness??null,a=t?.snapshot?"Awareness Snapshot":"CONSCIOUSNESS.md";return r`
    <div class="second-brain-panel">
      <div class="second-brain-sync-bar">
        <div class="second-brain-sync-info">
          <span class="second-brain-sync-label">Live Context Injection</span>
          <span class="second-brain-sync-time">
            ${s?.updatedAt?`Last synced ${tt(s.updatedAt)}`:"Not yet synced"}
            ${s?` • ${s.lineCount} lines`:""}
          </span>
        </div>
        <button
          class="second-brain-sync-btn ${n?"syncing":""}"
          ?disabled=${n}
          @click=${()=>e.onSync()}
        >
          ${n?"Syncing...":"⚡ Sync Now"}
        </button>
      </div>

      <div class="second-brain-ai-packet-explainer" style="padding: 12px 16px; margin-bottom: 12px; font-size: 13px; color: var(--text-secondary); background: var(--bg-secondary); border-radius: 8px;">
        This is what your ally knows right now. It refreshes every 15 minutes automatically.
      </div>

      ${s?r`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${a}</span>
            <span class="second-brain-card-updated">${s.lineCount} lines</span>
          </div>
          <div class="second-brain-card-content">${pn(s.content)}</div>
        </div>
      `:r`
        <div class="second-brain-empty-block">
          <div class="second-brain-empty-icon">\u{1F9E0}</div>
          <div class="second-brain-empty-title">No awareness snapshot yet</div>
          <div class="second-brain-empty-hint">Hit "Sync Now" to generate your first awareness snapshot. It includes your schedule, tasks, goals, and agent activity.</div>
        </div>
      `}

      ${t?.working?r`
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">WORKING.md</span>
            <span class="second-brain-card-updated">${t.working.lineCount} lines</span>
          </div>
          <div class="second-brain-card-content">${pn(t.working.content)}</div>
        </div>
      `:h}
    </div>
  `}const cc={connected:{dot:"●",label:"Connected",cls:"second-brain-source--connected"},available:{dot:"○",label:"Available",cls:"second-brain-source--available"}};function j1(e){const{sourcesData:t}=e;if(!t||t.sources.length===0)return ma("No sources detected","Connect data sources to build your context universe.");const n=t.sources.filter(a=>a.status==="connected"),s=t.sources.filter(a=>a.status==="available");return r`
    <div class="second-brain-panel">
      <div class="second-brain-sources-summary">
        <span class="second-brain-sources-count">${t.connectedCount}</span>
        <span class="second-brain-sources-label">sources connected</span>
        <button class="second-brain-add-source-btn" @click=${()=>e.onAddSource()}>+ Add a Source</button>
      </div>

      ${n.length>0?r`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F7E2} Connected</span>
            <span class="second-brain-section-count">${n.length}</span>
          </div>
          <div class="second-brain-sources-grid">
            ${n.map(a=>dc(a))}
          </div>
        </div>
      `:h}

      ${s.length>0?r`
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">\u{1F7E1} Available</span>
            <span class="second-brain-section-count">${s.length}</span>
          </div>
          <div class="second-brain-sources-grid">
            ${s.map(a=>dc(a))}
          </div>
        </div>
      `:h}
    </div>
  `}function dc(e){const t=cc[e.status]??cc.available;return r`
    <div class="second-brain-source-card ${t.cls}">
      <div class="second-brain-source-icon">${e.icon}</div>
      <div class="second-brain-source-body">
        <div class="second-brain-source-name">${e.name}</div>
        <div class="second-brain-source-desc">${e.description}</div>
        ${e.stats?r`<div class="second-brain-source-stats">${e.stats}</div>`:h}
      </div>
      <div class="second-brain-source-status">
        <span class="second-brain-source-dot" style="color: ${e.status==="connected"?"var(--success, #10b981)":e.status==="available"?"var(--warning, #f59e0b)":"var(--muted)"}">${t.dot}</span>
        <span class="second-brain-source-status-label">${t.label}</span>
        ${e.status==="connected"&&e.lastSync?r`<span class="second-brain-source-sync">${tt(e.lastSync)}</span>`:h}
      </div>
    </div>
  `}function uc(e,t){const n=e.isDirectory,s=n?"📁":"📑",a=()=>{n?t.onBrowseFolder(e.path):t.onSelectEntry(e.path)},i=e.frontmatter?.title||e.name;return r`
    <div class="second-brain-entry" @click=${a}>
      <div class="second-brain-entry-icon ${n?"second-brain-entry-icon--folder":""}">${s}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">${i}${n?"/":""}</div>
        ${e.frontmatter?.url?r`<div class="second-brain-research-url">${e.frontmatter.url}</div>`:h}
        ${e.excerpt&&!n?r`<div class="second-brain-entry-excerpt">${e.excerpt}</div>`:h}
        ${e.frontmatter?.tags?.length?r`
          <div class="second-brain-research-tags">
            ${e.frontmatter.tags.map(o=>r`<span class="second-brain-research-tag">${o}</span>`)}
          </div>
        `:h}
      </div>
      ${e.updatedAt?r`<div class="second-brain-entry-meta">${tt(e.updatedAt)}</div>`:h}
    </div>
  `}function V1(e){const{researchData:t,selectedEntry:n,searchQuery:s,browsingFolder:a,folderEntries:i,folderName:o}=e;if(n)return r`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-card">
          <div class="second-brain-card-header">
            <span class="second-brain-card-label">${n.name}</span>
            ${n.updatedAt?r`<span class="second-brain-card-updated">${tt(n.updatedAt)}</span>`:h}
          </div>
          ${n.relativePath?r`<div class="second-brain-card-path">${n.relativePath}</div>`:h}
          <div class="second-brain-card-content">${pn(n.content)}</div>
        </div>
      </div>
    `;if(a&&i)return r`
      <div class="second-brain-panel">
        <button class="second-brain-back-btn" @click=${()=>e.onBack()}>
          \u{2190} Back
        </button>
        <div class="second-brain-section">
          <div class="second-brain-section-header">
            <span class="second-brain-section-title">${o??"Category"}</span>
            <span class="second-brain-section-count">${i.length} items</span>
          </div>
          <div class="second-brain-entry-list">
            ${i.length>0?i.map(u=>uc(u,e)):r`<div class="second-brain-empty-inline">No research in this category</div>`}
          </div>
        </div>
      </div>
    `;if(!t||t.totalEntries===0)return r`
      <div class="second-brain-panel">
        <div class="second-brain-research-toolbar">
          <div style="flex:1"></div>
          <button class="second-brain-sync-btn" @click=${()=>e.onSaveViaChat()}>
            + Save via Chat
          </button>
        </div>
        ${ma("No research collected yet","Click 'Save via Chat' to paste links, bookmarks, or notes — your AI will organize them for you.")}
      </div>
    `;const l=(s??"").toLowerCase().trim(),c=u=>l?u.filter(p=>p.name.toLowerCase().includes(l)||p.excerpt.toLowerCase().includes(l)||(p.frontmatter?.tags??[]).some(f=>f.toLowerCase().includes(l))||(p.frontmatter?.url??"").toLowerCase().includes(l)):u;return r`
    <div class="second-brain-panel">
      <div class="second-brain-research-toolbar">
        <div class="second-brain-search" style="flex:1">
          <input
            class="second-brain-search-input"
            type="text"
            placeholder="Search research by title, tag, URL..."
            .value=${s??""}
            @input=${u=>e.onSearch(u.target.value)}
          />
          <span class="second-brain-search-count">${t.totalEntries} entries</span>
        </div>
        <button class="second-brain-sync-btn" @click=${()=>e.onResearchAddFormToggle()}>
          + Quick Add
        </button>
        <button class="second-brain-sync-btn" @click=${()=>e.onSaveViaChat()}>
          + Save via Chat
        </button>
      </div>

      ${t.categories.map(u=>{const p=c(u.entries);return u.entries.length===0?h:r`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4C1} ${u.label}</span>
              <span class="second-brain-section-count">${u.entries.length}</span>
            </div>
            <div class="second-brain-entry-list">
              ${p.length>0?p.map(f=>uc(f,e)):l?r`<div class="second-brain-empty-inline">No matches</div>`:h}
            </div>
          </div>
        `})}
    </div>
  `}function H1(e){return e<1024?`${e}B`:e<1024*1024?`${(e/1024).toFixed(1)}K`:`${(e/(1024*1024)).toFixed(1)}M`}function G1(e){return r`
    <div class="sb-files-container">
      <div class="sb-files-search-bar">
        <input
          type="text"
          class="sb-files-search-input"
          placeholder="Search across your Second Brain..."
          .value=${e.fileSearchQuery??""}
          @input=${t=>{const n=t.target;e.onFileSearch?.(n.value)}}
        />
      </div>

      ${e.fileSearchResults?Q1(e):e.fileTreeLoading?r`<div class="sb-files-loading">Loading file tree...</div>`:e.fileTree?Sp(e.fileTree,e):r`<div class="sb-files-empty">No files found</div>`}
    </div>
  `}function Q1(e){const t=e.fileSearchResults??[];return t.length===0?r`<div class="sb-files-empty">No results found</div>`:r`
    <div class="sb-files-results">
      ${t.map(n=>r`
          <button
            class="sb-files-result-item"
            @click=${()=>e.onFileSelect?.(n.path)}
          >
            <span class="sb-file-icon">${n.type==="folder"?"📁":"📄"}</span>
            <div class="sb-file-info">
              <span class="sb-file-name">${n.name}</span>
              <span class="sb-file-path">${n.path}</span>
              ${n.matchContext||n.excerpt?r`<span class="sb-file-excerpt">${n.matchContext??n.excerpt}</span>`:h}
            </div>
          </button>
        `)}
    </div>
  `}function Sp(e,t,n=0){return r`
    <div class="sb-file-tree" style="padding-left: ${n*16}px">
      ${e.map(s=>s.type==="folder"?r`
            <details class="sb-tree-folder">
              <summary class="sb-tree-item sb-tree-folder-name">
                <span class="sb-file-icon">\u{1F4C1}</span>
                <span>${s.name}</span>
                ${s.childCount!=null?r`<span class="sb-tree-count">${s.childCount}</span>`:h}
              </summary>
              ${s.children?Sp(s.children,t,n+1):h}
            </details>
          `:r`
          <button
            class="sb-tree-item sb-tree-file"
            @click=${()=>t.onFileSelect?.(s.path)}
          >
            <span class="sb-file-icon">\u{1F4C4}</span>
            <span class="sb-file-name">${s.name}</span>
            ${s.size!=null?r`<span class="sb-tree-size">${H1(s.size)}</span>`:h}
          </button>
        `)}
    </div>
  `}function ma(e,t){return r`
    <div class="second-brain-empty-block">
      <div class="second-brain-empty-icon">\u{1F9E0}</div>
      <div class="second-brain-empty-title">${e}</div>
      <div class="second-brain-empty-hint">${t}</div>
    </div>
  `}function Y1(e){if(!e)return h;if(!e.available)return r`
      <div class="vault-health-bar vault-health-disconnected">
        <span class="vault-health-status">\u26A0\uFE0F Vault not connected</span>
        <span class="vault-health-detail">Using local storage. Set OBSIDIAN_VAULT_PATH to connect your Obsidian vault.</span>
      </div>
    `;const t=e.stats;if(!t)return h;const n=t.lastActivity?tt(t.lastActivity):"never",s=t.inboxCount>0?r`<span class="vault-health-inbox-badge">${t.inboxCount} in inbox</span>`:h;return r`
    <div class="vault-health-bar vault-health-connected">
      <span class="vault-health-status">\u{1F7E2} Vault Connected</span>
      <span class="vault-health-detail">
        ${t.totalNotes} notes \u00B7
        ${t.brainCount} brain \u00B7
        ${t.dailyCount} daily \u00B7
        ${t.projectCount} projects \u00B7
        Last activity: ${n}
      </span>
      ${s}
    </div>
  `}function J1(e){let t=0;const n=[];return e.identity&&e.identity.files.length>0?t+=20:n.push("Create USER.md to help your ally know you"),e.vaultHealth?.available??!1?t+=20:n.push("Connect your Obsidian vault for long-term memory"),e.memoryBank&&e.memoryBank.totalEntries>0?t+=20:n.push("Teach your ally — chat naturally and it remembers"),e.sourcesData&&e.sourcesData.connectedCount>0?t+=20:n.push("Connect a data source (calendar, Oura, etc.)"),e.vaultHealth?.stats&&e.vaultHealth.stats.dailyCount>=7?t+=20:n.push("Keep using the morning brief — it compounds"),{score:t,tips:n}}function X1(e){const{subtab:t,loading:n,vaultHealth:s}=e,a=J1(e);return r`
    <section class="second-brain-container">
      ${Y1(s)}
      ${a.score<100?r`
        <div class="sb-health-score">
          <div class="sb-health-score-bar">
            <div class="sb-health-score-fill" style="width: ${a.score}%"></div>
          </div>
          <div class="sb-health-score-info">
            <span class="sb-health-score-label">Context Health: ${a.score}%</span>
            ${a.tips.length>0?r`<span class="sb-health-score-tip">${a.tips[0]}</span>`:h}
          </div>
        </div>
      `:h}
      <div class="second-brain-tabs">
        <button
          class="second-brain-tab ${t==="identity"?"active":""}"
          @click=${()=>e.onSubtabChange("identity")}
        >
          \u{1F464} Identity
        </button>
        <button
          class="second-brain-tab ${t==="memory-bank"?"active":""}"
          @click=${()=>e.onSubtabChange("memory-bank")}
        >
          \u{1F4DA} Memory Bank
        </button>
        <button
          class="second-brain-tab ${t==="ai-packet"?"active":""}"
          @click=${()=>e.onSubtabChange("ai-packet")}
        >
          \u{26A1} AI Packet
        </button>
        <button
          class="second-brain-tab ${t==="sources"?"active":""}"
          @click=${()=>e.onSubtabChange("sources")}
        >
          \u{1F310} Sources
        </button>
        <button
          class="second-brain-tab ${t==="research"?"active":""}"
          @click=${()=>e.onSubtabChange("research")}
        >
          \u{1F50D} Research
        </button>
        <button
          class="second-brain-tab ${t==="resources"?"active":""}"
          @click=${()=>e.onSubtabChange("resources")}
        >
          \u{1F4E6} Resources
        </button>
        <button
          class="second-brain-tab ${t==="files"?"active":""}"
          @click=${()=>e.onSubtabChange("files")}
        >
          \u{1F5C2}\uFE0F Files
        </button>
        <button
          class="second-brain-tab ${t==="intel"?"active":""}"
          @click=${()=>e.onSubtabChange("intel")}
        >
          \u{1F441}\uFE0F Insights
        </button>
      </div>

      ${t==="intel"?Z1(e):n?r`<div class="second-brain-loading"><div class="second-brain-loading-spinner"></div>Loading...</div>`:t==="identity"?K1(e):t==="memory-bank"?W1(e):t==="ai-packet"?q1(e):t==="sources"?j1(e):t==="resources"?e2(e):t==="files"?G1(e):V1(e)}
    </section>
  `}function Z1(e){const t=e.vaultHealth?.available??!1,n=(e.vaultHealth?.stats?.dailyCount??0)>=3,s=(e.sourcesData?.connectedCount??0)>0;return r`
    <div class="second-brain-panel">
      <div class="second-brain-card">
        <div class="second-brain-card-header">
          <span class="second-brain-card-label">How Insights Work</span>
        </div>
        <div class="second-brain-card-content" style="padding: 16px;">
          <p style="margin: 0 0 12px; font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
            Your ally builds insights over time as you work together. The more daily briefs, agent tasks, and interactions you accumulate, the smarter your ally gets at spotting patterns, blind spots, and opportunities.
          </p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">${t?"✅":"🟡"}</span>
              <span style="font-size: 13px; color: var(--text);">Obsidian Vault ${t?"connected":"not connected — connect for richer insights"}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">${n?"✅":"🟡"}</span>
              <span style="font-size: 13px; color: var(--text);">${n?`${e.vaultHealth?.stats?.dailyCount} daily briefs accumulated`:"Less than 3 daily briefs — keep using the morning brief"}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">${s?"✅":"🟡"}</span>
              <span style="font-size: 13px; color: var(--text);">${s?"Data sources connected":"No data sources yet — connect integrations for cross-domain insights"}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 0 16px;">
        <p style="font-size: 12px; color: var(--text-muted); margin: 8px 0;">
          Proactive insights surface in your daily brief and awareness snapshot. Check your Dashboards tab for deeper analysis views.
        </p>
      </div>
    </div>
  `}function e2(e){const{communityResources:t,communityResourceAddFormOpen:n}=e;return r`
    <div class="second-brain-panel">
      <div class="second-brain-research-toolbar">
        <div style="flex:1">
          <div class="second-brain-sync-info">
            <span class="second-brain-sync-label">Community Resources</span>
            <span class="second-brain-sync-time">
              Curated repos and tools your AI agents can reference
            </span>
          </div>
        </div>
        <button
          class="second-brain-sync-btn"
          @click=${()=>e.onCommunityResourceAddFormToggle()}
        >
          ${n?"Cancel":"+ Add Resource"}
        </button>
      </div>

      ${n?n2(e):h}

      ${!t||t.resources.length===0?ma("No community resources yet","Add GitHub repos, awesome-lists, and tools for your AI agents to discover and reference."):r`
          <div class="second-brain-section">
            <div class="second-brain-section-header">
              <span class="second-brain-section-title">\u{1F4E6} Bookmarked Resources</span>
              <span class="second-brain-section-count">${t.count}</span>
            </div>
            <div class="second-brain-entry-list">
              ${t.resources.map(s=>t2(s,e))}
            </div>
          </div>
        `}
    </div>
  `}function t2(e,t){return r`
    <div class="second-brain-entry">
      <div class="second-brain-entry-icon">\u{1F517}</div>
      <div class="second-brain-entry-body">
        <div class="second-brain-entry-name">
          <a href=${e.url} target="_blank" rel="noopener" style="color: inherit; text-decoration: none;">
            ${e.label}
          </a>
        </div>
        ${e.description?r`<div class="second-brain-entry-excerpt">${e.description}</div>`:h}
        ${e.tags.length>0?r`<div class="second-brain-research-tags">
              ${e.tags.map(n=>r`<span class="second-brain-research-tag">${n}</span>`)}
            </div>`:h}
      </div>
      <button
        class="second-brain-back-btn"
        style="font-size: 11px; padding: 2px 8px; color: var(--danger, #ef4444);"
        @click=${n=>{n.stopPropagation(),t.onCommunityResourceRemove(e.id)}}
      >Remove</button>
    </div>
  `}function n2(e){const t=e.communityResourceAddForm??{url:"",label:"",description:"",tags:""};return r`
    <div class="second-brain-research-form">
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">URL *</label>
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="https://github.com/owner/repo"
          .value=${t.url}
          @input=${n=>e.onCommunityResourceAddFormChange("url",n.target.value)}
        />
      </div>
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">Label</label>
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Display name (auto-derived from URL if blank)"
          .value=${t.label}
          @input=${n=>e.onCommunityResourceAddFormChange("label",n.target.value)}
        />
      </div>
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">Description</label>
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="What is this resource about?"
          .value=${t.description}
          @input=${n=>e.onCommunityResourceAddFormChange("description",n.target.value)}
        />
      </div>
      <div class="second-brain-research-form-row">
        <label class="second-brain-research-form-label">Tags</label>
        <input
          class="second-brain-search-input"
          type="text"
          placeholder="Comma-separated: tools, prompts, agents"
          .value=${t.tags}
          @input=${n=>e.onCommunityResourceAddFormChange("tags",n.target.value)}
        />
      </div>
      <button
        class="second-brain-sync-btn"
        ?disabled=${!t.url.trim()}
        @click=${()=>e.onCommunityResourceAdd()}
      >Add Resource</button>
    </div>
  `}const Ni={all:{icon:"📊",label:"All"},productivity:{icon:"📋",label:"Productivity"},personal:{icon:"🧑",label:"Personal"},business:{icon:"💼",label:"Business"},system:{icon:"⚙️",label:"System"},custom:{icon:"✨",label:"Custom"}},s2=[{id:"morning-overview",name:"Morning Overview",category:"productivity",description:"Tasks, calendar, priorities, and focus score",prompt:"Create a morning overview dashboard that shows my top priorities, today's calendar events, active queue items, and readiness score. Use clean CSS grid layout."},{id:"weekly-impact",name:"Weekly Impact",category:"productivity",description:"What you accomplished this week",prompt:"Create a weekly impact dashboard showing tasks completed vs created this week, agent task outcomes, trust score changes, and top 3 wins. Use CSS bar charts."},{id:"agent-activity",name:"Agent Activity",category:"system",description:"Queue throughput, personas, and trust scores",prompt:"Create an agent activity dashboard showing queue stats (pending, processing, completed, failed), most active personas, cron skill execution log, and trust scores by workflow."},{id:"health-energy",name:"Health & Energy",category:"personal",description:"Sleep, readiness, and activity from Oura",prompt:"Create a health and energy dashboard showing last night's sleep score, 7-day sleep trend, today's readiness score, activity level, and HRV trend. Pull from Oura integration."},{id:"goals-tracker",name:"Goals Tracker",category:"personal",description:"Active goals with progress bars",prompt:"Create a goals tracker dashboard showing my active goals as cards with progress bars, grouped by area (health, career, finance, personal), with overall completion percentage."},{id:"content-performance",name:"Content Performance",category:"business",description:"Social posts and content pipeline",prompt:"Create a content performance dashboard showing recent content pieces, content pipeline status, engagement metrics from X intelligence, and a content calendar for the next 7 days."}];function a2(e){return e==="global"?r`<span class="dashboard-card-scope">Global</span>`:r`<span class="dashboard-card-scope">${e}</span>`}function Ap(e){return Date.now()-new Date(e).getTime()>1440*60*1e3}function xp(e){const t=(e.title+" "+(e.description??"")).toLowerCase();return t.includes("health")||t.includes("sleep")||t.includes("oura")||t.includes("energy")||t.includes("goal")?"personal":t.includes("agent")||t.includes("queue")||t.includes("trust")||t.includes("skill")?"system":t.includes("revenue")||t.includes("business")||t.includes("content")||t.includes("metric")?"business":t.includes("task")||t.includes("calendar")||t.includes("morning")||t.includes("impact")||t.includes("weekly")?"productivity":"custom"}function pc(e,t){const n=Ni[e.category]??Ni.custom;return r`
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
  `}function i2(e,t,n,s){const a=Ap(e.updatedAt);return r`
    <div class="dashboard-card ${e.pinned?"dashboard-card--pinned":""}">
      <button
        class="dashboard-card-main"
        @click=${()=>t(e.id)}
      >
        <div class="dashboard-card-title">
          ${e.pinned?r`<span class="pin-icon" title="Pinned">\u{1F4CC}</span>`:h}
          ${e.title}
        </div>
        ${e.description?r`<div class="dashboard-card-desc">${e.description}</div>`:h}
        <div class="dashboard-card-meta">
          ${a2(e.scope)}
          <span>${K(new Date(e.updatedAt).getTime())}</span>
          ${a?r`<span class="dashboard-card-stale" title="Last updated over 24 hours ago">\u{1F7E1} Stale</span>`:h}
        </div>
      </button>
      <div class="dashboard-card-actions">
        ${s?r`<button
              class="dashboard-card-pin"
              title="${e.pinned?"Unpin":"Pin"}"
              @click=${i=>{i.stopPropagation(),s(e.id)}}
            >${e.pinned?"📌":"📅"}</button>`:h}
        <button
          class="dashboard-card-delete"
          title="Delete dashboard"
          @click=${i=>{i.stopPropagation(),confirm(`Delete "${e.title}"?`)&&n(e.id)}}
        >&times;</button>
      </div>
    </div>
  `}function o2(e){const{activeDashboardHtml:t,activeDashboardManifest:n,isWorking:s}=e;if(!t||!n)return h;const a=Ap(n.updatedAt);return r`
    <section class="dashboards-container">
      <div class="dashboards-active-header">
        <button
          class="dashboards-back-btn"
          @click=${()=>e.onBack()}
        >&larr; All Dashboards</button>
        <div class="dashboards-active-title-group">
          <span class="dashboards-active-title">${n.title}</span>
          <span class="dashboards-active-meta">
            ${K(new Date(n.updatedAt).getTime())}
            ${a?r` &middot; <span class="dashboard-card-stale">\u{1F7E1} Stale</span>`:h}
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
          ${Ce(Ag(t))}
        </div>
      </div>
    </section>
  `}function r2(e,t,n){const s={all:t.length};for(const a of t){const i=xp(a);s[i]=(s[i]??0)+1}return r`
    <div class="dashboards-category-bar">
      ${Object.entries(Ni).map(([a,i])=>r`
        <button
          class="dashboards-category-btn ${e===a?"active":""}"
          @click=${()=>n(a)}
        >
          ${i.icon} ${i.label}
          ${s[a]?r`<span class="category-count">${s[a]}</span>`:h}
        </button>
      `)}
    </div>
  `}function l2(e){const{loading:t,dashboards:n}=e,s=e.categoryFilter??"all",a=e.templates??s2,o=[...s==="all"?n??[]:(n??[]).filter(u=>xp(u)===s)].sort((u,p)=>u.pinned&&!p.pinned?-1:!u.pinned&&p.pinned?1:new Date(p.updatedAt).getTime()-new Date(u.updatedAt).getTime()),l=s==="all"?a:a.filter(u=>u.category===s),c=(n??[]).length>0;return r`
    <section class="dashboards-container">
      <div class="dashboards-toolbar">
        <span class="dashboards-count">${(n??[]).length} dashboard${(n??[]).length===1?"":"s"}</span>
        <button
          class="dashboards-create-btn"
          @click=${()=>e.onCreateViaChat()}
        >+ Create via Chat</button>
      </div>

      ${c&&e.onCategoryFilter?r2(s,n??[],e.onCategoryFilter):h}

      ${t?r`<div class="dashboards-loading"><div class="spinner"></div> Loading dashboards...</div>`:o.length===0&&!c?r`
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
                  ${a.map(u=>pc(u,e.onCreateViaChat))}
                </div>
              </div>
            `:r`
              <div class="dashboards-grid">
                ${o.map(u=>i2(u,e.onSelectDashboard,e.onDeleteDashboard,e.onTogglePin))}
              </div>
              ${l.length>0?r`
                <div class="dashboards-templates-section">
                  <h3 class="dashboards-section-title">Create from template</h3>
                  <div class="dashboards-grid dashboards-grid--templates">
                    ${l.map(u=>pc(u,e.onCreateViaChat))}
                  </div>
                </div>
              `:h}
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
    `:e.activeDashboardHtml&&e.activeDashboardManifest?o2(e):l2(e)}const d2={0:"Assessment",1:"Interview",2:"Second Brain",3:"Workflow Audit",4:"Configuration",5:"First Win",6:"Ready"},u2=[{id:"slack",name:"Slack",icon:"#",desc:"Team messaging"},{id:"google-calendar",name:"Google Calendar",icon:"Cal",desc:"Events & scheduling"},{id:"clickup",name:"ClickUp",icon:"CU",desc:"Project management"},{id:"github",name:"GitHub",icon:"GH",desc:"Code & repos"},{id:"obsidian",name:"Obsidian",icon:"Ob",desc:"Notes & knowledge"},{id:"notion",name:"Notion",icon:"N",desc:"Docs & wikis"},{id:"linear",name:"Linear",icon:"Li",desc:"Issue tracking"},{id:"apple-reminders",name:"Apple Reminders",icon:"AR",desc:"Tasks (macOS)"},{id:"email",name:"Email",icon:"@",desc:"Gmail / Outlook"},{id:"things-mac",name:"Things",icon:"Th",desc:"Task manager (macOS)"}];function p2(e){return r`
		<div class="onboarding-progress">
			<div class="onboarding-progress-bar">
				${[2,3,4,5].map(n=>r`
						<div
							class="onboarding-progress-step ${e>=n?"completed":""} ${e===n?"active":""}"
						>
							<div class="onboarding-progress-dot"></div>
							<span class="onboarding-progress-label">${d2[n]}</span>
						</div>
					`)}
			</div>
			<div class="onboarding-progress-fill" style="width: ${(e-2)/4*100}%"></div>
		</div>
	`}function h2(e,t){return r`
		<div class="onboarding-tools-overlay">
			<div class="onboarding-tools-header">
				<h3>Connect Your Tools</h3>
				<p>Tap a tool to connect it. The agent will help with setup.</p>
			</div>
			<div class="onboarding-tools-grid">
				${u2.map(n=>{const a=e.find(i=>i.id===n.id)?.status??"pending";return r`
						<div class="onboarding-tool-card ${a}" data-tool-id="${n.id}">
							<div class="onboarding-tool-icon">${n.icon}</div>
							<div class="onboarding-tool-name">${n.name}</div>
							<div class="onboarding-tool-desc">${n.desc}</div>
							<div class="onboarding-tool-status">
								${a==="connected"?r`<span class="status-connected">Connected</span>`:a==="skipped"?r`<span class="status-skipped">Skipped</span>`:r`<span class="status-pending">Tap to connect</span>`}
							</div>
						</div>
					`})}
			</div>
			<button class="onboarding-skip-btn" @click=${t}>Skip for now</button>
		</div>
	`}function f2(e){return e.length?r`
		<div class="onboarding-audit-overlay">
			<h3>GodMode Audit Results</h3>
			<div class="onboarding-audit-cards">
				${e.map(t=>r`
						<div class="onboarding-audit-card impact-${t.impact}">
							<div class="audit-problem">${t.problem}</div>
							${t.skill?r`<div class="audit-skill">Skill: ${t.skill}</div>`:h}
							${t.estimatedTimeSaved?r`<div class="audit-time">Saves ~${t.estimatedTimeSaved}</div>`:h}
							<div class="audit-impact">${t.impact} impact</div>
						</div>
					`)}
			</div>
		</div>
	`:r`${h}`}function g2(e){const t=e>=70?"#38a169":e>=40?"#d69e2e":"#e53e3e",n=e>=70?"Good":e>=40?"Needs Work":"Getting Started";return r`
		<div class="onboarding-health-gauge">
			<div class="health-score" style="color: ${t}">
				<span class="health-number">${e}</span>
				<span class="health-max">/100</span>
			</div>
			<div class="health-label" style="color: ${t}">${n}</div>
		</div>
	`}function m2(e){return r`
		<div class="onboarding-assessment">
			${g2(e.healthScore)}
			<div class="assessment-checklist">
				<div class="assessment-item ${e.configExists?"ok":"gap"}">
					<span class="assessment-icon">${e.configExists?"✅":"❌"}</span>
					<span>Config file</span>
				</div>
				<div class="assessment-item ${e.authMethod!=="none"?"ok":"gap"}">
					<span class="assessment-icon">${e.authMethod!=="none"?"✅":"❌"}</span>
					<span>Auth: ${e.authMethod}</span>
				</div>
				<div class="assessment-item ${e.memoryStatus.hasMemoryMd?"ok":"gap"}">
					<span class="assessment-icon">${e.memoryStatus.hasMemoryMd?"✅":"❌"}</span>
					<span>Memory (${e.memoryStatus.fileCount} files, ${e.memoryStatus.totalSizeKb}KB)</span>
				</div>
				<div class="assessment-item ${e.channelsConnected.length>0?"ok":"gap"}">
					<span class="assessment-icon">${e.channelsConnected.length>0?"✅":"❌"}</span>
					<span>Channels: ${e.channelsConnected.length>0?e.channelsConnected.join(", "):"none"}</span>
				</div>
				<div class="assessment-item ${e.githubReady?"ok":"gap"}">
					<span class="assessment-icon">${e.githubReady?"✅":"❌"}</span>
					<span>GitHub CLI${e.githubReady?"":" (needed for coding + workspaces)"}</span>
				</div>
				<div class="assessment-item ${e.obsidianVaultConfigured?"ok":"gap"}">
					<span class="assessment-icon">${e.obsidianVaultConfigured?"✅":"❌"}</span>
					<span>Obsidian vault${e.obsidianVaultConfigured?"":" (needed for daily brief)"}</span>
				</div>
				<div class="assessment-item ${e.skillsInstalled.length>0?"ok":"gap"}">
					<span class="assessment-icon">${e.skillsInstalled.length>0?"✅":"❌"}</span>
					<span>Skills: ${e.skillsInstalled.length>0?e.skillsInstalled.length+" installed":"none"}</span>
				</div>
				${e.features.map(t=>r`
						<div class="assessment-item ${t.enabled?"ok":"gap"}">
							<span class="assessment-icon">${t.enabled?"✅":"❌"}</span>
							<span>${t.label}</span>
						</div>
					`)}
			</div>
		</div>
	`}function v2(e,t){return r`
		<div class="onboarding-fullscreen">
			<div class="onboarding-welcome">
				<div class="onboarding-welcome-glow"></div>
				<h1 class="onboarding-title">Welcome to GodMode</h1>
				${t?r`
						<p class="onboarding-subtitle">Here's where your setup stands today:</p>
						${m2(t)}
						<p class="onboarding-subtitle">Let's get you to 100. It takes about 15 minutes.</p>
					`:r`
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
					`}
				<button class="onboarding-cta" @click=${e}>
					${t?"Let's optimize your setup":"Let's build your GodMode"}
				</button>
			</div>
		</div>
	`}function y2(e){let t="",n="",s="";const a=["rocket","lightning","fire","star","brain","crown","diamond","target","compass","mountain"],i={rocket:"🚀",lightning:"⚡",fire:"🔥",star:"⭐",brain:"🧠",crown:"👑",diamond:"💎",target:"🎯",compass:"🧭",mountain:"⛰️"};function o(l){l.preventDefault();const c=l.target,u=new FormData(c);t=u.get("name")?.trim()??"",n=u.get("mission")?.trim()??"",s=u.get("emoji")?.trim()||"🚀",t&&e({name:t,mission:n,emoji:s})}return r`
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
							${a.map((l,c)=>r`
									<label class="emoji-option">
										<input
											type="radio"
											name="emoji"
											value="${i[l]}"
											?checked=${c===0}
										/>
										<span class="emoji-display">${i[l]}</span>
									</label>
								`)}
						</div>
					</div>
					<button type="submit" class="onboarding-cta">Continue</button>
				</form>
			</div>
		</div>
	`}function b2(e){const{phase:t,tools:n,auditFindings:s,onSkipPhase:a}=e;return r`
		${p2(t)}
		${t===3?h2(n,a):h}
		${t===4&&s.length>0?f2(s):h}
	`}function w2(e,t,n){return e?r`
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
				${t?.mission?r`<p class="onboarding-summary-mission">"${t.mission}"</p>`:h}
				<button class="onboarding-cta onboarding-reveal-btn" @click=${n}>
					Welcome to GodMode
				</button>
			</div>
		</div>
	`:r`${h}`}function k2(e){let t=!1;function n(s){if(s.preventDefault(),t)return;const a=s.target,i=a.querySelector('[name="name"]')?.value?.trim()??"";if(!i){a.querySelector('[name="name"]')?.focus();return}t=!0,e.onQuickSetup(i)}return r`
    <div class="setup-quick">
      <div class="setup-quick__header">
        <span class="setup-quick__icon">\u26A1</span>
        <h2 class="setup-quick__title">Welcome to GodMode</h2>
        <p class="setup-quick__subtitle">Tell us your name and start chatting with your AI ally.</p>
      </div>

      <form class="setup-quick__form" @submit=${n}>
        <div class="setup-field">
          <label class="setup-label" for="setup-name">Your name</label>
          <input
            class="setup-input"
            type="text"
            id="setup-name"
            name="name"
            placeholder="What should your AI call you?"
            required
            autocomplete="name"
          />
        </div>

        <button class="setup-submit" type="submit">
          Start Using GodMode
        </button>
      </form>
    </div>
  `}function $2(e){return e>=100?"GodMode fully loaded":e>=75?"Your ally is learning...":e>=50?"Building momentum...":e>=25?"Getting started...":"Power up your ally"}function S2(e){const n=2*Math.PI*54,s=n-e/100*n;return r`
    <div class="setup-ring">
      <svg class="setup-ring__svg" viewBox="0 0 120 120" width="120" height="120">
        <circle class="setup-ring__bg" cx="60" cy="60" r="${54}" fill="none" stroke="var(--gm-border, #333)" stroke-width="8" />
        <circle
          class="setup-ring__fill"
          cx="60" cy="60" r="${54}" fill="none"
          stroke="var(--gm-accent, #7c3aed)"
          stroke-width="8"
          stroke-linecap="round"
          stroke-dasharray="${n}"
          stroke-dashoffset="${s}"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="64" text-anchor="middle" fill="var(--gm-text, #fff)" font-size="22" font-weight="bold">${e}%</text>
      </svg>
      <span class="setup-ring__label">${$2(e)}</span>
    </div>
  `}function A2(e,t){const n=`setup-card--${e.status}`;return r`
    <div class="setup-card ${n}">
      <div class="setup-card__header">
        <span class="setup-card__icon">${e.icon}</span>
        <span class="setup-card__title">${e.title}</span>
        <span class="setup-card__badge setup-card__badge--${e.status}">
          ${e.status==="active"?"✓ Active":e.status==="available"?"Available":"Coming Soon"}
        </span>
      </div>
      <p class="setup-card__desc">${e.description}</p>
      ${e.detail?r`<span class="setup-card__detail">${e.detail}</span>`:h}
      ${e.status==="available"&&e.action?r`<button class="setup-card__btn" @click=${()=>t(e.id)}>${e.action}</button>`:h}
      ${e.status==="active"?r`<span class="setup-card__active-check">\u2705</span>`:h}
    </div>
  `}function x2(e){const{capabilities:t,capabilitiesLoading:n,onHideSetup:s,onOpenWizard:a,onCapabilityAction:i}=e;if(n&&!t)return r`<div class="setup-loading">Loading capabilities...</div>`;if(!t)return r`<div class="setup-loading">Couldn't load capabilities. Is the gateway running?</div>`;const{capabilities:o,percentComplete:l}=t;return r`
    <div class="setup-capabilities">
      ${S2(l)}

      <div class="setup-cards">
        ${o.map(c=>A2(c,i))}
      </div>

      <div class="setup-actions">
        <button class="setup-action-btn" @click=${a}>
          Deep Setup Wizard
        </button>
        <button class="setup-action-btn setup-action-btn--text" @click=${s}>
          Hide Setup
        </button>
      </div>

      <div class="setup-help-banner">
        <span class="setup-help-banner__text">Need help? Chat with our AI support agent.</span>
        <button class="setup-help-banner__btn" @click=${()=>e.onOpenSupportChat()}>
          Open Support Chat
        </button>
      </div>
    </div>
  `}function T2(e){return e.connected?r`
    <section class="tab-body setup-section">
      ${e.quickSetupDone?h:k2(e)}
      ${x2(e)}
    </section>
  `:r`
      <section class="tab-body setup-section">
        <div class="setup-loading">
          Waiting for gateway connection...
        </div>
      </section>
    `}function hc(e){const{connected:t,integrations:n,coreProgress:s,expandedCard:a,activeGuide:i,loadingGuide:o,testingId:l,testResult:c,configValues:u}=e;if(!t)return r`
      <div class="view-container onboarding-setup">
        <div class="empty-state">
          <p>Connecting to gateway...</p>
        </div>
      </div>
    `;if(!n)return setTimeout(()=>e.onLoadIntegrations(),0),r`
      <div class="view-container onboarding-setup">
        <div class="empty-state">
          <p>Loading integrations...</p>
        </div>
      </div>
    `;const p=n.filter(m=>m.tier==="core"),f=n.filter(m=>m.tier==="deep"),v=s!=null&&s.connected>=s.total;return r`
    <div class="view-container onboarding-setup">
      <div class="onboarding-header">
        <div class="onboarding-header__text">
          <h2>Connect Your World</h2>
          <p class="section-subtitle">Set up the integrations that power your daily brief and agent features. Everything is skippable.</p>
        </div>
        ${e.onOpenSupportChat?r`<button class="btn btn--ghost onboarding-help-btn" @click=${()=>e.onOpenSupportChat()}>Need help? Chat with support</button>`:h}
      </div>

      ${v?r`
            <div class="onboarding-complete">
              <div class="onboarding-complete__icon">&#x2705;</div>
              <div class="onboarding-complete__text">
                <h3>Core integrations connected</h3>
                <p>Your daily brief, remote access, and coding tools are ready. Set up the optional extras below, or start using GodMode.</p>
              </div>
              ${e.onMarkComplete?r`<button class="btn btn--primary onboarding-complete__cta" @click=${()=>e.onMarkComplete()}>Start Using GodMode</button>`:h}
            </div>
          `:h}

      <div class="onboarding-columns">
        <div class="onboarding-column onboarding-column--core">
          <div class="onboarding-section">
            <h3>Core Setup</h3>
            <p class="section-subtitle">These power your daily brief, remote access, and coding tools.</p>
            ${s?r`
                  <div class="onboarding-progress">
                    <div class="progress-bar">
                      <div class="progress-bar__fill" style="width: ${Math.round(s.connected/s.total*100)}%"></div>
                    </div>
                    <span class="progress-label">${s.connected} of ${s.total} core integrations set up</span>
                  </div>
                `:h}
            <div class="integration-cards">
              ${p.map(m=>fc(m,e))}
            </div>
          </div>
        </div>

        ${f.length>0?r`
              <div class="onboarding-column onboarding-column--deep">
                <div class="onboarding-section">
                  <h3>Deep Setup</h3>
                  <p class="section-subtitle">Optional extras — health tracking, weather, cloud sync.</p>
                  <div class="integration-cards">
                    ${f.map(m=>fc(m,e))}
                  </div>
                </div>
              </div>
            `:h}
      </div>
    </div>
  `}function fc(e,t){const{expandedCard:n,activeGuide:s,loadingGuide:a,testingId:i,testResult:o,configValues:l}=t,c=n===e.id,u=e.status.working||e.status.configured,p=i===e.id,f=o?.id===e.id,v=e.id==="messaging-channel";return r`
    <div class="integration-card ${u?"integration-card--connected":""} ${c?"integration-card--expanded":""}">
      <div class="integration-card__header" @click=${()=>t.onExpandCard(c?null:e.id)}>
        <span class="integration-card__chevron ${c?"integration-card__chevron--open":""}">&#x25B8;</span>
        <div class="integration-card__info">
          <span class="integration-card__name">${e.name}</span>
          <span class="integration-card__desc">${e.description}</span>
          ${e.briefSection?r`<span class="integration-card__powers">Powers: ${e.briefSection}</span>`:h}
        </div>
        <div class="integration-card__status">
          ${u?r`<span class="status-badge status-badge--connected">Connected</span>`:r`<span class="status-badge status-badge--available">Not Set Up</span>`}
        </div>
      </div>

      ${c?r`
            <div class="integration-card__body">
              ${v?r`
                    <div class="integration-guide">
                      <p>GodMode uses OpenClaw's built-in messaging channels.</p>
                      <button class="btn btn--secondary" @click=${()=>t.onNavigate("channels")}>
                        Go to Channels
                      </button>
                    </div>
                  `:r`
                    ${!s||s.integrationId!==e.id?r`
                          <button class="btn btn--secondary" @click=${()=>t.onLoadGuide(e.id)}
                            ?disabled=${a===e.id}>
                            ${a===e.id?"Loading...":"Show Setup Instructions"}
                          </button>
                        `:r`
                          <div class="integration-guide">
                            <div class="guide-steps">${_2(s.steps)}</div>

                            ${s.envVars.length>0?r`
                                  <div class="guide-inputs">
                                    ${s.envVars.map(m=>r`
                                        <label class="input-group">
                                          <span class="input-label">${m.label}</span>
                                          <span class="input-desc">${m.description}</span>
                                          <input
                                            class="input-field"
                                            type="${m.secret?"password":"text"}"
                                            placeholder="${m.label}"
                                            .value=${l[m.key]??""}
                                            @input=${k=>{const d=k.target.value;t.onUpdateConfigValue(m.key,d)}}
                                          />
                                        </label>
                                      `)}
                                    <div class="guide-actions">
                                      <button
                                        class="btn btn--primary"
                                        @click=${()=>{const m={};for(const k of s.envVars){const d=l[k.key];d&&(m[k.key]=d)}t.onConfigureIntegration(e.id,m)}}
                                      >
                                        Save & Test
                                      </button>
                                      <button class="btn btn--ghost" @click=${()=>t.onSkipIntegration(e.id)}>
                                        Skip
                                      </button>
                                    </div>
                                  </div>
                                `:r`
                                  <div class="guide-actions">
                                    <button
                                      class="btn btn--primary"
                                      @click=${()=>t.onTestIntegration(e.id)}
                                      ?disabled=${p}
                                    >
                                      ${p?"Testing...":"Test Connection"}
                                    </button>
                                    <button class="btn btn--ghost" @click=${()=>t.onSkipIntegration(e.id)}>
                                      Skip
                                    </button>
                                  </div>
                                `}
                          </div>
                        `}
                  `}

              ${f?r`
                    <div class="test-result ${o.result.success?"test-result--success":"test-result--error"}">
                      ${o.result.success?"✅":"❌"} ${o.result.message}
                    </div>
                  `:h}

              ${e.status.details?r`<div class="integration-details">${e.status.details}</div>`:h}
            </div>
          `:h}
    </div>
  `}function _2(e){const t=e.split(`
`),n=[];for(const s of t)s.startsWith("```")||(s.match(/^\d+\./)?n.push(r`<p class="guide-step">${gc(s)}</p>`):s.trim()&&n.push(r`<p>${gc(s)}</p>`));return r`${n}`}function C2(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function gc(e){let t=C2(e);return t=t.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(n,s,a)=>{const i=a.trim().toLowerCase();return i.startsWith("javascript:")||i.startsWith("data:")||i.startsWith("vbscript:")?s:`<a href="${a}" target="_blank" rel="noopener">${s}</a>`}),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),r`<span>${Ce(t)}</span>`}const E2=/^data:/i,R2=/^https?:\/\//i;function L2(e){const t=e.agentsList?.agents??[],s=Mc(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",i=t.find(l=>l.id===s)?.identity,o=i?.avatarUrl??i?.avatar;if(o)return E2.test(o)||R2.test(o)?o:i?.avatarUrl}function mc(e,t){const n=e.dynamicSlots[t];return n?r`
    <div class="dynamic-slot">
      <div class="dynamic-slot__toolbar">
        <span class="dynamic-slot__label">Custom view</span>
        <button
          class="dynamic-slot__reset"
          @click=${()=>{const s={...e.dynamicSlots};delete s[t],e.dynamicSlots=s}}
          title="Reset to default view"
        >Reset to default</button>
      </div>
      <div class="dynamic-slot__content">${Ce(ad(n))}</div>
    </div>
  `:h}function vc(e){const t=e.trim();if(!t)return t;const n=t.split(/\s+/);if(n.length>=2&&n.length%2===0){const l=n.length/2,c=n.slice(0,l).join(" "),u=n.slice(l).join(" ");if(c.toLowerCase()===u.toLowerCase())return c}const s=t.replace(/\s+/g," ").toLowerCase(),a=Math.floor(s.length/2),i=s.slice(0,a).trim(),o=s.slice(a).trim();return i&&i===o?t.slice(0,Math.ceil(t.length/2)).trim():t}function Fi(e,t){const n=t?.sessionId?.trim();return n?`session:${n}`:`key:${e.trim().toLowerCase()}`}function yc(e){if(e===Q)return!0;const t=e.toLowerCase();return!!(t==="agent:main:main"||t.endsWith(":main"))}function P2(e){const t=e.sessionsResult?.sessions,n=[...new Set(e.settings.openTabs.map(l=>l.trim()).filter(Boolean))].filter(l=>!yc(l)),s=Te(t,e.sessionKey),a=Fi(e.sessionKey,s),i=new Map;for(const l of n){const c=Te(t,l),u=Fi(l,c);if(!i.has(u)){i.set(u,l);continue}l===e.sessionKey&&i.set(u,l)}const o=[...i.values()];if(o.length===0){const l=e.sessionKey.trim()||"main";yc(l)||o.push(l)}return{tabKeys:o,activeIdentity:a}}function I2(e){const t=e.onboardingActive&&e.onboarding,n=e.onboardingPhase??0,s=e.onboardingData;if(t&&n===0)return v2(()=>{e.handleOnboardingStart?.()},s?.assessment);if(t&&n===1)return y2(d=>{e.handleOnboardingIdentitySubmit?.(d)});if(t&&n===6)return w2(s?.summary??null,s?.identity??null,()=>{e.handleOnboardingComplete?.()});if(e.wizardActive&&e.wizardState)return vp(e.wizardState,{onStepChange:d=>{e.handleWizardStepChange?.(d)},onAnswerChange:(d,g)=>{e.handleWizardAnswerChange?.(d,g)},onPreview:()=>{e.handleWizardPreview?.()},onGenerate:()=>{e.handleWizardGenerate?.()},onClose:()=>{e.handleWizardClose?.()},onFileToggle:(d,g)=>{e.handleWizardFileToggle?.(d,g)},onConfigToggle:(d,g)=>{e.handleWizardConfigToggle?.(d,g)}});const a=e.presenceEntries.length,i=e.sessionsResult?.count??null,o=e.cronStatus?.nextWakeAtMs??null,l=e.connected?null:"Disconnected from gateway.",c=e.tab==="chat",u=c&&(e.settings.chatFocusMode||e.onboarding||t&&n>=2),p=e.onboarding?!1:e.settings.chatShowThinking,f=L2(e),v=e.chatAvatarUrl??f??null,{tabKeys:m,activeIdentity:k}=P2(e);return r`
    <div class="shell ${c?"shell--chat":""} ${u?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
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
                  @click=${d=>{d.preventDefault(),e.setTab("overview")}}
                >
                  <span class="pill__icon">${q.zap}</span>
                  <span>Update Ready</span>
                </a>`:h}
          ${e.updateStatus?.pendingDeploy?r`<button
                  class="pill pill--restart"
                  @click=${d=>{d.preventDefault(),e.handleGatewayRestartClick()}}
                  title="Restart to apply: ${e.updateStatus.pendingDeploy.summary??"pending fix"}"
                >
                  <span class="pill__icon">${q.rotateCcw}</span>
                  <span>Restart</span>
                </button>`:h}
          <button
            class="pill pill--support"
            @click=${d=>{d.preventDefault(),e.handleOpenSupportChat()}}
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
          ${Bu(e)}
        </div>
      </header>
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">
        ${Fh.map(d=>{const g=e.settings.navGroupsCollapsed[d.label]??!1,S=d.tabs.some(T=>T===e.tab),A=!d.label||d.tabs.length===1&&Yn(d.tabs[0])===d.label;return r`
            <div class="nav-group ${g&&!S?"nav-group--collapsed":""} ${A?"nav-group--no-header":""}">
              ${A?h:r`
                <button
                  class="nav-label"
                  @click=${()=>{const T={...e.settings.navGroupsCollapsed};T[d.label]=!g,e.applySettings({...e.settings,navGroupsCollapsed:T})}}
                  aria-expanded=${!g}
                >
                  <span class="nav-label__text">${d.label}</span>
                  <span class="nav-label__chevron">${g?"+":"−"}</span>
                </button>
              `}
              <div class="nav-group__items">
                ${!d.label&&e.godmodeOptions!=null&&!e.godmodeOptions?.["onboarding.hidden"]?r`
                        <a
                          class="nav-item ${e.tab==="setup"?"active":""}"
                          href="#"
                          @click=${T=>{T.preventDefault(),e.setTab("setup")}}
                          title="Power up your GodMode ally."
                        >
                          <span class="nav-item__emoji" aria-hidden="true">\u{1F9ED}</span>
                          <span class="nav-item__text">Setup</span>
                          ${e.setupCapabilities&&e.setupCapabilities.percentComplete!=null?r`<span class="nav-item__badge">${e.setupCapabilities.percentComplete}%</span>`:h}
                        </a>
                      `:h}
                ${d.tabs.map(T=>Li(e,T))}
              </div>
            </div>
          `})}
        ${Bh.map(d=>{const g=e.settings.navGroupsCollapsed[d.label]??!0,S=d.tabs.some(A=>A===e.tab);return r`
            <div class="nav-group ${g&&!S?"nav-group--collapsed":""}">
              <button
                class="nav-label"
                @click=${()=>{const A={...e.settings.navGroupsCollapsed};A[d.label]=!g,e.applySettings({...e.settings,navGroupsCollapsed:A})}}
                aria-expanded=${!g}
              >
                <span class="nav-label__text">${d.label}</span>
                <span class="nav-label__chevron">${g?"+":"−"}</span>
              </button>
              <div class="nav-group__items">
                ${d.tabs.map(A=>Li(e,A))}
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
      <main class="content ${c?"content--chat":""}">
        <section class="content-header">
          <div>
            ${e.tab!=="chat"&&e.tab!=="setup"?r`
              <div class="page-title">${Yn(e.tab)}</div>
              <div class="page-sub">${Kh(e.tab)}</div>
            `:e.tab==="chat"?r`
              <div class="session-tabs">
                <div class="session-tab session-tab--pinned ${e.sessionKey===Q?"session-tab--active":""}"
                     @click=${()=>{e.sessionKey!==Q&&($e(e),e.sessionKey=Q,e.allyUnread=0,Pe(e,Q),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:Q,lastActiveSessionKey:Q,tabLastViewed:{...e.settings.tabLastViewed,[Q]:Date.now()}}),e.loadAssistantIdentity(),se(e),te(e))}}
                     title="${e.assistantName||"Ally"}">
                  ${e.assistantAvatar?r`<img src="${e.assistantAvatar}" class="session-tab-avatar" width="16" height="16" style="border-radius:50%;vertical-align:middle;margin-right:4px;" />`:r`<span class="session-tab-icon" style="margin-right:4px;">&#x2726;</span>`}
                  ${e.assistantName||"Ally"}
                  ${(e.allyUnread??0)>0?r`<span class="ally-tab-badge" style="margin-left:4px;font-size:10px;background:var(--accent-color,#5b73e8);color:#fff;border-radius:50%;padding:1px 5px;">${e.allyUnread}</span>`:h}
                </div>
                ${ha(m,d=>d,(d,g)=>{const S=Te(e.sessionsResult?.sessions,d),A=Fi(d,S)===k,x=(()=>{if(S?.label||S?.displayName)return vc(S.label??S.displayName);const I=be.get(d);if(I)return vc(I);if(d==="agent:main:support")return"Support";if(d.includes("webchat")){const F=d.match(/webchat[:-](\d+)/);return F?`Chat ${F[1]}`:"Chat"}if(d.includes("main"))return"MAIN";const M=d.split(/[:-]/);return M[M.length-1]||d})(),_=e.workingSessions.has(d),L=e.settings.tabLastViewed[d]??0,R=S?.updatedAt??0,Z=!A&&!_&&R>L,Y=e.editingTabKey===d;return r`
                      <div
                        class="session-tab ${A?"session-tab--active":""} ${_?"session-tab--working":""} ${Z?"session-tab--ready":""} ${Y?"session-tab--editing":""}"
                        draggable="true"
                        @dragstart=${I=>{if(e.editingTabKey===d){I.preventDefault();return}I.dataTransfer.effectAllowed="move",I.dataTransfer.setData("text/session-key",d),I.dataTransfer.setData("text/plain",g.toString()),I.target.classList.add("dragging")}}
                        @click=${()=>{if(!Y){if(A){e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}});return}$e(e),e.sessionKey=d,Pe(e,d),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}}),e.loadAssistantIdentity(),ye(e,d,!0),se(e),te(e)}}}
                        @dragend=${I=>{I.target.classList.remove("dragging")}}
                        @dragover=${I=>{I.preventDefault(),I.dataTransfer.dropEffect="move";const M=I.currentTarget,F=M.getBoundingClientRect(),U=F.left+F.width/2;I.clientX<U?(M.classList.add("drop-left"),M.classList.remove("drop-right")):(M.classList.add("drop-right"),M.classList.remove("drop-left"))}}
                        @dragleave=${I=>{I.currentTarget.classList.remove("drop-left","drop-right")}}
                        @drop=${I=>{I.preventDefault();const M=parseInt(I.dataTransfer.getData("text/plain")),F=g;if(M===F)return;const U=e.settings.openTabs.slice(),[O]=U.splice(M,1);U.splice(F,0,O),e.applySettings({...e.settings,openTabs:U}),I.currentTarget.classList.remove("drop-left","drop-right")}}
                        title=${x}
                      >
                        ${Y?r`
                          <input
                            type="text"
                            draggable="false"
                            class="session-tab__name-input"
                            .value=${S?.label??S?.displayName??""}
                            @click=${I=>I.stopPropagation()}
                            @dblclick=${I=>I.stopPropagation()}
                            @blur=${async I=>{const M=I.target;if(M._committedByEnter)return;const F=M.value.trim();e.editingTabKey=null;const U=S?.label??S?.displayName??"";if(F!==U){F?be.set(d,F):be.delete(d),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(J=>J.key===d?{...J,label:F||void 0,displayName:F||void 0}:J)});const O=await Rs(e,d,{label:F||null,displayName:F||null});te(e);const ie=O.ok&&O.canonicalKey!==d?O.canonicalKey:d,ke=d===e.sessionKey;e.applySettings({...e.settings,...O.ok&&O.canonicalKey!==d&&e.settings.openTabs.includes(d)?{openTabs:e.settings.openTabs.map(J=>J===d?O.canonicalKey:J)}:{},tabLastViewed:{...e.settings.tabLastViewed,[ie]:Date.now()},...ke&&O.ok&&O.canonicalKey!==d?{sessionKey:O.canonicalKey,lastActiveSessionKey:O.canonicalKey}:{}}),ke&&O.ok&&O.canonicalKey!==d&&(e.sessionKey=O.canonicalKey,ye(e,O.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}})}}
                            @keydown=${async I=>{if(I.key==="Enter"){I.preventDefault();const M=I.target;M._committedByEnter=!0;const F=M.value.trim();e.editingTabKey=null;const U=S?.label??S?.displayName??"";if(F!==U){F?be.set(d,F):be.delete(d),e.sessionsResult?.sessions&&(e.sessionsResult={...e.sessionsResult,sessions:e.sessionsResult.sessions.map(J=>J.key===d?{...J,label:F||void 0,displayName:F||void 0}:J)});const O=await Rs(e,d,{label:F||null,displayName:F||null});te(e);const ie=O.ok&&O.canonicalKey!==d?O.canonicalKey:d,ke=d===e.sessionKey;e.applySettings({...e.settings,...O.ok&&O.canonicalKey!==d&&e.settings.openTabs.includes(d)?{openTabs:e.settings.openTabs.map(J=>J===d?O.canonicalKey:J)}:{},tabLastViewed:{...e.settings.tabLastViewed,[ie]:Date.now()},...ke&&O.ok&&O.canonicalKey!==d?{sessionKey:O.canonicalKey,lastActiveSessionKey:O.canonicalKey}:{}}),ke&&O.ok&&O.canonicalKey!==d&&(e.sessionKey=O.canonicalKey,ye(e,O.canonicalKey,!0))}else e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}})}else I.key==="Escape"&&(I.preventDefault(),e.editingTabKey=null)}}
                          />
                        `:(()=>{let I=null;return r`
                          <span
                            class="session-tab__name"
                            draggable="false"
                            @click=${M=>{M.stopPropagation(),I&&clearTimeout(I),I=setTimeout(()=>{I=null,e.editingTabKey!==d&&(d===e.sessionKey?e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}}):($e(e),e.sessionKey=d,e.chatPrivateMode=!!e.privateSessions?.has(d),Pe(e,d),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d,tabLastViewed:{...e.settings.tabLastViewed,[d]:Date.now()}}),e.loadAssistantIdentity(),ye(e,d,!0),se(e),te(e)))},250)}}
                            @dblclick=${M=>{M.preventDefault(),M.stopPropagation(),I&&(clearTimeout(I),I=null),e.editingTabKey=d;const F=M.target.closest(".session-tab"),U=O=>{const ie=O.target;F&&!F.contains(ie)&&(e.editingTabKey=null,document.removeEventListener("mousedown",U,!0))};document.addEventListener("mousedown",U,!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const O=F?.querySelector(".session-tab__name-input");O&&(O.focus(),O.select())})})}}
                          >${x}</span>
                        `})()}
                        ${e.privateSessions?.has(d)?(()=>{const I=e.privateSessions.get(d),M=Math.max(0,I-Date.now()),F=Math.floor(M/36e5),U=Math.floor(M%36e5/6e4),O=F>0?`${F}h ${U}m`:`${U}m`;return r`
                                  <span class="session-tab__private" title="Private session — expires in ${O}" style="font-size: 9px; margin-left: 3px; color: #f59e0b; white-space: nowrap;"
                                    >🔒 ${O}</span
                                  >
                                `})():h}
                        ${_?r`
                                <span class="session-tab__indicator session-tab__indicator--working"></span>
                              `:h}
                        ${Z?r`
                                <span class="session-tab__indicator session-tab__indicator--ready"></span>
                              `:h}
                        ${r`
                          <button
                            class="session-tab__close"
                            @click=${I=>{if(I.stopPropagation(),e.privateSessions?.has(d)){e._destroyPrivateSession(d);return}const M=e.settings.openTabs.filter(O=>O!==d),F=d===e.sessionKey,U=M[0]||Q;e.applySettings({...e.settings,openTabs:M,...F?{sessionKey:U,lastActiveSessionKey:U}:{}}),F&&(e.sessionKey=U,ye(e,U,!0),se(e))}}
                            title=${e.privateSessions?.has(d)?"Destroy private session":"Close tab"}
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
            ${c?Fu(e):h}
            ${(e.tab==="today"||e.tab==="my-day")&&!e.dynamicSlots.today?o0({connected:e.connected,onRefresh:()=>e.handleMyDayRefresh(),selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"brief",onViewModeChange:d=>e.handleTodayViewModeChange(d),focusPulseActive:!1,inboxItems:e.inboxItems??[],inboxCount:e.inboxCount??0,onEveningCapture:()=>{e.setTab("chat"),e.handleSendChat(`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`)}}):h}
          </div>
        </section>

        ${u?r`<button
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

        ${e.tab==="setup"?r`
                ${T2({connected:e.connected,quickSetupDone:e.setupQuickDone??!1,capabilities:e.setupCapabilities??null,capabilitiesLoading:e.setupCapabilitiesLoading??!1,onQuickSetup:d=>e.handleQuickSetup?.(d),onHideSetup:()=>e.handleHideSetup?.(),onOpenWizard:()=>e.handleWizardOpen?.(),onNavigate:d=>e.setTab(d),onRunAssessment:()=>e.handleRunAssessment?.(),onOpenSupportChat:()=>e.handleOpenSupportChat(),onCapabilityAction:d=>e.handleCapabilityAction?.(d)})}
                ${e.setupQuickDone?hc({connected:e.connected,integrations:e.onboardingIntegrations??null,coreProgress:e.onboardingCoreProgress??null,expandedCard:e.onboardingExpandedCard??null,loadingGuide:e.onboardingLoadingGuide??null,activeGuide:e.onboardingActiveGuide??null,testingId:e.onboardingTestingId??null,testResult:e.onboardingTestResult??null,configValues:e.onboardingConfigValues??{},onLoadIntegrations:()=>e.handleLoadIntegrations(),onExpandCard:d=>e.handleExpandCard(d),onLoadGuide:d=>e.handleLoadGuide(d),onTestIntegration:d=>e.handleTestIntegration(d),onConfigureIntegration:(d,g)=>e.handleConfigureIntegration(d,g),onUpdateConfigValue:(d,g)=>e.handleUpdateConfigValue(d,g),onSkipIntegration:d=>e.handleSkipIntegration(d),onNavigate:d=>e.setTab(d),onMarkComplete:()=>e.handleMarkOnboardingComplete?.(),onOpenSupportChat:()=>e.handleOpenSupportChat()}):h}
              `:h}

        ${e.tab==="onboarding"?hc({connected:e.connected,integrations:e.onboardingIntegrations??null,coreProgress:e.onboardingCoreProgress??null,expandedCard:e.onboardingExpandedCard??null,loadingGuide:e.onboardingLoadingGuide??null,activeGuide:e.onboardingActiveGuide??null,testingId:e.onboardingTestingId??null,testResult:e.onboardingTestResult??null,configValues:e.onboardingConfigValues??{},onLoadIntegrations:()=>e.handleLoadIntegrations(),onExpandCard:d=>e.handleExpandCard(d),onLoadGuide:d=>e.handleLoadGuide(d),onTestIntegration:d=>e.handleTestIntegration(d),onConfigureIntegration:(d,g)=>e.handleConfigureIntegration(d,g),onUpdateConfigValue:(d,g)=>e.handleUpdateConfigValue(d,g),onSkipIntegration:d=>e.handleSkipIntegration(d),onNavigate:d=>e.setTab(d),onMarkComplete:()=>e.handleMarkOnboardingComplete?.(),onOpenSupportChat:()=>e.handleOpenSupportChat()}):h}

        ${e.tab==="overview"?D0({connected:e.connected,hello:e.hello,settings:e.settings,password:e.password,lastError:e.lastError,presenceCount:a,sessionsCount:i,cronEnabled:e.cronStatus?.enabled??null,cronNext:o,lastChannelsRefresh:e.channelsLastSuccess,updateStatus:e.updateStatus,updateLoading:e.updateLoading,updateError:e.updateError,updateLastChecked:e.updateLastChecked,updateRunning:e.updateRunning,onSettingsChange:d=>e.applySettings(d),onPasswordChange:d=>e.password=d,onSessionKeyChange:d=>{$e(e),e.sessionKey=d,Pe(e,d),e.resetToolStream(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d}),e.loadAssistantIdentity()},onConnect:()=>e.connect(),onRefresh:()=>e.loadOverview(),onCheckUpdates:()=>_v(e),onUpdateNow:()=>{wr(e)},pluginUpdateRunning:e.pluginUpdateRunning,onUpdatePlugin:()=>{mh(e)}}):h}

        ${e.tab==="workspaces"?Z$({connected:e.connected,workspaces:e.workspaces??[],selectedWorkspace:e.selectedWorkspace??null,searchQuery:e.workspacesSearchQuery??"",itemSearchQuery:e.workspaceItemSearchQuery??"",expandedFolders:e.workspaceExpandedFolders??new Set,loading:e.workspacesLoading??!1,createLoading:e.workspacesCreateLoading??!1,error:e.workspacesError??null,onSearch:d=>e.workspacesSearchQuery=d,onItemSearch:d=>e.workspaceItemSearchQuery=d,onCreateWorkspace:async d=>{e.workspacesCreateLoading=!0;try{const{createWorkspace:g,selectWorkspace:S}=await E(async()=>{const{createWorkspace:T,selectWorkspace:x}=await Promise.resolve().then(()=>he);return{createWorkspace:T,selectWorkspace:x}},void 0,import.meta.url),A=await g(e,d);return A?(e.workspaceItemSearchQuery="",await S(e,A),e.showToast(`Created workspace: ${A.name}`,"success"),!0):(e.showToast("Failed to create workspace","error"),!1)}finally{e.workspacesCreateLoading=!1}},onDeleteWorkspace:async d=>{const{deleteWorkspace:g,loadAllTasksWithQueueStatus:S}=await E(async()=>{const{deleteWorkspace:T,loadAllTasksWithQueueStatus:x}=await Promise.resolve().then(()=>he);return{deleteWorkspace:T,loadAllTasksWithQueueStatus:x}},void 0,import.meta.url);if(!await g(e,d.id)){e.showToast(`Failed to delete ${d.name}`,"error");return}e.showToast(`Deleted workspace: ${d.name}`,"success"),e.allTasks=await S(e)},onSelectWorkspace:async d=>{e.workspaceItemSearchQuery="";const{selectWorkspace:g}=await E(async()=>{const{selectWorkspace:S}=await Promise.resolve().then(()=>he);return{selectWorkspace:S}},void 0,import.meta.url);await g(e,d)},onBack:()=>{e.selectedWorkspace=null,e.workspaceItemSearchQuery=""},onItemClick:async d=>{const{readWorkspaceFile:g}=await E(async()=>{const{readWorkspaceFile:T}=await Promise.resolve().then(()=>he);return{readWorkspaceFile:T}},void 0,import.meta.url),S=e.selectedWorkspace?.id,A=await g(e,d.path,S);if(!A){e.showToast(`Failed to open ${d.name}`,"error");return}e.handleOpenSidebar(A.content,{mimeType:A.mime,filePath:d.path,title:d.name})},onSessionClick:async d=>{if(!d.key)return;const g=d.key;$e(e),e.sessionKey=g,Pe(e,g),e.chatLoading=!0,e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll();const S=e.settings.openTabs.includes(g)?e.settings.openTabs:[...e.settings.openTabs,g];e.applySettings({...e.settings,openTabs:S,sessionKey:g,lastActiveSessionKey:g,tabLastViewed:{...e.settings.tabLastViewed,[g]:Date.now()}}),e.setTab("chat"),e.loadAssistantIdentity(),ye(e,g,!0),se(e)},onPinToggle:async(d,g,S)=>{const{toggleWorkspacePin:A}=await E(async()=>{const{toggleWorkspacePin:x}=await Promise.resolve().then(()=>he);return{toggleWorkspacePin:x}},void 0,import.meta.url);await A(e,d,g,S)||e.showToast("Failed to update pin","error")},onPinSessionToggle:async(d,g,S)=>{const{toggleWorkspaceSessionPin:A}=await E(async()=>{const{toggleWorkspaceSessionPin:x}=await Promise.resolve().then(()=>he);return{toggleWorkspaceSessionPin:x}},void 0,import.meta.url);await A(e,d,g,S)||e.showToast("Failed to update session pin","error")},onToggleFolder:d=>{E(async()=>{const{toggleWorkspaceFolder:g}=await Promise.resolve().then(()=>he);return{toggleWorkspaceFolder:g}},void 0,import.meta.url).then(({toggleWorkspaceFolder:g})=>{e.workspaceExpandedFolders=g(e.workspaceExpandedFolders??new Set,d),e.requestUpdate()})},onTeamSetup:async()=>{let d="I want to set up a Team Workspace so my team can collaborate. Please walk me through it step by step, keeping it simple.";try{const g=await e.client?.request("workspaces.teamSetupPrompt",{});g?.prompt&&(d=g.prompt)}catch{}e.handleStartChatWithPrompt(d)},allTasks:e.allTasks??[],taskFilter:e.taskFilter??"outstanding",taskSort:e.taskSort??"due",taskSearch:e.taskSearch??"",showCompletedTasks:e.showCompletedTasks??!1,onToggleTaskComplete:async(d,g)=>{const{toggleTaskComplete:S,loadAllTasksWithQueueStatus:A,getWorkspace:T}=await E(async()=>{const{toggleTaskComplete:_,loadAllTasksWithQueueStatus:L,getWorkspace:R}=await Promise.resolve().then(()=>he);return{toggleTaskComplete:_,loadAllTasksWithQueueStatus:L,getWorkspace:R}},void 0,import.meta.url);if(!await S(e,d,g)){e.showToast("Failed to update task","error");return}if(e.allTasks=await A(e),e.selectedWorkspace){const _=await T(e,e.selectedWorkspace.id);_&&(e.selectedWorkspace=_)}},onCreateTask:async(d,g)=>{const{createTask:S,loadAllTasksWithQueueStatus:A,getWorkspace:T}=await E(async()=>{const{createTask:_,loadAllTasksWithQueueStatus:L,getWorkspace:R}=await Promise.resolve().then(()=>he);return{createTask:_,loadAllTasksWithQueueStatus:L,getWorkspace:R}},void 0,import.meta.url),x=await S(e,d,g);if(!x){e.showToast("Failed to create task","error");return}if(e.showToast(`Task created: ${x.title}`,"success"),e.allTasks=await A(e),e.selectedWorkspace){const _=await T(e,e.selectedWorkspace.id);_&&(e.selectedWorkspace=_)}},onSetTaskFilter:d=>{e.taskFilter=d},onSetTaskSort:d=>{e.taskSort=d},onSetTaskSearch:d=>{e.taskSearch=d},onToggleCompletedTasks:()=>{e.showCompletedTasks=!(e.showCompletedTasks??!1)},editingTaskId:e.editingTaskId??null,workspaceNames:(e.workspaces??[]).map(d=>d.name),onStartTask:async d=>{const{startTask:g,loadAllTasksWithQueueStatus:S}=await E(async()=>{const{startTask:_,loadAllTasksWithQueueStatus:L}=await Promise.resolve().then(()=>he);return{startTask:_,loadAllTasksWithQueueStatus:L}},void 0,import.meta.url),A=await g(e,d);if(!A?.sessionId){e.showToast("Failed to open session for task","error");return}$e(e);const T=A.sessionId;A.task?.title&&be.set(T,A.task.title);const x=e.settings.openTabs.includes(T)?e.settings.openTabs:[...e.settings.openTabs,T];if(e.applySettings({...e.settings,openTabs:x,sessionKey:T,lastActiveSessionKey:T,tabLastViewed:{...e.settings.tabLastViewed,[T]:Date.now()}}),e.sessionKey=T,e.setTab("chat"),A.created&&!A.queueOutput){const _=e.allTasks??[],L=e.selectedWorkspace?.tasks??[],R=[..._,...L].find(Y=>Y.id===d),Z=R?.project?` (project: ${R.project})`:"";e.chatMessage=`Let's work on: ${R?.title??"this task"}${Z}`}else e.chatMessage="";e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.loadAssistantIdentity(),ye(e,T,!0),await se(e),A.queueOutput&&e.chatMessages.length===0&&e.seedSessionWithAgentOutput(A.task?.title??"this task",A.queueOutput,A.agentPrompt??void 0),e.allTasks=await S(e),e.requestUpdate()},onEditTask:d=>{e.editingTaskId=d},onUpdateTask:async(d,g)=>{const{updateTask:S,loadAllTasksWithQueueStatus:A,getWorkspace:T}=await E(async()=>{const{updateTask:_,loadAllTasksWithQueueStatus:L,getWorkspace:R}=await Promise.resolve().then(()=>he);return{updateTask:_,loadAllTasksWithQueueStatus:L,getWorkspace:R}},void 0,import.meta.url);if(!await S(e,d,g)){e.showToast("Failed to update task","error");return}if(e.editingTaskId=null,e.allTasks=await A(e),e.selectedWorkspace){const _=await T(e,e.selectedWorkspace.id);_&&(e.selectedWorkspace=_)}},browsePath:e.workspaceBrowsePath??null,browseEntries:e.workspaceBrowseEntries??null,breadcrumbs:e.workspaceBreadcrumbs??null,browseSearchQuery:e.workspaceBrowseSearchQuery??"",browseSearchResults:e.workspaceBrowseSearchResults??null,onBrowseFolder:d=>e.handleWorkspaceBrowse(d),onBrowseSearch:d=>e.handleWorkspaceBrowseSearch(d),onBrowseBack:()=>e.handleWorkspaceBrowseBack(),onCreateFolder:d=>e.handleWorkspaceCreateFolder(d),onBatchPushToDrive:d=>e.handleBatchPushToDrive(d)}):h}

        ${e.tab==="today"||e.tab==="my-day"?e.dynamicSlots.today?mc(e,"today"):l0({connected:e.connected,loading:e.myDayLoading??!1,error:e.myDayError??null,onRefresh:()=>e.handleMyDayRefresh(),dailyBrief:e.dailyBrief??null,dailyBriefLoading:e.dailyBriefLoading??!1,dailyBriefError:e.dailyBriefError??null,onBriefRefresh:()=>e.handleDailyBriefRefresh(),onBriefGenerate:()=>e.handleDailyBriefGenerate(),onBriefOpenInObsidian:()=>e.handleDailyBriefOpenInObsidian(),onBriefSave:d=>e.handleBriefSave(d),onBriefToggleCheckbox:(d,g)=>e.handleBriefToggleCheckbox(d,g),onOpenFile:d=>{e.handleOpenFile(d)},selectedDate:e.todaySelectedDate,onDatePrev:()=>e.handleDatePrev(),onDateNext:()=>e.handleDateNext(),onDateToday:()=>e.handleDateToday(),viewMode:e.todayViewMode??"brief",onViewModeChange:d=>e.handleTodayViewModeChange(d),agentLog:e.agentLog??null,agentLogLoading:e.agentLogLoading??!1,agentLogError:e.agentLogError??null,onAgentLogRefresh:()=>e.handleMyDayRefresh(),focusPulseActive:!1,onStartMorningSet:()=>e.handleFocusPulseStartMorning(),todayTasks:e.todayTasks??[],todayTasksLoading:e.todayTasksLoading??!1,onToggleTaskComplete:(d,g)=>e.handleMyDayTaskStatusChange(d,g==="complete"?"pending":"complete"),onStartTask:d=>e.handleTodayStartTask(d),onViewTaskOutput:d=>e.handleTodayViewTaskOutput(d),onCreateTask:d=>e.handleTodayCreateTask(d),onEditTask:d=>e.handleTodayEditTask(d),onUpdateTask:(d,g)=>e.handleTodayUpdateTask(d,g),editingTaskId:e.todayEditingTaskId,showCompletedTasks:e.todayShowCompleted,onToggleCompletedTasks:()=>e.handleTodayToggleCompleted(),decisionCards:(e.todayQueueResults??[]).length>0?{items:e.todayQueueResults,onApprove:d=>e.handleDecisionApprove(d),onReject:d=>e.handleDecisionReject(d),onDismiss:d=>e.handleDecisionDismiss(d),onViewOutput:(d,g)=>e.handleDecisionViewOutput(d,g),onOpenChat:d=>e.handleDecisionOpenChat(d),onMarkComplete:d=>e.handleDecisionMarkComplete(d),onRate:(d,g,S)=>e.handleDecisionRate(d,g,S),onFeedback:(d,g,S)=>e.handleDecisionFeedback(d,g,S)}:void 0,inboxItems:e.inboxItems??[],inboxLoading:e.inboxLoading??!1,inboxCount:e.inboxCount??0,inboxScoringId:e.inboxScoringId??null,inboxScoringValue:e.inboxScoringValue,inboxFeedbackText:e.inboxFeedbackText,onInboxViewOutput:d=>{e.handleInboxViewOutput(d)},onInboxOpenChat:d=>e.handleInboxOpenChat(d),onInboxDismiss:d=>{e.handleInboxDismiss(d)},onInboxScore:(d,g,S)=>{e.handleInboxScore(d,g,S)},onInboxSetScoring:(d,g)=>e.handleInboxSetScoring(d,g),onInboxFeedbackChange:d=>e.handleInboxFeedbackChange(d),onInboxMarkAll:()=>{e.handleInboxMarkAll()},onEveningCapture:()=>{e.setTab("chat"),e.handleSendChat(`Let's do my evening capture. Walk me through these:
1. What went well today?
2. What didn't get done?
3. What should tomorrow's brief prioritize?
4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.`)}}):h}

        ${e.tab==="work"?e.dynamicSlots.work?mc(e,"work"):z1({connected:e.connected,projects:e.workProjects??[],loading:e.workLoading??!1,error:e.workError??null,expandedProjects:e.workExpandedProjects,projectFiles:e.workProjectFiles??{},detailLoading:e.workDetailLoading??new Set,onRefresh:()=>e.handleWorkRefresh(),onToggleProject:d=>e.handleWorkToggleProject(d),onPersonClick:d=>e.handleWorkPersonClick(d),onFileClick:d=>e.handleWorkFileClick(d),onSkillClick:(d,g)=>e.handleWorkSkillClick(d,g),resources:e.workResources??[],resourcesLoading:e.workResourcesLoading??!1,resourceFilter:e.workResourceFilter??"all",onResourceFilterChange:d=>e.handleResourceFilterChange(d),onResourceClick:d=>e.handleResourceClick(d),onResourcePin:(d,g)=>e.handleResourcePin(d,g),onResourceDelete:d=>e.handleResourceDelete(d)}):h}

        ${e.tab==="channels"?Jw({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:d=>Me(e,d),onWhatsAppStart:d=>e.handleWhatsAppStart(d),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(d,g)=>Zt(e,d,g),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(d,g)=>e.handleNostrProfileEdit(d,g),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(d,g)=>e.handleNostrProfileFieldChange(d,g),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):h}

        ${e.tab==="instances"?S$({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>Eo(e)}):h}

        ${e.tab==="sessions"?H0({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,archivedSessions:e.archivedSessions,archivedSessionsLoading:e.archivedSessionsLoading,archivedSessionsExpanded:e.archivedSessionsExpanded,onFiltersChange:d=>{e.sessionsFilterActive=d.activeMinutes,e.sessionsFilterLimit=d.limit,e.sessionsIncludeGlobal=d.includeGlobal,e.sessionsIncludeUnknown=d.includeUnknown},onRefresh:()=>{te(e),Dt(e)},onPatch:async(d,g)=>{const S=await Rs(e,d,g);if(S.ok&&S.canonicalKey!==d&&e.settings.openTabs.includes(d)){const A=e.settings.openTabs.map(x=>x===d?S.canonicalKey:x),T=d===e.sessionKey;e.applySettings({...e.settings,openTabs:A,tabLastViewed:{...e.settings.tabLastViewed,[S.canonicalKey]:e.settings.tabLastViewed[d]??Date.now()},...T?{sessionKey:S.canonicalKey,lastActiveSessionKey:S.canonicalKey}:{}}),T&&(e.sessionKey=S.canonicalKey,ye(e,S.canonicalKey,!0))}},onDelete:d=>Vd(e,d),onArchive:d=>Hd(e,d),onUnarchive:d=>Gd(e,d),onToggleArchived:()=>{e.archivedSessionsExpanded=!e.archivedSessionsExpanded,e.archivedSessionsExpanded&&e.archivedSessions.length===0&&Dt(e)},onAutoArchive:()=>Qd(e)}):h}

        ${e.tab==="cron"?f$({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(d=>d.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:d=>e.cronForm={...e.cronForm,...d},onRefresh:()=>e.loadCron(),onAdd:()=>Ly(e),onToggle:(d,g)=>Py(e,d,g),onRun:d=>Iy(e,d),onRemove:d=>Dy(e,d),onLoadRuns:d=>pu(e,d)}):h}

        ${e.tab==="skills"?X0({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,subTab:e.skillsSubTab,godmodeSkills:e.godmodeSkills??null,godmodeSkillsLoading:e.godmodeSkillsLoading??!1,expandedSkills:e.expandedSkills??new Set,onFilterChange:d=>e.skillsFilter=d,onRefresh:()=>{os(e,{clearMessages:!0}),Ei(e)},onToggle:(d,g)=>tb(e,d,g),onEdit:(d,g)=>eb(e,d,g),onSaveKey:d=>nb(e,d),onInstall:(d,g,S)=>sb(e,d,g,S),onSubTabChange:d=>{e.skillsSubTab=d,d==="godmode"&&!e.godmodeSkills&&Ei(e),d==="clawhub"&&e.clawhubExploreItems},onToggleExpand:d=>{const g=new Set(e.expandedSkills);g.has(d)?g.delete(d):g.add(d),e.expandedSkills=g},clawhub:{loading:e.clawhubLoading,error:e.clawhubError,query:e.clawhubQuery,results:e.clawhubResults,exploreItems:e.clawhubExploreItems,exploreSort:e.clawhubExploreSort,detailSlug:e.clawhubDetailSlug,detail:e.clawhubDetail,importing:e.clawhubImporting,message:e.clawhubMessage,onSearch:d=>{e.clawhubQuery=d},onExplore:d=>void 0,onDetail:d=>void 0,onCloseDetail:()=>void 0,onImport:d=>kl(),onImportAndPersonalize:async d=>{if(!await kl())return;const S=await dw();S&&(Io(e,"chat"),fa(e),e.chatMessage=S)}}}):h}

        ${e.tab==="agents"?iS({loading:e.rosterLoading,error:e.rosterError,roster:e.rosterData??[],filter:e.rosterFilter??"",expandedAgents:e.expandedAgents??new Set,onFilterChange:d=>e.rosterFilter=d,onRefresh:()=>bd(e),onToggleExpand:d=>{const g=new Set(e.expandedAgents);g.has(d)?g.delete(d):g.add(d),e.expandedAgents=g}}):h}

        ${e.tab==="nodes"?c0({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>ia(e),onDevicesRefresh:()=>ht(e),onDeviceApprove:d=>bv(e,d),onDeviceReject:d=>wv(e,d),onDeviceRotate:(d,g,S)=>kv(e,{deviceId:d,role:g,scopes:S}),onDeviceRevoke:(d,g)=>$v(e,{deviceId:d,role:g}),onLoadConfig:()=>Xe(e),onLoadExecApprovals:()=>{const d=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Co(e,d)},onBindDefault:d=>{d?Zt(e,["tools","exec","node"],d):kr(e,["tools","exec","node"])},onBindAgent:(d,g)=>{const S=["agents","list",d,"tools","exec","node"];g?Zt(e,S,g):kr(e,S)},onSaveBindings:()=>Ms(e),onExecApprovalsTargetChange:(d,g)=>{e.execApprovalsTarget=d,e.execApprovalsTargetNodeId=g,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:d=>{e.execApprovalsSelectedAgent=d},onExecApprovalsPatch:(d,g)=>qy(e,d,g),onExecApprovalsRemove:d=>jy(e,d),onSaveExecApprovals:()=>{const d=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Wy(e,d)}}):h}

        ${t&&n>=2&&n<=5&&e.tab==="chat"?b2({phase:n,identity:s?.identity??null,tools:s?.tools??[],auditFindings:s?.audit?.findings??[],summary:s?.summary??null,onSkipPhase:()=>e.handleOnboardingSkipPhase?.()}):e.tab==="chat"&&e.workspaceNeedsSetup&&!e.chatMessages?.length&&!t?r`
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

        ${e.tab==="chat"&&e.settings.chatParallelView?C1({state:e,onAssignLane:(d,g)=>{const S=g?Te(e.sessionsResult?.sessions,g)?.key??g:null,A=[...e.settings.parallelLanes];A[d]=S,e.applySettings({...e.settings,parallelLanes:A}),S&&e.client&&uo(e.client,S).then(()=>{e.applySettings({...e.settings})})},onReorderLanes:(d,g)=>{if(d===g||d<0||g<0||d>=e.settings.parallelLanes.length||g>=e.settings.parallelLanes.length)return;const S=[...e.settings.parallelLanes],[A]=S.splice(d,1);S.splice(g,0,A),e.applySettings({...e.settings,parallelLanes:S})},onLaneViewed:d=>{const g=Te(e.sessionsResult?.sessions,d)?.key??d,S=Date.now(),T=Te(e.sessionsResult?.sessions,g)?.updatedAt??0,x=Math.max(e.settings.tabLastViewed[d]??0,e.settings.tabLastViewed[g]??0);T>0&&x>=T||e.applySettings({...e.settings,tabLastViewed:{...e.settings.tabLastViewed,[d]:S,[g]:S}})},onSendInLane:(d,g)=>{d!==e.sessionKey?($e(e),e.sessionKey=d,Pe(e,d),e.chatLoading=!0,e.chatMessages=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d}),e.loadAssistantIdentity(),ye(e,d,!0),se(e).then(()=>{e.chatMessage=g,e.handleSendChat(g)})):(e.chatMessage=g,e.handleSendChat(g))}}):h}

        ${e.tab==="chat"&&!e.settings.chatParallelView?jk({basePath:e.basePath,sessionKey:e.sessionKey,onSessionKeyChange:d=>{$e(e),e.sessionKey=d,Pe(e,d),e.chatLoading=!0,e.chatMessages=[],e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d}),e.loadAssistantIdentity(),se(e),Hs(e)},thinkingLevel:e.chatThinkingLevel,showThinking:p,loading:e.chatLoading,sending:e.chatSending,sendingSessionKey:e.chatSendingSessionKey,compactionStatus:e.compactionStatus,assistantAvatarUrl:v,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:l,error:e.lastError,sessions:e.sessionsResult,focusMode:u,onRefresh:()=>(e.resetToolStream(),Promise.all([se(e),Hs(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:d=>e.handleChatScroll(d),onDraftChange:d=>e.chatMessage=d,attachments:e.chatAttachments,onAttachmentsChange:d=>e.chatAttachments=d,showToast:(d,g)=>e.showToast(d,g),onSend:d=>e.handleSendChat(void 0,{queue:d}),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onCompact:()=>{e.handleCompactChat()},pendingRetry:e.pendingRetry,onRetry:()=>{e.handleRetryMessage()},onClearRetry:()=>e.handleClearRetry(),onQueueRemove:d=>e.removeQueuedMessage(d),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),onConsciousnessFlush:()=>{e.handleConsciousnessFlush()},consciousnessStatus:e.consciousnessStatus,sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,sidebarMimeType:e.sidebarMimeType,sidebarFilePath:e.sidebarFilePath,sidebarTitle:e.sidebarTitle,sidebarMode:e.sidebarMode,sidebarProofSlug:e.sidebarProofSlug,sidebarProofUrl:e.sidebarProofUrl,splitRatio:e.splitRatio,onOpenSidebar:(d,g)=>e.handleOpenSidebar(d,g),onMessageLinkClick:d=>e.handleOpenMessageFileLink(d),onCloseSidebar:()=>e.handleCloseSidebar(),onOpenProof:d=>{e.handleOpenProofDoc(d)},onOpenFile:d=>e.handleOpenFile(d),onSplitRatioChange:d=>e.handleSplitRatioChange(d),onPushToDrive:(d,g)=>e.handlePushToDrive(d,g),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker(),onImageClick:(d,g,S)=>e.handleImageClick(d,g,S),resolveImageUrl:(d,g)=>Vv(e.sessionKey,d,g),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,userName:e.userName,userAvatar:e.userAvatar,currentToolName:e.currentToolName,currentToolInfo:e.currentToolInfo,privateMode:e.chatPrivateMode,onTogglePrivateMode:()=>e.handlePrivateModeToggle(),isWorking:e.workingSessions.has(e.sessionKey),showScrollButton:!e.chatUserNearBottom,showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>{const d=document.querySelector(".chat-thread");d&&(d.scrollTo({top:d.scrollHeight,behavior:"smooth"}),e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1)},allyPanelOpen:e.allyPanelOpen??!1,allyProps:e.allyPanelOpen?{allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:!0,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:0,connected:e.connected,compact:!0,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:d=>e.handleAllyDraftChange(d),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:d=>e.handleAllyAttachmentsChange(d),onAction:(d,g,S,A)=>e.handleAllyAction(d,g,S,A)}:null}):h}

        ${e.tab==="options"?yS({connected:e.connected,loading:e.godmodeOptionsLoading,options:e.godmodeOptions,onToggle:(d,g)=>e.handleOptionToggle(d,g),onOpenWizard:e.handleWizardOpen?()=>e.handleWizardOpen?.():void 0}):h}

        ${e.tab==="guardrails"?l1({connected:e.connected,loading:e.guardrailsLoading,data:e.guardrailsData,showAddForm:e.guardrailsShowAddForm,onToggle:(d,g)=>e.handleGuardrailToggle(d,g),onThresholdChange:(d,g,S)=>e.handleGuardrailThresholdChange(d,g,S),onCustomToggle:(d,g)=>e.handleCustomGuardrailToggle(d,g),onCustomDelete:d=>e.handleCustomGuardrailDelete(d),onToggleAddForm:()=>e.handleToggleGuardrailAddForm(),onOpenAllyChat:d=>{e.handleAllyToggle(),d&&e.handleAllyDraftChange(d)}}):h}

        ${e.tab==="mission-control"?$1({connected:e.connected,loading:e.missionControlLoading,error:e.missionControlError,data:e.missionControlData??null,fullControl:e.missionControlFullControl,onToggleFullControl:()=>e.handleMissionControlToggleFullControl(),onRefresh:()=>e.handleMissionControlRefresh(),onCancelTask:d=>e.handleMissionControlCancelTask(d),onApproveItem:d=>e.handleMissionControlApproveItem(d),onRetryItem:d=>e.handleMissionControlRetryItem(d),onViewDetail:d=>e.handleMissionControlViewDetail(d),onOpenSession:d=>e.handleMissionControlOpenSession(d),onOpenTaskSession:d=>e.handleMissionControlOpenTaskSession(d),onStartQueueItem:d=>e.handleMissionControlStartQueueItem(d),onViewTaskFiles:d=>e.handleMissionControlViewTaskFiles(d),onAskAlly:()=>{e.handleAllyToggle(),e.handleAllyDraftChange("What should I focus on next?")},allyName:e.assistantName}):h}

        ${e.tab==="trust"?t1({connected:e.connected,loading:e.trustTrackerLoading,data:e.trustTrackerData,onAddWorkflow:d=>e.handleTrustAddWorkflow(d),onRemoveWorkflow:d=>e.handleTrustRemoveWorkflow(d),onRefresh:()=>e.handleTrustLoad(),guardrailsData:e.guardrailsData,consciousnessStatus:e.consciousnessStatus,sessionsCount:i,gatewayUptimeMs:e.hello?.snapshot?.uptimeMs??null,onDailyRate:(d,g)=>e.handleDailyRate(d,g),updateStatus:e.updateStatus?{openclawUpdateAvailable:e.updateStatus.openclawUpdateAvailable,pluginUpdateAvailable:e.updateStatus.pluginUpdateAvailable,openclawVersion:e.updateStatus.openclawVersion,pluginVersion:e.updateStatus.pluginVersion,openclawLatest:e.updateStatus.openclawLatest,pluginLatest:e.updateStatus.pluginLatest}:null}):h}

        ${e.tab==="second-brain"?X1({connected:e.connected,loading:e.secondBrainLoading??!1,error:e.secondBrainError??null,subtab:e.secondBrainSubtab??"identity",identity:e.secondBrainIdentity??null,memoryBank:e.secondBrainMemoryBank??null,aiPacket:e.secondBrainAiPacket??null,sourcesData:e.secondBrainSourcesData??null,selectedEntry:e.secondBrainSelectedEntry??null,searchQuery:e.secondBrainSearchQuery??"",syncing:e.secondBrainSyncing??!1,browsingFolder:e.secondBrainBrowsingFolder??null,folderEntries:e.secondBrainFolderEntries??null,folderName:e.secondBrainFolderName??null,onSubtabChange:d=>e.handleSecondBrainSubtabChange(d),onSelectEntry:d=>e.handleSecondBrainSelectEntry(d),onOpenInBrowser:d=>e.handleSecondBrainOpenInBrowser(d),onBrowseFolder:d=>e.handleSecondBrainBrowseFolder(d),onBack:()=>e.handleSecondBrainBack(),onSearch:d=>e.handleSecondBrainSearch(d),onSync:()=>e.handleSecondBrainSync(),onRefresh:()=>e.handleSecondBrainRefresh(),onOpenSidebar:(d,g)=>e.handleOpenSidebar(d,g),researchData:e.secondBrainResearchData??null,researchAddFormOpen:e.secondBrainResearchAddFormOpen??!1,researchAddForm:e.secondBrainResearchAddForm,researchCategories:e.secondBrainResearchCategories??[],onResearchAddFormToggle:()=>e.handleResearchAddFormToggle(),onResearchAddFormChange:(d,g)=>e.handleResearchAddFormChange(d,g),onResearchAddSubmit:()=>e.handleResearchAddSubmit(),onSaveViaChat:()=>e.handleResearchSaveViaChat(),communityResources:e.secondBrainCommunityResources??null,communityResourceAddFormOpen:e.secondBrainCommunityResourceAddFormOpen??!1,communityResourceAddForm:e.secondBrainCommunityResourceAddForm,onCommunityResourceAdd:()=>e.handleCommunityResourceAdd(),onCommunityResourceRemove:d=>e.handleCommunityResourceRemove(d),onCommunityResourceAddFormToggle:()=>e.handleCommunityResourceAddFormToggle(),onCommunityResourceAddFormChange:(d,g)=>e.handleCommunityResourceAddFormChange(d,g),onAddSource:()=>e.handleAddSource(),fileTree:e.secondBrainFileTree??null,fileTreeLoading:e.secondBrainFileTreeLoading??!1,fileSearchQuery:e.secondBrainFileSearchQuery??"",fileSearchResults:e.secondBrainFileSearchResults??null,onFileTreeRefresh:()=>e.handleSecondBrainFileTreeRefresh(),onFileSearch:d=>e.handleSecondBrainFileSearch(d),onFileSelect:d=>e.handleSecondBrainFileSelect(d),intelProps:(e.secondBrainSubtab??"identity")==="intel"?{insights:e.intelInsights??[],discoveries:e.intelDiscoveries??[],patterns:e.intelPatterns??null,status:e.intelStatus??null,loading:e.intelLoading??!1,error:e.intelError??null,onDismiss:d=>e.handleIntelDismiss(d),onAct:d=>e.handleIntelAct(d),onRefresh:()=>e.handleIntelRefresh()}:void 0,vaultHealth:e.secondBrainVaultHealth??null}):h}

        ${e.tab==="dashboards"?e.dynamicSlots.dashboards?r`<div class="dynamic-slot">${Ce(ad(e.dynamicSlots.dashboards))}</div>`:c2({connected:e.connected,loading:e.dashboardsLoading??!1,error:e.dashboardsError??null,dashboards:e.dashboardsList,activeDashboardId:e.activeDashboardId??null,activeDashboardHtml:e.activeDashboardHtml??null,activeDashboardManifest:e.activeDashboardManifest??null,isWorking:e.activeDashboardManifest?.sessionId?e.workingSessions.has(e.activeDashboardManifest.sessionId):!1,onSelectDashboard:d=>e.handleDashboardSelect(d),onDeleteDashboard:d=>e.handleDashboardDelete(d),onCreateViaChat:d=>e.handleDashboardCreateViaChat(d),onTogglePin:d=>e.handleDashboardTogglePin(d),categoryFilter:e.dashboardCategoryFilter??null,onCategoryFilter:d=>e.handleDashboardCategoryFilter(d),onBack:()=>e.handleDashboardBack(),onRefresh:()=>e.handleDashboardsRefresh(),onOpenSession:d=>e.handleDashboardOpenSession(d)}):h}

        ${e.tab==="config"?a$({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:d=>{e.configRaw=d},onFormModeChange:d=>e.configFormMode=d,onFormPatch:(d,g)=>Zt(e,d,g),onSearchChange:d=>e.configSearchQuery=d,onSectionChange:d=>{e.configActiveSection=d,e.configActiveSubsection=null},onSubsectionChange:d=>e.configActiveSubsection=d,onReload:()=>Xe(e),onSave:()=>Ms(e),onApply:()=>gh(e),onUpdate:()=>wr(e),userName:e.userName||"",userAvatar:e.userAvatar,onUserProfileUpdate:(d,g)=>e.handleUpdateUserProfile(d,g),onModelSwitch:(d,g)=>vh(e,d,g)}):h}

        ${e.tab==="debug"?y$({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:d=>e.debugCallMethod=d,onCallParamsChange:d=>e.debugCallParams=d,onRefresh:()=>oa(e),onCall:()=>hy(e)}):h}

        ${e.tab==="logs"?_$({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:d=>e.logsFilterText=d,onLevelToggle:(d,g)=>{e.logsLevelFilters={...e.logsLevelFilters,[d]:g}},onToggleAutoFollow:d=>e.logsAutoFollow=d,onRefresh:()=>ko(e,{reset:!0}),onExport:(d,g)=>e.exportLogs(d,g),onScroll:d=>e.handleLogsScroll(d)}):h}
      </main>
      ${e.tab!=="chat"?Sw({allyName:e.assistantName,allyAvatar:e.assistantAvatar??null,open:e.allyPanelOpen??!1,messages:e.allyMessages??[],stream:e.allyStream??null,draft:e.allyDraft??"",sending:e.allySending??!1,isWorking:e.allyWorking??!1,unreadCount:e.allyUnread??0,connected:e.connected,compact:!1,attachments:e.allyAttachments??[],onToggle:()=>e.handleAllyToggle(),onDraftChange:d=>e.handleAllyDraftChange(d),onSend:()=>e.handleAllySend(),onOpenFullChat:()=>e.handleAllyOpenFull(),onAttachmentsChange:d=>e.handleAllyAttachmentsChange(d),onAction:(d,g,S,A)=>e.handleAllyAction(d,g,S,A)}):h}
      ${w$(e)}
      ${k$(e)}
      ${$$(e)}
      ${e.sidebarOpen&&e.tab!=="chat"?r`
            <div class="global-document-viewer">
              <div class="global-document-viewer__overlay" @click=${()=>e.handleCloseSidebar()}></div>
              <div class="global-document-viewer__panel">
                ${e.sidebarMode==="proof"&&e.sidebarProofSlug?Ii({slug:e.sidebarProofSlug,title:e.sidebarTitle,viewUrl:e.sidebarProofUrl,filePath:e.sidebarFilePath,onClose:()=>e.handleCloseProofDoc(),onPushToDrive:(d,g)=>e.handlePushToDrive(d,g)}):Pi({content:e.sidebarContent??null,error:e.sidebarError??null,mimeType:e.sidebarMimeType??null,filePath:e.sidebarFilePath??null,title:e.sidebarTitle??null,onClose:()=>e.handleCloseSidebar(),onViewRawText:()=>{e.sidebarContent&&e.handleOpenSidebar(e.sidebarContent,{mimeType:"text/plain",filePath:e.sidebarFilePath,title:e.sidebarTitle})},onOpenFile:d=>e.handleOpenFile(d),onPushToDrive:(d,g)=>e.handlePushToDrive(d,g),driveAccounts:e.driveAccounts,showDrivePicker:e.showDrivePicker,driveUploading:e.driveUploading,onToggleDrivePicker:()=>e.handleToggleDrivePicker()})}
              </div>
            </div>
          `:h}
      ${gS({toasts:e.toasts,onDismiss:d=>e.dismissToast(d)})}
      ${hS(e.lightbox,{onClose:()=>e.handleLightboxClose(),onNav:d=>e.handleLightboxNav(d)})}
    </div>
  `}async function D2(e){}async function M2(e){}async function O2(e,t){}async function N2(e){}async function F2(e){}async function B2(e){}async function qo(e){if(!(!e.client||!e.connected)){e.trustTrackerLoading=!0;try{const[t,n]=await Promise.all([e.client.request("trust.dashboard",{}),e.client.request("trust.history",{limit:50})]);e.trustTrackerData={workflows:t.workflows,summaries:t.summaries,ratings:n.ratings,total:n.total,overallScore:t.overallScore,totalRatings:t.totalRatings,totalUses:t.totalUses,todayRating:t.todayRating??null,dailyAverage:t.dailyAverage??null,dailyStreak:t.dailyStreak??0,recentDaily:t.recentDaily??[]}}catch{e.trustTrackerData=null}finally{e.trustTrackerLoading=!1}}}async function Tp(e,t){if(!(!e.client||!e.connected))try{await e.client.request("trust.workflows.set",{workflows:t}),e.showToast("Workflows updated","success",2e3),await qo(e)}catch(n){e.showToast("Failed to update workflows","error"),console.error("[TrustTracker] setWorkflows error:",n)}}async function U2(e,t){const n=e.trustTrackerData?.workflows??[];if(n.length>=5){e.showToast("Maximum 5 workflows allowed","error");return}if(n.includes(t.trim())){e.showToast("Workflow already tracked","error");return}await Tp(e,[...n,t.trim()])}async function z2(e,t){const n=e.trustTrackerData?.workflows??[];await Tp(e,n.filter(s=>s!==t))}async function K2(e,t,n){if(!(!e.client||!e.connected))try{await e.client.request("trust.dailyRate",{rating:t,...n?{note:n}:{}}),e.showToast(`Rated ${t}/10 today`,"success",2e3),await qo(e)}catch(s){e.showToast("Failed to submit daily rating","error"),console.error("[TrustTracker] dailyRate error:",s)}}const W2=6e4,bc=15,wc=new Set;let Ps=null;async function kc(e){if(!(!e.client||!e.connected))try{const t=new Date,n=new Date(t.getTime()+bc*6e4+6e4),s=await e.client.request("calendar.events.range",{startDate:t.toISOString(),endDate:n.toISOString()});for(const a of s.events??[]){if(wc.has(a.id))continue;const i=new Date(a.startTime),o=Math.round((i.getTime()-t.getTime())/6e4);if(o>0&&o<=bc){wc.add(a.id);const l=i.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),c=a.location?` @ ${a.location}`:"",u=`${a.title} starts in ${o} min (${l})${c}`;e.showToast(u,"warning",0)}}}catch(t){console.warn("[MeetingNotify] Poll error:",t)}}function q2(e){_p(),kc(e),Ps=setInterval(()=>{kc(e)},W2)}function _p(){Ps&&(clearInterval(Ps),Ps=null)}let j2=0;function V2(e,t="info",n=3e3,s){return{id:`toast-${Date.now()}-${j2++}`,message:e,type:t,duration:n,createdAt:Date.now(),action:s}}function H2(e,t){return e.filter(n=>n.id!==t)}function G2(e,t){return[...e,t]}var Q2=Object.defineProperty,Y2=Object.getOwnPropertyDescriptor,b=(e,t,n,s)=>{for(var a=s>1?void 0:s?Y2(t,n):t,i=e.length-1,o;i>=0;i--)(o=e[i])&&(a=(s?o(t,n,a):o(a))||a);return s&&a&&Q2(t,n,a),a};function ri(){return Bm()}function As(){return zm()}function J2(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}function X2(e,t){let n=e.trim();if(!n)return null;if(n.startsWith("Read HEARTBEAT.md")||n.startsWith("Read CONSCIOUSNESS.md")||/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(n)||n==="NO_REPLY"||n.startsWith(`NO_REPLY
`)||/^#\s*(?:🧠|\w+ Consciousness)/i.test(n)||n.startsWith("# WORKING.md")||n.startsWith("# MISTAKES.md"))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/(?:VERIFIED|FIXED|NEW):\s/.test(n)&&/✅|🟡|☑/.test(n)&&n.length>300)return console.debug("[Ally] Filtered message (verification dump):",t,n.substring(0,100)),null;if(/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(n))return console.debug("[Ally] Filtered message (system block):",t,n.substring(0,100)),null;if(/^\[GodMode Context:[^\]]*\]\s*$/.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(n=n.replace(/^(?:HEARTBEAT_OK|CONSCIOUSNESS_OK)\s*/i,"").trim(),n=n.replace(/^Deep work window is yours\.\s*/i,"").trim(),!n)return null;if(/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(n)&&n.length>200||/^##\s*Your Team\s*\(Agent Roster\)/i.test(n)&&n.indexOf(`

## `)===-1)return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;if(/^##?\s*Persistence Protocol/i.test(n)||/^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(n)||/^##?\s*Core (?:Behaviors|Principles)/i.test(n)||/^##?\s*Your Role as \w+/i.test(n))return console.debug("[Ally] Filtered message (persona leak):",t,n.substring(0,100)),null;const s=n.toLowerCase();if(["persistence protocol","core principles:","core behaviors","your role as ","be diligent first time","exhaust reasonable options","assume capability exists","elite executive assistant","consciousness context","working context","enforcement:","internal system context injected by godmode"].filter(o=>s.includes(o)).length>=2)return console.debug("[Ally] Filtered message (multi-signal system leak):",t,n.substring(0,100)),null;if(/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(n))return console.debug("[Ally] Filtered message:",t,n.substring(0,100)),null;const i=n.match(/\b[\w.-]+\.(?:json\b|db\b|html\b|log\b|flag\b|jsonl\b|bak\b|css\b|js\b|ts\b|md\b|txt\b)/gi);return i&&i.length>=8&&i.join(" ").length>n.length*.4?(console.debug("[Ally] Filtered message (file listing dump):",t,n.substring(0,100)),null):n}const $c=new Set(["chat","today","workspaces","work","data","overview","channels","instances","sessions","cron","skills","nodes","config","debug","logs","my-day"]),Z2=["path","filePath","file","workspacePath"];let y=class extends nn{constructor(){super(...arguments),this.settings=Pb(),this.password="",this.tab="chat",this.onboarding=J2(),this.connected=!1,this.reconnecting=!1,this.reconnectAttempt=0,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.sessionPickerClickOutsideHandler=null,this.sessionSearchClickOutsideHandler=null,this.assistantName=ri().name,this.assistantAvatar=ri().avatar,this.assistantAgentId=ri().agentId??null,this.userName=As().name,this.userAvatar=As().avatar,this.sessionKey=this.settings.sessionKey,this.sessionPickerOpen=!1,this.sessionPickerPosition=null,this.sessionPickerSearch="",this.sessionSearchOpen=!1,this.sessionSearchPosition=null,this.sessionSearchQuery="",this.sessionSearchResults=[],this.sessionSearchLoading=!1,this.profilePopoverOpen=!1,this.profileEditName="",this.profileEditAvatar="",this.editingTabKey=null,this.chatLoading=!1,this.chatSending=!1,this.chatSendingSessionKey=null,this.chatMessage="",this.chatDrafts={},this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.currentToolName=null,this.currentToolInfo=null,this.workingSessions=new Set,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.pendingRetry=null,this.autoRetryAfterCompact=!1,this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.splitRatio=this.settings.splitRatio,this.lightbox=fp(),this.driveAccounts=[],this.showDrivePicker=!1,this.driveUploading=!1,this.updateStatus=null,this.updateLoading=!1,this.updateError=null,this.updateLastChecked=null,this.updatePollInterval=null,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.gatewayRestartPending=!1,this.gatewayRestartBusy=!1,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.archivedSessions=[],this.archivedSessionsLoading=!1,this.archivedSessionsExpanded=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...Gb},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.workspaceNeedsSetup=!1,this.onboardingPhase=0,this.onboardingData=null,this.onboardingActive=!1,this.wizardActive=!1,this.wizardState=null,this.showSetupTab=!1,this.setupCapabilities=null,this.setupCapabilitiesLoading=!1,this.setupQuickDone=!1,this.onboardingIntegrations=null,this.onboardingCoreProgress=null,this.onboardingExpandedCard=null,this.onboardingLoadingGuide=null,this.onboardingActiveGuide=null,this.onboardingTestingId=null,this.onboardingTestResult=null,this.onboardingConfigValues={},this.onboardingProgress=null,this.selectedWorkspace=null,this.workspacesSearchQuery="",this.workspaceItemSearchQuery="",this.workspacesLoading=!1,this.workspacesCreateLoading=!1,this.workspacesError=null,this.workspaceExpandedFolders=new Set,this.editingTaskId=null,this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null,this.myDayLoading=!1,this.myDayError=null,this.todaySelectedDate=ce(),this.todayViewMode="brief",this.dailyBriefLoading=!1,this.dailyBriefError=null,this.agentLogLoading=!1,this.agentLogError=null,this.briefNotes={},this.todayTasks=[],this.todayTasksLoading=!1,this.todayEditingTaskId=null,this.todayShowCompleted=!1,this.allyPanelOpen=!1,this.allyMessages=[],this.allyStream=null,this.allyDraft="",this.allyUnread=0,this.allySending=!1,this.allyWorking=!1,this.allyAttachments=[],this.todayQueueResults=[],this.inboxItems=[],this.inboxLoading=!1,this.inboxCount=0,this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,this.chatPrivateMode=!1,this.privateSessions=new Map,this._privateSessionTimer=null,this.dynamicSlots={},this.workLoading=!1,this.workError=null,this.workExpandedProjects=new Set,this.workProjectFiles={},this.workDetailLoading=new Set,this.workResourcesLoading=!1,this.workResourceFilter="all",this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.skillsSubTab="godmode",this.godmodeSkills=null,this.godmodeSkillsLoading=!1,this.expandedSkills=new Set,this.rosterData=[],this.rosterLoading=!1,this.rosterError=null,this.rosterFilter="",this.expandedAgents=new Set,this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...Hb},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.toasts=[],this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatIsAutoScrolling=!1,this.chatNewMessagesBelow=!1,this.consciousnessStatus="idle",this.focusPulseData=null,this.trustTrackerData=null,this.trustTrackerLoading=!1,this.guardrailsData=null,this.guardrailsLoading=!1,this.guardrailsShowAddForm=!1,this.missionControlData=null,this.missionControlLoading=!1,this.missionControlError=null,this.missionControlFullControl=(()=>{try{return localStorage.getItem("godmode.mc.fullControl")==="1"}catch{return!0}})(),this.missionControlPollInterval=null,this.godmodeOptions=null,this.godmodeOptionsLoading=!1,this.dashboardsLoading=!1,this.dashboardsError=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardPreviousSessionKey=null,this.dashboardChatOpen=!1,this.dashboardCategoryFilter=null,this.secondBrainSubtab="identity",this.secondBrainLoading=!1,this.secondBrainError=null,this.secondBrainIdentity=null,this.secondBrainMemoryBank=null,this.secondBrainAiPacket=null,this.secondBrainSourcesData=null,this.secondBrainResearchData=null,this.secondBrainResearchAddFormOpen=!1,this.secondBrainResearchAddForm={title:"",url:"",category:"",tags:"",notes:""},this.secondBrainResearchCategories=[],this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainSyncing=!1,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,this.secondBrainFileTree=null,this.secondBrainFileTreeLoading=!1,this.secondBrainFileSearchQuery="",this.secondBrainFileSearchResults=null,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=!1,this.basePath="",this.popStateHandler=()=>Lu(this),this.keydownHandler=()=>{},this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null}createRenderRoot(){return this}connectedCallback(){if(super.connectedCallback(),this.settings.userName)this.userName=this.settings.userName;else{const t=As();this.userName=t.name}if(this.settings.userAvatar)this.userAvatar=this.settings.userAvatar;else{const t=As();this.userAvatar=t.avatar}Uu(this);const e=ce();this.todaySelectedDate!==e&&(this.todaySelectedDate=e),q2(this),this._restorePrivateSessions()}firstUpdated(){zu(this)}disconnectedCallback(){_p(),this._stopPrivateSessionTimer(),Ku(this),super.disconnectedCallback()}updated(e){Wu(this,e)}connect(){wo(this)}handleChatScroll(e){Dh(this,e)}handleLogsScroll(e){Mh(this,e)}exportLogs(e,t){Oh(e,t)}resetToolStream(){Hi(this)}resetChatScroll(){Nc(this)}async loadAssistantIdentity(){await $d(this)}applySettings(e){Ze(this,e)}setTab(e){Io(this,e)}setTheme(e,t){xu(this,e,t)}async loadOverview(){await Oo(this)}async loadCron(){await pa(this)}async handleAbortChat(){await No(this)}async handleConsciousnessFlush(){if(!(!this.client||this.consciousnessStatus==="loading")){this.consciousnessStatus="loading";try{await this.client.request("godmode.consciousness.flush",{}),this.consciousnessStatus="ok"}catch{this.consciousnessStatus="error"}setTimeout(()=>{this.consciousnessStatus!=="loading"&&(this.consciousnessStatus="idle")},3e3)}}async loadFocusPulse(){await D2()}async handleFocusPulseStartMorning(){await M2(),this.setTab("chat");const e="Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan.",{createNewSession:t}=await E(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>it);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e)}async handleFocusPulseSetFocus(e){await O2()}async handleFocusPulseComplete(){await N2()}async handleFocusPulsePulseCheck(){await F2()}async handleFocusPulseEndDay(){await B2()}async handleTrustLoad(){await qo(this)}async handleTrustAddWorkflow(e){await U2(this,e)}async handleTrustRemoveWorkflow(e){await z2(this,e)}async handleDailyRate(e,t){await K2(this,e,t)}async handleGuardrailsLoad(){const{loadGuardrails:e}=await E(async()=>{const{loadGuardrails:t}=await Promise.resolve().then(()=>Yt);return{loadGuardrails:t}},void 0,import.meta.url);await e(this)}async handleGuardrailToggle(e,t){const{toggleGuardrail:n}=await E(async()=>{const{toggleGuardrail:s}=await Promise.resolve().then(()=>Yt);return{toggleGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleGuardrailThresholdChange(e,t,n){const{updateGuardrailThreshold:s}=await E(async()=>{const{updateGuardrailThreshold:a}=await Promise.resolve().then(()=>Yt);return{updateGuardrailThreshold:a}},void 0,import.meta.url);await s(this,e,t,n)}async handleCustomGuardrailToggle(e,t){const{toggleCustomGuardrail:n}=await E(async()=>{const{toggleCustomGuardrail:s}=await Promise.resolve().then(()=>Yt);return{toggleCustomGuardrail:s}},void 0,import.meta.url);await n(this,e,t)}async handleCustomGuardrailDelete(e){const{deleteCustomGuardrail:t}=await E(async()=>{const{deleteCustomGuardrail:n}=await Promise.resolve().then(()=>Yt);return{deleteCustomGuardrail:n}},void 0,import.meta.url);await t(this,e)}async handleCustomGuardrailAdd(e){const{addCustomGuardrailFromUI:t}=await E(async()=>{const{addCustomGuardrailFromUI:n}=await Promise.resolve().then(()=>Yt);return{addCustomGuardrailFromUI:n}},void 0,import.meta.url);await t(this,e),this.guardrailsShowAddForm=!1}handleToggleGuardrailAddForm(){this.guardrailsShowAddForm=!this.guardrailsShowAddForm}handleMissionControlToggleFullControl(){this.missionControlFullControl=!this.missionControlFullControl;try{localStorage.setItem("godmode.mc.fullControl",this.missionControlFullControl?"1":"0")}catch{}}async handleMissionControlRefresh(){const{loadMissionControl:e}=await E(async()=>{const{loadMissionControl:t}=await Promise.resolve().then(()=>Qt);return{loadMissionControl:t}},void 0,import.meta.url);await e(this)}async handleMissionControlCancelTask(e){const{cancelCodingTask:t}=await E(async()=>{const{cancelCodingTask:n}=await Promise.resolve().then(()=>Qt);return{cancelCodingTask:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlApproveItem(e){const{approveCodingTask:t,approveQueueItem:n}=await E(async()=>{const{approveCodingTask:a,approveQueueItem:i}=await Promise.resolve().then(()=>Qt);return{approveCodingTask:a,approveQueueItem:i}},void 0,import.meta.url);await t(this,e)||await n(this,e)}async handleMissionControlRetryItem(e){const{retryQueueItem:t}=await E(async()=>{const{retryQueueItem:n}=await Promise.resolve().then(()=>Qt);return{retryQueueItem:n}},void 0,import.meta.url);await t(this,e)}async handleMissionControlViewDetail(e){const{loadAgentDetail:t}=await E(async()=>{const{loadAgentDetail:s}=await Promise.resolve().then(()=>Qt);return{loadAgentDetail:s}},void 0,import.meta.url),n=await t(this,e);this.handleOpenSidebar(n.content,{mimeType:n.mimeType,title:n.title})}async handleMissionControlOpenSession(e){const t=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:t,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:n}=await E(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>Ye);return{loadChatHistory:s}},void 0,import.meta.url);await n(this)}async handleMissionControlOpenTaskSession(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e});if(t?.sessionId){if(t.task?.title){const{autoTitleCache:n}=await E(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>Rn);return{autoTitleCache:s}},void 0,import.meta.url);n.set(t.sessionId,t.task.title)}await this.handleMissionControlOpenSession(t.sessionId),t.queueOutput&&this.chatMessages.length===0&&await this.seedSessionWithAgentOutput(t.task?.title??"task",t.queueOutput,t.agentPrompt??void 0)}}catch(t){console.error("[MissionControl] Failed to open task session:",t),this.showToast("Failed to open session","error")}}async handleMissionControlStartQueueItem(e){await this.handleMissionControlOpenTaskSession(e)}async handleMissionControlViewTaskFiles(e){try{const n=(await this.client?.request("queue.taskFiles",{itemId:e}))?.files??[];if(n.length===0){this.showToast("No files found for this task","info");return}const a=`## Task Files

${n.map(i=>`- **${i.name}** (${i.type}, ${(i.size/1024).toFixed(1)} KB)
  \`${i.path}\``).join(`

`)}`;this.handleOpenSidebar(a,{title:"Task Files"})}catch(t){console.error("Failed to load task files:",t),this.showToast("Failed to load task files","error")}}async handleAllyAction(e,t,n,s){if(e==="navigate"&&t)this.setTab(t);else if(e==="rpc"&&n&&this.client)try{await this.client.request(n,s??{}),this.showToast("Done","success",2e3)}catch(a){console.error("[Ally] Action RPC failed:",a),this.showToast("Action failed","error")}}handleAllyToggle(){this.allyPanelOpen=!this.allyPanelOpen,this.allyPanelOpen&&(this.allyUnread=0,this._loadAllyHistory().then(()=>{this._scrollAllyToBottom(),requestAnimationFrame(()=>this._scrollAllyToBottom())}))}handleAllyDraftChange(e){this.allyDraft=e}handleAllyAttachmentsChange(e){this.allyAttachments=e}async handleAllySend(){const e=this.allyDraft.trim(),t=this.allyAttachments;if(!e&&t.length===0||this.allySending)return;const n=Wh(this);let s=e?`${n}

${e}`:n;this.allyDraft="",this.allyAttachments=[],this.allySending=!0,this.allyMessages=[...this.allyMessages,{role:"user",content:e||"(image)",timestamp:Date.now()}];try{let a;if(t.length>0){const c=[];for(const u of t){if(!u.dataUrl)continue;const p=u.dataUrl.match(/^data:([^;]+);base64,(.+)$/);if(!p)continue;const[,f,v]=p;f.startsWith("image/")&&c.push({type:"image",mimeType:f,content:v,fileName:u.fileName})}if(c.length>0){a=c;try{await this.client?.request("images.cache",{images:c.map(u=>({data:u.content,mimeType:u.mimeType,fileName:u.fileName})),sessionKey:Q})}catch{}}}const i=`ally-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;try{await this.client?.request("sessions.patch",{key:Q,lastChannel:"webchat"})}catch{}await this.client?.request("agent",{sessionKey:Q,message:s,deliver:!1,channel:"webchat",idempotencyKey:i,attachments:a}),this.allyWorking=!0;const o=this.allyMessages[this.allyMessages.length-1]?.content,l=setInterval(async()=>{if(!this.allyWorking){clearInterval(l);return}try{await this._loadAllyHistory();const c=this.allyMessages[this.allyMessages.length-1];c&&c.role==="assistant"&&c.content!==o&&(this.allyWorking=!1,this.allyStream=null,clearInterval(l),this._scrollAllyToBottom())}catch{}},5e3);setTimeout(()=>clearInterval(l),12e4)}catch(a){const i=a instanceof Error?a.message:String(a);console.error("[Ally] Failed to send ally message:",i),this.allyMessages=[...this.allyMessages,{role:"assistant",content:`*Send failed: ${i}*`,timestamp:Date.now()}]}finally{this.allySending=!1}}handleAllyOpenFull(){this.allyPanelOpen=!1,this.setTab("chat"),this.applySettings({...this.settings,sessionKey:Q,lastActiveSessionKey:Q,tabLastViewed:{...this.settings.tabLastViewed,[Q]:Date.now()}}),this.sessionKey=Q,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),E(async()=>{const{loadChatHistory:e}=await Promise.resolve().then(()=>Ye);return{loadChatHistory:e}},void 0,import.meta.url).then(({loadChatHistory:e})=>e(this))}_scrollAllyToBottom(){this.updateComplete.then(()=>{requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector?.(".ally-panel, .ally-inline")??document.querySelector(".ally-panel, .ally-inline");if(!e)return;const t=e.querySelector(".ally-panel__messages");t&&(t.scrollTop=t.scrollHeight)})})}async _loadAllyHistory(){try{const e=await this.client?.request("chat.history",{sessionKey:Q,limit:100});if(e?.messages){const{extractText:t,formatApiError:n}=await E(async()=>{const{extractText:a,formatApiError:i}=await Promise.resolve().then(()=>Yg);return{extractText:a,formatApiError:i}},void 0,import.meta.url);this.allyMessages=e.messages.map(a=>{const i=a.role??"assistant",o=i.toLowerCase();if(o==="tool"||o==="toolresult"||o==="tool_result"||o==="function"||o==="system")return null;const l=a;if(l.toolCallId||l.tool_call_id||l.toolName||l.tool_name)return null;if(Array.isArray(a.content)){const f=a.content;if(!f.some(m=>{const k=(typeof m.type=="string"?m.type:"").toLowerCase();return(k==="text"||k==="")&&typeof m.text=="string"&&m.text.trim().length>0})&&f.some(k=>{const d=(typeof k.type=="string"?k.type:"").toLowerCase();return d==="tool_use"||d==="tool_result"||d==="toolresult"||d==="tooluse"}))return null}let c=t(a);if(!c)return null;const u=n(c);if(u&&(c=u),c=c.replace(/^\[GodMode Context:[^\]]*\]\s*/i,"").trim(),!c)return null;const p=X2(c,i);return p?{role:o==="user"?"user":"assistant",content:p,timestamp:a.timestamp}:null}).filter(a=>a!==null);const s=[];for(const a of this.allyMessages){const i=s[s.length-1];i&&i.role===a.role&&i.content===a.content||s.push(a)}this.allyMessages=s}}catch{}}async handleDecisionApprove(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.approve",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Approve failed:",t),this.showToast("Failed to approve","error")}}async handleDecisionReject(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.reject",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Reject failed:",t),this.showToast("Failed to reject","error")}}async handleDecisionDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(t=>t.id!==e)}catch(t){console.error("[DecisionCard] Dismiss failed:",t),this.showToast("Failed to dismiss","error")}}async handleDecisionMarkComplete(e){if(!(!this.client||!this.connected))try{const t=this.todayQueueResults?.find(n=>n.id===e);t?.sourceTaskId&&await this.client.request("tasks.update",{id:t.sourceTaskId,status:"complete"}),await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(n=>n.id!==e),this.showToast("Task marked complete","success")}catch(t){console.error("[DecisionCard] Mark complete failed:",t),this.showToast("Failed to mark complete","error")}}async handleDecisionRate(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("trust.rate",{workflow:t,rating:n});const s=n<7;this.todayQueueResults=this.todayQueueResults.map(a=>a.id===e?{...a,userRating:n,feedbackPending:s}:a),s?this.showToast(`Rated ${t} ${n}/10 — what could be better?`,"info"):(this.todayQueueResults?.find(i=>i.id===e)?.source==="cron"&&(await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.filter(i=>i.id!==e)),this.showToast(`Rated ${t} ${n}/10`,"success"))}catch(s){console.error("[DecisionCard] Rate failed:",s),this.showToast("Failed to submit rating","error")}}async handleDecisionFeedback(e,t,n){if(!(!this.client||!this.connected))try{n&&(await this.client.request("trust.feedback",{workflow:t,feedback:n}),this.showToast(`Feedback saved for ${t} — will apply next time`,"success")),this.todayQueueResults?.find(a=>a.id===e)?.source==="cron"&&await this.client.request("queue.remove",{id:e}),this.todayQueueResults=this.todayQueueResults.map(a=>a.id===e?{...a,feedbackPending:!1}:a).filter(a=>!(a.id===e&&a.source==="cron"))}catch(s){console.error("[DecisionCard] Feedback failed:",s),this.showToast("Failed to save feedback","error")}}async handleDecisionViewOutput(e,t){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const n=await this.client.request("queue.readOutput",{path:t}),s=t.split("/").pop()??"Agent Output";this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t,title:s})}catch(n){console.error("[DecisionCard] View output failed:",n),this.handleOpenFile(t)}}async handleDecisionOpenChat(e){const t=this.todayQueueResults?.find(a=>a.id===e);if(!t)return;if(t.sourceTaskId){await this.handleMissionControlOpenTaskSession(t.sourceTaskId);return}const{createNewSession:n}=await E(async()=>{const{createNewSession:a}=await Promise.resolve().then(()=>it);return{createNewSession:a}},void 0,import.meta.url);n(this),this.setTab("chat");const{autoTitleCache:s}=await E(async()=>{const{autoTitleCache:a}=await Promise.resolve().then(()=>Rn);return{autoTitleCache:a}},void 0,import.meta.url);if(s.set(this.sessionKey,t.title),t.outputPath&&this.client&&this.connected)try{const a=await this.client.request("queue.readOutput",{path:t.outputPath});a?.content&&await this.seedSessionWithAgentOutput(t.title,a.content)}catch{await this.seedSessionWithAgentOutput(t.title,t.summary)}else t.summary&&await this.seedSessionWithAgentOutput(t.title,t.summary)}async handleTodayOpenChatToEdit(e){try{const t=this.todayQueueResults?.find(s=>s.id===e),n=t?.outputPath;if(n&&this.client&&this.connected)try{const s=await this.client.request("queue.readOutput",{path:n});this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n,title:t?.title??n.split("/").pop()??"Agent Output"})}catch{await this.handleOpenFile(n)}this.allyPanelOpen=!0,this.allyUnread=0,this.tab!=="chat"&&this.setTab("chat")}catch(t){console.error("Open chat to edit failed:",t)}}async seedSessionWithAgentOutput(e,t,n){if(!this.client||!this.connected)return;this.handleOpenSidebar(t,{title:`Agent Output: ${e}`,filePath:null,mimeType:null});const s=t.match(/## Summary\n([\s\S]*?)(?=\n## |$)/),a=s?s[1].trim().split(`
`).slice(0,3).join(`
`):"Output available in sidebar.",i=[`Agent completed **${e}**.`,"",a,"","Full output is in the sidebar. What would you like to do?"].join(`
`);try{const{sendChatMessage:o}=await E(async()=>{const{sendChatMessage:l}=await Promise.resolve().then(()=>Ye);return{sendChatMessage:l}},void 0,import.meta.url);await o(this,i)}catch(o){console.error("[Session] Failed to seed session with agent output:",o)}}async handleMissionControlAddToQueue(e,t){if(!(!this.client||!this.connected))try{await this.client.request("queue.add",{type:e,title:t,priority:"normal"}),this.showToast("Added to queue","success",2e3);const{loadMissionControl:n}=await E(async()=>{const{loadMissionControl:s}=await Promise.resolve().then(()=>Qt);return{loadMissionControl:s}},void 0,import.meta.url);await n(this)}catch{this.showToast("Failed to add to queue","error")}}async handleDashboardsRefresh(){const{loadDashboards:e}=await E(async()=>{const{loadDashboards:t}=await import("./dashboards-CrT3s0NG.js");return{loadDashboards:t}},[],import.meta.url);await e(this)}async handleDashboardSelect(e){const{loadDashboard:t}=await E(async()=>{const{loadDashboard:n}=await import("./dashboards-CrT3s0NG.js");return{loadDashboard:n}},[],import.meta.url);if(await t(this,e),this.client&&this.connected)try{const n=await this.client.request("dashboards.openSession",{dashboardId:e});if(n?.sessionId){this.dashboardPreviousSessionKey=this.sessionKey;const s=n.sessionId,{autoTitleCache:a}=await E(async()=>{const{autoTitleCache:l}=await Promise.resolve().then(()=>Rn);return{autoTitleCache:l}},void 0,import.meta.url);a.set(s,n.manifest.title),this.activeDashboardManifest&&(this.activeDashboardManifest={...this.activeDashboardManifest,sessionId:s});const{saveDraft:i}=await E(async()=>{const{saveDraft:l}=await Promise.resolve().then(()=>Ga);return{saveDraft:l}},void 0,import.meta.url);i(this),this.sessionKey=s,this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream();const{loadChatHistory:o}=await E(async()=>{const{loadChatHistory:l}=await Promise.resolve().then(()=>Ye);return{loadChatHistory:l}},void 0,import.meta.url);await o(this),this.dashboardChatOpen=!0}}catch(n){console.error("[Dashboards] Failed to init session on select:",n)}}async handleDashboardDelete(e){const{deleteDashboard:t}=await E(async()=>{const{deleteDashboard:n}=await import("./dashboards-CrT3s0NG.js");return{deleteDashboard:n}},[],import.meta.url);await t(this,e)}async handleDashboardTogglePin(e){const{toggleDashboardPin:t}=await E(async()=>{const{toggleDashboardPin:n}=await import("./dashboards-CrT3s0NG.js");return{toggleDashboardPin:n}},[],import.meta.url);await t(this,e)}async handleDashboardCreateViaChat(e){this.setTab("chat");const{createNewSession:t}=await E(async()=>{const{createNewSession:n}=await Promise.resolve().then(()=>it);return{createNewSession:n}},void 0,import.meta.url);t(this),this.handleSendChat(e??"I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more.")}handleDashboardCategoryFilter(e){this.dashboardCategoryFilter=e}handleDashboardBack(){if(this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1,this.dashboardPreviousSessionKey){const e=this.dashboardPreviousSessionKey;this.dashboardPreviousSessionKey=null,E(async()=>{const{saveDraft:t}=await Promise.resolve().then(()=>Ga);return{saveDraft:t}},void 0,import.meta.url).then(({saveDraft:t})=>{t(this),this.sessionKey=e,E(async()=>{const{loadChatHistory:n}=await Promise.resolve().then(()=>Ye);return{loadChatHistory:n}},void 0,import.meta.url).then(({loadChatHistory:n})=>{n(this)})})}}async handleDashboardOpenSession(e){const t=this.activeDashboardManifest?.sessionId;if(!t){this.showToast("No session for this dashboard","error");return}this.dashboardPreviousSessionKey=null,this.activeDashboardId=null,this.activeDashboardHtml=null,this.activeDashboardManifest=null,this.dashboardChatOpen=!1;const n=this.settings.openTabs.includes(t)?this.settings.openTabs:[...this.settings.openTabs,t];this.applySettings({...this.settings,openTabs:n,sessionKey:t,lastActiveSessionKey:t,tabLastViewed:{...this.settings.tabLastViewed,[t]:Date.now()}}),this.setTab("chat");const{syncUrlWithSessionKey:s}=await E(async()=>{const{syncUrlWithSessionKey:a}=await Promise.resolve().then(()=>Kb);return{syncUrlWithSessionKey:a}},void 0,import.meta.url);s(this,t,!0)}async handleOptionsLoad(){const{loadOptions:e}=await E(async()=>{const{loadOptions:t}=await import("./options-QuHclvvX.js");return{loadOptions:t}},[],import.meta.url);await e(this)}async handleOptionToggle(e,t){const{saveOption:n}=await E(async()=>{const{saveOption:s}=await import("./options-QuHclvvX.js");return{saveOption:s}},[],import.meta.url);await n(this,e,t)}async handleSecondBrainRefresh(){const{loadSecondBrain:e}=await E(async()=>{const{loadSecondBrain:t}=await import("./second-brain-ghSM5E6X.js");return{loadSecondBrain:t}},[],import.meta.url);await e(this)}handleSecondBrainSubtabChange(e){this.secondBrainSubtab=e,this.secondBrainLoading=!1,this.secondBrainSelectedEntry=null,this.secondBrainSearchQuery="",this.secondBrainError=null,this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null,e==="intel"?this.handleIntelLoad().catch(t=>{console.error("[Intel] Load after subtab change failed:",t),this.intelError=t instanceof Error?t.message:"Failed to load intel data"}):e==="files"?this.handleSecondBrainFileTreeRefresh().catch(t=>{console.error("[SecondBrain] File tree load after subtab change failed:",t)}):this.handleSecondBrainRefresh().catch(t=>{console.error("[SecondBrain] Refresh after subtab change failed:",t),this.secondBrainError=t instanceof Error?t.message:"Failed to load data",this.secondBrainLoading=!1})}async handleSecondBrainSelectEntry(e){if(e.endsWith(".html")||e.endsWith(".htm")){try{const s=await this.client.request("secondBrain.memoryBankEntry",{path:e});s?.content&&this.handleOpenSidebar(s.content,{mimeType:"text/html",filePath:e,title:s.name||e.split("/").pop()||"File"})}catch(s){console.error("[SecondBrain] Failed to open HTML file:",s)}return}const{loadSecondBrainEntry:n}=await E(async()=>{const{loadSecondBrainEntry:s}=await import("./second-brain-ghSM5E6X.js");return{loadSecondBrainEntry:s}},[],import.meta.url);await n(this,e)}async handleSecondBrainOpenInBrowser(e){try{if(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("/")){window.open(e,"_blank","noopener,noreferrer");return}const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=new Blob([t.content],{type:"text/html"}),s=URL.createObjectURL(n);window.open(s,"_blank","noopener,noreferrer")}}catch(t){console.error("[SecondBrain] Failed to open in browser:",t)}}async handleSecondBrainBrowseFolder(e){const{browseFolder:t}=await E(async()=>{const{browseFolder:n}=await import("./second-brain-ghSM5E6X.js");return{browseFolder:n}},[],import.meta.url);await t(this,e)}handleSecondBrainBack(){this.secondBrainSelectedEntry?this.secondBrainSelectedEntry=null:this.secondBrainBrowsingFolder&&(this.secondBrainBrowsingFolder=null,this.secondBrainFolderEntries=null,this.secondBrainFolderName=null)}handleSecondBrainSearch(e){this.secondBrainSearchQuery=e}async handleSecondBrainSync(){const{syncSecondBrain:e}=await E(async()=>{const{syncSecondBrain:t}=await import("./second-brain-ghSM5E6X.js");return{syncSecondBrain:t}},[],import.meta.url);await e(this)}async handleSecondBrainFileTreeRefresh(){if(!(!this.client||!this.connected)){this.secondBrainFileTreeLoading=!0;try{const e=await this.client.request("secondBrain.fileTree",{depth:4});this.secondBrainFileTree=e.tree??[]}catch(e){console.error("[SecondBrain] fileTree failed:",e)}finally{this.secondBrainFileTreeLoading=!1}}}handleSecondBrainFileSearch(e){if(this.secondBrainFileSearchQuery=e,!e.trim()){this.secondBrainFileSearchResults=null;return}this._doSecondBrainFileSearch(e)}async _doSecondBrainFileSearch(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.search",{query:e,limit:50});this.secondBrainFileSearchQuery===e&&(this.secondBrainFileSearchResults=t.results??[])}catch(t){console.error("[SecondBrain] search failed:",t)}}async handleSecondBrainFileSelect(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("secondBrain.memoryBankEntry",{path:e});if(t?.content){const n=e.endsWith(".html")||e.endsWith(".htm");this.handleOpenSidebar(t.content,{mimeType:n?"text/html":"text/markdown",filePath:e,title:t.name||e.split("/").pop()||"File"})}}catch(t){console.error("[SecondBrain] Failed to open file:",t),this.showToast("Failed to open file","error")}}handleResearchAddFormToggle(){this.secondBrainResearchAddFormOpen=!this.secondBrainResearchAddFormOpen,this.secondBrainResearchAddFormOpen&&(this.secondBrainResearchAddForm={title:"",url:"",category:"",tags:"",notes:""})}handleResearchAddFormChange(e,t){this.secondBrainResearchAddForm={...this.secondBrainResearchAddForm,[e]:t}}async handleResearchAddSubmit(){const{addResearch:e}=await E(async()=>{const{addResearch:t}=await import("./second-brain-ghSM5E6X.js");return{addResearch:t}},[],import.meta.url);await e(this)}async handleResearchSaveViaChat(){this.setTab("chat");const{createNewSession:e}=await E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>it);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save.")}async handleAddSource(){this.setTab("chat");const{createNewSession:e}=await E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>it);return{createNewSession:t}},void 0,import.meta.url);e(this),this.handleSendChat("I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect.")}async handleCommunityResourceAdd(){const{addCommunityResource:e}=await E(async()=>{const{addCommunityResource:t}=await import("./second-brain-ghSM5E6X.js");return{addCommunityResource:t}},[],import.meta.url);await e(this)}async handleCommunityResourceRemove(e){const{removeCommunityResource:t}=await E(async()=>{const{removeCommunityResource:n}=await import("./second-brain-ghSM5E6X.js");return{removeCommunityResource:n}},[],import.meta.url);await t(this,e)}handleCommunityResourceAddFormToggle(){this.secondBrainCommunityResourceAddFormOpen=!this.secondBrainCommunityResourceAddFormOpen,this.secondBrainCommunityResourceAddFormOpen&&(this.secondBrainCommunityResourceAddForm={url:"",label:"",description:"",tags:""})}handleCommunityResourceAddFormChange(e,t){this.secondBrainCommunityResourceAddForm={...this.secondBrainCommunityResourceAddForm,[e]:t}}removeQueuedMessage(e){Mu(this,e)}async handleSendChat(e,t){const n=this.sessionsResult?.sessions?.find(s=>s.key===this.sessionKey);if(n){const s=n.totalTokens??0,a=n.contextTokens??this.sessionsResult?.defaults?.contextTokens??2e5;if((a>0?s/a:0)>=.9&&!this.compactionStatus?.active){const o=(e??this.chatMessage).trim(),l=e==null?[...this.chatAttachments??[]]:[];if(o||l.length>0){this.pendingRetry={message:o,attachments:l,timestamp:Date.now()},this.autoRetryAfterCompact=!0,this.chatMessages=[...this.chatMessages,{role:"user",content:[{type:"text",text:o}],timestamp:Date.now()}],e==null&&(this.chatMessage="",this.chatAttachments=[]),this.showToast("Context near limit — auto-compacting...","info",3e3),this.handleCompactChat();return}}}await Ou(this,e,t)}handleToggleSessionPicker(){this.sessionPickerOpen=!this.sessionPickerOpen}handleToggleSessionSearch(e){if(!this.sessionSearchOpen&&e){const n=e.currentTarget.getBoundingClientRect();this.sessionSearchPosition={top:n.bottom+8,right:window.innerWidth-n.right}}this.sessionSearchOpen=!this.sessionSearchOpen,this.sessionSearchOpen||(this.sessionSearchQuery="",this.sessionSearchResults=[])}async handleSessionSearchQuery(e){if(this.sessionSearchQuery=e,!e.trim()){this.sessionSearchResults=[];return}if(this.client){this.sessionSearchLoading=!0;try{const t=await this.client.request("sessions.searchContent",{query:e.trim(),limit:20});this.sessionSearchResults=t.results}catch(t){console.error("Session search failed:",t),this.sessionSearchResults=[]}finally{this.sessionSearchLoading=!1}}}handleSelectSession(e){this.sessionPickerOpen=!1,this.sessionSearchOpen=!1,this.sessionSearchQuery="",this.sessionSearchResults=[]}async handleWhatsAppStart(e){await kh(this,e)}async handleWhatsAppWait(){await $h(this)}async handleWhatsAppLogout(){await Sh(this)}async handleChannelConfigSave(){await Ah(this)}async handleChannelConfigReload(){await xh(this)}async handleCompactChat(){if(!this.connected){this.showToast("Cannot compact: not connected","error");return}if(!this.sessionKey){this.showToast("Cannot compact: no active session","error");return}this.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null};try{await this.handleSendChat("/compact")}catch(e){this.compactionStatus=null,console.error("Compaction failed:",e),this.showToast("Compaction failed","error")}}injectCompactionSummary(e,t){const n={role:"system",content:e,timestamp:Date.now(),isCompactionSummary:!0,keptMessages:t};this.chatMessages=[n,...this.chatMessages]}async handleRetryMessage(){const e={client:this.client,connected:this.connected,sessionKey:this.sessionKey,chatLoading:this.chatLoading,chatMessages:this.chatMessages,chatThinkingLevel:this.chatThinkingLevel,chatSending:this.chatSending,chatSendingSessionKey:this.chatSendingSessionKey,chatMessage:this.chatMessage,chatAttachments:this.chatAttachments,chatRunId:this.chatRunId,chatStream:this.chatStream,chatStreamStartedAt:this.chatStreamStartedAt,lastError:this.lastError,pendingRetry:this.pendingRetry},t=await xd(e);this.chatSending=e.chatSending,this.chatSendingSessionKey=e.chatSendingSessionKey,this.chatRunId=e.chatRunId,this.chatStream=e.chatStream,this.chatStreamStartedAt=e.chatStreamStartedAt,this.lastError=e.lastError,this.pendingRetry=e.pendingRetry??null,this.chatMessages=e.chatMessages,t&&this.showToast("Message resent","success",2e3)}handleClearRetry(){this.pendingRetry=null}handleNostrProfileEdit(e,t){_h(this,e,t)}handleNostrProfileCancel(){Ch(this)}handleNostrProfileFieldChange(e,t){Eh(this,e,t)}async handleNostrProfileSave(){await Lh(this)}async handleNostrProfileImport(){await Ph(this)}handleNostrProfileToggleAdvanced(){Rh(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,Ze(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleGatewayRestartClick(){this.gatewayRestartPending=!0}async handleGatewayRestartConfirm(){if(!(!this.client||this.gatewayRestartBusy)){this.gatewayRestartBusy=!0;try{await this.client.request("godmode.gateway.restart")}catch{}finally{this.gatewayRestartBusy=!1,this.gatewayRestartPending=!1}}}handleGatewayRestartCancel(){this.gatewayRestartPending=!1}handleOpenSidebar(e,t={}){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarMimeType=t.mimeType?.trim()||null,this.sidebarFilePath=t.filePath?.trim()||null,this.sidebarTitle=t.title?.trim()||null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.showDrivePicker=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarMimeType=null,this.sidebarFilePath=null,this.sidebarTitle=null,this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.sidebarCloseTimer=null)},200)}async handleOpenFile(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("files.read",{path:e}),n=e.split(".").pop()?.toLowerCase()??"",s=t.contentType??t.mime??(n==="md"?"text/markdown":null),a=e.split("/").pop()??e;this.handleOpenSidebar(t.content,{mimeType:s,filePath:e,title:a}),t.truncated&&this.showToast(`Opened truncated file: ${e}`,"warning")}catch(t){console.error("[Chat] Failed to open file:",t),this.showToast(`Failed to open file: ${e}`,"error")}}async handleToggleDrivePicker(){if(this.showDrivePicker){this.showDrivePicker=!1;return}if(this.driveAccounts.length===0)try{const e=await this.client?.request("files.listDriveAccounts",{});this.driveAccounts=e?.accounts??[]}catch{this.driveAccounts=[]}this.showDrivePicker=!0}async handlePushToDrive(e,t){if(!this.driveUploading){if(this.showDrivePicker=!1,this._pendingBatchPaths&&this._pendingBatchPaths.length>0){const n=this._pendingBatchPaths;this._pendingBatchPaths=void 0,await this._executeBatchDrive(n,t);return}this.driveUploading=!0;try{const n={filePath:e};t&&(n.account=t);const s=await this.client?.request("files.pushToDrive",n),a=t?` to ${t.split("@")[0]}`:"",i=s?.message??`Uploaded${a} to Google Drive`,o=s?.driveUrl;this.showToast(i,"success",o?8e3:5e3,o?{label:"View in Drive",url:o}:void 0)}catch(n){console.error("Push to Drive failed:",n);const s=n instanceof Error?n.message:typeof n=="object"&&n!==null&&"message"in n?String(n.message):"Unknown error";s.includes("GOG_NOT_FOUND")||s.includes("gog CLI not found")?this.showToast("Google Drive not configured. Install gog CLI: npm install -g gog-cli, then run: gog auth add <email> --services drive","warning",1e4):s.includes("GOG_AUTH")||s.includes("auth")&&s.includes("expired")?this.showToast("Google Drive auth expired. Re-authenticate: gog auth add <email> --services drive","warning",8e3):this.showToast(`Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1}}}async handleBatchPushToDrive(e){if(this.driveUploading||e.length===0)return;if(!this.driveAccounts||this.driveAccounts.length===0)try{const n=await this.client?.request("files.listDriveAccounts");this.driveAccounts=n?.accounts??[]}catch{}if(this.driveAccounts&&this.driveAccounts.length>1){this._pendingBatchPaths=e,this.showDrivePicker=!0;return}const t=this.driveAccounts?.[0]?.email;await this._executeBatchDrive(e,t)}async _executeBatchDrive(e,t){this.driveUploading=!0,this.showToast(`Uploading ${e.length} files to Drive...`,"info",0);try{const n={filePaths:e};t&&(n.account=t);const s=await this.client?.request("files.batchPushToDrive",n);this.dismissAllToasts();const a=s?.results?.filter(o=>o.success).length??0,i=s?.results?.length??e.length;a===i?this.showToast(`Uploaded ${a} files to Google Drive`,"success",5e3):this.showToast(`Uploaded ${a}/${i} files (${i-a} failed)`,"warning",8e3)}catch(n){this.dismissAllToasts();const s=n instanceof Error?n.message:"Unknown error";this.showToast(`Batch Drive upload failed: ${s}`,"error",8e3)}finally{this.driveUploading=!1,this._pendingBatchPaths=void 0}}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}handleImageClick(e,t,n){this.lightbox=rS(e,t,n)}handleLightboxClose(){this.lightbox=lS()}handleLightboxNav(e){this.lightbox=cS(this.lightbox,e)}normalizeWorkspacePathCandidate(e,t={}){let n=e.trim();if(!n||n.startsWith("#"))return null;for(;n.startsWith("./");)n=n.slice(2);if(n=n.replaceAll("\\","/"),!t.allowAbsolute)for(;n.startsWith("/");)n=n.slice(1);return!n||n.includes("\0")?null:n}isAbsoluteFilesystemPath(e){return e.startsWith("/")||e.startsWith("~/")||/^[a-z]:[\\/]/i.test(e)}inferMimeTypeFromPath(e){if(!e)return null;const t=e.trim().toLowerCase();if(!t)return null;const n=t.split(".").pop()??"";return n?n==="md"||n==="markdown"||n==="mdx"?"text/markdown":n==="html"||n==="htm"?"text/html":n==="json"||n==="json5"?"application/json":n==="txt"||n==="text"||n==="log"?"text/plain":n==="svg"||n==="svgz"?"image/svg+xml":n==="avif"||n==="bmp"||n==="gif"||n==="heic"||n==="heif"||n==="jpeg"||n==="jpg"||n==="png"||n==="webp"?`image/${n==="jpg"?"jpeg":n}`:null:null}sidebarTitleForPath(e){const t=e.replaceAll("\\","/").trim();if(!t)return"Document";const n=t.split("/");return n[n.length-1]||t}async listWorkspaceIdsForPathResolution(){const e=[],t=new Set,n=s=>{if(typeof s!="string")return;const a=s.trim();!a||t.has(a)||(t.add(a),e.push(a))};n(this.selectedWorkspace?.id);for(const s of this.workspaces??[])n(s.id);if(e.length>0||!this.client||!this.connected)return e;try{const s=await this.client.request("workspaces.list",{});for(const a of s.workspaces??[])n(a.id)}catch{}return e}async openWorkspaceRelativeFileInViewer(e){if(!this.client||!this.connected)return!1;const t=await this.listWorkspaceIdsForPathResolution();for(const n of t)try{const s=await this.client.request("workspaces.readFile",{workspaceId:n,filePath:e});if(typeof s.content!="string")continue;return this.handleOpenSidebar(s.content,{mimeType:s.contentType??s.mime??this.inferMimeTypeFromPath(e),filePath:s.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}return!1}extractWorkspacePathCandidatesFromHref(e){const t=e.trim();if(!t)return[];const n=[],s=t.toLowerCase();if(s.startsWith("mailto:")||s.startsWith("tel:")||s.startsWith("javascript:")||s.startsWith("data:"))return[];if(t.startsWith("file://")){let u=t.slice(7);u.startsWith("/~/")&&(u="~"+u.slice(2));try{u=decodeURIComponent(u)}catch{}n.push(u);const p=[],f=new Set;for(const v of n){const m=this.normalizeWorkspacePathCandidate(v,{allowAbsolute:!0});!m||f.has(m)||(f.add(m),p.push(m))}return p}const a=/^[a-z][a-z0-9+.-]*:/i.test(t),i=/^[a-z]:[\\/]/i.test(t);(!a||i)&&n.push(t);let o=null;try{o=new URL(t,window.location.href)}catch{o=null}if(o&&/^https?:$/.test(o.protocol)&&o.origin===window.location.origin){for(const k of Z2){const d=o.searchParams.get(k);d&&n.push(d)}const p=(t.split("#")[0]??"").split("?")[0]??"";p.length>0&&!p.startsWith("/")&&!p.includes("://")&&n.push(p);let v=o.pathname;this.basePath&&v.startsWith(`${this.basePath}/`)?v=v.slice(this.basePath.length):this.basePath&&v===this.basePath&&(v="");const m=v.startsWith("/")?v.slice(1):v;if(m){n.push(m);const k=m.indexOf("/");if(k>0){const d=m.slice(0,k).toLowerCase();$c.has(d)&&n.push(m.slice(k+1))}}if(v.startsWith("/")&&m){const k=m.split("/")[0]?.toLowerCase()??"";$c.has(k)||n.push(v)}}const l=[],c=new Set;for(const u of n){let p=u;try{p=decodeURIComponent(u)}catch{}const f=this.normalizeWorkspacePathCandidate(p,{allowAbsolute:!0});!f||c.has(f)||(c.add(f),l.push(f))}return l}async openWorkspaceFileInViewer(e){if(!this.client||!this.connected)return!1;const t=this.isAbsoluteFilesystemPath(e);if(!t&&await this.openWorkspaceRelativeFileInViewer(e))return!0;try{const n=await this.client.request("workspaces.readFile",{path:e});if(typeof n.content=="string")return this.handleOpenSidebar(n.content,{mimeType:n.contentType??n.mime??this.inferMimeTypeFromPath(e),filePath:n.path??e,title:this.sidebarTitleForPath(e)}),!0}catch{}if(!t)return!1;try{const n=await this.client.request("files.read",{path:e,maxSize:1e6});return typeof n.content!="string"?!1:(this.handleOpenSidebar(n.content,{mimeType:this.inferMimeTypeFromPath(e),filePath:e,title:this.sidebarTitleForPath(e)}),!0)}catch{return!1}}async handleOpenMessageFileLink(e){const t=this.extractWorkspacePathCandidatesFromHref(e);if(t.length===0)return!1;for(const n of t)if(await this.openWorkspaceFileInViewer(n))return!0;return!1}showToast(e,t="info",n=5e3,s){const a=V2(e,t,n,s);this.toasts=G2(this.toasts,a),n>0&&window.setTimeout(()=>{this.dismissToast(a.id)},n)}dismissToast(e){this.toasts=H2(this.toasts,e)}dismissAllToasts(){this.toasts=[]}async handleMyDayRefresh(){await js(this),this._loadDecisionCards()}_loadDecisionCards(){E(()=>Promise.resolve().then(()=>Nn),void 0,import.meta.url).then(async e=>{this.todayQueueResults=await e.loadTodayQueueResults(this)}).catch(()=>{})}async loadTodayQueueResults(){this._loadDecisionCards()}async handleMyDayTaskStatusChange(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,status:t,completedAt:t==="complete"?new Date().toISOString():null});const{loadTodayTasksWithQueueStatus:n}=await E(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>Nn);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task status:",n)}}async handleTodayCreateTask(e){if(!(!this.client||!this.connected))try{await this.client.request("tasks.create",{title:e,dueDate:ce(),priority:"medium",source:"chat"});const{loadTodayTasksWithQueueStatus:t}=await E(async()=>{const{loadTodayTasksWithQueueStatus:n}=await Promise.resolve().then(()=>Nn);return{loadTodayTasksWithQueueStatus:n}},void 0,import.meta.url);await t(this)}catch(t){console.error("[MyDay] Failed to create task:",t),this.showToast("Failed to create task","error")}}handleTodayEditTask(e){this.todayEditingTaskId=e}async handleTodayUpdateTask(e,t){if(!(!this.client||!this.connected))try{await this.client.request("tasks.update",{id:e,...t}),this.todayEditingTaskId=null;const{loadTodayTasksWithQueueStatus:n}=await E(async()=>{const{loadTodayTasksWithQueueStatus:s}=await Promise.resolve().then(()=>Nn);return{loadTodayTasksWithQueueStatus:s}},void 0,import.meta.url);await n(this)}catch(n){console.error("[MyDay] Failed to update task:",n),this.showToast("Failed to update task","error")}}handleTodayToggleCompleted(){this.todayShowCompleted=!this.todayShowCompleted}async handleTodayViewTaskOutput(e){if(!(!this.client||!this.connected))try{const n=(await this.client.request("queue.list",{limit:100}))?.items?.find(i=>i.sourceTaskId===e);if(!n?.result?.outputPath){this.showToast("No output available for this task","info");return}const s=await this.client.request("queue.readOutput",{path:n.result.outputPath}),a=n.result.outputPath.split("/").pop()??"Agent Output";this.handleOpenSidebar(s.content,{mimeType:"text/markdown",filePath:n.result.outputPath,title:a})}catch(t){console.error("[Tasks] View output failed:",t),this.showToast("Failed to load agent output","error")}}async handleTodayStartTask(e){if(!(!this.client||!this.connected))try{const t=await this.client.request("tasks.openSession",{taskId:e}),n=t?.sessionId??t?.sessionKey;if(n){if(t.task?.title){const{autoTitleCache:i}=await E(async()=>{const{autoTitleCache:l}=await Promise.resolve().then(()=>Rn);return{autoTitleCache:l}},void 0,import.meta.url);i.set(n,t.task.title);const{hostPatchSession:o}=await E(async()=>{const{hostPatchSession:l}=await Promise.resolve().then(()=>iu);return{hostPatchSession:l}},void 0,import.meta.url);o(this.client,n,t.task.title)}this.setTab("chat"),this.sessionKey=n;const s=this.settings.openTabs.includes(n)?this.settings.openTabs:[...this.settings.openTabs,n];this.applySettings({...this.settings,sessionKey:n,lastActiveSessionKey:n,openTabs:s}),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity();const{loadChatHistory:a}=await E(async()=>{const{loadChatHistory:i}=await Promise.resolve().then(()=>Ye);return{loadChatHistory:i}},void 0,import.meta.url);await a(this),t.queueOutput&&this.chatMessages.length===0&&this.seedSessionWithAgentOutput(t.task?.title??"this task",t.queueOutput,t.agentPrompt??void 0),this.requestUpdate()}}catch(t){console.error("[MyDay] Failed to open session for task:",t),this.showToast("Failed to open session for task","error")}}handleDatePrev(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()-1),this.todaySelectedDate=ce(e),On(this)}handleDateNext(){const e=new Date(this.todaySelectedDate+"T12:00:00");e.setDate(e.getDate()+1);const t=ce(),n=ce(e);n>t||(this.todaySelectedDate=n,On(this))}handleDateToday(){this.todaySelectedDate=ce(),js(this)}async handleDailyBriefRefresh(){await On(this)}async handleDailyBriefGenerate(){if(!(!this.client||!this.connected)){this.dailyBriefLoading=!0;try{await this.client.request("dailyBrief.generate",{}),await On(this)}catch(e){this.dailyBriefError=e instanceof Error?e.message:"Failed to generate brief"}finally{this.dailyBriefLoading=!1}}}handleDailyBriefOpenInObsidian(){const e=this.dailyBrief?.date;vu(e)}async loadBriefNotes(){if(!this.client||!this.connected)return;const e=this.todaySelectedDate;try{const t=await this.client.request("briefNotes.get",{date:e});this.briefNotes=t.notes??{}}catch(t){console.error("[BriefNotes] Load error:",t),this.briefNotes={}}}async handleBriefNoteSave(e,t){if(!this.client||!this.connected)return;const n=this.todaySelectedDate;try{const s=await this.client.request("briefNotes.update",{date:n,section:e,text:t});this.briefNotes=s.notes??{}}catch(s){console.error("[BriefNotes] Save error:",s),this.showToast("Failed to save note","error")}}handleTodayViewModeChange(e){this.todayViewMode=e}handlePrivateModeToggle(){if(this.chatPrivateMode){const e=this.sessionKey;this.chatPrivateMode=!1,this._destroyPrivateSession(e),this.showToast("Private session destroyed","info",2e3);return}this.chatPrivateMode=!0,this.setTab("chat"),E(async()=>{const{createNewSession:e}=await Promise.resolve().then(()=>it);return{createNewSession:e}},void 0,import.meta.url).then(({createNewSession:e})=>{e(this);const t=Date.now()+1440*60*1e3;this.privateSessions=new Map(this.privateSessions).set(this.sessionKey,t),this._persistPrivateSessions(),this._startPrivateSessionTimer(),this.client&&this.connected&&this.client.request("session.setPrivate",{sessionKey:this.sessionKey,enabled:!0}).catch(()=>{}),this.chatMessages=[{role:"assistant",content:`This is a **private session**. Nothing will be saved to memory or logs.

This session self-destructs when you close it or in **24 hours** — whichever comes first.`,timestamp:Date.now()}],this.requestUpdate()}),this.showToast("Private session created — 24h countdown started","info",3e3)}async _destroyPrivateSession(e){const t=new Map(this.privateSessions);if(t.delete(e),this.privateSessions=t,this._persistPrivateSessions(),this.sessionKey===e){this.chatPrivateMode=!1;const n=this.settings.openTabs.filter(a=>a!==e),s=n[0]||Q;this.applySettings({...this.settings,openTabs:n,sessionKey:s,lastActiveSessionKey:s}),this.sessionKey=s,(await E(async()=>{const{loadChatHistory:a}=await Promise.resolve().then(()=>Ye);return{loadChatHistory:a}},void 0,import.meta.url)).loadChatHistory(this)}else this.applySettings({...this.settings,openTabs:this.settings.openTabs.filter(n=>n!==e)});this.client&&this.connected&&(this.client.request("session.setPrivate",{sessionKey:e,enabled:!1}).catch(()=>{}),this.client.request("sessions.delete",{key:e,deleteTranscript:!0}).catch(()=>{})),this.privateSessions.size===0&&this._stopPrivateSessionTimer()}_persistPrivateSessions(){const e=Array.from(this.privateSessions.entries());e.length===0?localStorage.removeItem("godmode.privateSessions"):localStorage.setItem("godmode.privateSessions",JSON.stringify(e))}_restorePrivateSessions(){try{const e=localStorage.getItem("godmode.privateSessions");if(!e)return;const t=JSON.parse(e),n=Date.now(),s=t.filter(([,a])=>a>n);if(this.privateSessions=new Map(s),s.length!==t.length){const a=t.filter(([,i])=>i<=n);for(const[i]of a)this._destroyPrivateSession(i)}this.privateSessions.size>0&&(this.privateSessions.has(this.sessionKey)&&(this.chatPrivateMode=!0),this._startPrivateSessionTimer()),this._persistPrivateSessions()}catch{localStorage.removeItem("godmode.privateSessions")}}_startPrivateSessionTimer(){this._privateSessionTimer||(this._privateSessionTimer=setInterval(()=>{const e=Date.now();for(const[t,n]of this.privateSessions)n<=e&&(this._destroyPrivateSession(t),this.showToast("Private session expired and was destroyed","info",3e3));this.privateSessions.size>0&&this.requestUpdate()},3e4))}_stopPrivateSessionTimer(){this._privateSessionTimer&&(clearInterval(this._privateSessionTimer),this._privateSessionTimer=null)}async handleBriefSave(e){if(!this.client||!this.connected)return;const t=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.update",{date:t,content:e}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(n){console.error("[DailyBrief] Save error:",n),this.showToast("Failed to save brief","error")}}async handleBriefToggleCheckbox(e,t){if(!this.client||!this.connected)return;const n=this.dailyBrief?.date||this.todaySelectedDate;try{await this.client.request("dailyBrief.toggleCheckbox",{date:n,index:e,checked:t}),this.dailyBrief&&(this.dailyBrief={...this.dailyBrief,updatedAt:new Date().toISOString()})}catch(s){console.error("[DailyBrief] Checkbox toggle error:",s),this.showToast("Failed to toggle checkbox","error")}}async handleWorkRefresh(){await Promise.all([yu(this),bu(this)])}async handleResourcePin(e,t){await ib(this,e,t)}async handleResourceDelete(e){await ob(this,e)}handleResourceFilterChange(e){this.workResourceFilter=e}handleResourceClick(e){e.path?this.handleWorkFileClick(e.path):e.url&&window.open(e.url,"_blank","noopener,noreferrer")}handleWorkToggleProject(e){const t=new Set(this.workExpandedProjects);t.has(e)?t.delete(e):(t.add(e),this.workProjectFiles[e]||ab(this,e)),this.workExpandedProjects=t}async handleWorkFileClick(e){if(!this.client||!this.connected){this.showToast("Not connected to gateway","error");return}try{const t=await this.client.request("workspaces.readFile",{path:e});if(!t.content){this.showToast(t.error??"Failed to read file","error");return}this.handleOpenSidebar(t.content,{mimeType:t.contentType??t.mime??this.inferMimeTypeFromPath(e),filePath:t.path??e,title:this.sidebarTitleForPath(e)})}catch(t){console.error("[Work] Failed to read file:",t),this.showToast(`Failed to open: ${e}`,"error")}}handleWorkSkillClick(e,t){this.handleStartChatWithPrompt(`Tell me about the "${e}" skill and how it's used in the ${t} project.`)}handlePeopleImport(e){const t=e==="apple"?"Import my contacts from Apple Contacts and organize them into categories.":"Import my contacts from Google Contacts and organize them into categories.";this.handleStartChatWithPrompt(t)}async handleWorkspacesRefresh(){await da(this)}async handleWorkspaceBrowse(e){if(!this.selectedWorkspace)return;const{browseWorkspaceFolder:t}=await E(async()=>{const{browseWorkspaceFolder:s}=await Promise.resolve().then(()=>he);return{browseWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&(this.workspaceBrowsePath=e,this.workspaceBrowseEntries=n.entries,this.workspaceBreadcrumbs=n.breadcrumbs)}async handleWorkspaceBrowseSearch(e){if(this.workspaceBrowseSearchQuery=e,!e.trim()||!this.selectedWorkspace){this.workspaceBrowseSearchResults=null;return}const{searchWorkspaceFiles:t}=await E(async()=>{const{searchWorkspaceFiles:n}=await Promise.resolve().then(()=>he);return{searchWorkspaceFiles:n}},void 0,import.meta.url);this.workspaceBrowseSearchResults=await t(this,this.selectedWorkspace.id,e)}handleWorkspaceBrowseBack(){this.workspaceBrowsePath=null,this.workspaceBrowseEntries=null,this.workspaceBreadcrumbs=null,this.workspaceBrowseSearchQuery="",this.workspaceBrowseSearchResults=null}async handleWorkspaceCreateFolder(e){if(!this.selectedWorkspace)return;const{createWorkspaceFolder:t}=await E(async()=>{const{createWorkspaceFolder:s}=await Promise.resolve().then(()=>he);return{createWorkspaceFolder:s}},void 0,import.meta.url),n=await t(this,this.selectedWorkspace.id,e);n&&this.workspaceBrowsePath&&await this.handleWorkspaceBrowse(this.workspaceBrowsePath),n&&this.showToast("Folder created","success",2e3)}handleOnboardingStart(){this.onboardingPhase=1,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:1}),this.client?.request("onboarding.update",{phase:1,completePhase:0})}async handleOnboardingIdentitySubmit(e){if(this.client)try{await this.client.request("onboarding.update",{phase:2,completePhase:1,identity:e}),this.onboardingPhase=2,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:2,identity:e}),this.userName=e.name,this.userAvatar=e.emoji,this.applySettings({...this.settings,userName:e.name,userAvatar:e.emoji}),this.setTab("chat"),E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>it);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this);const n=`I just set up my GodMode identity. My name is ${e.name}${e.mission?` and my mission is: ${e.mission}`:""}. Let's set up my workspace.`;this.chatMessage=n,this.handleSendChat(n)})}catch(t){console.error("[Onboarding] Identity submit failed:",t),this.showToast("Failed to save identity","error")}}handleOnboardingSkipPhase(){if(!this.client)return;const e=Math.min(this.onboardingPhase+1,6);this.onboardingPhase=e,this.client.request("onboarding.update",{phase:e,completePhase:this.onboardingPhase})}handleOnboardingComplete(){this.onboardingActive=!1,this.onboardingPhase=6,this.onboardingData&&(this.onboardingData={...this.onboardingData,phase:6,completedAt:new Date().toISOString()}),this.client?.request("onboarding.complete",{summary:this.onboardingData?.summary??null}),this.showToast("Welcome to GodMode!","success",4e3)}handleStartChatWithPrompt(e){this.setTab("chat"),E(async()=>{const{createNewSession:t}=await Promise.resolve().then(()=>it);return{createNewSession:t}},void 0,import.meta.url).then(({createNewSession:t})=>{t(this),this.chatMessage=e,this.requestUpdate()})}handleOpenSupportChat(){const e="agent:main:support";if(this.sessionKey===e){this.setTab("chat");return}E(async()=>{const{saveDraft:s}=await Promise.resolve().then(()=>Ga);return{saveDraft:s}},void 0,import.meta.url).then(({saveDraft:s})=>s(this));const n=this.settings.openTabs.includes(e)?this.settings.openTabs:[...this.settings.openTabs,e];this.applySettings({...this.settings,openTabs:n,sessionKey:e,lastActiveSessionKey:e,tabLastViewed:{...this.settings.tabLastViewed,[e]:Date.now()}}),this.sessionKey=e,this.setTab("chat"),this.chatMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.resetToolStream(),this.resetChatScroll(),this.loadAssistantIdentity(),E(async()=>{const{autoTitleCache:s}=await Promise.resolve().then(()=>Rn);return{autoTitleCache:s}},void 0,import.meta.url).then(({autoTitleCache:s})=>{s.set(e,"Support")}),E(async()=>{const{loadChatHistory:s}=await Promise.resolve().then(()=>Ye);return{loadChatHistory:s}},void 0,import.meta.url).then(({loadChatHistory:s})=>{s(this).then(()=>{this.chatMessages.length===0&&this.sessionKey===e&&(this.chatMessages=[{role:"assistant",content:`**Welcome to GodMode Support**

I have full access to your system diagnostics and GodMode knowledge base. I can help with:

- Troubleshooting issues
- Feature questions and configuration
- Setup guidance
- Escalation to the team if needed

What can I help you with?`,timestamp:Date.now()}],this.requestUpdate())}).catch(a=>{console.error("[Support] Failed to load chat history:",a)})})}handleWizardOpen(){E(async()=>{const{emptyWizardState:e}=await Promise.resolve().then(()=>DS);return{emptyWizardState:e}},void 0,import.meta.url).then(({emptyWizardState:e})=>{this.wizardState=e(),this.wizardActive=!0,this.requestUpdate()})}handleWizardClose(){this.wizardActive=!1,this.wizardState=null,this.requestUpdate()}handleWizardStepChange(e){this.wizardState&&(this.wizardState={...this.wizardState,step:e},this.requestUpdate())}handleWizardAnswerChange(e,t){this.wizardState&&(this.wizardState={...this.wizardState,answers:{...this.wizardState.answers,[e]:t}},this.requestUpdate())}async handleWizardPreview(){if(!(!this.client||!this.wizardState))try{const[e,t]=await Promise.all([this.client.request("onboarding.wizard.preview",this.wizardState.answers),this.client.request("onboarding.wizard.diff",this.wizardState.answers).catch(()=>null)]),n={};for(const a of e.files??[])n[a.path]=a.wouldCreate;const s={};if(t){for(const a of t.additions)s[a.path]=!0;for(const a of t.changes)s[a.path]=!1}this.wizardState={...this.wizardState,preview:e.files??[],diff:t,fileSelections:n,configSelections:s},this.requestUpdate()}catch(e){console.error("[Wizard] Preview failed:",e)}}handleWizardFileToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,fileSelections:{...this.wizardState.fileSelections,[e]:t}},this.requestUpdate())}handleWizardConfigToggle(e,t){this.wizardState&&(this.wizardState={...this.wizardState,configSelections:{...this.wizardState.configSelections,[e]:t}},this.requestUpdate())}async handleWizardGenerate(){if(!this.client||!this.wizardState)return;this.wizardState={...this.wizardState,generating:!0,error:null},this.requestUpdate();const e=[];for(const[n,s]of Object.entries(this.wizardState.fileSelections))s||e.push(n);const t=[];for(const[n,s]of Object.entries(this.wizardState.configSelections))s||t.push(n);try{const n=await this.client.request("onboarding.wizard.generate",{...this.wizardState.answers,skipFiles:e,skipKeys:t});this.wizardState={...this.wizardState,generating:!1,step:9,result:{filesCreated:n.filesCreated,filesSkipped:n.filesSkipped,configPatched:n.configPatched,workspacePath:n.workspacePath}},this.requestUpdate(),this.showToast("Memory system generated!","success",4e3)}catch(n){const s=n instanceof Error?n.message:"Failed to generate workspace";this.wizardState={...this.wizardState,generating:!1,error:s},this.requestUpdate(),this.showToast(s,"error")}}async handleQuickSetup(e){E(()=>import("./setup-CWjMtnE4.js"),[],import.meta.url).then(async({quickSetup:t})=>{await t(this,e)&&(this.setTab("chat"),E(async()=>{const{loadCapabilities:s}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:s}},[],import.meta.url).then(({loadCapabilities:s})=>s(this)))})}handleLoadCapabilities(){E(async()=>{const{loadCapabilities:e}=await import("./setup-CWjMtnE4.js");return{loadCapabilities:e}},[],import.meta.url).then(({loadCapabilities:e})=>e(this))}handleCapabilityAction(e){E(async()=>{const{capabilityAction:t}=await import("./setup-CWjMtnE4.js");return{capabilityAction:t}},[],import.meta.url).then(({capabilityAction:t})=>t(this,e))}handleHideSetup(){E(async()=>{const{hideSetup:e}=await import("./setup-CWjMtnE4.js");return{hideSetup:e}},[],import.meta.url).then(({hideSetup:e})=>e(this))}handleRunAssessment(){this.client&&this.client.request("onboarding.assess",{}).then(()=>{this.handleLoadCapabilities()})}handleUpdateUserProfile(e,t){const n=e.trim().slice(0,50),s=t.trim();this.userName=n||"You",this.userAvatar=s||null,this.applySettings({...this.settings,userName:n,userAvatar:s})}async handleLoadIntegrations(){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadIntegrations(this)}handleExpandCard(e){E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.expandCard(this,e))}async handleLoadGuide(e){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).loadGuide(this,e)}async handleTestIntegration(e){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).testIntegration(this,e)}async handleConfigureIntegration(e,t){await(await E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url)).configureIntegration(this,e,t)}handleUpdateConfigValue(e,t){this.onboardingConfigValues={...this.onboardingConfigValues,[e]:t}}handleSkipIntegration(e){E(()=>import("./onboarding-setup-eq3R6nNk.js"),[],import.meta.url).then(t=>t.skipIntegration(this,e))}async handleMarkOnboardingComplete(){if(!(!this.client||!this.connected))try{await this.client.request("onboarding.complete",{}),this.godmodeOptions&&(this.godmodeOptions={...this.godmodeOptions,"onboarding.complete":!0}),this.showSetupTab=!1,this.setTab("chat")}catch(e){console.error("[onboarding] Failed to mark complete:",e)}}async handleInboxRefresh(){if(!(!this.client||!this.connected)){this.inboxLoading=!0;try{const e=await this.client.request("inbox.list",{status:"pending",limit:50});this.inboxItems=e.items,this.inboxCount=e.pendingCount}catch(e){console.error("[Inbox] Failed to load:",e)}finally{this.inboxLoading=!1}}}async handleInboxScore(e,t,n){if(!(!this.client||!this.connected))try{await this.client.request("inbox.score",{itemId:e,score:t,feedback:n}),this.inboxScoringId=null,this.inboxScoringValue=void 0,this.inboxFeedbackText=void 0,await this.handleInboxRefresh()}catch(s){console.error("[Inbox] Score failed:",s)}}async handleInboxDismiss(e){if(!(!this.client||!this.connected))try{await this.client.request("inbox.dismiss",{itemId:e}),await this.handleInboxRefresh()}catch(t){console.error("[Inbox] Dismiss failed:",t)}}async handleInboxMarkAll(){if(!(!this.client||!this.connected))try{await this.client.request("inbox.markAllComplete",{}),await this.handleInboxRefresh()}catch(e){console.error("[Inbox] Mark all failed:",e)}}async handleInboxViewOutput(e){const t=this.inboxItems?.find(n=>n.id===e);if(t){if(t.proofDocSlug){this.handleOpenProofDoc(t.proofDocSlug);return}if(t.outputPath&&this.client)try{const n=await this.client.request("files.read",{path:t.outputPath,maxSize:5e5});n?.content&&this.handleOpenSidebar(n.content,{mimeType:"text/markdown",filePath:t.outputPath,title:t.title})}catch(n){console.error("[Inbox] Failed to load output:",n)}}}handleInboxOpenChat(e){const t=this.inboxItems?.find(n=>n.id===e);if(t?.source.taskId){this.handleMissionControlOpenTaskSession(t.source.taskId);return}t?.sessionId&&(this.setSessionKey(t.sessionId),this.setTab("chat"))}handleInboxSetScoring(e,t){this.inboxScoringId=e,this.inboxScoringValue=t??7,this.inboxFeedbackText=""}handleInboxFeedbackChange(e){this.inboxFeedbackText=e}async handleOpenProofDoc(e){let t="Proof Document",n=null,s=`http://127.0.0.1:4000/documents/${e}/view`;if(this.client&&this.connected)try{const a=await this.client.request("proof.get",{slug:e});t=a.title?.trim()||t,n=a.filePath?.trim()||null,s=a.viewUrl?.trim()||s}catch(a){console.warn("[Proof] Failed to resolve document metadata:",a)}this.sidebarOpen=!0,this.sidebarMode="proof",this.sidebarProofSlug=e,this.sidebarProofUrl=s,this.sidebarFilePath=n,this.sidebarTitle=t}handleCloseProofDoc(){this.sidebarMode="resource",this.sidebarProofSlug=null,this.sidebarProofUrl=null,this.handleCloseSidebar()}render(){return I2(this)}};b([w()],y.prototype,"settings",2);b([w()],y.prototype,"password",2);b([w()],y.prototype,"tab",2);b([w()],y.prototype,"onboarding",2);b([w()],y.prototype,"connected",2);b([w()],y.prototype,"reconnecting",2);b([w()],y.prototype,"reconnectAttempt",2);b([w()],y.prototype,"theme",2);b([w()],y.prototype,"themeResolved",2);b([w()],y.prototype,"hello",2);b([w()],y.prototype,"lastError",2);b([w()],y.prototype,"eventLog",2);b([w()],y.prototype,"assistantName",2);b([w()],y.prototype,"assistantAvatar",2);b([w()],y.prototype,"assistantAgentId",2);b([w()],y.prototype,"userName",2);b([w()],y.prototype,"userAvatar",2);b([w()],y.prototype,"sessionKey",2);b([w()],y.prototype,"sessionPickerOpen",2);b([w()],y.prototype,"sessionPickerPosition",2);b([w()],y.prototype,"sessionPickerSearch",2);b([w()],y.prototype,"sessionSearchOpen",2);b([w()],y.prototype,"sessionSearchPosition",2);b([w()],y.prototype,"sessionSearchQuery",2);b([w()],y.prototype,"sessionSearchResults",2);b([w()],y.prototype,"sessionSearchLoading",2);b([w()],y.prototype,"profilePopoverOpen",2);b([w()],y.prototype,"profileEditName",2);b([w()],y.prototype,"profileEditAvatar",2);b([w()],y.prototype,"editingTabKey",2);b([w()],y.prototype,"chatLoading",2);b([w()],y.prototype,"chatSending",2);b([w()],y.prototype,"chatSendingSessionKey",2);b([w()],y.prototype,"chatMessage",2);b([w()],y.prototype,"chatDrafts",2);b([w()],y.prototype,"chatMessages",2);b([w()],y.prototype,"chatToolMessages",2);b([w()],y.prototype,"chatStream",2);b([w()],y.prototype,"chatStreamStartedAt",2);b([w()],y.prototype,"chatRunId",2);b([w()],y.prototype,"currentToolName",2);b([w()],y.prototype,"currentToolInfo",2);b([w()],y.prototype,"workingSessions",2);b([w()],y.prototype,"compactionStatus",2);b([w()],y.prototype,"chatAvatarUrl",2);b([w()],y.prototype,"chatThinkingLevel",2);b([w()],y.prototype,"chatQueue",2);b([w()],y.prototype,"chatAttachments",2);b([w()],y.prototype,"pendingRetry",2);b([w()],y.prototype,"autoRetryAfterCompact",2);b([w()],y.prototype,"sidebarOpen",2);b([w()],y.prototype,"sidebarContent",2);b([w()],y.prototype,"sidebarError",2);b([w()],y.prototype,"sidebarMimeType",2);b([w()],y.prototype,"sidebarFilePath",2);b([w()],y.prototype,"sidebarTitle",2);b([w()],y.prototype,"sidebarMode",2);b([w()],y.prototype,"sidebarProofSlug",2);b([w()],y.prototype,"sidebarProofUrl",2);b([w()],y.prototype,"splitRatio",2);b([w()],y.prototype,"lightbox",2);b([w()],y.prototype,"driveAccounts",2);b([w()],y.prototype,"showDrivePicker",2);b([w()],y.prototype,"driveUploading",2);b([w()],y.prototype,"updateStatus",2);b([w()],y.prototype,"updateLoading",2);b([w()],y.prototype,"updateError",2);b([w()],y.prototype,"updateLastChecked",2);b([w()],y.prototype,"nodesLoading",2);b([w()],y.prototype,"nodes",2);b([w()],y.prototype,"devicesLoading",2);b([w()],y.prototype,"devicesError",2);b([w()],y.prototype,"devicesList",2);b([w()],y.prototype,"execApprovalsLoading",2);b([w()],y.prototype,"execApprovalsSaving",2);b([w()],y.prototype,"execApprovalsDirty",2);b([w()],y.prototype,"execApprovalsSnapshot",2);b([w()],y.prototype,"execApprovalsForm",2);b([w()],y.prototype,"execApprovalsSelectedAgent",2);b([w()],y.prototype,"execApprovalsTarget",2);b([w()],y.prototype,"execApprovalsTargetNodeId",2);b([w()],y.prototype,"execApprovalQueue",2);b([w()],y.prototype,"execApprovalBusy",2);b([w()],y.prototype,"execApprovalError",2);b([w()],y.prototype,"pendingGatewayUrl",2);b([w()],y.prototype,"gatewayRestartPending",2);b([w()],y.prototype,"gatewayRestartBusy",2);b([w()],y.prototype,"configLoading",2);b([w()],y.prototype,"configRaw",2);b([w()],y.prototype,"configRawOriginal",2);b([w()],y.prototype,"configValid",2);b([w()],y.prototype,"configIssues",2);b([w()],y.prototype,"configSaving",2);b([w()],y.prototype,"configApplying",2);b([w()],y.prototype,"updateRunning",2);b([w()],y.prototype,"applySessionKey",2);b([w()],y.prototype,"configSnapshot",2);b([w()],y.prototype,"configSchema",2);b([w()],y.prototype,"configSchemaVersion",2);b([w()],y.prototype,"configSchemaLoading",2);b([w()],y.prototype,"configUiHints",2);b([w()],y.prototype,"configForm",2);b([w()],y.prototype,"configFormOriginal",2);b([w()],y.prototype,"configFormDirty",2);b([w()],y.prototype,"configFormMode",2);b([w()],y.prototype,"configSearchQuery",2);b([w()],y.prototype,"configActiveSection",2);b([w()],y.prototype,"configActiveSubsection",2);b([w()],y.prototype,"channelsLoading",2);b([w()],y.prototype,"channelsSnapshot",2);b([w()],y.prototype,"channelsError",2);b([w()],y.prototype,"channelsLastSuccess",2);b([w()],y.prototype,"whatsappLoginMessage",2);b([w()],y.prototype,"whatsappLoginQrDataUrl",2);b([w()],y.prototype,"whatsappLoginConnected",2);b([w()],y.prototype,"whatsappBusy",2);b([w()],y.prototype,"nostrProfileFormState",2);b([w()],y.prototype,"nostrProfileAccountId",2);b([w()],y.prototype,"presenceLoading",2);b([w()],y.prototype,"presenceEntries",2);b([w()],y.prototype,"presenceError",2);b([w()],y.prototype,"presenceStatus",2);b([w()],y.prototype,"agentsLoading",2);b([w()],y.prototype,"agentsList",2);b([w()],y.prototype,"agentsError",2);b([w()],y.prototype,"sessionsLoading",2);b([w()],y.prototype,"sessionsResult",2);b([w()],y.prototype,"sessionsError",2);b([w()],y.prototype,"sessionsFilterActive",2);b([w()],y.prototype,"sessionsFilterLimit",2);b([w()],y.prototype,"sessionsIncludeGlobal",2);b([w()],y.prototype,"sessionsIncludeUnknown",2);b([w()],y.prototype,"archivedSessions",2);b([w()],y.prototype,"archivedSessionsLoading",2);b([w()],y.prototype,"archivedSessionsExpanded",2);b([w()],y.prototype,"cronLoading",2);b([w()],y.prototype,"cronJobs",2);b([w()],y.prototype,"cronStatus",2);b([w()],y.prototype,"cronError",2);b([w()],y.prototype,"cronForm",2);b([w()],y.prototype,"cronRunsJobId",2);b([w()],y.prototype,"cronRuns",2);b([w()],y.prototype,"cronBusy",2);b([w()],y.prototype,"workspaceNeedsSetup",2);b([w()],y.prototype,"onboardingPhase",2);b([w()],y.prototype,"onboardingData",2);b([w()],y.prototype,"onboardingActive",2);b([w()],y.prototype,"wizardActive",2);b([w()],y.prototype,"wizardState",2);b([w()],y.prototype,"showSetupTab",2);b([w()],y.prototype,"setupCapabilities",2);b([w()],y.prototype,"setupCapabilitiesLoading",2);b([w()],y.prototype,"setupQuickDone",2);b([w()],y.prototype,"onboardingIntegrations",2);b([w()],y.prototype,"onboardingCoreProgress",2);b([w()],y.prototype,"onboardingExpandedCard",2);b([w()],y.prototype,"onboardingLoadingGuide",2);b([w()],y.prototype,"onboardingActiveGuide",2);b([w()],y.prototype,"onboardingTestingId",2);b([w()],y.prototype,"onboardingTestResult",2);b([w()],y.prototype,"onboardingConfigValues",2);b([w()],y.prototype,"onboardingProgress",2);b([w()],y.prototype,"workspaces",2);b([w()],y.prototype,"selectedWorkspace",2);b([w()],y.prototype,"workspacesSearchQuery",2);b([w()],y.prototype,"workspaceItemSearchQuery",2);b([w()],y.prototype,"workspacesLoading",2);b([w()],y.prototype,"workspacesCreateLoading",2);b([w()],y.prototype,"workspacesError",2);b([w()],y.prototype,"workspaceExpandedFolders",2);b([w()],y.prototype,"allTasks",2);b([w()],y.prototype,"taskFilter",2);b([w()],y.prototype,"taskSort",2);b([w()],y.prototype,"taskSearch",2);b([w()],y.prototype,"showCompletedTasks",2);b([w()],y.prototype,"editingTaskId",2);b([w()],y.prototype,"workspaceBrowsePath",2);b([w()],y.prototype,"workspaceBrowseEntries",2);b([w()],y.prototype,"workspaceBreadcrumbs",2);b([w()],y.prototype,"workspaceBrowseSearchQuery",2);b([w()],y.prototype,"workspaceBrowseSearchResults",2);b([w()],y.prototype,"myDayLoading",2);b([w()],y.prototype,"myDayError",2);b([w()],y.prototype,"todaySelectedDate",2);b([w()],y.prototype,"todayViewMode",2);b([w()],y.prototype,"dailyBrief",2);b([w()],y.prototype,"dailyBriefLoading",2);b([w()],y.prototype,"dailyBriefError",2);b([w()],y.prototype,"agentLog",2);b([w()],y.prototype,"agentLogLoading",2);b([w()],y.prototype,"agentLogError",2);b([w()],y.prototype,"briefNotes",2);b([w()],y.prototype,"todayTasks",2);b([w()],y.prototype,"todayTasksLoading",2);b([w()],y.prototype,"todayEditingTaskId",2);b([w()],y.prototype,"todayShowCompleted",2);b([w()],y.prototype,"allyPanelOpen",2);b([w()],y.prototype,"allyMessages",2);b([w()],y.prototype,"allyStream",2);b([w()],y.prototype,"allyDraft",2);b([w()],y.prototype,"allyUnread",2);b([w()],y.prototype,"allySending",2);b([w()],y.prototype,"allyWorking",2);b([w()],y.prototype,"allyAttachments",2);b([w()],y.prototype,"todayQueueResults",2);b([w()],y.prototype,"inboxItems",2);b([w()],y.prototype,"inboxLoading",2);b([w()],y.prototype,"inboxCount",2);b([w()],y.prototype,"inboxScoringId",2);b([w()],y.prototype,"inboxScoringValue",2);b([w()],y.prototype,"inboxFeedbackText",2);b([w()],y.prototype,"chatPrivateMode",2);b([w()],y.prototype,"privateSessions",2);b([w()],y.prototype,"dynamicSlots",2);b([w()],y.prototype,"workProjects",2);b([w()],y.prototype,"workLoading",2);b([w()],y.prototype,"workError",2);b([w()],y.prototype,"workExpandedProjects",2);b([w()],y.prototype,"workProjectFiles",2);b([w()],y.prototype,"workDetailLoading",2);b([w()],y.prototype,"workResources",2);b([w()],y.prototype,"workResourcesLoading",2);b([w()],y.prototype,"workResourceFilter",2);b([w()],y.prototype,"skillsLoading",2);b([w()],y.prototype,"skillsReport",2);b([w()],y.prototype,"skillsError",2);b([w()],y.prototype,"skillsFilter",2);b([w()],y.prototype,"skillEdits",2);b([w()],y.prototype,"skillsBusyKey",2);b([w()],y.prototype,"skillMessages",2);b([w()],y.prototype,"skillsSubTab",2);b([w()],y.prototype,"godmodeSkills",2);b([w()],y.prototype,"godmodeSkillsLoading",2);b([w()],y.prototype,"expandedSkills",2);b([w()],y.prototype,"rosterData",2);b([w()],y.prototype,"rosterLoading",2);b([w()],y.prototype,"rosterError",2);b([w()],y.prototype,"rosterFilter",2);b([w()],y.prototype,"expandedAgents",2);b([w()],y.prototype,"debugLoading",2);b([w()],y.prototype,"debugStatus",2);b([w()],y.prototype,"debugHealth",2);b([w()],y.prototype,"debugModels",2);b([w()],y.prototype,"debugHeartbeat",2);b([w()],y.prototype,"debugCallMethod",2);b([w()],y.prototype,"debugCallParams",2);b([w()],y.prototype,"debugCallResult",2);b([w()],y.prototype,"debugCallError",2);b([w()],y.prototype,"logsLoading",2);b([w()],y.prototype,"logsError",2);b([w()],y.prototype,"logsFile",2);b([w()],y.prototype,"logsEntries",2);b([w()],y.prototype,"logsFilterText",2);b([w()],y.prototype,"logsLevelFilters",2);b([w()],y.prototype,"logsAutoFollow",2);b([w()],y.prototype,"logsTruncated",2);b([w()],y.prototype,"logsCursor",2);b([w()],y.prototype,"logsLastFetchAt",2);b([w()],y.prototype,"logsLimit",2);b([w()],y.prototype,"logsMaxBytes",2);b([w()],y.prototype,"logsAtBottom",2);b([w()],y.prototype,"toasts",2);b([w()],y.prototype,"chatUserNearBottom",2);b([w()],y.prototype,"chatNewMessagesBelow",2);b([w()],y.prototype,"consciousnessStatus",2);b([w()],y.prototype,"focusPulseData",2);b([w()],y.prototype,"trustTrackerData",2);b([w()],y.prototype,"trustTrackerLoading",2);b([w()],y.prototype,"guardrailsData",2);b([w()],y.prototype,"guardrailsLoading",2);b([w()],y.prototype,"guardrailsShowAddForm",2);b([w()],y.prototype,"missionControlData",2);b([w()],y.prototype,"missionControlLoading",2);b([w()],y.prototype,"missionControlError",2);b([w()],y.prototype,"missionControlFullControl",2);b([w()],y.prototype,"godmodeOptions",2);b([w()],y.prototype,"godmodeOptionsLoading",2);b([w()],y.prototype,"dashboardsList",2);b([w()],y.prototype,"dashboardsLoading",2);b([w()],y.prototype,"dashboardsError",2);b([w()],y.prototype,"activeDashboardId",2);b([w()],y.prototype,"activeDashboardHtml",2);b([w()],y.prototype,"activeDashboardManifest",2);b([w()],y.prototype,"dashboardChatOpen",2);b([w()],y.prototype,"dashboardCategoryFilter",2);b([w()],y.prototype,"secondBrainSubtab",2);b([w()],y.prototype,"secondBrainLoading",2);b([w()],y.prototype,"secondBrainError",2);b([w()],y.prototype,"secondBrainIdentity",2);b([w()],y.prototype,"secondBrainMemoryBank",2);b([w()],y.prototype,"secondBrainAiPacket",2);b([w()],y.prototype,"secondBrainSourcesData",2);b([w()],y.prototype,"secondBrainResearchData",2);b([w()],y.prototype,"secondBrainResearchAddFormOpen",2);b([w()],y.prototype,"secondBrainResearchAddForm",2);b([w()],y.prototype,"secondBrainResearchCategories",2);b([w()],y.prototype,"secondBrainSelectedEntry",2);b([w()],y.prototype,"secondBrainSearchQuery",2);b([w()],y.prototype,"secondBrainSyncing",2);b([w()],y.prototype,"secondBrainBrowsingFolder",2);b([w()],y.prototype,"secondBrainFolderEntries",2);b([w()],y.prototype,"secondBrainFolderName",2);b([w()],y.prototype,"secondBrainFileTree",2);b([w()],y.prototype,"secondBrainFileTreeLoading",2);b([w()],y.prototype,"secondBrainFileSearchQuery",2);b([w()],y.prototype,"secondBrainFileSearchResults",2);y=b([Ec("godmode-app")],y);
